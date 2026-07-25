# EDS E2b-0 — Threat calibration (the common axis)

Status: **RUN 2026-07-25 — §6 is the frozen result: PASS on every gate.**
Drafted by the autonomous session
under commander ruling #8, which authorised E2b to proceed on E2a-2's PASS
without a new ruling; constraints (c)–(l) in
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3.

Date: 2026-07-25

## 1. Why E2b splits, and why here

Ruling #7 (c) specifies E2b's evaluator as "E0's corridor pricing PLUS the
touch-difficulty term made real by E1b's curve", and ruling #8 (l) requires the
choice A/B to run over **executable** options while blind options stay priced.
Putting those two together exposes a gap neither ruling had to settle:

```text
a blind option      priced at 55.72%          — a probability (E2a-2's marginal)
a seen option       corridor threat in SECONDS + a touch-fail probability
```

Those do not compare. E0 deliberately refuses a scalar score (S7a, and S4a's
finding that `controlProbability` was far too under-dispersed to be one), so
there is no existing total order to choose with — and **inventing a weight to
combine seconds with probabilities is precisely the invented constant ruling #8
rejected** when it threw out pessimism-by-construction. The amount of
information a corridor read carries can only come from a measurement.

So E2b splits, on the same instrument-first principle the commander has now
applied three times (E1a→E1b, E2a-1→E2a-2, and here):

* **E2b-0 (this contract)** — census what the evaluator's corridor read is
  actually worth, by measuring realized outcomes against the read that
  predicted them. Output: a calibration curve that turns the physical read into
  a probability on the *same axis* as the band prior, so a seen option and a
  blind one can finally be compared without a hand-set weight.
* **E2b-1 (drafts on this PASS)** — the both-sides perception A/B, consuming
  that curve.

## 2. What is measured

