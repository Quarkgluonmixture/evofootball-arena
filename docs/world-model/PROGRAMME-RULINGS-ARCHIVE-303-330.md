# PROGRAMME — Commander rulings ARCHIVE, #303–#330 (byte-verbatim)

> Rotated out of the live file by ruling **#338 item 4** (2026-08-26; the #303
> item 2 rotation law). Rulings **#303–#330 verbatim** — nothing reworded. The
> live file [`PROGRAMME-RULINGS.md`](PROGRAMME-RULINGS.md) holds #331 onward;
> earlier eras: #2–#284 in
> [`PROGRAMME-RULINGS-ARCHIVE-001-284.md`](PROGRAMME-RULINGS-ARCHIVE-001-284.md),
> #285–#302 in
> [`PROGRAMME-RULINGS-ARCHIVE-285-302.md`](PROGRAMME-RULINGS-ARCHIVE-285-302.md).

> **COMMANDER RULING #303 (2026-08-19 — ⭐⭐⭐ THE PLAY-TEST GATE VERDICT
> REGISTERED: 「但是确实这一版本很像足球」 — THE PERCEPTION ARC CLOSES
> CONFIRMED AT THE USER'S EYES; the ten play observations registered and
> mechanism-answered at file:line grain; the readability rotation ratified;
> the round-body directive queued; the fork set):**
>
> 1. ⭐⭐⭐ **THE GATE (contract exit, the #157 authority — the user's eyes).**
>    The user played the entry and their verdict of record, verbatim:
>    「但是确实这一版本很像足球」. Gate question 3 (世界更像足球了吗) =
>    **POSITIVE — the arc's exit is satisfied; THE PERCEPTION ARC (#296→#303,
>    seven rulings, INFO-DOCTRINE slice 1) CLOSES CONFIRMED.** Gate questions
>    1–2 (过人时对面真的慢半拍了吗 · 逼抢读作时间攻击了吗) were not directly
>    answered; they stay OPEN as non-blocking observations the user may
>    answer any time. `?a4world=8` remains the opt-in entry of record;
>    PROMOTION TO DEFAULT is a NAMED FORK OPTION, honestly costed: worker
>    fixtures play the shipped world (canon, #283.2(iv)), so promotion
>    re-baselines the fingerprint and every §2 institution — not recommended
>    before more soak, the user's call entirely.
> 2. **THE READABILITY ROTATION RATIFIED** (user-ordered mid-round, verbatim
>    「裁决要不要和programme一样走那个方便阅读的方式?」+「包括其他的文件」;
>    landed `b955254`): PROGRAMME-RULINGS.md now holds #285+ (the live era);
>    #2–#284 byte-verbatim in PROGRAMME-RULINGS-ARCHIVE-001-284.md;
>    PROGRAMME.md keeps QUEUE + §0.0 + Governance (live law) with history in
>    PROGRAMME-ARCHIVE-1.md; PROGRAMME-LOG.md era 1 sealed in
>    PROGRAMME-LOG-ARCHIVE-1.md. Every chunk cmp-verified against the
>    original bytes; nothing reworded. ⭐ NEW PROCESS LAW (CANON refreshed
>    this round): a governance live file that outgrows comfortable
>    single-read size (~1,500 lines) rotates its closed era to an ARCHIVE
>    file byte-verbatim, cmp-verified, in the same round as a ruling that
>    records it. Find any ruling: `grep -n "RULING #N "
>    docs/world-model/PROGRAMME-RULINGS*.md`.
> 3. ⭐⭐ **THE PLAY SESSION'S OBSERVATIONS REGISTERED** (each verbatim, then
>    the mechanism answer — a read-only sweep verified by the commander at
>    every cited line; ZERO seeds drawn; user intuition = priority
>    hypothesis, scored honestly):
>    (i) 「一脚出球这个和我们的之前的球员的预判等等是不是相关,类似于爆趟?」
>    — RELATED, and in exactly the way the question guesses. The one-touch
>    window is pressure-granted at the reception (nearest opponent <
>    3.0 + tempo·1.5 m ⇒ firstTouchWindow 0.28 s + decisionTimer 0.07 s,
>    Match.ts:3008–3024, intended receiver only); the release is chosen by
>    the SAME one table (no separate option, no score bonus — zero hits in
>    the pricing modules) and pays an accuracy tax only (oneTouchMul 1.15–
>    2.05× by dribbling, mechanics.ts:264–266, applied to pass/through/loft/
>    cutback noise). Its perception status: it is the PRE-PROCESSING CHANNEL
>    ruled at #297 (H4) — a body inside its window is EXEMPT from the
>    reaction-latency hold (Match.ts:2244). 爆趟 (knockRelease) is the OTHER
>    fast channel: initiators are latency-free BY EXCLUSION (#297/#298). So
>    the shipped world has exactly two ways to beat processing time — start
>    the action yourself (爆趟), or have pre-processed it (一脚出球) — and
>    the doctrine deliberately kept both. It is NOT tied to the 预判/vision
>    attrs today (pressure + tempo gene only).
>    (ii) 「球员体位是否会随着程度正常的影响球员的出脚前摇和准确度?」 —
>    准确度 YES: orientationNoiseMul = 1 + misalign·(0.9 − technique·0.6)
>    (mechanics.ts:84–86) on every kick family, and misalignment also
>    discounts candidate SCORES in the chooser. 力量 YES: orientationPowerMul
>    = 1 − misalign·0.22·(1 − technique·0.4) (mechanics.ts:88–91) — shots
>    included (mechanics.ts:1281); lofts lose RANGE (mechanics.ts:547).
>    前摇 NO: the wind-up (3–11 ticks, 0.05–0.18 s) scales with the kicker's
>    OWN speed, turn rate and technique ONLY (Match.ts:166–172) —
>    orientation is not an input. ⭐ And of record: THE WORLD THE USER
>    WATCHED HAS BOTH WIND-UPS ARMED — world 8 inherits c7Windup +
>    o1PassWindup through the composition chain (a4World.ts: world 8 = world
>    7 + PC door → world 6 + L3 doors → a4MatchFlags(3) = census flags
>    {c7Windup:true} + o1PassWindup) — the 前摇 they saw is real and
>    body-kinematic, not distance-scaled.
>    (iii) 「我觉得球员现在方形身体一有点违和,也不符合实际模型,应该变成
>    身体变圆(类似于现实)」 — CONFIRMED AND REGISTERED AS A USER DIRECTIVE.
>    The 3D mannequin is all BoxGeometry (torso/hips/limbs/feet,
>    PlayerModel.ts:134–160; head/hair are spheres); the 2D view is already
>    a circle (MatchRenderer.ts:130). ⭐ THE ROUND-BODY PRESENTATION SLICE IS
>    AUTHORIZED AND QUEUED: render3d layer ONLY, zero sim files, fingerprint
>    untouched by construction, before/after screenshots at the user's eyes.
>    (iv) 「阵型是否是涌现的?」 — HALF, honestly stated. Positioning runs
>    emergentStation BY DEFAULT (formations.ts:112–118, :157): a
>    gene-parameterised procedural field (formationDepth · pressIntensity ·
>    coverBias · attackingWidth · defensiveCompactness · keeperAggression
>    genes over hand-written role anchors, ball slide, opponent-line
>    tracking, anti-clump) — the hand-authored ATTACK/DEFEND_FORMATIONS
>    tables drive positions only on the legacy OFF branch (plus UI diagrams
>    and dormant home priors). Formation IDENTITY evolves (inheritance +
>    one-component mutations, evolve.ts:102–135) but the FIELD SHAPE itself
>    is hand-written procedure, not an evolved object — VISION §1's
>    value-field eyes remain the named future work. So: the shape RESPONDS
>    through genes; it was not DISCOVERED by selection.
>    (v) 「传球是否能自由的高球,接球和射门是否能用头?」 — YES on both, with
>    one gate disclosed. Three chooser-priced lofted channels (LoftedPass
>    switch PlayerBrain.ts:610–707; chip-over-the-top through ball :766–778;
>    cross :816–833 — the cross is positionally hardcoded to wide+advanced
>    or corners, PlayerBrain.ts:793) and the ball flies a real parabola
>    (Ball.z, Match.ts:3489–3505). Headers: header shots inside 16.5 m
>    (mechanics.ts:913–915, :1011), defensive header clearances, knockdowns
>    to a teammate (ball.vz = 0.8), chest traps, keeper claims — the aerial
>    duel is an argmax of aerialSense (role weight + defending·0.15 +
>    strength·0.3) over a 1.35 m radius (mechanics.ts:832–853).
>    (vi) 「有的时候看到球从身体穿过」 — TRUE BY CONSTRUCTION, and the sweep
>    found a genuine hole beyond it. There is NO ball-body collider anywhere
>    (the ball contacts bodies only through behavioural handlers: block/
>    save/aerial/capture, Match.ts:3524–3532); a ground pass legitimately
>    crosses a defender's 1.25 m reach when the blind/speed roll fails
>    (Match.ts:4692–4702), when his kick cooldown makes him contact-invisible
>    (Match.ts:4562), or because only the first claim per tick resolves. ⭐
>    CODE FACT OF RECORD: z ∈ (1.30, 1.35) m is a DEAD BAND — above
>    CONTROL_MAX_HEIGHT (feet can't, Match.ts:3526) and below
>    HEADER_MIN_HEIGHT (heads won't, mechanics.ts:787) — and above
>    GK_CLAIM_HEIGHT 2.55 m nothing can touch the ball at all. Registered:
>    the BALL-CONTACT HONESTY door (census first — how often flight crosses
>    bodies unrolled, how much time the ball spends in the dead band).
>    (vii) 「犯规感觉不太明显,应该有踉跄」 — CONFIRMED as a real gap with the
>    substrate ALREADY BUILT. Most fouls are bookkeeping: outside the danger
>    band awardFoul plays ADVANTAGE (no whistle, no restart, Match.ts:3700–
>    3729) and writes NOTHING physical on the victim; only the professional
>    foul downs him (stunTimer 0.8, Match.ts:3876). Yet the stumble state
>    exists with ten write sites, 0.15× movement damping, exclusion from six
>    subsystems, and BOTH renderers animate it (the 3D 'stumble' clip,
>    AnimationSystem.ts:274). The FOUL-VISIBILITY slice = write the victim's
>    stumble at awardFoul + presentation; small, mechanically honest,
>    substrate-complete. Registered as a fork option.
>    (viii) 「现在球员感觉还是不喜欢拿住球,可能因为拿住球能不能买信息和抬头
>    观察?我们之前所说的信息差?」 — ⭐⭐ THE USER HAS NAMED INFO-DOCTRINE
>    SLICE 2 VERBATIM (scanning / private snapshots — the contract's own
>    named next slice, PC contract M-PC.2's "snapshots = slice 2"). Today
>    holding CANNOT buy information because there is no private state to
>    refresh: perception is full-truth outside the latency seam, so looking
>    buys nothing and the chooser correctly never pays for time on the ball
>    (the #169 三 seats lineage: 拿住球/抬头/护球). Slice 2 builds exactly
>    the missing object — the private snapshot that goes stale and the look
>    that refreshes it — and composes with the just-confirmed slice 1 world.
>    REGISTERED AS THE PRIORITY CANDIDATE ARC (recommended at the fork).
>    (ix) 「射门力度和前摇,传球前摇和距离/速度有关系」 — half true today,
>    half a named gap. Pass launch speed IS distance-scaled (clamp(d·0.6 +
>    8.2, 9, 22) — PW-C0's audited law); the wind-up is NOT scaled by
>    distance, intended power, or orientation (own kinematics only, item
>    (ii)). Real football's backswing scales with the intended ball — the
>    WINDUP-POWER COUPLING is registered on the pricing shelf beside the PW
>    entry (a windup-enrichment slice would let a bigger ball cost a longer
>    tell, which is exactly what makes 大力 readable by defenders — it
>    composes with slice 2's information world).
>    (x) 「现在的高空传球非常容易打到人身上,门将高球后场也基本上打到别人身上,
>    也基本没有门将短传 build up」 — mechanisms verified, one hypothesis
>    labelled. (a) A lofted ball's descent re-runs a per-tick argmax over
>    EVERYONE inside 1.35 m of the ball's ground point in z ∈ [1.35, 2.55]
>    (no body height, no jump — mechanics.ts:832–853), and defenders carry
>    the top aerial role weight (DF 0.3 vs WG 0.06) — a punt into traffic
>    structurally tends to a defender's head. (b) THE PUNT PAYS NO LANDING
>    PRICE: its target is picked by progression + receiver STRENGTH alone
>    (PlayerBrain.ts:1029–1051) — the throw pays a laneOpenness gate
>    (:1016), the punt never does. Registered on the pricing shelf. (c) 门将
>    短传 EXISTS in the machinery: from the hands the ordinary short pass is
>    priced ×(0.6 + passBias·0.8) (PlayerBrain.ts:692) beside throw and
>    punt; on goal kicks the keeper is the taker, NOT gkDistributing, so
>    throw/punt vanish and ClearBall gets the keeper multiplier ×(1.9 −
>    (passBias + riskTolerance)·0.55) (PlayerBrain.ts:1058–1064) — the
>    traditional keeper hoofs, the ball-playing genome plays out. (One
>    unverified link stated honestly: that the released goal-kick taker
>    prices from the ordinary candidate table was not traced end-to-end.)
>    ⭐ H-303a (hypothesis, 有故事就要有探针): whether 「基本没有短传
>    build-up」 is a pricing defect or the current genome ecology sitting
>    low-passBias is a CENSUS question — the GK-DISTRIBUTION CENSUS door
>    (mix × situation × genes × outcomes) is registered as a fork option.
> 4. **VISION / REALITY check on this round's own calls** (the #201 rule):
>    the round-body slice is presentation-fidelity (VISION-neutral, reality:
>    人是圆的 — PASS); the fork recommendation (slice 2) arms an information
>    substrate and hand-codes no behaviour (tactics emerge from what
>    knowledge is worth — PASS); the punt landing price and windup-power
>    coupling are derived-price doors, not taste constants (PASS). Reality
>    questions answered from the shipped engine at file:line grain, per the
>    mechanism-oracle rule.
> 5. **CONSUMPTION**: ZERO sim seeds, ZERO stats bases this round (the sweep
>    is read-only). Frontier unchanged: next block ≥ **12,501,000**
>    (12,494,000 stays retired), next stats ≥ **113,800**. Fingerprint of
>    record `57b0bdab…c673` (untouched — no src files this round).
> 6. **THE FORK** (presented 人话 in the round summary; the user's word
>    rules): ① INFO-DOCTRINE slice 2 拿住球买信息 (RECOMMENDED — their own
>    repeated ask, #169 → item 3(viii)) · ② the foul-visibility slice ·
>    ③ the GK-distribution census (H-303a) · ④ the ball-contact honesty
>    census (the dead band) · ⑤ world-8 default promotion (costed, not yet
>    recommended). The round-body slice is already AUTHORIZED and queued
>    ahead of the fork (item 3(iii)); all held doors unchanged.

> **COMMANDER RULING #304 (2026-08-19 — ⭐⭐ THE #303 AFTERMATH OBSERVATIONS
> REGISTERED AND UNIFIED: the ball and the body ignore each other — THE
> BODY-BALL HONESTY CONTRACT BOUND on the user's directive sentence; the
> fork redrawn):**
>
> 1. **THE OBSERVATIONS REGISTERED** (verbatim, same session as #303):
>    (i) 「感觉现在有很多反人类的传球,身体没转过来球就正常传出去了,这个
>    整个射门和传球别扭和方向等得和现实足球重新对一下」; (ii) 「这个球穿
>    身体还影响拦截抢断等」; (iii) 「门将高空长传——打到后卫/对面前锋身上/
>    头上——然后再弹回门将,或者由于后卫都被前锋盯紧,给后卫然后瞬间被断」.
>    Mechanism status: all three stand VERIFIED at #303 grain already —
>    (i) is true by construction (no facing gate anywhere; orientation is a
>    soft price on power/noise/score, never a possibility law; wind-up
>    inputs exclude orientation); (ii) is the contact-law hole (behavioural
>    handlers only; the blind/speed roll, cooldown invisibility, the
>    z ∈ (1.30, 1.35) dead band); (iii) is the composite (the punt's missing
>    landing price into a DF-weighted aerial argmax → bounce-back; the
>    marked-defender half = the build-up disease's territory, scoped out
>    honestly). ⭐ NEW VERIFICATION this round: the missing account is
>    DERIVABLE — the body already turns at the shipped `TURN_RATE = 6.5`
>    rad/s (Player.ts:17), so a fully-reversed strike owes π/6.5 ≈ 0.48 s
>    ≈ 29 ticks that nobody pays today; no taste constant needed.
> 2. ⭐⭐ **THE DOOR IS OPENED BY THE USER'S OWN SENTENCE** (「得和现实足球
>    重新对一下」 = a directive, the #290-form ratification):
>    **[`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md) DRAFTED AND
>    BOUND** — H-BK.1 (facing law: the kick's timeline absorbs the required
>    turn, a time cost never a ban; backheels survive priced), H-BK.2
>    (one contact law: through-body and dead-band events collapse by
>    construction; rolls decide quality, never existence), H-BK.3
>    (REPORTED: the GK-loop faces — direction pre-registered: honest
>    physics should let the EXISTING pricing see the punt's true cost by
>    itself). M-BK.1–4 carry the #200 derivations (TURN_RATE · the
>    engine's own price algebra · existing pricing surfaces) and the
>    honest scope line: the marked-defender half is NOT promised here.
>    §6 VISION / §7 REALITY audits in the contract.
> 3. **THE FORK REDRAWN** (supersedes #303 item 6): #303's options ③ (GK
>    census) and ④ (ball-contact census) are ABSORBED into BK-C0 as its
>    (c) and (b) instruments. The recommendation moves: **the BK arc runs
>    NEXT** (three independent user observations point at one embodiment
>    gap; watchability-critical every match; and the facing/turn substrate
>    FEEDS the future scanning slice — a body that must turn to kick is
>    the body that must turn to look). INFO-DOCTRINE slice 2 (拿住球买信息,
>    the user's own ask) is the NAMED NEXT-AFTER; the foul-visibility
>    slice and world-8 promotion hold as menu items.
> 4. **QUEUE ORDER**: next `go` = ① the round-body render slice (tiny,
>    authorized at #303 item 3(iii), the user SEES it immediately) then
>    ② BK-C0 (instrument-only census; picks the cone/solver design and
>    slice order). One word from the user reorders freely.
> 5. **CONSUMPTION**: ZERO seeds, ZERO stats this round (verification =
>    grep/read only). Frontier unchanged: next block ≥ **12,501,000**,
>    next stats ≥ **113,800**; fingerprint `57b0bdab…c673` untouched.

> **COMMANDER RULING #305 (2026-08-19 — RB ROUND-BODY SLICE BANKED; the
> overnight self-drive round 1):**
>
> 1. **LANDED** (`c447a96`, verify PASS-WITH-FINDINGS, 4 LOW, 0 HIGH/MED).
>    The 3D mannequin is ROUND: a lathed rounded-rectangle `barrel()`
>    primitive replaces the box family (torso/hips/limbs/socks; boot =
>    rotated capsule); the full-capsule attempt was tried and REJECTED at
>    the eyes (ball-chest read) — the committed shape keeps straight-sided
>    middles with rounded ends. INVARIANTS BY CONSTRUCTION AND MEASURED:
>    every part's bounding box byte-identical to the box it replaced
>    (armSpan/HUMAN_MODEL_SCALE/TORSO_BASE/HEAD_R untouched); every pivot
>    and translate-to-pivot offset unchanged; AnimationSystem.ts not
>    touched; the 2D circle untouched. RECEIPTS: fingerprint A/B
>    byte-identical AND independently reproduced by the verifier
>    (sha256 = 57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215
>    ba4c673 — the full value now of record); typecheck/build clean; tests
>    1,579/1,580 with the KNOWN formationEvolution load-timeout class
>    (pass-in-isolation receipt attached); the 3D visual suite 51/51.
>    Screenshots committed (before/after closeup + broadcast) under
>    docs/world-model/rb-round-body/ — the user's eyes judge in the
>    morning.
> 2. **FINDINGS ADJUDICATED**: (i) triangles 594 → 2,122 per body (verifier
>    recomputed exactly; ~25.5 k for 12 bodies) with NO frame-time A/B —
>    ACCEPTED as an honest inference at these counts; the radial segments
>    are one-line tunable if the user's phone ever drops frames; the perf
>    menu holds. (ii) Officials/coaches (Referee/Linesman/Coach models)
>    are STILL the box species — scope-correct (the directive said 球员);
>    ⭐ RB-2 (officials/coaches rounding, one file each) is a NAMED MENU
>    ITEM. (iii) The PROGRAMME status face is the QUEUE itself — updated
>    by this ruling (the executor is correctly forbidden). (iv)
>    Environment note of record: `npx playwright install chromium`
>    (~93 MB, user cache) was required for the visual suite on this
>    machine. Consumption: ZERO seeds, ZERO stats.
> 3. **SELF-DRIVE CONTINUES** (the user's word: 「进行连夜自走」): next =
>    BK-C0, THE BODY-BALL CENSUS (contract §3, instrument-only), in the
>    watched world of record (the world-8 composition — the user's
>    observations live there, wind-ups armed). Seed block of record:
>    **12,501,000–999** opens to this stage (BOOKED = WALKED reporting;
>    stats, if drawn, from ≥ 113,800 stepping ≥ 200). The arc pauses at
>    the BK play-test user gate when the slices land.

> **COMMANDER RULING #306 (2026-08-19 — ⭐⭐ BK-C0 ADJUDICATED: the census
> redraws the disease map — 反身 confirmed and its price NOT EVEN ORDERED;
> through-body has ONE dominant cause (cooldown invisibility); H-303a
> REFUTED at frequency grain; the turn-cost table lands; slice order
> ruled; overnight self-drive round 2):**
>
> 1. **LANDED** (freeze `a6c0f4a` → result `e310401`, verify
>    PASS-WITH-FINDINGS 4 MED + 5 LOW; 219/220 published faces
>    independently re-derived from the artifact off disk by the verifier's
>    OWN parser; smoke 224/224 field-identical on the stage's own band;
>    git hygiene absolute — src untouched in the named-range form; seed
>    audit confirmed against the probe's arithmetic, not the prose).
>    Corrections of record appended to BK-C0-BODYBALL-CENSUS.md (§CORR
>    items 1–5): the bounce-back window of record = 240 ticks (unanchored
>    regex hit the wrong loftKick site; "252" struck; impact ≤ 5/619);
>    the gap histogram is CENSORED at ~250 ticks (two claims struck; the
>    loop's late tail UNMEASURED); the turn-cost ratio of record = 2.64×
>    (unit-name truth, divisor 10.8 vs the published 11); the per-minute
>    reach face of record = 23.06 EPISODES/playing-sim-min (144.18 is the
>    body-tick rate under an event name); minor hash/receipt notes.
> 2. ⭐⭐ **THE CENSUS VERDICTS** (500 matches, world-8 matured, 53,055
>    releases): (i) 反身 CONFIRMED AND QUANTIFIED — 53.1 % aligned ·
>    26.9 % beyond square · 9.3 % essentially backwards (misalign ≥ .95);
>    it lives in the ORDINARY SHORT PASS (25.3 % of them beyond square;
>    shorts = 64.5 % of all releases); shots are already aligned (the C7
>    faceTarget lock, mean misalign .0545); the header family (6.8 %) sits
>    outside the facing price entirely. ⭐ THE PRICE IS NOT EVEN ORDERED:
>    own-next-touch aligned .648 / reversed .582 / BLIND .659 — the blind
>    release does BETTER than the aligned one; today's orientation price
>    disciplines nothing at outcome grain. (ii) ⭐⭐ THROUGH-BODY HAS ONE
>    DOMINANT CAUSE — cooldownInvisible = 73.4 % of reach crossings and
>    81.9 % of visual through-body ticks (Match.ts:4562: a body that just
>    kicked is contact-invisible for 0.45 s and the ball passes through
>    HIM); the roll class is 5.2 %/0.18 %; volumes: 119.2 visual
>    body-ticks/match in 29.4 episodes; 23.06 reach-crossing episodes per
>    playing sim-minute. (iii) THE DEAD BAND IS REAL BUT NOT THE DISEASE:
>    8.49 ball-ticks/match (0.14 sim-s), 0.13 % of reach crossings — the
>    z-partition closes it for free. (iv) ⭐ H-303a REFUTED AT FREQUENCY
>    GRAIN: 86.2 % of the 10.58 GK distributions/match ARE short passes
>    (78.4 % reaching their own side on the ground); the punt is 7.6 %.
>    THE USER'S EYES CAUGHT THE LOUD MINORITY, AND IT IS REAL: 70.5 % of
>    punts are first met in the AIR; the hoofed gkClearance concedes
>    first touch 78.8 %; 瞬间被断 = 9.0 % of completed short balls inside
>    the engine's own defender-arrival window; bounce-back = .116 per GK
>    release within 240 ticks (median gap 40 ticks — mostly
>    save-and-regather, the declared doubt). Scored honestly: the
>    channels are ugly when they fire (the intuition RIGHT); 「基本没有
>    门将短传」 does not hold at census grain. (v) ⭐ THE TURN-COST TABLE
>    (the facing law's design table, all engine-derived): full reversal =
>    29 ticks (0.483 s) = 2.64× the 11-tick wind-up cap; the engine's own
>    absorbable cone = 68.28° (misalign .3149); **33.6–36.3 % of today's
>    releases sit outside any turn the existing time budget could
>    absorb** — the facing law will make a third of the world pay real
>    time, which is exactly the user's 反人类 complaint priced honestly.
> 3. **SLICE ORDER RULED** (the census picks, per contract §3): **BK-T0 =
>    THE FACING LAW** (M-BK.1 — the turn folded into the shipped wind-up
>    idiom; the cone at the engine's own 68.28°/.3149 edge; beyond-cone =
>    the backheel class, possible at its existing price; dormant flag,
>    flags-off byte-identity, pin suite from birth, composition posed at
>    the world-8 stack) → **BK-T1 = THE CONTACT LAW** (M-BK.2 — primary
>    target MEASURED: the cooldown-invisibility class; the z-partition
>    rides free; the hand-typed 4562 citation gets pinned there) → the
>    composition exam → the entry rung → THE BK PLAY-TEST GATE.
> 4. **PROCESS**: ⭐ new canon LEDGERED (home BK-C0 §CORR item 1): a
>    src-extracted constant pins its extraction to the NAMED call site —
>    anchored match + line receipt — never first-occurrence. Unit-name
>    truth recurrences extended (+BK-C0 §CORR items 3–4). ⭐ THE RULINGS
>    ROTATION DISCHARGED (the #305 QUEUE reminder): #285–#302 (the closed
>    BU→PW→PC era) → PROGRAMME-RULINGS-ARCHIVE-285-302.md, byte-verbatim,
>    cmp-verified; the live file = #303+.
> 5. **CONSUMPTION**: block **12,501,000–999 CONSUMED WHOLE of record**
>    (walked: 000–499 battery incl. its 000–003 sizing prefix · 999 the
>    world receipt; 500–998 unwalked inside the consumed block). Stats
>    ZERO. Next block ≥ **12,502,000**; next stats ≥ **113,800**.
> 6. **SELF-DRIVE CONTINUES**: BK-T0 (the facing law) dispatched with
>    this ruling; block 12,502,000–999 opens to it.

> **COMMANDER RULING #307 (2026-08-19 — ⭐⭐ BK-T0 BANKED: the facing law is
> DORMANT, DERIVED, PINNED FROM BIRTH — and its two red gates are the
> stage's honesty, not its failure; overnight self-drive round 3):**
>
> 1. **LANDED** (freeze `2f1a6c8` → result `9ac9efe`, verify
>    PASS-WITH-FINDINGS 1 MED + 3 LOW). THE LAW: `addedTicks = max(0,
>    ceil(θ/(TURN_RATE·DT)) − 11)` folded into the shipped wind-up
>    readyTick — every constant anchored-extracted (C7_W_CAP Match.ts:161 ·
>    TURN_RATE Player.ts:17); the cone = the census's own 68.28°/.3149
>    edge; NO new clamp (the [0,18] range is structural, 29−11); the body
>    turns on SHIPPED code (faceTarget + the existing heading sweep — the
>    law adds time, zero turning code, and the existing orientation prices
>    then price the residual). Flag `bkFacingLaw` (Road B, default OFF,
>    absent from a4World): EXTENDS whichever wind-up channels are armed;
>    partial composition legal; BOTH channels off ⇒ constructor REFUSAL
>    (the PW×PTP precedent). BYTE-IDENTITY double-proven and INDEPENDENTLY
>    reproduced (pooled digests 4/4; fingerprint of record character-for-
>    character); 22 pins / 7 mutants / 7 killed; full suite 1,602/1,602;
>    doors at the WORLD-8 STACK (8 cells × 3 seeds, both dose files hashed
>    as FILE BYTES; 3 refusals name the law; lifecycle 0 live-at-whistle
>    across 759,460 armed ticks).
> 2. ⭐ **THE TWO RED GATES RATIFIED AS FROZEN** (corrections §CORR 1–6
>    appended): gInsideCone — the law BOUNDS the residual toward the cone
>    (receipt: outside-cone share .2999 → .0027), it does not ZERO it for
>    a moving body (cause split unmeasured, an exam question, NOT a
>    patch); gLifecycle — the one live-at-whistle arming is an INCUMBENT
>    O1 property in a flag-OFF walk, registered as O1's named debt.
>    Verify MED absorbed: the one-touch bypass is PASS-SIDE ONLY (a
>    one-touch SHOT pays facing ticks — small in practice at 8.7 %
>    extended share; registered as a named exam observation). The
>    receipts asymmetry IS the census reappearing in the plumbing: pass
>    channel 46.5 % of arms extended vs shots 8.7 % — this law is
>    overwhelmingly about the ordinary short pass, exactly where BK-C0
>    put 反身.
> 3. **CONSUMPTION**: block **12,502,000–999 CONSUMED WHOLE** (125 walks:
>    50 × 2 battery · 24 door cells · 3 pin seeds · 999 receipt). Stats
>    ZERO. Next block ≥ **12,503,000**; stats ≥ **113,800**. Fingerprint
>    unmoved.
> 4. **SELF-DRIVE CONTINUES**: **BK-T1 — THE CONTACT LAW** dispatched with
>    this ruling (M-BK.2; the census-measured target: the cooldown-
>    invisibility class = 73.4 %/81.9 % of through-body, + the free
>    z-partition; rolls decide QUALITY, never EXISTENCE; the hand-typed
>    Match.ts:4562 citation gets pinned). Block **12,503,000–999** opens
>    to it.

> **COMMANDER RULING #308 (2026-08-19 — ⭐⭐ BK-T1 BANKED, verify PASS: the
> ball meets the body — existence by law, quality by roll; overnight
> self-drive round 4):**
>
> 1. **LANDED** (freeze `be13498` → result `dfb9fbd`, verify **PASS**,
>    2 LOW). THE LAW: a body the shipped filter drops (cooldown/stunned,
>    never sentOff, never the ball's own lastTouch) is collected as a
>    `bodyStrike` claim when the ball is inside his PHYSICAL SHELL
>    (coreRadius + ball radius — physical.ts's own clearance expression)
>    AND CLOSING on him (the engine's own M1 rule); the outcome is the
>    existing DEFLECT carom with its EXISTENCE roll removed — no control,
>    no first touch, no cooldown reset. ⭐ The CONTACT_* cushion was BUILT
>    AND REJECTED before freeze (it stops a 20 m/s ball dead at the feet
>    of the one man not allowed to control it — the superpower by the
>    back door); zero new constants, no STAGE-STOP owed. The z-partition:
>    (1.30, 1.35) absorbed by the FEET side BEHIND THE FLAG (shipped
>    constants byte-untouched; the derivation names CROSS_FLIGHT_MIN_S's
>    expression dependence and CHEST_TRAP_MAX_HEIGHT = 1.7). Flag
>    `bkContactLaw` composes FREELY (12/12 door cells at the world-8 +
>    facing-law power set; builds ALONE; does NOT rescue bkFacingLaw's
>    inert-law refusal). Byte-identity 4/4 digests + fingerprint of
>    record, both INDEPENDENTLY reproduced; 23 pins / 7 mutants killed —
>    ⭐ including a VACUOUS PIN caught by its own mutant (M3 survived,
>    the FIXTURE was fixed, not the gate) — the mutant discipline
>    earning its keep.
> 2. ⭐⭐ **THE RECEIPTS** (40 × 2 walks; the SHUT side reproduces BK-C0 on
>    fresh seeds — instrument self-validation): visual through-body
>    115.45 → 44.4 body-ticks/match · cooldownInvisible core share
>    .804 → .492 · the dead-band core cell 2 → 0 · partition live
>    (0 → 9.825 ground ticks/match) · ~27 strikes/match · **0 strikes
>    followed by ownership** across 1,078 (no superpower) · 0 outside
>    playing. The residual IS the pre-registered out-of-scope classes
>    (aboveGkClaim .225 · aerialBand .194) — the law BOUNDS, as written.
>    Honest reads kept honest: reach-crossing EPISODES rise armed (a
>    carom chops crossings shorter and more numerous); dead-band BALL
>    ticks barely move (the region is still flown through — it is now
>    LAWFUL there). Corrections §CORR 1–2: the band grants ordinary
>    CONTROL (not merely touch) to all bodies — pre-registered, prose
>    sharpened; the one-line anti-pinball fragility named of record.
> 3. **CONSUMPTION**: block **12,503,000–999 CONSUMED WHOLE** (93 walks +
>    pin seeds 800–811). Stats ZERO. Next block ≥ **12,504,000**; stats
>    ≥ **113,800**. Fingerprint unmoved.
> 4. **SELF-DRIVE CONTINUES**: **BK-T2 — THE COMPOSITION EXAM** dispatched
>    (both laws armed atop the world-8 stack vs the base; H-BK.1 and
>    H-BK.2 SCORED on virgin seeds with frozen CI rules; H-BK.3 REPORTED
>    — the GK-loop ledger, the R-乙 chain faces, direction mix, the
>    corridor rung if affordable (named-out-with-reason otherwise);
>    the #307 named observations measured where cheap: the one-touch
>    shot tax · the moving-body residual). Block **12,504,000–999** and
>    the stats lattice from **113,800** open to it.

> **COMMANDER RULING #309 (2026-08-19 — ⭐⭐⭐ BK-T2 ADJUDICATED: BOTH SCORED
> HYPOTHESES PASS — the kick obeys the body and the ball meets the body,
> at an honest, measured price; the three reported costs ruled; overnight
> self-drive round 5):**
>
> 1. **LANDED** (freeze `936c9f1` → result `b26deba`; the draft executor
>    died at its REPORTING step after landing both commits — the stage doc
>    and artifact were adjudicated directly; verify ran as its own pass:
>    **PASS-WITH-FINDINGS**, 1 MED + 4 LOW, corrections §CORR 1–5
>    appended). ⭐ The verify's re-derivation is the strongest of the
>    programme: **55/56 published faces re-derived bit-for-bit INCLUDING
>    both CI bounds** (own bootstrap re-implementation at the recorded
>    base); frozen rules PURE-APPEND from freeze to result (376
>    insertions, 0 deletions); the red gate confirmed red, unpatched,
>    over-charge-only cell-by-cell.
> 2. ⭐⭐⭐ **H-BK.1 PASS** (all three limbs, frozen rules): outside-cone
>    release share **.3329 → .2311** (16.5 half-widths; the middle of the
>    distribution moved, the backwards TAIL barely — the header/out-of-
>    scope families the law never touches); the world pays REAL time —
>    applied wind-up **6.44 → 10.00 ticks**, p90 8 → 19, **3.10 sim-s a
>    match**; nothing banned: the governed channel (wind-up-borne
>    beyond-cone) fell 86.3 % while the out-of-scope families sat
>    UNMOVED TO THE DECIMAL and the one-touch bypass stayed live at 5.98
>    beyond-cone releases/match. ⭐⭐⭐ **H-BK.2 PASS**: the cooldown-
>    invisibility class **× 0.249** (23.1 half-widths), the dead-band
>    limb × 0.481 (a NARROW pass against the 0.50 bar, stated); visual
>    through-body **118.2 → 45.0 ticks/match (−62 %)**; the residual is
>    EXACTLY the declared out-of-scope classes. The base arm reproduced
>    BK-C0 on virgin seeds — instrument self-validation, third time
>    running.
> 3. ⭐⭐ **THE THREE REPORTED COSTS RULED**: (i) the GK distribution mix
>    did NOT move (all four channel CIs span 0) ⇒ per the contract's own
>    pre-registered routing, **the punt's landing price goes to the
>    PRICING SHELF** — now census-and-exam-backed, the shelf's top item.
>    (ii) **弹回门将 ROSE +47 %** (CI strictly above 0) — the user's own
>    third complaint moving the WRONG way: a carom that used to fly
>    through a body now comes back. REPORTED to the gate unhedged; the
>    save-and-regather / punt-came-home split instrument = a NAMED DOOR
>    (possession-chain ledger). (iii) **Q06 pass completion −8.9 pp**
>    (13.3 half-widths, away from R-乙's real band) — the honest cost of
>    contact physics, MECHANISM REFRAME of record: the world became
>    honest but THE PASS ORACLE IS BLIND TO THE NEW HAZARD (it prices
>    reader-interception, not the cooldown-body carom) ⇒ the
>    teach-the-pass-oracle door WIDENS to hazard pricing (a knowledge
>    slice in the DV-map lineage; VISION-clean: capability landed,
>    knowledge lags). The play-test judges whether the cost reads as
>    football (real passes DO die off legs) — 真实世界里传球也会被腿挡
>    出去,但真实传球的人知道躲. (iv) §R7's find REGISTERED: dead-ball
>    deliveries pay NO facing time (the shipped restart run-up pre-faces
>    the taker — the right football answer, now in the record; the
>    engine's ledger is the truth, the probe over-states ≤ 0.22 %).
> 4. **CONSUMPTION**: block **12,504,000–999 CONSUMED WHOLE** (801 walks
>    + the 12-of-13 diagnostic re-walks inside the block + the disclosed
>    900,000,000–059 scratch); stats base **113,800 consumed** (one
>    draw, 2,000 resamples) — **next stats ≥ 114,000**; next sim block ≥
>    **12,505,000**. Src byte-untouched; fingerprint unmoved by
>    construction.
> 5. **SELF-DRIVE CONTINUES — THE ENTRY RUNG DISPATCHED**: **`?a4world=9`
>    = world 8 + bkFacingLaw + bkContactLaw**, 「身体诚实的世界」— the
>    honest blurb CARRIES THE COST (传球更难了:完成率 −8.9 pp — the
>    oracle has not learned the new world yet); containment-ordered
>    version read (9 first); no new chunks (BK carries no dose);
>    byte-identity on every prong; pins from birth. Block
>    **12,505,000–999** opens to it. THEN THE BK PLAY-TEST GATE:
>    传球像人了吗 · 球不再穿人了吗 · 门将的球看着讲理了吗 — the
>    programme PAUSES there.

> **COMMANDER RULING #310 (2026-08-19 — ⭐⭐⭐ THE BK ENTRY IS LIVE
> (`?a4world=9`) AND THE BODY-BALL HONESTY ARC REACHES ITS PLAY-TEST USER
> GATE; the overnight self-drive ENDS AT THE GATE, six rounds, rulings
> #305–#310):**
>
> 1. **LANDED** (freeze `41b8109` → result `5681a19`, verify
>    PASS-WITH-FINDINGS 1 MED + 3 LOW, §CORR 1–4 appended). **THE ENTRY
>    OF RECORD: `?a4world=9` = 「身体诚实的世界」** — world 8 + the two
>    BK laws by CONTAINMENT CALL twice over (a4MatchFlags(9) spreads
>    a4MatchFlags(8); armBkWorld CALLS armPcWorld — the #302 empty-form
>    reset and `?pcdose=0` semantics ride along by construction, one
>    predicate, one dose read); the version read containment-ordered
>    9-first (a world-9 match names itself 9; the MT family moved after
>    the chain, disjoint by FLAG SETS — §CORR 2); NO new chunk (the laws
>    carry no dose; SW precache 19 = 19, pinned literal); the BLURB
>    CARRIES THE COST (传球更难了,完成率约降 9 个百分点——传球的大脑还
>    没学会躲开身体; pinned in three files, mutant M8 kills deletion);
>    36 pins green from birth, 8/8 mutants killed, FULL SUITE
>    1,661/1,661 (the load-timeout class did not even recur); production
>    + worlds 6/7/8 byte-identical (digest quadruple + the verifier's
>    source-level re-derivation: not one line removed from versions
>    1–8's compositions); fingerprint of record UNMOVED,
>    verifier-reproduced. Cost: **+2.86 kB (+0.20 %) main path, zero
>    opt-in delta** — the verifier rebuilt the rung side to the
>    CONTENT-HASHED FILENAME.
> 2. **THE MED RULED** (§CORR 1): the freeze commit was RED across the
>    full pin population (two family-suite rewrites landed with the
>    result). OF RECORD: an entry rung's freeze must be green on the
>    WHOLE pin population, existing suites included. Banked with the
>    violation named — the rewrite was disclosed, STRONGER, and src
>    moved zero bytes between commits. NAMED DOOR (§CORR 3): the
>    `League['matchFlags']` Pick union does not name the BK flags —
>    one line, next src/sim-authorised round.
> 3. **CONSUMPTION**: block **12,505,000–999 CONSUMED WHOLE of record**
>    (12 walked + declared scratch 900,000,030; the rest virgin inside
>    the consumed block). Stats ZERO (floor stands ≥ **114,000**). Next
>    sim block ≥ **12,506,000**.
> 4. ⭐⭐⭐ **THE BODY-BALL HONESTY ARC IS COMPLETE AND PAUSED AT ITS
>    PLAY-TEST USER GATE** (#304 contract → #306 census → #307 facing
>    law → #308 contact law → #309 exam (H-BK.1 PASS · H-BK.2 PASS) →
>    #310 entry; every stage adversarially verified; the overnight
>    self-drive ran six rounds and STOPS HERE — the user's eyes are the
>    authority). **THE GATE QUESTIONS: 传球像人了吗 · 球不再穿人了吗 ·
>    门将的球看着讲理了吗 — and the honest cost to judge: 传球完成率
>    −8.9 pp(oracle 还没学会新世界)· 弹回门将 +47 %.** The A/B of
>    record: **`?a4world=9` vs `?a4world=8`** (the processing-time world
>    without body honesty); `?pcdose=0` remains the wild-side contrast
>    inside either. The user's next word is the gate's.

> **COMMANDER RULING #311 (2026-08-19 — SELF-DRIVE NIGHT 2 OPENED BY THE
> USER'S WORD; the BK gate stays OPEN; the menu ladder sequenced):**
>
> 1. **THE USER'S WORD, VERBATIM** (after the night-1 summary): 「继续自走
>    吧,去做下面的那些」. INTERPRETATION OF RECORD: the BK PLAY-TEST GATE
>    REMAINS OPEN (no verdict was given — the three gate questions and the
>    ?a4world=9 vs 8 A/B stand; nothing in the BK arc advances past its
>    gate, world-9 promotion stays locked); self-drive CONTINUES on the
>    QUEUE's named-next-after and menu tracks (「下面的那些」).
> 2. **THE NIGHT-2 LADDER** (commander sequencing: smallest first to
>    discharge named debts and complete what the user sees, then the
>    priority arc): **R7** = RB-2 officials/coaches rounding (#305
>    item 2 — the box species on the touchline) → **R8** = the
>    one-line named doors discharged together (the `League['matchFlags']`
>    BK naming, #310 §CORR 3 · the anti-pinball comment anchor, BK-T1
>    §CORR 2) → **R9** = the possession-chain ledger (instrument-only —
>    splits 弹回门将 +47 % into save-and-regather vs punt-came-home,
>    #309 item 3(ii); it sharpens the gate's own question before the
>    user plays) → **R10** = ⭐ THE INFO-DOCTRINE SLICE 2 CONTRACT
>    (拿住球买信息 — scanning / private snapshots, the user's twice-made
>    ask, #303 item 3(viii)) drafted and bound, IN-C0 census dispatched →
>    the IN arc runs to its own gates. One step per round, every stage
>    verified, the ladder re-orderable by one word from the user.
> 3. **DISPATCH**: R7 (RB-2) goes with this ruling. Seeds: none expected
>    for R7/R8 (render / one-liners + pins); R9 opens **12,506,000–999**
>    when it dispatches; stats floor stands ≥ **114,000**.

> **COMMANDER RULING #312 (2026-08-19 — RB-2 BANKED: one species on the
> pitch; night-2 round R7):**
>
> 1. **LANDED** (`5ef0017`, verify PASS-WITH-FINDINGS, 5 LOW, §CORR 1–4).
>    The referee, both linesmen and both coaches are bodies of revolution
>    built from the PLAYER'S OWN primitives (barrel/limb exported, the
>    boot capsule factored into shoe() the player now calls — player
>    geometry proven byte-unchanged); 15 boxes replaced; flat pieces that
>    should be flat (flag cloth · card · open-jacket panel) stay flat;
>    every pivot and update() untouched (patrol, offside line, card/flag
>    arms, the coach's poses unchanged). Fingerprint of record
>    independently reproduced; typecheck/build clean; the 3D visual
>    suite 52/52 (its own count — the suite grew one check since #305).
>    Bbox invariance sub-float32-eps on all 15 parts (§CORR 1's honest
>    phrasing). Cost: +4,232 touchline triangles (+22,568 cumulative,
>    count-asserted; the perf menu holds).
> 2. **CONSUMPTION**: ZERO seeds, ZERO stats.
> 3. **R8 DISPATCHED — THE DEBT-DISCHARGE SLICE** (three one-liners, each
>    a named door): (i) `League['matchFlags']` Pick union NAMES
>    bkFacingLaw + bkContactLaw (#310 §CORR 3 — type-level only, zero
>    emitted-JS change, proven); (ii) the anti-pinball comment anchor at
>    the ball.lastTouch exclusion (BK-T1 §CORR 2 — comment only); (iii)
>    the RB/RB-2 GEOMETRY-GUARD PIN committed (tests-only: the bbox
>    invariance check moves from /tmp into the permanent suite, §CORR 2).
>    Receipts per item; fingerprint + digests must be untouched by
>    construction and proven anyway.

> **COMMANDER RULING #313 (2026-08-19 — R8 BANKED with two guard holes
> ordered shut; a commander attribution corrected; night-2 round R8):**
>
> 1. **LANDED** (`03d4902`, verify PASS-WITH-FINDINGS, 2 MED + 2 LOW).
>    All three doors discharged and independently proven: (i) the
>    `League['matchFlags']` union NAMES the BK laws — zero emitted JS
>    (esbuild output byte-identical, sha-matched) and the door is held by
>    `typecheck` itself (the verifier deleted the line and reproduced the
>    M3 failure verbatim); (ii) the anti-pinball anchor sits AT the
>    lastTouch exclusion with all three load-bearing facts; (iii) the
>    geometry guard is committed — 23 rows, doc-faithful digit-for-digit,
>    mutation-proved to bite on literal rows. Fingerprint independently
>    reproduced, unmoved.
> 2. ⭐ **COMMANDER ATTRIBUTION CORRECTED** (the executor's disclosure is
>    of record): ruling #308 §CORR 2 attributed the 818 → 46 buzz
>    measurement to the `ball.lastTouch` exclusion; BK-T1 §1 shows that
>    pair was measured by toggling the CLOSING condition. OF RECORD: the
>    anti-buzz property rests on BOTH guards — the closing condition
>    kills the two-adjacent-cooling-bodies buzz (the measured pair), the
>    lastTouch exclusion kills the same-body re-strike class (unmeasured
>    separately). The shipped comment carries the honest bracketed note.
> 3. **THE TWO GUARD HOLES ORDERED SHUT — R8-FIX dispatched** (tests-only,
>    the vacuous-pin class BK-T1's mutant discipline exists to catch):
>    (a) the player-torso callSite pin must extend THROUGH the
>    `.scale(...)` (a deleted z-squash currently passes green —
>    mutation-proved); (b) the sleeve/forearm rows must bind
>    SLEEVE_HALF_W / FOREARM_HALF_W to src (constant drift currently
>    passes green, held only incidentally by an older test). Fix = the
>    verifier's own two mutants must DIE post-fix. LOW notes of record:
>    the "one species" property is pitch-only (CrowdSystem spectators
>    still boxes — a named menu item, not a violation); the §HONEST GAPS
>    list understated the bridge break (now corrected by this ruling).
> 4. **CONSUMPTION**: ZERO seeds, ZERO stats. R9 (the possession-chain
>    ledger) dispatches after R8-FIX lands.

> **COMMANDER RULING #314 (2026-08-19 — R8-FIX BANKED: the guard now bites
> everywhere; night-2 continues):**
>
> 1. **LANDED** (`579b5ae`, verify PASS-WITH-FINDINGS, 3 LOW — all
>    author-disclosed notes). Both ordered mutants DIE (the verifier
>    re-ran them independently; mutant 2 kills THREE pins across two
>    suites); both original R8 mutants still die; restores byte-verified
>    (/tmp copies on the uncommitted tree — the #307 practice honoured);
>    the guard grew to 53 rows; fingerprint of record unmoved. The
>    whitespace-stripped comparator (all 23 rows) accepted: tokens stay
>    exact, only line breaks forgiven — the wrapped-torso reality forced
>    it, disclosed and mutation-proved. The two additive `export`
>    keywords accepted (both genuinely needed; emitted JS untouched).
> 2. **CONSUMPTION**: ZERO seeds, ZERO stats.
> 3. **R9 DISPATCHED — THE POSSESSION-CHAIN LEDGER** (instrument-only,
>    #309 item 3(ii)'s named door): decompose 弹回门将 (+47 % armed, CI
>    strictly above 0, cause UNKNOWN) by RELEASE KIND × RETURN PATH —
>    save-and-regather vs distribution-came-home vs direct carom — on
>    paired virgin seeds, world-9 vs world-8 arms, with BK-T2's
>    uncensored-window lesson built in from birth. Block
>    **12,506,000–999** + stats from **114,000** open to it. The answer
>    goes in front of the user AT THE GATE.

> **COMMANDER RULING #315 (2026-08-19 — ⭐⭐ R9 ADJUDICATED: the +47 %
> 弹回门将 is a DIRECT CAROM in the distribution family — the gate gets
> its answer; the attribution honestly UNSPLIT; night-2 round R9):**
>
> 1. **LANDED** (freeze `46df6df` → result `9c3a354`, verify
>    PASS-WITH-FINDINGS 1 MED + 4 LOW, §CORR 1–5). 17/17 gates green;
>    the frozen probe byte-IMPOSSIBLE to re-cut (same blob hash at freeze
>    and result); smoke reproduction bit-exact 6/6 cells; BK-T2's face
>    REPLICATED on a fresh block (.0945 → .1414 vs .0895 → .1317); the
>    verifier re-derived the decomposition with its OWN bootstrap (CIs
>    agree to the third decimal).
> 2. ⭐⭐ **THE DECOMPOSITION OF RECORD** (8 return classes, additivity
>    EXACT): **directCarom is the ONLY class whose CI clears zero** —
>    .0293 → .0651 per release (Δ +0.0358 [+0.0243, +0.0478], 3.05
>    half-widths, relative +122 %); the distribution family carries
>    81.2 % of the rise; the save family's Δ spans zero AND its share of
>    bounce-backs FALLS (.413 → .316); the short-pass channel is the
>    only channel clearing zero; ⭐ the punt ALREADY came home in the
>    BASE world (.465 → .507, CI spans zero — 大脚回家是旧病,不是新增).
>    NEW FACTS REGISTERED: 78 % of save credits are PARRIES and 84–85 %
>    of parries go to the opponent (a parry-quality face for any future
>    GK slice); 48.5 % of keeper ball-gains come from the REFEREE;
>    BK-C0's "closes fast or not at all" struck a SECOND time.
> 3. ⭐ **THE ATTRIBUTION CORRECTED** (the MED, §CORR 1): CAROM
>    established; WHICH LAW unsplit (two flags differ; the facing law
>    moves bodies too; the class does not label the touch; dose-response
>    correlations weakly negative at low power). The split = a NAMED
>    instrument (facing-only arm or touch labelling). ⭐ THE GATE
>    ADDENDUM, in the player's language: 弹回门将变多,拆开看就是——
>    球现在会从身体上直接弹回来(短传通道;救球没变;大脚回家一直都有)。
>    这是「球会撞到人」的世界的真实弹道,不是门将坏了。你在门上判的是:
>    这更像足球,还是更烦人。
> 4. **PROCESS**: the stats-base registry completion ORDERED for the next
>    stats-drawing stage (§CORR 4). **CONSUMPTION**: block
>    **12,506,000–999 CONSUMED WHOLE** (801 walks; disclosed scratch
>    900,000,000–029); stats base **114,000 consumed** — next ≥
>    **114,200**; next sim block ≥ **12,507,000**.
> 5. **R10 NEXT**: the INFO-DOCTRINE slice 2 contract (拿住球买信息 —
>    scanning / private snapshots) — commander-drafted, bound by the next
>    ruling; IN-C0 dispatches with it.

> **COMMANDER RULING #316 (2026-08-19 — ⭐⭐ THE PRIVATE-SNAPSHOT CONTRACT
> BOUND: INFO-DOCTRINE slice 2 opens on the user's twice-made ask; IN-C0
> dispatched; night-2 round R10):**
>
> 1. ⭐⭐ **[`IN-SNAPSHOT-CONTRACT.md`](IN-SNAPSHOT-CONTRACT.md) DRAFTED AND
>    BOUND** — 拿住球买信息, the doctrine's primitive 3 verbatim (私有快照 +
>    注意力/视野/身体朝向). THE MECHANISM: decisions read a PRIVATE
>    SNAPSHOT of other bodies (fresh inside a vision field DERIVED from
>    the engine's own blind algebra — the shipped (1+dot)/2 form and its
>    pens; never a taste cone), stale outside; the LOOK is a body act
>    priced by the shipped TURN_RATE algebra (the BK turn substrate — a
>    body that must turn to kick is the body that must turn to look);
>    PHYSICS STAYS TRUTH (an unseen body still blocks you; the ball stays
>    slice 1's domain); staleness = FREE wrongness (延迟期间 extended from
>    time to space); NO new attrs/genes. H-IN.1 scored (looks taken at
>    derived cost AND fresh-snapshot carriers choose resolvedly better at
>    matched situations — the user's 中场 story made measurable); H-IN.2
>    REPORTED (R-乙 · pressing sharpens into the true 时间预算攻击 ·
>    Q06 · corridor · goals). The standing observation binds as law:
>    positioning is the latency-free answer and must EMERGE. The banked
>    o2Look seam is the presumptive home for the look — its
>    composition-discharge debt falls due in this arc if extended.
> 2. **IN-C0 DISPATCHED** (instrument-only): the truth-read surface census
>    (bounded or STAGE-STOP) · the vision-algebra inventory · the o2Look
>    inventory (extend-vs-new material; the row-by-row no-banked-seam
>    argument) · the staleness-opportunity census with a counterfactual
>    dose ladder (which choices flip when out-of-field reads freeze) ·
>    perf sizing. The census PICKS the seam design, the refresh law and
>    the slice order. Block **12,507,000–999** + stats from **114,200**
>    open to it (⭐ its probe COMPLETES the stats-base registry first,
>    per #315 §CORR 4's order).
> 3. The BK play-test gate stays OPEN and unaffected; the IN arc runs in
>    its own flags/worlds and pauses at its own gate: 拿住球有用了吗 ·
>    抬头的人踢得更明白吗 · 压迫压的是没看的人吗.

> **COMMANDER RULING #317 (2026-08-19 — ⭐ IN-C0 ADJUDICATED ON A VERIFY
> FAIL: the battery half STANDS bit-exact, the static seam-map numbers
> are VOID pending IN-C0-FIX; a new canon; night-2 round R11):**
>
> 1. **VERIFY FAIL, HONESTLY EARNED** (freeze `e66269c` → result
>    `ab90ce0`; 2 HIGH + 1 MED + 3 LOW; §CORR 1–4 appended). The frozen
>    stripComments opens phantom block comments from `/*` inside LINE
>    comments (the repo's own `src/**` doc-strings, 8 files, 1,194 code
>    lines blanked — 44 % of PlayerBrain.ts). The static surface numbers
>    (1,336 occurrences / 215 interpose sites / 42 gateways) are
>    UNDER-COUNTS and VOID of record; the verifier's independent
>    tokenizer (the probe's own lexicons) reads 1,488 / 254 / 77. ⭐ THE
>    QUALITATIVE VERDICTS SURVIVE: BOUNDED, not a stage-stop; interpose
>    at the enumeration gateway; 0 unknown receivers on the FULL corpus.
>    ⭐ NEW CANON LEDGERED (#317 item 2 home IN-C0 §CORR 2): a
>    text-census completeness gate must be proven NON-VACUOUS against
>    the FULL corpus — stripping is itself an instrument.
> 2. ⭐⭐ **WHAT STANDS** (re-derived bit-exactly from stored cells, 240
>    walks): the STALENESS LADDER — would-be-stale share .303 (F4) /
>    .416 (F2, the engine's own named midpoint); ⭐ THE RECEIVER IS THE
>    BLINDEST REAL SITUATION at every candidate (F2: .505 — the user's
>    接球前观察 story lands exactly); pass-target argmax flips
>    5.6 → 15.7 % across k = {6, 12, 27} at F4 (30.4 half-widths);
>    45.3 % of priced pass candidates are men the passer is not facing.
>    THE VISION ALGEBRA (five anchored candidates; F1 = a turn budget
>    not a seeing law, rejected; F5 = EDS-era taste, rejected; F2
>    recommended with F4 as sensitivity arm; angle-only — the blind
>    algebra has no distance term; the 35.6 m question a named fork).
>    THE o2Look INVENTORY: ⭐ the look CANNOT TURN (buys freshness only
>    on faced bodies — useless for 接球前观察); the gaze machinery
>    (ObserverGaze) exists UNWIRED; the consumer must move off the
>    whether-seat (#222's F-O2a STOP) to the pass chooser. Perf micro:
>    bookkeeping ~0.005 ms/tick (share field's direction mislabel =
>    the named IN-T0 re-anchoring debt). ⭐ THE STATS REGISTRY
>    COMPLETED: R9's list was short by FIFTEEN bases (not four) — 56
>    entries now, method published so it re-runs.
> 3. **IN-C0-FIX ORDERED** (dispatched with this ruling): a real
>    tokenizer (comments AND strings), the corpus-integrity gate
>    non-vacuous per the new canon (reintroducing the buggy stripper
>    must go RED), republished surface/gateway numbers of record, the
>    pwSnapshot.players token, the three Match.ts restart reads classed
>    explicitly (world-owned), the design recommendation re-stated at
>    corrected magnitudes. Static-only: the battery is NOT re-run (its
>    cells stand). Seeds: NONE (text census). The IN-T0 design decision
>    waits on the fixed numbers.
> 4. **CONSUMPTION** (the voided halves consumed their block regardless):
>    block **12,507,000–999 CONSUMED WHOLE** (241 walks); stats base
>    **114,200 consumed** — next ≥ **114,400**; next sim block ≥
>    **12,508,000**.

> **COMMANDER RULING #318 (2026-08-19 — ⭐⭐⭐ THE DEFENSIVE DOCTRINE
> REGISTERED: 防守和进攻一样大; the DF arc is opened by the user's own
> words; the ladder extends):**
>
> 1. ⭐⭐⭐ **[`DEF-DOCTRINE.md`](DEF-DOCTRINE.md) CREATED** — the user's two
>    messages VERBATIM (the four defensive observations + the doctrine
>    message: 压迫和盯人应该是连续的、可学习的,不是二选一;范戴克式/佩佩
>    式;盯谁/换人盯/弃人干持球人/拦截线路/1防2;和教练球队队友有关;防守
>    和进攻一样大), with the ratified mapping to the information
>    primitives and the substrate-status table. STATUS: DOCTRINE, the
>    INFO-DOCTRINE's rank — every future defensive-coordination mechanism
>    answers to it first.
> 2. **THE MECHANISM VERIFICATIONS OF RECORD** (read-only, this session):
>    the Phase-31 press cap exists verbatim at TeamBrain.ts:363-367
>    ("One presser, two for a pressing side — NEVER three") — the user's
>    own old order, to be retired only AFTER the priced per-defender
>    decision exists (the width-floor sequence: make it pay, THEN retire
>    the compensator); the goals-inflation observation matches the
>    INSTRUMENTED record (goals-warming.ts, phase-82 "GOAL INFLATION";
>    BK-T2's control arm at 2.865 vs the band ceiling 2.7536); the
>    Press/Defend mode is a binary threshold at TeamBrain.ts:90; the
>    #248 "assignMarks→对手簇" debt is exactly the 盯谁/换人盯 clause.
> 3. **THE PLAN EXTENDS** (#311's ladder, the user's word standing): after
>    IN-C0-FIX lands → the commander drafts the DF CONTRACT (first slice
>    scoped by DEF-DOCTRINE §2: the continuous press/mark decision
>    surface is the presumptive first cut, census first) → DF-C0
>    dispatched (the hand-rule inventory · the 乱跑 diagnosis faces ·
>    the zonal/chain primitive-gap analysis · THE SEASON LADDER splitting
>    attack-evolves from defence-cannot) → then the IN-T0 vs DF-T0 slice
>    order is presented to the user as a plain-language fork (the two
>    arcs interlock: assignment decisions consume snapshots; 卡身位 is
>    the doctrine's own latency-free answer).

> **COMMANDER RULING #319 (2026-08-19 — IN-C0-FIX BANKED: the surface
> numbers of record land; the IN census CLOSES; the DF contract binds;
> night-2 rounds R12–R13):**
>
> 1. **IN-C0-FIX LANDED** (`17a3019`, verify PASS-WITH-FINDINGS, 4 LOW —
>    §CORR SECOND SERIES appended). The real tokenizer's numbers of
>    record: **1,490 occurrences · 255 interpose sites · 79 named-
>    collection gateways** (the naive pass reproduces the void numbers
>    EXACTLY — the bug is pinned; the mutation goes RED on five gates and
>    was run by the verifier's own hands; the verifier's from-scratch
>    tokenizer, loading the FROZEN lexicons out of the artifact,
>    reconciles every field with zero residual). The design of record
>    RESTATED at honest magnitudes: bounded, gateway interposition, 3.2×
>    reduction (not 5.1×); ⭐ 81 alias-bound gateway sites = IN-T0's
>    call-graph homework. THE IN CENSUS AS A WHOLE NOW CLOSES: ladder +
>    algebra + o2Look + registry (#317 item 2's gold) + the fixed
>    surface. IN-T0's design decision is READY (F2 law · gateway
>    interposition at the carrier's chooser first · extend o2Look with
>    gaze · consumer to the pass chooser) — HELD until the slice-order
>    fork (#318 item 3).
> 2. ⭐⭐ **THE DF CONTRACT BOUND**: [`DF-DEFENSIVE-BRAIN-CONTRACT.md`]
>    (DF-DEFENSIVE-BRAIN-CONTRACT.md) — the doctrine's first
>    implementable cut: ONE CONTINUOUS press/mark/cover/intercept
>    decision surface per defender, consuming the SHIPPED accounts
>    (L3 access-time · defence books · commitment physics; snapshots
>    when the IN arc arms — truth until then, stated); the Phase-31 cap
>    retires ONLY after the swarm it stopped is measured absent
>    (H-DF.1(b), the width-floor sequence); styles must EMERGE (the
>    范戴克/佩佩 test as a reported face); coordination (换人盯/补位/
>    链式/造越位) explicitly OUT of slice 1 (the shared-information
>    cluster's, mapped by the census for later contracts); every DF exam
>    carries THE SEASON LADDER (the user's inflation observation is the
>    disease, so the ruler sees seasons).
> 3. **DF-C0 DISPATCHED** (instrument-only): the hand-rule inventory
>    (tokenizer per the new canon) · the 乱跑 diagnosis faces (assignment
>    churn at world grain) · the zonal/chain primitive-gap analysis ·
>    ⭐ THE SEASON LADDER with frozen-genome cross arms (attack-evolves
>    × defence-frozen and the converse — splitting 攻在进化 from
>    防没长) · the decision-surface sizing. Block **12,508,000–999** +
>    stats from **114,400** open to it.
> 4. **CONSUMPTION** (this round): ZERO seeds, ZERO stats (the fix is
>    static). After DF-C0: the IN-T0 vs DF-T0 slice-order fork goes to
>    the user 人话 (#318 item 3 stands).

> **COMMANDER RULING #320 (2026-08-19 — ⭐⭐⭐ DF-C0's STAGE-STOP RATIFIED
> AS DISCIPLINE: the red gate is a float-association artifact, the
> census's findings are the night's heaviest; DF-C0-FIX + full verify
> ordered; night-2 round R14):**
>
> 1. **THE STAGE-STOP IS RATIFIED** (freeze `61deb21` → result `473fe3a`;
>    gFacesFromDisk RED on 2 of 15 ladder slope deltas at 1e-6 —
>    mean-of-deltas vs delta-of-means, algebraically identical, cause
>    pinned; everything else re-derives bit-exactly: all 15 churn faces,
>    both stored-bin percentiles, 480 ladder checks). The executor
>    refused to re-cut, wrote the artifact to the RED side path, left
>    the canonical path EMPTY, and declared the stop — every clause of
>    the discipline honoured. **DF-C0-FIX ORDERED** (dispatched with
>    this ruling): recompute the slope deltas through ONE formula from
>    the stored per-league cells (no sim re-runs — the cells stand),
>    emit the canonical artifact green, append §R-FIX; and since the
>    original verify never ran (the stop correctly gated it), the fix
>    workflow carries THE FULL bounded-adversarial verify of the whole
>    census. Faces stay REPORTED-not-of-record until it lands.
> 2. ⭐⭐⭐ **THE FINDINGS (provisional pending verify, quoted from the
>    stored cells)**: (i) 乱跑 IS ASSIGNMENT THRASH WITH A ONE-LINE
>    MECHANISM — `team.marks.clear()` + nearest-first greedy re-runs the
>    whole scan every pass ⇒ 16.13 mark-switches per defender-minute (a
>    new man every ~3.7 s), 28.3 % accidental double-marking, 63 %
>    assignment coverage, 1.06 s re-target latency; 换人盯 is IMPOSSIBLE
>    today because no assignment STATE exists to hand off. (ii) ⭐ 补位
>    HAS A FULLY BUILT, UNWIRED MODULE (src/ai/defensiveCoordination.ts
>    — imported by NOTHING in src); 链式 needs a neighbour term + a
>    shared line object (MISSING); 造越位 has law + disposition, no
>    synchronised team act. (iii) ⭐⭐⭐ THE SEASON LADDER ATTRIBUTES THE
>    USER'S INFLATION: goals 2.264 → 3.285 live; DEFENCE-frozen 3.028;
>    ATTACK-frozen 2.468 — 逐季通胀是攻在进化,不是防在腐烂; and the
>    defensive event mix INVERTS (interceptions 11.5 → 7.2 while
>    tackles RISE 6.0 → 7.7): **defending degenerates from READING to
>    CONTACT** — the attack learns to beat the read and defence cannot
>    learn a counter-read; freezing attack cuts the collapse to a
>    third. (iv) The cap's band is REAL (four-chaser bin exactly zero;
>    ≥3 bodies inside 9 m on 32.5 % of carrier ticks = the swarm
>    pressure the cap holds) — H-DF.1(b)'s matched band now exists.
>    (v) The hand-rule inventory: 105 literals / 203 lines / 7
>    constructs, 16 named rules anchored exactly once.
> 3. **THE DESIGN RECOMMENDATION NOTED** (ruling deferred to #321 after
>    verify): DF-T0 = ASSIGNMENT PERSISTENCE — price 「keep my man」 vs
>    「change my man」 on the L3 access-time slack ALREADY computed at
>    the stance line; no new account, no new channel, no new tick; the
>    cap STAYS through the exam. The IN vs DF order is a PACE question,
>    not a dependency (DF slice 1 needs no new information channel; the
>    later coordination cluster genuinely needs the IN arc — its best
>    dormant input consumes snapshots).
> 4. **CONSUMPTION**: block **12,508,000–999 CONSUMED WHOLE** (251
>    walks; the ladder's 4 league seeds walked three arms each); stats
>    **114,400 + 114,600 consumed** (registry at 57) — next stats ≥
>    **114,800**; next sim block ≥ **12,509,000**. Wall-timing and the
>    two contention flakes disclosed (pass in isolation; the known
>    class).

> **COMMANDER RULING #321 (2026-08-19 — ⭐⭐⭐ DF-C0 BANKS WHOLE: the fix
> cured the gate with ZERO published numbers moving; the full verify
> lands 2 MED + 3 LOW and finds THE ZONAL ADOPTION CAP; night 2 parks at
> the slice-order fork):**
>
> 1. **DF-C0 + DF-C0-FIX BANK** (census `61deb21`→`473fe3a`, fix
>    `bd1488e`; the full verify — ordered because the honest stage-stop
>    gated the original — returns PASS-WITH-FINDINGS). The fix's honest
>    inversion: the drifting formula was the frozen probe's own VERIFIER
>    side; the publish side already was the pre-registered estimand —
>    0 of 17,936 numeric fields moved at any decimal; every §R1–§R6
>    number stands as printed. Verify receipts: the 105-literal
>    inventory reconciled SITE-BY-SITE by an independent tokenizer;
>    832 field re-derivations off the canonical artifact, 0 unexplained
>    mismatches; gen-1 identity across arms confirmed at face grain;
>    smoke bit-identical on the stage's own band; the frozen probe
>    byte-unmoved throughout.
> 2. ⭐⭐ **THE ZONAL ADOPTION CAP (verify MED 1, §CORR 1)**: the ecology
>    hand-caps zonal clubs at 4 of 16 and gates entry behind a 0.3 coin
>    (League.ts:988 · evolve.ts:141 · the coach-hire budget). 区域防守
>    长不出来 now has TWO pinned reasons: missing primitives AND a
>    hand-ceiling on the style's ecology. Retiring/parameterising it =
>    a NAMED MENU ITEM (a measured ecology slice, never a free delete).
>    §CORR 2–3 carry the seal lesson (hash the body LAST) and the minor
>    counts.
> 3. ⭐⭐⭐ **THE FINDINGS OF RECORD** (#320 item 2's provisional list
>    CONFIRMS unchanged): 乱跑 = assignment thrash, one-line mechanism;
>    补位 built-and-unwired; the season inflation is ATTACK-DRIVEN and
>    defending DEGENERATES FROM READING TO CONTACT; the cap's band is
>    real. The DF-T0 design recommendation ACCEPTED AS DRAFT LAW
>    (assignment persistence priced on the shipped L3 slack, dormant
>    beside the cap) — final binding at dispatch, after the fork.
> 4. **CONSUMPTION**: fix ZERO seeds/stats. ⭐⭐ **NIGHT 2 PARKS AT THE
>    SLICE-ORDER FORK** (#318 item 3, #320 item 3): IN-T0 (私有快照+
>    抬头 — the perception substrate the coordination cluster needs) vs
>    DF-T0 (盯人持久化 — the 乱跑 cure on shipped accounts, no new
>    channel). A PACE question, not a dependency; presented to the user
>    人话 with this ruling. THE BK PLAY-TEST GATE stays open in
>    parallel (`?a4world=9` vs `8`). Next sim block ≥ **12,509,000**;
>    next stats ≥ **114,800**.

> **COMMANDER RULING #322 (2026-08-19 — the fork DELEGATED by the user's
> word 「自走吧」: the commander's recommendation stands — DF-T0 first,
> IN-T0 next-after; self-drive night 3 opens):**
>
> 1. **THE FORK RESOLVES BY DELEGATION**: ① DF-T0 (assignment
>    persistence) dispatches now; ② IN-T0 (the private snapshot at the
>    carrier's gateway) is the NAMED NEXT-AFTER, its design ready
>    (#319 item 1). Both arcs run to their own exams/entries and PAUSE
>    at their play-test gates; the BK gate stays open in parallel.
> 2. **DF-T0 SCOPE BOUND AT DISPATCH** (per the accepted draft law,
>    #321 item 3): assignMarks PERSISTENCE ONLY — assignments survive
>    across passes; the greedy scan runs only for UNASSIGNED slots;
>    「change my man」 is priced against 「keep my man」 on the L3
>    access-time slack already computed at the stance line (anchored
>    extraction; derived hysteresis, no taste constants); assignChasers
>    and the Phase-31 cap are UNTOUCHED (two compensators never move in
>    one slice; the cap retires only at the exam's H-DF.1(b)). Dormant
>    flag, flags-off byte-identity, pins from birth, doors at the
>    world-9 stack, receipts-not-exam. Block **12,509,000–999** opens.

> **COMMANDER RULING #323 (2026-08-19 — ⭐⭐ DF-T0 BANKED: 盯人持久化 is
> dormant, derived, and the receipts show 乱跑 collapsing 64 % with the
> cap intact; night-3 round R15):**
>
> 1. **LANDED** (freeze `9b1a3f6` → probe-routing fix `a7c9839` → result
>    `4631fe6`; verify PASS-WITH-FINDINGS 1 MED + 4 LOW; §CORR 1–3).
>    THE DESIGN: team.marks ITSELF persists (zero new state; toJSON
>    untouched — worker fixtures play the shipped world by
>    construction); the switch predicate = the shipped L3 account's own
>    metres of recoverable slack (`markSagMetres` at the stance line's
>    argument tuple, its own frozen ceiling; slack ≤ 0 ⇒ today's
>    nearest-first exactly); seven death conditions enumerated; the PC
>    latency composition compose-freely (different objects, different
>    grains); 17 pins, 3 mutants → 7 pin deaths; byte-identity + the
>    fingerprint independently reproduced three ways.
> 2. ⭐⭐ **THE RECEIPTS** (82 walks, world-9 stack, instrument reused
>    verbatim from DF-C0): markSwitchesPerDefenderMinute **15.47 →
>    5.59** (the only face whose CIs do not touch — a RECEIPT, the exam
>    scores it); markHeldShare .616 → .642; dupMark/latency inside
>    half-widths (reported as such); ⭐ THE CAP INTACT: the four-chaser
>    bin EXACTLY ZERO in both arms, shares matching to the third
>    decimal, assignChasers byte-identical (cmp, 125 lines). The MT-T0
>    narrowing RATIFIED; the three stale provenance citations ordered
>    swept (§CORR 2, riding DF-T1's first commit).
> 3. **CONSUMPTION**: block **12,509,000–999 CONSUMED WHOLE** (82 battery
>    walks + smoke 800–802 + the 999 receipt). Stats ZERO — next ≥
>    **114,800**; next sim block ≥ **12,510,000**.
> 4. **DF-T1 DISPATCHED — THE PERSISTENCE EXAM**: scored on virgin seeds
>    with frozen CI rules — **H-DF.0** (pre-registered at dispatch: the
>    thrash collapses at exam grain WITHOUT re-creating the swarm — the
>    churn faces scored, the swarm band + cap-intact limb scored) +
>    REPORTED faces (R-乙 chain · the season ladder judged against the
>    atkFrozen floor +0.2211 per #320 item 3 · goals/§2). H-DF.1's FULL
>    surface differentiation stays with the LATER surface slice — the
>    exam names it out. The citation sweep = commit 1. Block
>    **12,510,000–999** + stats from **114,800** open to it.

> **COMMANDER RULING #324 (2026-08-19 — ⭐⭐⭐ DF-T1 BANKED: H-DF.0 PASS ON
> ALL FIVE CONJUNCTS — 乱跑 is CURED at exam grain with the cap intact
> and coverage RISING; the reading-vs-goals split is the surface slice's
> mandate; night-3 round R16):**
>
> 1. **LANDED** (sweep `8f922c8` → freeze `4492341` → result `e893322`;
>    verify PASS-WITH-FINDINGS 4 LOW, §CORR 1–4; the sweep = exactly the
>    three authorized fixes, zero executable bytes). ⭐⭐⭐ **H-DF.0 PASS**:
>    (a) thrash 16.18 → 6.06 switches/defender-min (**19.44
>    half-widths**); (b1) four-chaser bin EXACTLY ZERO both arms; (b2)
>    the swarm share FELL resolvedly (the rule needed only not-rise);
>    (b3) assignChasers sha-identical (126 lines of record); (c)
>    coverage ROSE resolvedly (.634 → .656 at 3.28 hw). dupMark now
>    resolves down at exam grain; goals FLAT at match grain.
> 2. ⭐⭐ **THE REPORTED FINDINGS**: the season ladder's armed slope bends
>    AWAY from the atkFrozen floor (+1.513 vs +1.256 — a point estimate
>    in overlapping intervals; no between-arm test was frozen, none
>    invented; per the frozen direction it ROUTES TO THE SURFACE SLICE,
>    not to a nudge). ⭐⭐⭐ THE READING-vs-GOALS SPLIT: the interception
>    collapse is 23 % SHALLOWER armed (Δ −3.95 vs base −5.12 across the
>    ladder) while the tackle rise is identical — **保住自己的人买回了
>    「阅读」,但光有阅读买不回进球** — the defensive brain's next slice
>    (the press/mark/cover/intercept SURFACE) now has a measured
>    mandate. ⚠ multiChaseShare3 grazes zero upward (unresolved, frozen
>    rule honoured) — the surface slice re-measures it first. Q07
>    forward share up = a labelled hypothesis.
> 3. **CONSUMPTION**: block **12,510,000–999 CONSUMED WHOLE** (302
>    battery walks + 4 ladder leagues × 2 arms + smoke prefix); stats
>    **114,800 + 115,000 consumed** (registry 59) — next ≥ **115,200**;
>    next sim block ≥ **12,511,000**.
> 4. **IN-T0 DISPATCHED** (the #322 ladder's next-after): THE SNAPSHOT
>    LAW AT THE CARRIER'S CHOOSER GATEWAY — scope bound at dispatch: F2
>    squareAcross (90°, the engine's own named midpoint) as the vision
>    law of record with F4 as the declared sensitivity arm; the
>    per-reader snapshot view interposed at the CARRIER's pass-chooser
>    gateway only (the census's smallest proven-sensitive surface; the
>    81 alias call-graph homework discharged for the carrier surface);
>    bodies outside the field read LAST-SEEN state, refreshed inside
>    it; physics stays truth; NO look yet (o2Look+gaze = IN-T1);
>    dormant flag, byte-identity, pins from birth, doors at the
>    world-9 stack. Block **12,511,000–999** opens. The DF surface
>    slice queues behind it.

> **COMMANDER RULING #325 (2026-08-20 — ⭐⭐ IN-T0 BANKED: the carrier now
> prices 44 % of what he acts on from MEMORY when armed, and the book
> ages to 29.7 sim-s because only carrying refreshes it — IN-T1's LOOK
> has a measured mandate; night-4 round R17):**
>
> 1. **LANDED** (freeze `4d1deea` → result `f81a450`; verify
>    PASS-WITH-FINDINGS 2 MED + 1 LOW, §CORR 1–5; 13/13 gates GREEN;
>    one dispatch death at the account session limit 2026-08-19,
>    resumed 21:00 London, landed by the same workflow's continuation
>    treating the inherited draft as a HYPOTHESIS — recomputed hashes,
>    re-run pins, re-run mutants). THE DESIGN OF RECORD: ONE
>    interposition at decideCarrier's gateway — the two Team bindings
>    SHADOWED by per-reader prototype-delegating views (own props:
>    `players` / `pos`+`vel`), so ZERO read lines rename; in-field ⇒
>    truth this decision, outside ⇒ last-seen; cold start = truth at
>    first read, weight PUBLISHED (1.1 % — the staleness is EARNED);
>    three resolution sites gate views off physics (M5 proves passMate
>    load-bearing; ⭐ the executor FOUND AND FIXED the ghost-strike
>    hole pre-freeze — a stale view could have reached performPass);
>    per-match transient, no serialization (worker fixtures play the
>    shipped world); 26 pins from birth; 5 mutants → 16 deaths (the
>    inherited 18 corrected DOWNWARD by live re-run — ratified as the
>    honest form, §CORR 5); byte-identity in the STRONG form (absent ≡
>    false ≡ field-set-but-shut) and the fingerprint re-run THREE
>    independent ways — `57b0bdab…c673` unmoved.
> 2. ⭐⭐ **THE RECEIPTS** (123 walks = 41 seeds × 3 arms, receipts not
>    findings): chooserReadsStaleShare F2 **.4405** [.393, .503] · F4
>    .3026 — arms disjoint, both fields fire; flipShare F2 **.2206**
>    (11.1 hw from zero; a LOWER BOUND by the declared oracle limits)
>    · F4 .1569 — the IN-C0 ladder's k=27 prediction (.1985/.1571)
>    SIZED THE SEAM CORRECTLY (different estimands, stated, never
>    quoted as identity). ⚠⚠ THE CONFIRMED DOUBT §P9(1) is the stage's
>    most important number: staleAgeMean **29.71 sim-s** (max ≈ a
>    whole match) because a reader refreshes ONLY WHILE CARRYING — the
>    measured hole the LOOK exists to fill, pre-registered as such.
>    Perf inside budget (armedF2−armedF4 .076 vs .108 µs/step; no
>    share published — §R5's mislabelled-direction debt discharged).
> 3. **THE FINDINGS ADJUDICATED** (§CORR this round): the
>    passAffordance homework row's "proof" was FALSE though its
>    verdict survives percept-borne (MED 1 → §CORR 1; a homework row
>    states the provenance that was TRACED); ⭐ THE 81 WAS A CENSUS
>    ARTEFACT — perception.ts's 15 alias sites sat outside IN-C0's
>    file corpus, all verified interposed; **alias denominator of
>    record 96** (IN-C0 §CORR THIRD series; the corpus-integrity canon
>    takes its first recurrence — THE CORPUS INCLUDES THE FILE LIST —
>    ledger refreshed same round). The drifted in-code §SEAM comment
>    (LOW) rides IN-T1's first commit. §R8 item 4's tree-provenance
>    corrected: the inherited partials were the resumed workflow's OWN
>    stall-retries, not the cleaned afternoon dispatch (§CORR 4).
> 4. **CONSUMPTION + GOVERNANCE**: block **12,511,000–999 CONSUMED
>    WHOLE** (123 battery walks + in-band smoke 800–802 + the 999
>    receipt). Stats ZERO — next stats ≥ **115,200** (registry 59);
>    next sim block ≥ **12,512,000**. ⭐ PROGRAMME-LOG era 2 (2,339
>    lines) SEALED byte-verbatim (cmp) to PROGRAMME-LOG-ARCHIVE-2.md,
>    era 3 opened (#303 item 2's rotation law). The QUEUE's FRONTIER
>    line had lagged FIVE rounds behind the rulings (12,507,000 vs
>    12,512,000) — refreshed, with the lag disclosed in-line; the
>    rulings' consumption items remain the sole authority.
> 5. **DF-T2 DISPATCHED — THE DEFENSIVE DECISION SURFACE** (the #324
>    mandate: 保住人买回阅读,阅读买不回进球). Scope bound at dispatch:
>    ONE continuous per-defender surface over the four options the
>    doctrine names (press the carrier · hold my mark · drop to cover
>    · sit on a lane) at the assignMarks seat (DF-C0 §R5's adjacency
>    inside updateTeamBrain), priced on EXISTING accounts ONLY — the
>    L3 access-time slack at the stance line (the DF-T0 idiom extended
>    from keep-vs-change to the full option set), the defence books
>    (learned threat), commitment physics (what a lunge costs);
>    derived thresholds only (#200), no new pricing tables, no new
>    attrs/genes. READS TRUTH, stated not hidden (M-DF.1 — snapshots
>    arm defenders in a later IN slice; IN-T0's gateway is the
>    carrier's, not a defender's). THE CAP AND assignChasers UNTOUCHED
>    (M-DF.2 — the surface arms dormant BESIDE them; the cap-off arm
>    belongs to the exam). dfAssignPersist COMPOSED, not duplicated
>    (the persistence law is the hold-my-mark option's substrate;
>    compose-freely proof at the world-9 + dfAssignPersist +
>    inSnapshotLaw stack). ⭐ FIRST RECEIPT ORDERED: multiChaseShare3
>    re-measured at DF-T1's grain (#324's grazes-zero-upward,
>    unresolved). Receipts-not-exam: usage non-degeneracy by
>    situation/body · churn/coverage/dupMark · the swarm band with the
>    cap intact · the interception face; NO football claim —
>    H-DF.1(a)+(b) is the exam's. Dormant flag, flags-off
>    byte-identity, pins from birth; perf vs the DF-C0 anchor budget
>    (the 0.106 µs/step class). Block **12,512,000–999** opens to it.
>    IN-T1 (o2Look+gaze; §CORR 3's comment fix = commit 1) queues
>    behind → the DF exam → both entries → the play-test gates.

> **COMMANDER RULING #326 (2026-08-20 — ⭐⭐⭐ THE USER'S BK GATE VERDICT,
> two of three questions answered POSITIVE):**
>
> 1. **THE WORDS OF RECORD, VERBATIM** (2026-08-20, delivered while
>    DF-T2 was in flight; registration deferred hours to honour §0.0's
>    do-not-edit-while-an-executor-runs law — the words were locked in
>    conversation at receipt): 「球不穿过人了,门将的球看着还不错」.
> 2. **THE MAPPING**: gate question 2 (球不再穿人了吗) — **POSITIVE**:
>    the CONTACT LAW confirmed at the user's eyes (the instrument side
>    said through-body flights −62 % at H-BK.2; perception now agrees).
>    Gate question 3 (门将的球看着讲理了吗) — **POSITIVE** (「看着还
>    不错」), with the honest cost implicitly accepted: 弹回门将 +47 %
>    (direct carom, #315's decomposition) reads as football liveliness,
>    not as a bug. Gate question 1 (传球像人了吗 — the FACING law's
>    perceptual half) — **UNANSWERED, stays open**, non-blocking,
>    welcome any time.
> 3. **DISPOSITION**: the BK arc's gate stands at 2/3 POSITIVE;
>    `?a4world=9` (身体诚实的世界) holds at the user's eyes. World-9
>    DEFAULT PROMOTION remains a costed menu item (full rebaseline) —
>    this verdict strengthens its case and does not auto-trigger it.
>    No probe is owed (the verdict matches existing instruments:
>    H-BK.2's through-body faces and R9's carom decomposition). Zero
>    seeds/stats consumed.

> **COMMANDER RULING #327 (2026-08-20 — ⭐⭐ DF-T2 BANKED: the defender's
> four options price in ONE currency (metres of net access) beside the
> intact cap — and the receipts hand the exam both a working surface
> and a loud caution; night-4 round R18):**
>
> 1. **LANDED** (freeze `fe277b5` → result `50f813a`; verify
>    PASS-WITH-FINDINGS 2 MED + 5 LOW, §CORR 1–6; 14/14 gates GREEN;
>    169 re-derivations off disk, 0 fails). THE DESIGN OF RECORD: one
>    continuous per-defender chooser at the assignMarks seat, every
>    option priced in METRES OF NET ACCESS = dist − the shipped
>    markSagMetres slack; press prices itself UNDISCOUNTED because the
>    account's own tBall≈0 branch grants zero sag (no carve-out); the
>    reading↔contact split (jump-vs-take) is the account's OWN sign
>    branch — a derived threshold; hold = DF-T0's frozen predicate
>    REARRANGED (composed not duplicated — one markSagMetres call site
>    through one wrapper, MT-T0's narrowed pin honoured); the defence
>    book declines recklessness via its own declinesLunge indexed by
>    commitment physics' arrivalGroup; five anchored extractions, ZERO
>    new magnitudes/attrs/genes. HONEST OPTION SCOPE: 「drop to
>    cover」 NAMED OUT (no action primitive, no cover-fact producer
>    outside the dormant snapshot-shaped module M-DF.4 excludes);
>    standing lane-sit named out with it — the FOUR PRICED OPTIONS ARE
>    press/hold/jump/take, and per verify the mechanism of record is
>    TWO PRICED ELECTIONS + ONE DERIVED LABEL (§CORR 5). PRESS IS AN
>    OFFER: vacating re-opens the shipped Phase-29.1 contain branch,
>    whose ONE-container rule is a THIRD live compensator, untouched.
>    THE CAP INTACT beyond doubt: assignChasers slice sha IDENTICAL at
>    pre-freeze/freeze/result (5b4a21d0…703c, verified independently
>    at all three refs), four-chaser bin EXACTLY ZERO both arms. 20
>    pins from birth; strong dormancy; fingerprint `57b0bdab…c673`
>    re-run four ways, unmoved; perf: no measurable cost against the
>    0.106 µs/step budget (armed measured faster — published as
>    instrument-in-timer caveat, never a speed-up).
> 2. ⭐⭐ **THE RECEIPTS** (82 walks = 41 seeds × 2 arms, receipts not
>    findings; comparisons read as interval overlap — no paired test
>    was frozen, none invented): usage press .0033 · hold .7558 ·
>    jump .0777 · take .1632 (election shares of 85,453 defender-
>    decisions; §CORR 3's realisation-rate face ordered for the exam);
>    press runs ~7× harder in DEFEND mode than in PRESS mode; ⭐ THE
>    BOOK BITES — 25.6 % of press offers are declined by the learned
>    defence book (1,086 offered, 278 declined). ⚠⚠ THE LOUD CAUTION,
>    red left red: at body grain the surface is ONE CORNER — 407/410
>    bodies HOLD-modal, zero press/jump-modal (H-DF.1(a) is NOT
>    answered here; the exam inherits it with the tercile-gradient
>    hypothesis: press/take rise monotonically with attrs.defending).
>    ⭐ multiChaseShare3 (#324's ordered first receipt): .1310 shut →
>    .1275 armed — LOWER, overlapping, face UNRESOLVED for the exam
>    (and a different comparison than #324's persistence pairing,
>    stated). Churn rises a hair armed (6.24→6.81 switches/def-min,
>    overlapping) — a priced reason to leave costs churn, as it must.
>    Interception faces are FRIENDLY team.stats, never DF-C0 §R4's
>    ladder estimand (pre-registered; the mandate's verdict lives at
>    ladder grain, the exam's).
> 3. **THE FINDINGS ADJUDICATED** (§CORR 1–6): the press election's
>    candidate-side slack term UNPINNED (verifier's own mutant, zero
>    pin deaths) + M4's edit ambiguous between the two sites — the
>    disambiguated pin ORDERED onto the DF exam's commit 1, account 1
>    proven at the greedy only until then; election-vs-act denominators
>    fixed of record; the ×7 seam count corrected (5+2); the
>    ledger.idle docblock fix + dead-`d` tidy ride the exam's commit 1;
>    ⭐ the SECOND READER of the defence book RATIFIED (the book is a
>    learned account any priced chooser may read; L3-T0's "ONE
>    CONSUMPTION SITE" sentence is historical as of this stage, its
>    veto-counter integrity preserved by the pure read); M5's
>    zero-kill first run ratified as the mutant discipline WORKING.
> 4. **CONSUMPTION**: block **12,512,000–999 CONSUMED WHOLE** (82
>    battery walks + in-band smoke 800–802 + the 999 receipt). Stats
>    ZERO — next stats ≥ **115,200** (registry 59); next sim block ≥
>    **12,513,000**.
> 5. **IN-T1 DISPATCHED — THE LOOK (o2Look + gaze)** per the #325
>    ladder. Scope bound at dispatch: SCANNING AS A BODY ACT (M-IN.2)
>    — a look refreshes the looker's PRIVATE SNAPSHOT (IN-T0's store)
>    for bodies inside the looked field, at a TIME cost derived from
>    the shipped TURN_RATE/facing algebra (a look away from the ball
>    is a turn paid — anchored extraction, no taste constants); ANY
>    body may look (the 接球前观察 story: an off-ball look buys a
>    fresh book for the moment the ball arrives — the consumer stays
>    IN-T0's carrier gateway, already live); the banked o2Look/gaze
>    machinery is the PRESUMPTIVE HOME per IN-C0(c) (the look that
>    CANNOT TURN + ObserverGaze unwired) — the executor rules
>    extend-vs-new in its §P2 pre-registration, and IF EXTENDED the
>    standing o2Look composition-discharge debt FALLS DUE in this
>    slice (M-IN.2's clause); no new attrs/genes (M-IN.3); an
>    all-scanning world is a FAILURE mode (the cost must
>    differentiate situations, §4). COMMIT 1 RIDER: IN-T0 §CORR 3's
>    one-clause §SEAM comment fix in PlayerBrain.ts. RECEIPTS ordered:
>    look usage by situation (non-degeneracy), ⭐ THE 29.7 sim-s
>    staleness age RE-MEASURED ARMED (the LOOK's purchase, the #325
>    measured mandate), flip-share movement, stale-share movement;
>    receipts-not-exam (H-IN.1 is the exam's). Dormant flag, strong
>    dormancy, pins from birth, doors at the world-9 + dfAssignPersist
>    + dfSurface + inSnapshotLaw stack (16-cell power set or the
>    stated economical subset). Block **12,513,000–999** opens to it.
>    Behind it: the DF EXAM (H-DF.1(a)+(b) inside the cap; carries
>    §CORR 1/3/5's riders + the ladder estimand + multiChaseShare3) →
>    both entries → the play-test gates (BK's stands at 2/3 per #326).

> **COMMANDER RULING #328 (2026-08-20 — ⭐⭐⭐ THE USER REFINES THE GK
> VERDICT AND OFFERS THE ARC HYPOTHESIS: the distribution carom is
> ruled UNREALISTIC and jumps the queue):**
>
> 1. **THE WORDS OF RECORD, VERBATIM** (two messages, in order;
>    delivered while IN-T1 was in flight, locked in conversation,
>    registered now per §0.0): ①「我不喜欢的是:门将开球本来要给前面
>    或者中锋,结果直接弹到后卫或者对面压迫过来的前锋的身体上然后弹
>    回来,这个不现实足球」 ②「或者你觉得球的弧线要不要提高?」
> 2. **THE MAPPING**: #326's question-3 positive STANDS overall, and
>    the DISTRIBUTION-CAROM SUB-PATTERN (GK launch → strikes a
>    defender or the pressing forward point-blank → returns) is ruled
>    UNREALISTIC BY THE USER — a priority mandate under the ratified
>    user-intuition mode. The eyes and the ledger AGREE: R9 (#315)
>    decomposed the +47 % bounce-back as direct carom only with the
>    DISTRIBUTION FAMILY carrying 81 % — the user dislikes exactly
>    the dominant component. REALITY: blocked clearances are real but
>    PRESSURE-CORRELATED errors; a keeper with time picks a line over
>    the first wave. Our launch chooser prices bodies at zero (its
>    habits were formed in the ghost world), so the FREQUENCY and the
>    indiscriminateness are the unrealism, not the carom's existence.
> 3. **THE TWO HYPOTHESES, FROZEN AS THE CENSUS'S PRIORITY QUESTIONS**:
>    **A (the user's arc question)** — a CAPABILITY gap: the loft
>    ceiling may be too low for a launch to clear a body wall at
>    realistic ranges (if true: raise the substrate ceiling honestly —
>    身体做得到的事引擎要做得到). **B (the pricing gap)** — the
>    corridor is unpriced: higher lines exist and are never chosen.
>    THE DISCRIMINATOR: of the distribution caroms, how many had a
>    CLEARING higher line AVAILABLE at the same target (available-but-
>    unchosen = B; unavailable = A). THE REALITY SIGNATURE: block rate
>    should RISE with pressure (learned line-picking) — flat-in-
>    pressure = blind launching. ⛔ The default arc is NOT hand-raised
>    either way (it would erase the flat-vs-lofted tradeoff and hide
>    the blindness); if A is true the CEILING moves, and WHEN to go
>    high stays priced and emergent.
> 4. **DISPOSITION**: the distribution census (BK-C1) INSERT-QUEUES
>    ahead of the DF exam (#329 item 5 dispatches it). The named
>    doors it serves: the punt landing price + oracle-hazard pricing
>    (#309 item 3, now user-mandated). Q06's −8.9 pp completion is
>    pre-registered as a face that should PARTIALLY RECOVER when the
>    fix slice lands. Zero seeds/stats consumed by this ruling.

> **COMMANDER RULING #329 (2026-08-20 — ⭐⭐ IN-T1 BANKED: the look buys
> the book back 27.5 → 0.95 sim-s at a real turn price, the keeper
> declines to turn his back and that IS the football; one red gate
> ratified as a mis-pitched conjunct; night-4 round R19):**
>
> 1. **LANDED** (freeze `f711e6d` → result `97cede9`; verify
>    PASS-WITH-FINDINGS 2 MED + 3 LOW, §CORR 1–6; 17/18 gates GREEN,
>    the 18th ratified red; artifact of record on the RED side path
>    per the discipline). THE DESIGN OF RECORD: TWO HALVES at ONE fork
>    at decidePlayer's head — the free PASSIVE refresh (every body,
>    his heading field, at his own decision — M-IN.1's sentence
>    applied at last; scope ratified §CORR 4) and THE PRICED LOOK
>    (aim at a REMEMBERED body outside the field; refresh exactly the
>    looked field; pay ceil(θ/(TURN_RATE·DT)) — the BK facing law's
>    own anchored line, cross-checked live at 9 angles; locked out of
>    re-deciding for the window; age cap 29 = the full reversal);
>    election = argmax(gain − loss) in BODY-TICKS of staleness at
>    derived threshold ZERO — no attrs, no genes, no taste constants
>    (the verifier re-derived the algebra by hand and found no #200
>    violation; the look pays MORE than the strike turn, not less —
>    no cone rebate). EXTEND-vs-NEW ruled NEW on seven rows; IN-C0's
>    EXTEND recommendation superseded of record; the o2Look debt does
>    NOT fall due (§CORR 5). The §CORR 3 comment rider landed TRUE
>    (verified against whetherEye.ts:147 itself). 31 pins; 8 mutants
>    → 23 deaths; ⭐ the ordered unpinned-term hunt CAUGHT TWO before
>    the battery (THE LOCK — the look's entire price was free and the
>    ledger receipt still incremented, the trap disclosed — and THE
>    EXCLUSIVITY double-charge); strong dormancy; fingerprint
>    `57b0bdab…c673` unmoved (verifier's own hand + 59 neighbouring
>    pins green).
> 2. ⭐⭐ **THE RECEIPTS** (82 walks = 41 seeds × 2 arms, BOTH arms
>    carrying IN-T0 armed at F2 — matched estimand, the arms differ
>    in the look alone; receipts not findings): ⭐ THE BUY-BACK —
>    staleAgeMean 27.49 sim-s (lookShut) → **0.95 sim-s** armed
>    (9.72 hw, disjoint); stale share .424→.097; flip share
>    .248→.026; the priced look bought **45.8 %** of the erased
>    staleness (body-tick attribution; the look-only counterfactual
>    arm is the exam's). ⭐ THE COST BITES BOTH WAYS: 56 % of
>    decisions look, 44 % DECLINE (32 hw below the all-scanning
>    failure mode); situation spread carrier .77 / off-ball .69 /
>    keeper .11 (10.2 hw) — the keeper's refusal to turn his back
>    EMERGES from the loss term, unwritten. Paid time ~19.9 ticks =
>    0.33 sim-s per look, inside the derived [15, 29] band. ⚠⚠ THE
>    LOUDEST WORLD-LEVEL RECEIPT: goalsPerMatch 2.93 → 1.80 armed —
>    no between-arm test frozen, none invented, but the armed world
>    is a SUBSTANTIALLY different football world; the exam and any
>    ship decision weigh it at ladder grain. oracleStaleShare RISES
>    .45→.63 while age falls 28× — §P9(4)'s pre-registered mechanism
>    (a fuller book serves more from memory), the flip share follows
>    the AGE.
> 3. **THE FINDINGS ADJUDICATED** (§CORR 1–6): the argmax `− loss`
>    selection term UNPINNED (the DF-T2 lesson's THIRD instance —
>    verifier's hunt caught what the author's hunt missed; pin
>    ordered onto the IN exam's commit 1 with the two inert guards);
>    pay-after-serve + the 7.2 % arrival refund NAMED of record as
>    reality approximation 2 (a cheapening direction; the exam
>    re-checks the all-scanning guard); the RED gate ratified as a
>    mis-pitched conjunct (every-body universality over a role whose
>    geometry legitimately declines — the exam's form is
>    non-degeneracy BY SITUATION); the passive half ratified within
>    contract; the QUEUE's stale anti-pinball debt struck (#313
>    discharged it).
> 4. **CONSUMPTION**: block **12,513,000–999 CONSUMED WHOLE** (82
>    battery walks + in-band smoke 800–802 + the 999 receipt + the
>    in-band red-seed diagnostic). Stats ZERO — next stats ≥
>    **115,200** (registry 59); next sim block ≥ **12,514,000**.
> 5. **BK-C1 DISPATCHED — THE DISTRIBUTION CENSUS (instrument-only,
>    census-first)**, the #328 mandate INSERT-QUEUED ahead of the DF
>    exam. Scope bound at dispatch: (a) THE ARC INVENTORY — launch-
>    angle/apex distribution by delivery type (punt · loft · cross ·
>    throw · pass) from the shipped flight physics, and THE PHYSICS
>    CEILING: can a max-loft launch clear a body wall at realistic
>    ranges (hypothesis A, the user's arc question — answered as
>    code-fact + measured fact); (b) THE A-vs-B DISCRIMINATOR — of
>    the distribution caroms (R9's chain-ledger family reused), the
>    share with a CLEARING higher line AVAILABLE at the same target:
>    available-but-unchosen = B (pricing), unavailable = A
>    (capability); (c) THE PRESSURE SIGNATURE — block rate vs
>    presser distance at launch (the reality signature: rising =
>    error-under-pressure, flat = blind launching); (d) THE ORACLE
>    SURFACE — where the punt/loft/cross target choosers live, what
>    a corridor-hazard price would consume, the λ_LIN sizing idiom,
>    perf bound; (e) the Q06 −8.9 pp linkage stated. CENSUS PICKS
>    the fix slice's design (ceiling · pricing · both) and order.
>    Instrument-only — ZERO src behaviour change; pins for any
>    extraction; the census artifact carries stored cells per canon.
>    Block **12,514,000–999** opens to it. Behind it: the DF exam
>    (H-DF.1(a)+(b), #327's riders) → the IN exam (H-IN.1, #329's
>    riders) → the fix slice BK-C1 picks → entries → the gates.

> **COMMANDER RULING #330 (2026-08-20 — ⭐⭐ THE USER GENERALIZES THE
> CORRIDOR MANDATE: every pass and shot should know the bodies on its
> line, with the high ball and the CURVED ball as alternatives):**
>
> 1. **THE WORDS OF RECORD, VERBATIM** (delivered while BK-C1 was in
>    flight, locked in conversation, registered now per §0.0): 「哦对,
>    球员现在能知道自己传球/射门路线上有人会挡住,或者容易被预判从而
>    选择其他的传球方式(如高球弧线球)」.
> 2. **THE CODE-FACTS OF RECORD** (commander's read-only verification
>    + the census's own findings): the GROUND lane half EXISTS and is
>    consumed (laneOpenness/canInterceptPass in the pass oracles;
>    deliveryValueSeat's time-aware corridor); the AIR half exists but
>    is THE WRONG SHAPE (airLaneOpenness = distance-from-kicker only,
>    no direction, no height — BK-C1 §R6); the lane model PREDATES the
>    contact law (it prices deliberate interception, not passive
>    body-strike — the Q06 −8.9 pp root); ⭐ THE CURL EXISTS IN THE
>    SUBSTRATE (Ball.spin, Phase-37 Magnus, curlKick; the Phase-71
>    ground bender — both the user's own earlier asks) — whether any
>    chooser ELECTS it tactically is unmeasured. The mind-game half of
>    预判 (disguise, choosing the unexpected) stays INFO slice 3's,
>    deliberately.
> 3. **THE MANDATE, GENERALIZED**: the corridor-hazard fix is not a
>    GK-only patch — (i) slice 1 = BK-C1's pick (the lofted delivery
>    choosers incl. the punt, #331 item 2); (ii) NAMED DOORS opened by
>    this ruling: THE SHOT-PATH HAZARD (射门路线上有人 — the shot
>    oracle's corridor, unmeasured; scoped out of BK-C1 on purpose) ·
>    THE TACTICAL CURL ELECTION (does/should a chooser bend a ball
>    around a blocker — substrate ready, election unmeasured) · the
>    cross's own 92/116 blocked-short question (BK-C1's honest
>    exclusion). Each door opens by measurement, never by a hand rule.
>    Zero seeds/stats consumed.

