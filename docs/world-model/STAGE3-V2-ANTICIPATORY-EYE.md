# Stage III v2 — The Anticipatory Eye (design contract, commander-owned)

Status: **DESIGN CONTRACT, drafted 2026-07-30 under ruling #66**
(user-ratified launch; the banked memo
[`STAGE3-V2-DIRECTION-MEMO.md`](STAGE3-V2-DIRECTION-MEMO.md) executes —
mechanism not re-litigated, re-sized against the world as it now stands).
Authority: #66 (launch; census world = ENRICHED, both flags armed, the
#60.3 precedent) · #44.4 (the pre-named pile-up lever: anticipatory
density) · #44.2 (the P2 findings this contract exists to answer,
including the substrate law and the density feedback loop) · #41.2/#41.3
(approach semantics: the table prices the value of committing W to an
APPROACH; station = a sustained approach direction) · #65.2 (the
perception wedge is a measured hazard — sized ex ante here, not
discovered at delivery) · #35.3 (fork the READ) · #29.4-genre staging ·
#20 · #24 · #26.5 · #32.1 · #38.1 · #44.5/#65 (sizing before floors —
the law of the land) · #46.2 · #48.4 · #49.3 · Road B (nothing ships).

The v1 contract ([`STAGE3-POSITIONING-EYE.md`](STAGE3-POSITIONING-EYE.md))
remains the parent for everything not amended here: the lattice, W, the
faces, §4's invariants where compatible, §4.5's eleven constraints, the
deployment battery. v2 amends the CONTEXT and the ITERATION LAW.

---

## 1. The measured case (all banked, none re-argued)