E2a-2's fork-and-force harness, **reused verbatim with one extra logged
column**. At each sampled plain-ground-pass moment the passer's own
`PerceptionSnapshot` is built at awareness 0.8 (E0's setting), every outfield
teammate at 6–30 m is enumerated, and before the fork the E0 evaluator prices
that candidate from the passer's perceived state. Then the world is forked, the
target substituted, and the realized outcome recorded exactly as E2a-2 did.

```text
logged per candidate, in addition to E2a-2's outcome classes:
  interceptionThreatSeconds   E0's corridor read (higher = more threatened)
  touchFailPrior              E1b's curve through the certified formula
  flightSeconds, arrivalSpeed
  priced                      whether the evaluator could read it at all
```

The census then reports realized reception success by **quintile of predicted
threat**, plus the same for the touch term, over set A, held out against set B.
Quintiles rather than deciles because ~1,760 forks per bin is a measurement and
~880 is a rumour.

Sets, frozen: **A = seeds 700,000+**, **B = 710,000+**, 4,500 moments each —
identical to E2a-2, which is what makes X5 below a real reproduction gate.

## 3. Authorised seat

* New probe `scripts/probes/eds-e2b0-threat-calibration.ts`.
* `src/ai/passPrior.ts` — the calibration table added as data, alongside the
  two census tables already there.
* No other `src/**` change. No new sim seam: E2a-2's `forcedPassTarget` is
  reused as it stands. Zero live callers, fingerprint unchanged.

## 4. Frozen gates

### EXACT

```text
X1 production fingerprint 57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical            shared SHA-256
X4 zero live callers (audited)
X5 REPRODUCTION — the outcome census must reproduce E2a-2's banked
   option-space table EXACTLY, field by field, table and marginal:
   the staging and seeds are identical and only a read-only column was added,
   so anything else means the evaluator call perturbed the world
X6 the committed calibration table equals this run's census
```

X5 is the gate that makes the extra column safe. E2a-2 established what this
staging measures; if adding an observation changes it, the observation is not
an observation.

### C1 — COVERAGE

```text
every quintile        n >= 1,200 per set
priced share          reported; a candidate the evaluator cannot read at all is
                      its own class and is never silently binned
```

### C2 — DISCRIMINATION (interval test, powered ex ante)

```text
| realized success in the best-threat quintile
  − realized success in the worst-threat quintile |   >= 10.0pp
```

The **sign is reported, not gated** — ruling #8 (j)'s lesson. What is gated is
that the corridor read *discriminates outcomes at all*: a calibration curve
over a read that predicts nothing is not a curve, and E2b-1 would be building
its chooser on noise. The 10.0pp floor is derived as under half of E0's banked
21.2pp measured opponent-first swing from per-state threat ranking, so it is
conservative against a quantity the world has already shown at larger scale. At
n ≈ 1,760 per bin the standard error of that difference is 1.69pp, so 10.0pp is
≈5.9σ — it cannot fail on noise.

### C3 — HELD-OUT CALIBRATION (interval test)

```text
per quintile   | success_A − success_B |  <= 5.0pp        (≈3.0σ at n ≈ 1,760)
marginal       | success_A − success_B |  <= 2.0pp
```

### Reported, never gated

```text
R1 the calibration curve itself — realized success per threat quintile, and the
   same per touch-prior quintile
R2 WHICH READ CARRIES MORE: the spread the corridor read achieves against the
   spread the band prior achieves on the same forks. If the band prior wins,
   E2b-1's chooser should lean on memory over corridor geometry, and that is a
   finding about what perception is FOR
R3 the unpriceable-but-executable share: candidates in the snapshot whose
   flight the evaluator still could not price (E2a-1 found 0 of these on its
   states; over the full option space it may not be 0)
R4 look-pressure precursor: how often the blind marginal out-prices the best
   executable option once both are on the calibrated axis — ruling #8 (l)'s
   statistic, measurable here for the first time
```

## 5. Stop rules

* **X5 fails** → adding the evaluator read perturbed the world; the column is
  not read-only. Revert and report; nothing in the census may be used.
* **C1 fails** → a quintile is under-sampled; report, do not merge bins after
  seeing results.
* **C2 fails** → the corridor read does not discriminate outcomes. That is a
  substrate finding of the first order — it would mean E0's P1/P5 success was
  specific to per-state ranking and does not survive the option space — and it
  stops E2b-1, because a chooser needs something real to choose on. Report to
  the commander; **do not substitute another read to make the gate pass.**
* **C3 fails** → the curve does not generalise; report, never re-bin or re-seed.
* No reported number may be converted into a gate afterwards, and the
  calibration table, once committed, is infrastructure: never adjusted after
  any E2b-1 result.
* **On PASS, E2b-1 drafts** — the both-sides A/B, whose shape is already fixed
  by ruling #7 (c)–(g) and #8 (l): flagged perceived-state consumers on BOTH
  sides default-off, choice over executable options by the calibrated axis,
  not-looking-must-not-win as monotone non-decreasing realized quality across
  awareness arms, the route-mix gate against S3b's collapse signature, and the
  PERF hard gate at brain cadence against `docs/perf/baseline.json`
  (5.32 µs/step, p95 9 µs).

## 6. FROZEN RESULT — PASS; seeing the lane is worth six times remembering the distance (2026-07-25)

Run at HEAD `439688b`. Verdict **PASS**: 3/3 exact, 1/1 coverage, 1/1
discrimination, 2/2 calibration.

> **Sync note (ruling #5).** While this census was running, six commits from
> another session landed on top of `439688b` — Track F art direction (F0/F1/F1b/
> F1c) and Track D6. They touch `src/render3d`, `src/game`, docs and tests, and
> **zero** files under `src/sim`, `src/ai` or `src/evolution`, which is why the
> production fingerprint is unchanged and why the suite grew from 714 to 721
> tests. No step ID collides: Track F is art direction, this is Track E. The
> census was nonetheless re-run at the post-merge HEAD and returned the same
> SHA, so the result holds at both. Two invocations byte-identical, shared SHA
`fdd6a1ad54306b156be58c5f9b082ffdcbdde55f85c715b4e8bac03b3d65eca2`.
Calibration SHA `52c10713…3082`.

```text
X1 fingerprint 57b0bdab…c673 unchanged                       ✓
X2 tsc + build clean · full suite green                      ✓
X3 two invocations byte-identical                            ✓
X4 zero live callers (audited)                               ✓
X5 harness 3/3 bit-identical                                 ✓
X5 outcome census reproduces E2a-2's banked table exactly    ✓
X6 committed calibration equals this run's census            ✓
C1 every quintile >= 1,200 per set (2,019 / 2,049–2,052)     ✓
C2 discrimination                                            ✓  39.72pp of 10.0
C3 held-out calibration                                      ✓  worst 2.18pp of 5.0
```

The second X5 line is the one that licenses everything else: adding the
evaluator column returned E2a-2's option-space table **field for field**, so
the observation really was an observation.

### R1 — the calibration curve

```text
threat quintile (predicted corridor slack, s)   n      realized success
 −2.017 … 0.039                               2,019       82.86%
  0.039 … 0.296                               2,019       62.31%
  0.296 … 0.536                               2,019       50.97%
  0.536 … 0.806                               2,019       47.15%
  0.806 … 2.945                               2,019       43.14%
```

Monotone across all five bins, spanning **39.72pp**, and it generalises: the
held-out set disagrees by at most 2.18pp per quintile and 0.12pp on the
marginal (57.29% vs 57.17%). The sign is the one E0's P1/P5 found — more
predicted corridor threat, less realized success — now confirmed on the option
space rather than on per-state ranking, which is the thing C2 existed to check.

The touch term discriminates too, but less and unevenly: 70.48 / 60.43 / 51.61
/ 52.15 / 51.76 — an 18.7pp spread that goes flat after the second quintile.

### R2 — which read carries the information

```text
corridor read (E0's threat)     39.72pp of spread
distance band (E2a-2's prior)    6.64pp of spread
```

Same forks, same outcomes, two predictors. **Seeing the lane is worth about six
times knowing how far away the man is.** The band prior is not wrong — its bins
run 54.33 / 55.72 / 55.87 / 59.53 / 60.97, directionally correct — it is simply
weak.

This lands directly on ruling (k). That ruling gave a within-retention memory a
banded price and a fully-unknown man the marginal, and asked what memory is
worth; the answer is that the *band* is the small half of it. What memory
really buys is not the distance but the **corridor read that only a current
percept supports** — which is the substrate argument for looking, stated in
outcomes rather than in principle, and it is what E2b-1's chooser should lean
on wherever it exists.

### R3 — a quarter of playable options cannot be priced at all

```text
playable forks                14,114
priced by the evaluator       10,095   (71.52%)
unpriceable                    4,019   (28.48%)
```

E2a-1 found **zero** of these on its 120 narrow states, where the target was
always the nearest near-stationary man. Over the full option space it is more
than a quarter. These are candidates the fork plays perfectly well but whose
flight the evaluator cannot read, so they are neither "seen and priced" nor
"absent and marginal" — a third class the pricing layer currently folds into
the banded case. E2b-1 must decide explicitly what a remembered-but-unreadable
option is worth; folding it in silently would be the same mistake E2a-1 made
with the population.

### R4 — look-pressure will be real

```text
a blind option                                   55.72%
the mean band price of an executable option      55.81%
```

Indistinguishable. On the band axis alone a passer is nearly indifferent
between a man he cannot see and the average man he can — so if that were the
whole evaluator, not-looking would cost almost nothing and ruling #8 (l)'s
look-pressure statistic would be noise. It is only once the corridor read joins
the axis, spreading executable options from 43% to 83%, that looking pays. That
is the causal seat ruling #8 (l) named, now with a number on both sides of it.

### What E2b-1 inherits

A committed, held-out-validated curve that turns E0's corridor read into a
probability on the same axis as the band prior — so a seen option and a blind
one can finally be compared without a hand-set weight, which was the gap that
forced this split. Plus three constraints its drafting must answer: the
corridor read is the dominant term (39.72pp vs 6.64pp), 28.48% of playable
options carry no read at all and need an explicit class, and look-pressure is
entirely a function of the read rather than the band.

Per §5, **E2b-1 drafts on this PASS.**
