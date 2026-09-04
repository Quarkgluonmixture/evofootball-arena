# BF — THE BODY-FACING MOVEMENT CONTRACT（转身要付代价：朝向不等于速度方向时，身体跑不出全速）

> **Lineage.** RC-C0b (ruling #373) measured question (c) of #371 item 5 and the verifier
> confirmed it by its own reading: in this engine a body's `heading` is written AFTER its position
> and never read back into velocity or position — two identical bodies driven at the same target
> for 120 ticks cover the SAME distance with one facing 90° off (ratio exactly 1). SUBSTRATE-MAP
> S1 names the debt verbatim: "movement remains one isotropic accel envelope + a separately
> rotating heading"; `agility` = "a flat `TURN_RATE 6.5`, attr-blind"; the S1 "Add" list carries
> "facing, turn cost, accel curve". VISION S11 lists 转身 among the three glue scenarios
> (转身/低速/受压仍是胶水). The READY limb of the RC arc (M-RC.3b) cannot be an honest trait until
> facing costs something — a free action's gene saturates with no trade (VISION §1: the substrate
> ALLOWS and PRICES). This contract governs the BF arc; it is an S1 body-dynamics slice, the
> FOUNDATION.md family (M0–M4), not a tactic.
>
> **Position in the doc hierarchy.** [`../VISION.md`](../VISION.md) is the gold standard;
> [`../SUBSTRATE-MAP.md`](../SUBSTRATE-MAP.md) S1 is the layer; [`FOUNDATION.md`](FOUNDATION.md)
> the body model; [`../PROBE-CONTRACTS.md`](../PROBE-CONTRACTS.md) the method. Canon sentences are
> COPIED from [`CANON.md`](CANON.md), never re-typed.

## §-1 THE DOCTRINE

