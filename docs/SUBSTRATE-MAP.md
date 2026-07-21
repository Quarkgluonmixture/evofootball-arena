# EvoFootball Substrate Map (v1) — the world's causal structure

> **Authority:** [`VISION.md`](VISION.md) stays the gold standard (**what the user
> wants**). This doc is the **engineering map** that operationalizes VISION §1
> ("让球员自己长眼睛" → a perception→value→action decision engine). It answers a
> different question: *what causal layers must the football world have, and what
> does each gene/attribute do to which layer.* Acceptance methodology (how we prove
> a change is good) lives in [`PROBE-CONTRACTS.md`](PROBE-CONTRACTS.md).
>
> Ratified direction 2026-07-20 (user + GPT + Claude, three-way). Supersedes the
> "one value field" framing that VISION §1 had drifted toward.

---

## 0. The one principle (read this first)

**Substrate defines the CAUSAL STRUCTURE of the football world; genes define the
agents' DIFFERENCES on that structure. The two CO-CONVERGE** — it is neither
"substrate first, then genes" nor "one gene per missing behaviour."

**The failure we are correcting.** The three 2026-07-20 value-field reverts (and
the four behavioral-attr reverts before them) all tried to make **ONE function —
S5 space-value — carry SIX layers**: perception, prediction, candidate generation,
team coordination, technical execution, and future-state value. A function that
carries six layers makes players "run into empty space" and inflates goals. The
fix is not a better value field; it is to **give each layer its own module** and
let the genes weight them.

**The acceptance law (see PROBE-CONTRACTS):**

```
fires ≠ works ≠ pays ≠ selected ≠ good football
```

A behaviour firing more often proves nothing. It must (2) work mechanically,
(3) be possible, (4) PAY in the right situation, (5) be SELECTED by fresh
evolution in some ecologies, and (6) leave the world watchable/diverse/real.

---

## 1. The causal chain

```text
世界真值 (world truth: laws, geometry, physics, possession state)   ← S0
   ↓
球员可感知的信息 (perceivable info: FOV, occlusion, staleness)       ← S3
   ↓
局部记忆与短期预测 (memory + short-horizon prediction of ball/people) ← S4
   ↓
可达性 / 控制权 / affordances (reachability × control × football value) ← S1,S5
   ↓
候选动作与候选位置 (candidate actions & positions — primitives)      ← S6
   ↓
个体估值 (per-candidate value incl. next-state / bounded lookahead)  ← S7
   ↓
团队任务协调 (team task demand + player bidding, dynamic roles)      ← S8,S9
   ↓
动作承诺与技能执行 (action commitment + skill execution)             ← S1,S2
   ↓
物理结果 / 控球状态改变 (physical outcome / possession-phase change)  ← S0,S2
   ↓
结果评估、学习和长期选择 (outcome eval → learning → selection)        ← S11,S12
```

---

## 2. Current-code reality (grounded 2026-07-20, with `file:line`)

Four facts that reframe the work — verified against `src/`, not the docs:

1. **VISION §1's "value-field eye" was NEVER shipped.** The live default
   `emergentStation` (`src/ai/formations.ts:238-348`) is role→coarse
   `depthFrac`/`laneFrac` tendency **+ the same affine modifiers as the legacy
   tables + an anti-clump repulsion term**. There is **no `spaceValue`/value-field
   symbol anywhere**. → **S5 is a first build, not an improvement.** What's live
   today is a hand-tuned procedural interim wearing an "emergent" label.
2. **"Team gene" is not missing — it is fragmented across THREE structures:**
   `TacticalGenome` (23 genes, `src/evolution/genome.ts:9-144`) + `PolicyGenes`
   (22 weights, `src/evolution/policyGenome.ts:18-34`) + discrete `TeamStyle`
   (`src/sim/types.ts:53-57`), fused with a 5-key `PlayerStyle`
   (`src/evolution/playerStyle.ts:22-31`) via
   `applyPlayerStyle`→`rolePolicies`→`team.policies[i]` (`Team.ts:165`,
   `League.ts:430`). The team-gene overhaul is **S8 (TeamBrain: commander →
   team-intent) + re-defining these three structures' roles**, not "add a gene."
