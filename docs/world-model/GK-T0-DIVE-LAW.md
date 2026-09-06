# GK-T0 — THE DIVE LAW（身体跟着手走：门将扑到哪，人就得跟到哪）

> **Authorized by COMMANDER RULING #398 item 5** (item 3 the decision and its reasons, item 2
> the census table, item 1 the corrections). **Binding contract:**
> [`GK-KEEPER-BODY-CONTRACT.md`](GK-KEEPER-BODY-CONTRACT.md) — created by this stage.
>
> **Lineage.** The user's sentence 「门将瞬移」 → **GK-C0** the keeper-jump census
> ([`GK-C0-KEEPER-JUMP-CENSUS.md`](GK-C0-KEEPER-JUMP-CENSUS.md), banked as measurement at
> #398 item 1: the keeper's body is almost never written in play; the SAVE resolves a mean
> 1.968465 m from it and the CAUGHT BALL jumps into his feet) → **this stage builds the dive
> behind a shut door and nothing else.**
>
> ⛔ **THIS STAGE SHIPS NOTHING** (Road B): `gkDiveBody` is default OFF, never env- or
> bundle-armed, named by NO world and NO preset (`src/game/a4World.ts` is NOT EDITED and
> contains no `gkDiveBody`); the production fingerprint is UNCHANGED — `npm run fingerprint`
> = the literal of record **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`**
> at the seam commit. ⛔ **Worlds 12, 13 and 14 are byte-identical with the flag off** — the
> user's play-test still compares like with like. **ZERO sims of record; every walk in the pin
> suite lives in the out-of-band scratch band 900,004,800–899.** `npm run build` was NOT run:
> no entry layer names the flag.

## §0 THE WORDS OF RECORD

### RULING #398 item 5 — THE DISPATCH (verbatim)

```text
5. ⭐⭐ **GK-T0 DISPATCHED — 「身体跟着手走」 THE DIVE LAW** (a T0 seam; SRC EDITS
   AUTHORIZED for the seam ONLY; Road B: the flag `gkDiveBody` default OFF,
   absent from `a4World` and every preset, the fingerprint UNCHANGED, worlds
   12–14 byte-identical; the BQ-T0 / LN-T0 form; a new contract
   `GK-KEEPER-BODY-CONTRACT.md` with §6 VISION / §7 REALITY audits). (i)
   **M-GK.1 THE CONTACT POINT**: when `tryKeeperSave` resolves a save (catch
   OR parry) under the flag, the engine records the contact point on the
   keeper — `gk.saveContact = { x: ball.pos.x, y: ball.pos.y }` at the save
   tick (the ball's own position, the engine's record; cleared when
   `saveAnimTimer` reaches 0) — the ONE new field, written at the ONE
   resolution site. (ii) **M-GK.2 THE BODY FOLLOWS THE HANDS**: while
   `saveAnimTimer > 0` and `saveContact` is set, the keeper's executor steers
   him to `saveContact` at `speedF = 1` (the existing `GoalkeeperSave` /
   `GoalkeeperPosition` cases gain ONE guarded branch: `if (match.gkDiveBody
   && p.saveAnimTimer > 0 && p.saveContact) { target = p.saveContact; speedF =
   1; }`) — integrated by `physicsStep` at his own `topSpeed`, never written;
   the existing 0.7 s window and the existing `topSpeed` are the only
   quantities (no new constant, #384 item 5's doctrine); the body arrives
   within the window for any contact inside reach × 1.35 at any keeper
   topSpeed above 4.62 m/s (stated, pinned by fixture, the shortfall
   published for slower keepers). (iii) **M-GK.3 THE BALL WAITS AT THE
   HANDS**: while the ball's owner is a keeper with `saveContact` set and
   `saveAnimTimer > 0`, the carry law places the owned ball at `saveContact`
   (the hands) instead of `owner.pos + carryLen` UNTIL the body's carry point
   is within `carryLen` of it (then normal carry resumes and `saveContact` is
   consumed) — the ball's per-tick displacement after a catch becomes the
   body's, never a jump; parries are unaffected (the ball is not owned).
   Nothing else: no save roll, no `saveP`, no reach, no `giveBall` timing
   changes; the shot outcome at the save tick is byte-identical between OFF
   and ON (pinned: the `shotLog` outcome sequence equal on the same seeds
   through the save tick — downstream positions may differ, so the pin is on
   the outcome AT the save, not the whole match). (iv) PINS
   (`tests/gkDiveBody.test.ts`, the `lnOwnLane.test.ts` form): FLAG OFF ≡ HEAD
   byte-identical (rng state) on ≥ 12 seeds in the bare world AND world 13
   AND world 14; FLAG ON with no save in a fixture ≡ OFF; FLAG ON ⇒ on a
   hand-built catch at 2.5 m the body's position converges to the contact
   point within the window and the ball's per-tick displacement never exceeds
   the body's cap (the ball-jump face 0); on a hand-built parry the body
   moves toward the contact point and the ball is unaffected; `saveContact`
   cleared with the timer; the outcome-at-save identity; every new statement
   behind the flag (an anchored count of `gkDiveBody` reads — the seat idiom,
   ONE read serving the sites is acceptable and pinned as such); the four
   mutants (the contact recorded on the ball instead of the keeper; the ball
   waiting forever; the body steered without the flag; the window ignored) —
   each killed; fingerprint; typecheck; `npm test`; narrows listed. (v) THE
   CONTRACT `GK-KEEPER-BODY-CONTRACT.md`: §0 the diagnosis chain (the user's
   sentence 「并且门将现在仍然有的时候最后一刻突然瞬移到球的那个地方」 × GK-C0's fields:
   the save distance 1.968465 m, catches > 2 m 0.675774, the ball-jump
   0.985375 / 1.711552 m, the body over-cap in play an upper bound of 550
   ticks, restarts 8,681); §1 claims; §2 M-GK.1–3 as built; §3 instruments &
   the arc — GK-T1 (arms ABSENT · ARMED on world 13 E13/D13 and world 14
   beside; the seam's own faces: the ball-jump share at catches → 0, the
   body↔contact distance at the END of the window (arrival), the keeper's
   RESIDUAL-written ticks (the corrected predicate) by class incl. the
   pocket; GUARDS in OBM-T1's form: goals per match (both directions), saves
   per match and catch share (both directions — the roll is untouched, so any
   move is downstream), xG-per-shot conversion, shots, completion, the
   keeper's distribution passes; the read literals naming GK-ENTRY (world 15
   = world 14 + the dive door) or stop); §4 non-claims (no dive SPEED beyond
   topSpeed — a real dive is faster; the 0.7 s window is the animation's, not
   a measured dive time; the high-ball claim's 0.6 s; the parry's body
   arrival is cosmetic-physical; no outcome change); §6 VISION; §7 REALITY.
   (vi) DOC `GK-T0-DIVE-LAW.md` (§0 words of record · §1 mechanism · §2 files
   · §3 pins as the living inventory · §4 HONEST LIMITS · §DEVIATIONS); ONE
   commit; never pushed; `a4World.ts` not edited.
