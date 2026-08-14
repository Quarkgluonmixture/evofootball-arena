# CB — THE FRONTEND VISIBILITY RUNG (M-CB.3: 让人看到)

> Contract `CB-CARRY-BEAT-CONTRACT.md` §2 M-CB.3 + §3, dispatched by ruling **#269.4**.
> The sixth entry of the a4-entry family (#155/#156 → #168 → #184.2 → #211.3 → here).
> Layer 1 (CB-T0) and layer 2 (CB-T2) are banked; this rung adds NO mechanism. It makes
> what those layers already do VISIBLE, and puts the world behind a play-test switch.

## §-1 THE CRITERION THIS RUNG ANSWERS TO (contract §-1, the user verbatim)

「我们这个游戏最牛的地方不在于跟现实的过人动作一样，而是他能自己长出来配合，技巧，博弈，
对抗，战术，并且能让我们真的看到。」

⇒ **THE RENDERING SHOWS WHAT HAPPENED. IT NEVER DECORATES IT.** Concretely, the two rules this
whole rung is built to keep:

* **Every path on screen is a path the ball actually travelled.** The knock's trail is made of
  positions the ball OCCUPIED, sampled frame by frame. Nothing is predicted from an aim, nothing
  is extrapolated, nothing is tweened. If the defender wins the race, the trail stops where the
  ball stopped.
* **Every duration on screen is a duration the engine wrote.** The beaten defender's mark lasts
  exactly his own `tackleCooldown` — in the armed world, the physics-derived recovery interval
  CB-T0 computes from his own speed, his own turn rate and his own acceleration. There is no
  duration constant anywhere in the render layer, and the stage doc's presentation table below
  is the exhaustive list of what IS a constant (colours, radii, widths, opacities, one sampling
  step, one linger).

## §AFFORDANCES — what the user will SEE, and what each thing is made of

### 1. THE TOUCH-PAST: the knock moment and the race

When a carrier knocks the ball past a man, three things appear together:

* the ball itself, moving — already the engine's, unchanged;
* **a ground ring at the release point** — where the ball was on the first frame after it left
  his feet;
* **a tapered ribbon along the ball's own past positions**, from that release point to wherever
  the ball is now. It grows as the ball rolls, it stops when someone gets the ball, and it
  lingers briefly so the eye can read the whole run before it goes.

The episode is opened by the engine's own monotone counter `Match.cbLedger.touchPasts`, which
rises only inside `performTouchPast`. It is closed by the engine's own resolution — the ball
being owned again, or `Match.dribbleTouch` no longer calling this loose ball the knocker's.

### 2. THE BEATEN DEFENDER: his own recovery, on the grass under him

A body inside his own post-challenge recovery carries a ground ring that **fades in lockstep
with his own clock**: full at the instant of the miss, gone the tick he can challenge again.
Its colour names which leg of the physics-derived interval is running:

| colour | what is running | the engine state |
| --- | --- | --- |
| orange | the **brake** leg — his own momentum is still carrying him past | `stunTimer > 0` (CB-T0 writes `rec.brake` here) |
| red | the **turn + close** legs — he is getting back | `stunTimer === 0`, `tackleCooldown > 0` (CB-T0 wrote `rec.total`) |

⭐ **WHO GETS THE RING.** A body inside `tackleCooldown` who is NOT the ball's last toucher.
A WON challenge makes its winner the last toucher (`ball.lastTouch = tackler`, the engine's own
line in `tryTackles`), so winners are excluded and what remains is the man who challenged and
did not come away with it. Both halves of the test are read off the match; the renderer adds no
knowledge of its own. (Its honest limit is §DOUBTS 2.)

### 3. THE COMMITMENT MISS

Not a separate affordance, deliberately. An overcommitted lunge already carries its own real
motion — the overrun IS the physics — and the ring in (2) appears at exactly the moment of that
miss, in the orange (still-being-carried-past) colour, for exactly as long as his own brake leg
runs. Adding a second marker for the same event would be decoration.

## §TRACE — every rendered quantity → the sim state it reads (the NAMED deliverable)

Nothing is drawn that is not in this table. "Derived" rows show the arithmetic in full.

| # | what is drawn | read from | derivation |
| --- | --- | --- | --- |
| 1 | knock episode exists | `Match.cbLedger.touchPasts` | a rise between two frames ⇒ a knock fired (the counter only rises in `performTouchPast`) |
| 2 | the knocker's identity | `Match.dribbleTouch.gid` | verbatim |
| 3 | the release point (x, z) | `Match.ball.pos` | the ball's own position on the first frame after the release |
| 4 | the knock trail's points | `Match.ball.pos`, sampled per frame | verbatim positions; a point is appended only if the ball moved ≥ `CB_TRAIL_MIN_STEP_M` since the last one |
| 5 | the trail's direction (ribbon offset) | rows 4 | the unit vector between two consecutive REAL samples |
| 6 | the race is still on | `Match.ball.owner`, `Match.dribbleTouch` | `owner === null && dribbleTouch.gid === knocker && t ≤ dribbleTouch.until` |
| 7 | the trail's fade after resolution | `Match.simTime` | `1 − (t − t_resolved) / CB_KNOCK_LINGER_S` |
| 8 | a body is marked | `Player.tackleCooldown`, `Ball.lastTouch` | `tackleCooldown > 0 && lastTouch !== him` |
| 9 | the ring's position | `Player.pos` | verbatim |
| 10 | the ring's opacity | `Player.tackleCooldown` | `remain ÷ peak`, where `peak` is the value the engine wrote at the miss — recovered as the RISING EDGE of his own timer (the timer only counts down inside one interval, so the largest value seen since it started IS what was written) |
| 11 | the ring's colour | `Player.stunTimer` | `> 0` ⇒ the brake leg; else the turn+close legs |
| 12 | the whole layer exists at all | `Match.cbTouchPast` / `cbCommitPhysics` / `cbChoiceSeat` | the doors — false in every production match |

**NOT DRAWN, on purpose**: the aim direction (it is consumed inside the engine and would be a
PREDICTION on screen — §DOUBTS 1), the compass of unchosen candidates (a pricing internal, not
a world event), the χ commitment factor (a number, not a thing that happens), the ledger totals
(bookkeeping — the play-test asks the eye, not the counter).

## §PRESENTATION — every styling constant, declared (the NAMED deliverable)

⭐ **NONE of these is a world quantity.** No duration of any on-screen thing is set here except
the post-resolution linger, which governs only how long the eye keeps looking at a path the ball
has already finished travelling.

| constant | value | where | what it governs | why it is presentation |
| --- | --- | --- | --- | --- |
| `CB_TRAIL_MAX_POINTS` | 96 | `cbVisibility.ts` | trail buffer capacity | a memory bound; the path is unaffected below it |
| `CB_TRAIL_MIN_STEP_M` | 0.2 m | `cbVisibility.ts` | minimum travel before another point is recorded | SAMPLING density — every recorded point is still a real position |
| `CB_KNOCK_LINGER_S` | 0.9 s | `cbVisibility.ts` | how long a resolved knock's trail stays visible | the eye's dwell time, not the race's length (the race's length is row 6 above) |
| `Y` | 0.09 m | `CbLayer.ts` | draw height above the grass | above `Overlays3D`'s 0.08 so the two never z-fight |
| `KNOCK_COLOR` | `0xfacc15` | `CbLayer.ts` / `MatchRenderer.ts` | the knock ribbon + release ring | colour |
| `CARRY_THROUGH_COLOR` | `0xfb923c` | both | a body still being carried past | colour |
| `BEATEN_COLOR` | `0xef4444` | both | a body turning and closing | colour |
| `TRAIL_HALF_W` | 0.13 m | `CbLayer.ts` | ribbon half-width | a ribbon, not a `THREE.Line`, because WebGL caps `linewidth` at 1 (the `BallModel` F4 lesson — a one-pixel hair is invisible on a phone) |
| `TRAIL_OPACITY` | 0.6 | `CbLayer.ts` | peak ribbon opacity | colour |
| `ORIGIN_R0/R1` | 0.38 / 0.62 m | `CbLayer.ts` | release-ring radii | size |
| `RING_R0/R1` | 0.85 / 1.1 m | `CbLayer.ts` | beaten-ring radii | size (just outside a body) |
| `RING_OPACITY` | 0.85 | `CbLayer.ts` | peak ring opacity at the miss | colour |
| `RING_POOL` | 12 | `CbLayer.ts` | pre-allocated rings | the whole pitch, so no mark is ever dropped |
| `TRAIL_N` | 96 | `CbLayer.ts` | ribbon vertex capacity | mirrors `CB_TRAIL_MAX_POINTS` |
| `CB_KNOCK_ALPHA` / `CB_RING_ALPHA` | 0.75 / 0.9 | `MatchRenderer.ts` | the 2D view's opacities | colour |
| `CB_ORIGIN_PX` / `CB_RING_PX` | 5 / 10 px | `MatchRenderer.ts` | the 2D view's radii (≈0.5 m / 1.0 m at `SCALE = 10`) | size, in the plan view's own units |

