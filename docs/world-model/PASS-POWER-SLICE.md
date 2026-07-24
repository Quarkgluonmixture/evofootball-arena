# C1 — Pass power as a priced choice (substrate slice)

Status: **PHASE 0 COMPLETE 2026-07-24 (§6) — the answers REVISE Phases 1–2.
The premise survives; the Phase-2 shape written in §4 does not. Fork in §7 is
the user's.** Phase 1–2 remain frozen-as-written text below for the record.

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

## 6. Phase 0 RESULT (2026-07-24, no code written)

### Q1 — who chooses, who executes, where power would enter

* **Chooser:** `PlayerBrain.ts:272-420` — the on-ball pass loop scores every
  teammate: `s = W.passBase + lane*W.passLaneW + open*W.passOpenW`
  (`PlayerBrain.ts:321`), where `lane = laneOpenness(...)` (`PlayerBrain.ts:279`)
  and `open = opennessOf(mate, ...)` (`:283`), then multiplied by style/tilt
  terms (`:288-319`). The winner is emitted as an action at `:405-411`.
* **Executor:** kicks fire at decision time (`PlayerBrain.ts:23`), so
  `PlayerBrain.ts:817` → `Match.performPass` (`Match.ts:712`) →
  `mechanics.performPass` (`mechanics.ts:281`).
* **The seat already exists.** `performPass` computes
  `misalign = kickMisalignment(...)` and `powerMul = orientationPowerMul(misalign,
  passing)` (`mechanics.ts:288-289`) = `1 - misalign*0.22*(1-technique*0.4)`
  (`mechanics.ts:85-87`), then uses it in BOTH the lead
  (`flight = d / (16*powerMul)`, `:292`) and the launch
  (`speed = clamp(d*0.6+8.2, 9, 22) * powerMul`, `:298`). A chosen power is
  therefore one extra factor at exactly these two lines, and the "lead and kick
  agree on the effective speed" contract (`:286-287`) is already explicit and
  already honours a non-1 multiplier. Plumbing cost: near zero.
* `prediction.ts:50-74` (dormant) mirrors these formulas and already takes
  `powerMultiplier`; nothing live reads `passAffordance`/`passValue`/
  `passCorridorInterception`.

### Q2 — does reception already cost more for a hot ball? YES, but weakly

Path: contact claim records `relativeSpeed = |ball.vel - p.vel| + |vz|*0.6`
(`Match.ts:1982-1990`) → `pendingControl` after `CONTACT_CONTROL_DELAY_TICKS = 3`
(`Match.ts:2032-2037`) → `attemptFirstTouch` (`Match.ts:2053`) →
`touchFailChance` (`mechanics.ts:95-107`):

```
raw = 0.01 + clamp01((speed-6)/8)*0.07 + (pressure*0.1 + misalign*0.05)*aware
pFail = clamp(raw * (1.3 - technique*0.85), 0, 0.4)
```

Speed enters through one term that is **zero at ≤6 m/s and saturated at 14 m/s**,
worth at most `0.07` raw. `attemptFirstTouch` also short-circuits free at
`speed <= 6` (`mechanics.ts:130`). Computed against the engine's own friction
(`k=0.55`, `DT=1/60`, geometric decay per `prediction.ts:29-41`):

| pass distance | power | launch | arrival time | arrival speed | speed-term pFail |
|---|---|---|---|---|---|
| 8m | 1.00 | 13.0 | 0.750s | 8.6 | 0.023 |
| 8m | 1.15 | 14.9 | 0.633s | 10.6 | 0.040 |
| 15m | 1.00 | 17.2 | 1.183s | 9.0 | 0.026 |
| 15m | 1.15 | 19.8 | 0.983s | 11.5 | 0.048 |
| 20m | 1.00 | 20.2 | 1.433s | 9.2 | 0.028 |
| 20m | 1.15 | 23.2 | 1.167s | 12.2 | 0.055 |
| 25m | 0.85 | 18.7 | 2.400s | 5.0 | 0.000 (free touch) |

So the cost is real and un-saturated (arrivals live at 8–12 m/s, on the shallow
part of the curve) but **small**: +0.022 raw at 15m for a 1.15 ball, i.e.
+0.010 pFail for an elite receiver (technique 1.0 ⇒ ×0.45) to +0.029 for a poor
one (×1.3). Receiver velocity subtracts (relative speed), so running onto the
ball discounts it further.

