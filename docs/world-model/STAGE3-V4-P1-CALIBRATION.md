# Stage III V4-P1 — The Calibration (surrogate → goal-value; CLASS H concede-face)

Status: **PRE-REGISTERED 2026-07-31, FROZEN BEFORE ANY RUN. OBSERVATIONAL,
no forcing; zero `src/**`.** This document freezes — **before a single
calibration match is simulated and before any `docs/world-model/data/*.json`
is opened** — the calibration's question, the frozen hazard/lift estimator,
the matched-baseline construction, the calibration window `W_cal` (pinned
from V4-P0's published curves per I6), the monotone-link admission gate
(I3, HARD), the fresh observational corpus + its new disjoint seed family +
the sizing arithmetic (and the pre-registered sizing smoke), and every gate.
**This freeze RETURNS TO THE COMMANDER for review; the probe
(`scripts/probes/stage3-v4-p1-calibration.ts`) is a FUTURE authorized step**
(the standing pattern: freeze → review → build → run; §0.0 / #86.2
sequence). **V4-P1 cannot authorize V4-P2** — only the commander's review of
this freeze (and later of the P1 result) can; if ALL concede-face
surrogates fail calibration, CLASS H is uncalibratable this way and the
stage STOPS at the commander (contract §6).

Authority: ruling **#99.5** (V4-P0 CLOSES; V4-P1 OPENS — "measure the
concede-face surrogate → goal-value links (opponent deep entry / box entry /
shot-against → concession hazard) on the enriched world — observational, no
forcing; windows pinned from P0's published time-to-cost curves (I6); a
surrogate enters ONLY with a resolved monotone link (I3), failures published
and dropped") · **#99.4** (the measured v4 remedy scope: CLASS H (rest,
offside) → V4-P1 calibration + V4-P2 occupancy census; CLASS S (delivery) →
the wide-state context bit at the consumer, V4-P3; CLASS J (restart + the
exposure surface) → the in-support law, V4-P3 — **delivery (S) and restart
(J) need NO calibration here**) · the v4 design contract
[`STAGE3-V4-LONG-HORIZON-PRICE.md`](STAGE3-V4-LONG-HORIZON-PRICE.md) §4
"V4-P1" bullet, under invariants **I1–I11**, esp. **I3** (NO FREE
HAND-WEIGHTS: every long-horizon term enters the merged scalar ONLY through
this measured calibration; a surrogate that fails calibration DOES NOT
ENTER — stop rule, not a fudge factor), **I6** (census world = the enriched
#67.3 bundle; runs state HEAD + armed flags; smoke/census seeds disjoint;
windows pinned ex ante FROM V4-P0's published curves), **I7** (the P3a
corpus is labelled mining fuel; everything gate-bearing runs fresh — P1 is
fresh), **I11** (dispersion/extreme statistics resolve by permutation only;
P1 has none — its lift is a mean/proportion difference → match-cluster
bootstrap) · the V4-P0 pre-registration + §RESULT
[`STAGE3-V4-P0-AUTOPSY-MAP.md`](STAGE3-V4-P0-AUTOPSY-MAP.md) and the V4-P0b
re-classification + §RESULT
[`STAGE3-V4-P0B-DECISION-ANCHOR.md`](STAGE3-V4-P0B-DECISION-ANCHOR.md) (the
published time-to-cost curves that pin `W_cal`; the banked base rates that
fuel sizing; the concede-surrogate + statistics machinery this probe reuses)
· #88/#89 (the P3a verdict; the concede-face limbs) · #44.3/I7 (labelled
data) · #46.2 (seed disjointness) · #48.4 (windows/bins pinned ex ante) ·
#49.3 (per-record receipts) · #26.5 (state HEAD + armed flags; consumer
world = census world) · #67.3 (the enriched full bundle) · #20 (CI /
cluster = match seed) · #24/#44.5/#65 (sizing before floors; publish-not-
pool) · #38.1 (full sign space) · Road B (nothing ships).

Parents reused unamended: the V4-P0/P0b probe machinery
[`scripts/probes/stage3-v4-p0b-decision-anchor.ts`] — the enriched-world
match constructor, the `inSupport`/`contextOf` predicates, the
concede-cost + score-value channels, the match-cluster bootstrap engine
(`supportOutCI`, `contrastCI`), receipts, and the output/X-DET conventions;
the P3a stage doc [`STAGE3-V3-P3A-DEPLOYMENT.md`](STAGE3-V3-P3A-DEPLOYMENT.md)
§RESULT (the enriched-R0 goals/match scale used for sizing).

