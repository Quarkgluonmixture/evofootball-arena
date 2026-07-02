# EvoFootball Arena

A top-down 2D **autonomous football ecosystem**. AI-controlled 5v5 teams play
matches against each other, compete in round-robin seasons, and **evolve their
tactical DNA across generations**. You mostly watch: speed games up, inspect
why players make decisions, follow the league table, and track how tactical
identities drift, die out, and get reborn over seasons.

No reinforcement learning — by design. The simulation is a deterministic,
explainable **utility AI + evolutionary strategy** system: every decision has a
visible score, every team has 14 readable "genes", and evolution is something
you can watch and reason about.

## Running

```bash
npm install
npm run dev        # open the printed URL (Vite dev server)

npm test           # vitest: determinism, league, evolution, gene/attr-effect tests
npm run build      # typecheck + production bundle
npm run calibrate  # headless: 2 seasons, prints per-match balance stats
npm run evolve-check      # headless: 10 seasons of evolution
npm run debug:visual      # drives the real 2D game in headless Chromium (dev server must be up)
npm run debug:visual3d    # same, for the 3D viewer: meshes, cameras, replay (20 checks)
```

Requires Node 18+. No backend, no network — everything runs and saves locally.

## How to play (watch)

- **Speed controls** (left panel): pause / 1× / 2× / 8× / 32×, plus **⏭ skip**
  to finish the current match instantly (identical result — see Determinism).
- **Simulate** buttons run a whole round / season / 10 seasons headless.
- **League table** (top bar) opens standings, team cards with genes + lineage,
  and the season/evolution history.
- Click any player on the pitch to see their current action **and the utility
  scores behind it** in the right panel.
- Debug overlays (left panel): action labels, formation targets, pass lines,
  shot vectors, marking lines, press assignments, ball heatmap.
- The league **auto-saves after every season** (localStorage); Save/Load/Reset
  in the top bar. `New league` accepts a numeric or text seed.

> **Contributing / coding agents:** read
> [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) first — module ownership,
> determinism and seed derivation, known failure modes, the **non-negotiable
> invariants**, and the add-a-feature checklist live there.

## Architecture

```
src/
  main.ts               entry point
  game/GameApp.ts       orchestrator: fixed-timestep loop, league flow, UI wiring
  sim/                  pure simulation — no rendering imports, fully testable
    constants.ts        pitch dimensions, physics constants, timing
    types.ts            shared types (roles, actions, events, stats)
    Match.ts            deterministic match state machine + physics + phases
    mechanics.ts        kicks, tackles, keeper saves, xG model
    Player.ts Ball.ts Team.ts   entities
    League.ts           fixtures (round robin), table, Elo, season lifecycle
  ai/
    TeamBrain.ts        tactical mode + press/marking assignments (coordination)
    PlayerBrain.ts      utility scoring for player actions (the "why")
    actionExecutor.ts   turns chosen actions into desired velocities each frame
    steering.ts         seek / arrive / separation / avoidance
    formations.ts       gene- and mode-adjusted formation & support spots
    perception.ts       normalized queries: pressure, lanes, openness, intercepts
  evolution/
    genome.ts           TacticalGenome (14 genes), mutate/crossover, identity tags
    franchise.ts        league slots with lineage across generations
    fitness.ts          multi-factor fitness (see below)
    evolve.ts           elite / mutate / reborn selection
    names.ts            seeded team & player names, kit palettes
  render/               PixiJS v8 — pitch, players, ball trail, goal FX, overlays
  ui/                   plain-DOM panels: scoreboard, genes, event feed, league screen
  data/save.ts          localStorage persistence
tests/                  vitest suites (73 tests)
scripts/                headless calibration & evolution tools
```

**Dependency rule:** `sim/`, `ai/`, `evolution/` never import from `render/` or
`ui/`, so the whole game logic runs headless (tests, calibration, fast-sim).

## The simulation

- **Fixed timestep** (1/60 s). The watched match and the headless match run the
  exact same `Match.step()` — speed is just steps-per-frame.
- **Determinism:** all randomness flows through a seeded RNG (`mulberry32`);
  every match seed is `hash(leagueSeed, generation, round, division*4+index)`.
  Same seed ⇒ identical match, watched or skipped. Saves store no RNG state.
