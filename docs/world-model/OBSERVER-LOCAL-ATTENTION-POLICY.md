# S3-G1 — Observer-local memory-guided attention

Status: **PRE-REGISTERED — no run yet.**

Date: 2026-07-24

## 1. The question S3-G0 left open

S3-G0 banked the physical channel: an observer's own gaze may differ from its
body direction and honestly changes which external bodies become current at the
scheduled scan. It deliberately did not decide where a player should look.

D-PROC-1M failed because passive body-facing scanning delivered four fresh
observations of one designated moving teammate in only 137/177 completed arms
(77.4%, gate 95%). That was diagnosed as an information-availability boundary,
not a representation defect.

S3-G1 asks the narrowest policy question above the banked channel:

> Using only its own perception memory and proprioception, can an observer aim
> its gaze so that one relevant moving teammate keeps yielding fresh honest
> observations during live play, where the body-facing path loses that
> teammate?

It is a mechanism gate for a **single-target, memory-guided reflex**. It does
not decide which teammate deserves attention (a later S4/coach/familiarity
question), does not schedule attention across several targets, and feeds no
live consumer.

## 2. Minimal authority

One pure dormant function:

```ts
chooseAttentionGaze(
  snapshot: PerceptionSnapshot,     // the observer's own memory view only
  actorGid: number,                 // probe-supplied relevance, not a policy output
  previousGaze: ObserverGaze | null,
): ObserverGaze | null
```

Frozen semantics:

* aim = last-known actor position minus own proprioceptive position, taken
  from `snapshot.players` alone (aged facts allowed);
* if the actor fact or self fact is absent, or the aim is degenerate
  (`length <= 1e-6`), return `previousGaze` unchanged;
* otherwise return `createObserverGaze(observerGid, aim, snapshot.tick)`.

The function is pure: it cannot read `Match`, truth, private intent, coach or
familiarity by construction, and it must not mutate its inputs. No production
code calls it.

## 3. Information boundary

Allowed policy inputs:

```text
the observer's own PerceptionSnapshot (last-known facts + ages)
the observer's own previous gaze (proprioception)
the probe-supplied relevant actor identity
```

Forbidden inputs/effects:

```text
world truth or any other player's memory
the actor's private target, action or intent state
coach genome/doctrine, familiarity, team messages
future observations or the recorded window ahead
any Match/world/RNG mutation
any live PlayerBrain/TeamBrain/executor consumer
```

The truth-aimed ceiling arm below is auditor-owned diagnostics; its aim reads
truth but its observations still pass through the unchanged honest perception
path, and it can never gate the policy PASS.

## 4. Frozen real-state protocol

Scan fresh match seeds `88,000..88,191`, at most one accepted state per seed,
until 96 states are accepted. Matches run 240s with live brains; all outfield
players perceive every tick at awareness `0.8` with per-player memories, as in
D-PROC-1M. Sample once per simulated second after 10 seconds, while play is
live and at least six seconds from an administrative boundary.

Accept the first same-team non-goalkeeper (observer, actor) pair, ordered by
gid, such that at the sampled tick:

* actor speed is within `[0.25, 0.50]`;
* observer–actor distance is within `(5, 30]`;
* `dot(observer.bodyDir, dir(observer→actor)) < -0.80`, so the actor sits well
  behind the unchanged body-facing cone edge;
* the observer's memory holds an actor fact with `ageTicks >= 1`;
* the continued-run target `actor.pos + norm(actor.vel) * 6` stays at least 2m
  inside the pitch;
* acceptance reads current geometry and current memory only, never a
  window outcome.

Freeze a clone of the match, the observer memory and the acceptance snapshot.
Pin only the actor: `MoveToPoint` at the continued-run target with an infinite
decision timer. The observer and everyone else stay live.

**Record once, replay three arms.** Step the frozen clone 48 ticks, recording
the full truth after every step. Because gaze never touches physics, all arms
replay this single recording; physical identity across arms holds by
construction and the recording is audited immutable.

