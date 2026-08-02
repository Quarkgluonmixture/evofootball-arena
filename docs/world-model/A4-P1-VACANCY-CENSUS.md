# A4-P1 — THE VACANCY CENSUS (the concession price of rest-defence-slot VACANCY)

Status: **PRE-REGISTERED 2026-08-02, FROZEN BEFORE ANY RUN. OBSERVATIONAL,
read-only; zero `src/**`.** This document freezes — before a single census match
is simulated and before any `docs/world-model/data/*.json` is opened — the
vacancy census's estimand, the REUSED I5(b) occupancy instrument, the
pre-registered own-possession window construction, the pricing horizon, the
frozen gate (its exact predicate), the context×role stratification (the #94.3
Simpson rule), the sizing-before-floors plan, the seed pins (inside the ratified
11.7M–12.3M freeze, #125.6), and the receipts idiom. The probe
(`scripts/probes/a4-p1-vacancy-census.ts`) is built in the SAME executor step as
this freeze (fork-C-folded-in calibration, #125.4/#126.4) and carries no default
mode; the two REAL runs (sizing smoke → census) are the commander's detached
resident (#49.5). **This step commits the freeze + the probe locally and does NOT
push** (the push rides the commander's adjudication ruling). Nothing ships
(Road B): every EDS flag dormant, `stationEye` null, the production fingerprint
`57b0bdab…c673` unchanged throughout.

Authority: **A4-ASSIGNMENT-CONTRACT §4** (THE VACANCY CENSUS — fork C folded in as
calibration; the estimand, the I5(b)-reuse mandate, the gate) under invariants
**§3 I-A1..I-A7** (esp. **I-A3** no free hand-weights: every term enters in
goal-value units through measured calibration or it does not enter; **I-A5**
Road B; **I-A6** pre-registration discipline — gates freeze before runs, sizing
before floors, the attainability-knee N rule, wall-derived N_MAX, no optional
stopping; **I-A7** dormancy) · rulings **#125** (the A4 arc opens; fork C = A4-P1;
gate = a monotone resolvedly-nonzero vacancy price, null/non-monotone ⇒ STOP) and
**#126** (the 自走 green path — P1→P2→P3 advance on PASS without a per-stage user
"go"; commander review + a numbered ruling still gate every transition; STOP/FAIL
returns to the user) · **#109.3** (occupancy censuses priced PRESENCE where
presence exists — zero-positive by construction; the vacancy census prices
ABSENCE where absence occurs) · **#109.4** (the fork-and-abandon absence census,
option C) · **#94.3** (the Simpson stratify-within-context×role rule) · **#68.2 /
#26.5** (re-baseline / two-pin: the consumer reads a table on the world it was
censused on) · **#20** (CI cluster = match seed) · **#46.2** (seed disjointness) ·
**#48.4** (windows/bins pinned ex ante) · **#49.3** (per-record receipts) ·
**#105.4** (optional stopping foreclosed) · Road B (nothing ships).

Instruments / prices reused (SHA'd, published — freeze honesty; every number
below traces here): the **P3p-3 battery's I5(b) designated-slot occupancy**
([`scripts/probes/stage3-v4-p3p3-battery.ts`](../../scripts/probes/stage3-v4-p3p3-battery.ts)
lines **757–763** the own-possession `hasBall` sample block +
`restSlotShare` @ **812**) — REUSED VERBATIM, NO new geometry · the **P1
calibration surrogate detectors**
([`scripts/probes/stage3-v4-p1-calibration.ts`](../../scripts/probes/stage3-v4-p1-calibration.ts)
lines **326–344**: opponent deep entry + box entry) — REUSED VERBATIM · the
**admitted P1 prices** ([`STAGE3-V4-P1-CALIBRATION.md`](STAGE3-V4-P1-CALIBRATION.md)
§RESULT, reading B): deep entry **L = 0.043455 [0.030790, 0.055817]**, box entry
**L = 0.195217 [0.166228, 0.223515]** concessions/event; **shot-against was
DROPPED** at P1 (non-monotone, point 0.086542 < box) and is **NOT used here** ·
the **P1 match-cluster bootstrap engine** (`clusterCI`/`contrastCI`, cluster =
match seed) · the production fingerprint `57b0bdab…c673`.

