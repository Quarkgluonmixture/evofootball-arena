# B1d-0 — Fixed-Rendezvous Integrator Parity

Status: **B1d-0 PASSED as an isolated falsification lab on 2026-07-21. Not a
live feature and not permission for B1d-1.** The accepted live authority remains
B0; B1c-3 is still fully reverted and S3–S8 remains the project mainline.

## 1. Exact question

The rejected B1c live cut correctly preserved sequence identity, but its touch
planner assumed a constant-velocity future while live players actually use
`Player.physicsStep()`. B1d-0 asks one narrower question:

> Can an unopposed player, without hidden movement or ball correction, use the
> existing kinematic integrator to meet one independently moving ball at one
> immutable future foot contact?

The causal mediator is player recovery motion, not a possession lease:

```text
one real velocity impulse
→ one fixed contact tick and point
→ desiredVel-only player recovery through Player.physicsStep()
→ endpoint physical contact or honest miss
```

## 2. Authorization boundary

B1d-0 is a synthetic one-player/one-ball mechanism. No production path imports
it. It does not use or modify:

- `Match` or `Match.step()` order;
- PlayerBrain, TeamBrain or the action executor;
- M3 claim collection, pending control or `ContestEpisode`;
- `ControlSequence`, possession or `PossessionLocus`;
- opponents, simultaneous claims or screening;
- swept-path contact;
- attributes, genes, RNG, retiming or cadence policy.

Passing this lab proves only that the present player integrator can execute a
fixed recovery. It does not authorize live wiring.

## 3. Pre-registered mechanism

The planner may inspect at most the next two existing distance-derived gait
windows, in fixed order, and selects the earliest feasible one. It receives the
touch direction and movement intent from the synthetic scenario; it makes no
decision and reads no opponent.

For a candidate it:

1. freezes one future player-centre target and contact tick;
2. predicts the player by running a complete shadow `Player` through the real
   `Player.physicsStep(DT)` transition on every tick;
3. derives one fixed virtual-foot contact point from that predicted state;
4. analytically inverts the existing fixed-step ground-ball integration to
   create one velocity-only impulse;
5. rejects the candidate if the impulse exceeds the existing B1c bound
   `4 + 0.9 × current player speed`;
6. never changes the selected tick, centre, foot or contact point after commit.

During execution the recovery adapter may write only `desiredVel`. Position,
velocity, heading, stamina, speed/acceleration limits, stun and timers remain
owned by `Player.physicsStep()`. The ball integrates with the existing order:

```text
ball.pos += ball.vel × DT
ball.vel *= exp(-BALL_FRICTION_K × DT)
```

There is no post-commit controller impulse. At the fixed endpoint, the lab
requires both the accepted `directBallAccess` query and virtual-foot error no
larger than one ball diameter (`2 × BALL_RADIUS`). The latter is a stricter lab
completion measure, not a live reach change.

## 4. Frozen scenario matrix

The mechanism probe contains exactly these five no-opponent, boundary-free
scenes:

1. straight jog;
2. braking from a fast run toward a trap;
3. 45-degree movement-intent turn;
4. 90-degree movement-intent turn;
5. reduced-stamina recovery.

No scenario or gate may be changed after observing the probe output. Unit
counterfactuals additionally cover a post-touch stun, one lateral test impulse,
an intent change and repeated deterministic execution.

## 5. Pre-registered outcome and mediators

The sole primary outcome is:

```text
fixed-plan physical contact completion rate
```

All five scenarios declared feasible by the planner must complete. The recovery
ablation runs the identical plan and ball impulse while leaving the player on
the original movement intent. At least one ablated scene must miss. Otherwise
the apparent success did not come from recovery locomotion.

Required mediators/invariants:

- shadow prediction and isolated execution use the same `Player.physicsStep()`
  authority and match tick-for-tick on position, velocity, heading and stamina;
- a stunned/frozen controller honestly misses;
- a lateral ball perturbation is never repaired and produces contact or miss
  solely against the original target;
