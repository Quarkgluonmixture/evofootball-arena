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

*(filled in from the committed artifact after the receipts ran; every number here is quoted FROM
`docs/world-model/data/cb-t0-dormant-layer1-seam.json`.)*
