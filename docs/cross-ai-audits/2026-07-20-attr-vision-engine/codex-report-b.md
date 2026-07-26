## Bottom line

The broad **perception → value → action** direction is right. I disagree, however, with the stronger claim that one scalar “space-value field” should generate essentially every football behavior.

The architecture I would build is:

**world truth → player belief → action-conditioned forecast → gene-weighted value → action/target**

The current code largely jumps from world truth straight to utility. That missing belief/forecast layer—not a shortage of perception helper functions—is the central architectural gap.

I would keep the existing engine while replacing it incrementally. I would not add a `vision` attribute next.

## 1. Assessment of the architecture

### What I would keep

- Small, deterministic, pure geometric queries are an excellent substrate. [`perception.ts`](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:9) has the right engineering shape.
- Explicit candidate-action scoring is explainable and evolution-friendly. `PlayerBrain` already exposes the relevant weights instead of hiding decisions in a monolithic controller ([carrier setup](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:70)).
- Separating personal appetite, coach policy, and physical ability is good. Per-player styles already evolve shoot/dribble/run/combination preferences ([`PLAYER_STYLE_KEYS`](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerStyle.ts:7)); those should remain preferences, not perception quality.
- Some coordination constraints are necessary for watchability. Maximum pressers, rest defence, and deterministic tie-breaking are legitimate laws of the substrate. The vision itself correctly admits that perception dimensions and action primitives must be authored even if their weights and resulting tactics emerge ([VISION](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/VISION.md:118)).

### What I would change

The functions in `perception.ts` are mostly **objective affordances**, not perception:

- [`pressureAt()`](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:15) knows the exact nearest-opponent distance.
- [`laneOpenness()`](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:133) knows every opponent’s exact position.
- [`opennessOf()`](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:197) does the same for the receiver.
- [`interceptBall()`](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:248) is a physical trajectory solver.

Those functions should remain available as world-truth/physics queries. A new wrapper should produce the **player’s estimate** of those affordances.

This distinction also matters because the executor currently recomputes dynamic targets from exact state every frame ([`executeAction()`](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:14)). If only utility scores receive imperfect perception while the legs continually receive exact targets, players still possess perfect closed-loop vision.

### Where current queries are too crude

- `pressureAt()` uses only the nearest defender. Two converging defenders, one passive defender, and one defender sprinting from the blind side can all return similar pressure.
- `laneOpenness()` measures static perpendicular distance to a segment. It ignores ball speed, defender heading and velocity, acceleration, the receiver’s movement, and whether a defender can actually arrive before the ball.
- `spaceAhead()` samples crowding around one point seven metres ahead ([formula](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:207)). It does not evaluate the full dribble path, teammates, boundaries, cover defenders, or the goalkeeper.
- `canInterceptPass()` uses a straight 22m projection, `ballSpeed × 0.7`, a fixed 0.95 threshold and a binary answer ([implementation](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:300)). That is disconnected from the attacker’s `laneOpenness()` model of the same event.
- The ordinary pass scorer evaluates the lane to the receiver’s **current** position ([pass loop](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:275)), while execution leads the receiver and calculates a different flight speed ([`performPass()`](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:276)). The decision and physics therefore reason about different passes.

There are useful fragments of dynamics—shot blockers consider facing and stillness, through balls project a runner, and body orientation affects kicks—but no consistent forecasting model.

### What is missing

The important missing representation is not “space”; it is **time-dependent advantage**:

- When will the ball reach a point?
- When will the intended receiver reach/control it?
- Which defender can reach its path or destination first?
- What will the move expose if possession is lost?
- What are teammates already doing, not merely where are they now?
- How valuable is the resulting state to this particular player?

A position can be closed but enormously valuable—exactly why openness-maximizing box arrival failed in the roadmap ([measured failure](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/ROADMAP.md:73)). Therefore value should be a feature vector evaluated per action:

```text
V(action, target, horizon) =
  possession probability
  × resulting threat
  + coordination/decoy value
  − turnover exposure
  − effort and body-orientation cost
  − offside/rule risk
```

A shared scalar field loses the action and horizon. The same location has different value for receiving in 0.4s, arriving for a delivery in 1.5s, dragging a marker, or providing rest defence.

### The team layer is still substantially preset

The default “emergent” formation is better than a table, but it is still a parametric hand-designed formation generator:

- Fixed role anchors are assigned in a switch ([`emergentStation()`](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/formations.ts:238)).
- Ball-side movement and defensive collapse use authored formulas.
- Runner selection uses fixed role weights and selects the first one or two bodies ([`RUN_ROLE_W`](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:110)).
- The cutback arriver is explicitly MF-then-weak-winger ([selection](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:199)).
- `supportSpot()` is still always ahead of the ball ([formula](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/formations.ts:546)).

That is acceptable as transitional scaffolding, but I would not call it the final emergent positioning system.

Eventually, players should submit gene-weighted bids such as “press,” “cover,” “run,” or “support”; `TeamBrain` should deterministically arbitrate conflicting bids under constraints such as maximum pressers and minimum rest defence. The coach then controls collective costs and capacity, rather than directly choosing identities with role tables.

## 2. Evolvable perception quality

### Do not multiply objective openness