```

### RULING #398 item 3 — THE DECISION (verbatim)

```text
3. ⭐⭐⭐ **THE FOOTBALL READING (VISION + REALITY).** The user's sentence is
   REAL and its mechanism is THE HANDS WITHOUT THE BODY: the engine resolves a
   save when the ball is within the keeper's REACH — up to 3.2 m from where
   his body stands — and leaves the body where it was; the renderer stretches
   his sprite toward the ball; a catch then snaps the ball two metres into
   his feet in one tick. In play his body is not teleported by code (a
   sub-metre handful and one labelled pocket aside); at restarts it is placed,
   as designed. VISION: 扑救是身体飞出去 — a keeper reaches a ball by getting his
   body to it; 底座给能力 — the base should make the dive physical, not paint
   it. REALITY: real keepers' hands arrive WITH their bodies; a ball caught
   two metres away is a dive that took a third of a second, not a hand that
   grew. ⇒ **GK-T0 THE DIVE LAW** (item 5): the body travels to the contact
   point over the save window the engine already has; the caught ball waits
   at the hands until the body arrives. No new constant; no change to any
   save roll or outcome at the tick of the save. (ii) THE POCKET (68 ticks ≤
   8.598959 m in the save window) is **H-GK-2** — restart placements after a
   parry-to-corner or a goal-kick taken while `saveAnimTimer` still runs and
   missed by a phase-only classifier — a labelled hypothesis; GK-T1's ABSENT
   arm carries the residual predicate and a placement-site classifier to
   settle it. (iii) The render census (story (c)) is NOT needed as a stage:
   the render facts are anchored and the body law makes the sprite's stretch
   a real displacement.