1. **The substrate law (#44.2(ii))**: positional value censused one body
   at a time does not compose — deployed together, bodies converge
   (spacing −2.33 m, duplicate runs 55.5→70.4%, rest defence 1.32→0.98,
   offsides +18.7%), and the loop feeds itself: convergence raises
   perceived DENSITY, and crowded cells carried the strongest
   prescriptions.
2. **v1's DENSITY was a lagging indicator**: static bodies within 9 m —
   the pile-up visible only after it formed. The memo's mechanism:
   perceived teammate MOTION toward a region makes the pile-up visible
   while it is still forming, and prices the SECOND arrival's margin.
3. **The machinery is verified**: the percept-honest chooser consumed a
   censused table exactly as designed (42.5% vs 44.4% predicted; M-CTX
   95.6%); the seam, fork harness, mediator battery and lattice are
   assets. What failed was the table's blindness, not the reader.
4. **The perception wedge is real and measured (#65.2)**: a
   percept-honest consumer delivers only where the percept can SEE the
   context (C5-T2: true-context share 0.586% vs perceived 0.141%).
   v2's new feature reads teammate MOTION — which requires having
   SEEN teammates recently. This hazard is sized at V2-P0, before any
   census freezes.
5. **The world is richer**: C6 (honest carry) and C7 (shot wind-up)
   certified; the census arms both (#66.2). The enriched world plays
   faster (30.7 vs 28.8 releases/min) at an unchanged 0.33 s spell.

## 2. The amended context — ANTICIPATORY DENSITY (the one new feature)

For a candidate approach region R (a lattice candidate's ball-local
neighbourhood, radius frozen at pre-registration from P0 anchors):

```text
OTHERS-GOING(R) = count of own outfield teammates (not self, not GK)
                  whose PERCEIVED motion points into R within W
  motion source  = the body's OWN snapshot; velocity = the snapshot's
                   remembered velocity if carried, else the difference
                   of the two most recent remembered positions
                   (anticipation as perception work, #44.4 verbatim);
                   a teammate with fewer than two remembered fixes
                   contributes NOTHING (no truth, no prior — Q7/#8(l))
  "points into R within W" = the perceived position advanced along the
                   perceived velocity for W lands within R's radius
                   (pure geometry; no intent reading, no plan sharing —
                   intent privacy stands, v1 §4 Q6)
```

* **PRIMARY axis: BINARY** — `nobody-going (0)` vs `someone-going (≥1)`.
  The richer count is REPORTED, never a primary axis: the memo's claim
  is about the MARGINAL (second) arrival, and a binary preserves census
  power (the P1R 216-cell lesson; a 3-level axis would treble the cells
  and #24 would eat the tails).
* The census records the feature from **TRUE world state** (velocities
  known) AND from the **forced body's percept** at each moment — both
  columns, so the perception wedge on THIS feature is measured inside
  the census itself, not discovered at the consumer stage (the #65
  lesson made structural). The table is keyed on the TRUE column; the
  consumer pays the exchange, exactly as v1's P2 did with M-CTX — but
  this time the wedge's size is known BEFORE the consumer is designed.
* Context becomes `FACE × THREAT × DENSITY × OTHERS-GOING(candidate)`
  with the v1 axes unchanged. Per-candidate, not global: each of the 18
  candidates carries its own OTHERS-GOING bit at each moment — the
  feature conditions the CELL a candidate's price lives in.

**The two harness repairs, fixed at contract time (#44.2(v))**:

1. **In-flight FACE**: the perceived face retains the LAST-PERCEIVED
   owner while the ball is in flight (28.7% of v1's decisions had no
   owner and abstained); an explicit `inflight` marker is carried in
   the ledger so the retention is auditable.
2. **Percept warm-up**: census and consumer forks warm the percept
   before the first decision (20.5% of v1's first windows had no
   snapshot); the warm-up length is frozen at pre-registration from the
   E-series scan cadence.

## 3. Design invariants (frozen)

```text
I1  NO HAND-CODED SHAPE TERM. No spacing penalty, no repulsion, no
    "don't crowd" rule anywhere. The composition price must be a
    MEASURED number in a census cell, or it does not exist. (The
    emergence doctrine at the exact spot it exists for.)
I2  PERCEPT-HONEST at consumption: the eye reads its own snapshot for
    every feature including OTHERS-GOING; abstention classes named;
    no truth fallback, no prior invention.
I3  THE CENSUS STAYS UNILATERAL fork-and-force: OTHERS-GOING is a
    CONDITION recorded at natural rates, never a treatment. Control
    reproduction bit-identical; clone coverage 100%.
I4  THE R3 STABILITY ITERATION IS A GATE, run ONCE (the memo's law):
    after the consumer passes its fork test, the census re-runs at R3
    saturation; the table's stability under its own deployment gates
    any further claim. One iteration, not a fixed-point chase; a table
    invalidated by the world it creates is a measured FAIL.
I5  THE DEPLOYMENT BATTERY VERBATIM AND HARD (canaries + DEGEN limbs,
    the C6/C7 T2 form with the P2-B bands): it caught v1 and it stays.
I6  CENSUS WORLD = ENRICHED (c6Carry + c7Windup armed in every arm,
    #66.2); every run states its HEAD and its armed flags (#26.5).
I7  SIZING BEFORE FLOORS, ALWAYS (#44.5/#65): every DEV/population
    floor derives from a disclosed read-only smoke on the attainable
    (and for consumer stages, the PERCEIVED-attainable) population;
    smoke seeds disjoint from census seeds (#46.2).
I8  No new gene, no new attribute, no new percept channel: the feature
    is computed from what the snapshot already carries.
I9  The v1 assets are REUSED, not rebuilt: the 18-candidate lattice,
    W = 3.0 s with its derivation, the two-face axis and horizons, the
    stationEye seam pattern, the mediator battery, receipts and
    event-keyed classes (E-INJURY included).
I10 Approach semantics only (#41.2): every price is the value of
    committing W to an approach; occupancy stays a mediator.
```

## 4. Stages (IDs V2-P0…V2-P4; each pre-registers individually;
executor drafts, commander reviews, per the standing pattern)

* **V2-P0 — THE WEDGE AND THE BASE-RATE MAP** (read-only, zero
  `src/**`, the #65-mandated stage): on the enriched world, measure
  (i) the TRUE base rates of OTHERS-GOING per candidate per context
  (how often is somebody already going where? — the census's
  conditioning population, #24's input); (ii) the PERCEIVED-vs-TRUE
  agreement of the feature (the wedge on motion specifically, with the
  retention-rule sensitivity: how much of the wedge is "never saw the
  teammate" vs "saw him too long ago"); (iii) the in-flight share and
  the warm-up cost (validating the §2 repairs' parameters); (iv) drift
  of the v1 P0 anchors on the enriched world (dwell, spacing, duplicate
  runs — the baselines the battery will bind against). Floors for
  V2-P1 derive from (i); the consumer's DEV expectations derive from
  (ii). If (ii) shows the wedge kills delivery (the C5-T2 shape), the
  fork returns to the commander BEFORE the census is drafted — with
  the memo's fallback (censusing at R3 from the start) as the named
  alternative on the table.
* **V2-P1 — THE ANTICIPATORY CENSUS**: P1R's instrument (fork-and-force
  approaches on the reachability-scoped lattice, paired same-seed,
  approach semantics) with the context amended per §2. The pre-named
  central hypothesis, unchanged from the memo: **the marginal value of
  approaching a region somebody is already going to is sharply
  negative, and the census can SEE it** — the composition price as a
  number in a cell. Full #38.1 sign space: including the null (the
  feature does not separate prices — composition is not visible at
  this grain, a real finding that re-poses the memo's mechanism).
* **V2-P2 — THE CONSUMER, OUT OF SAMPLE**: the v1 P2 harness reused
  (five arms incl. ORACLE-CTX and INVERTED PC; paired forks; disjoint
  block; ex-ante shrinkage prediction; DEV on the PERCEIVED-attainable
  population per V2-P0(ii) — the #65 lesson in gate form). The
  hypothesis: a chooser that sees OTHERS-GOING stops converging —
  measured first at fork grain.
* **V2-P3 — DEPLOYMENT + THE R3 ITERATION (I4)**: the adoption ladder
  and battery verbatim; then the ONE re-census at R3 saturation; the
  stability comparison (R3-censused table vs unilateral table, cell by
  cell, pre-registered equivalence intervals per PROBE-CONTRACTS' sixth
  type) gates any claim that the eye is deployable.
* **V2-P4 — the user's eyes.** Nothing ships before it (Road B).

## 5. Gate sources

#20 · #24 · #26.5 · #29.5/#44.5/#65 (sizing before floors; no
disclosed-dead gate runs) · #32.1 · #38.1 · #46.2 · #48.4 · #49.3 ·
PROBE-CONTRACTS (all six threshold types; the sixth for every stability
claim in V2-P3) · the v1 contract's §4.5 where not amended here.

## 6. Stop rules

Any X-family/fidelity gate fails ⇒ FAIL, stop at the commander. Any
battery limb fires at V2-P3 ⇒ stop outright, whatever the payoff says
(§6(h) of v1, verbatim). V2-P0's wedge reading can stop the stage
before the census exists — that is its job. No re-cutting after sight:
not the feature definition, not the binary primary, not the region
radius, not the floors, not the readings. The R3 iteration runs ONCE
(I4); neither outcome triggers another. Nothing ships (Road B): every
flag dormant, fingerprint unchanged, through the whole stage.

## 7. Registered non-claims

v2 makes no claim that the eye will deploy — V2-P3's stability gate may
honestly kill it, and a table invalidated by its own deployment is a
finding worth the budget. No coach layer, no marking assignments, no
box-arrival anticipation in v1 scope (the v1 contract's exclusions
stand). The C4 arrival linkage (C-BOX went POSITIVE under v1's eye) is
noted as upside, never gated on. And the estimand boundary: the table
prices approaches under #41.2's meaning — nothing here prices
"standing", "formations", or "roles"; if organised shape appears, it
EMERGED from priced approaches under honest eyes, which is the entire
point of the programme.

---

## 8. Contract amendment v2.1 — THE ABORTABLE APPROACH (commander,
2026-07-30, ruling #73; supersedes nothing, extends §2)

The V2-P2 verdict ((b)+(h), ruling #72) and the user's reality-check
(#73.1) locate the substrate defect: the committed window was BLIND —
the only break rule was a possession flip, so a body seeing a duplicate
form mid-approach was forbidden to yield. Real football's first-order
anti-pile-up mechanism is continuous mutual visibility + cheap aborts;
duplicated starts are common and die in their first steps.

**D3-DUPLICATE (the new break rule, the eye's arms only):** at the
body's own decision cadence during a committed window, re-read the OWN
percept; if the committed target region's OTHERS-GOING bit (§2's frozen
feature, unchanged) reads 1 from a teammate other than at commit time,
the override lapses and the incumbent resumes. Wasted ticks are the
honest price. No truth, no communication, no refund. The mirror problem
(mutual yield) is a deployment-grain question, pre-named for V2-P3.

Stage V2-P2R re-runs the consumer with D3-DUPLICATE per ruling #73.2's
six constraints; the pre-named hypothesis: the #72 convergence inversion
REVERSES (duprun falls on negative cells, spacing stops closing) while
the payoff does not degrade. Primary = the convergence signature.
