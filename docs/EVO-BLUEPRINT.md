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
