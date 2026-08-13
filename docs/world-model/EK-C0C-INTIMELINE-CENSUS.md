# EK-C0c — THE IN-TIMELINE DRILL CENSUS + THE RE-SCORE (在学习者自己的场地里重新量一次)

Status: **FROZEN, then RUN.** Everything from §FORM to §NON-CLAIMS — the world, the two arms, the
counting rules, the claim H-EK′ and its predicate, the **full ex-ante N rule** with its zero-event
clause, the two label readings and which one is of record, the seed ledger and the 18-row gate list
— is the design fixed **in the probe's own frozen constants and gate predicates before any census
seed was walked**, and every clause below is machine-checkable against the committed artifact rather
than a promise about it. The measured numbers live in [§RESULT](#result), **GENERATED
PROGRAMMATICALLY** from the artifact by a committed generator
(`scripts/analysis/ek-c0c-census-result.ts`), never typed (#229.2).

⚠ **This document reports; it does not adjudicate (#203).** The re-score's two limbs, the
ordered-book share and the MATCH/MISMATCH route are mechanical predicate readings printed exactly as
the artifact records them, with ruling #263.3's consequents **verbatim**. What the route *means* is
the commander's — and both routes are pre-named there.

Authority chain: ⭐⭐ **ruling #263.3** (the disposition of the EK-T1 adjudication: *"measure
P(punished | held, band) on FRESH seeds in the SAME in-timeline drill world the books live in …
that table = the CORRECTED yardstick; then RE-SCORE the COMMITTED EK-T1 books … as a NEW claim
H-EK′"*), above which the **EK-HOLD EARNED-BELIEF CONTRACT**
[`EK-HOLD-EARNED-BELIEF-CONTRACT.md`](EK-HOLD-EARNED-BELIEF-CONTRACT.md) §2 (M-EK.1, the observable
label) and §3 govern. Rulings **#263.1/.2** (the NEGATIVE of record and its corrections — the
vacuity-at-grain lesson and the 626-vs-632 reading lead) · **#261.3** (the four picks: W = 10 s ·
the dosed-drill training-ground venue · the zero-constant veto) · **#260.2 / #262.2** (every
override through the preflight; whitelist-or-refuse with the engine doors inside the scan; output
paths are overrides) · **#256.2** (commensurability: the yardstick and the learner must sample the
same population — the rule this stage applies one level up) · **#246** (shape is the fidelity
check) · **#247 / #248.1** (truth instrument-side; ANSWERS earned) · **#203** · **#229.2** ·
**#250.3** (mode-conditioned literals; headline counts hand-checked) · **#251.3 / #252.3** (derive
your own identity predicates; a mutant per conjunct, RE-INVOKING; coverage sets named) · **#256.3**
(per-cluster cells stored) · **#258.3** (timings OUTSIDE the hashed body) · **#163** · **#181.2** ·
**#20**.

The banked work this stage reuses **verbatim** and does **not** touch:
[`EK-T1-HOLD-CONVERGENCE-EXAM.md`](EK-T1-HOLD-CONVERGENCE-EXAM.md) — ⭐⭐ **THE WORLD AND THE BOOKS**
(its drill world, its census flags, its 240 s, its injected certified table, EK-T0's drill driver at
the census cadence, and the **committed per-book cells** this stage re-scores) ·
[`EK-T0-HOLD-BELIEF-SEAM.md`](EK-T0-HOLD-BELIEF-SEAM.md) — ⭐ **THE COUNTING RULES** (the band
index, the freshness refusal, the label ledger, the whistle) ·
[`EK-C0-HOLD-OUTCOME-CENSUS.md`](EK-C0-HOLD-OUTCOME-CENSUS.md) — **THE CENSUS FORM** (its N rule,
its accounting, its event-rate moments, its yardstick schema) and the **clone-dosed** table this
stage publishes beside its own · [`EK-C0B-INVERSION-DIAGNOSTIC.md`](EK-C0B-INVERSION-DIAGNOSTIC.md)
— the reading that the clone-dosed inversion is genuine world structure.

> ⭐ **INSTRUMENT-ONLY ROUND.** `src/**` is **byte-untouched** (X-SRC-UNTOUCHED is a HARD gate). No
> seam is built, no flag default changes, no gene exists. This stage measures and re-reads banked
> data; it ships nothing.

---

## §FORM

### The world — ⭐⭐ THE IN-TIMELINE DRILL WORLD, the venue the learner lives in

