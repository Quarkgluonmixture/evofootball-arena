# DV-C0 — THE LOSS-COST CENSUS (丢球的价钱: what does losing it HERE actually cost?)

Status: **FROZEN, then RUN.** Everything from §FORM to §NON-CLAIMS — the world, the measured
quantity, the zoning, the window family, the attribution rule, the estimator, the seed ledger, the
N rule, the ⭐ #246 reality-shape predicates and the gate list — is the design fixed **in the
probe's own frozen constants and gate predicates before any receipt ran**, and every clause below
is machine-checkable against the committed artifact rather than a promise about it. The measured
numbers live in [§RESULT](#result), **GENERATED PROGRAMMATICALLY** from the artifact by a committed
generator (`scripts/analysis/dv-c0-census-result.ts`), never typed.

⚠ **This document reports; it does not adjudicate (#203).** The #246 shape flags are mechanical CI
readings printed exactly as the artifact records them. What an inversion *means* — deliberate
arcade trade-off or substrate defect — is the commander's.

Authority chain: contract [`DELIVERY-VALUE-CONTRACT.md`](DELIVERY-VALUE-CONTRACT.md) §3 **DV-C0**
(*"measure the table: turnover → conceded hazard by zone, production world, the GGC probe family;
receipts, CIs, the #181.2 stack. No src change."*) with its ⭐ **#246 amendment** (the
REALITY-SHAPE check, pre-registered; an inversion is routed to the 街机偏离 test, never corrected
into the table) and the ⭐⭐ **#247 truth/belief split** (this table is INSTRUMENT-side truth — it
grounds exams and yardsticks belief convergence; it is wired into **no** player). Rulings **#245**
(the contract; the map-vs-reality audit that named the missing loss-cost term) · **#246** ·
**#247** · **#248** (the earned-knowledge ledger — the DV arc is the **pilot**, and this table is
exactly the kind of world-price knowledge that must be EARNED, never innate) · **#214 / #215.3 /
#216** (the GOAL-GENEALOGY CENSUS — **THE FORM**) · **#218** (the census's own 10 s co-occurrence
window) · **#163** (seed/stats disjointness) · **#181.2** (every HARD gate in-probe) ·
**#197-M1/#198** (hashed body vs unhashed envelope) · **#20** (cluster = match seed) · **#128**
(wall is CONTEXT ONLY) · **#203** (rows, never verdicts) · **#226.1** (the transcript form) ·
**#229.2** (no table typed that the artifact does not carry — discharged by a committed generator).

> ⭐ **INSTRUMENT-ONLY ROUND.** `src/**` is **byte-untouched** (X-SRC-UNTOUCHED is a HARD gate).
> No flag is armed, no gene is written, no eye is constructed, and **nothing measured here reaches
> any player**. The contract's own DV-C0 clause says *no src change*; this stage adds none.

---

## §FORM

### The world — ONE arm, bare production

`new Match({ seed, teamA, teamB })` — the shipped game, constructed exactly as the goal-genealogy
census's `PROD` arm constructs it (same `teamInfo` derivation, same `seed * 2 + 1 / seed * 2 + 2`
squad seeds). **This is the world whose prices ground everything**: the contract's §0 verdict was
that the pricer's map disagrees with *the world it plays in*, so the table must be measured in that
world and no other. **G-WORLD** reads it back on a freshly constructed, never-stepped match: no MT
consumption flag, no banked stage flag (`dlcStrikePlane`, `dlcDeliveryChoice`, `obmMovement`,
`ptpPassToPath`, `ctbCheckToBall`, `pmPhaseModulation`, `mtMarkTightness`, `dvDeliveryValue`), no
seam gene on **any** of the six genome views, `stationEye` null, `mtArmedVersion` 0.

⭐ **This is a CENSUS, not a contrast.** One arm, no treatment, no pairing, no A/B predicate
anywhere. There is no "arm B" to compare against and none is implied.

### The measured quantity — the loss and its price

For **every team-level turnover**, inherited **VERBATIM** from the goal-genealogy census:

