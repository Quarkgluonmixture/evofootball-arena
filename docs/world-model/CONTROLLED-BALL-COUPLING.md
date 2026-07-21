# Controlled Ball Coupling — B1c architecture contract

Status: **B1c-0 representation + B1c-1/B1c-2 isolated mechanisms retained;
B1c-3 live A/B tried and fully reverted. B1c is closed and live behaviour remains
the accepted B0 path.** This was the only authorised retry of the Ball-Control Foundation after the two rejected B1 candidates in
[`BALL-CONTROL.md`](BALL-CONTROL.md).

## 0. Verdict

> Reopen “球忠于脚” only as **Controlled Ball Coupling**:
> **independent physical ball + continuous control sequence + discrete real
> touches.**

Do not tune the old carry distance or add another timer. Do not glue the ball to
a foot. The new causal boundary is:

```text
ball physically leaves the foot
≠ control process has ended
≠ a new loose-ball contest should open
```

The ball need not stay at one fixed foot point. It must stay faithful to the
controller's **recoverable future**: between planned touches it may roll away,
but the same control sequence remains active only while the player still has a
credible next touch.

## 1. Why a retry is allowed

The two B1 failures were not random bad numbers:

1. Moving the still-owned authoritative ball through a foot cadence leaked
   high-frequency carry position into pass-arrival and produced a 113-contact
   chain (B0 maximum: 8).
2. Making each pressured close touch a physically free ball, even with a narrow
   self-retention exception, raised knocks `7.10→52.92` per match, contests
   `17.00→24.96`, maximum M3 recontacts `8→68`, and shortened mean possession
   `5.73→5.04s`.

Together they identify a missing representation between micro-touch physics and
possession transition. B1c satisfies the existing retry rule because it changes
that causal representation. It is not a third distance/timer variant.

## 2. Three different meanings of “faithful to the foot”

### Rejected: presentation-only fidelity

Drawing the ball at the shoe while simulation says it is elsewhere is a lie.
M4 removed that split: renderers, contacts and rules must use the authoritative
ball position.

### Rejected: position-lock fidelity

Writing `ball.pos` to a virtual left/right foot every frame makes gait phase
silently control tackle distance, pass arrival, shot origin and TeamBrain. It
also lets an animation cycle alter deterministic football outcomes.

### Target: control-process fidelity

The authoritative ball remains free to move under physics. A sequence of real,
discrete impulses maintains a recoverable player–ball relationship. An opponent
can interrupt it at the real ball position.

## 3. State separation

Today `ball.owner` carries too many meanings: current controller, physical carry
constraint, capture exemption, on-ball actor, pass-chain lifetime and team
possession. B1c introduces a separate process without immediately deleting the
legacy field.

The exact TypeScript shape may change during B1c-0, but its semantics must not:

```ts
type ControlSequence = {
  id: number;
  controllerGid: number;
  origin: 'reception' | 'interception' | 'looseControl' | 'selfRegather';
  startedTick: number;
  lastOwnTouchTick: number;
  touchIndex: number;
  status: 'active' | 'broken' | 'released';
  breakCause?: ControlBreakCause;
};

type BallControlState =
  | { kind: 'secured'; controller: Gid; sequenceId: number }
  | {
      kind: 'carried';
      controller: Gid;
      sequenceId: number;
      gaitPhase: number;
      nextTouchTarget: Vec2;
    }
  | {
      kind: 'knocked';
      controller: Gid;
      sequenceId: number;
      regatherDeadline: number;
    }
  | { kind: 'free' };
```

This is an architecture contract, not permission to add all fields at once.
B1c-0 should land the smallest pure-data form that can prove the invariants.

### Control lease

“Lease” is the rule governing an active `ControlSequence`, not magical ownership.
It says only that own planned micro-touches continue the same control process.

An own planned touch:

```text
apply a real bounded ball impulse
→ record carryTouch
→ increment touchIndex
→ continue the same sequence
```

It must **not**:

- call the generic `giveBall()` transition;
- create a `pendingPass` / pass-arrival lifecycle;
- open a new `ContestEpisode`;
- change possession side or possession spell;
- count as losing and reacquiring the ball.

An opponent's real touch:

```text
break lease with a cause
→ enter normal M3 contact → control
→ controlled / loose / recontest
```

An own sequence also ends explicitly on pass, shot, genuine open-field knock,
out/dead ball, or when the recoverable-future invariant fails.

