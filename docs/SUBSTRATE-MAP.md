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

### S1 — Body dynamics & reachability · 🟡🔴
- ⭐⭐ **2026-07-20: the player is a POINT, not a body** — `resolveOverlaps` (`Match.ts:1897`)
  is an isotropic, MASSLESS push at `PLAYER_MIN_DIST=1.05`, **position-only (never touches
  velocity)**; movement is one isotropic accel envelope + a separately-rotating `heading`.
  No body volume / orientation-in-collision / screening / mass. Deepest gap under the contest
  work → its OWN plan: **[`world-model/FOUNDATION.md`](world-model/FOUNDATION.md)** (target =
  **Kinematic Disc + Oriented Shell**; the Minimum Embodied Contest Slice M0–M4). `strength`
  has no body-layer causality here (a coefficient, not an embodied cause).
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
  backlog).

### S3 — Perception · 🔴 (the deepest hole)
- **Provides:** each player reads a `PerceptionSnapshot` (observed ball/players +
  remembered last-known + visible regions + cues + timestamp), **NOT the full
  `Match`**: FOV, peripheral, occlusion, scanning, update latency, blind-side
  decay, velocity/direction estimate error, cues off the carrier's body, info loss
  under pressure/fatigue.
- **Hooks:** `awareness`(how much/how fast/how noisy); `concentration` (state
  modifier first, not an attr yet); experience/role-familiarity (what to attend to).
- **Determinism-safe:** stale observations + limited FOV + decision-tick latency +
  **functional error keyed on (seed,player,tick,quantity)** — never per-frame RNG.
- **Code:** `decideCarrier`/`decideOffBall` read real coordinates; perfect info.
  The `laneOpenness`/`opennessOf` velocity-`lookaheadS` is the only sliver. **→
  P0/P1.** (Perfect info is why offside v1 went to zero — decider & referee read
  the same truth in the same frame.)

### S4 — Short-horizon prediction · 🔴
- **Provides:** `predictBall(t)`, `predictPlayer(p,t)`, `predictArrival(p,point)`,
  `predictControlAt(point, ballArrivalT)`.
- **Hooks:** `anticipation`(window & error), `awareness`(input quality), body
  attrs (real reachability).
- **Effect:** one high-`anticipation` player reads passing lanes earlier ON
  ATTACK and moves to the pass-landing earlier ON DEFENCE — **the shared
  attack/defence reading trunk** (this is what the reverted single-sided `vision`
  attr should have been).
- **Code:** immediate geometry only.

### S5 — Affordance & pitch control · 🔴 (never shipped)
- **Provides:** for a candidate point `p`, a **VECTOR** (not one score):
  `selfArrival, teammateArrival, opponentArrival, controlProbability,
  receivePressure, bodyOrientationOnArrival, lineBreakValue, goalThreat,
  supportValue, spaceCreationValue, restDefenceCost, offsideRisk, exitOptions`.
- **"Space" is DERIVED** from opponents+teammates+pitch, not "distance to nearest
  man." Openness = who arrives first, in what body state, with what next value.
- **Hooks:** `spatialIQ`(which dims matter, structure recognition),
  `anticipation`(arrival times), `decisions`(compare affordances), body/technique
  (feasibility "for me").
- **Code:** `laneOpenness`/`pressure`/xG exist as **separate** scores; no unified
  dynamic pitch-control model. `emergentStation` is a hand-tuned proxy, not this.

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
  (`wallPassW/thirdManW/overlapW`, `RUN_ROLE_W`, role bonuses).

### S7 — Action value & bounded lookahead · 🟡🔴
- **Provides:** not "how good does this look NOW" but "what does it turn the NEXT
  state into." Minimal lookahead (1–2 key events, **no MCTS**):
  `action → ball/people arrive → possession outcome → next high-value choice`.
- **Value vector:** `possessionDelta, progression, threatCreated,
  threatConcededIfLost, opponentDisplacement, teammateOptionsCreated,
  structureCost, energyCost`, weighted by personality + coach philosophy.
- **`decisions` acts here:** smaller valuation error / fewer missed high-value
  candidates / less fooled by surface EV / slower degradation under time pressure —
  **NOT a flat success buff.**
- **Code:** utility scoring exists (`PlayerBrain` `cands: UtilityScore[]`, with
  `why`); it is a **score table**, not a predicted-outcome estimator.

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
  becoming a tactical ceiling.

### S9 — Shared intent, comms & familiarity · 🔴
- Receiver expresses intent; a run becomes a passer cue; carrier body-orientation
  is a cue; is a task already taken; explicit/implicit comms; predicting a
  familiar mate's run; trained set-plays as shared conventions.
- **Hooks:** `teamwork`(mate-benefit weight, responds to shared task),
  `roleFamiliarity`, teammate familiarity, coach tactical familiarity, learned
  patterns.

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
3. Minimal stale `PerceptionSnapshot` for the passer only (S3), gated by
   `awareness`; `perception-calibration` confirms obs-error rises from ≈0.
4. Affordance vector for pass targets (S5) replacing the single `laneOpenness`/
   `opennessOf` scores in the pass loop (`PlayerBrain.ts:272+`); valuation via S7
   next-state estimate.
5. Defender interception/contest read off the same S4 prediction (`canInterceptPass`,
   `PlayerBrain.ts:1074`) — **the co-evolving defensive half** (balances the attack
   read, per the "finely-tuned equilibrium" lesson).

**Files in scope:** `sim/Match.ts` (capture→contest), `ai/reachability.ts`
(timeToReach), `ai/perception.ts` (snapshot + `laneOpenness`/`opennessOf`/
`canInterceptPass`), `ai/PlayerBrain.ts` (pass loop + intercept), a new affordance
scorer (inline first, extract to `ai/affordances.ts` once stable). **SAVE_VERSION
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
