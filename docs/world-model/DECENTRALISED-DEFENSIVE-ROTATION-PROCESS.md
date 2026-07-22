# D-ROTATE-0 — Assignment-Blind Defensive Rotation Process Gate

Status: **COMPLETE — FAIL; existing local action substrate does not produce common rotation.**

Date: 2026-07-22

## 0. Result

The frozen 64-state run completed twice with byte-identical output:

```text
accepted states                         64 / 64
completed local windows                 64 / 64
states with world events                64 / 64
ticks with >=2 supported local bids     3412 / 3440 (99.2%)
states with >=2 stable leader tenures   34 / 64

states with rotation fingerprint        2 / 64   (gate: 16)
total rotation fingerprints              2         (gate: 20)
eventful-state rotation rate             3.1%      (gate: 30%)
associated event kinds                   2
event kinds with >=4 states              0         (gate: 2)
largest single defender share          100.0%      (gate: <=60%)
```

Exact validity stayed green: no chaser/mark publication, TeamBrain firing,
probe-written action or movement target, Match-RNG consumption, non-finite bid,
clone failure, rerun difference or input-order difference occurred. The formal
report SHA-256 is:

```text
0e7017c8598f416ae2749a81ef885ce9e159b039c52ad133575e1b7732d9a44d
```

The negative result is well supported rather than a coverage failure. Defenders
could observe the carrier and form at least two finite local bids on 99.2% of
eligible ticks; stable responsibility identities also appeared in 34 states.
What did not appear was the embodied sequence in which one player changes the
world, another takes responsibility and the former remains as cover.

Code anatomy explains the boundary. Existing `PlayerBrain` grants normal chase
and mark actions through `team.chasers` and `team.marks`. When those commander
assignments are absent, defenders mostly return to formation; only one narrow
goal-side contain fallback can act without them. Local ETA facts therefore do
not constitute a language for publishing and executing complementary defensive
intent.

Per the frozen stop rule, the process window, stable-tenure duration, event
window and movement threshold are not changed. D-ROTATE-0 does not authorise
selection, results-based fitness, ecology, a live sandbox or commander removal.
A future restart must be causally different: it must first introduce a dormant,
role-neutral local defensive intent/occupancy language and prove that players
can express complementary commitments without central first/second/third
assignments. Merely rerunning the same action substrate is closed.

## 1. Why this is causally different

D-COVER and D-LANE were one-shot point-response experiments. Both proved valid
movement facts and both failed to explain real first control. They are closed.

D-ROTATE-0 does not add another target, margin or response score. It asks whether
the existing live movement/decision substrate can produce a **temporal change
of defensive responsibility** after central assignments are removed:

```text
one defender is locally first to the carrier
→ another stays goal-side while the world changes
→ the second becomes locally first
→ the former first remains behind the play
```

`first`, `delay`, `takeover` and `cover` are post-hoc telemetry labels. No player
is assigned one of those states.

This contract deliberately separates two unresolved problems:

1. **now:** does an assignment-blind closed process exhibit rotation at all?
2. **later, only after PASS:** can selection/competition retain useful versions?

No goals, wins, possession proxy, reception rate, utility or evolution enters
D-ROTATE-0.

## 2. Frozen states and arms

```text
accepted states                  64
fresh match seed range           64000..64127
maximum scanned seeds            128
match duration                   240 seconds
sample cadence                   1 second
minimum match time               10 seconds
administrative clearance         8 seconds
awareness                        0.8
process window                   4.0 seconds
stable responsibility tenure     0.20 seconds (12 ticks)
event association window         ±0.50 seconds (30 ticks)
material body movement           0.25 metres
```

Each accepted state has a live non-GK carrier and at least three observable,
active non-GK opponents. One state is accepted per match seed.

Two structural clones start from the same state:

### C — commander control

The match continues unchanged. This is anatomy only; it is not the target.

### L — assignment-blind local process

At the frozen tick, for the defending team only:

```text
team.chasers.clear()
team.marks.clear()
team.brainTimer = Infinity
every active outfielder decisionTimer = 0
```

