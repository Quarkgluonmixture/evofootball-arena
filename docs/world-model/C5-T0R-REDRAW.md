# C5 T0R — The two fired gates, redrawn on their honest objects

Status: **PRE-REGISTERED 2026-07-27 — gates frozen in §3 before the fresh-block
run.** Drafted by the autonomous session under **commander ruling #27**
(narrow: the two gates only; passing gates transfer; the stratified diagnostic
is authorized to DESIGN A3R and never to re-judge run 1).

Date: 2026-07-27

## 1. What is being redrawn, and what is not

T0 run 1's **FAIL stands as history**. Its passing results **transfer** and are
re-earned here rather than assumed:

| transferred | how it is carried into T0R |
| --- | --- |
| X-series 6/6 | still pinned by `tests/c5HoldMechanics.test.ts` — identity, seed-independent |
| A1 (95.81%) | **re-run as a live gate** at the same ≥ 90% threshold, on the fresh block |
| A2b (68.81%) | **re-run as a live gate** at the same < 0.90 ceiling |
| A2c (stamina) | **re-run as a live gate**, same predicate |

Nothing else in T0 is reopened. No new capability is built; `src/**` is
untouched by this stage.

## 2. The diagnostic, and what it settled (ruling #27.3)

`scripts/probes/c5-t0r-stratified-diagnostic.ts`, run on the frozen block
(830,000+, 10,000 holds, 63 clusters, twice byte-identical, SHA
`55eecc2a…ea85`). Adjustment set declared before the run: **stratify by
pressure band; role secondary.** Purpose: design A3R.

### 2.1 ⛔ My named confound is REFUTED

T0 §6.2 offered "strength skews toward high-pressure moments" as the leading
candidate. Measured, the attrs are **flat across the bands**:

```text
band 0   mean strength 0.391   mean dribbling 0.421
band 1                 0.394                  0.433
band 2                 0.386                  0.421
```

There is no skew to confound with. **The explanation I labelled was wrong**, and
the diagnostic that ruling #27.3 authorized is what says so.

### 2.2 ⭐ The real finding: the substrate grades a held ball by DRIBBLING, and
strength reads backwards

Tackle-loss by attr tercile, **within** each pressure band:

| band | by **strength** (bottom / mid / top) | Δ | by **dribbling** (bottom / mid / top) | Δ |
| --- | --- | --- | --- | --- |
| 0 | 2.39 / 4.26 / 3.64% | **+1.24pp** | 4.07 / 3.55 / 2.70% | **−1.38pp** |
| 1 | 13.00 / 15.29 / 15.33% | **+2.33pp** | 16.82 / 14.86 / 12.37% | **−4.45pp** |
| 2 | 20.74 / 22.77 / 24.36% | **+3.63pp** | 25.57 / 20.43 / 21.87% | **−3.70pp** |

**Stronger holders are tackled MORE, in every band. More technical holders are
tackled LESS, in every band.** Neither is a band artefact — §2.1 killed that.

### 2.3 And the code said so first, which is why A3R is derivable ex ante

Ruling #27.3 asks A3R to gate "where the substrate says the gradient should
live". `mechanics.ts:1780–1793`, the standing challenge that resolves a held
ball, prices the carrier's protection as:

```text
− owner.attrs.dribbling · 0.18      ← dominant
− owner.attrs.strength  · 0.10
− owner.attrs.pace · drive · 0.16   ← drive ≈ 0 during a hold: OFF by construction
```

and the slide path (`1626`) prices `− dribbling · 0.10` and no strength at all.

**So `dribbling` carries nearly twice strength's weight in the one formula that
resolves a held ball, and the pace term — which would have been the largest —
is switched off by holding still.** T0's A3 gated on `strength`: the third
term, at half the weight, in a formula it never read. That is the defect,
derivable from the code without any data, and the diagnostic merely confirms
its sign.

