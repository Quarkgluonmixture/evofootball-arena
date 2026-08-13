# EK T0 — the DORMANT HOLD-BELIEF SEAM (`ekHoldLearn` / `ekHoldVeto`, 持球的账本)

Status: **PRE-REGISTERED, then BUILT + RUN the same round** (the OBM-T0 / CTB-T0 / PTP-T0 /
DLC-T0 / DV-T0 / **DV-T2-T0** two-part form).

The frozen law, the seam, the read-fork inventory, the ⭐ PRE-REGISTERED VETO FORM, the gate
list, the seed ledger, the PIN INVENTORY and the Road B statement below were written **before**
the receipts ran (the frozen-before-sight rule); the measured numbers arrive only in
[§RESULT](#result--the-gates-run) at the foot, and every number there is quoted FROM the
committed artifact.

Authority chain: the **EK-HOLD EARNED-BELIEF CONTRACT**
[`EK-HOLD-EARNED-BELIEF-CONTRACT.md`](EK-HOLD-EARNED-BELIEF-CONTRACT.md) §2 — **M-EK.1** (THE
OBSERVABLE HOLD LABEL), **M-EK.2** (THE BELIEF + THE BOOK), **M-EK.3** (CONSUMPTION), **M-EK.4**
(SCOPE) — bound by ruling **#259.2**, dispatched by **#261.4**, and governed by ⭐ **#261.3's
FOUR PICKS OF RECORD**: (i) **W = 10 s** · (ii) **the target shape is the MEASURED TRUTH
`free > pressed > mid`** (the drafting's naive pressure-monotone expectation is RETIRED by
measurement) · (iii) **exploration = DOSED-HOLD DRILLS, the training-ground venue** (#255.1's
label greenhouse; the live seat only ever takes free-band holds) · (iv) **consumption = a
ZERO-CONSTANT COMPARATIVE VETO**, whose exact form this stage pre-registers for commander
review. Hygiene canon in full: **#250.3** (mode-conditioned literals) · **#251.3 / #252.3**
(derive your own predicates; a mutant per conjunct) · **#256.2/.3** (commensurability; coverage
sets named; per-cluster cells stored) · **#258.3** (timings OUTSIDE the hashed body) · **#260.2**
(every override through the preflight; ⭐ mutants RE-INVOKE the gate functions) · **#261.2**
(⭐ **every env var WHITELISTED-OR-REFUSE**) · **#163** · **#181.2** · **#200** · **#203** ·
**#229.2** · **#64.1** (R-B strict no-subsidy) · **#247 / #248.1** (shape hand-built, ANSWERS
earned).

