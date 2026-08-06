# A4 S2-P1 — THE PER-BODY OBEDIENCE VECTOR CENSUS (does 每个人有自己的分寸 cure 撞车 without selling the defence?)

Status: **PRE-REGISTERED 2026-08-06, FROZEN BEFORE ANY GATE-BEARING RUN.**
Deliverables: this freeze + the generalized dormant seam (`Match.homeRegionGrant`
gains a per-body obedience VECTOR member) + its dormancy/equivalence tests
([`tests/a4S2VectorGrant.test.ts`](../../tests/a4S2VectorGrant.test.ts)) + the probe
([`scripts/probes/a4-s2p1-vector-census.ts`](../../scripts/probes/a4-s2p1-vector-census.ts))
+ the SIZING SMOKE (committed:
[`data/a4-s2p1-vector-census-sizing-smoke.json`](data/a4-s2p1-vector-census-sizing-smoke.json)).
**The census run is a FUTURE authorized step** (freeze → review → run). **Nothing
ships (Road B); the production fingerprint `57b0bdab…c673` stands.**

Authority: **[`A4-SLICE2-PERBODY-CONTRACT.md`](A4-SLICE2-PERBODY-CONTRACT.md)**
§1 (H-A4.2 + the H-157c discriminator), §2 (M-S2.3: the banked P1c seam
generalizes to a per-body dose VECTOR — instrument-side ONLY), §3 (⭐ BIRTH
NEUTRALITY + Road B + frozen-before-sight), §4 (S2-P1: the frozen axes), §5 (the
#157 instrument debt — a DEDICATED foul counter, offsides descriptive + FLAG, the
E4 combination counters REPORTED, the proximity block DESCRIPTIVE), §6 (the
pre-named FAIL modes F-S2a..F-S2d) · **ruling #158** (slice 2 opens; the user
rules 甲; the offside axis 乙 HANGS) · **#157** (the user's first play verdict —
*很多时候球员不知道自己该往哪走,尤其是防守的时候* — and the forensic
corroboration: dupRun **+7.8 %**, spacingUnder4 +5.3 %, restartTicks +29 %,
offsides ≈2× production) · **#154** (the slice-1 CERTIFIED prices: deep
**−0.7395 [−1.2055, −0.2440]**/set, box **−0.380 [−0.480, −0.275]**/set on
PRIOR−R3p) · **#152** (the ruler amendment: the proximity readouts are
DESCRIPTIVE, verdict authority = the user's play-test; the restart/offside FLAG
idiom) · **#150/#149/#148** (the shipped-form prior seam; the certified whisper
obedience 0.5 = 0.25×VAL_SCALE = 0.040874) · parent contract
[`A4-ASSIGNMENT-CONTRACT.md`](A4-ASSIGNMENT-CONTRACT.md) §2 (M1′–M5), §3
(I-A1..I-A7, inherited verbatim), §4 (the P1c fork-and-grant FORM this stage
generalizes) · method [`../PROBE-CONTRACTS.md`](../PROBE-CONTRACTS.md) · #20
(cluster = match seed) · #46.2 (seed disjointness) · #105.4 (optional stopping
foreclosed) · #128 (wall measured OUTSIDE the X-DET core) · #49.3 (per-record
receipts) · the probe idiom
[`A4-P1C-GRANT-CENSUS.md`](A4-P1C-GRANT-CENSUS.md) (the R3p fixture, the paired
same-seed multi-branch fork, X-FORK-IDENT, the sizing → frozen-N arithmetic) and
[`A4-P3PRIME-REPLICATION.md`](A4-P3PRIME-REPLICATION.md) (the battery/instrument
idiom: descriptive vs gating, flag thresholds, per-arm levels).

---

## §0 — PURPOSE, in plain football language

