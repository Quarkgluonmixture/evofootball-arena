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

## Status ledger

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
