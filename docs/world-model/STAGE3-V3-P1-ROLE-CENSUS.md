# Stage III V3-P1 — The Role-Conditioned Census

Status: **PRE-REGISTERED 2026-07-30, FROZEN before the run.** Authorized by
**ruling #79.3** (V3-P0 accepted — R3 clear, the map rich; V3-P1 the
role-conditioned census drafting authorized). It reuses **P1R's fork-and-force
instrument VERBATIM** (the seam forked at the executor READ, the 18-candidate
ball-local lattice, W = 3.0 s, the two faces H 6/10 s, the signed outcome, the
exception classes, X1–X7 with the derived X6), re-keying each priced approach on
the **TRUE role of the FORCED BODY** per the v3 contract §2. It **prices
approaches under #41.2 only**; it authorizes nothing downstream. NO build, NO
run — this freeze returns to the commander (#79.3: freeze → review → build → the
resident runs, #49.5).

Authority:
[`STAGE3-V3-ROLE-EYE.md`](STAGE3-V3-ROLE-EYE.md) §2 (the ROLE axis — `context ×
ROLE × candidate`, role ∈ {DF, MF, WG, ST} read from the formation machinery,
the going axis OUT #77.2(ii)), §3 (the invariants I1–I11 — esp. I2/I8 role =
own state, I3 role is a property of the SAMPLED body, I6 enriched full bundle,
I7 sizing-before-floors, I11 the perceptionPrice fix lands at V3-P2 not here),
§4 (V3-P1's scope + the pre-named half-1 hypothesis) ·
[`STAGE3-V3-P0-ROLE-MAP.md`](STAGE3-V3-P0-ROLE-MAP.md) §9 +
`data/stage3-v3-p0-role-map.json` (the MEASURED base rates, coverage and
budget the floors and in-power set derive from) ·
[`STAGE3-P1R-APPROACH-CENSUS.md`](STAGE3-P1R-APPROACH-CENSUS.md) (the instrument
reused verbatim) ·
[`STAGE3-V2-P1-ANTICIPATORY-CENSUS.md`](STAGE3-V2-P1-ANTICIPATORY-CENSUS.md)
(the most recent harness incarnation — the same P1R fork-and-force minus the
OTHERS-GOING machinery, which is OUT #77.2(ii)) · **#79.3** (this drafting
authority; the reuse-vs-fresh block decision; #46.2 applies to the sizing smoke
only; the pre-named contrast) · **#78** (the load-bearing rule ratified: ≥2
roles per context at ≥150) · **#77** (launch; the pre-named hypothesis) · #24
(the attainable-population floor, published ex ante) · #44.5/#65 (sizing before
floors) · #46.2 (smoke disjointness) · #48.4 (windows pinned) · #49.3 (receipts
+ E-INJURY) · #49.5 (the resident supervises the run) · #38.1 (full sign space
+ E-INJURY) · #20 (CI / cluster / winner's-curse semantics) · #32.1 (per-record
fidelity) · #26.5 (state HEAD + flags) · #67.3 (the enriched full bundle) ·
#41.2 (approach semantics) · Road B (nothing ships).

Parents reused unamended: P1R §2 (the seam, the lattice with its distance
dimension, W = 3.0 s, the 12 contexts, the face horizons, the positive control
`r21a180`, the SAT arm, the mediators), V2-P1 §2.1 (the P1R instrument as most
recently wired), STAGE3-V3-P0 §2 (the role axis frozen to the code's own
variable).

