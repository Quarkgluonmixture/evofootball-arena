# D-PROC-1M — Observer-local temporal motion evidence

Status: **STRICT FAIL — representation parked; no consumer authorised.**

Date: 2026-07-22

## 1. Why this is not a D-PROC-1 rescue

D-PROC-1's response mechanism passed every exact, causal, execution and
anti-oscillation gate, but strictly failed because seven held-target actors
generated enough real braking displacement to trigger a one-observation belief.
Changing that consumer's displacement threshold, requiring one extra sample or
relaxing its false-reopening gate after seeing 85k is forbidden.

D-PROC-1M therefore has a different estimand and no consumer:

> Does an observer's sequence of external body observations contain enough
> explicit temporal information to distinguish continued movement, braking
> inertia and redirection without reading private intent or action state?

It records motion history only. It does not reopen candidates, invalidate an
intent, select an action, score value or rerun D-PROC-1.

## 2. Authority

Each player may know its own private intent. Another player receives only its
own `PerceptionSnapshot` history of that body. The temporal representation may
read:

```text
observed tick and observation age
observed position
observed velocity
observed body direction
```

It may not read:

```text
private target / phase / transaction
Player.action / targetPos / desiredVel
true unobserved position or velocity
TeamBrain assignment
coach gene, tactic or familiarity
future observations
```

The probe auditor knows which physical arm it launched, but that label never
enters the representation.

## 3. Minimal history

Only strictly newer actor observations enter history. Stale snapshots update
age metadata but cannot create a second sample.

```ts
interface ObservedMotionSample {
  readonly observerGid: number;
  readonly actorGid: number;
  readonly observedTick: number;
  readonly observationAgeTicks: number;
  readonly pos: V2;
  readonly vel: V2;
  readonly bodyDir: V2;
}

interface ObservedMotionHistory {
  readonly observerGid: number;
  readonly actorGid: number;
  readonly referenceGid: number;
  readonly referenceEpoch: number;
  readonly samples: readonly ObservedMotionSample[]; // newest three only
}
```

A different actor, carrier or reference epoch invalidates rather than carries
the old history.

## 4. Total evidence vector

Three strictly increasing observations produce:

```ts
interface ObservedTemporalMotionEvidence {
  readonly observerGid: number;
  readonly actorGid: number;
  readonly referenceGid: number;
  readonly referenceEpoch: number;

  readonly firstTick: number;
  readonly middleTick: number;
  readonly lastTick: number;

  readonly firstIntervalSeconds: number;
  readonly secondIntervalSeconds: number;

  readonly firstDisplacement: V2;
  readonly secondDisplacement: V2;
  readonly firstAverageVelocity: V2;
  readonly secondAverageVelocity: V2;

  readonly firstSpeed: number;
  readonly middleSpeed: number;
  readonly lastSpeed: number;
  readonly firstSpeedDelta: number;
  readonly secondSpeedDelta: number;

  readonly firstVelocityTurn: number | null;
  readonly secondVelocityTurn: number | null;
  readonly firstBodyTurn: number | null;
  readonly secondBodyTurn: number | null;
  readonly displacementPersistence: number | null;
}
```

Every field is a separate physical fact. There is no categorical
`starting/continuing/braking/redirecting` output, probability, confidence or
aggregate score. Those words are auditor labels for paired interventions only.

Angles are signed shortest angles in `[-π, π]`. Persistence is the cosine
between the two displacement vectors and is nullable if either interval has
near-zero displacement. All vectors are copied.

## 5. Frozen arms

Freeze 96 fresh live attacking states from seeds `86,000..86,191`, maximum one
per seed. Awareness remains `0.8`. The carrier and one designated observer hold
identically in every arm; their decisions are held beyond the 48-tick window.
The actor uses existing `MoveToPoint` and normal locomotion.

Accept only when:

* play is live with a stable non-goalkeeper carrier and at least six seconds
  before an administrative boundary;
* actor and observer are distinct non-goalkeeper teammates;
* the observer snapshot supports actor and carrier;
* actor true initial speed is in `[0.25, 0.50]m/s`, deliberately retaining the
  braking-inertia regime that failed D-PROC-1;
* actor exposes a finite perceived-onside 1.5-second O0 candidate whose bearing
  has maximum alignment with current velocity;
* a second finite 1.5-second candidate is separated from the first by at least
  `π/2` around the actor and by at least `4m` in world space;
* acceptance reads no future sample or outcome.

Three paired arms:

```text
H — braking/hold
    actor targets its initial point for all 48 ticks

E — continued embodiment
    actor follows the first frozen target for all 48 ticks

R — redirection
    identical to E through tick 24; private intent and MoveToPoint target then
    switch to the already-frozen second target, with no direct body write
```

The 24/48-tick boundaries are probe windows, not gameplay coefficients.

## 6. Primary measurement

For every arm, retain every observer-local sample and every total evidence
vector once three observations exist. Auditor summaries are:

```text
net observed displacement
final observed speed
sum of absolute velocity turns
sum of absolute body turns
minimum / maximum speed delta
```

The paired question is whether the external sequence distinguishes the arm
families, not whether a classifier can name them.

## 7. Frozen gates

### Exact validity

```text
accepted states                                     = 96
scanned seeds                                       <= 192
jointly completed H/E/R states                      >= 72
schema / identity failures                          = 0
private/action/desiredVel reads by representation    = 0
Match-truth fallbacks                                = 0
perception RNG-state changes                         = 0
direct pos/vel/heading/desiredVel writes              = 0
production Match/brain/executor changes               = 0
non-finite total evidence                            = 0
duplicate or non-increasing samples                  = 0
history length                                       <= 3 always
reference-epoch leakage                              = 0
```

### Observation support

```text
completed arms with >= 4 distinct actor observations >= 95%
completed states with at least one aged observation  >= 20
E and R share identical evidence before R's
  first post-switch physical observation             = 100%
```

### Continued movement versus braking inertia

```text
E/H evidence sequences differ                        >= 90% completed
E net displacement - H net displacement >= 0.50m     >= 60 / 96
E final speed - H final speed >= 0.50m/s              >= 60 / 96
H has a negative observed speed delta <= -0.10m/s     >= 48 / 96
```

### Redirection versus continued movement

```text
R/E post-switch evidence sequences differ            >= 75% completed
R absolute velocity-turn sum exceeds E by >=0.15rad  >= 48 / 96
R absolute body-turn sum exceeds E by >=0.15rad      >= 48 / 96
```

These are representation separability gates. No dimension may be promoted to
a selector or collapsed into a motion-phase scalar after the result.

Two full runs must produce byte-identical canonical JSON and SHA-256. The
production fingerprint remains
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

## 8. Hostile tests

1. stale snapshots cannot append samples;
2. out-of-order ticks are rejected;
3. actor/reference/epoch mismatch invalidates history;
4. fewer than three samples returns unsupported evidence;
5. constant velocity yields zero speed delta and zero velocity turn;
6. braking yields negative speed delta without any private target input;
7. redirection yields signed turn from observed velocity/body only;
8. zero displacement makes persistence null, not zero;
9. input mutation cannot change stored history/evidence;
10. neutral coach doctrine/familiarity cannot change evidence;
11. private revocation before a new body observation cannot change history;
12. mirror transforms preserve speeds and flip signed turns consistently.

## 9. Stop and authority

FAIL parks this motion-history representation. Do not add a fourth/fifth sample,
change the 24/48-tick windows, tune angle/speed gates, read action/desired velocity
or rerun D-PROC-1.

PASS banks observer-local temporal motion evidence only. It authorises a new,
separately pre-registered response contract that may compare single-observation
support with temporal evidence. It does not itself authorise a consumer, live
AI, payoff, coach tactics, familiarity, communication, genes or evolution.

## 10. Frozen result

Fresh seeds `86,000..86,108` supplied all 96 accepted states. The two full
executions were byte-identical, and every schema, privacy, RNG, intervention,
finite-value, sample-order, bounded-history and private-switch-invisibility
check passed. Canonical report SHA-256:

```text
991f641e6421f0540e40237311ddac1f5ac6a62420105ad9b6e4bd2db636c09e
```

The representation nevertheless failed the frozen support and separation
gates:

```text
jointly completed H/E/R states                         59 / 96   (need 72)
completed arms with >=4 distinct observations        137 / 177  (77.4%; need 95%)
states with an aged observation                       59 / 59   (pass)
E/R pre-switch evidence parity                        59 / 59   (pass)

E/H evidence sequences differed                       51 / 59   (86.4%; need 90%)
E-H displacement >=0.50m                              46 / 96   (need 60)
E-H final speed >=0.50m/s                              54 / 96   (need 60)
H negative observed speed delta <=-0.10m/s             54 / 96   (pass)

R/E post-switch evidence sequences differed           45 / 59   (76.3%; pass)
R-E absolute velocity-turn sum >=0.15rad               41 / 96   (need 48)
R-E absolute body-turn sum >=0.15rad                   41 / 96   (need 48)
```

Failure anatomy is not hidden behind one aggregate number. Thirteen states
were interrupted symmetrically by loose/dead-ball world events. Twenty-two
lost observer support in all arms, and another two lost support only in H.
Among jointly completed arms, 40 of 177 still contained fewer than four new
actor observations. The current observer-specific FOV, memory and scan process
therefore does not reliably expose a three-observation motion history across
this live 0.8-second window.

The positive counts are banked only as descriptive signal: most completed
states did distinguish continued movement from braking and redirection from
continued movement. They do not override the pre-registered gates. Per the
stop rule, D-PROC-1M is parked, D-PROC-1 remains failed, and D-PROC-2 stays
closed. No fourth sample, longer window, visibility relaxation, familiarity
bonus, coach prior or response consumer may be added as a rescue.
