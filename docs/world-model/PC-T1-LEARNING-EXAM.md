# PC-T1 — THE LEARNING EXAM (the pre-exam amendment + the multi-season armed read)

> Dispatched by ruling **#298 item 6**, with the **PRE-EXAM AMENDMENT** ordered at **#298 item 4**
> riding at its head. Contract [`PC-PERCEPTION-CONTRACT.md`](PC-PERCEPTION-CONTRACT.md) §2
> (M-PC.1–5), implementing [`INFO-DOCTRINE.md`](INFO-DOCTRINE.md) §0–§1 primitive 2. Substrate:
> [`PC-T0-LATENCY-SEAM.md`](PC-T0-LATENCY-SEAM.md) and
> [`PC-C0-REACTION-BASELINE.md`](PC-C0-REACTION-BASELINE.md), both read **with** their
> §COMMANDER CORRECTIONS.
>
> **NOT A SCORING STAGE.** H-PC.1(a) is scored at CELL grain at **PC-T2** (#297 item 4 H2). The
> differentiation faces here are the PREVIEW #298 item 6 ordered, reported with CIs. H2 (role)
> is REPORTED and never scored, by ruling.
>
> Amendment [`src/ai/pcLatency.ts`](../../src/ai/pcLatency.ts) ·
> [`src/sim/Match.ts`](../../src/sim/Match.ts) · pins
> [`tests/pcLatencySeam.test.ts`](../../tests/pcLatencySeam.test.ts) (+5, 25 total) · probe
> [`scripts/probes/pc-t1-learning-exam.ts`](../../scripts/probes/pc-t1-learning-exam.ts) ·
> artifact [`data/pc-t1-learning-exam.json`](data/pc-t1-learning-exam.json).

## §0 THE QUESTION, in football

PC-T0 built the capacity to be surprised and left it switched off. This stage switches it on for
**eight seasons** and asks the only question that matters before anything is scored: **does a
body actually learn to read his own game?** Not "can the book fill" in the abstract — does the
midfielder who has lived four hundred deflections under pressure this season come to read the
next one short, while the keeper who has lived nine loose-ball spills still watches them roll
past?

---

## §THE ANSWER, in one paragraph

**He does.** Inside a single season a body's book fills the cells he lives and never fills the
ones he does not, and the two tiers separate at cell grain by an enormous margin: the average
body's SIMPLE share differs by **78.0 percentage points** between his best-covered and his
worst-covered cell (CI [75.4, 80.6], **|Δ|÷half-width = 30.3**), and within a single cell the
best-covered body beats the worst-covered by **48.3 pp** (CI [45.7, 50.3], **|Δ|÷hw = 20.9**).
The census arithmetic that predicted this was **right and conservative** — of 28 cells it never
once promised a fill that failed to happen. Its **50/50 relation assumption was wrong** and is
corrected here: the surprise falls on the **opponent's** side of the ball **55.2 %** of the time,
not 50 %, and on every one of the seven classes. And the role channel, tested honestly, says what PC-C0 said it would: the four outfield
roles differ by **2.7 pp** — resolved above zero, and next to nothing beside the 78 pp a single
body's own cells differ by. **In this world recognition is a property of the SITUATION a body
lives, not of the shirt he wears.**

---

## §FORM

*(every number below is quoted FROM
[`data/pc-t1-learning-exam.json`](data/pc-t1-learning-exam.json), recomputed by
`PCT1_MODE=full npx tsx scripts/probes/pc-t1-learning-exam.ts` — the doc never carries evidence
the artifact does not, #229.2. Where a number is doc-side arithmetic OVER artifact fields rather
than a gated face, it says so.)*

**12 books × 8 seasons × 7 fixtures = 672 armed fixtures, walked TWICE for G-DET (1,344 walks) ·
12 paired seeds × 2 arms · ⭐ 16/16 gates PASS · ⭐ 66/66 conjuncts MUTANT-LIVE (machine-derived
coverage, EXACTLY-ONE enforced, incomplete map ⇒ exit 3)**, `resultSha256`
`d9f323c7…2824`, G-DET digest identical twice, 152 s wall. Mode **full**, preflight false.

```text
world            the v7 armed world of record + the L3 dose + pcReactionLatency ON
                 (a4MatchFlags(7) + armA4World, asserted LIVE on all 672 fixtures — #283.2(iv):
                 "worker-simmed fixtures play the SHIPPED world (League.toJSON omits matchFlags)")
a BOOK           a franchise pair with FIXED TeamInfos walked across 8 seasons — the same twelve
                 bodies live the whole career; only the seed varies fixture to fixture
a SEASON         7 fixtures, traced from the census artifact (gClock refuses a stale literal)
season boundary  the books are RESET, exactly as League.startSeason does it (M-PC.3)
totals           1,591,306 arms · 1,591,306 exposures · 1,591,306 armed-with-memory (the three
                 conservation identities, gBooks) · 177,550 firings · 10,053,677 applied ticks
tiers paid       1,196,619 SIMPLE (75.20 %) · 394,687 CHOICE
```

### ⭐⭐ THE SIZING, justified from the fill table

PC-T0 §2's table predicts the hot cells crossing N_cover **inside half a match** and
`dribblePush|GK|pressed` needing **39 seasons**. But that table assumed accumulation; **M-PC.3
wipes the book every season**, so the informative horizon is **within a season**, and a cell whose
predicted fill time exceeds one season does not fill slowly — **it never fills**. Eight seasons
therefore buys eight independent within-season replications per book (and the self-starvation
trajectory); twelve books buys the bootstrap its independent clusters. 672 battery seeds sits inside the
same order as L3-T1's 840, and it buys far more per seed because a COVERAGE count needs no
second quantity to separate — the discount N_cover was derived from in the first place.

### The dormancy re-proof, after the amendment

| instrument | value | at clean HEAD | verdict |
| --- | --- | --- | --- |
| pooled world identity, 10 bare + 10 v7-armed (seeds 12,492,900–909) | `5dafce81…f70c` | `5dafce81…f70c` | **IDENTICAL** |
| the repo's league fingerprint, `scripts/fingerprint.ts 1337 2` | `57b0bdab…c673` | `57b0bdab…c673` | **UNMOVED** |
| flag **ABSENT** ≡ flag **FALSE**, per seed, per world shape | 4/4 true | — | **IDENTICAL** |

---

## §AMENDMENT — the four clauses, as built and as proven

Ruling **#298 item 4**, ridden at the head of this stage. Src: `src/ai/pcLatency.ts` ·
`src/sim/Match.ts` (the declared scope, machine-asserted both ways by `gSrcScope` against the
dispatch commit `1b36da7`); **nothing in `src` moved after the amendment commit `f5e470c`** —
`git diff --stat f5e470c HEAD -- src` is empty at result time, gated.

| clause | as built | proven by |
| --- | --- | --- |
| **(a) a sub inherits nothing** | `PcLatencySeat.forgetBody(gid)` clears the holds map and the stale-plan memory — machine-pinned as the seat's COMPLETE per-gid state. Called at BOTH substitution sites. The BOOK is deliberately untouched: it is keyed by `rosterIdx`, i.e. by the MAN, and the arriving man brings his own born-absent row. | an INDEPENDENT camera over the whole battery: **61 substitutions seen** (59 in the league battery + 2 paired), **0 carried an inherited hold**. The seat's own counter agrees: 59 clears, of which **3** were carrying a live hold at the swap. |
| **(b) holds clear at dead-ball transitions** | the ruling's words: *"a restart voids the surprise's context — closes the clock-skew class"*. Written as the EXACT COMPLEMENT of the detector's firing condition, so the two halves of the phase rule have one home. | **1,622 dead-ball transitions cut 13,149 live holds** in the league battery; the paired battery's hold-record camera reports **0 of 23,458 records straddling a stoppage** (PC-T0 measured 122 of 16,953). The pin walks a whole match and asserts no hold is ever live after a dead-ball step. |
| **(c) `preProcessedSkips` on the census grain** | the H4 filter moved AFTER the relevance radius, PC-C0's ordering `sentOff → initiator → distance → pre-processed`. The armed set is UNCHANGED — both filters are bare `continue`s over the same body. | source-order pinned with occurrence counts; **272 skips over 672 fixtures = 0.40 per match**. ⚠ The channel is NEAR-VACUOUS on the census grain, exactly as #298 item 4 read it, and the old `> 0`-per-match pin was measuring pre-processed bodies anywhere on the pitch. |
| **(d) the flag renamed** | `pcHoldKeptOlderExpiry` — the predicate marks the overlap rule's `max()` KEEPING the older expiry (the newer, shorter window refused), which is the opposite of "extended". One home in `src`; instruments read it. | pinned on synthetic records and on a real monotone restart; **185 records** in the paired battery kept an older expiry. |

⚠ **AND ONE THING THE AMENDMENT CREATED, reported rather than glossed.** Clause (b) makes a
**fifth hold population** that PC-T0's `clean` definition does not name: a hold cut short by a
stoppage. Of **15,366** clean records, **15,039 (97.87 %)** ran exactly their tier's length; the
**327** residual are short, and the seat's own `deadBallClearedHolds` for the same battery is
**336** — the two agree to within the nine records that also fell into another bucket. The
histogram is still dominated by the two constants (**965 × 12 ticks · 14,095 × 27 ticks**, p50 27,
p90 27), with a thin tail of dead-ball-cut lengths. The probe's `clean` filter is PC-T0's,
inherited unchanged, and it predates the clause it now needs a sixth bucket for (§DOUBTS 1).

---

## §FILL — the books vs the census arithmetic

### ⭐ THE RELATION SPLIT, MEASURED AT LAST (PC-T0 §DOUBTS 3)

PC-T0 published its fill table on a **stated 50/50 assumption** and said so. Measured over
1,591,306 exposures:

| class | own | opp | **own share** | 50/50 error |
| --- | ---: | ---: | ---: | ---: |
| `turnover` | 83,267 | 93,165 | **0.4720** | −2.8 pp |
| `deflection` | 282,376 | 337,449 | **0.4556** | −4.4 pp |
| `passRelease` | 239,086 | 292,095 | **0.4501** | −5.0 pp |
| `looseBallSpill` | 6,694 | 7,576 | **0.4691** | −3.1 pp |
| `dribblePush` | 25,492 | 33,519 | **0.4320** | −6.8 pp |
| `knockRelease` | 54,333 | 78,076 | **0.4103** | −9.0 pp |
| `shotRelease` | 20,914 | 37,264 | **0.3595** | **−14.0 pp** |
| **pooled** | **712,162** | **879,144** | **0.4475** | **−5.2 pp** |

**The surprise is systematically on the OPPONENT's side of the ball** — every class, no exception,
and hardest at `shotRelease` (a shot is taken by a man whose team-mates are mostly behind him and
whose opponents are mostly in front). ⭐ The direction PC-T0 guessed in its doubt is confirmed:
the true spread is WIDER than the assumed table, which strengthens rather than weakens the
finer-key argument. **The fill table of record is corrected in the artifact**
(`fill.predictions[].exposuresPerSeasonMeasuredSplit` beside the assumed one, per cell per role).

The **pressed** split is a re-measurement, not a correction, and it reproduces the census within a
few points on every class (`looseBallSpill` 1.000 vs 1.000 · `dribblePush` 0.039 vs 0.046 ·
`passRelease` 0.733 vs 0.743 · `deflection` 0.648 vs 0.693 · `turnover` 0.794 vs 0.818 ·
`shotRelease` 0.672 vs 0.733 · `knockRelease` 0.759 vs 0.839) — the armed world presses slightly
less than the base world the census measured, which is itself a seam effect (§SUPPLY).

### ⭐ THE FILL TRAJECTORY, within a season

Covered body-cells at the end of each fixture, pooled over 12 books × 8 seasons. Denominator:
**32,256** on-pitch body-cells (12 bodies × 28 cells × 12 books × 8 seasons; bench slots that
never play are structurally unreachable and are excluded, a disclosed denominator choice).

| fixture in season | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| covered at **N = 9** | 9,229 | 14,012 | 16,625 | 18,418 | 19,805 | 20,858 | **21,666 (67.2 %)** |
| covered at **N = 18** | 3,740 | 9,286 | 12,239 | 13,781 | 15,071 | 16,171 | **17,210 (53.4 %)** |
| covered at **N = 36** | 111 | 3,984 | 6,787 | 9,414 | 11,182 | 12,149 | **12,940 (40.1 %)** |

⭐ **A book born absent is a third to two thirds covered by the last game of its season, and then
it is wiped.** At the shipped N, **11.6 %** of a body's cells are covered after his first match and
**53.4 %** after his seventh — the earned book is a season-long arc, not a two-minute tutorial and
not a career.

### ⭐ CENSUS PREDICTION vs OBSERVED FILL, cell by cell

*(doc-side arithmetic over two artifact fields: `fill.predictions[].fillsWithinOneSeasonAtN`
(any outfield role) and `fill.measured[].bodiesReachingCoverageAtN`.)*

| N | cells where prediction and observation AGREE | predicted-fills, never filled | filled, not predicted |
| ---: | ---: | ---: | ---: |
| 9 | 25 / 28 | **0** | 3 |
| **18** | 20 / 28 | **0** | 8 |
| 36 | 20 / 28 | **0** | 8 |

⭐⭐ **THE CENSUS ARITHMETIC IS SOUND AND IT IS A FLOOR.** At every rung of the band it made
**zero false promises** — no cell it said would fill failed to. Every disagreement runs the other
way: cells it said would not fill did, for **eight** of twenty-eight at the shipped N. The reason
is not an error in the arithmetic but in what a mean is: the census publishes **exposures per body
per season averaged over a role**, and bodies are not average. The man who spends his season in the
busy channel lives multiples of his role's mean, and he crosses cells the mean says are out of
reach. ⭐ **Read the census's fill times as a FLOOR on what a body can learn, never as a ceiling.**

The two ends of the prediction hold exactly:

* `dribblePush|pressed|own` and `|opp` — predicted ~0.4–1.1 exposures/season (the production push
  is gated on `nearOpp > 4.2 m`, so a PRESSED push is near-impossible). Observed: **2,306 arms,
  and 0 bodies reaching coverage at ANY N.** A permanent hole, exactly as designed.
* `looseBallSpill|open|own` and `|opp` — predicted **0** (a spill is 100 % pressed). Observed:
  **0 arms.** ⭐ NON-VACUITY: this cell never occurred *and the census said it never would* — a
  structural zero, not an unmeasured one.
* `shotRelease|open|opp` — predicted to cross at N = 9 and not at 18. Observed simple share
  **0.278 · 0.034 · 0.000** across the band. The prediction lands on the rung.

---

## §DIFFERENTIATION — the tier faces at CELL grain (the H-PC.1(a) preview)

Bootstrapped over **BOOKS** (12 clusters, 2,000 resamples, stats seeds 113,200–202). A world with
no differentiation scores **0** on both spread faces, so the null is exactly zero and |Δ|÷half-width
is a legitimate statement. Cells enter a body's spread only with **≥ 5 arms** (a cell he barely
visited carries no share worth spreading).

