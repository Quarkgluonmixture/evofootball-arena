# C6 — Embodied Carrying (design contract, commander-owned)

Status: **DESIGN CONTRACT, drafted 2026-07-28 under ruling #45.2(a) (night
queue).** Authority: the C-track template (#29.4: Phase-0 map before any
contract — [`C6-PHASE0-CODE-MAP.md`](C6-PHASE0-CODE-MAP.md), read in full) ·
#29.2 (median ownership spell 0.33 s; "the lever is C7/C6, not the chooser") ·
#29.3 (C6's shield/protective carry is a NAMED C5-unpark trigger) · #12
(touch cost leaves every v1 live set; its live entry re-seats to a future
C5-coupled slice — a boundary this contract inherits, not revisits) · #31.1 ·
#32.1 · #38.1 · #20 · #24 · #26.5 · Road B (nothing ships; every flag
default-OFF; probes only).

Stages under this contract are pre-registered individually by the executor
and reviewed before running, per the standing pattern.

---

## 1. The measured case (the map's one sentence, adopted)

The de-glue already exists and is well built — it is gated to one regime
(`Dribble` + `v > 2.5` + `nearOpp > 4.2 m`, `Match.ts:1301-1320`), and
everything outside that regime is an assignment: `ball.pos = owner.pos +
heading·0.85`, `ball.vel = owner.vel` (`Match.ts:1334-1337`). The ball has no
independent existence while owned. The user's "以自己为圆心连球带人一起转" is
not an approximation — it is the assignment statement, swept through a
rate-capped 0.48 s / 29-tick arc for a 180° pivot, during which the ball is
welded to the shoulders, costs zero touches, and presents identically whether
the body turns into a defender or away from him.

What the world already charges honestly, and this contract must not
double-charge: **the turn costs 0.48 s of real time**, defenders close during
it, and a slow/turning carrier already loses the largest protective term in
`tryTackles` (`pace·drive·0.16` with `drive = |v|/9 ≈ 0` while pivoting,
plus the `helpClose && drive < 0.45` bonus against stopped-and-doubled).

## 2. What already exists (assets, reused not rebuilt)

* `performDribbleTouch` (`mechanics.ts:1403-1462`): space prices the push
  continuously; technique prices distance AND accuracy; two learned
  corrections (touchline guard; knock along travel, not facing) are
  play-report-verified and survive untouched.
* The loose-ball substrate (`dribbleTouch`, five wired consumers) exists —
  for one regime. C6 v1 does not extend its domain (see §3-Q1).
* **The attack surface is ball-keyed** (`tryTackles` searches on
  `dist(o.pos, ball.pos) < 1.15`, `mechanics.ts:1726`): moving the ball
  relative to the body automatically changes who can reach it. C6 builds no
  attack — the same conclusion C5 T0 reached at its own seat.
