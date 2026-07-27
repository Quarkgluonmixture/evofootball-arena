# C6 Phase 0 — Code map: the ball-foot interface, and where the glue actually is

Status: **READ-ONLY REPORT-BACK.** Produced as authorised GAP WORK under
**commander ruling #29.4** (C-track template: Phase-0 code map with `file:line`
evidence before any contract). **Zero code changed, zero probes run, no flag
touched.** Nothing here proposes a mechanic.

Date: 2026-07-27

---

## 0. The one-sentence finding

**The de-glue already exists and is well built — it is gated to one regime, and
the three regimes it excludes are excluded by three *different* conditions in
one boolean, only one of which is about close control.** The user's "以自己为
圆心连球带人一起转" is the sharpest of the three: a turn costs TIME and zero
TOUCHES, and the ball is unreachable throughout it.

---

## 1. The interface: one branch, and everything hangs off it

`Match.stepBall` (`Match.ts:1296`) opens with `if (ball.owner)`. Inside it,
exactly one path can free the ball, and everything else is the magnet:

```ts
// Match.ts:1301-1320
if (this.phase === 'playing'
    && o.role !== 'GK'
    && o.action.type === 'Dribble'          // (a) ACTION LABEL
    && o.touchTimer <= 0
    && o.gkHoldTimer <= 0
    && o.vel·o.vel > 2.5 * 2.5) {           // (b) SPEED
  ...
  if (nearOpp > TOUCH_CONTROL_DIST) {       // (c) SPACE (4.2 m)
    mech.performDribbleTouch(this, o);
    return;                                  // the ball is FREE
  }
}
// otherwise: the glue
ball.pos.x = owner.pos.x + owner.heading.x * carry;   // 1334-1337, carry = 0.85
ball.pos.y = owner.pos.y + owner.heading.y * carry;
ball.vel.x = owner.vel.x;
ball.vel.y = owner.vel.y;
```

⭐ **The glue is not a fallback with its own physics — it is an assignment.**
The ball has no independent position while owned: it is a rigid offset of
0.85 m along `heading`, moving at exactly the owner's velocity. Every regime
below inherits that, and it is why nothing can be *between* the foot and the
ball.

**Three separate conditions, three separate stories** — and the C6 row's
"three regimes" map onto them one-to-one:

| gate | value | what it excludes | is it about close control? |
| --- | --- | --- | --- |
| (b) speed | `v > 2.5 m/s` | the SLOW carry | **partly** — walking pace ≈ close control is a defensible modelling call |
| (c) space | `nearOpp > 4.2 m` (`TOUCH_CONTROL_DIST`) | the PRESSURED carry | **inverted** — real football charges MOST here |
| (a) action label | `action.type === 'Dribble'` | the TURN, and every non-Dribble action | **no** — this one is bookkeeping, see §2 |

`TOUCH_CONTROL_DIST = 4.2` (`constants.ts:304`) and its own comment says the
quiet part: *"under pressure … the carry stays glued"*.

---

## 2. ⭐⭐ The turn: the sharpest gap, and it is not where the row says to look

The C6 row frames turning as a third *regime*. In the code it is not a regime
at all — **it is the (a) gate plus the heading integrator**, and the two
combine into something stronger than "the push doesn't fire".

**The heading is rate-capped and the ball rides it rigidly.** `Player.ts:17`
`TURN_RATE = 6.5` rad/s, integrated at `287-321`: the heading sweeps toward the
movement direction (or `faceTarget`) at most `TURN_RATE·dt` per step. A 180°
pivot therefore takes `π / 6.5 ≈ 0.48 s` — **29 ticks**. And through all 29,
`ball.pos = owner.pos + heading·0.85` (`1334`): the ball sweeps a 0.85 m arc
around the body, welded to the shoulders.

⭐ **So the user's description is literally the implementation.** "以自己为圆心
连球带人一起转" is not an approximation of what the engine does — it is the
assignment statement at `Match.ts:1334`.

**Three consequences, all measurable and none currently priced:**

