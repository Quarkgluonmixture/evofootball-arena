# D-PROC-0T — Private Intent, Embodied Evidence and Observer Belief

Status: **PRE-REGISTERED — fresh 84k mechanism states unopened.**

Date: 2026-07-22

## 1. User-ratified ontology

The authority is not a globally shared commitment:

```text
player private state:
  my intended relation / target / timing / lifecycle

player external state:
  body position, velocity, orientation, ball relation and explicit local cues

other player's internal belief:
  what I infer from the external state I personally observed
```

Each player can know its own private intent and external body state. It can see
only other players' external evidence through its own perception, then revise
its own private belief and intent. No agent can read another player's private
transaction, action target, score table or Match truth.

Coach doctrine is a separate own-team shared prior: principles, priorities,
risk posture and structural constraints may shape private decisions, but may
not assign player identities or world coordinates. Opponents infer doctrine
only from embodied team behaviour. Familiarity may later alter inference
latency/stability under identical evidence; it may never reveal hidden truth or
modify physics.

## 2. Why this precedes a closed loop

D1 proved that explicit O3 records can change one-shot choices. EOR-0 showed
that short attacking movement rarely changes the defender-mediated world.
D-ROTATE/D-INTENT/D-HANDOVER showed that assignment, commitments and one
containment signal do not form robust defensive rotation. T-PAIR-0 finally
closed static kick-vector probability estimation while banking strong ordinal
risk.

The next missing authority is not another score. It is the distinction between:

```text
what I privately mean to do
what my body has actually made observable
what another observer currently believes I may be doing
```

D-PROC-0T establishes only that process state. It does not yet let beliefs
select or replace actions, so it does not reopen the stopped attacking or
defensive consumers.

## 3. Minimal schemas

### Private actor authority

```ts
type PrivateIntentPhase =
  | "proposed"
  | "committed"
  | "executing"
  | "fulfilled"
  | "revoked"
  | "invalidated";

interface PrivateIntentTransaction {
  readonly actorGid: number;
  readonly referenceGid: number;
  readonly referenceEpoch: number;
  readonly targetPoint: V2;
  readonly intendedArrivalTime: number;
  readonly openedTick: number;
  readonly phase: PrivateIntentPhase;
  readonly phaseTick: number;
}
```

This object belongs to `actorGid`. A different observer may not receive it as
input. `referenceEpoch` changes when the carrier/reference relation changes, so
old intent cannot leak into a new possession context.

### External evidence

```ts
interface ObservedIntentEvidence {
  readonly observerGid: number;
  readonly actorGid: number;
  readonly observedTick: number;
  readonly observationAgeTicks: number;

  readonly observedPos: V2;
  readonly observedVel: V2;
  readonly observedBodyDir: V2;

  readonly displacementSincePrevious: V2 | null;
  readonly velocityChangeSincePrevious: V2 | null;
  readonly bodyTurnSincePrevious: number | null;
}
```

It is built only from consecutive observer-specific `PerceptionSnapshot`
records. It contains no private phase, private target, action enum, score,
TeamBrain assignment or true unseen identity.

### Observer-owned candidate evidence

For each generic candidate hypothesis already constructible from the observer's
world:

```ts
interface ObservedIntentHypothesisEvidence {
  readonly observerGid: number;
  readonly actorGid: number;
  readonly candidateId: string;

  readonly velocityBearingAlignment: number | null;
  readonly displacementBearingAlignment: number | null;
  readonly bodyBearingAlignment: number | null;
  readonly observedClosingSpeed: number | null;
  readonly evidenceAgeTicks: number;
}
```

Every fact remains separate. D-PROC-0T emits no winner, probability,
confidence scalar, tactical label or action permission.

## 4. Authority and privacy matrix

| Reader | Own private intent | Own body | Team-mate/opponent body | Other private intent | Coach doctrine |
| --- | --- | --- | --- | --- | --- |
| player | exact | exact | observer snapshot only | forbidden | own-team prior only |
| opponent | exact self only | exact self | observer snapshot only | forbidden | infer from behaviour only |
| probe auditor | may compare after branch | may audit | may audit | never passes it to observer | neutral/frozen |

An explicit cue is external evidence, not private-state sharing. Cue range,
source, age and visibility require a later contract; v0 has no cue channel.

Familiarity and coach-tactical familiarity are frozen neutral in v0. Their
future legal hook is the observer's inference persistence/latency, never the
actor's physics or hidden-state visibility.

## 5. Private lifecycle

The probe creates one generic, onside, finite O0 movement intent before any
outcome is observed. Internal phase changes are event-driven:

