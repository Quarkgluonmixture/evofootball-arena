## Bottom line

No: the nine attributes do not currently matter equally or distinctly.

My read is:

- **Pace and defending are disproportionately powerful.**
- **Dribbling is powerful but acts as a catch-all “technique” stat.**
- **Passing, finishing, stamina, and reflexes are live, but each has modelling gaps.**
- **Strength is weak and narrow.**
- **Positioning is effectively a first-touch attribute, not game reading—and is dead for goalkeepers despite consuming their budget.**

I would **not add a tenth `vision` attribute yet**. I would turn the existing `positioning` gene into a genuine, general-purpose **awareness/game-reading attribute**, preserving the current budget dimensionality. The project has correctly identified a missing “eye”, but an attacker-only lane-openness multiplier is the wrong implementation: it creates optimism, not perception.

## 1. Attribute audit

| Attribute | What it actually does | Assessment |
|---|---|---|
| `pace` | Raises top speed and acceleration; fatigue then modulates that speed. It also separately protects the carrier during tackles even though actual carrier velocity is already included. [Player.ts:170](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:170), [mechanics.ts:1661](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1661) | **Overpowered and double-counted.** It also erroneously unlocks `engine`, which reduces stamina drain. |
| `passing` | Reduces pass noise and improves loft, through-ball, cross, cutback, and free-kick execution. [mechanics.ts:271](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:271) | **Live and reasonably distinct**, but ordinary ground-pass selection barely values it. Its effect is more visible on ambitious delivery than routine circulation. |
| `dribbling` | First touch, one-touch execution, ball push/noise, action cadence, tackle resistance, hold-up scoring, and some shot curl/orientation. [mechanics.ts:95](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:95), [actionExecutor.ts:329](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:329) | **Overloaded.** It conflates close control, first touch, ball carrying, press resistance, and parts of striking technique. |
| `finishing` | Shot aim, spread, power/composure, heading, chips, and free kicks. The brain intentionally does not make high finishers shoot more often. [PlayerBrain.ts:187](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:187), [mechanics.ts:1036](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1036) | **Live but one-dimensional:** mostly chance conversion. Keeping shot preference separate from quality is a good emergent design choice. |
| `defending` | Marker reaction, tackle/slide success, deflections, blocks, aerial contribution, and the disruption of contested finishing. [actionExecutor.ts:206](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:206), [mechanics.ts:1682](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1682) | **Very strong and overloaded.** Marking discipline, anticipation, tackling, blocking, and aerial defence cannot evolve independently. |
| `strength` | Some aerial contest value, carrier shielding, and punt-target preference. [mechanics.ts:635](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:635) | **Weak and narrow.** It does not meaningfully govern ground collisions, hold-up selection, displacement, balance, or header power. |
| `stamina` | Drain, recovery, fatigue, top-speed loss, and eligibility for some overlap behaviour. [Player.ts:233](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:233), [Player.ts:312](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:312) | **Genuinely live**, but its identity is weakened by the `engine` trait bug. |
| `reflexes` | Goalkeeper reach, claims, smothers, and save probability. [mechanics.ts:26](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:26), [mechanics.ts:1863](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1863) | **Strong and distinct for GKs; completely dead outfield.** The budget excludes it outfield, correctly, but displays/style naming do not. |
| `positioning` | Reduces first-touch and chest-trap failures. [mechanics.ts:95](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:95), [mechanics.ts:819](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:819) | **Misnamed and weak.** It does not affect positioning, runs, marking, support, anticipation, or perception. GK first touch bypasses the check, making it dead for GKs. |

### Important implementation problems

**The budget is not actually liveness-aware.** Goalkeepers pay for `positioning`, `strength`, and `dribbling`; the first is dead and the others are marginal edge-case attributes. [playerGenome.ts:167](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerGenome.ts:167)

Moreover, `enforceBudget` computes the cap from selected attributes but then scales **every** attribute, including excluded ones. [playerGenome.ts:184](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerGenome.ts:184) That is defensible as a normalization shortcut, but it is not conceptually clean and complicates interpreting selection pressure.

Presentation is also liveness-blind: all attributes participate in player descriptors, so an outfielder can receive a reflex-based “spring cat” identity despite reflexes doing nothing. [playerStyle.ts:109](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerStyle.ts:109)

**There is a concrete trait bug.** `engine` is awarded from high `pace`, not high `stamina`, and then reduces stamina drain. [traits.ts:68](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/traits.ts:68), [Player.ts:175](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:175) This makes pace even more of a superstat.

**Several major decisions are attribute-blind.** Perception uses exact world state for pressure, lane openness, space, and interception geometry. [perception.ts:14](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:14), [perception.ts:132](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:132), [perception.ts:299](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:299)

Other blind constants include:

- A universal decision interval and turn rate. [constants.ts:234](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/constants.ts:234), [Player.ts:17](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:17)
- Pass-contact/reaction probability without awareness. [Match.ts:1819](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Match.ts:1819)
- Chaser, marker, and runner assignment driven primarily by distance, speed, and fixed role weights. [TeamBrain.ts:193](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:193), [TeamBrain.ts:380](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:380)
- Equal physical separation in body overlaps regardless of strength. [Match.ts:1852](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Match.ts:1852)

