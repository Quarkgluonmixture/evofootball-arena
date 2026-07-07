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
explainable scoring, an **evolving 16-team two-division pyramid** (tactical genes + per-player
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

**Status (as of tag `phase-26`)**: phases 0–26 complete — deterministic 5v5
sim with real boundaries and set pieces (kick-ins/corners/goal kicks as live
dead-ball restarts); 14 tactical genes + 5-attr squad DNA; a 16-team
Premier/Challenger pyramid with promotion/relegation and an optional playoff
decider; the Evo Cup (a deterministic single-elimination knockout woven
between league rounds, with giant-killing/upset narratives); 2D (Pixi) + 3D
(Three.js) viewers with replay; a unified art direction ("retro tactical
broadcast + low-poly diorama", `docs/ART_DIRECTION.md`) with polished player
models/stadium/broadcast overlays, cinematic mode, screenshot/share tools and
an FX quality setting; season reports/awards/narratives, evolution sparklines,
hall of fame with dynasty timelines and cup honours; saves at v7
(chain-migrates v1–v6); fast-sim on a Web Worker with a bit-identical
main-thread fallback (phase 16); release polish — quickstart README,
responsive layout, PWA manifest/icon, MIT license (phase 17); the Wildcard XI
— PlayerBrain utility weights exposed as `PolicyParams` (defaults
bit-identical) with an ES trainer, held-out benchmark and in-game exhibition
(phase 18); off-ball runs + through balls — assigned runners sprint past the
last defender and carriers feed their PATH, gated by riskTolerance/tempo
(~14 through balls/match; phase 19); fouls + free kicks + penalties — a
failed tackle sometimes fouls (seeded roll, scaled by markingAggression),
awarding a free kick through the same restart machinery, or a penalty (best
finisher vs the keeper from the drawn spot) for fouls in the offender's own
box (~4.4 fouls, ~0.1 penalties/match; phase 20); save export/import as
.json files + itch.io packaging (phase 21); drawn cup ties decided by a
deterministic seeded penalty shootout with the classic underdog rule as a
league-screen option (phase 22); Wildcard co-training — per-role policy
vectors (`TeamInfo.rolePolicies`, resolved per player with a bit-identical
default fallback) and an ES that learns the 14 tactical genes together with
five role vectors, warm-started from the previous champion; held-out 32/48
pts vs shared-policy 25/48 vs default 6/48 (phase 23); the 3D shootout
theater — drawn cup ties watched in 3D stage their already-decided shootout
kick by kick (`resolveShootout` optionally records a kick script with zero
extra rng draws; `ShootoutTheater` synthesizes RenderStates; a dedicated
'penalty' camera + broadcast finale cut; applyResult deferred to theater
end, ⏭ skips; phase 24); yellow/red cards — fouls sometimes book
(`Match.maybeCard`, ~1.0🟨/0.09🟥 per match), a second yellow or straight
red sends the player off and the team plays 4v5 (`Player.sentOff`, skipped
by EVERY player loop — sim, brains, perception, steering, formations;
keepers are never carded: no bench, and box fouls already concede a
penalty), cards feed the Dirtiest-team award (phase 25); player careers —
every player has an age, develops along an age curve
(`evolution/careers.ts`: growth to ~23, decline from 30, pace fades
fastest), retires in the mid-thirties into a fresh newgen, and banks career
stats that feed a retirements section in the season report plus an
All-time-greats hall ledger (`League.legends`, top 20); random squad
mutation is GONE — careers and rebirth (young academy intake) are how
squads change; saves at v7 (phase 26); on-ball realism — capped-rate body
facing (`Player.heading`, TURN_RATE), orientation-dependent kick
noise/power + decision penalties, first-touch miscontrol
(`attemptFirstTouch` — forced errors under pressing), pass-lane deflection
of balls too fast to trap (`tryDeflection`), goal-side+ball-side lane
marking, tackle stun (victim 0.6s / whiff 0.35s) with lunge/stumble
animations in both renderers, the anti-recycling territory clock
(`Team.staleTime` → `stagnation` tilt in `decideCarrier`), a re-tuned
keeper/shot economy and a ≤640px phone layout, then the 27.1 follow-up from live play reports — restart takers face their kick (corners work again), separated formation lanes + wider support radius (the six-player ball-chase dissolved), un-stretched 3D on phones (inline canvas height vs CSS) and a goal that reads as a box net (per-panel net repeat/opacity, chunkier frame, lower gantry) — landing at ~4.0 goals, then 27.2: keeper HOLD (gkHoldTimer — claims are scooped up untackleable for ~1.1s, ball at the chest in 3D, restarts exempt) and the ADVANTAGE rule (outfield fouls never stop play — the only foul source is a failed tackle, so the whistle only hurt the attackers; fouls/cards still counted, box penalties kept) (phase 27).
168 vitest tests;
Playwright suites: 2D 53 checks, 3D ~34 checks; ~26 ms/headless match. Git
tags `phase-10`…`phase-27` are known-green checkpoints; source at
https://github.com/Quarkgluonmixture/evofootball-arena, PLAYABLE at
https://quarkgluonmixture.github.io/evofootball-arena/ (GitHub Pages,
auto-deployed by `.github/workflows/pages.yml` — npm ci + full tests +
build on every push to main; statistical tests carry explicit timeouts and
periodic event-loop yields for slow CI runners) and
https://quarkgluonmixture.itch.io/evofootball-arena (manual zip upload,
`docs/ITCH.md`). Open roadmap ideas live in the README's "next steps".