```text
proposed → committed
  actor accepts the frozen generic target

committed → executing
  actor itself observes real progress toward its target

executing → fulfilled
  actor reaches the target under the existing control-radius geometry

proposed/committed/executing → revoked
  actor privately replaces or abandons the intent in the explicit revocation arm

any active phase → invalidated
  reference epoch, phase, possession or identity becomes unsupported
```

These phases do not move the body. Existing `MoveToPoint` plus normal physics
is the only movement actuator in embodied arms.

## 6. Paired mechanism arms

Freeze 96 fresh eligible attacking states, at most one per match seed. Choose
one actor and at least two observers by deterministic gid-supported rules.
Freeze at least five generic actor candidate hypotheses from each observer's
initial snapshot.

For one selected private intent run four paired arms:

```text
H — hidden intent, held exterior
    transaction exists; actor holds its initial point

X — different hidden intent, identical held exterior
    only private target differs from H

E — embodied intent
    same private intent as H; actor executes normal MoveToPoint for 24 ticks

R — private revocation before external redirection
    actor privately changes intent after 12 ticks, but observer evidence may
    change only after the body actually redirects through normal integration
```

The fixed 12/24-tick probe boundaries are observation windows, not gameplay
coefficients. At freeze, every arm applies the same probe-local isolation:
the carrier holds, each designated observer holds its initial point, and their
existing decision timers plus the actor's are held beyond the window so
production brains cannot overwrite the intervention.
H/X hold the actor's initial point; E follows the first frozen target; R follows
that same target until its pre-registered tick-12 revocation and then follows
the already-frozen alternate target. These are the only permitted action/target
writes; observer holds are identical in all arms. No branch writes position,
velocity, desired velocity, heading, speed, acceleration, opponent assignment,
ball state or RNG, and no new recurring decision cadence is introduced.

## 7. Hypotheses and gates

### Exact/privacy

```text
accepted states                                      = 96
scanned seeds                                         <= 192
jointly completed H/X/E/R states                     >= 72
private transaction/schema failures                   = 0
observer reads of private target/phase/action          = 0
Match-truth or unsupported-identity fallbacks          = 0
perception RNG-state changes                           = 0
direct pos/vel/heading/desiredVel writes               = 0
production brain/Match/executor changes                = 0
non-finite evidence                                    = 0
```

### H1 — privacy is real

For H versus X, before any external difference:

```text
physical snapshots byte-identical                    100%
observer evidence byte-identical                     100%
hypothesis evidence byte-identical                   100%
self private target differs                           100%
```

Changing another player's private mind may not change what an observer knows.

### H2 — embodiment creates observable information

```text
E actor extra target progress >= 0.25m                >= 75% completed
states with candidate-dependent external evidence     >= 60 / 96
true-intent bearing evidence improves E vs H           >= 50% completed
at least one non-intended hypothesis remains finite    >= 95% completed
```

The `true-intent` label is used only by the auditor after inference; it is never
an observer input or action selector.

For this frozen audit, `candidate-dependent` means a range of at least `0.10`
in any finite bearing-alignment field across the observer's hypotheses.
`true-intent bearing evidence improves` means E has a finite true-target
displacement or velocity alignment of at least `0.50`, while H has no such
embodied field or is at least `0.10` lower. These are probe resolutions, not
gameplay thresholds and may not be adjusted after opening the 84k states.

### H3 — belief is observer-specific

```text
fully supported observer records                       >= 80% completed
partially/aged supported observer records               >= 20 states
different legitimate observers produce different
  hypothesis evidence in                               >= 25% completed
unsupported observers return unsupported                100%
```

No global consensus belief is required or allowed.

### H4 — revocation is not telepathic

In R:

```text
private revocation changes observer evidence before
  any external trajectory/body difference                = 0
observer evidence changes after embodied redirection    >= 50% completed R
stale pre-revocation evidence does not cross epoch        = 0 violations
```

### Determinism and invariants

Two full executions must emit byte-identical canonical JSON and SHA-256. The
production fingerprint remains
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

Focused adversarial tests must additionally cover:

1. identical exterior / different private intents;
2. identical private intent / different embodied execution;
3. invisible actor;
4. stale previous observation;
5. reference epoch change;
6. private revocation before body turn;
7. body turn without private target access;
8. input-order reversal;
9. mutation isolation;
10. neutral familiarity/doctrine cannot change evidence.

## 8. Stop rule and authority

FAIL stops this protocol. Do not lower observation resolutions, expose private
targets, read `Player.action`, add explicit cues, enable familiarity, lengthen
the window or let a state select movement.

PASS authorises only D-PROC-1: one separately pre-registered, probe-only
consumer may reopen an agent's existing generic candidate set when its own
observer belief changes. It still may not prescribe a named response, use
payoff, alter the carrier, remove TeamBrain, add genes or enter live production.

D-PROC-2 selection, real results and evolution remain closed until D-PROC-1
proves a non-oscillatory mutual-response chain.
