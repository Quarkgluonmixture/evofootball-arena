# D-PROC-1 — Observer-local embodied-intent reopening

Status: **STRICT FAIL — response and anti-oscillation mechanisms worked, but
held-exterior false reopening was `7/96` against the frozen `<=4/96` gate. No
selection/ecology or live consumer is authorised.**

Date: 2026-07-22

## 1. Question

D-PROC-0T proved an information boundary:

```text
private intent does not leak
body execution creates observer-specific evidence
private revocation becomes knowable only after the body changes
```

D-PROC-1 asks the smallest next causal question:

> Can one player reopen its own already-existing generic candidate set because
> its own observation now says a teammate is physically committing toward a
> conflicting place, without reading that teammate's private target?

This is not a football-value or payoff experiment. It tests one response path:

```text
A private intent
→ A body moves
→ B observes displacement
→ B's private admissibility changes
→ B revises its own intent
→ B body follows through
```

## 2. Coach tactics and familiarity remain outside this gate

Coach doctrine is an own-team shared prior over principles, priorities, risk
posture and structural constraints. Familiarity may later affect how quickly or
stably a player interprets the same external evidence. Neither belongs in this
first response gate.

All doctrine, coach-tactical familiarity and teammate familiarity are frozen
neutral. They may not:

* reveal A's private target;
* alter the evidence captured from A's body;
* add a success probability or locomotion bonus;
* select B's replacement candidate;
* change the perception cadence.

The purpose is to establish a legal socket for those later influences, not to
smuggle them in before the basic response path works.

## 3. Observer-owned belief support

For B observing A, D-PROC-0T already emits one separate evidence row for every
generic actor candidate. D-PROC-1 adds only a set-valued local belief:

```ts
interface ObserverIntentBelief {
  readonly observerGid: number;
  readonly actorGid: number;
  readonly referenceGid: number;
  readonly referenceEpoch: number;
  readonly observedTick: number;
  readonly supportedCandidateIds: readonly string[];
}
```

A candidate is supported only when all are true:

```text
a new actor observation exists
observed displacement magnitude >= 0.25m
candidate displacement-bearing alignment >= 0.50
```

These are frozen probe resolutions inherited from D-PROC-0T's successful
embodiment audit. Support is a set, not a winner, probability or confidence
score. Empty support is legal and cannot trigger a response.

The belief invalidates rather than carries across a different carrier identity
or reference epoch.

## 4. The only consumer: physical occupancy admissibility

B owns its current private intent and a frozen set of its own ordinary O0
candidates. B may compare those private candidate points with the actor
hypothesis points supported by B's own belief.

A B candidate has an observed occupancy conflict iff its centre point lies
closer than the existing physical `PLAYER_MIN_DIST` to at least one supported A
hypothesis point. This uses the already-authoritative non-penetration distance;
it introduces no tactical spacing coefficient.

The current private intent is retained while it remains admissible. It is
reopened only on a new observer tick where it becomes conflicted. On reopening:

1. discard only candidates currently conflicted by the supported set;
2. keep the same frozen O0 candidates, offside legality and physical facts;
3. beginning immediately after the old candidate in canonical candidate-ID
   order, take the first remaining admissible candidate;
4. if none exists, return `unsupported` and keep the current physical action.

The cyclic tie-break is deliberately probe-owned and has no football-value
claim. It exists only to let the response path reach normal locomotion without
introducing a scalar, tactical name, role rule or coach answer. It may never be
used by live AI.

## 5. Lifecycle and anti-oscillation

Every revision:

```text
old private intent → invalidated by observed occupancy conflict
new private intent → proposed → committed → normal MoveToPoint execution
```

No timer opens a revision. Repeated calls with the same `observedTick` are
idempotent. Stale evidence, empty support and a still-admissible current target
must keep the current intent.

Within the 36-tick lab window, a player may revise again only after a strictly
new external observation creates a conflict with its then-current target.
Immediate `A → B → A` candidate oscillation is forbidden. There is no minimum
commitment duration, cooldown, sticky bonus or global uniqueness rule.

## 6. Frozen suite

```text
fresh match seeds       85,000..85,191
maximum scanned seeds   192
accepted states         96
one state per seed       maximum
awareness               0.8
movement window         36 ticks
sample opportunity      once per simulated second
```

Accept a live attacking state only when:

* there is one stable non-goalkeeper carrier and at least six seconds remain
  before an administrative boundary;
* A and B are distinct non-goalkeeper teammates, and B's snapshot supports A
  and the carrier;
* A's initial speed is at most `0.50m/s`;
* A and B each expose at least five finite, perceived-onside O0 candidates;
* the auditor can freeze one A candidate and one B candidate whose points are
  within `PLAYER_MIN_DIST` in B's observer world;
* B has at least three other frozen candidates outside that physical distance;
* acceptance reads no future displacement, belief, revision or outcome.

The auditor creates A's and B's private intents. This intervention establishes
an accidental route/target conflict; it does not claim either intent is a good
football choice.

The carrier holds in every arm. A, B and the carrier keep existing physics and
have production decisions held beyond the window. No other player is assigned
a task or frozen.

## 7. Three paired arms

### H — held exterior, consumer enabled

A has the same private target as the embodied arms but holds its initial point.
B executes its initial private intent and may observe A. This exposes false
reopening caused by private knowledge or harmless residual motion.

### I — embodied, signal-blind

A normally executes its private `MoveToPoint`. B executes its initial intent,
but the reopening consumer is disabled. This freezes the physical conflict
without allowing the response.

### C — embodied, observer-local consumer

A executes exactly as in I. At each normal perception update, B derives belief
support from D-PROC-0T evidence. Only a newly observed physical occupancy
conflict may invalidate and replace B's private intent. The replacement uses
normal `MoveToPoint`; no position, velocity or heading is written.

