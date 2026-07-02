# EvoFootball Arena — Architecture & Invariants

**Audience: future coding agents (and humans) modifying this project.**
Read this before touching code. It states how the system is built, why it is
built that way, the traps previous work already fell into, and the invariants
you are not allowed to break. When this document and the code disagree, the
code is the truth — then fix this document in the same change.

---

## 1. System overview

EvoFootball Arena is an autonomous football ecosystem: a **deterministic 2D
5v5 simulation** (the single source of truth), a **utility AI** with
explainable scoring, an **evolving 8-team league** (tactical genes + per-player
squad DNA), and two **read-only views** (PixiJS 2D, Three.js 3D) plus replay,
analytics and debug tooling layered on top.

Data flows one way:

```
                 ┌──────────── deterministic core ────────────┐
 seeds ──> sim/ (Match, League) <── ai/ (brains) <── evolution/ (genomes)
                 └──────────────────┬─────────────────────────┘
                                    │ read-only
        ┌───────────────┬───────────┼──────────────┬──────────────┐
        ▼               ▼           ▼              ▼              ▼
   render/ (2D)   render3d/ (3D)  replay/     ui/ (DOM)     scripts/ (headless
   PixiJS         Three.js via    ReplayBuffer  panels       calibrate/evolve/
                  RenderStateAdapter (10Hz snaps)            playwright)
```

`game/GameApp.ts` is the only orchestrator: it owns the fixed-timestep loop,
the League lifecycle, view switching, replay state, and wires UI actions.

## 2. Module ownership

| Module | Owns | Must NOT do |
|---|---|---|
| `src/utils/` | seeded RNG (`mulberry32`), vec2 math, scalar helpers | import anything else in src |
| `src/sim/` | Match state machine, ball/player physics, mechanics (kicks/tackles/saves/xG), League (fixtures, table, Elo, season lifecycle), stats/events | import render*, ui, pixi, three, browser APIs |
| `src/ai/` | TeamBrain (modes + press/mark assignments), PlayerBrain (utility scoring), action execution/steering, formations, perception | mutate anything except the deciding player's own action/targets (kicks go through `match.perform*`) |
| `src/evolution/` | TacticalGenome + squad DNA operators, fitness, selection (elite/mutate/reborn), names/kits, franchise lineage | know about matches at runtime (it consumes season aggregates only) |
| `src/replay/` | `ReplayBuffer`: 10 Hz RenderState snapshots, binary-search + interpolation | hold references into live sim objects (it stores adapter-produced plain data) |
| `src/render/` | PixiJS 2D view, DebugOverlay, shared `actionLabels`, px transform | write sim state |
| `src/render3d/` | Three.js viewer; `RenderStateAdapter` is the ONLY sim→3D bridge (pure, three-free) | be imported by sim/ai/evolution (enforced by test) |
| `src/ui/` | plain-DOM panels, league screen, replay bar, `GameActions` contract | talk to sim directly for mutations (everything goes through GameApp) |
| `src/data/` | localStorage save/load + version migration | — |
| `src/game/GameApp.ts` | the loop, lifecycle, view/replay switching, dev hook `window.__evo` | contain game rules |
| `scripts/` | headless calibration/evolution probes, Playwright visual tests | be imported by src |

Circular-import rule: `Match` → `ai` at runtime; `ai` → sim **types/entities**
only via `import type` where the target is `Match` itself. Keep it that way.

## 3. Determinism — how it works and how it breaks

- Fixed timestep `DT = 1/60`. `Match.step(DT)` is the ONLY way time advances.
  Watching = N steps per render frame; skipping = `runToCompletion()` running
  the same loop. **Identical trajectories by construction** (regression-tested
  in `tests/match.test.ts`).
- All randomness flows through `match.rng` (seeded mulberry32). **Never call
  `Math.random()`, `Date.now()`, or read wall-clock inside sim/ai/evolution.**
- Iteration order is part of determinism: player arrays are fixed-order; the
  step loop alternates direction per step (see §10 failure modes — this is a
  fairness fix, do not "simplify" it away).
- Rendering/UI must never write sim state; a renderer that consumes RNG or
  reorders arrays silently breaks watched-vs-skipped equivalence.

### Seed derivation (no live RNG state is ever persisted)

```
league creation rng : hashSeed(leagueSeed, 0xF0)
match seed          : hashSeed(leagueSeed, generation, round, fixtureIndex)
evolution rng       : hashSeed(leagueSeed, generation, 0xE0)
v1→v2 squad backfill: hashSeed(leagueSeed, slot, 0xA7)
```

