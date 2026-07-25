# EDS E2a-2 — The option-space census (counterfactual)

Status: **PRE-REGISTERED — no run yet.** Drafted by the autonomous session
under commander ruling #8 (2026-07-25), constraints (h)–(l) in
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3.

Date: 2026-07-25

## 1. Why the census is being re-posed

E2a-1's P3 caught something real. Its census measured **passes the AI chose to
play**, and the prior is asked to price **options nobody chose and nobody
saw**. A base rate over played passes inherits the live chooser's filter, so it
is a selected sample; the gap showed up as a 0.18pp inversion and would have
grown in E2b, whose option set is every teammate rather than the nearest
near-stationary one.

Ruling #8's answer: measure the population the evaluator actually prices. Take
real decision moments, enumerate the full candidate set, and for each candidate
**fork the deterministic world and intervene on target choice only** — power,
lead, aim noise, offside and bookkeeping all run the live machinery, pointed at
the substituted man. That is exactly "what would have happened if he had picked
that one instead", which is the quantity a prior over options must be about.

### 1.1 Scope boundary, registered rather than glossed

The intervention is on TARGET choice, not ACTION choice. A moment enters the
census only if the brain was going to play a plain ground pass there; forcing a
target cannot make a dribbling or shooting moment into a passing one. So E2a-2
removes the **target**-selection bias and leaves the **action**-selection bias
in place. That is what ruling #8 (h) specifies and it is the honest limit of
this instrument: the prior it produces is "given that a pass is being played,
what happens to a pass at this distance", not "what happens if you pass at a
moment nobody would pass".

## 2. Authorised seat

* `src/sim/Match.ts` — `forcedPassTarget: number | null = null`, a mutable
  dormant field. Null in every production path.
* `src/ai/PlayerBrain.ts` — at the point the brain has already decided to pass,
  the chosen `bestMate` may be substituted by `forcedPassTarget`. Nothing else
  moves: the decision to pass, the power, the lead, the aim spray, the run-up
  heading and every downstream call stay as they are. The cutback has its own
  machinery and is never substituted.