3. **`finishing` is ALREADY decoupled from shot selection**
   (`src/ai/PlayerBrain.ts:191-194`, execution-only) — the hook-table discipline
   (§4) is **already partly honored**; this doc systematizes it.
4. **`vision` (10th attr) has exactly 1 call site** (`PlayerBrain.ts:285`);
   `positioning` = defensive read + first-touch (3 sites). Reverting the `vision`
   experiment is clean. `mutateSquad` is dead code (0 call sites). There is **no
   unified `timeToReach`**; capture = `1.25m` geometric **instant owner-flip**
   (`Match.ts:1776`).

---

## 3. The layers S0–S12

Status: 🟢 solid · 🟡 partial/needs interface · 🔴 near-absent. Each layer: what
the substrate must PROVIDE · gene/attr hooks · code status (with evidence) · build.

### S0 — World, laws & match state · 🔴 (contest state)
- **Provides:** geometry, goals/box/lines/offside, score/time/cards/numbers,
  restarts, phase, deterministic time step.
- **Add:** a **first-class possession phase** —
  `controlled(team,player) | contested(contenders,landing?) | loose(likelyFirst) | deadBall(restart)`.
- **Code:** capture = `1.25m` nearest **instant flip** (`Match.ts:1776`); most
  "乱抢" is `owner===null` scramble that each system patches ad-hoc. **Test
  scaffolding already exists** for the concept: `touches.test` (loose ball is
  contested, poke wins a rolling ball), `blocks.test` (blocked shot = loose),
  `cushion.test`. → **P0. Promote the concept from tests into a sim state + ledger
  (see `contest-anatomy` in PROBE-CONTRACTS).**

### S1 — Body dynamics & reachability · 🟡
- ⭐⭐ **M0–M4 DONE 2026-07-21:** the former point-body diagnosis produced the bounded
  **Kinematic Disc + Oriented Shell** slice in
  [`world-model/FOUNDATION.md`](world-model/FOUNDATION.md). Core contact now removes closing
  normal velocity; loose-ground `directBallAccess` reads body direction and opponent-core
  screening; M3 separates contact from control. This is not the whole S1 model: movement
  remains one isotropic accel envelope + a separately rotating heading, and secured-ball
  standing tackles do not yet consume the access/screening fact. Exact supported and missing
  counterfactuals: [`world-model/COVERAGE-GAPS.md`](world-model/COVERAGE-GAPS.md).
- `strength` has an honest future attachment point, but is **not activated** in the new contact
  solver/access system. It remains a coefficient in existing standing-tackle and aerial
  formulas, not embodied mass/balance/screening stability.
- **Provides:** top speed, accel/decel, turn rate, facing, inertia, balance,
  contact, fatigue's effect on all of these, **body state on arrival**.
- **Hooks:** `pace`(speed/accel), `agility`(turn/adjust — currently a **flat
  `TURN_RATE 6.5`**, attr-blind), `strength`(mass/duel), `stamina`.
- **Add:** a cheap unified `timeToReach(point, playerState)` (current vel, facing,
  turn cost, accel curve, can-it-stop, carrying?, fatigue). Shared底座 for
  pitch-control, positioning, cover, and pass lanes.
- **Code:** physics exists; no unified arrival interface (only scattered
  `interceptBall`/`ballLanding`).

### S2 — Ball & skill execution · 🟢🟡
- **Provides:** technical PRIMITIVES (not named tactics): trap/cushion/settle;
  short/long/lofted pass; shot/chip/header; small-touch/knock/turn; shield/tackle/
  block; GK catch/dive/rush/distribute; one-touch.
- **Hooks:** `firstTouch`(→ split from `dribbling`), `passing`, `dribbling`,
  `finishing`, `tackling`(→ split from `defending`), `aerial`(→ from `strength`),
  GK handling/positioning/distribution/reflexes.
