# C6 T0 — The Carry-Geometry Census

Status: **PRE-REGISTERED 2026-07-28 night, FROZEN before the run.**
READ-ONLY. Zero `src/**`. Nothing armed, no flag touched, no constant moved.
This is a **measurement pre-registration only** — the census does NOT run under
this commit. It runs after commander review, on the commander's word (the P1
two-commit precedent; ruling #45.2(b): executor drafts → commander review →
authorized run → ruling).

Authority chain: **contract [`C6-EMBODIED-CARRYING.md`](C6-EMBODIED-CARRYING.md)
§6-T0** (this stage's scope) · §5 invariants and §7 gate sources bind ·
**ruling #45.2(b)** (night queue: this is stage (b), the executor sub-session
drafting C6's first stage) · #24 (floors attainable on the deployed population)
· #29.5 (deliverability is a freeze-time obligation) · #32.1 (no
coupon-collector gate forms) · #38.1 (standing exception classes + full sign
space) · #44.5 (a disclosure touching a gate's POPULATION triggers a read-only
sizing + commander sign-off before the run — done here as §6's smoke) · #20 (CI
semantics, cluster units) · Road B (nothing ships; `c6Carry` stays unbuilt at
T0 — this stage implements no law).

Code map: [`C6-PHASE0-CODE-MAP.md`](C6-PHASE0-CODE-MAP.md). The map and the
contract cite line numbers from 2026-07-27; HEAD has drifted. §7 records the
current-HEAD lines. **Every cited code VALUE is intact** (the 2.5 m/s gate, the
4.2 m `TOUCH_CONTROL_DIST`, `TURN_RATE = 6.5`, `carry = 0.85`, the 1.15 m
ball-keyed tackle radius); only line numbers moved. Reported, not resolved.

---

## 1. What T0 is, and is not

T0 is the baseline the honest offset (§4.1 of the contract) must be priced
against. It **prices GEOMETRY, not value** (contract §9): it measures where the
ball sits, how bodies turn with it, and who can reach it — never whether
carrying pays or costs. It proposes no law and freezes no constant; the four
candidate parameterizations in §5 are **non-binding sizing devices** — T1
freezes its own law.

