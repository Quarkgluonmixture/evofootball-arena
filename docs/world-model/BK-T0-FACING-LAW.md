# BK-T0 — THE FACING LAW (a DORMANT src seam)

> **THE ONE SENTENCE**: the kick's timeline absorbs the body turn the strike direction
> requires — **a time cost, never a ban**.
>
> **Binding**: [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md) §2 **M-BK.1** (the law)
> and **M-BK.4** (flags off ⇒ byte-identity; composition proof at the CB/L3/PC stack; pin
> suites from birth). Dispatched by **ruling #306 items 3 + 6**. Its census is
> [`BK-C0-BODYBALL-CENSUS.md`](BK-C0-BODYBALL-CENSUS.md) — §R4's turn-cost table is this
> stage's design table, and §COMMANDER CORRECTIONS is read as its truth of record.
>
> **WHAT THIS STAGE IS**: a dormant seam + its permanent pin suite + **arming RECEIPTS**.
> ⚠ **CANON — receipts ≠ effect sizes** (homes: ruling #289 item 1 + BU-T1-MT-COMPOSITION.md
> §COMMANDER CORRECTIONS item 5, paraphrase): every number in §RESULT is a plumbing receipt.
> **This stage makes NO football claim.** The composition exam is a LATER stage.

---

# §PRE-REGISTRATION (frozen BEFORE any receipt walk — canon freeze-before-battery, home ruling #266.3(c))

## §0 What the census left on the table

BK-C0 §R4 established, from the shipped constants: a full reversal costs **29 ticks**
(`fullReversalTicksWhole`, 0.483322 s), the certified wind-up's largest charge is
**11 ticks** (`windupCapTicks`), the ratio of record is **2.64×** (§CORR item 3), the
engine's own absorbable cone is **68.28° / misalign 0.3149**, and **33.6–36.3 %** of today's
53,055 releases sit outside it. It also established that the price for being reversed is
**not even ordered** at outcome grain (blind own-next-touch .659 ≥ aligned .648). So the
world has a facing PRICE that disciplines nothing, and no facing TIME at all.

BK-T0 adds the time. It adds no price, no ban, no chooser term.

## §1 (a) THE ADDED-TICKS FORMULA — derived, never chosen (#200)

Two exported constants and one exported pure function, all in `src/sim/Match.ts` beside the
C7 §LAW family they are derived from:

```
BK_CONE_TICKS = Math.round(C7_W_CAP * 60)              // = 11 ticks
BK_CONE_RAD   = BK_CONE_TICKS * DT * TURN_RATE         // = 1.1916667 rad = 68.2775°

theta      = acos(clamp(heading · aimDir, -1, 1))      // the exact required rotation
turnTicks  = ceil(theta / (TURN_RATE * DT))            // BK-C0 §R4's `turnTicksWhole`
addedTicks = max(0, turnTicks - BK_CONE_TICKS)         // THE LAW
readyTick  = stepCount + c7WindupTicks(...) + addedTicks
```

**Every constant's provenance, anchored at its NAMED site** (canon: "a src-extracted
constant pins its extraction to the NAMED call site — anchored match + line receipt — never
first-occurrence", home BK-C0 §COMMANDER CORRECTIONS item 1):

| symbol | value | anchored source |
| --- | --- | --- |
| `C7_W_CAP` | 0.18 s | `Match.ts`, the declaration `const C7_W_CAP = 0.18;` in the frozen C7 §LAW family (the same constant `O2_LOOK_TICKS` already derives from) |
| `TURN_RATE` | 6.5 rad/s | `Player.ts`, the declaration `export const TURN_RATE = 6.5;` |
| `DT` | 1/60 s | `constants.ts`, `export const DT = 1 / 60;` |

The probe re-extracts both by anchored regex at run time and gates on the parse
(`gConstants`); the pin suite re-derives `BK_CONE_TICKS` from the `C7_W_CAP` literal read
out of `Match.ts`, so no number in this stage is typed twice.

**WHY `ceil`, not `round`**: the body is not aimed until the tick in which the sweep
COMPLETES. `ceil` is also exactly what reproduces BK-C0 §R4's published `turnTicksWhole`
column at every one of its rows (45° → 8, 60° → 10, 75° → 13, 90° → 15, 135° → 22,
180° → 29); `round` reproduces none of the fractional rows. The pin suite asserts all 13.

**WHY THE CONE IS THE CAP, not the arm's own W**: the cone of record IS 68.28°/.3149 — the
census defined it as where the required turn saturates the ceiling the world's existing time
budget can pay, and published the 33.6–36.3 % outside-share against exactly that edge.
Charging against the per-arm W instead would move the cone per body and per tick, and no
published face would survive.

**NO NEW CLAMP.** The shipped `[3, 11]` clamp on W is untouched and applies to W alone. The
added ticks need no clamp: θ ≤ π ⇒ `turnTicks` ≤ 29 ⇒ `addedTicks` ∈ **[0, 18]** by
construction. The maximum single charge is therefore 18 ticks (0.30 s) — pinned.

