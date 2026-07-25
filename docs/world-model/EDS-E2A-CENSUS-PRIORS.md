# EDS E2a — Census priors and the pricing layer

Status: **PRE-REGISTERED — no run yet.** Drafted by the autonomous session
under commander ruling #7 (2026-07-25), whose drafting constraints live in
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3.

Date: 2026-07-25

## 1. The problem E2a exists to solve

E0 measured the thing that killed S3b: at awareness 0.8 the passer could price
**nothing** in 55 of 120 states, and the split was by distance — 21.7 m mean
for the unpriced against 16.8 m for the priced. Observation does not blur the
option set, it deletes ~46% of it, disproportionately the long progressive
passes. Delete those and not-looking becomes informationally superior, which is
worse than S3b.

The design contract's answer is **unseen ≠ unavailable**: an option the passer
cannot see is priced at an honest population base rate, never deleted and never
truth-fallback. E2a builds that base rate as a **measurement** and proves the
pricing layer on E0's own banked states — the instrument-first lesson in its
third application. E2b then consumes the table; it may not adjust it.

### 1.1 Discovery finding that shapes the design (pre-registration input)

Re-running E0's state acceptance and classifying every null by cause reproduces
E0's 65/55 split exactly (16.79 m priced vs 21.71 m unpriced) and finds **all 55
nulls have a single cause: `targetMissing`** — the teammate is absent from
`snapshot.players` entirely. Not a failed affordance, not an unreachable flight,
not a missing opponent: 55/55 target-missing, 0 everything else.

That settles what the prior must be indexed on. A passer who cannot see the man
also **cannot know how far away he is**, so an unseen option cannot be assigned
a distance band. It is priced at the census **marginal**. The table is banded
anyway for two reasons: a marginal is only trustworthy if the bands behind it
are real, and an OBSERVED option does have a distance, so it can carry its own
band's prior alongside E0's sharper corridor read.

## 2. Authorised seat

* `scripts/probes/eds-e2a-prior-census.ts` — new probe: census, held-out
  calibration, and the pricing-layer validation on E0's 120 states.
* `src/ai/passPrior.ts` — new pure data module: the frozen census table, with
  the census SHA in its header. No imports from `sim/`, no logic beyond a band
  lookup.
* `src/ai/passOptionPricing.ts` — new pure module: the pricing layer. Wraps
  `evaluatePassOption` and **never returns null**.
* `tests/passOptionPricing.test.ts` — hostile tests: never-null, prior options
  carry no physical fields, observed options unchanged.
* No change to any existing `src/**` file. Zero live callers: nothing in the
  live AI imports either new module. Dormant by construction.

## 3. The census

Population: every registered intended ground pass whose **kick-time
passer→target distance is 6–30 m** — E0's own candidate window, so the census
measures the option space the evaluator prices. (C1-A2's near-stationary
receiver restriction was an isolation device for a different question and is
deliberately NOT applied here; it would bias the population toward standing
receivers.)

Per pass, observed from outside the sim (`match.pendingPass` transitions plus
`ball.lastTouch`, with `traceFirstTouch` on for the adjudication record — a
flag E1a proved behaviour-neutral):

```text
band            6-10 / 10-14 / 14-18 / 18-22 / 22-26 / 26-30 m
outcome         intercepted | reachedTarget | otherTeammate | unresolved
if reached      clean first touch, split into adjudicated and clean-by-fiat
                (<=6 m/s returns clean before the roll — the registered
                substrate boundary; reported separately so the number is honest)
per band        n, interceptedRate, reachedRate, otherTeammateRate,
                unresolvedRate, cleanGivenReached, receptionSuccessRate
                (= reached x cleanGivenReached), plus a MARGINAL row
```

Sets, frozen: **census set A = seeds 610,000..610,249** (250 matches),
**held-out set B = seeds 620,000..620,249** (250 matches), disjoint. A 20-match
pilot measured 81.3 qualifying passes per match and band occupancy
310/404/350/249/180/121 per 20 matches, so set A gives ≈20,325 passes with
≈1,512 in the thinnest band (26–30 m).

## 4. Frozen gates

### EXACT