The census is **observational**: it steps unmodified matches and reads state.
It does not fork the world, does not force any behaviour, and touches no flag —
the glue is exactly the shipped glue throughout. (T1, not T0, forks and forces;
T0 supplies the populations and the counterfactual arithmetic that will power
T1's gates.)

---

## 2. The four census deliverables (contract §6-T0, made operational)

### (i) Carry-state population

Every **owned, playing, outfield** tick (ball has an owner; `phase ===
'playing'`; owner `role !== 'GK'`) is tallied into one cell of
**speed × turn-rate × pressure**, with the owner's `action.type` recorded
alongside as a fourth (reported, non-binding) axis. **Band edges are DERIVED
from named code constants**, not invented:

```text
speed |v| (m/s):   walk  ≤ 2.5          -- the de-glue speed gate (Match.ts:1420)
                   jog   2.5 – 5.0       -- 5.0 = 2× the gate
                   sprint > 5.0

turn-rate |ω|:     straight  < 0.65      -- 0.1 × TURN_RATE (Player.ts:17)
(rad/s)            moderate  0.65 – 3.25 -- up to 0.5 × TURN_RATE
                   hard      ≥ 3.25       -- ≥ half the physical cap (6.5)
                   |ω| = |Δheading| / DT between consecutive owned ticks

pressure nearOpp:  tight     ≤ 2.1       -- 0.5 × TOUCH_CONTROL_DIST
(m, body-body)     pressured 2.1 – 4.2   -- up to the space gate (constants.ts:315)
                   free      > 4.2       -- the de-glue space regime
                   nearOpp = min body-body distance to a non-sent-off opponent,
                   exactly the quantity Match.ts:1422-1427 computes for the gate
```

27 cells; each reports its count, share of owned ticks, and the `action.type`
breakdown within it. This is "the map's regime table, now with numbers."

**Pre-registered expectation (from §6 smoke), not a gate**: the `action.type`
axis is near-degenerate — ball ownership sets `action = 'Dribble'`
(`Match.ts:1297`), so ~99% of owned ticks carry the `Dribble` label regardless
of what the body is doing. This confirms the map's reading that the action-label
gate is bookkeeping (map §2); it is reported so the successor is not surprised,
never leaned on.

### (ii) Turn-episode census

A **turn episode** is a maximal run of consecutive owned ticks over which the
signed heading sweep reaches **≥ 90° (π/2 rad)** before the sweep stalls. The
signed per-tick heading change accumulates; a sign reversal restarts the
accumulator (a new sweep in the opposite direction); an episode closes when the
per-tick turn rate falls below the `straight` edge (0.65 rad/s). Reported:

* **count** (total, and per-match distribution p10/p50/p90);
* **duration distribution** (ticks and seconds, p10/p50/p90) — the tail of the
  sweep past 90°, read against the 0.48 s / 29-tick full-180° figure the glue
  already charges (contract §1);
* **what happens during and in a declared window after**: for each episode,
  whether a tackle-eligible defender (below) is present **during** the sweep,
  and whether one appears in the **post-window = 30 ticks (0.5 s)** after the
  episode closes. The 0.5 s window is DECLARED here and frozen; it is the beat
  in which a defender who read the turn arrives. Tackle *attempts and outcomes*
  proper are a forked measurement (T1); at T0 the eligibility count sizes that
  fork's population.

### (iii) The exposure instrument

Over every owned tick, and keyed for the geometry T1's priced-direction gate
will be derived from: **tackle eligibility × ball–defender geometry.**

* **Tackle-eligible** = at least one non-sent-off opponent within the **1.15 m
  ball tackle radius** (`dist(opp.pos, ball.pos) < 1.15`, exactly the
  `tryTackles` key, mechanics.ts:1757). This is the surface through which the
  honest offset changes who can reach the ball — the attack stays ball-keyed
  and unmodified (invariant I7).
* **Distance band** of the nearest eligible defender to the ball:
  `≤ 0.58` (½ the radius) · `0.58 – 1.15`. (The radius itself is the outer
  edge; finer bands are reported, never gated below the per-cell floor.)
* **Approach side — computed precisely from recorded positions.** Let
  `ballOffset = ball.pos − owner.pos` (the ball's displacement from the body;
  under the glue this is `heading · 0.85`). For the nearest eligible defender
  `q`, let `defVec = q.pos − owner.pos`. The approach side is the sign of
  `dot(defVec, ballOffset)`:
  * `≥ 0` → **ball-offset side (exposed)**: the defender is on the same side of
    the body as the ball sits;
  * `< 0` → **far side (protected)**: the defender is behind the ball relative
    to the body.
  The signed lateral component `cross(ballOffset, defVec)` is reported too, for
  a finer left/right split, but the dot-sign is the primary exposed/protected
  cut. Tackle attempts and successes by (distance band × approach side) are the
  forked T1 measurement; T0 establishes the **baseline distribution** and its
  population.

**Pre-registered baseline expectation (from §6 smoke), and it is a finding, not
noise**: under the glue the exposed/protected split is a **near point-mass at
exposed (~99.96%)** — because the ball is welded to `heading · 0.85` and the
attack keys on the ball, a defender within the tackle radius is essentially
always on the ball-offset side. This is precisely the degenerate baseline the
honest offset exists to break: today the ball presents identically whether the
body turns into a defender or away from him (contract §1). T0 records the
near-zero far-side share so T1 has a floor to move UP from; §5's counterfactual
arithmetic sizes how far it can move it.

### (iv) Counterfactual geometry sizing

**Pure arithmetic on the recorded per-tick states** — no re-simulation, no
forking. For 2–3 candidate tuck/lag parameterizations (§5, non-binding),
recompute the ball position from the recorded body state and heading history,
then recompute ball–defender distances and the (distance band × approach side)
distribution. This sizes, ex ante:

* how far a candidate law moves the far-side (protected) share off its ~0
  baseline → the **effect size and power** for T1's "exposure moves in the
  T0-priced direction" gate;
* the **kick-release displacement**: kicks originate at the ball, so a moved
  ball shifts the kick origin by centimetres. Recompute `ball.pos` under each
  candidate at recorded states and report the displacement distribution — the
  ex-ante size of T1's kick-release equivalence claim (the sixth threshold
  type: "no change" is a claim carrying its own interval test, not a default).