- **Pitch:** 90×58 m, futsal-style walls (the ball bounces instead of going
  out) to keep autonomous play flowing. Goals are real: 7 m mouths.
- **Ball:** exponential friction, kick impulses, owner-glued dribbling,
  interceptable in flight; keepers can handle faster balls than outfielders.
- **Players:** acceleration toward a desired velocity, role-based top speed,
  quadratic stamina drain above ~55% effort (tired players cap at 62% speed),
  pairwise separation so nobody stacks.
- **Match flow:** kickoff → two halves → goal pauses → full time, with a
  90-minute display clock mapped onto 240 sim-seconds.

## The AI (three layers)

1. **TeamBrain** picks one of six modes — `BuildUp, Attack, Defend, Press,
   CounterAttack, ResetShape` — from possession, ball position, time since
   turnover, and genes. It also hands out **assignments**: at most 1–3 players
   are allowed to chase/press (this is what prevents ball-swarming), and
   remaining defenders get man-marking targets.
2. **PlayerBrain** scores candidate actions every 0.15 s (staggered):
   carriers weigh `Pass / Shoot / Dribble / ClearBall`; off-ball players weigh
   `ReceivePass / SupportBallCarrier / MoveToFormationSpot / ChaseBall /
   MarkOpponent / InterceptPass`; keepers have `GoalkeeperSave / Position`.
   Every score is a product of normalized perception factors (lane openness,
   receiver openness, space ahead, pressure, xG) and **gene multipliers** —
   the top candidates with reasoning strings are shown in the right panel.
3. **actionExecutor** re-resolves dynamic targets each frame (moving-ball
   intercept points, sliding formation spots, goal-side marking positions) and
   blends steering: arrive + separation + opponent avoidance.

## Tactical genes → visible behavior

All 14 genes are 0..1 and read directly by the AI:

| gene | effect |
|---|---|
| passBias | multiplies pass utility; improves pass accuracy |
| shootBias | multiplies shot utility (shoot-on-sight at high values) |
| dribbleBias | multiplies dribble utility |
| pressIntensity | more assigned pressers, Press mode threshold |
| defensiveCompactness | off-ball block squeezes toward ball/center |
| attackingWidth | in-possession formation stretch |
| riskTolerance | gates contested forward passes; more clearing when low |
| counterAttackBias | CounterAttack mode window after winning the ball |
| staminaConservation | slower jog/press sprints — fresher legs late on |
| markingAggression | tighter marking distance, higher tackle success |
| keeperAggression | keeper plays further off the line, longer reach |
| tempo | faster ball circulation |
| formationDepth | block height (deep block ↔ high line) |
| supportDistance | how far support runs sit from the carrier |

`tests/genes.test.ts` asserts these effects statistically (e.g. a
passBias=0.95 team out-passes a dribbleBias=0.95 team across seeds).

## Squad DNA — per-player attribute genes

Alongside the team's tactical genome, each of the five players carries
attribute genes (0..1) that evolve with the franchise (`evolution/playerGenome.ts`):

| attribute | effect in the sim |
|---|---|
| pace | ±12% top speed, ±10% acceleration |
| technique | tighter pass accuracy; resists tackles (close control) |
| finishing | tighter shot grouping AND braver aim (closer to the post) |
| defending | higher tackle success |
| reflexes | keeper save odds ±11pp, longer dive reach |

Players are born role-biased (keepers high reflexes, wingers high pace,
strikers high finishing…), squads mutate with mid-table teams and cross over
position-by-position when a franchise is reborn. The selected-player card and
team cards show the bars; `tests/playerGenome.test.ts` verifies each attribute's
statistical effect.

Two sim-quality lessons are baked in as regression tests and comments:
- **Save difficulty is frozen at shot time** from how far the ball's path
  passes the keeper — evaluating it after the keeper dives toward the line
  had made accuracy worthless (wild shots evaded the save roll entirely).
- **Iteration order was a measured ~10pp conversion advantage** for the team
  processed second each frame (it reacts to fresher state). The step loop now
  alternates direction every tick to cancel it.

## 3D match viewer