```text
X1 production fingerprint                57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical        shared SHA-256
X4 zero live callers                     no src module outside the two new
                                         files imports either of them (audited)
X5 REPRODUCTION on E0's 120 banked states — the 65 observed states must
   return E0's own numbers: threat 0.843 / 0.586 / 0.446 s, flight
   1.713 / 1.303 / 1.061 s, arrival 5.99 / 8.69 / 11.39 m/s, touch prior
   7.34% / 11.29%, safest-is-1.15 in 52/52 contested
X6 the committed `src/ai/passPrior.ts` table is EQUAL to this run's census
   output, field by field
```

X6 is built in two passes by design and that is pre-registered here, not
improvised: the first run emits the table, it is committed as data, the second
run asserts the committed copy is the measurement. Its purpose is drift
protection for E2b, which consumes the committed table and may never adjust it.

### P1 — COMPLETENESS: nothing is deleted for observability

```text
120/120 E0 states priced, at all three powers, zero nulls
source split exactly 65 observed / 55 prior — E0's banked split
every prior-priced option carries source='prior' and NO physical dimension
  (no seconds, no metres): an unknown must read as unknown, never as zero
```

### P2 — CALIBRATION: the prior generalises (interval test, powered ex ante)

The table built on set A must predict set B's realized rates:

```text
per band     | rate_A − rate_B |  <= 5.0pp
marginal     | rate_A − rate_B |  <= 1.5pp
```

Power, computed before the run from the pilot's p ≈ 0.20 interception rate:
σ_diff = √(p·q·(1/n_A + 1/n_B)) is 1.45pp in the thinnest band (n ≈ 1,512 per
set) and 0.40pp on the marginal (n ≈ 20,325 per set), so both bands are ≈3.4σ
wide — they cannot fail on noise and can fail on a prior that does not
generalise.

### P3 — NOT-LOOKING MUST NOT WIN (E2a's weak form, deterministic)

```text
mean receptionSuccessPrior of the 65 OBSERVED options
   >= the marginal prior assigned to the 55 UNSEEN options
```

Derivation from banked numbers: the observed states average 16.8 m and the
unseen 21.7 m, and the census population includes the long passes the observed
set does not. If this inverts, the prior is optimistic and E2b's gate (d) would
fail by construction — better to learn it here for the price of a lookup.

### P4 — BAND REALITY (routing rule decided in advance, NOT a fail)

```text
if interceptedRate(26-30) − interceptedRate(6-10) >= 5.0pp
     the bands are real; E2b prices observed options at their own band
else the bands are noise; the table is banked but E2b prices every option at
     the MARGINAL, and the banded table stays as a diagnostic
```

Either branch continues to E2b. This is a routing decision, not a verdict:
pre-registering both arms is what stops the result from being re-interpreted
after the fact.

## 5. Stop rules

* **X5 or X6 fails** → the pricing layer or the census drifted; report. Never
  adjust the table to fit.
* **P1 fails** → "never deleted" is not implemented; report, do not special-case
  the failing states.
* **P2 fails** → the census is not a prior: it does not generalise off its own
  seeds. Report to the commander; **do not widen the band, re-band, or re-seed
  after seeing results.**
* **P3 fails** → the prior is optimistic. STOP: E2b's not-looking gate would
  fail by construction, and the fix is a design question (what an honest prior
  for an unseen man actually is), not a parameter.
* The table is infrastructure like a sampling budget: once committed it may not
  be adjusted after any E2b result, ever.
* E2a is dormant throughout — default-off, zero live callers, fingerprint
  unchanged. It authorises no consumer, no gene, no evolution, and no A/B.
  **On PASS, E2b proceeds without a new ruling** (commander ruling #7).

## 6. What E2a hands E2b

A committed, SHA'd, held-out-validated base-rate table; a pricing layer that
returns an option for every teammate whether or not he is visible; and a
measured answer to the one question that decides whether E2b's design is even
coherent — whether an honest prior sits below what a passer who looks can see.

One thing E2a deliberately does NOT answer, flagged for E2b's drafting: if the
evaluator CHOOSES an unseen option, where is the ball actually aimed? Pricing
an option the passer cannot aim at is coherent; executing it is not, and
solving it with last-known or role-anchor positions edges toward the
truth-fallback the design contract forbids. E2b owns that question.