A state aborts (auditor truth-reads only) when the match finishes, play leaves
`playing`, the actor or observer is sent off or re-rostered, the pinned actor
action mutates, or the true observer–actor distance leaves `(4, visual range]`
at any recorded tick. Range and near-field losses are not the failure mode
under test.

Each arm replays ticks 1..48 with an independent clone of the frozen memory:

```text
B — gaze = null (the unchanged body-facing path; D-PROC-1M's condition)
M — memory-guided: gaze at tick i is chooseAttentionGaze applied to the
    snapshot of tick i-1 (tick 1 uses the frozen acceptance snapshot);
    a one-tick reflex latency, no same-tick information
T — truth-aimed ceiling: gaze aims at the true actor position each tick
    (diagnostic only)
```

A fresh observation is an actor fact whose `observedTick` strictly exceeds the
freeze tick and all previously counted ticks in that arm.

## 5. Frozen gates

### Exact validity

```text
accepted states                                        = 96
scanned seeds                                          <= 192
invalid/rejected gaze reaching perceiveSnapshot         = 0
non-normalised stored gaze                              = 0
perception RNG changes (acceptance loop and arms)       = 0
recorded-truth mutation across arm replays              = 0
M-arm policy recompute mismatches from logged snapshots = 0
non-finite observation fields                           = 0
two full runs byte-identical (shared SHA-256)           = required
```

### Completion

```text
jointly completed windows                              >= 72 / 96
```

### Channel validity (diagnostic arm)

```text
T arm: >= 4 fresh actor observations                   >= 95% of completed
```

If T misses this gate the experiment is **CHANNEL-INVALID**, not a policy
FAIL: the scan/retention envelope itself cannot sustain the history even under
perfect aiming, and no policy may be blamed or tuned.

### Mechanism

```text
M arm: >= 4 fresh actor observations                   >= 95% of completed
B arm: >= 4 fresh actor observations                   <= 50% of completed
M fresh count >= B fresh count                         >= 95% of completed
M fresh count >  B fresh count                         >= 50% of completed
```

The B ceiling is the non-vacuity tooth: if live body motion alone re-acquires
the actor in most accepted geometries, the deficit S3-G1 claims to close is
not real in these states, and the result is an honest FAIL of the premise —
not a licence to deepen the rear-wedge acceptance until B looks bad.

Diagnostics reported without gates: per-arm fresh-count distributions, ball
staleness mean/max per arm (the cost of looking away), actor memory age at
freeze, abort census, T-versus-M gap.

## 6. Hostile tests

1. aims exactly at the last-known (possibly aged) actor position relative to
   proprioceptive self, normalised;
2. returns `previousGaze` unchanged when the actor fact is absent;
3. returns `previousGaze` when the aim is degenerate (actor at self);
4. output gaze is normalised, copied and carries `establishedTick =
   snapshot.tick` and the snapshot's own `observerGid`;
5. deterministic across identical inputs;
6. never mutates the snapshot or `previousGaze`;
7. aged facts aim at the remembered position, not the true one;
8. a policy gaze fed to `perceiveSnapshot` is accepted by the existing gaze
   validation (no silent fallback).

## 7. Stop and authority

FAIL parks single-target memory-guided attention. It may not be rescued by
widening the cone, extending range or retention, shortening the scan interval,
adding dead-reckoning or extrapolation terms, re-aiming within the same tick,
or letting truth, coach doctrine or familiarity steer the aim.

CHANNEL-INVALID parks the same work for the opposite reason and equally
forbids envelope tuning.

PASS banks exactly one capability:

```text
own memory of one relevant body
→ own gaze aim under scan latency
→ sustained fresh honest evidence the body-facing path loses
```

PASS authorises at most one user fork: pre-register a gaze-supported temporal
motion evidence gate (a new experiment under the qualified attention channel —
not a D-PROC-1M rerun), or park the branch. It does not authorise a live
consumer, automatic production scanning, multi-target attention scheduling,
target-relevance selection, coach/familiarity attention priors, payoff, genes
or evolution.
