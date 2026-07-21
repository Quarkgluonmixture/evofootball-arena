# Q0 — Secured-ball Access Census

Status: **PRE-REGISTERED — read-only geometry census; no tackle change.**

Date: 2026-07-21

## 1. Missing world-model composition

M2 already answers a generic physical question for loose balls:

```text
Can this actor reach the ball from the front/side/back,
and does an opponent core occupy the direct access line?
```

Standing tackles do not consume that fact. `tryTackles()` chooses the nearest
ready opponent whose centre is within 1.15m of the owned ball, then rolls the
existing probability formula. The same centre distance is therefore treated as
one tackle opportunity whether the defender is in front of the ball or the
carrier's body is between defender and ball.

Q0 asks only whether that missing composition is non-vacuous in real secured-ball
states. It does not change tackle eligibility, probability, strength, ownership,
ball position or player decisions.

## 2. Frozen suite and episode boundary

Run 120 fresh deterministic four-minute matches:

```text
44,000 ... 44,119 inclusive
```

Inspect every pre-step snapshot. A **secured proximity episode** begins when:

* the phase is playing;
* an outfield player is the stable ball owner;
* at least one non-sent-off opponent is within the existing 1.15m centre-to-ball
  standing-tackle radius;
* the nearest such opponent differs from the previous tick's same owner/challenger
  pair.

The episode remains active while that owner/challenger pair remains the nearest
in-radius pair. It closes on owner change, challenger change, loss of proximity or
dead play. Only the first snapshot is recorded, preventing a long shoulder-to-
shoulder spell from counting as dozens of independent examples.

Cooldown, stun and jockey state are recorded but do not remove an episode: Q0 is a
geometry-support census, not a reconstruction of whether `tryTackles()` happens on
that exact future tick.

## 3. Query and measurements

At episode start, call the accepted pure query:

```ts
directBallAccess(challenger, ball, allPlayers, 1.15)
```

Record separately:

* centre distance and surface gap;
* front/side/back access sector and sector-adjusted reach;
* `withinPlayingDistance` and `mustTurn`;
* `blockedByGid`, blocker identity and `mustGoAround`;
* final `canDirectlyContact`;
* whether the carrier itself is the blocker;
* challenger readiness/cooldowns and carrier/challenger body directions;
* ball-to-carrier distance and carrier speed;
* match seed, tick and player identities.

No result is converted into “shield”, “seal-out”, “tackle winner” or a probability
bonus. Those names may be used only later as trajectory/outcome telemetry.

## 4. Frozen gates

### Exact validity

```text
matches represented                     = 120
unique proximity episodes               >= 500
duplicate episode identities             = 0
episode distance above 1.15m              = 0
access partition/conservation failures    = 0
blocked-id/body identity failures         = 0
non-finite geometry                       = 0
query input mutation                      = 0
query-caused RNG draws                    = 0
Match/brain/mechanics writes              = 0
```

The canonical report and full episode ledger must be byte-identical across two
runs. The production fingerprint must remain `57b0bdab…c673`.

### Primary non-vacuity outcome

The existing centre-radius population must contain both physical states:

```text
canDirectlyContact share  >= 10%
cannotDirectlyContact     >= 10%
```

This is the one primary Q0 outcome. It proves that adding the query would
distinguish real cases rather than always accepting or always suppressing the old
circle. It does not prove the eventual behavioural change pays.

### Mediators

Report, without ship thresholds:

* denial split: `mustTurn`, `mustGoAround`, both;
* blocker split: carrier / another opponent / none;
* sector split and access rate by sector;
* ready versus cooldown/stunned episodes;
* carrier-speed and ball-distance quartiles.

No diagnostic may rescue a primary failure.

## 5. Stop rule and authority boundary

Stop this line if:

* either accessible or inaccessible states have less than 10% support;
* owner coupling makes the access query non-finite or ambiguous;
* the probe must infer a winner or call the tackle resolver;
* an attribute/gene/role coefficient is added; or
* any live state changes.

Passing Q0 authorises only a separately pre-registered offline clone intervention
that changes standing-tackle **eligibility** from centre distance to direct access
while preserving the existing success formula. It does not authorise that live
change, strength/balance wiring, a new tackle animation or script retirement.
