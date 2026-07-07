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

## Quickstart (play it)

**▶ Play in the browser right now** — no install, saves live in your browser:

- <https://quarkgluonmixture.github.io/evofootball-arena/> (GitHub Pages,
  auto-deployed from `main` by GitHub Actions)
- <https://quarkgluonmixture.itch.io/evofootball-arena> (itch.io)

To run it locally instead: [Node.js](https://nodejs.org) 18+ (20+
recommended) is the only prerequisite. No backend, no accounts, no network
calls: everything runs and saves locally in your browser.

```bash
git clone https://github.com/Quarkgluonmixture/evofootball-arena.git
cd evofootball-arena
npm install
npm run dev        # then open the printed URL (usually http://localhost:5173)
```

Press **1×** to watch the first match, or **Season** to fast-sim one. Your
league auto-saves in the browser (localStorage) after every season.

For a production build:

```bash
npm run build      # typecheck + bundle into dist/
npm run preview    # serve the built game locally
```

The build is fully static — host `dist/` anywhere (GitHub Pages, itch.io,
any file server); asset paths are relative (`base: './'`).
For itch.io specifically, `npm run package:itch` builds and zips an
upload-ready archive; settings live in [`docs/ITCH.md`](docs/ITCH.md).

## Development & validation

```bash
npm test           # vitest: determinism, league/cup/set-piece invariants, sim-worker equivalence
npm run typecheck  # tsc --noEmit
npm run calibrate  # headless: 2 seasons, prints per-match balance stats
npm run evolve-check      # headless: 10 seasons of evolution meta-diversity
npx tsx scripts/train-wildcard.ts   # retrain the Wildcard XI (co-training ES, ~70s; args: gens pop panel)

# Browser smoke suites (optional — needs Playwright's Chromium once):
npx playwright install chromium
npx vite --port 5199 --strictPort &   # the suites expect the dev server here
npm run debug:visual      # drives the real 2D game end to end (53 checks + screenshots)
npm run debug:visual3d    # 3D viewer: models, cameras, replay, cinematic, shootout theater (~32 checks)
```

### Troubleshooting

- **Blank/black 3D view**: your browser or VM lacks WebGL — the app says so in
  the feed and stays in 2D. Everything except the 3D viewer works without it.
- **Port already in use**: `npm run dev -- --port 5174` (any free port works;
  only the Playwright suites insist on 5199).
- **`npm install` fails on old Node**: check `node --version` ≥ 18.
- **Lost your league**: saves live in the browser's localStorage under
  `evofootball-arena-save-v1` — clearing site data deletes them; the Save
  button (top bar) writes the same slot on demand.
- **Slow fast-sim**: long runs execute on a Web Worker; if your browser lacks
  module workers the app falls back to a slower main-thread loop
  automatically (identical results).

## How to play (watch)

- **Speed controls** (left panel): pause / 1× / 2× / 8× / 32×, plus **⏭ skip**
  to finish the current match instantly (identical result — see Determinism).
- **Penalty shootouts play out kick by kick in 3D** (Phase 24): watch a drawn
  cup tie to full time in the 3D view and the shootout is staged live —
  walk-ups, dives, a running pens score bug, the deciding kick in slow
  motion and a broadcast-wide winner celebration, narrated kick-by-kick in
  the feed. ⏭ skips it; the result is identical either way (the same seeded
  shootout the league records — presentation only). In 2D the result is
  announced instantly, as before.
- **Simulate** buttons run a whole round / season / 10 seasons headless — on
  a **Web Worker** (Phase 16), so the UI stays at 60 fps during long runs;
  results are byte-identical to main-thread simulation (regression-tested)
  and it falls back to the old chunked loop where workers are unavailable.
- **League table** (top bar) opens standings, team cards with genes + lineage,
  and the season/evolution history.
- Click any player on the pitch to see their current action **and the utility
  scores behind it** in the right panel.
- Debug overlays (left panel): action labels, formation targets, pass lines,
  shot vectors, marking lines, press assignments, ball heatmap.
- The league **auto-saves after every season** (localStorage); Save/Load/Reset
  in the top bar. `New league` accepts a numeric or text seed.
