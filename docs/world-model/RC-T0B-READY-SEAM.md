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
这道门只多给他**一件可以做的事**：当自己人正拿着球、并且**正把肩膀转向他**的时候，他可以在球
出脚**之前**先把身子打开对着那个人，而**脚下的跑动一模一样不变**。

⭐ **要不要转，是一笔明码标价的买卖**（裁决 #379 item 3）：转身**不跟"跑不跑"抢名额**——它不
妨碍你跑；它要比的是**"转过去会慢多少"**。想开身子的好处 = 全队那颗「信不信身体信号」的基因 ×
侦测普查**量出来的表**（这种时刻到底有多大概率真的是在给我起脚）× 接球这件事本来的分量；代价 =
**侧着跑掉的那点速度**，用的正是已经上线的身体朝向价钱，再乘上**这一脚跑动本身有多要紧**。好处
大于代价才转。所以：很可能传给我 ⇒ 侧着跑也把身子打开；只是有点可能 ⇒ 顺手才开；正在全速冲向
一个要紧的位置 ⇒ 不回头看。身体朝向的价钱关掉时，转身不要钱，那就随便转——这是设计，不是漏洞。

这一阶段**什么都没上线**：开关默认关，世界 12 一个字节没动。（上一版把"转身"塞进了"跑去哪"的
同一张打分表里，结果它永远赢不了、一次都不会转 —— 那是指挥官自己的分类错误，已在本轮改正。）

## §1 THE MECHANISM — ⭐ THE TRADE IS THE DECISION (what armed means)

> **THE WORDS OF RECORD FOR THE DECISION are COMMANDER RULING #379 item 3, VERBATIM** (they
> stand BESIDE #378 item 6, quoted in §0: item 6 (i)–(iii) and (vi)–(ix) are unchanged and
> LANDED at `10b2ff6`; its **(iv) and (v) — the candidate in the movement argmax and the
> splice — are SUPERSEDED** by this item, landed by RC-T0b-FIX, §FIX below):

