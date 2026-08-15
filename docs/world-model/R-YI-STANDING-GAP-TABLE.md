# R-乙 — THE STANDING GAP TABLE (an institution, not a one-shot)

> Dispatched by **ruling #271.2** under
> [`RULER-COVERAGE-CONTRACT.md`](RULER-COVERAGE-CONTRACT.md) §1 R-乙, which exists
> to close **blind spot 5** of that contract's §0: *"THE GAP TABLE IS NOT AN
> INSTITUTION — the 2026-08-08 'ours vs real' census (#170–#173) was one-shot; no
> arc since has re-run it."*
>
> ⭐⭐ **THIS IS THE FREEZE HALF.** §RESULT is deliberately EMPTY in the freeze
> commit and lands in the results commit (#266.3(c)): the quantity list, the
> measurement semantics, the sizing rule, the seed ledger and the gate set are all
> declared here BEFORE any battery is read.
>
> ⭐⭐ **EPOCH 2 (`post-CB-polish`, ruling #272.4(b)) — THE INSTRUMENT WAS FIXED
> FIRST, THEN RE-RUN.** [§FIX](#fix) is the fix design and it was committed BEFORE
> the second battery was read, exactly as the first freeze was. Everything in this
> document above §RESULT now describes the CORRECTED instrument; epoch 1's rows stay
> in the ledger untouched, with **supersession lines** appended beside them.
> ⚠ Before quoting any epoch-1 row, read
> [§COMMANDER CORRECTIONS](#commander-corrections-of-record-2723-2026-08-15----read-before-quoting-any-row)
> and [§CORRECTED EPOCH-1 READINGS](#corrected-epoch-1).

## §0 WHAT THIS INSTRUMENT IS

Not an A/B and not a gate. A **standing ruler**: ~20 quantities of our football,
measured with the instruments we already have, printed beside the published
real-football references, and **appended to an append-only ledger under a LABEL**.

The deliverable is the **standing-ness**:

* `RYI_LABEL` names an **epoch** (this first run: `post-CB`).
* [`docs/world-model/data/r-yi-gap-table-ledger.jsonl`](data/) gets **one line per
  (label, arm, quantity)** and is **never rewritten**. A label that already has
  rows is a **FATAL refusal**, so an epoch cannot be silently overwritten and two
  runs always diff cleanly.
* The contract's **RE-RUN TRIGGER**: after every arc that lands a world-facing
  mechanism. **Drift between labels is REPORTED to the ruling chain** — this
  instrument adjudicates nothing.

### §0.1 THE THREE COLUMN LAWS

| column | law |
|---|---|
| **OURS** | every row names the **existing** instrument semantics it is measured with, traced to the file that owns them. No row invents a measurement. Where a quantity is not measurable with existing semantics, the row says so **by name** (Q07) rather than improvising. |
| **REAL** | a cited published value with a confidence grade (HIGH/MED/LOW), or the honest word **UNSOURCED**. The **#170-vetted** bands are inherited, and the inheritance is **machine-checked** against the committed tempo-census artifact (`G-REAL-HONEST`) — proven, not asserted. |
| **STATUS** | **`UNADJUDICATED` on every row, always.** Deliberate arcade deviation · gap · unknown is the ruling chain's word (contract §1, §4; #203). The TypeScript type has exactly one member so the executor *cannot* write a verdict. |

<a id="fix"></a>

### §FIX — THE INSTRUMENT CORRECTIONS OF RECORD (#272.4(b), frozen before the second battery)

Each item names the correction of record it discharges (`#272.3→`), and every doc
sentence it rewrote is marked **(fixed of record #272.3→)** in place.

| # | correction | what was built |
|---|---|---|
| 1 | **(i) Q10/Q11 re-keyed** — `touchPasts` counts knocks with ZERO challengers, which cannot beat anybody, so the published take-on population was not the commensurable one | Q10 = `cbLedger.touchPastContested / 2`, Q11 = `cleanBeats / touchPastContested`; the uncontested count, its share, and Q11 on the OLD denominator all published BESIDE as CONTEXT. ⚠ **This needed the round's ONE `src/**` change**: a new **pure additive counter** `cbLedger.touchPastContested`, written once inside `performTouchPast` (unreachable without the CB door) and **read nowhere in `src/**`** — the artifact stores `touchPasts` and `touchPastChallengers` only as SUMS, from which the count of knocks that HAD a challenger cannot be recovered. `G-ADDITIVE-COUNTER` proves the additivity from the engine's own source; `xFpProd` and the all-zero OFF ledger are the backstops; the gate that used to claim "zero src bytes" is renamed **`xSrcCleanTree`** and now says what it proves. |
| 2 | **(ii) one clock convention, BOTH axes every row** | The convention is declared in the frozen registry (`CLOCK_LAW`) and its two numbers are EXTRACTED from `src/**` at run time — `MATCH_DURATION` from `constants.ts` and the display clock's 90 out of the engine's own `Match.minute()` expression — giving **1 sim-second = 22.5 display-seconds**, typed nowhere. Every row declares a `clock` dimension and publishes **convention A and convention B** readings with CIs (Q04's dual-axis form, generalised). The distance table declares **convention A** as its basis and prints B beside every row. |
| 3 | **(iv) bandFidelity** | Every sourced row declares a `bandKind` (`citedPoint` · `derivedPoint` · `citedRange` · `derivedRange` · `inheritedVetted`) and a `bandReceipt`; a new `G-REAL-HONEST.bandFidelity` conjunct machine-checks the stored edges against the row's own citation text (or its receipt's arithmetic). The five invented-width rows **Q09 · Q13 · Q17 · Q18 · Q21** are corrected to their cited points/ranges, and the epoch-1 ledger rows are **SUPERSEDED by new appended lines** (never edited). |
| 4 | **(v) Q20** | The published estimator is now the **per-match mean** §1.1 always described (the epoch-1 ratio-of-sums is kept beside it as context, because they are different functionals), and the "stronger team" label is corrected: it is the **per-match LEADER**, an upward-biased maximum over two random draws — 0.5 is the statistic's floor, not its neutral value. |
| 5 | **(v) gMutants EXACTLY-ONE enforced** | The harness now compares the mutated gate's WHOLE conjunct map against the base map: `live = flipped && othersSurvived`. Three gate designs had to change to be enforceable — `gSemantics` drops the summary conjunct `noMismatch` (the conjunction of its own siblings, unflippable alone), `gCleanInvocation` replaces `preflightNeverCanonical` with a LIVE exercise of the canonical-write guard on a synthetic input, and `gSeedDisjoint.ledgerNonVacuous` drops its block-count clause. An incomplete coverage map now **refuses the run** (exit 3). |
| 6 | **(vi) the LOWs** | Q21's source transcription corrected **56:58 → 56:59** (⇒ the derived point 0.366852), and the denominator mismatch is carried into the reading rather than left in prose: ours divides the ELAPSED pause-inclusive clock (≈4.7 % longer than the nominal 240 s), so `deadShareOnNominalClock` is published and is what the distance table reads. |

### §0.2 WHAT IS NEW SINCE #170–#173

* **The take-on rows (Q10, Q11) are newly measurable.** In bare production a
  take-on does not exist (R-甲 A7: `performTouchPast` is reachable only through
  `Match.forcedTouchPast`, null in every production path) — so Q10 is
  **declared zero-by-structure** on that arm ex ante. The **CB play world has real
  dribbles**, so both arms are measured and labelled.
* **Nine rows are sourced this round** (Q06 pass completion · Q09 goals · Q11
  take-on success · Q13 cards · Q17/Q18 the margin tail · Q21 the dead-ball share),
  and **eight ship REAL = UNSOURCED** with the search recorded.
* **The #270.2 lesson is a GATE**, not a habit: `G-TRACE.ranOnTheMatchClock`
  proves from a constructed match that the battery ran on the engine's own
  `MATCH_DURATION` (240 sim-seconds = one real match, displayed as 90′). No rate
  in this document sits on a non-match clock. **(fixed of record #272.3→ (ii))**
  the same gate now also proves the DISPLAY clock's own 90 was read out of
  `Match.minute()` and that the A↔B mapping derives from those two traced numbers.

## §NRULE — THE SIZING, FROZEN BEFORE THE SMOKE RAN

```text
N* = min( max( shareTerm, spellTerm, knockTerm ) ↑25 , wallTerm , seedRoom 500 )

shareTerm  = ceil( 0.25 / SE_target² ),  SE_target = 0.025 on a MATCH-LEVEL SHARE
             (Q17–Q19 are Bernoulli at match grain; 0.25 is the worst-case p=0.5
             variance) ⇒ 400.  This term contains no measured input at all and was
             therefore fixed before anything ran.
spellTerm  = ceil( 12,000 open-play spells per arm / spellsPerMatch_binding )
             — #170's own quantile-precision target, scaled to two arms.
knockTerm  = ceil( 1,500 aimed knocks in the CB arm / knocksPerMatch_cb )
             — a take-on success-rate SE of ≈1.3 % at p≈0.5.
wallTerm   = floor( 0.5 h / (ms per match × 2 arms × 2 X-DET) )
seedRoom   = 500 (the band's core allocation)
```

⭐ **The wall term may never bind.** `G-N-DERIVED.wallTermNotBinding` requires
`wallTerm ≥ stepped`, so **no machine timing can move a number inside
`resultSha256`** — the design term `min(stepped, seedRoom)` is what is hashed, and
the wall cap and `ms/match` live in the unhashed envelope. If the cap ever binds,
the gate reds and the round is re-designed rather than silently hashing a stopwatch.

## §SEEDS — booked = walked, exact ledger

| block | seeds | job |
|---|---|---|
| sizing smoke | 12,477,000–024 (25) | the N rule's event rates + `ms/match` |
| core battery | 12,477,100 + N* | the two arms, **shared seeds** (the pairing) |
| G-WORLD read-back | 12,477,900 | arming read back on a never-stepped match |
| ⭐ **DECLARED RE-WALK** | 12,293,000–039 | `G-SEMANTICS-INHERITED`: the #173 census's OWN smoke block, re-walked to prove this probe's spell/touch walker reproduces that instrument **exactly**. A re-walk of a CONSUMED block, declared here; the disjointness predicate is **INVERTED** for it (the CB-C0 `gReproDvc0` precedent). It draws no statistic. |

**(fixed of record #272.3→ / epoch 2)** Band booked by **#272.4(b)**:
**12,479,000–999** (epoch 1's 12,477,000–999 and the CB polish's 12,478,000–999 are
now CONSUMED entries in this probe's own ledger). Blocks: sizing smoke
12,479,000–024 · core 12,479,100 + N* · G-WORLD read-back 12,479,900 · the same
declared re-walk 12,293,000–039. Stats: floor **110,400** (the ruling's), base
**110,600** — 110,400 is the CB-polish round's own published base, so this epoch
takes the next free rung on the 200-step grid. 2,000 resamples (500 for the
quantile triple — a **prefix** of the same matrix, so every interval stays paired).
⭐ The sizing smoke is now **per-epoch** (`…-sizing-smoke-<label>.json`) and
`RYI_LABEL` is REQUIRED in both modes, so an epoch can never size itself off
another epoch's rates.

## §GATES — the set, frozen ex ante (**17** — epoch 2, fixed of record #272.3→)

| gate | what it proves |
|---|---|
| `xDet` | the whole measured core walked TWICE, canonical digests compared; pass B never resumes from the checkpoint (so X-DET *is* the checkpoint's integrity proof) |
| `xSrcCleanTree` | **(RENAMED, fixed of record #272.3→)** `git diff --stat -- src` empty — the working tree's `src` IS the committed engine the battery walked. It is deliberately NO LONGER the claim "this round changed zero src bytes": epoch 2 changed exactly one, the declared additive counter, and `gAdditiveCounter` carries that claim instead. |
| ⭐ `gAdditiveCounter` | **(NEW, #272.4(b))** the round's ONE src change is proven ADDITIVE from the engine's own source: `cbLedger.touchPastContested` is incremented **exactly once** in all of `src/**`, that write is **inside `performTouchPast`** (unreachable without the CB door), it is **read nowhere**, it starts at 0 on a never-stepped match and is still 0 through the whole OFF walk |
| `xFpProd` | the production fingerprint `57b0bdab…c673` re-derived in-process |
| `gTrace` | every constant read out of `src/**` at run time, incl. ⭐ **the battery ran on the real 240 s match clock** |
| `gArming` | the CB arm **is** the entry's arming: `a4MatchFlags(6)` + `armA4World(…, 6)` CALLED, **zero** CB door literals typed in the probe, `cbArmedVersion` reads back 6 on one arm and 0 on the other, and neither League-side fork is requested (so the constructor channel is the same one `League.createMatch` uses) |
| `gSemantics` | ⭐⭐ **the semantics inheritance**: 14 aggregate fields re-walked on the #173 census's own smoke block must match the committed artifact **exactly** |
| `gWorld` | arming + dormancy read back on a never-stepped match, and the OFF ledger stays all-zero through the **full** walk |
| `gSeedDisjoint` | every own block inside the band, mutually disjoint, clear of every consumed range — and the one declared re-walk **must** hit a consumed range (predicate inverted) |
| `gStatsDisjoint` | base ≥ floor, on the grid, ≥200 from every published base, ledger non-vacuous |
| `gCleanInvocation` | no override set ⇒ canonical path; a preflight may never write canonical (**invocation context — excluded from `resultSha256`**) |
| `gNDerived` | ran N = derived N* = the design term, and the wall cap never bound |
| `gNonVacuity` | **at claim grain**: every (arm × quantity) cell has a denominator, except where the row declared that arm zero-by-structure — and every declared structural zero **reads zero** |
| `gRealHonest` | the REAL column's own hygiene: UNSOURCED ⇒ no band, sourced ⇒ a band **and** a URL, every row carries semantics, every row `UNADJUDICATED`, ⭐ **every #170-inherited band equals the committed tempo artifact's own band**, and ⭐⭐ **(NEW, fixed of record #272.3→ (iv)) `bandFidelity`** — every sourced row's band SHAPE matches its own citation: a cited point stored as a point, every width carrying a receipt, edges machine-checked against the stored citation text |
| `gValuesNotImported` | the gated conjunct is **src unchanged this round** (a round that changes no src byte cannot import a constant into a sim value); the needle scan over every band value is **REPORTED, not gated**, because a band edge coinciding with an engine literal is a coincidence, not an import |
| `gLedgerAppend` | the re-run clause **exercised**: the append is accepted, the duplicate-label refusal is fired live on a synthetic input, the row count is arms × quantities, prior lines are preserved, and ⭐ **(NEW)** the **supersessions of record** are appended (arms × corrected rows) while a supersession line is proven NOT to count as a row-set under its label |
| `gMutants` | ⭐⭐ **(ENFORCED, fixed of record #272.3→ (v))** every conjunct of every composite gate RE-INVOKES its own gate function on a mutated input and must flip its own conjunct **AND leave every sibling conjunct of that gate unchanged** (`live = flipped && othersSurvived`, the CB-T1 form). Epoch 1 asserted this and only checked the flip. The coverage map is **machine-derived** from the gate objects (#268.3(a)); an uncovered or stray conjunct now **REFUSES the run** (exit 3) |

## §ENVELOPE — what `resultSha256` covers

`resultSha256` = sha256 over **the quantity list + the frozen design + the
measured core + the invocation-INDEPENDENT gates**, and nothing else. Outside it:
paths, `ms/match`, wall clock, git HEAD, preflight reasons, checkpoint counts, the
ledger path, and the four invocation-dependent gates (`gCleanInvocation`,
`xSrcCleanTree` **(renamed, fixed of record #272.3→)**, `xFpProd`, `gLedgerAppend`).

⭐ **THE CROSS-OUT ACCEPTANCE TEST**: the same measurement written to a different
output path must re-derive the **same** `resultSha256`, byte for byte.

## §1 THE FROZEN QUANTITY LIST

**21 quantities**, frozen in [`scripts/probes/rYiQuantities.ts`](../../scripts/probes/rYiQuantities.ts) **before any battery was read**. That module is the SINGLE SOURCE of this list: this section is printed from it by `scripts/analysis/r-yi-gap-table-result.ts --frozen`, so a band cannot drift between the doc and the instrument (#229.2).

⭐ **THE STATUS COLUMN IS `UNADJUDICATED` ON EVERY ROW AND STAYS THAT WAY.** Deliberate arcade deviation · gap · unknown is the ruling chain's word (contract §1, §4; #203). The type has exactly one member on purpose.

⚠ **Every REAL value is eleven-a-side, full-pitch, 90-minute football.** Ours is 6v6 on a 0.70-scaled pitch over a 240 s match clock. COUNT rows are the least comparable across that gap; DURATION and SHARE rows the most.

| id | the quantity, in football words | unit | clock | REAL | band shape | conf | from | STATUS |
|---|---|---|---|---|---|---|---|---|
| Q01 | how long a team keeps the ball (open-play possession spell, mean) | sim-seconds | duration | 9.6 – 10.4 s | inheritedVetted | MED | #170 B1 | UNADJUDICATED |
| Q02 | the shape of that distribution (spell p25 / median / p75) | sim-seconds | duration | UNSOURCED | none | UNSOURCED | #170 B2 | UNADJUDICATED |
| Q03 | how long a body holds the ball per touch | sim-seconds | duration | 0.8 – 1.3 s (derived centre 0.98 s) | inheritedVetted | LOW | #170 B4 | UNADJUDICATED |
| Q04 | how often the ball changes hands | possession changes per display-minute (both teams) | perTimeRate | 3.0 – 4.5 per display-minute | inheritedVetted | LOW | #170 B5 | UNADJUDICATED |
| Q05 | how many touches a possession is made of | touches per open-play spell | invariant | 2.88 – 5.12 PASSES per sequence (league central ≈3.5–4) | inheritedVetted | MED | #170 B3 | UNADJUDICATED |
| Q06 | how many passes find a team-mate | share of passes completed | invariant | 75.3 % – 88 % (2024-25 team extremes; league centre NOT published in the located source) | citedRange | LOW | sourced this round | UNADJUDICATED |
| Q07 | how much of the passing goes forward | share of passes played forward | invariant | UNSOURCED | none | UNSOURCED | — | UNADJUDICATED |
| Q08 | shots | shots per TEAM per match | perMatchCount | 10 – 14.5 per team per match (WEAK: centre not sourced) | inheritedVetted | LOW | #170 B9 | UNADJUDICATED |
| Q09 | goals | goals per match (both teams) | perMatchCount | 2.82 – 2.88 per match (both edges cited; 2.88 = 2024-25) | citedRange | MED | sourced this round | UNADJUDICATED |
| Q10 | taking a man on (attempts) | CONTESTED take-on attempts per TEAM per match | perMatchCount | UNSOURCED | none | UNSOURCED | — | UNADJUDICATED |
| Q11 | taking a man on (does it come off) | share of CONTESTED take-ons that beat every contesting body | invariant | 40.1 % – 48.4 % (league mean 43.7 %) | citedRange | LOW | sourced this round | UNADJUDICATED |
| Q12 | fouls | fouls per TEAM per match | perMatchCount | 9 – 12 per team per match | inheritedVetted | LOW | #170 B10 | UNADJUDICATED |
| Q13 | cards | yellow cards per match (both teams) | perMatchCount | 4.076 yellows per match (both teams) — a cited POINT, no width | derivedPoint | MED | sourced this round | UNADJUDICATED |
| Q14 | how much of the game is played under pressure (pressing-intensity proxy) | share of open-play first receptions taken with an opponent inside the pressure radius | invariant | UNSOURCED | none | UNSOURCED | #170 B7 | UNADJUDICATED |
| Q15 | aerial duels | aerial duels won per TEAM per match | perMatchCount | UNSOURCED | none | UNSOURCED | — | UNADJUDICATED |
| Q16 | ground duels / ball-winning events | tackles + interceptions per TEAM per match | perMatchCount | UNSOURCED | none | UNSOURCED | — | UNADJUDICATED |
| Q17 | the drama tail — how often a match is drawn | share of matches drawn | invariant | 25.5 % of matches — a cited POINT, no width | citedPoint | LOW | sourced this round | UNADJUDICATED |
| Q18 | the drama tail — how often one goal decides it | share of matches decided by exactly one goal | invariant | 37.5 % of matches — a cited POINT, no width | citedPoint | LOW | sourced this round | UNADJUDICATED |
| Q19 | the drama tail — how often it is a hiding | share of matches with a margin of 3 or more goals | invariant | UNSOURCED | none | UNSOURCED | — | UNADJUDICATED |
| Q20 | how lopsided possession is between the two teams | possession share of the PER-MATCH LEADER (mean over matches) | invariant | UNSOURCED | none | UNSOURCED | — | UNADJUDICATED |
| Q21 | how much of the clock is not football (restarts and dead ball) | share of the match clock with the ball NOT in play | invariant | 36.6852 % of the nominal 90 minutes — a derived POINT, no width | derivedPoint | MED | sourced this round | UNADJUDICATED |

### §1.0 ⭐⭐ THE DECLARED CLOCK CONVENTION (fixed of record #272.3→ (ii))

```text
mapping        displaySecondsPerSimSecond = (displayMinutes × 60) / MATCH_DURATION, both terms EXTRACTED from src at run time (constants.ts `MATCH_DURATION`; the 90 out of the engine's own display-clock expression in `Match.minute()`).
convention A   SIM TIME TAKEN LITERALLY — a sim-second is a second. Durations compare as measured; a per-match COUNT is multiplied by displaySecondsPerSimSecond to become a per-90-real-minutes count; a per-time RATE is read per sim-minute.
convention B   THE DISPLAY CLOCK — our match IS the 90 minutes. Per-match counts compare as measured; a DURATION is multiplied by displaySecondsPerSimSecond; a rate is read per display-minute.
the law        ⭐ EVERY banded row prints BOTH readings, every epoch. The distance table declares ONE basis (convention A) and prints the other beside it, so a cross-row PATTERN can never again be assembled out of two different clocks (the epoch-1 artifact of record).
distance basis A — convention A is the axis the instrument actually measures on (sim-seconds and sim-time rates) and the axis #170's duration bands were vetted against; B is the axis the per-match COUNT rows implicitly used in epoch 1. Neither is "the" truth — that is the point of printing both.
```

### §1.1 OURS — how each row is measured, and whose semantics that is

* **Q01 how long a team keeps the ball (open-play possession spell, mean)** — THE #173 SPELL. A maximal interval of same-owner-TEAM control while phase === "playing", opened at the first tick a body of that team owns the ball, SUSPENDED (not ended) while the ball is loose in play, ended by an opponent establishing ownership / the phase leaving "playing" / full time; duration = (endTick − startTick) · DT so in-spell loose time is INCLUDED (the Opta "sequence" shape). openPlay origin only. Semantics re-derived from `scripts/probes/tempo-census.ts` `censusOne` and PROVEN identical to it by G-SEMANTICS-INHERITED (exact re-walk of that probe's own smoke block).
* **Q02 the shape of that distribution (spell p25 / median / p75)** — the same #173 spell population, pooled across seeds; p25 / median / p75 by the house index form. CI by CLUSTER bootstrap over match seeds (the pooled sample is re-formed inside each resample, so the interval respects the clustering).
* **Q03 how long a body holds the ball per touch** — THE #173 TOUCH. One ownership episode (reception → release): a new `ball.owner.gid` opens it, a change of gid closes it, and it is CLOSED at the phase boundary so no dead-ball time leaks in (#171.1.i). A DURATION — sim-seconds, never rescaled to the 90′ clock.
* **Q04 how often the ball changes hands** — spells whose terminator is `opponentControl`, divided by the ONE rate denominator `match.simTime` (PLAYED sim-seconds — #171.1.ii), then mapped onto the 90′ display clock by × (MATCH_DURATION / 90). ⭐ BOTH axes are emitted (per sim-minute = what the user watches at 1×, per display-minute = the 90′ mapping); the row is READ on the display axis because that is the axis the real band lives on.
* **Q05 how many touches a possession is made of** — ownership episodes counted inside each openPlay-origin spell (#173's `touchesPerPossession`).  
  ⚠ THE COLUMNS COUNT DIFFERENT THINGS. The real band counts PASSES per sequence; ours counts TOUCHES (ownership episodes). A carry adds touches without a pass, so the real band is a LOWER BOUND on the comparable quantity — inherited caveat, #170 B3.
* **Q06 how many passes find a team-mate** — the engine's OWN passive counters: Σ `team.stats.passesCompleted` / Σ `team.stats.passes`, both teams. No pass event is re-derived by this probe.
* **Q07 how much of the passing goes forward** — the engine's OWN counter: Σ `team.stats.passesForward` / Σ `team.stats.passes`. ⚠ `passesForward` is DEFINED by the engine as a pass played ≥2 m toward the opponents' goal (`src/sim/types.ts`), so its complement pools BACKWARD and LATERAL together. Backward vs lateral is NOT SEPARABLE with existing instrument semantics and no semantics are invented here: the pooled complement is published as one number, labelled.
* **Q08 shots** — Σ `team.stats.shots` per match / 2 (the arms are symmetric by construction, so the halving is exact in expectation, not per match — #171.1.iii's scope rule, inherited).
* **Q09 goals** — `match.score[0] + match.score[1]` at full time.
* **Q10 taking a man on (attempts)** — ⭐⭐ RE-KEYED of record #272.3→ (i): `match.cbLedger.touchPastContested` / 2 — aimed knocks that had AT LEAST ONE contesting body inside the engine's own contest radius at the release. Epoch 1 published `touchPasts` / 2, which counts every aimed knock INCLUDING those released into an empty contest radius; those cannot beat anybody, so the row's stated semantics ("an aimed knock past a contesting body") was false for a fifth of its own count and Q11's denominator was not the commensurable take-on population. The uncontested remainder (`touchPasts − touchPastContested`) is published BESIDE this row as CONTEXT, never folded into it. ⚠ THE COUNTER IS THE ROUND'S ONE DECLARED `src/**` CHANGE: a pure additive field, written once inside `performTouchPast` and read NOWHERE in `src/**` (`G-ADDITIVE-COUNTER` proves both from the engine's own source). In BARE PRODUCTION this is STRUCTURALLY ZERO: `performTouchPast` is reachable only through `Match.forcedTouchPast`, which is null in every production path (R-甲 A7, ABSENT). ⚠ `team.stats.dribbles` is NOT this quantity — the engine increments it on every non-recollect capture by an outfielder (`Match.ts` giveBall), so it counts possession GAINS, not take-ons; it is published beside this row as context under its own key and is never compared to the real band.  
  ⭐ DECLARED ZERO-BY-STRUCTURE on: bare.
* **Q11 taking a man on (does it come off)** — ⭐⭐ RE-KEYED of record #272.3→ (i): `cbLedger.touchPastCleanBeats` / `cbLedger.touchPastContested` — knocks that beat EVERY challenger they were aimed past, over the knocks that HAD a challenger. Epoch 1 divided by `touchPasts`, whose uncontested part is structurally incapable of a clean beat (the numerator already requires `challengers > 0`), so the published share was diluted by a population real football does not count as take-ons — and correcting it INVERTS the row's sign against the real band. The per-CHALLENGER form `touchPastBeaten` / `touchPastChallengers` and the uncontested count are published beside it under their own keys. Zero-denominator in bare production, by construction (see Q10).  
  ⭐ DECLARED ZERO-BY-STRUCTURE on: bare.
* **Q12 fouls** — Σ `team.stats.fouls` per match / 2 (the per-team scope rule of Q08).
* **Q13 cards** — Σ `team.stats.yellows` per match, both teams (a second yellow counts here AND as a red, the engine's own convention). Reds are published beside it under their own key.
* **Q14 how much of the game is played under pressure (pressing-intensity proxy)** — ⭐ THE #173 INSTRUMENT, unchanged: among the FIRST reception of each openPlay-origin spell, the share whose nearest-opponent distance at the reception tick is ≤ the substrate's OWN pressure switch `TOUCH_CONTROL_DIST` (src/sim/constants.ts, traced at run time, not typed). Restart/kickoff-origin receptions are set-piece geometry and are EXCLUDED from the headline (#171.1.iv).
* **Q15 aerial duels** — Σ `team.stats.headersWon` per match / 2 — the engine's own aerial-duel-won counter (headed shots, clearances and knockdowns).
* **Q16 ground duels / ball-winning events** — Σ (`team.stats.tackles` + `team.stats.interceptions`) per match / 2. ⭐ In the CB-armed arm the ledger's own duel counters (`armedChallenges`, `geometricMisses`, `recoveries`) are published beside it under their own keys.
* **Q17 the drama tail — how often a match is drawn** — share of walked matches with `score[0] === score[1]` at full time.
* **Q18 the drama tail — how often one goal decides it** — share of walked matches with |score[0] − score[1]| === 1.
* **Q19 the drama tail — how often it is a hiding** — share of walked matches with |score[0] − score[1]| ≥ 3.
* **Q20 how lopsided possession is between the two teams** — ⭐ CORRECTED of record #272.3→ (v): the published estimator is now the one §1.1 always described — the PER-MATCH MEAN. Per match: owned playing-phase ticks by side (summed over that side's spells, the #173 spell walk's own `ownedTicks`), then max(side share) of the two-team total; the headline is the mean of that per-match number over the seed set. Epoch 1 published Σmax / Σtotal (a ratio of sums), which is a DIFFERENT functional — it weights long matches — while the doc described the per-match mean; the ratio-of-sums form is kept beside it as CONTEXT so both remain readable. ⚠ THE LABEL, corrected: this is NOT "the stronger team". It is the per-match LEADER, an upward-biased maximum — two evenly matched teams are two random draws, so E[max share] > 0.5 by construction and 0.5 is the floor of the statistic, not its neutral value. 0.5 = a perfectly even match; 1.0 = one team never lost it.
* **Q21 how much of the clock is not football (restarts and dead ball)** — 1 − (ticks with phase === "playing") / (total stepped ticks). The numerator is the #173 `inPlayTicks`; the denominator is the PAUSE-INCLUSIVE clock (`simTick`), which is the only clock on which a dead-ball SHARE means anything — #173 emitted it as `wallSimSeconds` and used it in no rate, and this row is the one place it has a job. ⭐ ADDED of record #272.3→ (vi): the real value is a share of the NOMINAL 90 while ours divides the ELAPSED clock (≈251 s against a nominal 240 s, ≈4.7 % longer), so the row also publishes `deadShareOnNominalClock` = (elapsed − in-play) / MATCH_DURATION — the like-for-like reading — and the distance table carries THAT correction rather than leaving it in prose.

### §1.2 REAL — the citation behind every band, and every UNSOURCED row

* **Q01** (MED, band shape **inheritedVetted**) — INHERITED #170-vetted band B1 (TEMPO-CENSUS.md §5): Opta / Stats Perform Premier League open-play sequences — 10.4 s mean in 2024-25, 9.6 s in 2025-26. https://theanalyst.com/articles/analysing-premier-league-playing-styles-2024-25 · https://www.premierleague.com/en/news/4426039  
  ⭐ BAND RECEIPT: #170-VETTED BAND B1, inherited wholesale and machine-checked edge-for-edge against the committed tempo-census artifact (docs/world-model/data/tempo-census.json). Its two edges are the two SEASON MEANS the source itself publishes (10.4 s in 2024-25, 9.6 s in 2025-26) — a cited range, not a widening. This round neither re-derives nor re-widens it (fixed of record #272.3→ (iv)).
* **Q02** (UNSOURCED, band shape **none**) — Opta publishes sequence MEANS, not the quantile set; #170 searched and found no public quantile source (B2 = ABSENT) and this round found none either. Our quantiles are reported against NO band — the honest form.
* **Q03** (LOW, band shape **inheritedVetted**) — INHERITED #170-vetted band B4 (DERIVED, arithmetic shown): a player is in possession ≈109 s across a 90′ match (gulfnews, quoting the standard broadcast / 《The Numbers Game》 figure) and is involved in 111 ± 77 on-ball activities per match (PMC3778701) ⇒ 109 / 111 ≈ 0.98 s; widened to 0.8–1.3 s for the dispersion. https://pmc.ncbi.nlm.nih.gov/articles/PMC3778701  
  ⭐ BAND RECEIPT: #170-VETTED BAND B4, inherited wholesale and machine-checked edge-for-edge against the committed tempo-census artifact (docs/world-model/data/tempo-census.json). ⚠ ITS WIDTH IS #170'S: the cited inputs give the single derived centre 0.98 s (109 s in possession / 111 on-ball activities) and #170 widened it to 0.8–1.3 s for dispersion. This round neither re-derives nor re-widens it (fixed of record #272.3→ (iv)).
* **Q04** (LOW, band shape **inheritedVetted**) — INHERITED #170-vetted band B5 (DERIVED from B1 + ball-in-play time, arithmetic shown): the PL ball was in play 56:58 of 90 in 2024-25; at a ≈10 s mean sequence that is ≈342 sequence-ends per match ⇒ 342/90 ≈ 3.8 per display-minute. NOT an independent measurement — it is B1 re-expressed and inherits B1's uncertainty. Ball-in-play source: https://theanalyst.com/articles/premier-league-ball-in-play-are-we-seeing-less-football-2025-26  
  ⭐ BAND RECEIPT: #170-VETTED BAND B5, inherited wholesale and machine-checked edge-for-edge against the committed tempo-census artifact (docs/world-model/data/tempo-census.json). ⚠ ITS WIDTH IS #170'S: the cited inputs give the single derived value ≈3.8 per display-minute (342 sequence-ends / 90) and #170 widened it to 3.0–4.5. This round neither re-derives nor re-widens it (fixed of record #272.3→ (iv)).
* **Q05** (MED, band shape **inheritedVetted**) — INHERITED #170-vetted band B3: Opta PL team-season range 2.88 (lowest) to 5.12 (highest); Man City 5.1, Southampton 4.4 in 2024-25. Same two sources as B1: https://theanalyst.com/articles/analysing-premier-league-playing-styles-2024-25 · https://www.premierleague.com/en/news/4426039  
  ⭐ BAND RECEIPT: #170-VETTED BAND B3, inherited wholesale and machine-checked edge-for-edge against the committed tempo-census artifact (docs/world-model/data/tempo-census.json). Its two edges are the two team-season extremes the source itself publishes (2.88 lowest, 5.12 highest) — a cited range, not a widening. This round neither re-derives nor re-widens it (fixed of record #272.3→ (iv)).
* **Q06** (LOW, band shape **citedRange**) — NEW this round. Premier League 2024-25 team pass-completion extremes: Manchester City 88 % (highest), Nottingham Forest 75.3 % (lowest), via StatMuse pass-completion tables. https://www.statmuse.com/fc/ask/pass-completion-rate-premier-league-by-team — an aggregator, and the band's CENTRE is unsourced ⇒ LOW.
* **Q07** (UNSOURCED, band shape **none**) — Opta records pass direction (forwards / sideways / backwards) as an event attribute, but no league-average SHARE was located in any public source this round (searched: Opta stat definitions, Stats Perform, aggregators). The row ships UNSOURCED rather than with a guessed band.
* **Q08** (LOW, band shape **inheritedVetted**) — INHERITED #170-vetted band B9, labelled WEAK at source: the only team-level datapoint located was Arsenal 14.53 shots/match 2024-25 (StatMuse), among the league LEADERS ⇒ the league mean sits below it. Order-of-magnitude line only. https://www.statmuse.com/fc/ask/premier-league-teams-average-shot-per-game  
  ⭐ BAND RECEIPT: #170-VETTED BAND B9, inherited wholesale and machine-checked edge-for-edge against the committed tempo-census artifact (docs/world-model/data/tempo-census.json). ⚠ ITS WIDTH IS #170'S, and #170 labelled it WEAK at source: one located datapoint (Arsenal 14.53/match, a league leader) and an order-of-magnitude floor of 10. This round neither re-derives nor re-widens it (fixed of record #272.3→ (iv)).
* **Q09** (MED, band shape **citedRange**) — NEW this round. Opta Analyst: each of the four Premier League campaigns from 2021-22 to 2024-25 "averaged at least 2.82 goals per game", and 2024-25 ran at 2.88 after 100 matches. https://theanalyst.com/articles/premier-league-goals-low-stats · https://theanalyst.com/articles/premier-league-2024-25-data-trends-stats ⭐ CORRECTED of record #272.3→ (iv): epoch 1 published the INVENTED band 2.8 – 2.9 around these two cited numbers. Both edges are now the cited numbers themselves.
* **Q10** (UNSOURCED, band shape **none**) — The located source names only the four HIGHEST attempting squads ("all four around the 21 take-on attempts per 90 minute mark", Brighton / Chelsea / Tottenham / West Ham, 2024-25 to 19 Jan 2025, https://fivda.com/2025/01/24/premier-league-top-dribblers-2025/). A league MEAN was not published there or anywhere located, so no band is stated: ≈21 is an upper-tail marker, not a centre.
* **Q11** (LOW, band shape **citedRange**) — NEW this round. Premier League 2024-25 (snapshot 19 Jan 2025): "the average success rate of take-ons across all squads … is 43.7 %"; Manchester City highest at 48.4 %, Leicester lowest at 40.1 %. https://fivda.com/2025/01/24/premier-league-top-dribblers-2025/ — a blog reporting Opta-derived squad figures, mid-season snapshot ⇒ LOW.
* **Q12** (LOW, band shape **inheritedVetted**) — INHERITED #170-vetted band B10, labelled WEAK at source: Arsenal committed 399 fouls in 38 matches in 2024-25 = 10.5/match (StatMuse); one team, one season, band = that value ±1.5. https://www.statmuse.com/fc/ask/premier-league-fouls-team-stats-2024-2025  
  ⭐ BAND RECEIPT: #170-VETTED BAND B10, inherited wholesale and machine-checked edge-for-edge against the committed tempo-census artifact (docs/world-model/data/tempo-census.json). ⚠ ITS WIDTH IS #170'S, and #170 labelled it WEAK at source: one located datapoint (Arsenal 10.5 fouls/match) ±1.5. This round neither re-derives nor re-widens it (fixed of record #272.3→ (iv)).
* **Q13** (MED, band shape **derivedPoint**) — NEW this round, arithmetic shown: 1,549 yellow cards (and 52 reds) across the Premier League 2024-25 season = 380 matches ⇒ 1,549 / 380 = 4.076 yellows and 52 / 380 = 0.137 reds per match. Totals from MyFootballFacts (updated matchday 38); the division is ours. https://www.myfootballfacts.com/premier-league/all-time-premier-league/cards/premier-league-red-and-yellow-cards-2024-25/ ⭐ CORRECTED of record #272.3→ (iv): epoch 1 published the INVENTED band 4.0 – 4.2 around this single derived number. It is now a POINT.  
  ⭐ BAND RECEIPT: DERIVED from two cited season totals, arithmetic in full: 1,549 yellow cards / 380 matches = 4.076315… ⇒ 4.076 yellows per match (both teams). Nothing is widened around it: the publisher states the TOTALS, the division is ours, and a single number divided by a single number is a point, not a band.
* **Q14** (UNSOURCED, band shape **none**) — No real-football pressed-reception share exists in comparable form: the public pressing metrics (PPDA, high turnovers, pressures) are differently defined and are not a share of receptions. #170 reached the same conclusion for the neighbouring quantity (B7 = ABSENT) and read it as an INTERNAL contrast instead. Ours is published against NO band, and its job here is the ARM-TO-ARM and RUN-TO-RUN reading.
* **Q15** (UNSOURCED, band shape **none**) — Searched for a Premier League team-level aerial-duels-per-match figure (Opta/FBref/StatMuse/one-versus-one): every located source gave either individual-player totals or season totals with no matches-played denominator, and FBref's squad miscellaneous table refused automated access (HTTP 403). No credible team-per-match value ⇒ the row ships UNSOURCED rather than with a computed guess.
* **Q16** (UNSOURCED, band shape **none**) — Tackles and interceptions are published per PLAYER almost everywhere and their team-per-match league mean was not located in a citable form this round; the two are also defined differently by different providers (attempted vs won tackles). UNSOURCED rather than a pooled guess.
* **Q17** (LOW, band shape **citedPoint**) — NEW this round: 25.5 % draws across 12,786 Premier League matches (1992 → end of 2024-25). https://sicycle.wordpress.com/2025/11/04/whats-the-most-common-score-in-the-premier-league/ — a blog computing over the full match archive; large sample, weak publisher ⇒ LOW. ⭐ CORRECTED of record #272.3→ (iv): epoch 1 published the INVENTED band 24 % – 27 % around this single cited number. It is now a POINT.
* **Q18** (LOW, band shape **citedPoint**) — NEW this round, same archive computation as Q17: "37.5 % end with a single goal deciding the result" over 12,786 matches. https://sicycle.wordpress.com/2025/11/04/whats-the-most-common-score-in-the-premier-league/ — same publisher, same LOW grade as Q17. ⭐ CORRECTED of record #272.3→ (iv): epoch 1 published the INVENTED band 35 % – 40 % around this single cited number, and that width is exactly what printed "CI overlaps" over a CI that EXCLUDES the cited value.
* **Q19** (UNSOURCED, band shape **none**) — The archive source that gives Q17 and Q18 does NOT state a ≥3-goal share (it states only that ≥5-goal margins are ≈2 % of matches). Its own complement bounds the ≥2-goal share at 100 − 25.5 − 37.5 = 37.0 %, so ≥3 is bounded ABOVE by 37.0 % — a bound, not a band. Published UNSOURCED with the bound stated.
* **Q20** (UNSOURCED, band shape **none**) — Published possession figures are TEAM-SEASON means, not a per-match balance distribution. The season spread is cited as CONTEXT ONLY and is not a band: Nottingham Forest were the only 2024-25 side under 40 % (39.6 %), per Opta Analyst's playing-styles piece. The per-match quantity ours measures has no located published counterpart.
* **Q21** (MED, band shape **derivedPoint**) — NEW this round: the Premier League ball was in play 56 min 59 s on average across 2024-25 (Opta). https://theanalyst.com/articles/premier-league-ball-in-play-are-we-seeing-less-football-2025-26 · ⚠ real matches now ELAPSE well beyond 90 minutes, so measured against elapsed time the real dead share is HIGHER than this; the value is stated on the nominal clock because that is the clock our 240 s maps onto. ⭐ CORRECTED of record #272.3→ (iv) and (vi): epoch 1 transcribed the source as 56:58 (it publishes 56:59) and published the INVENTED band 35 % – 39 % around the single derived number. It is now a POINT on the corrected transcription.  
  ⭐ BAND RECEIPT: DERIVED from ONE cited number, arithmetic in full: ball in play 56 min 59 s = 56 + 59/60 = 56.983333 minutes of the nominal 90 ⇒ dead share = 1 − 56.983333/90 = 0.366852 (36.6852 %). Nothing is widened around it. ⚠ THE DENOMINATOR CAVEAT, carried into the reading and not left in prose (#272.3→ (vi)): this real value is a share of the NOMINAL 90, while ours divides the PAUSE-INCLUSIVE elapsed clock (`simTick`, ≈251 s against a nominal 240 s ⇒ ≈4.7 % longer). The row therefore publishes BOTH our elapsed-clock share and our nominal-clock share, and the nominal-clock one is the like-for-like reading.

### §1.3 CONTEXT ROWS — measured and published, compared to NO band

* `engineDribblesPerTeam` — `team.stats.dribbles` / 2 — possession GAINS, not take-ons (see Q10).
* `takeOnPerChallengerSuccess` — `touchPastBeaten` / `touchPastChallengers` — the per-body form of Q11.
* `allKnocksPerTeam` — ⭐ `cbLedger.touchPasts` / 2 — EVERY aimed knock, contested or not. This is what epoch 1 published as Q10; it is CONTEXT now (fixed of record #272.3→ (i)).
* `uncontestedKnocksPerTeam` — ⭐ (`touchPasts` − `touchPastContested`) / 2 — knocks released into an EMPTY contest radius: real knocks, but structurally incapable of beating anybody, so not part of the take-on population.
* `uncontestedKnockShare` — ⭐ the size of the epoch-1 defect, published every epoch: the share of aimed knocks that had no contesting body.
* `takeOnSuccessAllKnocks` — Q11 on the OLD denominator (`cleanBeats` / `touchPasts`) — kept so the two epochs remain comparable and the re-key's effect is visible.
* `possessionBalanceRatioOfSums` — Q20 on the OLD estimator (Σmax / Σtotal) — kept beside the per-match mean (fixed of record #272.3→ (v)).
* `deadShareOnNominalClock` — ⭐ Q21 re-based on the NOMINAL match clock (`MATCH_DURATION`) instead of the elapsed pause-inclusive clock — the like-for-like reading against a share of the nominal 90 (fixed of record #272.3→ (vi)).
* `redsPerMatch` — `team.stats.reds`, both teams — beside Q13.
* `turnoversPerSimMin` — Q04 on the WATCHED clock (the other honest axis).
* `completedPassesPerSpell` — completed passes per open-play spell — the nearest like-for-like to the Q05 band.
* `armedChallengesPerTeam` — `cbLedger.armedChallenges` / 2 — beside Q16, CB arm only.
* `geometricMissesPerTeam` — `cbLedger.geometricMisses` / 2 — beside Q16, CB arm only.
* `recoveriesPerTeam` — `cbLedger.recoveries` / 2 — beaten lunges paying the armed price.
* `meanRecoveryS` — `recoverySeconds` / `recoveries` — how long a beaten defender is out.
* `offsidesPerTeam` — `team.stats.offsides` / 2 — Laws texture, no band in this version.
* `cornersPerTeam` — `team.stats.corners` / 2 — Laws texture, no band in this version.
* `inPlaySecondsPerMatch` — the numerator of Q21, published so the share re-derives.
* `simSecondsPerMatch` — the ONE rate denominator (`match.simTime`), published so every rate re-derives.
* `wallSecondsPerMatch` — `simTick · DT` — the pause-inclusive clock, Q21's denominator.

### §1.4 THE ARMS

* **bare** — BARE PRODUCTION — `new Match({ seed, teamA, teamB })`. No flag, no eye, no gene, no book. Byte-for-byte the #173 census's own prod-arm constructor.
* **cb** — THE CB PLAY WORLD, ARMED EXACTLY AS THE ENTRY ARMS IT — `a4MatchFlags(6)` spread at construction (the same channel `League.createMatch` uses: it spreads `...this.matchFlags` into `new Match`) and `armA4World(match, null, 6)` after it. Both calls are CALLS into `src/game/a4World.ts`: no flag name and no dose is typed in the probe (G-ARMING-FROM-ENTRY proves it from the probe's own source).

## §RESULT — EPOCH 1 `post-CB` (AS PUBLISHED, 2026-08-14)

⚠⚠ **THIS SECTION IS THE EPOCH-1 ARTIFACT AS IT WAS PUBLISHED, AND IT IS KEPT
UNEDITED ON PURPOSE.** Four of its readings do not stand: read
[§COMMANDER CORRECTIONS](#commander-corrections-of-record-2723-2026-08-15----read-before-quoting-any-row)
and then [§CORRECTED EPOCH-1 READINGS](#corrected-epoch-1) — the corrected numbers
live there, and the ledger carries supersession lines. Its band column is epoch 1's;
the current bands are in [§1](#1-the-frozen-quantity-list).

**epoch label `post-CB` · 400 seeds × 2 arms · block 12,477,100–12,477,499 · 16/16 gates PASS**, `resultSha256` `9a5e7c43…e896`. Every number below is printed by `scripts/analysis/r-yi-gap-table-result.ts` from the committed artifact; none is typed (#229.2).

### The run

```text
match clock       240 sim-seconds ⇔ 90′  (2.666667 sim-s per display-minute)
bare              241.9207 played sim-seconds per match
cb                241.7583 played sim-seconds per match
pressure radius   4.2 m   (TOUCH_CONTROL_DIST, src/sim/constants.ts:315)
first-touch win.  0.28 s   (p.firstTouchWindow, src/sim/Match.ts:2483)
estimator         cluster bootstrap by match seed (#20), 2000 resamples (500 for the quantile triple, a PREFIX of the same matrix so every interval is paired), percentile 95 % CI, ratio-of-sums; stats base 110200.
N rule            N*(design) = min( max(400, 327, 77) ↑25 = 400, seedRoom=500 ) = 400   [no timing enters this line]
                  binding precision term: match-level share
seeds             band 12,477,000–12,477,999 · smoke 12,477,000–12,477,024 · core 12,477,100–12,477,499 · G-WORLD 12,477,900 · declared re-walk 12,293,000–12,293,039
stats base        110,200
ledger            docs/world-model/data/r-yi-gap-table-ledger.jsonl  (label post-CB)
```

### ⭐ THE GAP TABLE

| id | quantity | OURS (bare) | OURS (CB-armed) | REAL | conf | STATUS |
|---|---|---|---|---|---|---|
| Q01 | how long a team keeps the ball (open-play possession spell, mean) | 4.2950 [4.2029, 4.3874] | 3.8369 [3.7522, 3.9282] | 9.6 – 10.4 s | MED | UNADJUDICATED |
| Q02 | the shape of that distribution (spell p25 / median / p75) | 2.9000 [2.8167, 2.9833] | 2.6000 [2.5333, 2.6667] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q03 | how long a body holds the ball per touch | 0.6243 [0.6027, 0.6457] | 0.5967 [0.5763, 0.6188] | 0.8 – 1.3 s (derived centre 0.98 s) | LOW | UNADJUDICATED |
| Q04 | how often the ball changes hands | 0.3921 [0.3839, 0.4007] | 0.4290 [0.4183, 0.4394] | 3.0 – 4.5 per display-minute | LOW | UNADJUDICATED |
| Q05 | how many touches a possession is made of | 2.5236 [2.4818, 2.5656] | 2.3969 [2.3649, 2.4294] | 2.88 – 5.12 PASSES per sequence (league central ≈3.5–4) | MED | UNADJUDICATED |
| Q06 | how many passes find a team-mate | 0.7375 [0.7327, 0.7423] | 0.6642 [0.6593, 0.6693] | 75.3 % – 88 % (2024-25 team extremes; league centre NOT published in the located source) | LOW | UNADJUDICATED |
| Q07 | how much of the passing goes forward | 0.5724 [0.5668, 0.5782] | 0.5790 [0.5726, 0.5851] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q08 | shots | 6.7038 [6.5175, 6.9037] | 5.8375 [5.6238, 6.0500] | 10 – 14.5 per team per match (WEAK: centre not sourced) | LOW | UNADJUDICATED |
| Q09 | goals | 2.2025 [2.0400, 2.3650] | 2.2975 [2.1625, 2.4400] | 2.8 – 2.9 per match | MED | UNADJUDICATED |
| Q10 | taking a man on (attempts) | 0.0000 [0.0000, 0.0000] | 10.7713 [10.1350, 11.4275] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q11 | taking a man on (does it come off) | n/a [n/a, n/a] | 0.3868 [0.3752, 0.3977] | 40.1 % – 48.4 % (league mean 43.7 %) | LOW | UNADJUDICATED |
| Q12 | fouls | 1.9900 [1.8887, 2.0925] | 3.2088 [3.0775, 3.3413] | 9 – 12 per team per match | LOW | UNADJUDICATED |
| Q13 | cards | 1.2075 [1.1025, 1.3150] | 1.9950 [1.8550, 2.1450] | ≈4.08 yellows per match (both teams) | MED | UNADJUDICATED |
| Q14 | how much of the game is played under pressure (pressing-intensity proxy) | 0.8053 [0.7978, 0.8124] | 0.8424 [0.8347, 0.8495] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q15 | aerial duels | 4.2125 [3.8850, 4.5762] | 3.1975 [2.9175, 3.4762] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q16 | ground duels / ball-winning events | 17.7125 [17.3125, 18.1487] | 15.2662 [14.8812, 15.6263] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q17 | the drama tail — how often a match is drawn | 0.3000 [0.2550, 0.3450] | 0.2625 [0.2200, 0.3050] | ≈25.5 % of matches | LOW | UNADJUDICATED |
| Q18 | the drama tail — how often one goal decides it | 0.3700 [0.3225, 0.4175] | 0.4250 [0.3775, 0.4725] | ≈37.5 % of matches | LOW | UNADJUDICATED |
| Q19 | the drama tail — how often it is a hiding | 0.1375 [0.1050, 0.1725] | 0.1450 [0.1150, 0.1800] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q20 | how lopsided possession is between the two teams | 0.6073 [0.5984, 0.6162] | 0.6066 [0.5974, 0.6161] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q21 | how much of the clock is not football (restarts and dead ball) | 0.1390 [0.1353, 0.1425] | 0.1608 [0.1569, 0.1643] | ≈36.7 % of the nominal 90 minutes | MED | UNADJUDICATED |

Units are §1's; every interval is a 95 % cluster-bootstrap percentile CI over match seeds.

### DISTANCE FROM THE REAL BAND — mechanical, no verdict

For every row that HAS a band: where our point estimate sits relative to the nearer band edge. `inside` = the CI overlaps the band. A factor is printed as ours ÷ edge, so `0.42×` reads "ours is 0.42 of the nearest published edge". ⚠ This is arithmetic on two columns that count the same football quantity in two different games (11v11 90′ vs 6v6 240 s); it is NOT a verdict, and the STATUS column stays `UNADJUDICATED`.

| id | quantity | OURS (bare) | OURS (CB) | band | bare vs band | CB vs band |
|---|---|---|---|---|---|---|
| Q01 | how long a team keeps the ball (open-play possession spell, mean) | 4.2950 | 3.8369 | 9.6000–10.4000 | 0.45× the LOW edge | 0.40× the LOW edge |
| Q03 | how long a body holds the ball per touch | 0.6243 | 0.5967 | 0.8000–1.3000 | 0.78× the LOW edge | 0.75× the LOW edge |
| Q04 | how often the ball changes hands | 0.3921 | 0.4290 | 3.0000–4.5000 | 0.13× the LOW edge | 0.14× the LOW edge |
| Q05 | how many touches a possession is made of | 2.5236 | 2.3969 | 2.8800–5.1200 | 0.88× the LOW edge | 0.83× the LOW edge |
| Q06 | how many passes find a team-mate | 0.7375 | 0.6642 | 0.7530–0.8800 | 0.98× the LOW edge | 0.88× the LOW edge |
| Q08 | shots | 6.7038 | 5.8375 | 10.0000–14.5000 | 0.67× the LOW edge | 0.58× the LOW edge |
| Q09 | goals | 2.2025 | 2.2975 | 2.8000–2.9000 | 0.79× the LOW edge | 0.82× the LOW edge |
| Q11 | taking a man on (does it come off) | n/a | 0.3868 | 0.4010–0.4840 | n/a | 0.96× the LOW edge |
| Q12 | fouls | 1.9900 | 3.2088 | 9.0000–12.0000 | 0.22× the LOW edge | 0.36× the LOW edge |
| Q13 | cards | 1.2075 | 1.9950 | 4.0000–4.2000 | 0.30× the LOW edge | 0.50× the LOW edge |
| Q17 | the drama tail — how often a match is drawn | 0.3000 | 0.2625 | 0.2400–0.2700 | CI overlaps | INSIDE |
| Q18 | the drama tail — how often one goal decides it | 0.3700 | 0.4250 | 0.3500–0.4000 | INSIDE | CI overlaps |
| Q21 | how much of the clock is not football (restarts and dead ball) | 0.1390 | 0.1608 | 0.3500–0.3900 | 0.40× the LOW edge | 0.46× the LOW edge |

### The spell-length shape (Q02, no real band exists)

```text
bare   p25 1.2500 [1.2167, 1.2833]   median 2.9000 [2.8167, 2.9833]   p75 5.8167 [5.6833, 5.9500]   (n=14,215 spells, 500 resamples)
cb     p25 1.2667 [1.2333, 1.2833]   median 2.6000 [2.5333, 2.6667]   p75 5.2000 [5.0667, 5.3500]   (n=15,558 spells, 500 resamples)
```

### Both honest axes on the churn row (Q04)

```text
bare   per sim-second 0.147032   per sim-minute 8.8219   per display-minute 0.3921   (× 2.666667)
cb     per sim-second 0.160884   per sim-minute 9.6530   per display-minute 0.4290   (× 2.666667)
```

### CONTEXT rows (measured, compared to NO band)

```text
engineDribblesPerTeam          bare 55.7775                cb 53.3663
takeOnPerChallengerSuccess     bare n/a [n/a, n/a]         cb 0.6524 [0.6393, 0.6650]
redsPerMatch                   bare 0.0650                 cb 0.1700
turnoversPerSimMin             bare 8.8219                 cb 9.6530
completedPassesPerSpell        bare 2.1383                 cb 1.5816
armedChallengesPerTeam         bare 0.0000                 cb 17.6250
geometricMissesPerTeam         bare 0.0000                 cb 8.4637
recoveriesPerTeam              bare 0.0000                 cb 16.6600
meanRecoveryS                  bare 0.0000                 cb 0.8008
offsidesPerTeam                bare 1.3188                 cb 1.3675
cornersPerTeam                 bare 1.4975                 cb 1.3875
inPlaySecondsPerMatch          bare 216.2695               cb 210.8516
simSecondsPerMatch             bare 241.9207               cb 241.7583
wallSecondsPerMatch            bare 251.1770               cb 251.2552
```

### Gate table

| gate | result | evidence |
|---|---|---|
| `xDet` | **PASS** | digest `b4ea8855…2d17` twice (pass B never resumes) |
| `xSrcUntouched` | **PASS** | `git diff --stat -- src` empty |
| `xFpProd` | **PASS** | observed `57b0bdab…c673` = baseline, re-derived in-process |
| `gTrace` | **PASS** | 6 conjuncts — every constant read out of `src/**` at run time, incl. ⭐ ranOnTheMatchClock |
| `gArming` | **PASS** | 6 conjuncts — the CB arm IS `a4MatchFlags(6)` + `armA4World(…,6)`; 10 flags true; 0 door literals typed in the probe |
| `gSemantics` | **PASS** | 14 fields vs the committed #173 smoke, **0 mismatches**, block 12293000..12293039 |
| `gWorld` | **PASS** | 6 conjuncts on a never-stepped match at seed 12,477,900 + the OFF ledger through the full walk |
| `gSeedDisjoint` | **PASS** | 4 blocks machine-checked (1 declared re-walk, predicate INVERTED) · ledger 10 entries |
| `gStatsDisjoint` | **PASS** | base 110,200, minGap 200 ≥ 200, 22 published bases |
| `gCleanInvocation` | **PASS** | preflight false · reasons [] · resumeRequested false |
| `gNDerived` | **PASS** | ran N 400 = derived N* 400 = design term 400; ⭐ the wall cap never bound |
| `gNonVacuity` | **PASS** | 42 cells at claim grain · declared structural zeros ["bare.Q10","bare.Q11"] · undeclared empties [] |
| `gRealHonest` | **PASS** | 21 rows · {"MED":5,"UNSOURCED":8,"LOW":8} · ⭐ all 8 #170-inherited bands re-checked against the committed tempo artifact |
| `gValuesNotImported` | **PASS** | 145 src files · 66 needles · 361 coincidental hits REPORTED (not gated); the gated conjunct is src-unchanged |
| `gLedgerAppend` | **PASS** | 42 rows appended under `post-CB` · duplicate-label refusal exercised live · 0 prior lines preserved |
| `gMutants` | **PASS** | **67 mutants, 0 dead** · coverage 12 gates, MACHINE-DERIVED · uncovered conjuncts 0 · stray 0 |

⭐ **THE HEADLINE COUNT, HAND-CHECKED**: the artifact's `gates` object carries exactly **16** keys — `xDet · xSrcUntouched · xFpProd · gTrace · gArming · gSemantics · gWorld · gSeedDisjoint · gStatsDisjoint · gCleanInvocation · gNDerived · gNonVacuity · gRealHonest · gValuesNotImported · gLedgerAppend · gMutants` — and **16** of them pass.

### The envelope (everything OUTSIDE `resultSha256`)

```text
preflight       false   reasons []   resumeRequested false
paths           out docs/world-model/data/r-yi-gap-table-post-CB.json   ledger docs/world-model/data/r-yi-gap-table-ledger.jsonl
checkpoint      /tmp/r-yi-checkpoint-full-post-CB.jsonl   freshWalks 1,600   doneMarker /tmp/r-yi-done-full-post-CB
wall            passA 63,609 ms · X-DET 62,444 ms · total 142,716 ms · 79.5 ms/match
N rule (wall)   wallTerm 4,996 at 90.1 ms/match — binding term: precision
cross-OUT       resultSha256 covers quantities + frozenDesign + result + the invocation-INDEPENDENT gates only, so the same measurement written to /tmp re-derives the same receipt byte for byte.
```

### Deviations recorded

1. ⭐⭐ THE TWO DISPATCHED RUNS ARE THE TWO ARMS OF ONE EPOCH, walked on SHARED SEEDS. The re-run clause's unit is the LABEL (the epoch), not the arm: pairing bare against CB-armed on the same seeds is strictly more informative than two unpaired invocations, and the ledger keys every row by (label, arm, quantity) so a future epoch diffs against both.
2. A TOUCH IS AN OWNERSHIP EPISODE, not a foot-ball contact (#173's own deviation, inherited with its reason): `Match` exposes `ball.owner`, not a contact event, so an episode shorter than one tick is invisible. Deriving it from observable state is REQUIRED by X-SRC-ZERO.
3. SPELL DURATION INCLUDES IN-SPELL LOOSE TIME (the Opta "sequence" shape) so Q01 is read against Q01's band like for like — #173's inherited choice.
4. THE PER-TEAM ROWS HALVE A BOTH-TEAMS SUM. The arms are symmetric by construction, so the halving is exact in EXPECTATION over the seed set, not per match (#171.1.iii).
5. BACKWARD vs LATERAL PASSING IS NOT MEASURABLE with existing instrument semantics (Q07): the engine has one forward-pass counter and no direction field on a pass. The pooled complement is published; no semantics were invented to split it.
6. THE REAL COLUMN IS ELEVEN-A-SIDE, FULL-PITCH, 90-MINUTE FOOTBALL. Ours is 6v6 on a 0.70-scaled pitch over a 240 s clock. COUNT rows (shots, fouls, cards, aerials, duels) are the least comparable across that gap; DURATION and SHARE rows are the most comparable, because a human body's time and a possession's shape are the same in both games.
7. EIGHT OF THE 21 ROWS SHIP REAL = UNSOURCED (Q02 spell quantiles · Q07 forward-pass share · Q10 take-on attempts · Q14 pressed-reception share · Q15 aerial duels · Q16 ground duels · Q19 the ≥3-goal tail · Q20 possession balance). Each row's `source` field records WHAT was searched and why nothing citable was found; two of them (Q02, Q14) inherit #170's own ABSENT verdict on the same quantity. That is the contract's honest form, not a hole to be filled with a plausible number.

### Registered non-claims

1. NOTHING SHIPS: zero src/** bytes, the production fingerprint re-derived unchanged, every flag armed ONLY inside this instrument.
2. ⭐⭐ NO GAP IS A GATE (contract §4). No PASS/FAIL is computed against any real value anywhere in this probe; the gates are the X-family, the trace/arming/semantics gates, the ledger hygiene gates and the mutant-liveness proof.
3. ⭐ THE STATUS COLUMN IS UNADJUDICATED ON EVERY ROW. Deliberate arcade deviation vs gap vs unknown is the ruling chain's (#203); the executor never writes it.
4. THE ARM CONTRAST IS DESCRIPTIVE. The CB arm differs from bare in several ways at once (three doors + the A4 census substrate + the wind-up seam + the proneness dose), so no single-factor causal claim is made or permitted — it is the world the play-test entry actually arms, measured as a whole.
5. NO WATCHABILITY CLAIM. Whether any of this LOOKS like football is the user's eyes (#157).

<a id="corrected-epoch-1"></a>

## §CORRECTED EPOCH-1 READINGS (#272.3 quarantine, discharged)

Printed by `scripts/analysis/r-yi-gap-table-result.ts --epoch1-corrections
docs/world-model/data/r-yi-gap-table-post-CB.json` **from the committed epoch-1
artifact's own stored cells** — nothing re-walked, nothing typed.

⚠⚠ **THE ONE THING THAT CANNOT BE MADE EXACT.** Epoch 1 ran before
`cbLedger.touchPastContested` existed, and its artifact stores only SUMS
(`touchPasts`, `touchPastChallengers`), from which the NUMBER of knocks that had a
challenger cannot be recovered. The re-keyed epoch-1 reading is therefore published
as a **BOUND** — the commander's own arithmetic, reproduced from the artifact — and
the exact re-key would require re-walking 12,477,100–499 on the **pre-polish** build,
which is a different world and is not this step's authorisation.

### ⭐⭐ THE CORRECTED EPOCH-1 READINGS (label `post-CB`, from the committed artifact)

#### (1) Q10 / Q11 re-keyed — a BOUND, because epoch 1 could not count contested knocks

```text
bare   knocks 0 · challenger-slots 0 · clean beats 0 · beaten bodies 0
cb     knocks 8,617 · challenger-slots 6,800 · clean beats 3,333 · beaten bodies 4,436
       contested knocks ≤ 6,800   (one challenger per contested knock at most)
       UNCONTESTED knocks ≥ 1,817 = 0.2109 of the epoch-1 Q10 count
       Q11 as published (clean / ALL knocks)  0.3868
       Q11 re-keyed (clean / CONTESTED)       ≥ 0.4901
```

#### (2) both clock axes on every epoch-1 row

| id | clock | bare A | bare B | CB A | CB B |
|---|---|---|---|---|---|
| Q01 | duration | 4.2950 | 96.6380 | 3.8369 | 86.3300 |
| Q02 | duration | 2.9000 | 65.2500 | 2.6000 | 58.5000 |
| Q03 | duration | 0.6243 | 14.0465 | 0.5967 | 13.4263 |
| Q04 | perTimeRate | 8.8219 | 0.3921 | 9.6530 | 0.4290 |
| Q05 | invariant | 2.5236 | 2.5236 | 2.3969 | 2.3969 |
| Q06 | invariant | 0.7375 | 0.7375 | 0.6642 | 0.6642 |
| Q07 | invariant | 0.5724 | 0.5724 | 0.5790 | 0.5790 |
| Q08 | perMatchCount | 150.8344 | 6.7038 | 131.3438 | 5.8375 |
| Q09 | perMatchCount | 49.5563 | 2.2025 | 51.6937 | 2.2975 |
| Q10 | perMatchCount | 0.0000 | 0.0000 | 242.3531 | 10.7713 |
| Q11 | invariant | n/a | n/a | 0.3868 | 0.3868 |
| Q12 | perMatchCount | 44.7750 | 1.9900 | 72.1969 | 3.2088 |
| Q13 | perMatchCount | 27.1687 | 1.2075 | 44.8875 | 1.9950 |
| Q14 | invariant | 0.8053 | 0.8053 | 0.8424 | 0.8424 |
| Q15 | perMatchCount | 94.7813 | 4.2125 | 71.9437 | 3.1975 |
| Q16 | perMatchCount | 398.5312 | 17.7125 | 343.4906 | 15.2662 |
| Q17 | invariant | 0.3000 | 0.3000 | 0.2625 | 0.2625 |
| Q18 | invariant | 0.3700 | 0.3700 | 0.4250 | 0.4250 |
| Q19 | invariant | 0.1375 | 0.1375 | 0.1450 | 0.1450 |
| Q20 | invariant | 0.6073 | 0.6073 | 0.6066 | 0.6066 |
| Q21 | invariant | 0.1390 | 0.1390 | 0.1608 | 0.1608 |

#### (3) the point-faithful REAL column, applied to the epoch-1 points

| id | band shape | REAL | bare (basis A) | CB (basis A) | the OTHER clock (B): bare / CB |
|---|---|---|---|---|---|
| Q01 | inheritedVetted | 9.6 – 10.4 s | 0.45× the LOW edge | 0.40× the LOW edge | 9.29× the HIGH edge / 8.30× the HIGH edge |
| Q03 | inheritedVetted | 0.8 – 1.3 s (derived centre 0.98 s) | 0.78× the LOW edge | 0.75× the LOW edge | 10.80× the HIGH edge / 10.33× the HIGH edge |
| Q04 | inheritedVetted | 3.0 – 4.5 per display-minute | 1.96× the HIGH edge | 2.15× the HIGH edge | 0.13× the LOW edge / 0.14× the LOW edge |
| Q05 | inheritedVetted | 2.88 – 5.12 PASSES per sequence (league central ≈3.5–4) | 0.88× the LOW edge | 0.83× the LOW edge | 0.88× the LOW edge / 0.83× the LOW edge |
| Q06 | citedRange | 75.3 % – 88 % (2024-25 team extremes; league centre NOT published in the located source) | 0.98× the LOW edge | 0.88× the LOW edge | 0.98× the LOW edge / 0.88× the LOW edge |
| Q08 | inheritedVetted | 10 – 14.5 per team per match (WEAK: centre not sourced) | 10.40× the HIGH edge | 9.06× the HIGH edge | 0.67× the LOW edge / 0.58× the LOW edge |
| Q09 | citedRange | 2.82 – 2.88 per match (both edges cited; 2.88 = 2024-25) | 17.21× the HIGH edge | 17.95× the HIGH edge | 0.78× the LOW edge / 0.81× the LOW edge |
| Q11 | citedRange | 40.1 % – 48.4 % (league mean 43.7 %) | n/a | 0.96× the LOW edge | n/a / 0.96× the LOW edge |
| Q12 | inheritedVetted | 9 – 12 per team per match | 3.73× the HIGH edge | 6.02× the HIGH edge | 0.22× the LOW edge / 0.36× the LOW edge |
| Q13 | derivedPoint | 4.076 yellows per match (both teams) — a cited POINT, no width | 6.67× the cited point · CI EXCLUDES it | 11.01× the cited point · CI EXCLUDES it | 0.30× the cited point · CI EXCLUDES it / 0.49× the cited point · CI EXCLUDES it |
| Q17 | citedPoint | 25.5 % of matches — a cited POINT, no width | 1.18× the cited point · CI CONTAINS it | 1.03× the cited point · CI CONTAINS it | 1.18× the cited point · CI CONTAINS it / 1.03× the cited point · CI CONTAINS it |
| Q18 | citedPoint | 37.5 % of matches — a cited POINT, no width | 0.99× the cited point · CI CONTAINS it | 1.13× the cited point · CI EXCLUDES it | 0.99× the cited point · CI CONTAINS it / 1.13× the cited point · CI EXCLUDES it |
| Q21 | derivedPoint | 36.6852 % of the nominal 90 minutes — a derived POINT, no width | 0.40× the cited point · CI EXCLUDES it | 0.46× the cited point · CI EXCLUDES it | 0.40× the cited point · CI EXCLUDES it / 0.46× the cited point · CI EXCLUDES it |

⭐ **WHAT THE THREE TABLES SAY, in plain words.** (1) Epoch 1's Q11 read 0.3868 —
below the cited 40.1 %–48.4 % band. On the commensurable population it is **≥ 0.4901**,
i.e. **at or above the band's high edge**: the row's sign inverts, exactly as ruled.
(2) The count rows move by a factor of 22.5 between the two clocks, so under
convention A they sit 3.7×–18× **above** real while under convention B they sit below —
the "every row is below real" pattern was the two-clock artifact, not a finding.
(3) With the invented widths removed, Q17 bare sits **above** its cited point and
Q18 CB's CI **excludes** the cited 0.375 — "no row above real" does not stand.

## §RESULT-2 — EPOCH 2 `post-CB-polish` (the RE-RUN CLAUSE's first exercise, on the polished world)

**epoch label `post-CB-polish` · 400 seeds × 2 arms · block 12,479,100–12,479,499 · 17/17 gates PASS**, `resultSha256` `7527a61c…35b6`. Every number below is printed by `scripts/analysis/r-yi-gap-table-result.ts` from the committed artifact; none is typed (#229.2).

### The run

```text
match clock       240 sim-seconds ⇔ 90′  (2.666667 sim-s per display-minute)
clock convention  1 sim-second = 22.5000 display-seconds  (Match.minute(), src/sim/Match.ts:1682 · MATCH_DURATION, src/sim/constants.ts:57)
bare              241.5719 played sim-seconds per match
cb                242.0323 played sim-seconds per match
pressure radius   4.2 m   (TOUCH_CONTROL_DIST, src/sim/constants.ts:315)
first-touch win.  0.28 s   (p.firstTouchWindow, src/sim/Match.ts:2489)
estimator         cluster bootstrap by match seed (#20), 2000 resamples (500 for the quantile triple, a PREFIX of the same matrix so every interval is paired), percentile 95 % CI, ratio-of-sums; stats base 110600.
N rule            N*(design) = min( max(400, 333, 68) ↑25 = 400, seedRoom=500 ) = 400   [no timing enters this line]
                  binding precision term: match-level share
seeds             band 12,479,000–12,479,999 · smoke 12,479,000–12,479,024 · core 12,479,100–12,479,499 · G-WORLD 12,479,900 · declared re-walk 12,293,000–12,293,039
stats base        110,600
ledger            docs/world-model/data/r-yi-gap-table-ledger.jsonl  (label post-CB-polish)
```

### ⭐ THE GAP TABLE

| id | quantity | clock | OURS (bare) A / B | OURS (CB-armed) A / B | REAL | conf | STATUS |
|---|---|---|---|---|---|---|---|
| Q01 | how long a team keeps the ball (open-play possession spell, mean) | duration | 4.4145 [4.3209, 4.5149] / 99.3270 [97.2205, 101.5858] | 4.1749 [4.0815, 4.2729] / 93.9359 [91.8333, 96.1411] | 9.6 – 10.4 s | MED | UNADJUDICATED |
| Q02 | the shape of that distribution (spell p25 / median / p75) | duration | 2.9833 [2.8833, 3.0667] / 67.1250 [64.8750, 69.0000] | 2.8667 [2.7667, 2.9667] / 64.5000 [62.2500, 66.7500] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q03 | how long a body holds the ball per touch | duration | 0.6469 [0.6244, 0.6721] / 14.5546 [14.0494, 15.1217] | 0.6222 [0.5988, 0.6451] / 13.9997 [13.4738, 14.5143] | 0.8 – 1.3 s (derived centre 0.98 s) | LOW | UNADJUDICATED |
| Q04 | how often the ball changes hands | perTimeRate | 8.6614 [8.4779, 8.8490] / 0.3850 [0.3768, 0.3933] | 8.8135 [8.6022, 9.0214] / 0.3917 [0.3823, 0.4009] | 3.0 – 4.5 per display-minute | LOW | UNADJUDICATED |
| Q05 | how many touches a possession is made of | invariant | 2.5526 [2.5069, 2.5984] (both) | 2.5635 [2.5249, 2.6030] (both) | 2.88 – 5.12 PASSES per sequence (league central ≈3.5–4) | MED | UNADJUDICATED |
| Q06 | how many passes find a team-mate | invariant | 0.7364 [0.7314, 0.7414] (both) | 0.6602 [0.6553, 0.6650] (both) | 75.3 % – 88 % (2024-25 team extremes; league centre NOT published in the located source) | LOW | UNADJUDICATED |
| Q07 | how much of the passing goes forward | invariant | 0.5784 [0.5720, 0.5844] (both) | 0.5819 [0.5752, 0.5886] (both) | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q08 | shots | perMatchCount | 146.9250 [142.5656, 151.4250] / 6.5300 [6.3362, 6.7300] | 140.3438 [135.4781, 145.1531] / 6.2375 [6.0213, 6.4512] | 10 – 14.5 per team per match (WEAK: centre not sourced) | LOW | UNADJUDICATED |
| Q09 | goals | perMatchCount | 48.0375 [44.2125, 51.9750] / 2.1350 [1.9650, 2.3100] | 52.1437 [48.4875, 55.6313] / 2.3175 [2.1550, 2.4725] | 2.82 – 2.88 per match (both edges cited; 2.88 = 2024-25) | MED | UNADJUDICATED |
| Q10 | taking a man on (attempts) | perMatchCount | 0.0000 [0.0000, 0.0000] / 0.0000 [0.0000, 0.0000] | 156.9938 [146.8406, 167.5125] / 6.9775 [6.5263, 7.4450] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q11 | taking a man on (does it come off) | invariant | n/a [n/a, n/a] (both) | 0.6413 [0.6263, 0.6554] (both) | 40.1 % – 48.4 % (league mean 43.7 %) | LOW | UNADJUDICATED |
| Q12 | fouls | perMatchCount | 44.7750 [42.4406, 47.2219] / 1.9900 [1.8862, 2.0987] | 71.7750 [68.6813, 74.8125] / 3.1900 [3.0525, 3.3250] | 9 – 12 per team per match | LOW | UNADJUDICATED |
| Q13 | cards | perMatchCount | 28.9125 [26.4937, 31.4438] / 1.2850 [1.1775, 1.3975] | 44.4937 [41.5125, 47.3062] / 1.9775 [1.8450, 2.1025] | 4.076 yellows per match (both teams) — a cited POINT, no width | MED | UNADJUDICATED |
| Q14 | how much of the game is played under pressure (pressing-intensity proxy) | invariant | 0.8080 [0.8005, 0.8156] (both) | 0.8202 [0.8124, 0.8277] (both) | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q15 | aerial duels | perMatchCount | 100.4625 [93.1219, 108.7594] / 4.4650 [4.1387, 4.8338] | 87.8344 [80.8031, 95.5125] / 3.9038 [3.5913, 4.2450] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q16 | ground duels / ball-winning events | perMatchCount | 394.0594 [384.3281, 403.4250] / 17.5138 [17.0813, 17.9300] | 342.0844 [333.3938, 350.9719] / 15.2037 [14.8175, 15.5988] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q17 | the drama tail — how often a match is drawn | invariant | 0.2600 [0.2200, 0.3050] (both) | 0.2300 [0.1900, 0.2700] (both) | 25.5 % of matches — a cited POINT, no width | LOW | UNADJUDICATED |
| Q18 | the drama tail — how often one goal decides it | invariant | 0.4325 [0.3850, 0.4800] (both) | 0.4250 [0.3775, 0.4725] (both) | 37.5 % of matches — a cited POINT, no width | LOW | UNADJUDICATED |
| Q19 | the drama tail — how often it is a hiding | invariant | 0.1300 [0.0975, 0.1625] (both) | 0.1350 [0.1025, 0.1700] (both) | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q20 | how lopsided possession is between the two teams | invariant | 0.6047 [0.5974, 0.6122] (both) | 0.5973 [0.5902, 0.6047] (both) | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q21 | how much of the clock is not football (restarts and dead ball) | invariant | 0.1360 [0.1323, 0.1396] (both) | 0.1617 [0.1574, 0.1656] (both) | 36.6852 % of the nominal 90 minutes — a derived POINT, no width | MED | UNADJUDICATED |

⭐ **EVERY ROW CARRIES BOTH CLOCK READINGS** (fixed of record #272.3→ (ii)): `A` = sim time taken literally, `B` = the display clock (our match IS the 90′). `invariant` rows read the same on both. Units are §1's; every interval is a 95 % cluster-bootstrap percentile CI over match seeds.

### DISTANCE FROM THE REAL VALUE — mechanical, no verdict, ONE declared clock

⭐⭐ **THE DECLARED BASIS IS CONVENTION A** — convention A is the axis the instrument actually measures on (sim-seconds and sim-time rates) and the axis #170's duration bands were vetted against; B is the axis the per-match COUNT rows implicitly used in epoch 1. Neither is "the" truth — that is the point of printing both. The OTHER convention is printed beside it for every row, so a cross-row PATTERN can never again be assembled out of two different clocks (epoch 1's "every row sits below real" was exactly that artifact, #272.3→ (ii)).

⭐ Where the REAL value is a cited **POINT** (band shape `citedPoint` / `derivedPoint`), the reading is `ours ÷ the point` plus whether our 95 % CI CONTAINS the point — there is no band to "overlap" and no width to hide an exclusion behind (#272.3→ (iii), (iv)).

| id | quantity | basis (A) bare | basis (A) CB | REAL on A | bare vs REAL | CB vs REAL | the OTHER clock (B): bare / CB vs REAL |
|---|---|---|---|---|---|---|---|
| Q01 | how long a team keeps the ball (open-play possession spell, mean) | 4.4145 | 4.1749 | 9.6000–10.4000 | 0.46× the LOW edge | 0.43× the LOW edge | 9.55× the HIGH edge / 9.03× the HIGH edge |
| Q03 | how long a body holds the ball per touch | 0.6469 | 0.6222 | 0.8000–1.3000 | 0.81× the LOW edge | 0.78× the LOW edge | 11.20× the HIGH edge / 10.77× the HIGH edge |
| Q04 | how often the ball changes hands | 8.6614 | 8.8135 | 3.0000–4.5000 | 1.92× the HIGH edge | 1.96× the HIGH edge | 0.13× the LOW edge / 0.13× the LOW edge |
| Q05 | how many touches a possession is made of | 2.5526 | 2.5635 | 2.8800–5.1200 | 0.89× the LOW edge | 0.89× the LOW edge | 0.89× the LOW edge / 0.89× the LOW edge |
| Q06 | how many passes find a team-mate | 0.7364 | 0.6602 | 0.7530–0.8800 | 0.98× the LOW edge | 0.88× the LOW edge | 0.98× the LOW edge / 0.88× the LOW edge |
| Q08 | shots | 146.9250 | 140.3438 | 10.0000–14.5000 | 10.13× the HIGH edge | 9.68× the HIGH edge | 0.65× the LOW edge / 0.62× the LOW edge |
| Q09 | goals | 48.0375 | 52.1437 | 2.8200–2.8800 | 16.68× the HIGH edge | 18.11× the HIGH edge | 0.76× the LOW edge / 0.82× the LOW edge |
| Q11 | taking a man on (does it come off) | n/a | 0.6413 | 0.4010–0.4840 | n/a | 1.33× the HIGH edge | n/a / 1.33× the HIGH edge |
| Q12 | fouls | 44.7750 | 71.7750 | 9.0000–12.0000 | 3.73× the HIGH edge | 5.98× the HIGH edge | 0.22× the LOW edge / 0.35× the LOW edge |
| Q13 | cards | 28.9125 | 44.4937 | 4.0760 | 7.09× the cited point · CI EXCLUDES it | 10.92× the cited point · CI EXCLUDES it | 0.32× the cited point · CI EXCLUDES it / 0.49× the cited point · CI EXCLUDES it |
| Q17 | the drama tail — how often a match is drawn | 0.2600 | 0.2300 | 0.2550 | 1.02× the cited point · CI CONTAINS it | 0.90× the cited point · CI CONTAINS it | 1.02× the cited point · CI CONTAINS it / 0.90× the cited point · CI CONTAINS it |
| Q18 | the drama tail — how often one goal decides it | 0.4325 | 0.4250 | 0.3750 | 1.15× the cited point · CI EXCLUDES it | 1.13× the cited point · CI EXCLUDES it | 1.15× the cited point · CI EXCLUDES it / 1.13× the cited point · CI EXCLUDES it |
| Q21 | how much of the clock is not football (restarts and dead ball) | 0.1421 | 0.1695 | 0.3669 | 0.39× the cited point · CI EXCLUDES it | 0.46× the cited point · CI EXCLUDES it | 0.39× the cited point · CI EXCLUDES it / 0.46× the cited point · CI EXCLUDES it |

⚠ Q21 is read on its NOMINAL-clock re-basing in this table: the real value is a share of the nominal 90 while our headline divides the elapsed pause-inclusive clock (#272.3→ (vi)).

### The spell-length shape (Q02, no real band exists)

```text
bare   p25 1.3000 [1.2500, 1.3333]   median 2.9833 [2.8833, 3.0667]   p75 5.9500 [5.8333, 6.1000]   (n=13,942 spells, 500 resamples)
cb     p25 1.3000 [1.2667, 1.3333]   median 2.8667 [2.7667, 2.9667]   p75 5.7000 [5.5333, 5.8167]   (n=14,221 spells, 500 resamples)
```

### Both honest axes on the churn row (Q04)

```text
bare   per sim-second 0.144357   per sim-minute 8.6614   per display-minute 0.3850   (× 2.666667)
cb     per sim-second 0.146892   per sim-minute 8.8135   per display-minute 0.3917   (× 2.666667)
```

### CONTEXT rows (measured, compared to NO band)

```text
engineDribblesPerTeam          bare 54.6613                cb 49.7938
takeOnPerChallengerSuccess     bare n/a [n/a, n/a]         cb 0.6793 [0.6666, 0.6917]
allKnocksPerTeam               bare 0.0000                 cb 11.0875
uncontestedKnocksPerTeam       bare 0.0000                 cb 4.1100
uncontestedKnockShare          bare n/a                    cb 0.3707
takeOnSuccessAllKnocks         bare n/a                    cb 0.4036
possessionBalanceRatioOfSums   bare 0.6098                 cb 0.6017
deadShareOnNominalClock        bare 0.1421                 cb 0.1695
redsPerMatch                   bare 0.0550                 cb 0.1475
turnoversPerSimMin             bare 8.6614                 cb 8.8135
completedPassesPerSpell        bare 2.1477                 cb 1.6900
armedChallengesPerTeam         bare 0.0000                 cb 17.3750
geometricMissesPerTeam         bare 0.0000                 cb 8.0975
recoveriesPerTeam              bare 0.0000                 cb 16.3938
meanRecoveryS                  bare 0.0000                 cb 0.8017
offsidesPerTeam                bare 1.3700                 cb 1.4100
cornersPerTeam                 bare 1.3775                 cb 1.3650
inPlaySecondsPerMatch          bare 216.5334               cb 210.9135
simSecondsPerMatch             bare 241.5719               cb 242.0323
wallSecondsPerMatch            bare 250.6312               cb 251.5948
```

### Gate table

| gate | result | evidence |
|---|---|---|
| `xDet` | **PASS** | digest `80bbfc38…00ec` twice (pass B never resumes) |
| `xSrcCleanTree` | **PASS** | `git diff --stat -- src` empty — the working tree's src IS the committed engine the battery walked |
| `xFpProd` | **PASS** | observed `57b0bdab…c673` = baseline, re-derived in-process |
| `gTrace` | **PASS** | 7 conjuncts — every constant read out of `src/**` at run time, incl. ⭐ ranOnTheMatchClock |
| `gArming` | **PASS** | 6 conjuncts — the CB arm IS `a4MatchFlags(6)` + `armA4World(…,6)`; 10 flags true; 0 door literals typed in the probe |
| `gSemantics` | **PASS** | 14 fields vs the committed #173 smoke, **0 mismatches**, block 12293000..12293039 |
| `gWorld` | **PASS** | 6 conjuncts on a never-stepped match at seed 12,479,900 + the OFF ledger through the full walk |
| `gSeedDisjoint` | **PASS** | 4 blocks machine-checked (1 declared re-walk, predicate INVERTED) · ledger 12 entries |
| `gStatsDisjoint` | **PASS** | base 110,600, minGap 200 ≥ 200, 24 published bases |
| `gCleanInvocation` | **PASS** | preflight false · reasons [] · resumeRequested false |
| `gNDerived` | **PASS** | ran N 400 = derived N* 400 = design term 400; ⭐ the wall cap never bound |
| `gNonVacuity` | **PASS** | 42 cells at claim grain · declared structural zeros ["bare.Q10","bare.Q11"] · undeclared empties [] |
| `gRealHonest` | **PASS** | 21 rows · {"MED":5,"UNSOURCED":8,"LOW":8} · ⭐ all 8 #170-inherited bands re-checked against the committed tempo artifact · ⭐⭐ bandFidelity over 13 sourced rows {"inheritedVetted":6,"citedRange":3,"derivedPoint":2,"citedPoint":2} |
| `gAdditiveCounter` | **PASS** | 6 conjuncts — `cbLedger.touchPastContested` written ONCE inside `performTouchPast`, read NOWHERE in src, zero on a fresh match and through the whole OFF walk |
| `gValuesNotImported` | **PASS** | 145 src files · 49 needles · 165 coincidental hits REPORTED (not gated); the gated conjunct is the clean tree, and the round's one src change is carried by `gAdditiveCounter` |
| `gLedgerAppend` | **PASS** | 42 rows + 16 SUPERSESSIONS of `post-CB` appended under `post-CB-polish` · duplicate-label refusal exercised live · a supersession line proven not to count as a row-set · 42 prior lines preserved |
| `gMutants` | **PASS** | ⭐⭐ **76 mutants, 76 LIVE, 0 dead, 0 imprecise** — EXACTLY-ONE **ENFORCED** (each flips its own conjunct AND leaves every sibling unchanged) · 76 conjuncts enumerated from 13 gate objects · uncovered 0 · stray 0 |

⭐ **THE HEADLINE COUNT, HAND-CHECKED**: the artifact's `gates` object carries exactly **17** keys — `xDet · xSrcCleanTree · xFpProd · gTrace · gArming · gSemantics · gWorld · gSeedDisjoint · gStatsDisjoint · gCleanInvocation · gNDerived · gNonVacuity · gRealHonest · gAdditiveCounter · gValuesNotImported · gLedgerAppend · gMutants` — and **17** of them pass.

### ⭐⭐ SUPERSESSIONS OF RECORD — appended, never edited

The epoch-1 lines stay on disk exactly as written. These new ledger lines say what about them no longer stands, and which epoch replaces it (one line per arm × row).

| row | field | was | now | ruling | why |
|---|---|---|---|---|---|
| Q09 | realLo/realHi | [2.8,2.9] | [2.82,2.88] | #272.3 (iv) | the band was INVENTED around two cited numbers; both edges are now the cited numbers themselves. |
| Q13 | realLo/realHi | [4,4.2] | [4.076,4.076] | #272.3 (iv) | a width was invented around a single derived point (1,549 / 380); it is a POINT. |
| Q17 | realLo/realHi | [0.24,0.27] | [0.255,0.255] | #272.3 (iv) | a width was invented around a single cited point (25.5 %); it is a POINT. |
| Q18 | realLo/realHi | [0.35,0.4] | [0.375,0.375] | #272.3 (iv) | a width was invented around a single cited point (37.5 %) and that width is what printed "CI overlaps" over a CI that EXCLUDES the cited value. |
| Q21 | realLo/realHi | [0.35,0.39] | [0.366852,0.366852] | #272.3 (iv), (vi) | a width was invented around a single derived point, and the source was transcribed as 56:58 where it publishes 56:59. |
| Q10 | oursSemantics/denominator | "cbLedger.touchPasts / 2 (EVERY aimed knock)" | "cbLedger.touchPastContested / 2 (knocks with a contesting body)" | #272.3 (i) | the stated semantics ("an aimed knock past a contesting body") was false for the uncontested share of the count. |
| Q11 | oursSemantics/denominator | "cleanBeats / touchPasts" | "cleanBeats / touchPastContested" | #272.3 (i) | the denominator included knocks structurally incapable of a clean beat; the corrected reading INVERTS this row's sign against the real band. |
| Q20 | estimator | "ratioOfSums (Σmax / Σtotal)" | "perMatchMean (mean of the per-match leader share)" | #272.3 (v) | the published estimator was not the one §1.1 described; the label "stronger team" is also corrected to the per-match LEADER. |

### The envelope (everything OUTSIDE `resultSha256`)

```text
preflight       false   reasons []   resumeRequested false
paths           out docs/world-model/data/r-yi-gap-table-post-CB-polish.json   ledger docs/world-model/data/r-yi-gap-table-ledger.jsonl
checkpoint      /tmp/r-yi-checkpoint-full-post-CB-polish.jsonl   freshWalks 1,600   doneMarker /tmp/r-yi-done-full-post-CB-polish
wall            passA 65,618 ms · X-DET 64,802 ms · total 147,128 ms · 82.0 ms/match
N rule (wall)   wallTerm 4,755 at 94.6 ms/match — binding term: precision
cross-OUT       resultSha256 covers quantities + frozenDesign + result + the invocation-INDEPENDENT gates only, so the same measurement written to /tmp re-derives the same receipt byte for byte.
```

### Deviations recorded

1. ⭐⭐ THIS EPOCH CHANGED ONE `src/**` SURFACE, DECLARED: `cbLedger.touchPastContested`, a pure additive counter written once inside `performTouchPast` (unreachable without the CB door) and read NOWHERE in src. It is the only way to key Q10/Q11 on the commensurable take-on population (#272.3→ (i)); G-ADDITIVE-COUNTER proves the additivity from the engine's own source, xFpProd re-derives the production fingerprint, and the OFF ledger stays all-zero through the full walk. The epoch-1 phrase "zero src/** bytes" is therefore RETIRED for this epoch and the gate that carried it is renamed `xSrcCleanTree`.
2. ⭐⭐ BOTH CLOCK CONVENTIONS ARE PRINTED ON EVERY BANDED ROW (#272.3→ (ii)). The distance table declares convention A as its basis and prints B beside it; no cross-row pattern may be assembled out of two different clocks, which is what epoch 1's "every row sits below real" was.
3. ⭐ FIVE REAL BANDS WERE CORRECTED TO THEIR CITED POINTS (Q09/Q13/Q17/Q18/Q21) and the epoch-1 rows SUPERSEDED by new ledger lines — never by editing the old ones (#272.3→ (iv)).
4. ⭐ Q20's published estimator is now the per-match mean §1.1 always described, with the epoch-1 ratio-of-sums kept beside it as context, and the "stronger team" label corrected to the per-match LEADER (#272.3→ (v)).
5. ⭐ Q21 carries its DENOMINATOR correction into the reading (#272.3→ (vi)): ours divides the elapsed pause-inclusive clock (≈4.7 % longer than the nominal 240 s) while the real value is a share of the nominal 90, so the nominal-clock re-basing is published and is what the distance table reads. The source transcription is corrected to 56:59.
6. ⭐⭐ THE TWO DISPATCHED RUNS ARE THE TWO ARMS OF ONE EPOCH, walked on SHARED SEEDS. The re-run clause's unit is the LABEL (the epoch), not the arm: pairing bare against CB-armed on the same seeds is strictly more informative than two unpaired invocations, and the ledger keys every row by (label, arm, quantity) so a future epoch diffs against both.
7. A TOUCH IS AN OWNERSHIP EPISODE, not a foot-ball contact (#173's own deviation, inherited with its reason): `Match` exposes `ball.owner`, not a contact event, so an episode shorter than one tick is invisible. Deriving it from observable state is REQUIRED by X-SRC-ZERO.
8. SPELL DURATION INCLUDES IN-SPELL LOOSE TIME (the Opta "sequence" shape) so Q01 is read against Q01's band like for like — #173's inherited choice.
9. THE PER-TEAM ROWS HALVE A BOTH-TEAMS SUM. The arms are symmetric by construction, so the halving is exact in EXPECTATION over the seed set, not per match (#171.1.iii).
10. BACKWARD vs LATERAL PASSING IS NOT MEASURABLE with existing instrument semantics (Q07): the engine has one forward-pass counter and no direction field on a pass. The pooled complement is published; no semantics were invented to split it.
11. THE REAL COLUMN IS ELEVEN-A-SIDE, FULL-PITCH, 90-MINUTE FOOTBALL. Ours is 6v6 on a 0.70-scaled pitch over a 240 s clock. COUNT rows (shots, fouls, cards, aerials, duels) are the least comparable across that gap; DURATION and SHARE rows are the most comparable, because a human body's time and a possession's shape are the same in both games.
12. EIGHT OF THE 21 ROWS SHIP REAL = UNSOURCED (Q02 spell quantiles · Q07 forward-pass share · Q10 take-on attempts · Q14 pressed-reception share · Q15 aerial duels · Q16 ground duels · Q19 the ≥3-goal tail · Q20 possession balance). Each row's `source` field records WHAT was searched and why nothing citable was found; two of them (Q02, Q14) inherit #170's own ABSENT verdict on the same quantity. That is the contract's honest form, not a hole to be filled with a plausible number.

### Registered non-claims

1. NOTHING SHIPS THAT ANY BODY CAN READ: the one src change is a counter no code reads, the production fingerprint re-derives unchanged, and every flag is armed ONLY inside this instrument. ⚠ This is deliberately NOT the epoch-1 wording ("zero src/** bytes"), which would be false this epoch.
2. ⭐⭐ NO GAP IS A GATE (contract §4). No PASS/FAIL is computed against any real value anywhere in this probe; the gates are the X-family, the trace/arming/semantics gates, the ledger hygiene gates and the mutant-liveness proof.
3. ⭐ THE STATUS COLUMN IS UNADJUDICATED ON EVERY ROW. Deliberate arcade deviation vs gap vs unknown is the ruling chain's (#203); the executor never writes it.
4. THE ARM CONTRAST IS DESCRIPTIVE. The CB arm differs from bare in several ways at once (three doors + the A4 census substrate + the wind-up seam + the proneness dose), so no single-factor causal claim is made or permitted — it is the world the play-test entry actually arms, measured as a whole.
5. NO WATCHABILITY CLAIM. Whether any of this LOOKS like football is the user's eyes (#157).

### ⭐ DRIFT — the re-run clause's own deliverable

⚠⚠ **READ THE NOISE YARDSTICK FIRST.** The two epochs walk **different seed blocks**
(12,477,100–499 vs 12,479,100–499), so they are **not paired**. The **bare arm is the
control**: the CB polish is unreachable without the CB door, so the bare world CANNOT
have moved, and every bare-arm delta below is between-block noise. Read each CB-arm
delta **against its bare twin**, never on its own. Instrument-changed rows (Q10, Q11,
Q20) are marked: those are not drift, they are a different measurement.

### ⭐ DRIFT — `post-CB` → `post-CB-polish` (reported, never adjudicated)

| id | quantity | bare: epoch 1 → 2 | Δ | CB: epoch 1 → 2 | Δ | note |
|---|---|---|---|---|---|---|
| Q01 | how long a team keeps the ball (open-play possession spell, mean) | 4.2950 → 4.4145 | +0.1195 | 3.8369 → 4.1749 | +0.3380 |  |
| Q02 | the shape of that distribution (spell p25 / median / p75) | 2.9000 → 2.9833 | +0.0833 | 2.6000 → 2.8667 | +0.2667 |  |
| Q03 | how long a body holds the ball per touch | 0.6243 → 0.6469 | +0.0226 | 0.5967 → 0.6222 | +0.0255 |  |
| Q04 | how often the ball changes hands | 0.3921 → 0.3850 | -0.0071 | 0.4290 → 0.3917 | -0.0373 |  |
| Q05 | how many touches a possession is made of | 2.5236 → 2.5526 | +0.0290 | 2.3969 → 2.5635 | +0.1666 |  |
| Q06 | how many passes find a team-mate | 0.7375 → 0.7364 | -0.0011 | 0.6642 → 0.6602 | -0.0040 |  |
| Q07 | how much of the passing goes forward | 0.5724 → 0.5784 | +0.0060 | 0.5790 → 0.5819 | +0.0029 |  |
| Q08 | shots | 6.7038 → 6.5300 | -0.1738 | 5.8375 → 6.2375 | +0.4000 |  |
| Q09 | goals | 2.2025 → 2.1350 | -0.0675 | 2.2975 → 2.3175 | +0.0200 |  |
| Q10 | taking a man on (attempts) | 0.0000 → 0.0000 | +0.0000 | 10.7713 → 6.9775 | -3.7938 | ⚠ INSTRUMENT CHANGED — not drift |
| Q11 | taking a man on (does it come off) | n/a → n/a | +0.0000 | 0.3868 → 0.6413 | +0.2546 | ⚠ INSTRUMENT CHANGED — not drift |
| Q12 | fouls | 1.9900 → 1.9900 | +0.0000 | 3.2088 → 3.1900 | -0.0188 |  |
| Q13 | cards | 1.2075 → 1.2850 | +0.0775 | 1.9950 → 1.9775 | -0.0175 |  |
| Q14 | how much of the game is played under pressure (pressing-intensity proxy) | 0.8053 → 0.8080 | +0.0027 | 0.8424 → 0.8202 | -0.0222 |  |
| Q15 | aerial duels | 4.2125 → 4.4650 | +0.2525 | 3.1975 → 3.9038 | +0.7063 |  |
| Q16 | ground duels / ball-winning events | 17.7125 → 17.5138 | -0.1987 | 15.2662 → 15.2037 | -0.0625 |  |
| Q17 | the drama tail — how often a match is drawn | 0.3000 → 0.2600 | -0.0400 | 0.2625 → 0.2300 | -0.0325 |  |
| Q18 | the drama tail — how often one goal decides it | 0.3700 → 0.4325 | +0.0625 | 0.4250 → 0.4250 | +0.0000 |  |
| Q19 | the drama tail — how often it is a hiding | 0.1375 → 0.1300 | -0.0075 | 0.1450 → 0.1350 | -0.0100 |  |
| Q20 | how lopsided possession is between the two teams | 0.6073 → 0.6047 | -0.0026 | 0.6066 → 0.5973 | -0.0093 | ⚠ INSTRUMENT CHANGED — not drift |
| Q21 | how much of the clock is not football (restarts and dead ball) | 0.1390 → 0.1360 | -0.0029 | 0.1608 → 0.1617 | +0.0009 |  |

| context key | bare: epoch 1 → 2 | CB: epoch 1 → 2 |
|---|---|---|
| `engineDribblesPerTeam` | 55.7775 → 54.6613 | 53.3663 → 49.7938 |
| `takeOnPerChallengerSuccess` | n/a → n/a | 0.6524 → 0.6793 |
| `allKnocksPerTeam` | — → 0.0000 | — → 11.0875 |
| `uncontestedKnocksPerTeam` | — → 0.0000 | — → 4.1100 |
| `uncontestedKnockShare` | — → — | — → 0.3707 |
| `takeOnSuccessAllKnocks` | — → — | — → 0.4036 |
| `possessionBalanceRatioOfSums` | — → 0.6098 | — → 0.6017 |
| `deadShareOnNominalClock` | — → 0.1421 | — → 0.1695 |
| `redsPerMatch` | 0.0650 → 0.0550 | 0.1700 → 0.1475 |
| `turnoversPerSimMin` | 8.8219 → 8.6614 | 9.6530 → 8.8135 |
| `completedPassesPerSpell` | 2.1383 → 2.1477 | 1.5816 → 1.6900 |
| `armedChallengesPerTeam` | 0.0000 → 0.0000 | 17.6250 → 17.3750 |
| `geometricMissesPerTeam` | 0.0000 → 0.0000 | 8.4637 → 8.0975 |
| `recoveriesPerTeam` | 0.0000 → 0.0000 | 16.6600 → 16.3938 |
| `meanRecoveryS` | 0.0000 → 0.0000 | 0.8008 → 0.8017 |
| `offsidesPerTeam` | 1.3188 → 1.3700 | 1.3675 → 1.4100 |
| `cornersPerTeam` | 1.4975 → 1.3775 | 1.3875 → 1.3650 |
| `inPlaySecondsPerMatch` | 216.2695 → 216.5334 | 210.8516 → 210.9135 |
| `simSecondsPerMatch` | 241.9207 → 241.5719 | 241.7583 → 242.0323 |
| `wallSecondsPerMatch` | 251.1770 → 250.6312 | 251.2552 → 251.5948 |

## §DEV-2 — what was built this round, and the instrument corrections declared

1. **The six fixes are the ones ruled** — see [§FIX](#fix) for the design (committed
   before the battery was read) and the gate table above for what each one is proven by.
2. ⚠ **INSTRUMENT CORRECTION, WITH RECEIPTS — the mutant harness's BASE was
   invocation-dependent.** `gMutants` is a HASHED gate, but the base map its mutants were
   compared against was the LIVE invocation's; under a preflight the `gCleanInvocation`
   mutants went dead and the hashed gate moved, so the **cross-OUT acceptance test could
   not pass** — the envelope law's own test found it. Mutant liveness is a property of the
   gate FUNCTION, so the base for `gCleanInvocation` (and for `gValuesNotImported`'s tree
   conjunct) is now a synthetic CLEAN invocation. Receipt that this moved no measurement:
   the canonical run's `resultSha256` is **byte-identical before and after the fix**
   (`7527a61c…35b6`, on three independent invocations with different wall timings), and
   the cross-OUT preflight to `/tmp` now re-derives that same digest with only
   `gCleanInvocation` red, as designed.
3. ⚠ **THE EPOCH-2 LEDGER APPEND WAS PERFORMED, DISCARDED FROM THE WORKING TREE, AND
   PERFORMED AGAIN** while that harness correction was made and the sizing smoke was
   re-run green. Nothing was removed from COMMITTED history, and the re-appended lines are
   byte-identical to the discarded ones because the receipt did not move. Recorded here
   rather than left invisible.
4. **The sizing smoke is per-epoch now.** `RYI_LABEL` is required in both modes and the
   smoke writes `…-sizing-smoke-<label>.json`, so epoch 1's committed smoke is untouched
   and no epoch can size itself off another epoch's event rates.

## §DOUBTS-2 (this round's own)

1. **The epochs are not paired.** The re-run clause's unit is the LABEL and each label
   books its own seed band, so epoch-over-epoch drift carries between-block noise. The
   bare arm is a genuine control (it cannot move), which is what makes the CB deltas
   readable at all — but a PAIRED design (the same seeds every epoch) would be strictly
   sharper and is a versioned amendment for the ruling chain, not an executor's call.
2. **Q10/Q11's epoch-1 correction is a BOUND, not a number** (see above). The
   institution's own lesson: a counter that does not exist cannot be recovered from sums,
   so a re-key is only ever exact from the epoch in which it lands.
3. **The round changed a `src/**` byte.** It is a counter nothing reads, proven from the
   engine's own source, and the production fingerprint is unmoved — but the instrument can
   no longer say the sentence epoch 1 said, and that is stated in the artifact rather than
   papered over.
4. **`bandFidelity` checks SHAPE, not TRUTH.** It proves a stored edge occurs in the cited
   text (or the receipt's arithmetic); it cannot prove the publisher is right, and four
   bands still rest on aggregators or blogs (Q06, Q11, Q17, Q18 — LOW, unchanged).
5. **The #170 widths are inherited, not re-vetted.** Q03, Q04, Q08 and Q12 carry widths
   #170 chose around single datapoints; `bandFidelity` records them as `inheritedVetted`
   with that fact written into the receipt rather than silently re-blessing them. A
   re-vetting is a future epoch's amendment.

## §6 VISION audit — the fix round (the #91 form)

* vs **the aesthetic criterion**: the instrument now reports drift on ONE declared clock
  and on the commensurable take-on population, so what the ruler says matches what the
  world does. **PASS.**
* vs **底座给能力**: the one src change is a counter no body can read; nothing about any
  player's capability moved. **PASS.**
* vs **#200 (constants never imported)**: the corrected bands moved TOWARD the sources'
  own numbers and away from invented widths; the needle scan still runs and the one src
  change is proven additive. **PASS.**
* vs **emergence**: no mechanic, no target, no tuning — a ruler fix and a re-read.
  **PASS.**

## §7 REALITY audit — the fix round (the #201 rule)

* **The reality question this round answers**: "is our take-on success really below real
  football's?" — on the population football actually counts, it is **not** (epoch 1's
  bound ≥ 0.4901; epoch 2 measures **0.6413** on the polished world against a cited
  40.1 %–48.4 %). The mechanism oracle is the engine's own challenger test, and the
  counter now records it. **PASS.**
* **The limit, restated**: the REAL column is still eleven-a-side, full-pitch,
  90-minute football, and the two-clock problem is not SOLVED by declaring a convention —
  it is made VISIBLE. Both readings are printed precisely because neither is the truth.
* **STATUS stays UNADJUDICATED everywhere**, including on every corrected row and every
  drift line. Whether a corrected gap is a deliberate arcade deviation remains the ruling
  chain's word.

## §6 VISION audit — EPOCH 1 (the #91 form)

* vs **the aesthetic criterion**: a standing ruler is how "emergence must be SEEN"
  survives contact with time — the eyes cannot see a drift between two epochs, and
  this instrument can. **PASS.**
* vs **底座给能力**: instrument-side only. Nothing measured here reaches any
  player; zero `src/**` bytes. **PASS.**
* vs **#200 (constants never imported)**: the real column is **CITED**, never
  tuned toward, and `gValuesNotImported` carries the proof that this round moved no
  sim value. **PASS.**
* vs **emergence**: the table measures levels and reports drift; it prescribes no
  target and proposes no mechanic. **PASS.**

## §7 REALITY audit — EPOCH 1 (the #201 rule)

* Real football's published distributions are the reference — the same move as
  #246, systematised into a standing instrument. **PASS.**
* **The honest limit, stated:** every published value is eleven-a-side, full-pitch,
  90-minute football; ours is 6v6 on a 0.70-scaled pitch over 240 sim-seconds.
  COUNT rows (shots, fouls, cards, aerials, duels) are the **least** comparable
  across that gap and DURATION/SHARE rows the **most**, because a human body's time
  and a possession's shape are the same in both games. The STATUS column exists
  precisely for this: a deviation is only a disease if the ruling chain says so.
  **PASS.**
* **Eight rows have no real counterpart at all** and ship UNSOURCED. That is the
  reality audit working, not failing: it records where football's own published
  record does not answer the question we are asking.

## §DOUBTS — EPOCH 1

1. **The two dispatched runs are the two ARMS of ONE epoch**, walked on shared
   seeds, rather than two separate invocations. Pairing is strictly more
   informative and the ledger keys rows by (label, arm, quantity) so a future epoch
   diffs against both — but if the ruling chain wants "run" to mean "invocation",
   that is a versioned amendment to this instrument.
2. **Q07 (forward vs backward vs lateral) is only half-measurable.** The engine has
   one forward-pass counter and no direction field on a pass, so backward and
   lateral are pooled. Named, not improvised.
3. **The CB arm is a multi-factor world** (three doors + the A4 census substrate +
   the wind-up seam + the proneness dose). It is the world the play-test entry
   actually arms, measured whole; no single-factor causal claim is available from
   it and none is made.
4. **Several REAL bands rest on aggregators or blogs** (Q06, Q11, Q17, Q18) rather
   than on Opta directly, and are graded LOW for exactly that reason. A future
   epoch may upgrade a grade; the grade is part of the versioned list, so an
   upgrade is an amendment with a receipt, not a silent edit.
5. **`stats.dribbles` is a trap and is quarantined.** The engine increments it on
   every non-recollect capture by an outfielder, so it is a possession-gain
   counter, not a take-on counter. It is published as CONTEXT and compared to no
   band; anyone reading it as "dribbles per match" would read a real-football
   number against a quantity that is not that quantity.

## §COMMANDER CORRECTIONS OF RECORD (#272.3, 2026-08-15 — ⚠ READ BEFORE QUOTING ANY ROW)

> ⭐⭐ **ALL SIX ARE DISCHARGED** by the instrument fix of #272.4(b): the design is in
> [§FIX](#fix), the corrected epoch-1 readings in
> [§CORRECTED EPOCH-1 READINGS](#corrected-epoch-1), and the re-run on the polished
> world in [§RESULT-2](#result-2--epoch-2-post-cb-polish-the-re-run-clauses-first-exercise-on-the-polished-world).
> The text below is kept VERBATIM as the record of what was ruled.

The verify: 20/21 OURS points re-derived exactly; CIs re-derived with an independent bootstrap;
all 8 inherited bands verbatim; 4 external citations fetched live; freeze-before-sight
git-corroborated (0-line probe diff); the ledger's append+refusal exercised on the real
filesystem; the cross-OUT digest reproduced. THE INSTITUTION STANDS. Three row-level readings and
one pattern claim DO NOT, and are quarantined of record:

* **(i) HIGH RATIFIED — Q11/Q10 ARE NOT QUOTABLE AS PUBLISHED.** `touchPasts` increments on
  knocks with ZERO challengers (mechanics.ts:1598-1601): ≥1,817 of 8,617 (21.1 %) of Q11's
  denominator are structurally incapable of a clean beat. The commensurable reading (attempts
  with a contesting body) is **≥ 0.4902 vs the band high 0.484 — the row's SIGN INVERTS**: our
  take-on success sits AT/ABOVE the real band, not just under it. Q10's stated semantics ("an
  aimed knock past a contesting body") is false for ≥21 % of its count. FIX ASSIGNED (the
  instrument round): re-key Q10/Q11 on challengers>0, publish the uncontested-knock count beside.
* **(ii) HIGH RATIFIED — THE DISTANCE TABLE MIXES TWO CLOCK CONVENTIONS ROW-BY-ROW**; the
  headline pattern ("every row sits BELOW real") is a CONSTRUCTION ARTIFACT. The engine's own
  mapping is 1 sim-s = 22.5 display-s; durations were compared on raw sim-seconds (convention A)
  while per-match counts implicitly treated 240 sim-s as a full 90′ (convention B). Under either
  single convention, 2–5 banded rows sit 1.6×–17× ABOVE real; Q01 and Q04 are the SAME FACT
  printed on two clocks (the #173 scaleCaveat — durations readable, counts not — was silently
  reversed for count rows). ⭐ OF RECORD: the cross-row PATTERN is not quotable; individual
  DURATION rows on convention A remain readable (Q01/Q02/Q03 short spells, short holds — the
  #170-era finding stands on its own axis). FIX ASSIGNED: one declared convention + BOTH axes
  printed for every row (Q04's dual-axis form generalized).
* **(iii) HIGH RATIFIED — "no sign inversion exists" is STRUCK**: Q17 bare = 1.11× ABOVE its high
  edge, Q18 cb = 1.06× ABOVE (masked by "CI overlaps" printing); vs the CITED point 0.375, Q18
  cb's CI [0.3775, 0.4725] EXCLUDES the real value. Our margin/draw tails are not "below real".
* **(iv) HIGH RATIFIED — five REAL band widths were INVENTED around single cited points**
  (Q09/Q13/Q17/Q18/Q21) and persisted into the standing ledger as the institution's reference.
  Frozen-before-sight, so provenance defect, not fitting — but a band the source never stated is
  not a source. FIX ASSIGNED: cited POINTS as points; any width carries a receipt; a
  `bandFidelity` conjunct joins gRealHonest; the five ledger rows are SUPERSEDED at the next
  epoch.
* **(v) MEDs**: Q20's published estimator is Σmax/Σtotal, not §1.1's per-match mean (both are in
  the artifact; the doc sentence + the "stronger team" label corrected — it is the per-match
  LEADER, an upward-biased max, teams are two random draws) · `gMutants` "exactly that conjunct"
  is ASSERTED NOT ENFORCED (proven live with a double-flip mutant — the CB-T1 enforcement form
  exists and was not inherited; recurrence of #266.2(vii)); the 67-mutant receipt proves
  necessity, not specificity. LOW: 56:58 vs the source's 56:59; Q21's pause-inclusive 251.2 s
  denominator vs the nominal-90 band (~4.7 %), discussed in prose but not carried into the factor.
* **(vi) What the epoch DOES establish, quotable now**: the paired arm DIRECTION (CB-armed:
  shorter spells, lower completion, more fouls/cards, more pressed, take-ons exist) · the
  convention-A duration rows · Q06 bare 0.98× (pass completion at the real band's edge) · the
  paired-seed design and the ledger institution itself.

## §COMMANDER CORRECTIONS OF RECORD (#273.3, 2026-08-15 — the instrument-fix round + epoch 2)

The verify: the re-key read off src (numerator ⊆ denominator by construction); the epoch-1 bound
re-derived from perCluster to 6 dp (Q11 ≥ 0.490147); all 21 rows × 2 arms machine-checked on the
declared clock (0 mixed rows); the five corrected REAL rows fetched live against their sources;
the ledger's first 42 lines byte-unchanged (+58/−0); exactly-one and the coverage refusal both
doctored and both fired; the full battery reproduced byte-for-byte cross-OUT on the verify's
machine. VERDICT: PASS-WITH-FINDINGS. Of record:

* **(i) THE CORRECTED PICTURE (quotable now)**: take-on success on the COMMENSURABLE denominator
  (contested knocks) = **0.6413 [0.626, 0.655]** in the polished world (epoch-1 re-key bound
  ≥ 0.4901) vs the cited real 0.401–0.484 — ⭐ our take-on success sits ABOVE real football's,
  the exact inverse of the quarantined epoch-1 reading; 37.1 % of aimed knocks have no
  contesting body (published beside). The dual-axis law: count rows read 3.7–17× ABOVE real on
  convention A and 0.2–0.8× below on B — the table now prints both and hides neither. Margin
  tails: Q18's CI excludes the cited 0.375 in BOTH arms. Post-polish deltas (unpaired, between-
  block noise caveat): CB spells 3.84→4.17 s, touches/spell 2.40→2.56, recoveries ≈flat.
* **(ii) F1 MED RATIFIED — `xSrcCleanTree` proves the INDEX, not HEAD**: staged-but-uncommitted
  src edits and untracked src files are invisible to `git diff --stat -- src` (demonstrated in a
  scratch repo). No effect this round (tree verified clean at HEAD, receipt reproduced). ⭐ CANON
  NOTE (all instruments): tree-clean gates compare WORKTREE vs HEAD (`git diff HEAD` +
  `git status --porcelain`), never the index. Fix rides the next probe touch.
* **(iii) LOWs recorded**: the report prose's "0.65–0.78× below on B" covered two of four named
  rows (the committed doc is right — the #229.2 chat-vs-artifact class again) · Q09's citedRange
  joins two non-commensurable numerals (a four-season floor + a partial-season figure) — the one
  MED-confidence row with a constructed range live; bandFidelity checks shape, not truth, as
  declared · the `--epoch1-corrections` tables print superseded rows unstamped (the prose
  explains; the `changedInstrument` stamp is assigned to the next generator touch).
* **(iv) THE PAIRING AMENDMENT (#273.3, ruled)**: future epochs MAY pair the bare control arm by
  re-walking the instrument's OWN declared control block (a declared re-walk, the G-REPRO
  precedent) so bare-arm drift reads as drift, not block noise; the armed arm keeps drawing
  virgin blocks. Applies from epoch 3.
