# Stage III V2-P0 — The Wedge and the Base-Rate Map

Status: **PRE-REGISTERED 2026-07-30, frozen before the run.** READ-ONLY,
**zero `src/**`**. Nothing here prices anything and nothing here ships.

Authority: [`STAGE3-V2-ANTICIPATORY-EYE.md`](STAGE3-V2-ANTICIPATORY-EYE.md) §4
(V2-P0's four deliverables (i)–(iv)), §2 (the OTHERS-GOING feature, verbatim;
the two harness repairs), §3 (the invariants — esp. **I6** enriched world,
**I7** sizing-before-floors, **I8** no new channel), §6 (stop rules) · **#66**
(launch; census world = ENRICHED) · **#65.2** (the perception wedge is a
MEASURED hazard, sized ex ante — the C5-T2 reference this stage applies) ·
#44.2 / #44.4 (the substrate law + the pre-named lever) · #41.2 (approach
semantics) · #46.2 / #48.4 / #49.3 (smoke disjointness / fidelity / receipts) ·
#24 (population floors) · #38.1 (full sign space + E-INJURY) · #20 (CI/cluster) ·
#32.1 (per-record fidelity form) · Road B (nothing ships).

Parents reused unamended: [`STAGE3-P1R-APPROACH-CENSUS.md`](STAGE3-P1R-APPROACH-CENSUS.md)
§2 (the 18-candidate ball-local lattice, the 12 contexts, W = 3.0 s, the moment
instrument), [`STAGE3-P0-CONSUMER-MAP.md`](STAGE3-P0-CONSUMER-MAP.md) §2–§3 (the
v1 anchors this stage re-measures).