This is the P1R pre-freeze-sizing pattern, now standing practice (#44.5), moved
one layer in: the sizing is folded into T0's own deliverable so T1's constants
and power are set against measured redistribution, not a guess.

---

## 3. Gates, frozen

Read-only census X-family. Cluster unit for every CI statement = **match seed**
(#20); a rate/shift is *resolved* only when its match-seed cluster-bootstrap CI
excludes its reference; a null result is reported as such, never re-cut.

| gate | predicate |
| --- | --- |
| **X-SRC** | `git diff --stat` shows **zero** `src/**` changes; the census imports the sim and reads it, writes nothing back |
| **X-FP** | league fingerprint identical to the frozen baseline `57b0bdab…c673` (nothing armed ⇒ trivially, asserted) |
| **X-DET** | two `runExperiment()` invocations produce **byte-identical** output JSON; the output-table SHA is emitted and quoted in §5-result |
| **X-OVERLAP** | reproduces any existing overlapping instrument. **None exists** — no prior census measures turn geometry or the ball-offset exposure split (`carry-affordance-census` measures forward carry affordances, a different object). Recorded as vacuous with that reason; a soft sanity anchor is reported (owned-outfield share vs P0's 19.4% ball-directed body-ticks), not gated |
| **X-CLASSIFY** | every owned-outfield-playing tick maps to exactly one of the 27 band cells; **unexplained = exactly 0** (a tick that is none of {classified cell, a standing exception class}); the exception classes account for every EXCLUDED tick |

### Population floors (#24 — derived from the §6 smoke, attainable on the census staging)

The smoke (16 matches, block 4,000,000, §6) measured the ATTAINABLE rates. The
census staging (§4) is **600 matches** across 6 disjoint blocks. Expected
populations and frozen floors (2× headroom convention, #43.3):

| floor | expected @ 600 matches | frozen floor | basis |
| --- | --- | --- | --- |
| **F-CARRY** owned-outfield ticks | ~1.95 M (3,254/match) | **≥ 800,000** | 2.4× headroom |
| **F-TURN** turn episodes (§6-T0 (ii)) | ~3,900 (6.50/match) | **≥ 1,800** | 2.2× headroom — **the binding gate** (contract §8: too thin ⇒ fork returns to the commander BEFORE T1) |
| **F-TURN-EXPOSED** episodes with a tackle-eligible tick during OR in the 0.5 s post-window | ~1,750 (during 29.8%, after 26.0% of episodes) | **≥ 700** | 2.5× headroom over the smaller "during" limb |
| **F-EXPOSURE** tackle-eligible owned ticks (instrument iii) | ~182,000 (9.35%/owned) | **≥ 4,000** | abundant; per (distance × side) cell a **150 floor** (SE ≤ 3pp, the P1R convention); a cell below it is labelled **UNDER-POWERED**, never pooled away |

⭐ The floors are derived from a smoke that measured **population RATES only** —
owned-tick share, turn-episode rate, pressure share, tackle-eligibility,
exposure baseline. It read **no T0 census outcome and made no comparison**, so
using it to set floors is floor derivation, not a result peek — exactly the
sizing-before-freeze #44.5 codified. The smoke output is reproduced in §6 and
its script is committed beside this doc.

### Standing exception classes (#38.1) — unexplained must be exactly 0

Every EXCLUDED owned tick falls in exactly one:

```text
E-PAUSED     phase ≠ 'playing' (kickoff, halftime, stoppage, restart wait)
E-GK         owner.role === 'GK' (the keeper path Match.ts:1443-1461, §9-untouched)
E-GKHOLD     owner.gkHoldTimer > 0 or gkDistributing (hands, not feet; carry=0.3)
E-RESTART    owner is the restart taker (restartKickGid === owner.gid)
E-SENTOFF    owner.sentOff
E-NOOWNER    ball has no owner (in flight / loose)
E-ENDED      match finished
```

A tick that is neither a classified band cell nor a listed exception is
**unexplained**; the count must be 0. (No coupon-collector max-statistic gate is
used, #32.1: every gate is a share or a population count powered ex ante.)

---

## 4. Staging table, frozen

> **⚠ COMMANDER AMENDMENT #46.2 (smoke/census seed disjointness), applied
> ex ante before the run.** The disclosed smoke (§6) ran 16 matches at block
> **4,000,000**; the census's first stride as originally frozen (`4,000,000 +
> b·100,000 + k`) overlapped those very seeds. Per ruling #46.2 the census
> staging shifts ONE stride up to **4,100,000**: seeds `4,100,000 + b·100,000
> + k`, `b ∈ 0..5`, `k ∈ 0..99` — 600 matches, **4.1M–4.7M**, disjoint from the
> smoke (4.0M) and from every consumed range. Floors are unchanged (rates are
> seed-independent, #46.2); nothing else moves. The staging rows below carry
> the amended seeds.

| item | value |
| --- | --- |
| **seed block** | **4,100,000** (amendment #46.2; fresh, disjoint). Consumed elsewhere: P0 930k · P1 960k–1.46M · P1R 980k–1.48M · P2-A 2.0M–3.2M · P2-B 3.5M–3.9M · the C4/C5 stages 700k–970k · **the §6 smoke 4.0M**. **4,100,000 lies above every consumed range and above the smoke.** |
| **blocks** | 6 disjoint strides: seeds `4,100,000 + b·100,000 + k`, `b ∈ 0..5`, `k ∈ 0..99` (amendment #46.2) |
| **matches** | **600** (100/block), justified by the smoke: at 6.50 episodes/match this delivers ~3,900 turn episodes = 2.2× the F-TURN floor, with every other floor cleared with ≥ 2.4× headroom |
| **duration** | default `MATCH_DURATION = 240` (unmodified) |
| **sampling cadence** | **every playing tick** — turn episodes require per-tick heading tracking; there is no sub-sampling (the population is per-tick by construction, and the run is ~9 M steps, modest against the programme's 68 M-tick P1R) |
| **cluster unit** | match seed (disjoint per block), #20 |
| **bootstrap** | fixed `BOOTSTRAP_SEED`, cluster resampling over match seeds |
| **output** | `docs/world-model/data/c6-t0-carry-geometry.json`, committed as SHA'd data with the run result; the table SHA quoted in §5-result and reproduced by X-DET |

---

## 5. Counterfactual candidates (non-binding; registered for §2 (iv))

**These are sizing devices, not proposed law.** T1 freezes its own law from the
census; these three bracket the contract §4.1 terms (magnitude, lag, noise) so
(iv)'s arithmetic sizes each term's exposure effect. Each recomputes
`ball.pos = owner.pos + dir(θ_ball)·carryLen` on the RECORDED states; `noise` is
excluded from the sizing (zero-mean, it does not move the geometry's central
distribution) and named only as the third term T1 will add.

```text
Candidate A — MAGNITUDE-ONLY tuck, no lag.
  carryLen = 0.85 − 0.35 · min(|ω|/TURN_RATE, 1)       (tucks toward the feet in a hard turn)
  θ_ball   = θ_heading                                   (no lag)
  Isolates: how much the far-side share moves from a pure tuck.

Candidate B — MODERATE tuck + MEDIUM lag + speed growth (the "combined" shape).
  carryLen = clamp(0.55 + 0.15·(|v|/7) − 0.30·(|ω|/TURN_RATE), 0.30, 1.40)
             (7 m/s = the ~role top-speed reference; the ball runs ahead at pace,
              tucks under turn — continuous with the push doctrine's open-priced knock)
  θ_ball   = the recorded heading τ = 0.18 s earlier      (the ball TRAILS the sweep)
  Isolates: the law shape the contract sketches, both terms live.

Candidate C — LAG-ONLY, magnitude held.
  carryLen = 0.85                                         (unchanged)
  θ_ball   = the recorded heading τ = 0.30 s earlier      (near the full 0.48 s pivot)
  Isolates: the lag term alone — the single term the contract says breaks
            "以自己为圆心" literally (§4.1).
```

The lag is applied by reading each body's own recorded heading history back τ
seconds (the census stores per-tick headings), so it is pure arithmetic on
recorded states, never a re-simulation. For each candidate, (iv) reports the
new far-side share, the shift's match-seed cluster CI (#20), and the
kick-origin displacement distribution.

## 5-result — the AUTHORIZED run (commander ruling #46.5 / amendment #46.2)

Script: [`../../scripts/probes/c6-t0-carry-geometry.ts`](../../scripts/probes/c6-t0-carry-geometry.ts).
Data: [`data/c6-t0-carry-geometry.json`](data/c6-t0-carry-geometry.json).
Run read-only, **600 matches**, seeds `4,100,000 + b·100,000 + k` (#46.2),
default duration, every playing tick, zero `src/**`. `runExperiment()` invoked
**twice**, byte-identical (X-DET). Verdict: **GATES PASS.**

* **output SHA** `aeaed17b82f4c8da7f3b0fafb3d9116c27ca01d73b4449b6263f65264290bc57`
* **table SHA** (the four deliverables) `bb5219e0dcde9e41b1b4ac64c27abaf73098165a6c80f8cd7f06e9fb064abb0e`

### Gate table

| gate | verdict | evidence |
| --- | --- | --- |
| **X-SRC** | ✅ PASS | `git diff --stat -- src` empty at run time |
| **X-FP** | ✅ PASS (asserted) | nothing armed; fingerprint trivially `57b0bdab…c673` |
| **X-OVERLAP** | ✅ PASS (vacuous) | no prior instrument measures turn geometry / ball-offset exposure; soft anchor: owned-outfield share **19.29%** vs P0's 19.4% ball-directed body-ticks |
| **X-CLASSIFY** | ✅ PASS | ledger total 9,038,719 = total steps; classified = owned ticks; **unexplained = 0** |
| **X-DET** | ✅ PASS | two invocations byte-identical; SHAs above |

### Population floors (#24)

| floor | population | frozen floor | headroom | verdict |
| --- | --- | --- | --- | --- |
| **F-CARRY** owned-outfield ticks | **1,743,606** | ≥ 800,000 | 2.18× | ✅ PASS |
| **F-TURN** turn episodes | **4,116** | ≥ 1,800 | 2.29× | ✅ PASS (the binding gate) |
| **F-TURN-EXPOSED** episodes exposed during OR post-window | **1,484** | ≥ 700 | 2.12× | ✅ PASS |
| **F-EXPOSURE** tackle-eligible owned ticks | **178,590** | ≥ 4,000 | 44.6× | ✅ PASS |

Exception ledger (every excluded tick classed, #38.1): E-NOOWNER 4,657,709 ·
E-GKHOLD 1,284,934 · E-PAUSED 1,258,071 · E-GK 57,300 · E-RESTART 36,499 ·
E-ENDED 600 · E-SENTOFF 0 · classified 1,743,606 → **unexplained 0**.

### (i) Carry-state population — 27/27 cells populated

Owned ticks are **19.29%** of all steps (3,254-rate consistent with the smoke).
Pressure: **pressured (≤4.2 m) 81.31%**, tight (≤2.1 m) 50.31% — pressured
carrying is the common case (ruling #46.4). Top cells (share of owned):

| share | count | speed / turn / pressure |
| --- | --- | --- |
| 14.34% | 250,017 | sprint>5 / straight / tight |
| 9.87% | 172,085 | sprint>5 / moderate / tight |
| 9.53% | 166,182 | sprint>5 / straight / pressured |
| 7.50% | 130,745 | sprint>5 / moderate / pressured |
| 7.30% | 127,277 | jog2.5-5 / moderate / tight |
| 5.76% | 100,349 | walk / hard / tight |
| 5.55% | 96,817 | walk / hard / free |

`sprint>5 & hard` remains rare (0.011%–0.442%), exactly the smoke's reading.
**Action axis (non-binding 4th axis):** Dribble **98.89%**, MoveToFormationSpot
0.72%, HoldUp 0.39% — near-degenerate, **reading (d) confirmed** (ruling #46.3:
ownership forces the label; the turn's real excluder is the speed gate).

### (ii) Turn episodes

4,116 episodes = **6.86/match** (per-match p10 2 / p50 6 / p90 13). Duration
p10 4 / **p50 11 / p90 32** ticks = p50 **0.183 s** / p90 **0.533 s** (the tail
runs just past the glue's 0.48 s full-180° charge). Tackle-eligible **during
30.35%** (1,249), **in the 0.5 s post-window 21.99%** (905); **exposed during
OR after 36.05%** (1,484).

### (iii) Exposure baseline — the near point-mass, quantified

178,590 tackle-eligible owned ticks (**10.24%** of owned). Split: **exposed
99.9524%**, **far-side 0.0476% (85 ticks)** — the degenerate baseline the honest
offset exists to break (ruling #46.4: the ball is welded to `heading·0.85`).

| distance × side | count | share of eligible | label |
| --- | --- | --- | --- |
| ≤0.58 / exposed | 69,518 | 38.93% | powered |
| 0.58–1.15 / exposed | 108,987 | 61.03% | powered |
| ≤0.58 / far | 0 | 0.00% | **UNDER-POWERED** (labelled, never pooled) |
| 0.58–1.15 / far | 85 | 0.048% | **UNDER-POWERED** (labelled, never pooled) |

Lateral (cross-sign) split of eligible ticks: left 87,935 / right 90,655 /
on-axis 0 — symmetric, as expected. The two far-side cells sit below the 150
per-cell floor **by design** (reading (b)'s degenerate baseline); they are
labelled UNDER-POWERED and reported, never gated away — this is the floor T1
must move UP from.

### (iv) Counterfactual geometry sizing (pure arithmetic; lag lookback fallback = 0 ticks)

Cluster unit = match seed; shift CI = match-seed cluster bootstrap (#20). Each
shift's CI excludes zero (all **resolved**).

| candidate | baseline far-side | candidate far-side | shift (pp) | 95% CI (pp) | resolved | kick displacement p50 / p90 |
| --- | --- | --- | --- | --- | --- | --- |
| **A** magnitude-only | 0.048% | 0.001% | **−0.047** | [−0.057, −0.036] | ✅ (negative) | 0.095 m / 0.350 m |
| **B** combined (tuck+lag+speed) | 0.048% | **1.473%** | **+1.425** | **[+1.328, +1.525]** | ✅ **(positive)** | 0.346 m / 0.727 m |
| **C** lag-only | 0.048% | 0.000% | **−0.048** | [−0.058, −0.037] | ✅ (negative) | 0.279 m / 1.018 m |

**Only candidate B moves the far-side (protected) share UP off its ~0 baseline**
(+1.43 pp, CI strictly positive). The pure-tuck (A) and pure-lag (C) shapes each
drive it toward/at zero — a size worth carrying into T1: the movable exposure
comes from the *combined* shape (tuck + lag + speed growth), not either term
alone. Kick-origin displacement is **decimetre-scale for the lag-bearing
candidates** (B p90 0.73 m, C p90 1.02 m) and sub-decimetre for magnitude-only
(A p50 0.095 m); the per-candidate `max` tail (~35 m) is a de-glue / ownership-
transition artefact (recorded ball already off the body), not the operative size.

### Which pre-laid reading fired (§8)

* **(c) RICH, MOVABLE GEOMETRY — FIRES (primary).** Turn episodes clear F-TURN
  (4,116 ≥ 1,800) **and** candidate B moves the far-side share off ~0 with a
  match-seed CI excluding zero (+1.43 pp [+1.33, +1.53]). Per §9 this **licenses
  the commander to authorize T1's drafting** — nothing more (T0 prices no law).
* **(d) ACTION-AXIS COLLAPSE — FIRES (expected, benign).** Dribble 98.89%; read
  as the map's bookkeeping finding, leaned on nowhere (the census keys on
  speed/turn/pressure, none degenerate).
* **(e) KICK-RELEASE DELTA — noted as an ex-ante size.** The lag candidates'
  displacement (B/C p90 0.73–1.02 m) is well beyond "centimetres"; T1 must
  **pre-power its sixth-threshold equivalence interval** rather than discover it.
* **(a) THIN TURN — does NOT fire** (4,116 is 2.29× the floor).
* **(b) DEGENERATE EXPOSURE — does NOT fire** (candidate B redistributes the
  far-side share; the geometry is movable by an admissible law).

**Non-claims (§9) stand:** T0 priced geometry only, proposed no law, froze no
constant, and cannot authorize T1 — the result returns to the commander.

---

## 6. The pre-freeze sizing smoke (disclosed, #44.5)

Script: [`../../scripts/probes/c6-t0-sizing-smoke.ts`](../../scripts/probes/c6-t0-sizing-smoke.ts)
(committed beside this doc). Run 2026-07-28, **16 matches, block 4,000,000**,
HEAD `016c7f9`, read-only, zero `src/**`. It measured population RATES to derive
§3's floors — no census outcome, no comparison, no ranking. Verbatim:

```text
total steps 240,682; owned outfield playing ticks 52,067 (21.63% of steps, 3,254/match)

carry-state population (top cells, by share of owned ticks):
  10.39%  sprint>5 / straight / tight       10.30%  sprint>5 / straight / pressured
  10.20%  walk / straight / tight            8.84%  sprint>5 / moderate / tight
   8.20%  sprint>5 / moderate / pressured    6.18%  jog / moderate / tight
   5.42%  walk / hard / free                 5.36%  walk / hard / tight
  ( 27 cells populated; hard-turn cells span walk→jog, sprint+hard is rare 0.09–0.39% )

action labels while owned:  Dribble 99.26%  ·  MoveToFormationSpot 0.60%  ·  HoldUp 0.14%

pressure:   pressured (≤4.2 m) 81.05% of owned   ·   tight (≤2.1 m) 50.19%
tackle-eligible (opp within 1.15 m of ball):  9.35% of owned
  exposure split:  ball-offset side 99.96%   ·   far side 0.04%

turn episodes (sweep ≥ 90°):  104 over 16 = 6.50/match  (p10 2.5 / p50 6.5 / p90 10.5 per match)
  duration:  p50 11 ticks 0.183 s   ·   p90 24.7 ticks 0.412 s
  tackle-eligible DURING:  29.81% of episodes   ·   in 0.5 s AFTER:  25.96%
```

Three facts the smoke establishes, carried into the readings below: pressured
carrying is the **common** case (81%), not the rare open-field one; the
exposure split is a near point-mass at exposed under the glue; and the
turn-episode rate (6.5/match) is comfortably above what F-TURN needs at 600
matches.

---

## 7. Code truth at HEAD (`016c7f9`) — line drift, values intact

The contract/map cite 2026-07-27 lines; verified at HEAD:

| cited (map/contract) | actual @ HEAD | value |
| --- | --- | --- |
| glue `Match.ts:1296-1337` | `stepBall` at **1402**; de-glue branch **1412-1432**; glue assignment **1443-1450** | `carry = 0.85` (0.3 for GK hold), confirmed |
| speed gate | `Match.ts:1420` `vel·vel > 2.5*2.5` | 2.5 m/s, confirmed |
| space gate `nearOpp > TOUCH_CONTROL_DIST` | `Match.ts:1428` | — |
| `TOUCH_CONTROL_DIST` `constants.ts:304` | `constants.ts:315` | 4.2 m, confirmed |
| push `performDribbleTouch` `mechanics.ts:1403-1462` | function at `mechanics.ts:1434` | — |
| tackles `mechanics.ts:1726+` | `tryTackles` at **1744**; ball radius `< 1.15` at **1757**; `pace·drive·0.16` at **~1825**; `helpClose && drive<0.45` +0.12 at **~1838** | 1.15 m, confirmed |
| `Player.ts` `TURN_RATE` integrator | `TURN_RATE = 6.5` at **17** (confirmed); integrator **306-333** | 6.5 rad/s |

The #45.2(a) note "turn glue at Match.ts:1334 already charges 0.48 s" refers to
the glue assignment now at **1447-1448**; the 0.48 s figure (π / 6.5) is
unchanged. No value moved; only line numbers drifted between the map's date and
HEAD. Reported per the iron rule, not resolved.

---

## 8. Pre-laid readings — the full sign space (#38.1)

* **(a) THIN TURN POPULATION.** Turn episodes fall below F-TURN (< 1,800). Per
  contract §8 this is a **finding, not a licence to lower the floor**: a
  too-rare turn regime means the honest offset's headline seat (the pivot) is
  not where bodies spend their carrying, and **the fork returns to the commander
  BEFORE T1 is drafted**. (The smoke says this is unlikely — 6.5/match — but the
  reading is pre-laid.)
* **(b) DEGENERATE / HEAVILY-CLAMPED EXPOSURE.** The far-side share stays at ~0
  under EVERY candidate in (iv) — the geometry cannot be moved by any tuck/lag
  the law admits. Then the honest offset cannot buy exposure asymmetry at v1
  scope, and that is worth knowing before T1 spends a budget: the fork returns
  to the commander with the sizing as evidence. (Distinct from (a): the turns
  exist, but no admissible law redistributes the ball meaningfully.)
* **(c) RICH, MOVABLE GEOMETRY.** Turn episodes clear F-TURN and at least one
  candidate moves the far-side share off ~0 with a match-seed CI excluding zero.
  Then T0 has delivered its purpose: T1 is drafted with measured constants and
  ex-ante power, and the priced-direction gate has a real effect to detect.
* **(d) ACTION-AXIS COLLAPSE (expected, benign).** The `action.type` axis is
  ~99% `Dribble` (§6). Read as confirmation of the map's bookkeeping finding,
  not a defect; the census leans on the speed/turn/pressure axes, which are not
  degenerate.
* **(e) KICK-RELEASE DELTA LARGE.** (iv)'s kick-origin displacement is big
  enough that T1's equivalence claim is at risk. Reported now as an ex-ante size
  so T1 pre-powers its sixth-threshold interval test rather than discovering it.

No re-cutting after sight: not the bands, not the 0.5 s post-window, not the
floors, not the candidates, not these readings (contract §8).

---

## 9. Registered non-claims

* **T0 prices nothing.** It measures geometry and populations; it makes no claim
  that carrying pays or costs (contract §9's estimand boundary).
* **T0 proposes no law and freezes no constant as final.** The §5 candidates are
  sizing brackets; T1 freezes its own magnitude/lag/noise law.
* **T0 cannot authorize T1.** The census result returns to the commander; a (c)
  reading is a licence for the commander to authorize T1's drafting, not for the
  executor to proceed.
* **No `src/**` and no flag.** `c6Carry` is not built at T0; the glue is the
  shipped glue throughout. Nothing ships (Road B).
* **The keeper path and C7's wind-up seat are untouched** (contract §9).
