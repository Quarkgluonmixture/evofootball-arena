# A4 S2-P3 — THE GENE BATTERY (fidelity · world health · selection)

Status: **PRE-REGISTERED 2026-08-08, FROZEN BEFORE ANY FULL RUN.** Deliverables: this
pre-registration + the probe
[`scripts/probes/a4-s2p3-gene-battery.ts`](../../scripts/probes/a4-s2p3-gene-battery.ts)
+ the three bounded smokes (committed under `data/`) + the #165.2.i test-debt fix.
**ZERO `src/**` changes** — the seam and the gene family are BANKED at S2-P2 (`950c702`).
**The three full runs are a FUTURE authorized step** (freeze → review → launch detached,
§0.0.4). **Nothing ships (Road B); the fingerprint `57b0bdab…c673` stands.**

Authority: **#165.3** (the three-leg frame FROZEN AT COMMANDER LEVEL — this doc
ELABORATES it and NEVER re-cuts it) · **#165.2.ii** (the ARMING CHECKLIST, binding) ·
**#165.2.i** (the named test debt, discharged here) · **#164** (the backLoaded read
CONFIRMED at fork grain — the set-grain currency here is REPORTED, never re-gated) ·
**#163.2.iii** (stats bases must be STREAM-disjoint: gaps ≥ 200) · **#162** (the
vs-NONE anchor philosophy; §4 diversity binding on this stage) · **#158** +
[`A4-SLICE2-PERBODY-CONTRACT.md`](A4-SLICE2-PERBODY-CONTRACT.md) §2 (M-S2.1/2/3), §3
(BIRTH NEUTRALITY + Road B), §4 (S2-P3), §5 (the #157 instrument debt), §6 (F-S2a–d) ·
[`A4-P3PRIME-REPLICATION.md`](A4-P3PRIME-REPLICATION.md) (the SET-GRAIN battery idiom
inherited whole) · [`A4-S2P1-VECTOR-CENSUS.md`](A4-S2P1-VECTOR-CENSUS.md) +
[`A4-S2P1B-BACKLOADED-CONFIRMATORY.md`](A4-S2P1B-BACKLOADED-CONFIRMATORY.md) (the
vector-grant machinery Leg F compares against) ·
[`STAGE3-V4-P3P3-BATTERY.md`](STAGE3-V4-P3P3-BATTERY.md) §3.2 (the §2 equilibrium band)
· #152 / #151 / #148 / #128 / #105.4 / #46.2 / #49.3 / #20.

**World / flags (#67.3).** Every run uses the **ENRICHED** world verbatim
(`edsPerceivedDefence + edsPerceivedChoice + edsValueAxis` ON, `c5Hold`/`c6Carry`/
`c7Windup` ON, `c5TouchFork` off) with the **R3p eye** (v3 base+children+SHA; v4
`inSupportLaw`+`deliveryBit`+`offsideBit`). In production every EDS flag is OFF,
`stationEye` is null, the `eye.v4` flags are absent, both home-prior genes are born
absent, and the fingerprint stays `57b0bdab…c673`.

---

## §0 — PURPOSE, in plain football language

S2-P1b proved (on fresh seeds, #164) that a **discipline-shaped agreement** — the back
players sticking closer to their posts, the front players freer — cuts 撞车 by ~4.2 %
against the wild world while the box account still pays and the outer account holds
level. That proof was made with a **hand-held instrument**: a probe reached into the
world and told one team's five outfielders how obedient to be.

S2-P2 then built the **real thing**: a gene, one number per squad slot, born at zero.

This stage asks three questions, in order.

1. **Is the gene the SAME THING as the instrument?** (Leg F.) If the world a team
   reaches through its own genes is not byte-for-byte the world the instrument made,
   then the S2-P1b proof does not transfer and everything downstream is guesswork.
2. **Does a whole league of gene-armed teams still play football?** (Leg W.) Not "is
   it better" — #164 already ruled that — but "is anything broken": 乱抢, the eye
   never touching the ball, roles still distinguishable, the goals/crosses/deliveries
   equilibrium.
3. **Would evolution ever CHOOSE this?** (Leg S.) Start every team at zero and let
   selection run. Do offsets get adopted at all, and — the user's #162 question — do
   different teams end up with **different shapes** (纪律型 vs 压迫型), or does the
   league just move its mean?

Leg F or Leg W failing ⇒ **STOP to the user**. Leg S never gates: it only shapes what
world S2-P4's play-test is armed with.

---

## §1 — ⭐ THE FROZEN OFFSET FAMILY (derived here, with the arithmetic shown)

The S2-P1 frozen instrument vector, quoted verbatim from the census pre-registration:

```text
backLoaded = [0, 0.9, 0.7, 0.5, 0.3, 0.1]      index 0 = GK · 1..5 = the outfield bodies
```

The team whisper is **obedience 0.5** (#148's certified PRIMARY dose:
`homePriorStrength(0.5) = 0.25 × VAL_SCALE = 0.040874`). The gene family expresses a
vector as **offsets about that whisper**, because the shipped consumer reads
`clamp01(homePriorObedience + offset[slot])`:

```text
offset_i = backLoaded_i − 0.5      over the OUTFIELD slots 1..5
           0.9 − 0.5 = +0.4
           0.7 − 0.5 = +0.2
           0.5 − 0.5 =  0
           0.3 − 0.5 = −0.2
           0.1 − 0.5 = −0.4
```

⭐ **FROZEN FOR THE WHOLE STAGE:**

```text
homePriorObedience        = 0.5                             (the certified whisper)
homePriorObedienceOffset  = [0, +0.4, +0.2, 0, −0.2, −0.4]  (the backLoaded family)
⇒ effective obedience      = [0.5, 0.9, 0.7, 0.5, 0.3, 0.1]
⇒ outfield 1..5            = [0.9, 0.7, 0.5, 0.3, 0.1]      = the S2-P1 vector, EXACTLY
⇒ outfield mean            = 0.5                            = the matched whisper dose
```

**Slot 0 (the GK) is frozen at offset 0, not −0.5.** Writing −0.5 to zero the keeper
would be *role-derived birth content* — the one thing contract §3 BIRTH NEUTRALITY
rejects ex ante. The GK never reaches the v3 station-eye consumption point, so his slot
is inert **by the world's own geometry, not by a rule about keepers**. Leg F PROVES the
choice is immaterial: the instrument vector gives him obedience 0, the gene gives him
0.5, and the worlds come out byte-identical.

Every offset is inside the S2-P2 frozen bound ±0.5 (`HOME_PRIOR_OBEDIENCE_OFFSET_MAX`).
The probe asserts the whole derivation as the HARD `priorEquivalence` gate
(`effectiveObedienceBySlot`, `outfieldMatches`, `strengthsMatch`).

---

## §2 — ⭐ THE ARMING CHECKLIST (#165.2.ii, BINDING) — stated precisely

An armed world = **`eye.v4.homePrior` + `evolveHomePrior` + `evolveHomePriorOffsets`,
all three**, asserted in-probe. The precise reading, which this stage records so no
future run mis-arms:

| flag | what it is | Legs F / W (FIXED world) | Leg S (EVOLUTION) |
| --- | --- | --- | --- |
| `eye.v4.homePrior` | the **CONSUMPTION** master flag on the eye | ⭐ **TRUE** — without it no offset is ever read | ⭐ **TRUE** on every match |
| `evolveHomePrior` | a `MutateOptions` **EVOLUTION** opt-in | **OFF** — nothing mutates in a fixed world; the gene is written directly onto the genome | ⭐ **TRUE** |
| `evolveHomePriorOffsets` | the family's own **EVOLUTION** opt-in (#75) | **OFF** — same reason | ⭐ **TRUE** |

Stated plainly: **the two evolution flags are irrelevant by construction to a fixed
armed world** — they govern whether *mutation and crossover* touch the genes, and Legs
F and W never mutate anything. They are the live arming for Leg S, where gen-0 is born
absent and every nonzero offset must be EARNED. The probe's `armingChecklist` HARD gate
asserts (i) the master flag is on the armed fixture, (ii) both sides' `info.genome` /
`baseGenome` / `effGenome` really carry the family, (iii) `randomGenome` is born-absent,
(iv) both evolution opt-ins demonstrably move the family when passed, and (v) crossover
under the opt-in produces a bounded full-length family.

---

## §3 — ⭐ LEG F: GENE ≡ VECTOR FIDELITY (exact-invariant, **GATING**)

### 3.1 The structural fact that shapes the comparison

`Match.homeRegionGrant` is **structurally single-side** — both union members carry one
`side` — so a both-sides instrument-vector world is **unreachable zero-src**. This is
the #150.1 fact, inherited, not a new finding. The leg is therefore frozen as **three
sub-legs over the same shared seeds**, which together read the grant path against the
gene path on both sides *and* in the both-sides world.

### 3.2 The seven worlds (frozen)

```text
plain  R3p eye, no v4.homePrior, no grant, genomes born-absent      — the unarmed anchor
V0     R3p eye, no v4.homePrior, homeRegionGrant {side:0, obedienceByIndex:[0,.9,.7,.5,.3,.1]}
G0     R3p eye + v4.homePrior, NO grant, side 0's genome = whisper .5 + the frozen family;
       side 1 BORN-ABSENT ⇒ effective obedience 0 ⇒ strength 0 ⇒ inert (= V0's side 1)
V1/G1  the mirror on side 1
Gboth  R3p eye + v4.homePrior, BOTH sides gene-armed                — ⭐ the Leg W arm world
H0     Gboth + the vector grant laid over side 0 (the grant branch takes precedence there)
H1     Gboth + the vector grant laid over side 1
```

### 3.3 The frozen predicate

Comparison form: **the full-match signature** — the P3′/S2-P1 `signatureOf` digest over
`{tick, score, phase, ball{pos,vel,z,vz}, rng.s, players[{gid,pos,vel,heading}]}` — after
running each world **to completion** on the shared seed. Every world on a seed is an
independent construction; nothing is cloned or shared.

```text
F1   sig(V0)    == sig(G0)                          the gene path == the instrument path, side 0
F2   sig(V1)    == sig(G1)                          … side 1
F3   sig(Gboth) == sig(H0) == sig(H1)               … in the both-sides armed world
NV   sig(Gboth) != sig(plain)  AND  sig(G0) != sig(plain)  AND  sig(G1) != sig(plain)
     AND sig(G0) != sig(Gboth) AND  sig(G1) != sig(Gboth)  — NON-VACUITY
```

**LEG F PASS := F1 ∧ F2 ∧ F3 ∧ NV on EVERY seed** (mismatch count exactly 0, non-vacuous
seeds exactly M). **ANY mismatch at ANY scale is a STOP finding** — the S2-P1b read
cannot be carried onto the gene, and the arc returns to the user with the mismatch
receipt (seed + the seven signatures, capped at 20 seeds in the JSON).

### 3.4 M and the seed block (frozen)

```text
M = 400      (≥ 200, #165.3)      gate block   12,257,000 + k, k ∈ 0..399   ⇒ 12,257,399
smoke M = 8                        plumbing     12,256,040 + k, k ∈ 0..7     ⇒ 12,256,047
```

Wall (measured at the smoke, outside the X-DET core, #128): **839.6 ms per seed** for
all eight worlds ⇒ 400 seeds × 2 passes ≈ **0.19 h**, inside the 1.5 h Leg F partition.

---

## §4 — ⭐ LEG W: WORLD HEALTH AT SET GRAIN (**GATING**)

### 4.1 The two arms (frozen) — armed-FIXED A/B, NO evolution

```text
CONTROL   both teams: eye.v4.homePrior TRUE, obedience 0.5, NO offsets
          = the slice-1 PRIOR world (the uniform whisper)
ARM       both teams: eye.v4.homePrior TRUE, obedience 0.5, the frozen backLoaded family
          = the Leg F `Gboth` world
```

The arms differ in **exactly one thing** — the presence of the per-slot family, the one
thing S2-P2 built. **One seed = one SET**, paired across both arms (#20; cluster = set
seed); every contrast is a paired per-seed delta with a set-seed cluster bootstrap CI
(B = 2,000).

### 4.2 ⭐ THE GATING FOOTBALL HARD GATES (P3′ inherited **VERBATIM**, each with its source)

| gate | threshold, frozen | P3′ source line |
| --- | --- | --- |
| **scramble (乱抢)** | `ARM − CONTROL` I4 own-within-5 m **CI lower ≤ 0** (not resolved-up), i.e. `¬(resolved ∧ lower > 0)` | A4-P3PRIME §4 leg (c): *"scramble I4 `¬(resolved ∧ lower > 0)`"* |
| **eye ball-ledger** | eye-attributable + unattributable releases **= 0** on **both** armed arms | A4-P3PRIME §4 leg (c): *"eye ball-ledger = 0"* / §8 STRUCTURAL eye-never-touches-ball |
| **role-mix TV** | **ARM-arm mean roleMixTV ≥ 0.407** (the incumbent floor) | A4-P3PRIME §4 leg (c): *"PRIOR-arm roleMixTV ≥ 0.407 (the incumbent floor)"* |
| **X-family** | every HARD gate in §7 true | A4-P3PRIME §8 gates table |
| **§2 equilibrium band** | the C1 §4 absolute band on the ARM's five per-match rates | STAGE3-V4-P3P3-BATTERY §3.2 (P3a §4.2, C1 §4 absolute) |

The equilibrium band, verbatim baselines and tolerances:

```text
goals     2.3944 ±15 %   2.0352 .. 2.7536
crosses   2.4894 ±25 %   1.8671 .. 3.1118
headers   9.1039 ±25 %   6.8279 .. 11.3799
longBalls 6.2042 ±25 %   4.6532 .. 7.7553
cutbacks  3.8151 ±25 %   2.8613 .. 4.7689
```

⭐ **THE P3a §4.2 SUBSTRATE-DRIFT CAVEAT, MADE AN EXPLICIT GATE RULE (declared ex ante,
before any sight):** *a dimension the **CONTROL** arm itself fails is DISCLOSED as
substrate drift and EXCLUDED from the gate* — the enriched world's own drift is not the
gene's doing, and P3a laid this caveat down before we ever measured it. The gate reads
the ARM inside band only on dimensions the CONTROL also holds. **The 40-set smoke shows
this rule is load-bearing, not decorative: `headers` (4.9 vs 9.1 baseline) and
`longBalls` (3.88 vs 6.20) are ALREADY outside the C1 band on the CONTROL arm** — an
inherited substrate drift, recorded here as a finding and excluded from the gate on both
arms. `goals`, `crosses` and `cutbacks` are inside on both arms at the smoke.

**LEG W PASS := scramble ∧ ball-ledger ∧ roleMixTV ∧ equilibrium band ∧ X-family.**
Any failure ⇒ **STOP to the user** (the gene-armed world is not health-neutral).

### 4.3 REPORTED at set grain (LABELLED, **never gated** — #164)

`dupRun` · `deep entries` · `box entries` · `offsides` · `fouls` · `penalties` ·
`restart ticks` · `turnovers` · `spacing median` · `under-4 m` · DEGEN-RESTDEF
occupancy · C-BOX at arrival · the **E4 combination counters** (third-man, overlaps,
forward-pass share) · `goals` · the roleMix pairwise tables · per-arm levels.

**Why never re-gated (stated once, binding):** the fork-grain exam #164 already ruled
the VALUE of the backLoaded shape on fresh seeds. Set grain is **scale honesty** — what
the same shape does across a whole match rather than inside a 10-second window — **not a
second bite at the same apple.** Re-gating it would be re-cutting a ruled question.

### 4.4 Sizing → the frozen N (the P3′ arithmetic)

The gating legs are resolved-**sign** guards (over-powered at any usable N), so the
smoke sizes the most demanding REPORTED read — the set-grain `dupRun` share contrast:

```text
MDL      = min( 0.5·|smoke dupRun(ARM−CONTROL) point| , MDL_ABS )
MDL_ABS  = 0.019 = HALF the #151 SEEN dupRun movement (+0.038 share) on PRIOR−R3p
           — pre-named BEFORE any seed ran; the 0.5·|point| guard stops smoke noise
             INFLATING the MDL
N*       = smallest 200-step N with σ̂/√N ≤ MDL / 3.605 (POWER_Z), capped at N_MAX
N_MAX    = the largest 200-step N with N × perSetWall × 2 ≤ 8 h, itself capped at
           N_CAP = 6,000 (the seed budget: keeps the band ≤ 12,265,999)
```

**THE 40-SET SMOKE (12,258,000–12,258,039), published:**

```text
dupRun(ARM − CONTROL) point −0.016101   (CONTROL level 0.557272 · ARM 0.541171)
σ̂ per set                    0.156416
MDL                          0.008051    (the 0.5·|point| guard binds, below the 0.019 floor)
per-set wall                 236.15 ms   N_MAX(wall) 6,000 → N_MAX 6,000 (the cap)
⭐ N* = 5,000                projected wall 0.656 h · projected power 0.9535
reducedPowerDisclosure       false
```

⭐ **N IS HEREBY FROZEN AT 5,000** (band **12,260,000 – 12,264,999**). No re-cutting
after sight (I-A6, #105.4). No gate leg was read at the smoke; the smoke's realisation of
the gate block exists only to prove it plumbs and to publish the CONTROL arm's own band
position (§4.2).

---

## §5 — ⭐ LEG S: SELECTION + THE §4 DIVERSITY OBSERVATION (**OBSERVATIONAL**)

### 5.1 What is armed

Fresh evolution runs with **ALL THREE flags armed** (§2, asserted in-probe), **gen-0
fully born-absent**: every founder genome comes from `randomGenome`, which carries
neither `homePriorObedience` nor `homePriorObedienceOffset` — BIRTH NEUTRALITY inside
evolution. The probe asserts gen-0 absence per run and reports it
(`legS.gen0BornAbsent`); the smoke confirms it.

### 5.2 ⚠ THE ONE DEVIATION, NAMED BEFORE THE RUN

`MutateOptions` is **not plumbed** through `src/sim/League.ts` or
`src/evolution/evolve.ts` — `evolveGroup` calls `mutateGenome`/`crossoverGenomes`
without options, so arming evolution inside the *shipped* league would require a `src`
change. Forbidden here (Road B; X-SRC-ZERO is a HARD gate). **Leg S therefore runs a
minimal PROBE-SIDE selection loop that mirrors `evolveGroup`'s band law**:

```text
elite   top 2         genome untouched
mutated middle        mutateGenome(rate 0.40, scale 0.08)   ← evolveGroup 'mutated', verbatim
reborn  bottom 2      mutateGenome(crossoverGenomes(pa,pb), rate 0.50, scale 0.15)
                      parents sampled from the top 4 with weights 4/3/2/1  ← evolveGroup, verbatim
season  a single round robin (45 matches at 10 teams)
fitness points 3/1/0 with goal difference as a 1e-3 tiebreak
```

**Its honest limit, ex ante:** this is an INSTRUMENT, not the shipped league. No
careers, transfers, coaches, morale, promotion/relegation, fire-sale, two-division
pyramid, or the four-component `computeFitness` (shot quality and style consistency
need `SeasonAggregates` the probe does not build). A null result here is evidence about
*selection on winning in a round-robin*, not a verdict on the shipped ecology.

### 5.3 The pre-registered metrics (VERBATIM from #165.3)

* **adoption fraction over generations** — the share of the population carrying a
  non-absent, non-zero offset family, reported per generation (plus
  `familyPresentFraction` and the obedience gene's own adoption).
* **drift magnitude** — mean and max L2 norm of the offset family; mean |offset| per
  slot.
* **cross-team SHAPE diversity** — sign-pattern clusters over the outfield slots (sign
  with a frozen dead-zone ε = 0.02 ⇒ `+`/`0`/`−` per slot, a 5-character pattern):
  cluster count, top-cluster share, the full histogram. Plus the **discipline-vs-press
  axis** (#162.2.iv: backLoaded = 纪律型, frontLoaded = 压迫型) as the cosine of each
  team's outfield offset vector against the frozen template `[+.4,+.2,0,−.2,−.4]` —
  mean, sd, and the fractions above +0.5 (discipline) and below −0.5 (press).
* **correlation with existing style genes** — Pearson r between the discipline-press
  score and a frozen gene list: `pressIntensity`, `defensiveCompactness`,
  `formationDepth`, `transitionPress`, `coverBias`, `jockeyBias`, `trapBias`,
  `riskTolerance`, `tempo`, `supportDistance`.
* **the fitness link** — Pearson r between family drift (L2) and within-generation
  fitness.

⚠ **HOW ADOPTION MUST BE READ (declared ex ante).** Under the opt-in the mutation law
**writes a full family onto every mutated/reborn genome**, so bare presence rises
MECHANICALLY with generation and is NOT evidence of selection. The selection signal
lives in (i) the fitness–drift correlation, (ii) drift persistence under elitism (elites
carry their family unchanged; a family that never reaches elite status keeps being
re-drawn small), and (iii) the SHAPE distribution — does selection *differentiate*
teams along discipline-vs-press, or is the cloud mutation noise? This note is in the
probe output too, so no reader can be misled after the fact.

### 5.4 The labelled hypothesis

> **H-165a (LABELLED, directional, NEVER a gate):** selection adopts nonzero offsets at
> all. **If fitness is flat on the family, that is the honest F-S2c-shaped outcome** —
> the whisper is already optimal for WINNING and the look-value is not selectable ⇒ the
> punish-compactness half (#154.3) inherits.

### 5.5 The frozen shape + honest power limits

```text
runs (independent)     8
league size            10 teams
generations            20
matches per generation 45 (single round robin)  ⇒ 7,200 matches total
elite 2 · reborn 2 · mutated 6
evolution RNG          seed 770,001 + run  (a THIRD namespace: neither a match seed nor a stats seed)
```

**POWER, STATED EX ANTE AND HONESTLY.** 8 runs × 10 teams is **80 final-generation
genomes**. A within-generation correlation on 10 teams has a standard error near 0.33;
pooled across 8 runs the final-generation means carry ~8 effective observations. **This
leg can see a LARGE, consistent effect (adoption in most runs, a shape distribution far
from noise, a |r| ≳ 0.5 fitness link that repeats run to run). It CANNOT resolve a small
one, and it will NOT be read as though it could.** No CI on any Leg S quantity is a
gate; nothing here disposes of anything by threshold. This is the honest cost of fitting
three legs inside a 12 h wall, and it is disclosed before the run rather than after.

---

## §6 — SEEDS, STATS, WALL (the ledger)

```text
LEG F smoke     12,256,040 + k, k∈0..7          ⇒ 12,256,047        (RUN — committed)
LEG F gate      12,257,000 + k, k∈0..399        ⇒ 12,257,399
LEG W smoke     12,258,000 + k, k∈0..39         ⇒ 12,258,039        (RUN — committed)
LEG W battery   12,260,000 + k, k∈0..4,999      ⇒ 12,264,999        (N FROZEN 5,000; cap 6,000 ⇒ 12,265,999)
LEG S smoke     12,266,000 + …                  ⇒ ≤ 12,268,999      (RUN — committed)
LEG S runs      12,270,000 + run×3,000 + gen×100 + matchIndex       ⇒ ≤ 12,291,944
pool tail       [12,256,040 , 12,300,000]  — every block inside it, mutually disjoint
```

Disjointness is asserted **in-probe** (HARD) against every consumed block of the arc:
P3p-3 (11.15M / 11.2–11.6M), A4-P1 (11.7M / 11.8M), P1b, P1c, P1d, P1e, A4-P3
(12.208–12.217999M retired in full), A4-P3′ (12.22M / 12.23M), **A4-S2-P1** (12.237M /
12.24–12.247999M) and **A4-S2-P1b** (12.248–12.255999M gate + 12.256000–12.256039M
smoke).

**Stats seeds — the #163.2.iii rule applied (bases 101,700+, pairwise gaps ≥ 200):**

```text
Leg W bootstrap  101,800      Leg W reserved-unused  102,000
Leg S bootstrap  102,200      Leg S reserved-unused  102,400
bootstrap resamples 2,000 (the P3p-3 form)
```

The nearest consumed base is S2-P1b's 101,523; **101,800 − 101,523 = 277 ≥ 200**, and
the four new bases are 200 apart from each other. The probe's `statsGapOk` HARD limb
computes this from the ledger, so a future base cannot silently re-walk a spent stream.

**WALL — the #165.3 cap is 12 h across ALL launched runs. Frozen partition + measured
projections (wall measured OUTSIDE the X-DET-compared core, #128):**

```text
                 partition     measured per unit      projected (×2 for X-DET)
Leg F            ≤ 1.5 h       839.6 ms / seed        ≈ 0.19 h  (400 seeds)
Leg W            ≤ 8.0 h       236.2 ms / set         ≈ 0.66 h  (5,000 sets)
Leg S            ≤ 2.5 h       ~113 ms / match        ≈ 0.45 h  (7,200 matches)
TOTAL            12 h                                 ≈ 1.3 h
```

---

## §7 — THE X-FAMILY (HARD; P3′ §8 inherited, adapted where the two-arm design demands)

| gate | class | predicate |
| --- | --- | --- |
| **X-DET** (wall-free, #128) | HARD | the whole experiment runs twice and the payloads are byte-identical (machine wall lives outside the compared core) |
| **priorEquivalence** | HARD | VAL_SCALE recomputed from the SHA-pinned table = 0.163494; `homePriorStrength(0.5) = 0.25×VAL_SCALE`; `HOME_MAP_STRENGTH_MAX = 0.5×0.163494`; **and the §1 family arithmetic**: effective obedience on slots 1..5 equals the S2-P1 backLoaded vector exactly, and the resulting strengths match to 1e-15 |
| **⭐ armingChecklist** | HARD | #165.2.ii, §2 above — all three flags reachable, the fixed fixture really carries the family on both sides and all three genome references, `randomGenome` born-absent, both opt-ins demonstrably live |
| **X-MERGE-IDENT** | HARD | `mergedTableSha == 39662445…9d6105` and its `base` rehashes to `171a6dad…6559f` |
| **X-SEAM / E-NONSTATION** | HARD | fresh `Match` null; `scope` honoured (body/team/both); the eye never overrides the ball carrier; the armed both-scope eye ACTIVATES |
| **X-OFF-IDENT** (bounded form) | HARD | no R0 arm exists in this two-arm battery, so the bounded form: a `stationEye`-null enriched match reproduces itself byte-for-byte on the leg seeds ⇒ the harness injects nothing of its own |
| **X-SRC-ZERO** | HARD | `git diff --stat -- src` **empty** — S2-P3 adds ZERO `src/**`; the seam and the family are BANKED at S2-P2 |
| **X-FP-PROD** | HARD | production fingerprint `57b0bdab…c673` unchanged, every flag off, both genes absent (Road B) |
| **seed + stats disjointness** | HARD | §6, computed from the frozen constants (blocks inside the pool, mutually disjoint, disjoint from every consumed block; stats bases fresh with gaps ≥ 200) |

A HARD gate failing ⇒ **STOP: the measurement is invalid, read nothing else.**

---

## §8 — DISPOSITION, pre-registered for every outcome (#165.3)

| condition | disposition |
| --- | --- |
| any HARD gate fails | **STOP** — measurement invalid; returns to the user |
| **Leg F fails** (any mismatch, any scale) | **STOP to the user** — the gene is not the instrument; the S2-P1b read does not transfer |
| **Leg W fails** (any football hard gate) | **STOP to the user** — the gene-armed world is not health-neutral at set grain |
| Leg F ∧ Leg W pass | the certified fixed backLoaded-gene world is banked; **Leg S shapes the S2-P4 arming choice** |
| Leg S: offsets adopted, shapes differentiate | S2-P4 arms the **EVOLVED** world |
| Leg S: flat (H-165a unsupported) | S2-P4 arms the **certified fixed backLoaded-gene** world, with the selection result recorded honestly (the F-S2c-shaped reading; the punish-compactness half inherits) |

**S2-P4 is the user's play-test either way** (contract §4: the slice cannot close on
counters alone — VISION §2, watchability has no instrument).

---

## §9 — NON-CLAIMS

* **Nothing ships (Road B).** Zero `src/**`; the fingerprint stands; every flag armed
  only inside this instrument.
* **The set-grain currency is NOT a second bite** (§4.3).
* **Leg S is observational** — no threshold, no fitness claim, no gate.
* **No offside-rule change** (the 乙 axis hangs by #158): offsides are measured only.
* **No watchability verdict**: the proximity block's authority remains the user's eyes
  (#152); S2-P4 is where it is exercised.
* **No HEIGHT / in-match-adaptation / opponent-inference claims** (contract §7).

---

## §10 — BOUNDED-SMOKE EVIDENCE (this deliverable; committed under `data/`)

`npx tsc --noEmit` clean. `tests/a4S2P2PerBodyOffsetGene.test.ts` 24/24 green with the
#165.2.i debt discharged (§11). Three smokes ran to their canonical outputs:

* **`a4-s2p3-legf-fidelity-smoke.json`** — 8 seeds @ 12,256,040. ⭐ **LEG F HOLDS AT
  SMOKE SCALE: F1 8/8, F2 8/8, F3 8/8, non-vacuous 8/8, mismatches 0.** The gene path
  and the instrument-vector path are the same world byte for byte, on both sides and in
  the both-sides world; and the armed worlds genuinely differ from the unarmed one (so
  the identity is not the trivial "nothing happened"). Every hard gate true; `xDet`
  true; wall 839.6 ms/seed.
* **`a4-s2p3-legw-sizing-smoke.json`** — 40 sets @ 12,258,000. σ̂ 0.156416, MDL
  0.008051, per-set wall 236.15 ms, **N\* 5,000** (N_MAX 6,000, no reduced-power
  disclosure, projected power 0.9535, projected wall 0.656 h). Gate block realised (not
  read): scramble CI −0.009177 [−0.056558, +0.037718] unresolved, ball-ledger 0/0,
  roleMixTV ARM 0.4792 / CONTROL 0.4369 (floor 0.407), equilibrium band with
  `headers`+`longBalls` excluded for CONTROL-arm substrate drift. Every hard gate true.
* **`a4-s2p3-legs-selection-smoke.json`** — 1 run × 6 teams × 3 generations @
  12,266,000, **wall/plumbing only**. gen-0 born-absent TRUE; every pre-registered
  metric populates (adoption 0 → 0.5 → 0.667, driftL2 0 → 0.134 → 0.177, 4 shape
  clusters, the discipline-press axis, all ten style-gene correlations, the
  fitness–drift correlation). ~113 ms/match. Every hard gate true; `xDet` true.

No full run has been launched. No gate leg has been read.

---

## §11 — THE #165.2.i TEST DEBT, DISCHARGED

`tests/a4S2P2PerBodyOffsetGene.test.ts`'s second RNG-stream test called **current code
on both arms** and therefore could not fail; its docstring overclaimed. It is replaced
by a genuine **HEAD reimplementation with `evolveHomePrior` ON** — `headMutateHP` /
`headCrossHP`, the existing `headMutate`/`headCross` form extended with the
`homePriorObedience` block exactly as it stood before the offset family existed — run
against current code with `evolveHomePriorOffsets` **OFF**, over 40 mutate+crossover
generations on two lineages. The assertions: **RNG internal state equality after EVERY
step** (draw-for-draw, so a compensating extra/skipped pair cannot hide), gene-for-gene
equality including `homePriorObedience` itself, **non-vacuity** (the home-prior gene
really evolved — otherwise the equality would be trivial), and the offset family absent
throughout. The file docstring is corrected to say exactly this.

---

## §12 — FREEZE HONESTY

Every criterion cites a published source: ruling #165 (the frame, verbatim), #164, #163,
#162, #158, #152, #151, #148, #128, #105.4, #46.2, #20; the contract §2/§3/§4/§5/§6; the
P3′ pre-registration §4/§8 (the football hard gates + the X-family); STAGE3-V4-P3P3
§3.2 (the C1 §4 equilibrium band); the S2-P1 census (the frozen backLoaded vector); the
S2-P2 gene family (`950c702`, the ±0.5 bound). The **only numbers this doc introduces**
are (i) the offset family, DERIVED from the S2-P1 vector by the arithmetic shown in §1,
(ii) M = 400 and the Leg S shape, sized to the wall partition, and (iii) N = 5,000,
derived by the frozen sizing rule from a smoke that read no gate leg. The #151/#157 values
are quoted as pre-named MDL provenance only. **This freeze + the probe + the three
smokes RETURN TO THE COMMANDER; the three full runs are the future authorized step.**
