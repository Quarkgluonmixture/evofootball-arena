# DV-T2-C0 — THE PASS-LEVEL CENSUS (传这个球会不会挨罚: the label's own truth)

Status: **FROZEN, then RUN.** Everything from §FORM to §NON-CLAIMS — the world, the delivery
family, the label, the index, the window, the estimator, the seed ledger, the N rule, the ⭐ #246
shape predicates and the gate list — is the design fixed **in the probe's own frozen constants and
gate predicates before any receipt ran**, and every clause below is machine-checkable against the
committed artifact rather than a promise about it. The measured numbers live in
[§RESULT](#result), **GENERATED PROGRAMMATICALLY** from the artifact by a committed generator
(`scripts/analysis/dv-t2-c0-census-result.ts`), never typed (#229.2).

⚠ **This document reports; it does not adjudicate (#203).** The #246 shape flags are mechanical CI
readings printed exactly as the artifact records them. What an inversion *means* — deliberate
arcade trade-off or substrate defect — is the commander's.

Authority chain: the **DV-T2 LEARNED-MAP CONTRACT**
[`DV-T2-LEARNED-MAP-CONTRACT.md`](DV-T2-LEARNED-MAP-CONTRACT.md) **§2 M-DV2.1** (THE PASS-LEVEL
LABEL) and **§3 T2-C0** (*"measure the label's own truth globally — P(conceded ≤ 10 s | delivery
into z, lost) by AIM zone, production world — because the banked GGC cut indexes losses by
LAST-OWNED zone and cannot be re-cut by aim. Its ordering = the convergence yardstick; it also
proves the label well-defined (chain semantics traced). ⭐ #246 shape check pre-registered."*),
bound by ruling **#255.2** and dispatched by **#255.4**. Rulings **#245/#246/#247/#248** (the DV
arc) · **#249** ([`DV-C0-LOSS-COST-CENSUS.md`](DV-C0-LOSS-COST-CENSUS.md) — ⭐ **THE FORM**: this
stage inherits its walker, its loss-tick semantics, its attribution rule, its accounting
identities, its window ladder and its N rule) · **#214/#215.3/#216/#218** (the goal-genealogy
census) · **#250.3** (mode-conditioned caveat literals) · **#251.3 / #252.3** (⭐⭐ derive your own
predicates and give **every** conjunct a mutant) · **#163** · **#181.2** · **#197-M1/#198** ·
**#20** · **#128** · **#203** · **#226.1** · **#229.2**.

