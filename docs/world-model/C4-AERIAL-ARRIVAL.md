# C4 — Aerial Arrival (design contract, commander-owned)

Status: **DRAFTED 2026-07-27 under ruling #26.3**, on the Phase-0 code map
([`C4-PHASE0-CODE-MAP.md`](C4-PHASE0-CODE-MAP.md), consumed). Stage
contracts pre-register individually (autonomous session, EDS pattern).
This document fixes scope, order, invariants and the gate; it is not
itself a frozen experiment.

Authority: VISION §1 (soul; the teammate-cooperation eye: "持球队友在边路
高位=要传中→我踩点包抄" is the LONG-TERM honest form) · §2 (watchability)
· §3.1 (边路武器库 anchors) · ruling #26 (road B: wide play's payoff
channel) · the two archived reverts at this seat (ROADMAP 1246-1306).

## 1. The measured case, from the map

* **The delivery is HEALTHY** — lead/pull/curl/one-touch all priced
  (`mechanics.ts:552-595`); the target scorer ranks who is ALREADY there
  (`PlayerBrain.ts:511-533`) and nothing anywhere sends a body into the
  box BECAUSE a cross is coming.
* **The contest is a one-tick radius-1.35 m lottery** with a dice term
  (`rng(0,0.45)`) the size of every skill term — no jump, no hang, no
  body position (`mechanics.ts:785-812`).