**COST** (the user plays on a phone). Everything is allocated once: one ribbon buffer
(96 × 2 verts), one release ring, a pool of 12 rings with their own materials, one
`Float32Array(192)` trail and one `Map` keyed by gid. A frame does bounded arithmetic over ≤ 12
bodies, appends at most one trail point, and writes into buffers it already owns — **no
per-frame allocation in either view**. With the entry off the tracker is never even called: the
render state carries no `cb` field, so the 3D layer takes an early return and the 2D `Graphics`
stays empty and invisible.

## §ARMING — the play world, limb by limb (re-derived, never inherited)

The armed world is **the CB-T2 battery's `'both'` arm**, made watchable — the arm every headline
in `CB-T2-CHOICE-SEAT.md` §RESULT was measured on.

| # | limb | value | source |
| --- | --- | --- | --- |
| 1 | substrate flags | `a4MatchFlags(3)` — **CALLED**, not copied | the probe's own `...a4MatchFlags(3),` line |
| 2 | door (a) | `cbCommitPhysics` = true | CB-T0 §SEAM; the probe's `armConfig('both')` |
| 3 | door (b) | `cbTouchPast` = true | CB-T0 §SEAM |
| 4 | the seat | `cbChoiceSeat` = true | CB-T2 §SEAM |
| 5 | the style gene | `cbCarryProneness` = **1.0**, BOTH teams | the probe's `DOSE = 1` |
| 6 | the eye | **null** — no `stationEye`, no whisper, no discipline family | the probe never armed one |
| 7 | evolution opt-ins | **OFF** (`evolveCarryChoice` untouched, unnamed by the entry module) | a fixed armed world mutates nothing (#165.2.ii) |
| 8 | scope | the **WATCHED** match only (E4 semantics) — `League.matchFlags` is not serialized and the dose is written onto the watched match's own genome views | #156/#168 precedent |

⭐ **THE DOSE IS A DECLARED PRESENTATION CHOICE (#269.4), not a world-model claim.** 1.0 is the
only dose the arc has measured, which is why it is the play form; it is the "value a knock at
exactly what the delivery table says it is worth" end of the gene's range. Whether any dose
belongs in a shipped world is (a) the user's eyes' at this gate and (b) the style-evolution
arc's afterwards. The badge names the dose for exactly this reason.

⚠ **THE SAVE IS NOT TOUCHED — a deliberate deviation from the A4/MT arming idiom.** Those worlds
write real, always-present, always-serialized gene keys onto all three genome views including
`info.genome`, which IS the league franchise's own object. `cbCarryProneness` is BORN ABSENT and
outside `GENE_KEYS`: writing it there would put a dormant gene into the user's save and hand
`crossoverGenomes` a value to carry (it copies parent A's present key even with the opt-in shut
— CB-T2 §GENE's Lamarck concern). So the dose is written onto **match-local genome views** —
the engine's own de-aliasing form, taken verbatim from `Match`'s `dvLearn` block — and dies with
the match. Test-enforced: the league serializes without the key.

## §HOW-TO-SEE — the demo recipe for the play-test gate

**How to switch it on.**

* On the computer: ⚙ → 🧬 Experimental → tick **「CB · 过人世界 (play-test)」**. The current match
  restarts immediately in that world — same fixture, same seed, rebuilt.
* On the phone: open the game with **`?a4world=6`** on the end of the URL
  (`…/evofootball-arena/?a4world=6`). It sticks, so the link only has to be opened once.
  `?a4world=0` puts the shipped game back.
* Either way a chip appears in the corner: **🧪 CB 过人世界 · 剂量 1.0**. If the chip is not
  there, you are not in this world — the chip reads the MATCH, not what you clicked.

**What a 过人时刻 looks like on screen.** Watch a carrier being closed down. Instead of the ball
staying glued to his feet until someone takes it, you will see:

1. the ball suddenly **leave him**, along a line he chose — with a small ring marking the spot it
   left his feet and a bright trail growing behind it;
2. **a race** — he chases it, and so does anyone near enough. The trail IS the ball's path, so if
   the defender gets there first the trail simply ends at the defender;
3. if the defender was committed and missed, **a ring under him**, orange while his own momentum
   is still taking him the wrong way, turning red as he brakes and comes back, fading out exactly
   when he can challenge again. A defender who dived in at full tilt wears that ring for a long
   time; one who arrived under control barely wears it at all — **that difference is the whole
   mechanism, and it is the thing to look at**.

**What 博弈 (the game-theory) looks like, if it is there.** Not in any single moment — in what the
defenders start doing about it. Watch for: a defender **slowing down as he arrives** rather than
lunging; a defender **holding his position** and shepherding instead of committing; the carrier
**being allowed to carry** because nobody will bite. Also watch the shape of the game: possession
spells should feel longer, and the loose-ball scramble should feel less constant.

**What "not there yet" looks like — honestly.** This rung ships no learning. Nothing in the armed
world teaches a defender to stop diving in: layer 3 (the defence book, style evolution) is a
LATER contract. So the most likely honest outcome of this gate is: **过人时刻 clearly visible,
博弈 not yet** — defenders keep diving in and keep getting beaten, and the punishment is real but
nobody has learned from it. If that is what you see, that is the expected result, and it is the
evidence that layer 3 is the right next arc rather than a nicer renderer. What would be a REAL
problem is: knocks that look random or suicidal (the chooser is picking badly), rings that
appear on players who plainly won the ball (the mark is wrong), or trails that do not match where
the ball went (the rendering is lying — report it immediately, it is the one thing this rung
promises cannot happen).

**Roughly how often**: see §SMOKE below for the measured rate per match.

## §SEEDS — band **12,475,000 – 12,475,999** (#269.4's allocation)

Sub-bands are ledgered in §SEED LEDGER at the bottom; **booked = walked**.

## §DEV / §DOUBTS

Filled at the results half (this document's second commit).