**World / HEAD / flags (#26.5 / #67.3).** Every calibration match runs the
**ENRICHED** world — the #67.3 full bundle, copied verbatim from the P3a
stage doc §3.2 and the P0/P0b probes:
`edsPerceivedDefence + edsPerceivedChoice + edsValueAxis` ON, `c5Hold`,
`c6Carry`, `c7Windup` ON; `c5TouchFork` **off** — with **`stationEye` NULL
(eye null)**. This is exactly the enriched-R0, eye-null census world the
V4-P0/P0b fresh reference measured its base rates on (the world the future
consumer will read a table on, #26.5/#68.2 two-pin logic) — **not** the
shipped flags-off production world. **P1 forces no body** (no fork-and-hold;
that is V4-P2): it observes the world's own play. The run states its HEAD
and armed flags. In production every EDS flag defaults OFF and
`c6Carry`/`c7Windup` default `false` — Road B intact; the enriched world is
probe-only staging. **Zero `src/**` changes; the production fingerprint
`57b0bdab…c673` stays unchanged throughout** (gate X-SRC-ZERO, §4).

---

## 1. What V4-P1 is (and is not)

V4-P0 (event-anchored) and V4-P0b (decision-anchored) closed the autopsy:
under the corrected instruments the two **concede-face** discipline limbs
route to **CLASS H** — rest-defence slot = H (abandonment decisions made in
support; concede cost late: beyondFraction 0.569 @10 s / 0.733 @6 s, perm
p = 0), offsides = H (bothFired, H > S; 0.910 of the concede-face cost
beyond 10 s, perm p = 0). CLASS H's remedy is **the occupancy census**
(V4-P2), which reads outcomes through **calibrated surrogates at long
windows**. Those surrogates must be priced in goal-value units FIRST, or
the census produces uninterpretable surrogate counts. **V4-P1 is that
pricing — and nothing more.**

V4-P1 measures, **observationally on the enriched eye-null census world**,
the **goal-value of one concede-face surrogate event**: for each surrogate
S ∈ {**opponent deep entry into own third**, **opponent box entry**,
**shot-against**}, the **excess concession probability attributable to the
event within a pinned horizon `W_cal`** — the raw post-event concession
hazard MINUS a matched baseline hazard, in **concessions per event**
(goal-value units). It is the unit converter the contract's I3 demands:
"the calibration's job is to make the quantities the genes weigh HONEST."

It is **read-only observation + one fresh census + a frozen estimator**. It
forces no body, prices no station, builds no consumer, ships nothing
(Road B). It hands exactly one thing forward, and can stop the stage:

* **(→ V4-P2) THE CALIBRATION TABLE**: per surviving surrogate, the lift
  (goal-value/event) with a match-cluster CI, admitted through the
  monotone-link gate (I3). V4-P2's occupancy census converts "holding a
  cell changes the surrogate rate by Δ" into goal-value via exactly this
  table, using ONE designated PRIMARY surrogate per cost channel.
* **(STOP)** If ALL three surrogates fail the gate (none resolved, or none
  survive the monotone check), the concede-face channel is UNCALIBRATABLE
  this way ⇒ CLASS H stops at the commander (contract §6 fallback is a
  FUTURE contract, not this one).

**What P1 explicitly does NOT do** (#99.4): it does not calibrate the
delivery limb (CLASS S — its remedy is a wide-state context bit at the
consumer, V4-P3, needing no surrogate→goal calibration) and it does not
calibrate the restart limb (CLASS J — its remedy is the in-support
consumption law, V4-P3). P1 is the **CLASS H concede-face** calibration
only. The score-face / delivery-value chain is out of scope here.

---

## 2. The frozen quantities (no re-cutting after sight — §6)

Per #80.2/I11: P1 carries **no dispersion/extreme statistic** — the lift is
a **proportion (hazard) difference**, resolved by **match-cluster bootstrap
CI** (#20), cluster unit = the match seed. `B = 2000` resamples. **New
frozen seeds, disjoint from every prior family**: `BOOTSTRAP_SEED = 98003`
(the cluster bootstrap), `COMPARISON_SEED = 98203` (the matched
comparison-tick draws). (Prior seeds avoided: 97003/97103 (V4-P0/P0b),
93003/92110/91110/91100/90730/79002/62003/50041.) No permutation seed is
used (no dispersion statistic); `98103` is reserved-unused.

### 2.1 (a) THE QUESTION — the estimand, per surrogate

For each concede-face surrogate event type S and defending side `d`:

> **The goal-value of one S-event** = the EXCESS probability that side `d`
> CONCEDES a goal within the horizon `W_cal` after the event, over and above
> a matched same-match same-side background hazard — measured
> **OBSERVATIONALLY (no forcing)** on the enriched eye-null census world.

The three surrogates, in **increasing severity (proximity to a conceded
goal)** — the frozen nested ordering `deep entry ≺ box entry ≺ shot-against`:

| S (severity ↑) | detector (defending side `d`, PLAYING; on the null→true entry transition unless noted) | reuses |
| --- | --- | --- |
| **deep entry** | opponent owns AND ball in `d`'s own third: `teams[d].localX(ball.x) < -REST_THIRD` (`REST_THIRD = HALF_L/3`) | P0b concede detector `:567–573` verbatim |
| **box entry** | opponent owns AND ball in `d`'s penalty box: `teams[d].localX(ball.x) ≤ -(HALF_L − BOX_DEPTH)` AND `|teams[d].localY(ball.y)| ≤ BOX_WIDTH/2` (mirrors `Match.inPenaltyBox`, `src/sim/Match.ts:2077–2079`; `BOX_DEPTH`/`BOX_WIDTH` from `src/sim/constants.ts:50–51`) | NEW (inline geometry, read-only) |
| **shot-against** | opponent's `stats.shots` increments ⇒ side `d = 1 − shootingSide` | P0b concede channel `:557–566` verbatim |

**The concession outcome (the goal-value unit).** Side `d` CONCEDES at tick
`t` iff the opponent's per-team `stats.goals` increments (`teams[1−d]
.stats.goals`) at `t`. Recorded as a per-side concession-event stream (the
exact pattern of the P0b shots channel, applied to `stats.goals`). One
conceded goal = **one unit of goal-value** — the merged scalar's unit (I3).

### 2.2 (b) THE ESTIMATOR (frozen form) — hazard, matched baseline, lift

For a surrogate S, defending side `d`, event at tick `t_e`:

* **event concession indicator** `y_e = 1` iff side `d` concedes a goal in
  the half-open window `(t_e, t_e + W_cal]`, else `0`. (Half-open, strictly
  after the event; the same lag convention as the P0b resolvers `:701–710`.)
* **raw post-event hazard** `p_e(S) = mean over all S-events of y_e`.

**The matched baseline (⚠ FLAGGED — the load-bearing construction).** To
isolate the EXCESS **attributable** to the event (not the ambient
opponent-attacking risk), each S-event is paired with ONE **comparison
tick** `t_c` drawn from the SAME match, SAME defending side `d`, from the
**eligible background set**:

```text
eligible comparison ticks for (match m, side d, surrogate S):
  m.phase === 'playing'                       (open play)
  && m.ball.owner !== null && owner.side !== d   (OPPONENT in possession — the
                                                  possession-FACE match: a concede
                                                  surrogate is an opponent action, so the
                                                  baseline is a generic opponent-possession
                                                  moment, NOT a your-possession moment)
  && t_c is NOT inside any (t_e', t_e' + W_cal] window of an S-event of THIS type
                                                  (uncontaminated background)
```

The draw is uniform over the eligible set with a **deterministic** per-event
seed `= hash(COMPARISON_SEED, matchSeed, d, S, eventOrdinal)`, so the whole
estimator is X-DET reproducible. If a match/side has an S-event but NO
eligible background tick, that event is dropped from the baseline pairing
and the drop count is PUBLISHED (mirrors the "no anchor ⇒ dropped,
published" convention).

* **baseline hazard** `p_b(S) = mean over the matched comparison ticks of`
  the same concession-within-`W_cal` indicator.
* **THE LIFT (the goal-value of one S-event)** `L(S) = p_e(S) − p_b(S)`, in
  concessions per event.

**Why match on possession-face but NOT on ball location.** Matching the
baseline to "opponent-owns, playing" removes the trivial
"opponent-attacking vs your-attacking" confound. Deliberately NOT matching
on ball third/box keeps the surrogate from collapsing (a baseline that also
required "opponent in your third" would drive the deep-entry lift to ≈ 0 by
construction) — and it makes the three lifts a strictly nested severity
ladder over a common reference (generic opponent possession), which is what
gives the monotone-link gate (§2.4) real teeth. **A SECONDARY, non-gating
baseline** over ALL playing ticks (any possession) is ALSO published per
surrogate for transparency.

**Aggregation + CI (frozen).** Per match, per surrogate S, the unit is
`{ eSum = Σ y_e, eN = #events, bSum = Σ y_c, bN = #comparison ticks }`; the
pooled lift is `Σ eSum / Σ eN − Σ bSum / Σ bN`; the CI is the match-cluster
bootstrap (resample matches with replacement, `B = 2000`, `BOOTSTRAP_SEED =
98003`) over that pooled statistic — the exact `contrastCI`/`supportOutCI`
cluster engine (`stage3-v4-p0b-decision-anchor.ts:749–775`). No bare means;
under-powered per-surrogate cells are **published, never pooled** (#24/#44.5).

**Published per surrogate (the calibration table rows):** `eN`, `p_e [CI]`,
`p_b [CI]` (primary matched + secondary all-playing), `L(S) [CI]`, the
baseline-drop count, and `RESOLVED(S)` (§2.4).

**⚠ FLAGGED — DOUBLE-COUNTING / NESTING treatment.** The three surrogates
are **nested by severity**: (nearly) every shot-against is preceded within
a possession by a box entry, preceded by a deep entry, and all three resolve
to the SAME conceded goal. Using more than one in the consumer would
**double-count one conceded goal**. The freeze handles this two ways:

1. **Calibrate each surrogate SEPARATELY** (three independent rows above) —
   the lift ladder.
2. **Publish the CONDITIONAL CHAIN** (descriptive, labelled, non-gating):
   the empirical link probabilities `P(box entry within W_link | deep entry)`
   and `P(shot-against within W_link | box entry)` (with `W_link = W_cal`,
   same-possession), and the **incremental lifts** along the chain
   (`L(box) − L(deep)`, `L(shot) − L(box)`) with cluster CIs — so the
   overlap is a measured quantity, not an assumption. Note the nesting is
   by **severity/proximity**, empirically near-nested but not strict set
   containment (a shot may originate outside the box); the conditional chain
   reports the actual overlap.
3. **The V4-P2 consumer uses EXACTLY ONE designated PRIMARY surrogate per
   cost channel.** ⭐ **PROPOSED PRIMARY = opponent box entry** (flagged for
   the commander). Reasoning: box entry sits at the **severity knee** —
   proximate enough to a goal to carry a resolvable, sizeable concession
   lift (unlike the diffuse deep entry, whose per-event hazard is small),
   yet **upstream of the shot**, so it reflects the **preventable
   positioning decision CLASS H prices** rather than the finish (a
   shot-against already bakes in keeper/finishing variance the rest-defender
   does not control), and it is **denser than a shot** (tighter cluster
   CI). **The strong alternatives, flagged**: (i) **deep entry** — maximal
   density/earliness and the most direct unit for the *rest-defence* channel
   (the job IS preventing opponent progression into your third); (ii)
   **shot-against** — closest to the true goal unit but sparse and
   finish-contaminated. The primary designation is the commander's; P1
   publishes all three so the choice is data-informed.

### 2.3 (c) `W_cal` — PINNED FROM V4-P0's PUBLISHED CURVES (I6)

`W_cal` is frozen HERE, ex ante, from V4-P0/P0b's **published** concede-face
time-to-cost evidence (I6: windows pinned from P0's curves; #48.4: pin to an
existing lag-bin edge, never re-cut after sight). The P0 lag grid is
`[0,2)·[2,4)·[4,6)·[6,10)·[10,15)·[15,30)·[30,∞)` s; edges 10, 15, 30 s.

**The evidence (published, concede face).** For the two CLASS H concede-face
limbs the concede-surrogate cost mass sits **overwhelmingly beyond the
certified 10 s concede horizon** (A1): rest-defence slot beyondFraction
**0.569** @10 s (mass 18,113 beyond / 13,712 within), offsides **0.910**
@10 s (19,662 / 1,942); every permutation p = 0 (P0b §RESULT, CLASS H
table). The finer per-bin concede-surrogate hazard concentrates in the
**[10,15) ∪ [15,30)** bins with a diffuse [30,∞) tail (P0b §RESULT
time-to-cost curves: rest [10,15) / [15,30) = −1.29 / −1.0625; restart
−0.566 / −2.0575). The concede chain thus resolves on a **~10–30 s
horizon**, beyond the certified 10 s — the hedge/horizon signature #88.3
named.

**The pin (frozen).**

```text
PRIMARY   W_cal = 30 s   (= the [10,15)∪[15,30) concentration's outer edge;
                          a P0 lag-bin edge; captures the resolvable beyond-10 s
                          concede mass while excluding the open-ended, possession-
                          turned-over [30,∞) tail that a per-event attribution
                          cannot cleanly assign)
SENSITIVITY  W_cal ∈ {15 s, 45 s}   (15 s = the near-tail bin edge; 45 s = a
                          longer-tail probe past the [30,∞) knee) — PUBLISHED as
                          labelled data, NON-GATING; the lift and the monotone
                          gate are read at the PRIMARY 30 s window ONLY.
```

**Honesty note (flagged).** P0's curves measure the *limb → surrogate* lag
(slot abandonment → deep entry / shot-against); `W_cal` governs the
*surrogate → concession* residual, a **shorter** chain (a box entry is
seconds-to-tens-of-seconds from a goal). 30 s is therefore a **generous**
window that cannot truncate the concession the surrogate presages; the
**matched baseline (§2.2) absorbs the background concession rate over any
30 s window**, so a long `W_cal` does not inflate the lift — the excess is
what the surrogate ADDS over background. The sensitivity readings expose the
window's influence. This is the only ex-ante-published curve family (I6
admits no other), and V4-P2's `W_hold`/`W_long` are pinned from the SAME
curves at P2 pre-registration (contract I6) — P1 and P2 draw the same well.

### 2.4 (d) THE MONOTONE-LINK GATE (I3, HARD) — admission to the table

A surrogate ENTERS the calibration table (is usable by V4-P2) only through
this gate. Everything is read at the **PRIMARY `W_cal` = 30 s**.

```text
For S ∈ {deep entry ≺ box entry ≺ shot-against} (severity order):
  RESOLVED(S) := L(S)'s match-cluster bootstrap CI lower bound > 0
                 (a positive excess concession is attributable to the event)
MONOTONE requirement (frozen): the point lifts are NON-DECREASING in severity,
  L(deep) ≤ L(box) ≤ L(shot)   (a milder surrogate cannot out-price a severer one)

ADMISSION (deterministic, greedy over the severity chain deep→box→shot;
  lastAccepted := −∞):
  for S in [deep, box, shot]:
    if not RESOLVED(S):                DROP S (published: "unresolved lift")
    elif point L(S) >= lastAccepted:   ADMIT S (ENTERS the table);
                                       lastAccepted := point L(S)
    else:                              DROP S (published: "non-monotone —
                                       lift below a milder admitted surrogate")
```

**HARD, per surrogate.** A dropped surrogate is **PUBLISHED with its
numbers and the drop reason and is NEVER patched, re-fit, or re-ordered**
(I3: a term whose units cannot be made honest DOES NOT ENTER — a stop rule,
not a fudge factor). The clean design case: all three RESOLVED and
monotone ⇒ all three ADMIT. **If the PROPOSED PRIMARY (box entry) is
dropped**, the concede channel has no primary → V4-P2 cannot price the
concede channel as designed; the commander may redesignate an admitted
alternative as primary (flagged) or the channel is treated as uncalibrated.
**If ALL THREE are dropped** (none resolved, or none survive the monotone
check) ⇒ **CLASS H is UNCALIBRATABLE this way ⇒ STOP at the commander**
(contract §6; the registered fallback — pricing discipline through selection
or an A4 doctrine slice — is a FUTURE contract, not this one).

### 2.5 (e) THE CORPUS — fresh observational matches; NEW disjoint seed family; sizing

**The world.** Enriched #67.3 bundle, `stationEye` NULL (eye null), full
default match (no time knob touched), no forcing. Each match observes both
sides; each side contributes its own concede-face event streams and
concession outcomes (side-split, never summed).

**Seed families (both disjoint from every prior family — #46.2).** The
V4-P0/P0b reserved walk (from P0 §2.4) runs up to the fresh-reference band
**9,700,000 .. 9,700,399**; everything is at or below that. P1 opens two new
bands strictly above it, with a 100 k gap between them:

```text
CENSUS   seeds  9,800,000 + k,  k ∈ 0 .. N−1     (N frozen by the smoke arithmetic below;
                                                   N ≤ N_max = 1,200 ⇒ max seed ≤ 9,801,199)
SMOKE    seeds  9,900,000 + k,  k ∈ 0 .. 39       (40 matches; sizing only)
avoided (P0 §2.4 walk): P0 930k · P1 960k–1.46M · P1R 980k–1.48M · P2-A 2.0M–3.2M ·
  P2-B 3.5M–3.9M · C4/C5 700k–970k · C6 4.0M–6.5M · C7 6.6M–7.1M · C5 re-census 8.29M–8.4M ·
  C5-T2 8.5M/8.51M/8.6M · V2-* 8.70M–9.01M · V3-P0/P1 9.10M/9.11M · V3-P2 9.20M/9.21M ·
  V3-P3a 9.30M–9.600199M · V4-P0/P0b fresh reference 9.700M–9.700399M.
  9,800,000+ and 9,900,000+ lie ABOVE every consumed range; census/smoke mutually disjoint.
```

**SIZING — a sizing smoke IS needed (#44.5/#65), pre-registered here.** The
census is a GATED population (the monotone-link gate needs each surrogate's
lift RESOLVABLE), so a floor must be sized before it freezes. The required
inputs are **NOT published**: the per-match rates of the three concede-face
surrogates as own-side observations (deep/box/shot-against) are un-separated
in P0 (its concede surrogate pooled shots-against ∪ deep entries), the
per-event **concession** (goal-against) hazard over `W_cal` has never been
measured, and neither has its cluster σ. Absolute shots/match is un-published
(only R3 −21.8% relative, P3a §4.2). So realized σ must be obtained before
the floor freezes.

* **The published sizing anchors** (freeze-honest): concession scale =
  enriched-R0 **goals 2.4962/match** (P3a §4.2, `r0Holds`; both sides ⇒
  2.4962 concession events/match, ≈ 1.248/side); turnovers **51.335/match**,
  restart phases **12.6375**, delivery build-ups **12.0825**, near-line
  releases **44.1025** (V4-P0b banked base rates / #96.5(iii)). Deep entries
  are turnover-scale (bounded by 51.335/match); box entries a proximate
  subset; shots-against the sparsest and un-published — the binding sizing
  constraint.

* **THE SIZING SMOKE (pre-registered, labelled, non-gating, disjoint).**
  40 matches on `9,900,000 + k, k ∈ 0..39`, enriched eye-null, X-DET
  double-run, writing OUTSIDE the canonical JSON. It measures, per
  surrogate: realized rate `r_S` (events/match), realized event hazard
  `p̂_e(S)` and matched baseline `p̂_b(S)` at the primary `W_cal = 30 s`, and
  the realized **match-cluster σ** of the per-match lift. These numbers size
  the census; they NEVER gate or verdict (#44.5: sizing before floors;
  smoke seeds disjoint from census — #46.2).

* **THE FROZEN SIZING ARITHMETIC (pins N deterministically from the smoke).**
  For each surrogate the census must resolve its lift, i.e. the 95 %
  match-cluster CI half-width `1.96 · SE(L_S) ≤ MDL_S`, with the
  minimum-detectable-lift target frozen as
  `MDL_S = min( 0.5 · |p̂_lift_smoke(S)| , 0.01 )` concessions/event (resolve
  each lift to ≤ 50 % relative precision OR an absolute 0.01, whichever is
  tighter). Using the smoke's realized per-match lift σ̂_S (clustering already
  baked in), `SE(L_S) ≈ σ̂_S / √N` ⇒ **`N_S = ⌈ (1.96 · σ̂_S / MDL_S)² ⌉`**;
  the census count is **`N = min( max_S N_S , N_max = 1,200 )`**. A surrogate
  whose `N_S > 1,200` is declared **under-powered and PUBLISHED as such,
  never pooled** (#24/#44.5); the census still runs at `N` and its
  under-powered lift reads UNRESOLVED at the gate. N is thus a deterministic
  function of the smoke, bounded and pinned ex ante — the honest #44.5
  pattern.

* **Provisional projection (illustrative, NOT the freeze).** If the smoke
  confirms shot-against ≈ 8/match (`p̂_e` ≈ 0.15, the severest ⇒ largest
  lift), box entry ≈ 18/match (`p̂_e` ≈ 0.06), deep entry ≈ 30/match (`p̂_e`
  ≈ 0.03), then N ≈ 800 comfortably resolves all three (shot ≈ 6,400 events,
  box ≈ 14,400, deep ≈ 24,000). The frozen arithmetic sets the exact N; 800
  is the expected order, capped at 1,200.

---

## 3. Staging (frozen)

| item | value |
| --- | --- |
| **sizing smoke** | 40 matches `9,900,000 + k, k∈0..39`; enriched eye-null; measures `r_S`, `p̂_e/p̂_b`, σ̂_S at `W_cal=30 s`; X-DET; writes OUTSIDE the canonical JSON; **labelled, non-gating** |
| **census** | `9,800,000 + k, k∈0..N−1`; `N = min(max_S ⌈(1.96·σ̂_S/MDL_S)²⌉, 1200)` from the smoke; enriched eye-null; **X-DET** double-run |
| duration | the default full match (no time knob touched) |
| forcing | **NONE** (observational; `stationEye` null; no fork-and-hold — that is V4-P2) |
| `W_cal` | **PRIMARY 30 s** (gate + table); sensitivity {15 s, 45 s} labelled non-gating (§2.3) |
| surrogates | deep entry / box entry / shot-against (§2.1); concession outcome = opponent `stats.goals` increment |
| cluster unit | the **match seed** (#20) |
| bootstrap | 2,000 resamples, `BOOTSTRAP_SEED = 98003`; comparison-tick draws `COMPARISON_SEED = 98203` (both fresh, disjoint) |
| receipts | per-record `{seed, tick, gid, cause}`, capped 1,000/class, first-N deterministic (#49.3) |
| output | `docs/world-model/data/stage3-v4-p1-calibration.json`, SHA'd, twice byte-identical (X-DET) |
| HEAD / flags | run states HEAD + the armed #67.3 bundle, `stationEye` null (#26.5); `src/**` byte-identical; fingerprint `57b0bdab…c673` |

---

## 4. Deliverables + gates table

| deliverable | gate class | predicate / disposition |
| --- | --- | --- |
| **(a) the calibration table** — per surrogate `eN`, `p_e[CI]`, `p_b[CI]` (matched + all-playing), `L(S)[CI]`, drops, RESOLVED | output + **MONOTONE-LINK (HARD, per surrogate)** | admit iff RESOLVED and monotone-consistent (§2.4); dropped surrogate published, never patched; **ALL dropped ⇒ CLASS H uncalibratable ⇒ STOP at commander** |
| **(b) the conditional chain** (nesting) | output (labelled, descriptive) | `P(box\|deep)`, `P(shot\|box)`, incremental lifts with CIs (§2.2) — no threshold, no stop |
| **(c) `W_cal` sensitivity** {15 s, 45 s} | output (labelled) | the lift table re-read at the sensitivity windows; NON-GATING |
| **(d) the sizing smoke** | output (labelled) + **X-DET (HARD)** | realized `r_S`, `p̂_e/p̂_b`, σ̂_S; feeds the frozen N arithmetic; never gates a verdict |
| **fidelity** | **X-DET (HARD)** | census + smoke each twice byte-identical; output JSON SHA'd + quoted |
| **seed disjointness** | **HARD** | census `9,800,000+` and smoke `9,900,000+` disjoint from every prior family (§2.5) AND mutually disjoint (#46.2) |
| **publish-not-pool** | convention (#24/#44.5) | under-powered per-surrogate cells published, never pooled |
| **Road B** | **X-SRC-ZERO (HARD)** | `git diff --stat -- src` empty; production fingerprint `57b0bdab…c673` unchanged; probe changes no `src/**` |

Any X-family gate fails ⇒ FAIL, stop at the commander. **The calibration
table (admitted lifts) is the ONLY substantive output**; the chain,
sensitivity and smoke are labelled reference. P1 has **no X-CORPUS-IDENT**
(it is a fresh observational corpus, not a re-simulation of P3a — I7:
everything gate-bearing runs fresh); X-DET + X-SRC-ZERO + seed disjointness
are the fidelity gates.

---

## 5. Pre-laid readings — the full sign space (#38.1; none re-cut after sight)

* **(A) ALL THREE SURROGATES ADMIT — the design case; licenses V4-P2.**
  Each lift is RESOLVED (CI lower > 0) and the ladder is monotone
  `L(deep) ≤ L(box) ≤ L(shot)`. Disposition: **return to the commander with
  the calibration table**; this reading licenses V4-P2 (the occupancy
  census), which prices held cells through the designated PRIMARY surrogate
  (proposed box entry, §2.2).
* **(B) SOME SURROGATES DROP; ≥ 1 ADMITS (incl. a usable primary).** The
  unresolved/non-monotone surrogates are published and dropped; the admitted
  set (with a valid primary) is the table. Disposition: **return to the
  commander**; if the proposed primary dropped, the commander redesignates
  an admitted alternative or treats the channel as uncalibrated (flagged).
* **(C) ALL THREE DROP — CLASS H uncalibratable this way ⇒ STOP.** No lift
  resolves, or none survives the monotone check. Disposition: **STOP at the
  commander** (contract §6) — the concede-face surrogate→goal link cannot be
  made honest; V4-P2 does not run on an empty table. No re-cut.
* **(D) AN X-DET / X-SRC-ZERO / SEED-DISJOINTNESS GATE FAILS.** Non-
  deterministic output, `src/**` touched / fingerprint moved, or a seed
  collision. Disposition: **FAIL, STOP** — Road B and disjointness are the
  floor of every stage.
* **(E) A SURROGATE'S EVENT POPULATION IS UNDER-POWERED.** The smoke
  arithmetic demands `N_S > 1,200`, or a per-surrogate cell is too thin.
  Disposition: **published under-powered, never pooled** (#24/#44.5); it
  reads UNRESOLVED at the gate and is dropped — feeding (B) or, if it is the
  last surrogate, (C).
* **(F) `W_cal` SENSITIVITY DISAGREES with the primary.** The 15 s / 45 s
  readings move an admission verdict. Disposition: **published as labelled
  data**; the primary 30 s reading governs (frozen); a material disagreement
  is surfaced for the commander (not a silent re-cut).

---

## 6. Registered non-claims

* **V4-P1 PRICES NO STATION.** It forces no body, runs no fork-and-hold, and
  builds no occupancy census — that is V4-P2. It observes the world's own
  play.
* **V4-P1 BUILDS NO CONSUMER.** No merged scalar, no context extension, no
  in-support law — those are V4-P3. **The calibration table is UNIT
  CONVERSION ONLY** (surrogate event → goal-value); it does not decide
  whether any station is worth holding (V4-P2's census, consuming this
  table, does).
* **V4-P1 MAKES NO DEPLOYMENT / SHIPPING CLAIM.** No battery, no adoption
  ladder — those are V4-P4, behind the user's eyes.
* **P1 CALIBRATES ONLY THE CLASS H CONCEDE FACE** (#99.4/#99.5): the
  delivery limb (CLASS S) and the restart limb (CLASS J) are NOT calibrated
  here — their remedies (a wide-state context bit; the in-support law) need
  no surrogate→goal calibration and are V4-P3's.
* **The P3a corpus stays LABELLED (I7 / #44.3).** P1 quotes P0/P0b published
  aggregates only to pin `W_cal` and to seed the sizing arithmetic; every
  gate-bearing number runs FRESH on the P1 census.
* **Nothing ships (Road B).** Every EDS flag dormant in production,
  `c6Carry`/`c7Windup` probe-only, `stationEye` null, the fingerprint
  `57b0bdab…c673` unchanged, throughout the whole stage.
* **V4-P1 CANNOT authorize V4-P2.** Only the commander's review of this
  freeze (build) and of the P1 result (V4-P2 open) can; ALL surrogates
  failing stops the stage here.

---

## 7. Interpretive choices flagged for the commander (consolidated)

Each is the executor's operationalisation where #99.5 / the contract froze
the FORM but not the last detail; each will also appear in the run's
`deviations` block.

1. ⭐ **THE MATCHED BASELINE** (§2.2) — comparison ticks drawn from
   same-match, same-side, **PLAYING + OPPONENT-IN-POSSESSION** ticks,
   excluding post-event `W_cal` windows, one per event, deterministic
   (`COMPARISON_SEED = 98203`). Matched on possession-face but NOT on ball
   location (so the surrogate does not self-collapse and the ladder stays
   nested). A secondary all-playing baseline is published non-gating. This
   is the single most load-bearing modelling choice.
2. ⭐ **THE PRIMARY SURROGATE = opponent BOX ENTRY** (§2.2) — the severity
   knee: resolvable + preventable + dense. Alternatives flagged: deep entry
   (density/earliness, natural for rest defence) and shot-against (goal-
   proximity but sparse/finish-contaminated). The designation is the
   commander's; P1 publishes all three.
3. ⭐ **`W_cal` PRIMARY = 30 s** (§2.3) — the [10,15)∪[15,30) concede-mass
   concentration's outer bin edge, from P0's published curves (I6);
   sensitivity {15 s, 45 s} labelled. Honesty note: P0's curves are
   limb→surrogate (a longer chain than surrogate→concession), so 30 s is
   generous and the matched baseline absorbs the background — the lift is
   the excess, not the window's length.
4. **THE MONOTONE-LINK GATE = a deterministic greedy over the severity
   chain** (§2.4) — unresolved OR out-of-order surrogates dropped and
   published, never patched (I3). All-drop ⇒ stop at commander.
5. **THE SIZING SMOKE is needed and pre-registered** (§2.5) — the surrogate
   rates and the per-event concession hazard/σ are un-published; the smoke
   (40 matches @ 9,900,000+, disjoint) supplies realized σ, and the frozen
   arithmetic pins N (≤ 1,200) deterministically (#44.5/#65).
6. **THE BOX-ENTRY GEOMETRY is inlined read-only** (§2.1) from
   `BOX_DEPTH`/`BOX_WIDTH` (`src/sim/constants.ts:50–51`) mirroring
   `Match.inPenaltyBox` (`:2077–2079`), as the deep-entry detector inlines
   `REST_THIRD` — zero `src/**` change.
7. **THE CONCESSION OUTCOME = per-team `stats.goals` increment** (§2.1),
   attributed to the opponent's side — the exact P0b shots-channel pattern
   applied to goals.
8. **NEW seeds 98003 / 98203; census 9,800,000+ / smoke 9,900,000+**
   (§2.2/§2.5) — all disjoint from every prior family and mutually disjoint;
   no permutation seed (no dispersion statistic; I11).

---

## 8. Probe naming + the build sequence

The probe is **`scripts/probes/stage3-v4-p1-calibration.ts`**, built
**AFTER commander review** of this freeze (the standing freeze → review →
build → run pattern; §0.0 / #86.2). It reuses the V4-P0b probe's
enriched-world constructor, `inSupport`/`contextOf`, the concede/score cost
channels, the match-cluster bootstrap engine, receipts and the X-DET/output
conventions; it adds the box-entry detector, the goal-against concession
channel, the matched-baseline comparison-tick draw, and the monotone-link
gate. Command-line shape mirrors P0b's: a capped smoke (`V4P1_CAP` /
`V4P1_OUT`, writing OUTSIDE the repo) sizes N; the uncapped full run (under
the commander's resident session #49.5) writes the canonical
`docs/world-model/data/stage3-v4-p1-calibration.json`.

---

**FREEZE HONESTY.** Every criterion above was written citing ONLY
already-published sources — the V4-P0 §RESULT (HEAD `b390cf9`, output SHA
`94cea3ce…a55603`), the V4-P0b §RESULT (HEAD `8784986`, output SHA
`e304d326…b3817`), the P3a §RESULT (goals 2.4962/match), rulings #88–#99,
the v4 contract I1–I11, and a READ-ONLY reading of the P0b probe and
`src/**` mechanisms (file:line cited). **No `docs/world-model/data/*.json`
was opened and nothing was run before this document is committed.** This
freeze RETURNS TO THE COMMANDER; the probe is a future authorized step.

---

## §RESULT — the AUTHORIZED full run (#100/#101): SOME ADMIT, SOME DROP (§5 reading B) — the calibration table carries [deep, box]; shot-against DROPS non-monotone; the run RETURNS to the commander

Run to completion under the commander's resident session (#49.5), the
**frozen probe unchanged as reviewed** (§§1–8 + #100/#101; probe committed
`3293d33`, code-fidelity verify 6/6; no surrogate / estimator / window /
seed-block / baseline / gate / N-arithmetic re-cut after sight). HEAD
**`1362df8`** for BOTH runs; **ENRICHED eye-null world**, full #67.3 bundle
armed (`edsPerceivedDefence`+`edsPerceivedChoice`+`edsValueAxis`, `c5Hold`,
`c6Carry`, `c7Windup`; `c5TouchFork` off; `stationEye` NULL — pure
incumbent, no forcing); `src/**` byte-identical — **production fingerprint
`57b0bdab…c673` unchanged** (X-SRC-ZERO PASS, Road B held, nothing shipped).
Two runs, seed families disjoint (§2.5 / #46.2): the **sizing smoke** (40
matches `9,900,000 + k, k∈0..39`) pinned the census count deterministically
to **N = 1,200**; the **census** ran **1,200 matches `9,800,000 + k,
k∈0..1199`**. The census verdict (verbatim): **`SOME ADMIT, SOME DROP (§5
reading B) — admitted [deep, box]; dropped surrogates PUBLISHED, never
patched. RETURNS to the commander.`**

**The reading is (B) SOME ADMIT, SOME DROP** (§5): at the primary
`W_cal = 30 s` all three lifts RESOLVE (CI lower > 0), but the ladder is
**non-monotone at the shot rung** — the point lift of shot-against
(`0.086542`) falls **below** the admitted box-entry lift (`0.195217`), so
the deterministic left-anchored greedy admits **[deep, box]** and **DROPS
shot-against (published: "non-monotone — point lift below a milder admitted
surrogate", never patched)**. `allDropped = false`;
`proposedPrimaryBoxDropped = false`. **This is a run fact returned to the
commander; the adjudication (final per-channel primary designation, deferred
to V4-P2 per #100.3) and the P2 hand-off are the commander's separate ruling
— not this document.**

### THE SIZING SMOKE (labelled, NON-GATING — §2.5 / #44.5 / #65)

40 matches on `9,900,000 + k, k∈0..39`, enriched eye-null, X-DET double-run,
written OUTSIDE the canonical corpus. Realized per surrogate at the primary
`W_cal = 30 s` (`r_S` events/match; `p̂_e`/`p̂_b` primary-matched with CI;
pooled lift; per-match cluster σ̂):

| S (severity ↑) | `r_S` | eN | `p̂_e` [CI] | `p̂_b` (matched) [CI] | pooled lift | σ̂ (per-match) | finite matches for σ̂ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| deep entry | 36.525 | 1,461 | 0.190281 [0.140252, 0.240232] | 0.157426 [0.110242, 0.209689] | 0.032854 | 0.190805 | 40 |
| box entry | 1.3 | 52 | 0.326923 [0.189189, 0.482759] | 0.173077 [0.076923, 0.275000] | 0.153846 | 0.473665 | 27 |
| shot-against | 12.85 | 514 | 0.278210 [0.217699, 0.342541] | 0.177043 [0.112245, 0.249035] | 0.101167 | 0.238836 | 40 |

**THE FROZEN N ARITHMETIC** (`MDL_S = min( 0.5·|p̂_lift_smoke(S)| , 0.01 )`;
`N_S = ⌈(1.96·σ̂_S / MDL_S)²⌉`; `N = min( max_S N_S , N_max = 1,200 )`). For
all three surrogates `0.5·|p̂_lift| > 0.01`, so **MDL_S = 0.01** each:

| S | σ̂_S | MDL_S | `N_S` | under-powered? |
| --- | --- | --- | --- | --- |
| deep entry | 0.190805 | 0.01 | 1,399 | true (`N_S > N_max`) |
| box entry | 0.473665 | 0.01 | 8,619 | true (`N_S > N_max`) |
| shot-against | 0.238836 | 0.01 | 2,192 | true (`N_S > N_max`) |

`max_S N_S = 8,619` ⇒ **`N = min(8,619, 1,200) = 1,200`**. All three
`N_S > N_max` ⇒ each is flagged **under-powered (published, never pooled —
#24/#44.5)** at the smoke's frozen 50 %/0.01 MDL target; the census still
runs at `N = 1,200` (the honest #44.5 pattern — the census gate reads the
real cluster bootstrap, not the sizing approximation, #101.2).

Smoke gates: `xDet: true`, `xSrcZero: true` (fingerprint
`57b0bdab…c673` = observed), `seedDisjoint: true`. Output SHA-256
**`2033caa9ce8642de75bf14f9901cbc8ebe6396174ccde554340ecd7646d7a67c`**.
Smoke verdict (verbatim, LABELLED — not a verdict): **`SIZING SMOKE — NOT a
verdict (prereg §2.5, #44.5/#65): realizes r_S, p̂_e/p̂_b, σ̂_S and pins the
census N via the frozen arithmetic (labelled, non-gating). Pass
nArithmetic.N as V4P1_N to the census.`**

### THE CENSUS (N = 1,200 @ 9.8M)

`matchCount = nCensus = nEnv = 1,200` (`nSource = "V4P1_N env (pinned from
the sizing smoke arithmetic; capped at N_max)"`); seeds `9,800,000 + k,
k∈0..1199` (`seedRange first 9,800,000 · last 9,801,199 · count 1,200`);
enriched eye-null; `W_cal` primary 30 s; cluster bootstrap `B = 2,000`,
`BOOTSTRAP_SEED = 98003`; comparison-tick draws `COMPARISON_SEED = 98203`.
HEAD `1362df8`. Output SHA-256
**`f159f3a1f62e9c2a33e876d0f8eea49128978beb1337dbc9d65325f4d0670d37`**.
Census verdict (verbatim): **`SOME ADMIT, SOME DROP (§5 reading B) —
admitted [deep, box]; dropped surrogates PUBLISHED, never patched. RETURNS
to the commander.`**

### THE CALIBRATION TABLE (primary `W_cal = 30 s`)

Per surrogate: event count `eN`, realized rate `r_S`, post-event hazard
`p_e`, matched baseline `p_b` (primary) and secondary all-playing baseline,
the lift `L(S) = p_e − p_b` (primary + secondary), baseline drops, RESOLVED.

| S (severity ↑) | eN | `r_S` | `p_e` [CI] | `p_b` matched [CI] | `p_b` all-play [CI] | **L(S)** [CI] | L secondary [CI] | drops (P/S) | RESOLVED |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| deep entry | 41,882 | 34.901667 | 0.211738 [0.202749, 0.220602] | 0.168282 [0.155418, 0.180502] | 0.161740 [0.150772, 0.173185] | **0.043455 [0.030790, 0.055817]** | 0.049998 [0.038470, 0.061399] | 0 / 0 | **true** |
| box entry | 2,300 | 1.916667 | 0.382609 [0.356158, 0.407324] | 0.187391 [0.169205, 0.206652] | 0.170435 [0.154181, 0.188265] | **0.195217 [0.166228, 0.223515]** | 0.212174 [0.185339, 0.238528] | 0 / 0 | **true** |
| shot-against | 15,946 | 13.288333 | 0.283457 [0.272956, 0.294026] | 0.196915 [0.184492, 0.210303] | 0.179732 [0.167622, 0.191701] | **0.086542 [0.073873, 0.098874]** | 0.103725 [0.091299, 0.115916] | 0 / 0 | **true** |

All three RESOLVE (each primary lift CI lower bound > 0); zero baseline
drops on either baseline. The secondary all-playing baseline is **published,
NON-GATING** (§2.2).

### THE MONOTONE-LINK GATE (I3, HARD) — read at the primary `W_cal = 30 s`

Gate block semantics (verbatim from the run):

* **ordering**: `deep ≺ box ≺ shot (increasing severity)`
* **monotoneRequirement**: `L(deep) ≤ L(box) ≤ L(shot)`
* **admission**: `deterministic left-anchored greedy (§2.4): admit iff
  RESOLVED and point lift ≥ last admitted; drops PUBLISHED, never patched`

Per surrogate (as recorded):

| S | RESOLVED | point lift | CI | ADMITTED | dropReason |
| --- | --- | --- | --- | --- | --- |
| deep entry | true | 0.043455 | [0.030790, 0.055817] | **true** | null |
| box entry | true | 0.195217 | [0.166228, 0.223515] | **true** | null |
| shot-against | true | 0.086542 | [0.073873, 0.098874] | **false** | `non-monotone — point lift below a milder admitted surrogate` |

`admittedSet = ["deep", "box"]`; `allDropped = false`;
`proposedPrimaryBoxDropped = false`. Primary-designation note (verbatim):
*"PROPOSED primary = box entry (severity knee); the FINAL per-channel
primary designation is DEFERRED to the V4-P2 pre-registration with this
table in hand (ruling #100.3). P1 gates on the resolved monotone ladder, not
on the primary choice."*

### THE CONDITIONAL CHAIN (descriptive, LABELLED, NON-GATING — §2.2)

`W_link = 30 s`, same-possession. Quoted to exact stored digits:

* **P(box entry | deep entry)** = **0.093453** [0.087528, 0.099292]
* **P(shot-against | box entry)** = **0.706087** [0.684442, 0.727194]
* **incremental lift `L(box) − L(deep)`** = **+0.151762** [0.123154, 0.181518]
* **incremental lift `L(shot) − L(box)`** = **−0.108675** [−0.137404, −0.079604]

Note (verbatim): *"DESCRIPTIVE (prereg §2.2): nesting is by
severity/proximity (empirically near-nested, not strict set containment — a
shot may originate outside the box). The chain reports the actual measured
overlap so the double-counting is a quantity, not an assumption."* The
`shotMinusBox` increment is negative — the same non-monotonicity the gate
dropped, reported here as a measured quantity.

### `W_cal` SENSITIVITY {15 s, 45 s} (labelled, NON-GATING — §2.3)

Re-read of the lift table at the two sensitivity windows; the gate + primary
table read the 30 s window ONLY. State recorded as-is:

| S | 15 s: **L** [CI] (resolved) | 45 s: **L** [CI] (resolved) |
| --- | --- | --- |
| deep entry | 0.066616 [0.059911, 0.073746] (**true**) | 0.006972 [−0.010359, 0.023235] (**false**) |
| box entry | 0.216957 [0.190953, 0.244068] (**true**) | 0.154783 [0.125433, 0.181941] (**true**) |
| shot-against | 0.115452 [0.106724, 0.124603] (**true**) | 0.049730 [0.032753, 0.065651] (**true**) |

At 15 s the shot rung stays below box (same non-monotone shape as the
primary); at 45 s the deep-entry lift goes UNRESOLVED (CI spans 0). Labelled
reference only — the primary 30 s reading governs (frozen).

### HARD GATES

| gate | result (JSON, as-is) |
| --- | --- |
| **X-DET (census)** | **PASS** — `fidelity.xDet: true`; whole-payload double-run byte-identical; output SHA-256 `f159f3a1…0d37` |
| **X-DET (smoke)** | **PASS** — `fidelity.xDet: true`; double-run byte-identical; output SHA-256 `2033caa9…a67c` |
| **X-SRC-ZERO** | **PASS** (both modes) — `fidelity.xSrcZero.srcDiffEmpty: true`; fingerprint baseline `57b0bdab…c673` = observed `57b0bdab…c673` (`matches: true`) — unchanged |
| **seed disjointness** | **PASS** (both modes) — census `[9,800,000, 9,801,199]`, smoke `[9,900,000, 9,900,039]`, fresh-reference ceiling `9,700,399`; disjoint from every prior family AND mutually disjoint (computed from the frozen family constants) |
| **X-CORPUS-IDENT** | **N/A** — `"N/A (prereg §4 / #100.2(v): a fresh observational corpus has no identity target)"` |
| **monotone-link (HARD, per surrogate)** | resolved-monotone ladder ADMITS **[deep, box]**; shot-against DROPPED (non-monotone), published, never patched; `allDropped = false` |

The secondary all-playing baseline is published NON-GATING alongside the
matched primary (§2.2). No X-family gate failed.

**Reading B (§5): some admit, some drop — the calibration table carries
[deep, box]; shot-against is published dropped (non-monotone), never patched.
Adjudication and the P2 hand-off are the commander's ruling in
PROGRAMME-RULINGS.md.**
