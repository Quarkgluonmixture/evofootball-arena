# Stage III P2 — The Dormant Eye

Status: **DRAFTED 2026-07-27, frozen before any implementation. REVIEWED and
AMENDED 2026-07-28 by commander ruling #43** — compliance PASSES, the ex-ante
prediction reproduced independently to the digit, and ONE pre-run amendment is
applied in place (§3.4b: X6 splits into a hard per-record fidelity gate plus
reported clamp composition). **Authorized to implement and run as amended
(#43.5).** Originally authorized by
**commander ruling #42.3** (P1R accepted; the eye's premise survives its first
real measurement; the executor drafts P2 under Autonomous mode). Gates are
frozen here, before the chooser exists and before any datum of P2's own.

Authority: [`STAGE3-POSITIONING-EYE.md`](STAGE3-POSITIONING-EYE.md) §3 (v1
scope) · §4 Q1–Q8 · **§4.5 items 1–7, all eleven constraints, verbatim** · §5
P2 · §6 gate sources · §7 stop rules · **#42.2** (the three banked handover
facts, which are DESIGN INPUTS here and are not to be rediscovered) ·
**#41.2** (the estimand the table carries: *the signed value of committing W to
APPROACHING candidate X* — the eye consumes it under that meaning and no
other) · #41.3 (station = a sustained approach direction) · #40.4 (the
station-family population) · #35.3 (the intervention forks the executor's READ)
· #38.1 (standing exception classes + full sign space) · #32.1 (no
max-statistic) · #29.5 (no weak gate undisclosed) · #24 · #20 ·
[`STAGE3-P0-CONSUMER-MAP.md`](STAGE3-P0-CONSUMER-MAP.md) (every anchor below is
P0's measurement) · [`STAGE3-P1R-APPROACH-CENSUS.md`](STAGE3-P1R-APPROACH-CENSUS.md)
(the table, its gates, its staging, its harness).

---

## 1. What P2 is

P1R built the table. **P2 builds the consumer and asks the one question the
census could not answer: does a body who READS his context and prices these
approaches through his OWN percept beat the body who does not?**

The central hypothesis is pre-named by #42.3 and is fixed here before any code:

> **H-COND** — a context-reading, percept-honest chooser over the SAME lattice
> recovers the 40-cell conditional payoff that every fixed policy loses.

P2 has two halves, and they answer two different questions with two different
instruments:

* **P2-A — the payoff, at the census's own unit and OUT OF SAMPLE.** Paired
  same-seed forks at real decision moments: the eye's chosen approach against
  the incumbent's continuation, scored on the census's own signed two-face
  axis. This is where H-COND is tested and where the gates that can FAIL live.
* **P2-B — the deployment, at match level.** The same eye armed across the
  adoption ladder (one body → one team → both teams), measured on P0's
  instruments with the two reverts' canaries HARD. This is where the eye's
  *safety* is measured — stability, offsides, the box, rest defence.

P2 ships **nothing**. The chooser is behind a flag that is null in every
production path, flag-off is bit-identical, the P1R table is never bundled into
`src/**` (the probe injects it), and the live game after P2 is the live game
before it. P3 is the live audit; P4 is the user's eyes.

### 1.1 The three design inputs, taken as given (#42.2)

Carried forward as **inputs**, not as things to rediscover:

1. **Direction dominates distance by ~3×** (angle spread 2.9pp vs radius
   0.9pp). Consequence for P2: the angular dimension is the load-bearing one,
   so the deviation mix **by angle and by radius** is a mandatory REPORTED
   diagnostic — but the chooser still runs over the full 18-candidate lattice,
   because #42.3 says *the same lattice* and collapsing to an angle-only action
   space would be a re-cut of the object the table prices.
2. **The pooled sign is not the eye's ceiling** — 40 of 216 cells beat their
   control (own-third crowded → push forward +8.2pp; their-middle crowded →
   drop back +5.5pp). This is why P2 exists at all, and it is also why P2-A's
   sample must be disjoint from P1R's (§3.2).
3. **The behind-the-ball ring is cheap and positive in two contexts, and the
   incumbent cannot express it** (`supportSpot`'s `aheadBias` is positive at
   both settings, P0 §1.4). The share of the eye's deviations that land in the
   180° ring is a REPORTED emergence claim — drop-to-receive appearing because
   it prices well, not because anybody wrote it.

---

## 2. The eye — frozen

### 2.1 The seam and the flag

```ts
// src/sim/Match.ts — null in every production path, zero live callers
Match.stationEye: {
  readonly arm: 'neutral' | 'gene' | 'oracleCtx' | 'inverted';
  readonly scope: { kind: 'body'; gid: number } | { kind: 'team'; side: Side } | { kind: 'both' };
  /** The P1R table, INJECTED by the probe. No table is bundled in src. */
  readonly table: ApproachTable;
} | null = null;

// per-body commitment state, cleared whenever stationEye is null
Match.stationEyeState: Map<number, {
  offset: { dx: number; dy: number };
  untilTick: number;
  faceAtDecision: 'ours' | 'theirs';
}>
```

The chosen offset is applied **exactly where P1R's `forcedStationPolicy` is
applied** — at the executor's READ, after the action switch and **before** the
onside and barred-box clamps (#35.3), recomputed every tick as
`target = (ball.x + attackDir·dx, ball.y + dy)`. Same read point, same clamps
after it, same ball-local semantics. The eye gets no privilege the census
treatment did not have; if it did, P2 would not be measuring the thing P1R
priced.

`forcedStationPolicy` stays exactly as it is (P1R's seam, still null in
production). The eye is a **second, independent** seam so that P1R's harness
remains reproducible bit-for-bit.

### 2.2 Who runs the eye, and when he decides

**Eligibility, identical to P1R's population (#40.4 · #41.3):** an outfielder
(not GK, not sent off, not the ball owner) whose current action is a **station
family** — `MoveToFormationSpot · HoldPosition · SupportBallCarrier · MakeRun ·
MarkOpponent`. Ball-directed actions (`ChaseBall · ReceivePass · InterceptPass`)
are never overridden: forcing them is abandoning the ball, which is C4 O2's
measured harm. If a committed body's action leaves the station family, the
override **lapses for those ticks** and resumes if he re-enters one before the
window expires; the window clock keeps running regardless.

**W = 3.0 s**, inherited from P1R §2.3 **with its derivation**, not by habit:
P0's dwell mean is 1.466 s (a commitment must exceed it), the licence clock is
0.4 s, and the measured travel time to a ball-local target is p50 2.66 s. W
must be the same quantity the table priced, or the eye consumes prices for a
window it does not commit. **This is the P0-anchored derivation §4.5.6 demands;
no cadence is inherited from the incumbent, because P0 §1.1 proved there is
none.**

**A decision fires when** one of:

```text
D1  the body has no live commitment (first eligible tick, or the window expired)
D2  MATERIAL CHANGE: the perceived possession face differs from faceAtDecision
    -- the one break rule (§4-Q5's "unless the percept materially changes"),
    and it is the one P0 I2 identifies as structural: hasBall is an INPUT to
    the incumbent, so a possession flip is a step change in the world's own
    station function (drift p99 = a 9 m jump in one sample).
```

Decision phases are **staggered by body** so the six bodies never think on the
same tick: a body's first decision is offset by `gid mod W_TICKS` ticks —
`Match.ts:651`'s kickoff stagger, reused rather than invented.

### 2.3 The percept, and the perceived context (Q1, no truth by the back door)

At a decision instant **and only there**, the body pulls his own snapshot —
`match.perceivedSnapshot(p)`, the E3R2 PULL (#13.3), materialised from the
moments his eyes were actually open. Cost is paid once per body per window,
which is also what makes the eye affordable at P3.

The perceived context is computed from that snapshot with the census's own
three features and nothing else (§3.2 of P1R, frozen and closed):

```text
FACE     the side of the PERCEIVED ball owner        ours / theirs
THREAT   the PERCEIVED ball's localX band            ownThird / middle / theirThird
DENSITY  own teammates within 9 m of the body, counted from the SNAPSHOT
         (remembered positions included -- his memory IS his belief; the
         E2b-1R retention rules decide what is in it, and no new age
         constant is introduced here)                sparse (<=1) / crowded (>=2)
```

**If the snapshot carries no ball** (never seen, or the memory has lost it),
the eye **abstains** for that window: no override, the incumbent runs, and the
event is counted in the named class `E-ABSTAIN-UNSEEN`. Falling back to truth
would be exactly the back door #8(l) forbids, and inventing a prior would be
A4's seat smuggled into Stage III (Q7).

**Mandatory mediator:** perceived-vs-true context agreement, per feature and
overall. The census fitted on TRUE context; the eye consumes PERCEIVED context;
the price of that exchange is a number this run must publish, not an assumption
it inherits.

### 2.4 The pricing and the selection rule

For the perceived context cell `c`, over candidates with `n >= 150` in that
cell (the census's own floor — an UNDER-POWERED cell is not a price):

```text
V(x)      = w_s · score(c, x)  −  w_c · concede(c, x)
advantage = V(x) − V(control)
choose      argmax advantage
deviate     iff  advantage > 0   (strict)
otherwise   NO OVERRIDE — the incumbent runs, and that is the eye choosing him
```

`control` is the census's own control arm, i.e. **the incumbent's continuation
at that moment**, so the eye's action space is literally
`{ incumbent } ∪ { 18 candidates }` and the prices are comparable by
construction. Ties, an empty eligible set (one context — `ours|theirThird|
crowded` — has all 18 cells under-powered), and abstention all resolve to **no
override**, each in its own counted class.

Registered limitation, in advance: **the committed table carries per-cell `n`
but no per-cell CI**, so the chooser cannot condition on cell precision beyond
the 150 floor. That is the winner's-curse exposure of this design, and §3.2 is
the test of it rather than a footnote about it.

### 2.5 The arms (§4.5.3 ablation family, plus power and the perception price)

Five forks per moment in P2-A; four armed configurations in P2-B.

| arm | weights | context | role |
| --- | --- | --- | --- |
| **CONTROL** | — | — | the incumbent's continuation; the identity gate |
| **NEUTRAL** | `w_s = w_c = 0.5` | perceived | **PRIMARY.** The faithful consumer of an unweighted table |
| **GENE** | §4.7's frozen mapping | perceived | the VISION-mandated stance seat; attribution partner |
| **ORACLE-CTX** | `0.5 / 0.5` | **TRUE** | REPORTED. The perception price, decomposed |
| **INVERTED** | `0.5 / 0.5` | perceived | **PC.** argmin instead of argmax — must measurably hurt |

The gene mapping is P1's §4.7, frozen there before P1R's results existed
precisely so it could not be fitted to them:

```text
w_s = 0.5 + 0.5·(tempo·0.5 + attackingWidth·0.5 − 0.5)
w_c = 0.5 + 0.5·(defensiveCompactness·0.5 + coverBias·0.5 − 0.5)
```

Existing tactical genes only; a neutral genome lands exactly at (0.5, 0.5),
i.e. at the census's own unweighted axis. **PRIMARY is NEUTRAL, named here to
foreclose a max-statistic (#32.1)**: the table is unweighted, so the unweighted
chooser is its faithful consumer, and the gene arm's job is attribution — a
failure must be attributable to the eye or to the mapping and never to both
(§4.5.3).

**ORACLE-CTX reads truth and is therefore probe-only.** It is unreachable from
any production path and a test asserts so; its single purpose is to split
"the table does not transfer" from "the body misread his context".

### 2.6 What the eye does NOT touch — the four consumer pins (§4.5.6, P0 §1.3)

Carried verbatim and asserted by test:

```text
pin 1  the ONSIDE CLAMP still rewrites the eye's target when it goes beyond
       the line — the eye is penalised by the world, never exempted (counted,
       not treated as a failure)
pin 2  the ZONAL MARKING LATTICE (assignMarks, 0.4 s) still reads the
       INCUMBENT formationSpot as its zone centre — the eye forks the READ,
       never the FUNCTION (#35.3)
pin 3  shapeReady's restart gate still reads the incumbent function; restart
       stalls and mean restart delay are REPORTED in P2-B, because P0 §1.3
       warned a shape nobody settles into stalls goal kicks
pin 4  supportSpot's internal formationSpot call is untouched
```

---

## 3. P2-A — the payoff, out of sample

### 3.1 The estimand

At each sampled moment, clone the pre-step world and run **one fork per arm**
to `H_concede`, reading the score face at `H_score` and never again:

```text
H_score   = 6.0 s      H_concede = 10.0 s      (P1R's, unchanged)
SCORE     = ANY shot by the eye body's team within H_score of the decision
CONCEDE   = ANY shot by the opponent within H_concede of the decision
VALUE     = SCORE − CONCEDE
```

```text
PRIMARY   ATE = mean over ALL eligible moments of  VALUE(NEUTRAL) − VALUE(CONTROL)
SECONDARY ATT = the same mean over DEVIATING moments only
```

Both are **paired within the same clone**, so a moment where the eye does not
deviate contributes exactly 0 by construction — this is the variance killer
§4.5.5 names as the default, and it is why the ATE is the better-powered of the
two despite the dilution.

Every window is simulated to its full length (E5d): no adjudication gating, no
zero-value convention. Forks whose match ends inside the horizon are excluded
**with their count reported**, never silently zeroed.

### 3.2 ⭐ The sample is DISJOINT from P1R's, and that is the whole methodology

The 40 positive cells were **selected on P1R's own sample**. Re-scoring a
chooser built from those cells on the same 6,000 moments would be guaranteed to
look positive and would measure nothing but the selection. P2-A therefore runs
on a **fresh, disjoint seed block** (§3.6), and the honest ex-ante expectation
is that **the out-of-sample advantage is smaller than the table implies**.

This is registered as a prediction, not as an excuse: §3.3 states the shrinkage
the budget can survive, and §6 states what a shortfall means.

### 3.3 The ex-ante prediction and the MDE statement (§4.5.5)

Computed **now**, from the committed table alone (`table SHA 59a3f72e…6e12d`),
under NEUTRAL weights and TRUE context, weighting each context by its control
arm's `n`:

```text
contexts with a positive eligible best candidate     6 of 12
predicted DEVIATION SHARE                            44.4% of eligible moments
predicted in-sample ATE                              +0.0207 per moment
predicted in-sample ATT                              +0.0465 per deviating moment
the argmax picks:  ours|ownThird|*  → r21a0 / r21a0     theirs|middle|crowded → r21a180
                   ours|middle|crowded → r7a0           theirs|ownThird|*     → r7a300 / r21a0
```

P1R resolved pooled per-candidate contrasts to ±0.0127 at 6,000 moments
**unpaired**. P2-A is paired and exactly zero on ~56% of moments, and runs
**12,000 moments**, so:

```text
MDE (pre-registered)   half-width <= 0.009 on the ATE at 95% cluster bootstrap
⇒ the run resolves H-COND if at least ~44% of the in-sample advantage survives
  out of sample. Below that the reading is FLAT, and §6(b) says what FLAT means.
```

No escape hatch is registered: a transferable advantage under 0.009 per moment
is below what the eye needs to be worth deploying, so FLAT is a negative
verdict on the eye **as specified at v1 scope**, not a call for a bigger budget.

### 3.4 Gates

Every gate is powered ex ante, none is a max-statistic, and every decision rule
covers the full sign space.

| gate | predicate |
| --- | --- |
| **X1** | eye null: `npm run fingerprint` returns `57b0bdab…c673` |
| **X2** | eye null: byte-identical world signatures to pre-change HEAD, 3 league seeds × 2 seasons |
| **X3** | a test asserts: the eye is read in exactly one place, is null on a fresh `Match` and a `League` fixture, is unreachable from the E4 preview, and the ORACLE-CTX arm is unreachable from any production path |
| **X4** | **CLONE COVERAGE = 100%** of sampled moments |
| **X5** | **CONTROL-FORK IDENTITY** — the no-eye fork reproduces the base continuation bit-identically for the full `H_concede`, per record, sampled 1-in-25, unexplained exactly 0 |
| **X6** | **FORCE FIDELITY — per-record only (⭐ AMENDED by #43.3, see below).** On live override ticks the applied target equals the engine's own `meet` to 1e-9, and **unexplained is exactly 0**. The ok-share and the clamp shares are **REPORTED, per-candidate × per-context**, and gate nothing |
| **X7** | two `runExperiment()` calls byte-identical; result SHA emitted |
| **DEV** | **DELIVERY** — the NEUTRAL arm's realised deviation share ≥ **0.22**, i.e. half the 44.4% predicted, with headroom for percept error. Below it, the treatment was not delivered and **no payoff reading is available** (P1's lesson, in gate form) |
| **PC** | **INVERTED resolves BELOW control**, pooled, 95% cluster-bootstrap CI **upper < 0**. If the argmin chooser does not measurably hurt, the budget cannot see this family of effect and the run is a FAIL with no reading published |

### 3.4b ⭐ COMMANDER AMENDMENT #43.3 — X6 splits, before implementation

Applied pre-run, ex ante, on banked data only, quoted in place as the ruling
requires. **#24's attainable-population law, third application** (after P1's
99% floor and T2-ARRIVAL's F2):

> **X6 AMENDMENT — REQUIRED BEFORE IMPLEMENTATION.** The 0.84 floor was derived
> on P1R's UNIFORM forced mix (8.08% clamp share, 2× headroom). The eye's mix is
> an argmax: 54.9% of predicted deviations sit on r21a0 — the most forward
> candidate, on the attacking face, exactly where the onside clamp lives — so
> the floor's denominator population is not the population the gate deploys on.
> The contract already contradicts itself here: pin 1 declares clamp rewrites
> "counted, not treated as a failure" while X6 makes a clamp-heavy mix a
> run-FAIL. RESOLUTION, through the contract's own semantics: **X6 binds HARD on
> per-record fidelity only** (applied target = the engine's own meet to 1e-9;
> unexplained exactly 0). **The ok-share and clamp shares become REPORTED,
> per-candidate × per-context.** Validity is carried by construction, not by the
> floor: census forks and eye share the same READ point and the same clamps
> after it (§2.1), so each candidate's price ALREADY includes its clamp fate —
> the eye consuming candidate x receives exactly the treatment the census priced
> as x. Clamp composition is an interpretation mediator (how much of r21a0's
> value is "the onside line"), never a validity gate.

Nothing else moves (#43.5): not W, not the horizons, not the lattice, not the
contexts, not the 150 floor, not DEV 0.22, not the canary bands, not §6's
readings.

**On the record from the same ruling (#43.4), no amendment**: DEV's 0.22 gets
its missing anchor — the banked out-of-cone rate at 0.8 awareness is 9.4% (D6),
an UPPER anchor for a snapshot missing the ball since the snapshot also carries
retained memory, so 2× headroom on 44.4% is attainable ex ante. §5's decision
classes decompose any surprise.

### 3.4c ⚠️ Disclosed BEFORE the run, in the implementation commit

Seven implementation readings, all published before a single datum of P2's own
exists. **No gate value, horizon, lattice, context, floor, band or §6 reading
changes** — this is the P1 §4.6b discipline: corrections and choices declared
toward the engine, in writing, before the numbers.

1. **The eye is a THIRD consumer of the perception chain, and the chain is now
   armed for it.** `refreshPerception` and the scan-frame ring were gated on the
   EDS flags alone; with those off, a pulled snapshot reconstructs from an empty
   history and every body believes he is alone — so the DENSITY feature would
   read `sparse` always and the percept would be a fiction. Both are now also
   armed when `stationEye !== null`. Production is untouched (the eye is null),
   and X1/X2/X3 pin that.
2. **The decision cadence: first eligible tick, then once per window — and
   EVERY decision commits.** The contract's absolute-phase stagger
   (`gid mod W_TICKS`) is **not** implemented: at P2-A's unit it would delay the
   treatment by up to a full W after the sampled moment, which is P1's
   undelivered-treatment failure rebuilt. A tie, an abstention and a no-cell all
   commit the window to the incumbent, so the percept is pulled exactly once per
   body per window rather than at 60 Hz. The stagger's stated PURPOSE (bodies
   not thinking in lockstep) survives through heterogeneous eligibility onset,
   and P2-B reports the decision counts so the claim is measured, not asserted.
3. **`Player.clampTrace`, a new per-frame probe-observability field**, records
   WHICH clamp rewrote the steering target. X6's clamp classification and
   #43.3's clamp-composition mediator are then exact engine facts instead of a
   probe's pre-step guess — the P1 §4.6b defect (classifying clamps from the
   wrong instant) removed at source rather than corrected afterwards. Written by
   the executor, never read by the sim.
4. **Two additional named classes in the FIDELITY taxonomy**, so unexplained can
   be honestly 0: `E-REDECIDED` (the window ended or the face flipped and the eye
   re-decided this tick, choosing the incumbent) and `E-NONSTATION` (the body's
   action left the station family inside the window). Neither is a fidelity
   failure; both are the eye's own semantics, and both are counted.
5. **In P2-A the eye stays ARMED for the whole horizon**, re-deciding every
   window rather than being released after the first one. That is the
   deployment behaviour #41.2's population law points at — the deployed eye
   perpetually approaches — and it is the object P2 tests: a chooser, not one
   forced window. The mediators M-ETA/M-ERROR/M-OCCUPANCY are still measured over
   the FIRST window, so they stay comparable with P1R's.
6. **A perceived ball with no OWNER has no cell**, so the eye abstains and the
   tick is counted under `E-ABSTAIN-UNSEEN` with its own sub-count
   (`abstainNoOwner`). This is a large class by nature — the ball is often in
   flight — and it enters DEV's denominator, which the 0.22 floor was NOT
   derived against (the census population always has an owner). **The floor
   stands exactly as frozen**; the run additionally reports the deviation share
   over decisions that had a priceable context, as a decomposition, never as a
   substitute.
7. **The snapshot cannot report sent-off status**, so a sent-off teammate still
   inside retention counts toward perceived density. Disclosed rather than
   patched with truth, which would be the back door Q1 forbids.

### 3.5 Mandatory mediators (§4.5.5) — reported, never gating

```text
M-DEVIATE     deviation share, overall and per context; the deviation MIX by
              angle and by radius (#42.2's direction-dominance, instrumented)
M-180         the share of deviations in the 180° ring — the seat the
              incumbent cannot express
M-CTX         perceived-vs-true context agreement, per feature and overall
M-ETA         time from decision until the body is within 2 m of the target
M-ERROR       mean distance from the target over the last second of W
M-OCCUPANCY   share of W spent within 2 m of the target
M-ABSTAIN     the counts of E-ABSTAIN-UNSEEN / E-NOCELL / E-TIE / E-NONSTATION
```

Under #41.2 a low occupancy is a **description of a long approach**, never a
broken treatment — the same reading P1R banked. These mediators exist so that
"the eye chose badly", "the eye never chose", and "the eye misread the world"
can never be confused, which is precisely the confusion P1 fell into and the
mediators caught.

### 3.6 Staging, frozen

| item | value |
| --- | --- |
| block | seeds **2,000,000 +** `blockIndex · 100_000`, **12 disjoint blocks** — disjoint from P0 (930k), P1 (960k–1.46M) and **P1R (980k–1.48M)**, per §3.2 |
| staging | random-genome matches, the P0 population, 12 blocks × 250 = **3,000 matches** |
| moments | **12,000**, station-family population only, stable rotation on player index, side alternating on the same rotation (P1 §4.6b's fix), ≥ 2.0 s apart |
| arms | per moment: **CONTROL + NEUTRAL + GENE + ORACLE-CTX + INVERTED** = 5 forks, all from the same pre-step clone (**60,000 forks**, ~36 M ticks — well below P1R's 68 M) |
| W / H | 3.0 s / 6.0 s score / 10.0 s concede |
| cluster unit | the match seed, disjoint across blocks |
| bootstrap | 2,000 resamples, frozen seed **50041** |
| output | per-arm pooled and per-context results + all §3.5 mediators, committed as data under `docs/world-model/data/`, SHA'd |

---

## 4. P2-B — the deployment, and the adoption ladder

### 4.1 The rungs (§4.5.2)

Unilateral prices deployed universally is an identification gap, not an
assumption. P1R sized it at fork level (SAT: four gaps, all positive, all
inside ±0.05 — the unilateral table is CONSERVATIVE). P2-B measures it at
match level, where the eye actually would live:

```text
R0  CONTROL     nobody runs the eye                     (the paired baseline)
R1  ONE BODY    one outfielder, index 1 + (matchSeed mod 5), on side 0 only
R2  ONE TEAM    all outfielders of side 0
R3  BOTH TEAMS  every outfielder on both sides          (the DEPLOYMENT rung)
```

All four arms run the **same seeds**, paired. R3 is the arm the canaries and
the stability gates bind on, because it is the world P3 would audit. R1/R2 are
the saturation gradient: **a sign disagreement between rungs is its own
reading** and returns to the commander unresolved (§6(g)).

Arms use the NEUTRAL chooser. The GENE chooser runs R3 only, as the attribution
partner; ORACLE-CTX and INVERTED do not run in P2-B (they are P2-A's
instruments).

### 4.2 The instruments — P0's seven, side-split always (§4.5.6)

I1 dwell · I2 target drift · I3 pairwise spacing · I4 ball convergence ·
I5 rest defence (both readings, never merged) · I6 duplicate runs · I7
attack/defence shape delta — **each exactly as P0 §2.2 defines it**, sampled at
6 Hz, cluster-bootstrapped, side-split and never summed.

**Comparison is paired against the R0 arm of the same seeds**, not against P0's
published numbers: P0 ran on block 930,000 and its own §5 says any P2 A/B must
be paired same-seed against that staging or re-baseline. P0's numbers are the
sanity cross-check, and a large drift between R0 here and P0 there is itself
reported.

**H-SCRAMBLE and H-SHAPE are NOT tested here.** §5-P3 owns them; P2 reports I4
and I7 without any improvement claim. Registered so that a favourable-looking
I4 in this run cannot be quoted as the residual being fixed.

### 4.3 The two reverts' canaries — HARD (§7 of the parent contract)

Both fire on the R3 arm, paired against R0, and **either one firing stops the
queue outright** regardless of P2-A's verdict. The graves are load-bearing:

```text
C-OFFSIDE   offsides per match (team.stats.offsides, both sides)
            FIRES if the paired increase has CI lower bound > 0 AND the point
            increase is >= +10%.
            Derivation: revert 2 blasted +50% and died for it; +10% is one
            fifth of that blast, and the two-part predicate keeps a tiny but
            precise increase from firing a canary built for a blast.

C-BOX       attackers inside the opposition box AT CROSS ARRIVAL (C4 T0's
            instrument: localX > HALF_L − BOX_DEPTH, |y| <= BOX_WIDTH/2, read
            on the pre-step state of the arrival tick), per cross.
            FIRES if the paired change has CI upper bound < 0 AND the relative
            drop is >= 15%.
            Derivation: revert 1 EMPTIED the box because an openness field
            avoids contested zones; C4 T0 measured 0.98–1.53 attackers in the
            box at arrival, so a 15% drop is a fifth of a body — small enough
            to catch the disease early, large enough not to fire on noise.
            REPORTED alongside: C4 T0's four arrival classes (C0/C1/C2/C3),
            so a shift in class MIX is visible even if the count holds.
```

### 4.4 The degenerate attractor — HARD (§7)

The positional twin of always-heavy. Note first what does **not** count: the
selection rule is an argmax per context, so **one candidate dominating the
deviation mix is expected by construction** (r21a0 alone accounts for ~55% of
predicted deviations) and is not evidence of degeneracy. Degeneracy is defined
on BEHAVIOUR, against P0's measured baselines, paired vs R0:

```text
DEGEN-PILEUP    I3's share under 4 m rises >= 50% relative (CI lower > 0)
                — P0 baseline 9.40%
DEGEN-RESTDEF   I5(b), the designated slot's share, falls >= 20% relative
                (CI upper < 0) — P0 baseline 65.82%; abandoning rest defence
                under simultaneous consumption is the survey's named failure
DEGEN-SCRAMBLE  I4 own-within-5 m rises >= 25% relative (CI lower > 0)
                — P0 baseline 0.956, and 乱抢 is the user's #1 hate
```

Any of the three fires ⇒ the queue stops and the fork returns to the commander.

### 4.5 Also reported in P2-B

Restart stalls and mean restart delay (pin 3); the eye's decision rate per body
per minute; the deviation mix by angle/radius and the 180°-ring share at each
rung; the R1/R2/R3 saturation gradient on the signed match-level differential
(eye side's shots for − shots against, paired vs R0) — **reported with CIs, not
gating**, since match-level power is unknown ex ante and §29.5 forbids gating on
a weak instrument without disclosure.

### 4.6 Staging, frozen

| item | value |
| --- | --- |
| block | seeds **3,500,000 +** `blockIndex · 100_000`, 4 disjoint blocks (disjoint from P2-A) |
| staging | random-genome matches, the P0 population, 4 × 200 = **800 matches per arm**, the same 800 seeds in every arm |
| arms | R0, R1, R2, R3 (NEUTRAL) + R3-GENE = 5 match sets = 4,000 matches |
| instruments | 6 Hz sampling, `phase === 'playing'`, keepers excluded (P0 §2) |
| cluster unit | the match seed |
| bootstrap | 2,000 resamples, frozen seed **50041** |
| identity | R0 must reproduce the shipped world bit-identically (the flag-off pin) |
| output | committed as data under `docs/world-model/data/`, SHA'd |

---

## 5. Exception classes — mandatory boilerplate (#38.1)

Two taxonomies, kept apart on purpose. Conflating "the seam was rewritten" with
"the eye chose not to act" is the P1 X6 defect in a new costume.

**Fidelity classes** (per-record, checked in every gate of §3.4, unexplained
must be exactly 0):

```text
E-PAUSED     phase ∈ {kickoff, goalPause, halftime, fulltime} — Match.step
             returns before the executor runs, so a trace is STALE by
             construction (the #36.1 class; the standing paused-world class
             that every probe now carries)
E-CARRIER    the body became the ball owner
E-BALLWON    the ball was won inside the window
E-SENTOFF    the body was sent off
E-ONSIDE     the onside clamp rewrote the target (pin 1)
E-BARRED     the barred-box clamp rewrote it
E-ENDED      the match ended inside the horizon
UNEXPLAINED  exactly 0
reconstructionDiverged   REPORTED, never gated (P1 §4.6b's diagnostic)
```

**Decision classes** (per decision instant, mutually exclusive, summing to the
decision count):

```text
D-DEVIATE          an override was issued
E-ABSTAIN-UNSEEN   the percept carried no ball (§2.3)
E-NOCELL           no candidate in the perceived cell met the n >= 150 floor
E-TIE              the best advantage was <= 0 — the eye chose the incumbent
E-NONSTATION       the body's action left the station family mid-window
```

---

## 6. Pre-laid readings — the full sign space (#38.1)

Written before the run; not one of them may be re-cut after sight.

* **(a) POSITIVE — H-COND holds.** NEUTRAL's ATE CI lower bound > 0, DEV and PC
  pass, no canary and no DEGEN fires. The conditional payoff survives out of
  sample and survives being consumed through a real percept: the eye's premise
  cashes, and P3 (the live audit) is the commander's to authorize.
* **(b) FLAT — the advantage does not transfer.** DEV and PC pass, the ATE's CI
  contains 0. Then the 40 cells' payoff is below 0.009 per moment out of
  sample — largely the winner's curse — and **the eye as specified does not pay
  at v1 scope**. That is a negative verdict, not a request for budget (§3.3).
* **(c) NEGATIVE — reading the table hurts.** ATE CI upper < 0. Then the 40
  cells were selection noise and the incumbent's station function is better than
  any consumer of this table; Stage III's premise is refuted at v1 scope, which
  is a finding worth the whole cost and sends the budget to the perception layer.
* **(d) UNDELIVERED.** DEV < 0.22 ⇒ **no payoff reading is available** and the
  run reports why (abstention, no-cell, ties, non-station lapses — §5's decision
  classes decompose it exactly). P1's ghost, gated this time.
* **(e) NOISE.** PC does not resolve ⇒ FAIL, no reading published, and
  re-powering is the commander's call, never a re-cut here.
* **(f) SPLIT ON THE MAPPING.** NEUTRAL and GENE disagree in sign with both CIs
  excluding 0 ⇒ the eye stands and **the mapping** returns to the commander —
  the exact attribution §4.5.3 exists to buy.
* **(g) LADDER DISAGREEMENT.** R1/R2/R3 disagree in sign on the match-level
  differential with CIs excluding 0 ⇒ the identification gap is real at
  deployment scale; returned unresolved, and no shipping claim may be made from
  the unilateral rung.
* **(h) CANARY OR DEGEN FIRES.** The queue stops outright, **whatever P2-A
  says** — a positive payoff bought with an emptied box or a collapsed shape is
  the two reverts happening again with better arithmetic.
* **(i) PERCEPTION PRICE.** ORACLE-CTX minus NEUTRAL is REPORTED in every
  branch above: it splits "the table does not transfer" from "the body misread
  his context", and a large gap is a finding for A4's doctrine seat, not a
  licence to feed the eye truth.

---

## 7. Stop rules

* **Any X gate fails ⇒ FAIL.** X5 especially: a fork that cannot reproduce its
  own control is not a counterfactual.
* **PC fails ⇒ FAIL**, and no payoff reading is published.
* **DEV fails ⇒ UNDELIVERED**, reported as such, and the payoff numbers are
  **not** interpreted (they are published as data with the label attached).
* **Either canary or any DEGEN limb fires ⇒ the queue stops outright** and the
  fork returns to the commander.
* **No re-cutting after sight**: not W, not the horizons, not the lattice, not
  the contexts, not the 150 cell floor, not the 0.22 DEV floor, not the canary
  bands, not §6's readings. (X6's ok-share floor was removed **before
  implementation** by commander amendment #43.3, §3.4b — pre-run, ex ante, on
  banked data only; per-record fidelity still binds HARD.)
* **The population law (#26.5)**: if any live substrate change lands before P2
  runs, P1R's table is stale and must be re-censused at the HEAD the eye
  deploys on. P2 must state the HEAD it ran at.
* **P2 ships nothing.** `Match.stationEye` stays null in every production path;
  the fingerprint is unchanged; the table is data, not behaviour.

---

## 8. Registered non-claims

P2 changes no live behaviour and makes no shipping claim; P3 owns the live
audit (§2 band, watchability HARD, perf, multi-seed ecology, co-evo
restoration) and P4 owns the user's eyes. No new gene (Q6). The coach eye,
box-arrival anticipation and marking assignments stay out of v1 (§3). The
lattice is a measurement grid, not the eye's eventual action space (P1 §2.3's
non-claim, still standing). H-SCRAMBLE and H-SHAPE are P3's. And the table's
meaning is #41.2's and no other: **the value of committing a window to an
approach** — every number this contract consumes is that quantity, and any
reading that requires the table to mean "the value of standing there" is
outside this contract by construction.