A real body runs fastest where it faces. Backpedalling and lateral shuffling are SLOWER than
forward running — every defender who turns his hips to run with a striker, every receiver who
opens his body to the passer while drifting, pays a step for it. That price is what makes
facing a DECISION: face the ball and lose ground, or run and lose sight. In this engine the price
is zero, so facing is not a decision — it is glue: the support fan faces where it drifts, the
marker backpedals at full speed, and a receiver who turned toward the passer before the strike
would lose nothing. ⇒ **THE LAW: a body's achievable velocity toward its desired direction is
scaled by how far its heading is from that direction — full ahead, less to the side, least
backwards — with the shape a body fact and the size of the penalty the body's own `agility`.**
Emergence criterion unchanged: nothing is banned or assigned; every existing facing decision
(the executors' `faceTarget` sites) keeps its author and simply starts to COST; selection then
decides who turns and who runs.

## §0 WHAT EXISTS (code facts of record; symbol-stable)

* `Player.physicsStep` (`src/sim/Player.ts`): `desiredVel` clamped to `topSpeed`, approached at
  `accel·dt`; position advances from velocity; ONLY THEN the heading rotates toward `faceTarget`
  (else toward the movement direction) at `TURN_RATE` = 6.5 rad/s. The heading is never read in
  the velocity/position integration. `ACCEL` = 14 m/s²; `BASE_SPEED` per role × (0.88 + 0.24·pace).
* `faceTarget` is set by executors (marking backpedal "27.5", the receiver facing the ball, the
  keeper facing the ball, the wind-up passer facing the aim) — every site is a facing DECISION
  made for free today.
* `agility` is a shipped attribute with no movement consequence (SUBSTRATE-MAP S1: attr-blind).
* The BK reception shell already makes facing MATTER at reception (front / side / back sectors);
  this contract adds what facing COSTS in motion.

## §2 MECHANISMS — THE LAW FAMILY (exact form frozen at BF-T0's §P, informed by BF-C0)

* **M-BF.1 THE FACING FACTOR.** Let φ = the angle between the body's heading and its desired
  movement direction. The achievable speed (and the acceleration toward it) is scaled by
  `f(φ)` with `f(0) = 1` (ahead: full), `f(π/2) = LATERAL`, `f(π) = BACK`, monotone in φ, applied
  INSIDE `physicsStep` on the desired-velocity clamp and the accel step — the body's own envelope,
  not a steering rule. ⛔ No taste constants: `LATERAL` and `BACK` are the REALITY ANCHOR's own
  fractions (sports-science figures for lateral shuffle and backpedal vs forward sprint — the
  figures and their sources are RATIFIED at BF-C0's banking, the PC-tier form: literature
  constants named in a ruling) — and the interpolation shape between them is a declared choice.
* **M-BF.2 AGILITY BITES.** The penalty depth is scaled by the body's `agility`: a more agile body
  loses less when moving off its heading (the attribute finally has a movement consequence —
  VISION §3: 每一项属性真有影响). Form frozen at T0 (the `pace` idiom `0.88 + 0.24·pace` is the
  named prior); ⛔ never a per-role constant.
  ⭐ STATUS (ruling #375): **HELD** — `agility` is not a shipped attribute (`ATTR_KEYS` has nine
  keys; the S1 name is a hook). A new attribute is a BUDGET slice (the `positioning` precedent) with
  its own contract; ⛔ no proxy attribute. BF-T0 builds the law with ONE flat depth D = 0.30
  (k = 0.70, ruling #374 item 4); the exam's k = 0.60 / 0.80 rungs stand in for the band.
* **M-BF.3 NOTHING ELSE CHANGES.** `TURN_RATE` unchanged; `faceTarget` sites unchanged; no
  executor is told to face differently; the ball, the shell, the contact law untouched. The law is
  a flag (`bfFacingCost`), default OFF, Road B, pin suite from birth, fingerprint unchanged; the
  entry rung comes after its exam and play-test.
* **M-BF.4 THE COUPLING TO RC.** With BF armed, the READY limb's turn toward the passer costs
  drift speed ⇒ the limb has a trade and its gene means something. RC-T0b is built AFTER BF-T0;
  RC-T1b exams 3b with BF armed in BOTH arms (and a BF-alone arm beside).

## §3 THE ARC

* **BF-C0 — THE MOVEMENT-FACING CENSUS** (dispatched at #373): (a) today's misalignment — over
  every open-play moving tick, φ by action class × speed bin × role × side-of-ball; the share of
  movement ticks with φ > 45° and > 90°; the speed achieved in each φ bin (today: the isotropic
  envelope's receipt); metres covered per match while misaligned; (b) the EXPOSURE TABLE — which
  action classes and which bodies would pay under a facing factor (counts); (c) the `faceTarget`
  seam map — every site that sets it, anchored, with its class; (d) the REALITY ANCHOR — the
  literature's lateral/backpedal fractions, cited with the caveat of the executor's access;
  ratified at banking. Arms: world 12 empty-book + the SHIPPED default (the law would reach both).
  No pre-commitment: a census that sizes the law's blast radius; the contract decides.
* **BF-T0 — THE DORMANT LAW** (own §P: the factor, the agility form, the pins: G-OFF byte-identity
  · G-AHEAD (φ = 0 ⇒ identity) · G-BACK/G-LATERAL (fixture ratios equal the anchor) · monotone ·
  agility bites · seam map · fingerprint).
* **BF-T1 — THE EXAM** (own freeze): SHUT vs ARMED on world 12 (both book forms); goals, completion,
  the user's three PT-C0 faces, the defensive faces (乱跑/coverage from the DF arc), the E4
  dimensions; H-BF.1 named at dispatch. Then the play-test gate (USER).
* **Then RC-T0b → RC-T1b** (the READY limb on a priced body).

## §4 NON-CLAIMS & HELD DOORS

No turn-RATE change (agility → turn rate is a second door, held); no stop/decelerate law; no
carrying coupling (低速/受压 are S11's other two glue scenarios — held); no perception cost of
facing (a gaze model is the IN arc's); no promise the world plays better with the price — that is
BF-T1's and the user's question.

## §6 VISION AUDIT (the #91 form)

| VISION clause | this contract | verdict |
|---|---|---|
| §1 底座 allows and PRICES | facing becomes priced; no ban, no designation (M-BF.1/3) | ✅ |
| §1 no taste constants | anchor fractions from literature, ratified by ruling; shape declared; agility form from the pace idiom | ✅ (the PC-tier precedent) |
| §3 每一项属性真有影响 | `agility` gains its first movement consequence | ✅ — closes an attr-blind row |
| §3 现实机制 (S11 glue) | 转身 leaves the glue list for movement | ✅ (low-speed / pressure held) |
| §2 watchability | the exam carries the E4 dimensions and the user's faces; the entry is a USER GATE | ✅ |

## §7 REALITY AUDIT (the #201 rule)

Real players run slower backwards and sideways — the sprint literature puts backpedal and lateral
shuffle well below forward sprint; coaches teach "open your hips" precisely because it costs a
step. A receiver who turns to the passer while drifting gives up ground — that trade is the
football fact the READY limb needs. Honest limits: the literature figures are for trained athletes
on straight lines; the interpolation shape between ahead/side/back is a choice; real turning also
costs balance and time (held). PASS.
