# The EVO WORLD blueprint (2026-07-14, user-ratified) — the master plan

This supersedes the *plan* half of [`EMERGENCE-PIVOT.md`](EMERGENCE-PIVOT.md)
(whose rationale, substrate audit, gates and the turnkey attribute scope stay
canonical — this doc sequences them). ROADMAP.md points here.

## The vision (the user, 2026-07-14)

> 就像看着现实足球队伍一样,涌现不同战术,然后互相竞争,进化,然后每个队员,
> 每个队伍的 coach,每个赛季杯赛,都有独特闪光点和打法,并且都在 evo,而且
> 有竞争有激烈,并且需要有个更可视化的方法来看他们进化,并且这一切都是有很
> 真实并且足够质量高的底座支撑。

A living football world: tactics, players, coaches, seasons and cups all
carry earned identities, all evolve, competition is fierce and legible, and
everything rests on a realistic, high-quality simulation substrate.

**The two structural insights this blueprint adds to the pivot:**
1. *Coaches and transfers are not decoration — they are new CHANNELS for
   evolution.* A coach embodies the tactical genome and lets philosophies
   spread by MOVEMENT (memetic channel); a free-agent market lets player
   genes re-circulate outside rebirth crossover (second genetic channel).
2. *The fitness function currently hand-picks virtues* (pass completion,
   recoveries, stamina efficiency reward ONE texture for everyone) — a hidden
   convergence pressure, to be removed in favor of results-dominant fitness.

## Principles (binding, all stages)

- **The emergence meta-rule extends to every new layer**: coach philosophies
  are evolved genomes, never preset archetypes; nameplates / eras / narrative
  categories are DISCOVERED from data (only a dimension→vocabulary grammar is
  hand-built); the narrative layer READS records and never feeds back into
  the sim.
- **One lever per phase, probe evidence per phase** (ARCHITECTURE invariant
  11): dedicated probe A/B vs the previous tag, `npm run calibrate -- 8` on
  two seeds, full test gate, fingerprint rebaseline, chain-tested save
  migrations.
- **Order = leverage**: Engine (diversity exists) → Visibility (diversity is
  seen) → World (diversity gets faces and stories) → Substrate thickening.
- **Do not resurrect** the parked hand-set behaviors (take-on, run-license,
  widen-formation) and do not hand-set new ones.

## Stage 1 — ENGINE: make evolution actually produce diversity

| Phase | Lever | Gate |
|---|---|---|
| **45 (A1)** | 套路 combos gene-driven: fold Phase 34's hand-set trigger thresholds/appetites (wall pass / third man / overlap) into per-franchise policy genes, born at today's constants (the proven phase-42 pattern). Also: run `policy-coherence` to establish the coherence baseline. | combo-rates A/B (specialists diverge, league mean stable) + policy-emergence + calibrate ×2 |
| **46 (A2)** | Breakaway substrate fix: the carry-push cone is keeper-BLIND (verified defect — maxed attrs still ~8-9% heavy-touch→keeper). Make the push-target keeper-aware at the physics-primitive level, unbiased, so pace/space PAY. | `breakaway.ts` A/B + calibrate ×2 |
| **47 (B)** | Attribute expansion 5→8: `pace/passing/dribbling/finishing/defending/strength/stamina/reflexes` — exactly the turnkey scope in EMERGENCE-PIVOT §5 (per-line technique remap incl. the mechanics.ts ambiguity GOTCHA, strength/stamina payoffs, ROLE_BIAS MF→passing, traits, DECLINE_W, probes to 8 keys, save v11→v12 neutral backfill). | calibrate ×2 watching completion+goals (fm 16–21) + player-archetype probe |
| **48 (C)** | **Resource budget (the keystone)**: `SQUAD_BUDGET` = hard cap on the squad's total attribute points; one pure `enforceBudget(squad)` (proportional rescale) applied after rebirth crossover, the careers develop pass, and newgen entry. SQUAD-level on purpose: star-plus-role-players vs balanced-six becomes an evolvable axis. Rejected: fitness penalty (invisible, evolution routes around), per-player cap (kills the star axis). **Rides with it: academy heredity** — newgens mutate the retiring slot's attrs (club bloodline) instead of random+ROLE_BIAS; ROLE_BIAS retires. Cap derived by probe (bind early: ~founding mean ×1.1–1.2), settled by calibrate. Budget bar on the team card. | specialization probe (within-player variance ↑, cross-club allocation divergence ↑) + evo-drift plateaus at cap + calibrate ×2; rewrite the careers mean-stability test (the budget intentionally changes that invariant) |
| **50 (E)** | Selection speedup, one lever at a time, judged by a new `style-speed` probe (**target: visible clustering ≤8–10 seasons on fresh saves**, spread ≥15% / ≥3 nameplate clusters): (1) **fitness slimming** — results-dominant (points ~0.5, GD ~0.2, styleConsistency ~0.1; drop passCompletion/recoveries/staminaEfficiency); (2) parent diversity — reborn's second parent = highest-fitness club most gene-distant from the first (deterministic); (3) diversity thermostat — mutation scale rises when population spread sinks below a floor (derived from population state, unbiased, self-regulating); (4) only if still short: D2 rebornN 3→4. | style-speed A/B per lever + calibrate ×2 (watchability is the backstop if e.g. hoofball wins) |

## Stage 2 — VISIBILITY: make evolution seen (phase 49, right after the budget)

- **Data-driven nameplates**: z-score each club's (genome+policy) vector
  against the current population; top-2 |z| dims feed a dimension→vocabulary
  grammar (zh). Replaces `describeIdentity`'s fixed threshold buckets (which
  violate the meta-rule). On team cards, clash banner, league table chips.
- **Style-space map**: clubs scattered on the season's two highest-variance
  dims (stable + interpretable; deliberately NOT PCA — axes would flip
  between seasons), with N-generation trails and cluster hulls; cluster
  names generated from centroid extremes.
- **Divergence dashboard**: the policy-emergence spread metric in-game
  (curve over generations), per-gene mean±band sparklines, a diversity
  index, per-club budget-allocation heatmap.
- Engineering: SeasonRecord snapshots the population matrix (16×~40 floats);
  fingerprint moves by strip-and-rehash-proven schema growth only; phone
  ≤390px, i18n zh, Playwright sections.

## Stage 3 — WORLD: give evolution faces and stories