## 2. Module ownership

| Module | Owns | Must NOT do |
|---|---|---|
| `src/utils/` | seeded RNG (`mulberry32`), vec2 math, scalar helpers | import anything else in src |
| `src/sim/` | Match state machine (incl. set-piece restarts), ball/player physics, mechanics (kicks/tackles/saves/xG), League (two-division fixtures, tables, Elo, promotion/relegation, playoff, Evo Cup scheduling, season lifecycle), cup bracket + shootout logic (`cup.ts`, pure), record mining (`records.ts`, pure), stats/events | import render*, ui, pixi, three, browser APIs |
| `src/ai/` | TeamBrain (modes + press/mark assignments), PlayerBrain (utility scoring via `team.policy` weights), action execution/steering, formations, perception, wildcard policy space (`policy.ts` bounds/ES operators, `wildcard.ts` identity, `wildcardPolicy.ts` GENERATED by the trainer) | mutate anything except the deciding player's own action/targets (kicks go through `match.perform*`) |
| `src/evolution/` | TacticalGenome + squad DNA operators, fitness, selection (elite/mutate/reborn), names/kits, franchise lineage | know about matches at runtime (it consumes season aggregates only) |
| `src/replay/` | `ReplayBuffer`: 10 Hz RenderState snapshots, binary-search + interpolation | hold references into live sim objects (it stores adapter-produced plain data) |
| `src/render/` | PixiJS 2D view, DebugOverlay, shared `actionLabels`, px transform | write sim state |
| `src/render3d/` | Three.js viewer; `RenderStateAdapter` is the ONLY sim→3D bridge (pure, three-free) | be imported by sim/ai/evolution (enforced by test) |
| `src/ui/` | plain-DOM panels, league screen, replay bar, `GameActions` contract | talk to sim directly for mutations (everything goes through GameApp) |
| `src/data/` | localStorage save/load + version migration | — |
| `src/sim/simRunner.ts` | the headless fast-sim loop (pure; shared by worker + tests) | touch browser/worker APIs |
| `src/game/simWorker.ts` | Web Worker wrapper around simRunner (worker globals live HERE, not in sim/) | contain sim logic beyond dispatch |
| `src/game/GameApp.ts` | the loop, lifecycle, view/replay switching, sim-worker dispatch, dev hook `window.__evo` | contain game rules |
| `scripts/` | headless calibration/evolution probes, Playwright visual tests | be imported by src |

Circular-import rule: `Match` → `ai` at runtime; `ai` → sim **types/entities**
only via `import type` where the target is `Match` itself. Keep it that way.

## 3. Determinism — how it works and how it breaks

- Fixed timestep `DT = 1/60`. `Match.step(DT)` is the ONLY way time advances.
  Watching = N steps per render frame; skipping = `runToCompletion()` running
  the same loop. **Identical trajectories by construction** (regression-tested
  in `tests/match.test.ts`).
