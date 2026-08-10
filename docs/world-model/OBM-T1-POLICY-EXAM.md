# OBM T1 — the POLICY EXAM (hand-dose the off-ball EYES seat, measure the world)

Status: **FROZEN BEFORE SIGHT, then SMOKED, then CORRECTED PRE-BATTERY.** Everything from §FORM
to §NON-CLAIMS — the
world, the eight arms and their exact matrices, the ruler, the guards, the estimator, the
success wording, the seed ledger, the N rule and the gate list — was written **before** any
number of this stage existed. The measured numbers arrive only in
[§RESULT — the smoke](#result--the-smoke) at the foot, and everything sharpened after a run —
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