A full Three.js viewer lives beside the 2D one — switch with the **2D/3D**
buttons in the left panel. Architecture rule: **the 2D sim stays authoritative;
3D is a pure consumer.**

```
src/render3d/
  RenderStateAdapter.ts  THE bridge: pure fns mapping sim -> render state
                         (sim x->x, sim y->z, height->y; velocity->yaw;
                          action->animation; kit->materials). No three import.
  ThreeMatchRenderer.ts  orchestrator: scene, models, picking, dispose()
  SceneFactory / PitchModel / GoalModel / BallModel   procedural low-poly world
  PlayerModel.ts         jointed footballer (torso/head/arms/legs/feet),
                         team kits, GK inverted kit, billboard labels
  AnimationSystem.ts     procedural anims: run cycle from speed, body lean,
                         one-shot kicks, GK ready/dive, goal celebrations
  CameraController.ts    tactical / broadcast / ball-follow / behind-goal /
                         free orbit — damped, pure goal math is unit-tested
  Overlays3D.ts          the same debug overlays as 2D (labels, formation
                         targets, pass/shot/marking lines, press rings)
src/replay/ReplayBuffer.ts  10 Hz RenderState snapshots of watched play;
                         binary-search + interpolation for smooth scrubbing
```

- The ball's vertical hop on kicks is synthesized in `BallModel` — visual only.
- **Readability aids** (Phase 10): pulsing team-colored possession ring under
  the carrier, an always-on-top marker when the ball hides inside a crowd,
  motion trails (hotter on shots), screen-space label decluttering
  (selected > carrier > GK priority, pure fn in `labelDeclutter.ts`), and an
  automatic inverted-kit swap when both teams' primaries are too similar.
- **Event feedback** (`FxSystem.ts`, deduped by event time so live play and
  replays each fire once): xG floaters on shots, particle bursts on
  saves/interceptions, goal banner + net shake (`Goal3D`), camera push-in on
  shots. Optional generated-tone sound FX (WebAudio, off by default).
- **Camera feel**: broadcast pans with velocity look-ahead and pushes in during
  final-third attacks; ball-follow is heavily damped (motion-sickness guard);
  behind-goal auto-frames the goalmouth.
- **Replay** (🎬, 3D): play/pause, 0.25×–2×, timeline scrub, jump-to-event
  chips with hover previews. Goal/save jumps engage slow motion and the
  best-fit camera automatically (`cameraForEvent`); effects re-arm so the
  banner/net shake replay too. The finished match is archived so you can
  rewatch it after the league moves on. Replays never touch sim state;
  headless sims aren't recorded.
- If WebGL init fails the app stays in 2D with a message; leagues and headless
  tools never depend on WebGL (enforced by an import-boundary test).
- Switching back to 2D disposes all GPU resources; 3D re-initializes lazily.

## Match analytics

The right panel shows live match stats (shots, on target, xG, possession,
pass %, recoveries, saves) and an **xG race chart** — cumulative expected goals
as two step lines with goal markers. Identity is never color-alone: team A is
solid, team B dashed, with direct short-name labels at the line ends (the 8-kit
palette can't be pairwise CVD-safe, so line style carries the difference).

## League & evolution

- **A 16-team pyramid: Premier Division + Challenger Division (8 each)** with
  promotion/relegation — each division plays a single round-robin per season
  (56 matches total), 3/1/0 points, one Elo ladder (K=28) across both tiers.
- End of season: Premier bottom-2 relegate, Challenger top-2 promote (by
  table — sporting merit). Evolution runs per division on the fitness axis:
  the Premier never kills a team (strugglers drop instead), while the
  Challenger's bottom three are reborn from **the Premier's elite parent
  pool** — new blood enters the pyramid at the bottom. Promoted teams and the
  champion are always protected from rebirth. Team identity (name, colors,
  genes, squad, lineage) always travels with the team across divisions.
- **Optional playoff mode** (league screen → Promotion rules): Premier 8th
  drops and Challenger 1st rises automatically, then Premier 7th hosts
  Challenger 2nd in a one-match decider for the last spot (a draw keeps the
  Premier side up — deterministic, no extra time). The decider is a
  standalone tie: no table/stats/Elo bookkeeping.
- **Fitness** (normalized within each division, weights sum to 1): points
  0.28, goal difference 0.15, shot quality (xG/shot) 0.12, pass completion
  0.12, recoveries 0.11, stamina efficiency 0.10, style consistency 0.12.
- Reborn teams get a new name but keep their league slot/kit, and the lineage
  records the parents (`g7 🔄 reborn ← A × B`); promotions and relegations are
  recorded too (`⬆️`/`⬇️` in the dynasty timeline).
- Team cards show identity tags derived from gene extremes ("Gegenpress",
  "Counter-attack", "Low block", "High risk / chaos"…), fitness, and lineage.

## Narrative & insight layer (league screen tabs)

- **Season report**: both champions, promoted/relegated (and the playoff
  scoreline when enabled), a mined **season story** (titles retained/taken,
  promoted overachievers, straight-bounce-backs, fallen champions, biggest
  points swing up/down — `sim/records.ts`, unit-tested), per-division points
  races, Premier awards — Golden Boot / Playmaker / Golden Glove from
  **per-player season stats** — plus Challenger top scorers. Champions
  history lists every season's winners (pre-pyramid seasons are labeled
  "single-division era").