- **Export/Import** (top bar) move a league between machines as a `.json`
  file — Import only swaps the running league (your stored save is untouched
  until you press Save), and any save version since v1 imports cleanly.
- **Presentation** (left panel): 🎥 cinematic mode (hides all chrome — Esc/✕
  exits), 📸 screenshot of the current view, 📋 copy a share summary (score,
  scorers, xG, league/cup context, seed), and an FX quality setting
  (Low/Med/High). Style rules live in `docs/ART_DIRECTION.md`.

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
    cup.ts              Evo Cup: seeded knockout bracket, penalty shootouts, records
    records.ts          pure record mining (titles, streaks, cup honours…)
    simRunner.ts        headless fast-sim loop (pure; worker + tests share it)
  ai/
    TeamBrain.ts        tactical mode + press/marking assignments (coordination)
    PlayerBrain.ts      utility scoring for player actions (the "why")
    actionExecutor.ts   turns chosen actions into desired velocities each frame
    steering.ts         seek / arrive / separation / avoidance
    formations.ts       gene- and mode-adjusted formation & support spots
    perception.ts       normalized queries: pressure, lanes, openness, intercepts
    policy.ts           wildcard search space: weight bounds + candidate ES ops
    wildcard.ts         Wildcard XI identity (learned genes+brains, neutral squad)
    wildcardPolicy.ts   GENERATED by scripts/train-wildcard.ts
  evolution/
    genome.ts           TacticalGenome (14 genes), mutate/crossover, identity tags
    franchise.ts        league slots with lineage across generations
    fitness.ts          multi-factor fitness (see below)
    evolve.ts           elite / mutate / reborn selection
    names.ts            seeded team & player names, kit palettes
  render/               PixiJS v8 — pitch, players, ball trail, goal FX, overlays
  ui/                   plain-DOM panels: scoreboard, genes, event feed, league screen
  data/save.ts          localStorage persistence + .json file export/import