I and C must be physically and observationally byte-identical through the tick
immediately before C's first valid reopening.

## 8. Primary mechanism

The ordered response fingerprint is:

```text
1. A and B begin with conflicting private target regions
2. A produces at least 0.25m newly observed displacement
3. B's local belief supports one or more A hypotheses
4. B's current private target is conflicted in B's observer world
5. C invalidates that target on the same observer update
6. C commits one existing admissible B candidate
7. B physically progresses at least 0.25m toward the replacement
8. I retains the original target
```

The probe also records revision count, evidence tick, support set, old/new
candidate IDs, target writes and complete physical signatures.

## 9. Frozen gates

### Exact validity

```text
accepted states                                      = 96
scanned seeds                                        <= 192
jointly completed H/I/C states                       >= 72
private/schema/identity failures                     = 0
observer reads of A private target/phase/action       = 0
Match-truth or unsupported-identity fallbacks         = 0
perception RNG-state changes                          = 0
direct pos/vel/heading/desiredVel writes              = 0
production Match/brain/executor changes               = 0
non-finite belief/candidate facts                     = 0
I/C pre-reopening physical/evidence differences       = 0
same-observedTick duplicate revisions                 = 0
replacement outside frozen B candidate set            = 0
replacement still conflicted at selection             = 0
```

### Support and mechanism

```text
states where C obtains non-empty embodied support     >= 64 / 96
C ordered response fingerprints                       >= 56 / 96
C - H response-fingerprint edge                       >= 48 states
I response fingerprints                                = 0
H false reopenings                                    <= 4 / 96
C replacement physical progress >= 0.25m              >= 75% C revisions
C and I B-body separation >= 0.25m                    >= 60% C revisions
unsupported/no-alternative events retained honestly    = 100%
```

### Non-oscillation

```text
immediate A→B→A candidate cycles                       = 0
revisions without a strictly newer observation         = 0
revisions while current target remains admissible      = 0
maximum revisions in any completed C state             <= 3
```

Two complete executions must emit byte-identical canonical JSON and SHA-256.
The production fingerprint must remain
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

## 10. Hostile tests

1. different A private targets with identical exterior cannot change belief;
2. stale repeated evidence is idempotent;
3. empty supported set keeps B's current intent;
4. supported A hypotheses that do not overlap B keep its intent;
5. overlap below `PLAYER_MIN_DIST` reopens;
6. equality at `PLAYER_MIN_DIST` remains admissible;
7. an inadmissible replacement can never be selected;
8. reversed candidate input order produces the same replacement;
9. changed reference epoch invalidates belief before use;
10. neutral familiarity/doctrine cannot change support or reopening;
11. mutation of source candidates after evaluation cannot change the result;
12. repeated evaluation at one observed tick cannot create another revision.

## 11. Stop and authority

FAIL stops this consumer. Do not lower displacement/alignment resolution,
increase conflict distance, select a flattering response, add a score, add
explicit commitment sharing, add coach/familiarity bonuses, lengthen the window
or filter attrition after opening 85k.

PASS proves only that private intent can produce a non-telepathic, embodied,
observer-triggered adjustment without oscillation. It authorises one separate
D-PROC-2 selection/ecology design contract. It does not authorise live wiring,
TeamBrain removal, a production tie-break, payoff claims, genes, coach tactics,
familiarity, communication or evolution.

## 12. Frozen result

Implementation:

* `src/ai/intentResponse.ts` provides set-valued observer belief support and a
  pure physical-admissibility reopening query;
* `tests/intentResponse.test.ts` contains the 12 hostile tests above;
* `scripts/probes/embodied-intent-reopening.ts` runs H/I/C.

The unchanged 85k suite scanned 162 seeds, accepted 96 states and jointly
completed 76. Paired attrition remained explicit: 11 loose-ball state-equivalents,
five arm-level dead/restart terminations and 21 arm-level observer-unsupported
terminations. There were zero schema failures.

All exact gates passed:

```text
I/C pre-reopening physical equality                 96 / 96
I/C pre-reopening evidence equality                 96 / 96
schema / non-finite / perception-RNG failures        0 / 0 / 0
forbidden intervention changes                              0
duplicate-observation revisions                              0
admissibility / frozen-candidate violations           0 / 0
candidate oscillation cycles                                0
maximum C revisions in one state                            2
```

The main response mechanism was non-vacuous:

```text
C states with non-empty embodied support             83 / 96
C ordered response fingerprints                      59 / 96
I signal-blind response fingerprints                  0 / 96
C - H ordered-response edge                         +52 states
C revised completed states                           75
replacement progress >= 0.25m                        59 / 75
C/I body separation >= 0.25m                         69 / 75
```

The one failed gate was:

```text
H held-target false reopenings                        7 / 96
frozen ceiling                                       4 / 96
```

H did not leak private state: its actor still moved under existing velocity,
acceleration and braking while targeting its initial point. In seven states a
single newly observed displacement exceeded the frozen support rule, so B
responded to real external motion that was not a persistent run. The consumer
therefore cannot yet distinguish active continuation from braking inertia.

Two executions were byte-identical. Canonical report SHA-256:

```text
74c02658c6dbf1e14d520e7abbe29f3ee1d95601b26b6ec9aac76b9a7ccd71c9
```

Per the frozen stop rule, the response consumer stops. The result does not
authorise D-PROC-2. A future revisit must first establish a causally different,
observer-local temporal motion-phase representation—initiation, continuation,
braking and redirection—from multiple external observations. Requiring another
sample or changing the threshold inside this failed consumer would be an
adaptive rescue and is forbidden.