## 4. PossessionLocus — semantic projection, not a second ball

The second structural boundary is consumer frequency. High-frequency physical
ball motion and macro possession meaning cannot be forced to share every
centimetre of left/right touch movement.

`possessionLocus` is a deterministic derived projection:

```text
active control sequence
  ? controller-centred / low-frequency control locus
  : ball.pos
```

It is not rendered, does not collide and never replaces the ball in rules or
execution. It exists so the team model does not treat a 40cm foot switch as a
new attack state.

It is derived—not a second independently integrated position. B1c-0 must not
add a hidden smoothing clock or a mutable second trajectory. If later evidence
requires temporal filtering rather than a controller-centred projection, that
is a separate stateful lever with its own determinism and lag tests.

| Must read authoritative `ball.pos` | May consume `ControlSequence` / `possessionLocus` after an isolated change |
|---|---|
| ball/foot contact and exposure | possession side and possession spell |
| opponent poke, tackle, interception | coarse progression position |
| out-of-play, goal line, posts/crossbar | TeamBrain tactical phase |
| pass/shot release position | on-ball actor identity |
| renderer and replay | formation and team-mode context |
| M3 contact claims | pass-chain continuity |

This table is a hard boundary. Before any consumer is switched, B1c-0 must make
an explicit census of every `ball.pos` and `ball.owner` read and classify it.
Unknown consumers stay on authoritative state.

## 5. Touch generation without simulated legs

### Virtual gait phase

Touch cadence must come from movement, not an independent fixed timer:

```text
gaitPhase += distanceTravelled /
             strideLength(speed, turnDemand, pressure)
```

The phase is authoritative sim state. Renderer and probes may read it; the
renderer must not invent a separate phase. A left/right phase is enough for the
first slice—there is no preferred-foot gene.

### Virtual foot anchor

```text
footAnchor = player.pos
           + bodyDir * forwardOffset
           + perpendicular(bodyDir) * footSide * lateralOffset
```

It is a query point, not a collider, magnet or per-frame position target. It may
answer whether a planned touch is geometrically plausible and give the contact
impulse a direction.

### Control corridor

The next touch aims into a corridor, not an exact foot coordinate:

- low speed / pressure / hard turn → short horizon, frequent touch, narrow
  lateral error;
- jog → medium horizon;
- open-space sprint → longer touch and eventually the existing genuine
  kick–chase–regather regime;
- sharp change of direction → lateral effort touch.

Each micro-touch modifies velocity only:

```text
desiredBallVelocity = velocityToReach(nextTouchTarget, horizon)
ball.vel += boundedImpulse(desiredBallVelocity - ball.vel)
```

No B1c behavioural stage writes `ball.pos` to a foot anchor.

## 6. Two regimes, one ball

```text
close control
  = persistent ControlSequence with discrete own touches

open-space knock
  = existing kick → chase → regather
```

Do not convert every close-control footbeat into a miniature pass-arrival or
open knock. Do not erase the existing Phase-36 knock, whose B0 outcome mix is
already frozen.

## 7. Build order and gates

### B1c-0 — consumer census + representation · BYTE-IDENTICAL

This is the exact starting point.

1. Map every simulation reader/writer of `ball.owner`, `ball.pos`,
   `possessionSide`, `pendingPass`, `dribbleTouch` and the M3 contest lifecycle.
   Classify each as physical truth, control-process truth or macro possession.
   The landed census is
   [`CONTROL-CONSUMER-CENSUS.md`](CONTROL-CONSUMER-CENSUS.md).
2. Add the minimal `ControlSequence` / break-cause event vocabulary and a pure
   `derivePossessionLocus` helper. No AI, physics, tackle, possession or renderer
   consumer reads the new state.
3. Add clone/save/invariant coverage as required. Prove feature-off and normal
   runs are byte-identical at both frozen fingerprint seeds.
4. Add the observational `control-sequence-anatomy` ledger/probe shell. On B0 it
   must report no fabricated active sequences or transitions.

Gate: clean tsc/build/full Vitest, exact fingerprints, watched=headless,
deterministic clone continuation, no perf regression. No user play-test yet
because no behaviour should change.