- Set-piece restarts (phase `'restart'`) are part of the same step loop: the
  ball is dead at the spot, the clock runs, the taker's brain chases the
  stationary ball, and opponents are positionally held out of a 6 m circle
  (penalties: 8 m, both teams except the taker and the defending keeper).
  No extra RNG, no teleports — a restart is just more deterministic stepping
  (award rules + lifecycle tested in `tests/setpieces.test.ts` +
  `tests/fouls.test.ts`).
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
match seed          : hashSeed(leagueSeed, generation, round, division*4 + index)
playoff decider     : same scheme with round = 7 (regular rounds are 0–6)
cup R16 draw shuffle: hashSeed(leagueSeed, generation, 0xC5)
cup tie match seed  : hashSeed(leagueSeed, generation, 0xC0 + cupRound, tieIndex)   (cupRound 0–3)
cup shootout        : hashSeed(leagueSeed, generation, 0xB0 + cupRound, tieIndex)   (drawn ties, mode 'shootout')
v3→v4 D2 spawn      : hashSeed(leagueSeed, generation, 0xD2)
evolution rng       : hashSeed(leagueSeed, generation, 0xE0)
careers/aging rng   : hashSeed(leagueSeed, generation, 0xA9)   (development, retirement, newgens)
v1→v2 squad backfill: hashSeed(leagueSeed, slot, 0xA7)
v6→v7 age backfill  : hashSeed(leagueSeed, 0xA9)
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
   ball-swarming), greedy goal-side **marks**, and in possession **runners**
   (1–2 attackers licensed to sprint past the last defender — 2 on counters
   / high tempo; capped so the shape never dissolves — Phase 19).
2. **PlayerBrain** (`PlayerBrain.ts`, every 0.15 s, staggered symmetrically):
   scores candidate actions as products of normalized perception factors
   (lane openness, receiver openness, space ahead, pressure, xG) × gene
   multipliers. The top candidates **with human-readable `why` strings** are
   stored on `player.action.scores` — the right-panel player card shows them.
   Kicks (`Pass/ThroughBall/Shoot/ClearBall`) execute immediately via
   `match.perform*`. Through balls aim into an assigned runner's PATH
   (projected point, lane + behind-the-line scoring) and are gated by
   riskTolerance/tempo — direct football is a style, not a global behavior.
3. **actionExecutor** (`actionExecutor.ts`, every frame): re-resolves dynamic
   targets (ball intercept points, sliding formation spots, marking positions)
   and blends steering (arrive + separation + avoidance) into `desiredVel`.

If you add an action or score, keep the `why` string honest — the
explainability of scores is a product feature, not decoration.

**Policy weights (Phases 18/23):** the scorers' hand-tuned constants live in
`PolicyParams` (`sim/types.ts`), read via `team.policies[player.index]` —
per-role vectors from `TeamInfo.rolePolicies` ([GK, DF, MF, WG, ST]), each
entry falling back to the shared `team.policy`, then `DEFAULT_POLICY`.
`DEFAULT_POLICY` must hold the exact original literals — a team with neither
field resolves every player to the same object and is bit-identical to the
pre-refactor brain (fingerprint discipline, invariant 2). The Wildcard XI
(Phase 23: 14 genes co-trained with five per-role vectors via
`scripts/train-wildcard.ts`; squad pinned neutral — physique is deliberately
outside the search space) exists ONLY for exhibitions and headless
benchmarks: it never enters a league, saves or evolution. The trainer
warm-starts from the previous champion in `wildcardPolicy.ts`, and its
held-out numbers are re-measured on the current engine each run — old
stamped scores go stale as the sim evolves.

## 5. Genes and squad DNA — where each one bites

**TacticalGenome** (14 genes, all 0..1, `evolution/genome.ts`) — every gene is
read by the AI or mechanics; the README table lists them. Representative
bindings: `passBias/shootBias/dribbleBias` multiply carrier utilities
(`PlayerBrain.decideCarrier`), `pressIntensity` sets chaser count + Press
threshold (`TeamBrain`), `defensiveCompactness/attackingWidth/formationDepth`
shape `formations.ts`, `markingAggression` sets tackle odds + mark distance
(`mechanics.tryTackles`, executor) AND card odds (`Match.maybeCard` —
aggression trades ball-winning against fouls, bookings and the occasional
red), `keeperAggression` sets GK line height and
reach, `staminaConservation` trades jog/press sprint speed for energy.

**Squad DNA** (5 attributes per player, `evolution/playerGenome.ts`):
`pace` → ±12% speed/±10% accel (`Player` ctor); `technique` → pass noise ↓,
tackle resistance, and since Phase 27 also first-touch security
(`touchFailChance`), orientation-penalty relief on kicks played across the
body (`orientationNoiseMul/PowerMul`) and dribble carry speed
(actionExecutor); `finishing` → shot spread ↓ AND braver aim margin
(`mechanics.performShot`); `defending` → tackle success + pass-lane
deflection odds (`mechanics.tryDeflection`, Phase 27); `reflexes` → save
probability ±11pp and dive reach (`mechanics.tryKeeperSave`, `keeperReach`).