- **W1 Coach entity** (philosophy embodied + the memetic channel): the
  tactical genome + policy genes move INTO a named, aging coach; the club
  keeps squad/academy/budget/prestige/rivalries. Same genetic operators, now
  with mobility: rebirth = hiring (crossover of successful coaches'
  philosophies); a chronically-bottom surviving club can SACK and hire from
  the pool of out-of-work coaches (dead clubs' ex-managers) — tactics spread
  by movement. Coach careers, retirement, hall of fame, mentor tree (a
  retiring coach's philosophy seeds a newgen coach). ⚠ The mobility channel
  accelerates convergence — monoculture probes are a hard gate.
- **W2 Player personal style**: a small per-PLAYER decision-bias gene set
  (long-shot / take-on / one-touch / late-run appetites…) inherited through
  academy heredity and transfers — the `rolePolicies` plumbing is the wire.
  Traits re-derived over 8 attrs + style genes (cap 2/player, every trait
  must have a play effect). Player cards get data-driven personal nameplates
  + career highlight moments.
- **W3 Free-agent fire-sale** (second genetic channel, minimal first cut):
  a dying club's players enter a free-agent pool instead of vanishing;
  clubs sign under the budget (now a real wage cap). Full active transfer
  market only after the fire-sale channel's ecology is measured.
- **W4 Season/cup narrative layer**: derived ENTIRELY from existing records
  (points timeline, cup bracket, awards, records, rivalries, rebirths) — a
  season story (when the title race was decided, the cup giant-killer, the
  fallen dynasty, sackings and coronations) + a browsable chronicle
  timeline; era names emerge from data clustering, never presets.

## Stage 4 — SUBSTRATE thickening (long-term, pull-based)

Parking-lot realism items admitted one at a time, each passing the test
*"does it give genes a NEW payoff surface?"*: substitutions/bench first
(rotation becomes an evolvable strategy, couples with stamina + budget),
then form/morale, injuries, home-crowd effects, narrative-memory commentary.

## The post-Stage-3 queue (2026-07-14 gap review, user-ratified) — ⭐ THE PHASE PLAN FOR 57+

Stage 1–3 built the loop and the world; the gap review against the
original vision ("好玩的,可以自我进化的,可视化优秀的,有深度的,玩着爽的,
能自己产生多元化战术的,贴近现实足球") found the remaining distance
concentrated in six places. **This queue IS the next phase plan** (user
2026-07-14: "这些作为之后的phase计划") — work it in order, one phase per
item unless a probe result re-scopes it, play reports still interleave:

- ✅ **N1 — the COUNTER-PLAY probe (对战矩阵) — DONE, phase-57. VERDICT:
  TRANSITIVE, the gate FIRES.** 0 cyclic / 21 fully-decisive triads; one
  meta (narrow + direct + aggressive + risk-on) dominates every world's
  champions. Full evidence + anatomy in the phase-57 ledger entry ⇒ N1.5.
- **N1.5 — the COUNTER-PAYOFF SURFACE (inserted by N1's verdict; N5 is
  HARD-GATED behind it)**: give the meta's strengths physical COSTS so
  counters can EVOLVE — never hand-code the counter-tactic (the
  emergence rule). One lever per phase; **the matrix probe IS the
  regression gate: re-run it per lever; DONE when cycles ≥10% of
  decisive triads.** Progress:
  - ✅ lever 1 (phase-58) — the ENERGY ECONOMY BINDS: aggression priced
    via real fatigue (MA correlation +0.51 → −0.54, era arms race
    dissolved, width freed). Cycles still 0 — the meta rotated to
    "Runners in waves / Compact block".
  - ✅ lever 2 (phase-59) — the REACTION GATE: bystanders must SEE a
    live pass to touch it. **The first cycle appeared** (Tiki-taka >
    Compact bus > through-ball surgeons > Tiki-taka), cyclic 4.5%
    (gate: ≥10%), no unbeaten king, the era arms race inverted (.431).
    (The crossBase +0.87 axis it flagged was A/B-REFUTED by
    `cross-anatomy.ts` — cross-heavy loses to everything, the bus
    punishes it hardest; the n=12 dim correlation is a hypothesis
    generator, NOT a verdict — always A/B before nerfing.)
  - ✅ lever 3 (phase-60) — the UNSET WALL: blockers weigh by
    facing·stillness. **Three cycles, 7.5%** (0→0→4.5→7.5%); the floor
    (`UNSET_BLOCK_WEIGHT`) is the attack/defense dial — 0.3 broke the
    balance (0 cycles, attack über alles), 0.55 shipped.
  - ⚠ **the matrix RE-BASED at phase-61** (9-man rosters = new founding
    worlds; the 0→0→4.5→7.5% trajectory ended with its era): 0 cycles /
    26 decisive, decisive-edge rate 50%, pressIntensity +0.87 —
    **rotation partially refunds the press fatigue tax**. The close
    still means ≥10% cycles, measured on the roster-era worlds.
  - ✅ lever 4 (phase-62) — **CARDS THAT BIND**: personal cards +
    suspensions served by real lineups. **The close attempt FAILED**:
    press correlation HALVED (+0.87 → +0.43 — the discipline tax hits
    the right axis) but cycles stayed 0/44 and the era arms race is
    strong (.762) — ~0.5% of starter-slots banned is a constant tax,
    not frequency dependence. The decision point → the user re-framed
    the question from real leagues (2026-07-16) ⇒ levers 5-6 + the
    yardstick swap below.
  - ✅ lever 5 (phase-63) — the AERIAL/ROUTE-ONE channel (cross
    bombardment: unplayable → the matrix's top archetype).
  - ✅ lever 6 (phase-64) — the UNDERDOG SHIFT (the bus becomes
    opponent-conditional; +0.15 pts/match for the outgunned pragmatist).
  - ✅ **N1.5 CLOSED at phase-65 under the RE-SCOPED gate.** The
    ≥10%-cycles criterion is RETIRED: cross-era snapshot round-robins
    conflate arms-race progress with style相性 (era .762 at 62 proved
    it) and re-roll with every founding-rng change. The ecological
    standard — **negative FREQUENCY DEPENDENCE, measured in-league**
    (`freq-dependence.ts`, 2 worlds × 30 seasons) — gives the verdict:
    **7 axes SELF-BALANCE** (a style's payoff falls as it spreads:
    rotationBias −0.71, dribbleBias −0.66, markingAggression −0.56,
    attackingWidth −0.51, defensiveCompactness −0.42, wide-212 −0.39,
    keeperAggression −0.31 — different axes per world, ecology-true)
    and — the load-bearing half — **ZERO RUNAWAY axes anywhere**: no
    style anywhere gets STRONGER as it spreads. Diversity is
    self-sustaining, not constraint-propped. N5 is UNGATED (mind the
    phase-64 def-menu watch: one world skewed low-32 15/16).
  - ✅ goals watch RESOLVED at phase-61: calibrate 2.70 / 2.59 — both
    seeds back in band (fresh legs + the new founding ecology).
- ✅ **N2 — SUBSTITUTIONS / the bench — DONE, phase-61**: 9-man rosters
  under the widened budget (deep bench vs star XI is a REAL allocation),
  dead-ball subs driven by the `rotationBias` gene, roster-indexed
  careers/apps. Selection verdict: alive and ecology-dependent (world
  424242 goes full carousel, world 991 stays mixed). Red-card
  suspensions and injuries are UNBLOCKED by this infrastructure.
- ✅ **N3 — COACH MATCH-DAY PRESENCE — DONE, phase-66** (save v21): the
  `tinkerBias` gene scales the mentality response (stoic ×0.5 ↔
  tinkerer ×1.5, 0.5 = the old curve bit-exactly), the ⚡/🧊/🔄 calls
  are narrated under HIS name (+ the Phase-64 bus 🚌 finally gets its
  kickoff line), and the coach STANDS ON THE TOUCHLINE in 3D (suited
  figure + scarf + nameplate, tracks the ball, leaps on his side's
  goals). Selection verdict: alive with full-width spread, no corner
  runaway — the trade is real (chase bleeds counters, shut-down
  protects). Ledger entry below.
- ✅ **N4 — the TACTICAL BROADCAST layer — DONE, phase-68**: block
  outline + press waves + the live mini formation map, presentation-grade
  on a default-ON flag; render-only, fingerprint untouched. Ledger entry
  below.
- **N5 — FORMATION LIBRARY expansion** (UNGATED at phase-65 — N1.5
  closed): 2×2×2 shapes is the hard ceiling on visible structural
  diversity; add 6v6-honest attack shapes (asymmetry, twin ST,
  deep-forward) as RARE mutations under an ecology budget (the zonal
  lesson, failure mode 21; plus the phase-64 def-menu watch — low-32
  crowded one world's defensive menu).
- **N6 — the market signs for STYLE FIT**: player personality's second
  selection channel — boards weigh appetite-fit with the coach's
  philosophy, NOT a fitness term (failure mode 22 forbids uniform-virtue
  rewards).
- **Honest long-term note**: 6v6 itself is the realism ceiling (three
  lines, full-backs, midfield triangles need bodies). 11v11 is the
  endgame question — parked DELIBERATELY (an engine-scale rewrite), not
  forgotten.

Cross-cutting polish noted in the same review (fits any phase): entity
LINKS between the screens (click a player in the chronicle → his deep
dive; the world should be one navigable web, not three islands), and
crowd AUDIO (noise swelling with xG, goal eruptions) — cheap, high 爽.

## Status ledger

Shipping a phase = gates green (calibrate band, evolve-check, vitest,
visual, fingerprint noted) → ledger entry here + ROADMAP head →
commit → **`git tag phase-NN`** → push commit AND tag. The Pages build
stamps `git describe` into the corner version, so a missing tag ships
as the PREVIOUS phase's name plus a commit count (phases 57/58 first
read "phase-56-3-…" until back-tagged — confusing in play reports).

- 2026-07-14: blueprint ratified by the user ("可以,先更新docs,然后开始自走").
  Stage-1 execution begins at phase 45.
- ✅ **phase-45 SHIPPED** (套路 → policy genes + coherence baseline): `wallPassW /
  thirdManW / overlapW` join `POLICY_GENE_KEYS` (born 1.0 = the Phase-34
  constants; the two gate sites scale the gene score before the threshold, the
  bounce bonus scales its multiplier — BOTH bounce sites, feet + through).
  Save v13 (same backfill pattern). Gates: policy-emergence spread 0→~20-26%
  persists on both seeds WITH the combo genes in the pool; combos tests grew
  three policy-flip tests (wallPass/overlap license flips are deterministic
  zeros; thirdMan proven by a 40-scene deterministic sweep — hungry releases
  the runner in 29 scenes vs averse 26; per-match counts are noise, probed
  135 vs 127/24 matches, so the MECHANISM is the pin); calibrate 2.33 / 2.32
  (phase-44: 2.40 / 2.34 — in band); evolve-check healthy; vitest 310, visual
  75+37. Fingerprint `43f71508…` (behavioral: +3 rng draws per policy
  mutation). **Coherence BASELINE recorded** (seed 424242, 40 gens):
  counter↔fwdPass r=+0.42 and dribbleGene↔dribblePolicy r=−0.56 already
  emerge from selection alone; chase↔fwdPass r=−0.38; mark↔intercept r≈0 —
  the flat pairs are Stage-1E's measuring stick, not something to hand-wire.
- ✅ **phase-46 SHIPPED** (keeper-aware carry cone): `GK_RUSH_ENVELOPE = 5` —
  the dribble-push cone prices a keeper 5m upfield of his body (any roll
  reaching him is dead: hands + `GK_CONTROL_MAX_SPEED` 23 vs outfield 14;
  5m ≈ GK 6.4 m/s × the ~0.8s loose window). Breakaway probe A/B: normal
  genomes keeper-collects **8%→5%** (shots 45→46%); MAXED genomes **9%→5%**
  with shots **39%→43%** — the maxed-genome inversion (technique made
  breakaways WORSE) is gone, so pace/finishing gradients now pay on the
  break. Calibrate 2.86 / 2.57 (mean 2.72 — breakaways cashing honestly;
  NOT compensated, the phase-41 precedent: pulling it back re-blinds the
  keeper. If play-feel reads goal-happy, `GK_RUSH_ENVELOPE` is the dial).
  Fallout absorbed: an unclamped danger-band FK spot could park the dead
  ball out of bounds through its whole setup (probed x=45.06, seed 99) —
  `awardRestart` now places free kicks ON the pitch. vitest 311, visual
  75+37. Fingerprint `53bc3824…` (behavioral).
- ✅ **phase-47 SHIPPED** (attribute expansion 5→8): `pace / passing /
  dribbling / finishing / defending / strength / stamina / reflexes` — the
  EMERGENCE-PIVOT §5 turnkey scope executed (per-line technique remap;
  strength → aerial + the `tryTackles` shield term, base 0.25 − strength·0.10
  so the population mean is where 46 left it; stamina → drain ×(1.24−sta·0.6)
  / recovery ×(0.88+sta·0.3), neutral at the 0.4 backfill; ROLE_BIAS MF →
  passing, strength/stamina UNBIASED; traits playmaker→passing / poacher→
  dribbling; DECLINE_W means 1.0 over 8 keys; save v14 with history
  attrMeans upgraded). **Archetypes EMERGE** (`attr-archetype.ts`, 30 gens):
  WG evolve dribbling≫passing (drb 0.37→0.62, split turns negative), MF
  passing≫dribbling (+0.31→+0.45, pas →0.86), strength SELECTED 0.37→0.50;
  stamina random-walks (weak gradient — exactly what the phase-48 budget
  prices). evo-drift 50-gen gate PASSED both seeds (width troughs then
  recovers 0.09→0.22 / holds 0.54-0.72; WG drb →0.67/0.75; ST fin control
  intact). **Fallout absorbed, probed**: the finishing→conversion payoff had
  ALREADY decayed to +1.3pp ≈ noise by phase-46 (eras of churn pushed the
  corner dare past its optimum) and the invariant test flipped on 47's
  re-roll — aimMargin finishing slope 0.9→0.6 (swept {0.9,.75,.6,.5} at 540
  matches: hi-fin conversion 28.9% vs 26.8% restored); two combo-test
  "deterministic zeros" were mentality-permeable at boundary genes (width
  +0.15·u / tempo +0.1+0.2·passBias) — re-pinned at safe genes + a
  unit-level license test. Calibrate 2.92 / 3.09 (top of the original
  2.6–3.0 band; 777's league evolved a genuine short-pass meta — long balls
  1.6, completion 71%). WATCH: headers-won drifted 3.5→~2.4-3.1 across 46-47;
  press climbs to ~0.75 in 50-gen runs (the fitness `recoveries` term rewards
  it — phase 50's slimming target). vitest 312, visual 75+35 (two
  goal-conditional checks didn't fire this trajectory). Fingerprint
  `6fa4fe32…` (behavioral).
- ✅ **phase-48 SHIPPED** (the RESOURCE BUDGET + academy heredity — the
  keystone): `SQUAD_BUDGET = 24` (6 players × 8 attrs × 0.5) hard-capped by a
  pure proportional `enforceBudget` at founding / rebirth crossover / the
  season careers pass; **newgens are BLOODLINE now** (`newgenFromBloodline`:
  the retiree's profile mutated σ0.12 — ROLE_BIAS retired from the newgen
  path, survives only at founding). Budget bar on team cards (预算 spent/cap).
  **Specialisation evidence** (`specialization.ts` + `attr-archetype.ts` +
  evo-drift, 40-50 gens): totals PLATEAU 20.6→~23.8 at the cap (attribute
  inflation is dead); starGap (within-squad player-total spread) rises
  0.37→0.62 — the star-vs-role-players axis exists; MF passer split
  strengthens +0.31→+0.55; **strength selected 0.37→0.75** and **stamina
  goes from a downward random-walk (no price) to held ~0.56** — the budget
  gave the physical game a price; WG pace stops inflating (0.87 peak →
  0.83, clubs now CHOOSE between pace and dribbling); width THRIVES on 777
  (0.50→0.75). **Root-cause fix absorbed**: the cap exposed defending as
  under-priced — whole leagues drained DF points to fund attack (DFdef
  0.63→0.52, goals →3.1-3.4) — `tryTackles` defending weight 0.24→0.34
  (swept: reference-seed goals 3.07→2.65). Calibrate band 2.65 / 3.29 /
  2.56 (777 remains a hot possession-meta outlier; dials: defending weight,
  GK_RUSH_ENVELOPE, aim slope). Stoppage-time test bound corrected to
  refBlowsNow's documented holds (+10 tail; the old +0.05 was trajectory
  luck). No save bump (same schema; old saves settle onto the cap at their
  first season end). vitest 315, visual 75+37. Fingerprint `2c434e57…`
  (behavioral).
- ✅ **phase-49 SHIPPED** (visibility v1 — Stage 2): `evolution/styleSpace.ts`
  — a club's style is its point in the 33-dim (14 genes + 19 policy) space.
  **Data-driven NAMEPLATES** replace `describeIdentity`'s fixed buckets
  everywhere in the UI (team cards, clash banner, rebirth ceremony,
  evolve-check): up-to-2 fragments from where a club z-deviates ≥1σ from the
  CURRENT population, through a dimension→vocabulary grammar (33 football
  words, zh-localized; combinations are emergent, 'Balanced' must be earned
  away). **Style-space map** on the Evolution tab: clubs scattered on the
  season's two highest-variance dims (axes data-driven, kit-color dots +
  direct labels + drift trails over the last 8 recorded seasons);
  **divergence sparkline** (population spread per generation) and the
  **budget-allocation heatmap** (16×8, single-hue ramp) beside it.
  SeasonRecord grew `styleMatrix` (per-club vectors, snapshotted before
  evolution) — **proven record-only by strip-and-rehash back to exactly
  `2c434e57…`**. Dataviz rules applied (entity colors, direct labels, title
  tooltips, recessive grids). vitest 323 (styleSpace.test +8), visual
  **78**+35 (3 new checks: 16 map dots, 128 heatmap cells, nameplate tags).
  Fingerprint `85a7b813…` (schema growth only).
- ✅ **phase-50 SHIPPED** (fitness slimming — Stage-1E lever 1): fitness is
  RESULTS-dominant now — points 0.50 / GD 0.25 / shotQuality 0.10 /
  styleConsistency 0.15; **passCompletion, recoveries and staminaEfficiency
  DROPPED** (three uniform-virtue rewards = hidden designer taste pushing
  every club toward one texture; `recoveries` directly fed the press
  equilibrium). Evidence (`style-speed.ts` A/B vs the phase-49 worktree, 20
  gens × 2 seeds): **the speed target is ALREADY MET post-budget** — spread
  ≥0.08 sustained by gen 1 and 20-27 distinct nameplate fragments worn by
  gen 20 on BOTH configs, so slimming ships on principle + no-regression
  (spread 0.185/0.170 vs 0.190/0.198 ≈ equal); press end-state softened
  0.936→0.831 on the hot seed (mixed attribution with 48's defending
  reprice — honest note); DFdef selection recovered 0.53→0.82; calibrate
  2.91 / 3.13 in the post-46 band. ⭐ **The remaining speed levers (parent
  diversity, mutation thermostat, harder culling) are PARKED — not needed:**
  the budget + visibility already deliver fast visible divergence; revisit
  only if a future probe shows convergence. vitest 323, visual 78+37.
  Fingerprint `2eac71da…` (behavioral — selection changed).
- ✅ **phase-51 SHIPPED** (the EVOLUTION CENTER — user report 2026-07-14: "演化
  的看板不直观也不够详细，演化应该单独放一个"): evolution moves OUT of the
  league screen (which returns to pure data) into its own full-screen
  `EvolutionScreen` (top-bar 🧬 演化, mutually exclusive with 联赛中心).
  Architecture, hero first: (1) the style-space map with a **generation
  scrubber + ▶ playback** — watch styles drift season by season (styleMatrix
  history), clubs clickable, trails grow during playback; (2) **club deep
  dive** — nameplate/radar vs league mean/the club's own four most-moved
  style dims as curves/budget + squad + family tree; (3) the **dynasty
  wall** — 16 slots × generations of elite/reborn/promotion events;
  (4) population trends (divergence, formation shares, budget heatmap) with
  the old 22-tile wall folded into a <details>. UI-only (no sim change, no
  fingerprint move). Fixed en route: spark-tile head text collided on long
  labels (ellipsis now), screen background bled the pitch through. vitest
  323, visual 86+37 (evolution section rewritten for the new screen: map
  dots, scrubber, wall-select, nameplates, heatmap). Naming unified: 演化中心.
  NOT yet in it (next iterations as reports come in): per-club budget
  HISTORY (needs an attrMatrix record snapshot), era auto-naming on the
  timeline, cluster hulls on the map.
- ✅ **phase-51.1 SHIPPED** (user report: "风格空间这种可以放多个并列的图"):
  the hero becomes FOUR side-by-side lenses in a 2×2 grid — Overall plus
  attack/defence/build themed maps. Lenses are substrate grammar (the dim→
  theme grouping mirrors the policy-gene subsets); each lens's AXES stay
  data-driven (top variance within the lens). One scrubber drives all four;
  the selected club rings in every lens. `topVarianceDims(stats, theme?)` in
  styleSpace.ts. visual 87 (four-lens + 64-dot checks).
- ✅ **phase-51.2 SHIPPED** (facing polish, user report: 门将 hold 应面向对方
  球门（球也是）、任意球等摆位也应正确面向): one post-switch rule in
  `actionExecutor` — a keeper HOLDING the ball (`gkHoldTimer`/`gkDistributing`)
  faces `oppGoal()` (the held ball rides 0.3m along his heading, so it comes
  around with him), and a restart TAKER within 2.5m of the spot squares
  toward the play. Behavioral: takers no longer pay the accidental
  backward-facing kick penalty — restart quality genuinely improves.
  Calibrate 2.76 / 3.60 / 3.04 (777 stays the hot outlier; ⚠ WATCH the goals
  band creep across the emergence era — if play-feel says too many, dials:
  tryTackles defending 0.34→0.38, `GK_RUSH_ENVELOPE`, aim slope). Two test
  re-pins absorbed: the out-of-play invariant now tolerates the documented
  one-frame release-from-the-futsal-hug transit (≤3 frames, ≤1m) instead of
  a ±0.01 knife edge, and the keeper-throw seed list re-probed (8/38 under
  the new facing geometry). vitest 323, visual 87+37, fingerprint
  `3f4e16b1…` (behavioral).
- ✅ **phase-52 SHIPPED** (Stage 3 **W4 — the season chronicle**, zero sim
  change): `sim/chronicle.ts` — `titleRace()` reads the points timeline
  (mathematically-DECIDED round vs final-day, wire-to-wire, halfway rank,
  GD titles) into a coronation-flavored headline per season; chapters reuse
  the (now index-generalized) `seasonStories` + cup finals winner-first w/
  derby flag (decider-meeting count as of THAT season), QF+ upsets only
  (R16 kills are ~5/season noise), funerals compacted to one line with a
  🏚 epitaph for fallen GIANTS (honours scan includes the death season —
  cup-win-then-fold is the best tragedy), records-broken (needs 3 prior
  seasons), MVP. `evolution/eras.ts` — eras SEGMENTED by population
  style-centroid drift (min 3 seasons, split 0.045) and NAMED from data
  per the meta-rule: dynasty (≥max(2,half) titles) → style word (the
  nameplate z-grammar applied across TIME, minZ 0.9 — a clean two-age
  split sits exactly at |z|=1) → contested fallback; a one-era history is
  provably un-style-nameable (its centroid IS the mean). UI: league-screen
  **编年史 tab** (era-banded collapsible chapters, latest open) + era
  strip/legend riding the dynasty wall (per-generation cells wrap in
  lockstep with the club rows). Probe `chronicle-demo.ts` (30 gens × 2
  seeds): **5–7 eras** (mean ~4–6 seasons; mixed DYNASTY + style names —
  Tiki-taka/直塞手术刀/两翼齐飞 ages all emerged), race data 30/30
  chapters (4 sealed early, 7–11 wire-to-wire, 4–5 GD titles, 1–2
  comebacks), ~13–14 lines/chapter after noise pruning. Fingerprint
  **UNCHANGED `3f4e16b1…`** (pure derivation — the proof W4 was picked
  for). vitest 337 (+14), visual 95 (+8) + 37.
- ✅ **phase-53 SHIPPED** (Stage 3 **W1 — THE COACH**: the philosophy embodied
  + the memetic channel): the tactical genome, policy genes and formation
  identity moved off the club into a named, aging **`Franchise.coach`**
  (`evolution/coach.ts`; the club keeps squad/academy/budget/colors/Elo/
  prestige/rivalries/lineage). Same genetic operators, new transmission
  graph: **mutation = the same person rethinking; rebirth = HIRING a newgen
  coach** bred from the parent pool's philosophies (mentor = the dominant
  parent's manager — the mentor tree); dying clubs' managers enter an
  **unemployed pool**; a club on a **two-season bottom-third-fitness fuse
  SACKS** and hires from the pool — but only when the market's best
  `lastFitness` beats the incumbent (selective mobility, not churn), style
  travels with the person under the zonal budget (adapts to man when full).
  Coaches age (retire 62→certain 67), succession seeds a newgen from the
  retiree's philosophy; the dugout hall of fame keeps careers worth
  remembering (silverware or 6+ seasons). Save **v15** (bit-identical
  wrap migration, tested), `SeasonRecord.coaching` events → the chronicle
  gained 🪓 sackings / 🤝 hires / 🎓 winner-retirements. ⭐ **The
  monoculture HARD GATE PASSED** (`coach-mobility.ts`, sacking ON/OFF on
  identical leagues, 40 gens × 2 seeds): style spread ratio **1.15 / 0.98**
  (mobility even ADDS diversity on 424242), sacks ~0.4–0.5/season, zonal
  budget never breached, multi-club coaches exist. Emergent and kept: the
  pyramid churns clubs faster than coaches age, so in-post retirement is
  RARE — the dugout is a young man's game; legends mostly enter via the
  pool. evo-drift: the two seeds evolved DIVERGENT metas (424242 narrow
  press-tempo, width →0.13; 777 slow wide dribble, width 0.61 / drb 0.89)
  — cross-seed divergence, in-league spread guarded by the gate. Calibrate
  2.31 / 2.98 (population resample — founding draws changed; mean back
  inside the classic band, the 51.2 WATCH creep eased). Fixed en route: a
  fromJSON-built League has NO class-field initializers (Object.create) —
  the sacking flag arrived `undefined` and silently disabled the channel
  on every LOADED league until set explicitly. Fingerprint **REBASELINED
  `086d2cd7…`** (behavioral: founding + evolution draws). vitest 346
  (coach.test +8 incl. the save-roundtrip regression), visual 97 (+2) + 37.
- ✅ **phase-54 SHIPPED** (Stage 3 **W2 — PLAYER PERSONAL STYLE**): a small
  per-player decision-bias gene set — `evolution/playerStyle.ts`,
  `PLAYER_STYLE_KEYS = {shootBase, longShotW, dribbleBase, runScore,
  wallPassW}` as MULTIPLIERS (0.6–1.5) on the coach's evolved policy,
  wired through the long-dormant **`TeamInfo.rolePolicies`** exactly as
  the blueprint predicted. Emergence rules held: everyone is born ×1.0
  (the neutral bit-identity contract is unit-tested), divergence comes
  ONLY from academy bloodline mutation at succession (σ0.15 — the probe
  measured crossover blending + D2 rebirth pinning variance, so the
  personal layer mutates louder than attrs; styles are FIXED for a career
  — development changes what you can do, not who you are) + rebirth
  crossover + selection. Traits grew three **badges-of-genes** (🎲
  maverick / 🪄 trickster / 👻 shadow, bars at the probe-measured
  reachable tail 1.2 — their play effect IS the multiplier, already live
  through the policy wire; no second hand-tuned effect). **Personal
  nameplates**: z ≥ 1.25 vs the current 96-player population over 13 dims
  (8 attrs + 5 appetites) through a 13-word grammar — an unremarkable
  player wears NOTHING (no 'Balanced' for people). Career highlights
  banked on `PlayerCareer` (bestGoals/bestRating + season) → the in-match
  player card shows traits + plate + 🌟 highlight via a GameApp
  league-context callback. Save v16 (neutral backfill). Probe
  `player-style.ts` 30 gens × 2 seeds: role means differentiate (MF
  runScore −0.12 / longShotW −0.10, DF wallPassW +0.07 on 424242), 66–73
  of 96 players wear an earned personal plate, style words (The howitzer,
  Take-on artist, Never shoots) emerge in the tails. Calibrate 2.44 /
  2.96 (in band; styles neutral-born so the 8-season window barely moves).
  Fingerprint **REBASELINED `aedc3b17…`** (behavioral: succession +
  crossover draws). vitest 354 (+8), visual 97+37.
- ✅ **phase-55 SHIPPED** (Stage 3 **W3 — the FREE-AGENT FIRE-SALE**,
  minimal first cut, STAGE 3 COMPLETE): a dying club's players hit
  `League.freeAgents` (attrs + personal style + age + CAREER travel —
  `evolution/freeAgents.ts`, pool capped 12 best/youngest, ages out at
  31 or 3 idle seasons) instead of vanishing — the player-gene mirror of
  the coach pool. Signing is deliberately narrow: only at a RETIREMENT
  vacancy, like-for-like role, age ≤ 29, must beat the academy option
  (agent total > retiree + 0.2 — the newgen would be ≈ the retiree) and
  must fit UNDER the budget without taxing the squad (headroom =
  cap − total + leaver). Consequence, probe-measured (`fire-sale.ts`,
  30 gens × 2 seeds): ~1.9/season while the league is young, throttling
  to ~0.2–0.8 at cap maturity — **the fire-sale feeds the REBUILDING,
  not the rich** (D2 buys 42–48%); budget violations 0/960 club-seasons;
  careers genuinely survive their clubs (a 32-goal career spanning two
  of them). Signed careers CONTINUE (`career.seasons ≥ 1` is the
  newgen discriminator, unit-tested); the chronicle gained ✍ "signed X
  from the ashes of Y" lines; save v17 (empty market — no fabricated
  ex-players). If the mature market reads too quiet in play, the dial is
  the tax model (allow over-headroom signings, enforceBudget shaves the
  whole squad as the fee). Calibrate 2.30 / 3.02 (in band). Fingerprint
  **REBASELINED `85cb3f2a…`** (behavioral: signings skip newgen draws).
  vitest 359 (+5), visual 97+37.
- ✅ **phase-56 SHIPPED** (the PLAYER CENTER — user report 2026-07-14:
  "球员这个部分也需要对应的看板,比如性格,转会,风格"): the Evolution
  Center precedent applied to PEOPLE — a third top-bar screen (👥 球员,
  three-way exclusive with 联赛中心/演化中心), `ui/PlayerScreen.ts`:
  (1) the **player style space** — all 96 players scattered on the two
  dims the population disagrees on most (13-dim identity space, axes
  data-driven; GK/DF/MF/WG/ST role LENSES recompute axes within the
  lens — the 51.1 grammar), kit-color dots, click → select; (2) the
  **player deep dive** — trait chips (zh-named), earned nameplate,
  attribute bars + personal appetites as DIVERGING bars around the
  coach's ×1.0, career ledger + 🌟 best-season highlight; (3)
  **transfers** — the live free-agent market (🧳 ability/ex-club) + the
  signings chronicle mined from records ("from the ashes of...");
  (4) the **census** — trait distribution, earned-nameplate count,
  active career scorers. UI-only: fingerprint UNTOUCHED `85cb3f2a…`.
  vitest 359, visual **106** (+9: 96 dots, role lens →16, 13 dive rows,
  5 diverging bars, phone 390px) + 37.
- ✅ **phase-57 SHIPPED** (**N1 — the COUNTER-PLAY MATRIX probe**, the
  post-Stage-3 gate; probe-only, ZERO sim change, fingerprint untouched
  `85cb3f2a…`, vitest 359): `scripts/probes/matchup-matrix.ts` — 3
  worlds evolved 24 generations, 12 archetype snapshots (champion at
  g+8; champion + the 2 style-farthest D1 clubs at g+24), 66 pairs × 24
  friendlies, sides alternated, deterministic seeds (matrix reproduced
  bit-identical on rerun). **VERDICT: TRANSITIVE — the gate FIRES.**
  Decisive edges (|GD|>2·SE) 30/66; fully-decisive triads 21, **cyclic
  0** (pre-registered ecological threshold: ≥10%). One meta tops
  everything — narrow + direct + aggressive + risk-on ("Bone-crunchers
  / Runners in waves": Crimson Wolves avg share .741, Velvet Serpents
  .657) — and the dim↔share correlations name it: attackingWidth
  **−0.74**, passOpenW −0.73, riskTolerance +0.64, shootBias −0.54,
  markingAggression +0.51, runScore +0.48 — the whole possession/width
  family is strictly dominated. Era check: late beats early .607, and
  each world's OWN champion differs (Route one / High press / Bone-
  crunchers) yet 424242's Bone-crunchers beat all when thrown together
  — a single global attractor found at different speeds, NOT niches.
  The one hopeful trade: Route-one T05 holds the top dog dead even
  (.50) — the over-the-top axis already trades with aggro-press.
  Mechanism reading (why nothing counters): markingAggression buys
  +0.2 tackle success FIRST-ORDER while its costs (foul 0.06+MA·0.1,
  yellow 0.12+MA·0.12) live on the FAILURE path only, and the second
  yellow ≈ never binds in 240 sim-s; the Phase-41 width/drive gate is
  too weak against the narrow clump. Side note: cross-meta friendlies
  run hot — 3.45 goals/match vs the 2.3–3.0 co-evolved band (not a
  calibrate concern; co-adaptation suppresses goals). **Consequence:
  N1.5 (counter-payoff surface) inserted into the queue, N5 hard-gated
  behind it, and this probe becomes the standing regression gate —
  counters exist ⇔ cycles appear.**
- ✅ **phase-58 SHIPPED** (**N1.5 lever 1 — the ENERGY ECONOMY BINDS**,
  behavioral): the pre-lever diagnostic (`scripts/probes/aggression-cost.ts`)
  found full-time stamina at 0.98-0.99 — recovery (0.014/s) dwarfed
  drain (0.006·e²/s), so EVERY fatigue payoff was decorative: the
  stamina attribute, staminaConservation's "fresher legs late" (misers
  paid the slow-jog cost and never harvested — a strictly-losing gene),
  the tired-legs brain gate (needs <0.4, unreachable), cards (reds
  0.037/match). Aggression's +0.2 tackle bonus ran cost-free. The
  lever, swept {drain/recovery/lunge}: v1 (0.012/0.007/0.025) overshot
  — FT 0.51, goals 2.03; **shipped v2 = 0.010/0.009/0.020**
  (`STAMINA_DRAIN`/`STAMINA_RECOVERY`/`TACKLE_LUNGE_COST`; tackle
  lunges + cynical grabs call the new `Player.spendBurst` — win or
  whiff, the lunge costs legs). Probe-measured consequences: FT
  stamina 0.69-0.87 (binds, no sludge) with ~0.15 style spread; a
  first rock-paper-scissors trace in the diagnostic (SOFT>AGGRO .56,
  AGGRO>WIDE .69, WIDE>SOFT .75). **Matrix gate re-run: cycles still
  0/18 — N1.5 NOT done — but every precondition rotated**:
  markingAggression share-correlation **+0.51 → −0.54** (evolution now
  walks AWAY from Bone-crunchers), attackingWidth left the loser list
  (Overlap machine / Wings unleashed at dominance ranks 2/4), the era
  arms race dissolved (late-vs-early .607 → .524), matrix goals
  3.45 → 2.78. The meta ROTATED to T09 "Runners in waves / Compact
  block" (.752, unbeaten; nearest Tiki-taka .40) ⇒ **lever 2 = make
  the compact block's concessions REAL**: it cedes the flanks and the
  cutback zone, and cutbacks convert at ~6% (0.98/match → 0.06 goals)
  — the width-creates candidate (b) has a concrete target. Tests: the
  coach banking test now survives the legit winner-retires-same-season
  coincidence (banked() follows retirees to the hall, sacked/reborn to
  the pool), GK-throw seed re-probed (39 — same dance as 51.2), +2
  stamina mechanism pins (spendBurst attribute scaling; the
  gauge-can-never-go-dead regression, FT < 0.93 enforced). Calibrate
  2.38 / **2.03 ⚠** (424242 under the 2.3 floor — the world evolved
  lower-scoring styles, NOT sludge: FT stamina 0.69-0.87; counterfactual
  recovery 0.010 re-rolled BOTH worlds and didn't lift it — per-world
  goals are ecology-dominated, don't chase them with global dials;
  play-feel decides, dial = STAMINA_RECOVERY if the game reads dour).
  evolve-check: 5 champions / 10 gens, formations mixed. vitest **361**
  (+2). visual 106+37. Fingerprint **REBASELINED `ce0e5c2e…`**
  (behavioral: drain/recovery/lunge). Failure modes **25** (a wired
  payoff surface can be silently dead — probe the BINDING) and **26**
  (per-world metrics are ecology-dominated — don't chase with global
  dials) registered in ARCHITECTURE §10.
- ✅ **phase-59 SHIPPED** (**N1.5 lever 2 — the REACTION GATE: you can
  only touch a ball you can react to**, behavioral): the cutback
  anatomy (`scripts/probes/cutback-anatomy.ts`, iterated to kill
  telemetry) found the ceded arc was real but the DELIVERY died ~60%
  in flight — and 7:1 to the full-CAPTURE branch, not the deflection
  stretch: friction decays a 19 m/s pull-back under CONTROL_MAX_SPEED
  (14) mid-flight, and any bystander within 1.25m then got an
  UNCONDITIONAL touch (failed control still squirts = the pass dies
  either way). Two changes, one principle: (a) `tryDeflection` prices
  blind-side (`DEFLECT_BLIND_PEN` 0.75 — the retreating heel-zip mostly
  whiffs), (b) NEW reaction gate in `tryCapture` for bystanders on a
  LIVE pass (`CONTACT_BLIND_PEN` 0.7; contact odds fall with speed +
  blind arrival; intended receiver exempt, loose scrambles unchanged;
  a failed gate commits kickCooldown — no second bite). Probe-measured:
  delivery 33-40% → 43-50%; vs COMPACT shot rate 4.6%→13.1%, conversion
  1.4%→3.3%; vs PRESS 0.8%→5.4%; surviving kills' blind 0.39→0.27 (the
  filtered subset is exactly the blind-side one). League texture:
  completion 68%→73-76%, interceptions 22→18-21, through balls +26%,
  goals 2.30 / 2.11 (watch unchanged, 424242 still soft). **Matrix
  gate: the FIRST CYCLE — Tiki-taka > the-bus/Compact > through-ball
  surgeons > Tiki-taka (T4>T1>T9>T4); cyclic 4.5% of 22 decided (gate
  needs ≥10%); NO unbeaten king (top Copeland ±6, was ±9); the era
  arms race INVERTED (late-vs-early .607→.524→.431 — co-adaptation is
  now exploitable specialization = frequency dependence).** New
  dominance axis: crossBase **+0.87** — cross bombardment is the next
  lever candidate (watch whether the gate over-buffed box deliveries).
  Tests: mentor-tree titles pin ===→>= (seed-luck banking), direct-FK
  choice floor 75→40 of 250 (better pass ecology means the direct hit
  wins less often — ~19%, still regular; extinction is what the floor
  guards) + wall-climb scan 30→65 seeds, GK-throw seed re-probed (52).
  Calibrate 2.30 / 2.11. evolve-check 7 champions / 10 gens. vitest
  361. visual 106 + 3D all-pass (35 this run — shootout checks are
  scene-conditional). Fingerprint **REBASELINED `5ec853a4…`**.
