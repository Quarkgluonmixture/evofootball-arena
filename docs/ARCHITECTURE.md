# EvoFootball Arena — Architecture & Invariants

**Audience: future coding agents (and humans) modifying this project.**
Read this before touching code. It states how the system is built, why it is
built that way, the traps previous work already fell into, and the invariants
you are not allowed to break. When this document and the code disagree, the
code is the truth — then fix this document in the same change.

---

## 1. System overview

EvoFootball Arena is an autonomous football ecosystem: a **deterministic 2D
6v6 simulation** (the single source of truth), a **utility AI** with
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
keeper/shot economy and a ≤640px phone layout, then the 27.1 follow-up from live play reports — restart takers face their kick (corners work again), separated formation lanes + wider support radius (the six-player ball-chase dissolved), un-stretched 3D on phones (inline canvas height vs CSS) and a goal that reads as a box net (per-panel net repeat/opacity, chunkier frame, lower gantry) — landing at ~4.0 goals, then 27.2: keeper HOLD (gkHoldTimer — claims are scooped up untackleable for ~1.1s, ball at the chest in 3D, restarts exempt) and the ADVANTAGE rule (outfield fouls never stop play — the only foul source is a failed tackle, so the whistle only hurt the attackers; fouls/cards still counted, box penalties kept) (phase 27); the aerial game — the ball has real height (`Ball.z/vz`,
friction-free parabolic flight, damped bounces, `GOAL_HEIGHT` crossbar:
over the bar is out, not in), lofted deliveries all solve landing from
flight time (`mechanics.loftKick` — crosses `performCross`, switches
`performLoftedPass`, chipped through balls `performThroughBall(lofted)`,
hoofed clears), balls above `CONTROL_MAX_HEIGHT` can only be met by heads
or the keeper's hands (`tryAerial`: GK claim first, then a header contest
scored by position + `aerialSense` (role + defending) + a seeded jump roll;
winner heads at goal / clears / cushions down; headed goals credit the
crosser's assist), corners license the three best headers of the ball as
box-crashers during the dead-ball setup (runners with no carrier — the fix
that took corner→shot from 5% to ~15%), strikers hold up back-to-goal
(`HoldUp` + lay-off boost), a stale-move long-shot bonus (`longShotW`),
five new `PolicyParams` keys (stored wildcard vectors backfill from
`DEFAULT_POLICY` — `StoredWildcardCandidate`), and two live-play fixes:
keepers smother at the feet of a carrier in their box without needing a
rush, and hold their ground (overlap-immovable) against opponents in their
own box (phase 28); then the 28.1 live-play pass — a keeper HOLDING the
ball gets a `GK_HOLD_CLEARANCE` (3 m) release bubble with at most ONE
opponent chaser shadowing the outlet (the old release-robbery was a goal
factory; removing it cost ~0.3 goals/match, deliberately accepted and
re-tuned via tackle 0.21 / deflection 0.24 / saveP 0.72 / spread 0.029 /
aimMargin 1.42 / keeperReach 2.05), kick-ins/corners get 1.8 s/2.0 s setup
time, each half runs its OWN nominal length + stoppage (`secondHalfStart`;
the clock shows `45+2` via `Match.clockText()` — first-half stoppage no
longer eats the second half or leaks into its clock), corner crosses pull
0.18 toward goal (0.25 dropped them on the keeper) with a 0.12
attacker-momentum bonus in the duel, and the UI is localized — Chinese by
default, EN/中文 top-bar toggle, `src/ui/i18n.ts` `t()` keyed by English
source strings with English fallback; sim-generated text stays English
(sim/ never touches the browser); the Playwright suites pin `lang=en` via
addInitScript because their selectors are English (phase 28.1); then 28.2
from live play reports — interception feed lines REMOVED (~25/match drowned
the feed; failure mode 7 — stats panel keeps the count), the keeper smother
works ANYWHERE (feet challenge, no box gate) with its re-challenge spaced by
`tackleCooldown` NOT `kickCooldown` (kickCooldown also gates ball pickup in
tryCapture — a beaten keeper could not scoop the loose ball at his own
feet; same fix on aerial-claim attempts), smother pWin base 0.56, receivers
in shooting range (attacking third, <20m from goal) decide in 0.08s instead
of the 0.3s settle — the FIRST-TIME FINISH exists, long-shot dig softened
to `longShotW` 0.38 with pressure term (1 − 0.7·p), conversion re-tuned
(aimMargin 1.5, saveP 0.70 → ~3.5 goals), the 4v5 cost channel measured
after the economy changes is SHOT CREATION (−16% own shots; GD margins are
now noisier than the effect — the cards test asserts shots, §10.5), and
DEFAULT_SEED = 1168 so a fresh league opens on a 3–3 19-shot banger
(phase 28.2); and 28.3 — restart/hold clearance pushes also damp the
pushed player's velocity ×0.2 (velocity-driven run animation played
treadmill legs at the circle's edge), dead-ball chasers cap at ONE (the
2–3-man pack stood pinned at the corner flag), wingers get a ×1.25 cross
bonus (crossBase 0.26 → ~3.8 crosses/match), the behind-goal terraces are
a single low bank (the 3-step stands reached x≈58/3.3m and swallowed the
behind-goal camera at ±57 — screenshot every fixed camera), and the league
screen on phones is a FIXED full-viewport overlay below the topbar
(`--topbar-h` CSS var set from GameApp; it was absolute inside #stage and
letterboxed to ~260px), and keeper DISTRIBUTION — `Player.gkDistributing`
set while holding, cleared on the kick: a keeper releasing from the hands
never picks the panic hoof (ClearBall suppressed) and gains an accurate
hand THROW (`performKeeperThrow`, `ThrowOut` action: flat 8–30m, noiseMul
0.45, finds the open body ~2.4×/match) (phase 28.3); and 28.4,
the width/1v1 pass from the user's own diagnosis (midfield turnover →
wingers tuck in → central pile-up): WIDE wingers refuse CENTRAL marks
(`assignMarks` lane gate — the flank holds its lane and the spine defends
the middle), breakaway carriers with nobody goal-side FINISH (×1.45 shoot
bonus <17m) and finish COMPOSED (`performShot` 1v1: aim 0.72×margin
tighter to the post, spread ×0.8 — without this the finish appetite just
fed the keeper from 15m), keepers stand ~2m off the line instead of
backpedalling into the net, and a won tackle knocks the ball 4.5–8.5 m/s
clear so scrambles disperse instead of re-feeding (phase 28.4); and
OFFSIDE (phase 29) — the structural cure for camped runners and the
chasing-pack breakaway loop: judgment is FROZEN AT KICK TIME
(`mechanics.registerPass`, the single funnel every targeted delivery
registers through — pass/through/cross/switch/keeper throw), the line is
the second-last defender COUNTING the keeper or the ball if deeper, floored
at halfway (`formations.offsideLineLocalX`; the GK-excluded
`defenderLineLocalX` still measures run depth), only the delivery target is
flagged (`PendingPass.offside` + `offsideSpot`; no passive-offside
modeling), the whistle blows when the flagged target TOUCHES the ball
(`Match.giveBall` head check + won header in `tryAerial` →
`Match.callOffside` → the existing freeKick restart at the frozen spot;
defenders playing it first = play on), kick-ins/corners/goal kicks are
exempt per the real law (an `offsideExempt` parameter threaded from the
restart taker's `decideCarrier` — penalties shoot, free kicks are NOT
exempt), off-ball attackers are HELD onside while a teammate carries the
ball (executor-level clamp at line −0.4 that releases the instant a kick
strips ownership — the timed run replaces camping, and stranded attackers
drift back by the same clamp), through balls MEET THE RUN, not the hover
(`formations.runBurstPoint`: a held runner shows ~zero velocity, so
velocity leads collapsed — the aim projects the burst along `runTarget` at
top speed; scoring AND `performThroughBall` both use it), carriers avoid
CLEARLY offside mates but gamble on tight ones (the +2.2m scoring margin
vs the referee's +0.2m — see failure mode 17: with perfect information
nobody ever passed to a flagged man and organic offsides measured ZERO),
and the back line steps up (DF base spot −26 → −20) because offside
finally makes a high line safe — the economy landed at ~2.8 goals, ~2.1
offsides, ~19 through balls/match with saveP 0.66 compensating for the
dead point-blank chances (phase 29); then 29.1, the same-day live-play
pass: NOBODY presses a keeper holding the ball (the 28.1 outlet-shadow
read as a man camped in the keeper's face), restart TAKERS are never
marked (a marker plus the chaser made two men stand uselessly at the
corner flag), the PROFESSIONAL foul (`tryTacticalFoul` →
`awardTacticalFoul`: a beaten defender within 1.7m BEHIND a breakaway
carrier in the 16–34m danger band hauls them down ~1/match — play stops
with a free kick + a booking more often than not, never in their own
box; the user-requested counterweight to offside-era breakaways; the
first cut fired on EVERY line break and hit 8 yellows/match — the
danger band + rare willingness + referee game management [booked men get
yellowP ×0.45 on ordinary fouls] brought cards back to 1.5🟨/0.11🟥),
goal-side defenders CONTAIN an arriving carrier
(< 8m, defensive 35m, no assignment, ONE container — the closest — and
the jockey stands off at 2.6m instead of tackle range; the mark used to
vanish the moment the tracked striker received the ball and the defender
jogged away to his formation spot; each of those three qualifiers was
paid for in calibrate cycles — unqualified contain strangled the game to
2.0 goals), the onside hold is LAYERED by role (ST −0.4
/ WG −0.8 / MF −1.8 — one shared depth parked every attacker plus their
markers on a single flat strip), won tackles knock the ball 5.5–10 m/s
clear, the keeper dive pose FREEZES its direction at dive start in both
renderers (per-frame recompute mirror-flipped the stretch as the ball
crossed — the save "twitch"; aerial-claim re-rolls spaced 0.9s), the
offside free kick is labeled 🚩 offside (`RestartState.offside`, display
only — every free kick had read as "fouls are back"), and the speed
preset row is GONE from the UI (⏸/▶ + ⏭ only; tooling drives speed via
`__evo.app.setSpeed`) (phase 29.1); and the Wildcard XI feature was REMOVED
(user: unused; `PolicyParams`/`DEFAULT_POLICY`/`TeamInfo.policy` plumbing
deliberately KEPT — it's the brain's tuning surface, tests ride on it, and
phase 42–44 put it back to work as the hook for the per-franchise EVOLVED
policy subset, see "Evolvable policy" below) (phase 29.2).
Phase 30 step 1: the sim is **6v6** — a SECOND WINGER at slot 4, slot order
`[GK, DF, MF, WGL, WGR, ST]` (`ROLES`/`TEAM_SIZE` in `sim/types.ts`; the
Role SET is unchanged, WG appears twice; gid = side·TEAM_SIZE+index). WGR
mirrors the shared WG base spot to the opposite touchline as a stopgap until
step 2's per-team formation tables. Saves at **v14** (chain-migrates v1–v13:
v9-v13 backfill the growing policy-gene set, v14 splits `technique` into
passing+dribbling and seeds strength/stamina at the neutral 0.4; the v8 step
splices a seed-derived WG newgen into every player-shaped array
at index 4, LENGTH-GUARDED because franchises minted by earlier migrations
already use today's 6-slot generators — and v6→v7 became squad-length-driven
for the same reason). Shootout lineups generalize (5 outfield kickers
best-of-5, the keeper kicks 6th in sudden death). First 6v6 calibrate
(pre-formations): 2.06 goals, 67% completion (up from 64), offsides 1.99,
tackles+interceptions 76.7 (up from ~66 — the anticipated "6th body worsens
crowding until formations spread lanes" regression; step 2's job, not a
tuning knob) (phase 30.1).
Phase 30 steps 2–4: the FORMATION SYSTEM — every club owns a TeamStyle
(attack `wide-212|narrow-122`, defend `low-32|press-23`, scheme
`man|zonal`) derived from its genes at creation/rebirth
(`deriveTeamStyle`, sim/types.ts), stored on the franchise, backfilled by
the v8 migration, shown on team card + right panel; `formationSpot` reads
per-slot tables (`ATTACK_FORMATIONS`/`DEFEND_FORMATIONS`); zonal marks
only in its zones + the box and is the RARE identity
(markingAggression < 0.3 — failure mode 18); the keeper WAITS FOR SHAPE
before goal kicks and hold-releases (`shapeReady`, gkShapeWait budget —
watched ≡ skipped, timeout failsafes) (phase 30.2–30.3). The 30.4
rebalance is failure mode 18's story: structure deleted the chaos goals;
conversion re-priced (saveP 0.48, spread 0.022, aimMargin 1.2, deeper
through-ball leads ×1.25/cap 24, shots no longer leg-deflectable — that
"lane anticipation" was always meant for passes); calibrate at n=568:
1.44 goals, 9.8 shots, 63% completion, ~21 through balls, 2.2 offsides,
t+i ~57 (from 76.7), 92% in-play. Scoring sits BELOW the 2.6 target —
structure done, chance volume vs set defences is Phase 31's build
(corner routines got PROMOTED there: the one hardcoded cross died to set
shapes, ~3% corner→shot).
202 vitest tests;
Playwright suites: 2D 53 checks, 3D ~34 checks; ~28 ms/headless match. Git
tags `phase-10`…`phase-29` are known-green checkpoints; source at
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
| `src/ai/` | TeamBrain (modes + press/mark assignments), PlayerBrain (utility scoring via `team.policy` weights), action execution/steering, formations, perception, game-state mentality (`mentality.ts`, Phase 35 — pure fn of score+clock+genes, served via the `Team.genome` getter; raw stays at `info.genome`), wildcard policy space (`policy.ts` bounds/ES operators, `wildcard.ts` identity, `wildcardPolicy.ts` GENERATED by the trainer) | mutate anything except the deciding player's own action/targets (kicks go through `match.perform*`) |
| `src/evolution/` | TacticalGenome + squad DNA (+ budget, `playerGenome.ts`) + evolvable policy genes (`policyGenome.ts`, Phase 42-45) operators, fitness, selection (elite/mutate/reborn), style space + data-driven nameplates (`styleSpace.ts`, Phase 49), names/kits, franchise lineage | know about matches at runtime (it consumes season aggregates only) |
| `src/replay/` | `ReplayBuffer`: 10 Hz RenderState snapshots, binary-search + interpolation | hold references into live sim objects (it stores adapter-produced plain data) |
| `src/render/` | PixiJS 2D view — the WebGL-init FALLBACK only since 34.1 (no panel toggle; tooling switches via `__evo.app.setViewMode`), DebugOverlay, shared `actionLabels`, px transform | write sim state |
| `src/render3d/` | Three.js viewer; `RenderStateAdapter` is the ONLY sim→3D bridge (pure, three-free) | be imported by sim/ai/evolution (enforced by test) |
| `src/ui/` | plain-DOM panels, league screen, replay bar, rebirth ceremony + pre-match clash (`RebirthCeremony`/`ClashBanner`, view-model `rebirth.ts` — pure + unit-tested), chart builders (`charts.ts` incl. the gene radar), `GameActions` contract | talk to sim directly for mutations (everything goes through GameApp) |
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
reach, `staminaConservation` trades jog/press sprint speed for energy,
`attackingWidth` also scales cross appetite (Phase 28 — wide overloads are
a style, not a global behavior).