**Degenerate aim** (the strike point standing ON the body) names no direction; the law
charges 0, by the same `1e-6` test the shipped `faceTarget` integrator already uses.

## §2 (b) DOES THE BODY ACTUALLY TURN? — yes, and the code for it already shipped

Both arm methods ALREADY end with `faceTarget = <the aim>` (`armPendingKick`:
`shooter.faceTarget = { x: aim.x, y: aim.y }`; `armPendingPass`: `passer.faceTarget =
{ x: mate.pos.x, y: mate.pos.y }`), and `Player.physicsStep` already sweeps `heading`
toward `faceTarget` capped at `TURN_RATE`. **The facing law adds no turning code at all.**
What it adds is the TIME for that shipped sweep to finish.

The law charges for the turn toward **the same point `faceTarget` is set to** — the aim for
the shot, the mate's ARM-TIME position for the pass — so the turn charged and the turn
performed are the same turn.

**ON RELEASE**: unchanged. Both resolves already clear `faceTarget` and then run the
EXISTING `performShot` / `performPass` math **at strike time**, which computes
`kickMisalignment` against the body's now-integrated heading and prices it through
`orientationPowerMul` / `orientationNoiseMul`. **The facing law creates no price term** — it
changes the ARGUMENT those shipped prices see.

⭐ **WHAT THE LAW PROMISES, STATED HONESTLY**: M-BK.1's own words are "the required rotation
to bring the target into the strike CONE". The residual at release is therefore **at worst
the cone edge**, not zero — and usually far better, because the base W is spent turning too.
The bound is structural: `addedTicks = ceil(x) − 11 ≥ x − 11`, so the added ticks ALONE
cover the turn down to the edge and every base wind-up tick is surplus. **The law does not
abolish misalignment; it bounds it, and hands the remainder to the prices that already
exist.** Pinned as `residual ≤ coneMisalign` at five angles × three seeds' bodies, and gated
on the walks as `gInsideCone`.

## §3 (c) THE BACKHEEL CLASS — pre-registered honestly, including what T0 does NOT build

M-BK.1: "Strikes beyond the cone stay POSSIBLE at their existing power/noise price — real
football has backheels; selection decides who uses them." T0 honours possibility in three
ways, and **invents no fourth**:

1. **NOTHING IS EVER REFUSED.** The law returns an integer. There is no branch in which a
   strike is cancelled, no chooser option removed, no score touched. A fully reversed pass
   still leaves the foot — 18 ticks later. Pinned (`THE BACKHEEL PATH IS ALIVE`: the armed
   reversed wind-up resolves and releases).
2. **THE ZERO-TIME BEYOND-CONE STRIKE SURVIVES IN THE ONE-TOUCH CHANNEL.** A body inside its
   `firstTouchWindow` bypasses the pass wind-up entirely and releases NOW at the existing
   `oneTouchMul` price (§4 below). That is structurally the backheel/flick: no wind-up, no
   facing time, the existing orientation power/noise penalty paid in full. It is alive by
   construction and untouched by this stage.
3. **AND IN EVERY OUT-OF-SCOPE FAMILY** (§6): cutbacks, lofts, crosses, through balls,
   clears, GK throws, free kicks, penalties, headers all still strike synchronously from
   whatever heading the body has, at their existing prices.

⭐ **THE HONEST DEVIATION, PRE-REGISTERED**: T0 does **not** create a *deliberate* backheel
— there is no new chooser option "strike now, unturned, and eat the noise". Within the two
covered channels, a beyond-cone strike pays time; it cannot elect to pay noise instead. The
zero-time beyond-cone strike exists only through channels (2) and (3). Whether the chooser
should be able to BUY the un-turned release is a genuine design fork and is named here as a
candidate later slice, not smuggled in.

## §4 (e) THE PRE-PROCESSING CHANNEL — the one-touch bypass, honoured by construction

`PlayerBrain.ts` gates the single pass-arm site:

```
if (match.o1PassWindup && !mustKick && p.firstTouchWindow <= 0) {
  match.armPendingPass(p, passMate!, offsideExemptKick);
} else if (...) { ... performPass ... }
```

**The facing law lives INSIDE `armPendingPass` / `armPendingKick`.** A body the gate routes
past never reaches the law, so the kept H4 ruling lineage (the one-touch window is THE
DESIGNED BYPASS, no new charge) is honoured with **zero new gate code and zero edits to
`PlayerBrain.ts`** — the file is byte-untouched by this stage. Pinned two ways: the gate
line is asserted verbatim, and `bkFacingLedger.armsSeen` stays 0 for a body inside its
window. `mustKick` restart takers are excluded by the same shipped gate.

## §5 (d) FLAG SEMANTICS — `bkFacingLaw`, default OFF, and the inert-law door

Road B, the house form: an EXPLICIT boolean, never `EDS_BUNDLE_ARMED`, never env-armed,
never bundle-defaulted, **absent from `a4World.ts` entirely** (pinned).

