# MT-T2 — THE CO-EVOLUTION LIVE A/B (selection sets the dose)

> **Status: FROZEN, NOT YET RUN.** Everything below — arms, horizon, read points, seed
> rule, thresholds, predicates and the three pre-named outcome forms — is frozen ex ante,
> before any full-run number exists, and is not re-cut afterwards.
> [§RESULT](#result--the-run) is **empty by design**: the commander launches the full run
> detached per [§LAUNCH](#launch) and adjudicates it.

Authority chain: contract [`MARK-TIGHTNESS-CONTRACT.md`](MARK-TIGHTNESS-CONTRACT.md) §3
(**"MT-T2 / exit = live A/B + the user's play-test"**) · §1 **H-MT** · §4 the non-claims.
Dispatch: **ruling #205** (the user ruled 甲 — *selection sets the dose*): arm
`evolveMarkSag` + `evolveDefLaneConvergence` in a live evolution A/B against an un-armed
control, fitness stays **WIN-ONLY** (the **#167 Leg-S rule** — no fitness shaping toward the
sag), genes **born absent at generation 0**, three pre-named outcome forms.
The question this answers is **#204's cost finding**: at gene = 1 on both teams the band
broke (goals 2.195 → **1.61375**, headers −46 %, crosses −26 %, longBalls −41 %) while the
body compression delivered (−2.41 m). *Where does selection settle the genes, and does the
equilibrium restore there?*

⭐ **THE NAMED PRECEDENT, REUSED**: [`A4-S2P3-GENE-BATTERY.md`](A4-S2P3-GENE-BATTERY.md) **§5
LEG S** — its arming form, its probe-side selection loop, its win-only fitness line, its
gen-0 born-absent assertion, and its ⚠ *"presence rises MECHANICALLY"* reading note. Every
difference from it is disclosed in §7.

Ruler: [`MT-T1-RULER-RERUN.md`](MT-T1-RULER-RERUN.md) §RESULT and its **committed artifact**
[`data/mt-t1-ruler-rerun.json`](data/mt-t1-ruler-rerun.json) — the deflated levels are
**read from that file and rehashed in-probe** (#181.2), never typed into this doc as gate
inputs. Seams: [`MT-T0-DORMANT-SEAM.md`](MT-T0-DORMANT-SEAM.md) ·
[`PM-T0-DORMANT-SEAM.md`](PM-T0-DORMANT-SEAM.md).

Probe: [`../../scripts/probes/mt-t2-coevolution.ts`](../../scripts/probes/mt-t2-coevolution.ts).
Artifacts: [`data/mt-t2-coevolution-smoke.json`](data/mt-t2-coevolution-smoke.json)
(committed, this round) and `data/mt-t2-coevolution.json` (the commander's run).

---

## §1 The question, in the order it is asked

1. ⭐ **DOES SELECTION ENGAGE?** With the two opt-ins armed, win-only fitness and both genes
   born absent, where does the population put them after 25 generations — and is that
   distinguishable from the un-armed control's structural zero?
2. ⭐ **DOES THE EQUILIBRIUM RESTORE THERE?** At the evolved dose, does the band
   (goals/crosses/headers/longBalls/cutbacks) sit back inside the inherited tolerances, or
   does the #204 deflation persist?
3. **DOES THE BODY STILL COMPRESS AT THE DOSE SELECTION CHOSE?** MT-T1 proved compression at
   gene = 1, a hand-set dose. This re-reads the same quantity on the **evolved** genomes.
4. **WHAT ELSE MOVED** — style divergence (the VISION §1 promise), the attack-side gene
   pool's response, the #157 debt counters. **REPORTED, never gated.**

## §2 ⭐ THE FROZEN DESIGN — the two arms

| arm | `evolveMarkSag` | `evolveDefLaneConvergence` | what it is |
| --- | --- | --- | --- |
| **ARMED** | **true** | **true** | the genes may enter via mutation/crossover from their born-absent state. **Nothing is pre-seeded.** |
| **CONTROL** | false | false | identical league seeds, identical founders, identical fitness; both genes stay **structurally absent** for all 25 generations |

⭐ **THE ARMS DIFFER IN EXACTLY TWO BOOLEANS** — the two `MutateOptions` **evolution** opt-ins.
**Both arms carry the two CONSUMPTION flags ON** (`pmLaneConvergence: true`, `mtMarkSag:
true`) plus the identical percept flags, so **both seam branches are ENTERED in both
worlds**; in CONTROL the mutation law never writes either key, so both weights evaluate to 0
on every tick. That world is exactly MT-T1's **ARMEDZERO** arm, which MT-T1's `gCtrlEq`
proved byte-identical to the flags-off world. Making the consumption flags **common** is
what reduces this A/B to ONE difference: *may selection touch the two genes at all.*

`gGen0` proves the consequence: **generation 1 is the same world in both arms** (identical
founders from `randomGenome`, both keys absent ⇒ the whole gen-1 stat row is canonically
equal). Smoke evidence: `goals armed 2.333 / control 2.333` at gen 1.

### §2.1 The gene channel — no engine-side dose surface

Population genomes are written onto **all three genome views** (`info.genome` / `baseGenome`
/ `effGenome`) of both sides — the `a4World` `armGenes` idiom, **#196.3-D6** honoured
literally. An absent key is written **nowhere** (it is deleted), so a control genome is
byte-absent, not zero-valued.

### §2.2 FITNESS IS WIN-ONLY, and provably blind to the genes

```text
fitness_i = points_i + goalDifference_i × 1e-3        (points 3/1/0)
```

A4-S2P3 §5.2's own line, verbatim. `gFitnessBlind` asserts it **two ways**: (a) the probe's
fitness function takes only the season table — **no genome is in scope**; (b)
`src/evolution/fitness.ts`, `src/sim/League.ts` and `src/evolution/evolve.ts` contain **zero**
occurrences of either gene name, so nothing anywhere shapes fitness toward the sag (#167).

## §3 ⭐ THE HORIZON — traced, not invented

```text
generations            25          read points: generation 8 and generation 25
league size            10 teams
matches per generation 45          a single round robin
elite 2 · reborn 2 · mutated 6
mutated   rate 0.40 scale 0.08     ← evolveGroup's own law, verbatim
reborn    rate 0.50 scale 0.15     ← evolveGroup's own law, verbatim
parents   top 4, weights 4/3/2/1   ← evolveGroup, verbatim
evolution RNG          771,001 + leagueIdx     (a THIRD namespace)
neutral-drift RNG      772,001 + leagueIdx     (a FOURTH, touching no match)
snapshots              EVERY generation (gene mean/sd/max, fitness–gene r, the band,
                       the debt counters, the attack gene pool)
```

**Both anchors are the dispatch's own** (#205.2):
* **@8 / @25** come from the **vision/positioning CO-EVOLUTION arc** (`docs/ROADMAP.md`,
  2026-07-20): *"goals @8 = 2.47 (attack leads early) → @25 = 3.09 (the lead CLOSED) while
  interceptions @25 = 19.81 vs base 15.62 (+27 % — a reading defence got SELECTED)"*. Those
  two read points **are** the co-evolution shape, so the horizon must reach 25 and must
  publish gen 8.
* **The league shape and band law** are **A4-S2P3 §5.5 Leg S**'s, unchanged (10 teams, 45-match
  round robin, elite 2 / reborn 2, the four rate/scale numbers). Leg S ran **20**
  generations; 25 contains that horizon and reaches the second read point.

⚠ **DISCLOSED**: a generation here is a **single round robin**, whereas the @8/@25 reads were
**shipped-league seasons**. The read POINTS are inherited; the season CONTENT is the Leg-S
instrument's.

## §4 SEEDS — fresh blocks, a sized count, the stats ledger

```text
RESERVED BAND          12,320,000 .. 12,419,999            (virgin; MT-T1 ended at 12,313,999)
smoke evolution        12,320,000 + gen×100 + matchIndex   (RUN — committed)
smoke body             12,325,000 + …                      (RUN — committed)
FULL evolution         12,330,000 + leagueIdx×3,000 + gen×100 + matchIndex   ⇒ ≤ 12,401,444 (⚠ #206: the first draft wrote ≤ 12,399,444 — a max-gen-offset slip; the probe's gSeed computes the true span, inside the reserved band)
FULL body instrument   12,410,000 + leagueIdx×100 + pairIndex                ⇒ ≤ 12,412,339
```

Strides: `3,000 ≥ 25 gens × 100`, `100 ≥ 45 matches`, body `100 ≥ 40 pairs`. Disjointness
against **every** consumed block of the arc (tempo census → MT-T1's 12,313,000–999) is
computed **in-probe** (`gSeed`, HARD). ⭐ **The identity seeds 1337 / 20260728 / 424242 are
consumed baselines and appear nowhere as experimental leagues** — 1337 appears only as the
production-fingerprint gate seed.

**Stats seeds — the #163 rule applied**: bootstrap base **103,800**, reserved-unused
**104,000**, 2,000 resamples. MT-T1's base was 103,600 ⇒ gap 200 ✓, and the floor
(≥ 103,800) is asserted in-probe.

### §4.1 ⭐ THE SEED-COUNT RULE (frozen; its only free input is the smoke's ms/match)

```text
matchesPerSeed = 25 gens × 45 matches × 2 arms + 40 body matches × 2 doses = 2,330
SEEDS*         = clamp( floor( 4.0 h / (ms_per_match × matchesPerSeed × 2 X-DET) ), 6, 24 )
```

`ms_per_match` is read from the **committed smoke artifact** (`sizing.msPerMatch`), whose
sha256 is pinned in the full run's own artifact — the MT-T1 `nDerivation` form. With the
committed smoke at **92.286 ms/match**: affordable = 33 ⇒ **SEEDS\* = 24, the SEEDS_MAX cap
binds**, projected wall **≈ 2.9 h** (worst case ≈ 4.0 h if the 10-team world runs ~30 %
slower per match than the 6-team smoke). The cap is a **seed/wall budget, not a statistical
claim**; an `MTT2_SEEDS` override in full mode turns `gNDerived` **RED** and exits 1.

## §5 THE RULER — the inherited equilibrium band

Inherited VERBATIM from A4-S2P3 §4.2 via PM-T1 §5.5 and MT-T1 §5.5, **including goals** and
**including the substrate-drift caveat**:

```text
goals     2.3944 ±15 %   2.0352 .. 2.7536
crosses   2.4894 ±25 %   1.8671 .. 3.1118
headers   9.1039 ±25 %   6.8279 .. 11.3799
longBalls 6.2042 ±25 %   4.6532 .. 7.7553
cutbacks  3.8151 ±25 %   2.8613 .. 4.7689
```

⭐ **THE SUBSTRATE-DRIFT EXCLUSION, declared ex ante (P3a §4.2's own caveat, inherited):** a
dimension **the CONTROL arm itself fails at that read point** is DISCLOSED and **EXCLUDED**
from the gate — an evolving league's own drift is not the gene's doing. The smoke shows this
rule is load-bearing here, not decorative: at 6 teams / 3 generations the control was already
outside on `goals`, `headers`, `longBalls` and `cutbacks`. **Whether the same happens at the
full shape is unknown and is exactly what the run measures.**

## §6 ⭐ THE PRE-NAMED OUTCOME FORMS (decidable predicates, frozen)

Let `G_arm(k)` = the pooled final-generation league-mean of gene `k` (absent ⇒ 0), pooled over
league seeds. All CIs are **percentile bootstraps clustered on the LEAGUE SEED** (2,000
resamples, base 103,800).

```text
ENGAGES        := ∃ gene k:  CI( G_ARMED(k) − G_CONTROL(k) ) resolved ABOVE zero
                             ∧ G_ARMED(k) ≥ GENE_ZERO_EPS = 0.02
RESTORES       := at generation 25, ARMED is inside the band on EVERY GATED dimension
                  (gated = dimensions the CONTROL itself holds at that read point)
                  ∧ GOALS ∈ gated                     ← ⚠ #206 PRE-LAUNCH AMENDMENT
RESTORES_PART. := ¬RESTORES ∧ CI( ARMED goals@25 − MT-T1 MTTOP goals ) resolved ABOVE zero
BODY_NEGATIVE  := CI( bodyLatGap(EVOLVED − ZEROED) ) resolved BELOW zero
```

* **(i) SELECTION ENGAGES + EQUILIBRIUM RESTORES** := `ENGAGES ∧ RESTORES ∧ BODY_NEGATIVE`
  ⇒ the play-test entry follows. **The stated form of "restores" is INSIDE THE BAND**;
  `RESTORES_PARTIAL` ("resolvedly closer than MTTOP's deflated levels") is **reported and does
  NOT satisfy (i)** — it is the honest middle reading the commander adjudicates.
  ⚠ **#206 PRE-LAUNCH AMENDMENT (the verify's MEDIUM; the #91 form, STRICTER, applied
  before any full-N sight)**: the inherited substrate-drift exclusion could silently drop
  GOALS from the gate (a long-horizon CONTROL may itself drift off the 8-season-calibrated
  band — the verifier's smoke re-run demonstrated `gated = {crosses}` concretely).
  RESTORES therefore additionally requires **goals ∈ gated**: if the control itself
  drifts off the goals band at gen 25, outcome (i) CANNOT fire and the run lands MIXED
  with the drift published. The question this stage exists to answer may not be excluded
  by its own honesty rule.
* **(ii) SELECTION REJECTS** := `G_ARMED(k) < 0.02` for **both** genes ⇒ **honest
  UNSUPPORTED**; the hand-dose decision returns to the user.
* **(iii) SELECTION MAXES + EQUILIBRIUM STAYS DEFLATED** := `(∃k: G_ARMED(k) ≥ GENE_HIGH =
  0.85) ∧ ¬RESTORES` ⇒ the **attack-side substrate finding**; the fork returns.
* **MIXED** := none of the three ⇒ **REPORTED AS-IS**. The three forms are **not exhaustive**
  and were never claimed to be; nothing is re-cut to land on one of them.

**Both thresholds are TRACED, not chosen:**
* `GENE_ZERO_EPS = 0.02` — A4-S2P3 §5.3's frozen `LEGS_SIGN_EPS = 0.02`, the Leg-S
  "indistinguishable from zero" dead-zone, re-used unchanged. ⚠ #206 (verify finding 4,
  disclosed): the anchor gated a SIGNED per-slot offset family (±0.5) while here it
  gates the magnitude of a [0,1] gene mean — same number, same semantic role
  ("indistinguishable from zero"), different quantity; named rather than implied.
  ⚠ #206 adjudication note, pre-registered (verify finding 2): ENGAGES alone is
  satisfiable by NEUTRAL DRIFT (clamp01's reflecting barrier drifts a no-selection walk
  upward) — the commander adjudicates outcome (i)'s ENGAGES limb WITH the published
  drift shadow and the fitness–gene correlation: an armed final mean statistically
  indistinguishable from the shadow is NOT read as selection evidence, whatever the
  predicate says.
* `GENE_HIGH = 0.85` — the **top of `randomGenome`'s birth range**
  (`src/evolution/genome.ts`: `for (const k of GENE_KEYS) g[k] = rng.range(0.15, 0.85);`): a
  new gene at or above it has been driven higher than the substrate ever hands out at birth.

Both source lines are pinned VERBATIM by `gInherit`, so neither anchor can drift silently.

### §6.1 THE BODY AT THE EVOLVED DOSE

The ARMED arm's **final-generation genomes** are played twice on identical seeds: **EVOLVED**
(the genes as selection left them) vs **ZEROED** (both keys deleted). Quantities are MT-T1's
own (`bodyLatGap`, `shortfall`, `detach`, the #188 weak-side-back trigger walk, `SPREAD_R = 9`),
paired on the league seed. Same genomes, same seeds, same flags — the only difference is
whether the two evolved values are present.

### §6.2 REPORTED, NEVER GATED

Per-generation gene trajectories (mean + spread, both genes) · **style DIVERGENCE** (per-team
gene sd at the end — the VISION §1 promise) · the band at every read point + paired
armed − control contrasts on every dimension · the goals trajectory per generation · the
**#157 debt counters** (offsides, fouls, penalties, thirdMan, overlaps) · the **co-evolution
shape** (paired armed − control on the frozen attack gene list: attackingWidth, tempo,
shootBias, riskTolerance, supportDistance, pressIntensity, transitionPress,
defensiveCompactness) · the fitness–gene correlation per generation.

## §7 ⚠ DISCLOSED DIFFERENCES AND HONESTY LIMITS (all declared before the run)

1. ⭐ **THE SUBSTRATE IS THE LEG-S PROBE-SIDE LOOP, NOT THE SHIPPED LEAGUE.** `MutateOptions`
   is **still not plumbed** through `src/sim/League.ts` or `src/evolution/evolve.ts` —
   `evolveGroup` calls `mutateGenome`/`crossoverGenomes` with hard-coded options — so arming an
   opt-in inside the shipped league would require a `src` change, which is forbidden here
   (`xSrcZero`, HARD). This stage therefore reuses **A4-S2P3 §5.2's named deviation verbatim**:
   a probe-side selection loop mirroring `evolveGroup`'s band law. **No careers, transfers,
   coaches, morale, promotion/relegation, fire-sale, two-division pyramid, or the
   four-component `computeFitness`.** A result here is evidence about **selection on winning in
   a round robin**, not a verdict on the shipped ecology.
2. ⚠ **THE RNG-STREAM DISPLACEMENT (the #148.5 trap in its EVOLUTION form).** Under the
   opt-ins the mutation/crossover laws draw **extra** numbers for the two new keys, so from
   generation 2 onward the ARMED arm's evolution stream is displaced relative to CONTROL's and
   the two populations diverge in **every** gene, not only the two under test. This is inherent
   to exercising the **real** gene channel (re-implementing the draw law on a private stream
   would no longer be the shipped channel). **Consequence, stated:** the displacement is
   *exchangeable* noise — uncorrelated with anything about the arm except the presence of the
   genes — so it **inflates variance rather than biasing** the contrasts; the paired league-seed
   design and the identical founders (gGen0) are what keep it honest, and an unresolved
   contrast is an honest **inconclusive**, never a false pass.
3. ⚠ **NEUTRAL DRIFT IS NOT SELECTION** (the Leg-S reading note, in its markSag form). The
   mutation law writes `clamp01(0 + gaussian·scale)` onto every mutated/reborn genome under the
   opt-in, and **a random walk clamped at zero drifts UPWARD with no selection at all**. A
   non-zero final mean is therefore **not by itself** evidence of selection. The frozen primary
   statistic is the one the dispatch named (armed vs the control's **structural** zero); the
   **NEUTRAL-DRIFT SHADOW** — inert gene passengers carried through the CONTROL arm's own
   elite/mutate/reborn assignments, in their own RNG namespace, touching no match — is published
   alongside it as the honest reference, together with the fitness–gene correlation and the
   style spread. Declared **here, ex ante**, not after sight.
4. **POWER, STATED HONESTLY.** The selection statistic clusters on the **league seed**, so
   n = 24, not the number of teams or matches. This design can see a **large, consistent**
   effect (a gene mass far from the drift reference in most leagues; a band that plainly
   restores or plainly does not). It **cannot resolve a small one, and will not be read as
   though it could.**
5. **THE BODY READ IS AT THE EVOLVED DOSE ON EVOLVED GENOMES**; MT-T1 read the same quantities
   at gene = 1 on `randomGenome` teams. Same instrument, different population — that is the
   question, not a drift.
6. **NOTHING SHIPS (Road B).** Zero `src/**`; both seams stay dormant and born-absent; the
   production fingerprint is re-derived unchanged. **No watchability verdict** — that is the
   user's play-test, per contract §3.

## §8 THE X-FAMILY (HARD — a failure means the MEASUREMENT is invalid, read nothing else)

| gate | predicate |
| --- | --- |
| **xDet** | the whole core computed TWICE; canonical-JSON digests byte-identical (wall lives outside) |
| **xFpProd** | production fingerprint `57b0bdab…c673` re-derived here, unchanged |
| **xSrcZero** | `git diff --stat -- src` empty — instrument-only |
| **gArm** | ⭐ the opt-ins GENUINELY GATE THE DRAWS: a mutated genome **never** carries the keys without them, **does** with them, and each opt-in moves only its OWN key; both consumption flags on in both arms; born-absent weights = 0; a dosed genome reaches all three views and expresses its weights |
| **gFitnessBlind** | WIN-ONLY: the probe's fitness takes only the season table, and the shipped fitness path has ZERO occurrences of either gene name |
| **gGen0** | every founder born absent; generation 1 canonically identical across arms; CONTROL's genes structurally absent in every generation |
| **gRuler** | MT-T1's committed artifact read + hashed here; MTTOP levels available |
| **gInherit** | 16 pinned source lines still exist VERBATIM (band baselines/tolerances, the body quantities, `LEGS_SIGN_EPS`, `evolveGroup`'s two laws, `randomGenome`'s birth range, both opt-in gates, the MT-T0 seam line) |
| **gSeed** | both blocks inside the reserved band, mutually disjoint, disjoint from every consumed block |
| **gStats** | bootstrap base ≥ 103,800 with pairwise gaps ≥ 200 from every published base |
| **gNDerived** | in full mode the seed count came from the §4.1 rule (an `MTT2_SEEDS` override ⇒ RED) |
| **gYield** | non-zero body episodes on both doses and a non-truncated horizon |

**EXIT SEMANTICS.** `0` = X-family green and the outcome is **(i)** or **MIXED** · `1` = an
X-family HARD gate failed ⇒ **INVALID** · `2` = the run is **clean** and a pre-named
**NEGATIVE** outcome fired, **(ii)** or **(iii)**. ⚠ **(ii)/(iii) are NEGATIVE FINDINGS, not
measurement failures** — exit 2 means *a fork returns to the user*, never *the instrument
broke*.

## §9 BOUNDED-SMOKE EVIDENCE (this deliverable; committed under `data/`)

`npx tsc --noEmit` clean. `tests/markSagGene.test.ts` + `tests/pmLaneConvergence.test.ts` +
`tests/genome.test.ts` = **38/38 green**. The smoke is **1 league seed × 2 arms × 3
generations × 6 teams + 4 body pairs × 2 doses** — plumbing only.

⚠ **THE SMOKE ADJUDICATES NOTHING.** It exists to prove the plumbing and to publish **one**
sizing number (92.286 ms/match) which feeds **only** the seed count. Its verdict line reads
"(ii) SELECTION REJECTS" **at 3 generations with 6 teams and one seed** — that is not a
finding, it is a 3-generation random walk, and it is printed exactly as the code computes it
rather than suppressed.

**UNABRIDGED, from `docs/world-model/data/mt-t2-coevolution-smoke.json` and the run's stdout:**

```text
=== MT-T2 CO-EVOLUTION A/B (smoke) — HEAD 5af833e — 1 league seeds × 2 arms × 3 gens × 6 teams ===
arms  ARMED[evolveMarkSag true · evolveDefLaneConvergence true]   CONTROL[evolveMarkSag false · evolveDefLaneConvergence false]
      consumption flags ON in BOTH arms · fitness = points.map((p, i) => p + gd[i] * 1e-3)  — points 3/1/0, goal difference as a 1e-3 tiebreak (A4-S2P3 §5.2, verbatim). NO genome is an input.
seeds evolution 12320000..12320244 · body 12325000..12325003

GENE TRAJECTORY (pooled league-mean per generation; ND = the neutral-drift shadow):
  gen  1  markSag 0.0000 (sd 0.0000, ND 0.0000, r_fit NaN) · defLane 0.0000 (sd 0.0000, ND 0.0000, r_fit NaN) · goals armed 2.333 / control 2.333
  gen  3  markSag 0.0132 (sd 0.0295, ND 0.0000, r_fit 0.3883) · defLane 0.0000 (sd 0.0000, ND 0.0013, r_fit NaN) · goals armed 2.267 / control 1.400

SELECTION STATISTIC (paired on the league seed):
  markSag             armed 0.013213 · control 0 · neutral-drift 0
                      vs control +0.013213 [0.013213, 0.013213] n=1 ✔ · vs neutral drift +0.013213 [0.013213, 0.013213] n=1 ✔
  defLaneConvergence  armed 0 · control 0 · neutral-drift 0.001316
                      vs control +0 [0, 0] n=1 · vs neutral drift -0.001316 [-0.001316, -0.001316] n=1 ✔
  ENGAGES false (genes: none) · thresholds eps 0.02 / high 0.85
  STYLE DIVERGENCE (per-league gene sd at the end): markSag 0.029545 · defLaneConvergence 0

THE BAND, per read point (gated = dimensions the CONTROL itself holds):
  gen 3 — gated crosses · excluded as substrate drift goals,headers,longBalls,cutbacks
    ARMED    goals 2.266667 [2.03524, 2.75356] ok · crosses 2.6 [1.86705, 3.11175] ok · headers 16.533333 [6.827925, 11.379875] OUT · longBalls 10.733333 [4.65315, 7.75525] OUT · cutbacks 4.133333 [2.861325, 4.768875] ok
    CONTROL  goals 1.4 [2.03524, 2.75356] OUT · crosses 2.333333 [1.86705, 3.11175] ok · headers 12.133333 [6.827925, 11.379875] OUT · longBalls 9.066667 [4.65315, 7.75525] OUT · cutbacks 2.066667 [2.861325, 4.768875] OUT
    ARMED in band on every gated dimension: true (failed: none)
  RESTORES true · RESTORES_PARTIAL false (goals vs MT-T1 MTTOP 1.61375: +0.652917 [0.652917, 0.652917] n=1 ✔)

THE BODY AT THE EVOLVED DOSE (EVOLVED − ZEROED, paired on the league seed):
  bodyLatGap -6.311872 [-6.311872, -6.311872] n=1 ✔ · shortfall -2.757963 [-2.757963, -2.757963] n=1 ✔ · detach -0.814067 [-0.814067, -0.814067] n=1 ✔
  episodes evolved 4 / zeroed 4 · evolved dose markSag mean 0.013213 · defLaneConvergence mean 0
  BODY_NEGATIVE true

REPORTED — the #157 debt counters (armed − control):
  gen 3: offsides +0.533333 [0.533333, 0.533333] n=1 ✔ · fouls -1.466666 [-1.466666, -1.466666] n=1 ✔ · penalties +0 [0, 0] n=1 · thirdMan +2.066666 [2.066666, 2.066666] n=1 ✔ · overlaps +0.066667 [0.066667, 0.066667] n=1 ✔
REPORTED — attack-side co-evolution (armed − control, final generation):
  attackingWidth +0.061358 [0.061358, 0.061358] n=1 ✔
  tempo +0.063032 [0.063032, 0.063032] n=1 ✔
  shootBias -0.085593 [-0.085593, -0.085593] n=1 ✔
  riskTolerance -0.075234 [-0.075234, -0.075234] n=1 ✔
  supportDistance +0.066084 [0.066084, 0.066084] n=1 ✔
  pressIntensity +0.105791 [0.105791, 0.105791] n=1 ✔
  transitionPress +0.058657 [0.058657, 0.058657] n=1 ✔
  defensiveCompactness +0.059431 [0.059431, 0.059431] n=1 ✔

X-FAMILY GREEN: xDet ok · xFpProd ok · xSrcZero ok · gArm ok · gFitnessBlind ok · gGen0 ok · gRuler ok · gInherit ok · gSeed ok · gStats ok · gNDerived ok · gYield ok
X-DET digest 1060c97b131b3ce68c43a0522e9b84bf0e7684c84bdd89524b07a3f27e54db16
resultSha256 c43cc0044bfcb88fae81a9b16ddab21914b0655e881c232384a58e405b95d0ed
wall 28.145s · 92.3 ms/match · matches/pass 98 · artifact docs/world-model/data/mt-t2-coevolution-smoke.json
SIZING — seeds* would be 24 (affordable 30, cap SEEDS_MAX) at 102.21 ms/match
VERDICT: (ii) SELECTION REJECTS — honest UNSUPPORTED  ⚠ SMOKE — ADJUDICATES NOTHING
⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.
```

⚠ #206: after the pre-launch RESTORES amendment the smoke was RE-RUN (the amendment
changes only the verdict predicate, not the simulation — **X-DET digest unchanged**
`1060c97b…db16`); the committed artifact and its `resultSha256` are now
**`e443378f0782d4a1f7ba7cb91d83bf67b0a72e608cbf7cb59a5593324f010431`** (the transcript
above is otherwise unchanged except wall-clock: 27.5 s · 90.5 ms/match). The superseded
hash `c43cc004…d0ed` above is left readable per the fix form.

**What the smoke DOES establish (plumbing only):**
* both arms construct and run; **gen 1 is byte-equal across arms** (goals 2.333 / 2.333) —
  the born-equivalence this design rests on;
* the opt-ins **genuinely gate the draws** — `gArm` proves a control genome never carries the
  keys, an armed genome can, and each opt-in moves only its own key; CONTROL's genes stayed
  structurally absent for every generation while ARMED's `markSag` entered by mutation;
* per-generation snapshots, the band per read point, the evolved-vs-zeroed body read, the
  artifact, the hashes, X-DET (two passes, identical digest) and all twelve HARD gates work;
* the **sizing** number that feeds the seed rule: **92.286 ms/match**.

The `SIZING` line quotes the **#188 prior** (102.21) because in smoke mode the probe does not
read its own not-yet-committed artifact; the full run reads the committed smoke and derives
**SEEDS\* = 24** either way (the cap binds).

## §LAUNCH

```bash
cd /Users/jamie/Documents/Promptfoo/evofootball-arena && \
MTT2_MODE=full nohup npx tsx scripts/probes/mt-t2-coevolution.ts \
  > /tmp/mt-t2-coevolution.log 2>&1 &
```

* **No `MTT2_SEEDS`** — an override turns `gNDerived` RED and exits 1.
* Artifact: `docs/world-model/data/mt-t2-coevolution.json` (committed by the commander with
  the §RESULT fill).
* Progress: one stderr line per arm per league seed (≈ 3.5 min apart) plus one per body block
  — well inside the 60 s-cadence requirement at gate granularity, and the log's last line
  timestamps the pass.
* Expected wall **≈ 2.9 h** (24 seeds × 2,330 matches × 2 X-DET passes × 92.3 ms), worst case
  ≈ 4.0 h if the 10-team world is ~30 % slower per match than the 6-team smoke. The 4 h budget
  is enforced by the §4.1 rule; had the sized design exceeded it, **SEEDS would shrink, never
  the horizon** (the horizon is traced; the seed count is a budget).
* Exit 0 ⇒ (i) or MIXED · 1 ⇒ INVALID · 2 ⇒ (ii) or (iii), a pre-named **negative finding**.

## §RESULT — the run

*(empty by design — the commander fills this from the committed artifact, adjudicating from
the PER-ARM / per-read-point rows per #203, never from the verdict line alone.)*
