# D-MUT-0 — Mutual motion-gated intent response

Status: **✅ PASS 2026-07-24 — see §7.** (Wall-attempt-4 fork ratified by the
user 2026-07-24; shape corrected by the commander, see §1.)

Date: 2026-07-24

## 1. Why this shape, and why not D-ROTATE re-posed

The user ratified taking the qualified observation channel to the decision
wall. The naive re-pose of D-ROTATE-0 with gaze is rejected by that
experiment's own anatomy: its defenders already formed supported local bids
on 99.2% of eligible ticks — observation was never the binding constraint;
commander-gated action authority was, and its stop rule closes plain re-runs
of the same action substrate.

The wall's first honest brick is therefore built where the qualified channel
demonstrably bites. D-PROC-1G banked a unilateral response of proven quality
(replacement progress 87.7%, C/I separation 96.5%, false reopening 2/96, zero
oscillation) whose only deficit was cadence inside a 0.8s window. D-MUT-0
symmetrises exactly that banked mechanism:

> Two off-ball teammates hold privately conflicting intents. Each may read
> the other only through its own gaze-driven observations and motion-phase
> evidence, and each runs the UNCHANGED D-PROC-1G consumer. Does the pair
> reach complementary, non-conflicting embodied targets — without a
> commander, without telepathy, and without response oscillation?

This is the minimal instance of the "genuinely new multi-body temporal
state" the authority chain has demanded since D-INTENT closed. New coupled
failure modes it exposes for the first time: mutual belief staleness (both
bodies move while both observe) and cross-player response loops.

## 2. Authority

Everything banked is consumed unchanged:

* `motionGatedIntentResponse.ts`, `motionEvidence.ts`, `intentResponse.ts`,
  `attentionPolicy.ts`, `perceptionSnapshot.ts` — **no existing module may
  change and no new `src/**` module is expected**; the mutual configuration
  is probe-level composition (two consumer instances);
* gaze: A gazes at B and B gazes at A via `chooseAttentionGaze`, one-tick
  latency, previous-gaze threading, frozen acceptance snapshots, full S3-G1
  purity audits per observer;
* support predicate, occupancy admissibility (`PLAYER_MIN_DIST`), cyclic
  probe-owned tie-break, lifecycle and per-player anti-oscillation rules:
  D-PROC-1G §2 verbatim, instantiated once per player;
* coach doctrine and familiarity frozen neutral; no communication channel of
  any kind — each player's belief about the other comes from observation
  alone.

## 3. Frozen protocol

```text
seeds                 91,000..91,191 (fresh; max 192, one state per seed)
awareness             0.8
window                48 ticks (the banked chain length: D-PROC-1G support
                      fires by ~24–32 ticks and lands its response within
                      48; resolution needs only ONE party to fire)
arms                  N — both consumers disabled (conflict materiality)
                      M — both consumers enabled (the target)
                      N and M byte-identical until M's first reopening
```

Acceptance (current geometry and current memories only, one state/seed):

* stable non-GK carrier, ≥6s from an administrative boundary, sampled once
  per simulated second after 10s of live play;
* A and B distinct non-GK teammates of the carrier, initial separation in
  `(5, 30]`, each observing the other AND the carrier in its own snapshot at
  the freeze;
* each exposes ≥5 finite perceived-onside O0 candidates;
* the auditor freezes one private committed intent per player whose target
  points lie within `PLAYER_MIN_DIST` of each other (a real mutual conflict);
* each player retains ≥3 frozen alternative candidates farther than
  `PLAYER_MIN_DIST` from the other's initial target;
* carrier pinned `HoldPosition`; A and B pinned `MoveToPoint` on their
  intent targets with infinite decision timers; all other players live.

## 4. Frozen gates

### Exact validity

D-PROC-1G's exact list verbatim, applied per observer where relevant:
accepted `= 96`; scanned `<= 192`; schema/privacy/RNG/body-write/
production-change/non-finite/duplicate-revision violations all `= 0`;
N/M pre-reopening physical and evidence equality `= 96/96`; gaze purity
(invalid / non-normalised / recompute mismatches) `= 0 / 0 / 0` for BOTH
observers; two full runs byte-identical with shared SHA-256; production
fingerprint unchanged (`57b0bdab…c673`).

### Completion

```text
jointly completed N+M windows            >= 48 / 96
```

(D-PROC-1G completed 59/96 with three arms at this window; two arms attrit
less. A miss here is a completion FAIL, not a licence to re-window.)

### Conflict materiality (N arm, on completed states)

```text
final A–B truth distance < initial       >= 70%
```

The pinned conflicting runs must actually converge; otherwise the accepted
conflicts were not real and the experiment is invalid rather than the
mechanism proven.

### Primary mechanism (M arm, on completed states)

```text
resolved states                          >= 60%
  (at window end BOTH active targets are mutually separated by
   >= PLAYER_MIN_DIST in truth, at least one party having committed an
   admissible replacement through its own consumer)
replacement progress >= 0.25m            >= 75% of all revisions
combined revisions per state             <= 4 in 100% of completed M states
per-player anti-oscillation family       all zeros, max 3 revisions each
unsupported/no-alternative retention     = 100% honest
responder identity                       reported (share diagnostic, no gate)
```

Derivation note (pre-registered, from banked numbers only): 1G fired in
50/59 completed unilateral states (85%) with support 78/96; two independent
readers of a genuinely running partner should fire at least as often, and
resolution needs only one. `60%` prices in mutual-staleness unknowns without
being vacuous.