```

### in plain football language

门将扑救的时候，引擎判定的是**手**：球只要落在他的伸手范围里（最远到指尖那一档），这一下就算
扑到了——可是**人没有动**。画面上他的影子朝球拉长了，看起来像扑出去；实际上身体还站在原地。
如果是抱住了，下一帧球又「啪」地贴回他脚边——那两米是球自己走的，不是人走的。用户看到的
「最后一刻突然瞬移到球那个地方」，就是这三件事叠在一起。

这一版要补的不是删掉某个瞬移，而是**把飞出去的那一下真的演出来**：扑到的那一刻，把接触点
记在门将身上；接下来那 0.7 秒（引擎本来就有的扑救动画窗口），让他的**身体按自己的速度**朝
那个点跑过去；抱住的球就**停在手上等他**，等身体到了，球才回到正常的持球位置。

⛔ 不改任何一次扑救的判定：扑到扑不到、抱住还是脱手、什么时候得球，全都和原来一模一样。
⛔ 不加任何新常数：窗口是原来的 0.7 秒，速度是他自己的 `topSpeed`，球等的距离是原来的持球
距离。⛔ 门也默认关着——这一版谁都看不到。

## §1 THE MECHANISM (what armed means)

Armed means ONE boolean, `gkDiveBody`, and THREE guarded sites — one per file. Shut, every
one of them is a conjunction that dies on the flag, and `Player.saveContact` is null for the
whole match.

### M-GK.1 THE CONTACT POINT — `src/sim/mechanics.ts`, inside `tryKeeperSave`

The save roll has just succeeded; the stats and the shot ledger are already written; the
catch/parry split has NOT yet happened:

```ts
    match.markShotOutcome('saved');
    // ⭐⭐ GK T0 §M-GK.1 — THE CONTACT POINT …
    if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y };
    if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {
```

The BALL'S OWN POSITION at the save tick, recorded on the KEEPER. One statement, above the
split, so a catch and a parry record the same thing. It draws no rng, reads no new state and
changes no branch.

The field is `Player.saveContact: { x: number; y: number } | null = null`, and it is cleared
wherever `saveAnimTimer` returns to 0 — GUARDED, so the shut path executes no assignment:

```ts
    this.saveAnimTimer = Math.max(0, this.saveAnimTimer - dt);
    if (this.saveContact !== null && this.saveAnimTimer === 0) this.saveContact = null;
```

plus the same guarded line beside the two `this.saveAnimTimer = 0;` resets (`becomeSub` and
`resetForKickoff`).

### M-GK.2 THE BODY FOLLOWS THE HANDS — `src/ai/actionExecutor.ts`, after the switch

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

**WHY AFTER THE SWITCH AND NOT INSIDE THE CASES.** `GoalkeeperPosition` contains an early
`break` (the 追分清道夫 branch), so an override written at the end of that case would not
cover it. One site after the switch is AFTER every keeper case's own target computation, and
it is still ONE site to pin. It sits BEFORE the free-kick wall block, which cannot take a
keeper (`.filter((p) => p.role !== 'GK' && !p.sentOff)`, anchored in the pin suite), and
before the onside and barred-box clamps, both of which exclude `role === 'GK'`.

**WHICH CASES, AND WHY EXACTLY THESE.** The three cases named are the executor's KEEPER
cases. All three can hold while the window runs. The clamps are each case's own: the two box
cases already clamp their target with `clampToBox`, so the contact point receives the same
clamp (a clamp that bites is published by a pin, not hidden); `GoalkeeperRush` is deliberately
un-clamped in the shipped code, so the contact point is taken raw. ⚠ The window can ALSO run
while the keeper holds a case shared with outfielders — `HoldPosition` after a catch (a keeper
who owns the ball is routed by `decidePlayer` into `decideCarrier`, #398 item 1(ii)'s own
correction), `ChaseBall` after a parry — and those are NOT covered. That is §4's first limit
and it is pinned.

**THE ARRIVAL ARITHMETIC**, from anchored constants only: a contact inside the fingertip
envelope is at most `save.meanReachTimesStretchMetres` = 3.231291 m away at the census's mean
reach, the window is 0.7 s, so a body holding its top speed from the first tick arrives
whenever that top speed exceeds 3.231291 / 0.7 = 4.616130621354217 m/s — the ruling's
"4.62 m/s". ⚠ The quotient ignores ACCELERATION, so it is an upper bound on capability, not a
promise; the fixtures measure the real closing at the census's mean reach
(`save.meanReconstructedReachMetres` = 2.393549 m), at its reach × stretch and at the largest
`dNow` the census stored, and PUBLISH the shortfall for a keeper below the quotient.

### M-GK.3 THE BALL WAITS AT THE HANDS — `src/sim/Match.ts`, the carry law

```ts
      const gkHands = this.gkDiveBody && ball.owner.role === 'GK'
        && ball.owner.saveContact !== null && ball.owner.saveAnimTimer > 0
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
or distributes, 0.85 otherwise — so there is no new distance constant. The keyed noise term is
not applied while the ball waits: it is held, not dribbled. The two shipped placements below
are BYTE-UNCHANGED; only the `if` that opens them became an `else if`. ⛔ "Parries never enter"
was FALSE (§COMMANDER CORRECTIONS item 2): a regathered parry inside the window enters the branch
and pins the ball to the pre-parry contact.

### THE IDENTITY PROOF, IN WORDS

With the flag off:

* `tryKeeperSave` evaluates `match.gkDiveBody` and stops. No write, no rng, no branch change.
* `Player.saveContact` is therefore null for every body forever, so the integrator's clear
  (`saveContact !== null && …`) short-circuits on its FIRST conjunct — the shut path executes
  no assignment at all, not even `null = null`. The same holds at the two resets.
* The executor's override short-circuits on `match.gkDiveBody`; `target`, `speedF` and
  `faceTarget` are whatever the case wrote.
* The carry law's `gkHands` is null by the same first conjunct, `heldAtHands` stays false, and
  control reaches the very same `this.c6Carry && carry === 0.85` test the shipped code
  reached, with `ball.pos` untouched in between.

⇒ every double, every rng draw and every branch is HEAD's. The pins MEASURE this rather than
assume it: G-OFF compares whole-match signatures — ball pos/vel/z/vz, score, phase, every
body's pos/vel/heading/stamina, and one draw off the finished match's own rng — on twelve
seeds in the bare world, world 13 and world 14.

## §2 THE FILES

| file | what changed |
|---|---|
| `src/sim/Player.ts` | the field `saveContact` + its docblock; ONE guarded clear at the `saveAnimTimer` decrement in `physicsStep`; ONE guarded clear beside each of the two `saveAnimTimer = 0` resets (`becomeSub`, `resetForKickoff`) |
| `src/sim/mechanics.ts` | ONE guarded statement in `tryKeeperSave`, above the catch/parry split (M-GK.1) |
| `src/ai/actionExecutor.ts` | ONE guarded override after the switch, scoped to the three keeper cases (M-GK.2) |
| `src/sim/Match.ts` | `gkDiveBody?: boolean` config field + `readonly gkDiveBody: boolean` + `this.gkDiveBody = cfg.gkDiveBody ?? false;`; the carry law's ONE waiting branch (M-GK.3), which turns the shipped `if (this.c6Carry …)` into an `else if` and changes no placement line |
| `src/sim/League.ts` | the `matchFlags` key union only, on its own line (`League.toJSON` omits `matchFlags` — nothing serializes) |
| `tests/gkDiveBody.test.ts` | **NEW.** THE PERMANENT PIN SUITE — see §3 |
| `tests/bfFacingCost.test.ts` | ONE narrowing — §DEVIATIONS 1 |
| `docs/world-model/GK-KEEPER-BODY-CONTRACT.md` | **NEW.** the contract |
| `docs/world-model/GK-T0-DIVE-LAW.md` | this file |

⛔ **No other file under `src/**` or `tests/**` changed.** ⛔ **`src/game/a4World.ts` is NOT
edited** and contains neither `gkDiveBody` nor `saveContact`. No new constant, no probe
touched, no renderer change, no entry-layer mention.

## §3 THE PINS (`tests/gkDiveBody.test.ts` — ALL GREEN; **the suite is the living inventory**)

* **THE PROHIBITION SET** — `a4World.ts` names neither the flag nor the field; `a4MatchFlags`
  at every version through 14 carries no `gkDiveBody` key; a bare `Match`, a world-13 and a
  world-14 `Match` and a `League.createMatch` match all read `false`; every `src/**` file that
  mentions the flag is one of the five named homes; no `process.env`, no bundle default.
  **CATCHES:** a door that ships by accident.
* **NO SERIALIZATION** — a `League.toJSON` string contains neither the flag nor the field.
  **CATCHES:** a new `Player` field leaking into every save file.
* **⭐⭐ G-OFF** — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte, on twelve scratch seeds
  in the BARE world AND world 13 AND world 14, full-length matches, pooled digest, with one
  DISTINCT digest per (world × seed) cell so the comparison is not a degenerate constant.
  **CATCHES:** any statement of this seam that runs, or moves an rng draw, with the door shut.
* **⭐⭐ G-NULL** — across a full world-13 match that CONTAINS saves, every body's
  `saveContact` is read EVERY tick and is null every time. **CATCHES:** an unguarded clear, or
  a write that escaped its flag.
* **⭐⭐ G-NOSAVE** — flag ON, walked beside its shut twin only while NO save event has fired:
  the two worlds' ball and bodies stay bit-equal. **CATCHES:** a guarded statement that bites
  before a contact point exists.
* **⭐⭐ G-BITE** — flag ON ⇒ the whole-match signature DIFFERS on at least one seed in each of
  the three world shapes. **CATCHES:** a seam that is dormant because it is DEAD.
* **⭐⭐ G-SAVE-IDENTITY (the outcome-at-save identity)** — the two arms are walked in
  LOCKSTEP on twelve seeds in world 13; on every tick where the two worlds still stand in the
  same state, the tick's `save` events (time, side, text) and the WHOLE `shotLog` outcome
  sequence must be equal, and at least one save is compared on every seed. Divergence cannot
  precede the first contact point, so the save that CREATES the dive is always among the
  compared ones. **CATCHES:** a seam that moved a roll, a save's kind, or a ledger entry.
* **⭐⭐ M-GK.1 EXACTNESS** — on a hand-built catch at 2.5 m and a hand-built parry at 2 m, the
  contact point EQUALS the ball's own position at the save tick, differs from the keeper's own
  position and from any owner-relative carry point (the MUTANT), and is null on the same scene
  with the door shut. **CATCHES:** a contact recorded on the ball, on the body, or in an
  owner-relative frame.
* **⭐⭐ THE FAILED ROLL WRITES NOTHING** — the whole fixture band is walked with a high-xG
  shot; on every seed where the engine rolled NO save the field is null, on every seed where
  it saved the field is set, and the band really does contain failures (non-vacuous).
  **CATCHES:** a write hoisted above the roll.
* **⭐⭐ THE CLEAR RIDES THE WINDOW** — a contact he can never reach survives the first tick
  and is gone the tick the timer reaches 0; the guarded clear line and the two reset clears are
  anchored verbatim. **CATCHES:** a contact point that outlives its window, or a clear that
  fires early.
* **⭐⭐ THE ARRIVAL ARITHMETIC** — the quotient is asserted against the census's own stored
  faces; body fixtures at the census's mean reach, at its reach × stretch and at the largest
  stored `dNow` CLOSE the distance and, from rest, do NOT reach zero (§4's first limit); the
  total travel never exceeds the body's own `topSpeed × 0.7` (proof the body is INTEGRATED,
  never written). **CATCHES:** a body written to the contact point, a dive that borrows speed
  it does not have, or a doc that claims an arrival the fixture does not show.
* **⭐⭐ THE SHORTFALL IS PUBLISHED** — a hand-built keeper below the quotient is still short
  at the whistle, and a fast body on the same fixture ends strictly nearer. **CATCHES:** a
  hidden floor on the dive speed.
* **⭐⭐ MUTANT: THE BODY STEERED WITHOUT THE FLAG / WITH THE WINDOW IGNORED** — the same
  fixture with the door shut, and the same fixture armed with the timer already at 0, both end
  the window FARTHER from the contact point than the armed in-window arm.
  **CATCHES:** an override that forgot either guard.
* **⭐⭐ M-GK.3 A CATCH AT 2.5 m** — while the contact point lives the ball is AT it on every
  tick, its per-tick displacement never exceeds the keeper's own `topSpeed · DT` (the ball-jump
  face is 0 on this fixture), and when the wait ends the contact point is null and the shipped
  carry law places the ball again. **CATCHES:** a ball that jumps anyway, or a wait that never
  ends.
