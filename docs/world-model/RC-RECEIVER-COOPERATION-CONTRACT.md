# RC — THE RECEIVER-COOPERATION CONTRACT（接球人合作：球出脚前，接球人从出球人的身体读到球要来）

> **Lineage.** The COOPERATION SEAT was named a HELD DOOR WITH ITS OWN NUMBER at ruling #360
> item 4 (DX-C2 §R3: on balls the access account calls MEETABLE the receiver is still
> **+3.233 m** [3.084, 3.394] from the elected point when the ball arrives — "the receiver does
> not chase what he could reach, because nothing tells him to until the ball is struck"), with
> the order "its own census → contract comes AFTER the price slice lands". The price slice
> landed as `?a4world=12` (#365). The three-view audit
> [`PASSING-SYSTEM-AUDIT-2026-09-02.md`](PASSING-SYSTEM-AUDIT-2026-09-02.md) §2.1 re-found the
> same hole from the receiver's chair and ranked it first (§6 item 1); the user ratified that
> order verbatim at **ruling #366**. This contract governs the RC arc.
>
> **Position in the doc hierarchy.** [`../VISION.md`](../VISION.md) is the gold standard;
> [`../EVO-BLUEPRINT.md`](../EVO-BLUEPRINT.md), [`../SUBSTRATE-MAP.md`](../SUBSTRATE-MAP.md),
> [`../PROBE-CONTRACTS.md`](../PROBE-CONTRACTS.md) govern method; this file binds the RC stages
> (RC-C0 census → RC-T0 dormant seam → RC-T1 exam → RC entry). Canon sentences are COPIED from
> [`CANON.md`](CANON.md), never re-typed (#301). Line numbers drift; symbol names are stable.

## §-1 THE DOCTRINE

A real pass is a RENDEZVOUS with two halves. The passer's half — 「他赶得到吗」 — is built:
the receiver-access price (RA, #358→#365) charges the intended receiver's unreachable seconds
before the ball is chosen. **The receiver's half does not exist.** In this engine the ball is
the receiver's first news of the pass: `pendingPass` is written at the STRIKE (`registerPass`,
`mechanics.ts`), and the receiver learns he is the target at his next AI tick by reading that
truth object (`PlayerBrain.ts`: `pass.targetGid === p.gid ⇒ ReceivePass`). During the wind-up
(`pendingPassWindup`, `Match.ts`, worlds ≥ 3) the passer holds the ball and turns toward the
aim for W ticks — and NO off-ball brain reads anything. DX-C2 §R3 sized what this costs on
balls he could have met: 3.23 m.

**The cure is NOT information.** The receiver must not be told. What real receivers read is
the passer's BODY — hips opening, the plant, the eyes, the leg going back — and in this world
that evidence already exists and is already visible: the committed passer's `heading`
integrates toward the aim at `TURN_RATE` (the Phase-27 body turn; the BK facing law prices
the rest of the turn) while the ball stays at his feet. VISION §1's authority model, copied
verbatim (home: `docs/VISION.md` §1, 2026-07-22 用户补全 III):

> 权限模型因此锁死为:**我知道自己的私人意图 + 自己的外部身体状态;我只能观察别人
> 的外部状态,再在自己内部形成对其意图的推断。** 队友不能直接读取另一人的真实目标/
> commitment;移动、朝向、触球、手势和局部沟通才是外显证据。**默契不是心灵感应**

⇒ **THE SEAT = an observer-local BELIEF that the ball is coming to me, formed from the
passer's EXTERNAL state alone, spent on the SAME chase machine the receiver already owns
(`interceptBall`'s time account), during the window he today wastes (the wind-up + his own
reaction hold).** The emergence criterion is unchanged: the substrate ALLOWS the receiver to
come; a gene says how much he trusts a body cue; selection sizes it. No designation, no
threshold, no ban, zero taste constants.

## §0 WHAT EXISTS (code facts of record; from the audit, symbol-stable)

* **The wind-up is outward evidence.** The shortPass wind-up seam (`pendingPassWindup`,
  armed by `o1PassWindup` in worlds ≥ 3) holds the still-owned ball for
  `c7WindupTicks(...)` (3–11 ticks) + `bkFacingExtraTicks(...)` (0–18 ticks, world ≥ 9) and
  sets `passer.faceTarget = mate.pos(arm)`; the body's `heading` then turns toward it at
  `TURN_RATE`; the pass resolves via the EXISTING `performPass` math at `readyTick`.
* **What is inner, what is outer.** `Player.heading`, `pos`, `vel`, `ball.owner` = EXTERNAL
  body states (readable by anyone). `faceTarget` = the INNER aim target;
  `pendingPassWindup.{gid, targetGid, aim, readyTick}` = the passer's PRIVATE commitment;
  `pendingPass` (post-strike) = the truth object today's receiver reads. ⛔ None of the inner
  three may be read by the seat.
* **The receiver's own machine.** `ReceivePass` (candidate score literal 1.2, strike-gated) →
  the executor's `interceptBall(p, ball)` (`perception.ts`): time-to-point
  `dist / max(topSpeed, 0.1) + 0.15` — the SAME traced account the RA price (RA-T0 §1) and the
  marking law (`MARK_SAG`) run. The seat adds no second account.
* **The dead time.** After the strike the receiver still waits for his AI tick
  (`AI_INTERVAL` 0.15 s) and, in worlds ≥ 8, the PC reaction hold (`pcLatency.ts`, tiers
  0.20 / 0.45 sim-s). RC-C0 MEASURES this delay; nothing here assumes it.
* **His menu at that tick** (`PlayerBrain.ts`, in-possession off-ball branch):
  `ReceivePass` · `ChaseBall` · `SupportBallCarrier` · `MakeRun` (licensed by TeamBrain) ·
  `MoveToFormationSpot`. The seat's candidate enters THIS argmax and nothing else.

## §2 MECHANISMS — THE SEAT FAMILY (the law is FROZEN at RC-T0's §P, informed by RC-C0)

* **M-RC.1 THE CHANNEL IS OUTWARD-ONLY.** The seat's percept reads, of the passer: `pos`,
  `heading`, `vel`, and whether `ball.owner` is he — external states — plus the observer's
  own state. ⛔ It never names `pendingPassWindup`, `faceTarget`, `pendingPass`, the passer's
  `action`/`scores`, any TeamBrain designation (`runners` · `arriver` · `overlapper` ·
  `wallRun`), or another body's `info.genome`. The pin suite proves channel closure (the
  module is PURE and CHANNEL-CLOSED — the RA-T0 form; a seam-map gate pins the read set; a
  fixture with a different private target but the same external state yields the same cue).
* **M-RC.2 THE BELIEF IS MEASURED, NEVER WEIGHTED.** P(the ball is coming to me | the cue)
  is a census TABLE from RC-C0 (the `passPrior.ts` valueAxis idiom), dosed through the
  shipped writer — canon copied: "dose NEVER in info.genome; truth-dosing writes census
  values through the shipped writer" (home: ruling #270.2). The cue's definition is frozen
  at RC-C0 §P (the angle between the passer's heading and the passer→me bearing, plus
  whichever external terms the census SHOWS carry information — the turn direction, the
  hold). A cue term the census cannot show is not in the seat. No hand constant enters.
* **M-RC.3 THE ACTION USES THE RECEIVER'S OWN MACHINE.** Armed, ONE new off-ball
  candidate (name frozen at T0; working name `AnticipatePass`) scores
  `rcAnticipationWeight · belief · s_receive`, where `s_receive` is `ReceivePass`'s OWN
  score literal (a traced anchor: certainty at gene 1 recovers exactly the shipped
  priority; belief and gene DISCOUNT it — nothing outranks what the strike would have
  granted). Its executor solves the rendezvous with the SAME `interceptBall` time account
  against the BELIEVED ball — the passer's feet, his heading, the world's shipped
  pass-speed law for that distance (common knowledge of the world's PHYSICS, not of his
  mind). The believed-ball construction is frozen at RC-T0 §P; RC-C0 (c) informs which
  construction matches what the meetable receiver actually needed. At the strike the real
  `ReceivePass` takes over, byte-unchanged.
* **M-RC.4 THE GENE.** `rcAnticipationWeight` ∈ [0, 1], BORN ABSENT — the DV/RA birth
  discipline verbatim in form (outside `GENE_KEYS`; zero rng flag-off; serialization omits;
  mutation/crossover draws STRICTLY AFTER every existing block behind an explicit opt-in).
  Selection sizes how much a receiver trusts a body cue. 默契 (familiar teammates inferring
  faster and steadier from the SAME cue) is a HELD door, not this slice.
* **M-RC.5 ROAD B.** Flag `rcAnticipate` default OFF, never env/bundle-armed, named by no
  world until the entry rung; production fingerprint unchanged; pin suite from birth
  (G-OFF byte-identity both world shapes · G-BORN · G-ZERO · G-INERT (armed with no wind-up
  live in the world ≡ shut byte for byte) · G-BITE · prohibitions · mutants · channel
  closure · G-RNG). ⛔ **World 12's composition and bytes are untouched by EVERY stage of
  this arc** — the user's play-test compares like with like. The RC entry = world 13 =
  world 12 + this door, dispatched ONLY after the user's world-12 verdict.
* **M-RC.6 NO BAN, NO DESIGNATION, PASSER UNTOUCHED.** Nothing leaves the receiver's menu;
  TeamBrain names nobody for this; the passer's aim, price and wind-up are byte-identical.
  ⚠ Coupling stated, not hidden: a receiver who comes moves `mate.pos` at strike time, so
  the strike-time lead and speed adapt through the EXISTING `performPass` math — not a new
  term; RC-T1 measures it.

## §3 THE ARC & THE SEQUENCE

* **RC-C0 — THE COOPERATION CENSUS** (dispatched at #366 item 3; X-SRC-ZERO; the DX-C2
  form): **(a) THE CUE** — does the passer's outward body identify the target BEFORE the
  release, and how early (the sharpening curve, the lock tick, the ambiguity, the turn
  direction)? **(b) THE WINDOW** — the wind-up length, the target's MEASURED post-strike
  start delay, the dead time, the kinematic bound (`topSpeed × dead time`) against the
  meetable-only arrival gap RE-MEASURED on this composition. **(c) THE ARRIVAL ANATOMY** —
  what the meetable receiver was doing at arm and at release, his velocity toward the aim,
  where he stood when the ball reached the elected point, where the ball was collected.
  ⭐ **ONE PRE-COMMITMENT**: a cue that does NOT identify the target at the last pre-release
  tick resolvedly better than the uniform prior BLOCKS the seat — the reading half has no
  honest percept — and the arc returns to the user with the OFFER channel named as the
  alternative. **PRE-COMMITTED READ** (no gate): bound ≥ gap ⇒ wind-up reading alone is the
  seat's shape; bound < gap ⇒ the seat is wind-up reading PLUS a named earlier-cue door
  (the look · the offer channel) — never a truth read.
* **RC-T0 — THE DORMANT SEAM** (its own §P: the cue table, the candidate, the believed-ball
  construction, the gene, the pins; the RA-T0 form).
* **RC-T1 — THE EXAM** (its own freeze): arms = world 12's composition in BOTH arms, SHUT vs
  ARMED on `rcAnticipate` + `rcAnticipationWeight` at ONE pinned value. **H-RC.1**: (a) the
  meetable-only arrival gap (DX-C2 §P.D's face) FALLS resolvedly; (b) completion does NOT
  fall and interceptions conceded do NOT rise (the H-RA.1B form). REPORTED: goals with a
  declared MDE · shots · forward-pass share · the three combination counters · chain length
  (the E4 watchability dimensions) · the season ladder (the gene evolvable). Pre-committed
  reads named at dispatch.
* **RC ENTRY** — `?a4world=13` = world 12 + the door, per the entry-rung form, ONLY after the
  user's world-12 verdict; the play-test = USER GATE (watchability has no instrument).
* Then steps ②–⑤ of the ratified order (#366 item 1), each under its own contract.

## §4 NON-CLAIMS & HELD DOORS

* **The OFFER channel (要球)** — the receiver's own outward act toward the passer, and the
  passer's reading of it — is the cooperation seat's OTHER half (the S19 row 「要球没有
  通道」): held, named, its own slice (it needs a new outward act; this slice adds none).
* **默契** (familiarity sharpening the same cue) — held.
* **Fakes** — a body cue that misleads (the dummy) EMERGES from a probabilistic belief; no
  dummy mechanism is built and none may be.
* **The passer's side** (price · lead · grid) untouched; **no third-man movement**; **no
  defender reading of the same cue** — the defence's eyes belong to the DF doctrine; the
  mirror is NAMED for DF, not built here.
* **How much of the 3.23 m anticipation buys** is RC-T1's question; the seat can buy only
  what the window affords — RC-C0 (b) states that ceiling BEFORE the build.

## §6 VISION AUDIT (the #91 form)

| VISION clause | this contract | verdict |
|---|---|---|
| §1 内心/外显/推断三分 (verbatim above) | the seat reads EXTERNAL states only; the inference is observer-local; the private commitment is never read (M-RC.1, pin-proven) | ✅ — the FIRST attacking-side consumer of the outward-evidence model |
| §1 底座 allows, never assigns | one candidate + one gene in the receiver's own argmax; TeamBrain names nobody (M-RC.3/6) | ✅ — the receiver's first pre-strike decision that is HIS (today: designated or hand-fanned, audit §2.2) |
| §1 no taste constants | the belief is a census table; the score anchor is `ReceivePass`'s own literal; the chase is the existing account (M-RC.2/3) | ✅ |
| §1 默契不是心灵感应 | 默契 held as a LATER gene/learning door on the SAME cue — never a faster read of truth (M-RC.4, §4) | ✅ (honestly deferred) |
| §3 每一项属性真有影响 | `topSpeed` enters the receiver's own chase; the gene is selectable | ✅ |
| §2 watchability | the exam carries the E4 dimensions; the entry is a USER GATE | ✅ |
| 逐 tick commander 禁令 | none added; the seat is a per-head decision | ✅ |

## §7 REALITY AUDIT (the #201 rule)

* **The mechanism is reality's.** A receiver runs onto a pass because he reads the passer's
  body during the wind-up — hips, plant, eyes, backswing — not because he is told. The
  reaction to a visible cue is ~0.2 s (the PC simple tier's own constant family); the
  pre-strike start is what makes a LED pass work at all.
* **The dummy is real** and falls out of a probabilistic belief for free; reality has no
  "fake" subsystem either.
* **What reality has that this slice does not** — the ask (offer), the scan before the pass
  (O2 look: built, unwired), the third man — are all NAMED held doors, none hidden.
* **Sequencing (the audit's §6 order, ratified #366):** the receiver's half is built first
  because the number is already measured, the evidence channel already exists in the world,
  and a DORMANT door invalidates no banked A/B; the grid exam (④) displaces aims among
  meetable candidates and is better run once both halves of the rendezvous are priced.
  **PASS.**