- **Evolution**: sparkline tiles for all 14 tactical genes and 5 squad
  attributes — league mean per generation, so you can watch the meta drift —
  plus the last evolution's elite/mutated/reborn entries with fitness & drift.
- **Hall of fame**: Premier + Challenger title leaderboards, movement records
  (most promotions/relegations, longest Premier tenure, greatest comeback —
  relegated then later champions), single-season records (points, goal
  difference, peak Elo, most goals, most saves) and a dynasty timeline strip
  per league slot — cell shading shows the division each season, with
  🏆/🥇/⬆️/⬇️/👑/🧬/🔄 icons (hover for parents).
- Save format v3 (adds player aggregates; v1/v2 saves migrate in place).

### Balance (from `npm run calibrate`, 240 s matches)

~2.4–2.9 goals, ~12–15 shots, ~75% pass completion, balanced possession, 98%
ball-in-play, ~44 ms per headless match (a 10-season two-division fast-sim ≈
24 s, 112 matches per season). The per-match engine is unchanged from the
8-team era — averages shift a little with each seed population. The pyramid
produces real football stories: never-relegated aristocrats, yo-yo clubs with
5+ division moves, and a visible D1/D2 Elo gap (see `npm run evolve-check`).

## Verification tooling

- `npm test` — 41 tests: RNG/vec math, genome operators, match determinism
  (watched ≡ headless), league/Elo/evolution invariants, save/load roundtrips,
  and statistical gene/attribute effect tests.
- `npm run calibrate` / `npm run evolve-check` — headless balance & ecosystem probes.
- `npm run debug:visual` — Playwright drives the *real* game in headless
  Chromium: renders, fast-forwards, toggles overlays, selects a player via the
  `window.__evo` dev hook, opens the league screen, simulates a season from the
  UI, and screenshots every stage to `/tmp/evofootball-shots/` (12 checks).

## What's implemented vs. next steps

Implemented: autonomous 5v5 matches, three-layer utility AI, 14 live tactical
genes + 5 per-player attribute genes, an evolving 16-team two-division pyramid
with promotion/relegation and followable lineage, watch UI with 5 speeds +
headless fast-sim, live match stats +
xG race chart, debug overlays, a full 3D match viewer (procedural players with
distinct run/kick/dive/celebrate animations, 5 polished camera modes, 3D
overlays, possession/crowd readability aids, goal/save/shot event feedback,
replay with scrubbing/event jumps/auto-camera/slow-mo), a narrative layer
(season reports with awards + points race, gene-drift sparklines, hall of
fame), save/load (v4 — a v3 save's 8 teams become Division 1 with a fresh D2
spawned beneath; v1/v2 chain-migrate), 73 tests, and browser-driving visual
smoke tests for both views (26 + 20 checks).

Ideas for the next phase:
- Set pieces (corners/throw-ins) instead of futsal walls
- A cup competition (knockout) alongside the league pyramid
- Optional GLTF player models with the procedural mesh as fallback
- Optional learned policies (RL) benchmarked against the utility AI
- WebWorker simulation for even faster multi-season runs
