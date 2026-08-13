# CB-C0 — THE DISPOSSESSION-GEOMETRY CENSUS (今天的抢断长什么样)

Status: **FROZEN, then RUN.** Everything from §TRACE to §NON-CLAIMS — the world, the duel
population, the detector, the bins, the overcommitment definition, the horizons, the estimator, the
seed ledger, the N rule, the ⭐ #246 shape predicates and the gate list — is the design fixed **in
the probe's own frozen constants and gate predicates before any battery was read**, and every clause
below is machine-checkable against the committed artifact rather than a promise about it. The
measured numbers live in [§RESULT](#result), **GENERATED PROGRAMMATICALLY** from the artifact by a
committed generator (`scripts/analysis/cb-c0-census-result.ts`), never typed (#229.2).

⚠ **This document reports; it does not adjudicate (#203).** The #246 shape flags are mechanical CI
readings printed exactly as the artifact records them. What they *mean* — deliberate arcade
trade-off or substrate gap — is the commander's.

Authority chain: the **CARRY-BEAT CONTRACT**
[`CB-CARRY-BEAT-CONTRACT.md`](CB-CARRY-BEAT-CONTRACT.md) **§3 CB-C0** (and **§2 M-CB.1**, the
layer-1 mechanism this table is the baseline for), bound and dispatched by ruling **#265**.
Form precedents: [`EK-C0-HOLD-OUTCOME-CENSUS.md`](EK-C0-HOLD-OUTCOME-CENSUS.md) and
[`DV-T2-C0-PASS-LEVEL-CENSUS.md`](DV-T2-C0-PASS-LEVEL-CENSUS.md) (**THE CENSUS FORM** — the N rule,
the full-accounting table, the frozen-before-sight discipline, the yardstick/artifact schema) and
[`DV-C0-LOSS-COST-CENSUS.md`](DV-C0-LOSS-COST-CENSUS.md) (**THE WALKER** — its possession-segment and turnover
semantics, re-walked here as a receipt). Hygiene canon: **#250.3** (pre-frozen gate list,
hand-checked count) · **#251.3 / #252.3 / #264.2(3)** (a mutant per conjunct, RE-INVOKING the gate's
own function, coverage set NAMED) · **#256.3** (per-cluster cells stored) · **#258.3** (timings in
the UNHASHED envelope) · **#261.2 / #262.2** (env whitelist-or-refuse incl. the ENGINE doors) ·
**#263.2** (non-vacuity conjuncts at the claim's own grain) · **#163** · **#181.2** · **#20** ·
**#128** · **#200** · **#203** · **#229.2** · **#246** · **#247**.