* **⭐⭐ M-GK.3 A PARRY** — the parried ball's velocity, the keeper's cooldown and the ball's
  ownerless state are the SHUT world's to the bit, while the body driven through a covered
  keeper case finishes the window nearer the contact point than the shut body does.
  **CATCHES:** a wait applied to an unowned ball, or a parry whose arithmetic moved.
* **⭐⭐ THE PUBLISHED LIMIT** — in the free-running parry scene the keeper holds an UNCOVERED
  case for part of the window and the two arms' bodies then stand in the SAME place. The limit
  in §4 is pinned so it cannot change in silence. **CATCHES:** a silent widening (or narrowing)
  of the covered case set.
* **⭐⭐ THE TIMER CLEARS AN UNARRIVED CONTACT** — a hand-built slow keeper never reaches the
  hands; the field is null when the window closes and the ball then rides at the shipped carry
  length. **CATCHES:** a ball stranded at a contact point nobody owns any more.
* **⭐⭐ THE ANCHORS** — the flag's occurrence count per file with every site enumerated and
  every prose mention proved to be a comment; exactly ONE `gk.saveContact =` in
  `mechanics.ts`, anchored BETWEEN the roll and the catch/parry split; exactly ONE executor
  override, naming exactly three action types, anchored after the switch and before the wall;
  exactly ONE waiting branch in `Match.ts`, anchored before the two shipped placement lines,
  which are themselves anchored verbatim; the save's untouched lines (the 0.7 s window,
  `SAVE_STRETCH`, the parry's velocity and cooldown, the ONE `keeperReach` call); and the
  field absent from `League.ts`, `rendezvousRecovery.ts` and both renderers.
  **CATCHES:** a second write site, a drifting order, or a quiet edit to the save arithmetic.