- **Rule:** attrs change **feasible range / execution error / action time /
  tolerance to pressure & body-orientation / the failure result** — **NOT "is this
  action worth doing."** `finishing` already obeys this (`PlayerBrain.ts:191-194`).
- **Code:** rich mechanics; attr coupling too coarse (see the attribute-split
  backlog). [`world-model/BALL-CONTROL.md`](world-model/BALL-CONTROL.md) formalises
  the existing `secured | knocked | free` truth and freezes a 120-match baseline.
  Two B1 shortcuts were rejected: moving the authoritative owned-ball offset produced a
  113-contact pass-arrival tail, while physically releasing every pressured footbeat produced
  52.92 knocks/match and raised midfield churn. Current live mechanics remain unchanged.
  One causally different retry is now specified in
  [`world-model/CONTROLLED-BALL-COUPLING.md`](world-model/CONTROLLED-BALL-COUPLING.md):
  continuous `ControlSequence` + independent ball + discrete touches + derived macro
  `PossessionLocus`. ✅ B1c-0 landed byte-identically: consumer census + null live sequence
  state + pure locus + probe shell, with no existing consumer. ✅ B1c-1 landed as an isolated
  distance-driven gait + real velocity-impulse mechanism, still with no live consumer.
  ✅ B1c-2 composes real-ball access/screening with an isolated lease boundary: own
  contact continues one sequence, exposed opponent contact requests M3, and screened
  contact does nothing; it assigns no winner and remains outside `Match`. ❌ B1c-3 live
  composition was fully reverted: it preserved the own-touch invariants but caused
  23–77 overruns/match across causal variants, M3 tails up to 98, and formation/stamina
  contract failures. Live remains B0; the missing prerequisite is movement↔ball recovery
  prediction, not another cadence or distance tune. B1c is closed; resume S3–S8.

### S3 — Perception · 🟡🔴 (representation exists; live AI is still omniscient)
- **Provides:** each player reads a `PerceptionSnapshot` (observed ball/players +
  remembered last-known + visible regions + cues + timestamp), **NOT the full
  `Match`**: FOV, peripheral, occlusion, scanning, update latency, blind-side
  decay, velocity/direction estimate error, cues off the carrier's body, info loss
  under pressure/fatigue.
- **Hooks:** `awareness`(how much/how fast/how noisy); `concentration` (state
  modifier first, not an attr yet); experience/role-familiarity (what to attend to).
- **Determinism-safe:** stale observations + limited FOV + decision-tick latency +
  **functional error keyed on (seed,player,tick,quantity)** — never per-frame RNG.
- **Code:** `ai/perceptionSnapshot.ts` now provides the pure deterministic snapshot,
  scan clock, FOV/range, keyed functional error and last-known memory. Its S3a layer-gate
  is directional at 120 matches (awareness 0.2→0.8: position MAE 0.54→0.38m; missed
  ≤6m threats 15.1%→8.3%); observer body proprioception and an owned ball cue remain
  exact/fresh between scans. **No live AI reads it yet:** `decideCarrier`/`decideOffBall`
  still read real coordinates, and awareness is currently an explicit probe parameter,
  not a gene. (Perfect info is why offside v1 went to zero — decider & referee read the
  same truth in the same frame.)

### S4 — Short-horizon prediction · 🟡🔴 (ordinary-pass offline slice exists)
- **Provides:** `predictBall(t)`, `predictPlayer(p,t)`, `predictArrival(p,point)`,
  `predictControlAt(point, ballArrivalT)`.
- **Hooks:** `anticipation`(window & error), `awareness`(input quality), body
  attrs (real reachability).
- **Effect:** one high-`anticipation` player reads passing lanes earlier ON
  ATTACK and moves to the pass-landing earlier ON DEFENCE — **the shared
  attack/defence reading trunk** (this is what the reverted single-sided `vision`
  attr should have been).
