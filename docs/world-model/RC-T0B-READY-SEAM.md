# RC T0b — THE READY DORMANT SEAM (先把身子打开对着他)

> **Authorized by COMMANDER RULING #378 item 6** (the RC-T0 / BF-T0 form; scope bound at the
> ruling, the exact forms frozen here). **Binding contracts:**
> [`RC-RECEIVER-COOPERATION-CONTRACT.md`](RC-RECEIVER-COOPERATION-CONTRACT.md) §2 M-RC.1 (the
> outward-only channel) · M-RC.2 (the belief is MEASURED) · M-RC.4 (the gene) · M-RC.5 (Road B) ·
> M-RC.6 (no ban, no designation, the passer untouched) and **§2-AMENDMENT M-RC.3b** (THE READY
> LIMB), plus [`BF-BODY-FACING-CONTRACT.md`](BF-BODY-FACING-CONTRACT.md) **M-BF.3** (nothing else
> changes) and **M-BF.4** (the coupling: with the facing price armed the turn costs drift speed).
>
> **Lineage.** PT-C0 H2 (the receiver is not READY — side-on **0.653896** of receptions,
> **0.571574** on completed passes) → RC-C0b (the pre-strike detector census, LICENSED on the
> TURNING axis) → #373 item 4 (the limb WAITS for a priced body: turning was free) → BF-C0 →
> BF-T0 (+FIX) → BF-T1 (BANKED: the price bites) → **#378 item 6, this stage**.
> [`RC-T0-PRECUE-SEAM.md`](RC-T0-PRECUE-SEAM.md) is limb 3a and is UNTOUCHED here.
>
> ⛔ **THIS STAGE SHIPS NOTHING** (Road B): `rcReady` is default OFF, never env- or
> bundle-armed, named by NO world and NO preset (`a4World.ts` contains neither `rcReady` nor
> `AnticipatePass`); NO gene is born (the gene is 3a's own `rcAnticipationWeight`); the
> production fingerprint is UNCHANGED — `npm run fingerprint` = the literal of record
> **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** at the seam commit.
> ⛔ **World 12's composition and bytes are untouched** (M-RC.5) — the user's play-test still
> compares like with like. The entry rung (world 13) is a later stage's business, after the
> user's world-12 verdict. **ZERO sims of record; registry 73; scratch 900,002,600–699 only.**
> `npm run build` was NOT run: no bundle path changes (the seam adds one src module reachable
> only from `PlayerBrain`, and no entry layer names it).

## §0 THE WORDS OF RECORD

> **COMMANDER RULING #378 item 6, VERBATIM:**
>
> ⭐⭐ **RC-T0b DISPATCHED — THE READY LIMB, A DORMANT SEAM ON THE PRICED BODY** (M-RC.3b as
> licensed at #373; the RC-T0 form; definitions frozen at the executor's §1): 「看见自己人拿球正
> 转向我，先把身子打开对着他」. (i) A SECOND FLAG **`rcReady`** (default OFF; never named by any
> world, preset, env or bundle; League `matchFlags` union) — 3b switchable apart from 3a so
> RC-T1b can build shut / 3a / 3a+3b arms; THE GENE IS THE SAME **`rcAnticipationWeight`**
> (M-RC.4: one gene = how much a receiver trusts a body cue). (ii) THE BELIEF (M-RC.2, measured
> never weighted) = RC-C0b's own cell: the carrier's speed bin (edges 1, 2, 3.5, 5 m/s) × his
> heading angular-speed bin (edges 0.5, 2, 4 rad/s; |Δheading|/DT across consecutive ticks) × my
> alignment rank (`alignmentRank`, the SAME function object as 3a; slots 1–5, ≥6) — 120 cells;
> **belief(cell) = P(a wind-up is live ∧ its target is me | cell) = `bins.cellWindupTargetMe.E[cell] /
> bins.cellTicks.E[cell]`** — #373's TWO tables, P(wind-up | cell) × P(target = me | wind-up,
> cell), whose product over a shared cell IS this stored joint; the EMPTY-BOOK arm (the licence
> arm), numerators and denominators transcribed as integers and re-derived BIT-EXACTLY off
> `docs/world-model/data/rc-c0b-detector-census.json` by a G-TABLE pin (file sha256
> **a07d5692…0f83**, body hash **37cdff0b…f41b**); the dosed arm's 120 quotients PUBLISHED beside
> in the stage doc as the book-independence check, never used. A cell with zero carrying ticks, a
> non-finite angular speed or no rank ⇒ belief 0 (no measurement ⇒ no belief ⇒ the shut byte). ⛔
> NO minimum-count floor (a new constant): sparse cells are an HONEST LIMIT with their counts
> published. (iii) THE READ SET (M-RC.1, outward-only): `ball.owner` (same side, not me, on the
> pitch), his `pos`, `vel`, `heading` at this tick and the previous tick — the previous heading
> kept by the SEAM's own flag-gated memory, written only when `rcReady` is on — my `pos`, the
> mate population as RC-T0 builds it, the team's gene; ⛔ NOT `pendingPassWindup`, `pendingPass`,
> `faceTarget`, any TeamBrain designation or `info.genome`; the seat module's import list CLOSED;
> the live argument list PINNED. (iv) THE CANDIDATE **`AnticipatePass`**, pushed into the
> receiver's OWN off-ball menu at the site that pushes `ReceivePass`, score = **`w · belief ·
> s_receive`**, `s_receive` = `ReceivePass`'s own literal (1.2 — anchored by a source-line pin,
> never a second copy) — the argmax IS the decision, no threshold; pushed ONLY when `w · belief >
> 0`, so the menu is byte-identical to shut whenever there is nothing to believe. (v) THE
> EXECUTOR: when `AnticipatePass` wins, the body's MOVEMENT is byte-identical to what the menu
> WITHOUT it would have chosen (the runner-up's own executor case runs — target, speed, every side
> effect), and the ONLY addition is **`faceTarget` = the carrier's `pos`, COPIED never aliased**
> (the actionExecutor.ts starred hazard), through the EXISTING heading integrator at `TURN_RATE`;
> `faceTarget` is per-frame today, nothing persists. The action record KEEPS the movement plan's
> own `type` (every exhaustive map over action types, the PC seat's `remember`, PT-C0's classes
> and stats see the runner-up's type, byte-identical shut) and carries the decision as an overlay
> field; a live PC reaction hold overrides the face exactly as it overrides the target (a body
> under a hold does not turn either) — pinned. ⛔ No new heading law, TURN_RATE untouched, no step
> toward the carrier (the CHASE limb, HELD), the passer untouched (M-RC.6), 3a's arm-loop read and
> `pcLatency.ts` byte-identical. (vi) THE TRADE (M-BF.4) is BF's by composition — pin **G-TRADE**:
> `bfFacingCost` + `rcReady` at w = 1 on a fixture: the receiver who turns to face a carrier 90°
> off his motion covers LESS ground than his `rcReady`-shut twin, by BF-T0's own factor; with BF
> shut the turn is free (stated as the reason RC-T1b arms BF in both arms). (vii) PINS
> (`tests/rcReady.test.ts`, from birth; the `rcAnticipate.test.ts` idioms): prohibitions · no
> serialization · **G-OFF** · **G-BORN** · **G-ZERO** · **G-INERT** · **G-TABLE** · **G-CELL** ·
> **G-RANK** · **G-SCORE** · **G-MOVEMENT-KEPT** · **G-HOLD** · **G-BITE** · **G-TRADE** · channel
> closure · seam map · **G-RNG** · **G-3A-UNTOUCHED** · the fingerprint literal RUN. Existing pins
> narrowed per DF-T0 §P7 only, each listed. (viii) STAGE DOC **`RC-T0B-READY-SEAM.md`**. ZERO sims
> of record; scratch **900,002,600–699** for pin walks. (ix) PRE-COMMITMENT: a seam has none.

### in plain football language

今天接球人是**侧着**接球的：他的身子朝着他正在跑的方向，不朝着球会来的方向 —— 三次里有两次。
这道门只多给他**一个可以选的动作**：当自己人正拿着球、并且**正把肩膀转向他**的时候，他可以在球
出脚**之前**先把身子打开对着那个人，而**脚下的跑动一模一样不变**。要不要这么做是他自己在同一个
打分表里比出来的，权重是全队那颗「信不信身体信号」的基因，信多少则是侦测普查**量出来的表**
（这种时刻到底有多大概率真的是在给我起脚）。因为身体朝向的价钱已经上线，转身会掉速 —— 所以这
是一笔**真的取舍**。这一阶段**什么都没上线**：开关默认关，世界 12 一个字节没动。

⚠️ **但有一件必须先说的事**（§4 HONEST LIMITS 1，也是这一阶段最重要的产出）：按裁决冻结的算分
方式，这个候选**在出厂的打分表里永远赢不了** —— 它的天花板比「回位保持阵型」那一档还低。机制
是通的、量得到、也真的会转身（用学习过的打分向量就能看见），但在默认向量下它一次都不会被选中。
这不是缺陷，是**量出来的事实**，交给指挥官裁。

## §1 THE MECHANISM (what armed means)

Armed (`rcReady: true` **AND** a NON-ABSENT `rcAnticipationWeight` gene **AND** a same-side
carrier on the pitch **AND** a valid cell **AND** `w · belief > 0`), the receiver's OWN off-ball
menu gains ONE candidate, and when it wins the argmax his BODY TURNS while his LEGS keep the plan
they already had:

```text
carrier = ball.owner           [same side as me, not me, sentOff === false]
rank    = alignmentRank(carrier.pos, carrier.heading, mates, my gid)
          [RC-T0's OWN function object (identity-pinned); RC-C0 §P.A's cue byte for byte;
           mates = every same-side body that is not the carrier and is on the pitch,
           THE KEEPER INCLUDED]
cell    = (speedBin(|carrier.vel|) · 4 + angSpeedBin(prevH, H)) · 6 + rankSlot(rank)
          [RC-C0b §P.B: speed edges 1 / 2 / 3.5 / 5 m/s · angular-speed edges 0.5 / 2 / 4 rad/s
           (the top bin is [4, TURN_RATE], the engine's own cap) · rank slots 1..5 and ≥ 6
           ⇒ 5 × 4 × 6 = 120 cells; a degenerate heading on either side, or no rank, ⇒ NO cell]
belief  = RC_READY_BELIEF_E[cell] = cellWindupTargetMe.E[cell] / cellTicks.E[cell]
          [RC-C0b's OWN measurement, read off its artifact; 0 for no cell and 0 when the
           denominator is 0 — the ONE written rule, for the zero denominator alone]
score   = w · belief · s_receive                      (s_receive = ReceivePass's own 1.2)
```

pushed ONLY when `score > 0`. **The argmax IS the decision** — no threshold, no ban, nothing
leaves the menu. `w` = `rcAnticipationWeight` (born absent; absent ⇒ no candidate at all, 0 ⇒
`score = 0` ⇒ no candidate — byte-identical to today either way).

**The football sentence**: 「看见自己人拿球正转向我，先把身子打开对着他」 —— 而信多少是基因，
选择去定它的大小，不是我们。

### THE BELIEF, AND WHERE ITS 240 INTEGERS COME FROM

Ruling #373's status line carries **two** measured tables; their product over a **shared** cell is
the stored joint, and the middle term cancels exactly:

```text
belief(cell) = P(wind-up ∧ target = me | cell)
             = [cellWindup[cell] / cellTicks[cell]] × [cellWindupTargetMe[cell] / cellWindup[cell]]
             = cellWindupTargetMe[cell] / cellTicks[cell]
```

so `src/ai/receiverReadySeat.ts` stores the two ENDS as integer arrays — never rounded decimals —
and G-TABLE re-derives all 120 quotients **bit-exactly** (`toBe`) off
`docs/world-model/data/rc-c0b-detector-census.json`, whose FILE bytes hash to
`a07d5692…0f83` and whose published body hash is `37cdff0b…f41b` (both asserted). The arm is
**E**, the EMPTY-BOOK / licence arm. The **DOSED** arm's own 120 quotients are the
book-independence check: they are NOT in the shipped module, and the pin re-derives them from the
same artifact and compares the two arms' per-tick base rates — **E 0.020282** vs **D 0.020750**,
and the two arms agree on which cells carry any belief at all in ≥ 110 of 120 cells. **The
recompute recipe for every number in this section** is `bins.cellWindupTargetMe.<arm>[c] /
bins.cellTicks.<arm>[c]` over that file.

⭐ **THE ONE WRITTEN RULE IS THE ZERO DENOMINATOR** (`cellTicks === 0 ⇒ belief 0`). It is **not**
a count floor and **not** a threshold (#378 item 6(ii)). In this battery it bites on exactly the
twenty **rank ≥ 6** slots, which 6v6 can never fill; **every** populated cell carries more than
1,000 (carrying tick × mate) pairs, so nothing measured is suppressed. Of the 120 cells, **100**
are populated, **72** carry a belief above zero and **48** are zero (the 20 empty slots plus 28
populated cells in which the census never once saw a wind-up aimed at that mate).

⭐ **THE CELL ORDERING WAS CONFIRMED, NOT GUESSED.** `cellIndex = (speedBin · NANG + angBin) ·
NRANK + (rank − 1)` is read off RC-C0b's own probe and its artifact's `cellDefinition.cellIndex`
string, and the pin reproduces **`familyF.cells` = [18, 42, 66, 90, 114]** (the top angular-speed
bin ∧ rank 1 across the five speed bins) from the formula — which fixes the two inner axes beyond
doubt.

### THE CANDIDATE, THE OVERLAY, AND THE FACE

* **THE ANCHOR HAS ONE HOME.** `ReceivePass`'s own literal `1.2` is hoisted into `RC_S_RECEIVE`
  in `PlayerBrain.ts` and **both** sites read the name, so no second copy exists and the shipped
  push still scores exactly 1.2 (pinned, live, off the brain's own `action.scores`). Canon
  copied, VERBATIM: *"a src-extracted constant pins its extraction to the NAMED call site —
  anchored match + line receipt — never first-occurrence"* (home:
  BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1).
* **THE OVERLAY.** The candidate is pushed into the SAME `cands` array and sorted by the SAME
  shipped `sort`. If it comes out on top, the seam records the carrier's gid and **splices the
  entry back out**; because `Array.prototype.sort` is stable, removing one element leaves the
  relative order of every other candidate untouched, so `cands[0]` is then **exactly the
  runner-up under the very same tie-break** — the action the body would have executed with the
  door shut. That runner-up's `type`, `targetIdx` and displayed `scores` are what the record
  carries; the decision rides as an OPTIONAL field `readyFaceGid`. ⛔ `AnticipatePass` is **not
  an `ActionType`** — the union in `src/sim/types.ts` is untouched, so the compiler itself
  forbids it becoming `p.action.type`, and every exhaustive map over the union, the PC seat's
  `remember`, PT-C0's action classes, the stats and the renderer see the plan the body runs.
* **THE FACE.** In `actionExecutor.ts`, after every case and both clamps and **immediately above
  the PC latency gate**, `p.faceTarget = { x: carrier.pos.x, y: carrier.pos.y }` — **COPIED,
  never aliased** (the file's own starred hazard). The carrier is re-read from the ball THAT
  frame, so a body whose decision is stale about who is carrying simply does not turn. Nothing
  else moves: the heading then integrates toward it through the **existing** `Player.physicsStep`
  block at `TURN_RATE` = 6.5, exactly as it does for a backpedalling marker or a keeper facing
  the ball.
* **THE PC HOLD WINS.** The write sits ABOVE the gate for two reasons that are one reason: a live
  hold rewrites `p.faceTarget` unconditionally (so a body still processing a surprise does not
  turn either — G-HOLD pins that the held face wins on **every** such tick), and when he is NOT
  held `pcSeat.remember(p.gid, target, p.faceTarget, p.action.type)` records **the face he
  actually ran**, so a later surprise freezes the true plan.

### THE MEMORY, AND ITS PHASE AGAINST RC-C0b's

The angular-speed axis needs the carrier's heading at **two consecutive ticks**. RC-T0b keeps its
own flag-gated store on the `Match` (two `Float64Array`s, `[x, y]` per gid) — ⛔ **no `Player`
field**, and **nothing is allocated at all** when the door is shut. `rcReadyObserve()` runs at the
**HEAD of `step()`**, beside the house observe hooks (`dv` / `ek` / `l3` / `pc`) and before
`stepCount++`, and shifts: `prev ← cur`, `cur ← this tick's live heading`.

⭐ **THE PHASE, EXACTLY.** Brains run **before** physics inside a step, so a body deciding inside
step *t* reads a carrier `heading` of h[t−1] (the end of the previous step) against a stored
`prev` of h[t−2]. RC-C0b observed at the **END** of each step, i.e. its pair for tick *t−1* is
(h[t−2], h[t−1]) — **the same pair**. Speed and both positions are read at the same instant, so
**the seat's cell IS RC-C0b's cell for tick t−1, with no within-cell drift.** The only phase
statement is that the DECISION is taken one tick after the cell's own tick (and, because the brain
only re-decides every `AI_INTERVAL`, at his own decision cadence rather than every tick) — see
§4. On the first two steps `prev` is still the zero vector, whose length is 0, so the angular
speed is not finite and there is NO cell — the census's own degenerate rule, for free.

### WHAT IS NOT TOUCHED

⛔ No new gene (the gene is 3a's). ⛔ No new heading law; `TURN_RATE` = 6.5 untouched and the
rotation block byte-identical. ⛔ No movement toward the carrier (M-RC.3c, the CHASE limb, HELD).
⛔ The passer is untouched (M-RC.6): his aim, his price, his wind-up are byte-identical, and no
`faceTarget` is written on him. ⛔ Nothing leaves any menu; TeamBrain names nobody. ⛔ 3a's
arm-loop read in `Match.pcLatencyObserve` and the WHOLE of `src/ai/pcLatency.ts` are byte-identical
to the dispatch HEAD (pinned, by file hash and anchored line receipts). ⛔ No rng is drawn.

## §2 THE FILES

| file | what |
|---|---|
| `src/ai/receiverReadySeat.ts` | NEW — **PURE** and **CHANNEL-CLOSED** (its whole import list is `['../sim/constants', './receiverAnticipationSeat']`; comment-stripped it names no match, no body class, no team layer, no private commitment, no facing target, no designation, no rng, no genome): the three bin functions (`rcSpeedBin` · `rcAngSpeedBin` with the degenerate rule · `rcRankSlot`) · `rcCellIndex` / `rcReadyCell` (RC-C0b's own ordering) · `RC_READY_TICKS_E` and `RC_READY_WINDUP_TARGET_ME_E` (2 × 120 integers, transcribed) · `RC_READY_BELIEF_E` / `rcReadyBelief` · a RE-EXPORT of 3a's `alignmentRank` (identity, never a copy) |
| `src/ai/PlayerBrain.ts` | `RC_S_RECEIVE` (the hoisted anchor, read at BOTH sites) · `RC_READY_ACTION` + the local `OffballCandidate` widening (⛔ the `ActionType` union is untouched) · **THE ONE `rcReady` FORK**, in the off-ball menu beside the `ReceivePass` push · the argmax's splice + the ONE conditional `readyFaceGid` write |
| `src/ai/actionExecutor.ts` | **THE ONE FACE WRITE**, above the PC latency gate — one overlay read, one carrier re-read, one COPIED vector |
| `src/sim/types.ts` | `ActionState.readyFaceGid?: number` — an OPTIONAL overlay field, absent on every shipped path |
| `src/sim/Match.ts` | `rcReady` config field + `readonly` + `?? false` · the two `Float64Array` memory slots (born ONLY behind the open door) · `rcReadyObserve()` + its ONE call at the head of `step()` · the ONE public read `rcReadyPrevHeading(gid)` |
| `src/sim/League.ts` | the `matchFlags` key union only (`League.toJSON` omits `matchFlags` — nothing serializes) |
| `tests/rcReady.test.ts` | THE PERMANENT PIN SUITE — 27 pins, see §3 |
| `docs/world-model/RC-T0B-READY-SEAM.md` | this file |

## §3 THE PINS (`tests/rcReady.test.ts` — **27**, ALL GREEN at the seam commit; the suite is the living inventory)

* **Road B**: the PROHIBITION SET (no world / preset / env / bundle names the flag or the
  candidate; `a4World.ts` contains neither string; every version 1–12 carries no flag; a bare
  Match, a world-12 Match and a League match all read `false` **and their memory is not even
  born** — `rcReadyPrevHeading` is `null` and no action record carries the overlay; the
  `ActionType` union does not contain `AnticipatePass`) · NO SERIALIZATION (`League.toJSON`
  omits the flag; the gene is still 3a's, born absent, outside `GENE_KEYS`; a live armed result
  carries neither `readyFaceGid` nor `AnticipatePass`).
* **G-OFF** — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte, on the BARE world AND on
  WORLD 12's composition × 2 scratch seeds each, pooled digest, four distinct cells.
* **G-BORN** — armed with the gene ABSENT ≡ shut on two seeds, and structurally zero overlays
  over a whole armed walk. **G-ZERO** — armed at gene 0 ≡ shut, pooled digest, zero overlays
  (`w · belief = 0` ⇒ nothing is pushed). **G-INERT** — no cell (degenerate previous heading,
  degenerate current heading, no rank) ⇒ belief 0 ⇒ no push, on fixtures; and armed at w = 1 on
  a world with nothing to believe the whole-match signature equals the shut twin's.
* **G-TABLE** — all **120** quotients re-derive BIT-EXACTLY (`toBe`) from the artifact ON DISK,
  whose file bytes hash to `a07d5692…0f83` and whose published body hash is `37cdff0b…f41b`;
  the two transcribed arrays ARE the artifact's own integers; the **two-table product identity**
  is re-derived cell by cell; the zero-denominator cells are proven to be **exactly** the rank
  ≥ 6 slots and every populated cell to carry > 1,000 pairs (**no floor**); the table's shape
  (100 populated · 72 believing · 48 zero) is pinned so this doc quotes no second copy. **The
  DOSED arm** re-derives too, both base rates are pinned at 6 dp, the two arms agree on ≥ 110
  cells, and the shipped module is proven NOT to contain it.
* **G-CELL** — the edges are read off the artifact's own `cellDefinition`; the index formula is
  the artifact's own string; **`familyF.cells` = [18, 42, 66, 90, 114] is REPRODUCED from the
  formula**; the census's own `speedBin.*` fixture table byte for byte; the angular-speed bins
  walked at their interiors and at `TURN_RATE`'s cap; the **degenerate rule** pinned on both
  headings (⚠ explicitly NOT the top bin, where a naive `edgeBin(NaN, …)` would land); the rank
  slots incl. rank 0 ⇒ no slot and rank ≥ 6 ⇒ the sixth; any degenerate axis kills the CELL.
* **G-RANK** — `alignmentRank` is **the same function object** as 3a's (identity, not equality),
  the ready module defines no second copy, and it still behaves as RC-C0 §P.A froze it.
* **G-SCORE** — the anchor's ONE home and its two sites, by anchored line receipts; the shipped
  `ReceivePass` push still scores **exactly 1.2**, read back live off the brain's own
  `action.scores`; the push is gated on `score > 0`.
* **⚠⚠ G-REACH** — the candidate's CEILING (`max(belief) · s_receive` at w = 1) against the
  menu's own FLOOR, both DERIVED: below `DEFAULT_POLICY.formationBase` (= 0.45, pinned), above a
  learned vector's; and the live consequence — armed at w = 1 on world 12 with the DEFAULT
  policy, **zero** overlays are ever written. See §4 HONEST LIMITS 1.
* **G-BITE + G-MOVEMENT-KEPT (walk)** — on world 12's composition with a **learned** policy
  vector (the shipped `rolePolicies` channel), armed at w = 1, over two scratch seeds: overlay
  ticks EXIST, ticks on which the applied face IS the carrier's position EXIST, and on more than
  half of them the body's heading really rotates TOWARD the carrier while the shut twin's follows
  motion; `AnticipatePass` NEVER becomes `p.action.type`; and on the FIRST tick the overlay
  appears, that body's `desiredVel` equals the shut twin's on the same seed at the same tick.
  ⭐ These are RECEIPTS, not effect sizes (canon, homes: ruling #289 item 1 +
  BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5) — they say the door OPENS, never that
  the world plays better. **G-HOLD** — held ticks occur, and the held face wins on EVERY one of
  them; the write's position above the gate and the gate's own two lines are anchored. The face
  is **COPIED, not aliased** (`toBe`-negative against the carrier's own vector).
* **G-TRADE** — BF-T0's G-SIDE fixture form, re-derived: with `bfFacingCost` armed, the READY
  body (facing a carrier 90° off his motion, written from the pre-step position exactly as the
  executor writes it) covers LESS ground than his shut twin, and both distances equal **BF's own
  law integrated OUTSIDE the engine** for the heading path each actually took (DERIVED, never
  typed). ⭐ With the price SHUT the two are **identical** — the turn is free, which is the reason
  RC-T1b arms BF in both arms. The cell the trade is taken in is the real, populated **cell 90**
  (speed bin 3 × the top angular-speed bin × rank 1) — the census's own largest belief. Plus:
  the two doors are INDEPENDENT (3b armable without 3a, and both with BF).
* **CHANNEL CLOSURE** — the ready module's import list is EXACTLY
  `['../sim/constants', './receiverAnticipationSeat']` and its COMMENT-STRIPPED code contains
  none of the forbidden channels. **THE LIVE READ SET** is pinned line by line with ordered
  1-based line receipts — the carrier's `pos` / `vel` / `heading`, his previous heading from the
  match's own memory, the mates' `pos` / `gid` / `side` / `sentOff`, my `gid`, the team's gene —
  and the whole seam block is scanned for the forbidden channels. **THE OVERLAY IS AN OVERLAY**
  — the splice, the runner-up read and the ONE conditional write, anchored; the shipped `sort` is
  untouched; the record field is OPTIONAL.
* **THE SEAM MAP** — occurrence COUNTS per needle with EVERY site enumerated across `src/**`
  (canon copied — VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle and enumerates
  EVERY occurrence's site"*; home: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1).
  Six sites and no other spelling: the ready module · `PlayerBrain.ts` · `actionExecutor.ts` ·
  `Match.ts` · `League.ts` (ONE occurrence, the key union) · `types.ts` (ONE optional field).
* **G-3A-UNTOUCHED** — `src/ai/pcLatency.ts` hashes to its dispatch-HEAD bytes
  (`0abc5068…0c91`) and 3a's arm-loop read is pinned line by line; the READY seam names the PC
  seat nowhere.
* **G-RNG** — the cell, the table and the candidate draw ZERO rng (the match's own generator
  state is unmoved across a full pricing pass); no gene is born and the ready module names
  neither `GENE_KEYS` nor any mutation.
* **THE FINGERPRINT OF RECORD** is a literal in the suite and the suite RUNS it (the
  `a4HomeGrant` form: a 2-season headless league hashed and compared) — this seam may not move
  it. ⭐ CANON "pin suites from birth" (home: ruling #297 item 7).

### ⚠ THE TWO PRE-EXISTING PINS THIS SLICE NARROWS (the DF-T0 §P7 form — stated POSITIVELY, never deleted)

1. **`tests/bfFacingCost.test.ts` § G-SITES** asserted BF-C0 §R3's `faceTarget` seam map —
   **57** occurrences in 8 files — with the claim "this seam changed NO site". RC-T0b adds
   exactly **ONE new `faceTarget` WRITE** (the receiver's pre-strike face) plus three prose
   mentions beside it, so the recount is **61** in the same **8** files. **NARROWED, NOT
   DELETED**: the map is updated to the recount AND the substantive claim is re-stated
   positively as the thing it actually asserts — the number of `faceTarget` ASSIGNMENT
   statements per file (`actionExecutor.ts` 14 → **15**, `Player.ts` **1**, `Match.ts` **4**,
   `pcLatency.ts` **1**, `rendezvousRecovery.ts` **4**), and `Player.ts`'s own three anchored
   sites, byte-identical. BF-T0's claim that IT changed no facing decision is unweakened.
2. **`tests/rcAnticipate.test.ts` § THE NEEDLE FAMILY** required every file naming any 3a needle
   to be one of five. Limb 3b shares 3a's **gene** (`rcAnticipationWeight` — M-RC.4: one gene)
   and 3a's **cue function** (`alignmentRank`, by identity), so those two names now legitimately
   appear in two more files. **NARROWED, NOT DELETED**: the needle set is SPLIT — 3a's flag and
   3a-only needles (`rcAnticipate` · `evolveReceiverAnticipation` · `rcBeliefForRank` ·
   `RC_BELIEF*` · `RC_PRECUE*` · `preCue*`) must still appear in EXACTLY the original five files,
   the two SHARED names may appear in those five plus `receiverReadySeat.ts` and
   `PlayerBrain.ts`, and the two new files are asserted to contain **no** 3a-only needle. 3a's
   substantive claim — that nothing outside its five files can move with its flag or its law — is
   unweakened.

⚠ Both are another stage's pins. **Flagged for commander ratification.**

## §4 HONEST LIMITS

1. ⚠⚠ **THE CANDIDATE CANNOT WIN UNDER THE SHIPPED DEFAULT POLICY — a measured fork, not a
   defect.** The off-ball menu pushes `MoveToFormationSpot` **unconditionally** at
   `W.formationBase`, so any candidate must beat that to be chosen. `DEFAULT_POLICY.formationBase`
   is **0.45**. The READY candidate's ceiling is `max(belief) · s_receive` at `w = 1`, and
   RC-C0b's largest cell belief is cell 90's **32,231 / 134,660** — so the ceiling is
   `(32231 / 134660) · 1.2`, which is **below 0.45**. ⇒ armed at any gene value on the default
   policy vector, `AnticipatePass` never wins and **not one body ever turns** (pinned live:
   zero overlays over a full world-12 walk at w = 1). The mechanism is otherwise complete and
   demonstrably reachable: on a **learned** policy vector (`rolePolicies`, the shipped Phase-18
   channel) with the three off-ball shape weights lowered, the walk pins show the candidate
   winning, the face applied and the heading turning. ⛔ The executor did NOT rescale, re-anchor,
   add a floor or otherwise touch the frozen score form (#378 item 6(ii)/(iv) forbid a new
   constant); **the fork is the commander's**: re-anchor `s_receive`, price the shape floor, or
   accept that 3b is a trait that only a policy vector low on shape can express. RC-T1b cannot
   measure 3b on the default vector as things stand.
2. ⚠ **THE JOINT IS A PER-TICK PROBABILITY, NOT A PER-PASS ONE.** `belief` answers "on a tick
   like this one, is a wind-up live AND aimed at me?" — RC-C0b's own denominator is (carrying
   tick × mate) pairs. It is NOT "will this possession end in a pass to me", and #373 item 3
   already struck a per-PASS reading of a per-TICK coverage. A believer who is right about the
   tick may still be wrong about the flight.
3. ⚠ **SPARSE CELLS, WITH THEIR COUNTS.** There is **no count floor** (forbidden). The cells with
   fewer than 1,000 (carrying tick × mate) pairs are exactly the **twenty rank ≥ 6 slots** — cell
   indices 5, 11, 17, 23, 29, 35, 41, 47, 53, 59, 65, 71, 77, 83, 89, 95, 101, 107, 113, 119 —
   each with **0** ticks and therefore quotient **0** by the zero-denominator rule. 6v6 has at
   most five same-side mates, so no rank ≥ 6 can ever exist and those cells are unreachable, not
   merely rare. Every one of the other 100 cells carries more than 1,000 pairs. (Recompute:
   `bins.cellTicks.E[c]` and `bins.cellWindupTargetMe.E[c]` over the artifact.)
4. ⚠ **THE KEEPER NEVER REACHES THIS MENU — REPORTED, NOT DECIDED.** `decidePlayer`
   (`src/ai/PlayerBrain.ts`) routes `p.role === 'GK'` to `decideGoalkeeper` and **returns**, so a
   keeper never enters `decideOffBall` and can never take the READY candidate. He IS in the mate
   population the rank is computed over (RC-C0 §P.A's authority, ruling #370 item 3: the keeper
   included), so he can take rank 1 and cost an outfielder a rank without ever being able to act
   on it. Whether that asymmetry should stand is the commander's, not this stage's.
5. ⚠ **THE BELIEF IS WORLD 12's EMPTY-BOOK NUMBER**, and the DOSED table is published beside as
   the check. RC-C0b measured on world 12's composition; the two arms' per-tick base rates are
   **0.020282** (E) and **0.020750** (D) and they agree on which cells believe at all in ≥ 110 of
   120 cells — the signal is the carrier's BODY, not the recognition book (#373 item 2). But a
   world with a different composition would have a different table, and the seat carries this one.
6. ⚠ **THE DECISION IS ONE TICK LATER THAN ITS CELL, AND ONLY AT HIS OWN CADENCE.** The cell the
   seat computes is bit-for-bit RC-C0b's cell for tick *t−1* (§1), but it is acted on during tick
   *t*, and a body re-decides only every `AI_INTERVAL` (≈ 9 ticks) — so a carrier's swing is
   sampled at the receiver's decision rate, not the census's tick rate. The census's coverage
   numbers are therefore an UPPER bound on how often the limb can fire.
7. ⚠ **THE TABLE IS ORDINAL IN RANK AND COARSE IN THE OTHER TWO AXES.** Rank carries no magnitude
   (a rank-1 mate at 5° and one at 80° buy the same belief — and #373 showed rank cannot move
   P(wind-up | ·) at all, since it partitions the mates inside a tick); speed and angular speed
   are 5 and 4 bins. RC-C0 §COMMANDER CORRECTIONS item 1 is inherited: rank-1-ness and
   "ambiguity 0" coincide in that battery but not BY DEFINITION.
8. ⚠ **FACING CHANGES THE BK RECEPTION SECTOR — AND THAT IS RC-T1b's FACE, NOT THIS SEAM'S
   CLAIM.** A body that meets the ball front-on rather than side-on is priced differently by the
   shipped BK shell. This stage measures nothing about it and claims nothing about it.
9. ⚠ **WITH `bfFacingCost` SHUT THE TURN IS FREE** (G-TRADE pins the identity). So an exam that
   armed 3b without arming BF would measure a free lunch — which is exactly why M-BF.4 and #378
   item 6(vi) require BF armed in BOTH arms of RC-T1b.
10. ⚠ **WHAT ARMED DOES NOT CLAIM.** RC-C0b's LICENCE says the cue carries information, not that
    reading it helps; ARMED here means "the capacity exists behind a shut door", not that the
    world is better. This stage runs **ZERO sims of record** and states no football finding. The
    walk counts in §3 are arming receipts and are never effect sizes.
11. ⚠ **NOTHING SHIPPED.** `rcReady` is false in every production path, the memory is not even
    allocated there, `readyFaceGid` is absent from every shipped action record, the fingerprint is
    unchanged and world 12's bytes are untouched.

## §COMMANDER CORRECTIONS (ruling #379 — the measured fork RULED; the executor's deviations disposed; the fix's target stated; the seam otherwise UNCHANGED until §FIX)

1. **THE FORK (G-REACH) IS THE COMMANDER'S ERROR, AND IT IS RULED.** #378 item 6(iv) put a FACING
   decision into the MOVEMENT argmax; since the movement is kept byte for byte, facing never
   excluded running and the argmax was a de-facto threshold at belief > 0.375 (0.45 / 1.2) that
   no measured cell reaches (max 0.239351). Ruling #379 item 3 replaces the form: **THE TRADE IS
   THE DECISION** — the receiver faces the carrier iff BENEFIT > COST, BENEFIT = `w · belief ·
   s_receive` (unchanged), COST = `(1 − f(φ)) · S_move` with `f` = BF's own `facingFactor` at the
   body's own `facingDepth`, φ = the angle between this frame's intended direction and the bearing
   to the carrier, and `S_move` = the movement plan's own priority (`p.action.scores[0].score`).
   No new constant. BF shut ⇒ COST 0 ⇒ the free turn (RC-T1b arms BF in both arms). The
   movement menu is untouched — the brain records `readyFaceGid` + `readyBenefit`; the executor
   resolves the trade at the face-write site. Landed by RC-T0b-FIX (§FIX below).
2. **DISPOSITIONS** (#379 item 4): the ActionType union not widened — ACCEPTED as stronger; the
   learned-vector G-BITE — SUPERSEDED by the fix's default-vector G-BITE; the two narrowed pins
   (`bfFacingCost` G-SITES 57 → 61 restated as per-file ASSIGNMENT counts; `rcAnticipate` needle
   family split into 3a-only vs the two shared names) — RATIFIED; the comment rewording —
   ACCEPTED; the keeper never reaching the off-ball menu while sitting in the rank population —
   an HONEST LIMIT of record, a keeper READY limb a HELD door; the one-tick / AI_INTERVAL cadence
   — of record (RC-C0b's coverage is an UPPER bound on firing).
3. **UNTIL §FIX LANDS, §1's "the argmax IS the decision" and §4 limit 1 describe the SUPERSEDED
   form**; the words of record for the decision are #379 item 3, quoted in §FIX.
