# World-Model Coverage after M0–M4

Status: **coverage authority, 2026-07-21.** M0–M4 completed the Minimum
Embodied Contest Slice. They did **not** complete the whole World-Model
Foundation.

Read with [`FOUNDATION.md`](FOUNDATION.md), which records what landed, and
[`CONTROLLED-BALL-COUPLING.md`](CONTROLLED-BALL-COUPLING.md), which records the
closed B1c line and the isolated B1d recovery result. The current mainline is
the decentralised S3–S9 work recorded in
[`OFFBALL-MAINLINE-DECISION.md`](OFFBALL-MAINLINE-DECISION.md).

## 1. The honest boundary

M0–M4 made a loose ground ball contest physically legible:

```text
oriented body access
→ simultaneous contact claims
→ first contact changes the independent ball
→ delayed control attempt
→ controlled / loose / recontest
```

That is a real foundation, but a deliberately narrow one. It answers some new
counterfactuals and still cannot represent others.

| Counterfactual | Current status |
|---|---|
| Same distance, but turn the claimant from front to back | **Representable** for loose-ground contact |
| Same claimant, but place an opponent core on the ball-access line | **Representable** for loose-ground contact |
| Same first contact, but a third player gets final control | **Representable** in M3 |
| Same overlap, but remove only closing normal velocity | **Representable** in M1 |
| Same secured carrier, but turn the body to shield a standing tackle | **Not representable in the live tackle path** |
| Ball moves between the carrier's touches without ending control | **Not representable** |
| Same target, but arrive fast/off-balance/facing away and need longer to control | **Only partly represented** |
| Same tackle centre distance, but change approach side and leg access | **Not representable** |
| Same ball centre, but only part of the ball has crossed the line | **Not represented in laws-of-play checks** |

The operating rule remains the Foundation counterfactual criterion:

> Add a world fact only when a football-relevant outcome should change under a
> change the current state cannot express.

## 2. What is complete

- **Parameter authority:** field, goal/box, body, reach, speed/time and surface
  knobs are no longer entangled behind one source constant.
- **Body identity:** `bodyDir` and `coreRadius` have explicit semantics.
- **Stable core contact:** the deterministic fixed-order solver corrects both
  overlap position and closing normal velocity; the accepted feel is the
  baseline.
- **Loose-ground access:** `directBallAccess` gives front/side/back reach and
  opponent-core screening as a pure world query.
- **Touch is not control:** all eligible M3 claims come from one snapshot; first
  contact changes the ball, and a later player may establish control.
- **Contest evidence:** `ContestEpisode` distinguishes contacts, final
  controller and possession outcome without scripting a winner.
- **Ball representation:** the ball has a physical radius and the renderers read
  the authoritative simulated position.
- **Current-model arrival estimate:** `src/ai/reachability.ts` mirrors today's
  isotropic movement envelope and returns movement ETA, turn time and ready ETA.

## 3. Missing foundation facts

### G1 — controlled-ball coupling · representation and isolated recovery done; live closed

`ball.owner` still conflates controller, physical carry constraint, ordinary
capture exemption and macro possession. The engine has no state meaning:

```text
the ball is physically between own planned touches
AND the same control process is still intact
```

Both rejected B1 candidates exposed this exact gap: moving an owned ball leaked
micro-position into pass-arrival, while representing each close touch as a free
ball multiplied knocks and M3 contests. The proposed boundary is documented in
[`CONTROLLED-BALL-COUPLING.md`](CONTROLLED-BALL-COUPLING.md).
The byte-identical consumer census and representation are complete. B1c's
isolated touch/access boundary worked, but every live composition failed through
overrun, contest-tail, formation or stamina regressions and was reverted. B1d
then proved one causally different fact in isolation: the existing player
integrator can recover a single fixed rendezvous through desired-velocity-only
movement. It did **not** authorise cadence, opponent claims, possession
continuity or Match wiring. Live remains B0 and this gap is parked.

### G2 — shielding and ball access while possession is secured

`directBallAccess` currently gates M3 loose-ground contact claims. The ordinary
standing-tackle path still selects the nearest opponent inside a centre-distance
circle and resolves a probability. It does not ask whether the tackler has a
real route to the ball or whether the carrier's oriented core screens it.

Therefore M2 made shielding **possible to represent in one query**, but did not
make live secured-possession shielding exist. This must eventually reuse one
access fact, not grow a separate `shieldSuccess` winner formula.

### G3 — movement and body state on arrival

Movement still uses an isotropic desired-velocity acceleration envelope and a
fixed attribute-blind `TURN_RATE`. The reachability helper honestly predicts
that current model, but does not yet expose or simulate:

- forward / lateral / backward movement differences;
- speed-dependent turning and braking;
- arrival velocity and overshoot;
- arrival body orientation beyond a scalar turn delay;
- balance or a `controlReadyAt` consequence.