Against that, the same 15m step buys **−0.20s of flight (−17%)**, and the
benefit compounds: the interceptor threshold `CONTROL_MAX_SPEED = 14`
(`constants.ts:240`) applies to non-intended players while the intended target
gets `24` (`Match.ts:1978`), so a hard ball also demotes a mid-corridor
defender from `controlAttempt` to `deflection` (`Match.ts:1979`). **Benefit and
cost both exist, but they are roughly an order of magnitude apart in favour of
power-up** — precisely the convex option-inflation the §1 danger note names.

### Q3 — does the defensive read price faster balls? ONLY AFTER THE KICK

* **In flight (yes):** `canInterceptPass` (`perception.ts:300-311`) computes
  `tBall = along / max(|ball.vel|*0.7, 4)` and fires `InterceptPass` only when
  `tMe < tBall*0.95`. Called at `PlayerBrain.ts:1070`, gated on
  `match.pendingPass` — i.e. a ball already travelling.
* **At decision time (no):** `laneOpenness` (`perception.ts:133-144`) is the
  worst perpendicular opponent distance to the segment, clamped at 4m;
  `opennessOf` (`perception.ts:197-204`) is nearest-opponent distance to the
  receiver /8. **Neither contains ball speed, flight time or any time at all.**
  Every other multiplier in the pass loop (`:288-319`) is likewise
  power-invariant.

### Q4 — pass execution noise: technique-scaled, but DIRECTION only

`mechanics.ts:304-312` sprays the **aim**:
`gaussian * (0.02 + pressure*0.07 + d*0.0015) * (1.15 - passBias*0.3) *
(1 - confidence*0.12) * (1.25 - passing*0.5) * oneTouchMul * orientationNoiseMul`
— technique-scaled, yes, but applied as a rotation. **There is no
power/weight magnitude noise anywhere on the live kick path.** The only thing
named a weight error is `bentKick`'s `weightErr` (`mechanics.ts:275-277`), and
it too is added to the rotation angle, not the speed. So "a poor passer's
weighted ball arrives hot or short" is genuinely new substrate; its seat is the
`speed` expression at `mechanics.ts:298`.

## 7. Phase-0 verdict and the fork (judged against the C-track template)

**Premise survives, Phase-2 shape does not.** The template demands options
"priced by EXISTING evaluators". Phase 0 shows the existing *decision-time*
evaluator is completely speed-blind (Q3), so scoring one candidate at 0.85 /
1.00 / 1.15 through it returns **three identical scores**: the six-layer FIRES
gate fails by construction, before any balance question. The machinery that does
price power (`canInterceptPass`, `touchFailChance`, the dormant
`passCorridorInterception`) is not consulted by the passer.

Also triggered: §3's conditional. The reception cost is not missing but is
weak and asymmetric (Q2) — power-up buys ~17% of flight time for ~1–3pp of
touch failure, and additionally demotes interceptors to deflections. Shipping a
choice on that ledger is the four-revert inflation pattern with extra steps.

Three honest continuations, in ascending risk — **the user's call**:

* **C1-A (substrate only, dormant + bit-identical).** Plumb an explicit
  `powerMultiplier` through `performPass`'s lead+launch seat with every live
  call at 1.0, and add technique-scaled magnitude noise that is only drawn when
  power ≠ 1 (so the RNG stream and fingerprint are untouched); then run the
  §3 `pass-power-anatomy` directional probe. Banks executable power and its
  measured ledger without any live behaviour. No user gate needed beyond this
  report.
* **C1-B (the real substrate fix, LIVE, user-gated).** Make control difficulty
  honestly speed-dependent at the M3 layer — the 6→14 m/s window is too narrow
  and too shallow for the 8–12 m/s band real passes arrive in, which is why
  停不好重球 is currently almost free. §2-gated on its own, fingerprint moves,
  play-test. This is worth doing whether or not the choice layer ever ships.
* **C1-C (the choice layer, redrawn).** Only viable if the passer gets ONE
  power-sensitive term. Cheapest honest version: price the candidate through
  the receiver-side cost that already exists (`touchFailChance` on predicted
  arrival speed) plus flight time, rather than importing corridor interception
  into the live decision — the latter is the S3b/S7b family that failed at PAYS
  twice. Needs its own pre-registration; not authored here.

Recommended order: **C1-A → C1-B → re-ask C1-C on C1-B's ledger.**

