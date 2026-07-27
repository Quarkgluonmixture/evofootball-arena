# C5 Phase 0 — Code map: where the "whether to pass" seat actually is

Status: **READ-ONLY REPORT-BACK.** Produced under **commander ruling #26.4**
(C-track template: Phase-0 code-map with `file:line` evidence first). **Zero
code changed, zero probes run.** The commander drafts the C5 design contract on
this map; nothing here proposes a mechanic.

Date: 2026-07-27

---

## 0. The one-sentence finding

**There is no "whether" seat.** The carrier's decision is a single-shot argmax
over *ways to get rid of the ball or run with it*, taken fresh every 0.15 s,
and **the only time-dependent term anywhere in it penalises waiting**
(`PlayerBrain.ts:176`, applied at `606` against holding and at `650` for
driving). Waiting is not a low-scoring option — it is **not an option**, and
the clock actively argues against it.

Everything below is the detail behind that sentence, plus the three adjacent
seats the ruling asked me to locate (HOLD, wind-up, shield/glue).

---

## 1. The WHETHER seat: `decideCarrier`

**`src/ai/PlayerBrain.ts:152` — `const cands: UtilityScore[] = []`** is the
whole competition. Everything the man on the ball can do is pushed into that
one array and sorted once:

| line | candidate | gate |
| --- | --- | --- |
| `243`, `262` | `Shoot` (open play, direct free kick) | `dGoal < 30`, `kickCooldown <= 0` (`196`) |
| `413` | `Pass` | `kickCooldown <= 0` (`279`) |
| `420` | `LoftedPass` | `d > 24 && !layingOff` (`392`) |
| `497` | `ThroughBall` | `kickCooldown <= 0` (`436`) |
| `545` | `Cross` | wide/advanced or corner (`511`) |
| `581–585` | `Pass` (the corner-arc cutback) | `team.arriver !== null` (`563`) |
| **`608`** | **`HoldUp`** | **role `ST` or corner-hold, `backToGoal > 0.45`, `pressure > 0.2` (`599–601`)** |
| `651` | `Dribble` (drive) | not GK (`617`) |
| `671` | `Dribble` (escape carry) | `esc && !openRun` (`670`) |
| `740`, `764` | `ThrowOut`, punt | GK distributing (`697`) |
| `782` | `ClearBall` | `localX < -18` (`775`) |

**The selection:** `cands.sort(...)` at **`785`**, `const top = cands[0]` at
**`791`**. One argmax, no memory of the previous decision, no option that means
"none of these yet".

