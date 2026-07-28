# C5 RE-CENSUS — The enriched world's waiting price

Status: **PRE-REGISTERED 2026-07-29, FROZEN BEFORE IMPLEMENTATION.** Nothing is
built. Nothing has been run. No `src/**` change is made by this freeze; no probe
for the re-census exists yet. This document fixes the instrument (the SAME one as
C5 T1, with the four #36/#29.1 repairs applied and marked), the H1 re-powering,
the staging, and the full sign-space readings **before** a single line is written
— the P1/P2 two-commit discipline (#45.2(b): executor drafts → commander review
→ authorized implementation → authorized run → ruling). **This freeze returns to
the commander. Implementation and the run each need their own authorization; NO
run happens under this freeze** (ruling #60.4: freeze → commander review → run).

## §0 — Authority, and the world under census

Authority chain: **ruling #60.3** (the single C5 re-census AUTHORIZED for
drafting — the held-tick exchange rate re-measured on the JOINTLY ENRICHED
world) · **#29.3** (the unpark law, verbatim: C5-T2 drafts iff any hold cell's
cost interval reaches zero; a world that still pays nothing re-parks the seat and
no subsidy ships — itself a real finding) · **#29.1** (H1 re-powered: held-out
clusters sized so 2.0 pp ≥ 3σ, or the tolerance re-derived ex ante; all four
repairs carried) · **#36** (the four cross-AI-verified census defects this freeze
repairs) · **#26.5** (population law: the BEFORE table is the shipped-world
reference; this census states its HEAD and its armed flags) · **#46.2** (smoke/
census seed disjointness) · **#48.4** (fork measurement window pinned ex ante) ·
**#49.3** (event-keyed exception classes + per-record receipts, incl. E-INJURY) ·
**#38.1** (standing exception classes mandatory; decision rules cover the whole
sign space) · **#20** (CI semantics, cluster unit = match seed; unresolved is
never "no effect") · **#24** (floors attainable on the deployed population, checked
ex ante). Contract: [`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md) — this stage
still lives under it (§4 Q2/Q3/Q6, §6 population law). The BEFORE instrument:
[`C5-T1-WAITING-CENSUS.md`](C5-T1-WAITING-CENSUS.md).

### §0.1 The world under census (state it plainly, #26.5)

The census world = **the shipped world at HEAD `60a18d7`** with **BOTH dormant
flags armed**, plus the VALUE brain the population law requires:

```text
VALUE arm  edsPerceivedDefence · edsPerceivedChoice · edsValueAxis · c5Hold
ENRICHED   c6Carry = true      AND      c7Windup = true
```

* **`c6Carry` — certified provenance.** The honest carry offset: the rigid
  `owner.pos + heading·0.85` glue is replaced by `owner.pos + dir(θ_ball)·carryLen
  + noise`, a lagged, dribbling-scaled, tucked offset that reads **only** the
  body's own `|v|`, `|ω|`, `dribbling` — **no opponents, no percepts, no
  ball-context** (C6 §4.2, invariant I2). Certified end of C6 T1R (ruling #50,
  GATES PASS): the seam is single-point (`Match.ts:1719`, gated `c6Carry &&
  carry===0.85`), OFF is byte-identical, both priced axes resolved UP
  (+11.63 % eligibility, +1.32 pp far-side), unexplained exactly 0 over the
  E-INJURY-enlarged class set with per-record receipts. Match-safe at C6 T2
  (ruling #54). Default **false** (`Match.ts:805`); dormant in production.
* **`c7Windup` — certified provenance.** The shot wind-up: the previously
  zero-tick strike gains a `pendingKick` committed-but-unstruck window (the
  release-side mirror of `pendingControl`), pricing the rushed/twisted strike
  through prices that already existed and opening a real-but-thin charge-down
  channel. Certified end to end (rulings #56/#57/#58, GATES PASS): axis 2 = the
  design case, axis 1 = reading (D-band). Match-safe at C7 T2 (ruling #60.1: the
  paired push +0.1975 goals/match [+0.05, +0.34] = +8.79 %, every watchability
  limb ≥15× inside its edge, structural seam 0/107,684). Default **false**
  (`Match.ts:807`); dormant in production; fires only via `c7Windup` at
  `Match.ts:1652`.

### §0.2 #26.5 statement — the comparison is the point, not a confound

The BEFORE table ([`C5-T1-WAITING-CENSUS.md`](C5-T1-WAITING-CENSUS.md) §11.2:
monotone **−7.55 / −12.77 / −16.12 pp** at k = 30/60/90, twin-confirmed at
release −6.53/−10.20/−12.40, concession +1.45/+2.63/+3.55 pp, pressure shape
free −10.53 / mid −18.87 / pressed −16.77, tempo baseline median spell 0.33 s /
mean 0.68 s) is the **shipped-world reference**. It was measured on a world with
BOTH flags OFF and with three of this census's four repairs absent. This
re-census states its own HEAD (`60a18d7`) and its own armed flags (§0.1). **The
BEFORE and the re-census are DIFFERENT WORLDS by construction — that difference is
exactly what the exercise measures.** Any movement of a cost cell between the two
is the enriched world's answer to Q2, not a confound to be corrected. The BEFORE
table is quoted as reference only; it is never differenced numerically against the
re-census inside a gate (the two ran on different populations, different repairs,
different power).

---

## §1 — THE INSTRUMENT (same as C5 T1, with the four repairs applied and marked)

The instrument is C5 T1 verbatim: at value-brain **eligible-choice** decision
moments (§1.5, repair iv), fork the deterministic world four ways off the SAME
pre-step state (paired by construction) and read the shot-within-horizon axis:

```text
A0  ACT-NOW    the untouched fork — pass / carry / shoot (never a hold)
A1  HOLD-30    forcedHold 30 ticks (0.5 s), then free
A2  HOLD-60    60 ticks (1.0 s)
A3  HOLD-90    90 ticks (1.5 s) — T0R's own measured window
```

**THE WORLD IS ENRICHED IN EVERY ARM.** Both flags are armed in the census
`Match` config, so A0 and the three hold arms — the release twins included — all
run in the c6Carry+c7Windup world. The enrichment is a property of the WORLD, not
of one arm; a fork that armed the flags only inside the hold arms would confound
the flags with the hold and is forbidden.

**Outcome axis (frozen, C5 T1 §4 verbatim):** the attacking team's
`teams[side].stats.shots` strictly increases within **HORIZON = 240 ticks of the
DECISION MOMENT** in every arm (the horizon origin is the decision moment, not the
release — a held tick is a spent tick, C5 T1 §4). Every window simulated to its
end; no adjudication conditioning; truncated only by the match ending.

**Context cell (frozen, C5 T1 §5 verbatim):** pressure band × staleTime band ×
support band = 27 cells, read from the pre-fork state. Cuts unchanged: pressure
`0.15 / 0.45`; staleTime `3 s / 8 s`; support = own non-GK non-sent-off players in
the 6–30 m window, **terciles computed on the BUILD block and applied to both**.

### §1.1 REPAIR (i) — fallback populations get REAL cluster CIs (fixes #36.1, the label-only ladder)

**The defect (#36.1, verified against code).** In C5 T1's `buildTable`
(`scripts/probes/c5-t1-waiting-census.ts:308–351`) the per-cell `ladder` label is
computed by the fall-down rule (`:323–326`), but `rates` is **always**
`rateOf(rows, arm)` over the raw sparse cell (`:329`) — the rate is never
recomputed on the population the cell fell *to*. A cell labelled `pressure` or
`marginal` still reports its own five-row rate. The committed table therefore
cannot price T2, and **#29.3's cell-interval unpark test is currently
uncomputable** (there is no per-cell paired cost, and no per-cell CI at all).

**The repair (exactly how the ladder now computes on the laddered population).**
For each of the 27 cells:

1. Determine the cell's **rung** by the frozen ladder, floor 300, unchanged:
   `(pressure×stale×support) → (pressure×stale) → pressure → marginal`. The first
   rung whose population `≥ 300` rows (per arm) is the cell's rung.
2. The cell's **laddered population** `P_rung` = every moment matching the rung's
   coarsened key (e.g. for rung `pressure`, all moments in that pressure band).
3. Compute, **on `P_rung`**, and store on the cell record:
   * per-arm shot rate `rateOf(P_rung, arm)` (so the reported rate is the rate of
     the population actually used, not the sparse cell);
   * the **paired cost** for each k: `mean over P_rung of (shot_holdk −
     shot_actnow)`;
   * the **95 % cluster bootstrap CI** of that paired cost, cluster = match seed,
     the frozen estimator (§3.4).
4. Record the rung each cell fell to (a coverage report, never merged after
   sight — C5 T1 §5, E5d C1's rule).

The unpark test (§2) reads these **laddered, CI-bearing per-cell costs**. A cell
that falls to `marginal` shares the marginal cost interval — correct, because that
is the only population that can price it; the label is no longer decorative.

### §1.2 REPAIR (ii) — concession read at elapsed 240 in BOTH arms (fixes #36.1, the clock skew)

**The defect (#36.1, verified against code).** C5 T1 reads the attacking `shot`
axis at `elapsed === HORIZON` and never again (`:177–185`) — correct. But the
concession twin `conceded = defending.stats.shots > concededBefore` is read
**once, after the whole `holdTicks + HORIZON` loop** (`:189`). For a hold arm the
loop runs `k` ticks longer (to reach the release-origin window), so the concession
half reads at **elapsed 240 + k** while act-now reads at **elapsed 240**. The hold
arms get `k` extra ticks to concede. #36 WITHDREW the twin's concession half on
exactly this skew (the shot-side stood).

**The repair.** Read concession at the SAME horizon the shot axis is read at:
capture `conceded = defending.stats.shots > concededBefore` at the tick where
`elapsed === HORIZON`, mirroring the shot capture (`:177–185`), in **all four
arms**. The extra `k` ticks a hold arm still simulates exist ONLY to populate the
release-origin twin (§1.4) and touch neither the shot axis nor the concession
axis. Act-now (holdTicks 0) already breaks at HORIZON, so it is unchanged; the fix
binds the three hold arms.

### §1.3 REPAIR (iii) — a PERCEPT-COMPLIANT shield (fixes #36.1, the omniscient ShieldHold)

**The defect (#36.1, verified against code).** The `ShieldHold` executor
(`src/ai/actionExecutor.ts:464–509`) finds the nearest threat by iterating
`opp.players` — **opponent TRUTH** (`:473–482`) — and faces the body away from it.
The holder orients his shield toward the true nearest defender regardless of what
he could actually see. C5 T1 therefore censused a **non-compliant capability**
(#36.1). This is precisely the omniscience C6's law was written to avoid: an
offset that "swung toward the far side *of a defender* would be the omniscient
auto-shield the cross-AI audit caught in ShieldHold (#36) in physics costume"
(C6 T1 §LAW, lines 163–168).

**The repair (the holder scans via his OWN percept, E-series pull semantics).**
The shield's nearest-threat search reads the **holder's own perceived
opponents**, not `opp.players` truth:

* Replace the `opp.players` scan with the nearest opponent in
  `match.perceivedSnapshot(holder)` — the pull-reconstructed percept
  (`Match.ts:2704–2717`): `materialisePerceptionSnapshot` over the body's own
  recorded scan frames, i.e. "everything this body's scans would have shown,
  computed now, from the moments its eyes were actually open" (E3R2, ruling
  #13.3; perception is PULL). Its `players` are `ObservedPlayer` with observed
  positions and `ageTicks` — stale reads point the shield at where the defender
  *was seen*, which is the honest capability.
* **Fallback when no threat is perceived:** face the own goal / hold position, as
  the existing `else` branch already does (`actionExecutor.ts:493–496`) — a holder
  who has seen no defender shields blind, he does not snap onto a truth he cannot
  see.
* **The stamina drain and the walking-pace protective carry** (`:497–508`) are
  unchanged; only the threat-direction READ becomes perceived (the C6 T1R
  precedent: "v1 makes the READ perceived, not the alarm", PlayerBrain
  `:1207–1215`).

**Does this need the perception chain armed in forks? — checked; NO extra flag
(the P2 precedent).** Scan frames are recorded for a body whenever a perception
consumer is active: `(edsPerceivedChoice || stationEye !== null)` at a fired scan
tick (`Match.ts:2637–2646`). The census VALUE arm arms `edsPerceivedChoice`, so
outfield bodies — the holder included — accumulate scan frames every match, and
`perceivedSnapshot` reconstructs from them via the lazy pull
(`Match.ts:2708–2716`, `edsEagerPerception` stays false). `cloneSimulationState`
deep-clones the `perceptionMemories` / `scanFrames` / `perceivedBalls` Maps
(`cloneState.ts` Map branch), so the forked holder carries his accumulated scan
history, and `refreshPerception` keeps firing at his decision ticks during the
hold (`Match.ts:1004`). **This is the P2 precedent exactly** (ruling #44 / P2
§2.3: a dormant perception consumer's observers must have their scan moments
recorded or the pull reconstructs from an empty history and every body believes he
is alone — `Match.ts:2632–2636`). Here that recording is already on because
`edsPerceivedChoice` is armed; no new perception flag is introduced.

**Consequence for the zero-src convention (flagged for the commander, §5).** A
percept-compliant shield cannot be measured without changing the `ShieldHold`
executor's threat READ, so this re-census — unlike C5 T1's X2 "zero `src/**`" —
carries **one dormant-only src edit**. It is compensated by X-family gates (§3.2)
proving production is untouched: `ShieldHold` is reachable only through `forcedHold
&& c5Hold` (`PlayerBrain.ts:169–170`), `forcedHold` is null in every production
path, so the fingerprint and OFF-path identity are unchanged. See §5 for the
doc/ruling tension this surfaces.

### §1.4 The release-origin twin (unchanged, reported never gated)

Each hold arm's window is re-anchored to start at RELEASE and read at
release + 240 (C5 T1 §8.3). Reported beside the primary, never substituted. The
hold arms simulate `holdTicks + HORIZON` ticks solely so this twin is defined; the
extra ticks feed only the twin (§1.2).

### §1.5 REPAIR (iv) — eligible-choice moments only (fixes #36.1, universal forced holding)

**The defect (#36.1).** C5 T1 forced a hold at EVERY qualifying decision moment.
#36 narrowed its headline to *"UNIVERSAL forced holding loses badly in this world;
conditional waiting is unresolved."* A T2 chooser never faces a hold where holding
was not a real option; censusing holds at moments where no sane brain would hold
prices a straw man.

**The repair (frozen eligibility predicate — a real hold was choosable).** A
qualifying decision moment (C5 T1 §2.1: playing, non-GK, non-sent-off owner, at a
brain-decision tick, ≥ MOMENT_SPACING since the last sampled moment, per-match cap
not reached) is **eligible** iff ALL hold, read paired from the pre-fork state and
the untouched A0 decision:

1. **Settled control** — `owner.firstTouchWindow <= 0` (`Player.ts:118/369`): the
   ball is controlled, not in a first-touch / receiving transition. A hold needs a
   ball to shield.
2. **Not a forced release** — `match.restartKickGid !== owner.gid`
   (`Match.ts:719`): `mustKick` moments cannot hold (`PlayerBrain.ts:94, 170`).
3. **The alternative is to BUILD, not to finish or panic** — the A0 (untouched
   fork) decided action at the decision moment is **not `Shoot` and not
   `ClearBall`**. Holding instead of a chosen clear strike, or instead of a forced
   clearance, is not a real hold choice; holding instead of a pass / carry / cross
   is. (Read from A0's decided action after its first fork step — A0 runs anyway
   and the decision is deterministic; the pre-fork state is identical across arms,
   so this is paired.)

Ineligible moments are **excluded from every table, gate and CI**, and the
retained fraction and each exclusion reason are REPORTED (a coverage report, §3.5,
class-keyed like the exception classes). The census population is now "moments
where a T2 chooser would deliberate about holding," which is the population #29.3's
unpark test must read.

---

## §2 — THE READINGS (the #29.3 unpark law, verbatim; full sign space, #38.1)

**The unpark law, verbatim (#29.3 / #60.3):** *C5-T2 (the WHETHER seat) drafts
**iff any hold cell's cost interval reaches zero**. A re-censused world that still
pays nothing re-parks the seat and no subsidy ships — that too is a real finding
about this game's economy at 0.33 s spells.*

**Operationalized (frozen).** For every cell (on its laddered population, §1.1)
and every k ∈ {30, 60, 90}, the paired cost `mean(shot_holdk − shot_actnow)`
carries a 95 % cluster bootstrap CI. A cell's cost interval **"reaches zero"** iff
its **upper CI bound ≥ 0** (the cost is no longer resolved-negative — it touches
or crosses zero). **UNPARK fires iff any (cell, k) cost interval reaches zero.**
Under #20 semantics an interval straddling zero is INCONCLUSIVE, never "no effect";
for the unpark law such a cell still counts as "reaches zero," because the seat's
question is whether ANY hold cell has stopped provably costing.

The re-census **cannot draft C5-T2** — the commander does, iff this fires (§4).

**The full sign space, pre-laid (no narrative chosen after the numbers, #38.1):**

```text
(S1) COSTS SHRINK BUT STAY NEGATIVE — every cell-k cost CI still excludes zero
     (upper < 0), shallower than the BEFORE table. UNPARK does NOT fire. A real
     finding: the enriched world made waiting cheaper but still never free; the
     seat stays parked, no subsidy ships.
(S2) A CELL REACHES ZERO / TURNS POSITIVE — at least one cell-k cost CI has
     upper >= 0 (or excludes zero on the positive side). UNPARK FIRES. Returns to
     the commander with the offending cells, their k, their laddered rung, the
     concession twin and the per-k curve; the commander decides whether C5-T2
     drafts. Plausible movers, NAMED but NOT gated on (the guess does not steer
     the reading): the low-pressure / stationary-tuck cells, where c6Carry's
     lagged tuck protects the shielded ball (C6's exposure asymmetry emerges by
     geometry) so a held tick loses less; and cells where c7Windup lets the
     eventual release be a composed strike (C7's +8.79% goals is a release-side
     payoff), lifting the hold arm's post-release shot. These are hypotheses about
     WHICH cells, laid so the reading is legible — not a gate, and NOT an
     attribution claim (§4).
(S3) COSTS DEEPEN — some cell-k cost CI is MORE negative than BEFORE (enrichment
     made waiting worse: e.g. a livelier act-now baseline raises the opportunity
     cost of a held tick). UNPARK does NOT fire. Also a real finding, reported
     with the same weight as S1.
(S4) MIXED / UNRESOLVED — some cells shrink, some deepen, some straddle at the
     re-powered resolution; whether any reaches zero is read cell by cell. If any
     does, S2's disposition governs; if none does, the seat stays parked and the
     mixed structure is reported.
(S5) HARNESS GATES FAIL — any X / C / H / D gate (§3) fails ⇒ FAIL, the fork
     returns to the commander, no reading is banked as certified. (A mis-sized H1
     that fires is a gate failure, not a table failure — C5 T1 §11.1's lesson;
     but §1.6 re-powers H1 precisely so this is not pre-ordained.)
```

None of S1–S4 is a FAIL; all are C5-relevant findings. Which occurs decides only
whether the commander may draft C5-T2 (S2), not the re-census's own verdict.

---

## §3 — GATES, STAGING, POWER

### §1.6 / §3.0 — H1 RE-POWERED (#29.1, the arithmetic shown, with a correction)

**The law (#29.1, verbatim):** held-out clusters sized so the **2.0 pp tolerance
≥ 3σ**, OR the tolerance re-derived ex ante with the derivation shown. **This
freeze takes the FIRST branch — the 2.0 pp tolerance is inherited whole and never
touched, and the clusters are sized up to make it a real 3σ gate** (the strongest
form of #29's own lesson: a 2.1σ gate "buys a verdict that cannot distinguish its
own two readings"). The second branch is costed and offered to the commander in
§5.

**A CORRECTION to the source figure (surfaced, #36 spirit).** C5 T1 §7.2b's
"build/held-out difference SE ≈ 0.95 pp" is the **naive per-moment-independent**
SE (`√(p(1−p)(1/n_b+1/n_h))` at p≈0.21, `n_b`=6000/`n_h`=2500) — it does **not**
include cluster (match-level) variance. That is precisely why H1 fired: the
marginal is "the statistic most exposed to" the cluster-level "how shot-heavy a
match is" property (C5 T1 §11.1), and the true cluster SE is larger than 0.95 pp.
The banked data JSON stores only rates and `n`, not the marginal's cluster CI, so
the true cluster variance is **not** recoverable from the committed table — it is
measured directly, ex ante, by the sizing smoke (§3.7), on the correct population
(the ENRICHED, ELIGIBLE world this re-census actually deploys on). #29.1's "the
original run's measured cluster variance" is honoured in substance: the smoke
re-measures the same quantity the original run should have banked.

**The measured cluster variance (sizing smoke, §3.7, 48 disjoint matches).**
`σ_c` = per-match (cluster) SD of the act-now marginal shot rate on the enriched
eligible population = **11.135 pp** (`σ_c² = 124.0 pp²`). Model, clusters ≈ matches
(each seed one match at the per-match cap):

```text
SE_diff^2 = σ_c^2 · (1/K_build + 1/K_heldout)
```

**The 3σ requirement.** 2.0 pp ≥ 3·SE_diff ⇒ SE_diff ≤ 0.6667 pp ⇒
SE_diff² ≤ 0.44449 pp² ⇒ `(1/K_build + 1/K_heldout) ≤ 0.44449 / 124.0 =
0.0035846`.

**The chosen design (ratio 2.5 : 1, as C5 T1's 75 : 32 ≈ 2.34):**

```text
K_build >= 980 clusters ,  K_heldout >= 392 clusters
1/980 + 1/392 = 0.0010204 + 0.0025510 = 0.0035714   (<= 0.0035846, inside the floor)
SE_diff = 11.135 · sqrt(0.0035714) = 11.135 · 0.059761 = 0.6654 pp
2.0 pp / 0.6654 pp = 3.006σ           ✅ meets the 3σ floor
```

(The smoke's own solver returns the minimal pair `K_build = 978, K_heldout = 391`;
this freeze rounds up to 980 / 392.)

**The match count this forces.** Cluster = match seed and clusters ≈ matches (the
smoke measures ≥ 47 eligible moments in EVERY match, so every walked match is a
cluster), so the re-census needs **≥ 980 build matches + ≥ 392 held-out matches =
≥ 1,372 matches**. The powered quantity is the cluster count, not the moment
budget — the original failed on 32 held-out clusters, and cluster-bootstrap
SE ∝ 1/√K. This is the heaviest census in the programme (4-way forks at ~59
eligible moments per match); the runtime cost, and the cheaper second-branch
alternative, are flagged for the commander in §5.

### §3.1 Gate table

**X-family — identity and harness (any failure ⇒ FAIL, S5).**

| gate | predicate |
| --- | --- |
| **X-FP** | `npm run fingerprint` returns `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`, unchanged (the dormant shield edit, §1.3, is behind `forcedHold && c5Hold`, unreachable in production). |
| **X-OFF-IDENT** | with all census flags OFF, world signatures byte-identical to pre-change HEAD across 3 league seeds × 2 seasons (the shield-read edit changes nothing when `forcedHold` is null). |
| **X-SEAM** | a test asserts the shield's threat READ is the ONLY `ShieldHold` change; `perceivedSnapshot` is consulted only inside `ShieldHold`; `forcedHold` null on a fresh `Match`. |
| **X4 (seam inert)** | C5 T1 verbatim: with `c5Hold` armed and `forcedHold` an ALREADY-EXPIRED `untilTick`, the fork's 240-tick signature is byte-identical to the untouched A0 fork, on 3 seeds. |
| **X5 (seam bites)** | C5 T1 verbatim: for k = 90 the hold arm's signature differs from A0's in ≥ 90 % of moments. |
| **X-DET** | two `runExperiment()` invocations byte-identical; SHA-256 emitted and quoted in §RESULT. |

**C — coverage.**

```text
C1  build block:    >= 980 clusters (the re-powered floor, §3.0)
C2  held-out block: >= 392 clusters (the re-powered floor, §3.0)
C3  every PRESSURE ROW carries >= 300 eligible rows per arm, in BOTH blocks
    (attainability confirmed by the sizing smoke, §3.7)
```

**H — held-out calibration (the instrument test, re-powered).**

```text
H1  | shotRate_build - shotRate_heldout |  <=  2.0pp   on the marginal, per arm
    — now 3.01σ at the design cluster counts 980/392 (§3.0), NOT the original 2.1σ
H2  | shotRate_build - shotRate_heldout |  <=  5.0pp   on each gated pressure row, per arm
```

**D — determinism.** Two runs byte-identical (folded into X-DET).

**NOT gated (C5 T1 §6.4 verbatim):** the exchange rate itself (§2, reported never
gated); discrimination across cells (reported in full).

### §3.2 The exchange rate — reported, never gated (C5 T1 §8 verbatim)

Primary statistic per k: the paired per-moment difference `mean(shot_holdk −
shot_actnow)`, 95 % cluster bootstrap over match seeds, under #20 semantics.
Reported beside it: the concession twin (now clock-correct, §1.2); the
release-origin twin (§1.4); monotonicity in k; the per-pressure-band curve; the
per-cell laddered cost table with CIs (§1.1, the unpark input); the hold anatomy
(survival / tackle-loss); the paired-vs-unpaired estimator side by side; and the
§9 tempo instruments re-read on the enriched world (C5 T1 §9, re-reported per the
standing rule).

### §3.3 Staging (frozen)

| item | value | why |
| --- | --- | --- |
| HEAD | `60a18d7` | the shipped world the enrichment sits on (#26.5) |
| build block | seeds **8,300,000 +** k | fresh; above every consumed range (§3.4) |
| held-out block | seeds **8,400,000 +** k | disjoint from build (100k apart) and from all consumed ranges — C3R discipline (the block that builds may not validate) |
| MAX_MATCHES (build) | **1,200** ceiling (8,300,000 .. 8,301,199) | headroom over the ≥980-cluster floor at the reduced eligible yield |
| MAX_MATCHES (held-out) | **480** ceiling (8,400,000 .. 8,400,479) | headroom over the ≥392-cluster floor |
| stop rule | walk until the block's cluster floor (§3.0) is met, then finish the current match | cluster-driven, not budget-driven (§3.0) |
| match duration | **240** | C5 T1 verbatim |
| per-match cap | **80** eligible moments | C5 T1 verbatim (spread across clusters) |
| MOMENT_SPACING | **30 ticks** | C5 T1 verbatim |
| flags | VALUE arm + **c6Carry + c7Windup**, in EVERY arm incl. release twins | §0.1, §1 |
| cluster unit | the **match seed** | #20 |
| bootstrap | 2,000 resamples, frozen seed **50060** | C5 T1's estimator family, new seed |
| output | `docs/world-model/data/c5-recensus.json` (table + gates + per-cell laddered cost CIs), SHA-256 printed and recorded in §RESULT | #10 deliverable, data not src |

### §3.4 Consumed ranges — disjointness (#46.2)

Consumed and cleared (from C7 T2 §3.1, the current authoritative list): P0 930k ·
P1 960k–1.46M · P1R 980k–1.48M · P2-A 2.0M–3.2M · P2-B 3.5M–3.9M · C4/C5 700k–970k
· C6 T0 smoke 4.0M · C6 T0 census 4.1M–4.7M · C6 T1/T1R 5.0M–6.1M · C6 T2 6.2M–6.5M
· C7 T0 smoke 6.6M · C7 T0 census 6.7M–7.1M · C7 T1 smoke 7.2M · C7 T1 run
7.3M–7.8M · **C7 T2 7.9M–8.2M** (7,900,000 .. 8,200,199). This re-census's
**sizing smoke 8,290,000–8,290,015**, **build 8,300,000+**, **held-out 8,400,000+**
all lie above every consumed range and are mutually disjoint (a clear gap
8,200,200 .. 8,289,999 separates the smoke from C7 T2). Nothing overlaps.

### §3.5 Exception & coverage classes, event-keyed, with per-record receipts (#38.1 / #49.3)

Every fork classes to a named channel; **unexplained is gated at exactly 0** over
the class set. Standing exception classes (mandatory boilerplate, #38.1):

```text
E-PAUSED    a fork window entered a non-'playing' phase (halftime / restart)
E-INJURY    an advantage-foul injury to a fork body inside the window (#49.3):
            attrs mutation post-read (Match.ts:1915->1919 maybeInjure /
            Player.ts:223 takeKnock) OR same-gid becomeSub reposition without
            release (Match.ts:2042 / Player.ts:33)
E-NOOWNER   the ball had no owner at the sampled tick (loose / in-flight)
E-GKHOLD    the owner was a keeper holding
E-MATCHEND  the match ended inside the window; the arm reads at whatever it
            reached, COUNT REPORTED (#48.4 convention)
```

Coverage classes for repair (iv) exclusions (REPORTED, not errors):

```text
X-FIRSTTOUCH   ineligible: owner in a first-touch window (firstTouchWindow > 0)
X-MUSTKICK     ineligible: owner is the restart taker (restartKickGid)
X-A0-SHOOT     ineligible: A0's decided action was Shoot
X-A0-CLEAR     ineligible: A0's decided action was ClearBall
```

Per-record receipts (seed, tick, gid, cause) are recorded for every exception and
coverage-exclusion hit, **capped at 1,000 per class** (#49.3): attribution carries
receipts, not inference.

### §3.6 The fork window, pinned ex ante (#48.4)

For all four arms the window is **HORIZON = 240 ticks from the decision moment**;
the shot axis and (repair ii) the concession axis are read at the tick where
`elapsed === HORIZON` and never again. The release-origin twin's window is
**240 ticks from the release tick** (hold arms simulate `holdTicks + HORIZON`
solely to reach it). A fork whose match ends inside a window reads at whatever it
reached and is classed **E-MATCHEND** with the count reported. No horizon is left
to post-hoc choice.

### §3.7 The sizing smoke (read-only, disjoint, committed with this doc — #24 / #46.2)

Because repair (iv) is NEW, the eligible-moment yield per match — and hence the
attainability of the §3.0 cluster floors and the §3.1 C3 row floor on the eligible
population — is not derivable from banked data (the #24 lesson: a floor is checked
against the ATTAINABLE population ex ante). A read-only smoke over the disjoint
block **8,290,000–8,290,015** (16 matches) measures, with NO forced holds and NO
src change, using only untouched A0 forks: the eligible-moment count per match, the
exclusion-reason shares, the eligible-population pressure-band shares, and the
act-now marginal shot rate with its per-match (cluster) SD, **which is the
measured σ_c the H1 re-powering (§3.0) is derived from** (the banked table cannot
supply it — §3.0). Block **8,290,000–8,290,047** (48 matches — enough to
stabilise σ_c). Its numbers are DISCLOSED in §RESULT-SMOKE below; they FIX the
frozen cluster floors (§3.0) rather than being read against them after the fact —
the smoke runs and is committed WITH this freeze, before any census run, so this
is ex-ante sizing, not the re-powering-after-sight the discipline forbids.

---

## §4 — NON-CLAIMS (what this re-census does not do)

* **It prices measurement; it ships nothing.** Zero live callers; `c6Carry` /
  `c7Windup` / `c5Hold` remain default-OFF; the fingerprint is unchanged (X-FP);
  the table is committed as data, not baked into `src/ai/`.
* **It cannot draft C5-T2 itself.** The unpark test (§2) is computed and returned;
  the WHETHER seat is the COMMANDER's to draft, iff a cell's cost interval reaches
  zero (S2). A re-census that fires unpark still ships no subsidy on its own.
* **It makes NO claim about WHY a cell moved.** Attribution between c6Carry and
  c7Windup is NOT this census's question. The world is enriched by both at once
  (§1); single-flag ablation arms are NOT in scope. The plausible-mover names in
  S2 are legibility hypotheses, never gated on and never reported as attribution.
* **It does not relabel the BEFORE table.** BEFORE is the shipped-world reference
  (§0.2); the re-census stands on its own HEAD and flags.

## §5 — For the commander's eye

**(a) The zero-src departure.** Repair (iii) forces a **departure from C5 T1's X2
"zero `src/**`"**: a percept-compliant shield cannot be measured without editing
the `ShieldHold` executor's threat read (truth → percept). The edit is
dormant-only (behind `forcedHold && c5Hold`, unreachable in production), and X-FP /
X-OFF-IDENT / X-SEAM are added to prove production and the OFF path are
byte-unchanged — but the re-census is no longer a zero-src probe the way C5 T1
was. This is inherent in #36's finding (the omniscient shield was a defect *in the
measured capability*, not in the harness) and in #60.3's mandate for a
percept-compliant shield; it is surfaced rather than buried. If the commander
prefers the shield edit to live as its own tiny dormant slice (a "C5 T0b"
shield-compliance seam) before the re-census forks over it, that is a clean
alternative — say so at review.

**(b) The H1 re-powering is expensive, and #29.1's second branch is much cheaper.**
The corrected cluster SD (σ_c = 11.135 pp, §3.0 — the banked 0.95 pp was naive)
makes the inherited 2.0 pp tolerance a 3σ gate only at **980 / 392 clusters
(≈1,372 matches, 4-way forks)** — the heaviest census in the programme. #29.1
explicitly permits the second branch, **re-deriving the tolerance ex ante**; from
the same measured σ_c (smoke §RESULT-SMOKE) the 3σ tolerance at feasible designs is:

```text
K_build/K_heldout   SE_diff    3σ tolerance    σ at the inherited 2.0pp
   180 /  72         1.553 pp     4.66 pp             1.29σ
   300 / 120         1.203 pp     3.61 pp             1.66σ
   400 / 160         1.042 pp     3.13 pp             1.92σ
   500 / 200         0.932 pp     2.80 pp             2.15σ
```

This freeze commits the **first branch (980/392, tolerance untouched)** as the
disciplined default. If the commander judges the runtime unaffordable, the clean
amendment is to adopt e.g. **400/160 with H1 re-derived to a 3.13 pp tolerance**
(a genuine 3σ instrument at ~560 matches, ~11% relative reproduction bar on the
~28% base rate) — decided at review, ex ante, exactly as #46.2/#48.3 amended C6's
freezes. Whichever the commander picks, the tolerance/cluster pair is frozen
before the run; it is surfaced here so the choice is the commander's, not a
post-hoc degree of freedom.

**(c) The exchange-rate power is unaffected.** The paired per-moment exchange rate
(§3.2) is estimated at ~57,000 build moments and is orders of magnitude better
resolved than H1's marginal-reproduction gate; the unpark test (§2) reads the
paired per-cell cost CIs, which are the tight paired estimator, not the marginal.
The cluster-count debate is entirely about the H1 instrument gate, not about the
census's ability to price the hold cells.

## §6 — Stop rules (C5 T1 §12 verbatim)

Any X / C / H gate fails ⇒ FAIL (S5), the fork returns to the commander; H may not
be relaxed after sight (§3.0 re-powers it ex ante instead). The exchange rate
cannot fail and cannot be re-cut, re-keyed or re-horizoned after sight (a
different keying is a new stage). No stage may be rescued by tuning a neighbour.

---

## §RESULT — the run (VERDICT **FAIL**, published LABELLED — ruling #62)

> **⚠ LABEL (standing convention P2 (d); T1's ruling #69; ruling #62.1).** This
> census **FAILS its own power floor** and is **PUBLISHED LABELLED**. The gate
> `h1SigmaFloor` fired: the realised cluster σ_c came in **7 % above the smoke's
> projection**, so the H1 marginal-reproduction gate was certified at **2.8105σ,
> below the 3σ floor** (#61.3, bound at full weight). **NO reading below —
> INCLUDING THE UNPARK COMPUTATION — MAY BE QUOTED AS A VERDICT.** Everything in
> this section is banked as LABELLED DATA. The certified reading is the #62.3
> extension's (addendum below), which neither this section nor the commander may
> pre-empt.

Probe `scripts/probes/c5-recensus.ts`, HEAD `60a18d7`, build block **8,300,000+**
(980 clusters), held-out block **8,400,000+** (392 clusters), enriched world
(VALUE arm + c6Carry + c7Windup in EVERY arm), bootstrap seed 50060.

### §RESULT.0 — the verdict, and why it is a gate failure, not a table failure

The census met every gate **except the one it was re-powered to meet**. H1's
*reproduction* is excellent — the largest build↔held-out marginal drift is
**0.75 pp** (arm hold30; the other three arms ≤ 0.20 pp), far inside the 2.0 pp
tolerance. But the tolerance was **certified at 2.81σ**, and the floor exists
precisely so that reproduction is *certified, not lucky* (C5 T1 §11.1's lesson;
S5). A mis-sized H1 that fires is a **gate failure (S5), not a table failure** —
so the fork returns to the commander and **no reading is banked as certified**.
The cause is arithmetic and named: the sizing smoke projected σ_c = 11.135 pp;
the run realised **σ_c = 11.9075 pp** (+7 %), which at the frozen 980/392 clusters
gives SE_diff = 0.7116 pp and 2.0 / 0.7116 = **2.8105σ**.

```text
H1 POWER (realised)
  σ_c (per-match cluster SD, enriched eligible act-now marginal)   11.9075 pp
  SE_diff = σ_c · √(1/980 + 1/392)                                  0.7116 pp
  σ-multiple = 2.0 pp / SE_diff                                     2.8105 σ
  floor                                                             3.00  σ      → FAIL
  smoke projection (ex ante, §RESULT-SMOKE)                        11.135  pp     (under-estimate −7 %)
```

### §RESULT.1 — the gate table

```text
X-FP           fingerprint 57b0bdab… unchanged (dormant shield edit unreachable)   PASS
X-OFF-IDENT    3 league seeds × inert-pin identical (reported.inertPins all true)  PASS
X-SEAM / X4    seam inert: forced-hold expired ⇒ byte-identical to A0 (3 seeds)    PASS  (x4SeamInert)
X5             seam bites: k=90 signature differs from A0 in 100 % of moments      PASS  (x5SeamBites, floor 90 %)
X-DET          two runExperiment() invocations byte-identical; SHA emitted         PASS  (dDeterministic)
C1             build clusters 980 ≥ 980                                            PASS
C2             held-out clusters 392 ≥ 392                                         PASS
C3             every pressure row ≥ 300 eligible rows per arm, both blocks         PASS
H1 (reproduce) max marginal drift 0.75 pp ≤ 2.0 pp, per arm                        PASS  (h1Marginal)
H1 (σ-FLOOR)   2.8105σ ≥ 3.00σ                                                     ✘ FAIL (h1SigmaFloor)
H2             every gated pressure row ≤ 5.0 pp drift (max 2.01 pp)               PASS
UNEXPLAINED    exactly 0 over the class set, both blocks                           PASS  (unexplainedZero)
```

**The single failing gate is `h1SigmaFloor`.** Verdict **FAIL** (S5).

### §RESULT.2 — the labelled substance (banked as data, ruling #62.2; NOT a verdict)

**The waiting price is SHALLOWER across the whole ladder** than the BEFORE
reference (§0.2; quoted as reference only, never differenced in a gate). Paired
per-moment cost `mean(shot_holdk − shot_actnow)`, 95 % cluster bootstrap:

```text
k        RE-CENSUS (enriched)         BEFORE (C5 T1, reference)
30    −6.41 pp  [−6.90, −5.90]          −7.55
60   −11.09 pp  [−11.65, −10.51]       −12.77
90   −15.06 pp  [−15.69, −14.43]       −16.12          monotone in k; all three still exclude zero on the marginal
```

**The concession twin collapses** (repair (ii), the clock-skew fix, working) —
BEFORE read +1.45/+2.63/+3.55 pp; the re-census, reading concession at the SAME
horizon in all arms:

```text
concession twin   k30  +0.38 pp [+0.19, +0.56]   k60  +0.80 [+0.59, +1.00]   k90  +0.95 [+0.74, +1.17]
```

**The release-origin twin** (§1.4, reported never gated), re-anchored to release:

```text
release twin      k30  −4.41 pp [−4.89, −3.94]   k60  −7.37 [−7.99, −6.78]   k90  −9.89 [−10.58, −9.26]
```

**Per-pressure curve** (paired cost, pp; free / mid / pressed):

```text
k30   free −6.69   mid −8.22   pressed −6.01
k60   free −10.38  mid −12.57  pressed −10.93
k90   free −12.87  mid −16.37  pressed −15.20
```

**Hold anatomy** — the shielded ball survives the wait less as k grows:

```text
survived / lost-to-tackle    k30  85.8 % / 8.4 %    k60  77.0 % / 15.9 %    k90  69.2 % / 22.7 %
```

### §RESULT.3 — ⭐ THE UNPARK COMPUTATION FIRES (labelled; NOT a certified verdict)

The #29.3 test — *any (cell, k) cost interval whose upper CI bound ≥ 0* — **fires
on TWO cells**, both at **k = 30 (half a second)**, both in the **free-pressure,
fresh-ball (low staleTime)** corner, at low and mid support. On their own laddered
`cell` rung (no fall-down):

```text
CELL  free · fresh · LOW support     rung cell   n = 369
  rates   actNow 14.36 %  hold30 13.01 %  hold60 7.05 %  hold90 3.25 %
  cost k30  −1.36 pp  CI [−5.75, +2.79]   ⇒ upper +2.79 ≥ 0   → REACHES ZERO ★
  cost k60  −7.32 pp  CI [−11.23, −3.58]
  cost k90 −11.11 pp  CI [−15.22,  −7.37]

CELL  free · fresh · MID support     rung cell   n = 830
  rates   actNow 17.47 %  hold30 14.58 %  hold60 8.55 %  hold90 8.31 %
  cost k30  −2.89 pp  CI [−5.62,  0.00]   ⇒ upper 0.00 ≥ 0   → REACHES ZERO ★
  cost k60  −8.92 pp  CI [−11.67, −5.96]
  cost k90  −9.16 pp  CI [−12.12, −6.35]
```

In the calmest corners of the enriched world, **half a second of waiting is no
longer distinguishably a loss** — the cost interval touches or crosses zero. Under
the label this is a **computed fact banked as data**, not a fired unpark: the
#29.3 law may not be quoted as a verdict on a FAILED census. Whether the zero
survives the narrower intervals of the #62.3 extension (each cell's n grows ~26 %)
is the CERTIFIED question.

### §RESULT.4 — tempo, re-read on the enriched world (§9, reported)

The enriched world plays **FASTER**, with the spell length unchanged:

```text
                         ENRICHED                legacy (flags-off)
releases / minute        30.72                   28.78
one-touch share          20.35 %                 18.93 %
spell seconds median     0.3333  (mean 0.635)    0.3333  (mean 0.662)
decisions / spell        4.23                    4.41
```

### §RESULT.5 — exception & coverage ledger (#38.1 / #49.3; unexplained gated at 0)

```text
                       build            held-out
qualifying moments     78,326           31,336
eligible (retained)    58,184 (74.28%)  23,188 (74.00%)
  X-FIRSTTOUCH         13,554            5,445
  X-MUSTKICK            3,929            1,598
  X-A0-SHOOT            2,604            1,078
  X-A0-CLEAR               55               27
E-PAUSED               70,093           28,181
E-INJURY                1,683              559
E-MATCHEND                 16               24    (reads at whatever reached; count reported #48.4)
E-NOOWNER / E-GKHOLD        0 / 0            0 / 0
UNEXPLAINED                0                0    ← gated at exactly 0 (PASS)
```

### §RESULT.6 — provenance (X-DET)

```text
full-output SHA-256   ef1776a8dd4b1066e2b463ff90790251727ac621e7146d9ec7d08449ab90a057
table SHA-256         55db4f16e29281221d2e9773b7897210c2da099e2092ffc8cac3408d40370ec8
determinism           two runExperiment() invocations byte-identical (X-DET PASS)
data                  docs/world-model/data/c5-recensus.json
```

## §RESULT-SMOKE — the read-only sizing smoke (disclosed; fixes the H1 sizing ex ante)

Probe `scripts/probes/c5-recensus-sizing-smoke.ts`, block **8,290,000–8,290,047**
(48 matches, disjoint — §3.4), enriched world (c6Carry + c7Windup + VALUE arm),
untouched A0 forks only, NO forced holds, NO `src/**` change.

```text
qualifying moments        3,840        eligible 2,846  (eligible fraction 0.7411)
eligible per match        mean 59.29   min 47   max 71   → every match is a cluster (C1/C2 attainable)
exclusions (repair iv)    firstTouch 687 · mustKick 175 · A0-Shoot 131 · A0-Clear 1  (25.9% of qualifying)
eligible pressure shares  free 0.136 · mid 0.136 · pressed 0.728   (smallest band 13.6%)
act-now shot rate (elig)  0.2814
σ_c (per-match cluster SD of the act-now marginal, ENRICHED ELIGIBLE population)  = 11.135 pp
```

**H1 re-powering, from the measured σ_c (§3.0):**

```text
2.0pp @ 3σ needs   K_build 978 / K_heldout 391  →  frozen 980 / 392  (≈1,372 matches)
feasible-design 3σ tolerances (for §5's second-branch offer):
  180/72 → 4.66pp   300/120 → 3.61pp   400/160 → 3.13pp   500/200 → 2.80pp
```

**Attainability (#24), confirmed:** cluster floors reached by construction (every
match yields ≥47 eligible moments, so ≥980/≥392 matches give ≥980/≥392 clusters
within the §3.3 ceilings). C3's 300-per-row floor: the smallest pressure band is
13.6 % of eligible moments; at ~59 eligible/match the build block holds
≈ 980·59·0.136 ≈ 7,860 rows and the held-out ≈ 392·59·0.136 ≈ 3,150 rows in that
band — both far above 300. **No frozen quantity was moved by these numbers; they
FIX the sizing ex ante (§3.7).**