1. **A turn costs zero touches.** The push path needs `action.type === 'Dribble'`
   AND `v > 2.5`; a pivoting carrier is usually slow and often labelled
   something else, so `performDribbleTouch` never runs. Real football's most
   expensive close-control moment is free here.
2. **The ball cannot be attacked mid-turn — but the MAN can.** `tryTackles`
   (`mechanics.ts:1726`) searches on `dist(o.pos, ball.pos) < 1.15`, and since
   the ball is 0.85 m off the body, the tackle radius follows the sweep. So the
   turn is not literally untouchable; what is missing is that **the ball's
   exposure does not change with the turn** — a body turning away from a
   defender presents the ball identically to one turning into him.
3. **Time passes but nothing else does.** The 0.48 s is real, and defenders do
   close during it. That is the one honest thing in the current model, and it
   is the reason a naive fix is dangerous: *the turn is already costed in
   seconds; adding a touch cost on top double-charges it.*

⚠️ Registered because it constrains any C6 contract: **`heading` is load-bearing
far beyond the ball.** The renderer, `kickMisalignment` (`mechanics.ts:77`),
`backToGoal`, the F9 animation work and the whole body-orientation family all
read it. C6 must not "fix" turning by touching `TURN_RATE`.

---

## 3. The push, when it does fire — the part that is already right

`performDribbleTouch` (`mechanics.ts:1403-1462`) is the model C6 should extend
rather than replace:

* **Space prices the touch, continuously.** A forward ~70° cone measures
  `aheadD` (`1410-1424`, keeper rush envelope respected at `1419`);
  `open = clamp(aheadD − 2, 0, 9)` and
  `push = (0.9 + open·0.32) · (1.05 − dribbling·0.15)` (`1428-1429`,
  `constants.ts:314/318`). **一步一带 and 爆趟 are the two ends of one
  continuous variable** — exactly VISION §1's "not eFootball's discrete
  1/3/5-step classes", already honoured.
* **Technique prices accuracy too**, not just distance: direction noise
  `gaussian()·0.07·(1.35 − dribbling·0.7)` (`1443`).
* **Two learned corrections are baked in and must survive any rewrite**: the
  touchline guard halves a knock that would roll out (`1434-1439`, 12.9% of
  pushes died at the first cut), and the ball is knocked along **travel, not
  facing** (`1445-1452`) — aiming at the rate-capped heading sent balls flying
  off on a line the carrier was turning away from, a play report the comment
  quotes verbatim.
* **The regather is priced by the push**: `kickCooldown = 0.26 + push·0.04`
  (`1460`, `constants.ts:320/321`) and `dribbleTouch = {gid, until: +1.6 s}`
  (`1461`).

**The loose window is a real, already-wired object.** `dribbleTouch` makes the
ball `'looseBall'` for possession purposes (`Match.ts:1065`), gives the knocker
a 0.45× recapture bonus (`mechanics.ts:180`), suppresses one TeamBrain path
(`TeamBrain.ts:313`), keeps the brain committed to the chase
(`PlayerBrain.ts:59-61`), and is consumed on recollection (`Match.ts:1171`).

⭐ **This matters for scoping**: the "ball exists between touches" substrate the
C5 row wants for hold-draw-release **already exists** — for one regime. C6 is
extending its domain, not inventing it.

---

## 4. What can attack a glued ball today

`tryTackles` (`mechanics.ts:1726` onward), and its carrier-protection terms are
the ones T0R already mapped:

```text
p = 0.25 + markingAggression·0.20 + tackler.defending·0.34
        − dribbleBias·0.08
        − owner.dribbling·0.18          ← dominant carrier term
        − owner.strength·0.10
        − owner.pace · drive · 0.16     ← drive = |v|/9, so ~0 while turning
  + 0.06 if pressing · +0.04 enforcer
  + 0.12 if (helpClose && drive < 0.45)  ← stopped and doubled = dead meat
  clamped to [0.06, 0.70]
```

Two facts C6 has to design around:

* **The pace term is a SPACE payoff and it switches off at low speed**
  (`1794`, comment at `1758-1768`). A slow or turning carrier already loses the
  largest protective term — the world does not treat slow carrying as free.