**✅ DONE 2026-07-21.** The production census found 110 `ball.owner` and 165
`ball.pos` occurrences across 12 source files and classifies every consumer
family in [`CONTROL-CONSUMER-CENSUS.md`](CONTROL-CONSUMER-CENSUS.md). The landed
runtime state is exactly `Match.controlSequence = null`; `possessionLocus` is a
pure getter that returns the authoritative ball unless an active, resolvable
sequence exists. No existing AI, physics, tackle, possession or renderer path
reads either fact. Four new invariants cover ball fallback, active-controller
projection, terminal/missing-controller fallback and structural clone identity.
The 120-match probe reports zero sequences/touches and all four violation
counters exactly zero. Gates: build clean · 494/494 tests · fingerprints unchanged
(`57b0bdab…`, `4ac9408d…`) · profiler determinism OK · 5.25µs/step versus frozen
5.32, 14.8 versus 15.0 matches/s. The frozen perf JSON was restored after the
measurement. Stop here; B1c-1 is the next isolated behavioural mechanism.

### B1c-1 — single-player coupling

In an isolated no-opponent mechanism scene, activate one sequence and advance
the authoritative ball only through bounded impulses. Prove variable cadence
across speed/turn regimes, recoverability, and **zero possession transitions**.

This stage must not switch macro AI consumers. If a macro consumer must change,
that is a separately measured lever after the physical mechanism is stable.

**✅ DONE 2026-07-21 as an isolated mechanism, not live wiring.** Pure
`controlCoupling.ts` now provides distance-integrated gait, alternating virtual
foot query points, a future control target and bounded velocity-only impulse.
It is not imported by `Match`, AI, mechanics or render. The 10s deterministic
solo matrix produces: walk-open 1.60 touches/s, jog-open 2.50, pressed-turn jog
3.30, sprint-open 3.20; every planned contact remains within the 1.25m recovery
envelope. Mean foot error is 0.134–0.194m, maximum 0.197m; sequence id never
changes, and applying a touch never writes ball position, possession, pending
pass or M3. Live 120-match `control-sequence-anatomy` remains all zero. Gates:
build clean · 499/499 · fingerprints exact (`57b0bdab…`, `4ac9408d…`) · profiler
determinism OK · 5.34µs/step vs frozen 5.32, 14.5 vs 15.0 matches/s (no live
import/phase delta; ordinary wall-clock variation). Frozen perf JSON restored.
Stop here before the separately gated one-opponent B1c-2 mechanism.

### B1c-2 — one opponent and lease break

Add one opponent. A real opponent ball contact breaks the sequence and enters
the existing M3 contact→control path. Own planned touches remain inside the
sequence. Prove shielding/access at the real ball location without adding a
direct winner formula or a new dribble decision.

**✅ DONE 2026-07-21 as an isolated mechanism, not live wiring.**
`resolveControlLeaseContact` composes the existing oriented reach + screening
query with the sequence boundary. Own contact advances the existing sequence
without a handoff; exposed opponent contact marks it broken with
`opponentContact` and returns only an `m3` handoff request; screened access leaves
it active. It never chooses a controller or winner. The deterministic mechanism
probe records: own sequence 12→12 and touches 2→3; exposed access=yes,
status=broken, handoff=M3; screened access=no, `blockedBy=3`, status=active. All
five violations are exactly zero (`ownTouchOpenedM3`, sequence change on own
touch, missed opponent break, screened break, winner fields). No `Match`, AI or
renderer path imports it, so the 120-match live probe remains entirely zero.
Gates: tsc/build clean · clean single-worker full run 502/502 · both fingerprints
exact (`57b0bdab…`, `4ac9408d…`) · profiler determinism OK · 5.22µs/step versus
frozen 5.32, 14.8 versus 15.0 matches/s. Frozen perf JSON restored. B1c-3 is the
first live behavioural cut and must stand or revert as one candidate.

### B1c-3 — live A/B and user play-test

Run the complete probe stack, then ship one live candidate for desktop and
phone play-test. The user decides whether cadence and steals are readable and
feel like football. Passing the statistics alone is insufficient.

Pass → freeze B1c and return to S3–S8. Fail → complete revert and return to
S3–S8. There is no automatic B1c-4.

**❌ TRIED + FULLY REVERTED 2026-07-21.** The live candidate correctly kept
own touches outside M3 and possession, but failed before the subjective gate.
At 12 matches, the bounded current-velocity version generated 527 overruns
(~44/match). A broad `PossessionLocus` migration returned the M3 tail to max 8,
but failed zonal press-height and stamina directionality. A one-family
TeamBrain migration left M3 max 19 and the same hard-gate failures. Defining
loss only at an unreachable planned footbeat reduced overrun count to 283, but
left 48.6 aggregate seconds outside 1.25m, produced an M3 max-98 chain and
failed marking plus stamina (FT 0.962; required <0.93). A desired-velocity aim
variant worsened overruns to 920 and was stopped immediately.

