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

## 5. Result

*(empty until P1R runs — filled in the same commit as the result.)*

## 6. Stop rules

Any X gate fails ⇒ FAIL. PC fails ⇒ FAIL and no shipping table. No re-cutting
after sight — not W, not the lattice, not the contexts, not X6's derived floor,
not §4's readings. P1R ships nothing; the seam stays null in production and the
table is data, not behaviour.