Because every seed is derived functionally, a save can be reloaded at fixture
granularity and the future replays identically (`tests/league.test.ts`
round-trips this).

## 4. AI decision scoring (the explainability contract)

Three layers, all in `src/ai/`:

1. **TeamBrain** (`TeamBrain.ts`, every 0.4 s or on possession change): picks
   one mode — `BuildUp/Attack/Defend/Press/CounterAttack/ResetShape` — from
   possession, ball position, time-since-turnover and genes, then assigns
   **chasers** (1–3 players allowed to hunt the ball; this is what prevents
   ball-swarming) and greedy goal-side **marks**.
2. **PlayerBrain** (`PlayerBrain.ts`, every 0.15 s, staggered symmetrically):
   scores candidate actions as products of normalized perception factors
   (lane openness, receiver openness, space ahead, pressure, xG) × gene
   multipliers. The top candidates **with human-readable `why` strings** are
   stored on `player.action.scores` — the right-panel player card shows them.
   Kicks (`Pass/Shoot/ClearBall`) execute immediately via `match.perform*`.
3. **actionExecutor** (`actionExecutor.ts`, every frame): re-resolves dynamic
   targets (ball intercept points, sliding formation spots, marking positions)
   and blends steering (arrive + separation + avoidance) into `desiredVel`.

If you add an action or score, keep the `why` string honest — the
explainability of scores is a product feature, not decoration.

## 5. Genes and squad DNA — where each one bites

**TacticalGenome** (14 genes, all 0..1, `evolution/genome.ts`) — every gene is
read by the AI or mechanics; the README table lists them. Representative
bindings: `passBias/shootBias/dribbleBias` multiply carrier utilities
(`PlayerBrain.decideCarrier`), `pressIntensity` sets chaser count + Press
threshold (`TeamBrain`), `defensiveCompactness/attackingWidth/formationDepth`
shape `formations.ts`, `markingAggression` sets tackle odds + mark distance
(`mechanics.tryTackles`, executor), `keeperAggression` sets GK line height and
reach, `staminaConservation` trades jog/press sprint speed for energy.

**Squad DNA** (5 attributes per player, `evolution/playerGenome.ts`):
`pace` → ±12% speed/±10% accel (`Player` ctor); `technique` → pass noise ↓,
tackle resistance; `finishing` → shot spread ↓ AND braver aim margin
(`mechanics.performShot`); `defending` → tackle success; `reflexes` → save
probability ±11pp and dive reach (`mechanics.tryKeeperSave`, `keeperReach`).

**Directional tests exist for every gene/attribute channel**
(`tests/genes.test.ts`, `tests/playerGenome.test.ts`). A gene that is not
wired to behavior is a lie in the UI; a gene without a directional test is
unverified. Both are forbidden (see invariants).

## 6. Evolution

Per season (`League.finishSeason` → `evolution/evolve.ts`):

- **Fitness** (`fitness.ts`): min-max-normalized across the league —
  points .28, goal diff .15, shot quality (xG/shot) .12, pass completion .12,
  recoveries .11, stamina efficiency .10, style consistency .12. The
  **champion is force-protected as elite** (winning must never delete a team).
- Ranks 1–2 elite (genome+squad untouched), 3–5 mutated (small gaussian),
  6–8 **reborn**: crossover of two fitness-weighted top-4 parents + heavier
  mutation, new name, same slot/kit, lineage entry with parents recorded.
- Squad DNA mutates/crosses position-by-position alongside the tactics.

Season history (`SeasonRecord`) stores the table, fitness breakdowns and the
evolution report — the league screen renders lineage from it.

## 7. Replay, analytics, debug systems

- **ReplayBuffer** (`src/replay/`): during *watched* play, GameApp records a
  `RenderState` snapshot every 0.1 sim-seconds inside the step loop. Snapshots
  are plain data produced by `buildRenderState` — no sim references. `stateAt(t)`
  binary-searches and interpolates (`interpolateStates`; angles via shortest
  path). The finished match is archived (`ReplayArchive`) so it stays
  rewatchable after the league advances. Headless sims are NOT recorded.
- **Replay UI** (3D only): transport bar (`ui/ReplayBar.ts`) with 0.25×–2×,
  scrubbing, event-jump chips (goal jumps auto slow-mo 0.5×). Entering replay
  pauses the live sim; exiting re-attaches the live theme. Replay reads never
  mutate snapshots (tested).
- **Match analytics**: `Match.shotLog` (every shot with xG + resolved outcome)
  feeds the xG race chart (`ui/XgChart.ts`); live stats table reads
  `TeamMatchStats`.