* a **possession segment** = a maximal interval of same-owner-**TEAM** control while
  `phase === 'playing'`, suspended (not ended) while the ball is loose in play, ended by an
  opponent establishing ownership, by the phase leaving `playing`, or by full time (#214 §3.1);
* a **TURNOVER** = a segment that ends with terminator `opponentControl`;
* ⭐ **THE LOSS-TICK SEMANTICS (#215.3-H1/M2), inherited verbatim**: the turnover's **POSITION** is
  the ball at the **LOSING team's LAST-CONTROLLED tick** — the release/loss point — and its
  **TIME** is stamped at the tick the opponent established control (the census's own stamp for the
  same event). The gap between the two ticks is the #215 **wedge**; it is a real property of the
  world and is recorded as a deviation, not smoothed away.

The price: **does the CONCEDING side — the team that lost the ball — concede a goal within W
sim-seconds of the loss**, attributed cleanly to that loss?

**hazard(zone) = attributed goals-against(zone) / turnovers(zone).**

### The zoning — frozen ex ante from the pitch's own geometry

| axis | boundary | trace |
|---|---|---|
| thirds (**primary table**) | `localX < −HALF_L/3` = **own** · `> +HALF_L/3` = **final** · else **middle** | `HALF_L / 3` — the #188 / PM-T1 `OWN_THIRD_LOCAL_X`, inherited through #214 |
| lateral bands (**secondary only**) | `|y| ≤ HALF_W/3` = **central**, else **wide** | `HALF_W / 3` — the SAME one-third rule applied to the pitch's own WIDTH constant |

⭐ **THE FRAME IS THE LOSER'S** — "where did *I* lose it", so `own third` = the losing team's own
defensive third. ⚠ This is the **mirror** of #214's origin classes, which name thirds in the
**winner's** frame (`turnoverWonInFinalThird` = a loss in the loser's own third). Both frames are
exact mirrors (`localX_winner = −localX_loser`); DV-C0 states its frame explicitly because **the
price belongs to the team that pays it**. The pitch is symmetric about `y = 0`, so `|y|` needs no
mirror.

**G-ZONE-TRACE** re-derives both boundaries from `src/sim/constants.ts` at run time — neither is a
typed metre value. The lateral band is declared as an **analogue** (the width-axis application of
the traced third rule), chosen by this stage; it enters the **secondary** table only, and **no #246
predicate touches it**.

### The window — the #218 census's own, plus a pre-registered sensitivity ladder

* **PRIMARY: 10 sim-seconds** — the goal-genealogy census's own co-occurrence window (its
  `DANGER_WINDOWS_S = [5, 10]`; the #218 reading — *~31 % of all goals arrive within 10 s of an
  own-third loss* — is the contract §0 evidence this stage prices).
* **SENSITIVITY: 5 / 15 / 20 s** — integer multiples of that family's smallest member, so the
  table's **window-dependence is visible** rather than hidden behind one choice.
* **G-WINDOW-TRACE** does not accept these as typed levels: it **reads** the census's committed
  artifact (`frozenDesign.definitions.dangerWindowsS`), asserts the primary window is a **member**
  of that family, and asserts every sensitivity window is an **integer multiple** of the family's
  minimum.

### ⭐⭐ The attribution rule — frozen ex ante, stated before any run

**NEAREST-IN-WINDOW, GREEDY, ONE-TO-ONE.** Per match, per window W: conceded goals are processed in
**chronological** order; a goal conceded by team T at `t_g` is attributed to the **LATEST**
not-yet-attributed turnover by T whose loss stamp lies in `[t_g − W, t_g]` (ties → earliest index,
deterministic); if the candidate set is empty the goal is **UNATTRIBUTED**.

⇒ every goal maps to **exactly one-or-zero** turnovers, and every turnover carries **at most one**
goal. That is precisely the accounting identity **G-ACCOUNTING** checks. The #218
**CO-OCCURRENCE** reading (*"was there ANY conceded goal within W of this loss"* — many-to-one) is
computed independently and published **beside every cell** as the declared cross-cut.

### The estimator