**Directional tests exist for every gene/attribute channel**
(`tests/genes.test.ts`, `tests/playerGenome.test.ts`). A gene that is not
wired to behavior is a lie in the UI; a gene without a directional test is
unverified. Both are forbidden (see invariants).

## 6. Evolution

Two divisions of 8; per season (`League.finishSeason` → `evolution/evolve.ts`,
in this order — record → evolve → promote/relegate):

- **Fitness** (`fitness.ts`): min-max-normalized **within each division** —
  points .28, goal diff .15, shot quality (xG/shot) .12, pass completion .12,
  recoveries .11, stamina efficiency .10, style consistency .12.
- **Protections**: the D1 champion AND the promoted D2 pair are force-bumped
  into the elite band — sporting success must never get a team deleted.
- **Division 1** (`evolveGroup`, eliteN=2, rebornN=0): 2 elite, 6 mutated.
  Its strugglers are *relegated*, not killed — they fight back from D2.
- **Division 2** (eliteN=2, rebornN=3, parentPool = D1 ranked by fitness):
  promoted pair preserved, 3 mutated, bottom-3 **reborn** as crossover
  children of D1's elite pool — new blood always enters the pyramid at the
  bottom. New name, same slot/kit, lineage records the parents.
- **Promotion/relegation is by TABLE position** (points), a deliberately
  different axis from evolution (fitness): D1 bottom-2 ↔ D2 top-2. Lineage
  gets 'promoted'/'relegated' entries.
- **Optional playoff mode** (`league.promotionMode = 'playoff'`, UI toggle,
  persisted): 8th down + 1st up automatically; Premier 7th hosts Challenger
  2nd for the last spot; a DRAW keeps the Premier side up (deterministic, no
  extra time). The decider is a standalone tie — `applyResult` skips
  table/stats/Elo for `fixture.playoff` — and appears lazily via
  `ensurePlayoffFixture()` once the 56 regular fixtures are done.
- **Squad DNA changes through careers, not mutation** (Phase 26): after
  evolution, every non-reborn player ages a year, develops along the age
  curve (`evolution/careers.ts`), and may retire — replaced by a newgen with
  a fresh name, rookie age and blank ledger. Reborn squads cross over from
  their parents position-by-position but arrive as a young academy intake
  (17–24, blank careers). Career stats accumulate from `playerAgg` BEFORE
  evolution so a rebirth honestly erases its people. Retirees fill
  `SeasonRecord.retirements` and the best enter `League.legends`.

### The Evo Cup (Phase 13)

A 16-team single-elimination knockout each season (`sim/cup.ts` = pure
bracket logic; League owns the state and scheduling):

- **Draw at `startSeason`**: entrants seeded 1–16 (Premier 1–8 by Elo,
  Challenger 9–16 by Elo; higher number = underdog). Every R16 tie is Premier
  vs Challenger; Premier seeds are bracket-placed so 1 and 2 meet only in the
  final; Challenger opponents are hash-shuffled. The underdog hosts every tie.
- **Scheduling**: cup rounds unlock after 16/32/48/56 played league fixtures
  (i.e. after league rounds 2/4/6/7) and are spliced into `fixtures` at the
  cursor — R16 → QF → SF → Final, with the final before any promotion
  playoff. `ensureCupFixtures()` is idempotent and save-safe (bracket state
  persists; fixtures only mirror it).
- **Drawn ties** (Phase 22): decided by `league.cupDrawMode` — 'shootout'
  (new-league default) runs a deterministic seeded penalty shootout in
  `cup.resolveShootout` (kicker finishing vs keeper reflexes around a 74%
  baseline; best-of-5 with honest early stopping, then sudden death; a
  15-round failsafe falls back to the underdog rule), recorded on the tie as
  `shootout {scoreH, scoreA, sudden}`; 'underdog' (and pre-Phase-22 saves via
  the load default) keeps the classic rule: lower-division (else
  lower-seeded) advances (`byDrawRule`). No extra time either way — the
  match engine stays untouched.
- **Standalone ties**: `applyResult` resolves the bracket and cup-only scorer
  tallies, then returns — cup ties must NEVER touch the table, Elo, season
  aggregates, player season stats or fitness (same pattern as the playoff
  decider; regression-tested byte-for-byte in `tests/cup.test.ts`).
