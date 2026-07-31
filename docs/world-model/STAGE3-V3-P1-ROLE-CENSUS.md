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

---

## 9. RESULT — division of labour is in the prices

Run **supervised by the resident session** (#49.5, ratified by ruling #81), the
**frozen probe unchanged** (§7: no instrument / role key / 150 floor / W /
horizon / lattice / block / primary-statistic / permutation-null / reading /
X6-rule re-cut after sight). HEAD **`57e3c35`** (ruling #79); enriched world,
full #67.3 bundle armed (`edsPerceivedDefence`+`edsPerceivedChoice`+
`edsValueAxis`, `c5Hold`, `c6Carry`, `c7Windup`; `c5TouchFork` off); `src/**`
byte-identical to V3-P0 HEAD `49ba867`. Census block **`9,110,000 + k`,
`k ∈ 0..387`** (388 matches — the SAME block V3-P0 mapped, the reuse decision
§2.3), consumed to the frozen budget. Data:
[`data/stage3-v3-p1-role-census-table.json`](data/stage3-v3-p1-role-census-table.json)
· canonical table SHA **`171a6dad…16559f`** · primary SHA **`92236ed2…196bdc`**
· file SHA256 **`d62e7591…8b613c`** · `deterministic: true`.

**Scale.** 388 matches → **31,095 station-family moments** (35,914 qualifying,
4,819 ball-directed skipped, `noPool` 0) → **590,805 forks** priced (31,095
clones taken, coverage **100%**). Across the classified-tick ledger
**`unexplained` = 0** unconditional (#32.1). The measured coverage reproduces
V3-P0 EXACTLY under the block reuse: **45 in-power `(context × role)` cells,
3 published under-powered** (the thin DF cells — `ours|theirThird|crowded||DF`
n=33, `theirs|theirThird|crowded||DF` n=137, `theirs|ownThird|sparse||DF`
n=146), `unexpectedUnderPowered = []`, **`publishedUnderPoweredMatch: true`** —
the exactness the freeze bought, delivered. The 54 DF cell-candidate pairs are
published under-powered, never pooled.

### 9.1 Gates — ALL PASS (verdict: GATES PASS)

| gate | result |
| --- | --- |
| **X1–X3 — fingerprint / seam / reachability** | fingerprint unchanged by construction (seam null in every production path); `forcedStationPolicy` null in production; unreachable from the E4 preview. **PASS** |
| **X4 — clone coverage** | 31,095 clones taken over 31,095 sampled moments, coverage **100%**. **PASS** |
| **X5 — control identity** | the CONTROL fork reproduces the base continuation bit-identically, **1,243 checked / 0 mismatched**. **PASS** |
| **X6 — force fidelity** | per-record (#32.1); **`unexplained` EXACTLY 0** across the **92.8 M classified ticks** (`ok`+onside+barred+unexplained = 92,802,079); `ok` = 85,240,455 → **okFraction 0.918519**; measured enriched clamp share **0.081481** → derived **X6_FLOOR = 0.837038** (reference **0.84** carried); 0.9185 ≥ 0.8370 → floor cleared. `reconstructionDiverged` 846,135 (reported-not-gated). **PASS** |
| **X7 — determinism** | two `runExperiment()` calls byte-identical; table SHA `171a6dad…16559f`; primary SHA `92236ed2…196bdc`; zero `src/**` touched. **PASS** |
| **PC — positive control** | `r21a180` signed value below the control in **both** faces, CI upper < 0: pooled **−3.66 pp** CI [−4.27, −3.03] (n=29,815); ours −3.14 pp CI [−4.05, −2.27], theirs −4.31 pp CI [−5.22, −3.35]. **resolves.** (Reported per role: DF −2.93, MF −1.23 [CI straddles 0], WG −5.53, ST −3.23 pp — gated POOLED, role does not change the PC construction; §5.) **PASS** |
| **SAT** | max tested gap **0.0326** (`r14a180`), all within the ±0.05 band → **agrees → SHIPPING TABLE.** |
| **FLOORS** | #24 = 150 moments per `(context × role)` cell, taken EXACTLY from V3-P0 §9.3 under the block reuse; 45 in-power / 3 published-under-powered DF cells, measured set matches published. **PASS** |
| **CLUSTER / CI** | cluster unit = match seed (#20); 2,000 cluster bootstraps, frozen seed **91110**; primary separation test = the within-`(match × context)` role-label permutation null (§4.1, refined per #81.1), **B = 2,000**, BH q = 0.05; bootstrap CIs on `S` reported-only (house law #80.2); no bare means. **PASS** |

### 9.2 The primary — (a) SEPARATED-COHERENT, localised (16/216 resolve)

**The pre-named hypothesis HOLDS: role-conditioned prices differ by role, and
the census sees division of labour in cells.** Of the **216 computable spread
cells** (all 12 contexts × 18 candidates; ≥3 in-power roles everywhere, R2
COVERAGE RICH confirmed), **47 resolve raw** (permutation p < 0.025) and
**16 survive Benjamini–Hochberg** at q = 0.05 — against a null false-positive
expectation of **5.4** (0.025 × 216). Sixteen BH-survivors versus 5.4 expected is
**real, modest in extent, and geometrically coherent** (§4 reading **(a)
SEPARATED**, in its localised / **(d) MIXED** form: separation concentrates in a
few contexts, most of the pitch is flat — §9.3's honest bound).

**Per-context resolved map** (raw / BH-survived, of 18 candidates each):

| context | in-power roles | raw resolved | BH-resolved |
| --- | --- | ---: | ---: |
| `ours\|middle\|sparse` | DF MF WG ST | 14 | **7** |
| `ours\|ownThird\|sparse` | DF MF WG ST | 10 | **5** |
| `ours\|ownThird\|crowded` | DF MF WG ST | 2 | **2** |
| `theirs\|middle\|crowded` | DF MF WG ST | 5 | **1** |
| `theirs\|theirThird\|sparse` | DF MF WG ST | 5 | **1** |
| `theirs\|middle\|sparse` | DF MF WG ST | 7 | 0 |
| `ours\|theirThird\|sparse` | DF MF WG ST | 3 | 0 |
| `theirs\|theirThird\|crowded` | MF WG ST | 1 | 0 |
| `ours\|middle\|crowded` · `ours\|theirThird\|crowded` · `theirs\|ownThird\|sparse` · `theirs\|ownThird\|crowded` | (mixed) | 0 | 0 |
| **total** | | **47** | **16** |

### 9.3 The 16 resolved cells — the role geometry (the first measured division of labour)

The signed value per role, in pp, at each BH-resolved cell. Every price agrees
with football sense **without one authored line** — the argMax / argMin fall out
of the census:

| `(context)` | cand | S (pp) | perm p | DF | MF | WG | ST | argMax | argMin |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | :--- | :--- |
| `ours\|middle\|sparse` | r7a0 | 12.82 | 0.0000 | **+13.2** | +7.8 | +0.4 | 0.7 | **DF** | WG |
| `ours\|middle\|sparse` | r7a60 | 12.17 | 0.0000 | **+10.5** | +3.8 | 0.0 | −1.7 | **DF** | ST |
| `ours\|middle\|sparse` | r7a240 | 11.37 | 0.0010 | **+11.5** | +7.7 | +0.1 | +5.0 | **DF** | WG |
| `ours\|middle\|sparse` | r7a300 | 11.57 | 0.0020 | **+10.7** | +2.9 | −0.9 | +1.4 | **DF** | WG |
| `ours\|middle\|sparse` | r14a300 | 10.93 | 0.0025 | **+8.4** | +2.4 | −2.6 | +1.7 | **DF** | WG |
| `ours\|middle\|sparse` | r21a60 | 10.80 | 0.0010 | **+10.6** | +1.2 | −0.2 | +3.5 | **DF** | WG |
| `ours\|middle\|sparse` | r21a300 | 10.92 | 0.0020 | **+9.0** | +3.0 | −1.9 | +3.2 | **DF** | WG |
| `ours\|ownThird\|sparse` | r7a300 | 9.57 | 0.0020 | **−40.4** | −32.7 | −36.1 | −30.8 | ST | **DF** |
| `ours\|ownThird\|sparse` | r14a300 | 11.37 | 0.0000 | **−38.4** | −28.9 | −33.5 | −27.0 | ST | **DF** |
| `ours\|ownThird\|sparse` | r21a60 | 12.23 | 0.0000 | **−34.4** | −29.4 | −31.3 | −22.2 | ST | **DF** |
| `ours\|ownThird\|sparse` | r21a240 | 10.36 | 0.0025 | **−35.9** | −30.8 | −34.9 | −25.5 | ST | **DF** |
| `ours\|ownThird\|sparse` | r21a300 | 9.63 | 0.0020 | **−32.4** | −28.7 | −30.8 | −22.7 | ST | **DF** |
| `ours\|ownThird\|crowded` | r7a240 | 13.21 | 0.0025 | **−30.5** | −17.3 | −20.8 | −27.6 | MF | **DF** |
| `ours\|ownThird\|crowded` | r14a240 | 12.04 | 0.0035 | **−28.9** | −16.9 | −25.1 | −23.8 | MF | **DF** |
| `theirs\|middle\|crowded` | r7a240 | 15.16 | 0.0000 | **−43.4** | −28.2 | −31.7 | −35.2 | MF | **DF** |
| `theirs\|theirThird\|sparse` | r21a180 | 10.01 | 0.0005 | +6.1 | **+7.5** | −2.5 | +0.3 | MF | WG |

**Three coherent readings fall straight out (ruling #82.2, BANKED):**

* **(i) Build-up positioning work is PAID ONLY TO THE DF.** In
  `ours|middle|sparse` the **DEFENDER is argMax in all 7 resolved cells**
  (+0.084 to +0.132), while WG and ST earn ≈0 — the reposition into our own
  half's build-up shape pays a defender and essentially no one else.
* **(ii) Deep runs are for OTHER bodies — the DF's leaving costs most.** In
  `ours|ownThird` the **DEFENDER is argMin in all 7 resolved cells** (5 in
  `sparse`, 2 in `crowded`); vacating the deep third is the worst-priced approach
  for the DF, best-tolerated by ST/MF who are meant to break forward.
* **(iii) MF beats DF on the crowded defensive approach.** In the crowded
  midfield / own-third jams (`theirs|middle|crowded r7a240`, `ours|ownThird|
  crowded r7a240`/`r14a240`) the **midfielder is argMax and the DF argMin** — the
  MF is the body that should step into the crowd; the DF leaving it is dearest.

The prices agree with football sense in **every resolved cell**, with no coach
layer and no authored rule — the emergence doctrine's cleanest exhibit to date.

### 9.4 The honest bound, and the cross-checks

* **200 of 216 cells do NOT separate.** Over most of the pitch the roles agree on
  what is good — which is also football-real (a good approach is a good approach
  for anyone) — so the division of labour is **localised, not universal**. The
  16 that resolve concentrate in own-half build-up and the deep/crowded defensive
  contexts; the attacking third and the sparse defensive contexts read flat. The
  V3-P2 consumer's divergence will be **concentrated exactly where the table
  separates**, not spread across the pitch. This bound is published, not pooled
  away.
* **PC per role (reported).** The PC resolves POOLED (−3.66 pp, both faces upper
  < 0); per role WG pays the ring most (−5.53 pp) and MF least (−1.23 pp, CI
  straddles 0) — the gate binds on the pooled construction and is not re-cut
  (§5, carrying P1R §5.4's honest note that "behind is obviously bad" is measured
  wrong; the gate as written still binds).
* **X6 floor, derived not fixed (§2.4).** The measured enriched clamp share
  0.081481 lands the derived floor at **0.8370** — a touch below the 0.84
  reference (this world clamps slightly more than V2-P1's 0.078062 / 0.8439), the
  `1 − 2 × clamp-share` formula-form again vindicated; `unexplained = 0`
  unconditional across the class set (`eSentOff` 173, `eBallWon` 0, receipts
  capped 1,000/class per #49.3).
* **SAT.** All five tested candidates within ±0.05 (max 0.0326) → SHIPPING TABLE;
  design-calibration confirmed, not gating.

### 9.5 Disposition — ruling #82: HALF-1 HOLDS CERTIFIED

Per **ruling #82**, the census is **ACCEPTED** and **half-1 HOLDS CERTIFIED**:
the 16 resolved cells' geometry is **the first measured division of labour** —
DF argMax across all 7 `ours|middle|sparse` cells, DF argMin across all 7
`ours|ownThird` cells, MF > DF in the crowded midfield — prices that agree with
football sense in every resolved cell without one authored line (#82.2, BANKED).
The honest bound (200/216 do not separate) stands published: role separation is
real but localised.

**V3-P2 DRAFTING is AUTHORIZED (executor)** under one **ex-ante mandate**
(#82.3): at the freeze, compute from THIS committed table the **per-role argMax
per context** and publish the predicted **deviation-divergence rate** (how often
two roles at the same moment would choose differently) BEFORE the run — the
half-2 hypothesis ("convergence breaks by construction") is only as strong as
that number, and the #44.5 discipline applies at the hypothesis level. The rest
per contract §4: five arms, DEV on the perceived-attainable denominator, the
convergence mediators PRIMARY, payoff reported; the perceptionPrice
serialization fix (#77.2(v)/I11) lands at THIS build; freeze → review → build →
the resident runs (#49.5). **V3-P1 ships nothing (Road B); it makes no claim the
eye deploys and does not itself authorize V3-P2 — only the commander's review,
now given, opens the draft.**