⭐ **THE COMPOSITION RULE, CHOSEN AND STATED** (the brief's open call): the flag **EXTENDS**
the wind-up seams and owns no arm site of its own, so —

| `c7Windup` | `o1PassWindup` | `bkFacingLaw` | behaviour |
| --- | --- | --- | --- |
| any | any | **false / absent** | **byte-identical to today** (dormancy) |
| ✔ | ✔ | ✔ | both channels priced (the world of record) |
| ✔ | ✘ | ✔ | **legal**: shots priced, the PASS family untouched and said so |
| ✘ | ✔ | ✔ | **legal**: passes priced, the SHOT family untouched and said so |
| ✘ | ✘ | ✔ | ⭐⭐ **CONSTRUCTOR REFUSAL** |

**Why refusal rather than requires-both or silent inertness**: with neither channel armed
the flag provably cannot change a tick, so a world could carry `bkFacingLaw: true` and be
byte-identical to a world without it — a claim with no mechanism behind it, which is exactly
the class the PW×PTP door was shut for (#293.3 (d)). Requires-BOTH was rejected as too
strict: a shot-only or pass-only investigation world is a legitimate, honest, non-empty
composition, and refusing it would forbid the very partial worlds the doors matrix walks.
The refusal message names the law and both channels; pinned, and exercised as a receipt in
the doors matrix (3 seeds × 1 illegal cell).

## §6 (f) THE SEAM MAP — every kick-arming site, with occurrence COUNTS per needle

⭐ CANON, VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY
occurrence's site"* (home: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1).

Counts are machine-read from `src/**` by the pin suite (`§SEAM MAP` block) and fail on drift.

### IN SCOPE for T0 — the two wind-up channels (the ONLY sites the law touches)

| needle | count | site | family |
| --- | --- | --- | --- |
| `match.armPendingKick(` | **1** | `PlayerBrain.ts` `case 'Shoot'` (open-play / one-touch, non-freeKick) | **SHOTS** |
| `match.armPendingPass(` | **1** | `PlayerBrain.ts` `case 'Pass'` (shortPass, non-cutback, `!mustKick`, window closed) | **SHORT PASSES** |

The law's own consumption sites: `this.bkNoteFacing(` **2** (one per arm method) ·
`private bkNoteFacing(` **1** · `bkFacingExtraTicks(` **1** call · the readyTick expression
`this.stepCount + wTicks + bkTicks` **2**. Nothing outside `src/sim/Match.ts` contains the
string `bkFacing` (pinned across `PlayerBrain.ts`, `mechanics.ts`, `Player.ts`, `a4World.ts`).

### NAMED OUT of T0 — every other release site, with its reason

| needle | count | site(s) | why OUT |
| --- | --- | --- | --- |
| `match.performShot(` | **2** | `PlayerBrain.ts:144` (penalty — the first touch IS the shot) · the `case 'Shoot'` non-`c7Windup` fallback | the penalty is a placed restart with no wind-up channel at all; the fallback is the un-armed world by definition |
| `match.performPass(` | **3** | `:192` (kickoff played back) · the PTP-lead pass · the plain synchronous pass | kickoff is a restart (the C7 free-kick precedent excludes restart takers); the other two are the un-armed / one-touch paths the O1 gate already routes |
| `match.performCutback(` | **1** | `case 'Pass'`, the cutback branch | O1 cut-1 excluded it; T0 does not widen O1's own scope |
| `match.performLoftedPass(` | **1** | `case 'LoftedPass'` — **including the GK punt** | no wind-up channel exists for the loft family; the punt's own missing landing price is a PRICING-SHELF item (H-BK.3 / M-BK.3), not a facing one |
| `match.performCross(` | **1** | `case 'Cross'` | no wind-up channel; delivery geometry is DLC territory |
| `match.performThroughBall(` | **1** | `case 'ThroughBall'` | no wind-up channel |
| `match.performKeeperThrow(` | **1** | `case 'ThrowOut'` | a throw is not a kick; the arm is not the body turn |
| `match.performFreeKick(` | **1** | `case 'Shoot'`, `kickKind === 'freeKick'` | a placed restart; the taker sets his own feet — the C7 precedent already excludes it |
| `match.performClear(` | **1** | `case 'ClearBall'` | a panic clear is the one strike real football DOES play off the wrong foot; no wind-up channel exists |
| `headBall(match, ` | **1** | `mechanics.ts`, inside the aerial resolve | ⭐ BK-C0 §R5 item 4: the header family (6.8 % of ball-striking) is outside the facing price ENTIRELY and **should stay there** |

**SCOPE DISCIPLINE, STATED**: covering the c7/o1 wind-up channels fully and naming the rest
as T0's boundary is the brief's permitted form. This is a **partial law, honestly scoped** —
and BK-C0 §R5 item 4 makes it the RIGHT partial: shots are already aligned (mean misalign
.0545, the C7 `faceTarget` lock), so **the facing law mostly bites the ordinary short pass,
which is exactly where 反身 lives** (25.3 % of shorts beyond square; shorts = 64.5 % of all
releases). The families named OUT are, by the census's own map, either restarts, non-kicks,
or the header class that must stay out.

## §7 THE GATES

`gWorld` (world 8 + both dose books bit-equal on every walked match AND the receipt) ·
`gDoorChannels` (each built door cell conforms on the dose half) · `gDoseBytes` ·
`gConstants` (both constants anchored at their NAMED declarations, parsed finite, and the
cone re-derived from them) · `gSeamFires` (the arming receipt is non-vacuous) ·
`gShutSilent` (the ledger is all-zero on the SAME seeds with the door shut) ·
`gChannelLive` (the O1 channel itself fires in both arms — a zero in a world with no
exposure would be a zero of absence) · `gReleasesObserved` (no empty denominator) ·
`gInsideCone` (**the law's own claim**: zero observed releases outside the cone under the
law) · `gBoundHolds` (max added ticks ≤ 18) · `gDoors` (every illegal cell refused, naming
the law; every legal cell built) · `gLifecycle` (no arming survives a whistle anywhere) ·
`gDoorInertness` (every `¬bk` cell books zero) · `gSrcUntouched` (`git diff --stat HEAD --
src` AND `git status --porcelain -- src`, both empty) · `gSeedsBookedEqualWalked` (checked
against the probe's own arithmetic, not this prose).

## §8 THE RECEIPT PLAN

Instrument: [`scripts/probes/bk-t0-facing-receipts.ts`](../../scripts/probes/bk-t0-facing-receipts.ts),
frozen in this stage's freeze commit. World: `a4MatchFlags(8)` + `armA4World(m, null, 8,
poolT1DoseCells(L3-T1), poolPcDoseTable(PC-T1))` — the WATCHED world of record, where both
channels the law extends are armed. `bkFacingLaw` is the only thing the probe adds.

1. **THE A/B RECEIPT BATTERY** — 50 seeds, each walked TWICE (law armed / law shut). Faces:
   `armsSeenTotal` · `armsExtendedTotal` · `extendedShareOfArms` · `extraTicksTotal` ·
   `meanExtraTicksPerExtendedArm` (unit: TICKS) · `maxExtraTicks` ·
   `meanMisalignAtObservedRelease` (unit: `kickMisalignment`, 0..1) ·
   `shareOfObservedReleasesOutsideCone`. Every one is a RECEIPT.
2. **THE MISALIGN-AT-RELEASE INSTRUMENT** — both wind-up resolves run at the HEAD of
   `step()` (before brains and physics), so a release is priced against the heading standing
   at the END of the previous step. The probe snapshots (record, heading, pos) BEFORE each
   step and reads the release off the slot that emptied. **No src hook, no reordering.**
   Stated limit: it observes the PASS wind-up slot only, and only releases (a cancelled
   wind-up is not counted) — the artifact stores `releases` per seed so any share re-derives.
3. **THE DOORS MATRIX (the M-BK.4 composition proof)** — the full power set of the three
   doors the law can reach, `{c7Windup, o1PassWindup, bkFacingLaw}` = **2³ = 8 cells × 3
   seeds = 24 walks**, on top of the FIXED world-8 CB/L3/PC stack. Per cell: built-or-refused,
   the ledger, the longest arming life, armings live at the whistle. The 3 illegal cells are
   the refusal receipt.
4. **THE LIFECYCLE READ** — `maxArmingLifeTicks`, `armingsLiveAtWhistleTotal`,
   `armingsAcrossPhaseChangeTotal`, on every battery walk and every door cell. This is the
   question the law's LONGER windows actually pose.
5. **THE LAW TABLE (no sims)** — BK-C0 §R4's column recomputed from the shipped exports.

**NO FOOTBALL FACE IS PUBLISHED.** No goals, no possession, no completion rate, no outcome.

## §9 SEED LEDGER

**Block of record: 12,502,000–999** (opened by ruling #306 item 6). BOOKED = WALKED:

| sub-range | count | what for |
| --- | --- | --- |
| `12,502,000 – 12,502,049` | 50 | **the A/B receipt battery** — each seed walked TWICE (armed + shut) |
| `12,502,500 – 12,502,502` | 3 | **the doors matrix** — 8 door cells each |
| `12,502,800 – 12,502,802` | 3 | **the permanent pin suite** (`tests/bkFacingLaw.test.ts`) |
| `12,502,999` | 1 | **the world-construction receipt** (the xxx,999 convention) |
| everything else in the block | 943 | **NOT WALKED** — unconsumed inside the block |

**Stats-stream draws: ZERO.** This stage draws no bootstrap and publishes no CI — it is an
arming receipt. (Base stays ≥ 113,800 if one is ever needed.)

## §10 VISION / REALITY (the #201 standing rule — every decision checked against BOTH)

* **VISION §-1 (tactics emerge)**: the law adds TIME and nothing else — no behaviour rule, no
  chooser term, no gene. Who turns early, who plays one-touch, who accepts the longer wind-up
  stays entirely with the chooser and selection. **PASS.**
* **VISION 底座给能力**: facing/turn is body capability; the cost is the body's own shipped
  turn rate. **PASS.**
* **VISION #200 (no taste constants)**: cone from `C7_W_CAP`, cost from `TURN_RATE`, both
  anchored-extracted and re-derived by the pins; the `ceil` choice is justified by
  reproducing the census's published column. **PASS.**
* **REALITY**: you turn before you strike, or you take it on the wrong foot — the currency in
  the real game is TIME, and the panic clear and the one-touch flick are precisely the
  strikes that skip the turn. Both stay skip-able here. **PASS.** *Honest limit*: real
  players can also choose to strike un-turned and eat the mishit; T0 gives the chooser no
  such button (§3's stated deviation).

---

# §RESULT — THE RECEIPT WALKS (125 walks, world 8, TWO PRE-REGISTERED GATES RED)

> **Artifact:** [`data/bk-t0-facing-receipts.json`](data/bk-t0-facing-receipts.json)
> `resultSha256 = e68c38ee7cff6740d212f20b911a6382b60ebd1f6ce1e00ccafc1c4504a8a9aa`,
> `instrumentSha256 = 9f64ebf818d0b36bbf6e21fe636220bebdf86a0f237abfcf91678538e86b1bfa`.
> **Instrument frozen at `2f1a6c8`**, byte-unchanged to result. Battery: 50 seeds × 2 arms +
> 24 door cells + 1 world receipt = **125 walks**, 1,515,014 armed+shut ticks,
> **11.8 s wall** (`wallSeconds`).
>
> ⚠ **EVERY NUMBER BELOW IS A RECEIPT, NEVER AN EFFECT SIZE** (canon, homes: ruling #289
> item 1 + BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5). No football face was
> measured, and none is claimed. Where a number is doc-side arithmetic over artifact fields
> rather than a stored face, it says so (the PC-T2 §CORR item 4 convention).

## §R0 THE WORLD IS THE WORLD

`world.everyWalkedMatchConformed = true` on all 100 battery walks; all five
`receiptConjuncts` true on the `12,502,999` receipt (`worldConformed` ·
`bkFacingLawArmed` · `c7WindupArmed` · `o1PassWindupArmed` · `ledgerBornZero`).
Dose file-byte hashes: `doses.l3DoseFileBytesSha256 = a41a114c…37db` (`l3DoseLungesTotal
= 27368`) and `doses.pcDoseFileBytesSha256 =
0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f` (`pcDoseExposuresTotal =
8281`) — the same two artifacts BK-C0 dosed from.

## §R1 FLAGS-OFF BYTE-IDENTITY (the hard gate)

* **The pooled-digest idiom** (`tests/pcLatencySeam.test.ts`'s `signatureOf`, carried over
  verbatim): `bkFacingLaw` ABSENT ≡ `bkFacingLaw: false`, **byte for byte**, over the full
  match trace (every 37th tick: ball pos/vel, both scores, all 12 bodies' pos + heading.x)
  plus final score, stats and event count — in **both world shapes** (the bare
  both-wind-ups match AND the armed world-8 stack) × 2 seeds = **4 digest pairs, 4 equal**.
* **`npx tsx scripts/fingerprint.ts` at the result HEAD**, verbatim:

  ```
  seed=1337 seasons=2 matches=142
  sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
  ```

  — identical to the fingerprint of record (#305 item 1).
* **`gShutSilent` on the walks**: on the SAME 50 seeds with the door shut,
  `shutFaces.armsSeenTotal = 0`, `armsExtendedTotal = 0`, `extraTicksTotal = 0`,
  `maxExtraTicks = 0`.
* **`gDoorInertness`**: every `¬bk` door cell (12 of 24) books `armsSeen = 0`.

## §R2 THE SEAM FIRES — the arming receipt

| face (artifact FIELD) | armed | shut |
| --- | --- | --- |
| `armsSeenTotal` | **2611** | 0 |
| `armsExtendedTotal` | **1147** | 0 |
| `extendedShareOfArms` | **0.439295** | 0 |
| `extraTicksTotal` | **9292** | 0 |
| `meanExtraTicksPerExtendedArm` (unit: TICKS) | **8.101133** | 0 |
| `maxExtraTicks` | **18** (= the structural bound 29 − 11) | 0 |
| `o1ArmsTotal` / `o1StruckTotal` | 2183 / 2163 | 2195 / 2181 |
| `releasesObserved` | 2183 | 2194 |
| `meanMisalignAtObservedRelease` (unit: `kickMisalignment`, 0..1) | **0.040110** | **0.216463** |
| `shareOfObservedReleasesOutsideCone` | **0.002749** | **0.299909** |
| `ticksTotal` | 759,460 | 755,554 |

**READ AS RECEIPTS**: the door is reached (2,611 arms), it charges on **43.9 %** of them,
and when it charges it charges **8.1 ticks** on average (0.135 sim-s) — the world pays real
time. The shut arm books nothing on the same seeds. The channel the law extends is itself
alive in BOTH arms (`gChannelLive`: 2,183 vs 2,195 O1 arms), so no zero here is a zero of
absence.

⭐ **The 43.9 % armed-share is in the neighbourhood of BK-C0 §R4's 33.6–36.3 % outside-cone
share, and is NOT the same quantity** — BK-C0 measured the share of ALL 53,055 releases
(every family) outside the cone; this measures the share of the two wind-up channels' ARMS.
Stated so the two are never cross-quoted.

## §R3 ⭐⭐ GATE RED #1 — `gInsideCone` FAILED (6 of 2,183 = 0.2749 %)

**The pre-registration's own claim** (§2): "the residual at release is at worst the cone
edge". **It is not exactly true, and the walks caught it.** `armedFaces.releasesOutsideConeTotal
= 6` out of `releasesObserved = 2183`, spread over 5 of the 50 armed walks.

**THE MECHANISM, stated**: the structural argument assumed the bearing to the aim is FIXED
across the window. It is not. `faceTarget` is an aim **POINT**, and the law charges at ARM
time for the ARM-time bearing — but two shipped behaviours move that bearing afterwards:

1. **THE BODY DRIFTS.** The executor's wind-up plant sets the movement target to the body's
   own spot at `speedF = 0.22`, which DECELERATES the body — it does not teleport it to
   rest. A body still carrying velocity translates during the window, and the bearing to a
   nearby fixed point rotates on its own (demonstrated directly: a body translating at
   7 m/s past an aim 2 m away burns its whole earned margin, residual 0.2658 vs a static
   body's ~0).
2. **THE PLANT IS OWNERSHIP-GATED.** `actionExecutor.ts` clears `faceTarget` to null every
   frame and re-drives it to the wind-up aim only while `ball.owner === p`. A tick in which
   ownership flickers leaves the heading following the MOVEMENT direction for that tick.

⭐ **THE SPLIT BETWEEN THE TWO CAUSES IS UNMEASURED** — this stage did not instrument it,
and says so rather than guessing. **The claim of record is therefore the WEAKER one, and it
is the one the walks support**: the law takes outside-cone releases from **29.99 % to
0.27 %** (a 109× fall, doc-side arithmetic over `shareOfObservedReleasesOutsideCone`) and
mean misalign-at-release from **0.216463 to 0.040110** — but it does **not** guarantee the
cone. The corrected sentence for §2 is: *the law bounds the residual at the cone edge for
the arm-time geometry; a body that keeps moving through its own wind-up can spend that
bound.* The gate is left RED in the artifact; the pin suite's own residual pin uses a
STATIC fixture, where the bound does hold exactly, so the pins remain true as written.

## §R4 ⭐ GATE RED #2 — `gLifecycle` FAILED, and the failure is NOT this seam's

`armingsLiveAtWhistleTotal`: **armed = 0**, **shut = 1** (seed `12,502,023`), door cells
**0**. The single arming alive at a whistle is in a walk where **`bkFacingLaw` is OFF** —
i.e. it is an INCUMBENT `o1PassWindup` property, reproduced here, not a BK-T0 one. My gate
conjoined the shut arm into the seam's own lifecycle claim; that was too broad a gate, and
the honest reading is:

* **BK-T0's own lifecycle is clean**: 0 armings alive at a whistle across 50 armed walks
  (759,460 ticks) and all 24 door cells.
* **A pre-existing O1 finding is surfaced**: an incumbent pass wind-up CAN be alive at a
  full-time whistle. Volume 1 in 755,554 shut-arm ticks. **Registered here, owned by the O1
  seam, not fixed by this stage** (touching it would be scope creep and would move the
  incumbent world).

**`maxArmingLifeTicks`**: armed 26, shut 133. ⚠ **INSTRUMENT LIMIT, DECLARED**: the probe
keys arming life by `gid` and only retires the key when NEITHER slot holds that gid, so a
body that re-arms back-to-back reports the life of the RUN, not of one arming. The face is
therefore an **upper bound on consecutive-arming life per body**, not a single arming's
life — which is why the shut arm's 133 exceeds the armed arm's 26 despite the law making
windows LONGER. `armingsAcrossPhaseChangeTotal`: armed 16, shut 14 (same bookkeeping caveat).

## §R5 ⭐⭐ THE COMPOSITION PROOF — the doors matrix at the world-8 stack (M-BK.4)

The full power set of the three doors the law can reach, on top of the FIXED world-8
CB/L3/PC stack: **8 cells × 3 seeds = 24 walks**. `doorCells` aggregated by cell (doc-side
arithmetic over the stored per-cell rows):

| `c7Windup` | `o1PassWindup` | `bkFacingLaw` | cells | `armsSeen` | `armsExtended` | outcome |
| --- | --- | --- | --- | --- | --- | --- |
| ✘ | ✘ | ✘ | 3 | 0 | 0 | built, conformed |
| ✘ | ✘ | ✔ | 3 | — | — | ⭐⭐ **REFUSED**, message names the law (3/3) |
| ✘ | ✔ | ✘ | 3 | 0 | 0 | built, conformed |
| ✘ | ✔ | ✔ | 3 | **127** | **59** | built — the PASS channel alone |
| ✔ | ✘ | ✘ | 3 | 0 | 0 | built, conformed |
| ✔ | ✘ | ✔ | 3 | **23** | **2** | built — the SHOT channel alone |
| ✔ | ✔ | ✘ | 3 | 0 | 0 | built, conformed |
| ✔ | ✔ | ✔ | 3 | **135** | **61** | built — the world of record |

**21 built, 21 conformed (`gDoorChannels`); 3 refused, 3 naming the law (`gDoors` green).**
Every partial composition is non-vacuous: the pass-only cell books 127 arms, the shot-only
cell 23. **The lifecycle at this composition is clean**: 0 armings live at a whistle in any
of the 24 cells.

⭐ **AND THE SHOT/PASS ASYMMETRY IS A RECEIPT WORTH THE INK**: shot-only extends **2 of 23**
arms (8.7 %); pass-only extends **59 of 127** (46.5 %) — doc-side arithmetic over the table
above. That is BK-C0 §R5 item 4 showing up in the plumbing: the C7 `faceTarget` lock already
aligns shots, so **the facing law is overwhelmingly a law about the ordinary short pass**,
exactly where the census located 反身. (Receipt only — no football claim.)

**SCOPE, stated**: this discharges the doors/lifecycle proof for **CB+L3+PC+C7+O1+BK only**.
`o2Look`, `ekHoldVeto`, `ptpPassLead`, `pwWeightChooser`, DV and MT are NOT armed here.

## §R6 THE LAW TABLE, recomputed from the shipped exports (`lawTable`, no sims)

| θ° | `misalign` | `turnTicksWhole` | `addedTicks` |
| --- | --- | --- | --- |
| 0 | 0 | 0 | **0** |
| 15 | 0.017037 | 3 | **0** |
| 30 | 0.066987 | 5 | **0** |
| 45 | 0.146447 | 8 | **0** |
| 60 | 0.250000 | 10 | **0** |
| **68** | 0.312697 | **11** | **0** ← the cone edge |
| 75 | 0.370590 | 13 | **2** |
| 90 | 0.500000 | 15 | **4** |
| 105 | 0.629410 | 17 | **6** |
| 120 | 0.750000 | 20 | **9** |
| 135 | 0.853553 | 22 | **11** |
| 150 | 0.933013 | 25 | **14** |
| **180** | 1.000000 | **29** | **18** ← the structural maximum |

`constants`: `c7WCapSeconds = 0.18` (`c7WCapSrcLine = 161`) · `turnRateRadPerSecond = 6.5`
(`turnRateSrcLine = 17`) · `coneTicks = 11` · `coneRadians = 1.1916666667` ·
`coneDegrees = 68.2774705864` · `coneMisalign = 0.3149439624` ·
`fullReversalTicksWhole = 29` · `maxAddedTicks = 18`. The `turnTicksWhole` column is
byte-for-byte BK-C0 §R4's published column at every shared row.

## §R7 THE PIN SUITE (`tests/bkFacingLaw.test.ts`) — 22 pins, 22 green, 7 mutants killed

Dormancy (4) · the §LAW derivation (5) · the arm extension + the turning body (4) · the
channels (3) · flag semantics (3) · the seam map (2) · the production world (1).

**MUTANT CHECKS** — a pin that cannot fail is not a pin. Each mutant applied alone to
`src/sim/Match.ts`, the suite run, the file restored:

| mutant | pins failed |
| --- | --- |
| `BK_CONE_TICKS` 11 → 10 | **5** |
| `ceil` → `round` in the §LAW | **2** |
| drop `+ bkTicks` from the SHOT readyTick | **2** |
| drop `+ bkTicks` from the PASS readyTick | **5** |
| remove the `this.bkFacingLaw ?` guard | **2** |
| delete the constructor refusal | **1** |
| drop the cone term (charge the full turn) | **5** |

**Full repository suite at the result HEAD: 1,602 / 1,602 green** (145 files) —
including the neighbour seams' own suites (`c7Windup`, `o1PassWindup`, `ptpPassLead`,
`pcLatencySeam`: 105 pins green together with this one). Typecheck clean.

## §R8 SEED LEDGER — BOOKED = WALKED

**Block 12,502,000–999 CONSUMED WHOLE of record.** Walked:

| sub-range | count | walks | what |
| --- | --- | --- | --- |
| `12,502,000 – 12,502,049` | 50 seeds | 100 | the A/B receipt battery (armed + shut per seed) |
| `12,502,000 – 12,502,001` | (inside the above) | 8 | the pre-freeze instrument smoke (`BKT0_MODE=smoke BKT0_N=2`, `/tmp` output — no extra consumption) |
| `12,502,500 – 12,502,502` | 3 seeds | 24 | the doors matrix (8 cells each) |
| `12,502,800 – 12,502,802` | 3 seeds | — | the permanent pin suite |
| `12,502,999` | 1 seed | 1 | the world-construction receipt |
| the remaining 943 | — | 0 | **NOT WALKED** — unconsumed inside the consumed block |

`seedLedger.walkCount = 125`. **Stats-stream draws: ZERO.** Next block ≥ **12,503,000**.

## §DOUBTS (the executor's own, stated)

1. **`gInsideCone` and `gLifecycle` are RED in the frozen artifact and were NOT patched.**
   The instrument was frozen before it walked; making a pre-registered gate pass by editing
   it after seeing the result is the failure this stage is built to avoid. §R3/§R4 carry the
   corrected claims instead.
2. **The misalign-at-release instrument watches the PASS wind-up slot only.** The shot slot
   is armed and charged (the doors matrix proves it) but its releases are not priced here —
   a shot-side residual face would need the same snapshot on `pendingKick`. Not measured.
3. **`maxArmingLifeTicks` / `armingsAcrossPhaseChangeTotal` are per-BODY run lengths, not
   per-arming lives** (§R4). Do not quote them as arming durations.
4. **The residual pin is a STATIC fixture.** It proves the bound where the geometry is
   fixed; §R3 is the honest statement for a moving body. The pin was not weakened to match
   the walk, and the walk was not re-run to match the pin.
5. **`extendedShareOfArms` is a share of ARMS, not of releases.** An evicted or cancelled
   wind-up counts in the denominator; the artifact stores per-seed cells so any other
   denominator re-derives off disk.
6. **No football face exists in this stage at all** — by design. Whether the world PLAYS
   better with a third of its strikes paying time is the composition exam's question and the
   play-test's verdict, not this one's.

## §WHAT THIS STAGE HANDS FORWARD

1. **The seam is landed, dormant, pinned and composition-proved** at the world-8 stack.
2. **Two corrections are already on the table** for the commander: §R3's weakened cone claim
   (with the two candidate mechanisms and the unmeasured split) and §R4's surfaced incumbent
   O1 finding (a pass wind-up alive at a whistle, 1 in 755,554 ticks).
3. **The named fork §3 registered**: T0 gives the chooser no button to buy the un-turned
   release. Whether the backheel should become a PRICED CHOICE rather than only a channel
   artefact is a design question this stage deliberately did not answer.
4. **BK-T1 (the contact law)** is next per ruling #306 item 3.

---

## §COMMANDER CORRECTIONS OF RECORD (ruling #307, 2026-08-19 — frozen bytes stand; the truth of record is here)

1. **THE §2 PRE-REGISTRATION SENTENCE IS CORRECTED**: "the residual at release is at
   worst the cone edge" is REFUTED as an absolute for a MOVING body (gInsideCone red at
   6/2,183 = 0.27 %, frozen unpatched — correctly). The claim of record: **the law
   BOUNDS the residual toward the cone; it does not zero it** — a body translating
   through its own wind-up can spend the earned margin (the plant decelerates rather
   than stops; the executor re-drives faceTarget only while ball.owner === p; the split
   between the two causes is UNMEASURED and stays so until the exam). The red gate's
   deliberate non-patching is RATIFIED.
2. **THE ONE-TOUCH BYPASS IS PASS-SIDE ONLY** (verify MED, report-level overstatement —
   the stage doc itself was honest): the PlayerBrain gate routes one-touch bodies past
   the PASS arm only; a one-touch SHOT does enter `armPendingKick` and pays facing
   ticks (shipped C7 behaviour). In practice shots arrive nearly aligned (extended
   share 8.7 % vs the pass channel's 46.5 %), so the tax is small — but 「一脚出球的
   射门要不要付转身时间」 is REGISTERED as a named exam observation, not silently
   resolved either way.
3. **SEAM-MAP NEEDLE SCOPING NOTE**: the pinned counts are `match.`-prefix-scoped and
   structurally cannot see the two `this.`-prefixed ARMED-release sites inside Match.ts
   (`this.performShot` at resolvePendingKick, `this.performPass` at
   resolvePendingPassWindup) — both in scope by construction. The verifier's
   independent chase (including all 4 `loftKick(` callers) confirms NO family escapes
   the map. Future maps state the needle prefix.
4. **"109×" IS DOC-SIDE RECEIPT ARITHMETIC** over `shareOfObservedReleasesOutsideCone`
   (.2999 → .0027 on 50 receipt walks) — a plumbing receipt, never a football effect
   size (canon: receipts ≠ effect sizes). The football reading belongs to the exam.
5. **INCUMBENT FINDING REGISTERED, NOT FIXED** (correct scope discipline): an
   o1PassWindup arming can be alive at the full-time whistle in a FLAG-OFF world
   (1 in 755,554 ticks, seed 12,502,023) — O1's named debt, not this seam's; BK-T0's
   own lifecycle is 0 live-at-whistle across all armed walks and door cells.
6. **PROCESS NOTE OF RECORD**: mid-work `git checkout -- src/sim/Match.ts` inside a
   mutant loop wiped the executor's own UNCOMMITTED seam (reapplied verbatim,
   re-verified, disclosed). Practice from here: mutant checks on uncommitted trees
   restore from a /tmp byte copy, never via git.