> ⭐ **INSTRUMENT-ONLY ROUND.** `src/**` is **byte-untouched** (`xSrcUntouched` is a HARD gate). The
> world measured is **BARE PRODUCTION** — the shipped game with every experimental flag off.
> **Nothing measured here reaches any player** (#247): this table is the A/B baseline every CB exam
> contrasts against, and nothing else.

---

## §0 THE QUESTION, in football

The contract's §0 diagnosis says that in today's world **diving in never loses**, so all-swarm is
the dominant strategy and restraint cannot emerge. That sentence contains three empirical claims and
this stage measures all three:

1. **How does a taking actually happen?** Photograph every challenge by the taker's approach —
   speed, direction, motion state — and read the take rate off the grid.
2. **Does OVERCOMMITMENT exist, and is it EVER punished?** Define an overcommitted arrival from the
   body's own braking model, count them, and ask whether missing one costs the defence anything a
   probe can measure: does the carrier keep the ball, gain space, gain time?
3. **What is the churn baseline around a duel?** Possession-spell length around duel events, on the
   #169-arc instruments, so CB-T1 has something to move.

And the symmetric half the charter asks for: **do challenges that do NOT take exist at all?** They
do — the engine has a real failed-challenge branch — and both it and the *withheld* challenge (the
jockey refusal) are counted here.

## §TRACE — where every number in the instrument comes from

Nothing in this probe is a typed metre, second or radian. Two files are *read* at run time and every
constant is extracted from them and gate-checked (**G-CONST-TRACE**, a mutant per conjunct):

| constant | value | source (file:line, printed by the gate into the artifact) | what it is |
|---|---|---|---|
| `R_TACKLE` | 1.15 m | `src/sim/mechanics.ts` (the `tryTackles` candidate scan `if (d < 1.15 && d < best)`) | the challenge radius — the duel is only offered inside it |
| `MISS_COOLDOWN_S` | 1.2 s | `src/sim/mechanics.ts` (the miss branch) | a beaten lunger's re-challenge interval |
| `MISS_STUN_S` | 0.35 s | `src/sim/mechanics.ts` (the miss branch) | the beaten lunger's stun |
| `WIN_COOLDOWN_S` | 0.5 s | `src/sim/mechanics.ts` (the win branch) | the winner's own cooldown |
| `CARRIER_STUN_S` | 0.6 s | `src/sim/mechanics.ts` (the win branch) | the dispossessed carrier's stumble |
| `ACCEL` | 14 m/s² | `src/sim/Player.ts` (`const ACCEL = 14`) | the body's acceleration constant |
| `TURN_RATE` | 6.5 rad/s | `src/sim/Player.ts` (**imported**) | the heading-rate cap |
| `DT` | 1/60 s | `src/sim/constants.ts` (**imported**) | the timestep |
| `DRIVE_NORM` | 9 | `src/sim/mechanics.ts` (`clamp(len(owner.vel) / 9, 0, 1)`) | the CARRIER's drive normaliser |
| `CONE_RAD` | 1.2 rad | `src/sim/mechanics.ts` (the won-tackle squirt cone `rng.range(-1.2, 1.2)`) | the engine's own angular constant |
| `TACKLE_LUNGE_COST` | 0.02 | `src/sim/constants.ts` (**imported**) | the burst every lunge costs |
| the take-probability clamp | [0.06, 0.7] | `src/sim/mechanics.ts` | the floor/ceiling the roll lives between |
| slide / grab / smother / GK-aerial cooldowns | 2.5 / 2.0 / 1.2 / 0.9 s | `src/sim/mechanics.ts` | the OTHER five writers of `tackleCooldown` — traced so no jump can be misread |

⭐ The last row is load-bearing for the detector: **G-CONST-TRACE asserts that `src/sim/mechanics.ts`
contains exactly SIX assignments to `tackleCooldown`**, all six traced, so no duel mechanic can fire
unseen.

### ⭐⭐ HOW A CHALLENGE IS SEEN WITHOUT TOUCHING THE ENGINE

`Match.step` runs brains → executors → `physicsStep` (which **decrements** every cooldown) →
`stepBall`, and the duel mechanics sit at the END of `stepBall`'s owned-ball branch. So at POST-STEP
the cooldowns a mechanic set *this* tick are still at their full set value and **nothing else can
raise a cooldown**. A per-player STRICT INCREASE of `tackleCooldown` across one step is therefore a
duel mechanic firing, and the exact post value names which one:

```text
0.5                      → tryTackles WON              (the census population)
1.2 with stun 0.35       → tryTackles MISSED           (the census population)
2.5                      → trySlideTackle              (counted, not tabulated)
2.0                      → tryTacticalFoul             (counted, not tabulated)
1.2 with stun 0.8, a GK  → trySmother, beaten          (counted, not tabulated)
0.9, a GK                → tryAerial claim             (counted, not tabulated)
```

**G-DETECT** proves the classification against the engine's OWN counter: detected standing wins +
detected slide wins **must equal** the summed `team.stats.tackles` delta, which is incremented by
exactly those two branches and nothing else. It also proves every tabulated duel sits inside
`R_TACKLE` of the ball and that **no** cooldown jump is left unclassified.

The geometry is read at that same post-step instant, which **is** the instant the mechanic saw:
`tryTackles` runs after `physicsStep` and writes no position and no velocity.

## §FORM — the measured populations

**(i) THE STANDING CHALLENGE — the census population.** Every `tryTackles` lunge, won or missed.
This is the duel M-CB.1 rebuilds; the other four mechanics are counted beside it and never pooled
into it (§DEV 1).

**(ii) THE WITHHELD CHALLENGE — the refusal.** A tick at which an eligible candidate (the engine's
own predicate: an opponent of the carrier, not sent off, no cooldown, no stun, inside `R_TACKLE` of
the ball) stood there and **no lunge fired** — the jockey gate and its friends. A declined challenge
leaves no mark in the world, so it can only be counted as a TICK DENSITY, not an event rate
(§DEV 2). Proximity ticks partition into lunge ticks ∪ refusal ticks (**G-ACCOUNTING**).

**(iii) THE FAILED CHALLENGE — it EXISTS.** The charter asks whether the engine has any concept of a
challenge that does not take. It does: `tryTackles`' `else` arm. What it costs is §STRUCTURE.

## §BINS — frozen BEFORE any battery was read, derived from §TRACE

### ⭐⭐ v\* — the overcommitment threshold, with the arithmetic shown

`physicsStep` approaches `desiredVel` at the same rate in every direction (`maxDelta = accel * dt`,
applied to the vector difference), so **the body's deceleration model IS its acceleration model**:
|dv/dt| ≤ a. A body arriving at speed v needs `v² / (2a)` metres to stop. Set that equal to the
challenge radius — the distance inside which the duel is even offered — and solve:

```text
v*  =  sqrt(2 · ACCEL · R_TACKLE)  =  sqrt(2 × 14 × 1.15)  =  sqrt(32.2)  =  5.674504 m/s
check:  v*² / (2 × ACCEL)  =  1.15 m  =  R_TACKLE
```

⇒ **X (the charter's "brake within X") IS the challenge radius**, and an arrival at or above v\*
**cannot be stopped inside the duel**: the body is committed to passing through. That is the
definition of OVERCOMMITTED used everywhere below.

⚠ *a* is the BASE constant; the per-body accel is `ACCEL × (0.9 + pace × 0.2) ∈ [12.6, 16.8]`, so a
per-body v\* spans **[5.383, 6.216] m/s**. The frozen grid uses the base value (a grid must be the
same for every body, §DEV 4) and the per-body classification is published beside it as a REPORTED
sensitivity row.

### The grid

| axis | bins | edges, and where they come from |
|---|---|---|
| **approach speed** | `s0 walk · s1 jog · s2 run · s3 drive · s4 OVERCOMMITTED` | quarters of v\*: **1.418626 / 2.837252 / 4.255878 / 5.674504** m/s |
| **approach direction φ** | `chasing · across · head-on · planted` | φ = ∠(taker's own velocity, carrier's heading); cuts at **CONE_RAD = 1.2** and **π − 1.2 = 1.941593** rad — the engine's own cone constant and its supplement. `planted` = speed below half a per-tick speed quantum |
| **bearing θ** *(published, degenerate)* | `front · flank · behind` | θ = ∠(taker's bearing from the carrier, carrier's heading), same two cuts |
| **motion state** | `braking · steady · accelerating`, and `turning-hard` beside it | half the body's own per-tick quanta: `q_v = ACCEL × DT = 0.233333` m/s and `q_ψ = TURN_RATE × DT = 0.108333` rad ⇒ cuts at **0.116667 m/s** and **0.054167 rad** |

### The horizons — traced, not round numbers

* **overrun horizon** = `MISS_STUN_S / DT` = **21 ticks (0.35 s)** — the stun the engine itself
  imposes on a beaten lunger.
* **H1** = `MISS_COOLDOWN_S / DT` = **72 ticks (1.2 s)** — the beaten lunger's OWN re-challenge
  interval. If diving in ever costs anything, the price must be visible inside the window the engine
  itself says he is out of the duel for.
* **H2** = 2 × H1 = **144 ticks (2.4 s)**.

### The measured costs of a MISS

`overrun` (metres along his own approach axis during the stun) · `Δsep` (change in his separation
from the carrier over H1) · `Δspace` (change in the carrier's distance to his nearest opponent over
H1) · `retain @ H1 / H2` (the carrier's team still holds it — **no turnover stamped**, at DV-C0's
own possession-loss semantics, re-walked and gate-proved).

## §ESTIMATOR

Cluster bootstrap by **match seed** (#20) — the set grain — 2,000 resamples, percentile 95 % CI,
**ratio-of-sums**. ⭐ **ONE SHARED resample-index matrix**, so every rate *and* every difference (the
#246 predicates) is computed on the **same** resampled clusters — the differences are paired by
construction. Stats stream base **109,600** (ruling #265.4's floor, on the 200 grid), disjoint from
the match RNG (#163). ⭐ **Per-cluster cells are STORED** in the artifact (`result.perClusterCells`:
per seed, the full speed × angle and speed × approach grids, the per-speed-bin miss-outcome sums and
counts, the motion marginals and the churn sums), so every CI in this document **re-derives without
a re-run** (#256.3).

## §SHAPE — the ⭐ #246 reality-shape check, PRE-REGISTERED

Real football's structure, cited as a **SHAPE ONLY** (VISION §3 — 常数永不进口; no real-football
number appears anywhere in this probe). Each is resolved by the **paired cluster-bootstrap CI of the
difference** excluding zero: `RESOLVED-CONFIRM` · `RESOLVED-INVERT` · `UNRESOLVED`.

| id | real football's shape | expected sign |
|---|---|---|
| **R1** | a defender who arrives OVERCOMMITTED wins the ball LESS often than one under control | NEGATIVE |
| **R2** | a MISSED overcommitted challenge is PUNISHED: the carrier still has the ball at H2 more often | POSITIVE |
| **R3** | a CHASING challenge (from behind) takes less often than a HEAD-ON one (the defender who got in front) | NEGATIVE |
| **R4** | a beaten fast arrival is CARRIED THROUGH: his separation from the carrier grows more | POSITIVE |

⭐ **AND THE ENGINE-EXPECTED SHAPE, E1 — stated ex ante, and the reason this census exists.** The
take probability's own expression contains **no term derived from the TAKER's speed, heading or
motion state**. So E1 predicts the take rate is **FLAT** in the taker's approach geometry, and any
gradient that *is* observed is CONFOUNDING (which carriers get challenged at speed), not a
mechanism. The premise is not asserted — **G-GEOMETRY-BLIND proves it from the engine's own source**
and quotes the expression verbatim into the artifact.

⚠⚠ **AN INVERSION IS A FINDING, NOT AN ERROR.** Per #246 it is **PUBLISHED** and routed to the
**街机偏离 test** (deliberate arcade trade-off vs substrate gap) and is **NEVER** silently corrected
into the table. **MAGNITUDES are OUR world's and are supposed to be**; only the **SHAPE** is the
fidelity check.

## §NRULE — DV-C0 / EK-C0's rule form, with this census's own numerator

```text
N* = min( ceil(60 / rarestCellLungesPerMatch) ↑25,
          floor(0.5 h / (ms/match × 1 arm × 2 X-DET)),
          800 )
```

60 events ⇒ a count's relative SE ≈ `1/sqrt(60)` ≈ 13 %, the precision at which a rate **ORDERING**
(the #246 check) is readable — DV-C0's own target, inherited with its own justification. The
numerator here is **a LUNGE in the rarest (approach speed × approach direction) cell** of the frozen
grid. `rarestCellLungesPerMatch` and `ms/match` are the **only two numbers** a full run reads out of
the committed smoke artifact; they feed **only** N — no rate, CI, ordering or shape verdict is read
from the smoke anywhere. The 800 cap is the reserved seed room, an honest **seed-budget** cap.

⭐ **THE ZERO-EVENT CLAUSE (frozen with the rest of the rule, before the smoke ran):** if the smoke
sees **zero** lunges in the rarest cell the precision term is **UNBOUNDED** — it cannot be estimated
from a zero count and this stage will not invent a floor for it — so the wall term and the cap bind.

⭐ **THE ADMISSIBILITY CLAUSE (same freeze):** the `planted` bin is defined by a speed below half a
per-tick quantum, which lies inside the FIRST speed bin, so `(s ≥ 1 × planted)` is **structurally
empty**. The rule may not read a zero out of a cell the grid cannot produce, so those four cells are
INADMISSIBLE for the rarest-cell search. **G-ACCOUNTING proves the emptiness** (with the non-vacuity
conjunct at that claim's own grain: duels above s0 exist).

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

| gate | what it proves |
|---|---|
| **xDet** (×2) | the whole measured core computed twice (two independent walks; pass B **never** resumes from the checkpoint), canonical-JSON digests identical |
| **xSrcUntouched** | `git diff --stat -- src` empty — instrument-only, HARD |
| **xFpProd** | the shipped league fingerprint re-derived in this process, unchanged |
| ⭐ **gConstTrace** | every duel and motion constant is EXTRACTED from `src/**` at run time and equals the probe's frozen value; `TURN_RATE`/`DT`/`TACKLE_LUNGE_COST` arrive by import; the six `tackleCooldown` writers are all traced and counted |
| ⭐ **gBinsDerived** | every bin edge re-derives from those constants by the shown arithmetic — v\* is the braking identity, the speed cuts are its quarters, the angle cuts are the engine's cone and its supplement, the motion cuts are half the body's own quanta, the horizons are the engine's own stun and re-challenge interval |
| ⭐⭐ **gGeometryBlind** | **THE STRUCTURAL FINDING, proved from the engine's own source**: the take-probability expression and the whole `tryTackles` body contain NO taker velocity or heading; the taker's only kinematic input is POSITION; the one motion term is the CARRIER's drive; the outcome is an `rng.chance(p)` roll; and the MISS branch writes only a cooldown and a stun — both CONSTANTS — and **no position and no velocity** |
| ⭐ **gDetect** | the detector is sound: detected standing wins + slide wins **=** the engine's own `stats.tackles` counter; every tabulated duel inside `R_TACKLE`; zero unclassified cooldown jumps; wins + misses partition the duels; five non-vacuity conjuncts |
| ⭐⭐ **gAccounting** | DV-C0's tick identities (partition, assigned = segment, ordered spans) **+ this census's**: the two cell grids and the motion marginal each cover every tabulated duel; wins + misses = tabulated; refusal cells cover every refusal tick; proximity ticks partition; the H2 horizon is reachable for no more events than H1; the `planted` bin is empty above s0 |
| ⭐⭐ **gReproDvc0** | the possession/turnover semantics **are** DV-C0's: its committed smoke block re-walked with THIS probe's walker, its committed integer rows reproduced (ticks, dead-ball, segment, loose, assigned, span violations, goals, turnovers, and the three per-third turnover cells) |
| **gWorld** | the world really is bare production — every door shut, no eye, no book, no gene needle, the default duration, the census construction — read back on a freshly constructed, **never-stepped** match |
| **gSeedDisjoint** | every block machine-checked against the COMPLETE ledger; the re-walk's predicate **INVERTED**; sub-blocks ordered and disjoint; the two bands this stage depends on present in the ledger |
| **gStatsDisjoint** | stats base 109,600 ≥ the #265.4 floor, on the 200 grid, min gap ≥ 200 to the published ledger |
| ⭐ **gCleanInvocation** | any `CBC0_N` / `_SKIP_FP` / `_OUT` routes the run onto the **guard block**, turns this gate RED and exits 1 — the census block stays VIRGIN; a preflight can never write a canonical repo path (guarded at parse time **and** on the RESOLVED absolute path at the write) |
| **gNDerived** | the N run **is** the frozen §NRULE output |
| ⭐ **gValuesUnreachable** | none of the published take rates appears in `src/**`, searched in BOTH the raw 5-dp form and the formatted percentage form the tables print; with a non-vacuity floor on the needle and file sets and a control needle that must be found |
| ⭐⭐ **gMutants** | **#251.3 / #252.3 / #264.2(3) discharged at source**: every conjunct of every gate in the NAMED coverage set carries its own mutant that **RE-INVOKES the gate's own function** on a mutated input and must flip exactly that conjunct — and the coverage is **machine-checked for completeness** (`uncoveredConjuncts` must be empty). The three single-predicate gates (xDet / xSrcUntouched / xFpProd) print their evidence in full instead |

⭐ **THE HEADLINE COUNT, HAND-CHECKED against this frozen list (#250.3(i)):** the table above has
**16** rows — `xDet · xSrcUntouched · xFpProd · gConstTrace · gBinsDerived · gGeometryBlind ·
gDetect · gAccounting · gReproDvc0 · gWorld · gSeedDisjoint · gStatsDisjoint · gCleanInvocation ·
gNDerived · gValuesUnreachable · gMutants` — and the artifact's `gates` object carries exactly those
**16** keys, which is the number every headline in this document quotes.

**No gate reads a rate.** The #246 shape flags are mechanical CI readings, not gates: an inversion
turns nothing red.

## §ENV — whitelist-or-refuse (#261.2 / #262.2)

Accepted: `CBC0_MODE` (smoke\|full, REQUIRED) · `CBC0_N` · `CBC0_SKIP_FP` · `CBC0_OUT` ·
`CBC0_RESUME`. ANY other `CBC0_*` var is a FATAL refusal (exit 2), and so is ANY of the ENGINE's own
env doors (`EDS_BUNDLE` · `EDS_TRACE_CHOICE` · `EMERGENT_POS` · the five `constants.ts` scale doors).
The first three are OVERRIDES: **each makes the run a PREFLIGHT** — routed onto the guard block,
never allowed to write a canonical repo path, and G-CLEAN-INVOCATION goes RED. ⭐ `CBC0_RESUME` is
**not** an override, and the reason is structural rather than a promise: **pass B never resumes**, so
a stale or corrupt checkpoint line cannot survive the X-DET digest comparison. It rides the UNHASHED
envelope.

## §CHECKPOINT

Pass A appends one JSON line per walked match to `/tmp/cb-c0-checkpoint.<mode>.jsonl` (outside the
repo, so a kill leaves no repo state), tagged with the probe's own source SHA so a checkpoint from a
different instrument can never be reused. `CBC0_RESUME=1` lets pass A re-use those rows; pass B walks
the block fresh either way.

## §NON-CLAIMS

1. **NOTHING SHIPS.** Zero `src/**` bytes; the production fingerprint re-derived unchanged; no flag,
   no gene, no eye anywhere.
2. ⭐⭐ **THE TABLE IS WIRED INTO NO PLAYER (#247).** It is instrument-side truth: the A/B baseline
   CB-T1 contrasts against, and nothing else.
3. **NO PASS/FAIL ON ANY MEASURED RATE.** The gates are the X-family, the trace gates, the source
   gate, the detection and accounting identities, the DV-C0 inheritance receipt and the
   mutant-liveness proof.
4. **THE RATES ARE CONDITIONAL, NOT CAUSAL.** Approach geometry is not randomly assigned: a defender
   arriving at 6 m/s is chasing a different carrier in a different state from one arriving at 1 m/s,
   and that state is part of the price. No counterfactual is claimed.
5. **THE REFUSAL IS A TICK DENSITY, NOT A RATE** (§DEV 2), and the four non-standing duel mechanics
   are counted but never pooled into the geometry tables (§DEV 1).
6. **THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203).** CB-T0 / CB-T1 / CB-T2 are the
   contract's.

---

<!-- §RESULT is generated: npx tsx scripts/analysis/cb-c0-census-result.ts docs/world-model/data/cb-c0-dispossession-census.json -->

## §RESULT

**350 seeds × 1 arm (BARE PRODUCTION — every experimental flag off), block 12,471,000–12,471,349, 16/16 gates PASS**, `resultSha256` `86af9fac…b985`. Every number below is printed by `scripts/analysis/cb-c0-census-result.ts` from the committed artifact; none is typed (#229.2).

### The run

```text
world             bare production — new Match({seed, teamA, teamB}); no flag, no eye, no gene, no book
matches           350   (241.8820 sim-seconds each)
standing duels    10,286   (29.3886 per match — every `tryTackles` lunge)
  won             3,751      lost 6,535
  whistle-excl.   330   (the tick's own whistle moved the ball or the taker — see §DEV)
  TABULATED       9,956   = 3,740 wins + 6,216 misses  (the geometry tables' population)
refusal ticks     4,936   (a candidate inside the challenge radius and NO lunge)
other duels       slide 1,308 · tactical grab 2,074 · keeper smother-miss 5   (counted, NOT in the geometry tables)
turnovers         12,040   (34.4000 per match, DV-C0 semantics)
mean taker speed  3.5823 m/s   ·   mean carrier speed 3.7296 m/s
v*                sqrt(2 × ACCEL × R_TACKLE) = sqrt(2 × 14 × 1.15) = sqrt(32.2) = 5.674504 m/s
estimator         cluster bootstrap by match seed, 2,000 resamples, stats base 109,600
```

### ⭐⭐ THE TAKE-RATE TABLE — P(the ball is won | a challenge is made), BY APPROACH SPEED

| approach-speed bin | window (m/s) | lunges | wins | **take rate** | CI 95 % (pp) | refusal ticks |
|---|---|---:|---:|---:|---:|---:|
| s0 walk | [0.000, 1.419) | 1,488 | 572 | **38.441 %** | [35.849, 40.988] | 1,015 |
| s1 jog | [1.419, 2.837) | 2,275 | 868 | **38.154 %** | [36.042, 40.323] | 1,462 |
| s2 run | [2.837, 4.256) | 2,338 | 918 | **39.264 %** | [37.168, 41.502] | 1,030 |
| s3 drive | [4.256, 5.675) | 2,308 | 827 | **35.832 %** | [33.833, 37.976] | 878 |
| s4 OVERCOMMITTED | [5.675, ∞) | 1,547 | 555 | **35.876 %** | [33.224, 38.323] | 551 |

### THE TAKE RATE BY APPROACH DIRECTION (φ — the taker's own direction of travel vs the carrier's heading)

| approach | lunges | wins | **take rate** | CI 95 % (pp) | refusal ticks |
|---|---:|---:|---:|---:|---:|
| chasing | 4,477 | 1,685 | **37.637 %** | [36.104, 39.202] | 2,497 |
| across | 1,924 | 733 | **38.098 %** | [35.641, 40.474] | 839 |
| head-on | 3,495 | 1,295 | **37.053 %** | [35.421, 38.745] | 1,566 |
| planted | 60 | 27 | **45.000 %** | [32.258, 57.143] | 34 |

### THE TAKE RATE BY MOTION STATE (the taker's own per-tick deltas)

| state | lunges | wins | **take rate** | CI 95 % (pp) |
|---|---:|---:|---:|---:|
| braking | 5,673 | 2,111 | **37.211 %** | [35.845, 38.665] |
| steady | 3,112 | 1,178 | **37.854 %** | [36.001, 39.754] |
| accelerating | 1,171 | 451 | **38.514 %** | [35.451, 41.362] |
| turning-hard (|Δheading| ≥ half the turn cap) | 2,837 | 1,066 | **37.575 %** | [35.672, 39.555] |

### ⚠ THE BEARING AXIS θ — STRUCTURALLY DEGENERATE, published as a finding

| bearing | lunges | wins | take rate | CI 95 % (pp) |
|---|---:|---:|---:|---:|
| front | 9,149 | 3,396 | 37.119 % | [35.848, 38.383] |
| flank | 807 | 344 | 42.627 % | [39.307, 46.211] |
| behind | 0 | 0 | n/a | [n/a, n/a] |

> ⭐ A STRUCTURAL FINDING, not a defect: the ball is carried AHEAD of the body and the challenge radius is measured about the BALL, so a candidate inside it is almost always inside the carrier's frontal cone. The bearing axis therefore cannot separate a front-on duel from a chase; the approach-DIRECTION axis φ does, and it carries R3.

### ⭐⭐ DOES OVERCOMMITMENT EXIST — AND IS IT EVER PUNISHED?

| class | lunges | wins | take rate | CI 95 % (pp) |
|---|---:|---:|---:|---:|
| OVERCOMMITTED (v ≥ v*) | 1,547 | 555 | **35.876 %** | [33.224, 38.323] |
| CONTROLLED (v < v*/2) | 3,763 | 1,440 | **38.267 %** | [36.517, 39.984] |
| *(REPORTED sensitivity)* overcommitted vs **that body's own** v\* | 1,529 | 533 | 34.859 % | [32.085, 37.551] |

**WHAT A MISSED CHALLENGE COSTS, BY ARRIVAL SPEED.** `overrun` = metres the beaten lunger travels along his own approach axis during the stun the engine imposes on him; `Δsep` = the change in his separation from the carrier over 1.2000 s (his OWN re-challenge interval); `Δspace` = the change in the carrier's distance to his nearest opponent over the same window; `retain` = the carrier's team still holds the ball (no turnover stamped, DV-C0 semantics).

| arrival-speed bin | misses | overrun (m) | CI 95 % | Δsep (m) | CI 95 % | Δspace (m) | retain @ 1.20 s | retain @ 2.40 s |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| s0 walk | 916 | **0.0443** | [0.0237, 0.0706] | 2.3854 | [2.2307, 2.5486] | 1.9085 | 85.667 % | 69.603 % |
| s1 jog | 1,407 | **0.1918** | [0.1796, 0.2045] | 2.4403 | [2.2999, 2.5835] | 1.8831 | 86.091 % | 68.746 % |
| s2 run | 1,420 | **0.4064** | [0.3862, 0.4240] | 2.1263 | [2.0109, 2.2504] | 1.5490 | 85.946 % | 69.688 % |
| s3 drive | 1,481 | **0.6797** | [0.6622, 0.6975] | 2.2542 | [2.1283, 2.3721] | 1.6584 | 86.536 % | 70.924 % |
| s4 OVERCOMMITTED | 992 | **1.1027** | [1.0690, 1.1359] | 2.4612 | [2.2953, 2.6181] | 1.7313 | 85.526 % | 68.661 % |

And the WIN side of the same picture (the overrun of a defender who *did* get the ball):

| arrival-speed bin | wins with a resolved horizon | overrun (m) |
|---|---:|---:|
| s0 walk | 572 | 0.2548 |
| s1 jog | 868 | 0.5549 |
| s2 run | 917 | 0.8342 |
| s3 drive | 826 | 1.1323 |
| s4 OVERCOMMITTED | 555 | 1.4079 |

**THE PUNISHMENT SIGNALS, as the artifact records them:**

| signal | point | CI 95 % | punishes recklessness? |
|---|---:|---:|---|
| take-rate penalty for arriving overcommitted (R1) | -0.023915 | [-0.0533, 0.0046] | no |
| carrier retention after a missed overcommitted dive (R2) | -0.004225 | [-0.0414, 0.0333] | no |
| separation gained by the carrier after the miss (R4) | 0.042565 | [-0.1418, 0.2249] | no |

⇒ `anySignalPunishes` = **false**.

**THE PRICE OF A MISS, read out of the engine's own source:**

```text
cooldown          1.2 s      (constant)
stun              0.35 s     (constant)
burst stamina     0.02    (constant)
position written  0       velocity written 0
```

> the price is a CONSTANT (G-GEOMETRY-BLIND.missPriceIsConstant): the beaten lunger pays the same cooldown, the same stun and the same burst whether he arrived walking or flat out, and the engine writes NO position or velocity change — there is no carry-through. Whatever overrun the tables show is the STUN's velocity damping acting on the momentum he already had, not a modelled commitment cost.

### ⭐ THE #246 REALITY-SHAPE CHECK — PRE-REGISTERED, evaluated with paired CIs

| id | claim (real football's SHAPE) | expected | measured | CI 95 % | verdict |
|---|---|---|---:|---:|---|
| **R1** | overcommitted arrivals take LESS often than controlled ones | NEGATIVE | -0.023915 | [-0.0533, 0.0046] | **UNRESOLVED** |
| **R2** | a MISSED overcommitted challenge is punished: the carrier retains at 2 s more often | POSITIVE | -0.004225 | [-0.0414, 0.0333] | **UNRESOLVED** |
| **R3** | a CHASING challenge (φ≈0, from behind) takes less often than a HEAD-ON one (φ≈π, the defender getting in front and facing the carrier) | NEGATIVE | 0.005839 | [-0.0151, 0.0259] | **UNRESOLVED** |
| **R4** | a beaten fast arrival is CARRIED THROUGH: separation grows more | POSITIVE | 0.042565 | [-0.1418, 0.2249] | **UNRESOLVED** |

ROUTING (from the artifact): *no inversion at this battery; every resolved shape reads in its pre-registered direction.*

⭐ **AND THE ENGINE-EXPECTED SHAPE, E1**, stated ex ante from the mechanism itself:

> E1 — the take rate is FLAT in the TAKER's approach geometry, because the take probability expression contains no term derived from his speed, heading or motion state (G-GEOMETRY-BLIND proves the premise from the engine's own source). Any observed gradient is CONFOUNDING — which carriers get challenged at speed — not a mechanism.

### ⭐⭐ THE STRUCTURAL FINDING — proved from the engine's own source (G-GEOMETRY-BLIND)

> THE TAKE IS GEOMETRY-BLIND: `tryTackles` selects its tackler by DISTANCE alone and prices the duel from team aggression, the tackler's `defending`, and the CARRIER's dribbling/strength/pace×drive. The TAKER's speed, heading and motion state enter NOWHERE. A missed lunge writes only a cooldown and a stun — both CONSTANTS — so the engine has no carry-through and no speed-dependent price for diving in.

The take-probability expression, quoted verbatim from `src/sim/mechanics.ts` by the gate:

```ts
let p =
    0.25 +
    oppTeam.genome.markingAggression * 0.2 +
    tackler.attrs.defending * 0.34 -
    match.teams[owner.side].genome.dribbleBias * 0.08 -
    owner.attrs.dribbling * 0.18 -
    owner.attrs.strength * 0.1 -

    owner.attrs.pace * drive * 0.16;
  if (oppTeam.mode === 'Press') p += 0.06;
  if (tackler.traits.includes('enforcer')) p += 0.04;

  if (helpClose && drive < 0.45) p += 0.12;
  p = clamp(p, 0.06, 0.7);
```

The MISS branch, likewise:

```ts
} else {
    tackler.tackleCooldown = 1.2;
    tackler.stunTimer = 0.35;

    const foulP =
      0.06 + oppTeam.genome.markingAggression * 0.1 +
      (tackler.traits.includes('enforcer') ? 0.02 : 0) +
      (match.derby ? 0.01 : 0);
    if (match.rng.chance(foulP)) match.awardFoul(tackler, owner);
  }
}
```

### THE CHURN LINKAGE (the #169-arc spell/turnover instruments, DV-C0's own, re-used)

```text
turnovers / match          34.4000   (one every 7.0315 sim-seconds)
duels / match              29.3886   (won 10.7171)
refusal ticks / match      14.1029   ·  proximity ticks / match 43.4914
slide tackles / match      3.7371   (won 0.7086)   ·  tactical grabs / match 5.9257
goals / match              2.1629

MEAN POSSESSION SPELL      4.3569 s   over 17,339 segments   CI [257.2269, 265.7947] ticks
  spell CONTAINING a duel  5.3773 s   over 9,954 duels    CI [313.4299, 332.2178] ticks
  spell REMAINING after it 2.9308 s
  duelled − baseline gap   61.2274 ticks   CI [53.2388, 69.5647]  ⇒ POSITIVE
```

### Gate table

| gate | result | evidence |
|---|---|---|
| `xDet` | **PASS** | digest `70d7c32b…5631` twice (pass B never resumes) |
| `xSrcUntouched` | **PASS** | `git diff --stat -- src` empty |
| `xFpProd` | **PASS** | observed `57b0bdab…c673` = baseline, re-derived in-process |
| `gConstTrace` | **PASS** | 13 conjuncts — every duel/motion constant read out of `src/**` at run time |
| `gBinsDerived` | **PASS** | 9 conjuncts — every bin edge re-derived from the traced constants, arithmetic stored |
| `gGeometryBlind` | **PASS** | 10 conjuncts against the ENGINE'S OWN SOURCE (the structural finding) |
| `gDetect` | **PASS** | 10 conjuncts · wins 3,751 + slide wins 248 = engine counter 3,999 |
| `gAccounting` | **PASS** | 14 conjuncts — tick partition, span order, cell/marginal completeness, horizon monotonicity |
| `gReproDvc0` | **PASS** | 11 integer fields, **0 mismatches**, block 12429000..12429011 — DV-C0's own smoke rows |
| `gWorld` | **PASS** | read back on a never-stepped match at seed 12,470,999 |
| `gSeedDisjoint` | **PASS** | 7 blocks machine-checked (1 re-walk, predicate INVERTED) · ledger 67 entries |
| `gStatsDisjoint` | **PASS** | base 109,600, minGap 200 ≥ 200 |
| `gCleanInvocation` | **PASS** | preflight false · reasons [] · resumeRequested false |
| `gNDerived` | **PASS** | ran N 350 = derived N* 350 (binding term: precision) |
| `gValuesUnreachable` | **PASS** | 141 src files · 18 needles (raw + formatted %) · 0 hits |
| `gMutants` | **PASS** | **97 mutants, 0 dead** — coverage NAMED: gConstTrace, gBinsDerived, gGeometryBlind, gDetect, gAccounting, gReproDvc0, gWorld, gSeedDisjoint, gStatsDisjoint, gCleanInvocation, gNDerived, gValuesUnreachable; uncovered conjuncts 0 |

⭐ **THE HEADLINE COUNT, HAND-CHECKED**: the artifact's `gates` object carries exactly **16** keys — `xDet · xSrcUntouched · xFpProd · gConstTrace · gBinsDerived · gGeometryBlind · gDetect · gAccounting · gReproDvc0 · gWorld · gSeedDisjoint · gStatsDisjoint · gCleanInvocation · gNDerived · gValuesUnreachable · gMutants` — and **16** of them pass.

### The accounting identities (gate input)

```text
ticks          5,273,071 = segment 4,532,632 + loose 0 + deadBall 740,439
assigned       4,532,632 = segmentTicks 4,532,632   ·  spanOrderViolations 0
duels          10,286 total = 9,956 tabulated + 330 whistle-excluded
cells          speed×bearing 9,956 = speed×approach 9,956 = tabulated 9,956
outcomes       wins 3,740 + misses 6,216 = tabulated 9,956   ·  motion marginal 9,956
proximity      15,222 ticks = lunge ticks + refusal ticks 4,936
planted bin    above s0: 0  (structurally empty)  ·  in s0: 60  ·  duels above s0: 8,468
```

### The N rule as executed

```text
rule            N* = min( ceil(60 / rarestCellLungesPerMatch) ↑25, floor(0.5 h / (ms/match × 1 arm × 2 X-DET)), 800 ) — DV-C0 / EK-C0 §NRULE's form, inherited, with THIS census's own numerator: a LUNGE in the RAREST (approach speed × approach direction) cell of the frozen grid. Frozen in the stage doc §NRULE BEFORE the smoke ran; the ZERO-EVENT CLAUSE (an unbounded precision term when the rarest cell is empty) is frozen with it.
smoke artifact  docs/world-model/data/cb-c0-dispossession-census-smoke.json
rarest cell     s0 walk × planted at 0.171429 lunges/match
precision term  350   ·  wall term 7,269   ·  seed-room cap 800
⇒ N*            350   (binding: precision; projected 0.0241 h)
as executed     N 350 · ms/match (from the smoke's UNHASHED envelope) 79
```

### Deviations recorded

1. ⭐⭐ THE CENSUS POPULATION IS THE STANDING CHALLENGE (`tryTackles`). The slide tackle, the tactical-foul grab and the keeper smother are DETECTED and counted, but they are NOT in the geometry table: each is a different mechanic with its own gate, and pooling them would blur the one duel the CB arc rebuilds. Their per-match rates are published in the churn block.
2. ⭐ THE REFUSAL CLASS IS A TICK COUNT, NOT AN EVENT COUNT. A challenge that is declined (the jockey gate) leaves no mark in the world, so it can only be counted as "a tick at which a candidate stood inside the challenge radius and no lunge fired". Consecutive ticks of the same standoff therefore each count once. Declared ex ante; it is a DENSITY, not a rate.
3. THE GEOMETRY IS READ AT POST-STEP, which IS the instant the mechanic saw (`tryTackles` runs after `physicsStep` and writes no position or velocity). The motion state uses the previous post-step tick, i.e. the body's own last completed tick.
4. v* USES THE BASE ACCELERATION CONSTANT (14), not the per-body one — the frozen grid must be the same for every body. The per-body classification is published beside it.
5. A HORIZON TRUNCATED BY FULL TIME IS NULL, NOT A ZERO: those events are excluded from the horizon means and their counts are stored per cell, so every mean re-derives.

### Registered non-claims (from the artifact)

1. NOTHING SHIPS: zero src/** bytes, the production fingerprint re-derived unchanged, no flag, no gene, no eye anywhere.
2. ⭐⭐ THE TABLE IS WIRED INTO NO PLAYER (#247). It is instrument-side truth: it is the A/B baseline CB-T1 contrasts against, and nothing else.
3. NO PASS/FAIL ON ANY MEASURED RATE. The gates are the X-family, the trace gates, the source gate, the detection and accounting identities, the DV-C0 inheritance receipt and the mutant-liveness proof. The #246 shape flags are MECHANICAL CI readings: an inversion turns nothing red and is ROUTED, never corrected.
4. THE RATES ARE CONDITIONAL, NOT CAUSAL. Approach geometry is not randomly assigned: a defender who arrives at 6 m/s is chasing a different carrier in a different state from one who arrives at 1 m/s, and that state is part of the price. No counterfactual is claimed.
5. THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203). CB-T0/T1/T2 are the contract's.

**VERDICT (the probe's own, mechanical):** CB-C0 DISPOSSESSION-GEOMETRY CENSUS at N=350 × 1 arm (bare production) — 16/16 gates. THE TABLE IS DESCRIPTIVE TRUTH; the #246 flags are mechanical and the commander adjudicates them (#203).

---

## §SEEDS — the ledger (#163)

Band **12,470,000–12,479,999** (ruling #265.4's pre-registration), opened above EK-C0c's
consumption through 12,465,999.

| block | seeds | kind |
|---|---|---|
| core (reserved, unused this round) | 12,470,000–12,470,011 | reserved |
| ⭐ exit-semantics **guard block** | 12,470,050–12,470,099 | reserved — where EVERY preflight invocation is routed |
| smoke / sizing battery | 12,470,100–12,470,139 (40) | **CONSUMED** |
| G-WORLD construction seed | 12,470,999 | constructed, **never stepped** |
| census + reserve | 12,471,000–12,471,799 (N ≤ 800) | **CONSUMED 12,471,000–12,471,349** (N = 350) |
| ⭐⭐ **G-REPRO-DVC0 re-walk** | 12,429,000–12,429,011 | **receipt** — DV-C0's own smoke block |

⭐ **THE RE-WALK'S PREDICATE IS INVERTED**: it *must* collide with the consumed ledger, because a
re-walk that came back clash-free would prove it is walking fresh seeds instead of reproducing a
receipt. Every other block carries the ordinary predicate (collision-free), and the sub-blocks are
ordered and disjoint. The ledger is the COMPLETE #163-regime list carried forward from EK-C0c's
committed probe and extended with EK-C0c's own band (12,461,000–12,465,999).

**Stats stream:** base **109,600** (the #265.4 floor, on the 200 grid), minimum gap to any published
base **200**; the published ledger is EK-C0c's list plus its own 109,400.

**Remaining in the band for the CB arc:** 12,470,012–12,470,049, 12,470,140–12,470,998,
12,471,350–12,479,999.

## §CHECKS (#226.1)

```text
$ npx tsc --noEmit
(clean)

$ CBC0_MODE=smoke CBC0_N=3 CBC0_SKIP_FP=1 CBC0_OUT=/tmp/cbc0-guard.json \
    npx tsx scripts/probes/cb-c0-dispossession-census.ts
  seeds 12470050..12470052            ← routed onto the exit-semantics GUARD block
  GATES *** RED ***: … gCleanInvocation FAIL …   (15/16; every other gate green)
  exit 1                              ← the census block stays VIRGIN

$ CBC0_MODE=smoke CBC0_N=2 CBC0_OUT=docs/world-model/../world-model/data/x.json \
    npx tsx scripts/probes/cb-c0-dispossession-census.ts
  CB-C0 FATAL — a PREFLIGHT invocation may not write a canonical repo path
  exit 2 · no file written (the traversal spelling is RESOLVED, not substring-tested)

$ CBC0_MODE=smoke npx tsx scripts/probes/cb-c0-dispossession-census.ts
  GATES GREEN (16) · G-REPRO-DVC0 11 fields 0 mismatches · G-MUTANTS 97 mutants · 0 dead
  exit 0 · resultSha256 731c5b6509e7cea9ff671f2d74c8a699ab6f713698a6e60b4e3856d4a5d23253
  wall 20.4 s (CONTEXT ONLY) · artifact docs/world-model/data/cb-c0-dispossession-census-smoke.json

$ CBC0_MODE=full npx tsx scripts/probes/cb-c0-dispossession-census.ts
  GATES GREEN (16) · N* 350 (the PRECISION term binds) · block 12,471,000–12,471,349
  exit 0 · resultSha256 86af9fac70de7b378468f25444b2b99cbd1a45aa573e7810d32dd3e2f43cb985
  wall 67.5 s (CONTEXT ONLY) · artifact docs/world-model/data/cb-c0-dispossession-census.json

$ npx tsx scripts/analysis/cb-c0-census-result.ts \
    docs/world-model/data/cb-c0-dispossession-census.json
  → the whole §RESULT section above, on stdout
```

⭐ Every command run in this round is transcribed above; the `resultSha256` in the §RESULT header is
the one the generator read out of the committed artifact, so the two are the same string or this
document would not build. `npm test` is **not** re-run and is named rather than implied: this round
adds **one probe, one generator, two artifacts and one doc**, touches **no** `tests/**` file and
**no** `src/**` byte (`xSrcUntouched` is a HARD gate and PASSES on the run that wrote the artifact),
so the suite's state is the one banked at the previous commit.

## §DEV — deviations, and the one instrument correction made mid-round

The five deviations frozen ex ante are printed in §RESULT from the artifact. **Two things happened
during the round that are not in that list and are recorded here in full:**

1. ⚠⚠ **THE BEARING AXIS θ WAS FOUND DEGENERATE IN A PREFLIGHT, AND AN APPROACH-DIRECTION AXIS φ
   WAS ADDED BEFORE THE BATTERY RAN.** The first design's only angle axis was θ, the taker's
   **bearing** from the carrier relative to the carrier's heading. A 3-match preflight on the guard
   block showed 97 of 103 candidate bearings inside the front cone and **zero** behind — and the
   cause is structural, not statistical: the ball is carried **ahead** of the body and the challenge
   radius is measured about the **BALL**, so a candidate inside it is almost always inside the
   carrier's frontal cone. An axis that cannot separate a front-on duel from a chase cannot carry
   R3. The **approach-direction axis φ** (the taker's own direction of travel vs the carrier's
   heading, at the SAME traced cone cuts) was added, R3 was re-registered on it, and **both axes are
   published** — θ as the structural finding it turned out to be. ⭐ **What was and was not seen when
   this was decided:** only the preflight's bearing *counts*, on 3 guard-block matches; no census
   seed had been walked, no take rate, no shape verdict and no punishment number had been read on
   any axis. The census block was still virgin.
2. ⚠ **THE WHISTLED-DUEL EXCLUSION, added after the first full run's G-DETECT went red.** 22 of
   10,286 duels had the tackler outside the challenge radius at post-step. The cause was found and
   is mechanical: a missed lunge can become a **foul**, and a foul in the box awards a PENALTY (the
   ball is moved to the spot) while a card can be a **sending-off** (the offender is parked on the
   apron) — in both cases the post-step geometry is the RESTART's, not the duel's. Such duels are
   now flagged `whistled`, **counted** and **EXCLUDED from every geometry table** (330 of 10,286 =
   3.2 %), and G-DETECT's conjunct was narrowed to its true claim — *every UNWHISTLED duel is inside
   the challenge radius* — with a second conjunct proving the out-of-radius set is a subset of the
   whistled one. The census was then re-run from scratch on the same reserved block; the numbers
   published here are that run's, and the first run's artifact was overwritten, not merged.
3. **THE BATTERY WAS RUN IN THE FOREGROUND, NOT AS A BACKGROUND JOB.** The frozen N rule returned
   N\* = 350 and the measured cost was 79 ms/match, so the whole battery (two passes, the re-walk,
   the fingerprint and the mutants) is **67.5 s** of wall. A background job plus a polling monitor
   would have cost more than the run. The checkpoint machinery is armed and was written to
   regardless, so a kill would have been resumable.
4. **THE PRECISION TERM BOUND AT N\* = 350** (not the seed cap): the rarest admissible cell
   (`s0 walk × planted`) carries 0.171429 lunges/match in the committed smoke, so
   `ceil(60 / 0.171429) = 350`. The battery's own rarest admissible cell came in at 60 lunges — on
   target, which is what the rule was written to deliver.
