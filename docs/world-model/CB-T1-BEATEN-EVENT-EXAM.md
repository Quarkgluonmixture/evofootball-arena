# CB T1 — THE BEATEN-EVENT EXAM (过人这件事，到底发生了没有)

Status: **FROZEN (this half), then BUILT + RUN.** Per **#266.3(c)** everything from §FORM to
§NON-CLAIMS — the limbs, every bar, the bins, the dosing policy, the N rule, the seed ledger, the
⭐ CONJUNCT-LIVENESS audit and the frozen gate list — lands in **its own commit BEFORE any battery
is read**, so git corroborates frozen-before-sight instead of self-attestation. Measured numbers
arrive only in [§RESULT](#result) at the foot, and every number there is quoted FROM the committed
artifact (#229.2).

Authority chain: the **CARRY-BEAT CONTRACT**
[`CB-CARRY-BEAT-CONTRACT.md`](CB-CARRY-BEAT-CONTRACT.md) **§1 H-CB.1** (the scored half) and **§3
CB-T1**, dispatched by ruling **#267.5**. Instrument inputs:
[`CB-T0-DORMANT-LAYER1-SEAM.md`](CB-T0-DORMANT-LAYER1-SEAM.md) (the seam, its arming checklist and
its §COMMANDER CORRECTIONS) and [`CB-C0-DISPOSSESSION-CENSUS.md`](CB-C0-DISPOSSESSION-CENSUS.md)
(the bins and the baseline table). Exam-form precedents:
[`DV-T2-T1-CONVERGENCE-EXAM.md`](DV-T2-T1-CONVERGENCE-EXAM.md) and
[`EK-T1-HOLD-CONVERGENCE-EXAM.md`](EK-T1-HOLD-CONVERGENCE-EXAM.md) (frozen predicate, ex-ante N,
pre-named forks). Hygiene canon in full: **#250.3** · **#251.3** · **#256.2/.3** · **#258.3** ·
**#259.3** · **#260.2** · **#261.2** · **#262.2** · **#263.2** · **#264.2** · **#266.3(a,b,c)** ·
**#266.2(i)** · **#267.2** · **#163** · **#181.2** · **#200** · **#203** · **#229.2** · **#247**.

⭐ **THIS ROUND TOUCHES NO ENGINE CODE.** `src/**` is byte-untouched (X-SRC-UNTOUCHED, CB-C0's own
form): the seam is already built and banked; CB-T1 **arms it from the probe** and scores what the
world then does. The VISIBILITY half of H-CB.1 (让人真的看到) belongs to the FRONTEND RUNG (M-CB.3),
not to this stage.

## §0 THE FOUR BINDING OBLIGATIONS THIS ROUND DISCHARGES (#267.2/#267.3), each a named deliverable

| # | obligation (ruling) | where it is discharged |
| --- | --- | --- |
| **1** | ⭐⭐ **PREDICATE VALIDATION FIRST** (#267.2(iv)) — `beatsDefender` scored against THE RACE THE ENGINE ACTUALLY RUNS, before any beaten count is treated as a world event | **LIMB L1** + **G-RACE** + **G-REPLICA**. The world-truth side is `tryCapture`'s own outcome, read as `match.ball.owner`, over **the knock's own race window** (the carrier's engine-written `kickCooldown`) — never re-typed (#256.2) |
| **2** | ⭐ **CARRIER-ANCHORED t0** (#266.2(i)) — every separation/space quantity anchors at the CARRIER and says so | **§SEP**: every published separation is `|defender − CARRIER|` with t0 = the knock (touch arm) or the miss instant (commitment arm). CB-C0's Δ columns are inherited **as existence bounds only**; **no level is taken from them** |
| **3** | ⭐ **THE `wallTerm` FIX, BY FIELD NAME** (#267.2(i)) | **§HASH** + **G-HASH-ENVELOPE**, with the published acceptance test (cross-`OUT` digest identity **and** re-derivation from the committed artifact body alone) |
| **4** | ⭐ **THE RECOVERY DISTRIBUTION IN FULL** (#267.2(vi)/#267.3(3)) — min/quartiles/mean/max by arrival-speed bin, including the planted-whiff ≈0.1 s tail | **§RECOVERY** + **G-RECOVERY**. The LEVEL stands as derived; this stage MEASURES and never re-anchors |

## §FORM

### The world — ⭐ THE ARMED SUBSTRATE (CB-T0's shape (A)), stated and defended

Every arm is built as `new Match({seed, teamA, teamB, ...a4MatchFlags(3)})` — **the richest banked
world the programme ships**, which is the world CB-T0's own smoke read and therefore the only
paired baseline commensurable with it. ⚠ **DECLARED, LOUDLY: CB-C0's baseline table was measured in
BARE PRODUCTION** (350 seeds, every experimental flag off). The two shapes are **NOT the same
venue** — the EK-C0c lesson (#264: a yardstick must be measured in the venue the reading lives in).
⇒ this exam's own **paired OFF arm is its baseline**, and CB-C0's rows are printed **beside** them
as a labelled cross-venue reference, never differenced against them.

### The three arms — paired on the same seeds

| arm | doors | doser |
| --- | --- | --- |
| **OFF** | `cbCommitPhysics: false`, `cbTouchPast: false` | the doser runs in **SHADOW** (it evaluates eligibility and records the moment; it never writes `forcedTouchPast`) |
| **COMMIT** | `cbCommitPhysics: true` | shadow, as OFF |
| **TOUCH** | `cbTouchPast: true` | **LIVE** — the frozen policy below arms `Match.forcedTouchPast` |

⭐ The doors are **orthogonal by construction** and are armed one at a time, exactly as CB-T0's
smoke did: the commitment arm answers "what does the beaten LUNGER pay", the touch arm answers
"what does the beaten DEFENDER of an aimed knock do". H-CB.1 spans both and both are scored.

### The replicate

**The MATCH SEED is the cluster** (#20, CB-C0's own grain). Every rate, every gap and every CI is
computed by paired cluster bootstrap over seeds with **ONE shared resample-index matrix**, so every
difference is paired by construction.

### ⭐⭐ THE DOSING INSTRUMENT — frozen, probe-side, and DECLARED ARTIFICIAL

CB-T0's smoke doser (a backwards knock every second, unchosen) is **not an exam instrument** and is
not reused. The frozen policy, evaluated at the head of each tick on PUBLIC STATE ONLY:

```text
ELIGIBILITY (all conjuncts, re-derived from CB-T0's ARMING CHECKLIST — nothing inherited):
  E1  match.phase === 'playing'
  E2  ball.owner !== null, outfield (role !== 'GK'), not sentOff
  E3  owner.gkHoldTimer <= 0  AND  owner.kickCooldown <= 0        [the fork's own conjuncts]
  E4  match.dribbleTouch === null   — the ENGINE'S OWN "no knock in flight" state. This is the
      whole cadence rule: a dose can never overwrite a live knock's race, and because the marker
      lives 1.6 s (mechanics.ts, both push sites) doses are spaced by ≥ 1.6 s of play. No invented
      spacing constant exists anywhere in this probe.
  E5  at least ONE opponent inside CONTEST_RADIUS of the ball — the ledger's own CHALLENGER scope
      (carryBeat/mechanics `CB_CHALLENGER_RANGE = CONTEST_RADIUS`). ⚠ DECLARED: E5 SELECTS
      contested moments. That is deliberate — a knock with nobody to beat cannot answer the
      beaten-event question — and it is exactly the population every published rate is conditioned
      on.

THE AIM RULE (frozen, and deliberately INDEPENDENT of `beatsDefender`):
  dir = unit( ball.pos − nearestChallenger.pos )         "knock it away from the nearest man"
  nearestChallenger = the eligible opponent minimising |o.pos − ball.pos| (E5's own set).
  Degenerate |·| < 1e-9 ⇒ fall back to −owner.heading (recorded; never expected to fire).

⭐⭐ WHY NOT "into the least-covered space": any aim rule that MAXIMISES the predicate would select
the beaten cell for extremeness and make L1's validation self-fulfilling. The frozen rule prices
nothing, reads no predicate, and consults exactly one body.
```

**Its artificiality is DECLARED**: it has no goal-awareness, no space valuation, no timing
judgement and no appetite — **the choice seat is CB-T2's** (M-CB.2). What this exam scores is the
BEHAVIOUR OF THE EVENT, never the football quality of the policy.

## §CLAIM — H-CB.1's scored half, and the three limbs it is scored on

> **H-CB.1 (the scored half):** BEATEN EVENTS become real, measurable world events — a defender
> arriving at speed can be **eliminated for a physics-derived recovery interval** by a **well-timed,
> well-aimed touch** that **carries real cost** (the ball leaves the feet; the race is real).

### ⭐⭐ LIMB L1 — THE PREDICATE VALIDATES (obligation 1; scored FIRST, and everything downstream depends on it)

**The world-truth side, traced from `src/**` and never re-typed.** `performTouchPast` sets
`ball.owner = null`, writes `ball.vel = dir·speed` and sets the carrier's
`kickCooldown = TOUCH_RECOLLECT_BASE + push·TOUCH_RECOLLECT_PER_PUSH` — which IS `touchRaceWindow(push)`,
the very interval `beatsDefender` samples over. `stepBall` then RETURNS, so the knock tick performs
no capture, and from the next tick the engine's own `tryCapture` ladder runs. ⇒ for every knock:

```text
W        = the CARRIER'S OWN kickCooldown as the engine wrote it at the knock  [seconds]
captor   = the first player for whom `match.ball.owner === p` at any tick in (t0, t0 + W]
           — read off the engine's state, never inferred
D CAPTURED   ⇔ captor is THAT defender (him, not merely his side)
SIDE REGAINED⇔ captor is on that defender's side
RESOLVABLE   ⇔ the whole window is walked inside the match AND the phase never leaves 'playing'
               with no captor having appeared (a whistle / out-of-play / goal inside the window
               and before any capture ⇒ CENSORED, with its reason named and counted)
```

**The frozen agreement quantities** (resolvable challenger-observations only):

```text
S   = P( ¬D CAPTURED | predicate says BEATEN )                       the SOUNDNESS quantity
U   = P( ¬D CAPTURED | predicate says NOT beaten )
GAP = S − U                                                          the DISCRIMINATION quantity
```

**THE FIDELITY BAR, frozen before any battery:**

| # | bar | value | why THIS number |
| --- | --- | ---: | --- |
| **L1a** | **S ≥ 0.95** | 0.95 | The predicate asserts the defender's OWN motion model cannot meet the ball inside the window, and the reachable disc `½at²` is a **declared over-estimate in the DEFENDER's favour** (CB-T0 §HONESTY 1) while the engine's capture ladder is strictly harder than "be within CONTROL_RADIUS". A sound predicate should therefore be violated only by paths it does not model (a rebound off the body, a whistle, a deflection): **5 % is the allowance for those, and nothing else** |
| **L1b** | **GAP ≥ 0.05** and the paired cluster-bootstrap 95 % CI on GAP **excludes 0** | 0.05 | The not-beaten cell's own no-capture rate is bounded far from 0 (five other opponents and six teammates contest the same loose ball, and the knock goes away from the nearest man), so the ACHIEVABLE gap is small by construction. The claim being scored is that the predicate carries **real information about the engine's own race**, resolved at set grain — a directional-information bar, **declared as such, not a calibration bar** |
| **L1c** | **NON-VACUITY at claim grain** | ≥ 200 resolvable observations in **each** cell, and ≥ 8 seeds contributing **both** cells | a gap between an empty cell and a full one is not a measurement |

**REPORTED beside, never gated**: `P(¬SIDE REGAINED | beaten)` vs `| not beaten` — the second
quantity #267.2(iv) names — and the censoring table with every reason.

⭐ **If L1a or L1b fails, F-CB1-a fires**: the beaten event is **NOT YET a world event**, an honest
negative, and L2/L3's beaten-set readings are demoted to predicate-conditioned descriptions in the
same breath. **This is a pre-named fork, never a silent re-definition of the predicate.**

### ⭐ LIMB L2 — BEATEN EVENTS BEHAVE (the physics-derived elimination is real)

* **L2a — THE PRICE IS KEYED TO THE ARRIVAL, not a constant.** In the COMMITMENT arm, the mean
  physics-derived recovery interval is **strictly increasing across CB-C0's five arrival-speed
  bins** (s0 < s1 < s2 < s3 < s4), and the **s4 − s0** difference's paired cluster-bootstrap 95 %
  CI **excludes 0**. (The incumbent world's answer is a flat 1.2 s in every bin — the falsifier is
  real and is exactly what the OFF arm shows.)
* **L2b — THE ELIMINATION IS REAL, carrier-anchored.** In the TOUCH arm, for the challengers of
  each knock, **time to RE-ENGAGEMENT** = the first tick after the knock at which that defender is
  within `CB_TACKLE_RADIUS` of the ball (the engine's own challenge radius — the distance at which
  the duel is offered at all). Two conjuncts:
  * **(i)** median re-engagement time of the **predicate-beaten** set **>** that of the
    **not-beaten** set, gap CI excluding 0;
  * **(ii)** the beaten set's **median re-engagement time ≥ the median race window W** — he is
    really out of the play for at least as long as the race he lost lasted.
  ⚠ **DECLARED**: (i) is directional-by-expectation (a defender who cannot reach the ball in W is
  unlikely to be at it quickly). It is scored anyway because its falsifier is real —
  `beatsDefender` is a **race-window** test, not a re-engagement test, and a beaten defender who
  jogs two metres and re-arrives at once would break it. (ii) is the conjunct that can genuinely
  fail and is the one that carries "eliminated".
* **REPORTED, never gated**: §RECOVERY's full distribution (obligation 4); the beaten defenders'
  own **derived** `recoveryInterval` at the knock (brake / turn / close / total); §SEP's
  carrier-anchored separations at t0 and at re-engagement.

### ⭐ LIMB L3 — THE TOUCH COST IS HONEST (the ball is genuinely at risk)

* **L3a — THE SPLIT IS NON-VACUOUS AT CLAIM GRAIN.** After a knock, the loose-ball race resolves
  **both ways**: the knocking side regains **> 0** times and loses **> 0** times, pooled **and** at
  per-seed grain (≥ 80 % of battery seeds show at least one of each). *"The knocking side always
  retains" is exactly the vacuity this limb exists to exclude.*
* **L3b — THE COST IS REAL vs HOLDING.** `P(the knocking side is in control at the knock's own
  possession-marker expiry, t0 + 1.6 s)` in the TOUCH arm is **strictly below** `P(the same side is
  in control 1.6 s after a SHADOW-ELIGIBLE moment)` in the OFF arm, with the seed-clustered
  bootstrap 95 % CI on the gap excluding 0. The horizon **1.6 s is traced**: it is the engine's own
  knock-possession marker lifetime, `match.dribbleTouch = { gid, until: simTime + 1.6 }`, written
  identically by `performDribbleTouch` and `performTouchPast`.
  ⚠ **DECLARED**: the arms diverge after the first dose, so eligible moments are **not
  event-matched** across arms; the comparison is **distributional at seed grain**, and it is
  reported as such.

**THE EXAM'S VERDICT** = L1 **and** L2 **and** L3, each limb's conjuncts in full. Every limb is
published whether or not the conjunction holds.

## §WORLD — the world effects: **REPORTED, NEVER GATED** (rung-one honesty, the contract's own words)

Measured in **BOTH armed arms and the OFF arm** and printed beside CB-C0's bare-production
reference (the venue difference declared above):

| family | rulers |
| --- | --- |
| **churn** | turnovers per match · mean possession-spell length (s) · spells · standing duels per match — **DV-C0's segment/turnover semantics as CB-C0 inherited them** (a possession segment closes on opponent control / dead ball / goal / match end) |
| **pressing** | **pressed-share** of open-play first receptions at `PRESSURE_R = TOUCH_CONTROL_DIST` (the banked #173 population and radius) · **pressed-loss ratio** = P(lost \| pressed first reception) / P(lost \| unpressed) — the tempo-census H-169a discriminator's own form. ⚠ DECLARED: this is a **reduced re-implementation** of the banked walker (episode-grain outcomes only), so its LEVEL is not commensurable with the banked 1.79–1.97; it is read **within this battery, across arms** |
| **institutions** | fouls · yellows · reds/send-offs · penalties, per match (⚠ #267.3(2): `foulP` is per-miss identical — any move is pure volume) |
| **goals** | goals · shots per match |

⭐ **NO FOOTBALL GUARD GATES THIS EXAM.** The exam idiom's guards exist to protect a SHIPPING
decision; this rung ships nothing (§ROAD B) and the contract's own words are *"world effects on
churn/pressing REPORTED, never gated"*. The gate list below therefore contains **no football
ruler**, and **F-CB1-c is bound to the HARD instrument gates instead** (the #179 red lines), which
are this rung's only STOP class. Stated here so that the absence is a decision, not an omission.

## §BINS — frozen, and every edge inherited with its arithmetic

**Arrival-speed bins = CB-C0's own** (quarters of the base `v*`, so this exam's rows can be laid
beside the census's without re-binning):

```text
v*  = sqrt(2 · ACCEL · R_TACKLE) = sqrt(2 × 14 × 1.15) = sqrt(32.2) = 5.674504 m/s
edges  1.418626 · 2.837252 · 4.255878 · 5.674504      (s0 walk · s1 jog · s2 run · s3 drive · s4 OVERCOMMITTED)
```

⭐ **THE ARRIVAL SPEED IS INVERTED FROM THE ENGINE'S OWN WRITE, not re-measured**: the armed miss
branch writes `stunTimer = brake = |v| / a`, so `|v| = stunTimer × accel` **exactly**. G-RECOVERY
cross-checks that inversion against the taker's observed post-step speed at the miss tick.

**Recovery-distribution statistics, frozen**: `min · q1 · median · q3 · mean · max`, per bin and
pooled, on the **total** (`tackleCooldown` as written) and on the **brake** leg (`stunTimer` as
written). ⭐ **THE MIN IS PUBLISHED IN EVERY ROW** — #267.2(vi)'s unpublished floor, the
§CHOICES-2 planted-whiff ≈ 0.1 s tail.

## §SEP — the separation instrument (obligation 2)

Every separation quantity published by this stage is **`|defender − CARRIER|`**, with the CARRIER
being `ball.owner` at t0 (the knock, or the challenged carrier at the miss instant), and it says so
in the table header. ⚠ **CB-C0's `Δsep`/`Δspace` columns are consumed for NOTHING**: no level, no
tolerance, no bound is taken from them (#266.2(i)). Published: separation at t0, at t0 + W (touch
arm) / t0 + recovery (commitment arm), and at re-engagement.

## §HASH — the #267.2(i) fix, BY FIELD NAME, and its acceptance test

```text
THE HASHED BODY carries:  precisionTerm · cap · nStar · ran · rarestPerMatch · every measured cell
THE UNHASHED ENVELOPE carries:  wallTerm · projectedHours · msPerMatch · wallMs · generatedAt ·
                                head · outPath · preflight flags · the G-DET digests
⇒ nStar stays IN THE BODY and stays REPRODUCIBLE because the wall term is computed from the
  COMMITTED SIZING ARTIFACT's envelope (a fixed, committed number), never from this run's realized
  wall clock. A re-run on another machine reads the same committed file and derives the same N*.
```

**THE ACCEPTANCE TEST (run in-probe, published in §CHECKS):**
1. **CROSS-`OUT` IDENTITY** — two invocations differing only in the output path produce **identical
   `resultSha256`** (checked directly in-probe by re-canonicalising the body against a MUTATED
   envelope: different path, doubled wall values, a different timestamp).
2. **RE-DERIVATION FROM THE COMMITTED ARTIFACT BODY ALONE** — the written file is read back,
   `resultSha256` and `envelope` are stripped, and the canonical hash of what remains equals the
   published digest. *This is the check a verify on another machine will run.*
3. **THE FORBIDDEN-KEY SCAN** — a deep walk of the hashed body finds **none** of
   `wallTerm · projectedHours · msPerMatch · wallMs · generatedAt · head · outPath · elapsedMs`.

## §NRULE — frozen before the sizing smoke ran

```text
N* = min( ceil(60 / rarestScoredCellPerMatch) ↑12,
          floor(0.5 h / (msPerMatch × 3 arms × 2 X-DET)),
          200 )
```

60 events ⇒ a count's relative SE ≈ 13 %, the precision at which an ORDERING is readable — DV-C0 /
CB-C0 / CB-T0's own target, inherited with its justification. ⭐ **THIS STAGE'S NUMERATOR: the
RARER of L1's two cells** — resolvable challenger-observations that the predicate calls BEATEN, and
those it calls NOT BEATEN — per match in the TOUCH arm. (Which of the two is rarer is not knowable
before the smoke; the rule names the minimum of them, so it is frozen without pre-judging.)
`rarestScoredCellPerMatch` and `msPerMatch` are the **only two numbers** the full run reads out of
the committed sizing artifact; **no rate, share, gap or verdict is ever read from it**. The 200 cap
is the honest seed-budget cap; the ↑12 floor is the identity-receipt minimum.

⭐ **THE ZERO-EVENT CLAUSE** (frozen with the rule): if the sizing smoke sees **zero** in either
cell the precision term is UNBOUNDED — it cannot be estimated from a zero count and this stage will
not invent a floor — so the wall term and the cap bind, and the zero itself is published as the
first fact of §RESULT.

## §SEEDS — band **12,473,000 – 12,473,999** (#267.5's pre-registration)

| item | block | status |
| --- | --- | --- |
| everything consumed through CB-T0 | the probe's `CONSUMED` table (inherited in full, CB-T0's own band included) | prior |
| identity receipts + direct reads | **12,473,000 – 12,473,011** (12) | consumed here |
| ⭐ exit-semantics GUARD block — where EVERY preflight invocation is routed | **12,473,050 – 12,473,099** | reserved |
| sizing smoke | **12,473,100 – 12,473,119** (20) | consumed here |
| ⭐⭐ **the battery** | **12,473,200 – 12,473,399** (N ≤ 200) | consumed here, exact sub-band in §RESULT |
| G-WORLD construction seed | **12,473,999** | constructed, never stepped |
| free | 012–049 · 120–199 · 400–998 | available to CB-T2 |

Disjointness is computed **in-probe** for **every interval this stage consumes** — the sizing and
battery blocks included, closing #267.2(ii)'s scope defect by construction — against the COMPLETE
consumed ledger.

**STATS**: stats stream base **109,800** (#267.5's floor), step **200**, minimum gap 200 to every
published base. ONE bootstrap, **2,000 resamples**, cluster = match seed, one shared
resample-index matrix (so every gap is paired by construction). Consumption is recorded in §RESULT.

## §LIVENESS — ⭐ THE CONJUNCT-LIVENESS AUDIT (#266.3(b)), run BEFORE the gate list froze

Every candidate conjunct was read for dead-by-construction shapes (tautologies, `x === x`,
subtraction-defined partitions, array-LENGTH assertions — CB-T0 leaked one of exactly that shape,
#267.2(iii)). **Five candidates were DEMOTED before the freeze** and are recorded here instead of
being gated:

| demoted candidate | why it is dead by construction |
| --- | --- |
| `resolvable + censored === knocks` | the classifier assigns exactly one label per knock in a switch — the sum cannot fail for any input |
| `beatenCell + notBeatenCell === challengerObservations` | same shape: the two cells are the two branches of one boolean |
| `ENV_WHITELIST.length === k && ENGINE_DOORS.length === m` | the #267.2(iii) recurrence, verbatim — asserts an array's own length, unfalsifiable by any probe input. The refusals are exercised **by hand** in §CHECKS instead |
| `beatenReengagement.length ≤ challengerObservations.length` | an array populated only inside the branch that already appended to the other |
| `bootstrapResamples === 2000` | a literal compared to itself through one variable |

⇒ The **surviving live claims** in their place: the classifier's own **per-knock reason is NAMED**
and every resolvable knock carries a captor-or-null decided inside `(t0, t0+W]` (falsifiable by a
knock whose window is walked wrong); the **env refusals are exercised as real invocations**; and
every cell count is re-derived from the stored per-seed rows (falsifiable by a storage/aggregation
mismatch). Each gate below states its **coverage set**, and ⭐ **NEW THIS ROUND (#266.2(vii) /
#267.2(vi), asserted-not-enforced twice): every mutant must flip EXACTLY its own conjunct — the
mutant runner asserts that all OTHER conjuncts of the same gate SURVIVE the mutation**, and a
mutant that knocks over a second conjunct is a RED, not a pass.

## §GATES — frozen ex ante, ALL computed in-probe (#181.2). **22 HARD rows — count them**

⭐ #250.3(i): the probe freezes this list as `FROZEN_GATE_NAMES` and the artifact's gate-object key
set must equal it exactly (minus G-SUITE, which runs outside) or the probe exits 1 before writing.

| # | gate | predicate | kind |
| --- | --- | --- | --- |
| 1 | **G-DET** | the deterministic core runs **twice**, canonical digests identical; pass B never reads pass A's memo | HARD |
| 2 | **X-SRC-UNTOUCHED** | `git diff --stat -- src` **and** `git status --porcelain -- src` both empty — this round is INSTRUMENT-ONLY | HARD |
| 3 | **X-FP-PROD** | the shipped league fingerprint `57b0bdab…c673` re-derived **in this process**, unchanged | HARD |
| 4 | **G-WORLD** | every match of every arm IS the armed substrate with exactly the intended CB keys and no foreign door; checked on a never-stepped construction seed **and** on every battery match. Coverage: 5 conjuncts, 5 mutants | HARD |
| 5 | **G-ARMS** | the arm-configuration predicate DERIVED FOR THIS EXAM (OFF = both keys false + shadow doser · COMMIT = commit only · TOUCH = touch only + live doser · the three arms walk the SAME seeds · no arm sets a banked CB key it should not). Coverage: 6 conjuncts, 6 mutants, each RE-INVOKING the predicate | HARD |
| 6 | ⭐⭐ **G-REPLICA** | **COMMENSURABILITY (#256.2).** For **EVERY** knock the probe's reconstruction of the engine's own knock equals the engine's own bookkeeping: reconstructed challenger count = Δ`cbLedger.touchPastChallengers`; reconstructed predicate-beaten count = Δ`cbLedger.touchPastBeaten`; `|ball.vel| = speed` and `ball.vel = dir·speed` componentwise to 1e-12; and the inverted push satisfies `touchRaceWindow(push) = the carrier's written kickCooldown` to 1e-12. **Zero tolerated mismatches** | HARD |
| 7 | ⭐⭐ **G-RACE** | **THE WORLD-TRUTH SIDE IS THE ENGINE'S OWN.** The race window of every knock IS the engine-written `kickCooldown` (never a probe constant); the captor is read from `match.ball.owner` post-step (never inferred from geometry); every knock carries a NAMED resolution reason; every resolvable knock's captor-or-null was decided strictly inside `(t0, t0+W]`. Coverage: 4 conjuncts, 4 mutants | HARD |
| 8 | **G-BARS** | the frozen bar literals in the artifact ARE §CLAIM's (S ≥ 0.95 · GAP ≥ 0.05 · cells ≥ 200 · seeds ≥ 8 · L2b/L3 forms) and every limb verdict re-derives from the stored cells alone | HARD |
| 9 | ⭐ **G-CELLS** | per-seed / per-cell counts are IN the artifact, and **every published rate, gap and CI re-derives from those stored cells alone** (#256.3) — recomputed in-probe from the stored structure, not from the live accumulators | HARD |
| 10 | **G-BOOT** | the paired cluster bootstrap: 2,000 resamples, cluster = seed, **ONE shared resample-index matrix**, percentile 95 %; the matrix is proved shared (the same index rows drive every quantity) | HARD |
| 11 | **G-NONVAC** | non-vacuity at claim grain for every scored cell: L1's two cells ≥ 200 and ≥ 8 two-cell seeds · every arrival-speed bin non-empty in the commitment arm · L3a's both-ways split | HARD |
| 12 | ⭐ **G-RECOVERY** | every stored recovery total equals the engine-written `tackleCooldown` and every brake equals the engine-written `stunTimer`; the arrival-speed inversion `|v| = brake × accel` agrees with the observed post-step speed to 1e-9; the published min/quartiles/mean/max re-derive from the stored per-event values; **the min is present in every row** | HARD |
| 13 | **G-DETECT** | the duel detector is CB-C0's, narrowed (CB-T0 §DEV 7): **per tick**, detected armed-recovery events equal the `cbLedger.recoveries` delta in the commitment arm, and detected wins + misses equal the engine's own tackle counter over the match | HARD |
| 14 | ⭐ **G-DOSE** | the frozen dosing policy is enforced and audited: every dose satisfied E1–E5 at the instant it was armed; the aim rule consulted only the nearest challenger; the OFF and COMMIT arms' `forcedTouchPast` is **never** written (their shadow eligibility is recorded only); armings, firings and consumed-without-firing are all counted and reconciled | HARD |
| 15 | **G-LEDGER-ARMS** | every `cbLedger` counter is **0** in the OFF arm; the commitment arm's touch counters are 0; the touch arm's armed-duel counters are 0 — the doors really are orthogonal in this battery | HARD |
| 16 | **G-SEED** | every interval this stage consumes — **identity, reads, sizing, battery, world seed** — proved disjoint from the COMPLETE consumed ledger and ordered (#267.2(ii) closed by construction) | HARD |
| 17 | **G-STATS** | stats base 109,800, step 200, min gap ≥ 200 to every published base | HARD |
| 18 | ⭐ **G-ENV-CLEAN** | **WHITELIST-OR-REFUSE incl. the ENGINE's own doors** (`EDS_BUNDLE`, `EDS_TRACE_CHOICE`, `EMERGENT_POS`, the five `constants.ts` scale doors, `EDS_BUNDLE_ARMED`): any unrecognised `CBT1_*` or any engine door is a FATAL refusal (exit 2); every override — **`CBT1_OUT` included** — makes the run a PREFLIGHT routed onto the guard block, reds this gate, and may never write a canonical repo path (guarded at parse time **and** on the RESOLVED absolute path at the write) | HARD |
| 19 | ⭐⭐ **G-HASH-ENVELOPE** | **#267.2(i) DISCHARGED BY FIELD NAME**: the three-part acceptance test of §HASH — mutated-envelope digest identity, re-derivation from the written body alone, and the forbidden-key deep scan. Coverage: 3 conjuncts, 3 mutants | HARD |
| 20 | **G-N** | N* **is** the frozen §NRULE output computed from the committed sizing artifact (two numbers only), and the battery ran at N* (mode-conditioned, #250.3) | HARD |
| 21 | ⭐⭐ **G-MUTANTS** | every conjunct in every NAMED coverage set carries a mutant that **RE-INVOKES the gate's own function** on a mutated input, and ⭐ **flips EXACTLY that conjunct — all others of the same gate must SURVIVE** (the twice-recurring asserted-not-enforced defect, built this time); `uncoveredConjuncts` machine-checked empty | HARD |
| 22 | **G-SUITE** | FULL `npm test` green + `npx tsc --noEmit` clean, run OUTSIDE the probe; the known load-timeout pattern dispositioned only if each red file reproduces GREEN ALONE on this tree | HARD |

**Hand-counted headline**: rows 1–21 are computed in the probe and land in the artifact's `gates`
object; **G-SUITE** runs outside it. Every headline in this document quotes **21 probe gates +
G-SUITE = 22**.

**Pre-named FAIL ⇒ STOP** (#179's red lines): any HARD gate failing, any `src/**` diff at all, any
seed-block collision, or any existing test breaking (a STOP-and-report, never a test edit).

## §FORKS — pre-named, printed MECHANICALLY, never resolved here (#203)

* **F-CB1-a** — **L1 fails** (S < 0.95 or GAP's bar/CI fails) ⇒ *"the beaten event is NOT YET a
  world event"*: an honest negative, the commander's to adjudicate. Every downstream beaten-set
  number is re-labelled **predicate-conditioned**, in the same commit.
* **F-CB1-b** — **L1 passes but L2 or L3 fails** ⇒ a **diagnostic**: beaten events are real but
  either the elimination is not what the physics claims (L2) or the touch does not carry the cost
  the contract asserts (L3). Diagnosis, not adjudication, and no re-tuning here (#200).
* **F-CB1-c** — **any HARD gate breach** ⇒ **STOP** and report (this rung gates no football ruler;
  see §WORLD).

**A fired fork is STILL A COMMIT.** The honest result lands; the adjudication is the commander's.

## §ROAD B — nothing ships

Both doors remain **OFF in every production path** (CB-T0's §ROAD B unchanged), `forcedTouchPast`
is written only by this probe, `src/**` is byte-untouched, and no gene, book, save field or
frontend affordance is added. **Nothing about the game the user plays changes in this round.**
Road B statement: fingerprint `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`
— **must not move**.

## §NON-CLAIMS

CB-T1 claims **nothing** about whether the armed world is BETTER football; it does not adjudicate
the `p·χ` level (#267.3(1) ruled 甲 — untuned — and this stage measures the world as it is), does
not re-anchor the recovery level (#267.3(3)), does not price, choose or evolve a touch-past
(CB-T2's seat, M-CB.2), does not touch the frontend (M-CB.3's rung), makes **no tempo-cure claim**
(§4 of the contract: the churn linkage is REPORTED), discharges none of the #248 debts, and cannot
authorize CB-T2 — only the commander can. The dosing policy is an **instrument**, and no statement
about its football quality is made or implied anywhere in this document.

<a id="result"></a>

## §RESULT

*(populated by the results commit — every number quoted from the committed artifact)*
