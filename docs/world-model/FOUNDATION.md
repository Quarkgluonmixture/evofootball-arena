# World-Model Foundation — the player as a physical subject (S1)

> **Authority:** [`VISION.md`](../VISION.md) is the gold standard. This doc is the
> **engineering plan for the physical substrate (S1)** — it operationalises the part
> of [`SUBSTRATE-MAP.md`](../SUBSTRATE-MAP.md) that was under-characterised: the player
> is currently a *point*, not a *body*. Ratified 2026-07-20 (user + GPT + Claude) after
> a full audit against EA FC 26, eFootball, FM, FIFA/IFAB, football tracking papers, and
> RoboCup. Acceptance methodology: [`PROBE-CONTRACTS.md`](../PROBE-CONTRACTS.md).
>
> **This SUPERSEDES the earlier "slice-1a.2 = 50-50 winner resolver" plan.** We do NOT
> design "who wins the contest" next; we first make the player a physical subject — but
> only the **minimal embodied part** the current football problems actually need.

---

## 0. The verdict

- **Pause the 50-50 winner resolver.** Building "compute a duel score → hand the ball to
  the winner" — even with a delay — is still over-gamified. It conflates three different
  things: **first contact ≠ winning the duel ≠ establishing stable control.**
- **But do NOT jump to rigid bodies / skeletons / Box2D / Unity.** The right target for
  EvoFootball is a **Kinematic Disc + Oriented Interaction Shell** (§3).
- **And do NOT run the full W0–W7 body campaign serially** — that would defer the
  emergent-tactics work (S3–S8), be invisible to the player for months, and let the
  contact solver disturb the play-test-approved density before any payoff. Instead run a
  **narrowed Minimum Embodied Contest Slice** (§5): only the foundation the current
  football problem needs, then immediately cash out visible behaviour.

## 1. The real distinction (why this layer, framed correctly)

An earlier framing ("Path A = emerges from geometry, Path B = a formula") was too clean —
**the body model is also all formulas** (core radius, shield angle, contact resistance,
PBD correction, touch sector, control threshold — all human-designed). Geometry doesn't
magically grow football. The real distinction is:

> **Which causal variables we explicitly put into the world state, and whether those
> variables are sufficient to support the COUNTERFACTUALS we care about.**

- **A point-model contest resolver** ("touch≠control on points") approximates the
  *result* from existing state (ETA, ball speed, attrs, pressure). It can be clean. But
  it **cannot answer**: *same ETA and attrs, but turn the carrier's body to shield the
  ball — should the outcome change?* — because "a body occupies the access route" is not
  a fact in the world.
- **A body model** adds new *facts* (a body occupies space; has a direction; there is an
  access line between opponent and ball; someone can block it; contact changes vel/pos/
  balance; the foot can reach though the body-centre doesn't arrive first; first contact
  ≠ control). It **provides the intermediate state that produces the result**, so the
  counterfactuals become answerable.

**The counterfactual test is the operating criterion** for this whole slice:
- **What to ADD to world state** (§5 M2): only facts that unlock a counterfactual the
  football needs (body-on-the-access-line), nothing more.
- **The probe's teeth:** `contest-anatomy` must measure the counterfactual directly — does
  turning the body / holding position actually change who wins the ball — not just tally
  results.
- **The stop-rule** (§5 M4): deepen the body model ONLY when a counterfactual the football
  needs is *unrepresentable*. Height/weight, full shoulder impulse, stumbles, cleat-turf —
  all wait for a probe proving they block a new behaviour.

> **Good abstraction is not refusing formulas — it's making the formulas act on the
> CORRECT causal layer.** Emergence is not "better the deeper you go."

⚠ **Correction to an earlier overclaim:** shielding / seal-out / second-ball are NOT
pure byproducts of body-occupies-space that "need no code." Body geometry supplies
**possibility + constraints only**. Shielding still needs perceive→decide-to-turn→choose
orientation→adjust distance→(body blocks)→(keep balance)→next choice — only the
parenthesised steps are the body substrate; the rest is S3–S8. **The body model makes
shielding POSSIBLE; the decision engine decides whether a player DOES it. Neither
replaces the other.**

## 2. Current-code reality (confirmed 2026-07-20)

- **Player = a POINT** with `pos/vel/heading`. `heading` is used for kick aim + first-touch
  misalign, NOT body volume/blocking. Movement = desired-velocity → **isotropic accel
  envelope** → position; heading rotates separately (forward sprint / lateral / backward /
  facing-one-way-moving-another share one accel envelope).
