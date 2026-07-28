# C6 T1 — The Honest Offset

Status: **PRE-REGISTERED 2026-07-28 night, FROZEN BEFORE IMPLEMENTATION.**
Nothing is built. Nothing has been run. No `src/**` changed; no flag exists yet;
no probe script for T1 exists yet. This document freezes the law, its constants,
the seam, the gates, the staging and the full sign-space readings **before** a
single line of the honest offset is written — the P1/P2 two-commit discipline
(#45.2(b): executor drafts → commander review → authorized implementation →
authorized run → ruling). **This freeze returns to the commander for review;
implementation and the run each need their own authorization** (#47.5, last
sentence).

Authority chain: **contract [`C6-EMBODIED-CARRYING.md`](C6-EMBODIED-CARRYING.md)
§6-T1** (this stage's scope) · §4 (the law: magnitude/lag/noise; §4.2 what it
must NEVER read) · §5 invariants I1–I9 · §8 stop rules — all bind verbatim ·
**ruling #47.5** (T1 drafting authorized under seven named constraints (i)–(vii))
· #47.2/#47.3/#47.4 (the banked T0 sizing facts this freeze derives from) ·
#46.3 (fidelity classes key on SPEED, not action label) · #46.4 (pressured
carrying is the common case) · #24 (floors derived from T0's measured
populations, attainable on the deployed population) · #32.1 (no coupon-collector
max-statistic gate form) · #38.1 (standing exception classes + full sign space)
· #20 (CI semantics, cluster unit = match seed) · #26.5 (population law: T1
states its HEAD) · Road B (nothing ships; `c6Carry` null/off in every production
path through the whole stage).

