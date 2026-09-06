# GK — 门将的身体 (THE KEEPER-BODY CONTRACT: the hands arrive with the body)

> Opened by the USER (verbatim: 「并且门将现在仍然有的时候最后一刻突然瞬移到球的那个地方」);
> measured by **GK-C0** (`GK-C0-KEEPER-JUMP-CENSUS.md` + `data/gk-c0-keeper-jump-census.json`,
> banked as measurement at ruling #398 item 1); bound by **ruling #398 items 3 and 5**.
> THE THEME IN ONE SENTENCE: **the engine saves with the hands and leaves the body behind** —
> a shot inside the keeper's REACH is resolved where the BALL is, the body is not moved, the
> renderer stretches his sprite toward the ball, and a catch then snaps the ball two metres
> into his feet in one tick.
>
> **Created by GK-T0** (`GK-T0-DIVE-LAW.md`), the first stage bound by this contract.
> ⭐⭐ **§2 RE-WRITTEN AT GK-T0b** to **M-GK.1–3′** (ruling #399 item 3), after the verifier
> found GK-T0's law did not deliver its sentence; §3 carries GK-T1's exam form as AMENDED by
> ruling #399 item 5; §4 and §7's "a caught ball does not jump" clause are re-taken there too.

## §0 The diagnosis chain (user observation × verified mechanism, #398 items 2–3)

The user's sentence and GK-C0's fields, side by side. Every number below is the artifact's
own, quoted BY FIELD NAME from `docs/world-model/data/gk-c0-keeper-jump-census.json`, arm
**E13** (world 13 EMPTY-BOOK — the user's kept world, the read of record).

* **THE HANDS ARE FAR FROM THE BODY.** `save.meanDistanceMetres` = **1.968465** m — the
  ball↔keeper distance at the save tick — against `save.meanReconstructedReachMetres` =
  **2.393549** m and its fingertip envelope `save.meanReachTimesStretchMetres` =
  **3.231291** m (the reach × the anchored `SAVE_STRETCH`). `save.withinReachShare` =
  **0.979115**, `save.withinStretchShare` = **0.020885**, and nothing is beyond it. Of the
  CATCHES, `catch.gt2mShare` = **0.675774** are taken more than two metres from the body
  (`catch.gt1mShare` = **0.896175**; `catch.gt3mShare` = **0**, the `dNow <= reach` guard).
* **THE BODY DOES NOT GO.** `keeper.meanDisplacementMetres` = **0.017000** m per tick against
  `keeper.meanCapMetres` = **0.103981** m — the keeper walks a sixth of what his legs allow.
  `body.gkWrittenShare` counts **9231** over-cap keeper ticks in **30552654**, of which
  `keeperClass.compositionOfWritten.restartPlacement` = **0.940418** — **8681** — are RESTART
  PLACEMENTS. Outside restarts the count is **550**
  (`reads.perArm.E13.keeperWrittenOutsideRestartsCount`), and #398 item 1(i) relabels every
  written face an **OVER-CAP UPPER BOUND** (`resolveOverlaps` adds velocity after
  integration, so pure integration clears the cap the next tick). ⇒ **in play the code
  barely moves him at all**; what the eye reads as a teleport is not a `pos` write.
* **THE BALL JUMPS INSTEAD.** `ballJump.catchShare` = **0.985375** of catches have a
  next-tick ball displacement exceeding the CATCHING KEEPER's own `topSpeed · DT`, a mean
  `ballJump.catchMeanMetres` = **1.711552** m in ONE tick — the carry law snapping the owned
  ball to `owner.pos + carry`. Parries do not (a struck release, not a snap:
  `ballJump.parryMeanMetres` = **0.182645** m).
* **AND MOST SAVES ARE PARRIES.** `saveKind.parry` = **0.775886** of save events, against
  `saveKind.catch` = **0.096350**, `saveKind.highBallClaim` = **0.112145** and `saveKind.smother` =
  **0.015620**, at `save.eventsPerMatch` = **5.703704**.
* **THE RENDERER PAINTS THE DIVE THE ENGINE DOES NOT PLAY.** An anchored render fact, never
  measured by the census: the sprite stretches `1 + 0.7k` along the axis toward the ball with
  `k = saveAnimTimer / 0.7`, frozen at dive start — and the high-ball claim sets its window to
  0.6 s while the renderer still divides by 0.7.

⇒ **THE MECHANISM OF 「瞬移」 IS THE HANDS WITHOUT THE BODY.** The save is legal where the
ball is; the body stands still; the sprite reaches; the caught ball then arrives at his feet
in one frame. There is no teleport to remove — there is a DIVE to add.

## §1 The claims

* **H-GK.1 (scored, mechanism grain, the ball side).** With the dive law armed, the ball-jump
  face at CATCHES collapses: the caught ball's per-tick displacement while it waits at the
  hands is the BODY's, never the carry law's snap. GK-C0's own predicate
  (`ballJump.catchShare`) is the instrument, re-run on the armed arm.
* **H-GK.2 (scored, mechanism grain, the body side).** With the law armed, the keeper's BODY
  is nearer the contact point at the END of the save window than it is with the law shut —
  the distance-at-window-end distribution moves toward zero, and it moves by INTEGRATION
  (the residual predicate of #398 item 1(i) shows no new written ticks).
* **H-GK.3 (structural, not scored).** No save roll, no save outcome and no shot ledger entry
  moves at the tick of the save. The dive is a consequence of the save, never an input to it.
* ⚠ **NOT CLAIMED**: that goals, saves per match, the catch share or conversion move in any
  direction. The roll is untouched; any movement is DOWNSTREAM of a keeper standing somewhere
  else afterwards, and the exam carries it as a GUARD, never as a headline.

## §2 The mechanism (M-GK.1–3′, as RE-FORMED by GK-T0b — ruling #399 item 3 — and CLOSED by GK-T0c — ruling #400 item 3)

> ⭐⭐ GK-T0 built this seam and ruling #399 struck the LAW it was supposed to deliver. §2 is
> re-written here to the RE-FORM. What GK-T0 built is not deleted from the record: the two
> struck constructions are named in place, and the T0 doc's §COMMANDER CORRECTIONS 1–12 and
> its §GK-T0b DELTA carry the line-by-line difference.

**M-GK.1 THE CONTACT POINT, AND THE `caught` MARK.** One field,
`Player.saveContact: { x: number; y: number; caught: boolean } | null`, null at birth. In
`tryKeeperSave`, TWO writes — one per branch of the save, each after its own branch's roll has
already succeeded:

```ts
    if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {
      match.pushEvent('save', defSide, `${gk.name} catches it`);
      match.giveBall(gk);
      if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: true };
    } else {
      if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: false };
```

⭐⭐ **THE CATCH WRITE IS ITS BRANCH'S LAST STATEMENT (GK-T0c).** Release (c) below retires a
caught contact at every ownership GAIN, so a write above `match.giveBall(gk)` would be wiped by
the very save that produced it. `giveBall` never writes `ball.pos` — it zeroes `ball.vel` and
sets `z`, `vz` and `spin` — so THE RECORDED VALUE IS UNCHANGED, and the pin asserts that on the
ball itself. The PARRY write is still the FIRST statement of its branch: a parry takes no
`giveBall`, and everything below it moves the ball.

Both record the same quantity — the BALL'S OWN position at the save tick, on the KEEPER. The
MARK is the difference: a CATCH leaves him owning the ball, so the ball has something to wait
for; a PARRY is STEER-ONLY. ⛔ GK-T0 wrote ONE line above the split with no mark, and a keeper
who REGATHERED his own parry inside the window then pinned the ball to the PRE-PARRY contact
up to 5.481300 m away (§COMMANDER CORRECTIONS item 4; ruling #399 item 1(iii)).

THE CLEARS, all guarded on `!== null` so the OFF path executes no assignment:

* the integrator's decrement clears a **PARRY** contact only —
  `if (this.saveContact !== null && !this.saveContact.caught && this.saveAnimTimer === 0) this.saveContact = null;`
* `becomeSub` and `resetForKickoff` keep their two guarded clears;
* a **CAUGHT** contact is released by M-GK.3′'s THREE releases (arrival · ownership loss ·
  regain-cleared) and by nothing else.

⭐⭐ **THE SPRITE'S WINDOW AND THE LAW'S WINDOW ARE DIFFERENT THINGS** (ruling #399 item 2's
lesson of record). `saveAnimTimer = 0.7` was set for the renderer (27.4). A law's window and
its release must be the PHYSICAL event the law names.

**M-GK.2′ THE BODY FOLLOWS THE HANDS, EVERY TICK.** ONE guarded override in
`src/ai/actionExecutor.ts`, in the same place GK-T0 put it — AFTER the switch, so it wins over
each keeper case's own target including `GoalkeeperPosition`'s early-`break` branch, and
BEFORE the free-kick wall block (which cannot take a keeper) and the onside and barred-box
clamps (both of which exclude `role === 'GK'`):

```ts
  if (match.gkDiveBody && p.saveContact !== null) {
    target = p.action.type === 'GoalkeeperRush'
      ? { x: p.saveContact.x, y: p.saveContact.y }
      : clampToBox(p.saveContact, team.attackDir);
    speedF = 1;
    p.faceTarget = ball.pos;
  }
```

⭐⭐ **THE GATE IS THE FIELD, NOT AN ACTION-TYPE LIST.** GK-T0 enumerated three keeper cases
and the law never fired where it mattered: after a catch the keeper OWNS the ball,
`decidePlayer` routes him into `decideCarrier` (#398 item 1(ii)), and he holds
`MoveToFormationSpot` / `HoldPosition` — 0 of 42 window ticks covered on the ruling's own
fixture (§COMMANDER CORRECTIONS item 1). The keeper is the ONLY body that ever carries a
contact — both writes are inside `tryKeeperSave`, both on `gk` — so `saveContact !== null` IS
the keeper scope, and that is PINNED on every body of every tick of armed matches — 0 outfield
contact ticks over EIGHT armed world-13 matches in the pin (which also asserts that CAUGHT
contacts really occurred in them, or the walk would be vacuous), and 0 again over the TWELVE
armed matches of §4's in-play receipt.

The clamp is the keeper case's own: `clampToBox` unless the action is `GoalkeeperRush`, which
the shipped code leaves un-clamped. The body is integrated by `physicsStep` — the only
position integrator — at his own `topSpeed`, and is never written. **NO NEW CONSTANT.**

**M-GK.3′ THE CAUGHT BALL WAITS UNTIL ARRIVAL.** ONE waiting branch in the carry law
(`src/sim/Match.ts`), BEFORE the normal placement:

```ts
      const gkHands = this.gkDiveBody && ball.owner.role === 'GK'
        && ball.owner.saveContact !== null && ball.owner.saveContact.caught
        ? ball.owner.saveContact : null;
      let heldAtHands = false;
      if (gkHands !== null) {
        const cx = ball.owner.pos.x + ball.owner.heading.x * carry - gkHands.x;
        const cy = ball.owner.pos.y + ball.owner.heading.y * carry - gkHands.y;
        if (cx * cx + cy * cy > carry * carry) heldAtHands = true;
        else ball.owner.saveContact = null; // consumed: the hands have arrived
      }
      if (heldAtHands && gkHands !== null) {
        ball.pos.x = gkHands.x;
        ball.pos.y = gkHands.y;
      } else if (this.c6Carry && carry === 0.85) {
```

`carry` is the value the SHIPPED placement uses on this very tick — 0.3 while the keeper holds
or distributes, 0.85 otherwise — so there is no new distance constant, and the keyed noise
term is not applied while the ball waits: it is held, not dribbled.

**THE THREE RELEASES.**

* **(a) ARRIVAL.** The body's carry point comes within `carry` of the contact ⇒ the contact is
  CONSUMED and the shipped placement runs THE SAME TICK. THE BOUND ON THE RELEASE TICK, from
  the code: the ball sat exactly ON the contact at the end of the previous tick, the arrival
  test that fired says the carry point is within `carry` of that contact, and the placement
  puts the ball ON that carry point ⇒ **the release displacement is at most `carry`** (0.3 m
  while he holds, 0.85 m otherwise). Measured on the arrival fixture: **0.277703 m against a
  `carry` of 0.3** (fixture receipt).
* **(b) LOSS OF OWNERSHIP.** ONE sweep in `src/sim/Match.ts`, immediately above the
  restart/ball fork — after the tick's brains, executors and physics, and immediately before
  the ball is placed:

```ts
    if (this.gkDiveBody) {
      for (const t of this.teams) {
        for (const q of t.players) {
          if (q.saveContact !== null && q.saveContact.caught && this.ball.owner !== q) {
            q.saveContact = null;
          }
        }
      }
    }
```

  ⭐ WHY A SWEEP AND NOT A CLEAR PER SITE: `ball.owner` is assigned at TWELVE statements across
  `Match.ts` (7), `mechanics.ts` (4) and `Ball.ts` (1) — this engine has NO single ownership funnel
  (`giveBall` is one entry, `kickBall` another, the dead-ball resets a third), so a per-site
  clear would be twelve new statements in three files, one of them outside the seam's five. The sweep is
  ONE site and it is exact for what the law needs: the tick a keeper stops owning the ball is
  already a tick on which the ball is where the ENGINE put it — struck, loose or dead — and
  never at the hands.

* **(c) REGAIN-CLEARED (GK-T0c, ruling #400 item 3).** ONE guarded statement in `giveBall`,
  AFTER the offside early-return and IMMEDIATELY after the ownership assignment:

```ts
    const ball = this.ball;
    ball.owner = p;
    if (p.saveContact !== null && p.saveContact.caught) p.saveContact = null;
```

  A FRESH GAIN RETIRES A STALE CAUGHT CONTACT. Release (b)'s sweep runs ONCE per tick and so
  only sees a loss that PERSISTS to the next sweep; a keeper who loses the ball and REGAINS it
  inside that window presents the SAME owner to it. Without this statement the pre-loss contact
  survives and the waiting law snaps the ball back to it — MEASURED with the statement deleted:
  the ball pinned **2.496093 m** from its own keeper for every one of the next 20 ticks; with it
  in place the ball rides the shipped carry law at **0.850000 m** from him. ⭐ It is
  `caught`-only for the same reason the sweep is: a parry contact is steer-only and never had an
  owner. ⛔ SHUT, the field is null on every body, so the first conjunct short-circuits and NO
  assignment executes. ⚠ THE RESIDUAL (T0 doc §4): eleven of the twelve `ball.owner` statements
  assign `null` — they are LOSSES — `giveBall` is the ONE gain reachable in play, and the
  kickoff's `ball.owner = st` is a dead-ball reset preceded by `resetForKickoff`'s own clear.

**A REGATHERED PARRY** takes the SHIPPED carry law from the regather tick: his contact is
`caught: false`, so the waiting branch does not fire, and the contact is cleared by the
decrement when the sprite's window ends. Pinned by its own fixture.

**THE FAIL-SAFE, no new constant.** A keeper whose carry point never reaches the contact holds
the ball AT THE HANDS for as long as he owns it. The shipped hold/distribution bubble protects
it exactly as it protects a ball at his feet (`stepBall` returns while
`gkHoldTimer > 0 || gkDistributing`, and `tryTackles` returns while `gkHoldTimer > 0`).
`gkDistributing` ends when he DISTRIBUTES — a kick, which is a loss of ownership, which is
release (b) — so **the wait cannot outlive his ownership**. ⚠ The exception is named in §4: a
catch OUTSIDE the area (`giveBall`'s `gkFeet` gate) gives no hold and no bubble.

**NOTHING ELSE MOVES.** Not `saveP`, not `keeperReach`, not `SAVE_STRETCH`, not `giveBall`'s
timing or its bookkeeping, not the parry's ball velocity or cooldown, not the renderer. ⚠
GK-T0c's two touches are the ONE guarded statement inside `giveBall` (release (c)) and the
REORDER of the catch write within its own branch — no other `src` line changes.

## §3 Instruments & the arc

* **GK-C0** — BANKED (#398 item 1). The census above; its faces are this contract's §0.
* **GK-T0** — the seam as first built (`GK-T0-DIVE-LAW.md`). BANKED-DORMANT, **NOT of record
  as a law** (ruling #399 item 1): the dormancy, the outcome-at-save identity and the contact
  point HOLD; the LAW failed.
* **GK-T0b — THE RE-FORM** (ruling #399 items 3–4), §2 above. Dormant; flag `gkDiveBody`
  default OFF; pins `tests/gkDiveBody.test.ts`; ZERO sims of record.
* **GK-T1 — THE EXAM** (ruling #398 item 5(v) as **AMENDED by ruling #399 item 5**; dispatched
  separately). Arms **ABSENT · ARMED**, on **world 13** (E13 and D13) and on **world 14**
  beside.
  * **THE SEAM'S OWN FACES**:
    (a) ⭐⭐ **THE BALL-JUMP FACE OVER THE WHOLE EPISODE** — every tick the keeper owns a caught
    ball, from the catch to the release AND the tick after, not the catch tick alone (#399
    item 5; the verifier's (1)). GK-C0's own predicate, applied per tick.
    (b) ⭐⭐ **THE ARRIVAL-TIME DISTRIBUTION** — the ticks from the catch to the release, with
    stored bins, and the body↔contact distance at the release beside it.
    (c) ⭐⭐ **THE SHARE OF WAITS ENDED BY OWNERSHIP LOSS** rather than by arrival.
    (d) ⭐⭐ **THE `gkFeet` CONTEST EXPOSURE** — tackle candidacy at the hands
    (`dist(o.pos, ball.pos) < 1.15`) and `looseTouch` (`dist(ball.pos, owner.pos) > 0.85`)
    while a ball waits outside the hold bubble.
    (e) the keeper's RESIDUAL-written ticks by class — the CORRECTED predicate
    `|pos_after − (pos_before + vel_after · DT)|` of #398 item 1(i) — including the **H-GK-2**
    save-window pocket that ruling #398 item 2 reports as "the save window **68 (≤ 8.598959 m
    — the pocket, H-GK-2, §CORR 9)**", a LABELLED HYPOTHESIS which #398 item 3(ii) gives
    GK-T1's ABSENT arm to settle.
  * **THE GUARDS**, in OBM-T1's tolerance form (a move in EITHER direction is reported):
    goals per match, saves per match and the catch share, xG-per-shot conversion, shots,
    completion, the keeper's own DISTRIBUTION passes (#398 item 4's first-look addition), and
    — ADDED at #399 item 5 — **the keeper's HOLDS PER MATCH and his TIME-TO-DISTRIBUTION** (a
    longer wait delays the restart of play: a real cost, measured).
  * **THE READS**: the frozen literals name **GK-ENTRY** (world 15 = world 14 + the dive door)
    or **STOP**.

## §4 Non-claims (what this contract does NOT assert)

* ⛔ **NO DIVE SPEED BEYOND `topSpeed`, AND NO DIVE IMPULSE.** A real keeper's dive is faster
  than his running speed. This law gives him no extra metre per second: the body travels at
  the body's own capability, and acceleration is real — from rest a keeper at topSpeed
  5.962486 m/s ends 0.591749 m short of the census's mean reach inside the sprite's 0.7 s and
  0.955967 m short at reach × 1.35 (the fixtures, pinned as `end > 0`; §COMMANDER CORRECTIONS
  item 11). A dive IMPULSE would be a NEW CONSTANT and is a LATER DOOR.
* ⛔ **THE ARRIVAL TIME IS A MEASURED FACE, NOT A GUARANTEE.** Nothing in this law promises
  the body gets there. FIXTURE RECEIPTS (the 2.5 m catch, walked with the full step from the
  catch tick): with the contact AHEAD of him the arrival release fires on **tick 41** (the ball
  moved 0.000000 m on each of the 40 waiting ticks and 0.277703 m on the release tick, against
  a `carry` of 0.3); with the contact ABEAM — the ruling's own fixture — the release is by
  OWNERSHIP LOSS on **tick 390**, the ball 0.000000 m on all 389 waiting ticks, his BODY
  within `carry` of the contact from **tick 54**. IN-PLAY RECEIPTS (12 armed scratch matches,
  world 13, 55 save events — 45 parries, 3 catches, 7 claims/smothers): 3 caught-ball waits, **3 of 3 ended by ARRIVAL**, waits of
  93 / 65 / 34 ticks (mean 64.000000, max 93), max ball↔owner distance while waiting
  3.532372 m, 0 regathered parries, 0 outfield bodies with a contact. ⭐ AND THE LARGER WALK,
  LABELLED BY ITS OWN n (ruling #400 item 2(i), the release COMPOSITION the 12 could not carry):
  **n = 40 armed scratch matches — 21 waits, 17 by ARRIVAL / 4 by OWNERSHIP LOSS**, mean wait
  **102.523810** ticks, mean arrival **57.294118**, max ball↔owner **2.960237 m** (the
  independent verifier's own 40: **24 waits, 22 / 2**, mean **69.25**, max **3.192847 m**).
  ⇒ ARRIVAL IS THE USUAL RELEASE, ownership loss a real minority, and **release (c) has 0
  observations in either walk**. ⚠ **0 REGATHERED PARRIES IS A VACUOUS n IN TWELVE MATCHES**, so it is not left as the
  evidence: a SUPPLEMENTARY scratch walk of FORTY armed world-13 matches (seeds
  900,005,012–051, out-of-band, zero frontier) found **7 regathered parries and 0 ticks with
  the ball pinned to a parry contact**. ⭐ FOUR ticks LOOKED pinned to a first cut and were
  chased down: on each, the parry and the re-claim happened on the SAME tick, so the owned-ball
  placement (which sits at the HEAD of `stepBall`) had not run yet and the ball was still at
  its free-flight position — which is the contact, because the contact IS the ball's position
  at the save tick. On the very next tick the SHIPPED carry law placed it at
  `owner.pos + heading · carry` with residual 0.000000 m in all four. The law never held it. ⚠ The wait is LONGER
  than the sprite's 0.7 s (42 ticks) in the majority of these episodes: that is the law and
  the animation being different clocks, not a defect.
* ⛔ **THE `gkFeet` EXPOSURE IS PUBLISHED AS FOUND** (§COMMANDER CORRECTIONS item 8; ruling
  #399 item 3(iii)). A keeper who collects the ball OUTSIDE his own area gets no hold and no
  bubble (`giveBall`'s `gkFeet` gate), and the two contest predicates read the BALL'S position:
  `tryTackles`' candidate scan is `dist(o.pos, ball.pos) < 1.15` and its `looseTouch` is
  `dist(ball.pos, owner.pos) > 0.85`. A waiting ball is at the hands, not at the feet, so both
  read a place the keeper is not. FIXTURE RECEIPT, reported either way: with an opponent stood
  exactly AT THE HANDS of a `gkFeet` catch, the candidate predicate is TRUE, `looseTouch` is
  TRUE, and the keeper LOSES THE BALL ON THE FIRST TICK. How often that happens in play is
  GK-T1's face; this contract asserts nothing about its size.
* ⛔ **THE 0.7 s WINDOW IS THE ANIMATION'S, NOT A MEASURED DIVE TIME**, and this law no longer
  uses it as a release. It survives as the sprite's clock and as the life of a PARRY contact.
* ⛔ **THE HIGH-BALL CLAIM'S WINDOW IS 0.6 s AGAINST THE RENDERER'S 0.7 DIVISOR** — an
  anchored asymmetry that this law does not touch (the claim path sets no contact point, so a
  claimed high ball still snaps to the keeper's feet).
* ⛔ **THE PARRY'S BODY ARRIVAL IS COSMETIC-PHYSICAL.** The parried ball is already away; the
  body arriving where the hands were changes only where the keeper stands next. Its arithmetic
  is pinned identical to the shut world's.
* ⛔ **NO OUTCOME CHANGE AT THE SAVE TICK**, and downstream positions DO differ after the
  first armed dive — the identity is pinned on the ledger's outcome AT each save, not on the
  whole match.
* ⛔ **RELEASE (c)'s RESIDUAL IS NAMED, NOT CLOSED BEYOND ITS OWN STATEMENT** (T0 doc §4;
  ruling #400 item 3). `ball.owner` is assigned at TWELVE statements; ELEVEN of them assign
  `null` (LOSSES — release (b)'s case), `giveBall` is the ONE gain reachable in play and now
  carries release (c), and the twelfth — the KICKOFF's `this.ball.owner = st` — is a dead-ball
  reset preceded by `resetForKickoff`, whose own guarded line clears `saveContact` on every
  non-sent-off body. ⚠ AND THE HONEST HALF: at this head **the engine produces no intra-step
  lose-and-regain at all** — `stepBall`'s owned branch returns after its tackle calls, and the
  capture path lives below that return — so the pin's LOSS is the engine's own tackle and its
  REGAIN is hand-built. The close is a code invariant; its in-play population is **0 in 60
  armed matches**. This contract asserts nothing more about its size — GK-T1 counts it.
* ⛔ **THE CLAMP CAN BITE.** A contact outside `clampToBox`'s box — a catch taken well off his
  line — is clamped, so the body is steered to the box edge and the carry point may never
  reach the contact. The fail-safe then runs (§2) and the wait ends with his ownership.

## §6 VISION audit (the #91 form)

* vs §-1 (tactics emerge): the law adds PHYSICS to an existing event — where a body is after
  it saved — and no behaviour rule. Nobody is told when to dive, whom to save, or where to
  stand; the save roll, the reach and the keeper's whole decision surface are untouched.
  Whether a keeper who now ends up out of his goal is punished for it is left entirely to the
  world and the genes. PASS.
* vs 底座给能力 (the base gives capability): 扑救是身体飞出去 — a keeper reaches a ball by
  taking his body to it. This makes the reach a JOURNEY the body actually performs at its own
  `topSpeed`, so `pace` and `stamina` finally price a dive. The capability is given; nothing
  spends it for him. PASS.
* vs #200 (no taste constants): NO NEW CONSTANT AT ALL. The window is the shipped
  `saveAnimTimer = 0.7`, the speed is the shipped `topSpeed`, the wait's distance is the
  shipped `carry`, the clamps are the executor's own. PASS.
* vs #328 (no bans): nothing is forbidden. No save is refused, no roll is gated, no target is
  removed from any menu. PASS.
* vs the assembly law: the banked seams price passing, movement, contact and perception; none
  of them carries a keeper-body law. The user opened this door with a directive sentence and
  GK-C0 measured it before a line was written. PASS.

## §7 REALITY audit (the #201 rule)

* Real football: **a keeper's hands arrive with his body.** A ball caught two metres away is a
  dive that took a third of a second — not a hand that grew. M-GK.2′ is exactly that sentence
  made physical, and M-GK.1 is the record it needs. PASS.
* Real football: **a caught ball does not jump.** It is held where it was caught, and it moves
  when the keeper moves. ⭐⭐ RE-TAKEN AT GK-T0b ON THE RE-FORMED FIXTURE, and the verdict the
  fixture gives is **PASS**: over the WHOLE episode of a 2.5 m catch — every tick from the
  catch to the first tick after the release, measured with the full step and with no scoping by
  the contact field — the ball moves 0.000000 m on every waiting tick, and on the ARRIVAL tick
  it moves 0.277703 m into the keeper's own carry point (bound: at most `carry` = 0.3 m, by
  construction). The shut world's first tick on the same construction is the jump this removes.
  On the ABEAM fixture the release is his own distribution — the ball is then STRUCK, which is
  a kick and not a jump. ⛔ AT GK-T0 THIS CLAUSE WAS **FAIL** (the jump was DEFERRED to the
  window's expiry: 2.050600 m on tick 42, ruling #399 item 1(i)); that verdict stands on the
  record for GK-T0 and is superseded here.
* Honest limits, stated: a real dive is FASTER than a run and this law gives no dive impulse
  (§4); a real keeper who dives ends up ON THE GROUND for a moment and this law models no
  recovery time; the parry's body arrival is cosmetic-physical; and — ONE SENTENCE, replacing
  the two that read as a contradiction (§COMMANDER CORRECTIONS item 10) — **the engine's hold
  bubble is keyed to the KEEPER'S body, so it protects a waiting ball only where the keeper has
  a hold at all: inside his area it does, and for a `gkFeet` catch outside it there is no hold
  and no bubble and the contest predicates read the ball where it waits (§4's exposure, with
  its fixture receipt).** Each is named, none is assumed away. PASS.