* **⭐ THE FINGERPRINT OF RECORD** — the literal is in the suite, and the suite RUNS the
  shipped recipe and compares. **CATCHES:** any production drift at all.

## §4 HONEST LIMITS

* ⚠⚠ **THE DIVE IS CAPPED AT `topSpeed`, AND A REAL DIVE IS FASTER.** The body travels at the
  same speed it runs at. A keeper whose top speed is below 3.231291 / 0.7 m/s cannot cross the
  fingertip envelope inside the window, and the arithmetic ignores acceleration besides — from
  rest, part of the window is spent getting up to speed. MEASURED AND PINNED ON THE FIXTURES:
  even a keeper whose top speed is ABOVE the quotient, starting from rest, ends the window
  still SHORT of the contact point at the census's own mean reach. The pins therefore assert
  that he CLOSES and that he does NOT arrive — the shortfall is a PUBLISHED FIXTURE RECEIPT,
  not a failure. Giving the dive an impulse would be a NEW CONSTANT and is a later
  door.
* ⚠⚠ **M-GK.2 COVERS THREE EXECUTOR CASES, NOT EVERY TICK OF THE WINDOW.** After a CATCH the
  keeper owns the ball, so `decidePlayer` routes him into `decideCarrier` (#398 item 1(ii))
  and he holds in `HoldPosition`; after a PARRY his own brain frequently gives him
  `ChaseBall`. Both are shared outfield cases and are NOT overridden — in those ticks nothing
  steers him toward the contact point, and the ball may end up waiting until the WINDOW
  expires rather than until the body arrives. The limit is pinned by its own fixture. What it
  costs the arrival — and whether the covered set should widen — is GK-T1's measurement and
  the commander's ruling, not this stage's.
* ⚠ **THE 0.7 s WINDOW IS THE ANIMATION'S.** It was chosen for the renderer (27.4), not
  measured as a dive time. This law reuses it because it is the engine's own quantity. The
  high-ball claim's 0.6 s window against the renderer's 0.7 divisor is an anchored asymmetry
  this law does not touch — the claim path sets no contact point at all, so a claimed high
  ball still snaps to the keeper's feet.
* ⚠ **THE WAITING BALL'S CONTEST BEHAVIOUR IS AS FOUND, NOT AS DESIGNED.** While it waits the
  ball is OWNED and stands where the hands were — as built, up to 5.481300 m from its owner (the
  verifier's maximum), because the owner walks away from a fixed contact; the "fingertip envelope"
  bound was FALSE (§COMMANDER CORRECTIONS item 3).
  The engine's protections for a held keeper ball (the untackleable `gkHoldTimer` /
  `gkDistributing` bubble and the clearance push) key off the KEEPER'S position, not the
  ball's, so they stay around the body and do not follow the ball to the hands. The ball's
  velocity while it waits is still the owner's, as the shipped carry law sets for any owned
  ball. This stage CLAIMS NOTHING about what a contest at the hands does; GK-T1 measures it.
* ⚠ **THE PARRY'S BODY ARRIVAL IS COSMETIC-PHYSICAL.** The ball is already away when the body
  starts travelling, so arriving changes only where the keeper stands for the next phase. The
  parry's own arithmetic is pinned identical to the shut world's.
* ⚠ **DOWNSTREAM POSITIONS DIFFER, BY CONSTRUCTION.** The identity this stage pins is the
  OUTCOME AT THE SAVE TICK, not the whole match: once a body has dived, the world moves on
  from a different place. Any face that moves in the exam is DOWNSTREAM of that, never a
  changed roll.
* ⚠ **WITH THE FLAG OFF THE SHIPPED WORLD STANDS BYTE FOR BYTE**, and this stage states **NO
  FOOTBALL CLAIM**. ARMED means "the capacity exists behind a shut door" — not that the world
  is better, not that any face moves.
* ⚠ **WHAT THE EXAM MUST SHOW** (#398 item 5(v)): the ball-jump share AT CATCHES → 0 on
  GK-C0's own predicate; the body↔contact distance at the END of the window as a binned
  distribution; and the keeper's RESIDUAL-written ticks by class on the CORRECTED predicate
  `|pos_after − (pos_before + vel_after · DT)|`, including the H-GK-2 pocket. GUARDS in
  OBM-T1's tolerance form, read in BOTH directions: goals per match, saves per match and the
  catch share, xG-per-shot conversion, shots, completion, and the keeper's distribution
  passes. The reads name GK-ENTRY (world 15 = world 14 + the dive door) or STOP.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. **`tests/bfFacingCost.test.ts` — ONE NARROWING, THE ONLY ONE.** Its `faceTarget` census
   pins the needle's occurrence count per file and the ASSIGNMENT count per file. M-GK.2's
   override faces the diving keeper at the ball (`p.faceTarget = ball.pos;`), which is one
   more occurrence and one more write in `src/ai/actionExecutor.ts`. The pin is NARROWED, not
   deleted, in the DF-T0 §P7 form ratified at #323 item 1 and already used there by RC-T0b:
   the counts are restated POSITIVELY (22 occurrences in that file, 62 in the same 8 files,
   16 writes) with the new site named and attributed. BF-T0's substantive claim is
   unweakened — it still changes none of those sites, and `Player.ts`'s own three are
   byte-identical. ⛔ NO OTHER TEST NEEDED NARROWING: the whole suite was run to prove it —
   the carry law's two placement lines are byte-unchanged (only the `if` that opens them
   became an `else if`), and no suite pins a global `MatchConfig` key list, a flag count or a
   `Player` field list.
2. **THE CENSUS FIELD NAMES IN THE CONTRACT ARE THE ARTIFACT'S, NOT THE BRIEF'S.** The
   dispatch named `save.distanceAtSaveMeanMetres`; the committed artifact stores that face as
   **`save.meanDistanceMetres`**, and the reach and its stretch as
   **`save.meanReconstructedReachMetres`** / **`save.meanReachTimesStretchMetres`**. Canon
   ("a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face")
   binds to the ARTIFACT, so the contract quotes the stored names. Every value is unchanged.
3. **M-GK.2 IS ONE SITE AFTER THE SWITCH, NOT ONE SITE PER CASE.** The dispatch's idiom is an
   override "placed AFTER the case's own target computation". MEASURED at this head:
   `GoalkeeperPosition` contains an early `break`, so an override at the end of that case
   would not cover the 追分清道夫 branch. ONE guarded site after the switch is after every
   case's own computation, enumerates the covered action types explicitly (so the scope is
   pinnable), and keeps the "one read per file" discipline exactly.
