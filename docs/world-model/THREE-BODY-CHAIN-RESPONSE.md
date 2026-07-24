# D-TRI-0 — Three-body chain-conflict response

Status: **DRAFT — authorised by S3-G2 §9 as its single continuation; drafted
by the commander 2026-07-24; the executor flips this to PRE-REGISTERED on
handover.**

Date: 2026-07-24

## 1. The shape, and why a chain rather than a cluster

D-MUT-0 banked the two-body mutual temporal process. S3-G2 banked its
missing prerequisite for three bodies: one gaze can keep qualified evidence
alive on two moving partners (74.2% dual support, ceiling 86%, priced at
three-quarters for consumers).

D-TRI-0 extends the banked machinery to the minimal THREE-body temporal
structure: a **chain conflict**.

```text
targets:  |tA - tB| < PLAYER_MIN_DIST
          |tB - tC| < PLAYER_MIN_DIST
          |tA - tC| >= PLAYER_MIN_DIST
attention: A observes B   (single-target, banked S3-G1)
           C observes B   (single-target, banked S3-G1)
           B observes A and C (alternating, banked S3-G2)
```

A chain, not a three-way cluster, because the cluster would demand dual
attention from ALL three players and thereby confound two questions
(attention scarcity vs multi-party negotiation). The chain isolates the new
capability at its minimal seat: only the middle body pays the measured
attention cost, and only the middle body must reconcile TWO partners'
supported hypotheses at once. Propagation — one player's response changing
what another player must do — is the causal primitive of rotation; this is
its smallest honest instance.

> Can a three-body chain conflict resolve into pairwise-clear embodied
> targets through observation alone — no commander, no communication, no
> cross-player response loops — when the middle body's evidence about each
> partner arrives at half rate?

## 2. Authority

All banked modules consumed unchanged — zero `src/**` changes of any kind
(probe-level composition, as D-MUT-0 and S3-G2 both proved sufficient):

* consumers: the UNCHANGED D-PROC-1G motion-gated consumer per player. B's
  admissibility composes the UNION of its two partners' supported hypothesis
  sets (a replacement must clear both); A and C each compose against B only.
  Union composition is probe-level set arithmetic, not a module change;
* gaze: A→B and C→B via `chooseAttentionGaze` exactly as D-MUT-0; B runs
  S3-G2's probe-owned strict alternation (switch every 8 ticks, one-tick
  latency, previous-gaze threading, frozen acceptance snapshots);
* purity: S3-G1 audits (validity, normalisation, recompute-from-logged-
  snapshots) for ALL THREE observers, B's recompute covering the alternation
  schedule deterministically;
* coach doctrine, familiarity, relevance selection: frozen neutral / absent.
  No communication channel of any kind.

## 3. Frozen protocol

```text
seeds        92,000..94,047 (sampling budget 2048 per the codified
             budget-is-not-a-gate rule; one state per seed; fresh)
awareness    0.8
window       48 ticks
arms         N — all consumers disabled (chain materiality)
             M — all consumers enabled (the target)
             N and M byte-identical until M's first reopening
```

Acceptance (current geometry and memories only):

* stable non-GK carrier, ≥6s from an administrative boundary, sampled once
  per simulated second after 10s of live play;
* A, B, C distinct non-GK teammates of the carrier; separations A–B and B–C
  each in `(5, 30]`; A observes B, C observes B, and B observes BOTH A and C
  in its own snapshot at the freeze; all three observe the carrier;
* each exposes ≥5 finite perceived-onside O0 candidates;
* auditor-frozen committed intents forming the chain geometry of §1;
* alternatives: A and C each retain ≥3 frozen candidates farther than
  `PLAYER_MIN_DIST` from `tB`; B retains ≥3 farther than `PLAYER_MIN_DIST`
  from BOTH `tA` and `tC`;
* carrier pinned `HoldPosition`; A, B, C pinned `MoveToPoint` on their
  intents with infinite timers; all other players live.

## 4. Frozen gates

### Exact validity

D-MUT-0's list verbatim, extended to three observers: accepted `= 96`;
scanned `<= 2048`; schema/privacy/RNG/body-write/production-change/
non-finite/duplicate-revision violations `= 0`; N/M pre-reopening physical
and evidence equality `= 96/96`; gaze purity `0/0/0` × three observers; two
full runs byte-identical, shared SHA-256; production fingerprint unchanged.

### Completion

```text
jointly completed N+M windows            >= 42 / 96
```

(Derivation: D-MUT-0 completed 65/96 with three pinned bodies and passed a
48 gate; a fourth pinned runner and a third observer-support requirement
price the gate at 48 × 7/8 ≈ 42. A miss is a completion FAIL, not a licence
to re-window.)

### Chain materiality (N arm, on completed states)

```text
both pair distances (A–B and B–C) final < initial   >= 70%
```

### Support transfer (M arm, on completed states)

```text
B holds qualified support on BOTH partners
at least once in-window                              >= 55%
```

(S3-G2's measured 74.2% × the pre-registered three-quarters pricing. A miss
here with healthy A/C support means S3-G2 does not transfer into a live
consumer context — a finding about the attention layer, not the negotiation
layer; the write-up must say so.)

### Primary mechanism (M arm, on completed states)

```text
partial resolution (>=1 of 2 conflicts cleared)      >= 65%
full-chain resolution (both pairs separated
>= PLAYER_MIN_DIST in truth at window end, >=1
consumer-committed replacement involved)             >= 45%
replacement progress >= 0.25m                        >= 75% of revisions
combined revisions per state                         <= 6 in 100%
per-player anti-oscillation family                   all zeros, max 3 each
unsupported/no-alternative retention                 = 100% honest
```

(Derivation: each conflict has one full-attention reader — A for A–B, C for
B–C — so per-conflict resolution inherits D-MUT-0's banked 76.9%;
independent joint ≈ 59%, priced by S3-G2 limit 2 to 45%. Partial at 65% =
D-MUT's 76.9% lightly discounted. Combined-revision cap scales D-MUT's 4 by
players 2→3.)

Reported, not gated: resolver pattern (B-only / A&C / mixed — the first
place role asymmetry could EMERGE), cascade events (a committed replacement
landing within `PLAYER_MIN_DIST` of a partner's CURRENT target), revisions
fired against an already-yielded partner (stale-belief diagnostics), final
three-target geometry spread.

## 5. Stop and authority

FAIL parks the three-body family and must name WHICH axis failed:
completion (windows), materiality (acceptance geometry), support transfer
(S3-G2 does not survive contact with a live consumer), resolution
(propagation is the missing process), or oscillation/cascade (cross-player
loops appear at three bodies). No predicate, window, cadence, alternation
period, seed or tie-break may be adjusted. The fork returns to the user;
the standing suspects are the A4 prior layers (doctrine/familiarity as
latency and interpretation aids) — a resolution-axis FAIL would make them
the direct next hypothesis.

PASS banks propagation: three bodies, one of them attention-constrained,
converging to a pairwise-clear configuration through honest observation
alone. It authorises at most ONE user fork: the A4 design contract (coach
doctrine + familiarity as separate dormant priors over exactly this
machinery), or banking the brick and pivoting to the Embodied Decision
Slice design. It does not authorise four bodies, live wiring, relevance
selection, communication, payoff, genes or evolution.
