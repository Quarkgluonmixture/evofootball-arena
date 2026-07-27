# Stage III P1R — pre-freeze sizing, and a fork back to the commander

Status: **READ-ONLY MEASUREMENT, NOT A CONTRACT. P1R is NOT frozen.**
Produced under **ruling #40.4** (P1R authorized: reachability-scoped lattice,
W dominating the measured travel-time distribution ex ante, station-family
population only) and under **#29.5** — deliverability is a **freeze-time**
obligation, so the measurement that would decide W had to happen before the
freeze, not inside it.

Date: 2026-07-27. Zero `src/**`. 400 sampled moments, block 970,000.

---

## 1. Why this stopped short of a pre-registration

#40.4's scoping repairs P1's *diagnosed* defect — W was derived against the
ring radius instead of `dist(body, ball+offset)`. The sizing measured that
defect and confirms it exactly. **It also shows the repair does not reach a
delivered treatment**, at any (W, margin) in the grid.

Freezing a census whose treatment I already know is not delivered is precisely
the "disclosed the weakness and ran anyway" failure #29.5 exists to forbid —
the same failure C5 T1's H1 was codified from. So the round stops here and the
numbers go back to the commander.

## 2. The travel-time distribution — #40.4's ex-ante requirement, measured

```text
distance from the body to a lattice target (18 candidates × 333 moments)
  p50  19.68 m      p75  27.63 m      p90  35.21 m      p99  49.58 m
the same as time at the body's own top speed
  p50   2.66 s      p75   3.72 s      p90   4.77 s      p99   7.20 s
```

**P1's W = 2.0 s covered roughly the bottom third of this distribution.** The
diagnosis in P1 §7.1 was right, and this is its size.

## 3. Reachability scoping, and what it actually delivers

`reachable ⇔ dist(body, ball+offset) ≤ topSpeed · W · margin`.

```text
W    margin   candidates/18   occupancy mean   p50     p90
3 s   1.0        10.68            9.5%        0.0%   25.7%
3 s   0.6         5.04           11.3%        3.4%   38.0%
3 s   0.4         2.71           16.3%        5.6%   63.1%
4 s   1.0        14.44            9.8%        2.7%   25.1%
4 s   0.6         7.89           11.1%        4.6%   33.5%
4 s   0.4         4.19           14.2%        5.0%   41.8%
5 s   0.4         5.99           13.0%        5.7%   39.5%
5 s   0.3         3.75           15.8%        6.7%   48.2%
```

⛔ **Nothing in the grid delivers the treatment.** The best cell is
W = 3 s, margin 0.4 — and it buys **16.3% mean / 5.6% median** occupancy while
cutting the lattice to **2.7 of 18 candidates**, which is no longer a census of
a lattice. Tightening the margin trades coverage for occupancy at a rate that
never crosses.

## 4. ⭐⭐⭐ Why — and it is a substrate fact, not a probe defect

**The target moves with the ball while the body runs to it.** A station is
ball-relative by definition (P0 §1.1, and P1 §2.1's whole argument), so a body
crossing 20 m at ~7 m·s⁻¹ is chasing a point that is itself travelling —
frequently faster than he is.

This is **P0's I2 seen from the other side**, and the two measurements now
close on each other:

```text
P0 I2  the INCUMBENT's own station target drifts 2.571 m/s at the median and
       exceeds 4 m/s — faster than the body chasing it — on 27.35% of ticks
P1R    a forced ball-relative station is occupied 6% of the window at best
```

**Stations in this engine are not occupied. They are perpetually approached.**
That is true of `emergentStation` too; P0 called its apparent stability "slow
inputs, not commitment", and this is the same fact measured directly.

⚠️ Registered plainly: this does **not** refute Stage III's premise. It says
the *census cell* as currently defined — "force a body to STAND at a
ball-relative point and price what happens" — describes something the world
does not contain.

## 5. What is settled, and what is the commander's

**Settled by measurement, and cheap:**

* the station-family population filter is unambiguous — **16.8%** of sampled
  moments are ball-directed jobs (chaser / receiver / interceptor), matching
  P0's 19.4% of body-ticks, and excluding them is #40.4 item 2, done;
* the clamp share under that population is **8.08%** of live ticks, so X6's
  floor must be **derived against ~8%**, not assumed near zero — P1's 99% floor
  would fail again on a faithful seam.

**The fork, and it belongs to the commander — I am not choosing it:**

The census needs an estimand the world can actually deliver. Four shapes exist
in the material already banked; each is a different claim about what a station
*is*, which is a design question, not an executor's call:

1. **Price the DIRECTION, not the point** — the treatment becomes "steer toward
   this ball-relative bearing for W" and the outcome is what that approach
   buys. Occupancy stops being a gate and becomes the mediator it already is.
2. **Lead the target** — candidates defined against the ball's *projected*
   position rather than its current one (the same correction `runBurstPoint`
   and the C4 meet point already make elsewhere in the engine).
3. **Body-anchored candidates** — an offset from where the body stands, which
   is reachable by construction but is no longer a station the eye can express
   as a policy.
4. **Accept approach as the treatment** — keep the current cell, drop the
   occupancy expectation, and read the table explicitly as *the value of moving
   toward a region*, which is what P1 measured and what its §7.2 already says
   it measured.

**Nothing is pre-registered here and nothing is proposed as authorized.**
P1R stays unfrozen until the estimand is ruled.
