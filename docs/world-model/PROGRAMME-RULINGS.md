# PROGRAMME — Commander rulings (verbatim; LIVE FILE, #398 onward)

> This file holds commander rulings **#398 onward, verbatim**, APPENDED in numeric
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
> #373–#381 (RC-C0b→the BF arc→RC-T0b+fix→RC-T1b FAIL→BN-C0) in
> [`PROGRAMME-RULINGS-ARCHIVE-373-381.md`](PROGRAMME-RULINGS-ARCHIVE-373-381.md)
> #382–#389 (BN-C0 banked→BQ-C0/C1→BQ-T0/T1→world 13→LN-C0 dispatched and banked) in
> [`PROGRAMME-RULINGS-ARCHIVE-382-389.md`](PROGRAMME-RULINGS-ARCHIVE-382-389.md)
> #390–#397 (LN-T1→LN-C1/C2/C3→LN-T0→LN-T1′/T1′b→world 13 KEPT→LN-ENTRY world 14) in
> [`PROGRAMME-RULINGS-ARCHIVE-390-397.md`](PROGRAMME-RULINGS-ARCHIVE-390-397.md)
> (the unnumbered 2026-07-24 ruling remains in `PROGRAMME.md`'s context block).
> **Resume = `tail -n 120` of THIS file.** Find any ruling by number:
> `grep -n "RULING #N " docs/world-model/PROGRAMME-RULINGS*.md`. Rotation rule:
> ~1,500 lines ⇒ rotate the closed era in the same round as a ruling (#303 item 2).
> **COMMANDER RULING #398 (2026-09-06 — ⭐⭐⭐ GK-C0 BANKED AS MEASUREMENT: THE
> KEEPER'S BODY IS ALMOST NEVER WRITTEN IN PLAY — 8,681 of 9,231 over-cap ticks
> are restart placements, the rest an UPPER BOUND inflated by inherited
> momentum (the verifier's HIGH), a pocket of 68 save-window ticks labelled;
> WHAT THE USER SEES IS THE HANDS WITHOUT THE BODY — the save resolves a mean
> 1.968465 m from the keeper's body (0.675774 of catches beyond 2 m) under a
> sprite stretched toward the ball, and on 0.985375 of catches the ball then
> JUMPS a mean 1.711552 m into his feet in one tick; the world-14 code fact
> withdrawn (the door prices the keeper's DISTRIBUTION, not his saves); ⇒ 🔄
> GK-T0 「身体跟着手走」 THE DIVE LAW DISPATCHED — a dormant body law with no new
> constant: the keeper's body travels to the contact point over the save
> window, and the caught ball waits at the hands instead of jumping; rulings
> #390–#397 rotated):**
>
> 1. **GK-C0 BANKED AS MEASUREMENT** (commits f6fbd63 FREEZE · 016c4bb RESULTS;
>    N = 999 = the block 12,551,000–999 consumed whole (walked 000–998 +
>    receipt 999; no tail); BOOKED = WALKED = 2,000; 19/19 gates GREEN, the
>    artifact at its canonical path; gFaces 285/285 + 63/63; 56 direct `pos`
>    write sites enumerated over 579 extracted spans; `gStage`; X-DET;
>    X-SRC-ZERO; fingerprint UNCHANGED; typecheck clean; ZERO stats; registry
>    80). Verifier **FAIL — two HIGH** (claim defects, both disposed at the
>    doc's §COMMANDER CORRECTIONS 1–9; every number reproduces exactly, the
>    saves and the ball-jump rebuilt by hand on the verifier's own band): (i)
>    the "written" predicate OVER-counts — `resolveOverlaps` adds velocity after
>    integration, so pure integration clears the cap the next tick; the frozen
>    "can only under-count" claim is FALSE; every written face is relabelled an
>    OVER-CAP UPPER BOUND; the next instrument's predicate is the residual
>    `|pos_after − (pos_before + vel_after·DT)|`; (ii) the world-14 fact was
>    false as a universal — the keeper-path root set omitted `decidePlayer`,
>    whose first branch routes the ball's OWNER into `decideCarrier`, the
>    own-lane span; the keeper owns the ball after every catch, so the door
>    prices his passes (already measured: LN-T1′b's KEEPER-pass family, passes
>    499 → 454 at w = 0.25, carom 0.050100 → 0.017621). One MEDIUM (a
>    superlative scoped to one arm) and four LOW disposed.
> 2. ⭐⭐⭐ **THE TABLE, READ** (E13 — the user's kept world; D13 agrees on the
>    read): THE KEEPER'S BODY — 30,552,654 keeper ticks; mean |Δpos| 0.017000 m
>    per tick against a mean own cap of 0.103981 m (he walks a sixth of what
>    his legs allow); OVER-CAP ticks **9,231** (0.000302), of which **8,681
>    restart placements** (the kick-off reset, the restart clearance, the
>    goal-kick line — the largest single displacement 12.781099 m on E13,
>    14.111564 m on D13, both kick-off resets: legitimate placement, not a
>    teleport in play); outside restarts **550** (an UPPER BOUND — item 1(i);
>    the verifier's sample: 18 of 77 in the dominant class carried a write
>    ≥ 1 mm), led by `actGoalkeeperPosition` 370 (≤ 1.608244 m) · `actChaseBall`
>    70 (≤ 0.115225 m) · the save window **68 (≤ 8.598959 m — the pocket,
>    H-GK-2, §CORR 9)**. THE SAVES — 5.703704 save events per match; every
>    `shotLog` pending → saved flip joined to a save event on the same tick
>    (1.000000); the families: parry **0.775886** · high-ball claim 0.112145 ·
>    catch **0.096350** · smother 0.015620; the ball↔keeper distance at the
>    save tick mean **1.968465** m [1.953044, 1.983364] against a reconstructed
>    `keeperReach` 2.393549 (× 1.35 = 3.231291); within reach 0.979115, in the
>    fingertip stretch 0.020885, beyond it 0.000000; catches taken > 1 m from
>    the body **0.896175**, > 2 m **0.675774**, > 3 m 0 (the `dNow <= reach`
>    guard); THE BALL-JUMP: on **0.985375** of catches (539/547) the ball's
>    next-tick displacement exceeds the keeper's own cap — mean **1.711552 m**
>    in one tick, bin-median 1.75 m (the carry law snaps the owned ball to
>    `owner.pos + carryLen`); parries move the ball 0.182645 m (a struck
>    release, not a jump). ALL BODIES — an outfielder is over-cap 5× more often
>    than a keeper (0.001660 vs 0.000302): restart placements 82,230 ·
>    `overlapPush` 70,167 · kick-protection 9,475 · hold-clearance 405 (the
>    opponent pushed off a holding keeper: 0.001602 of outfield over-cap
>    ticks) · unclassified 90,360 (counted). THE CODE FACTS: the save path
>    (`tryKeeperSave` → `giveBall`) writes no keeper `pos` (confirmed at the
>    body level; the one reaching site in the closure is `becomeSub`, inert);
>    the renderer stretches the sprite (1 + 0.7k, 1 − 0.35k) toward the ball
>    for 0.7 s, and the high-ball claim sets 0.6 s against a 0.7 s divisor.
>    THE READ PRINTED: *"THE KEEPER'S BODY IS WRITTEN — the write site is named
>    (<class>)."* (`actGoalkeeperPosition`), with READ 1's condition ALSO true
>    (0.985375 > 0.5) — the frozen precedence printed the body one; the
>    commander reads both.
> 3. ⭐⭐⭐ **THE FOOTBALL READING (VISION + REALITY).** The user's sentence is
>    REAL and its mechanism is THE HANDS WITHOUT THE BODY: the engine resolves a
>    save when the ball is within the keeper's REACH — up to 3.2 m from where
>    his body stands — and leaves the body where it was; the renderer stretches
>    his sprite toward the ball; a catch then snaps the ball two metres into
>    his feet in one tick. In play his body is not teleported by code (a
>    sub-metre handful and one labelled pocket aside); at restarts it is placed,
>    as designed. VISION: 扑救是身体飞出去 — a keeper reaches a ball by getting his
>    body to it; 底座给能力 — the base should make the dive physical, not paint
>    it. REALITY: real keepers' hands arrive WITH their bodies; a ball caught
>    two metres away is a dive that took a third of a second, not a hand that
>    grew. ⇒ **GK-T0 THE DIVE LAW** (item 5): the body travels to the contact
>    point over the save window the engine already has; the caught ball waits
>    at the hands until the body arrives. No new constant; no change to any
>    save roll or outcome at the tick of the save. (ii) THE POCKET (68 ticks ≤
>    8.598959 m in the save window) is **H-GK-2** — restart placements after a
>    parry-to-corner or a goal-kick taken while `saveAnimTimer` still runs and
>    missed by a phase-only classifier — a labelled hypothesis; GK-T1's ABSENT
>    arm carries the residual predicate and a placement-site classifier to
>    settle it. (iii) The render census (story (c)) is NOT needed as a stage:
>    the render facts are anchored and the body law makes the sprite's stretch
>    a real displacement.
> 4. ⭐ **WORLD 14, A FIRST-LOOK ADDITION** (from item 1(ii)): the own-lane door
>    ALSO prices the KEEPER'S own distribution — his passing lanes are the
>    fullest of own bodies on the pitch, so under the door he passes less and
>    holds or carries more (LN-T1′b: KEEPER-pass passes 499 → 454 at 0.25;
>    their carom 0.050100 → 0.017621). Of record for the user's v14 eye: 门将出
>    球也在这扇门里——他会少传几脚、多持球; the blurb gains this sentence at the
>    next entry-layer touch (not a fresh commit for one line).
> 5. ⭐⭐ **GK-T0 DISPATCHED — 「身体跟着手走」 THE DIVE LAW** (a T0 seam; SRC EDITS
>    AUTHORIZED for the seam ONLY; Road B: the flag `gkDiveBody` default OFF,
>    absent from `a4World` and every preset, the fingerprint UNCHANGED, worlds
>    12–14 byte-identical; the BQ-T0 / LN-T0 form; a new contract
>    `GK-KEEPER-BODY-CONTRACT.md` with §6 VISION / §7 REALITY audits). (i)
>    **M-GK.1 THE CONTACT POINT**: when `tryKeeperSave` resolves a save (catch
>    OR parry) under the flag, the engine records the contact point on the
>    keeper — `gk.saveContact = { x: ball.pos.x, y: ball.pos.y }` at the save
>    tick (the ball's own position, the engine's record; cleared when
>    `saveAnimTimer` reaches 0) — the ONE new field, written at the ONE
>    resolution site. (ii) **M-GK.2 THE BODY FOLLOWS THE HANDS**: while
>    `saveAnimTimer > 0` and `saveContact` is set, the keeper's executor steers
>    him to `saveContact` at `speedF = 1` (the existing `GoalkeeperSave` /
>    `GoalkeeperPosition` cases gain ONE guarded branch: `if (match.gkDiveBody
>    && p.saveAnimTimer > 0 && p.saveContact) { target = p.saveContact; speedF =
>    1; }`) — integrated by `physicsStep` at his own `topSpeed`, never written;
>    the existing 0.7 s window and the existing `topSpeed` are the only
>    quantities (no new constant, #384 item 5's doctrine); the body arrives
>    within the window for any contact inside reach × 1.35 at any keeper
>    topSpeed above 4.62 m/s (stated, pinned by fixture, the shortfall
>    published for slower keepers). (iii) **M-GK.3 THE BALL WAITS AT THE
>    HANDS**: while the ball's owner is a keeper with `saveContact` set and
>    `saveAnimTimer > 0`, the carry law places the owned ball at `saveContact`
>    (the hands) instead of `owner.pos + carryLen` UNTIL the body's carry point
>    is within `carryLen` of it (then normal carry resumes and `saveContact` is
>    consumed) — the ball's per-tick displacement after a catch becomes the
>    body's, never a jump; parries are unaffected (the ball is not owned).
>    Nothing else: no save roll, no `saveP`, no reach, no `giveBall` timing
>    changes; the shot outcome at the save tick is byte-identical between OFF
>    and ON (pinned: the `shotLog` outcome sequence equal on the same seeds
>    through the save tick — downstream positions may differ, so the pin is on
>    the outcome AT the save, not the whole match). (iv) PINS
>    (`tests/gkDiveBody.test.ts`, the `lnOwnLane.test.ts` form): FLAG OFF ≡ HEAD
>    byte-identical (rng state) on ≥ 12 seeds in the bare world AND world 13
>    AND world 14; FLAG ON with no save in a fixture ≡ OFF; FLAG ON ⇒ on a
>    hand-built catch at 2.5 m the body's position converges to the contact
>    point within the window and the ball's per-tick displacement never exceeds
>    the body's cap (the ball-jump face 0); on a hand-built parry the body
>    moves toward the contact point and the ball is unaffected; `saveContact`
>    cleared with the timer; the outcome-at-save identity; every new statement
>    behind the flag (an anchored count of `gkDiveBody` reads — the seat idiom,
>    ONE read serving the sites is acceptable and pinned as such); the four
>    mutants (the contact recorded on the ball instead of the keeper; the ball
>    waiting forever; the body steered without the flag; the window ignored) —
>    each killed; fingerprint; typecheck; `npm test`; narrows listed. (v) THE
>    CONTRACT `GK-KEEPER-BODY-CONTRACT.md`: §0 the diagnosis chain (the user's
>    sentence 「并且门将现在仍然有的时候最后一刻突然瞬移到球的那个地方」 × GK-C0's fields:
>    the save distance 1.968465 m, catches > 2 m 0.675774, the ball-jump
>    0.985375 / 1.711552 m, the body over-cap in play an upper bound of 550
>    ticks, restarts 8,681); §1 claims; §2 M-GK.1–3 as built; §3 instruments &
>    the arc — GK-T1 (arms ABSENT · ARMED on world 13 E13/D13 and world 14
>    beside; the seam's own faces: the ball-jump share at catches → 0, the
>    body↔contact distance at the END of the window (arrival), the keeper's
>    RESIDUAL-written ticks (the corrected predicate) by class incl. the
>    pocket; GUARDS in OBM-T1's form: goals per match (both directions), saves
>    per match and catch share (both directions — the roll is untouched, so any
>    move is downstream), xG-per-shot conversion, shots, completion, the
>    keeper's distribution passes; the read literals naming GK-ENTRY (world 15
>    = world 14 + the dive door) or stop); §4 non-claims (no dive SPEED beyond
>    topSpeed — a real dive is faster; the 0.7 s window is the animation's, not
>    a measured dive time; the high-ball claim's 0.6 s; the parry's body
>    arrival is cosmetic-physical; no outcome change); §6 VISION; §7 REALITY.
>    (vi) DOC `GK-T0-DIVE-LAW.md` (§0 words of record · §1 mechanism · §2 files
>    · §3 pins as the living inventory · §4 HONEST LIMITS · §DEVIATIONS); ONE
>    commit; never pushed; `a4World.ts` not edited.
> 6. **CONTRACTS**: `GK-KEEPER-BODY-CONTRACT.md` created by GK-T0. The GK-C0 doc
>    §CORR 1–9. `BF-BODY-FACING-CONTRACT.md`'s stationary-keeper finding stands
>    beside (a keeper who never moved and then "appears" at the ball is this
>    mechanism seen from the shot's side).
> 7. **THE GATES OF RECORD**: world 12 (open) · world 13 CLOSED KEEP · **world
>    14 OPEN** (`?a4world=14`, deployed; 「看见自己人 (v14) — keep | change | revert
>    — <一句人话>」).
> 8. **GOVERNANCE ROTATION** (#303 item 2's law): the live rulings file passed
>    ~1,500 lines; rulings **#390–#397** rotate BYTE-VERBATIM to
>    [`PROGRAMME-RULINGS-ARCHIVE-390-397.md`](PROGRAMME-RULINGS-ARCHIVE-390-397.md),
>    `cmp`-verified in this round; the live file = **#398 onward**;
>    `PROGRAMME.md`'s resume line updated (nine ARCHIVE files).
> 9. **CONSUMPTION**: GK-C0 consumed **12,551,000–999** whole of record.
>    Frontier: next sim ≥ **12,552,000** (GK-T0 consumes none; GK-T1 opens
>    there); stats ≥ 117,600; registry 80 (81 at GK-T1's freeze). THE QUEUE:
>    GK-T0 (running) → GK-T1 → ③ (retire the designations; LN-T1's ABSENT arm
>    its control) → ⑤ last. DEBTS unchanged (+ the `formationEvolution`
>    budget).

> **COMMANDER RULING #399 (2026-09-06 — ⭐⭐ GK-T0 「身体跟着手走」 BUILT, VERIFIER
> FAIL ON THE LAW ITSELF: the seam is DORMANT and HARMLESS (24/24 byte-identity
> cells, 12 lockstep saves with zero outcome movement, the fingerprint
> unchanged) but it does NOT deliver its sentence — the caught ball's jump is
> DEFERRED to the window's expiry, not removed, because after a catch the
> keeper is routed through the carrier's ladder and none of the enumerated
> keeper cases steers him; parries DO enter the waiting law on a regather;
> the arrival-release is untestable; and the ruling's own arrival arithmetic
> ignored acceleration — TWO of the commander's premises recorded WRONG ⇒ 🔄
> GK-T0b THE RE-FORM DISPATCHED: steer on every tick while the contact is
> set, wait until ARRIVAL not the timer, parries steer-only, pins across the
> whole episode):**
>
> 1. **GK-T0 BUILT, NOT OF RECORD AS A LAW** (commit c660531: `Player.saveContact`
>    · the flag `gkDiveBody` (default OFF) · M-GK.1 the ONE write in
>    `tryKeeperSave` above the catch/parry split · M-GK.2 ONE override after
>    the executor's switch for the three keeper cases · M-GK.3 ONE waiting
>    branch in the carry law; 25 pins; ONE narrowing; the contract
>    `GK-KEEPER-BODY-CONTRACT.md`; the doc `GK-T0-DIVE-LAW.md`; `npm test`
>    green; typecheck clean; fingerprint 57b0bdab…c673 UNCHANGED; `a4World.ts`
>    untouched; ZERO frontier seeds). Verifier **FAIL — two HIGH, four MEDIUM,
>    four LOW**, disposed at the doc's §COMMANDER CORRECTIONS 1–12. WHAT
>    HOLDS: the dormancy (per-tick byte-identity in the bare world, world 13
>    and world 14; the field null on 91,129 OFF ticks with 40 saves); the
>    outcome-at-save identity (no roll, kind or ledger entry moved); the
>    contact point IS the ball's position at the save tick; no new constant;
>    no fourth site. WHAT FAILS: the LAW. (i) On the ruling's own fixture
>    (a catch at 2.5 m) the ball waits 41 ticks and then moves **2.050600 m in
>    one tick** when `saveAnimTimer` expires (shut: 2.545900 m on tick 1) — the
>    body never came: after a catch the keeper OWNS the ball, `decidePlayer`
>    routes him into `decideCarrier` (#398 item 1(ii)'s own correction), he
>    holds `MoveToFormationSpot` / `HoldPosition`, and M-GK.2's enumeration of
>    keeper cases never fires (0 of 42 ticks); in play, 10 of 11 waits ended by
>    the timer, mean gap 1.65 m, max 3.46 m. (ii) The arrival-release cannot
>    be tested: a count-preserving mutant disabling it passes all 25 pins
>    (the timer clears the field; the pins loop on the field). (iii)
>    "Parries never enter" (the ruling's #398 item 5(iii)) is FALSE — the
>    keeper regathers his own parry inside the window on 4 of 8 observed
>    waiting episodes and the ball is pinned to the PRE-PARRY contact, up to
>    5.481300 m from him. (iv) The ruling's arrival arithmetic (3.231291 / 0.7
>    = 4.62 m/s) ignored acceleration: from rest a keeper at 5.962486 m/s ends
>    0.591749 m short at the mean reach and 0.955967 m short at reach × 1.35;
>    the executor pinned `end > 0` as a positive fact — the honest half of the
>    stage, ratified.
> 2. ⭐ **THE COMMANDER'S TWO PREMISES, RECORDED WRONG**: #398 item 5(ii)
>    "arrives within the window … at any keeper topSpeed above 4.62 m/s" and
>    5(iii) "parries are unaffected (the ball is not owned)". Rulings are never
>    reworded; #399 supersedes. LESSON OF RECORD (the RC-T0b / #391 3(v) family):
>    a law's window and its release must be the PHYSICAL event it names (the
>    body's arrival), not the animation's clock; and a premise about which
>    bodies enter a branch is a MEASUREMENT, not an inference from who "owns"
>    the ball.
> 3. ⭐⭐ **THE RE-FORM (VISION + REALITY).** VISION: 扑救是身体飞出去 — the body
>    goes to the ball and the ball stays where it was caught until the body
>    gets there; REALITY: a real keeper's hands never let a caught ball go two
>    metres; the dive takes what it takes. ⇒ (i) **M-GK.2′ THE BODY FOLLOWS
>    THE HANDS, EVERY TICK**: while `p.saveContact !== null` the executor
>    steers the keeper to the contact at `speedF = 1` WHATEVER his action —
>    the keeper is the only body that ever has a contact, so the gate is the
>    field itself (`match.gkDiveBody && p.saveContact !== null`), placed after
>    the switch as built; the clamp is `clampToBox` unless the action is
>    `GoalkeeperRush`. (ii) **M-GK.3′ THE CAUGHT BALL WAITS UNTIL ARRIVAL**: the
>    contact carries a `caught` mark set ONLY in the catch branch (`gk.saveContact
>    = { x, y, caught: true }` in the catch branch; `{ x, y, caught: false }` in
>    the parry branch — steer-only); the waiting branch requires `caught`; the
>    wait ENDS on arrival (the body's carry point within `carryLen` of the
>    contact) or on LOSS OF OWNERSHIP (the ball's owner is no longer the keeper
>    — the contact cleared where ownership changes, guarded on `!== null`),
>    NEVER on the animation timer; `saveAnimTimer`'s decrement no longer clears
>    the contact (the sprite's window and the law's window are different
>    things — stated). A parry's contact is cleared when `saveAnimTimer`
>    reaches 0 (steer-only has no ball to wait for) or on the regather (a
>    regathered ball takes the shipped carry law — the `caught` mark is false).
>    (iii) THE FAIL-SAFE, no new constant: a keeper who cannot arrive (a
>    hand-built topSpeed near 0) holds the ball at the hands for as long as he
>    owns it — the hold/distribution bubble protects it exactly as it protects
>    a ball at his feet (the shipped `gkHoldTimer` / `gkDistributing` return);
>    the doc names the `gkFeet` case (a catch outside the area, no hold) where
>    the tackler scan at 1.15 m of the ball and `looseTouch` at 0.85 m read
>    the WAITING ball's position — a PUBLISHED consequence, GK-T1's face.
>    (iv) THE PINS, re-formed: the ball's per-tick displacement measured over
>    the WHOLE episode from the catch tick to the first tick after release
>    (the ball-jump face 0 on the 2.5 m fixture INCLUDING the release tick —
>    the release hands the ball to the shipped carry law at the carry point,
>    a displacement ≤ `carryLen` per tick by construction; state and pin it);
>    the arrival time in ticks on the 2.5 m fixture from rest (a measured
>    receipt, not a claim); a fixture where the body arrives and the ball then
>    follows (kills "waits forever" behaviourally); a fixture where ownership
>    is lost mid-wait (the contact clears, the ball is loose where it stood);
>    a regathered-parry fixture (the ball is NOT pinned; the shipped carry law
>    runs); the window-ignored mutant re-formed (steering continues after
>    `saveAnimTimer` hits 0 while the contact is set — a pin that the OLD law's
>    timer-clear would fail); OFF ≡ HEAD on bare / 13 / 14; the outcome-at-save
>    identity; the fingerprint; the four re-formed mutants each killed
>    BEHAVIOURALLY. (v) THE DOCS: the contract's §2 re-written to M-GK.1–3′ with
>    the code quoted; §4 the non-claims incl. the arrival time as a measured
>    face, the `gkFeet` exposure, no dive impulse; §7 the clause "a caught
>    ball does not jump" re-taken on the re-formed fixture; the T0 doc's §1 /
>    §3 / §4 / §DEVIATIONS updated; a §GK-T0b DELTA section listing every
>    changed line against c660531.
> 4. ⭐⭐ **GK-T0b DISPATCHED — 「身体跟着手走 · 重形」** (a T0 re-form; SRC EDITS
>    AUTHORIZED in the seam's five files ONLY — `mechanics.ts`, `Player.ts`,
>    `Match.ts` (the carry law and, if needed, the ownership-change clear),
>    `actionExecutor.ts`, `League.ts` — plus `tests/gkDiveBody.test.ts` and any
>    positive narrows; `a4World.ts` untouched; Road B: the flag default OFF; the
>    OFF world byte-identical to HEAD in bare / 13 / 14; the fingerprint
>    UNCHANGED; no new constant; ONE commit; never pushed). The specification is
>    item 3; the executor reports the arrival-time receipt on the 2.5 m fixture
>    and the in-play wait statistics on 12 armed scratch matches (how many
>    waits end by arrival vs ownership loss; the mean and max wait in ticks;
>    the max ball↔owner distance while waiting) as DATA for GK-T1's design.
> 5. **GK-T1 — THE FORM, AMENDED FOR THE RECORD**: the ball-jump face is
>    measured over the WHOLE episode (every tick the keeper owns a caught
>    ball, from the catch to the release and the tick after), not at the catch
>    tick alone (the verifier's (1)); the body's arrival time distribution and
>    the share of waits ended by ownership loss are faces; the `gkFeet` contest
>    exposure (tackle candidacy at the hands; `looseTouch`) is a face; the
>    guards as at #398 item 5(v), plus the keeper's holds per match and the
>    time-to-distribution (a longer wait delays the restart of play — a real
>    cost, measured).
> 6. **CONTRACTS**: `GK-KEEPER-BODY-CONTRACT.md` corrected in place (§CORR 3–4;
>    §7's clause FAIL at GK-T0, re-taken at GK-T0b). The T0 doc §CORR 1–12.
> 7. **THE GATES OF RECORD**: world 12 (open) · world 13 CLOSED KEEP · world 14
>    OPEN (「看见自己人 (v14) — keep | change | revert — <一句人话>」).
> 8. **CONSUMPTION**: GK-T0 consumed no frontier seed. Frontier: next sim ≥
>    **12,552,000** (GK-T0b consumes none; GK-T1 opens there); stats ≥ 117,600;
>    registry 80 (81 at GK-T1's freeze). THE QUEUE: GK-T0b (running) → GK-T1 →
>    ③ → ⑤. DEBTS unchanged. ⚠ THIS PUSH carries the dormant seam c660531 to
>    main: the flag is OFF everywhere, the fingerprint unchanged, worlds 12–14
>    byte-identical — no visible change (Road B).

> **COMMANDER RULING #400 (2026-09-06 — ⭐⭐⭐ GK-T0b 「身体跟着手走 · 重形」 BANKED-DORMANT,
> VERIFIER PASS: THE LAW NOW DELIVERS ITS SENTENCE — on the ruling's own
> fixture the caught ball moves 0.000000 m on every waiting tick and 0.277703
> m on the arrival release (shut: 2.798429 m on the first tick); the body is
> steered every tick whatever the brain says; a regathered parry is never
> pinned (252 regathered-parry ticks measured, 0 pinned); every mutant dies
> on behaviour; OFF byte-identical on two independent harnesses; the honest
> facts recorded (arrival is the usual release in play; the predicate is the
> carry point, not the body; the `gkFeet` catch has no protection); ONE latent
> hole found by the verifier — a lose-and-regain inside one step leaves a
> stale contact that would snap the ball back — ⇒ 🔄 GK-T0c THE ONE-STATEMENT
> CLOSE DISPATCHED before the exam):**
>
> 1. **GK-T0b BANKED-DORMANT** (commit 006bf71 — the delta against c660531:
>    FIVE code lines and ONE block in four files; `Player.saveContact` gains
>    `caught`; the two writes in `tryKeeperSave` (catch `caught: true`, parry
>    `caught: false`); the executor override's gate reduced to `match.gkDiveBody
>    && p.saveContact !== null` (no action-type enumeration); the waiting
>    branch's conjunct `saveAnimTimer > 0` → `saveContact.caught`; the
>    ownership-loss SWEEP (one guarded loop above the restart/ball fork —
>    there is NO ownership funnel in this engine: twelve `ball.owner`
>    assignment sites in three files, one outside the seam's five); the
>    decrement's clear narrowed to parry contacts; 28 pins (was 25); no new
>    narrow; `npm test` 2,166 green; typecheck clean; fingerprint UNCHANGED;
>    `a4World.ts` untouched; ZERO frontier seeds). Verifier **PASS, zero HIGH**
>    (two MEDIUM, three LOW): its own per-tick byte-identity against the head
>    of record on its own band (36/36 cells, bare / 13 / 14), its own lockstep
>    outcome-at-save (12 seeds, 0 mismatches), its own walk of the fixture past
>    the release (0.000000 × 40 ticks; 0.295141 ≤ carry 0.3 on tick 41; the
>    brain's actions `MoveToFormationSpot` × 19 then `HoldPosition` × 22 —
>    the two cases GK-T0 missed — all steered), the four mutants plus two of
>    its own applied on a realpath-verified scratch copy (every one killed by a
>    behavioural pin; the count-preserving arrival-disable that passed 25/25
>    at GK-T0 now fails two), the twelve ownership sites enumerated
>    independently, the executor's 12-match in-play receipt reproduced to the
>    digit. Every §COMMANDER CORRECTION of GK-T0 (1–12) discharged.
> 2. ⭐⭐ **THE FACTS OF RECORD, FROM THE FIXTURES AND THE ARMED WALKS**: (i)
>    ARRIVAL IS THE USUAL RELEASE IN PLAY — 12 matches: 3 waits, 3 by arrival
>    (93 / 65 / 34 ticks); 40 matches: 21 waits, 17 by arrival / 4 by
>    ownership loss, mean wait 102.523810 ticks, mean arrival 57.294118, max
>    ball↔owner 2.960237 m (the verifier's 40: 24 waits, 22 / 2, mean 69.25,
>    max 3.192847 m); ⚠ waits routinely OUTLIVE the sprite's 42 ticks — the law
>    and the animation are different clocks, by design. (ii) THE ARRIVAL
>    PREDICATE IS THE CARRY POINT, NOT THE BODY: on the 2.5 m fixture the
>    carry point reached the contact with the body still 0.577703 m away
>    (release ≤ carry by construction); on the abeam fixture the BODY sat
>    inside `carry` from tick 54 while the carry point never did — the shipped
>    Phase 51.2 hold-facing rule squares a holding keeper at the opponents'
>    goal and swings his carry point sideways — so that wait ended only by his
>    own distribution (390 ticks). A design fork for GK-T1, labelled, not
>    patched. (iii) THE `gkFeet` EXPOSURE IS REAL: a catch outside the area
>    has no hold bubble; an opponent stood at the hands satisfies both contest
>    predicates and wins the ball on the FIRST tick; 0 such catches in 52
>    armed matches — its in-play size is GK-T1's face. (iv) THE ABEAM FIXTURE
>    IS THE ONLY TEETH against the animation clock creeping back into the
>    caught release (the verifier's V-MUT6) — of record; the ahead fixture
>    arrives on tick 41, inside the sprite's 42. (v) The high-ball CLAIM sets
>    no contact; a claimed high ball still snaps to the feet — this law does
>    not touch it (7 of 55 save events were claims/smothers).
> 3. ⭐ **THE LATENT HOLE (the verifier's MEDIUM 1), TO BE CLOSED BEFORE THE
>    EXAM.** The ownership sweep runs ONCE per tick, above the ball step; a
>    keeper who LOSES and REGAINS a waiting caught ball inside one `stepBall`
>    (a tackle takes it at `tryTackles`; `tryCapture` → `giveBall` gives it
>    back) presents the same owner to the next sweep, the stale `caught`
>    contact survives, and the head-of-step placement SNAPS THE BALL BACK to
>    the pre-loss contact (the verifier's hand-built regather: a 5.000000 m
>    jump, the ball 2.495500 m from the keeper) — the very defect class #399
>    struck for parries, latent on the catch branch; 0 occurrences in 60 armed
>    matches. THE CLOSE (GK-T0c, item 4): the contact is cleared where
>    ownership is GAINED — ONE guarded statement at the top of `giveBall`'s
>    ownership assignment (`if (p.saveContact !== null && p.saveContact.caught)
>    p.saveContact = null;` — a fresh gain retires any stale caught contact;
>    OFF path: the field is null, no assignment) — with the catch branch
>    REORDERED to write its contact AFTER `match.giveBall(gk)` (the ball's
>    position is unchanged by `giveBall`, so the contact value is the same);
>    the parry write stays where it is. Any other regain path that bypasses
>    `giveBall` (the four `mechanics.ts` owner assignments) is enumerated and
>    stated: the sweep still clears a loss that PERSISTS to the sweep; an
>    intra-step lose-and-regain through a non-`giveBall` gain is named as the
>    residual, with a fixture receipt if constructible. The pin: a hand-built
>    lose-and-regain within one step — the contact is null after the regain
>    and the ball is NOT snapped back (the verifier's V6 shape); plus the
>    unit-level pin (a stale caught contact + `giveBall(gk)` ⇒ null; the catch
>    path still sets its contact after the reorder). (ii) THE DOCS carry the
>    40-match arrival/loss split (MEDIUM 2) beside the 12-match receipt; the
>    mutant row count 10 → 11; the over-long comment line re-wrapped.
> 4. ⭐⭐ **GK-T0c DISPATCHED — 「身体跟着手走 · 补一针」 THE ONE-STATEMENT CLOSE**
>    (a T0 fix; SRC EDITS in `src/sim/Match.ts` (`giveBall`) and
>    `src/sim/mechanics.ts` (the catch-branch reorder) ONLY, plus
>    `tests/gkDiveBody.test.ts` and the two GK docs; no new constant; the OFF
>    path executes no new assignment; OFF ≡ HEAD in bare / 13 / 14; the
>    outcome-at-save identity; the 28 pins still green plus the new ones; the
>    fingerprint UNCHANGED; ONE commit; never pushed; scratch 900,005,200–299).
>    The specification is item 3.
> 5. **GK-T1 — THE FORM, CONFIRMED AND AMENDED ONCE MORE** (dispatched at the
>    ruling that banks GK-T0c): the faces of #399 item 5 PLUS the release
>    composition (arrival / ownership loss / regain-cleared) and the wait
>    length distribution in ticks; the body↔contact distance at release (the
>    carry-point-vs-body fork's data); the keeper's holds per match and
>    time-to-distribution as guards; the `gkFeet` exposure's in-play count;
>    the claims' snap beside (untouched by this law — a later door if it reads
>    large).
> 6. **CONTRACTS**: `GK-KEEPER-BODY-CONTRACT.md` §2 = M-GK.1–3′ as built; §7's
>    clause "a caught ball does not jump" re-taken PASS on the re-formed fixture
>    with the GK-T0 FAIL left on the record. The T0 doc §GK-T0b DELTA.
> 7. **THE GATES OF RECORD**: world 12 (open) · world 13 CLOSED KEEP · world 14
>    OPEN (「看见自己人 (v14) — keep | change | revert — <一句人话>」).
> 8. **CONSUMPTION**: GK-T0b consumed no frontier seed. Frontier: next sim ≥
>    **12,552,000** (GK-T0c consumes none; GK-T1 opens there); stats ≥ 117,600;
>    registry 80 (81 at GK-T1's freeze). THE QUEUE: GK-T0c (running) → GK-T1 →
>    ③ → ⑤. DEBTS unchanged. ⚠ THIS PUSH carries the dormant re-formed seam
>    006bf71 to main (Road B: no visible change).

> **COMMANDER RULING #401 (2026-09-06 — ⭐⭐⭐ GK-T0c BANKED, VERIFIER PASS: THE
> DIVE LAW IS COMPLETE AND DORMANT — the contact with its `caught` mark, the
> body steered to it every tick, the caught ball waiting until the body
> arrives, released by arrival, by loss of ownership or by a fresh gain; the
> one latent hole shut by one guarded statement whose in-play population is
> ZERO (the engine cannot lose and regain inside one step — an invariant,
> honestly labelled); OFF byte-identical to the parent on 72 cells and ARMED
> byte-identical too; no new constant anywhere in three builds ⇒ 🔄 GK-T1
> 「身体跟着手走 · 考试」 THE DIVE EXAM DISPATCHED on the user's face):**
>
> 0. **A BOOKKEEPING DISCLOSURE FIRST.** Commit 953e4be carries the message of
>    this ruling but only the T0 doc's corrections landed in it (the writer
>    stopped at a phrase that did not match in the contract and the commit
>    went out before the check). This ruling, STATE, the LOG entry and the
>    contract's two sentences land in the commit AFTER it. History is not
>    rewritten; the record says so here.
> 1. **GK-T0c BANKED** (commit 1fd9252 — three non-comment src lines against
>    006bf71: the guarded clear in `giveBall` immediately after `ball.owner =
>    p;` (release (c), `caught`-only), the catch write moved to the last
>    statement of its branch (after `pushEvent` and `giveBall`; the value
>    identical — `giveBall` never writes `ball.pos`, now pinned on the ball
>    itself), a comment re-wrapped; 30 pins (the unit pin; the lose-and-regain
>    between two sweeps); no narrow; `npm test` green (the `formationEvolution`
>    budget flake re-run alone); typecheck clean; fingerprint UNCHANGED;
>    `a4World.ts` untouched; ZERO frontier seeds). Verifier **PASS, zero HIGH**
>    (two MEDIUM — a summary counter off by one, a re-wrap receipt off by four
>    characters — corrected in place at the T0 doc's §COMMANDER CORRECTIONS
>    1–5 and the contract; two LOW): its own lose-and-regain on its own scene
>    (the engine's tackle, a hand-built regain; the contact cleared; with the
>    statement deleted the ball pinned 2.442645 m from its keeper for 20
>    ticks), 72 OFF cells byte-identical to the parent, 12 ARMED matches
>    byte-identical to the parent (the shape never occurs in play), the
>    outcome-at-save identity with 5–11 saves per seed, the twelve owner
>    sites re-enumerated (ten losses; two gains — `giveBall` and the kickoff's
>    fallback to a sent-off keeper, preceded by `resetForKickoff`'s own clear).
> 2. ⭐⭐ **THE SEAM OF RECORD (M-GK.1–3′, complete)**: `Player.saveContact:
>    { x, y, caught } | null`; ONE flag `gkDiveBody` (default OFF, never in a
>    world or preset); the catch branch writes `{ …, caught: true }` AFTER
>    `giveBall`, the parry branch `{ …, caught: false }`; the executor steers
>    the keeper to the contact at `speedF = 1` on EVERY tick while the field
>    is set (`clampToBox` unless `GoalkeeperRush`); the carry law holds a
>    caught ball AT the contact until the body's carry point is within
>    `carry`, then hands it to the shipped placement; a caught contact is
>    released by ARRIVAL, by LOSS OF OWNERSHIP (one guarded sweep above the
>    ball step) or by a FRESH GAIN (the `giveBall` clear); a parry contact
>    dies with the sprite's window; `becomeSub` / `resetForKickoff` clear
>    both. No save roll, reach, outcome or ledger entry moves at the save
>    tick (pinned in lockstep on every walk). The quantities are the flag,
>    the field, `carry`, `topSpeed` and the existing timers — NO NEW CONSTANT
>    across GK-T0, T0b and T0c. HONEST LIMITS OF RECORD: the dive is capped at
>    `topSpeed` (a real dive is faster; from rest even a fast keeper ends the
>    sprite's 0.7 s short — the wait routinely outlives the animation, by
>    design); the arrival predicate is the CARRY POINT (a holding keeper's
>    carry point swings sideways under the shipped hold-facing rule — the
>    abeam contact waits until his own distribution); a catch OUTSIDE the
>    area (`gkFeet`) has no hold bubble and an opponent at the hands wins the
>    ball at once (0 such catches in 52 armed matches); the high-ball claim
>    sets no contact and still snaps (not this law's).
> 3. ⭐⭐⭐ **GK-T1 DISPATCHED — 「身体跟着手走 · 考试」 THE DIVE EXAM** (a T1 exam;
>    X-SRC-ZERO — the seam exists; the LN-T1′b / GK-C0 form; definitions
>    frozen at the executor's §P). (i) ARMS, paired on shared seeds — the law
>    has NO dose, so ABSENT vs ARMED only, on THREE compositions: **E13**
>    (world 13 empty-book — the read of record) · **D13** (the form the user
>    plays on 13) · **E14** (world 14 empty-book — beside, because the own-lane
>    door prices the keeper's distribution, #398 item 1(ii)); the choice
>    ledger not needed; GK-C0's walker (the keeper per-tick series, the save
>    join to `shotLog` and the four save-event families, catch vs parry off
>    the event text) INHERITED and re-anchored at this head (the catch branch
>    changed at T0c; the write sites are new spans) — and the RESIDUAL
>    predicate replaces GK-C0's cap predicate for "written": `|pos_after −
>    (pos_before + vel_after·DT)| > 1 mm` (fixture-pinned: a `resetForKickoff`
>    fires it; a full-speed integrated step and a `resolveOverlaps`-boosted
>    step do not), the cap face kept beside as GK-C0's upper bound. (ii) THE
>    PRIMARY RULER R1 — THE USER'S FACE: over every CATCH (the `catches it`
>    event with `giveBall` to the keeper), the ball's per-tick displacement
>    on every tick of the OWNED-CAUGHT EPISODE — from the catch tick to the
>    tick AFTER the ball leaves the contact (ABSENT: the tick after the catch;
>    ARMED: the release tick and the one after) — its MAXIMUM per catch,
>    binned on frozen edges (0.1 · 0.3 · 0.5 · 1.0 · 2.0 · 3.0 m); R1 = the
>    share of catches whose maximum exceeds **1.0 m** (a jump the eye sees;
>    GK-C0: mean 1.711552 m, so ABSENT sits high; the ARMED release
>    re-attachment is ≤ `carry` 0.3 by construction) — paired Δ ARMED − ABSENT,
>    DOWN resolved = helpful; GK-C0's cap-based `ballJump.catchShare` and the
>    mean maximum published beside. (iii) THE SEAM'S OWN FACES (published):
>    the release composition (arrival · ownership loss · fresh gain ·
>    substitution/kick-off · the sprite-window clear for parries — counted
>    per catch); the wait length in ticks (bins and mean; the share of waits
>    outliving 42 ticks); the body↔contact distance at release (bins) and the
>    share of releases with the body inside `carry` (the carry-point vs body
>    fork's data); the max ball↔owner distance while waiting; the `gkFeet`
>    catches per match and the share lost within 10 ticks (ABSENT and ARMED
>    both); the claims' ball displacement at the claim tick (unchanged by
>    construction — a receipt); the keeper's RESIDUAL-written ticks by GK-C0's
>    classes on BOTH arms (ARMED must add none — the body is integrated), the
>    save-window pocket read on ABSENT: **H-GK-2** — the share of save-window
>    residual-written keeper ticks that coincide with a restart placement
>    (the engine's own restart state / `resetForKickoff` tick / the line
>    placement, anchored) stored as `pocketIsRestartPlacement` (> 0.5). (iv)
>    GUARDS (F-GK-b; OBM-T1's tolerance form, NI_FRACTION by anchor; breach =
>    resolved AND beyond in the harmful direction): G1 goals per match (BOTH)
>    · G2 saves per match (BOTH) · G3 catch share of saves (BOTH) · G4
>    xG-per-shot conversion (BOTH — the roll is untouched; any move is
>    downstream) · G5 shots per match (BOTH) · G6 `passCompletion` (floor) ·
>    G7 interceptions per match (ceiling) · **G8 the keeper's
>    TIME-TO-DISTRIBUTION** — ticks from the catch to his release kick
>    (ceiling; a longer wait delays play — the real cost) · G9 the keeper's
>    holds per match (both) · G10 the keeper's passes per match (both; the
>    LN-T1′b KEEPER-pass family beside on E14) · G11 offsides in the #157 FLAG
>    form. (v) THE READS — frozen literals on STORED booleans (E13 of record;
>    D13 and E14 agree booleans beside): `r1Down` ∧ ¬`breach` ⇒ *"THE BODY GOES
>    TO THE BALL AND THE CAUGHT BALL STOPS JUMPING — GK-ENTRY is named: world
>    15 = world 14 + the dive door."*; `r1Down` ∧ `breach` ⇒ *"THE JUMP IS GONE
>    BUT A GUARD BREAKS — the guard is named; the commander decides with the
>    table."*; ¬`r1Down` ⇒ *"THE LAW DOES NOT REACH THE EYE — the seam stays
>    dormant; the commander decides with the table."*; BESIDE every read the
>    pocket sentence: `pocketIsRestartPlacement` ⇒ *"THE POCKET IS RESTART
>    PLACEMENT (H-GK-2 holds)."* else *"THE POCKET IS A WRITE IN PLAY — the
>    dominant class is named."*; and the G8 Δ printed beside (the cost, said
>    first). (vi) GATES: the house set (X-DET · X-FP-PROD · X-SRC-UNTOUCHED
>    over src AND tests · SEED-DISJOINT · gN · gFaces off the serialized
>    artifact · gReadWords · gHashOrder · BOOKED = WALKED · LOO · two-fractions
>    · `gStage`) PLUS G-BITE (ABSENT ≠ ARMED on every seed with a catch — the
>    liveness receipt; the flag has no gene so FLAG-HYGIENE is the OFF-vs-HEAD
>    identity, not an armed-zero arm) · gLockstep (the observation byte-inert)
>    · G-REPRO-GKC0 (RE-WALK 12,551,000–011 on E13-ABSENT and match FIELD FOR
>    FIELD every GK-C0 `perSeedCells[].E13` field this exam also computes — the
>    census's own dormancy receipt; the residual faces are NEW and not compared)
>    · gResidualFixtures · gClassesNonVacuous (catches, parries, waits each
>    non-empty per arm, else the read is stated on what exists) · the extracted
>    call graph for the seam's three sites and `giveBall`. (vii) SEEDS: block
>    **12,552,000–999** (N sized by a disclosed 12-seed scratch smoke on
>    900,005,400–411 at a declared 0.05 half-width on R1's paired Δ (E13) —
>    catches are ≈ 0.5 per match, so N will be the block's affordance: say so
>    and publish the MDE at N; receipt 900,005,420; world pin 900,005,470;
>    lockstep 900,005,490–491; band 900,005,400–499); RE-WALKS 12,551,000–011;
>    ZERO stats; registry **81**; freeze-before-sight; §DEVIATIONS required;
>    HONEST LIMITS the ONE home naming THIS doc; the canon set. DOC
>    `GK-T1-DIVE-EXAM.md`; INSTRUMENT `scripts/probes/gk-t1-dive-exam.ts`;
>    ARTIFACT `docs/world-model/data/gk-t1-dive-exam.json`.
> 4. **CONTRACTS**: `GK-KEEPER-BODY-CONTRACT.md` §2 = M-GK.1–3′ complete (the
>    two owner-site sentences corrected to ten/two); §3 gains a STATUS line at
>    the ruling that banks GK-T1. The T0 doc §CORR 1–5 (GK-T0c).
> 5. **THE GATES OF RECORD**: world 12 (open) · world 13 CLOSED KEEP · world 14
>    OPEN (「看见自己人 (v14) — keep | change | revert — <一句人话>」).
> 6. **CONSUMPTION**: GK-T0c consumed no frontier seed. Frontier: next sim ≥
>    **12,552,000** (open to GK-T1; after it ≥ 12,553,000); stats ≥ 117,600;
>    registry 81 at GK-T1's freeze. THE QUEUE: GK-T1 (running) → GK-ENTRY or
>    stop → ③ → ⑤. DEBTS unchanged. ⚠ 953e4be already carried the dormant
>    close 1fd9252 to main (Road B: no visible change).

> **COMMANDER RULING #402 (2026-09-06 — ⭐⭐⭐ GK-T1 BANKED, VERIFIER PASS: THE READ
> OF RECORD ON ALL THREE COMPOSITIONS IS *"THE BODY GOES TO THE BALL AND THE
> CAUGHT BALL STOPS JUMPING — GK-ENTRY is named: world 15 = world 14 + the dive
> door."* — the user's face falls from five catches in six to one in ten, and
> that one in ten is the release tails, not the law; no guard breaks; the cost
> (time to distribution) did not resolve, which is not zero; ONE liveness gate
> honestly RED on a dead-time seed and RULED, not re-scoped ⇒ 🔄 GK-ENTRY
> 「身体跟着手走 · 世界 15」 DISPATCHED):**
>
> 1. **GK-T1 BANKED** (FREEZE `5bffe4e`, RESULTS `07d4e5f`; X-SRC-ZERO; §P and
>    the instrument byte-identical between the commits; block 12,552,000–999
>    consumed whole — 999 seeds × six arms, 6,000 booked = walked; zero stats;
>    registry 81; artifact `data/gk-t1-dive-exam.json.RED.json` 23,725,064 bytes
>    compact; 23 of 24 gates green). Verifier **PASS, zero HIGH** (four MEDIUM,
>    four LOW — disposed at the doc's §COMMANDER CORRECTIONS 1–8, corrections
>    made in the RESULTS sections only; §P untouched). THE NUMBERS OF RECORD
>    (E13 empty-book, paired): R1 `r1.catchMaxOverOneMetreShare` **0.835740
>    (463/554) → 0.104907 (62/591), Δ −0.730833 [−0.770071, −0.691559]**, 18.6
>    half-widths from zero; D13 0.843111 → 0.117733 and E14 0.851724 →
>    0.103679 agree (both resolved DOWN). The mean per-catch maximum 1.692131 →
>    0.644729 m; GK-C0's cap form 0.985455 → 0.018966 (the ABSENT arm reproduces
>    the census's shape). GUARDS: `breach` FALSE on all three compositions;
>    G8 `guard.timeToDistributionTicks` control 353.194605, **Δ +2.738122
>    [−6.924280, +12.052622] — UNRESOLVED** (a 0.05-tick target would need
>    95,891,247 seeds: the cost is not sizeable at this precision by a
>    per-match mean; a per-catch paired ruler is the instrument if it is ever
>    wanted); G4 xG conversion resolved DOWN inside tolerance on E13 (−0.054493
>    on 1.465122) and E14 (−0.050934) — a tolerated downstream move, named;
>    G10 keeper passes resolved on D13 inside tolerance; every other row
>    unresolved; G11 FLAG false. G-REPRO-GKC0 GREEN (60 fields × 12 seeds).
> 2. ⭐⭐ **THE RED GATE, RULED.** `gBite` as frozen ("ABSENT ≠ ARMED whole-match
>    signature on EVERY seed with a catch") failed on ONE D13 catch-seed of 607
>    (12,552,083: the only catch on the last tick before half time; the engine
>    runs `stepRestart` through `halftime`, the waiting branch never executes,
>    the contact dies at `resetForKickoff` — the flag had nothing to bite). The
>    executor reported it RED and did not touch §P; the verifier rebuilt the
>    seed on both arms and stepped them in lockstep: identical tick for tick.
>    The liveness claim survives on the stored-rows witness (547/547 · 607/607
>    · 561/561). RULED: (i) the artifact STAYS at its `.RED.json` path — the
>    name is part of the record; a frozen predicate honestly failed is not
>    renamed after sight; (ii) the reads, selectors, faces and guards are
>    BANKED OF RECORD — the failed conjunct is a liveness receipt whose failure
>    touches none of them and whose mechanism is diagnosed and confirmed;
>    (iii) FORM RULE for G-BITE from here: a liveness receipt exempts the shapes
>    in which the flag has nothing to bite (dead time), or states itself on
>    stored rows — never "every seed" over a population containing dead time.
> 3. **THE COMMANDER'S OWN WRONG EXPECTATIONS, STRUCK**: (i) #401 item 3(i) said
>    the overlap resolver "writes velocity, not position" — FALSE at this head:
>    `resolveOverlaps` writes BOTH, so the RESIDUAL predicate fires on an
>    overlap push (executor disclosed at §DEV-PREFLIGHT before the freeze;
>    verifier confirmed on its own scene). Consequence: the residual faces are
>    markers of overlap pushes and restart placements, not teleports; the
>    `crowded` marker is a marker, not attribution. The SAVE-WINDOW POCKET READ
>    STANDS: `pocketIsRestartPlacement` 0.992461 (333,978 / 336,515) ⇒ **H-GK-2
>    HOLDS — GK-C0's pocket is restart placement**; the only other non-empty
>    class is `saveWindow` 2,537 ticks. (ii) `armedAddsNoResidualWrites` is
>    FALSE on D13 (272,411 → 279,441; TRUE on E13 and E14; the per-match Δ
>    unresolved on all three) — the face counts overlap pushes, which a keeper
>    who now runs to the contact changes; reported as it stands, no universal.
> 4. ⭐⭐ **THE SEAM'S LIMITS, NOW MEASURED** (named in #401 item 2, numbered
>    here): the wait outlives the 0.7 s sprite on **0.819444** of waits (mean
>    82.609375 ticks, median 50, the longest stored 422 — dead time included);
>    the BODY is inside `carry` at only **0.211806** of releases — four in five
>    are granted by the carry point (the body-as-predicate fork would lengthen
>    roughly four waits in five: a held door, its data now real); `freshGain`
>    = **0 of 591** (GK-T0c's release (c) has an in-play population of zero in
>    5,994 matches — defence in depth, measured); `gkFeet` **13 episodes, 0
>    losses** (a tiny denominator, not a safety claim); the claim still snaps
>    (1.388442 → 1.353315 m — not this law's). LABELLED HYPOTHESIS **H-GK-3**
>    (from §CORR 2, the verifier's cross-tab): *under the law the caught ball
>    never jumps on an ARRIVAL release; ARMED's residual R1 is entirely the
>    ownership-loss and restart tails* — PROBE: a STORED release-class ×
>    episode-maximum cross-tab in the next GK instrument. LABELLED HYPOTHESIS
>    **H-GK-4**: *the tolerated G4 move is downstream of the waits' ownership
>    losses (58 of 591 waits end with the ball taken)* — PROBE: goals conceded
>    within N ticks of a wait's ownership loss, both arms. Neither gates
>    anything today.
> 5. ⭐⭐⭐ **GK-ENTRY DISPATCHED — 「身体跟着手走 · 世界 15」 = WORLD 14 + THE DIVE
>    DOOR** (the LN-ENTRY / BQ-ENTRY form; entry layer ONLY; the law has NO dose
>    and NO gene, so the bundle is one door and nothing else). (i) THE BUNDLE
>    in `src/game/a4World.ts`: `GK_WORLD_VERSION = 15 as const`; `GK_WORLD_DOORS
>    = { gkDiveBody: true } as const`; `isGkWorld`; `a4MatchFlags(15) = {
>    ...a4MatchFlags(14), ...GK_WORLD_DOORS }` — CALLING the world-14
>    composition, never copying; `armGkWorld(match, l3Dose, pcDose)` =
>    `armLnWorld(match, l3Dose, pcDose)` and nothing more; `gkArmedVersion
>    (match)` = 15 iff `lnArmedVersion(match) === 14` AND `match.gkDiveBody`,
>    else 0; the union gains 15; the URL parser accepts 15 and its bound moves
>    to 16; `armA4World`'s branch for 15; `a4ArmedVersion` reads 15 first
>    (containment-ordered). ⛔ ONE DOOR, NOTHING ELSE: no `obmMovement`, no
>    `ctbSupportPlane`, no `rcAnticipate`/`rcReady`, no `bfFacingCost`, no
>    `edsTouchCost` — each pinned ABSENT from `a4MatchFlags(15)` and below.
>    (ii) THE HONEST BRIEF — three surfaces, every number a GK-T1 FIELD at
>    6 dp, E13 the effect of record and D13 (the played form) MEASURED this
>    time: badge `A4_BADGE_TEXT_GK = '🧪 身体跟着手走 · 剂量成熟'` /
>    `_EMPTY = '🧪 身体跟着手走 · 空账本(全新手)'`; the settings checkbox 「身体跟着手走
>    · 门将扑到球,球停在手上等身体到 (play-test)」 with the long plain-Chinese
>    blurb: WHAT IT DOES (上面那个世界 v14 再加一扇门：门将扑到球的那一刻，球不再瞬间跳到他
>    脚下——球停在他手碰到的地方，他的身体跑过去接上；扑出去的球只动身体不动球；没有新常数,
>    他跑过去的速度就是他的跑速)；THE COST, SAID FIRST (从接球到出球的时间 `guard.
>    timeToDistributionTicks`：对照 353.194605 帧，差 +2.738122 帧，区间 [−6.924280,
>    +12.052622] 含零——没量出变慢，但也不是零；等球的那段：身体跑到球那里平均 `wait.
>    meanTicks` 82.609375 帧，其中 `wait.shareOver42Ticks` 0.819444 比 0.7 秒的扑救动画
>    更长——你会看到球停着、门将跑过去；等的时候球被对手抢走的次数 `release.ownershipLoss`
>    58 次，接球 591 次（E13 空账本）；xG 转化 `guard.xgConversion` 对照 1.465122，差
>    −0.054493，区间不含零但远在容差内——进球对射门质量的换算略降，照实说)；THE MEASURED
>    WIN (接住的球在门将手里那段、单帧跳超过 1 米的比率 `r1.catchMaxOverOneMetreShare`：
>    空账本 0.835740 → 0.104907；你玩的这一档 0.843111 → 0.117733；剩下那一成是等球时被抢
>    走或死球重置那一帧算进去的，不是法则还在跳——上限)；THE GUARDS (进球、扑救、接球率、
>    射门、传球成功率、被断、门将持球与出球次数都没破护栏)；THE FIRST-LOOK DISCLOSURE (高球
>    没收那一下还是会跳 `claim.meanNextDisplacementMetres` 1.388442 → 1.353315 m——不是这
>    扇门的事；扑救动画还是原来的 0.7 秒，渲染没改；禁区外用脚接住的球没有保护圈；⚠ 联赛后
>    台快速模拟的比赛跑的是原版世界); the feed blurb in BOTH dose forms in `GameApp.ts`
>    quoting each arm's OWN fields (E13 under 空账本, D13 under 成熟账本). PLUS the
>    deferred v14 addition (#398 item 1(ii)): ONE sentence in the world-14
>    blurbs that the own-lane door also prices the keeper's distribution,
>    quoting LN-T1′b's KEEPER-pass field by name — the executor names the field.
>    (iii) HOW-TO-SEE (BINDING, plain Chinese): 门将扑救那一刻——球是不是还瞬移到他脚下；
>    扑住之后——球停在原地、门将跑过去接，还是像以前一样球飞到他身上；代价——他出球是不是慢了
>    一拍；对比对象是 v14，同一台设备，`?a4world=15` 对 `?a4world=14`。 (iv) THE PINS
>    `tests/gkPlaytestEntry.test.ts` in the lnPlaytestEntry form: FIDELITY
>    (`a4MatchFlags(15)` deep-equals `{...a4MatchFlags(14), gkDiveBody: true}`;
>    a world-15 match reads `gkDiveBody` true, `lnArmedVersion` 14,
>    `gkArmedVersion` 15, the LN gene 0.25 on base and eff both sides,
>    `info.genome` clean, at construction and full time; the EXAM's E14-ARMED
>    construction reproduced — the exam's way (`a4MatchFlags(14)` + `gkDiveBody:
>    true` + `armA4World(m, null, 14, …)`) vs the entry's way (`a4MatchFlags(15)`
>    + `armA4World(m, null, 15, …)`) identical whole-match signatures on ≥ 6
>    scratch seeds; the absent doors absent) · CONTAINMENT (15 never reads 14;
>    14 never reads 15; the chain 15 → 14 → 13 → 12 → 11) · URL (15 parses; 16
>    rejected) · BADGE both dose forms · THE HONEST BRIEF's 6-dp strings pinned
>    to the surface that claims them, each arm's number under its own heading ·
>    IDENTITY BELOW 15 (pooled digests for the bare world, 12, 13 AND 14 on ≥ 12
>    scratch seeds equal digests RECORDED FIRST at the dispatch HEAD `07d4e5f`
>    in a clean worktree; the fingerprint 57b0bdab389122af5e4cacd75c4e13020b8f
>    f248a413a7fcd71cc6215ba4c673 unchanged) · DORMANCY (worlds 1–14 carry no
>    `gkDiveBody`; `League.toJSON` omits matchFlags) · LIVENESS in the #402 item
>    2(iii) form (world 15 ≠ world 14 signature on ≥ 1 of ≥ 12 scratch seeds
>    with a catch — the dead-time exemption STATED, never "every seed") · THE
>    MUTANT WALK (the door removed from `GK_WORLD_DOORS`; the composer calling
>    `a4MatchFlags(13)` instead of 14; the URL bound not moved; `a4ArmedVersion`
>    reading 14 before 15 — each killed by a named pin) · NARROWED PINS listed
>    positively (DF-T0 §P7 form). (v) §NO NEW CHUNK / §THE COST FACE on two
>    clean-tree builds, in BYTES never filenames (#397 item 3). (vi) THE DOC
>    `GK-ENTRY-RUNG.md` in LN-ENTRY's sections; §3 THE SURFACES exactly the four
>    entry files + the pin suite, ZERO files under src/sim, src/ai,
>    src/evolution, scripts/; the default landing world 0 BEFORE and AFTER;
>    §HONEST LIMITS the ONE home (the wait outlives the sprite 0.819444; the
>    carry-point predicate 0.211806; `gkFeet` unprotected; the claim still
>    snaps; ARMED's R1 an upper bound; G8 unresolved; G4 tolerated; one world
>    one composition; the dive is capped at running speed); §ROAD B; §NEXT the
>    user gate 「身体跟着手走 (v15) — keep | change | revert — <一句人话>」 then ③.
>    Scratch 900,005,600–699 (executor) / 900,005,700–799 (verifier); ZERO
>    frontier; ONE commit; never push.
> 6. **CONTRACTS**: `GK-KEEPER-BODY-CONTRACT.md` §3 STATUS #402 written. The
>    T1 doc §CORR 1–8.
> 7. **THE GATES OF RECORD**: world 12 (open) · world 13 CLOSED KEEP · world 14
>    OPEN (「看见自己人 (v14) — keep | change | revert — <一句人话>」) · world 15
>    OPENS at GK-ENTRY's deploy.
> 8. **CONSUMPTION**: GK-T1 consumed 12,552,000–999 whole. Frontier: next sim ≥
>    **12,553,000**; stats ≥ 117,600; registry **82** for the next instrument.
>    THE QUEUE: GK-ENTRY (running) → ③ (retire the designations; LN-T1's ABSENT
>    arm its control) → ⑤ (the truth-reads cut) last. DEBTS: unchanged + H-GK-3
>    / H-GK-4 probes (the next GK instrument) + the G-BITE form rule to carry.

> **COMMANDER RULING #403 (2026-09-06 — ⭐⭐⭐ GK-ENTRY 「身体跟着手走 · 世界 15」
> BANKED, VERIFIER PASS: WORLD 15 = WORLD 14 + THE DIVE DOOR IS CUT — one flag,
> no gene, no constant; every world below 15 byte-identical to the dispatch
> head; world 15 IS the exam's construction; the honest brief says the cost
> first and now says what the wait contains; nothing ships by default ⇒ THE
> USER GATE OPENS AT THIS PUSH: 「身体跟着手走 (v15) — keep | change | revert —
> <一句人话>」; ③ (retire the designations) is specified next):**
>
> 1. **GK-ENTRY BANKED** (commit c5f1a29 — 4 entry files + the pin suite
>    `tests/gkPlaytestEntry.test.ts` (27 pins) + 25 positive narrows across 11
>    suites + the rung doc; ZERO files under src/sim, src/ai, src/evolution,
>    scripts/; `npm test` 2,195 green at the committed bytes (the executor's
>    run and the verifier's, independently); typecheck clean; fingerprint
>    UNCHANGED; the default landing world 0 before and after; ZERO frontier
>    seeds). Verifier **PASS, zero HIGH** (three MEDIUM, six LOW — disposed at
>    the rung doc's §COMMANDER CORRECTIONS 1–10; three user-facing strings, one
>    test comment and five doc sentences corrected in place by the commander;
>    typecheck clean and the three touched suites green after the edits). THE
>    BUNDLE: `GK_WORLD_VERSION = 15`, `GK_WORLD_DOORS = { gkDiveBody: true }`,
>    `a4MatchFlags(15) = { ...a4MatchFlags(14), ...GK_WORLD_DOORS }` (called),
>    `armGkWorld = armLnWorld` and nothing more, `gkArmedVersion` by
>    containment (15 ⊃ 14 ⊃ 13 ⊃ 12 ⊃ 11, the source order itself pinned),
>    the URL bound 16. IDENTITY: four digests recorded at `a5a6b73` in a clean
>    worktree (src-identical to `07d4e5f`) and re-computed identical at the
>    commit — the verifier's own band agrees; world 15 non-vacuous. FIDELITY:
>    the exam's E14-ARMED construction reproduced on both construction paths
>    (the probe's `new Match` and the app's `League.createMatch`). THE COST
>    FACE in BYTES: +6,529 B (+0.4515 %) raw, every install; no opt-in cost;
>    precache 19 → 19 as a set (the order is content-hash-dependent — struck).
>    LIVENESS in the #402 item 2(iii) form (≥ 1 of 12 scratch seeds; the
>    dead-time exemption stated in the test's own comment).
> 2. ⭐⭐ **THE HONEST BRIEF OF RECORD** (three surfaces, every number a GK-T1
>    field at 6 dp, each arm under its own heading — 12 E13 tokens on the
>    empty-book line, 10 D13 tokens on the mature line, none crossed): the
>    cost FIRST (G8 353.194605 / +2.738122 [−6.924280, +12.052622] 含零 —
>    "没量出变慢,但也不是零"; the wait 82.609375 ticks, 0.819444 over the sprite
>    — now with 「(含哨响前接住、死球期间挂着的那些帧)」; the loss 58 of 591; G4
>    −0.054493 tolerated), the win (0.835740 → 0.104907 empty-book; 0.843111
>    → 0.117733 the played form — an UPPER BOUND, said), the guards, the
>    first-look disclosure (the claim still snaps 1.388442 → 1.353315 m; the
>    sprite unchanged; `gkFeet` unprotected; the league-worker caveat), and
>    HOW-TO-SEE on the settings blurb, both feed lines and §4. The settings
>    cost block now opens with its arm frame 「(以下代价数字来自 E13 空账本臂…)」.
>    THE DEFERRED WORLD-14 SENTENCE landed on the v14 settings blurb and both
>    v14 feed lines: 「这扇门也给门将的出球定价:门将传球的账本行数 499 → 454 …—— 他出球会
>    少一点」 (LN-T1′b `ledgerJoin.ledgerRowShareByFamily.ABSENT/W025.KEEPER-pass.
>    denominator`; nothing about holds claimed).
> 3. **RATIFIED**: §DEVIATIONS 1–9 (the artifact's key `wait.overSpriteShare`;
>    the mature line printing D13's OWN cost — required by "each arm its own
>    fields"; comments reworded rather than the `gkDiveBody` allowlist widened;
>    the baseline at `a5a6b73`; counts not percentages). FAMILY RULE (from
>    §CORR 4): a cost face records RAW bytes; a gzip figure, if printed, is
>    labelled commit-dependent. The commit-on-main convention stated.
> 4. ⭐⭐⭐ **THE GATE**: 「身体跟着手走 (v15) — keep | change | revert — <一句人话>」
>    at `?a4world=15` vs `?a4world=14`, same device. WHAT THE EYES ARE FOR (§4,
>    binding): 门将扑救那一刻——球是不是还瞬移到他脚下;扑住之后——球停在原地、门将跑过去接,还
>    是像以前一样球飞到他身上;代价——他出球是不是慢了一拍. THE LIKELIEST 「change」 and
>    its answer, said now: the wait outliving the sprite (0.819444) — the fix
>    is the HELD body-as-predicate fork or a dive IMPULSE (a new constant),
>    not this entry (#402 item 4). World 14's gate stays open beside it.
> 5. **CONSUMPTION**: zero. Frontier unchanged: next sim ≥ 12,553,000; stats ≥
>    117,600; registry 82. THE QUEUE: ③ (retire the designations — its CENSUS
>    specified at #404 after the code read) → ⑤. DEBTS unchanged (+ the
>    `formationEvolution` budget still live: 144.09 s alone against 180 s).
>    ⚠ THIS PUSH deploys world 15 (Road B: the default landing world 0; the
>    door reached only via `?a4world=15` or the checkbox).