| face | N = 9 | **N = 18 (shipped)** | N = 36 |
| --- | --- | --- | --- |
| pooled SIMPLE share | 0.8594 [0.8557, 0.8631] | **0.7513 [0.7442, 0.7583]** | 0.5858 [0.5734, 0.5987] |
| ⭐ **WITHIN A BODY, across his cells** (mean max−min SIMPLE share) | 0.8711 [0.8527, 0.8891] · **Δ/hw 47.9** | **0.7800 [0.7544, 0.8059] · Δ/hw 30.3** | 0.6675 [0.6455, 0.6922] · **Δ/hw 28.6** |
| ⭐ **ACROSS BODIES, within a cell** | 0.5863 [0.5479, 0.6183] · **Δ/hw 16.7** | **0.4827 [0.4569, 0.5032] · Δ/hw 20.9** | 0.3320 [0.3137, 0.3489] · **Δ/hw 18.9** |

⭐⭐ **THE SAME BODY PAYS BOTH TIERS, AND THE DIFFERENCE IS NOT SUBTLE.** At the shipped N the
average body's most-recognised cell and his least-recognised cell are **78 percentage points**
apart in how often he reacts short. That is the mechanism M-PC.3 promised, running: the novice
pays long **by construction**, in exactly the situations he has not lived, while the same man reads
his bread-and-butter early.