**Squad DNA** (8 attributes per player since Phase 47 — `technique` split into `passing` (striking a ball at a target) + `dribbling` (the ball at the feet), plus `strength` (aerial + the shield term in `tryTackles`) and `stamina` (drain/recovery scaling in `Player.physicsStep`, both centred neutral at 0.4); `evolution/playerGenome.ts`). **The wage cap (Phase 48)**: `SQUAD_BUDGET = 24` (6 players × 8 attrs × 0.5) hard-caps every squad's attribute total via the pure proportional `enforceBudget` at founding, rebirth crossover and the season careers pass — attribute inflation is impossible, and raising one attribute costs another. **Newgens are bloodline** (`newgenFromBloodline`, σ0.12 mutation of the retiring slot's profile) — ROLE_BIAS survives only at founding:
`pace` → ±12% speed/±10% accel (`Player` ctor) + momentum-gated 1v1 tackle
resistance (Phase 41: `pace·clamp(len(vel)/9,0,1)·0.20` protects a carrier with
a running start — the space→width payoff, `mechanics.tryTackles`); `passing` →
pass/cross/through/loft/FK noise ↓ + orientation-penalty relief on balls
struck across the body (`orientationNoiseMul/PowerMul`); `dribbling` →
first-touch security (`touchFailChance`), one-touch penalty relief
(`oneTouchMul`), carry push control + speed (`performDribbleTouch`,
actionExecutor), tackle resistance (0.18, Phase 41), the 1v1 vs the keeper,
and shot strike/curl/power; `finishing` → shot spread ↓ AND braver aim margin
(slope 0.6 since Phase 47, `mechanics.performShot`); `defending` → tackle
success (0.34 since Phase 48) + pass-lane
deflection odds (`mechanics.tryDeflection`, Phase 27) + aerial-duel wins
(`aerialSense`, Phase 28); `strength` → the aerial-sense term + the standing
shield in `tryTackles` (−0.10); `stamina` → drain ×(1.24−sta·0.6) / recovery
×(0.88+sta·0.3) in `Player.physicsStep`; `reflexes` → save
probability ±11pp and dive reach (`mechanics.tryKeeperSave`, `keeperReach`).

