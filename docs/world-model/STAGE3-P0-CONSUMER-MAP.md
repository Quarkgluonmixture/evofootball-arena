# Stage III P0 — Consumer map + instrument baselines

Status: **READ-ONLY, zero `src/**`.** Authorized as gap work by the user's
2026-07-27 slot ratification (STAGE3-POSITIONING-EYE §8) and queued as the
mainline next step by **commander ruling #34.4** (C4 v1 closed dormant, so no
live substrate change is pending and the population-law wait has expired by
its own logic).

Authority: [`STAGE3-POSITIONING-EYE.md`](STAGE3-POSITIONING-EYE.md) §5 P0
(the deliverable), §4-Q5 (the instruments exist because a correct field can
still oscillate), §6 (gate sources), §7 (stop rules) · PROBE-CONTRACTS §2 (the
E5-style *one number, two meanings* sweep runs BEFORE anything gates) · #20
(CI/cluster) · #22 (pattern geometry is censused, never asserted).

**Nothing here gates anything and nothing here is an experiment.** P0's job is
to make P1 possible: know who consumes a station, know what the incumbent's
shape actually looks like, and define the instruments carefully enough that
P2/P3 can gate on them without inheriting an ambiguous number.

---

## 1. The consumer map

### 1.1 ⭐⭐⭐ The headline: there is no station DECISION. There is a station FUNCTION, evaluated every frame.

`executeAction`'s own docstring (`actionExecutor.ts:33-37`) is the finding:

> *"Dynamic targets — moving balls, moving opponents, sliding formation spots
> — are recomputed here each frame so actions never chase stale data."*

Every station producer below is a **pure function of live world state**, called
inside `executeAction`, which runs for every player **every tick** (60 Hz,
`Match.ts:817-819`). No station is stored, none is committed to, and none has
a cadence of its own.

**What DOES run on a cadence is the choice of station FAMILY, one level up:**

| clock | period | what it decides | code |
| --- | --- | --- | --- |
| `AI_INTERVAL` | **0.15 s** nominal | the player's ACTION — hence which station function owns him | `constants.ts:342`, `Match.ts:786-796` |
| `TEAM_AI_INTERVAL` | **0.4 s** | runner / arriver / overlapper / chaser licences and mark assignments — hence which branch inside `MakeRun`/`MarkOpponent` applies | `constants.ts:344`, `Match.ts:766-774` |
| per-event overrides | 0.05–0.30 s | reception settle, shooting range, restart taker, kickoff | `Match.ts:1255`, `1259`, `1301`, `1806`, `1995`, `2243`, `2668` |
| kickoff stagger | `(index+1)·0.15/6` | de-phases the six bodies so they never all think on the same tick | `Match.ts:651` |

⚠️ **This matters for Q2 and Q5 directly.** §4-Q5 asks that the eye's
station decisions "run at the measured station cadence with COMMITMENT". There
is no incumbent station cadence to measure — the incumbent recomputes at 60 Hz
and is *implicitly* stable only because its inputs move slowly. So P1's
commitment window **W is a new quantity, not an inherited one**, and the
honest empirical anchors P0 can supply are (a) the 0.15 s action clock, (b) the
0.4 s licence clock, and (c) the measured **persistence of the incumbent's own
target** — how far the station point actually travels per second, and how long
a body stays inside one station family. §3's instruments measure (c).

### 1.2 The producers

