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

## §2 The mechanism (M-GK.1–3, as built by GK-T0)

**M-GK.1 THE CONTACT POINT.** One new field, `Player.saveContact: { x, y } | null`, null at
birth. In `tryKeeperSave`, at the ONE site where the save roll has just succeeded and ABOVE
the catch/parry split, under the flag only:

```ts
    if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y };
```

The ball's OWN position at the save tick — the engine's record of where the hands went.
Cleared wherever `saveAnimTimer` returns to 0: guarded on `!== null` at the integrator's
decrement (`if (this.saveContact !== null && this.saveAnimTimer === 0) this.saveContact =
null;`) and at the two `saveAnimTimer = 0` resets (`becomeSub`, `resetForKickoff`). Flag off
⇒ the field is never written and no clear ever executes an assignment.

**M-GK.2 THE BODY FOLLOWS THE HANDS.** ONE guarded override in `src/ai/actionExecutor.ts`,
placed AFTER the switch so it wins over each keeper case's own target — including
`GoalkeeperPosition`'s early-`break` branch:

```ts
  if (
    match.gkDiveBody && p.saveAnimTimer > 0 && p.saveContact !== null
    && (p.action.type === 'GoalkeeperSave' || p.action.type === 'GoalkeeperPosition'
      || p.action.type === 'GoalkeeperRush')
  ) {
    target = p.action.type === 'GoalkeeperRush'
      ? { x: p.saveContact.x, y: p.saveContact.y }
      : clampToBox(p.saveContact, team.attackDir);
    speedF = 1;
    p.faceTarget = ball.pos;
  }
```

