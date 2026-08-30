# DX-C2 — THE MEETABILITY CENSUS (这脚球队友到底赶不赶得到?)

> **The census that opens the receiver-access arc.** Authorized by
> **COMMANDER RULING #359 item 2**, consuming the user's #358-fork election, verbatim:
> **「①′ 接应时间入价」** — itself the product of the user's #357-fork mechanism-oracle
> question, verbatim: 「这个用vision和现实重新思考下，为什么现实不这样」 (ruling #358).
> Contract: [`DX-DELIVERY-EXECUTION-CONTRACT.md`](DX-DELIVERY-EXECUTION-CONTRACT.md).
> Instrument family: [`DX-C1-ARRIVAL-CENSUS.md`](DX-C1-ARRIVAL-CENSUS.md) (this census is its
> focused adaptation; walk, classifiers, outcome ladder and arrival read inherited byte-for-byte
> in substance). Census form of record: [`BK-C2-CAROM-CENSUS.md`](BK-C2-CAROM-CENSUS.md).
> Instrument: `scripts/probes/dx-c2-meetability-census.ts`.
> Artifact: `docs/world-model/data/dx-c2-meetability-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. It scores no hypothesis, arms no
> mechanism and makes no football claim. **IT ADJUDICATES NOTHING** — the commander rules.
> ⭐ **ONE PRE-COMMITMENT RIDES ON IT (#359 item 2(b), frozen at §P.C):** a margin that does
> NOT discriminate the unresolved bucket **blocks the receiver-access seat** and returns the
> arc to the user.
> ⛔ **THIS STAGE SHIPS NOTHING**: `dxWindupAim`, `bkGroundCorridor`, `dlcDeliveryChoice` and
> `dlcStrikePlane` all stay default OFF and absent from `a4World.ts` (re-asserted at battery
> time by `gSeamSitesPinned`). ⛔ **X-SRC-ZERO**: no file under `src/` is edited.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

Ruling #358 item 3(a), the finding this census instruments:

> *"the shared pricer has NO RECEIVER-ACCESS TERM — `groundCandidate` prices lane (defender
> intercept) · open (space) · gain (territory) · style · DV risk · GC/BK corridor: every term
> measures DEFENDERS and TERRITORY; no term asks whether the intended receiver can meet the
> aim. PTP-T0's stated assumption ('a lead too greedy … prices ITSELF out through
> lane/open/gain') is EMPIRICALLY FALSIFIED by DX-C1/DX-T1."*

**In plain football language**: before the receiver-access PRICE can be built, three numbers
must exist. How many of the balls the brain actually elects are balls the intended teammate
**cannot reach** (a)? Does that account's own sign actually **predict the losses** — is the
unresolved bucket where the unreachable balls go (b)? And is the account **honest about the
world it would price** — does its predicted receiver arrival match the measured one, and where
it doesn't, is the gap the model's or the receiver's (he never chases what he isn't told
about) (c)?

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ACCOUNT — traced, never invented (#359 item 3; the #201 mechanism)

For a pass elected toward point **E** (the elected point: `mate.pos(arm) + carried lead` for
wind-up flights; `mate.pos + lead` at the strike for synchronous ones — the point
`groundCandidate` scored):

| quantity | frozen form | trace |
|---|---|---|
| `tBall(E)` | `dist(passer, E) / PTP_FLIGHT_SPEED` | the chooser's own flight law — the through-ball loop's `/ 18`, the SAME family member the lead law prices with (`passLeadSeat.ts`, anchored) |
| `tMate(E)` | `dist(mate, E) / max(mate.topSpeed, 0.1) + 0.15` | `interceptBall`'s OWN time-to-point form, byte for byte (`perception.ts`: the ts clamp, 1 occurrence; the `/ ts + 0.15` form, 2 occurrences — both branches, anchored) |
| `margin(E)` | `tBall − tMate` | positive ⇒ the mate is at the point BEFORE the ball |
| **MEETABLE** | `dist(mate, E) ≤ CONTROL_RADIUS` **OR** `margin ≥ 0` | the presence clause is the engine's own control cut (a body standing at the point needs no chase — without it the traced 0.15 s reaction beat reads every pass under 2.7 m as unmeetable by arithmetic); the sign cut is the account's own zero. **NO taste threshold**; the FULL margin histogram is stored so any other cut re-derives off disk |

⭐ The symmetry precedent is IN THE ENGINE: the marking law already runs this account on the
defence's side (`const tBall = dist(ballPos, markPos) / MARK_SAG_BALL_SPEED;`,
`actionExecutor.ts`, anchored — the #201 access-time mechanism). This census measures the
attack's missing half.

**The election instant**: wind-up flights are read at the ARM instant (the deposit tick —
where the seat would price), all four account inputs (passer pos, mate pos, mate topSpeed, E)
from that SAME instant, captured by the arm wrapper BEFORE the engine call. Synchronous
flights' election instant IS their strike instant. The carried class also gets the account
RE-READ at the strike instant against the SAME E (staleness context, published beside).

### §P.B THE POPULATION AND THE CLASSES (inherited from DX-C1, byte for byte in substance)

Measured ground passes (`shortPass` / `throughBall` / `cutback`, ground launch, with a
pending-pass target), partitioned by the DX-C1 carry classes: `carried` / `windupToFeet` /
`syncLed` / `syncToFeet` / `otherGround` (no wind-up seat — no margin read possible; published,
never folded). The outcome ladder is DX-C1's: `completed` / `intercepted` / `out` /
`unresolved`, first terminal event wins, temporal not causal.

### §P.C THE DISCRIMINATION RULE — carrying #359 item 2(b)'s PRE-COMMITMENT

On CARRIED passes, the contrast **Δ = unresolvedShare(unmeetable) − unresolvedShare(meetable)**
(meetability read at the election instant), cluster-bootstrap 95 % interval over match seeds:

* **DISCRIMINATES** ⇒ the interval lies ENTIRELY ABOVE ZERO ⇒ the account's sign predicts the
  loss bucket ⇒ the receiver-access PRICE has its licence (the commander rules).
* **DOES-NOT-DISCRIMINATE** ⇒ the interval CONTAINS ZERO ⇒ **per the pre-commitment the seat
  is NOT dispatched and the arc returns to the user.**
* **INVERTED** ⇒ entirely below zero ⇒ the account is WRONG about the world — blocks the seat
  the same way; reported as-is.

The completion contrast (meetable − meetable's complement) is REPORTED beside it and is NOT
part of the rule.

### §P.D THE CALIBRATION READ (question group (c))

`predictedArrDist = max(0, dMate − max(0, tBall − 0.15) · max(topSpeed, 0.1))` — the SAME
account's straight-chase kinematics: where the account says the receiver stands when the ball
reaches E. Compared against DX-C1's own MEASURED arrival read (receiver→E distance at the tick
the ball's along-line projection first reaches E), on carried flights only, published as means
plus a signed (measured − predicted) histogram, whole-class and meetable-only.
⚠ **The diff CONFLATES model error with behaviour and says so**: the live receiver has no
`ReceivePass` until the ball is struck and targeted at him, so a large positive diff on
MEETABLE elections is evidence about the COOPERATION half — a finding, not an instrument error.

### §P.E THE ARM, THE SEEDS, THE SIZING

* **ONE ARM** — the DX-T1 ARMED composition at the PINNED MAXIMUM (#359 item 4):
  `a4MatchFlags(11)` + `dlcDeliveryChoice` + `dlcStrikePlane` + `bkGroundCorridor` +
  `dxWindupAim` + `armA4World(m, null, 11)` + `passLeadSupport = 1` MATCH-LOCAL (DX-T1 §4's
  own dose idiom, byte for byte). The world's own composer is CALLED, never copied.
* **Block 12,530,000–999**: battery seeds 12,530,000–12,530,**899** (N_FROZEN = **900**),
  construction receipt 12,530,999. Lockstep + smokes on out-of-band scratch (≥ 900,001,100).
* **Sizing (the house form, §DEV-PREFLIGHT's smoke as variance source)**: the 0.05 target on
  the discriminating contrast needs **802 clusters** — 800 would miss it by two, so N_FROZEN
  is 900 (the block affords it). At 900 the expected MDE ≈ **0.047**. Declared honestly: the
  0.03 rung (needs ~2,228) and the completion contrast's 0.05 target (needs ~1,412) are NOT
  resolvable in this block — those faces are REPORTED with their realised intervals, and no
  conclusion of the form "no effect" may be cut on them.
* **Bins** (frozen): margin ±0.1 s × 21 signed (centre holds 0) · calibration diff ±0.5 m × 13
  signed · arrival distance 1 m × 10 · carried lead 0.5 m × 13. Estimator: cluster bootstrap,
  2,000 draws, seeded from the block base. **Stats consumed: ZERO.**

### §P.F THE GATES (all liveness/receipt — never direction)

`gWorld` · `gGeneValuePinned` · `gGenomeClean` · `gSeamSitesPinned` · `gAnchoredConstants`
(the account's own trace INCLUDED: ts-clamp ×1, time-to-point ×2, MARK_SAG ×1, topSpeed
getter ×1, plus the inherited structural pins) · `gWalkFixtures` (the account arithmetic is
fixture-backed) · `gCarryPartition` · `gMeetPartition` · `gClassesNonVacuous` (BOTH meetability
classes live + the to-feet anchor + a (c) denominator) · `gDepositCarriesElection` (DX-T1
§R6's pin re-run) · `gLockstep` (the three wrappers byte-inert) · `gQuotedSourceIntact`
(DX-C1's artifact hashed before parsing) · `gSrcUntouched` · `gSeedsBookedEqualWalked` · `gN`
· `gFaces` (every face, Δ, bin, partition, VERDICT and sizing row re-derived off the
serialized artifact).

## §DEV-PREFLIGHT — the sizing smoke, disclosed in full

12-cluster scratch smoke (`DXC2_MODE=smoke DXC2_N=12`, seeds **900,001,200–211**, artifact off
the canonical path), run BEFORE this freeze; its realised Δ half-widths were read out of the
smoke artifact's own `deltas[].halfWidth` fields and are hardcoded in the instrument's
`SIZING_INPUTS` (never re-typed from the console's rounded print):

| contrast | realised hw (12 clusters) | target | N required | resolvable at 900 |
|---|---|---|---|---|
| discriminationUnresolved | 0.2858294188081422 | 0.05 | 802 | ✅ |
| discriminationUnresolved | (same) | 0.03 | 2,228 | ⛔ declared |
| completionMeetableVsUnmeetable | 0.3792824822236587 | 0.05 | 1,412 | ⛔ declared |

⚠ 12 clusters is a NOISY variance estimate — a strictly weaker assumption than sizing off a
published battery; said here, before the battery. The smoke ALSO confirmed instrument
liveness: all 16 gates green; carried ≈ 5.75 flights/match; the to-feet classes read 0 %
unmeetable (the anchor behaves — presence + positive margins, no clause needed at their
distances); ⚠ the smoke's own point readings (unmeetable share ≈ 0.75, Δ ≈ +0.11) are
UNPOWERED and bind nothing.

## §R RESULTS — filled by the battery run; empty at the freeze

*(the freeze commit ends here; §R lands with the results commit, quoting the artifact's own
fields — the #357 standing order: docs QUOTE sizing/result fields, never recompute into prose)*
