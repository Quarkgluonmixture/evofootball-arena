# PROGRAMME — Commander rulings (verbatim; LIVE FILE, #373 onward)

> This file holds commander rulings **#373 onward, verbatim**, APPENDED in numeric
> order — nothing is ever reworded. Earlier eras, byte-verbatim: #2–#284 in
> [`PROGRAMME-RULINGS-ARCHIVE-001-284.md`](PROGRAMME-RULINGS-ARCHIVE-001-284.md);
> #285–#302 (BU→PW→PC) in
> [`PROGRAMME-RULINGS-ARCHIVE-285-302.md`](PROGRAMME-RULINGS-ARCHIVE-285-302.md);
> #303–#330 (perception gate→BK/IN/DF nights) in
> [`PROGRAMME-RULINGS-ARCHIVE-303-330.md`](PROGRAMME-RULINGS-ARCHIVE-303-330.md);
> #331–#345 (BK-C1→GC-T1, nights 6–7 opening) in
> [`PROGRAMME-RULINGS-ARCHIVE-331-345.md`](PROGRAMME-RULINGS-ARCHIVE-331-345.md)
> #346–#365 (GC-T1B→the DX/RA arc→the twelfth world) in
> [`PROGRAMME-RULINGS-ARCHIVE-346-365.md`](PROGRAMME-RULINGS-ARCHIVE-346-365.md)
> #366–#372 (the passing audit ratified→RC-C0/PT-C0/RC-T0/RC-T1a+fix) in
> [`PROGRAMME-RULINGS-ARCHIVE-366-372.md`](PROGRAMME-RULINGS-ARCHIVE-366-372.md)
> (the unnumbered 2026-07-24 ruling remains in `PROGRAMME.md`'s context block).
> **Resume = `tail -n 120` of THIS file.** Find any ruling by number:
> `grep -n "RULING #N " docs/world-model/PROGRAMME-RULINGS*.md`. Rotation rule:
> ~1,500 lines ⇒ rotate the closed era in the same round as a ruling (#303 item 2).
> **COMMANDER RULING #373 (2026-09-04 — ⭐⭐⭐ RC-C0b BANKED: the
> pre-strike percept is LICENSED on the TURNING axis (a carrier swinging
> his body at the top angular-speed bin quadruples the odds a pass is
> coming: 0.101 → 0.399, 94 hw, book-independent) — but 「转向我」 adds
> nothing to 「要传了」, the family sees a third of wind-up ticks aimed
> at the target, the target is side-on 0.515 during the wind-up and
> fewer than half could turn in time; ⭐⭐ TURNING IS FREE in this
> engine ⇒ the READY limb WAITS for a movement-facing law; THE BF ARC
> INSERTED (a S1 body-dynamics slice); BF-C0 DISPATCHED):**
>
> 1. **LANDED AS FROZEN** (freeze `76f212d` → results `f801fe4`; the
>    first dispatch died three times on a network outage before writing
>    anything, re-dispatched clean). RECEIPTS: 14/14 gates; `gFaces`
>    re-derives every face, the licence word, coverage and precision
>    straight off the SERIALIZED 120-cell table; block **12,536,000–999
>    CONSUMED WHOLE** (999 seeds × 2 paired arms + receipt; booked =
>    walked = 2,000; tail EMPTY); scratch 900,002,200–211 (smoke) ·
>    290–291 (lockstep); ZERO stats — registry 73; X-SRC-ZERO; typecheck
>    clean; fingerprint UNCHANGED; wall 9.4 min. ⭐ THE TWO NEW CANONS
>    HONOURED FROM BIRTH: the artifact is COMPACT JSON (**4,359,578
>    bytes** for 999 × 2 walks — against RC-T1a's 35.6 MB); the hash is
>    computed after `gates.gFaces` and `artifact.gates`, and a NON-body
>    `receipts.hashReproducesFromFile` records it (the verifier
>    re-implemented canonicalJson and reproduced `37cdff0b…f41b` from
>    the published file). VERIFIER OF RECORD: **PASS, zero HIGH, ONE
>    MEDIUM** (item 3); its own bootstrap over the 999 per-seed cells
>    reproduced Δ_F bit-exact (0.298165) with its own CI [0.294848,
>    0.301529] — same word; it proved the rank-partition arithmetic
>    itself (Σ rank-1 cellTicks = the carrying-tick count exactly); 26
>    numbers traced, 0 mismatches; the family F judged HONESTLY chosen
>    (the commander's own named candidate, both edges from the engine's
>    grain: 4 rad/s = 61.5 % of `TURN_RATE`, rank 1 = RC-C0 §P.A's
>    argmin reused byte for byte).
> 2. ⭐⭐⭐ **THE VERDICT OF RECORD — §P.C: LICENSED**, and what it
>    licenses, precisely: (a) THE DETECTOR — P(wind-up | carrying tick)
>    **0.101168** (base rate); P(wind-up | F = the top heading
>    angular-speed bin [4, 6.5] rad/s ∧ rank 1) **0.399333**; Δ_F
>    **+0.298165** [0.295059, 0.301409], **93.899 hw**; the dosed arm
>    reads the same (0.103365 → 0.389957) — the signal is the passer's
>    BODY, not the book. ⭐ BUT the licence is the TURNING AXIS ALONE:
>    the top angular-speed bin against the cell base gives +0.298178 —
>    the whole of Δ_F — while rank 1 gives −0.000070 [−0.000118,
>    −0.000024]. Rank CANNOT move P(wind-up | ·): it partitions the
>    mates inside a tick, so every rank marginal equals the base rate
>    (0.101168 / 0.101168 / 0.101168 / 0.101169 / 0.101522). What F
>    licenses is 「他正在转身」, not 「他正在转向我」; the 「传给谁」 half is
>    a SEPARATE measured face — P(target = me | wind-up ∧ F) =
>    **0.379738** (rank 1), and the READY limb's belief must carry the
>    two tables separately. (b) THE REACH — F fires on **0.339729** of
>    (wind-up tick × target mate) pairs (per-FLIGHT coverage ≥ that,
>    unpublished — item 3); three fires in five are on a carrier who is
>    NOT winding up; the believer is the intended target 0.38 of the
>    time he is right about the wind-up. Coverage, not Δ_F, sizes what
>    the limb could ever buy. (c) THE FACING GEOMETRY — during the
>    wind-up the target is front-on **0.346119** at the last pre-release
>    tick (side **0.515405**, back 0.138476; at the arm tick front
>    0.325193); the turn he needs to face the passer: median **65°**,
>    mean 72.6°, **12.5 ticks** against a mean window of **10.3 ticks**;
>    **0.453206** could complete the turn inside W — a CEILING (turning
>    from the arm tick, full rate, no reaction delay; AI_INTERVAL alone
>    ≈ 9 ticks against a median window of 8). (d) ⭐⭐⭐ **THE COST OF
>    FACING IS ZERO — a code fact, verified twice**: `Player.physicsStep`
>    clamps and integrates velocity and position from `desiredVel`,
>    `topSpeed` and `accel`, and only THEN rotates `heading` toward
>    `faceTarget`, never reading it back; the fixture drove two
>    identical bodies at one target for 120 ticks — the same distance
>    to the last float (ratio 1) with one body's heading 1.57 rad off
>    its velocity. SUBSTRATE-MAP S1 names this debt verbatim ("one
>    isotropic accel envelope + a separately rotating heading";
>    `agility` "a flat TURN_RATE 6.5, attr-blind"); VISION S11 lists 转身
>    among the three glue scenarios.
> 3. **THE MEDIUM — DISPOSED** (§CORR appended): HONEST LIMITS 3 and the
>    results commit's subject converted the per-TICK coverage
>    (0.339729 of pairs) into a per-PASS claim ("two of every three
>    passes"); with a mean window of 10.27 ticks the per-FLIGHT coverage
>    is ≥ 0.339729 and is not computable from the stored cells. The
>    sentence is struck; the commit subject is WRONG of record on that
>    clause; **RC-T0b's pin suite publishes the per-FLIGHT coverage of
>    F** — the number the limb actually lives on.
> 4. ⭐⭐⭐ **THE DESIGN RULING — THE READY LIMB WAITS FOR A PRICED BODY.**
>    The detector is honest; the ACTION is not: a receiver who turns
>    toward the passer in this engine loses NOTHING — not speed, not
>    ground, not sight (off-ball perception is truth). A free action
>    cannot be an evolutionary trait: `rcReadyWeight` would saturate at
>    1 with no trade, the exam would measure a glue-assisted benefit,
>    and the limb would be a hand-coded behaviour wearing a gene
>    (VISION §1: the substrate ALLOWS **and PRICES**; #200: no free
>    lunch). REALITY (the #201 oracle): every coached receiver knows
>    opening the body costs a step — backpedal and lateral shuffle are
>    slower than forward running; that step IS the trade that makes
>    facing a decision. THE FORK, in football words: **(A)** price the
>    turn first — a small S1 body law (BF: a body's achievable speed
>    scales with the angle between its heading and its movement,
>    `agility` sizing the penalty), census → dormant law → exam → then
>    the READY limb on top, exam'd with the price in both arms; slower
>    by three or four executor rounds, and the law touches every body
>    (markers backpedalling, keepers, the support fan) so its exam is a
>    whole-game exam; **(B)** build the READY limb now on free turning —
>    faster, but its exam measures a free lunch, its gene means nothing,
>    and the result is thrown away when the price lands. THE COMMANDER
>    RULES **(A)** (the substrate-first pivot of 2026-07-20; the user's
>    standing bar 「只要方向没问题可以等」), and states the cost
>    plainly: the RC arc pauses for BF; the user may overrule at any
>    round (a census is reversible). ⭐ The BF law also gives `agility`
>    its FIRST movement consequence (an attr-blind row of VISION §3
>    closes) — direction evidence beyond RC.
> 5. **THE BF ARC INSERTED — CONTRACT OF RECORD:**
>    [`BF-BODY-FACING-CONTRACT.md`](BF-BODY-FACING-CONTRACT.md) (doctrine:
>    a body runs fastest where it faces; M-BF.1 the facing factor f(φ)
>    — ahead 1, lateral and back = the REALITY ANCHOR's own fractions
>    ratified by ruling, the PC-tier precedent; M-BF.2 agility bites;
>    M-BF.3 nothing else changes, Road B; M-BF.4 the coupling to RC —
>    RC-T0b after BF-T0, RC-T1b with BF armed in both arms; §6/§7
>    audits PASS). The RC contract carries the 3b STATUS and the
>    amended sequence: **RC-T0 ✅ → RC-T1a ✅ → RC-C0b ✅ → BF-C0 → BF-T0 →
>    RC-T0b → RC-T1b (+ BF-T1 beside) → entry.** The arc sequence of
>    record (#366 item 1) is unchanged; BF is an S1 substrate insertion
>    that ① requires, named in SUBSTRATE-MAP S1's own "Add" list.
> 6. ⭐⭐ **BF-C0 DISPATCHED — THE MOVEMENT-FACING CENSUS** (the census
>    form; X-SRC-ZERO; compact JSON; the hash receipt; definitions
>    frozen at the executor's §P): (a) TODAY'S MISALIGNMENT — over every
>    open-play tick on which a body MOVES (|vel| above the shipped
>    heading-follow floor, anchored), φ = the angle between heading and
>    velocity (15° bins stored), by action class × speed bin × role ×
>    side-of-ball; the share of moving ticks with φ > 45° and > 90°;
>    the speed achieved per φ bin (the isotropic envelope's receipt: the
>    same top speed regardless); metres/match covered misaligned;
>    (b) THE EXPOSURE TABLE — per action class and role, the moving
>    ticks and metres a facing factor would scale (counts; no factor
>    applied — a census applies nothing); (c) THE `faceTarget` SEAM MAP
>    — every src site that sets it, anchored with line receipts and its
>    action class (who faces away from motion by decision today); (d)
>    THE REALITY ANCHOR — the literature's lateral-shuffle and backpedal
>    speed fractions vs forward sprint, cited with sources and the
>    executor's access stated honestly (unverified if from memory);
>    the constants are RATIFIED at banking, not chosen by the census.
>    ARMS: world 12 EMPTY-BOOK and the SHIPPED default (PT-C0 arm D's
>    construction — the law would reach both), paired on shared seeds.
>    No pre-commitment (a blast-radius census). Block **12,537,000–999**;
>    scratch 900,002,300–399; ZERO stats; registry 73; standing orders.
> 7. **CONSUMPTION THIS RULING**: the RC-C0b block per item 1; ZERO
>    stats; next sim ≥ **12,537,000** → BF-C0; after it ≥ 12,538,000;
>    stats ≥ 117,600; registry 73.

> **COMMANDER RULING #374 (2026-09-04 — ⭐⭐⭐ BF-C0 BANKED on a verify FAIL
> disposed by commander corrections (two HIGH in PROSE, the artifact and
> every stored face intact): the facing law is SMALL (≤ 5.4 % of the
> ground), keeper-dominated in MISALIGNMENT (60 %) but NOT in cost
> (24 %); outfield misalignment is 96.5 % LAG — so on outfield bodies
> the law prices DIRECTION CHANGES, which reality also does; ⭐ THE LAW
> OF RECORD frozen: a cosine-flat facing factor with k = 0.70 on both
> sides and `agility` sizing the depth, applied to the INTENDED
> velocity; BF-T0 DISPATCHED):**
>
> 1. **LANDED IN TWO EXECUTOR SESSIONS** (freeze `5010777` → results
>    `5149def`). The first executor died on an account usage limit after
>    the battery and the §R draft; a second validated the artifact
>    against the frozen instrument (head, instrument sha256, 13/13 gates,
>    the hash receipt, the file byte-hash, an independent canonicalJson
>    recomputation) and landed the results WITHOUT re-walking — three
>    doc-only edits, endorsed. RECEIPTS: block 12,537,000–999 opened,
>    **200 shared seeds × 2 arms + the receipt = 402 walks, BOOKED =
>    WALKED**, the tail 12,537,200–998 DECLARED virgin (the §P.G
>    artifact-size reason, frozen before sight); COMPACT JSON
>    **9,620,457 bytes**; the hash computed LAST and reproduced from the
>    published file (the NON-body receipt true; the verifier's own
>    re-implementation agrees); scratch 900,002,300–311 · 390–391; ZERO
>    stats — registry 73; X-SRC-ZERO; typecheck clean; fingerprint
>    UNCHANGED; `gFaces` 411/411 + 38/38 off disk; 53/53 fixtures; the
>    facing-free fixture RE-RUN at this HEAD — ratio exactly 1.
>    VERIFIER OF RECORD: **FAIL — two HIGH, two MEDIUM, one LOW, ALL IN
>    PROSE** (item 2); it re-decoded all 200 per-seed cell arrays with
>    its own index decode and reproduced every headline bit-exact,
>    recounted all 57 `faceTarget` occurrences in 8 files with every
>    line receipt verbatim, and re-derived all 42 cells of the exposure
>    table.
> 2. **THE FAIL, DISPOSED BY COMMANDER CORRECTIONS** (§CORR appended;
>    two clauses corrected IN PLACE; nothing else moves): (i) HIGH — the
>    blast-radius headline said "roughly 60 % of that [the steep pair's
>    loss] comes off one role": the keeper's share of the LOSS is
>    **24.1 %** (118.885 of 492.902617 m); 60 % is his share of the
>    MISALIGNED METRES — a computed value restated against the wrong
>    denominator, ⚠ and the commander repeated it to the user in the
>    previous round; corrected here and below. (ii) HIGH — "1.6 %–3.5 %
>    of an outfielder's ground" had no field: the artifact-derived shares
>    are **1.09 / 2.70 / 4.29 %** (gentle / moderate / steep). (iii)
>    MEDIUM — under the frozen LINEAR illustrative shape 55–57 % of each
>    metres-lost row is a toll on NEARLY-ALIGNED running (φ bin 0, 3.3 %
>    at 7.5°): faithful to §P.C, and decisive for the law's shape (item
>    4). (iv) MEDIUM — the "two-thirds decision" reading is the keeper's:
>    per role, `faceTarget`-driven misalignment is GK 0.9946 vs outfield
>    0.0346 ⇒ **96.5 % of outfield misalignment is turn-rate LAG**. (v)
>    LOW — a wall-clock literal without a field. NEW CANON (refreshed in
>    `CANON.md`): "a stage doc's numeric sweep covers EVERY numeric
>    literal in prose at ANY precision; a hand-written percentage is the
>    likeliest second copy" — the landing sweep's 6-dp regex could not
>    see either HIGH. The commander recomputed items (i)–(iii) from the
>    artifact's bins himself before ruling (数值 claim 必实测).
> 3. ⭐⭐⭐ **THE READINGS OF RECORD** (every number QUOTES the artifact or
>    the §CORR recipe): (a) one moving tick in seven runs > 45° off the
>    heading (`E.share45` 0.138256; S 0.139851) and one in thirty-one
>    backwards (0.031930; S 0.036486); (b) it is the KEEPER —
>    `GoalkeeperPosition` faces the ball while shuffling along his line
>    (GK share45 0.855206, 0.624788 of his ticks in the 75–90° bin; every
>    outfield role 0.047–0.071); (c) the two examples the dispatch named
>    DO NOT EXIST in this engine: `MarkOpponent` never writes
>    `faceTarget` (share90 0.021026, the outfield baseline) and
>    `ReceivePass` sits at 0.021463 — **the law would not price
>    behaviours that are already there; it would open a price at which
>    they could evolve**; (d) misalignment lives at walking pace (share45
>    0.432562 at 0.5–2 m/s, 0.001551 at sprint); (e) THE BLAST RADIUS is
>    small — the steep pair takes 5.4 % of the ground, the keeper 24 % of
>    that, outfield bodies 4.3 % of their own ground at the steep pair —
>    and (f) on outfield bodies **what it prices is the heading catching
>    up after a direction change** (96.5 % lag): REALITY (the #201
>    oracle) says that is exactly right — a body cannot sprint sideways
>    until it has turned, and the time it takes IS the turn cost
>    SUBSTRATE-MAP S1 names; (g) THE ANCHOR — backward ≈ 0.70–0.74 of
>    forward (two sources verified at one remove), lateral ≈ two thirds
>    (no clean maximal ratio found); **the ordering BACK ≤ LATERAL is
>    NOT established** — a modelling choice; (h) the 0.5 m/s floor
>    excludes standing turns (0.123498 of body-ticks) — a hole the law
>    must cover by construction.
> 4. ⭐⭐⭐ **THE LAW OF RECORD — M-BF.1/M-BF.2 FROZEN FAMILY** (the exact
>    seam form is BF-T0's §P; these are the RATIFIED constants and
>    shapes, each traced): (i) THE SHAPE — the engine's own cosine
>    misalignment family (`kickMisalignment = (1 − cos θ)/2`, the BK
>    facing law's form), FLAT near 0° and saturating at 90°:
>    `f(φ) = 1 − D · (1 − cos(min(φ, π/2)))` — f(7.5°) = 0.997, f(45°) =
>    0.912, f(≥ 90°) = 1 − D; item 2(iii)'s bin-0 toll vanishes by
>    construction. (ii) THE ANCHOR CONSTANT — **k = 1 − D = 0.70 on BOTH
>    sides** (lateral = back), the one figure the literature supports on
>    both directions at one remove (backward 0.70–0.74; lateral ≈ 2/3),
>    the ordering left unimposed because the evidence does not impose
>    it; the exam reports k = 0.60 and 0.80 rungs REPORTED beside (the
>    dose-ladder form). (iii) AGILITY BITES — `D = 0.30 · (1.12 −
>    0.24 · agility)` (the pace idiom's own ±12 % band: agility 0.5 ⇒
>    0.30, 1 ⇒ 0.264, 0 ⇒ 0.336; ⛔ never a per-role constant). (iv)
>    THE APPLICATION POINT — f scales the magnitude of the INTENDED
>    velocity (`desiredVel`) inside `physicsStep` BEFORE the top-speed
>    clamp and the accel approach, with φ = the angle between `heading`
>    and the intended direction; ⇒ slow off-heading drift pays (item
>    3(d)), a direction change pays until the heading catches up at
>    `TURN_RATE` (item 3(f)), and a STANDING TURN pays by construction
>    (a body facing 180° from its intent starts at 0.70 of it and rises
>    as the heading integrates — item 3(h)'s hole closed without a
>    second rule). (v) NOTHING ELSE — `TURN_RATE` unchanged (agility →
>    turn rate stays a held door), every `faceTarget` site unchanged,
>    the ball/shell/contact laws untouched; flag `bfFacingCost` default
>    OFF, Road B, byte-identity, fingerprint unchanged. §6 VISION: the
>    substrate prices, never assigns; two traced constants (0.70 from
>    the anchor, the band from the pace idiom), one traced shape; agility
>    bites. §7 REALITY: slower sideways and backwards; turning costs a
>    step; the standing pivot costs time. PASS.
> 5. ⭐⭐ **BF-T0 DISPATCHED — THE DORMANT FACING-COST LAW** (the RA-T0 /
>    RC-T0 form; scope bound here, exact forms frozen at the executor's
>    §P): (i) Match flag `bfFacingCost` (config + readonly + `?? false`;
>    never env/bundle-armed; named by no world/preset; League matchFlags
>    union only); the law must be reachable by the body — the executor
>    freezes HOW the flag reaches `Player.physicsStep` (the seam pattern
>    of the existing body laws — a per-match constant handed to the
>    player at construction/step, never a global); (ii) NEW
>    `src/sim/bodyFacing.ts` — PURE: `facingFactor(cosPhi, depth)` (the
>    law on scalars; cos-based, no acos in the loop), `facingDepth(agility)`
>    (the band), the two constants `BF_OFF_HEADING_FRACTION = 0.70` and
>    the band literals traced in the docblock to this ruling; (iii) THE
>    ONE SEAM in `physicsStep`: when armed, `desiredVel` is scaled by
>    `facingFactor(cos φ, depth)` with φ between `heading` and the
>    desired direction (degenerate desired ⇒ factor 1), before the
>    existing clamp and accel approach; the heading rotation block
>    UNTOUCHED; flag off ⇒ byte-identical (the literal 1 on the shipped
>    path — no float multiply on the shipped path); (iv) `agility` read
>    from the body's own attrs (verify the attribute exists and where;
>    if it is not on the body, STOP and report); (v) pins from birth —
>    G-OFF (absent ≡ explicit-false ≡ byte-identical whole-match
>    signatures on the bare world AND world 12 × 2 scratch seeds) ·
>    G-AHEAD (φ = 0 ⇒ factor exactly 1, path LIVE) · G-SIDE / G-BACK
>    (fixture: two identical bodies driven at one target for 120 ticks,
>    one with `faceTarget` 90° off — the BF-C0 fixture re-used — covers
>    EXACTLY `k`× … or rather the law's predicted distance given the
>    heading integrator, derived not typed; and a 180°-start standing
>    pivot rises from 0.70 to 1 as the heading integrates) · G-SMALL
>    (7.5° ⇒ ≥ 0.997) · G-MONOTONE (non-increasing in φ on [0, π]; flat
>    beyond 90°) · G-AGILITY (the band: 0.264 / 0.30 / 0.336) ·
>    G-TURNRATE (the heading block byte-identical; TURN_RATE untouched)
>    · G-SITES (every `faceTarget` site's line unchanged — the BF-C0 seam
>    map's 57 occurrences re-counted) · seam map (needle counts, every
>    site) · G-RNG (zero draws) · prohibitions · the fingerprint literal
>    RUN; (vi) stage doc `BF-T0-FACING-COST-SEAM.md` (the RA-T0 form;
>    §1 the law with the football sentence 「背着跑、侧着跑，跑不出全速」;
>    §2 files; §3 pins; §4 honest limits — the cos-based shape is a
>    choice, k = 0.70 is at one remove, agility's band is the pace idiom
>    not a measurement, the keeper is the first payer); typecheck; the
>    new suite; `npm run fingerprint` unchanged; the full vitest suite
>    with the FM-12 timeout family dispositioned; existing pins that go
>    red because a flag/field exists are NARROWED per the DF-T0 §P7 form
>    and listed. ZERO sims of record; scratch 900,002,400–499. THEN
>    **BF-T1 — THE EXAM** (own freeze; scope at its dispatch: SHUT vs
>    ARMED on world 12 both book forms; goals, completion, the user's
>    three faces, the DF faces — 乱跑 switches, coverage, interceptions —
>    the E4 dimensions, keeper faces (saves, goals conceded, his
>    distance covered), the k = 0.60/0.80 rungs REPORTED; H-BF.1 named
>    then).
> 6. **CONSUMPTION THIS RULING**: BF-C0's walked band per item 1 (the
>    tail 12,537,200–998 stays virgin and is NOT re-used); ZERO stats;
>    next sim ≥ **12,538,000** (BF-T0 consumes none; open to BF-T1);
>    stats ≥ 117,600; registry 73.

> **COMMANDER RULING #375 (2026-09-04 — ⚠ `agility` IS NOT AN ATTRIBUTE:
> M-BF.2 becomes a HELD DOOR; BF-T0's scope amended to a FLAT depth
> D = 0.30; the dispatch stands):**
>
> 1. **THE CODE FACT** (checked before dispatch, as #374 item 5(iv)
>    required): `ATTR_KEYS` = `pace · passing · dribbling · finishing ·
>    defending · strength · stamina · reflexes · positioning` — nine keys,
>    no `agility`. SUBSTRATE-MAP S1's "`agility` (turn/adjust — currently
>    a flat `TURN_RATE 6.5`, attr-blind)" names a HOOK, not a shipped
>    attribute. The commander's #374 item 4(iii) read the map as an
>    attribute inventory; corrected here.
> 2. **M-BF.2 (AGILITY BITES) → HELD DOOR.** Adding an attribute is a
>    BUDGET slice (the `positioning` precedent, Phase 119j: appended LAST
>    in `ATTR_KEYS` so founders' other draws stay byte-identical,
>    `SQUAD_BUDGET` raised 36 → 40.5 to keep the tuned density — a
>    contract of its own, never a rider on a body law). ⛔ No existing
>    attribute is pressed into service as a proxy (an invented mapping).
>    ⇒ **BF-T0 builds the law with ONE flat depth, `D = 0.30`** (k = 0.70,
>    #374 item 4(ii)); the BAND the attribute would have supplied is
>    stood in for by the exam's k = 0.60 / 0.80 REPORTED rungs. The BF
>    contract carries the status line.
> 3. **THE FLAG PATH, decided** (so the executor need not guess): the law
>    reaches `Player.physicsStep` as a PER-BODY number — `facingDepth`
>    (0 when the flag is off; `D` when on) — written by `Match` after it
>    constructs its teams (`new Team(...)` → `Team` builds its players and
>    bench) and again on substitution (`becomeSub`); `physicsStep`
>    branches on `facingDepth > 0`, so the shipped path executes NO new
>    arithmetic (byte-identity by construction, pinned by G-OFF). Every
>    other clause of #374 item 5 stands.
> 4. **CONSUMPTION: ZERO.**

> **COMMANDER RULING #376 (2026-09-04 — ⭐⭐ BF-T0 LANDED (the facing-cost
> door in the tree, dormant, fingerprint-inert; verifier PASS) — AND
> THE LAW OF RECORD CORRECTED: the factor scales the CLAMPED target,
> not the raw intent (the commander's own #374 item 4(iv) let a
> saturated intent absorb the whole price); BF-T0-FIX DISPATCHED before
> any exam; BF-T1 PRE-SCOPED):**
>
> 1. **LANDED** (seam commit `838a098`, executing #374 item 5 amended by
>    #375). RECEIPTS: the 19-pin suite `tests/bfFacingCost.test.ts`
>    green (prohibitions · no serialization · G-OFF bare + world 12 × 2
>    scratch seeds, four distinct cells · G-DEPTH incl. a live
>    substitution · G-AHEAD · G-SIDE — the BF-C0 two-body fixture,
>    shut ratio exactly 1, armed 12.503856 → 9.156702 m with the
>    expectation DERIVED by an outside-the-engine integrator to 9 dp ·
>    G-BACK (law half) · G-SMALL · G-MONOTONE · G-TURNRATE · G-SITES (57
>    `faceTarget` occurrences in 8 files, none changed) · seam map ·
>    G-RNG · the fingerprint literal RUN); `npm run fingerprint` =
>    `57b0bdab…c673` UNCHANGED; typecheck clean; full suite
>    **2016/2017** (the one red = `formationEvolution` ten-seasons at
>    its 180 s ceiling under 4-worker load — the dispositioned family;
>    standalone 147.3 s green); ZERO narrowed pins; ZERO sims; registry
>    73; scratch 900,002,400–499. The flag path of #375 item 3 built as
>    ruled: `Player.facingDepth` (0 shipped), written by Match's private
>    `setFacingDepth()` after team construction and after BOTH
>    substitution paths; the bench holds no bodies; the
>    `rendezvousRecovery` shadow carries the field (a one-file widening
>    of the dispatch list — RATIFIED, §CORR 4). VERIFIER OF RECORD:
>    **PASS, zero HIGH, two MEDIUM, two LOW** (item 2–3); it ran the new
>    suite, typecheck and the fingerprint itself, recounted the 57
>    sites, swept the doc's prose at any precision (the new canon —
>    every literal traced), and found no way the seam moves a shipped
>    byte.
> 2. ⭐⭐ **THE LAW OF RECORD, CORRECTED (#374 item 4(iv) amended).** The
>    verifier's MEDIUM: with the factor applied to the RAW intent
>    "before the top-speed clamp", any intent ≥ topSpeed / f is clamped
>    back to topSpeed and the body pays NOTHING — and the executors
>    over-saturate the intent routinely (`arrive` + `separation` +
>    `avoidOpponents`). The commander's order created a silent no-op
>    region at exactly the speeds that matter. AMENDED: **f scales the
>    CLAMPED target — after the top-speed clamp, before the stun
>    multiplier and the accel approach.** Consequences, stated: a slow
>    drift pays on its own magnitude (unclamped); a saturated sprint pays
>    on topSpeed; a direction change pays until the heading catches up;
>    no intent can absorb the price. The standing 180° start is
>    accel-capped on its first ticks in BOTH arms (§CORR 2) — the price
>    shows once the accel transient ends, which is the physics, not a
>    hole. §6/§7 unchanged.
> 3. **THE OTHER THREE ITEMS — DISPOSED** (§CORR 2–4): G-BACK's
>    engine-side half was vacuous (both bodies accel-capped on tick one)
>    — replaced in the fix by a locked-heading, post-transient
>    inequality; a keeper sentence with two denominators (row vs role)
>    — corrected; the `rendezvousRecovery` widening — ratified.
> 4. ⭐ **BF-T0-FIX DISPATCHED** (the IN-C0-FIX / RC-T1a-FIX form; scope
>    bound here): (i) move the ONE seam statement so the factor scales
>    (tx, ty) after the clamp and before the stun multiplier — the
>    shipped path still executes nothing new; (ii) re-derive G-SIDE's
>    outside-the-engine predictor for the new order (the measured
>    metres will change; the pin derives, never types); (iii) NEW pin
>    **G-SATURATED**: an intent of 3× topSpeed at 90° off heading settles
>    at exactly the same speed as an intent of 1× topSpeed at 90°, and
>    that speed equals `BF_OFF_HEADING_FRACTION` × the shut body's
>    settled speed (derived); (iv) NEW engine half of **G-BACK**: heading
>    LOCKED behind the run (a `faceTarget` behind the body), speeds
>    compared after the accel transient — priced = `k` × shut, derived,
>    non-vacuous (fails with the seam deleted — prove by a
>    mutant-liveness check inside the test: with `facingDepth` forced to
>    0 the assertion must fail); (v) the stage doc: §1's law order, §4's
>    keeper sentence (row vs role), the §CORR pointer; (vi) G-OFF,
>    typecheck, the five named suites, the fingerprint, the FULL suite
>    again (src changed); ONE commit `BF-T0 FIX (#376 item 4) — …`;
>    verify = an independent Opus. ZERO sims; scratch 900,002,400–499.
> 5. ⭐⭐ **BF-T1 — THE EXAM, PRE-SCOPED** (dispatched at the fix's
>    banking; definitions frozen at its §P): ARMS, PAIRED on shared
>    seeds, world 12's composition: E-SHUT · E-ARMED (`bfFacingCost` +
>    the flat depth 0.30) on EMPTY books (the exam form) SCORED; the same
>    pair DOSED (PT-C0 arm A's construction, the dose hashes pinned)
>    REPORTED; plus TWO REPORTED RUNGS on the empty-book form — the
>    depth at k = 0.60 and k = 0.80 (written match-local through the
>    same `facingDepth` writer; the dose-ladder form) — six arms, ≤ 999
>    shared seeds, block 12,538,000–999. **H-BF.1**: (a) THE PRICE BITES
>    IN THE WILD — the mean speed of moving ticks with φ > 90° FALLS
>    resolvedly (armed − shut) AND the mean speed of ticks with φ < 15°
>    does NOT fall resolvedly (the flat-near-zero shape holds on the
>    pitch); (b) DO-NO-HARM — Δ goals/match within a declared band
>    (target 0.30, the RA-T1B MDE precedent), whole-match completion
>    does NOT fall resolvedly beyond a declared target (0.010),
>    interceptions do NOT rise resolvedly beyond 1.0/match. PASS ⇔ (a) ∧
>    (b). REPORTED: the live coverage of the price (§CORR 6); the user's
>    three PT-C0 faces; the DF faces (乱跑 switches/defender-min,
>    coverage, tackles vs interceptions); keeper faces (goals conceded,
>    saves, his distance and his share45); E4 (forward share, third-man,
>    overlaps, chain); the misalignment shares themselves (does the
>    keeper stop shuffling side-on? does anyone start backpedalling?);
>    the season ladder is NOT run (no gene; a body law). PRE-COMMITTED
>    READS: PASS ⇒ BF-T1 banks; the RC arc resumes with RC-T0b (the
>    READY limb on the priced body); a BF entry (world 13 = 「转身要付
>    代价」) is a candidate the commander decides WITH the RC entry, not
>    alone; (a) fails ⇒ the law does not bite where the census said it
>    would — the form returns WITH numbers (the clamp/coverage face
>    first); (b) fails ⇒ the price costs football — the arc pauses at the
>    user's fork with the k = 0.80 rung named.
> 6. **CONSUMPTION THIS RULING: ZERO** (a seam; the fix consumes none;
>    BF-T1's block opens at its own freeze; next sim ≥ **12,538,000**;
>    stats ≥ 117,600; registry 73).

> **COMMANDER RULING #377 (2026-09-04 — ⭐⭐ BF-T0-FIX LANDED: the
> facing-cost law is in the tree in its CORRECTED order (clamp first,
> then the price), 20 pins, 2018/2018 GREEN, Player.ts purely additive
> against the pre-seam tree; the fix verifier's two doc MEDIUMs
> corrected by the commander; BF-T1 THE EXAM DISPATCHED):**
>
> 1. **LANDED** (fix commit `0b344fa`, executing #376 item 4). RECEIPTS:
>    the seam now scales the CLAMPED target (tx, ty) after the top-speed
>    clamp and before the stun multiplier — same factor both components;
>    `const dv = this.desiredVel;` RESTORED and the module scratch vector
>    deleted, so `git diff 0de6f7e..HEAD -- src/sim/Player.ts` is PURELY
>    ADDITIVE (the import, the `facingDepth` field, the branch);
>    `bodyFacing.ts` untouched; 20/20 pins — the new **G-SATURATED**:
>    heading locked 90° off, intents of 1× and 3× topSpeed settle at the
>    SAME speed **5.021728** m/s = 0.70 × the shut body's **7.173897**
>    (bit-identical; the old order priced the 3× body at NOTHING — the
>    verifier materialised that on a real shut-3× body: 7.173897, the
>    gap exactly D × topSpeed); the new engine half of **G-BACK**:
>    heading locked behind, post-transient, priced = 0.70 × shut,
>    MUTANT-LIVE (forcing `facingDepth` to 0 makes the assertion fail);
>    G-SIDE's metres UNCHANGED (12.503856 → 9.156702) — DERIVED and
>    independently confirmed: that fixture's intent is exactly topSpeed,
>    the clamp never fires on it (instrumented: 0 of 120 ticks in both
>    arms), and an inert clamp commutes with the scaling — the
>    dispatch's expectation was wrong, not the fix; `npm run
>    fingerprint` UNCHANGED; typecheck clean; **full suite 2018/2018,
>    zero timeouts** (the FM-12 family passed inside the 4-worker run
>    this time). Three pins that pinned the OLD order's text were
>    STRENGTHENED (the ordering pin now reads clamp < seam < stun <
>    accel with line receipts), none narrowed. VERIFIER OF RECORD: **PASS,
>    zero HIGH, two MEDIUM** — it re-derived every fixture in an
>    out-of-tree script importing the repo's own Player/bodyFacing
>    (every §FIX receipt to the last digit) and ran the suite,
>    typecheck and fingerprint itself.
> 2. **THE TWO MEDIUM — CORRECTED BY THE COMMANDER IN PLACE** (BF-T0 doc
>    §4 + §CORR 7): the fix's rewrite of the keeper bullet attributed
>    0.855206 to the ROW `GoalkeeperPosition × GK` (it is the ROLE GK's
>    `share45`) and said "three different denominators" where 55.504 %
>    and 59.649 % share ONE (the world's 518.721098 misaligned m/match;
>    row vs role differ in numerator) and only 24.1 % has the second
>    (the steep pair's 492.902617 m of cost). The third correction of the
>    same sentence in two rounds; lesson of record (§CORR 7): a prose
>    sentence carrying more than one fraction names EVERY numerator and
>    denominator or carries no numbers.
> 3. ⭐⭐ **BF-T1 DISPATCHED — THE FACING-COST EXAM** (scope = #376 item 5,
>    made exact; definitions frozen at the executor's §P): ARMS, PAIRED
>    on shared seeds, world 12's composition, the world's own composer
>    CALLED: **E-SHUT** (empty-book, flag absent) · **E-ARMED**
>    (`bfFacingCost: true` in the constructor ⇒ the shipped writer sets
>    `facingDepth` = BF_DEPTH = 0.30 on every body and every substitute)
>    — SCORED; **D-SHUT · D-ARMED** (the dosed form, PT-C0 arm A's
>    construction, the dose byte-hashes pinned) — REPORTED; **E-k60 ·
>    E-k80** (empty-book, flag on, the depth DOSED match-local to 0.40 /
>    0.20 — written on the public `facingDepth` of all 12 bodies after
>    construction AND RE-ASSERTED after every step so a substitute's
>    shipped re-write to 0.30 cannot leak; the re-assertion count per
>    match PUBLISHED; ⚠ these two arms carry a per-tick dose write by
>    design and are REPORTED, never scored) — six arms, ≤ 999 shared
>    seeds, block **12,538,000–999**, scratch 900,002,500–599.
>    **H-BF.1 (E-ARMED − E-SHUT, the frozen form prints the words):**
>    (a) THE PRICE BITES IN THE WILD — the mean speed of moving ticks
>    with φ > 90° FALLS resolvedly (CI entirely below zero) ∧ the mean
>    speed of moving ticks with φ < 15° does NOT fall resolvedly beyond
>    a declared target (0.05 m/s — the flat-near-zero shape on the
>    pitch); (b) DO-NO-HARM — Δ goals/match within [−0.30, +0.30] (a
>    band rule: NOT entirely outside; declared MDE from the smoke) ∧ Δ
>    whole-match completion NOT entirely below −0.010 ∧ Δ interceptions
>    NOT entirely above +1.0/match. PASS ⇔ (a) ∧ (b). REPORTED (never
>    scored): the LIVE COVERAGE of the price (the share of moving ticks
>    on which the factor applied was < 1 − 1e-6, recomputed from
>    `heading` and the clamped intent — the exam's own read, declared)
>    and the mean factor applied; the misalignment shares themselves
>    (share45/share90 by role — does the keeper stop shuffling side-on?
>    does any outfield class start backpedalling?); keeper faces (goals
>    conceded, saves, his distance/match, his `share45`); the DF faces
>    (乱跑 switches/defender-min, marking coverage, tackles vs
>    interceptions — the DF-T1 instrument's own definitions, anchored);
>    the user's three PT-C0 faces (opponent-first-contact, receiver
>    side-on at first touch, 撞车); E4 (forward share, third-man,
>    overlaps, chain); shots; the DOSED pair on every face; the k60/k80
>    rungs on every face (the dose ladder). No season ladder (a body
>    law, no gene). INSTRUMENT: adapt RC-T1a's paired-arm form (LOO on
>    every scored Δ, the bootstrap, the frozen sentence literals, gFaces
>    off disk), BF-C0's misalignment reads, PT-C0's contact/crowd faces,
>    mt-ladder's E4, the DF probe's 乱跑 face; X-SRC-ZERO; compact JSON;
>    the non-body hash receipt; the prose-sweep canon. PRE-COMMITTED
>    READS (frozen literals, selected on stored booleans): PASS ⇒ BF-T1
>    banks, the RC arc resumes with **RC-T0b** (the READY limb on the
>    priced body); a BF entry (world 13) is a CANDIDATE decided WITH the
>    RC entry, not alone; (a) fails ⇒ the law does not bite where the
>    census said — the FORM returns with numbers (the coverage face
>    first); (b) fails ⇒ the price costs football — the arc pauses at
>    the user's fork with the k = 0.80 rung named.
> 4. **CONSUMPTION THIS RULING: ZERO** (the fix consumed none; BF-T1's
>    block opens at its own freeze; next sim ≥ **12,538,000** → BF-T1;
>    after it ≥ 12,539,000; stats ≥ 117,600; registry 73).
> 5. **GOVERNANCE ROTATION** (#303 item 2's law): the live rulings file
>    passed ~1,500 lines at this ruling (1,526). Rulings **#366–#372**
>    (the passing-system audit ratified → the RC arc's first half: RC-C0
>    · PT-C0 · RC-T0 · RC-T1a + its hash-order fix · the user's world-12
>    verdict) rotate BYTE-VERBATIM to
>    [`PROGRAMME-RULINGS-ARCHIVE-366-372.md`](PROGRAMME-RULINGS-ARCHIVE-366-372.md),
>    `cmp`-verified in this round; the live file = **#373 onward**;
>    `PROGRAMME.md`'s resume line updated (six ARCHIVE files).

> **COMMANDER RULING #378 (2026-09-05 — ⭐⭐⭐ BF-T1 BANKED: H-BF.1 =
> PASS on all five conjuncts — the facing price BITES on the pitch
> where the census said and the world stays football at this sample;
> the verifier's FAIL was prose alone (one HIGH, one MEDIUM, one LOW),
> corrected by the commander in place; ONE new canon; the
> goals-lean-up story LABELLED with its probe named; ⭐⭐ RC-T0b THE
> READY LIMB DISPATCHED on the priced body):**
>
> 1. **BANKED** (freeze `087d8dd`, results `7d91b3d`, executing #377
>    item 3). VERIFIER OF RECORD: **FAIL — zero HIGH on numbers, one
>    HIGH on prose** (item 2); everything of record re-derived: all
>    five point Δ bit-exact off `perSeedCells` with the verifier's own
>    rng, intervals within bootstrap noise, zero LOO flips,
>    freeze-before-sight, `git diff 087d8dd..7d91b3d --
>    scripts/probes/bf-t1-*.ts` EMPTY, src untouched, fingerprint
>    57b0bdab…c673 UNCHANGED, dose pins held, compact JSON, the hash
>    reproduces from the file, 15/15 gates, BOOKED = WALKED = **3,042**
>    (506 shared seeds × 6 arms + the receipt seed in all six). THE
>    FIVE WORDS (E-ARMED − E-SHUT, the frozen rules' own print): **(a1)
>    FALLS** — the mean speed of moving ticks past 90° **1.799471 →
>    1.645442**, Δ **−0.154028** [−0.164730, −0.143501], **14.510777**
>    half-widths; **(a2) HOLDS** — Δ under 15° **−0.020069**
>    [−0.027536, −0.012010], inside the declared 0.05 m/s target (⚠
>    resolved below zero: a SELECTION statistic — the price moves WHO
>    is in each φ bin as well as how fast they go; BF-T0's vacuum
>    fixtures are the controlled per-body price); **(b1) WITHIN-BAND**
>    — goals Δ **+0.150198** [−0.061265, +0.345850]; **(b2)
>    DOES-NOT-FALL** — completion Δ **−0.006231** [−0.012997,
>    +0.000362]; **(b3) DOES-NOT-RISE** — interceptions Δ **+0.519763**
>    [−0.077075, +1.110672]. ⚠ The do-no-harm limb is a FAILURE TO
>    DETECT at 506 seeds (each Δ inside its realised MDE: 0.290966
>    goals · 0.009547 completion · 0.848887 interceptions), not a
>    demonstration of no cost. THE PRE-COMMITTED READ, printed by the
>    frozen form on stored booleans, VERBATIM: *"BF-T1 BANKS; THE RC
>    ARC RESUMES WITH RC-T0b (the READY limb on the priced body); a BF
>    entry (world 13) is a CANDIDATE decided WITH the RC entry, not
>    alone."* Adopted.
> 2. **THE HIGH — CORRECTED IN PLACE, AND A CANON** (BF-T1 doc §R5 +
>    HONEST LIMITS 9 + §CORR 1). The doc said the k = 0.60 rung's goals
>    interval [+0.199605, +0.638340] lies "entirely outside" (b1)'s
>    ±0.30 band and "H-BF.1 would have FAILED". Under the frozen rule
>    `!(ciLo > 0.30 || ciHi < −0.30)` the lower edge 0.199605 is
>    inside ⇒ **WITHIN-BAND**; only the POINT +0.418972 is outside. The
>    same page applied the rule correctly to the dosed pair two
>    sections earlier. The results commit message repeats the false
>    sentence and is SUPERSEDED by §CORR 1, not rewritten. ⭐ NEW CANON
>    (CANON.md): **counterfactual words are stored** — VERBATIM: *"a
>    counterfactual verdict sentence ('had X been scored, the rule
>    would read W') quotes a word the instrument STORED by applying the
>    frozen rule to X's stored interval; a universal sentence about a
>    table ('every bin', 'the one bin') is a stored boolean or is not
>    written"*. From RC-T1b on, a paired exam applies its frozen rules
>    to EVERY reported pair and stores the word beside the interval
>    (never scored).
> 3. **THE MEDIUM — CORRECTED IN PLACE** (§R2 + §CORR 2): "every bin at
>    or above 45° holds a larger share" was false for 75–90° (0.072470
>    → 0.069138) and "the one bin whose share FALLS" was false because
>    0–15° also falls (0.819913 → 0.817959); the truth off
>    `phi.bin{i}.share`: shares fall in exactly two bins (Δ −0.001953 ·
>    −0.003332) and rise in ten; every bin is slower armed.
> 4. **THE LOW — DISPOSED** (§CORR 3): six provenance lines added to
>    §DEV-PREFLIGHT after sight STAND (no number of record; the section
>    is non-binding) and are named as a post-sight edit outside §R; the
>    form of record: after sight a stage doc gains lines ONLY in §R and
>    §CORR.
> 5. **THE COMMANDER'S READ** (VISION + REALITY, the #201 rule): (i)
>    REALITY — a body running sideways or backwards is slower, a
>    nearly-straight run is not: the shape held on the pitch, the
>    outfield paid on direction changes and the keeper on his shuffle
>    (his metres **−14.575296**/match, his misaligned metres
>    **−23.813900**, saves −0.120553 with zero inside); PASS. (ii) ⭐
>    THE MISALIGNMENT DID NOT FALL — share90 +0.002200 overall, the
>    keeper's +0.007896: NOTHING EVOLVED (a body law with no gene;
>    every number is today's brains under a new price), so the price
>    changed SPEED and not CHOICES; "a slower off-heading body spends
>    more ticks off-heading" is a LABELLED HYPOTHESIS — no
>    decision-vs-lag split was run on the priced world. (iii) ⭐⭐ THE
>    GOALS LEAN UP under the price on all four priced pairs — E
>    **+0.150198** · D **+0.207510** [+0.019763, +0.407115] RESOLVED ·
>    k60 **+0.418972** [+0.199605, +0.638340] RESOLVED · k80
>    **+0.146245** — none scored against, none outside the band by the
>    rule; the STORY (the keeper's priced shuffle lets a little more
>    through) is a LABELLED HYPOTHESIS; 有故事就要有探针 — its probe is
>    named now: RC-T1b carries a BF-alone arm beside the BF-shut
>    baseline on a FRESH block with the goals face, the keeper faces
>    and a per-shot keeper read (was the keeper moving side-on inside
>    the last W ticks before the shot); the entry play-test carries the
>    user's eye. (iv) THE USER'S THREE FACES on the priced body ALONE:
>    「侧身接球」 **−0.010654** resolved (better; front-on **+0.010467**),
>    opponent-first-contact **−0.000438** and 撞车 **+0.000193** flat —
>    the price alone does not move the user's sentences, as expected:
>    what turns the receiver is the READY limb, which is why RC-T0b
>    follows. (v) VISION — the law gives every body a real trade to
>    face, so a gene that trusts a body cue can mean something
>    (M-BF.4); no executor was told to face differently; tactics still
>    emerge. PASS. (vi) A BF ENTRY is a CANDIDATE decided WITH the RC
>    entry (item 1's read); world 12 untouched; the user's gate open.
> 6. ⭐⭐ **RC-T0b DISPATCHED — THE READY LIMB, A DORMANT SEAM ON THE
>    PRICED BODY** (M-RC.3b as licensed at #373; the RC-T0 form;
>    definitions frozen at the executor's §1): 「看见自己人拿球正转向我，
>    先把身子打开对着他」. (i) A SECOND FLAG **`rcReady`** (default OFF;
>    never named by any world, preset, env or bundle; League
>    `matchFlags` union) — 3b switchable apart from 3a so RC-T1b can
>    build shut / 3a / 3a+3b arms; THE GENE IS THE SAME
>    **`rcAnticipationWeight`** (M-RC.4: one gene = how much a receiver
>    trusts a body cue). (ii) THE BELIEF (M-RC.2, measured never
>    weighted) = RC-C0b's own cell: the carrier's speed bin (edges 1,
>    2, 3.5, 5 m/s) × his heading angular-speed bin (edges 0.5, 2, 4
>    rad/s; |Δheading|/DT across consecutive ticks) × my alignment
>    rank (`alignmentRank`, the SAME function object as 3a; slots 1–5,
>    ≥6) — 120 cells; **belief(cell) = P(a wind-up is live ∧ its target
>    is me | cell) = `bins.cellWindupTargetMe.E[cell] /
>    bins.cellTicks.E[cell]`** — #373's TWO tables, P(wind-up | cell) ×
>    P(target = me | wind-up, cell), whose product over a shared cell IS
>    this stored joint; the EMPTY-BOOK arm (the licence arm),
>    numerators and denominators transcribed as integers and re-derived
>    BIT-EXACTLY off `docs/world-model/data/rc-c0b-detector-census.json`
>    by a G-TABLE pin (file sha256 **a07d5692…0f83**, body hash
>    **37cdff0b…f41b**); the dosed arm's 120 quotients PUBLISHED beside
>    in the stage doc as the book-independence check, never used. A
>    cell with zero carrying ticks, a non-finite angular speed or no
>    rank ⇒ belief 0 (no measurement ⇒ no belief ⇒ the shut byte). ⛔
>    NO minimum-count floor (a new constant): sparse cells are an
>    HONEST LIMIT with their counts published. (iii) THE READ SET
>    (M-RC.1, outward-only): `ball.owner` (same side, not me, on the
>    pitch), his `pos`, `vel`, `heading` at this tick and the previous
>    tick — the previous heading kept by the SEAM's own flag-gated
>    memory, written only when `rcReady` is on — my `pos`, the mate
>    population as RC-T0 builds it, the team's gene; ⛔ NOT
>    `pendingPassWindup`, `pendingPass`, `faceTarget`, any TeamBrain
>    designation or `info.genome`; the seat module's import list
>    CLOSED; the live argument list PINNED. (iv) THE CANDIDATE
>    **`AnticipatePass`**, pushed into the receiver's OWN off-ball menu
>    at the site that pushes `ReceivePass`, score = **`w · belief ·
>    s_receive`**, `s_receive` = `ReceivePass`'s own literal (1.2 —
>    anchored by a source-line pin, never a second copy) — the argmax
>    IS the decision, no threshold; pushed ONLY when `w · belief > 0`,
>    so the menu is byte-identical to shut whenever there is nothing to
>    believe. (v) THE EXECUTOR: when `AnticipatePass` wins, the body's
>    MOVEMENT is byte-identical to what the menu WITHOUT it would have
>    chosen (the runner-up's own executor case runs — target, speed,
>    every side effect), and the ONLY addition is **`faceTarget` = the
>    carrier's `pos`, COPIED never aliased** (the actionExecutor.ts
>    starred hazard), through the EXISTING heading integrator at
>    TURN_RATE; `faceTarget` is per-frame today, nothing persists. The
>    action record KEEPS the movement plan's own `type` (every
>    exhaustive map over action types, the PC seat's `remember`, PT-C0's
>    classes and stats see the runner-up's type, byte-identical shut)
>    and carries the decision as an overlay field; a live PC reaction
>    hold overrides the face exactly as it overrides the target (a body
>    under a hold does not turn either) — pinned. ⛔ No new heading
>    law, TURN_RATE untouched, no step toward the carrier (the CHASE
>    limb, HELD), the passer untouched (M-RC.6), 3a's arm-loop read and
>    `pcLatency.ts` byte-identical. (vi) THE TRADE (M-BF.4) is BF's by
>    composition — pin **G-TRADE**: `bfFacingCost` + `rcReady` at w = 1
>    on a fixture: the receiver who turns to face a carrier 90° off his
>    motion covers LESS ground than his `rcReady`-shut twin, by BF-T0's
>    own factor; with BF shut the turn is free (stated as the reason
>    RC-T1b arms BF in both arms). (vii) PINS (`tests/rcReady.test.ts`,
>    from birth; the `rcAnticipate.test.ts` idioms): prohibitions · no
>    serialization · **G-OFF** (absent ≡ false ≡ byte-identical
>    whole-match signatures, bare + world 12 × ≥ 2 scratch seeds) ·
>    **G-BORN** · **G-ZERO** · **G-INERT** (armed at w = 1 with no
>    same-side carrier, or belief 0 ⇒ menu byte-identical) ·
>    **G-TABLE** (120 quotients bit-exact off disk, both hashes) ·
>    **G-CELL** (the cell arithmetic = RC-C0b's on fixtures incl.
>    degenerate/NaN; angular speed against TURN_RATE's cap; a wrapper
>    AND the live read) · **G-RANK** (the same function object as 3a) ·
>    **G-SCORE** (fixture: candidate present with score exactly
>    w·belief·1.2; absent at w·belief = 0) · **G-MOVEMENT-KEPT**
>    (fixture: target and speed identical to the runner-up's,
>    `faceTarget` = the carrier's `pos` copied; walk: on the first tick
>    `AnticipatePass` wins in a live world-12 walk the body's
>    `desiredVel` equals the shut twin's) · **G-HOLD** (under a live PC
>    hold the face is the held one) · **G-BITE** (walk: ticks where an
>    off-ball body's `faceTarget` is the carrier's `pos` EXIST, and his
>    heading turns toward the carrier while the shut twin's follows
>    motion) · **G-TRADE** · channel closure (import list; live read set
>    anchored) · seam map (needle counts: `rcReady` · `AnticipatePass` ·
>    the memory field) · **G-RNG** (zero draws; genome streams unmoved)
>    · **G-3A-UNTOUCHED** · the fingerprint literal RUN. Existing pins
>    narrowed per DF-T0 §P7 only, each listed. (viii) STAGE DOC
>    **`RC-T0B-READY-SEAM.md`** (RC-T0's form: §0 this item verbatim ·
>    plain football · §1 mechanism · §2 files · §3 pins · §4 honest
>    limits — the joint is a PER-TICK probability, not per pass; sparse
>    cells; whether the keeper's brain reaches this menu (report, do
>    not decide); the belief is world 12's empty-book number; facing
>    changes the BK reception sector — RC-T1b's face, not this seam's
>    claim; nothing shipped). ZERO sims of record; scratch
>    **900,002,600–699** for pin walks; the RC contract's STATUS line
>    is the commander's. (ix) PRE-COMMITMENT: a seam has none. RC-T1b
>    (#379) freezes **H-RC.2** on the user's own faces — receiver
>    side-on at first touch FALLS ∧ opponent-first-contact does NOT
>    rise ∧ do-no-harm — with arms BF-armed SHUT / 3a / 3a+3b on shared
>    seeds, the BF-shut baseline and BF-alone beside (item 5(iii)'s
>    probe), the dosed pair reported, a season ladder on the gene, and
>    the frozen rules' words STORED for every reported pair (item 2).
> 7. **CONSUMPTION THIS RULING**: BF-T1 walked **12,538,000–12,538,505**
>    (506 seeds) + the receipt **12,538,999** on six arms = **3,042
>    sims**; the tail 12,538,506–998 is DECLARED virgin and is never
>    re-opened (the block is consumed as a block); scratch
>    900,002,500–511 and 900,002,590–591 used. RC-T0b consumes nothing
>    of record. Next sim ≥ **12,539,000** (open to RC-T1b); stats ≥
>    117,600; registry 73.
> 8. **GOVERNANCE**: the live rulings file is under the rotation line
>    (no rotation); the BF and RC contracts carry one STATUS line each
>    for this ruling.

> **COMMANDER RULING #379 (2026-09-05 — ⭐⭐ RC-T0b LANDED DORMANT
> WITH A MEASURED FORK: the READY candidate's ceiling (0.239351 × 1.2 =
> 0.287221) is BELOW the off-ball menu's unconditional floor
> (`formationBase` 0.45) — under #378's own form not one body can ever
> turn; the executor built it as frozen, PINNED the arithmetic (G-REACH)
> and stopped without inventing a constant; the commander's fork RULED:
> ⭐ THE TRADE IS THE DECISION — facing does not compete with running,
> it is weighed against the speed it forfeits by BF's own law;
> RC-T0b-FIX dispatched):**
>
> 1. **LANDED, NOT BANKED** (seam commit `10b2ff6`, executing #378 item
>    6; status `blocked`, Verify not run). RECEIPTS: a SECOND flag
>    `rcReady` (default OFF; League key union; named by nothing); the
>    SAME gene; belief = RC-C0b's stored joint over the 120-cell E table
>    — 240 integers transcribed, all 120 quotients re-derived BIT-EXACTLY
>    off the artifact on disk (file a07d5692…0f83, body 37cdff0b…f41b),
>    the cell ordering `(speedBin·4 + angBin)·6 + (rank−1)` CONFIRMED by
>    reproducing familyF = [18, 42, 66, 90, 114]; the ONE written rule is
>    the zero denominator (the only empty cells are the 20 unreachable
>    rank ≥ 6 slots — 6v6 has five same-side mates; every populated cell
>    carries > 1,000 pairs; 72 cells believe > 0; max = cell 90 =
>    32,231/134,660 = **0.239351**); `ReceivePass`'s 1.2 HOISTED to one
>    home; the previous heading in a Match-owned flag-gated store
>    shifted at the head of step, whose pair IS RC-C0b's pair for tick
>    t−1 (no within-cell drift — better than RC-T0's declared ≤ 1 tick);
>    the ONE face write above the PC gate (a live hold overrides it;
>    `remember` sees the face he ran; COPIED never aliased); the
>    ActionType union UNTOUCHED (the decision rides as `readyFaceGid`,
>    an overlay — stronger than item 6's contingency, ACCEPTED); 27 pins
>    green; typecheck clean; fingerprint UNCHANGED; full suite 2044/2045
>    with formationEvolution's known 180 s timeout GREEN standalone;
>    ZERO sims; two pre-existing pins narrowed (item 4).
> 2. ⭐⭐ **THE FORK, MEASURED** (G-REACH, pinned live): the off-ball menu
>    pushes `MoveToFormationSpot` UNCONDITIONALLY at `W.formationBase` =
>    **0.45** (`DEFAULT_POLICY`, types.ts); the READY candidate's
>    ceiling at w = 1 is max(belief) × 1.2 = **0.287221** < 0.45 ⇒ on the
>    shipped policy vector `AnticipatePass` NEVER wins the argmax: ZERO
>    overlays over a full world-12 armed walk at w = 1, while the
>    candidate was pushed on ~85 % of carrier-mate decisions. The
>    executor demonstrated the mechanism on a learned `rolePolicies`
>    vector (three shape weights lowered) and did NOT rescale,
>    re-anchor, floor or threshold — the right stop. ⭐ THE COMMANDER'S
>    OWN ERROR OF RECORD: #378 item 6(iv) put a FACING decision into the
>    MOVEMENT argmax. Facing does not exclude running (item 6(v) keeps
>    the movement byte for byte), so making it outrank every movement
>    candidate was a category error — the argmax was a de-facto
>    threshold at belief > 0.375 that no measured cell reaches.
> 3. ⭐⭐ **RULED — THE TRADE IS THE DECISION** (M-RC.3b's decision form,
>    AMENDED; the RC contract carries it). In plain football:
>    「转不转身，不该和"跑不跑"抢同一个名额；该和"转过去会慢多少"比。
>    他很可能传给我 ⇒ 就算要侧着跑也把身子打开；只是有点可能 ⇒ 顺手才开；
>    正在全速冲 ⇒ 不回头看」. THE FORM: the receiver faces the carrier
>    iff **BENEFIT > COST**, where BENEFIT = `w · belief · s_receive`
>    (unchanged: the gene, RC-C0b's joint, `ReceivePass`'s own 1.2) and
>    COST = `(1 − f(φ)) · S_move` — the fraction of the movement's speed
>    the body would FORFEIT by facing off its line, `f` = BF's own
>    `facingFactor(cos φ, p.facingDepth)` evaluated PROSPECTIVELY at φ =
>    the angle between the movement plan's intended direction (the
>    executor's own `target − pos` for this frame, after both clamps)
>    and the bearing to the carrier, times `S_move` = the movement
>    plan's OWN priority (`p.action.scores[0].score`, the menu's winner
>    — the existing record). ⛔ NO NEW CONSTANT: every factor is an
>    existing quantity of the engine (the menu's currency, BF's law, the
>    body's own depth, the measured table, the gene). CONSEQUENCES, all
>    pinned by the fix: BF shut ⇒ `facingDepth` 0 ⇒ COST 0 ⇒ he faces
>    whenever `w · belief > 0` (the free turn, stated; the reason RC-T1b
>    arms BF in BOTH arms and the RC entry is cut WITH BF); a standing
>    body (speed 0 or a degenerate intent) ⇒ COST 0; at the shipped
>    depth 0.30 and the default floor 0.45, COST ≤ 0.135 ⇒ at w = 1 the
>    SEVEN cells with belief > 0.1125 (all in the top angular-speed bin,
>    ranks 1–2 — 「他正猛地转身，而我是他最对着的两个人之一」) face even at
>    90°, and every believing cell faces when the turn is nearly free (φ
>    small); a higher-priority run raises the cost. VISION: allows, never
>    assigns; the gene means something (w scales trust against a REAL
>    price); no executor told to face; emergent. REALITY: a coached
>    receiver opens up when he is the likely outlet and the turn is
>    cheap, and does not turn his head off a sprint; the price he weighs
>    is the one his body will pay. PASS both. THE MOVEMENT MENU IS NOW
>    UNTOUCHED (no push, no splice — the `OffballCandidate` widening and
>    the splice are removed; the brain records the decision's INPUTS as
>    overlay fields; the executor resolves the trade at the face-write
>    site every frame, so the face follows the plan frame by frame while
>    the belief holds for the brain's AI_INTERVAL). Options REJECTED:
>    (a) re-anchor `s_receive` — a taste constant; (b) lower
>    `formationBase` — world 12's bytes; (c) a low-shape policy vector
>    in RC-T1b — an exam of a door that cannot open in the world the
>    user plays.
> 4. **DISPOSITIONS**: (i) the ActionType union not widened — ACCEPTED
>    as stronger; (ii) G-BITE on a learned policy vector — SUPERSEDED:
>    the fix's G-BITE runs on the DEFAULT vector (world 12 as composed)
>    at w = 1 and must find faces; (iii) TWO narrowed pins RATIFIED
>    (DF-T0 §P7 form): `bfFacingCost` G-SITES — `faceTarget` recount 57
>    → 61 in the same 8 files with the substantive claim restated as
>    per-file ASSIGNMENT counts (actionExecutor 14 → 15, the others
>    unchanged) + Player.ts's three sites byte-identical; `rcAnticipate`
>    THE NEEDLE FAMILY — split into 3a-only needles (five files exactly)
>    and the two names 3b legitimately shares (`rcAnticipationWeight`,
>    `alignmentRank`); (iv) the actionExecutor comment reworded from
>    `bfFacingCost` to "the BF facing price" to spare BF's needle gate —
>    ACCEPTED; (v) the keeper never reaches the off-ball menu
>    (`decidePlayer` routes GK to `decideGoalkeeper`) yet sits in the
>    rank population — an HONEST LIMIT of record; a keeper READY limb is
>    a HELD door, and RC-T1b's faces are the outfield's; (vi) the
>    decision is one tick after its cell at AI_INTERVAL cadence ⇒
>    RC-C0b's coverage is an UPPER bound on firing — of record.
> 5. ⭐⭐ **RC-T0b-FIX DISPATCHED** (Draft + Verify): (i) PlayerBrain —
>    REMOVE the candidate from the movement menu (`cands` back to
>    `UtilityScore[]`; the `OffballCandidate` widening,
>    `RcReadyCandidate`, the splice and the cast GONE; `RC_S_RECEIVE`
>    stays as the one home); inside the same `rcReady` fork compute the
>    SAME cell and belief (read set unchanged) and, iff `w · belief > 0`,
>    write TWO overlay fields on the action record — `readyFaceGid` (the
>    carrier) and `readyBenefit` = `w · belief · RC_S_RECEIVE` — nothing
>    else; shut, both absent. (ii) actionExecutor — at the existing
>    face-write site (above the PC gate): if `readyFaceGid` is set and
>    the ball's owner still is that gid, take the intended direction
>    `target − p.pos` (after both clamps); if `speedF` is 0 or the
>    direction is degenerate ⇒ COST 0; else COST = `(1 −
>    facingFactor(facingCosine(dirUnit, bearingUnit), p.facingDepth)) ·
>    p.action.scores[0].score`, both functions IMPORTED from
>    `src/sim/bodyFacing.ts`; face iff `readyBenefit > COST` (strict). ⛔
>    No other change: the memory, the module, the table, the read set,
>    the hold order untouched. (iii) types.ts — `readyBenefit?: number`
>    beside `readyFaceGid`, same docblock discipline. (iv) PINS
>    (`tests/rcReady.test.ts`): G-REACH REPLACED by **G-TRADE-DECISION**
>    (fixtures: BF shut ⇒ faces whenever benefit > 0; depth 0.30 with φ
>    = 90° and S_move 0.45 ⇒ faces iff benefit > 0.135 — the bound
>    DERIVED from `facingFactor`, never typed; φ = 0 ⇒ cost 0; speedF 0
>    ⇒ cost 0; a higher S_move raises the cost; a mutant that ignores
>    the depth fails); **G-BITE on the DEFAULT vector** (world 12 as
>    composed, `rcReady` + `bfFacingCost` armed at w = 1, ≥ 1 scratch
>    seed: faces EXIST — a receipt — and on such ticks the heading turns
>    toward the carrier while the shut twin's follows motion; AND the
>    BF-shut armed walk faces MORE often than the BF-armed one — the
>    price bites on the decision); G-MOVEMENT-KEPT re-stated as the
>    MENU's byte-identity (the movement argmax is untouched by
>    construction — `cands` never carries a non-ActionType, and the
>    record's `type`/`scores` equal the shut twin's on the first facing
>    tick); G-INERT, G-HOLD, the copied face, channel closure, the read
>    set, seam map (needles re-counted: `readyBenefit` added, the
>    removed names gone), G-3A-UNTOUCHED, the fingerprint RUN — all
>    re-green; the two narrows re-checked (the `faceTarget` prose count
>    may move — restate positively). (v) STAGE DOC — §1 rewritten for THE
>    TRADE IS THE DECISION (this item verbatim as words of record beside
>    #378 item 6), §3 re-inventoried, §4 limit 1 REPLACED (the fork is
>    closed; the free turn with BF shut stays), a §FIX section with
>    receipts; ZERO sims; scratch 900,002,600–699; typecheck, new suite,
>    named suites, fingerprint, full suite in the background; ONE fix
>    commit; no push. (vi) VERIFY: the independent reviewer checks the
>    form against THIS item (both functions imported, no literal, strict
>    inequality, S_move from the record, depth from the body), the
>    menu's byte-identity, the pins' derivations, the default-vector
>    G-BITE's liveness, the narrows, the doc's prose sweep.
> 6. **CONSUMPTION THIS RULING: ZERO** (a seam and its fix; scratch
>    only). Next sim ≥ **12,539,000** (open to RC-T1b after the fix
>    banks); stats ≥ 117,600; registry 73.
> 7. **GOVERNANCE**: the RC contract gains §2-AMENDMENT (ruling #379) —
>    M-RC.3b's decision form; the RC-T0B stage doc gains §COMMANDER
>    CORRECTIONS (this ruling) now and §FIX at the fix; the seam commit
>    `10b2ff6` is pushed WITH this ruling (a landed dormant seam is
>    history, banked or not); the live rulings file stays under the
>    rotation line.
