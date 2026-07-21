# C0 — Team Coordination Demand & Occupancy Foundation

Status: **PRE-REGISTERED — representation only; implementation not started.**

Date: 2026-07-21

## 1. Missing causal fact

O3/O5 can describe where several teammates intend to go and whether their
targets, bearings, arrival times or carrier corridors are similar. O6 then
proved that maximising one such geometric separation is not a sufficient team
allocation rule.

The world still cannot state a simpler coordination fact:

```text
this function currently needs N participants
+ these players explicitly claim it
→ the function is uncovered, adequately occupied, or over-occupied
```

Today `TeamBrain` skips that fact. It directly names chasers, markers, runners,
an arriver and an overlapper. C0 adds only the missing accounting language. It
does not decide which football functions should exist, where their targets
should be, or who should perform them.

## 2. Representation

### Published demand

```ts
interface TeamCoordinationDemand {
  demandId: string;
  targetPoint: Readonly<V2>;
  earliestArrival: number;
  latestArrival: number;
  minimumParticipants: number;
  maximumParticipants: number;
  publishedTick: number;
  validUntilTick: number;
}
```

The demand identifier is opaque. The representation contains no `overlap`,
`cutInside`, `press`, role or formation label. Target, arrival window, capacity
and lifetime are caller-owned facts; this module supplies no defaults.

### Explicit claim

```ts
interface TeamCoordinationClaim {
  demandId: string;
  playerGid: number;
  committedTick: number;
  validUntilTick: number;
}
```

A claim records intent only. It grants no action permission, priority, speed,
ball access or right to remain assigned.

### Occupancy ledger

For one explicit demand and current tick, the pure evaluator returns:

* active claimant gids in stable order;
* active claim count;
* `missingParticipantCount = max(0, minimum - active)`;
* `excessParticipantCount = max(0, active - maximum)`.

These are arithmetic conservation facts, not a task score. The evaluator does
not infer whether spatially similar O3 commitments count as the same task; only
an explicit matching `demandId` occupies capacity.

### Per-player demand facts

A second pure query composes one caller-supplied player arrival estimate with
the occupancy ledger and exposes separately:

* arrival time;
* slack to the earliest and latest arrival boundary;
* whether arrival falls inside the published window;
* whether the player already claims this demand;
* all other active demand IDs the same player currently claims;
* the unchanged occupancy conservation fields.

This is not a bid score and does not create a claim. Reachability, legality,
offside, perception quality, opponent access and transition value remain in
their existing upstream representations rather than being collapsed here.

## 3. Authority boundaries

* The module is pure and imports no `Match`, `Team`, brain, formation, role,
  policy, gene, action executor or RNG.
* It consumes demands, claims, a current tick and an externally computed
  arrival time. It does not publish a demand or estimate arrival itself.
* No task priority, utility, total order, winner, allocator or tie-break exists.
* No task name is interpreted. Opaque IDs may appear in telemetry, but cannot
  change arithmetic.
* No capacity is inferred from team size or phase. `minimumParticipants` and
  `maximumParticipants` are explicit caller authority.
* Expired demands are unsupported. Expired claims are ignored. A malformed
  demand or claim returns `null`; unknown coordination state is not treated as
  free capacity.
* A player may explicitly claim multiple distinct demands. C0 reports that
  fact without declaring a conflict or releasing another task.
* Duplicate active claims by the same player for the same demand are invalid,
  not double-counted or silently deduplicated.

## 4. Frozen counterfactual tests

Focused tests must prove:

1. zero claims yields the exact published minimum as missing and zero excess;
2. counts below, inside and above a multi-participant capacity conserve exactly;
3. another demand ID never occupies the current demand;
4. expired claims do not occupy capacity, while active boundary-tick claims do;
5. duplicate same-player/same-demand claims return `null`;
6. malformed demand or claim returns `null`;
7. claim input order cannot change claimant order or any ledger fact;
8. changing only minimum/maximum changes only the conservation arithmetic;
9. arrival-time changes alter only arrival facts, never occupancy;
10. one player claiming other demands is reported but not penalised;
11. mirrored target geometry preserves all scalar occupancy/arrival facts;
12. repeated queries are identical and inputs remain unchanged.

## 5. Exact-zero gates

```text
Match/Team/brain imports                 = 0
live demands or claims created           = 0
production action changes                = 0
task producers                           = 0
allocation/selection/winners             = 0
aggregate scores/priorities               = 0
named football task interpretation       = 0
role/gene/policy checks                   = 0
implicit geometric task matching         = 0
default capacity/window/expiry            = 0
input mutation                            = 0
RNG draws                                 = 0
default fingerprint changes               = 0
```

## 6. Stop rule

C0 stops if the representation needs any of the following to be meaningful:

* a hand-written list of football behaviours;
* a score deciding which demand or player is better;
* automatic demand creation from current `TeamBrain` assignments;
* a geometric threshold that silently merges two demands;
* live `supportSpot`, runner, arriver, overlapper, marking or pressing changes;
* a transition-probability or payoff estimate from the stopped T0b/S7e paths;
* a default task capacity, priority or lifetime chosen after inspecting output.

Passing C0 authorises only an offline demand/claim support census. It does not
authorise a demand producer, player allocator, live commitment, task gene,
`TeamBrain` migration or play-test build. Those require separately frozen
contracts and must preserve named football behaviours as post-hoc phenomena.