**World / HEAD / flags (#26.5 / #67.3).** Every census match runs the **ENRICHED
eye-null** world — the #67.3 full bundle (`edsPerceivedDefence +
edsPerceivedChoice + edsValueAxis` ON, `c5Hold`, `c6Carry`, `c7Windup` ON,
`c5TouchFork` off) with **`stationEye` NULL** — because that is exactly the world
the P1 prices were calibrated on (#26.5/#68.2 two-pin logic: a consumer that
prices at admitted lifts must observe the world those lifts were measured on).
The vacancy variation is present in this incumbent world (the index-1 body is
usually clamped deep by the Phase-31 rest-defence machinery but is sometimes
pulled off the slot). In production every EDS flag defaults OFF, `stationEye` is
null, and the fingerprint `57b0bdab…c673` is unchanged (X-SRC-ZERO). **Zero
`src/**` changes** — the census only observes the world's own play.

---

## §1 — THE ESTIMAND (what A4-P1 measures, and what it does not)

**The concession price of rest-defence-slot VACANCY, in goal-value units**,
measured **observationally** on the world's OWN occupied-vs-vacant variation
during own-possession phases. During an own-possession window the designated
rest-defence slot (the I5(b) instrument's index-1 body, deep in its own third) is
sometimes OCCUPIED and sometimes VACANT. At the TURNOVER that ends the window, a
vacant slot leaves the team exposed — the Phase-31 "uncontested breakaway"
pathology (`PlayerBrain.ts` comment). The vacancy price is the **excess
downstream concession goal-value that a VACANT window suffers over an OCCUPIED
one**, priced through the admitted P1 surrogates over a pinned horizon.

This is the measurement the v4 occupancy censuses structurally could not deliver
(they priced PRESENCE where presence already exists — zero-positive by
construction, #109.3). The vacancy census **prices ABSENCE where absence occurs**
(the contract's §4 language).

**A4-P1 does NOT** (registered non-claims, §7): force any body (no fork-and-hold),
build any consumer (no M1–M5 mechanism, no assignment gene, no seam consumption),
price any station, or ship anything. It observes; it prices; it can STOP the arc.

**PERCEPT-honesty is N/A at A4-P1** (explicit): this is a read-only measurement.
No percept is created, read, or leaked; no consumer is built. The charter's
percept-honesty invariant (I-A1) binds A4-P2/P3 (where a consumer exists), not
this observational stage.

---

## §2 — THE INSTRUMENT + THE WINDOW CONSTRUCTION (frozen; no re-cut after sight)

### 2.1 The I5(b) designated-slot occupancy (REUSED VERBATIM — no new geometry)

The occupancy definition is the P3p-3 battery's I5(b) instrument, cited to the
exact source lines and reused byte-for-byte in logic:

> At a **6 Hz own-possession playing sample tick** (`tick % SAMPLE_EVERY === 0`,
> `SAMPLE_EVERY = 10`, `m.phase === 'playing'`, `m.possessionSide === d`), the
> designated slot is **OCCUPIED** iff the index-1 outfield body of side `d`
> (`p.index === 1`, `p.role !== 'GK'`, `!p.sentOff`) is deep in its own third:
> `teams[d].localX(p.pos.x) < -REST_THIRD` (`REST_THIRD = HALF_L / 3`), else
> **VACANT**.

Source: battery `:757–763` (the `if (hasBall)` block — `deep.some(p => p.index === 1)`
sets `restSlotTicks`) and `restSlotShare = restSlotTicks / restTicks` @ `:812`.
The A4-P1 probe samples the SAME condition per own-possession window. No fresh
coordinates, no new percept (I-A2 WHERE-clause: the world's own designated-slot
machinery).

### 2.2 The own-possession WINDOW (pre-registered)

* **A WINDOW** = a maximal run of constant `m.possessionSide === d` for `d ∈ {0,1}`.
  It **CLOSES** the tick `m.possessionSide` leaves `d`.
* **TURNOVER close** (the priced case): the new `m.possessionSide === (1 − d)`
  AND the closing tick is **PLAYING** — a live hand-off to the opponent, the
  rest-defence exposure moment. A close to loose (`-1`), a restart, or match end
  is a **NON-TURNOVER** (no live exposure): counted, **not priced**.
* **VACANCY classification of a window** (over its 6 Hz samples, §2.1):
  `vacFrac = vacantSamples / totalSamples`; `vacDurS = vacantSamples · SAMPLE_DT`
  (`SAMPLE_DT = SAMPLE_EVERY · DT` — trailing vacant own-possession seconds). A
  window with **0 samples** (too short to classify) is **DROPPED** (counted).
  **BINARY: VACANT iff `vacFrac ≥ 0.5`, else OCCUPIED.**
* Only **turnover-closed, ≥1-sample** windows enter the price. Drop counts
  (no-sample, non-turnover) are PUBLISHED.

### 2.3 The pricing horizon (pinned from the P0/P1 published grid, I6)

After the turnover tick `t_end`, count opponent concession surrogates suffered by
`d` in the half-open **`(t_end, t_end + W_price]`**:

```text
PRIMARY   W_price = 10 s   (the certified P0b concede horizon; the rest-defence
                            breakaway is immediate — a P0 lag-grid edge)
SENSITIVITY  W_price ∈ {6 s, 15 s}   (published lag-grid edges; LABELLED, NON-GATING —
                            the gate + primary table read the 10 s window ONLY)
```

---

## §3 — THE PRICING (surrogates → goal-value; both raw + converted, contract §4)

For each priced (turnover) window, the downstream surrogate counts over `W_price`
are the P1 detectors REUSED VERBATIM (`:326–344`), scored per **defending** side
`d` on the null→true entry transition:

| surrogate | detector (defending side `d`) | admitted price `L` (concessions/event) |
| --- | --- | --- |
| **deep entry** (against `d`) | opponent owns AND ball in `d`'s own third: `localX(ball.x) < -REST_THIRD` | **0.043455** [0.030790, 0.055817] |
| **box entry** (against `d`) | opponent owns AND `localX(ball.x) ≤ -(HALF_L − BOX_DEPTH)` AND `|ball.y| ≤ BOX_WIDTH/2` | **0.195217** [0.166228, 0.223515] |
| ~~shot-against~~ | — | **DROPPED at P1 (non-monotone) — NOT used** |

* **RAW event-rate deltas** (reported): `Δdeep = E[nDeep | VAC] − E[nDeep | OCC]`,
  `Δbox` likewise (per-window means, match-cluster CI).
* **Goal-value conversion**: window goal value = `nEvents · L`. The **PRIMARY
  pricing surrogate = DEEP entry** — the direct rest-defence unit (the job IS
  preventing opponent progression into your third), dense (tighter cluster CI),
  and it **avoids the deep⊃box double-count** (box entries are near-nested in deep
  entries; P1 §2.2 warns that using more than one surrogate double-counts one
  conceded goal). The **box-priced** price is reported in PARALLEL as a secondary,
  non-gating figure. The two are **never summed**.
* **⚠ FLAG (surfaced for the commander, not silently reinterpreted):** P1 §2.2
  PROPOSED **box entry** as the primary (the severity knee) but DEFERRED the
  per-channel primary designation to the consumer stage (#100.3). A4-P1 designates
  **deep** as the gate's primary for the reasons above (rest-defence-natural,
  dense, double-count-free). If the commander prefers box as primary, the census
  publishes box-priced in full and the gate can be re-read at box with no re-run.

---

## §4 — THE FROZEN GATE (verbatim discipline; smoke data may NOT inform it)

Read at the **PRIMARY `W_price = 10 s`**, on the **POOLED primary cell**
(deep-priced), match-cluster bootstrap (cluster = match seed, `B = 2000`,
`BOOTSTRAP_SEED = 100003`). PASS to A4-P2 requires **ALL THREE** legs:

```text
(i)   RESOLVED — the pooled primary vacancy price
      P* = E[deep-priced downstream goal value | VACANT] − E[… | OCCUPIED]
      has match-cluster bootstrap CI LOWER BOUND > 0.

(ii)  MONOTONE — over the pre-registered vacancy-DURATION bins
      (edges 4 s, 10 s from the P0 published lag grid):
        bin0 = vacDurS ∈ [0,4)   bin1 = [4,10)   bin2 = [10,∞)
      the per-window deep-priced downstream goal-value cost c_b is
      NON-DECREASING in the point estimates:  c0 ≤ c1 ≤ c2.

(iii) LADDER RESOLVED — the (bin2 − bin0) contrast match-cluster
      bootstrap CI LOWER BOUND > 0.
```

**The predicate (exact).** `PASS := (i) ∧ (ii) ∧ (iii)`. Any leg fails ⇒ the
vacancy price is **NULL or NON-MONOTONE** ⇒ **STOP at A4-P1** (contract §4): the
frontier claim would have no measured term to enter the M3 seam through, and
building M1–M4 anyway would violate I-A3. The arc **RETURNS to the user** with the
finding (a legitimate measured outcome — the incumbent may rarely vacate its own
slot, so its own variation cannot price the absence).

**Frozen before any run.** The bin edges (4 s, 10 s), the horizon (10 s), the
binary threshold (0.5), the primary surrogate (deep), the pooled-cell definition,
and the three legs are all pinned from published grids/constants — **the sizing
smoke never informs any of them** (it sizes N only, §5).

### 4.1 CONFOUNDING — the Simpson exhibit (#94.3, reported alongside the gate)

Stratify within **context × role**: `context` = the turnover third (the loser
`d`'s `localX(ball.x)` at `t_end` → own / mid / their), `role` = the role of the
designated-slot body (`{DF, MF, WG, ST}`; GK excluded). A turnover in your own
third is intrinsically more dangerous regardless of vacancy — the stratification
removes that confound. Reported side by side:

* the **RAW-POOL** price `P*` (the gate cell), and
* the **STRATIFIED STANDARDIZED** price `P*_std = Σ_s w_s · price_s` (weights `w_s`
  = window share; strata with a finite within-stratum price only).

The **gate binds on the pooled primary cell** (contract §4 language, verbatim —
not silently reinterpreted). The standardized price is a REPORTED robustness
exhibit; a **sign reversal** between `P*` and `P*_std` is **FLAGGED** to the
commander (`simpsonSignReversalFlag`), never silently passed.

---

## §5 — SIZING BEFORE FLOORS (the smoke, the N rule, the wall cap; no optional stopping)

The census is a GATED population (each gate-bearing cell — the pooled price, and
the sparsest ladder/stratum cells — must resolve), so a floor is sized before it
freezes. A sizing smoke is **genuinely needed**: the turnover-window rate, the
vacant-vs-occupied split, the top-duration-bin population, and the per-match
vacancy-price σ are all UN-published.

* **THE SIZING SMOKE (labelled, NON-GATING, disjoint).** 40 matches on
  `11,700,000 + k, k ∈ 0..39`, enriched eye-null, X-DET double-run, writing its
  own JSON path. It publishes: the per-match window/turnover populations, the
  VACANT/OCCUPIED counts, the **duration-bin populations** (the attainability-knee
  input), the context×role stratum populations, the realized **pooled price σ̂**,
  and the FROZEN N arithmetic. These size the census; they **never gate or
  verdict** and never touch the §4 predicate.

* **THE FROZEN N ARITHMETIC.** `MDL = min(0.5·|price_smoke|, 0.01)` goal-value
  units (mirrors P1's minimum-detectable-lift form). `SE_N = σ̂·√(1/N)`; resolve
  the primary at ~95 % power ⇒ `SE_N ≤ MDL / POWER_Z`, `POWER_Z = 3.605`
  (`z_.975 + z_.95`, the battery §6.1 form). `N* =` the smallest **200-step** N
  meeting that, **CAPPED at N_MAX**.

* **THE WALL-DERIVED N_MAX (I-A6).** `N_MAX =` the largest 200-step N whose
  projected total wall (`N · per-match wall · 2` for X-DET) ≤ **12 hours**,
  itself hard-capped at **8,000/arm** (which keeps the census band `≤ 11,807,999`,
  strictly inside the reserved 11.7M–12.3M freeze). If `N* > N_MAX` the cap binds
  and the reduced-power disclosure is recorded BEFORE the gate-bearing run.

* **THE ATTAINABILITY-KNEE (I-A6).** The sparsest gate-bearing cell is the top
  vacancy-duration bin (bin2, `vacDurS ≥ 10 s`). The smoke publishes its projected
  population at `N*`; if it (or the VACANT cell) is structurally too rare to
  resolve even at `N_MAX`, that cell is PUBLISHED under-powered and its leg reads
  **UNRESOLVED** at the gate ⇒ the gate **STOPS** (an honest finding: the incumbent
  rarely vacates its own slot). No re-cut.

* **N fixed before the run; optional stopping foreclosed (#105.4).**

---

## §6 — SEEDS (inside the ratified 11.7M–12.3M freeze, #125.6; stats from 100003 up)

```text
SIZING SMOKE   11.7M   11,700,000 + k,  k ∈ 0..39                (40 matches; disjoint from census)
CENSUS         11.8M   11,800,000 + k,  k ∈ 0..N−1               (N ≤ 8,000 ⇒ max seed ≤ 11,807,999)
stats seeds    bootstrap 100003   ·   permutation 100103 (reserved-unused — no dispersion statistic)
bootstrap      2000 resamples (P1 / battery form)
```

**Disjointness (HARD, computed from the frozen family constants).** Smoke
`[11,700,000, 11,700,039]` and census `[11,800,000, 11,807,999]` both lie strictly
inside the reserved band `[11,700,000, 12,300,000]` (a ratified freeze, #125.6 —
this brief never outranks it), and the smoke band ends below the census base
(mutually disjoint). Stats seeds `100003 / 100103` are drawn from the 1000xx
family per the contract §5 reservation. **A ratified freeze outranks any dispatch
brief (#117):** the seed pins here are inside 11.7M–12.3M by construction.

---

## §7 — DELIVERABLES + GATES TABLE

| deliverable | gate class | predicate / disposition |
| --- | --- | --- |
| **(a) the pooled primary price** `P*` (deep-priced, W=10, VACANT−OCCUPIED) + raw event-rate deltas | **THE FROZEN GATE (§4)** | PASS iff (i) `P*` CI lower > 0 AND (ii) `c0 ≤ c1 ≤ c2` AND (iii) (bin2−bin0) CI lower > 0. Else STOP at A4-P1, return to the user. |
| **(b) the vacancy-duration ladder** (bins `[0,4)/[4,10)/[10,∞)` s) | gate legs (ii)+(iii) | per-bin deep-priced cost + `(bin2−bin0)` contrast CI (§4) |
| **(c) the Simpson exhibit** (context×role) | output (reported) + **flag** | raw-pool vs standardized side by side (#94.3); sign reversal FLAGGED, never silently passed (§4.1) |
| **(d) the box-priced parallel** + `{6 s, 15 s}` sensitivity | output (labelled) | non-gating; the gate reads deep-priced at 10 s ONLY |
| **(e) the sizing smoke** | output (labelled) + **X-DET (HARD)** | window/turnover/bin/stratum populations, σ̂, the frozen N; never gates a verdict (§5) |
| **fidelity** | **X-DET (HARD)** | census + smoke each twice byte-identical; output JSON SHA'd + quoted |
| **seed disjointness** | **HARD** | smoke/census inside `[11.7M,12.3M]` and mutually disjoint (§6) |
| **Road B** | **X-SRC-ZERO (HARD)** | `git diff --stat -- src` empty; fingerprint `57b0bdab…c673` unchanged; probe changes no `src/**` |

**RECEIPTS (per-record, #49.3).** Capped 1,000/class, first-N deterministic:
`turnover-window` `{seed, tick, gid = slot-body gid, cause = "d{d} vacFrac=… vacDur=…s ctx=…"}`;
`deep-entry-against` / `box-entry-against` `{seed, tick, gid = opponent owner gid, cause = "d{d} lx=…"}`.
`X-CORPUS-IDENT` is **N/A** (a fresh observational corpus has no identity target —
the P1 §4 precedent). Any X-family gate fails ⇒ FAIL, stop at the commander.

---

## §8 — THE PRE-LAID READINGS (the full sign space; none re-cut after sight)

* **(A) PASS — monotone, resolvedly nonzero vacancy price.** All three gate legs
  hold. Disposition: A4-P1 proceeds to A4-P2 (the dormant build) on the #126 green
  path — commander review + a numbered ruling gate the transition; the arc does
  NOT return to the user on PASS.
* **(B) STOP — resolved but NON-MONOTONE** (leg ii or iii fails). The price
  exists but does not rise with vacancy duration — the vacancy is not the
  operative cost. Disposition: STOP at A4-P1, return to the user (contract §4).
* **(C) STOP — NULL** (leg i fails; CI spans 0). No resolved excess concession
  attributable to vacancy on the world's own variation — often because the
  incumbent rarely vacates (the attainability-knee, §5). Disposition: STOP at
  A4-P1, return to the user; no measured term for the M3 seam (I-A3).
* **(D) STOP — an X-family gate fails** (X-DET / X-SRC-ZERO / seed disjointness).
  Disposition: FAIL, stop at the commander (measurement invalid; Road B is the floor).
* **(E) SIMPSON SIGN REVERSAL** — the pooled price and the standardized price
  disagree in sign. Disposition: the pooled cell governs the gate (§4), but the
  reversal is FLAGGED and surfaced for the commander (not a silent pass).
* **(F) SENSITIVITY DISAGREES** — the `{6 s, 15 s}` reading moves the price
  materially. Disposition: PUBLISHED as labelled data; the primary 10 s reading
  governs (frozen).

---

## §9 — REGISTERED NON-CLAIMS + THE STAGE EXIT

* **A4-P1 PRICES ABSENCE, BUILDS NO CONSUMER.** No M1–M5 mechanism, no assignment
  gene, no seam consumption (A4-P2/P3). It measures the vacancy price on the
  world's own variation and nothing more.
* **PERCEPT-HONESTY IS N/A** (read-only; no percept created or read).
* **NOTHING SHIPS (Road B).** EDS flags dormant, `c6Carry`/`c7Windup` probe-only,
  `stationEye` null, the fingerprint `57b0bdab…c673` unchanged throughout.
* **THE ADMITTED PRICES ARE LABELLED** (P1's, #100/#101); the vacancy variation is
  measured FRESH on the A4-P1 census.
* **A4-P1 CANNOT authorize A4-P2.** Only the commander's review of the census
  result opens A4-P2 (#126.2); a null/non-monotone price STOPS the arc here.

**⭐ THE STAGE EXIT.** On PASS the arc advances to A4-P2 on the #126 green path
(commander review + a numbered ruling, no user wait). On any STOP/FAIL — the
null/non-monotone price gate (readings B/C), an X-family failure (D), or a flagged
Simpson reversal escalated by the commander — the arc RETURNS TO THE USER with the
finding. The commander presents in plain Chinese. **This stage measures the
vacancy price; it builds no mechanism.**

---

**FREEZE HONESTY.** Every criterion above was written citing ONLY already-published
sources: the A4 contract §3/§4/§8; rulings #125 / #126 / #109.3 / #109.4 / #94.3 /
#68.2 / #26.5 / #20 / #46.2 / #48.4 / #105.4 / #117; the P3p-3 battery I5(b)
instrument (`stage3-v4-p3p3-battery.ts:757–763`, `restSlotShare:812`); the P1
calibration probe surrogate detectors (`stage3-v4-p1-calibration.ts:326–344`) and
its §RESULT admitted prices (deep 0.043455, box 0.195217; shot-against dropped);
the production fingerprint `57b0bdab…c673`. **No `docs/world-model/data/*.json` was
opened and nothing gate-bearing was run before this document is committed** (a
bounded 3-match preflight writing OUTSIDE the repo, `xDet null`/`xSrcZero true`,
proved the probe executes and emits records; its scratch output was deleted and no
canonical data file exists). This freeze + probe commit locally and DO NOT push.
