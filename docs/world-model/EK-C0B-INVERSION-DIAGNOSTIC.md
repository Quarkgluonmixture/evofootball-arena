# EK-C0b — THE 街机偏离 DIAGNOSTIC (为什么「看起来没人逼我」反而最容易丢球)

Status: **FROZEN, then RUN.** Everything from §CHARTER to §NON-CLAIMS — the world, the re-walked
population, the two indices, the three pre-registered predicates **and their margins**, the arms,
the seed ledger, the N rule and the gate list — is the design fixed **in the probe's own frozen
constants and gate predicates before any receipt ran**. The measured numbers live in
[§RESULT](#result), **GENERATED PROGRAMMATICALLY** from the committed artifacts by a committed
generator (`scripts/analysis/ek-c0b-diagnostic-result.ts`), never typed (#229.2).

⚠ **This document reports; it does not adjudicate (#203).** All three predicate verdicts are
mechanical readings of frozen predicates printed exactly as the artifact records them. **Which
mechanism the inversion IS, and which window EK-T1 takes of record, are the commander's.**

Authority chain: ruling **#260.3** (the diagnostic drafted and dispatched — this document's charter
verbatim in §CHARTER), on the census banked by **#260.1/#260.2**
([`EK-C0-HOLD-OUTCOME-CENSUS.md`](EK-C0-HOLD-OUTCOME-CENSUS.md)), under the
[`EK-HOLD-EARNED-BELIEF-CONTRACT.md`](EK-HOLD-EARNED-BELIEF-CONTRACT.md) (§0 the counterfactual/
observable split · §2 M-EK.1 the perceived index). Seat: [`C5-T2-WHETHER-SEAT.md`](C5-T2-WHETHER-SEAT.md)
and `src/ai/whetherEye.ts`. Hygiene canon: **#250.3** (mode-conditioned literals; headline counts
hand-checked) · **#251.3 / #252.3** (derive your own predicates; a mutant per conjunct) · **#256.3**
(per-cluster cells stored) · **#258.3** (timings unhashed) · **#260.2** (⭐ EVERY env override routes
through the preflight flag · ⭐ a mutant must RE-INVOKE the gate's own function · ⭐ a coverage claim
names its exact conjunct set) · **#163** · **#181.2** · **#20** · **#128** · **#203** · **#229.2**.