- **Player–player collision = isotropic, massless circle push** (`resolveOverlaps`,
  `Match.ts:1897`): centres closer than **`PLAYER_MIN_DIST = 1.05`** (`constants.ts:244`)
  → each retreats half; **no mass / strength / facing / momentum, and position only — it
  does NOT touch velocity** (except a GK in-box holds ground, opponent bounces ×2). → the
  "position pushed apart but velocity still driving in → re-penetrate next frame" jitter /
  treadmill-legs / sticking root.
- **Ball capture** = for a loose ball, nearest eligible player within **`CONTROL_RADIUS =
  1.25`** becomes owner (`tryCapture`, `Match.ts:1803`), gated by speed/kickCooldown/stun.
  For an *active pass* it is already richer (intended-receiver higher speed cap, blind-side
  reaction, first-touch fail). The missing thing is a **unified model of multiple players
  competing for CONTACT ELIGIBILITY from one snapshot.**
- **`PITCH_SCALE` is NOT a pure density knob** — it multiplies `PITCH_LENGTH/WIDTH`,
  `GOAL_WIDTH`, `BOX_DEPTH/WIDTH`, `CENTER_CIRCLE_R` together (`GOAL_HEIGHT 2.44` is fixed).
  So past scale experiments confounded per-player-space + goal-relative-width + box +
  shot-angle + goal-distance + speed-relative-to-length.
- **Ball has no explicit radius**; out-of-play / goal use the ball **centre** vs `HALF_L`
  (`Match.ts:1067`), not whole-ball-over-line.
- **`strength` is a coefficient without body-layer causality** — it lowers standing-tackle
  dispossession + enters aerial scoring, but cannot express "holds position / gets shoved
  off / screens the ball with the body / loses balance on contact." A probability patch,
  not an embodied cause (more misleading than a dead attr).

## 3. Target: Kinematic Disc + Oriented Interaction Shell

- **Core disc** — stable, cheap, deterministic non-penetration (keep the circle; our
  determinism + perf + phone frame-rate all depend on it).
- **Body direction** (`bodyDir`) — independent of velocity direction; defines front / side /
  back.
- **Interaction shell** — foot reach, shoulder band, extension, shield/access line.
- **Contact response** — changes position, velocity, balance — NOT ownership directly.
- **first contact / winning the duel / establishing control = three distinct events.**
- **The ball stays an independent physics object**, not a prize the contest algorithm
  hands to someone.

**Rejected alternatives (and why):**
- *Weighted circle* (add strength to the equal push): still can't express body-on-the-
  ball-line, front vs back, foot-reach, shoulder-vs-back contact, legal playing distance.
- *Oriented ellipse / capsule as the MAIN collider*: rotation creates new overlaps,
  dense-area interlock, solver instability, still doesn't separate foot vs shoulder contact
  or fix possession semantics.
- *Full rigid body* (DeepMind humanoid): a different project (ms-level joint control →
  team decisions); throws away determinism/explainability.
- **RoboCup 2D** is the reference proof: circle body + body-direction + directional dash +
  inertia + kickable margin + noisy vision give real depth. EvoFootball keeps the circle's
  stability and adds directional interaction queries.

## 4. The abstraction boundary (how deep "real, emergent substrate" goes)

**In the substrate** (world facts): bodies can't interpenetrate · bodies have direction ·
a body can block the ball's access line · contact changes pos/vel/stability · first touch ≠
control · the ball is an independent object.

**Stays abstracted** (probability / skill formulas): which foot, joint trajectories, exact
shoulder impulse, animation stumbling, muscle forces, cleat-turf contact.

> EvoFootball does not need to simulate a pair of legs. It must simulate a football
> **subject** with body direction, positioning, inertia, touch range, and a control process.

## 5. Build plan — Minimum Embodied Contest Slice

Run in order; each stage names its acceptance. **W3–W7 of the full audit are NOT the next
months** — this narrowed slice is.