> ⭐ **INSTRUMENT-ONLY ROUND.** `src/**` is **byte-untouched** (X-SRC-UNTOUCHED is a HARD gate).
> No flag is armed, no gene is written, **no learning seam is built** (that is T2-T0's), and
> **nothing measured here reaches any player** (#247). The contract's T2-C0 clause says
> *instrument-only, no src change*; this stage adds none.

---

## §FORM

### The world — ONE arm, bare production

`new Match({ seed, teamA, teamB })` — the shipped game, constructed exactly as DV-C0's census arm
(and the goal-genealogy census's `PROD` arm) constructs it, same `teamInfo` derivation, same
`seed * 2 + 1 / seed * 2 + 2` squad seeds. **G-WORLD** reads it back on a freshly constructed,
never-stepped match: no MT consumption flag, no banked stage flag (incl. `dvDeliveryValue` itself
and `o1PassWindup`), no seam gene on any of the six genome views, `stationEye` null,
`mtArmedVersion` 0.

⭐ **This is a CENSUS, not a contrast.** One arm, no treatment, no pairing, no A/B predicate.

### The measured population — ⭐ THE DELIVERY FAMILY, traced

The DV-T0 §SEAM **scope note** draws the boundary: *"the risk price reaches every candidate that
goes through the **ground-pass pricer**. The LOFT, the THROUGH BALL, the CROSS and the CUTBACK
price themselves on their own chains and are **not** priced by this seam."* So a **DELIVERY** here
is a **ground pass STRUCK** — every `Match.performPass` strike the **engine's own guard** let
through — and nothing else. Lofts, through balls, crosses and cutbacks are out of the family by
the contract's own words.

The strike is observed through an **instance wrapper** on `performPass` (the PTP-T0 / DV-T1
idiom), which is a pass-through; **G-WRAPPER-INERT** proves the inertness on a twin walk of one
declared seed (same match, wrapped vs bare, identical inherited columns) rather than asserting it.
A call the engine's guard rejects (`ball.owner !== passer` or `kickCooldown > 0`) writes **no**
delivery and is counted as a *suppressed call*: the ENGINE's own `lastPassKind` replacement is the
test, never a re-implemented guard.

### ⭐⭐ The index — THE AIM ZONE, in the PASSING team's frame

The label's index is the **AIM** zone, *"the pricing's own read, so the §HONESTY 8 index mismatch
is fixed AT THE SOURCE"* (M-DV2.1). The classifier is **the shipped one, imported**:
`receptionZoneIndex` from `src/ai/deliveryValueSeat.ts`, whose boundary is that module's exported
`DV_THIRD_BOUNDARY_LOCAL_X`.

| axis | boundary | trace |
|---|---|---|
| thirds (**the only table**) | `localX < −HALF_L/3` = **own** · `> +HALF_L/3` = **final** · else **middle** | `HALF_L / 3` — the #188 / PM-T1 `OWN_THIRD_LOCAL_X` → #214 → DV-C0 → the shipped seat |

**G-ZONE-TRACE** proves four things at run time: the constant is `HALF_L / 3`; the shipped seat's
exported boundary **is** that constant; DV-C0's *committed* boundary equals it; and the shipped
classifier agrees with the census's own boundary rule on **2,001 samples swept across the pitch**.
The AIM point is `mate.pos` at the strike tick, which in a bare production world **is** the ground
pricer's aim for the candidate it struck (the PTP seat is null ⇒ `aim = mate.pos`) with pricing and
strike on the **same tick** (`o1PassWindup` shut) — all three facts are **gated**, not assumed.

⚠ **THREE ZONES ONLY.** DV-C0 published a lateral-band secondary table; this census does not. The
belief M-DV2.2 defines is **three-cell** (coarse on purpose — DV-T0 §HONESTY 6), and a finer
yardstick would be one T2-T1's books cannot be scored against.

### ⭐⭐ The label — M-DV2.1, stated before any run

For a delivery struck inside possession chain *S* by team *T*:

* **PUNISHED** ⇔ *S* ends with terminator `opponentControl` (**a LOSS**) **and** that turnover
  carries a conceded goal by *T* under **DV-C0's frozen attribution rule** inside the window.
* **LOST-BUT-UNPUNISHED** ⇔ *S* ends in a loss that carries no such goal.
* **SURVIVED** ⇔ *S* ends any other way (dead ball, a goal **for**, full time).

The three classes **partition** every delivery — that is the accounting identity **G-ACCOUNTING**
checks, and it is why the table is a full accounting rather than one column.

**Chain semantics, inherited VERBATIM from DV-C0 / #215.3-H1**: a possession segment is a maximal
interval of same-owner-**TEAM** control while `phase === 'playing'`, suspended while the ball is
loose in play, ended by an opponent establishing ownership, by the phase leaving `playing`, or by
full time; the turnover is **stamped** at the tick the opponent establishes control while its
**position** is read at the **last-owned** tick. **The attribution rule is DV-C0's**:
NEAREST-IN-WINDOW, GREEDY, ONE-TO-ONE (conceded goals chronological; a goal conceded by *T* at
`t_g` goes to the LATEST not-yet-attributed turnover by *T* with loss stamp in `[t_g − W, t_g]`,
ties → earliest index; otherwise UNATTRIBUTED). The #218 **CO-OCCURRENCE** reading (many-to-one) is
computed independently and published beside every cell as the declared cross-cut.

⭐⭐ **NONE OF THIS IS RE-TYPED**: **G-REPRO-DVC0** re-walks **DV-C0's own committed smoke block**
and must reproduce its published per-third turnover counts, attributed goals-against and
co-occurrence counts **at every window**, plus its accounting totals and per-window
attributed/unattributed split. **G-REPRO-GGC** re-walks the goal-genealogy census's own smoke block
and reproduces its published integer rows. The loss and concession semantics are **theirs**,
proved rather than promised.

### The two rates, and which one is primary

| quantity | definition | role |
|---|---|---|
| ⭐ **P(punished \| delivery into z)** | punished deliveries ÷ **all** deliveries into z | **PRIMARY** — the account book's own quantity: M-DV2.2's running frequency of punishment over the team's OWN deliveries into z. This is what a learned book converges to. |
| **P(punished \| delivery into z, LOST)** | punished ÷ **lost** deliveries into z | the contract §3 wording's conditional, published beside every cell as the declared cross-cut |
| complements | lost-but-unpunished ÷ deliveries · survived ÷ deliveries | the full accounting |

### The window — DV-C0's own, plus its own sensitivity ladder

* **PRIMARY: 10 sim-seconds** — *"the census's OWN 10 s window"* (M-DV2.1), which is DV-C0's
  primary and itself the #218 goal-genealogy co-occurrence window.
* **SENSITIVITY: 5 / 15 / 20 s** — DV-C0's own published ladder.
* **G-WINDOW-TRACE** types none of them: it reads DV-C0's committed artifact (the primary window
  **and** the ladder must be that artifact's), reads the goal-genealogy census's committed
  `dangerWindowsS` family (the primary must be a **member**), and asserts every ladder member is an
  integer multiple of that family's minimum.

### The estimator

Cluster bootstrap by **match seed** (#20) — the set grain — 2,000 resamples, percentile 95 % CI,
**ratio-of-sums** per zone (the right estimator for a rate whose denominator is itself random).
⭐ **ONE SHARED resample-index matrix**, so every zone rate *and* every zone **difference** (the
#246 predicates, on both denominators) is computed on the **same** resampled clusters — the
differences are paired by construction. Stats stream base **107,400** (ruling #255.4's floor),
disjoint from the match RNG (#163).

### ⭐ The event-rate moments — what T2-T1 sizes its run length from

Frozen as a **deliverable of this stage**, at the grain T2-T1's arithmetic needs: **deliveries per
zone, per team, per match** — mean, **SD**, CV, min / p10 / median / p90 / max, and the share of
team-matches with zero. Published beside them: punished deliveries per team per match, the
all-zones team-match total, and a **run-length grid** (matches a team must play for its book to
hold K = 10/20/30/50/100 deliveries in each zone at the measured mean rate). ⚠ The K grid is a
**REPORTING GRID** — T2-T1 freezes its own K, ex ante, from these moments.

## §SHAPE — the ⭐ #246 reality-shape check, PRE-REGISTERED

Real football's structure, cited as a **SHAPE ONLY** (VISION §3 — 常数永不进口; no real-football
number appears anywhere in this probe):

1. **SHAPE-1** `P(punished | own) > P(punished | middle)`
2. **SHAPE-2** `P(punished | middle) > P(punished | final)`
3. **SHAPE-3 (THE GRADIENT)** both together — punishment rises as the ball is aimed back toward
   one's own goal.

Each is resolved by the **paired cluster-bootstrap CI of the difference** excluding zero:
`RESOLVED-CONFIRM` · `RESOLVED-INVERT` · `UNRESOLVED`. **The primary predicate is on the MARGINAL
rate** (the book's own quantity); the conditional-on-lost form is evaluated and printed beside it
and gates nothing extra. Evaluated at **every** window; the **primary** window's reading is the one
the yardstick freezes.

⚠⚠ **AN INVERSION IS A FINDING, NOT AN ERROR.** Per #246 it is **PUBLISHED** and routed to the
**街机偏离 test** (deliberate arcade trade-off vs substrate defect) and is **NEVER** silently
corrected into the table. **MAGNITUDES are OUR world's and are supposed to be**; only the **SHAPE**
is the fidelity check. This matters twice over here: the FIFTH REGISTRATION predicts the books grow
*this* ordering on their own, so an inverted truth would make the registration a prediction about a
different shape — a commander's call, not a probe's.

## §YARDSTICK — the convergence schema T2-T1 may not re-cut

The artifact carries `result.census.yardstick`, schema **`dv-t2c0.pass-truth-table.v1`**, frozen
**now**, before any account book exists (#247):

```
{ schema, frame, index, windowS, zoning{thirds, thirdBoundaryLocalX},
  zones{own|middle|final → {punishRate, ci95, deliveries, punished, lost,
                            punishGivenLost, punishGivenLostCi95}},
  relative{zone → punishRate / mean(zone rates)},   ordering[ranked zones],
  baselinePunishRateAllZones,
  eventRateMoments[...],  runLengthArithmetic[...] }
```

**T2-T1 compares a learned belief vector against `zones` (absolute), `relative` (scale-free — the
shape only) and `ordering` (the rank vector), and against nothing else.** Freezing the schema here
is what stops T2-T1 from re-cutting the yardstick after seeing beliefs. ⭐ Because the index is the
**AIM** zone, this table is **commensurable with the belief the seam reads** — which DV-C0's
loss-indexed table is not (DV-T0 §HONESTY 8). That is the whole reason this census exists.

## §SEEDS — fresh, strictly above everything the programme has consumed (#163)

Band **12,436,000–12,436,999** (ruling #255.4's pre-registration), opened above DV-T1c's battery
(…12,434,035) and its reserved ceiling (…12,435,099).

| block | seeds | kind |
|---|---|---|
| smoke | 12,436,000–12,436,011 | reserved, walked in smoke mode |
| wrapper-inertness twin read (declared) | 12,436,020 | fresh, walked twice (wrapped + bare) |
| ⭐ exit-semantics **guard block** | 12,436,050–12,436,099 | reserved — where EVERY non-census invocation is routed |
| census + reserve | 12,436,100–12,436,899 (N ≤ 800) | reserved, walked in full mode |
| G-WORLD construction seed | 12,436,999 | constructed, **never stepped** |
| ⭐ **G-REPRO-GGC re-walk** | 12,421,000–12,421,011 | **receipt** — the goal-genealogy census's own smoke block |
| ⭐⭐ **G-REPRO-DVC0 re-walk** | 12,429,000–12,429,011 | **receipt** — DV-C0's own smoke block |

⭐ **THE RE-WALKS' PREDICATE IS INVERTED**: each *must* collide with the consumed ledger, because a
re-walk that came back clash-free would prove it is walking fresh seeds instead of reproducing a
receipt. Every other block carries the ordinary predicate (collision-free), and the sub-blocks are
ordered and disjoint. The ledger is the COMPLETE #163-regime list carried forward from DV-T1c's
committed probe, extended with **T1c's own** blocks (12,432,000–12,434,035 and the reserved ceiling
12,435,000–099); **DV-T0's ordered skip band 12,430,900–911 is entered explicitly and its presence
is itself a gate conjunct**, so the skip is machine-checked rather than promised.

**Stats stream:** base **107,400**, minimum gap to any published base **400** (the #163 floor is
200); the published ledger is DLC-T1s's complete ≥91,100-regime list plus DV-C0's 106,000, DV-T1's
106,200, DV-T1b's 106,600 and DV-T1c's 107,000.

## §NRULE — DV-C0's rule form, with this census's own numerator

Deliveries are plentiful; the scarce quantity is the **numerator** — a **PUNISHED** delivery in the
rarest AIM zone at the primary window — and it is the numerator that sets that cell's CI width. So
the rule targets the **rarest zone**, exactly as DV-C0's §NRULE does:

```
N* = min( ceil(60 / rarestZonePunishedPerMatch) ↑25,
          floor(0.5 h / (ms/match × 1 arm × 2 X-DET)),
          800 )
```

60 events ⇒ a count's relative SE ≈ `1/sqrt(60)` ≈ 13 %, the precision at which a rate
**ORDERING** (the #246 check) is readable — DV-C0's own target, inherited with its own
justification. `rarestZonePunishedPerMatch` and `ms/match` are the **only two numbers** a full run
reads out of the committed smoke artifact; they feed **only** N — no rate, CI, ordering or shape
verdict is read from the smoke anywhere. The 800 cap is the reserved seed room, an honest
**seed-budget** cap.

⭐ **THE ZERO-EVENT CLAUSE (frozen with the rest of the rule, before the smoke ran):** if the smoke
sees **zero** punished deliveries in the rarest zone, the precision term is **UNBOUNDED** — it
cannot be estimated from a zero count and this stage will not invent a floor for it — so the wall
term and the seed-budget cap bind. That is the `min()` doing its job, and the artifact records
`precisionTermUnbounded` either way.

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

| gate | what it proves |
|---|---|
| **X-DET** (×2) | the whole measured core computed twice, canonical-JSON digests identical |
| **X-FP-PROD** | the shipped league fingerprint re-derived in this process, unchanged |
| **X-SRC-UNTOUCHED** | `git diff --stat -- src` empty — instrument-only, HARD |
| ⭐⭐ **G-REPRO-DVC0** | the loss/concession semantics **are DV-C0's**: its own committed smoke block re-walked, reproducing per-third turnovers, attributed goals-against and co-occurrence **at every window**, plus the accounting totals and the per-window attributed/unattributed split |
| ⭐ **G-REPRO-GGC** | the walker **is** the goal-genealogy census's, with its loss-tick semantics: its committed smoke rows reproduced exactly |
| **G-WINDOW-TRACE** | the primary window **is** DV-C0's committed primary, **is** a member of the #218 family, and the ladder **is** DV-C0's ladder and integer multiples of the family minimum — all read from artifacts, never typed |
| ⭐⭐ **G-ZONE-TRACE** | the AIM index is the SHIPPED `receptionZoneIndex`: boundary = `HALF_L/3` = the seat module's export = DV-C0's committed boundary, and the classifier agrees with the census's rule on 2,001 swept samples |
| ⭐ **G-WRAPPER-INERT** | the `performPass` capture perturbs nothing: one declared seed walked wrapped vs bare, identical inherited-column digests, and non-vacuous (wrapped captures deliveries, bare captures none) |
| **G-WORLD** | the arm is bare production (flags incl. `o1PassWindup`, genes, eye, readback) |
| **SEED-DISJOINT** | every block machine-checked; the two re-walks' predicates inverted; the DV-T0 skip band and T1c's blocks present in the ledger |
| **STATS-DISJOINT** | stats base 107,400, min gap ≥ 200 to the published ledger |
| ⭐ **G-CLEAN-INVOCATION** | any `DVT2C0_N` / `_CAP` / `_SKIP_FP` routes the run onto the **guard block**, turns this gate RED and exits 1 — the census block stays VIRGIN; a preflight can never write a canonical repo path (guarded at parse time **and** at write time, on the RESOLVED absolute path) |
| **G-N-DERIVED** | the N run **is** the frozen §NRULE output |
| ⭐⭐ **G-ACCOUNTING** | DV-C0's identities (tick partition, ordered spans, one-to-one attribution at every window, monotone in the window, every turnover in one loss zone) **+ this stage's**: every delivery in exactly one chain and one aim zone; {punished · lost-unpunished · survived} partition the deliveries; punished ⊆ lost; punished monotone in the window while **lost is invariant** in it; **+ the family boundary**: zero led strikes, zero team mismatches, `o1PassWindup` shut in every match |
| ⭐ **G-VALUES-UNREACHABLE** | none of the published values appears in `src/**`, searched in BOTH the raw 5-dp form **and the formatted percentage form the tables print**; degenerate (zero) cells excluded by a declared floor, a non-vacuity floor on the search-set size, and a control needle that must be found |
| ⭐⭐ **G-MUTANTS** | **#251.3 / #252.3 discharged at source**: every conjunct of every composite gate above carries its OWN mutant, and each mutant must flip exactly that conjunct to false. A dead conjunct inside a PASS gate is the defect this gate exists to catch |

**No gate reads a rate.** The #246 shape flags are mechanical CI readings, not gates: an inversion
turns nothing red.

## §NON-CLAIMS

1. **NOTHING SHIPS.** Zero `src/**` bytes; the production fingerprint re-derived unchanged; no flag
   and no gene written anywhere. **The learning seam does not exist yet** — the account book, the
   write path and the learning flag are T2-T0's, and this stage adds no byte toward them.
2. ⭐⭐ **THE TABLE IS NOT WIRED INTO ANY PLAYER (#247).** It is instrument-side truth: it
   yardsticks T2-T1's learned books and sizes T2-T1's run length. No chooser reads it. Wrong books
   remain legal and are STYLE.
3. **NO PASS/FAIL ON ANY MEASURED RATE.** The gates are the X-family, the two inheritance receipts,
   the trace gates, the accounting identities and the mutant-liveness proof.
4. **THE RATE IS A CONDITIONAL RATE, NOT A CAUSAL EFFECT.** Deliveries are not randomly assigned to
   aim zones: a team aiming into its own third is in a different state from one aiming into the
   final third, and that state is part of the price.
5. **THE ATTRIBUTION RULE IS A RULE, NOT A TRUTH** (DV-C0's non-claim, inherited). It is frozen ex
   ante, the co-occurrence cross-cut is published beside every cell, and the table is republished at
   four windows.
6. ⭐ **THE LABEL IS CHAIN-LEVEL, SO SEVERAL DELIVERIES CAN SHARE ONE PUNISHMENT.** That is
   M-DV2.1's own wording and it is what an account book will actually see; it means the
   punished-**delivery** count is not the punished-**turnover** count, and both are published.
7. **THE WINDOW LADDER AND THE RUN-LENGTH K GRID ARE REPORTING GRIDS.** No window is privileged
   beyond the pre-registered primary; T2-T1 freezes its own K.
8. **THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203).** T2-T0 / T2-T1 are the
   contract's.

---

## §RESULT

**200 seeds × 1 arm (bare production), block 12,436,100–12,436,299, 16/16 gates PASS**, `resultSha256` `c5baa695…dcb8`. Every number below is printed by `scripts/analysis/dv-t2-c0-census-result.ts` from the committed artifact; none is typed (#229.2).

### The run

```text
world            bare production — the SHIPPED game, `new Match({seed, teamA, teamB})`.
matches          200   (241.79 sim-seconds each)
deliveries       15,861   (79.3050 per match, ground passes STRUCK)
turnovers        6,995   (34.9750 per match)
conceded goals   412   (2.0600 per match)
primary window   10 s   (DV-C0's own, itself the #218 census's co-occurrence window)
estimator        cluster bootstrap by match seed, 2,000 resamples, stats base 107,400
```

### ⭐⭐ THE PASS-LEVEL TABLE — the M-DV2.1 label by AIM zone (PRIMARY WINDOW)

A full accounting: every delivery is in exactly one of the three outcome classes. **P(punished)** is the marginal rate — the account book's own quantity (M-DV2.2) — with the paired cluster-bootstrap 95 % CI at the pre-registered **10 s** window.

| aim zone | deliveries | lost | survived | punished | **P(punished)** | CI 95 % (pp) | P(punished \| lost) | CI 95 % (pp) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| ⭐ **own third** | 4,295 | 3,275 | 1,020 | 157 | **3.655 %** | [3.003, 4.404] | 4.794 % | [3.960, 5.752] |
| middle third | 9,500 | 7,066 | 2,434 | 287 | **3.021 %** | [2.506, 3.570] | 4.062 % | [3.353, 4.805] |
| final third | 2,066 | 1,435 | 631 | 40 | **1.936 %** | [1.152, 2.783] | 2.787 % | [1.662, 3.986] |
| **ALL ZONES** | 15,861 | 11,776 | 4,085 | 484 | **3.052 %** | [2.574, 3.565] | 4.110 % | [3.477, 4.805] |

The complement rows, as shares of the deliveries into each zone (they sum to 1 with `P(punished)` by construction — G-ACCOUNTING checks the partition):

| aim zone | punished | lost-but-unpunished | survived | co-occurrence reading |
|---|---:|---:|---:|---:|
| ⭐ **own third** | 3.655 % | 72.596 % | 23.749 % | 4.447 % |
| middle third | 3.021 % | 71.358 % | 25.621 % | 3.853 % |
| final third | 1.936 % | 67.522 % | 30.542 % | 3.049 % |
| **ALL ZONES** | 3.052 % | 71.193 % | 25.755 % | 3.909 % |

The **co-occurrence** column is the #218 census's many-to-one reading (*was there ANY conceded goal within the window of the chain's loss*), published beside every cell as the declared cross-cut; the punished column is the frozen one-to-one nearest-in-window attribution.

### ⭐ THE #246 REALITY-SHAPE CHECK — pre-registered, evaluated with CIs

On the **marginal** rate (the primary predicate). An inversion would be published and routed, never corrected into the table.

| window | own − middle (pp) | CI 95 % | verdict | middle − final (pp) | CI 95 % | verdict | ⭐ GRADIENT |
|---|---:|---:|---|---:|---:|---|---|
| 5 s | 0.882 | [0.424, 1.374] | ✅ RESOLVED-CONFIRM | 1.110 | [0.688, 1.516] | ✅ RESOLVED-CONFIRM | ✅ RESOLVED-CONFIRM |
| 10 s **(PRIMARY)** | 0.634 | [0.044, 1.225] | ✅ RESOLVED-CONFIRM | 1.085 | [0.197, 1.944] | ✅ RESOLVED-CONFIRM | ✅ RESOLVED-CONFIRM |
| 15 s | 0.844 | [0.213, 1.523] | ✅ RESOLVED-CONFIRM | 0.656 | [-0.493, 1.725] | — UNRESOLVED | — UNRESOLVED |
| 20 s | 0.973 | [0.297, 1.664] | ✅ RESOLVED-CONFIRM | 0.538 | [-0.687, 1.662] | — UNRESOLVED | — UNRESOLVED |

The same three predicates on the **conditional-on-lost** rate (the contract §3 wording's cross-cut, published beside the primary and gating nothing):

| window | own − middle (pp) | verdict | middle − final (pp) | verdict | GRADIENT |
|---|---:|---|---:|---|---|
| 5 s | 1.110 | ✅ RESOLVED-CONFIRM | 1.464 | ✅ RESOLVED-CONFIRM | ✅ RESOLVED-CONFIRM |
| 10 s **(PRIMARY)** | 0.732 | — UNRESOLVED | 1.275 | — UNRESOLVED | — UNRESOLVED |
| 15 s | 0.993 | ✅ RESOLVED-CONFIRM | 0.614 | — UNRESOLVED | — UNRESOLVED |
| 20 s | 1.154 | ✅ RESOLVED-CONFIRM | 0.423 | — UNRESOLVED | — UNRESOLVED |

Routing recorded in the artifact at the primary window: *no inversion at this window; the routing clause is dormant.*

### THE WINDOW LADDER — the table's window-dependence, made visible

| window | own | middle | final | all zones |
|---|---:|---:|---:|---:|
| 5 s | 2.282 % | 1.400 % | 0.290 % | 1.494 % |
| 10 s **(PRIMARY)** | 3.655 % | 3.021 % | 1.936 % | 3.052 % |
| 15 s | 4.307 % | 3.463 % | 2.807 % | 3.606 % |
| 20 s | 4.657 % | 3.684 % | 3.146 % | 3.877 % |

Deliveries and losses do not move with the window — the denominators are the same population at every row (G-ACCOUNTING checks that invariance explicitly); only the punished numerator grows.

### ⭐ THE EVENT-RATE MOMENTS — what T2-T1 sizes its run length from

Deliveries per zone **per team per match** (the grain T2-T1's arithmetic needs), over 400 team-match observations per zone.

| aim zone | mean | SD | CV | min | p10 | median | p90 | max | zero team-matches | punished/team/match |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| ⭐ **own third** | 10.7375 | 5.9213 | 0.5515 | 0 | 4 | 10 | 19 | 32 | 0.250 % | 0.3925 |
| middle third | 23.7500 | 10.2359 | 0.4310 | 1 | 11 | 23 | 37 | 61 | 0.000 % | 0.7175 |
| final third | 5.1650 | 3.7178 | 0.7198 | 0 | 1 | 4 | 10 | 19 | 6.000 % | 0.1000 |

All zones together: **39.6525** deliveries per team per match (SD 14.9950, median 39, range 3–91).

⭐ **THE RUN-LENGTH ARITHMETIC** — matches a single team must play for its book to hold K deliveries in each zone, at the measured mean rate. ⚠ A REPORTING GRID: T2-T1 freezes its own K ex ante from these moments, and the dispersion column above is why a mean alone is not enough (the final third's CV is the largest and it carries zero-delivery team-matches).

| aim zone | deliveries/team/match | matches for K = 10 | matches for K = 20 | matches for K = 30 | matches for K = 50 | matches for K = 100 |
|---|---:|---:|---:|---:|---:|---:|
| ⭐ **own third** | 10.7375 | 1 | 2 | 3 | 5 | 10 |
| middle third | 23.7500 | 1 | 1 | 2 | 3 | 5 |
| final third | 5.1650 | 2 | 4 | 6 | 10 | 20 |

### ⭐ THE CONVERGENCE YARDSTICK — the schema T2-T1 may not re-cut

```json
{
  "schema": "dv-t2c0.pass-truth-table.v1",
  "frame": "the PASSING team's own attacking frame — \"where was this ball aimed\".",
  "index": "AIM zone via the shipped `receptionZoneIndex` — the pricer's own read (M-DV2.1).",
  "windowS": 10,
  "zones": {
    "own": {
      "punishRate": 0.03655,
      "ci95": [
        0.03003,
        0.04404
      ],
      "deliveries": 4295,
      "punished": 157,
      "lost": 3275,
      "punishGivenLost": 0.04794,
      "punishGivenLostCi95": [
        0.0396,
        0.05752
      ]
    },
    "middle": {
      "punishRate": 0.03021,
      "ci95": [
        0.02506,
        0.0357
      ],
      "deliveries": 9500,
      "punished": 287,
      "lost": 7066,
      "punishGivenLost": 0.04062,
      "punishGivenLostCi95": [
        0.03353,
        0.04805
      ]
    },
    "final": {
      "punishRate": 0.01936,
      "ci95": [
        0.01152,
        0.02783
      ],
      "deliveries": 2066,
      "punished": 40,
      "lost": 1435,
      "punishGivenLost": 0.02787,
      "punishGivenLostCi95": [
        0.01662,
        0.03986
      ]
    }
  },
  "relative": {
    "own": 1.27322,
    "middle": 1.05237,
    "final": 0.67441
  },
  "ordering": [
    "own",
    "middle",
    "final"
  ],
  "baselinePunishRateAllZones": 0.03052
}
```

Ordering: **own > middle > final**. The `relative` vector is the scale-free form — a book that has the right SHAPE but the wrong magnitudes scores well on it and badly on `zones`, which is exactly the distinction #247 asks T2-T1 to measure.

### Gate table

| gate | result | evidence |
|---|---|---|
| `xDet` | **PASS** | digest `9320fdfb1357…` twice |
| `xFpProd` | **PASS** | observed `57b0bdab3891…` = baseline, re-derived in-process |
| `xSrcUntouched` | **PASS** | `git diff --stat -- src` empty |
| `gReproGgc` | **PASS** | 62 integer fields in 9 families, **0 mismatches**, block 12421000..12421011 (PROD) |
| `gReproDvc0` | **PASS** | 55 integer fields in 5 families, **0 mismatches**, block 12429000..12429011 — DV-C0's own smoke rows |
| `gWindowTrace` | **PASS** | primary 10 s = DV-C0's committed primary · member of the #218 family `[5,10]` · ladder `[5,10,15,20]` = DV-C0's, all multiples of 5 |
| `gZoneTrace` | **PASS** | ±10.5000 m = `HALF_L / 3` = the seat's `DV_THIRD_BOUNDARY_LOCAL_X` = DV-C0's committed 10.5000 · 2,001 swept samples, 0 disagreements |
| `gWrapperInert` | **PASS** | seed 12,436,020: wrapped digest `99bd9ffd01df…` = bare · 113 deliveries captured wrapped vs 0 bare |
| `gWorld` | **PASS** | 6 genome views gene-free · no MT flag · no stage flag (incl. `dvDeliveryValue`, `o1PassWindup`) · eye null · readback 0 |
| `gSeedDisjoint` | **PASS** | 8 blocks machine-checked (2 re-walks, predicates inverted); block 12436100..12436299; skip band ledgered true; T1c ledgered true |
| `gStatsDisjoint` | **PASS** | base 107,400, minGap 400 ≥ 200 |
| `gCleanInvocation` | **PASS** | envN null · capped false · skipFp false · routedToGuardBlock false |
| `gNDerived` | **PASS** | ran N 200 = derived N\* 200 |
| `gAccounting` | **PASS** | ticks true · one-to-one true · delivery assignment true · zone partition true · outcome partition true · punished ⊆ lost true · lost invariant in window true · no led strikes true · windup shut true |
| `gValuesUnreachable` | **PASS** | 139 src files scanned · 14 needles (raw 5-dp + formatted %) · 0 hits · control needle found true |
| `gMutants` | **PASS** | **42 conjuncts, 0 dead** — every conjunct of every composite gate carries its own mutant |

### THE ACCOUNTING IDENTITIES (gate input — ticks, chains, deliveries and goals, not football)

```text
ticks         3,007,618 = segment 2,591,663 + loose 0 + deadBall 415,955   ⇒ ok
no overlap    assignedTicksSum 2,591,663 = segmentTicks 2,591,663   · spanOrderViolations 0
turnovers     walked 6,995 = ledgered 6,995
goals         conceded 412 = score deltas 412 · doubleAttributed 0
  @ 5 s       attributed   164 + unattributed   248 = 412   · Σ loss cells 164
  @10 s       attributed   286 + unattributed   126 = 412   · Σ loss cells 286
  @15 s       attributed   344 + unattributed    68 = 412   · Σ loss cells 344
  @20 s       attributed   370 + unattributed    42 = 412   · Σ loss cells 370
deliveries    walked 15,861 = assigned 15,861 + unassigned 0 = Σ over the three aim zones 15,861
outcomes      punished 484 + lost-unpunished 11,292 + survived 4,085 = 15,861   ⇒ a PARTITION
survived by   deadBall 3,660 · goal FOR 425 · full time 0
punished ⊆ lost   punished 484 ≤ lost 11,776 (primary window)
  @ 5 s       punished deliveries   237 · lost 11,776 (INVARIANT in the window)
  @10 s       punished deliveries   484 · lost 11,776 (INVARIANT in the window)
  @15 s       punished deliveries   572 · lost 11,776 (INVARIANT in the window)
  @20 s       punished deliveries   615 · lost 11,776 (INVARIANT in the window)
family        led strikes 0 · team mismatches 0 · matches with the windup door open 0 · suppressed performPass calls 0
```

### THE N RULE AS EXECUTED (in-probe, from the committed smoke)

```text
rule            N* = min( ceil(60 / rarestZoneEventsPerMatch) ↑25, floor(0.5 h / (ms/match × 1 arm × 2 X-DET)), 800 ) — DV-C0 §NRULE's form, inherited, with THIS census's own numerator: the rarest-zone event is a PUNISHED DELIVERY in the RAREST of the three AIM zones at the PRIMARY window, i.e. the scarcest numerator the published table contains. Frozen in the stage doc §NRULE BEFORE the smoke ran.
smoke artifact  docs/world-model/data/dv-t2-c0-pass-level-census-smoke.json  (sha256 b0a6b478e0b73ad8…)
rarest-zone events/match 0.33333  ⇒ raw 181 → step 200   · precision term unbounded: false
wall term 6,674 · cap 800   ⇒ N* 200  (precision binds; projected 0.015 h)
as executed     N 200 · ms/match 82.5 · rarest-zone events/match at battery 0.20000
```

The rarest AIM zone at the primary window carries **40** punished deliveries against the rule's target of 60 — **a shortfall of 20**: the smoke's rate estimate (0.33333/match) ran ahead of the battery's realised 0.20000/match, so the realised relative SE on that cell is ≈ 15.8 % rather than the rule's ≈ 12.9 %. It is recorded, NOT repaired: re-sizing N after seeing the table is exactly what the pre-registration forbids, and `gNDerived` proves the N that ran is the frozen rule's own output.

### Deviations recorded

1. A TOUCH / OWNERSHIP EPISODE IS NOT A FOOT-BALL CONTACT (inherited from the #170 tempo census through #214/DV-C0): Match exposes ball.owner, not a contact event. Everything here is derived from observable state, which is what X-SRC-UNTOUCHED requires.
2. ⭐ THE DELIVERY IS OBSERVED THROUGH AN INSTANCE WRAPPER ON `performPass` (the PTP-T0/DV-T1 idiom). It is a pass-through, and G-WRAPPER-INERT proves inertness on a twin walk of one declared seed rather than asserting it. A `performPass` call the ENGINE's own guard rejects is counted as a suppressed call and is NOT a delivery.
3. ⭐ THE AIM IS `mate.pos` AT THE STRIKE TICK. In a bare production world that IS the ground pricer's aim for the candidate it struck (the PTP seat is null ⇒ `aim = mate.pos`) and the decision and the strike share a tick (`o1PassWindup` shut). Both facts are GATED. In a world with the led or plane doors open the aim would move, which is why the census is defined on the production world and nowhere else.
4. ⭐⭐ THE LABEL IS CHAIN-LEVEL, SO SEVERAL DELIVERIES CAN SHARE ONE PUNISHMENT. Every delivery struck inside a chain that ended in a punished loss carries the tick — that is M-DV2.1's own wording ("a delivery whose possession outcome is a LOSS followed by a concession"), and it is what the account book will actually see. It means the punished-delivery count is NOT the punished-turnover count, and the two are published side by side.
5. THE RATE IS A CONDITIONAL RATE, NOT A CAUSAL EFFECT. Deliveries are not randomly assigned to aim zones: a team aiming into its own third is in a different state from one aiming into the final third, and that state is part of the price. No counterfactual is claimed.
6. THE ATTRIBUTION RULE IS A RULE, NOT A TRUTH (DV-C0's deviation, inherited). It is frozen ex ante, the CO-OCCURRENCE cross-cut is published beside every cell, and the whole table is republished at four windows so the reader can see how much the choice moves.
7. NO LATERAL BAND. DV-C0 published a third × band secondary table; this census does not, because the belief M-DV2.2 defines is three-cell and a finer yardstick would be one T2-T1's books cannot be scored against.
8. SINGLE ARM, NO PAIRING. This is a CENSUS, not a contrast.
9. NO CHECKPOINT/RESUME: the census is a few minutes; a kill costs the run. Stated, not hidden.

### Registered non-claims (from the artifact)

1. NOTHING SHIPS: zero src/** bytes, the production fingerprint re-derived unchanged, no flag and no gene written anywhere.
2. ⭐⭐ THE TABLE IS NOT WIRED INTO ANY PLAYER (#247). It is instrument-side truth: it yardsticks T2-T1's learned books and it sizes T2-T1's run length. No chooser reads it.
3. NO PASS/FAIL ON ANY MEASURED RATE. The gates are the X-family, the two inheritance receipts, the trace gates, the accounting identities and the mutant-liveness proof. The #246 shape flags are MECHANICAL CI readings, not gates: an inversion turns nothing red and is ROUTED, never corrected.
4. THE WINDOW LADDER IS A REPORTING GRID, and so is the run-length K grid: T2-T1 freezes its own K before it runs, from these moments.
5. THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203). T2-T0 / T2-T1 are the contract's.
6. THE LEARNING SEAM DOES NOT EXIST YET. Nothing here builds the account book, the write path or the learning flag — T2-T0 does, and this stage adds no src byte toward it.

**VERDICT (the probe's own, mechanical):** DV-T2-C0 PASS-LEVEL CENSUS at N=200 × 1 arm (production) — gate-green. THE TABLE IS DESCRIPTIVE TRUTH: the #246 shape flags are mechanical and the commander adjudicates them.

### §CHECKS (#226.1)

```text
$ npx tsc --noEmit
(clean)

$ DVT2C0_MODE=smoke DVT2C0_CAP=2 DVT2C0_SKIP_FP=1 DVT2C0_OUT=/tmp/dvt2c0-guard.json \
    npx tsx scripts/probes/dv-t2-c0-pass-level-census.ts
  seeds 12436050..12436051            ← routed onto the exit-semantics GUARD block
  GATES *** RED ***: … gCleanInvocation FAIL … (every other gate ok)
  exit 1                              ← the census block stays VIRGIN

$ DVT2C0_MODE=smoke DVT2C0_CAP=2 DVT2C0_OUT=docs/world-model/../world-model/data/x.json \
    npx tsx scripts/probes/dv-t2-c0-pass-level-census.ts
  DV-T2-C0 FATAL — a PREFLIGHT invocation may not write a canonical repo path
  exit 2 · no file written (the traversal spelling is RESOLVED, not substring-tested)

$ DVT2C0_MODE=smoke npx tsx scripts/probes/dv-t2-c0-pass-level-census.ts
  GATES GREEN (16) · G-REPRO-GGC 62 fields 0 mismatches · G-REPRO-DVC0 55 fields 0 mismatches
  G-MUTANTS 42 conjuncts · 0 dead
  exit 0 · resultSha256 4b08faa9baa614d5e8697c5106d2b0aa3a61b95635c63a801f3c76e6093f441e
  wall 16.9 s (CONTEXT ONLY) · artifact docs/world-model/data/dv-t2-c0-pass-level-census-smoke.json

$ DVT2C0_MODE=full npx tsx scripts/probes/dv-t2-c0-pass-level-census.ts
  GATES GREEN (16) · N* 200 (precision binds) · block 12,436,100–12,436,299
  exit 0 · resultSha256 c5baa695a8b95a03fc149cf1f7637700ea3f9a7d5f99201c792791cf3623dcb8
  wall 45.7 s (CONTEXT ONLY) · artifact docs/world-model/data/dv-t2-c0-pass-level-census.json

$ npx tsx scripts/analysis/dv-t2-c0-census-result.ts \
    docs/world-model/data/dv-t2-c0-pass-level-census.json
  → the whole §RESULT section above, on stdout
```

⭐ Six commands were run in this round and all six are transcribed above; the `resultSha256` in the
§RESULT header is the one the generator read out of the committed artifact, so the two are the same
string or this doc would not build. `npm test` is **not** re-run and is named rather than implied:
this round adds **one probe, one generator, two artifacts and one doc**, touches **no** `tests/**`
file and **no** `src/**` byte (X-SRC-UNTOUCHED is a HARD gate and PASSES on the run that wrote the
artifact), so the suite's state is the one banked at the previous commit.

### Facts that are *not* deviations, recorded anyway

1. ⚠ **N\* = 200, THE FROZEN RULE PRODUCED IT, AND THE RAREST CELL CAME IN UNDER TARGET.** The
   smoke's rarest zone carried **4** punished deliveries in 12 matches (0.33333/match) ⇒
   `ceil(60 / 0.33333) = 181 → ↑25 = 200`; the wall term (6,674) and the 800 cap did not bind. At
   battery grain the same zone (final) carries **40** against the rule's target of **60** — the
   smoke over-estimated the rate (battery 0.20000/match), so the realised relative SE on that cell
   is ≈ 15.8 % rather than ≈ 12.9 %. **It is recorded, not repaired**: re-sizing after seeing the
   table is precisely what the pre-registration forbids, and `gNDerived` proves the N that ran is
   the rule's own output. What it costs is printed above; whether it is worth a re-power is the
   commander's, not the probe's.
2. **THE SMOKE'S TABLE AND THE BATTERY'S TABLE DISAGREE, AND THAT IS THE DESIGN.** At 12 seeds the
   ordering read `own > final > middle` and the GRADIENT was UNRESOLVED at every window (only the
   own−middle limb resolved anywhere, at 10 s); at 200 it is `own > middle > final` with both limbs
   resolved at the primary window. The smoke adjudicated nothing and fed only N (its two sizing
   numbers).
3. **THE PUNISHED-DELIVERY COUNT IS NOT THE PUNISHED-TURNOVER COUNT** (deviation 4's arithmetic
   made visible): 286 goals are attributed to turnovers at the primary window, and 484 deliveries
   carry the punishment tick, because a chain that ends in a punished loss punishes **every**
   delivery struck inside it. That is what an account book sees, and it is why the marginal rate —
   not the per-turnover hazard — is the quantity a book converges to.
4. **THE MARGINAL AND THE CONDITIONAL DO NOT AGREE ON RESOLUTION AT THE PRIMARY WINDOW.** The
   marginal (primary) resolves both limbs; the conditional-on-lost form is UNRESOLVED on both at
   10 s while resolving own−middle at 5/15/20 s. Both are printed. The primary predicate was frozen
   on the marginal before the run because the marginal is the book's own quantity (M-DV2.2), not
   because of anything seen here.
5. **THE LOSS RATE ITSELF IS NEARLY FLAT ACROSS AIM ZONES** — 76.251 % / 74.379 % / 69.458 % of
   deliveries into own / middle / final end in a lost chain (all zones 74.245 %), a spread of under
   7 pp against the punish rate's near-2× spread: almost all of the shape in `P(punished)` comes
   from what the loss COSTS, not from how often it happens. Descriptive, and the commander's to
   read. (These four numbers are the `lossRate` column of the committed artifact's primary-window
   rows; re-derive with `node -e` on `result.census.table[1].byZone[*].lossRate`.)
6. **THE WALL IS CONTEXT ONLY (#128).** 45.7 s for 200 × 2 passes plus the two re-walk blocks, the
   fingerprint, the inertness twin and the gates; it enters no rate and no gate.

### Disposition

The census is run, twice-deterministic and **gate-green on 16/16 at 200 seeds**, with
**G-REPRO-DVC0** reproducing DV-C0's committed smoke rows on **55 integer fields, 0 mismatches**
and **G-REPRO-GGC** reproducing the goal-genealogy census's on **62 fields, 0 mismatches** — the
label's loss and concession semantics proved to be *theirs* rather than asserted — and
**G-MUTANTS** proving all **42** gate conjuncts live (#251.3 / #252.3 discharged at source). **The
AIM-INDEXED TRUTH TABLE is banked**, the #246 shape check reads `own > middle > final` with the
gradient RESOLVED-CONFIRM at the primary window (the 街机偏离 routing clause stays dormant), the
`dv-t2c0.pass-truth-table.v1` yardstick is frozen before any book exists, and the **event-rate
moments** T2-T1 needs for its run-length arithmetic are published with their dispersion. What the
table *means* — and whether the rarest cell's sizing shortfall (fact 1) is worth a re-power before
T2-T1 — is the commander's (#203).
