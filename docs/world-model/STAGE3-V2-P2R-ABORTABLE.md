# Stage III V2-P2R — The Abortable Approach

Status: **PRE-REGISTERED 2026-07-30, FROZEN before any implementation of the abort
and before any datum of P2R's own.** Authorized by **ruling #73.2** (v2.1 launched —
THE ABORTABLE APPROACH, the six design constraints) and **#73.4** (the executor
drafts this pre-registration; freeze → review → build → run; sizing before floors),
under **contract amendment v2.1** ([`STAGE3-V2-ANTICIPATORY-EYE.md`](STAGE3-V2-ANTICIPATORY-EYE.md)
§8 — D3-DUPLICATE verbatim). It is **V2-P2 re-run with ONE change**: a new break
rule, D3-DUPLICATE, added to the eye's committed window. It ships **nothing** (Road
B); it **cannot authorize V2-P3**.

**What this is, in one line.** V2-P2 delivered and came back FLAT + convergence-
WRONG-WAY (#72): the eye, seeing others coming, still argmaxed 60.4% of its
deviations into the dead-behind 180° ring — because the committed window was BLIND
(the only break rule was a possession flip; a body that saw a duplicate forming
mid-approach was *forbidden to yield*). The user's reality-check (#73.1) named the
real substrate defect — not decision-simultaneity (at fork grain there is only ONE
deviator, so simultaneity cannot even bite) but the **blind 3-second commitment**.
Real football's first-order anti-pile-up mechanism is continuous mutual visibility
+ cheap aborts: you start, I see you within ~0.3 s, I peel off. V2-P2R gives the eye
exactly that one ability and asks whether the #72 convergence inversion reverses.

Authority:
[`STAGE3-V2-P2-CONSUMER.md`](STAGE3-V2-P2-CONSUMER.md) **IN FULL** (this is that
document re-run with the abort; the harness §2, the estimand §3.1, the disjoint-
block methodology §3.2, the ex-ante geometry §3.3(a), the control recovery §2.4a/
§3.3c, the DEV gate §3.4, the fork-grain mediators §3.4b, the gates §3.5, the
decision/exception classes §4, the full sign space §5, the stop rules §6, the
non-claims §7, and — load-bearing — its §8 RESULT, the #72 numbers this hypothesis
must reverse) ·
[`STAGE3-V2-ANTICIPATORY-EYE.md`](STAGE3-V2-ANTICIPATORY-EYE.md) §8 (the v2.1
amendment, D3-DUPLICATE verbatim) + §2 (the frozen OTHERS-GOING feature the abort
re-reads: R = 4.0 m, W-advance, remembered velocity, ≥1 own outfield teammate) ·
**#73.1** (the corrected diagnosis) · **#73.2** (the six design constraints (i)–(vi)
— this freeze's specification) · **#73.3** (A4 re-parks) · **#72** (the readings
(b)+(h) this reverses) · **#71** (the recovered controls reused, the guard) · #70.3
(the five arms, the paired forks, the disjoint block, DEV on perceived-attainable) ·
#65/#44.5 (sizing before floors) · #46.2 (smoke disjointness) · #24 (population
floors) · #20 (CI / cluster) · #32.1 (per-record fidelity) · #38.1 (full sign space
+ E-INJURY) · #48.4 (windows pinned) · #49.3 (receipts) · #26.5 (HEAD + flags) ·
Road B (nothing ships).

