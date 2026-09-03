# RC-C0 — THE COOPERATION CENSUS (球出脚前,接球人能从出球人的身体读到球要来吗?)

> **The census that opens the RC arc.** Authorized by **COMMANDER RULING #366 item 3**,
> consuming the user's ratification of the passing-system audit's recommended order, verbatim:
> **「按照推荐和workflow走」**. Bound by
> [`RC-RECEIVER-COOPERATION-CONTRACT.md`](RC-RECEIVER-COOPERATION-CONTRACT.md) (§-1 doctrine,
> §0 code facts, §2 the seat family, §3 this stage's scope and pre-commitment).
> Lineage: **#360 item 4** (the cooperation seat named a HELD DOOR WITH ITS OWN NUMBER —
> DX-C2 §R3's **+3.233 m** meetable-only calibration gap) →
> [`PASSING-SYSTEM-AUDIT-2026-09-02.md`](PASSING-SYSTEM-AUDIT-2026-09-02.md) **§2.1** (the same
> hole re-found from the receiver's own chair and ranked first) → **#366**.
> Census form of record: [`DX-C2-MEETABILITY-CENSUS.md`](DX-C2-MEETABILITY-CENSUS.md) — this
> census mirrors its structure, and its §P.A ACCOUNT and §P.D CALIBRATION READ are reused
> **byte for byte in substance**.
> Instrument: `scripts/probes/rc-c0-cooperation-census.ts`.
> Artifact: `docs/world-model/data/rc-c0-cooperation-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. It scores no hypothesis, arms no
> mechanism and makes no football claim. **IT ADJUDICATES NOTHING** except the ONE
> pre-committed licence rule frozen at §P.C, whose verdict word it PRINTS FROM THE RULE —
> the commander rules.
> ⛔ **X-SRC-ZERO**: no file under `src/` is created or edited. The probe CALLS the shipped
> exports and reads `Match` state per tick. **THERE IS NO WRAPPER AT ALL** — `gLockstep`
> proves observed ≡ unobserved byte for byte.
> ⛔ **WORLD 12'S COMPOSITION AND BYTES ARE UNTOUCHED** (contract M-RC.5): this stage is Road
> B, the user's world-12 play-test gate stays open in parallel (#366 item 2), and the RC
> ENTRY waits for the user's verdict.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

Ruling #366 item 3, the scope this census instruments, verbatim:

> *"(a) **THE CUE** — for every wind-up flight, at every pre-release tick, the OUTWARD
> alignment cue per same-side off-ball mate (the angle between the passer's `heading` and the
> passer→mate bearing — external fields ONLY; the instrument reads the truth record solely to
> LABEL the target and the window, which is the census's right): P(best-aligned mate = the
> target) at the LAST pre-release tick against the uniform prior; the SHARPENING curve across
> the window; the LOCK tick (from when the target stays best-aligned); the ambiguity count;
> the turn direction (is the passer turning TOWARD the target).*
>
> *(b) **THE WINDOW** — wind-up length W; the target's MEASURED post-strike start delay
> (ticks from release to his first `ReceivePass`); the DEAD TIME (lock-to-release + start
> delay); the KINEMATIC BOUND `max(topSpeed, 0.1) × deadTime` (the traced account's own speed
> law) against the meetable-only arrival gap RE-MEASURED on this composition (DX-C2 §P.D's
> face, byte for byte in form). ⛔ DX-C2's +3.233 m is CONTEXT — a different composition; no
> Δ across batteries.*
>
> *(c) **THE ARRIVAL ANATOMY** — on meetable carried flights (the whole carried class
> beside): the target's `action.type` at arm and at release; his velocity component toward the
> elected point at both; his signed along-line and lateral offset when the ball reaches the
> point; the outcome partition and the collection distance downstream.*
>
> *⭐ **ONE PRE-COMMITMENT (frozen at §P.C in exact form):** the seat is LICENSED iff
> Δ = P(best-aligned = target at the last pre-release tick) − 1/k̄ is ENTIRELY ABOVE ZERO at
> the cluster-bootstrap 95 % CI; otherwise the reading half has NO honest percept — the seat
> is BLOCKED and the arc returns to the user with the OFFER channel named. **PRE-COMMITTED
> READ (no gate):** bound ≥ gap ⇒ wind-up reading alone shapes the seat; bound < gap ⇒ the
> seat is wind-up reading PLUS a named earlier-cue door (the look · the offer) — never a
> truth read."*

**In plain football language.** Today the receiver's first news of a pass is the ball. The
passer holds it for a few tenths of a second, turns his hips toward the man he has picked —
and nobody on his own side reads that. Three questions have to be answered before anyone
builds a receiver who *does* read it:

1. **(a) Does the body actually give it away?** If you were standing on the pitch watching
   only which way the passer is facing, could you pick out the man he is about to pass to —
   better than guessing? And **how early**: does it become obvious only as his foot goes
   back, or a beat before?
2. **(b) Is the wasted time worth any metres?** From the moment the body has named him to the
   moment he actually sets off, how long does the receiver stand still — and at his own top
   speed, how far could he have come in that time? Then: how far short of the ball's landing
   point *was* he? If the wasted window is worth more metres than he was short, reading the
   wind-up is enough on its own. If it isn't, the receiver also needs an earlier cue.
3. **(c) What was he doing instead?** At the moment the passer picked him and at the moment
   the ball left the foot — was he coming toward the ball, drifting, or walking back into
   shape? And when the ball arrived at the chosen point, was he short of it or past it?

⛔ Nothing here is decided. The census publishes the three answers, prints the ONE frozen
verdict word, and stops.

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE CUE — external fields only

For a wind-up whose passer is `P` and whose truth-record target is `T`, at every pre-release
tick `t`, and for every same-side off-ball mate `i`:

| quantity | frozen form |
|---|---|
| **θ_i(t)** | the angle in RADIANS between `P.heading` (a unit vector — the shipped external body direction, `Player.heading`, anchored) and `unit(mate_i.pos − P.pos)`, **both read at tick t** |
| degenerate | a bearing of length ≤ 1e-6 (mate standing ON the passer) or a heading of length ≤ 1e-6 names no angle ⇒ **NaN**, and that mate is EXCLUDED from the tick's vector |
| **rank-1** | `argmin_i θ_i(t)` over the finite entries; **ties break to the LOWEST gid** |
| **k** | the number of mates in the vector, read at the **LAST pre-release tick**; `k̄` = its mean over the population |
| **THE READ SET** | `pos` and `heading` — **nothing else**. ⛔ Not `faceTarget`, not `pendingPassWindup`, not `pendingPass`, not `action`/`scores`, not any TeamBrain designation, not `info.genome`. `gCueChannel` proves it with a fixture: two passers with IDENTICAL `pos`/`heading` and DIFFERENT private targets yield a BYTE-IDENTICAL θ vector, while a REVERSED external heading DOES move it (the live half). |

**THE MATE POPULATION.** Every same-side body that is not the passer and is on the pitch
(`sentOff === false`) — **all five in 6v6, the KEEPER INCLUDED**. `k` is published per flight
(as `k̄`), and the **keeper-excluded variant is published BESIDE the primary** (flights whose
target IS the keeper are excluded from that variant, stated).

**THE CENSUS'S RIGHT, STATED.** The instrument READS the truth record
`pendingPassWindup.{gid, targetGid, aim, aimLead, readyTick}` ONLY to LABEL the target, the
window and the elected point `E = aim (+ aimLead when non-null)`. The CUE is computed from
external fields alone. This is the census's right (#366 item 3) — and it is not the seat's:
RC-T0's percept may not read any of those fields (contract M-RC.1).

**THE TICK INDEXING (anchored, with line receipts in the artifact).** `armPendingPass` writes
`readyTick = this.stepCount + wTicks + bkTicks` during the brain phase of the arm tick, and
`resolvePendingPassWindup` runs at the **HEAD** of the step whose `stepCount >= readyTick` —
before brains and before physics — behind the guard
`if (!this.o1PassWindup || pp === null || this.stepCount < pp.readyTick) return;`. The probe
reads state **after** `m.step(DT)`, so:

* the record is observable at the END of ticks **t0 … readyTick − 1** — these are THE
  PRE-RELEASE TICKS;
* the **RELEASE TICK is `readyTick`**;
* **W = readyTick − t0** ticks (= the count of pre-release ticks), and W in sim-seconds is
  `W · DT`.
* ⚠ A record can sit live AT OR PAST `readyTick` when a dead-ball phase gate defers the
  head-of-tick resolve. Those ticks are **COUNTED** (`context.strandedTicksPerMatch`) and
  **EXCLUDED** from every cue face.

**THE FACES OF (a).** `cue.pLockLast` (P(rank-1 == T) at the last pre-release tick) ·
`cue.uniformPrior` = **1/k̄**, computed as `Σn / Σk` so it re-derives from the same per-seed
cells · the Δ contrast `delta.lockVsPrior` with a **cluster bootstrap (clusters = seeds, 2,000
draws, rng seeded from the block base — DX-C2's estimator)** · the **SHARPENING CURVE** at the
arm tick, the window midpoint (`t0 + floor((L−1)/2)` over the L observed ticks) and the last
tick, plus **normalized-window-position DECILES** (`u = j/(L−1)`, bin `min(9, floor(10u))`,
bins stored) · the **LOCK TICK** = the first tick from which T is rank-1 **through** the last
pre-release tick, published as **ticks-before-release = readyTick − lockTick** (bins stored),
with a **`never locks` bucket** counted (T is not rank-1 at the last tick) · **θ_T at t0 and at
the last tick** (5° bins to 180°, stored) · **AMBIGUITY at the last tick** = the count of
non-target mates with `θ_i ≤ θ_T` (0 = unambiguous; bins stored) · **THE TURN CUE** = the
share of consecutive window tick-pairs on which θ_T **DECREASES**, against the same share for
**THE FROZEN RIVAL** (the non-target mate with the smallest θ at the LAST pre-release tick).

### §P.B THE POPULATION AND THE CLASSES

**THE POPULATION = every WIND-UP flight**: a `pendingPassWindup` record live from its arm tick
`t0` to its last pre-release tick. Group (a) covers **every** wind-up observed, cancellations
included (a cancelled wind-up still gave its evidence away). Groups (b) and (c) require the
**RELEASE**, detected as: the tracked record disappears at a tick `≥ readyTick` **and**
`pendingPass` changed on that same tick with `passerGid === record.gid` and
`targetGid === record.targetGid`. Records that end otherwise are counted as
`context.cancelledEarlyShare` (before `readyTick` — a shot arm, an eviction, a lost ball) or
`context.cancelledAtResolveShare` (at `readyTick`, killed by the resolve's own interruption
guards).

**THE DELIVERY CLASSES** (DX-C2's own): **`toFeet`** (`aimLead === null`) vs **`carried`**
(`aimLead` non-null — the led/carried ball).

**MEETABILITY** — DX-C2 §P.A, **reused in substance byte for byte**, read at the ARM instant:

| quantity | frozen form | trace |
|---|---|---|
| `tBall(E)` | `dist(passer, E) / PTP_FLIGHT_SPEED` | the chooser's own flight law, the `/ 18` family member (anchored) |
| `tMate(E)` | `dist(mate, E) / max(mate.topSpeed, 0.1) + 0.15` | `interceptBall`'s OWN time-to-point form, byte for byte (ts clamp ×1, the `/ ts + 0.15` form ×2 — both branches, anchored) |
| `margin(E)` | `tBall − tMate` | positive ⇒ the mate is at the point BEFORE the ball |
| **MEETABLE** | `dist(mate, E) ≤ CONTROL_RADIUS` **OR** `margin ≥ 0` | the presence clause is the engine's own control cut; the sign cut is the account's own zero. **NO taste threshold.** |

**THE ARM INSTANT, DECLARED.** The mate's arm-time position is the record's own `aim` —
**exact**, so `dMate = |aimLead|` by construction. The **passer's** position and the mate's
`topSpeed` are read at the **END of the arm tick**, because with **no wrapper** the mid-tick
capture DX-C2 took inside `armPendingPass` is not observable from state. ⚠ This is a **stated
deviation** from DX-C2's instant: up to one tick (1/60 sim-s ≈ 0.13 m at top pace) of drift on
the passer's position only.

### §P.C THE LICENCE RULE — carrying #366 item 3's PRE-COMMITMENT, in exact form

> **LICENSED** ⇔ the 95 % cluster-bootstrap CI of **Δ = pLockLast − 1/k̄** lies **ENTIRELY
> ABOVE ZERO** (i.e. `ciLo > 0`).
> **BLOCKED** ⇔ otherwise (the interval contains zero, or lies entirely below it).

The verdict **word** is printed from the rule; the per-seed cells it re-derives from are stored
(`cueHitLast`, `cueN`, `cueKSum` per seed), and `gFaces` re-derives the verdict itself off the
serialized artifact. #366 item 3 states what each verdict means downstream; **this executor
does not act on it — the commander rules.** The keeper-excluded Δ is published BESIDE and is
**NOT** part of the rule.

### §P.D THE WINDOW AND THE BOUND

| quantity | frozen form |
|---|---|
| **W** | `readyTick − t0` ticks; the sim-second face is `W · DT` |
| **START DELAY** | ticks from the RELEASE tick to the first tick at which `target.action.type === 'ReceivePass'`. **CENSORED** if he never enters it before the flight retires — that bucket is COUNTED and named: cut out / ball lost / the argmax re-decided |
| **PC HOLD** | **OBSERVED, never assumed**: `match.pcLatency`'s own hold record for the target gid, matched on `armedTick === releaseTick` and `klass === 'passRelease'`, published as its **APPLIED `ticks`** (the #280 form — never nominal). A pure state read; the seat's mutating `holdFor` accessor is NOT called. Where no such hold can be matched the flight enters NO pcHold face and the OBSERVED SHARE is published — an unobserved hold is never imputed as zero |
| **DEAD TIME** | `(releaseTick − lockTick) + startDelay`, in ticks and sim-seconds. A **never-locking** wind-up contributes its **START DELAY ALONE** (stated) |
| **KINEMATIC BOUND** | `max(target.topSpeed@t0, 0.1) × deadTime` metres — the traced account's own speed law, **no new constant** |

Faces: distributions (bins stored) of W, start delay, dead time and bound over three groups —
the whole released population (`all`), the `carried` class, and the **MEETABLE CARRIED** class.

**THE GAP, RE-MEASURED ON THIS COMPOSITION** (the meetable carried class primary, the whole
carried class beside): DX-C2 §P.D's `predictedArrDist =
max(0, dMate − max(0, tBall − 0.15) · max(topSpeed, 0.1))` against the **MEASURED** arrival
distance — DX-C1/DX-C2's own arrival read: **receiver→E distance at the tick the ball's
along-line projection first reaches E**. Published as predicted / measured / **mean diff with
CI** (bins stored). Then **per flight `(bound − gap_flight)`** and **the SHARE with
`bound ≥ gap`**, both with CIs.

⛔ **DX-C2's published +3.233 m is DESIGN CONTEXT ONLY** — a different composition (the RA
price SHUT, world 11 + four doors) on a different block. **No Δ is computed across batteries
and none may be quoted.**

### §P.E THE ARRIVAL ANATOMY

On the **MEETABLE CARRIED** class (primary) and the whole **CARRIED** class (beside):

* the target's `action.type` **at t0** and **at the last pre-release tick** — counts over the
  **full `ActionType` vocabulary read off its own union** (23 labels, anchored) stored as bins,
  plus named faces for the frozen shortlist `ReceivePass · ChaseBall · SupportBallCarrier ·
  MakeRun · MoveToFormationSpot · HoldPosition` (the contract §0 menu plus the idle label);
* his **velocity component toward E** = `dot(target.vel, unit(E − target.pos))`, signed m/s
  (positive = coming), at both instants (means + bins);
* at the ball's **arrival tick at E**: his **signed along-line offset** (negative = UPSTREAM of
  E, positive = BEYOND it) and his **lateral offset** from the launch→E line (bins stored);
* the **outcome partition** — DX-C2's own four-way ladder `completed / intercepted / out /
  unresolved`, first terminal event wins, **temporal not causal** — reused;
* for **completed** flights, the **collection point's signed along-line distance from E**.

### §P.F THE ARM, THE SEEDS, THE SIZING

* **ONE ARM — WORLD 12's OWN COMPOSITION**, the composer **CALLED, never copied**:
  `a4MatchFlags(12)` as construction flags + `armA4World(m, null, 12)` after construction (the
  RA world = world 11's arming plus the two match-local exam pins `passLeadSupport = 1`,
  `raAccessWeight = 1`; the `raPlaytestEntry` suite proves it ≡ RA-T1B's armed arm). Gated on
  the match by **`raArmedVersion(match) === 12`**. Population construction (genomes, squads,
  sides, the 240 s match, the seed → rng plumbing) = **DX-C2's own, reused**. The EMPTY-BOOK
  form (`null` L3/PC dose — the form both RA exams walked).
* **NO WRAPPER.** Observation = per-tick reads of `Match` state after each `m.step(DT)`.
  `gLockstep` proves observed ≡ unobserved byte for byte on out-of-band scratch seeds anyway.
* **Block 12,533,000–999**: battery seeds **12,533,000–12,533,998** (**N_FROZEN = 999**),
  construction receipt **12,533,999** — the block is consumed WHOLE and the tail is EMPTY.
  Smokes and lockstep on out-of-band scratch **900,001,800–899 ONLY**.
* **Stats consumed: ZERO.** Registry **73** untouched.
* **SIZING** (the DX-C2 §15 house form; §DEV-PREFLIGHT's smoke is the variance source):

| face | realised hw (12 clusters) | target | N required | resolvable at 999 |
|---|---|---|---|---|
| `delta.lockVsPrior` (§P.C, THE LICENCE) | 0.04918027907599562 | 0.05 | **24** | ✅ |
| `bound.coversGapShare.meetableCarried` ((b)) | 0.42857142857142855 | 0.05 | **1,802** | ⛔ **DECLARED UNRESOLVABLE** |
| `bound.coversGapShare.carried` ((b), disclosed beside) | 0.19196428571428573 | 0.05 | **362** | ✅ |

  **The larger requirement (1,802) EXCEEDS what the block affords**, so N_FROZEN takes the
  block's own maximum — 999 battery walks — and the coverage row on the meetable carried class
  is **DECLARED UNRESOLVABLE HERE**. ⛔ **No null may be cut on it**: it is REPORTED with its
  realised interval and its expected MDE, and no conclusion of the form "no effect" is
  available. The **PRE-COMMITTED READ** (§P.C's second half) is therefore reported with its
  own resolvedness stated in words, three ways (bound ≥ gap resolved · bound < gap resolved ·
  UNRESOLVED at this power).
* **Bins** (frozen): θ 5° × 36 · lock ticks-before-release 1 × 31 · ambiguity 1 × 6 · W 1 tick
  × 32 · start delay 1 tick × 41 · PC applied hold 1 tick × 41 · dead time 1 tick × 81 · bound
  0.5 m × 21 · gap diff ±0.5 m × 13 signed (DX-C2's own) · (bound − gap) ±1 m × 21 signed ·
  velocity toward E ±1 m/s × 21 signed · along-line offset ±1 m × 21 signed · lateral 0.5 m ×
  21 · collection ±1 m × 21 signed. **Estimator**: cluster bootstrap, 2,000 draws, rng seeded
  from the block base.
* **Medians** are **BIN-DERIVED** (the lower edge of the bin whose cumulative count first
  reaches n/2) so that `gFaces` re-derives every one of them off disk — canon, VERBATIM: *"the
  re-derivation gate covers EVERY published face; a percentile face requires stored bins"*
  (home: ruling #287 item 1 + `PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 4).

### §P.G THE GATES (all liveness/receipt — NEVER direction)

`gWorld` (`raArmedVersion === 12` on every walked match and the receipt) · `gGenomeClean`
(`info.genome` never written — canon: dose placement, #270.2 / #334 item 1) ·
`gAnchoredConstants` (**anchored extraction with line receipts** for `AI_INTERVAL` ·
`PC_TIER_SIMPLE_TICKS`/`PC_TIER_CHOICE_TICKS` · `TURN_RATE` · `CONTROL_RADIUS` ·
`PTP_FLIGHT_SPEED` · `interceptBall`'s ts clamp and the `/ ts + 0.15` form · the `ReceivePass`
score literal 1.2 · the `pass.targetGid === p.gid` gate · the three TICK-INDEXING sites · the
arm-site `faceTarget` lock · the external `heading`/`faceTarget` declarations · the PURE
`topSpeed` getter · world 12's own flag composition and arming lines · the `ActionType`
vocabulary) · `gCueChannel` (**THE FIXTURE**: identical external state + different private
targets ⇒ identical θ vector; reversed heading ⇒ different vector) · `gWalkFixtures` (the angle
arithmetic, the argmin/tie/NaN rules, the ambiguity count, the DX-C2 account, the
dead-time/bound arithmetic, every bin helper) · `gClassesNonVacuous` (both delivery classes
live, meetable carried n > 0, the cue population and the (b) gap denominator non-empty, and the
`never locks` + `censored start` buckets COUNTED) · `gLockstep` (no wrapper; observed ≡
unobserved byte for byte) · `gSrcUntouched` (`git diff --stat HEAD -- src` **AND**
`git status --porcelain -- src` both empty — canon: xSrcUntouched) ·
`gSeedsBookedEqualWalked` · `gN` (N_FROZEN honoured) · `gHashOrder` (the body hash computed
**LAST** off an explicit **ALLOWLIST SCHEMA**; the file byte-hash published in §R) · `gFaces`
(**EVERY** published face, Δ, bin, median, partition, VERDICT, pre-committed read and sizing
row re-derived off the **SERIALIZED** artifact).

Canon quoted where it applies — VERBATIM: *"the hashed body is built from an explicit
ALLOWLIST SCHEMA — a field not in the schema never enters the body; forbidden-name lists are
retired"* (home: `PC-T0-LATENCY-SEAM.md` §COMMANDER CORRECTIONS item 1); VERBATIM: *"a
src-extracted constant pins its extraction to the NAMED call site — anchored match + line
receipt — never first-occurrence"* (home: `BK-C0-BODYBALL-CENSUS.md` §COMMANDER CORRECTIONS
item 1, ruling #306 item 4); VERBATIM: *"a field carries the unit its name claims"* (home:
ruling #294 item 3); VERBATIM: *"a scored face's walk-side predicate is pinned — anchored
extraction or fixture — because the re-derivation gate proves arithmetic, not definitions"*
(home: `DF-T3-SURFACE-EXAM.md` §COMMANDER CORRECTIONS item 2); VERBATIM: *"verifier scratch
walks use the stage's own consumed band or the out-of-band scratch range (≥ 900,000,000) —
never the next virgin block"* (home: `PW-T0C-OBJECTIVE-FIDELITY.md` §COMMANDER CORRECTIONS
item 6); VERBATIM: *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes
a gated face"* (home: `PC-T2-ARMED-WORLD-READ.md` §COMMANDER CORRECTIONS item 4); VERBATIM: *"a
starred finding states its |Δ|÷half-width ratio"* (home: `BU-T0B-PRICE-SEPARATION.md`
§COMMANDER CORRECTIONS item 2). No fixture here is worker-simmed, so the worker-fixture canon
is named and NOT invoked: VERBATIM *"WORKER-SIMMED fixtures play the SHIPPED world
(League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines #270's E4
correction; matches the perf diagnostic)"* (home: ruling #283.2(iv)) — every fixture in this
instrument is a PURE arithmetic table, and every simmed walk is a real `Match` built by world
12's own composer in-process.