⚠️ Labelled, untested, and **not** pursued: the natural reason strength reads
*reversed* rather than merely weak is that squad generation likely trades
physical against technical attributes, making strength terciles partly inverse
dribbling terciles. A3R does not depend on this being true — the code, not the
correlation, is what selects the attr — so it is recorded and left alone.

## 3. Gates

Judged on a **FRESH seed block, 840,000+**, budget **12,000 forced holds**. The
frozen block above has been seen, so it may derive power and may not judge —
C3R's discipline, verbatim.

| gate | claim | predicate |
| --- | --- | --- |
| **A2aR** | the world grades a held ball by pressure, on the channel pressure drives | **tackle-loss strictly increasing** across the three frozen bands, each consecutive step's 95% cluster-bootstrap CI on the difference entirely **> 0** |
| **A3R** | the hold is attr-graded, stratified by construction | the **band-weighted within-stratum** gradient of tackle-loss by **dribbling** tercile (top − bottom) has its 95% cluster-bootstrap CI entirely **< 0** (protective) |
| **A1** (transfer) | the shield is a body position | far-side ≥ **90%** of held ticks |
| **A2b** (transfer) | I1's ceiling | top-band survival < **0.90** |
| **A2c** (transfer) | holding costs legs | stamina/s > 0 and rising across bands |
| **D** | determinism | two runs byte-identical, SHA emitted |

### 3.1 Power, derived from the frozen rates (#19), stated not assumed

- **A2aR** — the smallest step is band 1 → 2, 14.59% → 22.60% = 8.0pp. At the
  observed band n's its naive SE is ≈ 1.09pp, i.e. **≈ 7σ**. Enormously
  powered; **the frozen band cuts therefore stand** (ruling #27.2's condition
  for re-deriving them is not met).
- **A3R** — the band-weighted gradient on the frozen data is
  `(2064·−1.38 + 1357·−4.45 + 6579·−3.70)/10000 = **−3.32pp**`, with an overall
  SE ≈ 0.94pp at n ≈ 3,330 per tercile — **≈ 3.5σ** already. Detecting −3.32pp
  at 80% / α = 0.05 needs `SE ≤ 3.32/2.8 = 1.19pp` ⇒ **n ≥ 6,400**; the 12,000
  budget carries a **1.9× margin** for cluster inflation.
- **Attainability**: a forced hold is stageable at any ball-owner tick, so both
  floors are budget-bound, not population-bound (the #24 check, as at T0).

### 3.2 Why A3R gates on a CI and not on a magnitude

A magnitude floor is what killed A3: a number chosen without checking what the
data could resolve. #20's CI semantics answer the question that matters —
*is the substrate's grading real* — and the magnitude is **reported beside it**
so a real-but-tiny gradient can be seen for what it is rather than passed or
failed by a threshold nobody powered.

## 4. Stop rules

- **A2aR fails** ⇒ the world does not grade a held ball by pressure even on the
  tackle channel. That is a substrate finding, not a gate defect, and it
  returns to the commander.
- **A3R fails** ⇒ ruling #27.3's own words apply: *"a decorative attr term in
  tackle resolution, a VISION §1 dead-attr candidate"* — an undifferentiated
  option is decoration (C1-A2), and this is **a C5 blocker until the substrate
  grades holding by something**. Returns to the commander.
- **Any transferred gate fails** ⇒ the transfer was not real; FAIL and return.
- No third redraw of these two gates without a ruling.

## 5. What T0R does not do

- No `src/**` change: the capability built at T0 is what is being measured.
- No re-judging of run 1, whose FAIL is history.
- No new gate on anything but the two redrawn objects and the four transfers.
- On **PASS**, ruling #27.5 lets T1 (the waiting census) pre-register without a
  new ruling; C4 T0 runs after T0R lands either way (one experiment in flight).

## 6. Result

*(To be filled in after the fresh-block run, in a separate commit.)*