There are also several authored role abilities—not attributes—including fixed aerial role bonuses, WG cross bonuses, and role-weighted runner assignment. [mechanics.ts:619](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:619), [PlayerBrain.ts:527](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:527), [TeamBrain.ts:110](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:110) These are more contrary to the emergence philosophy than most attribute-balance issues.

### Directional sensitivity check

I ran deliberately extreme side-balanced probes—whole squads at `0.95` versus `0.05`, neutral tactics. These are diagnostic, not budget-neutral calibration:

- Pace and defending produced enormous match advantages.
- Reflexes produced a clear goalkeeper advantage.
- Strength barely separated the teams.
- The repository positioning probe reduced spills from roughly `6.01` to `4.87`, but did not produce a stable scoring or prevention gradient.

That matches the dataflow audit: positioning is a real first-touch input but not presently a meaningful football-intelligence dimension.

### Missing real-football qualities

Highest-value omissions:

1. **Awareness/anticipation:** perception, reaction, threat reading, and spatial choice.
2. **Agility/balance:** acceleration, turning, deceleration, and body recovery are currently folded into pace or flat constants.
3. **First touch/control:** presently swallowed by dribbling and positioning.
4. **Weak-foot quality/preferred side:** a highly generative substrate for angles, crossing, cut-ins, and passing orientation.
5. **Aerial timing/ability:** currently approximated through strength, defending, and fixed role bonuses.

I would not prioritize splitting goalkeeper reflexes into handling, reach, and positioning yet. The outfield substrate has much larger deficiencies.

## 2. Modelling awareness/game reading

### Recommendation: repurpose `positioning`

Keep the serialized key initially for compatibility, but redefine and label it as **awareness**. A player’s job should emerge from where awareness pays:

- A forward sees a passing lane or blind-side space sooner.
- A midfielder recognizes pressure and support.
- A defender reads a runner or pass.
- A goalkeeper anticipates ball trajectory and loose-ball danger.

That is preferable to a separate `vision` stat because “vision” often becomes attacker-only passing magic. The existing gene already claims the semantic territory and currently has insufficient selection pressure.

### Model perception fidelity, not behaviour preference

Awareness should change the player’s estimate of the state, not directly say “make a clever run” or “play a through-ball.”

For a moving entity:

```ts
const T = Math.min(relevantHorizon, 0.8);
const lookAhead = 0.30 * (awareness - 0.5) * T;
const perceivedPos = pos.add(vel.scale(lookAhead));
```

This gives approximately ±0.12 seconds of bounded anticipation at the longest horizon:

- `awareness === 0.5` preserves current behaviour exactly.
- High awareness projects movement slightly forward.
- Low awareness reasons from slightly stale state.
- There is no randomness and therefore no determinism risk.

For the ball, use the existing friction/flight projection rather than linear extrapolation.

Feed perceived positions into:

- Pressure and lane calculations in [perception.ts:14](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:14) and [perception.ts:132](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:132).
- Recipient and lane evaluation in the pass loop at [PlayerBrain.ts:275](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:275).
- Through-ball, cross, and cutback evaluation.
- Marker, chaser, and runner assignment in `TeamBrain`.
- Support-position candidate evaluation rather than the current essentially fixed “ahead of ball” support spot. [formations.ts:546](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/formations.ts:546)

Crucially, retire the `playmaker` multiplier that simply makes true lanes look 15% more open. [PlayerBrain.ts:277](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:277) That is optimism, not superior reading.

### Defensive reaction

Keep `defending` as execution quality and let awareness govern how soon the player recognizes the event.

For marker reaction:

```ts
lag = clamp(
  0.45
    - 0.25 * defending
    - 0.18 * (awareness - 0.5),
  0.18,
  0.48,
);
```

This preserves the current formula at neutral awareness while allowing a maximum difference of only ±0.09 seconds. The current site is [actionExecutor.ts:217](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:217).

For interceptions:

```ts
const readMargin =
  0.95 * ballArrivalTime
  - defenderArrivalTime
  + 0.20 * (awareness - 0.5);

canIntercept = readMargin > 0;
```

Awareness changes whether the player gets going in time; it should not boost sprint speed or tackle success.

The live-pass contact gate at [Match.ts:1829](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Match.ts:1829) could receive a mild factor:

```ts
pContact *= 1 + 0.35 * (awareness - 0.5);
```

Do not also add awareness to the subsequent control, tackle, or save roll. That would double-pay the attribute.

### Off-ball movement

Longer term, replace authored support/run locations with candidate evaluation:

```text
V(position) =
    wReceive × receivability
  + wThreat  × progress/threat
  + wSpace   × openness
  - wCrowd   × teammate crowding
  - wRisk    × transition exposure
```

The weights are **policy/preference genes**; awareness controls the fidelity with which the player estimates the terms. This preserves the important distinction:

