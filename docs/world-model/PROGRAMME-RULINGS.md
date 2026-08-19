# PROGRAMME — Commander rulings (verbatim; LIVE FILE, #303 onward)

> This file holds commander rulings **#303 onward, verbatim**, APPENDED in numeric
> order — nothing is ever reworded. Earlier eras, byte-verbatim: #2–#284 in
> [`PROGRAMME-RULINGS-ARCHIVE-001-284.md`](PROGRAMME-RULINGS-ARCHIVE-001-284.md);
> #285–#302 (BU→PW→PC) in
> [`PROGRAMME-RULINGS-ARCHIVE-285-302.md`](PROGRAMME-RULINGS-ARCHIVE-285-302.md)
> (the unnumbered 2026-07-24 ruling remains in `PROGRAMME.md`'s context block).
> **Resume = `tail -n 120` of THIS file.** Find any ruling by number:
> `grep -n "RULING #N " docs/world-model/PROGRAMME-RULINGS*.md`. Rotation rule:
> ~1,500 lines ⇒ rotate the closed era in the same round as a ruling (#303 item 2).

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