Data this freeze is derived from (committed, SHA'd, #24):
[`C6-T0-CARRY-GEOMETRY.md`](C6-T0-CARRY-GEOMETRY.md) §5-result and
[`data/c6-t0-carry-geometry.json`](data/c6-t0-carry-geometry.json)
(output SHA `aeaed17b…0bc57`, table SHA `bb5219e0…abb0e`). Every band, floor and
expected effect below cites its T0 number.

Code truth verified at current HEAD `76fc927`: the glue assignment is
**`Match.ts:1447–1450`**; the de-glue branch **1412–1432**; the keeper/GK-hold
carry (`0.3`) at **1443–1446**; `TURN_RATE = 6.5` (`Player.ts:17`); `DT = 1/60`
(`constants.ts:55`); the ball-keyed tackle radius `1.15` (`mechanics.ts:1757`).
No value moved from T0's §7 table; only that T0 reported the glue block as
1443–1450 — at this HEAD the **outfield** assignment T1 forks is 1447–1450 and
the GK `0.3` selector is 1443–1446. Reported, not resolved.

---

## §LAW — FROZEN WITH CONSTANTS

The law starts from **candidate B's SHAPE** — tuck + speed-growth + lag — the
one shape T0 measured to move the geometry (#47.2: A tuck-only and C lag-only
each drove far-side to ~0; only B, both terms live, lifted it +1.425 pp). Per
#47.5(ii) B is the **starting bracket**; the constants below are **T1's own,
frozen here**, with **dribbling scaling the tuck AND the lag AND the noise**
(#47.5(ii); contract §4.1). The law reads **only** the body's own `|v|`, its
heading sweep rate `|ω|`, and its own `dribbling` attribute — **no opponents, no
percepts, no ball-context** (invariant I2, contract §4.2).

### The population dribbling range (the centering anchor)

`randomPlayer` (`playerGenome.ts:79`) draws every attribute `rng.range(0.1, 0.7)`
and `dribbling` carries **no** role bias (`ROLE_BIAS` lists GK/DF/MF/WG/ST — none
is `dribbling`). So the founding population's dribbling is ~Uniform[0.1, 0.7],
**mean d̄ = 0.40**, spanning [0.1, 0.7] (evolution can drift within `clamp01`
[0, 1]). This is the "dribbling attribute range in the population" #47.5(ii)
names, and it is the anchor for a **mean-preserving** design: every dribbling
term below is centered on **d̄ = 0.40** so that the population-mean body
reproduces candidate B **exactly**, and T0's measured B effects (+1.425 pp
far-side, +19.1% eligibility, kick p50 0.346 / p90 0.727 m) transfer directly as
the **population-mean expectations** for T1's gates. Dribbling then spreads
bodies around that mean — skilled tuck tighter and wobble less; clumsy expose
more — which is exactly the emergent consequence contract §4.3.1 intends.

### The magnitude law (carryLen)

```text
carryLen(|v|, |ω|, drb) =
    clamp( 0.55 + 0.15·(|v| / 7.0) − 0.30·(|ω| / 6.5)·tuckGain(drb),  0.30, 1.40 )

    tuckGain(drb) = 1 + 1.0·(drb − 0.40)        (mean-preserving; drb centered on d̄)
```

* **0.55, 0.15, 0.30, V_REF = 7.0, FLOOR 0.30, CAP 1.40** — candidate B
  **verbatim** (T0 §5, `c6-t0-carry-geometry.ts:151–157`). These are the
  constants T0's counterfactual arithmetic measured to lift far-side +1.425 pp
  [+1.328, +1.525] and eligibility to 212,727 (+19.1%). 7.0 = the role
  top-speed reference (`TOP_SPEED_REF`); 6.5 = `TURN_RATE` (`Player.ts:17`).
* **tuckGain(drb) = 1 + κ·(drb − 0.40), κ = 1.0** — the dribbling scaling of the
  tuck (contract §4.1 "dribbling scaling how tight the tuck is"). At **drb = 0.40
  it is exactly 1** → the magnitude law collapses to candidate B → B's measured
  effects are the population-mean expectations. Across the founding range [0.1,
  0.7] the tuck term spans **0.70×–1.30×** of B (skilled tuck 30% tighter, clumsy
  30% looser); at the `clamp01` extremes drb ∈ {0, 1} it spans 0.60×–1.60×,
  **always positive** — the tuck never inverts. κ = 1.0 is chosen so the spread
  is a bounded, sign-preserving ±30% of B across the bulk of the population; it is
  a spread parameter, not a headline constant (the headline is B, at the mean).

Behaviour: the ball runs ahead at pace (`+0.15·|v|/7`), tucks toward the feet
under turn (`−0.30·|ω|/6.5·tuckGain`), skilled tuck tighter. It is continuous
with the push doctrine's `open`-priced knock (contract §4.1).

### The lag law (τ)

The ball does not teleport around the 0.85 m arc; it **trails** the heading
sweep. The offset direction reads the body's own heading history τ seconds back:

```text
θ_ball(t) = θ_heading(t − τ(drb))

    τ(drb) = clamp( 0.18 + 0.10·(drb − 0.40),  0.12, 0.24 )   seconds
           = round(τ · 60) ticks       (DT = 1/60)  →  drb 0.40 → 11 ticks
```

* **0.18 s** — candidate B's lag **verbatim** (T0 §5; `TAU_B_TICKS = round(0.18/DT)
  = 11`). At **drb = 0.40 τ = 0.18 s = 11 ticks**, matching B exactly.
* **slope +0.10 s per unit dribbling, clamped to [0.12, 0.24] s (7–14 ticks)** —
  the technique pricing of the lag (contract §4.1 "a technique-priced time
  constant"). The bounds are derived to keep **every body inside B's measured
  "combined" regime**: never at candidate C's degenerate **0.30 s** (T0: lag-only
  → far-side 0) and never near candidate A's **0 s** (T0: tuck-only → far-side
  0). Both far-side-dead shapes are excluded by construction, so no body
  degenerates out of the movable regime T0 certified. τ centered on B at d̄, so
  the mean-preserving property holds for the lag term too.
* **Skill direction (declared, and flagged for the commander's eye):** T0
  measured B at a single τ = 0.18 s; the SIGN of the far-side-by-dribbling
  gradient *through the lag term* is **not a T0-measured fact**. The frozen
  choice makes τ **increase modestly** with dribbling (skilled sustain the
  protective trail longer through a pivot — consistent with §4.3.1's "skilled
  present a farther-side ball"). This is the one place the law's dribbling
  direction is a **T1 design assumption**, not a T0 measurement. Accordingly the
  **far-side-by-dribbling gradient is REPORTED, never hard-gated on its sign**
  (the HARD priced-direction gates below bind on the POPULATION MEAN, which
  transfers from B by mean-preservation regardless of the lag-skill sign). See
  §PRE-LAID READINGS and the report-back.

### The noise law (σ)

Gaussian, gated on turn intensity, scaled down by dribbling (contract §4.1
"clumsy turners wobble the ball; clean ones don't"):

```text
ball.pos += keyedGaussian2D(gid, simTick) · σ(|ω|, drb)

    σ(|ω|, drb) = 0.06 · (|ω| / 6.5) · (1 − 0.8·drb)     metres
```

* **Gated on turn intensity:** `σ ∝ |ω|/TURN_RATE` → **exactly 0 when straight**
  (no wobble carrying in a straight line), rising to the amplitude at the
  physical cap. Contract §4.1 "gated on turn intensity."
* **Scaled down by dribbling:** `(1 − 0.8·drb)` → at drb = 0 full σ; at drb = 1
  → 0.2·σ (skilled nearly clean); at d̄ = 0.40 → 0.68·σ. Contract §4.1.
* **Amplitude 0.06 m** — sized to be a **wobble, not a driver**. At a hard turn
  (|ω| = 3.25 rad/s = ½ cap) the mean body's σ = 0.06·0.5·0.68 = **0.020 m**; the
  worst case (clumsy body at the physical cap) is 0.06 m. Both are ≪ the ~0.1–0.3
  m radial swing the tuck produces and ≪ the 1.15 m tackle radius, so the noise
  perturbs exposure without manufacturing it. This is why T0 **excluded** noise
  from its sizing arithmetic (§5: zero-mean, it does not move the central far-side
  distribution) — and why the noise is **zero-mean here**: it does not shift the
  population-mean far-side/eligibility expectations, only inflates their variance
  (folded into the power at §STAGING).
* **Determinism (I2 / §4.2 compliance + X-family):** the gaussian is a pure
  function of `(gid, simTick)` — the **E3R2 keyed-noise convention** (#13.3):
  it draws from a hash key, **never from `match.rng`**, so it perturbs no other
  consumer's stream, is bit-identical twice-run (X-DET), and is trivially absent
  on the OFF path. The key is a deterministic PRNG seed, **not** a read of the
  game state around the body — the law still reads only `|v|`, `|ω|`, `drb`
  (I2 preserved).

**What the law never reads (I2, contract §4.2, restated as a freeze):** no
opponent positions, no percepts, no ball-context. An offset that swung toward
the far side *of a defender* would be the omniscient auto-shield the cross-AI
audit caught in ShieldHold (#36) in physics costume. Exposure asymmetry must
**emerge**: turning away from a defender puts the lagged, tucked ball on the far
side by geometry, and the existing ball-keyed attack (I7) does the rest.

---

## §SEAM — spec only, no code

* **Flag `c6Carry`, default OFF** (invariant I4). Lives as `Match` config, null
  in every production path (Road B; #47.5 nothing ships). A default-off test pins
  it; the fingerprint is unchanged.
* **The single fork point** is the **outfield glue assignment, `Match.ts:1447–1450`**
  (current HEAD `76fc927`):

  ```text
  ball.pos.x = ball.owner.pos.x + ball.owner.heading.x * carry;   // 1447
  ball.pos.y = ball.owner.pos.y + ball.owner.heading.y * carry;   // 1448
  ball.vel.x = ball.owner.vel.x;                                   // 1449
  ball.vel.y = ball.owner.vel.y;                                   // 1450
  ```

  This line is reached only for an **owned, playing, non-GK-hold** carrier that
  did **not** de-glue (the de-glue returns early at 1432). At this seat `carry`
  is `0.85` for the outfield case and `0.3` for the GK-hold/distributing case
  (selector 1443–1446).
* **The fork:** when `c6Carry` is ON **and** the carry is the outfield `0.85`
  case (NOT gkHold, NOT gkDistributing), replace the rigid
  `owner.pos + heading·0.85` with `owner.pos + dir(θ_ball)·carryLen + noise` per
  §LAW. When OFF, or when the carry is the GK `0.3` case, the code is **exactly
  as shipped**.
* **OFF is bit-identical:** on the OFF path the offset is
  `heading·0.85` **exactly** (`carry === 0.85`), byte-for-byte the shipped
  assignment — no rng draw added, no reordering. `offset === heading*0.85`
  exactly (I4).
* **The de-glue branch (1412–1432) and the keeper/GK-hold path (`0.3`,
  1443–1446) are UNTOUCHED** (I5/I6): `TURN_RATE`, heading semantics, the two
  learned de-glue corrections (touchline guard, knock-along-travel), and the GK
  carry all stay as they are. The honest offset governs only the outfield glued
  ball.
* **State the law needs (spec):** a per-body heading ring buffer of ≥ 14 ticks
  (the τ cap), so `θ_heading(t − τ)` is a lookback on the body's own recorded
  heading — the live analogue of T0's recorded-heading arithmetic. This is
  probe/engine bookkeeping written by the seam, never read as game state by the
  law.

---

## §GATES — all frozen ex ante; every floor derived from T0 (#24); no
max-statistic (#32.1)

Cluster unit for every CI = **match seed** (#20); a shift is *resolved* only when
its match-seed cluster-bootstrap CI excludes its reference; a null is reported as
such, never re-cut (contract §8).

### X-family (OFF identity, determinism, single seam)

| gate | predicate |
| --- | --- |
| **X-FP** | league fingerprint identical to the frozen baseline `57b0bdab…c673` with `c6Carry` OFF (nothing armed in production) |
| **X-OFF-IDENT** | with `c6Carry` OFF, world signatures **byte-identical** to pre-change HEAD across **3 league seeds × 2 seasons** (I4) |
| **X-SEAM** | a test asserts `c6Carry` is read in **exactly one place** (the 1447–1450 fork), is null on a fresh `Match` and a `League` fixture, and does **not** gate the de-glue branch or the GK-hold path (single-fork-point test) |
| **X-DET** | two `runExperiment()` invocations produce **byte-identical** output JSON; the table SHA is emitted and quoted in the run result |

### FIDELITY (ON ticks) — unexplained exactly 0, classes keyed on SPEED

On every ON tick that reaches the fork, the **applied offset equals the §LAW
value to 1e-9** and **unexplained is exactly 0**. Every EXCLUDED owned tick falls
in exactly one standing exception class (#38.1), and the classes key on
**SPEED, not the `Dribble` action label** (#47.5(iii) / #46.3 — the label is
near-vacuous, 98.89% Dribble; the turn's real excluder is the speed gate):

```text
E-DEGLUE     the de-glue branch fired (|v| > 2.5 AND nearOpp > 4.2 m) — SPEED-
             and-space keyed, Match.ts:1412-1432; the ball is already free
E-GKHOLD     owner.gkHoldTimer > 0 or gkDistributing (carry = 0.3, hands)
E-GK         owner.role === 'GK'
E-PAUSED     phase ≠ 'playing' (kickoff, halftime, stoppage, restart wait) —
             the standing paused-world class (#38.1; #36.1)
E-RESTART    owner is the restart taker (restartKickGid === owner.gid)
E-SENTOFF    owner.sentOff
E-NOOWNER    ball has no owner (in flight / loose)
E-ENDED      the match ended
E-TRANSITION the ownership/same-player re-strike artefact (the F2 precedent,
             #32.1: a per-record max-statistic is forbidden; this NAMED world
             event is classed, not counted as an arithmetic failure)
```

Per #32.1 this is a **per-record fidelity check with named exception classes**,
never a coupon-collector max-statistic over the tick stream.

### ZERO-LOOSE — exact (I3)

**Zero new loose balls.** The glue is kept: the honest offset moves where the
owned ball sits, never whether it is owned. Loose-ball events on the ON forks,
paired same-seed against OFF, must be **exactly equal** (#47.5(iv): "zero new
loose balls asserted"). Any inequality ⇒ FAIL, stop at the commander.

### PRICED DIRECTION — TWO AXES, never conflated (#47.5(i))

Protection-by-distance (eligibility) and protection-by-side (far-side) are
**separate axes**; #47.5(i) forbids conflating them.

**Axis 1 — tackle-eligibility rate on turn episodes RISES.**
T0 baseline eligible ticks **178,590**; candidate B recompute **212,727 = +19.1%**
(#47.3). Because the honest offset holds the ball nearer chasing defenders
mid-turn, honest carrying is a **cost to carriers in eligibility** (#47.3 — real,
not a defect).

* **HARD gate:** the tackle-eligibility rate on turn episodes rises — match-seed
  cluster-bootstrap CI **lower bound > 0** (resolved UP).
* **Expected magnitude, with its ex-ante tolerance (derived, justified):** the
  point estimate is expected near **+19.1%**, inside a pre-registered band of
  **[+9.5%, +28.6%]** = **½× to 1.5×** the T0 recompute. Justification: T0's
  +19.1% is a **bodies-frozen counterfactual recompute on recorded
  trajectories**; T1's live forks let bodies react, so the live shift may damp
  (defenders adjust away) or amplify (carriers held nearer for longer) relative
  to the recompute. With no measured sign for that live gap, the tolerance is
  **symmetric in ratio** around the recompute — the ½×/1.5× bracket is the
  standing "fork-vs-live survival" allowance this programme has used for
  recompute-to-live transfer (cf. P2-A's "≥ 44% of in-sample survives", the
  half-headroom convention). **The band is an INTERPRETATION bracket, not the
  HARD gate:** landing inside it is the design case; landing outside it (but
  still resolved UP) is reading (C), returned to the commander, not re-cut.

**Axis 2 — far-side share among eligible RISES, ~+1.4 pp bracket.**
T0 baseline far-side **0.048%** → candidate B recompute **1.473% = +1.425 pp**,
CI **[+1.328, +1.525]** (#47.2). This is protection-by-side (the technique-priced
GAIN, #47.3).

* **HARD gate:** the far-side share among eligible ticks on the ON forks rises
  vs OFF (paired same-seed), match-seed cluster-bootstrap CI **excluding zero**
  (UP), #20 semantics.
* **Expected magnitude:** **~+1.4 pp**; T0's **[+1.328, +1.525] pp** is the
  counterfactual bracket (recompute; live may differ). The CI-excludes-zero form
  is the gate; the comparison to +1.425 pp is REPORTED.

### KICK-BOUND (#47.4) — REPORTED, bounded, not equivalence-to-zero

Kick-origin displacement (kicks originate at the ball, so a moved ball shifts the
kick origin) is **REPORTED** with a pre-registered bound sized from T0's B shape:
**p50 ≤ 0.346 m, p90 ≤ 0.727 m** (#47.4; T0 §5-result). Per #47.4 this is a
**priced, reported bound — NOT an equivalence-to-zero claim** (the commander's §4.3
"centimetres" premise was corrected by measurement; the displacement is
decimetre-scale, an order of magnitude larger). **Exceeding the bound means a
READING, not a re-cut:** the live honest ball moved the kick origin more than
T0's arithmetic predicted (a finding about live-vs-recorded trajectories), which
returns to the commander; the law's constants do NOT move, and the game-level
consequence of the displacement is **T2's §2 band to price**, not T1's.

> **Contract-vs-ruling note, reported not resolved:** contract §4.3.2 and
> §6-T1 call the kick-release check a **sixth-threshold equivalence claim** ("no
> change" carrying its own interval test). Ruling **#47.4 supersedes** that: it
> reframes the check as a **reported, T0-sized bound**, because T0 measured the
> displacement at decimetre scale, not "by centimetres". This freeze follows
> #47.4 (later, authoritative). Flagged for the commander.

---

## §STAGING — frozen

* **Instrument:** **fork-and-force paired same-seed turn episodes** (contract
  §6-T1). At each sampled turn episode (heading sweep ≥ 90°, T0's definition), the
  pre-step world is cloned and run twice from the same seed — once `c6Carry` OFF,
  once ON — so the OFF fork is the paired baseline and a non-turning tick
  contributes 0 by construction (the variance killer). The **counterfactual
  expectations (+19.1% eligibility, +1.425 pp far-side, kick p50/p90) are
  recomputes on T0's RECORDED trajectories; the LIVE forks may differ** because
  bodies react — this is exactly what T1 tests, and §PRE-LAID READINGS pre-lays
  what a divergence means.
* **Seed block — fresh, disjoint from every consumed range:** seeds
  **`5,000,000 + b·100,000 + k`, `b ∈ 0..11`, `k ∈ 0..99` = 1,200 matches**,
  **5.0M–6.1M**. Consumed elsewhere and cleared: P0 930k · P1 960k–1.46M · P1R
  980k–1.48M · P2-A 2.0M–3.2M · P2-B 3.5M–3.9M · C4/C5 700k–970k · **the T0 smoke
  4.0M** · **T0 census 4.1M–4.7M**. **5,000,000 lies above every consumed range,
  including all of T0.**
* **Population sizing (#24), from T0's 6.86 episodes/match:** 1,200 matches ⇒
  **~8,230 turn episodes** (2× T0's 4,116) and **~2,970 turn-exposed episodes**
  (2× T0's 1,484) and **~357,000 tackle-eligible owned ticks** (2× T0's 178,590).
  Every T1 floor clears with **≥ 2× headroom** over its T0 counterpart:

  | floor | expected @ 1,200 matches | frozen floor | basis |
  | --- | --- | --- | --- |
  | **F-TURN** turn episodes forked | ~8,230 | **≥ 3,600** | 2.3× (2× the T0 F-TURN floor 1,800) |
  | **F-TURN-EXPOSED** exposed episodes | ~2,970 | **≥ 1,400** | 2.1× (2× T0's exposed floor 700) |
  | **F-EXPOSURE** eligible owned ticks | ~357,000 | **≥ 8,000** | abundant (2× T0's 4,000) |
  | **F-FARSIDE** far-side eligible ticks under ON (~1.47% of eligible) | ~5,250 | **≥ 300** | powers the +1.4 pp axis at SE ≲ 0.3 pp; ≫ T0's 85-tick degenerate baseline |

  The far-side cell is the binding one; ~5,250 far-side ticks under the ON law
  gives ample power to resolve +1.4 pp with the CI excluding zero. If the forked
  turn-episode population comes in below F-TURN (< 3,600), that is a **finding,
  not a licence to lower the floor** (contract §8): the fork returns to the
  commander before any reading is drawn.
* **Cluster unit** = match seed (disjoint per block), #20. **Bootstrap** = a
  frozen `BOOTSTRAP_SEED`, cluster resampling over match seeds.
* **Divergence semantics, pre-laid:** because the live forks may diverge from the
  recorded-state recompute, a mismatch between the live shift and T0's counterfactual
  is **information about live reaction**, read via §PRE-LAID READINGS — never a
  reason to re-cut the law, the bands or the floors.

---

## §PRE-LAID READINGS — the full sign space (#38.1)

Written before the run; not one may be re-cut after sight (contract §8). Each
carries its disposition.

* **(A) BOTH AXES UP — the design case.** Eligibility rises (CI lower > 0, point
  in [+9.5%, +28.6%]) AND far-side rises (CI excludes 0, ~+1.4 pp). The honest
  offset delivers both protection-by-distance-cost and protection-by-side-gain as
  T0 sized. Disposition: **return to the commander**, who may then authorize T2
  (T1 cannot — §NON-CLAIMS).
* **(B) ELIGIBILITY UP, FAR-SIDE FLAT — protection did not arrive.** Eligibility
  resolves UP but the far-side CI contains 0. Protection-by-distance moved and
  protection-by-side did not — the two axes decoupled (exactly why #47.5(i)
  forbids conflating them). Disposition: **return to the commander**; no re-cut.
* **(C) FAR-SIDE UP, ELIGIBILITY OUTSIDE ITS BAND — the cost mis-sized.**
  Far-side resolves UP (~+1.4 pp) but the eligibility shift lands outside
  [+9.5%, +28.6%] (still UP, but bigger or smaller than +19.1% predicts).
  Disposition: **return to the commander** with the discrepancy quantified; no
  re-cut. (Landing inside the band with far-side up is reading (A).)
* **(D) BOTH FLAT — the law as frozen does not move the live world.** Neither
  CI clears zero. The constants are wrong for the live world, OR the recorded-state
  sizing misled (live bodies react in a way the bodies-frozen recompute could not
  see). Disposition: **return to the commander**; no re-cut of constants, bands or
  floors.
* **(E) WRONG DIRECTION — a sign flip.** Eligibility resolves DOWN, or far-side
  resolves DOWN (CI excludes zero on the wrong side). A resolved wrong-sign shift
  is a finding about the live world the recompute inverted. Disposition:
  **return to the commander**; no re-cut.
* **(F) KICK BOUND EXCEEDED.** The reported kick-origin displacement exceeds p50
  0.346 m or p90 0.727 m. Per #47.4 this is a **READING, not a re-cut and not a
  law-FAIL**: the live honest ball moved the kick origin more than T0's arithmetic
  predicted. Disposition: **reported and returned to the commander**; the game-level
  consequence is T2's §2 band.
* **(G) LAG-SKILL GRADIENT (reported, not a verdict).** The far-side-by-dribbling
  gradient (skilled → farther-side, §4.3.1) is REPORTED in every branch above.
  Its sign is the one T1 design assumption not measured by T0 (τ increasing with
  dribbling); a gradient that comes out flat or inverted is a **finding for the
  commander's eye**, not a gate failure (the HARD gates bind on the population
  mean, which transfers from B regardless of this sign).
* **(H) ANY X / FIDELITY / ZERO-LOOSE GATE FAILS ⇒ FAIL, the queue stops at the
  commander** (contract §8), whatever the priced-direction axes say.

---

## §NON-CLAIMS

* **T1 prices GEOMETRY, not value** (contract §9's estimand boundary): nothing
  here claims carrying pays or costs — only that the ball is WHERE a body of that
  skill, at that speed, in that turn, would actually have it.
* **No watchability claim.** Duel/turnover economy, the scramble battery and the
  §2 band are **T2's** instruments; T1 asserts only zero new loose balls (I3) and
  the priced geometry. No watchability counter is gated here.
* **T1 cannot authorize T2.** A design-case (A) reading is a licence for the
  **commander** to authorize T2, nothing more; the executor does not proceed.
* **Nothing ships (Road B).** `c6Carry` is null/off in every production path
  through the whole stage; the fingerprint is unchanged; there is no default-ON.
* **Untouched:** the de-glue branch and its two learned corrections (I6), the
  keeper path and its `0.3` carry (I5), `TURN_RATE`/heading semantics (I5), and
  C7's wind-up seat (contract §9). No new gene, no new attribute — dribbling is
  the only attribute input (I8).