- **Code:** `ai/prediction.ts` now has pure constant-velocity observed-player projection,
  exact fixed-step exponential ground-ball travel time, and the ordinary-pass intended lead/launch
  model; it is used only by tests and `pass-affordance-calibration`. At 120 matches,
  finite flight-time MAE on actual target receptions is 0.278s. Ball trajectory, aerial
  flight and a live attack/defence consumer remain open; no anticipation gene exists.

### S5 — Affordance & pitch control · 🟡🔴 (pass vector exists offline)
- **Provides:** for a candidate point `p`, a **VECTOR** (not one score):
  `selfArrival, teammateArrival, opponentArrival, controlProbability,
  receivePressure, bodyOrientationOnArrival, lineBreakValue, goalThreat,
  supportValue, spaceCreationValue, restDefenceCost, offsideRisk, exitOptions`.
- **"Space" is DERIVED** from opponents+teammates+pitch, not "distance to nearest
  man." Openness = who arrives first, in what body state, with what next value.
- **Hooks:** `spatialIQ`(which dims matter, structure recognition),
  `anticipation`(arrival times), `decisions`(compare affordances), body/technique
  (feasibility "for me").
- **Code:** `ai/passAffordance.ts` now emits an explicitly unscored ordinary-pass vector:
  receiver/opponent arrival, arrival margin, control prior, pressure, receive-facing,
  progression, line breaks, offside risk and exit count. It consumes only S3 observations
  plus known physical reach profiles and returns `null` when facts are missing. The
  120-match truth curve is monotonic (arrival margin low→high: target received 30.8→80.0%,
  intercepted 69.2→13.7%), and higher synthetic awareness improves vector fidelity.
  **No live AI reads it.** Its control prior is under-dispersed (95.2% in the top quartile),
  so S7 must use/calibrate the raw dimensions rather than treating it as a magic score.
  Full dynamic pitch control and off-ball affordances remain open; `emergentStation` is
  still a hand-tuned proxy, not this. **O0 now adds the first off-ball representation-only
  slice:** `ai/offBallAffordance.ts` generates role-neutral symmetric reachable-point samples
  and emits separate self/opponent arrival, teammate occupancy, carrier-corridor, pitch and
  offside facts from `PerceptionSnapshot`. It has no score and no live consumer; seven
  counterfactual tests plus the unchanged full fingerprint prove byte-identical isolation.
  Candidate payoff and live `supportSpot` replacement remain open.
  **O2a now validates the next mediator:** after real cloned movement, generic
  forward/lateral/backward targets produced supported conditional pass states that
  were non-equivalent to hold in 100.0/98.7/100.0% of paired cases. The directions
  formed different tradeoffs rather than one universal winner. Full action payoff,
  task occupancy and live selection remain open.
  **O4a closes one additional offline edge:** real generic movement followed by the same
  forced ordinary pass changed intended stable-reception rates across geometries by 8.3pp,
  with distinct interception/progression tradeoffs. A cheap live predictor and selector are
  still absent; the transition result must not be collapsed into a universal direction bonus.
  **R1 adds a dormant moving-relation affordance:** one explicit teammate intent endpoint
  plus an immutable attack-frame relation is composed with mover ETA/slack, current and
  projected offside lines, physical-pitch/barred-box legality and the existing O0/O3
  access/occupancy facts. Every fact remains separate; there is no aggregate feasibility
  authority, score, named pattern or live consumer. R1a's eligible subset closed 141/143
  targets, but only 187 branches completed against its frozen 192 coverage gate; the
  representation remains dormant and no relative candidate set is authorised.

### S6 — Action primitives & candidate generation · 🟡
- **Provides:** enough primitives, never tactical answers. Move: approach / pull
  off / widen / into-gap / drop / cross-the-line / lateral / arc / hold / protect
  a high-value zone / track a moving target / cut a lane. On-ball: control to a
  direction / pass to mate-or-space / dribble a direction / shield / shoot / clear
  / wait. Defend: press / delay / cut lane / protect goal-side / tackle / mark /
  hand off / contest the drop.