- **Debug overlays**: one `UiFlags` object drives both views — 2D
  (`render/DebugOverlay.ts`) and 3D (`render3d/Overlays3D.ts`): action labels,
  formation targets, pass/shot lines, marking lines, press rings, heatmap (2D).
- **Dev hook**: `window.__evo` exposes player positions (2D px + 3D projected),
  `three()` debug info, `replayInfo()`, `viewMode()` — used by Playwright and
  console debugging. Extend it rather than adding ad-hoc globals.

## 8. How UI and rendering consume sim state

- The Pixi ticker is the single master loop (`GameApp.frame`): sim steps →
  (record replay) → render active view → panels at ~10 Hz.
- 2D reads `Match` directly (positions/actions/stats) — read-only.
- 3D reads **only** `RenderState` from `RenderStateAdapter.buildRenderState`
  (sim x→world x, sim y→world z, height→world y, velocity→yaw, action→anim
  via `animFor`, kit colors→materials). The adapter is pure and three-free;
  ball height on kicks is synthesized inside `BallModel` (visual only).
- Every UI control calls a `GameActions` method implemented by GameApp. No
  panel touches League/Match mutators directly.
- 3D lifecycle: created lazily on first switch, fully `dispose()`d on switch
  back to 2D; WebGL init failure logs to the feed and stays in 2D.

## 9. Playwright visual debugging

Real-browser validation (headless Chromium, `--enable-unsafe-swiftshader`):

- `npm run debug:visual` — 2D: renders, clock advances at 32×, stats/feed/xG
  chart populate, click-to-select via `__evo.playerPositions()`, league screen,
  UI-driven season sim, zero console errors. Screenshots →
  `/tmp/evofootball-shots/`.
- `npm run debug:visual3d` — 3D: renderer init, 10 player models + 2 goals,
  non-blank canvas (PNG-size heuristic; `drawImage` on WebGL canvases is a
  false-negative trap), all camera modes, 3D picking updates the player card,
  replay open/scrub/jump/exit, dispose→re-init cycle, zero console errors.
  Screenshots → `/tmp/evofootball-shots-3d/`.

Both need the dev server (`npx vite --port 5199 --strictPort`). Screenshots
are meant to be LOOKED AT — layout/readability bugs (label clipping etc.) are
only caught by eyes on the PNGs.

## 10. Known dangerous failure modes (all happened; don't repeat them)

1. **First-mover iteration bias.** Whichever team is processed later each
   frame reacts to fresher state — measured at ~10 pp shot-conversion
   advantage. Fix in place: the step loop and capture scan alternate direction
   every step. Any new per-player loop with cross-team effects needs the same
   treatment (or a snapshot-then-apply design).
2. **Post-hoc save difficulty.** Evaluating keeper-dive difficulty when the
   ball arrives (after the GK converged on the path) made shot accuracy
   worthless and rewarded wild shots. Difficulty is **frozen at shot time**
   (`PendingShot.difficulty`). Don't move it back.
3. **Self-defeating gene coupling.** Letting `finishing` also raise shot
   *utility* made finishers take terrible shots — a net-negative gene that
   evolution would have selected against. Attributes should pay off in
   *execution*; selection changes belong to tactical genes, deliberately.
4. **Wrong metric traps.** "Shots on target" counts saves, so sprayed shots
   drifting at the keeper score *better* on it than corner-shaving finishes.
   Use conversion (goals/shot) or goals/xG from `shotLog`.
5. **Underpowered A/B measurements.** Gene effects are a few pp; a handful of
   one-sided matches measures pitch-side noise. Directional tests must be
   side-balanced (swap which team carries the trait) and pooled over enough
   seeds (`tests/playerGenome.test.ts` finishing test: 30 seeds × both sides).
   Determinism means a passing test stays green forever — verify it passes for
   the *right* reason before committing.
6. **Meta collapse.** Evolution will monoculture on any strictly-dominant
   strategy (dribble-forward high-line, historically). Watch
   `npm run evolve-check` identity tags after balance changes.
7. **Event-feed spam.** Logging every tackle (~40/match) drowns the feed —
   high-frequency events get stats, not feed lines.
8. **UI-model drift in tests.** After FT the app immediately loads the next
   fixture (paused), resetting scoreboard/stats. Browser checks must read
   mid-match, not after.
9. **WebGL readback false negatives.** `drawImage`/`getImageData` on a WebGL
   canvas without `preserveDrawingBuffer` returns blank. Judge rendering by
   compositor screenshots.
