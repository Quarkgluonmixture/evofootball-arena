# Ball-Control Foundation — authoritative ball, readable touches

Status: **B0 done; B1–B3 pending.** This is a new bounded S2 foundation slice,
not an extension of the completed M0–M4 body campaign.

## 1. Why this slice exists

The user accepted M1 body contact and the current 0.286m 3D readability shell,
but cannot consistently see why a dribbler was or was not dispossessed. The
existing Phase-36 mechanic already releases long open-field knocks; under
pressure it falls back to a binary owner plus a ball fixed 0.85m ahead of the
body. `dribbleTouch` is a chase tag, not a complete control process.

The missing world fact is the middle between magnetic ownership and a fully
free ball: a ball that is in a player's control process but physically exposed
between touches.

## 2. Boundary

Build the smallest process that makes foot↔knock cadence and disruption true:

- authoritative sim position only; no render-only foot lie;
- no legs, foot IK, muscle model, or new body collision campaign;
- no hand-authored decision for when to dribble;
- attributes may change execution range/error/time, never declare success or
  make dribbling valuable;
- keep the accepted ball display size and M1 contact feel;
- one behavioural lever per stage, deterministic fixed-order mechanics.

## 3. Build plan

- ✅ **B0 — representation + baseline (BYTE-IDENTICAL).** Add a derived
  `BallControlPhase`: `deadBall | keeperHeld | secured | knocked | free`.
  `knocked` recognises the existing outfielder chase as an ongoing control
  process without pretending the ball is owned. Add a shared event-ledger type
  for future probes. No AI or physics consumer. The 120-match baseline shows
  why the gap is visible: outfield possession is secured for 23.8% of playing
  frames, 80.6% of those frames are under the current pressure gate, and the
  ball sits at mean 0.859m (0.858m under pressure). Only 7.10 true knocks occur
  per match; they last 0.656s, reach 1.277m from the carrier and end in 85.1%
  self-regathers / 11.3% opponent gathers. This freezes the existing open-field
  value while B1 addresses close control.
- ⬜ **B1 — single-player controlled touch cycle.** Replace the fixed 0.85m
  outfield carry pose with an authoritative close-control cadence. Prove that
  the ball advances, the carrier catches it, and turn/walk/run regimes remain
  bounded before adding any new opponent outcome.
- ⬜ **B2 — physical disruption + explanation.** Opponents contact the ball at
  its real location; record touch/disruption/loss cause. Existing body access
  and M3 contact→control remain the ownership boundary. No direct attr winner.
- ⬜ **B3 — probes + user play-test.** Gate contact-chain tails, possession
  economy, policy/style directionality, determinism and perf. The user decides
  whether touches and steals are readable. Honest-revert any candidate that
  merely looks attached while breaking selection or football.

## 4. Stop rule

Do not repeat the rejected M3b distance/timer variants. A retry must change the
causal representation: keep controlled cadence distinct from M3 loose-ball
capture, so every close touch does not reopen a new possession contest. If that
boundary still fails the gates, stop the slice and report it.
