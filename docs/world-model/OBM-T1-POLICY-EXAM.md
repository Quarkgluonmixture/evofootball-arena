# OBM T1 — the POLICY EXAM (hand-dose the off-ball EYES seat, measure the world)

Status: **FROZEN BEFORE SIGHT, then SMOKED, then CORRECTED PRE-BATTERY.** Everything from §FORM
to §NON-CLAIMS — the
world, the eight arms and their exact matrices, the ruler, the guards, the estimator, the
success wording, the seed ledger, the N rule and the gate list — was written **before** any
number of this stage existed. The measured numbers live in
[§RESULT — the smoke](#result--the-smoke) and
[§RESULT — FULL BATTERY](#result--full-battery) (N* = 356 × 8 arms as the frozen rule
computed on same-world inputs, GREEN, adjudicated by ruling #230 in PROGRAMME-RULINGS.md).
*(Header updated by the commander at banking — the pre-battery revision of this line said the
numbers arrive only in the smoke.)* Everything sharpened after a run —
the two things sharpened after the FIRST smoke, and the **pre-battery evidence-layer
corrections** (an unsourced doc column, a gate's under-scoped machine check, a field named
beyond what it measures) — is recorded in **Deviations**, not smoothed away. **No arm, dose,
ruler, guard, estimator or gate LEVEL changed in the correction**; the measured rows are
byte-identical to the first smoke's.

Authority chain: contract
[`OFFBALL-MOVEMENT-CONTRACT.md`](OFFBALL-MOVEMENT-CONTRACT.md) — §3 **OBM-T1** (the whole
CTB-T1 instrument set INHERITED WHOLE; success and **F-OBM-a/b/c** pre-named there), §1
H-OBM, §2 the law, §4 the non-claims. Rulings **#227** (the seat's contract) · **#228** (the
banked seat: the intercept participates ONLY through its own gate) · **#228.5** (the recorded
debts — this round pays **(b)**, the G-FORK token completion) · **#228.6** (the T1 notes,
carried verbatim: the exam world MUST be percept-armed · the doses are designed against the
OBSERVED feature distribution · **ZERO IS SILENCE**) · **#225.3(c)** (per-dose STOP
granularity) · **#226 / F-CTB-a** (the static plane delivered geometry, not supply — the
missing dimension is WHEN). Dispatched under the live **#225** self-drive arc.

The instrument this stage stands on:
[`CTB-T1-SUPPLY-EXAM.md`](CTB-T1-SUPPLY-EXAM.md) and its probe — inherited **whole**, and
that inheritance is **proved** rather than asserted (⭐ **G-REPRO-CTBT1**, below). The seat
itself is [`OBM-T0-DORMANT-SEAM.md`](OBM-T0-DORMANT-SEAM.md), banked at `600ff04`.

> ⭐ **INSTRUMENT-ONLY ROUND.** `src/**` is **byte-untouched** (X-SRC-UNTOUCHED is a HARD
> gate). Arms are built by the `obmMovement` MatchConfig flag plus the 16-weight matrix
> written on all three genome views of both teams. The #228.5(b) fork-token completion is
> **instrument-side**: the probe's grep widens, no engine byte moves.

---

## §FORM

### The world — ONE percept-armed base world, IDENTICAL in every arm

```text
new Match({ seed, teamA, teamB, duration: 240, edsPerceivedChoice: true })
```