> 3. ⭐⭐ **RULED — THE TRADE IS THE DECISION** (M-RC.3b's decision form,
>    AMENDED; the RC contract carries it). In plain football:
>    「转不转身，不该和"跑不跑"抢同一个名额；该和"转过去会慢多少"比。
>    他很可能传给我 ⇒ 就算要侧着跑也把身子打开；只是有点可能 ⇒ 顺手才开；
>    正在全速冲 ⇒ 不回头看」. THE FORM: the receiver faces the carrier
>    iff **BENEFIT > COST**, where BENEFIT = `w · belief · s_receive`
>    (unchanged: the gene, RC-C0b's joint, `ReceivePass`'s own 1.2) and
>    COST = `(1 − f(φ)) · S_move` — the fraction of the movement's speed
>    the body would FORFEIT by facing off its line, `f` = BF's own
>    `facingFactor(cos φ, p.facingDepth)` evaluated PROSPECTIVELY at φ =
>    the angle between the movement plan's intended direction (the
>    executor's own `target − pos` for this frame, after both clamps)
>    and the bearing to the carrier, times `S_move` = the movement
>    plan's OWN priority (`p.action.scores[0].score`, the menu's winner
>    — the existing record). ⛔ NO NEW CONSTANT: every factor is an
>    existing quantity of the engine (the menu's currency, BF's law, the
>    body's own depth, the measured table, the gene). CONSEQUENCES, all
>    pinned by the fix: BF shut ⇒ `facingDepth` 0 ⇒ COST 0 ⇒ he faces
>    whenever `w · belief > 0` (the free turn, stated; the reason RC-T1b
>    arms BF in BOTH arms and the RC entry is cut WITH BF); a standing
>    body (speed 0 or a degenerate intent) ⇒ COST 0; at the shipped
>    depth 0.30 and the default floor 0.45, COST ≤ 0.135 ⇒ at w = 1 the
>    SEVEN cells with belief > 0.1125 (all in the top angular-speed bin,
>    ranks 1–2 — 「他正猛地转身，而我是他最对着的两个人之一」) face even at
>    90°, and every believing cell faces when the turn is nearly free (φ
>    small); a higher-priority run raises the cost. VISION: allows, never
>    assigns; the gene means something (w scales trust against a REAL
>    price); no executor told to face; emergent. REALITY: a coached
>    receiver opens up when he is the likely outlet and the turn is
>    cheap, and does not turn his head off a sprint; the price he weighs
>    is the one his body will pay. PASS both. THE MOVEMENT MENU IS NOW
>    UNTOUCHED (no push, no splice — the `OffballCandidate` widening and
>    the splice are removed; the brain records the decision's INPUTS as
>    overlay fields; the executor resolves the trade at the face-write
>    site every frame, so the face follows the plan frame by frame while
>    the belief holds for the brain's AI_INTERVAL). Options REJECTED:
>    (a) re-anchor `s_receive` — a taste constant; (b) lower
>    `formationBase` — world 12's bytes; (c) a low-shape policy vector
>    in RC-T1b — an exam of a door that cannot open in the world the
>    user plays.

Armed (`rcReady: true` **AND** a NON-ABSENT `rcAnticipationWeight` gene **AND** a same-side
carrier on the pitch **AND** a valid cell **AND** `w · belief > 0`), the receiver's OWN off-ball
menu is left **exactly as it was** and his body gains ONE new question, answered every frame:
**is opening up worth what it costs me?**

```text
──────────── THE BENEFIT — decided in PlayerBrain.decideOffBall, at his decision cadence ────────────
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
BENEFIT = w · belief · s_receive                      (s_receive = ReceivePass's own 1.2)
          [recorded on the action record as `readyBenefit`, beside `readyFaceGid` — ONLY when
           BENEFIT > 0, so a body with nothing to believe carries NO field at all]

──────────── THE COST — resolved in actionExecutor.executeAction, EVERY frame ────────────
dir     = target − p.pos       [THIS frame's intended direction, after every case and BOTH
                                clamps — the executor's own `target`, read never written]
bearing = carrier.pos − p.pos  [the carrier RE-READ from the ball this frame]
COST    = (1 − facingFactor(facingCosine(dir, bearing), p.facingDepth)) · p.action.scores[0].score
          [both vectors passed as UNITS; BF's own two functions, IMPORTED from
           src/sim/bodyFacing.ts — neither formula is re-typed; `p.facingDepth` is the body's
           OWN depth (0 unless bfFacingCost is armed); `p.action.scores[0].score` is S_move,
           the MENU WINNER's own priority, already on the record. `speedF` 0, a degenerate
           `dir` or a degenerate bearing ⇒ COST = 0]

──────────── THE DECISION ────────────
he faces  iff  BENEFIT > COST            [STRICT; then p.faceTarget = the carrier's pos, COPIED]
```

⛔ **NO NEW CONSTANT**: every factor is an existing quantity of this engine — the gene, the
census's table, `ReceivePass`'s own anchor, BF's own law, the body's own depth and the menu's
own currency. ⛔ **NOTHING ENTERS THE MOVEMENT MENU**: there is no candidate, no push and no
splice, so the argmax, its tie-break, the plan, the displayed `scores` and every downstream
reader are byte-identical to shut BY CONSTRUCTION rather than by measurement.

⭐ **THE FREE TURN.** With `bfFacingCost` shut every body's `facingDepth` is 0, `facingFactor`
returns exactly 1, COST is exactly 0 — and a receiver turns whenever he believes at all. That is
not a defect of the form, it IS the form: a world in which turning is free should turn freely,
and it is precisely why M-BF.4 and #378 item 6(vi) require BF armed in BOTH arms of RC-T1b. A
standing body, or one whose plan names no direction, likewise pays nothing.

**The football sentence**: 「看见自己人拿球正转向我，先把身子打开对着他」 —— 信多少是基因，
转过去要慢多少是身体的价钱，两个一比才是决定。

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

### THE ANCHOR, THE TWO OVERLAY FIELDS, THE PRICE AND THE FACE

* **THE ANCHOR HAS ONE HOME.** `ReceivePass`'s own literal `1.2` is hoisted into `RC_S_RECEIVE`
  in `PlayerBrain.ts` and **both** sites read the name, so no second copy exists and the shipped
  push still scores exactly 1.2 (pinned, live, off the brain's own `action.scores`). Canon
  copied, VERBATIM: *"a src-extracted constant pins its extraction to the NAMED call site —
  anchored match + line receipt — never first-occurrence"* (home:
  BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1).
* **THE TWO OVERLAY FIELDS.** The brain writes `readyFaceGid` (who) and `readyBenefit` (what he
  believes it is worth) on the action record **after** the record is built, and only when
  `w · belief > 0`. They are **INPUTS to a decision, never a plan**: `p.action.type` is the menu
  winner's own action type, so every exhaustive map over `ActionType`, the PC seat's `remember`,
  PT-C0's action classes, the stats and the renderer see the plan the body runs. ⛔ The name
  `AnticipatePass` no longer exists anywhere in `src/**` (pinned at zero in every file) — after
  the fix there is no candidate to keep out of the union.
  ⚠ UNIT-NAME TRUTH (canon, VERBATIM: *"a field carries the unit its name claims"*; home:
  ruling #294 item 3): `readyBenefit` is a PRIORITY in the utility menu's own currency and is
  therefore DIMENSIONLESS — it is not a probability (the belief alone is that), and the COST it
  is weighed against is quoted in that same currency by construction.
* **THE PRICE IS BF's, ASKED PROSPECTIVELY.** The executor asks BF's own law what THIS frame's
  turn would cost — `1 − f(φ)` is the fraction of the movement's speed a body forfeits by facing
  off its line — and charges it against `S_move`, the priority the menu itself put on that
  movement. A body sprinting somewhere urgent pays a lot to look back; a body drifting into
  shape pays little; a body already running toward the carrier pays nothing. Both functions are
  **IMPORTED**, so the law keeps exactly one home (BF §2 M-BF.1) and the price the decision
  quotes is the price `Player.physicsStep` will actually charge.
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
* ⭐ **THE TWO CADENCES, STATED.** The BENEFIT is a brain quantity and holds for his
  `AI_INTERVAL`; the COST is an executor quantity, re-resolved EVERY frame against the direction
  he is actually being driven in. So a believing receiver may open up, straighten as his run
  turns urgent, and open again — with the movement plan never changing at all.

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

⛔ **No candidate and no menu change** (the fix): `cands` is the shipped `UtilityScore[]`, no
push, no splice, no cast — the movement argmax is the pre-seam one, character for character.
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
| `src/ai/PlayerBrain.ts` | `RC_S_RECEIVE` (the hoisted anchor, read at BOTH sites) · **THE ONE `rcReady` FORK**, in the off-ball menu beside the `ReceivePass` push, computing the BENEFIT · the ONE conditional two-field overlay write at the foot (⛔ NO candidate, NO push, NO splice, NO cast — `cands` is the shipped `UtilityScore[]`) |
| `src/ai/actionExecutor.ts` | **THE TRADE, AND THE ONE FACE WRITE**, above the PC latency gate — the two overlay reads, one carrier re-read, the COST from BF's two IMPORTED functions against `p.action.scores[0].score`, the STRICT comparison, one COPIED vector |
| `src/sim/types.ts` | `ActionState.readyFaceGid?: number` and `ActionState.readyBenefit?: number` — TWO OPTIONAL overlay fields, absent on every shipped path, written together or not at all |
| `src/sim/Match.ts` | `rcReady` config field + `readonly` + `?? false` · the two `Float64Array` memory slots (born ONLY behind the open door) · `rcReadyObserve()` + its ONE call at the head of `step()` · the ONE public read `rcReadyPrevHeading(gid)` |
| `src/sim/League.ts` | the `matchFlags` key union only (`League.toJSON` omits `matchFlags` — nothing serializes) |
| `tests/rcReady.test.ts` | THE PERMANENT PIN SUITE — **36** pins after the fix (27 at the seam), see §3 |
| `docs/world-model/RC-T0B-READY-SEAM.md` | this file |

## §3 THE PINS (`tests/rcReady.test.ts` — **36** after the fix, ALL GREEN; the suite is the living inventory; 27 at the seam commit)

* **Road B**: the PROHIBITION SET (no world / preset / env / bundle names the flag or the
  candidate's old name; `a4World.ts` contains neither string; every version 1–12 carries no flag; a bare
  Match, a world-12 Match and a League match all read `false` **and their memory is not even
  born** — `rcReadyPrevHeading` is `null` and no action record carries the overlay; the
  `ActionType` union does not contain `AnticipatePass`) · NO SERIALIZATION (`League.toJSON`
  omits the flag; the gene is still 3a's, born absent, outside `GENE_KEYS`; a live armed result
  carries neither `readyFaceGid` nor `AnticipatePass`).
* **G-OFF** — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte, on the BARE world AND on
  WORLD 12's composition × 2 scratch seeds each, pooled digest, four distinct cells.
* **G-BORN** — armed with the gene ABSENT ≡ shut on two seeds, and structurally zero overlays
  over a whole armed walk. **G-ZERO** — armed at gene 0 ≡ shut, pooled digest, zero overlays
  (`w · belief = 0` ⇒ nothing is recorded). **G-INERT** (re-stated for the fix) — no cell
  (degenerate previous heading, degenerate current heading, no rank) ⇒ belief 0 ⇒ **no overlay
  fields at all**, on fixtures; and on an armed walk the fork really ABSTAINS (ticks with no
  overlay exist beside ticks with one) while **no record ever carries one field without the
  other**. ⚠ "Nothing to believe" is a PER-TICK condition, not a world — the belief table is a
  fixed measurement, independent of the world being played — so the WORLD-level shut byte is
  pinned where it is actually true: G-BORN (gene absent) and G-ZERO (gene 0), pooled digests.
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
  `action.scores`; the fork is gated on `score > 0`. **G-SCORE (live, the fix's own)** — on an
  armed default-vector walk EVERY `readyBenefit` the brain records is BIT-EXACTLY one of the
  table's own believing quotients times the anchor (Set membership under `toBe` semantics), is
  strictly positive, and never exceeds the ceiling `max(belief) · 1.2`.
* **⭐⭐ G-TRADE-DECISION** (7 pins — REPLACES the seam's G-REACH, ruling #379 item 5(iv)) —
  the fix's own gate, driven through the **REAL `executeAction`** on a constructed body and
  carrier (`MoveToPoint` is the one case whose target is the caller's own coordinate, so this
  frame's intended direction is chosen while the clamps, the trade and `p.faceTarget` stay the
  engine's; the fixture PROVES no clamp intervened rather than assuming it):
  **(a)** BF shut (`facingDepth` 0) ⇒ COST exactly 0 ⇒ he faces at φ = 0 / 45 / 90 / 135 / 180
  on the FAINTEST belief the table carries — and a benefit of 0 faces nowhere;
  **(b)** depth `BF_DEPTH`, φ = 90°, `S_move` = `DEFAULT_POLICY.formationBase` (the off-ball
  menu's own unconditional floor, pinned = 0.45) ⇒ he faces iff the benefit exceeds the bound
  **DERIVED by CALLING `facingFactor`** — the ceiling clears it, the faintest belief does not,
  and a benefit EXACTLY AT it does NOT face (the comparison is STRICT); the number of cells
  whose benefit clears that bound at w = 1 is derived in the same pin;
  **(c)** φ = 0 ⇒ `facingFactor(1, depth)` is exactly 1 ⇒ COST 0 ⇒ he faces on any positive
  belief even on a priced body; **(d)** a HOLDING plan (the target IS his own position) ⇒ no
  direction ⇒ COST 0; **(e)** a higher-priority run RAISES the bound, and a belief between the
  two bounds turns him on the cheap plan and not on the urgent one; **(f)** MUTANT — a body
  with `facingDepth` 0 faces where the priced body does not, at a benefit STRICTLY between the
  two bounds (the depth is a LIVE conjunct); **(g)** THE FORM AT THE SITE — both functions
  IMPORTED (no formula re-typed, no `BF_DEPTH`, no literal), `S_move` read off the record, the
  STRICT `>` anchored, and the whole trade block proven to write no `target`, no `speedF`, no
  velocity and no position.
* **⭐⭐ G-BITE — ON THE DEFAULT VECTOR** (2 pins; the seam's learned-vector G-BITE is
  SUPERSEDED, #379 item 4(ii)): world 12 **exactly as composed** — ⛔ no `rolePolicies`
  override — with `rcReady` AND `bfFacingCost` armed at w = 1 on both teams, over two scratch
  seeds: overlay ticks EXIST, ticks on which the applied face IS the carrier's position EXIST,
  and on more than half of them the body's heading really rotates TOWARD the carrier; and the
  SAME walk with `bfFacingCost` SHUT records **strictly more** facing ticks than with it armed
  — the price bites on the DECISION, not merely on the legs. ⭐ RECEIPTS, not effect sizes
  (canon, homes: ruling #289 item 1 + BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5).
* **⭐⭐ G-MOVEMENT-KEPT, in two halves** — (i) LIVE: on the FIRST tick a face is applied, that
  body's `p.action.type` AND his displayed `p.action.scores` equal the shut twin's at the same
  tick (until the first face the two worlds are identical, so the twin is the exact
  counterfactual), and the shut twin wrote NO face at all, so his heading follows his motion
  under the shipped integrator; (ii) STRUCTURAL, an ANCHORED ABSENCE: `OffballCandidate`,
  `RcReadyCandidate`, `RC_READY_ACTION`, `AnticipatePass`, `cands.splice`, `as UtilityScore[]`
  and `rcReadyCand` are GONE from the brain, and both menus declare the shipped
  `const cands: UtilityScore[] = []` — so `cands` can never carry a non-`ActionType` BY
  CONSTRUCTION. **G-HOLD** — held ticks occur, and the held face wins on EVERY one of them; the
  write's position above the gate and the gate's own two lines are anchored. The face is
  **COPIED, not aliased** (`toBe`-negative against the carrier's own vector).
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
  — the two locals, the ONE conditional two-field write and both record lines, anchored; the
  shipped `sort` is untouched; both record fields are OPTIONAL and travel together or not at
  all (asserted live on every walk).
* **THE SEAM MAP** — occurrence COUNTS per needle with EVERY site enumerated across `src/**`
  (canon copied — VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle and enumerates
  EVERY occurrence's site"*; home: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1).
  Six sites and no other spelling: the ready module · `PlayerBrain.ts` · `actionExecutor.ts` ·
  `Match.ts` · `League.ts` (ONE occurrence, the key union) · `types.ts` (TWO optional fields).
  ⭐ THE FIX RE-COUNTED IT: `readyBenefit` is ADDED to the family, and `AnticipatePass` is
  counted at **ZERO in every `.ts` file under `src/`** (the candidate's name went with the
  candidate), alongside per-file counts for `readyFaceGid`, `rcReadyCarrierGid`,
  `rcReadyBenefit` and the anchored write lines.
* **G-3A-UNTOUCHED** — `src/ai/pcLatency.ts` hashes to its dispatch-HEAD bytes
  (`0abc5068…0c91`) and 3a's arm-loop read is pinned line by line; the READY seam names the PC
  seat nowhere.
* **G-RNG** — the cell, the table and the benefit draw ZERO rng (the match's own generator
  state is unmoved across a full pricing pass); no gene is born and the ready module names
  neither `GENE_KEYS` nor any mutation.
* **THE FINGERPRINT OF RECORD** is a literal in the suite and the suite RUNS it (the
  `a4HomeGrant` form: a 2-season headless league hashed and compared) — this seam may not move
  it. ⭐ CANON "pin suites from birth" (home: ruling #297 item 7).

### ⚠ THE PRE-EXISTING PINS THIS SLICE NARROWS (the DF-T0 §P7 form — stated POSITIVELY, never deleted)

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

3. **`tests/bfFacingCost.test.ts` § THE SEAM MAP** (⭐ NEW, the FIX's own) required every file
   naming any BF needle to be one of five. The trade prices a turn with **BF's own law rather
   than a second copy of it**, so `actionExecutor.ts` now IMPORTS `facingFactor` / `facingCosine`
   and READS a body's `facingDepth`. **NARROWED, NOT DELETED**: the needle set is SPLIT the way
   `rcAnticipate`'s was — **THE LAW ITSELF** (`bfFacingCost` · `setFacingDepth` · `BF_DEPTH` ·
   `BF_OFF_HEADING_FRACTION`) must still appear in EXACTLY the original five files and is
   asserted at **zero** in `actionExecutor.ts`; the two pure FUNCTION names and the body's own
   `facingDepth` may additionally be READ there, with that file's counts pinned per needle
   (three occurrences each: the import, the ONE call or read, and the prose beside it), the ONE
   import line anchored, and the file proven to contain **no copy of either formula**. BF-T0's
   substantive claim — that the law has ONE home and ONE writer — is unweakened.

⚠ Narrows 1 and 2 were **RATIFIED at ruling #379 item 4(iii)** and are re-checked green here:
the `faceTarget` recount did NOT move again — still **61** occurrences in **8** files with
`actionExecutor.ts` at **15** ASSIGNMENTS, because the fix replaced prose with prose and kept
the single write. Narrow 3 is NEW and is **flagged for commander ratification**.

## §4 HONEST LIMITS

1. ⭐ **THE FORK IS CLOSED — AND WHAT REPLACED IT HAS ITS OWN LIMIT: WITH `bfFacingCost` SHUT
   THE TURN IS FREE.** The seam's limit 1 (the candidate could never win the movement argmax:
   ceiling `max(belief) · s_receive` at w = 1 BELOW `DEFAULT_POLICY.formationBase`, the menu's
   unconditional floor) was a CATEGORY ERROR in the DECISION'S FORM, ruled at #379 items 2–3
   and landed by §FIX: facing no longer competes with running, it is weighed against the speed
   it forfeits. On the DEFAULT vector — world 12 exactly as composed, ⛔ no policy override —
   armed at w = 1 with the BF price armed, bodies really do turn, and turning MORE often when
   the price is shut (G-BITE, RECEIPTS — the counts are in §FIX and are not effect sizes).
   **What remains a limit is the other end of the same form**: with `bfFacingCost` SHUT every
   `facingDepth` is 0, so COST is exactly 0 and a believing receiver turns at ANY angle for
   nothing. That is the form's own consequence, not a defect — and it is exactly why M-BF.4 and
   #378 item 6(vi) require BF armed in BOTH arms of RC-T1b, and why the RC entry rung is cut
   WITH the price. ⚠ A second consequence of the same shape: the COST is proportional to
   `S_move`, so a policy vector that scores its off-ball movement LOW buys cheap turns — the
   trade is priced in the MENU's own currency, and that currency is a learned quantity.
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
11. ⚠ **THE `speedF` CONJUNCT OF THE COST GUARD IS A GUARD, NOT A LIVE CASE.** The trade
    charges nothing when `speedF` is 0, when the intended direction is degenerate or when the
    bearing is degenerate. No shipped executor case sets `speedF` to 0 (the lowest is the C7 /
    O2 plant's walking pace), so the standing body reaches COST 0 through the DEGENERATE
    DIRECTION instead — a holding plan whose target is his own position — which is how
    G-TRADE-DECISION (d) reaches it. The `speedF` limb is pinned on its own source line and is
    stated here as unreachable-today rather than claimed alive.
12. ⚠ **`p.action.scores[0]` IS THE MENU WINNER, AND IT ALWAYS EXISTS ON THIS PATH.** The two
    overlay fields are written by `decideOffBall` alone, whose menu carries the unconditional
    `MoveToFormationSpot` push, so the record the executor reads always has at least one scored
    candidate and `scores[0]` is the plan's own priority by construction. ⚠ It is the DISPLAYED
    top-4 slice, which is the same object the renderer shows — a reader who changes what the
    record displays would change what the turn costs.
13. ⚠ **NOTHING SHIPPED.** `rcReady` is false in every production path, the memory is not even
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
3. **§FIX HAS LANDED** (below). §1 and §4 limit 1 now describe the RULED form; the words of
   record for the decision are #379 item 3, quoted VERBATIM at the head of §1. The seam's own
   "the argmax IS the decision" sentence is SUPERSEDED and no longer appears outside §0's
   verbatim quotation of #378 item 6.


## §FIX (ruling #379 item 5) — THE TRADE IS THE DECISION, LANDED

**WHAT CHANGED, in three files.** (i) `PlayerBrain.ts` — the candidate is GONE from the movement
menu: `cands` is the shipped `UtilityScore[]` again, and the `OffballCandidate` widening,
`RcReadyCandidate`, `RC_READY_ACTION`, the splice and the cast are removed. `RC_S_RECEIVE` STAYS
as the one home for the anchor. The SAME `if (match.rcReady)` fork computes the SAME cell and
belief from the SAME read set — ⛔ not one character of the pinned argument list moved — and,
iff `w · belief > 0`, records TWO overlay fields on the action record after it is built:
`readyFaceGid` = the carrier's gid and `readyBenefit` = `w · rcReadyBelief(cell) · RC_S_RECEIVE`.
(ii) `actionExecutor.ts` — at the seam's existing face-write site (after every case and both
clamps, immediately above the PC latency gate) the executor now resolves the TRADE, with
`facingFactor` and `facingCosine` **IMPORTED** from `src/sim/bodyFacing.ts`. (iii) `types.ts` —
`readyBenefit?: number` beside `readyFaceGid`. ⛔ The memory, the seat module, the table, the
read set, the hold order and the ONE face write's position are untouched.

**THE FORM AT THE TWO SITES, verbatim.**

```ts
// src/ai/PlayerBrain.ts — the brain records the INPUTS (after the record is built)
  if (rcReadyCarrierGid >= 0) {
    p.action.readyFaceGid = rcReadyCarrierGid;
    p.action.readyBenefit = rcReadyBenefit;
  }

// src/ai/actionExecutor.ts — the executor takes the DECISION, every frame
  const readyFaceGid = p.action.readyFaceGid;
  const readyBenefit = p.action.readyBenefit;
  if (readyFaceGid !== undefined && readyBenefit !== undefined) {
    const carrier = ball.owner;
    if (carrier !== null && carrier.gid === readyFaceGid) {
      const dirX = target === null ? 0 : target.x - p.pos.x;
      const dirY = target === null ? 0 : target.y - p.pos.y;
      const dirLen = Math.sqrt(dirX * dirX + dirY * dirY);
      const bearX = carrier.pos.x - p.pos.x;
      const bearY = carrier.pos.y - p.pos.y;
      const bearLen = Math.sqrt(bearX * bearX + bearY * bearY);
      // A body who is not moving, or whose intent or bearing names no direction, forfeits
      // nothing by turning: the degenerate guard is the family's own 1e-6 (`physicsStep`'s
      // face-target guard, `facingCosine`'s own identity).
      let cost = 0;
      if (speedF > 0 && dirLen > 1e-6 && bearLen > 1e-6) {
        const cosPhi = facingCosine(dirX / dirLen, dirY / dirLen, bearX / bearLen, bearY / bearLen);
        cost = (1 - facingFactor(cosPhi, p.facingDepth)) * p.action.scores[0].score;
      }
      if (readyBenefit > cost) {
        p.faceTarget = { x: carrier.pos.x, y: carrier.pos.y };
      }
    }
  }
```

⛔ The only numeric literals in the whole fix are `0`, `1` and the family's own degenerate
guard `1e-6` (`physicsStep`'s own face-target guard and `facingCosine`'s own identity
threshold). No constant was invented.

**THE BOUND, AS DERIVED.** At φ = 90° on the shipped depth, with `S_move` = the off-ball menu's
own unconditional floor:

```text
bound = (1 − facingFactor(facingCosine(1, 0, 0, 1), BF_DEPTH)) × DEFAULT_POLICY.formationBase
      = 0.13500000000000004        (IEEE-754 double; the ruling's "COST ≤ 0.135")
ceiling(w = 1) = max(RC_READY_BELIEF_E) × 1.2 = 0.2872211495618595   (= (32231 / 134660) × 1.2;
                 the SAME number §COMMANDER CORRECTIONS 1 quotes as 0.287221, at full precision)
cells whose benefit clears the bound at w = 1: 7                     (PINNED, derived in-suite)
```

The bound is never typed in the pin suite: G-TRADE-DECISION (b) CALLS `facingFactor` for it, and
the 7-cell count is derived from the table and that same bound (canon, VERBATIM: *"a gate's NOTE
derives from the same pinned values the gate checks; a count typed beside its pin is a second
copy"*; home: PT-C0-PLAYTEST-FORENSIC-CENSUS.md §COMMANDER CORRECTIONS item 1). Recompute recipe
for every number above: `RC_READY_BELIEF_E` off `src/ai/receiverReadySeat.ts` (itself re-derived
bit-exactly from the artifact by G-TABLE) with `facingFactor` / `BF_DEPTH` off
`src/sim/bodyFacing.ts` and `DEFAULT_POLICY.formationBase` off `src/sim/types.ts`.

**THE DEFAULT-VECTOR WALK — RECEIPTS, NEVER EFFECT SIZES** (canon, homes: ruling #289 item 1 +
BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5). World 12 exactly as composed, ⛔ no
policy override, `rcReady` armed at w = 1 on both teams, one full match per cell; a FACING tick
is a tick on which a body carrying the overlay is not under a PC hold and the face the executor
applied IS the carrier's pre-step position:

| scratch seed | arms | overlay ticks | FACING ticks | of those, heading rotated toward the carrier |
|---|---|---:|---:|---:|
| 900,002,600 | `rcReady` + `bfFacingCost` | 18,879 | 2,450 | 1,804 |
| 900,002,600 | `rcReady` only (the free turn) | 20,725 | 16,387 | 7,485 |
| 900,002,601 | `rcReady` + `bfFacingCost` | 15,991 | 1,814 | 1,311 |
| 900,002,601 | `rcReady` only (the free turn) | 16,151 | 10,250 | 6,948 |

⚠ **WHAT THE PINS ASSERT AND WHAT THIS TABLE IS.** The pins assert the QUALITIES — facing ticks
EXIST, more than half of them rotate toward the carrier, and the BF-shut walk faces STRICTLY
more often than the BF-armed one. The counts above are a one-off scratch measurement taken with
the suite's own walk shape and are NOT pinned values; they say the door opens and the price
bites on the decision, and they say NOTHING about whether the world plays better — that is
RC-T1b's question. (Recompute: `walkReady` in `tests/rcReady.test.ts` over `matchOf(seed,
{ world: 12, ready: true, bf?, weight: 1 })`.)

**RUNS OF RECORD.**

* `npm run typecheck` — clean.
* `npx vitest run tests/rcReady.test.ts` — **36 / 36 green** (27 at the seam; +9 for the fix:
  G-TRADE-DECISION's 7, the second G-BITE and the structural G-MOVEMENT-KEPT, with G-REACH
  replaced and G-SCORE's live half added).
* `npx vitest run` on the seven named suites (`rcReady` · `rcAnticipate` · `bfFacingCost` ·
  `pcLatencySeam` · `raAccessPrice` · `raPlaytestEntry` · `a4HomeGrant`) — green.
* `npm run fingerprint` = **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`**
  — the literal of record, UNCHANGED. The suite RUNS it too.
* THE FULL SUITE — **162 files, 2054 / 2054 tests passed, exit 0**, no timeouts (the two
  dispositioned slow suites, `careers` and `formationEvolution` (#365 item 1), completed inside
  their budgets this run).
* `npm run build` was NOT run: no bundle path changes.
* ZERO sims of record; scratch **900,002,600–699** only; world 12's bytes untouched; nothing
  shipped (`rcReady` false in every production path, both overlay fields absent everywhere).

**PINS NARROWED BY THE FIX** — one, listed at §3: `tests/bfFacingCost.test.ts` § THE SEAM MAP
(the two pure BF function names and `facingDepth` may now be READ by `actionExecutor.ts`; the
LAW's own four needles are asserted at zero there and still live in exactly five files). The two
narrows the seam made were re-checked and did not move.

⚠ **HONEST LIMITS THE FIX ADDS** (§4 is the ONE home — canon, VERBATIM: *"a stage doc's HONEST
LIMITS list is the ONE home; the artifact stores that list verbatim or stores none"*; home:
RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS item 3): §4 limit 1 is REPLACED (the free
turn, and the cost's proportionality to a learned `S_move`), and limits 11 and 12 record the `speedF`
conjunct that no shipped case can reach and the `scores[0]` the cost is charged against.
