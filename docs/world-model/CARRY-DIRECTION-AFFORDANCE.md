# K0 — Generic Carry-direction Affordance

Status: **PRE-REGISTERED — representation only; no live direction selector.**

Date: 2026-07-21

## 1. Why this is the next decentralised cut

The transition-estimator line is parked. A pass/off-ball selector still depends
on an authority that did not qualify. Carry direction has a narrower causal
boundary: the current stable controller can observe nearby space and physically
move there without predicting a carrier→flight→receiver handoff.

Current live `Dribble` is not generic direction choice. Its executor hard-codes:

```text
advanced + wide → down-line landmark
otherwise       → opponent goal
near blocker    → committed perpendicular slalom
```

E1 nevertheless found 398/574 wide-progressive ordinary carries moving inward,
mostly outside the explicit down-line zone. This proves the football pattern
called “cut inside” can be an observed trajectory rather than a named action.

K0 therefore adds only the missing choice representation:

```text
controller-specific perception
+ self physical reach
+ symmetric possible directions
→ separate carry affordance facts
```

It must not emit `cutInside`, `goWide`, `takeOn`, a score, a winner or a gene.

## 2. Candidate space

From the observed controller point, generate:

```text
hold
+ 16 evenly spaced attack-frame directions
  at horizons 0.5s and 1.0s
```

Candidate radius is `topSpeed × horizon`; actual feasibility remains a separate
`estimateReach()` fact. Points outside a two-metre pitch inset are rejected, not
clamped or redirected. IDs contain only horizon and direction indices.

Attack direction mirrors only world x. It does not remove backward, lateral or
diagonal choices. No role or current tactical mode changes the set.

## 3. Affordance facts

For every candidate expose, separately:

```text
self arrival ETA and turn time
current body-direction alignment
nearest observed opponent arrival and arrival margin
nearest opponent distance at self arrival
controller-to-target corridor clearance
nearest teammate distance at self arrival
goal distance before and after
goalward progression
goal-corridor clearance from the candidate
attack-frame forward/lateral displacement
field margin
self/ball observation age
observed opponent/teammate counts
```

Every moving body is projected with the accepted S4 constant-velocity observer
projection. Reach uses the accepted S1 estimator and explicit known profiles.
“Space” is therefore derived from opponents, teammates and field geometry rather
than supplied as one magic number.

## 4. Authority and missing facts

K0 consumes only:

* `PerceptionSnapshot` from the controller's point of view;
* controller gid and attack direction;
* known physical reach profiles.

The snapshot must show the controller as stable ball owner. Missing ball, self,
opponents, teammates or physical profiles returns `null`; unseen defence is never
treated as open. The controller's own body and owned-ball cue remain exact under
the accepted S3 representation.

K0 does not predict touch cadence, tackling, future stable control, pass options,
shots, goals or action value. It does not modify `dribbleTarget()`.

## 5. Focused gates

Tests must prove:

1. deterministic unique candidates, full angular coverage and pitch legality;
2. attack-direction mirroring changes only attack-frame x;
3. moving one opponent onto an endpoint reduces opponent spacing and access
   margin without changing candidate identity;
4. moving an opponent onto the travel corridor reduces path clearance;
5. moving a teammate onto the endpoint reduces teammate spacing;
6. changing only goal direction/geometry changes goalward and goal-corridor
   facts, not opponent access;
7. changing controller body direction changes alignment/turn facts at fixed
   geometry;
8. increasing controller physical reach improves ETA/access at one fixed point;
9. owner mismatch, missing defence/profile and malformed inputs are rejected;
10. inputs remain immutable and repeated evaluation is byte-identical;
11. no output contains a score, winner, pattern, role or policy label;
12. no `Match`, `PlayerBrain`, `TeamBrain` or live executor imports K0.

Full tests, TypeScript/build and the production fingerprint must remain green.

## 6. Exact non-goals

```text
new ActionType / live action emitter       = 0
Dribble target or score changes            = 0
roles / named football patterns            = 0
genes / preference weights                 = 0
aggregate feasibility or utility           = 0
candidate filtering by preferred direction = 0
Match or RNG writes                         = 0
```

## 7. Verdict boundary

Passing K0 authorises only a separately pre-registered fresh-state support and
tradeoff census. It does not authorise:

* a generic carry selector;
* a `DribbleToPoint` live action;
* retiring the current down-line/goal/slalom baseline;
* increasing or reducing inward-carry frequency;
* a winger privilege or inverted-winger gene;
* claiming that any direction pays.

Later trajectory names remain telemetry only. The eventual live A/B must prove
mechanism, possession/outcome payoff, evolved selection and watchability before
the handwritten direction baseline can retire.