**The default is to carry**, twice over: `787–789` (empty candidate list ⇒
`Dribble`) and `961–962` (the `switch`'s `default` ⇒ `Dribble`). So "not
passing" resolves to *moving with the ball*, never to *standing with it*.

### 1.1 The cadence

`Match.ts:717` calls `decidePlayer` and `718` re-arms
`p.decisionTimer = AI_INTERVAL` = **0.15 s** (`constants.ts:324`). The carrier
therefore re-runs this whole argmax **~6–7 times a second**, each time from
scratch. Two overrides push it faster after a reception (§3).

---

## 2. Where a HOLD would live — and the one that already exists

**`HoldUp` is already an `ActionType`** (`types.ts:109`), already scored
(`PlayerBrain.ts:608`), already executed (`actionExecutor.ts:387–405`), and
already changes the *next* decision (`281`: `layingOff`; `326`: a short
lay-off inside 12 m gets `×1.3`; `392`: the lofted ball is suppressed).

So the seat is not empty — **it is narrow**, and the narrowness is where a C5
contract has its opening:

- **Who may hold** — `599`: `p.role === 'ST'` (a hard role gate, which the
  substrate-first doctrine would normally forbid) **or** `cornerHold`
  (`597–598`: `mentality.holding > 0.5` and deep in the corner).
- **When** — `600`: only with your **back to goal** (`backToGoal > 0.45`) and
  only **under pressure** (`pressure > 0.2`). A free man facing forward cannot
  hold at all.
- **What it does** — `actionExecutor.ts:398–403`: steer 1.4 m directly away
  from the nearest opponent. It is a *drift*, not a shield: no body
  interposition, no ball-side geometry.
- **What it is for** — the pivot lay-off. It exists to set up a bounce pass,
  not to buy time.

**What is absent at this seat, stated as absence rather than as a proposal:**
nothing in `cands` scores *the future*. There is no term for a run that is
maturing, for pressure that could be drawn, for a scan that has not happened
yet, or for an option that will exist in half a second. Every score is computed
from the current tick's geometry only.

---

## 3. The time dimension today: three clocks, and none of them value waiting

| clock | where | what it does |
| --- | --- | --- |
| **`touchTimer`** | set `Match.ts:1142` = `(recollect ? 0.2 : 0.32) + (1 − dribbling)·0.08`; decremented `Player.ts:343` | blocks the next **dribble push** (`Match.ts:1249`). Physical, not cognitive |
| **`decisionTimer`** | `Match.ts:1161` = `max(…, inShootingRange ? 0.08 : recollect ? 0.18 : 0.3)`; re-armed `Match.ts:718` | when the brain may think again |
| **`kickCooldown`** | set `Match.ts:1077` = `KICK_COOLDOWN` **0.45 s** (`constants.ts:264`) | the crude 后摇: gates `Shoot`/`Pass`/`Cross`/… back into `cands` |

⭐ **And the only clock that touches VALUE runs the wrong way.**
`PlayerBrain.ts:176`:

```ts
const stagnation = clamp01((team.staleTime - 3) / 5);   // 0 at 3s, 1 at 8s
```

It is applied **against** holding — `606`: `sH *= (1 - stagnation * 0.5)` — and
**for** driving — `650`: `sD *= 1 + stagnation * 0.28` — plus a forward tilt on
every pass (`297–298`) and a risk-gate loosening (`456`). The comment at `592`
says it outright: *"Patience isn't free: stagnation drains it."*

So the substrate already has a possession clock, and **it is wired as a
penalty on time**. There is no counterpart term anywhere that pays for it.

---

## 4. The wind-up seat (C7): decision and contact are the same statement

**The kick fires inside the decision function**, on the line after the action
is assigned — `PlayerBrain.ts:911–956`:

```
911  match.performCutback(...)      941  match.performKeeperThrow(...)
914  match.performPass(...)         945  match.performThroughBall(...)
922  match.performLoftedPass(...)   951/952  performFreeKick / performShot
931  match.performCross(...)        956  match.performClear(...)
```

`actionExecutor.ts:380–386` confirms it from the other side: *"Kick already
happened at decision time — brief follow-through."*

**So the gap between commit and contact is exactly zero ticks**, and there is
no state in which a kick is *committed but not yet struck*. That is the seat
C7 asks for, and it is currently a hole rather than a value: nothing can close
the man down in it, nothing can read it, nothing can cancel it.

**The accuracy half of the body-orientation term is already there and is
already ability-scaled** — `mechanics.ts:77` `kickMisalignment`, `82`
`orientationNoiseMul`, `87` `orientationPowerMul`, consumed at
`mechanics.ts:362–369` and `384–392`. What does not exist is the **time** half:
being twisted costs pace and accuracy today, but it costs no *preparation*.

`CONTACT_COMMIT_TIME` (`constants.ts:248`, 0.08 s) exists but belongs to the
tackle contact path (`Match.ts:2341`), not to kicking.

---

## 5. Shield and glue (C6 adjacency, mapped because C5 sits on it)

- **Glue** — `Match.ts:1276–1283`: while owned, `ball.pos = owner.pos +
  heading·0.85` and `ball.vel = owner.vel`, every tick. The ball has no
  independent existence between touches.
- **The one honest escape** — `Match.ts:1244–1262`: a discrete push
  (`performDribbleTouch`) fires only when the action is `Dribble`, speed
  > 2.5 m/s, `touchTimer <= 0`, **and** the nearest opponent is beyond
  `TOUCH_CONTROL_DIST` = 4.2 m (`constants.ts:297`). Exactly the three regimes
  the C6 row already names — turning, walking, and under pressure — stay glued.
- **Shielding exists only as an attribute term**, never as a body position:
  `mechanics.ts:1771–1775` (strength shields the standing challenge) and
  `1625` (reaching through a shielding body on the slide). Nothing reads
  *where* the carrier's body is relative to ball and defender.

The consequence for C5: **a "hold" today cannot be attacked differently from a
"carry"**, because the ball is in the same place either way and the defender's
resolution does not know which is happening.

---

## 6. One-touch vs control: the price exists, the choice does not

This is C5's stated subject, and it is half-built already.

- **The trigger is pressure, not preference** — `Match.ts:1195–1203`: an
  intended receiver with the nearest opponent inside `3.0 + tempo·1.5` gets
  `decisionTimer = 0.07` and `firstTouchWindow = 0.28`. Nobody chose that.
- **The price is real and technique-scaled** — `mechanics.ts:262`
  `oneTouchMul = 1.15 + (1 − dribbling)·0.9`, multiplied into the aim noise of
  passes (`390`), through balls, crosses (`580`), shots (`529`, `534`) and
  clears.
- **The alternative is priced too** — `mechanics.ts:109` `touchFailChance`
  (speed, pressure, misalign, technique, positioning) is the M3 touch≠control
  surface, and `attemptFirstTouch` (`151`) rolls it on every controlled
  reception.
- **E1b's dormant heavy curve is still wired** — `TOUCH_SPEED_COST.heavy`
  (`mechanics.ts:106`) reached through `match.edsTouchCost`
  (`mechanics.ts:174`, `Match.ts:198/342/525`), default OFF. Ruling #12.3
  re-seats it here.

**So both branches of C5's tradeoff already have measured costs. What is
missing is the branch point**: no `cands` entry ever reads
`p.firstTouchWindow`, and nothing compares "play it now, noisier" against
"take a touch, slower".

---

## 7. What a C5 contract has to decide (questions, not answers)

Stated as open questions because #26.4 asked for a map and the design is the
commander's:

1. **Does waiting become a candidate, or a modifier?** A `HoldBall` entry in
   `cands` competes on the same axis as a pass; alternatively every kick option
   gains a "not yet" discount. The first is visible in the debug panel and in
   `UtilityScore.why`; the second is cheaper but invisible.
2. **What pays for it?** Nothing in the current score is forward-looking, so
   whatever prices waiting is new information the carrier does not have today —
   and per VISION §1 it must be a *measured* payoff, not a bonus. The banked
   value tables are candidates, but every one of them is population-bound
   (#26.5) and was censused in the world that has no hold.
3. **Does the stagnation term stay as-is?** It is the substrate's existing
   opinion that time is bad. A hold that must out-score a penalty growing to
   1.0 over eight seconds is a hold with a five-second ceiling; that may be
   correct, but it should be chosen, not inherited.
4. **Does `HoldUp` get widened or joined?** Widening it (drop the ST gate, drop
   `backToGoal`, drop the pressure floor) reuses a scored, executed, panel-
   visible action. Adding a second action beside it keeps the pivot lay-off
   intact and separates "shield with your back to goal" from "stand and look
   up" — which are different in football and currently the same code path.
5. **Does C7's wind-up land in the same contract?** #26.3 says the ball-foot
   time seat is one seat. Mechanically they touch the same lines: a wind-up is
   a *delay between `PlayerBrain.ts:914` and `performPass`*, and a hold is a
   *decision not to reach line 914 yet*. One contract can hold both; the
   watchability blast radius differs sharply (C7 shifts **every** pass and shot
   in the game, C5 shifts only carriers who choose to wait).
6. **What can be attacked during a hold?** §5 says: nothing, today. A hold that
   is not attackable is a free option, and a free option will be taken always —
   the same shape as the legacy `×1.3` subsidy E5h just quantified.

---

## 8. What this report did not do

- No code changed, no test added, no probe run, no flag touched.
- It does not price anything, propose a mechanic, or rank the questions in §7.
- C4's Phase-0 map (header / cross / box-arrival resolution) is the next queued
  item per #26.4 and is **not** started.
- F9 (kick animation, render-only) is untouched and remains available at any
  time per #26.4.
