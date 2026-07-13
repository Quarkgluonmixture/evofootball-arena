# EvoFootball Arena

A top-down 2D **autonomous football ecosystem**. AI-controlled 6v6 teams play
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

The first match plays on load — or press **Season** to fast-sim one. Your
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
npm run calibrate  # headless balance stats (default 2 seasons; `-- 8` for a low-noise n=568)
npm run evolve-check      # headless: 10 seasons of evolution meta-diversity

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

- **Match control** (left panel): a big **⏸ pause / ▶ play** toggle plus
  **⏭ skip** to finish the current match instantly (identical result — see
  Determinism). The old 1×–32× preset row is gone (Phase 29.1): watching is
  real time, and anything faster is a skip or a headless simulate button.
- **The app boots in the 3D view** (Phase 27.5); switch to 2D anytime with
  the view buttons. Where WebGL is unavailable it falls back to 2D with a
  notice in the feed.
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
- **Language** (Phase 28.1): the UI ships in **Chinese by default** with an
  EN/中文 toggle in the top bar (persisted; switching reloads the page).
  Sim-generated text — the event feed, mined season stories, team and
  player names — stays English by design: those strings live in the
  simulation layer, which never touches the browser.

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
  evolution/
    genome.ts           TacticalGenome (14 genes), mutate/crossover, identity tags
    franchise.ts        league slots with lineage across generations
    fitness.ts          multi-factor fitness (see below)
    evolve.ts           elite / mutate / reborn selection
    names.ts            seeded team & player names, kit palettes
  render/               PixiJS v8 — pitch, players, ball trail, goal FX, overlays
  ui/                   plain-DOM panels: scoreboard, genes, event feed, league screen
  data/save.ts          localStorage persistence + .json file export/import
tests/                  vitest suites (202 tests)
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
- **Pitch:** 90×58 m with real boundaries. Goals are real: 7 m mouths.
- **Set pieces (Phase 14):** a ball over the touchline is a **kick-in**
  (futsal rules — kicked, not thrown) against the side that touched it last;
  over the goal line it's a **corner** (defending touch — keeper parries are
  deflections now, so shots pushed wide go behind) or a **goal kick** (keeper
  restarts). Restarts are live dead-ball phases: the clock runs, the taker
  walks over, opponents are held 6 m off the ball while both teams reshape,
  and the first touch must be a kick. Everything is deterministic — no
  restart randomness beyond the usual seeded kick mechanics.
