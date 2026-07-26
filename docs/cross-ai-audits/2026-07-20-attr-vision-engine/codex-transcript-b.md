Reading prompt from stdin...
OpenAI Codex v0.144.1
--------
[1mworkdir:[0m /Users/jamie/Documents/Promptfoo/evofootball-arena
[1mmodel:[0m gpt-5.6-sol
[1mprovider:[0m openai
[1mapproval:[0m never
[1msandbox:[0m read-only
[1mreasoning effort:[0m xhigh
[1mreasoning summaries:[0m none
[1msession id:[0m 019f8030-972c-7401-a16d-f43c6b94ff93
--------
[36muser[0m
# Independent design consultation — EvoFootball Arena · PERCEPTION→DECISION ARCHITECTURE (zero preset)

You are giving an INDEPENDENT design opinion. There is **no predefined answer** — investigate, form
your own view, and it is completely fine (encouraged) to DISAGREE with the current direction. The
person asking wants a genuine second brain, not their own thinking echoed back. Where the docs
contain a current author's in-progress hypotheses (especially `docs/ROADMAP.md`, a dated
working-session log), treat those as *context, not answers*; reason from the code and first
principles and say if you think they're wrong.

## The project
EvoFootball Arena is a **deterministic 6v6 evolutionary football simulation** (TypeScript) whose
soul is **EMERGENCE**: tactics/styles/skills must ARISE from evolution + selection on a substrate,
never be hand-coded. Players decide actions each tick via utility scorers built on small perception
queries. A stated design direction is to build the game "bottom-up" as a
**perception → value → action** decision engine — letting each player (and the coach) "grow eyes":
perceive the ball, opponents, team-mates, the field, their own state, and the dynamics/anticipation,
derive the VALUE of options, and choose. Constraints to respect:

- **Emergence** (enrich substrate + genes so good play pays; don't hand-script role behaviors).
- **Watchability:** ~2 goals/match, varied routes to goal, no pathologies; a change that inflates
  scoring or collapses a route is a regression even if realistic.
- **Determinism:** seeded RNG only (no `Math.random`/wall-clock); identical seed ⇒ identical match.
- **Per-player individuality should be EVOLVABLE** (gene-driven), not a fixed hand-set constant.

## What to read (repo root = your CWD)
- `docs/VISION.md` — the gold-standard vision (authoritative intent; includes the "eyes"/engine idea).
- `docs/EVO-BLUEPRINT.md` — the emergence architecture.
- `docs/ROADMAP.md` — recent history + current state (working-session log; context, not answers).
- `src/ai/perception.ts` — the pure perception queries (openness, lane, pressure, space, intercept).
- `src/ai/PlayerBrain.ts` — the per-player action utility scorers (pass/shoot/dribble/run).
- `src/ai/TeamBrain.ts` — team-level coordination (runners, modes).
- `src/ai/formations.ts` — positioning/station logic.
- `src/evolution/playerGenome.ts` — the attribute genes + budget.

## Your questions (form your OWN opinions; be concrete — name functions, formulas, code sites)
1. **Assess the perception→value→action / "grow eyes" direction.** Is it the right architecture for
   this sim? What would you keep, change, or drop? Where are the current perception queries too
   perfect, too crude, or missing a dimension (e.g. team-mates, own state, anticipation)?
2. **Per-player perception QUALITY.** Currently perception is essentially perfect and identical for
   every player. If individual perception quality should VARY (and be evolvable), how would you model
   it so it differentiates players WITHOUT destabilizing match outcomes (e.g. without one-sidedly
   inflating scoring)? Consider both attacking reads and defensive reads. What keeps it balanced?
3. **Highest-leverage next step.** Given the vision (realism) and the hard watchability constraint,
   what is the single highest-leverage next change to the perception/decision layer — and what would
   you deliberately NOT do yet? Rank a short list with the balance risk of each.

Prioritize. Disagree freely. Cite file:line where you can.

[35m[3mcodex[0m[0m
I’ll treat `VISION.md` as the intent boundary, then test the “grow eyes” hypothesis against the actual information flow and scoring formulas. I’ll focus on architectural leverage and failure modes, not merely inventorying missing features.
  [36m→[0m Read the vision, emergence blueprint, and relevant roadmap history
  [2m•[0m [2mTrace perception inputs through player/team action scoring and formations[0m
  [2m•[0m [2mInspect genome constraints and identify evolvable, balanced perception mechanisms[0m
  [2m•[0m [2mSynthesize a prioritized independent recommendation with code citations[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'wc -l docs/VISION.md docs/EVO-BLUEPRINT.md docs/ROADMAP.md src/ai/perception.ts src/ai/PlayerBrain.ts src/ai/TeamBrain.ts src/ai/formations.ts src/evolution/playerGenome.ts && rg -n "percept|eyes|decision|emerg|utility|watch|goal|real|anticip|vision|aware|pressure|space|intercept|runner|mode|formation|gene|budget" docs/VISION.md docs/EVO-BLUEPRINT.md docs/ROADMAP.md'[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     255 docs/VISION.md
    2289 docs/EVO-BLUEPRINT.md
    2566 docs/ROADMAP.md
     311 src/ai/perception.ts
    1144 src/ai/PlayerBrain.ts
     485 src/ai/TeamBrain.ts
     561 src/ai/formations.ts
     231 src/evolution/playerGenome.ts
    7842 total
docs/VISION.md:46:  **划算**(gene-driven、无角色偏置),退掉补偿性的手调,然后**跑演化并观察**。
docs/VISION.md:54:  low-32/…),`formationSpot` 只在其上叠**仿射变换**(随球 x 滑动、按基因缩放宽/深、
docs/VISION.md:59:  防守贡献 0。**要求:位置本身必须涌现**——一个 gene-driven 的**定位场/角色+自由度**
docs/VISION.md:64:- ⭐⭐⭐ **实现形态(2026-07-20 拍板):"让球员自己长眼睛"。** 上条那个 gene-driven
docs/VISION.md:73:  口)。所以要补的是**原语**,而**补一个 gene 门控的能力原语 ≠ 手写行为**:谁用、几个、
docs/VISION.md:93:  · **眼睛本身有好坏 = 属性**:用 awareness/视野属性 gate 看得**多远/多准/多快** → **"长眼睛"本身
docs/VISION.md:98:  对照现实**审完备**(缺不缺 vision/awareness、first-touch、aerial、agility/转身、惯用脚 等决策相关
docs/VISION.md:113:  眼睛(球+对手+队友+场地+自身+动态)→ **gene 加权价值** → 选动作。所有打法(内切/包抄/
docs/VISION.md:148:## 3. 贴近现实 (REALISM — reference real football)
docs/VISION.md:164:真正的标准是"**现实足球里存在的机制,在我们的底座里都该是可能的、gene/attr 驱动的,
docs/VISION.md:224:- **可视化**:style-space 地图、分化曲线、数据驱动铭牌——让进化**看得见**。
docs/VISION.md:236:  对照上一 tag A/B,过全门（vitest、visual-debug×2、calibrate、goals-warming、
docs/VISION.md:252:   和 §1 涌现纪律（不能手写行为、只能给 gene-gated 能力）和 §3 现实锚点。
docs/EVO-BLUEPRINT.md:4:> authority on what the user WANTS; every decision is measured against it. This
docs/EVO-BLUEPRINT.md:5:> blueprint (the plan/state) serves that vision, not the reverse.
docs/EVO-BLUEPRINT.md:11:## The vision (the user, 2026-07-14)
docs/EVO-BLUEPRINT.md:20:everything rests on a realistic, high-quality simulation substrate.
docs/EVO-BLUEPRINT.md:26:   genes re-circulate outside rebirth crossover (second genetic channel).
docs/EVO-BLUEPRINT.md:29:   convergence pressure, to be removed in favor of results-dominant fitness.
docs/EVO-BLUEPRINT.md:33:- **The emergence meta-rule extends to every new layer**: coach philosophies
docs/EVO-BLUEPRINT.md:45:  widen-formation) and do not hand-set new ones.
docs/EVO-BLUEPRINT.md:51:| **45 (A1)** | 套路 combos gene-driven: fold Phase 34's hand-set trigger thresholds/appetites (wall pass / third man / overlap) into per-franchise policy genes, born at today's constants (the proven phase-42 pattern). Also: run `policy-coherence` to establish the coherence baseline. | combo-rates A/B (specialists diverge, league mean stable) + policy-emergence + calibrate ×2 |
docs/EVO-BLUEPRINT.md:52:| **46 (A2)** | Breakaway substrate fix: the carry-push cone is keeper-BLIND (verified defect — maxed attrs still ~8-9% heavy-touch→keeper). Make the push-target keeper-aware at the physics-primitive level, unbiased, so pace/space PAY. | `breakaway.ts` A/B + calibrate ×2 |
docs/EVO-BLUEPRINT.md:53:| **47 (B)** | Attribute expansion 5→8: `pace/passing/dribbling/finishing/defending/strength/stamina/reflexes` — exactly the turnkey scope in EMERGENCE-PIVOT §5 (per-line technique remap incl. the mechanics.ts ambiguity GOTCHA, strength/stamina payoffs, ROLE_BIAS MF→passing, traits, DECLINE_W, probes to 8 keys, save v11→v12 neutral backfill). | calibrate ×2 watching completion+goals (fm 16–21) + player-archetype probe |
docs/EVO-BLUEPRINT.md:54:| **48 (C)** | **Resource budget (the keystone)**: `SQUAD_BUDGET` = hard cap on the squad's total attribute points; one pure `enforceBudget(squad)` (proportional rescale) applied after rebirth crossover, the careers develop pass, and newgen entry. SQUAD-level on purpose: star-plus-role-players vs balanced-six becomes an evolvable axis. Rejected: fitness penalty (invisible, evolution routes around), per-player cap (kills the star axis). **Rides with it: academy heredity** — newgens mutate the retiring slot's attrs (club bloodline) instead of random+ROLE_BIAS; ROLE_BIAS retires. Cap derived by probe (bind early: ~founding mean ×1.1–1.2), settled by calibrate. Budget bar on the team card. | specialization probe (within-player variance ↑, cross-club allocation divergence ↑) + evo-drift plateaus at cap + calibrate ×2; rewrite the careers mean-stability test (the budget intentionally changes that invariant) |
docs/EVO-BLUEPRINT.md:55:| **50 (E)** | Selection speedup, one lever at a time, judged by a new `style-speed` probe (**target: visible clustering ≤8–10 seasons on fresh saves**, spread ≥15% / ≥3 nameplate clusters): (1) **fitness slimming** — results-dominant (points ~0.5, GD ~0.2, styleConsistency ~0.1; drop passCompletion/recoveries/staminaEfficiency); (2) parent diversity — reborn's second parent = highest-fitness club most gene-distant from the first (deterministic); (3) diversity thermostat — mutation scale rises when population spread sinks below a floor (derived from population state, unbiased, self-regulating); (4) only if still short: D2 rebornN 3→4. | style-speed A/B per lever + calibrate ×2 (watchability is the backstop if e.g. hoofball wins) |
docs/EVO-BLUEPRINT.md:57:## Stage 2 — VISIBILITY: make evolution seen (phase 49, right after the budget)
docs/EVO-BLUEPRINT.md:63:- **Style-space map**: clubs scattered on the season's two highest-variance
docs/EVO-BLUEPRINT.md:65:  between seasons), with N-generation trails and cluster hulls; cluster
docs/EVO-BLUEPRINT.md:66:  names generated from centroid extremes.
docs/EVO-BLUEPRINT.md:67:- **Divergence dashboard**: the policy-emergence spread metric in-game
docs/EVO-BLUEPRINT.md:68:  (curve over generations), per-gene mean±band sparklines, a diversity
docs/EVO-BLUEPRINT.md:69:  index, per-club budget-allocation heatmap.
docs/EVO-BLUEPRINT.md:77:  tactical genome + policy genes move INTO a named, aging coach; the club
docs/EVO-BLUEPRINT.md:78:  keeps squad/academy/budget/prestige/rivalries. Same genetic operators, now
docs/EVO-BLUEPRINT.md:85:- **W2 Player personal style**: a small per-PLAYER decision-bias gene set
docs/EVO-BLUEPRINT.md:88:  Traits re-derived over 8 attrs + style genes (cap 2/player, every trait
docs/EVO-BLUEPRINT.md:91:- **W3 Free-agent fire-sale** (second genetic channel, minimal first cut):
docs/EVO-BLUEPRINT.md:93:  clubs sign under the budget (now a real wage cap). Full active transfer
docs/EVO-BLUEPRINT.md:99:  timeline; era names emerge from data clustering, never presets.
docs/EVO-BLUEPRINT.md:103:Parking-lot realism items admitted one at a time, each passing the test
docs/EVO-BLUEPRINT.md:104:*"does it give genes a NEW payoff surface?"*: substitutions/bench first
docs/EVO-BLUEPRINT.md:105:(rotation becomes an evolvable strategy, couples with stamina + budget),
docs/EVO-BLUEPRINT.md:111:original vision ("好玩的,可以自我进化的,可视化优秀的,有深度的,玩着爽的,
docs/EVO-BLUEPRINT.md:124:  emergence rule). One lever per phase; **the matrix probe IS the
docs/EVO-BLUEPRINT.md:128:    via real fatigue (MA correlation +0.51 → −0.54, era arms race
docs/EVO-BLUEPRINT.md:138:    generator, NOT a verdict — always A/B before nerfing.)
docs/EVO-BLUEPRINT.md:149:    suspensions served by real lineups. **The close attempt FAILED**:
docs/EVO-BLUEPRINT.md:153:    not frequency dependence. The decision point → the user re-framed
docs/EVO-BLUEPRINT.md:154:    the question from real leagues (2026-07-16) ⇒ levers 5-6 + the
docs/EVO-BLUEPRINT.md:173:    phase-64 def-menu watch: one world skewed low-32 15/16).
docs/EVO-BLUEPRINT.md:174:  - ✅ goals watch RESOLVED at phase-61: calibrate 2.70 / 2.59 — both
docs/EVO-BLUEPRINT.md:177:  under the widened budget (deep bench vs star XI is a REAL allocation),
docs/EVO-BLUEPRINT.md:178:  dead-ball subs driven by the `rotationBias` gene, roster-indexed
docs/EVO-BLUEPRINT.md:183:  `tinkerBias` gene scales the mentality response (stoic ×0.5 ↔
docs/EVO-BLUEPRINT.md:188:  goals). Selection verdict: alive with full-width spread, no corner
docs/EVO-BLUEPRINT.md:189:  runaway — the trade is real (chase bleeds counters, shut-down
docs/EVO-BLUEPRINT.md:192:  outline + press waves + the live mini formation map, presentation-grade
docs/EVO-BLUEPRINT.md:198:  deep-forward) as RARE mutations under an ecology budget (the zonal
docs/EVO-BLUEPRINT.md:199:  lesson, failure mode 21; plus the phase-64 def-menu watch — low-32
docs/EVO-BLUEPRINT.md:203:  philosophy, NOT a fitness term (failure mode 22 forbids uniform-virtue
docs/EVO-BLUEPRINT.md:205:- **Honest long-term note**: 6v6 itself is the realism ceiling (three
docs/EVO-BLUEPRINT.md:213:crowd AUDIO (noise swelling with xG, goal eruptions) — cheap, high 爽.
docs/EVO-BLUEPRINT.md:226:- ✅ **phase-45 SHIPPED** (套路 → policy genes + coherence baseline): `wallPassW /
docs/EVO-BLUEPRINT.md:228:  constants; the two gate sites scale the gene score before the threshold, the
docs/EVO-BLUEPRINT.md:230:  Save v13 (same backfill pattern). Gates: policy-emergence spread 0→~20-26%
docs/EVO-BLUEPRINT.md:231:  persists on both seeds WITH the combo genes in the pool; combos tests grew
docs/EVO-BLUEPRINT.md:234:  the runner in 29 scenes vs averse 26; per-match counts are noise, probed
docs/EVO-BLUEPRINT.md:240:  emerge from selection alone; chase↔fwdPass r=−0.38; mark↔intercept r≈0 —
docs/EVO-BLUEPRINT.md:242:- ✅ **phase-46 SHIPPED** (keeper-aware carry cone): `GK_RUSH_ENVELOPE = 5` —
docs/EVO-BLUEPRINT.md:251:  keeper. If play-feel reads goal-happy, `GK_RUSH_ENVELOPE` is the dial).
docs/EVO-BLUEPRINT.md:267:  stamina random-walks (weak gradient — exactly what the phase-48 budget
docs/EVO-BLUEPRINT.md:275:  "deterministic zeros" were mentality-permeable at boundary genes (width
docs/EVO-BLUEPRINT.md:276:  +0.15·u / tempo +0.1+0.2·passBias) — re-pinned at safe genes + a
docs/EVO-BLUEPRINT.md:282:  goal-conditional checks didn't fire this trajectory). Fingerprint
docs/EVO-BLUEPRINT.md:295:  goes from a downward random-walk (no price) to held ~0.56** — the budget
docs/EVO-BLUEPRINT.md:300:  0.63→0.52, goals →3.1-3.4) — `tryTackles` defending weight 0.24→0.34
docs/EVO-BLUEPRINT.md:301:  (swept: reference-seed goals 3.07→2.65). Calibrate band 2.65 / 3.29 /
docs/EVO-BLUEPRINT.md:309:  — a club's style is its point in the 33-dim (14 genes + 19 policy) space.
docs/EVO-BLUEPRINT.md:314:  words, zh-localized; combinations are emergent, 'Balanced' must be earned
docs/EVO-BLUEPRINT.md:315:  away). **Style-space map** on the Evolution tab: clubs scattered on the
docs/EVO-BLUEPRINT.md:318:  **divergence sparkline** (population spread per generation) and the
docs/EVO-BLUEPRINT.md:319:  **budget-allocation heatmap** (16×8, single-hue ramp) beside it.
docs/EVO-BLUEPRINT.md:332:  gens × 2 seeds): **the speed target is ALREADY MET post-budget** — spread
docs/EVO-BLUEPRINT.md:340:  the budget + visibility already deliver fast visible divergence; revisit
docs/EVO-BLUEPRINT.md:347:  Architecture, hero first: (1) the style-space map with a **generation
docs/EVO-BLUEPRINT.md:348:  scrubber + ▶ playback** — watch styles drift season by season (styleMatrix
docs/EVO-BLUEPRINT.md:351:  style dims as curves/budget + squad + family tree; (3) the **dynasty
docs/EVO-BLUEPRINT.md:352:  wall** — 16 slots × generations of elite/reborn/promotion events;
docs/EVO-BLUEPRINT.md:353:  (4) population trends (divergence, formation shares, budget heatmap) with
docs/EVO-BLUEPRINT.md:359:  NOT yet in it (next iterations as reports come in): per-club budget
docs/EVO-BLUEPRINT.md:365:  theme grouping mirrors the policy-gene subsets); each lens's AXES stay
docs/EVO-BLUEPRINT.md:376:  Calibrate 2.76 / 3.60 / 3.04 (777 stays the hot outlier; ⚠ WATCH the goals
docs/EVO-BLUEPRINT.md:377:  band creep across the emergence era — if play-feel says too many, dials:
docs/EVO-BLUEPRINT.md:388:  the (now index-generalized) `seasonStories` + cup finals winner-first w/
docs/EVO-BLUEPRINT.md:400:  strip/legend riding the dynasty wall (per-generation cells wrap in
docs/EVO-BLUEPRINT.md:403:  Tiki-taka/直塞手术刀/两翼齐飞 ages all emerged), race data 30/30
docs/EVO-BLUEPRINT.md:409:  + the memetic channel): the tactical genome, policy genes and formation
docs/EVO-BLUEPRINT.md:411:  (`evolution/coach.ts`; the club keeps squad/academy/budget/colors/Elo/
docs/EVO-BLUEPRINT.md:412:  prestige/rivalries/lineage). Same genetic operators, new transmission
docs/EVO-BLUEPRINT.md:419:  travels with the person under the zonal budget (adapts to man when full).
docs/EVO-BLUEPRINT.md:428:  budget never breached, multi-club coaches exist. Emergent and kept: the
docs/EVO-BLUEPRINT.md:442:  per-player decision-bias gene set — `evolution/playerStyle.ts`,
docs/EVO-BLUEPRINT.md:452:  crossover + selection. Traits grew three **badges-of-genes** (🎲
docs/EVO-BLUEPRINT.md:465:  Take-on artist, Never shoots) emerge in the tails. Calibrate 2.44 /
docs/EVO-BLUEPRINT.md:473:  31 or 3 idle seasons) instead of vanishing — the player-gene mirror of
docs/EVO-BLUEPRINT.md:477:  must fit UNDER the budget without taxing the squad (headroom =
docs/EVO-BLUEPRINT.md:481:  not the rich** (D2 buys 42–48%); budget violations 0/960 club-seasons;
docs/EVO-BLUEPRINT.md:482:  careers genuinely survive their clubs (a 32-goal career spanning two
docs/EVO-BLUEPRINT.md:487:  the tax model (allow over-headroom signings, enforceBudget shaves the
docs/EVO-BLUEPRINT.md:495:  (1) the **player style space** — all 96 players scattered on the two
docs/EVO-BLUEPRINT.md:496:  dims the population disagrees on most (13-dim identity space, axes
docs/EVO-BLUEPRINT.md:511:  worlds evolved 24 generations, 12 archetype snapshots (champion at
docs/EVO-BLUEPRINT.md:533:  run hot — 3.45 goals/match vs the 2.3–3.0 co-evolved band (not a
docs/EVO-BLUEPRINT.md:534:  calibrate concern; co-adaptation suppresses goals). **Consequence:
docs/EVO-BLUEPRINT.md:543:  paid the slow-jog cost and never harvested — a strictly-losing gene),
docs/EVO-BLUEPRINT.md:547:  — FT 0.51, goals 2.03; **shipped v2 = 0.010/0.009/0.020**
docs/EVO-BLUEPRINT.md:558:  arms race dissolved (late-vs-early .607 → .524), matrix goals
docs/EVO-BLUEPRINT.md:562:  cutback zone, and cutbacks convert at ~6% (0.98/match → 0.06 goals)
docs/EVO-BLUEPRINT.md:572:  goals are ecology-dominated, don't chase them with global dials;
docs/EVO-BLUEPRINT.md:574:  evolve-check: 5 champions / 10 gens, formations mixed. vitest **361**
docs/EVO-BLUEPRINT.md:576:  (behavioral: drain/recovery/lunge). Failure modes **25** (a wired
docs/EVO-BLUEPRINT.md:583:  telemetry) found the ceded arc was real but the DELIVERY died ~60%
docs/EVO-BLUEPRINT.md:597:  completion 68%→73-76%, interceptions 22→18-21, through balls +26%,
docs/EVO-BLUEPRINT.md:598:  goals 2.30 / 2.11 (watch unchanged, 424242 still soft). **Matrix
docs/EVO-BLUEPRINT.md:605:  lever candidate (watch whether the gate over-buffed box deliveries).
docs/EVO-BLUEPRINT.md:616:  whose bodies were **64-83% UNSET** (sprinting goalward or blind — 83%
docs/EVO-BLUEPRINT.md:622:  stillness, floored at `UNSET_BLOCK_WEIGHT` — decision side
docs/EVO-BLUEPRINT.md:629:  0.55**: cutback→goal 6.1/4.6/4.7% vs NEUTRAL/COMPACT/PRESS (baseline
docs/EVO-BLUEPRINT.md:631:  0.29-0.46, goal-rate held 29-37%), and the discount is
docs/EVO-BLUEPRINT.md:636:  bus mid-table), no ±9 monarch. Matrix goals 3.66 (cross-meta
docs/EVO-BLUEPRINT.md:653:  keepers stay; **WHEN is the coach's new `rotationBias` gene** read as
docs/EVO-BLUEPRINT.md:654:  a fatigue threshold (0.25+0.5·gene), WHO OFF = the tiredest body, WHO
docs/EVO-BLUEPRINT.md:659:  (a sub's goals land on HIS career) + the new `apps` field: rating
docs/EVO-BLUEPRINT.md:665:  selects rotation HARD (gene mean .465→.886 over 15 gens, league subs
docs/EVO-BLUEPRINT.md:669:  (the phase-60 goals watch RESOLVES; fresh legs + the new founding
docs/EVO-BLUEPRINT.md:682:  failure mode 27). evolve-check 8 champions / 10 gens, zonal at the
docs/EVO-BLUEPRINT.md:694:  **Probe A pre-registered the problem** (failure mode 25 discipline):
docs/EVO-BLUEPRINT.md:703:  starter in the budget-headroom era).** Cards/match 0.84→1.18-1.25 🟨
docs/EVO-BLUEPRINT.md:706:  re-rolled ecologies — failure mode 26, watch not chase; mean 2.43
docs/EVO-BLUEPRINT.md:709:  era arms race .762) ⇒ the decision point above. vitest **377** (+9).
docs/EVO-BLUEPRINT.md:713:  Everton lever, from the user's real-league reframe: tactical
docs/EVO-BLUEPRINT.md:717:  produced NO aerial contact** — the delivery led the runner by his full
docs/EVO-BLUEPRINT.md:719:  receiver's intercept solution parked him on the LANDING, where the
docs/EVO-BLUEPRINT.md:721:  header band) — in the goal-side defenders' laps (45% of crosses died
docs/EVO-BLUEPRINT.md:726:  generalized to open-play ReceivePass (route 2.5m upstream along the
docs/EVO-BLUEPRINT.md:731:  strength is finally real, and the tall-CB COUNTER is buyable the same
docs/EVO-BLUEPRINT.md:744:  failure mode 26; the band-vs-play-feel question is now urgent).
docs/EVO-BLUEPRINT.md:751:  tactics, the Klopp/bus lever from the real-league reframe; save v20):
docs/EVO-BLUEPRINT.md:752:  new gene `underdogShift` — how far the coach bends toward the bus
docs/EVO-BLUEPRINT.md:759:  top; identity for favorites, purists (gene 0) and Elo-less team
docs/EVO-BLUEPRINT.md:767:  the gene stays mid-with-spread (424242 ~0.55, 991 ~0.43 [0.00-0.78])
docs/EVO-BLUEPRINT.md:773:  mode 26)**. Matrix: 0 cycles / 41 decisive, era .662 (the weather
docs/EVO-BLUEPRINT.md:775:  world): def-formation ecology skewed to low-32 15/16 with zonal
docs/EVO-BLUEPRINT.md:777:  selectable enough to crowd the def-formation menu; attack diversity
docs/EVO-BLUEPRINT.md:800:  PERSON's temperament. (1) New gene `tinkerBias` scales the Phase-35
docs/EVO-BLUEPRINT.md:813:  (small leans stay silent, failure mode 7). (3) The 3D dugout:
docs/EVO-BLUEPRINT.md:827:  backfills 0.5 (migrated clubs respond exactly as before; geneMeans +
docs/EVO-BLUEPRINT.md:833:  coexist, def menu balanced 9/7 — the phase-64 low-32 watch did not
docs/EVO-BLUEPRINT.md:837:  and the probe shows the mechanism ADDS late goals (0.54→0.62/decided
docs/EVO-BLUEPRINT.md:838:  game) — the dip reads as founding re-roll, watch not chase (the
docs/EVO-BLUEPRINT.md:840:  behavioral phases; the next report should watch the dugout and the
docs/EVO-BLUEPRINT.md:841:  goals band together.
docs/EVO-BLUEPRINT.md:847:  onShot), and PERSONALITY animated from the SAME gene the feed
docs/EVO-BLUEPRINT.md:858:  `erupt()` on goals: every fan jumps on his own beat (upward-half sine
docs/EVO-BLUEPRINT.md:864:  timed), goal-moment screenshot eyeballed (fans at scattered heights
docs/EVO-BLUEPRINT.md:872:  defender shadowing the carrier ON the goal axis flipped it every
docs/EVO-BLUEPRINT.md:892:  designed effective protection). At 0.16: paired goals 2.49/1.89/2.74
docs/EVO-BLUEPRINT.md:904:  answer; N5's formation-library problem, don't chase here); (2) the
docs/EVO-BLUEPRINT.md:905:  goals band spans 1.89-2.74 across seeds — the user's play-feel
docs/EVO-BLUEPRINT.md:911:  wingers at +12/±18 running the vacated space). DISCOVERED, never
docs/EVO-BLUEPRINT.md:917:  **Emergence (shape-emergence.ts, 60 gens × 2 worlds, final config):
docs/EVO-BLUEPRINT.md:918:  tried in both worlds; world 991 grew false-nine into a real
docs/EVO-BLUEPRINT.md:924:  genes the novel shapes are honest (twin-st GF 1.11 GA 1.26, W-L
docs/EVO-BLUEPRINT.md:944:  (N5b); (2) the goals band now sits ~2.7 mean (2.06-3.26 across
docs/EVO-BLUEPRINT.md:945:  seeds) ≈ real-league scoring — whether the old 2.3-2.6 contract
docs/EVO-BLUEPRINT.md:954:  (gift-wrap over 5 points, preallocated buffers, +1.2m margin so
docs/EVO-BLUEPRINT.md:957:  mode is Press, its assigned chasers emit expanding ring pulses
docs/EVO-BLUEPRINT.md:962:  possession/modes/press (light, always built; old replays lack them →
docs/EVO-BLUEPRINT.md:984:  comparison, and every counter is emergent rather than scripted: a
docs/EVO-BLUEPRINT.md:989:  (≥7.5m off the goal center — the first cut chipped routine KA-0.5
docs/EVO-BLUEPRINT.md:992:  goals/match ≈ 7% of scoring). Anatomy (chip-anatomy.ts, 300
docs/EVO-BLUEPRINT.md:995:  the fixture (attacker 1.17→1.33→1.67 goals across KA 0.1/0.5/0.9) —
docs/EVO-BLUEPRINT.md:996:  the tax scales with exactly the gene that creates the gap.
docs/EVO-BLUEPRINT.md:1024:  formations directional contract INVERTED; binary isolation pinned the
docs/EVO-BLUEPRINT.md:1036:  78→76%, goals mean 2.79 ≈ 69's 2.80 (dead neutral). Keeper-throw
docs/EVO-BLUEPRINT.md:1039:- ✅ **phase-71 SHIPPED** (goal-kick OFFSIDE — a user-ratified law
docs/EVO-BLUEPRINT.md:1041:  `28002dfc…`). The report: attackers stood in the opponent's goalmouth
docs/EVO-BLUEPRINT.md:1043:  (cherrypick-anatomy.ts): TRUE — goal kicks were offside-exempt (the
docs/EVO-BLUEPRINT.md:1044:  real law) AND the brain's targeting gates knew it (the ×0.08
docs/EVO-BLUEPRINT.md:1046:  punt legally fed a camper 12m from goal on 19% of goal kicks. Fixes:
docs/EVO-BLUEPRINT.md:1047:  (1) goal kicks now play under NORMAL offside — deliberate arcade
docs/EVO-BLUEPRINT.md:1049:  family as offside→goal-kick restarts; kick-ins keep the throw-in
docs/EVO-BLUEPRINT.md:1051:  goal-kick setup the kicking side's outfielders are WALKED BACK to the
docs/EVO-BLUEPRINT.md:1055:  goalmouth camping 2.7%/19% (residue = legal line-level positioning
docs/EVO-BLUEPRINT.md:1064:  two findings, now built: real tactical feeds work because (a) the
docs/EVO-BLUEPRINT.md:1067:  always-on overlay is wallpaper. So: new `tacfeed` camera mode
docs/EVO-BLUEPRINT.md:1068:  (0,84,26 → center, static) replacing the behind-goal BUTTON
docs/EVO-BLUEPRINT.md:1070:  goals/saves); the entire tactical layer renders only in this mode
docs/EVO-BLUEPRINT.md:1079:  pass is in flight toward it from in front. The mini formation map
docs/EVO-BLUEPRINT.md:1083:  68 unchanged. vitest 403 (+1: tacfeed is the highest, static mode).
docs/EVO-BLUEPRINT.md:1089:  IDENTITY `28002dfc…`). The assessment's frame: FIFA's realism is
docs/EVO-BLUEPRINT.md:1096:  in stance, which is what a real stride is), plus per-pose knees:
docs/EVO-BLUEPRINT.md:1111:  dx, dz)` pure (model-local lateral sign), frozen at kick start;
docs/EVO-BLUEPRINT.md:1122:  ball-side slot in model space across yaws; `bankFor`
docs/EVO-BLUEPRINT.md:1131:  BULGE — the goal's back net panel is now subdivided (18×9 segments,
docs/EVO-BLUEPRINT.md:1133:  it OUTWARD at the ball's actual impact point when a goal fires: a
docs/EVO-BLUEPRINT.md:1138:  Wired in the same `onGoal` hook (the goal event fires while the
docs/EVO-BLUEPRINT.md:1141:  phases 69/70 gave chips/switches/through-balls real Magnus
docs/EVO-BLUEPRINT.md:1147:  flight (the sim's `spin` is the PATH's turn rate; the real ball
docs/EVO-BLUEPRINT.md:1164:  goal line (he must never be in the goalmouth picture). He runs the
docs/EVO-BLUEPRINT.md:1178:  in-bounds patrol, moves-with-play, and the call arm on a real
docs/EVO-BLUEPRINT.md:1180:  shipped in one session (73 the runner's body, 74 the goal & the
docs/EVO-BLUEPRINT.md:1187:  mini formation map's border+shadow shell sat in the corner of
docs/EVO-BLUEPRINT.md:1233:  real one and it's the whole point: `linesmanTargetX(end, defLineX,
docs/EVO-BLUEPRINT.md:1237:  BALL when it's nearer the goal line, clamped between halfway and
docs/EVO-BLUEPRINT.md:1238:  the goal line — so in every camera, not just the tacfeed, there is
docs/EVO-BLUEPRINT.md:1247:  line/ball/halfway/goal-line clamps); 3D suite +3, ALL observed
docs/EVO-BLUEPRINT.md:1248:  live including a real offside flag in the poll window. One
docs/EVO-BLUEPRINT.md:1251:  wrong, the model was right; measure against constants, not
docs/EVO-BLUEPRINT.md:1275:  (offside-trap squeeze, made honest by phase-71's goal-kick law).
docs/EVO-BLUEPRINT.md:1281:  evolution-time mutation rolls moved). Standing watch: does 991's
docs/EVO-BLUEPRINT.md:1284:  the 17th gene; sim change, fingerprint REBASELINED `c8d81a2e…`).
docs/EVO-BLUEPRINT.md:1298:  (twice this session) — the goals-band watch ESCALATES (~3.2 vs the
docs/EVO-BLUEPRINT.md:1306:  N6 gene is live and ecology-dependent. ② shape-emergence to gen
docs/EVO-BLUEPRINT.md:1311:  personality, the old low-32 story transposed). ③ goals band:
docs/EVO-BLUEPRINT.md:1313:  sampling variance + a SEASON-COUNT effect (goals warm as
docs/EVO-BLUEPRINT.md:1315:  the ~2.8 standing watch is unchanged, verdict = the user's feel.
docs/EVO-BLUEPRINT.md:1316:- ⚠⚠ **phase-82 SHIPPED** (**GOAL INFLATION** — `goals-warming.ts`,
docs/EVO-BLUEPRINT.md:1320:  saw it. Diagnosis: attributes HOLD under the budget (defending
docs/EVO-BLUEPRINT.md:1321:  even rises) — the mover is the tactical-gene meta: league-wide
docs/EVO-BLUEPRINT.md:1324:  pitches both ways = chance quality soars = goals inflate as an
docs/EVO-BLUEPRINT.md:1332:  was real: line height was formationDepth's alone, so 0.88-press
docs/EVO-BLUEPRINT.md:1333:  couch-defending paid turnovers at zero space-behind risk; now the
docs/EVO-BLUEPRINT.md:1336:  But late-gen goals still 5.3-6.5: the press meta was a passenger.
docs/EVO-BLUEPRINT.md:1338:  (shootBias →0.12-0.33) while goals double — round 2 must split
docs/EVO-BLUEPRINT.md:1339:  VOLUME vs CONVERSION (shots + xG through the generations) before
docs/EVO-BLUEPRINT.md:1345:  58-77% by gen 22-24 (real ~10-12%). Evolution both manufactures
docs/EVO-BLUEPRINT.md:1346:  sitters and finds contexts the xG model underprices; defense has
docs/EVO-BLUEPRINT.md:1354:  touchpoints real (defender-quality-scaled shot pressure, ×1.0 at
docs/EVO-BLUEPRINT.md:1357:  conv 55-69%). The finding: the meta's sitters are pressure≈0 BY
docs/EVO-BLUEPRINT.md:1359:  a pressure-scaled gradient multiplies zero on exactly the
docs/EVO-BLUEPRINT.md:1361:  concede the situation. Next: shot-context telemetry (pressure/
docs/EVO-BLUEPRINT.md:1362:  oneVone/assist kind on shotLog), split late-gen goals by
docs/EVO-BLUEPRINT.md:1364:  (interception × defending, recovery races, box marking).
docs/EVO-BLUEPRINT.md:1366:  fingerprint IDENTITY `0c550c20…`). 1524 late-gen goals split:
docs/EVO-BLUEPRINT.md:1368:  mean pressure 0.61 — the inflation pipe is CARRIERS BEATING THE
docs/EVO-BLUEPRINT.md:1370:  "pressure≈0" model was wrong: pressers exist but chase from
docs/EVO-BLUEPRINT.md:1372:  jockey/standoff (Van Dijk) FIRST — staying goal-side kills the
docs/EVO-BLUEPRINT.md:1374:  last (dribbles have no offside). Design for 87: jockeyBias gene —
docs/EVO-BLUEPRINT.md:1375:  the goal-side contain man holds the carrier-goal segment at
docs/EVO-BLUEPRINT.md:1377:  touch; costs = carrier gets time/space to pass or shoot from
docs/EVO-BLUEPRINT.md:1381:  systems: goal-side standoff targeting in ChaseBall (kills the
docs/EVO-BLUEPRINT.md:1385:  goals 6.4/6.4/5.6 → 4.46/4.44/5.95. Remaining gap to the 2.8-3.3
docs/EVO-BLUEPRINT.md:1390:  sweeper/stopper axis genetifies the phase-31 rest-defense hardcode
docs/EVO-BLUEPRINT.md:1392:  two worlds that ABANDON jockey (0.16/0.20 → goals 5.8/6.7) while
docs/EVO-BLUEPRINT.md:1393:  777 keeps it (0.74 → 4.40). High-jockey ⟺ low-goals across worlds
docs/EVO-BLUEPRINT.md:1415:  loop on fast carries, and stage-aware silence (screens/ceremony
docs/EVO-BLUEPRINT.md:1425:  behind also take the goal-side detour (free escort — only the
docs/EVO-BLUEPRINT.md:1426:  contain man should jockey), and the delay never ENDS (real
docs/EVO-BLUEPRINT.md:1436:  defend like him: the def+jockey package is the strategy space).
docs/EVO-BLUEPRINT.md:1445:  gift at 0.9+, panic at 0.2) — composure is a budget line, not a
docs/EVO-BLUEPRINT.md:1446:  flag. Composed-1v1 goal share 78/82% → 75/73%; warming late means
docs/EVO-BLUEPRINT.md:1451:  edge — watch, not chase). Throw seeds re-anchored 24/42/44 (6th).
docs/EVO-BLUEPRINT.md:1457:  budget-clamped; founders/fitness pure. Mechanism VERIFIED (def
docs/EVO-BLUEPRINT.md:1461:  longer converts freely, so goal-side standoff pays less. The
docs/EVO-BLUEPRINT.md:1471:  shipped at 0.05. The 3-world verdict then refuted generality:
docs/EVO-BLUEPRINT.md:1482:  the game (attract mode beneath); 120BPM-pulsed grid/sun/stars;
docs/EVO-BLUEPRINT.md:1493:- ✅ **phase-98 SHIPPED** (**keeper distribution genetified**;
docs/EVO-BLUEPRINT.md:1496:  window, PUNT=closed outlets+low build-up genes with strength
docs/EVO-BLUEPRINT.md:1498:  gene-blind dead wire (83% everywhere) until school-scaled. Four
docs/EVO-BLUEPRINT.md:1511:  goal — nothing stolen); 0.38/match (posts 4:1 bars); rebound
docs/EVO-BLUEPRINT.md:1517:  the goal-side boundary (enter >0.6, hold to <0.1): vs-carrier
docs/EVO-BLUEPRINT.md:1523:  correct pricing. The defensive-school arc's real fork: reprice
docs/EVO-BLUEPRINT.md:1526:- ✅ **phase-102 SHIPPED** (**anchor killed, λ=0** — user decision #1;
docs/EVO-BLUEPRINT.md:1538:  model's missing physics: saveP × (1+closeIn·0.9) frozen at strike,
docs/EVO-BLUEPRINT.md:1541:  always had tryTackles feet), race read + interception range kept.
docs/EVO-BLUEPRINT.md:1561:- ✅⭐ **phase-112 SHIPPED** (**the TRANSITION-PRESS gene** —
docs/EVO-BLUEPRINT.md:1562:  `transitionPress`, the 23rd gene, save v27; the counter-defense
docs/EVO-BLUEPRINT.md:1566:  pure side effect of steady-state pressIntensity — the gene decouples
docs/EVO-BLUEPRINT.md:1571:  a real no-dominant-side tradeoff — gegen concedes launches off 8.2%
docs/EVO-BLUEPRINT.md:1573:  0.185 vs 0.159, goals near-parity 147/151. Adoption near-neutral
docs/EVO-BLUEPRINT.md:1580:  audit + counter-defense conversation): ~~112 transition-press gene~~
docs/EVO-BLUEPRINT.md:1581:  (SHIPPED, above) → 113 goal-channel viz
docs/EVO-BLUEPRINT.md:1583:  budget viz done right + trap-school feed credit → 116 Evolution
docs/EVO-BLUEPRINT.md:1584:  Center enrichment (formation/style/appetite HISTORY — how identities
docs/EVO-BLUEPRINT.md:1591:  upset-weighted, mean-reverting team confidence + the 22nd gene
docs/EVO-BLUEPRINT.md:1593:  extremes; +11% goals hot-vs-cold at max spread). Adoption: one world
docs/EVO-BLUEPRINT.md:1601:  band, low win / high foul / real cards, box ⇒ penalty). **The arc's
docs/EVO-BLUEPRINT.md:1604:  109 watch resolves.** Fingerprint `af7ea229…`; full entry at ROADMAP
docs/EVO-BLUEPRINT.md:1606:- ✅⚠ **phase-109 SHIPPED** (**the OFFSIDE-TRAP gene** — trapBias, the
docs/EVO-BLUEPRINT.md:1607:  21st gene, save v25; defensive school #3 complete, ALL the user's
docs/EVO-BLUEPRINT.md:1609:  holds his shape line vs off-ball runners, gated outside the −17
docs/EVO-BLUEPRINT.md:1611:  goals 137-143 (real trade). Adoption 24×3: 991 → 0.74 (the trap
docs/EVO-BLUEPRINT.md:1614:  are goal kicks); two perception-lag fixes built on it were measured
docs/EVO-BLUEPRINT.md:1615:  out and reverted; the ungated build railed to 0.08 + 8.5 goals/match
docs/EVO-BLUEPRINT.md:1616:  (box abandonment) before the gate. ⚠ watches: warming 17.71 (spread
docs/EVO-BLUEPRINT.md:1625:  one generic `entityLinks.ts` scanner + `GameApp.openClubDive/
docs/EVO-BLUEPRINT.md:1643:  60-75% of late-gen goals, 71-92% entering with the WHOLE line beaten,
docs/EVO-BLUEPRINT.md:1650:  0.5-0.9, goals overperform xG 2.2×; the governing margin is launch
docs/EVO-BLUEPRINT.md:1657:  自走"): the remaining distance to the vision concentrates in ①the
docs/EVO-BLUEPRINT.md:1659:  still 48-60%), ②N5 formation library (the last big queue item),
docs/EVO-BLUEPRINT.md:1660:  ③entity links, ④the offside-trap gene (school #1, last unbuilt),
docs/EVO-BLUEPRINT.md:1673:  fails (modest λ, swept, tradeoff documented). Also ratified:
docs/EVO-BLUEPRINT.md:1678:- ⭐ **2026-07-18 THE 113 LEDGER (goal channels player-facing) — an
docs/EVO-BLUEPRINT.md:1680:  anatomy moved in-engine (seven exclusive per-goal channels, zero
docs/EVO-BLUEPRINT.md:1682:  mix: carry 47-55% of ALL goals, setpiece 17-19%, walkin 11-15%,
docs/EVO-BLUEPRINT.md:1690:  attacking school re-evolves; watch `through` in the census.
docs/EVO-BLUEPRINT.md:1696:  floor at bank time). NO new gene — the admission test is satisfied
docs/EVO-BLUEPRINT.md:1699:  phase-61 XI-vs-bench budget split gains survival value, and the foul
docs/EVO-BLUEPRINT.md:1700:  economy gains a real cost WITHOUT a reward channel (injury is a side
docs/EVO-BLUEPRINT.md:1702:  call ③). Census: 1.27/1.28 per club-season, economy intact, goals
docs/EVO-BLUEPRINT.md:1708:  measured pass execution never priced out (completion/interception
docs/EVO-BLUEPRINT.md:1710:  conv 29%→56-67%, 89% of late goals unassisted, passing died of
docs/EVO-BLUEPRINT.md:1722:  REAL market goods — goals 3.31/2.89, **424242 flipped to
docs/EVO-BLUEPRINT.md:1728:  bends match-day genes, trust = an evolved gene; then the clash
docs/EVO-BLUEPRINT.md:1731:  defensive gene-bend — ATTEMPTED, A/B-REFUTED, REVERTED)**: built
docs/EVO-BLUEPRINT.md:1737:  toggle, same seeds, 22 gens) REFUTED the lever: goals INFLATED
docs/EVO-BLUEPRINT.md:1740:  net-tightening retune still failed. **The lesson (a real substrate
docs/EVO-BLUEPRINT.md:1742:  already isolated with space, and no defensive pre-kickoff gene-bend
docs/EVO-BLUEPRINT.md:1749:  `848370ae` untouched); the emergence-memo trap (a hand-set bias
docs/EVO-BLUEPRINT.md:1767:  space makes beating one man a through-ball, so any space/separation
docs/EVO-BLUEPRINT.md:1775:  2过1) but is throttled (gene-gated + the same off-ball wall on the
docs/EVO-BLUEPRINT.md:1776:  burst; 89% of goals unassisted). The realistic 119d target is thus
docs/EVO-BLUEPRINT.md:1786:  dribble-beat**. So the "carry monoculture" is really a
docs/EVO-BLUEPRINT.md:1788:  small-sided — futsal is transition-goal-heavy); clean 1v1 dribbling
docs/EVO-BLUEPRINT.md:1789:  is the minority. COVER at formation: ~2.0-2.2 defenders are
docs/EVO-BLUEPRINT.md:1791:  they're just not positioned goal-side as a SPARE (the breakaway forms
docs/EVO-BLUEPRINT.md:1793:  first ASYMMETRIC lever in six attempts (119c defensive gene-bend +
docs/EVO-BLUEPRINT.md:1794:  four 119d-1 supply cuts all failed because they added space, which
docs/EVO-BLUEPRINT.md:1795:  helps the carry ≥ passing): a COVER/sweeper (the `coverBias` gene,
docs/EVO-BLUEPRINT.md:1800:  the failed space-adders. Candidate for the real 119d; probe-first +
docs/EVO-BLUEPRINT.md:1801:  A/B (goals floor + gene-drain watch — a permanent sweeper could
docs/EVO-BLUEPRINT.md:1806:  outcomes emerge — pointed at the 40%/33% of 1v1 GOALS the keeper
docs/EVO-BLUEPRINT.md:1809:  clean 1v1 to narrow the target, gene-priced, chip as the counter).
docs/EVO-BLUEPRINT.md:1810:  A/B REFUTED it — untouchable% went UP (25→29 / 17→25), goals UP
docs/EVO-BLUEPRINT.md:1818:  it's LOCKED: (1) 6v6 space (beat/win one man = through — only ~2
docs/EVO-BLUEPRINT.md:1823:  setpiece-mixed) with near-realistic 1v1 conv (45-55%). CONCLUSION:
docs/EVO-BLUEPRINT.md:1834:  hold-your-formation-zone (shape, not clumps). Tested lifting the
docs/EVO-BLUEPRINT.md:1839:    mutation) → zonal 3/16 both (did not spread); goals 3.63→4.18 and
docs/EVO-BLUEPRINT.md:1842:  off, zonal did not gain share and goals rose. `breakaway-origin.ts`
docs/EVO-BLUEPRINT.md:1843:  kept its zonal/goals readout. (Interpretation left to the next
docs/EVO-BLUEPRINT.md:1851:  goals scramble-preceded**. Shape HELD during episodes → the 人堆
docs/EVO-BLUEPRINT.md:1860:  own-goal→ball ray bent toward the near touchline, ±69° noise);
docs/EVO-BLUEPRINT.md:1861:  the slide keeps pure momentum physics. Two models were refuted en
docs/EVO-BLUEPRINT.md:1866:  deliberately-high defend-shape ST — goals-warming re-inflated
docs/EVO-BLUEPRINT.md:1870:  direction that passes the scramble gate and the goals gate at
docs/EVO-BLUEPRINT.md:1872:  frozen), goals-warming 11.48 ≈ the arc low, calibrate at noise,
docs/EVO-BLUEPRINT.md:1874:  `5c6226fa…`. Scramble-goal SHARE is unmoved (21-24%) — the payoff
docs/EVO-BLUEPRINT.md:1878:  119f-spill NO-FIX).** `keeper-release.ts`: goal kicks (from the feet)
docs/EVO-BLUEPRINT.md:1879:  already run the lane-aware pass loop; the HANDS throw picked its
docs/EVO-BLUEPRINT.md:1887:  90% hard receptions (48-57% heavy pressure, 36-39% blind-side,
docs/EVO-BLUEPRINT.md:1892:  scheme" (the emergence-honest 乱抢 payoff route; user: "让防守自己
docs/EVO-BLUEPRINT.md:1896:  4.7-4.9 shots / 2.0-2.4 goals conceded, zonal 4.0-5.5 / 1.4-2.0,
docs/EVO-BLUEPRINT.md:1901:  cover behind (= the emergent kill of the 乱抢 free-1v1). ⭐ ROOT
docs/EVO-BLUEPRINT.md:1907:  AGGRESSIVE-ZONAL quadrant (the modern zonal press: shape + ball-
docs/EVO-BLUEPRINT.md:1908:  winning) UNREACHABLE. So the emergence-honest fix is to DECOUPLE
docs/EVO-BLUEPRINT.md:1909:  scheme into its own free gene and let all four {man,zonal}×
docs/EVO-BLUEPRINT.md:1912:  subsumes). Probe-first (quadrant balance) → decouple gene → A/B +
docs/EVO-BLUEPRINT.md:1913:  goals-floor + diversity watch; structural fallback if goals collapse
docs/EVO-BLUEPRINT.md:1924:  a DEFENSIVE MONOCULTURE, goals crushed to ~0.67 — the exact collapse
docs/EVO-BLUEPRINT.md:1946:  pressure. Fix tried: B lays a FIRST-TIME return (a boosted through-ball
docs/EVO-BLUEPRINT.md:1948:  return-played 4%→33%, aggressive-press GA 0.67→0.93. But BOTH real
docs/EVO-BLUEPRINT.md:1951:  6%, assists 3%); (2) it INFLATES goals-warming to 15.25 vs 11.54
docs/EVO-BLUEPRINT.md:1956:  old genes carrying the appetite. The bottleneck is RETURN QUALITY —
docs/EVO-BLUEPRINT.md:1959:  attr. So the seven's real enabler may be the positioning ATTRIBUTE
docs/EVO-BLUEPRINT.md:1964:  SQUAD_BUDGET 36→40.5 (9×9×0.5, density-preserving = a real trade-off,
docs/EVO-BLUEPRINT.md:1969:  under pressure (`touchFailChance` positioning term taming pressure+
docs/EVO-BLUEPRINT.md:1971:  channel: maxed BITES (spills −19%) but goal-NEUTRAL; fresh-evo selects
docs/EVO-BLUEPRINT.md:1976:  Gates: goals-warming 11.67≈11.54 (zero inflation), vitest 441 (+2
docs/EVO-BLUEPRINT.md:1982:  backlog — full entry in ROADMAP).** 8 player attrs + 23 genes vs the
docs/EVO-BLUEPRINT.md:1985:  accel-vs-topspeed+agility (→`pace`), composure/vision/first-touch
docs/EVO-BLUEPRINT.md:1988:  ⭐ POSITIONING / off-ball intelligence / anticipation (the deepest
docs/EVO-BLUEPRINT.md:1989:  gap — all positioning is team-gene + formation-table, no player-level
docs/EVO-BLUEPRINT.md:1994:  its place. Priority: scheme-gene (119h) → positioning attr → GK
docs/EVO-BLUEPRINT.md:2000:  cop-out: real 6v6 champions do NOT clump centrally (a clump is punished
docs/EVO-BLUEPRINT.md:2010:  is impotent — wide play creates ~zero goals (cross channel dead). Real
docs/EVO-BLUEPRINT.md:2014:  FIXABLE at the substrate. Fix direction (the real root, replacing all
docs/EVO-BLUEPRINT.md:2016:  reliably fail (a compact center wins the ball cleanly, as in reality) +
docs/EVO-BLUEPRINT.md:2017:  make WIDTH create real threat (so spreading pays → teams spread →
docs/EVO-BLUEPRINT.md:2018:  declump). ⚠ Mind the iron law (past width buffs added space that fed
docs/EVO-BLUEPRINT.md:2024:  + REVERTED).** The user asked whether real wide weapons (下底传中 / 45° /
docs/EVO-BLUEPRINT.md:2044:    reaches the byline 0.97s/m — but its goals are **carry 1.52 / cross
docs/EVO-BLUEPRINT.md:2045:    0.02**. So 内切 / carry-wide DO emerge; the aerial cross does not.
docs/EVO-BLUEPRINT.md:2047:    0.64 defenders per cross) — open-play box-crashing didn't exist (runners
docs/EVO-BLUEPRINT.md:2053:    but the cross STILL didn't convert (0.02 goals): even with bodies there,
docs/EVO-BLUEPRINT.md:2058:    low-percentage BY DESIGN and that's realistic — real 6v6 (small pitch,
docs/EVO-BLUEPRINT.md:2059:    small goals) is a cutback-and-combination game, not a crossing game. The
docs/EVO-BLUEPRINT.md:2060:    width weapons that DO / SHOULD emerge: **carry-wide + 内切 (already
docs/EVO-BLUEPRINT.md:2061:    emerges), the CUTBACK (倒三角, ground, to the arc arriver — the realistic
docs/EVO-BLUEPRINT.md:2062:    byline weapon, improvable), and 套边/overlap (gene exists).** Future
docs/EVO-BLUEPRINT.md:2070:  reframed the goal: the asymmetry ("中路易被夹击 / 边路有空间+人数优势") must
docs/EVO-BLUEPRINT.md:2074:  - **`pressure-by-zone.ts`**: the center/flank pressure asymmetry is WEAK and
docs/EVO-BLUEPRINT.md:2079:    user: don't mandate the collapse; it must be gene/selection-driven).
docs/EVO-BLUEPRINT.md:2081:    receptions 137 vs central 1784) and when wide is the LEAST pressured
docs/EVO-BLUEPRINT.md:2088:    goals 1.52→1.83, byline occupancy FELL 0.97→0.83, POSS stayed dead (cross
docs/EVO-BLUEPRINT.md:2091:    (6v6 space-lock — beat one man = through, no cover layer: 过一个 = 直接穿).
docs/EVO-BLUEPRINT.md:2093:    **(A) make central carrying FAIL — the emergent cover layer 过一个还有另一
docs/EVO-BLUEPRINT.md:2095:    selectable tradeoff);** and/or **(B) make the CUTBACK (ground, the realistic
docs/EVO-BLUEPRINT.md:2100:    actually FIRST. `pressure-by-zone.ts` + `reception-by-width.ts` kept as
docs/EVO-BLUEPRINT.md:2118:    BUILDUP (44) / setpiece.** Zonal converts carry-goals into worked/scramble
docs/EVO-BLUEPRINT.md:2119:    goals (buildup = the 乱抢 the user hates). So zonal stops the clean carry
docs/EVO-BLUEPRINT.md:2120:    but the ball pinballs to a scrappy goal anyway.
docs/EVO-BLUEPRINT.md:2122:    and is WORST vs ZONAL — backwards from reality.** Width is zonal's natural
docs/EVO-BLUEPRINT.md:2128:    emergent from the scheme gene. `scheme-matchup.ts` + `carry-vs-block.ts`
docs/EVO-BLUEPRINT.md:2135:  0.12 attackers vs 0.65 defenders (EMPTIER than vs man), cross→goal 0.00,
docs/EVO-BLUEPRINT.md:2140:  funnel. Also: at the byline the CROSS out-scores the CUTBACK in the utility
docs/EVO-BLUEPRINT.md:2156:  half-space run) all failed / backfired / broke tests — and the run
docs/EVO-BLUEPRINT.md:2159:  → **522 m²/player**. Real 11v11 ≈ 357 m²/player; real small-sided 6v6 ≈
docs/EVO-BLUEPRINT.md:2161:  sparser than 11v11, ~4× sparser than real 6v6. At that sparsity: beat one man
docs/EVO-BLUEPRINT.md:2164:  has no density to exploit (space is everywhere; overloads need not / can not
docs/EVO-BLUEPRINT.md:2167:  chases into the space, gets shredded.
docs/EVO-BLUEPRINT.md:2168:  - ⭐ **THE EMERGENCE-HONEST STRUCTURAL CURE: shrink the pitch toward real 6v6
docs/EVO-BLUEPRINT.md:2171:    to exploit → the WHOLE repertoire (cross/cutback/half-space/triangle) +
docs/EVO-BLUEPRINT.md:2174:    rebaselines EVERYTHING (every tuned constant, goals-warming, fingerprint)
docs/EVO-BLUEPRINT.md:2176:    carry-vs-width EV + pressure-by-zone cover) before committing.
docs/EVO-BLUEPRINT.md:2186:  box scaled, formations scaled proportionally, physics UNCHANGED): goals
docs/EVO-BLUEPRINT.md:2187:  EXPLODED (clump-vs-wide 3.02→4.33, 15.4 shots/m), the extra goals nearly all
docs/EVO-BLUEPRINT.md:2192:  tackle radius / body / header / goal — FIXED = the density lever): chaos
docs/EVO-BLUEPRINT.md:2194:  (carry-vs-block goal-side cover 0.62→1.25, central within-6m 1.53→1.97),
docs/EVO-BLUEPRINT.md:2203:  did NOT scale the goal / ball speeds / the many tuned offsets). Those
docs/EVO-BLUEPRINT.md:2206:  full goals-warming re-derive + fingerprint rebaseline — a big, staged,
docs/EVO-BLUEPRINT.md:2210:  temp edits to `constants.ts` (PITCH/BOX) + `formations.ts` (base scale) +
docs/EVO-BLUEPRINT.md:2216:  The formation is a hand-authored MENU + affine transforms → shape can't
docs/EVO-BLUEPRINT.md:2219:  the tables, VISION-gated (§2 watchability + §1 emergence + §3 realism):
docs/EVO-BLUEPRINT.md:2221:    quantified — ball-side shift weak ~2m & gene-flat (the compactness×0.25
docs/EVO-BLUEPRINT.md:2222:    drag, not a real strong side); BUS crowds own box 0.72 vs neutral 0.39
docs/EVO-BLUEPRINT.md:2225:  - **B1-a DONE — `emergentStation()` behind `process.env.EMERGENT_POS`, ships
docs/EVO-BLUEPRINT.md:2227:    dimension) + sane modifiers + a REAL gene-weighted ball-side TRANSLATION.
docs/EVO-BLUEPRINT.md:2228:    A/B: strong-side shift 2.0→3.0-3.6m + gene-differentiated (WIDE>NEUTRAL),
docs/EVO-BLUEPRINT.md:2229:    spread/spacing preserved, goals sane (clump 3.15:0.70), default-off tests
docs/EVO-BLUEPRINT.md:2230:    green. Structural swap done: shape = role-field + gene weights, not the
docs/EVO-BLUEPRINT.md:2232:    B1-b/B2) — B1-a's job was the swap + real strong side, achieved.
docs/EVO-BLUEPRINT.md:2235:  - **B2-lite DONE** (committed): threaded optional `opp` into formationSpot;
docs/EVO-BLUEPRINT.md:2236:    the defensive spine (DF/MF) tracks a line goal-side of the opponents'
docs/EVO-BLUEPRINT.md:2237:    advanced players (阵型随对面移动). Shape sane, goals sane.
docs/EVO-BLUEPRINT.md:2238:  - ⭐⭐ **B3 GATE VERDICT (2026-07-19): the field FAILS goals-warming — do NOT
docs/EVO-BLUEPRINT.md:2240:    calibrate goals 1.76→2.23 (+27%, viable); but **goals-warming inflates
docs/EVO-BLUEPRINT.md:2241:    badly — world991 late-mean 4.07→5.54, world777 4.13→5.18, generational
docs/EVO-BLUEPRINT.md:2243:    Evolution exploits the field into a goal-fest. DIAGNOSIS: overperf 2.1×
docs/EVO-BLUEPRINT.md:2244:    (goals ≫ xG) = chances too CLEAN → the B1-b anti-clump + box-relief spread
docs/EVO-BLUEPRINT.md:2245:    the defence too thin, thinning the LAST LINE near own goal, so attackers
docs/EVO-BLUEPRINT.md:2249:    anti-clump + box-relief in the defensive third / near own goal so the last
docs/EVO-BLUEPRINT.md:2250:    line stays compact and protects the goal (keep the spread in midfield /
docs/EVO-BLUEPRINT.md:2251:    attack). Re-run goals-warming; target the baseline arc (late-mean ~4).
docs/EVO-BLUEPRINT.md:2253:    (WIP, zero production impact) until it passes goals-warming. Yardsticks:
docs/EVO-BLUEPRINT.md:2254:    `goals-warming.ts` + `positioning-shape.ts` + calibrate, `EMERGENT_POS=1`.
docs/EVO-BLUEPRINT.md:2255:  - ⭐⭐ **B-continued DONE — SOLIDITY FIX PASSES goals-warming (committed).**
docs/EVO-BLUEPRINT.md:2257:    compacts goal-ward+central under threat (deny the clean chance). A/B
docs/EVO-BLUEPRINT.md:2258:    (field ON, fixed) vs baseline, same worlds: goals-warming late-means
docs/EVO-BLUEPRINT.md:2260:    TAMED — was 5.5/5.2 pre-fix), calibrate 1.92 ≈ 1.76. **The emergent field
docs/EVO-BLUEPRINT.md:2261:    now PASSES the scoring gates and is ship-viable**: field-not-menu + real
docs/EVO-BLUEPRINT.md:2263:    threat-solidity, goals healthy, still toggle-OFF.
docs/EVO-BLUEPRINT.md:2265:    to ship: flip `EMERGENT_POS` default ON + retire the formation TABLES
docs/EVO-BLUEPRINT.md:2266:    ("style" = gene weights) + remaining gates (vitest — expect fragile test
docs/EVO-BLUEPRINT.md:2276:    skill) are DIFFERENT. Measuring goals by whether ≥2 possession FLIPS
docs/EVO-BLUEPRINT.md:2277:    preceded them in 4s: **SCRAMBLE-born goals are TINY and barely move — OFF
docs/EVO-BLUEPRINT.md:2278:    2-3% → ON 5%**; 95-98% of goals are CLEAN in both. The field's carry rise
docs/EVO-BLUEPRINT.md:2281:    dribbling, which per the user is FINE (a skill). The real remaining concern
docs/EVO-BLUEPRINT.md:2284:    ⚠ Caveat: this is goal-SOURCE; the VISUAL clumping/pinball frequency (what
docs/ROADMAP.md:3:## ⭐⭐⭐⭐ THE GOLD STANDARD IS [`VISION.md`](VISION.md) (2026-07-19) — measure every decision against it
docs/ROADMAP.md:10:> (dead — never shoots/tackles) → the keeper's budget base is its OWN. Cap dropped in lockstep
docs/ROADMAP.md:12:> @8-season gate · @25-season tracks OLD within noise (goals 3.30 vs 3.19, all else ≈identical) ·
docs/ROADMAP.md:17:> 底座需要做的很好" = keep GK LIGHT ✓done, invest the real substrate work in the OUTFIELD).**
docs/ROADMAP.md:18:> ⚠️ **Sub-step 2 (vision attr) FIRST CUT = "读数精度 on PASSING" — TRIED + REVERTED (honest-revert,
docs/ROADMAP.md:19:> §2 hard gate).** Added `vision` (10th attr, budget 35.5→40.0) + wired it as a continuous
docs/ROADMAP.md:20:> lane-read multiplier replacing the binary `playmaker` ×1.15. BOTH tunings FAILED §2: goals
docs/ROADMAP.md:22:> **STRUCTURAL, not a tuning miss: passing→goals is CONVEX, so making the best passers sharper
docs/ROADMAP.md:25:> vision must be applied SYMMETRICALLY (gate the DEFENDER's interception/anticipation read too,
docs/ROADMAP.md:27:> better), OR defer vision & do `positioning`-live (sub-step 3) next.** Sub-step 3 = wire
docs/ROADMAP.md:35:PITCH_SCALE 0.70 + emergent-default are the CONFIRMED baseline now (see #1 above),
docs/ROADMAP.md:38:**Step-2 lever tried = RETIRE the in-possession width FLOOR (`formations.ts:266`,
docs/ROADMAP.md:39:`widthMul` floor 1.0 → gene-driven 0.55..1.55). REVERTED (honest-revert, §2 hard
docs/ROADMAP.md:43:  (3.9). Width finally expresses across the `attackingWidth` gene.
docs/ROADMAP.md:44:- ❌ **§2 watchability FAIL** — the SAME change congests the middle: `calibrate 8`
docs/ROADMAP.md:45:  **goals 2.00→2.26 (+13%)**, shots +11%, **headers +24%** (10.5→13.0), fouls/cards
docs/ROADMAP.md:59:  under-crashed, worst vs a packed block). `cutback-anatomy`: cutback→goal 5.3%,
docs/ROADMAP.md:60:  only 20% → shot, **35% die in flight (mostly intercepted)**, 39% of arrivals
docs/ROADMAP.md:65:  next probe-first lever (gene-gated arrival, NOT a scripted run). cf. the earlier
docs/ROADMAP.md:67:- ⭐⭐ **DESIGN + VISION UPDATED → "让球员/教练自己长眼睛" (gene-weighted SPACE-VALUE
docs/ROADMAP.md:74:  a KEY DESIGN CORRECTION.** Rewrote `supportSpot` into a gene-weighted candidate
docs/ROADMAP.md:76:  + gene/attr appetite). A/B: box-arrival did NOT emerge (`cross-anatomy` noAerial
docs/ROADMAP.md:77:  46→50% / 54→59% — box got EMPTIER), §2 regressed (`calibrate` goals 2.00→2.42 +21%,
docs/ROADMAP.md:79:  0.67→0.48). **LESSON: an openness-maximizing value field is the WRONG model for
docs/ROADMAP.md:81:  scatters supporters into empty pockets (→ emptier box, +turnovers, +goals).**
docs/ROADMAP.md:83:  space-value(openness) field ✅; (b) BOX-ARRIVAL = delivery-ANTICIPATION, NOT
docs/ROADMAP.md:85:  assignRunners` arriver → gene-scaled multi-body crash, TIMED like the corner
docs/ROADMAP.md:86:  hold→burst), the cutback-arriver mechanism generalized.** Do box-arrival (a
docs/ROADMAP.md:89:- ⭐⭐⭐ **CUT 2 (two-eye value field: space + BALL, per user "得知道空间在哪+球在哪")
docs/ROADMAP.md:92:  regressed (goals 2.00→2.41 +20%, **offsides 2.20→3.36 +50%**), width did NOT rise
docs/ROADMAP.md:95:  stays empty + structure disrupted → goals inflate via broken play.**
docs/ROADMAP.md:97:  the box fine (`cross-anatomy` BAL: noAerial **26%**, atkHeader **33%**, goal/shot
docs/ROADMAP.md:100:  LOW-EV mode vs EVERY defense (0.5–1.0) while central CARRY is HIGH-EV (2.2–3.2) —
docs/ROADMAP.md:101:  because CROSSING IS INHERENTLY LOW-YIELD (cross→goal ~5%), which is REALISTIC (real
docs/ROADMAP.md:103:  WRONG goal — unrealistic. Real width's value = STRETCH the defense to OPEN the
docs/ROADMAP.md:104:  center + let wide men CUT INSIDE into the high-EV central space (inverted winger),
docs/ROADMAP.md:105:  NOT out-cross the middle. The unrealistic thing is CENTRAL CARRY being TOO strong
docs/ROADMAP.md:107:  1–2/16 play zonal). **Two candidate realistic levers to STEER on: (A) CUT-INSIDE —
docs/ROADMAP.md:111:  accept it as the low-yield supporting weapon it realistically is.** Awaiting user steer.
docs/ROADMAP.md:113:  saved this session: calibrate goals 2.00 / cutbacks 3.69 / compl 75%; posshape
docs/ROADMAP.md:115:  20%→shot 5.3% goal; scheme-matchup W-v-Z 0.67 / W-v-M 1.02 / D-v-M 3.18 / D-v-Z 2.23.
docs/ROADMAP.md:116:- ⭐⭐⭐ **VISION §1 EXTENDED to the full perception→value→action ENGINE (user ratified
docs/ROADMAP.md:118:  体能)+**动态·预判**(对手结构=提前观察+预判);space is DERIVED; inputs feed multi-dims
docs/ROADMAP.md:119:  (space/threat/receive/goal); **eye-QUALITY = an attribute** (长眼睛本身分化). Honest cost
docs/ROADMAP.md:122:- ⭐⭐⭐ **ATTRIBUTE AUDIT (the engine's INPUTS; ATTR_KEYS ×9, budget SQUAD_BUDGET 40.5):
docs/ROADMAP.md:123:  3 wasteful + 1 missing + 3 attr-blind.** DEAD/WEAK (eat budget, ~no effect): **`reflexes`
docs/ROADMAP.md:130:  and **perception = PERFECT full-field for ALL — NO vision/awareness attr** (only the
docs/ROADMAP.md:131:  `playmaker` trait) = the biggest gap + exactly the "eye-quality" the eyes model needs.
docs/ROADMAP.md:132:  Gaps ranked: vision/awareness(1) · agility/turn(2) · positioning-made-live(3, fix-not-add) ·
docs/ROADMAP.md:134:  weak-foot(10, needs NEW mechanics). → **engine-input cleanup = reclaim reflexes budget +
docs/ROADMAP.md:135:  add `vision` (eye-quality) + wire `positioning` live; genome change = save-ver bump +
docs/ROADMAP.md:142:candidate (pitch scale 0.70 + emergent positioning DEFAULT — see the block
docs/ROADMAP.md:151:判决: "观赏性我觉得没问题,可以go,你自走吧" (watchability is fine → GO; self-drive).
docs/ROADMAP.md:152:PITCH_SCALE 0.70 + emergent positioning DEFAULT are now the confirmed baseline,
docs/ROADMAP.md:153:not a candidate. Data said GO (cutbacks +235%, scramble-born goals flat 4–7% to
docs/ROADMAP.md:154:0.70, goal inflation DOWN) and the user's eyes agree on VISION §2. Sequence
docs/ROADMAP.md:159:complete than a "missing systems" story — most of real football's repertoire
docs/ROADMAP.md:160:already EXISTS and is gene/attr-driven** (shooting: long/chip/header · dribbling:
docs/ROADMAP.md:163:drop). So the distance to real football / VISION §3 is mostly EXECUTION QUALITY
docs/ROADMAP.md:165:- **QUALITY gaps (why it still "looks not-real"):** ① combos unreliable — 二过一/
docs/ROADMAP.md:172:  sprint lever (obs5). ④ goal-kick pinball (obs2), keeper throw too flat (hits
docs/ROADMAP.md:177:  (内切 — dribble only goes down the line), volley, underlap; + decision richness
docs/ROADMAP.md:184:  offside→goal-kick, no indirect FK.
docs/ROADMAP.md:186:**SELF-DRIVE SEQUENCE (one lever · probe-first · A/B · emergence, VISION is the
docs/ROADMAP.md:190:3. **QUALITY CLUSTER (the biggest step to "looks real"):** combo reliability
docs/ROADMAP.md:195:   goal-kick targeting.
docs/ROADMAP.md:203:reverts: (A) space/density + (B) emergent positioning. This phase does BOTH,
docs/ROADMAP.md:205:- **Probe** (`scripts/probes/density-probe.ts`, scale-invariant, goal scaled with
docs/ROADMAP.md:206:  pitch): swept PITCH_SCALE 1.0→0.55 with emergent ON. Clean gradient — cutbacks
docs/ROADMAP.md:208:  proportional clumping DOWN, scramble-born goals flat 4–7% until 0.55 where it
docs/ROADMAP.md:211:  fix was scaling the clump radius + the goal).
docs/ROADMAP.md:214:  fixed); **emergent positioning is now the DEFAULT** (`formations.ts`
docs/ROADMAP.md:215:  emergentPosOn()→true; fixed tables scaled by PITCH_SCALE for the legacy path +
docs/ROADMAP.md:218:  new default: **calibrate cutbacks 1.10→3.69 (+235%)**, completion 75%, goals 2.00,
docs/ROADMAP.md:219:  balanced; **goals-warming late-mean 4.35 avg (DOWN from the old pitch's 5.07 —
docs/ROADMAP.md:221:- ⚠ **NOT yet the final verdict:** VISION §2 watchability is the USER'S eyes
docs/ROADMAP.md:223:  tactics legible? goals 2.00 is a touch low (small goal) — nudge goal scale up if
docs/ROADMAP.md:226:- **Dribble philosophy DECIDED: 忠于脚 (real touch cadence, sim-level)** — queued
docs/ROADMAP.md:233:on Pages **with the emergent field ON** and reported 8 observations + 3 keeper
docs/ROADMAP.md:240:  A/B: recollect 80.4→82.4%, poke 13.6→12.8%, goals calib-8 2.40→2.26,
docs/ROADMAP.md:243:- **keeper catch-lurch** (render): model was planted at the dive-START spot
docs/ROADMAP.md:257:   fixtures, hides on ▶); each side now LEADS with the emergent nameplate
docs/ROADMAP.md:258:   identity (z-score, not imposed) + draws the evolved formation SHAPE via
docs/ROADMAP.md:259:   `formationDiagram` (atk+def); formation slug demoted to the diagram caption.
docs/ROADMAP.md:263:   (blocking), that's the follow-up. Emergent shape (emergentStation) has no
docs/ROADMAP.md:265:   TRUE emergent shape needs a live-Team/Ball sample (future).
docs/ROADMAP.md:271:     softened sub-5m pass power (`×0.65+d·0.07`). A/B: calibrate-8 goals
docs/ROADMAP.md:275:     the combo lever — cutbacks fell, no combo lift, unintended goal inflation.
docs/ROADMAP.md:278:     defect + obs7 check-to-ball, NOT isolated pass execution. The real lever is
docs/ROADMAP.md:280:     per the emergence memory), not a pass-power tweak. ← DEEP substrate, user
docs/ROADMAP.md:282:   - **obs7 迎球接球**: reactive meet-the-pass EXISTS (interceptBall); missing =
docs/ROADMAP.md:287:   - **obs6 CBs clump on goal kick** (field WAS ON): emergent B1-b anti-clump too
docs/ROADMAP.md:288:     weak in the deep-central goal-kick band → strengthen repulsion there.
docs/ROADMAP.md:289:   - **obs2 goal-kick pinball**: hoof = upfield+random, no target/min-dist;
docs/ROADMAP.md:290:     ground goal-kick has only a soft d<5 penalty and laneOpenness ignores
docs/ROADMAP.md:293:   is locked to the goal band — hook a short walk-out target).
docs/ROADMAP.md:296:The user extended the emergence pivot into a full four-stage vision (Engine →
docs/ROADMAP.md:302:(套路 → policy genes, save v13, coherence baseline) + ✅ **phase-46**
docs/ROADMAP.md:303:(keeper-aware carry cone: maxed-genome keeper-collects 9%→5%, shots 39%→43%) +
docs/ROADMAP.md:308:stars-vs-balanced emerges, strength/stamina finally have a PRICE; defending repriced
docs/ROADMAP.md:310:(visibility v1: data-driven NAMEPLATES, the style-space map + divergence
docs/ROADMAP.md:311:curve + budget heatmap) + ✅ **phase-50 SHIPPED** (results-dominant fitness —
docs/ROADMAP.md:313:was already met post-budget, remaining speed levers PARKED). **STAGE 1+2 COMPLETE** +
docs/ROADMAP.md:316:wall; league screen back to pure data) + 51.1 (four style-space lenses) +
docs/ROADMAP.md:328:wire; badges-of-genes traits 🎲🪄👻, earned personal nameplates, career
docs/ROADMAP.md:331:signed only at retirement vacancies under the budget; feeds the
docs/ROADMAP.md:336:96-player style-space map with role lenses, the player deep dive with
docs/ROADMAP.md:349:matrix cycles still 0 — meta rotated to runners+compact-block; vitest
docs/ROADMAP.md:370:a shallower XI; dead-ball subs driven by the new `rotationBias` gene
docs/ROADMAP.md:373:sub's goals land on HIS career; save v18. Probe: the trigger binds
docs/ROADMAP.md:375:full carousel (gene .465→.886, 1.46 subs/team/match) while world 991
docs/ROADMAP.md:378:goals watch RESOLVES**. ⚠ Matrix gate RE-BASED (new founding worlds):
docs/ROADMAP.md:381:REBASELINED `9357f90a…`; ARCHITECTURE failure mode 27 added — the
docs/ROADMAP.md:391:re-rolled ecology, watch not chase. **The N1.5 close attempt FAILED:
docs/ROADMAP.md:394:⭐ 2026-07-16 the user REFRAMED N1.5 from real leagues ("为什么英超有
docs/ROADMAP.md:410:save v20: the `underdogShift` gene bends an outgunned side toward the
docs/ROADMAP.md:413:realistic deficit; the bus is finally what weak teams DO, not a fixed
docs/ROADMAP.md:417:formations to low-32 15/16, zonal extinct — the shift may crowd the
docs/ROADMAP.md:418:def-formation menu.)
docs/ROADMAP.md:429:the game-state response becomes the PERSON's. The `tinkerBias` gene
docs/ROADMAP.md:438:side's goals; render-only, raycast-safe). Probes: mechanism
docs/ROADMAP.md:447:shows the dial ADDS late goals — new-gene founding re-roll, watch
docs/ROADMAP.md:454:by `mentalityOf` at his own gene) while the stoic stands arms-crossed
docs/ROADMAP.md:458:full jumping eruption on goals (~2.6s decay, per-seat beats). visual
docs/ROADMAP.md:463:every frame, so a defender shadowing on the goal axis flipped it every
docs/ROADMAP.md:468:a decisively parked blocker flips it — a real cut). Pirouettes
docs/ROADMAP.md:470:much (3-seed paired calibrate +0.74 goals; evo-drift width re-collapsed
docs/ROADMAP.md:482:stronger carriers make deep blocks pay; N5's problem) and the goals
docs/ROADMAP.md:506:and the goals band (~2.7 mean, 2.06-3.26 spread) ≈ real-league
docs/ROADMAP.md:515:is in Press mode; (3) the live mini formation map: a broadcast inset
docs/ROADMAP.md:519:`RenderState` carries possession/modes/press (old replays degrade
docs/ROADMAP.md:536:real gap behind (along ≤ d−5.5), genuinely CAUGHT OUT (≥7.5m off his
docs/ROADMAP.md:537:goal center — the first cut fired 3.9/match at routine KA-0.5
docs/ROADMAP.md:539:beat the ground strike (q·1.2+0.03). Counters all emergent: in-face
docs/ROADMAP.md:543:league-average per shot; in-league volume 0.5-1.0/match, chip goals
docs/ROADMAP.md:565:and the formations contract inverted; through-ball + aerial curves
docs/ROADMAP.md:578:+ ✅ **phase-71 SHIPPED** (**goal-kick OFFSIDE + the line-holding
docs/ROADMAP.md:580:ruling "门将开大脚应该有越位". Probed first: the real-law goal-kick
docs/ROADMAP.md:581:exemption + the brain's exemption-aware targeting made cherry-picking
docs/ROADMAP.md:582:LEGAL — 19% of goal kicks had an attacker camped within 12m of the
docs/ROADMAP.md:583:opponent's goal, 37% beyond the line, and the timeout punt targeted
docs/ROADMAP.md:585:user-ratified — goal kicks now play under normal offside (same family
docs/ROADMAP.md:586:as the offside→goal-kick restart simplification; kick-ins keep the
docs/ROADMAP.md:587:real throw-in exemption, corners are geometrically exempt); (2)
docs/ROADMAP.md:588:strikers HOLD THE LINE during their own goal-kick setup (the restart
docs/ROADMAP.md:591:(37%), punts at stranded men 0 (12), goalmouth camping 19%→2.7%
docs/ROADMAP.md:597:"看不懂" verdict on the always-on layer + the real-tactical-cam
docs/ROADMAP.md:599:everyone in frame — the UEFA lesson that shapes carry the information)
docs/ROADMAP.md:600:REPLACES the behind-goal button (behindGoal survives for replay
docs/ROADMAP.md:607:The 📡 checkbox dies (the camera IS the toggle); the mini formation
docs/ROADMAP.md:613:distance between our runners and real ones. KNEES (shared geo
docs/ROADMAP.md:616:stays near-straight — real gait — with per-pose overrides for kick /
docs/ROADMAP.md:639:impact point on goals (gaussian falloff σ=1.1m around impact, damped
docs/ROADMAP.md:641:layered on the existing whole-net shake — the iconic goal read; (2)
docs/ROADMAP.md:651:is a real match" presence: a black-kit yellow-collar figure whose
docs/ROADMAP.md:654:play, 7m adjudicating stand-off, never inside 6m of a goal line —
docs/ROADMAP.md:655:the sim knows nothing about him); he runs a real gait (distance-
docs/ROADMAP.md:665:(patrols in bounds, moves with play, call arm raised on a real
docs/ROADMAP.md:670:formation map NEVER actually hid — `#stage canvas` (ID specificity
docs/ROADMAP.md:694:under pressure, eased 7/s and snapping back the instant it's loose:
docs/ROADMAP.md:705:it's nearer the goal line, clamped halfway↔goal-line — so their
docs/ROADMAP.md:714:OBSERVED live on a real offside); fingerprint IDENTITY `28002dfc…`.
docs/ROADMAP.md:716:real pitch is 58 wide (HALF_W=29) — the check was wrong, not the
docs/ROADMAP.md:717:model.)
docs/ROADMAP.md:733:event→sample map (shot=kick, goal=net+celebration, save=glove+
docs/ROADMAP.md:734:applause, foul=real whistle, interception=touch), ±4% rate jitter
docs/ROADMAP.md:752:formation mutation was a BINARY low-32↔press-23 toggle, so world
docs/ROADMAP.md:761:press — honest only since phase-71's goal-kick offside law).
docs/ROADMAP.md:762:OBSERVED (shape-emergence probe, now printing def ids): world 991
docs/ROADMAP.md:773:each club's board carries `fitBias` (17th gene, GENE_KEYS
docs/ROADMAP.md:779:Eligibility gates (beats academy, fits budget) unchanged — only the
docs/ROADMAP.md:781:tags 'System signings'/'Galactico board'; gene labels in
docs/ROADMAP.md:787:Calibrate 3.32/3.29/2.98 (mean 3.20 — the new founder gene
docs/ROADMAP.md:797:[0.00..0.56]); signings stay healthy (~1-1.5/season) — the gene is
docs/ROADMAP.md:804:16/0 low-32), the menu is no longer the bottleneck. ③ the goals
docs/ROADMAP.md:807:3.3 at 8 seasons vs 2.5 at 4: goals warm as ecologies evolve — a
docs/ROADMAP.md:809:standing ~2.8-vs-contract-2.3-2.6 watch stands as before, verdict
docs/ROADMAP.md:812:`goals-warming.ts` probe, observation-only: goals/match climb
docs/ROADMAP.md:816:DIAGNOSIS (attr+gene means at gen 0/12/23): NOT an attribute arms
docs/ROADMAP.md:817:race — defending/reflexes HOLD or rise under the budget, finishing
docs/ROADMAP.md:822:quality soars, and goals inflate as the equilibrium's side effect.
docs/ROADMAP.md:831:sufficient**: line height was `formationDepth`'s alone, fully
docs/ROADMAP.md:834:block steps up with the press gene (outfielders, defending phase,
docs/ROADMAP.md:836:the line the press exposes — the real-football tradeoff restored.
docs/ROADMAP.md:838:✓ the gradient works) BUT goals still inflate (late means 5.3-6.5,
docs/ROADMAP.md:841:pace drifts up. Next diagnostic cut: late-gen goals BY VOLUME vs
docs/ROADMAP.md:847:goals-warming now splits the economy per season: shots barely move
docs/ROADMAP.md:850:convert 58-77% of ALL shots (real football: 10-12%, 1v1s ~40%).
docs/ROADMAP.md:852:and (b) finds shot CONTEXTS the xG model underprices where the
docs/ROADMAP.md:858:direct anti-conversion channel (read tryShot first: the pressure
docs/ROADMAP.md:861:(chip/cutback/through-1v1 share of late-gen goals); ③ acceptance:
docs/ROADMAP.md:868:closing OUTFIELDER's `defending` scales the shot's felt pressure
docs/ROADMAP.md:870:preserved by construction; the xG model stays defender-blind like
docs/ROADMAP.md:871:real xG); ② the keeper's saveP collapse softened (−0.6→−0.45·xG)
docs/ROADMAP.md:876:finding): the meta's manufactured chances are pressure≈0 BY
docs/ROADMAP.md:878:shooters with no defender inside 6m, so a pressure-scaled gradient
docs/ROADMAP.md:881:situation (killer-pass interception × defending, recovery races,
docs/ROADMAP.md:883:— extend shotLog with pressure/oneVone/assist-context and split
docs/ROADMAP.md:884:late-gen goals by situation; then price the dominant situation's
docs/ROADMAP.md:889:pressure/oneVone/assist (pass launches tag `lastPassKind`; zero
docs/ROADMAP.md:890:RNG — fingerprint IDENTITY-verified `0c550c20…`). Late-gen goal
docs/ROADMAP.md:891:anatomy (gens 18-20, two worlds, 1524 goals): **85-87% assist=NONE
docs/ROADMAP.md:892:(dribble-into-shot), 76-81% composed 1v1s, mean pressure 0.61** —
docs/ROADMAP.md:893:NOT killer passes (through 3%, cutback 2%) and NOT unpressured:
docs/ROADMAP.md:894:the presser is BEHIND, nobody goal-side. The engine: the phase-41
docs/ROADMAP.md:899:counter and goes FIRST** (stay goal-side, delay, don't lunge —
docs/ROADMAP.md:900:kills the oneVone flag by simply existing goal-side); #2
docs/ROADMAP.md:903:3% through pipe). NEXT = phase-87 `jockeyBias` gene: the goal-side
docs/ROADMAP.md:904:contain man holds the carrier-goal line at standoff distance,
docs/ROADMAP.md:906:systems (goal-side presence kills 1v1 composure; no full-momentum
docs/ROADMAP.md:908:+ ✅⚠ **phase-87 SHIPPED** (**jockeyBias — the Van Dijk gene, and it
docs/ROADMAP.md:909:WORKS where 85 couldn't**: 18th gene (save v23+migration+test).
docs/ROADMAP.md:911:carrier: a jockeying team's chaser takes the carrier-goal line at
docs/ROADMAP.md:912:1.2-2.2m standoff instead of diving at the ball — a body goal-side
docs/ROADMAP.md:914:make the carrier go around; ② tryTackles: the goal-side contain
docs/ROADMAP.md:917:(low gene) keeps the old reflex. MEASURED (24-gen gate): evolution
docs/ROADMAP.md:921:buys something); late-gen goals 6.4/6.4/5.6 → **4.46/4.44/5.95**
docs/ROADMAP.md:928:+ ⚠ **phase-88 SHIPPED** (**coverBias — the sweeper gene — and a
docs/ROADMAP.md:929:hard finding**: 19th gene (save v24+migration+test), the DF slot's
docs/ROADMAP.md:933:EXACTLY (the phase-31 hardcode genetified, early-preserving by
docs/ROADMAP.md:936:0.16/0.20 in two worlds (goals re-inflate 5.8/6.7) while 777 keeps
docs/ROADMAP.md:937:jockey 0.74 (goals 4.40 ✓). Cross-world correlation high-jockey ⟺
docs/ROADMAP.md:938:low-goals VALIDATES the mechanism, but adoption is
docs/ROADMAP.md:972:them). ② the MISS: a shot that ends with neither goal nor save
docs/ROADMAP.md:997:takes the goal-side standoff point — including pursuers from
docs/ROADMAP.md:999:ball: a free escort downfield; ② the delay has no ENDGAME — real
docs/ROADMAP.md:1019:gene×attribute PACKAGE (invest defending + jockey = the Van Dijk
docs/ROADMAP.md:1020:build) is the intended strategy space. 24-GEN GATE: still fails —
docs/ROADMAP.md:1021:2/3 worlds abandon jockey (0.15/0.14, goals 6.0-6.7) while 777
docs/ROADMAP.md:1022:keeps 0.70 (goals 5.16): co-evolving the def+jockey package is a
docs/ROADMAP.md:1038:goal share 78/82% → 75/73% (anatomy re-baselined at 92-HEAD first);
docs/ROADMAP.md:1054:budget-clamped structurally by the existing intake `enforceBudget`;
docs/ROADMAP.md:1063:a 0.5-finisher's breakaway is no longer lethal, so goal-side
docs/ROADMAP.md:1067:Calibrate 2.57/2.64/3.16 (all in band — 93's default-seed watch
docs/ROADMAP.md:1074:conceded-goals anchor: an ABSOLUTE λ·GA/match term in fitness
docs/ROADMAP.md:1091:purity dent is real, the stabilization evidence is one world of
docs/ROADMAP.md:1106:dismisses to the live game (attract mode — the match was running
docs/ROADMAP.md:1117:quantified all the queue's suspects — the real mechanism is the
docs/ROADMAP.md:1138:becomes the coach's choice, all through EXISTING genes — ① the
docs/ROADMAP.md:1146:hands-Pass now school-scaled (was gene-blind and won 83%
docs/ROADMAP.md:1168:behavior the data doesn't ask for. NO sim change (the emergence
docs/ROADMAP.md:1172:runner does), not appetite. Fingerprint untouched `fa984021…`.)
docs/ROADMAP.md:1175:goal plane in the OUTER band of a post (|y| ∈ [3.5, 3.67], the
docs/ROADMAP.md:1179:Deliberately outer-half only: the inner frame edge stays a goal
docs/ROADMAP.md:1180:EXACTLY as before, so no goals are stolen and NO rng draws are
docs/ROADMAP.md:1186:real-football territory. Full wire: 'woodwork' event type → feed
docs/ROADMAP.md:1192:that moves the fork**: ① the phase-92 goal-side test was a
docs/ROADMAP.md:1195:only clearly goal-side (gap>0.6), HOLD until clearly not (<0.1) —
docs/ROADMAP.md:1210:defensive worlds stay ecology-dependent. Morning decision item #2.
docs/ROADMAP.md:1213:+ ✅ **the N6 fitBias watch CLOSES HEALTHY** (queue-tail follow-through,
docs/ROADMAP.md:1215:board-culture gene is ALIVE — 424242 drifts fit-seeking (mean
docs/ROADMAP.md:1220:(morning 2026-07-18, decision #1): `FITNESS_ANCHOR.conceded` 0.05→0 —
docs/ROADMAP.md:1229:finally has a real price tag** (user design, morning decision):
docs/ROADMAP.md:1230:the save model carried NO closing-down credit — a keeper at the
docs/ROADMAP.md:1236:counter, phase-69). Probed the whole design space first
docs/ROADMAP.md:1241:shot; gene prices the accepted margin); ② the custom out-box foot
docs/ROADMAP.md:1245:interception range extends for aggr>0.5 (the sweeper's real food).
docs/ROADMAP.md:1248:optimum (neutral 2.72 beats timid 3.27 AND sweeper 4.53) — a real
docs/ROADMAP.md:1254:watch-not-chase per the 62 precedent; warming early means
docs/ROADMAP.md:1262:concedes +0.12 — pure physics, no gene named (a flat, un-gated +0.10
docs/ROADMAP.md:1285:0.85→0.66, disappointment 0.6→0.45), goal accents −28 (net 1.6), touch
docs/ROADMAP.md:1306:longer exists). One generic mechanism instead of per-surface rebuilds:
docs/ROADMAP.md:1330:**Verdicts**: playability PASSES for both (real attacks both ways over
docs/ROADMAP.md:1334:target-man realized 2 entries in the verdict worlds, overload drew a
docs/ROADMAP.md:1339:low-32 16/0, the old def watch re-fires); with 107, 424242→wide-212
docs/ROADMAP.md:1360:entry regime (goal-side bodies / breakaway), the beaten men's actions,
docs/ROADMAP.md:1362:carrier AND ball, pace ratio, lunge counter), and the save-model inputs
docs/ROADMAP.md:1364:**What it measured**: walk-ins = 60-75% of ALL late-gen goals; 71-92%
docs/ROADMAP.md:1365:of walk-in goals enter with the ENTIRE outfield line beaten (gs=0);
docs/ROADMAP.md:1366:goals are struck ~6.5m out with the keeper 3.4m off, difficulty 0.35,
docs/ROADMAP.md:1367:closeIn 0.52; breakaway-entry conversion 72-79% (real one-on-ones ~40%).
docs/ROADMAP.md:1373:dominant regime (gs=0). ③ retreat geometry — spotDist 12-14m at goal
docs/ROADMAP.md:1378:424242 conv 79→51% with the honest 1:2 saved:goal; 991 held 72%
docs/ROADMAP.md:1383:in 2-4% of breakaway goals); top-speed ratio 0.90-0.94 is STRUCTURAL
docs/ROADMAP.md:1385:**THE DIAGNOSIS (the phase's real product)**: the walk-in is not
docs/ROADMAP.md:1387:gen 23 (the gene's floor = "only tap-ins": refuse the 10-14m strike,
docs/ROADMAP.md:1388:carry to point-blank) while pressIntensity rails 0.52-0.88 and goals
docs/ROADMAP.md:1402:3.09; vitest 421; the morning decisions LANDED (anchor dead at λ=0 ·
docs/ROADMAP.md:1432:**108 — ENTITY LINKS across screens** ✅ **DONE 2026-07-18** — generic
docs/ROADMAP.md:1437:**109 — the OFFSIDE-TRAP gene** ✅⚠ **DONE 2026-07-18 — school #3
docs/ROADMAP.md:1439:gene `trapBias`: a high-trap marker refuses to be dragged deeper than
docs/ROADMAP.md:1440:his SHAPE by an off-ball runner (x holds toward the formation spot at
docs/ROADMAP.md:1448:completeness, NOT an inflation lever; the arc's real target remains
docs/ROADMAP.md:1451:GOAL KICKS, the 29.2 arcade rule). ③ Two "perception lag" fixes
docs/ROADMAP.md:1452:(runner + passer line reads) built on that false zero were MEASURED
docs/ROADMAP.md:1453:OUT by foreground stash A/B — gene-only springs BETTER (1.68 vs 1.13)
docs/ROADMAP.md:1454:than with lags (1.38/1.06; a stale read of a rising line makes runners
docs/ROADMAP.md:1457:0.08, one warming world hit 8.5 goals/match (deep runners unmarked in
docs/ROADMAP.md:1459:1.33 vs 1.03 (+29%), goals 137-143 — a real trade, no blowout.
docs/ROADMAP.md:1464:warming 17.71 (top of the recent 15.6-17.4 same-code spread — watch);
docs/ROADMAP.md:1466:(single-seed excursion; the A/B shows ~14% suppression at gene
docs/ROADMAP.md:1467:extremes; watch-not-chase per the 62/66 precedent, RE-READ next
docs/ROADMAP.md:1468:phase); fingerprint REBASELINED `dce857a3…` (21-gene rng re-rolls
docs/ROADMAP.md:1495:2.58/3.12/3.27 ALL in band — and the 109 2024-seed watch (1.96)
docs/ROADMAP.md:1502:item; the 22nd gene).** `Franchise.morale` — rolling confidence in
docs/ROADMAP.md:1505:v26 + migration test. What morale DOES is the gene's to price:
docs/ROADMAP.md:1509:spread = +11% goals, +2.3% passes — real but modest by design.
docs/ROADMAP.md:1515:⚠/2.82 (424242 over the top — re-roll watch); vitest 424 (the fx test
docs/ROADMAP.md:1522:**112 — the TRANSITION-PRESS gene** ✅ **DONE 2026-07-18 (the 23rd
docs/ROADMAP.md:1523:gene — the counter-defense audit's hole: no gene owned the first 3s
docs/ROADMAP.md:1526:(`transition-anatomy.ts`, the finding that justified the gene): the
docs/ROADMAP.md:1531:DROPS on loss) could not exist in gene space. The gene breaks the
docs/ROADMAP.md:1542:the gene that pays). **A/B (`transition-ab.ts`, 120 matches): a real
docs/ROADMAP.md:1546:honest cost of FT fatigue 0.185 vs 0.159; goals near-parity 147 vs
docs/ROADMAP.md:1556:23rd-gene ecology re-roll (sub-baseline, no blowout world, tight
docs/ROADMAP.md:1563:(`Match.trackAttackEntry` + `goalChannelFor`, zero RNG, zero behavior):
docs/ROADMAP.md:1564:every goal banks ONE of seven exclusive channels — `setpiece` (≤6s off
docs/ROADMAP.md:1568:(residual; own goals land here). Banked in `TeamMatchStats.goalChannels`
docs/ROADMAP.md:1570:v28 + migration test. UI: `goalChannelTile` (进球管道, scored+conceded
docs/ROADMAP.md:1573:**Census probe (`goal-channel-census.ts`, gens 20→22, zero sum
docs/ROADMAP.md:1574:mismatches over 1436 goals): 991 = setpiece 17 · carry 55 · walkin 15 ·
docs/ROADMAP.md:1592:compact 16-club selector wall (dot/name/Elo, division badge, 2
docs/ROADMAP.md:1594:one place: tags, dugout record, gene radar vs league mean, ⭐ the
docs/ROADMAP.md:1595:阵型图 (`formationDiagram` in charts.ts: mini pitch, six spots from
docs/ROADMAP.md:1596:the real `ATTACK_FORMATIONS`/`DEFEND_FORMATIONS` tables, hollow GK,
docs/ROADMAP.md:1597:role tooltips — both phases side by side), goal channels, budget +
docs/ROADMAP.md:1601:panel is now DRIFT-only (style moves across generations + a
docs/ROADMAP.md:1630:lifted box population but the cross STILL didn't convert (0.02 goals — the
docs/ROADMAP.md:1633:DESIGN (realistic 6v6 = cutback+combination, not crossing). **The next
docs/ROADMAP.md:1658:DOMINATES both ends → freeing → defensive monoculture, goals ~0.67.
docs/ROADMAP.md:1666:fresh gate 7→2/16) AND it inflates goals-warming 11.54→15.25. Lesson:
docs/ROADMAP.md:1672:create/exploit space. The real enabler = the positioning attr. ⭐⭐ 119j SHIPPED
docs/ROADMAP.md:1675:`d309f250`), first wiring point = reception-under-pressure. Validated
docs/ROADMAP.md:1676:but WEAK on this channel (maxed bites −19% spills but goal-neutral;
docs/ROADMAP.md:1679:inflation (goals-warming 11.67≈11.54), vitest 441 (+2 re-anchors),
docs/ROADMAP.md:1682:making A's reception clean. ⭐ STRATEGIC BACKLOG written: attribute/gene audit vs
docs/ROADMAP.md:1687:game-plan (defensive gene-bend); 119d-1 off-ball supply (peel /
docs/ROADMAP.md:1697:~43-54% transition/scramble-born; 1v1 conversion 45-55%; goal-channel
docs/ROADMAP.md:1700:the "乱抢" (scramble/loose-ball) goals as tactic-less/ugly; dislikes
docs/ROADMAP.md:1701:"人堆" (clumps — formations exist to avoid them); wants mechanisms
docs/ROADMAP.md:1702:fixed so play/decisions develop FREELY and diversify in a healthy,
docs/ROADMAP.md:1709:119e fixed the tackle-squirt half; scramble-goal SHARE sits with
docs/ROADMAP.md:1720:re-roll watch). Execute IN ORDER, one phase = one commit+tag+push,
docs/ROADMAP.md:1723:**112 — the TRANSITION-PRESS gene** ✅✅ **SHIPPED 2026-07-18 — see the
docs/ROADMAP.md:1725:the first-3-seconds-after-turnover axis; the 23rd gene, save v27; A/B
docs/ROADMAP.md:1726:verified a real no-dominant-side tradeoff, adoption near-neutral,
docs/ROADMAP.md:1759:emergence finally legible per club; the Evolution population heatmap
docs/ROADMAP.md:1760:stays (it's the population lens). ② The budget bar splits XI vs 🪑
docs/ROADMAP.md:1772:TIMELINE per club (阵型史): the discrete formation identity was NOT
docs/ROADMAP.md:1780:per-club ELO + FITNESS across generations — both sat fully recorded
docs/ROADMAP.md:1818:knock, deterministic). No new gene — the payoff surfaces are for
docs/ROADMAP.md:1820:bench-budget split, the foul economy (injury = side effect, never
docs/ROADMAP.md:1822:injuries per club-season ✓ on budget, serious 30/32%, avg out
docs/ROADMAP.md:1823:3.0/3.1 rounds, fouls 4.16/4.34 · goals 2.61/2.90 — economy
docs/ROADMAP.md:1824:intact. Paired stash A/B, 3 calibrate seeds: goals Δ −0.08/+0.16/
docs/ROADMAP.md:1828:stream (subs gene-gate = rotation-only now, cards ledger admits the
docs/ROADMAP.md:1831:⭐ BONUS: goals-warming 12.62 (4.57/3.97/4.08, no blowout world) —
docs/ROADMAP.md:1839:generation scrubber — per-club attr summaries now RECORDED on
docs/ROADMAP.md:1850:vs the SAME-ROLE league mean (geneRadar grammar — role mean dashed,
docs/ROADMAP.md:1862:render, the model swaps only when the occupant changes, per-instance
docs/ROADMAP.md:1882:watching (scoreboard/control/camera/sim/presentation). Dead CSS
docs/ROADMAP.md:1892:(completion 78%→76-80% early→late, interceptions flat ~17%, carry
docs/ROADMAP.md:1895:→ 56-67% (gen 22), 89% of late goals unassisted. ② the smoking gun,
docs/ROADMAP.md:1906:×0.9 slope via max() (never compounds). Frozen-gene snapshot A/B:
docs/ROADMAP.md:1912:goals 3.66→3.31 / 3.97→2.89 — and 424242's ECOLOGY genuinely moved:
docs/ROADMAP.md:1923:re-roll noise); goals-warming **11.18 (3.79/3.77/3.62) — the ARC
docs/ROADMAP.md:1933:(`TeamInfo.oppChannels` = the opponent's goal-channel ledger from
docs/ROADMAP.md:1935:from the opponent's dominant threat and bending his match-day genes
docs/ROADMAP.md:1943:plans-ON vs -OFF — goals **3.63→6.03** (991) / **3.55→4.18**
docs/ROADMAP.md:1948:marking) still failed: goals 4.69 / **5.77**, carry still up, tinker
docs/ROADMAP.md:1950:state**: a breakaway is a carrier already isolated with space, and no
docs/ROADMAP.md:1951:DEFENSIVE pre-kickoff gene-bend undoes that — raising jockey just
docs/ROADMAP.md:1953:passivity opens the game end-to-end (the goals blow-up). This is
docs/ROADMAP.md:1954:exactly the emergence-memo trap (a hand-set bias fighting the
docs/ROADMAP.md:1965:pressure just 14-16%, and dribbles/loses the rest — off-ball players
docs/ROADMAP.md:1971:pressed" boost + the marker reaction-lag generalized pitch-wide
docs/ROADMAP.md:1972:(Phase 31.9's near-goal lag) — zero-options DID fall (61/62%) and
docs/ROADMAP.md:1975:so the re-evolved meta dribbled MORE (37→57%) and goals rose; ③ the
docs/ROADMAP.md:1980:reach a 1v1 that still pays) + 6v6 space (beat one man = through), so
docs/ROADMAP.md:1981:ANY change that adds space/separation helps the carry ≥ it helps
docs/ROADMAP.md:1986:the wrong target (it would make it play like 11v11). What real
docs/ROADMAP.md:1991:substrate EXISTS (`wallRun`/2过1, Phase 34) but is throttled: gene-
docs/ROADMAP.md:1994:goals are unassisted (119b). Reverted clean; `supply-side.ts` probe
docs/ROADMAP.md:2000:so it's not only a fast-team toy; give the "go" burst a real chance
docs/ROADMAP.md:2003:1v1 honesty (119b's keeper lever got conv to 56-67%; real is lower).
docs/ROADMAP.md:2004:Measured by: give-and-go goal share UP in the census, carry share
docs/ROADMAP.md:2005:eased toward a co-weapon (NOT eliminated — carry-lean is realistic),
docs/ROADMAP.md:2006:goals floor held. Probe-first, A/B before commit (the 119c/119d-1
docs/ROADMAP.md:2008:6v6-space-locked and only 11v11 (parked) breaks it.
docs/ROADMAP.md:2012:DEFENSIVE genes toward a terminal breakaway. The lesson points
docs/ROADMAP.md:2019:it's happened; (c) accept that the real lever is structural (11v11
docs/ROADMAP.md:2020:space, parked) and pursue diversity elsewhere. Probe-first, A/B with
docs/ROADMAP.md:2022:discipline (measure adoption + goals + carry share, three gates)
docs/ROADMAP.md:2025:formations, the coach's counter-pick and why. (The clash overlay
docs/ROADMAP.md:2030:一般有方向"; probe-first, two refuted models on the way).** NEW
docs/ROADMAP.md:2035:(open-play baseline 2.4-2.6), and **21-24% of ALL goals
docs/ROADMAP.md:2045:tackle steers WIDE — the away-from-own-goal ray bent toward the near
docs/ROADMAP.md:2048:REFUTED MODELS mapped the design space first (both A/B'd, both
docs/ROADMAP.md:2050:face their own goal — scrambles AND scramble-goals ROSE), v2
docs/ROADMAP.md:2053:defend-shape ST: goals-warming re-inflated 11.18→15.4 and fresh
docs/ROADMAP.md:2057:AND the goals gate.** Measured (v3, all gates green): scrambles
docs/ROADMAP.md:2058:7.75/7.86 fresh-evolved (−5/−12%) · 7.49/8.66 frozen-gene;
docs/ROADMAP.md:2059:scramble-goal SHARE ~flat (the payoff end is untouched — that's the
docs/ROADMAP.md:2060:spill/give-and-go frontier, 119d); goals-warming **11.48
docs/ROADMAP.md:2070:the FEET through the normal lane-aware pass loop (blocked-lane 4-5%,
docs/ROADMAP.md:2084:in football form). The FROZEN-gene A/B is the controlled instrument:
docs/ROADMAP.md:2086:7→4% — a real ~30-40% cut in throws-at-an-opponent. Safety gates:
docs/ROADMAP.md:2087:goals-warming 11.54 (3.36/4.43/3.75) ≈ 119e's 11.48 (no inflation);
docs/ROADMAP.md:2095:NO-FIX (honest negative, `spill-anatomy.ts` kept).** The spill model
docs/ROADMAP.md:2096:is HONEST: at gen 21 the "SHOULD-NOT-SPILL" residual (unpressured +
docs/ROADMAP.md:2099:HEAVY pressure (≥0.5), 36-39% blind-side, 90-95% at controllable
docs/ROADMAP.md:2102:real football miscontrols. `touchFailChance` (speed × pressure ×
docs/ROADMAP.md:2103:misalign × technique) prices a slow unpressured facing ball at <1%
docs/ROADMAP.md:2104:fail and a 14 m/s pressured blind ball at ~11% — the ramp is honest.
docs/ROADMAP.md:2114:The existing pre-match ClashBanner (two DNA radars + formation pair +
docs/ROADMAP.md:2117:league W/D/L, the 114 data), and the LEAGUE STANDING (division rank +
docs/ROADMAP.md:2126:BEHAVIOURAL plan. 119c REFUTED defensive gene-bend counter-picking
docs/ROADMAP.md:2132:**119h — FREE THE MARKING SCHEME (the emergence-honest 乱抢 payoff fix)**
docs/ROADMAP.md:2138:goals conceded, zonal 4.0-5.5 / 1.4-2.0; roughly balanced now (991
docs/ROADMAP.md:2146:gene), and markingAggression ALSO pays for tackle-win (+0.2) + fouls +
docs/ROADMAP.md:2149:the AGGRESSIVE-ZONAL quadrant (hold shape AND tackle hard = the modern
docs/ROADMAP.md:2150:zonal press) UNREACHABLE in gene space. THE PLAN was (1) quadrant probe → (2) decouple → (3) A/B. ⚠️ **STEP 1
docs/ROADMAP.md:2158:DEFENSIVE MONOCULTURE with goals crushed to ~0.67 — exactly the
docs/ROADMAP.md:2175:finishing/defending/strength/stamina/reflexes) + 23 team genes + 9
docs/ROADMAP.md:2182:- ⭐ **Positioning / off-ball intelligence / anticipation** — MISSING,
docs/ROADMAP.md:2183:  the deepest gap: all positioning is team-gene + formation-table +
docs/ROADMAP.md:2184:  brain logic; NO player-level "reads space / times runs" attr. Sits
docs/ROADMAP.md:2196:  (→topSpeed only); tight-space turning / the momentum gate.
docs/ROADMAP.md:2199:- Folded acceptably (low priority): composure→finishing, vision→
docs/ROADMAP.md:2201:Priority order: scheme-gene (119h, in flight) → positioning attr (its
docs/ROADMAP.md:2202:own big project, budget impact) → GK split (rides the keeper line) →
docs/ROADMAP.md:2207:都涌现出来").** The real form of 119d and the UNBLOCKER for 119h. Real
docs/ROADMAP.md:2208:football breaks a defence by manufacturing a DILEMMA (space+time the
docs/ROADMAP.md:2210:(which defends space, not men) the seven tools are: (1) OVERLOAD /
docs/ROADMAP.md:2217:carry → 1v1) but NOT without it (119d-1), so the only space-manufacturer
docs/ROADMAP.md:2221:gene-driven, unbiased primitives + retire hand-set suppression + run
docs/ROADMAP.md:2222:evolution and OBSERVE which of the seven emerge. NOT script "do a
docs/ROADMAP.md:2224:that creates a DILEMMA (commits/overloads a defender), NOT generic
docs/ROADMAP.md:2225:separation/space (that helped the carry). Success metric: the attack's
docs/ROADMAP.md:2226:goals vs the FIXED aggressive-zonal wall rise (quadrant-balance as the
docs/ROADMAP.md:2227:yardstick), goals floor held, carry share eased toward co-dominance
docs/ROADMAP.md:2230:leverage primitive → A/B + fresh-evolution + goals-floor + the zonal-
docs/ROADMAP.md:2242:before peak**. Root: B receives under pressure (the license needs
docs/ROADMAP.md:2243:pressure>0.2) and tries to CONTROL/settle → pressed → lost, instead of
docs/ROADMAP.md:2244:playing the real give-and-go: a FIRST-TIME return into A's burst. B has
docs/ROADMAP.md:2249:gene-priced). MECHANICALLY it fired: frozen-gene oneTwos 0.07→0.52/0.39,
docs/ROADMAP.md:2252:failed: (1) EVOLUTION DE-SELECTS IT — fresh-evolved, the wall-pass gene
docs/ROADMAP.md:2257:clean chance). (2) IT INFLATES GOALS — goals-warming 15.25 (5.19/5.96/
docs/ROADMAP.md:2263:it; the frozen oneTwos 0.5 was an artifact of old genes that happened to
docs/ROADMAP.md:2268:next try = combination goals up AND evolution KEEPS the appetite (gate
docs/ROADMAP.md:2269:holds) AND goals floor held. Probes kept: `wallrun-anatomy.ts`,
docs/ROADMAP.md:2276:was team-gene + formation-table + uniform brain logic, no PER-PLAYER
docs/ROADMAP.md:2277:"reads space / times runs / receives under pressure". So: added
docs/ROADMAP.md:2280:(= 9×9×0.5, preserving the tuned 0.5 density so it's a real trade-off,
docs/ROADMAP.md:2281:not free), save v31→v32 with a TOP-OF-CHAIN backfill (the v17→v18 budget
docs/ROADMAP.md:2285:pressure — `touchFailChance` gains a positioning term that tames the
docs/ROADMAP.md:2289:pos-0.1 4.70, −19%) but is goal-NEUTRAL (pos-0.9 GF 1.67 ≈ pos-0.1
docs/ROADMAP.md:2292:rewarded in this engine (goals are scramble/carry/transition-born). So
docs/ROADMAP.md:2295:(prevents them) — queued next. Gates: goals-warming 11.67 (3.47/4.07/
docs/ROADMAP.md:2296:4.13) ≈ 11.54 baseline (ZERO inflation — the density-preserving budget
docs/ROADMAP.md:2303:(2) DEFENSIVE reads (interception/cover positioning — the shape-holding
docs/ROADMAP.md:2313:test: ① SEAM RUN (runTarget pulls a high-positioning runner's Y toward
docs/ROADMAP.md:2317:creator (the ball must arrive there AND the space ahead is still
docs/ROADMAP.md:2321:negative, interception weak): individual positioning quality-scalers
docs/ROADMAP.md:2324:interception / run-target quality doesn't touch it. ⭐⭐ THE USER'S
docs/ROADMAP.md:2328:half-space 肋部, pull-wide 拉边, overlap 套边…), and WHICH run fits the
docs/ROADMAP.md:2329:moment must EMERGE from the substrate + genes + positioning, not be
docs/ROADMAP.md:2330:hand-set. So the attacking side becomes 119l (a real emergence project),
docs/ROADMAP.md:2333:**119l — the RUN REPERTOIRE (emergence, per the user's reframe)** ⏳
docs/ROADMAP.md:2334:**QUEUED.** Enrich the off-ball run substrate into gene-driven, unbiased
docs/ROADMAP.md:2336:half-space, pull-wide, overlap, near/far-post, drop-and-spin…) can
docs/ROADMAP.md:2342:form of "make the seven emerge" for the attacking side; big, probe-
docs/ROADMAP.md:2349:runner) only **14-16%** and convert ≈0%. So the bottleneck is NOT run
docs/ROADMAP.md:2351:monoculture, 6v6-space-locked: beat one man = through, so carry-EV >
docs/ROADMAP.md:2353:run must DRAG the marker to open the LANE (not merely the runner's own
docs/ROADMAP.md:2360:is carry-locked and only 11v11 (more space → beat one man ≠ through)
docs/ROADMAP.md:2375:✅⚠ closeIn — the save model's missing closing-down credit (probed the
docs/ROADMAP.md:2376:whole design space first: extended charge REJECTED at GA 5.13, custom
docs/ROADMAP.md:2392:λ=0.05 but REFUTED as the closer (3-world verdict; inflation's real
docs/ROADMAP.md:2407:defensive worlds stay ecology-dependent; the offside-trap gene and
docs/ROADMAP.md:2417:decision below is pre-ratified.**
docs/ROADMAP.md:2424:Gates: shot-context anatomy (composed-1v1 goal share ↓ from 76-81%),
docs/ROADMAP.md:2425:goals-warming 24g (direction: late means ↓), calibrate early band
docs/ROADMAP.md:2432:defending scaled by (jockeyBias−0.5), budget-clamped, and the
docs/ROADMAP.md:2435:>0.5 when it pays) + def attr movement; goals direction.
docs/ROADMAP.md:2440:PRE-AUTHORIZED fallback A: a MODEST absolute conceded-goals term in
docs/ROADMAP.md:2450:mode: the match runs beneath). ⚠ BOTH visual suites must dismiss
docs/ROADMAP.md:2459:flipping across its goal-side threshold (hysteresis needed).
docs/ROADMAP.md:2462:**98 — keeper distribution genetified** (user-ratified today:
docs/ROADMAP.md:2466:pressured + no build-up genes → the punt (whose landing feeds the
docs/ROADMAP.md:2472:through existing pass scoring and gated by genes (passBias/risk),
docs/ROADMAP.md:2476:**100+ (queue tail, order per judgment)**: offside-trap gene
docs/ROADMAP.md:2477:(hold-the-line vs track-runner, natural tension with coverBias);
docs/ROADMAP.md:2479:chaser-count hardcode; N6 follow-through (fitBias drift watch).
docs/ROADMAP.md:2482:play reports; goals-band verdict = theirs; amb-loop human listen
docs/ROADMAP.md:2494:`feedback-evofootball-emergence`). Do NOT hand-design more mechanics.
docs/ROADMAP.md:2497:evolution ACTIVELY SELECTS the no-space slugfest — `attackingWidth`
docs/ROADMAP.md:2500:duel `tryTackles` ignores pace). So the "no space / midfield churn" the
docs/ROADMAP.md:2510:own), dribbleBias climbs harder, press softens; goals 2.41/1.78→2.71/2.17
docs/ROADMAP.md:2513:`policy-emergence.ts` gate PASSED — cross-franchise style spread 0% → ~20-24%
docs/ROADMAP.md:2514:and PERSISTS (distinct styles coexist), goals mean 2.52 (on target). (4) ⭐
docs/ROADMAP.md:2515:**broaden it** (user: build-up / 防守 / 套路 / players should all emerge): ✅
docs/ROADMAP.md:2516:defence (43) + build-up (44) SHIPPED — chase/mark/intercept/clear + pass/outlet/
docs/ROADMAP.md:2517:support genetified, ATT+DEF+BUILD spread ~20%, goals 2.40 / 2.34. NEXT (easier
docs/ROADMAP.md:2519:model (user 2026-07-14, hardest): player-attribute expansion + the evolution VIZ
docs/ROADMAP.md:2545:**calibrate noise on goals is ±0.3–0.4 at the default n=142 — ALWAYS
docs/ROADMAP.md:2547:failure modes 16–21 before touching any lever** (18 is Phase 30's whole
docs/ROADMAP.md:2548:detective story: goals live in gene-mix variance, LESS marking = STRONGER
docs/ROADMAP.md:2549:defence, structure deleted the goals-above-xG channel; 19–21 are Phase
docs/ROADMAP.md:2554:matches or CI's 2-core runner starves vitest's heartbeat; Playwright
docs/ROADMAP.md:2556:PHONE (≤390–640px) — check every UI change there; sim-generated text
docs/ROADMAP.md:2565:reference; the iteration model it describes is superseded by the

[35m[3mcodex[0m[0m
The roadmap confirms this is not a blank-slate codebase: several plausible fixes have already failed because 6v6 turns “more space” into “better solo carry.” I’m narrowing the review to the current perception proposal and those measured failures, since they materially change what the next safe move should be.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'nl -ba docs/VISION.md'[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	# EvoFootball Arena — 愿景 · 金标准 (VISION / THE GOLD STANDARD)
     2	
     3	> 这份文档是**用户想要什么**的唯一权威来源。**每一个决定**——机制、功能、
     4	> ship-or-revert、优先级——都以此为尺子来量。它汇总了用户过去所有"我希望 xx"
     5	> 的原话与意图。**当某个改动服务了某条杠杆、却违背了这份愿景 → 愿景赢。**
     6	>
     7	> 活文档:新的"我希望"随时并入;原话逐字保留,不改写用户的话。
     8	> 决策/机制的当前状态与推理见 [`EVO-BLUEPRINT.md`](EVO-BLUEPRINT.md)（主计划）
     9	> 与 [`ROADMAP.md`](ROADMAP.md)（阶段账本）——**那些以本文件为准，不是反过来**。
    10	
    11	---
    12	
    13	## 0. 北极星 (The North Star) — 用户原话
    14	
    15	**总纲（2026-07-14, user-ratified）:**
    16	> 就像看着现实足球队伍一样,涌现不同战术,然后互相竞争,进化,然后每个队员,
    17	> 每个队伍的 coach,每个赛季杯赛,都有独特闪光点和打法,并且都在 evo,而且
    18	> 有竞争有激烈,并且需要有个更可视化的方法来看他们进化,并且这一切都是有很
    19	> 真实并且足够质量高的底座支撑。
    20	
    21	**一句话检查表（2026-07-14 gap review）——一个成品该是:**
    22	> 好玩的,可以自我进化的,可视化优秀的,有深度的,玩着爽的,能自己产生多元化
    23	> 战术的,贴近现实足球。
    24	
    25	一个活的足球世界:战术、球员、教练、赛季、杯赛都带着**赢来的身份**,都在进化,
    26	竞争激烈且**看得懂**,全部立在一个**真实、高质量**的模拟底座上。
    27	
    28	---
    29	
    30	## 1. 灵魂:涌现,不是我们设定 (EMERGENCE — the soul)
    31	
    32	**用户原话（2026-07-14）:**
    33	> 真正的应该是自己涌现各种风格、技巧、二过一、战术等等,而非我们去设置。
    34	> 这才是我更希望的 evo 的含义。
    35	
    36	> 不要写死预设,让他发挥才智。
    37	
    38	**铁律:**
    39	- 风格 / 技巧 / 二过一 / 战术 / 跑位 **从进化 + 选择里长出来**,不是我们手写。
    40	  手写"边锋做 X"、给某个角色调一个必然触发的结果,**违背灵魂**。
    41	- **底座只提供"允许 X"的能力,不替球队"定 X"**（用户 2026-07-19：
    42	  "这些都是'底座现在允许 x'而不是'我们帮球队定了 x'"）。给能力 + 基因门控,
    43	  让**选择**决定谁用、用多好;用不好的被淘汰,天经地义。
    44	- **诊断问题 = 诊断进化问题,不是设计问题**:缺失的好行为通常是**局部最优**
    45	  ——它在当前底座里不划算,所以进化正确地没选它。修法 = 把底座改成让好行为
    46	  **划算**(gene-driven、无角色偏置),退掉补偿性的手调,然后**跑演化并观察**。
    47	- ⭐⭐ **头号活体违规:阵型/位置目前是"我们画死的菜单",不是长出来的**（用户
    48	  2026-07-19）。原话:
    49	  > 边锋回撤其实是一个大的自由度的一部分。我发现有的深蹲大巴的球队,很多球员都
    50	  > 站到了自己禁区里,对于防守的帮助是 0——这也是阵型的问题:阵型第一没办法自己
    51	  > 变化,每个人站在阵型的哪里是固定好的,没有回撤;阵型也不会随着对面的移动而
    52	  > 移动,也没有强弱侧;战术的风格基本上是我们人为定义的风格,而不是长出来的。
    53	  现状（对代码属实）:阵型 = 一组**手写的固定坐标表**（wide-212/narrow-122/…/
    54	  low-32/…),`formationSpot` 只在其上叠**仿射变换**(随球 x 滑动、按基因缩放宽/深、
    55	  模式位移、很弱的随球 y 拖拽)。后果:①阵型不能自己变(形状是我们画的,演化只是
    56	  选一张表+缩放);②位置写死、**没有回撤接应**;③**不随对手形状移动**(只跟球);
    57	  ④**几乎没有强弱侧**;⑤**所谓"进化出的风格"本质是选了我们哪张表——形状是我们
    58	  手搭的,直接违反本原则**;⑥没有"按价值站位/别扎堆"→大巴队一堆人挤自己禁区、
    59	  防守贡献 0。**要求:位置本身必须涌现**——一个 gene-driven 的**定位场/角色+自由度**
    60	  系统:站位由"球 + 对手 + 队友 + 空间价值 + 基因倾向"实时生成,**回撤/前插/压上/
    61	  收缩/强弱侧/别扎堆都是涌现结果**,"风格" = 演化出的**形状**而非我们的菜单。
    62	  这是与"缩场/密度"并列的**承重级底座重构**,也是这轮位置/宽度杠杆反复回退的
    63	  第二根源(在写死的格位上做变换,长不出流动定位行为)。
    64	- ⭐⭐⭐ **实现形态(2026-07-20 拍板):"让球员自己长眼睛"。** 上条那个 gene-driven
    65	  定位场,具体长成一个**基因加权的「空间价值场」**——每个球员对场上位置/方向打一个
    66	  价值分(空间开阔度 + 威胁/推进 + 接不接得到 + 别扎堆),往**自己眼里价值最高**的点
    67	  跑 / 带。用户原话:
    68	  > 这相当于,让球员自己长眼睛了?我觉得这个很牛逼啊。
    69	  **关键:内切、禁区包抄、回撤接应、超载、强弱侧——不一个个手写,全从这一个价值场
    70	  涌现。** 用户 2026-07-20:"内切还有禁区包抄,这些球员自己不能长出来吗"——**答:应该
    71	  长出来;它们今天长不出来,是因为底座里根本没有这个「动作」原语(带球只会下底、只有
    72	  一个写死的接应人),不是进化没去选它**(maxed-genome 也变不出 → 底座缺陷,非选择缺
    73	  口)。所以要补的是**原语**,而**补一个 gene 门控的能力原语 ≠ 手写行为**:谁用、几个、
    74	  何时、值不值,照样交给基因 + 选择。
    75	- ⭐⭐⭐ **眼睛看什么(完整感知模型,2026-07-20 用户补全)。** 用户原话:
    76	  > 长眼睛这个,还得知道队友在哪,所以是球+空间+队友,空间其实也就是对面的人+
    77	  > 自己的人+场地(球门禁区之类的)。
    78	  即一只完整的眼睛感知 **4 样**:**① 球**(在哪 + 要去哪)· **② 对手**(他们**否定**空间:
    79	  盯防/压迫,并定义结构:越位线、密集块、人与人之间的缝)· **③ 队友**(他们**占用**空间
    80	  → 别扎堆;更是**协同**信号 → 持球队友在边路高位=要传中→我踩点包抄,队友拉了宽度=我
    81	  进中路,队友回撤=我压上)· **④ 场地**(球门/禁区/边线/越位区——**固定几何决定价值**:
    82	  近门=危险,禁区=目标区)。**⭐ "空间"不是原始输入,是从 ②+③+④ 派生出来的**
    83	  (openSpace = f(离对手多远、离队友多远、在不在场内有用区))。**一个有价值的位置 = 存在
    84	  的空间(对手远、队友不在、在场内)× 有意义(近门/球要来/接得到)。** ⚠ 教训(本会话 3 次
    85	  失败):只用"对手"算 openness、把"队友"仅当扎堆惩罚、丢掉"读持球队友的协同"和"场地价值/
    86	  越位结构" → 眼睛残缺 → 球员往空地(=远离球和禁区)乱跑、越位到位失败。四样齐备才是真眼睛。
    87	- ⭐⭐⭐ **眼睛还要看自己 + 看动态(2026-07-20 用户补全 II)。** 外部四样之外,真眼睛还读:
    88	  · **自身**:**朝向**(面朝己门不能马上起脚/前传,转身要时间)、**我的属性**(同一位置,对快的/会
    89	  射的/惯用脚对的人价值不同)、**体能/平衡** → **价值永远是"对我而言"的**,不是客观的。
    90	  · **动态 / 预判**:不是快照——对手在后撤还是站定、队友在不在跑、球 1–2 秒后在哪、**读持球人
    91	  的意图**。用户原话:**"对手结构其实类似于提前观察,以及预判,这个影响自己的决策。"** 三次失败
    92	  (越位到位 +50%、踩不上点)正是丢了这只动态眼。
    93	  · **眼睛本身有好坏 = 属性**:用 awareness/视野属性 gate 看得**多远/多准/多快** → **"长眼睛"本身
    94	  就是分化的、涌现的**(大师看得见别人看不见的传球)。
    95	  并且:四个输入各喂**多个维度**(空间/威胁/接应/球门价值),不是只喂"空间";有价值的空间是
    96	  **相对对手阵型**(线间/身后/肋部)而非绝对坐标。
    97	- ⭐⭐ **底座属性必须"完备 + 每一项真有影响"(§3 现实审,用户 2026-07-20)。** 球员自我属性集要
    98	  对照现实**审完备**(缺不缺 vision/awareness、first-touch、aerial、agility/转身、惯用脚 等决策相关
    99	  能力),且**每一项都必须对 sim 有实际、可测的影响** —— **不能有装饰性/死属性**(占预算却不改
   100	  变任何结果)。审法:代码里查每属性读在哪 + 效果强弱,可疑的用敏感度探针实测。
   101	- ⭐⭐⭐ **两层眼睛(球员 + 教练)。** 用户 2026-07-20:"球队的风格是教练长眼睛吗"——
   102	  **对。球员的眼睛**看局部空间(我往哪跑/带);**教练的眼睛**看全局模式(压上/回收、
   103	  **超载哪一侧**、传中/控球、盯人/区域)。两层同一个道理:**感知维度 = 底座给,权重 =
   104	  进化调**。**⭐ 球队风格 = 教练基因(全队 DNA) × 球员个人偏好(个体偏移)。** 现状:
   105	  "教练 × 球员"的组合层**已有一半**(W1 教练 + W2 球员个人风格 + per-team policy 基因);
   106	  但**球员进攻跑位这只眼睛最蠢**(`supportSpot` 永远朝前、不回撤、不包抄)→ **先装这只**;
   107	  **教练那只眼睛**(TeamBrain 的模式/派人/超载集体决策)现在还比较**手写**(阈值+规则)→
   108	  升级成"教练基因加权的全局价值场"是**更深一层的后续**。落在 §5 分层世界:球员身份 +
   109	  教练哲学,都在进化、都长着自己的眼睛。
   110	- ⭐⭐⭐⭐ **这一整套 = 从底层重做「决策引擎」(用户 2026-07-20 拍板方向)。** 原话:
   111	  > 这其实是从底层做了一个足球引擎,这个我觉得方向是对的。
   112	  把**手画的行为/阵型表**,换成每个球员(之后每个教练)跑的 **感知 → 价值 → 动作** 决策核:
   113	  眼睛(球+对手+队友+场地+自身+动态)→ **gene 加权价值** → 选动作。所有打法(内切/包抄/
   114	  回撤/超载/强弱侧…)从**这一个引擎涌现**,不再一条条手写——这是 §1 灵魂的落地方式,也是本
   115	  会话三次单点杠杆失败的收束点(**往残缺引擎上贴行为,必回退**)。⚠ **诚实代价**:这是**承重级、
   116	  更慢、大概率"先变差再变好"**(三次回退就是这低谷的开始)——所以纪律更硬:**增量做、保留可
   117	  回退的现行基线、每块引擎必须在 §2 上打赢现行手调行为才 ship**(光"更有原理"不算)。
   118	- 诚实张力:不是一切都能涌现——**物理引擎 + 基因维度 + 价值场的感知维度**是我们手搭
   119	  的底座(球怎么飞、有哪些属性、"眼睛"看哪几项);但**位置/阵型/形状/跑位属于战术层,
   120	  应该涌现,不该是我们画的表或写死的行为**(见上条)。涌现的是**权重**,不是维度本身。
   121	  底座的职责是让基因**有意义**,而不是替球队摆好阵型或替球员决定跑哪。
   122	
   123	---
   124	
   125	## 2. 观赏性与手感 (WATCHABILITY & FEEL)
   126	
   127	**用户最烦的:中场乱抢（2026-07-18/19，反复强调）。** 原话——不喜欢的三个原因:
   128	> 他没有战术,没有观赏性,不喜欢所有人一起挤在一起。
   129	
   130	具体现象（用户）:
   131	> 绝大多数都是中场好多人一起挤,然后球乱飞突然变成单刀的。
   132	
   133	**所以要:**
   134	- **不要所有人挤在中路**;不要"乱抢→球乱飞→突然单刀"这种便宜、无战术的进球。
   135	- **战术要看得出来**（"可视化优秀"）——不同打法在场上肉眼可辨,不是一团混沌。
   136	- **流畅 > 打断**:play-feel 优先,别让机制补丁把比赛切碎（memory: fluency > interruptions）。
   137	- **默认干净**（用户 2026-07-19："把默认调试图层都关闭"）:第一眼看到的是**足球**,
   138	  不是调试图层。调试层仍可在面板里开。
   139	- 用户**真的在玩**(含**手机**,≤390–640px)——观感与操作以真实游玩为准;
   140	  headless 截图对像素不可信,信用户的浏览器。
   141	
   142	⚠ 任何"让 X 涌现"的机制,如果把比赛变得**更乱抢 / 更难看 / 战术更糊**,就是
   143	**失败**——即使它在别的指标上赢（2026-07-19 缩场教训:naive 缩场让乱抢恶化 →
   144	不可接受;必须协调地做，观感是硬门槛）。
   145	
   146	---
   147	
   148	## 3. 贴近现实 (REALISM — reference real football)
   149	
   150	**核心信条:如果现实足球不会这样,我们的底座就不该这样。** 用户 2026-07-19 的挑战:
   151	> 如果真的最优解是中路乱挤,为什么现实 6v6 不会这样?世界 6v6 比赛冠军
   152	> 都是那种把人堆到中间得了?
   153	
   154	对照现实来诊断能力值/属性/机制（用户:对照实况/FIFA/FM）。
   155	
   156	### ⭐ 3.0 "现实机制" = 整场游戏,不只是防守（用户 2026-07-19）
   157	
   158	> 现实机制还有那些远射,挑射,过掉门将,以及边路盘带,内切,到中路一般怎么做,
   159	> 回撤,一脚回垫等等……现实机制指的不只是防守,还有进攻,build up,套路等等,
   160	> 这些都应该从一个优秀底座长出来。
   161	
   162	**警戒:别把"贴近现实"窄化成防守。** 一个优秀底座要让**整场的真实机制**都能涌现:
   163	**进攻、build-up、套路,和防守**同等重要。下面列的动作**都是举例、不是穷举**,
   164	真正的标准是"**现实足球里存在的机制,在我们的底座里都该是可能的、gene/attr 驱动的,
   165	让合适的球队/球员进化去用**"(§1 灵魂:给能力,不手写)。已知要覆盖的层面:
   166	
   167	- **射门 repertoire**:远射、挑射（吊射)、过掉门将（趟过/推空当)、near/far post、
   168	  抢点、二次射门…… 由 finishing/技术/决策基因驱动,不是一种射门。
   169	- **持球/突破 repertoire**:边路盘带、内切、外线下底、**到中路后一般怎么处理**（分球/
   170	  做球/起脚/继续带)、变向摆脱、护球…… 边路武器库的细节见 §3.1。
   171	- **接应/做球/链接**:**回撤接球**(宽度+长度都可回撤)、**一脚回垫/做球**（lay-off)、
   172	  三角配合、二过一、撞墙、第三人跑动…… 传控队靠这些推进。
   173	- **build-up（后场组织)**:门将/后场出球的真实选择,由后往前的层层推进,
   174	  被逼抢时的解压出球,长传转移…… 不是无脑大脚或一条道。
   175	- **套路（set-plays + 固定配合)**:角球/任意球/界外球的真实套路,以及**运动战里的
   176	  固定配合**（overload-to-isolate、肋部三角、下底倒三角等)——都应能作为可选择的
   177	  打法涌现,而非写死。
   178	
   179	### 3.1 已确立的现实锚点（本会话深挖:防守 + 边路武器库 —— 现实机制的一部分）
   180	
   181	这些是 2026-07-19 这轮已经量化确立的锚点(防守两范式 + 中/边不对称 + 边路武器库);
   182	它们是 §3.0 全场机制里被先钻研的一角,不是全部:
   183	
   184	- **防守两大范式的权衡,参考现实**（用户 2026-07-19："过一个还有另一个 vs 盯人
   185	  的权衡,应该参考现实"）:
   186	  - **区域防守 = "过一个还有另一个"**（分层补防,中路盘不穿;被缝隙/超载/无人盯的插上破）。
   187	  - **盯人**（没有自由人;但过了你的人就没人补 + 可被跑动扯出空当）。
   188	  - → 石头剪刀布:盘带克盯人、宽度/配合克区域,各有克星,**从 scheme 基因涌现**。
   189	- **中路 vs 边路的空间不对称,要从底座长出来**（用户 2026-07-19）:
   190	  > 中路盘带很容易被很多人夹击,边路往往有空间,人数优势。这一点需要底座
   191	  > 本身就能让他体现。
   192	- **边路是一整套武器库,都要有底座支撑**（用户 2026-07-19）:
   193	  高空传中 / 低倒三角 / **还没到底线就给肋部前插的人（早球）** / **边路三角配合
   194	  （二过一、做球、打身后 —— 传控队常做）**。
   195	- **边锋宽度应该是能变的**——回撤接球时**宽度 + 长度都可能回撤**（朝球靠,拿稳再拉开进攻）。
   196	- **夹击/补防是球队能自由选择的,不是我们硬规定的**——有的队不夹击,结果被打穿,活该。
   197	- 细节真实:解围一般**有方向**（不是乱踢）;等等。
   198	
   199	**故意的街机式偏离——不要"修"回去**（deliberate arcade deviations, memory）:
   200	越位 → 门球（不是任意球）、禁区内持球门将解围清空、门球适用越位……这些是**有意**的
   201	简化/取舍,不是 bug。改动前先分辨是"违背现实的缺陷"还是"故意的街机取舍"。
   202	
   203	---
   204	
   205	## 4. 涌现的多样性 (EMERGENT DIVERSITY)
   206	
   207	- 战术 / 风格 / 技巧 / 二过一 **自己长出来 + 互相竞争 + 进化**（见 §1）。
   208	- **多样性需要约束**（用户 2026-07-14）:没有资源上限,进化会把每项属性拉满 →
   209	  "什么都强"胜出 → 风格不分化。**squad 点数预算**（升一项要降一项）逼出取舍 →
   210	  不同原型涌现。✅ 已上线（SQUAD_BUDGET）。
   211	- **进化结果要更快 + 更显眼**（用户 2026-07-14）:分化不应到 20–50 赛季才看得出;
   212	  要 style 铭牌 + 可视化让它早早肉眼可见。目标:≤8–10 赛季可见聚类。
   213	- **每个个体都有赢来的身份**:每个球员、每个教练、每个赛季/杯赛都有独特闪光点
   214	  与打法,且**都在 evo**。铭牌/时代/叙事**从数据发现**,不是预设分类。
   215	
   216	---
   217	
   218	## 5. 会进化的世界 (THE EVOLVING WORLD — 4 层)
   219	
   220	**顺序 = 杠杆**（binding）:引擎（有多样性）→ 可视化（多样性被看见）→ 世界（多样性有
   221	面孔和故事）→ 底座加厚。
   222	
   223	- **引擎**:进化真正产出多样性（属性扩展 + 预算 + results-dominant 适应度）。
   224	- **可视化**:style-space 地图、分化曲线、数据驱动铭牌——让进化**看得见**。
   225	- **世界**:**教练**（战术基因的化身 + 通过流动传播哲学的 memetic 通道）、**转会/自由市场**
   226	  （第二条基因通道）、**赛季/杯赛编年史**（完全从记录派生,时代名从数据聚类涌现）。
   227	- **底座加厚**（长期,拉动式）:每项都要过"它给基因一个**新的收益面**吗?"的测试
   228	  ——轮换/替补、状态/士气、伤病、主场效应、有记忆的解说。
   229	- **元规则贯穿每一层**:教练哲学是进化基因,不是预设原型;叙事层**只读**记录,永不反哺 sim。
   230	
   231	---
   232	
   233	## 6. 工作纪律 (HOW WE WORK — 也是用户明确要的)
   234	
   235	- **一次一根杠杆 + probe-first + A/B 才提交**:每 phase 一个杠杆,先探针量化,
   236	  对照上一 tag A/B,过全门（vitest、visual-debug×2、calibrate、goals-warming、
   237	  fingerprint 重刷),再提交/打 tag/推。
   238	- **诚实回退**:测不过就回退,如实报告数字;别把不 work 的东西硬上。
   239	- **A/B 只决定"这一版 ship 还是 revert",不决定"这个方向是否死"**（revert→reframe,
   240	  用户 2026-07-18）:被回退的尝试可拆成"安全 UI 半"+"探针门控的行为半",
   241	  以蓝图要求进入未来 phase。
   242	- **play 报告驱动 phase**:用户玩 → 反馈 → 排期。
   243	- 记忆写 durable-only;live 状态进账本（CHECKPOINT/ROADMAP/BLUEPRINT）。
   244	
   245	---
   246	
   247	## 7. 怎么用这份金标准 (HOW TO USE THIS)
   248	
   249	1. **每个改动先问:它服务 §0–§5 的哪一条?违反哪一条?** 违反愿景的,愿景赢——
   250	   哪怕它让某个指标好看。
   251	2. **"让某某涌现"的杠杆,必须同时通过 §2 观赏性硬门槛**（不能更乱抢/更难看/战术更糊）
   252	   和 §1 涌现纪律（不能手写行为、只能给 gene-gated 能力）和 §3 现实锚点。
   253	3. 大结构改动（如缩小球场以匹配 6v6 密度）**只有在能同时满足 §2 + §3 + §1** 时才值得投;
   254	   probe 先行,拿本文件当验收标准。
   255	4. 有新的"我希望"就并进来,并在相关账本里回指本文件。

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba docs/ROADMAP.md | sed -n '2160,2438p;2485,2566p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
  2160	didn't close; it MOVED into the coupling's blind spot. ⭐⭐ THE UNIFIED
  2161	ROOT: aggressive-zonal is unbeatable because **the ATTACK has no
  2162	zone-breaking primitive** — a zone doesn't track men, so you beat it
  2163	with MOVEMENT / combination / give-and-go, and our off-ball players sit
  2164	in covered lanes (the 119d-1 wall). The 乱抢 free-1v1, the off-ball
  2165	wall, the throttled give-and-go, AND zonal-dominance are ONE root: the
  2166	attack can't pull a defence apart (a zone especially). ⭐ REDIRECT:
  2167	freeing the scheme is BLOCKED until the attacking counter exists;
  2168	119h ⇒ folds into the ATTACKING-substrate lever (119d give-and-go /
  2169	zone-breaking movement). Don't decouple first — build the zone-breaker
  2170	first, THEN free the scheme and the four quadrants balance. Probes
  2171	kept: `scheme-balance.ts`, `quadrant-balance.ts`.
  2172	
  2173	**STRATEGIC BACKLOG — the ATTRIBUTE/GENE AUDIT vs FIFA/FM/PES (user,
  2174	2026-07-19).** We carry 8 player attrs (pace/passing/dribbling/
  2175	finishing/defending/strength/stamina/reflexes) + 23 team genes + 9
  2176	derived traits. Cross-referenced against the standard football-sim
  2177	taxonomies, split into HAVE-BUT-PRESET-DEAD (coupled, can't evolve
  2178	independently) and MISSING-BUT-NEEDED. ⚠ SQUAD_BUDGET makes attrs
  2179	trade off — every new attr re-prices the whole economy (the reason
  2180	5→8 growth was PARKED at phase-47); each must EARN its place, add
  2181	deliberately, not wholesale.
  2182	- ⭐ **Positioning / off-ball intelligence / anticipation** — MISSING,
  2183	  the deepest gap: all positioning is team-gene + formation-table +
  2184	  brain logic; NO player-level "reads space / times runs" attr. Sits
  2185	  directly under the off-ball-separation wall (119d-1) + the
  2186	  give-and-go. The highest-value single addition.
  2187	- **GK attribute split** (handling / kicking / positioning distinct
  2188	  from reflexes) — MISSING/collapsed; keeper distribution accuracy
  2189	  uses outfield `passing`, catch-vs-spill isn't its own attr. Connects
  2190	  straight to 119f + 119f-spill (the keeper-release + spill lines).
  2191	- **Heading / jumping** — PRESET-DEAD (derived from strength×0.3 +
  2192	  defending×0.15 + role via `aerialSense`); a small timing-header or
  2193	  a strong non-jumper can't exist. Feeds the aerial channel + set
  2194	  pieces.
  2195	- **Acceleration vs top speed + agility** — collapsed into `pace`
  2196	  (→topSpeed only); tight-space turning / the momentum gate.
  2197	- **Tackling vs marking** — both are `defending`; a great marker ≠ a
  2198	  great tackler (feeds scheme diversity).
  2199	- Folded acceptably (low priority): composure→finishing, vision→
  2200	  passing+playmaker-trait, first-touch→dribbling, set-piece specialism.
  2201	Priority order: scheme-gene (119h, in flight) → positioning attr (its
  2202	own big project, budget impact) → GK split (rides the keeper line) →
  2203	heading / accel / tackling splits.
  2204	
  2205	**119i — THE ATTACKING ZONE-BREAKER: make the seven dilemma-creators
  2206	EMERGE** ⏳ **ACTIVE (user, 2026-07-19 — "我希望这七个能在我们的世界
  2207	都涌现出来").** The real form of 119d and the UNBLOCKER for 119h. Real
  2208	football breaks a defence by manufacturing a DILEMMA (space+time the
  2209	defence can't deny in two places at once); against a ZONE specifically
  2210	(which defends space, not men) the seven tools are: (1) OVERLOAD /
  2211	local 2v1, (2) TIMED third-man run into a seam, (3) GIVE-AND-GO /
  2212	combination that beats the shift, (4) SWITCH of play (punish the
  2213	ball-side compaction), (5) DRAG / decoy run, (6) DRIBBLE-to-commit,
  2214	(7) WIDTH→penetrate. ⭐ EMERGENCE FRAME (not hand-coded): the unified
  2215	substrate defect is that **off-ball dilemma-creation does not PAY** —
  2216	the engine rewards beating your man WITH the ball (momentum gate →
  2217	carry → 1v1) but NOT without it (119d-1), so the only space-manufacturer
  2218	that pays is the dribble, and a held zone (cover right there in 6v6)
  2219	kills it → aggressive-zonal is unbeatable (quadrant probe). The job:
  2220	make each dilemma-creator PAY so evolution SELECTS it — enrich the
  2221	gene-driven, unbiased primitives + retire hand-set suppression + run
  2222	evolution and OBSERVE which of the seven emerge. NOT script "do a
  2223	give-and-go here". ⚠ The 119d-1 iron-law trap: the target is movement
  2224	that creates a DILEMMA (commits/overloads a defender), NOT generic
  2225	separation/space (that helped the carry). Success metric: the attack's
  2226	goals vs the FIXED aggressive-zonal wall rise (quadrant-balance as the
  2227	yardstick), goals floor held, carry share eased toward co-dominance
  2228	(not eliminated). PLAN: probe-first inventory (which of the seven fire
  2229	/ pay today, measured against the zonal wall) → enrich the highest-
  2230	leverage primitive → A/B + fresh-evolution + goals-floor + the zonal-
  2231	break metric. Realism note: small-sided football breaks compact
  2232	defences via ROTATION + give-and-go + 2v1, not dribbling alone — these
  2233	are futsal-honest, NOT an 11v11 import. Deep enabler behind all seven =
  2234	the MISSING positioning / off-ball-IQ attr (its own project).
  2235	⭐ FIRST LEVER PROBED (2026-07-19, `wallrun-anatomy.ts` + `give-and-go`):
  2236	the give-and-go is the sharpest zone-breaker (it beats a PRESS, incl.
  2237	aggressive-zonal) and its substrate EXISTS (`wallRun`) but is toothless
  2238	— oneTwos 0.07/match. Anatomy: licenses fire ~3/match, the burster DOES
  2239	get open (peak separation ≥4m in 55-68%, x̄ 5.5m — the "GO" works), the
  2240	carrier chooses to return only 3-4% — because **the WALL (B, who
  2241	received A's pass) LOSES the ball before the return: 80-81% dispossessed
  2242	before peak**. Root: B receives under pressure (the license needs
  2243	pressure>0.2) and tries to CONTROL/settle → pressed → lost, instead of
  2244	playing the real give-and-go: a FIRST-TIME return into A's burst. B has
  2245	no "I'm the wall, lay it back one-touch" behaviour. THE FIRST 119i
  2246	ENRICHMENT ⚠️ **ATTEMPTED + REVERTED 2026-07-19 (double FAIL, fingerprint
  2247	back at `ab2e43bd`).** Made the wall B lay a FIRST-TIME return (a
  2248	boosted through-ball led into A's burst, penetration filter bypassed,
  2249	gene-priced). MECHANICALLY it fired: frozen-gene oneTwos 0.07→0.52/0.39,
  2250	return-played 4%→33%, and it broke the aggressive press a little
  2251	(quadrant zonal-aggr GA 0.67→0.93). BUT the two gates that matter both
  2252	failed: (1) EVOLUTION DE-SELECTS IT — fresh-evolved, the wall-pass gene
  2253	gate fell 7→2/16 (424242) and oneTwos collapsed to 0.01-0.06; given the
  2254	choice, evolution drops the wall-pass appetite because the return is
  2255	net-negative-EV (A receives cleanly only 6%, assists ~3% — B firing a
  2256	through-ball into A's burst mostly gives it away or doesn't create a
  2257	clean chance). (2) IT INFLATES GOALS — goals-warming 15.25 (5.19/5.96/
  2258	4.10) vs the 11.54 baseline (+3.7, the refuted-v2-tackle-poke magnitude):
  2259	the license fires ~3/match regardless, so the added through-balls feed
  2260	converting chances once finishing maxes. ⭐ THE LESSON: making the
  2261	return FIRE is not enough — the completed one-two must be POSITIVE-EV
  2262	(reliably a better chance than the alternative) for evolution to select
  2263	it; the frozen oneTwos 0.5 was an artifact of old genes that happened to
  2264	carry wall-pass appetite. The missing piece is the RETURN QUALITY: A
  2265	gets open (peak sep 5.5m, measured) but can't convert the received ball
  2266	— which points back at A's off-ball run timing + first touch on the
  2267	return = the MISSING positioning/off-ball-IQ attr. A/B metric for the
  2268	next try = combination goals up AND evolution KEEPS the appetite (gate
  2269	holds) AND goals floor held. Probes kept: `wallrun-anatomy.ts`,
  2270	`quadrant-balance.ts`, `scheme-balance.ts`.
  2271	
  2272	**119j — the POSITIONING ATTRIBUTE, foundation + reception wiring** ✅
  2273	**SHIPPED 2026-07-19 (user "开始"; the 9th attribute, the enabler the
  2274	seven need).** The give-and-go failed because the RETURN QUALITY (A
  2275	can't convert the received ball) is un-evolvable — all off-ball quality
  2276	was team-gene + formation-table + uniform brain logic, no PER-PLAYER
  2277	"reads space / times runs / receives under pressure". So: added
  2278	`positioning` as the 9th player attribute (appended LAST in ATTR_KEYS so
  2279	founders' other attrs draw byte-identical), SQUAD_BUDGET raised 36→40.5
  2280	(= 9×9×0.5, preserving the tuned 0.5 density so it's a real trade-off,
  2281	not free), save v31→v32 with a TOP-OF-CHAIN backfill (the v17→v18 budget
  2282	pass calls enforceBudget → a squad missing the 9th attr NaN-poisons the
  2283	rescale, so the backfill must precede the whole chain; v13→v14 rebuilder
  2284	carries it too). FIRST WIRING POINT (of four planned): reception under
  2285	pressure — `touchFailChance` gains a positioning term that tames the
  2286	PRESSURE + BLIND-SIDE penalties (neutral at 0.5, so backfilled saves +
  2287	the tuned physics are bit-unchanged there). ⭐ VERDICT — validated but
  2288	WEAK on this channel alone: maxed-genome BITES (pos-0.9 spills 3.83 vs
  2289	pos-0.1 4.70, −19%) but is goal-NEUTRAL (pos-0.9 GF 1.67 ≈ pos-0.1
  2290	1.66); fresh-evolution SELECTS it only mildly (0.39→0.43-0.46 by gen 23
  2291	vs defending's 0.55-0.59) — because possession-retention is weakly
  2292	rewarded in this engine (goals are scramble/carry/transition-born). So
  2293	reception is the WEAKEST of the four wiring points; the payoff comes
  2294	from the IMPACTFUL ones — run-timing (creates chances) + defensive reads
  2295	(prevents them) — queued next. Gates: goals-warming 11.67 (3.47/4.07/
  2296	4.13) ≈ 11.54 baseline (ZERO inflation — the density-preserving budget
  2297	raise worked), calibrate 1.76/2.05/2.25 (early band), vitest 441 (+2
  2298	re-anchors: shapeHistory attr-count → ATTR_KEYS.length, league v13
  2299	migration robust to the new attr), visual 136+54 (radar auto-gains the
  2300	9th axis), fingerprint REBASELINED `d309f250…`, save v32.
  2301	⭐ NEXT (119k): the IMPACTFUL wiring — (1) run TIMING off the offside
  2302	hold (positioning times the break: onside + arrives with the ball),
  2303	(2) DEFENSIVE reads (interception/cover positioning — the shape-holding
  2304	cover that also kills the 乱抢 free-1v1), then re-attempt the give-and-go
  2305	with positioning making A's return-reception clean. A/B each: does a
  2306	positioning archetype EMERGE and win, do the seven start appearing, is
  2307	the aggressive-zonal wall finally breakable (quadrant metric).
  2308	
  2309	**119k — POSITIONING wiring points 2-3 (run-timing + defensive reads)**
  2310	⚠️ **PROBED → BOTH MARGINAL, NOT SHIPPED (fast maxed-test caught them
  2311	before any evolution burn; fingerprint stays `d309f250`).** Two more
  2312	wiring points tried, each killed by the `positioning-bite.ts` maxed
  2313	test: ① SEAM RUN (runTarget pulls a high-positioning runner's Y toward
  2314	the largest gap in the defensive line) — REFUTED, pos-0.9 scored LEAST
  2315	(GF 1.35 vs pos-0.1 1.50) and conceded MOST (1.56): "run to the biggest
  2316	gap" is a hand-coded SINGLE pattern that disrupts shape, not a chance-
  2317	creator (the ball must arrive there AND the space ahead is still
  2318	defended). ② INTERCEPTION READ (canInterceptPass timing margin scaled
  2319	by positioning) — WEAK, pos-0.9 GA 1.43 vs pos-0.1 1.48 (−0.05, noise).
  2320	⭐ THE PATTERN (three wiring points now: 119j reception weak, seam-run
  2321	negative, interception weak): individual positioning quality-scalers
  2322	all move only the MARGINS, because the engine's scoring is dominated by
  2323	the carry / scramble / transition economy — improving reception /
  2324	interception / run-target quality doesn't touch it. ⭐⭐ THE USER'S
  2325	REFRAME (2026-07-19, mid-119k — "跑位其实也很多变…鱼钩跑,肋部跑,拉边,
  2326	套边"): the seam-run failed for a DEEPER reason — I hand-coded ONE run.
  2327	Real off-ball movement is a VARIED REPERTOIRE (fish-hook / check-and-go,
  2328	half-space 肋部, pull-wide 拉边, overlap 套边…), and WHICH run fits the
  2329	moment must EMERGE from the substrate + genes + positioning, not be
  2330	hand-set. So the attacking side becomes 119l (a real emergence project),
  2331	NOT more single-pattern wiring.
  2332	
  2333	**119l — the RUN REPERTOIRE (emergence, per the user's reframe)** ⏳
  2334	**QUEUED.** Enrich the off-ball run substrate into gene-driven, unbiased
  2335	PRIMITIVES so a variety of runs (fish-hook / check-away-then-burst,
  2336	half-space, pull-wide, overlap, near/far-post, drop-and-spin…) can
  2337	EMERGE and be SELECTED per situation — positioning = the player's
  2338	ability to read which the moment calls for and execute it. Some already
  2339	exist hand-licensed at the team level (overlap 套边, the arriver, the
  2340	weak-side far-post pull) — the project is to make the repertoire
  2341	per-player + evolvable, not TeamBrain-thresholded. This is the honest
  2342	form of "make the seven emerge" for the attacking side; big, probe-
  2343	first, maxed-test each primitive (does it create chances vs a set line
  2344	without just feeding the carry). ⚠ The 119k lesson: do NOT hand-code a
  2345	single run pattern; build the repertoire + let selection choose.
  2346	⭐ BASELINE PROBED (2026-07-19, `run-repertoire.ts`, gen 21) — the
  2347	PREMISE IS UNDERCUT: runs are TIGHTLY marked (83%/69% have a marker) and
  2348	DO get open (peak separation 5.6m), but are FOUND (a pass aimed at the
  2349	runner) only **14-16%** and convert ≈0%. So the bottleneck is NOT run
  2350	variety — **runs aren't SERVED**: the carrier prefers to carry (the
  2351	monoculture, 6v6-space-locked: beat one man = through, so carry-EV >
  2352	pass-EV). A fancier repertoire helps ONLY if it makes runs SERVED — the
  2353	run must DRAG the marker to open the LANE (not merely the runner's own
  2354	separation), raising the found rate, AND the carrier's carry-vs-pass
  2355	economy must shift. Same carry wall every attacking lever hit this
  2356	session (119c, 119d-1×4, 119i, 119j, 119k). ⭐ IMPLICATION: try the run
  2357	repertoire ONLY as "drag-the-marker-to-open-the-lane" (a served-run
  2358	primitive, maxed-tested on the FOUND rate), not prettier in-behind runs.
  2359	If that too hits the wall, the arc's terminal finding stands: the attack
  2360	is carry-locked and only 11v11 (more space → beat one man ≠ through)
  2361	structurally breaks it. `run-repertoire.ts` kept.
  2362	
  2363	**120+ — Stage 4 continues**: home advantage → memory commentary.
  2364	
  2365	**STANDING / WAITING-ON-USER**: ① the 105 audio mix needs the user's
  2366	EARS (every gain has a dB paper trail in the 105 entry — report by
  2367	layer name); ② itch push is manual+theirs (Pages auto-deploys); ③
  2368	amb-loop seam listen; ④ prematch/reel/shootout BGM slots when tracks
  2369	arrive; ⑤ render pageantry parked (foot IK/cloth/celebrations);
  2370	⑥ 11v11 deliberately parked (engine-scale).
  2371	
  2372	⭐⭐⭐ **THE MORNING RUN RESULT (2026-07-18 06:00-12:00, phases 102-105
  2373	— the user's morning ratification executed: "1.删掉…2.路线a…go自走" +
  2374	the audio round)**: **102** ✅ anchor dead (λ=0, purity back) · **103**
  2375	✅⚠ closeIn — the save model's missing closing-down credit (probed the
  2376	whole design space first: extended charge REJECTED at GA 5.13, custom
  2377	poke deleted by its own measurement; aggr gains an interior optimum;
  2378	adoption still ecology-dependent) · **103.5** ✅ jockey A/B re-read:
  2379	gap narrowed to noise · **104** ✅⚠ Route A = the OUTNUMBERED DUEL
  2380	(stalled carrier + helper ≤3m ⇒ +0.12; dribble-meta A/B parity — first
  2381	non-loss; late means 15.72 total = the arc's low, no blowout world;
  2382	991 evolved a cover+pace school instead of jockey = defensive
  2383	DIVERSITY) · **105** ✅ the measured audio mix + title-anthem
  2384	pause-lifecycle + mobile dual-context unlock + SFX default ON.
  2385	The inflation arc REMAINS OPEN (late conv 48-60%) — queue item 106.
  2386	
  2387	⭐⭐⭐ **THE OVERNIGHT RESULT (2026-07-18 02:00-04:40 — the queue below
  2388	EXECUTED, phases 93-101, nine commits+tags all pushed, every gate
  2389	green).** One-line map: **93** ✅ composure earned (composed-1v1 share
  2390	78/82→75/73%) · **94** ⚠ school academies work, adoption still 0/3 —
  2391	because 93 devalued containment's prey · **95** ⚠⚠ anchor swept+shipped
  2392	λ=0.05 but REFUTED as the closer (3-world verdict; inflation's real
  2393	engine = the xg/shot proximity climb 0.16→0.26) · **96** ✅ the synthwave
  2394	TITLE SCREEN (click-to-enter starts the Title BGM; music born at 60) ·
  2395	**97** ✅ hold-flutter measured & killed render-only (the 31.9 quanta
  2396	gaps, 21.6% of distribution frames) · **98** ✅ keeper distribution
  2397	GENETIFIED (roll/sling/PUNT — four school signatures) · **99** ✅
  2398	probe-only: the pinned-winger premise refuted (escape already fires;
  2399	turnover 3%) · **100** ✅ WOODWORK (0.38/match, your crossbar sample is
  2400	live) · **101** ✅⚠⚠ contain hysteresis + the A/B re-read.
  2401	⭐ **TWO DECISIONS WAIT FOR YOUR MORNING:**
  2402	**#1 the anchor** — keep or kill `FITNESS_ANCHOR.conceded` (0.05,
  2403	one line in evolution/fitness.ts): it stabilized only the sweep world;
  2404	evidence in the 95 entry. **#2 containment's reward** — the phase-92
  2405	neutral A/B win is GONE at current HEAD (0.9-jockey 1.16 vs 1.61):
  2406	either a won containment gets a REWARD channel (possession value) or
  2407	defensive worlds stay ecology-dependent; the offside-trap gene and
  2408	chaser-count redemption are parked downstream of this call.
  2409	Also parked: itch push (manual, yours); amb-loop human listen.
  2410	HEAD `3249ad64…` (phase-101), calibrate 2.63/2.97/3.26, vitest 421,
  2411	visual 109+52, Pages CI deploying phase-101.
  2412	⭐⭐ **THE RATIFIED OVERNIGHT QUEUE (user 2026-07-18 "同意dc…连夜自走
  2413	到结束") — execute IN ORDER, one phase = one commit+tag+push, full
  2414	gates each (vitest, both visual suites, calibrate 3 seeds on
  2415	behavioral changes, fingerprint identity-or-rebaseline, both
  2416	ledgers). The user is asleep: do NOT block on questions; every
  2417	decision below is pre-ratified.**
  2418	
  2419	**93 — D: dismantle the composed-1v1 gift** (user-ratified de-patch).
  2420	The 28.4 hand gift (aimMargin×0.72 + spread×0.7 for `oneVone`) is
  2421	the inflation engine's core and is attribute-blind. Make composure
  2422	EARNED: scale both bonuses with `finishing` (neutral at 0.5 —
  2423	early-preserving; a 0.9 finisher keeps ~today's gift, a 0.2 panics).
  2424	Gates: shot-context anatomy (composed-1v1 goal share ↓ from 76-81%),
  2425	goals-warming 24g (direction: late means ↓), calibrate early band
  2426	holds ~2.5-3.4. Expect keeper-throw/card seed re-anchors (6th dance).
  2427	
  2428	**94 — C: school-linked variation** (user-ratified). The two-locus
  2429	valley: jockey needs defending. Fix DISCOVERY, not the objective:
  2430	the academy grows what the coach's philosophy needs —
  2431	`newgenFromBloodline` gains a philosophy pull (attr drift toward
  2432	defending scaled by (jockeyBias−0.5), budget-clamped, and the
  2433	mirror: dive-in coaches drift pace). Founders/fitness untouched.
  2434	Gates: 24g warming — jockey ADOPTION stability (≥2/3 worlds hold
  2435	>0.5 when it pays) + def attr movement; goals direction.
  2436	
  2437	**95 — the VERDICT gate**: rerun warming 24g×3 worlds clean. IF
  2438	late-gen means land ≤~3.8 and falling → declare the inflation arc
  2485	skinned meshes/cloth, celebration choreography (sim-touching), amb
  2486	loop human listen (user's ears).
  2487	HEAD fingerprint `c8d81a2e…` (phase-80 rebaseline; 81/82 probe-only).
  2488	
  2489	## ⭐⭐ THE EMERGENCE PIVOT — [`EMERGENCE-PIVOT.md`](EMERGENCE-PIVOT.md) (2026-07-14)
  2490	
  2491	**The approach changed.** The play-report-driven small-mechanic era is
  2492	PAUSED. The user reframed the project: **tactics / skills / styles must
  2493	EMERGE from evolution + selection, not be hand-coded** (memory
  2494	`feedback-evofootball-emergence`). Do NOT hand-design more mechanics.
  2495	
  2496	Measured this session (`scripts/probes/evo-drift.ts`, 50 gens × 2 seeds):
  2497	evolution ACTIVELY SELECTS the no-space slugfest — `attackingWidth`
  2498	collapses **0.57→0.19 / 0.45→0.09**, `pressIntensity` climbs to
  2499	**0.74 / 0.85** — because width/skill don't PAY in the substrate (the 1v1
  2500	duel `tryTackles` ignores pace). So the "no space / midfield churn" the
  2501	user hates is the EVOLVED equilibrium, and any hand-set width/winger fix
  2502	fights that gradient and gets collapsed back.
  2503	
  2504	**Substrate rework, gated by evolution:** (1) ✅ **phase-41 SHIPPED** — the
  2505	master gate: the 1v1 (`mechanics.tryTackles`) now rewards carrier pace
  2506	(momentum-gated `pace·clamp(len(vel)/9)·0.20`) + technique (0.12→0.18),
  2507	UNBIASED (no role hardcoding); (2) ✅ `evo-drift.ts` gate PASSED —
  2508	`attackingWidth` no longer craters (baseline 0.57→0.19 / 0.45→0.09; now
  2509	bottoms then CLIMBS OUT to 0.27 / 0.31, seed 777 rising 0.077→0.313 on its
  2510	own), dribbleBias climbs harder, press softens; goals 2.41/1.78→2.71/2.17
  2511	(mean 2.44, on target), won tackles 16.8→11. (3) ✅ **phase-42 SHIPPED —
  2512	released `DEFAULT_POLICY` (attacking-style subset) to per-franchise evolution**;
  2513	`policy-emergence.ts` gate PASSED — cross-franchise style spread 0% → ~20-24%
  2514	and PERSISTS (distinct styles coexist), goals mean 2.52 (on target). (4) ⭐
  2515	**broaden it** (user: build-up / 防守 / 套路 / players should all emerge): ✅
  2516	defence (43) + build-up (44) SHIPPED — chase/mark/intercept/clear + pass/outlet/
  2517	support genetified, ATT+DEF+BUILD spread ~20%, goals 2.40 / 2.34. NEXT (easier
  2518	lot): 套路 combos + style-COHERENCE measurement. ⚠️ **DEFERRED to a later FABLE
  2519	model (user 2026-07-14, hardest): player-attribute expansion + the evolution VIZ
  2520	module** — both scoped in **`EMERGENCE-PIVOT.md`**. HEAD fingerprint
  2521	`79f6dd04…` (phase-44).
  2522	
  2523	Everything below is the pre-pivot play-report history (still valid as
  2524	mechanics reference; the ITERATION MODEL is superseded by the above).
  2525	## Standing rules & conventions (LIVE — read before any phase)
  2526	
  2527	**Tag convention (user-ratified 2026-07-13):** point tags attach to the
  2528	MECHANIC FAMILY they iterate (36.1 = touches, like 34.2/34.3 before
  2529	it), NOT to chronology — so the badge (latest tag on HEAD) can show a
  2530	LOWER number than the newest chapter; phase-36.1 following phase-40 is
  2531	correct, not a regression (phase-28.5 continues the pattern — a keeper-
  2532	family tag on the newest HEAD). Never force-retag pushed tags (worktree
  2533	A/B baselines and CI history ride on them). The CURRENT fingerprint lives in the head above.
  2534	
  2535	Standing rules (full detail in [`ARCHITECTURE.md`](ARCHITECTURE.md) §10–13):
  2536	**every phase ends with PROBE evidence** (user rule 2026-07-13, invariant
  2537	11: a `scripts/probes/` tsx measuring the mechanic's own rate/shape —
  2538	same-seed A/B vs the previous tag for "X improved" claims, two calibrate
  2539	seeds before believing deltas, headless choreography probes for
  2540	render-side logic, strip-and-rehash for schema growth);
  2541	every step ends with typecheck + full vitest + both Playwright suites green;
  2542	push via `gh auth switch --user Quarkgluonmixture`, then switch back; verify
  2543	the Pages bundle after CI; itch.io needs a manual `npm run package:itch`;
  2544	re-baseline the determinism fingerprint after mechanics changes;
  2545	**calibrate noise on goals is ±0.3–0.4 at the default n=142 — ALWAYS
  2546	measure balance levers with `npm run calibrate -- 8` (n=568), and read
  2547	failure modes 16–21 before touching any lever** (18 is Phase 30's whole
  2548	detective story: goals live in gene-mix variance, LESS marking = STRONGER
  2549	defence, structure deleted the goals-above-xG channel; 19–21 are Phase
  2550	30.5/31's: bounded support fans, the completion homeostat, and
  2551	inheritance compounding — plus fm 12's Node-vs-Node corollary for any
  2552	long-run league test); statistical
  2553	match-loop tests need `{ timeout }` + `setImmediate` yields every ~25
  2554	matches or CI's 2-core runner starves vitest's heartbeat; Playwright
  2555	selectors are English (suites pin `lang=en`); the user plays 3D on a
  2556	PHONE (≤390–640px) — check every UI change there; sim-generated text
  2557	stays English (sim/ never touches the browser), UI chrome is localized
  2558	via `src/ui/i18n.ts` (zh default).
  2559	
  2560	---
  2561	
  2562	The full pre-pivot phase history (phases 30–34.3 chapter by chapter, the
  2563	old play-report queue, every probe number) moved to
  2564	[`ROADMAP-ARCHIVE.md`](ROADMAP-ARCHIVE.md) — still valid as mechanics
  2565	reference; the iteration model it describes is superseded by the
  2566	blueprint above.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba docs/EVO-BLUEPRINT.md | sed -n '1,125p;2130,2289p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	# The EVO WORLD blueprint (2026-07-14, user-ratified) — the master plan
     2	
     3	> ⭐ **THE GOLD STANDARD is [`VISION.md`](VISION.md)** (2026-07-19) — the single
     4	> authority on what the user WANTS; every decision is measured against it. This
     5	> blueprint (the plan/state) serves that vision, not the reverse.
     6	
     7	This supersedes the *plan* half of [`EMERGENCE-PIVOT.md`](EMERGENCE-PIVOT.md)
     8	(whose rationale, substrate audit, gates and the turnkey attribute scope stay
     9	canonical — this doc sequences them). ROADMAP.md points here.
    10	
    11	## The vision (the user, 2026-07-14)
    12	
    13	> 就像看着现实足球队伍一样,涌现不同战术,然后互相竞争,进化,然后每个队员,
    14	> 每个队伍的 coach,每个赛季杯赛,都有独特闪光点和打法,并且都在 evo,而且
    15	> 有竞争有激烈,并且需要有个更可视化的方法来看他们进化,并且这一切都是有很
    16	> 真实并且足够质量高的底座支撑。
    17	
    18	A living football world: tactics, players, coaches, seasons and cups all
    19	carry earned identities, all evolve, competition is fierce and legible, and
    20	everything rests on a realistic, high-quality simulation substrate.
    21	
    22	**The two structural insights this blueprint adds to the pivot:**
    23	1. *Coaches and transfers are not decoration — they are new CHANNELS for
    24	   evolution.* A coach embodies the tactical genome and lets philosophies
    25	   spread by MOVEMENT (memetic channel); a free-agent market lets player
    26	   genes re-circulate outside rebirth crossover (second genetic channel).
    27	2. *The fitness function currently hand-picks virtues* (pass completion,
    28	   recoveries, stamina efficiency reward ONE texture for everyone) — a hidden
    29	   convergence pressure, to be removed in favor of results-dominant fitness.
    30	
    31	## Principles (binding, all stages)
    32	
    33	- **The emergence meta-rule extends to every new layer**: coach philosophies
    34	  are evolved genomes, never preset archetypes; nameplates / eras / narrative
    35	  categories are DISCOVERED from data (only a dimension→vocabulary grammar is
    36	  hand-built); the narrative layer READS records and never feeds back into
    37	  the sim.
    38	- **One lever per phase, probe evidence per phase** (ARCHITECTURE invariant
    39	  11): dedicated probe A/B vs the previous tag, `npm run calibrate -- 8` on
    40	  two seeds, full test gate, fingerprint rebaseline, chain-tested save
    41	  migrations.
    42	- **Order = leverage**: Engine (diversity exists) → Visibility (diversity is
    43	  seen) → World (diversity gets faces and stories) → Substrate thickening.
    44	- **Do not resurrect** the parked hand-set behaviors (take-on, run-license,
    45	  widen-formation) and do not hand-set new ones.
    46	
    47	## Stage 1 — ENGINE: make evolution actually produce diversity
    48	
    49	| Phase | Lever | Gate |
    50	|---|---|---|
    51	| **45 (A1)** | 套路 combos gene-driven: fold Phase 34's hand-set trigger thresholds/appetites (wall pass / third man / overlap) into per-franchise policy genes, born at today's constants (the proven phase-42 pattern). Also: run `policy-coherence` to establish the coherence baseline. | combo-rates A/B (specialists diverge, league mean stable) + policy-emergence + calibrate ×2 |
    52	| **46 (A2)** | Breakaway substrate fix: the carry-push cone is keeper-BLIND (verified defect — maxed attrs still ~8-9% heavy-touch→keeper). Make the push-target keeper-aware at the physics-primitive level, unbiased, so pace/space PAY. | `breakaway.ts` A/B + calibrate ×2 |
    53	| **47 (B)** | Attribute expansion 5→8: `pace/passing/dribbling/finishing/defending/strength/stamina/reflexes` — exactly the turnkey scope in EMERGENCE-PIVOT §5 (per-line technique remap incl. the mechanics.ts ambiguity GOTCHA, strength/stamina payoffs, ROLE_BIAS MF→passing, traits, DECLINE_W, probes to 8 keys, save v11→v12 neutral backfill). | calibrate ×2 watching completion+goals (fm 16–21) + player-archetype probe |
    54	| **48 (C)** | **Resource budget (the keystone)**: `SQUAD_BUDGET` = hard cap on the squad's total attribute points; one pure `enforceBudget(squad)` (proportional rescale) applied after rebirth crossover, the careers develop pass, and newgen entry. SQUAD-level on purpose: star-plus-role-players vs balanced-six becomes an evolvable axis. Rejected: fitness penalty (invisible, evolution routes around), per-player cap (kills the star axis). **Rides with it: academy heredity** — newgens mutate the retiring slot's attrs (club bloodline) instead of random+ROLE_BIAS; ROLE_BIAS retires. Cap derived by probe (bind early: ~founding mean ×1.1–1.2), settled by calibrate. Budget bar on the team card. | specialization probe (within-player variance ↑, cross-club allocation divergence ↑) + evo-drift plateaus at cap + calibrate ×2; rewrite the careers mean-stability test (the budget intentionally changes that invariant) |
    55	| **50 (E)** | Selection speedup, one lever at a time, judged by a new `style-speed` probe (**target: visible clustering ≤8–10 seasons on fresh saves**, spread ≥15% / ≥3 nameplate clusters): (1) **fitness slimming** — results-dominant (points ~0.5, GD ~0.2, styleConsistency ~0.1; drop passCompletion/recoveries/staminaEfficiency); (2) parent diversity — reborn's second parent = highest-fitness club most gene-distant from the first (deterministic); (3) diversity thermostat — mutation scale rises when population spread sinks below a floor (derived from population state, unbiased, self-regulating); (4) only if still short: D2 rebornN 3→4. | style-speed A/B per lever + calibrate ×2 (watchability is the backstop if e.g. hoofball wins) |
    56	
    57	## Stage 2 — VISIBILITY: make evolution seen (phase 49, right after the budget)
    58	
    59	- **Data-driven nameplates**: z-score each club's (genome+policy) vector
    60	  against the current population; top-2 |z| dims feed a dimension→vocabulary
    61	  grammar (zh). Replaces `describeIdentity`'s fixed threshold buckets (which
    62	  violate the meta-rule). On team cards, clash banner, league table chips.
    63	- **Style-space map**: clubs scattered on the season's two highest-variance
    64	  dims (stable + interpretable; deliberately NOT PCA — axes would flip
    65	  between seasons), with N-generation trails and cluster hulls; cluster
    66	  names generated from centroid extremes.
    67	- **Divergence dashboard**: the policy-emergence spread metric in-game
    68	  (curve over generations), per-gene mean±band sparklines, a diversity
    69	  index, per-club budget-allocation heatmap.
    70	- Engineering: SeasonRecord snapshots the population matrix (16×~40 floats);
    71	  fingerprint moves by strip-and-rehash-proven schema growth only; phone
    72	  ≤390px, i18n zh, Playwright sections.
    73	
    74	## Stage 3 — WORLD: give evolution faces and stories
    75	
    76	- **W1 Coach entity** (philosophy embodied + the memetic channel): the
    77	  tactical genome + policy genes move INTO a named, aging coach; the club
    78	  keeps squad/academy/budget/prestige/rivalries. Same genetic operators, now
    79	  with mobility: rebirth = hiring (crossover of successful coaches'
    80	  philosophies); a chronically-bottom surviving club can SACK and hire from
    81	  the pool of out-of-work coaches (dead clubs' ex-managers) — tactics spread
    82	  by movement. Coach careers, retirement, hall of fame, mentor tree (a
    83	  retiring coach's philosophy seeds a newgen coach). ⚠ The mobility channel
    84	  accelerates convergence — monoculture probes are a hard gate.
    85	- **W2 Player personal style**: a small per-PLAYER decision-bias gene set
    86	  (long-shot / take-on / one-touch / late-run appetites…) inherited through
    87	  academy heredity and transfers — the `rolePolicies` plumbing is the wire.
    88	  Traits re-derived over 8 attrs + style genes (cap 2/player, every trait
    89	  must have a play effect). Player cards get data-driven personal nameplates
    90	  + career highlight moments.
    91	- **W3 Free-agent fire-sale** (second genetic channel, minimal first cut):
    92	  a dying club's players enter a free-agent pool instead of vanishing;
    93	  clubs sign under the budget (now a real wage cap). Full active transfer
    94	  market only after the fire-sale channel's ecology is measured.
    95	- **W4 Season/cup narrative layer**: derived ENTIRELY from existing records
    96	  (points timeline, cup bracket, awards, records, rivalries, rebirths) — a
    97	  season story (when the title race was decided, the cup giant-killer, the
    98	  fallen dynasty, sackings and coronations) + a browsable chronicle
    99	  timeline; era names emerge from data clustering, never presets.
   100	
   101	## Stage 4 — SUBSTRATE thickening (long-term, pull-based)
   102	
   103	Parking-lot realism items admitted one at a time, each passing the test
   104	*"does it give genes a NEW payoff surface?"*: substitutions/bench first
   105	(rotation becomes an evolvable strategy, couples with stamina + budget),
   106	then form/morale, injuries, home-crowd effects, narrative-memory commentary.
   107	
   108	## The post-Stage-3 queue (2026-07-14 gap review, user-ratified) — ⭐ THE PHASE PLAN FOR 57+
   109	
   110	Stage 1–3 built the loop and the world; the gap review against the
   111	original vision ("好玩的,可以自我进化的,可视化优秀的,有深度的,玩着爽的,
   112	能自己产生多元化战术的,贴近现实足球") found the remaining distance
   113	concentrated in six places. **This queue IS the next phase plan** (user
   114	2026-07-14: "这些作为之后的phase计划") — work it in order, one phase per
   115	item unless a probe result re-scopes it, play reports still interleave:
   116	
   117	- ✅ **N1 — the COUNTER-PLAY probe (对战矩阵) — DONE, phase-57. VERDICT:
   118	  TRANSITIVE, the gate FIRES.** 0 cyclic / 21 fully-decisive triads; one
   119	  meta (narrow + direct + aggressive + risk-on) dominates every world's
   120	  champions. Full evidence + anatomy in the phase-57 ledger entry ⇒ N1.5.
   121	- **N1.5 — the COUNTER-PAYOFF SURFACE (inserted by N1's verdict; N5 is
   122	  HARD-GATED behind it)**: give the meta's strengths physical COSTS so
   123	  counters can EVOLVE — never hand-code the counter-tactic (the
   124	  emergence rule). One lever per phase; **the matrix probe IS the
   125	  regression gate: re-run it per lever; DONE when cycles ≥10% of
  2130	
  2131	- ⭐⭐⭐ **2026-07-19 (cont.4) WHY WIDTH LOSES TO ZONAL = the SAME delivery-
  2132	  conversion wall (`width-funnel.ts` arg[4]=zonal).** WING (width+dribble) vs a
  2133	  ZONAL defence: byline occupancy 1.13s/m (REACHES fine), crosses 5.00/m
  2134	  (SPAMS them), carry crushed to 0.22 (zonal cover works ✓) — but box@delivery
  2135	  0.12 attackers vs 0.65 defenders (EMPTIER than vs man), cross→goal 0.00,
  2136	  cutback 0.07 shots. So width vs zonal is NOT a reach/creation problem — it
  2137	  REACHES the byline and delivers, but the box is EMPTY and it all goes loose
  2138	  (3.48/5). Zonal kills the carry, and width can't capitalise because the
  2139	  DELIVERY doesn't convert into a populated box — the SAME wall as the cross
  2140	  funnel. Also: at the byline the CROSS out-scores the CUTBACK in the utility
  2141	  (5.0 crosses vs 0.07 cutback shots), so the carrier spams the worthless
  2142	  aerial instead of the ground cutback to the (open, in a zonal seam) arriver.
  2143	  ⭐ **The single remaining blocker for the WHOLE center/flank asymmetry: make
  2144	  the CUTBACK convert vs a held lattice** — arriver reliably in the seam + the
  2145	  cutback out-competes the cross/carry from wide + box presence. Zonal already
  2146	  does the hard half (kills the carry); width only needs a working ground
  2147	  delivery to pull ahead of dribble-vs-zonal (2.00). ⚠ COST: the box-crash +
  2148	  cross-gate attempt broke 3 invariant tests (finishing/onball/freeAgents) —
  2149	  this is a coordinated attacking change needing deliberate test re-anchoring +
  2150	  fingerprint rebaseline, NOT a one-liner. `width-funnel.ts` arg[4]=man|zonal.
  2151	
  2152	- ⭐⭐⭐⭐ **2026-07-19 (cont.5) THE STRUCTURAL ROOT — THE PITCH IS SIZED FOR
  2153	  11v11 BUT HAS 6 PLAYERS. This is WHY every width lever fails.** After SIX
  2154	  distinct width/cover levers this session (traffic wall · center-protect
  2155	  shape · box-crash+cross-gate · variable winger width · compactness-cover ·
  2156	  half-space run) all failed / backfired / broke tests — and the run
  2157	  repertoire (119c/d/i/j/k) hit the same wall across prior sessions — the root
  2158	  is not a missing mechanic. It is SPACE: PITCH 90×58 = 5220 m², 10 outfielders
  2159	  → **522 m²/player**. Real 11v11 ≈ 357 m²/player; real small-sided 6v6 ≈
  2160	  100-150. So the sim is a ~full-size pitch with 6-a-side personnel — ~1.5×
  2161	  sparser than 11v11, ~4× sparser than real 6v6. At that sparsity: beat one man
  2162	  = acres (carry-lock, carry-EV ≫ everything), defenders physically CANNOT
  2163	  cover (过一个还有另一个 can't form — too much ground between them), and width
  2164	  has no density to exploit (space is everywhere; overloads need not / can not
  2165	  be manufactured). The ONE thing that beats the carry — the ZONAL lattice
  2166	  (cover) — works only because it parks bodies in a block; man-marking, which
  2167	  chases into the space, gets shredded.
  2168	  - ⭐ **THE EMERGENCE-HONEST STRUCTURAL CURE: shrink the pitch toward real 6v6
  2169	    proportions** (e.g. ~55-62 × 36-40). Denser players → cover forms naturally
  2170	    (过一个还有另一个), the central carry meets bodies, width/combos have density
  2171	    to exploit → the WHOLE repertoire (cross/cutback/half-space/triangle) +
  2172	    declumping EMERGE from selection with ZERO hand-coded tactics. Preserves the
  2173	    6v6 IDENTITY (unlike 8v8/11v11), one high-leverage parameter — BUT
  2174	    rebaselines EVERYTHING (every tuned constant, goals-warming, fingerprint)
  2175	    and affects the LIVE/shipped game → the user's call. Probe first (shrink →
  2176	    carry-vs-width EV + pressure-by-zone cover) before committing.
  2177	  - Alternatives: more players (8v8/11v11 — bigger identity change); or ACCEPT
  2178	    the current substrate (carry-dominant + zonal-cover + scramble; the game is
  2179	    fun & shipped) and spend elsewhere. ⚠ Do NOT keep throwing single width
  2180	    levers — ~11 have now failed; the root is the pitch:player ratio.
  2181	
  2182	- ⭐⭐⭐⭐ **2026-07-19 (cont.6) PITCH-SHRINK PROBE (user-directed, TEMP edits
  2183	  measured + reverted) — the density hypothesis is CONFIRMED, but ONLY the
  2184	  COORDINATED shrink works; a naive pitch-only shrink WORSENS the scramble
  2185	  (the user's exact fear, measured).** Test A — shrink pitch only (90×58→56×38,
  2186	  box scaled, formations scaled proportionally, physics UNCHANGED): goals
  2187	  EXPLODED (clump-vs-wide 3.02→4.33, 15.4 shots/m), the extra goals nearly all
  2188	  walk-in + buildup (SCRAMBLE) — same-speed players on a small pitch are
  2189	  relatively too fast → frantic, more turnovers, more pinball. So naive shrink
  2190	  = MORE 乱抢, tactics BLURRED, carry still wins. Test B — COORDINATED shrink
  2191	  (also scale player BASE_SPEED ×0.62 to preserve tempo; keep physical sizes —
  2192	  tackle radius / body / header / goal — FIXED = the density lever): chaos
  2193	  TAMED (clump shots 15.4→8.1, walk-in 61→20, GF back to 2.50), cover DOUBLES
  2194	  (carry-vs-block goal-side cover 0.62→1.25, central within-6m 1.53→1.97),
  2195	  carry channel CRUSHED (clump carry 75→17; scheme DRIBBLE carry 47→11), WIDTH
  2196	  ~doubles (scheme 0.72→1.02 vs man, 0.38→0.82 vs zonal; clump WIDE 0.40→0.93).
  2197	  ⭐ **VERDICT: the coordinated pitch-shrink is the structural cure DIRECTION —
  2198	  the ONE lever (of ~11) that forms cover + tames chaos + crushes the carry +
  2199	  lifts width, and it does NOT worsen the scramble when done coordinated.** BUT
  2200	  it is NOT a complete cure yet: the RPS still isn't closed (narrow/dribble
  2201	  still wins ~2.1 vs width ~1.0, now via SET-PIECES + buildup), and set-pieces
  2202	  became over-strong (the 7m GOAL on a 38m pitch is relatively huge — the probe
  2203	  did NOT scale the goal / ball speeds / the many tuned offsets). Those
  2204	  residuals point to the FULL scope: a coordinated rebalance of pitch + box +
  2205	  GOAL + player speed + ball speeds + every tuned offset + set-piece geometry +
  2206	  full goals-warming re-derive + fingerprint rebaseline — a big, staged,
  2207	  multi-constant, likely multi-session effort on the LIVE game, possibly still
  2208	  needing width-conversion polish to fully close the RPS. The user's call:
  2209	  commit to that staged rebalance, or accept the current substrate. Probes used:
  2210	  temp edits to `constants.ts` (PITCH/BOX) + `formations.ts` (base scale) +
  2211	  `Player.ts` (BASE_SPEED) — ALL REVERTED; the 6 committed probes are the
  2212	  yardsticks for it.
  2213	
  2214	- ⭐⭐⭐⭐ **2026-07-19 (cont.7) PROJECT B — THE EMERGENT POSITIONING FIELD
  2215	  (user chose "B 优先,先开工"; the 2nd foundational defect from VISION §1).**
  2216	  The formation is a hand-authored MENU + affine transforms → shape can't
  2217	  self-adapt, positions fixed (no drop), follows the ball not the opponent,
  2218	  ~no strong/weak side, "styles" are OUR tables. Staged, toggle-gated, A/B vs
  2219	  the tables, VISION-gated (§2 watchability + §1 emergence + §3 realism):
  2220	  - **B0 DONE — `positioning-shape.ts` baseline** (committed): current shape
  2221	    quantified — ball-side shift weak ~2m & gene-flat (the compactness×0.25
  2222	    drag, not a real strong side); BUS crowds own box 0.72 vs neutral 0.39
  2223	    ("防守帮助 0"); resting spacing sane ~11m (clumping is dynamic). A/B
  2224	    yardstick + targets.
  2225	  - **B1-a DONE — `emergentStation()` behind `process.env.EMERGENT_POS`, ships
  2226	    OFF** (committed, WIP): role-anchored field (role = coarse depth+lane
  2227	    dimension) + sane modifiers + a REAL gene-weighted ball-side TRANSLATION.
  2228	    A/B: strong-side shift 2.0→3.0-3.6m + gene-differentiated (WIDE>NEUTRAL),
  2229	    spread/spacing preserved, goals sane (clump 3.15:0.70), default-off tests
  2230	    green. Structural swap done: shape = role-field + gene weights, not the
  2231	    menu. ⚠ field-ON alone does NOT fix width/carry (that's defect A density +
  2232	    B1-b/B2) — B1-a's job was the swap + real strong side, achieved.
  2233	  - **B1-b DONE** (committed): anti-clump station repulsion + box-value relief
  2234	    — BUS own-box crowd 0.72→0.48, spacing sane, still toggle-OFF.
  2235	  - **B2-lite DONE** (committed): threaded optional `opp` into formationSpot;
  2236	    the defensive spine (DF/MF) tracks a line goal-side of the opponents'
  2237	    advanced players (阵型随对面移动). Shape sane, goals sane.
  2238	  - ⭐⭐ **B3 GATE VERDICT (2026-07-19): the field FAILS goals-warming — do NOT
  2239	    ship as-is.** Real-gate A/B (`EMERGENT_POS=1` vs OFF, same worlds):
  2240	    calibrate goals 1.76→2.23 (+27%, viable); but **goals-warming inflates
  2241	    badly — world991 late-mean 4.07→5.54, world777 4.13→5.18, generational
  2242	    drift ~2× (Δ 1.3-1.45 → 2.2-3.1), conv 25→55%, overperf 1.5→2.1×.**
  2243	    Evolution exploits the field into a goal-fest. DIAGNOSIS: overperf 2.1×
  2244	    (goals ≫ xG) = chances too CLEAN → the B1-b anti-clump + box-relief spread
  2245	    the defence too thin, thinning the LAST LINE near own goal, so attackers
  2246	    get unopposed looks and evolution drives finishing/pace to cash them. The
  2247	    "don't clump" win over-corrected into "no defensive solidity."
  2248	  - **NEXT (B-continued, if pursued): restore defensive solidity** — dampen the
  2249	    anti-clump + box-relief in the defensive third / near own goal so the last
  2250	    line stays compact and protects the goal (keep the spread in midfield /
  2251	    attack). Re-run goals-warming; target the baseline arc (late-mean ~4).
  2252	    THEN B3 retire-tables + fingerprint rebaseline. The field stays toggle-OFF
  2253	    (WIP, zero production impact) until it passes goals-warming. Yardsticks:
  2254	    `goals-warming.ts` + `positioning-shape.ts` + calibrate, `EMERGENT_POS=1`.
  2255	  - ⭐⭐ **B-continued DONE — SOLIDITY FIX PASSES goals-warming (committed).**
  2256	    Threat-scaled: spread when no threat (no bus-crowd), the back/mid block
  2257	    compacts goal-ward+central under threat (deny the clean chance). A/B
  2258	    (field ON, fixed) vs baseline, same worlds: goals-warming late-means
  2259	    424242 3.97 / 991 3.50 / 777 4.36 ≈ baseline 3.47 / 4.07 / 4.13 (inflation
  2260	    TAMED — was 5.5/5.2 pre-fix), calibrate 1.92 ≈ 1.76. **The emergent field
  2261	    now PASSES the scoring gates and is ship-viable**: field-not-menu + real
  2262	    strong/weak side + anti-clump + position-by-value + opponent-tracking +
  2263	    threat-solidity, goals healthy, still toggle-OFF.
  2264	  - ⭐⭐⭐ **B3 = THE SHIP DECISION (user's — changes the LIVE game).** Remaining
  2265	    to ship: flip `EMERGENT_POS` default ON + retire the formation TABLES
  2266	    ("style" = gene weights) + remaining gates (vitest — expect fragile test
  2267	    re-anchors; visual×2) + fingerprint REBASELINE + ⭐ the WATCHABILITY check
  2268	    (VISION §2 — only the user can judge play-feel: is the shape visibly fluid
  2269	    / strong-weak side / un-clumped?). Recommended first: wire a BROWSER toggle
  2270	    (`process.env.EMERGENT_POS` is Node-only; the game is Vite/browser) so the
  2271	    user PLAY-TESTS the field before the irreversible retire+rebaseline.
  2272	  - ⭐⭐ **CORRECTION (2026-07-20, `dribble-vs-scramble.ts` — the user's reframe
  2273	    was RIGHT, my census verdict was WRONG).** The census counted a
  2274	    "breakaway family (walkin+carry+through)" and I read its rise as "more
  2275	    乱抢." But 乱抢 (scramble = pinball → breakaway) and 盘带 (clean dribble, a
  2276	    skill) are DIFFERENT. Measuring goals by whether ≥2 possession FLIPS
  2277	    preceded them in 4s: **SCRAMBLE-born goals are TINY and barely move — OFF
  2278	    2-3% → ON 5%**; 95-98% of goals are CLEAN in both. The field's carry rise
  2279	    (35→51%, 42→59%) is **almost ENTIRELY clean dribble** (clean-carry 51/58%,
  2280	    scramble-carry ~1%). So the field does NOT worsen 乱抢 — it adds clean
  2281	    dribbling, which per the user is FINE (a skill). The real remaining concern
  2282	    is VARIETY (solo-dribble share is high; VISION §3 wants cross/cutback/
  2283	    combination too) — that's the attack-repertoire / defect-A work, NOT 乱抢.
  2284	    ⚠ Caveat: this is goal-SOURCE; the VISUAL clumping/pinball frequency (what
  2285	    the user sees + dislikes) is judged by the Pages play-test, not this probe.
  2286	  - Keeper-dive render bugs fixed + DEPLOYED (feet-drift-after-landing → freeze
  2287	    dive-root; then teleport-on-claim → ease the root back). Emergent toggle
  2288	    now STICKY (localStorage), opt-in, live on Pages. `dribble-vs-scramble.ts`
  2289	    kept.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'rg -n -C 5 "grow|eyes|眼睛|感知|perception|positioning attribute|119j|119k|run repertoire|value field|价值场|decision engine" docs/EVO-BLUEPRINT.md docs/ROADMAP.md'[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
docs/EVO-BLUEPRINT.md-66-  names generated from centroid extremes.
docs/EVO-BLUEPRINT.md-67-- **Divergence dashboard**: the policy-emergence spread metric in-game
docs/EVO-BLUEPRINT.md-68-  (curve over generations), per-gene mean±band sparklines, a diversity
docs/EVO-BLUEPRINT.md-69-  index, per-club budget-allocation heatmap.
docs/EVO-BLUEPRINT.md-70-- Engineering: SeasonRecord snapshots the population matrix (16×~40 floats);
docs/EVO-BLUEPRINT.md:71:  fingerprint moves by strip-and-rehash-proven schema growth only; phone
docs/EVO-BLUEPRINT.md-72-  ≤390px, i18n zh, Playwright sections.
docs/EVO-BLUEPRINT.md-73-
docs/EVO-BLUEPRINT.md-74-## Stage 3 — WORLD: give evolution faces and stories
docs/EVO-BLUEPRINT.md-75-
docs/EVO-BLUEPRINT.md-76-- **W1 Coach entity** (philosophy embodied + the memetic channel): the
--
docs/EVO-BLUEPRINT.md-320-  SeasonRecord grew `styleMatrix` (per-club vectors, snapshotted before
docs/EVO-BLUEPRINT.md-321-  evolution) — **proven record-only by strip-and-rehash back to exactly
docs/EVO-BLUEPRINT.md-322-  `2c434e57…`**. Dataviz rules applied (entity colors, direct labels, title
docs/EVO-BLUEPRINT.md-323-  tooltips, recessive grids). vitest 323 (styleSpace.test +8), visual
docs/EVO-BLUEPRINT.md-324-  **78**+35 (3 new checks: 16 map dots, 128 heatmap cells, nameplate tags).
docs/EVO-BLUEPRINT.md:325:  Fingerprint `85a7b813…` (schema growth only).
docs/EVO-BLUEPRINT.md-326-- ✅ **phase-50 SHIPPED** (fitness slimming — Stage-1E lever 1): fitness is
docs/EVO-BLUEPRINT.md-327-  RESULTS-dominant now — points 0.50 / GD 0.25 / shotQuality 0.10 /
docs/EVO-BLUEPRINT.md-328-  styleConsistency 0.15; **passCompletion, recoveries and staminaEfficiency
docs/EVO-BLUEPRINT.md-329-  DROPPED** (three uniform-virtue rewards = hidden designer taste pushing
docs/EVO-BLUEPRINT.md-330-  every club toward one texture; `recoveries` directly fed the press
--
docs/EVO-BLUEPRINT.md-344-  的看板不直观也不够详细，演化应该单独放一个"): evolution moves OUT of the
docs/EVO-BLUEPRINT.md-345-  league screen (which returns to pure data) into its own full-screen
docs/EVO-BLUEPRINT.md-346-  `EvolutionScreen` (top-bar 🧬 演化, mutually exclusive with 联赛中心).
docs/EVO-BLUEPRINT.md-347-  Architecture, hero first: (1) the style-space map with a **generation
docs/EVO-BLUEPRINT.md-348-  scrubber + ▶ playback** — watch styles drift season by season (styleMatrix
docs/EVO-BLUEPRINT.md:349:  history), clubs clickable, trails grow during playback; (2) **club deep
docs/EVO-BLUEPRINT.md-350-  dive** — nameplate/radar vs league mean/the club's own four most-moved
docs/EVO-BLUEPRINT.md-351-  style dims as curves/budget + squad + family tree; (3) the **dynasty
docs/EVO-BLUEPRINT.md-352-  wall** — 16 slots × generations of elite/reborn/promotion events;
docs/EVO-BLUEPRINT.md-353-  (4) population trends (divergence, formation shares, budget heatmap) with
docs/EVO-BLUEPRINT.md-354-  the old 22-tile wall folded into a <details>. UI-only (no sim change, no
--
docs/EVO-BLUEPRINT.md-641-  both seeds now just under the 2.3 floor but the cross-seed spread
docs/EVO-BLUEPRINT.md-642-  finally TIGHT; play-feel decides). evolve-check 6 champions / 10
docs/EVO-BLUEPRINT.md-643-  gens. vitest **363** (+2). visual 106+35. Fingerprint **REBASELINED
docs/EVO-BLUEPRINT.md-644-  `b59eeb10…`**.
docs/EVO-BLUEPRINT.md-645-- ✅ **phase-61 SHIPPED** (**N2 — SUBSTITUTIONS / the bench**, rotation
docs/EVO-BLUEPRINT.md:646:  as an EVOLVABLE strategy; save v18): rosters grow to NINE — six
docs/EVO-BLUEPRINT.md-647-  starters + a 3-man bench with NOMINAL DF/MF/ST roles (market
docs/EVO-BLUEPRINT.md-648-  matching/records; on the pitch a sub ASSUMES the slot he replaces).
docs/EVO-BLUEPRINT.md-649-  `SQUAD_BUDGET` 24→36 = the same per-player density, so **a deep bench
docs/EVO-BLUEPRINT.md-650-  is funded by a shallower XI** — the trade-off only bites once lineages
docs/EVO-BLUEPRINT.md:651:  grow to the cap. The substrate rule is minimal (laws-of-the-game
docs/EVO-BLUEPRINT.md-652-  only): subs at dead balls + half-time, `SUBS_MAX` 3, no re-entry,
docs/EVO-BLUEPRINT.md-653-  keepers stay; **WHEN is the coach's new `rotationBias` gene** read as
docs/EVO-BLUEPRINT.md-654-  a fatigue threshold (0.25+0.5·gene), WHO OFF = the tiredest body, WHO
docs/EVO-BLUEPRINT.md-655-  ON prefers the like-for-like nominal role; the entrant swaps the pitch
docs/EVO-BLUEPRINT.md-656-  slot's IDENTITY in place (`becomeSub` — every gid-keyed reference
--
docs/EVO-BLUEPRINT.md-785-  points) over 30 seasons × 2 worlds. Verdict: **7 SELF-BALANCING
docs/EVO-BLUEPRINT.md-786-  readings** (negative FD — the style's payoff falls as it spreads:
docs/EVO-BLUEPRINT.md-787-  rotationBias −0.71, dribbleBias −0.66, markingAggression −0.56,
docs/EVO-BLUEPRINT.md-788-  attackingWidth −0.51, defensiveCompactness −0.42, atk wide-212
docs/EVO-BLUEPRINT.md-789-  −0.39, keeperAggression −0.31), ~25 neutral (drift under
docs/EVO-BLUEPRINT.md:790:  constraints), and **ZERO runaway** — no axis in either world grows
docs/EVO-BLUEPRINT.md-791-  stronger as it spreads. The user's original question ("can the game
docs/EVO-BLUEPRINT.md:792:  grow self-sustaining tactical diversity?") answers YES: the ecology
docs/EVO-BLUEPRINT.md-793-  actively self-limits its commonest styles and has no
docs/EVO-BLUEPRINT.md-794-  winner-take-all meta. The ≥10%-cycles criterion is retired with
docs/EVO-BLUEPRINT.md-795-  reasons in the N1.5 section; the matrix stays a descriptive
docs/EVO-BLUEPRINT.md-796-  anatomy tool. The which-axes-balance set differs per world —
docs/EVO-BLUEPRINT.md-797-  ecology-dependent, consistent with every N-era finding.
--
docs/EVO-BLUEPRINT.md-1450-  engine). Calibrate 2.40/2.59/2.99 (default ~0.1 under the soft
docs/EVO-BLUEPRINT.md-1451-  edge — watch, not chase). Throw seeds re-anchored 24/42/44 (6th).
docs/EVO-BLUEPRINT.md-1452-- ⚠ **phase-94 SHIPPED** (**school-linked variation + the
docs/EVO-BLUEPRINT.md-1453-  devaluation finding**; fingerprint REBASELINED `bed80ef1…`, no
docs/EVO-BLUEPRINT.md-1454-  seed re-anchors — RNG-stream neutral by construction). The
docs/EVO-BLUEPRINT.md:1455:  academy grows what the philosophy needs: newgen heirs drift
docs/EVO-BLUEPRINT.md-1456-  defending↔pace along (jockeyBias−0.5), ±0.12 max, zero-sum,
docs/EVO-BLUEPRINT.md-1457-  budget-clamped; founders/fitness pure. Mechanism VERIFIED (def
docs/EVO-BLUEPRINT.md-1458-  follows the school; 991 def 0.61 = record) but adoption still
docs/EVO-BLUEPRINT.md-1459-  fails 0/3 (jockey 0.41/0.09/0.30) — because phase-93 devalued
docs/EVO-BLUEPRINT.md-1460-  what containment prevents: an average finisher's breakaway no
--
docs/EVO-BLUEPRINT.md-1609-  holds his shape line vs off-ball runners, gated outside the −17
docs/EVO-BLUEPRINT.md-1610-  danger zone; the phase-71 law punishes. A/B: +29% offsides won,
docs/EVO-BLUEPRINT.md-1611-  goals 137-143 (real trade). Adoption 24×3: 991 → 0.74 (the trap
docs/EVO-BLUEPRINT.md-1612-  school lives), 777 → 0.62 blended, 424242 → 0.21 rejected — two
docs/EVO-BLUEPRINT.md-1613-  cultures. En route: the "zero offsides" was a detector bug (awards
docs/EVO-BLUEPRINT.md:1614:  are goal kicks); two perception-lag fixes built on it were measured
docs/EVO-BLUEPRINT.md-1615-  out and reverted; the ungated build railed to 0.08 + 8.5 goals/match
docs/EVO-BLUEPRINT.md-1616-  (box abandonment) before the gate. ⚠ watches: warming 17.71 (spread
docs/EVO-BLUEPRINT.md-1617-  top), calibrate 2024-seed 1.96 (under the hard floor, single-seed —
docs/EVO-BLUEPRINT.md-1618-  re-read next phase). launch-anatomy.ts (the 106 hand-off): breakaway
docs/EVO-BLUEPRINT.md-1619-  launches are 69-78% CARRY-THROUGH, ≤1% through-ball — the trap is
--
docs/EVO-BLUEPRINT.md-1663-  resume there.** Waiting-on-user: 105 audio ears, itch push, amb
docs/EVO-BLUEPRINT.md-1664-  seam, extra BGM tracks.
docs/EVO-BLUEPRINT.md-1665-- ⭐ **2026-07-18 THE D+C RATIFICATION** (user: "同意dc"): the
docs/EVO-BLUEPRINT.md-1666-  inflation endgame = ① dismantle the 28.4 composed-1v1 hand gift
docs/EVO-BLUEPRINT.md-1667-  (attribute-blind aim/spread bonuses — make composure
docs/EVO-BLUEPRINT.md:1668:  finishing-earned); ② school-linked variation (the academy grows
docs/EVO-BLUEPRINT.md-1669-  what the philosophy needs: bloodline attr drift toward defending
docs/EVO-BLUEPRINT.md-1670-  scaled by jockeyBias) — fixing DISCOVERY across the two-locus
docs/EVO-BLUEPRINT.md-1671-  valley while fitness stays pure results; ③ the fitness anchor is
docs/EVO-BLUEPRINT.md-1672-  PRE-AUTHORIZED as fallback only if the 24-gen verdict gate still
docs/EVO-BLUEPRINT.md-1673-  fails (modest λ, swept, tradeoff documented). Also ratified:
--
docs/EVO-BLUEPRINT.md-1956-  old genes carrying the appetite. The bottleneck is RETURN QUALITY —
docs/EVO-BLUEPRINT.md-1957-  A gets open but can't convert the received ball — which points at A's
docs/EVO-BLUEPRINT.md-1958-  off-ball run-timing + first touch = the MISSING positioning/off-ball-IQ
docs/EVO-BLUEPRINT.md-1959-  attr. So the seven's real enabler may be the positioning ATTRIBUTE
docs/EVO-BLUEPRINT.md-1960-  (let A's run + touch quality evolve), not a scoring boost on the pass.
docs/EVO-BLUEPRINT.md:1961:- ⭐⭐ **2026-07-19 119j — the POSITIONING ATTRIBUTE SHIPPED (foundation +
docs/EVO-BLUEPRINT.md-1962-  reception wiring).** Added `positioning` as the 9th player attr
docs/EVO-BLUEPRINT.md-1963-  (appended LAST in ATTR_KEYS → founders' other attrs byte-identical),
docs/EVO-BLUEPRINT.md-1964-  SQUAD_BUDGET 36→40.5 (9×9×0.5, density-preserving = a real trade-off,
docs/EVO-BLUEPRINT.md-1965-  not free), save v32 with a TOP-OF-CHAIN backfill (⚠ durable gotcha:
docs/EVO-BLUEPRINT.md-1966-  the v17→v18 migration runs enforceBudget → a squad missing the 9th
--
docs/EVO-BLUEPRINT.md-1969-  under pressure (`touchFailChance` positioning term taming pressure+
docs/EVO-BLUEPRINT.md-1970-  blind penalties, neutral at 0.5). VERDICT — validated but WEAK on this
docs/EVO-BLUEPRINT.md-1971-  channel: maxed BITES (spills −19%) but goal-NEUTRAL; fresh-evo selects
docs/EVO-BLUEPRINT.md-1972-  only mildly (0.39→0.43-0.46) because possession-retention is weakly
docs/EVO-BLUEPRINT.md-1973-  rewarded here. Reception is the WEAKEST wiring point — the payoff is
docs/EVO-BLUEPRINT.md:1974:  the IMPACTFUL ones (run-timing + defensive reads, = 119k), then
docs/EVO-BLUEPRINT.md-1975-  re-attempt the give-and-go with positioning making A's reception clean.
docs/EVO-BLUEPRINT.md-1976-  Gates: goals-warming 11.67≈11.54 (zero inflation), vitest 441 (+2
docs/EVO-BLUEPRINT.md-1977-  re-anchors), visual 136+51, fingerprint `d309f250`, save v32. ⭐ LESSON:
docs/EVO-BLUEPRINT.md-1978-  an attribute's first wiring should target a WELL-REWARDED outcome
docs/EVO-BLUEPRINT.md-1979-  (chance creation/prevention), not a weakly-rewarded one (possession
--
docs/ROADMAP.md-62-  (crash the box on a delivery; proactive drop/arrive to receive) — the SAME root
docs/ROADMAP.md-63-  as combo-reliability + check-to-ball (step-4). `supportSpot` is always AHEAD of
docs/ROADMAP.md-64-  the ball & nobody attacks the 6-yd/penalty-spot on a wide ball.** This is the
docs/ROADMAP.md-65-  next probe-first lever (gene-gated arrival, NOT a scripted run). cf. the earlier
docs/ROADMAP.md-66-  obs8 pass-power revert — same lesson, combo bottleneck is upstream positioning.
docs/ROADMAP.md:67:- ⭐⭐ **DESIGN + VISION UPDATED → "让球员/教练自己长眼睛" (gene-weighted SPACE-VALUE
docs/ROADMAP.md-68-  field, two levels: player-local + coach-global). VISION §1 rewritten with the
docs/ROADMAP.md:69:  user's words (内切/包抄/回撤 should EMERGE from ONE value field, not be hand-added).
docs/ROADMAP.md:70:  Tasks re-cut (#2 player value field · #3 cut-inside via same logic on carry
docs/ROADMAP.md:71:  direction · #5 width-floor deferred · #6 coach-global value field · #7 possession
docs/ROADMAP.md-72-  contest+transition).**
docs/ROADMAP.md:73:- ⭐⭐ **FIRST CUT of the value field REVERTED (honest-revert, 2nd this session) — but
docs/ROADMAP.md-74-  a KEY DESIGN CORRECTION.** Rewrote `supportSpot` into a gene-weighted candidate
docs/ROADMAP.md-75-  scorer (base + box-crash + drop candidates, scored by openness+receivability−clump
docs/ROADMAP.md-76-  + gene/attr appetite). A/B: box-arrival did NOT emerge (`cross-anatomy` noAerial
docs/ROADMAP.md-77-  46→50% / 54→59% — box got EMPTIER), §2 regressed (`calibrate` goals 2.00→2.42 +21%,
docs/ROADMAP.md-78-  cutbacks 3.69→3.29, headers 10.5→7.8), width didn't rise (`scheme-matchup` W-v-Z
docs/ROADMAP.md:79:  0.67→0.48). **LESSON: an openness-maximizing value field is the WRONG model for
docs/ROADMAP.md-80-  BOX-ARRIVAL — the box is a LOW-openness contested zone, so the scorer AVOIDS it +
docs/ROADMAP.md-81-  scatters supporters into empty pockets (→ emptier box, +turnovers, +goals).**
docs/ROADMAP.md-82-  → **Split the design: (a) CHECK-TO-BALL / support / overload / drop = genuinely a
docs/ROADMAP.md-83-  space-value(openness) field ✅; (b) BOX-ARRIVAL = delivery-ANTICIPATION, NOT
docs/ROADMAP.md-84-  openness — must be COUPLED to an imminent wide delivery (extend `TeamBrain.
docs/ROADMAP.md-85-  assignRunners` arriver → gene-scaled multi-body crash, TIMED like the corner
docs/ROADMAP.md-86-  hold→burst), the cutback-arriver mechanism generalized.** Do box-arrival (a
docs/ROADMAP.md-87-  delivery-coupled licensing change) as the next cut; keep the value-field for
docs/ROADMAP.md-88-  check-to-ball separate.
docs/ROADMAP.md:89:- ⭐⭐⭐ **CUT 2 (two-eye value field: space + BALL, per user "得知道空间在哪+球在哪")
docs/ROADMAP.md-90-  ALSO REVERTED — same signature. → STOP hammering box-arrival-via-supportSpot;
docs/ROADMAP.md-91-  RE-DIAGNOSE.** Both cuts: box did NOT fill (`cross-anatomy` noAerial 46→51%), §2
docs/ROADMAP.md-92-  regressed (goals 2.00→2.41 +20%, **offsides 2.20→3.36 +50%**), width did NOT rise
docs/ROADMAP.md-93-  (`scheme-matchup` W-v-Z 0.67→0.48). **THE OFFSIDES SPIKE is the tell: bodies DO try
docs/ROADMAP.md-94-  to attack the box now but arrive OFFSIDE (uncoordinated with the delivery) → box
--
docs/ROADMAP.md-111-  accept it as the low-yield supporting weapon it realistically is.** Awaiting user steer.
docs/ROADMAP.md-112-- Tree left CLEAN at HEAD `ed62978` (only ledger/VISION docs changed). Baselines
docs/ROADMAP.md-113-  saved this session: calibrate goals 2.00 / cutbacks 3.69 / compl 75%; posshape
docs/ROADMAP.md-114-  WIDE 6.4 / NARROW 5.2; clump-vs-wide 3.48/1.02; cross noAerial 46/54%; cutback
docs/ROADMAP.md-115-  20%→shot 5.3% goal; scheme-matchup W-v-Z 0.67 / W-v-M 1.02 / D-v-M 3.18 / D-v-Z 2.23.
docs/ROADMAP.md:116:- ⭐⭐⭐ **VISION §1 EXTENDED to the full perception→value→action ENGINE (user ratified
docs/ROADMAP.md-117-  "从底层做了一个足球引擎,方向是对的").** Eyes = 球+对手+队友+场地+**自身**(朝向/我的属性/
docs/ROADMAP.md-118-  体能)+**动态·预判**(对手结构=提前观察+预判);space is DERIVED; inputs feed multi-dims
docs/ROADMAP.md:119:  (space/threat/receive/goal); **eye-QUALITY = an attribute** (长眼睛本身分化). Honest cost
docs/ROADMAP.md-120-  named: engine-first is 承重级/slower/"worse-before-better" → build incrementally, keep the
docs/ROADMAP.md-121-  baseline revertible, each engine piece must BEAT §2 to ship.
docs/ROADMAP.md-122-- ⭐⭐⭐ **ATTRIBUTE AUDIT (the engine's INPUTS; ATTR_KEYS ×9, budget SQUAD_BUDGET 40.5):
docs/ROADMAP.md-123-  3 wasteful + 1 missing + 3 attr-blind.** DEAD/WEAK (eat budget, ~no effect): **`reflexes`
docs/ROADMAP.md-124-  = DEAD for 8/9 (GK-only reads)**; **`positioning` = near-inert** (only a first-touch
docs/ROADMAP.md-125-  sub-term; its docstring's off-ball IQ never shipped) — ironically the attr the SELF/off-ball
docs/ROADMAP.md-126-  eye needs; **`strength` = one-trick** (aerialSense 0.30, near-decorative on the ground).
docs/ROADMAP.md-127-  STRONG/live: pace · passing · dribbling · finishing · defending (stamina medium). ATTR-BLIND
docs/ROADMAP.md-128-  mechanics (flat constant an attr could bite NOW): **`TURN_RATE` 6.5** (agility — everyone
docs/ROADMAP.md-129-  turns identically; bites cut-inside/1v1), **`SHOT_SPEED` 27** (open-play shot power flat),
docs/ROADMAP.md:130:  and **perception = PERFECT full-field for ALL — NO vision/awareness attr** (only the
docs/ROADMAP.md:131:  `playmaker` trait) = the biggest gap + exactly the "eye-quality" the eyes model needs.
docs/ROADMAP.md-132-  Gaps ranked: vision/awareness(1) · agility/turn(2) · positioning-made-live(3, fix-not-add) ·
docs/ROADMAP.md-133-  composure(4) · raw aerial/jump(5) · shot-power(6) · tackle-vs-mark(7) · accel-vs-topspeed(8) ·
docs/ROADMAP.md-134-  weak-foot(10, needs NEW mechanics). → **engine-input cleanup = reclaim reflexes budget +
docs/ROADMAP.md-135-  add `vision` (eye-quality) + wire `positioning` live; genome change = save-ver bump +
docs/ROADMAP.md-136-  fingerprint rebaseline = USER's architectural call.**
--
docs/ROADMAP.md-149-
docs/ROADMAP.md-150-✅ **#1 DECIDED 2026-07-20 — the density 相变 is a KEEP.** User play-tested and
docs/ROADMAP.md-151-判决: "观赏性我觉得没问题,可以go,你自走吧" (watchability is fine → GO; self-drive).
docs/ROADMAP.md-152-PITCH_SCALE 0.70 + emergent positioning DEFAULT are now the confirmed baseline,
docs/ROADMAP.md-153-not a candidate. Data said GO (cutbacks +235%, scramble-born goals flat 4–7% to
docs/ROADMAP.md:154:0.70, goal inflation DOWN) and the user's eyes agree on VISION §2. Sequence
docs/ROADMAP.md-155-unblocked → now on **step 2: retire the compensating width hand-biases + re-run
docs/ROADMAP.md-156-evo + OBSERVE diversity on the denser pitch.**
docs/ROADMAP.md-157-
docs/ROADMAP.md-158-**GAP BASELINE (code-verified inventory 2026-07-20). The substrate is FAR more
docs/ROADMAP.md-159-complete than a "missing systems" story — most of real football's repertoire
--
docs/ROADMAP.md-216-  diagrams; `GameApp.readEmergentPos` default true). 26 tests re-baselined for the
docs/ROADMAP.md-217-  new geometry (subagent, only tests/, no assertion gutted, verified). Gates at the
docs/ROADMAP.md-218-  new default: **calibrate cutbacks 1.10→3.69 (+235%)**, completion 75%, goals 2.00,
docs/ROADMAP.md-219-  balanced; **goals-warming late-mean 4.35 avg (DOWN from the old pitch's 5.07 —
docs/ROADMAP.md-220-  LESS inflation)**. tsc+build+441 tests green.
docs/ROADMAP.md:221:- ⚠ **NOT yet the final verdict:** VISION §2 watchability is the USER'S eyes
docs/ROADMAP.md-222-  (trust the browser). Awaiting the play-test: does 0.70 look good / not cramped /
docs/ROADMAP.md-223-  tactics legible? goals 2.00 is a touch low (small goal) — nudge goal scale up if
docs/ROADMAP.md-224-  they want more scoring. **Honest-revert if §2 fails visually.** PITCH_SCALE=1
docs/ROADMAP.md-225-  restores the old pitch.
docs/ROADMAP.md-226-- **Dribble philosophy DECIDED: 忠于脚 (real touch cadence, sim-level)** — queued
--
docs/ROADMAP.md-490-parent's style and coaches carry theirs, so discovered shapes spread
docs/ROADMAP.md-491-on RESULTS through all three channels. **Emergence verdict (60 gens ×
docs/ROADMAP.md-492-2 worlds): tried in both; in world 991 false-nine became a genuine
docs/ROADMAP.md-493-discovered meta (peak 9/16) and gen-60 shows THREE attack shapes
docs/ROADMAP.md-494-coexisting (wide 3 / narrow 6 / false-nine 7) — the first structural
docs/ROADMAP.md:495:divergence the game has ever grown. No monoculture.** Head-to-head
docs/ROADMAP.md-496-the novel shapes are honest, not OP (twin-st 70-82 W-L, false-nine
docs/ROADMAP.md-497-77-86 vs wide-212). Also: the 41.2 heat properly tempered at the
docs/ROADMAP.md-498-SOURCE — slalom perp cap 1→0.72 (drive knob measured saturated) —
docs/ROADMAP.md-499-calibrate 2.76/2.06/3.26 (mean 2.69, from 2.88); pirouettes hold at
docs/ROADMAP.md-500-0.58/match, spin→tackle 0.03. Width master gate re-passed (0.42@gen30).
--
docs/ROADMAP.md-844-window, world variance); vitest 413; visual 109+53; fingerprint
docs/ROADMAP.md-845-REBASELINED `8e1b75e2…`.)
docs/ROADMAP.md-846-+ ⚠⚠ **phase-84 SHIPPED** (**inflation = CONVERSION, not volume** —
docs/ROADMAP.md-847-goals-warming now splits the economy per season: shots barely move
docs/ROADMAP.md-848-(8→8-11.5) while xG/shot DOUBLES (0.16→0.23-0.33) and
docs/ROADMAP.md:849:overperformance-vs-xG grows 1.7×→2.2-2.5× — late-gen leagues
docs/ROADMAP.md-850-convert 58-77% of ALL shots (real football: 10-12%, 1v1s ~40%).
docs/ROADMAP.md-851-Two coupled holes: evolution (a) manufactures ever-better chances
docs/ROADMAP.md-852-and (b) finds shot CONTEXTS the xG model underprices where the
docs/ROADMAP.md-853-keeper is structurally dead — while defense has NO evolving
docs/ROADMAP.md-854-counter-gradient at the point of conversion. THE PLAN (user
--
docs/ROADMAP.md-1446-story:** ① `launch-anatomy.ts` (the 106 hand-off): breakaway launches
docs/ROADMAP.md-1447-are carry-through 69-78%, through-ball ≤1% — the trap is school
docs/ROADMAP.md-1448-completeness, NOT an inflation lever; the arc's real target remains
docs/ROADMAP.md-1449-the 1v1 carry-through at the line. ② Baseline offsides were always
docs/ROADMAP.md-1450-~1.09/match — the first "zero" was a DETECTOR bug (offside awards are
docs/ROADMAP.md:1451:GOAL KICKS, the 29.2 arcade rule). ③ Two "perception lag" fixes
docs/ROADMAP.md-1452-(runner + passer line reads) built on that false zero were MEASURED
docs/ROADMAP.md-1453-OUT by foreground stash A/B — gene-only springs BETTER (1.68 vs 1.13)
docs/ROADMAP.md-1454-than with lags (1.38/1.06; a stale read of a rising line makes runners
docs/ROADMAP.md-1455-hold conservatively) → lags reverted, archaeology in the executor.
docs/ROADMAP.md-1456-④ The UNGATED first build was selection-poison: trapBias railed to
--
docs/ROADMAP.md-1607-
docs/ROADMAP.md-1608-⭐⭐⭐ **THE NEXT 自走 QUEUE v2 (2026-07-18 night — ⭐ THE RESUME POINT
docs/ROADMAP.md-1609-after the user's compact; user-ratified: "这几个写入吧" against the
docs/ROADMAP.md-1610-UI-audit + counter-defense conversation, plus their own additions).
docs/ROADMAP.md-1611-⭐⭐ SESSION HANDOFF (2026-07-19 cont., width investigation). Repo is
docs/ROADMAP.md:1612:CLEAN at fingerprint `d309f250` (= phase-119j); this session shipped NO
docs/ROADMAP.md-1613-sim change — both fix prongs were ATTEMPTED, A/B-tested, and REVERTED.
docs/ROADMAP.md-1614-Only additions: `scripts/probes/width-funnel.ts` (kept) + these ledger
docs/ROADMAP.md-1615-notes. ⭐ WHAT WE LEARNED (full anatomy in EVO-BLUEPRINT under "THE
docs/ROADMAP.md-1616-WIDTH-FUNNEL DIAGNOSIS"): the user asked whether 下底传中/45°/内切/套边
docs/ROADMAP.md-1617-can EMERGE, why central dribble penetrates, and about 补防. (1) **补防
--
docs/ROADMAP.md-1667-making a combination fire ≠ making it PAY; the bottleneck is RETURN
docs/ROADMAP.md-1668-QUALITY (A gets open at 5.5m but can't convert the received ball) =
docs/ROADMAP.md-1669-A's off-ball run-timing + first touch = ⭐⭐ THE MISSING POSITIONING /
docs/ROADMAP.md-1670-OFF-BALL-IQ ATTRIBUTE. Five levers now converge here (119c, 119d-1×4,
docs/ROADMAP.md-1671-119i): off-ball actions don't pay AND players can't individually
docs/ROADMAP.md:1672:create/exploit space. The real enabler = the positioning attr. ⭐⭐ 119j SHIPPED
docs/ROADMAP.md-1673-2026-07-19 (user "开始"): the POSITIONING attribute added (9th attr,
docs/ROADMAP.md-1674-SQUAD_BUDGET 36→40.5 density-preserving, save v32, fingerprint
docs/ROADMAP.md-1675-`d309f250`), first wiring point = reception-under-pressure. Validated
docs/ROADMAP.md-1676-but WEAK on this channel (maxed bites −19% spills but goal-neutral;
docs/ROADMAP.md-1677-fresh-evo selects mildly 0.39→0.43-0.46) — possession-retention is
docs/ROADMAP.md-1678-weakly rewarded here, so reception is the weakest wiring point. ZERO
docs/ROADMAP.md-1679-inflation (goals-warming 11.67≈11.54), vitest 441 (+2 re-anchors),
docs/ROADMAP.md:1680:visual 136+54. ⭐ NEXT 119k: the IMPACTFUL wiring — run-timing +
docs/ROADMAP.md-1681-defensive reads — then re-attempt the give-and-go with positioning
docs/ROADMAP.md-1682-making A's reception clean. ⭐ STRATEGIC BACKLOG written: attribute/gene audit vs
docs/ROADMAP.md-1683-FIFA/FM/PES (positioning attr = deepest missing; GK split;
docs/ROADMAP.md-1684-heading/accel/tackling splits). Also queued: 119g(b) pre-match
docs/ROADMAP.md-1685-behavioural plan (attacking-side/upstream only), give-and-go (119d).
--
docs/ROADMAP.md-1774-leave no note; only rebirths snapshot style) → now RECORDED per
docs/ROADMAP.md-1775-season on `styleMatrix` rows (`style: TeamStyle`, save v29,
docs/ROADMAP.md-1776-migration + tests; strip-proof: v29 minus the field re-hashes to
docs/ROADMAP.md-1777-`8c6330b2…` EXACTLY, new baseline `f032c705…`) — drift panel shows
docs/ROADMAP.md-1778-⚔/🛡 era-strip-style timelines (palettes now shared consts with the
docs/ROADMAP.md:1779:population strips), growing from v29 on. ② PERFORMANCE TRAJECTORY:
docs/ROADMAP.md-1780-per-club ELO + FITNESS across generations — both sat fully recorded
docs/ROADMAP.md-1781-in history (`table[].elo`, `fitness[].total`), never plotted;
docs/ROADMAP.md-1782-self-normalized sparklines with raw latest in the head
docs/ROADMAP.md-1783-(`sparklineTile` gains `latestLabel`). ③ the DUGOUT on the wall:
docs/ROADMAP.md-1784-lineage's sacked/hired/coach-retired events (recorded since 53,
--
docs/ROADMAP.md-1838-没有变"): the heatmap was a live-only snapshot that ignored the
docs/ROADMAP.md-1839-generation scrubber — per-club attr summaries now RECORDED on
docs/ROADMAP.md-1840-styleMatrix rows (save v31; strip-proof: v31 minus `attrs` re-hashes
docs/ROADMAP.md-1841-to `e95c9d2b…` EXACTLY, new baseline `093da5bd…`), and the heatmap
docs/ROADMAP.md-1842-re-renders with the scrubbed frame (old records show the honest
docs/ROADMAP.md:1843:empty note; history grows from here). ② top-bar order = the user's
docs/ROADMAP.md-1844-reading order: 联赛中心 · 演化 · 球队 · 球员. ③ SPACEBAR toggles
docs/ROADMAP.md-1845-pause/play (guarded: not while typing / on a focused control;
docs/ROADMAP.md-1846-suite-checked). Gates: vitest 441 green, visual 127+53, build clean.
docs/ROADMAP.md-1847-
docs/ROADMAP.md-1848-**119a — PLAYER CARD upgrade** ✅ **SHIPPED 2026-07-18 (user ask:
--
docs/ROADMAP.md-2175-finishing/defending/strength/stamina/reflexes) + 23 team genes + 9
docs/ROADMAP.md-2176-derived traits. Cross-referenced against the standard football-sim
docs/ROADMAP.md-2177-taxonomies, split into HAVE-BUT-PRESET-DEAD (coupled, can't evolve
docs/ROADMAP.md-2178-independently) and MISSING-BUT-NEEDED. ⚠ SQUAD_BUDGET makes attrs
docs/ROADMAP.md-2179-trade off — every new attr re-prices the whole economy (the reason
docs/ROADMAP.md:2180:5→8 growth was PARKED at phase-47); each must EARN its place, add
docs/ROADMAP.md-2181-deliberately, not wholesale.
docs/ROADMAP.md-2182-- ⭐ **Positioning / off-ball intelligence / anticipation** — MISSING,
docs/ROADMAP.md-2183-  the deepest gap: all positioning is team-gene + formation-table +
docs/ROADMAP.md-2184-  brain logic; NO player-level "reads space / times runs" attr. Sits
docs/ROADMAP.md-2185-  directly under the off-ball-separation wall (119d-1) + the
--
docs/ROADMAP.md-2267-return = the MISSING positioning/off-ball-IQ attr. A/B metric for the
docs/ROADMAP.md-2268-next try = combination goals up AND evolution KEEPS the appetite (gate
docs/ROADMAP.md-2269-holds) AND goals floor held. Probes kept: `wallrun-anatomy.ts`,
docs/ROADMAP.md-2270-`quadrant-balance.ts`, `scheme-balance.ts`.
docs/ROADMAP.md-2271-
docs/ROADMAP.md:2272:**119j — the POSITIONING ATTRIBUTE, foundation + reception wiring** ✅
docs/ROADMAP.md-2273-**SHIPPED 2026-07-19 (user "开始"; the 9th attribute, the enabler the
docs/ROADMAP.md-2274-seven need).** The give-and-go failed because the RETURN QUALITY (A
docs/ROADMAP.md-2275-can't convert the received ball) is un-evolvable — all off-ball quality
docs/ROADMAP.md-2276-was team-gene + formation-table + uniform brain logic, no PER-PLAYER
docs/ROADMAP.md-2277-"reads space / times runs / receives under pressure". So: added
--
docs/ROADMAP.md-2296-4.13) ≈ 11.54 baseline (ZERO inflation — the density-preserving budget
docs/ROADMAP.md-2297-raise worked), calibrate 1.76/2.05/2.25 (early band), vitest 441 (+2
docs/ROADMAP.md-2298-re-anchors: shapeHistory attr-count → ATTR_KEYS.length, league v13
docs/ROADMAP.md-2299-migration robust to the new attr), visual 136+54 (radar auto-gains the
docs/ROADMAP.md-2300-9th axis), fingerprint REBASELINED `d309f250…`, save v32.
docs/ROADMAP.md:2301:⭐ NEXT (119k): the IMPACTFUL wiring — (1) run TIMING off the offside
docs/ROADMAP.md-2302-hold (positioning times the break: onside + arrives with the ball),
docs/ROADMAP.md-2303-(2) DEFENSIVE reads (interception/cover positioning — the shape-holding
docs/ROADMAP.md-2304-cover that also kills the 乱抢 free-1v1), then re-attempt the give-and-go
docs/ROADMAP.md-2305-with positioning making A's return-reception clean. A/B each: does a
docs/ROADMAP.md-2306-positioning archetype EMERGE and win, do the seven start appearing, is
docs/ROADMAP.md-2307-the aggressive-zonal wall finally breakable (quadrant metric).
docs/ROADMAP.md-2308-
docs/ROADMAP.md:2309:**119k — POSITIONING wiring points 2-3 (run-timing + defensive reads)**
docs/ROADMAP.md-2310-⚠️ **PROBED → BOTH MARGINAL, NOT SHIPPED (fast maxed-test caught them
docs/ROADMAP.md-2311-before any evolution burn; fingerprint stays `d309f250`).** Two more
docs/ROADMAP.md-2312-wiring points tried, each killed by the `positioning-bite.ts` maxed
docs/ROADMAP.md-2313-test: ① SEAM RUN (runTarget pulls a high-positioning runner's Y toward
docs/ROADMAP.md-2314-the largest gap in the defensive line) — REFUTED, pos-0.9 scored LEAST
docs/ROADMAP.md-2315-(GF 1.35 vs pos-0.1 1.50) and conceded MOST (1.56): "run to the biggest
docs/ROADMAP.md-2316-gap" is a hand-coded SINGLE pattern that disrupts shape, not a chance-
docs/ROADMAP.md-2317-creator (the ball must arrive there AND the space ahead is still
docs/ROADMAP.md-2318-defended). ② INTERCEPTION READ (canInterceptPass timing margin scaled
docs/ROADMAP.md-2319-by positioning) — WEAK, pos-0.9 GA 1.43 vs pos-0.1 1.48 (−0.05, noise).
docs/ROADMAP.md:2320:⭐ THE PATTERN (three wiring points now: 119j reception weak, seam-run
docs/ROADMAP.md-2321-negative, interception weak): individual positioning quality-scalers
docs/ROADMAP.md-2322-all move only the MARGINS, because the engine's scoring is dominated by
docs/ROADMAP.md-2323-the carry / scramble / transition economy — improving reception /
docs/ROADMAP.md-2324-interception / run-target quality doesn't touch it. ⭐⭐ THE USER'S
docs/ROADMAP.md:2325:REFRAME (2026-07-19, mid-119k — "跑位其实也很多变…鱼钩跑,肋部跑,拉边,
docs/ROADMAP.md-2326-套边"): the seam-run failed for a DEEPER reason — I hand-coded ONE run.
docs/ROADMAP.md-2327-Real off-ball movement is a VARIED REPERTOIRE (fish-hook / check-and-go,
docs/ROADMAP.md-2328-half-space 肋部, pull-wide 拉边, overlap 套边…), and WHICH run fits the
docs/ROADMAP.md-2329-moment must EMERGE from the substrate + genes + positioning, not be
docs/ROADMAP.md-2330-hand-set. So the attacking side becomes 119l (a real emergence project),
--
docs/ROADMAP.md-2339-exist hand-licensed at the team level (overlap 套边, the arriver, the
docs/ROADMAP.md-2340-weak-side far-post pull) — the project is to make the repertoire
docs/ROADMAP.md-2341-per-player + evolvable, not TeamBrain-thresholded. This is the honest
docs/ROADMAP.md-2342-form of "make the seven emerge" for the attacking side; big, probe-
docs/ROADMAP.md-2343-first, maxed-test each primitive (does it create chances vs a set line
docs/ROADMAP.md:2344:without just feeding the carry). ⚠ The 119k lesson: do NOT hand-code a
docs/ROADMAP.md-2345-single run pattern; build the repertoire + let selection choose.
docs/ROADMAP.md-2346-⭐ BASELINE PROBED (2026-07-19, `run-repertoire.ts`, gen 21) — the
docs/ROADMAP.md-2347-PREMISE IS UNDERCUT: runs are TIGHTLY marked (83%/69% have a marker) and
docs/ROADMAP.md-2348-DO get open (peak separation 5.6m), but are FOUND (a pass aimed at the
docs/ROADMAP.md-2349-runner) only **14-16%** and convert ≈0%. So the bottleneck is NOT run
--
docs/ROADMAP.md-2351-monoculture, 6v6-space-locked: beat one man = through, so carry-EV >
docs/ROADMAP.md-2352-pass-EV). A fancier repertoire helps ONLY if it makes runs SERVED — the
docs/ROADMAP.md-2353-run must DRAG the marker to open the LANE (not merely the runner's own
docs/ROADMAP.md-2354-separation), raising the found rate, AND the carrier's carry-vs-pass
docs/ROADMAP.md-2355-economy must shift. Same carry wall every attacking lever hit this
docs/ROADMAP.md:2356:session (119c, 119d-1×4, 119i, 119j, 119k). ⭐ IMPLICATION: try the run
docs/ROADMAP.md-2357-repertoire ONLY as "drag-the-marker-to-open-the-lane" (a served-run
docs/ROADMAP.md-2358-primitive, maxed-tested on the FOUND rate), not prettier in-behind runs.
docs/ROADMAP.md-2359-If that too hits the wall, the arc's terminal finding stands: the attack
docs/ROADMAP.md-2360-is carry-locked and only 11v11 (more space → beat one man ≠ through)
docs/ROADMAP.md-2361-structurally breaks it. `run-repertoire.ts` kept.
--
docs/ROADMAP.md-2425-goals-warming 24g (direction: late means ↓), calibrate early band
docs/ROADMAP.md-2426-holds ~2.5-3.4. Expect keeper-throw/card seed re-anchors (6th dance).
docs/ROADMAP.md-2427-
docs/ROADMAP.md-2428-**94 — C: school-linked variation** (user-ratified). The two-locus
docs/ROADMAP.md-2429-valley: jockey needs defending. Fix DISCOVERY, not the objective:
docs/ROADMAP.md:2430:the academy grows what the coach's philosophy needs —
docs/ROADMAP.md-2431-`newgenFromBloodline` gains a philosophy pull (attr drift toward
docs/ROADMAP.md-2432-defending scaled by (jockeyBias−0.5), budget-clamped, and the
docs/ROADMAP.md-2433-mirror: dive-in coaches drift pace). Founders/fitness untouched.
docs/ROADMAP.md-2434-Gates: 24g warming — jockey ADOPTION stability (≥2/3 worlds hold
docs/ROADMAP.md-2435->0.5 when it pays) + def attr movement; goals direction.
--
docs/ROADMAP.md-2535-Standing rules (full detail in [`ARCHITECTURE.md`](ARCHITECTURE.md) §10–13):
docs/ROADMAP.md-2536-**every phase ends with PROBE evidence** (user rule 2026-07-13, invariant
docs/ROADMAP.md-2537-11: a `scripts/probes/` tsx measuring the mechanic's own rate/shape —
docs/ROADMAP.md-2538-same-seed A/B vs the previous tag for "X improved" claims, two calibrate
docs/ROADMAP.md-2539-seeds before believing deltas, headless choreography probes for
docs/ROADMAP.md:2540:render-side logic, strip-and-rehash for schema growth);
docs/ROADMAP.md-2541-every step ends with typecheck + full vitest + both Playwright suites green;
docs/ROADMAP.md-2542-push via `gh auth switch --user Quarkgluonmixture`, then switch back; verify
docs/ROADMAP.md-2543-the Pages bundle after CI; itch.io needs a manual `npm run package:itch`;
docs/ROADMAP.md-2544-re-baseline the determinism fingerprint after mechanics changes;
docs/ROADMAP.md-2545-**calibrate noise on goals is ±0.3–0.4 at the default n=142 — ALWAYS

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba docs/ROADMAP.md | sed -n '1,230p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	# Roadmap — shipped through phase-92 (containment repriced: wins neutral head-to-head; adoption still unstable — the fork sharpens)
     2	
     3	## ⭐⭐⭐⭐ THE GOLD STANDARD IS [`VISION.md`](VISION.md) (2026-07-19) — measure every decision against it
     4	## ⭐⭐⭐ THE MASTER PLAN IS NOW [`EVO-BLUEPRINT.md`](EVO-BLUEPRINT.md) (2026-07-14, user-ratified)
     5	
     6	> 🎯 **RESUME (2026-07-20, post-compact): TASK #8 甲 — sub-step 1 DONE (uncommitted).**
     7	> ✅ **POSITION-AWARE BUDGET landed** (`playerGenome.ts` `countsForBudget` + `squadTotal`;
     8	> `SQUAD_BUDGET` 40.5→35.5; `League.ts` fire-sale headroom + v32→v33 migration; SAVE_VERSION
     9	> 32→33). reflexes = keeper-only (8 outfielders freed); **finishing/defending free for the GK**
    10	> (dead — never shoots/tackles) → the keeper's budget base is its OWN. Cap dropped in lockstep
    11	> (71 counted slots × 0.5) so useful density stays 0.5. **VALIDATED: tsc clean · §2 BIT-IDENTICAL
    12	> @8-season gate · @25-season tracks OLD within noise (goals 3.30 vs 3.19, all else ≈identical) ·
    13	> cap binds 56% @25 · GK base differentiated (GK finishing 0.28 vs ST 0.56).** ⚠ NOT committed
    14	> (user hasn't asked); genome/save-ver change = user's 甲 call (confirmed).
    15	>
    16	> **→ NEXT = the OUTFIELD BASE (user 2026-07-20: "门将底座没必要大手笔…但场上踢的是真的影响,
    17	> 底座需要做的很好" = keep GK LIGHT ✓done, invest the real substrate work in the OUTFIELD).**
    18	> ⚠️ **Sub-step 2 (vision attr) FIRST CUT = "读数精度 on PASSING" — TRIED + REVERTED (honest-revert,
    19	> §2 hard gate).** Added `vision` (10th attr, budget 35.5→40.0) + wired it as a continuous
    20	> lane-read multiplier replacing the binary `playmaker` ×1.15. BOTH tunings FAILED §2: goals
    21	> +23% (lane+open) / +17% (lane-only, mean-centred), headers −25–34%, aerial route collapses.
    22	> **STRUCTURAL, not a tuning miss: passing→goals is CONVEX, so making the best passers sharper
    23	> inflates scoring even with a mean-preserving spread — a one-sided attacking buff.** Fully
    24	> reverted → tree bit-identical to sub-step-1 baseline again. **→ the fix (user's call, asked):
    25	> vision must be applied SYMMETRICALLY (gate the DEFENDER's interception/anticipation read too,
    26	> so attack↑ is balanced by defense↑ → §2-neutral), OR defense-read FIRST (likely §2-neutral-or-
    27	> better), OR defer vision & do `positioning`-live (sub-step 3) next.** Sub-step 3 = wire
    28	> `positioning` LIVE off-ball (today only a first-touch sub-term). De-dead-weight `strength`.
    29	> One sub-step, §2-gated, honest-revert. Fork B (distinct GK attr template) DEFERRED — chose light A.
    30	
    31	---
    32	⭐⭐⭐⭐⭐ **2026-07-20 SELF-DRIVE — density KEPT (user 留) + step-2 lever REVERTED→REFRAMED (⭐ NEWEST).**
    33	
    34	**Density verdict:** user play-tested → "观赏性我觉得没问题,可以go,你自走吧" = **KEEP**.
    35	PITCH_SCALE 0.70 + emergent-default are the CONFIRMED baseline now (see #1 above),
    36	not a candidate. Sequence unblocked.
    37	
    38	**Step-2 lever tried = RETIRE the in-possession width FLOOR (`formations.ts:266`,
    39	`widthMul` floor 1.0 → gene-driven 0.55..1.55). REVERTED (honest-revert, §2 hard
    40	gate).** Clean single-lever A/B vs HEAD (baselines captured):
    41	- ✅ **§4 diversity WIN** — `positioning-shape` WIDE−NARROW spreadY divergence
    42	  **1.2m → 2.1m (+75%)**; WIDE stays wide (6.0), NARROW gets genuinely narrow
    43	  (3.9). Width finally expresses across the `attackingWidth` gene.
    44	- ❌ **§2 watchability FAIL** — the SAME change congests the middle: `calibrate 8`
    45	  **goals 2.00→2.26 (+13%)**, shots +11%, **headers +24%** (10.5→13.0), fouls/cards
    46	  up, through-balls down; `positioning-shape` nn-dist tighter across the board;
    47	  `clump-vs-wide` gap **WIDENED 3.4×→5.4×** (CLUMP 3.48/WIDE 1.02 → 3.38/0.63).
    48	- ⭐ **DIAGNOSIS (the reframe):** the width floor is a genuine COMPENSATING bias —
    49	  but it compensates for **width-not-paying**, and that root cause is UNFIXED.
    50	  Retire the floor before width pays → the meta just slides NARROWER into the
    51	  中路乱抢 the user hates. **So step-2 (retire width biases) is BLOCKED on step-3
    52	  (QUALITY CLUSTER must make wide play connect/pay FIRST — attack the box, combos
    53	  reliable — THEN retire the floor and re-observe).** Queue RE-SEQUENCED: 3 → 2.
    54	- ⭐⭐ **ROOT CAUSE PINNED (2026-07-20 diagnostic probes, dense pitch):** WHY
    55	  width doesn't pay = **the final ball into the box finds too few attacking bodies
    56	  + a third of deliveries die in flight.** `cross-anatomy`: crosses convert ~5%
    57	  (NOT ≈0 — the clump-vs-wide extreme overstated it), but **46–54% of crosses are
    58	  `noAerial` = NOBODY contests them** (vs BUS 54%, atkHeader 25%→18% — the box is
    59	  under-crashed, worst vs a packed block). `cutback-anatomy`: cutback→goal 5.3%,
    60	  only 20% → shot, **35% die in flight (mostly intercepted)**, 39% of arrivals
    61	  lost. **→ The true upstream lever = OFF-BALL MOVEMENT INTO DANGEROUS SPACE
    62	  (crash the box on a delivery; proactive drop/arrive to receive) — the SAME root
    63	  as combo-reliability + check-to-ball (step-4). `supportSpot` is always AHEAD of
    64	  the ball & nobody attacks the 6-yd/penalty-spot on a wide ball.** This is the
    65	  next probe-first lever (gene-gated arrival, NOT a scripted run). cf. the earlier
    66	  obs8 pass-power revert — same lesson, combo bottleneck is upstream positioning.
    67	- ⭐⭐ **DESIGN + VISION UPDATED → "让球员/教练自己长眼睛" (gene-weighted SPACE-VALUE
    68	  field, two levels: player-local + coach-global). VISION §1 rewritten with the
    69	  user's words (内切/包抄/回撤 should EMERGE from ONE value field, not be hand-added).
    70	  Tasks re-cut (#2 player value field · #3 cut-inside via same logic on carry
    71	  direction · #5 width-floor deferred · #6 coach-global value field · #7 possession
    72	  contest+transition).**
    73	- ⭐⭐ **FIRST CUT of the value field REVERTED (honest-revert, 2nd this session) — but
    74	  a KEY DESIGN CORRECTION.** Rewrote `supportSpot` into a gene-weighted candidate
    75	  scorer (base + box-crash + drop candidates, scored by openness+receivability−clump
    76	  + gene/attr appetite). A/B: box-arrival did NOT emerge (`cross-anatomy` noAerial
    77	  46→50% / 54→59% — box got EMPTIER), §2 regressed (`calibrate` goals 2.00→2.42 +21%,
    78	  cutbacks 3.69→3.29, headers 10.5→7.8), width didn't rise (`scheme-matchup` W-v-Z
    79	  0.67→0.48). **LESSON: an openness-maximizing value field is the WRONG model for
    80	  BOX-ARRIVAL — the box is a LOW-openness contested zone, so the scorer AVOIDS it +
    81	  scatters supporters into empty pockets (→ emptier box, +turnovers, +goals).**
    82	  → **Split the design: (a) CHECK-TO-BALL / support / overload / drop = genuinely a
    83	  space-value(openness) field ✅; (b) BOX-ARRIVAL = delivery-ANTICIPATION, NOT
    84	  openness — must be COUPLED to an imminent wide delivery (extend `TeamBrain.
    85	  assignRunners` arriver → gene-scaled multi-body crash, TIMED like the corner
    86	  hold→burst), the cutback-arriver mechanism generalized.** Do box-arrival (a
    87	  delivery-coupled licensing change) as the next cut; keep the value-field for
    88	  check-to-ball separate.
    89	- ⭐⭐⭐ **CUT 2 (two-eye value field: space + BALL, per user "得知道空间在哪+球在哪")
    90	  ALSO REVERTED — same signature. → STOP hammering box-arrival-via-supportSpot;
    91	  RE-DIAGNOSE.** Both cuts: box did NOT fill (`cross-anatomy` noAerial 46→51%), §2
    92	  regressed (goals 2.00→2.41 +20%, **offsides 2.20→3.36 +50%**), width did NOT rise
    93	  (`scheme-matchup` W-v-Z 0.67→0.48). **THE OFFSIDES SPIKE is the tell: bodies DO try
    94	  to attack the box now but arrive OFFSIDE (uncoordinated with the delivery) → box
    95	  stays empty + structure disrupted → goals inflate via broken play.**
    96	- ⭐⭐⭐ **KEY under-weighted data + the REFRAME:** (1) a BALANCED team ALREADY fills
    97	  the box fine (`cross-anatomy` BAL: noAerial **26%**, atkHeader **33%**, goal/shot
    98	  16%) — box-arrival is NOT universally broken; it's CROSS-SPAM (early/excess crosses
    99	  outrun arrival) + the extreme WIDE genome being a bad archetype. (2) **WIDTH is a
   100	  LOW-EV mode vs EVERY defense (0.5–1.0) while central CARRY is HIGH-EV (2.2–3.2) —
   101	  because CROSSING IS INHERENTLY LOW-YIELD (cross→goal ~5%), which is REALISTIC (real
   102	  open-play crosses are ~1–2%).** So "make crosses out-score central carry" is the
   103	  WRONG goal — unrealistic. Real width's value = STRETCH the defense to OPEN the
   104	  center + let wide men CUT INSIDE into the high-EV central space (inverted winger),
   105	  NOT out-cross the middle. The unrealistic thing is CENTRAL CARRY being TOO strong
   106	  vs non-zonal defenses (zonal already bites it 58→14; man/default gets shredded; only
   107	  1–2/16 play zonal). **Two candidate realistic levers to STEER on: (A) CUT-INSIDE —
   108	  wide→cut into the opened center (taps the high-EV carry from wide, validates the
   109	  user's earlier instinct); (B) punish CENTRAL CARRY through congestion vs non-zonal
   110	  too (过一个还有另一个, so the clump stops being a free lunch). Box-arrival/crossing =
   111	  accept it as the low-yield supporting weapon it realistically is.** Awaiting user steer.
   112	- Tree left CLEAN at HEAD `ed62978` (only ledger/VISION docs changed). Baselines
   113	  saved this session: calibrate goals 2.00 / cutbacks 3.69 / compl 75%; posshape
   114	  WIDE 6.4 / NARROW 5.2; clump-vs-wide 3.48/1.02; cross noAerial 46/54%; cutback
   115	  20%→shot 5.3% goal; scheme-matchup W-v-Z 0.67 / W-v-M 1.02 / D-v-M 3.18 / D-v-Z 2.23.
   116	- ⭐⭐⭐ **VISION §1 EXTENDED to the full perception→value→action ENGINE (user ratified
   117	  "从底层做了一个足球引擎,方向是对的").** Eyes = 球+对手+队友+场地+**自身**(朝向/我的属性/
   118	  体能)+**动态·预判**(对手结构=提前观察+预判);space is DERIVED; inputs feed multi-dims
   119	  (space/threat/receive/goal); **eye-QUALITY = an attribute** (长眼睛本身分化). Honest cost
   120	  named: engine-first is 承重级/slower/"worse-before-better" → build incrementally, keep the
   121	  baseline revertible, each engine piece must BEAT §2 to ship.
   122	- ⭐⭐⭐ **ATTRIBUTE AUDIT (the engine's INPUTS; ATTR_KEYS ×9, budget SQUAD_BUDGET 40.5):
   123	  3 wasteful + 1 missing + 3 attr-blind.** DEAD/WEAK (eat budget, ~no effect): **`reflexes`
   124	  = DEAD for 8/9 (GK-only reads)**; **`positioning` = near-inert** (only a first-touch
   125	  sub-term; its docstring's off-ball IQ never shipped) — ironically the attr the SELF/off-ball
   126	  eye needs; **`strength` = one-trick** (aerialSense 0.30, near-decorative on the ground).
   127	  STRONG/live: pace · passing · dribbling · finishing · defending (stamina medium). ATTR-BLIND
   128	  mechanics (flat constant an attr could bite NOW): **`TURN_RATE` 6.5** (agility — everyone
   129	  turns identically; bites cut-inside/1v1), **`SHOT_SPEED` 27** (open-play shot power flat),
   130	  and **perception = PERFECT full-field for ALL — NO vision/awareness attr** (only the
   131	  `playmaker` trait) = the biggest gap + exactly the "eye-quality" the eyes model needs.
   132	  Gaps ranked: vision/awareness(1) · agility/turn(2) · positioning-made-live(3, fix-not-add) ·
   133	  composure(4) · raw aerial/jump(5) · shot-power(6) · tackle-vs-mark(7) · accel-vs-topspeed(8) ·
   134	  weak-foot(10, needs NEW mechanics). → **engine-input cleanup = reclaim reflexes budget +
   135	  add `vision` (eye-quality) + wire `positioning` live; genome change = save-ver bump +
   136	  fingerprint rebaseline = USER's architectural call.**
   137	
   138	---
   139	⭐⭐⭐⭐⭐ **2026-07-20 SESSION WRAP — GAP BASELINE + SELF-DRIVE QUEUE (⭐ RESUME HERE FIRST).**
   140	
   141	**LIVE STATE (HEAD `163f16b`, on Pages):** the density 相变 is SHIPPED as a
   142	candidate (pitch scale 0.70 + emergent positioning DEFAULT — see the block
   143	below). Render/view fixes also shipped: the 3D renderer is now RESPONSIVE
   144	(fills the viewport, cinematic fills the page — `ThreeMatchRenderer.resize()` +
   145	ResizeObserver, NO fullscreen API) and the green adboard "beams" scale with the
   146	pitch. Iterate render/feel with **`npm run dev`** (localhost:5173, fast HMR — no
   147	CI wait); commit+push (personal acct `Quarkgluonmixture`, `gh auth switch`) when
   148	confirmed; trust the browser for pixels (headless flaky).
   149	
   150	✅ **#1 DECIDED 2026-07-20 — the density 相变 is a KEEP.** User play-tested and
   151	判决: "观赏性我觉得没问题,可以go,你自走吧" (watchability is fine → GO; self-drive).
   152	PITCH_SCALE 0.70 + emergent positioning DEFAULT are now the confirmed baseline,
   153	not a candidate. Data said GO (cutbacks +235%, scramble-born goals flat 4–7% to
   154	0.70, goal inflation DOWN) and the user's eyes agree on VISION §2. Sequence
   155	unblocked → now on **step 2: retire the compensating width hand-biases + re-run
   156	evo + OBSERVE diversity on the denser pitch.**
   157	
   158	**GAP BASELINE (code-verified inventory 2026-07-20). The substrate is FAR more
   159	complete than a "missing systems" story — most of real football's repertoire
   160	already EXISTS and is gene/attr-driven** (shooting: long/chip/header · dribbling:
   161	knock-and-run/shield/slalom · link: lay-off/one-two/overlap/third-man/cutback ·
   162	set-plays: corners 4-routine/FK/penalty · transition: counter + gegenpress-vs-
   163	drop). So the distance to real football / VISION §3 is mostly EXECUTION QUALITY
   164	+ a few missing abilities + feel, NOT missing systems:
   165	- **QUALITY gaps (why it still "looks not-real"):** ① combos unreliable — 二过一/
   166	  做球/倒三角 mechanics exist but pass力学 (short-pass ~9 m/s floor + lateral
   167	  `orientationNoiseMul` + one-touch `oneTouchMul`) makes them physically miss
   168	  (obs8; naive fix REVERTED — redo RIGHT on the denser pitch where passes are
   169	  shorter). ② possession too discrete — capture = geometric nearest-within-1.25 m
   170	  INSTANT owner-flip (`Match.ts:1776-1842`), no physical 50-50 contest/jostle
   171	  (user-flagged). ③ no transition urgency — `MarkOpponent` has no counter/track
   172	  sprint lever (obs5). ④ goal-kick pinball (obs2), keeper throw too flat (hits
   173	  mates), keeper can't walk while holding (Bug3).
   174	- **Genuinely MISSING abilities (add as GENE-GATED abilities, not scripts):**
   175	  **check-to-ball / drop-to-receive (回撤接应, proactive — supportSpot is always
   176	  AHEAD of the ball; this is ALSO the upstream of combos, obs7)**, cut-inside
   177	  (内切 — dribble only goes down the line), volley, underlap; + decision richness
   178	  (place-vs-power & near/far-post are AUTO in open play, not chosen).
   179	- **§1 cleanup:** retire the compensating hand-biases (the width levers) on the
   180	  denser pitch, then re-run evo + OBSERVE diversity.
   181	- **Feel/visual:** dribble touch cadence (DECIDED = 忠于脚, SIM-level carry
   182	  cadence, not a render fake), keeper throw ARC (raise it), keeper walk-holding.
   183	- **Deliberate arcade deviations — do NOT "fix"** (VISION §3): throw-in→kick-in,
   184	  offside→goal-kick, no indirect FK.
   185	
   186	**SELF-DRIVE SEQUENCE (one lever · probe-first · A/B · emergence, VISION is the
   187	acceptance test):**
   188	1. Land the density verdict (user play — 留/退).
   189	2. Retire compensating hand-biases + re-observe diversity on the denser pitch.
   190	3. **QUALITY CLUSTER (the biggest step to "looks real"):** combo reliability
   191	   (pass力学, done right on the denser pitch) → physical possession contest
   192	   (capture 50-50 duel) → transition sprint urgency.
   193	4. **MISSING abilities:** check-to-ball (回撤接应) → cut-inside.
   194	5. **Feel polish:** 忠于脚 touch cadence → keeper throw arc + walk-holding →
   195	   goal-kick targeting.
   196	
   197	(This session's play-triage + all the shipped fixes are in the dated blocks
   198	below; VISION.md stays the gold standard, this is the current gap snapshot.)
   199	
   200	---
   201	⭐⭐⭐⭐ **2026-07-20 THE DENSITY 相变 — SHIPPED AS A PLAY-TEST CANDIDATE (⭐ NEWEST RESUME POINT).**
   202	VISION §1 named two load-bearing substrate roots behind the endless width/position
   203	reverts: (A) space/density + (B) emergent positioning. This phase does BOTH,
   204	probe-validated first:
   205	- **Probe** (`scripts/probes/density-probe.ts`, scale-invariant, goal scaled with
   206	  pitch): swept PITCH_SCALE 1.0→0.55 with emergent ON. Clean gradient — cutbacks
   207	  MONOTONICALLY up (1.59→3.89@0.70, +145%), strong-side r up (0.78→0.86),
   208	  proportional clumping DOWN, scramble-born goals flat 4–7% until 0.55 where it
   209	  JUMPS to 16% (the 乱抢 cliff). **Sweet spot ≈ 0.70** (213 m²/player) — passes
   210	  VISION §1+§2+§3 together (my first confounded run wrongly said §2 worsened; the
   211	  fix was scaling the clump radius + the goal).
   212	- **SHIPPED (candidate, uncommitted→committing):** `PITCH_SCALE` default **0.70**
   213	  in `constants.ts` (scales PITCH_LENGTH/WIDTH/BOX/CENTER/GOAL — physical sizes
   214	  fixed); **emergent positioning is now the DEFAULT** (`formations.ts`
   215	  emergentPosOn()→true; fixed tables scaled by PITCH_SCALE for the legacy path +
   216	  diagrams; `GameApp.readEmergentPos` default true). 26 tests re-baselined for the
   217	  new geometry (subagent, only tests/, no assertion gutted, verified). Gates at the
   218	  new default: **calibrate cutbacks 1.10→3.69 (+235%)**, completion 75%, goals 2.00,
   219	  balanced; **goals-warming late-mean 4.35 avg (DOWN from the old pitch's 5.07 —
   220	  LESS inflation)**. tsc+build+441 tests green.
   221	- ⚠ **NOT yet the final verdict:** VISION §2 watchability is the USER'S eyes
   222	  (trust the browser). Awaiting the play-test: does 0.70 look good / not cramped /
   223	  tactics legible? goals 2.00 is a touch low (small goal) — nudge goal scale up if
   224	  they want more scoring. **Honest-revert if §2 fails visually.** PITCH_SCALE=1
   225	  restores the old pitch.
   226	- **Dribble philosophy DECIDED: 忠于脚 (real touch cadence, sim-level)** — queued
   227	  AFTER density. My render-only fake cadence (obs4) made the ball "roll backwards";
   228	  REVERTED to the always-ahead glue. A true touch rhythm needs the SIM to vary the
   229	  carry distance (foot↔knock), not a render trick.
   230	

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'rg -n "''^(export )?(function|const|class|interface|type)|''^  (private |public |protected )?[a-zA-Z_].*'"\\(\" src/ai/perception.ts src/ai/PlayerBrain.ts src/ai/TeamBrain.ts src/ai/formations.ts src/evolution/playerGenome.ts && rg -n \"opennessAt|laneSafety|pressureAt|spaceAhead|canInterceptPass|nearestOpponent|supportSpot|formationSpot|assignRunners|runTarget|scorePass|scoreShoot|scoreDribble|scoreRun|utility|vision|positioning|awareness|intercept\" src/ai src/evolution/playerGenome.ts"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
src/evolution/playerGenome.ts:28:export interface PlayerAttributes {
src/evolution/playerGenome.ts:52:export const ATTR_KEYS = [
src/evolution/playerGenome.ts:56:export type AttrKey = (typeof ATTR_KEYS)[number];
src/evolution/playerGenome.ts:59:export const SQUAD_ROLES: Role[] = ['GK', 'DF', 'MF', 'WG', 'WG', 'ST'];
src/evolution/playerGenome.ts:63:export const ROSTER_ROLES: Role[] = [...SQUAD_ROLES, 'DF', 'MF', 'ST'];
src/evolution/playerGenome.ts:69:const ROLE_BIAS: Record<Role, Partial<PlayerAttributes>> = {
src/evolution/playerGenome.ts:77:export function randomPlayer(rng: Rng, role: Role): PlayerAttributes {
src/evolution/playerGenome.ts:79:  for (const k of ATTR_KEYS) p[k] = rng.range(0.1, 0.7);
src/evolution/playerGenome.ts:81:  for (const k of Object.keys(bias) as AttrKey[]) p[k] = clamp01(p[k] + (bias[k] ?? 0));
src/evolution/playerGenome.ts:88:export function randomSquad(rng: Rng): PlayerAttributes[] {
src/evolution/playerGenome.ts:89:  return ROSTER_ROLES.map((role) => randomPlayer(rng, role));
src/evolution/playerGenome.ts:92:export interface SquadMutateOptions {
src/evolution/playerGenome.ts:99:export function mutateSquad(squad: PlayerAttributes[], rng: Rng, opts: SquadMutateOptions = {}): PlayerAttributes[] {
src/evolution/playerGenome.ts:102:  return squad.map((p) => {
src/evolution/playerGenome.ts:116:export function crossoverSquads(a: PlayerAttributes[], b: PlayerAttributes[], rng: Rng): PlayerAttributes[] {
src/evolution/playerGenome.ts:117:  return a.map((pa, i) => {
src/evolution/playerGenome.ts:156:export const SQUAD_BUDGET = 35.5;
src/evolution/playerGenome.ts:167:export function countsForBudget(k: AttrKey, isGK: boolean): boolean {
src/evolution/playerGenome.ts:168:  if (isGK) return k !== 'finishing' && k !== 'defending';
src/evolution/playerGenome.ts:172:export function squadTotal(squad: PlayerAttributes[]): number {
src/evolution/playerGenome.ts:174:  for (let i = 0; i < squad.length; i++) {
src/evolution/playerGenome.ts:184:export function enforceBudget(squad: PlayerAttributes[]): PlayerAttributes[] {
src/evolution/playerGenome.ts:185:  const total = squadTotal(squad);
src/evolution/playerGenome.ts:186:  if (total <= SQUAD_BUDGET) return squad;
src/evolution/playerGenome.ts:188:  return squad.map((p) => {
src/evolution/playerGenome.ts:213:export function newgenFromBloodline(
src/evolution/playerGenome.ts:217:  for (const k of ATTR_KEYS) out[k] = clamp01(retiree[k] + rng.gaussian() * 0.12);
src/evolution/playerGenome.ts:218:  const pull = (coachJockeyBias - 0.5) * 0.24;
src/evolution/playerGenome.ts:219:  out.defending = clamp01(out.defending + pull);
src/evolution/playerGenome.ts:220:  out.pace = clamp01(out.pace - pull);
src/evolution/playerGenome.ts:225:export function squadSummary(squad: PlayerAttributes[]): PlayerAttributes {
src/evolution/playerGenome.ts:227:  for (const k of ATTR_KEYS) sum[k] = 0;
src/evolution/playerGenome.ts:228:  for (const p of squad) for (const k of ATTR_KEYS) sum[k] += p[k];
src/evolution/playerGenome.ts:229:  for (const k of ATTR_KEYS) sum[k] /= Math.max(squad.length, 1);
src/ai/perception.ts:15:export function pressureAt(pos: V2, opponents: Player[]): number {
src/ai/perception.ts:17:  for (const o of opponents) {
src/ai/perception.ts:22:  return clamp01(1 - best / 6);
src/ai/perception.ts:35:export function escapeCarry(
src/ai/perception.ts:44:  if (localX > 15 && !holdCorner) return null; // final third: go at them or release, never turn tail
src/ai/perception.ts:45:  const pressure = pressureAt(p.pos, opponents);
src/ai/perception.ts:46:  if (pressure < 0.45) return null;
src/ai/perception.ts:49:  for (const o of opponents) {
src/ai/perception.ts:58:  if (rx === 0 && ry === 0) return null;
src/ai/perception.ts:59:  if (holdCorner && localX > 0) {
src/ai/perception.ts:81:  let dir = norm({ x: rx, y: ry });
src/ai/perception.ts:82:  const forward = spaceAhead(p, { x: attackDir, y: 0 }, opponents);
src/ai/perception.ts:85:  if (forward > 0.55 && !(holdCorner && localX > 0)) return null;
src/ai/perception.ts:86:  const space = spaceAhead(p, dir, opponents);
src/ai/perception.ts:87:  if (space < 0.25) return null; // boxed in on every side — not an escape
src/ai/perception.ts:98:export function ballLanding(ball: Ball): { t: number; x: number; y: number } {
src/ai/perception.ts:99:  const t = (ball.vz + Math.sqrt(ball.vz * ball.vz + 2 * GRAVITY * ball.z)) / GRAVITY;
src/ai/perception.ts:106:  if (ball.spin !== 0) {
src/ai/perception.ts:121:export function airLaneOpenness(from: V2, opponents: Player[]): number {
src/ai/perception.ts:123:  for (const o of opponents) {
src/ai/perception.ts:133:export function laneOpenness(from: V2, to: V2, opponents: Player[]): number {
src/ai/perception.ts:135:  for (const o of opponents) {
src/ai/perception.ts:153:export function laneBlockers(from: V2, goal: V2, opponents: Player[]): number {
src/ai/perception.ts:154:  const end = add(from, scale(sub(goal, from), 0.6));
src/ai/perception.ts:156:  for (const o of opponents) {
src/ai/perception.ts:171:export function blockReadiness(o: Player, from: V2): number {
src/ai/perception.ts:174:  const d = Math.hypot(dx, dy);
src/ai/perception.ts:175:  const facing = d > 1e-6 ? (1 + (dx * o.heading.x + dy * o.heading.y) / d) / 2 : 1;
src/ai/perception.ts:176:  const stillness = clamp01((3.5 - Math.hypot(o.vel.x, o.vel.y)) / 2.5);
src/ai/perception.ts:177:  return UNSET_BLOCK_WEIGHT + (1 - UNSET_BLOCK_WEIGHT) * facing * stillness;
src/ai/perception.ts:185:export function effectiveBlockers(from: V2, goal: V2, opponents: Player[]): number {
src/ai/perception.ts:186:  const end = add(from, scale(sub(goal, from), 0.6));
src/ai/perception.ts:188:  for (const o of opponents) {
src/ai/perception.ts:197:export function opennessOf(p: Player, opponents: Player[]): number {
src/ai/perception.ts:199:  for (const o of opponents) {
src/ai/perception.ts:203:  return clamp01(best / 8);
src/ai/perception.ts:207:export function spaceAhead(p: Player, dir: V2, opponents: Player[]): number {
src/ai/perception.ts:208:  const probe = add(p.pos, scale(norm(dir), 7));
src/ai/perception.ts:210:  for (const o of opponents) {
src/ai/perception.ts:215:  return clamp01(1 - crowd / 2);
src/ai/perception.ts:219:export function timeToPoint(p: Player, point: V2): number {
src/ai/perception.ts:220:  return dist(p.pos, point) / Math.max(p.topSpeed, 0.1) + 0.15;
src/ai/perception.ts:223:export interface InterceptSolution {
src/ai/perception.ts:236:const INTERCEPT_T: number[] = [];
src/ai/perception.ts:237:const INTERCEPT_TRAVEL: number[] = [];
src/ai/perception.ts:239:  INTERCEPT_T.push(t);
src/ai/perception.ts:240:  INTERCEPT_TRAVEL.push((1 - Math.exp(-BALL_FRICTION_K * t)) / BALL_FRICTION_K);
src/ai/perception.ts:248:export function interceptBall(p: Player, ball: Ball): InterceptSolution {
src/ai/perception.ts:250:  const speed0 = len(v0);
src/ai/perception.ts:255:  const ts = Math.max(p.topSpeed, 0.1);
src/ai/perception.ts:259:  if (ball.z > 0.02 || ball.vz > 0.02) {
src/ai/perception.ts:266:  if (speed0 < 0.5) {
src/ai/perception.ts:272:  for (let i = 0; i < INTERCEPT_T.length; i++) {
src/ai/perception.ts:293:  const rest = add(ball.pos, scale(v0, 1 / BALL_FRICTION_K));
src/ai/perception.ts:296:  return { point: rest, tBall: 3, tMe: Math.sqrt(dx * dx + dy * dy) / ts + 0.15, reachable: false };
src/ai/perception.ts:300:export function canInterceptPass(p: Player, ball: Ball): { ok: boolean; point: V2 } {
src/ai/perception.ts:301:  const dir = norm(ball.vel);
src/ai/perception.ts:302:  if (dir.x === 0 && dir.y === 0) return { ok: false, point: ball.pos };
src/ai/perception.ts:303:  const end = add(ball.pos, scale(dir, 22));
src/ai/perception.ts:304:  const cp = closestPointOnSegment(ball.pos, end, p.pos);
src/ai/perception.ts:305:  const along = dist(ball.pos, cp);
src/ai/perception.ts:307:  const avgSpeed = Math.max(len(ball.vel) * 0.7, 4);
src/ai/perception.ts:309:  const tMe = timeToPoint(p, cp);
src/ai/perception.ts:310:  return { ok: tMe < tBall * 0.95 && dist(p.pos, cp) < 10, point: cp };
src/ai/formations.ts:24:export const ATTACK_FORMATIONS: Record<AttackFormationId, V2[]> = {
src/ai/formations.ts:68:export const DEFEND_FORMATIONS: Record<DefendFormationId, V2[]> = {
src/ai/formations.ts:90:  for (const table of [ATTACK_FORMATIONS, DEFEND_FORMATIONS] as Record<string, V2[]>[]) {
src/ai/formations.ts:105:export function setEmergentPos(on: boolean): void {
src/ai/formations.ts:108:export function emergentPosOn(): boolean {
src/ai/formations.ts:109:  if (_emergentPos !== null) return _emergentPos; // explicit UI / probe override
src/ai/formations.ts:111:  if (typeof process !== 'undefined' && process.env && process.env.EMERGENT_POS === '0') return false;
src/ai/formations.ts:116:const MODE_SHIFT: Record<TeamMode, number> = {
src/ai/formations.ts:129:export function formationSpot(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
src/ai/formations.ts:134:  if (emergentPosOn()) return emergentStation(p, team, ball, hasBall, opp);
src/ai/formations.ts:141:  const ballLocalX = team.localX(ball.pos.x);
src/ai/formations.ts:142:  const slide = clamp(ballLocalX * 0.3, -10, 10);
src/ai/formations.ts:145:  const depth = (g.formationDepth - 0.5) * 12;
src/ai/formations.ts:154:  const pressUp = hasBall || p.role === 'GK' ? 0 : (g.pressIntensity - 0.5) * 8;
src/ai/formations.ts:169:  if (p.index === 1 && p.role !== 'GK') {
src/ai/formations.ts:196:  if (!hasBall && team.style.scheme === 'zonal') widthMul = Math.max(widthMul, 0.95);
src/ai/formations.ts:200:  if (!hasBall) y += (ball.pos.y - y * team.attackDir) * team.attackDir * g.defensiveCompactness * 0.25;
src/ai/formations.ts:207:  if (
src/ai/formations.ts:214:  if (p.role === 'GK') {
src/ai/formations.ts:221:  x = clamp(x, -HALF_L + 3, HALF_L - 7);
src/ai/formations.ts:222:  y = clamp(y, -HALF_W + 2, HALF_W - 2);
src/ai/formations.ts:223:  return v2(x * team.attackDir, y);
src/ai/formations.ts:238:function emergentStation(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
src/ai/formations.ts:245:  switch (p.role) {
src/ai/formations.ts:253:  const ballLocalX = team.localX(ball.pos.x);
src/ai/formations.ts:254:  const slide = clamp(ballLocalX * 0.3, -10, 10);
src/ai/formations.ts:255:  const depth = (g.formationDepth - 0.5) * 12;
src/ai/formations.ts:256:  const pressUp = hasBall || p.role === 'GK' ? 0 : (g.pressIntensity - 0.5) * 8;
src/ai/formations.ts:260:  if (p.index === 1 && p.role !== 'GK') {
src/ai/formations.ts:267:  if (!hasBall && team.style.scheme === 'zonal') widthMul = Math.max(widthMul, 0.95);
src/ai/formations.ts:288:  if (!hasBall && opp && (p.role === 'DF' || p.role === 'MF')) {
src/ai/formations.ts:310:  const threat = clamp((-team.localX(ball.pos.x) - 8) / 26, 0, 1);
src/ai/formations.ts:311:  if (p.role !== 'GK') {
src/ai/formations.ts:340:  if (p.role === 'GK') {
src/ai/formations.ts:345:  x = clamp(x, -HALF_L + 3, HALF_L - 7);
src/ai/formations.ts:346:  y = clamp(y, -HALF_W + 2, HALF_W - 2);
src/ai/formations.ts:347:  return v2(x * team.attackDir, y);
src/ai/formations.ts:357:export function fkWallSlots(from: V2, goal: V2, n: number): V2[] {
src/ai/formations.ts:360:  const dl = Math.max(Math.sqrt(dx * dx + dy * dy), 1e-6);
src/ai/formations.ts:363:  const cx = from.x + ux * (CORNER_CLEARANCE + 0.15);
src/ai/formations.ts:364:  const cy = from.y + uy * (CORNER_CLEARANCE + 0.15);
src/ai/formations.ts:366:  for (let i = 0; i < n; i++) {
src/ai/formations.ts:383:export function cornerKeyZone(routine: CornerRoutine, attackDir: 1 | -1, cornerY: number): V2 {
src/ai/formations.ts:386:  switch (routine) {
src/ai/formations.ts:398:export function cornerCrashSpots(
src/ai/formations.ts:403:  const b = (dx: number, y: number): V2 => v2(gx - attackDir * dx, y);
src/ai/formations.ts:404:  switch (routine) {
src/ai/formations.ts:430:export function shapeReady(team: Team, ball: Ball, radius = 6): boolean {
src/ai/formations.ts:433:  for (const p of team.players) {
src/ai/formations.ts:441:  return settled >= Math.min(3, outfield);
src/ai/formations.ts:448:export function defenderLineLocalX(team: Team, opponents: Player[]): number {
src/ai/formations.ts:450:  for (const o of opponents) {
src/ai/formations.ts:466:export function offsideLineLocalX(team: Team, opponents: Player[], ballLocalX: number): number {
src/ai/formations.ts:469:  for (const o of opponents) {
src/ai/formations.ts:479:  return Math.max(secondLast, ballLocalX, 0);
src/ai/formations.ts:490:export function runTarget(p: Player, team: Team, opponents: Player[]): V2 {
src/ai/formations.ts:491:  const line = defenderLineLocalX(team, opponents);
src/ai/formations.ts:492:  const myX = team.localX(p.pos.x);
src/ai/formations.ts:493:  const targetLocalX = clamp(Math.max(line + 7, myX + 5), myX + 3, HALF_L - 9);
src/ai/formations.ts:500:  const y = p.traits.includes('poacher')
src/ai/formations.ts:503:  return v2(targetLocalX * team.attackDir, y);
src/ai/formations.ts:516:export function runBurstPoint(p: Player, team: Team, opponents: Player[], flight: number): V2 {
src/ai/formations.ts:517:  const speed = Math.hypot(p.vel.x, p.vel.y);
src/ai/formations.ts:518:  if (speed > 3) {
src/ai/formations.ts:521:  const rt = runTarget(p, team, opponents);
src/ai/formations.ts:524:  const d = Math.hypot(dx, dy) || 1;
src/ai/formations.ts:525:  const burst = Math.min(d, p.topSpeed * flight * 1.1);
src/ai/formations.ts:526:  return v2(p.pos.x + (dx / d) * burst, p.pos.y + (dy / d) * burst);
src/ai/formations.ts:546:export function supportSpot(p: Player, team: Team, ball: Ball): V2 {
src/ai/formations.ts:554:  const lane = formationSpot(p, team, ball, true);
src/ai/formations.ts:556:  const latPull = clamp((lane.y - ball.pos.y) * 0.75, -maxLat, maxLat);
src/ai/formations.ts:557:  return v2(
src/ai/TeamBrain.ts:25:export function updateTeamBrain(team: Team, match: Match): void {
src/ai/TeamBrain.ts:28:  if (match.phase !== 'playing' && match.phase !== 'restart') {
src/ai/TeamBrain.ts:48:  if (team.keeperUp && !team.keeperUpAnnounced) {
src/ai/TeamBrain.ts:59:  if (possession === team.side) {
src/ai/TeamBrain.ts:99:  assignChasers(team, match);
src/ai/TeamBrain.ts:100:  assignMarks(team, match);
src/ai/TeamBrain.ts:101:  assignRunners(team, match);
src/ai/TeamBrain.ts:110:const RUN_ROLE_W: Record<Role, number> = { GK: 0, DF: 0.4, MF: 1.2, WG: 1.8, ST: 2.2 };
src/ai/TeamBrain.ts:112:function assignRunners(team: Team, match: Match): void {
src/ai/TeamBrain.ts:113:  team.runners.clear();
src/ai/TeamBrain.ts:123:  if (!keepOverlap) team.overlapper = null;
src/ai/TeamBrain.ts:124:  if (match.possessionSide !== team.side) return;
src/ai/TeamBrain.ts:134:  if (team.cornerCrash && match.simTime >= team.cornerCrash.until) team.cornerCrash = null;
src/ai/TeamBrain.ts:135:  if (heldCrash) {
src/ai/TeamBrain.ts:146:  if (liveCorner) {
src/ai/TeamBrain.ts:197:  for (const { p } of scored.slice(0, count)) team.runners.add(p.index);
src/ai/TeamBrain.ts:205:  const ballLocalX = team.localX(ballPos.x);
src/ai/TeamBrain.ts:211:  if (ballLocalX > HALF_L - 21 && Math.abs(ballPos.y) > 10) {
src/ai/TeamBrain.ts:223:  if (
src/ai/TeamBrain.ts:267:export function pickCornerRoutine(match: Match, r: RestartState): CornerRoutine {
src/ai/TeamBrain.ts:273:  for (const routine of order) {
src/ai/TeamBrain.ts:299:function assignChasers(team: Team, match: Match): void {
src/ai/TeamBrain.ts:300:  team.chasers.clear();
src/ai/TeamBrain.ts:303:  if (weOwn) {
src/ai/TeamBrain.ts:340:  const gkHolding = owner !== null && owner.role === 'GK' && (owner.gkHoldTimer > 0 || owner.gkDistributing);
src/ai/TeamBrain.ts:343:  if (gkHolding) {
src/ai/TeamBrain.ts:378:  if (match.phase === 'restart') count = match.restart?.kind === 'goalKick' ? 0 : 1;
src/ai/TeamBrain.ts:380:  const outfield = team.players.filter((p) => p.role !== 'GK' && !p.sentOff);
src/ai/TeamBrain.ts:391:  if (
src/ai/TeamBrain.ts:420:  const byDist = [...outfield].sort(
src/ai/TeamBrain.ts:423:  for (const p of byDist.slice(0, count)) team.chasers.add(p.index);
src/ai/TeamBrain.ts:439:function assignMarks(team: Team, match: Match): void {
src/ai/TeamBrain.ts:440:  team.marks.clear();
src/ai/TeamBrain.ts:441:  if (match.possessionSide === team.side) return;
src/ai/TeamBrain.ts:454:  const inOurBox = (x: number, y: number): boolean =>
src/ai/TeamBrain.ts:460:  const free = team.players.filter((p) => p.role !== 'GK' && !team.chasers.has(p.index) && !p.sentOff);
src/ai/TeamBrain.ts:462:  const zones = zonal ? new Map(free.map((p) => [p.index, formationSpot(p, team, match.ball, false, match.teams[1 - team.side])])) : null;
src/ai/TeamBrain.ts:463:  const used = new Set<number>();
src/ai/TeamBrain.ts:464:  for (const threat of threats) {
src/ai/PlayerBrain.ts:26:export function decidePlayer(p: Player, match: Match): void {
src/ai/PlayerBrain.ts:33:  if (match.phase === 'restart' && match.restart) {
src/ai/PlayerBrain.ts:43:  if (match.ball.owner === p) {
src/ai/PlayerBrain.ts:50:  if (
src/ai/PlayerBrain.ts:59:  if (p.role === 'GK') {
src/ai/PlayerBrain.ts:63:  decideOffBall(p, team, opp, match);
src/ai/PlayerBrain.ts:70:function decideCarrier(p: Player, team: Team, opp: Team, match: Match): void {
src/ai/PlayerBrain.ts:79:  if (mustKick) {
src/ai/PlayerBrain.ts:91:  if (kickKind === 'penalty') {
src/ai/PlayerBrain.ts:98:  if (p.gkHoldTimer > 0) {
src/ai/PlayerBrain.ts:107:  if (p.role === 'GK' && p.gkDistributing && p.gkShapeWait < 4 && !shapeReady(team, match.ball)) {
src/ai/PlayerBrain.ts:116:  if (match.kickoffKickGid === p.gid) {
src/ai/PlayerBrain.ts:146:  const pressure = pressureAt(p.pos, opp.players);
src/ai/PlayerBrain.ts:147:  const goal = team.oppGoal();
src/ai/PlayerBrain.ts:148:  const dGoal = dist(p.pos, goal);
src/ai/PlayerBrain.ts:149:  const localX = team.localX(p.pos.x);
src/ai/PlayerBrain.ts:165:  const offLine = offsideLineLocalX(team, opp.players, localX) + 2.2;
src/ai/PlayerBrain.ts:169:  const stagnation = clamp01((team.staleTime - 3) / 5);
src/ai/PlayerBrain.ts:176:  if (dGoal < 28) {
src/ai/PlayerBrain.ts:189:  if (dGoal < 30 && p.kickCooldown <= 0) {
src/ai/PlayerBrain.ts:247:  if (kickKind === 'freeKick' && localX > 0 && dGoal > 9 && dGoal < 28) {
src/ai/PlayerBrain.ts:271:  const airLane = p.kickCooldown <= 0 ? airLaneOpenness(p.pos, opp.players) : 0;
src/ai/PlayerBrain.ts:272:  if (p.kickCooldown <= 0) {
src/ai/PlayerBrain.ts:429:  if (p.kickCooldown <= 0) {
src/ai/PlayerBrain.ts:504:  if (p.kickCooldown <= 0 && (isCorner || (Math.abs(p.pos.y) > 10 && localX > 10))) {
src/ai/PlayerBrain.ts:555:  if (
src/ai/PlayerBrain.ts:592:  if (!mustKick && ((p.role === 'ST' && localX > -12 && localX < 32) || cornerHold)) {
src/ai/PlayerBrain.ts:613:  if (!mustKick && p.role !== 'GK') {
src/ai/PlayerBrain.ts:688:  let puntCand: (typeof cands)[number] | null = null;
src/ai/PlayerBrain.ts:690:  if (p.role === 'GK' && p.gkDistributing && p.kickCooldown <= 0) {
src/ai/PlayerBrain.ts:768:  if (localX < -18 && p.kickCooldown <= 0 && !(p.role === 'GK' && p.gkDistributing)) {
src/ai/PlayerBrain.ts:778:  cands.sort((a, b) => b.score - a.score);
src/ai/PlayerBrain.ts:780:  if (cands.length === 0) {
src/ai/PlayerBrain.ts:785:  const scores = cands.slice(0, 4);
src/ai/PlayerBrain.ts:790:  if (mustKick) {
src/ai/PlayerBrain.ts:810:  switch (top.action) {
src/ai/PlayerBrain.ts:874:function decideGoalkeeper(p: Player, team: Team, match: Match): void {
src/ai/PlayerBrain.ts:876:  const ownGoal = team.ownGoal();
src/ai/PlayerBrain.ts:880:  if (
src/ai/PlayerBrain.ts:893:  if (team.keeperUp) {
src/ai/PlayerBrain.ts:912:  if (carrier && carrier.side !== p.side) {
src/ai/PlayerBrain.ts:948:  if (ball.owner === null) {
src/ai/PlayerBrain.ts:979:function decideOffBall(p: Player, team: Team, opp: Team, match: Match): void {
src/ai/PlayerBrain.ts:990:  if (possession === team.side) {
src/ai/PlayerBrain.ts:1137:  cands.sort((a, b) => b.score - a.score);
src/evolution/playerGenome.ts:47:   * density, so positioning is a real budget TRADE-OFF, not free.
src/evolution/playerGenome.ts:49:  positioning: number;
src/evolution/playerGenome.ts:54:  'positioning',
src/evolution/playerGenome.ts:136: * positioning attr, keeping the tuned 0.5 density so the existing physics
src/evolution/playerGenome.ts:137: * still centres on 0.5 and positioning is a real trade-off, not free). That
src/evolution/playerGenome.ts:148: * positioning, not the outfield scoring/tackling stats. The cap dropped
src/ai/PlayerBrain.ts:13:  airLaneOpenness, canInterceptPass, effectiveBlockers, interceptBall, laneOpenness, opennessOf,
src/ai/PlayerBrain.ts:14:  escapeCarry, pressureAt, spaceAhead, timeToPoint,
src/ai/PlayerBrain.ts:18: * PlayerBrain — utility AI. Each decision tick the player scores a set of
src/ai/PlayerBrain.ts:72:  const W = team.policies[p.index]; // utility weights — DEFAULT_POLICY unless a wildcard carries learned ones
src/ai/PlayerBrain.ts:90:  // A penalty's first touch IS the shot — no utility scoring from the spot.
src/ai/PlayerBrain.ts:146:  const pressure = pressureAt(p.pos, opp.players);
src/ai/PlayerBrain.ts:150:  // Offside awareness (Phase 29): real-law dead-ball exemptions, and the
src/ai/PlayerBrain.ts:191:    // NOTE: finishing deliberately does NOT raise shot utility — it pays off
src/ai/PlayerBrain.ts:193:    // selection. Coupling it to utility made finishers take worse shots and
src/ai/PlayerBrain.ts:278:      // they look — the trait is vision, priced into lane weight only.
src/ai/PlayerBrain.ts:475:        const landOpen = 1 - pressureAt(point, opp.players);
src/ai/PlayerBrain.ts:618:    // the utility and the legs agree. This is what puts carriers in the
src/ai/PlayerBrain.ts:625:    const space = spaceAhead(p, toGoal, opp.players);
src/ai/PlayerBrain.ts:891:  // brain tick of the moment dying and he falls through to positioning,
src/ai/PlayerBrain.ts:910:  // interception below (through balls are where 出击 pays).
src/ai/PlayerBrain.ts:949:    const sol = interceptBall(p, ball);
src/ai/PlayerBrain.ts:950:    // The sweeper's interception range (Phase 103): a through ball coming
src/ai/PlayerBrain.ts:1005:    // halfway he does not join the siege — formationSpot clamps his spot
src/ai/PlayerBrain.ts:1070:      const inter = canInterceptPass(p, ball);
src/ai/PlayerBrain.ts:1071:      if (inter.ok) cands.push({ action: 'InterceptPass', score: W.interceptScore, why: 'can reach the passing lane first' });
src/ai/TeamBrain.ts:3:import { cornerKeyZone, formationSpot } from './formations';
src/ai/TeamBrain.ts:101:  assignRunners(team, match);
src/ai/TeamBrain.ts:112:function assignRunners(team: Team, match: Match): void {
src/ai/TeamBrain.ts:387:  // interceptBall already projects the parabola; the chaser just needed
src/ai/TeamBrain.ts:462:  const zones = zonal ? new Map(free.map((p) => [p.index, formationSpot(p, team, match.ball, false, match.teams[1 - team.side])])) : null;
src/ai/perception.ts:10: * Perception helpers — small pure queries the utility scorers are built from.
src/ai/perception.ts:15:export function pressureAt(pos: V2, opponents: Player[]): number {
src/ai/perception.ts:33: * Shared by the SCORER and the EXECUTOR so the utility and the legs agree.
src/ai/perception.ts:45:  const pressure = pressureAt(p.pos, opponents);
src/ai/perception.ts:82:  const forward = spaceAhead(p, { x: attackDir, y: 0 }, opponents);
src/ai/perception.ts:86:  const space = spaceAhead(p, dir, opponents);
src/ai/perception.ts:93: * exact point. The same closed form used to live inline in interceptBall,
src/ai/perception.ts:207:export function spaceAhead(p: Player, dir: V2, opponents: Player[]): number {
src/ai/perception.ts:248:export function interceptBall(p: Player, ball: Ball): InterceptSolution {
src/ai/perception.ts:300:export function canInterceptPass(p: Player, ball: Ball): { ok: boolean; point: V2 } {
src/ai/formations.ts:129:export function formationSpot(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
src/ai/formations.ts:133:  // (positioning-shape.ts) before it can replace them. OFF = today's behavior.
src/ai/formations.ts:179:      // everyone onside) or ahead of it (stopper: early interceptions,
src/ai/formations.ts:235: * B1-b. Opponent-relative positioning is B2. Same sensible modifiers as the
src/ai/formations.ts:287:  // an opponent reference (executor/marking path); attack + supportSpot skip it.
src/ai/formations.ts:436:    const spot = formationSpot(p, team, ball, true);
src/ai/formations.ts:490:export function runTarget(p: Player, team: Team, opponents: Player[]): V2 {
src/ai/formations.ts:521:  const rt = runTarget(p, team, opponents);
src/ai/formations.ts:538: * (interceptions ran 33/match) and pulling wingers off the flank. Pulling
src/ai/formations.ts:546:export function supportSpot(p: Player, team: Team, ball: Ball): V2 {
src/ai/formations.ts:554:  const lane = formationSpot(p, team, ball, true);
src/ai/actionExecutor.ts:8:  cornerCrashSpots, cornerKeyZone, fkWallSlots, formationSpot, offsideLineLocalX, runTarget,
src/ai/actionExecutor.ts:9:  supportSpot,
src/ai/actionExecutor.ts:11:import { ballLanding, escapeCarry, interceptBall } from './perception';
src/ai/actionExecutor.ts:42:      target = formationSpot(p, team, ball, hasBall, opp);
src/ai/actionExecutor.ts:98:      const sol = interceptBall(p, ball);
src/ai/actionExecutor.ts:107:      // last ~2.6m of flight, so the intercept solution parked the receiver
src/ai/actionExecutor.ts:113:      // band; once it drops low the normal intercept chase resumes.
src/ai/actionExecutor.ts:123:        const sol = interceptBall(p, ball);
src/ai/actionExecutor.ts:201:          const spot = formationSpot(p, team, ball, hasBall, opp);
src/ai/actionExecutor.ts:230:        target = formationSpot(p, team, ball, hasBall, opp);
src/ai/actionExecutor.ts:235:      target = supportSpot(p, team, ball);
src/ai/actionExecutor.ts:324:        target = runTarget(p, team, opp.players);
src/ai/actionExecutor.ts:372:      const sol = interceptBall(p, ball);
src/ai/actionExecutor.ts:539: * so the legs go where the utility looked. */
src/ai/actionExecutor.ts:547:  // flag as the scorer (Phase 35) so the utility and the legs agree.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'nl -ba src/evolution/playerGenome.ts'[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { clamp01 } from '../utils/math';
     2	import type { Rng } from '../utils/rng';
     3	import type { Role } from '../sim/types';
     4	
     5	/**
     6	 * Squad DNA — per-player attribute genes that evolve alongside the team's
     7	 * TacticalGenome. All 0..1, all read directly by the simulation, so squads
     8	 * feel physically different, not just tactically different.
     9	 *
    10	 * Phase 47 (the emergence pivot's attribute richness): the overloaded
    11	 * `technique` split into PASSING (striking a ball toward a target: pass /
    12	 * cross / through / loft / switch / FK accuracy+power) and DRIBBLING
    13	 * (the ball at the feet: first touch, carry control, tackle resistance,
    14	 * 1v1s, shot strike), plus two new payoff dimensions:
    15	 *
    16	 *   pace       top speed & acceleration (±12% speed)
    17	 *   passing    pass/cross/loft accuracy and power retention
    18	 *   dribbling  first touch, carry push control, beating a man
    19	 *   finishing  shot accuracy (spread) and shot confidence
    20	 *   defending  tackle success + tighter marking
    21	 *   strength   aerial power, shielding, the 50/50 shove
    22	 *   stamina    fatigue drain & recovery rate
    23	 *   reflexes   keeper save probability & reach — GK-ONLY. Only the keeper
    24	 *              (squad[0]) ever reads it; for the eight outfielders it is a
    25	 *              DEAD stat, so `squadTotal` no longer charges them for it
    26	 *              (Phase-120 engine-input cleanup — see squadTotal below).
    27	 */
    28	export interface PlayerAttributes {
    29	  pace: number;
    30	  passing: number;
    31	  dribbling: number;
    32	  finishing: number;
    33	  defending: number;
    34	  strength: number;
    35	  stamina: number;
    36	  reflexes: number;
    37	  /**
    38	   * POSITIONING (Phase 119j) — the mover's IQ, orthogonal to pace (how fast)
    39	   * and dribbling/passing (how clean the touch): WHERE to be, WHEN to move,
    40	   * and how well to receive under pressure. It scales OUTCOMES that were
    41	   * uniform before (first-touch reception the first wiring point; run timing,
    42	   * space-finding and defensive reads to follow), so the off-ball
    43	   * dilemma-creators (overload / seam run / give-and-go / cover) become
    44	   * evolvable and can PAY — the enabler five failed levers (119c, 119d-1,
    45	   * 119i) all lacked. Appended LAST in ATTR_KEYS so founders' other attrs
    46	   * draw byte-identical; SQUAD_BUDGET raised 36→40.5 to keep the tuned 0.5
    47	   * density, so positioning is a real budget TRADE-OFF, not free.
    48	   */
    49	  positioning: number;
    50	}
    51	
    52	export const ATTR_KEYS = [
    53	  'pace', 'passing', 'dribbling', 'finishing', 'defending', 'strength', 'stamina', 'reflexes',
    54	  'positioning',
    55	] as const;
    56	export type AttrKey = (typeof ATTR_KEYS)[number];
    57	
    58	/** Squad slot order (mirrors sim/types ROLES): [GK, DF, MF, WGL, WGR, ST]. */
    59	export const SQUAD_ROLES: Role[] = ['GK', 'DF', 'MF', 'WG', 'WG', 'ST'];
    60	/** The full roster (Phase 61): starters + a 3-man bench with NOMINAL roles
    61	 * (market matching / records / founding bias — on the pitch a sub assumes
    62	 * the slot he replaces). Mirrors sim/types ROSTER_ROLES. */
    63	export const ROSTER_ROLES: Role[] = [...SQUAD_ROLES, 'DF', 'MF', 'ST'];
    64	
    65	/** Each role tends to be born good at its job (bias added, then clamped).
    66	 * strength/stamina carry NO bias (Phase 47) — where the physical game pays
    67	 * is evolution's to discover. (ROLE_BIAS itself retires in the budget
    68	 * phase: newgens will inherit their slot's bloodline instead.) */
    69	const ROLE_BIAS: Record<Role, Partial<PlayerAttributes>> = {
    70	  GK: { reflexes: 0.3 },
    71	  DF: { defending: 0.25 },
    72	  MF: { passing: 0.2 },
    73	  WG: { pace: 0.25 },
    74	  ST: { finishing: 0.25 },
    75	};
    76	
    77	export function randomPlayer(rng: Rng, role: Role): PlayerAttributes {
    78	  const p = {} as PlayerAttributes;
    79	  for (const k of ATTR_KEYS) p[k] = rng.range(0.1, 0.7);
    80	  const bias = ROLE_BIAS[role];
    81	  for (const k of Object.keys(bias) as AttrKey[]) p[k] = clamp01(p[k] + (bias[k] ?? 0));
    82	  return p;
    83	}
    84	
    85	/** A founding ROSTER (Phase 61): six starters + three bench players, all
    86	 * role-biased at birth (bias is only a starting point — bloodline heredity
    87	 * owns the long run). */
    88	export function randomSquad(rng: Rng): PlayerAttributes[] {
    89	  return ROSTER_ROLES.map((role) => randomPlayer(rng, role));
    90	}
    91	
    92	export interface SquadMutateOptions {
    93	  /** Probability each attribute of each player mutates. */
    94	  rate?: number;
    95	  /** Std-dev of gaussian noise. */
    96	  scale?: number;
    97	}
    98	
    99	export function mutateSquad(squad: PlayerAttributes[], rng: Rng, opts: SquadMutateOptions = {}): PlayerAttributes[] {
   100	  const rate = opts.rate ?? 0.35;
   101	  const scale = opts.scale ?? 0.1;
   102	  return squad.map((p) => {
   103	    const out = { ...p };
   104	    for (const k of ATTR_KEYS) {
   105	      if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
   106	    }
   107	    return out;
   108	  });
   109	}
   110	
   111	/**
   112	 * Position-wise crossover: for each squad slot the child inherits that slot's
   113	 * player from parent A, parent B, or a blend — like signing a mixed starting
   114	 * five from both academies.
   115	 */
   116	export function crossoverSquads(a: PlayerAttributes[], b: PlayerAttributes[], rng: Rng): PlayerAttributes[] {
   117	  return a.map((pa, i) => {
   118	    const pb = b[i];
   119	    const r = rng.next();
   120	    if (r < 0.4) return { ...pa };
   121	    if (r < 0.8) return { ...pb };
   122	    const mix = {} as PlayerAttributes;
   123	    for (const k of ATTR_KEYS) mix[k] = (pa[k] + pb[k]) / 2;
   124	    return mix;
   125	  });
   126	}
   127	
   128	/**
   129	 * The RESOURCE BUDGET (Phase 48 — the emergence keystone): a hard cap on a
   130	 * squad's total attribute points. Without it evolution maxes EVERY attribute
   131	 * ("good at everything" wins) and archetypes stay faint; with it, raising
   132	 * one attribute COSTS another and specialisation is forced. SQUAD-level on
   133	 * purpose: star-plus-role-players vs a balanced six is itself an evolvable
   134	 * axis. Phase 61 (the bench): the budget covers the whole 9-man ROSTER —
   135	 * 40.5 = 9 players × 9 attrs × 0.5 (Phase 119j raised it 36→40.5 with the
   136	 * positioning attr, keeping the tuned 0.5 density so the existing physics
   137	 * still centres on 0.5 and positioning is a real trade-off, not free). That
   138	 * makes rotation a REAL trade-off: a deep bench is funded by shaving the
   139	 * starting six, a star XI leaves its bench (and its fresh legs) thin.
   140	 * Founding rosters roll ~0.4 density, so there is headroom before the cap bites.
   141	 *
   142	 * Phase-120 (POSITION-AWARE budget — 门将底座和外场不一样): the budget now
   143	 * charges each slot only for the attributes that actually FIRE for its
   144	 * position. `reflexes` is keeper-only (the 8 outfielders never read it), and
   145	 * symmetrically `finishing` + `defending` are DEAD for the keeper (a GK never
   146	 * shoots, and its 1v1s/claims resolve on reflexes, not tackles) — so the
   147	 * keeper's budget base is its OWN: reflexes + distribution + physique +
   148	 * positioning, not the outfield scoring/tackling stats. The cap dropped
   149	 * 40.5 → 35.5 IN LOCKSTEP (was 81 attr-slots × 0.5; now 8 outfield-reflexes +
   150	 * GK-finishing + GK-defending = 10 dead slots are free → 71 counted × 0.5 =
   151	 * 35.5) so USEFUL-attr density stays the tuned 0.5 and physics is unmoved.
   152	 * The point is not more quality — it closes the "dump" (evolution could park
   153	 * points in a dead stat to dodge the cap); now every point trades against a
   154	 * LIVE attribute, sharpening specialisation.
   155	 */
   156	export const SQUAD_BUDGET = 35.5;
   157	
   158	/**
   159	 * Which attributes cost budget for a slot (Phase-120 position-aware). The
   160	 * keeper (index 0 by invariant — Team.goalkeeper === players[0], ROSTER_ROLES
   161	 * [0] === 'GK', retirees replaced like-for-like at the same slot) pays for
   162	 * everything EXCEPT finishing/defending (dead for a GK); every outfielder pays
   163	 * for everything EXCEPT reflexes (keeper-only). The uncounted attrs still
   164	 * exist and still get scaled by enforceBudget — they just ride along free, so
   165	 * the counted total lands exactly on the cap.
   166	 */
   167	export function countsForBudget(k: AttrKey, isGK: boolean): boolean {
   168	  if (isGK) return k !== 'finishing' && k !== 'defending';
   169	  return k !== 'reflexes';
   170	}
   171	
   172	export function squadTotal(squad: PlayerAttributes[]): number {
   173	  let t = 0;
   174	  for (let i = 0; i < squad.length; i++) {
   175	    const p = squad[i];
   176	    const isGK = i === 0;
   177	    for (const k of ATTR_KEYS) if (countsForBudget(k, isGK)) t += p[k];
   178	  }
   179	  return t;
   180	}
   181	
   182	/** Proportional rescale onto the cap — pure, order-free, unbiased (evolution
   183	 * chooses where the shave lands by choosing where the points sit). */
   184	export function enforceBudget(squad: PlayerAttributes[]): PlayerAttributes[] {
   185	  const total = squadTotal(squad);
   186	  if (total <= SQUAD_BUDGET) return squad;
   187	  const mul = SQUAD_BUDGET / total;
   188	  return squad.map((p) => {
   189	    const out = {} as PlayerAttributes;
   190	    for (const k of ATTR_KEYS) out[k] = p[k] * mul;
   191	    return out;
   192	  });
   193	}
   194	
   195	/**
   196	 * Academy heredity (Phase 48): a retiring player's successor is grown in the
   197	 * club's image — the retiree's attribute profile, mutated. This retires
   198	 * ROLE_BIAS from the newgen path (the bias survives only at FOUNDING, where
   199	 * selection has nothing to work with yet): what a club's left winger IS is
   200	 * now bloodline, discovered by evolution, not set by us. The age curve
   201	 * regrows a 17-year-old's inherited profile from there.
   202	 *
   203	 * School-linked variation (Phase 94): the academy grows what the coach's
   204	 * philosophy NEEDS. The jockey school's problem was DISCOVERY, not payoff —
   205	 * containment only pays as a defending+jockeyBias PACKAGE, a two-locus
   206	 * valley that drift rarely crosses in a 16-club population (phases 88/92).
   207	 * So the newgen intake drifts along the philosophy axis: a containment
   208	 * coach (jockeyBias>0.5) pulls the heir toward defending, a dive-in coach
   209	 * pulls toward pace — a zero-sum transfer on one axis (max ±0.12, one
   210	 * mutation σ), on top of unbiased bloodline noise. Fitness stays pure
   211	 * results and founders stay random: this biases VARIATION, not selection.
   212	 */
   213	export function newgenFromBloodline(
   214	  retiree: PlayerAttributes, rng: Rng, coachJockeyBias = 0.5,
   215	): PlayerAttributes {
   216	  const out = {} as PlayerAttributes;
   217	  for (const k of ATTR_KEYS) out[k] = clamp01(retiree[k] + rng.gaussian() * 0.12);
   218	  const pull = (coachJockeyBias - 0.5) * 0.24;
   219	  out.defending = clamp01(out.defending + pull);
   220	  out.pace = clamp01(out.pace - pull);
   221	  return out;
   222	}
   223	
   224	/** Squad-average of each attribute — shown on team cards. */
   225	export function squadSummary(squad: PlayerAttributes[]): PlayerAttributes {
   226	  const sum = {} as PlayerAttributes;
   227	  for (const k of ATTR_KEYS) sum[k] = 0;
   228	  for (const p of squad) for (const k of ATTR_KEYS) sum[k] += p[k];
   229	  for (const k of ATTR_KEYS) sum[k] /= Math.max(squad.length, 1);
   230	  return sum;
   231	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'nl -ba src/ai/perception.ts'[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { clamp01 } from '../utils/math';
     2	import {
     3	  add, closestPointOnSegment, dist, len, norm, scale, sub, type V2,
     4	} from '../utils/vec';
     5	import { BALL_FRICTION_K, GRAVITY, HALF_L, HALF_W, UNSET_BLOCK_WEIGHT } from '../sim/constants';
     6	import type { Ball } from '../sim/Ball';
     7	import type { Player } from '../sim/Player';
     8	
     9	/**
    10	 * Perception helpers — small pure queries the utility scorers are built from.
    11	 * All return values are normalized to [0, 1] so scoring math stays readable.
    12	 */
    13	
    14	/** Pressure on a position from the nearest opponent: 1 at 0m, 0 beyond 6m. */
    15	export function pressureAt(pos: V2, opponents: Player[]): number {
    16	  let best = Infinity;
    17	  for (const o of opponents) {
    18	    if (o.sentOff) continue;
    19	    const d = dist(o.pos, pos);
    20	    if (d < best) best = d;
    21	  }
    22	  return clamp01(1 - best / 6);
    23	}
    24	
    25	/**
    26	 * 脱压带球 (Phase 34.2, user report "球员不会向后带球"): a pressured
    27	 * carrier outside the final third whose FORWARD path is closed should
    28	 * carry the ball AWAY from the press — back or sideways — to buy time,
    29	 * instead of stopping dead or driving into bodies. Returns the escape
    30	 * direction (opponent-repulsion within 8m, tilted lateral so the carry
    31	 * arcs to the safe wing rather than straight into his own goalmouth) and
    32	 * the space along it, or null when this is not an escape situation.
    33	 * Shared by the SCORER and the EXECUTOR so the utility and the legs agree.
    34	 */
    35	export function escapeCarry(
    36	  p: Player,
    37	  attackDir: number,
    38	  localX: number,
    39	  opponents: Player[],
    40	  holdCorner = false,
    41	): { dir: V2; space: number } | null {
    42	  // 打卡油角 (Phase 35): a side killing the game late carries INTO the
    43	  // attacking corner and shields — for it, the final-third gate opens.
    44	  if (localX > 15 && !holdCorner) return null; // final third: go at them or release, never turn tail
    45	  const pressure = pressureAt(p.pos, opponents);
    46	  if (pressure < 0.45) return null;
    47	  let rx = 0;
    48	  let ry = 0;
    49	  for (const o of opponents) {
    50	    if (o.sentOff) continue;
    51	    const dx = p.pos.x - o.pos.x;
    52	    const dy = p.pos.y - o.pos.y;
    53	    const d2 = dx * dx + dy * dy;
    54	    if (d2 > 64 || d2 < 1e-6) continue;
    55	    rx += dx / d2;
    56	    ry += dy / d2;
    57	  }
    58	  if (rx === 0 && ry === 0) return null;
    59	  if (holdCorner && localX > 0) {
    60	    // Corner-flag holding (Phase 35): blend the repulsion with a pull
    61	    // toward the attacking corner, guarded off the lines themselves —
    62	    // on the touchline the pull runs ALONG it, at the byline it holds.
    63	    const rep = norm({ x: rx, y: ry });
    64	    const cx = localX > HALF_L - 8 ? 0 : attackDir;
    65	    const cy = Math.abs(p.pos.y) > HALF_W - 6 ? 0 : Math.sign(p.pos.y || 1);
    66	    if (cx !== 0 || cy !== 0) {
    67	      const corner = norm({ x: cx, y: cy });
    68	      rx = rep.x + corner.x * 1.2;
    69	      ry = rep.y + corner.y * 1.2;
    70	    }
    71	  } else {
    72	    // Tilt lateral: straight retreats toward the own goal are the last resort.
    73	    // 边锋 (34.3, user report): a WIDE carrier escapes to HIS touchline or
    74	    // backward — never on an inward arc across the press. Guarded near the
    75	    // line itself, where the outward pull would carry into touch.
    76	    const wide = Math.abs(p.pos.y) > 8 && Math.abs(p.pos.y) < HALF_W - 5;
    77	    const tiltSign = wide ? Math.sign(p.pos.y) : Math.sign(ry || p.pos.y || 1);
    78	    if (wide && Math.sign(ry) !== tiltSign) ry = Math.abs(ry) * tiltSign * 0.6;
    79	    ry += tiltSign * 0.35 * Math.hypot(rx, ry);
    80	  }
    81	  let dir = norm({ x: rx, y: ry });
    82	  const forward = spaceAhead(p, { x: attackDir, y: 0 }, opponents);
    83	  // Holding late in the attacking half, "the front door is open" is not a
    84	  // reason to charge at goal — the corner carry stands.
    85	  if (forward > 0.55 && !(holdCorner && localX > 0)) return null;
    86	  const space = spaceAhead(p, dir, opponents);
    87	  if (space < 0.25) return null; // boxed in on every side — not an escape
    88	  return { dir, space };
    89	}
    90	
    91	/**
    92	 * Friction-free landing of an airborne ball: time to touch down and the
    93	 * exact point. The same closed form used to live inline in interceptBall,
    94	 * TeamBrain's drop-chaser and the executor's crash re-route — ONE
    95	 * projector now, so when the ball learns to curve (Phase 37 Magnus) every
    96	 * consumer reads the same corrected flight.
    97	 */
    98	export function ballLanding(ball: Ball): { t: number; x: number; y: number } {
    99	  const t = (ball.vz + Math.sqrt(ball.vz * ball.vz + 2 * GRAVITY * ball.z)) / GRAVITY;
   100	  const dx = ball.vel.x * t;
   101	  const dy = ball.vel.y * t;
   102	  // Magnus (Phase 37): a constant-rate spin flies a circular arc whose
   103	  // chord is the straight displacement rotated by HALF the total turn —
   104	  // the same closed form the kick's pre-compensation used, so designed
   105	  // deliveries land where they were designed to.
   106	  if (ball.spin !== 0) {
   107	    const half = ball.spin * t * 0.5;
   108	    const c = Math.cos(half);
   109	    const s = Math.sin(half);
   110	    return { t, x: ball.pos.x + dx * c - dy * s, y: ball.pos.y + dx * s + dy * c };
   111	  }
   112	  return { t, x: ball.pos.x + dx, y: ball.pos.y + dy };
   113	}
   114	
   115	/**
   116	 * How clean an AERIAL lane is (Phase 28): a lofted ball only cares about
   117	 * opponents close enough to the kicker to charge it down before it rises —
   118	 * everything downfield is flown over. Landing safety is the receiver's
   119	 * openness, scored separately by the caller.
   120	 */
   121	export function airLaneOpenness(from: V2, opponents: Player[]): number {
   122	  let worst = 1;
   123	  for (const o of opponents) {
   124	    if (o.sentOff) continue;
   125	    const d = dist(o.pos, from);
   126	    if (d < 1.5) continue; // right on top of the kicker — the chip clears them
   127	    worst = Math.min(worst, clamp01((d - 1.5) / 3));
   128	  }
   129	  return worst;
   130	}
   131	
   132	/** How clean the passing lane from `from` to `to` is (1 = wide open). */
   133	export function laneOpenness(from: V2, to: V2, opponents: Player[]): number {
   134	  let worst = 1;
   135	  for (const o of opponents) {
   136	    if (o.sentOff) continue;
   137	    const cp = closestPointOnSegment(from, to, o.pos);
   138	    // Ignore defenders standing right on top of the passer — the kick clears them.
   139	    if (dist(cp, from) < 1.5) continue;
   140	    const d = dist(cp, o.pos);
   141	    worst = Math.min(worst, clamp01(d / 4));
   142	  }
   143	  return worst;
   144	}
   145	
   146	/**
   147	 * Bodies parked on a shot path (Phase 31): outfield opponents within ~1m of
   148	 * the corridor's FIRST 60% — the final stretch belongs to the keeper (who
   149	 * has the save path, not the block path). This is what `shotQuality`'s
   150	 * distance·angle·pressure model cannot see: four set defenders between the
   151	 * ball and the goal read as "low pressure" while the drive has zero chance.
   152	 */
   153	export function laneBlockers(from: V2, goal: V2, opponents: Player[]): number {
   154	  const end = add(from, scale(sub(goal, from), 0.6));
   155	  let n = 0;
   156	  for (const o of opponents) {
   157	    if (o.sentOff || o.role === 'GK') continue;
   158	    const cp = closestPointOnSegment(from, end, o.pos);
   159	    if (dist(cp, o.pos) < 1.0) n++;
   160	  }
   161	  return n;
   162	}
   163	
   164	/**
   165	 * How ready this body is to BLOCK a strike from `from` (Phase 60): 1 = set
   166	 * and facing the shooter, floored at UNSET_BLOCK_WEIGHT for a sprinting or
   167	 * blind body — the collapsing block's retreaters can't organize a wall
   168	 * against the first-time hit. Shared by the shoot decision
   169	 * (effectiveBlockers) and the block physics (tryShotBlock).
   170	 */
   171	export function blockReadiness(o: Player, from: V2): number {
   172	  const dx = from.x - o.pos.x;
   173	  const dy = from.y - o.pos.y;
   174	  const d = Math.hypot(dx, dy);
   175	  const facing = d > 1e-6 ? (1 + (dx * o.heading.x + dy * o.heading.y) / d) / 2 : 1;
   176	  const stillness = clamp01((3.5 - Math.hypot(o.vel.x, o.vel.y)) / 2.5);
   177	  return UNSET_BLOCK_WEIGHT + (1 - UNSET_BLOCK_WEIGHT) * facing * stillness;
   178	}
   179	
   180	/**
   181	 * laneBlockers with each body weighted by blockReadiness (Phase 60): the
   182	 * count the shoot APPETITE should see. Four set defenders still read ~4;
   183	 * four mid-collapse retreaters read closer to 1.5 — dare the strike.
   184	 */
   185	export function effectiveBlockers(from: V2, goal: V2, opponents: Player[]): number {
   186	  const end = add(from, scale(sub(goal, from), 0.6));
   187	  let n = 0;
   188	  for (const o of opponents) {
   189	    if (o.sentOff || o.role === 'GK') continue;
   190	    const cp = closestPointOnSegment(from, end, o.pos);
   191	    if (dist(cp, o.pos) < 1.0) n += blockReadiness(o, from);
   192	  }
   193	  return n;
   194	}
   195	
   196	/** How much free space a receiver has (nearest opponent distance / 8m). */
   197	export function opennessOf(p: Player, opponents: Player[]): number {
   198	  let best = Infinity;
   199	  for (const o of opponents) {
   200	    if (o.sentOff) continue;
   201	    best = Math.min(best, dist(o.pos, p.pos));
   202	  }
   203	  return clamp01(best / 8);
   204	}
   205	
   206	/** Free space in front of a dribbler toward `dir` (10m lookahead cone). */
   207	export function spaceAhead(p: Player, dir: V2, opponents: Player[]): number {
   208	  const probe = add(p.pos, scale(norm(dir), 7));
   209	  let crowd = 0;
   210	  for (const o of opponents) {
   211	    if (o.sentOff) continue;
   212	    const d = dist(o.pos, probe);
   213	    if (d < 8) crowd += 1 - d / 8;
   214	  }
   215	  return clamp01(1 - crowd / 2);
   216	}
   217	
   218	/** Rough time for a player to reach a point at top speed (+turn overhead). */
   219	export function timeToPoint(p: Player, point: V2): number {
   220	  return dist(p.pos, point) / Math.max(p.topSpeed, 0.1) + 0.15;
   221	}
   222	
   223	export interface InterceptSolution {
   224	  point: V2;
   225	  tBall: number;
   226	  tMe: number;
   227	  reachable: boolean;
   228	}
   229	
   230	/**
   231	 * Intercept sampling grid, precomputed once. Uses the same `t += 0.1` float
   232	 * accumulation and exp() evaluations the per-call loop used to run (30 exps
   233	 * per call, every chasing player, every frame) — table values are
   234	 * bit-identical to what the loop produced; only the recomputation is gone.
   235	 */
   236	const INTERCEPT_T: number[] = [];
   237	const INTERCEPT_TRAVEL: number[] = [];
   238	for (let t = 0.1; t <= 3.0; t += 0.1) {
   239	  INTERCEPT_T.push(t);
   240	  INTERCEPT_TRAVEL.push((1 - Math.exp(-BALL_FRICTION_K * t)) / BALL_FRICTION_K);
   241	}
   242	
   243	/**
   244	 * Where should I run to meet the moving ball? The free ball follows
   245	 * pos(t) = p0 + v0 * (1 - e^{-kt}) / k. We sample forward and take the first
   246	 * point we can reach before the ball does; falls back to the rest point.
   247	 */
   248	export function interceptBall(p: Player, ball: Ball): InterceptSolution {
   249	  const v0 = ball.vel;
   250	  const speed0 = len(v0);
   251	  // timeToPoint inlined with the topSpeed getter hoisted out of the sampling
   252	  // loop (stamina can't change mid-call, so every sample read the same value);
   253	  // sample points stay scalar until one is actually returned. Same arithmetic
   254	  // in the same order — results are bit-identical, the garbage is gone.
   255	  const ts = Math.max(p.topSpeed, 0.1);
   256	  // Airborne ball (Phase 28): nothing on the ground meets it mid-flight —
   257	  // run to where it comes DOWN (friction-free flight, so the landing point
   258	  // is exact) and be there when it drops.
   259	  if (ball.z > 0.02 || ball.vz > 0.02) {
   260	    const { t: tLand, x: px, y: py } = ballLanding(ball);
   261	    const dx = p.pos.x - px;
   262	    const dy = p.pos.y - py;
   263	    const tMe = Math.sqrt(dx * dx + dy * dy) / ts + 0.15;
   264	    return { point: { x: px, y: py }, tBall: tLand, tMe, reachable: tMe <= tLand + 0.6 };
   265	  }
   266	  if (speed0 < 0.5) {
   267	    const dx = p.pos.x - ball.pos.x;
   268	    const dy = p.pos.y - ball.pos.y;
   269	    return { point: ball.pos, tBall: 0, tMe: Math.sqrt(dx * dx + dy * dy) / ts + 0.15, reachable: true };
   270	  }
   271	  const spinning = ball.spin !== 0;
   272	  for (let i = 0; i < INTERCEPT_T.length; i++) {
   273	    const t = INTERCEPT_T[i];
   274	    const travel = INTERCEPT_TRAVEL[i];
   275	    let px = ball.pos.x + v0.x * travel;
   276	    let py = ball.pos.y + v0.y * travel;
   277	    // Magnus (Phase 37): a curling ground ball — the displacement rotates
   278	    // by half the turn so far (the arc's chord). Zero-spin balls keep the
   279	    // exact straight table path.
   280	    if (spinning) {
   281	      const half = ball.spin * t * 0.5;
   282	      const c = Math.cos(half);
   283	      const s = Math.sin(half);
   284	      const rx = ball.pos.x + (px - ball.pos.x) * c - (py - ball.pos.y) * s;
   285	      py = ball.pos.y + (px - ball.pos.x) * s + (py - ball.pos.y) * c;
   286	      px = rx;
   287	    }
   288	    const dx = p.pos.x - px;
   289	    const dy = p.pos.y - py;
   290	    const tMe = Math.sqrt(dx * dx + dy * dy) / ts + 0.15;
   291	    if (tMe <= t) return { point: { x: px, y: py }, tBall: t, tMe, reachable: true };
   292	  }
   293	  const rest = add(ball.pos, scale(v0, 1 / BALL_FRICTION_K));
   294	  const dx = p.pos.x - rest.x;
   295	  const dy = p.pos.y - rest.y;
   296	  return { point: rest, tBall: 3, tMe: Math.sqrt(dx * dx + dy * dy) / ts + 0.15, reachable: false };
   297	}
   298	
   299	/** Can `p` cut out a pass traveling from the ball along its velocity? */
   300	export function canInterceptPass(p: Player, ball: Ball): { ok: boolean; point: V2 } {
   301	  const dir = norm(ball.vel);
   302	  if (dir.x === 0 && dir.y === 0) return { ok: false, point: ball.pos };
   303	  const end = add(ball.pos, scale(dir, 22));
   304	  const cp = closestPointOnSegment(ball.pos, end, p.pos);
   305	  const along = dist(ball.pos, cp);
   306	  // Average ball speed over the segment, decayed by friction (crude but stable).
   307	  const avgSpeed = Math.max(len(ball.vel) * 0.7, 4);
   308	  const tBall = along / avgSpeed;
   309	  const tMe = timeToPoint(p, cp);
   310	  return { ok: tMe < tBall * 0.95 && dist(p.pos, cp) < 10, point: cp };
   311	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/formations.ts | sed -n '1,360p;430,561p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { clamp } from '../utils/math';
     2	import { v2, type V2 } from '../utils/vec';
     3	import { BOX_DEPTH, CORNER_CLEARANCE, GOAL_WIDTH, HALF_L, HALF_W, PITCH_SCALE } from '../sim/constants';
     4	import type { Ball } from '../sim/Ball';
     5	import type { Player } from '../sim/Player';
     6	import type { Team } from '../sim/Team';
     7	import type {
     8	  AttackFormationId, CornerRoutine, DefendFormationId, TeamMode,
     9	} from '../sim/types';
    10	
    11	/**
    12	 * Formation spot tables (Phase 30) in team-local coordinates: +x = our
    13	 * attacking direction, x=-45 is our goal line. One V2 per SLOT in order
    14	 * [GK, DF, MF, WGL, WGR, ST]; every team owns one attacking and one
    15	 * defending table (its identity, `team.style`). The whole block still
    16	 * slides with the ball, the tactical mode, and three genes (formationDepth,
    17	 * attackingWidth, defensiveCompactness) exactly as it did on the old single
    18	 * BASE_SPOTS. Formation names count outfield lines back→front.
    19	 *
    20	 * Lanes are deliberately separated (Phase 27.1): stacked spines collapse
    21	 * open play into one central corridor. Back-line height is the goals lever
    22	 * (Phase 29/30: higher line = compressed game, space in behind for runs).
    23	 */
    24	export const ATTACK_FORMATIONS: Record<AttackFormationId, V2[]> = {
    25	  // Double base, a linking striker, both wingers HIGH and WIDE (两翼齐飞).
    26	  'wide-212': [v2(-41, 0), v2(-16, -6), v2(-12, 7), v2(8, -19), v2(8, 19), v2(4, 0)],
    27	  // One anchor, the left winger tucks in, an inside-right pair — at the
    28	  // HALF-SPACES (8/11 → 12/15, Phase 31.8): with both wide slots inside
    29	  // y≤11, a narrow-vs-narrow derby had no relief valve at all — both
    30	  // attacks mirrored into one central corridor and the top-5 most chaotic
    31	  // matches in the league (t+i 85–123, zero goals) were ALL this fixture.
    32	  // Still clearly narrower than wide-212's ±19: inside-forwards, not
    33	  // wingers.
    34	  'narrow-122': [v2(-41, 0), v2(-19, 0), v2(-9, -7), v2(-6, 12), v2(6, 15), v2(7, -3)],
    35	  // NOVEL (Phase 67, N5 — mutation-discovered only). TWIN STRIKERS: the
    36	  // right winger becomes a second 9 — a high pair splitting the center
    37	  // backs, one true wide feeder on the left, two at the base. The twins
    38	  // sit a touch higher than wide-212's wingers: a spearhead, not a line.
    39	  'twin-st': [v2(-41, 0), v2(-16, -4), v2(-11, 5), v2(2, -17), v2(10, 6), v2(10, -6)],
    40	  // NOVEL. The FALSE NINE: the striker DROPS between the lines (-2, the
    41	  // hole) to link and drag the last defender out; both wingers push very
    42	  // high and very wide — the runners the false nine releases into the
    43	  // space he vacated.
    44	  'false-nine': [v2(-41, 0), v2(-17, -5), v2(-12, 5), v2(12, -18), v2(12, 18), v2(-2, 0)],
    45	  // NOVEL (Phase 107, N5 — mutation-discovered only). The OVERLOAD: the
    46	  // library's first ASYMMETRIC shape — a three-man left-flank triangle
    47	  // (MF half-space, WGL wide, ST shading in) with the right winger ALONE
    48	  // at maximum width as the isolation outlet (overload to isolate: the
    49	  // switch finds him 1v1). The anchor shades right-center to cover the
    50	  // side the triangle vacates.
    51	  'overload': [v2(-41, 0), v2(-17, 3), v2(-7, -9), v2(9, -17), v2(8, 17), v2(5, -7)],
    52	  // NOVEL. The TARGET MAN (the user's N1.5 reference point — 埃弗顿高塔):
    53	  // the lone tower stands HIGHEST of any shape (+9) as the long ball's
    54	  // destination — the Phase-63 aerial channel finally gets a shape built
    55	  // around it (strength/aerialSense own the descent) — with both wingers
    56	  // at mid-height arriving onto the knock-down, staggered double base
    57	  // behind (no stacked central spine, the 27.1 lesson).
    58	  'target-man': [v2(-41, 0), v2(-18, -4), v2(-10, 5), v2(0, -14), v2(0, 14), v2(9, 0)],
    59	};
    60	
    61	// Defend tables keep the STRIKER HIGH on purpose (30.4). The first cut
    62	// parked all five outfielders goal-side and league scoring collapsed to
    63	// ~1.1: a high body PINS an opposing defender (offence by presence) and
    64	// gives every turnover a launch point — 29.x, whose single spot table left
    65	// the ST at +5 even out of possession, scored fine for exactly this
    66	// reason. Identity lives in the BACK of the shape instead: low-32 drops
    67	// both wingers as wide backs; press-23 pushes them onto the build-up.
    68	export const DEFEND_FORMATIONS: Record<DefendFormationId, V2[]> = {
    69	  // Back THREE (wingers drop as wide backs), MF screens, ST stays HIGH.
    70	  'low-32': [v2(-41, 0), v2(-20, 0), v2(-9, -4), v2(-16, -11), v2(-16, 11), v2(5, 2)],
    71	  // Back two, wingers at halfway, ST hunting the opponent back line.
    72	  'press-23': [v2(-41, 0), v2(-18, -5), v2(-13, 5), v2(0, -15), v2(0, 15), v2(7, 0)],
    73	  // N5b (phase-79): the menu was BINARY (deep bus / front press) and world
    74	  // 991 fixed 16/0 on low-32 — selection had nothing structurally new to
    75	  // try. Two additions, mutation-only (founders still derive the classics):
    76	  // mid-41 = the midfield WALL, striker drops onto the pivot lane
    77	  // ("defend from the front" without pressing);
    78	  'mid-41': [v2(-41, 0), v2(-22, 0), v2(-10, 0), v2(-12, -13), v2(-12, 13), v2(-3, 0)],
    79	  // high-line = squeeze the pitch with the back line, no front press —
    80	  // lives or dies by the offside trap (phase-71's law made it honest).
    81	  'high-line': [v2(-41, 0), v2(-14, -3), v2(-9, 3), v2(-13, -12), v2(-13, 12), v2(6, 0)],
    82	};
    83	
    84	// Density相变 (2026-07-20): the fixed tables above were tuned in ABSOLUTE
    85	// metres for the 90×58 pitch, so on a shrunk pitch (PITCH_SCALE<1) they fall
    86	// out of bounds. Scale them to stay proportional + in-bounds. The DEFAULT path
    87	// is emergentStation (fractional, already fits); this keeps the legacy fixed
    88	// path + the pre-match shape diagrams valid when the field is scaled.
    89	if (PITCH_SCALE !== 1) {
    90	  for (const table of [ATTACK_FORMATIONS, DEFEND_FORMATIONS] as Record<string, V2[]>[]) {
    91	    for (const key of Object.keys(table)) {
    92	      table[key] = table[key].map((p) => v2(p.x * PITCH_SCALE, p.y * PITCH_SCALE));
    93	    }
    94	  }
    95	}
    96	
    97	// EMERGENT POSITIONING FIELD (Phase B → DEFAULT 2026-07-20, the coordinated
    98	// density相变). Positions grow from role + genes + live state, not a fixed
    99	// formation menu — VISION §1's #1 violation retired. It is REQUIRED on the
   100	// shrunk pitch (PITCH_SCALE<1): emergent stations are fractional and auto-fit,
   101	// the fixed tables use absolute coords and would fall off a smaller pitch.
   102	// The UI toggle (settings → experimental) can still turn it OFF for A/B, and
   103	// probes can force-OFF with EMERGENT_POS=0.
   104	let _emergentPos: boolean | null = null; // null = use the default (ON)
   105	export function setEmergentPos(on: boolean): void {
   106	  _emergentPos = on;
   107	}
   108	export function emergentPosOn(): boolean {
   109	  if (_emergentPos !== null) return _emergentPos; // explicit UI / probe override
   110	  // typeof guard: `process` is undefined in the browser bundle — never throw.
   111	  if (typeof process !== 'undefined' && process.env && process.env.EMERGENT_POS === '0') return false;
   112	  return true; // DEFAULT ON
   113	}
   114	
   115	/** How far up/down the pitch each tactical mode pushes the block. */
   116	const MODE_SHIFT: Record<TeamMode, number> = {
   117	  Attack: 10,
   118	  BuildUp: 4,
   119	  CounterAttack: 8,
   120	  Press: 6,
   121	  Defend: -8,
   122	  ResetShape: 0,
   123	};
   124	
   125	/**
   126	 * World-space formation target for a player. `hasBall` decides whether width
   127	 * (attackingWidth) or compactness (defensiveCompactness) shapes the block.
   128	 */
   129	export function formationSpot(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
   130	  // EMERGENT POSITIONING FIELD (Phase B1, toggle — the user's #1 emergence
   131	  // ask: shape must grow from role + genes + live state, not a hand-authored
   132	  // MENU). Behind a flag so it A/Bs cleanly against the fixed tables
   133	  // (positioning-shape.ts) before it can replace them. OFF = today's behavior.
   134	  if (emergentPosOn()) return emergentStation(p, team, ball, hasBall, opp);
   135	  const g = team.genome;
   136	  const base = hasBall
   137	    ? ATTACK_FORMATIONS[team.style.formationAtk][p.index]
   138	    : DEFEND_FORMATIONS[team.style.formationDef][p.index];
   139	
   140	  // Block slides toward the ball along x (local coords), capped at ±10m.
   141	  const ballLocalX = team.localX(ball.pos.x);
   142	  const slide = clamp(ballLocalX * 0.3, -10, 10);
   143	
   144	  // formationDepth: 0 = sit 6m deeper, 1 = push 6m higher.
   145	  const depth = (g.formationDepth - 0.5) * 12;
   146	
   147	  // PRESSING BUYS ITS RISK (Phase 83, the goal-inflation fix): a pressing
   148	  // side's defensive block steps UP with its press gene — outfielders only,
   149	  // defending phase only. Before this, line height was formationDepth's
   150	  // alone, so evolution could chase-press from a deep couch: turnovers with
   151	  // ZERO space conceded behind — the free lunch that rode pressIntensity to
   152	  // 0.88 and the league to 6-7 goals (phase-82 anatomy). Now the line you
   153	  // press with is the line the through-ball/route-one/chip channels attack.
   154	  const pressUp = hasBall || p.role === 'GK' ? 0 : (g.pressIntensity - 0.5) * 8;
   155	
   156	  let x = base.x + slide + depth + pressUp + MODE_SHIFT[team.mode];
   157	
   158	  // Rest defence (Phase 31): the DF slot NEVER joins the siege. With the
   159	  // ball deep in the opponent half, slide (+10) + Attack shift (+10) used
   160	  // to push even the last outfielder past halfway — the attacking team had
   161	  // literally nobody covering, so every turnover was an uncontested
   162	  // breakaway. That hole is what let a 5v6 side out-score its own
   163	  // full-strength baseline once the open-run economy paid honestly
   164	  // (counters were ALL open runs). One cover man keeps counters real —
   165	  // beatable by pace or a dragged block, never free.
   166	  // −12, not −5: a cover man AT halfway is already beaten by the time a
   167	  // counter carrier enters the open-run zone (28m out) — he has to start
   168	  // goal-side of the race, near his base spot, to ever contest it.
   169	  if (p.index === 1 && p.role !== 'GK') {
   170	    if (hasBall) {
   171	      // Rest-defense depth is now the SWEEPER gene's possession face
   172	      // (Phase 88): 0.5 = the old hardcoded −12 exactly; the full libero
   173	      // (1) holds −16 even mid-siege, the bold stopper (0) dares −8.
   174	      x = Math.min(x, -8 - (g.coverBias ?? 0.5) * 8);
   175	    } else {
   176	      // THE SWEEPER (Phase 88, school #2 — catenaccio): the DF slot sits
   177	      // off his own line by the gene — behind it (libero: the man who
   178	      // meets whatever beats the first wave, at the price of playing
   179	      // everyone onside) or ahead of it (stopper: early interceptions,
   180	      // gambling the space behind). 0.5 = today's flat line.
   181	      x -= ((g.coverBias ?? 0.5) - 0.5) * 8;
   182	    }
   183	  }
   184	
   185	  // Width: stretch when we have the ball, squeeze when we don't. The
   186	  // in-possession floor is 1.0 (Phase 27.1) — an attacking shape should
   187	  // never be narrower than its base lanes.
   188	  let widthMul = hasBall
   189	    ? 1.0 + g.attackingWidth * 0.55 // 1.0 .. 1.55
   190	    : 1.15 - g.defensiveCompactness * 0.6; // 1.15 .. 0.55
   191	  // Zonal shape stays HONEST-WIDE (Phase 30.4): a zone defence covers
   192	  // width by definition — it may not also collapse into the central
   193	  // corridor, or its parked bodies dead-lane the entire pitch (measured:
   194	  // zonal sides conceded 3.6 shots/match vs man's 8 — the league's shot
   195	  // volume collapsed with half the clubs zonal).
   196	  if (!hasBall && team.style.scheme === 'zonal') widthMul = Math.max(widthMul, 0.95);
   197	  let y = base.y * widthMul;
   198	
   199	  // Compact teams also drag their block a little toward the ball's y.
   200	  if (!hasBall) y += (ball.pos.y - y * team.attackDir) * team.attackDir * g.defensiveCompactness * 0.25;
   201	
   202	  // Weak-side far-post pull (Phase 31): when the attack is deep AND wide,
   203	  // the far winger leaves the touchline and attacks the back post — the
   204	  // overload that punishes a ball-side defensive shift, and the second
   205	  // body a cutback or deep cross finds. The strong-side winger keeps the
   206	  // width; the pull releases as soon as the ball comes back central.
   207	  if (
   208	    hasBall && p.role === 'WG' && ballLocalX > HALF_L - 20 &&
   209	    Math.abs(ball.pos.y) > 12 && Math.sign(y) !== Math.sign(ball.pos.y)
   210	  ) {
   211	    y *= 0.3;
   212	  }
   213	
   214	  if (p.role === 'GK') {
   215	    // Keepers hold a narrow band in front of goal regardless of mode.
   216	    x = clamp(base.x + (g.keeperAggression - 0.5) * 4, -HALF_L + 1, -HALF_L + 11);
   217	    y = clamp(ball.pos.y * 0.25, -GOAL_WIDTH / 2, GOAL_WIDTH / 2);
   218	    return v2(x * team.attackDir, y);
   219	  }
   220	
   221	  x = clamp(x, -HALF_L + 3, HALF_L - 7);
   222	  y = clamp(y, -HALF_W + 2, HALF_W - 2);
   223	  return v2(x * team.attackDir, y);
   224	}
   225	
   226	/**
   227	 * EMERGENT POSITIONING FIELD (Phase B1-a). Replaces the fixed formation TABLE
   228	 * with a ROLE-anchored field: a role gives a coarse depth+lane TENDENCY (a
   229	 * dimension, like an attribute — not a hand-drawn shape), and the actual
   230	 * station grows from that + the live game state, weighted by GENES. So the
   231	 * team's SHAPE and "style" emerge from gene weights, not from us picking
   232	 * wide-212 vs low-32. B1-a lands the structural swap + a REAL, gene-weighted
   233	 * strong/weak-side shift (the B0 probe found the old ~2m drag was token). The
   234	 * anti-clump / space-value terms (kill the bus box-crowd, no clumping) are
   235	 * B1-b. Opponent-relative positioning is B2. Same sensible modifiers as the
   236	 * table path (slide/depth/press/rest-defence/width) so shape stays sane.
   237	 */
   238	function emergentStation(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
   239	  const g = team.genome;
   240	  // Role → coarse (depth fraction of HALF_L, lane fraction of HALF_W). WGs take
   241	  // a side from their slot (L=3, R=4); everyone else holds a central lane.
   242	  const laneSign = p.index === 3 ? -1 : p.index === 4 ? 1 : 0;
   243	  let depthFrac: number;
   244	  let laneFrac: number;
   245	  switch (p.role) {
   246	    case 'GK': depthFrac = -0.91; laneFrac = 0; break;
   247	    case 'DF': depthFrac = -0.45; laneFrac = 0; break;
   248	    case 'MF': depthFrac = -0.12; laneFrac = laneSign * 0.12; break;
   249	    case 'WG': depthFrac = 0.05; laneFrac = laneSign * 0.6; break;
   250	    default: depthFrac = 0.12; laneFrac = 0; break; // ST
   251	  }
   252	
   253	  const ballLocalX = team.localX(ball.pos.x);
   254	  const slide = clamp(ballLocalX * 0.3, -10, 10);
   255	  const depth = (g.formationDepth - 0.5) * 12;
   256	  const pressUp = hasBall || p.role === 'GK' ? 0 : (g.pressIntensity - 0.5) * 8;
   257	  let x = depthFrac * HALF_L + slide + depth + pressUp + MODE_SHIFT[team.mode];
   258	
   259	  // Rest defence — the DF slot never joins the siege (same as the table path).
   260	  if (p.index === 1 && p.role !== 'GK') {
   261	    if (hasBall) x = Math.min(x, -8 - (g.coverBias ?? 0.5) * 8);
   262	    else x -= ((g.coverBias ?? 0.5) - 0.5) * 8;
   263	  }
   264	
   265	  // Width: stretch in possession, squeeze out of it.
   266	  let widthMul = hasBall ? 1.0 + g.attackingWidth * 0.55 : 1.15 - g.defensiveCompactness * 0.6;
   267	  if (!hasBall && team.style.scheme === 'zonal') widthMul = Math.max(widthMul, 0.95);
   268	  let y = laneFrac * HALF_W * widthMul;
   269	
   270	  // ⭐ STRONG / WEAK SIDE (B1-a, the real thing): the block slides toward the
   271	  // BALL'S y — overload the ball side in attack, protect it in defence —
   272	  // weighted by width (attack) / compactness (defence). The B0 probe measured
   273	  // the old drag at only ~2m and gene-flat; this is a genuine, selectable
   274	  // ball-side shift, so a team that commits to it gets a real strong side and
   275	  // leaves a weak side (which width/switches then punish — emergent).
   276	  // TRANSLATE the block ball-side (add a common offset) — do NOT converge each
   277	  // man onto ball.y (that collapses the lateral spread; the first B1-a cut did,
   278	  // halving spreadY). The whole shape slides over, keeping its width.
   279	  const ballSideShift = hasBall ? 0.18 + g.attackingWidth * 0.22 : 0.18 + g.defensiveCompactness * 0.25;
   280	  y += ball.pos.y * ballSideShift;
   281	
   282	  // ⭐ B2: the block tracks the OPPONENT's push, not just the ball (the user's
   283	  // "阵型也不会随着对面的移动而移动"). The defensive spine (DF/MF) holds a line
   284	  // just goal-side of the opponents' advanced players — step UP when they sit
   285	  // deep, DROP when they push. A modest convergence, so the block MOVES WITH
   286	  // the opponent line while keeping its own depth structure. Only when we have
   287	  // an opponent reference (executor/marking path); attack + supportSpot skip it.
   288	  if (!hasBall && opp && (p.role === 'DF' || p.role === 'MF')) {
   289	    const adv = opp.players
   290	      .filter((o) => o.role !== 'GK' && !o.sentOff)
   291	      .map((o) => team.localX(o.pos.x))
   292	      .sort((a, b) => a - b);
   293	    if (adv.length >= 2) {
   294	      const holdLine = adv[1] - 3; // goal-side of their 2nd-deepest attacker
   295	      x += (holdLine - x) * 0.14;
   296	    }
   297	  }
   298	
   299	  // ⭐ B1-b: ANTI-CLUMP + position by VALUE (the user's "一堆人挤自家禁区,防守
   300	  // 帮助 0" / "别扎堆"). Stations REPEL each other, so bodies SPREAD to cover
   301	  // space instead of piling into the same zone — the emergent alternative to a
   302	  // fixed lattice AND to the bus box-crowd. Computed in the local-x / world-y
   303	  // frame (x is local, y unflipped). Plus a box-crowd relief: with no ball
   304	  // threat to our box, nobody buries INSIDE it — hold the useful edge.
   305	  // Defensive THREAT = how close the ball is to OUR goal (0 at/above halfway,
   306	  // ~1 deep in our third). Spread when there's no threat (cover space, no
   307	  // bus-crowd); COMPACT the last line under threat (B-continued — the first
   308	  // B1-b spread even the back line → clean chances → goals-warming inflated
   309	  // to overperf 2.1×; solidity restored here).
   310	  const threat = clamp((-team.localX(ball.pos.x) - 8) / 26, 0, 1);
   311	  if (p.role !== 'GK') {
   312	    let rx = 0;
   313	    let ry = 0;
   314	    for (const q of team.players) {
   315	      if (q === p || q.role === 'GK' || q.sentOff) continue;
   316	      const dxL = x - team.localX(q.pos.x);
   317	      const dyL = y - q.pos.y;
   318	      const d = Math.hypot(dxL, dyL);
   319	      if (d < 9 && d > 1e-3) {
   320	        const f = (9 - d) / 9;
   321	        rx += (dxL / d) * f;
   322	        ry += (dyL / d) * f;
   323	      }
   324	    }
   325	    const spread = 2.6 * (1 - threat * 0.7); // don't spread the last line under threat
   326	    x += clamp(rx * spread, -7, 7);
   327	    y += clamp(ry * spread, -7, 7);
   328	    // no useless burying in our own box when the ball isn't threatening it
   329	    if (team.localX(ball.pos.x) > -20 && x < -HALF_L + BOX_DEPTH) x = -HALF_L + BOX_DEPTH + 2;
   330	    // SOLIDITY under threat: the back/mid block collapses goal-ward + central
   331	    // as the ball bears down, so the last line stays compact and denies the
   332	    // clean chance (the ST stays high as the outlet).
   333	    if (!hasBall && p.role !== 'ST' && threat > 0) {
   334	      const kk = threat * (0.3 + g.defensiveCompactness * 0.5);
   335	      x += (-HALF_L + 11 - x) * kk * 0.45;
   336	      y += (0 - y) * kk * 0.3;
   337	    }
   338	  }
   339	
   340	  if (p.role === 'GK') {
   341	    x = clamp(-HALF_L + 4 + (g.keeperAggression - 0.5) * 4, -HALF_L + 1, -HALF_L + 11);
   342	    y = clamp(ball.pos.y * 0.25, -GOAL_WIDTH / 2, GOAL_WIDTH / 2);
   343	    return v2(x * team.attackDir, y);
   344	  }
   345	  x = clamp(x, -HALF_L + 3, HALF_L - 7);
   346	  y = clamp(y, -HALF_W + 2, HALF_W - 2);
   347	  return v2(x * team.attackDir, y);
   348	}
   349	
   350	/**
   351	 * Free-kick wall slots (Phase 32): shoulder-to-shoulder on the ball–goal
   352	 * line at the law clearance (9.15m), 0.7m apart, centered. Shared by the
   353	 * executor (routing), the referee's wall-wait gate and the flight solver —
   354	 * one geometry, so nothing fights and nobody strikes past a half-built
   355	 * wall standing in the climb's header band.
   356	 */
   357	export function fkWallSlots(from: V2, goal: V2, n: number): V2[] {
   358	  const dx = goal.x - from.x;
   359	  const dy = goal.y - from.y;
   360	  const dl = Math.max(Math.sqrt(dx * dx + dy * dy), 1e-6);
   430	export function shapeReady(team: Team, ball: Ball, radius = 6): boolean {
   431	  let settled = 0;
   432	  let outfield = 0;
   433	  for (const p of team.players) {
   434	    if (p.role === 'GK' || p.sentOff) continue;
   435	    outfield++;
   436	    const spot = formationSpot(p, team, ball, true);
   437	    const dx = p.pos.x - spot.x;
   438	    const dy = p.pos.y - spot.y;
   439	    if (dx * dx + dy * dy < radius * radius) settled++;
   440	  }
   441	  return settled >= Math.min(3, outfield);
   442	}
   443	
   444	/**
   445	 * The opponents' last defensive line, in `team`-local x (bigger = deeper
   446	 * toward their goal). GK excluded — beating the keeper is the striker's job.
   447	 */
   448	export function defenderLineLocalX(team: Team, opponents: Player[]): number {
   449	  let line = -HALF_L;
   450	  for (const o of opponents) {
   451	    if (o.role === 'GK' || o.sentOff) continue;
   452	    const lx = team.localX(o.pos.x);
   453	    if (lx > line) line = lx;
   454	  }
   455	  return line;
   456	}
   457	
   458	/**
   459	 * The OFFSIDE line in `team`-local x (Phase 29): the second-last opponent
   460	 * COUNTING the keeper (the real law — usually the last outfield defender,
   461	 * because the keeper is the last man), or the ball itself if it's deeper,
   462	 * floored at halfway (you cannot be offside in your own half). An attacker
   463	 * ahead of this line when a teammate strikes the ball is in an offside
   464	 * position; level is onside (callers add their own epsilon).
   465	 */
   466	export function offsideLineLocalX(team: Team, opponents: Player[], ballLocalX: number): number {
   467	  let last = -HALF_L;
   468	  let secondLast = -HALF_L;
   469	  for (const o of opponents) {
   470	    if (o.sentOff) continue;
   471	    const lx = team.localX(o.pos.x);
   472	    if (lx > last) {
   473	      secondLast = last;
   474	      last = lx;
   475	    } else if (lx > secondLast) {
   476	      secondLast = lx;
   477	    }
   478	  }
   479	  return Math.max(secondLast, ballLocalX, 0);
   480	}
   481	
   482	/**
   483	 * Where an assigned runner sprints: past the last defender's shoulder,
   484	 * angling into the channel toward goal. Clamped short of the keeper's box so
   485	 * runs stretch the defence without parking on the goal line. The target aims
   486	 * BEYOND the line on purpose — while a teammate still carries the ball the
   487	 * executor holds the run at the offside line (Phase 29), and the instant the
   488	 * kick is struck the clamp releases and this target is the burst in behind.
   489	 */
   490	export function runTarget(p: Player, team: Team, opponents: Player[]): V2 {
   491	  const line = defenderLineLocalX(team, opponents);
   492	  const myX = team.localX(p.pos.x);
   493	  const targetLocalX = clamp(Math.max(line + 7, myX + 5), myX + 3, HALF_L - 9);
   494	  // Narrow toward the goal mouth as the run goes deeper, keeping the lane.
   495	  // The poacher (Phase 39) attacks the POST CHANNEL (|y|≈3.5, his wing's
   496	  // post) — the tap-in zone. NOT the center: a first cut narrowed him to
   497	  // ×0.35 and his runs ended on the keeper's chest (fm 21, the goal-pull
   498	  // lesson — conversion went DOWN and the finishing invariant test flagged
   499	  // it).
   500	  const y = p.traits.includes('poacher')
   501	    ? Math.sign(p.pos.y || 1) * 3.5
   502	    : clamp(p.pos.y * 0.6, -HALF_W + 4, HALF_W - 4);
   503	  return v2(targetLocalX * team.attackDir, y);
   504	}
   505	
   506	/**
   507	 * Where a through ball should MEET a runner (Phase 29). A runner already in
   508	 * stride is led by their velocity, like any pass. But a runner HELD at the
   509	 * offside line hovers with near-zero velocity — leading by velocity would
   510	 * put the ball at their feet ON the line, exactly the ball the line exists
   511	 * to kill. The pass anticipates the break instead: it projects the burst
   512	 * along the run target at the runner's top speed, and the runner breaks the
   513	 * instant the kick releases the onside hold. Judgment stays honest — the
   514	 * flag is judged on where the runner STANDS at the kick, not the aim point.
   515	 */
   516	export function runBurstPoint(p: Player, team: Team, opponents: Player[], flight: number): V2 {
   517	  const speed = Math.hypot(p.vel.x, p.vel.y);
   518	  if (speed > 3) {
   519	    return v2(p.pos.x + p.vel.x * flight * 1.6, p.pos.y + p.vel.y * flight * 1.6);
   520	  }
   521	  const rt = runTarget(p, team, opponents);
   522	  const dx = rt.x - p.pos.x;
   523	  const dy = rt.y - p.pos.y;
   524	  const d = Math.hypot(dx, dy) || 1;
   525	  const burst = Math.min(d, p.topSpeed * flight * 1.1);
   526	  return v2(p.pos.x + (dx / d) * burst, p.pos.y + (dy / d) * burst);
   527	}
   528	
   529	/**
   530	 * Where an off-ball player supports the carrier: ahead of the ball for
   531	 * attacking modes, pulled laterally TOWARD the supporter's own formation
   532	 * lane, at a radius set by the supportDistance gene.
   533	 *
   534	 * Lane-pulled but radius-bounded (Phase 30.5): the old sign()-based nudge
   535	 * kept every supporter within ~5m of the ball's y, so all three off-ball
   536	 * attackers formed one narrow column ahead of the carrier — dragging their
   537	 * markers into the same corridor, walling off every forward lane
   538	 * (interceptions ran 33/match) and pulling wingers off the flank. Pulling
   539	 * y toward the lane spreads support into a fan: near-central options stay
   540	 * short, the ball-side winger becomes a REAL wide outlet. The lateral pull
   541	 * is capped at ~0.9× the support radius on purpose — a first cut anchored
   542	 * y fully to the lane, which parked "support" 30m from the carrier: no
   543	 * short options left, neutral-genome attacks starved (mirror goals 1.47 →
   544	 * 0.93), and the 5v6 sanity invariant inverted (probe-shorthand).
   545	 */
   546	export function supportSpot(p: Player, team: Team, ball: Ball): V2 {
   547	  const g = team.genome;
   548	  // 10..18m: close enough for a give-and-go, far enough that the carrier
   549	  // isn't mobbed by their own teammates (Phase 19 spacing pass, widened in
   550	  // Phase 27.1 — the crowd complaint was real).
   551	  const radius = 10 + g.supportDistance * 8;
   552	  const aheadBias = team.mode === 'CounterAttack' || team.mode === 'Attack' ? 0.75 : 0.35;
   553	
   554	  const lane = formationSpot(p, team, ball, true);
   555	  const maxLat = radius * 0.9;
   556	  const latPull = clamp((lane.y - ball.pos.y) * 0.75, -maxLat, maxLat);
   557	  return v2(
   558	    clamp(ball.pos.x + team.attackDir * radius * aheadBias, -HALF_L + 2, HALF_L - 2),
   559	    clamp(ball.pos.y + latPull, -HALF_W + 2, HALF_W - 2),
   560	  );
   561	}

[35m[3mcodex[0m[0m
The code already contains two architectures at once: local normalized queries feeding carrier utilities, and a separate hand-composed positioning/coordination system. The main design issue is therefore not “add more perception helpers”; it is choosing where subjective belief enters so scoring, movement, and execution do not disagree.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/PlayerBrain.ts | sed -n '430,875p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   430	    const line = defenderLineLocalX(team, opp.players);
   431	    // Third man (Phase 34): p JUST received — the bounce to a runner within a
   432	    // beat is the possession game's release. Modulated by passBias.
   433	    const lpT = match.lastCompletedPass;
   434	    const fresh = lpT !== null && lpT.receiverGid === p.gid && match.simTime - lpT.t < 1.5;
   435	    for (const mate of team.players) {
   436	      if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;
   437	      const bounceMul = fresh && lpT!.passerGid !== mate.gid ? 1 + g.passBias * 0.35 * W.thirdManW : 1;
   438	      const flight = dist(p.pos, mate.pos) / 18;
   439	      // Meet the run, not the hover (Phase 29): a runner held onside shows
   440	      // ~zero velocity, so the aim point projects the burst they will make.
   441	      const burst = runBurstPoint(mate, team, opp.players, flight);
   442	      const point = {
   443	        x: clamp(burst.x, -HALF_L + 2, HALF_L - 2),
   444	        y: clamp(burst.y, -HALF_W + 2, HALF_W - 2),
   445	      };
   446	      if (team.localX(point.x) < localX + 5) continue; // must genuinely penetrate
   447	      const lane = laneOpenness(p.pos, point, opp.players);
   448	      const behind = clamp01((team.localX(point.x) - line) / 10);
   449	      let gates = (0.45 + g.riskTolerance * 0.85) * (0.85 + g.tempo * 0.3) * (1 + stagnation * 0.2);
   450	      // A runner ALREADY beyond the offside line is flagged the moment this
   451	      // ball is struck (Phase 29) — wait for them to check their run instead.
   452	      // The held run (executor clamp) makes the legal version of this ball.
   453	      if (!offsideExemptKick && team.localX(mate.pos.x) > offLine + 0.2) gates *= 0.1;
   454	      // The behind term alone used to float a fully-walled ball over the
   455	      // selection bar (Phase 30.5): 82% of through balls went into blocked
   456	      // lanes at 36% completion (probe-pass). Openness now gates the score
   457	      // multiplicatively — open balls unchanged, walls discount hard.
   458	      const s =
   459	        (W.throughBase + lane * W.throughOpenW + behind * W.throughBehindW) *
   460	        gates * (0.4 + 0.6 * clamp01(lane / 0.45)) * bounceMul;
   461	      if (s > bestThrough) {
   462	        bestThrough = s;
   463	        bestRunner = mate;
   464	        bestThroughLane = lane;
   465	        bestBehind = behind;
   466	        bestThroughChip = false;
   467	      }
   468	      // Chip over the top (Phase 28): when bodies block the ground lane but
   469	      // the runner is going in behind, go over them instead — slower to
   470	      // arrive and harder to bring down (technique gates the trust in it).
   471	      // Judged at the LANDING (Phase 30.5): airLane only sees the kicker's
   472	      // surroundings, so packed drop zones looked wide open — the chip's
   473	      // real risk is who stands where the ball comes down.
   474	      if (lane < 0.45) {
   475	        const landOpen = 1 - pressureAt(point, opp.players);
   476	        const sC =
   477	          (W.throughBase + landOpen * W.throughOpenW * 0.8 + behind * W.throughBehindW) *
   478	          gates * 0.9 * (0.55 + p.attrs.passing * 0.7) *
   479	          (0.7 + airLane * 0.3) * (0.4 + 0.6 * clamp01(landOpen / 0.45)) * bounceMul;
   480	        if (sC > bestThrough) {
   481	          bestThrough = sC;
   482	          bestRunner = mate;
   483	          bestThroughLane = landOpen;
   484	          bestBehind = behind;
   485	          bestThroughChip = true;
   486	        }
   487	      }
   488	    }
   489	    if (bestRunner) {
   490	      cands.push({
   491	        action: 'ThroughBall',
   492	        score: bestThrough,
   493	        why: `${bestThroughChip ? 'chipped over the top ' : ''}into ${bestRunner.name}'s run · lane ${bestThroughLane.toFixed(2)} · behind ${bestBehind.toFixed(2)} · risk ${g.riskTolerance.toFixed(2)}`,
   494	      });
   495	    }
   496	  }
   497	
   498	  // --- Cross (Phase 28): from wide and advanced (or the corner flag), whip
   499	  // it at the best aerial target attacking the box. Wide-overload football
   500	  // lives here: attackingWidth is the style gene that trusts the delivery.
   501	  let bestCrossMate: Player | null = null;
   502	  let bestCrossT = 0;
   503	  const isCorner = kickKind === 'corner';
   504	  if (p.kickCooldown <= 0 && (isCorner || (Math.abs(p.pos.y) > 10 && localX > 10))) {
   505	    for (const mate of team.players) {
   506	      if (mate === p || mate.sentOff || mate.role === 'GK') continue;
   507	      const mLocalX = team.localX(mate.pos.x);
   508	      if (mLocalX < 16 || Math.abs(mate.pos.y) > 13) continue; // must attack the box channel
   509	      let t =
   510	        aerialSense(mate) * 0.6 +
   511	        opennessOf(mate, opp.players) * 0.4 +
   512	        clamp01((mLocalX - 18) / 20) * 0.25;
   513	      // Corner routine (Phase 31): a post routine aims the delivery at the
   514	      // crasher attacking the KEY zone — the separation run the 29.1
   515	      // momentum lever needed but never got a delivery for.
   516	      if (isCorner && (kickRoutine === 'nearPost' || kickRoutine === 'farPost')) {
   517	        t += clamp01(1 - dist(mate.pos, cornerKeyZone(kickRoutine, team.attackDir, p.pos.y)) / 10) * 0.6;
   518	      }
   519	      // Open-play crosses are judged like any pass (Phase 29) — an offside
   520	      // box target wastes the delivery. Corners are exempt (real law).
   521	      if (!offsideExemptKick && mLocalX > offLine + 0.2) t *= 0.12;
   522	      if (t > bestCrossT) {
   523	        bestCrossT = t;
   524	        bestCrossMate = mate;
   525	      }
   526	    }
   527	    if (bestCrossMate) {
   528	      let sX = W.crossBase + bestCrossT * W.crossBoxW;
   529	      sX *= 0.75 + g.attackingWidth * 0.5;
   530	      sX *= 0.7 + g.passBias * 0.4;
   531	      if (p.role === 'WG') sX *= 1.25; // it's what wingers are FOR (28.3)
   532	      if (team.mode === 'Attack' || team.mode === 'CounterAttack') sX *= 1.15;
   533	      // The corner IS a cross — deliver it. Unless the routine says the
   534	      // ball goes SHORT or to the ARC (Phase 31): then the whip is the
   535	      // fallback, not the plan.
   536	      if (isCorner) sX *= kickRoutine === 'short' || kickRoutine === 'arcCutback' ? 0.7 : 2.4;
   537	      if (!mustKick) sX *= 1 - kickMisalignment(p, norm(sub(bestCrossMate.pos, p.pos))) * 0.12 * (1 - p.attrs.passing * 0.5);
   538	      cands.push({
   539	        action: 'Cross',
   540	        score: sX,
   541	        why: `${isCorner ? 'corner — ' : ''}to ${bestCrossMate.name} in the box · target ${bestCrossT.toFixed(2)} · width ${g.attackingWidth.toFixed(2)}`,
   542	      });
   543	    }
   544	  }
   545	
   546	  // --- Cutback (Phase 31): from the byline zone, the hard pull-back to the
   547	  // arc — real football's canonical set-defence beater. The regular pass
   548	  // loop can never pick it (gain < 0 reads as a back-pass and gets
   549	  // penalized), so it scores as its own candidate aimed at the licensed
   550	  // ARRIVER, whose late run the executor routes to the arc. The receiver's
   551	  // snap-decision window (giveBall) makes the first-time strike.
   552	  let cutbackMate: Player | null = null;
   553	  let cutbackCand: UtilityScore | null = null;
   554	  const cornerCutback = kickKind === 'corner' && kickRoutine === 'arcCutback';
   555	  if (
   556	    p.kickCooldown <= 0 && (!mustKick || cornerCutback) && team.arriver !== null &&
   557	    Math.abs(p.pos.y) > 10 && localX > HALF_L - 17
   558	  ) {
   559	    const arr = team.players[team.arriver];
   560	    if (arr !== p && !arr.sentOff) {
   561	      const lane = laneOpenness(p.pos, arr.pos, opp.players);
   562	      const open = opennessOf(arr, opp.players);
   563	      const arrLocalX = team.localX(arr.pos.x);
   564	      const inArc = arrLocalX > HALF_L - 26 && Math.abs(arr.pos.y) < 12;
   565	      let sCB =
   566	        (0.48 + lane * 0.3 + open * 0.28) *
   567	        (inArc ? 1.15 : 0.6) *
   568	        (0.8 + g.attackingWidth * 0.4);
   569	      // The corner routine committed to this ball (Phase 31) — the arc
   570	      // strike IS the plan, the whipped cross is the fallback.
   571	      if (cornerCutback) sCB *= 2.2;
   572	      cutbackMate = arr;
   573	      cutbackCand = {
   574	        action: 'Pass',
   575	        score: sCB,
   576	        why: `cutback to ${arr.name} at the arc · lane ${lane.toFixed(2)} · open ${open.toFixed(2)}`,
   577	      };
   578	      cands.push(cutbackCand);
   579	    }
   580	  }
   581	
   582	  // --- Hold-up (Phase 28): the pivot's back-to-goal game. A striker with
   583	  // the ball, back to goal and a defender on them shields it and waits for
   584	  // support instead of forcing a turn — the lay-off boost in the pass loop
   585	  // is the payoff. Patience isn't free: stagnation drains it.
   586	  // 34.3 (user report "中锋接球之后不转身"): the zone extends into the own
   587	  // half — the target-man outlet shields wherever the long ball finds him.
   588	  // 打卡油角 (Phase 35): killing the game at the corner flag, ANY carrier
   589	  // shields — the pivot's back-to-goal craft, borrowed for the clock.
   590	  const cornerHold =
   591	    team.mentality.holding > 0.5 && localX > HALF_L - 18 && Math.abs(p.pos.y) > 10;
   592	  if (!mustKick && ((p.role === 'ST' && localX > -12 && localX < 32) || cornerHold)) {
   593	    const backToGoal = kickMisalignment(p, norm(sub(goal, p.pos))); // 1 = facing own goal
   594	    if (backToGoal > 0.45 && pressure > 0.2) {
   595	      const sH =
   596	        (0.36 + pressure * 0.3) *
   597	        (0.55 + p.attrs.dribbling * 0.7) *
   598	        (0.5 + backToGoal * 0.5) *
   599	        (1 - stagnation * 0.5) *
   600	        (cornerHold ? 1 + team.mentality.holding * 0.6 : 1);
   601	      cands.push({
   602	        action: 'HoldUp',
   603	        score: sH,
   604	        why: `back to goal · pressure ${pressure.toFixed(2)} · dribbling ${p.attrs.dribbling.toFixed(2)}`,
   605	      });
   606	    }
   607	  }
   608	
   609	  // --- Dribble: needs space ahead; dribbleBias makes it a first choice.
   610	  // Never for a keeper (32.2): a back-pass puts the ball at his FEET and
   611	  // his job is to move it, not to carry it out of the box (the reported
   612	  // 门将带球跑出禁区 class of nonsense is fenced here for good).
   613	  if (!mustKick && p.role !== 'GK') {
   614	    // Wide and advanced (Phase 31): the drive goes DOWN THE LINE toward the
   615	    // byline, not diagonally into the packed box — 下底. Space is measured
   616	    // along the actual path (the touchline channel is usually open when the
   617	    // central cone is a wall), and dribbleTarget steers the same way, so
   618	    // the utility and the legs agree. This is what puts carriers in the
   619	    // pull-back zone at all: measured before it, the byline was occupied
   620	    // for 0.16s per MATCH.
   621	    const wideDrive = Math.abs(p.pos.y) > 13 && localX > 20 && localX < HALF_L - 7;
   622	    const toGoal = wideDrive
   623	      ? norm(sub(v2((HALF_L - 8) * team.attackDir, Math.sign(p.pos.y) * (HALF_W - 12)), p.pos))
   624	      : norm(sub(goal, p.pos));
   625	    const space = spaceAhead(p, toGoal, opp.players);
   626	    let sD = (W.dribbleBase + space * W.dribbleSpaceW) * (W.dribbleGeneBase + g.dribbleBias * W.dribbleGeneW);
   627	    sD *= 1 - pressure * W.dribblePressurePen;
   628	    // The TURN TAX (34.3, user report "球员朝向也挺重要"): driving forward
   629	    // with your back to the play means turning ON the ball — a contested
   630	    // touch when someone is close. Facing forward, or free of pressure,
   631	    // costs nothing; back-to-goal under a marker, the forward drive yields
   632	    // to holding up, escaping, or the first-time ball.
   633	    sD *= 1 - kickMisalignment(p, toGoal) * pressure * 0.3;
   634	    // Drive the OPEN RUN (Phase 31, the reported "大空间不突破就硬要传球"):
   635	    // big space ahead used to lose to forced passes. The boost is a flat
   636	    // multiplier ON TOP of the pressure penalty — an earlier cut also
   637	    // EXEMPTED open-run dribbles from back-pressure, and that possession-
   638	    // longevity freebie inverted the shootBias gene (patient teams simply
   639	    // outlasted everyone into MORE shots; genes.test caught it). Inside
   640	    // 15m the 28.4 breakaway boost takes over: FINISH, don't carry it in.
   641	    if (openRun && dGoal > 15) sD *= 1.35;
   642	    if (team.mode === 'CounterAttack') sD *= 1.25;
   643	    sD *= 1 + stagnation * 0.28; // carrying it forward relieves stagnation (Phase 27)
   644	    cands.push({
   645	      action: 'Dribble',
   646	      score: sD,
   647	      why: `space ${space.toFixed(2)} · dribbleBias ${g.dribbleBias.toFixed(2)}${openRun && dGoal > 15 ? ' · open run — drive' : ''}${stagnation > 0.01 ? ` · stale ${stagnation.toFixed(2)}` : ''}`,
   648	    });
   649	    // 脱压带球 (34.2, user report): pressured with the front door closed,
   650	    // the craft answer is to CARRY it back or sideways and buy an outlet —
   651	    // not to stop dead (the old forward-only dribble died to the pressure
   652	    // penalty here and the carrier froze). Escaping pressure is the point,
   653	    // so the penalty barely applies; basic craft, only half-gated by flair.
   654	    const holdCorner = team.mentality.holding > 0.5;
   655	    const esc = escapeCarry(p, team.attackDir, localX, opp.players, holdCorner);
   656	    if (esc && !openRun) {
   657	      let sE =
   658	        (W.dribbleBase + esc.space * W.dribbleSpaceW) *
   659	        (W.dribbleGeneBase + g.dribbleBias * 0.5 * W.dribbleGeneW);
   660	      sE *= 1 - pressure * 0.1;
   661	      // Killing the game (Phase 35): the carry to the corner outranks the
   662	      // risky ball — possession IS the shot now.
   663	      if (holdCorner && localX > 0) sE *= 1 + team.mentality.holding * 0.4;
   664	      cands.push({
   665	        action: 'Dribble',
   666	        score: sE,
   667	        why: holdCorner && localX > 0
   668	          ? `carrying it to the corner — killing the game · space ${esc.space.toFixed(2)}`
   669	          : `carrying it OUT of the press · escape space ${esc.space.toFixed(2)}`,
   670	      });
   671	    }
   672	  }
   673	
   674	  // --- Keeper distribution from the HANDS (Phase 28.3 → 98, user-ratified
   675	  // "门将出球选择应该和战术有关"): the one-size throw becomes the coach's
   676	  // choice — three genome-scored releases:
   677	  //   · the short roll to feet    — the build-up school (passBias): tempo
   678	  //     from the back, restart the pattern;
   679	  //   · the fast long sling       — the counter launch (counterAttackBias):
   680	  //     forward gain is the whole point, priced up with the gene;
   681	  //   · the PUNT (new)            — closed outlets + no build-up genes: a
   682	  //     long lofted drop the phase-63 aerial channel contests on descent —
   683	  //     STRENGTH picks the target, so the tall outlet man is a buyable
   684	  //     package for punt-first coaches.
   685	  // The 28.3 no-hoof contract stands: every release still has a NAME on it.
   686	  let bestThrowMate: Player | null = null;
   687	  let bestThrow = 0;
   688	  let puntCand: (typeof cands)[number] | null = null;
   689	  let puntMate: Player | null = null;
   690	  if (p.role === 'GK' && p.gkDistributing && p.kickCooldown <= 0) {
   691	    let bestOpenNear = 0; // how playable the short game is right now
   692	    // The counter WINDOW: every opponent still committed in our half at the
   693	    // catch is a man the quick sling beats — the fast break is launched
   694	    // from the keeper's hands or it isn't a fast break at all.
   695	    let committed = 0;
   696	    let oppOutfield = 0;
   697	    for (const o of opp.players) {
   698	      if (o.role === 'GK' || o.sentOff) continue;
   699	      oppOutfield++;
   700	      if (team.localX(o.pos.x) < 0) committed++;
   701	    }
   702	    const transition = oppOutfield > 0 ? committed / oppOutfield : 0;
   703	    for (const mate of team.players) {
   704	      if (mate === p || mate.sentOff) continue;
   705	      const d = dist(p.pos, mate.pos);
   706	      const open = opennessOf(mate, opp.players);
   707	      if (d >= 8 && d <= 16) bestOpenNear = Math.max(bestOpenNear, open);
   708	      if (d < 8 || d > 30) continue;
   709	      const gain = clamp01((team.localX(mate.pos.x) - localX + 30) / 60) * 2 - 1;
   710	      let sT =
   711	        d <= 16
   712	          ? (0.3 + open * 0.5) * (0.6 + g.passBias * 0.8)
   713	          : (0.3 + open * 0.5) *
   714	            (0.5 + g.counterAttackBias * 0.7) *
   715	            (1 + Math.max(gain, 0) * (0.2 + g.counterAttackBias * 0.55)) *
   716	            (1 + transition * g.counterAttackBias * 1.3);
   717	      // LOOK BEFORE YOU THROW (the keeper-release fix): the flat throw/sling
   718	      // is a GROUND ball — a body parked in the lane blocks it and it bounces
   719	      // back into the box (measured: hands releases blocked-lane 9-18% vs the
   720	      // lane-aware goal kick's 4-5%, lane-HITs landing 60-79% in our own
   721	      // defensive third). Every outfield pass already reads laneOpenness
   722	      // (`passBase + lane*passLaneW + …`); the hands distribution never did —
   723	      // it picked by receiver-openness alone. A clear lane is now required,
   724	      // not merely an open receiver. The lofted PUNT below clears heads and
   725	      // keeps its openness-of-landing logic.
   726	      sT *= 0.3 + laneOpenness(p.pos, mate.pos, opp.players) * 0.7;
   727	      if (sT > bestThrow) {
   728	        bestThrow = sT;
   729	        bestThrowMate = mate;
   730	      }
   731	    }
   732	    if (bestThrowMate) {
   733	      cands.push({
   734	        action: 'ThrowOut',
   735	        score: bestThrow,
   736	        why: `thrown to ${bestThrowMate.name} · open ${opennessOf(bestThrowMate, opp.players).toFixed(2)} · ${dist(p.pos, bestThrowMate.pos) <= 16 ? `roll to feet · passBias ${g.passBias.toFixed(2)}` : `counter sling · counterBias ${g.counterAttackBias.toFixed(2)}`}`,
   737	      });
   738	    }
   739	    let bestPuntFit = 0;
   740	    for (const mate of team.players) {
   741	      if (mate === p || mate.sentOff) continue;
   742	      const d = dist(p.pos, mate.pos);
   743	      if (d < 24) continue;
   744	      const fit = clamp01((team.localX(mate.pos.x) - localX) / 60) * 0.6 + mate.attrs.strength * 0.5;
   745	      if (fit > bestPuntFit) {
   746	        bestPuntFit = fit;
   747	        puntMate = mate;
   748	      }
   749	    }
   750	    if (puntMate) {
   751	      const closed = 1 - bestOpenNear;
   752	      const sP =
   753	        (0.2 + closed * 0.55) *
   754	        (1.4 - (g.passBias + g.riskTolerance) * 0.6) *
   755	        (0.7 + bestPuntFit * 0.45);
   756	      puntCand = {
   757	        action: 'LoftedPass',
   758	        score: sP,
   759	        why: `PUNT to ${puntMate.name} · outlets closed ${closed.toFixed(2)} · strength ${puntMate.attrs.strength.toFixed(2)}`,
   760	      };
   761	      cands.push(puntCand);
   762	    }
   763	  }
   764	
   765	  // --- Clear: panic button deep in our half; risk-averse teams use it more.
   766	  // A keeper distributing from the HANDS never panic-hoofs (Phase 28.3) —
   767	  // they had a full second to pick a target.
   768	  if (localX < -18 && p.kickCooldown <= 0 && !(p.role === 'GK' && p.gkDistributing)) {
   769	    let sC = (W.clearBase + pressure * W.clearPressureW) * (1.25 - g.riskTolerance * 0.8);
   770	    // A keeper with the ball at his feet (32.2): the TRADITIONAL keeper
   771	    // hoofs it; the ball-playing one (passBias + riskTolerance) trusts his
   772	    // feet and plays through the press — the same genes that make his
   773	    // teammates use him as the outlet.
   774	    if (p.role === 'GK') sC *= 1.9 - (g.passBias + g.riskTolerance) * 0.55;
   775	    cands.push({ action: 'ClearBall', score: sC, why: `pressure ${pressure.toFixed(2)} · risk-averse ${(1 - g.riskTolerance).toFixed(2)}` });
   776	  }
   777	
   778	  cands.sort((a, b) => b.score - a.score);
   779	  // Degenerate fallback (kick still on cooldown): carry the ball as today.
   780	  if (cands.length === 0) {
   781	    p.action = { type: 'Dribble', scores: [] };
   782	    return;
   783	  }
   784	  const top = cands[0];
   785	  const scores = cands.slice(0, 4);
   786	
   787	  // A restart taker sets themselves before striking (the run-up): face the
   788	  // chosen target so orientation penalties don't gut dead-ball deliveries —
   789	  // corners arrived weak and wild while the taker still faced the flag.
   790	  if (mustKick) {
   791	    const at =
   792	      top === cutbackCand ? cutbackMate!.pos // the corner arc cutback (31)
   793	      : top.action === 'Pass' ? bestMate!.pos
   794	      : top.action === 'LoftedPass' ? bestLoftMate!.pos
   795	      : top.action === 'Cross' ? bestCrossMate!.pos
   796	      : top.action === 'ThroughBall' ? bestRunner!.pos
   797	      : top.action === 'Shoot' ? goal
   798	      : null; // clears/dribbles: face straight upfield
   799	    if (at) {
   800	      const hx = at.x - p.pos.x;
   801	      const hy = at.y - p.pos.y;
   802	      const hl = Math.sqrt(hx * hx + hy * hy);
   803	      if (hl > 1e-6) p.heading = { x: hx / hl, y: hy / hl };
   804	    } else {
   805	      p.heading = { x: team.attackDir, y: 0 };
   806	    }
   807	  }
   808	
   809	  // Kicks resolve instantly; movement actions persist until next tick.
   810	  switch (top.action) {
   811	    case 'Pass':
   812	      if (top === cutbackCand) {
   813	        p.action = { type: 'Pass', targetIdx: cutbackMate!.gid, scores };
   814	        match.performCutback(p, cutbackMate!);
   815	      } else {
   816	        p.action = { type: 'Pass', targetIdx: bestMate!.gid, scores };
   817	        match.performPass(p, bestMate!, offsideExemptKick);
   818	      }
   819	      break;
   820	    case 'LoftedPass': {
   821	      // The keeper's punt (Phase 98) routes to ITS target — the aerial
   822	      // outlet — not the ground game's best switch.
   823	      const loftTo = top === puntCand ? puntMate! : bestLoftMate!;
   824	      p.action = { type: 'LoftedPass', targetIdx: loftTo.gid, scores };
   825	      match.performLoftedPass(p, loftTo, offsideExemptKick);
   826	      break;
   827	    }
   828	    case 'Cross':
   829	      p.action = { type: 'Cross', targetIdx: bestCrossMate!.gid, scores };
   830	      // A routine corner delivers to the KEY ZONE, not to a led body
   831	      // (Phase 31.9): the crasher's burst is timed onto the zone, and a
   832	      // velocity lead on a sprinting man overshot the whole picture by
   833	      // ~9m. The small pull keeps the drop off the keeper's claim radius.
   834	      match.performCross(
   835	        p, bestCrossMate!, offsideExemptKick,
   836	        kickKind === 'corner' ? 0.06 : 0.18,
   837	        kickKind === 'corner' && (kickRoutine === 'nearPost' || kickRoutine === 'farPost')
   838	          ? cornerKeyZone(kickRoutine, team.attackDir, p.pos.y)
   839	          : undefined,
   840	      );
   841	      break;
   842	    case 'ThrowOut':
   843	      p.action = { type: 'ThrowOut', targetIdx: bestThrowMate!.gid, scores };
   844	      match.performKeeperThrow(p, bestThrowMate!);
   845	      break;
   846	    case 'ThroughBall':
   847	      p.action = { type: 'ThroughBall', targetIdx: bestRunner!.gid, scores };
   848	      match.performThroughBall(p, bestRunner!, bestThroughChip, offsideExemptKick);
   849	      break;
   850	    case 'Shoot':
   851	      p.action = { type: 'Shoot', scores };
   852	      // A free-kick strike is a different kick entirely (Phase 32): the
   853	      // placed ball curls OVER the wall on its own flight profile.
   854	      if (kickKind === 'freeKick') match.performFreeKick(p);
   855	      else match.performShot(p);
   856	      break;
   857	    case 'ClearBall':
   858	      p.action = { type: 'ClearBall', scores };
   859	      match.performClear(p);
   860	      break;
   861	    case 'HoldUp':
   862	      p.action = { type: 'HoldUp', scores };
   863	      break;
   864	    default:
   865	      p.action = { type: 'Dribble', scores };
   866	      break;
   867	  }
   868	}
   869	
   870	/* ------------------------------------------------------------------ */
   871	/* Goalkeeper                                                          */
   872	/* ------------------------------------------------------------------ */
   873	
   874	function decideGoalkeeper(p: Player, team: Team, match: Match): void {
   875	  const ball = match.ball;

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/PlayerBrain.ts | sed -n '874,1144p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   874	function decideGoalkeeper(p: Player, team: Team, match: Match): void {
   875	  const ball = match.ball;
   876	  const ownGoal = team.ownGoal();
   877	
   878	  // Shot incoming at our goal -> drop everything and save.
   879	  const shot = match.pendingShot;
   880	  if (
   881	    shot && !shot.resolved && shot.side !== p.side && ball.owner === null &&
   882	    dot(ball.vel, sub(ownGoal, ball.pos)) > 0
   883	  ) {
   884	    p.action = { type: 'GoalkeeperSave', scores: [{ action: 'GoalkeeperSave', score: 1, why: 'shot incoming' }] };
   885	    return;
   886	  }
   887	
   888	  // 门将上前 (Phase 35): licensed for a stoppage-time attacking corner —
   889	  // the goal stands EMPTY behind him; a cleared ball into the counter is
   890	  // the price of the theater. TeamBrain tears the license up within one
   891	  // brain tick of the moment dying and he falls through to positioning,
   892	  // which sprints him home.
   893	  if (team.keeperUp) {
   894	    p.action = {
   895	      type: 'MakeRun',
   896	      scores: [{ action: 'MakeRun', score: 1, why: 'keeper UP for the corner — nothing left to lose' }],
   897	    };
   898	    return;
   899	  }
   900	
   901	  // 1v1 rush (Phase 27.5): an opponent carrier bearing down with nobody
   902	  // goal-side — charge them down and make the goal small. keeperAggression
   903	  // sets how far out the keeper is willing to leave the line.
   904	  // Phase 103 (user design, 门将出击到禁区外) probed BOTH extensions and
   905	  // kept one: charging a CONTROLLED carrier far out is bad football — the
   906	  // rush-anatomy A/B measured the extended charge at GA +1.3-1.8 vs the
   907	  // timid school in both regimes (attackers simply shoot past the
   908	  // advancing keeper: xg/shot faced 0.16→0.20). The carrier charge keeps
   909	  // its classic range; the sweeper's REAL range gain is the loose-ball
   910	  // interception below (through balls are where 出击 pays).
   911	  const carrier = ball.owner;
   912	  if (carrier && carrier.side !== p.side) {
   913	    const aggr = team.genome.keeperAggression;
   914	    const dGoal = dist(carrier.pos, ownGoal);
   915	    if (dGoal < 9 + aggr * 8) {
   916	      let goalside = 0;
   917	      for (const mate of team.players) {
   918	        if (mate === p || mate.sentOff) continue;
   919	        if (dist(mate.pos, ownGoal) < dGoal - 1) goalside++;
   920	      }
   921	      // The RACE READ (Phase 103): charge only when he can MEET the carrier
   922	      // before the shot. Inside the box the old reflex stands (make the
   923	      // goal small); outside it, an unwinnable charge just opens an empty
   924	      // net — probed: an always-charge sweeper conceded 5.13/match vs the
   925	      // timid school's 2.05. The gene prices the accepted margin, the
   926	      // physics decide the race.
   927	      let raceWon = true;
   928	      if (goalside === 0 && !match.inPenaltyBox(carrier.pos, p.side)) {
   929	        const toGoal = norm(sub(ownGoal, carrier.pos));
   930	        const closing = carrier.vel.x * toGoal.x + carrier.vel.y * toGoal.y;
   931	        raceWon =
   932	          closing > 1.2 &&
   933	          timeToPoint(p, carrier.pos) < (dGoal - 11) / closing + (aggr - 0.5) * 0.4;
   934	      }
   935	      if (goalside === 0 && raceWon) {
   936	        p.action = {
   937	          type: 'GoalkeeperRush',
   938	          scores: [{ action: 'GoalkeeperRush', score: 1, why: `1v1 — rushing out · aggr ${aggr.toFixed(2)}` }],
   939	        };
   940	        return;
   941	      }
   942	    }
   943	  }
   944	
   945	  // Loose ball near our goal that we can claim first. The gate is on where
   946	  // the ball is COMING DOWN (Phase 28) — a cross dropping into the box pulls
   947	  // the keeper off the line to meet it even while it's still out wide.
   948	  if (ball.owner === null) {
   949	    const sol = interceptBall(p, ball);
   950	    // The sweeper's interception range (Phase 103): a through ball coming
   951	    // down 20-27m out is the high-line keeper's to eat — feet only out
   952	    // there (the 28.5 giveBall gate). Timid keepers keep the old 15m.
   953	    if (dist(sol.point, ownGoal) < 15 + Math.max(0, team.genome.keeperAggression - 0.5) * 24) {
   954	      // Running min over the same values in the same order — the old
   955	      // filter/map/spread allocated two arrays per GK decision.
   956	      let rivalT = Infinity;
   957	      for (const q of match.allPlayers) {
   958	        if (q === p || q.sentOff) continue;
   959	        const t = timeToPoint(q, sol.point);
   960	        if (t < rivalT) rivalT = t;
   961	      }
   962	      if (sol.tMe < rivalT || (ball.airborne && sol.tMe <= sol.tBall + 0.2)) {
   963	        p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 0.9, why: ball.airborne ? 'attack the dropping ball' : 'claim loose ball in box' }] };
   964	        return;
   965	      }
   966	    }
   967	  }
   968	
   969	  p.action = {
   970	    type: 'GoalkeeperPosition',
   971	    scores: [{ action: 'GoalkeeperPosition', score: 0.6, why: `keeperAggression ${team.genome.keeperAggression.toFixed(2)}` }],
   972	  };
   973	}
   974	
   975	/* ------------------------------------------------------------------ */
   976	/* Off-ball outfielders                                                */
   977	/* ------------------------------------------------------------------ */
   978	
   979	function decideOffBall(p: Player, team: Team, opp: Team, match: Match): void {
   980	  const g = team.genome;
   981	  const W = team.policies[p.index];
   982	  const ball = match.ball;
   983	  const possession = match.possessionSide;
   984	  const cands: UtilityScore[] = [];
   985	  let markTarget: number | undefined;
   986	  let receiveFlag = false;
   987	
   988	  const tired = p.stamina < 0.4 && g.staminaConservation > 0.5;
   989	
   990	  if (possession === team.side) {
   991	    // ----- We have the ball -----
   992	    const pass = match.pendingPass;
   993	    if (pass && pass.side === team.side && pass.targetGid === p.gid) {
   994	      cands.push({ action: 'ReceivePass', score: 1.2, why: 'pass is coming to me' });
   995	      receiveFlag = true;
   996	    }
   997	    // OUR loose ball (36.2): TeamBrain assigned this player to the 50/50
   998	    // (a squirt/miscontrol/knockdown while possession is nominally ours) —
   999	    // go win it back; the race outranks shape and support.
  1000	    if (ball.owner === null && team.chasers.has(p.index)) {
  1001	      cands.push({ action: 'ChaseBall', score: 1.1, why: 'our loose ball — contest it' });
  1002	    }
  1003	    const carrier = ball.owner;
  1004	    // The DF slot is the REST DEFENCE (Phase 31): once the ball crosses
  1005	    // halfway he does not join the siege — formationSpot clamps his spot
  1006	    // deep (≤ −12 local) and he holds it as the +1 cover and the recycling
  1007	    // outlet. Without this the support fan pulled even the last outfielder
  1008	    // to the ball, nobody covered, and every turnover was an uncontested
  1009	    // breakaway — which is how a 5v6 side out-scored its full-strength
  1010	    // self (the besieged team lives on counters).
  1011	    const restDefence = p.index === 1 && team.localX(ball.pos.x) > 0;
  1012	    if (carrier && carrier !== p && !restDefence) {
  1013	      const d = dist(p.pos, carrier.pos);
  1014	      const roleBonus = p.role === 'ST' ? 0.12 : p.role === 'WG' ? 0.1 : p.role === 'MF' ? 0.06 : 0;
  1015	      const modeMul = team.mode === 'Attack' || team.mode === 'CounterAttack' ? 1.2 : team.mode === 'BuildUp' ? 1.0 : 0.6;
  1016	      let s = (W.supportBase + clamp01(1 - d / 30) * W.supportProxW + roleBonus) * modeMul;
  1017	      if (tired) s *= 0.6; // conserve energy: prefer holding shape
  1018	      cands.push({ action: 'SupportBallCarrier', score: s, why: `dist ${d.toFixed(0)}m · mode ${team.mode}` });
  1019	    }
  1020	    // Assigned runner: sprint in behind and drag the line — the movement a
  1021	    // through ball needs. Tired legs sit the run out. During a corner setup
  1022	    // there is no carrier yet — the licensed box-crashers run anyway
  1023	    // (Phase 28: the cross needs bodies attacking the area, not spectators).
  1024	    // The ARRIVER (Phase 31) runs on the same license — executor routes
  1025	    // their run to the edge-of-box arc instead of in behind.
  1026	    const arriving = team.arriver === p.index;
  1027	    // A corner delivery in FLIGHT has no carrier and phase is 'playing' —
  1028	    // without the cornerCrash clause the licensed crashers lost their run
  1029	    // the instant the ball left the taker's boot and walked back to their
  1030	    // formation spots while it was still in the air (Phase 31.9).
  1031	    const crashLive = team.cornerCrash !== null && match.simTime < team.cornerCrash.until;
  1032	    if ((team.runners.has(p.index) || arriving) && (carrier ? carrier !== p : match.phase === 'restart' || crashLive)) {
  1033	      let s = W.runScore;
  1034	      if (tired) s *= 0.6;
  1035	      cands.push({
  1036	        action: 'MakeRun',
  1037	        score: s,
  1038	        why: arriving
  1039	          ? 'arriving late at the cutback arc'
  1040	          : match.phase === 'restart' || crashLive ? 'attacking the box for the delivery' : 'licensed run in behind',
  1041	      });
  1042	    }
  1043	    // 2过1 (Phase 34): just played the wall pass under pressure — burst past
  1044	    // the marker NOW; the return is scored to find this run. The BURST is
  1045	    // short (1.2s) even though the return credit runs 2.3s: a full-window
  1046	    // sprint pulled the passer out of the support structure for so long it
  1047	    // cost goals across the calibrate seeds — dart, then re-join.
  1048	    if (p.wallRun && match.simTime < p.wallRun.until - 1.1 && carrier && carrier !== p) {
  1049	      let s = W.runScore * (1.05 + (g.tempo + g.passBias) * 0.25);
  1050	      if (tired) s *= 0.6;
  1051	      cands.push({ action: 'MakeRun', score: s, why: 'bursting for the one-two return' });
  1052	    }
  1053	    // 套边 (Phase 34): licensed to overlap outside the confronted wide
  1054	    // carrier — width genes commit harder to the run.
  1055	    if (team.overlapper === p.index && carrier && carrier !== p) {
  1056	      let s = W.runScore * (1 + g.attackingWidth * 0.3);
  1057	      if (tired) s *= 0.6;
  1058	      cands.push({ action: 'MakeRun', score: s, why: 'overlapping outside the carrier' });
  1059	    }
  1060	    cands.push({
  1061	      action: 'MoveToFormationSpot',
  1062	      score: W.formationBase + (tired ? 0.2 : 0),
  1063	      why: tired ? 'keeping shape (stamina conservation)' : 'keeping shape',
  1064	    });
  1065	  } else {
  1066	    // ----- They have the ball (or it's loose) -----
  1067	    // Cut out a pass in flight — unless it's sailing overhead (Phase 28);
  1068	    // lofted balls are contested at the landing point via ChaseBall instead.
  1069	    if (ball.owner === null && match.pendingPass && match.pendingPass.side !== team.side && ball.z <= 0.5) {
  1070	      const inter = canInterceptPass(p, ball);
  1071	      if (inter.ok) cands.push({ action: 'InterceptPass', score: W.interceptScore, why: 'can reach the passing lane first' });
  1072	    }
  1073	    // Chase only if the TeamBrain assigned us — this is what stops ball-swarming.
  1074	    if (team.chasers.has(p.index)) {
  1075	      const s = W.chaseBase + g.pressIntensity * 0.15;
  1076	      cands.push({ action: 'ChaseBall', score: s, why: `assigned presser · pressIntensity ${g.pressIntensity.toFixed(2)}` });
  1077	    } else if (possession === -1) {
  1078	      // Loose ball: closest unassigned player may react a little. Radius
  1079	      // tightened in Phase 28 — a wide net pulled extra bodies into every
  1080	      // scramble and open play collapsed into rolling six-player scrums.
  1081	      const d = dist(p.pos, ball.pos);
  1082	      if (d < 8) cands.push({ action: 'ChaseBall', score: 0.4 * (1 - d / 8), why: 'loose ball nearby' });
  1083	    }
  1084	    const mark = team.marks.get(p.index);
  1085	    if (mark !== undefined) {
  1086	      markTarget = mark;
  1087	      cands.push({
  1088	        action: 'MarkOpponent',
  1089	        score: W.markBase + g.markingAggression * 0.15,
  1090	        why: `mark ${opp.players[mark].name} · aggression ${g.markingAggression.toFixed(2)}`,
  1091	      });
  1092	    } else if (ball.owner && ball.owner.side !== team.side && !team.chasers.has(p.index)) {
  1093	      // Contain (Phase 29.1): the carrier bears down on ME and I'm already
  1094	      // goal-side — jockey them (goal-side stance on the carrier) instead of
  1095	      // jogging away to a formation spot. The reported bug: a set defender
  1096	      // suddenly ran upfield as the striker arrived, because his mark
  1097	      // assignment vanished the moment that striker became the carrier
  1098	      // (marks exclude the carrier — the chaser presses the ball, but the
  1099	      // chaser can be someone else entirely).
  1100	      const carrier = ball.owner;
  1101	      const dC = dist(p.pos, carrier.pos);
  1102	      const ownGoal = team.ownGoal();
  1103	      const carrierGoalD = dist(carrier.pos, ownGoal);
  1104	      // Defensive-territory only (< 35m out): containing a deep build-up
  1105	      // carrier 70m from goal would just add one more body to the press.
  1106	      // ONE container only — the closest unassigned goal-side defender;
  1107	      // everyone eligible jockeying at once re-created the pile-up AND
  1108	      // strangled the game to 2.0 goals.
  1109	      let closest = true;
  1110	      if (dC < 8 && carrierGoalD < 35 && dist(p.pos, ownGoal) < carrierGoalD) {
  1111	        for (const q of team.players) {
  1112	          if (q === p || q.role === 'GK' || q.sentOff) continue;
  1113	          if (team.chasers.has(q.index) || team.marks.has(q.index)) continue;
  1114	          if (dist(q.pos, ownGoal) >= carrierGoalD) continue; // not goal-side
  1115	          if (dist(q.pos, carrier.pos) < dC) {
  1116	            closest = false;
  1117	            break;
  1118	          }
  1119	        }
  1120	        if (closest) {
  1121	          markTarget = carrier.index;
  1122	          cands.push({
  1123	            action: 'MarkOpponent',
  1124	            score: 0.66 + clamp01(1 - dC / 10) * 0.18,
  1125	            why: `contain ${carrier.name} — hold goal-side`,
  1126	          });
  1127	        }
  1128	      }
  1129	    }
  1130	    cands.push({
  1131	      action: 'MoveToFormationSpot',
  1132	      score: 0.42 + g.defensiveCompactness * 0.08,
  1133	      why: `hold block · compactness ${g.defensiveCompactness.toFixed(2)}`,
  1134	    });
  1135	  }
  1136	
  1137	  cands.sort((a, b) => b.score - a.score);
  1138	  const top = cands[0];
  1139	  p.action = {
  1140	    type: top.action,
  1141	    targetIdx: top.action === 'MarkOpponent' ? markTarget : receiveFlag ? p.gid : undefined,
  1142	    scores: cands.slice(0, 4),
  1143	  };
  1144	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/PlayerBrain.ts | sed -n '1,430p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { clamp, clamp01 } from '../utils/math';
     2	import { dist, dot, norm, sub, v2 } from '../utils/vec';
     3	import { HALF_L, HALF_W } from '../sim/constants';
     4	import {
     5	  cornerKeyZone, defenderLineLocalX, offsideLineLocalX, runBurstPoint, shapeReady,
     6	} from './formations';
     7	import type { Match } from '../sim/Match';
     8	import type { Player } from '../sim/Player';
     9	import type { Team } from '../sim/Team';
    10	import type { UtilityScore } from '../sim/types';
    11	import { aerialSense, kickMisalignment } from '../sim/mechanics';
    12	import {
    13	  airLaneOpenness, canInterceptPass, effectiveBlockers, interceptBall, laneOpenness, opennessOf,
    14	  escapeCarry, pressureAt, spaceAhead, timeToPoint,
    15	} from './perception';
    16	
    17	/**
    18	 * PlayerBrain — utility AI. Each decision tick the player scores a set of
    19	 * candidate actions; the best one wins. Every score is a product/sum of
    20	 * normalized factors with the gene multipliers spelled out, and the top
    21	 * candidates are stored on the action for the debug panel.
    22	 *
    23	 * Kicks (Pass/Shoot/Clear) execute immediately at decision time; movement
    24	 * actions are executed continuously by actionExecutor until the next tick.
    25	 */
    26	export function decidePlayer(p: Player, match: Match): void {
    27	  const team = match.teams[p.side];
    28	  const opp = match.teams[1 - p.side];
    29	
    30	  // Dead-ball restart: the taker walks to the spot (chasing the stationary
    31	  // ball); everyone else runs their normal logic against the dead ball —
    32	  // defenders reshape and mark, attackers hold width around the spot.
    33	  if (match.phase === 'restart' && match.restart) {
    34	    if (p.gid === match.restart.takerGid) {
    35	      p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 1, why: 'taking the restart' }] };
    36	      return;
    37	    }
    38	  } else if (match.phase !== 'playing') {
    39	    p.action = { type: 'MoveToFormationSpot', scores: [] };
    40	    return;
    41	  }
    42	
    43	  if (match.ball.owner === p) {
    44	    decideCarrier(p, team, opp, match);
    45	    return;
    46	  }
    47	  // The carry continues (Phase 36): between discrete touches the ball is
    48	  // free but it is HIS — he chases his own push instead of falling into
    49	  // off-ball logic (which would send him to a spot while the ball rolls).
    50	  if (
    51	    match.ball.owner === null &&
    52	    match.dribbleTouch !== null &&
    53	    match.dribbleTouch.gid === p.gid &&
    54	    match.simTime < match.dribbleTouch.until
    55	  ) {
    56	    p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 1, why: 'chasing my own touch' }] };
    57	    return;
    58	  }
    59	  if (p.role === 'GK') {
    60	    decideGoalkeeper(p, team, match);
    61	    return;
    62	  }
    63	  decideOffBall(p, team, opp, match);
    64	}
    65	
    66	/* ------------------------------------------------------------------ */
    67	/* Ball carrier                                                        */
    68	/* ------------------------------------------------------------------ */
    69	
    70	function decideCarrier(p: Player, team: Team, opp: Team, match: Match): void {
    71	  const g = team.genome;
    72	  const W = team.policies[p.index]; // utility weights — DEFAULT_POLICY unless a wildcard carries learned ones
    73	  const ball = match.ball;
    74	  // Restart first touch must be a kick (kick-in/corner/goal kick/free kick)
    75	  // — dribbling straight off the spot would break the dead-ball fiction.
    76	  const mustKick = match.restartKickGid === p.gid;
    77	  const kickKind = mustKick ? match.restartKickKind : null;
    78	  const kickRoutine = mustKick ? match.restartKickRoutine : null;
    79	  if (mustKick) {
    80	    match.restartKickGid = null;
    81	    match.restartKickKind = null;
    82	    match.restartKickRoutine = null;
    83	    // Goal-channel telemetry (Phase 113): stamp the SET-PIECE first touch —
    84	    // a goal within the window banks as `setpiece`. Kick-ins and goal kicks
    85	    // are restarts but not set pieces.
    86	    if (kickKind === 'corner' || kickKind === 'freeKick' || kickKind === 'penalty') {
    87	      match.lastRestartKick = { kind: kickKind, side: p.side, t: match.simTime };
    88	    }
    89	  }
    90	  // A penalty's first touch IS the shot — no utility scoring from the spot.
    91	  if (kickKind === 'penalty') {
    92	    p.action = { type: 'Shoot', scores: [{ action: 'Shoot', score: 1, why: 'penalty kick' }] };
    93	    match.performShot(p);
    94	    return;
    95	  }
    96	  // Keeper hold (Phase 27.2): ball in the hands — no distribution decision
    97	  // until the hold runs out.
    98	  if (p.gkHoldTimer > 0) {
    99	    p.action = { type: 'HoldPosition', scores: [{ action: 'HoldPosition', score: 1, why: 'ball in hands' }] };
   100	    return;
   101	  }
   102	  // The keeper WAITS for shape (Phase 30.3): a held ball is released to SET
   103	  // receivers. Until the outfielders settle near their attacking spots, the
   104	  // hold re-arms in small quanta — every hands protection (untackleable,
   105	  // clearance bubble, nobody presses) keys off gkHoldTimer and keeps
   106	  // applying. Budget-capped so a scattered team can't stall the match.
   107	  if (p.role === 'GK' && p.gkDistributing && p.gkShapeWait < 4 && !shapeReady(team, match.ball)) {
   108	    p.gkHoldTimer = 0.25;
   109	    p.gkShapeWait += 0.25;
   110	    p.action = { type: 'HoldPosition', scores: [{ action: 'HoldPosition', score: 1, why: 'waiting for shape' }] };
   111	    return;
   112	  }
   113	  // Kickoff first touch (Phase 27.3): played BACKWARD to a teammate — no
   114	  // driving forward off the spot, no long ball over the top. Everyone else
   115	  // starts behind the ball at kickoff, so the fallback is nearly unreachable.
   116	  if (match.kickoffKickGid === p.gid) {
   117	    match.kickoffKickGid = null;
   118	    let back: Player | null = null;
   119	    let backScore = -Infinity;
   120	    for (const mate of team.players) {
   121	      if (mate === p || mate.sentOff) continue;
   122	      if (team.localX(mate.pos.x) > -0.5) continue; // must be behind the ball
   123	      const d = dist(p.pos, mate.pos);
   124	      // Open, and comfortably ~12m back — not the keeper 40m away.
   125	      const s = opennessOf(mate, opp.players) - Math.abs(d - 12) * 0.02 - (mate.role === 'GK' ? 0.3 : 0);
   126	      if (s > backScore) {
   127	        backScore = s;
   128	        back = mate;
   129	      }
   130	    }
   131	    if (back) {
   132	      const hx = back.pos.x - p.pos.x;
   133	      const hy = back.pos.y - p.pos.y;
   134	      const hl = Math.sqrt(hx * hx + hy * hy);
   135	      if (hl > 1e-6) p.heading = { x: hx / hl, y: hy / hl };
   136	      p.action = {
   137	        type: 'Pass',
   138	        targetIdx: back.gid,
   139	        scores: [{ action: 'Pass', score: 1, why: 'kickoff — played back' }],
   140	      };
   141	      match.performPass(p, back);
   142	      return;
   143	    }
   144	  }
   145	  const cands: UtilityScore[] = [];
   146	  const pressure = pressureAt(p.pos, opp.players);
   147	  const goal = team.oppGoal();
   148	  const dGoal = dist(p.pos, goal);
   149	  const localX = team.localX(p.pos.x);
   150	  // Offside awareness (Phase 29): real-law dead-ball exemptions, and the
   151	  // line every delivery below checks its target against. Players avoid
   152	  // teammates stood CLEARLY offside (beyond the 1.2m margin) but back their
   153	  // judgment on tight ones — the referee judges at +0.2m, so the marginal
   154	  // band is exactly where real flags come from (a runner who broke on the
   155	  // previous kick and hasn't checked back level yet).
   156	  // DELIBERATE law deviation (Phase 71, user call "门将开大脚应该有越位"):
   157	  // real goal kicks are offside-exempt, but at this match scale the
   158	  // exemption read as a legal cherry-pick — a striker camped at the
   159	  // opponent's goal, fed by the timeout punt (probed: 19% of goal kicks
   160	  // had a man within 12m of goal). Goal kicks now play under normal
   161	  // offside, same family as the offside→goal-kick restart simplification.
   162	  // Kick-ins keep the real throw-in exemption; corners are geometrically
   163	  // exempt anyway (you cannot be offside level with the goal line ball).
   164	  const offsideExemptKick = kickKind === 'kickIn' || kickKind === 'corner';
   165	  const offLine = offsideLineLocalX(team, opp.players, localX) + 2.2;
   166	  // Territory pressure (Phase 27): 0 while the move is fresh or gaining
   167	  // ground, 1 after ~8s of possession going nowhere. It tilts every carrier
   168	  // choice toward the opponent goal — sideways recycling stops being free.
   169	  const stagnation = clamp01((team.staleTime - 3) / 5);
   170	
   171	  // An OPEN RUN (Phase 31, user report "单刀回传"): nobody goal-side within
   172	  // striking territory. Shared state for the whole carrier economy — the
   173	  // finish boost inside 17m (28.4), the drive boost outside it, and the
   174	  // back-pass suppression all key off it. Computed once.
   175	  let openRun = false;
   176	  if (dGoal < 28) {
   177	    openRun = true;
   178	    for (const o of opp.players) {
   179	      if (o.role === 'GK' || o.sentOff) continue;
   180	      if (dist(o.pos, goal) < dGoal - 1) {
   181	        openRun = false;
   182	        break;
   183	      }
   184	    }
   185	  }
   186	
   187	  // --- Shoot: worth it when the chance quality (xG) is decent; shootBias
   188	  // scales it from "only tap-ins" (0) to "shoot on sight" (1).
   189	  if (dGoal < 30 && p.kickCooldown <= 0) {
   190	    const q = match.shotQuality(p);
   191	    // NOTE: finishing deliberately does NOT raise shot utility — it pays off
   192	    // in execution (tighter spread in mechanics.performShot), not in shot
   193	    // selection. Coupling it to utility made finishers take worse shots and
   194	    // turned the attribute into a net negative.
   195	    let s = q * (W.shootBase + g.shootBias * W.shootGene);
   196	    if (team.mode === 'Attack' || team.mode === 'CounterAttack') s *= W.shootModeMul;
   197	    s *= 1 - pressure * W.shootPressurePen;
   198	    // Facing away from goal (Phase 27): turn first instead of snap-shooting
   199	    // blind. Restart takers are exempt — they set themselves before kicking.
   200	    if (!mustKick) s *= 1 - kickMisalignment(p, norm(sub(goal, p.pos))) * 0.3;
   201	    // 1v1 (Phase 28.4): nobody between you and the keeper — FINISH. The
   202	    // old economy kept Dribble marginally ahead, so breakaways were walked
   203	    // all the way onto the keeper's toes instead of being struck from 10m.
   204	    const breakaway = openRun && dGoal < 17;
   205	    if (breakaway) s *= 1.6;
   206	    // Long-range appetite (Phase 28): when the sight is clear, have a dig
   207	    // from 16–30m instead of recycling forever — a stale move digs sooner.
   208	    let dig = 0;
   209	    if (dGoal > 16) {
   210	      // Pressure gate eased 0.7 → 0.5 (29.1): a containing jockey 2.6m off
   211	      // shouldn't extinguish the dig — shooting over the delay IS the
   212	      // counter to being contained (and the user wants the 20m strike).
   213	      dig =
   214	        W.longShotW *
   215	        (0.3 + g.shootBias * 0.7) *
   216	        (1 - pressure * 0.5) *
   217	        (0.55 + stagnation * 0.45) *
   218	        clamp01((30 - dGoal) / 14);
   219	      s += dig;
   220	    }
   221	    // Lane-aware selection (Phase 31): shotQuality's distance·angle·pressure
   222	    // cannot see the parked bodies on the path — carriers shot into walls,
   223	    // and since 30.4 those flew harmlessly (not even a deflection). Each
   224	    // corridor body discounts the whole appetite (dig included — the 20m
   225	    // dig into a wall is exactly the doomed shot); the carrier works for an
   226	    // angle instead, and tryShotBlock makes daring it anyway a real cost.
   227	    // shootBias loosens the discount — daring traffic IS what the gene
   228	    // means (a flat 0.62 inverted it: the shoot-happy team lost its whole
   229	    // expression channel and out-shot NOBODY).
   230	    // Phase 60 (the UNSET WALL): the appetite sees READINESS-weighted
   231	    // bodies — a mid-collapse retreater discounts far less than a set,
   232	    // facing wall, so the first-time arc strike gets dared while the
   233	    // block is still arriving. Math.pow takes the fractional count fine.
   234	    const blockers = breakaway ? 0 : effectiveBlockers(p.pos, goal, opp.players);
   235	    if (blockers > 0) s *= Math.pow(0.55 + g.shootBias * 0.15, blockers);
   236	    cands.push({
   237	      action: 'Shoot',
   238	      score: s,
   239	      why: `xG ${q.toFixed(2)} · shootBias ${g.shootBias.toFixed(2)}${breakaway ? ' · 1v1 — finish it' : ''}${dig > 0.03 ? ` · long-range dig ${dig.toFixed(2)}` : ''}${blockers > 0 ? ` · ${blockers.toFixed(1)} ready in the lane` : ''}`,
   240	    });
   241	  }
   242	
   243	  // --- Direct free kick (Phase 32): the danger-band placed ball is the
   244	  // specialist's REAL strike — performFreeKick curls it over the wall, so
   245	  // lane blockers don't apply and the ordinary shot economics (pressure,
   246	  // misalignment) don't either. Competes with crossing/passing the FK.
   247	  if (kickKind === 'freeKick' && localX > 0 && dGoal > 9 && dGoal < 28) {
   248	    // Steep in range: the wall pulls two defenders out of the marking
   249	    // scheme, so an FK always HAS an open mate — and real takers still
   250	    // shoot from 17-22m. The pass only outscores from the band's edge.
   251	    const sFK =
   252	      (0.55 + (28 - dGoal) * 0.02) *
   253	      (0.7 + (p.attrs.finishing + p.attrs.dribbling * 0.5) * 0.45) *
   254	      (0.85 + g.shootBias * 0.3);
   255	    cands.push({ action: 'Shoot', score: sFK, why: `direct free kick · ${dGoal.toFixed(0)}m out` });
   256	  }
   257	
   258	  // --- Pass: score every teammate, keep the best. Long targets also get a
   259	  // LOFTED variant (Phase 28): the switch flies over the press, so it skips
   260	  // the ground lane and the 32m suppression — its risks are the charge-down
   261	  // at the kicker's feet and the scatter/first touch at the far end.
   262	  let bestMate: Player | null = null;
   263	  let bestPass = 0;
   264	  let bestLane = 0;
   265	  let bestOpen = 0;
   266	  let bestLoftMate: Player | null = null;
   267	  let bestLoft = 0;
   268	  let bestLoftOpen = 0;
   269	  // One aerial-lane read per decision — the pass loop and the through-ball
   270	  // loop used to each run the same scan with the same arguments.
   271	  const airLane = p.kickCooldown <= 0 ? airLaneOpenness(p.pos, opp.players) : 0;
   272	  if (p.kickCooldown <= 0) {
   273	    const lp = match.lastCompletedPass;
   274	    const layingOff = p.action.type === 'HoldUp'; // pivot lay-off (Phase 28)
   275	    for (const mate of team.players) {
   276	      if (mate === p || mate.sentOff) continue;
   277	      // The playmaker (Phase 39) reads passing lanes 15% more open than
   278	      // they look — the trait is vision, priced into lane weight only.
   279	      const lane = Math.min(
   280	        1,
   281	        laneOpenness(p.pos, mate.pos, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),
   282	      );
   283	      const open = opennessOf(mate, opp.players);
   284	      const d = dist(p.pos, mate.pos);
   285	      // Forward progress of the pass, normalized to ±1 over 30m.
   286	      const gain = clamp01((team.localX(mate.pos.x) - localX + 30) / 60) * 2 - 1;
   287	
   288	      // Shared style/tilt multipliers (identical for ground and lofted).
   289	      let mul = 1;
   290	      if (gain > 0.05) mul *= 1 + gain * stagnation * 0.35;
   291	      else mul *= 1 - stagnation * 0.3;
   292	      if (team.mode === 'CounterAttack' && gain > 0) mul *= 1.3;
   293	      if (team.mode === 'BuildUp' && gain < 0) mul *= 1.1; // patient recycling is fine
   294	      mul *= 0.7 + g.passBias * 0.75;
   295	      mul *= 0.85 + g.tempo * 0.3;
   296	      if (mate.role === 'GK') {
   297	        // The keeper as a build-up OUTLET (Phase 32.2, 出球门将): a
   298	        // traditional side treats the back-pass as a last resort; a
   299	        // ball-playing side (passBias + riskTolerance) uses him to escape
   300	        // the press — the modern relief valve, priced by the same genes
   301	        // that make the keeper himself play instead of hoof.
   302	        const ballPlay = (g.passBias + g.riskTolerance) / 2;
   303	        mul *= (0.25 + ballPlay * 0.55) * (0.7 + pressure * 1.1);
   304	      }
   305	      // Turning back on an OPEN RUN is the last resort (Phase 31 — the
   306	      // reported "单刀回传"): with nobody goal-side, the chaser at your back
   307	      // reads as pressure and the outlet multiplier used to make the
   308	      // trailing back-pass BEAT driving on. Squaring it forward is fine.
   309	      if (openRun && gain < 0) mul *= 0.35;
   310	      // A mate stood offside is a dead target (Phase 29) — near-suppressed,
   311	      // not zero: the rare desperate ball into them is where flags come from.
   312	      if (!offsideExemptKick && team.localX(mate.pos.x) > offLine + 0.2) mul *= 0.08;
   313	      // Playing the ball where the body doesn't face costs accuracy (Phase 27)
   314	      // — prefer passes we're facing; technique loosens the constraint. Kept
   315	      // mild: the time-gated stagnation tilt is the forward driver, this is
   316	      // only the body-mechanics tiebreak. Restart takers are exempt.
   317	      if (!mustKick) mul *= 1 - kickMisalignment(p, norm(sub(mate.pos, p.pos))) * 0.12 * (1 - p.attrs.passing * 0.5);
   318	      // A pivot lays off short after holding up (Phase 28).
   319	      if (layingOff && d < 12) mul *= 1.3;
   320	
   321	      let s = W.passBase + lane * W.passLaneW + open * W.passOpenW;
   322	      if (gain > 0) s *= 1 + gain * (W.passFwdBase + g.riskTolerance * W.passFwdRisk);
   323	      else s *= 1 + gain * W.passBackPen; // mild penalty for going backward
   324	      // Contested forward balls are gated by riskTolerance — but patience
   325	      // runs out: a stale move plays the risky forward ball anyway.
   326	      // (30.5 tried gating blocked SIDEWAYS balls too — it starved the
   327	      // feed out to the held-width winger and neutral-genome populations
   328	      // stopped scoring; the fan's wide outlet needs that half-blocked ball.)
   329	      if (gain > 0.15 && lane < 0.4) {
   330	        const gate = 0.35 + g.riskTolerance * 0.65;
   331	        s *= gate + (1 - gate) * stagnation * 0.4;
   332	      }
   333	      s *= mul;
   334	      if (d > 32) s *= 0.5;
   335	      if (d < 5) s *= 0.75;
   336	      // 2过1 return (Phase 34): the original passer is BURSTING — the return
   337	      // into his stride is the whole point of the wall pass, so it flips the
   338	      // "don't hand it straight back" rule below into a bonus (forward only).
   339	      const wallReturn =
   340	        mate.wallRun !== null &&
   341	        match.simTime < mate.wallRun.until &&
   342	        mate.wallRun.partnerGid === p.gid &&
   343	        gain > 0.2; // the runner must genuinely be IN BEHIND, not alongside
   344	      if (wallReturn) {
   345	        s *= 1.15 + (g.tempo + g.passBias) * 0.25;
   346	      } else if (lp && lp.passerGid === mate.gid && lp.receiverGid === p.gid && match.simTime - lp.t < 2.5 && gain < 0.1) {
   347	        // Don't just hand it straight back to the passer unless it progresses.
   348	        s *= 0.55;
   349	      }
   350	      // Third man (Phase 34): freshly received with a runner ahead — the
   351	      // quick bounce releases HIM, not the man who fed you (that's a 2过1).
   352	      if (
   353	        lp && lp.receiverGid === p.gid && match.simTime - lp.t < 1.5 &&
   354	        lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > 0.15
   355	      ) {
   356	        s *= 1 + g.passBias * 0.3 * W.thirdManW;
   357	      }
   358	      // 套边 release (Phase 34): the ball down the line into the overlap —
   359	      // but only once the run has COME AROUND (wide, level or beyond).
   360	      // Bonusing the licensed man wherever he stood released the ball
   361	      // instantly to a runner still 3m BEHIND (probed: median reception
   362	      // |y| 9.6 — a central recycle wearing the overlap's name).
   363	      if (
   364	        team.overlapper === mate.index &&
   365	        Math.abs(mate.pos.y) > 9 &&
   366	        team.localX(mate.pos.x) > localX - 6
   367	      ) {
   368	        // A DEVELOPED overlap is the best ball on the pitch — priced like it
   369	        // (the run happens ~1.6s/match, probed; a timid bonus never cashed it).
   370	        s *= 1.3 + g.attackingWidth * 0.6;
   371	      }
   372	
   373	      if (s > bestPass) {
   374	        bestPass = s;
   375	        bestMate = mate;
   376	        bestLane = lane;
   377	        bestOpen = open;
   378	      }
   379	
   380	      // Lofted switch: only worth the hang time for genuinely long balls
   381	      // into space; long passing is a skill (technique gates execution AND
   382	      // selection — poor passers don't trust the diagonal). Keep it 24m+
   383	      // (30.5 tried 18m: the loft cannibalized healthy ground passes and
   384	      // through balls in the 18–24m band and goals sank with them).
   385	      if (d > 24 && !layingOff) {
   386	        let sL = (W.loftBase + open * W.loftOpenW) * airLane;
   387	        if (gain > 0) sL *= 1 + gain * (W.passFwdBase + g.riskTolerance * W.passFwdRisk) * 0.8;
   388	        else sL *= 1 + gain * W.passBackPen;
   389	        sL *= mul;
   390	        sL *= 0.55 + p.attrs.passing * 0.75;
   391	        if (sL > bestLoft) {
   392	          bestLoft = sL;
   393	          bestLoftMate = mate;
   394	          bestLoftOpen = open;
   395	        }
   396	      }
   397	    }
   398	    if (pressure > 0.5) bestPass *= W.passOutletMul; // pass is the pressure outlet
   399	    // From the HANDS, the ground pass is a SCHOOL choice (Phase 98): the
   400	    // build-up keeper plays it constantly, the punt-first keeper barely
   401	    // trusts his feet. Outfield passing is untouched.
   402	    if (p.role === 'GK' && p.gkDistributing) bestPass *= 0.6 + g.passBias * 0.8;
   403	    // The why string is built once for the winner — building it per improved
   404	    // candidate inside the loop was pure string churn (toFixed × 3 each time).
   405	    if (bestMate) {
   406	      cands.push({
   407	        action: 'Pass',
   408	        score: bestPass,
   409	        why: `to ${bestMate.name} · lane ${bestLane.toFixed(2)} · open ${bestOpen.toFixed(2)} · passBias ${g.passBias.toFixed(2)}${stagnation > 0.01 ? ` · stale ${stagnation.toFixed(2)}` : ''}`,
   410	      });
   411	    }
   412	    if (bestLoftMate) {
   413	      cands.push({
   414	        action: 'LoftedPass',
   415	        score: bestLoft,
   416	        why: `switch to ${bestLoftMate.name} · open ${bestLoftOpen.toFixed(2)} · air lane ${airLane.toFixed(2)} · passing ${p.attrs.passing.toFixed(2)}`,
   417	      });
   418	    }
   419	  }
   420	
   421	  // --- Through ball: feed an assigned runner IN THEIR PATH, not to feet.
   422	  // Scored by the lane to the projected point and how far beyond the last
   423	  // defender it lands; riskTolerance gates it (direct sides live on these).
   424	  let bestRunner: Player | null = null;
   425	  let bestThrough = 0;
   426	  let bestBehind = 0;
   427	  let bestThroughLane = 0;
   428	  let bestThroughChip = false;
   429	  if (p.kickCooldown <= 0) {
   430	    const line = defenderLineLocalX(team, opp.players);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/PlayerBrain.ts | sed -n '610,790p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   610	  // Never for a keeper (32.2): a back-pass puts the ball at his FEET and
   611	  // his job is to move it, not to carry it out of the box (the reported
   612	  // 门将带球跑出禁区 class of nonsense is fenced here for good).
   613	  if (!mustKick && p.role !== 'GK') {
   614	    // Wide and advanced (Phase 31): the drive goes DOWN THE LINE toward the
   615	    // byline, not diagonally into the packed box — 下底. Space is measured
   616	    // along the actual path (the touchline channel is usually open when the
   617	    // central cone is a wall), and dribbleTarget steers the same way, so
   618	    // the utility and the legs agree. This is what puts carriers in the
   619	    // pull-back zone at all: measured before it, the byline was occupied
   620	    // for 0.16s per MATCH.
   621	    const wideDrive = Math.abs(p.pos.y) > 13 && localX > 20 && localX < HALF_L - 7;
   622	    const toGoal = wideDrive
   623	      ? norm(sub(v2((HALF_L - 8) * team.attackDir, Math.sign(p.pos.y) * (HALF_W - 12)), p.pos))
   624	      : norm(sub(goal, p.pos));
   625	    const space = spaceAhead(p, toGoal, opp.players);
   626	    let sD = (W.dribbleBase + space * W.dribbleSpaceW) * (W.dribbleGeneBase + g.dribbleBias * W.dribbleGeneW);
   627	    sD *= 1 - pressure * W.dribblePressurePen;
   628	    // The TURN TAX (34.3, user report "球员朝向也挺重要"): driving forward
   629	    // with your back to the play means turning ON the ball — a contested
   630	    // touch when someone is close. Facing forward, or free of pressure,
   631	    // costs nothing; back-to-goal under a marker, the forward drive yields
   632	    // to holding up, escaping, or the first-time ball.
   633	    sD *= 1 - kickMisalignment(p, toGoal) * pressure * 0.3;
   634	    // Drive the OPEN RUN (Phase 31, the reported "大空间不突破就硬要传球"):
   635	    // big space ahead used to lose to forced passes. The boost is a flat
   636	    // multiplier ON TOP of the pressure penalty — an earlier cut also
   637	    // EXEMPTED open-run dribbles from back-pressure, and that possession-
   638	    // longevity freebie inverted the shootBias gene (patient teams simply
   639	    // outlasted everyone into MORE shots; genes.test caught it). Inside
   640	    // 15m the 28.4 breakaway boost takes over: FINISH, don't carry it in.
   641	    if (openRun && dGoal > 15) sD *= 1.35;
   642	    if (team.mode === 'CounterAttack') sD *= 1.25;
   643	    sD *= 1 + stagnation * 0.28; // carrying it forward relieves stagnation (Phase 27)
   644	    cands.push({
   645	      action: 'Dribble',
   646	      score: sD,
   647	      why: `space ${space.toFixed(2)} · dribbleBias ${g.dribbleBias.toFixed(2)}${openRun && dGoal > 15 ? ' · open run — drive' : ''}${stagnation > 0.01 ? ` · stale ${stagnation.toFixed(2)}` : ''}`,
   648	    });
   649	    // 脱压带球 (34.2, user report): pressured with the front door closed,
   650	    // the craft answer is to CARRY it back or sideways and buy an outlet —
   651	    // not to stop dead (the old forward-only dribble died to the pressure
   652	    // penalty here and the carrier froze). Escaping pressure is the point,
   653	    // so the penalty barely applies; basic craft, only half-gated by flair.
   654	    const holdCorner = team.mentality.holding > 0.5;
   655	    const esc = escapeCarry(p, team.attackDir, localX, opp.players, holdCorner);
   656	    if (esc && !openRun) {
   657	      let sE =
   658	        (W.dribbleBase + esc.space * W.dribbleSpaceW) *
   659	        (W.dribbleGeneBase + g.dribbleBias * 0.5 * W.dribbleGeneW);
   660	      sE *= 1 - pressure * 0.1;
   661	      // Killing the game (Phase 35): the carry to the corner outranks the
   662	      // risky ball — possession IS the shot now.
   663	      if (holdCorner && localX > 0) sE *= 1 + team.mentality.holding * 0.4;
   664	      cands.push({
   665	        action: 'Dribble',
   666	        score: sE,
   667	        why: holdCorner && localX > 0
   668	          ? `carrying it to the corner — killing the game · space ${esc.space.toFixed(2)}`
   669	          : `carrying it OUT of the press · escape space ${esc.space.toFixed(2)}`,
   670	      });
   671	    }
   672	  }
   673	
   674	  // --- Keeper distribution from the HANDS (Phase 28.3 → 98, user-ratified
   675	  // "门将出球选择应该和战术有关"): the one-size throw becomes the coach's
   676	  // choice — three genome-scored releases:
   677	  //   · the short roll to feet    — the build-up school (passBias): tempo
   678	  //     from the back, restart the pattern;
   679	  //   · the fast long sling       — the counter launch (counterAttackBias):
   680	  //     forward gain is the whole point, priced up with the gene;
   681	  //   · the PUNT (new)            — closed outlets + no build-up genes: a
   682	  //     long lofted drop the phase-63 aerial channel contests on descent —
   683	  //     STRENGTH picks the target, so the tall outlet man is a buyable
   684	  //     package for punt-first coaches.
   685	  // The 28.3 no-hoof contract stands: every release still has a NAME on it.
   686	  let bestThrowMate: Player | null = null;
   687	  let bestThrow = 0;
   688	  let puntCand: (typeof cands)[number] | null = null;
   689	  let puntMate: Player | null = null;
   690	  if (p.role === 'GK' && p.gkDistributing && p.kickCooldown <= 0) {
   691	    let bestOpenNear = 0; // how playable the short game is right now
   692	    // The counter WINDOW: every opponent still committed in our half at the
   693	    // catch is a man the quick sling beats — the fast break is launched
   694	    // from the keeper's hands or it isn't a fast break at all.
   695	    let committed = 0;
   696	    let oppOutfield = 0;
   697	    for (const o of opp.players) {
   698	      if (o.role === 'GK' || o.sentOff) continue;
   699	      oppOutfield++;
   700	      if (team.localX(o.pos.x) < 0) committed++;
   701	    }
   702	    const transition = oppOutfield > 0 ? committed / oppOutfield : 0;
   703	    for (const mate of team.players) {
   704	      if (mate === p || mate.sentOff) continue;
   705	      const d = dist(p.pos, mate.pos);
   706	      const open = opennessOf(mate, opp.players);
   707	      if (d >= 8 && d <= 16) bestOpenNear = Math.max(bestOpenNear, open);
   708	      if (d < 8 || d > 30) continue;
   709	      const gain = clamp01((team.localX(mate.pos.x) - localX + 30) / 60) * 2 - 1;
   710	      let sT =
   711	        d <= 16
   712	          ? (0.3 + open * 0.5) * (0.6 + g.passBias * 0.8)
   713	          : (0.3 + open * 0.5) *
   714	            (0.5 + g.counterAttackBias * 0.7) *
   715	            (1 + Math.max(gain, 0) * (0.2 + g.counterAttackBias * 0.55)) *
   716	            (1 + transition * g.counterAttackBias * 1.3);
   717	      // LOOK BEFORE YOU THROW (the keeper-release fix): the flat throw/sling
   718	      // is a GROUND ball — a body parked in the lane blocks it and it bounces
   719	      // back into the box (measured: hands releases blocked-lane 9-18% vs the
   720	      // lane-aware goal kick's 4-5%, lane-HITs landing 60-79% in our own
   721	      // defensive third). Every outfield pass already reads laneOpenness
   722	      // (`passBase + lane*passLaneW + …`); the hands distribution never did —
   723	      // it picked by receiver-openness alone. A clear lane is now required,
   724	      // not merely an open receiver. The lofted PUNT below clears heads and
   725	      // keeps its openness-of-landing logic.
   726	      sT *= 0.3 + laneOpenness(p.pos, mate.pos, opp.players) * 0.7;
   727	      if (sT > bestThrow) {
   728	        bestThrow = sT;
   729	        bestThrowMate = mate;
   730	      }
   731	    }
   732	    if (bestThrowMate) {
   733	      cands.push({
   734	        action: 'ThrowOut',
   735	        score: bestThrow,
   736	        why: `thrown to ${bestThrowMate.name} · open ${opennessOf(bestThrowMate, opp.players).toFixed(2)} · ${dist(p.pos, bestThrowMate.pos) <= 16 ? `roll to feet · passBias ${g.passBias.toFixed(2)}` : `counter sling · counterBias ${g.counterAttackBias.toFixed(2)}`}`,
   737	      });
   738	    }
   739	    let bestPuntFit = 0;
   740	    for (const mate of team.players) {
   741	      if (mate === p || mate.sentOff) continue;
   742	      const d = dist(p.pos, mate.pos);
   743	      if (d < 24) continue;
   744	      const fit = clamp01((team.localX(mate.pos.x) - localX) / 60) * 0.6 + mate.attrs.strength * 0.5;
   745	      if (fit > bestPuntFit) {
   746	        bestPuntFit = fit;
   747	        puntMate = mate;
   748	      }
   749	    }
   750	    if (puntMate) {
   751	      const closed = 1 - bestOpenNear;
   752	      const sP =
   753	        (0.2 + closed * 0.55) *
   754	        (1.4 - (g.passBias + g.riskTolerance) * 0.6) *
   755	        (0.7 + bestPuntFit * 0.45);
   756	      puntCand = {
   757	        action: 'LoftedPass',
   758	        score: sP,
   759	        why: `PUNT to ${puntMate.name} · outlets closed ${closed.toFixed(2)} · strength ${puntMate.attrs.strength.toFixed(2)}`,
   760	      };
   761	      cands.push(puntCand);
   762	    }
   763	  }
   764	
   765	  // --- Clear: panic button deep in our half; risk-averse teams use it more.
   766	  // A keeper distributing from the HANDS never panic-hoofs (Phase 28.3) —
   767	  // they had a full second to pick a target.
   768	  if (localX < -18 && p.kickCooldown <= 0 && !(p.role === 'GK' && p.gkDistributing)) {
   769	    let sC = (W.clearBase + pressure * W.clearPressureW) * (1.25 - g.riskTolerance * 0.8);
   770	    // A keeper with the ball at his feet (32.2): the TRADITIONAL keeper
   771	    // hoofs it; the ball-playing one (passBias + riskTolerance) trusts his
   772	    // feet and plays through the press — the same genes that make his
   773	    // teammates use him as the outlet.
   774	    if (p.role === 'GK') sC *= 1.9 - (g.passBias + g.riskTolerance) * 0.55;
   775	    cands.push({ action: 'ClearBall', score: sC, why: `pressure ${pressure.toFixed(2)} · risk-averse ${(1 - g.riskTolerance).toFixed(2)}` });
   776	  }
   777	
   778	  cands.sort((a, b) => b.score - a.score);
   779	  // Degenerate fallback (kick still on cooldown): carry the ball as today.
   780	  if (cands.length === 0) {
   781	    p.action = { type: 'Dribble', scores: [] };
   782	    return;
   783	  }
   784	  const top = cands[0];
   785	  const scores = cands.slice(0, 4);
   786	
   787	  // A restart taker sets themselves before striking (the run-up): face the
   788	  // chosen target so orientation penalties don't gut dead-ball deliveries —
   789	  // corners arrived weak and wild while the taker still faced the flag.
   790	  if (mustKick) {

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/PlayerBrain.ts | sed -n '430,620p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   430	    const line = defenderLineLocalX(team, opp.players);
   431	    // Third man (Phase 34): p JUST received — the bounce to a runner within a
   432	    // beat is the possession game's release. Modulated by passBias.
   433	    const lpT = match.lastCompletedPass;
   434	    const fresh = lpT !== null && lpT.receiverGid === p.gid && match.simTime - lpT.t < 1.5;
   435	    for (const mate of team.players) {
   436	      if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;
   437	      const bounceMul = fresh && lpT!.passerGid !== mate.gid ? 1 + g.passBias * 0.35 * W.thirdManW : 1;
   438	      const flight = dist(p.pos, mate.pos) / 18;
   439	      // Meet the run, not the hover (Phase 29): a runner held onside shows
   440	      // ~zero velocity, so the aim point projects the burst they will make.
   441	      const burst = runBurstPoint(mate, team, opp.players, flight);
   442	      const point = {
   443	        x: clamp(burst.x, -HALF_L + 2, HALF_L - 2),
   444	        y: clamp(burst.y, -HALF_W + 2, HALF_W - 2),
   445	      };
   446	      if (team.localX(point.x) < localX + 5) continue; // must genuinely penetrate
   447	      const lane = laneOpenness(p.pos, point, opp.players);
   448	      const behind = clamp01((team.localX(point.x) - line) / 10);
   449	      let gates = (0.45 + g.riskTolerance * 0.85) * (0.85 + g.tempo * 0.3) * (1 + stagnation * 0.2);
   450	      // A runner ALREADY beyond the offside line is flagged the moment this
   451	      // ball is struck (Phase 29) — wait for them to check their run instead.
   452	      // The held run (executor clamp) makes the legal version of this ball.
   453	      if (!offsideExemptKick && team.localX(mate.pos.x) > offLine + 0.2) gates *= 0.1;
   454	      // The behind term alone used to float a fully-walled ball over the
   455	      // selection bar (Phase 30.5): 82% of through balls went into blocked
   456	      // lanes at 36% completion (probe-pass). Openness now gates the score
   457	      // multiplicatively — open balls unchanged, walls discount hard.
   458	      const s =
   459	        (W.throughBase + lane * W.throughOpenW + behind * W.throughBehindW) *
   460	        gates * (0.4 + 0.6 * clamp01(lane / 0.45)) * bounceMul;
   461	      if (s > bestThrough) {
   462	        bestThrough = s;
   463	        bestRunner = mate;
   464	        bestThroughLane = lane;
   465	        bestBehind = behind;
   466	        bestThroughChip = false;
   467	      }
   468	      // Chip over the top (Phase 28): when bodies block the ground lane but
   469	      // the runner is going in behind, go over them instead — slower to
   470	      // arrive and harder to bring down (technique gates the trust in it).
   471	      // Judged at the LANDING (Phase 30.5): airLane only sees the kicker's
   472	      // surroundings, so packed drop zones looked wide open — the chip's
   473	      // real risk is who stands where the ball comes down.
   474	      if (lane < 0.45) {
   475	        const landOpen = 1 - pressureAt(point, opp.players);
   476	        const sC =
   477	          (W.throughBase + landOpen * W.throughOpenW * 0.8 + behind * W.throughBehindW) *
   478	          gates * 0.9 * (0.55 + p.attrs.passing * 0.7) *
   479	          (0.7 + airLane * 0.3) * (0.4 + 0.6 * clamp01(landOpen / 0.45)) * bounceMul;
   480	        if (sC > bestThrough) {
   481	          bestThrough = sC;
   482	          bestRunner = mate;
   483	          bestThroughLane = landOpen;
   484	          bestBehind = behind;
   485	          bestThroughChip = true;
   486	        }
   487	      }
   488	    }
   489	    if (bestRunner) {
   490	      cands.push({
   491	        action: 'ThroughBall',
   492	        score: bestThrough,
   493	        why: `${bestThroughChip ? 'chipped over the top ' : ''}into ${bestRunner.name}'s run · lane ${bestThroughLane.toFixed(2)} · behind ${bestBehind.toFixed(2)} · risk ${g.riskTolerance.toFixed(2)}`,
   494	      });
   495	    }
   496	  }
   497	
   498	  // --- Cross (Phase 28): from wide and advanced (or the corner flag), whip
   499	  // it at the best aerial target attacking the box. Wide-overload football
   500	  // lives here: attackingWidth is the style gene that trusts the delivery.
   501	  let bestCrossMate: Player | null = null;
   502	  let bestCrossT = 0;
   503	  const isCorner = kickKind === 'corner';
   504	  if (p.kickCooldown <= 0 && (isCorner || (Math.abs(p.pos.y) > 10 && localX > 10))) {
   505	    for (const mate of team.players) {
   506	      if (mate === p || mate.sentOff || mate.role === 'GK') continue;
   507	      const mLocalX = team.localX(mate.pos.x);
   508	      if (mLocalX < 16 || Math.abs(mate.pos.y) > 13) continue; // must attack the box channel
   509	      let t =
   510	        aerialSense(mate) * 0.6 +
   511	        opennessOf(mate, opp.players) * 0.4 +
   512	        clamp01((mLocalX - 18) / 20) * 0.25;
   513	      // Corner routine (Phase 31): a post routine aims the delivery at the
   514	      // crasher attacking the KEY zone — the separation run the 29.1
   515	      // momentum lever needed but never got a delivery for.
   516	      if (isCorner && (kickRoutine === 'nearPost' || kickRoutine === 'farPost')) {
   517	        t += clamp01(1 - dist(mate.pos, cornerKeyZone(kickRoutine, team.attackDir, p.pos.y)) / 10) * 0.6;
   518	      }
   519	      // Open-play crosses are judged like any pass (Phase 29) — an offside
   520	      // box target wastes the delivery. Corners are exempt (real law).
   521	      if (!offsideExemptKick && mLocalX > offLine + 0.2) t *= 0.12;
   522	      if (t > bestCrossT) {
   523	        bestCrossT = t;
   524	        bestCrossMate = mate;
   525	      }
   526	    }
   527	    if (bestCrossMate) {
   528	      let sX = W.crossBase + bestCrossT * W.crossBoxW;
   529	      sX *= 0.75 + g.attackingWidth * 0.5;
   530	      sX *= 0.7 + g.passBias * 0.4;
   531	      if (p.role === 'WG') sX *= 1.25; // it's what wingers are FOR (28.3)
   532	      if (team.mode === 'Attack' || team.mode === 'CounterAttack') sX *= 1.15;
   533	      // The corner IS a cross — deliver it. Unless the routine says the
   534	      // ball goes SHORT or to the ARC (Phase 31): then the whip is the
   535	      // fallback, not the plan.
   536	      if (isCorner) sX *= kickRoutine === 'short' || kickRoutine === 'arcCutback' ? 0.7 : 2.4;
   537	      if (!mustKick) sX *= 1 - kickMisalignment(p, norm(sub(bestCrossMate.pos, p.pos))) * 0.12 * (1 - p.attrs.passing * 0.5);
   538	      cands.push({
   539	        action: 'Cross',
   540	        score: sX,
   541	        why: `${isCorner ? 'corner — ' : ''}to ${bestCrossMate.name} in the box · target ${bestCrossT.toFixed(2)} · width ${g.attackingWidth.toFixed(2)}`,
   542	      });
   543	    }
   544	  }
   545	
   546	  // --- Cutback (Phase 31): from the byline zone, the hard pull-back to the
   547	  // arc — real football's canonical set-defence beater. The regular pass
   548	  // loop can never pick it (gain < 0 reads as a back-pass and gets
   549	  // penalized), so it scores as its own candidate aimed at the licensed
   550	  // ARRIVER, whose late run the executor routes to the arc. The receiver's
   551	  // snap-decision window (giveBall) makes the first-time strike.
   552	  let cutbackMate: Player | null = null;
   553	  let cutbackCand: UtilityScore | null = null;
   554	  const cornerCutback = kickKind === 'corner' && kickRoutine === 'arcCutback';
   555	  if (
   556	    p.kickCooldown <= 0 && (!mustKick || cornerCutback) && team.arriver !== null &&
   557	    Math.abs(p.pos.y) > 10 && localX > HALF_L - 17
   558	  ) {
   559	    const arr = team.players[team.arriver];
   560	    if (arr !== p && !arr.sentOff) {
   561	      const lane = laneOpenness(p.pos, arr.pos, opp.players);
   562	      const open = opennessOf(arr, opp.players);
   563	      const arrLocalX = team.localX(arr.pos.x);
   564	      const inArc = arrLocalX > HALF_L - 26 && Math.abs(arr.pos.y) < 12;
   565	      let sCB =
   566	        (0.48 + lane * 0.3 + open * 0.28) *
   567	        (inArc ? 1.15 : 0.6) *
   568	        (0.8 + g.attackingWidth * 0.4);
   569	      // The corner routine committed to this ball (Phase 31) — the arc
   570	      // strike IS the plan, the whipped cross is the fallback.
   571	      if (cornerCutback) sCB *= 2.2;
   572	      cutbackMate = arr;
   573	      cutbackCand = {
   574	        action: 'Pass',
   575	        score: sCB,
   576	        why: `cutback to ${arr.name} at the arc · lane ${lane.toFixed(2)} · open ${open.toFixed(2)}`,
   577	      };
   578	      cands.push(cutbackCand);
   579	    }
   580	  }
   581	
   582	  // --- Hold-up (Phase 28): the pivot's back-to-goal game. A striker with
   583	  // the ball, back to goal and a defender on them shields it and waits for
   584	  // support instead of forcing a turn — the lay-off boost in the pass loop
   585	  // is the payoff. Patience isn't free: stagnation drains it.
   586	  // 34.3 (user report "中锋接球之后不转身"): the zone extends into the own
   587	  // half — the target-man outlet shields wherever the long ball finds him.
   588	  // 打卡油角 (Phase 35): killing the game at the corner flag, ANY carrier
   589	  // shields — the pivot's back-to-goal craft, borrowed for the clock.
   590	  const cornerHold =
   591	    team.mentality.holding > 0.5 && localX > HALF_L - 18 && Math.abs(p.pos.y) > 10;
   592	  if (!mustKick && ((p.role === 'ST' && localX > -12 && localX < 32) || cornerHold)) {
   593	    const backToGoal = kickMisalignment(p, norm(sub(goal, p.pos))); // 1 = facing own goal
   594	    if (backToGoal > 0.45 && pressure > 0.2) {
   595	      const sH =
   596	        (0.36 + pressure * 0.3) *
   597	        (0.55 + p.attrs.dribbling * 0.7) *
   598	        (0.5 + backToGoal * 0.5) *
   599	        (1 - stagnation * 0.5) *
   600	        (cornerHold ? 1 + team.mentality.holding * 0.6 : 1);
   601	      cands.push({
   602	        action: 'HoldUp',
   603	        score: sH,
   604	        why: `back to goal · pressure ${pressure.toFixed(2)} · dribbling ${p.attrs.dribbling.toFixed(2)}`,
   605	      });
   606	    }
   607	  }
   608	
   609	  // --- Dribble: needs space ahead; dribbleBias makes it a first choice.
   610	  // Never for a keeper (32.2): a back-pass puts the ball at his FEET and
   611	  // his job is to move it, not to carry it out of the box (the reported
   612	  // 门将带球跑出禁区 class of nonsense is fenced here for good).
   613	  if (!mustKick && p.role !== 'GK') {
   614	    // Wide and advanced (Phase 31): the drive goes DOWN THE LINE toward the
   615	    // byline, not diagonally into the packed box — 下底. Space is measured
   616	    // along the actual path (the touchline channel is usually open when the
   617	    // central cone is a wall), and dribbleTarget steers the same way, so
   618	    // the utility and the legs agree. This is what puts carriers in the
   619	    // pull-back zone at all: measured before it, the byline was occupied
   620	    // for 0.16s per MATCH.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/PlayerBrain.ts | sed -n '250,440p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   250	    // shoot from 17-22m. The pass only outscores from the band's edge.
   251	    const sFK =
   252	      (0.55 + (28 - dGoal) * 0.02) *
   253	      (0.7 + (p.attrs.finishing + p.attrs.dribbling * 0.5) * 0.45) *
   254	      (0.85 + g.shootBias * 0.3);
   255	    cands.push({ action: 'Shoot', score: sFK, why: `direct free kick · ${dGoal.toFixed(0)}m out` });
   256	  }
   257	
   258	  // --- Pass: score every teammate, keep the best. Long targets also get a
   259	  // LOFTED variant (Phase 28): the switch flies over the press, so it skips
   260	  // the ground lane and the 32m suppression — its risks are the charge-down
   261	  // at the kicker's feet and the scatter/first touch at the far end.
   262	  let bestMate: Player | null = null;
   263	  let bestPass = 0;
   264	  let bestLane = 0;
   265	  let bestOpen = 0;
   266	  let bestLoftMate: Player | null = null;
   267	  let bestLoft = 0;
   268	  let bestLoftOpen = 0;
   269	  // One aerial-lane read per decision — the pass loop and the through-ball
   270	  // loop used to each run the same scan with the same arguments.
   271	  const airLane = p.kickCooldown <= 0 ? airLaneOpenness(p.pos, opp.players) : 0;
   272	  if (p.kickCooldown <= 0) {
   273	    const lp = match.lastCompletedPass;
   274	    const layingOff = p.action.type === 'HoldUp'; // pivot lay-off (Phase 28)
   275	    for (const mate of team.players) {
   276	      if (mate === p || mate.sentOff) continue;
   277	      // The playmaker (Phase 39) reads passing lanes 15% more open than
   278	      // they look — the trait is vision, priced into lane weight only.
   279	      const lane = Math.min(
   280	        1,
   281	        laneOpenness(p.pos, mate.pos, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),
   282	      );
   283	      const open = opennessOf(mate, opp.players);
   284	      const d = dist(p.pos, mate.pos);
   285	      // Forward progress of the pass, normalized to ±1 over 30m.
   286	      const gain = clamp01((team.localX(mate.pos.x) - localX + 30) / 60) * 2 - 1;
   287	
   288	      // Shared style/tilt multipliers (identical for ground and lofted).
   289	      let mul = 1;
   290	      if (gain > 0.05) mul *= 1 + gain * stagnation * 0.35;
   291	      else mul *= 1 - stagnation * 0.3;
   292	      if (team.mode === 'CounterAttack' && gain > 0) mul *= 1.3;
   293	      if (team.mode === 'BuildUp' && gain < 0) mul *= 1.1; // patient recycling is fine
   294	      mul *= 0.7 + g.passBias * 0.75;
   295	      mul *= 0.85 + g.tempo * 0.3;
   296	      if (mate.role === 'GK') {
   297	        // The keeper as a build-up OUTLET (Phase 32.2, 出球门将): a
   298	        // traditional side treats the back-pass as a last resort; a
   299	        // ball-playing side (passBias + riskTolerance) uses him to escape
   300	        // the press — the modern relief valve, priced by the same genes
   301	        // that make the keeper himself play instead of hoof.
   302	        const ballPlay = (g.passBias + g.riskTolerance) / 2;
   303	        mul *= (0.25 + ballPlay * 0.55) * (0.7 + pressure * 1.1);
   304	      }
   305	      // Turning back on an OPEN RUN is the last resort (Phase 31 — the
   306	      // reported "单刀回传"): with nobody goal-side, the chaser at your back
   307	      // reads as pressure and the outlet multiplier used to make the
   308	      // trailing back-pass BEAT driving on. Squaring it forward is fine.
   309	      if (openRun && gain < 0) mul *= 0.35;
   310	      // A mate stood offside is a dead target (Phase 29) — near-suppressed,
   311	      // not zero: the rare desperate ball into them is where flags come from.
   312	      if (!offsideExemptKick && team.localX(mate.pos.x) > offLine + 0.2) mul *= 0.08;
   313	      // Playing the ball where the body doesn't face costs accuracy (Phase 27)
   314	      // — prefer passes we're facing; technique loosens the constraint. Kept
   315	      // mild: the time-gated stagnation tilt is the forward driver, this is
   316	      // only the body-mechanics tiebreak. Restart takers are exempt.
   317	      if (!mustKick) mul *= 1 - kickMisalignment(p, norm(sub(mate.pos, p.pos))) * 0.12 * (1 - p.attrs.passing * 0.5);
   318	      // A pivot lays off short after holding up (Phase 28).
   319	      if (layingOff && d < 12) mul *= 1.3;
   320	
   321	      let s = W.passBase + lane * W.passLaneW + open * W.passOpenW;
   322	      if (gain > 0) s *= 1 + gain * (W.passFwdBase + g.riskTolerance * W.passFwdRisk);
   323	      else s *= 1 + gain * W.passBackPen; // mild penalty for going backward
   324	      // Contested forward balls are gated by riskTolerance — but patience
   325	      // runs out: a stale move plays the risky forward ball anyway.
   326	      // (30.5 tried gating blocked SIDEWAYS balls too — it starved the
   327	      // feed out to the held-width winger and neutral-genome populations
   328	      // stopped scoring; the fan's wide outlet needs that half-blocked ball.)
   329	      if (gain > 0.15 && lane < 0.4) {
   330	        const gate = 0.35 + g.riskTolerance * 0.65;
   331	        s *= gate + (1 - gate) * stagnation * 0.4;
   332	      }
   333	      s *= mul;
   334	      if (d > 32) s *= 0.5;
   335	      if (d < 5) s *= 0.75;
   336	      // 2过1 return (Phase 34): the original passer is BURSTING — the return
   337	      // into his stride is the whole point of the wall pass, so it flips the
   338	      // "don't hand it straight back" rule below into a bonus (forward only).
   339	      const wallReturn =
   340	        mate.wallRun !== null &&
   341	        match.simTime < mate.wallRun.until &&
   342	        mate.wallRun.partnerGid === p.gid &&
   343	        gain > 0.2; // the runner must genuinely be IN BEHIND, not alongside
   344	      if (wallReturn) {
   345	        s *= 1.15 + (g.tempo + g.passBias) * 0.25;
   346	      } else if (lp && lp.passerGid === mate.gid && lp.receiverGid === p.gid && match.simTime - lp.t < 2.5 && gain < 0.1) {
   347	        // Don't just hand it straight back to the passer unless it progresses.
   348	        s *= 0.55;
   349	      }
   350	      // Third man (Phase 34): freshly received with a runner ahead — the
   351	      // quick bounce releases HIM, not the man who fed you (that's a 2过1).
   352	      if (
   353	        lp && lp.receiverGid === p.gid && match.simTime - lp.t < 1.5 &&
   354	        lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > 0.15
   355	      ) {
   356	        s *= 1 + g.passBias * 0.3 * W.thirdManW;
   357	      }
   358	      // 套边 release (Phase 34): the ball down the line into the overlap —
   359	      // but only once the run has COME AROUND (wide, level or beyond).
   360	      // Bonusing the licensed man wherever he stood released the ball
   361	      // instantly to a runner still 3m BEHIND (probed: median reception
   362	      // |y| 9.6 — a central recycle wearing the overlap's name).
   363	      if (
   364	        team.overlapper === mate.index &&
   365	        Math.abs(mate.pos.y) > 9 &&
   366	        team.localX(mate.pos.x) > localX - 6
   367	      ) {
   368	        // A DEVELOPED overlap is the best ball on the pitch — priced like it
   369	        // (the run happens ~1.6s/match, probed; a timid bonus never cashed it).
   370	        s *= 1.3 + g.attackingWidth * 0.6;
   371	      }
   372	
   373	      if (s > bestPass) {
   374	        bestPass = s;
   375	        bestMate = mate;
   376	        bestLane = lane;
   377	        bestOpen = open;
   378	      }
   379	
   380	      // Lofted switch: only worth the hang time for genuinely long balls
   381	      // into space; long passing is a skill (technique gates execution AND
   382	      // selection — poor passers don't trust the diagonal). Keep it 24m+
   383	      // (30.5 tried 18m: the loft cannibalized healthy ground passes and
   384	      // through balls in the 18–24m band and goals sank with them).
   385	      if (d > 24 && !layingOff) {
   386	        let sL = (W.loftBase + open * W.loftOpenW) * airLane;
   387	        if (gain > 0) sL *= 1 + gain * (W.passFwdBase + g.riskTolerance * W.passFwdRisk) * 0.8;
   388	        else sL *= 1 + gain * W.passBackPen;
   389	        sL *= mul;
   390	        sL *= 0.55 + p.attrs.passing * 0.75;
   391	        if (sL > bestLoft) {
   392	          bestLoft = sL;
   393	          bestLoftMate = mate;
   394	          bestLoftOpen = open;
   395	        }
   396	      }
   397	    }
   398	    if (pressure > 0.5) bestPass *= W.passOutletMul; // pass is the pressure outlet
   399	    // From the HANDS, the ground pass is a SCHOOL choice (Phase 98): the
   400	    // build-up keeper plays it constantly, the punt-first keeper barely
   401	    // trusts his feet. Outfield passing is untouched.
   402	    if (p.role === 'GK' && p.gkDistributing) bestPass *= 0.6 + g.passBias * 0.8;
   403	    // The why string is built once for the winner — building it per improved
   404	    // candidate inside the loop was pure string churn (toFixed × 3 each time).
   405	    if (bestMate) {
   406	      cands.push({
   407	        action: 'Pass',
   408	        score: bestPass,
   409	        why: `to ${bestMate.name} · lane ${bestLane.toFixed(2)} · open ${bestOpen.toFixed(2)} · passBias ${g.passBias.toFixed(2)}${stagnation > 0.01 ? ` · stale ${stagnation.toFixed(2)}` : ''}`,
   410	      });
   411	    }
   412	    if (bestLoftMate) {
   413	      cands.push({
   414	        action: 'LoftedPass',
   415	        score: bestLoft,
   416	        why: `switch to ${bestLoftMate.name} · open ${bestLoftOpen.toFixed(2)} · air lane ${airLane.toFixed(2)} · passing ${p.attrs.passing.toFixed(2)}`,
   417	      });
   418	    }
   419	  }
   420	
   421	  // --- Through ball: feed an assigned runner IN THEIR PATH, not to feet.
   422	  // Scored by the lane to the projected point and how far beyond the last
   423	  // defender it lands; riskTolerance gates it (direct sides live on these).
   424	  let bestRunner: Player | null = null;
   425	  let bestThrough = 0;
   426	  let bestBehind = 0;
   427	  let bestThroughLane = 0;
   428	  let bestThroughChip = false;
   429	  if (p.kickCooldown <= 0) {
   430	    const line = defenderLineLocalX(team, opp.players);
   431	    // Third man (Phase 34): p JUST received — the bounce to a runner within a
   432	    // beat is the possession game's release. Modulated by passBias.
   433	    const lpT = match.lastCompletedPass;
   434	    const fresh = lpT !== null && lpT.receiverGid === p.gid && match.simTime - lpT.t < 1.5;
   435	    for (const mate of team.players) {
   436	      if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;
   437	      const bounceMul = fresh && lpT!.passerGid !== mate.gid ? 1 + g.passBias * 0.35 * W.thirdManW : 1;
   438	      const flight = dist(p.pos, mate.pos) / 18;
   439	      // Meet the run, not the hover (Phase 29): a runner held onside shows
   440	      // ~zero velocity, so the aim point projects the burst they will make.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/evolution/playerGenome.ts | sed -n '90,231p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
    90	}
    91	
    92	export interface SquadMutateOptions {
    93	  /** Probability each attribute of each player mutates. */
    94	  rate?: number;
    95	  /** Std-dev of gaussian noise. */
    96	  scale?: number;
    97	}
    98	
    99	export function mutateSquad(squad: PlayerAttributes[], rng: Rng, opts: SquadMutateOptions = {}): PlayerAttributes[] {
   100	  const rate = opts.rate ?? 0.35;
   101	  const scale = opts.scale ?? 0.1;
   102	  return squad.map((p) => {
   103	    const out = { ...p };
   104	    for (const k of ATTR_KEYS) {
   105	      if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
   106	    }
   107	    return out;
   108	  });
   109	}
   110	
   111	/**
   112	 * Position-wise crossover: for each squad slot the child inherits that slot's
   113	 * player from parent A, parent B, or a blend — like signing a mixed starting
   114	 * five from both academies.
   115	 */
   116	export function crossoverSquads(a: PlayerAttributes[], b: PlayerAttributes[], rng: Rng): PlayerAttributes[] {
   117	  return a.map((pa, i) => {
   118	    const pb = b[i];
   119	    const r = rng.next();
   120	    if (r < 0.4) return { ...pa };
   121	    if (r < 0.8) return { ...pb };
   122	    const mix = {} as PlayerAttributes;
   123	    for (const k of ATTR_KEYS) mix[k] = (pa[k] + pb[k]) / 2;
   124	    return mix;
   125	  });
   126	}
   127	
   128	/**
   129	 * The RESOURCE BUDGET (Phase 48 — the emergence keystone): a hard cap on a
   130	 * squad's total attribute points. Without it evolution maxes EVERY attribute
   131	 * ("good at everything" wins) and archetypes stay faint; with it, raising
   132	 * one attribute COSTS another and specialisation is forced. SQUAD-level on
   133	 * purpose: star-plus-role-players vs a balanced six is itself an evolvable
   134	 * axis. Phase 61 (the bench): the budget covers the whole 9-man ROSTER —
   135	 * 40.5 = 9 players × 9 attrs × 0.5 (Phase 119j raised it 36→40.5 with the
   136	 * positioning attr, keeping the tuned 0.5 density so the existing physics
   137	 * still centres on 0.5 and positioning is a real trade-off, not free). That
   138	 * makes rotation a REAL trade-off: a deep bench is funded by shaving the
   139	 * starting six, a star XI leaves its bench (and its fresh legs) thin.
   140	 * Founding rosters roll ~0.4 density, so there is headroom before the cap bites.
   141	 *
   142	 * Phase-120 (POSITION-AWARE budget — 门将底座和外场不一样): the budget now
   143	 * charges each slot only for the attributes that actually FIRE for its
   144	 * position. `reflexes` is keeper-only (the 8 outfielders never read it), and
   145	 * symmetrically `finishing` + `defending` are DEAD for the keeper (a GK never
   146	 * shoots, and its 1v1s/claims resolve on reflexes, not tackles) — so the
   147	 * keeper's budget base is its OWN: reflexes + distribution + physique +
   148	 * positioning, not the outfield scoring/tackling stats. The cap dropped
   149	 * 40.5 → 35.5 IN LOCKSTEP (was 81 attr-slots × 0.5; now 8 outfield-reflexes +
   150	 * GK-finishing + GK-defending = 10 dead slots are free → 71 counted × 0.5 =
   151	 * 35.5) so USEFUL-attr density stays the tuned 0.5 and physics is unmoved.
   152	 * The point is not more quality — it closes the "dump" (evolution could park
   153	 * points in a dead stat to dodge the cap); now every point trades against a
   154	 * LIVE attribute, sharpening specialisation.
   155	 */
   156	export const SQUAD_BUDGET = 35.5;
   157	
   158	/**
   159	 * Which attributes cost budget for a slot (Phase-120 position-aware). The
   160	 * keeper (index 0 by invariant — Team.goalkeeper === players[0], ROSTER_ROLES
   161	 * [0] === 'GK', retirees replaced like-for-like at the same slot) pays for
   162	 * everything EXCEPT finishing/defending (dead for a GK); every outfielder pays
   163	 * for everything EXCEPT reflexes (keeper-only). The uncounted attrs still
   164	 * exist and still get scaled by enforceBudget — they just ride along free, so
   165	 * the counted total lands exactly on the cap.
   166	 */
   167	export function countsForBudget(k: AttrKey, isGK: boolean): boolean {
   168	  if (isGK) return k !== 'finishing' && k !== 'defending';
   169	  return k !== 'reflexes';
   170	}
   171	
   172	export function squadTotal(squad: PlayerAttributes[]): number {
   173	  let t = 0;
   174	  for (let i = 0; i < squad.length; i++) {
   175	    const p = squad[i];
   176	    const isGK = i === 0;
   177	    for (const k of ATTR_KEYS) if (countsForBudget(k, isGK)) t += p[k];
   178	  }
   179	  return t;
   180	}
   181	
   182	/** Proportional rescale onto the cap — pure, order-free, unbiased (evolution
   183	 * chooses where the shave lands by choosing where the points sit). */
   184	export function enforceBudget(squad: PlayerAttributes[]): PlayerAttributes[] {
   185	  const total = squadTotal(squad);
   186	  if (total <= SQUAD_BUDGET) return squad;
   187	  const mul = SQUAD_BUDGET / total;
   188	  return squad.map((p) => {
   189	    const out = {} as PlayerAttributes;
   190	    for (const k of ATTR_KEYS) out[k] = p[k] * mul;
   191	    return out;
   192	  });
   193	}
   194	
   195	/**
   196	 * Academy heredity (Phase 48): a retiring player's successor is grown in the
   197	 * club's image — the retiree's attribute profile, mutated. This retires
   198	 * ROLE_BIAS from the newgen path (the bias survives only at FOUNDING, where
   199	 * selection has nothing to work with yet): what a club's left winger IS is
   200	 * now bloodline, discovered by evolution, not set by us. The age curve
   201	 * regrows a 17-year-old's inherited profile from there.
   202	 *
   203	 * School-linked variation (Phase 94): the academy grows what the coach's
   204	 * philosophy NEEDS. The jockey school's problem was DISCOVERY, not payoff —
   205	 * containment only pays as a defending+jockeyBias PACKAGE, a two-locus
   206	 * valley that drift rarely crosses in a 16-club population (phases 88/92).
   207	 * So the newgen intake drifts along the philosophy axis: a containment
   208	 * coach (jockeyBias>0.5) pulls the heir toward defending, a dive-in coach
   209	 * pulls toward pace — a zero-sum transfer on one axis (max ±0.12, one
   210	 * mutation σ), on top of unbiased bloodline noise. Fitness stays pure
   211	 * results and founders stay random: this biases VARIATION, not selection.
   212	 */
   213	export function newgenFromBloodline(
   214	  retiree: PlayerAttributes, rng: Rng, coachJockeyBias = 0.5,
   215	): PlayerAttributes {
   216	  const out = {} as PlayerAttributes;
   217	  for (const k of ATTR_KEYS) out[k] = clamp01(retiree[k] + rng.gaussian() * 0.12);
   218	  const pull = (coachJockeyBias - 0.5) * 0.24;
   219	  out.defending = clamp01(out.defending + pull);
   220	  out.pace = clamp01(out.pace - pull);
   221	  return out;
   222	}
   223	
   224	/** Squad-average of each attribute — shown on team cards. */
   225	export function squadSummary(squad: PlayerAttributes[]): PlayerAttributes {
   226	  const sum = {} as PlayerAttributes;
   227	  for (const k of ATTR_KEYS) sum[k] = 0;
   228	  for (const p of squad) for (const k of ATTR_KEYS) sum[k] += p[k];
   229	  for (const k of ATTR_KEYS) sum[k] /= Math.max(squad.length, 1);
   230	  return sum;
   231	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/formations.ts | sed -n '1,238p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { clamp } from '../utils/math';
     2	import { v2, type V2 } from '../utils/vec';
     3	import { BOX_DEPTH, CORNER_CLEARANCE, GOAL_WIDTH, HALF_L, HALF_W, PITCH_SCALE } from '../sim/constants';
     4	import type { Ball } from '../sim/Ball';
     5	import type { Player } from '../sim/Player';
     6	import type { Team } from '../sim/Team';
     7	import type {
     8	  AttackFormationId, CornerRoutine, DefendFormationId, TeamMode,
     9	} from '../sim/types';
    10	
    11	/**
    12	 * Formation spot tables (Phase 30) in team-local coordinates: +x = our
    13	 * attacking direction, x=-45 is our goal line. One V2 per SLOT in order
    14	 * [GK, DF, MF, WGL, WGR, ST]; every team owns one attacking and one
    15	 * defending table (its identity, `team.style`). The whole block still
    16	 * slides with the ball, the tactical mode, and three genes (formationDepth,
    17	 * attackingWidth, defensiveCompactness) exactly as it did on the old single
    18	 * BASE_SPOTS. Formation names count outfield lines back→front.
    19	 *
    20	 * Lanes are deliberately separated (Phase 27.1): stacked spines collapse
    21	 * open play into one central corridor. Back-line height is the goals lever
    22	 * (Phase 29/30: higher line = compressed game, space in behind for runs).
    23	 */
    24	export const ATTACK_FORMATIONS: Record<AttackFormationId, V2[]> = {
    25	  // Double base, a linking striker, both wingers HIGH and WIDE (两翼齐飞).
    26	  'wide-212': [v2(-41, 0), v2(-16, -6), v2(-12, 7), v2(8, -19), v2(8, 19), v2(4, 0)],
    27	  // One anchor, the left winger tucks in, an inside-right pair — at the
    28	  // HALF-SPACES (8/11 → 12/15, Phase 31.8): with both wide slots inside
    29	  // y≤11, a narrow-vs-narrow derby had no relief valve at all — both
    30	  // attacks mirrored into one central corridor and the top-5 most chaotic
    31	  // matches in the league (t+i 85–123, zero goals) were ALL this fixture.
    32	  // Still clearly narrower than wide-212's ±19: inside-forwards, not
    33	  // wingers.
    34	  'narrow-122': [v2(-41, 0), v2(-19, 0), v2(-9, -7), v2(-6, 12), v2(6, 15), v2(7, -3)],
    35	  // NOVEL (Phase 67, N5 — mutation-discovered only). TWIN STRIKERS: the
    36	  // right winger becomes a second 9 — a high pair splitting the center
    37	  // backs, one true wide feeder on the left, two at the base. The twins
    38	  // sit a touch higher than wide-212's wingers: a spearhead, not a line.
    39	  'twin-st': [v2(-41, 0), v2(-16, -4), v2(-11, 5), v2(2, -17), v2(10, 6), v2(10, -6)],
    40	  // NOVEL. The FALSE NINE: the striker DROPS between the lines (-2, the
    41	  // hole) to link and drag the last defender out; both wingers push very
    42	  // high and very wide — the runners the false nine releases into the
    43	  // space he vacated.
    44	  'false-nine': [v2(-41, 0), v2(-17, -5), v2(-12, 5), v2(12, -18), v2(12, 18), v2(-2, 0)],
    45	  // NOVEL (Phase 107, N5 — mutation-discovered only). The OVERLOAD: the
    46	  // library's first ASYMMETRIC shape — a three-man left-flank triangle
    47	  // (MF half-space, WGL wide, ST shading in) with the right winger ALONE
    48	  // at maximum width as the isolation outlet (overload to isolate: the
    49	  // switch finds him 1v1). The anchor shades right-center to cover the
    50	  // side the triangle vacates.
    51	  'overload': [v2(-41, 0), v2(-17, 3), v2(-7, -9), v2(9, -17), v2(8, 17), v2(5, -7)],
    52	  // NOVEL. The TARGET MAN (the user's N1.5 reference point — 埃弗顿高塔):
    53	  // the lone tower stands HIGHEST of any shape (+9) as the long ball's
    54	  // destination — the Phase-63 aerial channel finally gets a shape built
    55	  // around it (strength/aerialSense own the descent) — with both wingers
    56	  // at mid-height arriving onto the knock-down, staggered double base
    57	  // behind (no stacked central spine, the 27.1 lesson).
    58	  'target-man': [v2(-41, 0), v2(-18, -4), v2(-10, 5), v2(0, -14), v2(0, 14), v2(9, 0)],
    59	};
    60	
    61	// Defend tables keep the STRIKER HIGH on purpose (30.4). The first cut
    62	// parked all five outfielders goal-side and league scoring collapsed to
    63	// ~1.1: a high body PINS an opposing defender (offence by presence) and
    64	// gives every turnover a launch point — 29.x, whose single spot table left
    65	// the ST at +5 even out of possession, scored fine for exactly this
    66	// reason. Identity lives in the BACK of the shape instead: low-32 drops
    67	// both wingers as wide backs; press-23 pushes them onto the build-up.
    68	export const DEFEND_FORMATIONS: Record<DefendFormationId, V2[]> = {
    69	  // Back THREE (wingers drop as wide backs), MF screens, ST stays HIGH.
    70	  'low-32': [v2(-41, 0), v2(-20, 0), v2(-9, -4), v2(-16, -11), v2(-16, 11), v2(5, 2)],
    71	  // Back two, wingers at halfway, ST hunting the opponent back line.
    72	  'press-23': [v2(-41, 0), v2(-18, -5), v2(-13, 5), v2(0, -15), v2(0, 15), v2(7, 0)],
    73	  // N5b (phase-79): the menu was BINARY (deep bus / front press) and world
    74	  // 991 fixed 16/0 on low-32 — selection had nothing structurally new to
    75	  // try. Two additions, mutation-only (founders still derive the classics):
    76	  // mid-41 = the midfield WALL, striker drops onto the pivot lane
    77	  // ("defend from the front" without pressing);
    78	  'mid-41': [v2(-41, 0), v2(-22, 0), v2(-10, 0), v2(-12, -13), v2(-12, 13), v2(-3, 0)],
    79	  // high-line = squeeze the pitch with the back line, no front press —
    80	  // lives or dies by the offside trap (phase-71's law made it honest).
    81	  'high-line': [v2(-41, 0), v2(-14, -3), v2(-9, 3), v2(-13, -12), v2(-13, 12), v2(6, 0)],
    82	};
    83	
    84	// Density相变 (2026-07-20): the fixed tables above were tuned in ABSOLUTE
    85	// metres for the 90×58 pitch, so on a shrunk pitch (PITCH_SCALE<1) they fall
    86	// out of bounds. Scale them to stay proportional + in-bounds. The DEFAULT path
    87	// is emergentStation (fractional, already fits); this keeps the legacy fixed
    88	// path + the pre-match shape diagrams valid when the field is scaled.
    89	if (PITCH_SCALE !== 1) {
    90	  for (const table of [ATTACK_FORMATIONS, DEFEND_FORMATIONS] as Record<string, V2[]>[]) {
    91	    for (const key of Object.keys(table)) {
    92	      table[key] = table[key].map((p) => v2(p.x * PITCH_SCALE, p.y * PITCH_SCALE));
    93	    }
    94	  }
    95	}
    96	
    97	// EMERGENT POSITIONING FIELD (Phase B → DEFAULT 2026-07-20, the coordinated
    98	// density相变). Positions grow from role + genes + live state, not a fixed
    99	// formation menu — VISION §1's #1 violation retired. It is REQUIRED on the
   100	// shrunk pitch (PITCH_SCALE<1): emergent stations are fractional and auto-fit,
   101	// the fixed tables use absolute coords and would fall off a smaller pitch.
   102	// The UI toggle (settings → experimental) can still turn it OFF for A/B, and
   103	// probes can force-OFF with EMERGENT_POS=0.
   104	let _emergentPos: boolean | null = null; // null = use the default (ON)
   105	export function setEmergentPos(on: boolean): void {
   106	  _emergentPos = on;
   107	}
   108	export function emergentPosOn(): boolean {
   109	  if (_emergentPos !== null) return _emergentPos; // explicit UI / probe override
   110	  // typeof guard: `process` is undefined in the browser bundle — never throw.
   111	  if (typeof process !== 'undefined' && process.env && process.env.EMERGENT_POS === '0') return false;
   112	  return true; // DEFAULT ON
   113	}
   114	
   115	/** How far up/down the pitch each tactical mode pushes the block. */
   116	const MODE_SHIFT: Record<TeamMode, number> = {
   117	  Attack: 10,
   118	  BuildUp: 4,
   119	  CounterAttack: 8,
   120	  Press: 6,
   121	  Defend: -8,
   122	  ResetShape: 0,
   123	};
   124	
   125	/**
   126	 * World-space formation target for a player. `hasBall` decides whether width
   127	 * (attackingWidth) or compactness (defensiveCompactness) shapes the block.
   128	 */
   129	export function formationSpot(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
   130	  // EMERGENT POSITIONING FIELD (Phase B1, toggle — the user's #1 emergence
   131	  // ask: shape must grow from role + genes + live state, not a hand-authored
   132	  // MENU). Behind a flag so it A/Bs cleanly against the fixed tables
   133	  // (positioning-shape.ts) before it can replace them. OFF = today's behavior.
   134	  if (emergentPosOn()) return emergentStation(p, team, ball, hasBall, opp);
   135	  const g = team.genome;
   136	  const base = hasBall
   137	    ? ATTACK_FORMATIONS[team.style.formationAtk][p.index]
   138	    : DEFEND_FORMATIONS[team.style.formationDef][p.index];
   139	
   140	  // Block slides toward the ball along x (local coords), capped at ±10m.
   141	  const ballLocalX = team.localX(ball.pos.x);
   142	  const slide = clamp(ballLocalX * 0.3, -10, 10);
   143	
   144	  // formationDepth: 0 = sit 6m deeper, 1 = push 6m higher.
   145	  const depth = (g.formationDepth - 0.5) * 12;
   146	
   147	  // PRESSING BUYS ITS RISK (Phase 83, the goal-inflation fix): a pressing
   148	  // side's defensive block steps UP with its press gene — outfielders only,
   149	  // defending phase only. Before this, line height was formationDepth's
   150	  // alone, so evolution could chase-press from a deep couch: turnovers with
   151	  // ZERO space conceded behind — the free lunch that rode pressIntensity to
   152	  // 0.88 and the league to 6-7 goals (phase-82 anatomy). Now the line you
   153	  // press with is the line the through-ball/route-one/chip channels attack.
   154	  const pressUp = hasBall || p.role === 'GK' ? 0 : (g.pressIntensity - 0.5) * 8;
   155	
   156	  let x = base.x + slide + depth + pressUp + MODE_SHIFT[team.mode];
   157	
   158	  // Rest defence (Phase 31): the DF slot NEVER joins the siege. With the
   159	  // ball deep in the opponent half, slide (+10) + Attack shift (+10) used
   160	  // to push even the last outfielder past halfway — the attacking team had
   161	  // literally nobody covering, so every turnover was an uncontested
   162	  // breakaway. That hole is what let a 5v6 side out-score its own
   163	  // full-strength baseline once the open-run economy paid honestly
   164	  // (counters were ALL open runs). One cover man keeps counters real —
   165	  // beatable by pace or a dragged block, never free.
   166	  // −12, not −5: a cover man AT halfway is already beaten by the time a
   167	  // counter carrier enters the open-run zone (28m out) — he has to start
   168	  // goal-side of the race, near his base spot, to ever contest it.
   169	  if (p.index === 1 && p.role !== 'GK') {
   170	    if (hasBall) {
   171	      // Rest-defense depth is now the SWEEPER gene's possession face
   172	      // (Phase 88): 0.5 = the old hardcoded −12 exactly; the full libero
   173	      // (1) holds −16 even mid-siege, the bold stopper (0) dares −8.
   174	      x = Math.min(x, -8 - (g.coverBias ?? 0.5) * 8);
   175	    } else {
   176	      // THE SWEEPER (Phase 88, school #2 — catenaccio): the DF slot sits
   177	      // off his own line by the gene — behind it (libero: the man who
   178	      // meets whatever beats the first wave, at the price of playing
   179	      // everyone onside) or ahead of it (stopper: early interceptions,
   180	      // gambling the space behind). 0.5 = today's flat line.
   181	      x -= ((g.coverBias ?? 0.5) - 0.5) * 8;
   182	    }
   183	  }
   184	
   185	  // Width: stretch when we have the ball, squeeze when we don't. The
   186	  // in-possession floor is 1.0 (Phase 27.1) — an attacking shape should
   187	  // never be narrower than its base lanes.
   188	  let widthMul = hasBall
   189	    ? 1.0 + g.attackingWidth * 0.55 // 1.0 .. 1.55
   190	    : 1.15 - g.defensiveCompactness * 0.6; // 1.15 .. 0.55
   191	  // Zonal shape stays HONEST-WIDE (Phase 30.4): a zone defence covers
   192	  // width by definition — it may not also collapse into the central
   193	  // corridor, or its parked bodies dead-lane the entire pitch (measured:
   194	  // zonal sides conceded 3.6 shots/match vs man's 8 — the league's shot
   195	  // volume collapsed with half the clubs zonal).
   196	  if (!hasBall && team.style.scheme === 'zonal') widthMul = Math.max(widthMul, 0.95);
   197	  let y = base.y * widthMul;
   198	
   199	  // Compact teams also drag their block a little toward the ball's y.
   200	  if (!hasBall) y += (ball.pos.y - y * team.attackDir) * team.attackDir * g.defensiveCompactness * 0.25;
   201	
   202	  // Weak-side far-post pull (Phase 31): when the attack is deep AND wide,
   203	  // the far winger leaves the touchline and attacks the back post — the
   204	  // overload that punishes a ball-side defensive shift, and the second
   205	  // body a cutback or deep cross finds. The strong-side winger keeps the
   206	  // width; the pull releases as soon as the ball comes back central.
   207	  if (
   208	    hasBall && p.role === 'WG' && ballLocalX > HALF_L - 20 &&
   209	    Math.abs(ball.pos.y) > 12 && Math.sign(y) !== Math.sign(ball.pos.y)
   210	  ) {
   211	    y *= 0.3;
   212	  }
   213	
   214	  if (p.role === 'GK') {
   215	    // Keepers hold a narrow band in front of goal regardless of mode.
   216	    x = clamp(base.x + (g.keeperAggression - 0.5) * 4, -HALF_L + 1, -HALF_L + 11);
   217	    y = clamp(ball.pos.y * 0.25, -GOAL_WIDTH / 2, GOAL_WIDTH / 2);
   218	    return v2(x * team.attackDir, y);
   219	  }
   220	
   221	  x = clamp(x, -HALF_L + 3, HALF_L - 7);
   222	  y = clamp(y, -HALF_W + 2, HALF_W - 2);
   223	  return v2(x * team.attackDir, y);
   224	}
   225	
   226	/**
   227	 * EMERGENT POSITIONING FIELD (Phase B1-a). Replaces the fixed formation TABLE
   228	 * with a ROLE-anchored field: a role gives a coarse depth+lane TENDENCY (a
   229	 * dimension, like an attribute — not a hand-drawn shape), and the actual
   230	 * station grows from that + the live game state, weighted by GENES. So the
   231	 * team's SHAPE and "style" emerge from gene weights, not from us picking
   232	 * wide-212 vs low-32. B1-a lands the structural swap + a REAL, gene-weighted
   233	 * strong/weak-side shift (the B0 probe found the old ~2m drag was token). The
   234	 * anti-clump / space-value terms (kill the bus box-crowd, no clumping) are
   235	 * B1-b. Opponent-relative positioning is B2. Same sensible modifiers as the
   236	 * table path (slide/depth/press/rest-defence/width) so shape stays sane.
   237	 */
   238	function emergentStation(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/TeamBrain.ts | sed -n '1,300p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { dist } from '../utils/vec';
     2	import { BOX_DEPTH, BOX_WIDTH, HALF_L } from '../sim/constants';
     3	import { cornerKeyZone, formationSpot } from './formations';
     4	import { ballLanding } from './perception';
     5	import { aerialSense } from '../sim/mechanics';
     6	import type { Match } from '../sim/Match';
     7	import type { Player } from '../sim/Player';
     8	import type { Team } from '../sim/Team';
     9	import type { CornerRoutine, RestartState, Role, TeamMode } from '../sim/types';
    10	
    11	/**
    12	 * TeamBrain — picks one tactical mode for the whole team and hands out
    13	 * coordination assignments (who presses, who marks whom) so that players
    14	 * don't all chase the ball. Runs every TEAM_AI_INTERVAL and immediately
    15	 * after possession changes.
    16	 *
    17	 * Mode logic (genes in brackets):
    18	 *  - we have the ball, just won it, ball deep       -> CounterAttack [counterAttackBias]
    19	 *  - we have the ball in their half                 -> Attack
    20	 *  - we have the ball in our half                   -> BuildUp
    21	 *  - they have the ball, we want it back NOW        -> Press [pressIntensity]
    22	 *  - they have the ball, we hold shape              -> Defend
    23	 *  - dead ball / kickoff                            -> ResetShape
    24	 */
    25	export function updateTeamBrain(team: Team, match: Match): void {
    26	  // Restarts are live for coordination: defenders keep marks and pressers
    27	  // crowd the edge of the clearance circle while the taker walks over.
    28	  if (match.phase !== 'playing' && match.phase !== 'restart') {
    29	    team.mode = 'ResetShape';
    30	    team.chasers.clear();
    31	    team.marks.clear();
    32	    team.runners.clear();
    33	    team.arriver = null;
    34	    team.keeperUp = false;
    35	    return;
    36	  }
    37	
    38	  // 门将上前 (Phase 35): trailing in the dying minutes, our own attacking
    39	  // corner — the keeper abandons his goal for the box. The license lives
    40	  // exactly as long as the corner does (setup, hand-off, flight — the
    41	  // 31.9 lesson via team.cornerCrash); the moment it dies he sprints home.
    42	  team.keeperUp =
    43	    team.mentality.urgency > 0.5 &&
    44	    match.half === 2 &&
    45	    match.minute() >= 89 &&
    46	    ((match.phase === 'restart' && match.restart?.kind === 'corner' && match.restart.side === team.side) ||
    47	      (team.cornerCrash !== null && match.simTime < team.cornerCrash.until));
    48	  if (team.keeperUp && !team.keeperUpAnnounced) {
    49	    team.keeperUpAnnounced = true;
    50	    match.pushEvent('info', team.side, `🧤 ${team.goalkeeper.name} is UP for the corner!`);
    51	  }
    52	
    53	  const g = team.genome;
    54	  const ball = match.ball;
    55	  const possession = match.possessionSide; // -1 while the ball is loose
    56	  const prevMode = team.mode;
    57	
    58	  let mode: TeamMode;
    59	  if (possession === team.side) {
    60	    const sinceWin = match.simTime - team.possessionGainedAt;
    61	    const ballLocalX = team.localX(ball.pos.x);
    62	    if (sinceWin < 3.0 && g.counterAttackBias > 0.35 && ballLocalX < 18) {
    63	      mode = 'CounterAttack';
    64	    } else if (ballLocalX > 4) {
    65	      mode = 'Attack';
    66	    } else {
    67	      mode = 'BuildUp';
    68	    }
    69	  } else if (possession === 1 - team.side) {
    70	    // Press appetite: gene + where the ball is (pressing high is more attractive)
    71	    // + hysteresis so the mode doesn't flicker.
    72	    const ballLocalX = team.localX(ball.pos.x);
    73	    // The captain steadies the switch (Phase 39): with the cool head on
    74	    // the pitch, hysteresis is stronger — the team commits to its mode.
    75	    const steady =
    76	      team.captain >= 0 && !team.players[team.captain].sentOff ? 0.04 : 0;
    77	    // THE TRANSITION WINDOW (Phase 112): the 3 seconds after LOSING the
    78	    // ball — the mirror of CounterAttack on the same possession clock.
    79	    // A gegenpress side flips into Press the instant it loses possession;
    80	    // a drop-and-recover side refuses the window and falls into Defend
    81	    // even if its steady-state press would fire. 0.5 = no term at all.
    82	    const sinceLoss = match.simTime - match.teams[1 - team.side].possessionGainedAt;
    83	    const tp = ((g.transitionPress ?? 0.5) - 0.5) * 2;
    84	    const pressScore =
    85	      g.pressIntensity +
    86	      (ballLocalX > 0 ? 0.18 : -0.1) +
    87	      (prevMode === 'Press' ? 0.08 + steady : prevMode === 'Defend' ? -steady : 0) +
    88	      (match.derby ? 0.04 : 0) + // derbies bite (Phase 40)
    89	      (sinceLoss < 3.0 ? tp * 0.22 : 0);
    90	    mode = pressScore > 0.62 ? 'Press' : 'Defend';
    91	  } else {
    92	    // Loose ball: keep the previous shape decision (brief window anyway).
    93	    mode = prevMode === 'ResetShape' ? 'Defend' : prevMode;
    94	  }
    95	
    96	  team.modeTime = mode === prevMode ? team.modeTime : 0;
    97	  team.mode = mode;
    98	
    99	  assignChasers(team, match);
   100	  assignMarks(team, match);
   101	  assignRunners(team, match);
   102	}
   103	
   104	/**
   105	 * Runners: 1–2 attackers licensed to sprint in behind the defensive line
   106	 * while we have the ball — the off-ball movement that makes through balls
   107	 * possible. Capped like chasers so the team never dissolves into everyone
   108	 * running; the carrier and keeper are never runners.
   109	 */
   110	const RUN_ROLE_W: Record<Role, number> = { GK: 0, DF: 0.4, MF: 1.2, WG: 1.8, ST: 2.2 };
   111	
   112	function assignRunners(team: Team, match: Match): void {
   113	  team.runners.clear();
   114	  team.arriver = null;
   115	  // The overlap license survives its own release ball's FLIGHT (the corner
   116	  // lesson, 31.9): the kick clears ball.owner, and a license torn up at
   117	  // that instant strands the runner — and the arriving ball — mid-flight.
   118	  const keepOverlap =
   119	    team.overlapper !== null &&
   120	    match.pendingPass !== null &&
   121	    match.pendingPass.side === team.side &&
   122	    match.pendingPass.targetGid === team.players[team.overlapper].gid;
   123	  if (!keepOverlap) team.overlapper = null;
   124	  if (match.possessionSide !== team.side) return;
   125	  const carrier = match.ball.owner;
   126	  // Corner (Phase 28): flood the box — the three best headers of the ball
   127	  // (aerial sense lives with the DFs and the ST) attack the area while the
   128	  // taker walks over, so the cross has someone to find. The licenses hold
   129	  // THROUGH the hand-off and the flight (Phase 31.9, team.cornerCrash):
   130	  // the restart clears before the kick, and re-licensing generically at
   131	  // that instant pulled every crasher out of the box mid-delivery.
   132	  const liveCorner = match.phase === 'restart' && match.restart?.kind === 'corner' && match.restart.side === team.side;
   133	  const heldCrash = !liveCorner && team.cornerCrash !== null && match.simTime < team.cornerCrash.until;
   134	  if (team.cornerCrash && match.simTime >= team.cornerCrash.until) team.cornerCrash = null;
   135	  if (heldCrash) {
   136	    // Personnel locked at hand-off (31.9): re-scoring here swapped crashers
   137	    // for whoever happened to stand better mid-flight (once the weak-side
   138	    // winger 27m away) and remapped every crash spot under their feet.
   139	    for (const idx of team.cornerCrash!.runners) {
   140	      if (!team.players[idx].sentOff && team.players[idx] !== carrier) team.runners.add(idx);
   141	    }
   142	    const arr = team.cornerCrash!.arriver;
   143	    if (arr !== null && !team.players[arr].sentOff && team.players[arr] !== carrier) team.arriver = arr;
   144	    return;
   145	  }
   146	  if (liveCorner) {
   147	    // Aerial sense × REACHABILITY (Phase 31): the DF is the best header in
   148	    // the game, but the rest-defence clamp parks him ~50m away — a licensed
   149	    // crasher who cannot arrive leaves the primary zone empty (the trace
   150	    // that cracked the 0%-duel-wins corner: the best spots had nobody).
   151	    const flag = match.restart!.pos;
   152	    const routine = match.restart!.routine;
   153	    const takerGid = match.restart!.takerGid;
   154	    // Short/arc routines trade a crasher for the receiver (Phase 31): on a
   155	    // five-outfielder team, three crashers plus the taker leave exactly ONE
   156	    // arriver candidate — usually the worst-placed body on the pitch, and
   157	    // the routine's whole target zone went unattended (probed: the "short"
   158	    // corner crossed 30/30 because the short receiver stood 40m away).
   159	    const crashCount = routine === 'short' || routine === 'arcCutback' ? 2 : 3;
   160	    const scored = team.players
   161	      .filter((p) => p.role !== 'GK' && p.gid !== takerGid && p !== carrier && !p.sentOff)
   162	      .map((p) => ({ p, s: aerialSense(p) - dist(p.pos, flag) / 45 }))
   163	      .sort((a, b) => b.s - a.s || a.p.index - b.p.index);
   164	    for (const { p } of scored.slice(0, crashCount)) team.runners.add(p.index);
   165	    // Routine extra license (Phase 31): the SHORT receiver or the ARC
   166	    // arriver — one more purposeful body, routed by the executor to the
   167	    // routine's key zone. Crash spots for the runners come from the
   168	    // routine's table (executor, cornerCrashSpots).
   169	    if (routine === 'short' || routine === 'arcCutback') {
   170	      const zone = cornerKeyZone(routine, team.attackDir, flag.y);
   171	      let pick: Player | null = null;
   172	      let bd = Infinity;
   173	      for (const p of team.players) {
   174	        if (p.role === 'GK' || p.sentOff || p.gid === takerGid || p === carrier) continue;
   175	        if (team.runners.has(p.index)) continue;
   176	        const d = dist(p.pos, zone);
   177	        if (d < bd) {
   178	          bd = d;
   179	          pick = p;
   180	        }
   181	      }
   182	      if (pick) team.arriver = pick.index;
   183	    }
   184	    return;
   185	  }
   186	  // A second runner for fast/direct sides: counters and high-tempo teams.
   187	  // The late chase (Phase 35) throws one MORE body forward — this is where
   188	  // "everyone forward" physically lives, and where the counters it
   189	  // concedes are born (the chase must cost).
   190	  const count =
   191	    (team.mode === 'CounterAttack' || team.genome.tempo > 0.65 ? 2 : 1) +
   192	    (team.mentality.urgency > 0.65 ? 1 : 0);
   193	  const scored = team.players
   194	    .filter((p) => p.role !== 'GK' && p !== carrier && !p.sentOff)
   195	    .map((p) => ({ p, s: RUN_ROLE_W[p.role] + team.localX(p.pos.x) / 45 }))
   196	    .sort((a, b) => b.s - a.s || a.p.index - b.p.index);
   197	  for (const { p } of scored.slice(0, count)) team.runners.add(p.index);
   198	
   199	  // The ARRIVING runner (Phase 31): ball deep and wide in the attacking
   200	  // third — license ONE late body onto the edge-of-box arc so the byline
   201	  // cutback has someone to find. The MF is the natural arriver (the late
   202	  // midfield run is football's canonical cutback target); the weak-side
   203	  // winger stands in when the MF is the carrier, gone, or already running.
   204	  const ballPos = match.ball.pos;
   205	  const ballLocalX = team.localX(ballPos.x);
   206	  // Trigger EARLY (ball entering the wide attacking channel, not already at
   207	  // the byline) so the arriver's late run is underway by the time the
   208	  // carrier reaches the pull-back zone — an arriver licensed at the byline
   209	  // arrives after the moment has gone (failure mode 14: check who's
   210	  // attacking the delivery before tuning the delivery).
   211	  if (ballLocalX > HALF_L - 21 && Math.abs(ballPos.y) > 10) {
   212	    const eligible = (p: Player | undefined): p is Player =>
   213	      p !== undefined && p !== carrier && !p.sentOff && !team.runners.has(p.index);
   214	    const mf = team.players[2];
   215	    const weakWG = ballPos.y > 0 ? team.players[3] : team.players[4];
   216	    const pick = eligible(mf) ? mf : eligible(weakWG) ? weakWG : null;
   217	    if (pick) team.arriver = pick.index;
   218	  }
   219	
   220	  // 套边 (Phase 34): a WIDE carrier confronted in the attacking half pulls
   221	  // one trailing teammate around the OUTSIDE. Wide-play genes look for it;
   222	  // narrow sides leave the lane to the carrier's own drive.
   223	  if (
   224	    team.overlapper === null && // a flight-preserved license stands
   225	    carrier &&
   226	    carrier.role !== 'GK' &&
   227	    Math.abs(carrier.pos.y) > 10 &&
   228	    team.localX(carrier.pos.x) > 0 &&
   229	    // Width gene × the evolved overlap appetite (Phase 45) crosses the gate.
   230	    team.genome.attackingWidth * team.policy.overlapW > 0.3
   231	  ) {
   232	    const cLocal = team.localX(carrier.pos.x);
   233	    const confronted = match.teams[1 - team.side].players.some(
   234	      (o) =>
   235	        !o.sentOff &&
   236	        dist(o.pos, carrier.pos) < 5.5 &&
   237	        match.teams[1 - team.side].localX(o.pos.x) < match.teams[1 - team.side].localX(carrier.pos.x) + 0.5,
   238	    );
   239	    if (confronted) {
   240	      let pick: Player | null = null;
   241	      let bd = Infinity;
   242	      for (const p of team.players) {
   243	        if (p.role === 'GK' || p === carrier || p.sentOff) continue;
   244	        if (team.runners.has(p.index) || team.arriver === p.index || p.stamina < 0.3) continue;
   245	        // Same wing (or central enough to swing out); trailing but reachable.
   246	        if (Math.sign(p.pos.y) !== Math.sign(carrier.pos.y) && Math.abs(p.pos.y) > 8) continue;
   247	        const behind = cLocal - team.localX(p.pos.x);
   248	        if (behind < 1 || behind > 24) continue;
   249	        const d = dist(p.pos, carrier.pos);
   250	        if (d < bd) {
   251	          bd = d;
   252	          pick = p;
   253	        }
   254	      }
   255	      if (pick) team.overlapper = pick.index;
   256	    }
   257	  }
   258	}
   259	
   260	/**
   261	 * Corner routine choice (Phase 31): once the defensive picture forms
   262	 * (~0.6s into the setup), the taking side reads the openness of each
   263	 * routine's KEY zone and commits. Deterministic — pure state, fixed
   264	 * iteration order, strict improvement. The short option is discounted:
   265	 * it's the pressure valve when the box is packed, not the default.
   266	 */
   267	export function pickCornerRoutine(match: Match, r: RestartState): CornerRoutine {
   268	  const team = match.teams[r.side];
   269	  const defenders = match.teams[1 - r.side].players;
   270	  const order: CornerRoutine[] = ['farPost', 'nearPost', 'arcCutback', 'short'];
   271	  let best: CornerRoutine = 'farPost';
   272	  let bestScore = -Infinity;
   273	  for (const routine of order) {
   274	    const zone = cornerKeyZone(routine, team.attackDir, r.pos.y);
   275	    let nearest = Infinity;
   276	    for (const d of defenders) {
   277	      if (d.sentOff || d.role === 'GK') continue;
   278	      const dd = dist(d.pos, zone);
   279	      if (dd < nearest) nearest = dd;
   280	    }
   281	    let score = Math.min(nearest, 10) / 10;
   282	    if (routine === 'short') score *= 0.55;
   283	    // The arc strike is the best-converting routine (probed: ~2× the post
   284	    // deliveries) — when its zone is comparably open, take it.
   285	    if (routine === 'arcCutback') score += 0.08;
   286	    if (score > bestScore) {
   287	      bestScore = score;
   288	      best = routine;
   289	    }
   290	  }
   291	  return best;
   292	}
   293	
   294	/**
   295	 * Chasers: outfield players allowed to hunt the ball. Everyone else keeps
   296	 * shape/marks. Count scales with pressing: 1 base, +1 in Press mode, +1 for
   297	 * extreme pressIntensity.
   298	 */
   299	function assignChasers(team: Team, match: Match): void {
   300	  team.chasers.clear();

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/TeamBrain.ts | sed -n '299,485p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   299	function assignChasers(team: Team, match: Match): void {
   300	  team.chasers.clear();
   301	  const possession = match.possessionSide;
   302	  const weOwn = possession === team.side;
   303	  if (weOwn) {
   304	    // No chasing our own CARRIER — but a LOOSE ball is ours to contest
   305	    // too (36.2, user report "有人去抢球,其他人呆住了"): possession is
   306	    // sticky, so after a squirt/miscontrol/knockdown the nominal owners
   307	    // never sent a body and the 50/50 was a one-team race. One nearest
   308	    // man goes; designed balls stay untouched (the dribble toucher
   309	    // already chases his own push, a pass in flight belongs to its
   310	    // receiver, restarts have a taker).
   311	    if (
   312	      match.ball.owner === null &&
   313	      match.dribbleTouch === null &&
   314	      !(match.pendingPass !== null && match.pendingPass.side === team.side) &&
   315	      match.phase === 'playing'
   316	    ) {
   317	      let best: Player | null = null;
   318	      let bd = Infinity;
   319	      for (const p of team.players) {
   320	        if (p.role === 'GK' || p.sentOff) continue;
   321	        const d = dist(p.pos, match.ball.pos);
   322	        if (d < bd) {
   323	          bd = d;
   324	          best = p;
   325	        }
   326	      }
   327	      if (best) team.chasers.add(best.index);
   328	    }
   329	    return;
   330	  }
   331	  // The opposing keeper has it in their HANDS (Phase 28.1 → 29.1): they are
   332	  // unchallengeable, so pressing is wasted legs. 28.1 kept ONE shadow at the
   333	  // bubble's edge to cut the short outlet — live play read it as a man
   334	  // camped in the keeper's face (reported twice), so now NOBODY presses a
   335	  // held ball: everyone marks up for the distribution, like a goal kick.
   336	  const owner = match.ball.owner;
   337	  // gkDistributing too (31.9): the shape-wait's 0.25s re-arm quanta left
   338	  // timer==0 gaps where a chaser got assigned, charged, and was expelled
   339	  // when the hold re-armed — the "疯狂抽动逼抢" flicker.
   340	  const gkHolding = owner !== null && owner.role === 'GK' && (owner.gkHoldTimer > 0 || owner.gkDistributing);
   341	
   342	  let count = 1;
   343	  if (gkHolding) {
   344	    count = 0;
   345	  } else {
   346	    // One presser, two for a pressing side — NEVER three (Phase 31, user
   347	    // report): real football sends one or two at the ball; everyone else
   348	    // marks or holds the shape. The extreme-pressIntensity third chaser
   349	    // stacked onto Press mode just re-created the swarm.
   350	    if (team.mode === 'Press' || team.genome.pressIntensity > 0.78) count += 1;
   351	    // Loose ball = a DUEL, not a scrum (Phase 30.5): one contester per team.
   352	    // At 2 per team every midfield 50/50 pulled four sprinters plus the
   353	    // support/marking crowd already there, and the won-tackle squirt re-fed
   354	    // the same pile — the reported "乱成一锅粥" loop.
   355	    if (possession === -1) count = Math.min(count, 1);
   356	    // THE TRANSITION WINDOW (Phase 112): for 3s after losing the ball a
   357	    // gegenpress side throws ONE extra body at it — a deliberate, window-
   358	    // bounded exception to the phase-31 "never three" rule (the standing
   359	    // swarm it banned was permanent; the counter-press IS the momentary
   360	    // swarm, and it expires with the window). A drop-and-recover side
   361	    // refuses even its steady-state second presser until the shape is
   362	    // home. 0.5 leaves the phase-31 counts untouched.
   363	    if (match.phase === 'playing') {
   364	      const sinceLoss = match.simTime - match.teams[1 - team.side].possessionGainedAt;
   365	      if (sinceLoss < 3.0) {
   366	        const tp = ((team.genome.transitionPress ?? 0.5) - 0.5) * 2;
   367	        if (tp > 0.3) count = Math.min(count + 1, 3);
   368	        else if (tp < -0.3) count = Math.min(count, 1);
   369	      }
   370	    }
   371	  }
   372	  // Dead ball (Phase 28.3): you can't win a ball nobody may touch — ONE
   373	  // player closes the taker down (blocking the short option, real-football
   374	  // style); the old pack of 2–3 stood pinned at the corner-flag clearance
   375	  // circle jogging on the spot. Goal kicks (Phase 29): ZERO — the taker is
   376	  // the keeper deep in their own box; charging them is pure wasted legs,
   377	  // so everyone marks up for the distribution instead.
   378	  if (match.phase === 'restart') count = match.restart?.kind === 'goalKick' ? 0 : 1;
   379	
   380	  const outfield = team.players.filter((p) => p.role !== 'GK' && !p.sentOff);
   381	  // ATTACK THE DROP (Phase 32.1, user report "大脚高球也应该能被解围"): an
   382	  // opponent's lofted delivery in flight is chased at its LANDING, by
   383	  // whoever gets there fastest — long balls aim at open men by design, so
   384	  // the by-current-ball-distance pick sent a presser who could never
   385	  // arrive (probed: nearest defender averaged 7.6m off the descent, 5%
   386	  // aerial contests, and the hoof was uncontestable in practice).
   387	  // interceptBall already projects the parabola; the chaser just needed
   388	  // to be the right man.
   389	  const pass = match.pendingPass;
   390	  const ball = match.ball;
   391	  if (
   392	    count > 0 && pass && pass.side !== team.side && ball.owner === null &&
   393	    (ball.z > 0.5 || ball.vz > 2)
   394	  ) {
   395	    const land = ballLanding(ball);
   396	    // LONG hoofs into open field only: an unscoped first cut attacked the
   397	    // landing of every cross, corner and chip too — one extra converging
   398	    // defender on every box delivery re-buried the 31.9 headed game and
   399	    // cost 0.77 goals/match at n=568. Box landings belong to the marking
   400	    // scheme; short chips to the through-ball economy.
   401	    const flight = Math.hypot(ball.vel.x, ball.vel.y) * land.t;
   402	    const inOurBox =
   403	      Math.abs(land.y) < BOX_WIDTH / 2 && team.localX(land.x) < -(HALF_L - BOX_DEPTH);
   404	    if (flight > 12 && !inOurBox) {
   405	      let best: Player | null = null;
   406	      let bestT = Infinity;
   407	      for (const p of outfield) {
   408	        const t = dist(p.pos, land) / Math.max(p.topSpeed, 0.1);
   409	        if (t < bestT) {
   410	          bestT = t;
   411	          best = p;
   412	        }
   413	      }
   414	      if (best) {
   415	        team.chasers.add(best.index);
   416	        return;
   417	      }
   418	    }
   419	  }
   420	  const byDist = [...outfield].sort(
   421	    (a, b) => dist(a.pos, match.ball.pos) - dist(b.pos, match.ball.pos) || a.index - b.index,
   422	  );
   423	  for (const p of byDist.slice(0, count)) team.chasers.add(p.index);
   424	}
   425	
   426	/**
   427	 * Marks: each non-chasing outfielder picks the most dangerous unmarked
   428	 * opponent (deepest into our half) within range. Greedy and deterministic.
   429	 *
   430	 * Marking SCHEME (Phase 30, `team.style.scheme`): 'man' marks every ranged
   431	 * threat (the behavior every phase before 30 shipped with); 'zonal' marks a
   432	 * threat only when it ENTERS A DEFENDER'S ZONE (near that defender's
   433	 * defending spot) or our penalty box. Zone defenders otherwise hold the
   434	 * sliding spots — and crucially, engaging a zone runner drags its defender
   435	 * OFF the spot lattice, which is how attacks open a zone up (a first cut
   436	 * that never engaged parked an impenetrable 5-body wall: 3 shots/match
   437	 * conceded, and the league's shot volume collapsed).
   438	 */
   439	function assignMarks(team: Team, match: Match): void {
   440	  team.marks.clear();
   441	  if (match.possessionSide === team.side) return;
   442	
   443	  const zonal = team.style.scheme === 'zonal';
   444	  const opp = match.teams[1 - team.side];
   445	  const carrier = match.ball.owner;
   446	  // Sort by how deep they are in OUR half: smaller localX for them = deeper
   447	  // for us. (A numerically identical pre-sort used to run first; this
   448	  // comparator is a total order — index tiebreak — so one sort decides fully.)
   449	  // The restart taker is not a threat (Phase 29.1): they're pinned to a dead
   450	  // ball the clearance circle already guards, and the assigned chaser blocks
   451	  // the short option — a marker sent there too made TWO men stand uselessly
   452	  // at the corner flag while the box went a body short.
   453	  const takerGid = match.restart?.takerGid;
   454	  const inOurBox = (x: number, y: number): boolean =>
   455	    team.localX(x) < -HALF_L + BOX_DEPTH && Math.abs(y) < BOX_WIDTH / 2;
   456	  const threats = opp.players
   457	    .filter((o) => o.role !== 'GK' && o !== carrier && !o.sentOff && o.gid !== takerGid)
   458	    .sort((a, b) => opp.localX(b.pos.x) - opp.localX(a.pos.x) || a.index - b.index);
   459	
   460	  const free = team.players.filter((p) => p.role !== 'GK' && !team.chasers.has(p.index) && !p.sentOff);
   461	  // Zonal: each free defender's zone is centered on their DEFENDING spot.
   462	  const zones = zonal ? new Map(free.map((p) => [p.index, formationSpot(p, team, match.ball, false, match.teams[1 - team.side])])) : null;
   463	  const used = new Set<number>();
   464	  for (const threat of threats) {
   465	    const boxThreat = inOurBox(threat.pos.x, threat.pos.y);
   466	    let best: { idx: number; d: number } | null = null;
   467	    for (const p of free) {
   468	      if (used.has(p.index)) continue;
   469	      // Width discipline (Phase 28.4): a WIDE winger does not abandon the
   470	      // flank to join a central pile-up — central threats belong to the
   471	      // spine. This is the user-diagnosed collapse: turnover in midfield →
   472	      // wingers tuck in → six bodies in one corridor → playground scramble.
   473	      if (p.role === 'WG' && Math.abs(p.pos.y) > 12 && Math.abs(threat.pos.y) < 8) continue;
   474	      // Zonal: outside our box, only the defender whose ZONE the threat
   475	      // entered may engage — everyone else keeps the lattice.
   476	      if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;
   477	      const d = dist(p.pos, threat.pos);
   478	      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };
   479	    }
   480	    if (best) {
   481	      used.add(best.idx);
   482	      team.marks.set(best.idx, threat.index);
   483	    }
   484	  }
   485	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/TeamBrain.ts | sed -n '299,485p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   299	function assignChasers(team: Team, match: Match): void {
   300	  team.chasers.clear();
   301	  const possession = match.possessionSide;
   302	  const weOwn = possession === team.side;
   303	  if (weOwn) {
   304	    // No chasing our own CARRIER — but a LOOSE ball is ours to contest
   305	    // too (36.2, user report "有人去抢球,其他人呆住了"): possession is
   306	    // sticky, so after a squirt/miscontrol/knockdown the nominal owners
   307	    // never sent a body and the 50/50 was a one-team race. One nearest
   308	    // man goes; designed balls stay untouched (the dribble toucher
   309	    // already chases his own push, a pass in flight belongs to its
   310	    // receiver, restarts have a taker).
   311	    if (
   312	      match.ball.owner === null &&
   313	      match.dribbleTouch === null &&
   314	      !(match.pendingPass !== null && match.pendingPass.side === team.side) &&
   315	      match.phase === 'playing'
   316	    ) {
   317	      let best: Player | null = null;
   318	      let bd = Infinity;
   319	      for (const p of team.players) {
   320	        if (p.role === 'GK' || p.sentOff) continue;
   321	        const d = dist(p.pos, match.ball.pos);
   322	        if (d < bd) {
   323	          bd = d;
   324	          best = p;
   325	        }
   326	      }
   327	      if (best) team.chasers.add(best.index);
   328	    }
   329	    return;
   330	  }
   331	  // The opposing keeper has it in their HANDS (Phase 28.1 → 29.1): they are
   332	  // unchallengeable, so pressing is wasted legs. 28.1 kept ONE shadow at the
   333	  // bubble's edge to cut the short outlet — live play read it as a man
   334	  // camped in the keeper's face (reported twice), so now NOBODY presses a
   335	  // held ball: everyone marks up for the distribution, like a goal kick.
   336	  const owner = match.ball.owner;
   337	  // gkDistributing too (31.9): the shape-wait's 0.25s re-arm quanta left
   338	  // timer==0 gaps where a chaser got assigned, charged, and was expelled
   339	  // when the hold re-armed — the "疯狂抽动逼抢" flicker.
   340	  const gkHolding = owner !== null && owner.role === 'GK' && (owner.gkHoldTimer > 0 || owner.gkDistributing);
   341	
   342	  let count = 1;
   343	  if (gkHolding) {
   344	    count = 0;
   345	  } else {
   346	    // One presser, two for a pressing side — NEVER three (Phase 31, user
   347	    // report): real football sends one or two at the ball; everyone else
   348	    // marks or holds the shape. The extreme-pressIntensity third chaser
   349	    // stacked onto Press mode just re-created the swarm.
   350	    if (team.mode === 'Press' || team.genome.pressIntensity > 0.78) count += 1;
   351	    // Loose ball = a DUEL, not a scrum (Phase 30.5): one contester per team.
   352	    // At 2 per team every midfield 50/50 pulled four sprinters plus the
   353	    // support/marking crowd already there, and the won-tackle squirt re-fed
   354	    // the same pile — the reported "乱成一锅粥" loop.
   355	    if (possession === -1) count = Math.min(count, 1);
   356	    // THE TRANSITION WINDOW (Phase 112): for 3s after losing the ball a
   357	    // gegenpress side throws ONE extra body at it — a deliberate, window-
   358	    // bounded exception to the phase-31 "never three" rule (the standing
   359	    // swarm it banned was permanent; the counter-press IS the momentary
   360	    // swarm, and it expires with the window). A drop-and-recover side
   361	    // refuses even its steady-state second presser until the shape is
   362	    // home. 0.5 leaves the phase-31 counts untouched.
   363	    if (match.phase === 'playing') {
   364	      const sinceLoss = match.simTime - match.teams[1 - team.side].possessionGainedAt;
   365	      if (sinceLoss < 3.0) {
   366	        const tp = ((team.genome.transitionPress ?? 0.5) - 0.5) * 2;
   367	        if (tp > 0.3) count = Math.min(count + 1, 3);
   368	        else if (tp < -0.3) count = Math.min(count, 1);
   369	      }
   370	    }
   371	  }
   372	  // Dead ball (Phase 28.3): you can't win a ball nobody may touch — ONE
   373	  // player closes the taker down (blocking the short option, real-football
   374	  // style); the old pack of 2–3 stood pinned at the corner-flag clearance
   375	  // circle jogging on the spot. Goal kicks (Phase 29): ZERO — the taker is
   376	  // the keeper deep in their own box; charging them is pure wasted legs,
   377	  // so everyone marks up for the distribution instead.
   378	  if (match.phase === 'restart') count = match.restart?.kind === 'goalKick' ? 0 : 1;
   379	
   380	  const outfield = team.players.filter((p) => p.role !== 'GK' && !p.sentOff);
   381	  // ATTACK THE DROP (Phase 32.1, user report "大脚高球也应该能被解围"): an
   382	  // opponent's lofted delivery in flight is chased at its LANDING, by
   383	  // whoever gets there fastest — long balls aim at open men by design, so
   384	  // the by-current-ball-distance pick sent a presser who could never
   385	  // arrive (probed: nearest defender averaged 7.6m off the descent, 5%
   386	  // aerial contests, and the hoof was uncontestable in practice).
   387	  // interceptBall already projects the parabola; the chaser just needed
   388	  // to be the right man.
   389	  const pass = match.pendingPass;
   390	  const ball = match.ball;
   391	  if (
   392	    count > 0 && pass && pass.side !== team.side && ball.owner === null &&
   393	    (ball.z > 0.5 || ball.vz > 2)
   394	  ) {
   395	    const land = ballLanding(ball);
   396	    // LONG hoofs into open field only: an unscoped first cut attacked the
   397	    // landing of every cross, corner and chip too — one extra converging
   398	    // defender on every box delivery re-buried the 31.9 headed game and
   399	    // cost 0.77 goals/match at n=568. Box landings belong to the marking
   400	    // scheme; short chips to the through-ball economy.
   401	    const flight = Math.hypot(ball.vel.x, ball.vel.y) * land.t;
   402	    const inOurBox =
   403	      Math.abs(land.y) < BOX_WIDTH / 2 && team.localX(land.x) < -(HALF_L - BOX_DEPTH);
   404	    if (flight > 12 && !inOurBox) {
   405	      let best: Player | null = null;
   406	      let bestT = Infinity;
   407	      for (const p of outfield) {
   408	        const t = dist(p.pos, land) / Math.max(p.topSpeed, 0.1);
   409	        if (t < bestT) {
   410	          bestT = t;
   411	          best = p;
   412	        }
   413	      }
   414	      if (best) {
   415	        team.chasers.add(best.index);
   416	        return;
   417	      }
   418	    }
   419	  }
   420	  const byDist = [...outfield].sort(
   421	    (a, b) => dist(a.pos, match.ball.pos) - dist(b.pos, match.ball.pos) || a.index - b.index,
   422	  );
   423	  for (const p of byDist.slice(0, count)) team.chasers.add(p.index);
   424	}
   425	
   426	/**
   427	 * Marks: each non-chasing outfielder picks the most dangerous unmarked
   428	 * opponent (deepest into our half) within range. Greedy and deterministic.
   429	 *
   430	 * Marking SCHEME (Phase 30, `team.style.scheme`): 'man' marks every ranged
   431	 * threat (the behavior every phase before 30 shipped with); 'zonal' marks a
   432	 * threat only when it ENTERS A DEFENDER'S ZONE (near that defender's
   433	 * defending spot) or our penalty box. Zone defenders otherwise hold the
   434	 * sliding spots — and crucially, engaging a zone runner drags its defender
   435	 * OFF the spot lattice, which is how attacks open a zone up (a first cut
   436	 * that never engaged parked an impenetrable 5-body wall: 3 shots/match
   437	 * conceded, and the league's shot volume collapsed).
   438	 */
   439	function assignMarks(team: Team, match: Match): void {
   440	  team.marks.clear();
   441	  if (match.possessionSide === team.side) return;
   442	
   443	  const zonal = team.style.scheme === 'zonal';
   444	  const opp = match.teams[1 - team.side];
   445	  const carrier = match.ball.owner;
   446	  // Sort by how deep they are in OUR half: smaller localX for them = deeper
   447	  // for us. (A numerically identical pre-sort used to run first; this
   448	  // comparator is a total order — index tiebreak — so one sort decides fully.)
   449	  // The restart taker is not a threat (Phase 29.1): they're pinned to a dead
   450	  // ball the clearance circle already guards, and the assigned chaser blocks
   451	  // the short option — a marker sent there too made TWO men stand uselessly
   452	  // at the corner flag while the box went a body short.
   453	  const takerGid = match.restart?.takerGid;
   454	  const inOurBox = (x: number, y: number): boolean =>
   455	    team.localX(x) < -HALF_L + BOX_DEPTH && Math.abs(y) < BOX_WIDTH / 2;
   456	  const threats = opp.players
   457	    .filter((o) => o.role !== 'GK' && o !== carrier && !o.sentOff && o.gid !== takerGid)
   458	    .sort((a, b) => opp.localX(b.pos.x) - opp.localX(a.pos.x) || a.index - b.index);
   459	
   460	  const free = team.players.filter((p) => p.role !== 'GK' && !team.chasers.has(p.index) && !p.sentOff);
   461	  // Zonal: each free defender's zone is centered on their DEFENDING spot.
   462	  const zones = zonal ? new Map(free.map((p) => [p.index, formationSpot(p, team, match.ball, false, match.teams[1 - team.side])])) : null;
   463	  const used = new Set<number>();
   464	  for (const threat of threats) {
   465	    const boxThreat = inOurBox(threat.pos.x, threat.pos.y);
   466	    let best: { idx: number; d: number } | null = null;
   467	    for (const p of free) {
   468	      if (used.has(p.index)) continue;
   469	      // Width discipline (Phase 28.4): a WIDE winger does not abandon the
   470	      // flank to join a central pile-up — central threats belong to the
   471	      // spine. This is the user-diagnosed collapse: turnover in midfield →
   472	      // wingers tuck in → six bodies in one corridor → playground scramble.
   473	      if (p.role === 'WG' && Math.abs(p.pos.y) > 12 && Math.abs(threat.pos.y) < 8) continue;
   474	      // Zonal: outside our box, only the defender whose ZONE the threat
   475	      // entered may engage — everyone else keeps the lattice.
   476	      if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;
   477	      const d = dist(p.pos, threat.pos);
   478	      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };
   479	    }
   480	    if (best) {
   481	      used.add(best.idx);
   482	      team.marks.set(best.idx, threat.index);
   483	    }
   484	  }
   485	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'rg -n "policies|policy =|PlayerStyle|playerStyle|decision|AI_INTERVAL|PLAYER_AI|brain|positioning" src/sim src/evolution src/ai | head -n 300 && rg -n "export interface Policy|DEFAULT_POLICY|passLaneW|passOpenW|runScore|supportBase|interceptScore" src'[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
src/evolution/freeAgents.ts:5:import type { PlayerStyle } from './playerStyle';
src/evolution/freeAgents.ts:27:  style: PlayerStyle;
src/evolution/careers.ts:59: * Phase 119j adds positioning at 1.0 (average decline) — keeps the existing
src/evolution/careers.ts:72:  positioning: 1.0,
src/ai/perception.ts:168: * against the first-time hit. Shared by the shoot decision
src/evolution/evolve.ts:9:import { crossoverSquadStyles } from './playerStyle';
src/evolution/evolve.ts:189:      // Attacking-style policy drifts too (Phase 42) — decision STYLE evolves.
src/evolution/evolve.ts:190:      coach.policy = mutatePolicyGenes(coach.policy, rng);
src/evolution/evolve.ts:227:      const policy = mutatePolicyGenes(
src/evolution/evolve.ts:252:      // inherits both parents' decision temperaments, slot by slot.
src/ai/actionExecutor.ts:342:      // Kick already happened at decision time — brief follow-through.
src/ai/actionExecutor.ts:460:    // out not to block the trap at all — the passer's decision cadence is
src/ai/mentality.ts:7: * gene mutation. The brains read `team.genome` exactly as before; the
src/ai/formations.ts:133:  // (positioning-shape.ts) before it can replace them. OFF = today's behavior.
src/ai/formations.ts:235: * B1-b. Opponent-relative positioning is B2. Same sensible modifiers as the
src/sim/League.ts:33:  applyPlayerStyle, neutralSquadStyles, styleFromBloodline,
src/sim/League.ts:35:} from '../evolution/playerStyle';
src/sim/League.ts:428:      // The personal-style wire (Phase 54): each slot's brain runs the
src/sim/League.ts:430:      rolePolicies: f.squadStyles?.map((s) => applyPlayerStyle(f.coach.policy, s)),
src/sim/League.ts:1308:    // ATTR_KEY, so a pre-v32 squad missing `positioning` would poison the
src/sim/League.ts:1314:      if (a && a.positioning === undefined) a.positioning = 0.5;
src/sim/League.ts:1451:        if (!f.coach) f.policy = { ...defaultPolicyGenes(), ...f.policy };
src/sim/League.ts:1459:        if (!f.coach) f.policy = { ...defaultPolicyGenes(), ...f.policy };
src/sim/League.ts:1467:        if (!f.coach) f.policy = { ...defaultPolicyGenes(), ...f.policy };
src/sim/League.ts:1487:          // The rebuilder drops unlisted keys — carry positioning (Phase 119j;
src/sim/League.ts:1490:          positioning: p.positioning ?? 0.5,
src/sim/League.ts:1522:      // v15 -> v16: per-player decision styles (Phase 54). Everyone loads
src/ai/TeamBrain.ts:14: * don't all chase the ball. Runs every TEAM_AI_INTERVAL and immediately
src/ai/TeamBrain.ts:92:    // Loose ball: keep the previous shape decision (brief window anyway).
src/evolution/playerGenome.ts:47:   * density, so positioning is a real budget TRADE-OFF, not free.
src/evolution/playerGenome.ts:49:  positioning: number;
src/evolution/playerGenome.ts:54:  'positioning',
src/evolution/playerGenome.ts:136: * positioning attr, keeping the tuned 0.5 density so the existing physics
src/evolution/playerGenome.ts:137: * still centres on 0.5 and positioning is a real trade-off, not free). That
src/evolution/playerGenome.ts:148: * positioning, not the outfield scoring/tackling stats. The cap dropped
src/ai/PlayerBrain.ts:18: * PlayerBrain — utility AI. Each decision tick the player scores a set of
src/ai/PlayerBrain.ts:23: * Kicks (Pass/Shoot/Clear) execute immediately at decision time; movement
src/ai/PlayerBrain.ts:72:  const W = team.policies[p.index]; // utility weights — DEFAULT_POLICY unless a wildcard carries learned ones
src/ai/PlayerBrain.ts:96:  // Keeper hold (Phase 27.2): ball in the hands — no distribution decision
src/ai/PlayerBrain.ts:269:  // One aerial-lane read per decision — the pass loop and the through-ball
src/ai/PlayerBrain.ts:551:  // snap-decision window (giveBall) makes the first-time strike.
src/ai/PlayerBrain.ts:891:  // brain tick of the moment dying and he falls through to positioning,
src/ai/PlayerBrain.ts:955:      // filter/map/spread allocated two arrays per GK decision.
src/ai/PlayerBrain.ts:981:  const W = team.policies[p.index];
src/evolution/policyGenome.ts:9: * modulated it, so decision STYLE could never truly diverge. This releases the
src/evolution/traits.ts:3:import type { PlayerStyle } from './playerStyle';
src/evolution/traits.ts:22: * trait names a bias that is provably shaping decisions, it never adds a
src/evolution/traits.ts:55:  a: PlayerAttributes, role: Role, style?: PlayerStyle,
src/evolution/traits.ts:81:export function traitsOf(a: PlayerAttributes, role: Role, style?: PlayerStyle): Trait[] {
src/evolution/genome.ts:32:  /** Overall speed of ball circulation and decision urgency. */
src/evolution/franchise.ts:8:import { neutralSquadStyles, type PlayerStyle } from './playerStyle';
src/evolution/franchise.ts:44:  /** Per-player decision-style multipliers (Phase 54) — personal appetites
src/evolution/franchise.ts:46:  squadStyles: PlayerStyle[];
src/sim/mechanics.ts:96:  speed: number, pressure: number, misalign: number, technique: number, positioning = 0.5,
src/sim/mechanics.ts:104:  const aware = 1 - (positioning - 0.5) * 0.6; // 0.7 .. 1.3
src/sim/mechanics.ts:127:  let pFail = touchFailChance(speed, pressure, misalign, p.attrs.dribbling, p.attrs.positioning);
src/sim/mechanics.ts:162: * corners, goal kicks — passed down from the restart taker's decision).
src/sim/mechanics.ts:336:    ((team.genome.tempo + team.genome.passBias) / 2) * team.policies[passer.index].wallPassW > 0.35
src/sim/mechanics.ts:526: * meets it first-time (giveBall's snap-decision window). Faster than a
src/sim/mechanics.ts:848:    touchFailChance(speed, pressure, misalign, trapper.attrs.dribbling, trapper.attrs.positioning) + 0.05, 0, 0.5,
src/evolution/playerStyle.ts:8: * decision-bias gene set: how shot-hungry, long-shot-happy, take-on-prone,
src/evolution/playerStyle.ts:11: * existing `TeamInfo.rolePolicies` wire — the brain already resolves a
src/evolution/playerStyle.ts:25:export type PlayerStyleKey = (typeof PLAYER_STYLE_KEYS)[number];
src/evolution/playerStyle.ts:26:export type PlayerStyle = Record<PlayerStyleKey, number>;
src/evolution/playerStyle.ts:42:export function neutralStyle(): PlayerStyle {
src/evolution/playerStyle.ts:43:  const s = {} as PlayerStyle;
src/evolution/playerStyle.ts:49:export function neutralSquadStyles(n: number): PlayerStyle[] {
src/evolution/playerStyle.ts:57:export function styleFromBloodline(retiree: PlayerStyle, rng: Rng): PlayerStyle {
src/evolution/playerStyle.ts:58:  const s = {} as PlayerStyle;
src/evolution/playerStyle.ts:66:export function crossoverSquadStyles(a: PlayerStyle[], b: PlayerStyle[], rng: Rng): PlayerStyle[] {
src/evolution/playerStyle.ts:72:    const mix = {} as PlayerStyle;
src/evolution/playerStyle.ts:84:export function applyPlayerStyle(
src/evolution/playerStyle.ts:86:  style: PlayerStyle,
src/evolution/playerStyle.ts:131:  wallPassW: { hi: 'One-two brain' },
src/evolution/playerStyle.ts:139:export function playerVector(attrs: PlayerAttributes, style: PlayerStyle): number[] {
src/evolution/playerStyle.ts:141:    d.kind === 'attr' ? attrs[d.key as keyof PlayerAttributes] : style[d.key as PlayerStyleKey]);
src/evolution/playerStyle.ts:180:export function styleFit(a: PlayerStyle, b: PlayerStyle): number {
src/sim/Player.ts:59:  decisionTimer = 0;
src/sim/Player.ts:76:   * again. Set at capture so the first decision happens ON the ball (the
src/sim/Player.ts:77:   * settle touch and the pass game keep their timing); a decision that
src/sim/Player.ts:128:   * brain-level whip the render reads as twitching. Enter containment only
src/sim/Player.ts:338:    this.decisionTimer -= dt;
src/sim/Team.ts:35:  /** Utility-policy weights the brains score with (learned for wildcards). */
src/sim/Team.ts:39:  readonly policies: PolicyParams[];
src/sim/Team.ts:53:  brainTimer = 0;
src/sim/Team.ts:93:   * Game-state mentality (Phase 35): recomputed each brain tick from
src/sim/Team.ts:104:   * The mentality layer applies ON TOP of this each brain tick. Stays
src/sim/Team.ts:127:   * it. The carrier brain reads `staleTime` — the longer a team recycles the
src/sim/Team.ts:142:  // positioning) don't allocate. Shared instances: callers must not mutate.
src/sim/Team.ts:156:    // Explicit policies are merged over the defaults so a vector trained
src/sim/Team.ts:160:    this.policy = info.policy ? { ...DEFAULT_POLICY, ...info.policy } : DEFAULT_POLICY;
src/sim/Team.ts:165:    this.policies = ROLES.map((_, i) => {
src/sim/constants.ts:62: * "fresher legs late", the tired-legs brain gate — was dead. Repriced so
src/sim/constants.ts:105: * or blind — and both the shoot decision (laneBlockers-suppressed appetite)
src/sim/constants.ts:235:export const AI_INTERVAL = 0.15;
src/sim/constants.ts:237:export const TEAM_AI_INTERVAL = 0.4;
src/sim/types.ts:116:  /** Top candidates from the last decision, for explainability. */
src/sim/types.ts:128: * LEARNED policy. DEFAULT_POLICY holds the exact literals the brain always
src/sim/Match.ts:11:  AI_INTERVAL, BALL_BOUNCE, BALL_FRICTION_K, BOUNCE_DAMP, BOUNCE_MIN_VZ, BOX_DEPTH, BOX_WIDTH,
src/sim/Match.ts:17:  RESTART_TIMEOUT, STOPPAGE_MAX, TEAM_AI_INTERVAL, TOUCH_CONTROL_DIST,
src/sim/Match.ts:171:   * ball ahead and is chasing it. The tag keeps his brain on the chase and
src/sim/Match.ts:183:  /** Gid whose next carrier decision must be a kick (restart first touch). */
src/sim/Match.ts:185:  /** Gid whose next carrier decision is the kickoff — played BACKWARD (27.3). */
src/sim/Match.ts:257:    // ONCE at kickoff; the score/clock mentality layers on top each brain
src/sim/Match.ts:293:    // Stagger decision ticks deterministically (symmetric across the teams)
src/sim/Match.ts:295:    this.allPlayers.forEach((p) => (p.decisionTimer = ((p.index % TEAM_SIZE) + 1) * (AI_INTERVAL / TEAM_SIZE)));
src/sim/Match.ts:386:      team.brainTimer -= dt;
src/sim/Match.ts:388:      if (team.brainTimer <= 0) {
src/sim/Match.ts:389:        // Game-state mentality (Phase 35): the gene view every brain and
src/sim/Match.ts:414:        team.brainTimer = TEAM_AI_INTERVAL;
src/sim/Match.ts:425:      if (p.decisionTimer <= 0) {
src/sim/Match.ts:427:        p.decisionTimer = AI_INTERVAL;
src/sim/Match.ts:731:    // Settle on the ball: carry it briefly before the next decision instead of
src/sim/Match.ts:744:    // decision comes quicker (the touch was the setup, not a reception).
src/sim/Match.ts:762:      // The settle beat before the next push: the first decision after any
src/sim/Match.ts:763:      // capture happens ON the ball (touchTimer ≥ the decision settle).
src/sim/Match.ts:778:    // Snap decisions in shooting range (Phase 28.2): a receiver in front of
src/sim/Match.ts:785:    p.decisionTimer = Math.max(p.decisionTimer, inShootingRange ? 0.08 : recollect ? 0.18 : 0.3);
src/sim/Match.ts:789:    if (gkFeet) p.decisionTimer = Math.min(p.decisionTimer, 0.18);
src/sim/Match.ts:825:            p.decisionTimer = 0.07;
src/sim/Match.ts:849:      // Possession swung — both brains re-evaluate promptly.
src/sim/Match.ts:850:      this.teams[0].brainTimer = Math.min(this.teams[0].brainTimer, 0.05);
src/sim/Match.ts:851:      this.teams[1].brainTimer = Math.min(this.teams[1].brainTimer, 0.05);
src/sim/Match.ts:864:      // first decision happens ON the ball, so the pass game keeps its
src/sim/Match.ts:1271:    // Clear stale assignments in both directions and make both brains
src/sim/Match.ts:1280:    this.teams[0].brainTimer = Math.min(this.teams[0].brainTimer, 0.05);
src/sim/Match.ts:1281:    this.teams[1].brainTimer = Math.min(this.teams[1].brainTimer, 0.05);
src/sim/Match.ts:1326:      out.decisionTimer = 0.05;
src/sim/Match.ts:1327:      team.policies[out.index] = sub.policy;
src/sim/Match.ts:1435:    this.teams[0].brainTimer = Math.min(this.teams[0].brainTimer, 0.05);
src/sim/Match.ts:1436:    this.teams[1].brainTimer = Math.min(this.teams[1].brainTimer, 0.05);
src/sim/Match.ts:1506:    out.decisionTimer = 0.05; // think on arrival, not a stale slot's cadence
src/sim/Match.ts:1507:    team.policies[out.index] = sub.policy;
src/sim/Match.ts:1572:   * (their brain chases the stationary ball), defenders reshape but are held
src/sim/Match.ts:1729:    // broadcast moment. The chase positioning already carried him to
src/sim/Match.ts:1754:      taker.decisionTimer = 0.12; // kick promptly (giveBall's settle is for open play)
src/sim/Match.ts:1953:    st.decisionTimer = 0.05;
src/evolution/playerStyle.ts:1:import { DEFAULT_POLICY, type PolicyParams } from '../sim/types';
src/evolution/playerStyle.ts:23:  'shootBase', 'longShotW', 'dribbleBase', 'runScore', 'wallPassW',
src/evolution/playerStyle.ts:82: * merges it over DEFAULT_POLICY; non-style keys stay the coach's).
src/evolution/playerStyle.ts:90:    const base = coachPolicy[k] ?? DEFAULT_POLICY[k];
src/evolution/playerStyle.ts:91:    const lo = DEFAULT_POLICY[k] * POLICY_MIN_MUL;
src/evolution/playerStyle.ts:92:    const hi = DEFAULT_POLICY[k] * POLICY_MAX_MUL;
src/evolution/playerStyle.ts:130:  runScore: { hi: 'Ghost runner' },
src/sim/League.ts:1439:      // played the shared DEFAULT_POLICY — backfill that subset so a loaded
src/evolution/traits.ts:29: *   shadow    runScore ≥ 1.3                        the late runner
src/evolution/traits.ts:74:    if (style.runScore >= 1.2) out.push({ t: 'shadow', excess: (style.runScore - 1.2) * 2 });
src/evolution/policyGenome.ts:3:import { DEFAULT_POLICY, type PolicyParams } from '../sim/types';
src/evolution/policyGenome.ts:7: * PlayerBrain scores with were a SHARED, hand-tuned constant (DEFAULT_POLICY):
src/evolution/policyGenome.ts:16: * weights stay at DEFAULT_POLICY — competence scaffolding, not style.
src/evolution/policyGenome.ts:21:  'throughBase', 'crossBase', 'loftBase', 'longShotW', 'runScore',
src/evolution/policyGenome.ts:24:  'chaseBase', 'markBase', 'interceptScore', 'clearBase', 'clearPressureW',
src/evolution/policyGenome.ts:27:  'passBase', 'passLaneW', 'passOpenW', 'passOutletMul', 'supportBase',
src/evolution/policyGenome.ts:42:  const d = DEFAULT_POLICY[k];
src/evolution/policyGenome.ts:50:  for (const k of POLICY_GENE_KEYS) p[k] = DEFAULT_POLICY[k];
src/evolution/policyGenome.ts:54:export interface PolicyMutateOptions {
src/evolution/styleSpace.ts:3:import { DEFAULT_POLICY, type PolicyParams } from '../sim/types';
src/evolution/styleSpace.ts:57:  runScore: 'attack', wallPassW: 'attack', thirdManW: 'attack', overlapW: 'attack',
src/evolution/styleSpace.ts:58:  chaseBase: 'defence', markBase: 'defence', interceptScore: 'defence',
src/evolution/styleSpace.ts:60:  passBase: 'build', passLaneW: 'build', passOpenW: 'build',
src/evolution/styleSpace.ts:61:  passOutletMul: 'build', supportBase: 'build',
src/evolution/styleSpace.ts:69:    key, kind: 'policy' as const, scale: DEFAULT_POLICY[key] * 1.2,
src/evolution/styleSpace.ts:78:    d.kind === 'gene' ? g[d.key] : src.policy?.[d.key as keyof PolicyParams] ?? DEFAULT_POLICY[d.key as keyof PolicyParams],
src/evolution/styleSpace.ts:145:  runScore: { hi: 'Runners in waves' },
src/evolution/styleSpace.ts:148:  interceptScore: { hi: 'Lane thieves' },
src/evolution/styleSpace.ts:151:  supportBase: { hi: 'Swarm support' },
src/sim/Team.ts:8:  BENCH_ROLES, DEFAULT_POLICY, ROLES, deriveTeamStyle, emptyStats,
src/sim/Team.ts:159:    // keep the DEFAULT_POLICY object itself (bit-identity discipline).
src/sim/Team.ts:160:    this.policy = info.policy ? { ...DEFAULT_POLICY, ...info.policy } : DEFAULT_POLICY;
src/sim/Team.ts:167:      return rp ? { ...DEFAULT_POLICY, ...rp } : this.policy;
src/sim/Team.ts:186:        policy: rp ? { ...DEFAULT_POLICY, ...rp } : this.policy,
src/sim/types.ts:128: * LEARNED policy. DEFAULT_POLICY holds the exact literals the brain always
src/sim/types.ts:131:export interface PolicyParams {
src/sim/types.ts:137:  passLaneW: number;
src/sim/types.ts:138:  passOpenW: number;
src/sim/types.ts:150:  supportBase: number;
src/sim/types.ts:155:  interceptScore: number;
src/sim/types.ts:157:  runScore: number;
src/sim/types.ts:177:export const DEFAULT_POLICY: PolicyParams = {
src/sim/types.ts:183:  passLaneW: 0.3,
src/sim/types.ts:184:  passOpenW: 0.2,
src/sim/types.ts:196:  supportBase: 0.3,
src/sim/types.ts:201:  interceptScore: 0.95,
src/sim/types.ts:202:  runScore: 0.95,
src/sim/types.ts:255:   * DEFAULT_POLICY (Phase 42 franchises carry the attacking-style subset). */
src/sim/types.ts:261:   * to `policy` (then DEFAULT_POLICY), so a team without this field is
src/ai/PlayerBrain.ts:72:  const W = team.policies[p.index]; // utility weights — DEFAULT_POLICY unless a wildcard carries learned ones
src/ai/PlayerBrain.ts:321:      let s = W.passBase + lane * W.passLaneW + open * W.passOpenW;
src/ai/PlayerBrain.ts:722:      // (`passBase + lane*passLaneW + …`); the hands distribution never did —
src/ai/PlayerBrain.ts:1016:      let s = (W.supportBase + clamp01(1 - d / 30) * W.supportProxW + roleBonus) * modeMul;
src/ai/PlayerBrain.ts:1033:      let s = W.runScore;
src/ai/PlayerBrain.ts:1049:      let s = W.runScore * (1.05 + (g.tempo + g.passBias) * 0.25);
src/ai/PlayerBrain.ts:1056:      let s = W.runScore * (1 + g.attackingWidth * 0.3);
src/ai/PlayerBrain.ts:1071:      if (inter.ok) cands.push({ action: 'InterceptPass', score: W.interceptScore, why: 'can reach the passing lane first' });
src/ui/i18n.ts:263:  runScore: '前插欲望',
src/ui/i18n.ts:266:  interceptScore: '拦截倾向',
src/ui/i18n.ts:270:  passLaneW: '传球线路',
src/ui/i18n.ts:271:  passOpenW: '空当传球',
src/ui/i18n.ts:273:  supportBase: '接应倾向',

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/evolution/playerStyle.ts | sed -n '1,110p;130,185p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { DEFAULT_POLICY, type PolicyParams } from '../sim/types';
     2	import type { Rng } from '../utils/rng';
     3	import { ATTR_KEYS, type PlayerAttributes } from './playerGenome';
     4	import type { PolicyGenes } from './policyGenome';
     5	
     6	/**
     7	 * PLAYER PERSONAL STYLE (Phase 54 — Stage 3 W2). A small per-PLAYER
     8	 * decision-bias gene set: how shot-hungry, long-shot-happy, take-on-prone,
     9	 * late-run-driven and combination-minded THIS player is, expressed as
    10	 * MULTIPLIERS on his coach's evolved team policy. The plumbing is the
    11	 * existing `TeamInfo.rolePolicies` wire — the brain already resolves a
    12	 * per-slot policy; this is what finally feeds it.
    13	 *
    14	 * Emergence rules honored: every player is born NEUTRAL (×1.0 — the coach's
    15	 * policy verbatim, bit-identical to pre-54), styles diverge only through
    16	 * inheritance noise + selection (academy bloodline: the successor mutates
    17	 * the retiree's style; rebirth crosses both parents' slots). A style is
    18	 * PERSONAL and fixed for a career — development changes what a player can
    19	 * do, not who he is.
    20	 */
    21	
    22	export const PLAYER_STYLE_KEYS = [
    23	  'shootBase', 'longShotW', 'dribbleBase', 'runScore', 'wallPassW',
    24	] as const satisfies readonly (keyof PolicyParams)[];
    25	export type PlayerStyleKey = (typeof PLAYER_STYLE_KEYS)[number];
    26	export type PlayerStyle = Record<PlayerStyleKey, number>;
    27	
    28	/** Personal appetite range: a player can halve or half-again his coach's
    29	 * setting, never erase it (competence scaffolding stays the coach's job). */
    30	export const STYLE_MIN = 0.6;
    31	export const STYLE_MAX = 1.5;
    32	
    33	/** The team-policy bounds (policyGenome's 0.5–1.7 × default) also cap the
    34	 * COMBINED coach×player value, so a maverick under a maverick coach still
    35	 * plays football. */
    36	const POLICY_MIN_MUL = 0.5;
    37	const POLICY_MAX_MUL = 1.7;
    38	
    39	const clampStyle = (v: number): number => Math.max(STYLE_MIN, Math.min(STYLE_MAX, v));
    40	
    41	/** Born neutral: the coach's policy verbatim. */
    42	export function neutralStyle(): PlayerStyle {
    43	  const s = {} as PlayerStyle;
    44	  for (const k of PLAYER_STYLE_KEYS) s[k] = 1;
    45	  return s;
    46	}
    47	
    48	/** A whole squad of neutrals (founding / migration backfill). */
    49	export function neutralSquadStyles(n: number): PlayerStyle[] {
    50	  return Array.from({ length: n }, () => neutralStyle());
    51	}
    52	
    53	/** Academy heredity: the successor is grown in the retiree's image. σ0.15 —
    54	 * measured (player-style probe): crossover blending + D2 rebirth keep
    55	 * pulling personal variance back toward the parental means, so the personal
    56	 * layer needs a louder mutation than attrs (σ0.12) for tails that read. */
    57	export function styleFromBloodline(retiree: PlayerStyle, rng: Rng): PlayerStyle {
    58	  const s = {} as PlayerStyle;
    59	  for (const k of PLAYER_STYLE_KEYS) s[k] = clampStyle(retiree[k] + rng.gaussian() * 0.15);
    60	  return s;
    61	}
    62	
    63	/** Position-wise crossover for reborn squads — mirrors crossoverSquads'
    64	 * pick-A / pick-B / blend shape (its own draws; slots stay coherent
    65	 * because both run in slot order). */
    66	export function crossoverSquadStyles(a: PlayerStyle[], b: PlayerStyle[], rng: Rng): PlayerStyle[] {
    67	  return a.map((sa, i) => {
    68	    const sb = b[i] ?? sa;
    69	    const r = rng.next();
    70	    if (r < 0.4) return { ...sa };
    71	    if (r < 0.8) return { ...sb };
    72	    const mix = {} as PlayerStyle;
    73	    for (const k of PLAYER_STYLE_KEYS) mix[k] = (sa[k] + sb[k]) / 2;
    74	    return mix;
    75	  });
    76	}
    77	
    78	/**
    79	 * The wire: one player's effective policy — his coach's evolved genes with
    80	 * the personal appetites multiplied in, clamped to the global policy
    81	 * bounds. Returns the personal OVERRIDE subset only (TeamInfo.rolePolicies
    82	 * merges it over DEFAULT_POLICY; non-style keys stay the coach's).
    83	 */
    84	export function applyPlayerStyle(
    85	  coachPolicy: PolicyGenes,
    86	  style: PlayerStyle,
    87	): Partial<PolicyParams> {
    88	  const out: Partial<PolicyParams> = { ...coachPolicy };
    89	  for (const k of PLAYER_STYLE_KEYS) {
    90	    const base = coachPolicy[k] ?? DEFAULT_POLICY[k];
    91	    const lo = DEFAULT_POLICY[k] * POLICY_MIN_MUL;
    92	    const hi = DEFAULT_POLICY[k] * POLICY_MAX_MUL;
    93	    out[k] = Math.max(lo, Math.min(hi, base * style[k]));
    94	  }
    95	  return out;
    96	}
    97	
    98	/* ---------------- personal nameplates (data-driven, Phase 54) ---------------- */
    99	
   100	/** The player identity space: 8 attributes + 5 personal appetites. The
   101	 * scale lets variances be compared across dims (attrs span 1.0, style
   102	 * multipliers span STYLE_MAX−STYLE_MIN) — exported for the player center's
   103	 * data-driven axes (Phase 56). */
   104	export interface PlayerDim {
   105	  key: string;
   106	  kind: 'attr' | 'style';
   107	  scale: number;
   108	}
   109	export const PLAYER_DIMS: PlayerDim[] = [
   110	  ...ATTR_KEYS.map((key) => ({ key, kind: 'attr' as const, scale: 1 })),
   130	  runScore: { hi: 'Ghost runner' },
   131	  wallPassW: { hi: 'One-two brain' },
   132	};
   133	
   134	export interface PlayerDimStats {
   135	  mean: number[];
   136	  std: number[];
   137	}
   138	
   139	export function playerVector(attrs: PlayerAttributes, style: PlayerStyle): number[] {
   140	  return PLAYER_DIMS.map((d) =>
   141	    d.kind === 'attr' ? attrs[d.key as keyof PlayerAttributes] : style[d.key as PlayerStyleKey]);
   142	}
   143	
   144	/** Population stats over every player in the league (16 clubs × 6). */
   145	export function playerDimStats(vectors: number[][]): PlayerDimStats {
   146	  const n = Math.max(vectors.length, 1);
   147	  const mean = PLAYER_DIMS.map((_, i) => vectors.reduce((a, v) => a + v[i], 0) / n);
   148	  const std = PLAYER_DIMS.map((_, i) =>
   149	    Math.sqrt(vectors.reduce((a, v) => a + (v[i] - mean[i]) ** 2, 0) / n));
   150	  return { mean, std };
   151	}
   152	
   153	/** Up to 2 fragments where this player z-deviates ≥ minZ from the current
   154	 * population; an unremarkable player wears NO plate (being someone is
   155	 * earned — there is no 'Balanced' participation badge for people). */
   156	export function playerNameplate(vec: number[], stats: PlayerDimStats, minZ = 1.25): string[] {
   157	  const cands: Array<{ word: string; z: number }> = [];
   158	  for (let i = 0; i < PLAYER_DIMS.length; i++) {
   159	    // Attrs span 0..1, style mults 0.6..1.5 — the std floor keeps a
   160	    // near-uniform population from minting giant z-scores out of noise.
   161	    const floor = PLAYER_DIMS[i].kind === 'attr' ? 0.02 : 0.018;
   162	    const z = (vec[i] - stats.mean[i]) / Math.max(stats.std[i], floor);
   163	    const vocab = PLAYER_VOCAB[PLAYER_DIMS[i].key];
   164	    const word = z > 0 ? vocab?.hi : vocab?.lo;
   165	    if (word && Math.abs(z) >= minZ) cands.push({ word, z: Math.abs(z) });
   166	  }
   167	  cands.sort((a, b) => b.z - a.z || a.word.localeCompare(b.word));
   168	  const out: string[] = [];
   169	  for (const c of cands) {
   170	    if (!out.includes(c.word)) out.push(c.word);
   171	    if (out.length === 2) break;
   172	  }
   173	  return out;
   174	}
   175	
   176	/**
   177	 * Style fit between two players (Phase 80, N6): 1 = identical appetites,
   178	 * 0 = maximally apart across the style box. Pure; the market's signal.
   179	 */
   180	export function styleFit(a: PlayerStyle, b: PlayerStyle): number {
   181	  let d = 0;
   182	  for (const k of PLAYER_STYLE_KEYS) d += Math.abs(a[k] - b[k]);
   183	  return 1 - d / (PLAYER_STYLE_KEYS.length * (STYLE_MAX - STYLE_MIN));
   184	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/evolution/policyGenome.ts | sed -n '1,95p' && nl -ba src/sim/types.ts | sed -n '125,210p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { clamp } from '../utils/math';
     2	import type { Rng } from '../utils/rng';
     3	import { DEFAULT_POLICY, type PolicyParams } from '../sim/types';
     4	
     5	/**
     6	 * Phase 42 — the emergence pivot's step 3. The ~35 PolicyParams weights the
     7	 * PlayerBrain scores with were a SHARED, hand-tuned constant (DEFAULT_POLICY):
     8	 * every team decided to play the same way and the 14 tactical genes only
     9	 * modulated it, so decision STYLE could never truly diverge. This releases the
    10	 * ATTACKING (42), DEFENSIVE (43) and BUILD-UP (44) style subsets to per-franchise
    11	 * evolution — bounded around each default so a club keeps basic competence
    12	 * (never stops shooting, passing, or defending) while its style (direct vs
    13	 * patient, shoot-happy vs build-up, dribble vs pass, crosses vs through-balls;
    14	 * press vs sit, intercept vs tackle, hoof vs play-out) EMERGES from selection.
    15	 * UNBIASED: no archetypes are prescribed; evolution finds them. The other ~26
    16	 * weights stay at DEFAULT_POLICY — competence scaffolding, not style.
    17	 */
    18	export const POLICY_GENE_KEYS = [
    19	  // Attacking style (Phase 42): how a team decides to create.
    20	  'shootBase', 'dribbleBase', 'passFwdBase', 'passBackPen',
    21	  'throughBase', 'crossBase', 'loftBase', 'longShotW', 'runScore',
    22	  // Defensive style (Phase 43): press/chase vs sit, intercept vs tackle, hoof
    23	  // vs play-out — the out-of-possession identity, also earned by selection.
    24	  'chaseBase', 'markBase', 'interceptScore', 'clearBase', 'clearPressureW',
    25	  // Build-up style (Phase 44): patient short-passing + outlet-seeking + support
    26	  // shape vs direct — how a team plays OUT, also earned by selection.
    27	  'passBase', 'passLaneW', 'passOpenW', 'passOutletMul', 'supportBase',
    28	  // Combo style (Phase 45): the 套路 trigger appetites — 2过1 / third man /
    29	  // 套边. Born at 1.0 (the Phase-34 constants); combo-heavy vs combo-averse
    30	  // is earned by selection.
    31	  'wallPassW', 'thirdManW', 'overlapW',
    32	] as const satisfies readonly (keyof PolicyParams)[];
    33	export type PolicyGeneKey = (typeof POLICY_GENE_KEYS)[number];
    34	export type PolicyGenes = Record<PolicyGeneKey, number>;
    35	
    36	/** Each gene lives in [MIN_MUL, MAX_MUL] × its DEFAULT — floored so a team at
    37	 * the low end still does the thing (just reluctantly), capped so it can't run
    38	 * away. Real style room without breaking watchable football. */
    39	const MIN_MUL = 0.5;
    40	const MAX_MUL = 1.7;
    41	const boundsFor = (k: PolicyGeneKey): readonly [number, number] => {
    42	  const d = DEFAULT_POLICY[k];
    43	  return [d * MIN_MUL, d * MAX_MUL];
    44	};
    45	
    46	/** Every franchise is born at the hand-tuned DEFAULT and diverges from there —
    47	 * so generation 0 is balanced and any style is EARNED by evolution, not seeded. */
    48	export function defaultPolicyGenes(): PolicyGenes {
    49	  const p = {} as PolicyGenes;
    50	  for (const k of POLICY_GENE_KEYS) p[k] = DEFAULT_POLICY[k];
    51	  return p;
    52	}
    53	
    54	export interface PolicyMutateOptions {
    55	  /** Probability each gene mutates. */
    56	  rate?: number;
    57	  /** Gaussian step as a fraction of the gene's full range. */
    58	  scale?: number;
    59	}
    60	
    61	export function mutatePolicyGenes(p: PolicyGenes, rng: Rng, opts: PolicyMutateOptions = {}): PolicyGenes {
    62	  const rate = opts.rate ?? 0.4;
    63	  const scale = opts.scale ?? 0.12;
    64	  const out = {} as PolicyGenes;
    65	  for (const k of POLICY_GENE_KEYS) {
    66	    const [lo, hi] = boundsFor(k);
    67	    let v = p[k];
    68	    if (rng.chance(rate)) v += rng.gaussian() * (hi - lo) * scale;
    69	    out[k] = clamp(v, lo, hi);
    70	  }
    71	  return out;
    72	}
    73	
    74	/** Gene-wise crossover: each style weight comes from parent A, parent B, or a
    75	 * blend — a reborn club's philosophy is a mix of its two academies'. */
    76	export function crossoverPolicyGenes(a: PolicyGenes, b: PolicyGenes, rng: Rng): PolicyGenes {
    77	  const out = {} as PolicyGenes;
    78	  for (const k of POLICY_GENE_KEYS) {
    79	    const r = rng.next();
    80	    out[k] = r < 0.4 ? a[k] : r < 0.8 ? b[k] : (a[k] + b[k]) / 2;
    81	  }
    82	  return out;
    83	}
    84	
    85	/** Cross-franchise style spread (population std dev per gene) — the emergence
    86	 * probe reads this to see whether distinct styles evolved vs all staying put. */
    87	export function policyGeneStd(pop: PolicyGenes[]): Record<PolicyGeneKey, number> {
    88	  const out = {} as Record<PolicyGeneKey, number>;
    89	  const n = Math.max(pop.length, 1);
    90	  for (const k of POLICY_GENE_KEYS) {
    91	    const mean = pop.reduce((s, p) => s + p[k], 0) / n;
    92	    const varc = pop.reduce((s, p) => s + (p[k] - mean) ** 2, 0) / n;
    93	    out[k] = Math.sqrt(varc);
    94	  }
    95	  return out;
   125	/**
   126	 * Utility-policy weights (Phase 18): the hand-tuned constants of the
   127	 * PlayerBrain scorers, exposed as data so a "wildcard" team can carry a
   128	 * LEARNED policy. DEFAULT_POLICY holds the exact literals the brain always
   129	 * used — a team without an explicit policy is bit-identical to before.
   130	 */
   131	export interface PolicyParams {
   132	  shootBase: number;
   133	  shootGene: number;
   134	  shootModeMul: number;
   135	  shootPressurePen: number;
   136	  passBase: number;
   137	  passLaneW: number;
   138	  passOpenW: number;
   139	  passFwdBase: number;
   140	  passFwdRisk: number;
   141	  passBackPen: number;
   142	  passOutletMul: number;
   143	  dribbleBase: number;
   144	  dribbleSpaceW: number;
   145	  dribbleGeneBase: number;
   146	  dribbleGeneW: number;
   147	  dribblePressurePen: number;
   148	  clearBase: number;
   149	  clearPressureW: number;
   150	  supportBase: number;
   151	  supportProxW: number;
   152	  formationBase: number;
   153	  chaseBase: number;
   154	  markBase: number;
   155	  interceptScore: number;
   156	  /** Off-ball attacking run priority (assigned runners, Phase 19). */
   157	  runScore: number;
   158	  /** Through-ball scoring: base + open-lane and behind-the-line weights. */
   159	  throughBase: number;
   160	  throughOpenW: number;
   161	  throughBehindW: number;
   162	  /** Cross scoring (Phase 28): base + weight on the best box target. */
   163	  crossBase: number;
   164	  crossBoxW: number;
   165	  /** Lofted switch scoring: base + weight on the receiver's open space. */
   166	  loftBase: number;
   167	  loftOpenW: number;
   168	  /** Long-range shot appetite bonus (16–30m, scaled by shootBias). */
   169	  longShotW: number;
   170	  /** Combo appetites (Phase 45): multipliers on the 套路 trigger gates —
   171	   * 2过1 license / third-man bounce bonus / 套边 overlap license. */
   172	  wallPassW: number;
   173	  thirdManW: number;
   174	  overlapW: number;
   175	}
   176	
   177	export const DEFAULT_POLICY: PolicyParams = {
   178	  shootBase: 1.9,
   179	  shootGene: 2.2,
   180	  shootModeMul: 1.2,
   181	  shootPressurePen: 0.25,
   182	  passBase: 0.2,
   183	  passLaneW: 0.3,
   184	  passOpenW: 0.2,
   185	  passFwdBase: 0.35,
   186	  passFwdRisk: 0.75,
   187	  passBackPen: 0.25,
   188	  passOutletMul: 1.15,
   189	  dribbleBase: 0.28,
   190	  dribbleSpaceW: 0.55,
   191	  dribbleGeneBase: 0.45,
   192	  dribbleGeneW: 1.0,
   193	  dribblePressurePen: 0.35,
   194	  clearBase: 0.12,
   195	  clearPressureW: 0.55,
   196	  supportBase: 0.3,
   197	  supportProxW: 0.35,
   198	  formationBase: 0.45,
   199	  chaseBase: 0.85,
   200	  markBase: 0.62,
   201	  interceptScore: 0.95,
   202	  runScore: 0.95,
   203	  throughBase: 0.22,
   204	  throughOpenW: 0.35,
   205	  throughBehindW: 0.52,
   206	  crossBase: 0.26,
   207	  crossBoxW: 0.5,
   208	  loftBase: 0.14,
   209	  loftOpenW: 0.38,
   210	  // 0.38 -> 0.55 in Phase 30.4: set defences (formations + zonal) park the

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/Team.ts | sed -n '25,60p;140,190p' && nl -ba src/sim/Match.ts | sed -n '285,305p;380,435p' && nl -ba src/sim/constants.ts | sed -n '225,242p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
    25	  policy: PolicyParams;
    26	  used: boolean;
    27	}
    28	
    29	export class Team {
    30	  readonly side: Side;
    31	  /** +1 attacks toward +x, -1 toward -x. */
    32	  readonly attackDir: 1 | -1;
    33	  readonly info: TeamInfo;
    34	  readonly players: Player[];
    35	  /** Utility-policy weights the brains score with (learned for wildcards). */
    36	  readonly policy: PolicyParams;
    37	  /** Per-player policy resolved by index — `rolePolicies[i]`, else `policy`.
    38	   * Elements are swapped when a substitute brings his own appetites on. */
    39	  readonly policies: PolicyParams[];
    40	  /** The bench (Phase 61): roster rows past the starting six. May be empty
    41	   * (ad-hoc TeamInfos, older tests) — then no substitutions ever happen. */
    42	  readonly bench: BenchEntry[];
    43	  /** Substitutions made (SUBS_MAX caps them; no re-entry). */
    44	  subsUsed = 0;
    45	  /** Tactical identity (Phase 30): formations + marking scheme, resolved once. */
    46	  readonly style: TeamStyle;
    47	
    48	  /** Morale × sensitivity in [-1, 1] (Phase 111); 0 = the neutral game. */
    49	  readonly confidence: number;
    50	
    51	  mode: TeamMode = 'ResetShape';
    52	  modeTime = 0;
    53	  brainTimer = 0;
    54	
    55	  /** Player indices currently assigned to chase/press the ball. */
    56	  chasers = new Set<number>();
    57	  /** Marking assignments: our player index -> opponent player index. */
    58	  marks = new Map<number, number>();
    59	  /** Player indices assigned to make attacking runs in behind (in possession). */
    60	  runners = new Set<number>();
   140	
   141	  // Goal centers never move — cached so per-frame callers (marking, keeper
   142	  // positioning) don't allocate. Shared instances: callers must not mutate.
   143	  private readonly ownGoalPos: V2;
   144	  private readonly oppGoalPos: V2;
   145	
   146	  constructor(side: Side, info: TeamInfo) {
   147	    this.side = side;
   148	    this.attackDir = side === 0 ? 1 : -1;
   149	    this.info = info;
   150	    // CONFIDENCE (Phase 111): morale × the moraleSensitivity gene, frozen
   151	    // for the match. Positive = riding a run (sharper passing/finishing),
   152	    // negative = a slump fraying the same. Neutral (0) for ad-hoc teams,
   153	    // probes and steady-pro genomes — the whole channel prices to zero.
   154	    this.confidence =
   155	      ((info.morale ?? 0.5) - 0.5) * 2 * (info.genome.moraleSensitivity ?? 0.5);
   156	    // Explicit policies are merged over the defaults so a vector trained
   157	    // before new weights existed (Phase 28 added five) stays usable — the
   158	    // missing keys read as the hand-tuned constants. Teams WITHOUT a policy
   159	    // keep the DEFAULT_POLICY object itself (bit-identity discipline).
   160	    this.policy = info.policy ? { ...DEFAULT_POLICY, ...info.policy } : DEFAULT_POLICY;
   161	    this.style = info.style ?? deriveTeamStyle(info.genome);
   162	    // Match-day order (Phase 62): lineup[slot] = the roster row playing that
   163	    // slot (bans covered by bench bodies); missing = the roster order itself.
   164	    const lineup = info.lineup ?? info.squad.map((_, i) => i);
   165	    this.policies = ROLES.map((_, i) => {
   166	      const rp = info.rolePolicies?.[lineup[i] ?? i];
   167	      return rp ? { ...DEFAULT_POLICY, ...rp } : this.policy;
   168	    });
   169	    this.players = ROLES.map((role, i) => {
   170	      const ri = lineup[i] ?? i;
   171	      const p = new Player(side, i, role, info.playerNames[ri] ?? role, info.squad[ri]);
   172	      p.rosterIdx = ri; // stats/careers follow the MAN, not the slot
   173	      if (info.ages) p.age = info.ages[ri];
   174	      return p;
   175	    });
   176	    // The bench (Phase 61): whatever the roster carries past the XI.
   177	    this.bench = [];
   178	    for (const ri of lineup.slice(ROLES.length)) {
   179	      const rp = info.rolePolicies?.[ri];
   180	      this.bench.push({
   181	        rosterIdx: ri,
   182	        role: BENCH_ROLES[ri - ROLES.length] ?? 'MF',
   183	        name: info.playerNames[ri] ?? 'SUB',
   184	        attrs: info.squad[ri],
   185	        age: info.ages?.[ri],
   186	        policy: rp ? { ...DEFAULT_POLICY, ...rp } : this.policy,
   187	        used: false,
   188	      });
   189	    }
   190	    // The captain (Phase 39): the oldest cool head — age·technique. He
   285	    // stay empty unless their man comes on. Starters are appearances.
   286	    this.playerStats = Array.from({ length: ROSTER_SIZE * 2 }, () => emptyPlayerStats());
   287	    for (const p of this.allPlayers) this.stat(p.gid).apps = 1;
   288	    this.rosterNames = Array.from({ length: ROSTER_SIZE * 2 }, (_, ri) => {
   289	      const side = ri < ROSTER_SIZE ? 0 : 1;
   290	      const info = side === 0 ? cfg.teamA : cfg.teamB;
   291	      return info.playerNames[ri % ROSTER_SIZE] ?? '?';
   292	    });
   293	    // Stagger decision ticks deterministically (symmetric across the teams)
   294	    // so all 12 players don't think in the same frame.
   295	    this.allPlayers.forEach((p) => (p.decisionTimer = ((p.index % TEAM_SIZE) + 1) * (AI_INTERVAL / TEAM_SIZE)));
   296	    this.setupKickoff(0);
   297	    if (this.derby) this.pushEvent('info', -1, '🔥 Derby! Old rivals meet again');
   298	  }
   299	
   300	  /**
   301	   * Display minute: sim time scaled onto a 90' clock, held at 45/90 during
   302	   * stoppage (Phase 28.1 — the first half used to tick into "46', 47'" while
   303	   * its added time played out, which read as the second half starting early).
   304	   * The second half's clock restarts from 45' regardless of how much
   305	   * stoppage the first half ran.
   380	    if (this.phase === 'fulltime') return;
   381	
   382	    // ---- playing or restart (a restart is live: clock runs, players move) ----
   383	    this.simTime += dt;
   384	
   385	    for (const team of this.teams) {
   386	      team.brainTimer -= dt;
   387	      team.modeTime += dt;
   388	      if (team.brainTimer <= 0) {
   389	        // Game-state mentality (Phase 35): the gene view every brain and
   390	        // mechanic reads is recomputed here — pure fn of score + clock +
   391	        // (Phase 66) the coach's tinkerBias, which scales how HARD he
   392	        // responds. Read from the RAW genome: personality isn't bent by
   393	        // the underdog shift.
   394	        const diff = this.score[team.side] - this.score[1 - team.side];
   395	        team.mentality = mentalityOf(diff, this.minute(), team.info.genome.tinkerBias ?? 0.5);
   396	        team.effGenome = applyMentality(team.baseGenome, team.mentality);
   397	        // The visible switches earn ONE feed line each (failure mode 7) —
   398	        // the COACH's calls since Phase 66 (N3). A stoic (tinker→0) never
   399	        // crosses 0.8 at all: his silence is the personality showing.
   400	        const coach = team.info.coachName;
   401	        if (team.mentality.urgency > 0.8 && !team.surgeAnnounced) {
   402	          team.surgeAnnounced = true;
   403	          this.pushEvent('info', team.side, coach
   404	            ? `⚡ ${coach} throws everyone forward!`
   405	            : `⚡ ${team.info.name} throw everyone forward!`);
   406	        }
   407	        if (team.mentality.holding > 0.8 && !team.shutdownAnnounced) {
   408	          team.shutdownAnnounced = true;
   409	          this.pushEvent('info', team.side, coach
   410	            ? `🧊 ${coach} shuts up shop`
   411	            : `🧊 ${team.info.name} shut up shop`);
   412	        }
   413	        updateTeamBrain(team, this);
   414	        team.brainTimer = TEAM_AI_INTERVAL;
   415	      }
   416	    }
   417	
   418	    // FAIRNESS: within a frame, later-iterated players act on fresher state
   419	    // (they see earlier kicks and reactions). Measured effect: the team
   420	    // iterated second converted ~10pp more of its shots. Alternating the
   421	    // iteration direction every step cancels the asymmetry, deterministically.
   422	    const order = this.stepCount % 2 === 0 ? this.allPlayers : this.allPlayersReversed;
   423	    for (const p of order) {
   424	      if (p.sentOff) continue;
   425	      if (p.decisionTimer <= 0) {
   426	        decidePlayer(p, this);
   427	        p.decisionTimer = AI_INTERVAL;
   428	      }
   429	    }
   430	
   431	    for (const p of order) {
   432	      if (!p.sentOff) executeAction(p, this, dt);
   433	    }
   434	    for (const p of order) {
   435	      if (!p.sentOff) p.physicsStep(dt);
   225	export const TOUCH_RECOLLECT_PER_PUSH = 0.04;
   226	/** A keeper ahead is not open grass (Phase 46): any roll that reaches him
   227	 * is DEAD (GK_CONTROL_MAX_SPEED 23 vs outfield 14, plus hands in the box),
   228	 * and he covers ~GK 6.4 m/s × the ~0.8s loose window while a knock is
   229	 * un-regatherable. The carry cone prices him at that envelope upfield of
   230	 * his body — the substrate fix for 趟球太大送门将 (breakaway probe:
   231	 * keeper-collects stuck at 8-9% even with maxed technique). */
   232	export const GK_RUSH_ENVELOPE = 5;
   233	
   234	/** How often each player re-evaluates its utility scores (staggered). */
   235	export const AI_INTERVAL = 0.15;
   236	/** How often each TeamBrain re-picks a tactical mode / assignments. */
   237	export const TEAM_AI_INTERVAL = 0.4;
   238	
   239	export const SHOT_SPEED = 27;
   240	/** Minimum distance between player centers (hard separation). */
   241	export const PLAYER_MIN_DIST = 1.05;

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/Player.ts | sed -n '1,170p;300,370p' && nl -ba src/ai/actionExecutor.ts | sed -n '1,130p;185,250p;300,340p;450,475p;530,565p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { v2, type V2 } from '../utils/vec';
     2	import { STAMINA_DRAIN, STAMINA_RECOVERY } from './constants';
     3	import type { PlayerAttributes } from '../evolution/playerGenome';
     4	import { traitsOf, type Trait } from '../evolution/traits';
     5	import { TEAM_SIZE, type ActionState, type Role, type Side } from './types';
     6	
     7	/** Physical top speed by role (m/s) before pace/stamina scaling. */
     8	const BASE_SPEED: Record<Role, number> = { GK: 6.4, DF: 7.0, MF: 7.3, WG: 7.9, ST: 7.7 };
     9	const ACCEL = 14; // m/s^2 toward desired velocity
    10	
    11	/**
    12	 * Body turn rate (rad/s), Phase 27: heading sweeps toward the movement
    13	 * direction instead of snapping to it, so a 180° cut takes ~0.48s of visible
    14	 * rotation. Velocity itself is already inertia-bound by ACCEL — this cap is
    15	 * what the eye (and the kick-orientation mechanics) read as "facing".
    16	 */
    17	export const TURN_RATE = 6.5;
    18	// cos/sin of the per-step turn cap, cached per dt (the sim always uses DT).
    19	let turnDt = -1;
    20	let turnCos = 1;
    21	let turnSin = 0;
    22	
    23	export class Player {
    24	  /** Index within team (0..5, slot order GK/DF/MF/WGL/WGR/ST). */
    25	  readonly index: number;
    26	  /** Global id across both teams (0..11), = side * TEAM_SIZE + index. */
    27	  readonly gid: number;
    28	  readonly side: Side;
    29	  readonly role: Role;
    30	  /**
    31	   * Roster row this body's stats land on (Phase 61): a starter's slot index,
    32	   * a substitute's bench row. The PLAYER OBJECT is the pitch slot — a sub
    33	   * swaps its identity in place (`becomeSub`), so every gid-keyed reference
    34	   * (marks, renderer models, action targets) survives the change.
    35	   */
    36	  rosterIdx: number;
    37	  /** Identity fields — mutated ONLY by becomeSub (the bench, Phase 61). */
    38	  name: string;
    39	  /** Attribute genes (squad DNA) — pace/technique/finishing/defending/reflexes. */
    40	  attrs: PlayerAttributes;
    41	
    42	  pos = v2();
    43	  vel = v2();
    44	  heading = v2(1, 0);
    45	  /** Set every frame by the action executor; physics chases it. */
    46	  desiredVel = v2();
    47	  /**
    48	   * When set (by the executor, per frame), heading turns toward this point
    49	   * instead of the movement direction — keepers backpedal FACING the play
    50	   * (27.5). Holds a live reference (e.g. ball.pos); cleared each frame.
    51	   */
    52	  faceTarget: V2 | null = null;
    53	
    54	  stamina = 1;
    55	  staminaSpent = 0;
    56	  distance = 0;
    57	
    58	  action: ActionState = { type: 'HoldPosition', scores: [] };
    59	  decisionTimer = 0;
    60	  kickCooldown = 0;
    61	  tackleCooldown = 0;
    62	  /**
    63	   * Recovery stun (Phase 27): a dispossessed carrier stumbles and a beaten
    64	   * lunger picks themself up — movement is heavily damped while it runs, and
    65	   * a stunned player can't control a loose ball or tackle.
    66	   */
    67	  stunTimer = 0;
    68	  /**
    69	   * Keeper hold (Phase 27.2): after claiming the ball a keeper scoops it up
    70	   * and holds it briefly — untackleable, ball carried in the hands — before
    71	   * distributing. Never set for restart first touches (goal kicks stay quick).
    72	   */
    73	  gkHoldTimer = 0;
    74	  /**
    75	   * Discrete touches (Phase 36): time until this carrier may PUSH the ball
    76	   * again. Set at capture so the first decision happens ON the ball (the
    77	   * settle touch and the pass game keep their timing); a decision that
    78	   * keeps Dribble releases the next push.
    79	   */
    80	  touchTimer = 0;
    81	  /** Display-only: renderers play a lunge animation while this runs. */
    82	  tackleAnimTimer = 0;
    83	  /** Display-only: renderers play a keeper dive while this runs (27.4). */
    84	  saveAnimTimer = 0;
    85	  /** Display-only: renderers play a header jump while this runs (Phase 28). */
    86	  headerAnimTimer = 0;
    87	  /**
    88	   * Keeper distribution mode (Phase 28.3): set while holding the ball in the
    89	   * hands, cleared on the kick — a keeper who HELD the ball releases it
    90	   * deliberately (throw/pass/switch), never with a panic hoof.
    91	   */
    92	  gkDistributing = false;
    93	  /**
    94	   * Shape-wait budget spent (Phase 30.3): while distributing, the keeper
    95	   * re-arms the hold in small quanta until the outfielders settle into
    96	   * shape; this counts what's been spent so a parked team can't stall the
    97	   * match. Reset when a fresh hold starts.
    98	   */
    99	  gkShapeWait = 0;
   100	  /**
   101	   * One-touch window (Phase 31.9, 一脚出球): set at a PRESSURED reception —
   102	   * the receiver decides immediately, and a pass kicked while this runs is
   103	   * played first-time: extra aim noise, discounted by technique. Any kick
   104	   * consumes it; expiry means they took a settle touch after all.
   105	   */
   106	  firstTouchWindow = 0;
   107	  /**
   108	   * Marker reaction lag (Phase 31.9, the headed-game pass): while the mark
   109	   * SPRINTS near our goal, the marking stance target is frozen here and
   110	   * only re-read on the marker's reaction cadence (0.2–0.45s by defending)
   111	   * — frame-perfect shadowing had made the attacking header extinct.
   112	   */
   113	  markAnchor: V2 | null = null;
   114	  markAnchorAge = 0;
   115	  markAnchorIdx: number | null = null;
   116	  /**
   117	   * 2过1 burst license (Phase 34): granted when this player plays a short
   118	   * pass under pressure — for its ~1.1s he sprints past his marker and the
   119	   * return ball INTO him (from `partnerGid`) is scored as the wall pass,
   120	   * not the "handing it straight back" it would otherwise read as.
   121	   */
   122	  wallRun: { until: number; partnerGid: number } | null = null;
   123	  /**
   124	   * Containment hysteresis (Phase 101): whether this chaser is currently
   125	   * JOCKEYING the carrier. The phase-92 goal-side test was a razor-edge
   126	   * boolean — a chaser dancing on the −0.2 offset flipped between the
   127	   * standoff point and the ball 66-70 times/match (`hold-jitter.ts`), a
   128	   * brain-level whip the render reads as twitching. Enter containment only
   129	   * clearly goal-side, hold it until clearly not. Runtime-only state.
   130	   */
   131	  containing = false;
   132	
   133	  /**
   134	   * Slalom COMMITMENT (Phase 41.2, user report "带球转一大圈然后突然丢
   135	   * 球"): the side picked to beat the current blocker, held until the
   136	   * timestamp. Without it a defender shadowing the carrier on the goal
   137	   * axis flipped the perp sign every few ticks — the turn-rate cap
   138	   * integrated the flip-flop into a full pirouette at walking pace
   139	   * (momentum gone = no pace protection) until the tackle landed. A real
   140	   * dribbler picks a shoulder and goes.
   141	   */
   142	  slalomSide: 1 | -1 = 1;
   143	  slalomUntil = -1;
   144	
   145	  /** Age in seasons (Phase 26) — display only, set by Team from TeamInfo. */
   146	  age?: number;
   147	  /** Has a yellow card this match — a second booking is a red (Phase 25). */
   148	  booked = false;
   149	  /** Sent off: parked on the apron, excluded from every sim interaction. */
   150	  sentOff = false;
   151	  /** Injury state (Phase 118): a 'knock' plays on visibly slower; 'serious'
   152	   * comes off (the league ban rides MatchResult.injuries). Reset on sub. */
   153	  injured?: 'knock' | 'serious';
   154	
   155	  baseSpeed: number;
   156	  accel: number;
   157	  /** Traits (Phase 39) — derived from attrs+role, ≤2. Recomputed on becomeSub. */
   158	  traits: readonly Trait[];
   159	  /** Cached engine-trait drain factor (hot path — no includes() per step). */
   160	  staminaDrainMul: number;
   161	
   162	  constructor(side: Side, index: number, role: Role, name: string, attrs: PlayerAttributes) {
   163	    this.side = side;
   164	    this.index = index;
   165	    this.gid = side * TEAM_SIZE + index;
   166	    this.rosterIdx = index;
   167	    this.role = role;
   168	    this.name = name;
   169	    this.attrs = attrs;
   170	    // pace: ±12% top speed, ±10% acceleration around the role baseline.
   300	    if (turn) {
   301	      const hx = this.heading.x;
   302	      const hy = this.heading.y;
   303	      if (hx * wx + hy * wy >= turnCos) {
   304	        this.heading = { x: wx, y: wy };
   305	      } else {
   306	        const s = hx * wy - hy * wx >= 0 ? turnSin : -turnSin;
   307	        this.heading = { x: hx * turnCos - hy * s, y: hx * s + hy * turnCos };
   308	      }
   309	    }
   310	    this.distance += sp * dt;
   311	
   312	    // Stamina: quadratic drain above ~55% effort, slow recovery when jogging/idle.
   313	    // The engine trait (Phase 39) drains 10% slower — the motor runs all day.
   314	    const effort = sp / this.baseSpeed;
   315	    // The stamina ATTRIBUTE scales drain and recovery (Phase 47): neutral
   316	    // at the 0.4 backfill so the league's energy economy doesn't move —
   317	    // the motor is now a dimension evolution can spend on.
   318	    // Phase 58: drain/recovery repriced so the economy BINDS in-match
   319	    // (constants.ts has the story) — legs are a resource, not a gauge.
   320	    if (effort > 0.55) {
   321	      const drain =
   322	        STAMINA_DRAIN * effort * effort * dt * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
   323	      this.stamina = Math.max(0.05, this.stamina - drain);
   324	      this.staminaSpent += drain;
   325	    } else {
   326	      this.stamina = Math.min(1, this.stamina + STAMINA_RECOVERY * dt * (0.88 + this.attrs.stamina * 0.3));
   327	    }
   328	
   329	    this.kickCooldown = Math.max(0, this.kickCooldown - dt);
   330	    this.tackleCooldown = Math.max(0, this.tackleCooldown - dt);
   331	    this.touchTimer = Math.max(0, this.touchTimer - dt);
   332	    this.stunTimer = Math.max(0, this.stunTimer - dt);
   333	    this.gkHoldTimer = Math.max(0, this.gkHoldTimer - dt);
   334	    this.tackleAnimTimer = Math.max(0, this.tackleAnimTimer - dt);
   335	    this.saveAnimTimer = Math.max(0, this.saveAnimTimer - dt);
   336	    this.headerAnimTimer = Math.max(0, this.headerAnimTimer - dt);
   337	    this.firstTouchWindow = Math.max(0, this.firstTouchWindow - dt);
   338	    this.decisionTimer -= dt;
   339	  }
   340	
   341	  /**
   342	   * An instantaneous burst the movement drain never saw — a tackle lunge
   343	   * (Phase 58). Same per-player modifiers as the running drain, so engines
   344	   * and high-stamina players absorb bursts better too.
   345	   */
   346	  spendBurst(cost: number): void {
   347	    const drain = cost * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
   348	    this.stamina = Math.max(0.05, this.stamina - drain);
   349	    this.staminaSpent += drain;
   350	  }
   351	
   352	  resetForKickoff(pos: V2): void {
   353	    this.pos = pos;
   354	    this.vel = v2();
   355	    this.desiredVel = v2();
   356	    this.action = { type: 'MoveToFormationSpot', scores: [] };
   357	    this.kickCooldown = 0;
   358	    this.tackleCooldown = 0;
   359	    this.stunTimer = 0;
   360	    this.gkHoldTimer = 0;
   361	    this.gkDistributing = false;
   362	    this.gkShapeWait = 0;
   363	    this.tackleAnimTimer = 0;
   364	    this.saveAnimTimer = 0;
   365	    this.headerAnimTimer = 0;
   366	    this.firstTouchWindow = 0;
   367	    this.slalomUntil = -1;
   368	  }
   369	}
     1	import { clamp } from '../utils/math';
     2	import { add, dist, norm, scale, sub, v2, type V2 } from '../utils/vec';
     3	import { BOX_DEPTH, BOX_WIDTH, CONTROL_MAX_HEIGHT, CORNER_CLEARANCE, GOAL_WIDTH, HALF_L, HALF_W } from '../sim/constants';
     4	import type { Match } from '../sim/Match';
     5	import type { Player } from '../sim/Player';
     6	import type { Role } from '../sim/types';
     7	import {
     8	  cornerCrashSpots, cornerKeyZone, fkWallSlots, formationSpot, offsideLineLocalX, runTarget,
     9	  supportSpot,
    10	} from './formations';
    11	import { ballLanding, escapeCarry, interceptBall } from './perception';
    12	import { arrive, avoidOpponents, separation } from './steering';
    13	
    14	/**
    15	 * Turns the player's current (discrete) action into a desired velocity every
    16	 * frame. Dynamic targets — moving balls, moving opponents, sliding formation
    17	 * spots — are recomputed here each frame so actions never chase stale data.
    18	 */
    19	export function executeAction(p: Player, match: Match, dt: number): void {
    20	  const team = match.teams[p.side];
    21	  const opp = match.teams[1 - p.side];
    22	  const g = team.genome;
    23	  const ball = match.ball;
    24	  const hasBall = match.possessionSide === team.side;
    25	
    26	  // staminaConservation is a real trade-off: misers jog slower AND press with
    27	  // less sprint (weaker pressing, fresher legs late in the match).
    28	  const conserve = g.staminaConservation;
    29	  const jog = 0.78 - conserve * 0.25;
    30	  const sprint = 1 - conserve * 0.12;
    31	  let target: V2 | null = null;
    32	  let speedF = jog;
    33	  p.faceTarget = null; // per-frame; only keeper cases set it (backpedal, 27.5)
    34	  if (p.action.type !== 'MarkOpponent' && p.markAnchor) {
    35	    p.markAnchor = null; // a stale anchor must not survive an action change
    36	    p.markAnchorAge = 0;
    37	  }
    38	
    39	  switch (p.action.type) {
    40	    case 'MoveToFormationSpot':
    41	    case 'HoldPosition': {
    42	      target = formationSpot(p, team, ball, hasBall, opp);
    43	      // Hurry back if badly out of position. (A phase-106 "hurry when
    44	      // beaten" trigger was built and MEASURED OUT here: during walk-in
    45	      // breakaways the beaten men are 60-88% in MarkOpponent/ChaseBall —
    46	      // this branch owns only ~12-18% of their frames — and 24-gen warming
    47	      // totals didn't move. final15-anatomy.ts carries the evidence.)
    48	      if (dist(p.pos, target) > 14) speedF = 0.95 - conserve * 0.2;
    49	      // THE RETREAT SCHOOL (Phase 112, drop-and-recover): for 3s after
    50	      // losing the ball the spot-holders RUN home instead of jogging —
    51	      // getting the shape set before the counter launches IS the school
    52	      // (the 106 hurry trigger failed because it fired on "beaten", not
    53	      // on the transition; this fires on the loss clock, for the gene
    54	      // that pays for it). tp ≥ 0 is exactly today's speeds.
    55	      if (!hasBall && match.phase === 'playing') {
    56	        const tp = ((g.transitionPress ?? 0.5) - 0.5) * 2;
    57	        if (tp < 0 && match.simTime - opp.possessionGainedAt < 3.0) {
    58	          speedF = Math.max(speedF, jog + -tp * (0.95 - conserve * 0.2 - jog));
    59	        }
    60	      }
    61	      break;
    62	    }
    63	    case 'ChaseBall': {
    64	      // THE JOCKEY (Phase 87, the Van Dijk school): against a CARRIER, a
    65	      // jockeying team's chaser takes the carrier-goal line at standoff
    66	      // distance instead of diving at the ball. Positioning IS the
    67	      // mechanism: a body goal-side is exactly what kills the composed
    68	      // 1v1 (performShot checks it), and the overlap resolver + slalom
    69	      // make the contained carrier go AROUND — chase time, blunted drive.
    70	      const carrier = ball.owner;
    71	      const jockey = team.genome.jockeyBias ?? 0.5;
    72	      // Phase 92 (the A/B verdict): ONLY the goal-side man jockeys — a
    73	      // pursuer from behind detouring to the standoff point was a free
    74	      // escort downfield (the mispricing that made 0.9-jockey LOSE the
    75	      // head-to-head). Behind the carrier = chase the ball, old-style.
    76	      // Phase 101: with HYSTERESIS — the razor-edge −0.2 test flipped the
    77	      // target 66-70×/match for a chaser dancing on the boundary
    78	      // (hold-jitter.ts). Enter containment only clearly goal-side
    79	      // (gap > 0.6), hold it until clearly not (gap < 0.1).
    80	      const gap = carrier !== null
    81	        ? team.localX(carrier.pos.x) - team.localX(p.pos.x)
    82	        : -Infinity;
    83	      const goalSideOfCarrier = p.containing ? gap > 0.1 : gap > 0.6;
    84	      // Phase 92 second cut: standoff at TACKLE-RANGE EDGE (2.1m parked the
    85	      // contain man permanently outside the 1.15m challenge radius — the
    86	      // collapse could never convert), and NO jockeying in the danger zone:
    87	      // inside ~28m of the own goal, real defenders engage.
    88	      const dangerZone = carrier !== null && team.localX(carrier.pos.x) < -17;
    89	      if (carrier && carrier.side !== p.side && jockey > 0.25 && goalSideOfCarrier && !dangerZone) {
    90	        p.containing = true;
    91	        const toGoal = norm(sub(team.ownGoal(), carrier.pos));
    92	        const standoff = 0.9 + jockey * 0.5;
    93	        target = add(carrier.pos, scale(toGoal, standoff));
    94	        speedF = sprint;
    95	        break;
    96	      }
    97	      p.containing = false;
    98	      const sol = interceptBall(p, ball);
    99	      target = sol.point;
   100	      speedF = sprint;
   101	      break;
   102	    }
   103	    case 'ReceivePass':
   104	    case 'InterceptPass': {
   105	      // Attack the DESCENT, not the drop (Phase 63 — the 31.9 corner
   106	      // principle in open play): a lofted delivery is headable only in its
   107	      // last ~2.6m of flight, so the intercept solution parked the receiver
   108	      // ON the landing — where the ball arrives at his FEET, in the
   109	      // goal-side defenders' laps (probed: attacker headers 1-10% of
   110	      // crosses, 45% of deliveries eaten on the ground by the defence).
   111	      // While the delivery flies ABOVE control height, the intended
   112	      // receiver routes 2.5m upstream along the flight line and meets the
   113	      // band; once it drops low the normal intercept chase resumes.
   114	      if (
   115	        p.action.type === 'ReceivePass' &&
   116	        ball.owner === null &&
   117	        ball.z > CONTROL_MAX_HEIGHT
   118	      ) {
   119	        const { x: lx, y: ly } = ballLanding(ball);
   120	        const vl = Math.hypot(ball.vel.x, ball.vel.y) || 1;
   121	        target = { x: lx - (ball.vel.x / vl) * 2.5, y: ly - (ball.vel.y / vl) * 2.5 };
   122	      } else {
   123	        const sol = interceptBall(p, ball);
   124	        target = sol.point;
   125	      }
   126	      speedF = sprint;
   127	      break;
   128	    }
   129	    case 'MarkOpponent': {
   130	      const markIdx = p.action.targetIdx;
   185	        // line while y keeps sliding with the man, and the phase-71
   186	        // offside law flags whoever the ball is played to beyond the held
   187	        // line. Low trap (≤0.5) = today's tracking exactly. The price is
   188	        // physical, not scripted: a runner ONSIDE at the kick is clean
   189	        // through, and a libero (coverBias) below the line plays everyone
   190	        // onside. The carrier cannot be trapped (no offside on the ball)
   191	        // — the contain/jockey machinery owns him.
   192	        // The trap is sprung BEFORE the ball goes over the top (football
   193	        // law): once the ball is deep in our territory the line is beaten
   194	        // and EVERYONE tracks. The first build held unconditionally — deep
   195	        // runners stood unmarked in the box, trapBias railed to 0.08 under
   196	        // selection and one warming world hit 8.5 goals/match. Same -17
   197	        // danger-zone boundary as the jockey (Phase 92).
   198	        const trapHold = ((g.trapBias ?? 0.5) - 0.5) * 2;
   199	        const ballDeep = team.localX(ball.pos.x) < -17;
   200	        if (trapHold > 0 && !ballDeep && ball.owner && ball.owner.side !== p.side && ball.owner !== mark) {
   201	          const spot = formationSpot(p, team, ball, hasBall, opp);
   202	          if (team.localX(target.x) < team.localX(spot.x)) {
   203	            target = { x: target.x + (spot.x - target.x) * trapHold, y: target.y };
   204	          }
   205	        }
   206	        // Marker REACTION LAG (Phase 31.9, the headed-game pass): a marker
   207	        // tracking a SPRINTING mark near our goal re-reads the stance
   208	        // target on his reaction cadence (0.2–0.45s by defending), not
   209	        // per-frame. Frame-perfect shadowing meant the goal-side man met
   210	        // every delivery first (HEADER_RADIUS is 1.35m — a crash that
   211	        // earns more separation than that heads UNCONTESTED) and the
   212	        // attacking header had gone extinct at ~0.33 shots/match. A
   213	        // standing striker stays tight: he barely moves between refreshes.
   214	        const markSpeed = Math.hypot(mark.vel.x, mark.vel.y);
   215	        if (ball.owner !== mark && markSpeed > 4.5 && dist(mark.pos, team.ownGoal()) < 26) {
   216	          p.markAnchorAge += dt;
   217	          const lag = 0.45 - p.attrs.defending * 0.25;
   218	          if (!p.markAnchor || p.markAnchorIdx !== markIdx || p.markAnchorAge >= lag) {
   219	            p.markAnchor = { x: target.x, y: target.y };
   220	            p.markAnchorIdx = markIdx ?? null;
   221	            p.markAnchorAge = 0;
   222	          }
   223	          target = p.markAnchor;
   224	        } else {
   225	          p.markAnchor = null;
   226	          p.markAnchorAge = 0;
   227	        }
   228	        speedF = 0.85 + g.markingAggression * 0.15;
   229	      } else {
   230	        target = formationSpot(p, team, ball, hasBall, opp);
   231	      }
   232	      break;
   233	    }
   234	    case 'SupportBallCarrier': {
   235	      target = supportSpot(p, team, ball);
   236	      speedF = (team.mode === 'CounterAttack' ? 1 : 0.9) - conserve * 0.15;
   237	      break;
   238	    }
   239	    case 'MakeRun': {
   240	      // Attacking run in behind — a full sprint, recomputed each frame so
   241	      // the run bends with the defensive line. Corner setups (Phase 31)
   242	      // route the licensed bodies instead: crashers attack the ROUTINE's
   243	      // crash spots (primary/secondary/rebound by stable rank), the extra
   244	      // license (team.arriver) goes to the routine's key zone. In open
   245	      // play the arriver attacks the edge-of-box arc — the late body a
   246	      // byline cutback finds.
   247	      // 门将上前 (Phase 35): the licensed keeper attacks the penalty-spot
   248	      // area — an extra unmarked body the defense never accounted for.
   249	      if (p.role === 'GK' && team.keeperUp) {
   250	        target = v2(team.attackDir * (HALF_L - 9), clamp(p.pos.y * 0.2, -4, 4));
   300	          }
   301	        }
   302	        // The TIMED crash (Phase 31.9, the headed-game pass): during setup a
   303	        // crasher HOLDS 4.5m off his spot (still inside the taker's 7m wait
   304	        // gate) and only bursts through it as the taker steps up (corner
   305	        // minSetup is 2.0s). Pre-positioned crashers stood ON the landing
   306	        // waiting — a static box the set marker always won; the delivery
   307	        // aims at the routine's key zone, and the marker reaction lag above
   308	        // needs an actual sprint to fall behind. Separation is born here.
   309	        target = crash.burst ? meet : v2(meet.x - team.attackDir * 4.5, meet.y);
   310	      } else if (team.arriver === p.index) {
   311	        target =
   312	          crash && (crash.routine === 'short' || crash.routine === 'arcCutback')
   313	            ? cornerKeyZone(crash.routine, team.attackDir, crash.y)
   314	            : v2((HALF_L - 16) * team.attackDir, clamp(p.pos.y * 0.3, -7, 7));
   315	      } else if (team.overlapper === p.index && ball.owner && ball.owner.side === p.side) {
   316	        // 套边 (Phase 34): around the OUTSIDE of the wide carrier, hugging
   317	        // the touchline past him — the lane the release ball is led into.
   318	        const c = ball.owner;
   319	        target = v2(
   320	          clamp(c.pos.x + team.attackDir * 13, -HALF_L + 2, HALF_L - 2),
   321	          Math.sign(c.pos.y || 1) * (HALF_W - 2.5),
   322	        );
   323	      } else {
   324	        target = runTarget(p, team, opp.players);
   325	      }
   326	      speedF = sprint;
   327	      break;
   328	    }
   329	    case 'Dribble': {
   330	      target = dribbleTarget(p, match);
   331	      // Dribbling is slower than free running; close control (technique)
   332	      // lets a carrier keep more of their pace (Phase 27).
   333	      speedF = 0.84 + p.attrs.dribbling * 0.1;
   334	      break;
   335	    }
   336	    case 'Pass':
   337	    case 'LoftedPass':
   338	    case 'ThroughBall':
   339	    case 'Cross':
   340	    case 'Shoot':
   450	  // depth is LAYERED by role (29.1): one shared depth parked every attacker
   451	  // on the same flat strip, their markers interleaved on it, and the band
   452	  // read as a single blob — the striker toes the line, wingers and mids
   453	  // stagger behind like a real attacking shape.
   454	  const carrier = ball.owner;
   455	  if (target && carrier && carrier !== p && carrier.side === p.side && p.role !== 'GK') {
   456	    // (Phase 109 note: a lagged line-read for runners was built and
   457	    // MEASURED OUT here — with it the trap gene's offside yield DROPPED
   458	    // 1.68→1.38/match, because a stale read of a RISING line makes the
   459	    // runner hold conservatively. Frame-perfect onside discipline turned
   460	    // out not to block the trap at all — the passer's decision cadence is
   461	    // misjudgment enough. trap-ab.ts carries the numbers.)
   462	    const holdX =
   463	      offsideLineLocalX(team, opp.players, team.localX(ball.pos.x)) - HOLD_DEPTH[p.role];
   464	    if (team.localX(target.x) > holdX) target = { x: holdX * team.attackDir, y: target.y };
   465	  }
   466	
   467	  // Barred-box discipline (Phase 31.9, user report "门球时盯人球员往禁区里
   468	  // 挤,抽搐"): while a goal kick or a keeper hold bars this player from the
   469	  // opposing box, STEER to the box edge instead of into it. Match's hard
   470	  // clamp (the rule) still exists, but a target inside the box made steering
   471	  // fight it — drive in, get teleported out, every frame: the twitch. The
   472	  // steering target rides 0.4m outside the clamp line so it never triggers.
   473	  const restart = match.restart;
   474	  const barred =
   475	    (restart?.kind === 'goalKick' && restart.side !== p.side) ||
   530	}
   531	
   532	/** Onside hold depth below the line, by role (29.1) — layers the shape.
   533	 * Kept shallow: −2.6/−1.2 visibly staggered but cost too many arrivals. */
   534	const HOLD_DEPTH: Record<Role, number> = { GK: 0, DF: 3.0, MF: 1.8, WG: 0.8, ST: 0.4 };
   535	
   536	/** Dribble toward goal, bending away from the nearest defender ahead —
   537	 * or DOWN THE LINE toward the byline when wide and advanced (Phase 31,
   538	 * 下底): the same steering decideCarrier's wide-drive space check scored,
   539	 * so the legs go where the utility looked. */
   540	function dribbleTarget(p: Player, match: Match): V2 {
   541	  const team = match.teams[p.side];
   542	  const opp = match.teams[1 - p.side];
   543	  const localX = team.localX(p.pos.x);
   544	  // 脱压带球 (34.2): same predicate the scorer used — pressured, front door
   545	  // closed, outside the final third ⇒ carry it AWAY from the press. Never
   546	  // into the own box (the calm-reset family lives there). Same holding
   547	  // flag as the scorer (Phase 35) so the utility and the legs agree.
   548	  const esc = escapeCarry(p, team.attackDir, localX, opp.players, team.mentality.holding > 0.5);
   549	  if (esc) {
   550	    const t = add(p.pos, scale(esc.dir, 5));
   551	    const minLocal = -(HALF_L - BOX_DEPTH) + 1;
   552	    if (team.localX(t.x) < minLocal) t.x = minLocal * team.attackDir;
   553	    t.y = clamp(t.y, -HALF_W + 1.5, HALF_W - 1.5);
   554	    return t;
   555	  }
   556	  const wideDrive = Math.abs(p.pos.y) > 13 && localX > 20 && localX < HALF_L - 7;
   557	  const goal = wideDrive
   558	    ? v2((HALF_L - 8) * team.attackDir, Math.sign(p.pos.y) * (HALF_W - 12))
   559	    : team.oppGoal();
   560	  const toGoal = norm(sub(goal, p.pos));
   561	
   562	  // Find the most obstructive opponent within 6m ahead.
   563	  let block: Player | null = null;
   564	  let blockD = Infinity;
   565	  for (const o of opp.players) {

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/actionExecutor.ts | sed -n '536,620p' && nl -ba src/ai/steering.ts | sed -n '1,180p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   536	/** Dribble toward goal, bending away from the nearest defender ahead —
   537	 * or DOWN THE LINE toward the byline when wide and advanced (Phase 31,
   538	 * 下底): the same steering decideCarrier's wide-drive space check scored,
   539	 * so the legs go where the utility looked. */
   540	function dribbleTarget(p: Player, match: Match): V2 {
   541	  const team = match.teams[p.side];
   542	  const opp = match.teams[1 - p.side];
   543	  const localX = team.localX(p.pos.x);
   544	  // 脱压带球 (34.2): same predicate the scorer used — pressured, front door
   545	  // closed, outside the final third ⇒ carry it AWAY from the press. Never
   546	  // into the own box (the calm-reset family lives there). Same holding
   547	  // flag as the scorer (Phase 35) so the utility and the legs agree.
   548	  const esc = escapeCarry(p, team.attackDir, localX, opp.players, team.mentality.holding > 0.5);
   549	  if (esc) {
   550	    const t = add(p.pos, scale(esc.dir, 5));
   551	    const minLocal = -(HALF_L - BOX_DEPTH) + 1;
   552	    if (team.localX(t.x) < minLocal) t.x = minLocal * team.attackDir;
   553	    t.y = clamp(t.y, -HALF_W + 1.5, HALF_W - 1.5);
   554	    return t;
   555	  }
   556	  const wideDrive = Math.abs(p.pos.y) > 13 && localX > 20 && localX < HALF_L - 7;
   557	  const goal = wideDrive
   558	    ? v2((HALF_L - 8) * team.attackDir, Math.sign(p.pos.y) * (HALF_W - 12))
   559	    : team.oppGoal();
   560	  const toGoal = norm(sub(goal, p.pos));
   561	
   562	  // Find the most obstructive opponent within 6m ahead.
   563	  let block: Player | null = null;
   564	  let blockD = Infinity;
   565	  for (const o of opp.players) {
   566	    if (o.sentOff) continue;
   567	    const to = sub(o.pos, p.pos);
   568	    const ahead = to.x * toGoal.x + to.y * toGoal.y;
   569	    if (ahead > 0 && ahead < 6) {
   570	      const d = dist(o.pos, p.pos);
   571	      if (d < blockD) {
   572	        blockD = d;
   573	        block = o;
   574	      }
   575	    }
   576	  }
   577	
   578	  let dir = toGoal;
   579	  if (block) {
   580	    // Slalom: steer perpendicular, away from the blocker's side — and
   581	    // COMMIT to it (Phase 41.2, user report "带球转一大圈然后突然丢球"):
   582	    // a blocker shadowing the carrier right on the goal axis flipped the
   583	    // cross-product sign every few ticks, the steering flip-flopped ±68°,
   584	    // and the body turn-rate cap integrated that into a full pirouette at
   585	    // walking pace — momentum dead, no pace protection, tackle inevitable.
   586	    // A real dribbler picks a shoulder and goes: the side holds 0.6s, and
   587	    // a re-pick at expiry is HYSTERETIC — a shadow sitting ON the axis
   588	    // (|cross| small) keeps the committed shoulder (the first cut re-read
   589	    // the instantaneous sign at every expiry, which against a mirroring
   590	    // defender was a coin flip per 0.6s: the same pirouette, slower).
   591	    // Only a blocker decisively parked off-axis flips it — a real cut.
   592	    let side: 1 | -1;
   593	    if (match.simTime < p.slalomUntil) {
   594	      side = p.slalomSide;
   595	    } else {
   596	      const cross = (block.pos.x - p.pos.x) * toGoal.y - (block.pos.y - p.pos.y) * toGoal.x;
   597	      side = Math.abs(cross) > blockD * 0.3 ? (cross > 0 ? -1 : 1) : p.slalomSide;
   598	      p.slalomSide = side;
   599	      p.slalomUntil = match.simTime + 0.6;
   600	    }
   601	    const perp = v2(-toGoal.y * side, toGoal.x * side);
   602	    // Perp cap 1 → 0.72 (Phase 67 temper): with the 41.2 commitment the
   603	    // full-weight cut rounded engaged defenders so cleanly that penetration
   604	    // depth — not duel survival — ran the league ~+0.6 goals hot (the
   605	    // drive-protection knob measured SATURATED: 0.16→0.14 moved nothing).
   606	    // Capping the blend keeps the committed slalom but leaves the defender
   607	    // a play at close quarters.
   608	    const w = clamp(1 - blockD / 6, 0, 0.72);
   609	    dir = norm(add(scale(toGoal, 1 - w * 0.8), scale(perp, w)));
   610	  }
   611	
   612	  const t = add(p.pos, scale(dir, 6));
   613	  t.x = clamp(t.x, -HALF_L + 1.5, HALF_L - 1.5);
   614	  t.y = clamp(t.y, -HALF_W + 1.5, HALF_W - 1.5);
   615	  return t;
   616	}
   617	
   618	/** Keep goalkeeper targets inside a sane area in front of their own goal. */
   619	function clampToBox(pt: V2, attackDir: 1 | -1): V2 {
   620	  const gx = -attackDir * HALF_L; // own goal line x
     1	import { v2, type V2 } from '../utils/vec';
     2	import type { Player } from '../sim/Player';
     3	
     4	/** Steering behaviors: each returns a desired-velocity contribution. */
     5	
     6	/** Full-speed run at a target, decelerating inside `slowRadius` so players settle on spots. */
     7	export function arrive(p: Player, target: V2, speed: number, slowRadius = 2.5): V2 {
     8	  // Flat form of scale(norm(sub(target, p.pos)), s) — runs for every player
     9	  // every frame. dist() and norm's internal length share the same bits
    10	  // ((-a)² === a² in IEEE), so one sqrt serves both; results are unchanged.
    11	  const dx = target.x - p.pos.x;
    12	  const dy = target.y - p.pos.y;
    13	  const d = Math.sqrt(dx * dx + dy * dy);
    14	  if (d < 0.05) return v2();
    15	  const s = d < slowRadius ? speed * (d / slowRadius) : speed;
    16	  if (d < 1e-8) return v2();
    17	  return { x: (dx / d) * s, y: (dy / d) * s };
    18	}
    19	
    20	/**
    21	 * Push away from nearby players so nobody stacks. Applied to everyone every
    22	 * frame on top of their primary steering; hard overlap is also resolved in
    23	 * Match physics as a positional constraint.
    24	 */
    25	export function separation(p: Player, all: Player[], radius = 2.2, strength = 3.0): V2 {
    26	  // Flat form of add(out, scale(norm(sub(p.pos, o.pos)), k)) — runs for every
    27	  // player every frame and allocated ~4 vectors per close neighbor. dist and
    28	  // norm's internal length share the same bits ((-a)² === a² in IEEE), so one
    29	  // sqrt serves both; accumulation order is unchanged, results are identical.
    30	  let ox = 0;
    31	  let oy = 0;
    32	  for (const o of all) {
    33	    if (o === p || o.sentOff) continue;
    34	    const dx = p.pos.x - o.pos.x;
    35	    const dy = p.pos.y - o.pos.y;
    36	    const d = Math.sqrt(dx * dx + dy * dy);
    37	    if (d < radius && d > 1e-6) {
    38	      const k = strength * (1 - d / radius);
    39	      ox += (dx / d) * k;
    40	      oy += (dy / d) * k;
    41	    }
    42	  }
    43	  return { x: ox, y: oy };
    44	}
    45	
    46	/** Small sideways push around opponents directly in the movement path. */
    47	export function avoidOpponents(p: Player, desired: V2, opponents: Player[]): V2 {
    48	  // Flattened like separation. Math.hypot is kept exactly — it rounds
    49	  // differently than Math.sqrt(x²+y²), so replacing it would drift.
    50	  const dl = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
    51	  if (dl < 1e-8) return v2();
    52	  const dirX = desired.x / dl;
    53	  const dirY = desired.y / dl;
    54	  let ox = 0;
    55	  let oy = 0;
    56	  for (const o of opponents) {
    57	    if (o.sentOff) continue;
    58	    const tox = o.pos.x - p.pos.x;
    59	    const toy = o.pos.y - p.pos.y;
    60	    const ahead = tox * dirX + toy * dirY; // projection onto heading
    61	    if (ahead < 0.5 || ahead > 5) continue;
    62	    const lx = tox - dirX * ahead;
    63	    const ly = toy - dirY * ahead;
    64	    const ld = Math.hypot(lx, ly);
    65	    if (ld < 1.6) {
    66	      const side = lx * dirY - ly * dirX > 0 ? 1 : -1;
    67	      const k = 2.0 * (1 - ld / 1.6);
    68	      ox += -dirY * side * k;
    69	      oy += dirX * side * k;
    70	    }
    71	  }
    72	  return { x: ox, y: oy };
    73	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "git status --short && git diff -- src/evolution/playerGenome.ts src/sim/League.ts src/sim/types.ts docs/ROADMAP.md | sed -n '1,260p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
 M docs/ROADMAP.md
 M docs/VISION.md
 M src/evolution/playerGenome.ts
 M src/sim/League.ts
?? docs/cross-ai-audits/
diff --git a/docs/ROADMAP.md b/docs/ROADMAP.md
index a2f1895..b3e2bd2 100644
--- a/docs/ROADMAP.md
+++ b/docs/ROADMAP.md
@@ -3,6 +3,138 @@
 ## ⭐⭐⭐⭐ THE GOLD STANDARD IS [`VISION.md`](VISION.md) (2026-07-19) — measure every decision against it
 ## ⭐⭐⭐ THE MASTER PLAN IS NOW [`EVO-BLUEPRINT.md`](EVO-BLUEPRINT.md) (2026-07-14, user-ratified)
 
+> 🎯 **RESUME (2026-07-20, post-compact): TASK #8 甲 — sub-step 1 DONE (uncommitted).**
+> ✅ **POSITION-AWARE BUDGET landed** (`playerGenome.ts` `countsForBudget` + `squadTotal`;
+> `SQUAD_BUDGET` 40.5→35.5; `League.ts` fire-sale headroom + v32→v33 migration; SAVE_VERSION
+> 32→33). reflexes = keeper-only (8 outfielders freed); **finishing/defending free for the GK**
+> (dead — never shoots/tackles) → the keeper's budget base is its OWN. Cap dropped in lockstep
+> (71 counted slots × 0.5) so useful density stays 0.5. **VALIDATED: tsc clean · §2 BIT-IDENTICAL
+> @8-season gate · @25-season tracks OLD within noise (goals 3.30 vs 3.19, all else ≈identical) ·
+> cap binds 56% @25 · GK base differentiated (GK finishing 0.28 vs ST 0.56).** ⚠ NOT committed
+> (user hasn't asked); genome/save-ver change = user's 甲 call (confirmed).
+>
+> **→ NEXT = the OUTFIELD BASE (user 2026-07-20: "门将底座没必要大手笔…但场上踢的是真的影响,
+> 底座需要做的很好" = keep GK LIGHT ✓done, invest the real substrate work in the OUTFIELD).**
+> ⚠️ **Sub-step 2 (vision attr) FIRST CUT = "读数精度 on PASSING" — TRIED + REVERTED (honest-revert,
+> §2 hard gate).** Added `vision` (10th attr, budget 35.5→40.0) + wired it as a continuous
+> lane-read multiplier replacing the binary `playmaker` ×1.15. BOTH tunings FAILED §2: goals
+> +23% (lane+open) / +17% (lane-only, mean-centred), headers −25–34%, aerial route collapses.
+> **STRUCTURAL, not a tuning miss: passing→goals is CONVEX, so making the best passers sharper
+> inflates scoring even with a mean-preserving spread — a one-sided attacking buff.** Fully
+> reverted → tree bit-identical to sub-step-1 baseline again. **→ the fix (user's call, asked):
+> vision must be applied SYMMETRICALLY (gate the DEFENDER's interception/anticipation read too,
+> so attack↑ is balanced by defense↑ → §2-neutral), OR defense-read FIRST (likely §2-neutral-or-
+> better), OR defer vision & do `positioning`-live (sub-step 3) next.** Sub-step 3 = wire
+> `positioning` LIVE off-ball (today only a first-touch sub-term). De-dead-weight `strength`.
+> One sub-step, §2-gated, honest-revert. Fork B (distinct GK attr template) DEFERRED — chose light A.
+
+---
+⭐⭐⭐⭐⭐ **2026-07-20 SELF-DRIVE — density KEPT (user 留) + step-2 lever REVERTED→REFRAMED (⭐ NEWEST).**
+
+**Density verdict:** user play-tested → "观赏性我觉得没问题,可以go,你自走吧" = **KEEP**.
+PITCH_SCALE 0.70 + emergent-default are the CONFIRMED baseline now (see #1 above),
+not a candidate. Sequence unblocked.
+
+**Step-2 lever tried = RETIRE the in-possession width FLOOR (`formations.ts:266`,
+`widthMul` floor 1.0 → gene-driven 0.55..1.55). REVERTED (honest-revert, §2 hard
+gate).** Clean single-lever A/B vs HEAD (baselines captured):
+- ✅ **§4 diversity WIN** — `positioning-shape` WIDE−NARROW spreadY divergence
+  **1.2m → 2.1m (+75%)**; WIDE stays wide (6.0), NARROW gets genuinely narrow
+  (3.9). Width finally expresses across the `attackingWidth` gene.
+- ❌ **§2 watchability FAIL** — the SAME change congests the middle: `calibrate 8`
+  **goals 2.00→2.26 (+13%)**, shots +11%, **headers +24%** (10.5→13.0), fouls/cards
+  up, through-balls down; `positioning-shape` nn-dist tighter across the board;
+  `clump-vs-wide` gap **WIDENED 3.4×→5.4×** (CLUMP 3.48/WIDE 1.02 → 3.38/0.63).
+- ⭐ **DIAGNOSIS (the reframe):** the width floor is a genuine COMPENSATING bias —
+  but it compensates for **width-not-paying**, and that root cause is UNFIXED.
+  Retire the floor before width pays → the meta just slides NARROWER into the
+  中路乱抢 the user hates. **So step-2 (retire width biases) is BLOCKED on step-3
+  (QUALITY CLUSTER must make wide play connect/pay FIRST — attack the box, combos
+  reliable — THEN retire the floor and re-observe).** Queue RE-SEQUENCED: 3 → 2.
+- ⭐⭐ **ROOT CAUSE PINNED (2026-07-20 diagnostic probes, dense pitch):** WHY
+  width doesn't pay = **the final ball into the box finds too few attacking bodies
+  + a third of deliveries die in flight.** `cross-anatomy`: crosses convert ~5%
+  (NOT ≈0 — the clump-vs-wide extreme overstated it), but **46–54% of crosses are
+  `noAerial` = NOBODY contests them** (vs BUS 54%, atkHeader 25%→18% — the box is
+  under-crashed, worst vs a packed block). `cutback-anatomy`: cutback→goal 5.3%,
+  only 20% → shot, **35% die in flight (mostly intercepted)**, 39% of arrivals
+  lost. **→ The true upstream lever = OFF-BALL MOVEMENT INTO DANGEROUS SPACE
+  (crash the box on a delivery; proactive drop/arrive to receive) — the SAME root
+  as combo-reliability + check-to-ball (step-4). `supportSpot` is always AHEAD of
+  the ball & nobody attacks the 6-yd/penalty-spot on a wide ball.** This is the
+  next probe-first lever (gene-gated arrival, NOT a scripted run). cf. the earlier
+  obs8 pass-power revert — same lesson, combo bottleneck is upstream positioning.
+- ⭐⭐ **DESIGN + VISION UPDATED → "让球员/教练自己长眼睛" (gene-weighted SPACE-VALUE
+  field, two levels: player-local + coach-global). VISION §1 rewritten with the
+  user's words (内切/包抄/回撤 should EMERGE from ONE value field, not be hand-added).
+  Tasks re-cut (#2 player value field · #3 cut-inside via same logic on carry
+  direction · #5 width-floor deferred · #6 coach-global value field · #7 possession
+  contest+transition).**
+- ⭐⭐ **FIRST CUT of the value field REVERTED (honest-revert, 2nd this session) — but
+  a KEY DESIGN CORRECTION.** Rewrote `supportSpot` into a gene-weighted candidate
+  scorer (base + box-crash + drop candidates, scored by openness+receivability−clump
+  + gene/attr appetite). A/B: box-arrival did NOT emerge (`cross-anatomy` noAerial
+  46→50% / 54→59% — box got EMPTIER), §2 regressed (`calibrate` goals 2.00→2.42 +21%,
+  cutbacks 3.69→3.29, headers 10.5→7.8), width didn't rise (`scheme-matchup` W-v-Z
+  0.67→0.48). **LESSON: an openness-maximizing value field is the WRONG model for
+  BOX-ARRIVAL — the box is a LOW-openness contested zone, so the scorer AVOIDS it +
+  scatters supporters into empty pockets (→ emptier box, +turnovers, +goals).**
+  → **Split the design: (a) CHECK-TO-BALL / support / overload / drop = genuinely a
+  space-value(openness) field ✅; (b) BOX-ARRIVAL = delivery-ANTICIPATION, NOT
+  openness — must be COUPLED to an imminent wide delivery (extend `TeamBrain.
+  assignRunners` arriver → gene-scaled multi-body crash, TIMED like the corner
+  hold→burst), the cutback-arriver mechanism generalized.** Do box-arrival (a
+  delivery-coupled licensing change) as the next cut; keep the value-field for
+  check-to-ball separate.
+- ⭐⭐⭐ **CUT 2 (two-eye value field: space + BALL, per user "得知道空间在哪+球在哪")
+  ALSO REVERTED — same signature. → STOP hammering box-arrival-via-supportSpot;
+  RE-DIAGNOSE.** Both cuts: box did NOT fill (`cross-anatomy` noAerial 46→51%), §2
+  regressed (goals 2.00→2.41 +20%, **offsides 2.20→3.36 +50%**), width did NOT rise
+  (`scheme-matchup` W-v-Z 0.67→0.48). **THE OFFSIDES SPIKE is the tell: bodies DO try
+  to attack the box now but arrive OFFSIDE (uncoordinated with the delivery) → box
+  stays empty + structure disrupted → goals inflate via broken play.**
+- ⭐⭐⭐ **KEY under-weighted data + the REFRAME:** (1) a BALANCED team ALREADY fills
+  the box fine (`cross-anatomy` BAL: noAerial **26%**, atkHeader **33%**, goal/shot
+  16%) — box-arrival is NOT universally broken; it's CROSS-SPAM (early/excess crosses
+  outrun arrival) + the extreme WIDE genome being a bad archetype. (2) **WIDTH is a
+  LOW-EV mode vs EVERY defense (0.5–1.0) while central CARRY is HIGH-EV (2.2–3.2) —
+  because CROSSING IS INHERENTLY LOW-YIELD (cross→goal ~5%), which is REALISTIC (real
+  open-play crosses are ~1–2%).** So "make crosses out-score central carry" is the
+  WRONG goal — unrealistic. Real width's value = STRETCH the defense to OPEN the
+  center + let wide men CUT INSIDE into the high-EV central space (inverted winger),
+  NOT out-cross the middle. The unrealistic thing is CENTRAL CARRY being TOO strong
+  vs non-zonal defenses (zonal already bites it 58→14; man/default gets shredded; only
+  1–2/16 play zonal). **Two candidate realistic levers to STEER on: (A) CUT-INSIDE —
+  wide→cut into the opened center (taps the high-EV carry from wide, validates the
+  user's earlier instinct); (B) punish CENTRAL CARRY through congestion vs non-zonal
+  too (过一个还有另一个, so the clump stops being a free lunch). Box-arrival/crossing =
+  accept it as the low-yield supporting weapon it realistically is.** Awaiting user steer.
+- Tree left CLEAN at HEAD `ed62978` (only ledger/VISION docs changed). Baselines
+  saved this session: calibrate goals 2.00 / cutbacks 3.69 / compl 75%; posshape
+  WIDE 6.4 / NARROW 5.2; clump-vs-wide 3.48/1.02; cross noAerial 46/54%; cutback
+  20%→shot 5.3% goal; scheme-matchup W-v-Z 0.67 / W-v-M 1.02 / D-v-M 3.18 / D-v-Z 2.23.
+- ⭐⭐⭐ **VISION §1 EXTENDED to the full perception→value→action ENGINE (user ratified
+  "从底层做了一个足球引擎,方向是对的").** Eyes = 球+对手+队友+场地+**自身**(朝向/我的属性/
+  体能)+**动态·预判**(对手结构=提前观察+预判);space is DERIVED; inputs feed multi-dims
+  (space/threat/receive/goal); **eye-QUALITY = an attribute** (长眼睛本身分化). Honest cost
+  named: engine-first is 承重级/slower/"worse-before-better" → build incrementally, keep the
+  baseline revertible, each engine piece must BEAT §2 to ship.
+- ⭐⭐⭐ **ATTRIBUTE AUDIT (the engine's INPUTS; ATTR_KEYS ×9, budget SQUAD_BUDGET 40.5):
+  3 wasteful + 1 missing + 3 attr-blind.** DEAD/WEAK (eat budget, ~no effect): **`reflexes`
+  = DEAD for 8/9 (GK-only reads)**; **`positioning` = near-inert** (only a first-touch
+  sub-term; its docstring's off-ball IQ never shipped) — ironically the attr the SELF/off-ball
+  eye needs; **`strength` = one-trick** (aerialSense 0.30, near-decorative on the ground).
+  STRONG/live: pace · passing · dribbling · finishing · defending (stamina medium). ATTR-BLIND
+  mechanics (flat constant an attr could bite NOW): **`TURN_RATE` 6.5** (agility — everyone
+  turns identically; bites cut-inside/1v1), **`SHOT_SPEED` 27** (open-play shot power flat),
+  and **perception = PERFECT full-field for ALL — NO vision/awareness attr** (only the
+  `playmaker` trait) = the biggest gap + exactly the "eye-quality" the eyes model needs.
+  Gaps ranked: vision/awareness(1) · agility/turn(2) · positioning-made-live(3, fix-not-add) ·
+  composure(4) · raw aerial/jump(5) · shot-power(6) · tackle-vs-mark(7) · accel-vs-topspeed(8) ·
+  weak-foot(10, needs NEW mechanics). → **engine-input cleanup = reclaim reflexes budget +
+  add `vision` (eye-quality) + wire `positioning` live; genome change = save-ver bump +
+  fingerprint rebaseline = USER's architectural call.**
+
 ---
 ⭐⭐⭐⭐⭐ **2026-07-20 SESSION WRAP — GAP BASELINE + SELF-DRIVE QUEUE (⭐ RESUME HERE FIRST).**
 
@@ -15,11 +147,13 @@ pitch. Iterate render/feel with **`npm run dev`** (localhost:5173, fast HMR —
 CI wait); commit+push (personal acct `Quarkgluonmixture`, `gh auth switch`) when
 confirmed; trust the browser for pixels (headless flaky).
 
-⏳ **#1 OPEN DECISION — the density WATCHABILITY VERDICT (留/退).** Data says GO
-(scramble-born goals stay 4–7% to scale 0.70, cliff at 0.55; cutbacks +235% at
-gen-scale; goal inflation DOWN), but VISION §2 (does it LOOK good / not more
-乱抢 / tactics legible) is the USER'S eyes. Honest-revert if it fails visually —
-`PITCH_SCALE=1` restores the old pitch. **Get this verdict, then proceed.**
+✅ **#1 DECIDED 2026-07-20 — the density 相变 is a KEEP.** User play-tested and
+判决: "观赏性我觉得没问题,可以go,你自走吧" (watchability is fine → GO; self-drive).
+PITCH_SCALE 0.70 + emergent positioning DEFAULT are now the confirmed baseline,
+not a candidate. Data said GO (cutbacks +235%, scramble-born goals flat 4–7% to
+0.70, goal inflation DOWN) and the user's eyes agree on VISION §2. Sequence
+unblocked → now on **step 2: retire the compensating width hand-biases + re-run
+evo + OBSERVE diversity on the denser pitch.**
 
 **GAP BASELINE (code-verified inventory 2026-07-20). The substrate is FAR more
 complete than a "missing systems" story — most of real football's repertoire
diff --git a/src/evolution/playerGenome.ts b/src/evolution/playerGenome.ts
index 0660748..a56fd54 100644
--- a/src/evolution/playerGenome.ts
+++ b/src/evolution/playerGenome.ts
@@ -20,7 +20,10 @@ import type { Role } from '../sim/types';
  *   defending  tackle success + tighter marking
  *   strength   aerial power, shielding, the 50/50 shove
  *   stamina    fatigue drain & recovery rate
- *   reflexes   keeper save probability & reach (matters mostly for the GK)
+ *   reflexes   keeper save probability & reach — GK-ONLY. Only the keeper
+ *              (squad[0]) ever reads it; for the eight outfielders it is a
+ *              DEAD stat, so `squadTotal` no longer charges them for it
+ *              (Phase-120 engine-input cleanup — see squadTotal below).
  */
 export interface PlayerAttributes {
   pace: number;
@@ -135,12 +138,44 @@ export function crossoverSquads(a: PlayerAttributes[], b: PlayerAttributes[], rn
  * makes rotation a REAL trade-off: a deep bench is funded by shaving the
  * starting six, a star XI leaves its bench (and its fresh legs) thin.
  * Founding rosters roll ~0.4 density, so there is headroom before the cap bites.
+ *
+ * Phase-120 (POSITION-AWARE budget — 门将底座和外场不一样): the budget now
+ * charges each slot only for the attributes that actually FIRE for its
+ * position. `reflexes` is keeper-only (the 8 outfielders never read it), and
+ * symmetrically `finishing` + `defending` are DEAD for the keeper (a GK never
+ * shoots, and its 1v1s/claims resolve on reflexes, not tackles) — so the
+ * keeper's budget base is its OWN: reflexes + distribution + physique +
+ * positioning, not the outfield scoring/tackling stats. The cap dropped
+ * 40.5 → 35.5 IN LOCKSTEP (was 81 attr-slots × 0.5; now 8 outfield-reflexes +
+ * GK-finishing + GK-defending = 10 dead slots are free → 71 counted × 0.5 =
+ * 35.5) so USEFUL-attr density stays the tuned 0.5 and physics is unmoved.
+ * The point is not more quality — it closes the "dump" (evolution could park
+ * points in a dead stat to dodge the cap); now every point trades against a
+ * LIVE attribute, sharpening specialisation.
  */
-export const SQUAD_BUDGET = 40.5;
+export const SQUAD_BUDGET = 35.5;
+
+/**
+ * Which attributes cost budget for a slot (Phase-120 position-aware). The
+ * keeper (index 0 by invariant — Team.goalkeeper === players[0], ROSTER_ROLES
+ * [0] === 'GK', retirees replaced like-for-like at the same slot) pays for
+ * everything EXCEPT finishing/defending (dead for a GK); every outfielder pays
+ * for everything EXCEPT reflexes (keeper-only). The uncounted attrs still
+ * exist and still get scaled by enforceBudget — they just ride along free, so
+ * the counted total lands exactly on the cap.
+ */
+export function countsForBudget(k: AttrKey, isGK: boolean): boolean {
+  if (isGK) return k !== 'finishing' && k !== 'defending';
+  return k !== 'reflexes';
+}
 
 export function squadTotal(squad: PlayerAttributes[]): number {
   let t = 0;
-  for (const p of squad) for (const k of ATTR_KEYS) t += p[k];
+  for (let i = 0; i < squad.length; i++) {
+    const p = squad[i];
+    const isGK = i === 0;
+    for (const k of ATTR_KEYS) if (countsForBudget(k, isGK)) t += p[k];
+  }
   return t;
 }
 
diff --git a/src/sim/League.ts b/src/sim/League.ts
index 132c9d0..09f69a9 100644
--- a/src/sim/League.ts
+++ b/src/sim/League.ts
@@ -23,8 +23,8 @@ import {
 import { GENE_KEYS, mutateGenome, type GeneKey, type TacticalGenome } from '../evolution/genome';
 import { newgenName } from '../evolution/names';
 import {
-  ATTR_KEYS, SQUAD_BUDGET, SQUAD_ROLES, enforceBudget, newgenFromBloodline, randomPlayer,
-  randomSquad, squadSummary, squadTotal, type AttrKey,
+  ATTR_KEYS, SQUAD_BUDGET, SQUAD_ROLES, countsForBudget, enforceBudget, newgenFromBloodline,
+  randomPlayer, randomSquad, squadSummary, squadTotal, type AttrKey,
 } from '../evolution/playerGenome';
 import {
   FREE_AGENT_MAX_AGE, agentTotal, trimPool, type FreeAgent,
@@ -197,7 +197,7 @@ export interface SeasonRecord {
   }>;
 }
 
-export const SAVE_VERSION = 32;
+export const SAVE_VERSION = 33;
 const TEAMS_PER_DIVISION = 8;
 const TOTAL_TEAMS = 16;
 
@@ -907,7 +907,13 @@ export class League {
           // when he clearly beats the academy option (the newgen would be
           // ≈ the retiree's profile) AND fits under the budget without
           // taxing the rest of the squad. Otherwise: academy as always.
-          const retireeTotal = ATTR_KEYS.reduce((a, k) => a + f.squad[i][k], 0);
+          // Budget currency (Phase-120 position-aware): sum only the attrs that
+          // cost budget for THIS slot (GK: not finishing/defending; outfield:
+          // not reflexes) so headroom = cap − used + freed stays in squadTotal's
+          // units.
+          const retireeTotal = ATTR_KEYS.reduce(
+            (a, k) => (countsForBudget(k, i === 0) ? a + f.squad[i][k] : a), 0,

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n \"shotQuality\\(|performPass\\(|performThroughBall\\(|passing\" src/sim/Match.ts src/sim/mechanics.ts | head -n 120 && nl -ba src/sim/Match.ts | sed -n '570,680p' && nl -ba src/sim/mechanics.ts | sed -n '80,145p;500,575p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
src/sim/mechanics.ts:199:export function shotQuality(match: Match, p: Player): number {
src/sim/mechanics.ts:210: * 弧线直塞): when a defender pinches the passing lane, a technical passer
src/sim/mechanics.ts:245:  // FLAT whip (the passing-scaled first cut inverted the skill gradient:
src/sim/mechanics.ts:266:  const weightErr = match.rng.gaussian() * Math.abs(spin) * 0.2 * (1.35 - p.attrs.passing);
src/sim/mechanics.ts:271:export function performPass(match: Match, passer: Player, mate: Player, offsideExempt = false): void {
src/sim/mechanics.ts:279:  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:299:    (1.25 - passer.attrs.passing * 0.5) *
src/sim/mechanics.ts:301:    orientationNoiseMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:350:export function performThroughBall(
src/sim/mechanics.ts:361:  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:395:      (1.25 - passer.attrs.passing * 0.5) *
src/sim/mechanics.ts:397:      orientationNoiseMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:438:    (1.3 - p.attrs.passing * 0.55) *
src/sim/mechanics.ts:440:    orientationNoiseMul(misalign, p.attrs.passing);
src/sim/mechanics.ts:443:  let dEff = d * orientationPowerMul(misalign, p.attrs.passing);
src/sim/mechanics.ts:444:  dEff *= 1 + match.rng.gaussian() * (0.02 + d * 0.0008) * (1.25 - p.attrs.passing * 0.5) * oneTouchMul(p);
src/sim/mechanics.ts:498:  const spin = swing * (0.28 + crosser.attrs.passing * 0.3);
src/sim/mechanics.ts:536:  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:548:    (1.25 - passer.attrs.passing * 0.5) *
src/sim/mechanics.ts:550:    orientationNoiseMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:586:  const mag = 0.12 + passer.attrs.passing * 0.18;
src/sim/mechanics.ts:1031:  match.endPassMove(shooter.side); // a strike ends the passing move (Phase 33)
src/sim/mechanics.ts:1063:  const q = shotQuality(match, shooter);
src/sim/mechanics.ts:1242:  const spinMag = 0.25 + taker.attrs.passing * 0.25;
src/sim/mechanics.ts:1369:  match.endPassMove(p.side); // a hoof is not part of a passing move (Phase 33)
src/sim/mechanics.ts:1384:    23 * (1 - kickMisalignment(p, aim) * 0.15 * (1 - p.attrs.passing * 0.4)),
src/sim/Match.ts:343:   * A passing move ends (Phase 33): turnover, dead ball, shot or clear.
src/sim/Match.ts:574:  shotQuality(p: Player): number {
src/sim/Match.ts:575:    return mech.shotQuality(this, p);
src/sim/Match.ts:577:  performPass(p: Player, mate: Player, offsideExempt = false): void {
src/sim/Match.ts:578:    mech.performPass(this, p, mate, offsideExempt);
src/sim/Match.ts:580:  performThroughBall(p: Player, runner: Player, lofted = false, offsideExempt = false): void {
src/sim/Match.ts:581:    mech.performThroughBall(this, p, runner, lofted, offsideExempt);
src/sim/Match.ts:844:      // The dispossessed side's passing move is over (Phase 33).
src/sim/Match.ts:1418:    // The whistle ends any passing move (Phase 33).
src/sim/Match.ts:1548:            const s = p.attrs.finishing + p.attrs.passing * 0.5;
   570	  }
   571	
   572	  /* ---------------- kicks (delegated to mechanics) ---------------- */
   573	
   574	  shotQuality(p: Player): number {
   575	    return mech.shotQuality(this, p);
   576	  }
   577	  performPass(p: Player, mate: Player, offsideExempt = false): void {
   578	    mech.performPass(this, p, mate, offsideExempt);
   579	  }
   580	  performThroughBall(p: Player, runner: Player, lofted = false, offsideExempt = false): void {
   581	    mech.performThroughBall(this, p, runner, lofted, offsideExempt);
   582	  }
   583	  performCross(p: Player, target: Player, offsideExempt = false, pull = 0.18, at?: V2): void {
   584	    mech.performCross(this, p, target, offsideExempt, pull, at);
   585	  }
   586	  performKeeperThrow(p: Player, mate: Player): void {
   587	    mech.performKeeperThrow(this, p, mate);
   588	  }
   589	  performLoftedPass(p: Player, mate: Player, offsideExempt = false): void {
   590	    mech.performLoftedPass(this, p, mate, offsideExempt);
   591	  }
   592	  performShot(p: Player): void {
   593	    mech.performShot(this, p);
   594	  }
   595	
   596	  performCutback(p: Player, mate: Player): void {
   597	    mech.performCutback(this, p, mate);
   598	  }
   599	  performFreeKick(p: Player): void {
   600	    mech.performFreeKick(this, p);
   601	  }
   602	  performClear(p: Player): void {
   603	    mech.performClear(this, p);
   604	  }
   605	
   606	  /* ---------------- goal-channel telemetry (Phase 113) ---------------- */
   607	
   608	  /**
   609	   * Per-step band-entry tracker — the launch-anatomy probe's loop, in-engine.
   610	   * Watches the carrier: a FRESH crossing into the final 15m with zero
   611	   * goal-side outfielders is a breakaway entry, classified by what served it.
   612	   * Pure observation of already-computed state; nothing reads the result but
   613	   * the shot log.
   614	   */
   615	  private trackAttackEntry(): void {
   616	    const o = this.ball.owner;
   617	    // No owner (incl. his own pushed touch in flight) or dead ball: the
   618	    // carry clock and any live entry simply persist — same as the probe.
   619	    if (!o || this.phase !== 'playing') return;
   620	    const team = this.teams[o.side];
   621	    const ox = team.localX(o.pos.x);
   622	    if (!this.carryStart || this.carryStart.gid !== o.gid) {
   623	      this.carryStart = { gid: o.gid, t: this.simTime, x: ox };
   624	      // Took over already inside the band (or is the keeper) — not a fresh
   625	      // entry; only a crossing observed from OUTSIDE counts.
   626	      this.bandInside = ox >= HALF_L - 15 || o.role === 'GK';
   627	      // A turnover kills the other side's live entry — the attack it
   628	      // classified is over.
   629	      if (this.attackEntry && this.attackEntry.side !== o.side) this.attackEntry = null;
   630	    }
   631	    if (!this.bandInside && ox >= HALF_L - 15) {
   632	      this.bandInside = true;
   633	      // Breakaway only: zero goal-side outfielders (the walk-in pipe).
   634	      const goalSide = this.teams[1 - o.side].players.some(
   635	        (q) => q.role !== 'GK' && !q.sentOff && team.localX(q.pos.x) > ox,
   636	      );
   637	      if (!goalSide && this.restartKickGid !== o.gid) {
   638	        this.attackEntry = { side: o.side, kind: this.classifyBandEntry(o, ox), t: this.simTime };
   639	      }
   640	    }
   641	  }
   642	
   643	  /** What LAUNCHED a fresh breakaway band entry (launch-anatomy classes;
   644	   * lofted long balls fold into `through` — both are balls IN BEHIND — and
   645	   * short-pass/loose service folds into `walkin`: the line was simply beaten). */
   646	  private classifyBandEntry(p: Player, ox: number): GoalChannel {
   647	    const cs = this.carryStart;
   648	    if (cs && cs.gid === p.gid && this.simTime - cs.t > 2.2 && ox - cs.x > 9) return 'carry';
   649	    const lp = this.lastCompletedPass;
   650	    if (lp && lp.receiverGid === p.gid && this.simTime - lp.t < 3.5) {
   651	      if (this.allPlayers[lp.passerGid].role === 'GK') return 'keeper';
   652	      const kind =
   653	        this.lastPassKind && this.simTime - this.lastPassKind.t < 3.5
   654	          ? this.lastPassKind.kind
   655	          : 'pass';
   656	      if (kind === 'through' || kind === 'lofted') return 'through';
   657	      if (kind === 'cross') return 'cross';
   658	    }
   659	    return 'walkin';
   660	  }
   661	
   662	  /**
   663	   * The channel a shot by `shooter` would bank if it scores — priced at the
   664	   * STRIKE (context is freshest there; a rebound re-prices on the live
   665	   * entry). Priority: set piece → the live breakaway entry's launch class →
   666	   * cross/cutback service → worked buildup.
   667	   */
   668	  goalChannelFor(shooter: Player): GoalChannel {
   669	    const rk = this.lastRestartKick; // only ever corner / freeKick / penalty
   670	    if (rk && rk.side === shooter.side && this.simTime - rk.t < 6) return 'setpiece';
   671	    const e = this.attackEntry;
   672	    if (e && e.side === shooter.side && this.simTime - e.t < 12) return e.kind;
   673	    if (this.lastCutback && this.lastCutback.side === shooter.side && this.simTime - this.lastCutback.t < 5) {
   674	      return 'cross';
   675	    }
   676	    const pk = this.lastPassKind;
   677	    if (pk && pk.kind === 'cross' && this.simTime - pk.t < 2.5) return 'cross';
   678	    return 'buildup';
   679	  }
   680	
    80	export function orientationNoiseMul(misalign: number, technique: number): number {
    81	  return 1 + misalign * (0.9 - technique * 0.6);
    82	}
    83	
    84	/** Kicks against the body lose power (up to −22%); technique recovers some. */
    85	export function orientationPowerMul(misalign: number, technique: number): number {
    86	  return 1 - misalign * 0.22 * (1 - technique * 0.4);
    87	}
    88	
    89	/**
    90	 * First-touch difficulty (Phase 27): chance a moving ball gets away from the
    91	 * receiver. Grows with ball speed, defender pressure and taking the ball from
    92	 * behind the body; technique tames all of it. This is where pressing turns
    93	 * into forced errors.
    94	 */
    95	export function touchFailChance(
    96	  speed: number, pressure: number, misalign: number, technique: number, positioning = 0.5,
    97	): number {
    98	  // POSITIONING (Phase 119j) reads the ball and shapes the body EARLY, so it
    99	  // tames the PRESSURE and BLIND-SIDE penalties (the awareness half of a first
   100	  // touch); technique still tames the whole thing (the clean contact). Neutral
   101	  // at 0.5 — `aware` = 1.0 there, so the pre-119j curve is bit-for-bit intact
   102	  // and backfilled 0.5 saves play unchanged; a reader (1.0) cuts the
   103	  // pressure/blind penalty ~30%, a spatially-blind player (0) pays ~30% more.
   104	  const aware = 1 - (positioning - 0.5) * 0.6; // 0.7 .. 1.3
   105	  const raw = 0.01 + clamp01((speed - 6) / 8) * 0.07 + (pressure * 0.1 + misalign * 0.05) * aware;
   106	  return clamp(raw * (1.3 - technique * 0.85), 0, 0.4);
   107	}
   108	
   109	/**
   110	 * Roll the first touch for a player about to control a moving ball. Returns
   111	 * true if the touch is clean (caller gives them the ball). A failed touch
   112	 * knocks the ball loose ahead of the receiver — anyone can pounce on it.
   113	 * Keepers are exempt (they catch); slow balls are trivially trapped.
   114	 */
   115	export function attemptFirstTouch(match: Match, p: Player): boolean {
   116	  const ball = match.ball;
   117	  // A dropping ball is harder to kill than a rolled one (Phase 28): the
   118	  // vertical speed counts toward touch difficulty. Ground balls: vz = 0.
   119	  const speed = len(ball.vel) + Math.abs(ball.vz) * 0.6;
   120	  if (p.role === 'GK' || speed <= 6) return true;
   121	  const hSpeed = Math.max(len(ball.vel), 1e-6);
   122	  const inx = ball.vel.x / hSpeed;
   123	  const iny = ball.vel.y / hSpeed;
   124	  // Ball arriving at the face = 0, arriving from behind the body = 1.
   125	  const misalign = (1 + (inx * p.heading.x + iny * p.heading.y)) / 2;
   126	  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
   127	  let pFail = touchFailChance(speed, pressure, misalign, p.attrs.dribbling, p.attrs.positioning);
   128	  // Re-collecting your OWN pushed touch (Phase 36): the ball rolls away
   129	  // from the body, which reads as a blind-side reception to the misalign
   130	  // term — but he watched it leave his own boot. Priced well down, not
   131	  // free: overhit knock-and-runs still get away.
   132	  if (match.dribbleTouch !== null && match.dribbleTouch.gid === p.gid) pFail *= 0.45;
   133	  if (!match.rng.chance(pFail)) return true;
   134	
   135	  match.teams[p.side].stats.miscontrols++;
   136	  match.stat(p.gid).miscontrols++;
   137	  ball.lastTouch = p; // a heavy touch out of play concedes the restart
   138	  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.8, 0.8)), match.rng.range(3.5, 6.5));
   139	  ball.vz = 0; // the touch kills any remaining flight — the ball drops
   140	  p.kickCooldown = 0.5; // off balance — can't instantly regather
   141	  return false;
   142	}
   143	
   144	/**
   145	 * Offside judgment, frozen at kick time (Phase 29): is `target` in an
   500	  team.stats.passes++;
   501	  team.stats.crosses++;
   502	  if (oneTouch) team.stats.oneTouch++;
   503	  if (team.localX(target.pos.x) - team.localX(crosser.pos.x) > 2) team.stats.passesForward++;
   504	  registerPass(match, crosser, target, offsideExempt);
   505	}
   506	
   507	/**
   508	 * Keeper throw (Phase 28.3): an ACCURATE hand distribution — flat, quick,
   509	 * half the noise of a kicked ball, 8–30m. This is what a keeper who held
   510	 * the ball does instead of hoofing 50/50s: find a body, hit the body.
   511	 */
   512	export function performKeeperThrow(match: Match, gk: Player, mate: Player): void {
   513	  if (match.ball.owner !== gk || gk.kickCooldown > 0) return;
   514	  const team = match.teams[gk.side];
   515	  const flight0 = clamp(0.5 + dist(gk.pos, mate.pos) * 0.03, 0.7, 1.4);
   516	  const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));
   517	  loftKick(match, gk, lead, 0.5, 0.03, 0.7, 1.4, 0.45);
   518	  team.stats.passes++;
   519	  if (team.localX(mate.pos.x) - team.localX(gk.pos.x) > 2) team.stats.passesForward++;
   520	  registerPass(match, gk, mate, false); // a hand throw is regular play — offside applies
   521	}
   522	
   523	/**
   524	 * Cutback (Phase 31): the byline pull-back — a HARD, flat ball driven from
   525	 * the touchline zone to the edge-of-box arc, where the licensed arriver
   526	 * meets it first-time (giveBall's snap-decision window). Faster than a
   527	 * regular pass at the same range so it beats the box defenders' recovery
   528	 * slide across; registered like any pass (interceptions, assists and the
   529	 * offside judgment all apply — the arriver runs from DEEP, so flags are
   530	 * rare by construction).
   531	 */
   532	export function performCutback(match: Match, passer: Player, mate: Player): void {
   533	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   534	  const team = match.teams[passer.side];
   535	  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
   536	  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
   537	  const flight = dist(passer.pos, mate.pos) / (18 * powerMul);
   538	  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
   539	  const d = dist(passer.pos, lead);
   540	  const speed = clamp(d * 0.6 + 10, 11, 23) * powerMul;
   541	  const pressure = pressureAt(passer.pos, match.teams[1 - passer.side].players);
   542	  const aim = norm(sub(lead, passer.pos));
   543	  const noise =
   544	    match.rng.gaussian() *
   545	    (0.02 + pressure * 0.06 + d * 0.0012) *
   546	    (1.15 - team.genome.passBias * 0.3) *
   547	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   548	    (1.25 - passer.attrs.passing * 0.5) *
   549	    oneTouchMul(passer) *
   550	    orientationNoiseMul(misalign, passer.attrs.passing);
   551	  const oneTouch = passer.firstTouchWindow > 0;
   552	  match.lastPassKind = { kind: 'cross', t: match.simTime };
   553	  match.kickBall(passer, rotate(aim, noise), speed);
   554	  team.stats.passes++;
   555	  team.stats.cutbacks++;
   556	  if (oneTouch) team.stats.oneTouch++;
   557	  match.lastCutback = { side: passer.side, t: match.simTime };
   558	  registerPass(match, passer, mate, false);
   559	}
   560	
   561	/**
   562	 * Lofted switch (Phase 28): the big diagonal — a 25m+ ball over the press to
   563	 * a receiver in space. What the 32m ground-pass penalty used to suppress.
   564	 */
   565	/**
   566	 * The curled DELIVERY's swing (Phase 70, user ask 弧线长传 — the second of
   567	 * the curve trilogy): a lofted ball bends its BULGE away from the nearest
   568	 * threat to the landing zone (the recovering defender chases a flight that
   569	 * leans out of his line), or a gentle outswing toward the flank when the
   570	 * drop is clean. Technique whips harder; the landing point itself is
   571	 * pre-compensated inside loftKick, so completion changes only through the
   572	 * geometry of who can meet the ARC — never through a moved drop.
   573	 */
   574	function aerialSwing(passer: Player, from: V2, landing: V2, opponents: Player[]): number {
   575	  const chord = norm(sub(landing, from));

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/mechanics.ts | sed -n '190,275p;270,410p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   190	 * receiver's first-touch window (set at a pressured reception, consumed by
   191	 * any kick) sprays more — technique discounts it: tech 0.95 ≈ ×1.2, tech
   192	 * 0.5 ≈ ×1.6, tech 0.1 ≈ ×2.0. Multiplies aim noise (and loft range error).
   193	 */
   194	function oneTouchMul(p: Player): number {
   195	  return p.firstTouchWindow > 0 ? 1.15 + (1 - p.attrs.dribbling) * 0.9 : 1;
   196	}
   197	
   198	/** xG-like chance quality: distance falloff · central angle · pressure. */
   199	export function shotQuality(match: Match, p: Player): number {
   200	  const team = match.teams[p.side];
   201	  const goal = team.oppGoal();
   202	  const d = dist(p.pos, goal);
   203	  const central = 1 - clamp01(Math.abs(p.pos.y) / HALF_W) * 0.5;
   204	  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
   205	  return clamp(0.85 * Math.exp(-d / 10) * central * (1 - pressure * 0.3), 0.01, 0.8);
   206	}
   207	
   208	/**
   209	 * The ground BENDER (Phase 71, the curve trilogy's last piece — user ask
   210	 * 弧线直塞): when a defender pinches the passing lane, a technical passer
   211	 * curls the ball AROUND his leg — the bulge leans away from the pincher
   212	 * and the arc comes back to the designed receiving point. Compensation is
   213	 * exact for grass decay (spin bleeds at 1.5/s, so the total rotation is
   214	 * ω(1−e^{−1.5T})/1.5 — half of it rotated off the launch keeps the chord
   215	 * endpoint honest). Nobody in the lane = no spin: the straight ball stays
   216	 * the default, and interceptors/deflectors meet the ARC per frame, so the
   217	 * bender beats exactly the leg it was played around. Returns the spin.
   218	 */
   219	function groundBend(
   220	  passer: Player, to: V2, opponents: Player[], d: number,
   221	): number {
   222	  const from = passer.pos;
   223	  const chord = norm(sub(to, from));
   224	  let pinch: Player | null = null;
   225	  let pinchPerp = 1.3; // a leg within reach of the straight lane
   226	  for (const o of opponents) {
   227	    if (o.sentOff) continue;
   228	    const ox = o.pos.x - from.x;
   229	    const oy = o.pos.y - from.y;
   230	    const along = ox * chord.x + oy * chord.y;
   231	    if (along < 2 || along > d - 2) continue; // passer's feet / receiver's trap
   232	    const perp = Math.abs(ox * chord.y - oy * chord.x);
   233	    if (perp < pinchPerp) {
   234	      pinchPerp = perp;
   235	      pinch = o;
   236	    }
   237	  }
   238	  if (!pinch) return 0;
   239	  // Magnitude scales with how TIGHT the pinch is — a leg 1.2m off the
   240	  // chord needs a lean, not a banana (the first cut bent every through
   241	  // ball at full whip: the last defender always stands near that chord,
   242	  // so high lines were being beaten for free — press-23's measured block
   243	  // height collapsed onto low-32's and the formations contract inverted).
   244	  const tightness = clamp(1.4 - pinchPerp, 0.3, 1);
   245	  // FLAT whip (the passing-scaled first cut inverted the skill gradient:
   246	  // better passers took BIGGER bends and paid the deviation) — the bend
   247	  // needed to clear a leg is geometry, the same for everyone; technique's
   248	  // edge lives in the weight error below.
   249	  const mag = 0.45 * tightness;
   250	  const cross = chord.x * (pinch.pos.y - from.y) - chord.y * (pinch.pos.x - from.x);
   251	  return (Math.sign(cross) || 1) * mag;
   252	}
   253	
   254	/** Kick a ground ball with bend: launch rotated half the DECAYED total
   255	 * rotation so the arc's endpoint sits where the straight aim pointed. */
   256	function bentKick(match: Match, p: Player, dir: V2, speed: number, spin: number, d: number): void {
   257	  if (spin === 0) {
   258	    match.kickBall(p, dir, speed);
   259	    return;
   260	  }
   261	  const T = -Math.log(1 - Math.min((d * BALL_FRICTION_K) / speed, 0.85)) / BALL_FRICTION_K;
   262	  const totalRot = (spin * (1 - Math.exp(-1.5 * T))) / 1.5;
   263	  // The bender's PRICE: a curled ball is harder to weight — extra launch
   264	  // noise grows with the whip and shrinks with technique. Free bending
   265	  // farmed the offside line (see groundBend's tightness note).
   266	  const weightErr = match.rng.gaussian() * Math.abs(spin) * 0.2 * (1.35 - p.attrs.passing);
   267	  match.kickBall(p, rotate(dir, -totalRot * 0.5 + weightErr), speed);
   268	  match.ball.spin = spin;
   269	}
   270	
   270	
   271	export function performPass(match: Match, passer: Player, mate: Player, offsideExempt = false): void {
   271	export function performPass(match: Match, passer: Player, mate: Player, offsideExempt = false): void {
   272	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   272	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   273	  const team = match.teams[passer.side];
   273	  const team = match.teams[passer.side];
   274	  const opp = match.teams[1 - passer.side];
   274	  const opp = match.teams[1 - passer.side];
   275	
   275	
   276	  // Playing across/against the body (Phase 27) takes pace off the ball —
   277	  // known up front, so the lead and the kick agree on the effective speed.
   278	  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
   279	  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
   280	
   281	  // Lead the receiver by a fraction of the expected flight time.
   282	  const flight = dist(passer.pos, mate.pos) / (16 * powerMul);
   283	  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
   284	  const d = dist(passer.pos, lead);
   285	  // d·0.55+7.5 → d·0.6+8.2 (31.6, user call 传球力度): zip beats the
   286	  // in-flight interceptors (completion 64→68%) — the receiving cost is
   287	  // priced by touchFailChance and stays mild.
   288	  const speed = clamp(d * 0.6 + 8.2, 9, 22) * powerMul;
   289	
   290	  // Accuracy: pressure sprays passes; a drilled team (passBias) and a
   291	  // technical passer tighten them; kicks against the body spray more.
   292	  const pressure = pressureAt(passer.pos, opp.players);
   293	  const aim = norm(sub(lead, passer.pos));
   294	  const noise =
   295	    match.rng.gaussian() *
   296	    (0.02 + pressure * 0.07 + d * 0.0015) *
   297	    (1.15 - team.genome.passBias * 0.3) *
   298	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   299	    (1.25 - passer.attrs.passing * 0.5) *
   300	    oneTouchMul(passer) *
   301	    orientationNoiseMul(misalign, passer.attrs.passing);
   302	  const dir = rotate(aim, noise);
   303	
   304	  const oneTouch = passer.firstTouchWindow > 0;
   305	  // Circulation stays STRAIGHT — deliberately (Phase 70/71): the bender on
   306	  // ordinary short passes defeated exactly the lane-jumping that IS the
   307	  // pressing game, and the zonal press-23 block's measured height collapsed
   308	  // onto low-32's (the formations contract inverted; isolation-probed —
   309	  // through-ball and aerial curves alone leave it intact). Curl lives where
   310	  // football actually spends it: through balls, switches, crosses, shots.
   311	  match.lastPassKind = { kind: 'pass', t: match.simTime };
   312	  match.kickBall(passer, dir, speed);
   313	  team.stats.passes++;
   314	  if (oneTouch) team.stats.oneTouch++;
   315	  if (team.localX(mate.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
   316	  registerPass(match, passer, mate, offsideExempt);
   317	
   318	  // 2过1 (Phase 34): a short pass played UNDER PRESSURE licenses the passer
   319	  // to burst past his marker for the return — the "go" half of the
   320	  // give-and-go. Sides that play at speed (tempo + passBias) look for it;
   321	  // slow ones take the touch and keep shape. Not from the defensive third
   322	  // (a wall pass at your own box is how counters are born).
   323	  // Window 2.3s: the round trip is ~0.7s out + the wall's touch + ~0.7s
   324	  // back — a 1.15s license expired before any return could arrive (probed).
   325	  // Attacking half only: granted from build-up, the flip bonus turned the
   326	  // midfield into a wall-pass ping-pong that ate 0.3 goals/match (probed
   327	  // against the same calibrate seeds) — the one-two is a PENETRATION device.
   328	  // The gene score is scaled by the franchise's evolved wallPassW (Phase 45)
   329	  // before the gate — appetite for the one-two is style, not a constant.
   330	  if (
   331	    passer.role !== 'GK' &&
   332	    d < 15 &&
   333	    pressure > 0.2 &&
   334	    passer.stamina > 0.3 &&
   335	    team.localX(passer.pos.x) > 0 &&
   336	    ((team.genome.tempo + team.genome.passBias) / 2) * team.policies[passer.index].wallPassW > 0.35
   337	  ) {
   338	    passer.wallRun = { until: match.simTime + 2.3, partnerGid: mate.gid };
   339	  }
   340	}
   341	
   342	/**
   343	 * Through ball (Phase 19): hit harder and led much further than a feet pass —
   344	 * into the space the runner is attacking, not to where they stand. Riskier by
   345	 * construction (longer flight, bigger lead), which is exactly the trade
   346	 * riskTolerance gates in the carrier's scoring. `lofted` (Phase 28) chips it
   347	 * over the defensive line instead — slower to arrive and harder to take down,
   348	 * but nothing on the ground can cut it out.
   349	 */
   350	export function performThroughBall(
   351	  match: Match, passer: Player, runner: Player, lofted = false, offsideExempt = false,
   352	): void {
   353	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   354	  const team = match.teams[passer.side];
   355	  const opp = match.teams[1 - passer.side];
   356	  const oneTouch = passer.firstTouchWindow > 0; // read before any kick consumes it
   357	
   358	  // Same body-orientation contract as performPass: effective speed known
   359	  // up front so the projected meeting point stays honest.
   360	  const misalign = kickMisalignment(passer, norm(sub(runner.pos, passer.pos)));
   361	  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
   362	
   363	  // Meet the run, not the hover (Phase 29): a runner held at the offside
   364	  // line has ~zero velocity — the delivery projects the burst they make the
   365	  // moment this kick releases the hold, instead of dropping at their feet.
   366	  const oppPlayers = match.teams[1 - passer.side].players;
   367	  if (lofted) {
   368	    const flight0 = clamp(0.55 + dist(passer.pos, runner.pos) * 0.045, 0.8, 2.0);
   369	    const lead = runBurstPoint(runner, team, oppPlayers, flight0 * 0.85);
   370	    // The dink bends away from the recovering defender (Phase 70).
   371	    const swing = aerialSwing(passer, passer.pos, lead, oppPlayers);
   372	    loftKick(match, passer, lead, 0.55, 0.045, 0.8, 2.0, 1.0, swing);
   373	    team.stats.longBalls++; // a chip is a lofted long ball too
   374	  } else {
   375	    const flight = dist(passer.pos, runner.pos) / (18 * powerMul);
   376	    // Lead FURTHER since Phase 30 (flight ×1.25, pace cap 21→24): with a
   377	    // sixth defender recovering, a ball met AT the line gets the runner
   378	    // caught before the shot — the delivery must land deep enough that the
   379	    // 17 through balls/match turn back into 1v1s (the high-xG chances the
   380	    // 30.x structures had erased: 0.38/match → 0.08 before this).
   381	    const lead = runBurstPoint(runner, team, oppPlayers, flight * 1.25);
   382	    const d = dist(passer.pos, lead);
   383	    // A touch softer since Phase 29: the ball is played into SPACE for a
   384	    // runner arriving at a sprint — friction kills it into the path, and a
   385	    // pace the runner can actually take down is what converts timed runs.
   386	    const speed = clamp(d * 0.6 + 9, 10, 24) * powerMul;
   387	
   388	    const pressure = pressureAt(passer.pos, opp.players);
   389	    const aim = norm(sub(lead, passer.pos));
   390	    const noise =
   391	      match.rng.gaussian() *
   392	      (0.025 + pressure * 0.07 + d * 0.0017) *
   393	      (1.15 - team.genome.passBias * 0.3) *
   394	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   395	      (1.25 - passer.attrs.passing * 0.5) *
   396	      oneTouchMul(passer) *
   397	      orientationNoiseMul(misalign, passer.attrs.passing);
   398	    const dir = rotate(aim, noise);
   399	
   400	    // The bent through ball (Phase 71) — around the last defender's leg.
   401	    bentKick(match, passer, dir, speed, groundBend(passer, lead, oppPlayers, d), d);
   402	  }
   403	  team.stats.passes++;
   404	  team.stats.throughBalls++;
   405	  if (oneTouch) team.stats.oneTouch++;
   406	  if (team.localX(runner.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
   407	  registerPass(match, passer, runner, offsideExempt);
   408	}
   409	
   410	/* ------------------------------------------------------------------ */

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/evolution/traits.ts | sed -n '1,100p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import type { Role } from '../sim/types';
     2	import type { PlayerAttributes } from './playerGenome';
     3	import type { PlayerStyle } from './playerStyle';
     4	
     5	/**
     6	 * Player TRAITS (Phase 39, style traits Phase 54) — small, readable
     7	 * individuality on top of the attribute vector. DERIVED, never stored: a
     8	 * pure function of (attrs, role, style), so newgens and developing players
     9	 * grow into (and out of) them with no save-schema change. Capped at 2 per
    10	 * player, 9 types total (the anti-soup rule) — and every one has a PLAY
    11	 * effect:
    12	 *
    13	 *   clinical  aimMargin −0.1 (shaves the post)     shooters, finishing
    14	 *   poacher   run target pulls toward the goalmouth ST instinct-finisher
    15	 *   playmaker pass-lane read ×1.15                  technique on the ball
    16	 *   enforcer  tackle +0.04, foul +0.02              the destroyer
    17	 *   engine    stamina drain ×0.9                    the motor
    18	 *   cat       keeper reach +0.12                    GK reflexes
    19	 *
    20	 * The Phase-54 style traits are BADGES OF GENES: their play effect is the
    21	 * personal-style multiplier itself (already live via rolePolicies) — the
    22	 * trait names a bias that is provably shaping decisions, it never adds a
    23	 * second hand-tuned effect on top. The sim's own traitsOf call passes no
    24	 * style (the attr traits' effects stay sim-side; the style ones act
    25	 * through the policy wire):
    26	 *
    27	 *   maverick  longShotW ≥ 1.3                       shoots from anywhere
    28	 *   trickster dribbleBase ≥ 1.3                     take-on addict
    29	 *   shadow    runScore ≥ 1.3                        the late runner
    30	 */
    31	export type Trait =
    32	  | 'clinical' | 'playmaker' | 'enforcer' | 'engine' | 'poacher' | 'cat'
    33	  | 'maverick' | 'trickster' | 'shadow';
    34	
    35	export const TRAIT_KEYS: readonly Trait[] = [
    36	  'clinical', 'playmaker', 'enforcer', 'engine', 'poacher', 'cat',
    37	  'maverick', 'trickster', 'shadow',
    38	];
    39	
    40	/** Display chips — emoji read on a phone in any language. */
    41	export const TRAIT_EMOJI: Record<Trait, string> = {
    42	  clinical: '🎯',
    43	  playmaker: '🎩',
    44	  enforcer: '🛡️',
    45	  engine: '🔋',
    46	  poacher: '🦊',
    47	  cat: '🐱',
    48	  maverick: '🎲',
    49	  trickster: '🪄',
    50	  shadow: '👻',
    51	};
    52	
    53	/** Candidate traits with how far past their bar this player is. */
    54	function candidates(
    55	  a: PlayerAttributes, role: Role, style?: PlayerStyle,
    56	): Array<{ t: Trait; excess: number }> {
    57	  const out: Array<{ t: Trait; excess: number }> = [];
    58	  if (role === 'GK') {
    59	    if (a.reflexes >= 0.85) out.push({ t: 'cat', excess: a.reflexes - 0.85 });
    60	    return out; // keepers are keepers — outfield traits stay outfield
    61	  }
    62	  if (role !== 'DF' && a.finishing >= 0.8) out.push({ t: 'clinical', excess: a.finishing - 0.8 });
    63	  if (role === 'ST' && a.finishing >= 0.75 && a.dribbling < 0.6) {
    64	    out.push({ t: 'poacher', excess: a.finishing - 0.75 });
    65	  }
    66	  if (a.passing >= 0.8) out.push({ t: 'playmaker', excess: a.passing - 0.8 });
    67	  if (a.defending >= 0.8) out.push({ t: 'enforcer', excess: a.defending - 0.8 });
    68	  if (a.pace >= 0.82) out.push({ t: 'engine', excess: a.pace - 0.82 });
    69	  if (style) {
    70	    // Bars at 1.2: the realized population spread is ~±0.05 with tails to
    71	    // ~±0.2 (probe-measured) — 1.3 was unreachable, 1.2 is the honest tail.
    72	    if (style.longShotW >= 1.2) out.push({ t: 'maverick', excess: (style.longShotW - 1.2) * 2 });
    73	    if (style.dribbleBase >= 1.2) out.push({ t: 'trickster', excess: (style.dribbleBase - 1.2) * 2 });
    74	    if (style.runScore >= 1.2) out.push({ t: 'shadow', excess: (style.runScore - 1.2) * 2 });
    75	  }
    76	  return out;
    77	}
    78	
    79	/** The 1–2 traits this player IS (deterministic: sorted by excess, ties by
    80	 * table order so equal-excess picks never depend on insertion luck). */
    81	export function traitsOf(a: PlayerAttributes, role: Role, style?: PlayerStyle): Trait[] {
    82	  return candidates(a, role, style)
    83	    .sort((x, y) => y.excess - x.excess || TRAIT_KEYS.indexOf(x.t) - TRAIT_KEYS.indexOf(y.t))
    84	    .slice(0, 2)
    85	    .map((c) => c.t);
    86	}

[3mThe implementation trace is complete. The key finding is a semantic mismatch: perception helpers expose objective world truth, while attacking and defensive decisions use different approximations of the same future event. I’m now turning that into a concrete, risk-ranked recommendation.[0m
  [32m✓[0m Read the vision, emergence blueprint, and relevant roadmap history
  [32m✓[0m Trace perception inputs through player/team action scoring and formations
  [32m✓[0m Inspect genome constraints and identify evolvable, balanced perception mechanisms
  [36m→[0m Synthesize a prioritized independent recommendation with code citations
  [32m✓[0m Read the vision, emergence blueprint, and relevant roadmap history
  [32m✓[0m Trace perception inputs through player/team action scoring and formations
  [32m✓[0m Inspect genome constraints and identify evolvable, balanced perception mechanisms
  [32m✓[0m Synthesize a prioritized independent recommendation with code citations
[35m[3mcodex[0m[0m
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
[2mtokens used[0m
194,347
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
