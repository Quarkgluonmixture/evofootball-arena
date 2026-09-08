# PROGRAMME — Commander rulings (verbatim; LIVE FILE, #408 onward)

> This file holds commander rulings **#408 onward, verbatim**, APPENDED in numeric
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
> #398–#407 (the GK arc → world 15 → ③ opened: DS-C0/T0/T1/T0b) in
> [`PROGRAMME-RULINGS-ARCHIVE-398-407.md`](PROGRAMME-RULINGS-ARCHIVE-398-407.md)
> (the unnumbered 2026-07-24 ruling remains in `PROGRAMME.md`'s context block).
> **Resume = `tail -n 120` of THIS file.** Find any ruling by number:
> `grep -n "RULING #N " docs/world-model/PROGRAMME-RULINGS*.md`. Rotation rule:
> ~1,500 lines ⇒ rotate the closed era in the same round as a ruling (#303 item 2).
> **COMMANDER RULING #408 (2026-09-08 — ⭐⭐⭐ DS-T0b 「自己的前插 · 约束」 BANKED-DORMANT,
> VERIFIER PASS: the coach's two restraints now live in the player as things he
> can see — his side's count as a shared prior, read against how many mates his
> own eyes say are already running, and the licence's condition read off the
> perceived ball's owner; no new constant, no truth read, zero pulls with the
> flag absent, OFF byte-identical in five worlds; THE RULINGS FILE ROTATED
> (#398–#407 → ARCHIVE) ⇒ 🔄 DS-T1b 「自己的前插 · 复考」 DISPATCHED with a dose
> that actually prices the run):**
>
> 1. **DS-T0b BANKED-DORMANT** (commit 9a056b0 — `src/ai/PlayerBrain.ts` the
>    own-run block amended; `src/ai/TeamBrain.ts` the count code-moved as the
>    exported pure `runnerCount(mode, tempo, urgency)`, the shipped call site
>    calling it; `tests/dsOwnRun.test.ts` 31 → 61 pins, nothing loosened, five
>    narrows listed positively; the seam doc §LAW-B / §HONESTY-B / §SEAM-B /
>    §PINS-B / §DEVIATIONS-B; the contract M-DS.6–7; ZERO bytes in Match.ts,
>    League.ts, offballEyes.ts, the executor, perceptionSnapshot.ts, mechanics;
>    no new flag, gene or constant; `npm test` green on the serial re-run (the
>    verifier's note of record: a full suite run concurrently with anything
>    else on this machine shows up to nine wall-clock timeouts that are not
>    behaviour changes — RUN IT SERIALLY); typecheck clean; fingerprint
>    UNCHANGED; ZERO frontier seeds). Verifier **PASS, zero HIGH** (three
>    MEDIUM, three LOW — disposed at the seam doc's §COMMANDER CORRECTIONS-B
>    1–7; two test TITLES corrected by the commander to what the pins prove,
>    the suite 61/61 green after): its own OFF digests at the dispatch head
>    reproduced at the commit in bare · 13 · 15 with the rng draw in the hash;
>    `perceivedSnapshot` instrumented in a worktree — ZERO pulls attributable
>    to the fork with the flags absent, the declared second pull only when
>    seat and flag are both armed; the born shape exact (`===`): nobody
>    running ⇒ `W.runScore · prior`; `count` mates at the observer's top speed
>    ⇒ 0; half ⇒ ×0.5; 5× ⇒ still 0; the truth-vs-eyes disagreement built both
>    ways and the run FOLLOWING THE EYES; `runnerCount` on 250 grid cells = the
>    recorded expression; five mutants dead with the executor's exact counts
>    and a sixth added.
> 2. ⭐⭐ **THE LAW OF RECORD (M-DS.6–7, under the same flag)**: `snapshot =
>    match.perceivedSnapshot(p)` (null ⇒ no candidate); the own run only when
>    `snapshot.ball.ownerGid` is a roster mate other than himself;
>    `runningMates = Σ` over roster mates (not himself, not the perceived
>    carrier, not the keeper, not sent off) of `clamp01(body.vel.x ·
>    team.attackDir ÷ p.topSpeed)` read off the SNAPSHOT's copy of the mate;
>    `restraint = clamp01(1 − runningMates ÷ runnerCount(mode, tempo,
>    urgency))`; `s = (W.runScore · prior) · restraint`, `× OFFBALL_TIRED_MUL`
>    if tired, `× obmRunMul` — the no-running-mates case EXACTLY DS-T0's number
>    in IEEE-754. THE READ SET: the snapshot's ball owner and its bodies' gid ·
>    side · vel; his own pos · role · gid · topSpeed · wallRun · index ·
>    stamina; the ROSTER by gid (role · side · sentOff — the team sheet and the
>    referee's card, declared shared knowledge); the board for the not-hatted
>    guard; the count's inputs (mode · tempo · urgency — the shared convention);
>    `W.runScore`, `obmRunMul`, `simTime`. ⛔ NOT `match.ball`, NOT `.owner`,
>    NOT any body's truth pos/vel, NOT `pendingPass`, NOT `info.genome` —
>    pinned in source (an exact member-set assertion) AND in behaviour.
> 3. ⭐⭐ **THE HONEST FINDINGS OF RECORD**: (i) ⚠⚠ THE OWN RUN NOW NEEDS EYES —
>    `refreshPerception` is gated on the percept trunk, so in a world with no
>    trunk the snapshot is null and the candidate never exists; every exam
>    substrate (world 13 and the A4 family) arms the trunk; the bare world's
>    reach is gone and PINNED positively. (ii) ⚠ THE DISPATCH'S SENTENCE WAS
>    WRONG — `ObservedPlayer` carries no `sentOff`; the trunk DELETES sent-off
>    bodies from perception memory; the law's conjunct reads the roster (the
>    commander's error, corrected at source, not smoothed). (iii) G-OFF CANNOT
>    SEE AN UNGATED IDEMPOTENT PULL (the dispatch predicted it would kill
>    mutant M9; measured, it does not); the gating claim rests on the PULL
>    COUNTER — a form lesson for every percept-reading seam. (iv) The
>    stale-eyes limit: a mate's run seen late enters as seen, an unseen run
>    counts as no running — a body with bad eyes restrains himself LESS;
>    declared, pinned as behaviour. (v) THE "ONLY LAWFUL FORM" CLAIM WAS FALSE
>    (§CORR-B 1): the shared snapshot was reachable through the exported
>    `obmFeatures` / `obmPolicyOf` without touching `offballEyes.ts`; RULED:
>    the second-pull form is KEPT (idempotent, rng-free, the OBM pull
>    structurally first) and the option recorded.
> 4. **HYPOTHESES CARRIED**: H-DS-3 — *the perceived restraint holds the coach's
>    count without the coach* (probe: DS-T1b's R1 on OWN); H-DS-4 — *withdrawing
>    the in-flight run costs the through-ball gain* (probe: G9 and the yield
>    pair); H-DS-2 — *the eyes price the crowded run down* (probe: the
>    RUN-CAUTION corner). The run onto a ball in flight is the named next
>    slice (a non-claim in the contract's §4).
> 5. ⭐⭐⭐ **DS-T1b DISPATCHED — 「自己的前插 · 复考」 THE OWN-RUN EXAM RE-RUN** (a T1
>    exam; X-SRC-ZERO; DS-T1's instrument INHERITED with the three paid debts
>    kept paid; definitions re-frozen at §P). (i) ARMS, paired on shared seeds,
>    TWELVE walks per seed: on E13 (world 13 empty-book — ③'s control) HATS ·
>    HATS + OWN · OWN, EACH with the OBM seat ABSENT · DOSED AT **RUN-CAUTION**
>    · DOSED AT **KITCHEN-SINK**; on D13 the three seat-absent arms beside.
>    RUN-CAUTION = a hand-set PROBE CORNER in OBM-T1's own idiom,
>    `matrix([O_RUN, F3, MIN], [O_RUN, F2, MIN])` — `targetCongestion` and
>    `ownMarker` price the run DOWN at the domain minimum, the plane rows zero
>    — declared a probe, NOT a dose of record (the dose space is selection's,
>    #390); KITCHEN-SINK byte-copied from obm-t1-policy-exam.ts (the ceiling
>    probe); both re-derived slot for slot from the `OBM_*` exports (G-DOSE-
>    COPY); written on `baseGenome` AND `effGenome`, never `info.genome`. THE
>    ARM OF RECORD for the reads is OWN-seat-absent; "dosed" in the reads =
>    RUN-CAUTION; KITCHEN-SINK's counterfactual word stored beside. (ii) R1,
>    THE BAND, THE FACES exactly as DS-T1 (#406 item 5(ii)–(iv)) PLUS the
>    seam's new faces on the OWN arms: the `restraint` distribution (frozen
>    bins over [0, 1]; the share exactly 0 and exactly 1), the `runningMates`
>    distribution, the perceived-owner guard's pass share (own-run candidates
>    present per unhatted off-ball decision tick), the in-flight and restart
>    own-run shares (expected ≈ 0 by construction — stored, not claimed), the
>    seat's `runMul` distribution on the dosed arms with its noise floor beside
>    (DS-T1's back-out, by anchor). (iii) THE READS — #406 item 5(v)'s four
>    literals RE-FROZEN VERBATIM with the precedence unchanged, "dosed" =
>    RUN-CAUTION; BESIDE every read: H-DS-3's number (R1's Δ on OWN vs HATS
>    against DS-T1's +1.248030 — printed, no verdict word), H-DS-4's number
>    (G9's Δ against DS-T1's +2.787788 — printed), the HATS + OWN arm's words,
>    the yield pair, the coupling sentence, the per-state line. (iv) GATES: DS-
>    T1's set PLUS G-REPRO-DST1 (RE-WALK 12,554,000–011 on HATS-E13-absent —
>    the seam's OFF path — FIELD FOR FIELD against docs/world-model/data/
>    ds-t1-own-run-exam.json `perSeedCells[]` for that arm; a mismatch is RED)
>    · gCodeFactGraph (the six pushes classified as at DS-T1; the flags' read
>    forks equal to the seam doc's updated inventory; `runnerCount`'s two call
>    sites hashed; the block's `match`-member set equal to the seam doc's read
>    set) · gPullCount (the observation adds no percept pull — observed ≡
>    unobserved signatures AND the fork's pull count equal in both, by the
>    counter idiom). (v) SEEDS: block **12,555,000–999** (N by a disclosed
>    12-seed smoke on 900,006,600–611 at a declared 0.05 half-width on R1's
>    paired Δ (OWN vs HATS, seat absent) and on `passCompletion`; N = min
>    (required, the affordance) — say which; receipt 900,006,620; world pin
>    900,006,670; lockstep 900,006,690–691; fixtures 900,006,699; band
>    900,006,600–699); RE-WALKS 12,554,000–011; ZERO stats; registry **84**;
>    freeze-before-sight; §DEVIATIONS required; HONEST LIMITS the ONE home;
>    the canon set. DOC `DS-T1B-OWN-RUN-EXAM-RERUN.md`; INSTRUMENT
>    `scripts/probes/ds-t1b-own-run-exam.ts`; ARTIFACT
>    `docs/world-model/data/ds-t1b-own-run-exam.json`. Wall: twelve arms ≈ 25
>    min; the full test suite is not this stage's.
> 6. **THE ROTATION (#303 item 2)**: rulings **#398–#407** moved byte-verbatim
>    (cmp-verified) to `PROGRAMME-RULINGS-ARCHIVE-398-407.md`; the live file
>    holds **#408 onward**; ten ARCHIVE files; the PROGRAMME.md resume pointer
>    updated.
> 7. **CONTRACTS**: `DS-DESIGNATION-CONTRACT.md` STATUS #408. The seam doc
>    §CORR-B 1–7.
> 8. **THE GATES OF RECORD**: world 12 (open) · world 13 CLOSED KEEP · world 14
>    OPEN · world 15 OPEN.
> 9. **CONSUMPTION**: DS-T0b consumed no frontier seed. Frontier: next sim ≥
>    **12,555,000** (open to DS-T1b; after it ≥ 12,556,000); stats ≥ 117,600;
>    registry 84 at DS-T1b's freeze. THE QUEUE: DS-T1b (running) → DS-ENTRY /
>    OBM-T2 / a further slice / stop → DS-T2 → ⑤.

> **COMMANDER RULING #409 (2026-09-08 — ⭐⭐⭐ DS-T1b 「自己的前插 · 复考」 BANKED: THE
> READ OF RECORD IS *"A GUARD BREAKS — the guard is named; the commander decides
> with the table."* — the guard is through balls, and it breaks DOWNWARD: the
> restraint did not tame the flood, it drained it — the player's own run is
> now a quarter of the coach's designations and the through ball goes with it;
> the eyes at a dose that prices the run really price it down (measured as a
> face — the read for it is unreachable once the flood is gone, a fact about
> the commander's rule); the verifier failed the stage on two sentences and
> confirmed every number ⇒ THE COMMANDER DECIDES WITH THE TABLE: the velocity
> restraint was the wrong decentralisation of the coach's rule; the coach
> RANKED, he did not weigh motion ⇒ 🔄 DS-T0c 「自己的前插 · 排位」 THE RANK SLICE
> DISPATCHED):**
>
> 1. **DS-T1b BANKED** (FREEZE `f920bdf`, RESULTS `aedabfe`; X-SRC-ZERO; §P and
>    the instrument byte-identical; block 12,555,000–999 consumed whole — 999
>    × twelve arms, 12,000 booked = walked; zero stats; registry 84; 24/24
>    gates, `allGreen` true; artifact 63,456,092 bytes at the canonical path).
>    Verifier **FAIL on two PROSE highs** — a false universal in §HONEST LIMITS
>    12 (four LOO-flipping rows, not two — the unnamed pair the more fragile)
>    and a verdict sentence on the H-DS-2 face in §R6 — both struck in place
>    (§COMMANDER CORRECTIONS 1–2); four MEDIUM and four LOW disposed (§CORR
>    3–7): the measurement reproduced under the verifier's own re-derivation
>    of every face and every arm, both doses slot for slot from the exports,
>    RUN-CAUTION pricing runs down through the engine's own seat (616 of 688
>    own-run candidates below 1), three G-REPRO seeds re-walked, 148 anchors
>    and both node hashes recomputed, the body hash reproduced. The seam
>    doc's §SEAM fork line numbers, stale since DS-T0b's code-move, refreshed
>    by the commander (2203 · 323 · 343).
> 2. ⭐⭐⭐ **THE NUMBERS OF RECORD (E13, seat absent; OWN vs HATS, paired)**: R1
>    executed runs per in-possession open-play team-tick **0.585428 → 0.138356**
>    (Δ −0.447072 [−0.455245, −0.438472]; tolerance 0.161763; 53 half-widths;
>    RESOLVED DOWN — `floods` FALSE on all eight contrasted arms); ticks with ≥
>    3 runners 0.014271 → 0.004814; the coach's designations per in-possession
>    tick 1.517503 → 0.200235 (the arriver and the corner/cross branches only;
>    `openPlayBoardEmpty` TRUE). THE BAND: **G9 through balls 6.156156 →
>    2.133133** (Δ −4.023023 [−4.251251, −3.823824] vs tolerance 1.701043) —
>    BREACH DOWNWARD on every OWN arm (RUN-CAUTION −4.460460; KITCHEN-SINK
>    −4.964965; D13 −5.242242); goals, shots, xG conversion, completion,
>    interceptions, possession, passes, mean aim distance HOLD; the offside
>    FLAG NOT raised anywhere (Δ −0.414414, resolved DOWN). THE ADDITIVE ARM
>    (HATS + OWN): `floods` FALSE (+0.047939), `holdsBand` TRUE with an EMPTY
>    breach set at all three seat states — band-safe, but it retires nothing.
>    THE SEAM'S FACES (arm of record): `restraint` mean 0.570614, EXACTLY 0 on
>    0.191379 and EXACTLY 1 on 0.203871 of own-run candidates; `runningMates`
>    mean 0.497094 (censored 0.191379); the perceived-owner guard passes on
>    0.216197 of unhatted off-ball ticks (a floor); `count` 1 / 2 / 3 =
>    0.467647 / 0.517974 / 0.014378; own runs won with the ball IN FLIGHT
>    **0.100272** (not zero — the guard reads the PERCEIVED owner; the state
>    classifier the truth: stale eyes, measured) and at the restart 0.001333.
>    THE YIELD PAIR (no verdict word): own 0.037533 shots per episode (1,401 ÷
>    37,327) vs the runner hat's 0.127490 (1,632 ÷ 12,801); goals 0.009966 vs
>    0.052027. THE COUPLING REVERSED: overlap designations 3.094094 → 4.211211
>    and wall-pass fires 10.438438 → 11.632633, both resolved UP (DS-T1: both
>    DOWN). BY ROLE: DF 0.019029 (the coach's 0.005474 — the DF clamp bites
>    less than the coach's ranking), WG 0.468922, ST 0.455527. THE EYES:
>    `runMulLic` below-1 share **0.901426** at RUN-CAUTION and 0.973108 at
>    KITCHEN-SINK against an EXACTLY-ZERO floor on every seat-absent arm —
>    H-DS-2's dose reaches the run.
> 3. ⭐⭐⭐ **THE TABLE, DECIDED.** (i) H-DS-3 (the perceived restraint holds the
>    coach's count) is NOT supported in the form built: the flood is gone and
>    OVERSHOT — the own run is a quarter of the coach's, and its yield per
>    episode is a third of the hat's. (ii) H-DS-4 (withdrawing the in-flight
>    run costs the through-ball gain) is supported and then some: G9 fell 65 %
>    below the coach's level. (iii) H-DS-2 is MEASURED AS A FACE (the eyes
>    price the run at RUN-CAUTION) but has NO READ: read 2's branch requires
>    `floods(OWN, absent)` first, so once the flood is gone the rule cannot
>    reach it — a fact about the commander's precedence, recorded, not
>    re-lawed here. (iv) THE DIAGNOSIS (the commander's, labelled): the coach
>    restrained the run by a RANKED SELECTION — the top `count` bodies by
>    `RUN_ROLE_W[role] + localX/45` were licensed, all others not — and DS-T0b
>    decentralised it as a VELOCITY MASS: every body discounted by how much
>    forward motion he perceives, which the whole team's advance supplies
>    whether or not anyone is "running in behind" (mean restraint 0.57; a fifth
>    of candidates priced to exactly 0), on top of the perceived-owner guard
>    withdrawing the in-flight run (DS-T1's 0.542593 → 0.100272). The two
>    together drain the run. The player-side equivalent of the coach's rule is
>    his RANK among the mates he perceives, by the shared convention — not the
>    motion he sees. LABELLED HYPOTHESES: **H-DS-5** — *the rank restraint
>    reproduces the coach's band (R1 within tolerance of HATS, G9 within
>    tolerance) without the coach* (probe: DS-T1c's R1 and G9 on OWN); **H-DS-6**
>    — *with the rank restraint the eyes' price (RUN-CAUTION) moves R1 down
>    inside the band rather than draining it* (probe: DS-T1c's RUN-CAUTION OWN
>    arm). (v) THE ADDITIVE ARM is noted, not chosen: band-safe, but a hat kept
>    is not a hat retired (M-DF.2).
> 4. ⭐⭐⭐ **DS-T0c DISPATCHED — 「自己的前插 · 排位」 THE RANK SLICE** (a T0 seam
>    amending DS-T0b's law under the SAME flag `dsOwnRun`; src edits in NAMED
>    files only; dormant; the DS-T0b form with a §LAW-C). (i) **M-DS.6″ — THE
>    RANK RESTRAINT REPLACES THE VELOCITY MASS**: for each PERCEIVED same-side
>    body in his own snapshot that resolves by gid to a roster mate who is not
>    himself, not the perceived carrier, not the keeper, not sent off, compute
>    the SHARED-CONVENTION RANKING the coach uses — `RUN_ROLE_W[mate.role] +
>    team.localX(body.pos.x) / RUN_DEPTH_DIV` (the role from the roster, the
>    position from the SNAPSHOT's copy) — and his own `RUN_ROLE_W[p.role] +
>    team.localX(p.pos.x) / RUN_DEPTH_DIV`; `rankAbove` = the count of such
>    mates whose ranking exceeds his, ties broken as the coach breaks them
>    (`a.p.index − b.p.index`: the LOWER roster index ranks higher — a mate with
>    an equal score and a lower index counts as above him); `restraint =
>    clamp01(count − rankAbove)` — EXACTLY the coach's `scored.slice(0, count)`
>    expressed as a cap: 1 for the top `count` bodies he can see, 0 for the
>    rest; no new constant (`count` = `runnerCount(mode, tempo, urgency)` as
>    moved at T0b; the ranking is the coach's own expression, code-moved as
>    ONE exported pure function `runRank(role, localX)` used by BOTH the shipped
>    `assignRunners` map and the player — the shipped `.map` calls it or keeps
>    its byte-identical expression with a source pin, the DS-T0b idiom). The
>    velocity-mass term (`runningMates`) is REMOVED — recorded as the measured
>    over-correction, not kept beside. (ii) **M-DS.7 UNCHANGED** — the
>    perceived-owner guard stays (the state condition is the coach's; the
>    in-flight run remains the named next slice). (iii) THE READ SET: the
>    snapshot's ball owner and its bodies' gid · side · pos (no longer vel);
>    his own pos · role · gid · index · topSpeed no longer needed (say so);
>    the roster by gid (role · side · sentOff · index); the board for the
>    not-hatted guard; the count's inputs; `team.attackDir` through `localX`;
>    `W.runScore`, `obmRunMul`, `simTime`, `dsOwnRun`. ⛔ NOT `match.ball`, NOT
>    another body's truth pos, NOT `pendingPass`, NOT `info.genome`. (iv)
>    HONESTY: the stale-eyes case (an unseen mate does not outrank him — a body
>    with bad eyes ranks himself higher; a stale position ranks a mate where he
>    WAS); the convention's literals still hand-written (moved, not grown); the
>    step form is the coach's own `slice` — its softening (a continuous rank
>    weight) is a later slice; H-DS-5 / H-DS-6 as labelled hypotheses. (v)
>    PINS extended in `tests/dsOwnRun.test.ts` (existing kept; the velocity-
>    mass pins RETIRED positively — listed as narrows with the reason, the
>    term is gone): G-OFF unchanged (digests re-recorded at the dispatch head
>    in bare · 13 · 15; the fingerprint); G-BORN‴ (armed, seat absent: no
>    perceived mate outranking him ⇒ `W.runScore · prior`; `count` perceived
>    mates outranking him ⇒ 0; `count − 1` ⇒ full; a tie at equal score
>    resolved by index both ways; the perceived carrier and the keeper never
>    counted; a mate whose TRUTH position outranks him but whose PERCEIVED
>    position does not ⇒ not counted — the eyes rule); `runRank` equals the
>    shipped expression on a grid of roles × localX and the shipped map calls
>    it (source pin); the pull count unchanged (0 · 1 · 1 · 2); the read set's
>    exact `match`-member / `body.` / `mate.` sets; the mutant walk (the rank
>    read from truth pos; ties broken the other way; himself counted; the
>    count dropped; the cap made continuous by a typed divisor); NO velocity
>    read remains in the block (a source pin). SRC EDITS ONLY IN
>    `src/ai/PlayerBrain.ts` (the block), `src/ai/TeamBrain.ts` (the ranking
>    code-move), `tests/`; ZERO files elsewhere. (vi) DOCS: the seam doc gains
>    §LAW-C / §HONESTY-C / §SEAM-C (the READ-FORK INVENTORY refreshed with the
>    measured line numbers) / §PINS-C / §DEVIATIONS-C; the contract's §2
>    M-DS.6″ replacing M-DS.6 (the velocity form recorded as superseded, with
>    DS-T1b's numbers by field), §3 the arc (DS-T1c next: DS-T1b's instrument
>    with `rankAbove` replacing `runningMates` in the seam faces, twelve arms,
>    the reads re-frozen UNCHANGED), §4 non-claims (the continuous rank
>    weight; the in-flight run); STATUS is the commander's. Scratch
>    900,006,800–899 (executor) / 900,006,900–999 (verifier); ZERO frontier;
>    ONE commit; never push; the commander reads `git log origin/main..HEAD`
>    before pushing.
> 5. **FORM RULES OF RECORD**: the flood selector's column is `beyondToleranceUp`
>    (§CORR 3); a stage's HONEST LIMITS count of flipping LOO rows is read off
>    the `loo` array, never typed.
> 6. **CONTRACTS**: `DS-DESIGNATION-CONTRACT.md` STATUS #409. The T1b doc §CORR
>    1–8; the seam doc's §SEAM table refreshed.
> 7. **THE GATES OF RECORD**: world 12 (open) · world 13 CLOSED KEEP · world 14
>    OPEN · world 15 OPEN.
> 8. **CONSUMPTION**: DS-T1b consumed 12,555,000–999 whole. Frontier: next sim ≥
>    **12,556,000**; stats ≥ 117,600; registry **85** for the next instrument.
>    THE QUEUE: DS-T0c (running) → DS-T1c → DS-ENTRY / a further slice / stop →
>    DS-T2 → ⑤.

> **COMMANDER RULING #410 (2026-09-08 — ⭐⭐⭐ DS-T0c 「自己的前插 · 排位」 BANKED-DORMANT,
> VERIFIER PASS: the coach's ranked selection now lives in the player — he
> ranks the teammates he can see by the shared convention and runs if he is
> among the count expected to go, ties broken as the coach breaks them; the
> ranking exists once in the source; no new constant, no truth read, the pull
> count unchanged, OFF byte-identical in five worlds ⇒ 🔄 DS-T1c 「自己的前插 ·
> 三考」 DISPATCHED):**
>
> 1. **DS-T0c BANKED-DORMANT** (commit 862f77c — `src/ai/PlayerBrain.ts` the
>    own-run block amended (the velocity mass REMOVED; `rankAbove` and
>    `restraint = clamp01(count − rankAbove)` in its place); `src/ai/TeamBrain.ts`
>    `runRank(role, localX)` exported and the shipped `.map` CALLING it — the
>    ranking and DS-T0's `/ 45` now exist ONCE (DS-T0's two-copy drift pin
>    retired positively); `tests/dsOwnRun.test.ts` extended, the velocity-mass
>    pins retired and listed; the seam doc §LAW-C / §HONESTY-C / §SEAM-C /
>    §PINS-C / §DEVIATIONS-C; the contract M-DS.6″ (the velocity form recorded
>    SUPERSEDED with DS-T1b's numbers by field); ZERO bytes elsewhere; no new
>    flag, gene or constant; `npm test` SERIAL 2,271/2,271 green (the
>    verifier's run); typecheck clean; fingerprint UNCHANGED; ZERO frontier
>    seeds). Verifier **PASS, zero HIGH** (three MEDIUM, three LOW — disposed
>    at the seam doc's §COMMANDER CORRECTIONS-C 1–5): its own OFF digests at
>    the dispatch head reproduced at the commit in bare · 12 · 13 · 14 · 15
>    with the rng draw in the hash, AND the executor's literals reproduced on
>    the executor's band; the pull instrumented (0 · 1 · 1 · 2, identical at
>    both heads); the law FUZZED against the verifier's own reference on 480
>    armed scenes with every mate's truth position re-randomised after the
>    memory was written — 480/480 exact scores, 708 exact ties staged, both
>    tie directions, every exclusion, the eyes rule both ways; the code-move
>    diffed to one shipped line; the OBM and GK seats' pins green.
> 2. ⭐⭐ **THE LAW OF RECORD (M-DS.6″ + M-DS.7, under the same flag)**: `runRank
>    (role, localX) = RUN_ROLE_W[role] + localX / RUN_DEPTH_DIV` (the coach's
>    expression, moved); `mine = runRank(p.role, localX(p.pos.x))`; for each
>    perceived same-side body resolving by gid to a roster mate (not himself,
>    not the perceived carrier, not the keeper, not sent off), `theirs =
>    runRank(mate.role, localX(body.pos.x))` — the ROLE off the roster, the
>    POSITION off the SNAPSHOT; `rankAbove` = the count with `theirs > mine ||
>    (theirs === mine && mate.index < p.index)` (the coach's `b.s − a.s ||
>    a.p.index − b.p.index` with himself as one side); `restraint = clamp01
>    (count − rankAbove) ∈ {0, 1}` — the coach's `slice(0, count)` as a cap;
>    the own run only when the perceived ball's owner is a mate (M-DS.7); `s =
>    (W.runScore · prior) · restraint`, `× OFFBALL_TIRED_MUL` if tired, `×
>    obmRunMul`. THE READ SET: the snapshot's ball owner and its bodies' gid ·
>    side · pos (no longer `vel`); his own pos · role · gid · index · wallRun ·
>    stamina (no longer `topSpeed`); the roster by gid; the board; the count's
>    inputs; `team.localX`; `W.runScore`, `obmRunMul`, `simTime`, `dsOwnRun` —
>    pinned in source (exact member sets) and in behaviour. HONESTY OF
>    RECORD: the stale-eyes case now cuts the OTHER way — an unseen mate does
>    not outrank him (a body with bad eyes ranks himself higher), a stale
>    position ranks a mate where he WAS; the convention's literals moved, not
>    grown; the step form is the coach's own — its softening (a continuous
>    rank weight) a later slice; the in-flight run still withdrawn (DS-T1b's
>    0.100272 leak quoted by field); the own run still needs the percept
>    trunk. H-DS-3 SUPERSEDED by H-DS-5.
> 3. ⭐⭐⭐ **DS-T1c DISPATCHED — 「自己的前插 · 三考」 THE OWN-RUN EXAM, THIRD RUN** (a
>    T1 exam; X-SRC-ZERO; DS-T1b's instrument INHERITED with its debts kept
>    paid and its §COMMANDER CORRECTIONS 1–8 applied — the `beyondToleranceUp`
>    column name (#409 item 5), the LOO flip count read off the array, no
>    verdict word anywhere, the seat-bite seeds STORED). (i) ARMS: DS-T1b's
>    twelve, unchanged — on E13 HATS · HATS + OWN · OWN × ABSENT · RUN-CAUTION
>    · KITCHEN-SINK (the two doses by anchor with G-DOSE-COPY); on D13 the three
>    seat-absent arms beside; the arm of record OWN-seat-absent; 'dosed' =
>    RUN-CAUTION. (ii) R1, THE BAND, THE FACES as DS-T1b (#408 item 5(ii)), with
>    the seam's faces ADAPTED to the rank law: `restraint` is now ∈ {0, 1} —
>    publish the share at 0 and at 1 (backed out as before, seat-absent arms
>    only, with the fixtures both ways); `rankAbove` distribution (frozen bins
>    0 · 1 · 2 · 3 · 4+; backed out where the score is non-zero it is 0 by
>    construction — so publish the OBSERVABLE `rankAbove < count` share from the
>    back-out and declare that the exact rank is not recoverable from a zero
>    score; the perceived-owner guard's pass share (floor); the in-flight and
>    restart own-run shares; the `count` shares; the seat's `runMulLic` limb on
>    the dosed arms with its zero floor. (iii) THE READS — #406 item 5(v)'s four
>    literals RE-FROZEN VERBATIM (from the ARCHIVE), the precedence UNCHANGED,
>    'dosed' = RUN-CAUTION; BESIDE every read, printed, no verdict word: H-DS-5's
>    numbers (R1's Δ on OWN vs HATS seat-absent beside DS-T1's +1.248030 and
>    DS-T1b's −0.447072 by field; G9's Δ beside DS-T1's +2.787788 and DS-T1b's
>    −4.023023), H-DS-6's number (R1's Δ on the RUN-CAUTION OWN arm beside the
>    seat-absent one), the HATS + OWN words, the yield pair, the coupling
>    sentence, the per-state line. (iv) GATES: DS-T1b's set PLUS G-REPRO-DST1b
>    (RE-WALK 12,555,000–011 on HATS-E13-absent FIELD FOR FIELD against
>    docs/world-model/data/ds-t1b-own-run-exam.json; a mismatch RED) ·
>    gCodeFactGraph (the six pushes; the flags' read forks equal to §SEAM-C's
>    inventory; `runRank`'s definition and its three call sites hashed; the
>    block's `match`-member set equal to §LAW-C's read set; NO `.vel` / `topSpeed`
>    / `runningMates` in the block — a stored boolean) · gPullCount · gScratch
>    Band (every scratch seed the instrument walks inside its declared band —
>    a stored check, #410 §CORR-C 3's form note). (v) SEEDS: block
>    **12,556,000–999** (N by a disclosed 12-seed smoke on 900,007,000–011 at a
>    declared 0.05 half-width on R1's paired Δ (OWN vs HATS, seat absent) and
>    on `passCompletion`; N = min(required, the affordance) — say which; receipt
>    900,007,020; world pin 900,007,070; lockstep 900,007,090–091; fixtures
>    900,007,099; band 900,007,000–099); RE-WALKS 12,555,000–011; ZERO stats;
>    registry **85**; freeze-before-sight; §DEVIATIONS required; HONEST LIMITS
>    the ONE home; the canon set. DOC `DS-T1C-OWN-RUN-EXAM-RANK.md`; INSTRUMENT
>    `scripts/probes/ds-t1c-own-run-exam.ts`; ARTIFACT
>    `docs/world-model/data/ds-t1c-own-run-exam.json`. Wall ≈ 28 min; the full
>    suite is not this stage's.
> 4. **WHAT THE READS WOULD MEAN THIS TIME (said now, not after)**: read 1
>    (¬floods ∧ holdsBand on OWN-absent) ⇒ DS-ENTRY is named — world 16 = 15 +
>    the own run with the open-play hats off — the coach's per-tick licence
>    retired by measurement (M-DF.2); read 4 with G9 DOWN again ⇒ the perceived
>    owner guard is the remaining drain (the in-flight run's slice comes first);
>    read 4 with G9 UP or another guard ⇒ the commander with the table; read 3
>    is not expected (the rank form is the coach's own count) and would say
>    the eyes' reach or the stale-eyes case is larger than the convention.
> 5. **CONTRACTS**: `DS-DESIGNATION-CONTRACT.md` STATUS #410. The seam doc
>    §CORR-C 1–5.
> 6. **THE GATES OF RECORD**: world 12 (open) · world 13 CLOSED KEEP · world 14
>    OPEN · world 15 OPEN.
> 7. **CONSUMPTION**: DS-T0c consumed no frontier seed. Frontier: next sim ≥
>    **12,556,000** (open to DS-T1c; after it ≥ 12,557,000); stats ≥ 117,600;
>    registry 85 at DS-T1c's freeze. THE QUEUE: DS-T1c (running) → DS-ENTRY /
>    the in-flight slice / stop → DS-T2 → ⑤.

> **COMMANDER RULING #411 (2026-09-08 — ⭐⭐⭐ DS-T1c 「自己的前插 · 三考」 BANKED: THE
> READ OF RECORD IS *"THE HAT CAN COME OFF — the player's own run holds the
> band without the coach and without eyes; DS-ENTRY is named: world 16 = world
> 15 + the own run with the open-play hats off."* — the coach's per-tick licence
> for the run in behind is RETIRED BY MEASUREMENT (M-DF.2): the player ranks
> the mates he sees by the shared convention and goes if he is among the count;
> every guard holds, the through ball inside tolerance, the offside flag down;
> the own run is FEWER than the hats (a fact the read does not carry, recorded);
> the verifier PASSED the stage ⇒ 🔄 DS-ENTRY 「自己的前插 · 世界 16」 DISPATCHED):**
>
> 0. **A BOOKKEEPING DISCLOSURE FIRST.** Commit 2fd55ff carries this ruling's
>    message but holds only the DS-T1c doc's corrections and the contract's
>    STATUS: the writer's chain committed before the ruling was appended (the
>    third slip of this kind; the two before at #401 and #403). This text, the
>    STATE block and the LOG entry land in the commit after it; history is not
>    rewritten. PROCESS RULE, hardened: the governance writer appends the
>    ruling, rebuilds STATE and appends the LOG in ONE script, and the commit
>    chain is attached ONLY to that script — never to a corrections-only pass.
> 1. **DS-T1c BANKED** (FREEZE `64e8ec7`, RESULTS `7f1298e`; X-SRC-ZERO; §P and
>    the instrument byte-identical; block 12,556,000–999 consumed whole — 999
>    × twelve arms, 12,000 booked = walked; zero stats; registry 85; 25/25
>    gates incl. the new gScratchBand, `allGreen` true). Verifier **PASS, zero
>    HIGH** (three MEDIUM, four LOW — disposed at the doc's §COMMANDER
>    CORRECTIONS 1–5; the "invented attribution" was the DISPATCH BRIEF's
>    sentence attributed to the ruling — re-attributed): R1 re-implemented
>    from §P on a battery seed for three arms (exact), every guard row and
>    breach set reproduced with its own bootstrap, all four read literals by
>    automated substring against the archive, every H-number opened out of
>    DS-T1's and DS-T1b's artifacts by name, the two ratios re-bootstrapped,
>    the §SEAM-C line numbers equal, the freeze clean. G-REPRO-DST1b 175 fields
>    × 12 seeds, zero mismatches.
> 2. ⭐⭐⭐ **THE NUMBERS OF RECORD (E13, seat absent; OWN vs HATS, paired)**:
>    `holdsBand` TRUE with an EMPTY breach set — G1 goals 3.324324 → 3.350350
>    (unresolved); G2 shots −0.291291 (resolved, inside 3.495021); G3 xG
>    conversion +0.020453 (unresolved); G4 completion 0.582113 → 0.586816
>    (resolved UP, a floor); G5 interceptions 27.384384 → 25.870871 (resolved
>    DOWN, inside 7.566738 — the safe way); G6 possession unmoved; G7 passes
>    −1.382382 (inside 21.960605); G8 mean aim distance −0.279593 (inside
>    4.369395); **G9 through balls 5.860861 → 5.306306, Δ −0.554555 [−0.744745,
>    −0.347347], tolerance 1.619448 — INSIDE** (DS-T1: +2.787788 breach UP;
>    DS-T1b: −4.023023 breach DOWN; the ratio 0.905380 [0.875376, 0.939013]);
>    G10 the offside FLAG NOT raised (Δ −0.167167, resolved DOWN). `floods`
>    FALSE — **R1 0.588555 → 0.253849** (Δ −0.334706 [−0.342342, −0.326930];
>    `beyondToleranceUp` FALSE; the two-sided companion TRUE — the own run is
>    **0.431309** [0.423933, 0.439099] of the hats' rate, RESOLVED DOWN; ticks
>    with ≥ 3 runners 0.013858 → 0.002162). THE OTHER ARMS: HATS + OWN holds the
>    band and does not flood (+0.024550) at all three seat states; RUN-CAUTION
>    OWN ⇒ read 1 (R1 0.191822; G9 −1.330330 inside 1.615576 — **H-DS-6
>    POSITIVE on the clean arm**); KITCHEN-SINK OWN ⇒ read 4 (G9 −3.248248 —
>    the ceiling probe moves the plane and support rows too, not an eyes-only
>    statement); D13 ⇒ read 1, agrees. THE SEAM'S FACES: `restraint` EXACTLY 0
>    on 0.547520 and EXACTLY 1 on 0.449381 of visible own-run candidates (the
>    step as a stored fact — the rank restraint bites on more than half); the
>    zero-prior population 0.074470 (the DF clamp); `count` 1 / 2 / 3 =
>    0.463226 / 0.523906 / 0.012868; the perceived-owner guard passes 0.218693
>    (floor); own runs won with the ball IN FLIGHT **0.119467** (UP from
>    DS-T1b's 0.100272 — the stale-eyes leak on a larger population; M-DS.7
>    unchanged); at the restart 0.001028. THE YIELD PAIR (no verdict word):
>    0.047234 shots per own-run episode (2,993 ÷ 63,366) vs the runner hat's
>    0.132072 (1,634 ÷ 12,372); goals 0.014692 vs 0.054235; 63.429429 own-run
>    episodes a match vs 12.384384 hat episodes. BY ROLE: ST 0.615021 · WG
>    0.351295 · MF 0.023938 · DF 0.009746 (the coach's: 0.507218 · 0.431489 ·
>    0.055800 · 0.005493). THE BOARD: `openPlayBoardEmpty` TRUE; designated
>    runners per in-possession coach tick 1.521690 → 0.191037 (the arriver and
>    the corner/cross branches only). THE COUPLING: overlap designations
>    3.009009 → 3.807808 (resolved UP); wall-pass fires unresolved. THE
>    CROWDING: `crowd.crashShare` 0.439480 → 0.449494; `spacingUnder4` 0.069836 →
>    0.074091 — not this door's.
> 3. ⭐⭐⭐ **THE READ, RULED, WITH ITS HONEST CAVEATS.** Read 1 is selected by the
>    frozen rule on stored booleans (¬`floods` ∧ `holdsBand`) and STANDS as the
>    read of record: the hat can come off. THE COMMANDER SAYS PLAINLY what the
>    literal does not carry: (i) the own run is FEWER — 0.431309 of the hats'
>    rate; the band holds anyway, which is the point of the DF path (a licence
>    retired by measurement, not by matching the coach's volume); (ii) H-DS-5's
>    two halves split — the band half SUPPORTED, the "R1 within tolerance of
>    HATS" half NOT (the coach ran more bodies for one more through ball in
>    ten); (iii) H-DS-6 POSITIVE on RUN-CAUTION (the eyes move R1 down inside
>    the band) and the KITCHEN-SINK ceiling drains — the dose space is
>    selection's (OBM-T2 later); (iv) the in-flight leak ROSE (0.119467) — the
>    run onto a ball in flight is the named next slice, its honest form still
>    unbuilt, and stale eyes let a tenth of the runs through the perceived-
>    owner guard; (v) the cutback ARRIVER hat is off in open play too (the
>    arriver pick sits inside `dsHatsOff`'s second gate) — the entry's brief
>    says so. VISION §1 (#91 form): the run in behind is now the player's own
>    read — his rank among the mates he sees, the ball at a mate's feet as he
>    perceives it — under a shared convention, not a per-0.4-s broadcast; the
>    convention's numbers are still hand-written (moved, not grown) and the
>    step is the coach's own `slice` (its softening later). REALITY (#201): a
>    real forward counts who is already going and waits for the ball to be at
>    a teammate's feet; a real team runs fewer, better-timed runs than a coach
>    shouting every 0.4 s would produce — the direction is the right one; the
>    volume is the user's eye to judge.
> 4. ⭐⭐⭐ **DS-ENTRY DISPATCHED — 「自己的前插 · 世界 16」 = WORLD 15 + THE OWN RUN WITH
>    THE OPEN-PLAY HATS OFF** (the LN/GK-ENTRY form; entry layer ONLY; two flags,
>    no gene, no constant; the OBM seat ABSENT — the arm of record). (i) THE
>    BUNDLE in `src/game/a4World.ts`: `DS_WORLD_VERSION = 16 as const`;
>    `DS_WORLD_DOORS = { dsOwnRun: true, dsHatsOff: true } as const`; `isDsWorld`;
>    `a4MatchFlags(16) = { ...a4MatchFlags(15), ...DS_WORLD_DOORS }` (CALLING
>    world 15); `armDsWorld = armGkWorld` and nothing more; `dsArmedVersion
>    (match)` = 16 iff `gkArmedVersion(match) === 15` AND both flags, else 0;
>    the unions gain 16; the URL bound 17; `armA4World`'s branch; `a4ArmedVersion`
>    reads 16 first; GameApp's guard and dose predicate extended by containment.
>    ⛔ TWO DOORS, NOTHING ELSE: no `obmMovement`, no `ctbSupportPlane`, no
>    `rcAnticipate`/`rcReady`, no `bfFacingCost`, no `edsTouchCost`, no OBM
>    gene — each pinned absent. (ii) THE HONEST BRIEF — three surfaces, every
>    number a DS-T1c FIELD at 6 dp (E13 the effect of record under 空账本; D13
>    the played form MEASURED under 成熟账本): badge `A4_BADGE_TEXT_DS = '🧪 自己的前插
>    · 剂量成熟'` / `_EMPTY = '🧪 自己的前插 · 空账本(全新手)'`; the settings checkbox
>    「自己的前插 · 前插是球员自己看着队友排位决定的,教练不再点名 (play-test)」 with the long
>    blurb in this order — WHAT IT DOES (上面那个世界 v15 再加两扇门：开放进攻里教练不再每
>    0.4 秒点名谁前插、谁包抄；每个球员按同一套惯例——号码权重加位置——给自己看得到的队友排位，
>    自己在该去的那一两个人里、而且看到球在队友脚下，才自己决定前插；没有新常数)；THE COST,
>    SAID FIRST (前插的人少了一半多：每个有球 tick 平均前插人数 0.588555 → 0.253849，成熟账本
>    0.660191 → 0.255253；直塞球每场 5.860861 → 5.306306，在容差内；开放进攻里的包抄/倒三角那
>    顶帽子也一起摘了——quote the arriver-set and cutback fields from the DS-T1c
>    artifact BY NAME; 每次前插的产出比教练点名的低：每段前插 0.047234 次射门对 0.132072，
>    但前插的段数是五倍 63.429429 对 12.384384)；THE GUARDS (进球 3.324324 → 3.350350、
>    射门、xG 转化、控球都没动；传球成功率 0.582113 → 0.586816 微升；被断 27.384384 →
>    25.870871；越位旗降了 2.478478 → −0.167167 —— 这些是空账本那一档的数)；THE PLAYED
>    FORM (成熟账本这次是量过的：R1 0.660191 → 0.255253；直塞球 6.811812 → 6.301301；读数一样)；
>    THE FIRST-LOOK DISCLOSURE (套边和二过一那两顶帽子还在，是下一步 DS-T2 的事；角球、传中、
>    定位球的点名照旧；球还在飞的时候前插还没造，现在有 0.119467 的前插是眼睛滞后漏进来的；
>    「有人挤人」不是这扇门的事——撞车率 0.439480 → 0.449494；⚠ 联赛后台快速模拟的比赛跑的是
>    原版世界)；the feed blurb in BOTH dose forms in `GameApp.ts`, each quoting
>    ITS OWN arm's fields. (iii) HOW-TO-SEE (BINDING, plain Chinese): 前插的人是
>    不是少了，但该跑的人——前锋、边锋——还在跑；有没有「四五个人一起往前冲」的画面消失；直塞球
>    是不是还在；倒三角包抄是不是变少了；对比对象是 v15，同一台设备，`?a4world=16` 对
>    `?a4world=15`。 (iv) THE PINS `tests/dsPlaytestEntry.test.ts` in the
>    gkPlaytestEntry form: FIDELITY (`a4MatchFlags(16)` deep-equals `{...
>    a4MatchFlags(15), dsOwnRun: true, dsHatsOff: true}`; a world-16 match reads
>    both flags true, `gkArmedVersion` 15, `dsArmedVersion` 16, the LN gene 0.25
>    both sides, `info.genome` clean; the DOOR-SET identity with DS-T1c's OWN
>    arm construction (the exam walked world 13 + both flags — world 16 sits
>    on 15's doors, so the fidelity pin reproduces DS-T1c's construction ON
>    WORLD 13 beside the entry's ON 16 and pins the door set, and a separate
>    pin proves `a4MatchFlags(15)` + both flags = `a4MatchFlags(16)` whole-match
>    signatures on ≥ 6 scratch seeds); the absent doors absent) · CONTAINMENT
>    (16 never reads 15; 15 never reads 16; the chain 16 → 15 → 14 → 13 → 12 →
>    11) · URL (16 parses; 17 rejected) · BADGE both dose forms · THE HONEST
>    BRIEF's 6-dp strings pinned to the surface that claims them, each arm's
>    under its own heading · IDENTITY BELOW 16 (pooled digests for the bare
>    world, 12, 13, 14 AND 15 on ≥ 12 scratch seeds equal digests RECORDED FIRST
>    at the dispatch HEAD in a clean worktree — `git rev-parse HEAD` at
>    dispatch; the fingerprint unchanged) · DORMANCY (worlds 1–15 carry
>    neither flag; `League.toJSON` omits matchFlags) · LIVENESS (world 16 ≠
>    world 15 on ≥ 1 of ≥ 12 scratch seeds; the dead-time exemption stated) ·
>    THE MUTANT WALK (one door dropped from `DS_WORLD_DOORS`; the composer
>    calling `a4MatchFlags(14)`; the URL bound not moved; `a4ArmedVersion`
>    reading 15 before 16 — each killed) · NARROWED PINS listed positively
>    (incl. `tests/dsOwnRun.test.ts`'s dormancy pins "no world 1–15 carries the
>    flags" → "no world 1–15; world 16 carries both", and `a4World.ts`'s
>    zero-count anchors in the DS suites; DS-T1c's FROZEN instrument is NOT
>    edited — its `a4World.ts` zero-count anchor will read RED from here, DECLARED
>    in the rung doc's §NARROWED PINS and in DS-T1c's §COMMANDER CORRECTIONS as
>    an errata line at #412). (v) §NO NEW CHUNK / §THE COST FACE in RAW BYTES
>    (gzip labelled commit-dependent). (vi) THE DOC `DS-ENTRY-RUNG.md` in
>    GK-ENTRY's sections; §3 THE SURFACES exactly the four entry files + the pin
>    suite (+ the DS suite's narrow); ZERO files under src/sim, src/ai,
>    src/evolution, scripts/; the default landing world 0 BEFORE and AFTER;
>    §HONEST LIMITS the ONE home (the own run fewer than the hats; the yield per
>    episode lower; the in-flight leak 0.119467; the cutback hat off in open
>    play; the step form; the convention's numbers hand-written; the seat
>    absent; one world one composition; the D13 arm by the shipped loaders at
>    the exam's head); §ROAD B; §NEXT the user gate 「自己的前插 (v16) — keep |
>    change | revert — <一句人话>」 then DS-T2 (套边 · 二过一) or the in-flight
>    slice. Scratch 900,007,200–299 (executor) / 900,007,300–399 (verifier); ZERO
>    frontier; ONE commit; never push; the commander reads `git log
>    origin/main..HEAD` before pushing.
> 5. **CONTRACTS**: `DS-DESIGNATION-CONTRACT.md` STATUS #411. The T1c doc §CORR
>    1–5.
> 6. **THE GATES OF RECORD**: world 12 (open) · world 13 CLOSED KEEP · world 14
>    OPEN · world 15 OPEN · world 16 OPENS at DS-ENTRY's deploy.
> 7. **CONSUMPTION**: DS-T1c consumed 12,556,000–999 whole. Frontier: next sim ≥
>    **12,557,000**; stats ≥ 117,600; registry **86** for the next instrument.
>    THE QUEUE: DS-ENTRY (running) → the user gate (v16) → DS-T2 (套边 · 二过一)
>    / the in-flight slice → ⑤.

> **COMMANDER RULING #412 (2026-09-08 — ⭐⭐⭐ DS-ENTRY 「自己的前插 · 世界 16」 BANKED,
> VERIFIER PASS: WORLD 16 = WORLD 15 + THE OWN RUN WITH THE OPEN-PLAY HATS OFF IS
> CUT — two doors, no gene, no constant, the eyes absent; every world below 16
> byte-identical; the door set proven the exam's; the honest brief says fewer
> runners first ⇒ THE USER GATE OPENS AT THIS PUSH: 「自己的前插 (v16) — keep |
> change | revert — <一句人话>」; the last two hand-written hats (套边 · 二过一)
> go to their switch and their measurement: 🔄 DS-T0d 「配合帽子 · 开关」
> DISPATCHED):**
>
> 1. **DS-ENTRY BANKED** (commit 32723c5 — 4 entry files + `tests/dsPlaytestEntry
>    .test.ts` (27 pins) + 26 positive narrows across 12 suites + the rung doc;
>    ZERO files under src/sim, src/ai, src/evolution, scripts/; `npm test`
>    SERIAL 2,297/2,298 with the standing `formationEvolution` timeout re-run
>    alone green; typecheck clean; fingerprint UNCHANGED; the default landing
>    world 0 before and after; ZERO frontier seeds). Verifier **PASS, zero
>    HIGH** (one MEDIUM, four LOW — disposed at the rung doc's §COMMANDER
>    CORRECTIONS 1–6; ONE user-facing string corrected by the commander — the
>    disclosure block's E13 label — the two DS suites green after). THE BUNDLE:
>    `DS_WORLD_VERSION = 16`, `DS_WORLD_DOORS = { dsOwnRun: true, dsHatsOff: true }`,
>    `a4MatchFlags(16) = { ...a4MatchFlags(15), ...DS_WORLD_DOORS }` (called),
>    `armDsWorld = armGkWorld` and nothing more, `dsArmedVersion` by
>    containment requiring BOTH doors (either alone reads 0 — pinned), the URL
>    bound 17, the source order pinned 16 ⊃ 15 ⊃ 14 ⊃ 13 ⊃ 12 ⊃ 11. IDENTITY:
>    five digests recorded at `0eefb9a` in a clean worktree and re-computed
>    identical at the commit; the verifier's own band agrees; world 16
>    non-vacuous. FIDELITY in the STRONGER form: the exam's construction on
>    world 13 reproduces all twelve stored OWN-E13-ABSENT signatures off the
>    artifact; `a4MatchFlags(15)` + both flags ≡ `a4MatchFlags(16)` on six seeds.
>    THE COST FACE in BYTES: +7,180 B (+0.4937 %) raw; precache 19 → 19 as a
>    SET; no opt-in cost. LIVENESS in the #402 item 2(iii) form.
> 2. ⭐⭐ **THE HONEST BRIEF OF RECORD** (three surfaces, 43 numbers pulled by field
>    and arm — 12 E13 tokens on the empty-book line, the D13 tokens on the
>    mature line, none crossed): the cost FIRST (前插的人少了一半多 0.588555 →
>    0.253849; 直塞球 5.860861 → 5.306306 在容差内; 包抄那顶开放进攻的帽子也摘了 —
>    `coupling.arriverSetsPerMatch` 16.577578 → 1.558559,
>    `coupling.cutbackTakenPerMatch` 5.030030 → 0.979980; 每段前插的产出 0.047234 对
>    0.132072 但段数五倍 63.429429 对 12.384384), the guards (进球 3.324324 →
>    3.350350; 传球成功率 0.582113 → 0.586816; 被断 27.384384 → 25.870871; 越位每场
>    2.478478,少了 0.167167 — the ruling's own transcription mis-typed a level
>    and a delta; the surfaces are right), the played form measured (前插人数
>    0.660191 → 0.255253; 直塞球 6.811812 → 6.301301; 读数一样), the first-look
>    disclosure (套边/二过一 still hats — DS-T2; corners/crosses/restarts' designations
>    untouched; the in-flight run unbuilt, 0.119467 leaks; 撞车率 0.439480 →
>    0.449494 — not this door's; the league-worker caveat) and HOW-TO-SEE on the
>    settings blurb, both feed lines and §4. The disclosure block now carries its
>    arm label.
> 3. **RATIFIED**: §DEVIATIONS 1–11 (the STRONGER door-set form; the mature line
>    quoting D13's own fields; the raw-source flag-count pin; the frozen
>    instrument declared RED and NOT edited — DS-T1c's §COMMANDER CORRECTIONS
>    gains its errata line 6 at #412: the two `a4World.ts` zero-count anchors,
>    `readForks.a4WorldIsCLEAN` and its `CODE_FACTS_OK` conjunct read RED at
>    32723c5 and later; the banked results unaffected). FAMILY NOTE: a stage's
>    zero-count anchor over the ENTRY LAYER is a statement dated to its head;
>    every entry rung after it reddens it by design — the next census/exam that
>    inherits such an anchor states the count at ITS head.
> 4. ⭐⭐⭐ **THE GATE**: 「自己的前插 (v16) — keep | change | revert — <一句人话>」 at
>    `?a4world=16` vs `?a4world=15`, same device. WHAT THE EYES ARE FOR (§4,
>    binding): 前插的人是不是少了,但该跑的人——前锋、边锋——还在跑;有没有「四五个人一起往前冲」的
>    画面消失;直塞球是不是还在;倒三角包抄是不是变少了. THE LIKELIEST 「change」 and its
>    answer, said now: too FEW runners (the own run is 0.431309 of the hats'
>    rate) — the answer is the continuous rank weight (a softening of the
>    coach's own step, a held door) or the in-flight run (the named next
>    slice), not this entry; the cutback arrival gone in open play — the
>    answer is a player-side arrival (the arriver's arc is the coach's routing,
>    not reproduced by the own run), a later slice. Worlds 14 and 15 stay open
>    beside it.
> 5. ⭐⭐⭐ **DS-T0d DISPATCHED — 「配合帽子 · 开关」 THE COOPERATION HATS' SWITCH** (a T0
>    seam: ONE dormant flag, TWO additive gates, NO law — an instrument for the
>    measurement DS-T1d makes; the DF path's "the cap retires by measurement,
>    never by deletion" applied to the last two hand-written hats the audit
>    called 正牌违规). (i) `match.dsCoopHatsOff?: boolean` (default OFF; the
>    `gkDiveBody` docblock idiom in Match.ts; the League union key); in NO
>    world or preset. (ii) GATE 1 — `assignRunners`' 套边 block (TeamBrain.ts
>    ~l.385–420: the `team.overlapper === null && carrier && … attackingWidth ·
>    overlapW > 0.3` block through `if (pick) team.overlapper = pick.index;`)
>    wrapped `if (!match.dsCoopHatsOff) { … }` — additively, the shipped
>    statements byte-unchanged (re-indent allowed, declared); the flight-
>    preserving `keepOverlap` line above it UNTOUCHED (it has nothing to keep).
>    GATE 2 — `performPass`'s 2过1 trigger (mechanics.ts ~l.422–443: the six-
>    conjunct `if` that sets `passer.wallRun`) wrapped `if (!match.dsCoopHatsOff)
>    { … }` — additively. NOTHING ELSE: the passer's read sites (the overlap
>    release bonus, the wall-return bonus, the third-man bonus, the arriver
>    cutback — PlayerBrain), `registerPass`'s bounce, the executor's overlap
>    routing, the runner/arriver gates of `dsHatsOff`, the corner/cross
>    branches — UNTOUCHED (with the flag armed the overlap and wall-return
>    bonus branches become unreachable because their inputs are never set —
>    a MEASURED consequence, pinned as behaviour, not an edit). (iii) PINS in
>    a NEW `tests/dsCoopHatsOff.test.ts` (the dsOwnRun form): G-OFF (the flag
>    absent ⇒ whole-match signatures identical to the dispatch head's in bare
>    · 13 · 15 · 16 on ≥ 12 scratch seeds; the fingerprint); ARMED behaviour
>    over whole matches (`team.overlapper` never non-null in open play — the
>    flight-preserved case impossible because nothing is ever set; `p.wallRun`
>    never non-null; the overlap-release and wall-return bonus branches never
>    reached — counted through the decision record or a spy on a throwaway
>    match, never src); the runner/arriver board UNCHANGED by this flag (pooled
>    `team.runners` / `team.arriver` counts equal flag-off vs flag-on on the
>    same seeds up to the trajectory divergence — state what is compared; at
>    minimum the corner crash and the live corner still license); the seam map
>    (flag occurrence counts per file: Match.ts, League.ts, TeamBrain.ts 1,
>    mechanics.ts 1; `a4World.ts` 0); ABSENT ≡ explicitly false; the mutant
>    walk (gate 1 dropped; gate 2 dropped; a gate wrapped around the corner-
>    crash branch; the flag read inverted). (iv) SRC EDITS ONLY IN `src/sim/
>    Match.ts` (the flag), `src/sim/League.ts` (the key), `src/ai/TeamBrain.ts`
>    (gate 1), `src/sim/mechanics.ts` (gate 2), `tests/`; ZERO elsewhere. (v)
>    DOCS: the seam doc `DS-T0-OWN-RUN-SEAM.md` gains §SWITCH-D (the flag, the
>    two gates verbatim, the READ-FORK INVENTORY refreshed, §PINS-D,
>    §DEVIATIONS-D); the contract's §2 gains M-DS.8 (the cooperation hats'
>    switch — an instrument, not a design; the player-side overlap / one-two
>    seats are DS-T0e's question IF DS-T1d finds a face) and §3 the arc (DS-T1d:
>    on E13 — HATS (world 13) · OWN (13 + `dsOwnRun` + `dsHatsOff`, DS-T1c's arm
>    of record) · OWN + COOP-OFF (+ `dsCoopHatsOff`), D13 beside; R1, the band,
>    the coupling faces (overlap designations / arrivals; wall fires / returns;
>    the passer's four hat-read fires), the crowding family; READS on OWN +
>    COOP-OFF vs OWN: `holdsBand` ∧ ¬`floods` ⇒ *"THE COOPERATION HATS PRODUCE
>    NOTHING THE BAND CAN SEE — they come off: DS-ENTRY-2 is named (world 17 =
>    16 + the cooperation hats off)."* · a breach ⇒ *"THE COOPERATION HATS CARRY
>    A FACE — the guard is named; a player-side seat is designed before any hat
>    comes off."* — with the disappearing faces PRINTED beside (overlap
>    arrivals per match, one-twos per match) and the honesty that "nothing
>    the band can see" is not "nothing the eye can see": the user's gate at
>    world 17 judges). Scratch 900,007,400–499 (executor) / 900,007,500–599
>    (verifier); ZERO frontier; ONE commit; never push; the commander reads
>    `git log origin/main..HEAD` before pushing.
> 6. **CONTRACTS**: `DS-DESIGNATION-CONTRACT.md` STATUS #412. The rung doc §CORR
>    1–6; DS-T1c §CORR 6 (errata).
> 7. **THE GATES OF RECORD**: world 12 (open) · world 13 CLOSED KEEP · world 14
>    OPEN · world 15 OPEN · **world 16 OPEN at this deploy**.
> 8. **CONSUMPTION**: zero. Frontier: next sim ≥ 12,557,000; stats ≥ 117,600;
>    registry 86. THE QUEUE: DS-T0d (running) → DS-T1d → DS-ENTRY-2 / a seat /
>    stop → the in-flight slice → ⑤. ⚠ THIS PUSH deploys world 16 (Road B: the
>    default landing world 0; the doors reached only via `?a4world=16` or the
>    checkbox).

> **COMMANDER RULING #413 (2026-09-08 — ⭐⭐ DS-T0d 「配合帽子 · 开关」 BANKED-DORMANT,
> VERIFIER PASS, zero HIGH, zero MEDIUM, four LOW disposed: ONE flag `dsCoopHatsOff`,
> TWO purely additive gates, the two cooperation hats NEVER ISSUED armed — measured
> over whole matches, every field read null — the 前插 board untouched, the four
> frozen probes' `assignRunners` hash DECLARED RED and none edited; the last two
> hand-written hats go to their measurement: 🔄 DS-T1d 「配合帽子 · 考」 DISPATCHED):**
>
> 1. **DS-T0d BANKED-DORMANT** (commit 68022c9 — 7 files: `src/sim/Match.ts` the
>    flag (config key :777, field :1718, init :2571 `cfg.dsCoopHatsOff ?? false`;
>    no env door, never bundle-defaulted), `src/sim/League.ts:300` the union key,
>    `src/ai/TeamBrain.ts:398` GATE 1 `if (!match.dsCoopHatsOff) {` around the
>    WHOLE 套边 block incl. its three comment lines (interior 399–436, close :437;
>    head 385–422), `src/sim/mechanics.ts:430` GATE 2 around the six-conjunct 2过1
>    trigger (interior 431–452, close :453; head 422–443), a NEW
>    `tests/dsCoopHatsOff.test.ts` (27 pins), the seam doc §SWITCH-D / §PINS-D /
>    §GATES-D / §DEVIATIONS-D, the contract M-DS.8 + §3 + §4). ADDITIVITY proven
>    WHOLE-FILE: the leading-whitespace-stripped diff of each changed file is PURE
>    INSERTION (`TeamBrain.ts` `384a385,398` + `420a435`; `mechanics.ts`
>    `421a422,430` + `442a452`) — not one shipped statement deleted, reordered or
>    reworded; the re-indent exactly two spaces, pinned as an EQUALITY on both
>    gates; `if (!keepOverlap) team.overlapper = null;` at :251 outside and above,
>    byte-untouched; `dsHatsOff`'s two gates still at :344 and :367 and the region
>    344–383 byte-identical head↔commit. G-OFF: four digests RECORDED FIRST at the
>    dispatch head f1a46b1 on 12 seeds 900,007,400–411 (bare `a81e4054…0245` ·
>    13 `d7b9b9e6…2f88` · 15 `1c959b52…b9b5` · 16 `2b78c8a9…4b61`) reproduce at
>    the commit; ABSENT ≡ EXPLICITLY FALSE (bare and 16); the fingerprint
>    `57b0bdab…c673` recomputed in-process, unchanged; `a4World.ts` names the flag
>    ZERO times, no world's `a4MatchFlags` carries it, the ONLY assignment in
>    `src/**` is the constructor's init, `League.toJSON` omits `matchFlags`.
>    ARMED, whole matches on worlds 13 and 16 (4 seeds 900,007,420–423 each):
>    `team.overlapper` and `p.wallRun` NULL on every stepped tick, both `MakeRun`
>    whys absent from `p.action.scores`, every accessor-spy read null (1,184 /
>    315,758 reads on 13; 1,236 / 406,389 on 16) with the flag-ABSENT twin on the
>    SAME seeds non-vacuous (13: 325 team-ticks · 281,266 body-ticks · 228 · 546
>    whys; 16: 370 · 339,088 · 201 · 343), the spy proven non-invasive by digest
>    ⇒ `PlayerBrain.ts:666` (`mate.wallRun !== null`) and `:690`
>    (`team.overlapper === mate.index`) UNREACHABLE BY MEASUREMENT, not by edit.
>    THE BOARD IS NOT THIS FLAG'S (armed ALONE on 13, 900,007,430–433):
>    `team.runners` non-empty on 2,379 coach ticks, `team.arriver` on 196, the
>    live corner licensing 52, the held crash 54. MUTANTS at source: N1 gate 1
>    dropped 9 RED · N2 gate 2 dropped 7 · N3 a gate around the corner crash 2
>    (the source pins, NOT the board counter — measured and declared) · N4 the
>    read inverted 17. `npm test` SERIAL 171 files 2,325/2,325 (2,197.71 s; no
>    re-run needed); `tsc` clean; `tests/dsOwnRun.test.ts` byte-unchanged 76/76.
>    Every scratch seed inside the declared band off the ONE base; ZERO frontier.
> 2. **THE VERIFIER** (independent, its OWN seeds): 900,007,500–507, eight whole
>    matches per world — SIX digests (bare · 13 · 15 · 16 · bare+false · 16+false)
>    identical head↔commit, ZERO OFF byte differences; the whole-file stripped
>    diffs re-derived pure insertion; the armed walk on 900,007,510–513 — ZERO
>    non-null of 207,682 `overlapper` and 770,878 `wallRun` reads on 13 (203,888 /
>    805,246 on 16), sixteen spied/unspied pairs identical; the board alive with
>    the flag armed alone (900,007,520–523: runners 60,486 team-ticks · arriver
>    5,834 · corner crash 4,928); all four mutants replicated at source with the
>    SAME red counts 9 / 7 / 2 / 17; EVERY single-line anchor needle of the four
>    frozen probes evaluated against both heads — 129 needles, DRIFT 0
>    (`occurrences()` is a substring scan); the full suite SERIAL 2,325/2,325 at
>    2,200.50 s; every line number in the docs exact; the contract's §4 refuses
>    BOTH readings. Verdict PASS: zero HIGH, zero MEDIUM, four LOW.
> 3. **CORRECTIONS** (the four LOW, disposed IN PLACE at the seam doc's
>    §COMMANDER CORRECTIONS-D): (i) §PINS-D (c) "none of them hashes a whole
>    FILE" — imprecise: sixteen probes carry a whole-file `srcSha256` PROVENANCE
>    map (never compared to a banked literal) ⇒ reworded "none GATES on a
>    whole-file hash"; the conclusion stands. (ii) D3 did item 5(iii)'s stated
>    MINIMUM without saying so — the pooled off-vs-on board comparison was NOT
>    attempted; disclosed. (iii) the region digest `7d0ae974…bd04` is over a
>    string-index slice; the whole-line recomputation gives `0a233c2c…8215` at
>    both heads — the extraction named beside the literal. FORM NOTE (family): a
>    digest in a doc names its EXTRACTION beside its literal. (iv) §DEVIATIONS-D 1
>    quotes "~l.385–420"; the head block measured 385–422 — annotated.
> 4. **RATIFIED**: §DEVIATIONS-D 1–6. M-DS.8 stands as an INSTRUMENT, not a
>    design: until DS-T1d measures, the contract claims neither that the
>    cooperation hats are dispensable nor that they are load-bearing; an
>    unreachable branch is not a deleted one. The DF-path family rule (M-DF.2)
>    holds for hats too: a hat retires BY MEASUREMENT, never by deletion — the
>    switch makes the decision priceable; DS-T1d prices it.
> 5. **DS-T1d 「配合帽子 · 考」 DISPATCHED** (X-SRC-ZERO; Draft + independent
>    Verify in the DS-T1c form): (i) ARMS — SIX, the OBM seat ABSENT throughout
>    (the seat is not this exam's question): on E13 — HATS (world 13) · OWN (13 +
>    `dsOwnRun` + `dsHatsOff`, DS-T1c's arm of record) · OWN + COOP-OFF (the same
>    + `dsCoopHatsOff`); on D13 the same three beside. THE COMPARISON OF RECORD =
>    OWN + COOP-OFF vs OWN on E13, paired on shared seeds; HATS vs OWN + COOP-OFF
>    printed beside (world 13 against the world-17 candidate); the D13 triple
>    beside. (ii) FACES — R1 (DS-T1c's predicate; the one-sided column
>    `beyondToleranceUp`; LOO off the `loo` array, every flipping row named); THE
>    BAND = DS-T1c's guard set by anchor, tolerances by the house form; THE
>    COUPLING FACES copied from DS-C0 BY FIELD NAME — `overlapSets`,
>    `overlapReleaseFires`, `overlapArrivedStat`, `overlapConfronted`,
>    `wallEligiblePasses`, `wallFires`, `wallOneTwosStat`,
>    `fireWallReturnUpperBound`, `fireOverlapReleaseExact` and the
>    `passerReadTable` (the passer's hat-read fires by site) — with the two
>    DISAPPEARING faces printed PER MATCH beside every read (overlap arrivals per
>    match; one-twos per match), their zero on the COOP-OFF arms a STORED check
>    of the arm's construction, never narrated; the crowding family (OBM-T1's,
>    `spacingUnder4` included); the seam's own faces (`restraint` / `rankAbove`
>    bins) inherited; the yield pair; the per-state line. (iii) THE READS, frozen
>    ex ante, the contract §3's / #412 item 5(v)'s literals copied character for
>    character, on OWN + COOP-OFF vs OWN (E13, seat absent): `holdsBand` ∧
>    ¬`floods` ⇒ *"THE COOPERATION HATS PRODUCE NOTHING THE BAND CAN SEE — they
>    come off: DS-ENTRY-2 is named (world 17 = 16 + the cooperation hats off)."*
>    · a breach ⇒ *"THE COOPERATION HATS CARRY A FACE — the guard is named; a
>    player-side seat is designed before any hat comes off."* PRECEDENCE: a
>    breach first; then read 1; the residual shape (`floods` with the band
>    holding — R1 UP beyond tolerance when two hats come off) is NOT covered and
>    is stored as *"THE READS DO NOT COVER THE SHAPE — the commander decides with
>    the table."* (the DS-T1 read-4 fallback form; no third read invented).
>    Printed beside every read: "nothing the band can see" is NOT "nothing the eye
>    can see" — the user's gate at world 17 judges. D13's word and the HATS-vs-
>    OWN + COOP-OFF guard table STORED as counterfactuals, never selecting. NO
>    verdict word or superlative on any yield, coupling, seam or hypothesis face
>    (DS-T1 and DS-T1b both failed on exactly this). (iv) GATES — DS-T1c's set by
>    anchor PLUS G-REPRO-DST1c (RE-WALK 12,556,000–011 on HATS-E13-ABSENT and
>    OWN-E13-ABSENT field for field against `ds-t1c-own-run-exam.json`
>    `perSeedCells[]`; a mismatch RED) · gCodeFactGraph incl. the THREE flags'
>    read forks vs §SWITCH-D's REFRESHED inventory with line numbers (PlayerBrain
>    2213; TeamBrain 344 · 367 · 398; mechanics 430; Match 777 · 1718 · 2571 and
>    the moved 1706 · 1712 · 2566 · 2567; League 300) · the `assignRunners`
>    whole-text hash STATED at THIS head and compared to nothing banked (§CORR-D
>    5) · gPullCount (DS-T1c's idiom on every armed arm; the switch's gates read
>    no percept — the count unchanged by the COOP-OFF flag, stored) · gLockstep ·
>    gScratchBand · X-FP-PROD · the three DS-C0 debts kept paid. (v) SEEDS — block
>    12,557,000–999 (verify fresh against the consumed list … DS-T1c
>    12,556,000–999); N sized by a DISCLOSED 12-seed smoke on 900,007,600–611 at a
>    declared 0.05 half-width on R1's paired Δ (OWN + COOP-OFF vs OWN) and on
>    `passCompletion`'s; N = min(required, the block's affordance after the
>    receipt 12,557,999) — say which; receipt 900,007,620; world pin 900,007,670;
>    lockstep + X-DET + gPullCount 900,007,690–691; fixtures' draw 900,007,699;
>    band 900,007,600–699 STORED and asserted; verifier band 900,007,700–799;
>    RE-WALKS 12,556,000–011 (not a consumption); ZERO stats — `stats: {
>    consumed: 0, nextBase: 117_600, registryOfRecord: 86 }`. (vi) FILES —
>    `docs/world-model/DS-T1D-COOP-HATS-EXAM.md` (§0 · §P inherited section by
>    section with each change ⭐ AMENDMENT · §DEV-PREFLIGHT · §R1–§R6 · §HONEST
>    LIMITS the ONE home · §DEVIATIONS · §GATES with the final hash and bytes),
>    `scripts/probes/ds-t1d-coop-hats-exam.ts`, `docs/world-model/data/
>    ds-t1d-coop-hats-exam.json` (compact; body hash last, `receipts.
>    hashReproducesFromFile`); FREEZE then RESULTS, two commits, the instrument
>    byte-identical between them; explicit paths; never push; the commander reads
>    `git log origin/main..HEAD` before pushing.
> 6. **CONTRACTS**: `DS-DESIGNATION-CONTRACT.md` STATUS #413. The seam doc
>    §CORR-D 1–5 and four in-place annotations.
> 7. **THE GATES OF RECORD**: world 12 (open) · world 13 CLOSED KEEP · world 14
>    OPEN · world 15 OPEN · world 16 OPEN (deployed at f1a46b1, Pages success;
>    the three verdicts awaited).
> 8. **CONSUMPTION**: zero. Frontier: next sim ≥ 12,557,000 (DS-T1d's block,
>    booked at its freeze); stats ≥ 117,600; registry 86 (DS-T1d's). THE QUEUE:
>    DS-T1d (running) → DS-ENTRY-2 / a seat / stop → the in-flight slice → ⑤.
>    THIS PUSH carries 68022c9 (the switch, OFF byte-identical in every world)
>    + this ruling; it touches `src/` so CI runs.