- an intent change invalidates the plan rather than replanning;
- identical input produces byte-identical plan and execution output.

## 6. Exact-zero ledger

Apart from the single commit impulse, every accepted run requires:

```text
controllerBallCorrectionsAfterCommit = 0
contactTargetChanges = 0
contactTickChanges = 0
retimes = 0
directPlayerPositionWrites = 0
directPlayerVelocityWrites = 0
directHeadingWrites = 0
topSpeedOverrides = 0
accelOverrides = 0
M3Calls = 0
ContestEpisodesCreated = 0
giveBallCalls = 0
possessionWrites = 0
ControlSequenceWrites = 0
PossessionLocusReads = 0
RNGDraws = 0
```

## 7. Stop rule

B1d-0 fails and closes if it needs any of the following to pass:

- a moving contact target or changed contact tick;
- any retime or replanning;
- a post-commit ball correction;
- direct writes to player position, velocity or heading;
- enlarged ball-access geometry;
- swept contact;
- possession/lease protection;
- opponent, AI or attribute knowledge;
- relaxed live football gates.

If the fixed, unopposed rendezvous cannot be completed under these constraints,
faithful close-control cadence remains deferred. If it succeeds, the next live
stage still needs a new explicit contract; B1d-0 does not open it automatically.

## 8. Result — passed within the isolated boundary

The frozen five-scene probe passed without changing the mechanism or gates after
observing output:

| Scenario | Contact tick | Commit impulse | Recovery | Original-intent ablation |
|---|---:|---:|---|---|
| straight jog | 25 | 0.917m/s | contact, 0.000m foot error | contact, 0.047m |
| brake to trap | 21 | 1.048m/s | contact, 0.000m | **miss**, 0.817m |
| 45° turn | 25 | 0.917m/s | contact, 0.000m | **miss**, 1.531m |
| 90° turn | 25 | 0.917m/s | contact, 0.000m | **miss**, 2.254m |
| low stamina | 22 | 1.064m/s | contact, 0.000m | **miss**, 0.792m |

Primary outcome: **5/5 fixed plans made endpoint physical contact**. The
ablation had causal teeth in 4/5 scenes. Straight jog remained contactable
without recovery, which is the expected negative control rather than a failure.

The parity matrix covers stationary, acceleration, high speed, deceleration,
45° desired-velocity change, independent `faceTarget`, low stamina and active
stun for 30 ticks each. Complete shadow and isolated executor snapshots remain
bit-identical after every real `Player.physicsStep()` call. A post-touch stun
misses; the lateral perturbation is not repaired; an intent change returns
`invalidatedIntent`; repeated plans/results are identical. Every exact-zero
ledger field in §6 stayed zero.

Repository gates:

- tsc and production build clean;
- focused mechanism/world-model tests 22/22;
- full single-worker Vitest **509/509** across 73 files;
- frozen fingerprints unchanged:
  `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`
  and `4ac9408d70ea967d3a6a2744b18193921c5835cacedc8b75630b8db5af128627`;
- live 120-match `control-sequence-anatomy` remains zero for sequences,
  micro-touches and all four transition violations;
- profiler determinism passed; 5.54µs/step versus frozen 5.32 and 14.1 versus
  15.0 matches/s. The lab has no production import, so it adds no live phase or
  allocation; the wall-clock delta is recorded as run variance. Frozen perf
  JSON was restored.

## 9. Exact interpretation

B1d-0 falsifies one narrow concern: B1c's constant-velocity fake trajectory was
not the only kind of close-control recovery available. The current kinematic
player can meet an independently moving ball by changing its own locomotion
under the existing integrator and limits.

It does **not** show that a live cadence, possession continuity or opponent
interaction is correct. Swept contact, retime, own-touch priority and semantic
possession protection remain unauthorised. Any B1d-1 proposal must separately
resolve actual `Match.step()` insertion, simultaneous controller/opponent
claims, interruption, action permissions and live football payoff before code
is wired.