EK-T1's own world, verbatim: `new Match({ seed, teamA, teamB, duration: 240, …EK-C0's committed
CENSUS_FLAGS })` with the certified re-census table (`tableSha 184d1e84…`) **INJECTED** into an
armed `whetherEye`, and **EK-T0's drill driver** dosing holds at the census cadence (`HOLD_K_TICKS +
MOMENT_SPACING` = 60 ticks, two-phase, band lag exactly one tick). Squads are redrawn per fixture
exactly as EK-C0 and EK-T1 draw them (`teamA = team('A', seed·2+1)`, `teamB = team('B', seed·2+2)`).

⭐⭐ **WHAT MAKES THIS A DIFFERENT POPULATION FROM EK-C0's** — the whole point of the stage. EK-C0
dosed every hold on a **fresh clone of an undisturbed timeline**: no dose ever perturbed another,
and nothing accumulated. Here the drills happen **in one running match**: every forced hold perturbs
the seconds after it, consecutive drills share possession chains and share losses. Same quantity,
same semantics, **different population** (#263.2's diagnosis).

### The two arms — and what neither of them is

| arm | flags | role |
|---|---|---|
| **OFF** | `ekHoldLearn` false, `ekHoldVeto` false | ⭐ **THE TIMELINE THE CENSUS DESCRIBES** — the flags-off drill world of #263.3's words. Walked on **every** census seed. |
| ⭐⭐ **OBSERVER** | `ekHoldLearn` ON, `ekHoldVeto` **OFF** | the same world with the seam's own ledger writing into books **nothing ever reads** — the one consumption site needs `ekHoldVeto`, which is shut. **G-BYTE-IDENTICAL** proves on every census seed that its trajectory (rng stream inside) **is** the OFF arm's. |

⭐ **THIS IS WHAT "COUNTING BESIDE THE TIMELINE" MEANS HERE, and it is a declared deviation from
#263.3's letter (§DEV 2)**: the band index is the band **the seat placed inside the brain** and
handed to the ledger; with the learning door shut nothing records it, and an instrument-side re-band
would have to re-implement the brain's decision cadence — and would silently **destroy the freshness
refusal** (an instrument that re-bands every tick never refuses anything). So the timeline is the
flags-off world, gated identical, and the counting is the seam's own.

### ⭐⭐ The counting rules — the SEAM'S, because the target population is WHAT BOOKS COUNT

1. **THE BAND** is the perceived pressure band **the seat placed for that body at its own
   decision** — never a truth-side re-band, never a guess.
2. **THE FRESHNESS REFUSAL STANDS.** A drill hold whose placement is not the immediately preceding
   tick carries **no band** and is **not a member of this population** — exactly as it is not a
   member of any book. Refusals are **counted and published**, split into *stale* and *never
   placed*, never imputed.
3. **THE LABEL** is M-EK.1's: punished ⇔ the **first possession loss by the holding team** is
   stamped within **W = 10 s** (the seam's own constant, #261.3(i)). A label closes at that loss, at
   the window sweep, or at the whistle — the last class **censored**, unpunished by construction.
4. **DRILL HOLDS AND THE SEAT'S OWN TAKES ALIKE** are counted, because the book counts both
   (#263.3). Their split is published beside; the two are never merged into different tables.

### The cluster, and the estimator

**Cluster = the match seed** (#20), each with a **fresh pair of books** — so a cluster is one
match's own experience and clusters are independent by construction. Ratio-of-sums per band,
**cluster bootstrap by seed**, 2,000 resamples, percentile 95 % CI, ⭐ **ONE SHARED resample-index
matrix** so every band rate *and* every band difference is paired by construction. Stats stream base
**109,400** (ruling #263.3's floor). ⭐ **Per-cluster cells are STORED** (per seed × side × band:
holds, punished, the ladder counts, the provenance split, the closing causes, the refusals), so
every number in §RESULT re-derives without a re-run (#256.3).

## §CLAIM — H-EK′, and the predicate it is scored on

> **H-EK′ (a NEW claim, #263.3):** given only their own hold outcomes (the observable label), the
> EK-T1 teams EARNED a hold-risk map over pressure whose SHAPE matches the measured truth **of the
> venue they live in**.

⚠⚠ **THE #263.1 NEGATIVE STANDS AND IS NOT RE-OPENED.** H-EK — the books against the **clone-dosed**
yardstick — scored NEGATIVE, of record. This stage scores a **different claim against a different
yardstick**; it is a separate entry, exactly as #263.1 required (*"no quiet re-score"*).

### The scored predicate — the SAME sharpened conjunction, on the SAME frozen τ

* **LIMB (i) — THE SET ORDERING.** The **replicate-mean belief vector** of the committed books is
  strictly ordered **in the corrected yardstick's own MEASURED ordering** (whatever that turns out
  to be — it is measured in this stage, not chosen), **and BOTH adjacent gaps are RESOLVED at set
  grain**: the cluster bootstrap by replicate (2,000 resamples, percentile 95 % CI, one shared
  resample-index matrix so both gaps are paired) excludes zero on both.
* **LIMB (ii) — THE BOOK SHARE.** The share of **strictly-ordered books** (ordering per the
  corrected yardstick) is **≥ τ = 0.90** — the **SAME frozen τ** EK-T1 scored on. With 2R = 40 books
  that is **≥ 36 of 40**. Ties are **not** ordered, and strictness is machine-checked on synthetic
  ties on **both** pairs of the new ordering.

**Both limbs must hold.** The route is then printed mechanically:

| route | predicate | ruling #263.3's consequent, VERBATIM |
|---|---|---|
| **MATCH** | the conjunction holds | *the book mechanism is VINDICATED … the #248 archetype debt is marked DISCHARGED* |
| **MISMATCH** | it does not | *a real seam defect exists after all — STOP to the user* |

⭐ **THE BOOKS ARE READ, NOT RE-RUN.** The re-score is a **generator-level act on banked data**: the
committed EK-T1 artifact's `result.perClusterCells`, its final checkpoint, its 40 books. **G-RESCORE**
proves those cells re-derive EK-T1's **own published** mean vector and its own ordered-book count
before a single new predicate is applied to them.

## §NRULE — EK-C0's rule form, with this venue's own inputs, and one declared extension

```
N* = min( max( ceil(60 / rarestBandPunishedPerMatch),      [EK-C0 §NRULE, verbatim]
               25,                                          [its floor]
               N_ordering ),                                [⭐ THIS STAGE'S OWN TERM]
          wallTerm, 4000 )                                  [the wall and seed-budget caps]

N_ordering  = the smallest N on the grid {50, 100, …, 4000} at which EVERY pairwise band gap
              measured in the smoke would be RESOLVED at 95 % — |gap| ≥ z·SE(gap, N), with this
              venue's own measured cluster design effect applied to each band's effective count.
wallTerm    = floor( 2400 s · 1000 / (ms per match × 2 arms) ), the ms per match READ from the
              committed smoke artifact's UNHASHED envelope (#258.3).
```

⭐ **WHY THE ORDERING TERM.** The corrected yardstick's **deliverable is an ORDERING** — the
re-score reads its rank vector, not its levels — and 60 events in the rarest band do not buy an
ordering when two band rates sit close together. Requirements combine by **max**, caps by **min**;
the precedent's own precision term and floor are kept and published beside.

⭐ **THE ZERO-EVENT CLAUSE, frozen with the rest of the rule before the smoke ran:** a term that
cannot be estimated — zero punished holds in the rarest band, a band with no holds at all, or a gap
no N on the grid resolves — is **UNBOUNDED**, carried as such into the `max`, so the **wall and
seed-budget caps bind** (the largest run the budget allows). It is **never quietly floored down**.
The artifact records `precisionTermUnbounded` / `orderingTermUnbounded` / `requirementUnbounded`
either way.

**THE FROZEN RESULT: N\* = 4,000 seeds** — the literal in the probe, which **G-N** recomputes from
the committed smoke artifact and fails on any disagreement (mode-conditioned: only the FULL census
must run at N\*).

## §READING — the two label readings, and which one is of record (#263.2(2), resolved)

Ruling #263.2 named a secondary lead: EK-T1's probe-side reading counted **626** punished where the
seam's committed book said **632** on the same 808 holds. This stage must therefore **declare which
reading rule it implements** — and prove it.

* ⭐ **(B) THE SEAM READING — OF RECORD.** `HoldLabelLedger`'s own state machine, replayed
  **tick-exactly** on the public event stream in the ledger's own intra-tick order: takes noted
  during the previous step, then the chain observation, then this tick's drill dose, then the window
  sweep; at the whistle, the seam's own last read, then the flush. **G-LABEL-READING** requires it
  to reproduce the observer arm's **own books CELL FOR CELL** on every cluster — per side, per band,
  holds and punished — with the non-vacuity conjuncts **at that same grain** (the #263.2(1) lesson):
  the count of non-empty cells is published, the number of individual labels checked is published,
  and **both label values must occur in every band**.
* **(A) THE PROBE READING — published as the diagnosis.** EK-T1's deff re-walk rule: for each noted
  hold, the first loss by that team stamped at or after it, punished iff inside W.

⭐ **A DIVERGENCE IS A DEFECT IN THIS INSTRUMENT, NOT IN THE SEAM** (#263.3). The seam's counting is
the target population; the probe reading is published only so the lead is closed with a mechanism
rather than a number.

## §SEEDS — fresh, strictly above everything the programme has consumed (#163)

⚠⚠ **A DECLARED DEVIATION FROM #263.3's LITERAL SEED FLOOR (§DEV 1).** The ruling says *"Seeds from
12,452,000"*, but **12,452,000–12,455,599 is EK-T1's own consumed battery** and 12,455,600–12,460,999
its reserved ceiling. The ruling's own word is **FRESH**, and #163 forbids re-walking consumed
seeds — a census on the very seeds the books were grown on would also not be an independent sample
of the venue. The band therefore opens **above EK-T1's whole reserved ceiling**.

| block | seeds | kind |
|---|---|---|
| core (G-DET + G-ARMS) | 12,461,000 – 12,461,011 | consumed here |
| preflight / guard block | 12,461,050 – 12,461,099 | reserved — where EVERY overridden invocation is routed |
| the SMOKE mode's own battery | 12,461,100 – 12,461,139 | consumed here (smoke artifact) |
| G-WORLD construction seed | 12,461,999 | constructed, **never stepped** |
| ⭐⭐ **the census** | **12,462,000 – 12,465,999** (N\* = 4,000) | consumed here |
| reserved ceiling | 12,466,000 – 12,469,999 | reserved |

Disjointness is computed **in-probe** against the **COMPLETE** consumed ledger (66 prior blocks,
including EK-T1's whole band as one conjunct), and the blocks are proved ordered. This stage adds
**no test file**.

**Stats stream:** base **109,400** (ruling #263.3's floor), minimum gap **200** to every published
base. One bootstrap for the census (cluster = seed) and one for the re-score (cluster = replicate),
2,000 resamples each.

## §GATES — frozen ex ante, ALL computed in-probe (#181.2). **18 HARD rows — count them**

⭐ **#250.3(i)**: the probe freezes this list as `FROZEN_GATE_NAMES`, and the artifact's gate-object
key set **must equal it exactly** or the probe exits 1 before writing anything. The headline count
below **is** this table's row count.

| # | gate | predicate | kind |
|---|---|---|---|
| 1 | **G-DET** | the deterministic core runs twice, canonical-JSON digests identical | HARD |
| 2 | **X-SRC-UNTOUCHED** | `git diff --stat -- src` **and** `git status --porcelain -- src` both empty | HARD |
| 3 | **X-FP-PROD** | the shipped league fingerprint re-derived in this process, unchanged | HARD |
| 4 | **G-WORLD** | the IN-TIMELINE DRILL world of record — EK-T1's census flags, the 240 s duration, the certified table's SHA, the armed seat, every foreign door shut, no gene anywhere — on a never-stepped construction seed **and** on **every** census match | HARD |
| 5 | ⭐⭐ **G-BYTE-IDENTICAL** | the OBSERVER arm's whole-run signature (rng stream state inside) equals the **FLAGS-OFF** drill world's on **every** census seed — the observer moves nothing | HARD |
| 6 | ⭐ **G-ARMS** | the configuration-identity predicate **DERIVED FOR THIS CENSUS** — 8 conjuncts (learn flag · **veto door SHUT** · books wired · drill world · seat armed · foreign doors shut · no gene anywhere · census construction) — with **ONE MUTANT PER CONJUNCT**, each **RE-INVOKING** the predicate | HARD |
| 7 | ⭐⭐ **G-LABEL-READING** | the instrument's counting **IS** the seam's: the seam-reading replay reproduces the observer arm's own books **cell for cell** on every cluster, with non-vacuity **at that grain** (non-empty cells published, labels checked > 0, both label values present in every band); the probe reading's divergence is published beside | HARD |
| 8 | ⭐ **G-FRESHNESS** | the seam's freshness refusal is **LIVE** (refusals > 0) and mirrored: the stale/never-placed split adds up, and the counted population equals takes + drill holds exactly | HARD |
| 9 | **G-ACCOUNTING** | the complement partition closes — every counted hold in exactly one class (loss · window · whistle), every class non-negative, punished ⊆ holds — and the punished count is **monotone in the window** across the ladder | HARD |
| 10 | ⭐ **G-CENSUS-LIVE** | non-vacuity at the TABLE's grain: all three bands carry holds **and** punishment, takes and drills are both seen, and **zero vetoes** are served anywhere | HARD |
| 11 | ⭐⭐ **G-N** | the frozen N\* **IS** the recomputed rule from the **COMMITTED SMOKE** artifact (its counts, its deff, its unhashed ms/match), τ ≥ 0.9, and (**mode-conditioned**, #250.3) the FULL census ran at N\* | HARD |
| 12 | ⭐ **G-CELLS** | the per-cluster cells are IN the artifact, and the published table **and its ordering** re-derive from those stored cells alone | HARD |
| 13 | ⭐⭐ **G-RESCORE** | the banked books are read, and read correctly: EK-T1's artifact sha is self-consistent, its **own** published mean vector and its **own** ordered-book count re-derive from its stored cells, every book's belief math re-derives from raw counts, and the NEW ordering predicate's strictness is exercised on synthetic ties on **both** pairs | HARD |
| 14 | ⭐ **G-VALUES-UNREACHABLE** | no measured answer of EK-C0's, EK-C0b's, EK-T1's or the certified table is reachable from `src/**` — the banked keyed extraction replayed and EXTENDED to EK-T1's result, percentage forms live at 3 dp, the declared floor (≥ 3 decimals **and** ≥ 4 significant digits) with its excluded count published, and a CONTROL NEEDLE that must be FOUND | HARD |
| 15 | **G-SEED** | every block disjoint from the COMPLETE ledger (EK-T1's whole band a named conjunct) and the blocks ordered | HARD |
| 16 | **G-STATS** | stats base 109,400, min gap ≥ 200 to every published base | HARD |
| 17 | ⭐ **G-ENV-CLEAN** | **WHITELIST-OR-REFUSE in the #262.2 third-visit form**: any unrecognised `EKC0C_*` **or any ENGINE env door** is a FATAL refusal (exit 2); **every** override — **including the output path `EKC0C_OUT`** — is a PREFLIGHT that routes onto the guard block, may not write a canonical repo path, and reds this gate | HARD |
| 18 | ⭐ **G-RESUME** | the long run is CHECKPOINTED per cluster under a design tag carrying the probe's **own source hash**, and cluster 0 **recomputed from scratch** reproduces its checkpointed digest byte for byte | HARD |

**No gate reads a rate.** The yardstick, its ordering, the re-score's limbs, the share and the route
are **mechanical readings**, not gates: a MISMATCH turns nothing red.

## §DEV — the deviations, declared BEFORE the census

1. ⭐⭐ **THE SEED BAND IS 12,461,000+, NOT #263.3's LITERAL 12,452,000** (§SEEDS): that literal is
   EK-T1's own consumed battery. The ruling's word is FRESH; #163 governs; the band opens above
   EK-T1's whole reserved ceiling, and G-SEED proves the disjointness against the complete ledger.
2. ⭐⭐ **THE CENSUS WORLD ARMS THE LEARNING DOOR AS AN OBSERVER** rather than walking flags-off and
   re-deriving the band instrument-side (§FORM). The band is the seat's own placement, recorded
   inside the brain; an instrument-side re-band would re-implement the brain's decision cadence and
   would **silently kill the freshness refusal**. The trajectory is the flags-off world's, gated on
   **every** census seed (G-BYTE-IDENTICAL), the veto door is shut in both arms (a G-ARMS conjunct
   with its own mutant), and zero vetoes are served (G-CENSUS-LIVE). This discharges #263.3's intent
   — *the instrument counts beside the timeline* — with the seam's own counting rules.
3. ⭐ **THE N RULE EXTENDS THE PRECEDENT WITH AN ORDERING TERM** (§NRULE), because the corrected
   yardstick's deliverable is an ordering. The precedent's own precision term and floor are kept,
   computed and published; the zero-event clause is frozen in its precedent form (unbounded ⇒ the
   caps bind).
4. ⭐⭐ **TWO REAL INSTRUMENT FAULTS WERE CAUGHT AT SMOKE SCALE, BEFORE THE FROZEN RUN** (the EK-C0b
   idiom — a stage's smoke is there to fail):
   (a) ⭐ **THE WHISTLE READ WAS WRONG, AND FIXING IT FOUND #263.2(2)'s MECHANISM.** The first
   replay closed still-open labels at the whistle from a post-loop read of the match — which reports
   `phase = 'fulltime'`. But `Match.endMatch()` runs the seam's last observation **before** it sets
   that phase, so the seam's whistle read is a **PLAYING** read: if the opponent has just
   established control, that is a LOSS and it punishes every open label. G-LABEL-READING went RED on
   the clusters where it mattered; the mirror now reads the whistle with the seam's own semantics —
   and that single rule **is** the 626-vs-632 divergence #263.2(2) named.
   (b) **THE N RULE'S UNBOUNDED TERM WAS BEING FLOORED, NOT CAPPED.** The first arithmetic dropped
   an unestimable term to zero before the `max`, which collapsed N\* to the floor of 25 — the
   zero-event clause read backwards. Caught by reading the smoke's own sizing rows, and gate-backed
   from the first full invocation onwards: G-N compares the frozen N\* literal against the
   recomputed rule and reds on any disagreement.
5. **THE TAKE POPULATION IS SINGLE-BAND BY CONSTRUCTION** — the certified table licenses a hold in
   exactly one cell (`0|0|0` at k30), so the seat's own takes can only ever land in one perceived
   band. The provenance split is published; the yardstick counts both provenances, as the book does.
6. **G-ARMS' `doorsShut` LIMB IS SCOPED** (inherited from EK-T1 §DEV 4): the MT world-flag set
   overlaps this world's own census flags, so the MT limb covers the flags the drill world does not
   arm; the census flags are gated by their own `drillWorld` conjunct.

## §NON-CLAIMS

1. **NOTHING SHIPS.** Zero `src/**` bytes; the production fingerprint re-derived unchanged; both
   `ekHoldLearn` and `ekHoldVeto` stay hard false in every production path, and `whetherEye` is null
   there anyway.
2. ⚠⚠ **THE #263.1 NEGATIVE IS UNTOUCHED.** H-EK (books vs the clone-dosed yardstick) stays
   NEGATIVE of record. H-EK′ is a **different claim against a different yardstick**.
3. **NEITHER CENSUS IS "THE" TRUTH OF THIS WORLD.** Both are banked instrument-side and published
   beside each other — the venue-dependence record #263.3 asks for. Which one a future consumer
   should be scored against is a commander's call, not a probe's.
4. **THE CENSUS COUNTS WHAT BOOKS COUNT.** Refused doses (stale or never-placed bands) are not
   members of this population; they are published, never imputed and never re-banded.
5. ⚠ **THE VENUE IS STILL A GREENHOUSE** (#261.3(iii)): drills are dosed at a cadence no production
   world runs. This stage measures the greenhouse's own truth, which is the point.
6. **THE CONJUNCTION IS A PREDICATE, NOT A TRUTH.** τ = 0.90 is a frozen convention carried over
   unchanged; a share of 0.875 is published as what it is.
7. **THE RE-SCORE RUNS NO SIMULATION OF ITS OWN.** It reads committed cells. No book is re-grown, no
   learning arm is re-walked, and nothing about EK-T1's world is re-litigated here.
8. **NO EVOLUTION, NO INHERITANCE, NO GENE.** This seam writes no genome field at all.

## §CHECKS

* `npx tsc --noEmit` — clean.
* **No test file is added and no test file is edited** (instrument-only round); `src/**` is
  byte-untouched, gated by X-SRC-UNTOUCHED, and the shipped league fingerprint is re-derived
  **inside the probe's own process** (X-FP-PROD).
* The SMOKE mode's own artifact (`…-smoke.json`, N = 40 on block 12,461,100–139) is committed beside
  the census's: it is the sizing source the FULL run reads, and the plumbing read that caught both
  §DEV 4 faults. It scores nothing.

---


## §RESULT

**4,000 fresh seeds × 2 arms = 8,000 walks, 4,000 clusters, block 12,462,000–12,465,999 — 18/18 gates PASS**, `resultSha256` `8b52369a…6a5b`, G-DET digest `a0df54cd…` twice. Mode: **CENSUS**. Every number below is printed by `scripts/analysis/ek-c0c-census-result.ts` from the committed artifact; none is typed (#229.2).

### The run

```text
world            the IN-TIMELINE DRILL WORLD — EK-T1's committed world verbatim, with the
                 learning door armed as an OBSERVER only (veto shut, no mechanic reads a book)
byte-identity    4,000/4,000 census seeds: the armed timeline IS the flags-off timeline
counting         the SEAM'S OWN rules — the seat's band placement, the freshness refusal,
                 the 10 s first-loss label, drill and take holds alike
holds counted    158,456  (9,350 takes + 149,106 drill holds; 42,789 doses REFUSED for
                 want of a fresh band — 37,870 stale + 4,919 never-placed, counted not hidden)
seat placements  725,379
estimator        cluster bootstrap by match seed, 4,000 clusters, 2,000 resamples, one shared index matrix
```

### ⭐⭐ THE CORRECTED YARDSTICK — P(punished | held, perceived band), in the learner's own venue

| band | holds | punished | punish rate | 95 % CI | relative |
|---|---:|---:|---:|---|---:|
| **free** | 34,375 | 28,350 | **82.473 %** | [81.858, 83.069] | 1.0120 |
| **mid** | 21,506 | 17,909 | **83.274 %** | [82.715, 83.809] | 1.0219 |
| **pressed** | 102,575 | 80,753 | **78.726 %** | [78.317, 79.098] | 0.9661 |
| overall | 158,456 | 127,012 | 80.156 % | — | — |

⭐ **THE MEASURED ORDERING: mid > free > pressed** — and the two adjacent gaps, each resolved by the paired cluster bootstrap:

| adjacent pair | gap (pp) | 95 % CI (pp) | resolved above zero |
|---|---:|---|---|
| mid − free | **0.8017** | [0.0539, 1.5678] | ✅ YES |
| free − pressed | **3.7469** | [3.0815, 4.4184] | ✅ YES |

All three pairwise gaps, in full:

| pair | gap (pp) | 95 % CI (pp) | resolved (either sign) |
|---|---:|---|---|
| free − mid | -0.8017 | [-1.5678, -0.0539] | ✅ YES |
| free − pressed | 3.7469 | [3.0815, 4.4184] | ✅ YES |
| mid − pressed | 4.5486 | [3.9698, 5.1303] | ✅ YES |

### The complement partition — every counted hold closes exactly once

```text
holds counted            158,456
  punished (in window)   127,012
  unpunished             31,444
closed at a loss         127,072   (of which out-of-window: 60)
closed at the window     28,938
closed at the whistle    2,446   (the CENSORED class — unpunished by construction)
REFUSED, not counted     42,789   (stale 37,870 · never-placed 4,919)
```

### The two hold provenances (REPORTED — the census counts both, because the book does)

| provenance | free | mid | pressed |
|---|---:|---:|---:|
| take holds | 9,350 | 0 | 0 |
| take punish rate | 83.615 % | n/a | n/a |
| drill holds | 25,025 | 21,506 | 102,575 |
| drill punish rate | 82.046 % | 83.274 % | 78.726 % |

### The window ladder (REPORTED — the primary is the seam's own constant)

| window | free | mid | pressed | ordering |
|---:|---:|---:|---:|---|
| 4 s | 57.219 % | 62.080 % | 54.523 % | mid > free > pressed |
| 5 s | 64.617 % | 68.437 % | 61.262 % | mid > free > pressed |
| 10 s **(primary)** | 82.473 % | 83.274 % | 78.726 % | mid > free > pressed |
| 15 s | 90.397 % | 90.798 % | 88.259 % | mid > free > pressed |
| 20 s | 94.292 % | 94.439 % | 92.857 % | mid > free > pressed |

### The event-rate moments — per band, per team, per match

| band | holds mean | sd | cv | p10 | median | p90 | max | zero-share | punished mean |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| free | 4.2969 | 3.6275 | 0.8442 | 1.00 | 4.00 | 9.00 | 58 | 9.49 % | 3.5438 |
| mid | 2.6883 | 2.0391 | 0.7585 | 0.00 | 2.00 | 5.00 | 15 | 12.44 % | 2.2386 |
| pressed | 12.8219 | 9.6268 | 0.7508 | 3.00 | 11.00 | 26.00 | 68 | 1.73 % | 10.0941 |

⭐ **The venue's own cluster design effect**, measured on this census: 1.605308 punished labels per distinct punishing loss.

### ⭐ THE #263.2(2) LEAD, RESOLVED — which reading rule this instrument implements

| reading | free | mid | pressed | total |
|---|---:|---:|---:|---:|
| ⭐ **THE SEAM READING (of record)** | 28,350 | 17,909 | 80,753 | 127,012 |
| the probe reading (EK-T1's deff rule) | 28,211 | 17,848 | 80,269 | 126,328 |

The two disagree on **684** labels the seam punishes and the probe rule does not, and **0** the other way — 0.4317 % of 158,456 labels. ⭐ **THE MECHANISM, FOUND AND NAMED**: `Match.endMatch()` runs the seam's last observation BEFORE it sets `phase = 'fulltime'`, so the whistle read is a PLAYING read — if the opponent has just established control it is a LOSS, and it punishes every still-open label. A post-loop reading sees `fulltime` and closes those labels unpunished. This instrument implements **the seam's own rule**, and G-LABEL-READING proves it cell for cell against the observer arm's own books (4,000/4,000 clusters, 22,108 non-empty cells of 24,000, 158,456 labels).

### ⭐⭐ THE RE-SCORE — H-EK′ on the COMMITTED EK-T1 books, against the corrected yardstick

Source: `docs/world-model/data/ek-t1-hold-convergence-exam.json` — 40 books (20 replicates × 2) at its final checkpoint, 180 matches each. A generator-level act on banked data: **no learning run happens here**, and the #263.1 NEGATIVE against the clone-dosed yardstick stands untouched.

| limb | reading | verdict |
|---|---|---|
| **(i) mean vector** | free **82.185 %** · mid **83.173 %** · pressed **78.557 %** — observed ordering **mid > free > pressed**, required (the yardstick's) **mid > free > pressed** | ordered as required: ✅ YES |
| **(i) gap mid − free** | **0.9875 pp**, 95 % CI [0.2747, 1.6933] | resolved above zero: ✅ YES |
| **(i) gap free − pressed** | **3.6281 pp**, 95 % CI [2.9636, 4.3159] | resolved above zero: ✅ YES |
| **LIMB (i)** | ordering + BOTH gaps resolved at set grain | **PASS** |
| **LIMB (ii) book share** | **25 / 40 = 62.50 %** ordered books vs τ = 0.9 (needs 36) | **FAIL** |
| ⭐⭐ **THE CONJUNCTION** | both limbs | **NEGATIVE** |

### ⭐⭐ THE ROUTE — **MISMATCH**

> **MISMATCH** ⇒ *a real seam defect exists after all — STOP to the user*

Printed mechanically from the predicate above, with ruling #263.3's consequent verbatim. This document reports; it does not adjudicate (#203).

**The convergence distances (REPORTED, never gated — #246):** the corrected yardstick reads free 82.473 % · mid 83.274 % · pressed 78.726 %; the books' relative vector is [1.0108, 1.0230, 0.9662] against the yardstick's [1.0120, 1.0219, 0.9661] — L1 absolute 0.00558, L1 relative 0.00244.

### ⭐ THE VENUE-DEPENDENCE RECORD — the two truths of the same world

| band | clone-dosed (EK-C0) | in-timeline (EK-C0c) | Δ (pp) |
|---|---:|---:|---:|
| free | 79.412 % | 82.473 % | **3.061** |
| mid | 69.470 % | 83.274 % | **13.805** |
| pressed | 74.833 % | 78.726 % | **3.893** |
| holds | 272 / 2,319 / 8,678 | 34,375 / 21,506 / 102,575 | — |
| ordering | p0 > p2 > p1 | p1 > p0 > p2 | orderings agree: ❌ NO |

### The ex-ante sizing, as the probe recomputed it

```text
smoke source            40 matches, holds [346, 233, 982], punished [286, 193, 751]
smoke rates             [0.826590, 0.828326, 0.764766]
smoke holds/match       [8.6500, 5.8250, 24.5500]   deff 1.547170
rarest band             mid (4.8250 punished/match)
precision term (60 ev)  13   floor 25
gap magnitudes (pp)     [0.1737, 6.1824, 6.3560]
ordering term           UNBOUNDED (no N on the grid resolves every gap)
requirement             UNBOUNDED ⇒ the caps bind
caps                    wall 11,495 (binds: false) · seed 4,000 (binds: true)
N* = 4,000   ran at N = 4,000
```

### Gate table

| gate | result | evidence |
|---|---|---|
| `gDet` | **PASS** | digest `a0df54cd315012b2…` on both runs |
| `xSrcUntouched` | **PASS** | `git diff --stat -- src` and `git status --porcelain -- src` both EMPTY — instrument-only round |
| `xFpProd` | **PASS** | the shipped league fingerprint re-derived in-process: `57b0bdab3891…` |
| `gWorld` | **PASS** | the drill world proved on the never-stepped seed 12,461,999 and on 4,000/4,000 census matches |
| `gByteIdentical` | **PASS** | 4,000/4,000 observer signatures identical to the FLAGS-OFF drill world (rng stream inside) |
| `gArms` | **PASS** | 8 conjuncts, 8/8 mutants live, each RE-INVOKING the predicate |
| `gLabelReading` | **PASS** | the seam reading reproduces the observer books cell for cell on 4,000/4,000 clusters (22,108 non-empty cells, 158,456 labels, both label values present in every band) |
| `gFreshness` | **PASS** | 42,789 doses refused (37,870 stale + 4,919 never-placed), max staleness 13,784 ticks; counted holds = takes + drills |
| `gAccounting` | **PASS** | the partition closes (158,456 = 127,012 + 31,444), every class non-negative, the ladder monotone in the window |
| `gCensusLive` | **PASS** | 3/3 bands carry holds AND punishment; min band holds 21,506; takes 9,350, drills 149,106, vetoes 0 |
| `gN` | **PASS** | N* 4,000 recomputed from the COMMITTED smoke artifact; ran at N = 4,000; τ = 0.9 |
| `gCells` | **PASS** | 4,000 clusters stored; the published table and its ordering re-derive from the stored cells alone |
| `gRescore` | **PASS** | EK-T1's artifact sha self-consistent; its published mean vector and its 0/40 ordered-book reading both re-derived from the banked cells; strict-tie rejection on BOTH pairs |
| `gValuesUnreachable` | **PASS** | 1,195 keyed measured answers → 2,140 searchable forms over `src/**` — 0 value hits, 0 name hits, control needle FOUND; 980 forms excluded by the declared floor |
| `gSeed` | **PASS** | 4 blocks disjoint from the complete ledger and ordered |
| `gStats` | **PASS** | base 109,400, min gap 400 |
| `gEnvClean` | **PASS** | whitelist [EKC0C_MODE, EKC0C_N, EKC0C_SKIP_FP, EKC0C_OUT], 9 ENGINE doors scanned and unset, preflight: false, out `docs/world-model/data/ek-c0c-intimeline-census.json` |
| `gResume` | **PASS** | seed 12,462,000 recomputed from scratch reproduces its checkpointed digest `0123e51c2b4d…` (resumed from checkpoint: false) |

**18/18** — and the count is structural: the probe exits 1 before writing anything if the artifact's gate-object key set is not exactly the frozen list (#250.3(i)).

### The per-cluster cells

Every seed's raw per-side per-band (holds, punished) cells, its ladder counts, its provenance split, its closing causes and its refusal counts are stored in the artifact under `result.perClusterCells` — 4,000 clusters — so the whole yardstick, its ordering and every CI re-derive without re-running anything (G-CELLS proves exactly that).

---

## §COMMANDER CORRECTIONS OF RECORD (#264.2 — the verify's HIGH is RATIFIED; the measurement stands, the route's framing falls)

1. ⚠⚠ **THE HIGH, ratified by the commander's independent arithmetic**: LIMB (ii) is
   UNPASSABLE BY CONSTRUCTION against this yardstick — the venue's mid−free gap (0.8017 pp) is
   below per-book resolution at M = 180 (per-book n ≈ 490/784; a PERFECT learner's expected
   ordered share = 63.8 %, the observed books read 62.5 %; P(≥ 36/40) ≈ 1.8 × 10⁻⁴ even for
   oracles). The printed MISMATCH consequent ("a real seam defect exists after all") is
   therefore a DEAD-BY-CONSTRUCTION PREDICATE at the route level — the #251.3 class, one level
   up — and is WITHDRAWN as a defect claim of record. NO SEAM DEFECT EXISTS on this evidence.
2. ⚠ **The yardstick's mid−free RESOLVED bit is bootstrap-RNG-fragile** (flips under
   independent resample draws): 0.8 pp is OF RECORD a NEAR-TIE. The venue truth's ROBUST
   structure = {mid ≈ free} > pressed (those gaps 3.7/4.5 pp, solidly resolved).
3. ⚠ **#258.3 recurrence**: a machine timing and the output path ride the hashed body —
   `resultSha256` is not run/path-portable; the portable anchor is the G-DET digest. Corrected
   of record; the canon line is repeated VERBATIM in every future brief.
4. **The 626-vs-632 lead is CLOSED** — a real counting-rule mechanism at `src/sim/Match.ts:4107`
   vs `:4128`, confirmed by the verify; the census's published probe-rule divergence (0.43 %)
   quantifies it. LOWs of record: G-BYTE-IDENTICAL is a terminal-state snapshot, not a per-tick
   trajectory (adequate, scoped); the smoke artifact's gN is mode-conditioned trivially-true
   (declared).