The tier-by-cell matrix, at the shipped N (the eight busiest cells and the four emptiest):

| cell | arms | SIMPLE share @9 | **@18** | @36 | bodies who reached coverage @18 |
| --- | ---: | ---: | ---: | ---: | ---: |
| `deflection\|pressed\|opp` | 222,125 | 0.952 | **0.904** | 0.810 | 160 |
| `passRelease\|pressed\|opp` | 214,791 | 0.950 | **0.901** | 0.803 | 159 |
| `deflection\|pressed\|own` | 179,618 | 0.940 | **0.881** | 0.766 | 155 |
| `passRelease\|pressed\|own` | 174,517 | 0.939 | **0.878** | 0.759 | 151 |
| `deflection\|open\|opp` | 115,324 | 0.907 | **0.817** | 0.646 | 149 |
| `turnover\|pressed\|opp` | 74,845 | 0.858 | **0.720** | 0.464 | 145 |
| `knockRelease\|pressed\|own` | 40,864 | 0.769 | **0.589** | 0.340 | 108 |
| `shotRelease\|pressed\|opp` | 24,849 | 0.590 | **0.282** | 0.025 | 118 |
| `looseBallSpill\|pressed\|opp` | 7,576 | 0.123 | **0.005** | 0.000 | 18 |
| `shotRelease\|open\|own` | 6,685 | 0.182 | **0.017** | 0.000 | 9 |
| `dribblePush\|pressed\|opp` | 1,254 | 0.000 | **0.000** | 0.000 | 0 |
| `looseBallSpill\|open\|own` | **0** | — | — | — | 0 |

