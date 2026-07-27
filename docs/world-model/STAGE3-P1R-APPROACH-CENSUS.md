# Stage III P1R — The Approach Census

Status: **PRE-REGISTERED 2026-07-27, frozen before the run.** Authorized by
**ruling #41** (the station estimand re-founded as APPROACH-VALUE; P1R freezes
under #40.4 + #41) after P1's treatment was measured undelivered and
[`STAGE3-P1R-PREFREEZE-SIZING.md`](STAGE3-P1R-PREFREEZE-SIZING.md) showed the
reachability repair could not rescue it.

Authority: #41.2 (the estimand, and the two rejected alternatives) · #41.3
(population, X6's derived floor, mediators, everything else verbatim) · #40.4 ·
[`STAGE3-P1-STATION-CENSUS.md`](STAGE3-P1-STATION-CENSUS.md) (this contract
inherits its gates, seam and staging except where stated) ·
[`STAGE3-POSITIONING-EYE.md`](STAGE3-POSITIONING-EYE.md) §4.5 · #29.5 · #32.1 ·
#38.1.

---

## 1. What changed, and why it is not a re-cut

P1 asked: *what is a body worth STANDING at ball-relative point X?* The world
answered that the question has no referent — a ball-relative point is chased,
never held (P0 I2 · P1 §7.1 · the sizing grid).

**#41.2 rules the replacement estimand: the signed value of committing W to
APPROACHING candidate X.** The treatment is the **steer**; occupancy demotes to
the mediator it already was. The decisive reason is the population=deployment
law applied to the action itself: **the deployed eye will also perpetually
approach** — every window it picks a target and moves — so this cell censuses
exactly what the consumer will do.

Rejected in the ruling and recorded here so the option space stays closed:
**leading the target** (a W-second ball projection is a forecast nobody's
percept contains; the engine's existing leads are ~1 s physics, not 3 s
fiction) and **body-anchored candidates** (reachable by construction, but they
lose the policy-expressible station semantics VISION requires).

**Codified by #41.3, and inherited by every later consumer** (P2's eye, the C4
handshake): *in this engine "station" reads as a sustained approach direction,
not an occupied post.*

## 2. The design

### 2.1 Unchanged from P1, verbatim

