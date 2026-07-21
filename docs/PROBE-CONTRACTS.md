# EvoFootball Probe Contracts — the acceptance methodology

> **Why this exists.** `fires ≠ works ≠ pays ≠ selected ≠ good football`. The
> one-two experiment FIRED more often, "worked" mechanically — and fresh evolution
> **culled it while inflating goals**. No change ships on a single scalar or a
> handful of match-level stats. Every substrate/attr/gene change must prove **six
> things, in order**. Companion to [`SUBSTRATE-MAP.md`](SUBSTRATE-MAP.md); this
> enforces [`VISION.md`](VISION.md) §6 discipline ("一次一根杠杆, probe-first,
> A/B, honest-revert").
>
> Ratified 2026-07-20 (user + GPT + Claude). The probe **inventory** (60+ existing
> tools) is catalogued at the end; this doc adds the **contracts** they serve.

---

## 1. The six-layer acceptance chain

Any new capability, attribute, or gene proves these **in sequence** — a failure at
layer N means STOP, do not chase layer N+1:

| # | Layer | The question | Evidence style |
|---|---|---|---|
| 1 | **Mechanism exists** | did the internal mechanism actually change? (obs-error moved, ETA sharper, first-touch faster, turn cost lower, trajectory error changed) | frozen-scene, **direct mediator** measurement |
| 2 | **Gene bites correctly** | is the causal PATH right, not a shortcut? `awareness↑ → info fresher → prediction better`, **NOT** `awareness↑ → +10% tackle` | causal-path (mediator) test, not just directional |
| 3 | **Capability appears** | does the world ALLOW the behaviour? (candidate generated, window exists, receiver reachable) | behaviour-possibility probe |
| 4 | **It pays** | vs hold / neutral / alternative, does it improve the NEXT state? | **counterfactual** rollout (the layer we kept missing) |
| 5 | **Evolution selects conditionally** | does **fresh** evo keep it in SOME ecologies, reject in others, at a real budget price? | multi-world fresh-evo + shadow-price |
| 6 | **World remains healthy** | §2 watchability, readability, diversity, realism, ecology, perf, determinism | paired non-inferiority + ecological + replay clips |

**The new default question** is no longer *"did behaviour X happen more?"* but
*"why did it happen, what did it create, why did evolution keep it, and did it
crowd out other football?"*

---

## 2. Five threshold TYPES (never mix them)

Each gate belongs to exactly one type; state which when you write the contract.

- **Exact invariant** — must hold to the bit: feature-off is bit-identical
  (`fingerprint`), state ledger conserves, `watched === headless`, no illegal
  states. *(vitest: `match.test`, `simRunner.test`, `rng.test`.)*
- **Directional** — only the sign is required: `awareness↑ → obs-error↓`,
  `agility↑ → turn-ETA↓`. Side-balanced, enough seeds (ARCHITECTURE rule).
- **Calibration** — predicted probability ≈ observed frequency: events predicted
  "70% control" should land ≈70%. *(The whole point of `arrival-calibration`.)*
- **Paired non-inferiority** — same-seed A/B: scramble/goals/route-mix must not
  regress out of the agreed band. The verdict is *"not worse,"* not *"better."*
- **Ecological** — multi-seed, multi-generation, **fresh** evo: divergence exists,
  **no runaway** axis, payoff is frequency-dependent.

---

## 3. Gate structure per phase (no single VisionScore)

**Never** collapse the vision into `VisionScore = 0.3·realism + 0.3·diversity + …`
— the moment it's one scalar, we optimise the scalar, not the football (Goodhart).
Instead, every phase declares:

- **Hard gates** (any fail ⇒ NO ship): determinism · neutral baseline · mechanism
  direction · state-ledger conservation · §2 no-obvious-regression · no ecology
  runaway · **perf non-regression** (relative to tag: live-frame p95 / sim-step p95
  / allocations / headless matches·s⁻¹ — see §5.5).
- **ONE primary outcome** for the phase (the thing this lever is for).
- **2–4 mediators** proving the result arrived **via the intended path** (layer-1/2
  variables), not a side effect.
- **Diagnostics** — may move freely, do **not** decide ship.

Acceptance is **probes + the user's eyes, jointly** (user 2026-07-20). Behavioral
levers WILL move goals; §2 is a watchability judgement (probe proxies + play-test),
**not** a goals≈2.0 veto.

---

## 4. Per-phase contract template

Copy this block per phase (into ROADMAP or a phase note):

```md
## Hypothesis          — what real-football causality are we adding?
## Substrate mechanism — what new capability exists in the world? (which S-layer)
## Gene hooks          — which capability/preference/knowledge/state acts where?
                         (must obey the SUBSTRATE-MAP hook table's "MUST NOT" column)
## Primary mechanism probe   — the ONE mediator we measure directly (layer 1/2)
## Behaviour probe     — which behaviour should now be POSSIBLE? (layer 3)
## Counterfactual payoff probe — value vs hold / neutral / alternative (layer 4)
## Match guardrails    — goals / scramble / spell / churn / route-mix / shape (layer 6)
## Evolution gate      — does FRESH evo select it conditionally? (layer 5)
## Ecology gate        — diversity kept, negative freq-dependence, no runaway? (layer 5/6)
## Replay sample       — worst / median / best / largest-A-B clips (seed+timestamp)
## Ship rule           — which gates are HARD fail, which are WATCH-only
## Threshold types     — tag each gate: invariant | directional | calibration
                         | paired-non-inferiority | ecological
```

---

## 5. The probe roster (classified by WHEN to build)

The key discipline: **do not build a gate-probe before the substrate it gates
exists.** Probes fall into classes:

### EXISTING — strong coverage, call directly
`calibrate -- 8` (box-score, goals band) · `goals-warming` (inflation curve) ·
`scramble-anatomy` / `spell-dist` / `churn` (乱抢, §2) · `cross-anatomy` /
`cutback-anatomy` / `width-funnel` (box-arrival) · `spill-anatomy` /
`positioning-bite` / `reception-by-width` / `orientation-ab` (**first-touch — NOT a
gap**) · `goal-channel-census` / `shot-context-anatomy` / `launch-anatomy` (route
mix) · `freq-dependence` / `matchup-matrix` (self-balance) · `scheme-matchup` /
`positioning-shape` / `run-repertoire` / `transition-anatomy` (shape/runs/transition).
Gates: `offside.test`, `cutback.test`, `oneTouch.test`, `cushion.test`,
`touches.test`, `blocks.test`, `aerial.test`, `combos.test`, `goalChannels.test`.

### BASELINE-NOW — build BEFORE slice-1 (measure the current world, bank the "before")
| Probe | Emits | Acceptance layer |
|---|---|---|
| `contest-anatomy` (NEW) | loose-ball events/m; **state-ledger completeness** (every loss-of-control → controlled-opp / controlled-same / contest / out / dead — **no `owner=null` orphan**); source×outcome matrix (block-2nd / tackle-loose / keeper-spill / aerial-knockdown / first-touch-spill → atk-recover% / def-recover% / re-loose%); bodies within 3m/6m; time-to-controlled; **`pinballChainLength`**; **`contestToChanceRate`** | 3, 6 |
| `arrival-calibration` (NEW, reliability half) | control-reliability curve: margin-bucket (`<−0.5 … >+0.5`s) → clean / contested / intercepted / died-in-flight / lose<0.5s / stable@1.5s, by pass type × zone | 3, 4, 6 |
| `reception-survival` (NEW) | post-reception 0.5–1.5s: `stableControl@0.5/1.5s`, `forwardReady@1.0s`, `nextOptionCount`, `receiveToTurnover`, `receiveToProgression` (reuse `spill-anatomy` for the touch itself — don't rebuild) | 3, 4 |
| `probe-pass` (EXTEND) | per {short/long/through/cross/lateral/one-touch}: attempts / clean / interrupted / contest-created / intercepted / out / stable@0.5s / stable@1.5s / facing-forward / line-broken / next-options / possession-value-delta | 3, 4, 6 |
| `perception-calibration` (NEW, **run once now**) | truth vs internal observation: position/vel/dir MAE, missed-threat, phantom-threat, observation-age, blind-side latency. **On the OLD engine this reads ≈0 = the perfect-information baseline** (proves the hole, not quality) | 1 |

### LAYER-GATE — build WITH the substrate layer it gates (it measures something not built yet)
| Probe | Gates | Acceptance layer |
|---|---|---|
| `perception-calibration` (as a gate) | S3 `PerceptionSnapshot` | 1, 2 |
| `arrival-calibration` (prediction-MAE half) | S4 predictor (predicted vs actual ETA MAE by horizon/facing/speed/fatigue) | 1, 2 |
| `pass-value-frontier` | S7 next-state relation: Pareto-frontier size, dominated live choices, awareness→pair/frontier fidelity; outcome split is diagnostic, **not counterfactual payoff** | 1, 3 |
| `cognition-factorial` | S3/S4 gene wiring — 2×2 `awareness×passing` (attack) & `awareness/anticipation × tackling/defending` (defence); proves the shared trunk serves BOTH sides while domain skill still differentiates | 2, 3, 4 |

### REUSABLE-WORKHORSE — the layer-4 engine for EVERY future lever
| Probe | Emits | ⚠ |
|---|---|---|
| `counterfactual-value` | clone the frozen state, run paired-seed branches (real run / hold / neutral support / alternative point) 2–4s, compare possession-prob / progression / options / line-break / xG / opponent-displacement / mate-space / turnover-exposure. Core metric **`offBallAddedValue = rollout(actualRun) − rollout(hold)`** | **Feasibility spike first — see §8** |

### FRAMEWORK-LATER — standing contracts, instantiated per future slice/layer
`shape-dynamics` (S8 team shape: centroid/width/length/stretch/surface-area/
response-lag/reform-time — **relative, not 11v11 absolute metres**) · `coordination-
anatomy` (S8 task-bidding: `uncoveredTaskTime` / `duplicateTaskTime` / `handoffLatency`
/ `taskFitRegret` / `shapeHoleDuration`) · `dilemma-anatomy` (does a break-defence
move create a REAL 2-choice for one defender — operationalises overload/third-man/
wall-pass/drag/switch/dribble-to-commit **without labels**) · `style-identifiability`
(behaviour-only classifier; within-team distance < between-team, held-out opponent/
season — the machine proxy for "战术肉眼可辨"; note 100% ≠ good, also want
opponent-adaptation) · `attribute-shadow-price` (budget-conserving swaps: marginal
value per 0.1 per role/ecology — no attr universally must-buy or perpetually drained)
· `fresh-evo-retention` (per new attr: frozen→paired→fresh-evo→multi-world→spread,
not driven to 0 or 1).

---

## 5.5 Probe tiers & shared telemetry (dev-cycle scaling)

The dev cycle 卡 before the player's machine does — running 60+ probes (multi-world,
multi-gen, A/B, matchup, visual) on every change makes a phase take hours. So probes
are TIERED and share ONE trace:

- **Tier 0 — every change, seconds:** unit tests · determinism invariant · frozen
  mechanism scene · gene directional bite · state conservation · feature-off bit-identity.
- **Tier 1 — every commit, 1–3 min:** small paired A/B · contest · arrival ·
  perception-calibration · reception-survival · neutral mirror · scramble guard.
- **Tier 2 — pre-ship, ~10–15 min:** calibrate · goals-warming (short) · fresh-evo ·
  matchup · style-identifiability · replay-sample extraction.
- **Tier 3 — nightly/milestone:** multi-world long evo · freq-dependence · 24–40 gens ·
  full ecology · visual matrix · large counterfactual rollouts.

**Shared telemetry (build once):** one sim run emits a trace — `TelemetryEvent`,
`DecisionTrace`, `PossessionTransition`, `PassLifecycle`, `ContestLifecycle`,
`TaskLifecycle` — and many probes analyse the SAME trace offline. Kills the "run 500
matches 10× for 10 metrics" waste. ⚠ **Invariant: the trace is flag-gated,
PURE-observational, and OFF by default** (live + fingerprint runs never emit) — emitting
must never change sim results (determinism), and per-event allocation stays out of the
hot path. Perf is measured by the phase-level profiler in `Match.step` (physics /
perception / prediction / candidates / coordination / mechanics / snapshot-building).

## 6. Replay sampling — 让你少看,不是不看

Watching can't be fully replaced (rhythm/narrative/continuity live in the eye). But
cut the cost from "dozens of matches" to **~20 auto-mined clips per phase.** Each
probe emits `replay seed + timestamp`; auto-extract four sets: **worst 5**
(max scramble / max prediction error / longest uncovered task) · **largest A/B diff
5** · **median 5** · **best 5**. Watch each **twice**: pass 1 no overlay (是否像
足球), pass 2 with perception/ETA/task/candidate-score overlays (diagnose why). This
kills the "only the highlight looks great, 90% of normal play is weird" failure.

---

## 7. Watchability dashboard (§2, one view — don't read them scattered)

- **Chaos:** contest time-share · loose-ball time-share · `pinballChainLength` ·
  <3s ownership flips · touches before a controlled spell · decision-target flip
  rate · time with ≥3 bodies converging on the ball · duplicate-function bodies in
  a zone.
- **Football-formation:** controlled-possession duration · goals by route · goals
  after a line-break · goals after a contest/deflection chain · receiver
  stable-control rate · chances from **structured** attack vs scramble · attacks by
  width / central / combination progression · defensive shape recovered before a
  chance.
- **Fluency:** dead-ball time · restart setup · interruption frequency · ball-out
  rate · action-commitment duration · players reversing target without acting.

**Do not** demand all possessions get longer or all goals come from build-up — the
vision wants **multiple readable routes**, not forced tiki-taka.

---

## 8. Counterfactual boundary + open feasibility items

- **Rule — online counterfactual = NEVER, offline = ORACLE.** The live AI must use a
  CHEAP value estimator (S7 bounded lookahead: ETA / pitch-control / line-break /
  estimated future options / local danger). `counterfactual-value` is the OFFLINE
  oracle that CERTIFIES the cheap estimator actually flags the valuable runs. Never
  clone-and-rollout inside the live sim — it explodes exponentially and reads like a
  god-compute chess engine (violates §1's "long eyes," not omniscient search).

- **✅ FEASIBILITY SPIKE + POC DONE (2026-07-20) — use STRUCTURAL DEEP-CLONE (Option A).**
  My first read-only pass recommended the conservative replay-to-T; a deeper
  separate-session POC then proved **deep-clone is the better call and cheap**:
  - `Match` has ONE randomness source (`readonly rng: Rng`, `Match.ts:252`; whole state
    = a single u32 `s`; **no `Math.random`/`Date`/`performance.now` in the sim path** —
    only UI/render/profiler). `private` is erased at runtime → `rng.s` is read/settable
    externally, so **no sim file needs editing** to capture/restore it.
  - CLOSED state graph: fixed `DT=1/60` (full match = 14,400 steps), no cross-run module
    state (the "A-then-B" determinism test proves it) beyond a dt-keyed trig cache + a
    const config flag. The ONLY object refs needing remap are `Ball.owner`/`lastTouch`;
    `Team.chasers/marks/runners` are Set/Map (structural, not JSON, clone); everything
    else is gid-indexed, no closures (`ActionState` is pure data).
  - A generic prototype-preserving, cycle-safe cloner gives **byte-identical
    continuations**: POC (`scripts/probes/_poc-clone.ts`) = **25/25 cases (5 seeds × 5
    freeze ticks incl. half-time) identical for 4 s + identical full-match remainder**;
    negative control (1-bit RNG nudge) **DIVERGES** (assertion non-vacuous). Cost
    **~275 µs/clone vs ~94 ms replay-to-T ≈ 342× cheaper**; replay-to-T stays the
    trivial fallback.
  - ✅ **Mainline primitive now landed (2026-07-21):** `sim/cloneState.ts` promotes the
    field-agnostic cloner with a 4s byte-identical continuation regression, and
    `pass-target-counterfactual` is its first real consumer. It freezes the state just
    before a live pass decision and forces chosen-target vs alternative-target branches
    from identical RNG. The first S7 run correctly **failed** payoff (509 pairs:
    alternative/chosen dominance 34.4/35.6%; team possession 53.4→49.1%), proving the
    oracle can veto a plausible-looking estimator rather than rubber-stamp it.
- ⭐ **This does NOT gate S7.** Live bounded-lookahead uses the CHEAP analytic estimator
  (ETA / pitch-control / next-options), never a Match rollout (too slow per-tick under
  either scheme) — the clone-vs-replay choice only touches the offline oracle, so the
  online=never / offline=oracle boundary above holds cleanly.

---

## 9. Build order (merges the user's revised sequence + the probe classification)

1. Write [`SUBSTRATE-MAP.md`](SUBSTRATE-MAP.md) + this doc. ✅ (this pass)
2. **Settle the tree:** commit `position-aware budget` + keeper; **revert the
   `vision` 10th-attr wiring** (1 call site) → clean slice-1 baseline HEAD.
3. Build the **BASELINE-NOW** probes (§5) + run the full EXISTING suite; **freeze
   baseline JSON** on the settled HEAD.
4. **Feasibility spike** for `counterfactual-value` (§8); build it if (a) is cheap,
   else scope the replay-to-T version.
5. **Begin Pass–Arrival–Contest slice-1a** (SUBSTRATE-MAP §5), one sub-step at a
   time, each verified in the six-layer order: **mechanism → gene-bite → capability
   → payoff → fresh-evo → ecology → replay clips.** LAYER-GATE probes come online
   as their layer lands.
