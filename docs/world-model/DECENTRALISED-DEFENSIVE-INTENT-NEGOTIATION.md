# D-INTENT-0 — Local Defensive Intent Negotiation Mechanism Gate

Status: **PRE-REGISTERED — probe-only action consumer; no payoff or selection.**

Date: 2026-07-22

## 1. Causal boundary

D-ROTATE-0 proved that defenders can observe the carrier and form stable local
responsibility bids, but that the existing action substrate does not turn those
facts into step-and-cover. `PlayerBrain` currently receives ordinary chase and
mark authority from commander-published `team.chasers` and `team.marks`.

D-INTENT-0 changes exactly one thing: in an isolated arm, explicit local
relation commitments may grant the already existing `ChaseBall`,
`MarkOpponent` or `MoveToFormationSpot` action. It does not add a payoff,
learned selector, tactical role, target score, gene or production consumer.

The question is:

```text
my own perception of opponents
+ existing chase/mark preferences
+ explicit team-mate relation commitments
→ can duplicate intentions settle into complementary actions
→ can responsibility then rotate on real world events?
```

No player is labelled first, second, third, presser, cover or balance. Those
terms may describe a completed trajectory only.

## 2. Frozen suite

```text
accepted states                  64
fresh match seed range           65000..65127
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

Each state has one live non-GK carrier and at least three active opposing
outfielders that observe that carrier. One state is accepted per seed.

Two clones are evaluated:

* **N — no-consumer control:** exact D-ROTATE assignment-blind arm;
* **I — local-intent consumer:** same arm plus the negotiation and action
  mapping below.

Both defending TeamBrains remain non-firing and `chasers`/`marks` remain empty.
The attacking team, carrier, ball, rules and physics remain live.

## 3. Relation commitments

At the initial tick and after an exact carrier-change or possession-change edge,
each defender builds candidates only from its own `PerceptionSnapshot`:

```ts
interface DefensiveRelationCommitment {
  playerGid: number;
  observedOpponentGid: number;
  observedTargetPoint: Readonly<V2>;
  arrivalTime: number;
  action: "ChaseBall" | "MarkOpponent";
  committedTick: number;
}
```

Every observed active non-GK opponent is a generic relation candidate. The
current stable owner uses the existing live chase preference:

```text
policy.chaseBase + genome.pressIntensity × 0.15
```

Other opponents use the existing live mark preference:

```text
policy.markBase + genome.markingAggression × 0.15
```

Within the same preference value, lower `estimateReach()` arrival is earlier;
exact ties use opponent gid. These are the existing PlayerBrain preferences,
not fitted D-INTENT weights.

## 4. Decentralised duplicate settlement

Commitments are constructed in simultaneous rounds from immutable local
snapshots. A defender rejects one relation candidate only when an explicitly
observed team-mate commitment to that same opponent has a lexicographically
better `(arrivalTime, playerGid)` pair. It then considers its next candidate.

All defenders publish their current proposal simultaneously. Rounds repeat
until commitments are unchanged or the number of rounds exceeds the number of
active defending outfielders plus one. The latter is a hard validity failure,
not permission to add a priority rule.

This is not a central allocation:

* no module chooses a winner for an opponent;
* every rejection is calculated independently from the player's own snapshot
  plus explicit commitments;
* missing team-mate perception cannot be filled from Match truth;
* input player/commitment order must not change the fixed point;
* no capacity, named task or first/second/third state exists.

When the owner is temporarily null after ball release, the last commitments
and actions remain in force; no free-ball target is invented. A newly stable
opposing carrier or possession edge triggers a fresh negotiation from current
local snapshots. Expired, sent-off or unobserved identities are unsupported.

## 5. Probe-only action mapping

After a negotiation reaches a fixed point:

```text
commitment targets current stable owner  → existing ChaseBall
commitment targets another opponent      → existing MarkOpponent(targetIdx)
no supported commitment                  → existing MoveToFormationSpot
```

Actions remain fixed until the next authorised world event. The probe may write
only those three existing action states and their existing opponent index. It
may not write position, velocity, heading, desired velocity, `targetPos`,
speed, acceleration, mark/chaser sets or TeamBrain state beyond the initial
non-firing setup.

## 6. Rotation authority

D-INTENT reuses D-ROTATE's exact local responsibility timeline and full rotation
fingerprint:

* consecutive leaders must each persist for 12 ticks;
* identity must change around an exact event;
* the incoming defender was goal-side before takeover;
* the outgoing defender is goal-side after takeover;
* either action type changes;
* either body moves at least `0.25m`;
* all facts remain supported by each observer's own snapshot.

The negotiated commitment ledger is a mediator. It cannot itself count as a
rotation.

## 7. Frozen gates

### Exact validity

```text
accepted states                         = 64
Match-RNG changes from perception        = 0
I-arm chaser/mark publications           = 0
I-arm TeamBrain firings                  = 0
negotiation non-convergence              = 0
duplicate settled opponent claims        = 0
unsupported truth fallbacks              = 0
non-finite candidates/commitments         = 0
probe position/velocity/heading writes    = 0
probe targetPos writes                    = 0
actions outside the three allowed types  = 0
clone/identity failures                  = 0
deterministic rerun differences          = 0
input-order differences                  = 0
live Match/brain/gene/save changes       = 0
```

### Support and mediator

```text
completed I windows                      >= 56 / 64
eventful I states                        >= 40 / 64
ticks with >=2 supported local bids      >= 70% of eligible ticks
states with >=2 stable leader tenures    >= 24 / 64
states with >=2 simultaneous commitments >= 48 / 64
states where duplicate settlement changes a proposal >= 24 / 64
states with at least two action types     >= 40 / 64
```

### Primary mechanism

```text
I states with rotation fingerprint       >= 16 / 64
I total rotation fingerprints            >= 20
I eventful-state rotation rate           >= 30%
I associated event kinds                 >= 2
states in each of two event kinds        >= 4
largest single defender share            <= 60%

I minus N rotation states                >= 12
I minus N rotation fingerprints          >= 16
```

The last two gates make the new consumer carry the claim; naturally occurring
control-arm rotations cannot make it pass.

## 8. Anti-commander and stop rule

Exact zero:

```text
named pressure/cover/balance action       = 0
first/second/third defender state         = 0
central response winner                   = 0
team-wide truth snapshot                  = 0
opponent-aware payoff or outcome lookup   = 0
new utility/aggregate process score       = 0
result, goal or possession fitness        = 0
learning, gene mutation or evolution      = 0
production/live consumer                  = 0
```

On FAIL, do not change preference coefficients, add a target bonus, allow a
second claimant, extend the window, add timer re-decisions or weaken the
rotation fingerprint. The local relation-negotiation family is parked.

On PASS, authorise only a separately pre-registered closed-loop robustness
audit with actual opponent interruption and observer disagreement. PASS does
not authorise payoff selection, real-result fitness, evolution, production
wiring, commander removal or a visual sandbox.