**In football**: a defender reads a deflection under pressure early nine times in ten; the same
defender watches a shot go past him early **less than three times in ten**; and a keeper facing a
loose ball squirm free at his feet is a novice **every single time, all season, forever**.

---

## §BAND — the sensitivity verdict (#297 item 4 H1)

The canon is exact: *"a conclusion that flips across the band is no conclusion."* The band is
re-derived **instrument-side** from the same exposure streams — the seat writes one exposure per
arm and decides the tier before writing it, so coverage-at-arm-time IS the running count of prior
arms in that cell since the reset. **`gNSweep` proves the re-derivation reproduces the seat's own
tier on 1,591,306 of 1,591,306 arms at the shipped N.** No world ever ran an N other than
`PC_N_COVER`.

| conclusion | N = 9 | N = 18 | N = 36 | flips? |
| --- | --- | --- | --- | --- |
| tiers differentiate WITHIN a body across cells | 0.871, Δ/hw 47.9 | 0.780, Δ/hw 30.3 | 0.668, Δ/hw 28.6 | **NO** |
| tiers differentiate ACROSS bodies within a cell | 0.586, Δ/hw 16.7 | 0.483, Δ/hw 20.9 | 0.332, Δ/hw 18.9 | **NO** |
| books fill within a season (majority of live body-cells) | 67.2 % | 53.4 % | 40.1 % | **NO** |
| the census makes zero false fill promises | 0/28 | 0/28 | 0/28 | **NO** |
| outfield role differentiation is negligible beside cell grain | 1.8 pp vs 87 pp | 2.7 pp vs 78 pp | 4.8 pp vs 67 pp | **NO** |
| `dribblePush\|pressed\|*` is a permanent hole | 0 bodies | 0 bodies | 0 bodies | **NO** |
| the **LEVEL** of the SIMPLE share | 85.9 % | 75.1 % | 58.6 % | ⚠ **moves 27 pp** |