Cluster bootstrap by **match seed** (#20), 2,000 resamples, percentile 95 % CI, **ratio-of-sums**
per zone (`Σk / Σn` over resampled clusters — the right estimator for a rate whose denominator is
itself random). ⭐ **ONE SHARED resample-index matrix**, so every zone hazard *and* every zone
**difference** (the #246 predicates) is computed on the **same** resampled clusters — the
differences are paired by construction. Stats stream base **106,000**, disjoint from the match RNG
(#163).

## §SHAPE — the ⭐ #246 reality-shape check, PRE-REGISTERED

Real football's structure, cited as a **SHAPE ONLY** (VISION §3 — 常数永不进口; no real-football
number appears anywhere in this probe):

1. **SHAPE-1** `hazard(own third) > hazard(middle third)`
2. **SHAPE-2** `hazard(middle third) > hazard(final third)`
3. **SHAPE-3 (THE GRADIENT)** both together — hazard rises toward one's **own** goal.

Each is resolved by the **paired cluster-bootstrap CI of the difference** excluding zero:
`RESOLVED-CONFIRM` (CI entirely above 0) · `RESOLVED-INVERT` (entirely below 0) · `UNRESOLVED`.
Evaluated at **every** window and reported at all of them; the **primary** window's reading is the
one the yardstick freezes.

⚠⚠ **AN INVERSION IS A FINDING, NOT AN ERROR.** Per #246 it is **PUBLISHED** and routed to the
**街机偏离 test** (deliberate arcade trade-off vs substrate defect) and is **NEVER** silently
corrected into the table. **MAGNITUDES are OUR world's and are supposed to be** — the method is
reality's (players learn their own world's prices), the numbers are this world's, and only the
**SHAPE** is the fidelity check.

## §YARDSTICK — the convergence schema DV-T2 may not re-cut

The artifact carries `result.census.yardstick`, schema **`dv-c0.truth-table.v1`**, frozen **now**,
before any belief exists (#247):

```
{ schema, frame, windowS, zoning{thirds, thirdBoundaryLocalX, bands, bandBoundaryAbsY, cells},
  zones{own|middle|final → {hazard, ci95, turnovers, goalsAgainst}},
  cells{<third>_<band> → {hazard, ci95, turnovers, goalsAgainst}},
  relative{zone → hazard / mean(zone hazards)},   ordering[ranked zones],
  baselineHazardAllZones }
```

**DV-T2 compares a belief vector against `zones` (absolute), `relative` (scale-free — the shape
only) and `ordering` (the rank vector), and against nothing else.** Freezing the schema here is
what stops T2 from re-cutting the yardstick after seeing beliefs.

## §SEEDS — fresh, strictly above everything the programme has consumed (#163)

Band **12,429,000–12,429,999**, opened above DLC-T1s's battery + reserve (…12,428,899) and its
test-seed band (…12,428,906), read off that stage's committed artifact ledger.

| block | seeds | kind |
|---|---|---|
| smoke | 12,429,000–12,429,011 | reserved, walked in smoke mode |
| ⭐ exit-semantics **guard block** | 12,429,050–12,429,099 | reserved — where EVERY non-census invocation is routed |
| census + reserve | 12,429,100–12,429,899 (N ≤ 800) | reserved, walked in full mode |
| G-WORLD construction seed | 12,429,999 | constructed, **never stepped** |
| ⭐ **G-REPRO-GGC re-walk** | 12,421,000–12,421,011 | **receipt** — the census's own smoke block |

⭐ **THE RE-WALK'S PREDICATE IS INVERTED**: it *must* collide with the consumed ledger, because a
re-walk that came back clash-free would prove it is walking fresh seeds instead of reproducing a
receipt. Every other block carries the ordinary predicate (collision-free), and the sub-blocks are
ordered and disjoint from each other. The full #163-regime consumed ledger rides in the artifact.

**Stats stream:** base **106,000**, minimum gap to any published base **200** (the #163 floor);
the published ledger is DLC-T1s's complete ≥91,100-regime list plus its own base 105,800.

## §NRULE — sized by the RARITY OF THE NUMERATOR

Turnovers are plentiful (~35/match in the census's PROD arm); the scarce quantity is the
**numerator** — a conceded goal cleanly attributed to a turnover inside the primary window — and it
is the numerator that sets the per-zone CI width. So the rule targets the **rarest third-level
zone**:

```
N* = min( ceil(60 / rarestZoneEventsPerMatch) ↑25,
          floor(0.5 h / (ms/match × 1 arm × 2 X-DET)),
          800 )
```

60 events ⇒ a count's relative SE ≈ `1/sqrt(60)` ≈ 13 %, the precision at which a hazard
**ORDERING** (the #246 check) is readable. `rarestZoneEventsPerMatch` and `ms/match` are the
**only two numbers** a full run reads out of the committed smoke artifact (the #188 §4.3
precedent), and they feed **only** N — no hazard, share, CI, ordering or shape verdict is read from
the smoke anywhere. The 800 cap is the reserved seed room, an honest **seed-budget** cap.

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

| gate | what it proves |
|---|---|
| **X-DET** (×2) | the whole measured core computed twice, canonical-JSON digests identical |
| **X-FP-PROD** | the shipped league fingerprint re-derived in this process, unchanged |
| **X-SRC-UNTOUCHED** | `git diff --stat -- src` empty — instrument-only, HARD |
| ⭐⭐ **G-REPRO-GGC** | the inherited walker re-walks the goal-genealogy census's **own committed smoke block** in its **own PROD world** and reproduces its published **integer** rows exactly (goal origins on both readings, families, the loss-third cut, the construction ladder on both pools, the segment-origin population, own-third turnovers on both readings, and the tick/goal accounting) |
| **G-WINDOW-TRACE** | the primary window is a member of the #218 census's committed window family, and every sensitivity window is an integer multiple of its minimum — **read from the artifact, never typed** |
| **G-ZONE-TRACE** | both zoning boundaries re-derived from `HALF_L` / `HALF_W` at run time |
| **G-WORLD** | the arm is bare production (flags, genes, eye, readback) |
| **SEED-DISJOINT** | every block this stage touches is machine-checked; the re-walk's predicate inverted |
| **STATS-DISJOINT** | stats base 106,000, min gap ≥ 200 to the published ledger |
| ⭐ **G-CLEAN-INVOCATION** | any `DVC0_N` / `DVC0_CAP` / `DVC0_SKIP_FP` routes the run onto the **guard block**, turns this gate RED and exits 1 — the census block stays VIRGIN; a preflight can additionally never write a canonical repo path (guarded at parse time **and** at write time, on the RESOLVED absolute path) |
| **G-N-DERIVED** | the N run **is** the frozen §NRULE output |
| ⭐ **G-ACCOUNTING** | (i) every tick in exactly one of {segment · loose interval · dead ball}, spans ordered and non-overlapping (the #214 identity); (ii) **every turnover classified into exactly one zone cell** (total = ledgered = summed over the six cells); (iii) **every conceded goal attributed to exactly one-or-zero turnovers** (attributed + unattributed = conceded, at **every** window, and no turnover carries two goals); (iv) attribution monotone in the window |

**No gate reads a hazard.** The #246 shape flags are mechanical CI readings, not gates: an
inversion turns nothing red.

## §NON-CLAIMS

1. **NOTHING SHIPS.** Zero `src/**` bytes; the production fingerprint re-derived unchanged; no
   flag and no gene written anywhere.
2. ⭐⭐ **THE TABLE IS NOT WIRED INTO ANY PLAYER (#247).** It is instrument-side truth: it grounds
   DV-T1's hand doses and yardsticks DV-T2's belief convergence. No chooser reads it, now or as a
   consequence of this stage. Per #248 this arc is the **pilot** for the earned-knowledge standard.
3. **NO PASS/FAIL ON ANY MEASURED HAZARD.** The gates are the X-family, the inheritance receipt,
   the trace gates and the accounting identities.
4. **THE HAZARD IS A CONDITIONAL RATE, NOT A CAUSAL EFFECT.** Losses are not randomly assigned to
   zones: a team losing it in its own third is in a different state from one losing it in the final
   third, and that state is part of the price. No counterfactual is claimed.
5. **THE ATTRIBUTION RULE IS A RULE, NOT A TRUTH.** A different rule would move goals between
   cells. It is frozen ex ante, the co-occurrence cross-cut is published beside every cell, and the
   whole table is republished at four windows so the reader can see how much the choice moves.
6. **THE WINDOW LADDER IS A REPORTING GRID.** No window is privileged beyond the pre-registered
   primary, and none is tunable after sight.
7. **THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203).** DV-T0 / DV-T1 / DV-T2 are the
   contract's.

---

## §RESULT

**725 seeds × 1 arm (bare production), block 12,429,100–12,429,824, 12/12 gates PASS**, `resultSha256` `c2ad2f27…9156`. Every number below is printed by `scripts/analysis/dv-c0-census-result.ts` from the committed artifact; none is typed (#229.2).

### The run

```text
world            bare production — ⭐ BARE PRODUCTION — `new Match({seed, teamA, teamB})`, the SHIPPED game.
matches          725   (241.98 sim-seconds each)
turnovers        24,729   (34.1090 per match)
conceded goals   1,585   (2.1862 per match)
primary window   10 s   (the #218 census's own co-occurrence window)
estimator        cluster bootstrap by match seed, 2,000 resamples, stats base 106,000
```

### ⭐⭐ THE TRUE TABLE — turnover → goal-against hazard by zone (PRIMARY WINDOW)

Hazard = attributed goals-against ÷ turnovers, in the **LOSER's frame** ("where did I lose it"), at the pre-registered **10 s** window, with the paired cluster-bootstrap 95 % CI.

| zone | turnovers | goals-against (attributed) | **hazard** | CI 95 % (pp) | co-occurrence rate |
|---|---:|---:|---:|---:|---:|
| ⭐ **own third** | 5,380 | 439 | **8.160 %** | [7.435, 8.923] | 9.944 % |
| middle third | 12,544 | 528 | **4.209 %** | [3.828, 4.591] | 5.293 % |
| final third | 6,805 | 123 | **1.807 %** | [1.491, 2.135] | 2.395 % |
| **ALL ZONES** | 24,729 | 1,090 | **4.408 %** | [4.138, 4.693] | 5.508 % |

The **co-occurrence** column is the #218 census's own many-to-one reading (*was there ANY conceded goal within the window*), published beside every cell as the declared cross-cut; the hazard column is the frozen one-to-one nearest-in-window attribution.

### ⭐ THE #246 REALITY-SHAPE CHECK — pre-registered, evaluated with CIs

| window | own − middle (pp) | CI 95 % | verdict | middle − final (pp) | CI 95 % | verdict | ⭐ GRADIENT |
|---|---:|---:|---|---:|---:|---|---|
| 5 s | 3.774 | [3.131, 4.470] | ✅ RESOLVED-CONFIRM | 1.949 | [1.639, 2.260] | ✅ RESOLVED-CONFIRM | ✅ RESOLVED-CONFIRM |
| 10 s **(PRIMARY)** | 3.951 | [3.179, 4.795] | ✅ RESOLVED-CONFIRM | 2.402 | [1.938, 2.880] | ✅ RESOLVED-CONFIRM | ✅ RESOLVED-CONFIRM |
| 15 s | 3.926 | [3.115, 4.829] | ✅ RESOLVED-CONFIRM | 1.805 | [1.244, 2.361] | ✅ RESOLVED-CONFIRM | ✅ RESOLVED-CONFIRM |
| 20 s | 3.958 | [3.125, 4.842] | ✅ RESOLVED-CONFIRM | 1.403 | [0.779, 2.010] | ✅ RESOLVED-CONFIRM | ✅ RESOLVED-CONFIRM |

**The shape holds at the primary window and the gradient is resolved.** Per #246 that is the fidelity check passing: the METHOD is reality's, the MAGNITUDES are this world's and are supposed to be, and the SHAPE is what had to agree. The 街机偏离 routing clause stays dormant.

Routing recorded in the artifact: *no inversion at this window; the routing clause is dormant.*

### THE WINDOW LADDER — the table's window-dependence, made visible

| window | own third | middle third | final third | all zones |
|---|---:|---:|---:|---:|
| 5 s | 6.134 % | 2.360 % | 0.411 % | 2.645 % |
| 10 s **(PRIMARY)** | 8.160 % | 4.209 % | 1.807 % | 4.408 % |
| 15 s | 8.773 % | 4.847 % | 3.042 % | 5.204 % |
| 20 s | 9.108 % | 5.150 % | 3.747 % | 5.625 % |

Counts (turnovers) do not move with the window — the denominator is the same population at every row; only the numerator grows. The ordering is printed above for each window.

### THE SECONDARY TABLE — third × lateral band (PRIMARY WINDOW)

| cell | turnovers | goals-against | hazard | CI 95 % (pp) |
|---|---:|---:|---:|---:|
| `own_central` | 3,872 | 315 | 8.135 % | [7.320, 8.996] |
| `own_wide` | 1,508 | 124 | 8.223 % | [6.808, 9.701] |
| `middle_central` | 6,692 | 281 | 4.199 % | [3.700, 4.697] |
| `middle_wide` | 5,852 | 247 | 4.221 % | [3.700, 4.764] |
| `final_central` | 3,926 | 56 | 1.426 % | [1.073, 1.820] |
| `final_wide` | 2,879 | 67 | 2.327 % | [1.765, 2.920] |

⚠ The lateral band is this stage's own **analogue** of the traced third rule (`HALF_W/3`), and no #246 predicate touches it. It is published because a zoning the exams may later want is cheaper to measure now than to re-cut after sight.

### ⭐ THE CONVERGENCE YARDSTICK — the schema DV-T2 may not re-cut

```json
{
  "schema": "dv-c0.truth-table.v1",
  "frame": "the LOSING team's own attacking frame — \"where did I lose it\".",
  "windowS": 10,
  "zones": {
    "own": {
      "hazard": 0.0816,
      "ci95": [
        0.07435,
        0.08923
      ],
      "turnovers": 5380,
      "goalsAgainst": 439
    },
    "middle": {
      "hazard": 0.04209,
      "ci95": [
        0.03828,
        0.04591
      ],
      "turnovers": 12544,
      "goalsAgainst": 528
    },
    "final": {
      "hazard": 0.01807,
      "ci95": [
        0.01491,
        0.02135
      ],
      "turnovers": 6805,
      "goalsAgainst": 123
    }
  },
  "relative": {
    "own": 1.72686,
    "middle": 0.89073,
    "final": 0.38241
  },
  "ordering": [
    "own",
    "middle",
    "final"
  ],
  "baselineHazardAllZones": 0.04408
}
```

Ordering: **own > middle > final**. The `relative` vector is the scale-free form — a belief that has the right SHAPE but the wrong magnitudes scores well on it and badly on `zones`, which is exactly the distinction #247 asks DV-T2 to measure.

### Gate table

| gate | result | evidence |
|---|---|---|
| `xDet` | **PASS** | digest `57bfffdb0a14…` twice |
| `xFpProd` | **PASS** | observed `57b0bdab3891…` = baseline, re-derived in-process |
| `xSrcUntouched` | **PASS** | `git diff --stat -- src` empty |
| `gReproGgc` | **PASS** | 62 integer fields, **0 mismatches**, block 12421000..12421011 (PROD) |
| `gWindowTrace` | **PASS** | family `[5,10]` read from the committed census; primary 10 s is a member; all of `[5,10,15,20]` are multiples of 5 |
| `gZoneTrace` | **PASS** | third ±10.5000 m = `HALF_L / 3` · band 6.7667 m = `HALF_W / 3` |
| `gWorld` | **PASS** | 6 genome views gene-free · no MT flag · no stage flag · eye null · readback 0 |
| `gSeedDisjoint` | **PASS** | 6 blocks machine-checked (1 re-walk, predicate inverted); block 12429100..12429824 |
| `gStatsDisjoint` | **PASS** | base 106,000, minGap 200 ≥ 200 |
| `gCleanInvocation` | **PASS** | envN null · capped false · skipFp false · routedToGuardBlock false |
| `gNDerived` | **PASS** | ran N 725 = derived N\* 725 |
| `gAccounting` | **PASS** | ticks true · noOverlap true · zone partition true · one-to-one true · per-window identity true · monotone true |

### THE ACCOUNTING IDENTITIES (gate input — ticks, turnovers and goals, not football)

```text
ticks        10,926,815 = segment 9,396,886 + loose 0 + deadBall 1,529,929      ⇒ ok
no overlap   assignedTicksSum 9,396,886 = segmentTicks 9,396,886   · spanOrderViolations 0
turnovers    walked 24,729 = ledgered 24,729 = Σ over the six zone cells 24,729   ⇒ every turnover in EXACTLY ONE zone
goals        conceded 1,585 = score deltas 1,585 · doubleAttributed 0
  @ 5 s      attributed   654 + unattributed   931 = 1,585   · Σ cells 654
  @10 s      attributed 1,090 + unattributed   495 = 1,585   · Σ cells 1,090
  @15 s      attributed 1,287 + unattributed   298 = 1,585   · Σ cells 1,287
  @20 s      attributed 1,391 + unattributed   194 = 1,585   · Σ cells 1,391
```

### THE N RULE AS EXECUTED (in-probe, from the committed smoke)

```text
rule            N* = min( ceil(60 / rarestZoneEventsPerMatch) ↑25, floor(0.5 h / (ms/match × 1 arm × 2 X-DET)), 800 ) — frozen in the stage doc §NRULE BEFORE the smoke ran. The rarest-zone event is an ATTRIBUTED conceded goal in the RAREST of the three third-level zones at the PRIMARY window, i.e. the scarcest numerator the published table contains.
smoke artifact  docs/world-model/data/dv-c0-loss-cost-smoke.json  (sha256 67f14879559e8d11…)
rarest-zone events/match 0.08333  ⇒ raw 721 → step 725
wall term 8,437 · cap 800   ⇒ N* 725  (precision binds; projected 0.043 h)
as executed     N 725 · ms/match 82.9 · rarest-zone events/match at battery 0.16966
```

The rarest third-level zone at the primary window carries **123** attributed goals-against against the rule's target of 60.

### Deviations recorded

1. A TOUCH / OWNERSHIP EPISODE IS NOT A FOOT-BALL CONTACT (inherited from the #170 tempo census through #214): Match exposes ball.owner, not a contact event. Everything here is derived from observable state, which is what X-SRC-UNTOUCHED requires.
2. ⭐ THE TURNOVER EVENT CARRIES TWO TICKS AND THIS PROBE USES BOTH AS THE CENSUS DOES: the POSITION is read at the LAST OWNED tick (#215.3-H1) and the TIME is stamped at the tick the opponent establishes control (the census's own stamp for the same event). The gap between them is the #215 wedge and is a real property of the world, not a defect.
3. ⭐ THE LATERAL BAND IS AN ANALOGUE, NOT AN INHERITANCE: HALF_L/3 is a traced, twice-inherited constant; HALF_W/3 is the same one-third rule applied to the width constant, chosen ex ante by this stage. It enters the SECONDARY table only — the primary table and every #246 predicate are on THIRDS alone.
4. THE HAZARD IS A CONDITIONAL RATE, NOT A CAUSAL EFFECT. "Goal against within W of a loss here" is temporal attribution under a frozen rule; no counterfactual is claimed, and losses are not randomly assigned to zones (a team that loses it in its own third is in a different state from one that loses it in the final third — the state is part of the price).
5. THE ATTRIBUTION RULE IS A RULE, NOT A TRUTH. A goal 9 s after a midfield loss and 2 s after an own-third loss is credited to the own-third loss; a different rule would move it. The rule is frozen ex ante, the CO-OCCURRENCE cross-cut is published beside every cell, and the whole table is republished at four windows so the reader can see how much the choice moves.
6. SINGLE ARM, NO PAIRING. This is a CENSUS, not a contrast: there is no treatment, no control and no A/B predicate anywhere in this stage.
7. NO CHECKPOINT/RESUME: the census is a few minutes; a kill costs the run. Stated, not hidden.

### Registered non-claims (from the artifact)

1. NOTHING SHIPS: zero src/** bytes, the production fingerprint re-derived unchanged, no flag and no gene written anywhere.
2. ⭐⭐ THE TABLE IS NOT WIRED INTO ANY PLAYER (#247). It is instrument-side truth: it grounds DV-T1's hand doses and yardsticks DV-T2's belief convergence. No chooser reads it, now or as a consequence of this stage.
3. NO PASS/FAIL ON ANY MEASURED HAZARD. The gates are the X-family, the inheritance receipt, the trace gates and the ACCOUNTING identities. The #246 shape flags are MECHANICAL CI readings, not gates: an inversion turns nothing red and is routed, not corrected.
4. THE WINDOW LADDER IS A REPORTING GRID. No window is privileged beyond the pre-registered primary, and none is tunable after sight.
5. THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203). DV-T0/T1/T2 are the contract's.

**VERDICT (the probe's own, mechanical):** DV-C0 LOSS-COST CENSUS at N=725 × 1 arm (production) — gate-green. THE TABLE IS DESCRIPTIVE TRUTH: the #246 shape flags are mechanical and the commander adjudicates them.

### §CHECKS (#226.1)

```text
$ npx tsc --noEmit
(clean)

$ DVC0_MODE=smoke DVC0_CAP=2 DVC0_SKIP_FP=1 npx tsx scripts/probes/dv-c0-loss-cost.ts
  seeds 12429050..12429051            ← routed onto the exit-semantics GUARD block
  GATES *** RED ***: … gCleanInvocation FAIL …
  exit 1

$ DVC0_MODE=smoke DVC0_CAP=2 DVC0_OUT=docs/world-model/../world-model/data/x.json \
    npx tsx scripts/probes/dv-c0-loss-cost.ts
  DV-C0 FATAL — a PREFLIGHT invocation may not write a canonical repo path
  exit 2 · no file written (the traversal spelling is resolved, not substring-tested)

$ DVC0_MODE=smoke npx tsx scripts/probes/dv-c0-loss-cost.ts
  GATES GREEN (12) · G-REPRO-GGC 62 fields · 0 mismatches
  exit 0 · resultSha256 eb6fa56a320b91558ce265f5f282959ff020f8349d14175e80441ec87e9597c3
  wall 14.7 s (CONTEXT ONLY) · artifact docs/world-model/data/dv-c0-loss-cost-smoke.json

$ DVC0_MODE=full npx tsx scripts/probes/dv-c0-loss-cost.ts
  GATES GREEN (12) · N* 725 (precision binds) · block 12,429,100–12,429,824
  exit 0 · resultSha256 c2ad2f273623219d5ff31dfa240c0cb7649072f7327928ce576fcfd5a7409156
  wall 126.3 s (CONTEXT ONLY) · artifact docs/world-model/data/dv-c0-loss-cost.json

$ npx tsx scripts/analysis/dv-c0-census-result.ts docs/world-model/data/dv-c0-loss-cost.json
  → the whole §RESULT section above, on stdout
```

⭐ Five commands were run in this round and all five are transcribed above; the `resultSha256` in
the §RESULT header is the one the generator read out of the committed artifact, so the two are the
same string or this doc would not build. `npm test` is **not** re-run and is named rather than
implied: this round adds **one probe, one generator, two artifacts and one doc**, touches **no**
`tests/**` file and **no** `src/**` byte (X-SRC-UNTOUCHED is a HARD gate and PASSES on the run that
wrote the artifact), so the suite's state is the one banked at the previous commit.

### Facts that are *not* deviations, recorded anyway

1. **N\* = 725, AND THE FROZEN RULE PRODUCED IT.** The smoke's rarest third-level zone carried
   **1** attributed goal-against in 12 matches (0.08333/match) ⇒ `ceil(60 / 0.08333) = 721 → ↑25 =
   725`; the wall term (8,434) and the 800 cap did not bind. At battery grain the same zone carries
   **123** events — comfortably above the rule's target of 60 — because the smoke's single event
   was a small-sample floor, not a level anyone read.
2. **THE SMOKE'S TABLE AND THE BATTERY'S TABLE DISAGREE, AND THAT IS THE DESIGN.** At 12 seeds the
   own−middle limb was UNRESOLVED; at 725 it is resolved at every window. The smoke adjudicated
   nothing and fed only N (its two sizing numbers); no hazard, ordering or shape verdict was read
   from it anywhere, and `gNDerived` proves the N that ran is the rule's output.
3. **THE CO-OCCURRENCE COLUMN IS LARGER THAN THE HAZARD COLUMN EVERYWHERE, BY CONSTRUCTION.**
   Co-occurrence is many-to-one (one goal can mark several preceding losses); the hazard is the
   one-to-one attribution. The gap widens with the window, which is why both are published at all
   four.
4. **THE WALL IS CONTEXT ONLY (#128).** 126.3 s for 725 × 2 passes plus the repro block, the
   fingerprint and the gates; it enters no rate and no gate.

### Disposition

The census is run, twice-deterministic and **gate-green on 12/12 at 725 seeds**, with G-REPRO-GGC
reproducing the goal-genealogy census's committed PROD rows on **62 integer fields, 0 mismatches**
— the inherited loss-tick machinery proved rather than asserted. **The TRUE TABLE is banked**, the
#246 reality-shape check is readable at every window, and the `dv-c0.truth-table.v1` yardstick is
frozen before any belief exists. What the table *means* for DV-T0/T1/T2 — and whether the shape
result closes or merely narrows the contract §0 risk-side gap — is the commander's (#203).