- **Records**: `SeasonRecord.cup` snapshots the bracket, winner/runner-up,
  giant killings (`upsets`) and cup top scorer; `records.ts` mines titles,
  final appearances, doubles, giant-killing counts, Challenger cup runs and
  revenge ties. Old saves have no `cup` field — render as "pre-cup era",
  never fabricate.

Season history (`SeasonRecord`) stores both division tables (with division +
Elo), fitness breakdowns, awards, promoted/relegated, the cup record,
gene/attr means, points timelines and the evolution report — the league
screen renders it all.

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
- **Shootout theater** (`render3d/ShootoutTheater.ts`, Phase 24): when a
  watched cup tie ends level in 'shootout' mode and the 3D view is active,
  GameApp recomputes the tie's shootout via `league.shootoutContext(fixture)`
  + `resolveShootout(…, kicks)` — the SAME pure seeded function applyResult
  uses, so the staged outcome always matches the recorded one (tested) —
  and defers `applyResult` until the theater ends. The theater is a pure
  RenderState synthesizer (no three.js, no sim access, wall-clock driven):
  walk-up/strike/dive/celebration per kick, slow-mo deciding kick, a
  `RenderState.shootout` pens score for the bug, save/goal fx, and a
  'penalty' camera (behind the taker) cutting to broadcast for the finale.
  ⏭ skips; 2D falls back to instant resolution. `__evo.debugShootout()`
  stages a synthetic one for the Playwright suite. Sim state is never
  touched — watched-vs-skipped equivalence is unaffected.
- **Dev hook**: `window.__evo` exposes player positions (2D px + 3D projected),
  `three()` debug info, `replayInfo()`, `viewMode()`, `theater()`,
  `debugShootout()` — used by Playwright and
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
- **Fast-sim runs on a Web Worker** (Phase 16): Round/Season/10-Seasons ship
  `league.toJSON()` to `game/simWorker.ts`, which runs `sim/simRunner.ts` —
  the exact loop vitest proves byte-identical to direct simulation — streams
  progress, and posts the finished league back; GameApp swaps its League and
  narrates the new SeasonRecords. A half-watched match is finished on the
  main thread first (replay archive + live feed parity). Falls back to the
  old chunked main-thread loop if workers are unavailable; the sim itself is
  worker-safe precisely because of invariant 1 (no browser APIs in sim/).
- 3D lifecycle: created lazily on first switch, fully `dispose()`d on switch
  back to 2D; WebGL init failure logs to the feed and stays in 2D.

## 9. Playwright visual debugging

Real-browser validation (headless Chromium, `--enable-unsafe-swiftshader`):

- `npm run debug:visual` — 2D: renders, clock advances at 32×, stats/feed/xG
  chart populate, click-to-select via `__evo.playerPositions()`, league screen,
  cup tab (fresh + completed brackets, upset markers, roll of honour),
  UI-driven season sims, report/hall cup honours, zero console errors.
  Screenshots → `/tmp/evofootball-shots/`. Checks that span a season sim must
  be structural, not outcome-named (see failure mode 11).
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
11. **Polite mechanics produce zero set pieces.** With real boundaries wired
    up, corners and kick-ins simply never happened at first: the old parry
    pushed the ball *away from goal* (back into play, never behind), passes
    are aimed at feet, and narrow clears got captured mid-flight. Out-of-play
    events need mechanics that honestly send balls out — the parry is a
    deflection of the incoming shot (often behind for a corner), and panicked
    clears spray wide (±1.0 rad → kick-ins). If you add a defensive touch
    mechanic, check the restart-rate probe before shipping (≈2.4 goal kicks /
    1.3 corners / 0.5 kick-ins per match at phase-14 tuning).
12. **Cross-engine float drift (Node vs Chromium).** Determinism is exact
    *within* one JS engine, but different V8 builds (Node 26 vs current
    Chromium) round some transcendental paths differently, and one knife-edge
    event can flip a match result (measured: 1 of 71 seed-1337 matches,
    `hash(1337,1,3,4)`, 1–0 in Node vs 0–0 in Chromium — reproduced on
    phase-12.1 too, so it predates the cup). Consequences: never assert
    Node-derived *outcomes* (names, scores, story types) in Playwright
    browser checks — assert structure; and don't compare saves across
    runtimes. Within-engine reproducibility stays regression-tested.