## §DEV-PREFLIGHT — the sizing smoke, disclosed in full

A **12-cluster scratch smoke** (`RCC0_MODE=smoke RCC0_N=12`, seeds **900,001,800–811**,
lockstep on **900,001,890–891**, artifact off the canonical path at
`/tmp/rc-c0-smoke.json.RED.json`) was run **BEFORE this freeze**. Its realised half-widths were
read out of the smoke artifact's own `deltas[].halfWidth` / `faces[].halfWidth` fields —
**never re-typed from the console's rounded print** — and are hardcoded in the instrument's
`SIZING_INPUTS` (the three rows in §P.F's table).

**Disclosed honestly:**

* On that first 12-cluster run **`gN` was RED by construction**: `SIZING_INPUTS` still carried
  placeholder half-widths of `0.0`, so `nRequired` was 0 and `SIZING_OK` was false. The
  artifact therefore routed to its `.RED.json` side path — which is exactly what the
  red-routing idiom is for. Every OTHER gate was green on that run (11/12), including
  `gFaces` at **123/123 face-and-Δ** and **28/28 stored-bin / median / partition / VERDICT /
  pre-committed-read / sizing** checks. After the half-widths were filled in, the same
  12-cluster smoke re-ran **12/12 GREEN**.
* ⚠ **12 clusters is a NOISY variance estimate** — a strictly weaker assumption than sizing
  off a published battery. Said here, before the battery.
* ⚠ The smoke's own POINT readings are **UNPOWERED and bind nothing**. For the record, so
  nobody can claim the freeze was written after seeing a battery: the smoke read
  `cue.pLockLast` ≈ 0.659, prior ≈ 0.200, Δ ≈ +0.459, never-locks ≈ 0.341, W ≈ 0.174 sim-s,
  meetable-carried bound ≈ 3.874 m against a measured gap of ≈ 4.714 m on **n = 5** flights,
  coverage ≈ 0.400 with a half-width of ≈ **0.429** (which is why that face is declared
  unresolvable). **None of these numbers is a finding**; the battery's own §R replaces every
  one of them.
* The smoke ALSO confirmed instrument liveness: both delivery classes populated, meetable
  carried live, the `never locks` and `censored start` buckets non-empty, `gCueChannel` green
  (including its negative half), and ≈ 41 wind-up flights/match with a carried share of ≈ 0.11.
* **This section binds nothing.** The freeze is §0–§P.G above.