* **`shielding` as body position does not exist.** The only "shield" is
  `strength·0.10` inside this formula (`1785`) — an attribute, not a geometry.
  Which is the same finding C5's map recorded from the other side: **a hold
  cannot be attacked differently from a carry, because in both the ball sits at
  `heading·0.85` and the tackle keys on the BALL** (`1726`).

⭐ The consequence for C6 v1: **the attack surface for a de-glued ball already
exists and is ball-keyed**, so moving the ball relative to the body
automatically changes who can reach it. C6 does not need to build an attack —
the same conclusion C5 T0 reached at its own seat, and the reason T0's shield
was a body position rather than a new mechanic.

---

## 5. The regimes, sized

| regime | gate that excludes it | what a de-glue would have to price |
| --- | --- | --- |
| **SLOW carry** (`v ≤ 2.5`) | (b) | whether walking-pace close control should cost anything at all — the current model says no, and that is defensible |
| **PRESSURED carry** (`nearOpp ≤ 4.2 m`) | (c) | the biggest inversion: real football charges most here, the engine charges nothing. But this is also where loose balls become scrambles — §6's guard |
| **TURN** | (a) + the heading integrator | already costs 0.48 s for 180°; a touch cost on top **double-charges** unless the time cost is re-priced with it |
| **RESTART / keeper hands** | `gkHoldTimer`, `touchTimer` | out of scope; the keeper path (`1348-1372`) is a separate calm-reset design and should stay |

---

## 6. The watchability guard, stated in numbers

The C6 row registers "naive de-gluing = more loose balls = the user's #1 hate"
up front. The map can now size it: **the pressured regime is by far the largest
of the three** (crossing the 4.2 m threshold is common; exceeding 2.5 m/s while
also having 4.2 m of space is the rare open-field case the push was built for),
so pricing (c) is the change with the biggest blast radius on scramble counts.

The banked evidence points the same way from the other direction: **C1-B**
made ground control honest and the §2 band broke on goals (−15.4%) and long
balls (+28.2%) — *"making ground control honest re-routes the whole game while
the evaluator is speed-blind"*. C6 prices the same interface from the carry
side, and the C5 T1 census now adds the reason it matters: **the median
ownership spell is 0.33 s**, so a per-touch cost lands on an interface almost
nobody currently spends time on.

---

## 7. Open questions for the commander (questions, not answers)

1. **Which regime is C6 v1?** Pressured carry is the honest inversion and the
   biggest blast radius; the turn is the user's own words and the smallest
   scope; slow carry is arguably correct as-is.
2. **Does the turn get a TOUCH cost at all, given it already costs 0.48 s?**
   Or is the honest v1 that a turn changes the ball's EXPOSURE (which side of
   the body it sits on) rather than its cost — the C5 T0 shield move applied to
   a moving body?
3. **Can `carry = 0.85` become a variable before anything else changes?** It is
   the single number that makes the ball a rigid offset; making it a function
   of speed/pressure/technique is a smaller, more measurable first step than
   extending `performDribbleTouch`'s domain.
4. **What is the loose-ball budget?** The §2 band and the #20 watchability
   battery both bound it, but no stage has pre-registered a scramble ceiling
   for a carry change. C1-B's break is the reference.
5. **Does C6 wait for the C5 unpark condition, or feed it?** #29.3 names C6's
   shield/protective carry as one of the four substrate changes that could move
   the held-tick exchange rate — so C6 landing is a trigger for the C5
   re-census, which is an argument for sequencing C6 before any C5 revival.
6. **Is `dribbleTouch`'s 1.6 s window right for a pressured regime?** It was
   tuned for open-field knocks; a 1.6 s loose window under pressure is a
   different object and would need its own number.

---

## 8. What this report did not do

* No code changed, no test added, no probe run, no flag touched, no constant
  moved.
* It does not rank §7, propose a mechanic, or price anything.
* It does not touch C7's wind-up seat (`PlayerBrain.ts:911-956`, mapped in
  `C5-PHASE0-CODE-MAP.md`) beyond noting that `heading` is shared between them.
* C4's chain remains the one experiment in flight (#29.4); this is gap work.
