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

## 9. C1-A RESULT — substrate LANDED, ledger FAILED (2026-07-24)

Two separable things were gated. Splitting them is the whole content of this
result.

### 9.1 The substrate passed its own gates

```text
production fingerprint   57b0bdab…c673 UNCHANGED   ⇒ power 1.0 is inert
tsc --noEmit             clean
full suite               702/702 (5 new C1-A tests)
```

Power is now executable and mis-executable: `performPass` takes an intended
`powerChoice` clamped to `[0.85, 1.15]`, leads the receiver on the power it
MEANT, strikes at the executed power, and the technique-scaled magnitude error
is drawn only off 1.0. Unit tests pin: no extra RNG draw at 1.0, the untouched
17.2 m/s launch for a 15m straight pass, monotone launch speed in power, band
clamping, technique-scaled spread inside `[0.70, 1.30]`, and the intended-power
lead (a rolled ball is led ~19.4° ahead vs a drilled ball's ~14.6°).

### 9.2 The anatomy ledger FAILED — and the cause is the measurement, not the ball

`scripts/probes/pass-power-anatomy.ts`, 120/120 accepted on seeds
`92,000..92,119`, 86 contested, deterministic across two invocations, SHA
`249f7e41…c90a`. Verdict **FAIL**:

```text
G1 contested interception   0.477 / 0.570 / 0.430   ✗ not monotone
G2 reception failure        0.458 / 0.500 / 0.392   ✗ wrong direction
G3 mean arrival time        0.536 / 0.474 / 0.469s  ✓
G4 mean arrival speed       7.99 / 9.84 / 11.33     ✓
executed-power band         8 branch "violations"   ✗ (metric artifact, see below)
```

Paired per-state anatomy names the cause:

* against the 1.00 arm, contested interceptions flip 22→controlled vs 8→
  intercepted for **1.15**, and 16→controlled vs 7→intercepted for **0.85**.
  *Both* deviations beat 1.00. A monotone speed effect cannot do that; a
  privileged baseline can — and 1.00 is privileged by this contract's own
  design, because it is the only arm that draws no execution gaussian, so it is
  the only arm whose post-kick world is not RNG-shifted. Over a 180-tick
  resolution window that divergence dwarfs the direct effect.
* the pure touch-quality signal, measured only where the intended target
  actually touched the ball, is **12.9% / 10.6% / 12.5%** spilled — tiny and
  non-monotone, exactly the ~1–3pp magnitude Phase 0 predicted, and far below
  what n≈70 can resolve. G2 additionally lumped interceptions into "reception
  failure", so it was mostly measuring G1 again.
* the 8 band "violations" are a proxy artifact: the probe inferred executed
  power from `launchSpeed / referenceSpeed`, but the launch distance itself
  changes with the intended power (the lead moves), so at the `clamp(…, 9, 22)`
  boundaries the ratio is not the power ratio. The code-level clamp is exact and
  is unit-tested directly on fixed geometry.

Nothing was tuned and no gate was rewritten. Per §8.3, G2's failure fires the
"reception cost is not measurably real" branch, which makes **C1-B mandatory
rather than optional** — the same conclusion the commander ruling already
reached, now on measured ground. G1's failure does NOT fire its stop rule's
stated premise ("the choice layer would be pricing a phantom"): between 1.00 and
1.15 interception falls 14pp in the predicted direction. What is refuted is this
probe's ability to isolate the effect.

## 10. C1-A2 — PRE-REGISTERED re-pose of the ledger (2026-07-24, no run yet)

Same question, three confounds removed. Probe-only: **no `src/**` change is
authorised**, so the fingerprint cannot move.

### 10.1 The three fixes

1. **No privileged baseline.** Every arm consumes exactly one execution
   gaussian: the middle arm is struck at `1.00001`, whose noise σ ≈ 5e-6 is
   arithmetically inert but consumes the same draw. A per-branch RNG-draw audit
   asserts all three arms consume an identical count.
2. **Fixed corridor.** Acceptance requires a near-stationary intended receiver
   (`|vel| <= 0.5 m/s`), so the lead point — and therefore the corridor and the
   pass distance — is the same for all three powers. Power then varies speed and
   nothing else.
3. **Judge the FLIGHT, not three seconds of world.** The outcome is decided by
   the FIRST body to touch the ball (opponent / intended target / other), and
   touch quality is measured only where the intended target is that first
   toucher. Post-flight world evolution never enters a gate.

### 10.2 Frozen gates

```text
accepted states                 120  (fresh seeds 93,000.., max 512)
per-arm RNG draw counts equal   100% of states
non-finite / not-struck         0
two invocations byte-identical  shared SHA-256
fingerprint                     57b0bdab…c673 unchanged

H1 first-toucher-is-opponent, CONTESTED corridors (lane <= 0.50)
      strictly decreasing 0.85 > 1.00 > 1.15, spread >= 3.0pp
H2 touch failure | intended target is first toucher
      strictly increasing 0.85 < 1.00 < 1.15, spread >= 1.0pp
H3 mean flight time to first touch, strictly decreasing with power
H4 mean speed at first touch, strictly increasing with power
```

H1/H2 keep C1-A's frozen spreads verbatim — they were derived from Phase 0's
friction table and `touchFailChance`, not from anything seen since, and are
deliberately not widened after a FAIL.

### 10.3 Stop rules

* **H1 fails** → the interception machinery genuinely does not price ball speed;
  park the C1 choice layer for good and report (C1-B, being a reception-cost
  fix, still stands on its own).
* **H2 fails** → reception cost is architecturally negligible at current
  thresholds. That is not a C1-A2 failure to rescue: it is the C1-B mandate,
  confirmed on an isolated measurement. Do not fake the cost at the evaluator.
* A third re-pose is NOT authorised. If C1-A2 cannot isolate the effect either,
  the ledger question returns to the user.

## 11. C1-A2 RESULT — the ledger, finally clean (2026-07-24)

`scripts/probes/pass-power-anatomy-isolated.ts`. 120/120 accepted in 127 scanned
seeds (`93,000..93,126`), 92 contested, no `src` change, two invocations
byte-identical, SHA `7e0ff4d5…257b`. Every arm spent exactly 4 uniforms at the
kick (aim gaussian + execution gaussian) in 120/120 states — the privileged
baseline is gone.

```text
H1 opponent touches first, CONTESTED    0.565 / 0.489 / 0.391   ✓ (spread 17.4pp, gate 3.0)
H2 touch failure | target touched first 0.119 / 0.121 / 0.118   ✗ FLAT (gate: rising, 1.0pp)
H3 mean flight time to first touch      1.187 / 1.126 / 1.023s  ✓
H4 mean speed at first touch            7.47 / 8.97 / 11.08     ✓
ball reaches the intended man first     59 / 66 / 76 of 120      (monotone, diagnostic)
```

**Verdict: FAIL on H2 — and it is the most useful failure available.** Removing
the three confounds turned C1-A's noise into a crisp, monotone benefit: a
drilled ball is cut out on contested corridors **17.4 percentage points less
often** than a rolled one, and reaches the intended receiver first in 76 of 120
states instead of 59. So H1's stop rule does NOT fire: the interception
machinery prices ball speed exactly as `canInterceptPass` reads on paper, and a
choice layer would not be pricing a phantom.

The cost side, measured in isolation for the first time, is **nothing**. A ball
arriving at 11.1 m/s instead of 7.5 m/s spills at 11.8% versus 11.9%. The
formula predicts a ~2.7pp difference (`clamp01((speed-6)/8)*0.07` gives 0.013 at
7.5 and 0.045 at 11.1, technique-scaled) — smaller than this design's resolution
(SE ≈ 3.9pp per arm at n ≈ 70), and the point estimate is dead flat either way.

So the four-revert convexity danger is now **measured, not feared**: today the
substrate offers a 17pp risk reduction for an unmeasurable receiving penalty.
Any choice layer built on this ledger would learn "always hit it harder", which
is not football.

Per §10.3 this fires the H2 branch precisely: reception cost is architecturally
negligible at current thresholds ⇒ **C1-B is the mandated next step**, not an
optional one, and the cost must be fixed in the substrate (M3 control), never
faked at the evaluator. C1-C stays deferred into the Embodied Decision Slice as
ratified. No third re-pose of the ledger is needed or authorised — the ledger is
now trustworthy; it is the ball that is wrong.

## 12. C1-B — PRE-REGISTERED: honest speed-dependent control cost (2026-07-24)

The first LIVE gameplay change since M4. Mandated by C1-A2's H2 branch, ratified
by the user in `PROGRAMME.md` §0.5. **The user's play-test is the final gate and
is not delegated.**

### 12.1 The diagnosis this fixes

`touchFailChance` (`mechanics.ts:95-107`) prices arrival speed as
`clamp01((speed - 6) / 8) * 0.07`: free below 6 m/s, saturated at 14, worth at
most 0.07 raw. C1-A2 measured where ordinary passes actually live — **7.5 to
11.1 m/s at first touch** — so the curve spends its dynamic range below and above
the real distribution and charges a 3.6 m/s difference nothing measurable
(11.9% / 12.1% / 11.8% spill across the whole power sweep). 停不好重球 is
currently almost free, which is why the pass-power choice layer would degenerate
into "always hit it harder".

### 12.2 The change (one dimension, one line)

```
clamp01((speed - 6) / 8) * 0.07   →   clamp01((speed - 6) / 16) * 0.24
```

Nothing else moves: the free threshold stays at 6 m/s (a rolled ball is genuinely
easy), and the pressure, blind-side, positioning and technique terms are
untouched.

Derivation, from measured numbers only:

* **`8 → 16`** moves saturation from 14 m/s to 22 m/s — the ordinary ground-pass
  launch cap — so the curve's slope covers the measured arrival band with
  headroom for drilled balls, instead of flat-lining inside real play.
* **`0.07 → 0.24`** sets the rolled-versus-drilled spread C1-A2 measured
  (7.5 → 11.1 m/s) at ≈5.4pp of raw touch failure. That is the same order as the
  17.4pp interception swing power buys, so neither side of the future choice
  dominates by construction.
* At the current live mean arrival (9.8 m/s) the raw term moves 0.033 → 0.057,
  i.e. roughly +2pp of actual touch failure after technique scaling: a bounded
  live cost, not a regime change.

### 12.3 Frozen baseline (8-season calibrate, seed 20260702, 568 matches)

```text
goals/match 2.39 · xG 2.11 · passes 88.68 (completion 71%)
crosses 2.49 · headers won 9.10 · long balls 6.20 · cutbacks 3.82
miscontrols 6.98 · tackles 12.21 · interceptions 21.11
fingerprint 57b0bdab…c673
```

### 12.4 Frozen gates

```text
FIRES  C1-A2 probe re-run, unchanged code and seeds 93,000..:
       H2 now PASSES (touch failure strictly increasing with power,
       spread >= 1.0pp), and H1/H3/H4 still pass

WORKS  8-season calibrate, same seed:
       miscontrols/match rises >= 5% relative      >= 7.33
       miscontrols/match stays bounded             <= 9.77  (+40%)
       pass completion falls at most 3pp           >= 68%

PAYS / §2 EQUILIBRIUM BAND (hard abort, C1 §4 verbatim):
       goals/match within ±15%                     2.03 .. 2.75
       crosses within ±25% relative                1.87 .. 3.11
       headers won within ±25% relative            6.83 .. 11.38
       long balls within ±25% relative             4.65 .. 7.75
       cutbacks within ±25% relative               2.87 .. 4.78

EXACT  tsc clean · full suite green · fingerprint WILL move and is recorded ·
       perf baseline re-run and recorded (governance rule 2)

USER   play-test acceptance — the final gate, never delegated
```

A suite test that encodes the OLD touch numbers and fails is a **finding to
report**, not something to silently re-baseline.

### 12.5 Stop rules

* §2 band break ⇒ **honest revert** to the C1-A substrate, report which
  dimension broke. A second band break on any redraw returns the fork to the
  user (the four-revert lesson: treat drift as structural, not tunable).
* FIRES fail ⇒ the change did not reach the mechanism it targets; revert and
  report rather than raising the weight.
* No parameter may be re-tuned after seeing results, and the play-test verdict
  may not be pre-empted by good numbers.