**World / HEAD.** Every arm runs the **ENRICHED** world (#67.3, the full
certified bundle): `edsPerceivedDefence`, `edsPerceivedChoice`, `edsValueAxis`,
`c5Hold`, **`c6Carry`**, **`c7Windup`** armed; `c5TouchFork` off. HEAD at freeze
= **`57e3c35`** (ruling #79); **`src/**` is byte-identical to V3-P0's HEAD
`49ba867`** (verified `git diff --stat 49ba867 HEAD -- src/` empty — the
intervening commits are the docs-only rulings #78/#79 and the V3-P0 result) — so
V3-P1 runs the SAME world V3-P0 mapped. Every production flag defaults OFF;
`c6Carry`/`c7Windup` default `false`; the enriched world is a probe-only
staging. Every run states its HEAD and its armed flags (#26.5). The
perceptionPrice serialization fix (#77.2(v)/I11) is **not** load-bearing here
(V3-P1's table is role-keyed on TRUE own-state, no percept exchange) and lands
at the V3-P2 build.

---

## 1. What V3-P1 is (and is not)

V3-P1 is **P1R's approach census, re-keyed on the ROLE of the forced body.** At
each sampled station-family moment it forks the deterministic world and forces
ONE body's station to each of the 18 ball-local candidates in turn (P1R
verbatim); each forced approach's signed two-face outcome then lands in a cell
keyed by

```text
(the 12 v1 contexts  ×  the TRUE ROLE of the FORCED BODY at the decision moment
                        ∈ {DF, MF, WG, ST})   ×   the candidate
```

so the table becomes **(context × role) → approach value per candidate**:
**48 context-role cells** (12 contexts × 4 roles) **× 18 candidates = 864
cell-candidate pairs** (vs P1R's 216; vs V2-P1's 432 — the going axis is OUT,
#77.2(ii)).

* **The role is a property of the SAMPLED BODY, not a per-candidate condition
  (I3).** Unlike V2-P1's OTHERS-GOING bit (which split each candidate two ways
  by a per-candidate read), the role axis is a **four-way partition of the
  moment population by the forced body's own role**. The sampled body has
  exactly ONE role, read from its immutable `role` field (V3-P0 §2.1;
  `src/sim/Player.ts:29`), so **each moment lands in exactly one `(context,
  role)` row** and forks all 18 candidates within it. Role is exact own-state:
  no percept issue, nothing authored, never re-mapped (contract I2/I8).
* **The forced approach is unchanged from P1R** (the steer to a ball-local
  candidate; #41.2 approach semantics); only the CELL a price lands in gains the
  role key. The census prices what the deployed eye will do — perpetually pick a
  target and approach — split by the role that will read the column.
* **The pre-named hypothesis (half 1, #77.3, verbatim):** *role-conditioned
  prices DIFFER by role* — the census can SEE division of labour. The primary
  contrast is the **value SPREAD across roles per (context, candidate)** (§4).
  The null (role does not separate prices) is a real finding that **kills v3
  cheaply, before the consumer is built** (contract §6).
* It **prices approaches under #41.2 only.** It **cannot authorize V3-P2**; no
  coach layer, no marking, no pressing triggers (contract §7 — FUTURE A4
  slices). The table is role-keyed on the TRUE role of the forced body, so **no
  percept question arises at census time** — the perception exchange a v3
  consumer would pay does not exist here (a body knows his own job; there is
  nothing for the ORACLE arm to compare, because there is no percept read in the
  key).

---

## 2. The frozen quantities (no re-cutting after sight — §7)

### 2.1 The instrument — P1R VERBATIM (as V2-P1 §2.1, minus the going machinery)

Reused with **no change**, from `STAGE3-P1R-APPROACH-CENSUS.md` §2 and the probe
`scripts/probes/stage3-v2-p1-anticipatory-census.ts` (the OTHERS-GOING bit,
R = 4.0 m read, and the PERCEIVED cross-check column are DROPPED, #77.2(ii); the
fork-and-force core is untouched):

* **The seam** `forcedStationPolicy` — ball-local, re-evaluated every tick, read
  at the executor **before the clamps** (#35.3 fork-the-READ). Null in every
  production path.
* **The 18-candidate ball-local lattice** `r ∈ {7,14,21} × {0,60,120,180,240,300}°`,
  **including its distance dimension** — a far candidate is a long approach and
  is **priced as one** (#41.2); **no reachability lattice filter** (P1R §2.1).
* **W = 3.0 s** (P1R §2.3: above P0's 1.466 s dwell mean, dominating the 2.66 s
  median travel, deliberately not the tail). `W_TICKS = round(3.0 / DT)`.
* **The two-face outcome** with face-specific horizons **`H_score = 6.0 s`,
  `H_concede = 10.0 s`**, read AT each horizon and never after (P1R §2.5): signed
  = ANY shot for (by H_score) − ANY shot against (by H_concede). A fork whose
  match ends inside the horizon is **excluded, not zeroed** (count reported).
* **The positive control `r21a180`** (21 m behind the ball); the **SAT
  saturation arm** and its ±0.05 band; the mediators `occupancy · ETA ·
  target-error` (reported, never gating).
* **The population — station-family ticks ONLY** (#40.4 item 2 / P1R §2.2 /
  V3-P0 §2/§9): a moment qualifies iff the sampled body's `action.type ∈
  {MoveToFormationSpot, HoldPosition, SupportBallCarrier, MakeRun,
  MarkOpponent}`; the ball-directed jobs `{ChaseBall, ReceivePass,
  InterceptPass}` and the carrier are excluded (forcing them abandons the ball).
  Body picked by the same **stable rotation, side-alternating, NEVER by role**
  (V3-P0 §3) — the role is read off whichever body the rotation lands on, so the
  four-way split arrives at natural rates. GK is never in the station family.

### 2.2 The role key — how `n` is counted, and the in-power set FROZEN from V3-P0

**Each census moment forks ALL 18 candidates** (one moment → 18 candidate forks
+ 1 control), so **the candidate axis does NOT divide the moment count** (V3-P0
§2.2). A `(context, role, candidate)` cell's `n` = the number of station-family
**moments** in `(context, role)`; the value estimate `value(context, role,
candidate)` uses *every* moment in `(context, role)` (all 18 candidates share
that moment set). Therefore:

* **The #24 floor binds on MOMENTS-PER-(context × role)** — exactly the quantity
  V3-P0 measured (§9.3). The floor is **150 moments per `(context × role)`
  cell** (#24; #78.2 ratified the load-bearing frontier ≥2 roles per context at
  ≥150).
* **The contrast's per-arm `n` IS the cell's moment count.** For the role SPREAD
  at a `(context, candidate)`, each role's arm draws on that role's `(context,
  role)` moment count — the candidate does not sub-divide it. A `(context)` is
  **contrast-computable** iff ≥ 2 of its roles clear 150 moments.

**The in-power set, taken EXACTLY from V3-P0's measured coverage (§9.3),
published ex ante:** of the 48 `(context × role)` cells, **45 are in-power
(≥150 moments), 3 are under-powered (<150)**. All three under-powered cells are
the thin role **DF** in the sparsest deep/crowded defensive contexts, named:

| under-powered `(context × role)` cell | measured n @388 (V3-P0 §9.3) | its 18 cell-candidate pairs |
| --- | ---: | --- |
| `ours \| theirThird \| crowded \|\| DF` | **33** (rarest cell overall) | 18 pairs — **UNDER-POWERED ex ante** |
| `theirs \| theirThird \| crowded \|\| DF` | **137** | 18 pairs — **UNDER-POWERED ex ante** |
| `theirs \| ownThird \| sparse \|\| DF` | **146** | 18 pairs — **UNDER-POWERED ex ante** |

So of the 864 cell-candidate pairs: **810 are expected IN-POWER** (45 in-power
cells × 18), **54 are published UNDER-POWERED ex ante** (the 3 DF cells × 18) —
**published, never pooled** (contract I7). No cell outside these three fell
under 150 in V3-P0 (`unexpectedUnderPowered = []`, §9.3), and
`theirs|ownThird|sparse||MF` corrected UP to 181 (§9.3) — it is in-power. The
in-power set is **known EXACTLY, not estimated**, because V3-P1 reuses V3-P0's
block (§2.3): the per-`(context × role)` moment counts V3-P1 collects are
identical to the counts V3-P0 measured.

**Contrast-computability by context (§4's primary).** Every one of the 12
contexts fields ≥ 3 in-power roles (V3-P0 §9.3, **R2 COVERAGE RICH confirmed**;
≥ 3 everywhere, 9 of 12 field all four), so the role spread is computable in **all
12 contexts × 18 candidates = 216 spread cells**. Of these: **162 are four-role
spreads** (the 9 fully-covered contexts × 18) and **54 are three-role spreads**
(the 3 DF-thinned contexts — `ours|theirThird|crowded`,
`theirs|theirThird|crowded`, `theirs|ownThird|sparse` — × 18, DF excluded, MF/WG/ST
only). The spread in the DF-thinned contexts reads **across in-power roles
only** (R1 partially fires at the cell level exactly as V3-P0 §9.3 pre-laid).

### 2.3 THE BLOCK DECISION (#79.3) — **REUSE 9,110,000 + k, k ∈ 0..387**

**Decision: V3-P1's census runs on the SAME frozen 388-match block V3-P0 mapped
— seeds `9,110,000 + k`, `k ∈ 0..387`.** A fresh block above 9.2 M is
**rejected**. The reasoning, and the peek question the commander flagged as the
executor's to justify:

**(1) Exactness, zero drift — the reuse gives strictly MORE honest coverage than
a fresh block.** V3-P1's per-`(context × role)` moment counts on 9.11 M are
**identical** to V3-P0's measured coverage on 9.11 M (same instrument, same
block, same station-family filter, same stable rotation, same enriched
world/HEAD `49ba867`-src). So the attainability table V3-P0 published (45
in-power cells, the 3 named DF cells under-powered) applies **EXACTLY** — the
in-power/under-powered partition is known with certainty ex ante, not estimated
with a headroom cushion. A fresh block would **re-introduce block-to-block
drift**: V3-P0 §9.5 already measured the binding rate drift 0.7733 → 0.768, and
the binding cell (`theirs|ownThird|sparse||ST`) landed at **298 moments = 1.99×
the 150 floor** — a hair under strict 2×. On a fresh block a bad draw could push
that already-marginal cell, or `theirs|ownThird|sparse||MF` (181), *below* 150,
**losing coverage V3-P0 promised and the commander accepted (#79.1)**. Reuse
guarantees the accepted coverage; a fresh block gambles it for nothing.

**(2) It is NOT a peek, because V3-P0 priced NOTHING.** #46.2 forbids **sizing a
floor on the seeds it is applied to** — the vice is a gate whose *pass* is
guaranteed by tuning the gate to that block's noise realization. Here the floor
(150) is **fixed by #24, not tuned to any block**; there is no free parameter to
game. What V3-P0's read of block 9.11 M gives V3-P1 is only **knowledge of which
cells clear the fixed floor** — a coverage count, and on the reused block a
*deterministic truth*, not a lucky draw. And the scientific output — the signed
approach VALUES — is computed **entirely fresh**: V3-P0 ran **no forks, no signed
outcome, no value** (V3-P0 §8, read-only, zero `src/**`). Reading a base RATE
(coverage, role shares, incumbent signatures) off a block and then computing an
independent VALUE on the same block is not "sizing a gate on the gated data" —
the two measurements are orthogonal (V3-P0's deliverables (i)/(ii)/(iii) feed
floors and the V3-P2 DEV baseline, never a V3-P1 gate). **No V3-P1 result is
contaminated by V3-P0 having read the block.**

**(3) #46.2's actual target was already discharged, on a DISJOINT block.** The
disjointness law's object is the **floor-SIZING step**, and V3-P0's sizing smoke
ran on the **disjoint 9.10 M block** (V3-P0 §3/§7), deriving the 388-match
budget applied to the disjoint 9.11 M census — exactly as #46.2 requires. #79.3
confirms **#46.2 applies to the sizing smoke only.** V3-P1 runs **no fresh
sizing smoke** (§3: V3-P0 IS the sizing), so there is no floor-sizing step on the
census block that could be contaminated — #46.2's "disjoint if run" is
vacuously satisfied.

**(4) The block is clean for pricing.** 9.11 M lies above every consumed/reserved
range (V3-P0 §7's disjointness walk); V3-P0 forked nothing on it, so no
continuation was perturbed and no value was banked — the block is a pristine
substrate for V3-P1's forks.

**The one residual, named honestly (no re-cut).** Reuse inherits V3-P0's exact
binding-cell power: `theirs|ownThird|sparse||ST` at **298 moments = 1.99×** the
150 floor, marginally under strict 2× — the 3-match strict-2× shortfall #79.1
**noted, not chased**. Reuse does not fix this (it is the accepted frozen
budget); it also does not worsen it (a fresh block could). The commander accepted
this budget at #79.1; V3-P1 spends it as frozen.

### 2.4 X6's floor — the P1R/V2-P1 FORMULA FORM (re-derivation rule frozen)

X6 is P1R §2.4 / V2-P1 §2.4 verbatim:

```text
X6   unexplained residual EXACTLY 0                    (the hard fidelity claim, #32.1 per-record)
     AND  ok / (ok + onside + barred + unexplained)  >=  X6_FLOOR
     X6_FLOOR = 1 − 2 × (census-measured enriched clamp share)   (the derivation RULE, frozen)
```

* The **hard half — `unexplained` EXACTLY 0 — is unconditional** (#32.1
  per-record, never a max-statistic / coupon-collector). P1R's reference floor is
  **0.84** (clamp share 8.08%); V2-P1 re-derived **0.8439** on this exact
  enriched world (clamp share 0.078062, §9.1) — the formula-form vindicated.
* The census **re-derives `X6_FLOOR` from its OWN measured enriched-world clamp
  share** and gates against that derived floor; **0.84 carried as the
  reference**. The clamp share is a property of the **lattice/onside**, not of
  the seam (P1R §2.4), so it is **reported separately** and deriving the fidelity
  floor from the run's own clamp share is **not a #46.2 power-floor peek** (it is
  a fidelity floor; the hard `unexplained = 0` is unconditional). No forked
  clamp-share sizing is run pre-freeze; the derivation FORMULA is frozen and the
  input is measured at the run (the V2-P1 §2.4/§8 convention, reviewed-and-passed
  at #69/#70).

### 2.5 Windows pinned (#48.4)

`W = 3.0 s` (advance + steer horizon), `H_score = 6.0 s`, `H_concede = 10.0 s`,
percept warm-up `15 ticks` (naturally satisfied — the sampled body has played
the whole live match ≫ 15 ticks before the decision moment; pinned and reported,
though the TRUE-keyed role table needs no warm-up), moment spacing `2.0 s`. All
frozen here; **none re-cut after sight (§7).** The OTHERS-GOING radius `R = 4.0 m`
is OUT (no going bit).

---

## 3. Sizing — **SKIPPED; V3-P0 IS the sizing (#44.5/#65 discharged)**

**No V3-P1 sizing smoke is run, and this is the correct disposition, not an
omission.** #44.5/#65 require sizing before floors; V3-P0 **is** that sizing,
performed to the full discipline: it measured (i) the four-way station-family
role split, (ii) the per-`(context × role)` coverage against the 150 floor, and
(iv) the binding-cell rate **with a cluster CI**, on a **disjoint** smoke block
(9.10 M) feeding the census block (9.11 M) — the #46.2-clean floor-sizing step.
Its result (§9) is the commander-accepted budget (#79.1). V3-P1 needs **no
quantity V3-P0 did not measure**:

* the **budget** (388 matches / ~31 k moments) is V3-P0's deliverable (iv), frozen;
* the **in-power set** is V3-P0's deliverable (ii), applied EXACTLY under the
  block reuse (§2.3);
* the only **run-time-measured** input is the enriched-world **clamp share** for
  `X6_FLOOR`, handled by the frozen derivation RULE (§2.4), measured on the
  census block itself — a fidelity floor, not a power floor, so it needs no
  disjoint smoke.

Since no sizing smoke is run, **#46.2's "disjoint if run" is vacuously satisfied**
(§2.3(3)). Per #79.3 this is the explicit skip: **the #44.5 obligation was
already discharged by V3-P0.**

**Frozen floors:**

* **Cell floor** — every load-bearing `(context × role)` cell ≥ **150 moments**
  (#24); binding at `theirs|ownThird|sparse||ST` (298 moments = 1.99× floor,
  V3-P0 §9.5). The 3 named DF cells (§2.2) are **published UNDER-POWERED, never
  pooled**.
* **Contrast floor (the spread, §4)** — a `(context, candidate)` spread is
  **IN-POWER** iff ≥ 2 of its roles clear the 150-moment cell floor; the spread
  is read across **in-power roles only**. All 12 contexts qualify (≥ 3 in-power
  roles each; the 3 DF-thinned contexts read a 3-role spread).
* **Census budget = 388 matches / ~31,095 moments / ~590 k forks** (V3-P0's
  frozen deliverable (iv); §6). The bare-150 lever (196 matches, V3-P0 §9.5) is
  **banked as history**, not elected.

---

## 4. The pre-named hypothesis, the primary spread statistic, and the full sign space

**The pre-named hypothesis (half 1, #77.3 verbatim):** *role-conditioned prices
DIFFER by role* — the census can SEE division of labour (e.g. the behind-ring
pays for a DF and not for an ST). The **null pre-laid**: role does **not**
separate prices ⇒ the role axis buys nothing the incumbent's role-free reading
misses ⇒ **v3 dies cheaply BEFORE the consumer is built** (contract §6 stop
rule; the cheap-death-before-census discipline #44.5/#65).

### 4.1 The PRIMARY spread statistic — the role RANGE, with an honest null (#20)

**Per `(context, candidate)` with ≥ 2 in-power roles, the primary is the role
SPREAD**

```text
S(context, candidate) = max_r value(context, r, candidate)
                      − min_r value(context, r, candidate)     over IN-POWER roles r
```

— the range of the signed approach value across the in-power roles, in pp.
Chosen over "one pre-named pair" because the hypothesis is *prices differ by
role* **generally**, not "DF differs from ST"; and V3-P0 §9.4 shows the largest
incumbent separation is **WG-vs-central** (DF↔WG 0.537, MF↔WG 0.543), while
MF↔ST is smallest (0.262) — pinning the primary to one pair would test a
middling axis and miss where separation actually lives. `S` is a single,
legible number per cell, in the price's own units, and is exactly "the value
SPREAD across roles" #79.3 named.

**#20 semantics applied — the null test is NOT a naive CI on `S`.** `S` is a
non-negative extreme statistic: under H0 (no role separation) the max−min of
noisy role means is **positive in expectation** (the winner's-curse / extreme-value
inflation #20 governs — the dispersion analogue of the argmax bias). A "CI lower
bound on `S` > 0" would therefore **false-positive under the null**. The
**pre-registered separation test is a within-cluster role-label PERMUTATION
null:** within each match seed (the cluster), permute the role labels across the
sampled station-family bodies, recompute `S` per cell, **B = 2,000 permutations**
sharing the frozen bootstrap seed (§6); a cell is **RESOLVED role-separated** iff
its observed `S` exceeds the **97.5th percentile** of its permutation
distribution (one-sided, permutation p < 0.025). Permuting labels **within
match** preserves the match-level clustering (#20) and the per-context role
mix, isolating the role signal. Family-wise across the 216 spread cells: the
pre-registered control is **Benjamini–Hochberg at q = 0.05**, and the raw
resolved count is reported against the null false-positive expectation
(0.025 × #computable cells).

* **Point estimate + cluster-bootstrap CI on `S`** are also reported per cell
  (2,000 cluster resamples of the match seed, frozen seed) — as a *magnitude*
  with its uncertainty, NOT as the separation test (the permutation null is the
  test).
* **REPORTED, secondary (never the primary, never gating):** all pairwise role
  differences `value(r_i, candidate) − value(r_j, candidate)` per cell, with
  cluster CIs (the two-sample, match-clustered difference — the roles' bodies
  are sampled at different moments, clustered by shared match seed) — the
  **DIRECTION** of separation (which role pays more for which candidate); the
  pooled distribution of `S`; the per-context resolved-cell counts; the
  per-role value tables themselves.

### 4.2 WHERE separation should appear — a REPORTED directional check (NOT a gate)

If the incumbent role signatures (V3-P0 §9.4) are informative about the prices,
separation should appear **coherently oriented**:

* **DF vs ST on the behind/ahead axis.** The incumbent puts **DF** at `r14a180`
  (the behind-ball concentration) and **ST** ahead-and-far (`outside-lattice`,
  secondary `r14a0`/`r7a0`, 0°). So the **behind-ring candidates (a180)** should
  pay *less negative / positive* for a DF than for an ST, and the **ahead
  candidates (a0)** should pay for an ST more than for a DF — a **sign flip of
  `value(DF) − value(ST)` between a180 and a0** candidates.
* **WG on the wide/far candidates.** WG is the width role (`outside-lattice`
  modal, the largest incumbent TV from the central roles) — WG separation should
  concentrate on the **far/flank candidates (`r21`, a60/a300)**.
* **MF/ST the least separated** (incumbent TV 0.262) — the smallest role
  contrasts should sit here.

**This is a REPORTED corroboration, not a gate.** A coherent flip strengthens
the reading (the prices carry the same division of labour the incumbent's
geometry hints at); its absence is **not** a failure — the hypothesis is that
prices differ by role, however oriented, and the primary permutation test is
agnostic to direction.

### 4.3 The full #38.1 sign space

* **(a) SEPARATED — the design case / the hypothesis.** A legible set of spread
  cells RESOLVE under the permutation null (well above the null false-positive
  expectation, surviving BH): role-conditioned prices differ by role, and the
  census sees division of labour in cells. The pairwise directions are legible
  (e.g. the DF-vs-ST behind/ahead flip). **This is the object V3-P2's per-role
  consumer would read.**
* **(b) NULL / FLAT — role is invisible at this grain.** The resolved-cell count
  does not exceed the null false-positive expectation; `S` is indistinguishable
  from role-shuffled noise. **A real finding**: role does not separate approach
  prices at v3's scope ⇒ **v3 dies cheaply before the consumer** (contract §6).
  Reported, not pooled away.
* **(c) SEPARATED but INCOHERENT.** Cells resolve, but the pairwise directions do
  **not** align with the incumbent signatures (§4.2) — role matters, but not the
  way the incumbent's geometry hints. A first-class outcome: the census still
  sees division of labour; the §4.2 check is reported as *not* corroborating, and
  the finding stands on the primary.
* **(d) MIXED — resolution flips by context/candidate.** Some contexts/candidates
  resolve, others null; the pooled `S` is not the ceiling (the P1R
  ecological-fallacy lesson). Reported cell by cell.
* **PC failure ⇒ FAIL, no shipping table** (§5); a fidelity gate failure ⇒
  FAIL, stop at the commander (§7).

**Under-powered corners (the 54 DF cell-candidate pairs, §2.2) are published,
never pooled** into any of (a)–(d).

---

## 5. Gates (P1R's harness verbatim + the read-only additions)

| gate | predicate |
| --- | --- |
| **X1–X3** | fingerprint unchanged; `forcedStationPolicy` null in every production path; unreachable from the E4 preview (P1R X1–X3 verbatim). |
| **X4** | clone coverage = 100% of sampled moments. |
| **X5** | the CONTROL fork reproduces the base continuation **bit-identically**, sampled 1-in-25 (P1R X5). |
| **X6** | §2.4 — `unexplained` EXACTLY 0 (per-record, #32.1) **AND** `ok ≥ X6_FLOOR`, `X6_FLOOR = 1 − 2 × (census-measured enriched clamp share)`, reference 0.84. Clamp shares reported separately. |
| **X7** | two `runExperiment()` calls **byte-identical**; canonical table SHA emitted; zero `src/**` touched. |
| **PC** | `r21a180`'s signed value below the control's in **both** faces, CI upper < 0 (else FAIL, no shipping table). Gated POOLED (role does not change the PC's construction); reported per role. Carries P1R §5.4's honest note — the PC premise ("behind is obviously bad") is measured wrong; the gate as written still binds and is not re-cut. |
| **SAT** | reported; DESIGN-CALIBRATION ONLY unless every tested gap is within ±0.05. |
| **FLOORS** | #24 = 150 moments per `(context × role)` cell, taken EXACTLY from V3-P0 §9.3 under the block reuse (§2.3). The 3 named DF cells (§2.2) published under-powered, never pooled. Contrast in-power iff ≥ 2 roles clear 150 (§2.2/§3). |
| **CLUSTER / CI** | cluster unit = **match seed** (#20); CIs = 2,000-resample cluster bootstraps, frozen seed; the primary separation test = the within-cluster role-label permutation null (§4.1), B = 2,000, same frozen seed; no bare means. |

**Standing exception classes (#38.1), each with per-record receipts (#49.3:
`seed, tick, gid, cause`, capped 1,000/class):** paused world · carrier · ball
won · sent off · onside clamp · barred box · match ended · **E-INJURY** (the
advantage-foul carrier injury, either limb — attrs mutation post-read or same-gid
`becomeSub` reposition without release). All checked; **`unexplained` must be
exactly 0** over the full class set. Reported-not-gated: `reconstructionDiverged`
(the P1R §4.6b diagnostic).

**Fingerprint.** Unchanged by construction (the seam is null in production); every
production flag dormant. Nothing ships (Road B), through the whole stage.

---

## 6. Staging

| item | value |
| --- | --- |
| **HEAD / world** | freeze HEAD `57e3c35` (ruling #79); the run states its own HEAD + armed flags (#26.5). Enriched world, full #67.3 bundle (`edsPerceivedDefence`+`edsPerceivedChoice`+`edsValueAxis`, `c5Hold`, `c6Carry`, `c7Windup`; `c5TouchFork` off). `src/**` byte-identical to V3-P0 HEAD `49ba867` (empty `git diff --stat 49ba867 HEAD -- src/`). |
| **sizing smoke** | **NONE** — V3-P0 is the sizing (§3); #46.2 vacuously satisfied. |
| **census main block** | seeds **`9,110,000 + k`, `k ∈ 0..387`** (**388 matches** — the SAME block V3-P0 mapped; the reuse decision §2.3). The run collects the frozen station-family moments (~31,095, V3-P0 §9) and forks all 18 candidates + control each. |
| **consumed / reserved (disjointness, #46.2) — the walk** | P0 930k · P1 960k–1.46M · P1R 980k–1.48M · P2-A 2.0M–3.2M · P2-B 3.5M–3.9M · C4/C5 700k–970k · C6 4.0M–6.5M · C7 6.6M–7.1M · C5 re-census 8.29M–8.4M · C5-T2 8.5M/8.51M/8.6M · V2-P0 8.70M/8.71M · V2-P1 8.80M/8.81M · V2-P2 8.90M/8.91M · V2-P2R 9.00M/9.01M · **V3-P0 smoke 9.10M / census 9.11M**. V3-P1 **REUSES V3-P0's census block 9.11 M** (§2.3 — legitimate: V3-P0 forked nothing, priced nothing; #46.2 governs the sizing smoke, which V3-P1 does not run). |
| **estimand scale** | ~31,095 moments × (18 candidates + 1 control) ≈ **~590 k forks** (V3-P0's ~590 k budget; cf. V2-P1's 932,786). |
| **output data path** | `docs/world-model/data/stage3-v3-p1-role-census-table.json` (the census output). |
| **cluster unit** | the match seed (#20), one block. |
| **bootstrap / permutation** | 2,000 cluster resamples AND 2,000 within-cluster role-label permutations (§4.1), **frozen seed 91110** (fresh, disjoint from V3-P0's 91100 / V2-P2R's 90730 / V2-P1's 50068). |
| **committed-table SHA discipline** | the census emits a canonical `tableSha` over the frozen table and a run `sha256`; both committed with the result (the P1R/V2-P0/V2-P1 convention). |

---

## 7. Stop rules

Any X-family / fidelity gate fails ⇒ **FAIL, stop at the commander.** PC fails ⇒
FAIL and no shipping table. **No re-cutting after sight**: not the instrument,
not the role key, not the 150 floor, not W / the horizons, not the lattice, not
the block, not the primary spread statistic / its permutation null, not §4's
readings, not the X6 derivation rule. **The null (role does not separate prices,
§4.3(b)) STOPS the stage BEFORE the consumer is built** — that is its job
(contract §6). Nothing ships (Road B): the seam stays null in production, the
fingerprint unchanged, every flag dormant, through the whole stage. V3-P1 makes
**no** claim the eye deploys and **cannot** authorize V3-P2.

---

## 8. Registered non-claims + the commander's eye

* **V3-P1 prices approaches under #41.2 only.** No standing, no formations, no
  coach layer; if organised role-shaped shape appears it EMERGED from measured
  per-role prices consumed through honest eyes (contract §7). The role is a
  property of the SAMPLED body (I3), read not created (I8), never a treatment.
* **The table is role-keyed on the TRUE role of the forced body — NO percept
  question arises at census time.** Unlike V2-P1's TRUE-vs-PERCEIVED going bit,
  role is exact own-state (a body knows his job); there is no PERCEIVED column,
  no wedge cross-check, no ORACLE arm here. The perception exchange a v3 consumer
  would pay does not exist in the census. (I11 / #77.2(v): the perceptionPrice
  serialization fix is **not** load-bearing here and lands at the V3-P2 build.)
* **V3-P1 cannot authorize V3-P2.** It hands forward the role-conditioned price
  table (with its resolved-cell map and the pairwise directions); only the
  commander's review of the result opens V3-P2, whose consumer reads each body's
  own role's column and pays the deviation-geometry test against V3-P0's
  incumbent signature (§9.4) as the DEV baseline.
* **The block is REUSED (§2.3), argued as no-peek.** Flagged for the commander's
  eye: the decision rests on (a) V3-P0 having priced NOTHING (read-only, zero
  `src/**`), (b) the 150 floor being #24-fixed not block-tuned, and (c) #46.2's
  object being the sizing smoke, which V3-P1 does not run. If the commander
  prefers an independent-block confirmation of coverage over the exactness +
  drift-avoidance the reuse buys, a fresh block above 9.2 M is the alternative —
  at the cost of re-exposing the 1.99× binding cell to drift.
* **X6 floor derivation, not a fixed number (§2.4).** The `1 − 2 × clamp-share`
  formula is frozen; the census re-derives the floor from its own measured
  enriched clamp share (V2-P1 §9.1 landed 0.8439), with `unexplained = 0`
  unconditional. Flagged in case a pre-committed fixed floor is preferred (which
  would need a forked sizing V3-P0 did not run).
* **Nothing ships (Road B).** Every EDS flag dormant in production, `c6Carry`/
  `c7Windup` probe-only, fingerprint unchanged, through the whole stage.