Slice 1 proved that a **shared whisper** — everyone agreeing, at low volume,
roughly where his home is — makes the team **defend better** (fewer entries into
its third and its box, #154). The user then played it and said the honest thing:
*很多时候球员不知道自己该往哪走,尤其是防守的时候* — and the forensics agreed
that the agreeing team runs into itself MORE (dupRun +7.8 %).

The suspicion (H-157c) is that one whisper for everybody makes everyone the same
player. Real teams are not like that: 爱压上的后卫和爱回撤的前锋 (VISION §1). So
this stage asks one question and pays the same total dose for every answer:

> **If the SAME amount of agreement is spread UNEVENLY across the six bodies —
> some obey it hard, some barely — do they stop running into each other, without
> giving back the defence slice 1 bought?**

Everything here is measurement. Nothing ships, no gene is built (that is S2-P2),
no offside rule is touched (the 乙 axis is the user's).

---

## §1 — THE ESTIMAND (contract §1, H-A4.2 — the H-157c discriminator)

**The causal effect of the SHAPE of a home agreement, at CONSTANT dose, on
same-job duplication and on the certified defensive currency**, measured
interventionally by a paired same-seed fork on the R3p eye world (the P1c
machinery, contract §4).

At a qualifying own-possession moment for side `d` the base state is cloned into
INDEPENDENT deep copies:

* **branch NONE** — no grant (the eye world as-is; the level anchor).
* **branch `<arm>`** — `Match.homeRegionGrant = { side:d, obedienceByIndex: v }`
  with `v` = the arm's frozen per-body obedience vector.

Because every arm's **mean obedience over the five outfield bodies is EXACTLY
0.5** — the slice-1 certified whisper — the arms differ **only in shape, never in
dose**. That is the discriminator: if `spread` does not move dupRun, H-157c is
recorded WRONG (contract §6, F-S2a).

**The mechanism, exactly.** Each body's own obedience is mapped through the
SHIPPED-FORM `homePriorStrength` onto `[0, HOME_MAP_STRENGTH_MAX]` and applied to
**HIS OWN `ATTACK_FORMATIONS` home** through the SAME `homeMapBias` closure the
shipped `eye.v4.homePrior` branch builds, at the SAME established v3 consumption
point. No clamp, no new decision moment, no new percept (M-S2.2/M-S2.4).
Consequently a **uniform 0.5 vector IS the slice-1 PRIOR content on that side** —
asserted BYTE-IDENTICAL in `tests/a4S2VectorGrant.test.ts`, which is what makes
`uniform` an honest control rather than a lookalike.

---

## §2 — ⭐ THE FROZEN VECTOR GRID (contract §4 axes; magnitudes frozen HERE)

Index 0 is the GK (he never reaches the v3 station eye ⇒ always 0). The five
outfield bodies are indices 1..5; the published `ATTACK_FORMATIONS` home depths
run back→front over those indices (e.g. `wide-212`: −16, −12, +8, +8, +4), which
is what "back-loaded" and "front-loaded" mean below.

```text
arm            obedience by index [GK, 1, 2, 3, 4, 5]      mean(1..5)   role
uniform        [0, 0.5,  0.5,   0.5,   0.5,   0.5  ]        0.5   ⭐ CONTROL = the slice-1 PRIOR (whole-team whisper)
spread         [0, 0.8,  0.2,   0.8,   0.2,   0.5  ]        0.5   ⭐ the H-157c DISCRIMINATOR (max heterogeneity, non-monotone in depth)
backLoaded     [0, 0.9,  0.7,   0.5,   0.3,   0.1  ]        0.5      deep bodies obey hardest
frontLoaded    [0, 0.1,  0.3,   0.5,   0.7,   0.9  ]        0.5      forward bodies obey hardest
singleAnchor   [0, 1.0,  0.375, 0.375, 0.375, 0.375]        0.5      one anchored body (the P1c echo, dose-matched)
```

* **Every mean is EXACTLY 0.5** (asserted as the HARD `priorEquivalence` gate in
  the probe, together with `homePriorStrength(0.5) = 0.25 × VAL_SCALE = 0.040874`
  and `VAL_SCALE` recomputed from the SHA-pinned merged table `= 0.163494`).
  Source of the anchor: **#148/#154** (the certified whisper).
* **Every entry is inside the gene domain `[0,1]`** ⇒ inside the P1e-certified
  non-harmful strength span `(0, 0.5]×VAL_SCALE` (**#148**). No arm exceeds the
  certified ceiling.
* `spread` is deliberately **non-monotone in depth** (0.8/0.2/0.8/0.2/0.5): it is
  a pure heterogeneity contrast, not a disguised back/front tilt — the two tilts
  are their own arms.
* ⚠ **DEVIATION, FLAGGED.** Contract §4 names `single-anchor` "the P1c echo" (one
  high body, the rest silent). The silent-rest form carries mean 0.2 and would
  confound SHAPE with DOSE, so it is frozen here at matched mean
  `[1.0, 0.375×4]`. The silent-rest variant is NAMED as a later instrument and is
  not run at this stage.
* **BIRTH NEUTRALITY (contract §3) holds:** these vectors are *instrument content
  inside probe forks only*. `src/**` contains no role-derived per-body default
  anywhere; the shipped gene remains a single per-TEAM obedience born absent
  (asserted in the test file).

---

## §3 — THE WORLD, THE FORK, THE ADMISSION RULE (P1c idiom, verbatim)

* **World:** the ENRICHED census world (#67.3) with the **ARMED R3p eye** —
  `scope {kind:'both'}`, `v3:{roleTable, control, children, mergedTableSha}` (the
  injected P3p-1 merged table), `v4:{inSupportLaw, deliveryBit, offsideBit}`;
  `homeRegionGrant` **null in the base run**. Its arm gates **X-MERGE-IDENT** and
  **E-NONSTATION** are inherited as HARD gates.
* **Fork moment:** `phase === 'playing'` ∧ `ball.owner !== null` ∧
  `simTime − lastForkTime ≥ 4.0 s` (the P1b/P1c cadence); side `d = owner.side`;
  both sides eligible; **`FORK_CAP_PER_MATCH = 12`** (lower than P1c's 20 — each
  fork now runs 1 + 5 arm branches + 1 X-FORK-IDENT step-through on the armed
  eye; the smoke publishes whether the cap binds).
* **Horizon:** `W = 10 s` (the certified P0b concede horizon, the P1c pin).
* **Admission:** a fork tuple is EXCLUDED iff ANY branch ENDED inside `W`
  (truncated horizon); exclusions published, never pooled.
* **X-FORK-IDENT (HARD, 100 %):** an independent plain clone stepped `W` is
  byte-identical to branch NONE (zero leakage).
* **One-sided by design** (contract §4: "over the P1c machinery"). The
  both-sides form is the S2-P3 battery's business.

---

## §4 — ⭐ THE FROZEN GATE (frozen ex ante; the smoke may NOT inform it)

All contrasts are **paired per-fork deltas**, match-cluster bootstrap
(`BOOTSTRAP_SEED = 101403`, `B = 2000`, cluster = match seed, #20).

```text
PRIMARY (the H-157c discriminator)
  dupRun( spread − uniform )  CI UPPER < 0
    ⇒ heterogeneity at MATCHED dose resolvedly REDUCES same-job duplication.

NON-INFERIORITY (the certified currency must not be sold)
  deep( spread − uniform )  CI UPPER <  margin_deep
  box ( spread − uniform )  CI UPPER <  margin_box
    margin_limb = fraction_limb × | Δ_limb( uniform − none ) |   (same forks, this run)
    fraction_deep = 1 − 0.2440/0.7395 = 0.6700
    fraction_box  = 1 − 0.275 /0.380  = 0.2763

PASS := PRIMARY ∧ deep-NI ∧ box-NI          (flags never gate)
```

**Where every number comes from.** `0.7395` and `0.2440` are the slice-1
CERTIFIED deep price and the CI bound nearest zero (**#154**, PRIOR−R3p, per set);
`0.380` and `0.275` are the same pair for box entries (**#154**). The ratio
`|near-zero bound| / |point|` is the share of the price slice 1 could actually
CERTIFY (deep 33.00 %, box 72.37 %); the frozen margin is the complement — **the
give-back slice 1 never certified**. In plain football: *spread must keep at
least as much of the agreement's defensive gain as slice 1 could actually prove
for that currency.* The margin is scaled by the UNIFORM arm's own benefit in THIS
run because the units here are per-fork 10-second windows, not per-set totals —
no slice-1 number is transplanted across units.

**DEGENERACY, declared ex ante.** If `Δ_limb(uniform − none)` is NOT resolvedly
negative (CI upper < 0), that limb's margin is **UNDEFINED**, the leg reads
**UNRESOLVED and FAILS**, and the stage NOT-ADVANCEs (an honest attainability
failure, never re-cut).

**Pre-laid readings (contract §6):**

| condition | disposition |
| --- | --- |
| PRIMARY ∧ both NI legs | **PASS** — H-157c SUPPORTED; the arc proceeds to S2-P2 on commander review |
| PRIMARY fails | **NOT-ADVANCE, F-S2a** — heterogeneity does not move dupRun ⇒ H-157c recorded WRONG; return to the commander (named alternative: the punish-compactness substrate) |
| PRIMARY holds, an NI leg fails/UNRESOLVED | **NOT-ADVANCE, F-S2b** — the look-vs-value fork RETURNS TO THE USER |
| any X-family gate fails | **FAIL** — measurement invalid, stop at the commander |
| the offside FLAG fires | the axis RETURNS TO THE USER (**F-S2d**) — it never flips PASS/FAIL |

No re-cutting after sight (I-A6). A Simpson-genre exhibit is N/A for the gate
(single paired contrast, no pooling); fork context (`own/mid/their`) is published
as a population readout only.

---

## §5 — INSTRUMENTS (⭐ = gating; everything else DESCRIPTIVE / REPORTED)

Every counter is a **window delta** on the granted side `d`, per fork, per branch.

```text
⭐ dupRun          teammate pairs < 4 m, sampled at 6 Hz over the 10 s window (battery I6)  — PRIMARY
⭐ deep entries    the P1 calibration detector VERBATIM (opponent → own third)              — NON-INFERIORITY
⭐ box entries     the P1 box detector (opponent → own box)                                 — NON-INFERIORITY
   spacing        mean nearest-teammate distance (m), same 6 Hz samples                    — DESCRIPTIVE (#152)
   restartTicks   ticks in a restart state (the AGGREGATE proxy, #157 obs +29 %)           — DESCRIPTIVE
⭐ FOUL COUNTER    ⭐ the contract §5 gap-#1 debt, BUILT HERE: foul-born restarts =
                  window Δ fouls (BOTH sides — every foul hands over a free kick or a
                  penalty), with `foulsByD` and `penaltyRestarts` reported separately,
                  so 犯规 is finally separable from every other restart                     — DESCRIPTIVE
   offsides       window Δ offsides (both sides)                                           — DESCRIPTIVE + ⭐FLAG
   thirdMan       window Δ completed third-man releases (side d)                           — REPORTED (E4)
   overlaps       window Δ completed overlap releases (side d)                             — REPORTED (E4)
   forwardShare   window Δ passesForward / Δ passes (attempts; ∈ [0,1])                    — REPORTED (E4)
   chainGain      window gain in bestPassChain (a running per-match max ⇒ one-sided)       — REPORTED (E4)
```

**⭐ THE FROZEN OFFSIDE FLAG (contract §5).** `offsideFlagged := ` the paired
`spread − uniform` offside contrast **RESOLVES** (CI lower > 0) **AND** its CI
lower exceeds **1.0 × the uniform arm's own per-fork offside level** — i.e. the
spread arm produces **at least DOUBLE** the uniform arm's offsides. Source of the
threshold: **#157** (the user's eye caught a level ≈2× production) + the **#152.4
restart-flag doubling idiom** (P3′ flagged at double the seen cost). It is
**never gating**; a fired flag returns the axis to the USER (F-S2d), because the
offside axis 乙 hangs unworked by #158.

**Observability note (no telemetry added).** Every §5 counter is derived
probe-side from the match's own PUBLIC ledgers (`TeamMatchStats`: `fouls`,
`penalties`, `offsides`, `thirdMan`, `overlaps`, `passes`, `passesForward`,
`bestPassChain`) plus the published detector geometry. **No read-only telemetry
export was needed and no sim behaviour was touched.**

---

## §6 — SIZING BEFORE FLOORS (the smoke → the frozen N)

**The smoke (labelled, NON-GATING, disjoint):** 40 matches @ `12,237,000 + k`,
the full five-arm fork, X-DET double-run, its own JSON path. It publishes the
fork populations + cap binding, the per-arm LEVELS of every instrument, the
primary contrast σ̂, the per-match wall INCLUDING arms, and the frozen N
arithmetic. **No gate leg is read at the smoke.**

**⭐ THE MDL, DERIVATION FLAGGED.**

```text
MDL     = min( 0.5 · |dupRun(spread − uniform) smoke point| ,  MDL_ABS )
MDL_ABS = 0.078 × (the UNIFORM arm's own dup-run level)
```

`0.078` is the **#157** duplication cost (dupRun **+7.8 %** on PRIOR−R3p, the
forensic corroboration of the user's verdict): the census must be able to resolve
a **full cure of the damage the user actually saw**. The `0.5·|point|` guard
stops smoke noise from INFLATING the MDL. Named before any seed ran.

**The frozen N rule.** `SE_N = σ̂·√(1/N)`; resolve at ~95 % power ⇒
`SE_N ≤ MDL / POWER_Z`, `POWER_Z = 3.605 = z.975 + z.95`; `N* =` the smallest
**200-step** N meeting it, **capped at N_MAX**. `N_MAX` = the largest 200-step N
whose projected wall (`N × per-match wall × 2` for X-DET) ≤ **12 h**, hard-capped
at **N_CAP = 8,000** (which keeps the census band ≤ 12,247,999, inside the pool).
If `N* > N_MAX` the reduced-power disclosure is recorded BEFORE the gate-bearing
run (no optional stopping, #105.4).

### 6.1 THE SMOKE RESULT (RAN — sizing only; the numbers below never touch §4)

JSON: [`data/a4-s2p1-vector-census-sizing-smoke.json`](data/a4-s2p1-vector-census-sizing-smoke.json)
(`sha256 50e263d0243c…`; every hard gate true — `xDet`, `xForkIdent` 480/480,
`xMergeIdent`, `priorEquivalence`, `eNonStation`, `xFpProd`, `seedDisjoint`).

```text
matches            40 @ 12,237,000..12,237,039        (both X-DET passes byte-identical)
forks admitted     480  (12/match — the cap BINDS; 1,607 qualifying moments skipped; ended-drops 0)
fork contexts      own 151 · mid 226 · their 103
eye decisions      38,517                             (the eye is live — not a vacuous arm)
uniform dup-run    53.294 pairs / fork-window         (the MDL_ABS base)
primary point      −0.2354  (dupRun spread − uniform)  ⚠ SMOKE CONTEXT ONLY, never a gate figure
σ̂ (per match)      8.6845
MDL                0.11771  = min( 0.5·|−0.2354| = 0.11771 ,  0.078 × 53.294 = 4.1569 )
                             ⇒ the NOISE GUARD binds, not the #157 floor
⇒ N*               70,800 (uncapped)  ·  N_MAX 8,000  ·  reduced-power disclosure TRUE
per-match wall     1,559.3 ms  ⇒  8,000 × 1.5593 s × 2 (X-DET) = 6.93 h ≤ the 12 h budget
projections at N_MAX   96,000 forks · projected power 0.2273 against the 0.1177 MDL
```

**THE FROZEN-N ARITHMETIC, EXPLICIT:**
`N* = ceil( (POWER_Z·σ̂ / MDL)² / 200 ) × 200 = ceil( (3.605 × 8.6845 / 0.11771)²
/ 200 ) × 200 = ceil( 265.99² / 200 ) × 200 = 70,800`, **capped at `N_MAX =
8,000`** (the seed-budget cap; the wall cap is not binding at 6.93 h) ⇒ **the
census runs at N = 8,000 matches**, seeds `12,240,000 .. 12,247,999`.

**⚠ THE REDUCED-POWER DISCLOSURE, RECORDED BEFORE THE GATE-BEARING RUN (#105.4,
no optional stopping).** The cap BINDS: the frozen rule's `N*` exceeds `N_MAX`, so
the census runs at 8,000 and the primary reads **UNRESOLVED** if it does not
resolve. Two honest readings of that number, both stated ex ante:

* the binding MDL (0.1177) is the **noise guard**, not the pre-named target — the
  smoke's own point estimate landed near zero, and the guard halves it;
* at `N = 8,000` the census resolves any primary effect with
  `|Δ| ≥ POWER_Z·σ̂/√8000 = 3.605 × 8.6845 / 89.44 = 0.350` dup-run pairs per
  fork-window ≈ **0.66 % of the uniform level** — whereas the pre-named #157-scale
  cure (a full **+7.8 %** = 4.157 pairs) is resolvable at `N ≈ 60`. **The census
  is amply powered for the effect this slice exists to detect**; the
  "under-powered" label attaches only to the noise-guard MDL, and the honest
  consequence is that a genuinely microscopic dupRun effect may read UNRESOLVED.
  No criterion is re-cut on that account.

---

## §7 — SEEDS (drawn ONLY from the remaining pool) + disjointness

```text
sizing smoke   12,237,000 + k,  k ∈ 0..39                    (40 matches; RAN)
census         12,240,000 + k,  k ∈ 0..N−1,  N ≤ 8,000       (⇒ ≤ 12,247,999)
stats          bootstrap 101403   ·   reserved 101503 (unused)
bootstrap      2000 resamples (the P1/P1b/P1c/battery form)
```

Both blocks lie strictly inside the **remaining pool `[12,237,000, 12,300,000]`**
(contract §9: the slice-1 reservation is consumed through 12,236,999), the smoke
block ends below the census base (mutually disjoint), and the probe asserts
disjointness (HARD) against EVERY consumed block: P3p-3 smoke `11.150M`, P3p-3
battery `11.2M–11.6M`, A4-P1 `11.700M`/`11.800M`, P1b `11.850M`/`11.900M`, P1c
`11.950M`/`12.000M`, P1d `12.050M`/`12.100M`, P1e `12.150M`/`12.200M–12.207999M`,
A4-P3 `[12.208M, 12.217999M]` (retired in full, #152.4.iii), A4-P3′ smoke
`12.220M` and battery `[12.230M, 12.236999M]`. Stats seeds are the **1014xx**
family, disjoint from every arc stats seed (100403/100503, 101003/101103,
101203/101303).

---

## §8 — GATES TABLE (X-family, frozen)

| gate | class | predicate |
| --- | --- | --- |
| **priorEquivalence** | HARD | every arm's mean obedience over indices 1..5 `= 0.5` exactly and every entry ∈ [0,1]; `VAL_SCALE` recomputed from the SHA-pinned table `= 0.163494`; `homePriorStrength(0.5) = 0.25×VAL_SCALE`; `HOME_MAP_STRENGTH_MAX = 0.5×0.163494` |
| **X-FP-PROD** | HARD | production fingerprint `57b0bdab…c673` unchanged (both seam members null in production) |
| **X-DET** (wall-free, #128) | HARD | two experiment passes byte-identical (wall stripped from the compare); SHA emitted |
| **X-FORK-IDENT** | HARD | branch NONE == an independent plain step-through, on EVERY fork |
| **X-MERGE-IDENT** | HARD | `mergedTableSha == 39662445…9d6105`, `{base,children}` rehash equal, `base` rehash `171a6dad…6559f` |
| **E-NONSTATION** (refined) | HARD | fresh `Match` eye-null; body/team/both scope honoured; the eye ACTIVATES on the R3p world and issues NO fresh override while a body owns the ball |
| **seed disjointness** | HARD | the smoke/census bands inside the remaining pool, mutually disjoint, disjoint from every consumed block (§7) |
| **X-SRC-ZERO** | RE-FORMED | `src/**` IS touched (the vector member + its consumption branch) ⇒ `git diff src` NON-empty BY DESIGN; Road B is proven by the flag-off byte-identity test + X-FP-PROD |

---

## §9 — ROAD B / REGISTERED NON-CLAIMS

* **Nothing ships.** `Match.homeRegionGrant` — BOTH union members — is `null` in
  every production path; `stationEye` is null; every EDS/eye flag dormant; the
  `homePriorObedience` gene born absent; the production fingerprint
  **`57b0bdab…c673` UNTOUCHED** (asserted in the test file and by the probe's
  X-FP-PROD gate).
* **S2-P1 prices VECTOR SHAPES and builds NO GENE.** The per-slot gene family
  (`homePriorObedienceOffset`, M-S2.1) is **S2-P2**; nothing here evolves,
  mutates, crosses over or ships.
* **NO offside-rule change** (乙 hangs by #158): offsides are measured and
  FLAGGED only.
* **NO shipped-default change anywhere** (contract §3 BIRTH NEUTRALITY):
  role-derived content lives ONLY inside these instrument vectors.
* **The proximity block's verdict authority remains the USER's eyes** (#152).
  dupRun is used here as the countable face of 撞车 that contract §1 names the
  discriminator — it is NOT the watchability verdict, which is S2-P4's business.
* **This stage cannot authorize S2-P2.** Only the commander's review of the
  census result can; a null primary records H-157c WRONG (F-S2a).

---

## §10 — BUILD + PREFLIGHT EVIDENCE (this deliverable)

* `npx tsc --noEmit` clean; the full vitest suite green (see the commit message).
* `tests/a4S2VectorGrant.test.ts` (12 assertions) proves: both seam members null
  at birth; **the production fingerprint `57b0bdab…c673` UNCHANGED**; the R3p
  world with the seam null reproduces itself byte-for-byte; the P1c single-body
  member still behaves as before the generalization; **a uniform 0.5 vector is
  BYTE-IDENTICAL to the shipped-form prior** on that side (with an explicit
  NON-VACUITY assertion that both differ from the ungranted world); an all-zero
  vector is exactly inert; the spread vector at MATCHED mean is a different world
  (the discriminator has a lever); side-scoping holds; and the seam is inert with
  `stationEye` null. Birth neutrality is asserted on the born genome.
* A bounded preflight (`A4S2P1_CAP=2 A4S2P1_FORK_CAP=2`, writing OUTSIDE the
  repo) proved the probe executes end-to-end: all five arms construct and
  diverge, X-DET/X-FORK-IDENT/X-MERGE-IDENT/priorEquivalence/E-NONSTATION true,
  every §5 counter populates (fouls, penalties, offsides, third-man, overlaps,
  forward share, chain gain), the N arithmetic evaluates. Scratch deleted.

**FREEZE HONESTY.** Every criterion above cites only already-published sources:
the slice-2 contract (§1–§6, §9), rulings #158 / #157 / #154 / #152 / #150 /
#149 / #148 / #128 / #105.4 / #46.2 / #20 / #49.3, the parent contract's
I-A1..I-A7 and its §4 P1c form, the P1 deep/box detectors, the SHA-pinned P3p-1
merged table (`39662445…9d6105` / `171a6dad…6559f`), the src constants
`HOME_MAP_STRENGTH_MAX` / `homePriorStrength` with their #148 provenance, and the
production fingerprint `57b0bdab…c673`. The sizing smoke informs **N only**; no
gate-bearing figure was read before this freeze, and the census run is a future
authorized step. **This step commits locally and does NOT push.**