- **Rule:** a candidate is *"run to (x,y) to gain a receiving advantage,"* **NOT
  "execute a cut-inside."** 内切/overlap/third-man/box-arrival are **patterns
  recognised after the fact** from trajectories, never labelled genes.
- **Code:** many actions, but too many **named-behaviour** switches + role branches
  (`wallPassW/thirdManW/overlapW`, `RUN_ROLE_W`, role bonuses). **O1 now adds one
  dormant generic exception:** `MoveToPoint(targetPos)` uses the existing steering,
  onside discipline and `Player.physicsStep`, with no brain emitter, score, gene or role
  branch. It exists so offline counterfactuals can test O0 points without teleporting;
  O1a has now shown in 64 frozen cloned states that fixed forward/lateral/backward O0
  targets all close through the real movement stack (zero unexplained intervention drift).
  This is execution feasibility only; no candidate payoff or live selector exists.
  **R0 adds a second dormant generic primitive:** `TrackRelativePoint` follows a fixed
  attack-frame offset from any moving player through the same execution stack. It has no
  live emitter, reference/offset chooser, role/gene branch or football-pattern label. This
  represents a moving spatial relation. R0a showed backward/lateral execution at 98–100%
  but failed the frozen forward gate at 88.2%; R0b attributed five of six misses to an
  offside endpoint already knowable at commitment. R1 now represents that missing
  reachability/legality boundary, but it is not yet a live candidate.

### S7 — Action value & bounded lookahead · 🟡🔴 (pass Pareto boundary exists offline)
- **Provides:** not "how good does this look NOW" but "what does it turn the NEXT
  state into." Minimal lookahead (1–2 key events, **no MCTS**):
  `action → ball/people arrive → possession outcome → next high-value choice`.
- **Value vector:** `possessionDelta, progression, threatCreated,
  threatConcededIfLost, opponentDisplacement, teammateOptionsCreated,
  structureCost, energyCost`, weighted by personality + coach philosophy.
- **`decisions` acts here:** smaller valuation error / fewer missed high-value
  candidates / less fooled by surface EV / slower degradation under time pressure —
  **NOT a flat success buff.**
- **Code:** `ai/passValue.ts` now maps viable ordinary-pass affordances into eight
  separately oriented next-state dimensions and computes a stable Pareto frontier. A
  candidate is removed only when another is no worse in every dimension; the provisional
  S5 control prior is deliberately excluded. The 120-match offline gate finds 4.8% of
  current live targets unambiguously dominated, with awareness improving relation fidelity.
  **But S7b failed the paired payoff gate:** across 509 same-state/same-RNG 3s rollouts,
  the predicted dominator beat the chosen branch 34.4% and lost 35.6%; team possession
  fell 53.4→49.1%. The arrival-only vector therefore does not yet predict the next state.
  Existing `PlayerBrain` still uses its `UtilityScore[]` table; no live consumer landed.
  Missing S7 dimensions are now concrete: S2 execution risk, threat created/conceded,
  structure/rest-defence cost and the quality (not count) of next options.
  **T0a now establishes a new estimator data boundary rather than retrying S7e's
  repeated per-pair means:** 240 fresh training match clusters yielded 19,164
  ordinary-pass decisions / 93,636 viable target actions. Oracle v2 labels all five
  transitions with per-fold support, and 79.15% of resolved multi-action decisions
  changed transition when only the target changed. The versioned kick-time feature
  projection is dormant and unscored; validation/test clusters remain sealed. This
  authorised only T0b estimator design, not action value or live selection. T0b's
  internal holdout then confirmed strong target-specific prediction (log loss and
  Brier both improved about 9% over an otherwise identical state-only model), but
  stopped at its exact relative-calibration gate before external validation. The
  feature/model probes remain dormant; no S7 consumer or conditional payoff follows.