**Evolvable policy** (Phase 42-44, `evolution/policyGenome.ts`) — the emergence
pivot's step 3: the biggest hand-set bias (the shared `DEFAULT_POLICY`) released
to selection so DECISION STYLE diverges. A per-franchise subset of `PolicyParams`
— attacking (shoot / dribble / fwd-vs-back-pass / through / cross / loft /
long-shot / run), defensive (chase / mark / intercept / clear / clearPressure),
build-up (passBase / passLane / passOpen / outlet / support), combo appetites
(wallPassW / thirdManW / overlapW, Phase 45 — the 套路 trigger gates scale by
them) — each bounded
[0.5×,1.7×] of its DEFAULT (floors keep competence), evolved in `evolve.ts`
(mutated + reborn tiers, elite keeps) and fed to the brain via `TeamInfo.policy`.
Every club is BORN at DEFAULT, so any style is EARNED by selection, UNBIASED
(no archetypes prescribed). Cross-franchise spread emerges to ~20% and persists
(`scripts/probes/policy-emergence.ts`); saves v9→v13 backfill the growing key
set. (The attribute expansion + resource budget shipped as phases 47-48; the
whole Stage-1/2 arc is ledgered in `docs/EVO-BLUEPRINT.md`.)

**Directional tests exist for every gene/attribute channel**
(`tests/genes.test.ts`, `tests/playerGenome.test.ts`). A gene that is not
wired to behavior is a lie in the UI; a gene without a directional test is
unverified. Both are forbidden (see invariants).

## 6. Evolution

Two divisions of 8; per season (`League.finishSeason` → `evolution/evolve.ts`,
in this order — record → evolve → promote/relegate):

- **Fitness** (`fitness.ts`, results-dominant since Phase 50): min-max-
  normalized **within each division** — points .50, goal diff .25, shot
  quality (xG/shot) .10, style consistency .15. The old uniform-virtue
  components (pass completion, recoveries, stamina efficiency) were DROPPED:
  they rewarded one texture for everyone (failure mode 22).
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
    Phase 31 corollary: this bites NODE-vs-NODE too (CI's V8 ≠ local's) —
    a 10-season league test asserting the final formation distribution
    passed locally and failed on CI (one flipped match ⇒ different
    champions ⇒ different rebirth parents ⇒ a formation extinct). Long-run
    ecology tests may assert only engine-stable properties: seeded
    CREATION arithmetic, bookkeeping invariants, and mechanism contracts
    (e.g. the zonal budget's ceiling) — never "who survived".
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
14. **Deliveries without arrivals are noise.** Phase 28's first cut whipped
    real crosses into an EMPTY box: corner→shot-inside-8s measured **5%**
    (worse than the tame ground corners it replaced). The delivery was never
    the bottleneck — the runners were: during a dead-ball setup there is no
    carrier, so the normal runner licensing (`carrier && carrier !== p`)
    silently disabled every attacking run. Licensing three box-crashers
    during the corner setup took it to ~15%. If you add a new delivery,
    check who is ATTACKING it before tuning the kick.
15. **Match-level stats can be too diluted to test an attribute.** The
    defending→aerial channel is decisive in a CONTESTED duel (~0.89 win
    rate at equal position over the jump roll), but headersWon per match is
    dominated by uncontested headers — whoever stands under the ball —
    and an 8-seed side-balanced pool flipped sign. The fix is a focused
    duel harness (two players, equal distance, 300 seeded rolls on
    `tryAerial` directly), not a bigger match pool (`tests/aerial.test.ts`).
16. **The keeper's REACH is the binding constraint on goals — not the post,
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
17. **A perfect-information sim never breaks a rule by accident — if a law
    needs a violation rate, model the imperfection explicitly.** Phase 29's
    first cut judged offside at kick time and penalized passing to flagged
    teammates — and organic offsides measured ZERO across 48 matches:
    decision and kick happen in the same tick with the same positions, so
    the AI simply never chose the illegal ball. Real offsides are timing
    errors at the MARGIN. The fix is an honesty gap: the referee judges at
    line +0.2m but carriers only avoid targets beyond +2.2m — the band
    between is where they back their judgment, and where every organic flag
    comes from (a runner who broke on the previous kick and hasn't checked
    back level yet). If a rule's violation rate is a product number, find
    where perfect information erases it before tuning anything else.
18. **Goals live in the VARIANCE of the gene mix, not in symmetric play —
    give every club a structural floor and the league stops scoring.**
    Phase 30's formation system dropped league goals 2.06 → ~1.1, and
    every classical lever (spot heights, marking ranges, pitch size, shot
    appetite) moved ±0.1 at best. The differential probe that cracked it:
    neutral-mirror matches score ~1.6 in BOTH eras — 29.x's 2.4+ came from
    MISMATCHES (a low-markingAggression club used to leak; the spot tables
    gave everyone a competent shape and nobody leaked). Corollaries paid
    for in probes: (a) in this engine LESS marking = STRONGER defence —
    markers get dragged out of shape, lattices don't (the zonal scheme
    conceded 3 shots/match vs man's 8 and had to become the RARE identity,
    markingAggression < 0.3); (b) n=142 calibrate noise on goals is
    ±0.3–0.4 in this regime, not ±0.15 — `npm run calibrate -- 8` (568
    matches) before believing any lever; and even at n=568 the
    cross-SEED spread is another ±0.4 (Phase 35 measured phase-34.3
    itself across 6 league seeds: 1.83–2.62, mean 2.34 — the "band" is
    a default-seed chain, seed 2024 ships at 1.83 on the same code).
    Judge behavioral levers on PAIRED seeds (same seed, both trees,
    mean of ≥3 pairs), never on one seed's absolute band position; (c) the 30.x structures deleted
    the goals-above-xG channel (breakaways, scrambles, gifted
    distributions): 29.2 goals ran +36% over xG, 30.x runs dead even, so
    conversion had to be re-priced (saveP 0.48, aimMargin 1.2) just to
    hold 1.4. Restoring chance VOLUME against set defences (lane-aware
    shots, cutbacks, overloads, corner routines) is Phase 31 work.
