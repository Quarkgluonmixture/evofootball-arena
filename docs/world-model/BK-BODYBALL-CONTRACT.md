# BK — 身体与球的诚实 (THE BODY-BALL HONESTY CONTRACT: the kick obeys the body, the ball meets the body)

> Opened by the USER in the #303 aftermath (2026-08-19, verbatim: 「感觉现在有很多反人类的
> 传球,身体没转过来球就正常传出去了,这个整个射门和传球别扭和方向等得和现实足球重新对一下」
> + 「这个球穿身体还影响拦截抢断等」 + the GK-loop observation: 「门将高空长传——打到后卫/
> 对面前锋身上/头上——然后再弹回门将,或者由于后卫都被前锋盯紧,给后卫然后瞬间被断」);
> bound by ruling #304. THE THEME IN ONE SENTENCE: the ball and the body ignore each other
> in BOTH directions — a kick releases no matter where the body faces (orientation is only
> a soft price), and a flying ball touches a body only when a behavioural handler rolls
> dice (no contact law; a literal dead band) — and the GK punt loop is the composite the
> user watched.

## §0 The diagnosis chain (user observation × verified mechanism, #303 item 3 / #304)

* **OUT (the kick)**: NO facing gate exists anywhere. Misalignment discounts chooser
  scores and prices power (max −22 %, `orientationPowerMul`, mechanics.ts:88–91) and
  noise (`orientationNoiseMul`, :84–86) — but a fully-reversed body kicks on the same
  tick as an aligned one; the wind-up's inputs exclude orientation (Match.ts:166–172).
  反人类的传球 is TRUE BY CONSTRUCTION. The missing account is TIME: the body turns at
  the shipped `TURN_RATE = 6.5 rad/s` (Player.ts:17), so a fully-reversed strike owes
  π/6.5 ≈ 0.48 s ≈ 29 ticks that today nobody pays.
* **IN (the contact)**: the ball meets bodies ONLY through behavioural handlers
  (block/save/aerial/capture, Match.ts:3524–3532). A failed blind/speed roll lets the
  ball roll straight through a defender's 1.25 m reach (Match.ts:4692–4702); a body in
  kick cooldown is contact-INVISIBLE (Match.ts:4562); z ∈ (1.30, 1.35) m is a DEAD BAND
  no one can touch, and above 2.55 m nothing can (constants.ts:184–216). 球穿身 corrupts
  exactly the surfaces the user named — 拦截/抢断 outcomes are roll-caused, not
  body-position-caused, at the margin.
* **THE COMPOSITE (the GK loop)**: the punt pays NO landing price (target = progression +
  receiver strength, PlayerBrain.ts:1029–1051; the throw pays a laneOpenness gate at
  :1016, the punt never does) into a per-tick aerial argmax where DF carries the top role
  weight (mechanics.ts:772) → 打到人身上再弹回门将. The short ball goes to a MARKED
  defender → 瞬间被断 — that half is the BUILD-UP disease's territory (M-BK.4 scopes it
  OUT honestly).

## §1 The claims

