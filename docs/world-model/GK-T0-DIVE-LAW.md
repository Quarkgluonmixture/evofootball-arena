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
> suite lives in the out-of-band scratch bands 900,004,800–899, 900,005,000–099 and — GK-T0c's
> own — 900,005,200–299.** `npm run build` was NOT run:
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

## §1 THE MECHANISM (what armed means) — **M-GK.1–3′, as RE-FORMED at GK-T0b and CLOSED at GK-T0c**

> ⭐⭐ RULING #399 struck GK-T0's law (§COMMANDER CORRECTIONS 1–12). §1 is re-written to the
> RE-FORM; the struck constructions are named in place, and §GK-T0b DELTA at the foot of this
> file lists every changed `src` line against commit c660531.
> ⭐⭐ RULING #400 item 3 then CLOSED the one latent hole the verifier found — a lose-and-regain
> inside one step left a stale caught contact. M-GK.3′ gains **RELEASE (c) — REGAIN-CLEARED**
> and M-GK.1's catch write is REORDERED after `giveBall`; **§GK-T0c DELTA** lists every changed
> `src` line against commit 006bf71.

Armed means ONE boolean, `gkDiveBody`, and FIVE guarded sites (GK-T0b's four plus release (c)). Shut, every one of them is a
conjunction that dies on the flag, and `Player.saveContact` is null for the whole match.

### M-GK.1 THE CONTACT POINT AND THE `caught` MARK — `src/sim/mechanics.ts`, `tryKeeperSave`

The save roll has just succeeded; the stats and the shot ledger are already written. TWO
writes, one per branch — **the PARRY write FIRST in its branch, the CATCH write LAST in its
own (GK-T0c's reorder — see below)**:

```ts
    if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {
      match.pushEvent('save', defSide, `${gk.name} catches it`);
      match.giveBall(gk);
      if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: true };
    } else {
      if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: false };
```

Both record the BALL'S OWN POSITION at the save tick, on the KEEPER. Each is after its own
branch's roll, so neither changes a roll, an outcome or an rng draw. ⛔ GK-T0 wrote ONE unmarked
line ABOVE the split, and a keeper who regathered his own parry inside the window then pinned
the ball to the pre-parry contact (§CORR 4).

⭐⭐ **WHY THE CATCH WRITE IS LAST** (GK-T0c, ruling #400 item 3): release (c) below retires a
caught contact at every ownership GAIN, so a write placed above `match.giveBall(gk)` would be
wiped by the very save that produced it. `giveBall` never writes `ball.pos` — it zeroes
`ball.vel` and sets `z`, `vz`, `spin` — so THE RECORDED VALUE IS UNCHANGED; the exactness pin
now reads `m.ball.pos` itself after the call and asserts the equality ON THE BALL. The PARRY
write stays FIRST: a parry takes no `giveBall`, and everything below it moves the ball.

The field is `Player.saveContact: { x: number; y: number; caught: boolean } | null = null`.
THE CLEARS, all guarded so the shut path executes no assignment:

```ts
    this.saveAnimTimer = Math.max(0, this.saveAnimTimer - dt);
    if (this.saveContact !== null && !this.saveContact.caught && this.saveAnimTimer === 0) this.saveContact = null;
```

— the decrement clears a **PARRY** contact only — plus the same guarded line beside the two
`this.saveAnimTimer = 0;` resets (`becomeSub`, `resetForKickoff`). ⭐⭐ A **CAUGHT** contact is
NOT cleared by the animation timer: the sprite's window and the law's window are different
things (ruling #399 item 2's lesson of record).

### M-GK.2′ THE BODY FOLLOWS THE HANDS, EVERY TICK — `src/ai/actionExecutor.ts`, after the switch

```ts
  if (match.gkDiveBody && p.saveContact !== null) {
    target = p.action.type === 'GoalkeeperRush'
      ? { x: p.saveContact.x, y: p.saveContact.y }
      : clampToBox(p.saveContact, team.attackDir);
    speedF = 1;
    p.faceTarget = ball.pos;
  }
```

**WHY AFTER THE SWITCH AND NOT INSIDE THE CASES** (unchanged from GK-T0): `GoalkeeperPosition`
contains an early `break` (the 追分清道夫 branch), so an override written at the end of that
case would not cover it. ONE site after the switch is after every case's own target
computation. ANCHORED: it still sits BEFORE the free-kick wall block, which cannot take a
keeper (`.filter((p) => p.role !== 'GK' && !p.sentOff)`), and before the onside clamp
(`… && p.role !== 'GK'`) and the barred-box clamps (`… && p.role !== 'GK'`, target level and
velocity level) — all three exclude keepers, all three pinned.

⭐⭐ **THE GATE IS THE FIELD, NOT AN ACTION-TYPE LIST** (§CORR 1). GK-T0 enumerated
`GoalkeeperSave` / `GoalkeeperPosition` / `GoalkeeperRush` and the law never fired where it
mattered: after a catch the keeper OWNS the ball, `decidePlayer`'s FIRST branch routes the
owner into `decideCarrier`, and he holds `MoveToFormationSpot` / `HoldPosition` — 0 of 42
window ticks covered on the ruling's own fixture. The keeper is the ONLY body that ever
carries a contact (both writes are in `tryKeeperSave`, both on `gk`), so the field IS the
keeper scope — PINNED on every body of every tick of armed matches (0 outfield contact ticks).

⚠ `p.faceTarget = ball.pos` is set here and can still be overwritten below by the shipped
"a keeper HOLDING the ball squares up toward the opponent goal" rule (Phase 51.2). That is the
shipped world's facing law and this seam does not touch it; its consequence for the arrival
predicate is §4's.

### M-GK.3′ THE CAUGHT BALL WAITS UNTIL ARRIVAL — `src/sim/Match.ts`

The waiting branch in the carry law:

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
or distributes, 0.85 otherwise — so there is no new distance constant. The keyed noise term is
not applied while the ball waits: it is held, not dribbled. The two shipped placements are
BYTE-UNCHANGED; only the `if` that opens them is an `else if`.

**RELEASE (a) — ARRIVAL.** The carry point comes within `carry` of the contact ⇒ the contact is
consumed and the SHIPPED placement runs the same tick. **THE BOUND ON THE RELEASE TICK**,
derived from the code: the ball sat exactly ON the contact at the end of the previous tick;
the arrival test that fired says the carry point is within `carry` of the contact; the shipped
placement puts the ball ON that carry point ⇒ the release displacement is **at most `carry`**.
Measured: **0.277703 m against `carry` 0.3** on the arrival fixture.

**RELEASE (b) — LOSS OF OWNERSHIP.** ONE sweep, immediately above the restart/ball fork in
`step`:

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
    if (this.phase === 'restart') this.stepRestart(dt);
    else this.stepBall(dt);
```

⭐ THERE IS NO OWNERSHIP FUNNEL IN THIS ENGINE: `ball.owner` is assigned by **TWELVE**
statements — `Match.ts` **7** (`kickBall` l.3813, `giveBall` l.3843, and l.4683 / l.4842 /
l.5025 / l.5184 / l.6064), `mechanics.ts` **4** (l.1497, l.1591, l.1804, l.2014) and `Ball.ts`
**1** (l.51, `this.owner = null` in the reset) — line numbers AT GK-T0c's HEAD (the `Match.ts`
ones each moved by GK-T0c's added comment block; §4 enumerates what each one assigns). A per-site clear would be twelve new statements
in three files, one of them OUTSIDE the seam's five. The sweep is ONE site, runs after
the tick's brains, executors and physics, and immediately BEFORE the ball is placed — so the
tick a keeper stops owning the ball is already a tick on which the ball is where the ENGINE
put it, never at the hands. It also covers the `restart` phase, which `stepBall` never runs.

**RELEASE (c) — REGAIN-CLEARED (GK-T0c, ruling #400 item 3).** ONE guarded statement in
`giveBall`, AFTER the offside early-return (so it runs on every SUCCESSFUL gain and on no dead
ball) and IMMEDIATELY AFTER the ownership assignment:

```ts
    const ball = this.ball;
    ball.owner = p;
    // (the doc comment for this statement lives here — comment-only)
    if (p.saveContact !== null && p.saveContact.caught) p.saveContact = null;
    ball.lastTouch = p;
```

**A FRESH GAIN RETIRES A STALE CAUGHT CONTACT.** The sweep of release (b) runs ONCE per tick,
above the restart/ball fork, so it only ever sees a loss that PERSISTS to the next sweep. A
keeper who loses the ball and REGAINS it inside that window presents the SAME owner to the
sweep; without this statement his pre-loss contact survives and the waiting law pins the ball
to it. MEASURED at this head on the fixture below (armed, scratch seed 900,005,204): with the
statement DELETED the contact is still `caught` after the regain, the ball is **pinned to the
pre-loss contact — 2.496093 m from its own keeper — and stays there for every one of the next
20 ticks**; with the statement in place the contact is null and the ball rides the shipped
carry law at **0.850000 m** from him.

⭐ It sits AFTER the gain because the retirement is the gain's CONSEQUENCE: no future statement
can slip between the two and read an owner who still carries the contact of a possession he has
already lost. ⛔ SHUT, the field is null on every body, so the FIRST conjunct short-circuits and
no assignment executes (G-NULL is the whole-match form of that; the unit pin is the statement's
own). ⭐ The clear is `caught`-only: a PARRY contact is steer-only, never had an owner, and dies
with the sprite's window — clearing it on a gain would silently undo M-GK.2′'s steering for the
regathered parry that #399 item 1(iii) put on the record.

⚠ **THE CATCH BRANCH IS REORDERED FOR IT** (§DEVIATIONS 9): `tryKeeperSave`'s catch write now
runs AFTER `match.giveBall(gk)`, because `giveBall` would otherwise retire the contact the save
had just written. `giveBall` never writes `ball.pos` — it zeroes the velocity and sets `z`,
`vz` and `spin` — so THE CONTACT STILL EQUALS THE BALL'S POSITION AT THE SAVE TICK, exactly as
before; that equality is pinned on the ball itself, not asserted.

**A REGATHERED PARRY** takes the shipped carry law from the regather tick (`caught: false` ⇒
the waiting branch does not fire); its contact is cleared by the decrement at the window's end.

**THE FAIL-SAFE, no new constant.** A keeper whose carry point never reaches the contact holds
the ball at the hands for as long as he owns it; the shipped bubble protects it (`stepBall`
returns while `gkHoldTimer > 0 || gkDistributing`; `tryTackles` returns while
`gkHoldTimer > 0`). `gkDistributing` ends when he DISTRIBUTES — a kick, i.e. a loss of
ownership, i.e. release (b) — so the wait cannot outlive his ownership. The one keeper with no
bubble is the `gkFeet` case: §4.

### THE IDENTITY PROOF, IN WORDS

With the flag off:

* `tryKeeperSave` evaluates `match.gkDiveBody` in whichever branch it took and stops. No
  write, no rng, no branch change.
* `Player.saveContact` is therefore null for every body forever, so the integrator's clear
  short-circuits on its FIRST conjunct — the shut path executes no assignment at all, not even
  `null = null`. The same holds at the two resets.
* The executor's override short-circuits on `match.gkDiveBody`; `target`, `speedF` and
  `faceTarget` are whatever the case wrote.
* The ownership sweep short-circuits on `this.gkDiveBody`: one boolean test, no loop.
* The carry law's `gkHands` is null by the same first conjunct, `heldAtHands` stays false, and
  control reaches the very same `this.c6Carry && carry === 0.85` test the shipped code
  reached, with `ball.pos` untouched in between.

⇒ every double, every rng draw and every branch is HEAD's. MEASURED, not assumed: the 36 OFF
cells (12 scratch seeds × bare / world 13 / world 14, full matches, the signature including one
draw off the finished match's own rng) digest to
`e0cf9c124fd841bd90bbc86c4fe8aab1c074cfa0a16716981314ed8e929c94f1` on a clean worktree at
commit **5face60** and to the same digest on this tree, 36 distinct cells on both sides.

## §2 THE FILES (the delta against **c660531**, GK-T0's commit)

| file | what GK-T0b changed |
|---|---|
| `src/sim/Player.ts` | the field's type gains `caught: boolean`; the integrator's clear gains the `!this.saveContact.caught` conjunct (a PARRY contact dies with the sprite, a CAUGHT one does not); the two reset clears UNCHANGED |
| `src/sim/mechanics.ts` | the ONE write above the catch/parry split becomes TWO writes, one per branch, carrying the `caught` mark |
| `src/ai/actionExecutor.ts` | the override's gate loses BOTH the `saveAnimTimer > 0` conjunct and the three-action-type enumeration; body, clamp and placement UNCHANGED |
| `src/sim/Match.ts` | the waiting branch's `saveAnimTimer > 0` conjunct becomes `saveContact.caught`; NEW — the ONE ownership-loss sweep immediately above the restart/ball fork in `step` |
| `src/sim/League.ts` | UNCHANGED (the `matchFlags` key union only) |
| `tests/gkDiveBody.test.ts` | the pin suite RE-FORMED — see §3 |
| `tests/bfFacingCost.test.ts` | UNCHANGED by GK-T0b (GK-T0's one narrowing still holds: the override still writes `p.faceTarget` exactly once) |
| `docs/world-model/GK-KEEPER-BODY-CONTRACT.md` | §2 re-written to M-GK.1–3′; §3 carries GK-T1's AMENDED form; §4 re-written; §7's caught-ball clause RE-TAKEN |
| `docs/world-model/GK-T0-DIVE-LAW.md` | this file — §1 / §2 / §3 / §4 / §DEVIATIONS updated, §GK-T0b DELTA added |

> ⚠ THE TABLE ABOVE IS **GK-T0b's** delta (against c660531). GK-T0c's own delta — against
> **006bf71**, two files, one moved line and one added line — is **§GK-T0c DELTA** below.

⛔ **No other file under `src/**` or `tests/**` changed.** ⛔ **`src/game/a4World.ts` is NOT
edited** and contains neither `gkDiveBody` nor `saveContact`. No new constant, no probe
touched, no renderer change, no entry-layer mention.

## §3 THE PINS (`tests/gkDiveBody.test.ts` — ALL GREEN; **the suite is the living inventory**)

> ⭐ No count is typed here: the suite is the inventory. Each bullet says what its pin CATCHES.

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
  Beside it, OUT OF SUITE and reported as an executor receipt: the same 36 cells computed on a
  CLEAN WORKTREE at commit **5face60** and on this tree give the identical pooled digest
  `e0cf9c124fd841bd90bbc86c4fe8aab1c074cfa0a16716981314ed8e929c94f1`.
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
* **⭐⭐ M-GK.1 EXACTNESS AND THE MARK** — on a hand-built catch at 2.5 m and a hand-built
  parry at 2 m, the contact point EQUALS the ball's own position at the save tick, differs from
  the keeper's own position and from any owner-relative carry point, carries `caught === true`
  on the catch and `caught === false` on the parry, and only the catch leaves him owning the
  ball; the same scene shut records nothing. **CATCHES:** a contact on the wrong body or in an
  owner-relative frame; a mark written on the wrong branch.
* **⭐⭐ THE FAILED ROLL WRITES NOTHING** — the whole fixture band is walked with a high-xG
  shot; on every seed where the engine rolled NO save the field is null, on every seed where
  it saved the field is set, and the band really does contain failures (non-vacuous).
  **CATCHES:** a write hoisted above the roll.
* **⭐⭐ THE DECREMENT CLEARS A PARRY CONTACT AND NEVER A CAUGHT ONE** — the same unreachable
  contact, run twice, `caught: false` then `caught: true`: the first is gone the tick the timer
  reaches 0, the second survives. The guarded line is anchored verbatim and GK-T0's struck line
  is asserted ABSENT. **CATCHES:** the animation clock creeping back into the law's release.
* **⭐⭐ NO OUTFIELD BODY EVER HAS A CONTACT** — EIGHT armed world-13 matches
  (900,005,000–007), EVERY body read on EVERY tick: outfield contact ticks **0**, keeper
  contact ticks > 0 AND keeper CAUGHT contact ticks > 0 (both non-vacuous — a catch is the
  rare save family, and a parry-only walk would let a wrong-body mutant in the CATCH branch
  through). **CATCHES:** the whole justification for M-GK.2′ dropping its action-type
  enumeration.
* **⭐⭐ THE STEERING FIRES IN THE VERY CASES GK-T0 DID NOT COVER** — on the free-running 2.5 m
  catch the real brain gives the keeper a SHARED case, and the body still closes on the
  contact; the shut arm on the same construction ends strictly farther away.
  **CATCHES:** a regression to an enumerated scope (the defect of ruling #399 item 1(i)).
* **⭐⭐ THE WINDOW-IGNORED MUTANT, RE-FORMED** — on the same episode the contact is still
  alive on the tick `saveAnimTimer` reaches 0, and the body is strictly nearer 30 ticks later.
  ⭐ THE OLD LAW'S TIMER-CLEAR FAILS THIS PIN. **CATCHES:** a release put back on the sprite.
* **⭐⭐ THE ARRIVAL ARITHMETIC** — the quotient is asserted against the census's own stored
  faces; body fixtures at the census's mean reach, at its reach × stretch and at the largest
  stored `dNow` CLOSE the distance and, from rest, do NOT reach zero (§4's first limit); the
  total travel never exceeds the body's own `topSpeed × 0.7` (proof the body is INTEGRATED,
  never written). **CATCHES:** a body written to the contact point, a dive that borrows speed
  it does not have, or a doc that claims an arrival the fixture does not show.
* **⭐⭐ THE SHORTFALL IS PUBLISHED** — a hand-built keeper below the quotient is still short
  at the whistle, and a fast body on the same fixture ends strictly nearer. **CATCHES:** a
  hidden floor on the dive speed.
* **⭐⭐ MUTANT: THE BODY STEERED WITHOUT THE FLAG** — the same fixture with the door shut ends
  the window farther from the contact than the armed arm. **CATCHES:** an override that forgot
  its door.
* **⭐⭐ M-GK.3′ THE 2.5 m CATCH, THE CONTACT AHEAD — THE WHOLE EPISODE** — walked with the
  FULL `m.step(DT)` from the catch tick to the FIRST TICK AFTER the release, the ball's
  displacement recorded EVERY tick with NO scoping by `saveContact`: exactly `0` on every
  waiting tick, and on the ARRIVAL release tick at most `carry` (and at most
  `topSpeed · DT · (1 + 1e-6) + carry`), with the shut world's own first tick strictly larger.
  **CATCHES:** the deferred jump — the defect of ruling #399 item 1(i), which the OLD pins
  could not see because they looped on the field.
* **⭐⭐ ARRIVAL KILLS "WAITS FOREVER"** — the release is asserted to happen, to happen BY
  ARRIVAL, and to hand the ball to the shipped placement: on the next tick the ball is at
  `owner.pos + heading · carry` to within 1e-9. **CATCHES:** the count-preserving mutant that
  passed all 25 of GK-T0's pins (§CORR 2).
* **⭐⭐ THE RULING'S OWN FIXTURE (the contact ABEAM)** — the honest half, pinned: the release
  is by OWNERSHIP LOSS, the wait OUTLIVES the sprite's window, the ball is `0` on every one of
  its waiting ticks, the BODY is inside `carry` of the contact at the release, and the ball
  ends where the ENGINE put it. **CATCHES:** a doc that claims arrival is the usual release.
* **⭐⭐ OWNERSHIP LOSS MID-WAIT, AND THE `gkFeet` EXPOSURE** — a catch OUTSIDE the area (no
  hold, no bubble) with an opponent stood AT THE HANDS: the tackler-candidate predicate
  (1.15 m of the BALL) and `looseTouch` (0.85 m from the OWNER) are both TRUE, the keeper loses
  the ball on the first tick, the contact clears, and the ball is not pinned thereafter.
  **CATCHES:** a waiting ball that survives the loss of its owner — and it PUBLISHES the
  exposure instead of arguing it away.
* **⭐⭐ A REGATHERED PARRY IS NEVER PINNED** — a real parry, then the engine's own ownership
  entry inside the window: the steer-only contact survives, the ball is NOT at the pre-parry
  contact on any tick, and it rides the shipped carry length. **CATCHES:** §CORR 4's defect.
* **⭐⭐ GK-T0c THE UNIT PIN — `giveBall` RETIRES A STALE CAUGHT CONTACT, AND NEVER A PARRY
  ONE** — a hand-built keeper carrying a `caught: true` contact he should no longer own: one
  `match.giveBall(gk)` and the field is null. The same scene with a `caught: false` contact is
  UNTOUCHED, value for value — a parry contact is steer-only, never had an owner, and dies with
  the sprite's window; clearing it at a gain would undo M-GK.2′'s steering for the regathered
  parry of #399 item 1(iii). And the same two scenes SHUT execute no assignment at all.
  **CATCHES:** a clear that fires on the wrong branch, or not at all.
* **⭐⭐ GK-T0c LOSE AND REGAIN BETWEEN TWO SWEEPS — THE VERIFIER'S V6 SHAPE** — a keeper
  waiting on a caught ball with NO hold bubble (the `gkFeet` catch) is dispossessed by the
  ENGINE'S OWN `tryTackles`, and regains the ball INSIDE the same inter-sweep window: the
  contact is null after the regain, the ball is NOT at the pre-loss contact on the following
  tick, it sits within `carry` of its OWNER, and it keeps riding him (per-tick displacement ≤
  `topSpeed · DT`) for the next five ticks. ⚠ THE LOSS IS THE ENGINE'S; THE REGAIN IS
  HAND-BUILT (`m.giveBall(gk)`, the same idiom the regathered-parry pin uses) — at this head
  the engine cannot regain inside the same `stepBall`; §4's residual says why.
  **CATCHES:** ruling #400 item 3's latent hole — the stale caught contact that survives an
  intra-step regain and snaps the ball back.
* **⭐⭐ THE ANCHORS** — the flag's and the field's occurrence counts per file with every site
  enumerated and every prose mention proved to be a comment; exactly TWO `gk.saveContact =` in
  `mechanics.ts`, anchored AFTER the split and each before its branch's own next statement,
  with GK-T0's struck one-line write asserted ABSENT; the CATCH write anchored AFTER its own
  branch's `match.pushEvent` and `match.giveBall(gk)` (GK-T0c's reorder, the `giveBall` found
  from the catch event — canon "anchored extraction", never the file's first occurrence) and
  the struck GK-T0b ordering asserted ABSENT; exactly ONE `p.saveContact = null;` statement in
  `Match.ts`, inside `giveBall`, AFTER the offside early-return and IMMEDIATELY after
  `ball.owner = p;` with nothing but comment lines in between; exactly ONE executor override, whose gate
  names NO action type, anchored after the switch and before the wall, with the three
  keeper-excluding clamps below it anchored; exactly ONE waiting branch in `Match.ts` (its
  struck `saveAnimTimer` conjunct asserted ABSENT) and exactly ONE ownership sweep, anchored
  immediately above the restart/ball fork; the save's untouched lines (the 0.7 s window,
  `SAVE_STRETCH`, the parry's velocity and cooldown, the ONE `keeperReach` call); and the field
  absent from `League.ts`, `rendezvousRecovery.ts` and both renderers.
  ⚠ Anchored counts are RECEIPTS, never the only teeth: every mutant above is killed
  BEHAVIOURALLY as well.
* **⭐ THE FINGERPRINT OF RECORD** — the literal is in the suite, and the suite RUNS the
  shipped recipe and compares. **CATCHES:** any production drift at all.

### THE FIVE MUTANTS, KILLED BEHAVIOURALLY (applied to a scratch copy, never the repo)

Each was applied to its OWN copy of the tree under `/tmp` (GK-T0b used `/tmp/gkmut`; GK-T0c
re-ran all five, one directory per mutant) — each created by `tar`-ing the working tree without
`.git` and without `node_modules`, its `node_modules` a symlink to the repo's, its `realpath`
verified DISTINCT from `/Users/jamie/Documents/Promptfoo/evofootball-arena` BEFORE a byte was
written. The whole suite was run in each. The repo tree was never mutated. The failing pins
below are the OBSERVED ones, not a prediction.

> ⭐ THE COUNTS BELOW ARE RE-MEASURED AT **GK-T0c's** HEAD against GK-T0c's suite (30 pins).
> They are OBSERVED failures, not predictions, and they are not the GK-T0b numbers: GK-T0c adds
> two pins, and ruling #400 item 3(ii) records that the verifier observed **11** (not the doc's
> **10**) for the wrong-body row at GK-T0b. Both older values are named beside the new one.

| mutant (the exact edit) | pins that FAIL (behavioural first) |
|---|---|
| **THE CONTACT ON THE WRONG BODY** — the CATCH write becomes `defTeam.players[1].saveContact = { …, caught: true }` (an outfielder of the keeper's own side) | **NO OUTFIELD BODY EVER HAS A CONTACT**; **THE 2.5 m CATCH, THE CONTACT AHEAD**; **ARRIVAL KILLS "WAITS FOREVER"**; **THE RULING'S OWN FIXTURE**; **OWNERSHIP LOSS MID-WAIT**; **LOSE AND REGAIN BETWEEN TWO SWEEPS**; **THE STEERING FIRES IN THE VERY CASES GK-T0 DID NOT COVER**; **THE WINDOW-IGNORED MUTANT**; **M-GK.1 EXACTNESS**; **THE FAILED ROLL WRITES NOTHING** (**12** in all at this head, 10 of them behavioural — the doc said 10 at GK-T0b, the verifier observed 11 there, and GK-T0c's lose-and-regain pin is the twelfth) |
| **THE ARRIVAL RELEASE DISABLED, COUNT-PRESERVING** — the arrival test becomes `if (cx * cx + cy * cy > -1) heldAtHands = true;` (same statement, same `else`, same line count; the `else` branch is simply unreachable) | **ARRIVAL KILLS "WAITS FOREVER"**; **THE 2.5 m CATCH, THE CONTACT AHEAD** (3 in all) |
| **THE BODY STEERED WITHOUT THE FLAG** — the override's gate loses `match.gkDiveBody` | **MUTANT: THE BODY STEERED WITHOUT THE FLAG** (3 in all) |
| **THE PARRY MARKED `caught: true`** — the parry branch's write flips its mark | **A REGATHERED PARRY IS NEVER PINNED**; **M-GK.1 EXACTNESS AND THE MARK** (3 in all) |
| **⭐⭐ GK-T0c — THE `giveBall` CLEAR DELETED** — release (c)'s one statement removed from `giveBall`; nothing else touched | **THE UNIT PIN**; **LOSE AND REGAIN BETWEEN TWO SWEEPS**; **ONE WAITING BRANCH, ONE OWNERSHIP SWEEP AND ONE `giveBall` CLEAR** (3 in all, 2 of them behavioural). ⭐ THE RECEIPT: with the statement gone the contact survives the regain and the ball is **pinned to the pre-loss contact, 2.496093 m from its own keeper, on every one of the next 20 ticks**; with it in place the ball rides its owner at **0.850000 m** |

⭐ Every row's FIRST pin is behavioural — it fails on what the engine DOES, not on a count of
source lines. The anchors that also fail are receipts beside them, never the teeth.

## §4 HONEST LIMITS

* ⚠⚠ **THE DIVE IS CAPPED AT `topSpeed`, AND A REAL DIVE IS FASTER.** The body travels at the
  same speed it runs at, and acceleration is real: from rest, even a keeper above the census's
  own quotient ends the sprite's 0.7 s SHORT of the contact (§COMMANDER CORRECTIONS item 11:
  0.591749 m short at the mean reach, 0.955967 m at reach × 1.35, at topSpeed 5.962486 m/s).
  The pins assert that he CLOSES and that he does NOT arrive within that window — the shortfall
  is a PUBLISHED FIXTURE RECEIPT, not a failure. A dive IMPULSE would be a NEW CONSTANT and is
  a LATER DOOR (the queue's held-doors list carries it).
* ⚠⚠ **THE ARRIVAL TIME IS A MEASURED FACE, NOT A GUARANTEE — AND IT IS LONGER THAN THE
  SPRITE'S WINDOW.** FIXTURE RECEIPTS, on the 2.5 m catch walked with the full step:
  * contact AHEAD of him — the ARRIVAL release fires on **tick 41**; the ball moved
    **0.000000 m** on each of the 40 waiting ticks and **0.277703 m** on the release tick
    against a `carry` of **0.3**; on the next tick it is at the shipped carry point.
  * contact ABEAM — the ruling's own fixture — the release is by **OWNERSHIP LOSS on tick
    390** (his own distribution); the ball moved **0.000000 m** on all 389 waiting ticks; his
    BODY was inside `carry` of the contact from **tick 54**; the release displacement
    **1.110954 m** is a STRUCK ball (`kickBall` puts it at his boot), not a carry-law jump.
  IN-PLAY RECEIPTS, **TWO WALKS, EACH LABELLED BY ITS OWN n** (ruling #400 item 2's MEDIUM 2 —
  the 12-match receipt alone was too small to carry the release composition):
  * **n = 12 armed scratch matches** (world 13, seeds 900,005,000–011; 55 saves, 3 catches):
    **3 caught-ball waits, 3 of 3 ended by ARRIVAL**, waits **93 / 65 / 34** ticks (mean
    **64.000000**, max **93**), max ball↔owner distance while waiting **3.532372 m**, **0**
    regathered parries, **0** ticks with an outfield body carrying a contact.
  * **n = 40 armed scratch matches** (the executor's supplementary walk, as recorded in ruling
    #400 item 2(i)): **21 waits, 17 by ARRIVAL / 4 by OWNERSHIP LOSS**, mean wait
    **102.523810** ticks, mean arrival **57.294118**, max ball↔owner **2.960237 m**. The
    independent verifier's own 40: **24 waits, 22 / 2**, mean **69.25**, max **3.192847 m**.
  ⇒ ARRIVAL IS THE USUAL RELEASE IN PLAY, and OWNERSHIP LOSS is a real minority — a
  composition, not a certainty. ⛔ REGAIN-CLEARED (release (c)) has **0** observations in
  either walk: **0** intra-step lose-and-regains in 60 armed matches. It is a
  defence-in-depth close, and GK-T1 counts it beside the other two. ⚠ **0 REGATHERED PARRIES IS A VACUOUS n IN TWELVE MATCHES**, so it is not left as the
  evidence: a SUPPLEMENTARY scratch walk of FORTY armed world-13 matches (seeds
  900,005,012–051, out-of-band, zero frontier) found **7 regathered parries and 0 ticks with
  the ball pinned to a parry contact**. ⭐ FOUR ticks LOOKED pinned to a first cut and were
  chased down: on each, the parry and the re-claim happened on the SAME tick, so the owned-ball
  placement (which sits at the HEAD of `stepBall`) had not run yet and the ball was still at
  its free-flight position — which is the contact, because the contact IS the ball's position
  at the save tick. On the very next tick the SHIPPED carry law placed it at
  `owner.pos + heading · carry` with residual 0.000000 m in all four. The law never held it. ⚠ Most of these
  waits outlive the sprite's 42 ticks: the animation's clock and the law's clock are different
  things, on purpose.
* ⚠⚠ **THE CLAMP AND THE HOLD-FACING CAN BOTH DEFER THE ARRIVAL.** The arrival predicate is on
  the body's CARRY POINT (`pos + heading · carry`), not the body. A keeper HOLDING the ball is
  squared up toward the opponent goal by the shipped Phase 51.2 facing rule, so with a contact
  ABEAM his carry point sticks out sideways and can stay outside `carry` even when his body is
  centimetres away — that is the abeam fixture above. And `clampToBox` will hold him at the box
  edge for a contact taken off his line. Neither is patched: the fail-safe covers both.
* ⚠⚠ **THE FAIL-SAFE IS THE SHIPPED BUBBLE, AND THE `gkFeet` CASE HAS NONE.** A keeper who
  cannot arrive holds the ball at the hands for as long as he owns it; `stepBall` returns while
  `gkHoldTimer > 0 || gkDistributing` and `tryTackles` returns while `gkHoldTimer > 0`, so the
  waiting ball is protected exactly as a ball at his feet is. `gkDistributing` ends when he
  DISTRIBUTES — a kick, i.e. a loss of ownership, i.e. release (b) — so the wait cannot outlive
  his ownership. ⛔ THE EXCEPTION, PUBLISHED (§COMMANDER CORRECTIONS item 8): a catch OUTSIDE
  his area takes `giveBall`'s `gkFeet` branch — **no hold, no bubble** — and the two contest
  predicates read the BALL'S position (`dist(o.pos, ball.pos) < 1.15` in `tryTackles`' candidate
  scan; `looseTouch = dist(ball.pos, owner.pos) > 0.85`). FIXTURE RECEIPT, reported either way:
  with an opponent stood exactly at the hands, BOTH predicates are TRUE and **the keeper loses
  the ball on the first tick**. How often that happens in play is GK-T1's face (0 such episodes
  in the 12 armed matches above); this stage claims nothing about its size.
* ⚠⚠ **THE RESIDUAL OF RELEASE (c), ENUMERATED — WHICH OWNER ASSIGNMENTS BYPASS `giveBall`**
  (ruling #400 item 3). `ball.owner` is assigned by TWELVE statements. Read one by one at this
  head, **ELEVEN of them assign `null`** — they are LOSSES, and a loss that persists to the
  next sweep is release (b)'s own case:
  * `mechanics.ts` **l.1497** (`performDribbleTouch`), **l.1591** (the knock-and-go release),
    **l.1804** (`trySlideTackle`), **l.2014** (`tryTackles`) — all `ball.owner = null`. ⛔ A
    KEEPER CANNOT BE ASSIGNED AS OWNER AT ANY OF THE FOUR, so no regain passes through them.
  * `Match.ts` **l.3813** (`kickBall`), **l.4683** / **l.4842** / **l.5025** / **l.5184** (the
    dead-ball and out-of-play resets) and `Ball.ts` **l.51** (`reset`) — all `null`, same.
  * `Match.ts` **l.3843** — `giveBall`'s `ball.owner = p`. **THE ONE GAIN REACHABLE IN PLAY**,
    and every entry that hands a body the ball funnels through it (`tryCapture` →
    `resolvePendingControlAttempt`, `tryAerial`, the trap, the keeper's hold, the restart taker,
    and `tryKeeperSave`'s own catch). This is where release (c) lives.
  * `Match.ts` **l.6064** — the KICKOFF's `this.ball.owner = st`, the ONE non-`giveBall` gain in
    the file. `st` is the kicking side's deepest non-sent-off outfielder and falls back to the
    GOALKEEPER only when all five outfielders are sent off. ⛔ NOT CONSTRUCTIBLE as an
    intra-step lose-and-regain: a kickoff is a dead-ball reset — `this.ball.reset()` runs first,
    and every non-sent-off body of both sides has already been through `resetForKickoff`, whose
    own guarded line clears `saveContact` unconditionally. The only body that could reach l.6064
    carrying a stale contact is a SENT-OFF keeper taking a kickoff, i.e. a side with all six
    players dismissed. **REPORTED, NOT PATCHED** (the ruling's words: no further `src` change).
  ⭐⭐ AND THE HONEST HALF OF THE FIXTURE: at this head **the engine cannot lose and regain the
  ball inside one `stepBall` at all.** The owned branch places the ball, calls `tryTackles` /
  `tryTacticalFoul` / `trySlideTackle` / `trySmother` and then **`return`s** — the capture path
  (`tryCapture`) lives in the LOOSE branch, below that return. So a loss is always still a loss
  when the next sweep runs. GK-T0c's fixture therefore builds the loss with the ENGINE'S OWN
  tackle and the regain by HAND (`m.giveBall(gk)`) inside the same inter-sweep window — the
  shape the verifier used, stated as such and not as engine behaviour. ⇒ **A FINDING FOR THE
  COMMANDER, not a claim**: the latent hole is real as a code invariant and closed as one; its
  in-play population at this head is bounded by the fact that no engine path produces it.
* ⚠ **THE 0.7 s WINDOW IS THE ANIMATION'S.** It was chosen for the renderer (27.4), not
  measured as a dive time. It is no longer a release for a caught ball; it still bounds a PARRY
  contact and the sprite. The high-ball claim's 0.6 s window against the renderer's 0.7 divisor
  is an anchored asymmetry this law does not touch — the claim path sets no contact point at
  all, so a claimed high ball still snaps to the keeper's feet.
* ⚠ **THE PARRY'S BODY ARRIVAL IS COSMETIC-PHYSICAL.** The ball is already away when the body
  starts travelling, so arriving changes only where the keeper stands for the next phase. The
  parry's own arithmetic is pinned identical to the shut world's.
* ⚠ **DOWNSTREAM POSITIONS DIFFER, BY CONSTRUCTION.** The identity this stage pins is the
  OUTCOME AT THE SAVE TICK, not the whole match: once a body has dived, the world moves on from
  a different place. Any face that moves in the exam is DOWNSTREAM of that, never a changed
  roll.
* ⚠ **WITH THE FLAG OFF THE SHIPPED WORLD STANDS BYTE FOR BYTE**, and this stage states **NO
  FOOTBALL CLAIM**. ARMED means "the capacity exists behind a shut door" — not that the world
  is better, not that any face moves.
* ⚠ **WHAT THE EXAM MUST SHOW** (#398 item 5(v) as AMENDED by #399 item 5): the ball-jump face
  over the WHOLE EPISODE (every tick the keeper owns a caught ball, from the catch to the
  release and the tick after); the ARRIVAL-TIME distribution; the SHARE of waits ended by
  OWNERSHIP LOSS; the `gkFeet` CONTEST EXPOSURE; and the keeper's RESIDUAL-written ticks by
  class on the CORRECTED predicate `|pos_after − (pos_before + vel_after · DT)|`, including the
  H-GK-2 pocket. GUARDS in OBM-T1's tolerance form, read in BOTH directions: goals per match,
  saves per match and the catch share, xG-per-shot conversion, shots, completion, the keeper's
  distribution passes, and — added at #399 item 5 — his HOLDS PER MATCH and his
  TIME-TO-DISTRIBUTION. The reads name GK-ENTRY (world 15 = world 14 + the dive door) or STOP.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. **`tests/bfFacingCost.test.ts` — ONE NARROWING, THE ONLY ONE, AND IT IS GK-T0's; GK-T0b
   ADDS NONE.** Its `faceTarget` census pins the needle's occurrence count per file and the
   ASSIGNMENT count per file. M-GK.2′'s
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
3. **M-GK.2′ IS ONE SITE AFTER THE SWITCH, NOT ONE SITE PER CASE — AND ITS GATE IS THE FIELD,
   NOT AN ACTION LIST.** The GK-T0 dispatch's idiom was an override "placed AFTER the case's
   own target computation", scoped to the keeper cases. MEASURED at GK-T0: `GoalkeeperPosition`
   contains an early `break`, so an override at the end of that case would not cover the
   追分清道夫 branch — the one-site-after-the-switch placement survives GK-T0b UNCHANGED. What
   GK-T0b removes is the ENUMERATION (ruling #399 item 3(i)): the gate is now
   `match.gkDiveBody && p.saveContact !== null`, and the keeper scope is carried by the FIELD.
   That is only sound because the field is keeper-only, which is a MEASUREMENT, not an
   inference — pinned on every body of every tick of eight armed matches, catches included.
4. **THE `saveAnimTimer` CONJUNCT IS GONE FROM BOTH THE OVERRIDE AND THE WAITING BRANCH, AND
   ITS CLEAR IS NARROWED TO PARRIES.** GK-T0 used the sprite's 0.7 s window as the law's
   window; ruling #399 item 2 records that as the defect. The decrement's clear is kept for
   `caught: false` contacts ONLY, in one guarded statement. ⚠ CONSEQUENCE, DECLARED: a CAUGHT
   contact now has exactly TWO releases, and if a future edit removed both, the contact would
   live until `becomeSub` / `resetForKickoff`. That is why the arrival release is pinned
   behaviourally by a count-preserving mutant and the ownership release by its own fixture.
   ⭐ GK-T0c makes it THREE (regain-cleared), each with its own behavioural pin and its own
   mutant.

5. **THE OWNERSHIP-LOSS RELEASE IS ONE SWEEP, NOT A CLEAR PER ASSIGNMENT SITE — AND IT IS
   INSIDE THE FIVE FILES.** The dispatch asked for the minimal set of sites, "ideally ONE: the
   point where `ball.owner` is reassigned or nulled — if the engine has one owner-assignment
   funnel use it". MEASURED at this head: it has none. `ball.owner` is assigned by TWELVE
   statements — `src/sim/Match.ts` 7, `src/sim/mechanics.ts` 4, `src/sim/Ball.ts` 1 (the sites
   enumerated in §1 above) — `giveBall` is one entry, `kickBall` another, the dead-ball resets a
   third. A per-site clear would be twelve new statements in three files, one of them
   (`Ball.ts`) OUTSIDE the seam's five.
   So the release is ONE sweep in `Match.ts`, immediately above the `restart`/`stepBall` fork:
   after the tick's brains, executors and physics, and immediately before the ball is placed,
   so the tick a keeper loses the ball is already a tick on which the ball is where the ENGINE
   put it. ⚠ IT IS A LOOP OVER EVERY BODY, armed only; shut it is one boolean test. ⛔ NO SIXTH
   `src` FILE WAS TOUCHED.
6. **THE ARRIVAL PREDICATE IS THE CARRY POINT, SO "THE BODY ARRIVES" IS PINNED ON A SECOND
   FIXTURE.** The dispatch asks the arrival fixture to assert the BODY↔contact distance inside
   `carry` at the release. MEASURED: on the arrival fixture (contact AHEAD) the release fires
   because the CARRY POINT reached the contact — the law's own predicate — while the BODY was
   still 0.577703 m away; the body's own arrival is pinned on the ABEAM fixture instead
   (`bodyAtRelease` 0.048429 m, inside `carry` from tick 54). Both are asserted; neither is
   claimed as the other.
7. **THE WAITING TEST USES THE BODY'S PLAIN CARRY POINT.** `owner.pos + heading · carry` is
   the carry point in the shipped 0.3 / 0.85 form. When `carry === 0.85` and `c6Carry` is
   armed, the ACTUAL placement is C6's lagged-heading variant with its keyed wobble, so the
   test point and the resumption point differ by that offset. Stated, not hidden: the keeper's
   held ball rides the 0.3 branch (`gkHoldTimer > 0 || gkDistributing`), which is the C6
   variant's own excluded case, so the difference can only arise for a keeper who caught the
   ball on his FEET outside his area (`gkFeet` in `giveBall`).
8. **THE FIXTURES WALK THEIR OWN SCRATCH BAND TO FIND THE ENGINE'S OWN OUTCOME.** No roll is
   forced and no rng is stubbed anywhere in the suite: a scene that wants a CATCH walks the
   scratch seeds until the engine's own `rng.chance` produces one, and the PARRY scene is
   built by the shipped rule (`speed < 21` fails ⇒ the parry branch) rather than by a stub.
   This keeps every fixture a statement about the shipped code.

9. **⭐⭐ GK-T0c — THE CATCH BRANCH IS REORDERED, AND THAT IS A REAL MOVE OF A REAL LINE.**
   Ruling #400 item 3 authorises it; this declares what moved. `tryKeeperSave`'s catch write is
   no longer the FIRST statement of its branch — it is the LAST, after `match.pushEvent` and
   `match.giveBall(gk)` — because release (c) retires a caught contact at every gain and would
   otherwise wipe the contact the save had just written. ⭐ THE VALUE IS UNCHANGED AND THAT IS
   PINNED, NOT ARGUED: `giveBall` never writes `ball.pos` (it zeroes `ball.vel` and sets `z`,
   `vz`, `spin`), so the recorded contact still equals the ball's own position at the save tick
   — the M-GK.1 exactness pin now also reads `m.ball.pos` itself after the call and asserts the
   equality on the BALL. ⚠ THE ONE THING THAT DID CHANGE: `pushEvent` and `giveBall` now run
   BEFORE the write, so a future edit that made either of them read `gk.saveContact` would see
   the PREVIOUS value. Neither does today, and the anchors pin the order.
10. **⭐ THE LOSE-AND-REGAIN PIN ASSERTS THE OWNER DISTANCE, NOT THE PER-TICK DISPLACEMENT, ON
   THE RE-ATTACHMENT TICK.** The dispatch asks the ball's "displacement ≤ the carry-law bound"
   after the regain. MEASURED: on the fixture the tackle leaves the ball 2.5 m from the keeper,
   so the SHIPPED carry law's first act on the tick after the regain is to bring the ball to his
   carry point — a one-off **2.514983 m** re-attachment that has nothing to do with this seam
   (it is what the shipped placement does to any owned ball that is not already at the carry
   point). The pin therefore asserts the quantity that actually says "not snapped back": the
   ball is NOT at the pre-loss contact, and its distance from its OWNER is ≤ `carry`
   (**0.850000 m** measured, the `gkFeet` branch's length), and from the NEXT tick on the
   per-tick displacement is ≤ `topSpeed · DT`. Stated, not hidden.
11. **⭐ THE REGAIN IN THE FIXTURE IS HAND-BUILT; THE LOSS IS THE ENGINE'S.** §4's residual
   bullet gives the reason in full: at this head no engine path regains the ball inside the same
   `stepBall` (the owned branch returns after the tackle calls). The fixture is the verifier's
   V6 shape reproduced as closely as the engine allows — the loss by `tryTackles`, the regain by
   `m.giveBall(gk)` in the same inter-sweep window — and the doc says so wherever it is quoted.
12. **⭐ THE MUTANT TABLE'S WRONG-BODY ROW WAS RE-MEASURED AT THIS HEAD, NOT EDITED BY HAND.**
   Ruling #400 item 3(ii) corrects the doc's `10` to the verifier's observed `11` at GK-T0b's
   suite. GK-T0c's suite is two pins longer, so the row is re-run rather than re-typed — the
   table's counts below are the OBSERVED ones at this head, with GK-T0b's and the verifier's
   values named beside them.

## §GK-T0c DELTA — every changed `src` line against **006bf71** (ruling #400 items 3–4)

> Produced from `git diff 006bf71 -- src` at this head and read line by line. **ONE code line
> MOVES and ONE is ADDED; everything else in the diff is comment. Nothing else under `src/**`
> changes.** RECEIPT — `git diff 006bf71 --stat -- src`: `src/sim/Match.ts | 25 ++++----` and
> `src/sim/mechanics.ts | 14 ++++---`, 2 files, 32 insertions, 7 deletions, of which exactly
> three lines are non-comment (one deletion + two insertions, the moved line counting as both).
> ⚠ Line numbers are receipts AT THIS HEAD; the anchored strings in `tests/gkDiveBody.test.ts`
> are what holds them.

**`src/sim/mechanics.ts` — 1 line MOVED (the catch branch reordered), 0 added.**

1. `tryKeeperSave`, the catch branch (the write is now **l.2242**, the branch's last statement):
   ```diff
      if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {
   -    if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: true };
        match.pushEvent('save', defSide, `${gk.name} catches it`);
        match.giveBall(gk);
   +    if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: true };
      } else {
   ```
   ⛔ The line's BYTES are identical; only its position inside the branch changes. The PARRY
   write, the deflect angle, the rng draw, `lastTouch`, `kickCooldown` and both `pushEvent`
   texts are BYTE-UNCHANGED. The `saveContact` docblock above the split is re-written
   (comment-only) to say why the catch write is last.

**`src/sim/Match.ts` — 1 code line ADDED, 0 changed.**

2. NEW — release (c), inside `giveBall` (**l.3856**), immediately after the ownership gain (**l.3843**):
   ```diff
        const ball = this.ball;
        ball.owner = p;
   +    if (p.saveContact !== null && p.saveContact.caught) p.saveContact = null;
        ball.lastTouch = p;
   ```
   ⭐ AFTER the offside early-return ⇒ it runs on every SUCCESSFUL gain and on no dead ball.
   ⭐ Shut, the field is null on every body ⇒ the first conjunct short-circuits and NO
   assignment executes. A doc comment is added above it (comment-only).
3. **COMMENT-ONLY**: the ownership-sweep block's 118-character line (l.3458 at 006bf71) is
   re-flowed with its neighbours to fit the file's width, and the sweep's comment gains a short
   paragraph naming release (c) as the third release. ⛔ No executable line in that block moves;
   the longest line in the block is now 95 characters.

**⛔ NO OTHER `src` FILE.** `Player.ts`, `actionExecutor.ts`, `League.ts`, `Ball.ts` and
`src/game/a4World.ts` are BYTE-UNCHANGED against 006bf71. No new constant, no new flag read, no
probe, no renderer, no entry-layer mention.

## §GK-T0b DELTA — every changed `src` line against **c660531** (ruling #399 item 3(v))

> Produced from `git diff c660531 -- src` at GK-T0b's head and read line by line. Comment-only
> hunks are named as such; the CODE lines are quoted whole. **Five code lines change and one
> block is added. Nothing else under `src/**` moves.** ⚠ Line numbers below are RE-READ at
> GK-T0c's head (GK-T0c's added comment block pushed the `Match.ts` ones down); the anchored
> strings in `tests/gkDiveBody.test.ts` are what actually holds them.

**`src/sim/Player.ts` — 2 code lines.**

1. **l.136** the field's TYPE:
   ```diff
   -  saveContact: { x: number; y: number } | null = null;
   +  saveContact: { x: number; y: number; caught: boolean } | null = null;
   ```
2. **l.435** the integrator's clear, NARROWED to parries:
   ```diff
   -    if (this.saveContact !== null && this.saveAnimTimer === 0) this.saveContact = null;
   +    if (this.saveContact !== null && !this.saveContact.caught && this.saveAnimTimer === 0) this.saveContact = null;
   ```
   ⭐ The two RESET clears (`becomeSub`, `resetForKickoff`) are BYTE-UNCHANGED — both remain
   `if (this.saveContact !== null) this.saveContact = null;`, anchored as exactly two lines.
   The doc comment above the field is re-written (comment-only).

**`src/sim/mechanics.ts` — 1 line becomes 2, moved into the branches.**

3. `tryKeeperSave`, the ONE write above the split DELETED:
   ```diff
   -    if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y };
        if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {
   +      if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: true };   // l.2242 (moved after `giveBall` at GK-T0c)
          match.pushEvent('save', defSide, `${gk.name} catches it`);
          match.giveBall(gk);
        } else {
   +      if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: false };  // l.2244
   ```
   — each the FIRST statement of its branch.
   ⛔ The catch branch's `pushEvent` / `giveBall` and the parry branch's whole body (the deflect
   angle, the rng draw, `lastTouch`, `kickCooldown`, `pushEvent`) are BYTE-UNCHANGED, and both
   writes sit AFTER the branch's roll — no draw moves.

**`src/ai/actionExecutor.ts` — 1 code line (a 5-line `if` head becomes 1 line).**

4. the override's GATE (**l.757** at this head) — five lines become one:
   ```diff
   -  if (
   -    match.gkDiveBody && p.saveAnimTimer > 0 && p.saveContact !== null
   -    && (p.action.type === 'GoalkeeperSave' || p.action.type === 'GoalkeeperPosition'
   -      || p.action.type === 'GoalkeeperRush')
   -  ) {
   +  if (match.gkDiveBody && p.saveContact !== null) {
   ```
   ⛔ The override's BODY — the `GoalkeeperRush`-raw / `clampToBox` choice, `speedF = 1`,
   `p.faceTarget = ball.pos;` — is BYTE-UNCHANGED, and so is its POSITION (immediately after the
   switch, before the free-kick wall block). The comment above it is re-written (comment-only).

**`src/sim/Match.ts` — 1 code line + 1 new block.**

5. the waiting branch's GATE conjunct (**l.4443**):
   ```diff
   -        && ball.owner.saveContact !== null && ball.owner.saveAnimTimer > 0
   +        && ball.owner.saveContact !== null && ball.owner.saveContact.caught
   ```
   ⛔ The branch's arithmetic (`cx` / `cy`, the `> carry * carry` arrival test, the `= null`
   consumption, the `heldAtHands` placement, the `else if (this.c6Carry …)` chain) is
   BYTE-UNCHANGED.
6. NEW — the ownership-loss sweep, **l.3471–3479**, immediately above
   `if (this.phase === 'restart') this.stepRestart(dt); else this.stepBall(dt);`:
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
   ⭐ Shut, this is ONE boolean test: no loop, no assignment. The two `MatchConfig` /
   `Match` doc comments for `gkDiveBody` are re-written (comment-only).

**`src/sim/League.ts` — UNCHANGED.** The `matchFlags` key union still carries `'gkDiveBody'`
and nothing else moved.

**⛔ NO OTHER `src` FILE.** `src/game/a4World.ts` contains neither `gkDiveBody` nor
`saveContact` (pinned). No renderer, no probe, no constant file, no `Ball.ts`.

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
