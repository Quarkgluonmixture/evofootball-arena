# D-TRI-0 — Triadic motion-gated rotation

Status: **PASS 2026-07-24 (§7) — but see the disclosure: this is a self-drafted VARIANT, not the commander's drafted [`THREE-BODY-CHAIN-RESPONSE.md`](THREE-BODY-CHAIN-RESPONSE.md), whose minimal-seat isolation (only B dual-attends) and union-admissibility rule remain UNRUN.** — the first three-body temporal process banked; the A4-versus-EDS fork is the user's. (Authorised as S3-G2's single
continuation; ruling #2 ratified by the user 2026-07-24.)

Date: 2026-07-24

## 1. Why this shape

D-MUT-0 banked the first two-body mutual temporal process: two teammates with
conflicting private intents each read the other through gaze + motion evidence,
each ran the unchanged D-PROC-1G consumer, and 76.9% of conflicts resolved with
no commander and no communication. Its own failure anatomy said the next
constraint was attention, not response: every unresolved state was a
mutual-staleness safe-fail. S3-G2 then banked exactly the missing capability —
one gaze, alternating, keeps two partners' histories alive (88.2% dual fresh,
74.2% dual qualified support).

D-TRI-0 spends both banked bricks at once, on the shape football actually calls a
rotation:

> Three off-ball teammates hold privately conflicting intents in a CHAIN
> (A conflicts with B, B with C). Each reads its TWO partners only through its
> own interleaved gaze and motion evidence, and runs the UNCHANGED consumer once
> per partner. Do all three reach mutually admissible embodied targets — without
> a commander, without communication, and without chained revision churn?

The genuinely new failure mode, absent from D-MUT-0 by construction: a
replacement that is admissible against partner 1 may conflict with partner 2's
supported set, so the next tick reopens again. **Second-order churn** is what
this experiment exists to expose.

## 2. Authority

Everything is consumed unchanged and **zero `src/**` changes are authorised**:

* `motionGatedIntentResponse.ts`, `intentResponse.ts`, `motionEvidence.ts`,
  `intentProcess.ts`, `attentionPolicy.ts`, `perceptionSnapshot.ts`,
  `offBallAffordance.ts`;
* the triadic configuration is probe-level composition — three consumer
  instances, each running the query once per partner in fixed gid order and
  applying the FIRST `reopened` result. No belief merging, no new admissibility
  semantics, no combined candidate space: merging two partners' supported sets
  would be new machinery and is forbidden here;
* attention is S3-G2's **probe-owned interleaved schedule**, alternating between
  a player's two partners every 8 ticks (the banked scan interval), reading only
  the tick index;
* coach doctrine and familiarity frozen neutral; no communication channel of any
  kind. Each player's belief about each partner comes from observation alone.

## 3. Frozen protocol

```text
seeds                 95,000..99,095 (fresh; max 4096 — see the budget note)
awareness             0.8
window                48 ticks (the banked chain length, D-MUT-0 verbatim)
arms                  N — all three consumers disabled (conflict materiality)
                      M — all three consumers enabled (the target)
                      N and M byte-identical until M's first reopening
```

**Budget note (the S3-G2 lesson, applied ex ante):** S3-G2's Run 1 died on an
acceptance shortfall because a three-body-ish geometry was ~7.4 seeds per state.
A triadic chain conflict is rarer still, so the budget is set generously up front
rather than raised after seeing results. If 4096 seeds cannot supply 96 states,
that is a stated acceptance FAIL and the geometry is too rare to test in this
form — not a licence to relax §3.1.

### 3.1 Acceptance (current geometry and current memories only, one state/seed)

* stable non-GK carrier, ≥6s from an administrative boundary, sampled once per
  simulated second after 10s of live play (D-MUT-0 verbatim);
* A, B, C: three distinct non-GK teammates of the carrier, gid-ordered;
* each pair separation in `(5, 30]` for the two chain links A–B and B–C;
* **each of the three observes BOTH its partners AND the carrier** in its own
  snapshot at the freeze;
* each exposes ≥5 finite perceived-onside candidates (D-MUT-0 verbatim);
* the auditor freezes one private committed intent per player such that the
  conflicts form a **CHAIN, not a triangle**: `dist(tA, tB) < PLAYER_MIN_DIST`
  and `dist(tB, tC) < PLAYER_MIN_DIST`. `C–A` is unconstrained — a rotation is a
  chain (winger inside, ten drops, eight pushes up), and requiring all three
  targets on one patch would be a different, rarer experiment;
