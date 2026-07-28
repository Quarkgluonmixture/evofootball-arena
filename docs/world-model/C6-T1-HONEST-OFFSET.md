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

### ZERO-LOOSE — STRUCTURAL (I3) — **commander amendment #48.3**

> **Commander amendment #48.3 (applied to the frozen doc per ruling #48.5).**
> The frozen form below demanded loose-ball events be EXACTLY EQUAL between paired
> ON/OFF forks. Ruling #48.3 finds that mis-formalized: the honest offset changes
> tackle geometry BY DESIGN, so a tackle that succeeds on one arm and not the
> other frees the ball on one arm and not the other — legitimate divergence,
> near-certain over ~8,230 episodes (the P1-X6 predicate-does-not-match-the-world
> genre, #24). Through I3's actual meaning ("the law never de-glues") the gate
> becomes **STRUCTURAL**:
>
> * **The seam writes only `ball.pos`/`ball.vel`, NEVER `ball.owner`** — asserted
>   by a test (SEAM-NEVER-WRITES-OWNER) AND by the fork **ownership-release
>   ledger**: every ownership release on ON forks classes to an **existing named
>   channel** (tackle, de-glue, kick, ball-won); **releases attributable to the
>   offset assignment must be exactly 0.** Any release the ledger cannot attribute
>   to a named channel ⇒ FAIL, stop at the commander.
> * **The paired loose-ball COUNT DELTA is REPORTED, never gated** — it is
>   downstream duel economy, **T2's to price** (#48.3).
>
> The pre-laid readings and the report-back are updated accordingly: reading (H)
> now fires on the STRUCTURAL predicate (an unattributable release), not on a
> count inequality; the count delta is a reported number.

**Superseded frozen form (kept for the record, #48.3 governs):**
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
* **Fork measurement window — PINNED (commander amendment #48.4).**
  > **Commander amendment #48.4 (applied to the frozen doc per ruling #48.5).**
  > The frozen staging left the horizon for reading the two axes and the kick
  > bound on a forked episode **unpinned** — a post-hoc degree of freedom the
  > discipline forbids. PINNED NOW, from T0's own instrument: **the window runs
  > from sweep start to sweep end + 0.5 s** (T0's during-or-after convention: the
  > episode's sweep, plus the 30-tick / 0.5 s post-window). **Kick displacement
  > is read on kicks initiated INSIDE the window.** **Forks whose match ends
  > inside the window are EXCLUDED, with the count REPORTED** (the standing
  > convention). Both axes (eligibility, far-side), the kick bound, the fidelity
  > ledger and the ownership-release ledger are all measured over exactly this
  > window on each fork.
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

---

## §RESULT — the AUTHORIZED run (ruling #48.5; #48.3/#48.4 as amended)

Script: [`../../scripts/probes/c6-t1-honest-offset.ts`](../../scripts/probes/c6-t1-honest-offset.ts).
Data: [`data/c6-t1-honest-offset.json`](data/c6-t1-honest-offset.json).
Run read-only, **1,200 matches**, seeds `5,000,000 + b·100,000 + k`
(`b ∈ 0..11`, `k ∈ 0..99`), the frozen fork-and-force paired same-seed
instrument over the #48.4 window `[sweep start, sweep end + 0.5 s]`, zero
`src/**` diff at run time. `runExperiment()` invoked **twice**, byte-identical
(X-DET).

> **Verdict: GATES FAIL — on FIDELITY only (`fidelityUnexplained`): 69
> unexplained seam ticks, the gate demands exactly 0.** Every other gate PASSES
> — both priced axes resolve UP inside/adjacent to their T0 brackets, the
> structural zero-loose holds (offset-attributable releases 0), all four floors
> clear with ≥ 2× headroom, and the run is deterministic. Per reading (H) a
> fidelity failure stops the queue at the commander whatever the axes say.
> **The fork RETURNS TO THE COMMANDER: no re-cut, no re-run without a new
> ruling** (contract §8).

* **output SHA** `e740861cf160b38a68492f8cc10a095005a20cca2371d8765aa07a8aeb76fc6b`
* **table SHA** (the deliverables) `1178de1045eaa56a882b141e0cfde7dc49d273e41d20adee16b5fd4c534530bd`

**Process supervision (reported, honest).** Two executor sessions were
interrupted mid-run; the frozen probe was executed to completion by the
commander session. **Nothing in the instrument, the staging, the seeds or the
gates was altered** — the run is the frozen script at the frozen seeds, and
X-DET (two byte-identical invocations, SHAs above) certifies the output is the
deterministic product of that script. Determinism intact.

### Coverage

`totalBaseSteps` **18,076,073** · episodes forked **8,460** · exposed **5,832**
· ended-in-window (excluded, #48.4, REPORTED) **21** · matches contributing **8,460**.

### Gate table

| gate | verdict | evidence |
| --- | --- | --- |
| **X-SRC** | ✅ PASS | `git diff --stat -- src` empty at run time |
| **X-DET** | ✅ PASS | two `runExperiment()` invocations byte-identical; SHAs above |
| **CLONE-GUARD** | ✅ PASS | OFF fork reproduces the base ball.pos at `startTick` on every episode; `cloneGuardFails` **0** |
| **FIDELITY (unexplained = 0)** | ❌ **FAIL** | seam ticks **1,833,755**, fidelityOk **1,833,686**, **unexplained 69** (gate demands exactly 0) — see §DIAGNOSIS |
| **ZERO-LOOSE-STRUCTURAL (#48.3)** | ✅ PASS | offset-attributable releases **0**; every release classes to a named channel (below) |
| **F-TURN** | ✅ PASS | 8,460 / ≥ 3,600 (2.35×) |
| **F-TURN-EXPOSED** | ✅ PASS | 5,832 / ≥ 1,400 (4.17×) |
| **F-EXPOSURE** | ✅ PASS | 196,715 / ≥ 8,000 (24.6×) |
| **F-FARSIDE** | ✅ PASS | 3,098 / ≥ 300 (10.3×) |
| **AXIS-1 UP** (CI lower > 0) | ✅ PASS | +11.63%, CI [+8.51%, +14.85%] excludes 0 |
| **AXIS-2 UP** (CI lower > 0) | ✅ PASS | +1.3215 pp, CI [+1.254, +1.3925] excludes 0 |

### Priced direction — both axes resolve UP

**Axis 1 — tackle-eligibility rate on turn episodes.** OFF **10.685%** → ON
**11.928%**, relative shift **+11.63%**, match-seed cluster-bootstrap CI
**[+8.51%, +14.85%]** — **resolved UP** (lower bound > 0). Point estimate lands
**INSIDE** the pre-registered interpretation band **[+9.5%, +28.6%]** (½×–1.5×
of T0's +19.1% recompute); the live shift damps toward the low half of the band
— bodies react, holding the +19.1% counterfactual back but not away. The HARD
gate (CI lower > 0) is met; the band-position is REPORTED.

**Axis 2 — far-side share among eligible.** OFF **0.0503%** → ON **1.3718%**,
shift **+1.3215 pp**, CI **[+1.254, +1.3925]** — **resolved UP** (CI excludes
0). The point estimate is **just below** T0's counterfactual bracket
**[+1.328, +1.525] pp** (the CI overlaps it); per the frozen gate the
CI-excludes-zero form is what binds and the +1.425 pp comparison is REPORTED —
the live far-side gain arrives at ~93% of the bodies-frozen recompute. The
degenerate 85-tick / 0.048% T0 baseline is broken: far-side is now a populated,
resolved ~1.37% of eligible.

Reading in the sign space: **(A) BOTH AXES UP — the design case** on the priced
geometry. It is delivered under a **fidelity FAIL**, so (H) governs the
disposition (return to commander), and (A) does NOT license T2.

### (G) Lag-skill gradient — REPORTED, positive (matches the design assumption)

Far-side share among eligible seam ticks, by carrier dribbling bucket (ON):

| dribbling bucket | eligible | far-side | far-side share |
| --- | --- | --- | --- |
| **[0.1, 0.3)** | 70,545 | 654 | **0.927%** |
| **[0.3, 0.5)** | 70,129 | 972 | **1.386%** |
| **[0.5, +]** | 78,119 | 1,342 | **1.718%** |

Monotone **increasing** with dribbling (0.927% → 1.386% → 1.718%): skilled
bodies present a farther-side ball. This is the one T1 design assumption T0 did
not measure (τ increasing with dribbling, §LAW lag law); it comes out with the
**assumed sign**, confirming reading (G) as a finding for the commander's eye,
not a gate.

### Kick-bound (#47.4) — reading (F), EXCEEDED (a reading, not a law-FAIL)

Kicks initiated inside the window (n **78,353**): displacement **p50 0.40318 m**
(bound 0.346), **p90 0.75071 m** (bound 0.727), max **1.25549 m**. `withinBound`
**false** → **reading (F)**: the live honest ball moved the kick origin more
than T0's arithmetic predicted (decimetre-scale, both percentiles ~15–17% over
bound). Per #47.4 this is REPORTED and returned to the commander; the constants
do NOT move and the game-level consequence is T2's §2 band.

* **Per-seam-tick displacement (supplementary):** p50 **0.30929 m**, p90
  **0.6628 m** over n **1,833,755** — but max **30.65728 m**, a physically
  impossible carry (carryLen is clamped ≤ 1.4 m + a ≤ 0.06 m wobble, so the
  honest-vs-glue displacement is bounded ≈ 2.3 m). This single outlier is a
  **fingerprint of the same anomaly as the 69 unexplained ticks** (see
  §DIAGNOSIS) — a seam tick on which the carrier's post-step position is not the
  position the offset was written against.

### Fidelity ledger — the 69

Seam ticks **1,833,755** · fidelityOk **1,833,686** · **unexplained 69**.
Exception ledger (every excluded owned tick classed, #38.1 / #46.3):
E-NOOWNER **4,653,482** · E-PAUSED **1,202,284** · E-GKHOLD **1,011,413** ·
E-TRANSITION **68,958** · E-GK **59,755** · E-DEGLUE **53,322** · E-RESTART
**34,104** · E-ENDED **22** · E-SENTOFF **0**.

### Ownership-release ledger (#48.3) — structural zero-loose HOLDS

Releases **86,143** → kick **78,612** · de-glue **5,377** · ball-won **1,903** ·
tackle **251** · **offset-attributable 0**. Every release classes to a named
channel; the seam wrote `ball.pos`/`ball.vel` only, never `ball.owner`. The
paired loose-ball count delta is **+363** (OFF 85,270 → ON 85,633),
**REPORTED, not gated** — downstream duel economy, T2's to price (#48.3).
`offsetRel 0` → the #48.3 structural gate PASSES.

### §DIAGNOSIS — where the 69 come from

**The shared world event: an advantage-foul INJURY to the carrier, mid-carry.**
The 69 are the F2 genre — a *named world event the exception classes do not
carve out* (in C4-T2 it was halftime stale-trace; here it is a carrier injury
under advantage). The mechanism is exact and code-located:

1. Inside one `step`, `stepBall` runs the seam
   (`Match.ts:1614 applyC6HonestOffset`) and writes
   `ball.pos = owner.pos + dir(θ_ball)·carryLen + noise`, computing
   `carryLen`/`τ`/`σ` from the carrier's **pre-contact** `pos` and
   `attrs.dribbling`.
2. **After** the seam, still inside the same `stepBall`, the four contact
   mechanics run (`Match.ts:1657–1660`: `tryTackles`, `tryTacticalFoul`,
   `trySlideTackle`, `trySmother`). On a **failed** standing tackle
   (`mechanics.ts:1888`) or **failed** slide (`mechanics.ts:1682`) a foul is
   rolled, and outside the box and outside the 9–28 m direct-FK band
   `awardFoul` plays **ADVANTAGE** (`Match.ts:1915`): the carrier **keeps the
   ball, phase stays `playing`, ownership is unchanged** — then
   `maybeInjure(victim=owner)` fires at `INJURY_BASE 0.10 · fatigue · age`.
3. The injury mutates the carrier **after** the offset was written, in the same
   step, without releasing the ball:
   * **"Plays on" knock** (~70% of injuries — `Match.ts` `takeKnock`):
     `attrs.dribbling *= 0.85`. `dribbling` feeds `tuckGain`, `τ` and `σ`, so
     the probe's post-step recompute uses `0.85·drb` while the seam used `drb`
     → a **small** > 1e-9 mismatch. (Displacement stays ≤ ~2.3 m — a knock does
     not move `pos`.)
   * **"Stretchered off" serious** (~30% — `forceSubstitution` →
     `out.becomeSub(sub, v2(±1.2, HALF_W − 0.6))`): the SAME player object (SAME
     `gid`) is **teleported to the touchline** and the ball is **not released**,
     so `owner.gid === prevOwnerGid` (NOT E-TRANSITION) and phase is still
     `playing`. The probe recomputes against a post-step `owner.pos` ~30 m from
     where the ball was glued → mismatch **and** the **30.657 m** per-seam-tick
     displacement outlier. Same world event, both symptoms.
4. Because ownership and phase are retained and the same `gid` persists, the
   classifier — keyed on **speed / phase / ownership / gid** (#46.3) — books the
   tick as a continuous-possession **seam** tick, and the exact-recompute fails.
   The failure is **single-tick and self-healing**: after a knock the rescaled
   `dribbling` is stable so the next tick matches; after a sub the ball goes
   loose the following tick (the sub cannot hold it at the touchline) → E-NOOWNER
   thereafter.

**Evidence.** 69 / 1,833,755 seam ticks = **3.8 × 10⁻⁵**, consistent with the
rarity of the compound event (failed tackle → foul → advantage → injury roll →
knock/serious). The two sub-genres jointly explain **both** symptoms the data
carries: the 69 unexplained ticks (dribbling rescale + touchline teleport) and
the otherwise-impossible **30.657 m** per-seam-tick displacement max (the
teleport). `tryTacticalFoul` and won tackles/slides are correctly excluded — the
former **stops play** (→ E-PAUSED), the latter **release ownership** (→
E-TRANSITION / E-NOOWNER) — which is why they never reach the seam class.

**Honest limit of the data.** `data/c6-t1-honest-offset.json` carries only
**aggregate class counts**, no per-record (seed / tick / phase / gid) detail for
the 69. The diagnosis above is derived from the class/aggregate counts + the
per-seam-tick displacement max + the engine source; the exact split of the 69
across "knock" vs "serious-sub" cannot be resolved from this JSON. Confirming the
split (or catching any residual third genre) needs a **re-instrumented probe**
that logs each unexplained tick's world state — which is a **new ruling**, not
this run: **no re-cut, no re-run is authorized here.**

### Disposition

**THE FORK RETURNS TO THE COMMANDER.** Reading (H): a FIDELITY gate failed, so
the queue stops at the commander regardless of the (A) design-case axes. Nothing
is re-cut; the law's constants, bands and floors are untouched; no re-run is
performed without a new ruling. The commander's decision surface: the priced
geometry is (A) both-axes-up as designed, the fidelity FAIL is a **classifier
completeness gap** (an un-named world event: mid-carry advantage-foul injury),
not a law error — so the natural next step to weigh is a ruling that either adds
an **E-INJURY / E-CARRIER-MUTATION** exception class (keying on a same-`gid`
attribute-or-position mutation within the step) and re-runs, or accepts the 69
as a named exception. That choice is the commander's; the executor does not
proceed.

---

## §T1R — the re-run: ONE named exception class + per-record receipts (ruling #49.3)

Status: **PRE-REGISTERED with ruling #49.3, FROZEN BEFORE THE RE-RUN.** This
section is written ex ante; ruling #49 is its derivation. **Nothing here re-cuts
the law, the staging, the axes, the bootstrap, the floors, the bands or the
readings** — all of §LAW / §SEAM / §GATES / §STAGING / §PRE-LAID READINGS above
bind T1R **byte-identical**. The re-run makes exactly **one** substantive change
(the enlarged exception set) plus **one** instrumentation obligation (per-record
receipts), both mandated by #49.3, and nothing else moves.

Authority: **ruling #49** in full (#49.1 the FAIL stands as fired; #49.2
diagnosis confirmed against code; **#49.3 T1R authorized — one change, everything
else bit-identical**; #49.4 the labelled bankings; #49.5 process). The FROZEN
run's verdict (§RESULT) stands published-and-labelled exactly as P2's undelivered
numbers were: the two priced axes resolved UP but cannot be certified from a run
whose ledger did not close.

### The E-INJURY exception class (both limbs, code-cited)

**E-INJURY** — an advantage-foul injury to the carrier, occurring **inside the
fork window**, that mutates the SAME-`gid` carrier **after** the seam's same-tick
pre-contact read and **without releasing the ball**. It is a named world event of
the F2 / halftime-stale-trace genre (#49.2): a classifier-completeness gap, **not**
a law or seam defect. The mechanism is exact and code-located
(`awardFoul` plays ADVANTAGE → `maybeInjure(victim=owner)`, `Match.ts:1915→1919`):

* **Limb 1 — attrs mutation (the "plays-on" knock, ~70% of injuries).**
  `takeKnock` (`Player.ts:223`) **replaces** `attrs`, scaling
  `dribbling *= 0.85` (and `pace *= 0.8`). `dribbling` feeds `tuckGain`, `τ` and
  `σ` in §LAW, so the probe's post-step recompute uses the **rescaled** `drb`
  while the seam wrote against the **pre-contact** `drb` → a > 1e-9 mismatch. The
  carrier keeps the ball; phase stays `playing`; `pos` is unmoved.
* **Limb 2 — same-`gid` `becomeSub` reposition (the "stretchered-off" serious,
  ~30%).** `forceSubstitution` → `out.becomeSub(sub, v2(±1.2, HALF_W − 0.6))`
  (`Match.ts:2042`; `Player.ts:230`, which documents the **in-place identity
  swap** — the SAME player object, SAME `gid`, new man's attrs, teleported to the
  touchline). The ball is **not released** (`owner.gid` retained, NOT
  E-TRANSITION) and phase is still `playing`, so the probe recomputes against a
  post-step `owner.pos` ~30 m from where the ball was glued → mismatch **and** the
  30.657 m per-seam-tick displacement outlier (#49.2: that outlier IS this event).

Both limbs are **single-tick and self-healing**: after a knock the rescaled
`dribbling` is stable so the next tick matches; after a serious sub the ball goes
loose the following tick (→ E-NOOWNER). E-INJURY joins the standing exception set
of §GATES FIDELITY; **the gate is unchanged — unexplained must be exactly 0 over
the ENLARGED class set** (#49.3).

### The detection T1R implements (reads WORLD TRUTH the probe already holds)

Of the two candidate detections #49.3 names — reading the match event log for
advantage-foul events, versus a same-`gid` attrs/position discontinuity — T1R uses
the **discontinuity of the carrier's own world state across the step**, because
that is (a) precisely the quantity that makes the fidelity recompute fail, (b)
world truth the probe **already** holds (`owner.attrs.dribbling`, `owner.pos`, and
the pre-step primitives it snapshots each tick), and (c) free of any event-log
string parsing. On a tick classified `seam` (owned, outfield, `playing`, same
`gid` as last tick, the seam's heading ring entry present), where the pre-step
carrier's values are captured **as primitives before `step`** (because
`takeKnock`/`becomeSub` replace the `attrs` and `pos` objects in place):

* if `owner.pos` jumped **> 3.0 m** from its pre-step position → **limb 2**, cause
  `becomeSub-reposition` (normal per-tick carrier motion is < ~0.3 m at 60 Hz;
  3.0 m is a 10× margin over motion and far below a real touchline teleport);
* else if `owner.attrs.dribbling` **changed** from the pre-step read → **limb 1**,
  cause `attrs-mutation`.

This is injury-specific **by construction**: `attrs`/`pos` are immutable in play
except via `takeKnock`/`becomeSub`, and the only other `becomeSub` callers
(rotation subs, `Match.ts:1062-1063` halftime and `2174-2175` restart) fire only
when `phase !== 'playing'` — so they can never land on a `playing` **seam** tick.
The professional-foul injury (`awardTacticalFoul` → `maybeInjure`) **stops play**
→ E-PAUSED, so it never reaches the seam class either. The detection is verified
against world state, not inferred.

### The per-record receipts obligation (#49.3)

The #49.2 diagnosis leaned on aggregate class counts plus code reading; a re-run's
attribution must carry **receipts, not inference**. T1R records, for **every
exception-class hit** (each E-class **and** any UNEXPLAINED tick), a per-record
receipt `{ seed, tick, gid, cause }`, **capped at 1,000 records per class**
(first-N kept). The cap keeps the output bounded while the FIRST-1,000 rule keeps
it deterministic (matches run in seed order, ticks in order) so X-DET is
preserved. The output carries a `receipts` block: the `cap`, a per-class `counts`
summary, and the capped `records` themselves.

### What stays bit-identical

Everything except the two changes above:

* **Same seeds** — `5,000,000 + b·100,000 + k`, `b ∈ 0..11`, `k ∈ 0..99` = 1,200
  matches, **5.0M–6.1M** (§STAGING, unchanged).
* **Same law** — every §LAW constant, the seam, the ring buffer, the window
  (#48.4), the paired fork-and-force instrument (§STAGING) — byte-identical.
* **Same gates** — X-family, FIDELITY (**unexplained exactly 0**, now over the
  enlarged class set including E-INJURY), ZERO-LOOSE-STRUCTURAL (#48.3), the four
  floors, and the two priced HARD direction axes — all as frozen. No gate
  loosened, no floor lowered, no band re-cut.
* **Same bands, same readings** — the interpretation bands (§GATES), the kick
  bound (#47.4), and the full sign space §PRE-LAID READINGS (A)–(H) bind
  unchanged.

### Output

T1R's output goes to **[`data/c6-t1r-honest-offset.json`](data/c6-t1r-honest-offset.json)**,
selected at run time by the env var **`C6_T1R=1`** (default and the engineering
smoke's `C6_T1_OUT` scratch path are unchanged; `C6_T1_OUT` takes precedence).
The FROZEN run's `data/c6-t1-honest-offset.json` is **left untouched** as the
labelled-but-uncertified record. The re-run itself is **not** performed by this
pre-registration commit — it returns to the commander's supervised overnight
protocol (#49.5); the executor prepares T1R and stops.

### §T1R RESULT — the re-run: GATES PASS, both axes certified (ruling #49.5 process)

Data: [`data/c6-t1r-honest-offset.json`](data/c6-t1r-honest-offset.json).
Run under the commander session's process supervision (#49.5, X-DET certifies);
the frozen instrument, seeds (`5,000,000 + b·100,000 + k`, 1,200 matches),
law, staging, bands and readings all bit-identical to §RESULT — the ONLY changes
are the enlarged exception set (adds E-INJURY) and the per-record receipts
obligation (#49.3). `runExperiment()` deterministic (X-DET true).

> **Verdict: GATES PASS.** The ledger now closes — **unexplained exactly 0**
> over the enlarged class set (E-INJURY added). Both priced axes are **CERTIFIED
> UP** off a run whose fidelity gate passes; the structural zero-loose holds; all
> four floors clear; the run is deterministic. Reading **(A) — BOTH AXES UP, the
> design case** now stands on a closed ledger. **THE FORK RETURNS TO THE
> COMMANDER**, who may then consider T2 (T1 cannot authorize it).

* **table SHA** (the deliverables) `f1d98a8b565eda719fe36d1d197198bc3f2b1259655bd551011dce8f6ce707e1`
* **output SHA** `38cfae01151920c37113f53b29247e124b3239de44da8a511024e0d4923d600a`

#### Gate table

| gate | verdict | evidence |
| --- | --- | --- |
| **X-SRC** | ✅ PASS | `git diff --stat -- src` empty at run time |
| **X-DET** | ✅ PASS | `runExperiment()` deterministic; SHAs above |
| **CLONE-GUARD** | ✅ PASS | `cloneGuardFails` **0** |
| **FIDELITY (unexplained = 0)** | ✅ **PASS** | seam ticks **1,833,662**, fidelityOk **1,833,662**, **unexplained 0** over the enlarged class set (E-INJURY **93**) |
| **ZERO-LOOSE-STRUCTURAL (#48.3)** | ✅ PASS | offset-attributable releases **0** |
| **F-TURN** | ✅ PASS | 8,460 / ≥ 3,600 (2.35×) |
| **F-TURN-EXPOSED** | ✅ PASS | 5,832 / ≥ 1,400 (4.17×) |
| **F-EXPOSURE** | ✅ PASS | 196,715 / ≥ 8,000 (24.6×) |
| **F-FARSIDE** | ✅ PASS | 3,098 / ≥ 300 (10.3×) |
| **AXIS-1 UP** (CI lower > 0) | ✅ PASS | +11.63%, CI [+8.51%, +14.85%] excludes 0 |
| **AXIS-2 UP** (CI lower > 0) | ✅ PASS | +1.3215 pp, CI [+1.254, +1.3925] excludes 0 |

Coverage identical to §RESULT: `totalBaseSteps` **18,076,073** · episodes forked
**8,460** · exposed **5,832** · ended-in-window **21** · matches contributing
**8,460**.

#### The fidelity ledger now closes — unexplained 0 over the enlarged class set

Seam ticks **1,833,662** · fidelityOk **1,833,662** · **unexplained 0**.
Exception ledger (E-INJURY added, #49.3): E-NOOWNER **4,653,482** · E-PAUSED
**1,202,284** · E-GKHOLD **1,011,413** · E-TRANSITION **68,958** · E-GK
**59,755** · E-DEGLUE **53,322** · E-RESTART **34,104** · **E-INJURY 93** ·
E-ENDED **22** · E-SENTOFF **0**.

**The 93-vs-69 delta — the class is EVENT-keyed, not mismatch-keyed.** T1 booked
**69** unexplained seam ticks; T1R books **93** E-INJURY events and **0**
unexplained. The 24-tick difference is exact and self-consistent in the data:

* T1 seam **1,833,755** − T1R seam **1,833,662** = **93** — every E-INJURY tick
  was, in T1, mis-booked into the continuous-possession seam class.
* T1 fidelityOk **1,833,686** − T1R fidelityOk **1,833,662** = **24** — that many
  injury ticks *passed* T1's 1e-9 equality and were **clean seam ticks** there.
* **69 (mismatched in T1) + 24 (clean-passed in T1) = 93 (all in-window injury
  events).** T1R's E-INJURY class is keyed on the **world event** (a same-`gid`
  carrier attrs/pos discontinuity inside the step), so it books every injury
  event whether or not it perturbed the ball beyond 1e-9; T1's `unexplained`
  counted only the ticks whose recompute happened to *fail*. A knock that lands
  while the carrier is carrying **straight** (ω ≈ 0) barely touches the
  magnitude/noise terms the offset writes, so ~24 such ticks passed equality in
  T1 and never showed as unexplained — they were clean seam ticks then; T1R
  correctly pulls them into the named class.

**What the receipts confirm (and its honest limit).** The `receipts` block
carries all **93** E-INJURY records `{seed, tick, gid, cause}` (under the 1,000
cap), across **91 distinct seeds**. Split by cause: **`attrs-mutation` 64**
(limb 1, the "plays-on" knock) · **`becomeSub-reposition` 29** (limb 2, the
"stretchered-off" serious sub). This nails the delta mechanism: limb 2
teleports `pos` ~30 m, so **all 29** becomeSub ticks *necessarily* fail the 1e-9
recompute and are among T1's 69; the clean-passing 24 are therefore **all**
limb-1 knocks (64 − (69 − 29) = 24 attrs-mutation ticks that did not perturb the
ball beyond tolerance), exactly the "straight-carry knock" sub-genre. Cross-check
in the kick ledger: T1's otherwise-impossible **30.657 m** per-seam-tick
displacement outlier is **gone** — T1R's per-seam-tick max is **3.198 m**
(over n **1,833,662**), because the becomeSub-teleport ticks are now removed from
the seam class. **Honest limit:** the JSON does *not* carry per-record ω or a
would-have-mismatched flag, so "carrying straight (ω ≈ 0)" is a code-level
mechanistic reading, not a directly measured quantity in this data; what the data
*does* prove is (a) the exact 93 = 69 + 24 arithmetic, (b) all 24 clean-passers
must be the knock limb by necessity (becomeSub always jumps `pos`), and (c) the
teleport outlier's disappearance from the seam class.

#### Both axes now CERTIFIED — the identical numbers, now off a closed ledger

The axis point estimates and CIs are **byte-identical to §RESULT** (same seeds,
same law; the only T1→T1R change is classification, which touches neither the
turn-episode population nor the eligibility/far-side counts). What changed is
their *status*: labelled-but-uncertified in T1 (fidelity FAIL) → **CERTIFIED** in
T1R (fidelity PASS).

**Axis 1 — tackle-eligibility rate.** OFF **10.685%** → ON **11.928%**, relative
shift **+11.63%**, CI **[+8.51%, +14.85%]** (excludes 0). Point estimate lands
**INSIDE** the pre-registered band **[+9.5%, +28.6%]**, in its **low half** — live
damping of T0's +19.1% recompute (bodies react, holding the counterfactual back
but not away).

**Axis 2 — far-side share among eligible.** OFF **0.0503%** → ON **1.3718%**,
shift **+1.3215 pp**, CI **[+1.254, +1.3925]** (excludes 0) — **~93%** of the T0
recompute (**+1.425 pp**, bracket **[+1.328, +1.525]**), the CI overlapping the
bracket's low edge. The degenerate **0.048%** T0 baseline is **broken**: far-side
is now a populated, resolved ~1.37% of eligible.

#### (G) Lag-skill gradient — monotone POSITIVE (REPORTED)

Far-side share among eligible seam ticks, by carrier dribbling bucket (ON):

| dribbling bucket | eligible | far-side | far-side share |
| --- | --- | --- | --- |
| **[0.1, 0.3)** | 70,520 | 652 | **0.925%** |
| **[0.3, 0.5)** | 70,099 | 972 | **1.387%** |
| **[0.5, +]** | 78,103 | 1,342 | **1.718%** |

Monotone **increasing** (0.925% → 1.387% → 1.718%): skilled bodies present a
farther-side ball — the one T1 design assumption T0 did not measure (τ increasing
with dribbling) comes out with the **assumed sign**. Essentially unchanged from
the labelled run's 0.927%/1.386%/1.718% (the 93 E-INJURY ticks left the eligible
pools); reading (G) confirmed as a finding, still REPORTED-only.

#### Kick-bound (#47.4) — reading (F) STANDS (kick ledger byte-identical to §RESULT)

Kicks in window (n **78,353**): displacement **p50 0.40318 m** (bound **0.346**,
**+16.5%**), **p90 0.75071 m** (bound **0.727**, +3.3%), max **1.25549 m**.
`withinBound` **false** → **reading (F)** stands, exactly as the frozen §RESULT
reported it (the kick ledger is byte-identical T1→T1R): the live honest ball
moved the kick origin more than T0's arithmetic predicted — decimetre-scale,
REPORTED, **T2's §2 band to price**; the constants do not move.

#### Ownership-release & loose-ball — structural zero-loose HOLDS (byte-identical)

Releases **86,143** → kick **78,612** · de-glue **5,377** · ball-won **1,903** ·
tackle **251** · **offset-attributable 0** → `offsetRel 0`, the #48.3 structural
gate PASSES. Paired loose-ball delta **+363** (OFF 85,270 → ON 85,633),
**REPORTED, not gated** — downstream duel economy, T2's to price (#48.3).

#### Verdict

The pre-laid reading is **(A) — BOTH AXES UP, the design case** (§PRE-LAID
READINGS), now delivered on a **closed ledger** (unexplained 0, all gates PASS).
The honest offset does what T0 sized: eligibility rises (band low-half),
far-side breaks its degenerate baseline to ~93% of the recompute, the lag-skill
gradient is positive, the kick bound is exceeded (reading (F), T2's to price) and
the loose-ball delta is +363 (REPORTED). Per contract §8 **THE FORK RETURNS TO
THE COMMANDER**; reading (A) licenses the commander to *consider* T2 and nothing
more — **T1 cannot authorize T2.**
