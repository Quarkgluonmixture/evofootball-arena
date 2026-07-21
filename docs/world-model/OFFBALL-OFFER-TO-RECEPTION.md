# O4a — Offer Movement to Reception Transition

Status: **PASS as an offline mechanism/payoff bridge. No live selector.**

Date: 2026-07-21

## 1. Question

O2a proved that generic movement creates distinct conditional pass options, but
did not execute the pass. O4a closes exactly one more causal edge:

```text
fixed carrier holds
→ one teammate executes hold / legacy / forward / lateral / backward target
→ force the same ordinary pass action to that teammate
→ observe the first physical transition
```

The first transition uses the accepted Oracle-v2 authority:

```text
intendedReception
teammateRecovery
opponentInterception
loose
deadBall
```

First contact is not stable control, macro possession is not physical ownership,
and unsupported branches are not filled with zero.

## 2. Frozen sample and movement phase

Collect the first 128 deterministic states from seed offset 23000 in which:

* play is live with a stable outfield carrier currently in ordinary `Dribble`;
* one non-carrier outfielder has `SupportBallCarrier`;
* O0 exposes onside, positive-opponent-margin forward, lateral and backward
  candidates;
* at least six seconds remain for the full branch.

Candidate choice remains the O1/O2 feasibility rule: lowest self ETA, then ID.

Clone five branches. For 90 ticks:

* the carrier receives fixed `HoldPosition` plus an infinite decision timer;
* the mover receives one immutable `MoveToPoint` plus an infinite decision timer;
* everyone else and all physics continue normally.

If stable carrier control ends, play stops, or either intervention changes for an
unexplained reason, record the pre-pass transition and do not force a pass.

## 3. Forced pass phase

After 90 valid ticks:

1. release the two probe-local decision suppressions;
2. call the existing ordinary `performPass(carrier, mover)` exactly once;
3. give every geometric branch the same deterministic child RNG seed derived
   from the frozen state (common-random-number attempt, not event pairing);
4. run the accepted Oracle-v2 branch and record only first-transition anatomy.

The fixed-from-kick three-second payoff that Oracle v2 must internally maintain is
not read by O4a. S7e remains parked; this probe does not redesign or reuse its
action-value inference after seeing the pilot.

## 4. Outputs

Per branch report:

* pre-pass same-carrier / loose / teammate / opponent / dead/administrative counts;
* forced-pass count and force failures;
* intended reception, teammate recovery, opponent interception, loose, dead and
  censor counts;
* mean pass progression at the kick.

Every rate uses all forced passes as its denominator. Outcomes are not collapsed
to `success`, and no ordering is assigned to the five transition types.

## 5. Gates

```text
frozen states                         = 128
clone/oracle force failures           = 0
deterministic rerun differences       = 0
active target changes                 = 0
unexplained intervention changes      = 0
non-finite facts                      = 0
forced passes per branch              >= 64
Match/brain/source changes            = 0
live consumers                        = 0
```

As a non-vacuity mechanism gate, the range of intended-reception rates across the
five branches must be at least 5 percentage points. This does not require any
generic direction to beat hold or legacy; it only requires real movement to alter
the transition ecology at a practical scale.

## 6. Stop rule

Stop before selector design if:

* the pass requires a new execution path or target privilege;
* first contact must be called reception;
* pre-pass failures are deleted or converted into pass outcomes;
* fewer than 64 comparable passes remain in any branch;
* transition rates are effectively invariant to movement;
* a scalar outcome score is required to produce a result; or
* the experiment needs more continuations, changed candidates or a moved gate
  after observing the result.

Passing O4a would show that generic off-ball movement causally changes the next
football transition. It would still not identify a live cheap predictor, team
preference, task allocator or final good-football policy.

## 7. Frozen result

The 128-state run at seed offset 23000 passed:

```text
clone failures / deterministic differences        0 / 0
target / unexplained-action / non-finite failures 0 / 0 / 0
forced passes per branch                           95–96
oracle force failures                              0
intended-reception range                           8.3pp
```

Two complete reruns produced the identical output hash
`a0bfb58f2b7c9f5e111a613bcc21e7103a51b591ab3d1910d2c6f4d617eac645`.

| movement branch | forced | intended | teammate | opponent | loose | dead | censored | mean progression |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| hold | 96 | 44 (45.8%) | 5 | 45 | 0 | 1 | 1 | -6.858m |
| legacy | 95 | 45 (47.4%) | 1 | 47 | 0 | 1 | 1 | -0.571m |
| forward | 95 | 48 (50.5%) | 3 | 40 | 0 | 3 | 1 | -2.775m |
| lateral | 96 | 52 (54.2%) | 3 | 39 | 0 | 1 | 1 | -6.872m |
| backward | 96 | 48 (50.0%) | 6 | 41 | 0 | 0 | 1 | -10.676m |

Before the forced pass, 27 branches per geometry became genuinely owner-free and
five or six reached dead-ball/restart; those stayed pre-pass transitions and did
not enter the pass denominator.

The result proves a causal bridge: changing only the mover's generic fixed target
changes who first establishes stable control after the same ordinary pass. It
does not establish a universally preferred direction. In this support-state
sample lateral movement had the highest intended-reception rate, legacy the most
progressive mean target, and backward movement the deepest safety outlet. A later
selector must represent that tradeoff rather than convert the lateral rate into
a hidden bonus.