- Policy genes: what the player wants.
- Awareness: how accurately and promptly the player reads the situation.
- Physical/technical attributes: whether they can execute it.

That architecture lets the same awareness gene produce playmakers, poachers, sweepers, and cautious screeners without role checks.

### Failure modes and balance controls

- **Attacker-only scoring inflation:** never give awareness only to lane or chance creation. Ship attacking and defensive perception together.
- **Universal superstat:** awareness must not affect speed, pass accuracy, shot accuracy, tackle success, and perception simultaneously. Keep it in reading/reaction.
- **Defensive strangulation:** cap reaction effects around ±0.1 seconds and do not stack awareness into blocks or tackles.
- **Route collapse:** use the same perceived-state layer for passes, crosses, carries, cutbacks, marking, and interceptions—no through-ball-specific bonus.
- **Prediction omniscience:** extrapolate only current velocity over a bounded horizon. Do not reveal future action choice or RNG.
- **Movement jitter:** cache a target until the next decision tick or until the current choice becomes materially worse.
- **Offside pathologies:** initially continue applying the actual offside law against true positions; do not make awareness an offside exemption.
- **Age curve:** awareness should decline much more slowly than current positioning. I would use a decline weight around `0.4`, versus the current `1.0`. [careers.ts:63](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/careers.ts:63)

Useful acceptance measures are choice regret by awareness decile, interceptions, missed receptions, key passes, xG for/against, route mix, and whether every position evolves awareness toward `1.0`. If it does, the gene is too universally efficient or too cheap.

## 3. Highest-leverage changes

### 1. Convert `positioning` into awareness

Implement the bounded perceived-state and reaction model above.

**Why first:** the simulation currently gives every player essentially perfect eyes, then differentiates only their execution. This is the largest missing source of football intelligence and player individuality.

**Risk:** medium-high. It can become a universal superstat or suppress scoring if defensive anticipation is too strong.

### 2. Make the budget and evolution honest

Use a single role-specific liveness mask for:

- Budget accounting and scaling.
- Mutation/crossover normalization.
- Summaries, nameplates, and derived traits.
- Validation tests.

Either make GK positioning/control/strength meaningful or stop charging for them.

I would also remove the hardcoded `jockeyBias → +defending, −pace` newgen adjustment. [playerGenome.ts:203](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerGenome.ts:203) That manufactures a containment archetype instead of allowing it to emerge from selection.

The explicit squad mutation operator also appears unused in production; crossover is called directly. [evolve.ts:247](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/evolve.ts:247) Variation mainly enters through careers and newgens. I would add small unbiased post-crossover mutation before adding more authored covariances.

**Risk:** greater population variance and slower discovery of currently hand-assisted archetypes.

### 3. Separate agility from pace

Make:

- `pace` govern maximum running speed.
- `agility` govern acceleration, turning, deceleration, and balance/recovery.
- Actual velocity—not the pace gene again—govern momentum-based tackle protection.
- `engine` depend on stamina, fixing the current bug.

A neutral-preserving starting point:

```ts
topSpeed = BASE_SPEED * (0.90 + 0.20 * pace);
accel    = BASE_ACCEL * (0.85 + 0.30 * agility);
turnRate = 6.5        * (0.75 + 0.50 * agility);
```

This creates long-striding runners, explosive turners, slow technicians, and agile defenders.

**Risk:** agile cut-ins and central dribbling may inflate scoring. Defenders must receive the same turning substrate.

### 4. Split control from dribbling

Add `control` and transfer to it:

- First-touch failure.
- Chest trapping.
- One-touch execution.
- Touch cadence under pressure.

Keep `dribbling` for:

- Carry push/noise.
- Changes of direction with the ball.
- Tackle evasion and ball shielding technique.

Passing and finishing should own their respective strike quality rather than borrowing dribbling for generic technique.

**Risk:** control can raise overall pass completion and possession stability. It needs to remain budget-expensive and should not also improve pass accuracy.

### 5. Make strength physical and remove fixed aerial-role skill

Use a bounded mass/balance effect in opposing-player contact, for example:

```ts
effectiveMass = 0.85 + 0.30 * strength;
```

Let it influence:

- Unequal displacement in ground contact.
- Shielding and hold-up success.
- Recovery from bumps.
- Header and clearance power.

Then remove `AERIAL_ROLE` as a permanent position bonus. Aerial outcomes should emerge from strength, awareness/timing, approach velocity, and ball geometry. If that composite still cannot produce distinct aerial specialists, introduce a budgeted `aerial` gene later.

**Risk:** target-player stalls, penalty-area clumping, and an overpowered crossing route. Header share and possession duration under shielding need explicit gates.

My next addition after those five would be **preferred foot plus weak-foot quality**. It is extremely generative, but also carries high route-collapse risk if the weak-foot penalty is large.

The implementation order I would use is: fix the engine/liveness/budget defects, instrument attribute sensitivity, introduce awareness symmetrically, then split pace/agility and control/dribbling. That sequence improves the evolutionary substrate without increasing the number of genes until the current ones are genuinely paying for themselves.