- **Fouls (Phase 20, advantage since 27.2, professional fouls since 29.1):**
  a failed tackle is sometimes a **foul** (seeded roll; aggressive-marking
  sides give more away). Outside the box the referee plays **advantage** —
  the carrier kept the ball, so the whistle would only punish the attackers:
  play continues, the foul is counted and can still draw a card. The
  exception is the **professional foul** (Phase 29.1): a beaten defender
  chasing a breakaway — nobody but the keeper goal-side — hauls the carrier
  down from behind; the move dies, so play STOPS with a free kick, a
  near-automatic booking, and the occasional straight red for the last man.
  Pace still wins the race: a runner clear by more than arm's reach can't be
  caught. A foul inside the offender's own box is still a **PENALTY**:
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
- **The aerial game (Phase 28):** the ball has real **height** — lofted kicks
  fly friction-free parabolas (gravity, damped bounces) and a ball crossing
  the goal line above the **2.44 m crossbar** is out, not in. Nothing on the
  ground can touch a ball above chest height: **crosses** whipped in from
  wide (corners flood the box with the three best headers of the ball),
  **lofted switches** that beat the press over the top (the old 32 m pass
  suppression no longer applies in the air), **chipped through balls** over
  the line, and hoofed clearances that hang and come down as contests.
  Aerial duels are resolved by position + role aerial sense + `defending`
  (keepers claim over everyone, crowd pressure allowed for); the winner
  **heads it** — at goal in the opponent box (headed goals credit the
  crosser's assist), powerfully clear near their own, or cushioned down to a
  teammate. Strikers also play **back-to-goal hold-up**: shield, wait for
  support, lay off. Long-range shot appetite rises when a move goes stale —
  the 20 m dig is a real release valve now.
- **Offside (Phase 29):** the real law, judged the real way — status is
  **frozen the moment a teammate strikes the ball**: in the opponent half,
  ahead of the ball AND the second-last defender (counting the keeper) =
  offside position; the whistle only comes if the flagged **delivery target
  touches the ball** (reception or a won header — a defender playing it
  first means play on), and the defenders restart with a free kick from
  where the offender stood. Kick-ins, corners and goal kicks are exempt,
  exactly per the laws. Runners now **time their runs**: they hold at the
  second-last defender's shoulder while a teammate carries the ball and
  break the instant the pass is struck — through balls anticipate the burst
  instead of the standing position. Tight calls happen (~2 a match, in the
  stats panel) because players back their judgment on marginal positions;
  they refuse only the clearly offside ball. The structural payoff: no more
  striker camped on the keeper, defensive lines dare to push up, and the
  midfield compresses like real football.
- **Keepers use their hands (Phase 27.2):** a keeper who claims the ball in
  open play scoops it up and **holds it** for ~1 s — untackleable, ball
  carried at the chest (visible in 3D) — before distributing. Restart first
  touches (goal kicks) stay quick. Since Phase 28.3 the release is
  **deliberate**: an accurate hand throw to an open teammate, a pass or a
  targeted long switch — never the panic hoof (that was a 50/50 giveaway).
- **Keepers rush 1v1s (Phase 27.5):** an opponent carrier bearing down with
  nobody goal-side pulls the keeper **off the line** (keeperAggression sets
  how far — sweeping outside the box at the aggressive end). Reaching the
  ball triggers a **smother**: reflexes vs the carrier's close control —
  win and it's a claim into the hands, lose and the keeper is beaten on the
  floor (and occasionally concedes the penalty for a clumsy rush). Keepers
  also **backpedal facing the play** instead of turning their back, and
  every in-reach save attempt shows a full dive in both views (27.4).
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
  90-minute display clock mapped onto 240 sim-seconds. Both teams start
  kickoffs **entirely in their own half**, the kickoff first touch is always
  **played backward** to a teammate (27.3) — no driving forward off the
  spot — and **opponents are held out of the penalty box until a goal kick
  is taken**. Halves end in **stoppage time** (27.4): the whistle waits for
  a safe break — no shot or pass in flight, live final-third attacks play
  out, penalties are always taken — up to ~3 added display minutes.

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
| attackingWidth | in-possession formation stretch AND cross appetite (wide overloads) |
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

Alongside the team's tactical genome, each of the six players carries
attribute genes (0..1) that evolve with the franchise (`evolution/playerGenome.ts`):

| attribute | effect in the sim |
|---|---|
| pace | ±12% top speed, ±10% acceleration |
| technique | tighter pass accuracy; resists tackles (close control) |
| finishing | tighter shot grouping AND braver aim (closer to the post) |
| defending | higher tackle success; wins aerial duels (Phase 28) |
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

- The ball's real height (Phase 28) flows through `RenderState.ball.y`; the
  little visual hop `BallModel` synthesizes applies to hard ground kicks only.
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
- **Auto-highlights** (Phase 33, 3D watched matches): at half-time and full
  time the recorded goals + big saves play back-to-back — 3s lead-in, slow
  motion, the drama-appropriate camera, a `🎬 4' · 1/3` progress chip. ⏭
  skips; a presentation checkbox turns the reels off. The FT reel skips
  whatever the HT reel already showed.
- **Ratings & the tiki-taka line** (Phase 33): every player gets a live
  6.0–10.0 match rating (goals/assists/saves/recoveries vs miscontrols,
  plus the result) — on the player card, sealed at the whistle, `⭐ Man of
  the match` in the FT feed, season-averaged into a 🌟 MVP award. Chains of
  6+ completed passes earn one `🎼 N-pass move!` feed line (~2/match,
  measured) and feed the season's longest-chain record. Tap the scoreboard
  (or the 3D score bug) any time to pop the two teams' tactical-DNA clash.
- **The combination pack** (Phase 34, 套路包): three explicit patterns,
  each gene-gated so identities play differently — the **2过1 wall pass**
  (a pressured short passer bursts past his marker; the return into his
  stride is scored as the point of it — tempo+passBias sides), the
  **third-man bounce** (a fresh receiver releases the RUNNER, not the man
  who fed him — possession sides), and the **套边 overlap** (a trailing
  teammate rounds the outside of a confronted wide carrier — width
  sides). Completions counted in the match stats panel; slow/narrow
  genomes produce exactly zero, by design.
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
  the 🌟 Season MVP (best average match rating, Phase 33),
  plus the Dirtiest team (most cards, Phase 25) —
  and Challenger top scorers. Champions history lists every season's winners
  (pre-pyramid seasons are labeled "single-division era", pre-cup seasons
  "pre-cup era").
- **Evolution**: sparkline tiles for all 14 tactical genes and 5 squad
  attributes — league mean per generation, so you can watch the meta drift —
  plus the last evolution's elite/mutated/reborn entries with fitness & drift.
- **The rebirth ceremony** (Phase 32.5): season end is an EVENT — elites
  crowned, identity switches listed, and one card per dead club: who died,
  which two parents bred the successor, a parent-vs-child **gene radar**
  with the novel mutations highlighted (child genes outside both parents'
  range), and the inherited formation/scheme. Auto-shows at season end,
  reopenable from the Evolution tab. Team cards carry the same radar vs the
  league mean plus a 🌳 family tree, and every fixture opens with a
  **pre-match clash** — both teams' tactical DNA side by side (tap to
  dismiss).