### S8 — Team task & dynamic coordination · 🟡🔴
- **Provides:** `TeamIntent{ phase, priorities, taskDemand[], structuralConstraints[] }`
  — "someone press the ball / someone protect the dangerous lane / keep depth /
  give a near outlet / protect the central rest-defence." Players submit a
  **task bid** (how fast can I do it / how well / who covers if I leave / am I
  suited); deterministic allocation. **It does NOT say "#3 press, #5 run behind."**
- **Hooks:** coach genes → priorities/constraints/demand (never draw coordinates);
  `roleFamiliarity` → task valuation & execution experience.
- **Code:** `TeamBrain.assignChasers/assignMarks/assignRunners` fill
  `team.chasers/marks/runners/arriver`; `PlayerBrain` gates on them = **commander**,
  not coordination substrate. The "max ~2 runners" formula is a safety valve
  becoming a tactical ceiling. **O3 now adds a dormant shared-intent representation:**
  fixed target/arrival commitments expose separate target, bearing, timing and corridor
  occupancy facts. O3a found at least two synthetic commitments in 99.1% of 10,689 real
  attacking states, with a broad near-to-far occupancy distribution. No live commitment
  producer, allocator, task priority or score exists. **C0 is now pre-registered**
  as the next dormant layer: an opaque demand publishes an explicit target,
  arrival window, participant capacity and lifetime; explicit claims then conserve
  missing/excess occupancy without naming, producing, ranking or allocating tasks.

### S9 — Shared intent, comms & familiarity · 🟡🔴
- Receiver expresses intent; a run becomes a passer cue; carrier body-orientation
  is a cue; is a task already taken; explicit/implicit comms; predicting a
  familiar mate's run; trained set-plays as shared conventions.
- **Hooks:** `teamwork`(mate-benefit weight, responds to shared task),
  `roleFamiliarity`, teammate familiarity, coach tactical familiarity, learned
  patterns.
- **Code:** O3 provides a role-neutral `OffBallOfferCommitment` and pure occupancy
  query, but no live player publishes or consumes one and no familiarity affects it.

### S10 — Match phase, transition & opponent model · 🟡
- Dynamic phases (build-up / progression / final-third / counter / block / press /
  counter-press / recovery / in-contest), NOT fixed formations. Later: opponent
  model (what they repeat, who marks vs covers, deception, tempo change).
- **Code:** modes exist (`updateTeamBrain`), no opponent model. (Keep a slot;
  not slice-1.)

### S11 — Outcome evaluation & learning · 🔴 (bridge)
- Record WHY an action failed (didn't see a better option / mispredicted a marker /
  bad risk / execution / receiver timing / first-touch / misunderstood intent) —
  the precondition for training/development to work. Long-term vars: development,
  role/teammate familiarity, learned traits, situational experience, coach
  conventions, age decline.
- **Code:** long-term evolution exists; match-outcome→learning bridge missing.

### S12 — League, market & evolution ecology · 🟢
- Results, opponent population, format, budget, market, coach mobility, academy,
  injuries, scouting error, club environment. Later: `newgen = mutation` →
  `talent-pool → discovery → noisy eval → selection → development → minutes →
  phenotype`.
- **Code:** already strong — budget (`SQUAD_BUDGET 40.0`, position-aware), coach
  mobility, free agents, two divisions, cups, results-dominant fitness,
  `freq-dependence` self-balance (N1.5 closed). **Not a blocker; do late.**

---

## 4. The gene → substrate hook table (HARD CONSTRAINT)

Every gene/attr acts on a substrate layer; the third column is the **anti-pattern
guard** — violating it recreates the `finishing→shot-utility` self-defeating trap.