* `src/ai/passPrior.ts` — the option-space table added alongside E2a-1's
  pass-log table, which is **retained untouched** as the chosen-subset
  reference (and so E2a-1's own reproduction gate keeps working).
* `src/ai/passOptionPricing.ts` — pricing classes re-cut per ruling (k).
* New probe `scripts/probes/eds-e2a2-option-space-census.ts`.
* No other `src/**` change; zero live callers; fingerprint unchanged.

**Disclosure:** the seam above was authored during drafting, to establish that
an exact intervention point exists at all — the census design is worthless if
the fork cannot reproduce reality. Only `tsc` and `npm run fingerprint` were
run against it (fingerprint `57b0bdab…c673`, unchanged). No census, no rate, no
gate value was computed before this contract was committed.

## 3. The measurement

Sampling, frozen: **census set A = seeds 700,000+**, **held-out set B = seeds
710,000+**, disjoint from every set used by E0, E1a/b and E2a-1. Matches are
consumed in seed order until **4,500 sampled moments** per set are collected.

At each moment (a tick where the brain plays a plain ground pass), the
candidate set is **every outfield teammate of the passer at 6–30 m** — no
nearest-only filter and no near-stationary filter, both of which were isolation
devices for other questions and would re-select the population. Each candidate
gets one fork of the pre-tick state, the seam armed for exactly one tick.

Outcome classes, carried over from E2a-1 unchanged plus ruling (i)'s addition:

```text
intercepted | reachedTarget | otherTeammate | unresolved | UNPLAYABLE
reachedTarget splits into adjudicated clean / adjudicated spilled /
never-adjudicated (the registered ~25% share: <=6 m/s returns clean before the
roll, and M3 cushioning can skip the adjudication entirely)
```

Sizing, from a harness pilot that measured **3.36 candidates per moment** and
**59 forks/s** (counts and timing only — no outcome rate was computed): 4,500
moments ≈ 15,100 forks per set.

## 4. Frozen gates

### EXACT

```text
X1 production fingerprint, seam dormant        57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical              shared SHA-256
X4 zero live callers of passPrior / passOptionPricing (audited)
X5 HARNESS (ruling #8 (i)) — over 3 full matches (seeds 700,001-700,003),
   arming the seam at EVERY pass with the target the brain itself chose must
   reproduce the unforked match BIT-IDENTICALLY at full time: score, phase,
   ball, every player's position/velocity/heading, and the RNG state. 3/3.
X6 the committed option-space table equals this run's census, field by field
   (the two-pass construction E2a-1 used, pre-registered again here)
```

X5 is the gate the whole census rests on. A fork that cannot reproduce observed
reality when asked to replay it has no standing to report what would have
happened otherwise.

### P1 — COMPLETENESS

```text
every enumerated candidate lands in exactly one outcome class; zero
  unclassified
UNPLAYABLE is counted and reported, never dropped
the brain's OWN target is playable at >= 99.9% of sampled moments — a seam that
  silently fails to substitute shows up here first
```

### P2 — CALIBRATION (interval test, powered ex ante)

```text
per band   | rate_A − rate_B |  <= 6.0pp,  for every band with n >= 1,200 per set
marginal   | rate_A − rate_B |  <= 2.0pp
```

Power: at the 1,200-per-band floor the worst-case (p = 0.5) standard error of
the A−B difference is 2.04pp, so ±6.0pp is ≈2.9σ; on the marginal (n ≈ 15,100
per set) it is 0.58pp, so ±2.0pp is ≈3.4σ. Both are wide enough that noise
cannot fail them and narrow enough that a prior which does not generalise will.

A band that does not reach the 1,200 floor is reported as **under-sampled** and
named in the result; its numbers are banked but it is not gated, because a
self-widening interval is not a test.

### Reported, never gated (ruling #8 (j))

The direction of every one of these is a finding, not a validity condition —
that is P3's lesson, and P3 is deliberately absent from this contract.

```text
R1 CHOOSER LIFT: option-space rates against E2a-1's pass-log rates. Registered
   prediction (a prediction, not a gate): option-space lands BELOW pass-log,
   and the delta is the first measured value of the live target-chooser over
   uniform choice. Near-zero would itself be a substrate finding, consistent
   with a speed-blind evaluator.
R2 the priced-axis gradient across bands — receptionSuccessRate, the statistic
   the consumer reads, never the flat interceptedRate proxy (ruling (k)'s
   re-key). This is what within-retention memory is worth.
R3 the UNPLAYABLE share, by cause where distinguishable.
R4 the adjudication-class split, including the never-adjudicated share.
```

### Pricing classes (ruling #8 (k), settled by the commander — implemented, not decided here)

```text
fully-unknown  (target absent from the snapshot, no memory)
                 -> MARGINAL, by construction: the distance is unknowable
stale-memory   (last-known position within retention)
                 -> BANDED at the remembered distance
```

Class is decided by whether the target is in the snapshot, **not** by whether
the physical read succeeded — a target that is remembered but whose flight
cannot be priced is still a stale-memory option, and it keeps its band.

## 5. Stop rules

* **X5 fails** → the fork does not reproduce reality; the census has no
  standing and nothing in it may be reported as a rate. Report and stop.
* **X1/X4 fail** → the seam is not dormant; revert immediately.
* **P1 fails** → candidates are being lost; report, never patch the classifier
  to absorb them.
* **P2 fails** → the option-space prior does not generalise off its own seeds.
  Report to the commander; **do not re-band, re-seed, or widen after seeing
  results.**
* No direction finding may be converted into a gate after the fact, and no
  reported number may be used to justify adjusting the table.
* The table, once committed, is infrastructure: never adjusted after any E2b
  result.
* **On PASS, E2b proceeds without a new ruling** (commander ruling #8).