**World / HEAD.** Every arm runs the **ENRICHED** world (#67.3, the full certified
bundle: `edsPerceivedDefence`, `edsPerceivedChoice`, `edsValueAxis`, `c5Hold`,
`c6Carry`, `c7Windup` armed; `c5TouchFork` off) — the same world the table was
censused on and V2-P2 ran on (#26.5). HEAD = `c5f2913` (ruling #68), `src/**`
byte-identical to V2-P0 HEAD `92876e5` **plus the one D3-DUPLICATE change** (§THE ONE
CHANGE, added at build). Every production flag defaults OFF; the eye is null in every
production path; the fingerprint is unchanged (X1).

**Byte-identical reused inputs (SHAs quoted, re-cut of NONE):**

```text
consumed table   docs/world-model/data/stage3-v2-p1-anticipatory-table.json
                 canonical tableSha  a33e9a73…0992aa   file sha256  3ed25d6f…c967
recovered ctrl   docs/world-model/data/stage3-v2-p2-control-recovery.json
                 sha256  8bac58da804a887f843f33b82f3813ca1bc3ed676a1ed1ffcb262936e0cfebcf
                 (§2.4a recovery, guard PASS #71.2; per-(context × going-bit) levels)
```

The table, the recovered control, the resolved-negative / resolved-positive cell
sets, the §3.3(a) frozen geometry prediction — **all reused unchanged.** The abort
changes only what happens INSIDE a committed window; it changes neither the argmax
selection at the decision instant nor the ex-ante deviation prediction. This is the
same eye as V2-P2 with one added break rule, measured out of sample on a fresh block.

---

## 1. THE ONE CHANGE — D3-DUPLICATE, specified exactly (#73.2(i)–(iii))

V2-P2's committed window (V2-P2-CONSUMER §2.2) had exactly two break rules: window
expiry at `untilTick` (D1 re-decision), and D2 — a perceived possession FACE flip.
V2-P2R adds a **third**, and only inside the **eye's arms** (CONTROL untouched, so PC
still isolates the pricing — #73.2(iii)):

> **D3-DUPLICATE.** At the body's **own decision cadence** during a committed
> **deviation** window (`state.offset ≠ null`, an override to candidate X\* is live),
> re-read the body's OWN percept and recompute the **going-contributor set** for the
> committed target region. If that set now contains a teammate identity **other than
> at commit time**, the override **lapses** and the incumbent resumes for the
> remainder of the window. Wasted ticks are never refunded (#73.2(i)).

### 1.1 The commit-time going-contributor set (recorded at the deviation)

When the eye issues a deviation to candidate X\* (ball-local offset `o* = (dx*, dy*)`),
in addition to the V2-P2 window state it records the **commit-time contributor set**:

```text
p*_commit = ball_commit + attackDir · o*                 (the chosen region's point)
G_commit  = { teammate identity j :
                j ∈ the body's OWN percept at commit  (NEUTRAL/GENE/INVERTED),
                              OR the TRUE team          (ORACLE-CTX, §2.5),
                j ≠ self, j ≠ GK, j carries a remembered fix,
                j's remembered-velocity-advanced position (advance W = 3.0 s)
                    lands within R = 4.0 m of p*_commit }
```

`G_commit` is a set of **perceived teammate gids** (TRUE gids for ORACLE). It is
exactly the identities that made the chosen candidate's OTHERS-GOING bit what it was
at the decision — including, when the eye deliberately chose a **going=1** support
cell, the teammate(s) the eye chose to support. (§8 SMOKE: **63.4%** of deviations
chose a candidate that was ALREADY going=1 at commit, so `G_commit` is non-empty most
of the time — the set-difference below is what makes the abort correct rather than
trigger-happy.)

### 1.2 The mid-window re-read and the abort predicate

At each tick on the body's **decision cadence** (`AI_INTERVAL = 0.15 s`, i.e. every
`round(0.15 / DT) = 9` ticks) while the window is still alive, the eye pulls its OWN
snapshot again (naturally warm on the decision clock — no truth, no communication, the
PULL semantics #13.3; a body that never looks never aborts and pays for it, #73.2(ii)),
and recomputes:

```text
p*_mid = ball_now + attackDir · o*         (o* FIXED; the ball has moved, so does R's
                                            centre — the region tracks the ball, as at
                                            commit)
G_mid  = { teammate identity j (same percept rule) : j's advanced position lands
             within R = 4.0 m of p*_mid }

ABORT  ⇔  ( G_mid \ G_commit ) ≠ ∅
```

**"Other than at commit time" is the SET DIFFERENCE over perceived teammate
identities.** The abort fires iff there EXISTS a teammate gid going into the committed
region NOW who was NOT in the commit-time contributor set — a genuinely NEW converging
body, i.e. a duplicate FORMING mid-window. It does **not** fire merely because the
bit reads 1 (a going=1 cell the eye chose to support keeps its commit-time
contributors in `G_commit`, excluded by the difference), and it does **not** fire when
the same commit-time teammate is still going (`G_mid ⊆ G_commit`). This is the precise
reading of #73.2(i) "reads 1 from a teammate OTHER than at commit time", and it is
faithful to the fork-grain object (#73.2(iv)): the chooser starts, an incumbent
teammate converges, the chooser sees the NEW arrival and yields.

### 1.3 What happens after an abort — remainder of the window

On an abort the override lapses **without refunding the clock or re-deciding**: the
window state is rewritten to the **incumbent-committed** form (`offset = null`,
`candidateId = 'control'`) **retaining the SAME `untilTick`**. Concretely, for the rest
of the frozen window:

* the **incumbent runs** (the body reverts to its native station action — the same
  thing CONTROL does);
* the window clock is **neither reset nor extended** (the ticks already spent chasing
  X\* are the honest, unrefunded price #73.2(i));
* no new decision fires until `untilTick`; at `untilTick` the normal D1 re-decision
  fires as in V2-P2 (the eye may deviate again on fresh evidence);
* **the fork is still scored over the full frozen horizons** (`H_score = 6.0 s`,
  `H_concede = 10.0 s`). The abort is **part of the treatment, not an exclusion**: a
  deviate-then-abort window is one realised trajectory of the abortable approach, and
  it contributes its VALUE to the paired ATE exactly like any other deviation.

### 1.4 Where it slots in (the build's one edit; NOT implemented this session)

The change is confined to the eye's window-maintenance seam
(`src/ai/actionExecutor.ts`, the `match.stationEye` block, between the D2 face-flip
check and the D1 `state === undefined && isStation` first-decision branch) plus the
window-state record (`Match.stationEyeState` gains a `committedGoingContributors:
Set<number>` field, written on a deviation, empty for incumbent windows). At each
maintenance tick with a **live deviation window** on the body's cadence, recompute
`G_mid` from a fresh percept and, if `G_mid \ G_commit ≠ ∅`, rewrite the state to
incumbent-hold (same `untilTick`) and count a **D-ABORT** (§THE ABORT LEDGER). The
abort is armed for `arm ∈ {neutral, gene, oracleCtx, inverted}`; CONTROL has no eye
state and is untouched. `goingBits` (which returns only a 0/1 bit) is supplemented at
the seam by an identity-returning contributor scan (the same geometry, tracking gids)
so `G_commit`/`G_mid` carry identities. **No other behaviour changes**; flag-off is
bit-identical (X1/X2); ORACLE-CTX stays probe-only and unreachable (X3).

---

## 2. THE PRE-NAMED HYPOTHESIS (#73.2(v), verbatim)

Fixed here before any code and before any P2R datum:

> **H-V2R** — with D3-DUPLICATE, **FORK-DUPRUN on negative cells FALLS** (CI excluding
> zero, the #72 inversion reversed) and **FORK-SPACING stops closing**, while the
> **payoff does not degrade** (ATE not resolved-negative); abort rate and wasted-tick
> cost REPORTED with the full decision ledger. **Primary = the convergence signature;
> payoff secondary.**

**The #72 numbers this must reverse** (V2-P2-CONSUMER §8.3, the frozen prior;
NEUTRAL − CONTROL, paired, cluster CIs):

```text
                     V2-P2 realised (#72)              H-V2R requires
FORK-DUPRUN  neg     +0.92 pp  [+0.35, +1.54]  ROSE    FALLS, CI upper < 0
FORK-SPACING all     −1.047 m  [−1.221, −0.870] CLOSED  stops closing (CI reaches ≥ 0)
             neg     −0.880 m  [−1.088, −0.679] CLOSED  stops closing on neg cells
ATE (NEUTRAL)        +0.006    [−0.001, +0.014] FLAT    not resolved-negative (CI upper ≥ 0)
DEV                  61.56% (23,912/38,841)             ≥ 0.22 (delivery HARD gate holds)
ring180Share         0.6039  (predicted ~0.51)          FALLS toward the geometry (reported)
```

Primary success is the **convergence signature** (FORK-DUPRUN neg falling with CI
excluding zero + FORK-SPACING no longer closing). The payoff is **secondary**: H-V2R
does not require the ATE to turn positive, only that abortability does not resolve it
NEGATIVE (does not destroy the treatment). ATE / ATT / the mediators are reported with
cluster bootstrap CIs (cluster = match seed, #20); the two HARD gates stay DEV and PC.

---

## 3. THE FULL SIGN SPACE (#38.1) — each with disposition

Written before the run; none may be re-cut after sight. The V2-P2 readings (§5 of the
parent: (b) FLAT, (c) NEGATIVE, (d) UNDELIVERED, (e) NOISE, (f) SPLIT, (g) PERCEPTION
PRICE) all still apply to the payoff axes and are inherited verbatim; the readings
BELOW are the convergence-primary dispositions this stage exists to resolve.

* **(R1) REVERSAL — the design case.** FORK-DUPRUN on negative cells FALLS (CI upper
  < 0), FORK-SPACING stops closing (its CI reaches ≥ 0 or turns positive), and the ATE
  is not resolved-negative (CI upper ≥ 0). The #72 convergence inversion is reversed:
  cheap aborts disperse the pile-up that a lagged going-bit alone could not. H-V2R
  holds. **Disposition:** the anti-pile-up mechanism is real at fork grain and
  **V2-P3 becomes DISCUSSABLE** — but NOT authorized here (§NON-CLAIMS; deployment +
  the mirror problem + the I4 R3-iteration are V2-P3's, and this fork-grain result is
  a necessary not a sufficient condition). The fork returns to the commander.

* **(R2) NO-CHANGE — the abort is inert.** The mediators land ≈ V2-P2 (FORK-DUPRUN neg
  CI still contains 0 or stays positive; FORK-SPACING still closes). Two mechanisms,
  **decomposed via the abort ledger**: (a) aborts **fire rarely** — the natural-rate
  abort-opportunity is low, or the eye's chosen cells already had their contributor at
  commit so no NEW one forms (`G_mid \ G_commit` stays empty); (b) duplicates form
  **after the last within-window check** — the new contributor arrives past the final
  decision-cadence re-read (time-to-abort mass at the window tail). The ledger's abort
  rate, time-to-abort distribution and the SMOKE's abort-opportunity rate distinguish
  these ex ante. **Disposition:** a finding that abortability at this cadence/window is
  insufficient — banked; the fork returns to the commander (A4 second-order, or a
  cadence/window redesign, is the commander's call, never re-cut here).

* **(R3) OVER-ABORT — abortability destroys the treatment.** The eye yields so often
  that either DEV **collapses below 0.22** on the perceived-attainable denominator
  (⇒ reading (d) UNDELIVERED, the payoff not interpreted — the labelled-data
  convention #44.3) **or** the payoff **resolves negative** (ATE CI upper < 0, reading
  (c)). Abortability is not free: peeling off too eagerly strands the eye between the
  incumbent and an abandoned approach. **Disposition:** a REAL finding worth the cost —
  the abortable approach as specified over-corrects; banked, the fork returns to the
  commander. (Note the DEV subtlety §DEV: a deviation that LATER aborts still counts as
  delivered treatment, so DEV collapse under (R3) means the eye stopped *committing*,
  not that it aborted — the abort ledger separates the two.)

* **(R4) MIRROR-PREVIEW — reported in every branch.** At fork grain only the chooser
  deviates, so the true mirror problem (both bodies yield, the region goes unserved)
  **cannot bite here** — it is V2-P3's, pre-named (#73.2(iv)). But we REPORT its
  fork-grain shadow: of the windows where the eye ABORTED, how often the yielded region
  went **unserved** for the remainder of the window (no own teammate — neither the
  incumbent nor the new contributor — actually occupied it within R over the rest of
  the horizon). A high unserved-share is a **preview** of the mirror risk V2-P3 must
  gate; it is reported, not a verdict here.

**Interaction with the payoff readings.** Primary is convergence, so R1–R3 are decided
on the mediators first; the parent's (b)/(c)/(g) then classify the payoff within R1/R2
(the ORACLE − NEUTRAL perception price is reported in every branch, §5(g)). A convergence
REVERSAL with a still-FLAT payoff is R1 (H-V2R's payoff clause only forbids
resolved-negative); a convergence reversal with a NEGATIVE payoff is R3 (over-abort).

---

## 4. THE ABORT LEDGER (mandatory, #49.3 receipts)

A new decision class **D-ABORT** joins the V2-P2 set (§4 of the parent), and a per-
window abort ledger is emitted. The decision classes are extended and remain mutually
exclusive, summing to the decision count:

```text
D-DEVIATE          an override was issued (counts as DELIVERED treatment — see §DEV,
                   whether or not it later aborts)
  └ of which D-ABORT   the override later LAPSED via D3-DUPLICATE (a sub-tally of
                       D-DEVIATE windows, NOT a separate denominator slice)
E-ABSTAIN-UNSEEN   percept carried no priceable owner (the two repairs → NEVER-SAW residual)
E-NOCELL           no eligible in-power candidate in the perceived cell
E-TIE              best advantage ≤ 0 — the eye chose the incumbent
E-NONSTATION       the body left the station family mid-window
```

**Ledger quantities (REPORTED, per §49.3 with `seed, tick, gid, cause`):**

```text
per-window abort RATE          D-ABORT / D-DEVIATE (share of deviation windows that aborted)
time-to-abort distribution     ticks from commit to the abort (p50 / p90 / min / max;
                               seconds); the mass vs the window tail (the (R2)(b) decomposer)
wasted-tick cost               ticks spent on the aborted approach before the lapse, summed
                               and per-window mean (the honest price #73.2(i), never refunded)
going-contributor identity     |G_commit|, |G_mid| at abort, |G_mid \ G_commit| (new
churn                          contributors), and how many DISTINCT identities drove aborts
post-abort incumbent behavior  after the lapse: did the incumbent re-occupy or vacate the
                               region; the yielded-region unserved-share (§3 R4 mirror-preview)
per-arm                        the ledger split by arm (NEUTRAL primary; GENE / ORACLE /
                               INVERTED) — ORACLE aborts on TRUE contributors, the wedge on
                               the abort itself
```

Receipts capped per class (`RECEIPT_CAP`, V2-P2 verbatim); `unexplained = 0` across all
classified ticks (the X6 discipline, §5).

---

## 5. THE GATES (V2-P2 §3.5 verbatim, plus the abort's determinism)

Every gate is powered ex ante; none is a max-statistic; each decision rule covers the
full sign space (§3 + the parent §5).

| gate | predicate |
| --- | --- |
| **X1** | eye null: `npm run fingerprint` unchanged (D3-DUPLICATE adds no live caller) |
| **X2** | eye null: byte-identical world signatures to pre-change HEAD, 3 league seeds × 2 seasons |
| **X3** | a test asserts: the eye is read in one place, null on a fresh `Match`+`League`, unreachable from the E4 preview, ORACLE-CTX unreachable from any production path; **and D3-DUPLICATE never fires when `stationEye === null`** (the abort is inside the eye's arms only) |
| **X4** | **CLONE COVERAGE = 100%** of sampled moments |
| **X5** | **CONTROL-FORK IDENTITY** — the no-eye fork reproduces the base continuation bit-identically for the full `H_concede`, per record, unexplained exactly 0 (CONTROL carries no abort) |
| **X6** | **FORCE FIDELITY — per-record (#43.3).** On live override ticks applied target = engine `meet` to 1e-9, unexplained exactly 0; ok-share + clamp shares REPORTED. **Abort ticks (incumbent-hold) are NOT override ticks** and are excluded from the X6 override tally, counted in the ledger instead |
| **X7** | two `runExperiment()` calls byte-identical; result SHA emitted. The reused control-recovery pass is byte-identical to the committed `8bac58da…` (NOT re-run; asserted equal) |
| **DEV** | **DELIVERY (HARD)** — NEUTRAL deviation share (D-DEVIATE, incl. later-aborted) on the PERCEIVED-attainable denominator ≥ **0.22**. Below it ⇒ reading (d), no payoff interpreted |
| **PC** | **INVERTED resolves BELOW control (HARD)**, pooled, 95% cluster-bootstrap CI upper **< 0** |

Payoff axes (ATE, ATT, ORACLE−NEUTRAL, the §3.4b mediators) reported with cluster
bootstrap CIs; the two HARD gates are DEV and PC. **Standing exception classes (#38.1),
per-record receipts (#49.3):** paused · carrier · ball won · sent off · onside clamp ·
barred box · match ended · E-INJURY; all checked, `unexplained` = 0.

---

## 6. DEV — the floor, and how aborts count (#65 in gate form)

**The floor VALUE is v1's 0.22 carried unchanged; the denominator is #70.3's
perceived-attainable population (V2-P2 §3.4, verbatim).** The pre-stated abort
accounting:

> **A deviation that later aborts STILL COUNTS as delivered treatment for DEV.** DEV's
> numerator is the D-DEVIATE share — decisions where the eye ISSUED an override at the
> decision instant — regardless of whether D3-DUPLICATE later lapses that window. The
> **abort RATE is its own reported quantity** (§THE ABORT LEDGER), never a deduction
> from DEV.

**Justification against #65's spirit.** #65 forbids reading a payoff off treatment that
was **never delivered** — the v1 P2 DEV killer was structural abstention (no percept /
no cell), decisions where the eye never engaged at all. The abortable approach IS the
treatment here: a window that deviated, chased X\* for some ticks, then yielded on a
newly-seen duplicate is a **fully realised trajectory of that treatment** — the body
committed, moved, and peeled off, and that entire arc is what V2-P2R prices against
CONTROL. Delivery is "did the eye engage and act", and a deviate-then-abort window did.
Folding aborts OUT of DEV would mislabel a delivered-and-yielded treatment as
undelivered and hand reading (d) a false trigger. (This is also why an OVER-ABORT
DEV-collapse, §3 R3, would mean the eye stopped *committing* — not that it aborted; the
ledger separates the two, and the #65 checkpoint below binds on the committing rate.)

**Registered #65 checkpoint.** The perceived deviation (committing) rate is recomputed
at build against the reused per-context recovered control (the committed
`8bac58da…`); it is UNCHANGED from V2-P2's, because the abort does not touch the argmax
at the decision instant — V2-P2 realised **0.6156** (23,912 / 38,841), **≈ 2.8× the
0.22 floor**, and the build-time recomputed prediction was **0.6194**. If the recomputed
committing rate falls below 0.22 ex ante, reading (d) fires at build and the payoff run
does NOT start (#65 discipline, the last ex-ante gate). It does not — the committing
rate is the V2-P2 rate — so the run is cleared on this axis; the OPEN question is whether
aborts pull the *realised* delivery down, which the run measures.

---

## 7. STAGING, frozen

Same harness (`scripts/probes/stage3-v2-p2-consumer.ts`, extended by the build with the
D3-DUPLICATE seam and the ledger); a **fresh disjoint block above 9.0M**; same moment
budget, same bootstrap discipline with a fresh frozen seed; windows pinned (#48.4).

**The seed walk (why above 9.0M).** V2-P1 census consumed **8.81M** (`8,810,000 + k`);
the v1/v2 smokes sat at **8.80M**; V2-P2's sizing smoke consumed **8.90M**
(`8,900,000 .. 8,900,149`) and V2-P2's payoff block consumed **8.91M** (`8,910,000 + k`,
through `8,910,159` at the 160-cap). Every V2-family seed at or below `8,910,159` is
spent. V2-P2R therefore opens a **fresh disjoint block above 9.0M** (#46.2), disjoint
from all of it and self-disjoint (smoke below the payoff block):

| item | value |
| --- | --- |
| **HEAD / world** | `c5f2913` (ruling #68); ENRICHED, full #67.3 bundle; `src/**` = V2-P0 HEAD `92876e5` **+ D3-DUPLICATE** (§1.4). The consumer world = the census world (#26.5). |
| **consumed table** | `data/stage3-v2-p1-anticipatory-table.json`, canonical `tableSha` **`a33e9a73…0992aa`** (file sha256 `3ed25d6f…c967`); injected by the probe, never bundled. Reused byte-identical. |
| **control recovery** | `data/stage3-v2-p2-control-recovery.json`, sha256 **`8bac58da…ebcf`**; the §2.4a per-(context × going-bit) levels. Reused byte-identical, NOT re-run (guard PASS #71.2 stands). |
| **sizing smoke** | seeds **9,000,000 .. 9,000,149** (150 matches); read-only, forks no counterfactual, prices no payoff; committed with this doc; `data/stage3-v2-p2r-sizing.json`, SHA **`92baf8e9…`**. Disjoint above 9.0M and from the payoff block (#46.2). Measures the ABORT-OPPORTUNITY rate (§8). |
| **payoff block** | seeds **9,010,000 + k** (single contiguous block, `k ∈ 0..159`, **160-match cap**); the run stops at the frozen **12,000-moment** budget (≈ 152 matches at 79.05 moments/match — the smoke-confirmed rate — ~5% margin). Disjoint from the smoke (9.00M) and above every consumed/reserved V2 range (≤ 8.91M). |
| **moments** | **12,000**, station-family population only, stable rotation on player index, side-alternating, ≥ 2.0 s apart (V2-P2 §3.6 verbatim). |
| **arms** | per moment: **CONTROL + NEUTRAL + GENE + ORACLE-CTX + INVERTED** = 5 forks from the same pre-step clone (**60,000 forks**); the abort armed on the four eye arms, CONTROL untouched. |
| **W / H / R / cadence** | W = 3.0 s; H_score = 6.0 s; H_concede = 10.0 s; R = 4.0 m; warm-up 15 ticks; abort re-read cadence `AI_INTERVAL = 0.15 s` (9 ticks); window 180 ticks (#48.4, all pinned). |
| **cluster unit** | the match seed (#20). |
| **bootstrap** | 2,000 cluster resamples, **fresh frozen seed 90730** (V2-P2 used 50070; a fresh disjoint seed for the fresh block). |
| **output** | per-arm pooled + per-context results + all §3.4b mediators + the §THE ABORT LEDGER, committed under `docs/world-model/data/stage3-v2-p2r-consumer.json`, canonical + file SHA emitted. |

**Moment budget justified by V2-P2's realised power.** V2-P2 hit half-widths ≈ 0.0073
on the NEUTRAL ATE at 12,000 moments (CI [−0.0011, +0.0136]), inside the registered
MDE half-width ≤ 0.009; and the §8.3 mediators resolved with tight CIs (FORK-DUPRUN neg
[+0.35, +1.54] pp, FORK-SPACING [−1.221, −0.870] m). 12,000 moments powered the exact
quantities H-V2R must reverse, so the budget is carried unchanged — no re-sizing on a
mediator we already have a 12,000-moment CI for.

### 8. THE SIZING SMOKE RESULT (read-only, committed with this doc)

Ran twice byte-identical (`deterministic: true`), zero `src/**` touched, forks no
counterfactual and prices no payoff — the eye's choice is **computed but never
applied**, so the continuation is the NATURAL null-eye trajectory and the measured rate
is the **natural-rate** abort opportunity (the quantity the NO-CHANGE reading (R2)
needs ex ante). Seeds **9,000,000 .. 9,000,149**, 150 matches, ENRICHED world, HEAD
`c5f2913`; consumed table `a33e9a73…`, control `8bac58da…`; output SHA **`92baf8e9…`**.

```text
moments / match                     79.053          (transfers: V2-P0 79.11, V2-P2 79.107)
percept exists (hasPercept)         94.61%          (matches V2-P2's 94.67% percept availability)
perceived-attainable (LOWER bound)  30.77%          see note — no in-flight ledger in a one-shot smoke

dry-run NEUTRAL deviations          2,274 windows   (the committed windows the abort could act in)
  chose an ALREADY-going=1 cell     63.37%          → G_commit non-empty; the set-difference matters
windows reaching an alive re-read   2,205
ABORT-OPPORTUNITY (new contributor forms mid-window, at NATURAL rates):
  per deviation window              42.04%   (956 / 2,274)   ← the headline ex-ante rate
  per alive window                  43.36%   (956 / 2,205)
  new contributors per opportunity  1.42
  time-to-first-opportunity         p50 36 ticks (0.60 s) · p90 126 ticks (2.10 s) · min 9 · max 180
```

**Reading for the freeze.** ~**42% of natural-rate deviation windows see a NEW going-
contributor form mid-window** — the abort has ample opportunity to bite, so the
NO-CHANGE reading (R2) is NOT the a-priori-forced outcome; if the mediators come back
flat, R2(b) (opportunity present but the eye argmaxes back in / re-deviates) must be
decomposed from R2(a) (rare opportunity), and the ledger's realised abort rate vs this
42% opportunity rate is exactly that decomposition. The **p50 time-to-opportunity of
0.60 s** echoes the user's "I see you within ~0.3 s, I peel off" and the programme's
pure-evidence response window (≈ 0.3–0.5 s) — new duplicates declare themselves early,
well inside the 3 s window, so a decision-cadence re-read can catch them. The **63.4%
already-going-at-commit** share confirms the V2-P2 pathology (the eye picks cells a
teammate is already heading for) and validates the set-difference framing: without
excluding `G_commit`, the abort would fire spuriously on 63% of windows at commit; the
difference restricts it to genuine mid-window arrivals.

> **NOTE on the 30.77% perceived-attainable.** This is a **LOWER bound**, below V2-P2's
> 94.67%, because a one-shot smoke read has **no in-flight FACE ledger** — repair 1
> (V2-P2 §2.3, the last-perceived-owner retention that recovers the ~60% in-flight
> no-owner ticks) needs the per-body decision-history the payoff run carries and a
> single clone read does not. Percept-honesty is preserved (no truth fallback: the true
> owner is NOT smuggled in as the retained owner). The binding DEV denominator is
> re-measured WITH the ledger in the payoff run; V2-P2 realised 94.67% attainable /
> 61.56% delivered there, and V2-P2R inherits that machinery unchanged. The smoke's job
> here is the abort-opportunity rate, which does not depend on the retention repair (it
> is measured on windows that DID deviate, i.e. had a priceable percept).

---

## 9. Stop rules (V2-P2 §6, plus the abort)

* **Any X gate fails ⇒ FAIL.** X5 especially (a fork that cannot reproduce its own
  control is not a counterfactual); X3's abort-null assertion (D3-DUPLICATE must never
  fire with `stationEye === null`).
* **PC fails ⇒ FAIL**, no payoff reading published.
* **DEV fails ⇒ UNDELIVERED** (reading (d)); payoff published as labelled data, not
  interpreted (#44.3). Under the abort, a DEV collapse is an OVER-ABORT candidate (R3) —
  the ledger's committing-vs-aborting split classifies it.
* **No re-cutting after sight**: not W, not the horizons, not the lattice, not the
  contexts, not the 150 in-power floor, not the 0.22 DEV floor, not the arms, not §2's
  hypothesis, not §3's readings, not the §3.3(a) geometry (parent), **not the abort
  predicate** (the set-difference, the cadence, the same-`untilTick` incumbent-hold),
  **not the abort's decision-cadence re-read cadence** (`AI_INTERVAL`).
* **The population law (#26.5)**: if any live substrate change lands before V2-P2R runs,
  the V2-P1 table is stale and the stage stops at the commander; V2-P2R states the HEAD
  it ran at and its armed flags.
* **V2-P2R ships nothing** (Road B): `Match.stationEye` stays null in every production
  path; the fingerprint is unchanged; the table is data, the abort is behaviour behind
  the null eye.

---

## 10. Registered NON-CLAIMS

* **Nothing ships.** V2-P2R changes no live behaviour and makes no shipping claim; the
  eye and the abort are null in every production path.
* **V2-P2R CANNOT authorize V2-P3.** A convergence REVERSAL (R1) makes V2-P3
  *discussable*, nothing more: deployment (the adoption ladder, the canaries + DEGEN
  battery, the ONE I4 R3-iteration, the enriched-world re-baselined instruments) is
  V2-P3's object, HARD-gated there, and a fork-grain reversal here is a **necessary not
  a sufficient** condition. The fork returns to the commander in every branch.
* **The MIRROR problem is V2-P3's** (#73.2(iv)). At fork grain only the chooser
  deviates, so mutual-yield cannot arise; V2-P2R reports only its shadow (§3 R4). No
  deployment-grain claim about unserved regions is built here.
* **A4 stays PARKED** (#73.3): its original rationale stands ("the latency seat binds
  only against live coordination"); it remains the named SECOND-ORDER mechanism if
  abortability alone cannot disperse the pile-up (a route the (R2)/(R3) dispositions
  point back toward), but it is not invoked by this stage.
* **Approach semantics only (#41.2)**: every number is the value of committing a window
  to an APPROACH (now with the option to abort it); nothing prices "standing",
  "formations" or "roles". No gene-mapping conclusion beyond the attribution split
  (GENE is an attribution partner). The v1 exclusions stand (no coach layer, no marking
  assignments, no box-arrival anticipation).