The current playmaker effect makes a lane up to 15% more open ([lines 277–282](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:277)). That is conceptually backwards: a perceptive player should recognize whether a lane is safe, not make a blocked lane objectively safer.

It also explains why the reverted `vision` attempt inflated scoring. The passer evaluates roughly five teammates and retains the maximum score. A mean-zero or mean-centred change to individual candidate readings is not output-neutral after this maximization ([candidate selection](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:373)). Better identification of the top attacking option has convex payoff.

### Recommended model

Initially, use the existing `positioning` attribute as general anticipation/awareness. Its documented purpose already includes where to be, when to move, and defensive reads ([genome definition](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerGenome.ts:37)), but today it mainly affects first-touch failure ([current live effect](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:95)).

For each pass or movement option, compute an objective race margin:

```text
pathMargin =
  min over defenders and path points
  (defender ETA − ball ETA)

receiveMargin =
  min defender ETA at destination
  − max(ball ETA, receiver ETA)

trueMargin = min(pathMargin, receiveMargin)
```

Turn that into an estimated completion probability with a soft function rather than a binary gate:

```text
Pcomplete = sigmoid(perceivedMargin / τ)
```

Perception quality should affect only ambiguous reads:

```text
ambiguity = clamp01(1 − abs(trueMargin) / 0.75s)

perceivedMargin =
  trueMargin
  + ambiguity × σmax × (1 − positioning)² × ε
```

Where:

- `σmax` begins around 0.20–0.25 seconds.
- `ε ∈ [-1,1]` is a zero-mean, persistent error keyed by match seed, player id, option id and a roughly 0.6-second epoch.
- Generate it through a stateless seeded hash or isolated RNG stream, never the match RNG and never `Math.random`.
- Interpolate between epochs so perception does not flicker.

Obvious open and closed situations remain obvious to everyone. Poor readers make mistakes primarily on genuinely tight decisions.

Use the same forecast on both sides:

- Passers use perceived `pathSafety` and `receiveAdvantage`.
- Defenders score interception continuously from their own perceived margin instead of using the current binary `canInterceptPass()`.
- Execution and collision physics remain objective; awareness must not grant extra physical reach.

I would not introduce field-of-view cones, disappearing opponents or large perception delays. On a small 6v6 pitch these create catastrophic missed attackers rather than expressive individuality. Blind-side first-touch difficulty is already represented, so broad visibility restrictions would also double-charge it.

### What keeps it balanced

- **One capacity at both ends:** the same `positioning` investment improves attacking anticipation and defensive recognition.
- **Budget cost:** `positioning` already consumes the squad budget, and improving it shaves other attributes under [`enforceBudget()`](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerGenome.ts:167).
- **No execution buff:** awareness improves decisions, not ball accuracy, speed, tackling reach or finishing.
- **Ambiguity-only errors:** it cannot manufacture or erase obviously safe opportunities.
- **Persistent errors:** fewer tick-to-tick action flips and less seed volatility.
- **Mirrored validation:** compare high-read attack versus neutral defence and neutral attack versus high-read defence, then high-read versus high-read. Their scoring effects need not be mathematically identical, but should be comparable before co-evolution.
- **Route gate:** goals near two per match are not enough; headers, combinations, carry, through balls and build-up must all be checked because the reverted vision change collapsed the aerial route ([ROADMAP](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/ROADMAP.md:18)).

A separate `vision` attribute may eventually be justified if playmaker perception and defensive anticipation demonstrably need to evolve independently. I would not pay the schema and budget cost until `positioning` has first proved that perception quality can be made live and balanced.

## 3. Highest-leverage next step

| Rank | Change | Balance risk | Opinion |
|---|---|---:|---|
| 1 | Shared spatiotemporal ground-pass race model, used by passer and interceptor; wire existing `positioning` into ambiguous estimates | Medium | Do next |
| 2 | Candidate-point scorer for `SupportBallCarrier` only: receivability × future threat − teammate occupancy − transition cost | Medium–high | After pass forecasting is trustworthy |
| 3 | Direction sampling for dribbling/carry instead of “goal or down the line” | High | Central carry already dominates; likely to inflate scoring |
| 4 | Replace `TeamBrain` modes/runner/mark assignments with coach-global value optimization | Very high | Long-term destination, not an incremental next phase |

Concretely, rank 1 means factoring the expected lead point and speed from `performPass()` into a pure shared planner, then replacing:

- Static lane reads in the carrier pass loop.
- The separate through/cutback path approximations later.
- Binary `canInterceptPass()` in the defensive branch ([call site](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:1067)).

That fixes the present contradiction where attackers and defenders use unrelated models of the same pass. It also makes dynamics, anticipation and the nearly-dead `positioning` gene matter without granting a unilateral attacking bonus.

I would deliberately **not** do the universal value field, a new `vision` gene, perception lag/FOV, cut-inside, a run repertoire, or the coach-global rewrite yet. In particular, cut-inside currently pours another option into the already dominant carry economy; it should wait until congestion and defensive arrival advantage are valued honestly.

So my independent verdict is: **keep the architectural direction, narrow its claim, and build the shared temporal contest model first.** “Growing eyes” should mean evolving the quality of forecasts about contested future states—not multiplying static openness, hiding opponents, or asking one spatial scalar to explain all of football.