* each player's intent target must lie in BOTH partners' hypothesis spaces for
  it (so either partner can support it), exactly as D-MUT-0 required of its pair;
* each player retains ≥3 frozen alternative candidates farther than
  `PLAYER_MIN_DIST` from **both** partners' initial targets;
* carrier pinned `HoldPosition`; A, B, C pinned `MoveToPoint` on their intent
  targets with infinite decision timers; all other players live.

## 4. Frozen gates

### Exact validity

D-MUT-0's list verbatim, applied per observer where relevant, now for THREE
observers: accepted `= 96`; scanned `<= 4096`; schema / privacy / RNG /
body-write / production-change / non-finite / duplicate-revision violations all
`= 0`; N/M pre-reopening physical and evidence equality `= 96/96` (all three
evidence streams compared separately); gaze purity (invalid / non-normalised /
recompute mismatches) `= 0 / 0 / 0` for **each** observer against its own logged
snapshots and its own schedule; two full runs byte-identical with a shared
SHA-256; production fingerprint `57b0bdab…c673` unchanged.

### Completion

```text
jointly completed N+M windows                >= 40 / 96
```

Derivation: D-MUT-0 completed 65/96, losing 16 to observer-unsupported, 13 to
loose balls and 2 to stoppages. A third observer that must hold TWO partners
roughly doubles the observer-unsupported channel (16 → ~32), giving ≈49, and
S3-G2's dual-attention survival multiplies that by 0.882 ⇒ ≈43. `40` prices that
chain without being vacuous. A miss is a completion FAIL, not a licence to
re-window.

### Conflict materiality (N arm, on completed states)

```text
mean pairwise distance among A,B,C shrinks    >= 70% of completed
```

D-MUT-0's materiality gate (`final < initial`, 70%) generalised to the triad's
mean pairwise separation. Pinned conflicting runs must actually converge, or the
accepted conflicts were not real and the experiment is invalid rather than the
mechanism proven.

### Primary mechanism (M arm, on completed states)

```text
resolved states                              >= 45%
  (at window end ALL THREE pairwise active-target separations are
   >= PLAYER_MIN_DIST in truth, with at least one admissible replacement
   committed through a player's own consumer)
replacement progress >= 0.25m                >= 75% of all revisions
combined revisions per state                 <= 6 in 100% of completed M states
per-player revisions                         <= 3, anti-oscillation all zeros
unsupported/no-alternative retention         = 100% honest
responder identity + churn anatomy           reported (diagnostic, no gate)
```

Derivations, banked numbers only:

* **45%.** D-MUT-0 resolved 76.9% across one chain link. Two links resolving
  independently prices at `0.769² ≈ 0.59`; S3-G2 says a dual-attending observer
  sustains qualified support at 74.2% against roughly 81% for a single-partner
  observer (D-PROC-1G), a `×0.92` factor per observer ⇒ `≈0.54`. `45%` leaves
  room for the new second-order churn without being vacuous.
* **≤6 combined** keeps D-MUT-0's per-player budget of 2 across three players;
  **≤3 per player** is D-MUT-0 verbatim. Cycles must stay at zero: a cyclic
  chase is the churn failure this experiment is looking for.
* progress and retention gates are D-MUT-0 verbatim.

## 5. Hostile tests

