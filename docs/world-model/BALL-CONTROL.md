# Ball-Control Foundation — authoritative ball, readable touches

Status: **B0 done; B1 tried twice and honest-reverted; B2–B3 blocked.** This is a new bounded S2 foundation slice,
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
- ❌ **B1 — single-player controlled touch cycle. TRIED + REVERTED.** Replace the fixed 0.85m
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

## 4. B1 experimental record (2026-07-21)

Two causally different candidates were tested; neither landed.

1. **Authoritative owned cadence.** A distance-travelled foot→knock→foot cycle
   kept `ball.owner` while moving the real ball between 0.685m and 1.02m. It
   avoided backwards world-space motion and passed focused mechanism tests,
   but changed the match path enough to create a 113-contact `passArrival`
   chain at seed 103. The restored B0 state on the same 120 seeds has max 8.
   Goals also moved 2.13→2.32. Fully reverted.
2. **Retained close-control release.** A short pressured touch made the ball
   physically free while retaining the carrier's control process; if the
   carrier reached it first, that next foot contact did not reopen M3, while
   an opponent contact still used normal M3 contact→control. The mechanism
   test passed, but live cadence exploded from 7.10→52.92 knocks/match.
   Contests rose 17.00→24.96/match, M3 max recontacts 8→68, midfield loose
   touches 81.27→92.31/match, possession spells 40.92→46.49/match and mean
   spell duration fell 5.73→5.04s. Fully reverted.

This rejects both common shortcuts: continuously rewriting the authoritative
owned-ball offset, and representing every visible footbeat as a possession
release. The next retry must first explain how a visible contact cadence can
exist without perturbing pass-arrival control or multiplying ownership
transitions. B2/B3 do not proceed until that representation exists.

## 5. Stop rule

Do not repeat the rejected M3b distance/timer variants. A retry must change the
causal representation: keep controlled cadence distinct from M3 loose-ball
capture, so every close touch does not reopen a new possession contest. If that
boundary still fails the gates, stop the slice and report it. That condition
was met by the retained-control candidate; the accepted HEAD remains B0.
