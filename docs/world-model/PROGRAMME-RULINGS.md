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
