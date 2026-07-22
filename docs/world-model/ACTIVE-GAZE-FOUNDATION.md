# S3-G0 — Observer-local active gaze foundation

Status: **PRE-REGISTERED — fresh 87k states unopened.**

Date: 2026-07-22

## 1. Why gaze is the next independent world-model fact

The user-ratified authority separates private thought, one's own external body,
other players' external bodies and observer-owned belief. Coach doctrine and
familiarity may guide attention or interpretation, but neither may reveal an
unobserved body.

The current `PerceptionSnapshot` has FOV, scan cadence, memory and keyed error,
but its visual cone is permanently centred on `Player.bodyDir`. A player cannot
run one way while looking over a shoulder. D-PROC-1M then found that the current
passive observer path does not reliably expose a three-observation teammate
history: only 137/177 completed arms obtained four new observations.

S3-G0 does **not** rescue or rerun D-PROC-1M. It asks a different, lower-layer
question:

> At fixed world and body state, can an observer's own gaze direction change
> which external bodies are currently seen, while scan latency, memory, noise,
> physics and truth remain unchanged?

This is an observation-capability gate only. It does not decide where a player
should look.

## 2. Minimal authority

```ts
interface ObserverGaze {
  readonly observerGid: number;
  readonly gazeDir: V2;       // normalised copy
  readonly establishedTick: number;
}
```

Creation is a pure validation boundary. A gaze is valid only when IDs/ticks are
non-negative integers and the direction is finite and non-zero. The stored
vector is normalised and copied.

`perceiveSnapshot()` may accept an optional matching gaze. If absent, current
behaviour remains exactly unchanged and the cone uses body direction. If
present, only the visual cone for that observer uses `gazeDir`.

Gaze does not change:

```text
bodyDir / heading / action / target / desired velocity
visual range or cone width
awareness, scan interval or retention
keyed observation error
near-field body awareness
owned-ball touch/proprioception
world truth, Match RNG or any other player's perception
```

An invalid, wrong-observer or future-established gaze is rejected rather than
falling back silently.

## 3. Information boundary

The observer knows its own gaze proprioceptively. This first slice does not
make another player read that gaze, does not model head animation and does not
publish gaze as a team message.

Allowed inputs:

```text
observer identity
observer-owned gaze
existing PerceptionTruth
existing awareness, scan clock, memory and keyed error
```

Forbidden inputs/effects:

```text
private movement target or tactical intent
coach genome/doctrine
familiarity or teammate identity bonus
future visibility
global union of what team-mates see
automatic look-at-ball/carrier logic
live PlayerBrain or TeamBrain consumer
```

## 4. Frozen real-state audit

Scan fresh match seeds `87,000..87,191`, maximum one accepted state per seed,
until 96 states are accepted. Sample once per simulated second after 10 seconds,
while play is live and at least six seconds from an administrative boundary.
Awareness remains `0.8`.

Accept one non-goalkeeper observer only when:

* one active teammate and one active opponent are each farther than `4m` and
  within the existing visual range;
* their bearings from the observer are separated by at least `2.30rad`, so
  looking directly at one places the other outside the unchanged cone;
* neither target is the observer;
* acceptance reads current geometry only, not a visibility outcome.

Freeze the same truth and create two independent empty memories:

```text
T — gaze directly at the frozen teammate
O — gaze directly at the frozen opponent
```

Both snapshots are captured at the same tick. A third latency check uses the T
memory: switch privately to O gaze one tick before the scheduled scan, then
capture again at the scheduled scan without moving any body.

The audit never calls `Match.step()` after freezing the accepted truth. Tick
advancement for the latency check copies truth and changes its public tick only.

## 5. Frozen gates

### Exact validity

```text
accepted states                                      = 96
scanned seeds                                        <= 192
invalid/wrong/future gaze accepted                    = 0
non-normalised stored gaze                            = 0
Match/world vector mutations                          = 0
Match RNG changes                                     = 0
bodyDir/heading/action/desiredVel writes               = 0
awareness/range/cone/cadence/retention changes         = 0
private/coach/familiarity reads                        = 0
production brain/executor imports                      = 0
non-finite observations                                = 0
```

### Gaze mechanism

```text
T target has a current age-0 observation              = 96 / 96
O target has a current age-0 observation              = 96 / 96
opposite target absent from each empty-memory arm      = 96 / 96
observer proprioception remains current in both arms   = 96 / 96
facts current and visible in both arms are identical   = 100%
fixed body/world signatures are identical              = 100%
```

### Scan and memory semantics

```text
gaze switch before next scan reveals no new target     = 96 / 96
new gaze target becomes current at scheduled scan      = 96 / 96
old gaze target remains as aged memory after switch    = 96 / 96
same gaze/seed/memory sequence reruns byte-identically  = 100%
```

The two complete audits must produce identical canonical JSON and SHA-256. The
production fingerprint remains
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

## 6. Hostile tests

1. zero, NaN and infinite gaze vectors are rejected;
2. gaze vectors are copied and normalised;
3. wrong-observer gaze is rejected;
4. future-established gaze is rejected;
5. absent gaze reproduces the current body-facing path exactly;
6. body fixed + opposite gazes reveal opposite far bodies;
7. near-field bodies remain perceived behind gaze;
8. an owned ball remains exact/fresh behind gaze;
9. changing gaze between scans cannot bypass the scan clock;
10. old visible facts age in memory rather than being deleted immediately;
11. an entity visible in both arms receives identical keyed noise;
12. gaze cannot mutate truth or its input vector.

## 7. Stop and authority

FAIL parks independent gaze. It may not be rescued by widening the cone,
extending range/memory, changing awareness, accepting only favourable outcomes
or using coach/familiarity to fill missing truth.

PASS banks only the physical information channel:

```text
private attention choice
→ observer-owned gaze
→ different current external evidence
```

It authorises at most a separately pre-registered attention-policy experiment.
It does not authorise D-PROC-1M/D-PROC-1 reruns, a live consumer, automatic
scanning rules, coach doctrine, familiarity, communication, payoff, genes or
evolution.
