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
| `MAX_BODIES` | 32 | `cbVisibility.ts` | beaten-mark pool / per-frame body cap | a memory bound, well above the 12 on the pitch *(added of record #270.2)* |
| ribbon taper | 0.35 + 0.65·t | `CbLayer.ts` | ribbon half-width taper, tail → head | shape *(added of record #270.2)* |
| ring segments | 24 / 28 | `CbLayer.ts` | `RingGeometry` tessellation (release ring / beaten ring) | smoothness, not size *(added of record #270.2)* |
| `renderOrder` | 7 | `CbLayer.ts` | the ribbon's draw order | between `BallModel`'s trail (6) and its contact ring (8) *(added of record #270.2)* |
| 2D stroke widths | 2 / 2.5 px | `MatchRenderer.ts` | 2D ring + release-circle strokes / trail polyline stroke | size, in the plan view's own units *(added of record #270.2)* |

**COST** (the user plays on a phone). Everything is allocated once: one ribbon buffer
(96 × 2 verts), one release ring, a pool of 12 rings with their own materials, one
`Float32Array(192)` trail and one `Map` keyed by gid. A frame does bounded arithmetic over ≤ 12
bodies, appends at most one trail point, and writes into buffers it already owns — **the CB draw
path allocates nothing per frame in either view** (the 2D view mutates one feed record in place;
the 3D view reads the two small objects the render bridge already builds per frame as part of its
existing model). With the entry off the tracker is never even called: the
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
| 8 | scope | *(corrected of record #270.2)* the **DOSE** is the watched match's only (E4 semantics: written onto the watched match's own genome views, never serialized). The **DOORS** ride `League.matchFlags` **LEAGUE-WIDE while armed** (`GameApp.applyEdsPreview`), and a CB flags-only match is NOT byte-identical to a shipped one — so armed play moves the league table and the save's history, exactly as armed A4 v1–v3 play always has (precedent-consistent, now stated rather than implied) | #156/#168 precedent |

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
  there, you are not in this world. *(corrected of record #270.2)* Stated honestly: the chip is
  set from the version you REQUESTED (`GameApp.ts`'s `this.a4Badge.setWorld(version)` in the
  arming path), NOT from the match-reading oracle `cbArmedVersion(match)` — that oracle exists
  and the tests take their ground truth from it, but the badge does not call it. For v6 the two
  coincide in practice: the arming is genes-only with no async table load to fail, so the
  requested world IS the armed world on the rebuilt fixture.

**What a 过人时刻 looks like on screen.** Watch a carrier being closed down. Instead of the ball
staying glued to his feet until someone takes it, you will see:

1. the ball suddenly **leave him**, along a line he chose — with a small ring marking the spot it
   left his feet and a bright trail growing behind it;
2. **a race** — he chases it, and so does anyone near enough. The trail IS the ball's path, so if
   the defender gets there first the trail simply ends at the defender;
3. if the defender challenged and did **not** come away with the ball, **a ring under him**,
   orange while his own momentum is still taking him the wrong way, turning red as he brakes and
   comes back, fading out exactly when he can challenge again. *(corrected of record #270.2 —
   what follows replaces an inverted reading instruction.)* Read the ring honestly: it means
   **"he challenged and did NOT come away with the ball"**, nothing narrower (§DOUBTS 2, ruled
   "leave it wide"). The LONGEST rings on screen are NOT the new physics: a missed slide tackle
   wears its ring for the incumbent constant **2.5 s**, a missed keeper grab for **2.0 s** —
   cooldowns that predate this arc. The commitment story lives in the **standing-challenge
   rings, all ≤ ~1.2 s**: among THOSE, the faster the defender arrived, the longer his ring —
   that graded difference is the mechanism, and it is the thing to look at. The verify's
   measured split, per match: **~25 physics-derived rings vs ~11 constant-cooldown rings**; and
   because the constants run long, **~55 % of the ring-seconds on screen are the constants**.

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

**How often, measured** *(corrected of record #270.2 — the earlier text quoted the 600 s probe's
totals as per-match rates; a real match is `MATCH_DURATION` = 240 s, so the rates below are the
§SMOKE rung's own numbers rescaled to the match clock)*: about **16 knocks a match**
(39.63 per 600 probe-seconds × 240⁄600 ≈ 15.9) — one every ~15 seconds — of which about
**9 beat a challenger outright** (21.38 × 240⁄600). Rings are commoner (**~30 a match**, one
every ~8 seconds) because a ring marks EVERY lost challenge, not only the spectacular ones; each
lasts 0.8 s on average, and the verify measured **0.1786 rings on screen on an average frame**,
with **15.1 % of frames carrying at least one** — they punctuate, they do not clutter.
⇒ **the trail is the highlight; the ring is the running commentary.**

## §SEEDS — band **12,475,000 – 12,475,999** (#269.4's allocation)

Sub-bands are ledgered in §SEED LEDGER at the bottom; **booked = walked**.

---

# RESULTS

Run: `npx tsx scripts/probes/cb-frontend-rung.ts` (2026-08-14). ⭐ **This rung is NOT a gate
battery and does not pretend to be one.** It adds no mechanism and draws no statistic, so the
machine-liveness canon (#268.3(a)) has no gate list to bite on here; inflating three assertions
into a checklist would be exactly the dishonesty that canon exists to catch. What follows are
assertions and counts, labelled as such.

## §IDENTITY — the shipped world, untouched

⭐ **THE STRUCTURAL ARGUMENT COMES FIRST**: machine-read from `git diff --name-only` against the
arc's base, this rung touches **9 files under `src/`, of which ZERO are under `src/sim`,
`src/ai` or `src/evolution`**. The engine is byte-untouched, so the OFF world cannot have moved.
The files are `game/GameApp.ts`, `game/a4World.ts`, `render/MatchRenderer.ts`,
`render/cbVisibility.ts` (new), `render3d/CbLayer.ts` (new), `render3d/RenderStateAdapter.ts`,
`render3d/ThreeMatchRenderer.ts`, `ui/A4WorldBadge.ts`, `ui/SettingsScreen.ts`.

The measurement that backs it — 6 seeds, production flags, walked to the final tick:

| seed | signature | reproduces | `cbLedger` + `cbChoiceLedger` all-zero | render state CB-free |
| --- | --- | --- | --- | --- |
| 12,475,000 | `5cf430e543d9…` | ✓ | ✓ | ✓ |
| 12,475,001 | `cdcd904b511e…` | ✓ | ✓ | ✓ |
| 12,475,002 | `447207e380d4…` | ✓ | ✓ | ✓ |
| 12,475,003 | `a9e4c8ddb8dd…` | ✓ | ✓ | ✓ |
| 12,475,004 | `de28e449bd35…` | ✓ | ✓ | ✓ |
| 12,475,005 | `424b3d167693…` | ✓ | ✓ | ✓ |

* ⭐ **The production fingerprint re-derived UNCHANGED**: `npm run fingerprint` (seed 1337, 2
  seasons, 142 matches) → `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.
* ⭐ **SW PRECACHE CLEAN, on a REAL build** (`npm run build`, then the emitted `dist/sw.js` read
  back): **19 precache entries, ZERO containing `stage3`** — the opt-in census chunk
  (`stage3-…-DndypqbZ.js`, 243 kB) stays excluded exactly as #156 established. The CB world adds
  **no new chunk at all**: it carries no census artifact, so there is nothing new to exclude.
* ⚠ **THE ONE HONEST COST TO EVERY INSTALL, measured**: the two new render modules ride in the
  main bundle (they are wired into the always-loaded renderers), not in an opt-in chunk. Minified
  they are **4,547 bytes**, ≈ **1.9 kB gzipped** (measured per-file with `esbuild` + `gzip`; an
  upper bound, since in the real bundle they share a compression dictionary). Against the shipped
  `index-*.js` of 1,369.52 kB / 403.19 kB gzipped that is **≈ 0.5 % of the gzipped payload**. A
  player who never arms the entry downloads those bytes and never executes them (the render state
  carries no `cb` field, so both viewers take an early return).
* **RENDER READ-ONLY, grep-provable and test-pinned** (`tests/cbPlaytestEntry.test.ts`): every
  import in `src/render/cbVisibility.ts` and `src/render3d/CbLayer.ts` from `../sim` / `../ai` /
  `../evolution` / `../game` is a `import type` (in fact there are none at all — the modules
  name no sim symbol); neither file contains the token `match.`, `.owner =` or `rng`; and in the
  bridge's CB block every assignment target matches `players[i].*`, i.e. the render-state view.

## §SMOKE — the armed world's event rate (what the play-test should expect)

8 seeds, 600 sim-second matches, **the ENTRY's exact arming** — the probe calls
`a4MatchFlags(6)` and `armA4World(match, null, 6)`, the app's own two calls, so no flag or dose
is typed into the probe — walked with the render bridge attached at the app's own frame cadence
(4 sim steps per frame) and the real `CbVisibility` tracker consuming it.

| seed | knocks | drawn | coalesced | beat a challenger | beaten lunges (rings) | mean ring life | bodies ringed | goals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 12,475,100 | 16 | 16 | 0 | 9 | 79 | 0.803 s | 11 | 3 |
| 12,475,101 | 30 | 30 | 0 | 15 | 76 | 0.782 s | 12 | 10 |
| 12,475,102 | 59 | 59 | 0 | 27 | 67 | 0.796 s | 11 | 6 |
| 12,475,103 | 67 | 67 | 0 | 38 | 93 | 0.804 s | 12 | 6 |
| 12,475,104 | 28 | 28 | 0 | 11 | 84 | 0.818 s | 11 | 6 |
| 12,475,105 | 20 | 20 | 0 | 10 | 65 | 0.802 s | 11 | 6 |
| 12,475,106 | 67 | 67 | 0 | 39 | 71 | 0.800 s | 11 | 5 |
| 12,475,107 | 30 | 30 | 0 | 22 | 63 | 0.791 s | 11 | 7 |
| **mean** | **39.63** | **39.63** | **0.00** | **21.38** | **74.75** | **0.799 s** | **11.25** | **6.13** |

⭐ **THE VIEWER DREW EVERY KNOCK: 39.63 of 39.63, zero coalesced.** ("Coalesced" would be two
knocks inside one rendered frame, where the second overwrites the first's episode — the failure
mode a frame-sampled reader could have; it never happened in 317 knocks.) Longest trail held:
**26 real sampled points**. Distinct bodies ringed per match: 11.25 of 12 — over 600 seconds
essentially every outfielder loses a challenge at some point, which is why the ring reads as
commentary rather than as an award.

**On-screen occupancy, derived from the two measured columns**: 74.75 rings × 0.799 s ÷ 600 s =
**0.0995 rings on screen on an average frame**. The affordance punctuates; it does not clutter.

**Seed-to-seed spread is large and NOT smoothed here** (knocks 16 → 67). That is the mechanism,
not noise about a mean: a match in which one side's carriers get into carrying situations often
has many, a scrappy one has few. No inferential claim is made about the spread.

## §CHECKS

| check | result |
| --- | --- |
| `tsc --noEmit` | clean |
| `npm run build` (tsc + vite build) | ✓ built in 4.21 s |
| `npm run fingerprint` | `57b0bdab…c673` — unchanged |
| new test file `tests/cbPlaytestEntry.test.ts` | 23 tests, green |
| the family's shared entry files (`a4PlaytestEntry` / `V2` / `V3` / `mtPlaytestEntry`) | green after the five pin updates below |
| full suite (`npx vitest run`, after the pin updates) | 139 files / 1451 tests → **138 files / 1450 green**, ONE red: see below |

⚠ **THE SUITE'S HONEST DISPOSITION.** The clean full run's single RED is the arc's known
load-timeout pattern, not this rung's: `tests/formationEvolution.test.ts`'s ten-season ecology
test hit vitest's 180 s ceiling under full-suite load (2,381 s of test time across 139 files on
this machine). **Reproduced GREEN ALONE at 153.8 s** (3/3), consistent with the four prior rounds
of this arc (green alone at ~150 s). It touches nothing this rung touches — no engine file moved.

**FIVE PIN UPDATES TO EXISTING TEST FILES, declared** (the #211.3 precedent — adding a world to
the family moves the family's shared "the world set is exactly this" pins, and that commit
edited the same three files for the same reason):

1. `a4PlaytestEntry.test.ts` — the GameApp arming-guard source pin, widened for `isCbWorld`.
2. `a4PlaytestEntryV2.test.ts` — `?a4world=6` was pinned as "no sixth world exists"; a sixth
   world now exists.
3. `a4PlaytestEntryV3.test.ts` — the same pin.
4. `mtPlaytestEntry.test.ts` — the same pin, plus the badge-name count 5 → 6.
5. `a4PlaytestEntryV2.test.ts` also pins that `a4World.ts` never names `crossoverGenomes`. That
   pin was NOT edited: the draft's own comment was reworded instead, so the existing prohibition
   survives untouched.

No other pre-existing test was touched, and no assertion was weakened: each edit replaces a
statement that is now false with the statement that is now true.

## §DEV — the deviations, declared

1. ⭐⭐ **THE DOSE IS NOT WRITTEN TO `info.genome`** (the A4/MT arming idiom), for the reason in
   §ARMING: `cbCarryProneness` is born absent and that object is the league franchise's own, so
   the idiom would persist a dormant gene into the user's save. Match-local genome views instead
   (the engine's own `dvLearn` de-aliasing form). This is a STRICT hygiene improvement over the
   idiom and is test-enforced (the league serializes without the key), but it IS a deviation and
   is surfaced as one.
2. **The affordances are built in BOTH viewers.** The 3D view is the default and the one the user
   plays on a phone; the 2D tactical view got the same affordances from the same derivation
   module because a play-test in which switching views silently changes what you can see is a
   trap. The cost is a second small draw path (~40 lines) and one shared owner
   (`src/render/cbVisibility.ts`) so they cannot drift.
3. **Two optional fields were added to `RenderPlayer` and one to `RenderState`.** They are absent
   in every production frame and in every pre-rung replay; `interpolateStates` SNAPS them with
   the discrete fields rather than blending, so a scrubbed replay frame never shows a recovery
   clock no tick of the match ever held.
4. **The trail buffer is `Float64Array`, not `Float32Array`** (the `BallModel` trail's type).
   Deliberate: the claim "these are the ball's own positions" may not be rounded by the module
   that makes it. The GPU buffer downcasts at draw time, which is the renderer's business.
5. **The probe reports counts and means only.** No inferential statistic is drawn anywhere in
   this rung — see §STATS.

## §DOUBTS — ⭐ what the commander is asked to adjudicate

1. ⚠ **THE RELEASE POINT IS ONE FRAME LATE, and there is no honest way to make it earlier.**
   The engine's only signal that a knock fired is the LEDGER COUNTER, which carries no position
   and no timestamp; the aim direction is consumed inside `stepBall` and never published. So the
   release ring is drawn at the ball's own position on the FIRST FRAME AFTER the release —
   ≤ 1 frame late (≈16 ms, ≈0.2 m at a typical knock speed). The alternatives were both worse:
   reconstructing the release point from `dribbleTouch.until − 1.6` would put a *sim constant*
   into the render layer, and drawing the AIM POINT would put a PREDICTION on screen, which is
   the one thing §-1 forbids. **Ruling wanted**: accept the one-frame lateness as the honest
   price, or authorise a minimal flag-gated sim-side event (position + tick at the release) at
   the next rung. This rung deliberately did NOT add one.
2. ⚠ **THE RING SAYS "CHALLENGED AND DID NOT COME AWAY WITH IT", which is slightly wider than
   "beaten by a touch-past".** The discriminator (`tackleCooldown > 0 && lastTouch !== him`) is
   made only of engine state and excludes every winner, but it also marks a MISSED SLIDE
   (`trySlideTackle`) and a missed keeper grab — branches CB-T0 never touched, whose cooldowns
   are the incumbent CONSTANTS (2.5 s / 2.0 s), not physics-derived. So on those the ring's
   duration is still read from state, but the state is a constant. Two consequences, both
   disclosed rather than papered over: (a) a small fraction of rings do not carry the
   physics-derived story; (b) the smoke's "beaten lunges" column counts `cbLedger.recoveries`,
   which IS the physics-derived branch only, so the two numbers are not the same population.
   **Ruling wanted**: leave the ring wide (it is football-honest — a man who challenged and lost
   IS out of the play) or narrow it, which would need a sim-side mark.
3. ⚠ **THE CHOICE ITSELF IS INVISIBLE.** The user sees the knock that WAS chosen; they cannot
   see the compass of candidates that were priced and rejected, so 博弈 is legible only through
   its consequences (what defenders do about it), never directly. That is deliberate — the
   pricing table is an internal, and painting candidate arrows would be exactly the "explain the
   AI" overlay the debug flags already own. But it means the gate's second question (博弈看得出
   来吗) is being asked of BEHAVIOUR, and behaviour cannot change until the layer-3 learning arc
   exists. §HOW-TO-SEE says so in plain words rather than letting the gate discover it.
4. **No pixel evidence is offered, by doctrine.** Rendering correctness is argued at code level
   (§TRACE + the source pins) and settled by the user's eyes. Nothing in this rung claims what
   the screen looks like.

## §STATS

**ZERO drawn.** The receipts run computes counts, means and signature comparisons — no test, no
interval, no gate. Stats budget consumed: **0**; the ledger stands where #269.4 left it
(next ≥ 110,200).

## §SEED LEDGER — booked = walked

| sub-band | n | use | walked |
| --- | --- | --- | --- |
| 12,475,000 – 12,475,005 | 6 | §IDENTITY — the shipped world, twice each | ✓ 6/6 |
| 12,475,100 – 12,475,107 | 8 | §SMOKE — the armed world at the entry's arming | ✓ 8/8 |
| 12,475,900 – 12,475,902 | 3 | `tests/cbPlaytestEntry.test.ts` — the league fixtures (…900/901) and the in-suite OFF identity walk (…900–902) | ✓ 3/3 |

**Total booked = 17, total walked = 17.** The rest of the band (12,475,006–099, 12,475,108–899,
12,475,903–999) is VIRGIN of record.

## §ROAD B — nothing ships

The entry is default-OFF everywhere, the doors are absent from every preset and every League's
`matchFlags`, no production genome carries the gene, the save is untouched, and the production
fingerprint is unchanged. What a non-opt-in player pays is the 1.9 kB of render code disclosed
in §IDENTITY, and nothing else.

## §NEXT — the play-test (USER GATE)

The arc pauses at the user's eyes: **过人时刻看得见吗，博弈看得出来吗**. §HOW-TO-SEE is the recipe;
the honest prediction is written there (过人时刻 yes, 博弈 not yet — that is what layer 3 is for).

## §COMMANDER CORRECTIONS OF RECORD + THE §DOUBTS RULINGS (#270.2/#270.3, 2026-08-14)

The bounded-adversarial verify (#250.2): render layer PROVEN read-only (armed sim streams
byte-identical with and without the render bridge attached — verify built the receipt the draft
did not provide); OFF identity on virgin seeds; fingerprint unchanged; SW precache clean; 154/154
entry/render tests; no invented durations found under attack (the hunted "ring opens mid-recovery"
failure: 0.33/match, frac error 0.027 = one-frame sampling; winners ringed 0.00/match); arming
cannot drift by construction. VERDICT: PASS-WITH-FINDINGS. Findings adjudicated; the fixes commit
(#270.2, five fixes: replay reset, the 240 s clock, the honest ring reading, the completed
presentation table, the badge/E4 wording) landed BEFORE the gate. Of record:

* **(i) THE RING STAYS WIDE (draft §DOUBTS 3 ruled)**: "he challenged and did not come away with
  the ball" is football-honest; the inverted teaching was the defect, not the width. Measured
  split of record: ~25 physics-derived vs ~11 constant-cooldown ring episodes per match (≈55 % of
  ring-SECONDS are the incumbent 2.5 s/2.0 s constants); the commitment story lives in the
  standing-challenge rings (≤ ~1.2 s). Narrowing (a sim-side mark) = a NAMED OPTION only if the
  user's eyes want it at the gate.
* **(ii) ONE OCCUPANCY NUMBER OF RECORD**: 0.1786 rings on an average frame (15.1 % of frames
  carry ≥1) — the verify's all-rings measurement at the shipped cadence. §SMOKE's 0.0995 was the
  physics-recoveries-only derivation on the 600 s clock and is SUPERSEDED for occupancy purposes
  (it remains correct for what it counted). The knock rate of record on the real 240 s clock:
  ≈16/match (~9 beating a challenger), ~30 ring episodes/match.
* **(iii) REPLAY/REEL CAVEAT OF RECORD**: the replay buffer records at 10 Hz and lerps ball
  positions — in the half-time reel and any scrub, the trail is interpolated and the release
  point can sit up to ~1 m late. THE LIVE VIEW IS UNLERPED AND UNAFFECTED (verify: live =
  buildRenderState direct). The cross-cut chord-splice is FIXED (#270.2 FIX 1: cbVis.reset in
  resetFx); the first knock after any view reset is undrawn (LOW, recorded).
* **(iv) E4 CONTAINMENT, CORRECTED**: the DOSE is watched-match-only; the DOORS ride
  League.matchFlags league-wide while armed, and CB flags-only matches are NOT byte-identical ⇒
  ⚠ ARMED PLAY MOVES THE LEAGUE TABLE/SAVE HISTORY (precedent-consistent with A4 v1–v3; surfaced
  to the user at the gate). The badge is set from the REQUESTED version (coincides with ground
  truth for v6 — genes-only, no async table).
* **(v) LOWs recorded**: a dead publish path (cbRecover/cbCarryThrough published in a
  physics-only world, never drawn — unreachable from the entry) · the results commit carried an
  allocation refactor + comment fixes (the freeze-time "no per-frame allocation" claim became
  true at results time — freeze hygiene noted) · four family test pins updated for the sixth
  world (the #211.3 precedent), the V2 crossover prohibition preserved by rewording.
* **(vi) DRAFT §DOUBTS RULED (#270.3)**: (1) ⭐ the dose-not-in-info.genome deviation RATIFIED AS
  THE BETTER FORM (the A4/MT idiom would persist a dormant gene into saves and feed crossover;
  the dvLearn de-aliasing form is Lamarck-safe and test-enforced — future entries follow THIS
  form). (2) the ≤1-frame (~0.2 m) live release-point lag ACCEPTED for the gate; a flag-gated
  sim-side release event = NAMED OPTION if the eyes complain. (3) = (i). (4) the gate's honest
  expectation REGISTERED: 过人时刻 YES, 博弈 NOT YET — the choice is a pricing internal and the
  defence cannot learn fear until layer 3 exists; the §HOW-TO-SEE prediction stands as the
  arc's own honesty, not a hedge.

**M-CB.3 IS DISCHARGED. THE ARC PAUSES AT THE PLAY-TEST USER GATE.**