## 5. Hostile tests

No new `src` module → no new unit-test file is expected. The probe carries
its audits; if the executor finds itself needing new production code, that
is an escalation, not a test problem.

## 6. Stop and authority

FAIL parks the mutual-response family. The write-up must say WHICH coupled
failure occurred: completion (windows), materiality (acceptance geometry),
resolution (mutual staleness — responses fire but conflicts persist), or
oscillation (cross-player loops). No predicate, window, cadence, seed or
tie-break may be adjusted; the fork returns to the user (remaining routes:
the coach shared-prior layer as a coordination aid, or the defensive wall
via a new action-authority language).

PASS banks the first multi-body temporal process: two players converging to
complementary embodied targets through honest observation alone. It
authorises at most one user fork: a three-body extension (rotation-shaped,
either side of the ball), or banking the brick and pivoting to Tracks B/C.
It does not authorise live wiring, TeamBrain changes, relevance selection,
coach doctrine, familiarity, communication, payoff, genes or evolution.

## 7. Frozen result — PASS (2026-07-24)

Probe: `scripts/probes/mutual-motion-gated-response.ts`. Zero `src/**` changes.
Two full invocations byte-identical, plus the internal double run:
**SHA-256 `16e3867a76c9e7e4ac1e0c8f7fbfd0dafc4e51273e1208b02e6eeddffeda0097`**.
Production fingerprint `57b0bdab…c673` unchanged; `npx tsc --noEmit` clean;
full suite 697/697.

### Support and completion

```text
scanned seeds                 96   (<= 192)          91,000..91,095
accepted states               96   (= 96)            one state per seed
jointly completed (N and M)   65   (>= 48)           gate cleared
```

Abort census (identical in both arms, as required): observer unsupported 16,
loose ball 13, dead ball / restart 2.

### Conflict materiality (N arm)

```text
final A–B truth distance < initial     65/65 = 100%   (>= 70%)
N-arm revisions                        0              (consumers disabled)
```

Mean separation collapsed 8.75m → 4.39m over the 48-tick window: the accepted
conflicts were real, and with both consumers off the two bodies walked into
each other exactly as pinned.

### Primary mechanism (M arm, on the 65 completed states)

```text
resolved states                        50/65 = 76.9%  (>= 60%)
replacement progress >= 0.25m          55/70 = 78.6%  (>= 75%)
combined revisions per state           max 2, over-budget states 0  (<= 4)
per-player revisions                   max 1                        (<= 3)
candidate cycles                       0
duplicate revision ticks               0
admissibility violations               0
frozen-candidate violations            0
no-admissible-replacement retentions   0 (none needed; retention honest)
non-empty support (of 96)              A 70 · B 75
responder share (of 65)                A only 19 · B only 11 · both 20
mean final TARGET separation           5.08m (both-revised states: 7.35m)
```

### Exact validity

All zero / all equal, as pre-registered: schema failures, non-finite samples,
perception RNG changes, forbidden action changes, duplicate revision ticks,
admissibility violations, frozen-candidate violations, unsupported-retention
violations, and — **for BOTH observers independently** — invalid gaze 0,
non-normalised gaze 0, gaze recompute mismatches 0. N/M pre-reopening equality
held at **96/96 physical and 96/96 evidence** (both observers' evidence
streams compared separately).

### What the coupled failure modes actually did

The two new failure modes this experiment existed to expose behaved as
follows:

* **Cross-player response loops: absent.** Zero candidate cycles, max one
  revision per player, max two combined per state. Two independent consumers
  reading each other did not chase each other around the candidate ring — the
  unchanged occupancy admissibility test plus the cyclic tie-break was enough,
  with no coordination and no communication.
* **Mutual staleness: present, and it fails safe.** All 15 unresolved completed
  states had **zero** revisions, and every one of them had non-empty support at
  some tick — no tick presented a *supported* partner candidate conflicting
  with that player's own current target, so both players honestly kept their
  intents. There were **zero** states where a response fired and the conflict
  survived. Mutual staleness therefore shows up as under-firing, never as
  thrashing or as a false resolution.

Notable asymmetry-free result: in 20 of the 50 resolved states BOTH players
revised, and those states ended with the *widest* target separation (7.35m vs
5.08m overall) — two bodies stepping off the same spot in opposite directions
without either being told to.

### Two honest deviations from the 1G template, recorded

1. **No initial-speed cap.** D-PROC-1G required the actor to start nearly still
   (`INITIAL_ACTOR_SPEED_MAX = 0.50`) because its H arm froze that actor in
   place. D-MUT-0 has no held arm, and §3's acceptance list contains no speed
   condition, so none was applied. Acceptance is therefore over the natural
   distribution of moving teammates.
2. **Per-revision progress.** 1G measured progress for its single revision only.
   With up to two revisions across two players, each revision's progress is
   measured over its own active span — distance still to run at commit minus
   distance still to run when that revision's span ended (the next revision on
   that player, or the window edge). The `>= 75%` gate is applied to all 70
   revisions, not per state.

### Verdict

**PASS.** Every exact and mechanism gate cleared with nothing tuned. This banks
the first multi-body temporal process in the world model: two players reaching
complementary embodied targets through private observation alone — no
commander, no communication, no shared state. Per §6 the fork is now the
user's: a three-body (rotation-shaped) extension, or bank this brick and pivot
to Tracks B/C. No live wiring, TeamBrain change, relevance selection, coach
doctrine, familiarity, payoff, gene or evolution work is authorised by this
result.