| Gene / attr | Acts on | MUST NOT directly do |
|---|---|---|
| `awareness` | S3 FOV / scan update / memory quality | raise pass or tackle success |
| `anticipation` | S4 short-horizon ball/people prediction | give an interception bonus |
| `spatialIQ` | S5 affordance / shape / functional space | command "run to the back post" |
| `decisions` | S7 candidate coverage / valuation error / time-pressure decay | a flat all-behaviour success buff |
| `teamwork` | S8/S9 mate-benefit weight / respond to shared task | force unselfish passing |
| `workRate` | S6 willingness to act / persistence threshold | equal `stamina` |
| `aggression` | S6/S8 approach/contest/engage utility weight | equal `tackling` |
| `riskTolerance` | S7 risk–reward weighting | add through-ball attempts directly |
| `flair` | S6 unconventional-candidate probability & weight | free success uplift |
| `firstTouch` | S2 reception direction / time / control error | decide whether pressure is seen |
| `passing` | S2 ball execution trajectory & error | decide whether a lane is found |
| `tackling` | S2 ball-action & foul risk | decide standing in the right spot early |
| `speed`/`agility` | S1 reachability / body adjust | add space value directly |
| coach genes | S8 team priorities / constraints / task demand | draw player coordinates |
| `roleFamiliarity` | S7/S11 task valuation & execution experience | become a fixed behaviour script |

**vision/awareness resolution (closes the ROADMAP fork):** do NOT add single-sided
attrs. `vision`/`defensiveAwareness` are **UI-derived indicators**; underneath,
**shared `awareness`+`anticipation`** feed S3/S4, and the attack/defence asymmetry
**emerges** from `spatialIQ`/`decisions`/technique. → **revert the `vision`
10th-attr experiment** (1 call site); keep position-aware budget.

---

## 5. Slice-1 — Pass–Arrival–Contest (the first vertical slice)

> ⭐ **REFRAMED 2026-07-20:** the **CONTEST** half needs a deeper physical foundation (the
> player is a POINT, not a body) → it is now the **World-Model Foundation slice**,
> [`world-model/FOUNDATION.md`](world-model/FOUNDATION.md) (Kinematic Disc + Oriented Shell;
> M0–M4), done FIRST. The **Pass/Arrival** half (perception → affordance → pass-valuation) is
> the S3–S8 mainline we RETURN to after. Sub-step 1 (S0 `possessionPhase`) below is DONE and
> feeds both.

The first cut is **one closed causal loop**, not a full engine. It exercises S3→S4
→S5→S7→S2→S0 and is the actual root of the combo/box/interception problems.

**⭐ Scope boundary (deliberately narrow, to protect the play-tested baseline):**
- **slice-1a = ON-BALL passer + arrival + contest:** passer perception
  (S3, stale/limited) → affordance-based pass valuation (S5/S7) → contest state at
  arrival (S0) → first-touch outcome (S2, reuse existing). **Minimal `timeToReach`
  (S1) and minimal `PerceptionSnapshot` (S3) built only as far as this slice needs.**
- **slice-1a does NOT touch** the receiver's off-ball offer-movement or the
  TeamBrain→task-bidding refactor — those would perturb the `emergentStation`
  positioning the user already play-test-approved (density 相变). They are
  **slice-1b** (receiver offers) and **later** (S8).

**Sub-steps (each: probe-gated, honest-revert, per PROBE-CONTRACTS six-layer chain):**
1. ✅ **DONE** — First-class `possessionPhase` state (S0): a derived, read-only
   classification (controlled / contested / loose / deadBall) recomputed each step,
   `CONTEST_RADIUS`-based. Nothing in the decision path reads it yet ⇒ **bit-identical
   (443/443, incl. the determinism/byte-identical guards) + perf-neutral** (5.3µs/step).
   Anchor for the physical 50-50 to come. (The honest §2-neutral representation cut.)
2. ✅ **DONE 2026-07-21** — minimal `timeToReach` (S1) + `arrival-calibration`
   reliability curve on current behaviour. `ai/reachability.ts` analytically mirrors
   the current desired-velocity acceleration envelope and reads live momentum,
   fatigue-adjusted top speed, acceleration, independently turning `bodyDir`, optional
   control radius, and the existing carry-speed envelope. It returns movement ETA and
   body-ready ETA separately; no decision-path consumer reads it yet. Directional unit
   gates cover toward/still/away momentum, pace/fatigue, accel, carry, facing and purity.
   The probe now prints the frozen legacy curve and the new kinematic curve side-by-side;
   at 120 matches the S1 curve is monotonic (received 33%→92%, intercepted 63%→5% from
   `<−0.5s` to `>+0.5s`). Feature-off fingerprints remain byte-identical
   (`a9412f22…` / `d14a471f…`), so this is representation/probe only.
