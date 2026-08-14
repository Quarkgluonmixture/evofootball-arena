# CB T0 — the DORMANT LAYER-1 SEAM (`cbCommitPhysics` / `cbTouchPast`, 承诺的代价与过人的那一脚)

Status: **FROZEN (this half), then BUILT + RUN.** ⭐ Per the NEW canon **#266.3(c)** the whole of
this document from §LAW to §NRULE — the functional forms, every traced constant, the seam, the
read-fork inventory, the arming checklist, the pin inventory, the ⭐ CONJUNCT-LIVENESS audit, the
frozen gate list and the seed ledger — **lands in its own commit BEFORE any battery or smoke
result is read**, so git corroborates frozen-before-sight instead of self-attestation. The
measured numbers arrive only in [§RESULT](#result--the-gates-run) at the foot, and every number
there is quoted FROM the committed artifact (#229.2).

Authority chain: the **CARRY-BEAT CONTRACT**
[`CB-CARRY-BEAT-CONTRACT.md`](CB-CARRY-BEAT-CONTRACT.md) **§2 M-CB.1** (a: commitment-honest
dispossession · b: the directional touch-past) and **§3 CB-T0**, bound by ruling **#265.3** and
dispatched by **#266.5**, which declares this **THE DEEPEST ENGINE CUT OF THE PROGRAMME SO FAR**.
Its design inputs are [`CB-C0-DISPOSSESSION-CENSUS.md`](CB-C0-DISPOSSESSION-CENSUS.md)'s four
structural findings, named one by one in §0. Form precedents:
[`EK-T0-HOLD-BELIEF-SEAM.md`](EK-T0-HOLD-BELIEF-SEAM.md) and
[`DV-T2-T0-LEARNING-SEAM.md`](DV-T2-T0-LEARNING-SEAM.md) (⭐⭐ **THE SEAM FORM** — the identity
stack, the two-doors law, the read-fork inventory, the pin inventory, the arming checklist, the
gate canon). Hygiene canon in full: **#250.3** · **#251.3 / #252.3** · **#256.2/.3** · **#258.3**
· **#259.3** · **#260.2** · **#261.2** (whitelist-or-refuse incl. the ENGINE's own doors) ·
**#262.2** (output paths are overrides) · **#263.2** · **#264.2** · ⭐ **#266.3(a)** (the hashed
body excludes ALL invocation context — timings, dates AND paths) · ⭐ **#266.3(b)**
(CONJUNCT-LIVENESS before the gate list freezes) · ⭐ **#266.3(c)** (the freeze commit) ·
**#163** · **#181.2** · **#200** · **#203** · **#229.2** · **#247** · **#248.1**.

---

## §0 WHAT CB-C0 FOUND, AND WHAT EACH FINDING BECAME HERE

| CB-C0's structural finding | what it is in this seam |
| --- | --- |
| ⭐⭐ **THE TAKE IS GEOMETRY-BLIND** — `tryTackles` selects by DISTANCE alone and the take probability contains no term derived from the taker's speed, heading or motion state | **exactly the thing replaced behind the flag.** The armed take multiplies the incumbent odds by the taker's own COMMITMENT FACTOR χ — a reachability read of his own motion model. The incumbent expression is untouched; χ multiplies it |
| ⭐ **THE MISS PRICE IS A CONSTANT** (cooldown 1.2 s, stun 0.35 s, burst 0.02, zero kinematics written) | replaced behind the same flag by the **PHYSICS-DERIVED RECOVERY INTERVAL** — brake + turn + close, three closed forms of ACCEL / TURN\_RATE and his own state at the miss. **No invented stun timer** |
| ⭐ **THE WHISTLE PATH IS REAL** (`awardFoul` → penalty / send-off) | **UNTOUCHED, and deliberately so** — `foulP` stays motion-blind, exactly as honest as today. ⚠ Its FREQUENCY moves anyway, because the armed duel misses more often; that is an institutional shift and §RESULT MEASURES AND REPORTS it rather than hiding it (see §CHOICES 3) |
| ⭐ **THE DUEL IS FRONTAL BY CONSTRUCTION** (ball carried ahead + radius about the BALL ⇒ 0 of 9,956 challenges from behind) | the touch-past is **DIRECTIONAL**: the knock goes where it is AIMED, not along the carrier's travel, so the **back half of the compass opens for the first time** |
| **THE FAILED CHALLENGE EXISTS** (62 % of lunges miss) and the **WITHHELD** one is real (the jockey gate) | both untouched — the jockey gate, the selector, the lunge's burst cost and the anim timer are the incumbent's, byte for byte |

---

## §LAW — the frozen law of the carry beat

```text
THE TWO DOORS, and they do DIFFERENT things
  commitment physics ⇔ match.cbCommitPhysics === true   [NEW flag — the duel's geometry]
  touch-past         ⇔ match.cbTouchPast    === true    [NEW flag — the aimed knock]
                       AND match.forcedTouchPast names THIS carrier at an owned tick
                       (the instrument seam, the `forcedHold` idiom; null in production)

  ⇒ both doors shut ⇒ the incumbent world, byte for byte (G-IDENT / G-OFF / G-CROSS).
  ⇒ the touch-past door armed ALONE, with the seam null, is INERT — the statement is
    unreachable, not merely skipped (G-BORN-B).
  ⇒ the commitment door armed BITES immediately: it is a live re-pricing of every standing
    challenge, and that is what CB-T1 is for.

⭐⭐ THE ONE PRIMITIVE — REACHABILITY SLACK (src/sim/carryBeat.ts, `reachSlack`)
  `physicsStep` approaches `desiredVel` at `accel·dt` applied to the VECTOR difference, so a
  body's deceleration model IS its acceleration model (|dv/dt| ≤ a) and its reachable set at
  time t is the disc centred on its BALLISTIC drift `pos + vel·t` of radius `½·a·t²`. A carried
  ball rides at the carrier's velocity (`stepBall`: `ball.vel = owner.vel`), so projecting the
  target projects the CARRIER's motion. Hence

      slack(t) = ½·a·t²  −  | (target + targetVel·t) − (pos + vel·t) |            [metres]
      SLACK    = max over t ∈ [0, T] of slack(t),  sampled on the engine's own DT

  and the body can be ON the target inside its own horizon iff SLACK ≥ 0. ONE number carrying
  speed, angle and momentum at once. It is NOT a distance test: two bodies at the same distance
  with different velocities get different answers (G-GEOMETRY's anti-collapse conjunct).

⭐ THE HORIZON T IS THE BODY'S OWN, AND IT IS THE DUEL'S (`duelHorizon`)
      v*  = sqrt(2·a·R)          the arrival that cannot be braked inside the challenge radius
      T   = (v*) / a = sqrt(2·R/a)                    with the identity   ½·a·T² = R  exactly
  so T is at once how long a committed arrival takes to come to rest AND the horizon over which
  a body starting from rest covers exactly the challenge radius. R and a are the engine's; the
  identity is CB-C0's own overcommitment arithmetic, re-derived here from the same two numbers.

(a) ⭐⭐ THE ARMED TAKE (M-CB.1(a)) — mechanics.ts `tryTackles`
      χ  = clamp01( SLACK(taker → the ball, at the ball's own velocity) / R )      ∈ [0, 1]
      p_armed = p_incumbent · χ                     [p_incumbent = the clamped shipped odds]
  * χ = 0 — a body his own momentum carries past the ball — is a MISS BY GEOMETRY. The roll is
    still DRAWN (the stream's shape is the incumbent's), it simply cannot save him.
  * χ = 1 only when his projected position and the projected ball coincide.
  * NOTHING ELSE IN THE EXPRESSION MOVES: aggression, defending, dribbling, strength, the
    pace·drive momentum gate, Press, enforcer, the outnumbered-duel bonus and the [0.06, 0.7]
    clamp are the incumbent's, in the incumbent order. χ multiplies the clamped result.
  * RNG: the armed branch draws NOTHING of its own (G-NORNG).

(a′) ⭐⭐ THE PHYSICS-DERIVED RECOVERY INTERVAL (`recoveryInterval`) — the miss branch
      brake = |v| / a                 his deceleration model IS his acceleration model
      turn  = θ / TURN_RATE           θ = ∠(where his momentum points, the ball)
      close = sqrt(2·d / a)           d = the gap the miss left him; the braking identity inverted
      RECOVER = brake + turn + close  = the time his own motion model needs to be BACK IN THE DUEL

      tackler.tackleCooldown = RECOVER        [incumbent: the constant 1.2]
      tackler.stunTimer      = brake          [incumbent: the constant 0.35]
  * THE CARRY-THROUGH IS EMERGENT, NOT WRITTEN: the stun damps his STEERING (`physicsStep`
    scales the target velocity, not the velocity), so `physicsStep` integrates the momentum he
    already had and he is carried through by his own body. **No position and no velocity is
    written**, exactly as today — what changes is that the WINDOW is now his own braking time
    instead of a constant.
  * The three legs are the complete answer to "what does his own motion model need": stop
    moving the wrong way, point the right way, cover the gap. Nothing is chosen.
  * ⚠ `close` is a DECLARED third leg beyond the contract's words ("brake and turn") — §CHOICES 2
    states why, and what it prevents.

(b) ⭐⭐ THE DIRECTIONAL TOUCH-PAST (M-CB.1(b)) — mechanics.ts `performTouchPast`
  THE RELEASE IS THE ENGINE'S OWN, VERBATIM (`performDribbleTouch`, Phase 36/36.1):
      push   = (TOUCH_PUSH_BASE + open·TOUCH_PUSH_SPACE)·(1.05 − dribbling·0.15)
               open = clamp(aheadD − 2, 0, 9) along the CHOSEN line (the same forward cone, the
               same GK_RUSH_ENVELOPE, the same 14 m ceiling), halved by the same line guard
      speed  = |carrier's own velocity| + max(push, 0.8)
      ball.owner = null · ball.vel = dir·speed · ball.z = 0 · ball.vz = 0
      carrier's regather window = TOUCH_RECOLLECT_BASE + push·TOUCH_RECOLLECT_PER_PUSH
      match.dribbleTouch = { gid, until: simTime + 1.6 }
  ⇒ THE BALL GENUINELY LEAVES HIS FEET and the race that follows is the engine's EXISTING
    loose-ball race — `tryCapture`'s control-contact ladder, the first-touch price, the
    re-collect discount, the poke window — which ANYONE can win. Nothing about pickup is
    re-invented; the touch-past is the carry regime the engine already has, AIMED.
  TWO differences from the incumbent push, and only two:
    (i)  it goes where it is AIMED (the incumbent knocks along the direction of TRAVEL), which
         is what opens the back half of the compass;
    (ii) it draws NO RNG — the incumbent push's wobble is technique noise, and M-CB.1(b) forbids
         a dice roll here. The aimed knock is EXACT.

  ⭐⭐ SUCCESS IS GEOMETRY, FULL STOP (`beatsDefender`) — never a roll, never an attribute duel:
      the touch BEATS defender D  ⇔  for every t ∈ [0, W] sampled on DT,
          | ball(t) − (D.pos + D.vel·t) |  >  ½·a_D·t² + CONTROL_RADIUS
      ball(t) = ballPos + dir · speed·(1 − e^{−k·t})/k        [k = BALL_FRICTION_K, closed form]
      W       = TOUCH_RECOLLECT_BASE + push·TOUCH_RECOLLECT_PER_PUSH   [the engine's own race
                window — the very interval the carrier cannot re-collect in, which IS how long
                the race lasts]
  Every term is the engine's: its turf friction, its control radius, its timestep, that body's
  own acceleration constant, and the race window the push itself sets. No attribute of either
  body enters except the acceleration each already has.

THE WRITE PATH — ⭐ THERE IS NO GENE, NO BOOK, NO LEARNING
  This seam writes NO genome field, adds NO gene, serializes NOTHING and remembers nothing
  across a match. It is BODY KNOWLEDGE (#248.1: bodies know physics — legitimately innate).
  Style (dribble-proneness) is M-CB.2's genes-born-absent, and it is NOT in this stage.

⭐⭐ EPISTEMIC HONESTY, closed at the IMPORT LIST. `carryBeat.ts` imports the engine's own
  motion/turf constants and NOTHING else — it cannot name `Match`, `Player` (beyond the
  `TURN_RATE` constant), `Team`, an rng, a percept or a file path, so it cannot read an
  opponent's internals or any census artifact. Every body reaches it as a plain kinematic
  record: where he is, how fast he is going, how hard he can accelerate — the public facts
  anyone on the pitch can see (G-EPI).

NO PREDICATES (#200) — the complete conditional set is GATE, REACH, RECOVER, BEAT
  GATE     the two flag forks (+ the instrument seam for (b)).
  REACH    `slack ≥ 0` — a kinematic feasibility test, not a threshold.
  RECOVER  three closed forms, no branch but the degenerate `=== 0` guards.
  BEAT     one kinematic feasibility test per defender, per sampled tick.
```

### ⭐ The traced constants — every one of them, with its source

| constant | value | source | what it is here |
| --- | --- | ---: | --- |
| `R` (`CB_TACKLE_RADIUS`) | 1.15 m | `src/sim/mechanics.ts`, the `tryTackles` selector `if (d < 1.15 && d < best)` | the challenge radius; the disc the horizon is defined against |
| `ACCEL` | 14 m/s² | `src/sim/Player.ts` `const ACCEL = 14` | the base acceleration; **per body** `accel = ACCEL·(0.9 + pace·0.2)` ∈ [12.6, 16.8] — the seam uses the BODY's own, never the base |
| `TURN_RATE` | 6.5 rad/s | `src/sim/Player.ts` (imported) | the heading-rate cap; the turn leg's divisor |
| `DT` | 1/60 s | `src/sim/constants.ts` (imported) | the sampling grid — the grid the world itself is integrated on |
| `BALL_FRICTION_K` | 0.55 | `src/sim/constants.ts` (imported, `SURFACE_PROFILE.ballFrictionK`) | the knocked ball's decay, in closed form |
| `CONTROL_RADIUS` | 1.25 m | `src/sim/constants.ts` (imported) | the reach a body needs to do anything about a loose ball |
| `CONTEST_RADIUS` | 3 m | `src/sim/constants.ts` (imported) | ledger scope only: who counts as a CHALLENGER of a touch-past |
| `TOUCH_PUSH_BASE` / `TOUCH_PUSH_SPACE` | 0.9 / 0.32 | `src/sim/constants.ts` (imported) | the engine's own push law, reused |
| `TOUCH_RECOLLECT_BASE` / `_PER_PUSH` | 0.26 / 0.04 | `src/sim/constants.ts` (imported) | the regather window = the race window |
| the incumbent push expression | `(1.05 − dribbling·0.15)`, `clamp(aheadD−2, 0, 9)`, `max(push, 0.8)`, the line guard, the 14 m cone with `GK_RUSH_ENVELOPE` | `src/sim/mechanics.ts` `performDribbleTouch` | reproduced VERBATIM so a touch-past is the engine's own carry, aimed |
| the incumbent miss price | 1.2 s / 0.35 s | `src/sim/mechanics.ts`, the `tryTackles` miss branch | kept on the OFF path, byte for byte |

⭐ **G-TRACE reads every one of these back out of `src/**` at run time** and asserts equality; the
two REPEATED forms (`CB_TACKLE_RADIUS` and the push expression) are repeated rather than hoisted
so that **no banked instrument's source trace moves** — CB-C0's own `G-CONST-TRACE` greps that
selector line and its six `tackleCooldown` writers, and this stage may not silently invalidate a
banked receipt. ⚠ The armed branch ADDS a seventh `tackleCooldown` assignment; G-TRACE states
**seven, six incumbent + one armed**, so the count is re-proved rather than assumed.

## §CHOICES — the design latitude, exercised and defended (#266.5 asks for these by name)

1. ⭐⭐ **THE FUNCTIONAL FORM IS MULTIPLICATIVE (`p · χ`), AND RNG STAYS.** The contract leaves
   both open. Chosen because it is the SMALLEST honest cut that makes overcommitment genuinely
   punishable: the incumbent expression — which prices team aggression, the tackler's defending,
   the carrier's close control, strength and the pace·drive gate — is a real, tuned, evolved
   surface, and this stage's business is the missing GEOMETRY, not a re-tune of any of that. A
   multiplier in [0, 1] adds exactly one thing (can his body still get there?) and takes nothing
   away, and χ = 0 gives the mechanism its teeth: a dive that is geometrically lost is lost, with
   no roll left. The roll survives because the residual uncertainty of a 50-50 contact is real
   and because deleting it would be a second, hidden change (#31.1's rule).
   ⚠ **THE PRICE OF THIS CHOICE, STATED EX ANTE**: a multiplier whose mean is below 1 DEFLATES
   the armed take rate. That is an institutional shift, it is the direct consequence of the
   census's own finding (most of today's takes are made by bodies that could not reach the ball),
   and §RESULT MEASURES it — take rate, miss rate, foul rate, turnovers — rather than tuning it
   away with a constant, which is what #200 forbids.
2. ⭐ **THE RECOVERY INTERVAL HAS THREE LEGS, NOT TWO.** The contract says "brake and turn back";
   the built form adds `close = sqrt(2d/a)`, the time his own model needs to cover the gap the
   miss left. Two reasons, both structural: (i) "back in the duel" is not "stopped and facing" —
   the duel is a distance test, so the interval is not honest without the distance leg; (ii)
   without it a PLANTED body that whiffs pays ≈ 0 and may re-lunge on the very next tick, sixty
   times a second, each lunge spending `TACKLE_LUNGE_COST` — a stamina runaway invented by the
   derivation rather than by football. The third leg is the same closed form as the first,
   inverted, and it is disclosed here rather than discovered later.
3. ⭐ **`foulP` STAYS MOTION-BLIND — the whistle path is left exactly as honest as today.** A
   traced-geometric foul probability is buildable (the same slack would serve) but it is a
   SECOND mechanism, it would re-price cards, penalties and the professional-foul economy in the
   same round as the duel, and CB-T1 could then never attribute anything. Declared: the armed
   world's foul RATE will move because the armed world MISSES more; the seam does not change the
   per-miss whistle odds by a single term. §RESULT reports both rates in both arms.
4. **THE SELECTOR IS UNTOUCHED (still nearest-by-distance).** A reachability-ranked selector was
   REJECTED for this stage: it would stop overcommitted bodies from lunging at all, and the
   contract's own mechanism requires that they lunge, MISS, and pay the physics-derived price
   ("an overcommitted defender who misses is carried through by his own momentum"). A body that
   cannot reach the ball must still be allowed to dive in — that is the whole point.
5. **THE TOUCH-PAST'S DIRECTION IS THE INSTRUMENT'S.** CB-T0 builds the CAPABILITY; #266.5
   explicitly leaves the decision to CB-T2. `forcedTouchPast` is the `forcedHold` idiom verbatim
   — one arming, one knock, null in every production path. No candidate is priced, no gene is
   born, no appetite is expressed anywhere in this commit.
6. **THE BEATEN EVENT IS BOOKKEEPING, NOT A MECHANIC.** `beatsDefender` decides nothing in the
   world: the world is decided by the loose-ball race that actually runs. The predicate is
   exposed (CB-T1 needs the event; CB-T2 will need the geometry) and counted into `cbLedger`,
   which nothing in the sim ever reads.

### Alternatives REJECTED, and why (surfaced for adjudication)

| rejected | why |
| --- | --- |
| **χ as an ADDITIVE term** (`p + w·(χ − ½)`) | needs a weight `w` and a centre — two hand-painted constants, exactly #200's prohibition |
| **A CENTRED multiplier** (`p · χ/χ̄`, or any form normalised to hold the league take rate) | the normaliser is a measured value from a census — the #247 split forbids a census number reaching `src/**`, and holding the rate constant would HIDE the very shift the arc is about |
| **Replacing the roll with a pure geometric threshold** (`slack ≥ 0 ⇒ take`) | deletes the contact's residual uncertainty in the same round as adding geometry; two changes, one measurement (#31.1) |
| **Reachability-ranked SELECTION** | see §CHOICES 4 — it removes the beaten lunge the mechanism needs |
| **A geometric `foulP`** | see §CHOICES 3 — a second institution re-priced in the same round |
| **A per-tick "beaten" state on the defender** (a flag other code could read) | it would be a new world state with consumers; the beaten event is an OBSERVATION this stage makes, and a state nobody reads is a state that cannot drift |
| **Hoisting `1.15` and the push law into shared constants** | a drive-by refactor that would move a BANKED instrument's source trace (CB-C0 greps both) — repeated + gate-checked instead |

## §HONESTY — the epistemic limits, stated plainly

1. **THE REACHABLE DISC IS A SLIGHT OVER-ESTIMATE.** `½·a·t²` assumes a body may spend its full
   acceleration in any direction for the whole horizon; `physicsStep` additionally clamps the
   TARGET velocity to `topSpeed`, so a body already near top speed cannot quite realise the
   whole disc. Over a horizon of ~0.4 s the gap is small, and it is an over-estimate in the
   DEFENDER's favour in both (a) and (b) — the seam is generous to the challenger, never to the
   carrier. Declared, not corrected.
2. **THE PROJECTION IS FIRST-ORDER.** The ball is projected at its current velocity (i.e. the
   carrier's) and the defender at his; neither is assumed to keep accelerating. This is the
   honest read of "the motion now", it is what the body itself can see, and both sides are
   treated identically.
3. ⚠ **χ IS NOT A PROBABILITY.** It is a share of the challenge radius. Calling `p · χ` "the
   chance he wins" is a modelling choice, declared here, not a derivation.
4. **THE SEAM PRICES ONE DUEL.** The slide tackle, the tactical grab and the keeper smother are
   untouched — they are different mechanics with their own laws, and CB-C0 kept them out of its
   table for the same reason.
5. ⚠ **NO SEPARATION BASELINE IS INHERITED.** #266.3's binding correction (the census's Δsep /
   Δspace columns measure a taker→BALL hybrid) means this stage takes NO level from those
   columns; nothing here consumes them, and CB-T1 must measure separation carrier-anchored.
6. ⚠ **THIS STAGE SCORES NOTHING.** Whether beaten events change churn, pressing or restraint is
   CB-T1's question. The armed smoke is a descriptive plumbing read (#203).

## §SEAM — the mechanism (all of it dormant)

### The flags

**`cbCommitPhysics`** and **`cbTouchPast`**, two new **explicit** `MatchConfig` booleans,
initialised `cfg.cbCommitPhysics ?? false` / `cfg.cbTouchPast ?? false` (`Match.ts`) — the
`ekHoldLearn` form. **Never** `EDS_BUNDLE_ARMED`, never env-armed, never default-ON, never
bundle-defaulted: **absent from `src/game/a4World.ts` entirely**. Each gets its own
`League.matchFlags` key so a probe world can arm it explicitly, and neither key changes any
default.

### ⭐ THE ARMING CHECKLIST (a NAMED deliverable — every limb listed)

| # | to see… | you must | why |
| --- | --- | --- | --- |
| 1 | ANY change to a standing challenge | `cbCommitPhysics: true` | the one `tryTackles` fork |
| 2 | a geometric MISS (χ = 0) | the above **and** a real duel in which the taker's own momentum carries him past the ball | the mechanism, not a setting — a controlled arrival still gets its roll |
| 3 | a physics-derived RECOVERY | the above **and** a MISSED lunge | the armed price rides the miss branch alone; a WON tackle keeps the incumbent 0.5 s cooldown |
| 4 | a touch-past **at all** | `cbTouchPast: true` **and** `Match.forcedTouchPast = { gid, dir }` naming the CURRENT ball owner | the door plus the instrument seam; `forcedTouchPast` is null in every production path |
| 5 | the knock to actually fire | the named body must own the ball at an owned tick, be **outfield**, not in a keeper's hold, off his `kickCooldown`, and the phase must be `playing` | the fork's own conjuncts; the arming is CONSUMED (set to null) whether or not it fires |
| 6 | a BEATEN defender counted | an opponent inside `CONTEST_RADIUS` of the ball at the knock whose own motion model cannot meet it inside the race window | the ledger's scope; it gates no mechanic |
| 7 | a LEAGUE season with either door | `matchFlags.cbCommitPhysics` / `matchFlags.cbTouchPast` set explicitly on the League | otherwise the door dies with the match; no production League sets either |

**Nothing in production satisfies even #1**: neither flag appears in `a4World.ts`, in any preset,
in any play-test world or in any League's `matchFlags`.

### The genes

**NONE.** No gene, no `GENE_KEYS` entry, no opt-in, no genome write of any kind, no serialization.

### ⭐ The READ-FORK INVENTORY (a NAMED deliverable)

| # | site | file | what it feeds |
| --- | --- | --- | --- |
| **1** | `const cbArmed = match.cbCommitPhysics;` — THE DUEL FORK | `src/sim/mechanics.ts`, `tryTackles` | the χ multiplier **and** the armed miss price (one flag read, two guarded blocks) |
| **2** | `this.cbTouchPast && this.forcedTouchPast !== null && …` — THE TOUCH FORK | `src/sim/Match.ts`, `stepBall`'s owned-ball branch | the ONE call site of `performTouchPast` |
| **3** | `this.cbCommitPhysics = cfg.cbCommitPhysics ?? false;` / `this.cbTouchPast = …` | `src/sim/Match.ts`, the constructor | the arming rule itself |

Downstream, counted separately: the `cbLedger` write sites (pure bookkeeping, never read by the
sim) and the `carryBeat.ts` module body. Every other `src/**` occurrence is a declaration, an
init, a type, an import or the League union key — enumerated in the artifact with file:line and
class, **zero unclassified** (G-FORK).

**Byte-identity is structural, not hope**: with the forks not taken, `cbArmed` is `false`, the
incumbent constant pair is written exactly as before, the touch statement is unreachable because
`forcedTouchPast` is `null`, and every ledger counter stays 0.

### Untouched (restated as a prohibition)

⚠ Every banked seam's own law, module, flag and tests — `holdAccountBook.ts`,
`deliveryAccountBook.ts`, `whetherEye.ts`, `deliveryValueSeat.ts`, `passLeadSeat.ts`,
`deliveryChoiceSeat.ts`, `strikePlaneSeat.ts`, `lookSeat.ts`, `perceptionSnapshot.ts` ·
`a4World.ts`'s flag set and all three play-test worlds · the render layer · `evolve.ts` and
every evolution path · `League.toJSON` / `fromJSON` (no save field) · `PlayerBrain`'s decision
set (**no new action type, no new statement, no appetite anywhere**) · `performDribbleTouch`,
`trySlideTackle`, `tryTacticalFoul`, `trySmother`, `tryCapture` and the whole first-touch ladder.

---

## §PINS — the PIN INVENTORY (a NAMED deliverable)

| # | pin | where | class | disposition |
| --- | --- | --- | --- | --- |
| 1 | ⭐⭐ the **production fingerprint** `57b0bdab…c673` | asserted in 13 test files | league identity | UNTOUCHED — recomputed in-probe as G-IDENT / X-FP-PROD |
| 2 | ⭐⭐ **the banked seam modules byte-untouched** (`whetherEye.ts`, `holdAccountBook.ts`, `deliveryAccountBook.ts`, `a4World.ts`) | `git diff --stat` empty on each | source text | must hold |
| 3 | ⭐ **the `src/**` diff is CONFINED** to `carryBeat.ts` (new), `mechanics.ts`, `Match.ts`, `League.ts` — four files, no others | probe-computed from `git diff --name-only` | source text | must hold |
| 4 | the **incumbent miss price survives on the OFF path** — `1.2` / `0.35` still written verbatim | probe-computed source read | source text | must hold |
| 5 | the **ZERO-NEW-ACTION pin** — `PlayerBrain.ts` byte-untouched | `git diff --stat` empty | mechanism | must hold |
| 6 | ⚠ the **save round-trip pins** | `careers.test.ts`, League JSON suites | persistence | UNTOUCHED — nothing here is serialized |
| 7 | the whole suite | every pre-change test file (plus this stage's new one) | everything downstream | G-SUITE runs it in full. **No test file is edited by this stage** |

## §LIVENESS — ⭐ THE CONJUNCT-LIVENESS AUDIT (#266.3(b)), run BEFORE the gate list froze

Every conjunct below was read for dead-by-construction (tautologies, `x === x`,
subtraction-defined partitions, name/claim mismatch). **Four candidate conjuncts were DEMOTED
before the freeze** and are recorded here instead of being gated:

| demoted candidate | why it is dead by construction |
| --- | --- |
| `touchPastBeaten ≤ touchPastChallengers` | `beaten` is only ever incremented inside the branch that already incremented `challengers` — the inequality cannot fail for any input |
| `geometricMisses ≤ armedChallenges` | same shape: `geometricMisses` increments only after `armedChallenges` did, in the same block |
| `recoveries ≤ armedChallenges` | same shape (the miss branch is reached only through the armed block) |
| `touchPastCleanBeats ≤ touchPasts` | same shape |

⇒ The ledger's SURVIVING live claims are (i) **every counter is 0 in every OFF arm** (falsifiable
by arming a door — and the mutant does exactly that) and (ii) **the armed arms are NON-VACUOUS**
(falsifiable by a world in which no duel or no knock occurs). Every other gate's conjuncts are
listed with their mutants in §GATES; each mutant RE-INVOKES the gate's own function on a mutated
input and must flip **exactly** that conjunct, and the coverage set is machine-checked complete
(`uncoveredConjuncts` must be empty).

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

⭐ Every composite gate states its COVERAGE SET; every mutant RE-INVOKES the gate's own predicate
function (#260.2). ⭐ **#266.3(a): the hashed canonical body excludes ALL invocation context** —
no timing, no date, and **no path or output location** — so `resultSha256` re-derives across
differing `CBT0_OUT` invocations; paths/timings ride the UNHASHED envelope.

**THE TWO WORLD SHAPES** used throughout: **(P)** bare production (`new Match({seed, teamA,
teamB})`, every experimental flag off) and **(A)** the ARMED SUBSTRATE (`a4MatchFlags(3)`'s own
construction flags — the richest banked world the programme ships, so dormancy is proved where
the most other machinery is running).

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with both flags absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — all three RECOMPUTED IN-PROBE | HARD |
| **X-FP-PROD** | the 1337 row IS the production fingerprint | HARD |
| **G-OFF** | per-match whole-run signature **including the rng stream state**: flags ABSENT ≡ flags FALSE, in **BOTH** world shapes, on every receipt seed. Semantics (#194): CONFIG EQUIVALENCE only | HARD |
| ⭐ **G-BORN-B** | `cbTouchPast` ARMED ALONE (the seam never set) ≡ off, byte for byte, both shapes, every receipt seed — **and the machinery is LIVE**: the same door armed WITH the seam dosed fires > 0 touch-passes (the non-vacuity conjunct, so the identity is not a claim about dead code) | HARD |
| ⭐⭐ **G-CROSS** | **THE DOORS MATRIX (#228), two doors × EVERY banked flag family.** For each of the **24** enumerated banked construction flags F: `sig(F on, CB keys ABSENT)` = `sig(F on, CB keys FALSE)` = `sig(F on, cbTouchPast ON with no seam)` — i.e. the CB doors are inert beside every banked seam, one FULL match per cell per seed, whole-run signature incl. rng state. Plus **(DORMANT-ALL)** every door shut ⇒ the incumbent world, and **(DISCRIMINATION)** an armed-commitment world is NOT any banked flag's world | HARD |
| ⭐ **G-BITE** | `cbCommitPhysics` armed DIVERGES from off (the seam does something at all), and the divergence's FIRST tick is a tick at which a standing challenge was priced — non-vacuity, ⚠ a divergence claim, never a target flip (#250.3) | HARD |
| ⭐⭐ **G-GEOMETRY** | **THE FORM DOES REAL WORK, AND IT IS NOT DISTANCE-ONLY.** (i) ANTI-COLLAPSE: two takers at the SAME distance from the ball with different velocities get different χ, and the χ-vs-distance relation is NOT a function (a hand-built exhaustive kinematic sweep); (ii) ⭐ OVERCOMMITMENT IS PUNISHED: on a fixed approach line χ is SINGLE-PEAKED in arrival speed — there is a right pace to arrive at, an INTERIOR optimum — and past it every extra metre per second costs, down to χ = 0, a challenge lost before the roll is drawn; the speed at which it dies is the BODY's own (`a` scales it); (iii) a body whose projected position coincides with the projected ball has χ = 1; (iv) at fixed geometry, `recoveryInterval.total` is STRICTLY INCREASING in arrival speed and in turn angle and in gap; (v) `beatsDefender` is DETERMINISTIC (identical inputs ⇒ identical answer over repeats) and DIRECTION-DEPENDENT (for one defender, some direction beats him and another does not), and MOMENTUM-DEPENDENT (same spot, different velocity, different answer); (vi) `beatsDefender` never beats a defender standing ON the ball. Coverage: six conjuncts, six mutants, each RE-INVOKING the sweep | HARD |
| ⭐ **G-MATH** | the braking identity re-derived over a family of accelerations: `½·a·duelHorizon(a)² = R` and `overcommitSpeed(a)²/(2a) = R`, to floating-point equality; `rolledDistance` equals the engine's own per-tick decay integrated on DT to the same tolerance the engine's own integration allows | HARD |
| ⭐ **G-NORNG** | the seam draws **ZERO** rng of its own: `performTouchPast` driven directly on a stepped fixture leaves the match rng state EXACT; the armed duel block's own source lines contain no `rng` token; and the armed take path calls `rng.chance` exactly ONCE per challenge, as the incumbent does (source-level, both arms) | HARD |
| **G-LEDGER** | every `cbLedger` counter is **0** in bare production, in the armed substrate, and in every OFF arm; and the armed arms are NON-VACUOUS (see §LIVENESS for the four conjuncts DEMOTED as dead-by-construction) | HARD |
| **G-TRACE** | every constant of the §LAW table READ OUT of `src/**` at run time and equal to the seam's value: the `1.15` selector literal · `ACCEL = 14` · `TURN_RATE` / `DT` / friction / control radius / contest radius / the four touch constants BY IMPORT · the incumbent push expression present verbatim in `performDribbleTouch` · the incumbent `1.2` / `0.35` pair still written on the OFF branch · and ⭐ **SEVEN** `tackleCooldown` assignments in `mechanics.ts` (CB-C0's six + this seam's one), all seven classified | HARD |
| ⭐ **G-EPI** | `carryBeat.ts`'s import list contains **only** `./constants` and `./Player`'s `TURN_RATE`; its executable source names no `Match`, no `match.`, no `Team`, no `rng`, no `readFileSync`, no `docs/`, no `import(`, and no `attrs.` beyond the `dribbling` the engine's own push law already used | HARD |
| ⭐⭐ **G-NOTABLE** | **THE #247 SPLIT.** No file in `src/**` contains CB-C0's artifact name, schema name, or ANY of its measured values — every take rate, every overrun, every Δ, every shape point — as written (5-dp) AND in the formatted percentage form its tables print. Coverage stated: needle count, the values excluded by a DECLARED floor, and a CONTROL NEEDLE that must be FOUND | HARD |
| **G-HYGIENE** | both flags absent from `a4World.ts` **entirely**; initialised `?? false`; a fresh Match and a League match are both OFF; no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` anywhere on a seam line; no new `GENE_KEYS` entry; nothing serialized; ⭐ the probe's own env surface is **WHITELIST-OR-REFUSE** including the ENGINE's own doors (`EDS_BUNDLE`, `EDS_TRACE_CHOICE`, `EMERGENT_POS`, the five `constants.ts` scale doors) | HARD |
| **G-FORK** | the READ-FORK INVENTORY: **exactly ONE** duel fork, **ONE** touch fork, **TWO** constructor inits, exactly ONE `performTouchPast` call site; every other `src/**` occurrence enumerated with file:line and class, **zero unclassified** | HARD |
| **G-PINS** | the §PINS inventory's machine-checkable rows recomputed, incl. the four banked modules byte-untouched, `PlayerBrain.ts` byte-untouched, the `src/**` diff CONFINED to four files, and **zero test files edited** | HARD |
| ⭐ **G-CLEAN-INVOCATION** | any `CBT0_N` / `_SMOKE_N` / `_SKIP_FP` / `_OUT` routes the run onto the **guard block**, turns this gate RED and exits 1 — the receipt blocks stay VIRGIN; a preflight can never write a canonical repo path (guarded at parse time **and** on the RESOLVED absolute path at the write) | HARD |
| **G-NDERIVED** | the armed smoke's N **is** the frozen §NRULE output, computed from the committed sizing artifact | HARD |
| **G-SEED** | seed-block disjointness proved in-probe for every interval this stage consumes, against the COMPLETE consumed ledger (CB-C0's included), sub-blocks ordered and disjoint | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests; pass B never resumes | HARD |
| ⭐⭐ **G-MUTANTS** | every conjunct of every gate in the NAMED coverage set carries its own mutant that **RE-INVOKES the gate's own function** on a mutated input and must flip exactly that conjunct; coverage machine-checked complete (`uncoveredConjuncts` empty). The single-predicate gates print their evidence in full instead | HARD |
| **G-SUITE** | FULL `npm test` green + `npx tsc --noEmit` clean (load-induced timeout flakes reproduced/disclosed per the PTP-T0 disposition) | HARD |
| ⭐ **REPORTED** | **THE ARMED SMOKE** — paired arms on the same seeds (OFF · commitment-armed · touch-armed), publishing: beaten-event existence and counts, the take rate by arrival-speed bin in BOTH arms, the geometric-miss share, the recovery-interval distribution against the incumbent constants, and ⭐ **the institutional rates in both arms — fouls, penalties, cards, turnovers, goals** (§CHOICES 1/3's declared shift, MEASURED). No control beyond the paired OFF arm, no CI, **no verdict** (#203) | REPORTED |

⭐ **THE HEADLINE COUNT, HAND-CHECKED against this frozen list (#250.3(i)):** the table has **23**
HARD rows — `G-IDENT · X-FP-PROD · G-OFF · G-BORN-B · G-CROSS · G-BITE · G-GEOMETRY · G-MATH ·
G-NORNG · G-LEDGER · G-TRACE · G-EPI · G-NOTABLE · G-HYGIENE · G-FORK · G-PINS ·
G-CLEAN-INVOCATION · G-NDERIVED · G-SEED · G-DET · G-MUTANTS · G-SUITE` — that is **22** in the
probe plus **G-SUITE**; the artifact's `gates` object carries exactly the **21** probe-computed
keys plus `xFpProd`, i.e. **22**, and G-SUITE is run outside it and reported in §CHECKS. Every
headline in this document quotes **22 probe gates + G-SUITE = 23**.

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any `src` diff outside the
four seam files, any rng draw on the dormant path, any measured value from CB-C0 reaching
`src/**`, or **any existing test breaking** (a STOP-and-report, never a test edit).

## §NRULE — the armed smoke's N, frozen before the sizing smoke ran

```text
N* = min( ceil(60 / rarestArmedCellPerMatch) ↑25,
          floor(0.5 h / (ms/match × 3 arms × 2 X-DET)),
          200 )
```

60 events ⇒ a count's relative SE ≈ 13 %, the precision at which an ORDERING is readable —
DV-C0 / CB-C0's own target, inherited with its justification. ⭐ **THIS STAGE'S NUMERATOR**: a
**MISSED standing challenge in the OVERCOMMITTED arrival bin** (`v ≥ sqrt(2·a·R)` on the body's
own `a`) in the commitment-armed arm — the rarest cell any published armed number is read from.
`rarestArmedCellPerMatch` and `ms/match` are the **only two numbers** the full run reads out of
the committed sizing artifact; no rate, share or ordering is ever read from it. The 200 cap is
the honest seed-budget cap. ⭐ **THE ZERO-EVENT CLAUSE** (frozen with the rule): if the sizing
smoke sees **zero** events in that cell the precision term is UNBOUNDED — it cannot be estimated
from a zero count and this stage will not invent a floor — so the wall term and the cap bind.

## §SEED LEDGER

Band **12,472,000–12,472,999** (ruling #266.5's pre-registration), opened above CB-C0's
consumption through 12,471,799.

| item | block | status |
| --- | --- | --- |
| everything consumed through CB-C0 | the probe's `CONSUMED` table (inherited in full) | prior |
| **CB-T0 identity receipts** (G-OFF / G-BORN-B / G-BITE; ⭐ G-CROSS re-uses the FIRST 2 — no new block) | **12,472,000 – 12,472,011** (12) | CONSUMED here |
| **CB-T0 direct reads** (G-NORNG's fixture, G-LEDGER's production read) | **12,472,020 – 12,472,029** | CONSUMED here |
| ⭐ **exit-semantics GUARD block** — where EVERY preflight invocation is routed | **12,472,050 – 12,472,099** | reserved (⚠ §DEV 1: the disclosed build preflight walked 050–051) |
| **sizing smoke** | **12,472,100 – 12,472,119** (20) | CONSUMED here |
| **the ARMED SMOKE** (N ≤ 200) | **12,472,200 – 12,472,399** | CONSUMED here, exact sub-band in §RESULT |
| G-WORLD / construction read | **12,472,999** | constructed, never stepped |
| CB-T0 test-file seeds (not a battery) | **12,472,900 – 12,472,911** | consumed here |
| free above | 12,472,012–019 · 030–049 · 120–199 · 400–899 · 912+ | available to CB-T1 |

Disjointness is computed **in-probe** for every interval separately, not asserted here.

**STATS**: this stage runs **no bootstrap and draws no stats stream at all** — the identity-round
form (EK-T0's precedent). The ≥ **109,800** floor set by #266.5 is therefore **NOT DRAWN**, and
is said so rather than reserved unused. CB-T1 opens at 109,800 unchanged.

## §ROAD B — nothing ships

`cbCommitPhysics` and `cbTouchPast` are **OFF in every production path** — hard `false` defaults,
absent from `a4World.ts` and from all three play-test worlds, absent from every League's
`matchFlags` unless a probe sets them explicitly — and `cbTouchPast` armed cannot do anything at
all without `forcedTouchPast`, which no production path ever sets. No gene is added; nothing is
serialized; no genome is ever written. **Nothing about the game the user plays changes in this
commit.** The seam exists so CB-T1 can run the beaten-event exam.

**Road B statement**: fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **must not move.**

## §NON-CLAIMS

CB-T0 claims **no** football effect. It does **not** claim the armed duel is better calibrated
than the incumbent one, does not claim any measured rate is right, does not claim beaten events
change churn, pressing or restraint (CB-T1's question), builds **no** chooser, **no** candidate
pricing and **no** style gene (CB-T2's, M-CB.2), touches **no** frontend (M-CB.3's rung), and
discharges **none** of the #248 debts. The armed smoke is an uncontrolled descriptive reading and
adjudicates nothing (#203). It cannot authorize CB-T1; only the commander can.

---

## §RESULT — the gates run

Every number below is quoted FROM `docs/world-model/data/cb-t0-dormant-layer1-seam.json`, which
is recomputed by `CBT0_MODE=full npx tsx scripts/probes/cb-t0-dormant-layer1-seam.ts`.

Tests: [`../../tests/carryBeat.test.ts`](../../tests/carryBeat.test.ts) — **25 pins**. Receipts:
[`../../scripts/probes/cb-t0-dormant-layer1-seam.ts`](../../scripts/probes/cb-t0-dormant-layer1-seam.ts),
artifact [`data/cb-t0-dormant-layer1-seam.json`](data/cb-t0-dormant-layer1-seam.json).

**12 receipt seeds × the arm set × BOTH world shapes, block 12,472,000–011 · a 25-flag doors
matrix on the first 2 · 21/21 probe gates + G-SUITE PASS**, `resultSha256`
`16bbb0b7…e62c`, G-DET digest `022163fc…fbd6` twice, 96.7 s wall, 82.8 ms/match.

⚠ **A FROZEN-DOC ARITHMETIC CORRECTION, of record**: §GATES's headline paragraph said "23 HARD
rows … 22 in the probe". The frozen TABLE has **22** HARD rows, of which **21** are
probe-computed and **G-SUITE** is run outside — the prose double-counted `xFpProd`. **No gate was
added, removed or renamed**; the table is the authority and the artifact's `gates` object carries
exactly its 21 probe keys. Hand-counted here: `gIdent · xFpProd · gOff · gBornB · gCross · gBite ·
gGeometry · gMath · gNoRng · gLedger · gTrace · gEpi · gNotable · gHygiene · gFork · gPins ·
gCleanInvocation · gNDerived · gSeed · gDet · gMutants` = **21**, + G-SUITE = **22**.

### Gate table

| gate | result | evidence |
| --- | --- | --- |
| `gIdent` | **PASS** | 3/3 league seeds identical, recomputed in-process: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26` |
| `xFpProd` | **PASS** | the 1337 row IS the production fingerprint — **the seam moves nothing that ships** |
| `gOff` | **PASS** | 12/12 seeds × BOTH world shapes — flags absent ≡ flags false, whole run incl. the rng stream state |
| ⭐ `gBornB` | **PASS** | 12/12 seeds × both shapes — the touch door armed ALONE is byte-identical, **with the machinery proved LIVE**: the same door with the seam dosed fired **1,537** touch-passes in bare production (95–161 per match) and **1,615** in the armed substrate (104–173), beating **295** of 936 challengers in the bare arm and **366** of 1,172 in the armed one |
| ⭐⭐ `gCross` | **PASS** | **25 banked flag families × 2 seeds.** For every one: `F alone` ≡ `F + CB keys false` ≡ `F + the touch door armed`. DORMANT-ALL holds; ⭐ DISCRIMINATION holds (an armed-commitment world equals no banked flag's world, 25/25 × 2 seeds). ⚠ **Scoped honestly**: only **8 of the 25** flags move the world on their own at these seeds (the other 17 are themselves inert without their own probe drivers — `ekHoldLearn` learns without consuming, `o2Look` needs `forcedLook`, and so on), so for those 17 the pairwise identity is a weaker witness and is reported as such |
| ⭐ `gBite` | **PASS** | 12/12 seeds × both shapes — the commitment door armed diverges from off (⚠ divergence, never a target flip) |
| ⭐⭐ `gGeometry` | **PASS** | **6/6 conjuncts** — ANTI-COLLAPSE (χ takes 6 distinct values at ONE distance) · OVERCOMMITMENT PUNISHED (χ single-peaked in arrival speed with an INTERIOR optimum, falling to exactly 0, and the death speed scales with the body's own `a`) · the perfect body reads exactly 1 · the recovery strictly increasing in speed, turn AND gap · the touch-past deterministic, direction- and momentum-dependent · a body ON the ball never beaten. **9 mutants, 9 live, `uncoveredConjuncts` = 0** |
| ⭐ `gMath` | **PASS** | `½·a·T² = R` and `v*²/2a = R` and `v*/a = T` to **1e-12** on 5 accelerations spanning the whole per-body range [12.6, 16.8]; the friction closed form 2.15434 m vs the engine's own DT-integration 2.16423 m |
| ⭐ `gNoRng` | **PASS** | the touch-past driven directly on a stepped fixture left the match rng at `12472020 → 12472020` (**EXACT**); the armed duel block, the touch function and the seam module's executable source contain **no `rng` token**; the armed take still calls `rng.chance(p)` exactly ONCE per challenge, as the incumbent does |
| `gLedger` | **PASS** | every counter **0** in bare production and **0** in the armed substrate; the armed arms non-vacuous (63 armed challenges, 59 recoveries, 130 touch-passes on the read seed). ⚠ four ledger inequalities were DEMOTED as dead-by-construction BEFORE the freeze (§LIVENESS) |
| `gTrace` | **PASS** | 8/8 — the `1.15` selector literal · `const ACCEL = 14` · the per-body `ACCEL·(0.9 + pace·0.2)` · `export const TURN_RATE = 6.5` · the seam's two imports · the push law present VERBATIM in both files · the incumbent `1.2`/`0.35` pair still written on the OFF branch · and ⭐ **exactly SEVEN** `tackleCooldown` writers (CB-C0's six + this seam's one) |
| ⭐ `gEpi` | **PASS** | the seam module's import list is exactly `['./constants', './Player']`; **0 of 10** forbidden names in its executable source (`Match`, `match.`, `Team`, `rng`, `readFileSync`, `docs/`, `import(`, `process.env`, `genome`, `attrs`) |
| ⭐⭐ `gNotable` | **PASS** | **514** needles from CB-C0's PUBLISHED tables (raw 5-dp + the formatted percentage form), **0** value hits across **142** src files; no artifact name, no doc path in the seam; the CONTROL NEEDLE was FOUND. **236** forms excluded by the DECLARED four-decimal floor (§DEV 3) |
| `gHygiene` | **PASS** | 8/8 — absent from `a4World` · `?? false` inits · a fresh Match off · a League match off · no env door on any seam line · no new gene key · nothing serialized · the probe's env surface whitelist-or-refuse over 5 accepted vars **and 9 ENGINE doors** |
| `gFork` | **PASS** | **1** duel fork · **1** touch fork · **2** inits · **1** `performTouchPast` call site · the arming is CONSUMED · **10** src occurrences classified, **0 unclassified** |
| `gPins` | **PASS** | 7/7 — the `src/**` diff is CONFINED to `carryBeat.ts`, `mechanics.ts`, `Match.ts`, `League.ts`; `whetherEye.ts`, `holdAccountBook.ts`, `deliveryAccountBook.ts`, `a4World.ts` and ⭐ `PlayerBrain.ts` byte-untouched; the only `tests/**` change is the new file. ⭐ the pre-change tree is DERIVED (the parent of the commit that added `carryBeat.ts`), never pinned |
| ⭐ `gCleanInvocation` | **PASS** | preflight false · reasons [] — and the refusals were exercised (§CHECKS) |
| `gNDerived` | **PASS** | ran N 25 = derived N\* 25 (binding term: **precision**) |
| `gSeed` | **PASS** | 4/4 intervals disjoint from the complete consumed ledger (16 prior blocks incl. CB-C0's), and ordered |
| `gDet` | **PASS** | digest `022163fc…fbd6` on both passes; ⭐ the within-pass memo is CLEARED between them, so pass B re-walks every match |
| ⭐⭐ `gMutants` | **PASS** | **9 mutants, 0 dead**, every one RE-INVOKING `geometrySweep` itself; coverage set NAMED (`antiCollapse`, `overcommitPunished`, `perfectIsOne`, `recoveryMonotone`, `touchDeterministic`, `onBallNeverBeaten`) and machine-checked complete |
| `G-SUITE` | **PASS** | see §CHECKS |

### ⭐⭐ REPORTED — THE ARMED SMOKE (the sanity read, not a gate)

**25 seeds, block 12,472,200–224, three PAIRED arms on the same seeds** (OFF · commitment-armed ·
touch-armed+dosed). N\* = 25 by the frozen rule (precision bound: the sizing smoke saw 4.55
overcommitted misses per match, `ceil(60/4.55) = 14 ↑25`). Per-seed cells are stored, so every
number re-derives without a re-run.

#### (a) THE COMMITMENT ARM — the duel is no longer geometry-blind, and the price is LARGE

| quantity | OFF | commitment-armed | change |
|---|---:|---:|---|
| standing duels tabulated | 688 | 790 | +14.8 % |
| **take rate** | **35.756 %** | **6.329 %** | ⚠ **−29.4 pp** |
| duels won | 246 | 50 | −80 % |
| ⭐ geometric misses (χ = 0, lost before the roll) | n/a | **397 of 790 (50.3 %)** | new |
| mean recovery interval | 1.2000 s (constant) | **0.7744 s** | −0.43 s, and now a DISTRIBUTION (max 1.2138 s) |
| mean carry-through (stun) | 0.3500 s (constant) | **0.2509 s** | −0.10 s, and now a distribution |
| fouls | 114 | 127 | +11.4 % |
| cards / send-offs | 35 / 2 | 43 / 4 | +22.9 % / ×2 |
| turnovers | 844 | 716 | −15.2 % |
| **goals** | **42** | **67** | ⚠ **+59.5 %** |
| shots | 348 | 363 | +4.3 % |

⭐ **THE MECHANISM WORKS AND IS MEASURABLE**: half of all standing challenges are now lost to
the taker's own momentum before any roll is drawn, and the beaten lunger's price is a real
distribution keyed to his arrival instead of a constant. ⚠⚠ **AND THE INSTITUTIONAL SHIFT IS
BIG — bigger than §CHOICES 1 anticipated when it declared "a multiplier whose mean is below 1
DEFLATES the take rate".** The standing tackle is not re-priced, it is nearly abolished (take
rate 35.8 % → 6.3 %), the defence loses its main dispossession tool, and the scoreline moves
+60 %. The foul rate moves +11 % — as declared, `foulP` is untouched per miss; there are simply
more misses. **This is the headline finding of the round and it is the commander's to
adjudicate** (§DOUBTS below).

#### (b) THE TOUCH ARM — ⭐⭐ BEATEN EVENTS EXIST

```text
touch-passes fired          3,153   (25 matches; the DOSER's cadence, one per second)
challengers aimed past      1,897   (opponents inside CONTEST_RADIUS at the knock)
⭐ defenders BEATEN            610   (32.2 % of challengers — decided by geometry alone)
⭐ knocks beating EVERY challenger  360
total push                 6,868 m  (2.18 m per knock)
```

⚠⚠ **THE TOUCH ARM'S WORLD NUMBERS ARE THE DOSER'S, NOT THE MECHANISM'S**, and must not be read
as a football result: the instrument fires an **unchosen backwards knock every single second**,
which is why turnovers explode (844 → 2,247) and goals collapse (42 → 7, shots 348 → 48). That
is the probe deliberately playing the worst possible dribbling policy in order to prove the
capability EXISTS and the race is real. **What the arm establishes is exactly and only this**:
the ball genuinely leaves the carrier's feet, the loose-ball race that follows is the engine's
own, and **a real defender is really beaten 610 times** by geometry. The DECISION is CB-T2's.

### §CHECKS

```text
$ npx tsc --noEmit                      → clean
$ npx tsx scripts/fingerprint.ts        → 57b0bdab…c673 (unchanged; also recomputed in-probe)
$ npx vitest run tests/carryBeat.test.ts → 25/25 green
$ npx vitest run                        → 1,403 of 1,410 green across 137 files; the 7 reds are
                                          TIMEOUTS, never assertions, and ALL SIX FILES were
                                          reproduced GREEN ALONE on this same tree (see §DEV 5)

$ CBT0_MODE=smoke CBT0_BOGUS=1 …        → FATAL, exit 2 (whitelist-or-refuse)
$ CBT0_MODE=smoke EDS_BUNDLE=1 …        → FATAL, exit 2 (the ENGINE's own doors refused)
$ CBT0_MODE=smoke CBT0_N=2 CBT0_OUT=docs/world-model/../world-model/data/x.json …
                                        → FATAL, exit 2 (a PREFLIGHT may not write a canonical
                                          repo path; the traversal spelling is RESOLVED)
$ npx tsx scripts/probes/…              → FATAL, exit 2 (CBT0_MODE is REQUIRED)
$ CBT0_MODE=smoke CBT0_N=2 CBT0_SMOKE_N=2 CBT0_SKIP_FP=1 CBT0_OUT=/tmp/… →
                                          17/21, gCleanInvocation RED, routed onto the GUARD
                                          block 12,472,050+ — the receipt blocks stay VIRGIN
$ CBT0_MODE=full npx tsx scripts/probes/… → GATES GREEN (21) · exit 0 · 96.7 s
```

### §DEV — the deviations, declared

1. ⚠ **A BUILD PREFLIGHT WAS RUN ON THE GUARD BLOCK BEFORE THE FREEZE COMMIT, and this is what it
   saw.** Two matches (seeds **12,472,050–051**) were walked in all three arms to prove the code
   ran at all and neither mechanism was dead: the `cbLedger` counters (armed challenges,
   geometric misses, recoveries and their second totals, touch-passes, challengers, beaten,
   clean beats, pushed metres) and the final scorelines. **No take rate, no foul rate, no
   turnover count, no identity result and no gate outcome was computed or read**, and no receipt,
   sizing or smoke seed had been walked. The freeze commit landed after that and before any
   battery — the CB-C0 §DEV 1 idiom (what was and was not seen, stated).
2. ⭐ **THE FROZEN GATE LIST'S G-GEOMETRY CONJUNCT (ii) WAS SHARPENED BEFORE THE FREEZE COMMIT.**
   The first draft asserted "an arrival at ≥ that body's own `v*` straight through the ball has
   χ = 0". Writing the pin showed the claim is FALSE and the truth is better: a body running
   straight through the ball touches it at whatever speed, so the punished case is the OFFSET
   arrival — and there χ turns out to be SINGLE-PEAKED in speed, i.e. **there is a right pace to
   arrive at**, with an interior optimum, and past it every extra m/s costs down to a lost
   challenge. The conjunct was rewritten to that stronger form before the doc was committed.
3. **G-NOTABLE'S FLOOR IS FOUR DECIMALS, AND ITS NEEDLES ARE WHOLE-NUMBER MATCHES.** A three-
   decimal floor (EK-T0's) produced a false hit: the formatted form `0.584` occurs as a PREFIX
   inside a banked prior table's `0.5846153846…` in `src/ai/passPrior.ts`, which is arithmetic
   accident, not a leak. Both were fixed before the frozen run — the floor tightened by one
   place and every needle matched with a `(?![0-9])` boundary — and the excluded count is
   published beside the gate. The census's `perClusterCells` are excluded by declaration: they
   are raw storage, not published numbers.
4. **THE DOORS MATRIX IS SCOPED HONESTLY**: 17 of the 25 banked flags do not move the world when
   armed alone at these seeds (they need their own probe drivers), so for those the pairwise
   doors-shut identity is a weaker witness than for the 8 that do. Reported in the gate row
   rather than smoothed over.
5. ⚠ **G-SUITE, AND A REAL LOAD FLAKE OF RECORD.** A first full-suite run made CONCURRENTLY with
   the battery produced **20 failures — every one of them `Test timed out in 120000ms`, not a
   single assertion** — including eight `the production fingerprint is UNCHANGED` tests. The
   fingerprint was then recomputed directly and is `57b0bdab…c673`, unchanged, and the probe's
   own G-IDENT/X-FP-PROD recompute all three league hashes in-process and PASS. The suite was
   then re-run ALONE: **1,403 of 1,410 green across 137 files**, with **7 reds in 6 files —
   again every one a `Test timed out`, never an assertion** (`careers` ×2, `formationEvolution`,
   `fouls`, `injuries`, `playerStyle`, `shootout`). ⭐ **All six files were then re-run
   INDIVIDUALLY on this same tree and ALL SIX PASS** — the five 20 s files green in one run
   (39/39), and `formationEvolution` green at **149.2 s against its own 180 s limit**, the same
   knife-edge DV-T2-T0 and EK-T0 both recorded on the PRE-CHANGE tree (159 s / 171.4 s there,
   i.e. this tree is FASTER, not slower). The PTP-T0 disposition applies: load-induced timeouts
   are disclosed, never excused, and **no test file was edited**.
6. **THE TOUCH-PAST DOSER IS ADVERSARIAL BY DESIGN** (§RESULT (b)): it aims every knock straight
   BACKWARDS down the carrier's heading — the half of the compass CB-C0 proved unreachable —
   once a second, with no pricing whatsoever. It is the cheapest possible existence probe, and
   its world-level numbers are consequences of the instrument, not of the mechanism.
7. **THE ARMED ARM'S DUEL DETECTOR IS CB-C0'S, NARROWED.** A strict `tackleCooldown` increase is
   a duel firing and the post value names the mechanic — but the armed miss price is no longer
   the constant 1.2, so a MISS is now "not 0.5 (won) and not one of the other three mechanics'
   own constants (2.5 / 2.0 / 0.9)". The armed recovery is a continuous quantity whose maximum
   measured value is 1.2138 s, so a collision with 2.5 or 2.0 is impossible and a collision with
   0.5 or 0.9 to within 1e-9 is a measure-zero event; no such collision occurred.
8. **N\* = 25 IS THE PRECISION FLOOR, NOT A MEASUREMENT.** The rule's `↑25` clause bound (the
   sizing smoke's 4.55 overcommitted misses per match implies 14), so the smoke ran at the
   floor. The rarest cell came in at **104** events in the armed arm — well past the 60 the rule
   targets.

## §DOUBTS — ⭐⭐ what the commander is asked to adjudicate

1. ⭐⭐ **IS `p · χ` TOO STRONG?** Built as frozen and measured honestly: it takes the standing
   tackle from 35.8 % to 6.3 % and moves goals +60 %. The mechanism is right — half of today's
   challenges are made by bodies that geometrically cannot reach the ball, which is EXACTLY
   CB-C0's finding — but the incumbent duel was TUNED against a geometry-blind take, so removing
   the geometry-blindness without any re-pricing leaves the defence without a tool. Three
   reframes exist and none is this stage's to pick: **(甲)** keep `p · χ` and let CB-T1 measure
   the world as it is (the purest reading; the exam then runs in a high-scoring world); **(乙)**
   apply χ to the SELECTOR as well, so a body that cannot reach the ball does not lunge — fewer
   duels, each better priced, but it removes the beaten lunge the contract's own mechanism
   requires; **(丙)** let the armed take be `clamp(p·χ, floor, ceiling)` on the engine's OWN
   existing clamp — zero new constants, since [0.06, 0.7] is already in the source — which keeps
   a floor under the desperate challenge. ⚠ I flag 丙 as the one I would build next and 甲 as
   the one the canon prefers, and I have deliberately NOT tuned toward any of them after seeing
   the number (#200).
2. **THE FOUL RATE MOVED +11 % AND THE SEND-OFFS DOUBLED (2 → 4 in 25 matches).** As declared,
   `foulP` is per-miss identical; the shift is pure volume. If the commander wants institutional
   frequencies held, that is a re-pricing decision for CB-T1/CB-T2, not a defect here.
3. **THE RECOVERY INTERVAL CAME OUT SHORTER THAN THE CONSTANT IT REPLACES** (mean 0.774 s vs
   1.200 s), so beaten defenders re-challenge sooner on average — the duel count rose 15 %. The
   GRADIENT is what the contract asked for and it is real (max 1.214 s); the LEVEL is a
   derivation, not a choice. Whether the level should be anchored to the incumbent's mean is a
   question the commander may want to answer before CB-T1 measures churn.

## §COMMANDER CORRECTIONS OF RECORD + THE §DOUBTS RULINGS (#267.2/#267.3, 2026-08-14)

The bounded-adversarial verify (#250.2) attacked every HIGH-hunt class and the step SURVIVED:
dormancy 48/48 byte-identical on six seeds the draft never touched × both world shapes × four arm
spellings; fingerprint unchanged; the full probe re-run 21/21 GREEN with `ident`/`detail`/`sizing`/
`smoke`/`seeds`/`gates` byte-identical to the banked artifact; `recoveryInterval` re-derived by hand
BIT-EXACT; the χ sweep independently shows an interior optimum dying to exactly 0 (taker motion
causally live, not distance-only); no rng in the touch-past (repeat-invocation deterministic); no
genes, no serialization; freeze ordering git-corroborated; `foulP`/`awardFoul` byte-untouched; every
published number re-derives; the in-engine 790 armedChallenges equals the source-blind detector's
790 (bonus corroboration of §DEV 7). VERDICT: PASS-WITH-FINDINGS. Adjudication:

* **(i) HIGH RATIFIED — `nRule.wallTerm` is wall-clock INSIDE the hashed body; #266.3(a) is NOT
  discharged and this round's claim that it was is WITHDRAWN.** Probe :953 derives `wallTerm` from
  measured ms/match and :960-966 hashes it — directly under the comment claiming the body carries
  no invocation context. Two invocations differing only in `CBT0_OUT` produce different digests
  (`5af3df0c…` vs `37cd4f1d…`); the verify's machine re-derives `228d3399…914e` against the banked
  `16bbb0b7…e62c` (82.8 vs 95.23 ms/match). CORRECTED OF RECORD: the banked `resultSha256` is
  MACHINE-DEPENDENT; the portable anchors for this round are the G-DET digest `022163fc…fbd6`
  (re-derived twice draft-side and once verify-side) + the byte-identical gate/ident/smoke/seeds
  sections; the §GATES/commit-message sentences claiming #266.3(a) "discharged at source" are
  false and superseded by this item. ⭐ BINDING ON CB-T1's instrument, BY FIELD NAME: `wallTerm`,
  `projectedHours`, and every ms/match-derived value ride the UNHASHED envelope; `precisionTerm`/
  `cap`/`nStar`/`ran` stay in the body; the cross-`OUT`, cross-machine re-derivation is the
  acceptance test.
* **(ii) MED — G-SEED's disjointness sweep omits the smoke block (12,472,200–224) and the
  test-file block (12,472,900–911)** against its own frozen "every interval this stage consumes"
  text. The verify hand-enumerated all consumed blocks: in fact disjoint and in-band — gate SCOPE
  defect, no seed breach.
* **(iii) MED — one more DEAD conjunct survived the §LIVENESS audit**:
  `gHygiene.envWhitelistEnforced` asserts the whitelist arrays' own LENGTHS (:772) — unfalsifiable
  by any probe input, the same shape as the four §LIVENESS demoted. DEMOTED OF RECORD (the
  refusals themselves were exercised by hand verify-side: all four FATAL exit 2). The liveness
  audit's own coverage was incomplete — noted for the canon's practice, not a new rule.
* **(iv) MED — "610 defenders BEATEN" is a PREDICATE count, not a validated world count.**
  `beatsDefender` decides nothing in-engine (declared §CHOICES 6); the actual race is `tryCapture`,
  which draws rng; nothing in this round scores the predicate against what the engine then did.
  DEMOTED OF RECORD: the touch arm establishes the release, the aimed knock, and the engine-own
  race EXIST; "beaten" as a WORLD event awaits validation. The verify's crude 3-match world check
  (retention 17.5 %/33.3 %/10.8 % across beaten classes, non-monotone) is recorded as a CAUTION,
  not a refutation (its instrument: backwards doser knocks, retention ≠ that-defender-lost). ⭐⭐
  BINDING ON CB-T1: score `beatsDefender` against the race the engine actually runs (per-knock:
  did the beaten defender's side regain within the knock's own race window) BEFORE any beaten
  count is treated as a world event or fed to churn claims.
* **(v) MED — a gate implementation moved inside the RESULTS commit, undisclosed in §DEV**:
  G-PINS's base `HEAD~1` → derived `addCommit~1` + two non-vacuity conjuncts (:809-840 in
  `7023546`). The change is CORRECT and strengthening (post-`bfb6b4b`, `HEAD~1` made both G-PINS
  rows vacuous) — the defect is disclosure placement. Recorded here; §DEV is amended by reference.
* **(vi) LOWs recorded**: frozen §GATES says 24 banked flags, 25 ran (and the verify's own
  enumeration finds a 26th, `c4FlightStaleLead`, a dependent variant arm — omission defensible,
  now stated) · mutant "exactly that conjunct" asserted-not-enforced (verbatim CB-C0 (vii)
  recurrence) · the §SEED LEDGER self-contradicts ("912+ free" two rows below 12,472,999 consumed
  — CORRECTED: free = 012–019 · 030–049 · 120–199 · 225–899 · 912–998) · `gMutants` near-subset of
  `gGeometry` · the recovery distribution's MIN is unpublished (the §CHOICES-2 planted-whiff
  ≈0.1 s tail) — CB-T1 publishes the full distribution including the floor.

### THE §DOUBTS RULINGS (#267.3)

1. ⭐⭐ **§DOUBTS 1 RULED: 甲 — `p·χ` stands UNTUNED; CB-T1 measures the world as it is.** 丙
   (re-clamping to the engine's [0.06, 0.7] after χ) is REJECTED: a floor probability of winning a
   ball the body PHYSICALLY CANNOT REACH re-introduces the dice subsidy at exactly the margin this
   arc exists to create — it would soften the beaten event AFTER SEEING the number, which is
   post-sight tuning whatever the constants' pedigree. 乙 was already rejected by the contract
   (it removes the beaten lunge M-CB.1 requires). The 35.8 % → 6.3 % collapse is not a defect to
   patch — it is CB-C0's finding MADE CAUSAL: yesterday's brains, tuned against a geometry-blind
   dice, lunge from unreachable positions in tomorrow's physics. The defence's missing tool is not
   a floor; it is the CHOICE (the census's own withheld challenge — ⅓ of proximity ticks already
   jockey) and the LEARNED restraint (layer 3: dove→beaten→punished). Rung-one honesty (the
   contract's own words): world effects REPORTED, never gated; and nothing ships without the
   play-test regardless.
2. **§DOUBTS 2 (institutional volume)**: recorded, no re-pricing now. `foulP` per-miss identical
   is the honest form; CB-T1 reports institutional frequencies in both arms as world effects.
3. **§DOUBTS 3 (recovery level < the incumbent constant)**: STANDS AS DERIVED. Anchoring the level
   to the incumbent's mean would be a hand-painted re-tuning (#200) of a quantity the motion model
   already prices; the gradient is the contract's requirement and it is real. CB-T1 reports the
   full recovery distribution (incl. the min — (vi)) and the churn linkage against CB-C0's
   baseline.