**Why percept-armed at all (the #228.6 gate).** A blind body has no policy: OBM-T0's G-BLIND
proved that a fully armed, fully dosed seat in a world without the percept trunk is
byte-identical to that world unarmed. An exam run blind would therefore report *"no policy
dose moves the supply"* while never having delivered a policy at all — the P1 failure mode
wearing a treatment's clothes. **G-BLIND-WORLD** is HARD here for exactly that reason.

**Why `edsPerceivedChoice` ALONE is the minimal arming.** `refreshPerception` runs when
`edsPerceivedDefence || edsPerceivedChoice || stationEye !== null`, but a body's snapshot
**players** are reconstructed from his **recorded scan moments**, and those are recorded only
under `edsPerceivedChoice || stationEye !== null` (`src/sim/Match.ts`). So:

| candidate | what it gives the seat | verdict |
| --- | --- | --- |
| `edsPerceivedDefence` alone | a memory with **no scan frames** ⇒ every body believes he is alone ⇒ **all four features exactly zero** | ⛔ armed-looking, treatment undelivered |
| `stationEye` | needs a whole eye configuration; a far larger intervention | ⛔ not minimal |
| **`edsPerceivedChoice` alone** | the refresh **and** the scan-moment record — the smallest flag set that makes the eyes actually see | ✅ **chosen** |

⚠ **The cost of that choice, declared not hidden**: `edsPerceivedChoice` is not
behaviour-free — it also moves the **carrier** onto the perceived-snapshot pass chooser
(`PlayerBrain.ts`). This world is therefore **not** CTB-T1's bare production world, and the
two exams' **absolute levels are not comparable**. The **paired contrast is clean either
way**, because all eight arms share this world exactly and differ by nothing but the matrix.
Weighed and stated: a smaller flag set that leaves the eyes blind is strictly worse than a
slightly larger world that delivers the treatment.

⭐ **THE TWO-DOORS DECLARATION.** `ctbSupportPlane` is **FALSE in every arm** — asserted per
arm in-probe, never merely stated. By the #228 fix the policy's **intercept is a hard 0**, so
what this exam doses is the **DYNAMIC term alone**, on the incumbent `supportSpot` geometry as
its zero point. The banked static plane (#224) is not this exam's question and cannot leak in
through the OBM door.

### The arms — 8, paired on ONE shared seed list (#20: cluster = match seed)

Every non-zero weight is a **domain corner** (±1) of the frozen signed domain
`[OBM_WEIGHT_MIN, OBM_WEIGHT_MAX]` = `[CTB_GENE_MIN, CTB_GENE_MAX]`, derived in code. No bound
is re-cut and no number is invented. Slot index is the seat's own convention,
`output · 4 + feature`; features are `[f1 carrierPlight, f2 ownMarker, f3 targetCongestion,
f4 readingAge]`, outputs are `[planeDepth, planeWidth, supportScore, runScore]`.

| arm | the 16-weight matrix (rows = outputs) | the football sentence |
| --- | --- | --- |
| **ABSENT** | *(no flag, no matrix)* | the CONTROL — the same percept-armed world with the seat unreached |
| **ARMED-ZERO** | all 16 slots `0` | the IDENTITY arm: armed, matrix present, must be **byte-identical to ABSENT** per seed |
| ⭐ **CHECK-WHEN-PRESSED** | `depth ← [−1, 0, 0, 0]` | **the 回撤 hypothesis in policy form**: when the man on the ball is in trouble, come short — and not otherwise |
| **CHECK-AND-SHOW** | `depth ← [−1,0,0,0]` · `support ← [+1,0,0,0]` | the same drop **plus the demand**: real checking is movement AND an offer |
| **MARKER-ESCAPE** | `depth ← [0,+1,0,0]` · `width ← [0,+1,0,0]` | the tighter your marker, the further you go from where he wants you — forward (spin in behind) and wide |
| **SPACE-SEEK** | `width ← [0,0,+1,0]` · `depth ← [0,0,−1,0]` | if the spot you were going to is crowded, do not go there — widen off it |
| **STALE-CAUTION** | `support ← [0,0,0,−1]` · `run ← [0,0,0,−1]` | if your picture is old, do not gamble — neither demand the ball nor spend yourself on a run |
| ⭐ **KITCHEN-SINK** | all four rows full: `depth −1×4` · `width +1×4` · `support +1×4` · `run −1×4` | **the CEILING PROBE, stated as one**: come short · hold width · demand the ball · do not gamble. The most this seat can express; **not** a football recommendation |

⚠ **THE DOSES ARE DESIGNED AGAINST THE OBSERVED FEATURE DISTRIBUTION** (#228.6: means
f1 0.184 · f2 0.456 · f3 0.216 · f4 0.171), never against the weight domain alone. An output
is the **mean** of its weighted features, so a single-slot corner at ±1 delivers on average
about `mean(f_i)/4` of an axis. **f1 is the scarcest feature**, so a CHECK-WHEN-PRESSED dose
is small *on average* and large exactly where the carrier is pressed: **that CONCENTRATION is
the hypothesis**, not a weakness of the dose. Every arm therefore publishes its **DELIVERED**
dose (§the delivered dose) so that *dose ≠ delivered* stays visible — the CTB-T1 clamp lesson
generalised.

**Two halves, two deliveries.** Two output rows drive the **plane** (geometry) and two drive
the two candidate **scores**. A score-only corner (STALE-CAUTION) moves **no geometry by
construction**, and a plane-only corner leaves both multipliers at exactly 1. G-ARM checks
delivery on the axes an arm doses **and silence on the axes it does not**.

### The ruler — ALL INHERITED, each with its own G-REPRO gate

| # | quantity | provenance | gate |
| --- | --- | --- | --- |
| **1** | **TRUE-holdable supply** (share of eligible moments) | the O2-T1 `trueCellOf` instrument VERBATIM on the #186 population | G-REPRO-O2T1 |
| **2** | **pressed-first-reception** (openPlay spells, `TOUCH_CONTROL_DIST`) | the #173 tempo-census instrument VERBATIM | G-REPRO-173 |
| 3 | short-option supply (poss ticks · first receptions) | #224.4(i)'s debt; radius family PARSED from source | G-TRACE-RADIUS |
| 4 | support-existence at PRESSED moments | (3) under (2)'s pressure test | — |
| 5 | the #218 arc shares (constructed ≥3/4/5 · scramble · set-piece) | the goal-genealogy ORIGIN CLASSIFIER, LOSS-TICK semantics verbatim | G-REPRO-GGC |

⭐ **AND THE WHOLE SET IS PROVED TO BE CTB-T1's** — **G-REPRO-CTBT1**: this probe re-walks the
first rows of the **committed CTB-T1 battery block** in **CTB-T1's own ABSENT world** and must
reproduce every published per-match field **exactly**, whole-match **signature** (rng stream
state inside) included. A single changed instrument constant, sampling rule or walk order reds
it.

**PRIMARY RULER: 1 + 2** (the two unsaturated columns, and the two the N rule is cut on).
Rulers 3/4 are **REPORTED with their ceilings disclosed**; ruler 5 is **REPORTED** by
construction — no gate reads a cell of it.

### The estimator

The CTB-T1 set verbatim: per-match (seed-clustered) **paired** bootstrap, ratio-of-totals,
2.5/97.5 percentiles, 2,000 resamples, **one resampled seed-index set feeds every arm**.
`resolved` is a **mechanical CI flag** (the paired-delta CI excludes zero), **never a
verdict** (#203).

## §SUCCESS — pre-registered, restated VERBATIM from contract §3

> success = a policy dose moves ruler 1 or 2 **resolvedly helpful** with **that dose's guards
> held** (the #225.3(c) per-dose granularity verbatim)

Helpful = TRUE-holdable supply **UP** or pressed-first-reception **DOWN**. Pre-named failure
branches, verbatim from the contract:

* **F-OBM-a** — *no policy dose moves the supply* (the receiver-side program itself is
  re-examined — the arc's honest death branch). **Reported as-is if it fires.**
* **F-OBM-b / F-OBM-c** — **F-CTB-b/c verbatim**: clump/interception · offside/health.

### The STOP granularity — FROZEN, inherited verbatim (#225.3(c))

F-OBM-b/c fire **per dose**: a dose whose guard **breaches** (resolved AND beyond the frozen
tolerance) is **disqualified** as a candidate; the **arc-level STOP** fires only if **every**
dose that moves the primary ruler helpfully is disqualified. Frozen with it: every row is read
**beside its delivered dose**, so a null result can never be read as *a strong dose that
failed* when it was *a weak dose that arrived*.

⚠ **The probe fires none of them** (#203): it emits per-arm rows and paired deltas with
mechanical CI flags. Adjudication is the commander's.

## §GUARDS — every tolerance frozen ex ante

Inherited verbatim, with the frozen `NI_FRACTION` tolerance form:

| limb | direction | tolerance |
| --- | --- | --- |
| `interceptionsPerMatch` | ceiling | `NI_FRACTION · |control|` |
| `spreadYOut` | floor | `NI_FRACTION · |control|` |
| `spacingMedian` | floor | `NI_FRACTION · |control|` |
| `spacingUnder4` | ceiling | `NI_FRACTION · |control|` |
| offsides/match | the #157 **FLAG** form — a resolved increase returns to the commander, flips no gate |
| equilibrium band (goals/crosses/headers/longBalls/cutbacks) | **gates at battery N only**; at any N the #198-form exclusion applies (a dimension the ABSENT arm itself fails is EXCLUDED and DISCLOSED) |

`NI_FRACTION = 1 − 0.275/0.380` (PM-T1 §5, from A4-S2P1-VECTOR-CENSUS §4). `breach = resolved
AND beyondTolerance` — **evidence** for F-OBM-b/c, never the firing of it.

## §SEEDS — fresh, strictly above everything OBM-T0 consumed (#163)

OBM-T0's own committed ledger: **12,424,000–024** (receipts) · **12,424,025** (cost read) ·
**12,424,900–906** (test seeds). This stage therefore starts at **12,424,026**.

| block | range | use |
| --- | --- | --- |
| **smoke** | **12,424,026 – 12,424,037** (12) | all 8 arms |
| **delivered-dose read** | **12,424,040** (1 seed × 8 arms) | ⭐ the DECLARED fourth block — an OBSERVATIONAL match per arm (below) |
| **exit-semantics guard** | **12,424,050 – 12,424,099** | any `OBMT1_N`/`OBMT1_SKIP_FP` override is routed here and adjudicates nothing |
| **battery** | **12,424,100 – (12,424,100 + N − 1)**, contiguous, cap **628** | the battery, if dispatched |
| free above | 12,424,038–039 · 12,424,041–049 · 12,424,728–899 · 12,424,907 + | later |

Disjointness is computed **in-probe** against the COMPLETE consumed ledger (27+ blocks), never
asserted here, and — since the pre-battery correction — for **every one of the eight blocks this
stage touches**, not only the exam walk: 2 FRESH (exam · the declared dose read) · 2 RESERVED
(guard · battery) · 4 RE-WALKS. The four re-walk blocks are **deliberate re-walks of their
sources' own committed blocks** — receipts, never fresh data — so their predicate is inverted:
each must land **inside** its source's consumed interval.

**Stats stream**: base **105,000** (CTB-T1 consumed 104,800), min gap to any published base
**≥ 200**, complete namespace published in-probe.

⭐ **Why the dose read gets its own block.** Reading the FEATURES and the two SCORE
MULTIPLIERS requires asking the seat again, which pulls a percept and **advances that body's
memory**. Inside an exam arm that would be an intervention wearing an instrument's clothes.
So the exam walk reads only what is **already computed** (`match.obmPlaneFor(p)` — pure
geometry, no pull), and the feature/score distributions come from **one observational match
per arm on its own seed**, DESCRIPTIVE ONLY: no CI, no exam row, no gate level. The one gate
that reads it — G-BLIND-WORLD — reads it only for the **non-degeneracy of the world**, which
every arm shares.

## §NRULE — the CTB-T1 MDE form, recomputed for THIS world

```text
m_iid  = (z.975 + z.80)² · (p0(1−p0) + p1(1−p1)) / (p1 − p0)²
DEFF   = MAX( inherited O2-T1 paired-delta DEFF , this world's own smoke DEFF when it exists )
m_req  = DEFF · m_iid
N(q)   = ceil( m_req / momentsPerSeed )
N      = max_q N(q) , capped by the LEDGER ROOM and by the CTB-T1 precedent cap (628)
```

⚠ **The honest part.** `p0` and moments-per-seed are **world-dependent**, and this world is
not CTB-T1's. Where **this probe's own committed smoke exists** they are read from ITS ABSENT
arm and the smoke's own paired-delta CI on the CEILING arm supplies a **same-world DEFF**
(noisy at 12 clusters — hence used only through a MAX with the inherited one, the conservative
direction). Where it does not, they are the inherited **out-of-world** numbers and the
substitution is published as `sourceOfP0`. The **MDEs stay the traced committed ones** (the
O2-T1 resolved delta for q1; the #173 census's own smallest cross-arm gap for q2): no
same-world MDE exists, and choosing one after sight is exactly what frozen-before-sight
forbids.

**The cap is a CEILING, not a target, and it is FLAGGED when it binds**: an armed
percept-armed battery costs ≈1.4× the CTB-T1 wall (#228.4), so the dispatch caps the battery
at the CTB-T1 precedent N = 628. If the rule asks for more, `capBinds` publishes the **fork**
for the commander beside `nRaw`; the probe re-cuts nothing.

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

| gate | predicate | kind |
| --- | --- | --- |
| **X-DET** | the whole core (8 arms + 4 receipt walks + 8 dose reads + summaries + bootstrap) runs **TWICE**, byte-identical digests | HARD |
| **X-FP-PROD** | the production fingerprint re-derives `57b0bdab…c673` in-probe | HARD |
| **X-SRC-UNTOUCHED** | `git diff --stat -- src` is EMPTY | HARD |
| ⭐ **G-REPRO-CTBT1** | a re-walk of the committed CTB-T1 battery block's first rows in CTB-T1's OWN world reproduces **every published field exactly, signature included** | HARD |
| **G-REPRO-O2T1** | ruler 1's rows reproduce the committed O2-T1 control rows | HARD |
| **G-REPRO-173** | ruler 2 reproduces the committed tempo-census numbers field for field | HARD |
| **G-REPRO-GGC** | ruler 5's ported classifier reproduces the committed genealogy census counts (63 fields) | HARD |
| **G-TRACE-RADIUS** | ruler 3's radius family is PARSED from `src/ai/formations.ts`, never typed | HARD |
| ⭐ **G-BLIND-WORLD** | the percept trunk is **LIVE** in every arm's constructed world **and** the features are **non-degenerate** (snapshots exist · `someFeatureNonZeroShare > 0` — at least one of the four features non-zero · all four feature means > 0). ⚠ The third limb is **non-degeneracy, not "opponents perceived"**; the complement `allFeaturesZeroShare` is published as an **upper bound** on blindness | HARD |
| **G-ARM** | the matrix on **all three genome views of both teams**; the seat **REACHED** (policy-cache writes > 0 on every seed); the four support-tick classes **partition exactly**; ⭐ delivery on the axes an arm doses and **silence on the ones it does not**; **ARMED-ZERO delivers exactly zero shift** and both multipliers exactly 1 | HARD |
| **FLAG-HYGIENE** | ARMED-ZERO ≡ ABSENT per seed on the whole-match signature **and** every row field; the dose matrices well-formed at domain corners; ⭐ the **two-doors** row: `ctbSupportPlane` FALSE and `edsPerceivedChoice` TRUE in **every** arm | HARD |
| ⭐ **G-FORK-TOKENS** | the #228.5(b) debt PAID: the token grep gains `obmOffballPolicy` and `OBM_POLICY_TTL_TICKS`; every `src/**` occurrence enumerated and classified, **zero unclassified**, the named forks/apply sites counted exactly | HARD |
| **SEED-DISJOINT** | ⭐ **EVERY block this stage touches** vs the COMPLETE consumed ledger, each under its own predicate: the **FRESH** blocks (exam · the declared dose read) and the **RESERVED** ones (guard · battery) must be **clash-free and pairwise disjoint**; the four **RE-WALKS** (O2-T1 · #173 · GGC · CTB-T1) must land **INSIDE** their sources' consumed intervals — a clash-free re-walk would prove it is walking fresh seeds instead of reproducing a receipt. Sub-blocks ordered; battery clash-free | HARD |
| **STATS-DISJOINT** | base 105,000, min gap ≥ 200 against the complete published namespace | HARD |
| **G-CLEAN-INVOCATION** | any `OBMT1_N` / `OBMT1_SKIP_FP` override routes onto the guard block, reds this gate and exits 1 | HARD |

Checkpoint/resume is the #207 form (`OBMT1_MODE` / `OBMT1_RESUME` / `OBMT1_CHECKPOINT`),
resilience only: the unit is the per-(pass, seed) set of 8 arm rows, nothing pooled is stored,
a resumed run is byte-identical to a fresh one, and the checkpoint is /tmp scratch read by no
gate.

## §NON-CLAIMS

This stage claims **no** football effect and adjudicates **nothing**: it produces per-arm rows
and paired deltas. The smoke below is **12 seeds** — it is a plumbing shakedown and a
delivered-dose reading, **not** evidence about H-OBM. It changes no TeamBrain assignment or
licence, no pass selection, no carrier behaviour; it adds no gene, no action type, no render
cue; `src/**` is untouched and the production fingerprint is unchanged. It does not claim the
four feature families are complete (M-OBM.2 bounds them), it does not claim the chosen corners
exhaust policy space (they are eight points in a 16-dimensional signed cube), and it cannot
authorize the battery — only the commander can.

---

## §RESULT — the smoke

*(every number below is quoted FROM the committed artifact
[`data/obm-t1-policy-exam-smoke.json`](data/obm-t1-policy-exam-smoke.json), recomputed by
`npx tsx scripts/probes/obm-t1-policy-exam.ts` — the doc carries no evidence the artifact does
not.)*

> ⚠ **THE RULE ABOVE WAS BROKEN ONCE AND IS RE-ASSERTED HERE.** The first cut of this §RESULT
> published a **delivered-dose MAX column whose five numbers appear nowhere in the artifact**
> (6.30 / 6.36 / 8.90 / 8.05 / 13.55 m against the committed 3.4491 / 3.4873 / 4.3857 / 4.8318
> / 10.7537 m). It was caught pre-battery, the column is rebuilt from the artifact below, the
> provenance investigation is recorded in **Deviations 5**, and the whole §RESULT was
> re-swept **programmatically** against the artifact rather than re-read by eye. The prior
> `resultSha256` **`4a3bc707…ec71` is SUPERSEDED pre-battery**; no measured rate, CI, guard or
> gate level moved with it (the re-run's only artifact motion is the seed-disjointness block,
> one renamed field and the digests — enumerated in Deviations 6).

> ⭐ **AND SUPERSEDED A SECOND TIME, BY A GATE-PREDICATE CORRECTION THE BATTERY EXPOSED.**
> `8d850857…3639` **is superseded** by `33ea85f0…c9c0`. The battery run went **14/15 green with
> SEED-DISJOINT red**, and the red was a **self-comparison artifact in this stage's own new
> `stageOwnOverlaps` check, not a ledger clash**: in FULL mode the walked exam block **IS** the
> reserved battery block (`RUN_BASE === BATTERY_BASE`, same N-derived count, 12,424,100–727),
> so the reservation and the walk that redeems it were compared against each other and reported
> as an overlap. Invisible in smoke, where the exam block sits at 12,424,026–037. The predicate
> is corrected below (identity ⇒ unified, **partial overlap still fails**) and re-smoked. **No
> measured number moved**: the smoke re-run's ONLY artifact motion is the two new
> `seedDisjoint` fields, `resultSha256`, and the two CONTEXT-ONLY envelope fields.

**12 seeds × 8 arms** (12,424,026–037), paired on one shared seed list, **plus** the four
receipt walks (O2-T1 12 · #173 40 · GGC 12 · ⭐ CTB-T1 8) and the 8 delivered-dose matches —
and the whole core runs **twice** (X-DET). Verdict: **ALL 15 GATES PASS**, probe exit 0.

* **resultSha256** `33ea85f01428053b0faa126016e633aaa3e77b98019c1b01ea8c2eb264c1c9c0`
  (supersedes `8d850857…3639`, which superseded `4a3bc707…ec71` pre-battery)
* **X-DET digest** `b1aa0a721ed6616ca919edd1e9b9b94e6f968b48ee8513aa5a8b6181da146f50` (both passes)
* Wall ≈ **330 s** — CONTEXT ONLY (#128), used in no rate. Per #197-M1 the hashed body is
  commit-free, timing-free and path-free.

### Gate table

| gate | verdict | evidence (recomputed in-probe) |
| --- | --- | --- |
| **X-DET** | ✅ PASS | two passes, identical digests |
| **X-FP-PROD** | ✅ PASS | `57b0bdab…c673` re-derived unchanged |
| **X-SRC-UNTOUCHED** | ✅ PASS | `git diff --stat -- src` empty |
| ⭐ **G-REPRO-CTBT1** | ✅ PASS | 8 rows × **20 fields**, **0 mismatches**, against CTB-T1's committed battery artifact (`ded1967a…9aab`) — **signature included**. The inheritance is a receipt, not a claim |
| **G-REPRO-O2T1** | ✅ PASS | 12 rows, 0 mismatches |
| **G-REPRO-173** | ✅ PASS | pressed/unpressed/all/share identical to the committed census |
| **G-REPRO-GGC** | ✅ PASS | 63 fields, 0 mismatches |
| **G-TRACE-RADIUS** | ✅ PASS | `radius = 10 + g.supportDistance · 8` parsed from source |
| ⭐ **G-BLIND-WORLD** | ✅ PASS | every arm percept-armed; **99.94 %** of samples have a snapshot, **98.96–99.40 %** have **at least one non-zero feature** (`someFeatureNonZeroShare` — renamed this round from `sawPerceivedOpponentShare`, which claimed more than it measures), all four feature means > 0 in every arm. ⭐ **`allFeaturesZeroShare` = 0.60–1.04 %** is an **UPPER BOUND on genuine silence, not a measurement of it**: four zero features also occur with opponents PRESENT beyond the feature radii |
| **G-ARM** | ✅ PASS | matrix on 6/6 genome views on 12/12 seeds; **120 policy-cache writes per armed arm, 12/12 seeds**; the four classes partition exactly in every arm; ARMED-ZERO shift **exactly 0** with 157,914 planes PRESENT |
| **FLAG-HYGIENE** | ✅ PASS | ARMED-ZERO ≡ ABSENT on **12/12** seeds, signature **and** every row field; two-doors row: `ctbSupportPlane` FALSE and `edsPerceivedChoice` TRUE in 8/8 arms |
| ⭐ **G-FORK-TOKENS** | ✅ PASS | **37 src occurrences, ZERO unclassified**; 1 `FLAG_FORK_SCORE` + 1 `FLAG_FORK_PLANE` + 1 `PLANE_APPLY` + 2 `SCORE_APPLY` + 2/2 `SCORE_MUL_*` + 1 `POLICY_WRITE`, and the **new** classes **`SEAT_CALL` 3** and **`CADENCE_CAP` 3** — the #228.5(b) debt paid |
| **SEED-DISJOINT** | ✅ PASS | ⭐ **all EIGHT blocks this stage touches, machine-checked** (was four): FRESH — smoke 12,424,026–037 · **dose read 12,424,040**; RESERVED — guard 12,424,050–099 · battery 12,424,100–727; RE-WALKS — O2-T1 12,422,100–111 · #173 12,293,000–039 · GGC 12,421,000–011 · ⭐ **CTB-T1 12,423,100–107**. Zero ledger collisions on the four own blocks, zero overlaps among them, and each of the four re-walks lands **inside** its source's consumed interval (the inverted predicate). ⭐ **Stage-own pairwise predicate CORRECTED this round** (Deviation 9): intersecting rows fail **unless the two intervals are EXACTLY equal**, in which case they are one block under two names (`stageOwnUnified`) — the FULL-mode reality that the exam walk **redeems** the reserved battery block. **PARTIAL overlap still fails.** In smoke both lists are empty |
| **STATS-DISJOINT** | ✅ PASS | base 105,000, min gap **200** |
| **G-CLEAN-INVOCATION** | ✅ PASS | no override in force |

### ⭐ THE DELIVERED DOSE — dose ≠ delivered, made visible

Read where the executor consumes it (support ticks, all 12 seeds), beside the observational
feature/score read:

| arm | mean shift | max | moved | ≥1 m | mean plane depth/width | supportMul (mean, range) | runMul (mean, range) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 0 m | 0 | 0 % | 0 % | — | 1 (1, 1) | 1 (1, 1) |
| ARMED-ZERO | **0 m** | **0** | **0 %** | 0 % | 0 / 0 | **1 (1, 1)** | **1 (1, 1)** |
| CHECK-WHEN-PRESSED | **0.507 m** | 3.4491 | 28.2 % | 22.8 % | −0.041 / 0 | 1 (1, 1) | 1 (1, 1) |
| CHECK-AND-SHOW | 0.633 m | 3.4873 | 34.7 % | 28.6 % | −0.051 / 0 | 1.022 (1, **1.100**) | 1 (1, 1) |
| MARKER-ESCAPE | 1.818 m | 4.3857 | 87.1 % | 78.7 % | +0.132 / +0.132 | 1 (1, 1) | 1 (1, 1) |
| SPACE-SEEK | 1.3635 m | 4.8318 | 67.1 % | 54.4 % | −0.100 / +0.100 | 1 (1, 1) | 1 (1, 1) |
| STALE-CAUTION | **0 m** (by construction — a SCORE-only corner) | 0 | 0 % | 0 % | 0 / 0 | 0.984 (**0.904**, 1) | 0.984 (**0.904**, 1) |
| KITCHEN-SINK | **4.331 m** | 10.7537 | **97.4 %** | 94.9 % | −0.308 / +0.308 | 1.109 (1, **1.315**) | 0.891 (**0.685**, 1) |

⭐ **The MAX column is `arms.*.seam.maxShiftMetres`, quoted at the artifact's own 4 dp** — the
column the first cut got wrong, so it is now published at full stored precision and swept
programmatically together with every other cell of this table. Read it against the ceiling the
geometry itself imposes: a plane-only corner can move a body at most
`radius · |depth| · CTB_DEPTH_BIAS_SPAN` ≤ `18 · 0.25 · 0.9` = **4.05 m**, which is why
CHECK-WHEN-PRESSED's largest single shift is 3.4491 m and cannot be more.

**Read exactly.** (i) The **ceiling probe delivers ~0.31 of an axis on the exam walk and 4.331 m
of mean shift**, and the mechanism is visible in ONE population rather than two: in the
KITCHEN-SINK **dose read** the four feature means are `[0.19924, 0.47417, 0.26189, 0.15533]`,
whose mean is **0.27266** — and that arm's **`planeWidth` mean is 0.27266**, the same number,
because a full ±1 row IS the mean of its four features. (The exam walk's own
`meanPlaneWidthOnPresent` is 0.308 rather than 0.273; it is a **different population** — support
ticks with a plane present, not every-15-tick outfielder samples — and the two must not be
divided into each other.) That is the ceiling, and it is what makes every other row legible. (ii) **CHECK-WHEN-PRESSED delivers 0.5 m on average and moves
28 % of support ticks** — small on average and **concentrated**, exactly as pre-registered:
f1 is the scarce feature and the plane is zero precisely when the carrier is not
perceived-pressed. (iii) **STALE-CAUTION moves no geometry at all and is not supposed to** —
it doses the two SCORE rows, and its multipliers reach 0.904. (iv) The observed feature means
in this world are **[0.20–0.28, 0.47–0.54, 0.23–0.26, 0.15–0.16]** — close to OBM-T0's
[0.184, 0.456, 0.216, 0.171], which the corners were designed against.

### THE RULER — per-arm rows and paired deltas (Δ = ARM − ABSENT). NOTHING IS ADJUDICATED

**Ruler 1 — TRUE-holdable supply** (ABSENT **0.2721 %**, 735 eligible moments):

| arm | point | Δ | 95 % CI | resolved |
| --- | --- | --- | --- | --- |
| ARMED-ZERO | 0.2721 % | +0.000000 | [0, 0] | false |
| CHECK-WHEN-PRESSED | 0.2653 % | −0.000069 | [−0.004333, +0.003841] | false |
| CHECK-AND-SHOW | 0.4082 % | +0.001361 | [−0.004178, +0.007941] | false |
| MARKER-ESCAPE | 0.1321 % | −0.001400 | [−0.004442, +0.000007] | false |
| SPACE-SEEK | 1.2195 % | +0.009474 | [−0.002838, +0.024393] | false |
| STALE-CAUTION | 0.4065 % | +0.001344 | [−0.000090, +0.004071] | false |
| **KITCHEN-SINK** | 0.6840 % | **+0.004119** | **[+0.000046, +0.008212]** | **true** |

**Ruler 2 — pressed first reception** (ABSENT **81.52 %**, 433 first receptions):

| arm | point | Δ (pp) | 95 % CI (pp) | resolved |
| --- | --- | --- | --- | --- |
| ARMED-ZERO | 81.52 % | 0.00 | [0, 0] | false |
| CHECK-WHEN-PRESSED | 77.99 % | **−3.53** | [−7.28, +0.77] | false |
| CHECK-AND-SHOW | 83.44 % | +1.91 | [−1.39, +6.27] | false |
| MARKER-ESCAPE | 82.79 % | +1.27 | [−3.11, +6.67] | false |
| SPACE-SEEK | 77.97 % | **−3.55** | [−7.46, +0.64] | false |
| STALE-CAUTION | 79.90 % | −1.62 | [−5.16, +1.92] | false |
| KITCHEN-SINK | 81.94 % | +0.41 | [−4.08, +6.14] | false |

⚠ **At 12 seeds NOTHING here is evidence.** Both the one `resolved=true` cell and the two
~3.5 pp point moves in the helpful direction on ruler 2 are **smoke-grain readings** — CTB-T1's
own smoke produced helpful-looking rows that the 628-seed battery erased. They are recorded
as **observations of record**, not findings.

### REPORTED — rulers 3/4 with their ceilings, and ruler 5

Rulers 3b/4b remain **near-saturated**: ABSENT sits at **96.305 %** (3b) and **96.317 %** (4b),
leaving **3.695 pp** of helpful headroom on 3b and **3.683 pp** on 4b — **per ruler, not a
total**: these are two different columns and their headrooms do not add. Either way each is
under four points, which is exactly why the exam is carried by rulers 1 + 2. Ruler 5 (the #218 shares) rides the same paired bootstrap: ABSENT constructed≥3
**8.33 %**, scramble share **52.6 %**; no arm resolves on any of the five shares at smoke
grain, and **no gate reads a cell of that table**.

### THE GUARDS

| limb | control | tolerance | resolved arms | **breaches** |
| --- | --- | --- | --- | --- |
| interceptions/match | 26.25 | ±7.253 | — | **none** |
| spreadYOut | 5.368 | ±1.483 | SPACE-SEEK, KITCHEN-SINK (**wider** — the helpful direction) | **none** |
| spacingMedian | 12.996 | ±3.591 | KITCHEN-SINK (wider) | **none** |
| spacingUnder4 | 0.1005 | ±0.0278 | SPACE-SEEK −0.0115, KITCHEN-SINK −0.0118 (**less** clumping) | **none** |

Offsides (the #157 FLAG form): no arm resolves; the largest point move is MARKER-ESCAPE
**+0.75/match** [−0.08, +1.75] — a direction to watch at battery N, not a flag at smoke grain.
Equilibrium band: **`goals` is EXCLUDED** because the ABSENT arm itself fails it at 12 seeds
(the #198-form exclusion, disclosed); of the four gated dimensions, ABSENT · ARMED-ZERO ·
SPACE-SEEK · KITCHEN-SINK hold all four and the other four arms do not — **the band gates at
battery N only**, so this row is context.

⚠ Of record: **interceptions do not rise** at any dose here — ABSENT **26.25/match**, and **no
arm resolves**: the seven paired point deltas run **−2.00** (CHECK-WHEN-PRESSED, the largest in
magnitude and **exactly −2.0**, CI [−6.50, +1.92]) · −1.00 · −0.58 · −0.25 · 0.00 · +0.83 ·
**+1.67** (CHECK-AND-SHOW, the largest rise, CI [−2.83, +5.42]). Stated as the artifact has it
rather than as a "±2 band", because the extreme sits **on** 2.0, not inside it. That is the
opposite of the CTB-T1 static plane's signature (+1.8…+3.2/match resolved at
every depth dose). It is a 12-seed reading and it adjudicates nothing — but it is the first
number in this arc that is *consistent with* H-CTB-T1a's "the missing dimension is WHEN".

### THE N RULE (in-probe, from the committed artifacts)

DEFF **0.8302** (inherited — no same-world committed source existed when the smoke ran, and
the probe refuses to size a smoke off a previous smoke). q1 ⇒ **N 628**, q2 ⇒ N 66, binding
**q1**, **N\* = 628**; ledger room 800 (binds=false), cap 628 (**binds=false**). Battery block
**12,424,100 – 12,424,727**. At 8 arms × 628 with the ≈1.4× armed-world cost, budget **≈50–60
min** of wall.

⭐ When the battery runs, the rule **re-reads p0 and moments-per-seed from this committed
smoke's ABSENT arm** (this world) and takes `MAX(inherited DEFF, same-world smoke DEFF)`. The
substitution is published in the artifact as `sourceOfP0` / `deffProvenance` on that run.

### §CHECKS

```text
$ npx tsc --noEmit
(clean)

$ OBMT1_MODE=smoke npx tsx scripts/probes/obm-t1-policy-exam.ts     (the CORRECTION re-run)
  ALL                PASS      (15 gates)
  exit 0 · resultSha256 8d85085761381d7c6aafced6ed21c911ec22f4aec8930369af00c8f2c46d3639
  wall 332 s (CONTEXT ONLY) · artifact docs/world-model/data/obm-t1-policy-exam-smoke.json
  (supersedes 4a3bc707…ec71. Artifact diff vs the superseded run, EXHAUSTIVE: the
   seedDisjoint block · sawPerceivedOpponentShare → someFeatureNonZeroShare in its three
   homes · the new gBlindWorld.predicate · four corrected note/semantics strings ·
   xDet digests + resultSha256 · the two CONTEXT-ONLY envelope fields (head, wall).
   EVERY measured rate, CI, guard level and gate verdict is byte-identical.)

$ OBMT1_MODE=smoke npx tsx scripts/probes/obm-t1-policy-exam.ts   (the GATE-PREDICATE correction)
  ALL                PASS      (15 gates)
  exit 0 · resultSha256 33ea85f01428053b0faa126016e633aaa3e77b98019c1b01ea8c2eb264c1c9c0
  wall 330 s (CONTEXT ONLY) · artifact docs/world-model/data/obm-t1-policy-exam-smoke.json
  (supersedes 8d850857…3639. Artifact diff vs the superseded run, EXHAUSTIVE — a
   whole-JSON recursive field walk returns FIVE paths and no more:
     ADDED   gates.seedDisjoint.stageOwnUnified              (empty in smoke)
     ADDED   gates.seedDisjoint.stageOwnOverlapSemantics     (the corrected predicate, stated)
     CHANGED resultSha256
     CHANGED envelopeContextOnly.headContextOnly             (CONTEXT ONLY)
     CHANGED envelopeContextOnly.wallMsContextOnly           (CONTEXT ONLY)
   No measured rate, CI, guard level, digest-of-body or gate verdict moved — the xDet
   digest is unchanged, which is the strongest available statement that the WORLD did not.)

$ OBMT1_N=1 OBMT1_SKIP_FP=1 npx tsx scripts/probes/obm-t1-policy-exam.ts   (the OVERRIDE route)
  ⚠ OVERRIDE IN FORCE — routed onto the EXIT-SEMANTICS GUARD BLOCK 12,424,050..12,424,099
  gCleanInvocation *** FAIL ***   xFpProd *** FAIL ***   ALL *** FAIL ***   exit 1
  artifact written to /tmp/obm-t1-guard-run.json — NEVER to docs/

$ npm test
  Test Files  1 failed | 129 passed (130)
       Tests  1 failed | 1245 passed (1246)
  × tests/formationEvolution.test.ts > league-level style ecology — "Test timed out in 180000ms"

$ npx vitest run tests/formationEvolution.test.ts                (re-run in isolation)
  Test Files  1 passed (1)   Tests  3 passed (3)   —  152,974 ms for that one test
```

⚠ **The single red is the known wall-clock flake family (#196.2), disclosed not excused**: the
test needs ~153 s and the limit is 180 s, so under a loaded parallel suite it times out and in
isolation it is green. It cannot be this stage's: `src/**` is **byte-untouched**
(X-SRC-UNTOUCHED PASS, `git diff --stat -- src` empty) and **no test file was edited or added**
— this round's only changes are one probe, one doc and one artifact.

### Deviations recorded

1. ⭐ **G-ARM was sharpened after the FIRST smoke run — recorded, not rewritten** (the CTB-T0
   §DEV / CTB-T1 G-ARM precedent). The frozen predicate said *"a dosed arm must shift
   something"*, which is **false for a SCORE-only corner**: STALE-CAUTION doses only the two
   score rows, so its plane is exactly (0,0) at every tick **by construction** and it reds a
   geometry-only gate. The first run reported exactly that (`gArm` FAIL, everything else
   PASS). The predicate was made **stronger and output-aware** rather than looser: an arm that
   doses a PLANE row must shift geometry, an arm that does **not** must shift **exactly
   nothing**; an arm that doses a SCORE row must produce a non-neutral multiplier, an arm that
   does not must leave **both multipliers at exactly 1**. No arm, dose, ruler, guard or
   estimator changed, and the failing run's cause is published here rather than smoothed away.
2. **The PLANE-ZERO class needed three causes, not one.** The first cut labelled it "ZERO IS
   SILENCE — he perceived nobody". That is only the third cause: a plane of (0,0) also arises
   when the arm doses no plane row, and — far more often — when **this arm's own driving
   feature reads zero at that moment** (for an f1 corner: the carrier is not perceived-pressed,
   i.e. the CONCENTRATION the hypothesis is about). Genuine blindness is **bounded above**
   separately at **0.60–1.04 %** of samples (`allFeaturesZeroShare` — a ceiling, not a
   measurement; see Deviation 7). The label was corrected in the probe's own published semantics.
3. **A fourth seed block was declared** (the delivered-dose read, 12,424,040) rather than
   re-using an exam seed, because that read pulls percepts out-of-band. Declared in §SEEDS.
4. **The world is not CTB-T1's**, by necessity (§FORM). Absolute levels across the two exams
   are not comparable; every contrast here is within-world and paired.

**⭐ The PRE-BATTERY correction round (5–8) — all four are EVIDENCE-LAYER; no mechanism moved.**
Independent verify reproduced the `resultSha256` identically and diffed the inherited sampling
body to **zero changed lines** against `ctb-t1-supply-exam.ts`. What it caught was the layer
between the artifact and the reader.

5. ⛔⛔ **THE DELIVERED-DOSE MAX COLUMN WAS NOT IN THE ARTIFACT — and its provenance could not
   be established.** The first cut published 6.30 / 6.36 / 8.90 / 8.05 / 13.55 m; the committed
   artifact's `arms.*.seam.maxShiftMetres` are **3.4491 / 3.4873 / 4.3857 / 4.8318 / 10.7537**.
   The column is rebuilt above. **The investigation, reported as it came out:**
   * The five numbers appear **nowhere in the artifact** — a full numeric sweep of every scalar
     in the committed JSON at ±0.006 tolerance returns **one** hit, and it is
     `perMatch.spaceSeek[7].spacingMedian = 13.5468`, a coincidence in an unrelated column.
   * They are **not a unit slip and not a stale-run artifact**: the ratios doc÷artifact are
     1.83 / 1.82 / 2.03 / 1.67 / 1.26 — no constant, no power of ten. Swapping the
     MARKER-ESCAPE and SPACE-SEEK rows makes four of the five ratios ≈1.83 but leaves
     KITCHEN-SINK at 1.26, so even the tidiest transposition story does not close.
   * They are **not the pre-clamp shift** either, and this is the decisive one: for a
     plane-only corner the shift is bounded by `radius · |depth| · CTB_DEPTH_BIAS_SPAN`, with
     `radius = 10 + supportDistance·8 ≤ 18` (the gene is `clamp01`), `|depth| ≤ 0.25` (a single
     ±1 slot is the mean of four features) and `CTB_DEPTH_BIAS_SPAN = SUPPORT_LAT_CAP_FRAC =
     0.9` ⇒ **≤ 4.05 m**. CHECK-WHEN-PRESSED's published 6.30 m is **above the ceiling the
     geometry allows**, clamped or unclamped, so no reading of this world produces it.
   * They are **not lifted from a sibling exam**: no `maxShiftMetres` in the OBM-T0, CTB-T0,
     CTB-T1 smoke or CTB-T1 battery artifacts matches any of the five.
   * The probe's stdout prints `maxShiftMetres` verbatim, and no earlier version of either
     artifact or probe exists in git history to have printed anything else.
   **Finding, stated honestly: the column has no traceable source. On the evidence it was
   composed at drafting time rather than read off the run** — the exact failure the §RESULT
   header rule exists to prevent. Recorded, not smoothed: the rule is re-asserted at the head of
   §RESULT and the whole table is now swept **programmatically** against the artifact.
6. **SEED-DISJOINT machine-checked four blocks and declared eight.** The gate computed
   `walkedBlocks` for the exam walk and three re-walks only — the **declared** delivered-dose
   block (12,424,040, fresh observational data), the reserved guard and battery blocks and the
   **new CTB-T1 re-walk** were named in prose and checked by nobody, and `reproBlocksNote` still
   said "the two repro blocks" when four run. The computation now covers all eight under three
   predicates (fresh/reserved ⇒ clash-free and pairwise disjoint; re-walk ⇒ must land inside its
   source's interval), and the ordering check now includes the dose-read seed. **The gate still
   passes**, which is the point: the claim was true and was simply not being checked.
7. **`sawPerceivedOpponentShare` was renamed `someFeatureNonZeroShare`.** It counts samples with
   at least one non-zero feature — which is **weaker than its old name**: all four features read
   zero with opponents *present* whenever every one of them is beyond that feature's radius (and
   f4 is 0 on fresh readings). The G-BLIND-WORLD row is re-predicated to the non-degeneracy it
   actually tests, and `allFeaturesZeroShare` is published as an **UPPER BOUND on genuine
   blindness, not a measurement of it**. No level moved — only the name and the claim.
8. **Three doc statements were restated to their own populations.** (a) rulers 3b/4b headroom is
   **3.695 pp** and **3.683 pp** *per ruler*, never "3.68 pp in total" (the old figure was 4b's
   alone, presented as both). (b) The ceiling-probe sentence mixed the exam walk's
   on-present plane mean with an out-of-world T0 feature mean; it now reads the dose-read's own
   featureMeans mean **0.27266** against that same read's `planeWidth` mean **0.27266**.
   (c) "every Δ inside ±2" on interceptions was false at the boundary — CHECK-WHEN-PRESSED's
   delta is **exactly −2.0** — so the sentence now lists the seven deltas.

**⭐ The BATTERY-EXPOSED gate-predicate correction (9) — the check was wrong, not the ledger.**

9. ⭐⭐ **THE FIRST BATTERY RUN WENT 14/15 WITH SEED-DISJOINT RED, AND THE RED WAS THE CHECK'S
   OWN, NOT THE WORLD'S — RECORDED OF RECORD.** That run: `resultSha256`
   **`b1cdef8d…8eef`**, **14/15 gates green, X-DET PASS**, its artifact **deliberately left
   UNCOMMITTED and deleted** — it was produced by a probe whose SEED-DISJOINT predicate is now
   known to be defective in FULL mode, so it is not evidence and is not banked. **No exam rate
   from it has been read by anybody**, and none is quoted here.
   **The defect**: the pre-battery correction (Deviation 6) added a stage-own **pairwise
   disjointness** test over the fresh + reserved blocks. In SMOKE the exam block is
   12,424,026–037 and the reserved battery block is 12,424,100–727 — different intervals, test
   silent. In FULL, `RUN_BASE === BATTERY_BASE` and the run length **is** the N-derived
   reservation length **by design** (full mode is the reservation being consumed), so the rows
   `exam` and `battery (reserved, N-derived)` are the **same interval under two names** and the
   test compared the block against itself. A **full-mode-only predicate bug**, and the exact
   class of thing only a real battery could surface.
   **Every other statement in that gate was correct on that run**: `ledgerCollisions` empty on
   every fresh and reserved block, all four re-walk **inverted** predicates satisfied,
   `examCollisions` empty, `batteryCollisions` empty, sub-block ordering true.
   **The correction, stated as a predicate** (and published in the artifact as
   `stageOwnOverlapSemantics`): a stage-own pair **fails when its intervals intersect UNLESS
   they are EXACTLY equal** — equal ⇒ one block under two names, recorded in `stageOwnUnified`
   rather than ignored. **A PARTIAL overlap still FAILS**: an exam block that half-covers the
   reservation, or a walk that outgrew it, is a genuine ledger defect and is precisely what this
   check exists to catch. Nothing was loosened to green — the identity case was never an overlap
   in the first place, and the failure mode the check guards is strictly preserved.

### Disposition

The instrument is built, twice-deterministic, gate-green, and **proved to be CTB-T1's own**.
Nothing is adjudicated: **F-OBM-a/b/c are the commander's**, and at 12 seeds the honest
summary is *the seat is reached, the doses arrive at measurable and published sizes, the
identity arm is exact, and no guard breaches*. The battery (N = 628, block
12,424,100–12,424,727, ≈50–60 min) is the commander's to dispatch.

---

## §RESULT — FULL BATTERY

*(Every number in this section is quoted FROM the committed artifact
[`data/obm-t1-policy-exam.json`](data/obm-t1-policy-exam.json), recomputed by
`OBMT1_MODE=full OBMT1_RESUME=1 npx tsx scripts/probes/obm-t1-policy-exam.ts`, and every table
below was swept **programmatically** against that artifact before this section was written —
the #229.2 lesson from the smoke's fabricated MAX column, applied. The doc carries no evidence
the artifact does not — #181.2.)*

**`resultSha256`
`9f42b0b6143f8857149db81cedca8b123c1b841afe7f7230295d284e101d2091` · X-DET core digest
`85f55c55e7a2e614b20748bdb553a231852cf493e86df21260007917e1f55176` (both passes) ·
**356 shared seeds 12,424,100 – 12,424,455** (N\* = 356, the N rule's own binding limb
`q1TrueHoldable`) × **8 arms** = 2,848 full matches per core pass, the core run **TWICE**,
plus the FOUR G-REPRO re-walks each pass (O2-T1 12 · #173 40 · GGC 12 · ⭐ CTB-T1 8), the 8
delivered-dose reads and the 2-season fingerprint league · **ALL 15 GATES PASS**
(`allGatesPass: true`), probe exit 0 · wall **7,563 s** (CONTEXT ONLY, #128 — in no rate,
in no gate, riding the UNHASHED `envelopeContextOnly`).**

⚠ **THIS SECTION ADJUDICATES NOTHING.** Per #203 the probe emits per-arm rows, paired deltas
and mechanical `resolved` CI flags only. The pre-registered success condition and the
F-OBM-a/b/c STOP set are restated VERBATIM below and checked off **mechanically** — which
predicate is or is not satisfied by which row. **No F-branch is fired in this doc's voice.**
The adjudication is ruling **#230** in [`PROGRAMME-RULINGS.md`](PROGRAMME-RULINGS.md).

### The frozen text, restated VERBATIM (from §SUCCESS above — not re-cut, not paraphrased)

> success = a policy dose moves ruler 1 or 2 **resolvedly helpful** with **that dose's guards
> held** (the #225.3(c) per-dose granularity verbatim)

> * **F-OBM-a** — *no policy dose moves the supply* (the receiver-side program itself is
>   re-examined — the arc's honest death branch). **Reported as-is if it fires.**
> * **F-OBM-b / F-OBM-c** — **F-CTB-b/c verbatim**: clump/interception · offside/health.

And the STOP granularity frozen ex ante with it (§SUCCESS, echoed into the artifact as
`preRegisteredStopGranularity`, so the freeze is dated by the receipt): **F-OBM-b/c fire PER
DOSE**, a breaching dose is **DISQUALIFIED as a candidate** rather than an arc-level STOP, and
**the ARC-level STOP fires only if EVERY dose that moves the primary ruler helpfully is
disqualified**; every row is read **beside its delivered dose**; the band **GATES at battery N
only**, with the #198-form control-fails exclusion.

Helpful, per §SUCCESS: **ruler 1 UP**, **ruler 2 DOWN**.

**Mechanically, against those words and nothing else:**

| pre-registered predicate | mechanically satisfied at N = 356? | the rows it is read off |
| --- | --- | --- |
| **TRUE-holdable supply UP, resolved** (ruler 1) | **NO** — `resolved=false` on all 7 contrast arms; no paired-delta CI on `trueHoldableShare` excludes zero, in either direction | PRIMARY RULER table |
| **pressed-first-reception DOWN, resolved** (ruler 2) | **NO** — `resolved=false` on all 7 contrast arms; no paired-delta CI on `pressedFirstReceptionShare` excludes zero, in either direction | PRIMARY RULER table |
| **interception beyond the frozen tolerance, resolved** (F-OBM-b) | **NO breach** — 1 arm resolved UP (SPACE-SEEK +1.148876/match), `beyondTolerance=false` | GUARD table |
| **clump beyond the frozen tolerance, resolved** (F-OBM-b) | **NO breach** — every resolved clump cell is `beyondTolerance=false`; on the `spacingUnder4` CEILING limb the two resolved cells are **DECREASES** | GUARD tables |
| **offside spike, resolved** (F-OBM-c) | **NO FLAG** — one resolved offside cell, KITCHEN-SINK Δ −0.252809/match, `resolvedIncrease=false` (a decrease) | GUARD table |
| **world-health collapse, resolved** (F-OBM-c) | band rows published and GATING at this N; `excludedBecauseControlFails` is **EMPTY** (the ABSENT arm holds all five) | BAND table |

⭐ **Note mechanically, without reading it:** across the **12 primary cells** (6 dosed arms ×
2 primary rulers) the number of `resolved=true` contrasts is **ZERO** — in either direction —
and the identity arm's delta is exactly 0 with CI [0, 0] on both. That sentence is a statement
about `resolved` flags and signs. It is not F-OBM-a. And **no dose is disqualified**: the count
of `breach=true` cells in the entire guard block is **ZERO**, at every dose, on every limb.

### Gate table — every value recomputed in-probe on the run that wrote the artifact

| gate | verdict | evidence (all recomputed in-probe) |
| --- | --- | --- |
| **X-DET** | ✅ PASS | the whole core (8 arms + 4 receipt walks + 8 dose reads + summaries + bootstrap) run **twice**; the two hashed bodies byte-identical: `digestA === digestB === 85f55c55…5176` |
| **#197-M1 envelope** | ✅ PASS (structural) | `head` (`83f7aa0`), wall (7,563,305 ms), every path and the checkpoint block ride `envelopeContextOnly`, OUTSIDE the hashed body ⇒ `resultSha256` re-derives at any commit, from any cwd |
| **X-FP-PROD** | ✅ PASS | observed `57b0bdab…c673` == the shipped baseline (seed 1337, 2 seasons) |
| **X-SRC-UNTOUCHED** | ✅ PASS | `git diff --stat -- src` **EMPTY** on the run that wrote the artifact — INSTRUMENT-ONLY round, no engine byte moved; the seat stays banked at `600ff04` |
| ⭐ **G-REPRO-CTBT1** | ✅ PASS | **8 rows × 20 fields, 0 mismatches** against the committed CTB-T1 battery block 12423100–12423107 in CTB-T1's OWN world — **signature included**; source `ctb-t1-supply-exam.json` resultSha `ded1967a…9aab`. The inheritance is a receipt, not a claim |
| **G-REPRO-O2T1** | ✅ PASS | **12/12** rows of the O2-T1 battery block re-walked, **0 mismatches** |
| **G-REPRO-173** | ✅ PASS | pressedShare **0.7959** · pressed **1,049** · unpressed **269** · all **1,318** — field for field identical to the committed census target |
| **G-REPRO-GGC** | ✅ PASS | **63/63 committed fields reproduced, 0 mismatches** on block 12421000–12421011; source `goal-genealogy-census-smoke.json` sha `1d7396c6…8317` |
| **G-TRACE-RADIUS** | ✅ PASS | `const radius = 10 + g.supportDistance * 8;` matched VERBATIM in `src/ai/formations.ts`; base **10** / slope **8** PARSED, never typed |
| ⭐ **G-BLIND-WORLD** | ✅ PASS | every arm percept-armed in its CONSTRUCTED world; `sawSnapshotShare` **99.938–99.941 %**, `someFeatureNonZeroShare` **98.962–99.403 %**, all four feature means > 0 in every arm. ⭐ `allFeaturesZeroShare` **0.597–1.038 %** is an **UPPER BOUND on genuine silence, not a measurement of it** |
| **G-ARM** | ✅ PASS | every armed arm: matrix on **6/6** genome views on **356/356** seeds, **3,560 policy-cache writes** with `seedsWithPolicyWrites` **356/356**; the four support-tick classes `partitionExact` in **8/8** arms; delivery on the axes each arm doses and **silence on the ones it does not**; ARMED-ZERO `zeroShift=true` with **4,211,847** planes PRESENT and both multipliers exactly 1 |
| **FLAG-HYGIENE** | ✅ PASS | **356/356** seeds ARMED-ZERO ≡ ABSENT — whole-match signature (rng stream state included) **and** every row field, **0** differing fields across all 356 rows; `doseWellFormed=true` (every matrix at domain corners); two-doors row: `ctbSupportPlane` **FALSE** and `edsPerceivedChoice` **TRUE** in 8/8 arms |
| ⭐ **G-FORK-TOKENS** | ✅ PASS | **37 src occurrences, 0 unclassified**; the #228.5(b) debt PAID — `obmOffballPolicy` + `OBM_POLICY_TTL_TICKS` added, and the two new classes **`SEAT_CALL` 3** and **`CADENCE_CAP` 3** counted exactly, beside `FLAG_FORK_SCORE` 1 · `FLAG_FORK_PLANE` 1 · `PLANE_APPLY` 1 · `SCORE_APPLY` 2 · `POLICY_WRITE` 1 |
| **SEED-DISJOINT** | ✅ PASS | ⭐ **all EIGHT blocks machine-checked** against the complete **30-entry** consumed ledger. FRESH — exam 12,424,100–455 · dose read 12,424,040; RESERVED — guard 12,424,050–099 · battery 12,424,100–455; RE-WALKS — O2-T1 12,422,100–111 · #173 12,293,000–039 · GGC 12,421,000–011 · ⭐ CTB-T1 12,423,100–107. `blockFailures` **empty**, `ledgerCollisions` empty on all four own blocks, each of the four re-walks lands **inside** its source's consumed interval (the inverted predicate), sub-blocks ordered, ledger room 800, next consumed 12,424,900. ⭐ **`stageOwnOverlaps` is EMPTY and `stageOwnUnified` carries exactly ONE row** — see below |
| **STATS-DISJOINT** | ✅ PASS | stats base **105,000**, min gap **200** against the complete published namespace (47 bases) |
| **G-CLEAN-INVOCATION** | ✅ PASS | no override in force (`OBMT1_N` null, `OBMT1_SKIP_FP` false), not routed to the guard block |

⭐ **THE `stageOwnUnified` ROW — the FULL-mode reality the corrected predicate was cut for.**
The one row the artifact records is:

| pair | intervals | `identical` |
| --- | --- | --- |
| `exam × battery (reserved, N-derived)` | `12424100..12424455` × `12424100..12424455` | **true** |

In FULL mode the exam walk **IS** the reserved battery block — `RUN_BASE === BATTERY_BASE` and
the walk length is the N-derived reservation length — so the reservation and the walk that
**redeems** it are one block under two names, recorded here rather than ignored, and
`stageOwnOverlaps` is empty. The equality is **exact** on both ends (12,424,100 and
12,424,455). Per the corrected semantics carried in the artifact
(`stageOwnOverlapSemantics`), a **PARTIAL** overlap would still FAIL. This is the gate whose
red on the first battery of record was the check's own defect (Deviation 9), and this row is
that correction's receipt at battery N.

Checkpoint/resume (RESILIENCE ONLY, read by no gate): armed at `/tmp/obm-t1-checkpoint.jsonl`,
resume requested but no checkpoint present ⇒ **356 computed / 0 restored on BOTH passes** — a clean full
computation, not a resumed one.

### ⭐ THE PRIMARY RULER — rulers 1 + 2, the columns the exam was RULED to be read on

Δ = ARM − ABSENT, paired per-seed cluster bootstrap (2,000 resamples, ratio-of-totals,
2.5/97.5, ONE resampled seed-index set feeding every arm, stats base 105,000, **356
clusters**). `resolved` = the paired-delta CI excludes zero — a **mechanical CI flag, never a
verdict** (#203).

**Ruler 1 — TRUE-holdable supply** (share of #186-eligible moments whose TRUE cell is in the
certified holdable set `0|0|0`):

| arm | point | 95 % CI | paired Δ (pp) [2.5, 97.5] | `resolved` | n_true / eligible |
| --- | --- | --- | --- | --- | --- |
| ABSENT | **0.5435 %** | [0.4449, 0.6498] % | — (control) | — | 119 / 21,894 |
| ARMED-ZERO | 0.5435 % | [0.4449, 0.6498] % | **0** [0, 0] | no | 119 / 21,894 |
| CHECK-WHEN-PRESSED | 0.6188 % | [0.5015, 0.7359] % | +0.0753 [−0.0495, +0.1933] | no | 134 / 21,654 |
| CHECK-AND-SHOW | 0.5417 % | [0.4453, 0.6444] % | −0.0018 [−0.1153, +0.1148] | no | 118 / 21,784 |
| MARKER-ESCAPE | 0.4820 % | [0.3938, 0.5727] % | −0.0615 [−0.1825, +0.0481] | no | 106 / 21,990 |
| SPACE-SEEK | 0.5183 % | [0.4200, 0.6292] % | −0.0252 [−0.1462, +0.1025] | no | 113 / 21,802 |
| STALE-CAUTION | 0.5374 % | [0.4426, 0.6380] % | −0.0061 [−0.0668, +0.0543] | no | 118 / 21,956 |
| KITCHEN-SINK | 0.4430 % | [0.3574, 0.5288] % | −0.1006 [−0.2179, +0.0110] | no | 98 / 22,124 |

**No dose resolves on ruler 1 — in either direction.** Every contrast CI spans zero.

**Ruler 2 — pressed first reception** (of the FIRST reception of each openPlay-origin spell,
the share with an opponent within `TOUCH_CONTROL_DIST` = 4.2 m):

| arm | point | 95 % CI | paired Δ (pp) [2.5, 97.5] | `resolved` | pressed / first receptions |
| --- | --- | --- | --- | --- | --- |
| ABSENT | **82.0821 %** | [81.3717, 82.7819] % | — (control) | — | 11,535 / 14,053 |
| ARMED-ZERO | 82.0821 % | [81.3717, 82.7819] % | **0** [0, 0] | no | 11,535 / 14,053 |
| CHECK-WHEN-PRESSED | 82.2556 % | [81.5172, 82.9639] % | +0.1735 [−0.6827, +0.9921] | no | 11,779 / 14,320 |
| CHECK-AND-SHOW | 82.5357 % | [81.7559, 83.3310] % | +0.4536 [−0.4337, +1.3727] | no | 11,796 / 14,292 |
| MARKER-ESCAPE | 82.3071 % | [81.5974, 83.0484] % | +0.2249 [−0.6132, +1.0617] | no | 11,923 / 14,486 |
| SPACE-SEEK | 82.5669 % | [81.8806, 83.2481] % | +0.4848 [−0.4425, +1.3580] | no | 11,779 / 14,266 |
| STALE-CAUTION | 82.4669 % | [81.7450, 83.1538] % | +0.3848 [−0.3015, +1.0561] | no | 11,660 / 14,139 |
| KITCHEN-SINK | 82.0936 % | [81.3974, 82.8042] % | +0.0115 [−0.9005, +0.9049] | no | 11,434 / 13,928 |

**No dose resolves on ruler 2 either.** Every contrast CI spans zero, and the six dosed point
moves are all in the **UP** (unhelpful) direction — the largest is SPACE-SEEK +0.4848 pp with
CI [−0.4425, +1.3580] pp.

⚠ **The ABSENT arm's own levels are NOT the source baselines and must not be quoted as them.**
TRUE-holdable reads 0.5435 % here against O2-T1's 0.6391 %, and pressed-first-reception
82.0821 % against #173's 80.85 % — a different WORLD (this exam is **percept-armed**, §FORM's
declared cost) and a different N. The G-REPRO gates prove the INSTRUMENTS are identical; the
LEVELS are not claimed to be. The paired contrast is unaffected: all eight arms share this
world exactly.

### REPORTED — rulers 3 and 4, with their pre-disclosed CEILINGS

REPORTED with the ceilings disclosed **before** any battery number existed. **No gate reads
them and the pre-registered §SUCCESS text and the F-OBM-a/b/c STOP set are unchanged by them.**

| ruler | ABSENT | ARMED-ZERO | CHECK-WHEN-PRESSED | CHECK-AND-SHOW | MARKER-ESCAPE | SPACE-SEEK | STALE-CAUTION | KITCHEN-SINK |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **3a** short option / poss. tick | 93.8920 % | 93.8920 | 94.0507 | 94.0839 | 93.6059 | 93.7467 | 94.0532 | 93.6696 |
| **3b** short option / first rec. | 97.7300 % | 97.7300 | 97.4162 | 97.5231 | 97.4113 | 97.4905 | 97.7014 | **97.1137** ⟵ R −0.6163 |
| **4a** support @ pressed poss. tick | 96.4223 % | 96.4223 | 96.5056 | 96.5536 | 96.0953 | 96.2490 | 96.5738 | **95.8873** ⟵ R −0.5350 |
| **4b** support @ pressed first rec. | 97.7200 % | 97.7200 | 97.4022 | 97.6348 | 97.3916 | 97.6144 | 97.6844 | **97.1139** ⟵ R −0.6061 |

(All values %; Δ in pp; **R** = `resolved=true`. Full CIs on the resolved cells: 3b KITCHEN-SINK [−0.9784, −0.2433] · 4a KITCHEN-SINK [−1.0107, −0.0572] · 4b KITCHEN-SINK [−1.0009, −0.2130]. Every unmarked cell is unresolved.)

**The ceilings, computed in-probe** (`saturationCeilings`), never typed — the headroom is the
ENTIRE budget any helpful move on these two columns could spend:

| ruler | ABSENT level | helpful headroom | per-arm Δ (pp) — share of the headroom consumed |
| --- | --- | --- | --- |
| **4b support @ pressed first rec.** | **97.720 %** | **2.28 pp** | ARMED-ZERO +0.000 (+0.00 %) · CHECK-WHEN-PRESSED −0.318 (−13.94 %) · CHECK-AND-SHOW −0.085 (−3.74 %) · MARKER-ESCAPE −0.328 (−14.40 %) · SPACE-SEEK −0.106 (−4.63 %) · STALE-CAUTION −0.036 (−1.56 %) · KITCHEN-SINK −0.606 (−26.58 %, **R**) |
| **3b short option / first rec.** | **97.730 %** | **2.27 pp** | ARMED-ZERO +0.000 (+0.00 %) · CHECK-WHEN-PRESSED −0.314 (−13.82 %) · CHECK-AND-SHOW −0.207 (−9.11 %) · MARKER-ESCAPE −0.319 (−14.04 %) · SPACE-SEEK −0.239 (−10.55 %) · STALE-CAUTION −0.029 (−1.26 %) · KITCHEN-SINK −0.616 (−27.15 %, **R**) |

⚠ The **LABELLED DECODE NOTE** carried in the artifact (`saturationCeilings.decodeNote`) is
reproduced unchanged and remains **a hypothesis, not a finding**. It is exactly why rulers
1 + 2 carry the exam.

### REPORTED — ruler 5, the #218 LIFT (no gate reads a single cell of this table)

Counts at battery grain. Ladder shares are of the **non-set-piece** pool; the turnover triple
is own / middle / final third, in the WINNING team's attacking frame.

| arm | goals | constr. ≥3 | ≥4 | ≥5 | scramble | set-piece | turnover own/mid/final | segments |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 748 | 21.646 % | 12.343 % | 6.619 % | 60.561 % | 25.267 % | 0.936 / 0.535 / 1.471 % | 19,267 |
| ARMED-ZERO | 748 | 21.646 % | 12.343 % | 6.619 % | 60.561 % | 25.267 % | 0.936 / 0.535 / 1.471 % | 19,267 |
| CHECK-WHEN-PRESSED | 778 | 20.531 % | 12.389 % | 7.965 % | 56.555 % | 27.378 % | 1.928 / 1.028 / 1.928 % | 19,543 |
| CHECK-AND-SHOW | 750 | 21.363 % | 13.996 % | 9.576 % | 56.400 % | 27.600 % | 1.867 / 1.067 / 1.733 % | 19,492 |
| MARKER-ESCAPE | 804 | 22.010 % | 13.865 % | 7.799 % | 56.592 % | 28.234 % | 1.617 / 1.617 / 1.493 % | 19,843 |
| SPACE-SEEK | 813 | 18.914 % | 9.982 % | 6.830 % | 54.490 % | 29.766 % | 1.722 / 0.984 / 1.230 % | 19,661 |
| STALE-CAUTION | 760 | 19.279 % | 11.351 % | 5.946 % | 58.421 % | 26.974 % | 1.184 / 0.921 / 1.184 % | 19,341 |
| KITCHEN-SINK | 795 | 24.357 % | 14.237 % | 7.547 % | 55.975 % | 26.667 % | 2.264 / 1.258 / 1.384 % | 19,113 |

ARMED-ZERO reproduces ABSENT cell for cell on the lifted instrument too.

**The five shares the #218 arc ruler names — ALL SEVEN CONTRAST ARMS (six dosed + the
identity), with CIs and paired deltas.**
They ride the SAME paired seed-cluster bootstrap as every other column. Rows only.

| share | arm | point | paired Δ (pp) [2.5, 97.5] | `resolved` |
| --- | --- | --- | --- | --- |
| **constructed ≥3 (non-set-piece pool)** | ABSENT | **21.6458 %** | — (control) | — |
| | ARMED-ZERO | 21.6458 % | **0** [0, 0] | no |
| | CHECK-WHEN-PRESSED | 20.5310 % | −1.1148 [−5.9481, +3.7987] | no |
| | CHECK-AND-SHOW | 21.3628 % | −0.2830 [−5.0303, +4.5445] | no |
| | MARKER-ESCAPE | 22.0104 % | +0.3646 [−4.2962, +4.9753] | no |
| | SPACE-SEEK | 18.9142 % | −2.7316 [−7.4244, +1.8773] | no |
| | STALE-CAUTION | 19.2793 % | −2.3665 [−5.6062, +0.8638] | no |
| | KITCHEN-SINK | 24.3568 % | +2.7110 [−2.2825, +7.6015] | no |
| **constructed ≥4** | ABSENT | **12.3435 %** | — (control) | — |
| | ARMED-ZERO | 12.3435 % | **0** [0, 0] | no |
| | CHECK-WHEN-PRESSED | 12.3894 % | +0.0459 [−3.9551, +4.1759] | no |
| | CHECK-AND-SHOW | 13.9963 % | +1.6528 [−2.3236, +5.6863] | no |
| | MARKER-ESCAPE | 13.8648 % | +1.5213 [−2.5461, +5.4267] | no |
| | SPACE-SEEK | 9.9825 % | −2.3610 [−6.2734, +1.4444] | no |
| | STALE-CAUTION | 11.3514 % | −0.9921 [−3.6307, +1.7910] | no |
| | KITCHEN-SINK | 14.2367 % | +1.8932 [−2.2178, +5.8833] | no |
| **constructed ≥5** | ABSENT | **6.6190 %** | — (control) | — |
| | ARMED-ZERO | 6.6190 % | **0** [0, 0] | no |
| | CHECK-WHEN-PRESSED | 7.9646 % | +1.3456 [−1.7523, +4.5427] | no |
| | **CHECK-AND-SHOW** | 9.5764 % | **+2.9575 [+0.0025, +5.9299]** | **YES** |
| | MARKER-ESCAPE | 7.7990 % | +1.1800 [−1.6718, +3.9457] | no |
| | SPACE-SEEK | 6.8301 % | +0.2112 [−2.6036, +3.1749] | no |
| | STALE-CAUTION | 5.9459 % | −0.6730 [−2.6533, +1.2510] | no |
| | KITCHEN-SINK | 7.5472 % | +0.9282 [−1.9886, +3.8143] | no |
| **scramble share of goals** | ABSENT | **60.5615 %** | — (control) | — |
| | ARMED-ZERO | 60.5615 % | **0** [0, 0] | no |
| | CHECK-WHEN-PRESSED | 56.5553 % | −4.0062 [−8.7406, +0.7919] | no |
| | CHECK-AND-SHOW | 56.4000 % | −4.1615 [−9.1564, +0.4025] | no |
| | MARKER-ESCAPE | 56.5920 % | −3.9695 [−8.3459, +0.2554] | no |
| | **SPACE-SEEK** | 54.4895 % | **−6.0720 [−10.5309, −1.5860]** | **YES** |
| | STALE-CAUTION | 58.4211 % | −2.1404 [−5.1080, +1.0719] | no |
| | KITCHEN-SINK | 55.9748 % | −4.5867 [−9.4194, +0.3650] | no |
| **set-piece share of goals** | ABSENT | **25.2674 %** | — (control) | — |
| | ARMED-ZERO | 25.2674 % | **0** [0, 0] | no |
| | CHECK-WHEN-PRESSED | 27.3779 % | +2.1105 [−2.0768, +6.0072] | no |
| | CHECK-AND-SHOW | 27.6000 % | +2.3326 [−1.9076, +6.8279] | no |
| | MARKER-ESCAPE | 28.2338 % | +2.9665 [−1.2415, +7.3447] | no |
| | **SPACE-SEEK** | 29.7663 % | **+4.4989 [+0.3427, +8.4450]** | **YES** |
| | STALE-CAUTION | 26.9737 % | +1.7063 [−1.2234, +4.4129] | no |
| | KITCHEN-SINK | 26.6667 % | +1.3993 [−2.9714, +5.7241] | no |

**Read as flags and signs only, without a story.** Three cells resolve in the whole
ruler-5 block, and they are recorded here beside the rows that do not:

* **`constructedGe5Share` CHECK-AND-SHOW Δ +2.9575 pp [+0.0025, +5.9299]** — `resolved=true`
  **AT THE BOUNDARY**: the lower bound is **+0.0025 pp**, i.e. 0.000025 in share units, so the
  CI clears zero by ~1/1,000th of the point estimate. Stated at full stored precision because
  a flag this close to its own threshold must not be quoted as though it were interior.
  Beside it on the SAME arm, the two lower rungs of the same ladder do **not** resolve:
  `constructedGe4Share` +1.6528 pp [−2.3236, +5.6863] and `constructedGe3Share` −0.2830 pp
  [−5.0303, +4.5445] — the ≥3 rung's point estimate is **negative** while the ≥5 rung's is
  positive and flagged. The three rungs are nested populations of the same pool, and their
  signs and flags do not cohere. Recorded, not interpreted.
* **`scrambleShareOfGoals` SPACE-SEEK Δ −6.0720 pp [−10.5309, −1.5860]** — `resolved=true`,
  a DECREASE. And **beside it, on the same arm**, `setPieceShareOfGoals` SPACE-SEEK
  Δ **+4.4989 pp [+0.3427, +8.4450]** — `resolved=true`, an INCREASE. Both rows are printed
  above; no arithmetic relation between them is asserted here.
* No other cell in the five shares resolves, on any arm.

⚠ **REPORTED: no gate reads any of these, and §SUCCESS and the frozen F-OBM-a/b/c set are
unchanged by their presence.** Whether the #218 shares MOVED is the commander's arc-grain
reading, not this doc's.

Segment population and the segmentation-accounting identity, per arm (`looseGapTicks`,
`unattributedGoals` and `spanOrderViolations` are **0 in every arm**, and
`segmentTicks === assignedTicksSum` in every arm):

| arm | segments | segments/match | totalTicks | deadBallTicks | segmentTicks = assignedTicksSum | goalsFromScore = goalsMappedToSegments |
| --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 19,267 | 54.1208 | 5,359,240 | 728,327 | 4,630,913 | 748 |
| ARMED-ZERO | 19,267 | 54.1208 | 5,359,240 | 728,327 | 4,630,913 | 748 |
| CHECK-WHEN-PRESSED | 19,543 | 54.8961 | 5,356,126 | 724,353 | 4,631,773 | 778 |
| CHECK-AND-SHOW | 19,492 | 54.7528 | 5,352,406 | 727,729 | 4,624,677 | 750 |
| MARKER-ESCAPE | 19,843 | 55.7388 | 5,364,880 | 748,335 | 4,616,545 | 804 |
| SPACE-SEEK | 19,661 | 55.2275 | 5,364,648 | 756,966 | 4,607,682 | 813 |
| STALE-CAUTION | 19,341 | 54.3287 | 5,354,755 | 719,465 | 4,635,290 | 760 |
| KITCHEN-SINK | 19,113 | 53.6882 | 5,362,265 | 726,806 | 4,635,459 | 795 |

### THE SEAM — delivered geometry per arm (dose ≠ delivered, #226 / #224.4(ii))

Every row is read as **DELIVERED GEOMETRY, never as the nominal dose**. `maxShiftMetres` is
quoted from `arms.*.seam.maxShiftMetres` at the artifact's own stored precision — the column
the smoke's first cut fabricated (Deviation 5), so it is swept programmatically here.

| arm | support ticks | shifted | unshifted (clamp-bound) | plane-zero | plane-absent (TTL) | mean shift | **max shift** | moved | ≥1 m | plane depth / width (on present) | behind-ball | x-clamp | y-clamp |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 4,211,847 | 0 | 0 | 0 | 4,211,847 | 0 m | **0 m** | 0.0000 % | 0.0000 % | 0 / 0 | 0.1172 % | 1.3189 % | 0.2046 % |
| ARMED-ZERO | 4,211,847 | 0 | 0 | 4,211,847 | 0 | 0 m | **0 m** | 0.0000 % | 0.0000 % | 0 / 0 | 0.1172 % | 1.3189 % | 0.2046 % |
| CHECK-WHEN-PRESSED | 4,301,038 | 1,528,732 | 21,871 | 2,750,435 | 0 | 0.6494 m | **3.7778 m** | 35.5430 % | 29.3080 % | −0.0528 / 0 | 0.1179 % | 0.7054 % | 0.1148 % |
| CHECK-AND-SHOW | 4,358,074 | 1,631,594 | 24,197 | 2,702,283 | 0 | 0.6993 m | **3.7549 m** | 37.4380 % | 31.4680 % | −0.05681 / 0 | 0.1083 % | 0.7424 % | 0.1798 % |
| MARKER-ESCAPE | 3,857,879 | 3,279,371 | 1,186 | 577,322 | 0 | 1.7894 m | **4.4477 m** | 85.0050 % | 76.3450 % | 0.12702 / 0.12702 | 0.1591 % | 2.6669 % | 0.5254 % |
| SPACE-SEEK | 4,099,367 | 2,762,321 | 592 | 1,336,454 | 0 | 1.3902 m | **5.1172 m** | 67.3840 % | 54.9540 % | −0.09966 / 0.09966 | 0.1385 % | 1.1360 % | 0.0785 % |
| STALE-CAUTION | 4,290,946 | 0 | 0 | 4,290,946 | 0 | 0 m | **0 m** | 0.0000 % | 0.0000 % | 0 / 0 | 0.1103 % | 1.3081 % | 0.2769 % |
| KITCHEN-SINK | 5,184,405 | 4,977,471 | 114 | 206,820 | 0 | 4.3174 m | **14.8397 m** | 96.0090 % | 93.2070 % | −0.30473 / 0.30473 | 8.1415 % | 0.6511 % | 1.6090 % |

**The delivery, stated as flags and numbers.** `meanShiftM` is `resolved=true` at **every arm
that doses a PLANE row** — CHECK-WHEN-PRESSED **+0.649444 m** [0.621315, 0.677023] ·
CHECK-AND-SHOW **+0.699332** · SPACE-SEEK **+1.390247** ·
MARKER-ESCAPE **+1.789441** · KITCHEN-SINK **+4.317434** [4.263776, 4.370896] —
a delivered range of **0.649 → 4.317 m**. The two arms that dose **no** plane row deliver
**exactly 0 m** with CI [0, 0]: ARMED-ZERO (the identity) and **STALE-CAUTION** (a SCORE-only
corner — zero geometry **by construction**, which is what G-ARM's output-aware predicate
requires of it).

**`behindBallShare`**: the only resolved cell is **KITCHEN-SINK Δ +8.0243 pp**
[+7.4808, +8.5452] — the incumbent puts a supporter behind the ball on
**0.1172 %** of support ticks and the ceiling probe on **8.1415 %**. No other arm
resolves on that column. `clampXShare` resolves at five arms and `clampYShare` at KITCHEN-SINK
alone; the largest clamp share anywhere in this table is **2.6669 %** (x, MARKER-ESCAPE) and
**1.6090 %** (y, KITCHEN-SINK).

### THE GUARDS — every tolerance frozen ex ante, `BREACH = resolved AND beyondTolerance`

`tol_k = NI_FRACTION · |level_k(ABSENT)|`, **NI_FRACTION = 0.276316**, computed in-probe from
THIS run's own control level. `breach` is **EVIDENCE for F-OBM-b/c, never the firing of it**
(#203).

**INTERCEPTION (F-OBM-b, ceiling)** — ABSENT **27.511236**/match, **tol ±7.601789**:

| arm | Δ [2.5, 97.5] | `resolved` | `beyondTolerance` | **BREACH** |
| --- | --- | --- | --- | --- |
| ARMED-ZERO | 0 [0, 0] | no | no | **false** |
| CHECK-WHEN-PRESSED | +0.362360 [−0.483146, +1.137640] | no | no | **false** |
| CHECK-AND-SHOW | +0.188202 [−0.640449, +1.033708] | no | no | **false** |
| MARKER-ESCAPE | +0.587079 [−0.244382, +1.379213] | no | no | **false** |
| SPACE-SEEK | **+1.148876 [+0.241573, +2.025281]** | **YES** | no | **false** |
| STALE-CAUTION | −0.050562 [−0.615169, +0.533708] | no | no | **false** |
| KITCHEN-SINK | +0.103933 [−0.794944, +0.946629] | no | no | **false** |

Stated mechanically: **exactly ONE interception cell resolves — SPACE-SEEK, Δ +1.148876/match**
[+0.241573, +2.025281] — and it is **WITHIN the frozen tolerance** (15.1 % of the ±7.601789
budget). `beyondTolerance=false` at **every** arm ⇒ **no interception breach row exists at any
dose.** Interception context, REPORTED and never a gate: the Phase 30.5 column disease ran at
**33/match**; the ABSENT arm here reads **27.5112**/match and the largest dosed arm
(SPACE-SEEK) **28.6601**/match.

**CLUMP (F-OBM-b)** — three limbs, and **not one breach among them**:

| limb | direction | ABSENT | tol | resolved deltas | **BREACH** |
| --- | --- | --- | --- | --- | --- |
| **spreadY out of poss.** | floor | 5.689717 | ±1.572159 | MARKER-ESCAPE +0.115292 · SPACE-SEEK +0.109009 · KITCHEN-SINK +0.479069 | **none** (all `beyondTolerance=false`) |
| **spacing median** | floor | 13.018243 | ±3.597146 | SPACE-SEEK +0.234644 · KITCHEN-SINK +0.702925 | **none** (all `beyondTolerance=false`) |
| **pairs under 4 m** | ceiling | 0.094254 | ±0.026044 | MARKER-ESCAPE −0.002623 · KITCHEN-SINK −0.005513 | **none** (all `beyondTolerance=false`) |

⭐ **THE CLUMP CEILING MOVES THE HELPFUL WAY.** On `spacingUnder4` — the limb that caught
CTB-T1's two breaches — the two resolved cells at this exam are both **DECREASES**:

| arm | Δ [2.5, 97.5] | `resolved` | `beyondTolerance` | **BREACH** |
| --- | --- | --- | --- | --- |
| ARMED-ZERO | 0 [0, 0] | no | no | **false** |
| CHECK-WHEN-PRESSED | +0.000096 [−0.001728, +0.001771] | no | no | **false** |
| CHECK-AND-SHOW | +0.000103 [−0.001781, +0.001825] | no | no | **false** |
| MARKER-ESCAPE | **−0.002623 [−0.004373, −0.000889]** | **YES** | no | **false** |
| SPACE-SEEK | −0.000382 [−0.002448, +0.001768] | no | no | **false** |
| STALE-CAUTION | −0.000502 [−0.001789, +0.000780] | no | no | **false** |
| KITCHEN-SINK | **−0.005513 [−0.007308, −0.003776]** | **YES** | no | **false** |

MARKER-ESCAPE **−0.002623** [−0.004373, −0.000889] and KITCHEN-SINK
**−0.005513** [−0.007308, −0.003776] — fewer pairs under 4 m than the control, against a
ceiling tolerance of ±0.026044. Recorded as the flags and signs they are.

**OFFSIDE (F-OBM-c, the #157 FLAG form)** — a resolved INCREASE raises a FLAG that returns to
the commander and flips no gate:

| arm | Δ offsides/match [2.5, 97.5] | `resolved` | `resolvedIncrease` |
| --- | --- | --- | --- |
| ARMED-ZERO | 0 [0, 0] | no | no |
| CHECK-WHEN-PRESSED | −0.101124 [−0.297753, +0.112360] | no | no |
| CHECK-AND-SHOW | +0.033708 [−0.185393, +0.247191] | no | no |
| MARKER-ESCAPE | +0.095506 [−0.115169, +0.320225] | no | no |
| SPACE-SEEK | −0.103933 [−0.311798, +0.117978] | no | no |
| STALE-CAUTION | −0.058989 [−0.210674, +0.089888] | no | no |
| KITCHEN-SINK | **−0.252809 [−0.477528, −0.016854]** | **YES** | no |

**No offside flag is raised at any dose.** The single resolved offside cell is KITCHEN-SINK
Δ **−0.252809**/match, a **DECREASE** (ABSENT 2.1573/match ⇒ KITCHEN-SINK
1.9045). `resolvedIncrease` is **false at every arm**.

**FOULS** (published beside the offside limb, no tolerance frozen on it, gates nothing): the
only resolved cell is **SPACE-SEEK +0.387640** [+0.106742, +0.640449] (ABSENT
4.1348 ⇒ 4.5225/match). Every other arm is unresolved. Noted because it lands on the
**same arm** as the one resolved interception cell.

**WORLD HEALTH (F-OBM-c) — the equilibrium band, GATING at battery N.** Baselines /
tolerances inherited VERBATIM from A4-S2P3 §4.2: goals 2.3944 ±0.15 · crosses 2.4894 ±0.25 ·
headers 9.1039 ±0.25 · longBalls 6.2042 ±0.25 · cutbacks 3.8151 ±0.25.

⭐ **The #198-form exclusion fires on NOTHING at this N: `excludedBecauseControlFails` is
EMPTY.** The ABSENT arm is **in band on all five** dimensions, so **all five are GATED** — none
excluded, none disclosed-away. (At the 12-seed smoke `goals` was excluded; at 356 seeds it is
not. That is a size statement about the smoke.)

| arm | goals | crosses | headers | longBalls | cutbacks | all gated dims in band? |
| --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 2.1011 ✅ | 2.2584 ✅ | 8.4242 ✅ | 5.7022 ✅ | 3.4607 ✅ | **YES** |
| ARMED-ZERO | 2.1011 ✅ | 2.2584 ✅ | 8.4242 ✅ | 5.7022 ✅ | 3.4607 ✅ | **YES** |
| CHECK-WHEN-PRESSED | 2.1854 ✅ | 2.2331 ✅ | 8.5815 ✅ | 6.0281 ✅ | 3.3287 ✅ | **YES** |
| CHECK-AND-SHOW | 2.1067 ✅ | 2.1320 ✅ | 8.4719 ✅ | 5.7303 ✅ | 3.2725 ✅ | **YES** |
| MARKER-ESCAPE | 2.2584 ✅ | 2.3596 ✅ | 6.0927 **❌** | 4.9410 ✅ | 3.4663 ✅ | no |
| SPACE-SEEK | 2.2837 ✅ | 2.4579 ✅ | 7.6404 ✅ | 5.6264 ✅ | 3.5449 ✅ | **YES** |
| STALE-CAUTION | 2.1348 ✅ | 2.2949 ✅ | 8.8876 ✅ | 5.7893 ✅ | 3.3118 ✅ | **YES** |
| KITCHEN-SINK | 2.2331 ✅ | 2.4101 ✅ | 7.8455 ✅ | 5.7584 ✅ | 3.5758 ✅ | **YES** |

Of the six dosed arms, **five hold all five gated dimensions**; MARKER-ESCAPE is the single
`allGatedInBand=false` row.

⭐ **Note mechanically: ZERO per-dose guard disqualifications.** Across all four tolerance
limbs × 7 contrast arms — 28 cells — the count of `breach=true` is **0**, and the offside FLAG
is raised **nowhere**. Under the frozen per-dose STOP granularity, **no dose is disqualified as
a candidate on this battery.**

### ⭐ THE ARMED-ZERO IDENTITY, AT BATTERY N

The in-battery identity arm holds at full scale: **356/356 seeds byte-identical to ABSENT** on
the whole-match signature *including the rng stream state* AND on every measured row field —
**0 differing fields across all 356 rows**. Downstream of that, every ARMED-ZERO paired delta in
`contrasts.rates` is **exactly 0 with CI [0, 0]** on **all 23 columns** (rulers 1–5, all four
guard limbs, offsides, fouls, goals, both clamp shares, behind-ball and mean shift), its
ruler-5 genealogy reproduces ABSENT count for count (748 goals,
19,267 segments), and its seam is **4,211,847 support ticks with
4,211,847 planes PRESENT and 0 shifted** — armed, reached (3,560 policy
writes on 356/356 seeds), and silent. **ZERO IS SILENCE**, measured at battery N.

### Populations — eligible moments and the moment grains, per arm

| arm | qualifying | eligible (ruler 1) | first receptions | pressed first rec. | possession ticks | pressed poss. ticks | ticks walked | played ticks | matches to full time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 28,479 | 21,894 | 14,053 | 11,535 | 1,150,684 | 894,450 | 5,359,240 | 4,630,913 | **356 / 356** |
| ARMED-ZERO | 28,479 | 21,894 | 14,053 | 11,535 | 1,150,684 | 894,450 | 5,359,240 | 4,630,913 | **356 / 356** |
| CHECK-WHEN-PRESSED | 28,460 | 21,654 | 14,320 | 11,779 | 1,140,161 | 888,141 | 5,356,126 | 4,631,773 | **356 / 356** |
| CHECK-AND-SHOW | 28,452 | 21,784 | 14,292 | 11,796 | 1,150,299 | 895,584 | 5,352,406 | 4,624,677 | **356 / 356** |
| MARKER-ESCAPE | 28,480 | 21,990 | 14,486 | 11,923 | 1,200,513 | 933,543 | 5,364,880 | 4,616,545 | **356 / 356** |
| SPACE-SEEK | 28,480 | 21,802 | 14,266 | 11,779 | 1,150,629 | 890,951 | 5,364,648 | 4,607,682 | **356 / 356** |
| STALE-CAUTION | 28,474 | 21,956 | 14,139 | 11,660 | 1,148,827 | 893,514 | 5,354,755 | 4,635,290 | **356 / 356** |
| KITCHEN-SINK | 28,480 | 22,124 | 13,928 | 11,434 | 1,178,057 | 912,992 | 5,362,265 | 4,635,459 | **356 / 356** |

**Every arm reaches full time on all 356 matches.** Exclusion mix on the ruler-1 population
(the #186 rule, unchanged): ABSENT firstTouch 4,469 · mustKick 1,249 · A0-Shoot
856 · A0-Clear 11; across the six dosed arms the same classes span firstTouch
4,247–4,596 · mustKick 1,240–1,377 · A0-Shoot 817–864 · A0-Clear
9–29.

### THE N RULE — as executed (in-probe, from the COMMITTED source artifacts)

⭐ **The substitution the smoke promised was made, and the artifact publishes it.** In FULL
mode the rule re-read `p0` and moments-per-seed from **this world** rather than from the
inherited out-of-world sources, quoting the artifact's own `nRule` fields:

* **`sourceOfP0`**: *"THIS WORLD (the committed OBM-T1 smoke's ABSENT arm)"* — the committed OBM-T1 smoke's own ABSENT arm, this
  percept-armed world.
* **`deffProvenance`**: *"MAX(inherited 0.8302, same-world smoke 0.9845) — the CEILING arm (kitchenSink) paired-delta CI on ruler 2, this world, 12 clusters — NOISY by construction and therefore used only through a MAX with the inherited DEFF."*
  ⇒ **DEFF 0.9845** = MAX(inherited 0.8302, same-world smoke 0.9845).
* Sources pinned by sha: `o2-t1-wedge-exam.json` `72f5929b…1508` ·
  `tempo-census.json` `8629dba4…14dc` · ⭐ `obm-t1-policy-exam-smoke.json`
  `41226d2c…c108` (resultSha `33ea85f0…c9c0`, 12 seeds) — the
  committed smoke this battery re-read its own world's p0 out of.
* **q1 TRUE-holdable** — p0 = 0.002721, MDE = **0.001575** (*"the O2-T1 COMMITTED paired delta on trueContextShare — the ONE paired delta this instrument has resolved in a banked battery. INHERITED knowingly: no same-world MDE exists, and choosing one after sight is forbidden."*), p1 = 0.004296,
  m_iid 22120.5, m_req **21777.6**, eligible/seed 61.25 ⇒ **N 356**.
* **q2 pressed-first-reception** — p0 = 0.815242, MDE = **0.03073** (*"the SMALLEST cross-arm difference the #173 census itself published on this column (prod vs v1/v2), read from the committed artifact"*), m_iid 2657, m_req
  **2615.8**, first receptions/seed 36.0833 ⇒ **N 73**.
* **Binding `q1TrueHoldable` ⇒ N_raw 356 ⇒ N\* = 356.** Ledger room 800,
  `roomBinds: false`; the CTB-T1 precedent cap 628, **`capBinds: false`** —
  *"the cap does not bind at this reading"*, so no cap fork was published to the commander. Block
  **12424100 – 12424455** — exactly what was walked.

⚠ **N is 356 where the smoke projected 628, and the rule did not move — its INPUTS did.**
The smoke had no same-world committed source and therefore ran on the inherited **out-of-world**
p0 and moments-per-seed, and asked for 628. This run had one, so `sourceOfP0` reads
**THIS WORLD**: p0 = **0.002721**, eligible/seed **61.25**, DEFF **0.9845** (the conservative
MAX). The same frozen formula on those inputs asks for **356**. The MDEs are the traced
committed ones and were **not** re-cut — choosing a same-world MDE after sight is what
frozen-before-sight forbids. Stated as a fact about the executed design and **not** as an excuse for any
row: q1 was sized to detect an effect of **0.001575** on `trueHoldableShare`; the largest
|Δ| observed on that column is **0.001006** (KITCHEN-SINK), and the design's own MDE and
the observed spread are both published here so the primary ruler's all-unresolved column can be
read against what it was built to see.

### §CHECKS

```text
$ npx tsc --noEmit
(clean — this round adds no code; src/** byte-untouched, X-SRC-UNTOUCHED PASS)

$ OBMT1_MODE=full OBMT1_RESUME=1 npx tsx scripts/probes/obm-t1-policy-exam.ts   (THE BATTERY, exit 0)
  ALL                PASS          (15 gates)
  resultSha256 9f42b0b6143f8857149db81cedca8b123c1b841afe7f7230295d284e101d2091
  wall 7563 s (CONTEXT ONLY) · artifact docs/world-model/data/obm-t1-policy-exam.json
```

⚠ The `npm test` reading is unchanged from the smoke round and is **not re-quoted as a battery
number**: this round edited no test file and moved no engine byte (X-SRC-UNTOUCHED PASS).

### THE TRANSCRIPT — `/tmp/obm-t1-full.log`, reproduced

The run's own log, reproduced in full. The **only** lines not carried over are the 712 per-seed
progress ticks (356 per pass, of the form
`pass P · seed k/356 (SEED) · 8 arms done · T s`): they are per-seed **wall timings**, the
#197-M1 context-only envelope, read by no gate and entering no number above. Their position is
marked. Every other line of the 993-line log appears below verbatim.

```text

=============================================================================
OBM-T1 POLICY EXAM (#228.6) · mode full · N 356 seeds × 8 arms
seeds 12424100..12424455 · world = PERCEPT-ARMED (edsPerceivedChoice)
arms differ by EXACTLY the 16-weight matrix · domain [-1, 1]
N rule ⇒ N* 356 (ledger room 800, cap 628)
=============================================================================
RESUME requested but no checkpoint at /tmp/obm-t1-checkpoint.jsonl — starting FRESH.
checkpoint ARMED at /tmp/obm-t1-checkpoint.jsonl (one line per finished (pass, seed) unit)
  … [356 per-seed progress ticks, pass 1 — CONTEXT-ONLY wall timings, omitted] …
  pass 1 · G-REPRO-O2T1: block 12422100 (12 matches, O2-T1 CONTROL world)...
  pass 1 · G-REPRO-173: block 12293000 (40 matches, prod world)...
  pass 1 · G-REPRO-GGC: block 12421000 (12 matches, census PROD world)...
  pass 1 · ⭐ G-REPRO-CTBT1: block 12423100 (8 matches, CTB-T1 ABSENT world)...
  pass 1 · delivered-dose read (seed 12424040, 8 arms)...
  [obm-t1] pass 1 digest 85f55c55e7a2e614b20748bdb553a231852cf493e86df21260007917e1f55176 — X-DET second pass...
  … [356 per-seed progress ticks, pass 2 — CONTEXT-ONLY wall timings, omitted] …
  pass 2 · G-REPRO-O2T1: block 12422100 (12 matches, O2-T1 CONTROL world)...
  pass 2 · G-REPRO-173: block 12293000 (40 matches, prod world)...
  pass 2 · G-REPRO-GGC: block 12421000 (12 matches, census PROD world)...
  pass 2 · ⭐ G-REPRO-CTBT1: block 12423100 (8 matches, CTB-T1 ABSENT world)...
  pass 2 · delivered-dose read (seed 12424040, 8 arms)...
  [obm-t1] pass 2 digest 85f55c55e7a2e614b20748bdb553a231852cf493e86df21260007917e1f55176 — X-DET PASS

=== OBM-T1 POLICY EXAM · mode full · 12424100..12424455 (356 seeds/arm, shared) ===
world: PERCEPT-ARMED (edsPerceivedChoice) · ctbSupportPlane FALSE in every arm
arms differ by EXACTLY the 16-weight policy matrix · Δ = ARM − absent
estimator: paired seed-cluster bootstrap, ratio-of-totals, 2.5/97.5, 2000 resamples, stats base 105000

THE RULER
  1  TRUE-holdable supply (share of eligible moments)
    absent                0.5435%   (CONTROL)
    armedZero             0.5435%   Δ           0 [0, 0] resolved=false
    checkWhenPressed      0.6188%   Δ    0.000753 [-0.000495, 0.001933] resolved=false
    checkAndShow          0.5417%   Δ   -0.000018 [-0.001153, 0.001148] resolved=false
    markerEscape          0.4820%   Δ   -0.000615 [-0.001825, 0.000481] resolved=false
    spaceSeek             0.5183%   Δ   -0.000252 [-0.001462, 0.001025] resolved=false
    staleCaution          0.5374%   Δ   -0.000061 [-0.000668, 0.000543] resolved=false
    kitchenSink           0.4430%   Δ   -0.001006 [-0.002179, 0.00011] resolved=false
    absent           n_true  119 / eligible 21894
    armedZero        n_true  119 / eligible 21894
    checkWhenPressed n_true  134 / eligible 21654
    checkAndShow     n_true  118 / eligible 21784
    markerEscape     n_true  106 / eligible 21990
    spaceSeek        n_true  113 / eligible 21802
    staleCaution     n_true  118 / eligible 21956
    kitchenSink      n_true   98 / eligible 22124
  2  PRESSED first reception (openPlay spells, 4.2 m)
    absent               82.0821%   (CONTROL)
    armedZero            82.0821%   Δ           0 [0, 0] resolved=false
    checkWhenPressed     82.2556%   Δ    0.001735 [-0.006827, 0.009921] resolved=false
    checkAndShow         82.5357%   Δ    0.004536 [-0.004337, 0.013727] resolved=false
    markerEscape         82.3071%   Δ    0.002249 [-0.006132, 0.010617] resolved=false
    spaceSeek            82.5669%   Δ    0.004848 [-0.004425, 0.01358] resolved=false
    staleCaution         82.4669%   Δ    0.003848 [-0.003015, 0.010561] resolved=false
    kitchenSink          82.0936%   Δ    0.000115 [-0.009005, 0.009049] resolved=false
  3a SHORT-OPTION supply — possession ticks
    absent               93.8920%   (CONTROL)
    armedZero            93.8920%   Δ           0 [0, 0] resolved=false
    checkWhenPressed     94.0507%   Δ    0.001587 [-0.002638, 0.005862] resolved=false
    checkAndShow         94.0839%   Δ    0.001919 [-0.002053, 0.005857] resolved=false
    markerEscape         93.6059%   Δ   -0.002861 [-0.007728, 0.002019] resolved=false
    spaceSeek            93.7467%   Δ   -0.001453 [-0.005645, 0.002902] resolved=false
    staleCaution         94.0532%   Δ    0.001612 [-0.000877, 0.004135] resolved=false
    kitchenSink          93.6696%   Δ   -0.002224 [-0.006477, 0.002059] resolved=false
  3b SHORT-OPTION supply — first receptions
    absent               97.7300%   (CONTROL)
    armedZero            97.7300%   Δ           0 [0, 0] resolved=false
    checkWhenPressed     97.4162%   Δ   -0.003138 [-0.007003, 0.00068] resolved=false
    checkAndShow         97.5231%   Δ   -0.002069 [-0.005648, 0.001376] resolved=false
    markerEscape         97.4113%   Δ   -0.003187 [-0.006809, 0.000181] resolved=false
    spaceSeek            97.4905%   Δ   -0.002395 [-0.005905, 0.001009] resolved=false
    staleCaution         97.7014%   Δ   -0.000286 [-0.002694, 0.002272] resolved=false
    kitchenSink          97.1137%   Δ   -0.006163 [-0.009784, -0.002433] resolved=true
  4a SUPPORT-EXISTENCE at PRESSED possession ticks
    absent               96.4223%   (CONTROL)
    armedZero            96.4223%   Δ           0 [0, 0] resolved=false
    checkWhenPressed     96.5056%   Δ    0.000834 [-0.003774, 0.005369] resolved=false
    checkAndShow         96.5536%   Δ    0.001314 [-0.00303, 0.0056] resolved=false
    markerEscape         96.0953%   Δ    -0.00327 [-0.008288, 0.001915] resolved=false
    spaceSeek            96.2490%   Δ   -0.001733 [-0.006293, 0.003082] resolved=false
    staleCaution         96.5738%   Δ    0.001515 [-0.001176, 0.004176] resolved=false
    kitchenSink          95.8873%   Δ    -0.00535 [-0.010107, -0.000572] resolved=true
  4b SUPPORT-EXISTENCE at PRESSED first receptions
    absent               97.7200%   (CONTROL)
    armedZero            97.7200%   Δ           0 [0, 0] resolved=false
    checkWhenPressed     97.4022%   Δ   -0.003178 [-0.007283, 0.000861] resolved=false
    checkAndShow         97.6348%   Δ   -0.000852 [-0.004487, 0.002814] resolved=false
    markerEscape         97.3916%   Δ   -0.003284 [-0.006987, 0.000385] resolved=false
    spaceSeek            97.6144%   Δ   -0.001056 [-0.004842, 0.002543] resolved=false
    staleCaution         97.6844%   Δ   -0.000356 [-0.002926, 0.002432] resolved=false
    kitchenSink          97.1139%   Δ   -0.006061 [-0.010009, -0.00213] resolved=true
  5  goals per match (the #218 shares are LIFTED — rows below)
    absent                 2.1011   (CONTROL)
    armedZero              2.1011   Δ           0 [0, 0] resolved=false
    checkWhenPressed       2.1854   Δ     0.08427 [-0.109551, 0.275281] resolved=false
    checkAndShow           2.1067   Δ    0.005618 [-0.213483, 0.219101] resolved=false
    markerEscape           2.2584   Δ    0.157303 [-0.050562, 0.376404] resolved=false
    spaceSeek              2.2837   Δ    0.182584 [-0.033708, 0.404494] resolved=false
    staleCaution           2.1348   Δ    0.033708 [-0.106742, 0.176966] resolved=false
    kitchenSink            2.2331   Δ    0.132022 [-0.087079, 0.351124] resolved=false

RULER 5 — THE #218 LIFT (REPORTED; no gate reads these · G-REPRO-GGC proves the port)
  absent           goals 748 · constructed≥3 21.6460% · ≥4 12.3430% · ≥5 6.6190% · scramble 60.5610% · setPiece 25.2670% · turnover own/mid/final 0.9360%/0.5350%/1.4710%
  armedZero        goals 748 · constructed≥3 21.6460% · ≥4 12.3430% · ≥5 6.6190% · scramble 60.5610% · setPiece 25.2670% · turnover own/mid/final 0.9360%/0.5350%/1.4710%
  checkWhenPressed goals 778 · constructed≥3 20.5310% · ≥4 12.3890% · ≥5 7.9650% · scramble 56.5550% · setPiece 27.3780% · turnover own/mid/final 1.9280%/1.0280%/1.9280%
  checkAndShow     goals 750 · constructed≥3 21.3630% · ≥4 13.9960% · ≥5 9.5760% · scramble 56.4000% · setPiece 27.6000% · turnover own/mid/final 1.8670%/1.0670%/1.7330%
  markerEscape     goals 804 · constructed≥3 22.0100% · ≥4 13.8650% · ≥5 7.7990% · scramble 56.5920% · setPiece 28.2340% · turnover own/mid/final 1.6170%/1.6170%/1.4930%
  spaceSeek        goals 813 · constructed≥3 18.9140% · ≥4 9.9820% · ≥5 6.8300% · scramble 54.4900% · setPiece 29.7660% · turnover own/mid/final 1.7220%/0.9840%/1.2300%
  staleCaution     goals 760 · constructed≥3 19.2790% · ≥4 11.3510% · ≥5 5.9460% · scramble 58.4210% · setPiece 26.9740% · turnover own/mid/final 1.1840%/0.9210%/1.1840%
  kitchenSink      goals 795 · constructed≥3 24.3570% · ≥4 14.2370% · ≥5 7.5470% · scramble 55.9750% · setPiece 26.6670% · turnover own/mid/final 2.2640%/1.2580%/1.3840%
  (the same five shares, PAIRED and bootstrapped — REPORTED, no gate reads them)
  5a constructed ≥3 passes (non-set-piece pool)
    absent               21.6458%   (CONTROL)
    armedZero            21.6458%   Δ           0 [0, 0] resolved=false
    checkWhenPressed     20.5310%   Δ   -0.011148 [-0.059481, 0.037987] resolved=false
    checkAndShow         21.3628%   Δ    -0.00283 [-0.050303, 0.045445] resolved=false
    markerEscape         22.0104%   Δ    0.003646 [-0.042962, 0.049753] resolved=false
    spaceSeek            18.9142%   Δ   -0.027316 [-0.074244, 0.018773] resolved=false
    staleCaution         19.2793%   Δ   -0.023665 [-0.056062, 0.008638] resolved=false
    kitchenSink          24.3568%   Δ     0.02711 [-0.022825, 0.076015] resolved=false
  5b constructed ≥4 passes (non-set-piece pool)
    absent               12.3435%   (CONTROL)
    armedZero            12.3435%   Δ           0 [0, 0] resolved=false
    checkWhenPressed     12.3894%   Δ    0.000459 [-0.039551, 0.041759] resolved=false
    checkAndShow         13.9963%   Δ    0.016528 [-0.023236, 0.056863] resolved=false
    markerEscape         13.8648%   Δ    0.015213 [-0.025461, 0.054267] resolved=false
    spaceSeek             9.9825%   Δ    -0.02361 [-0.062734, 0.014444] resolved=false
    staleCaution         11.3514%   Δ   -0.009921 [-0.036307, 0.01791] resolved=false
    kitchenSink          14.2367%   Δ    0.018932 [-0.022178, 0.058833] resolved=false
  5c constructed ≥5 passes (non-set-piece pool)
    absent                6.6190%   (CONTROL)
    armedZero             6.6190%   Δ           0 [0, 0] resolved=false
    checkWhenPressed      7.9646%   Δ    0.013456 [-0.017523, 0.045427] resolved=false
    checkAndShow          9.5764%   Δ    0.029575 [0.000025, 0.059299] resolved=true
    markerEscape          7.7990%   Δ      0.0118 [-0.016718, 0.039457] resolved=false
    spaceSeek             6.8301%   Δ    0.002112 [-0.026036, 0.031749] resolved=false
    staleCaution          5.9459%   Δ    -0.00673 [-0.026533, 0.01251] resolved=false
    kitchenSink           7.5472%   Δ    0.009282 [-0.019886, 0.038143] resolved=false
  5d scramble share of goals
    absent               60.5615%   (CONTROL)
    armedZero            60.5615%   Δ           0 [0, 0] resolved=false
    checkWhenPressed     56.5553%   Δ   -0.040062 [-0.087406, 0.007919] resolved=false
    checkAndShow         56.4000%   Δ   -0.041615 [-0.091564, 0.004025] resolved=false
    markerEscape         56.5920%   Δ   -0.039695 [-0.083459, 0.002554] resolved=false
    spaceSeek            54.4895%   Δ    -0.06072 [-0.105309, -0.01586] resolved=true
    staleCaution         58.4211%   Δ   -0.021404 [-0.05108, 0.010719] resolved=false
    kitchenSink          55.9748%   Δ   -0.045867 [-0.094194, 0.00365] resolved=false
  5e set-piece share of goals
    absent               25.2674%   (CONTROL)
    armedZero            25.2674%   Δ           0 [0, 0] resolved=false
    checkWhenPressed     27.3779%   Δ    0.021105 [-0.020768, 0.060072] resolved=false
    checkAndShow         27.6000%   Δ    0.023326 [-0.019076, 0.068279] resolved=false
    markerEscape         28.2338%   Δ    0.029665 [-0.012415, 0.073447] resolved=false
    spaceSeek            29.7663%   Δ    0.044989 [0.003427, 0.08445] resolved=true
    staleCaution         26.9737%   Δ    0.017063 [-0.012234, 0.044129] resolved=false
    kitchenSink          26.6667%   Δ    0.013993 [-0.029714, 0.057241] resolved=false

THE CEILINGS (rulers 3b/4b are near-saturated — disclosed, computed from these rows)
  4b support@pressed first rec: ABSENT 97.72% ⇒ helpful headroom 2.28 pp
    armedZero        Δ       0 pp = 0.0% of the headroom · resolved=false
    checkWhenPressed Δ  -0.318 pp = -13.9% of the headroom · resolved=false
    checkAndShow     Δ  -0.085 pp = -3.7% of the headroom · resolved=false
    markerEscape     Δ  -0.328 pp = -14.4% of the headroom · resolved=false
    spaceSeek        Δ  -0.106 pp = -4.6% of the headroom · resolved=false
    staleCaution     Δ  -0.036 pp = -1.6% of the headroom · resolved=false
    kitchenSink      Δ  -0.606 pp = -26.6% of the headroom · resolved=true
  3b short option / first rec: ABSENT 97.73% ⇒ helpful headroom 2.27 pp
    armedZero        Δ       0 pp = 0.0% of the headroom · resolved=false
    checkWhenPressed Δ  -0.314 pp = -13.8% of the headroom · resolved=false
    checkAndShow     Δ  -0.207 pp = -9.1% of the headroom · resolved=false
    markerEscape     Δ  -0.319 pp = -14.0% of the headroom · resolved=false
    spaceSeek        Δ  -0.239 pp = -10.5% of the headroom · resolved=false
    staleCaution     Δ  -0.029 pp = -1.3% of the headroom · resolved=false
    kitchenSink      Δ  -0.616 pp = -27.2% of the headroom · resolved=true

THE SEAT, REACHED (G-ARM: the four support-tick classes partition exactly)
  absent           supportTicks 4211847 · policyWrites     0 · shifted       0 · planeZero       0 · planeAbsent 4211847 · clampBound     0 · partition=true
  armedZero        supportTicks 4211847 · policyWrites  3560 · shifted       0 · planeZero 4211847 · planeAbsent       0 · clampBound     0 · partition=true
  checkWhenPressed supportTicks 4301038 · policyWrites  3560 · shifted 1528732 · planeZero 2750435 · planeAbsent       0 · clampBound 21871 · partition=true
  checkAndShow     supportTicks 4358074 · policyWrites  3560 · shifted 1631594 · planeZero 2702283 · planeAbsent       0 · clampBound 24197 · partition=true
  markerEscape     supportTicks 3857879 · policyWrites  3560 · shifted 3279371 · planeZero  577322 · planeAbsent       0 · clampBound  1186 · partition=true
  spaceSeek        supportTicks 4099367 · policyWrites  3560 · shifted 2762321 · planeZero 1336454 · planeAbsent       0 · clampBound   592 · partition=true
  staleCaution     supportTicks 4290946 · policyWrites  3560 · shifted       0 · planeZero 4290946 · planeAbsent       0 · clampBound     0 · partition=true
  kitchenSink      supportTicks 5184405 · policyWrites  3560 · shifted 4977471 · planeZero  206820 · planeAbsent       0 · clampBound   114 · partition=true

⭐ THE DELIVERED DOSE (dose ≠ delivered — read where the executor consumes it)
  absent           meanShift        0 m · max       0 m · moved 0.0000% · ≥1 m 0.0000% · plane d/w        0/       0 · behindBall 0.1172% · clampX 1.3189%
  armedZero        meanShift        0 m · max       0 m · moved 0.0000% · ≥1 m 0.0000% · plane d/w        0/       0 · behindBall 0.1172% · clampX 1.3189%
  checkWhenPressed meanShift   0.6494 m · max  3.7778 m · moved 35.5430% · ≥1 m 29.3080% · plane d/w  -0.0528/       0 · behindBall 0.1179% · clampX 0.7054%
  checkAndShow     meanShift   0.6993 m · max  3.7549 m · moved 37.4380% · ≥1 m 31.4680% · plane d/w -0.05681/       0 · behindBall 0.1083% · clampX 0.7424%
  markerEscape     meanShift   1.7894 m · max  4.4477 m · moved 85.0050% · ≥1 m 76.3450% · plane d/w  0.12702/ 0.12702 · behindBall 0.1591% · clampX 2.6669%
  spaceSeek        meanShift   1.3902 m · max  5.1172 m · moved 67.3840% · ≥1 m 54.9540% · plane d/w -0.09966/ 0.09966 · behindBall 0.1385% · clampX 1.1360%
  staleCaution     meanShift        0 m · max       0 m · moved 0.0000% · ≥1 m 0.0000% · plane d/w        0/       0 · behindBall 0.1103% · clampX 1.3081%
  kitchenSink      meanShift   4.3174 m · max 14.8397 m · moved 96.0090% · ≥1 m 93.2070% · plane d/w -0.30473/ 0.30473 · behindBall 8.1415% · clampX 0.6511%
  the FEATURES and the SCORE MULTIPLIERS (observational read, seed 12424040, DESCRIPTIVE ONLY)
    absent           f[0.23303, 0.50135, 0.23766, 0.15501] · out[0, 0, 0, 0] · supportMul 1 [1, 1] · runMul 1 [1, 1] · zeroFeatureShare 0.7790%
    armedZero        f[0.23303, 0.50135, 0.23766, 0.15501] · out[0, 0, 0, 0] · supportMul 1 [1, 1] · runMul 1 [1, 1] · zeroFeatureShare 0.7790%
    checkWhenPressed f[0.22813, 0.50016, 0.2477, 0.15624] · out[-0.05703, 0, 0, 0] · supportMul 1 [1, 1] · runMul 1 [1, 1] · zeroFeatureShare 0.6750%
    checkAndShow     f[0.22289, 0.50833, 0.23591, 0.15559] · out[-0.05572, 0, 0.05572, 0] · supportMul 1.02229 [1, 1.1] · runMul 1 [1, 1] · zeroFeatureShare 0.6300%
    markerEscape     f[0.2819, 0.53556, 0.25021, 0.14982] · out[0.13389, 0.13389, 0, 0] · supportMul 1 [1, 1] · runMul 1 [1, 1] · zeroFeatureShare 0.5970%
    spaceSeek        f[0.21146, 0.46796, 0.2447, 0.15352] · out[-0.06118, 0.06118, 0, 0] · supportMul 1 [1, 1] · runMul 1 [1, 1] · zeroFeatureShare 0.5990%
    staleCaution     f[0.19557, 0.47533, 0.23331, 0.1571] · out[0, 0, -0.03928, -0.03928] · supportMul 0.98429 [0.96078, 0.99804] · runMul 0.98429 [0.96078, 0.99804] · zeroFeatureShare 0.8750%
    kitchenSink      f[0.19924, 0.47417, 0.26189, 0.15533] · out[-0.27266, 0.27266, 0.27266, -0.27266] · supportMul 1.10906 [1.01569, 1.21906] · runMul 0.89094 [0.78079, 0.98431] · zeroFeatureShare 1.0380%

THE GUARDS (tolerance = NI_FRACTION · |control level|, frozen ex ante)
  interceptionsPerMatch [F-CTB-b interception, ceiling] control 27.511236 · tol ±7.601789
    armedZero        Δ           0 [0, 0] resolved=false beyondTol=false BREACH=false
    checkWhenPressed Δ     0.36236 [-0.483146, 1.13764] resolved=false beyondTol=false BREACH=false
    checkAndShow     Δ    0.188202 [-0.640449, 1.033708] resolved=false beyondTol=false BREACH=false
    markerEscape     Δ    0.587079 [-0.244382, 1.379213] resolved=false beyondTol=false BREACH=false
    spaceSeek        Δ    1.148876 [0.241573, 2.025281] resolved=true beyondTol=false BREACH=false
    staleCaution     Δ   -0.050562 [-0.615169, 0.533708] resolved=false beyondTol=false BREACH=false
    kitchenSink      Δ    0.103933 [-0.794944, 0.946629] resolved=false beyondTol=false BREACH=false
  spreadYOut [F-CTB-b clump, floor] control 5.689717 · tol ±1.572159
    armedZero        Δ           0 [0, 0] resolved=false beyondTol=false BREACH=false
    checkWhenPressed Δ    0.012825 [-0.024459, 0.052437] resolved=false beyondTol=false BREACH=false
    checkAndShow     Δ   -0.001354 [-0.040194, 0.040559] resolved=false beyondTol=false BREACH=false
    markerEscape     Δ    0.115292 [0.071029, 0.158761] resolved=true beyondTol=false BREACH=false
    spaceSeek        Δ    0.109009 [0.060732, 0.157053] resolved=true beyondTol=false BREACH=false
    staleCaution     Δ    0.016951 [-0.011372, 0.04736] resolved=false beyondTol=false BREACH=false
    kitchenSink      Δ    0.479069 [0.433127, 0.525245] resolved=true beyondTol=false BREACH=false
  spacingMedian [F-CTB-b clump, floor] control 13.018243 · tol ±3.597146
    armedZero        Δ           0 [0, 0] resolved=false beyondTol=false BREACH=false
    checkWhenPressed Δ     0.02959 [-0.06006, 0.118396] resolved=false beyondTol=false BREACH=false
    checkAndShow     Δ   -0.026215 [-0.1218, 0.06366] resolved=false beyondTol=false BREACH=false
    markerEscape     Δ    0.061825 [-0.029301, 0.148492] resolved=false beyondTol=false BREACH=false
    spaceSeek        Δ    0.234644 [0.13034, 0.339496] resolved=true beyondTol=false BREACH=false
    staleCaution     Δ    0.022762 [-0.040265, 0.087498] resolved=false beyondTol=false BREACH=false
    kitchenSink      Δ    0.702925 [0.607124, 0.796539] resolved=true beyondTol=false BREACH=false
  spacingUnder4 [F-CTB-b clump, ceiling] control 0.094254 · tol ±0.026044
    armedZero        Δ           0 [0, 0] resolved=false beyondTol=false BREACH=false
    checkWhenPressed Δ    0.000096 [-0.001728, 0.001771] resolved=false beyondTol=false BREACH=false
    checkAndShow     Δ    0.000103 [-0.001781, 0.001825] resolved=false beyondTol=false BREACH=false
    markerEscape     Δ   -0.002623 [-0.004373, -0.000889] resolved=true beyondTol=false BREACH=false
    spaceSeek        Δ   -0.000382 [-0.002448, 0.001768] resolved=false beyondTol=false BREACH=false
    staleCaution     Δ   -0.000502 [-0.001789, 0.00078] resolved=false beyondTol=false BREACH=false
    kitchenSink      Δ   -0.005513 [-0.007308, -0.003776] resolved=true beyondTol=false BREACH=false
  offsides/match (the #157 FLAG form — returns to the commander, flips no gate)
    armedZero        Δ           0 [0, 0] resolved=false resolvedIncrease=false
    checkWhenPressed Δ   -0.101124 [-0.297753, 0.11236] resolved=false resolvedIncrease=false
    checkAndShow     Δ    0.033708 [-0.185393, 0.247191] resolved=false resolvedIncrease=false
    markerEscape     Δ    0.095506 [-0.115169, 0.320225] resolved=false resolvedIncrease=false
    spaceSeek        Δ   -0.103933 [-0.311798, 0.117978] resolved=false resolvedIncrease=false
    staleCaution     Δ   -0.058989 [-0.210674, 0.089888] resolved=false resolvedIncrease=false
    kitchenSink      Δ   -0.252809 [-0.477528, -0.016854] resolved=true resolvedIncrease=false
  equilibrium band — gated dimensions ["goals","crosses","headers","longBalls","cutbacks"] · EXCLUDED (control itself out of band) []
    absent           allGatedInBand=true
    armedZero        allGatedInBand=true
    checkWhenPressed allGatedInBand=true
    checkAndShow     allGatedInBand=true
    markerEscape     allGatedInBand=false
    spaceSeek        allGatedInBand=true
    staleCaution     allGatedInBand=true
    kitchenSink      allGatedInBand=true

N RULE (in-probe, from the committed artifacts)
  DEFF 0.9845 (measured off the O2-T1 committed paired-delta CI)
  q1 TRUE-holdable (MDE = the O2-T1 resolved delta 0.001575): m_req 21777.6 ⇒ N 356
  q2 pressed-first-reception (MDE = 0.03073, the census's own smallest cross-arm gap): m_req 2615.8 ⇒ N 73
  DEFF source MAX(inherited 0.8302, same-world smoke 0.9845) — the CEILING arm (kitchenSink) paired-delta CI on ruler 2, this world, 12 clusters — NOISY by construction and therefore used only through a MAX with the inherited DEFF.
  p0 source THIS WORLD (the committed OBM-T1 smoke's ABSENT arm)
  binding q1TrueHoldable · N_raw 356 ⇒ N* 356 (ledger room 800, binds=false · cap 628, binds=false) · battery block 12424100..12424455

GATES
  xDet                 PASS
  xFpProd              PASS
  xSrcUntouched        PASS
  gReproCtbT1          PASS
  gBlindWorld          PASS
  gForkTokens          PASS
  gReproO2T1           PASS
  gRepro173            PASS
  gReproGgc            PASS
  gTraceRadius         PASS
  seedDisjoint         PASS
  statsDisjoint        PASS
  flagHygiene          PASS
  gArm                 PASS
  gCleanInvocation     PASS
  ALL                PASS
resultSha256 9f42b0b6143f8857149db81cedca8b123c1b841afe7f7230295d284e101d2091
wall 7563 s (CONTEXT ONLY) · artifact docs/world-model/data/obm-t1-policy-exam.json
```

### Deviations recorded — the battery round

10. **No new deviation is booked by this round.** The battery ran the frozen §FORM / §SEEDS /
    §GATES / §SUCCESS unchanged, at the rule's own N on the ruled block, with `src/**`
    byte-untouched. Deviations 1–9 (all declared pre-battery) stand as recorded and are not
    reopened. **Deviation 9 — the first battery of record, 14/15 with SEED-DISJOINT red — is
    the one that bears on this run**: its corrected predicate is exercised here for the first
    time in FULL mode, and the `stageOwnUnified` row above is its receipt. No arm, dose, ruler,
    guard, estimator or gate LEVEL changed between that run and this one.

### Disposition

The battery is measured, gated and committed: **15 / 15 gates PASS**, the identity arm holds
byte-identical on 356/356 seeds, the seat is reached on every seed of every armed arm, the
doses arrive at published sizes from 0.649 m to 4.317 m of mean shift, and every ruler, guard,
ceiling, genealogy, seam and band row above is quoted from the committed artifact. **This
section fires nothing.** F-OBM-a, F-OBM-b and F-OBM-c — and the arc-level STOP the frozen
granularity defines on top of them — are **entirely the commander's**, on the rows above. The
adjudication is ruling **#230** in [`PROGRAMME-RULINGS.md`](PROGRAMME-RULINGS.md).