| producer | signature | what it is | code |
| --- | --- | --- | --- |
| `formationSpot` | `(p, team, ball, hasBall, opp?)` | the entry point; delegates to `emergentStation` whenever `emergentPosOn()` (**default ON**), else the legacy fixed tables | `formations.ts:129-136` |
| `emergentStation` | same | **the incumbent any eye must beat.** Role depth/lane fractions + ball slide + `formationDepth` + `pressIntensity` step-up + `MODE_SHIFT` + rest-defence clamp + width multiplier + ball-side translate + opponent-line convergence ×0.14 + pairwise repulsion inside 9 m scaled `2.6·(1−0.7·threat)` + box relief + goal-ward collapse | `formations.ts:238-348` |
| `supportSpot` | `(p, team, ball)` | ball-relative, **always AHEAD** (`aheadBias` 0.35 / 0.75), radius `10 + supportDistance·8`, lateral pull toward the player's own `formationSpot` lane capped at 0.9·radius | `formations.ts:546-561` |
| `runTarget` | `(p, team, opponents)` | past the last defender's shoulder, `clamp(max(line+7, myX+5), myX+3, HALF_L−9)`, narrowing `y·0.6` (poacher: post channel ±3.5) | `formations.ts:490-504` |
| mark stance | inline | goal-side ∧ ball-side blend, contain standoff, trap-bias pull back toward `formationSpot`, marker reaction lag via `markAnchor` | `actionExecutor.ts:174-273` |
| the licensed branches | inline | corner crash spots + meet re-route, the arriver's 16 m arc, the overlap lane, and (dormant) C4 T2's cross meet point | `actionExecutor.ts:294-390` |

### 1.3 The consumers, and when each reads

| # | consumer | reads | when | cadence |
| --- | --- | --- | --- | --- |
| 1 | `executeAction` `MoveToFormationSpot` / `HoldPosition` | `formationSpot` | the body is holding shape | **every tick** |
| 2 | `executeAction` `SupportBallCarrier` | `supportSpot` (which itself calls `formationSpot`) | we have the ball, he is not the carrier | **every tick** |
| 3 | `executeAction` `MakeRun` | `runTarget`, or a licensed branch | he is a runner / arriver / overlapper / crasher | **every tick** |
| 4 | `executeAction` `MarkOpponent` | the mark stance, and `formationSpot` again for the trap-bias pull | he has a mark | **every tick** |
| 5 | `executeAction`, post-switch | the **onside clamp** rewrites ANY of the above while a teammate carries | always | every tick |
| 6 | `executeAction`, post-switch | the **barred-box clamp** rewrites any target during a goal kick / keeper hold | always | every tick |
| 7 | `assignMarks` (TeamBrain) | `formationSpot(hasBall=false)` as each free defender's ZONE centre, zonal scheme only | zonal marking | **0.4 s** |
| 8 | `shapeReady` | `formationSpot(hasBall=true)` for ≥3 settled outfielders | keeper distribution gate, goal-kick restart gate | on demand |
| 9 | `Match.resetForKickoff` | `formationSpot` | kickoff placement | per kickoff |
| 10 | `RenderStateAdapter` | `formationSpot` | the pre-match / debug shape overlay | per render frame |