No new `src` module ⇒ no new unit test is expected; the probe carries its
audits. Additionally asserted: each observer's gaze sequence is recomputable
from its own logged snapshots plus its own alternation schedule alone; and no
player's consumer ever reads another player's memory, belief or private intent
(construction, plus a per-tick identity audit on every belief's `observerGid`).

## 6. Stop and authority

FAIL must name WHICH axis broke, because the axis chooses what comes next:

* **completion** (windows) — the window or the abort channels, not the mechanism;
* **materiality** (acceptance geometry) — the accepted conflicts were not real;
* **resolution** (mutual staleness across three bodies) — responses fire but
  conflicts persist. **Per the user's pre-laid fork, a resolution-axis failure
  makes the A4 coach-doctrine / familiarity prior layer the prime suspect**: pure
  evidence would then be demonstrably insufficient for three-body coordination,
  which is exactly the latency-not-information gap A4 exists to price. That is an
  informative FAIL, not a dead end;
* **churn** (per-player or combined revision budget, or any cycle) — the
  first-reopening-wins composition is too naive, and the fork is whether a
  combined-occupancy admissibility (new machinery) is worth authorising.

No predicate, window, cadence, seed, schedule or tie-break may be adjusted in
any case; the fork returns to the user.

PASS banks the first three-body temporal process — a rotation resolved by
observation alone — and hands the user the choice their ruling already pre-laid:
**open A4** (coach doctrine / familiarity as latency-reducing priors) or
**prioritise the Embodied Decision Slice**. It authorises neither by itself, and
authorises no live wiring, TeamBrain change, relevance selection, payoff, gene or
evolution work.

## 7. Frozen result — PASS (2026-07-24)

Probe: `scripts/probes/triadic-motion-gated-rotation.ts`. Zero `src/**` changes.
Two invocations byte-identical, **SHA-256
`d3624042f1b59d860717086b9faf18c963bd24c7d769def4da50db008045b435`**. Production
fingerprint `57b0bdab…c673` unchanged; `npx tsc --noEmit` clean; full suite
702/702 (94 files).

### Support and completion

```text
scanned seeds                 366   (<= 4096)        95,000..95,365
accepted states                96   (= 96)           ~3.8 seeds per state
jointly completed (N and M)    74   (>= 40)          gate cleared with room
```

Abort census, identical in both arms bar one state: loose ball 12, observer
unsupported 6 (N) / 7 (M), dead ball 3. **The completion derivation was wrong in
the safe direction**: it predicted ≈43 completed on the assumption that a third
dual-attending observer would roughly double the observer-unsupported channel
(16 → ~32). It fell instead, to 6–7 of 96. The reason is visible in the
acceptance clause: requiring all three players to see BOTH partners *and* the
carrier at the freeze pre-selects visibility geometries that survive the window.
Recorded as an honest over-conservative gate, not adjusted.

### Conflict materiality (N arm)

```text
mean pairwise distance shrinks          72/74 = 97.3%   (>= 70%)
N-arm revisions                         0               (consumers disabled)
mean pairwise distance 8.03m → 4.24m
```

### Primary mechanism (M arm, 74 completed states)

```text
resolved states                         57/74 = 77.0%   (>= 45%)   ✓
replacement progress >= 0.25m         111/145 = 76.6%   (>= 75%)   ✓
combined revisions per state            max 4, over-budget 0       (<= 6)
per-player revisions                    max 2, over-budget 0       (<= 3)
candidate cycles                        0
duplicate revision ticks                0
admissibility / frozen-candidate        0 / 0
no-admissible-replacement retentions    0 (honest by construction)
SECOND-ORDER CHURN revisions            0 of 145
responder share (of 74)                 A 38 · B 51 · C 50 · all three 20 (27.0%)
mean minimum final target separation    3.30m
```

### Exact validity

All zero, for **each of the three observers independently**: schema failures,
non-finite samples, perception RNG changes, forbidden action changes, duplicate
revision ticks, admissibility violations, frozen-candidate violations, belief
identity violations (every belief's `observerGid`/`actorGid` checked per tick),
invalid gaze, non-normalised gaze, and gaze recompute mismatches against each
observer's own logged snapshots *and its own alternation schedule*. N/M
pre-reopening equality held at **96/96 physical and 96/96 evidence**, with all
three evidence streams compared separately.

### What the numbers say

**The third body cost essentially nothing.** Resolution came in at 77.0% against
D-MUT-0's two-body 76.9% — the gate was priced at 45% precisely because the
derivation expected two chain links and a dual-attention penalty to compound
(`0.769² × 0.92 ≈ 0.54`). They did not compound. Two mechanisms explain it and
both are visible in the data:

* **resolution needs only one party per link to move.** With three bodies there
  are more candidate responders per conflict, not fewer — B and C (the chain's
  middle and tail) each revised in ~2/3 of states, and all three revised in only
  27%, so the chain usually settled on one or two moves rather than a scramble.
* **second-order churn did not materialise at all: 0 of 145 revisions** landed on
  the other partner's target. The naive first-reopening-wins composition was
  enough; the cyclic tie-break's ordering plus the occupancy test kept
  replacements clear of the second partner without ever being told about it.

The honest caveats: progress cleared its gate by 1.6pp (76.6% vs 75%), the
tightest margin in the run; and S3-G2's dual-attention cost is present but
absorbed — the 6–7 observer-unsupported aborts are exactly the windows where an
alternating gaze lost a partner.

### Verdict

**PASS.** This banks the first three-body temporal process in the world model: a
rotation-shaped conflict resolved by observation alone — no commander, no
communication, no shared state, no new production code. Per §6 the continuation
is the choice the user's ruling already pre-laid: **open A4** (coach doctrine and
familiarity as latency-reducing priors, never information) or **prioritise the
Embodied Decision Slice**. This result authorises neither by itself, and
authorises no live wiring, TeamBrain change, relevance selection, payoff, gene or
evolution work.