4. **THE COVERED CASE SET IS THE THREE KEEPER CASES, AND THE UNCOVERED TICKS ARE PUBLISHED.**
   The dispatch asked which actions can hold during the window and said to cover exactly
   those. MEASURED at this head: the window also runs inside `HoldPosition`, `ChaseBall`,
   `Pass` and `MakeRun` — all of them SHARED outfield cases, none of them a keeper case, and
   the post-catch `HoldPosition` reaches the executor through `decideCarrier`, not through
   `decideGoalkeeper` at all. Widening the override into shared cases would take the seam
   past the ruling's letter, so it was NOT done; the consequence is §4's second limit, pinned
   by its own fixture, and named for GK-T1.
5. **THE WAITING TEST USES THE BODY'S PLAIN CARRY POINT.** `owner.pos + heading · carry` is
   the carry point in the shipped 0.3 / 0.85 form. When `carry === 0.85` and `c6Carry` is
   armed, the ACTUAL placement is C6's lagged-heading variant with its keyed wobble, so the
   test point and the resumption point differ by that offset. Stated, not hidden: the keeper's
   held ball rides the 0.3 branch (`gkHoldTimer > 0 || gkDistributing`), which is the C6
   variant's own excluded case, so the difference can only arise for a keeper who caught the
   ball on his FEET outside his area (`gkFeet` in `giveBall`).