* ⛔ **The arrival aims at the WRONG radius**: the only wide-side arrival
  runner is routed to the CUTBACK arc target (`actionExecutor.ts:
  351-355`, 16 m out — Phase 31's spot) while a pulled cross lands near
  the penalty spot; non-runners hold BALL-relative supportSpots, so a
  wide ball drags support toward the touchline.
* ⭐⭐ **The corner machinery already solves timed box-filling** —
  3 crashers by aerialSense, `cornerCrashSpots`, nearest re-routed to
  the TRUE parabola landing, staged 4.5 m off before the kick
  (`actionExecutor.ts:304-349`). Open play has none of the three.
* **The two archived reverts bound the design**: a generic
  openness-value field EMPTIES the box (it is a low-openness contested
  zone — revert 1), and unsynced crashing explodes offside +50%
  (revert 2: bodies wanted to crash but ran on a different clock from
  the delivery). **The disease is the two clocks again** — E5g's
  overlap anatomy on a different part of the pitch.
* **The numbers that aim the slice**: balanced teams already fill
  decently (noAerial 26%); cross→goal ≈5% vs real football's 1–2% —
  **conversion is a CEILING, never a target**.

## 2. Scope of the first cut (v1)

C4 v1 is the ARRIVAL, not the contest and not the delivery:

IN:
1. **T0 — definitions + arrival census (instrument first).** Split
   `noAerial` BEFORE anything gates on it: (a) nobody-in-radius at ball
   arrival, (b) arrival-but-no-header (chest/ground control preempted),
   (c) header. Census where authorized runners and crashers actually
   ARE at cross arrival, per team archetype — the baseline every later
   stage pins against. Zero `src/**`.
2. **T1 — the routing fix, flagged and dormant** (`c4Arrival`): when the
   wide-attack context holds, the existing wide-side arrival runner's
   target becomes a BOX-CRASH spot (not the cutback arc), held
   onside-relative (the offside line is field geometry the eye already
   owns — revert 2's canary is a hard gate); and the corner machinery's
   SAFE half generalizes: **post-kick landing re-route** of the nearest
   crasher to the true parabola point (pure physics reading, no intent
   telepathy — the flight is observable). Legacy flags-off world
   bit-identical.
3. **T2 — probe A/B**: arrivals and CONTESTS up (both ends — defenders
   track too), offside canary in band, conversion ceiling held, the
   who's-there scorer's inputs improve measurably.
4. **T3 — live audit** (full #20 battery + the split-noAerial
   instruments + E4 preview round per #26.1).

OUT of v1, explicitly: the CONTEST's time dimension (run-up / jump /
hang / body position — C5/C7-family, its own later stage, "a duel model
without arrivals has nothing to contest" still binds); the dice
(`rng(0,0.45)` — registered for the attr-influence audit: a dice the
size of the skill terms means aerial attrs may be under-selectable by
evolution; re-scaling it is a balance change, own stage); the delivery
(healthy); `attacking = 0.3` (see I3); pre-delivery ANTICIPATION beyond
the already-authorized runner (the evidence-based crash trigger — a
body reading "winger wide and high" and starting early — is the honest
long-term form and belongs to Stage III / the perception layer, where
the teammate-cooperation eye lives).

## 3. Design invariants — the map's six questions, ruled

* **Q1 — C4 v1 is the ARRIVAL link.** Delivery healthy (untouched);
  contest physics deferred until there are bodies to contest; the
  mis-aim + the safe half of the corner machinery are the actionable
  truths.
* **Q2 — the corner machinery generalizes by HALVES.** The post-kick
  half (landing re-route) is pure observable physics and generalizes
  now. The pre-kick half (staged, timed crashers) requires knowing the
  delivery moment — corners know it by rule; open play knows it only
  through evidence or doctrine. v1 takes the post-kick half plus the
  routing fix of the ALREADY-authorized runner (he already starts
  early; he just runs to the wrong spot). The full anticipatory form
  waits for the perception/positioning layer — never a hand trigger.
* **Q3 — 1.35 m stays, for now.** The radius is a deliberate
  simplification; the missing TIME in the contest is real and is the
  same family as C5/C7 — its own stage, after arrivals exist. Fixing
  the contest before the arrival would tune a lottery nobody attends.
* **Q4 — `attacking = 0.3` is a NAMED SUBSIDY (I3).** It stands in for
  a real arriving body. It stays in v1 (removing it is a balance
  change), and T3 MEASURES whether it double-pays once real arrivals
  exist; its removal is its own pre-registered step. The stagnation
  precedent applies: neither copied forward nor silently deleted.
* **Q5 — CONVERSION IS A CEILING (I2, hard invariant).** cross→goal is
  already ≈5% vs the real game's 1–2%. Every stage carries
  conversion-non-increase as a HARD gate; the deliverable is CONTESTS
  (headers, both ways, arrivals), never goals. A stage that raises
  conversion fails even if everything else passes.
* **Q6 — split `noAerial` FIRST (T0).** "No header" ≠ "nobody there";
  an aerial contract gating on the conflated number would repeat the
  E5a window defect (one number, two meanings). The split definitions
  pin separately per #18.

## 4. Gate sources (frozen per stage at pre-registration)

T0's own census as the baseline pins; the offside canary derived from
revert 2's +50% blast (band pre-registered ex ante); the §2 band
verbatim; conversion ceiling from T0's measured baseline; #20
CI/cluster semantics; #19+#24 floor discipline; perf budget; the
corner machinery's banked behaviour as the reference implementation
(its own tests must stay green untouched).

## 5. Stop rules

Any stage FAIL → the commander; the offside canary or conversion
ceiling firing stops the queue outright; no contest-physics work may
begin until T3 lands (sequencing guard); population law #26.5 — C4
landing live invalidates the value tables; re-census before any
chooser work resumes.

## 5.5 Re-aim amendment (commander ruling #30, 2026-07-27 — on T0R+T0b)

T0b closed C2 with residual zero and the frozen #28.4b rule lands on
HEIGHT-DOMINATED pooled (H0 56.78%) — while the archetype split (CROSS
59–61% vs BAL 46–54%, BAL's deliveries 76–84% headable) makes this the
MIXED branch in substance. Sequenced on the measured shares:

* **v1's first stage is now T1-FLIGHT**: a flagged change to delivery
  FLIGHT (CROSS-archetype peaks median 1.00–1.06 m vs the 1.35 m band
  floor — the ball must get up), aim geometry untouched (Q1's surviving
  half), mechanism derived from code in the stage's own pre-registration,
  deliverable = headable share toward BAL's, guards = I2 HARD + §2 band +
  the full #20 battery. If honest flight makes crossing genuinely better
  and evolution selects more of it, that is emergence, not a defect —
  the ceiling and the band are the guards, not a hand re-tune.
* **The T0b ladder re-runs in T1-FLIGHT's audit** — the partition-not-
  causal caveat is answered by measurement: whatever H3 margin survives
  the flight fix is T2-ARRIVAL's measured target.
* **T2-ARRIVAL (on the residual only)**: the corner machinery's post-kick
  landing re-route (Q2's safe half — the direct answer to H3's
  half-metre) + the box-crash routing fix with the offside canary, the
  original T1 scope demoted to and folded here (C1 = 5.70pp).
* **I2's reference is RE-NAMED with cause, superseding #28.5**: the T0R
  census's banked per-combination rates (pooled build+held-out; marginals
  10.48/11.94%) — T0's 10.27/10.73 came from blocks whose coverage cert
  failed on a cell. The 1.2pp block-to-block spread means I2 is judged
  under #20 CI semantics, powered ex ante, never point-vs-point.
* Banked sentence for every later stage: **nobody is absent — the aerial
  game fails by a third of a metre of flight and half a metre of
  arrival** (H3 nearest man 1.75–2.20 m; H1 keeper = 0, claims live in
  C0). H2 chest-trap 1.37% retires that hypothesis.

## 6. What C4 unlocks on PASS

Wide play becomes a real payoff channel: a cross has someone at the
end of it, an aerial contest has attendance, and the value re-census
can price wide balls on what they can now genuinely cash — the road-B
precondition for width-based combinations returning measured, not
subsidized. Registered non-claims: conversion does not rise; overlap
stays where measurement puts it; the contest stays a lottery until its
own time-dimension stage.
