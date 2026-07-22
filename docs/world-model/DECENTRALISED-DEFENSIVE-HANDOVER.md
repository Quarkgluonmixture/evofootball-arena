# D-HANDOVER-0 — Containment-Established Defensive Release

Status: **PRE-REGISTERED — final defensive local-process mechanism gate.**

Date: 2026-07-22

## 1. One new causal ability

D-INTENT proved that observer-local commitments can distribute existing
`ChaseBall` and `MarkOpponent` actions. It failed because assigning a new
chaser immediately released the old one.

D-HANDOVER changes no assignment. It asks only whether release can be a
two-stage transaction:

```text
D-INTENT changes ChaseBall from A to B
→ B executes the existing ChaseBall path
→ B first seeks, then enters existing Player.containing=true
→ A observes B's explicit established signal
→ only then does A adopt its already-frozen superseding action
```

No first/second/third defender state, pressure score, cover target, payoff,
selection or production consumer is added.

## 2. Epoch-safe execution signal

Each prospective replacement publishes only its own execution fact:

```ts
interface DefensiveContainmentSignal {
  publisherGid: number;
  observedCarrierGid: number;
  phase: "seeking" | "established";
  carrierEpoch: number;
  actionAppliedTick: number;
  publishedTick: number;
}
```

The writer may read its own action, own `Player.containing` and own
`PerceptionSnapshot`. Other defenders never read the writer's Player object.

Stale containment cannot open the gate. For a new carrier epoch B must:

1. receive and execute the new `ChaseBall` action for at least one complete
   action/physics tick;
2. publish at least one `seeking` signal in that epoch;
3. only on a later existing `AI_INTERVAL = 0.15s` signal tick may its current
   `containing=true` publish `established`.

An `established` value inherited from a prior action or carrier is invalid.

## 3. Frozen opportunity suite

```text
accepted opportunities             64
fresh match seeds                   66000..66255
maximum scanned seeds               256
one opportunity per seed            yes
process window                      4.0 seconds
signal/update cadence               existing AI_INTERVAL (0.15s)
awareness                           0.8
administrative clearance            4.0 seconds
```

Matches run with the D-INTENT probe-only local consumer and non-firing
defending TeamBrain. An opportunity is frozen at an exact stable-carrier change,
before the new local actions are applied, only when:

* the previous fixed point has exactly one `ChaseBall` holder A;
* the new fixed point has exactly one different `ChaseBall` replacement B;
* A's new frozen action is `MarkOpponent` or `MoveToFormationSpot`;
* A, B and the new carrier are active non-GKs;
* A's current snapshot supports B and the new carrier;
* no future movement, `containing` or outcome fact enters acceptance.

Fewer than 64 opportunities in the sealed range is support FAIL. The range is
not expanded.

## 4. Paired arms

All arms start from the same event snapshot and receive the exact same new
D-INTENT fixed point.

### I — immediate release

B receives `ChaseBall`; A immediately adopts its frozen superseding action.

### H — handover

B receives `ChaseBall`; A retains its prior `ChaseBall` until it locally
supports B's epoch-valid `established` signal. A then adopts exactly the frozen
superseding action on its next 0.15-second update.

### U — signal-blind ablation

Identical to H, except A cannot receive B's signal. A retains `ChaseBall` until
the transaction is cancelled or the window is censored.

H and U must be physically/action identical before H's valid release tick.

## 5. Lifecycle

A transaction contains holder A, replacement B, old/new carrier gids, carrier
epoch, opened tick, retained `ChaseBall`, frozen superseding action and
seeking/established/release ticks.

It cancels without success when:

* the ball becomes unowned;
* possession changes to the defending side;
* the carrier changes again;
* phase leaves `playing`;
* A, B or carrier identity becomes invalid;
* B loses the frozen `ChaseBall` commitment;
* A can no longer support B or the carrier in its snapshot.

There is no transaction timeout. The 4-second experiment boundary censors an
unfinished transaction.

## 6. Ordered handover fingerprint

A complete H fingerprint requires this exact order:

1. carrier change opens A→B transaction;
2. B executes its new `ChaseBall` for at least one full tick;
3. B publishes `seeking` in the new epoch;
4. B later publishes `established` from current `containing=true`;
5. A remains `ChaseBall` through its last supported pre-establishment update;
6. A observes matching B/carrier/epoch establishment;
7. A releases on its next existing AI update, never earlier;
8. A adopts the exact pre-frozen superseding action.

A complete recovery fingerprint additionally requires that after release A is
goal-side in its first supported snapshot and moves at least the already frozen
`0.25m` before the window ends. No recovery target is supplied.

The old ETA-leader rotation is diagnostic only.

## 7. Frozen gates

### Exact validity

```text
accepted opportunities                    = 64
snapshot/signal Match-RNG changes          = 0
TeamBrain firings                          = 0
chaser/mark publications                   = 0
new action types                           = 0
probe targetPos writes                     = 0
probe pos/vel/heading/desiredVel writes    = 0
direct teammate.containing reads by A      = 0
unsupported identity/truth fallbacks       = 0
non-finite fields                          = 0
input-order differences                    = 0
deterministic rerun differences             = 0
nested transactions                        = 0
multiple releases per transaction          = 0
stale-epoch established releases            = 0
```

### Support

```text
completed H windows                        >= 56 / 64
B publishes seeking                        >= 48 / 64
B reaches epoch-valid established          >= 24 / 64
A supports B established signal            >= 24 / 64
seeking-only opportunities                 >= 12
```

### Primary mechanism

```text
H premature releases                       = 0
H seeking-only releases                    = 0
U releases before cancellation             = 0
H ordered handover fingerprints            >= 16 / 64
H complete recovery fingerprints           >= 16 / 64
H - I ordered fingerprint edge             >= 12 states
H - I complete recovery edge                >= 12 states
largest single holder/replacement share    <= 60%
```

For every H success, H and U signatures must be identical until H observes the
valid established signal. I must show that A exited before that establishment.

## 8. Stop and authority

On FAIL, the defensive local-process branch closes. Do not adjust
`AI_INTERVAL`, containing hysteresis, jockey standoff, window length, seed
range, signal lifetime, chaser count, action targets or fingerprint gates. Do
not add bad-touch/back-pass tables, protection scores or TeamCoordinationDemand.

On PASS, authorise only an observer-grounding robustness audit. PASS does not
authorise live PlayerBrain, TeamBrain removal, a signal bus, payoff, selection,
evolution, genes, ecology or a visual sandbox.