Interpretation: `ControlSequence` successfully separates an own touch from a
possession transition, but the live engine still lacks a reliable
movement↔ball recovery prediction. The isolated B1c-1/B1c-2 mechanisms are
valid; composing them by cadence alone is not. All live code, tests and probe
switches were removed, restoring the exact `936b350` sim. Per the precommitted
rule, there is no B1c-4 and no user play-test of a candidate that already fails
objective football contracts. Return to S3–S8; only a future causally new
reachability/recovery model may justify reopening this boundary.

## 8. `control-sequence-anatomy`

At minimum emit:

- sequences per match and origin;
- micro-touches per sequence;
- cadence by speed, pressure and turn demand;
- ball↔controller and ball↔virtual-foot distance distributions;
- relative ball velocity and exposure duration;
- opponent touches that break a lease, by cause;
- genuine release / loss / self-regather outcomes;
- fast reacquire after loss.

The following are exact-zero invariants:

```text
ownTouchOpenedM3
ownTouchChangedPossession
passArrivalContactsAfterControl
duplicateSequenceStart
```

Standing guardrails:

- M3 maximum recontacts must not exceed the frozen B0 maximum of 8 without an
  explicit user-ratified replacement threshold;
- the 113-contact pass-arrival chain must not return;
- knocks must not trend toward the rejected 50+ per match regime;
- possession spell count/churn and mean spell duration must not materially
  regress;
- policy, style and stamina directional contracts remain hard gates;
- sim and renderer must agree on the authoritative touch frame;
- determinism, watched=headless, clone continuation and performance remain
  hard gates.

## 9. Non-goals

B1c does not authorise:

- leg IK, real foot colliders or skeletal physics;
- preferred/weak-foot genome fields;
- named skill moves or a new dribble decision policy;
- complete animation-state machinery;
- strength, balance, shoulder-charge or locomotion expansion;
- whole-ball-over-line or post physics;
- broad TeamBrain rewrites hidden inside `possessionLocus` adoption.

## 10. Evidence and interpretation

External material informs the abstraction; EvoFootball's deterministic probes
and user play-test decide acceptance.

- [FIFA Training Centre: Mastering ball control](https://www.fifatrainingcentre.com/en/practice/elite-sessions/in-possession/mastering-ball-control.php)
  distinguishes close control under pressure from driving into opening space,
  and treats body movement, touch and reading space as coupled skills.
- [EA SPORTS FC 26 gameplay notes](https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)
  explicitly vary dribble-touch intervals and describe first-touch difficulty as
  depending on relative speed, height, exit angle, pressure, body part, stretch
  and attributes. This supports separating movement regime, contact and control;
  it is not an implementation recipe.
- [eFootball v3.0 notes](https://www.konami.com/efootball/en/page/2024/versioninfo_v3-00)
  separately discuss finer post-touch response, body orientation and knock-on
  behaviour. [eFootball v4.0 notes](https://www.konami.com/efootball/en-us/page/v4/versioninfo_v4-00)
  separately expose fine-touch dribbling and physical-contact/shield behaviour.
- [Measuring skill via player dynamics in football dribbling](https://doi.org/10.1038/s41598-023-45914-6)
  models the dribbler and ball as a coupled dynamical system in a continuous 1v1
  event. This motivates the process view; EvoFootball keeps a far cheaper
  deterministic abstraction.
- [PhysicsFC](https://doi.org/10.1145/3731425) uses separate Move, Trap, Dribble
  and Kick policies with a finite-state skill transition system. Its full-body
  RL solution is out of scope; the useful lesson is that control is a managed
  process across distinct skills, not a permanent ball attachment.
- [GameplayFootball](https://github.com/BazkieBumpercar/GameplayFootball) is a
  useful open-source engine comparison, not a code dependency or authority. Any
  mechanism borrowed from it still has to be re-derived for EvoFootball's fixed
  timestep and determinism contract.

The architecture above is an EvoFootball engineering inference from those
sources plus the two rejected same-engine experiments. Claims about what B1c
will do to live football remain hypotheses until the repo's gates pass.
