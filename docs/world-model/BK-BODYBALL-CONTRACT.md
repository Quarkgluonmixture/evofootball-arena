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
