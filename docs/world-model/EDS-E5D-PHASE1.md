# EDS E5d Phase 1 — The attempt axis, censused where it is deployed

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#18.4**, constraints (a)–(e). Nothing here may be tuned after first sight of
results.

Date: 2026-07-26

## 1. What Phase 0 settled and what it left

Phase 0 answered #17.4 yes: the attempt axis restores the ordering sign
(+2.02pp against reality's +3.18pp, where the composition scored +0.05pp) and
**70 real decisions changed hands** (argmax picks the licensed runner
23.78% → 39.33%). It also fired two gates, and ruling #18 disposed of both:
X6 closed the E5a file (its V table was depressed 1.91pp, relative 27%, by a
late window start plus the zero-value convention), and C3's near-miss became
the house law's third appearance — **a table is honest only on the population
it is deployed on**.

Phase 1 is that correction, plus the live swap.

## 2. What is measured

### 2.1 The population (constraint a)

**Licence-triggered decision moments**: a plain ground pass moment at which at
least one window candidate carries the legacy loop's own third-man or
wall-return licence. At each, the **full candidate set** — licensed and not —
is enumerated and fork-and-forced. Both arms come from the same moments, as in
E5c (b) and Phase 0.

> ⚠️ **A boundary I want on the record, stated before the run and not as an
> excuse afterwards.** The live chooser runs at EVERY plain-ground-pass moment,
> not only licence-triggered ones, so "deployment population" admits two
> readings: the moments where the chooser fires (all of them), or the moments
> where its errors were measured and where watchability is decided (these).
> Ruling #18.4 (a) names the second, and this contract follows it. To keep the
> question answerable by measurement rather than argument, **the same
> calibration is computed on the GENERAL population and REPORTED (never
> gated)** — so if aligning one end misaligns the other, the number says so
> instead of the audit discovering it downstream.

### 2.2 The quantity (constraint b)

```text
EV̂(option) = P(the passing team takes a shot within 240 ticks OF THE KICK
              | this pass is ATTEMPTED, destination cell × threat band)
```

Every fork's window is simulated and counted — clean, spilled, intercepted,
never-adjudicated alike. **No adjudication conditioning anywhere**, which is
what makes both E5a defects structurally impossible here rather than merely
absent.

### 2.3 The features (constraint c)

**Destination cell × threat band**, the two validated axes: E5a's eight zones ×
E2b-0's five threat quintiles, the passer's own corridor read from his own
snapshot at awareness 0.8. Frozen fallback ladder, as Phase 0:
**(cell × band) → cell → marginal**, at a 200-attempt floor.

**The pattern-state feature is deliberately NOT added.** Ruling #18.4 (c): at
deployment-population frequencies part of Phase 0's +3.4pp premium is absorbed
naturally, and the feature question returns only if third-man still misses.

### 2.4 The staging, and why it needs its own pin

Phase 0 cloned the world every tick. This population is ~9× rarer per match, so
the same staging would cost hours. Phase 1 uses E5c's proven two-walk staging —
scout the pass ticks, then replay and clone only there — and, per ruling #18.2's
codification, **pins the staging SEPARATELY from the definition, one gate per
claim**: S1 below compares stagings with the definition held fixed, D1 below
compares definitions with the staging held fixed. That is the direct lesson of
writing X6 twice as a mixed gate.

### 2.5 The swap and the audit (constraint e)

Table committed as SHA'd data; `pricePassOption` under `edsValueAxis` returns
**EV̂ itself** — the composition is removed, not re-weighted, so `price = V̂` and
the reception half survives only as a reported diagnostic. Then
`eds-e5b-value-axis-audit.ts` **verbatim and unedited**, and on a PASS the queue
stops at **E4 round 2**.

## 3. Authorised seat

* New probe `scripts/probes/eds-e5d-p1-deployment-census.ts`.
* `src/ai/passPrior.ts` — the attempt table as new committed data; E5a's and
  E5c's tables stay untouched so their own gates keep reproducing.
* `src/ai/perceivedPassChoice.ts` — the axis swap, behind the existing flag.
* `tests/valueAxis.test.ts` — the pins follow the axis they guard.
* **`scripts/probes/eds-e5b-value-axis-audit.ts` MUST NOT BE EDITED.**
* No other `src/**` change. Flags default OFF, fingerprint unchanged.

## 4. Frozen gates

### EXACT — one gate per claim

```text
X1 production fingerprint 57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical                     shared SHA-256
X4 zero live callers of the probe; the only src changes are the committed
   table and the flagged axis swap
X5 HARNESS — forcing the target the brain itself chose replays the match
   bit-identically on three seeds (E2a-2's gate, inherited verbatim)
S1 STAGING PIN, definition held fixed — over a common seed block the two-walk
   staging and Phase 0's per-tick-clone staging must produce IDENTICAL attempt
   records (moment, cell, band, reached, adjudicated, clean, shot), in order
D1 DEFINITION PIN, staging held fixed — over Phase 0's own population and seed
   block this probe's window must return Phase 0's banked attempt marginal
   EXACTLY: 14,114 attempts at 0.06327051154881677
T1 the committed table equals this run's census
```

S1 and D1 are the same experiment split in two, which is the whole point: X6
failed twice because one gate carried both claims and could not say which had
moved.

### C1 — COVERAGE

```text
gated buckets   >= 200 attempts per (cell x band) in BOTH sets · >= 8 gated
under-filled buckets take the frozen ladder and are REPORTED, never merged
after seeing results
```

### C2 — HELD-OUT CALIBRATION ON DEPLOYMENT MOMENTS (constraint d)

The gate C3 missed by 0.08pp in Phase 0, now on the aligned population and
powered before the fact:

```text
pattern arm   | mean EV̂ − realized |  <= 2.0pp
control arm   | mean EV̂ − realized |  <= 2.0pp
marginal      | mean EV̂ − realized |  <= 1.0pp
```

Powering: at p ≈ 0.08 a 2.0pp band needs SE ≲ 0.7pp, i.e. **n ≥ 1,500 attempts
per arm** on the held-out set — a floor this contract meets by construction
(C1's budget yields ≈1,700 attempts per 450 moments, and the held-out set runs
to the same budget as the census). **The band is NOT widened** (ruling #18.3);
the population is aligned instead.

### C3 — THE AXIS IS A MEASUREMENT

```text
discrimination   | best gated bucket − worst gated bucket |  >= 5.0pp
held out         | EV_A − EV_B |  <= 5.0pp per gated bucket, <= 1.5pp marginal
```

### THE LIVE AUDIT — `eds-e5b-value-axis-audit.ts`, verbatim

Every gate as that file already carries them, unedited:

```text
Y4V flag-off identity      0 disagreements / 10,292 · 7/7 banked families
§2 band                    goals ±15% · crosses/headers/long balls/cutbacks ±25%
                           and the flags-off arm reproducing all five to 4 dp
no-strict-dominance        20% <= share <= 80%
perf                       mean <= 1.25x · p95 <= 1.50x
H1 third-man   >= 0.85x    H2 overlap  >= 0.70x
H3 forward share >= −2.0pp H4 shots    >= 0.97x
```

H1–H4 are E5b's own frozen gates and are **not** re-derived here. The whole
slice has been trying to pass them; moving them now would be the one thing that
makes the attempt worthless.

### Reported, never gated

```text
R1 the attempt table itself, both sets, with the bucket census beside it
R2 the SAME calibration on the GENERAL population — the boundary in §2.1,
   answered by measurement
R3 the argmax comparison Phase 0 ran, re-measured on the deployed table
R4 the six watchability instruments arm for arm, and the E4 round-1 reproduction
   the E5b probe already carries
R5 what happens to the reception half: it is no longer in the price, so its
   correlation with the realized outcome is reported as the record of what was
   removed
```

## 5. Stop rules

* **S1 fails** → the two-walk staging is not Phase 0's staging. Withdraw it and
  re-run on the slow staging; do not reconcile after seeing numbers.
* **D1 fails** → the window or the conditioning moved. My defect; fix and re-run.
* **C2 fails on the aligned population** → the misalignment was not the
  population, and that is a finding about the FEATURES, not a licence to widen
  the band. Report; ruling #18.4 (c)'s pattern-state question opens at the
  commander.
* **Any live-audit gate fails — including H1** → nothing ships, flags stay
  default OFF, E4 round 2 does not open, the fork returns to the commander. In
  particular H1 failing after an aligned census is the specific evidence that
  reopens the pattern-state feature.
* **PASS on everything** → the flags stay default OFF, the preview toggle is
  extended to arm all three together, and the queue stops at **E4 round 2, the
  user's eyes.**

## 6. Result

*(frozen on completion)*