10. **localStorage schema drift.** Bumping save shape without a migration
    bricks saves silently (`loadLeague` swallows to null). v1→v2 migration in
    `League.fromJSON` is the pattern to copy.

## 11. Known tuning levers

| Goal | Lever |
|---|---|
| Goals per match (~2.9 target) | `mechanics.tryKeeperSave` saveP base (0.52 − xG·0.6); shot `spread`; xG curve `exp(-d/11)` |
| Pass-fest vs dribble balance | carrier utility bases in `PlayerBrain.decideCarrier`; post-receive settle (`giveBall` decisionTimer 0.3) |
| Turnover rate | tackle probability in `mechanics.tryTackles` |
| Pressing strength | chaser count logic in `TeamBrain.assignChasers`; press mode threshold 0.62 |
| Match/season length | `MATCH_DURATION` (240 s), single round-robin in `buildRoundRobin` |
| Evolution pressure | band sizes + mutation scales in `evolve.ts`; fitness weights in `fitness.ts` |
| Feel | stamina drain/recovery in `Player.physicsStep`; speed constants in `constants.ts` |

Always re-run `npm run calibrate` (balance) and `npm run evolve-check` (meta
diversity, 10 seasons ≈ 12 s) after touching any of these. Reference numbers
live in the README "Balance" section — update them when they move.

## 12. Non-negotiable invariants

Violating any of these is a rejected change, regardless of how nice the
feature is:

1. **`src/sim` (with `ai/`, `evolution/`, `utils/`) stays independent of
   rendering and browser APIs.** No pixi/three/DOM/localStorage imports —
   enforced by `tests/render3d.test.ts` boundary checks. League simulation
   must never depend on WebGL.
2. **Headless season simulation stays fast.** Budget: ≲50 ms per 240 s match,
   a 10-season fast-sim in ~10–15 s (`npm run calibrate` prints ms/match).
   No per-step allocations explosions, no O(n²) blowups beyond the existing
   10-player pair loops.
3. **Watching and skipping the same seeded match produce identical results.**
   Same seed ⇒ same score, events and stats — step-by-step vs
   `runToCompletion` is regression-tested and must stay green.
4. **Every visible UI button does something real.** No stubs, no dead
   controls; disable controls that don't apply (e.g. camera buttons in 2D).
5. **A new tactical gene must be wired into mechanics or AI scoring** before
   it appears in any UI. Unwired genes displayed as bars are lies.
6. **A new player attribute needs a directional-effect test** (side-balanced,
   adequately powered) proving the sim responds in the intended direction.
7. **Evolution changes are judged with season-level stats** — run
   `npm run evolve-check` / `npm run calibrate`, look at champions, Elo
   spread, identity diversity; never merge on gut feel from one match.
8. **Replay never mutates live simulation.** Snapshots are plain data; replay
   playback/scrubbing is read-only (tested); entering replay pauses the sim.
9. **Save migrations preserve old saves.** Bump `SAVE_VERSION` + write an
   in-place migration in `League.fromJSON` (v1→v2 squad backfill is the
   model); a save that loaded yesterday must load tomorrow.
10. **Done means verified:** `npm test` (all green), `npm run typecheck`,
    `npm run build`, plus `npm run debug:visual` (and `debug:visual3d` if the
    3D path is touched) — and someone looked at the screenshots. Declaring
    completion without these is forbidden.

## 13. How to safely add a new feature

Checklist — do these in order:

1. **Decide where it lives**: sim (rules/physics), ai (decisions), evolution
   (genomes/selection), render/render3d (visuals), ui (controls/panels), or
   analysis (scripts/, stats, charts). If it spans layers, define the data
   contract first (see `RenderStateAdapter` for the pattern).
2. **Add the smallest working version** — end-to-end but minimal. Prefer a
   simpler working mechanic over an ambitious stub (stubs are forbidden).
3. **Add a directional test** — determinism keeps it stable; make sure it has
   the statistical power to mean something (§10.5).
4. **Expose it in debug UI only after it works** (overlay checkbox, panel row,
   `window.__evo` accessor) — debuggability is part of the feature.
5. **Run calibration** — `npm run calibrate` + `npm run evolve-check`; compare
   against the README reference numbers; investigate any balance drift you
   didn't intend.
6. **Run browser validation** — `npm run debug:visual` (+ `debug:visual3d` if
   relevant) and actually look at the screenshots.
7. **Update README** (features, balance numbers, scripts) **and this document**
   if you changed architecture, invariants, seeds, or added a failure mode
   worth remembering. There is no separate CHANGELOG — README + git history
   serve that role.