The seam (`forcedStationPolicy`, ball-local, re-evaluated every tick, read at
the executor before the clamps); the lattice (18 candidates, `r ∈ {7,14,21}` ×
6 angles) **including its distance dimension — a far candidate is a long
approach and is priced as one (#41.2)**, so there is **no reachability filter**;
the contexts (face × threat × density = 12); the face-specific horizons
`H_score = 6.0 s`, `H_concede = 10.0 s`; the signed shot-based outcome; the
positive control `r21a180`; the SAT saturation arm and its ±0.05 band; the
gene mapping frozen for P2's ablation; the staging, cluster unit, bootstrap
seed and the 150-per-cell floor.

### 2.2 Population — station-family ticks ONLY (#40.4 item 2, #41.3)

A moment qualifies only if the chosen body's action is a **station family**:
`MoveToFormationSpot · HoldPosition · SupportBallCarrier · MakeRun ·
MarkOpponent`. Ball-directed jobs (`ChaseBall · ReceivePass · InterceptPass`)
and the carrier are **excluded** — forcing them is not choosing a station, it
is abandoning the ball, which is C4 O2's measured harm in another costume.

Measured ex ante at 400 moments: **16.8% of sampled moments are ball-directed**
and drop out, matching P0's 19.4% of body-ticks.

### 2.3 W = 3.0 s, re-derived under the new estimand

```text
P0 dwell mean                    1.466 s   (a commitment must exceed it)
P0 licence clock                 0.4 s
measured travel time to target   p50 2.66 s   p90 4.77 s
⇒ W = 3.0 s
```

W exceeds the incumbent's own commitment scale and **dominates the MEDIAN of
the travel distribution**, so a typical approach completes inside the window.
It deliberately does **not** dominate the tail: under #41.2 a long approach is
a candidate being priced, not a treatment failing. That is the precise
difference from P1's W, which was derived as a travel budget against the wrong
distance and then gated as if the approach must finish.

### 2.4 X6's floor, DERIVED against the measured clamp share (#41.3)

The sizing measured the clamp share under the station-family population at
**8.08%** of live ticks, so a perfectly faithful seam yields `ok ≈ 91.9%`.
P1's 99% floor would fail again on a faithful seam — that was P1 §7.4's
defect and it is repaired here by derivation rather than by relaxation:

```text
X6   unexplained residual EXACTLY 0                              (the fidelity claim)
     AND  ok / (ok + clamps + unexplained)  >=  0.84
     0.84 = 1 − 2 × 0.0808, i.e. the measured clamp share with 2× headroom for
     block-to-block variation. Clamp shares are REPORTED separately, because
     how often the onside clamp bites is a property of the LATTICE, not of the
     seam — conflating the two is exactly what failed in P1.
```

### 2.5 Mediators — reported, never gating (#41.3)

`occupancy` · `ETA` · `target-error` remain mandatory and remain **reported**.
Under the approach estimand a low occupancy is no longer a broken treatment —
it is the description of a long approach — so these three now tell P2 *what
kind of approach* each cell priced. A cell with high value and near-zero
occupancy is a real and interesting object: value bought purely by moving.

## 3. Gates

Inherited from P1 §4 verbatim except X6 (§2.4 above):

| gate | predicate |
| --- | --- |
| **X1–X3** | fingerprint `57b0bdab…c673`; seams null in production; unreachable from the E4 preview |
| **X4** | clone coverage = 100% of sampled moments |
| **X5** | control fork reproduces the base continuation bit-identically, sampled 1-in-25 |
| **X6** | §2.4 — unexplained exactly 0 **and** ok ≥ 84% of clamp-eligible ticks |
| **X7** | two `runExperiment()` calls byte-identical; table SHA emitted |
| **PC** | `r21a180`'s signed value is below the control's in **both** faces, CI upper < 0 |
| **SAT** | reported; the table is DESIGN-CALIBRATION ONLY unless every tested gap is within ±0.05 |

**Standing exception classes (#38.1)**: paused world · carrier · ball won ·
sent off · onside clamp · barred box · match ended — all checked, unexplained
must be 0.

## 4. Pre-laid readings — the full sign space

* **(a) GRADIENT.** Candidates separate within contexts and some approach
  directions beat the control. The eye has something to price, and §3.3's 180°
  ring is the one to watch: if approaching *behind* the ball pays, the
  incumbent's positive-only `aheadBias` is a measured defect.
* **(b) FLAT.** PC resolves, nothing else does — committing a window to any
  approach is worth about the same. Then the positioning seat is not where the
  value is at v1 scope, and that is worth the cost.
* **(c) ALL-NEGATIVE.** Every candidate loses to the incumbent *and the
  mediators show the approaches were delivered as intended*. Unlike P1, that
  reading would now be available, and it would say the incumbent's station
  function is already near-optimal against this lattice — a strong result for
  the interim it was supposed to be.
* **(d) NOISE.** PC does not resolve ⇒ FAIL, no table published.
* **(e) GRADIENT but SAT fails** ⇒ DESIGN-CALIBRATION ONLY.

## 5. Result — ✅ **GATES PASS.** Pooled reading (c); conditionally reading (a).

Run 2026-07-27, blocks 980,000 + 6 disjoint strides, **6,000 moments /
114,000 forks**, twice byte-identical, SHA `2c93d5b2…a964`, table SHA
`59a3f72e…6e12d` (`docs/world-model/data/stage3-p1r-approach-table.json`).

| gate | verdict |
| --- | --- |
| **X4** clone coverage | ✅ 6,000 / 6,000 |
| **X5** control-fork identity | ✅ **240 checked, 0 mismatched** |
| **X6** fidelity | ✅ **unexplained 0**; ok **91.7%** of clamp-eligible against the derived 84% floor |
| **PC** positive control | ✅ **−0.0396 CI [−0.0546, −0.0259]**, resolved in **both** faces |
| **X7** determinism | ✅ |
| **SAT** | ✅ all four gaps inside ±0.05 ⇒ **SHIPPING TABLE** |

The population filter behaved as sized: **979 moments (14.03%)** were
ball-directed and excluded, against 16.8% measured at 400 moments and P0's
19.4% of body-ticks.

### 5.1 Pooled: every approach still costs, and that reading is now AVAILABLE

All 18 candidates resolve, all negative, spanning **−0.024 to −0.076**:

```text
best   r21a0    −0.0239  CI [−0.0367, −0.0114]
       r14a0    −0.0277  CI [−0.0415, −0.0140]
       r14a180  −0.0306  CI [−0.0446, −0.0173]
       r7a180   −0.0336  CI [−0.0453, −0.0220]
…
worst  r21a120  −0.0760  CI [−0.0891, −0.0628]
```

**Unlike P1, this reading is available**, because under #41.2 the treatment is
the steer and the mediators describe rather than invalidate it. Pooled, this
is pre-laid reading **(c)**: the incumbent's station function beats **every
fixed ball-relative approach direction** on the lattice. For a "hand-tuned
interim" that is a strong result, and it is the first time the incumbent has
been beaten-or-not on a measurement that could have gone either way.

### 5.2 ⭐⭐⭐ Direction dominates distance — by roughly 3×

```text
by ANGLE  (mean over radii)     0° −0.0311   180° −0.0346   240° −0.0514
                              300° −0.0529   120° −0.0547    60° −0.0599
by RADIUS (mean over angles)     7 m −0.0447   14 m −0.0441   21 m −0.0536
```

The angle spread is **2.9pp**; the radius spread is **0.9pp**. **Which way a
body commits its window matters about three times as much as how far.** The
two cheap directions are **straight forward (0°) and straight back (180°)**;
every diagonal is dearer. Nothing in the design anticipated that — the lattice
was built to cover named seats, not to test an axis hypothesis.

### 5.3 ⭐⭐ Conditionally it is reading (a): **40 of 216 cells beat their control**

```text
ours|ownThird|crowded    r21a0    +0.0819   n 293
ours|ownThird|crowded    r14a0    +0.0683   n 293
theirs|middle|crowded    r21a180  +0.0545   n 410
ours|ownThird|sparse     r21a0    +0.0519   n 925
theirs|middle|crowded    r14a180  +0.0496   n 410
ours|ownThird|crowded    r7a180   +0.0334   n 292
…40 cells in total, none of them under-powered
```

The structure is legible and it is not noise-shaped: **deep in our own third,
committing the window to a long FORWARD approach pays**; **defending in a
crowded midfield, committing it BACKWARD pays**. The pooled average is
negative because it averages over contexts where the incumbent is already
doing the right thing.

**This is precisely the object P2 was supposed to consume**: a value that
depends on context, measured rather than weighted. An eye that picks per
context is choosing inside a resolved 5.2pp spread — the pooled all-negative
result does not bound what a conditional chooser can do, and saying otherwise
would be the ecological fallacy in a table.

⭐ **The 180° ring pays where the incumbent cannot go.** `supportSpot` places
every supporter AHEAD of the ball at both `aheadBias` settings (P0 §1.4), so
*"approach from behind the ball"* is not expressible in the incumbent at all —
and it is one of the two cheapest directions pooled, and positive in two
contexts. That is measured support for §3.3's claim that drop-to-receive is a
substrate defect and not an aesthetic preference.

### 5.4 Honest notes on the gates that passed

* **PC resolved, but it is NOT the worst candidate** — `r21a180` sits 5th of
  18. The gate as written is satisfied in both faces, and the intuition behind
  it (*"21 m behind the ball is obviously bad"*) is **wrong**: approaching
  backward is cheaper than approaching diagonally. Recorded because a positive
  control whose premise is wrong is a weaker instrument than its pass suggests.
* **SAT's four gaps are all POSITIVE** (0.017–0.047): when *everyone* runs the
  same relative approach, the cost is **smaller** than the unilateral table
  predicts. So the unilateral table is **conservative** on this subset, which
  is the benign direction for the identification gap — but `r7a180` at 0.047
  sits close to the ±0.05 band and the next census should not assume the
  margin holds.
* **X6's derived floor was the right repair**: ok landed at **91.7%**, almost
  exactly the 91.9% the 8.08% clamp measurement predicted. P1's 99% floor
  would have failed this run too, on a seam whose unexplained residual is
  **0 across 18.13 M classified live ticks**.
* Mediators, as promised, describe rather than gate: occupancy **0.9%–19%**,
  ETA 2.1–2.9 s of a 3 s window, target error 10–28 m. These are long
  approaches, and §2.5 says that is a description. **A cell can carry positive
  value at ~2% occupancy** — value bought purely by moving, which is exactly
  the object #41.2 said the world contains.

### 5.5 Reported

18 of 216 cells UNDER-POWERED (the two rarest contexts), unchanged from P1;
3,960 forks excluded for ending inside the horizon, counted not zeroed;
`reconstructionDiverged` 164,809 (0.9% of live ticks, the §4.6b diagnostic
inherited from P1).

### 5.6 Disposition

**PASS.** The table is committed as data with its SHA and is a **SHIPPING
TABLE** by SAT's own criterion. It prices what #41.2 said it would price — the
value of committing a window to an approach — and P2 may consume it under that
meaning and no other.

Returned to the commander for P2's scoping, with three things the census found
that P2's design should not have to rediscover: **direction dominates distance
~3×**; **the payoff is conditional and the pooled sign is not the eye's
ceiling**; and **the behind-the-ball ring, which the incumbent cannot express,
is among the cheapest and is positive in two contexts.**

Nothing shipped: `forcedStationPolicy` is null in every production path and the
fingerprint is unchanged.

## 6. Stop rules

Any X gate fails ⇒ FAIL. PC fails ⇒ FAIL and no shipping table. No re-cutting
after sight — not W, not the lattice, not the contexts, not X6's derived floor,
not §4's readings. P1R ships nothing; the seam stays null in production and the
table is data, not behaviour.