⭐⭐ **VERDICT: NO CONCLUSION FLIPS ACROSS THE BAND.** What moves is the *level* — halving or
doubling N moves the pooled SIMPLE share by roughly ±13 pp in each direction, exactly as a
threshold should. What does **not** move is any ordering, any sign, or any structural claim. And
the cell RANKING is essentially invariant: Spearman **0.997** (N9~N18), **0.976** (N18~N36),
**0.971** (N9~N36) over the 26 cells with any arms *(doc-side arithmetic over
`fill.measured[].simpleShareAtN`)*. N = 18 is still a STRUCTURE CHOICE (#298 corrections 5) — but
it is now a structure choice whose neighbourhood has been walked, and the neighbourhood agrees.

---

## §ROLE — H2's honest test (REPORTED, never scored)

Doctrine §0 promises role-differentiated reaction EMERGES from role-differentiated exposure.
PC-C0 measured the exposure supply to be **role-flat (1.20× across outfield roles)** and warned
that *"as specified, the mechanism has no channel by which 中场 and 后卫 could end up with
different reaction times."* The armed world's verdict, at the shipped N:

| role | arms | SIMPLE share @9 | **@18** | @36 |
| --- | ---: | ---: | ---: | ---: |
| GK | 144,037 | 0.782 | **0.621** | 0.392 |
| DF | 252,909 | 0.859 | **0.752** | 0.578 |
| MF | 313,928 | 0.877 | **0.779** | 0.626 |
| WG | 573,952 | 0.864 | **0.759** | 0.600 |
| ST | 306,480 | 0.872 | **0.774** | 0.621 |
| **outfield spread (max − min)** | | 1.82 pp | **2.74 pp** | 4.80 pp |
| outfield spread, CI over books | | [1.57, 2.15] Δ/hw 6.4 | **[2.25, 3.24] Δ/hw 5.6** | [4.03, 5.73] Δ/hw 5.7 |

⭐ **THE HONEST FINDING, and it is a finding about doctrine §0, not about this build.** Outfield
role differentiation is **real but negligible**: 2.7 pp, resolved above zero at Δ/hw 5.6 — and
**twenty-eight times smaller** than the 78 pp the same bodies differ by *across their own cells*.
The midfielder does not read the game faster than the defender in any way a player would notice.
The user's own §-1 message 4 — 「我中场看到球来的反应的时间和你后卫看到你爆趟我的反应时间是不一样的」 —
is **not** delivered by an exposure-keyed book at this key, and PC-C0 said in advance that it would
not be. The census's prediction is confirmed at the exam grain.

⭐ **The one role that IS different is the KEEPER** — 62.1 % vs 75–78 %, a **13-to-16 pp** gap.
And that is *not* a role constant leaking in: nothing in `src` is role-keyed. It is that the
keeper lives a **different mix of situations** — he is inside 25 m of a shot far more often than
of a knock, and his rare cells stay rare. The mechanism differentiates by SITUATION and the keeper
simply has a different situation diet. ⭐ **This is the shape of the doctrine's claim, delivered
one level down from where the doctrine put it**: recognition differentiates by the game a body
plays, and role only matters to the extent it changes that game. For the outfield six in a 6v6
world it barely does. Whether that is a finding to accept or a key to widen (zone? direction?
`class × pressed × relation × zone`) is the commander's fork, not this instrument's.

---

## §ADDED LAG — the receipt (#297 item 5, binding)

⚠⚠ **THE CHANNEL OF RECORD IS "RE-DECIDED", NOT "REACHED A SLOT" — and the preflight is why.**
PC-C0 §DOUBTS 7 already warned that its decide lag measures *"reaches a slot", not "re-decides
differently"*. Under this seam the AND-gate blocks a held body's slot **and never re-arms his
timer**, so a held body sits at `decisionTimer <= 0` for the whole hold and PC-C0's raw predicate
fires *earlier* in the armed arm. On the preflight that read **added-lag = −0.97 ticks** — "the
seam makes the world faster" — which is an instrument artefact, not a finding. The RE-DECIDE
predicate (his timer was actually **re-armed**) is **identical** to PC-C0's in the BASE arm,
because the decide loop arms `AI_INTERVAL` the moment the slot opens; the two only separate where
the gate bites. Both channels are published; **only re-decide is differenced.**

| | base (v7) | armed (v7 + PC) | difference |
| --- | ---: | ---: | ---: |
| affected bodies ENTERED into windows | 28,017 | 23,684 | ⚠ moving denominator, −15.5 % |
| windows CLOSED (the lag denominator) | 27,887 | 23,571 | ⚠ 130 · 113 still open at the whistle, dropped — PC-C0 dropped 1,613 the same way and reconciled them at its §CORRECTIONS 5 |
| bodies who DID re-decide inside the horizon | 27,859 | 22,433 | |
| ⭐ **mean applied ticks to RE-DECIDE** | **6.4875** | **31.6566** | ⭐ **+25.169** |
| p50 / p90 | 6 / 10 | 30 / 53 | |
| never re-decided inside the 60-tick horizon | 28 (0.10 %) | 1,138 (4.83 %) | ⚠ censored |
| *(the raw "reached a slot" channel, published, NEVER differenced)* | 6.5333 | 5.4317 | *(the artefact)* |

**ADDED-LAG OF RECORD: +25.17 applied ticks** = 0.419 sim-s. Per-seed paired CI over the 12 seeds:
**[24.67, 25.74]**, half-width 0.535, **|Δ|÷half-width = 47.0**.

⭐ **THE WORLD'S OWN CADENCE IS NOT CREDITED.** The base arm reads **6.4875** applied ticks against
the census's free lag of record **≈ 6.54** (#297 corrections item 2) — a **0.05-tick** reproduction
of a number measured on a different battery by a different probe. The seam's contribution is the
difference and nothing else; the raw total 31.66 is never offered as an effect.

⚠ **AND THE 25.17 IS A FLOOR, for two reasons stated rather than buried.** (i) The 1,138 armed
bodies who never re-decided inside the horizon are **excluded from the armed mean**, which pulls it
DOWN — a fully honest number would be larger. (ii) The added lag **exceeds the CHOICE tier (27
ticks)** for a quarter of the population, and the reason is the overlap rule: **419,255 of
1,591,306 arms (26.3 %) landed on a live hold**, and MONOTONE RESTART chains them. A body in a
scramble is not held for one tier — he is held through the scramble.

⚠ **THE STEERING CHANNEL GETS NO ADDED-LAG NUMBER, deliberately.** PC-C0's steering instrument
measures the divergence of `interceptBall(p, ball)` — a *function of state* the held body is not
using (its own §CORRECTIONS 5 hazard). Under a hold the body's APPLIED target is frozen while that
function keeps tracking the truth, so the instrument would report **no added lag on precisely the
channel the seam holds**. The two arms' raw first-tick retargeting counts are published
(base 5,182/5,190 = 99.85 % · armed 4,196/4,202 = 99.86 %) so the flatness is visible, and they are
**not** differenced. An instrument that would systematically understate is worse than none.

### The other three receipts item 5 asked for

* ⭐ **SEASON RESET ACTUALLY RESETS**: **96 season boundaries** (12 books × 8), **0** left a
  non-empty book, against **1,591,306** exposures held at season ends. Gated (`gSeasonReset`),
  with its own non-vacuity conjunct.
* ⭐ **ZERO SUB-INHERITED HOLDS**: 61 substitutions seen by an independent camera, **0** inherited.
* ⭐ **ZERO HOLDS SPANNING A DEAD BALL**: 0 of 23,458 records (PC-T0: 122 of 16,953).

---

## §SUPPLY — the self-starvation check (the L3-T2 lesson)

The question: does maturity change the exposure supply itself — faster reactions ⇒ fewer or
different surprises ⇒ book drift?

| season | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| arms / match | 2,337 | 2,318 | 2,384 | 2,362 | 2,374 | 2,393 | 2,395 | 2,380 |
| firings / match | 261.3 | 260.3 | 266.1 | 263.8 | 263.8 | 266.9 | 266.0 | 265.6 |
| SIMPLE share @18 | 0.749 | 0.744 | 0.752 | 0.748 | 0.755 | 0.757 | 0.754 | 0.756 |

**NO SEASON-GRAIN DRIFT**: +1.8 % arms and +1.6 % firings from season 1 to season 8, and a SIMPLE
share flat inside 1.3 pp. This is the expected shape and it is worth saying why: **because the book
is wiped every season, seasons are structurally identical replications** — season 8 starts as
ignorant as season 1. The trajectory's job here is to prove the world does not drift for *other*
reasons (there is no ageing, no rotation, no fatigue carry-over in this form), and it does not.

⭐ **BUT ARMING ITSELF STARVES THE SUPPLY BY 14 %**, and that is the real finding. From the paired
battery: **256.25 events per match in the base world vs 220.00 armed** (−14.1 %), and affected
bodies **28,017 vs 23,684** (−15.5 %). Held bodies do not chase, do not press and do not tackle,
so the armed world simply generates fewer surprises. *(Sanity: the base arm's 256.25 events/match
reproduces PC-C0's own 52,228 events over 200 matches = 261.1/match to within 1.9 %, on a
different battery — a free commensurability receipt.)*

⚠ **THE GRAIN THAT WOULD SETTLE IT IS NOT STORED** (§DOUBTS 2). Under a season reset the maturity
that could starve supply accrues **within** a season — fixture 1 (empty book, long holds, less
football) vs fixture 7 (half-covered book, shorter holds, more football). The probe stores coverage
by fixture but **not arms or firings by fixture**, so the within-season supply trajectory cannot be
re-derived from this artifact. What can be said is bounded and is said: no season-grain drift, and
a 14 % level cost from arming. PC-T2 should store the fixture-grain supply.

---

## §GATES — the set, frozen ex ante (**16**, 66 conjuncts, all MUTANT-LIVE)

| gate | what it proves |
| --- | --- |
| `gDet` | G-DET: the whole 672-fixture core runs TWICE and re-derives bit-identically. |
| `gDormancy` | the pooled bare+v7 digest and the league fingerprint both re-derive their clean-HEAD constants AFTER the amendment; the baseline is the COMPLETE one; flag-absent ≡ flag-false. |
| `gSrcScope` | the amendment touched EXACTLY its declared two files since the dispatch commit, and **nothing in `src` moved after the amendment commit**; the worktree's `src` is committed. |
| `gArms` | every battery fixture carried the v7 arm, the L3 dose and the latency door; every paired base walk had the door SHUT and every armed walk OPEN. |
| `gSources` | every data source hashes its FILE BYTES: the dose re-derives the shipped constant, and the CENSUS artifact re-derives **its own committed digest**. |
| `gClock` | APPLIED, not nominal: shipped `DT` and `MATCH_DURATION`, tiers 12/27 ticks, the season length TRACED from the census artifact's own sentence, every walk stepped its full match. |
| `gNSweep` | ⭐⭐ the instrument-side band re-derives the SEAT's own tier on EVERY arm at the shipped N; the band is half/one/double; N is the derived 18. |
| `gBooks` | the three conservation identities (one exposure per arm, a live stale plan per arm, two tiers accounting for every arm), the ruled 28-cell key space, both tiers actually paid. |
| `gAmendment` | ⭐⭐ the four clauses LIVE: zero inherited holds over 61 real substitutions · zero records spanning a dead ball with the camera proving stoppages really cut holds · the H4 counter after the radius filter (source order) · the renamed predicate is the one instruments read. |
| `gSeasonReset` | every one of 96 boundaries left the books EMPTY, with non-vacuity on both sides. |
| `gAddedLag` | the base arm reproduces the census's free lag within half a tick; the armed arm is SLOWER than its own base; both denominators non-vacuous; the seam never writes `decisionTimer` (machine-asserted over two files). |
| `gSeeds` | booked = walked; the retired block untouched; the preflight band disjoint from every walked seed; the two batteries disjoint. |
| `gSchema` | ⭐⭐ #298 item 3's canon, its FIRST RIDE: the hashed body violates nothing in the allowlist schema, and the schema demonstrably REFUSES an unknown field, an object smuggled into a leaf slot, and a wall-clock timing. |
| `gEnvelope` | a cross-OUT with a DIFFERENT envelope has the IDENTICAL digest; the disk copy re-derives its own digest. |
| `gFaces` | EVERY published face (253) re-derived by parsing the SERIALIZED artifact off disk, percentiles from STORED bins. |
| `gMutants` | machine-derived coverage — every conjunct owns exactly one mutant, flipping it flips only its own conjunct; an incomplete map REFUSES THE RUN (exit 3). |

**Freeze order (#266.3(c)):** `36469f5` (the freeze) precedes the battery; the probe is
**byte-unchanged** between freeze and result. **`xSrcUntouched` for Part 2**:
`git diff --stat f5e470c HEAD -- src` is empty at result time (gated, `gSrcScope`).

### ⭐⭐ THE ALLOWLIST SCHEMA — #298 item 3's first rider

> *"the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never
> enters the body; forbidden-name lists are retired"* (#298 item 3, verbatim).

`BODY_SCHEMA` is a recursive node tree; the writer **refuses the run (exit 3)** on (i) any key the
schema does not name, (ii) any schema key the body omits, and (iii) any **object smuggled into a
LEAF slot** — which is exactly how PC-T0's timings breached the envelope past a forbidden-NAMES
gate that could not see new fields. The gate map is keyed by the gate REGISTRY's own names, so a
new gate cannot enter the body unregistered. It bit twice during development (`gates` and
`coverage` arrived as free-form objects and were refused until declared), which is the receipt
that it is load-bearing rather than decorative.

---

## §DOUBTS

1. ⚠⚠ **THE PROBE'S `clean` HOLD DEFINITION IS PC-T0'S, AND IT PREDATES CLAUSE (b).** A hold cut
   short by a dead-ball clear is not superseded, not extended, not open at the whistle and does not
   straddle a stoppage (the executor ran on every tick it was observed) — so it lands in `clean`
   with a sub-tier length. 327 of 15,366 clean records (2.13 %) are such holds, matching the seat's
   own `deadBallClearedHolds` = 336 to within nine records. Nothing is mis-measured — the two
   populations are published side by side — but the WORD "clean" now under-describes its bucket and
   a sixth population should be named at PC-T2.
2. ⚠⚠ **THE SELF-STARVATION CHECK IS AT SEASON GRAIN, AND THE INFORMATIVE GRAIN IS WITHIN-SEASON.**
   With a season reset, maturity accrues fixture to fixture, not season to season; the probe stores
   coverage by fixture but not arms or firings by fixture, so the within-season supply trajectory is
   **not re-derivable from this artifact**. The 14 % armed-vs-base supply gap is measured and real;
   whether it narrows as the books fill is UNMEASURED, not zero. Named as a PC-T2 requirement.
3. ⚠ **A BOOK HERE IS A FIXED FRANCHISE PAIR, WHICH DEPARTS FROM THE L3-T1 PRECEDENT ON PURPOSE.**
   L3-T1 redrew squads per fixture and said why: *"a fixed-roster sequence would converge each book
   to ONE matchup's truth."* That hazard is real and it applies here too — each book's exposure mix
   is one matchup's. It is accepted because the PC book is keyed by `rosterIdx`, i.e. by the BODY,
   and a body who changes every week is not a body; a franchise season IS one matchup mix repeated.
   The twelve books are twelve different mixes and the bootstrap is over them, which bounds the
   damage but does not remove it. There is no yardstick population here for the sampling to have to
   match, which is why the hazard is survivable at all.
4. ⚠ **THE ADDED-LAG ARMS ARE PAIRED BY SEED, NOT BY EVENT.** The armed world diverges from its
   base within ticks, so the two arms do not contain the same events — and their denominators
   differ by 15.5 %. The receipt is the difference of two distributions drawn from the same seeds,
   which is what "same seeds" can buy in a world the seam changes. Both denominators are published.
5. ⚠ **THE ARMED ARM'S MEAN IS CENSORED AT 60 TICKS** (1,138 of 23,571 bodies, 4.83 %, vs 28 of
   27,887 in the base). Those bodies are dropped from the mean, so **+25.17 is biased low**. The
   horizon is PC-C0's own, kept for commensurability rather than widened to flatter this stage's
   number; the trade is stated, not hidden.
6. ⚠ **THE OUTFIELD ROLE SPREAD IS RESOLVED ABOVE ZERO, AND I DO NOT KNOW IT IS THE ROLE.** 2.74 pp
   at Δ/hw 5.6 is a real signal, but roles in this world are also positions on a pitch, and the
   spread could be a zone effect wearing a role's name. Distinguishing them needs a zone-keyed
   instrument, which this exam does not have. The claim made is only the honest one: whatever it is,
   it is ~28× smaller than the within-body cell spread.
7. ⚠ **THE PRESSED SHARES SIT BELOW THE CENSUS'S ON EVERY CLASS** (e.g. `knockRelease` 0.759 vs
   0.839). This is consistent with §SUPPLY — a world where defenders are held presses less — but it
   is a difference between an ARMED world and an UNARMED census, and it is NOT a re-measurement
   error being reported as a seam effect. Nothing downstream uses the census's pressed share except
   the fill predictions, which are published under both.