3. **DONE at the representation boundary; live cut remains rejected.**
   - ✅ **S3a representation/layer-gate DONE 2026-07-21:** pure stale
     `PerceptionSnapshot`, explicit awareness input, deterministic error + memory, and
     `perception-calibration`; probe-only, so the live passer remains byte-identical.
   - ❌ **S3b live consumer TRIED + REVERTED 2026-07-21:** the mediator worked, but
     awareness did not pay in 120-match head-to-head and the existing pass score table
     shed headed/cutback route richness when deprived of truth. No more sight/error
     constant tuning. **Dependency learned:** build S4 prediction + S5 pass affordance
     offline first; then retry S3→S4→S5 as one closed causal cut where fidelity can
     improve a predicted next state, rather than feeding the old surface score table.
4. **SPLIT at the behavioural boundary.**
   - ✅ **S4a/S5a OFFLINE DONE 2026-07-21:** pure ordinary ground-pass prediction and
     unscored pass-affordance vector, plus `pass-affordance-calibration`. The raw arrival
     margin works and awareness improves its fidelity; the control prior is explicitly
     not accepted as a live scalar. Feature-off fingerprints remain byte-identical.
   - ✅ **S7a OFFLINE DONE 2026-07-21:** weight-free Pareto dominance over eight raw
     next-state dimensions, plus `pass-value-frontier`. It conservatively removes only
     4.8% of current targets and preserves genuine risk/progression tradeoffs. Its outcome
     split is diagnostic only, not layer-4 proof.
   - ❌ **S7b PAYOFF FAILED 2026-07-21:** the real paired clone oracle falsified the
     observational association (509 branches: alternative/chosen dominance 34.4/35.6%,
     possession 53.4→49.1%). No live filter or gene wiring. **NEXT:** add missing future
     causes offline, then repeat the same layer-4 gate before touching `PlayerBrain`.
5. Defender interception/contest read off the same S4 prediction (`canInterceptPass`,
   `PlayerBrain.ts:1074`) — **the co-evolving defensive half** (balances the attack
   read, per the "finely-tuned equilibrium" lesson).

**Files in scope:** `sim/Match.ts` (capture→contest), `ai/reachability.ts`
(timeToReach), `ai/perceptionSnapshot.ts`, `ai/prediction.ts`, `ai/passAffordance.ts`,
`ai/passValue.ts`,
`ai/perception.ts` (`laneOpenness`/`opennessOf`/`canInterceptPass`), and
`ai/PlayerBrain.ts` (pass loop + intercept); `sim/cloneState.ts` is probe-only. **SAVE_VERSION
bumps** only if a gene struct changes (the `vision` revert + any new shared
awareness/anticipation attr).

**Acceptance = probes + the user's eyes, jointly** (goals will move; the gate is
watchability + richer route mix + no runaway, NOT goals≈2.0). Full contract per
phase in [`PROBE-CONTRACTS.md`](PROBE-CONTRACTS.md).

---

## 6. What is hand-built vs emergent (the honest tension)

We DO hand-build: the physics engine, the **set of gene/attr dimensions**, and the
**perception dimensions the eye reads** (S3/S5 axes). Everything **tactical** —
position, shape, movement, which affordance to take, team task assignment — must
**emerge** as evolved WEIGHTS on those dimensions. The substrate's job is to make
genes *meaningful*, never to place players or pick their runs. When a good tactic
doesn't appear, it is a **substrate or selection defect** (the behaviour isn't
possible, or doesn't pay, or isn't selected) — diagnose that, don't hand-script it.