**User ratified 2026-07-24** (commander ruling in `PROGRAMME.md` §0.5): C1-A now
(dormant, autonomous), **C1-B GO as the next LIVE slice** with the play-test
gate kept, **C1-C DEFERRED into the Embodied Decision Slice** — teaching the
evaluator to price time/speed belongs to the S3b-redo bundle, not a patch on
`laneOpenness`.

## 8. C1-A — PRE-REGISTERED (2026-07-24, no run yet)

Dormant substrate: power becomes executable and mis-executable, while every
live call stays at 1.0. Nothing chooses a power yet.

### 8.1 Authorised change set

* `src/sim/mechanics.ts` `performPass` only (ordinary ground passes; through
  balls, lofted passes, cutbacks, crosses and shots are OUT of scope):
  * an optional intended `powerChoice = 1`, clamped to
    `[PASS_POWER_MIN, PASS_POWER_MAX] = [0.85, 1.15]` (the §3 sweep band);
  * **intended vs executed asymmetry** — the passer leads the receiver on the
    power he MEANT (he cannot know his own error, exactly as body misalignment
    IS known up front and therefore already enters both), while the ball leaves
    at the EXECUTED power. This is the causal seat of 力度 failure;
  * technique-scaled magnitude noise, in `bentKick`'s existing weight-error
    shape: `gaussian * |powerChoice - 1| * PASS_POWER_NOISE_K * (1.35 -
    passing)` with `PASS_POWER_NOISE_K = 0.60`, so an average passer's 1.15 ball
    carries σ ≈ 7.7% of power and an elite passer's ≈ 3.7%. Executed power is
    clamped to `[0.70, 1.30]`.
  * **The noise is drawn ONLY when `powerChoice !== 1`** — at power 1.0 no RNG
    is consumed and every formula is arithmetically identical, which is what
    makes the fingerprint gate meaningful.
* `src/sim/Match.ts` `performPass` passthrough.
* `src/sim/constants.ts`: the four constants above.
* New `scripts/probes/pass-power-anatomy.ts` + new unit tests.

Live callers are NOT touched: `PlayerBrain` keeps calling with no power
argument. If anything else seems to need changing, that is an escalation.

### 8.2 Frozen gates

Exact validity:

```text
production fingerprint            57b0bdab…c673 unchanged   (proves power 1.0 is inert)
tsc --noEmit + full suite         clean / all green
probe runs                        two invocations byte-identical, shared SHA-256
accepted states                   120   (max 384 seeds from 92,000)
executed-power band violations    0
non-finite / schema failures      0
```

Directional mechanism (sweep 0.85 / 1.00 / 1.15 on the SAME frozen state, each
arm branching from identical RNG at the kick):

```text
G1 interception rate, CONTESTED corridors (freeze laneOpenness <= 0.50)
      strictly decreasing 0.85 > 1.00 > 1.15, total spread >= 3.0pp
G2 intended-target reception FAILURE rate (contacted but never controlled,
   or never reached)
      strictly increasing 0.85 < 1.00 < 1.15, total spread >= 1.0pp
G3 mean arrival time strictly decreasing with power (sanity: the physics
   actually delivers the benefit)
G4 mean arrival speed strictly increasing with power
```

Derivation, from banked numbers only: Phase 0's friction table gives a 15m
1.15 ball −0.20s of flight (−17%) and pushes mid-corridor speed past
`CONTROL_MAX_SPEED = 14`, demoting an interceptor from `controlAttempt` to
`deflection` — so G1's spread is set at a deliberately modest 3.0pp (the
effect should be larger; the gate must not be vacuous, and must not be
tuned upward after seeing results). G2's 1.0pp comes from the same table's
`touchFailChance` speed term: +0.022 raw between 1.00 and 1.15 at 15m, scaled
by technique to +0.010…+0.029 — a ~1–3pp effect, so 1.0pp is the honest floor.
G3/G4 are near-tautological physics checks that catch a plumbing error.

### 8.3 Stop rules

* **G1 fails** (interception does not fall with power): the interception
  machinery does not price speed the way `canInterceptPass` reads on paper →
  park C1 entirely and report; the choice layer would be pricing a phantom.
* **G2 fails** (a hot ball costs the receiver nothing measurable): this is the
  §5 "reception cost architecturally absent" branch, and it makes **C1-B the
  mandatory next step rather than an optional one** — do not fake the cost at
  the evaluator layer.
* Fingerprint drift: revert; the plumbing leaked into live behaviour.
* No threshold shopping, no widening the power band, no re-running with
  different seeds after seeing results.
