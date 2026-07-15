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
  - ⭐ lever 2 (next) — make the COMPACT BLOCK's concessions real: it
    cedes the flanks + the cutback zone, and cutbacks convert ~6%
    (0.98/match → 0.06 goals — near-dead payoff). Width/crossing play
    must actually harvest what the low block gives away.
  - candidates beyond: (c) amplify route-one-over-press; cards that
    bind (couples with N2's suspensions infra).
- **N2 — SUBSTITUTIONS / the bench** (Stage 4's planned first item): the
  biggest missing tactical surface — rotation as an evolvable strategy,
  stamina gets strategic expression, late-game personnel responses;
  red-card suspensions and injuries are gated behind this
  infrastructure.
- **N3 — COACH MATCH-DAY PRESENCE**: the coach stops being a nameplate —
  the existing mentality/game-state adjustments get ATTRIBUTED to him
  (gene-driven adjustment personality: the tinkerer vs the
  trust-the-XI stoic), adjustments narrated in the feed, and ⭐ **the
  coach STANDS ON THE TOUCHLINE in the 3D view** (user addition: a
  visible figure by the technical area — reacting is the polish, being
  THERE is the point). Couples with N2 once subs exist.
- **N4 — the TACTICAL BROADCAST layer**: make evolution visible IN PLAY,
  not just in dashboards — pressing-wave highlights, defensive-block
  outline, a live mini formation map; presentation-grade, not the debug
  overlays.
- **N5 — FORMATION LIBRARY expansion**: 2×2×2 shapes is the hard ceiling
  on visible structural diversity; add 6v6-honest attack shapes
  (asymmetry, twin ST, deep-forward) as RARE mutations under an ecology
  budget (the zonal lesson, failure mode 21).
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