8. ⚠ **THE H4 CHANNEL IS NOW NEAR-VACUOUS AND THAT IS A DESIGN QUESTION, NOT A BUG.** 272 skips over
   672 fixtures. The pre-processing channel the doctrine cared about (提前知道 / 抬头观察) is,
   on the census grain, almost never the reason a body is not held. If H4 is meant to carry weight,
   the one-touch window is too narrow a door for it.
9. ⚠ **CITATION AUDIT OF THE DISPATCH BRIEF, per the #298 item 3 operational fix.** Every canon cite
   in the brief was checked against `PROGRAMME-RULINGS.md` and every one is correct in number and
   in wording: #298 item 4 (the four clauses and the dead-ball sentence verbatim), #298 item 3 (the
   allowlist-schema canon verbatim), #298 item 6 (the dispatch), #297 item 4 H1 (*"a conclusion that
   flips across the band is no conclusion"*), #297 corrections item 2 (the ≈6.54 value), #297
   corrections items 1 and 4, #294 item 3 (*"a field carries the unit its name claims"*), #289
   item 1, #288, #283.2(iv) (*"worker-simmed fixtures play the SHIPPED world (League.toJSON omits
   matchFlags)"*). **No strike-nine candidate.** The verbatim-quotation fix worked: three cites were
   verified by grepping the quoted sentence rather than the number.