tests/                  vitest suites (161 tests)
scripts/                headless calibration, evolution & wildcard-training tools
```

**Dependency rule:** `sim/`, `ai/`, `evolution/` never import from `render/` or
`ui/`, so the whole game logic runs headless (tests, calibration, fast-sim).

## The simulation

- **Fixed timestep** (1/60 s). The watched match and the headless match run the
  exact same `Match.step()` — speed is just steps-per-frame.
- **Determinism:** all randomness flows through a seeded RNG (`mulberry32`);
  every match seed is `hash(leagueSeed, generation, round, division*4+index)`.
  Same seed ⇒ identical match, watched or skipped. Saves store no RNG state.
- **Pitch:** 90×58 m with real boundaries. Goals are real: 7 m mouths.
- **Set pieces (Phase 14):** a ball over the touchline is a **kick-in**
  (futsal rules — kicked, not thrown) against the side that touched it last;
  over the goal line it's a **corner** (defending touch — keeper parries are
  deflections now, so shots pushed wide go behind) or a **goal kick** (keeper
  restarts). Restarts are live dead-ball phases: the clock runs, the taker
  walks over, opponents are held 6 m off the ball while both teams reshape,
  and the first touch must be a kick. Everything is deterministic — no
  restart randomness beyond the usual seeded kick mechanics.
- **Fouls (Phase 20, advantage since 27.2):** a failed tackle is sometimes a
  **foul** (seeded roll; aggressive-marking sides give more away). Outside
  the box the referee plays **advantage** — the only foul this sim produces
  is a failed tackle, so the carrier kept the ball and a whistle would only
  punish the attackers: play continues, the foul is counted and can still
  draw a card. A foul inside the offender's own box is still a **PENALTY**:
  the fouled team's best finisher steps up against the keeper from the drawn
  spot (9.4 m), everyone else held 8 m clear, and the first touch is the
  shot. ~3.8 fouls and ~0.08 penalties per match at current tuning.
- **Cards (Phase 25):** a foul sometimes draws a **yellow** (~0.75 bookings
  per match; aggressive markers collect more), and a second yellow — or a rare
  straight red — is a **sending off**: the player is parked on the apron and
  the team plays **4v5** for the rest of the match (measurably costly).
  Cards feed the season's **Dirtiest team** award. Keepers are never carded
  (no bench — a red keeper would break the one-GK premise; box fouls already
  concede a penalty), and cards don't carry into cup shootouts.
- **Ball:** exponential friction, kick impulses, owner-glued dribbling,
  interceptable in flight; keepers can handle faster balls than outfielders.
- **Keepers use their hands (Phase 27.2):** a keeper who claims the ball in
  open play scoops it up and **holds it** for ~1 s — untackleable, ball
  carried at the chest (visible in 3D) — before distributing. Restart first
  touches (goal kicks) stay quick.
- **Players:** acceleration toward a desired velocity, role-based top speed,
  quadratic stamina drain above ~55% effort (tired players cap at 62% speed),
  pairwise separation so nobody stacks.
- **On-ball realism (Phase 27):** players have a **body facing** that turns
  at a capped rate (a 180° cut takes ~0.5 s, not one frame). Kicks played
  across or against the facing **spray more and arrive weaker** (technique
  tames it), and carriers prefer passes they're facing. A firm ball can get
  away on the **first touch** — ball speed, defender pressure and blind-side
  receptions against technique — so pressing produces real **forced errors**
  (~10 miscontrols/match, counted in the stats panel). Passes too fast to
  trap can still be **deflected** by a player who read the lane
  (defending-attr roll), and markers shadow **goal-side and ball-side** so
  anticipated passes get cut out. A dispossessed carrier — and a beaten
  lunger — is briefly **stunned**, with visible tackle-lunge and stumble
  animations in 2D and 3D. Finally a **territory clock** ends free sideways
  recycling: the longer a possession goes nowhere, the more the carrier's
  scoring tilts toward forward passes, through balls and carries (the debug
  panel shows the `stale` factor).
- **Match flow:** kickoff → two halves → goal pauses → full time, with a
  90-minute display clock mapped onto 240 sim-seconds.

## The AI (three layers)

1. **TeamBrain** picks one of six modes — `BuildUp, Attack, Defend, Press,
   CounterAttack, ResetShape` — from possession, ball position, time since
   turnover, and genes. It also hands out **assignments**: at most 1–3 players
   are allowed to chase/press (this is what prevents ball-swarming), remaining
   defenders get man-marking targets, and in possession 1–2 attackers are
   licensed as **runners** who sprint in behind the last defender (2 for
   counter-attacks and high-tempo sides) — the off-ball movement that makes
   direct play possible.
2. **PlayerBrain** scores candidate actions every 0.15 s (staggered):
   carriers weigh `Pass / ThroughBall / Shoot / Dribble / ClearBall` — a
   through ball is aimed into an assigned runner's path (scored by the lane
   to the projected point and how far beyond the line it lands, gated by
   riskTolerance and tempo, so direct football is a team style, not a global
   behavior); off-ball players weigh
   `ReceivePass / MakeRun / SupportBallCarrier / MoveToFormationSpot /
   ChaseBall / MarkOpponent / InterceptPass`; keepers have
   `GoalkeeperSave / Position`.
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
| riskTolerance | gates contested forward passes AND through balls; more clearing when low |
| counterAttackBias | CounterAttack mode window after winning the ball |
| staminaConservation | slower jog/press sprints — fresher legs late on |
| markingAggression | tighter marking distance, higher tackle success, more fouls and cards conceded |
| keeperAggression | keeper plays further off the line, longer reach |
| tempo | faster ball circulation; a second licensed runner + through-ball appetite |
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
strikers high finishing…). Since Phase 26 they are **people with careers**:
every player has an age and develops along an age curve — strong growth to
~23, a plateau through the twenties, decline from 30 (pace fades fastest,
technique holds longest) — then retires in their mid-thirties and is replaced
by a 17–19-year-old **newgen** with a fresh name. Career stats accumulate
season by season; retirements make the season report, and the best careers
enter the hall of fame's **All-time greats**. Squads no longer take random
mutation — development, retirement and rebirth (a reborn club fields a young
academy intake crossed over from its parents) are how squads change. The
selected-player card shows age alongside the attribute bars; team cards list
the squad with ages; `tests/playerGenome.test.ts` verifies each attribute's
statistical effect and `tests/careers.test.ts` the career arc (directional
development, retirement curve, 12-season stability of mean age/attributes).

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
  replays each fire once): xG floaters on shots and ⚑ corners, particle bursts
  on saves/interceptions (confetti on High FX), a broadcast goal-banner card +
  net shake (`Goal3D`), a persistent score bug (works in replays — snapshots
  carry score/minute), camera push-in on shots. Optional generated-tone sound
  FX (WebAudio, off by default).
- **Presentation polish (Phase 15)**: procedural low-poly players with back
  numbers, short sleeves, role-based builds and a gloved, broader keeper;
  diorama stadium (terraces, floodlights, adboards, corner arcs + penalty D,
  vignette); cinematic hide-UI mode with a REPLAY badge + event-context label.
  Art rules: `docs/ART_DIRECTION.md`; QA notes: `docs/VISUAL_QA.md`.
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
- **The Evo Cup** — a 16-team single-elimination knockout across both
  divisions, woven between league rounds (R16/QF/SF after league rounds
  2/4/6, the final after round 7 and before any playoff — interleaving keeps
  cup drama running through the season while the final still closes it).
  Seeded draw: every R16 tie pairs a Premier side with a Challenger side and
  the underdog hosts. **Drawn ties go to a deterministic penalty shootout**
  (Phase 22 — best finishers kick first vs the keeper's reflexes, best-of-5
  then sudden death, seeded so the same league replays the same shootout;
  the bracket shows the pens score, and watched ties stage it kick by kick
  in 3D — Phase 24). The classic **underdog rule** — lower
  division, else lower seed, advances, "the cup loves an upset" — is a
  league-screen setting and what pre-shootout saves keep. No extra time
  either way. Cup ties are standalone
  (no table/Elo/season-stat/fitness bookkeeping — cup glory never feeds
  evolution), so giant killings are pure story: ⚡ feed lines, upset-marked
  brackets, doubles, Challenger cup runs and revenge ties all get mined into
  the season report and hall of fame.
- **Fitness** (normalized within each division, weights sum to 1): points
  0.28, goal difference 0.15, shot quality (xG/shot) 0.12, pass completion
  0.12, recoveries 0.11, stamina efficiency 0.10, style consistency 0.12.
- Reborn teams get a new name but keep their league slot/kit, and the lineage
  records the parents (`g7 🔄 reborn ← A × B`); promotions and relegations are
  recorded too (`⬆️`/`⬇️` in the dynasty timeline).
- **Careers drive squad change** (Phase 26): at season end every player ages,
  develops along the age curve and may retire into a newgen; reborn clubs
  field a young academy intake crossed over from their parents.
- Team cards show identity tags derived from gene extremes ("Gegenpress",
  "Counter-attack", "Low block", "High risk / chaos"…), fitness, and lineage.

## The Wildcard XI — a learned benchmark (Phases 18 + 23)

The league's teams all share one hand-tuned utility brain; genes only reweight
it. The **Wildcard XI** flips the experiment: its **tactical genes and brain
weights are learned together** by a (μ+λ) evolution strategy
(`scripts/train-wildcard.ts`, fully seeded/deterministic), evaluated by real
matches against panels from three independently evolved leagues (rotated per
generation to resist overfitting). Phase 18 searched one shared 28-weight
`PolicyParams` vector with genes pinned neutral; Phase 23 co-trains the 14
genes **plus five per-role weight vectors** ([GK, DF, MF, WG, ST] via
`TeamInfo.rolePolicies`) — a 154-dimensional space, warm-started from the
previous champion so successive runs keep climbing. Squad DNA stays pinned
neutral on purpose: maxed physique would win trivially and say nothing about
the brain. `DEFAULT_POLICY` holds the exact original constants and missing
role vectors fall back to it, so every normal team is bit-identical to before
the refactor (regression-tested + fingerprint-checked).

Result (held-out benchmark vs an unseen league's top 8, home & away, on the
current engine): the co-trained candidate scores **32/48 points where the
Phase-18 shared-policy champion scores 25/48 and the default brain 6/48**.
The ES learned an identity you can read right off its gene bars — Gegenpress,
counter-attack, high risk, zero stamina conservation — with role
specialization on top (the striker's shoot weights and the midfielder's
through-ball/press weights sit near their bounds). Press **⚡ Wildcard
exhibition** (left panel) to field it against your current Premier leader — a
standalone friendly, no league bookkeeping.

## Narrative & insight layer (league screen tabs)

- **Cup**: the live bracket (15 ties across four rounds, seeds + division
  tags, winners highlighted, ⚡ giant killings and draw-rule notes), last
  season's completed bracket, and the roll of honour. The current round is
  also shown in the left panel ("⚡ Cup QF").
- **Season report**: both champions, promoted/relegated (and the playoff
  scoreline when enabled), the Evo Cup final + upsets + cup top scorer,
  the season's retirements (Phase 26), a
  mined **season story** (titles retained/taken, promoted overachievers,
  straight-bounce-backs, fallen champions, biggest points swing up/down —
  plus cup doubles, Challenger cup runs, giant slayings and revenge ties —
  `sim/records.ts`, unit-tested), per-division points races, Premier awards —
  Golden Boot / Playmaker / Golden Glove from **per-player season stats**,
  plus the Dirtiest team (most cards, Phase 25) —
  and Challenger top scorers. Champions history lists every season's winners
  (pre-pyramid seasons are labeled "single-division era", pre-cup seasons
  "pre-cup era").
- **Evolution**: sparkline tiles for all 14 tactical genes and 5 squad
  attributes — league mean per generation, so you can watch the meta drift —
  plus the last evolution's elite/mutated/reborn entries with fitness & drift.
- **Hall of fame**: All-time greats — the best retired careers, kept forever
  (Phase 26) — Premier + Challenger title leaderboards, Evo Cup honours
  (titles + final appearances, domestic doubles, most giant killings, deepest
  Challenger cup run, most cup goals in a season), movement records
  (most promotions/relegations, longest Premier tenure, greatest comeback —
  relegated then later champions), single-season records (points, goal
  difference, peak Elo, most goals, most saves) and a dynasty timeline strip
  per league slot — cell shading shows the division each season, with
  🏆/🥇/🏅/⬆️/⬇️/👑/🧬/🔄 icons (hover for parents).
- Save format v7 (v6 added cards, v7 careers; v1–v6 saves chain-migrate in
  place — an old save finishes its current season cup-less and joins the cup
  next season, card tallies start at zero, and squads get seeded ages with
  blank career ledgers; history stays honest, nothing is fabricated).

### Balance (from `npm run calibrate`, 240 s matches)

~4.0 goals from ~14 shots (≈9.5 on target — futsal-flavored scorelines;
keepers are genuinely busy at **≈5.5 saves/match**), ~74% pass completion
with **~14.5 through balls per match** and **~55% of passes played forward**
(Phase 27 — the territory clock plus body-orientation costs ended free
sideways recycling), **≈8 first-touch miscontrols/match** (forced errors —
pressing pays), ~2.3 corners (≈11% lead to a shot inside 8 s), balanced
possession, ~93% ball-in-play (the rest is live dead-ball time: goal kicks,
corners, kick-ins, penalties; **≈3.8 fouls play advantage since 27.2,
≈0.08 becoming penalties** — Phase 20 — drawing **≈0.7 yellows and
≈0.05 reds** per match — Phase 25), ~26 ms per headless match
(allocation-free hot paths + a precomputed intercept table — Phase 16; a
10-season fast-sim runs off the main thread on the sim worker).
Phase 27 moved the numbers deliberately: goals ~3.3 → ~4.0 and completion
77% → 74%, because attacks are far more direct (shots per completed pass
roughly doubled) and errors are real; the keeper economy was re-tuned to
match (save base 0.75, reach 2.15 m, 80% catches under 21 m/s), and the
27.1 spacing pass (separated formation lanes, wider support radius, a
softer ball-side marking pull) unclogged the central corridor — fouls,
tackles and interceptions all dropped back as the crowd dissolved. The
pyramid produces real football stories: never-relegated aristocrats, yo-yo
clubs with 5+ division moves, cup giant-killers, and a visible D1/D2 Elo
gap (see `npm run evolve-check`).

## Verification tooling

- `npm test` — 161 tests: RNG/vec math, genome operators, career curves
  (directional development, retirement, long-run stability, v7 migration), match determinism, policy-default bit-equivalence
  (shared AND per-role vectors; watched ≡ headless), sim-worker equivalence (worker core ≡ direct sim,
  byte-identical saves), set-piece award rules/restart lifecycle/boundary
  invariants, foul/free-kick/penalty rules (award logic, taker choice,
  clearance, first-touch shot, directional foul-rate test), card rules
  (booking rates, second-yellow consistency, directional aggression and
  4v5-hurts tests, sent-off exclusion, v6 save migration), penalty-shootout
  rules (determinism, decisiveness, directional finishing/keeper tests,
  lineup order, league integration, save default, kick-recording equivalence
  + theater staging/skip/determinism — Phase 24), on-ball realism (turn-rate
  cap, orientation/first-touch helper monotonicity, directional
  technique-vs-miscontrol and forward-share/error-rate windows — Phase 27),
  league/Elo/evolution
  invariants, Evo Cup bracket shape/draw-rule/standalone-tie/determinism,
  save/load + file export/import roundtrips incl. the v1–v5 migration chain,
  and statistical gene/attribute effect tests.
- `npm run calibrate` / `npm run evolve-check` — headless balance & ecosystem probes.
- `npm run debug:visual` — Playwright drives the *real* game in headless
  Chromium: renders, fast-forwards, toggles overlays, selects a player via the
  `window.__evo` dev hook, opens the league screen and cup brackets, simulates
  seasons from the UI, exercises cinematic/screenshot/share/FX-quality
  controls, and screenshots every stage to `/tmp/evofootball-shots/`
  (53 checks). The 3D suite covers models, cameras, replay, score bug,
  cinematic mode and the shootout theater (~32 checks; a few are conditional
  on match events). `node scripts/probe-shootout.mjs` screenshots the
  theater's key beats for eyeballing.

## What's implemented vs. next steps

Implemented: autonomous 5v5 matches with real boundaries and set pieces
(kick-ins/corners/goal kicks as live dead-ball restarts), fouls with free
kicks and penalties (Phase 20), yellow/red cards with 4v5 play and a
dirtiest-team award (Phase 25), on-ball realism — body facing with a real
turn rate, orientation-dependent kicks, first-touch errors, pass-lane
deflections, tackle stuns with lunge/stumble animations and the
anti-recycling territory clock (Phase 27) — three-layer utility
AI, 14 live tactical
genes + 5 per-player attribute genes with full player careers — ages,
development curves, retirements, newgens and an all-time-greats ledger
(Phase 26) — an evolving 16-team two-division pyramid
with promotion/relegation and followable lineage, the Evo Cup (seeded
knockout between league rounds with giant-killing/upset/double/revenge
narratives, penalty shootouts for drawn ties — staged kick-by-kick in 3D
with a dedicated pens camera, slow-mo deciding kick and winner banner
(Phase 24) — bracket UI and cup honours),
watch UI with 5 speeds +
headless fast-sim, live match stats +
xG race chart, debug overlays, a full 3D match viewer (procedural players with
distinct run/kick/dive/celebrate animations, 5 polished camera modes, 3D
overlays, possession/crowd readability aids, goal/save/shot event feedback,
replay with scrubbing/event jumps/auto-camera/slow-mo), a unified art
direction with broadcast overlays, cinematic mode and screenshot/share tools
(Phase 15 — `docs/ART_DIRECTION.md`), a narrative layer
(season reports with awards + points race, gene-drift sparklines, hall of
fame), save/load (v5 — the cup arrives; v1–v4 chain-migrate), Web Worker
fast-sim with a byte-identical fallback plus an allocation-free hot-path pass
(Phase 16), the ES-trained Wildcard XI benchmark team — tactical genes
co-trained with five per-role brain vectors (Phases 18 + 23) — with in-game
exhibitions, a phone-friendly responsive layout (Phase 27), 161 tests, and
browser-driving visual smoke tests for both views (53 + ~34 checks).

Ideas for the next phase (rough priority order):
- Optional GLTF player models with the procedural mesh as fallback
- Headless perf: gate the decision-tick `why`-string building behind a flag
  (largest remaining cost in profiles; match results are unaffected, only
  the debug panel content — mind the watched≡skipped invariant when wiring)