This is not a demand to build full locomotion now. Add one of these only when a
Pass–Arrival–Contest or off-ball counterfactual proves the current ETA is
insufficient.

A0 tested the first narrow residual on 8,370 fresh chosen-pass branches. After
fixed stratification by current arrival margin, body readiness and flight time,
lower kick-time ball–receiver relative speed changed intended reception by
`-0.5pp` rather than the pre-registered `+10pp`; only 14/28 cells had the expected
sign. Exact validity and support passed. This hypothesis is therefore stopped:
G3 remains a real coverage description, not authority to add arrival velocity,
braking or `controlReadyAt` without a different future counterfactual.

### G4 — tackle execution geometry and contact cause

Standing and sliding tackles have useful directionality and loose-ball outcomes,
but the engine still lacks a shared execution fact for front/side/back access,
leg path, ball contact point and whether body contact happened before ball
contact. That limits readable explanations of why a dribble was or was not
broken.

### G5 — duel outcome vocabulary

M3 records first contact, every contact, final controller and possession team.
It intentionally has no separate `duelWinner`, because that concept was not
needed to ship the slice. If later evaluation needs it, define it as an observed
episode outcome with explicit semantics; never make it the resolver that awards
the ball.

### G6 — first-touch readiness and execution detail

M3's delayed attempt is a useful separation, not a complete first-touch model.
The current process still has a fixed three-tick window and coarse attribute
coupling. Missing facts include desired exit direction, receiving-body readiness,
stretch, weak-foot/body-side demands, and arrival relative velocity beyond the
current error inputs. These belong to S2 execution; they must not decide whether
the pass or action was valuable.

### G7 — ball radius in laws-of-play geometry

`BALL_RADIUS = 0.11` exists and is used in physical access geometry, but
`Match.checkGoal()` and `Match.checkOutOfPlay()` still compare the **ball centre**
with `HALF_L/HALF_W`. Whole-ball-over-line semantics and posts/crossbar contact
remain future isolated changes. They are real gaps, but unrelated to controlled
dribbling and should not be bundled into B1c.

### G8 — richer possession contest state

`PossessionPhase.contested` is a useful observational classification based on
nearby bodies. It does not encode claimant identities, predicted landing,
control stability or a live AI affordance. `ContestEpisode` supplies event
history, not a decision state. Extend this only when a consumer can name the
missing fact and its gate.

### G9 — attribute attachment, not attribute activation

M0–M4 created a causal **attachment point** for future physical attributes; they
did not activate `strength` in the new contact/access system. `strength` still
pays through the existing standing-tackle probability and aerial formulas. It
does not yet change core contact displacement, screening stability or balance.

The correct claim is:

> The body foundation gives `strength` somewhere honest to attach later.

It is not evidence that this attachment should be wired now. Attribute work must
still pass the gene→hook constraints and the full fires→works→pays→selected chain.

## 4. Explicit non-goals

The following are not missing prerequisites for returning to S3–S8:

- skeletal legs or foot IK;
- a rigid-body engine or a new technology stack;
- height/weight and multiple body shapes;
- a complete shoulder-charge/stumble animation suite;
- muscle, boot-stud or grass-blade simulation;
- named dribble skills or hand-authored tactical moves.

## 5. Priority rule

The project north star remains emergent, identifiable football from S3–S8. The
Foundation is allowed to interrupt that mainline only for a bounded missing
counterfactual with an acceptance probe and an honest-revert boundary.

Current order:

```text
DDD-0 one-body defensive dilemma (complete)
→ D-COVER-0 endpoint-arrival handoff (complete, FAIL)
→ D-LANE-0 space-time corridor handoff (complete, FAIL)
→ point-response defensive branch parked
→ D-ROTATE-0 assignment-blind temporal process (complete, FAIL)
→ D-INTENT-0 local relation negotiation (complete, allocation works / rotation FAIL)
→ defensive local-process branch parked before payoff/selection
```

B1c already failed its live boundary and was reverted. Do not roll directly
into G2–G9. Shared intent and legal two-body motion were both non-vacuous, but
neither receiver-endpoint arrival nor a fixed-step corridor ETA calibrated well
enough to real first control. No defensive live sandbox or ecology is currently
authorised. D-ROTATE then showed that broad local carrier awareness and stable
ETA leadership do not make the existing action substrate rotate responsibility:
only `2/64` states produced the frozen full process fingerprint. The remaining
VISION-level question is now representational: whether defenders can express
and observe complementary, role-neutral movement intent/occupancy without
rebuilding first/second/third assignments under new names.

D-INTENT answered the narrower expression question positively but the process
question negatively: all 64 states produced multiple settled commitments, yet
only one produced the complete rotation fingerprint. The engine can distribute
existing chase/mark actions without the commander; it still cannot express the
time-dependent delay/takeover/cover state that makes those assignments rotate.
This defensive sub-branch is parked before selection or payoff.