- **Hall of fame**: All-time greats — the best retired careers, kept forever
  (Phase 26) — Premier + Challenger title leaderboards, Evo Cup honours
  (titles + final appearances, domestic doubles, most giant killings, deepest
  Challenger cup run, most cup goals in a season), movement records
  (most promotions/relegations, longest Premier tenure, greatest comeback —
  relegated then later champions), single-season records (points, goal
  difference, peak Elo, most goals, most saves) and a dynasty timeline strip
  per league slot — cell shading shows the division each season, with
  🏆/🥇/🏅/⬆️/⬇️/👑/🧬/🔄 icons (hover for parents).
- Save format v9 (v6 added cards, v7 careers, v9 ratings + pass-chain
  counters, v8 the second winger + the
  club's tactical identity; v1–v7 saves chain-migrate in place — an old
  save finishes its current season cup-less and joins the cup next season,
  card tallies start at zero, squads get seeded ages with blank career
  ledgers, and every club signs a seed-derived WG newgen at slot 4 with a
  genome-derived formation identity; history stays honest, nothing is
  fabricated).

### Balance (from `npm run calibrate -- 8`, 240 s matches, n=568)

~2.5 goals from ~10 shots (≈4.8 on target — Phase 31/32; keepers make
**≈2.4 saves/match** plus smothers at a dribbler's feet and high-ball
claims), plus the set-piece game: **~0.45 direct free kicks/match**
curled over a real 9.15m WALL (Phase 32 — the specialist steps up, the
wall holds its line through the strike, ~0.05 FK goals/match like the
real game),
~67% pass completion on CRISP passes (31.6 zip + the 31.7 cushioned
trap: tackles+interceptions ~45/match — the ping-pong era is over; long
deliveries complete to their intended man unless a defender genuinely
beats them to the drop, 32.1), **≈11 one-touch passes/match**
(31.9, 一脚出球 — pressured receivers play it as it comes, accuracy
priced by technique), and the BALL-PLAYING KEEPER (32.2 — the back-pass
law puts a teammate's ball at his FEET; high passBias+riskTolerance
sides escape the press through him, hoofers boot it) —
direct football: **~14 through balls per match**
with deliveries led deep into the run, **~64% of passes played forward**,
**≈1.6 crosses, ≈0.8 byline cutbacks, ≈5.5 aerial duels won and ≈5.4
lofted long balls per match**
(Phase 28; the driven 30.5 switch made the diagonal a real weapon;
31.9 rebuilt the corner delivery chain — the 9.15m law clearance, the
protected launch, zone-aimed routines and flight-tracking crashers took
corner→shot from ~8% to ~25%+ and headed goals ×3),
**≈1.7 offsides/match** (Phase 29 — tight calls on marginal
runs; the stats panel counts them), **≈11 first-touch miscontrols/match**
(forced errors — pressing pays), balanced possession, ~91% ball-in-play
(the rest is live dead-ball time: goal kicks — which now WAIT for the
team's shape — corners, kick-ins, free kicks, penalties; **≈6
fouls/match — most play advantage (27.2), with the professional foul that
stops the break (29.1) — drawing **≈1.3 yellows and ≈0.10 reds** per
match; referees manage the game, so a booked man gets benefit of the
doubt on ordinary fouls while the cynical one stays near-automatic),
~36 ms per headless match (allocation-free hot paths + a precomputed
intercept table — Phase 16; a 10-season fast-sim runs off the main thread
on the sim worker).
Phase 27 moved the numbers deliberately: goals ~3.3 → ~4.0 and completion
77% → 74%, because attacks are far more direct (shots per completed pass
roughly doubled) and errors are real; the keeper economy was re-tuned to
match (save base 0.75, reach 2.15 m, 80% catches under 21 m/s), and the
27.1 spacing pass (separated formation lanes, wider support radius, a
softer ball-side marking pull) unclogged the central corridor — fouls,
tackles and interceptions all dropped back as the crowd dissolved.
Phase 28 then opened the air: corners went from tame (5% led to a shot
while crosses dropped into an empty box) to genuinely dangerous (~10%) once
the corner licensed three box-crashers, and live-play complaints drove a
28.1 pass — a keeper now **smothers at the feet of anyone dribbling into
their face inside the box** (and can't be bulldozed backward: keepers hold
their ground against opponents in their own box), a keeper **holding the
ball gets a 3 m release bubble and nobody presses it** (29.1 — the single
outlet-shadow 28.1 kept read as a man camped in the keeper's face; robbing
distributions had been a goal factory; removing it cost ~0.3 goals/match,
deliberately traded for cleaner football and re-tuned via
tackle/save economy), kick-ins and corners **breathe** (1.8–2 s of setup
instead of instant releases), each half runs **its own stoppage time** with
a 45+2-style clock, and the loose-ball reaction radius was tightened so
scrambles pull in fewer spectators. Phase 29's offside moved the numbers
again, deliberately: goals ~3.2 → ~2.8 and completion 68% → 65%, because
the point-blank chances camped runners used to feast on are illegal now —
in exchange the defensive line steps up (DF base −26 → −20), through balls
anticipate timed runs (~18/match), penalties fell as the box decongested,
and the save/spread economy eased (saveP 0.63, spread 0.025) so the chances
that remain convert. The 29.1 live-play pass then made defending SMARTER on
user reports — containment jockeys, professional fouls, layered holds — and
goals settled at ~2.4. **Phase 30 (6v6 + formations) moved them again, and
honestly below target: ~1.4.** Every 30.x structure deleted a slice of the
chaos goals (scrambles, keeper gifts, unmarked leaks — 29.x goals ran +36%
over xG on exactly those; 30.x runs dead even), and set defensive shapes
suppress chance volume for EVERYONE (ARCHITECTURE failure mode 18 tells
the full detective story). Conversion was re-priced (saveP 0.48, tighter
spread, braver aim, deeper through-ball leads) to hold 1.4; restoring
chance volume against set defences — lane-aware shot selection, cutback
crosses, overloads, real corner routines — is Phase 31's build, and the
next rebalance takes play-feel, not the calibrate table, as its input.
**Phase 30.5 (the live-play texture pass) answered the first 6v6 play
report** ("perpetual midfield scramble, no visible shape, no wing play"):
off-ball support now fans across formation lanes instead of forming one
column ahead of the carrier (radius-bounded — ARCHITECTURE failure mode
19), the tightest marking stance moved outside tackle radius so a marked
reception isn't an automatic dispossession, loose balls are contested by
ONE player per team instead of a four-body scrum, through balls price the
wall of bodies honestly (chips are judged at the LANDING zone, not the
kicker's feet), and the lofted switch is a driven 1.4–1.6s ball a winger
can actually receive instead of a 2.15s floater the fullback always
headed away. Net: goals 1.4 → ~1.9 with on-target 3.5 → 4.2 — the first
volume recovery of the set-defence era — while completion held its ~63%
evolutionary equilibrium (failure mode 20: selection levers can't move
it; geometry can).
**Phase 31 (beating set defences) then finished the job: goals ~1.9 →
~2.6.** Lane-aware shot selection (carriers see the parked bodies and work
an angle; daring the wall anyway rolls a real BLOCK into a loose ball),
the OPEN RUN economy (a breakaway carrier drives at the keeper instead of
turning back — the reported 单刀回传/不突破 fixes — with a REST-DEFENCE
DF who never joins the siege so counters stay honest), the byline game
(wide carriers drive the touchline, 下底, and pull the ball back to a
licensed late runner at the arc), corner ROUTINES (near-post / far-post /
short / arc cutback, picked from zone openness; the kick WAITS for its
crashers and delivers to the RUN, not the goal-side marker — corner→shot
~2-4% → ~7-9%), pressing capped at two chasers (user report: 一到两人
chase, 其余盯人/站位), and formations became franchise DNA — inherited
from the dominant parent through rebirth, rarely mutated (🔧 lineage
events, an Evolution-tab share strip per identity) with a zonal ecology
budget: without it, rebirth inheritance compounded the lattice's
defensive edge into a 10-of-16 zonal league in ten seasons and scoring
sank exactly as failure mode 18 predicts.
The
pyramid produces real football stories: never-relegated aristocrats, yo-yo
clubs with 5+ division moves, cup giant-killers, and a visible D1/D2 Elo
gap (see `npm run evolve-check`).

## Verification tooling

- `npm test` — 202 tests: RNG/vec math, genome operators, career curves
  (directional development, retirement, long-run stability, v7+v8 migration), match determinism, policy-default bit-equivalence
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
  the aerial game (parabola/bounce physics, the crossbar, focused aerial
  duels, directional crossing/long-shot tests, corner-threat and
  headed-assist structure — Phase 28), offside (kick-time judgment
  geometry, the ball/own-half/level exceptions, restart exemptions, header
  whistles, defender-touch play-on, the executor onside hold, and a league
  liveness/rate window — Phase 29),
  league/Elo/evolution
  invariants, Evo Cup bracket shape/draw-rule/standalone-tie/determinism,
  save/load + file export/import roundtrips incl. the v1–v5 migration chain,
  and statistical gene/attribute effect tests.
- `npm run calibrate` / `npm run evolve-check` — headless balance & ecosystem probes.
- `npx tsx scripts/probe-aerial.ts` — per-mechanism aerial tallies (corner
  threat %, header outcomes, keeper claims, delivery volume) for tuning.
- `npx tsx scripts/probe-pass.ts` — buckets every pass by delivery kind ×
  distance × kick-time lane openness and prints completion per bucket:
  where the ~37 failed passes/match actually die (Phase 30.5's detective
  tool — see ARCHITECTURE failure mode 20 before "fixing" completion).
- `npx tsx scripts/probe-shorthand.ts` — the 5v6 sanity harness (mirrors
  cards.test.ts): playing a man short must genuinely hurt; run it on any
  off-ball behavior change (failure mode 19).
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

Implemented: autonomous 6v6 matches (Phase 30 — a second winger for real width) with real boundaries and set pieces
(kick-ins/corners/goal kicks as live dead-ball restarts), fouls with free
kicks and penalties (Phase 20), yellow/red cards with 4v5 play and a
dirtiest-team award (Phase 25), on-ball realism — body facing with a real
turn rate, orientation-dependent kicks, first-touch errors, pass-lane
deflections, tackle stuns with lunge/stumble animations and the
anti-recycling territory clock (Phase 27) — the aerial game: real ball
height with parabolic lofted kicks, bounces and a 2.44 m crossbar, crosses
+ headers with box-crashing corner runners, keeper claims and feet-smothers,
lofted switches/chips that beat the press, back-to-goal hold-up play and a
long-shot release valve (Phase 28) — offside judged at kick time with
timed runs held at the line, restart exemptions and free-kick awards
(Phase 29) — three-layer utility
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
fame), save/load (v8 — 6v6 splices in the second winger; v1–v7 chain-migrate), Web Worker
fast-sim with a byte-identical fallback plus an allocation-free hot-path pass
(Phase 16), a phone-friendly responsive layout (Phase 27), offside with
timed runs (Phase 29), 6v6 + per-club formations + set keeper distributions (Phase 30), 202 tests, and
browser-driving visual smoke tests for both views (53 + ~34 checks).

Next up: **Phase 31 — chance volume vs set defences + set-piece routines**
(lane-aware shot selection, cutback crosses, corner routines — promoted
from polish to fix after the formation era defused the one hardcoded
cross; ARCHITECTURE failure mode 18 has the analysis). The Phase 31–35
roadmap (formation evolution, real free kicks, highlights, player traits,
league ecology) lives in [`docs/ROADMAP.md`](docs/ROADMAP.md). Start
there — and Phase 30's first live-play reports decide the rebalance
before anything else.