- ✅ **M0 — representation + param authority (BYTE-IDENTICAL). DONE 2026-07-20.**
  1. This doc (+ split into `docs/world-model/` family as it grows).
  2. **Decomposed `PITCH_SCALE`** into `FIELD_SCALE / GOAL_AND_BOX_SCALE / BODY_SCALE /
     CONTROL_REACH_SCALE / SPEED_TIME_SCALE / SURFACE_PROFILE`, backfilled to today's
     effective values: field `0.70`, goal+box `0.70`, body/reach/speed-time `1.00`, and
     the existing friction/bounce/spin surface. `PITCH_SCALE` remains only as a legacy
     env fallback for old probe commands; no source consumer reads an ambiguous shared
     scale. Future scale work is factorial, not one entangled knob. NB: the current
     `FIELD_SCALE 0.70` density is **play-test-locked** — this only untangles the knob,
     it does not reopen that decision.
  3. **Representation layer:** `bodyDir` semantics, `coreRadius`, `BALL_RADIUS` (~0.11 m,
     IFAB), a `BallPhysicalMode`, contact / ball-access geometry helpers, a `ContestEpisode`
     ledger. `possessionPhase` already exists (committed `4e910ce`). Nothing in the
     decision path reads the new facts yet. Landed as derived getters + pure helpers in
     `src/sim/physical.ts`; `ContestEpisode` is type-only and accepts any number of
     contenders. **Proof:** 450/450 tests (443 existing + 7 M0 invariants), clean tsc/build,
     and both before/after save fingerprints are byte-identical (`2821d2d9…` at seed 1337,
     `8d0cfb08…` at seed 42). Paired same-machine perf against `f3c29ad`: 5.4→5.5µs/step
     and 14.7→14.4 matches/s (≈2% wall-clock noise; phase profile unchanged), profiler
     determinism OK; the frozen `docs/perf/baseline.json` remains untouched.
- ✅ **M1 — contact solver: kill interpenetration velocity (FIRST BEHAVIOURAL). DONE
  2026-07-20; §2 USER-GATED.** `resolveOverlaps` keeps the same position separation, one
  fixed pass, and fixed pair order, then removes only closing relative velocity along the
  contact normal. Equal bodies share the correction; the opponent takes the whole correction
  against an anchored in-box keeper. Tangential and already-separating motion are untouched;
  there is no convergence tolerance or early-stop loop. **Direct mechanism proof:** an 8m/s
  closing pair leaves with 0m/s inward speed; 120-frame mean pre-solve penetration fell
  `0.133333→0.007517m` (-94.4%). Same-seed contest/churn stayed neutral while the contest
  pinball extreme fell `19→7` (mean `1.47→1.45`). Gates: clean tsc/build · 453/453 tests ·
  repeated fingerprints stable (`6f58fa45…` seed 1337, `eda26d6f…` seed 42) · profiler
  determinism OK · 5.28µs/step vs frozen 5.32 (14.4 matches/s, equal to the same-session M0
  run) · 8-season calibrate at two seeds 2.22/2.30 goals per match. ⭐ **User play-test
  accepted:** players felt “像抹了一点润滑油的轻微弹性球一样”; no sticking, congestion, or
  density veto was reported. That feel is the M1 baseline. M2 may now start as the next
  isolated lever.
- ✅ **M2 — ball-access / screening world-fact. DONE 2026-07-20.**
  `directBallAccess` is the one pure query: *from this body's position + direction, can it
  directly contact the ball?* It composes ball distance and front/side/back sector, legal
  oriented reach, the nearest opponent core on the actor→ball line, `mustTurn`,
  `mustGoAround`, and `canDirectlyContact`. Front + side preserve the old 1.25m centre reach;
  rear contact keeps 90% of the extension outside body+ball radii (a close back-heel works,
  an edge-of-envelope ball directly behind requires a turn). An opponent still occupies the
  access line while cooldown/stun prevents its own claim; teammates do not deny access.
  `tryCapture` now consumes this fact for ground control/deflection eligibility **only** — it
  does not change the existing nearest-player order, first-touch roll, or aerial paths; the
  query itself never hands out ownership (M3 remains untouched). **Counterfactual proof:** at
  the same 1.2m distance,
  front/side are directly reachable while back requires a turn; holding an opponent core on
  the line flips direct access yes→no, moving it 0.7m laterally flips no→yes. Live census:
  access-gated lingering is only 0.35s/match (0.2% of live frames), so the fact bites without
  dominating play. **Honest tuning:** the first side/back extension factors 0.85/0.45 failed
  the existing policy-bite and stamina-economy hard gates; they were rejected, not papered
  over. Final 1.00/0.90 passes both. Same-seed M1→M2 guardrails: contests 17.57→17.23/match,
  pinball max 7→5, churn goals 2.41→2.42, mean spell 5.54→5.59s. Gates: clean tsc/build ·
  457/457 tests · repeated fingerprints stable (`d59185df…` seed 1337, `3c82b572…` seed 42)
  · profiler determinism OK · 5.12µs/step vs frozen 5.32, 15.2 matches/s · two-seed
  8-season calibrate 2.38/2.35 goals per match, both 50/50 possession. No shoulder-charge,
  balance, mass, contact-claim, or touch→control change yet.