**World / HEAD.** Every arm runs the **ENRICHED** world (the C5-recensus / C5-T2
§0.1 precedent, #60.3/#66.2): `edsPerceivedDefence`, `edsPerceivedChoice`,
`edsValueAxis`, `c5Hold`, **`c6Carry`**, **`c7Windup`** armed; `c5TouchFork`
off. HEAD = `92876e5` (the v2 contract). Every run states its HEAD and its armed
flags (#26.5). In production every EDS flag defaults OFF
(`EDS_BUNDLE_ARMED = envArmed('EDS_BUNDLE')`) and `c6Carry`/`c7Windup` default
`false` — Road B is intact; the enriched world is a probe-only staging.

---

## 1. What V2-P0 is (and is not)

V2-P0 is the **#65-mandated stage**: before any census freezes, measure whether
the anticipatory eye can SEE its new feature. It is **observational** — the
OTHERS-GOING condition is recorded at NATURAL rates on the enriched world (I3:
never a treatment; no fork-and-force here — that is V2-P1). It reads every value
off a **pristine clone** so the live trajectory is never perturbed.

It hands two things forward and can stop the stage with a third:
* **(i) → V2-P1's floors**: the TRUE base rates of OTHERS-GOING per candidate per
  context — the census's conditioning population, #24's input.
* **(ii) → V2-P2's DEV expectations**: the PERCEIVED-vs-TRUE agreement of the
  feature — the wedge on motion, decomposed and retention-sensitive.
* **(ii) can STOP the stage**: if the wedge kills delivery in the C5-T2 shape
  (§6), the fork RETURNS TO THE COMMANDER **before V2-P1 is drafted**, with the
  R3-from-the-start fallback named.

**It cannot authorize V2-P1.** Only the commander's review of this freeze can.

---

## 2. The frozen quantities (no re-cutting after sight — §6)

### 2.1 The region radius R — FROZEN at **4.0 m**

The feature (§2 of the contract) fires when a teammate's perceived position,
advanced along his perceived velocity for W, **lands within R's radius** of a
lattice candidate's ball-local point. R is frozen here from the P0 anchors:

```text
P0 I6  duplicate runs = "two run targets within 4 m of each other"  → the
       OPERATIONAL grain of "aimed at the same place" (the memo's second-
       arrival collision is exactly this event).  STAGE3-P0-CONSUMER-MAP §2.2/§3.
P0 I3  pairwise spacing "share < 4 m"  → the pile-up LEFT-TAIL bucket, same grain.
⇒ R = 4.0 m.
```

**Geometry disclosed (candidate lattice, P1R §2.3).** Candidates sit at
`r ∈ {7,14,21} × {0,60,120,180,240,300}°`. Adjacent same-`r` candidates at
`r = 7` are `2·7·sin30° = 7.0 m` apart; radial neighbours are `7 m` apart. A 4 m
region therefore **overlaps** neighbouring regions. This is **accepted, not a
defect**: OTHERS-GOING is a **per-candidate CONDITION** (each of the 18
candidates carries its own bit at each moment, §2 of the contract), not a
partition of the plane — a teammate heading into an overlap legitimately makes
BOTH candidates' bits `someone-going`, which is the honest reading of "somebody
is already going where I might go." R is **not re-cut after sight** (§6).

### 2.2 The motion source — FROZEN to the remembered VELOCITY (code-true)

The feature spec offers two velocity sources ("remembered velocity **if
carried**, else the difference of the two most recent remembered positions").
The percept machinery
([`src/ai/perceptionSnapshot.ts`](../../src/ai/perceptionSnapshot.ts)) settles
this by construction:

* `PerceptionMemory` holds **one `StoredPlayer` per gid** in a `Map`,
  **overwritten in place** (`rememberPlayer`/`writeObservation`, the E3R
  allocation-free scan). Each record carries `{ gid, side, pos, vel, bodyDir,
  observedTick }` — a remembered **position** (noised, `posAmp =
  (0.2 + d·0.025)·(1−awareness)`) AND a remembered **velocity** (noised,
  `velAmp = (0.45 + speed·0.08)·(1−awareness)`), plus `observedTick` →
  `ageTicks`.
* **There is NO history of two positions.** The snapshot always carries a
  remembered velocity, so the **"if carried" branch ALWAYS fires**; the
  "difference of two most recent remembered positions" branch has **no substrate
  under the live percept** and is **inoperative by code**. Building a
  second-position store to feed it is forbidden by **I8** ("computed from what
  the snapshot already carries").

⇒ The census reads the remembered `vel` field, advanced for W. **Frozen.** This
collapses the (ii) "differencing error" component into a **velocity-noise error**
(the `velAmp` channel) — see §4-(ii). *(Flagged for the commander's eye: the
contract's differencing clause is dead-lettered by the substrate; the reading is
unchanged, but the decomposition simplifies to three named parts, not four.)*

### 2.3 The warm-up length — FROZEN at **15 ticks (0.25 s)**

From the E-series scan cadence: the scan interval is
`intervalTicks = round(15 − awareness·9)` = **6–15 ticks (4–10 Hz)**; retention
is `retentionTicks = round(15 + awareness·45)` = **15–60 ticks (0.25–1.0 s)**
(`perceptionSnapshot.ts:397-398`). The **worst-case** (awareness→0) scan
interval is 15 ticks, so a 15-tick pre-roll guarantees the forced body has
completed **≥ 1 full scan** — hence a fresh remembered velocity for every
teammate then in cone+range — before its first census decision. Frozen census
+ consumer forks warm the percept 15 ticks (repair 2, contract §2).

### 2.4 The primary axis — BINARY (contract §2, not re-cut)

`nobody-going (0)` vs `someone-going (≥1)`, per candidate. The richer **count is
REPORTED, never a primary axis** (the memo's claim is the marginal second
arrival; a binary preserves census power — the P1R 216-cell lesson). Context =
`FACE × THREAT × DENSITY × OTHERS-GOING(candidate)`, v1 axes unchanged.

---

## 3. The sizing smoke (read-only, disjoint, disclosed — I7 / #24 / #46.2)

Ran **before** the floors below were frozen, committed WITH this doc:
[`scripts/probes/stage3-v2-p0-sizing-smoke.ts`](../../scripts/probes/stage3-v2-p0-sizing-smoke.ts),
output [`data/stage3-v2-p0-sizing.json`](data/stage3-v2-p0-sizing.json).

* **Basis.** The enriched world; the disjoint block **8,700,000 – 8,700,047**
  (48 matches, #46.2); P1R's moment instrument **verbatim** (2.0 s spacing;
  side-alternating stable rotation; station-family filter; face×threat×density
  classifier); counts only — no forks, no OTHERS-GOING, no cost. Twice
  byte-identical, **SHA `8d709d30…168c83`**, `deterministic: true`.
* **Result (the conditioning population).** 3,791 station-family rows =
  **78.98 rows/match** (min 66, max 95); 4,381 qualifying moments; 590
  ball-directed skipped; `noPool` 0. Per-context yield ranges from
  `ours|middle|sparse` 12.27/match to the **rarest, `ours|theirThird|crowded`
  = 2.77/match**.
* **Floor derivation (#24).** #24 = **150 rows/cell**; convention = **2× the
  measured** (X6_FLOOR's headroom form). The rarest of the 12 CONDITIONING
  contexts clears `150×2 = 300` rows at **⌈300 / 2.77⌉ = 109 matches**.

**Frozen floors:**
* **Conditioning floor** — every `face×threat×density` context ≥ 150 rows;
  cleared by the 109-match derivation with the rarest at the binding cell.
* **Census match count = 500** (block below). This is **~4.6× the 109-match
  conditioning floor** — the pre-registered **OTHERS-GOING split headroom**: the
  smoke CANNOT measure the `someone-going` share (that share IS deliverable (i)),
  so the count is set to clear #24 in the rarest CONDITIONING context by ~4.6×,
  leaving room for the binary split. **Any `someone-going` split cell still under
  150 is published UNDER-POWERED (#24), never pooled away** — and if the rarest
  split cell starves, that is **return-tooth B** (§6).

---

## 4. The four deliverables, operational

### (i) TRUE base rates of OTHERS-GOING — the conditioning map

For every sampled station-family moment (enriched world, natural rates), compute
OTHERS-GOING from **TRUE world state** (velocities known exactly) for each of the
18 candidates: the count of own outfield teammates (not self, not GK) whose true
velocity, advanced W = 3.0 s from their true position, lands within R = 4.0 m of
the candidate's ball-local point. **Primary = the binary** `someone-going`;
**reported = the count.** Tabulate the `someone-going` rate per candidate per
`face×threat×density` context — the population V2-P1's #24 floors bind against.
Cluster = match seed; CIs = 2,000-resample cluster bootstraps (#20), never bare
means.

*Sign space for (i):* **(a) premise-confirmed** — `someone-going` is common in
CROWDED contexts (the memo's pile-up has a conditioning population); **(b)
rare-everywhere** — the pile-up is not visible AS MOTION at this grain, a real
finding that re-poses the memo's mechanism; **(c) non-separating** — the rate is
near-constant across contexts, so the feature adds little conditioning value.
None is pre-judged.

### (ii) PERCEIVED-vs-TRUE agreement — the wedge on motion

For the **sampled (forced) body's own snapshot** — advanced eagerly
(`advancePerceptionMemory`) or replayed exactly from recorded scan frames
(`reconstructBodyMemory`, "perception is PULL"), both frozen to the remembered
`vel` (§2.2) — recompute OTHERS-GOING and compare its binary bit to the TRUE bit
(i), per candidate per context. Report the **agreement** (share of moments where
perceived bit == true bit) and its **decomposition** (contract §4-(ii)):

```text
NEVER-SAW           the teammate is not in memory.players — never in cone+range
                    over warm-up + window, or pruned by retention. (C5-T2's
                    E-ABSTAIN-UNSEEN 70.7% is the reference analogue.)
SAW-TOO-LONG-AGO    the teammate is remembered but ageTicks is large (up to the
                    retention max 60 ticks = 1.0 s): a stale fix extrapolated
                    over W = 180 ticks mis-points the motion.
VELOCITY-NOISE      even a fresh fix carries velAmp noise, so the advanced
  (differencing)    position crosses R's 4 m boundary on the wrong side — the
                    "differencing error" the contract names, code-true reduced
                    to the remembered-vel noise channel (§2.2).
```

**Retention-rule sensitivity (REPORTED, not gated; I8-safe).** On the census's
own **recorded scan frames**, replay `reconstructBodyMemory` under a LONGER
retention multiplier (the `45` in `retentionTicks`) to measure how much of the
NEVER-SAW / TOO-LONG-AGO wedge is recoverable by holding memory longer. This is
a read-only counterfactual on frames already captured — it changes **no live
percept channel** (I8) and gates nothing; it tells the commander which slice of
the wedge is a retention property vs an irreducible scan-coverage property.

### (iii) In-flight share + warm-up cost — validating the §2 repairs

* **In-flight FACE (repair 1).** Measure the share of sampled decisions with **no
  ball owner** (ball in flight) on the enriched world — v1 banked **28.7%**
  (#44.2(v)). Validate the repair: retain the LAST-PERCEIVED owner while the ball
  is in flight, carry an explicit **`inflight` marker** in the ledger (auditable),
  and report the recovered (non-abstaining) share.
* **Warm-up cost (repair 2).** Measure the **no-snapshot share of first windows**
  after the 15-tick warm-up — v1 banked **20.5%** with no warm-up (#44.2(v)).
  Report the residual (expected ≈ 0 for teammates in range; NEVER-SAW persists
  for out-of-range) and the cost (the 15-tick pre-roll per fork).

### (iv) Drift of the v1 P0 anchors on the enriched world — the battery baselines

Re-measure, on the ENRICHED world, the four anchors the V2-P3 deployment battery
will bind against, banked on the SHIPPED world (STAGE3-P0-CONSUMER-MAP §3, block
930k):

```text
I1  station-family dwell     median 0.667 s · mean 1.466 s · 43.98 changes/min
I2  target drift             median 2.571 m/s · share > 4 m/s 27.35%
I3  pairwise spacing         p10 4.188 · median 12.955 m · share < 4 m 9.40%
I6  duplicate runs           54.71%
```

The enriched world plays faster (30.7 vs 28.8 releases/min, §1.5 of the
contract), so drift is EXPECTED; the enriched values become the battery's
**binding baselines** under the population law (#26.5). *Sign space:* stable
(battery binds against the banked v1 numbers) vs drifted (re-baseline on the
enriched world before V2-P3's battery).

---

## 5. Gates (read-only census X-family)

| gate | predicate |
| --- | --- |
| **X-DET** | two `runCensus()` calls **byte-identical**; canonical table SHA emitted; **zero `src/**` touched** (the freeze and the census both). |
| **X-CLONE** | every read runs off a **pristine clone**; clone coverage = 100% of sampled moments; the live enriched trajectory reproduces **bit-identically** on a 1-in-25 sample (the C5-T2 smoke's read-only discipline). |
| **X-FID** | **unexplained EXACTLY 0** where ledgered, in #32.1's **per-record** form (never coupon-collector). |
| **FLOORS** | #24 = 150/cell, DERIVED from §3's disclosed smoke; smoke seeds (8.70M) **disjoint** from the census staging (8.71M), #46.2. Under-powered `someone-going` cells published under-powered, never pooled. |
| **CLUSTER / CI** | cluster unit = **match seed** (#20); CIs = 2,000-resample cluster bootstraps; no bare means. |

**Standing exception classes (#38.1), each with per-record receipts (#49.3:
`seed, tick, gid, cause`):** paused world · carrier · ball won · sent off ·
onside clamp · barred box · match ended · **E-INJURY**. All checked; unexplained
must be 0. Reported-not-gated: `reconstructionDiverged` (a probe/executor ball
read differing across a restart/carrier snap), the P1R convention.

**Fingerprint.** Unchanged by construction (zero `src/**`); every production flag
dormant. Nothing ships (Road B), through the whole stage (§6 of the contract).

---

## 6. STOP — the wedge teeth, pre-laid (contract §4 / §6; #65.2 reference)

The C5-T2 reference hazard (#65.2), stated as the numeric form these teeth read
from:

```text
C5-T2 (the last body at this wall):
  TRUE certified-cell share      0.586%
  PERCEIVED cell share           0.141%      → wedge ratio 0.141/0.586 = 0.24 (~4.15×)
  context agreement              50.2%       → a coin on the feature
  DEV floor                      0.29%  (= ½ × 0.586%)   perceived 0.141% < floor → F2 fired at sizing
```

Let **A** = the binary agreement of OTHERS-GOING (share of sampled moments where
the forced body's PERCEIVED `someone-going` bit == the TRUE bit, (ii)), and
**W_r** = perceived `someone-going` share ÷ true `someone-going` share (the
continuous wedge; C5-T2 reference W_r = 0.24).

* **TOOTH A — the agreement wall.** If **A ≤ 50.2%** (the percept is no better
  than the C5-T2 coin on this feature), the wedge kills the feature.
* **TOOTH B — population starvation.** If **W_r ≤ 0.24** AND the PERCEIVED
  `someone-going` count in the rarest split cell is **< 150** at the frozen
  500-match census (the perceived-attainable population cannot field #24), the
  wedge starves the census.

**If EITHER tooth fires**, reading (ii) shows the wedge kills delivery in the
C5-T2 shape: the **fork RETURNS TO THE COMMANDER before V2-P1 is drafted**, with
the memo's fallback — **the R3-from-the-start census** (census under R3
saturation rather than the unilateral fork, #44.4 / §4.5.2's closing law / I4) —
named as the alternative on the table. No floor re-cut, no feature re-cut (§6).

**The full wedge sign space** (neither tooth pre-judged):
* **W1 — WEDGE NARROW.** A well above 50.2%, W_r near 1: the feature is SEEN.
  V2-P1 proceeds; V2-P2's DEV expectations set from (ii).
* **W2 — WEDGE MODERATE.** Between the wall and parity: V2-P1 proceeds, but
  V2-P2's DEV floor derives from the **perceived-attainable** population (the #65
  lesson in gate form), not the true.
* **W3 — WEDGE KILLS.** Tooth A and/or B fire → return to commander, R3-first
  fallback (above).

Any X-family/fidelity gate failure ⇒ FAIL, stop at the commander (contract §6).

---

## 7. Staging

| item | value |
| --- | --- |
| **sizing smoke** | seeds **8,700,000 – 8,700,047** (48 matches); read-only; committed with this doc; SHA `8d709d30…168c83` |
| **census main block** | seeds **8,710,000 + k**, `k ∈ 0..499` (**500 matches**); disjoint from the smoke (#46.2) and **above the 8.6M reserve** |
| **consumed / reserved (disjointness, #46.2)** | P0 930k · P1 960k–1.46M · P1R 980k–1.48M · P2-A 2.0M–3.2M · P2-B 3.5M–3.9M · C4/C5 700k–970k · C6 T0 4.0M/4.1M–4.7M · C6 T1/T1R 5.0M–6.1M · C6 T2 6.2M–6.5M · C7 6.6M/6.7M–7.1M · C5 re-census 8.29M/8.3M/8.4M · **C5-T2 smoke 8.5M · fork build 8.51M · reserved match 8.6M**. V2-P0's smoke **8.70M** and census **8.71M** lie above every consumed/reserved range and are mutually disjoint. |
| **output data path** | `docs/world-model/data/stage3-v2-p0-wedge-map.json` (the census output; the smoke output is `…/stage3-v2-p0-sizing.json`) |
| **cluster unit** | the match seed (#20), disjoint per block |
| **bootstrap** | 2,000 cluster resamples, **frozen seed 50066** |

---

## 8. Registered non-claims

* **V2-P0 prices NOTHING.** No fork-and-force, no signed outcome, no value, no
  candidate ranking — it records OTHERS-GOING at natural rates and measures the
  wedge on it. The approach estimand (#41.2) is untouched.
* **V2-P0 CANNOT authorize V2-P1.** It hands (i) forward as floors and (ii)
  forward as the wedge reading; only the commander's review of this freeze — or,
  if a tooth fires, the commander's fork on the R3-first fallback — opens V2-P1.
* **Nothing ships (Road B).** Every EDS flag dormant in production, `c6Carry`/
  `c7Windup` probe-only, fingerprint unchanged, through the whole stage.
* No coach layer, no marking assignments, no box-arrival anticipation (v1
  exclusions stand); if organised shape appears, it EMERGED from priced
  approaches under honest eyes.

---

## 9. RESULT — the wedge is mild and the map is rich; both teeth clear

Ran in-session per **#67.4**. HEAD `92876e5` (v2 contract); enriched world, full
ratified bundle armed (`edsPerceivedDefence`+`edsPerceivedChoice`+`edsValueAxis`,
`c5Hold`, `c6Carry`, `c7Windup`; `c5TouchFork` off — **#67.3**). Census block
**8,710,000 + k, k ∈ 0..499** (500 matches). Motion source = the remembered
velocity, differencing clause dead-lettered (**#67.2**). Data:
[`data/stage3-v2-p0-wedge-map.json`](data/stage3-v2-p0-wedge-map.json) ·
canonical table SHA **`e30a37cf…dad318`** · file SHA256 **`36031b07…963b`** ·
`deterministic: true`.

**Scale.** 46,238 qualifying moments → **39,553 station-family rows** (6,185
ball-directed skipped; `noPool` 0). 500 cold-start bodies ledgered
(`eNoSnapshot`, one/match); **unexplained = 0**.

### 9.1 Gates — ALL PASS

| gate | result |
| --- | --- |
| **X-DET** | two `runCensus()` calls byte-identical; table SHA `e30a37cf…dad318`; zero `src/**` touched. **PASS** |
| **X-CLONE** | 40,053 clones taken, coverage 100%; live enriched trajectory reproduced bit-identically on **1,602 checked / 0 mismatched**. **PASS** |
| **X-FID** | per-record (#32.1); `eSentOff` 0, `eNoSnapshot` 500 ledgered, **unexplained 0**. **PASS** |
| **FLOORS** | #24 = 150/cell, smoke-derived (§3), smoke block 8.70M disjoint from census 8.71M; under-powered `someone-going` cells published under-powered, never pooled. **PASS** |
| **CLUSTER / CI** | cluster = match seed; 2,000 cluster bootstraps, seed 50066; no bare means. **PASS** |

### 9.2 The wedge teeth — BOTH CLEAR

| tooth | predicate | measured | fired? |
| --- | --- | --- | --- |
| **A — agreement wall** | A ≤ 50.2% | **A = 93.08%** (CI 93.00–93.16) | **NO** — the percept beats the coin by ~43 pts |
| **B — population starvation** | W_r ≤ 0.24 **AND** rarest perceived split cell < 150 | **W_r = 0.851** (CI 0.845–0.857); rarest perceived cell = 11 | **NO** — W_r is 3.5× the 0.24 line, so the AND fails at its first clause |

**Reading = W1 — WEDGE NARROW.** TRUE someone-going 9.67% (CI 9.59–9.76) vs
PERCEIVED 8.23% (CI 8.15–8.31); the anticipatory eye SEES its feature. Neither
the C5-T2 agreement wall (50.2%) nor the C5-T2 starvation shape (W_r 0.24) is
approached.

### 9.3 Deliverable (i) — TRUE base rates, the conditioning map

The `someone-going` rate is a **narrow band, 7.6%–11.1%**, across all 12
contexts. **Density does NOT separate it** (crowded ≈ sparse within every
face×third; sign vs sparse is inconsistent — crowded is higher in 2 cells, lower
in 3, flat in 1). The mild separator is the **third**: MIDDLE carries it most
(10.6–11.1%), own/their thirds sit ~8–10%. This is closest to sign-space **(c)
non-separating on density** — the memo's pile-up is *not* visible as extra motion
in crowded contexts at this grain — with a real mild third-gradient. The map is
nonetheless **rich per candidate**: within a context the rate is dominated by a
few ball-forward candidates (e.g. `ours|ownThird|sparse` `r7a0` true rate 42.5%
vs the 8.6% context mean), not uniform over the lattice.

| context | n | TRUE | PERC | A | W_r |
| --- | ---: | ---: | ---: | ---: | ---: |
| ours \| ownThird \| sparse | 5,705 | 8.60% | 6.35% | 94.56% | 0.738 |
| ours \| ownThird \| crowded | 2,129 | 8.86% | 8.19% | 93.23% | 0.925 |
| ours \| middle \| sparse | 5,691 | 10.56% | 8.79% | 92.37% | 0.832 |
| ours \| middle \| crowded | 3,826 | 11.07% | 10.46% | 91.20% | 0.945 |
| ours \| theirThird \| sparse | 3,205 | 8.86% | 7.26% | 93.92% | 0.819 |
| ours \| theirThird \| crowded | 1,359 | 8.21% | 7.63% | 93.69% | 0.929 |
| theirs \| ownThird \| sparse | 1,558 | 10.40% | 8.93% | 93.01% | 0.859 |
| theirs \| ownThird \| crowded | 1,866 | 9.92% | 9.39% | 93.55% | 0.947 |
| theirs \| middle \| sparse | 4,006 | 10.97% | 9.14% | 91.71% | 0.833 |
| theirs \| middle \| crowded | 3,063 | 11.06% | 10.43% | 91.22% | 0.943 |
| theirs \| theirThird \| sparse | 5,394 | 8.68% | 6.62% | 94.31% | 0.763 |
| theirs \| theirThird \| crowded | 1,751 | 7.62% | 7.16% | 94.70% | 0.940 |

*(TRUE/PERC = binary `someone-going` rate; per-candidate cell detail in the JSON
`deliverableI_baseRates.cellTable`.)*

### 9.4 Deliverable (ii) — the wedge on motion, decomposed

Agreement **A = 93.08%**. Over 75,037 true-going events the eye **sees 53.55%**
(40,184) and **misses 46.45%** (34,853); 23,201 false-going (advanced fix crosses
into R on the wrong side); 4,110 ambiguous ties broken. **Disagreement
decomposition (of missed):**

| component | share of missed | reading |
| --- | ---: | --- |
| NEVER-SAW (scan-coverage) | **34.89%** | teammate never in cone+range over warm-up+window, or pruned — the retention-**irreducible** floor |
| SAW-TOO-LONG-AGO | **8.70%** | stale fix (age median 27 / p90 47 / max 51 ticks) extrapolated over W — the retention-**recoverable** slice |
| VELOCITY-NOISE (the dead differencing channel) | **56.41%** | fresh fix, `velAmp` noise flips the R boundary — irreducible at this eye |

**Retention sensitivity (reported, not gated; I8-safe).** An exact longer-retention
replay needs a retention param on `reconstructBodyMemory`, which zero-`src`/I8
forbids adding here; so the recoverable slice is **bounded above by the 8.70%
too-old share**, never-saw (34.89%) is the retention-irreducible scan-coverage
floor, and the 56.41% noise channel is retention-invariant. Holding memory
longer recovers **at most ~8.7%** of the wedge.

### 9.5 Deliverable (iii) — the §2 repairs validated

* **In-flight FACE (repair 1).** 56,351 decisions; **no-owner (ball-in-flight)
  share 52.22%** vs v1-banked 28.7% — the enriched world spends far more time in
  flight. **Recovered share = 100%**: every in-flight decision retained a known
  last-perceived owner (`inflight` marker ledgered), so the repair abstains on
  none of them.
* **Warm-up cost (repair 2).** 39,553 bodies. Cold pull (no warm-up)
  no-snapshot share **6.32%** (the ≈ v1 20.5% analogue on this world); the
  census body naturally warmed over the whole match drops it to **3.94%** — the
  15-tick pre-roll's marginal gain, residual NEVER-SAW = out-of-range teammates.
  Remembered teammates median 4 / mean 3.27.

### 9.6 Deliverable (iv) — v1 P0 anchor drift on the enriched world

Drift is **MILD and in the expected "plays faster / tighter" direction**; the
enriched values become V2-P3's binding baselines (#26.5). I2 is essentially
stable; I1/I3/I6 drift modestly.

| anchor | enriched | banked v1 | drift |
| --- | --- | --- | --- |
| I1 dwell median / mean / changes-min | 0.667 s / 1.384 s / 46.42 | 0.667 / 1.466 / 43.98 | median flat; mean −0.082 s; **+2.44 changes/min (faster)** |
| I2 target drift median / share>4 | 2.552 m/s / 27.1% | 2.571 / 27.35% | **stable** |
| I3 spacing p10 / median / share<4 | 3.888 m / 12.361 m / 10.4% | 4.188 / 12.955 / 9.40% | **p10 −0.30 m (now < 4 m)**; median −0.59 m; share<4 +1.0 pt (tighter) |
| I6 duplicate runs | 55.29% | 54.71% | +0.58 pt |

*Note for (iv):* the enriched world's I3 p10 spacing (3.888 m) now sits **below**
the 4 m grain from which R was frozen — consistent with the faster/tighter play,
not a defect, but flagged as the reason V2-P3 must **re-baseline on the enriched
world** rather than bind the banked v1 numbers.

### 9.7 Floors vs populations — the under-powered corner

#24 floor 150/cell over 216 `someone-going` split cells: **141/216 TRUE cells**
and **131/216 PERCEIVED cells** clear the floor. The rarest split cell is
**`theirs|theirThird|crowded||r21a0`** — the deepest, most-forward candidate in
the sparsest-populated context — at **13 true / 11 perceived**. It is published
**UNDER-POWERED, never pooled** (§3 / #24), and reported here as the binding
corner. It did **not** trip Tooth B: the AND requires W_r ≤ 0.24, and W_r = 0.851.

### 9.8 Cross-check against the supervised headline

All headline figures reproduce exactly against the JSON: 500 matches / 39,553
moments · TRUE 9.67% vs PERC 8.23% · W_r 0.851 · A 93.08% · decomposition
34.89 / 8.70 / 56.41 · in-flight 52.22% · rarest perceived cell = 11 · X-CLONE
1,602/0 · `deterministic: true` · SHA `36031b07…963b`. **No discrepancy.**

### 9.9 Disposition — the fork returns to the commander

Both stop teeth clear and the reading is **W1 — WEDGE NARROW**: the anticipatory
eye SEES the OTHERS-GOING feature (A 93.08%, W_r 0.851), the conditioning map is
rich, and V2-P2's DEV expectations may be set from the **TRUE** population (not
the perceived-attainable). **V2-P0 still cannot authorize V2-P1** (§8, #67.4):
the fork returns to the commander. **A W1 reading LICENSES the commander to
authorize V2-P1 drafting** — with two items for the commander's eye:
(a) deliverable (i)'s **density-non-separation** (the memo's crowded pile-up is
not extra motion at this grain; the separator is the middle third + a few
ball-forward candidates), and (b) the **mild (iv) anchor drift** (re-baseline the
V2-P3 battery on the enriched world; I3 p10 spacing now < the 4 m R grain).