* `heading` is load-bearing far beyond the ball (renderer,
  `kickMisalignment`, `backToGoal`, F9): `TURN_RATE` and heading semantics
  are untouchable (map §2's registered constraint).

## 3. The map's six questions, RULED

* **Q1 — which regime is v1? THE TURN, as geometry.** The user's own words,
  the smallest scope, and the sharpest measured gap. The SLOW carry stays
  as-is (walking pace ≈ close control is a defensible modelling call — the
  map's own reading, adopted). The PRESSURED-carry de-glue is **v2's seat,
  explicitly not v1's**: it has the biggest scramble blast radius, C1-B's §2
  break is the precedent (goals −15.4%, long balls +28.2% from one honest
  interface), and it may not be drafted without a pre-registered
  loose-ball/scramble ceiling (§9).
* **Q2 — does the turn get a touch cost? NO, ever, in C6.** The turn is
  already priced in seconds (0.48 s is real and defenders use it); a touch
  charge on top double-charges the same act (map §2.3), and the touch-cost
  family is ruled OUT of C6 entirely — #12 re-seated it to a future
  C5-coupled slice (receiver's craft), and that boundary binds here. **The
  turn gets EXPOSURE honesty instead** (Q3).
* **Q3 — can `carry = 0.85` become a variable first? YES — that IS v1.**
  The rigid offset becomes **THE HONEST OFFSET** (§4): magnitude, lag and
  noise as functions of the body's own state and technique. The single
  assignment at `Match.ts:1334` is the seat; nothing else moves.
* **Q4 — the loose-ball budget? v1's is ZERO by construction.** The glue is
  kept (the ball remains owned throughout); v1 changes where the owned ball
  sits, never whether it is owned. A probe gate asserts zero new loose
  balls. Scramble canaries still pre-register at every stage (exposure
  shifts turnovers, turnovers can shift scrambles — indirect paths are
  still paths). The v2 de-glue's ceiling derives from C1-B's break + the
  #20 watchability battery when v2 is drafted, not now.
* **Q5 — does C6 wait for C5 or feed it? FEEDS IT.** #29.3 names C6's
  protective carry as a C5-unpark trigger; sequencing C6 before any C5
  revival is adopted. On T2's verdict the #29.3 re-census returns to the
  commander (§6-T3).
* **Q6 — the 1.6 s loose window under pressure?** v2's question, with the
  regime it belongs to. Not touched in v1.

## 4. v1 — THE HONEST OFFSET

### 4.1 The law (shape fixed here; exact constants frozen at T1's
pre-registration, derived from T0's census)

While owned and NOT in the de-glue path, the ball's position becomes:

```text
ball.pos = owner.pos + dir(θ_ball) · carryLen
carryLen = f(|v|, |ω|, dribbling)      -- the magnitude law
θ_ball   → θ_heading with lag τ(drb)   -- the lag law: the ball TRAILS the
                                          sweep instead of riding it rigidly
+ noise  keyed by (turn intensity) × (1 − a·dribbling)  -- clumsy turners
                                          wobble the ball; clean ones don't
```

* **Magnitude**: grows with speed (a ball at pace runs ahead of the foot —
  continuous with the push doctrine's `open`-priced knock), tucks toward
  the feet at low speed and high turn rate, with dribbling scaling how
  tight the tuck is. Floor and cap pre-registered at T1.
* **Lag**: during a pivot the ball does not teleport around the 0.85 m arc;
  it trails the heading sweep with a technique-priced time constant. This
  single term breaks "以自己为圆心" literally: the ball and the man stop
  being one rigid body.
* **Noise**: gaussian, gated on turn intensity, scaled down by technique —
  the craft doctrine's standing form (priced capability + noise; usage and
  tactics emerge elsewhere).

### 4.2 What the law reads — and what it must NEVER read

Inputs: the body's OWN kinematic state (`|v|`, heading sweep rate) and its
OWN attributes (dribbling; nothing else). **No opponent positions, no
percepts, no ball-context.** An offset that swings away from the (true)
nearest defender is an omniscient auto-shield — the exact defect the
cross-AI audit caught in ShieldHold (#36), rebuilt in physics costume.
Exposure asymmetry must EMERGE: turning away from a defender puts the
lagged, tucked ball on the far side by GEOMETRY, and the existing
ball-keyed attack does the rest. If selection later wants bodies that
CHOOSE to turn away, that choice enters through the decision layers under
their own contracts — never through this law.

### 4.3 Consequences the design intends (measured, not asserted)

1. A skilled turner presents a smaller, farther-side ball mid-turn; a
   clumsy one exposes it — `tryTackles` needs no modification to price
   this (I7).
2. Kick release geometry shifts by centimetres (kicks originate at the
   ball): priced as a BOUNDED, REPORTED delta at T1, with an equivalence
   claim carrying its own interval test and pre-computed power
   (PROBE-CONTRACTS' sixth threshold type — "no change" is a claim, not a
   default).
3. The renderer inherits an honest ball for free (F9 sympathy); no render
   work is part of v1.

## 5. Design invariants (frozen)

```text
I1  NO NEW COSTS. No touch charge, no stamina, no timer. The turn's 0.48 s
    stays the only price. (#12's boundary + the double-charge ban.)
I2  NO OPPONENT INPUT in the law (§4.2). Physics reads the body, not the
    game state around it.
I3  THE GLUE IS KEPT in v1: the ball remains owned; ZERO new loose balls,
    asserted by gate.
I4  Flag `c6Carry`, default OFF, bit-identical when off: offset ≡
    heading·0.85 exactly, fingerprint unchanged.
I5  TURN_RATE and heading semantics untouched (their consumer list is the
    map's §2 warning).
I6  The de-glue branch and its two learned corrections untouched.
I7  The attack stays ball-keyed and unmodified — exposure consequences
    flow ONLY through existing surfaces.
I8  No new gene, no new attribute; dribbling is the only attribute input.
I9  Watchability canaries pre-register at every stage even though v1 makes
    no loose balls (indirect churn is still churn); 乱抢 instruments per
    the standing battery.
```

## 6. Stages (each pre-registers its own contract; executor drafts,
commander reviews, per the standing pattern)

* **T0 — CARRY-GEOMETRY CENSUS** (read-only, zero `src/**`). The baseline
  the law must be priced against, with populations sized per #24:
  (i) carry-state population: owned ticks by speed band × turn-rate band ×
  pressure band × action label — the map's regime table, now with numbers;
  (ii) turn episodes (sweep ≥ 90°): count, duration, what happens during
  and immediately after (tackle attempts, outcomes);
  (iii) the exposure instrument: tackle attempts/success vs ball–defender
  geometry (distance; approach side relative to the ball's offset), the
  instrument T1's priced-direction gate will be derived from;
  (iv) counterfactual geometry, pure arithmetic on recorded states: how
  ball–defender distances redistribute under candidate tuck/lag laws — the
  cheap ex-ante sizing that fixes T1's constants and power (the P1R
  pre-freeze-sizing precedent, now standing practice per #44.5).
* **T1 — THE HONEST OFFSET, dormant.** Implement §4.1 behind `c6Carry`.
  Gates (frozen at its own pre-registration): OFF bit-identical (X-family:
  fingerprint, league seeds × seasons, single-read-point test); per-tick
  fidelity ON (applied offset equals the law to 1e-9; unexplained exactly
  0 with the standing exception classes incl. paused-world); **zero new
  loose balls** (I3, exact); exposure moves in the T0-priced direction
  with ex-ante power from T0's populations; kick-release delta bounded
  (equivalence form, sixth threshold type); fork-and-force paired
  same-seed episodes, cluster units declared, #20 semantics.
* **T2 — MATCH-LEVEL A/B.** Law armed both-teams vs R0, paired seeds
  (physics is symmetric — no adoption ladder needed; the ladder is for
  asymmetric choosers). Instruments: duel/turnover economy (tackle
  attempts, success, where turnovers happen), the scramble battery, §2
  band, watchability HARD. Verdict per #20; a canary firing stops the
  queue at the commander.
* **T3 — not a C6 stage: the #29.3 trigger.** On T2's verdict, the C5
  re-census decision (held-tick exchange rate on the enriched substrate,
  H1 re-powered per #29.1) RETURNS TO THE COMMANDER. C6 does not run it.

## 7. Gate sources

#20 (CI-inside-band, cluster units) · #24 (floors re-powered AND attainable
on the deployed population — twice bitten, #43.3/#44.5 the third time) ·
#26.5 (population law: substrate change ⇒ re-census; run states its HEAD) ·
#29.5 (no weak gate undisclosed; deliverability is a freeze-time
obligation) · #32.1 (no coupon-collector forms) · #38.1 (exception
boilerplate + full sign space, every stage) · #44.5 (a disclosure touching
a gate's POPULATION triggers read-only sizing + commander sign-off before
the run) · PROBE-CONTRACTS (six threshold types; the sixth for every
"nothing changed" claim).

## 8. Stop rules

* Any X-family gate fails ⇒ FAIL, queue stops at the commander.
* Any watchability canary or scramble limb fires ⇒ stop outright,
  whatever the payoff instruments say.
* No re-cutting after sight: not the law's constants, not the exposure
  instrument, not the bands, not the pre-laid readings.
* Nothing ships (Road B): `c6Carry` is null/off in every production path
  through the whole contract; T2 ends with a verdict, never a default-ON.
* If T0 finds the turn-episode population too thin to power T1's gates
  (#24), the fork returns to the commander BEFORE T1 is drafted — a
  too-rare regime is a finding, not a licence to lower floors.

## 9. Registered non-claims

C6 v1 makes no de-glue claim: the pressured-carry regime keeps its glue
until a v2 contract with a pre-registered scramble ceiling (C1-B's break +
the #20 battery are its named derivation sources; the 1.6 s window
question lives there too). No touch cost ever enters through C6 (#12's
boundary). No shielding CHOICE is added anywhere in C6 — choices belong to
the decision layers under their own contracts; this contract only makes
the body-ball interface tell the truth about what bodies already do. The
slow-carry regime is accepted as-is. The keeper path (`Match.ts:1348-1372`)
and C7's wind-up seat are untouched. And the estimand boundary, stated
once: **C6 prices GEOMETRY, not value** — nothing in this contract claims
carrying pays or costs; it claims the ball is WHERE a body of that skill,
at that speed, in that turn, would actually have it.