## §SEEDS — BOOKED = WALKED

```text
block            12,498,000 – 12,498,999   (ruling #298 item 5)
battery          12,498,000 – 12,498,671   12 books × 8 seasons × 7 fixtures
paired battery   12,498,700 – 12,498,711   12 seeds, walked TWICE (base v7 · v7+PC)
pin suite        12,498,800 – 12,498,802   (tests/pcLatencySeam.test.ts, the amendment pins)
amendment bench  12,498,803 – 12,498,819   ⚠ DISCLOSED: the amendment's own H4-rate and
                                            dead-ball measurements (6 + 6 walks drawn)
preflight band   12,498,900 – 12,498,999   ⚠ DECLARED **AND DRAWN** (9 walks): the probe's
                                            smoke preflights, all `PCT1_OUT` to /tmp
world identity   12,492,900 – 12,492,909   ⚠ FOREIGN and DISCLOSED — the CONSUMED PW-T0b band,
                                            re-walked for the dormancy comparison ONLY
retired          12,494,000 – 12,494,999   NEVER TOUCHED (gSeeds asserts, with its own mutant)
stats stream     113,200 – 113,204         five bootstrap seeds, one per CI family
```

**Bootstrap unit**: the **BOOK** (a franchise pair walked across seasons) for every battery
face; the **SEED** for the paired added-lag face. 2,000 resamples.