- ✅ **phase-60 SHIPPED** (**N1.5 lever 3 — the UNSET WALL**,
  behavioral): the reception snapshot (cutback-anatomy extended) showed
  38-50% of delivered pull-backs arriving to a "blocked" shot corridor
  whose bodies were **64-83% UNSET** (sprinting goalward or blind — 83%
  vs the collapsing bus), yet both the shoot appetite (laneBlockers)
  and the block physics (0.32+def·0.25 flat) treated them as a set
  wall — so the arc arrival recycled (time-to-shot 2.4-2.9s, blockers
  at taken shots 0.00: only clean looks were ever dared). One
  principle, two sites: blockers now weigh by READINESS = facing ·
  stillness, floored at `UNSET_BLOCK_WEIGHT` — decision side
  `effectiveBlockers` (raw laneBlockers stays for stats), physics side
  in `tryShotBlock` via the incoming-ball-direction blind convention
  (bearing-to-ball is unstable at contact range). **The floor IS the
  attack/defense balance dial, sweep-proven**: 0.3 double-dipped
  (dared shots × weakened blocks) and broke the matrix — 0 cycles / 55
  decisive, EVERY defensive dim negative, attack über alles; **shipped
  0.55**: cutback→goal 6.1/4.6/4.7% vs NEUTRAL/COMPACT/PRESS (baseline
  1.4% vs COMPACT — 3.3×), shots now dare traffic (blockers-at-shot
  0.29-0.46, goal-rate held 29-37%), and the discount is
  frequency-SHAPED (helps most vs the 81%-unset bus, least vs the
  56%-unset press). **Matrix gate: 3 CYCLES / 40 decided = 7.5%**
  (trajectory 0→0→4.5→7.5% across N1.5 levers; gate ≥10%), defensive
  styles back in the top tier (Counter-punchers/Compact block #2, the
  bus mid-table), no ±9 monarch. Matrix goals 3.66 (cross-meta
  friendlies run hot; league calibrate is the dial that binds).
  Tests: the two Phase-31 block tests now SET their manufactured
  walls' heading + re-freeze during resolution (the contract is about
  set bodies), +2 readiness geometry pins. Calibrate 2.23 / 2.22 (⚠
  both seeds now just under the 2.3 floor but the cross-seed spread
  finally TIGHT; play-feel decides). evolve-check 6 champions / 10
  gens. vitest **363** (+2). visual 106+35. Fingerprint **REBASELINED
  `b59eeb10…`**.