The attacking team, carrier, ball and all physics remain live. Existing
PlayerBrain cadence and actions remain the only movement authority. Defenders
may contain, hold shape, react to a loose ball or intercept a real pass through
their existing local action path, but TeamBrain cannot republish a chaser or
mark during the window.

The probe must verify every tick:

```text
defending chasers = empty
defending marks   = empty
defending brainTimer remains non-firing
```

No replacement assignment, first/second/third-defender state or probe movement
command is allowed.

## 3. Local responsibility bids

Each defender maintains its own `PerceptionSnapshot` memory. At every simulation
tick where the ball has an opposing stable owner, the probe asks only:

```text
my observed ETA to the observed carrier interaction shell
am I observed goal-side of that carrier?
my current action type
my observed position
```

ETA uses the accepted `estimateReach()` and `CONTROL_RADIUS` with that player's
known physical profile. Missing carrier observation means no bid for that tick;
truth coordinates are never substituted.

For telemetry only, the smallest finite local ETA is the current responsibility
leader. Exact ties resolve by gid so reruns and input order remain deterministic.
This aggregation never writes an action or publishes a task.

## 4. World events

Re-decision association is allowed only around exact simulation edges:

```text
passStarted          matching pendingPass changes inactive → active
ballReleased         stable owner changes non-null → null
carrierChanged       stable owner gid changes to another opponent
possessionChanged    possession side changes
```

No distance, lane score, bad-touch coefficient or learned trigger creates an
event. Multiple edges on one tick are retained as separate labels.

## 5. Rotation fingerprint

The timeline is compressed into consecutive leader tenures. A tenure is stable
only after the same defender leads for at least 12 ticks.

A rotation fingerprint exists for consecutive stable leaders A then B only if:

1. `A != B`;
2. at least one exact world event occurs within 30 ticks of the leader boundary;
3. B was already goal-side in the final observed sample before taking over;
4. A is goal-side in the first confirmed sample after B takes over;
5. A or B changes existing action type within the same event window;
6. A or B moves at least `0.25m` between the two confirmed samples;
7. both identities came from their own supported local snapshots.

This is a process fingerprint, not evidence that the rotation was valuable.
The order may later be described as pressure → delay → takeover → cover, but
those words do not exist in live state.

## 6. Gates

### Exact validity

```text
accepted states                         = 64
snapshot Match-RNG changes              = 0
L-arm chaser publications               = 0
L-arm mark publications                 = 0
L-arm TeamBrain firings                  = 0
probe-written player actions             = 0 after initial timer reset
probe-written movement targets           = 0
non-finite supported bids                = 0
clone/identity failures                  = 0
deterministic rerun differences          = 0
input-order differences                  = 0
live Match/brain/gene/save changes       = 0
```

### Process support

```text
completed L windows                      >= 56 / 64
states with any exact world event        >= 40 / 64
ticks with >=2 supported local bids      >= 70% of eligible L ticks
states with >=2 stable leader tenures    >= 24 / 64
```

### Primary mechanism

```text
states with a rotation fingerprint       >= 16 / 64
total rotation fingerprints              >= 20
eventful-state rotation rate             >= 30%
distinct associated event kinds          >= 2
states in each of two event kinds        >= 4
largest single defender share            <= 60% of rotation fingerprints
```

The C arm reports the same anatomy but has no pass/fail threshold. Commander
rotations cannot make the L arm pass.

## 7. Exact-zero anti-commander gates

```text
named pressure/cover/balance actions      = 0
first/second/third defender state         = 0
new mark/chaser/task publisher            = 0
central response winner                   = 0
probe-local movement selector             = 0
outcome-aware action choice               = 0
new utility or scalar process score       = 0
win/goal/possession payoff                = 0
preference weights or genes               = 0
selection/evolution                       = 0
```

## 8. Stop and authority

On FAIL, do not extend the window, shorten the tenure, widen the event window,
add a trigger or let the probe move a player. The current substrate cannot
produce a common assignment-blind responsibility rotation; the temporal local
process hypothesis is parked.

On PASS, authorise only a separately pre-registered **selection-authority
design**. That design must solve credit assignment without using reception,
possession or one fixed-window transition as a universal proxy. PASS does not
authorise evolution, a live selector, production genes, commander removal,
league ecology or a visual sandbox.