⭐ **Consumers 5–8 are the ones a naive replacement breaks.** The onside clamp
(#5) silently caps every station beyond the offside line — an eye that prices
stations beyond the line will find its choice rewritten rather than penalised,
which is a *different* thing from revert 2's blast and must not be confused
with it. The zonal zone centre (#7) means replacing `formationSpot` also
**re-draws the marking lattice**, a second-order effect entirely outside the
positioning seat. And `shapeReady` (#8) means the station function is a
**restart gate**: a shape the eye never settles into stalls goal kicks.

### 1.4 The one defect §3.3 named, confirmed

`supportSpot` places every supporter at `ball.x + attackDir·radius·aheadBias`
with `aheadBias ∈ {0.35, 0.75}` — both **positive**. Drop-to-receive is
geometrically unreachable, exactly as the contract says. Note the coupling the
contract did not state: `supportSpot` **calls `formationSpot` internally**
(`formations.ts:554`) for its lateral lane, so it is a consumer of the
incumbent as well as a sibling of it. Replacing the station changes support
geometry whether or not P1 intends to.

---

## 2. The instruments — DEFINED before measurement

Six, from §5 P0. Every one is a **distribution over sampled ticks**, clustered
by match seed (#20), reported with CIs and never as a bare mean.

Sampling: every tick would be 60 Hz × 6 bodies × 2 teams; the instruments are
sampled every **10th tick (6 Hz)**, declared here rather than chosen later, and
only while `phase === 'playing'`. Keepers are excluded from every body-based
instrument (they have their own clamp and are not a positioning seat).

```text
I1  STATION-FAMILY DWELL      how long a body stays inside one station family
I2  TARGET DRIFT              how far his station target moves, per second
I3  PAIRWISE SPACING          distribution of outfield teammate-teammate distance
I4  BALL CONVERGENCE          bodies within 5 m / 10 m of the ball, per side
I5  REST-DEFENCE OCCUPANCY    own outfielders in our defensive third, in possession
I6  DUPLICATE RUNS            two licensed runners whose targets are within 4 m
I7  ATTACK/DEFENCE SHAPE      centroid depth, spreadX, spreadY, per face, and the delta
```

(I1 and I2 are the split of §5's single "station-switch rate" — see §2.1.)

## 2.1 The *one number, two meanings* sweep (PROBE-CONTRACTS §2)

Run over every instrument BEFORE any of them is measured, and it caught three:

| instrument | the two meanings | ruling |
| --- | --- | --- |
| **station-switch rate** (§5's name) | (a) the body changed which station FAMILY owns him — a decision-level event on the 0.15 s clock; (b) his station POINT jumped — a geometry-level event that happens continuously at 60 Hz with no decision at all | ⛔ **SPLIT into I1 and I2.** These have different units, different clocks and different failure modes: an eye that flickers between families and an eye whose point jitters are separate diseases, and a single "switch rate" would report them as one. This is the E5a window defect exactly. |
| **ball convergence** (乱抢) | (a) OUR bodies collapsing onto the ball — the shape failure the user hates; (b) BOTH teams' bodies near the ball — which also counts a legitimate contested duel, and rises when the football is *good* | ⛔ **SPLIT by side.** I4 reports own-side and opponent-side separately and never sums them. A pooled count would make a healthy 50/50 look like a scramble. |
| **rest-defence occupancy** | (a) any own outfielder in our defensive third; (b) the DESIGNATED rest defender (index 1, the slot `emergentStation` clamps at `x ≤ −8 − coverBias·8`) being there | ⛔ **BOTH reported, never merged.** (a) can be satisfied by a beaten winger jogging home, which is the opposite of rest defence. (b) is the structural claim. |
| pairwise spacing | one meaning (a distance distribution) — but a MEAN hides the failure | ✅ kept, reported as **p10 / median / p90 and the share under 4 m**: piling up is a left-tail event and a mean cannot see it. |
| duplicate runs | (a) two bodies running to nearby TARGETS; (b) two bodies physically near each other while running | ✅ **(a) only**, stated: the disease is two bodies *aimed* at the same place. (b) is I3's job. |
| shape delta | one meaning, but the FACE must be defined by possession, not by `team.mode` | ✅ kept, defined off `match.possessionSide` — `mode` is a hand table and would make the instrument circular with the thing Stage III wants to retire. |

**Registered non-instrument**: no scalar "positioning score" is defined here or
anywhere later (PROBE-CONTRACTS §3's no-single-VisionScore law).

## 2.2 Exact definitions

```text
I1  For each off-ball outfielder, the station FAMILY is:
      FORMATION (MoveToFormationSpot | HoldPosition)
      SUPPORT   (SupportBallCarrier)
      RUN       (MakeRun)
      MARK      (MarkOpponent)
      BALL      (ChaseBall | ReceivePass | InterceptPass)   -- not a station,
                excluded from I1/I2 but counted so the denominator is honest
    DWELL = the length in seconds of a maximal run of consecutive sampled
    ticks with the same family, closed by a change or by the ball being won.
    Reported: median, p90, and the per-minute family-change count.

I2  DRIFT = |station target at this sample - station target at the previous
    sample| / 0.1667 s, in m/s, for bodies who stayed in the same family
    across the pair (a family change is I1's event, not a drift).
    Reported: median, p90, and the share of samples above 4 m/s -- the speed a
    body cannot actually track, so a target moving faster than that is a
    target he is chasing rather than standing on.

I3  All unordered pairs of own outfielders, both teams pooled by side.
    Reported: p10, median, p90, share < 4 m.

I4  Count of own outfielders within 5 m and within 10 m of the ball, and the
    same for the opponent, reported SEPARATELY (never summed).

I5  (a) own outfielders with localX < -HALF_L/3, while possessionSide is ours;
    (b) the share of those ticks where the index-1 slot is one of them.

I6  Among bodies whose family is RUN, the share of sampled ticks with at least
    one pair of run targets within 4 m of each other.

I7  Per side per tick: centroid localX, spreadX (sd), spreadY (sd) over own
    outfielders, split by whether possession is ours. DELTA = the in-possession
    value minus the out-of-possession value, per match, then pooled.
```

Every threshold above (4 m, 5 m, 10 m, 4 m/s, `HALF_L/3`) is a **reporting
bucket**, not a gate. P2/P3 freeze gates against these measured distributions;
none is frozen here, because a baseline that pre-commits to its own tolerance
is the #19 error in advance.

---

## 3. Baselines

Measured 2026-07-27, `scripts/probes/stage3-p0-instruments.ts`, read-only.
**300 random-genome matches**, fresh block 930,000, **389,865 samples at
6 Hz**, twice byte-identical, SHA `dc74fb02…813f`. Incumbent = `emergentStation`
(default ON). Cluster unit = the match seed; CIs are 2,000-resample cluster
bootstraps.

Random genomes on purpose: this is the population the eye will actually live
in, so the baselines carry the spread the P2/P3 gates will have to clear, not
a neutral-genome point.

### I1 — station-family dwell

```text
dwell       p10 0.167 s   median 0.667 s   p90 3.833 s   mean 1.466 s
family changes   43.98 / body / minute   CI [43.26, 44.70]   = one per 1.36 s
family share  MARK 32.11%  FORMATION 29.04%  BALL 19.35%
              SUPPORT 9.06%  RUN 7.21%  ONBALL 2.37%  OTHER 0.86%
```

**Station families own 77.4% of outfield body-ticks**; the ball-directed
actions own 19.4%. The median spell is **4.4× the 0.15 s action clock**, so the
action clock is not what flips families — the choice is genuinely re-affirmed
most ticks. But **p10 is one single sample**: a tenth of all station spells
last ≤0.167 s. That flicker tail is the incumbent's, before any eye exists.

### I2 — ⭐⭐⭐ target drift: the incumbent has no commitment, and a quarter of its motion is untrackable

```text
drift   p10 0.09   median 2.571   p90 6.244   mean 4.415   p99 54.11   m/s
        share above 4 m/s (faster than a body can track):  27.35%
```

**More than a quarter of the time the station point is moving faster than the
player chasing it**, and the p99 is a 9 m jump inside one 0.167 s sample. A
structural cause is visible in the signature rather than inferred: `hasBall` is
an *input* to `formationSpot`, so a possession flip re-evaluates the entire
block in one tick — the incumbent's shape is a step function of possession,
not a trajectory.

This is the number §4-Q5's commitment window exists for, and it says the
incumbent's implicit stability is an illusion produced by slow inputs, not by
any commitment. **P1's W has an empirical anchor now**: the incumbent's own
mean dwell is 1.47 s and its median is 0.67 s, bracketed by the 0.15 s action
clock below and the 0.4 s licence clock in between.

### I3 — pairwise spacing

```text
p10 4.188   median 12.955   p90 26.402   mean 14.402   m
share under 4 m:  9.40%
```

The hand repulsion (9 m radius, `2.6·(1−0.7·threat)`) leaves about **one
teammate pair in eleven inside 4 m**. That is the left tail a mean would hide,
and it is the number an eye that prices crowding as a table row (§4-Q4) has to
beat.

### I4 — ball convergence, and the split paid for itself

```text
own within  5 m  0.956  CI [0.940, 0.973]      opp within  5 m  0.952  CI [0.937, 0.969]
own within 10 m  2.204  CI [2.183, 2.227]      opp within 10 m  2.197  CI [2.175, 2.218]
```

⭐ **The two sides are indistinguishable.** Pooled, this instrument would have
read *"1.9 bodies within 5 m of the ball"* and been filed as the 乱抢 residual;
split, it says both teams commit **44% of their outfield inside 10 m** and
neither is scrambling more than the other. Whatever E4 round 2 saw, it is not
an asymmetry — which changes what P2/P3 can claim to have fixed. §2.1's sweep
earned its keep here.

### I5 — rest defence

```text
own outfielders in our defensive third, in possession   1.328  CI [1.288, 1.368]
the DESIGNATED slot (index 1) is one of them            65.82% CI [64.42, 67.16]
```

The clamp at `x ≤ −8 − coverBias·8` exists to keep one specific body home, and
**a third of the time he is not the body that is home**. Merging these two
readings — as §2.1 refused to — would have reported "rest defence occupied
1.33 bodies" and hidden that.

### I6 — ⭐⭐ duplicate runs are the NORM

```text
share of multi-runner ticks with two run targets within 4 m:  54.71%  CI [52.96, 56.37]
multi-runner ticks per match  276.3      licensed body-ticks excluded  120.9
```

**Over half.** And it is structural, not accidental: `runTarget` is
`clamp(max(line + 7, myX + 5), myX + 3, HALF_L − 9)` with `y → y·0.6`, so two
runners anywhere near each other are mapped to the same shoulder of the same
line and then narrowed toward the same lane. The survey's "duplicate runs"
warning (§4-Q5) is not a risk the eye might introduce — it is the incumbent's
steady state.

### I7 — attack/defence shape delta: about one metre

```text
                    in possession        out of possession      delta
centroid localX     −0.774               −1.760                 +0.987  CI [0.507, 1.446]
spreadX              8.241                6.869                 +1.372  CI [1.315, 1.428]
spreadY              6.441                5.701                 +0.740  CI [0.705, 0.776]
```

⭐ VISION's 2026-07-27 anchor makes the difference between the two faces an
acceptance criterion. **The incumbent's difference is one metre of depth**, a
1.4 m wider block and 0.7 m more lateral spread. The shape does change with
possession, resolvedly — and by about a stride. That is the bar Stage III's
"attack and defence shapes BOTH emergent, their difference itself measured"
has to clear, and it is a low one.

## 4. What P0 hands to P1

1. **W has anchors, not a value**: action clock 0.15 s, licence clock 0.4 s,
   incumbent station-family dwell median 0.67 s / mean 1.47 s. P1 derives W
   from these and states which it chose and why; §1.1 means it cannot inherit
   a cadence, because there isn't one.
2. **H_station's floor argument is now measurable**: the incumbent's target
   drifts 2.57 m/s at the median, so a station a body is sent to has typically
   moved several metres before he arrives. Any horizon shorter than the travel
   time prices a station he never occupied.
3. **The harness gate has a second requirement §5-P1 did not state.** Forcing
   the incumbent target must reproduce the unforked match bit-identically —
   but `formationSpot` is also read by the zonal marking lattice (#7), the
   restart `shapeReady` gate (#8) and `supportSpot`'s own lane (§1.4). A fork
   that forces only the executor's read is **not** the same intervention as one
   that forces the function. P1 must pre-register which.
4. **Three baselines are already failure-shaped** and should be watched as
   *improvement* opportunities rather than only as canaries: 27.35% untrackable
   drift, 54.71% duplicate runs, and a 1 m shape delta.
5. **One residual is re-framed before P1 starts**: I4 says the scramble is
   symmetric. An eye that reduces own-side convergence without touching the
   opponent's has changed one team's football, not the game's — and P3's
   H-SCRAMBLE hypothesis should be posed against the split instrument, not a
   pooled one.

## 5. Honest limits

* Random genomes across 300 matches: a population, not a controlled cell. Any
  P2/P3 A/B must be paired same-seed against **this** staging or re-baseline.
* 6 Hz sampling: events shorter than 0.167 s are invisible, which floors I1's
  p10 at exactly one sample. Reported as such rather than smoothed.
* `MARK` is excluded from I2 by construction (§2.2): its target tracks an
  opponent, so its drift would measure the opponent's motion.
* I6 excludes the licensed branches (arriver / overlapper / live crasher), who
  are routed by their own code and not by `runTarget` — 120.9 body-ticks per
  match, reported so the exclusion is visible.
* Everything here is the incumbent under the **current** substrate HEAD. The
  population law (#26.5) applies: if C4/C5/C6 ever land live, these baselines
  are stale and P1's tables must be re-censused at the HEAD they deploy on.