6. **THE FIXTURES WALK THEIR OWN SCRATCH BAND TO FIND THE ENGINE'S OWN OUTCOME.** No roll is
   forced and no rng is stubbed anywhere in the suite: a scene that wants a CATCH walks the
   scratch seeds until the engine's own `rng.chance` produces one, and the PARRY scene is
   built by the shipped rule (`speed < 21` fails ⇒ the parry branch) rather than by a stub.
   This keeps every fixture a statement about the shipped code.

## §COMMANDER CORRECTIONS (ruling #399 — the seam BANKED-DORMANT AS BUILT and NOT OF RECORD as a law: verifier FAIL on two HIGH that are DESIGN defects (the jump deferred, not removed; the arrival-release untestable), disposed by RE-FORM at GK-T0b; four MEDIUM and four LOW disposed; the seam's bytes UNCHANGED at this ruling — the flag is OFF and the OFF world byte-identical)

The independent verifier ran its own per-tick byte-identity harness (24/24 cells, three worlds; the
seam is dormant), its own lockstep outcome-at-save comparison (12 saves, zero movement), 91,129 OFF
ticks with the field null, all four mutants on a realpath-verified scratch copy, and — decisively —
the ruling's own catch-at-2.5 m fixture through the FULL step, past the window. Verdict **FAIL —
two HIGH**. The items:

1. **HIGH — THE BALL-JUMP IS DEFERRED, NOT REMOVED.** On the ruling's fixture (catch at 2.5 m) the
   armed ball sits at the hands for 41 ticks and on tick 42 — the tick `saveAnimTimer` reaches 0 —
   moves 2.050600 m in one tick against a keeper cap of 0.111600 m (the shut world: 2.545900 m on
   tick 1). The body never arrived: after a catch the keeper owns the ball, `decidePlayer` routes
   him into `decideCarrier`, and he holds `MoveToFormationSpot` / `HoldPosition` — none of the three
   enumerated keeper cases — so M-GK.2 never fired (on the fixture, 0 of 42 ticks). The pin that
   should catch the expiry jump is scoped by `saveContact !== null`, and `physicsStep` nulls the
   field on that very tick before the carry law runs, so the pin cannot fire. RULED: the law as
   built does not deliver its sentence; RE-FORMED at GK-T0b (ruling #399 item 4): the body is
   steered on EVERY tick while the contact is set (the keeper is the only body that has one — no
   action-type enumeration), and the caught ball waits until ARRIVAL, released only with the
   body's carry point or with the loss of ownership — never by the animation timer.
2. **HIGH — THE ARRIVAL-RELEASE IS UNTESTABLE AS BUILT.** A count-preserving mutant that disables the
   arrival release (`else if (cx > 1e30) …`) passes all 25 pins, because the timer clears the field
   anyway and every behavioural pin loops on `saveContact !== null`. GK-T0b's pins measure the
   ball's displacement across the WHOLE episode including the release tick, and kill the
   "waits forever" mutant behaviourally (a fixture where the body arrives and the ball then follows).
3. **MEDIUM — THE STATED BOUND ON THE WAITING BALL WAS FALSE**: up to 5.481300 m from its owner
   (mean 1.719000 m over 312 waiting ticks) — the owner walks away from a fixed contact. Corrected
   in place; GK-T0b's steering-every-tick makes the owner walk TOWARD it.
4. **MEDIUM — "PARRIES NEVER ENTER" WAS FALSE** (4 of 8 waiting episodes followed a regathered
   parry; the ball pinned to the pre-parry contact). The ruling itself (#398 item 5(iii)) carried the
   premise. Corrected in place; GK-T0b marks the contact `caught` only in the catch branch and gates
   the waiting law on it (parries steer the body only).
5. **MEDIUM — THE "WINDOW IGNORED" MUTANT CHECK CANNOT FAIL** (the field is nulled on the first
   tick). GK-T0b re-forms it against the new law (steer until release, not until the timer).
6. **MEDIUM — THE UNCOVERED-CASE LIST WAS INCOMPLETE** (`MoveToFormationSpot` held 19 of 42 window
   ticks on the fixture). Moot under GK-T0b's every-tick steering; of record.
7. **LOW — THREE KEEPER CASES, NOT THE RULING'S TWO** (`GoalkeeperRush` added) — a widening within
   the keeper's own cases, disclosed but not flagged; moot under the re-form.
8. **LOW — THE CONTEST PREDICATES REACHABLE BY A WAITING BALL OUTSIDE THE HOLD BUBBLE** (the tackler
   scan at 1.15 m of the ball; `looseTouch` at 0.85 m) named by the verifier for the `gkFeet` case;
   0 such ticks observed in 12 matches. GK-T0b's doc names them; GK-T1 measures.
9. **LOW — `rendezvousRecovery.ts` snapshots `saveAnimTimer` and not `saveContact`**; inert when off,
   safe when on (both readers require non-null); of record.
10. **LOW — §7's two sentences about the held ball's protection** describe two mechanisms and read as
    a contradiction; GK-T0b's contract writes one sentence.
11. **THE ARRIVAL ARITHMETIC, OF RECORD**: ruling #398 item 5(ii)'s "arrives within the window for any
    contact inside reach × 1.35 at any keeper topSpeed above 4.62 m/s" ignored acceleration — from
    rest a keeper at topSpeed 5.962486 m/s ends 0.591749 m short at the mean reach and 0.955967 m
    short at reach × 1.35 (the executor's fixtures, pinned as `end > 0`). The executor published the
    falsification instead of burying it — the honest half of this stage, ratified. A dive IMPULSE
    (a real dive is faster than a run) would be a NEW CONSTANT and is a later door; GK-T0b's
    arrival-based wait makes the body's travel time a MEASURED face for GK-T1.
12. **RATIFIED**: the ONE narrowing (`bfFacingCost`'s faceTarget census 21 → 22, positive); the
    field-name correction (`save.meanDistanceMetres` etc. — the artifact's names, not the brief's);
    the placement after the switch; the fixtures walking their own band with no rng stubbed.