> ⭐ **INSTRUMENT-ONLY ROUND.** `src/**` is **byte-untouched** (`xSrcUntouched` is a HARD gate). No
> production or a4 world arms the seat. **Nothing measured here reaches any player** (#247), and
> **no number in this document is corrected into the EK-C0 table** — the census's
> `ek-c0.hold-truth-table.v1` yardstick is frozen and this stage does not touch it.

---

## §CHARTER — what #260.3 ordered (verbatim, and where each clause is discharged)

> THREE candidate mechanisms, each with a pre-registered predicate: **(W) THE PERCEPTION WEDGE** —
> perceived-free ≠ truly free (stale/absent percepts) … **(S) CONTEXT SELECTION** — the rare free-band
> moments concentrate in adverse contexts … plus an UNCAPPED-grid arm re-testing the inversion off
> the opening stretch; **(A) SATURATION ARTIFACT** — the shorter-window ladder (4/5 s) re-read as
> candidate primaries (discrimination vs saturation published; the EK-T1 window OF RECORD is picked
> by the commander on this evidence).

| clause | discharged in |
|---|---|
| (W) the truth-banded cross-cut of the SAME holds + the confusion matrix | §W · §RESULT |
| (S) per-band context profiles + the uncapped arm | §S · §RESULT |
| (A) 4/5 s re-read as candidate primaries, discrimination vs saturation | §A · §RESULT |
| the SAME holds, re-derived deterministically | §FORM (the re-walk) · **G-REPRO-EKC0** |
| instrument-only; fresh arms from 12,449,000; stats ≥ 108,600 | §SEEDS · **X-SRC-UNTOUCHED** · **G-SEED-DISJOINT** · **G-STATS-DISJOINT** |
| the #260.2 upgrades | **G-CLEAN-INVOCATION** (every override) · **G-MUTANTS** (re-invoking, named coverage) |

---

## §FORM — the population, and why it collides with the census on purpose

**THE POPULATION IS THE CENSUS'S OWN DOSED HOLDS, RE-DERIVED.** This probe re-walks the committed
census block with the census probe's own constructors — the same `Match` construction, the same
`CENSUS_FLAGS`, the same injected certified table, the same live arming, the same eligibility
predicate, the same sampling grid, the same forced-hold dose at k = 30 ticks, the same DV-C0 segment
walker and the same label closure — and records, **at each dosed moment**, two things the census did
not: the **TRUTH-side pressure band** and the **context profile**.

⭐⭐ **G-REPRO-EKC0 IS THE WHOLE CLAIM'S FOUNDATION.** "The same holds" is not asserted in prose: the
re-walk must reproduce the committed census artifact's **per-cluster cells FIELD-EXACT** — for every
seed, every `side|band` cell's `moments`, `punished` at all five windows, `sameChain`, `censored`,
`lostWithinMax`, `liveHolds`, `liveHoldsPunished`, plus each seed's `eligible`, `qualifying`, the
four decision-class counts, `turnovers`, `goals` and `simSeconds`. **The SUB-BLOCK runs FIRST** (the
census block's first `SUB_BLOCK_N` seeds) so a divergence fails in seconds rather than in an hour;
the full block is then checked seed by seed. Any mismatch turns the gate RED — and a RED
G-REPRO-EKC0 means this document's (W) and (S) tables are **not** about the census's holds at all.

**THE TWO INDICES.**

```text
PERCEIVED BAND (the census's index, M-EK.1)  the band `whetherEyeDecision` itself placed from the
                                             body's OWN perceived snapshot — what the chooser reads.
⭐ TRUTH BAND (this stage's second index)     the SAME pressure formula computed from TRUE opponent
                                             positions at the SAME decision instant: the shipped
                                             `pressureAt(owner.pos, opponents)` (src/ai/perception.ts,
                                             PRESSURE_RADIUS_M) placed at the certified table's OWN
                                             cuts — i.e. the census probe's own `trueCellOf` pressure
                                             component, truth-side. Nothing is re-typed: G-TRUTH-BAND
                                             cross-checks the shipped `pressureAt` against the seat's
                                             own inline formula on real decision instants, and the
                                             cuts against the committed table.
```

⚠ **THE TRUTH BAND IS A DIAGNOSTIC INDEX, NOT A REPLACEMENT INDEX.** M-EK.1 says a book indexes what
the chooser reads. The truth cross-cut exists to say **where the inversion lives**, and nothing in
this stage proposes re-indexing the belief.

**THE ESTIMATOR (identical to the census's, so the two tables are comparable):** cluster bootstrap
by **match seed** (#20), 2,000 resamples, percentile 95 % CI, **ratio-of-sums** per band, **ONE
shared resample-index matrix per arm** so every rate and every difference is paired by construction.
Verdict rule inherited verbatim: `RESOLVED-CONFIRM` (CI lower > 0) · `RESOLVED-INVERT` (CI upper < 0)
· `UNRESOLVED` (CI straddles 0).

**PER-CLUSTER CELLS ARE STORED** (#256.3): per seed × side × **perceived band × truth band** — the
moment count, punished at every window, lost, censored — and per seed × side × perceived band the
full context sums (zone counts, role counts, time sum/sum-of-squares/min/max, true-distance
sum/sum-of-squares). ⇒ **every CI and every margin in §RESULT re-derives from the artifact without a
re-run.**

---

## §W — THE PERCEPTION WEDGE (predicate frozen)

Published: the **truth-banded** hold-outcome table beside the **perceived-banded** one (same holds,
same windows, same estimator), and the full **3 × 3 perceived × truth confusion matrix** with each
cell's moment count, share and **punishment rate at the primary window**. ⭐ The
**perceived-free ∩ truth-pressed** cell is named ex ante as **THE WEDGE CELL**.

> **WEDGE-PREDICATE (FROZEN).** At the **PRIMARY window (10 s)**, on the same holds and the same
> bootstrap form: `WEDGE-CONFIRM` ⇔ the **truth-banded** `mid − free` difference is **NOT**
> `RESOLVED-INVERT` **AND** the **perceived-banded** `mid − free` difference **IS** `RESOLVED-INVERT`.
> Otherwise `WEDGE-DENIED`. The ladder (4/5/10/15/20 s) is published for context and does not enter
> the verdict.

⚠ If the perceived limb fails to invert on the re-walk, the predicate reads `WEDGE-DENIED` **and**
G-REPRO-EKC0 is the thing to look at first: the census's own primary-window reading is
`RESOLVED-INVERT`, so a non-inverting re-walk is an instrument failure, not a finding.

## §S — CONTEXT SELECTION (predicate + FOUR margins frozen)

**Per perceived band**, four context profiles, each on the dosed-hold population:

1. **PITCH ZONE** — the holder's attacking-direction-local third at the decision instant (`own` /
   `middle` / `final`, the DV-C0 zoning inherited: cuts at ±`HALF_L / 3`).
2. **MATCH TIME** — the decision instant's sim-time (mean / SD / min / p10 / median / p90 / max),
   ⚠ read under the census's **cap-bound opening-stretch scoping** (#260.2(iv): the per-match grid
   cap BINDS, so the capped arm samples each match's opening stretch).
3. **HOLDER ROLE MIX** — the registered role of the holding body (`DF` / `MF` / `WG` / `ST`; `GK` is
   excluded by the seat's own eligibility predicate).
4. **NEAREST TRUE OPPONENT DISTANCE** — metres to the nearest non-sent-off opponent at the decision
   instant (the raw distance, not the clamped pressure).

**PLUS ONE FRESH UNCAPPED-GRID ARM** on a fresh seed block: identical world, identical dose,
identical label — **the per-match moment cap REMOVED** (`PER_MATCH_CAP → ∞`, so eligible moments are
sampled at the same 30-tick spacing across the **whole** match instead of stopping after 80). Its
own N is derived from its own smoke by the frozen rule in §NRULE.

> **SELECTION-PREDICATE (FROZEN).** `SELECTION-CONFIRM` ⇔ **EITHER** (a) the inversion **vanishes**
> in the uncapped arm — its primary-window `mid − free` verdict is `UNRESOLVED` or
> `RESOLVED-CONFIRM` — **OR** (b) **any** of the four margins below fires, comparing the **free**
> band against the **pooled other two bands** on the capped (census) arm. Otherwise
> `SELECTION-DENIED`. Both limbs are printed separately and mechanically.

| # | margin (frozen ex ante, free vs pooled mid+pressed) | fires iff |
|---|---|---|
| **M-ZONE** | share of holds in the **own** third | \|Δshare\| ≥ **10.0 pp** **and** the paired cluster-bootstrap CI of Δ excludes 0 |
| **M-TIME** | mean decision sim-time (s) | \|Δmean\| ≥ **15.0 s** **and** the paired CI of Δ excludes 0 |
| **M-ROLE** | total-variation distance between the two role mixes | TVD ≥ **0.10** **and** the bootstrap CI's lower bound ≥ **0.05** |
| **M-DIST** | mean nearest-TRUE-opponent distance (m) | \|Δmean\| ≥ **2.0 m** **and** the paired CI of Δ excludes 0 |

Every margin is computed on the SAME shared resample matrix as the rate differences, so it is paired
by construction. ⚠ **M-DIST is expected to fire by construction** (the perceived band is a noisy read
of the truth distance) and is registered anyway, because a pre-registered margin that is obvious in
advance is still a margin — its NUMBER is the informative part, and the commander reads limb (a) and
limb (b) separately for exactly this reason.

## §A — SATURATION (no verdict, by charter)

The **4 s** and **5 s** windows are re-read as **CANDIDATE PRIMARIES** on the same holds. Published
per window (all five: 4 / 5 / 10 / 15 / 20 s):

* the **baseline** punish rate (all bands pooled) with CI — the saturation reading;
* both **band gaps** (`pressed − mid`, `mid − free`) with paired CIs and verdicts;
* ⭐ a **DISCRIMINATION SUMMARY**: each gap's **gap-to-baseline ratio** (|gap| ÷ baseline) and the
  **spread** (max band rate − min band rate) ÷ baseline. A window that discriminates carries a large
  ratio at a baseline far from 1; a saturated window carries a small ratio at a baseline near 1.

> **NO PREDICATE, NO VERDICT (charter).** The EK-T1 window **of record** is the commander's pick on
> this evidence. This section names no winner and this probe prints no recommendation.

---

## §SEEDS — the re-walk COLLIDES BY DESIGN; every fresh arm above 12,449,000 (#163)

| block | seeds | kind |
|---|---|---|
| ⭐⭐ **the census re-walk** | the committed census block, **READ from the census artifact** (`result.seeds.base` / `.n`) | **RECEIPT — the disjointness predicate is INVERTED (it MUST collide)** |
| smoke | 12,449,000–12,449,011 | reserved, walked in smoke mode |
| ⭐ exit-semantics **guard block** | 12,449,050–12,449,099 | reserved — where EVERY non-clean invocation is routed |
| uncapped arm + reserve | 12,449,100–12,449,299 (N ≤ 200) | reserved, fresh |
| G-WORLD construction seed | 12,449,999 | constructed, **never stepped** |

The consumed ledger is EK-C0's committed list extended with **EK-C0's own band (12,448,000–999)**
— its presence is itself a gate conjunct. Sub-blocks are ordered and disjoint; the fresh band opens
strictly above everything consumed.

**Stats streams:** the re-walk arm's base **108,600** (ruling #260.3's floor), the uncapped arm's
**108,800**; minimum gap ≥ 200 to each other and ≥ 200 to every published base (EK-C0's own 108,200
included in the published list).

## §NRULE — the two arms are sized differently, and neither is guessed

```text
RE-WALK ARM     N is NOT chosen: it is READ from the committed census artifact
                (result.seeds.n at result.seeds.base). G-N-DERIVED asserts the walked block
                EQUALS the artifact's block — a re-walk that walked a different N would not be
                a re-walk.

UNCAPPED ARM    N* = min( ceil(150 / freeBandHoldsPerMatch) ↑10,
                          floor(0.35 h / (ms/match × 2 X-DET)),
                          200 )
                150 free-band holds ⇒ a free-band rate's SE ≈ sqrt(0.75 × 0.25 / 150) ≈ 3.5 pp,
                so the census's own −9.94 pp mid−free gap sits at ≈ 2 SE — the precision at
                which "the inversion vanished" is a readable statement rather than a shrug.
                `freeBandHoldsPerMatch` and `ms/match` are the ONLY two numbers a full run reads
                out of the committed smoke artifact; they feed ONLY N. The 200 cap is the
                reserved seed room, an honest seed-budget cap.
```

⭐ **SMOKE (a mode-conditioned literal, #250.3):** the smoke re-walks the census block's first **12**
seeds (the sub-block) and runs **4** uncapped seeds, both **FIXED here**; it publishes exactly the two
sizing numbers above and **adjudicates nothing**.

⭐ **THE ZERO-EVENT CLAUSE (inherited from EK-C0's own rule, frozen with the rest):** if the smoke
sees **zero** free-band dosed holds, the precision term is **UNBOUNDED** and the wall term and the
seed-budget cap bind; the artifact records `precisionTermUnbounded` either way.

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

| gate | what it proves |
|---|---|
| **xDet** (×2) | the whole measured core computed twice (two independent walks of both arms; pass B **never** resumes from the checkpoint), canonical-JSON digests identical |
| **xSrcUntouched** | `git diff --stat -- src` empty — instrument-only, HARD |
| **xFpProd** | the shipped league fingerprint re-derived in this process, unchanged |
| ⭐ **gConfigIdentity** | the re-walked world **is** the census's world, checked against the **committed census probe's own SOURCE** conjunct by conjunct (flags, duration, cap, spacing, support window, squad derivation, table SHA + path, hold-k, primary window, ladder, C5-native row, arm, scope, live arming) |
| ⭐⭐ **gReproEkc0** | **THE SAME HOLDS**: the census artifact's per-cluster cells reproduced FIELD-EXACT, sub-block first then the full block, with the field count and the mismatch count both published |
| ⭐ **gTruthBand** | the truth index is the shipped formula at the certified cuts: `pressureAt` is imported from `src/ai/perception`, its radius constant is the shipped one, the cuts are the committed table's own, and the shipped `pressureAt` **agrees with the seat's own inline formula** (two independently written implementations) on every sampled real decision instant — ⚠ **NOT** a function compared with itself (#260.2(ii)) |
| ⭐⭐ **gWedgeAccounting** | the cross-cut adds up: the confusion matrix's cells sum to the perceived-band marginals AND to the truth-band marginals AND to the census's dosed total; punished ⊆ lost in every cell; punished monotone in the window; lost and moments invariant in it; the context profiles' moment counts tie to the same denominators |
| ⭐ **gUncappedArm** | the fresh arm really is uncapped and otherwise identical: the cap is removed (not merely raised), its moments-per-match materially exceed the capped arm's, its decision instants extend past the capped arm's last sampled instant, and its flags/duration/dose/label are byte-equal to the capped arm's configuration |
| **gWorld** | the arm is the census world and nothing else moved, read back on a freshly constructed, never-stepped match |
| **gSeedDisjoint** | every block machine-checked against the ledger; the re-walk's predicate **INVERTED**; EK-C0's own band present as a conjunct |
| **gStatsDisjoint** | both bases ≥ the #260.3 floor 108,600, min gap ≥ 200 to the published ledger and between the two arms |
| ⭐ **gCleanInvocation** | **#260.2(i) DISCHARGED**: `EKC0B_N` · `EKC0B_CAP` · `EKC0B_UNCAPPED_N` · `EKC0B_SKIP_FP` — **EVERY** override sets the preflight flag, routes the run onto the guard block, turns this gate RED and exits 1; a preflight can never write a canonical repo path (guarded at parse time **and** on the RESOLVED absolute path) |
| **gNDerived** | the re-walk block **is** the artifact's block, and the uncapped arm's N **is** the frozen §NRULE output |
| ⭐ **gValuesUnreachable** | none of the published rates appears in `src/**`, searched in BOTH the raw 5-dp form **and the formatted percentage form the tables print**; degenerate cells excluded by a declared floor, a non-vacuity floor on the search-set size, and a control needle that must be found |
| ⭐ **gFrozenMargins** | the four §S margins and the two §W/§S predicate names in **this document** are the probe's own frozen constants — the doc text is read and each margin literal matched, so the frozen half cannot drift from the code that scores it |
| ⭐⭐ **gMutants** | **#260.2(iii) DISCHARGED**: every conjunct of every composite gate carries its own mutant, each mutant **RE-INVOKES that gate's own conjunct function** on a perturbed input and must flip exactly that conjunct, and the coverage claim asserts the mutated key set **EQUALS** each covered gate's own conjunct key set (published in full) |

⭐ **THE HEADLINE COUNT, HAND-CHECKED against this frozen list (#250.3(i), the standing check):** the
table above has **16** rows — `xDet · xSrcUntouched · xFpProd · gConfigIdentity · gReproEkc0 ·
gTruthBand · gWedgeAccounting · gUncappedArm · gWorld · gSeedDisjoint · gStatsDisjoint ·
gCleanInvocation · gNDerived · gValuesUnreachable · gFrozenMargins · gMutants` — and the artifact's
`gates` object carries exactly those **16** keys, which is the number every headline quotes.

**No gate reads a rate.** The three predicate verdicts are mechanical readings, not gates: a
`WEDGE-DENIED` or a `SELECTION-DENIED` turns nothing red.

## §CHECKPOINT — how a torn-down battery is resumed

Pass A appends one JSON line per walked match to `/tmp/ek-c0b-checkpoint.<mode>.<arm>.jsonl`
(outside the repo, so a kill leaves no repo state). `EKC0B_RESUME=1` lets pass A re-use those rows;
**pass B never resumes**, so **X-DET is itself the checkpoint's integrity proof**. `EKC0B_RESUME` is
therefore *not* an override of the measured design and does not route the run onto the guard block
(the artifact's unhashed envelope records whether it was set) — every override that CHANGES WHAT IS
MEASURED does route, per #260.2(i).

## §NON-CLAIMS

1. **NOTHING SHIPS.** Zero `src/**` bytes; the production fingerprint re-derived unchanged; the seat
   is armed only inside this probe's own matches.
2. ⭐⭐ **NO NUMBER HERE IS CORRECTED INTO THE EK-C0 TABLE (#246).** The census's yardstick is frozen;
   this stage diagnoses the inversion and changes nothing about it.
3. **THIS STAGE ADJUDICATES NOTHING (#203).** Which mechanism the inversion is, and which window
   EK-T1 takes of record, are the commander's.
4. **THE TRUTH BAND IS NOT PROPOSED AS AN INDEX.** M-EK.1's perceived index stands; the truth
   cross-cut is a diagnostic.
5. **NO CAUSAL CLAIM.** Bands are not randomly assigned and contexts are not controlled; every
   number is a conditional rate or a conditional profile. The dosed hold remains a TREATMENT, not a
   choice (EK-C0 §NON-CLAIMS 5, inherited).
6. **THE THREE MECHANISMS ARE NOT EXCLUSIVE.** More than one predicate may fire; the predicates are
   registered separately precisely so a joint reading stays visible.
7. **THE UNCAPPED ARM IS A DIFFERENT SAMPLE, NOT A REPEAT.** Fresh seeds, no cap: it answers "off the
   opening stretch", not "does the census replicate".

---
## §RESULT

**Re-walk 583 seeds (the committed census block 12,448,100–12,448,682) + a fresh UNCAPPED arm of 50 seeds, 16/16 gates PASS**, `resultSha256` `9b2fb7b9…9228`. Every number below is printed by `scripts/analysis/ek-c0b-diagnostic-result.ts` from the committed artifact; none is typed (#229.2).

### The two arms

```text
census artifact  docs/world-model/data/ek-c0-hold-outcome-census.json
                 sha256 7a1c2700794e43082331ffa75a6cf5ce6ef7cf146175c52527639b23ef3b0e6c
RE-WALK (capped) 583 matches · 19.3293 dosed holds/match · 11,269 holds · stats base 108,600
UNCAPPED (fresh) 50 matches · 37.0200 dosed holds/match · 1,851 holds · stats base 108,800
⭐ G-REPRO-EKC0   sub-block 1,764 fields / 0 mismatches · FULL BLOCK 85,701 fields / 0 mismatches
   ⇒ THE SAME HOLDS: every per-cluster cell of the census reproduced field-exact.
last decision instant (max over matches): capped 238.80 s · uncapped 243.78 s   (the cap-bound opening stretch, made visible)
```

## §RESULT-W — THE PERCEPTION WEDGE

### The two banded tables, SAME holds, primary window (10 s)

| band | PERCEIVED: holds | punished | **P(punished)** | CI 95 % (pp) | TRUTH: holds | punished | **P(punished)** | CI 95 % (pp) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **free** (band 0) | 272 | 216 | **79.412 %** | [74.144, 84.083] | 99 | 87 | **87.879 %** | [80.000, 94.783] |
| mid (band 1) | 2,319 | 1,611 | **69.470 %** | [67.293, 71.630] | 685 | 461 | **67.299 %** | [63.571, 70.885] |
| ⭐ **pressed** (band 2) | 8,678 | 6,494 | **74.833 %** | [73.732, 75.925] | 10,485 | 7,773 | **74.134 %** | [73.053, 75.167] |
| **ALL** | 11,269 | 8,321 | **73.840 %** | [72.803, 74.852] | 11,269 | 8,321 | **73.840 %** | [72.803, 74.852] |

### The shape ladder on BOTH indices (same holds, same estimator)

| window | PERCEIVED pressed−mid | verdict | PERCEIVED mid−free | verdict | TRUTH pressed−mid | verdict | TRUTH mid−free | verdict |
|---|---:|---|---:|---|---:|---|---:|---|
| 5 s | 7.000 | RESOLVED-CONFIRM | -4.737 | UNRESOLVED | 6.595 | RESOLVED-CONFIRM | 0.286 | UNRESOLVED |
| 10 s **(PRIMARY)** | 5.363 | RESOLVED-CONFIRM | -9.942 | RESOLVED-INVERT | 6.835 | RESOLVED-CONFIRM | -20.580 | RESOLVED-INVERT |
| 15 s | 2.357 | RESOLVED-CONFIRM | -4.341 | RESOLVED-INVERT | 1.853 | UNRESOLVED | -8.269 | RESOLVED-INVERT |
| 20 s | 2.280 | RESOLVED-CONFIRM | -1.803 | UNRESOLVED | 2.303 | UNRESOLVED | -5.046 | UNRESOLVED |
| 4 s *(C5-native)* | 7.721 | RESOLVED-CONFIRM | -2.595 | UNRESOLVED | 7.075 | RESOLVED-CONFIRM | 7.128 | UNRESOLVED |

CI 95 % of the primary-window `mid − free` difference: PERCEIVED [-15.125, -4.508] pp · TRUTH [-28.376, -12.289] pp.

### ⭐⭐ THE CONFUSION MATRIX — perceived × truth, with per-cell punishment rate (10 s)

| perceived \ truth | free | mid | pressed | row total |
|---|---|---|---|---:|
| **free** (band 0) | 99 · 87.879 % | 151 · 74.172 % | 22 · 77.273 % ⭐**WEDGE** | 272 |
| mid (band 1) | 0 · n/a | 527 · 65.275 % | 1,792 · 70.703 % | 2,319 |
| ⭐ **pressed** (band 2) | 0 · n/a | 7 · 71.429 % | 8,671 · 74.836 % | 8,678 |
| **column total** | 99 | 685 | 10,485 | 11,269 |

Each cell prints **holds · P(punished)**. Perceived-band agreement with the truth band: **82.501 %** of dosed holds. ⭐ THE WEDGE CELL (perceived free ∩ truly pressed): **22 holds**, P(punished) **77.273 %** [58.333, 93.109].

### ⭐ WEDGE-PREDICATE (frozen in §W, evaluated mechanically)

```text
perceived mid−free @ 10 s   RESOLVED-INVERT     (limb: perceived INVERTS = true)
TRUTH     mid−free @ 10 s   RESOLVED-INVERT     (limb: truth NOT inverted = false)
⇒ WEDGE-DENIED
```

## §RESULT-S — CONTEXT SELECTION

### The four context profiles, per PERCEIVED band (capped/census arm)

| band | holds | own third | middle | final | match time mean (s) | median | p90 | nearest TRUE opponent mean (m) | median | mean TRUE pressure |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **free** (band 0) | 272 | 39.338 % | 39.338 % | 21.324 % | 62.12 | 62.08 | 113.12 | 5.766 | 4.561 | 0.2185 |
| mid (band 1) | 2,319 | 8.236 % | 56.576 % | 35.188 % | 62.82 | 60.88 | 111.05 | 2.937 | 2.885 | 0.5105 |
| ⭐ **pressed** (band 2) | 8,678 | 6.246 % | 59.011 % | 34.743 % | 63.89 | 60.43 | 117.00 | 1.425 | 1.202 | 0.7625 |

| band | DF | MF | WG | ST | (GK) |
|---|---:|---:|---:|---:|---:|
| **free** (band 0) | 23.162 % | 24.265 % | 40.809 % | 11.765 % | 0 |
| mid (band 1) | 8.236 % | 11.945 % | 60.371 % | 19.448 % | 0 |
| ⭐ **pressed** (band 2) | 9.034 % | 14.208 % | 46.820 % | 29.938 % | 0 |

### The four PRE-NAMED margins (free vs pooled mid+pressed, frozen in §S before any receipt)

| margin | frozen threshold | measured Δ | CI 95 % | fires? |
|---|---|---:|---:|---|
| **M-ZONE** own-third share | ≥ 10 pp, CI excludes 0 | 32.673 pp | [23.215, 41.377] | **YES** |
| **M-TIME** mean decision time | ≥ 15 s, CI excludes 0 | -1.552 s | [-7.027, 3.984] | no |
| **M-ROLE** role-mix TVD | ≥ 0.1, CI lower ≥ 0.05 | 0.24829 | [0.15996, 0.33634] | **YES** |
| **M-DIST** mean true distance | ≥ 2 m, CI excludes 0 | 4.022 m | [3.518, 4.537] | **YES** |

### ⭐ THE UNCAPPED-GRID ARM — 50 fresh seeds, per-match cap REMOVED

Moments per match: capped **19.3293** → uncapped **37.0200** (× 1.92); last sampled decision instant 238.8 s → 243.8 s.

| band | holds | punished | **P(punished)** | CI 95 % (pp) |
|---|---:|---:|---:|---:|
| **free** (band 0) | 40 | 27 | **67.500 %** | [51.852, 82.759] |
| mid (band 1) | 364 | 240 | **65.934 %** | [59.158, 72.645] |
| ⭐ **pressed** (band 2) | 1,447 | 1,070 | **73.946 %** | [70.922, 76.594] |
| **ALL** | 1,851 | 1,337 | **72.231 %** | — |

Uncapped shape @ 10 s: `pressed − mid` **8.012 pp** [0.867, 15.299] ⇒ RESOLVED-CONFIRM · `mid − free` **-1.566 pp** [-18.563, 15.311] ⇒ **UNRESOLVED**.

### ⭐ SELECTION-PREDICATE (frozen in §S, evaluated mechanically)

```text
limb (a) the inversion VANISHES in the uncapped arm   true   (uncapped mid−free verdict: UNRESOLVED)
limb (b) any pre-named margin fires                   true   (fired: ["mZone","mRole","mDist"])
⇒ SELECTION-CONFIRM
```

## §RESULT-A — SATURATION (the 4/5 s candidate-primary re-read, NO VERDICT)

| window | baseline P(punished) | CI 95 % | free | mid | pressed | pressed−mid | mid−free | spread ÷ baseline |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 5 s ⭐**(CANDIDATE)** | **55.914 %** | [54.678, 57.134] | 55.147 % | 50.410 % | 57.410 % | 7.000 (RESOLVED-CONFIRM) | -4.737 (UNRESOLVED) | 0.1252 |
| 10 s *(census primary)* | **73.840 %** | [72.803, 74.852] | 79.412 % | 69.470 % | 74.833 % | 5.363 (RESOLVED-CONFIRM) | -9.942 (RESOLVED-INVERT) | 0.1346 |
| 15 s | **85.447 %** | [84.653, 86.243] | 87.868 % | 83.527 % | 85.884 % | 2.357 (RESOLVED-CONFIRM) | -4.341 (RESOLVED-INVERT) | 0.0508 |
| 20 s | **90.070 %** | [89.383, 90.721] | 90.074 % | 88.271 % | 90.551 % | 2.280 (RESOLVED-CONFIRM) | -1.803 (UNRESOLVED) | 0.0253 |
| 4 s ⭐**(CANDIDATE)** | **49.002 %** | [47.705, 50.311] | 45.588 % | 42.993 % | 50.714 % | 7.721 (RESOLVED-CONFIRM) | -2.595 (UNRESOLVED) | 0.1576 |

| window | \|pressed−mid\| ÷ baseline | \|mid−free\| ÷ baseline | band spread (pp) |
|---|---:|---:|---:|
| 5 s | 0.1252 | 0.0847 | 7.000 |
| 10 s | 0.0726 | 0.1346 | 9.942 |
| 15 s | 0.0276 | 0.0508 | 4.341 |
| 20 s | 0.0253 | 0.0200 | 2.280 |
| 4 s | 0.1576 | 0.0530 | 7.721 |

⚠ ⭐ NO VERDICT (the charter): the EK-T1 window OF RECORD is the commander's pick on this evidence. This block ranks nothing and recommends nothing.

### Gate table

| gate | result | evidence |
|---|---|---|
| `xDet` | **PASS** | digest `bb211082…b87d` twice (both arms; pass B never resumes) |
| `xSrcUntouched` | **PASS** | `git diff --stat -- src` empty |
| `xFpProd` | **PASS** | observed `57b0bdab…c673` = baseline, re-derived in-process |
| `gConfigIdentity` | **PASS** | 24 conjuncts against the committed census probe's SOURCE |
| `gReproEkc0` | **PASS** | sub-block 1,764 fields **0 mismatches** · full block 85,701 fields **0 mismatches** (12448100..12448682) |
| `gTruthBand` | **PASS** | 1,440 real decision-geometry samples, 0 band disagreements, max \|Δ\| 0 (shipped `pressureAt` vs the seat's inline formula) |
| `gWedgeAccounting` | **PASS** | confusion/marginals/context all tie to 11,269 dosed holds · punished ⊆ lost in every cell · monotone/invariant checks |
| `gUncappedArm` | **PASS** | cap removed · moments/match 19.33 → 37.02 · last instant 238.8 s → 243.8 s |
| `gWorld` | **PASS** | read back on a never-stepped match at seed 12,449,999 |
| `gSeedDisjoint` | **PASS** | 5 blocks machine-checked (the re-walk's predicate INVERTED) · ledger 63 entries |
| `gStatsDisjoint` | **PASS** | bases 108,600 / 108,800, minGap 400, between-arm gap 200 |
| `gCleanInvocation` | **PASS** | overrides covered: EKC0B_N · EKC0B_CAP · EKC0B_UNCAPPED_N · EKC0B_SKIP_FP — all route through the preflight flag (#260.2(i)) |
| `gNDerived` | **PASS** | re-walk N 583 = the artifact's N · uncapped N* 50 (binding: precision) |
| `gValuesUnreachable` | **PASS** | 140 src files · 22 needles (raw 5-dp + formatted %) · 0 hits · control needle found |
| `gFrozenMargins` | **PASS** | all four margin literals, both predicate names, the no-verdict clause, all 16 gate names and the headline count matched in the stage doc |
| `gMutants` | **PASS** | **86 conjuncts, 0 dead** — every mutant RE-INVOKES its gate's conjunct function; coverage EXACT on 10 gates, zero exclusions |

### The accounting identities (gate input)

```text
dosed holds        11,269 = D-HOLD 223 + E-ACTNOW-DECLINED 11,046
perceived marginal 11,269   truth marginal 11,269   confusion cells 11,269
context cells      11,269   zone counts 11,269   role counts 11,269   samples 11,269
  @ 5 s   punished  6,301 (truth-side  6,301) · lost 10,151 INVARIANT · moments 11,269 INVARIANT · censored 1
  @10 s   punished  8,321 (truth-side  8,321) · lost 10,151 INVARIANT · moments 11,269 INVARIANT · censored 1
  @15 s   punished  9,629 (truth-side  9,629) · lost 10,151 INVARIANT · moments 11,269 INVARIANT · censored 1
  @20 s   punished 10,150 (truth-side 10,150) · lost 10,151 INVARIANT · moments 11,269 INVARIANT · censored 1
  @ 4 s   punished  5,522 (truth-side  5,522) · lost 10,151 INVARIANT · moments 11,269 INVARIANT · censored 1
```

### The uncapped arm's N as executed

```text
N* = min( ceil(150 / freeBandHoldsPerMatch) ↑10, floor(0.35 h / (ms/match × 2 X-DET)), 200 ) — frozen in the stage doc §NRULE BEFORE the smoke ran. 150 free-band holds ⇒ SE ≈ 3.5 pp, so the census's own −9.94 pp mid−free gap sits at ≈ 2 SE.
smoke artifact  docs/world-model/data/ek-c0b-inversion-diagnostic-smoke.json (sha256 cff9ef8c…d85f)
free-band holds/match 3.25000 · ms/match 3180.3
nRaw 47 → stepped 50 · wall 198 · cap 200  ⇒ N* 50 (precision)
as executed     N 50 · realised free-band holds 40 against the rule's target 150
```

### Deviations recorded

1. ⭐ THE RE-WALK COLLIDES WITH THE COMMITTED CENSUS BLOCK BY DESIGN (#260.3 declares it): its disjointness predicate is INVERTED — it MUST collide, because a clash-free re-walk would be walking fresh seeds instead of reproducing a receipt.
2. THE QUANTILE ROWS (match-time and true-distance p10/median/p90) are POOLED reads over all dosed moments, not cluster-bootstrapped; every CI-BEARING quantity (rates, differences, shares, means, TVD) is cluster-bootstrapped by match seed and re-derives from the stored per-cluster cells.
3. THE UNCAPPED ARM REMOVES THE CAP RATHER THAN RAISING IT (#260.3 allowed either; the stronger option is taken) and is therefore a SMALLER seed block at a much higher per-match cost.
4. M-DIST IS EXPECTED TO FIRE BY CONSTRUCTION (the perceived band is a noisy read of the true distance); it is registered anyway because its NUMBER is the informative part, and limb (a) and limb (b) of the selection predicate are printed separately for exactly this reason.
5. THE CONTEXT PROFILES ARE INDEXED BY THE PERCEIVED BAND ONLY (the charter's wording); the truth-band cross-cut of the same moments is available in the stored per-cluster cells.

### Registered non-claims (from the artifact)

1. NOTHING SHIPS: zero src/** bytes; the production fingerprint re-derived unchanged; the seat is armed only inside this probe's own matches.
2. ⭐⭐ NO NUMBER HERE IS CORRECTED INTO THE EK-C0 TABLE (#246). The census's yardstick is frozen.
3. THIS STAGE ADJUDICATES NOTHING (#203): which mechanism the inversion is, and which window EK-T1 takes of record, are the commander's.
4. THE TRUTH BAND IS NOT PROPOSED AS AN INDEX. M-EK.1's perceived index stands.
5. NO CAUSAL CLAIM: bands are not randomly assigned and contexts are not controlled. The dosed hold remains a TREATMENT, not a choice.
6. THE THREE MECHANISMS ARE NOT EXCLUSIVE — more than one predicate may fire.
7. THE UNCAPPED ARM IS A DIFFERENT SAMPLE, NOT A REPEAT: fresh seeds, no cap.

**VERDICT (the probe's own, mechanical — #203): (W) WEDGE-DENIED · (S) SELECTION-CONFIRM · (A) NO VERDICT BY CHARTER.** What the inversion IS, and which window EK-T1 takes of record, are the commander's.

### §CHECKS (#226.1)

```text
$ npx tsc --noEmit
(clean)

$ EKC0B_MODE=smoke EKC0B_CAP=2 EKC0B_OUT=docs/world-model/../world-model/data/x.json \
    npx tsx scripts/probes/ek-c0b-inversion-diagnostic.ts
  EK-C0b FATAL — a PREFLIGHT invocation may not write a canonical repo path (the canonical-write
  guard, #260.2(i)). Preflight because: EKC0B_CAP.
  exit 2 · no file written (the traversal spelling is RESOLVED, not substring-tested)

$ for v in EKC0B_N=3 EKC0B_CAP=2 EKC0B_UNCAPPED_N=2 EKC0B_SKIP_FP=1; do
    EKC0B_MODE=smoke $v EKC0B_OUT=/tmp/ekc0b-guard.json npx tsx scripts/probes/ek-c0b-inversion-diagnostic.ts; done
  ⭐ ALL FOUR overrides route BOTH arms onto the guard block 12,449,050–12,449,099 and turn
  gCleanInvocation + gNDerived RED (gReproEkc0/gTruthBand/gMutants also red — a guard-block walk is
  not the census block, which is exactly what a preflight looks like):
  GATES *** RED *** (16) · exit 1        ← the census block and the fresh block stay VIRGIN

$ EKC0B_MODE=smoke npx tsx scripts/probes/ek-c0b-inversion-diagnostic.ts
  GATES GREEN (16) · G-REPRO-EKC0 sub-block 1,764 fields 0 mismatches · G-MUTANTS 86 conjuncts 0 dead
  exit 0 · resultSha256 bb2215b879d545a1163116a5a62be17ca3f343126de8788005529893a28c3e99
  wall 74.0 s (CONTEXT ONLY) · artifact docs/world-model/data/ek-c0b-inversion-diagnostic-smoke.json

$ EKC0B_MODE=full npx tsx scripts/probes/ek-c0b-inversion-diagnostic.ts
  GATES GREEN (16) · re-walk 583 seeds 12,448,100–12,448,682 · uncapped 50 seeds 12,449,100–12,449,149
  G-REPRO-EKC0 full block 85,701 fields 0 mismatches · G-MUTANTS 86 conjuncts 0 dead, coverage exact
  exit 0 · resultSha256 9b2fb7b94c30e1cfab7978b3c9d36cd87ad9d121878be5a7bc18490597ed9228
  wall 1,952.8 s (CONTEXT ONLY) · artifact docs/world-model/data/ek-c0b-inversion-diagnostic.json

$ npx tsx scripts/analysis/ek-c0b-diagnostic-result.ts \
    docs/world-model/data/ek-c0b-inversion-diagnostic.json
  → the whole §RESULT section above, on stdout
```

⭐ The smoke's FIRST run came back RED on two gates and both failures were real instrument faults,
fixed before the battery and recorded here rather than hidden: `gTruthBand`'s sample floor was not
met (360 checks against a floor of 500 — the sweep was widened to 1,440), and **one G-MUTANTS
conjunct was DEAD** — `gConfigIdentity.squadDerivationSame`'s mutant used a single-occurrence
`String.replace` while the census probe carries the SAME construction line **twice** (`examMatch`
and `prodMatch`), so the conjunct stayed satisfied by the second copy. That is the #251.3 class the
gate exists to catch, caught by the gate, on this stage's own code.

`npm test` is **not** re-run and is named rather than implied: this round adds **one probe, one
generator, two artifacts and one doc**, touches **no** `tests/**` file and **no** `src/**` byte
(`xSrcUntouched` is a HARD gate and PASSES on the run that wrote the artifact), so the suite's state
is the one banked at the previous commit.

### Facts that are *not* deviations, recorded anyway

1. ⚠⚠ **THE INVERSION IS NOT IN PERCEPTION — IT IS DEEPER ON THE TRUTH INDEX.** The re-walk
   reproduces the census exactly (85,701 fields, 0 mismatches), so the perceived-banded `mid − free`
   inversion is present as banked (−9.942 pp, RESOLVED-INVERT). Cross-cut by the **TRUE** pressure
   band the same holds give **free 87.879 % > pressed 74.134 % > mid 67.299 %** and `mid − free`
   **−20.580 pp [−28.376, −12.289], RESOLVED-INVERT** — twice the perceived magnitude. **WEDGE-DENIED**
   by the frozen predicate. The unchecked-shoulder story is not what is happening here.
2. ⭐ **THE PERCEPT ONLY EVER UNDER-READS PRESSURE, NEVER OVER-READS IT.** The confusion matrix's
   lower-left is empty: 0 holds are perceived mid or pressed while truly free, and only 7 of 8,678
   perceived-pressed holds are truly mid. The wedge cell (perceived free ∩ truly pressed) carries
   **22** holds — 0.195 % of the population — far too few to move a 272-hold band.
3. ⭐⭐ **THE FREE BAND IS A DIFFERENT KIND OF MOMENT, IN THE ZONE AXIS ABOVE ALL.** **39.338 %** of
   perceived-free holds sit in the holder's **OWN third** against 8.236 % (mid) and 6.246 %
   (pressed) — a **+32.673 pp** margin [23.215, 41.377] against a frozen threshold of 10 pp. The role
   mix differs too (TVD **0.248**), and the true nearest opponent is **+4.022 m** further away.
   **M-TIME does NOT fire** (−1.552 s, CI straddles 0): the free band is not an early-match artifact.
4. ⭐ **OFF THE OPENING STRETCH THE INVERSION IS NO LONGER RESOLVED.** In the fresh uncapped arm
   (37.02 dosed holds/match vs 19.33) `mid − free` is **−1.566 pp [−18.563, 15.311] UNRESOLVED**
   while `pressed − mid` still confirms (+8.012 pp). ⚠ Its free band carries only **40** holds
   against the rule's target of 150 — the realised free-band rate was **0.800** holds/match against
   the 4-match smoke's projected **3.250** (a **4.06×** shortfall the frozen rule sized on and this
   stage RECORDS rather than repairs), so the uncapped limb is a WIDE-CI reading and "unresolved" is as
   compatible with "smaller" as with "gone". **SELECTION-CONFIRM** fires on both limbs.
5. **THE SATURATION LADDER, WITHOUT A VERDICT.** The baseline climbs 49.0 % (4 s) → 55.9 % (5 s) →
   73.8 % (10 s) → 85.4 % (15 s) → 90.1 % (20 s). The `pressed − mid` limb confirms at EVERY window
   and is widest at the short ones (7.7 / 7.0 pp) while the `mid − free` limb resolves ONLY at 10 s
   and 15 s. Band spread ÷ baseline: 0.158 (4 s) · 0.125 (5 s) · 0.135 (10 s) · 0.051 (15 s) ·
   0.025 (20 s). ⇒ The two candidate primaries buy a cleaner `pressed − mid` gradient at a
   far-from-saturated baseline, and they **do not resolve the free-band anomaly at all**. Which
   window EK-T1 takes of record is the commander's (#203).
6. **TWO FACTS THE STAGE DID NOT SET OUT TO FIND.** (a) The census's own cap-bound scoping is milder
   than #260.2(iv)'s reading suggested: the capped arm's last sampled decision instant reaches
   238.8 s of a 241.7 s match, so the cap thins the LATE sampling rather than truncating it. (b)
   Perceived-band/truth-band agreement on the pressure feature is **82.501 %** here, within a
   tenth of a point of the #65 sizing smoke's committed 82.4 % on an unarmed world.