The banked work this stage reuses **verbatim** and does **not** touch:
[`DV-T2-T0-LEARNING-SEAM.md`](DV-T2-T0-LEARNING-SEAM.md) — ⭐⭐ **THE CANON REPLAYED**: its book
form, its ledger form, its two-limb door law, its gate list and its two §DEV catches (the
LAMARCK catch and the `fromJSON` `matchFlags?.` catch) are this stage's template, applied to the
hold family. [`C5-T2-WHETHER-SEAT.md`](C5-T2-WHETHER-SEAT.md) — ⭐ **THE SEAT**: its eligibility
predicate, its percept pull, its band placement and its INJECTED-table convention (**no table in
`src`**) are untouched; `src/ai/whetherEye.ts` is **byte-untouched by this stage** (a pin).
[`EK-C0-HOLD-OUTCOME-CENSUS.md`](EK-C0-HOLD-OUTCOME-CENSUS.md) — ⭐⭐ **THE LABEL'S SEMANTICS AND
THE YARDSTICK**: the 10 s window, the DV-C0 loss semantics and the perceived-band index are ITS
(through DV-C0 / #215.3-H1), and its measured table is what the REPORTED smoke is published
beside — and is **instrument-side for ever** (G-NOTABLE).
[`EK-C0B-INVERSION-DIAGNOSTIC.md`](EK-C0B-INVERSION-DIAGNOSTIC.md) — the shape of record
(`free > pressed > mid`, genuine world structure) and a second value set G-NOTABLE excludes.

---

## §LAW — the frozen law of the hold account book

```text
THE TWO DOORS, and they do DIFFERENT things (the DV-T2-T0 two-limb form)
  learns    ⇔  match.ekHoldLearn === true      [this stage's NEW flag — the ledger seat]
  consumes  ⇔  match.ekHoldVeto  === true      [this stage's NEW flag — the veto]
              AND the ledger seat exists (a book to compare against)
              AND the book SPEAKS at this band (see THE VETO below)

  ⇒ armed to LEARN alone, the books fill and NOTHING reads them: byte-identical (G-BORN).
  ⇒ armed to learn AND veto with an EMPTY book, the book speaks nowhere, so no hold is
    ever declined: byte-identical (G-EMPTY — the flag's G-ZERO analogue).
  ⇒ armed to learn AND veto with a ONE-BAND book, there is no cross-band reference, so
    again nothing is declined: byte-identical (G-EMPTY, second form).
  ⇒ the world moves only once the team's OWN book has evidence in TWO bands and the
    licensed band's own rate is strictly the worse one. Consumption is EARNED or it is
    nothing.

THE LABEL (M-EK.1) — semantics TRACED to EK-C0 (thence DV-C0 / #215.3-H1), re-typed nowhere
  a HOLD       = a hold the TEAM EXPERIENCES, of two provenances and no others:
                 (a) a TAKE — the armed seat's own D-HOLD (R-B licensed, #64.1), and
                 (b) a DRILL — a `Match.forcedHold` commitment under `c5Hold`, i.e. the
                     TRAINING-GROUND VENUE of record (#261.3(iii)). Both are holds this
                     team's body actually played; nothing else is a hold. The drill is
                     captured at the HEAD OF THE TICK IT STARTS (public state: the C5 door,
                     the commitment, the body's role/sent-off/restart status), not on the
                     brain's hold branch — the brain only re-decides every `AI_INTERVAL`.
  its INDEX    = the seat's OWN PERCEIVED pressure band b ∈ {0,1,2} at the decision
                 (`whetherEyeDecision(...).perceived.pressureBand`, the SHIPPED placement —
                 #256.2's commensurability rule fixed AT THE SOURCE: the book indexes what
                 the chooser reads, and the veto reads back the same index).
                 ⚠ ⭐ THE FRESHNESS RULE: a drill hold carries the band the seat placed at
                 THE DECISION THE DRILL DISPLACED — the placement on the tick immediately
                 before the commitment began, and no other. A body under a drill takes the
                 C5 early-return branch and the seat never runs, so its last placement can
                 be thousands of ticks old (measured); a STALE or ABSENT placement is not a
                 band, and that drill hold is NOT counted — it is counted as UNBANDED and
                 published, split by cause. Never guessed.
  a LOSS       = DV-C0's team-level turnover: a possession segment is a maximal interval of
                 same-owner-TEAM control while `phase === 'playing'`, SUSPENDED while the
                 ball is loose, ended by an OPPONENT ESTABLISHING OWNERSHIP (stamped at that
                 tick). A dead ball is NOT a loss; it ends the chain.
  PUNISHED     ⇔ the FIRST loss by the HOLDING team after the hold is stamped within
                 EK_HOLD_WINDOW_S of the hold instant (EK-C0's own mechanical rule, which
                 counts that first loss even if a dead ball and a regain intervened).
  ⭐ THE LABEL CLOSES WHEN THE WINDOW CLOSES (or at the first loss, or at the whistle). A
    hold whose window is still open is not yet knowledge; the book moves only on closure.

THE BOOK (M-EK.2), per team, per PERCEIVED band b ∈ {free, mid, pressed}
  holds[b] += 1 on every CLOSED label at b;  punished[b] += 1 when it closed punished.
  belief[b]  = punished[b] / holds[b], the ZERO-CONSTANT running mean (a band with no
               observation reads 0).
  ⭐ AN EMPTY BOOK SERVES NO BELIEF AT ALL (`null`) — born absent survives arming.
  SEASON RESET: the whole book is wiped at the season boundary — structural and untuned,
    the M-DV2.2 clause replayed. NO decay, NO half-life, NO window, NO configurability the
    contract does not name.

⭐⭐ THE VETO (M-EK.3) — THE PRE-REGISTERED FORM, and it is ZERO-CONSTANT
  At an eligible decision instant where the certified table LICENSES a hold (the seat's own
  D-HOLD, unchanged), with the veto door armed, the seat DECLINES that hold iff

      holds[b] > 0                                   (my book speaks at THIS band)
      AND  Σ_{b'≠b} holds[b'] > 0                    (my book has a CROSS-BAND reference)
      AND  punished[b] · Σ_{b'≠b} holds[b']
             >  Σ_{b'≠b} punished[b'] · holds[b]     (STRICT: this band's own believed risk
                                                      exceeds my book's own pooled rate over
                                                      every OTHER band)

  — i.e. `belief[b] > (pooled other-band punished)/(pooled other-band holds)`, written as an
  integer cross-multiplication so no float and no epsilon enters. THE PROPERTIES, each gated:
    * ZERO-CONSTANT: the only literals are 0 (structural EMPTINESS tests, not thresholds) and
      the strict inequality itself. No τ, no rate, no scale, no tuned number, nothing from any
      census (G-NOTABLE covers the certified values too).
    * OWN BOOK ONLY: both sides of the comparison are this team's own counters.
    * NEVER A SUBSIDY (R-B, #64.1): the veto can only REMOVE a hold the certified table
      already licensed. An unlicensed hold is NEVER taken — the veto is not consulted there,
      and no code path can create a D-HOLD (G-VETO's no-subsidy conjunct measures it in-world:
      every commitment in every arm sits in a `reachesZero` cell of the injected table).
    * ABSENT / EMPTY / ONE-BAND ⇒ byte-identical (G-EMPTY).
    * A DECLINED HOLD IS NOT A HOLD: it writes no label (the team did not hold), and the body
      simply runs the act-now branch the seat would have run at `E-ACTNOW-DECLINED`.

THE WRITE PATH — ⭐ THERE IS NO GENE
  This seam writes NO genome field, adds NO gene, and therefore has no Lamarck surface at all:
  consumption reads the BOOK directly at the one decision site. The DV catch is inherited as a
  PROHIBITION rather than a mitigation, and G-NOLAMARCK measures it.

⭐⭐ EPISTEMIC HONESTY, closed at the IMPORT LIST. `holdAccountBook.ts` imports NOTHING —
  an EMPTY import list, the strongest form of the DV-T2-T0 pin. It cannot name `Match`,
  `Player`, `Team`, a percept snapshot, an rng or a file path, so it cannot read an opponent's
  internals, a percept channel or any census artifact. Everything it is told is (a) MY OWN
  body's hold and the band MY OWN seat placed, (b) who has the ball and whether it is in play,
  which everyone on the pitch can see, and (c) THE PUBLIC CLOCK. G-EPI gates the import list
  and the named members.

NO PREDICATES (#200) — the complete conditional set is GATE, SELECTOR, WINDOW, EMPTY, VETO
  GATE     the arming rule (two flag forks ⇒ the nullable ledger seat + the veto read).
  SELECTOR the perceived band — the SEAT's own, unchanged; it decides WHICH counter moves.
  WINDOW   the label's own definition (`t_loss ≤ t_hold + W`); it decides how an event is
           REMEMBERED, after the fact.
  EMPTY    `holds === 0 ⇒ no belief / no veto` — the born-absent rule, not a threshold.
  VETO     ⭐ THE ONE conditional in this seam that can change an action — and it is a
           COMPARISON OF THE TEAM'S OWN TWO RATIOS, declared above in full, never a constant.
```

### ⭐ The sharpenings, declared (the contract is silent on each)

1. **THE OBSERVATION POINT IS THE HEAD OF `step`** + `endMatch`, exactly DV-T2-T0's
   sharpening 1: it reads the state the previous step left, which is where EK-C0's own walker
   stands (`segmentTick` is called immediately after `m.step`), and the clock stamps agree
   because `simTime` only advances inside the body.
2. **A DRILL HOLD IS COUNTED ONCE PER COMMITMENT** (`gid|untilTick`), not once per tick of the
   hold — the census counts hold MOMENTS, and a k-tick shield is one moment.
3. **CENSORED ⇒ UNPUNISHED.** A label still open at the whistle closes UNPUNISHED, because no
   further loss can arrive. EK-C0 publishes censoring as its own column; a book has only two
   columns and this stage declares which way the censored ones fall (it can only push a short
   book DOWN — §HONESTY 5).
4. **THE WINDOW AND THE BAND COUNT ARE ON THE SHAPE SIDE OF #247.** `EK_HOLD_WINDOW_S = 10` is
   the STRUCTURE of the question (#261.3(i)'s pick of record), and `EK_HOLD_BANDS = 3` is the
   arity of the seat's own band type. **G-TRACE proves both by READING committed artifacts** —
   the window off DV-C0's and EK-C0's, the band count off the certified table's own
   `pressureBands` cuts. No measured RATE is anywhere near `src/**` (G-NOTABLE).
5. **THE BOOK IS THE SEASON'S, HELD BY THE LEAGUE** (`MatchConfig.ekHoldBooks`), the DV
   sharpening 4 replayed, wiped in `startSeason`. ⚠ Declared: **no League world arms the seat
   or doses drills**, so a League season's books stay EMPTY unless a drill match is handed the
   same book objects — G-RESET therefore measures allocation + identity + the wipe, and fills
   through a drill match that shares the League's own books (§DEV 3).
6. **NO RENDER CUE, NO FEED LINE, NO NEW ACTION TYPE, NO SAVE FIELD, NO NEW GENE.** The book is
   never serialized; a save round-trip carries no learning at all.

## §HONESTY — the epistemic limits, stated plainly

1. **NO NEW CHANNEL.** The seam adds a MEMORY of the body's own holds and the public
   possession stream. It adds **no percept pull of its own**: the band is the one the seat
   already placed at its own decision, and the drill's band is that same placement re-used.
2. ⚠ **THE BOOK IS A TEAM'S, NOT A PLAYER'S** — contract §4's named later slice, inherited
   from DV-T2-T0 §HONESTY 2.
3. ⚠ **THE DRILL IS A GREENHOUSE, AND IT IS DECLARED** (#255.1 / #261.3(iii)). The live seat
   only ever takes free-band holds (the certified table licenses exactly one cell), so an
   own-experience book could fill ONE slot. The drill dose is what makes three bands
   observable at all; it is a TRAINING GROUND, not the shipped game, and the exam that scores
   the registration runs in it by the commander's pick.
4. ⚠ **THE DRILL VENUE IS TWO-PHASE, AND SOME DOSES ARE REFUSED.** The instrument ARMS at a
   decision moment and DOSES on the next tick, so the drill displaces the decision the seat has
   just priced (lag exactly ONE tick). Doses whose armed decision never reached the seat (the
   body shot, cleared, or was the restart taker) carry no fresh band and are REFUSED — counted
   as UNBANDED, split into `unseen` vs `stale`, and published. The refusal rate is a REPORTED
   number of this stage, not a hidden one.
5. **CENSORING PUSHES A SHORT BOOK DOWN** (sharpening 3): the smoke's rates are expected to sit
   at or below the census's, and that is a fact about the estimator, not a defect.
6. **A WRONG BOOK IS LEGAL AND IS STYLE** (#247 intact). Nothing here gives any team EK-C0's
   table; each map is earned from own events.
7. ⭐ **THE MEASURED SANITY READ IS A SANITY READ.** The REPORTED smoke publishes the filled
   books' rates beside EK-C0's census rates. **Divergence is a finding to REPORT, never to
   fix**, and neither direction adjudicates anything (#203).
8. ⚠ **THIS STAGE SCORES NOTHING.** Whether a book grows the measured shape
   (`free > pressed > mid`) is **EK-T1's** question. The smoke is one pooled reading.

## §SEAM — the mechanism (all of it dormant)

### The flags

**`ekHoldLearn`** and **`ekHoldVeto`**, two new **explicit** `MatchConfig` booleans, initialised
`cfg.ekHoldLearn ?? false` / `cfg.ekHoldVeto ?? false` (`Match.ts`) — the `dvLearnedMap` form.
**Never** `EDS_BUNDLE_ARMED`, never env-armed, never default-ON, never bundle-defaulted:
**absent from `src/game/a4World.ts` entirely**. Each gets its own `League.matchFlags` key so a
probe world can arm it explicitly, and neither key changes any default.

### ⭐ THE ARMING CHECKLIST (a NAMED deliverable — what a world must do to see anything)

| # | to see… | you must | why |
| --- | --- | --- | --- |
| 1 | a ledger at all | `ekHoldLearn: true` | the one Match fork |
| 2 | a BAND for any hold | `whetherEye` armed (table INJECTED by the probe) | the band is the seat's own placement; no seat ⇒ no band ⇒ no counted hold |
| 3 | drill holds | `c5Hold: true` **and** an instrument setting `Match.forcedHold` **one tick after** a decision moment of that same body | the training-ground venue (#261.3(iii)); `forcedHold` is null in every production path, and the freshness rule refuses a dose the seat did not just price |
| 4 | a season's book | a League with `matchFlags.ekHoldLearn` (or `ekHoldBooks` passed in) | otherwise the book dies with the match |
| 5 | ANY behaviour change | `ekHoldVeto: true` **and** a book with evidence in ≥ 2 bands **and** the licensed band strictly worse than its own cross-band reference | the veto's own three conjuncts |

**Nothing in production satisfies even #2**: `whetherEye` is null in every shipped path.

### The genes

**NONE.** No gene, no `GENE_KEYS` entry, no opt-in, no genome write of any kind.

### ⭐ The READ-FORK INVENTORY (a NAMED deliverable)

| # | site | file | what it feeds |
| --- | --- | --- | --- |
| **1** | `this.ekHold = this.ekHoldLearn ? new HoldLabelLedger(…) : null;` — THE LEDGER FORK | `src/sim/Match.ts`, the constructor | the arming rule (flag ⇒ a ledger seat; otherwise `null`) |
| **2** | `...(this.matchFlags?.ekHoldLearn === true ? { ekHoldBooks: … } : {})` — THE SEASON FORK | `src/sim/League.ts`, `createMatch` | which two books the fixture learns into; allocates nothing when shut |
| **3** | `this.ekHoldVeto && ledger !== null && …` — THE VETO FORK | `src/sim/Match.ts`, `ekHoldDeclines` | the ONE consumption read; false whenever either door is shut |

Downstream, counted separately: the `this.ekHold !== null` consumer sites (`step`'s
observation, `endMatch`'s whistle, `ekHoldDeclines`) and the brain's own capture sites (the
band placement and the take), with the DRILL capture living in `Match.ekHoldObserve` beside the
possession read, and the book module's own body. Every other `src/**` occurrence is a declaration, an init, a type,
an import or the League union key — enumerated in the artifact with file:line and class, **zero
unclassified** (G-FORK).

**Byte-identity is structural, not hope**: with the forks not taken, `ekHold` is `null`, no
observation runs, no book exists, `ekHoldDeclines` returns `false` on a field test, and every
consumer site is a `!== null` test.

### Untouched (restated as a prohibition)

⚠ **`src/ai/whetherEye.ts` — NOT ONE BYTE** (the certified table stays INJECTED; the seat's
eligibility, percept pull, band placement, scope machinery and four decision classes are
untouched — M-EK.4). Every banked seam's own law, gene, flag, module and tests —
`deliveryAccountBook.ts`, `deliveryValueSeat.ts`, `passLeadSeat.ts`, `deliveryChoiceSeat.ts`,
`strikePlaneSeat.ts`, `lookSeat.ts` · the C5-T0 hold machinery and its `forcedHold` idiom ·
`perceptionSnapshot.ts` · `a4World.ts`'s flag set and all three play-test worlds · the render
layer · `evolve.ts` and every evolution path · `League.toJSON` / `fromJSON` (no save field) ·
`performPass`'s signature and body.

---

## §PINS — the PIN INVENTORY (a NAMED deliverable)

| # | pin | where | class | disposition |
| --- | --- | --- | --- | --- |
| 1 | ⭐⭐ **`whetherEye.ts` byte-untouched** (`git diff --stat` empty) | `src/ai/whetherEye.ts` | source text | must hold — the seat is consumed, never edited |
| 2 | ⭐⭐ the **DV-T2-T0 fork pins** (`dvLearnedMap` fork text, the book module) | `tests/dvLearnedMap.test.ts` | source text | UNTOUCHED and GREEN — this seam adds forks of its OWN |
| 3 | ⭐ the **C5-T2 seat pins** (the ONE whether fork, the seat's own suite) | `tests/c5*.test.ts` | mechanism | UNTOUCHED and GREEN |
| 4 | the **ZERO-NEW-HOLD-STATEMENT pin** — `type: 'ShieldHold'` count in `PlayerBrain.ts` unchanged | probe-computed | source text | this stage adds no new hold statement; it wraps existing ones |
| 5 | the **production fingerprint** `57b0bdab…c673` | asserted in 13 test files | league identity | UNTOUCHED — recomputed as G-IDENT / X-FP-PROD |
| 6 | ⚠ the **save round-trip pins** | `careers.test.ts`, League JSON suites | persistence | UNTOUCHED — the book is never serialized; `matchFlags?.` guards the `fromJSON` `Object.create` path |
| 7 | the whole suite | every pre-change test file (plus this stage's new one) | everything downstream | G-SUITE runs it in full. **No test file was edited by this stage** |

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

⭐ **#256.2's standing lesson: EVERY composite gate states its COVERAGE SET** — which conjuncts
a mutant proves live, and which are read-only reads with no mutant. ⭐ **#260.2: every mutant
RE-INVOKES the gate's own predicate function**, never a re-typed copy of it. `head` /
wall-clock / paths / **all machine timings** ride the UNHASHED envelope (#197-M1 / #258.3).

**THE TWO WORLD SHAPES** used throughout: **(P)** bare production (the drill inert, no seat —
where the seam can only be dormant) and **(D)** ⭐ **THE DRILL WORLD** = EK-C0's committed exam
configuration (its `CENSUS_FLAGS`, duration and squad derivation, `whetherEye` armed neutral
scope-both with the INJECTED certified table) **plus the public-state drill schedule** that
doses `Match.forcedHold` for k30 — the training-ground venue of record.

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with both flags absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — all three RECOMPUTED IN-PROBE | HARD |
| **X-FP-PROD** | the 1337 row IS the production fingerprint | HARD |
| **G-OFF** | per-match whole-run signature **including the rng stream state**: flags ABSENT ≡ flags FALSE, in **BOTH** world shapes, on every receipt seed. Semantics (#194): CONFIG EQUIVALENCE only | HARD |
| ⭐ **G-BORN** | `ekHoldLearn` ARMED ALONE (the veto shut) ≡ off, byte for byte, both shapes, every receipt seed — **with the machinery LIVE**: the drill-world runs must close **> 0** labels and fill **> 0** book cells (the non-vacuity conjunct) | HARD |
| ⭐⭐ **G-EMPTY** | **THE FLAGS' G-ZERO ANALOGUE, three forms.** (a) STRUCTURAL: an empty book serves `null` and declines nothing; (b) ONE-BAND: a book with evidence in a single band declines nothing (no cross-band reference) and BOTH doors armed on such a book leave the world byte-identical; (c) PREFIX: BOTH doors armed in the drill world is byte-identical to learn-only for every tick **up to and including** the tick before the FIRST VETO, on every prefix seed, and that prefix is non-empty | HARD |
| ⭐⭐ **G-LABEL** | **THE LABEL IS EK-C0's, PROVED BY EQUALITY.** On every receipt seed, the in-world books' **per-team per-band (holds, punished)** cells equal an INDEPENDENT probe-side re-labelling of the same trajectory built from EK-C0's own segment walker, loss stamp and 10 s window — **0 mismatches over all cells**. Non-vacuity: the re-walk must see **> 0** punished. Coverage set: loss closure · the window · the dead-ball sub-rule · first-loss-only — **four mutants, one per conjunct, each RE-INVOKING the comparison** | HARD |
| ⭐ **G-BAND** | THE INDEX IS THE SEAT'S AND IT IS FRESH: every counted hold's band lag is ≤ 1 tick by construction (measured max published), and every REFUSED drill dose is counted and split (`unseen` vs `stale`, with the widest staleness published). Coverage: the freshness rule is measured, not promised | HARD |
| **G-BOOK** | the book's arithmetic re-derived independently: `belief[b] === punished[b]/holds[b]` on every non-empty cell, `0` on every empty one, `punished ≤ holds` everywhere, `total` = the sum, width `EK_HOLD_BANDS`, on a hand-counted 500-event stream; the quantity is the MARGINAL (#256.2) | HARD |
| ⭐⭐ **G-VETO** | **THE PRE-REGISTERED FORM, machine-checked.** (i) EQUIVALENCE: on an exhaustive sweep of small hand-built books, `declinesHold(b)` equals an INDEPENDENT re-derivation `belief[b] > pooledOther(b)` computed in floats; (ii) EMPTY / ONE-BAND / equal-rate (tie) ⇒ **never** declines; (iii) ⭐ NO SUBSIDY (R-B #64.1): in every armed arm, **every** commitment in `Match.whetherHoldState` sits in a `reachesZero` cell of the injected table — the veto only ever REMOVES; (iv) ZERO-CONSTANT: the veto's own source lines contain no numeric literal but `0`; (v) DIRECTION: a book whose licensed band is the LOWEST-rate band never declines, and one where it is strictly the worst always does. Coverage: five conjuncts, **three mutants** (flip to `<`, drop the cross-band test, drop the emptiness test) each RE-INVOKING the sweep | HARD |
| ⭐ **G-RESET** | THE SEASON BOUNDARY: an armed League allocates one book per franchise and hands the SAME objects to its fixtures; a drill match sharing those objects fills them; after `finishSeason()` every cell is 0 and every `beliefVector()` is `null` again | HARD |
| **G-BITE** | with BOTH doors armed the drill world DIVERGES from the learn-only arm once a veto has fired — the non-vacuity of the whole seam. ⚠ Divergence, not a target flip (#250.3 inherited) | HARD |
| ⭐⭐ **G-CROSS** | **THE DOORS MATRIX (#228), two doors × the banked neighbours.** {`ekHoldLearn` on/off} × {`ekHoldVeto` on/off} × {`whetherEye` armed-neutral / absent} × {drill dosed / absent} — one FULL match per cell per seed, whole-run signature incl. rng state, inside the G-DET core. Claims EX ANTE: **(DORMANT-ALL)** every door shut ⇒ the incumbent world · **(A)** learning armed beside the armed seat and the dosed drill ≡ those alone · **(B)** the veto door armed ALONE (no ledger) ≡ off everywhere · **(INTERACTION)** the seam bites ONLY with BOTH flags armed AND the drill dosing a multi-band book · **(DISCRIMINATION)** ⭐ a VETOED world is not a SEAT-OFF world (declining some licensed holds ≠ never arming the seat) | HARD |
| ⭐⭐ **G-NOTABLE** | **THE #247 SPLIT, EXTENDED TO BOTH HOLD CENSUSES AND THE CERTIFIED TABLE.** No file in `src/**` contains EK-C0's OR EK-C0b's artifact name, schema name, or ANY of their measured values — every band rate, every margin, every moment — **as written (5-dp) AND in the formatted percentage form the tables print** — nor any certified-table cost value; and no seam file contains a loader, a `docs/` path or a dynamic import. Coverage set stated: the needle-set size, the degenerate values excluded by a declared floor, and a CONTROL NEEDLE that must be FOUND | HARD |
| ⭐ **G-EPI** | **THE LEARNER READS ONLY ITS OWN EVENT STREAM.** `holdAccountBook.ts`'s import list is **EMPTY**; its executable source names no `Match`, no `match.`, no `Player`, no `Team`, no `perceivedSnapshot`, no `opp`, no `rng`, no `attrs`, no `.pos`, no `readFileSync`, no `docs/`, no `import(`; and the event kinds the §LAW names EXIST ⚠ *scoped of record: the "and no other" half is certified by reading the module, not by the gate (DV-T2-T0's own #257.2 scoping)* | HARD |
| ⭐ **G-NOLAMARCK** | after an armed drill match AND after an armed League season, **no genome anywhere carries a hold belief**: this seam writes no genome field at all (source-level: zero `genome`/`Genome` writes on any seam line), `GENE_KEYS` is unchanged, and a save round-trip carries no book, no belief and no flag | HARD |
| **G-RNG** | the seam draws **zero** rng: an armed-to-learn drill match's rng state after every step equals the unarmed drill arm's, and the ledger's own methods driven directly on a stepped fixture leave the match rng state EXACT | HARD |
| **G-HYGIENE** | both flags absent from `a4World.ts` **entirely**; initialised `?? false`; a fresh Match and a League match are both OFF; an unarmed League allocates **no** book; no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` anywhere on a seam line; no new `GENE_KEYS` entry; the book never reaches `toJSON`; ⭐ **the probe's own env surface is WHITELISTED-OR-REFUSE** (#261.2) and every override routes through the preflight with the canonical-write guard | HARD |
| **G-FORK** | ⭐ the READ-FORK INVENTORY: **exactly ONE** ledger fork in `Match.ts`, **ONE** season fork in `League.ts`, **ONE** veto fork in `Match.ts`, feeding exactly the enumerated `this.ekHold !== null` consumer sites, with **ZERO** new hold statements (`type: 'ShieldHold'` count in `PlayerBrain.ts` unchanged at 2) and the seat's own fork still ONE; every other `src/**` occurrence enumerated with file:line and class, **zero unclassified** | HARD |
| **G-TRACE** | every constant and every borrowed semantic back to the line it came from, VERBATIM — the band is the SHIPPED `whetherEyeDecision`'s `perceived.pressureBand`, the drill is the SHIPPED `Match.forcedHold` under `c5Hold`, the loss semantics are EK-C0's segment rule, and ⭐ **G-TRACE-WINDOW**: `EK_HOLD_WINDOW_S` equals EK-C0's committed primary window, equals DV-C0's committed primary, and is a member of the #218 family; ⭐ **G-TRACE-BANDS**: `EK_HOLD_BANDS` equals the certified table's own `pressureBands` cut count + 1 and the census's own band-key count — all READ from those artifacts, never typed | HARD |
| **G-PINS** | the §PINS inventory's machine-checkable rows recomputed, incl. `whetherEye.ts` / `deliveryAccountBook.ts` / `deliveryValueSeat.ts` byte-untouched and **zero test files edited** | HARD |
| **G-SEED** | seed-block disjointness proved in-probe for every interval this stage consumes, against the COMPLETE consumed ledger incl. EK-C0's and EK-C0b's blocks | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests | HARD |
| **G-SUITE** | FULL `npm test` green + `tsc --noEmit` clean. (Load-induced timeout flakes are reproduced/disclosed per the PTP-T0 disposition) | HARD |
| ⭐ **REPORTED** | **THE DOSED-DRILL SMOKE**: the door armed to LEARN in the drill world (the veto shut, so the world is the armed-neutral one), the books filled over a declared block of matches, and the filled books' rates published **beside EK-C0's census table** as a sanity read. No control, no CI, **no ANSWER**; divergence is REPORTED, never fixed | REPORTED |

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any src diff outside the
seam path, any rng draw on the dormant path, any constant appearing in the veto, or **any
existing test breaking** (a STOP-and-report, never a test edit).

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| everything consumed through EK-C0b | the probe's `CONSUMED` table (inherited in full) | prior |
| **EK-T0 receipts (this stage)** | **12,450,000 – 12,450,011** (12 seeds × the arm set; ⭐ the G-CROSS matrix re-uses the FIRST 2 — **no new block**) | **CONSUMED here** |
| **EK-T0 label / book / veto / reset / rng reads** | **12,450,020 – 12,450,029** | **CONSUMED here** |
| **EK-T0 REPORTED dosed-drill smoke** | **12,450,100 – 12,450,119** | **CONSUMED here** |
| EK-T0 test-file seeds (not a battery) | 12,450,900 – 12,450,911 | consumed here |
| free above | 12,450,012 – 12,450,019 · 12,450,030 – 12,450,099 · 12,450,120 – 12,450,899 · 12,450,912 + | available to EK-T1 |

Disjointness is computed **in-probe** for every interval separately, not asserted here.

**STATS**: this stage runs **no bootstrap and draws no stats stream at all** — the identity
round form. The ≥ 109,000 floor set by #261.4 is therefore **NOT DRAWN**, and is said so rather
than reserved unused. EK-T1 opens at 109,000 unchanged.

## §ROAD B — nothing ships

`ekHoldLearn` and `ekHoldVeto` are **OFF in every production path** — hard `false` defaults,
absent from `a4World.ts` and from all three play-test worlds, absent from every League's
`matchFlags` unless a probe sets them explicitly — and even ARMED they change nothing while the
book is empty or one-banded (G-EMPTY), and **nothing at all without `whetherEye`, which is null
in every shipped path**. No gene is added; nothing is serialized; no franchise genome is ever
written (G-NOLAMARCK). **Nothing about the game the user plays changes in this commit.** The
seam exists so EK-T1 can run the convergence exam.

**Road B statement**: fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **must not move.**

## §NON-CLAIMS

EK-T0 claims **no** football effect and **no** learning result. ⭐⭐ **It does not claim any team
learns the RIGHT hold map** — that is EK-T1's registration, scored against EK-C0's measured
shape (`free > pressed > mid`); a wrong book is legal and is STYLE (#247). It does not give any
team either census's table (G-NOTABLE), does not re-cut the certified counterfactual table or
its exams, does not carry learning across a season boundary or into a genome (G-RESET /
G-NOLAMARCK), adds **no** per-player book, **no** stale/support-axis belief, **no** coach,
opponent or imitation channel (contract §4's named later slices), and discharges **none** of the
#248 debts by itself. The REPORTED smoke is an uncontrolled descriptive reading and adjudicates
nothing. It cannot authorize EK-T1; only the commander can (#203).

---

## §RESULT — the gates run

*(filled in from the committed artifact after the receipts ran; every number here is quoted FROM
`docs/world-model/data/ek-t0-hold-belief-seam.json`, which is recomputed by
`EKT0_MODE=full npx tsx scripts/probes/ek-t0-hold-belief-seam.ts` — the doc never carries
evidence the artifact does not.)*

Tests: [`../../tests/ekHoldBelief.test.ts`](../../tests/ekHoldBelief.test.ts) — **24 pins**
(24 `it()` blocks). Receipts:
[`../../scripts/probes/ek-t0-hold-belief-seam.ts`](../../scripts/probes/ek-t0-hold-belief-seam.ts),
artifact [`data/ek-t0-hold-belief-seam.json`](data/ek-t0-hold-belief-seam.json).

**12 seeds × the arm set × BOTH world shapes, block 12,450,000–011 · 16-cell G-CROSS matrix on
the first 4 · 22/22 probe gates + G-SUITE = 23/23 HARD gates PASS** (hand-counted against the frozen
§GATES list, which carries 23 HARD rows), `resultSha256`
`b08c0c2d…e05a`, G-DET digest `b9c5e7d8…b346` twice,
68 s wall.

### Gate table

| gate | result | evidence |
| --- | --- | --- |
| `gDet` | **PASS** | digest `b9c5e7d8e57da516…` on both runs |
| `gIdent` | **PASS** | 3/3 league seeds identical: 1337 `57b0bdab…` · 20260728 `c6e319a4…` · 424242 `45d98c74…`, all recomputed in-process |
| `xFpProd` | **PASS** | the 1337 row IS `57b0bdab…c673` |
| `gOff` | **PASS** | 12/12 seeds × BOTH world shapes — flags absent ≡ flags false |
| ⭐ `gBorn` | **PASS** | 12/12 seeds × both shapes — armed to LEARN ALONE ≡ off, **with the machinery live**: **558** labels closed in the drill world (29 takes + 529 drill holds) and ≥ 5 of 6 book cells filled on every seed, and the world byte-identical anyway. In BARE production the same arm closes **0** labels — no seat, no band, no hold (the honest blast radius, measured) |
| ⭐⭐ `gEmpty` | **PASS** | structural 6/6 (empty ⇒ `null` ⇒ declines nothing · a ONE-BAND book serves a belief but declines nothing) · PREFIX 6/6 seeds: the first veto lands at tick 14869 / 9652 and the first divergence NEVER precedes it (4/6 seeds never diverge at all inside a 240 s match) |
| ⭐⭐ `gLabel` | **PASS** | **0 mismatches** over 12 seeds × 2 teams × 3 bands × 2 quantities (144 cells) against the independent EK-C0-semantics re-labelling — on **558 counted holds, 579 possession losses, 420 punished**. MUTANTS (coverage set stated, each RE-INVOKING the comparison): `lossNeverCloses` 33 mismatches / 6 seeds · `windowS=0` 33 mismatches / 6 seeds · `deadBallIsLoss` 16 mismatches / 6 seeds · `loserIsEitherTeam` 5 mismatches / 4 seeds — four conjuncts, four live mutants |
| ⭐ `gBand` | **PASS** | every counted hold's band lag is **0** ticks measured (the rule admits ≤ 1; the head-of-step capture reads the tick the seat placed on) — 558 counted holds against 2,355 seat placements — and the REFUSALS are published, not hidden: **110 stale + 24 unseen** drill doses declined a band, the widest refused staleness being **6,168 ticks** (the freshness rule earning its keep) |
| `gBook` | **PASS** | 7/7 — the marginal re-derived on a 500-event hand-counted stream, counts exact, `punished ≤ holds`, `total` = the sum, width `EK_HOLD_BANDS`, the zero constant on an unheld band, an out-of-range band ignored |
| ⭐⭐ `gVeto` | **PASS** | the sweep is EXACT on **1,000** hand-built books × 3 bands against an independent float re-derivation (0 mismatches) · empty / one-band / tie decline NOTHING · the worst band declines and the best does not · out-of-range safe · ⭐ **NO SUBSIDY**: every commitment in every armed arm sits in a `reachesZero` cell of the injected table · MUTANTS: `tie flips` 369 · `cross-band guard dropped` 18 · `reference is the BEST other band` 174 — three live. ⚠ **REPORTED NOT LIVE**: `reference is the WHOLE book (algebraically identical — NOT a distinct conjunct)` flips **0** — the whole-book reference is the SAME predicate algebraically, so it is not a conjunct and is not counted as one |
| ⭐ `gReset` | **PASS** | 7/7 — an unarmed League allocates nothing; an armed one allocates per franchise and hands the SAME objects to its fixtures (6 fixtures walked); a drill match sharing those books fills them (56 labels); after `finishSeason()` every cell is 0, every `beliefVector()` is `null` and every band declines nothing again |
| `gBite` | **PASS** | 2/6 prefix seeds DIVERGE, and only once a veto has fired (⚠ divergence, never a target flip — #250.3 inherited) |
| ⭐⭐ `gCross` | **PASS** | **16 cells × 4 seeds**. The IDENTITY claims hold on EVERY seed (DORMANT-ALL · (A) learning armed beside the armed seat and the dosed drill ≡ those alone · (B) the veto door armed ALONE is inert). The BITE claims are non-vacuity claims over the seed SET and every one fires: interaction 1/4 · ⭐ discrimination (a VETOED world ≠ a SEAT-OFF world) 1/4 · the seat bites 2/4 · the drill bites 4/4 |
| ⭐⭐ `gNotable` | **PASS** | **948** rate-valued needles from BOTH hold censuses AND the certified table → **899** searchable forms — **0** value hits in `src/**`, **0** artifact/schema-name hits, **0** loader/doc-path hits in executable seam source; the CONTROL NEEDLE was FOUND. Coverage stated: **1512** forms excluded by the DECLARED floor (fewer than three decimals — they collide with ordinary engine constants by arithmetic accident) |
| ⭐ `gEpi` | **PASS** | the book module's import list is **EMPTY** (zero import statements) — 0 of 15 forbidden names in its executable source, and every event kind the §LAW names exists |
| ⭐ `gNoLamarck` | **PASS** | 4/4 — no franchise or match genome carries a hold belief (this seam writes NO genome field at all), the save JSON carries no book, no belief and no flag, and `GENE_KEYS` gains nothing |
| `gRng` | **PASS** | the armed-to-learn drill stream is identical to the unarmed drill arm at every step; the ledger driven directly over 300 events left the match rng at `452462102 → 452462102` |
| `gHygiene` | **PASS** | 9/9 (both flags hard false · absent from `a4World` · fresh Match off · League match off · an unarmed League allocates no book · no env door · no new gene key · never serialized · ⭐ the probe's env surface is WHITELIST-OR-REFUSE) |
| `gFork` | **PASS** | **1** ledger fork · **1** season fork · **1** veto fork · **1** veto read at the seat · 5 brain seam references (band placement + take) · **1** Match drill capture · `type: 'ShieldHold'` still **2×** in `PlayerBrain.ts` · the seat's own fork still **1×** · **72** src occurrences classed, **0 unclassified** |
| `gTrace` | **PASS** | 9/9 — and ⭐ **G-TRACE-WINDOW**: `EK_HOLD_WINDOW_S = 10` = EK-C0's committed `frozenDesign.windows.primaryWindowS` = DV-C0's committed primary = a member of the GGC census's committed family `[5, 10]`; ⭐ **G-TRACE-BANDS**: `EK_HOLD_BANDS = 3` = the certified table's own two `pressureBands` cuts + 1 = EK-C0's own band count — all READ from those artifacts |
| `gPins` | **PASS** | 7/7 — ⭐ `whetherEye.ts` byte-untouched (`git diff --stat` empty), and so are `deliveryAccountBook.ts`, `deliveryValueSeat.ts`, `perceptionSnapshot.ts` and `a4World.ts`; the DV fork pin intact; **zero test files edited** (the only `tests/**` change is the new `ekHoldBelief.test.ts`) |
| `gSeed` | **PASS** | 4/4 intervals disjoint from the complete ledger (64 prior blocks, incl. EK-C0's and EK-C0b's), and the blocks are ordered |
| `G-SUITE` | **PASS** (the PTP-T0 disposition: pre-existing flakes disclosed) | `tsc --noEmit` clean · see §CHECKS |

### ⭐⭐ REPORTED — THE DOSED-DRILL SMOKE (the sanity read, not a gate)

The door armed to **LEARN ALONE** over **20 drill-world matches** (block
12,450,100–119); the veto door shut, so **the world is byte-identical to the armed-neutral
world on all 20** (measured, `worldIdenticalToOff: true`). One pooled two-team book:

| perceived band | book holds | book punished | **book rate** | EK-C0 census rate | census moments |
|---|---:|---:|---:|---:|---:|
| ⭐ **free** | 156 | 119 | **76.28 %** | 79.41 % | 272 |
| mid | 110 | 87 | **79.09 %** | 69.47 % | 2,319 |
| pressed | 542 | 426 | **78.60 %** | 74.83 % | 8,678 |
| **ALL BANDS** | 808 | 632 | **78.22 %** | 73.84 % | 11,269 |

**Holds per team-match: 20.2** (33 live takes + 775 drill holds banked; **232**
further drill doses were REFUSED for want of a fresh band and are counted, not counted in).

⚠ **DESCRIPTIVE ONLY — 20 matches, one pooled book, no control, no CI, no verdict (#203), and it
is NOT the registration** (that is EK-T1's, on per-team books). ⭐ **THE TWO DIVERGENCES WORTH
REPORTING (not fixing)**: (1) the pooled book reads **HIGH** against the census overall
(78.22 % vs 73.84 %; mid +9.6 pp and pressed +3.8 pp, free −3.1 pp) — the drill population is not the census's: the census dosed on
paired CLONES at spaced moments, this drill holds the ball IN the live trajectory at a tempo of
its own, and a real hold changes what follows it; (2) ⭐⭐ **the pooled book's ORDERING is
`mid > pressed > free`, NOT the census's `free > pressed > mid`** — the free band's book rate
(76.28 %) sits BELOW its census rate (79.41 %) while mid sits far above.
This is exactly the kind of divergence #203 says to REPORT: it is one pooled 20-match book
against an 11,269-moment census, it mixes takes with drills, and the free band is the rare one
(156 of 808 holds here). **Whether a per-team book grown at exam length recovers the measured
shape is EK-T1's question, and this stage neither answers it nor repairs anything toward it.**

### §CHECKS

* `npx tsc --noEmit` — clean.
* `npm test` — **1,384 of 1,385 green across 136 files** (24 new pins; **no test file edited**).
  ⚠ The single red is `formationEvolution.test.ts` — `Test timed out in 180000ms`, never an
  assertion — and it was reproduced GREEN ALONE on this same tree at **171.4 s** against that
  180 s limit. It is the flake DV-T2-T0's own §CHECKS records on the pre-change tree (159 s
  there, same knife-edge); the PTP-T0 disposition applies and it is disclosed, not excused.
* The seam's own suite alone: **24/24 green** in 2.4 s.
* `npm run fingerprint` — unchanged (recomputed in-probe as G-IDENT / X-FP-PROD).


### §DEV — the deviations, declared

1. ⭐⭐ **THE DRILL CAPTURE LIVES IN `Match.ekHoldObserve`, NOT ON THE BRAIN'S HOLD BRANCH.**
   The first build captured it on the C5 early-return branch; the smoke-scale preflight then
   MEASURED that the brain only re-decides every `AI_INTERVAL`, so the band it could offer was
   up to a decision interval — in practice thousands of ticks — stale. The commitment is public
   state, so `Match` captures it at the head of the very tick the hold starts, mirroring that
   branch's own public conditions (the C5 door, not a keeper, not sent off, not the restart
   taker). One touch point FEWER in the brain, and a band lag of ≤ 1 tick by construction.
2. ⭐⭐ **THE FRESHNESS RULE WAS TIGHTENED BEFORE THE FROZEN RUN, AND THAT IS DECLARED.** §LAW's
   first draft banded a drill hold by the seat's *most recent* placement for that body. The
   same preflight measured that placement to be up to **3,696 ticks** old. A band that old is
   not the band at the decision, so the rule became: the placement must be the decision this
   drill displaced, or the hold is REFUSED. The refusals are counted, split (`unseen` vs
   `stale`) and published — this is the EK-C0b idiom (a stage's own gates catching real
   instrument faults at smoke scale, before the frozen run), not a post-hoc adjustment.
3. **THE DRILL VENUE IS THE PROBE'S, AND IT IS TWO-PHASE.** The driver ARMS at a decision moment
   and DOSES on the next tick; its cadence is `HOLD_K_TICKS + MOMENT_SPACING`, derived from
   EK-C0's own two committed constants (a dose may only follow the previous hold's END by the
   census's own moment spacing). It must exceed the hold length, because a body still under a
   drill never runs the seat at all — the first build dosed at the census's bare 30-tick spacing
   and produced a world in which the seat never once ran.
4. **G-RESET FILLS THROUGH A DRILL MATCH THAT SHARES THE LEAGUE'S OWN BOOKS** (§LAW sharpening
   5). No League world arms `whetherEye` or doses `forcedHold`, so an armed League season's
   books legitimately stay EMPTY; the gate therefore measures allocation, object identity with
   the fixtures, filling through a drill match on those very objects, and the wipe.
5. **G-CROSS'S BITE CLAIMS ARE SCORED OVER THE SEED SET, ITS IDENTITY CLAIMS PER SEED.** A 240 s
   match need not contain a licensed take at all (EK-C0 measured ≈ 4 per match, and the drill
   occupies the holder besides), so requiring the interaction to bite on EVERY seed would gate
   on sampling, not on mechanism. Declared ex ante in the gate row; the per-seed counts are
   published.
6. ⚠ **ONE VETO MUTANT IS REPORTED AS NOT LIVE**: a reference pooled over the WHOLE book instead
   of the OTHER bands is algebraically the SAME predicate, so it cannot be a distinct conjunct.
   It was built, run and reported rather than folded into the live-mutant claim (#256.2's
   coverage discipline, applied to my own gate).
7. **G-NOTABLE EXCLUDES FORMS WITH FEWER THAN THREE DECIMALS** by a declared floor. A
   two-decimal form of a measured rate collides with ordinary engine constants by arithmetic
   accident; searching it would make the gate noise instead of evidence. The excluded count is
   published beside the gate.
8. **THERE IS NO GENE** — a deviation from the DV-T2-T0 template, which wrote a banked gene. The
   veto reads the BOOK at the decision site, so the Lamarck channel is closed by construction
   rather than by de-aliasing; G-NOLAMARCK measures the absence rather than a mitigation.
9. **CENSORED ⇒ UNPUNISHED** (§LAW sharpening 3): a label still open at the whistle closes
   unpunished, which can only push a short book DOWN.
10. **`MatchConfig` GAINS A THIRD KEY** (`ekHoldBooks`) beside the two booleans, because M-EK.2's
    book is the SEASON's and a per-match object could not be one.
11. **THE SMOKE POOLS BOTH TEAMS** (one table, not two), so it is a plumbing read and not the
    registration's per-team predicate.

---

## §COMMANDER CORRECTIONS OF RECORD (#262.2 — from the independent verify; no gate moves)

1. ⚠ **G-VETO's NO-SUBSIDY conjunct is MEASURED in the learn-only arm only**, while the gate
   row, §LAW and the commit message say "every armed arm" — the claim is scoped of record to
   the measured arm; the property itself holds STRUCTURALLY (one src call site, inside the
   licensed branch, verified by the code reading) and EK-T1 measures it in its own arms.
2. ⚠ **The whitelist-or-refuse canon has its THIRD-VISIT escape pair**: (a) the rogue scan
   covers only `EKT0_`-prefixed keys — the ENGINE's own env doors (`EDS_BUNDLE`,
   `EDS_TRACE_CHOICE`, …) are neither whitelisted nor refused; (b) `EKT0_OUT` is whitelisted
   but non-override, so a smoke run can overwrite the canonical full artifact with the guard
   silent. CANON UPGRADED AGAIN: the refuse-scan covers the ENGINE's known env doors, and
   every OUTPUT-PATH variable is an override (⇒ preflight).
3. LOWs of record: G-LABEL's re-labelling is independent on the LOSS side only (the hold
   population/band index come from the ledger under test — honest scope); the drill dedupe key
   `gid|untilTick` could collapse distinct commitments ending on one tick (unreachable at the
   declared cadence, noted for any future cadence change); G-EMPTY's PREFIX limb is vacuous on
   no-veto seeds (reported honestly by the doc itself).