The body is then integrated by `physicsStep` — the only position integrator — at his own
`topSpeed`, and is never written. **NO NEW CONSTANT** (#384 item 5): the window is the
existing `saveAnimTimer = 0.7`, the speed is the body's own. The CLAMPS ARE EACH CASE'S OWN:
the two box cases already clamp their target with `clampToBox`, so the contact point gets the
same clamp; `GoalkeeperRush` is deliberately un-clamped, so the contact point is taken raw.

THE ARRIVAL ARITHMETIC, from the anchored constants: a contact anywhere inside the fingertip
envelope is at most `save.meanReachTimesStretchMetres` = 3.231291 m away at the census's mean
reach, and the window is 0.7 s, so a body that could hold its top speed from the first tick
arrives whenever that top speed exceeds 3.231291 / 0.7 = 4.616130621354217 m/s (the ruling's
"4.62 m/s"). ⚠ That quotient IGNORES ACCELERATION — a body starting from rest spends part of
the window reaching its top speed — so it is an upper bound on capability, not a promise. The
pins measure the real closing on fixtures at the census's own mean reach, at its reach ×
stretch and at the largest `dNow` the census stored, and PUBLISH the shortfall for a
hand-built keeper below the quotient.

**M-GK.3 THE BALL WAITS AT THE HANDS.** ONE guarded branch in the carry law
(`src/sim/Match.ts`), BEFORE the normal placement: while the owner is a keeper with a contact
point and a running window, the ball is placed AT the contact point — no noise term, because
it is held, not carried — until the body's own carry point (`owner.pos + heading · carry`,
the SAME `carry` this tick's normal placement uses) comes within `carry` of it. Then
`saveContact` is CONSUMED and the shipped carry law places the ball from that tick on.
⛔ WITHDRAWN AT RULING #399 (GK-T0 §COMMANDER CORRECTIONS item 2): "parries never enter" was
FALSE — the keeper REGATHERS his own parry inside the window on about half the observed waiting
episodes, and the branch (which tests ownership and role, not "caught") then pins the ball to the
PRE-PARRY contact point, up to 5.481300 m from him (the verifier's measurement). GK-T0b gates the
waiting law on a `caught` mark set only in the catch branch.

**NOTHING ELSE MOVES.** Not `saveP`, not `keeperReach`, not `SAVE_STRETCH`, not `giveBall`'s
timing, not the parry's ball velocity or cooldown, not the renderer.

## §3 Instruments & the arc

* **GK-C0** — BANKED (#398 item 1). The census above; its faces are this contract's §0.
* **GK-T0** — THIS SEAM (`GK-T0-DIVE-LAW.md`). Dormant; flag `gkDiveBody` default OFF; pins
  `tests/gkDiveBody.test.ts`; ZERO sims of record.
* **GK-T1 — THE EXAM** (ruling #398 item 5(v); dispatched separately). Arms **ABSENT ·
  ARMED**, on **world 13** (E13 and D13) and on **world 14** beside.
  * **THE SEAM'S OWN FACES**: (a) the ball-jump share AT CATCHES — GK-C0's own predicate —
    expected → 0; (b) the body↔contact distance at the END of the window (arrival), as a
    distribution with stored bins; (c) the keeper's RESIDUAL-written ticks by class — the
    CORRECTED predicate `|pos_after − (pos_before + vel_after · DT)|` of #398 item 1(i) —
    including the **H-GK-2** save-window pocket that ruling #398 item 2 reports as "the save
    window **68 (≤ 8.598959 m — the pocket, H-GK-2, §CORR 9)**" — a LABELLED HYPOTHESIS
    (restart placements taken while `saveAnimTimer` still ran, missed by a phase-only
    classifier), which #398 item 3(ii) gives GK-T1's ABSENT arm to settle.
  * **THE GUARDS**, in OBM-T1's tolerance form (a move in EITHER direction is reported):
    goals per match, saves per match and the catch share, xG-per-shot conversion, shots,
    completion, and the keeper's own DISTRIBUTION passes (#398 item 4's first-look addition —
    the own-lane door already prices them on world 14).
  * **THE READS**: the frozen literals name **GK-ENTRY** (world 15 = world 14 + the dive door)
    or **STOP**.

## §4 Non-claims (what this contract does NOT assert)

* ⛔ **NO DIVE SPEED BEYOND `topSpeed`.** A real keeper's dive is faster than his running
  speed. This law gives him no extra metre per second: the body travels at the body's own
  capability, and a slow keeper simply does not arrive. Nor does a FAST one starting from
  rest — acceleration is real and eats part of the window; the fixtures pin that he closes
  and that he does not reach zero. Adding a dive impulse would be a NEW
  CONSTANT and a later door.
* ⛔ **THE 0.7 s WINDOW IS THE ANIMATION'S, NOT A MEASURED DIVE TIME.** It was set for the
  renderer (27.4). This law reuses it because it is the engine's own quantity, not because a
  dive takes 0.7 s.
* ⛔ **THE HIGH-BALL CLAIM'S WINDOW IS 0.6 s AGAINST THE RENDERER'S 0.7 DIVISOR** — an
  anchored asymmetry that this law does not touch (the claim path sets no contact point).
* ⛔ **THE PARRY'S BODY ARRIVAL IS COSMETIC-PHYSICAL.** The parried ball is already away; the
  body arriving where the hands were changes only where the keeper stands next. It is not
  claimed to change the parry's outcome, and its arithmetic is pinned identical.
* ⛔ **NO OUTCOME CHANGE AT THE SAVE TICK**, and downstream positions DO differ after the
  first armed dive — the identity is pinned on the ledger's outcome AT each save, not on the
  whole match.
* ⛔ **THE WAITING BALL'S CONTEST BEHAVIOUR IS PUBLISHED AS FOUND, NOT DESIGNED.** While the
  ball waits it is OWNED and — as built at GK-T0 — up to 5.481300 m from its owner (the verifier's
  maximum over 312 waiting ticks; mean 1.719000 m): the contact is fixed while the OWNER walks away,
  so the stated "fingertip envelope" bound (3.231291 m) was FALSE (§COMMANDER CORRECTIONS item 3). The
  engine's
  own protections for an owned keeper ball (`gkHoldTimer` / `gkDistributing` untackleable
  bubble, the clearance push) key off the KEEPER's position, not the ball's, so they do not
  follow the ball to the hands. What that means for a contest at the hands is GK-T1's to
  measure; this contract asserts nothing about it.
* ⛔ **M-GK.2 COVERS THREE EXECUTOR CASES, NOT EVERY TICK OF THE WINDOW.** The window can run
  while the keeper holds a SHARED case (`HoldPosition` after a catch, since a keeper who owns
  the ball is routed into `decideCarrier` — #398 item 1(ii)'s own correction; `ChaseBall`
  after a parry). Those cases are outfield cases too and are deliberately NOT overridden. The
  limit is pinned, and GK-T1 measures what it costs the arrival.

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
  dive that took a third of a second — not a hand that grew. M-GK.2 is exactly that sentence
  made physical, and M-GK.1 is the record it needs. PASS.
* Real football: **a caught ball does not jump.** It is held where it was caught, and it moves
  when the keeper moves. M-GK.3 is MEANT to be that sentence — ⛔ AS BUILT AT GK-T0 IT IS NOT
  (ruling #399): the wait ends when the 0.7 s WINDOW expires, not when the body arrives, so on the
  ruling's own 2.5 m fixture the ball jumped 2.050600 m on the expiry tick (the shut world: 2.545900 m
  on the first tick) — the jump was DEFERRED, not removed. GK-T0b ends the wait on ARRIVAL. The
  audit verdict for this clause is FAIL at GK-T0 and is re-taken at GK-T0b.
* Honest limits, stated: a real dive is FASTER than a run and this law gives no dive impulse
  (§4); a real keeper who dives ends up ON THE GROUND for a moment and this law models no
  recovery time; the parry's body arrival is cosmetic-physical; and the engine's own
  protections for a held ball follow the keeper, not the ball, so a ball waiting at the hands
  is protected as if it were at his feet. Each is named, none is assumed away. PASS.