- ✅ **phase-61 SHIPPED** (**N2 — SUBSTITUTIONS / the bench**, rotation
  as an EVOLVABLE strategy; save v18): rosters grow to NINE — six
  starters + a 3-man bench with NOMINAL DF/MF/ST roles (market
  matching/records; on the pitch a sub ASSUMES the slot he replaces).
  `SQUAD_BUDGET` 24→36 = the same per-player density, so **a deep bench
  is funded by a shallower XI** — the trade-off only bites once lineages
  grow to the cap. The substrate rule is minimal (laws-of-the-game
  only): subs at dead balls + half-time, `SUBS_MAX` 3, no re-entry,
  keepers stay; **WHEN is the coach's new `rotationBias` gene** read as
  a fatigue threshold (0.25+0.5·gene), WHO OFF = the tiredest body, WHO
  ON prefers the like-for-like nominal role; the entrant swaps the pitch
  slot's IDENTITY in place (`becomeSub` — every gid-keyed reference
  survives; fresh legs = stamina 1; cards are personal; 3D nameplates
  redraw on the swap). `MatchResult.playerStats` went ROSTER-indexed
  (a sub's goals land on HIS career) + the new `apps` field: rating
  averages divide by appearances, the MVP needs apps ≥ half his club's
  fixtures. **Probe (`subs-anatomy.ts`): the trigger BINDS, monotone**
  (fixed pair: bias 0/.5/.75/1 → 0/0/0.5/1.46 subs/team/match; subs
  arrive 2nd-half-heavy, q1/med 45'/54' at bias 1) — and under
  selection the surface is **ALIVE and ECOLOGY-DEPENDENT: world 424242
  selects rotation HARD (gene mean .465→.886 over 15 gens, league subs
  0→1.46/team/match) while world 991 keeps a mid spread (.478
  [.20–.80], ~0.5 subs)** — two worlds, two rotation cultures, not a
  uniform virtue. Calibrate **2.70 / 2.59 — BOTH SEEDS BACK IN BAND**
  (the phase-60 goals watch RESOLVES; fresh legs + the new founding
  ecology lifted scoring). ⚠ **Matrix gate RE-BASED: 0 cycles / 26
  decisive** — 9-man founding rosters change every creation-time rng
  draw, so these are NEW worlds (the 0→0→4.5→7.5% trajectory ended with
  its era); decisive-edge rate softened 59%→50%, no ±9 monarch, but
  pressIntensity correlates +0.87 — **rotation partially REFUNDS the
  phase-58 press fatigue tax** (rotate your pressers), which is exactly
  the meta CARDS THAT BIND (unblocked by this phase) prices from the
  discipline side. Shootout kicks stay starters-only (deliberate).
  Tests: vitest **368** (+5 subs/migration pins) — and the phase-60
  blocks retreater test was found LATENTLY RED on HEAD (it pinned the
  floor-0.3 literal "~1.5"; the final full vitest predated the 0.55
  sweep — a swept constant re-runs the FULL suite, ARCHITECTURE
  failure mode 27). evolve-check 8 champions / 10 gens, zonal at the
  ecology cap. visual 106 + 3D 37 (player center now plots 144).
  Fingerprint **REBASELINED `9357f90a…`**.
- ✅ **phase-62 SHIPPED** (**N1.5 lever 4 — CARDS THAT BIND**, discipline
  becomes personal and priced; save v19): bookings/sendings-off land on
  the MAN (`PlayerMatchStats.yellows/reds`); a red (any fixture) and
  every 3rd league yellow of a season (`SUSPENSION_YELLOWS`) cost him
  the club's next match — served by REAL lineups: `League.buildLineup`
  benches the banned man and fields the like-for-like nominal-role
  bench body in his slot (rosterIdx keeps stats on the right career;
  congestion valve for the unreachable 4+-bans case; keepers exempt =
  uncarded, no reserve GK by design; slate wiped at season end).
  **Probe A pre-registered the problem** (failure mode 25 discipline):
  at the old pricing the league drew 52-67 yellows/season (player
  median 0 — threshold-3 bans would be 2-4/season, a dead wire) and
  club yellows coupled to style at only r≈0.18 → the referee REPRICES
  with a steeper aggression slope (`yellowP` 0.12+MA·0.12 →
  0.16+MA·0.28). **Probe B (live system): 4/9 banned man-matches
  actually served per season across the two worlds, bans hit 3-7/16
  clubs, the worst offenders are MA 0.77/0.70 clubs (style-targeted ✓,
  club-yellows↔MA r up to 0.26/0.36), XI cover cost mild (bench ≈
  starter in the budget-headroom era).** Cards/match 0.84→1.18-1.25 🟨
  (reds 0.05-0.07; the ×0.45 booked-discount governor holds; cards.test
  band <2.0 ✓). Calibrate 2.57 / **2.29 ⚠ knife-edge** (the reprice
  re-rolled ecologies — failure mode 26, watch not chase; mean 2.43
  healthy). **Matrix: 0 cycles / 44 decisive — the N1.5 close FAILS**
  (press correlation halved +0.87→+0.43 but no frequency dependence;
  era arms race .762) ⇒ the decision point above. vitest **377** (+9).
  evolve-check 7 champions / 10 gens. visual 106+37. Fingerprint
  **REBASELINED `e5abf0da…`**.
- ✅ **phase-63 SHIPPED** (**the ROUTE-ONE / AERIAL channel** — the
  Everton lever, from the user's real-league reframe: tactical
  diversity stands on cheap specialist CHANNELS that different defensive
  structures can't all cover). The anatomy probe (`aerial-anatomy.ts`)
  decomposed the dead cross pipeline: **80-91% of open-play crosses
  produced NO aerial contact** — the delivery led the runner by his full
  vel×flight (the pre-31.9 corner bug alive in open play) AND the
  receiver's intercept solution parked him on the LANDING, where the
  ball arrives at his FEET (3-4m downstream of where it crosses the
  header band) — in the goal-side defenders' laps (45% of crosses died
  there). One principle, three sites: (1) the MEETABLE delivery —
  `CROSS_LEAD_FRAC 0.4` capped at `CROSS_LEAD_MAX 3.5m` (A/B: neutral
  alone — the receiver was compensating; kept as delivery sanity);
  (2) **attack the DESCENT, not the drop** — the 31.9 corner meet-point
  generalized to open-play ReceivePass (route 2.5m upstream along the
  flight line while the ball flies above control height): **attacker
  headers DOUBLED** (3.9→9.0% vs PRESS, 6.3→12.5% vs NEUTRAL);
  (3) **STRENGTH owns the air** — `aerialSense` reweighted (defending
  0.3→0.15, strength 0.1→0.3; the aerial payoff phase-47 assigned to
  strength is finally real, and the tall-CB COUNTER is buyable the same
  way). Honest boundary: the strength gradient's end-to-end effect at
  6v6 is subtle (TM ≈ GEN in 250-match A/B — one big man is a small
  term in cross-volume × contest-rate × duel-delta × conversion);
  channel EXPRESSION is left to selection. Per-cross direction now
  exists: shot 28-34% vs PRESS/NEUTRAL vs 12-19% vs BUS — **the press
  fears the delivery, the bus eats it**. Matrix (standing check):
  still 0 cycles BUT decisive edges 56%→39%, the era arms race
  DISSOLVED (.762→.528), and the top archetype is **"All-in risk /
  Cross bombardment" (±8, .667)** with High line/Wings #4 and High
  press styles bottom — the channel is a winning strategy in evolved
  worlds one phase after being unplayable. Calibrate 2.74 / **2.10 ⚠**
  (424242's third straight low: 2.22/2.29/2.10 — ecology-tilted,
  failure mode 26; the band-vs-play-feel question is now urgent).
  League headers won 2.8→3.9/match. Tests: +2 aerial pins (strength
  duel directional, open-play attacker-header floor 3%) + two
  seed-luck fragilities hardened (league identity accepts fire-sale
  signings; coach sack test accepts same-pass rehire). vitest **379**.
  visual 106+37. Fingerprint **REBASELINED `0e93940a…`**.
- ✅ **phase-64 SHIPPED** (**the UNDERDOG SHIFT** — opponent-CONDITIONAL
  tactics, the Klopp/bus lever from the real-league reframe; save v20):
  new gene `underdogShift` — how far the coach bends toward the bus
  (compact +0.3, depth −0.3, press −0.25, counter +0.3, risk −0.15,
  tempo −0.1) when OUTGUNNED, read from the kickoff Elo gap (sensor:
  150 Elo = a full class apart — the first cut at /300 left in-league
  factors at 0.11-0.19, a sensor whose range never met its signal;
  corrected, factors run mean ~0.3 / p90 0.55-0.79). Applied ONCE at
  kickoff into `Team.baseGenome`; the score/clock mentality layers on
  top; identity for favorites, purists (gene 0) and Elo-less team
  sheets (probes/tests/replays bit-safe). **Mechanism probe
  (`conditional-anatomy.ts`, n=600 side-balanced): at a REALISTIC gap
  (0.45 vs 0.55 attrs, 150 Elo) the full pragmatist earns +0.15
  pts/match (0.90→1.05, ≈3σ) and saves a third of the deficit (GD
  −0.66→−0.41); against a juggernaut (0.42/0.58, 300) it still trims
  blowouts (GD −0.96→−0.74)** — the bus is worth most against
  somewhat-stronger sides, exactly the football shape. Under selection
  the gene stays mid-with-spread (424242 ~0.55, 991 ~0.43 [0.00-0.78])
  — a conditional tool's per-season fitness is small; the SUBSTRATE
  now supports the behavior, selection is weather. Migration backfills
  ZERO (the purist — migrated clubs play exactly as before). Calibrate
  **2.90 / 2.99 — both seeds high in band; 424242's three-phase low
  streak (2.22/2.29/2.10) dissolves, confirming ecology-luck (failure
  mode 26)**. Matrix: 0 cycles / 41 decisive, era .662 (the weather
  turns per phase — noted, not chased). ⚠ WATCH (evolve-check, one
  world): def-formation ecology skewed to low-32 15/16 with zonal
  extinct and press-23 at 1 — the shift may make deep-block play
  selectable enough to crowd the def-formation menu; attack diversity
  IMPROVED (narrow 9 / wide 7). vitest **383** (+4: shift unit,
  kickoff integration, purist/Elo-less identity, v20 migration).
  visual 106+37. Fingerprint **REBASELINED `7878ed9b…`**.
- ✅ **phase-65 SHIPPED** (**the FREQUENCY-DEPENDENCE yardstick — N1.5
  CLOSED**; probe-only, zero sim change, fingerprint untouched
  `7878ed9b…`): `freq-dependence.ts` measures, per style axis and
  in-league, corr(the axis's population share, its holders' relative
  points) over 30 seasons × 2 worlds. Verdict: **7 SELF-BALANCING
  readings** (negative FD — the style's payoff falls as it spreads:
  rotationBias −0.71, dribbleBias −0.66, markingAggression −0.56,
  attackingWidth −0.51, defensiveCompactness −0.42, atk wide-212
  −0.39, keeperAggression −0.31), ~25 neutral (drift under
  constraints), and **ZERO runaway** — no axis in either world grows
  stronger as it spreads. The user's original question ("can the game
  grow self-sustaining tactical diversity?") answers YES: the ecology
  actively self-limits its commonest styles and has no
  winner-take-all meta. The ≥10%-cycles criterion is retired with
  reasons in the N1.5 section; the matrix stays a descriptive
  anatomy tool. The which-axes-balance set differs per world —
  ecology-dependent, consistent with every N-era finding.
- ✅ **phase-66 SHIPPED** (**N3 — COACH MATCH-DAY PRESENCE**; save v21):
  the game-state response stops being an anonymous law and becomes the
  PERSON's temperament. (1) New gene `tinkerBias` scales the Phase-35
  mentality layer's MAGNITUDE — `mentalityOf(diff, minute, tinker)`,
  factor 0.5+tinker, clamped: 0 = the stoic at half response (he can
  NEVER reach the ⚡ 0.8 feed threshold — his silence is the
  personality rendering), 0.5 = the shipped curve bit-exactly (the
  default argument, so every existing fixture/test reads unchanged),
  1 = the tinkerer at ×1.5 who hits the full chase early and keeps
  pushing lost games (down 3 → urgency 0.75 vs 0.5). Read from the
  RAW genome — personality is not bent by the underdog shift.
  (2) Attribution: ⚡ surge, 🧊 shut-down and 🔄 subs are the COACH's
  lines by name (club-name fallback for ad-hoc sheets/old replays,
  same emoji prefixes — no test/UI churn), and the Phase-64 underdog
  shift gets its FIRST narration: one 🚌 kickoff line when s ≥ 0.4
  (small leans stay silent, failure mode 7). (3) The 3D dugout:
  `CoachModel` — suited figure, club scarf + nameplate, in each
  technical area on the bench apron (±8, HALF_W+1.7, clear of the
  walk-off fan), tracks the ball with an eased pivot, sways idle, and
  leaps while HIS side's celebration plays; render-only, own scene
  group so raycast picking never sees him; ad-hoc dugouts stay empty.
  **Mechanism probe (`tinker-anatomy.ts`, n=400 paired — blocks
  bit-identical until the 68' ramps): the dial is two-faced, not a
  uniform virtue (fm 22) — trailing@68 the ×1.5 chase buys NOTHING
  (pts 0.10→0.09, GF 0.23→0.24) and bleeds counters (GA 0.31→0.38),
  while leading@68 the harder shut-down PROTECTS (+0.16 pts/game,
  2.65→2.81). Selection: 30 gens × 2 worlds — means wander 0.35–0.55,
  spread stays full-width [0.00…1.00], zero corner runaway; a live,
  ecology-priced axis (the rotationBias pattern).** Migration v20→v21
  backfills 0.5 (migrated clubs respond exactly as before; geneMeans +
  coachPool + evolution entries covered). Identity tags: Tinkerman /
  Trusts the XI. Gates: vitest **392** (+9: tinker curve pins, match
  integration + coach-line attribution, 🚌 narration + fm-7 silence,
  v20 migration, theme-carries-coach); visual **106 + 38** (new 3D
  check: 2 coaches stand the touchline); evolve-check healthy (styles
  coexist, def menu balanced 9/7 — the phase-64 low-32 watch did not
  worsen); fingerprint **REBASELINED `9a23d408…`** (new founding rng).
  ⚠ calibrate **2.15 / 2.13** — both seeds ~0.2 under the 2.34
  same-code center but inside the measured spread (1.83–2.62, fm 18),
  and the probe shows the mechanism ADDS late goals (0.54→0.62/decided
  game) — the dip reads as founding re-roll, watch not chase (the
  phase-62 precedent). The play-report queue now carries EIGHT unplayed
  behavioral phases; the next report should watch the dugout and the
  goals band together.
- ✅ **phase-66.1 SHIPPED** (user report on 66: "coach 得有点对应的动作,
  观众席也是" — the dugout REACTS, the stands LIVE; render-only, zero
  sim change, fingerprint untouched `9a23d408…`). COACH: `despair` on
  conceding (hands to head, shoulders slump, no leap — despair stays
  rooted), a `nudge()` lean-in on every strike (FxSystem's deduped
  onShot), and PERSONALITY animated from the SAME gene the feed
  narrates — the renderer replays `mentalityOf(diff, minute, tinker)`
  per side per frame, and the tinkerer works the touchline (arm pump +
  off-arm flail at 6.5rad/s, amplitude = the live mentality level)
  while the stoic (tinker < 0.3) folds his arms for ninety minutes.
  `RenderTheme.teams` carries `tinker` alongside `coach`. CROWD: the
  Phase-31.6 seated instancing moved out of the static pitch group into
  `CrowdSystem` (`terraceSlabs()` now exported — one layout, slabs and
  seats can't drift apart): identical silhouette (same LCG, ~270 seats,
  2 draw calls), but instances belong to the update loop — idle
  sway/bob, `ripple()` on shots (0.4) / saves (0.55) / corners (0.3),
  `erupt()` on goals: every fan jumps on his own beat (upward-half sine
  — they land IN their seats), ~2.6s decay; frustum culling off (the
  span blinked at oblique angles once instances moved). Per-frame cost
  ~600 matrix writes + 2 uploads — phone-safe. Gates: vitest 392 (+1
  theme-carries-tinker assert), visual 106+**40** (new: crowd seated
  ≥200; stands stirred >0.1 arousal during live play — polled, not
  timed), goal-moment screenshot eyeballed (fans at scattered heights
  mid-eruption, banner same frame, arousal 0.98). No probe beyond the
  choreography checks — no sim behavior to measure.
- ✅ **phase-41.2 SHIPPED** (user report "球员带着球,转了一大圈身,然后
  突然球丢了" — the 1v1 family, carrier side: slalom COMMITMENT + the
  drive-protection reprice). Anatomy (`spin-loss.ts` n=60 paired +
  `spin-trace.ts` frame transcripts): the dribble evasion recomputed its
  perp SIDE every frame from an instantaneous cross product, so a
  defender shadowing the carrier ON the goal axis flipped it every
  0.25-0.6s; the body turn-rate cap integrated the flip-flop into a
  full pirouette at walking pace (v≈2.4 ⇒ drive≈0.27 ⇒ no pace
  protection) until the 1.1m tackle roll landed — the reported shape
  exactly. Fix in `dribbleTarget`: per-carrier `slalomSide/slalomUntil`
  (Player fields, deterministic, no rng) — pick a shoulder, hold 0.6s,
  and re-picks are HYSTERETIC (|cross| ≤ 0.3·blockD keeps the committed
  side; only a decisively parked blocker flips — reads as a deliberate
  cut). First cut WITHOUT hysteresis only halved the cadence (a
  mirroring shadow made every expiry re-pick a coin flip). Measured:
  pirouettes (osc ≥103°/s, the flip-flop signature) 1.38→0.63/match,
  ≥200° spins 0.7→0.3, spin→tackle 0.15→0.08; survivors trace as single
  committed cuts (bend-and-cut-inside, ending in clean releases).
  **The balance ledger**: honest movement bought too much — 3-seed
  paired calibrate (default/424242/2024) 2.15/2.13/2.58 →
  3.24/2.32/3.51 (mean +0.74) and evo-drift 424242 re-collapsed width
  0.52→0.14 under a dribble monoculture (the master-gate inversion:
  dribbling paying TOO well kills width the same way not-paying did).
  ⇒ ONE lever: tryTackles drive protection 0.20→0.16 (the coefficient
  was priced against pirouette-throttled drive; the trim restores the
  designed effective protection). At 0.16: paired goals 2.49/1.89/2.74
  (Δ+0.09 vs pre-fix — neutral), evo-drift width 0.48@gen30 ≈ baseline
  0.476, dribble/press within baseline wander. Aerial channel A/B'd
  HEALTHY (aerial-anatomy per-cross attacker headers 6.6→7.3%
  GEN/NEUTRAL; league calibrate headers 2.94→2.89). Two statistical
  pins hardened (the phase-64 precedent): keeper-throw seeds 52→35/53
  (re-scanned 1..60), cross-header floor n=20→80 (the n=40 fail was a
  2%-tail seed streak — the same config at n=120 measures 6.0%, twice
  the floor). Gates: vitest 392; visual 106+40; evolve-check styles
  coexist; fingerprint REBASELINED `0c9fd268…`. ⚠ WATCH: (1) the
  low-32 def-menu skew RE-FIRED in the evolve-check world (def 15/1,
  atk 15/1 wide — stronger carriers make deep blocks the rational
  answer; N5's formation-library problem, don't chase here); (2) the
  goals band spans 1.89-2.74 across seeds — the user's play-feel
  verdict on scoring is still the open question from phase-66.
- ✅ **phase-67 SHIPPED** (**N5 — the FORMATION LIBRARY** + the honest
  re-temper of 41.2). (1) Two novel attack shapes join ATTACK_FORMATIONS:
  `twin-st` (GK/DF/MF base, one true left feeder, a high pair at ±6
  splitting the CBs) and `false-nine` (ST drops to −2 in the hole,
  wingers at +12/±18 running the vacated space). DISCOVERED, never
  seeded: founders still derive only the classic pair; entry is the
  rare style mutation with the menu weighted 1/1/0.35/0.35 (the zonal
  entry lesson); exits are free (reversibility = the safety valve);
  reborn clubs copy parent style and coaches carry theirs, so a shape
  that WINS spreads through persistence, rebirth and the dugout market.
  **Emergence (shape-emergence.ts, 60 gens × 2 worlds, final config):
  tried in both worlds; world 991 grew false-nine into a real
  discovered meta (peak 9/16, gen-40 wide-212 extinct at 0) and its
  gen-60 menu holds THREE shapes at once (wide 3 / narrow 6 / false9
  7) — the first structural coexistence in the project's history;
  world 424242 stays wide-led with novelty visiting (peak 5/16). No
  monoculture anywhere on the attack side.** Head-to-head at flat
  genes the novel shapes are honest (twin-st GF 1.11 GA 1.26, W-L
  70-82; false-nine 1.35/1.39, 77-86 vs wide-212). League calibrate
  is library-NEUTRAL (3-seed paired Δ+0.01). (2) The 41.2 CORRECTION
  (fm 28, new): its ledger calibrate ("Δ+0.09, 2.49/1.89/2.74") was a
  phantom — a BACKGROUND stash-race measured a never-shipped hybrid;
  true 41.2 ran 2.76/2.29/3.59 (≈+0.6). The heat traced to penetration
  DEPTH, not duel survival (drive knob saturated: 0.16→0.14 moved
  nothing) ⇒ tempered at the source: slalom perp weight capped 1→0.72
  (max cut ~60° — the defender keeps a play at close quarters).
  Final: calibrate 2.76/2.06/3.26 (mean 2.69), pirouettes 0.58/match /
  spin→tackle 0.03 (the 41.2 fix intact), width master gate re-passed
  (0.42@gen30 ≈ baseline), aerial channel healthy. Two fragile pins
  re-anchored (throw seeds → 9/65 after a 1..140 rescan at ~6% rate;
  the stoic-silence assertion now pins HIS line only — the tinkerer
  may legitimately 🧊 in the natural run). Gates: vitest **394** (+2:
  founders-stay-classic, novel-shape playability), visual 106+40,
  evolve-check healthy, fingerprint **REBASELINED `484c5704…`**.
  ⚠ WATCH: (1) world 991's DEF menu ended 16/0 low-32 — a binary
  defensive menu can't answer discovered attack shapes; the def-side
  library (mid-block / a third shape) is the next structural lever
  (N5b); (2) the goals band now sits ~2.7 mean (2.06-3.26 across
  seeds) ≈ real-league scoring — whether the old 2.3-2.6 contract
  still binds is the PLAY REPORT's call, now NINE unplayed behavioral
  phases deep.
- ✅ **phase-68 SHIPPED** (**N4 — the TACTICAL BROADCAST layer** + the
  phone full-page fix; render-only, fingerprint UNTOUCHED `484c5704…`).
  Evolution becomes visible IN PLAY, in TV-graphics language on its own
  `broadcast` flag (PRESENTATION section, default ON — product, not the
  debug overlays): (1) `BroadcastLayer` — the defensive-block HULL, a
  soft team-colored fan + edge loop under the defending outfielders
  (gift-wrap over 5 points, preallocated buffers, +1.2m margin so
  bodies stand inside their block) — compactness/depth/shape identity
  readable at a glance; (2) PRESS WAVES — while the defending side's
  mode is Press, its assigned chasers emit expanding ring pulses
  (pooled ×8, 0.9s life, spawn cadence 0.7s): the pack is visibly ON;
  (3) the MINI FORMATION MAP — a 168×112 canvas inset (126px on
  phones), tiny pitch + twelve dots + ball, updated per frame, hidden
  while the shootout theater owns the stage. `RenderState` gains
  possession/modes/press (light, always built; old replays lack them →
  the layer stays dark, interpolation passes them through late).
  + **the phone FULL-PAGE fix** (user report mid-phase): evolution (51)
  and player (56) centers were letterboxed at ~260px on ≤640px — they
  postdate the Phase-28.3 league fix and their base rules sit AFTER
  that media query, so the override must live in a LATE block (same
  specificity, source order decides). Now 657px full-viewport.
  Gates: vitest 395 (+1: broadcast fields + interpolation); visual
  **109 + 45** (new: full-page ×2 + width ×1 on phone; inset shows,
  block drew, wave pulsed, toggle hides/restores); fingerprint
  IDENTITY-verified (no sim edit); the GL canvas is now `.gl-canvas`
  (the inset made '#three-host canvas' ambiguous — suite selectors
  tightened). Screenshot eyeballed: hull + inset + pulses read as
  broadcast graphics, not debug lines.
- ✅ **phase-69 SHIPPED** (**the CHIP 挑射** — user ask 2026-07-17, first
  of the curve-ball trilogy; sim change, fingerprint REBASELINED
  `ae193cb1…`). The finish lofted over a keeper who has left his line:
  `tryChip` inside performShot mirrors the free kick's two-constraint
  closed form — z ≥ GK_CLAIM_HEIGHT+0.25 passing the keeper (a ball
  above the claim ceiling is unsavable by construction), arrival height
  drawn 0.8–2.7 at the line (over the bar = the honest overhit, the FK's
  blaze-over trick). FEASIBILITY IS GEOMETRY, the attempt is a price
  comparison, and every counter is emergent rather than scripted: a
  keeper in the shooter's face smothers the launch in its low first
  meters; a keeper at home leaves no gap (along ≤ d−5.5 fails); a
  floaty lob is rejected up front (hang >1.45s); a short chip drops
  into the claim. Two probe-driven tightenings: the CAUGHT-OUT gate
  (≥7.5m off the goal center — the first cut chipped routine KA-0.5
  positioning 3.9×/match) and the clearly-better price bar (q·1.2+0.03
  — the lob stays an EVENT: in-league 0.5–1.0 attempts, 0.12–0.20
  goals/match ≈ 7% of scoring). Anatomy (chip-anatomy.ts, 300
  side-balanced per cell): routine keepers 0.03 chips/match, the
  extreme sweeper (KA 0.9) 3.5/match at 26% conversion and NET LOSES
  the fixture (attacker 1.17→1.33→1.67 goals across KA 0.1/0.5/0.9) —
  the tax scales with exactly the gene that creates the gap.
  **Selection verdict (30 gens × 2 worlds): ecology-dependent, the
  best kind — world 424242's keepers RETREAT (KA mean 0.42→0.24,
  sweepers got farmed) while world 991's DOUBLE DOWN (0.49→0.73: the
  false-nine/deep-block world, where sweeping through balls still
  outearns the chip tax). A conditional trade the ecology prices per
  world, not a uniform virtue or death sentence (fm 22 clean).**
  Calibrate 3.02/2.28/4.10 vs 68's 2.76/2.06/3.26 — decomposed via
  shotLog: ex-chip 2.84/–/3.99, i.e. direct chip contribution +0.15–0.2
  and 2024's remaining jump is that world's usual heat (its 5-phase
  history: 2.58→3.26→3.51→3.59→3.70→4.10 — the league's hottest seed).
  ShotLogEntry gains `chip?: boolean`; the feed narrates "chips the
  keeper!". vitest **399** (+4, incl. flight-sampled unsavability over
  the keeper and bit determinism); visual 109+45.