## §NON-CLAIMS

* **H-PC.1 IS NOT SCORED HERE.** The differentiation faces are a preview with CIs; PC-T2 scores
  them at the full composition.
* **H2 (role differentiation) is REPORTED, never scored** — by ruling (#297 item 4 H2).
* The class predicates are PC-C0's, reused verbatim; they are STATE-TRANSITION detectors over
  public state and can under- or over-count at the margin exactly as the census disclosed.
* A **book** here is a franchise pair walked with FIXED `TeamInfo`s, not a League round-trip:
  promotion, squad rotation between seasons, transfer turnover and the Evo Cup are absent BY
  CONSTRUCTION. The bodies age zero seasons.
* The added-lag receipt pairs at **SEED** level, not event level; the arms' event streams
  diverge and both denominators are published because they move.
* The **steering channel gets no added-lag number** (§ADDED LAG) — an instrument that would
  systematically understate it is worse than none.

## §COMMANDER CORRECTIONS OF RECORD (ruling #299, 2026-08-16 — read BEFORE quoting this doc)

Verify PASS-WITH-FINDINGS (2 MED + 6 LOW; 14 independent re-derivations). The exam's load-
bearing results ALL STAND: the amendment (4/4 clauses, pinned, dormancy re-proven), the fill
curves (census: zero false promises), the tier differentiation (within-body 78 pp at 30×),
the N-band invariance, the role face, the +25.17-tick added-lag receipt with its 0.05-tick
base-arm reproduction of the census cadence. Corrections binding on quotation:

1. **(MED — ⭐ THE NINTH CITATION STRIKE, ADJUDICATED: wrong HOME, not fabrication)**: the
   allowlist-canon sentence quoted in the probe/doc IS verbatim — its home is **PC-T0-LATENCY-
   SEAM.md §COMMANDER CORRECTIONS item 1**, not "ruling #298 item 3" (the ruling carries only
   the short form). The verifier's "fabrication" claim is CORRECTED (the sentence exists
   exactly, one document over); the strike stands as a wrong-home attribution and it is THE
   COMMANDER'S (the dispatch brief mis-homed it — fourth commander-owned). ⭐ The #298
   operational fix is REFINED: a canon quote cites the sentence's ACTUAL HOME (doc + section);
   stage-doc §CORRECTIONS sections are part of the canon corpus and are cited as themselves.
2. **(MED) THE 14.1 % "arming starves the surprise supply" IS A COLD-BOOK TRANSIENT**: the
   paired battery runs books from empty; the artifact's own 672-fixture WARM armed battery
   reads 17.66 events/1,000 ticks vs the paired base's 17.795 (−0.8 %). OF RECORD: self-
   starvation at warm books is ESSENTIALLY ABSENT; the 14.1 % is the cold-book opening
   transient. (The fixture-grain trajectory that would show the transition is NOT stored —
   a named PC-T2 requirement, the executor's own honest gap.)
3. **(LOW, statistics hygiene)**: the Spearman figures use ordinal ranks (mid-rank values are
   HIGHER: 0.9966/0.9921/0.9873 — the published numbers are conservative); headline point
   estimates are bootstrap MEANS (arm-weighted values differ in the last digit — quote the
   stored point estimates); ⭐ "resolved above zero" is a WEAK test for max−min spreads whose
   null is structurally non-negative — the 2.68 pp outfield role spread survives on
   sign-consistency across books (the verifier's own check), but the canon going forward: a
   max−min face reports a noise-floor comparison, not a zero-null CI.
4. **(LOW)**: the clock/unit naming rule is stated but not gated and two field families
   violate it (seasonsToFill* and simpleShareAtN — names must carry their units, #294 item 3);
   the paired lag walks step 14,400 ticks vs real matches ≈14,961 (symmetric truncation,
   disclosed now); the amendment receipts are scoped to the 12-match PAIRED battery (the
   league counters are the 1,622/13,149 pair) — "the whole battery" over-claimed; the `clean`
   hold bucket now contains a sixth population (dead-ball-cleared, 327 ≈ 336 records) — the
   word under-describes it, both populations published.
5. **(RULED, the two flagged commander questions)**: ⭐ H4's near-vacuity (272 skips/672
   fixtures) is ACCEPTED for slice 1 — the one-touch window is a narrow but correct
   pre-processing door; the broad 提前知道/抬头观察 channel IS slice 2's subject (scanning),
   not a defect here. ⭐ The role/zone key widening is NOT taken now: the doctrine's core
   promise (situation-grain differentiation) is loudly delivered; the zone-keyed refinement
   is a MENU door. The honest finding stands for the user's gate: 中场-后卫反应差异 is NOT
   delivered by exposure at this key — the mechanism differentiates by SITUATION, and role
   matters only insofar as it changes the situations a body lives (the GK's 13–16 pp gap is
   exactly that).
