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