* **H-BK.1 (scored, mechanism grain, kick side)**: with the FACING LAW armed, the
  kick's timeline absorbs the required body turn — release-facing misalignment collapses
  toward the strike cone as a DISTRIBUTION (the census's before/after face) at an honest
  TIME cost, never a ban; deliberate high-misalign strikes (the backheel class) survive
  as a priced choice with usage > 0.
* **H-BK.2 (scored, contact side, its own slice)**: with CONTACT HONESTY armed, a ball
  crossing a body's lawful reach resolves through ONE contact channel — through-body
  flight events and dead-band pass-throughs collapse to ~0 by construction; rolls may
  keep deciding contact QUALITY, never the EXISTENCE of the chance.
* **H-BK.3 (REPORTED, never gated)**: the GK-loop faces (punt → opponent-first-touch
  share · bounce-back-to-GK cycles · short-ball turnover-within-N-ticks) + the standing
  institutions (R-乙 chain faces · the corridor rung · direction mix). Direction
  pre-registered: once landing/contact is physically honest, the EXISTING pricing
  (which already prices interception risk) should see the punt's true cost by itself —
  distribution mix may move with zero hand-nudging. If it does not, that verdict routes
  to the pricing shelf, not to a behaviour table.

## §2 Mechanism (M-BK)

* **M-BK.1 — THE TURN IS THE COST, NEVER A BAN**: required rotation to bring the target
  into the strike cone is DERIVED from the shipped `TURN_RATE` and folded into the
  shipped wind-up idiom (`c7WindupTicks` already prices ONGOING turn — the facing law
  adds REQUIRED turn; same clamp discipline). The cone itself is derived from the
  engine's own algebra (where the existing orientation prices bite), never taste (#200).
  Strikes beyond the cone stay POSSIBLE at their existing power/noise price — real
  football has backheels; selection decides who uses them.
* **M-BK.2 — ONE CONTACT LAW**: flight resolves against body reach through a single
  lawful channel; the z bands must PARTITION (the (1.30, 1.35) gap closes by
  construction); the M1/M2 oriented-shell machinery (`directBallAccess`) is the natural
  home. The exact solver design is BK-C0's OUTPUT, not this contract's pre-commitment.
* **M-BK.3 — PRICES FOLLOW PHYSICS**: once contact is honest, the punt's landing contest
  enters the EXISTING pricing surfaces (the throw's laneOpenness precedent) — no
  GK-specific behaviour table, no new pricing table.
* **M-BK.4 — SCOPE & DEBTS**: the marked-defender half of the GK loop (后卫都被盯紧) is
  movement/support territory (EK-holds · CTB · coached-shape doors) — this arc does NOT
  promise it and says so to the user. No perception (INFO slice 2 = its own arc; noted:
  the facing/turn substrate FEEDS the future scanning slice — a body that must turn to
  kick is the same body that must turn to LOOK). The round-body render slice rides
  separately (presentation, already authorized). Flags off ⇒ byte-identity per seam;
  composition proof at the CB/L3/PC stack (canon, M-BU.2 lineage); pin suites from
  birth (#297 item 7).

## §3 Instruments & the arc

* **BK-C0 — THE BODY-BALL CENSUS (instrument-only, first)**: (a) release-facing census —
  misalign-at-release distribution × action class × outcome (how much of the world is
  反身, and what it costs today); (b) through-body flight census — per-tick sweep of
  flights crossing a lawful reach with no handler contact · dead-band occupancy time ·
  cooldown-invisibility contacts; (c) the GK-loop ledger — distribution mix × landing
  first-touch side × bounce-back cycles × short-ball turnover-within-N-ticks (H-303a's
  census, absorbed here); (d) the turn-cost arithmetic — the TURN_RATE-derived
  cone/tick table (the λ_LIN idiom: find where the engine's own prices bite, cap at the
  edge, invent nothing). The census PICKS slice order and the cone/solver design.
* **BK-T0.. — the dormant seam slices** (order set by BK-C0): each flag-gated,
  byte-identical off, pinned from birth, examined at the composition. **Exit = the
  play-test (USER GATE)**: 传球像人了吗 · 球不再穿人了吗 · 门将的球看着讲理了吗.
* ⭐ STATUS (ruling #382 — from BN-C0, the bounce census): **THE QUALITY LAW IS NAMED.** The
  user's 「传到人身上弹回」 is, in the form he plays, a CONTROL-QUALITY event — the intended target
  meets the ball, the engine records a `controlAttempt`, and the attempt FAILS at its `readyTick`
  (C1 = 0.603483 of resolved bounces on the dosed arm; 0.589439 empty-book; precedence-invariant
  on the dosed arm). The failing law is the shipped first-touch roll —
  `attemptFirstTouch` → `touchFailChance(speed, pressure, misalign, technique, positioning)`, a
  CHANCE capped at 0.4, with the E1a trace ledger (`traceFirstTouch` → `firstTouchTrace[]`) and
  E1b's heavy curve behind `edsTouchCost`. M-BK.2's "quality stays skill-priced" is now the
  arc's own question: **BQ-C0 — THE FIRST-TOUCH CENSUS** (#382 item 6) reads the ledger on world
  12 and names the term; a BQ-T0 law follows under a §2-AMENDMENT of this contract.
  ⭐ STATUS (ruling #383 — from BQ-C0): **THE COIN IS HONEST AND HAS NO HEAVY FACE, AND IT IS NOT
  THE STORY.** On world 12 the roll is calibrated (E realised 0.098620 vs mean pFail 0.099024; D
  0.103723 vs 0.102958 — inside the difference's own interval), fails about one in ten intended
  receptions, and NO term carries a majority of its failures (E: pressure 0.373347 · speed
  0.369996 · misalign 0.158570 · floor 0.098087; D: pressure 0.420079 · speed 0.324672). ⭐ But the
  roll is at most about ONE IN SIX of the control attempts that end without possession
  (4,460 of ≥ 27,277 on E): the rest is THE WINDOW between the cushioning contact and the control
  resolution — the pending attempt ABANDONED before its `readyTick` (15,301) or the body NOT
  REACHED at it (≥ 7,516). ⇒ **BQ-C1 — THE ATTEMPT-WINDOW CENSUS** (#383 item 6) reads what ends
  a pending control attempt; the quality LAW's target is named after it. The form question
  (「停球失误是掷骰子掷出来的」) is deferred to BQ-T0 with the census's table beside.
* ⭐⭐ STATUS (ruling #384 — from BQ-C1): **THE WINDOW IS MIXED, AND ITS LARGEST PIECE IS GEOMETRY.**
  Of the intended target's non-possession endings the resolver's RETENTION MARGIN takes 0.491891
  (E) / 0.414040 (D) — the ball no longer within reach three ticks after the cushioning contact,
  the ball having moved more than the body on 0.625739 of them — the roll 0.326138 / 0.355874, an
  opponent's contact 0.112627 / 0.157880, a body strike 0.048764 / 0.057689, a teammate 0.012974 /
  0.009933, the line 0.007605 / 0.004585. The cushion RELEASES the ball outward along the body→ball
  normal at ≥ 0.25 m/s plus 0.35 of the tangential relative motion, and the resolver demands the
  ball inside `sectorCenterReach + 0.02 m` three ticks later — a contact made at the edge of reach
  loses by construction. ⇒ **M-BK.5 (§2-AMENDMENT below) — THE CUSHION KEEPS THE BALL**; BQ-T0
  dispatched. The user's VISIBLE 「弹回」 (a ball caroming off a body) is the lane classes — a
  non-target teammate first (BN-C0 C3) and body strikes — which steps ②/③ inherit.

## §2-AMENDMENT (ruling #384 — M-BK.5 THE CUSHION KEEPS THE BALL; from BN-C0 · BQ-C0 · BQ-C1)

* **M-BK.5 — THE CUSHION KEEPS THE BALL; THE ROLL DECIDES THE TOUCH.** Today a cushioning contact
  (`applyControlContact`) sets the ball's velocity to the body's PLUS an outward release along the
  body→ball normal (`min(1.2, max(0.25, 0.25 + 0.12·|relativeNormal|))`) PLUS 0.35 of the tangential
  relative motion — the ball is pushed off the foot by design ("physically free for three ticks"),
  and a contact made within ~4 cm of the reach edge (3.7 cm at the census's mean geometry — the
  shipped drift is 5.7 cm against a 1.27 m bar; #385 item 2) is lost at the resolver's 0.02 m margin before
  any skill is asked. Armed (`bqCushion`, default OFF, Road B): **the ball takes the body's velocity
  and nothing else** — the relative velocity after a cushioning contact is ZERO; the normal release,
  its floor and cap, and the tangential retention are retired on the armed path (the constants
  stay for the shipped path, character for character). EVERYTHING ELSE STANDS: the three-tick
  separation (`CONTACT_CONTROL_DELAY_TICKS`), the resolver's margin, the contest (an opponent within
  reach of the resting ball still replaces the attempt — the duel is the window's purpose), the
  roll (`attemptFirstTouch` decides whether the touch is clean; a failed touch still knocks the ball
  3.5–6.5 m/s), the body-strike and deflection channels, `vz`/spin damping, `lastTouch`, the commit
  cooldown, the offside branch. ⛔ No new constant: zero is the absence of a push, not a number
  chosen. REALITY: a cushioned first touch leaves the ball with the player — the whole point of
  the touch; the ball that runs away from a full stretch is the ROLL's to price (a reach-margin
  term for the roll is a HELD door). VISION: a geometric lottery (a 2 cm margin against a 5.7 cm
  drift) is removed and the outcome is left to skill (the roll) and contest (the window) — quality
  stays skill-priced (M-BK.2). Exam BQ-T1 (H-BQ.1): the intended target's non-possession share
  FALLS ∧ the margin class FALLS ∧ the opponent-contact class does NOT fall ∧ do-no-harm ∧ the user's
  own-target bounce face reported; the play-test gate is the user's.
  ⭐ STATUS (ruling #385): **BQ-T0 BANKED** — seam `0ae2bf8`; 24 pins; 2078/2078; fingerprint
  unchanged; G-KEEP reproduces the census's mechanism on a derived fixture (d = 1.23 m: shut loses
  at the margin with no roll, armed keeps and the roll runs; relative velocity after the armed
  contact exactly zero); G-CONTEST keeps the duel (an opponent 0.5 m from the resting ball takes it,
  armed as shut; the mutant resolves); the roll, the strike channels, the resolver, the window and
  the body solver byte-identical. ⇒ **BQ-T1 DISPATCHED** (#385 item 5): H-BQ.1 on world 12.
  ⭐⭐ STATUS (ruling #386): **BQ-T1 = FAIL ON (c) ALONE, BANKED AS THE FAIL OF RECORD; THE
  COMMANDER DECIDED WITH THE COUNTS.** (a) FALLS — the intended target's non-possession
  **0.177590 → 0.102921** (E) / 0.188637 → 0.117556 (D); (b) FALLS — the margin class **0.087235 →
  0.003205** of attempts (4,306 → 148 endings); (d) holds — completion **+0.007606** resolvedly UP,
  goals and interceptions inside their bands; the own-target bounce 0.227069 → 0.143344; (c) FALLS
  by the frozen rule — the defender's within-window poke **1.051102 → 0.813627** per match (E) /
  1.900802 → 1.406814 (D), a share-of-attempts Δ of −0.003669 [−0.007111, −0.000164] that is
  below the exam's MDE, flips on 9 seeds and on 5 of 25 bootstrap draws. THE COUNTS: the poke is
  ONE of the defender's ~30 takes per match (tackles 1.330661 → 1.401804, interceptions 27.299599
  → 27.242485, both unmoved); REALITY says a cushioned ball is harder to poke; the receiver's price
  under pressure lives in the roll (+4.28 adjudications/match). ⇒ **THE CUSHION LAW PROCEEDS TO
  ITS ENTRY RUNG — world 13 = world 12 + `bqCushion` — with the duel's fall recorded as a
  measured cost and the displacement story (poke → later tackle) a LABELLED HYPOTHESIS with its
  probe named.** The user's three faces did NOT move: this door fixes the receiver's own bobble;
  the visible carom off a teammate in the lane is steps ②/③'s. The play-test verdict is the user's.
  ⭐⭐ STATUS (ruling #387): **WORLD 13 = world 12 + `bqCushion` CUT** (entry `607c2fe` + the
  commander's blurb correction), ONE door, world 12 byte-identical, the default untouched, +4,798
  bytes, no new chunk; the push deploys ⇒ **THE WORLD-13 GATE IS OPEN** at `?a4world=13` beside
  the world-12 gate. Verdict format: 「缓冲留球 (v13) — keep | change | revert — <一句人话>」.

## §4 Non-claims

No promise the GK loop fully dies (its marked-defender half belongs to other doors); no
strike is ever banned (time and noise are the only currencies); no equilibrium promise —
the faces are reported honestly; nothing ships without the play-test.

## §6 VISION audit (the #91 form)

* vs §-1 (tactics emerge): the law adds TIME and CONTACT physics, not behaviour rules —
  who turns early, who backheels, who plays one-touch stays with the chooser and the
  genes; quick-release play should EMERGE as body-orientation craft once facing costs
  time. PASS.
* vs 底座给能力: facing/turn is body capability; contact is world law — both substrate;
  choices and consequences stay per-team/per-situation. PASS.
* vs #200 (no taste constants): turn cost from `TURN_RATE`; cone from the engine's own
  price algebra; landing price through existing surfaces; solver design census-picked.
  PASS.
* vs the assembly law: BU/PW/PC measured pricing, options and information — none of the
  banked seams carries a kick-facing or ball-contact LAW (the M0–M4 body model stopped
  at movement/overlap); the user opened this door with a directive sentence. PASS.

## §7 REALITY audit (the #201 rule)

* Real football: you turn before you strike, or you pay the backheel's price — the
  quantity is TIME, exactly what M-BK.1 prices. The ball hits bodies — blocking is a
  defensive art BECAUSE contact is real (M-BK.2 models existence, quality stays
  skill-priced). A keeper weighs the landing crowd before he punts (M-BK.3's account).
  PASS.
* Honest limits, stated: receiving craft under pressure (cushioning, shielding the
  first touch) and getting FREE of a marker are other doors; aerial duels keep the
  coarse z-band model (no jump/height per body — enriching that is a census-informed
  later decision, not assumed here). PASS.
