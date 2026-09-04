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