19. **Support that abandons pass range isn't support.** Phase 30.5's first
    fan cut anchored every supporter's y fully to their formation lane —
    conceptually "spread into a fan", actually "the winger parks 30m from
    the carrier". Short options vanished, neutral-genome attacks starved
    (mirror goals 1.47 → 0.93) and the 5v6 sanity invariant INVERTED (a
    man-short side out-scored its full-strength self — probe-shorthand.ts
    reproduces the cards.test harness for exactly this bisect). The shipped
    fan pulls y toward the lane but caps the lateral offset at ~0.9× the
    supportDistance radius: the gradient (mids near, wingers wide-but-
    reachable) is the whole value. Corollary: judge any off-ball change on
    the 5v6 probe AND neutral mirrors, not just the evolved-league
    calibrate — evolved genomes route around damage that flattens neutral
    ones (that's ALSO why calibrate goals can rise while a test population
    collapses).
20. **Pass completion is an evolutionary homeostat (~63%) — selection
    levers can't move it, and suppressing one risky channel just re-routes
    the doomed volume to the next.** Measured across six 30.5 configs
    (lane-decay discounts, blocked-lane gates, loft eligibility 18m):
    completion pinned at 61–63% every time while the failure mass migrated
    ground→through→loft→aerial (probe-pass.ts buckets every pass by
    kind × distance × kick-time lane and is how you see the migration).
    The league EVOLVES risk appetite until marginal completion balances —
    fighting the equilibrium wastes levers. What does work: change the
    GEOMETRY selection sees (bounded support fan opened real lanes; goals
    1.44 → 1.94 while completion never moved) or fix a channel's execution
    honesty (driven 1.4–1.6s switches instead of 2.15s floaters a winger —
    the game's WORST header (AERIAL_ROLE 0.06) — always lost at the drop).
    A directional test whose lever rides on scramble frequency (the
    shoot-happy policy test) needs a stronger pull to clear noise in a
    more organized league — the lever still works, the environment prices
    it higher.
21. **Inheritance channels compound selection — guard EVERY entry into a
    structurally-dominant identity, not just the mutation roll.** Phase
    31 made formations franchise DNA (reborn clubs inherit the dominant
    parent's style). The zonal mutation had its rare-entry guard (×0.3),
    but INHERITANCE had none: zonal out-defends man (failure mode 18a) →
    zonal clubs win → parent the reborn → zonal multiplied to 10 of 16
    clubs in ten seasons on seed 31313 and scoring sank. The fix is an
    ecology BUDGET (League-computed `room = max(0, 4 − zonal count)`,
    one shared counter across both division passes) consumed by both
    channels; exits refund it. Corollary: the corner-duel story — the
    goal-side marker + the 0.18 goal-pull meant attackers won 0.00
    corner duels; deliveries must target the RUN (pull 0.06), and a
    licensed crasher who cannot REACH the spot leaves the zone empty
    (aerial sense × reachability, and the kick WAITS for arrivals —
    failure mode 14's lesson applied to set pieces).
22. **Uniform-virtue rewards are convergence pressure; a budget exposes
    every mis-priced payoff.** Two halves, one lesson (Phases 48/50): (a)
    fitness components that reward the SAME texture for everyone (pass
    completion, recoveries, stamina efficiency) quietly push the whole
    league toward one meta — `recoveries` alone fed the press-inflation
    equilibrium (evo-drift press → 0.75-0.94). Selection should pay
    RESULTS + identity-consistency, never named virtues. (b) The moment
    the wage cap made attribute points scarce, evolution arbitraged the
    weakest payoff: whole leagues drained `defending` (0.63→0.52) to fund
    attack and goals ran to 3.1-3.4 — under a budget, every attribute's
    per-point payoff is implicitly PRICED against the others, so adding a
    constraint means auditing the payoff table (defending 0.24→0.34 fixed
    it). Watch evo-drift attribute means after ANY payoff change.
23. **"Deterministic zero" gate tests near gene boundaries are
    mentality-permeable.** Phase 35's mentality floats a trailing side's
    genes (width +0.15·u, tempo +0.1+0.2·passBias), so a combo/license
    gate that a RAW genome can't cross CAN cross late in a losing match —
    two Phase-45 test zeros broke this way on a re-roll. Pin boundary
    gates with genes that stay under the gate at MAX mentality boost, or
    assert at the unit level (a staged `updateTeamBrain` call, score
    level). Related trap: a single outlier's z-score over a flat
    population is CONSTANT in the deviation size (both σ and the
    deviation scale together), so z-RANKING tests need a population with
    real variance in the competing dims.
24. **`League.fromJSON` builds via `Object.create(League.prototype)` —
    class-field initializers NEVER run on a loaded league.** Any new
    League field must be EXPLICITLY assigned in fromJSON's
    `Object.assign` block (with a default), or every loaded/imported
    save silently reads `undefined`. Phase 53 paid: `sackingEnabled =
    true` existed only as a field initializer, so the sack/hire channel
    was ON for fresh leagues and silently OFF for every loaded one — the
    careers round-trip test caught it as a replay divergence (one arm
    sacked, the other couldn't). Symptom signature: fresh-vs-loaded
    behavioral divergence with identical serialized state. The
    round-trip-then-replay test pattern (save → load → play one more
    season → expect identical franchises) is the guard; keep it green.
25. **A fully-WIRED payoff surface can be silently dead — probe the
    binding, not the wiring.** `staminaConservation` had everything:
    jog/sprint discounts in the executor, a tired-legs brain gate, style
    dims, "Energy misers" nameplates. It was still a strictly-LOSING
    gene for 11 phases because the resource it traded against never
    depleted — recovery (0.014/s) dwarfed drain (0.006·e²/s), full-time
    stamina sat at 0.98-0.99, the tired gate (<0.4) was unreachable, so
    misers paid the slow-jog cost every match and never harvested the
    fresher-legs payoff. The N1 matrix meta (cost-free aggression) grew
    on exactly this dead ground. Lesson: any gene/attribute that trades
    a PRESENT cost for a CONDITIONAL payoff needs a probe showing the
    condition actually OCCURS at match scale (phase-58's diagnostic
    printed FT stamina by style; the stamina test now pins FT < 0.93 so
    the gauge can never go dead again). Grep candidates: every genome
    dim should appear in a probe's measured-effect output at least once.
26. **Per-world outcome metrics are ECOLOGY-dominated after a substrate
    change — don't chase them with global dials.** Phase-58's economy
    dropped calibrate goals on seed 424242 to 2.03 (under the 2.3
    floor) while the reference seed sat at 2.38. The counterfactual
    (recovery 0.009→0.010) moved the reference seed the WRONG way
    (2.38→2.23): any constant change re-rolls each world's evolved
    style mix, and THAT mix — not the dial — sets the world's goal
    rate. Verify the mechanism instead (FT stamina healthy ⇒ not
    sludge), read the band across seeds as a distribution, and let
    play-feel decide. Same genus as failure mode 20 (homeostat chasing)
    one level up: the homeostat here is the whole ecology.

27. **A swept constant re-runs the FULL gate suite — the pre-sweep run
    doesn't count.** Phase-60 swept `UNSET_BLOCK_WEIGHT` 0.3→0.55 late
    in the phase and only re-ran the targeted suites; the full vitest
    that backed "363 green" predated the sweep, and a blocks test
    pinning the floor-0.3 literal ("four retreaters ≈ 1.5") shipped
    LATENTLY RED on HEAD — found a phase later (61). Two rules: (a)
    every gate run reported in a ledger must be against the FINAL
    constants, re-run after any sweep, and (b) tests pin contracts
    RELATIVE to the constant (4×floor), never the magic number a
    particular sweep produced.

28. **Never run a git-stash A/B dance in the BACKGROUND while other
    measurements run in the foreground.** Phase-41.2's "paired Δ+0.09,
    tempered perfectly" calibrate line was a PHANTOM: a background
    baseline probe (`stash push actionExecutor+Player → evo-drift →
    stash pop`) held the fix files stashed for ~3 minutes while the
    foreground three-seed calibrate ran inside that window — the
    reported numbers measured baseline-steering + tempered-pricing, a
    state that never shipped. Found a phase later when HEAD calibrate
    would not reproduce (true 41.2: 2.76/2.29/3.59, ≈+0.6 hot — the
    correction shipped in 67). Rules: (a) a stash dance owns the whole
    working tree — run it strictly foreground, nothing else in flight;
    (b) any headline number in a ledger gets ONE reproduction run
    against clean HEAD before commit.

## 11. Known tuning levers

| Goal | Lever |
|---|---|
| Goals per match (~2.8 since Phase 29 — offside killed the point-blank camped chances; 28.1 had traded the keeper-robbery goals the same way) | `mechanics.tryKeeperSave` saveP base (0.66 − xG·0.6) + catch odds (0.8 under 21 m/s); `keeperReach` base 2.05; shot `spread` (base 0.029); `aimMargin` base 1.5; xG curve `exp(-d/10)`; shoot gate `dGoal < 30`; DF base spot height (−20, Phase 29 — the line lever moves goals ~0.1/m) — see failure mode 16 before touching these |
| Offside rate (~2.1/match) | carrier gamble margin (+2.2m) vs referee epsilon (+0.2m) in `decideCarrier`/`offsideAtKick` — the gap IS the rate (failure mode 17); executor hold offset (line −0.4); DF base spot height (higher line = more flags) |
| Timed-run conversion | `runBurstPoint` projection (top speed ×1.1 burst); through-ball pace (d·0.55+8.5, cap 21) in `performThroughBall`; `throughBehindW` 0.52 |
| Forced-error rate (~10 miscontrols/match) | `touchFailChance` coefficients in `mechanics.attemptFirstTouch` (speed/pressure/blind-side vs dribbling) |
| Reception / the cushioned trap (31.7-8) | intended-receiver control ceiling 24 m/s vs bystander `CONTROL_MAX_SPEED` 14 in `Match.tryCapture` (the pendingPass target may take down any DESIGNED delivery, priced by the touch roll); pass zip `d·0.6+8.2` cap 22 in `performPass` |
| Distribution calm (31.6-8) | marking stand-off `max(stance, 2.6 − aggr·0.6)` while the mark's keeper holds/stands over a goal kick (executor); held ball clears the BOX (stepBall, user-called law simplification); offside restarts as a goal kick (`callOffside`) |
| Narrow-derby chaos | narrow-122 half-space slots (±12/15) in `ATTACK_FORMATIONS` — with both wide slots ≤11 the mirror-fixture had NO relief valve (t+i 123, 0 goals); next dials = founding share threshold in `deriveTeamStyle`, more half-space |
| Forward urgency / anti-recycling | territory clock in `Match.step` (progress +1.5m resets, 0.35 m/s mark decay) + `stagnation = (staleTime−3)/5` tilt multipliers in `decideCarrier` |
| Body-orientation feel | `TURN_RATE` (6.5 rad/s) in `Player.ts`; `orientationNoiseMul/PowerMul` slopes; decision-side misalign penalties (pass 0.12, shot 0.3) in `decideCarrier` |
| Lane anticipation | `DEFLECT_MAX_SPEED` (24) + odds in `mechanics.tryDeflection`; ball-side blend `laneW = 0.35 + aggression·0.3` in executor MarkOpponent |
| Tackle economy | tackle base 0.21 in `tryTackles`; victim stun 0.6s / whiff stun 0.35s (stunned players can't capture or tackle) |
| GK release protection | `GK_HOLD_CLEARANCE` (3 m) bubble in `Match.stepBall`; ZERO chasers on a held ball in `assignChasers` (29.1) |
| Professional-foul rate (~1/match) | danger band 16–34m + sprint 4.5 + grab reach 1.7m behind-only, no own-box, `chance(0.06 + aggression·0.1)` (booked ×0.3) in `tryTacticalFoul`; card odds (yellow 0.52 / red 0.03) in `awardTacticalFoul`; referee game management: booked men get yellowP ×0.45 on ordinary fouls in `maybeCard` |
| Defensive shape vs crowding | contain gates in `decideOffBall` (carrier < 14m, < 35m from own goal, unassigned only); `HOLD_DEPTH` role layering in the executor onside clamp; won-tackle squirt 5.5–10 m/s; loose-ball chasers capped at 1/team (30.5, `assignChasers`); support fan pull 0.75 / cap 0.9·radius in `supportSpot` (30.5 — failure mode 19); marking stance `2.6 − aggr·1.4` (floor 1.2m, outside tackle radius — 30.5) |
| Restart pacing feel | per-kind min setup in `stepRestart` (kick-in 1.8 s, corner 2.0 s, else `RESTART_MIN_SETUP`) |
| Set-piece frequency | parry deflection angle/damping in `tryKeeperSave` (corners); clear lateral spread in `performClear` (kick-ins) |
| Corner / cross threat | box-crash count in `assignRunners` (3; 2 for short/arc routines — the receiver takes the slot); cross pull-toward-goal 0.18 open play / **0.06 corners** in `performCross` (the goal-pull fed the goal-side marker — fm 21); corner cross boost ×2.4 in `decideCarrier` (×0.7 when the routine goes short/arc); routine priors + zone openness in `pickCornerRoutine`; crasher-wait gate in `stepRestart` (≥2 at spots, minSetup+3.5 cap); `HEADER_RADIUS` |
| The corner DELIVERY chain (31.9 — every link was silently broken; measure the delivery, not the outcome) | `CORNER_CLEARANCE` 9.15 (the 6m sentry free-headed every ascent — apex ~3.5m keeps the climb in the header band until ~7.8m out); kick protection: the clearance circle holds until the ball is KICKED, all restart kinds (`Match.step`, the hand-off gap let defenders block launches at the boot); `team.cornerCrash` persists routine+locked personnel through hand-off+flight (2.8s), consumed by TeamBrain/PlayerBrain/executor; routine corners aim at the KEY ZONE via `performCross(at)` (vel-lead overshot a bursting crasher by ~9m); the timed crash: hold 4.5m off the spot, burst at `r.timer ≥ 1.7`; in-flight adjust: closest crasher re-routes to the exact descent −2.5m upstream (landing scatter σ≈2.6m > HEADER_RADIUS) |
| Marker separation (31.9, the headed-game lever) | reaction lag in executor MarkOpponent: mark sprinting >4.5 m/s within 26m of our goal ⇒ stance target re-read every `0.45 − defending·0.25`s (anchor on Player); box duels: defenders still win the first corner duel ~7:1 — next dials: rank crash spots by `aerialSense` (today player-index order), crasher momentum bonus in `tryAerial`, longer lag |
| 一脚出球 / first-time passing (31.9) | trigger: pressured intended reception (opp within `3.0 + tempo·1.5`) in `giveBall` ⇒ decisionTimer 0.07 + 0.28s window; penalty `oneTouchMul` = `1.15 + (1−dribbling)·0.9` on pass/cutback/through/loft noise + loft range error; any kick consumes the window; `stats.oneTouch` in calibrate (~12/match) |
| Barred-box discipline (31.9, 门球抽搐) | steering target rides `BOX_DEPTH+0.8` outside the clamp line + into-box desired-velocity zeroed at the edge (executor); the hard clamps brace velocity ×0.2 (`Match`) |
| Direct free kicks (Phase 32) | band 9-28m attacking half; candidate `(0.55+(28−dGoal)·0.02)·(0.7+(fin+tech/2)·0.45)`; wall 2-3 by range, slots `fkWallSlots` (9.15m law line, 1.1m spacing > PLAYER_MIN_DIST); wall-wait gate <1.5m/slot (cap minSetup+3); wall HOLDS 0.7s post-strike (else it walked into the climb's band); flight solver z=2.6 at the REAL wall distance; placed-ball saveP base 0.7, difficulty floor 0.85; quick restart: timer<0.8 + no wall + open FORWARD mate >0.85; band fouls whistled back (27.2 advantage narrowed — user vetoable); pro-foul willingness ×0.6 in range |
| Long-ball defence (32.1) | defending chaser = fastest-to-LANDING for >12m deliveries landing outside our box (`assignChasers`); box landings stay with the marking scheme — the unscoped cut cost 0.77 goals/match |
| The ball-playing keeper (32.2) | back-pass law in `giveBall` (same-side pendingPass ⇒ FEET, no hold/clearance, decision ≤0.18s); outlet pricing `(0.25+ballPlay·0.55)·(0.7+pressure·1.1)` in the pass loop; GK clear ×(1.9−(passBias+riskTolerance)·0.55); GK never dribbles; `Ball-playing keeper` identity tag >0.62 |
| Chest / thigh trap (Phase 28.6, user report "球在两个球员之间弹来弹去 — 是不是没有胸部停球") | the aerial ping-pong was HEADERS: an uncontested ball hanging in the header band got nodded man-to-man forever because taking it out of the air with the body didn't exist. `tryChestTrap` (runs in `tryAerial` BEFORE the header contest): the man within `CHEST_TRAP_RADIUS` 1.05 of a ball ≤`CHEST_TRAP_MAX_HEIGHT` 1.7 and `vz`≤`CHEST_TRAP_MAX_VZ` 1.5, with NO opponent inside `HEADER_RADIUS` (a duel → head it), cushions it — priced by `touchFailChance`(+0.05 aerial malus), clean → `giveBall` (dead to feet + pass/offside bookkeeping), spill → heavy low knock + miscontrol (混战 preserved). PLUS the header contest DEFERS: an uncontested winner on a dropping MIDFIELD ball (`vz`<0, `dOppGoal`≥16.5, not near own goal) declines the header and lets it drop into the trap — the defer is what makes it bite (rallies 0.26/0.37→0.06/0.09). Attacking free headers + defensive clears fall outside the gate (unchanged). COST: headers-won 5.0/4.1→3.3/2.8, goals 2.59/2.35→2.41/2.22 (mean 2.32 = phase-36.1's shipped 2.34 — in band). Probe `pingpong.ts` (rallies + chest-band traps); calibrate the header/trap balance with `-- 8` two seeds |
| Keeper hands only in the box (Phase 28.5, user report "门将出击到禁区外用手接球") | ONE rule at every hands entry — `giveBall`'s `gkFeet` gate (GK + not a restart taker + (back-pass OR **outside own box**) ⇒ FEET, decision ≤0.18s, no hold/clearance) covers the loose capture (`tryCapture`) AND the high claim (`tryAerial→giveBall`); `trySmother` now requires `inPenaltyBox(ball)` even mid-rush (the `rushing` bypass WAS the illegal hands dive off the line); `tryAerial` skips the keeper claim when the GK is outside his box (→ outfield header contest). The sweeper still rushes/chases off his line — `GoalkeeperRush`/`ChaseBall` stay un-clamped — he just clears with FEET now. NOT a balance lever (goals/saves unchanged either side). Probe `keeper-hands.ts` (4-cell split hands/feet × in/out): hands-outside 0.1/match → **0**, feet-outside 0.01 → 0.14, in-box cells + goals flat; the gkBuildup directional test scales to n=160 (the true ~1.30 build-up ratio; n=80 drew 1.18 near the bar) |
| Shot blocks / lane awareness (Phase 31) | `laneBlockers` radius 1.0 / corridor 60% (perception); shot-utility discount `pow(0.55 + shootBias·0.15, blockers)` in `decideCarrier`; block roll `0.32 + defending·0.25` within 0.9m in `tryShotBlock` (goalmouth <6m excluded) |
| The open run / rest defence (Phase 31) | openRun zone dGoal<28 + nobody goal-side; back-pass mul 0.35, drive ×1.35 (NO pressure exemption — it inverted shootBias, fm 20); rest-defence DF: support suppressed past halfway + spot clamp ≤ −12 local |
| Cutback volume | arriver trigger localX > HALF_L−21 & |y|>10 (`assignRunners`); carrier zone localX > HALF_L−17 & |y|>10; wide-drive dribble (下底) at |y|>13, 20<localX<HALF_L−7; arc-arrival window in `decideCarrier` (HALF_L−26, |y|<12) |
| Formation-identity ecology (Phase 31) | style mutation 0.08/season (mutated band only, one component); zonal entry ×0.3 roll AND the League's shared budget `max(0, 4 − zonal)`; rebirth inherits the dominant parent within the same budget |
| Aerial duel character | `AERIAL_ROLE` + attr weights in `aerialSense`; attacker-momentum bonus 0.07 in `tryAerial`; header-shot gate 16.5m + quality `0.5·exp(−d/8.5)` in `performHeaderShot` |
| Long-ball volume | `loftBase/loftOpenW` + the d>24 gate in the pass loop (don't lower it — 18m cannibalized healthy ground passes, 30.5); flight times in `loftKick` callers (hang time = interceptability; the switch is a DRIVEN 0.55+d·0.033 ball since 30.5 — floaters always lost the drop) |
| Long-shot appetite | `longShotW` (default 0.3) × shootBias × stagnation, 16–30m gate in `decideCarrier` |
| GK vs dribblers | smother reach 1.3m / pWin base 0.5 / clumsy-foul 0.12 rush · 0.03 standing in `trySmother`; GK overlap anchor in `resolveOverlaps` |
| Foul / penalty rate | `foulP = 0.06 + markingAggression·0.1` per failed tackle in `mechanics.tryTackles`; penalty share follows box tackle volume |
| Feed 🎼 pass-move lines (Phase 33) | `PASS_MOVE_FEED_MIN` in `Match` (6 ⇒ ~2.1 lines/match, 8 ⇒ 0.75 — measured); the chain itself finalizes in `endPassMove` (turnover/dead ball/shot/clear) |
| Match ratings (Phase 33) | weights in `sim/ratings.ts` (goal 1.2 · assist 0.8 · save 0.25 · recovery 0.1 · miscontrol −0.1 · win 0.3, base 6.5, clamp [6,10]); written once at `endMatch` — presentation reads, sim never does |
| 2过1 wall pass (Phase 34) | grant in `performPass` (attacking half, pressure>0.2, d<15, gene gate (tempo+passBias)/2>0.35); BURST 1.2s vs return credit 2.3s (`wallRun.until−1.1` in PlayerBrain — the full-window sprint cost 0.3 goals of structure); return flip gain>0.2 ⇒ ×(1.15+(tempo+passBias)·0.25) |
| Third man (Phase 34) | fresh reception <1.5s bouncing FORWARD to a MakeRun mate: ×(1+passBias·0.3) ground / ·0.35 through+chip; `pendingPass.bounce` credits on arrival |
| 套边 overlap (Phase 34) | license in `assignRunners` (wide confronted carrier, width gene>0.3, trailing same-wing pick); license survives its own release ball's flight (31.9 corner lesson); executor outside route; release ×(1.3+width·0.6) ONLY once the run came around (|y|>9, level−6m); reception counts wide (|y|>11) |
| 脱压带球 escape carry (34.2) | `escapeCarry` in perception.ts (pressure>0.45, front space<0.55, localX<15, escape space≥0.25 — else null and the forward game is untouched); scorer penalty ×(1−pressure·0.1), gene half-gate; executor clamps out of the own box; 34.3: wide carriers (8<|y|<HALF_W−5) tilt OUTWARD to their touchline (probed 100% outward) |
| Turn tax / hold-up (34.3) | forward dribble ×(1−backToGoal·pressure·0.3) — 0.4 sank main-seed goals below band; HoldUp zone localX>−12 (was >0), ST hold-ups 0.50/match |
| Combo ecology (Phase 34 watch) | no directional formation bias (3-seed probe: wide sweeps one seed, narrow another) but selection got SHARPER — 2/3 seeds hit atk-formation monoculture by gen 10 (baseline 0/3); style mutation 0.08/season is the re-entry channel — revisit if STUCK |
| Game-state mentality (Phase 35) | pure fn in `ai/mentality.ts`, served through the `Team.genome` getter (`effGenome`; raw = `info.genome`; LEVEL game returns the raw object — bit discipline). Urgency ramp (min 60→85, deficit mag 1/.85/.5): risk +u·(0.18+0.22·raw), tempo +u·(0.1+0.2·passBias), press +0.25u, depth +0.15u, **shootBias +0.25u / width +0.15u** (probed: without them shot share went DOWN — through balls into a bus never work); holding ramp (65→90, lead mag 1/.6/.25): tempo −0.16h (−0.28 sank league goals to 2.18/2.02 — holding covers most decided matches' last quarter, suppression compounds league-wide), depth −0.12h (THIN bus — h·0.22 smothered comebacks below baseline), risk −0.1h, press drop scaled by (1−raw). Probe = `mentality-ab.ts`, POOL two seed blocks (single blocks lied: baseline comeback swung 10.6→5.3%) |
| 门将上前 / keeper-up (Phase 35) | license in `updateTeamBrain` (urgency>0.5, half 2, minute≥89, live own corner OR `cornerCrash` window — survives hand-off+flight, 31.9 lesson); GK brain branch → MakeRun, executor routes to the penalty-spot area; chase positioning holds a trailing keeper at HALFWAY during sustained attacks (executor GoalkeeperPosition); the taker WAITS (stepRestart: gate localX ≥ HALF_L−24, window 8s, timeout 8.5s — setpieces invariant test carries the licensed exception) |
| Whistle protocol (Phase 35) | `refBlowsNow`: awarded penalties/corners/walled FKs are always PLAYED; at patience-over (STOPPAGE_MAX) a pendingShot OR pendingPass in flight still lands (the keeper-up corner was cut at its climax without this); no keep-ball exploit — pendingPass clears each reception, the whistle takes the gap |
| 打卡油角 corner holding (Phase 35) | `escapeCarry(…, holdCorner)` — holding>0.5 opens the final-third gate in the attacking half, blends repulsion with a corner-ward pull (guarded off both lines); HoldUp widens to ANY carrier at localX>HALF_L−18, |y|>10, ×(1+holding·0.6); GK hold ×(1+0.5h−0.3u) in `giveBall` |
| Discrete touches / the poke window (Phase 36 + regimes 36.1) | push gate in `Match.stepBall` (playing, outfield, action Dribble, `touchTimer≤0`, speed>2.5, nearest opp > `TOUCH_CONTROL_DIST` 4.2 — under it the OLD glue is close control and the tackle duel lives there); push in `mechanics.performDribbleTouch`: **base 0.9 + open-cone·0.32 (cap 9m)** so the field prices the touch (一步一带 vs 爆趟), LINE GUARD halves a knock that would roll into touch (12.9% rolled dead without it), dribbling × length + wobble (and a keeper in the cone prices from `GK_RUSH_ENVELOPE` upfield of his body, Phase 46); poke window = `kickCooldown` **0.26 + 0.04·push** (a knock is a chase); `touchTimer` at capture 0.32 / recollect 0.2 (+low-tech 0.08) ≥ decision settle; recollect pFail ×0.45, decision 0.18, no dribbles++ — probed regimes: stride 41.5% @0.43s/1.14m, mid 55% @1.05s, knock 3.6% @3.56m; poke 16.4% (0.38/0.06 slopes = 26% poked + goals −0.27, pulled back) |
| The contested 50/50 (36.2) | `assignChasers` possession-side branch: ONE nearest outfielder contests a TRUE loose ball (owner null, `dribbleTouch` null, no own pendingPass, phase playing — designed balls belong to their runner/receiver/taker); consumed by a ChaseBall candidate (score 1.1) in the possession branch of `decideOffBall`. Probed: possession side contests 100% of ≥0.5s loose windows (~7/match; structurally 0% before — possession is sticky, so the nominal owners never raced their own squirts) |
| Magnus / the curved ball (Phase 37) | `Ball.spin` rad/s rotates free-ball velocity (constant rate = circular arc, exact closed forms); PRE-COMPENSATION: every curled kick launches rotated −spin·T/2 so the chord crosses at the straight aim (landing invariance — corner scatter probed unchanged); projectors `ballLanding()` + interceptBall ground table carry the arc form (chord = displacement rotated half the turn); setters: cross/corner inswing 0.28+tech·0.3 (`loftKick(spin)`), FK 0.25+tech·0.25 with solver clearance 2.6+|spin|·0.5 (≤0.7 spin swung the climb past the wall EDGE — 4/30 free headers, the 31.9 sentry failure), placed shots 0.1+tech·0.2 (ground spin, T from the friction log-integral, dive ×(1−|spin|·0.12)); decay 0.25/s air, 1.5/s grass, ×0.55 bounce; zero on plain kicks/captures — spin 0 is bit-exactly the straight game |
| Body-contact choreography (Phase 38, RENDER-only — fingerprint unchanged) | pure fns in `AnimationSystem`: `shielding()` (carrier ≤2.2 m/s + opp <1.6m → `shield` anim; HoldUp-on-ball routes there via `animFor(hasBall)`), `rideSide()` (both ≥4 m/s, <1.2m, dyaw<0.55, beside-not-wake, **ball <3.5m** — the gate that matters: marking pairs track at exactly PLAYER_MIN_DIST so without it the whole defense leans, probed 185–286 vs shipped 33 bouts/match), `jostling()` (corner setup, ≤1.6 m/s, opp <1.7m, goalmouth half); layered leans never replace the run cycle; probe = `contact-choreo.ts` headless RenderStates |
| Player traits (Phase 39) | derivation bars in `evolution/traits.ts` (clinical fin≥0.8 / poacher ST fin≥0.75+drb<0.6 / playmaker pas≥0.8 / enforcer def≥0.8 / engine pace≥0.82 / cat GK ref≥0.85; ≤2 by excess) — DERIVED at Player construction, never saved; effects: aimMargin −0.1 (`performShot`), runTarget narrow 0.35, lane ×1.15 (pass loop), tackle +0.04 & foul +0.02 (`tryTackles`), drain ×0.9 (cached `staminaDrainMul`), reach +0.12 (`keeperReach`); captain = max age·(passing+dribbling)/2 (`Team.captain`) → mode hysteresis ±0.04 (`updateTeamBrain`); judge trait levers by the DISCONTINUITY method (0.79 vs 0.81 across the bar), census probe `trait-census.ts` |
| League ecology (Phase 40) | rivalries DERIVED (`League.rivalryMeetings`: cup finals + playoff deciders by SLOT, ≥2 arm; `isDerby` → `cfg.derby`): banner + press +0.04 (`updateTeamBrain`) + foul +0.01 (`tryTackles`); prestige `prestigeOf` (title 1.0/cup 0.6, ×0.85 decay) biases the D2 rebirth parent rank by `min(p,2)·0.03` — the +0.06 HARD CAP is the monoculture guard (probed: 1–2 armed feuds and 8–12 distinct champions per 20 gens; evolve-check is the gate) |
| Card rate | `yellowP = 0.16 + markingAggression·0.12` per foul + straight-red 0.012 in `Match.maybeCard` (~0.7🟨/0.05🟥 per match since the 27.1 spacing pass cut tackle volume; calibrate prints both) |
| Direct play (through balls ~22/match) | `throughBase/OpenW/BehindW` policy defaults; riskTolerance/tempo gates + the multiplicative openness gate `0.4 + 0.6·(lane/0.45)` and landing-judged chips (30.5) in `decideCarrier`; runner count in `assignRunners`; run depth clamp in `runTarget` |
| Restart pace / dead-ball share | `RESTART_MIN_SETUP` (1 s), `RESTART_CLEARANCE` (6 m), `RESTART_TIMEOUT` failsafe (6 s) |
| Pass-fest vs dribble balance | carrier utility bases in `PlayerBrain.decideCarrier`; post-receive settle (`giveBall` decisionTimer 0.3) |
| Turnover rate | tackle probability in `mechanics.tryTackles` — base 0.25, defending ·0.34 (repriced Phase 48 after the budget exposed DF drain), carrier evasion dribbling ·0.18 + strength ·0.10 (shield) + pace·drive ·0.20 |
| Breakaway economy | `GK_RUSH_ENVELOPE` (5m, Phase 46) — how far upfield of his body a keeper prices the carry cone; bigger = shorter touches near him = fewer 送门将, more 1v1 finishes |
| Finishing payoff | aimMargin slope `1.3 − finishing·0.6` (Phase 47; swept — 0.9 had drifted past the corner-dare optimum) + spread `1.45 − finishing·0.9` in `performShot` |
| Specialisation pressure | `SQUAD_BUDGET` (24) in `playerGenome.ts` — lower = harder tradeoffs, faster archetypes; watch calibrate goals via the defending reprice interplay |
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
   for speed. ⚠ The fingerprint hashes the **save JSON**, so adding
   record-only fields (e.g. 32.5's rebirth snapshots in
   `history[].evolution.entries`) moves the hash without moving the sim —
   when that's the claim, PROVE it by stripping the new fields from the
   output and re-hashing: the reduced hash must equal the old baseline
   exactly (32.5: reduced == `c37f5020…`, full baseline now `40f72c64…`).
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
11. **Every phase ships with PROBE evidence** (user rule, 34.2 — every big
    catch in this project came from a probe, not a test suite). By change
    type: **sim/AI behavior** → a rate/delivery probe of the new mechanic
    itself (measure the DELIVERY, not just calibrate outcomes — the corner
    chain was 0/30 while calibrate looked fine), a same-seed A/B against
    the previous tag when the claim is "X improved" (git worktree at the
    tag; `scripts/probes/escape-ab.ts` is the template), and calibrate on
    TWO seeds before believing any delta (evolution-path drift produced a
    phantom +0.32 goals once). **Render/presentation** → if the logic is a
    pure function of sim state, probe it headlessly
    (`scripts/probes/dive-timing.ts` is the template); pixels stay
    screenshots + the user's eyes. **Record/schema** → strip-and-rehash
    fingerprint proof (invariant 2). Probes live in `scripts/probes/`
    (plain tsx, self-contained); quote their numbers in the ROADMAP phase
    block.

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
5. **Probe the mechanic itself** (invariant 11) — a small tsx probe in
   `scripts/probes/` measuring the new behavior's rate/shape directly; A/B
   against the previous tag when claiming an improvement. A mechanic whose
   probe reads zero is silently dead no matter how green the tests.
6. **Run calibration** — `npm run calibrate` on TWO seeds + `npm run
   evolve-check`; compare against the README reference numbers; investigate
   any balance drift you didn't intend.
7. **Run browser validation** — `npm run debug:visual` (+ `debug:visual3d` if
   relevant) and actually look at the screenshots.
8. **Update README** (features, balance numbers, scripts) **and this document**
   if you changed architecture, invariants, seeds, or added a failure mode
   worth remembering. There is no separate CHANGELOG — README + git history
   serve that role.
