# Stage III P1 — The Station Census

Status: **PRE-REGISTERED 2026-07-27, NOT RUN.** Authorized by **commander
ruling #39** (P1 unholds under the amended constraint set). Executor-drafted,
Autonomous mode, one experiment in flight; gates frozen here, before any data.

Authority: [`STAGE3-POSITIONING-EYE.md`](STAGE3-POSITIONING-EYE.md) §3 (v1
scope) · §4 Q1–Q8 · **§4.5 items 1–7 (the amendment P1 unholds under)** · §5
P1 · §6 gate sources · §7 stop rules ·
[`STAGE3-P0-CONSUMER-MAP.md`](STAGE3-P0-CONSUMER-MAP.md) (every anchor below
is P0's measurement, not an invention) · #20 · #24 · #29.5 · #32.1 · #35.3
(P1 forks the READ) · #38.1 (standing exception classes + full sign space are
mandatory boilerplate).

---

## 1. What P1 is

P1 builds **the table**, and nothing else. At sampled off-ball moments it
forks the deterministic world, forces ONE body's station to each candidate in
a fixed ball-local lattice, lets the live machinery play, and records a
**signed two-face outcome**. The table is committed as data with a SHA.

P1 ships no eye, no gene mapping in the live path, and no behaviour. It is the
measurement Q3's *"component VALUES are census-measured, component WEIGHTS are
genes"* rests on: if the values are not measured honestly here, everything
downstream is a hand-weight in disguise.

---

## 2. The intervention

### 2.1 The seam — a POLICY, not a point (§4.5.1)

```ts
Match.forcedStationPolicy: {
  gid: number;
  /** BALL-LOCAL, attack-frame: x forward, y lateral. Recomputed every tick. */
  offset: { dx: number; dy: number };
  untilTick: number;
} | null                                    // default null, zero live callers
```

Consumed at **the executor's READ** — the same post-switch, pre-clamp point
C4 O2's seam uses, so the forced body is steered like any other off-ball body
and the onside clamp, the barred-box clamp and the collision resolver all
still apply to him. The target is **recomputed every tick** from the live ball
position:

```text
target = ( ball.x + attackDir·dx ,  ball.y + dy )
```

⚠️ **This is a different seam from C4 O2's `forcedStation`** (a fixed world
point, banked with the C4 oracle). A station is a *relation to the ball*, not
a place; P0 §1.1 is why — the incumbent is a ball-relative function evaluated
at 60 Hz, so a fixed point would be a different kind of object and the census
would price something the eye cannot express.

### 2.2 The identity arm is NO-OVERRIDE (§4.5.1, from P0)

§5-P1's original harness gate — *"forcing the incumbent's own target
reproduces the unforked match bit-identically"* — **cannot be implemented**:
P0 §1.1 established there is no stored incumbent target to force. The identity
arm is therefore the **seam armed and null**:

```text
X-IDENTITY   the seam present but unset plays the shipped world, tick for tick
X-CONTROL    the CONTROL fork (no policy) reproduces the base continuation
             bit-identically for the full horizon, per record
```

The second is the real harness gate and it is the one that makes every
candidate fork a counterfactual rather than a different simulation.

### 2.3 The lattice — closed, small, and named for the seats it must be able to express

Ball-local polar, attack-frame. **18 candidates + control = 19 forks per
moment.**

```text
r ∈ { 7, 14, 21 } m        θ ∈ { 0°, 60°, 120°, 180°, 240°, 300° }
     0° = toward the attacking goal      180° = BEHIND the ball
```

The radii bracket P0's measured geometry rather than being chosen: 7 m sits
below `supportSpot`'s 10–18 m band, 14 m inside it, 21 m beyond it and past
P0's median pairwise spacing (12.95 m). The angles are the coarsest set that
can express every seat VISION §3.1 names — **回撤接应 (180°), 内切 (60/300°
inward), 包抄 (0° far side), 超载 (ball-side 120/240°), 强弱侧 (the ±
symmetry)** — and §3.3's whole point is that **180° is reachable at all**,
which `supportSpot` cannot express (`aheadBias` is positive at both settings).

**Registered non-claim**: the lattice is a measurement grid, not a menu the
eye will ship with. P2 prices candidates *from* this table at perceived
context; it does not inherit these 18 as its action space.

### 2.4 W — a NEW quantity, derived from P0's anchors (§4.5.6)

P0 §1.1 proved there is no incumbent station cadence to inherit. W is derived
from what P0 *did* measure:

```text
action clock                   0.15 s
licence clock                  0.40 s
incumbent family dwell         median 0.667 s · mean 1.466 s
travel time to the far ring    21 m ÷ ~7 m/s ≈ 3.0 s
travel time to the mid ring    14 m ÷ ~7 m/s ≈ 2.0 s
⇒ W = 2.0 s
```

**W must exceed the travel time to the ring the census is mainly about, or
the census prices a station nobody reached.** 2.0 s covers the mid ring and
the incumbent's own mean dwell (1.47 s) with room; the far ring is knowingly
under-covered and its **arrival mediator (§4.4) is the instrument that says
so** rather than a caveat added afterwards.

### 2.5 Face-specific horizons (§4.5.4)

```text
H_score    = 6.0 s from the force start
H_concede  = 10.0 s from the force start
```

One fork per candidate, run to `H_concede`, with the score face read off at
`H_score` **and never again** (the C5 T1 lesson: a longer-running arm must not
be allowed to accumulate the shorter face's outcome). A shared horizon is a
known attack tilt — concede value accrues later, because a station's
defensive cost is realised through a transition that has to happen first.

The 6 s / 10 s pair is anchored, not chosen: W is 2.0 s, so the score face
gets 4 s of post-commitment play — the same 4 s window every C4 instrument
uses — and the concede face gets that plus one further 4 s window for the
transition to occur and resolve.

---

## 3. The estimand

### 3.1 The signed two-face outcome (Q3: exactly TWO faces, one signed axis)

```text
SCORE   face:  ANY shot by the forced body's team within H_score of the force
CONCEDE face:  ANY shot by the opponent within H_concede of the force
VALUE       =  SCORE − CONCEDE                     (the signed axis)
```

**Shots, not goals.** Derived, not preferred: goals within a 6 s window run at
a few percent, so at the per-cell budget of §5 the concede face would be
almost entirely zeros and the signed axis would be an attack-only instrument
in disguise — exactly the tilt §4.5.4 exists to prevent. Shots carry gradient
at both ends. **Goals are reported per cell** so a later stage can check that
the shot axis did not diverge from the thing it stands in for.

⚠️ **Every window is simulated to its full length** (E5d): no adjudication
gating, no zero-value convention for a moment that ended early. A fork whose
match ends inside the horizon is recorded as such and **excluded with its
count reported**, never silently zeroed.

### 3.2 Contexts — the feature set, frozen and closed (§5-P1, Q4)

```text
FACE      possession at the moment           ours / theirs                (2)
THREAT    ball localX band                   own third / middle / their third (3)
DENSITY   own teammates within 9 m of the    ≤1 / ≥2                      (2)
          forced body (Q4: crowding is a
          TABLE ROW, never a repulsion rule)
                                             ⇒ 12 contexts
```

12 contexts × 18 candidates = **216 cells**.

Deliberately excluded, with reasons: the offside-relative flag (§5-P1's
example) — it is a *consequence* of the candidate, not a context of the
moment, and the onside clamp already rewrites those targets (P0 §1.3 consumer
#5), so a flag would double-count the clamp; and role — Q8's symmetry law
means every body runs the same eye, and a role feature would smuggle the role
table back in.

### 3.3 #24 attainability, checked ex ante

```text
per-cell precision target       SE ≤ 3pp on a face at p ≈ 0.15
⇒ n per cell                    0.15·0.85 / 0.03²  ≈ 142  → floor 150
⇒ forks needed                  216 × 150            = 32,400
⇒ moments needed (18 + control) 32,400 / 18          ≈ 1,800  IF contexts
                                                       were uniform
⇒ moments budgeted              6,000  (oversampled ~3.3× for the skew)
⇒ forks                         6,000 × 19           = 114,000
⇒ ticks                         114,000 × 600        ≈ 68 M
```

**This is the largest single measurement in the programme** and the contract
says so on its face. The 3.3× oversample is the honest response to not knowing
the context distribution ex ante; **per-cell n is REPORTED for every one of
the 216 cells**, and a cell below the 150 floor is published as
**UNDER-POWERED** rather than pooled away or quietly dropped. A table that
cannot fill a cell has told P2 something real about where the world does not
go.

### 3.4 Moment sampling, frozen

A moment qualifies when, at a tick boundary: `phase === 'playing'`, the ball
has an owner who is not the candidate body, the candidate body is an **off-ball
outfielder** (not GK, not sent off, not the carrier), and **≥ 2.0 s of match
have passed since the last sampled moment** (the C5 T1 spacing rule, so
consecutive moments are not the same football). The body sampled at a moment
is chosen by **stable rotation on player index**, not by proximity — choosing
the nearest body would censor the census onto the bodies already involved,
which is the T2 defect in a new costume.

---

## 4. Gates

Every gate is powered ex ante; none is disclosed as weak (#29.5); none is a
max-statistic (#32.1); every decision rule covers the **full sign space**
(#38.1).

### 4.1 X — identity and harness

| gate | predicate |
| --- | --- |
| **X1** | seam null: `npm run fingerprint` returns `57b0bdab…c673` |
| **X2** | seam null: byte-identical world signatures to pre-change HEAD, 3 league seeds × 2 seasons |
| **X3** | a test asserts the seam is read in exactly one place, is null on a fresh `Match` and a `League` fixture, and is unreachable from the E4 preview |
| **X4** | **CLONE COVERAGE = 100%** — every sampled moment has a pre-step clone (§4.5.1) |
| **X5** | **CONTROL FORK IDENTITY** — the no-policy fork reproduces the base continuation bit-identically for the full `H_concede`, per record, with named exception classes and an **unexplained residual of exactly 0** |
| **X6** | **FORCE FIDELITY** — on live policy ticks the forced body's applied target equals `ball + (dx, dy)` to 1e-9, per record, ≥99% ok, with **every** miss in a named class (§4.6) and unexplained exactly 0 |
| **X7** | two `runExperiment()` calls byte-identical; the table SHA emitted and committed as data |

### 4.2 The POSITIVE CONTROL — a power gate, not a hope (§4.5.5)

The lattice contains a candidate that must be measurably bad: **`r = 21,
θ = 180°`** — twenty-one metres behind the ball, away from the attacking goal.

```text
PC   in EVERY face, pooled across contexts, the signed VALUE of (21, 180°)
     is BELOW the control's, 95% cluster-bootstrap CI upper bound < 0
```

**If PC does not resolve, the budget was insufficient and the table is not fit
for P2 to consume** — the run is a FAIL and the table is not published as a
shipping table. This is the ex-ante MDE-vs-expected statement in executable
form: a station 21 m behind the ball must price worse than standing where the
incumbent puts you, and a census that cannot see *that* cannot see anything
subtler.

Banked supporting evidence, not a substitute: **C4 O2** forced a station
displacement through the same executor path and produced −8.61pp
CI [−9.62, −7.64] at 5,100 paired forks, so the harness demonstrably resolves
displacement effects of this family. P1's own PC is still required because
P1's outcome, horizon and per-cell n are all different.

### 4.3 The saturation-gap arm (§4.5.2)

The census is **unilateral** — one body forced, the other eleven on the
incumbent. Deploying the resulting table means *everyone* uses it. That is an
identification gap, and P1 sizes it rather than assuming it away.

```text
SAT   on a pre-registered SUBSET — the 3 candidates nearest the control's own
      value in each face, at the 4 best-populated contexts — re-run the fork
      with the SAME relative policy applied to ALL own outfielders, and
      compare the realised VALUE to the unilateral table's prediction.

REPORTED, and the shipping condition: the table is labelled
      DESIGN-CALIBRATION ONLY unless SAT's paired difference CI is contained
      within ±0.05 of the unilateral value on every tested cell.
```

That labelling is the whole point: #26.5's population law says the shipping
table must be censused at the adoption level it deploys at, and P1 is honest
about which of the two things it produced.

### 4.4 Mandatory mediators (§4.5.5) — bad location ≠ failed to arrive

```text
M-ETA        time from force start until the body is within 2 m of the target
M-ERROR      mean distance from the target over the last second of W
M-OCCUPANCY  share of W spent within 2 m of the target
```

**Reported per cell.** A candidate whose value is low *because nobody got
there* is a different fact from one that is low *because standing there is
bad*, and without these three the table cannot tell P2 which it measured. The
far ring (r = 21) is where §2.4 predicts these will bite, and this is the
instrument that will say so.

### 4.5 Instruments, side-split always (§4.5.6)

Every reported quantity is split by side and never summed — **P0's I4 found
the scramble is symmetric**, so a pooled instrument here would repeat the
mistake the split caught. The four consumer pins from P0 §1.3 are carried
verbatim and checked in the run: the onside clamp rewriting a beyond-the-line
candidate (expected, and counted, not treated as a failure), the zonal marking
lattice, `shapeReady`'s restart gate, and `supportSpot`'s internal
`formationSpot` call.

### 4.6 Standing exception classes — mandatory boilerplate (#38.1)

Checked in **every** per-record gate above:

```text
E-PAUSED      phase ∈ {kickoff, goalPause, halftime, fulltime}: Match.step
              returns before the executor runs, so a trace is STALE by
              construction                      (the #36.1 class, from T2/O2)
E-CARRIER     the forced body became the ball owner
E-BALLWON     the ball was won inside the window
E-SENTOFF     the forced body was sent off
E-ONSIDE      the onside clamp rewrote the target (P0 consumer #5)
E-BARRED      the barred-box clamp rewrote it (P0 consumer #6)
E-ENDED       the match ended inside the horizon
UNEXPLAINED   must be exactly 0
```

### 4.7 The gene mapping, frozen here for P2's ablation (Q6, §4.5.3)

P1 ships no mapping into the live path, but P2's ablation family needs one
frozen before P1's results exist, or the mapping becomes a post-hoc fit:

```text
score-face weight    w_s = 0.5 + 0.5·(tempo·0.5 + attackingWidth·0.5 − 0.5)
concede-face weight  w_c = 0.5 + 0.5·(defensiveCompactness·0.5 + coverBias·0.5 − 0.5)
composition          VALUE_p = w_s·SCORE_p − w_c·CONCEDE_p
```

Existing tactical genes only, no new gene, no hand constant outside the ×0.5
symmetry that keeps a neutral genome at exactly (0.5, 0.5) — i.e. at the
census's own unweighted signed axis. **P2 ablates: incumbent vs neutral-weight
eye (w_s = w_c = 0.5) vs gene-mapped eye**, so a P2 failure is attributable to
the eye or to the mapping and never to both.

---

## 5. Staging, frozen

| item | value |
| --- | --- |
| block | seeds **960,000 +** `comboIndex · 100_000`, **disjoint per combination** (the finding-15 fix, inherited) |
| staging | random-genome matches, the P0 population (the world the eye will live in), 6 disjoint blocks of 250 = **1,500 matches** |
| moments | **6,000**, stable-rotation body choice, ≥2.0 s apart |
| arms | per moment: **control + 18 candidates**, all forked from the same pre-step clone |
| W / H | 2.0 s / 6.0 s score / 10.0 s concede |
| cluster unit | the match seed, disjoint across blocks |
| bootstrap | 2,000 resamples, frozen seed **50031** |
| output | the 216-cell table, committed as data under `docs/world-model/data/`, SHA'd |

---

## 6. Pre-laid readings — the full sign space (#38.1)

* **(a) The table has gradient.** Candidates separate within contexts, PC
  resolves, mediators show bodies arriving. P2 has something to price. The
  census's own headline is then *which* seats pay — and §3.3's 180° ring is
  the one to watch, because if drop-to-receive prices well, the incumbent's
  `aheadBias` is a measured defect and not just an aesthetic one.
* **(b) The table is FLAT.** PC resolves but nothing else does: standing
  anywhere reachable is worth about the same. Then the positioning seat is not
  where the value is, Stage III's premise is wrong at v1 scope, and that is a
  finding worth the whole cost — it would send the eye's budget to the
  perception layer instead.
* **(c) The table is NOISE.** PC does **not** resolve ⇒ FAIL, the budget was
  wrong, and no table is published. Re-powering is the commander's call, not
  a re-cut here.
* **(d) Gradient exists but SAT fails.** The unilateral table does not survive
  universal adoption. Then P1 has produced design calibration and the shipping
  table needs a censused-at-adoption re-run — the identification gap the audit
  named, made concrete instead of assumed.

Registered non-claims: P1 changes no behaviour; the eye is P2's; the lattice
is not an action space; no gene is added (Q6); the coach eye, box-arrival
anticipation and marking assignments stay out of v1 (§3).

---

## 7. Result

*(empty until P1 runs — filled in the same commit as the result, per
governance rule 6.)*

---

## 8. Stop rules

* **Any X gate fails ⇒ FAIL.** X5 especially: a fork that cannot reproduce
  its own control is not a counterfactual.
* **PC fails ⇒ FAIL**, and the table is not published as a shipping table.
* **SAT fails ⇒ the table is labelled DESIGN-CALIBRATION ONLY** and P2 may not
  consume it as a shipping table without a re-census at adoption level.
* **A degenerate lattice** — one candidate dominating every context in every
  face — is reported as the positional twin of always-heavy and returned to
  the commander before P2 is drafted (§7 of the parent contract).
* **No re-cutting after sight**: not W, not the horizons, not the contexts,
  not the lattice, not the 150 floor, not PC's predicate, not §6's readings.
* P1 ships nothing. The seam stays null in every production path, and the
  table is data, not behaviour.
