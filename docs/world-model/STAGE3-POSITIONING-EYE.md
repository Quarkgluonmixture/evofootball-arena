# Stage III — The Positioning Eye (design contract, commander-owned)

Status: **DRAFTED 2026-07-27 under rulings #22.6 / #26.3(iv)**, on the read
code truth in §1, the prior-art survey
([`../cross-ai-audits/2026-07-26-stage3-priorart/codex-report.md`](../cross-ai-audits/2026-07-26-stage3-priorart/codex-report.md),
digested), the two archived reverts at this seat, and the E5 chain's
methodology precedents. Stage contracts pre-register individually
(autonomous session, EDS pattern). This document fixes scope, order,
invariants and the gate; it is not itself a frozen experiment.
**The implementation slot is NOT claimed here** — per #26.3(iv) it is
decided now that this contract and C5's both exist, and it is the
user's/commander's call at that fork (§8).

Authority: VISION §1 in full (the soul; "让球员自己长眼睛"; the four
external inputs + self + dynamics; 内心/外显/推断; two-level eyes; the
2026-07-27 anchor: **attack and defence shapes BOTH emergent, their
difference itself an acceptance criterion**) · §2 (watchability, 乱抢 =
the user's #1 hate) · PROBE-CONTRACTS (all semantics blocks) · ruling #26
(road B) · E4 round-2 observation ② (scramble residual = a POSITIONING
problem, registered to this slice).

## 1. The measured case (code truth, read 2026-07-27)

* **The live default is a hand-tuned interim, not an eye.**
  `emergentStation` (`formations.ts:238-348`) replaced the fixed tables
  (VISION's #1 violation) with role depth/lane fractions + gene-scaled
  affine modifiers (ball-x slide, `formationDepth`, `pressIntensity`
  step-up, `MODE_SHIFT`, rest-defence clamp, width multiplier, ball-side
  translate, opponent-line convergence `×0.14`, pairwise repulsion inside
  9 m with a threat-gated spread `2.6·(1−0.7·threat)`, box-relief and
  goal-ward collapse constants). Every constant is ours; **no term is a
  measured value of standing anywhere** — it is a better-shaped menu, and
  it is the incumbent any eye must beat.
* **It is omniscient.** The station reads true ball position, all true
  opponent positions (`288-297`) and all true teammate positions
  (`314-324`). The perception trunk the EDS built (pull semantics, FOV,
  retention, keyed noise) is not consulted anywhere in positioning.
* **Value has no seat.** Nothing in the station prices "what standing
  HERE is worth": no goal-relative meaning beyond the role anchor, no
  receivability, no between-the-lines/behind-the-line reading of the
  opponent shape (the `adv[1]−3` line-hold is the whole opponent model).
  The user's list — 内切、包抄、回撤接应、超载、强弱侧 — cannot emerge
  because the substrate contains no quantity that would make them pay.
* **Support cannot drop.** `supportSpot` (`formations.ts:546-561`) places
  every supporter AHEAD of the ball (`aheadBias` 0.35–0.75, ball-x plus a
  positive attack-direction radius); drop-to-receive is geometrically
  unreachable — the C5 map's "no whether seat" finding, in space instead
  of time.
* **The two archived reverts bound the design** (ROADMAP 1246-1306): a
  generic openness field EMPTIES the box (the box is a low-openness
  contested zone — an "open space" scorer avoids exactly the places
  worth being); the two-eye field spiked **offsides +50%** (bodies moved
  on value with no delivery coordination). Both are canaries below, and
  both say the same thing: an eye that scores SPACE instead of measured
  OUTCOMES re-fails the same way.
* **The scramble is this slice's residual by measurement**: E4 round 2
  filed "everyone converging on the ball" as improved-but-unsolved under
  the triple, and the registered fix is this slice, not the chooser.
* **The house has already measured what looking is worth here**:
  corridor read 39.72pp vs distance memory 6.64pp (E2b-0), look-pressure
  6.59% of live pass moments (E3R), and the E5f class decomposition —
  perception is real, priced, and cheap enough to run live (1.20×).

## 2. What already exists (assets this design must reuse, not rebuild)

1. **The perception trunk** — per-player pulled snapshots (ruling #13.3:
   PULL semantics, lazily materialised at consumption moments), awareness
   attr, FOV/retention/keyed error frozen by E2b-1R's honesty rules, and
   the three-class ladder READ / SEEN-UNREAD / UNSEEN with its measured
   pricing precedent (#8(l), #9.3).
2. **The fork-and-force harness** — E2a-2's banked capability with named
   future consumers; the intervention grammar (force ONE choice, live
   machinery does everything else, bit-identical reproduction of the
   unforced choice as the harness gate) transfers to stations verbatim.
   ⭐ And unlike every tracking-literature ghosting model, **our forks are
   causally coherent by construction** — defenders and teammates respond
   through the live sim inside the fork, so C-OBSO's "physically
   inconsistent counterfactual" critique does not apply. The remaining
   honest limit is the house population law: the census is measured under
   the incumbent policy of the other eleven bodies.
3. **The census discipline** — attempt-conditioning with every window
   simulated (E5d's lesson: no adjudication gating, no zero-value
   conventions), SHA'd tables as data, C3R floor-vs-tolerance powering,
   #24 attainability checks, #20 CI/cluster verdicts, #18 separated
   staging/definition pins.
4. **The incumbent as control** — `emergentStation` stays the flags-off
   world bit-identically; every probe A/Bs against it; VISION §1's own
   law binds: the eye ships only if it BEATS the incumbent on §2 +
   watchability, "更有原理" alone does not ship.
5. **The prior-art digest** — ten lineages surveyed; what Stage III takes
   is their DECOMPOSITIONS (accessibility ≠ value ≠ off-ball credit), and
   what it rejects is their fitting: every published model either assumes
   omniscience, hand weights, or observed-choice data. The survey's five
   open questions are ruled in §4.

## 3. Scope of the first cut (v1)

IN — one seat, the player's off-ball station:

1. **The station census (instrument first, the house move):** at sampled
   off-ball moments, fork the deterministic world and force ONE player's
   station target to each candidate in a fixed relative lattice; measure
   the SIGNED outcome (score face and concede face within a frozen
   horizon, every fork's window simulated). Tables per face, SHA'd,
   committed as data.
2. **The eye, dormant then flagged:** each player evaluates the SAME
   candidate lattice through his OWN pulled percept, prices candidates
   from the census tables at his perceived context, composes the two
   faces through GENE-mapped weights (§4-Q3), and moves toward his
   best-priced station. Replaces the `emergentStation` output behind a
   flag; the incumbent path stays verbatim.
3. **The support seat's one defect:** the candidate lattice is
   ball-relative and symmetric, so stations BEHIND the ball are reachable
   — drop-to-receive becomes a priceable candidate, not a scripted move.
   (`supportSpot`'s consumer wiring is mapped at P0 before any deeper
   claim on it.)

OUT of v1, explicitly: **the coach eye** (the global-pattern layer —
TeamBrain modes, runner licences, overload/side calls stay legacy
verbatim; VISION's own sequencing: 先装球员这只); **box-arrival
anticipation** (the crash trigger reading delivery evidence is the
C4-Stage III handshake, registered there, designed at P5+); **marking /
duel assignments** (defensive stations move, WHO marks WHOM does not);
**any new gene** (§4-Q6); **any legacy-path behaviour change** (flags-off
bit-identical); offside LAW changes (the line is read, never moved).

## 4. Design invariants — the survey's five questions + the house's three, ruled

* **Q1 — the state is the player's OWN percept, priced by class.** The
  eye consumes the pulled snapshot, never truth. A candidate whose
  context depends on unseen bodies prices at the census MARGINAL for the
  perceived features (the E2b-1 ladder: READ full-featured, within
  retention BANDED, UNSEEN marginal); no truth-fallback by the back door
  (#8(l)). The census itself is fitted on TRUE context (the world's
  honest exchange rates) and consumed through perceived context — the
  same architecture E2b-1R proved live, so the fidelity question is
  already answered in this repo, not reopened.
* **Q2 — the census cell is a TARGET-CHOICE intervention.** Fork at real
  off-ball moments, force the station target for a frozen window W, live
  machinery does movement/decisions/physics both teams; outcome =
  what happened within horizon H from the force, both faces, every
  window simulated (E5d). The harness gate: forcing the incumbent's own
  target reproduces the unforked match bit-identically. W and H are
  pre-registered per stage, and the P1 contract must state ex ante what
  a station can and cannot causally reach at its horizon (a station is
  slower machinery than a pass — H_station > H_pass is expected, its
  value derived from P0's measured decision cadences, not invented).
* **Q3 — the preference seat opens HERE, and only here.** The chooser's
  preference-seat fork stayed closed (#13.2, CE2R) because a measured
  probability needs no taste. A tactical STANCE is not a probability:
  how to trade the score face against the concede face IS style, and
  VISION mandates it evolves. So: **component VALUES are census-measured,
  component WEIGHTS are genes** — the two-engines junction, cashed as
  designed. Guard rails: exactly TWO measured faces in v1 (score,
  concede — one signed axis split, so nothing double-counts); weights
  map from EXISTING tactical genes (§4-Q6); no hand constant anywhere in
  the composition; and the E5d anti-composition law binds WITHIN a face
  (never P̂×V̂ where EV̂ is measurable).
* **Q4 — crowding is a FEATURE, not a rule.** Don't-crowd must emerge
  from a measured fact: local teammate density enters the census feature
  set, so "a third body in an occupied zone adds little" is a TABLE ROW,
  not a repulsion constant. The incumbent's hand repulsion stays only in
  the legacy path. Same treatment for the offside structure: the
  perceived offside line is field geometry the eye reads (VISION input
  ④), stations beyond it price at their measured (poor) face values —
  and revert 2's +50% blast becomes a hard canary, not a hand clamp.
* **Q5 — stability is gated, not assumed.** The survey's sharpest
  warning (a correct field can still oscillate, pile up, duplicate runs,
  abandon rest defence under simultaneous consumption) is the incumbent's
  hand-tuning in disguise. v1's answer: station decisions run at the
  measured station cadence with COMMITMENT (a chosen station persists
  its window unless the percept materially changes — the banked
  short-lived-commitment substrate, AUTHORITY §2, finally consumed), and
  P2/P3 carry pre-registered stability instruments: station-switch rate,
  pairwise-spacing distribution, ball-convergence index, rest-defence
  occupancy, duplicate-run rate — gated against the incumbent's own
  measured bands.
* **Q6 — no new genes in v1.** Weights map from the EXISTING tactical
  genome (attackingWidth, formationDepth, defensiveCompactness,
  pressIntensity, supportDistance, coverBias — the P1 contract freezes
  the mapping ex ante); serialized keys keep meaning, the budget law is
  untouched, evolved populations stay comparable. Dedicated
  preference genes (risk appetite as its own axis) are a named FOLLOW-UP
  with their own budget-law step — after the eye proves the seat.
* **Q7 — intent privacy holds.** The cooperation reading (队友协同 —
  "winger wide and high = a cross is coming") consumes EXTERNAL evidence
  through the percept only: positions, velocities, ball flight,
  observable wind-ups (C7's future output). No teammate's private
  intent, no coach-truth broadcast, no commander (D-ROTATE's grave).
  Familiarity/doctrine as PRIORS on interpretation stay A4's seat,
  explicitly not smuggled in here.
* **Q8 — symmetry by construction.** Every outfielder on BOTH teams runs
  the same eye over his own percept (the S3b/vision-attr law is built
  in, not bolted on). The two faces make the same machinery the
  attacking eye in possession and the defensive eye out of it — and the
  **shape DIFFERENCE between the faces is an acceptance instrument**
  (VISION 2026-07-27 anchor), measured, not asserted.

## 5. Stages (each pre-registers its own contract; IDs P0–P5 — the
T-series is C4/C5's, and this track must not collide)

```text
P0  CONSUMER MAP + INSTRUMENTS (read-only, zero src): the full consumer
    web of station targets (formationSpot / emergentStation /
    supportSpot / runTarget / mark targets — who reads them, when, at
    what cadence, file:line); the measured station-decision cadence
    (the basis for W, H and the commitment window); the stability +
    shape instruments DEFINED (station-switch rate, pairwise spacing,
    ball-convergence index, rest-defence occupancy, duplicate-run rate,
    attack/defence shape delta) and their incumbent BASELINES measured
    and banked. The E5-style "one number, two meanings" sweep runs over
    every instrument before anything gates on it.
P1  THE STATION CENSUS: dormant force-seam (flag-gated, zero live
    callers, flag-off bit-identical), fork-and-force over the candidate
    lattice at sampled off-ball moments; SIGNED two-face outcome, every
    window simulated; feature set frozen ex ante (closed, small: e.g.
    zone × threat band × possession face × local-density band ×
    offside-relative flag — final set is P1's pre-registration under
    C3R floors + #24 attainability); tables SHA'd as data. Harness
    gate: forced-incumbent reproduces the unforked match bit-identically.
P2  THE EYE, dormant A/B: percept-priced candidates, gene-mapped face
    composition, commitment windows; probe A/B vs the incumbent on the
    P0 instruments; offside canary (revert 2) + box-occupancy canary
    (revert 1, using C4 T0's split arrival classes as the instrument);
    determinism twice; flag-off identity pinned.
P3  LIVE AUDIT: the full #20 battery — §2 band, watchability counters
    HARD (both combination counters simultaneously, cluster semantics),
    perf 1.25×/1.50× (consumption-scoped: station-cadence pulls,
    candidate-scoped materialisation — the E2b-1R levers, pre-named),
    multi-seed ecology (CE2R form), co-evo restoration, plus this
    slice's central hypotheses: H-SCRAMBLE (ball-convergence improves
    vs incumbent — the E4 r2 ② residual, directional, powered) and
    H-SHAPE (attack/defence shape delta emerges without a mode table
    writing it). Any fire → commander.
P4  E4 ROUND: the user plays (per-slice gate, #26.1); the preview mode
    list gains the audited arm per the E4-PREP-2 pattern (closed list,
    only audited combinations reachable).
P5+ THE COACH EYE + the C4 handshake (delivery-evidence crash trigger)
    + dedicated preference genes — each its own contract, only after
    P4's verdict.
```

## 6. Gate sources (named now, frozen per stage at pre-registration)

P0's banked incumbent baselines (the stability/shape instruments); the
committed attempt tables for outcome-axis comparability; the E5f/E5g/E5h
banked integers wherever a staging is reused; PROBE-CONTRACTS in full
(#20 CI/cluster + fire budgets · #19/#24 floors powered AND attainable ·
#18 separated pins · #22 pattern-geometry-is-censused — which for this
slice reads: WHERE a station family lands is a census output, never an
assertion); perf budget from `docs/perf/baseline.json`; §2 band verbatim;
the watchability instruments as HARD gates per #20 fork B.

## 7. Stop rules

Any stage FAIL → the queue stops, the fork returns to the commander; no
stage rescues a neighbour by tuning. The offside canary or the
box-occupancy canary firing stops the queue outright (the two reverts'
graves are load-bearing). A DEGENERATE ATTRACTOR (a station family the
eye never leaves, or a collapse of the spacing distribution — the
positional twin of always-heavy) is a hard stop with its own
pre-registered form at P2/P3. Perf misses → report, no honesty shaving,
no budget raise. Population law (#26.5): any live substrate change (C5,
C4, C6) invalidates P1's tables — the SHIPPING table must be censused at
the substrate HEAD it deploys on; an early P1 run on the incumbent world
is design calibration only and must say so on its face.

## 8. Sequencing and the implementation slot (#26.3(iv), now open)

The road-B dependency order stands: **C5 → C4 → re-measure → joint value
only on the residual** (#26.3), with Stage III's contract now in
existence alongside C5's. The commander's recommendation for the slot,
subject to the user's ratification:

* **P0 is gap work** — read-only, zero src, executor-runnable in a C5/C4
  queue gap exactly like C4 T0 (it competes only for session time, not
  for the one-experiment-in-flight slot).
* **P1–P4 queue BEHIND C4's T3** on the population law: C5 and C4 both
  intend live landings; censusing the station tables before the world
  they deploy into exists would guarantee a re-census. If C5/C4 stall at
  their own gates, the slot question returns here rather than defaulting.
* The eye's design does NOT block on C5/C4 results — this contract is
  complete now precisely so the slot decision is free to move if road-B
  priorities shift.

## 9. What Stage III unlocks on PASS

The first positioning in this game's history that is chosen rather than
drawn: 回撤接应、内切、包抄、超载、强弱侧 as table rows a gene-weighted
eye discovers, not behaviours we wrote; attack and defence shapes that
differ because the faces price differently, with the difference itself
measured; the scramble residual addressed at its registered seat; and
the substrate every later seat stands on — the coach eye's global field,
C4's evidence-based crash timing, A4's doctrine priors, D6's POV view
(render what the eye believes). Registered non-claims: overlap stays
where honest measurement puts it (#25); conversion ceilings inherited
wherever C4's instruments are shared; nothing here ships without beating
the incumbent in the user's own eyes at P4.
