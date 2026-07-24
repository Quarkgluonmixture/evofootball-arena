# C1 — Pass power as a priced choice (substrate slice)

Status: **DRAFT — frozen in shape; execute after B1; user play-test is the
final gate. Phase 0 reports back before any code.**

Date: 2026-07-24

## 1. The verdict and the emergence framing

Today launch speed is a pure distance formula: `prediction.ts:65`
`launchSpeed = clamp(distance*0.6 + 8.2, 9, 22) * power`, and every live
caller passes `power = 1`. Pass weight is therefore not a fact a player
chooses, succeeds at, or fails at — the 力度 dimension the user named has no
causal seat in the world.

The emergence-honest form is NOT "when to power up" rules. It is:

* **substrate**: power is a continuous input with honest consequences on BOTH
  ends — faster arrival vs harder first touch/control for the receiver, and a
  changed interception race for defenders (both already priced by existing
  machinery: `passCorridorInterception` consumes `launchSpeed`; M3 separates
  touch from control);
* **choice**: the live passer evaluates the SAME candidate at 2–3 power
  levels through the EXISTING pass evaluator — no new scoring rule, the
  option set just gains a dimension;
* **execution**: technique-scaled noise on delivered power (a poor passer's
  weighted ball arrives hot or short);
* **emergence**: which situations reward which weights is discovered by
  selection, never authored.

Known danger (four prior reverts): option-selection is convex — enriching
only the attacking max inflates goals. Power-up must carry a REAL, measured
reception/interception cost before the choice layer may ship.

## 2. Phase 0 — map the live path (report back, no code)

The dormant probe layer accepts `powerMultiplier`; the LIVE path may not.
Answer with file:line evidence:

1. Which exact functions choose and execute the live pass today
   (PlayerBrain → executor kick), and where would a power option enter?
2. Does receiver control difficulty already scale with arrival ball speed
   (M3 control attempt / first-touch misalign), and by how much? If a hot
   ball costs nothing at reception, say so — that gate blocks Phase 2.
3. Does the live defensive read price faster balls (shorter corridor time)?
4. Where does pass execution noise live today, and is it technique-scaled?

STOP after Phase 0 and report to the user. Phases 1–2 proceed only on their
say-so, possibly revised by the answers.

## 3. Phase 1 — substrate (directional probes, no live choice yet)

* Plumb chosen power through the live kick so a non-1 multiplier is
  executable; keep every live call at 1.0 (bit-identical fingerprint gate).
* If Phase 0 found reception cost missing/weak: make control difficulty
  honestly speed-dependent at the M3 layer FIRST, §2-gated alone (this is a
  real substrate fix in its own right — 停不好重球 is football).
* Directional probe (`scripts/probes/pass-power-anatomy.ts`): sweep power
  0.85/1.00/1.15 on frozen pass situations; gates are directional —
  interception rate falls with power on contested corridors, reception
  failure rises with power, both monotonic. Two-run deterministic SHA.

## 4. Phase 2 — the live choice (six-layer, PROBE-CONTRACTS)

* The passer's existing evaluator scores each candidate at the 2–3 power
  levels; the max is taken as today. No new genes yet (house rule: gate on
  existing attrs first; technique already prices execution).
* Six-layer acceptance: fires (options actually diverge) ≠ works (chosen
  power tracks corridor pressure directionally) ≠ pays (paired A/B: pass
  completion into pressure improves without goal inflation) ≠ selected
  (later, evolution runs) ≠ good football (user play-test).
* **Equilibrium band (hard abort):** 8-season paired calibrate goals within
  ±15% of baseline AND route mix intact (aerial/cross/carry shares within
  ±25% relative) — the four-revert lesson says treat drift as structural,
  not tunable.
* Fingerprint WILL change at Phase 2 ship; rebaseline per PROGRAMME
  governance rule 2 (land between Track-A experiments only).

## 5. Stop rules

* Phase 0 answers kill the premise (e.g. reception cost architecturally
  absent and un-addable at M3) → park, report; do not fake the cost at the
  evaluator layer.
* Phase 1 directional gates fail → the physics doesn't support the choice;
  park; no threshold shopping.
* Phase 2 equilibrium band breaks twice → honest revert, keep Phase 1
  substrate, return the fork to the user (the [`revert→reframe`] discipline).
* Never: hand-written power heuristics ("through balls get 1.15"), new genes
  without data, one-sided attacking wiring.
