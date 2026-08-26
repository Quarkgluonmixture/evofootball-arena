# GC — THE GROUND-CORRIDOR CONTRACT (the pass pays for the bodies it would strike)

> Bound by **commander ruling #343** (2026-08-26), consuming: the user's play-test RED
> (#341, verbatim: 「但是弹身体感觉很影响比赛」), the user's generalized corridor mandate
> (#330: passes AND shots), and **BK-C2 — THE CAROM CENSUS** (#342 item 2, the design
> facts this contract exists to consume). Arc prefix **GC**; slices GC-T0 (the dormant
> seam) → GC-T1 (the exam) → the entry rung → **exit = the play-test (USER GATE)**.

## §-1 WHAT THIS SLICE IS FOR

World 9 made bodies honest (the contact law: 球会撞到人) and the user ratified the law's
faces (传球像人 · 门将球合理了, #341). But the GROUND chooser still selects lines on the
pre-contact-law map, and the user's eyes found the bill: 弹身体很影响比赛. BK-C2 sized
it — 95.8/95.7 % of caroms ride ground flights; over HALF happen on lines the chooser's
own gate called OPEN; on those open lines the shell-blocked vs shell-clear carom rate is
**0.293 vs 0.089 (w9) · 0.286 vs 0.086 (w11), intervals disjoint in both arms** — a
~3.3× discrimination sitting in state the chooser already holds. This slice wires that
discrimination into the price. ⛔ NO ARC IS RAISED, NO LINE IS BANNED (#328 item 3's
form): the price makes striking a body PAY, and the chooser — comparing every candidate
at the same argmax — decides.

## §0 THE PRIOR-ART RESOLUTION (ruled at #343, code-facts of record)

The dormant DV ground exposure limb (`deliveryRiskPrice` → `flightExposure`,
deliveryValueSeat.ts) already prices ground candidates at this exact seat — but its form
CANNOT carry the census's discriminator: (i) it reads **opponents only** (the parameter
is `opp.players` at PlayerBrain's groundCandidate call site), and BK-C2 (ii) shows
40.9/43.1 % of attributable caroms strike the passer's OWN TEAMMATE; (ii) its geometry
is the INTERCEPTION WINDOW (`1 − clamp01((d − topSpeed·t)/4)`) — "can he close on the
line" — while BK-C2 (iii) shows cooldown-at-choice and closing ability predict nothing
(the near-empty hazard bin): what predicts is STANDING GEOMETRY, the census's binary
shell predicate. So: **the DV limb stays byte-untouched and dormant** (its exams' frozen
results remain re-derivable), and the ground shell price enters as a **separate term at
the SAME seat and the SAME born-absent gene** — one currency, one argmax, no second
scoring path, no retirement of anything (M-DF.2's two-compensators discipline is not in
play: nothing hand-written is being replaced here; the stale map term `lane` stays —
it prices interception-openness, a different real thing).

## §2 MECHANISMS

* **M-GC.1 THE SEAT.** The ONE hoisted `groundCandidate` pricer (the DV/PTP/DLC/CB
  precedent: every ground candidate — to-feet, led, strike-plane, knock — flows through
  it). The price is the LAST subtraction, beside DV's: `s″ = s′ − wExposure ·
  groundShellHazard(from, aim)`. One statement in `src/**`, one flag fork.
* **M-GC.2 THE FORM — the census's own discriminator, translated, nothing invented.**
  `groundShellHazard ∈ {0, 1}` = BK-C2 §P.4's shell predicate: over ALL non-sentOff
  bodies on BOTH teams, minus the kicker, minus the INTENDED RECEIVER (BK-C1 §4(ii)'s
  arriving rule, the census's pre-registered exclusion — without it 74/74 smoke lines
  read BLOCKED), a body blocks when the pass line passes within `coreRadius +
  ball.radius` of him SHORT of the target (`along < d − shell`). The shell is the
  contact law's own clearance expression; the both-sides body set is BK-C2 §CORR 3's
  ADOPTED departure from BK-T3's opponents-only form — adopted by measurement (the 2-in-5
  teammate face), never taste. The hazard carries NO scale of its own (`score −
  w·hazard`, the DV limb's literal form kept literal). The gene is **`dvExposureWeight`**
  — the SAME born-absent gene the lofted corridor prices with, so one knob prices the
  whole corridor family (world 11 already pins it 0.5) and a zero-gene world prices
  byte-identically with the path LIVE (G-ZERO, measured never assumed).
* **M-GC.3 THE FLAG.** `bkGroundCorridor` — new, additive, dormant, default `false`,
  never env-armed, never bundle-defaulted; byte-identity with the flag off; the shipped
  fingerprint untouched; pin suite from birth (canon). Perception: the hazard reads the
  SAME players collections the groundCandidate loop already holds (snapshot-borne where
  the percept world is armed — the byte-identical-in-source-and-snapshot convention at
  PlayerBrain L155-159); NO new perception channel.

## §3 INSTRUMENTS & THE ARC

* **GC-T0 — THE DORMANT SEAM** (the DF-T0/DV-T0 form): the flag + the hazard function
  (exported beside the bkCorridor family in deliveryValueSeat.ts) + the ONE pricer
  statement + the seam map with occurrence counts + the pin suite (G-OFF byte-identity ·
  G-ZERO · G-BORN · mutants) + fingerprint receipt. Zero behaviour change anywhere.
* **GC-T1 — THE EXAM** (frozen §P at dispatch; scored on virgin seeds): arms = the
  world-11 stack SHUT vs ARMED (+`bkGroundCorridor`, gene at the world pin 0.5).
  **H-GC.1**: (a) ground-flight strikes per match FALL RESOLVEDLY (BK-C2's own faces:
  strikesPerMatch ground share · caromedGroundOnOpenLaneShare); (b) ⭐ **NON-SUPPRESSION
  — the BK-T4(b) lesson made a conjunct**: ground passes per match hold a frozen
  non-inferiority band from the shut arm's own interval (the cure must not be 「别传了」),
  with completion and possession-spell faces REPORTED beside it; (c) the TEAMMATE-strike
  face falls (the side-blindness the form exists to see); (d) the lofted-family controls
  stay inside the shut arm's intervals (the ground price may not reach the flighted
  lines). REPORTED: the interception-decomposition face (BK-C2 (vi)) · ⭐ THE SEASON
  LADDER with the gene EVOLVABLE (probe-side ladder ecology, the MT-T2/BK-T4 idiom;
  goals × generation per the house form; the fitness-visibility question REPORTED, never
  gated). Composition proof per canon: the armed world is the world-11 stack — the
  composition the entry would ship — proven at that composition first.
* **THE ENTRY RUNG** (only if H-GC.1 lands): `?a4world=12` = world 11 + `bkGroundCorridor`
  (the gene already pinned by world 11's own writer), the entry-rung form of record;
  blurb carries the honest costs from GC-T1's own faces. **Exit = the play-test (USER
  GATE)**: 弹身体的画面少了吗 · 传球还敢往人堆里穿吗(该穿的时候) · 比赛因此更像足球了吗.

## §4 NON-CLAIMS & HELD DOORS

No promise the carom disappears (the price is a price, not a wall); no graded-hazard
claim (the binary discriminator is what BK-C2 measured — a graded refinement is a NAMED
DOOR only if GC-T1's red demands it); no claim about what a slower ball would do (speed
is the dormant PW chooser's door, observationally correlated at BK-C2 (v), untouched
here); **shots are OUT OF SLICE** (#330's mandate scopes them to their own rung — the
shot chooser already prices `effectiveBlockers`, a different seat and a different
census); DV+GC double-arming is DISCLOSED as unmeasured composition (no entry world arms
both; an exam that wants it names it); nothing ships without the play-test.

## §6 VISION AUDIT (the #91 form)

* vs 底座给能力: the price is a CAPABILITY consuming the world's own geometry (the
  contact law's shell) at an evolvable gene; content stays per-team. PASS.
* vs #200 (no taste constants): shell = the contact law's own clearance; the exclusions =
  BK-C1's own arriving rule; the scale = the literal `score − w·hazard` form; the gene ∈
  [0,1] born absent. The ONLY judgement is the binary form itself — and that is the
  census's measured discriminator, cited not invented. PASS.
* vs tactics-emerge: the chooser still compares every line at one argmax; a team whose
  gene is 0 lives in the old world; evolution may decline the gene (the #167/BK-T4 echo
  — REPORTED, never nudged). PASS.
* vs the assembly law: one seat, one statement, the existing hoisted pricer — no
  duplicated scoring path. PASS.

## §7 REALITY AUDIT (the #201 rule)

* Real passers see the bodies on the line and thread or decline deliberately — the
  through-window ball is played WITH the window in mind, not through a ghost. A pass
  cannoning off your own teammate's back is coaching-error grade in real football; the
  2-in-5 teammate face is exactly the unreality the user's eyes caught. PASS.
* The price consumes only what a real passer could see (standing geometry at the moment
  of the kick, through the chooser's existing percept channel) — no oracle knowledge of
  cooldown states (BK-C2 (iii): cooldown-at-choice predicts nothing, so the form does
  not read it — the honest AND the real choice coincide). PASS.
* Honest limit: real players also play softer/faster balls to beat the window — that
  lever is the dormant PW chooser, out of slice, named.