- ✅ **M3 — touch ≠ control. DONE 2026-07-21.** `contact claims` are collected from one
  snapshot for ALL eligible ground players (no cap and no pre-selected winner). Reach margin
  determines physical first contact; contact changes the independent ball's velocity but
  never awards ownership. Stable control is attempted three ticks later, so a different or
  third player may recontact and establish control. `ContestEpisode` remains a passive ledger
  behind `traceContests`, never an outcome script. In 120 matches all 14,029 episodes resolved:
  1.25 contacts/episode, 0.25 recontacts (max 8), 97.5% contact→control, first contact differed
  from final controller 10.5%, and a third-or-later player controlled 0.4%. Outcome mix was
  70.4% clean / 15.1% poke / 4.7% deflect / 9.8% neutral; the worst body-stuck mean was
  0.370s. Gates: clean tsc/build · full sim suite 461/461, plus the final focused world-model
  and render suite 61/61 · repeated fingerprints stable (`57b0bdab…` seed 1337,
  `b13d6c18…` seed 42) · perf 5.37µs/step vs frozen 5.32 (profiler determinism OK) · default
  calibrate 2.39 goals/match, with two extra seeds 2.14/2.84. A later full-suite runner lost
  its terminal result after exit; per the retry policy it was not looped—the changed render
  contracts were run directly and the production build is clean.
- ✅ **M4 — play-test + probes, then RETURN to S3–S8. DONE 2026-07-21.** The first
  play-test exposed a presentation lie: the physical ball is radius 0.11m, but 3D rendered
  0.42m and displaced an owned ball 0.45–0.75m away from its authoritative sim position.
  Outfield rendering now uses the true ball position; 3D radius is a user-accepted 0.286m
  readability shell (2.6× physical, still below the old 0.42m), 2D is ~2.86px, and actual
  loose contacts show a white pulse or yellow tackle pulse with a distinct heavy-touch cue.
  These are render-only and leave the sim fingerprint unchanged. **The bounded M3b 忠于脚
  spike did not pass and was fully reverted.** Continuous carry offsets raised max contact
  chains 8→28, then phase-locked an episode to 141. Releasing every running close touch
  produced 54.60 touches/match, goals 2.63 and an 85-contact chain; moving the permanently
  owned ball to physical foot distance alone still raised the chain to 32. A density-narrowed
  discrete release reached 27.55 touches/match but exposed a 63-contact arrival. Holding the
  ball at the boot for a three-tick owned phase looked mechanically safer (75.42 contacts,
  only 3.76s/match at the boot; pinball max 6), but failed the existing policy and stamina
  directional contracts. A fixed first-contact control deadline capped M3 recontacts at 5,
  yet independently failed the player-style→selection contract. No assertions or economy
  thresholds were weakened; every candidate and the deadline change were removed, and the
  committed M3 fingerprint was restored. **Stop-rule applied:** true foot↔knock cadence remains
  a documented substrate gap, not a shipped fake. It needs a future control-state design that
  passes policy expression and selection—not another local distance/timer tune. The body-model
  campaign now stops here and returns to the mainline: **S3–S8 decision engine**.

## 6. Priority — the body model is a LOCAL substrate, not the mainline

The project's north star (VISION §0/§1) is **emergent, identifiable tactics** — that's
S3–S8 (perception / prediction / affordance / off-ball / coordination), and it's the half
of §2 ("no tactics / clumping") the body model does **not** fix. The body model fixes the
*other* half — **ugly contests + instant magnetic possession** — plus it activates
`strength` and gives a real physical-style axis (feeding §4 diversity). So:

```
Minimum Embodied Contest Slice (M0–M4)
  → fixes ugly contests + instant possession flips
  → RETURN to Pass–Arrival–Contest / S3–S8 (the mainline)
```

**Do NOT, after M3, keep drilling into height/weight, full shoulder systems, stumbles,
dozens of tackle contacts, complex player shapes, or surface physics.** The body model's
ROI must serve watchability + realism + style diversity, but it must not usurp the mainline.

## 7. Probes

`contest-anatomy` (frozen baseline in [`../baselines/BASELINE-NOW.md`](../baselines/BASELINE-NOW.md))
is the M3 "before". M3 adds: `firstContactWinner`, `finalController`, `possessionTeam`,
`firstContactToControlRate`, `firstContactWinner ≠ finalOwner %`, `thirdPlayerFinalControl %`,
recontest count, clean-control / poke / deflection mix, body-stuck duration. The two
load-bearing new metrics — `firstContactToControlRate` and `firstContactWinnerEqualsFinalOwner`
— are exactly what EA FC / eFootball repeatedly re-tuned (tackleback, win-but-can't-keep,
body-sticking).