13. **The behind-goal camera hides goal-line actors.** From `behindGoal`'s
    gantry (13 m behind the net, 7.5 m up) anything within ~1 m of the goal
    line renders THROUGH the semi-transparent net mesh against the dark
    apron — a diving keeper is effectively invisible. That is why the
    shootout theater got its own 'penalty' camera (low, behind the taker).
    If you stage new goal-line presentation, screenshot it before trusting
    any fixed camera (`scripts/probe-shootout.mjs` is the pattern).
    Corollary (27.1): a semi-transparent grid viewed at a GRAZING angle
    stacks many lines per pixel and glows, while the same grid face-on
    nearly vanishes — from the old 7.5 m gantry the net's roof outshone the
    box and the whole goal read as a flat grate. Per-panel opacity (roof
    dimmest) + a lower camera fixed it.
14. **The keeper's REACH is the binding constraint on goals — not the post,
    and not saveP.** Phase 27 tuning measured two traps. (a) Making shooters
    aim SAFER (aimMargin 1.3 → 1.45, further from the post) RAISED goals by
    ~0.9/match: fewer shots missed wide while the keeper still couldn't
    reach the corner, so on-target share (and conversion) jumped. (b) Buffing
    saveP gets partially eaten by parry rebounds — saves recycle into
    second shots (goals barely moved while saves +0.9). Volume levers (pass
    reliability, entries per possession, shot-distance gates) move the goal
    rate far more reliably than conversion levers. Corollary: pass-selection
    changes dwarf execution-noise changes — completion stayed pinned at
    64–68% through large noise trims because WHICH passes get attempted
    (risk selection) dominates how accurately they're struck.

## 11. Known tuning levers

| Goal | Lever |
|---|---|
| Goals per match (~4.2 target since Phase 27's direct-play economy) | `mechanics.tryKeeperSave` saveP base (0.75 − xG·0.6) + catch odds (0.8 under 21 m/s); `keeperReach` base 2.15; shot `spread` (base 0.032); xG curve `exp(-d/10)`; shoot gate `dGoal < 30` — see failure mode 14 before touching these |
| Forced-error rate (~10 miscontrols/match) | `touchFailChance` coefficients in `mechanics.attemptFirstTouch` (speed/pressure/blind-side vs technique) |
| Forward urgency / anti-recycling | territory clock in `Match.step` (progress +1.5m resets, 0.35 m/s mark decay) + `stagnation = (staleTime−3)/5` tilt multipliers in `decideCarrier` |
| Body-orientation feel | `TURN_RATE` (6.5 rad/s) in `Player.ts`; `orientationNoiseMul/PowerMul` slopes; decision-side misalign penalties (pass 0.12, shot 0.3) in `decideCarrier` |
| Lane anticipation | `DEFLECT_MAX_SPEED` (24) + odds in `mechanics.tryDeflection`; ball-side blend `laneW = 0.35 + aggression·0.3` in executor MarkOpponent |
| Tackle economy | tackle base 0.23 in `tryTackles`; victim stun 0.6s / whiff stun 0.35s (stunned players can't capture or tackle) |
| Set-piece frequency | parry deflection angle/damping in `tryKeeperSave` (corners); clear lateral spread in `performClear` (kick-ins) |
| Foul / penalty rate | `foulP = 0.06 + markingAggression·0.1` per failed tackle in `mechanics.tryTackles`; penalty share follows box tackle volume |
| Card rate | `yellowP = 0.16 + markingAggression·0.12` per foul + straight-red 0.012 in `Match.maybeCard` (~0.7🟨/0.05🟥 per match since the 27.1 spacing pass cut tackle volume; calibrate prints both) |
| Direct play (through balls ~16/match) | `throughBase/OpenW/BehindW` policy defaults; riskTolerance/tempo gates in `decideCarrier`; runner count in `assignRunners`; run depth clamp in `runTarget` |
| Restart pace / dead-ball share | `RESTART_MIN_SETUP` (1 s), `RESTART_CLEARANCE` (6 m), `RESTART_TIMEOUT` failsafe (6 s) |
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
2. **Headless season simulation stays fast.** Budget: ≲50 ms per 240 s match
   (~25 ms after the flatten pass that followed Phase 19; `npm run calibrate`
   prints ms/match). No per-step allocation explosions, no O(n²) blowups
   beyond the existing 10-player pair loops. Hot-path optimizations must be
   **bit-identical**: same seed ⇒ same save JSON before and after — run
   `npm run fingerprint` (and `npm run fingerprint -- 42 3` for a second
   seed) before and after and compare hashes; never reorder float arithmetic
   for speed.
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