- ✅ **phase-70 SHIPPED** (**弧线传球** — the curve trilogy's parts 2+3;
  sim change, fingerprint REBASELINED `bd7ba2da…`). (1) AERIAL SWING:
  `aerialSwing` gives lofted switches and dinked through balls a
  technique-priced sidespin (0.12+passing·0.18) whose BULGE leans away
  from the nearest defender to the drop zone (clean drop = a gentle
  outswinger toward the flank); loftKick's pre-compensation keeps the
  landing where it was aimed, so completion moves only through who can
  meet the ARC. (2) The ground BENDER: `groundBend` + `bentKick` curl a
  through ball around a leg pinching the seam (perp < 1.3), compensated
  EXACTLY for grass spin decay; the whip is FLAT 0.45×tightness and the
  price is a weight error technique tames. Three probe-driven verdicts
  that shaped the design: **ordinary circulation passes stay
  deliberately straight** — the first cut bent them too and the zonal
  press-23 block's measured height collapsed onto low-32's (the
  formations directional contract INVERTED; binary isolation pinned the
  circulation bender as the sole culprit — bending the short game
  defeats the lane-jumping that IS pressing, an ecology tax phases
  58-61 fought to avoid); **the passing-scaled whip inverted the skill
  gradient** (0.9-passing squads did WORSE than 0.2 — bigger bends,
  bigger deviation) so the whip went flat and technique's edge moved
  wholly into the weight error; **per-delivery the bender is neutral
  within noise** (staged pinched seams n=400: 86.3% straight vs 84-85%
  bent, σ±1.8pp) — shipped for the visible curve and the gradient, not
  as a completion buff, with the finishing-conversion contract
  restored by the tempering (it had inverted under the free-bending
  first cut). League: through balls 8.95→10.97/match, completion
  78→76%, goals mean 2.79 ≈ 69's 2.80 (dead neutral). Keeper-throw
  pins re-anchored (seeds 35/42, the fifth dance — 51.2/58/59/41.2/67
  precedent). vitest **402** (+3); visual 109+45.
