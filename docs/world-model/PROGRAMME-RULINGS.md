# PROGRAMME — Commander rulings (verbatim; LIVE FILE, #418 onward)

> This file holds commander rulings **#418 onward, verbatim**, APPENDED in numeric
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
> #408–#417 (DS-T0b→world 16→DS-T0d/T1d→world 17→IF-C0→the IF fork 甲→the IF contract) in
> [`PROGRAMME-RULINGS-ARCHIVE-408-417.md`](PROGRAMME-RULINGS-ARCHIVE-408-417.md)
> (the unnumbered 2026-07-24 ruling remains in `PROGRAMME.md`'s context block).
> **Resume = `tail -n 120` of THIS file.** Find any ruling by number:
> `grep -n "RULING #N " docs/world-model/PROGRAMME-RULINGS*.md`. Rotation rule:
> ~1,500 lines ⇒ rotate the closed era in the same round as a ruling (#303 item 2).

> **COMMANDER RULING #418 (2026-09-19 — ⭐⭐⭐ THE HOST CHANGED ARCHITECTURE: every whole-match
> digest and the fingerprint of record are arm64 NUMBERS, and this x64 host reproduces NONE of
> them — MEASURED on three x64 machines against two arm64 witnesses, every other cause excluded
> by measurement; 甲 THE ARCHITECTURE-KEYED DIGEST LAW (arm64 stays the architecture OF RECORD,
> CI its arbiter; x64 a SECOND column; frozen arm64-only pins are RED BY CONSTRUCTION on this
> host and are NOT edited — the inventory registered here); THE RULINGS FILE ROTATED (#408–#417
> → ARCHIVE); IF-T0 「球在飞时的前插 · 缝」 AMENDED (arch-keyed G-OFF, the arm64 column inherited
> by identity or absent-and-skipped, never guessed) and 🔄 DISPATCHED this round):**
>
> 0. **BOOKKEEPING.** (a) The host from this round on is the Windows x64 workstation (AMD Ryzen
>    AI 9 HX 370) — the Mac was returned 2026-09-18. First-run repairs, none of them programme
>    changes: `node_modules` installed by `npm ci` from the committed lockfile; the working tree
>    RENORMALIZED to LF (`core.autocrlf=false` set locally — the first Windows checkout carried
>    CRLF under the global `autocrlf=true`, which reddens every source-needle pin that anchors on
>    a newline); Node 26.3.0 (`.nvmrc`) unpacked outside the repo for the measurement below, the
>    system Node 24.18.0 unchanged. (b) THE RULINGS FILE ROTATED per #303 item 2: #408–#417 →
>    [`PROGRAMME-RULINGS-ARCHIVE-408-417.md`](PROGRAMME-RULINGS-ARCHIVE-408-417.md) byte-verbatim;
>    this file = #418 onward. (c) The self-drive push remains the USER's (#417 item 0(b)).
> 1. ⭐⭐⭐ **THE MEASUREMENT (the fact of record).** `npm run fingerprint` at HEAD `8d98358`
>    (`9b9ad55` + two doc files — `git diff --stat 9b9ad55 HEAD` = docs only):
>    * **x64, all `59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d`**: this host
>      (Windows 11, Node 24.18.0 AND 26.3.0; CRLF tree AND LF tree); WSL Ubuntu on the same CPU
>      (Node 22.23.2 / 24.19.0 / 26.3.0, locale en-US); UCL Myriad (Intel Xeon Gold 6140, RHEL 7,
>      Node 22.23.2 glibc-2.17 build) — three machines, two operating systems, two CPU vendors,
>      three Node majors, one value.
>    * **arm64, the value of record `57b0bdab…c673`**: the Mac (Node 26.3.0) where every digest in
>      `tests/` was recorded, and CI — `.github/workflows/pages.yml`'s build job is
>      `runs-on: macos-latest`; run 34995053381 at `9b9ad55` used
>      `hostedtoolcache/node/22.23.2/arm64` and shows `dsOwnRun.test.ts`'s fingerprint pin and its
>      G-OFF digests ✓ (bare · 13 · 15 at 2026-09-15T16:30:46Z).
>    * **EXCLUDED by measurement** (value unchanged under each): CRLF vs LF; Node major (22 / 24 /
>      26); locale; `CI=1`; V8 `--no-enable-fma3`; `--no-enable-avx --no-enable-avx2`; `--no-opt
>      --no-maglev`. No env door is set (`process.env` doors: the `PITCH_SCALE` family,
>      `EDS_BUNDLE`, `EDS_TRACE_CHOICE`, `EMERGENT_POS` — all unset on every host).
>    * **THE PARTITION IS THE ARCHITECTURE** — two-for-two arm64 vs three-for-three x64. The
>      MECHANISM (fused multiply-add contraction in V8's C++ `ieee754` port compiled for arm64,
>      or the arm64 code generator) is a HYPOTHESIS by #144(a) — unprobed, and nothing here
>      depends on it. What is a FINDING: a last-ulp difference somewhere in `Math.*` is amplified
>      by a 142-match deterministic sim into a different save JSON; the sim is deterministic ON
>      EACH architecture (repeated x64 runs per host byte-equal; the recorded arm64 digests stable
>      through every arc).
> 2. ⭐⭐⭐ **THE LAW — 甲 (the commander's, on the user's standing 自走; a process law, not a
>    world change).** (i) **A digest carries its architecture.** Every whole-match signature,
>    pooled digest and fingerprint of record in `tests/` and `docs/` is an **arm64** number;
>    arm64 remains THE ARCHITECTURE OF RECORD and CI (`macos-latest`) its arbiter. x64 is a
>    SECOND COLUMN, opened this round: the x64 fingerprint of record = item 1's value.
>    (ii) **New pin suites key their digest tables by `process.arch`** (`arm64` / `x64`). The
>    x64 column is RECORDED on this host at the dispatch head in a clean throwaway worktree (the
>    DS-T0d form, unchanged). The arm64 column is filled ONLY by one of two honest routes: (a)
>    **INHERITED BY IDENTITY** — the same seeds AND the same signature recipe as an existing
>    suite whose arm64 literals are of record AND whose world is byte-identical since (the
>    inheritance stated in the test, literal for literal, with the source suite named); or (b)
>    **ABSENT** — the pin skips on that architecture and says so in its title; never a guess,
>    never a number typed from memory. CI's next green is the arm64 check of (a). (iii)
>    **Pre-existing arm64-only pins are FROZEN and NOT edited.** On this host they are RED BY
>    CONSTRUCTION; item 3 is their inventory. From this round the executor's and verifier's
>    "full suite serial" verdict reads: **green outside the #418 inventory**; a red OUTSIDE the
>    inventory, or a red inside it whose assertion is not a digest / fingerprint / path-separator
>    comparison, is the stage's own. (iv) **Path separators**: `join()` yields a backslash on
>    Windows; seam-map pins that compare path literals are test-side reds (inventory); new suites
>    normalize to `/` (a positive narrow, listed). (v) **Numbers of record are architecture-
>    stamped.** Every census and exam table to date (IF-C0's included) was measured on arm64; a
>    number measured on this host is an x64 number. Within one host, arms compare EXACTLY (an
>    exam's control arm and candidate arm run here together); ACROSS architectures a comparison
>    is ≈ and is declared so where it is made. IF-T1's reads against IF-C0's table (#417 item
>    3, the table of record) are therefore ≈ by construction — the T1 dispatch ruling freezes
>    its reads with that stamp; the exam's own control arm (OWNCOOP on this host) is the exact
>    comparator.
> 3. **THE x64 INVENTORY OF RECORD** (this host, HEAD `8d98358`, LF tree; the full suite run
>    with default parallelism, every failing file then re-run SERIALLY to strip load
>    timeouts; only the serial re-run's reds are listed):
>    **59 reds in 43 files, four classes; 2,314 / 2,373 green outside them.**
>    **(A) arm64 digest / fingerprint literals — 35**: the fingerprint pin (`57b0bdab…` expected,
>    `59f42aa7…` observed) ×1 each in `a4HomeGrant` · `a4HomeMap` · `a4HomePriorGene` · `a4PlaytestEntry` ·
>    `a4PlaytestEntryV2` · `a4PlaytestEntryV3` · `a4RestAbandon` · `a4S2P2PerBodyOffsetGene` ·
>    `a4S2VectorGrant` · `bfFacingCost` · `bqCushion` · `gkDiveBody` · `lnOwnLane` · `mtPlaytestEntry` ·
>    `o1PassWindup` · `o2Look` · `rcAnticipate` · `rcReady` (18); the pooled IDENTITY digests ×1 each in
>    `bqPlaytestEntry` (`1d321cf`) · `gkPlaytestEntry` (`a5a6b73`) · `lnPlaytestEntry` (`7fe1d41`) (3); the
>    IDENTITY digest + the stored E13 exam signatures ×2 each in `dsPlaytestEntry` (`0eefb9a`, `OWN-E13-ABSENT`)
>    · `ds2PlaytestEntry` (`4d3ff94`, `OWNCOOP-E13`) (4); G-OFF ×4 + the fingerprint ×1 in `dsOwnRun` (bare ·
>    13 · 15 · 12&14) and in `dsCoopHatsOff` (bare · 13 · 15 · 16) (10).
>    **(C) path separators — 20** (`src\…` vs `src/…`, every one a `join()` on Windows; `dsCoopHatsOff`'s
>    "expected 1 to be +0" is the same — `f === 'src/sim/Match.ts'` never true): `bfFacingCost` ×2 ·
>    `bkCorridorPrice` ×1 · `bqCushion` ×2 · `dlcDeliveryChoice` ×1 · `dlcStrikePlane` ×1 · `dsCoopHatsOff` ×2
>    · `dsOwnRun` ×2 · `dvDeliveryValue` ×1 · `dxWindupAim` ×2 · `gcGroundCorridor` ×1 · `obmEyesSeat` ×1 ·
>    `ptpPassLead` ×1 · `raAccessPrice` ×1 · `rcAnticipate` ×1 · `rcReady` ×1.
>    **(B) a seed-specific OUTCOME literal on x64 — 1**: `stamina.test.ts:73` "a full match SPENDS the tank"
>    expects < 0.93, observes 0.940625 on this architecture (green on CI arm64) — the trajectory moved, not
>    the law; NOT edited.
>    **(D) timeouts on this host at the file's OWN limit even SERIALLY — 3**: `careers.test.ts` save/load
>    roundtrip (20 s) · `formationEvolution.test.ts` ten seasons (180 s) · `simRunner.test.ts` multi-season
>    (20 s). Host speed, not logic (the same files' other cases green); the load-timeout debt already stands.
>    STRUCK from the inventory — 11 parallel-only timeouts that passed on the serial re-run: `a4S2P2` born-
>    equivalence · `bkCorridorPrice` dormancy · `cards` ×2 · `careers` ×2 · `cup` · `genes` · `obmEyesSeat`
>    checklist · `offside` · `shootout`. Logs: the commander's scratchpad
>    (`suite-parallel-win-8d98358.log`, `suite-serial-rerun-8d98358.log`); re-derive with
>    `NO_COLOR=1 npx vitest run` then `--no-file-parallelism` on the failing files.
> 4. **CANON**: NEW entry under *World & engine law* — **digests carry their architecture** —
>    VERBATIM from item 2(i)–(ii): "A digest carries its architecture." and "The arm64 column is
>    filled ONLY by one of two honest routes: (a) INHERITED BY IDENTITY … or (b) ABSENT … never a
>    guess, never a number typed from memory." home: this ruling, item 2. `CANON.md` refreshed
>    this round.
> 5. ⭐⭐⭐ **IF-T0 「球在飞时的前插 · 缝」 — #417 item 3 AMENDED, everything not named here
>    unchanged:** (i) the G-OFF pin (#417 item 3(ii) first clause) becomes an ARCH-KEYED table:
>    the x64 column recorded at the dispatch head (this ruling's commit) in a clean throwaway
>    worktree on the twelve seeds **900,007,400–411** (DS-T0d's own G-OFF seeds — a DECLARED
>    positive deviation from the 900,008,2xx band for THIS pin only, so that the arm64 column can
>    be INHERITED BY IDENTITY from `tests/dsCoopHatsOff.test.ts`'s `HEAD_DIGESTS` for bare · 13 ·
>    15 · 16 — same seeds, same `signatureOf`, worlds ≤ 16 byte-identical since `f1a46b1` by
>    #413/#415 — with the inheritance stated); world 17's arm64 digest has NO literal of record
>    with that recipe ⇒ ABSENT, skipped on arm64 by title, RECORDED on x64. (ii) the fingerprint
>    pin becomes arch-keyed: arm64 `57b0bdab…c673` (of record) · x64 item 1's value (of record
>    from this ruling). (iii) every other walk stays in 900,008,200–299 (executor) / 300–399
>    (verifier). (iv) the seam-map file paths normalized to `/`. (v) the "full suite serial"
>    deliverable of both the executor and the verifier = the serial result MINUS item 3's
>    inventory, the subtraction shown file by file; the verifier ALSO runs `npm run fingerprint`
>    and quotes it against item 1. (vi) the intended-receiver FIXTURE, the four mutants, the
>    read-set needles, the pure-insertion proof, the eighth literal, `dsOwnRun.test.ts`'s
>    positive narrow, the stage doc — all as #417 item 3 wrote them.
> 6. **THE GATES OF RECORD**: unchanged — world 12 (open) · world 13 CLOSED KEEP · worlds 14 ·
>    15 · 16 · 17 OPEN (world 17 deployed at the user's push of 2026-09-13; the badge is the
>    ground truth). **CONSUMPTION**: zero frontier, zero stats. Frontier: next sim ≥
>    12,559,000; stats ≥ 117,600; registry 86. THE QUEUE: **IF-T0 (dispatched this round, after
>    this ruling's commit)** → IF-T1 (reads frozen at its dispatch, ≈-stamped against IF-C0) →
>    entry / a restraint slice / stop; the four eye gates in parallel; DS-T0e HELD; ⑤ last.

> **COMMANDER RULING #419 (2026-09-19 — ⭐⭐⭐ IF-T0 「球在飞时的前插 · 缝」 LANDED (commit `d0f4a79`,
> verifier PASS, zero HIGH): ONE flag, ONE per-body belief, ONE more perceived state, the EIGHTH `why`;
> G-OFF byte-identical on the x64 column across five worlds, the arm64 column inherited by identity; the
> x64 fingerprint of record reproduced; 89 insertions / 0 deletions across the three src files; the #418
> inventory subtraction EXACT (57 reds, all inside it); TWO MEDIUM disposed — (1) the door and the belief
> were read ONE LINE ABOVE the fork so a frozen DS-T0c pin would stay green with a title now false ⇒
> NOT ACCEPTED, the honest repair dispatched; (2) the eighth state ranks the REMEMBERED PASSER as a
> competitor where the seventh excludes the perceived carrier ⇒ ACCEPTED AS THE LAW, declared, M-IF.3
> clarified; four LOW = doc corrections ⇒ 🔄 IF-T0-FIX DISPATCHED (the R8-FIX form: a small commit + its
> own verify); IF-T0 BANKS at the FIX's PASS):**
>
> 0. **BOOKKEEPING.** Dispatch head `595a555`; the commit `d0f4a79` sits on `main` unpushed above it —
>    the programme's convention (rulings and stage commits share the line the user pushes; the
>    executor's own branch-first rule does not apply here and its deviation 9 is disposed as such).
>    Nothing pushed; the user pushes. Frontier and stats consumption ZERO.
> 1. ⭐⭐⭐ **IF-T0 LANDED — what the verifier re-derived, not read.** (a) Git: exactly one commit, six
>    authorized files, none other. (b) Contract §2 M-IF.1–4 clause by clause: identity tests only (the
>    seam's own lines carry no `<`/`>`; the frozen DS-T0c "compares" pin still enumerates exactly two
>    inequality lines); no constant (the only numeric literal is `cands.length - 1`); no truth read
>    (`pendingPass` · `match.ball` · `ball.owner` · `lastTouch` · `info.genome` each 0 over the span);
>    ONE pull, MEASURED 0 · 0 · 1 · 1 over 120 subjects per arm; the same candidate at the same score
>    (`MakeRun` push count 6, independently counted; the eighth `why` is a RELABEL of `cands[last]`);
>    the eighth literal exactly once in `src/`; default OFF, no env door, no bundle default, no world
>    1–17 names it. (c) PURE INSERTION: whole-file stripped diffs `PlayerBrain.ts` 40 added / 0 deleted
>    (hunks 2212a · 2228a · 2259a), `Match.ts` 48 / 0, `League.ts` 1 / 0 — 89 / 0, every hunk `a`.
>    (d) G-OFF on the verifier's OWN seeds 900,008,300–311, clean throwaway worktrees at `595a555` and
>    `d0f4a79`: bare · 13 · 15 · 16 · 17 BYTE-EQUAL per world; the executor's five x64 literals
>    re-derived from scratch at the dispatch head, character for character (bare `43d4174d…1d16` · 13
>    `796b13a3…93f0` · 15 `7b5fcd1b…f805` · 16 `4ca9ac54…cfa0` · 17 `6b5ecaa3…971d`); `npm run
>    fingerprint` at the commit = `59f42aa7…a072d`, #418 item 1's x64 value exactly. (e) The arm64
>    column: the four inherited literals character-for-character `dsCoopHatsOff.test.ts`'s
>    `HEAD_DIGESTS`; no x64 value equals its arm64 twin (the negative control); world 17 ABSENT and
>    skipped by title on arm64. (f) The mutants at source: M1 5 · M2 8 · M3 collection failure (the
>    inverted door destroys the seam-span anchor — an honest but non-enumerable kill; the executor's
>    supplementary surgical form M3′ 13, the verifier's broader M3′ 15 — both decisive) · M4 6 on the
>    stored divergence seed 900,008,260. (g) THE FULL SUITE SERIAL at `d0f4a79`, twice (executor
>    3,558 s, verifier 3,419 s, identical): 2,354 / 2,411 green, 57 red in 36 files, EVERY red inside
>    the #418 inventory class for class (A 35 · C 20 · B 1 · D 1 — `formationEvolution`); `careers`
>    and `simRunner` (class D) did NOT recur — fewer than the inventory, never more. ZERO outside.
>    `tsc --noEmit` clean. (h) The intended-receiver FIXTURE (#416 item 3(i)): a firing AND a
>    non-firing case, the suite's first — the fifth walk-side strike DISCHARGED.
> 2. ⭐⭐⭐ **MEDIUM 1 — THE ALIASES ABOVE THE FORK: NOT ACCEPTED.** The executor read the door and the
>    belief (`const ifFlightRun = match.ifFlightRun; const ifLastSeenOwner = match.ifLastSeenOwnerGid;`)
>    one line ABOVE `if (match.dsOwnRun) {` so that DS-T0c's frozen pin "the ONLY `match` members the
>    block touches are the flag, the clock and the percept" (`tests/dsOwnRun.test.ts` ~L736) would stay
>    green — and said so plainly (§DEVIATIONS 2, the report's item (2)). The behaviour IS contained
>    (measured: the flag without `dsOwnRun` ⇒ zero eighth `why`, the map empty) and the executor's
>    reason was a real constraint (#417 item 3 authorised ONE narrow in that file). But M-IF.4 says the
>    flag lives INSIDE the fork, and a pin whose title is false while its assertion passes is exactly
>    the silent kind canon exists to forbid (walk-side definitions pinned; the DS-T0c pin now
>    UNDERSTATES the fork's true `match` read set — five, not three). ⇒ THE HONEST REPAIR: the two
>    alias statements MOVE INSIDE the fork as its first two statements (no new `if`, no inequality —
>    the frozen conditional-set and compares pins untouched), and the member-set pin is NARROWED
>    POSITIVELY 3 → 5 (`match.dsOwnRun` · `match.ifFlightRun` · `match.ifLastSeenOwnerGid` ·
>    `match.perceivedSnapshot` · `match.simTime`, in the pin's own order) — a SECOND authorised narrow
>    in `dsOwnRun.test.ts`, listed. The two property reads then execute only under `dsOwnRun`, as the
>    contract reads. The G-OFF digests cannot move (the OFF world never enters the fork); the FIX's
>    verify proves it.
> 3. ⭐⭐ **MEDIUM 2 — THE REMEMBERED PASSER RANKS AS A COMPETITOR: ACCEPTED AS THE LAW, DECLARED.**
>    The rank loop skips `mate.gid === ownerGid` — the perceived CARRIER. In the eighth state
>    `ownerGid === null` by construction, so nobody is skipped and the body the runner REMEMBERS with
>    the ball is ranked like any mate. VISION and REALITY read the same way: in the eighth state
>    nobody HAS the ball — the passer released it and is a runner like the rest (the give-and-go is
>    made of exactly that); excluding him would be a hand-coded exception on a memory, not on a
>    percept. M-IF.3's "over the same perceived mates" is CLARIFIED in the contract this round: the
>    restraint ranks the mates his eyes hold minus the perceived carrier IF there is one — in the
>    eighth state there is none. The two states therefore rank over different mate sets, and the
>    stage doc's §LAW sentence "THE RANKING · THE RANK ABOVE HIM · THE RESTRAINT · THE SCORE ALL
>    UNCHANGED" is corrected to say so. IF-T1 measures the consequence (a face: the eighth-why
>    class's own restraint partition).
> 4. **THE FOUR LOW — doc corrections, all in the stage doc:** (i) §HONESTY 3's provenance — the grep
>    quoted returns FIVE probes (`ds-t1` · `ds-t1b` · `ds-t1c` · `ds-t1d-coop-hats-exam` ·
>    `if-c0-flight-run-census`); `ds-c0-designation-census.ts`'s `hatClassOf` is a SIX-literal
>    classifier in which the seventh already lands in OTHER — named separately, correctly; the
>    substantive claim (the eighth lands in OTHER everywhere, nothing edited) stands. (ii) M4's scan:
>    every seed in the band diverges (verifier re-derived 12 / 12 — 4,741 · 5,638 · 4,755 · 6,743 ·
>    7,814 · 7,324 · 5,190 · 7,231 · 6,170 · 4,621 · 5,529 · 5,779); the stored seed 900,008,260 is
>    the band's FIRST and its 4,741 reproduces — the doc says "reproduced", not "selected". (iii) M3′'s
>    exact mutation text goes into the table (the executor's 13 is not reproducible without it; the
>    verifier's broader form gives 15). (iv) §DEVIATIONS aligned one-to-one with the report (the
>    `p.action.scores` top-four note stays; the commit-on-`main` note enters as the programme's
>    convention, item 0).
> 5. 🔄 **IF-T0-FIX — DISPATCHED (the R8-FIX form, #314): ONE commit above `d0f4a79`; Draft + its
>    own independent Verify.** (i) `src/ai/PlayerBrain.ts` ONLY: the two alias statements and their
>    comment MOVED to be the first statements inside `if (match.dsOwnRun) {`; the comment re-worded to
>    say INSIDE and cite this ruling; nothing else in `src/**`. The whole-file stripped diff against
>    the DISPATCH HEAD `595a555` must STILL be a pure insertion (the lines are inserted elsewhere, none
>    of the shipped ones move). (ii) `tests/dsOwnRun.test.ts`: the member-set pin narrowed positively
>    3 → 5 (item 2) — the file's SECOND and last authorised narrow; the conditional-set and compares
>    pins must pass UNCHANGED. (iii) `tests/ifFlightRun.test.ts`: any pin or comment that described the
>    above-the-fork placement (F6/F7's read-set wording, the seam-span anchors) updated to the inside
>    placement; the arch-keyed G-OFF literals UNTOUCHED (they cannot move); the M3′ row given its exact
>    mutation text. (iv) the stage doc: items 3 and 4 applied; §DEVIATIONS 2 rewritten as "aliases
>    inside the fork from the FIX; the DS-T0c member-set pin narrowed 3 → 5 (positive, #419 item 2)".
>    (v) VERIFY: pure insertion vs `595a555` re-proved with counts; the new suite green on x64 with the
>    same five x64 G-OFF literals; `dsOwnRun.test.ts` serial — its reds exactly the #418 inventory's
>    (5 A + 2 C) and the narrowed pin green with FIVE members; `dsCoopHatsOff.test.ts` serial — reds
>    exactly its inventory entries (5 A + 2 C); `npm run fingerprint` = the x64 value of record; every
>    doc correction present. Scratch band 900,008,300–399 for the verifier; ZERO frontier.
> 6. **CONTRACTS & CANON**: `IF-FLIGHT-RUN-CONTRACT.md` §2 M-IF.3 clarified (item 3) and STATUS #419.
>    `CANON.md` unchanged. **THE GATES**: unchanged. **THE QUEUE**: IF-T0-FIX (this round) → IF-T0
>    BANKED at its PASS → IF-T1's dispatch ruling (the reads frozen, ≈-stamped against IF-C0) → entry /
>    a restraint slice / stop.

> **COMMANDER RULING #420 (2026-09-19 — ⭐⭐⭐ IF-T0 「球在飞时的前插 · 缝」 BANKED-DORMANT (the FIX
> `e65b198` verifier PASS: the door and the belief read INSIDE the fork, the DS-T0c member-set pin
> narrowed 3 → 5 positively, the four doc corrections in; the x64 G-OFF literals unmoved; pure insertion
> vs the dispatch head re-proved) ⇒ 🔄 IF-T1 「球在飞时的前插 · 考」 DISPATCHED — the exam of the run onto
> the flight, in the DS-T1d form, with THREE frozen reads copied into the contract; ⭐ THE FIRST EXAM ON
> THE x64 HOST: its control arm is the exact comparator, IF-C0's arm64 table is ≈, and G-REPRO is
> architecture-aware by construction):**
>
> 0. **BOOKKEEPING.** IF-T0 = `d0f4a79` + the FIX `e65b198`, both on `main` above the #418/#419
>    docs commits, unpushed — the user pushes (`git log --oneline origin/main..HEAD`). Nothing ships:
>    `ifFlightRun` defaults OFF, no env door, named by no world; the production fingerprint on x64
>    `59f42aa7…a072d` (of record, #418 item 1) and on arm64 `57b0bdab…c673` (of record). Frontier and
>    stats consumption so far this round ZERO.
> 1. ⭐⭐⭐ **IF-T0 BANKED-DORMANT — the facts of record** (#419 item 1 stands whole; the FIX adds):
>    (a) the FIX `e65b198` (parent `26de047`; four files — `PlayerBrain.ts`, `dsOwnRun.test.ts`,
>    `ifFlightRun.test.ts`, the stage doc; nothing pushed — `git ls-remote origin` = `8d98358`). (b) THE
>    PLACEMENT: the two alias reads are the first two executable statements inside `if (match.dsOwnRun) {`
>    (`PlayerBrain.ts` 2221–2222); `match.ifFlightRun` / `match.ifLastSeenOwnerGid` occur nowhere else in the
>    file; no new `if`, no numeric comparison; the frozen ten-`if` and two-compares pins GREEN unchanged.
>    (c) PURE INSERTION vs `595a555` re-proved by the prescribed method: `PlayerBrain.ts` 41 / 0 (three
>    hunks, every one `a`); `git diff --numstat` over `src/` = 90 / 0; vs `d0f4a79` the stripped diff is a
>    MOVE plus the authorised comment re-wording, nothing else. (d) THE NARROW: the DS-T0c member-set pin
>    lists FIVE and is GREEN; `dsOwnRun.test.ts` serial 7 red = exactly its #418 entries (5 A + 2 C);
>    `dsCoopHatsOff.test.ts` serial 7 red = exactly its entries; `ifFlightRun.test.ts` 38 / 38; `tsc` clean;
>    `npm run fingerprint` = the x64 value of record. (e) ⭐ MEDIUM, DISCLOSED BY THE AUTHOR AND CONFIRMED
>    BY THE VERIFIER: the F7 placement pin at `d0f4a79` was VACUOUS (a four-space `toContain` satisfied by a
>    six-space line) — M-IF.4's placement half had NO suite backstop when #419 item 1(b) was written; the
>    FIX replaced it with a first-two-executable-statements assertion, FALSIFIED by the verifier against
>    `d0f4a79`'s file (the pin goes red there) — a positive addition inside an authorised file, REGISTERED;
>    #419 item 1(b)'s containment claim stands on the MEASURED containment (zero eighth `why` without
>    `dsOwnRun`), which was never vacuous. (f) THE MUTANT TABLE OF RECORD: M3′ = the three-site in-seam
>    inversion with its exact replacements, 15 pins RED, re-derived by the verifier on the row's own text;
>    #419 item 1(f)'s "13" is a REPORTED figure with no reproducible text and is STRUCK as a number of
>    record (the row names it as such). (g) LOW: the `dsOwnRun` seam-map pin fails at its first assertion on
>    Windows, so its count assertions never execute here (class C, inventory) — the verifier closed the gap
>    by grep (`match.dsOwnRun` code occurrences = 1) and by `dsCoopHatsOff`'s green seam-map pin; a cosmetic
>    reflow in the stage doc. (h) The FIX did not re-run the full suite (three files named); the full-suite
>    subtraction of record stays IF-T0's at `d0f4a79` (twice, identical) — the FIX touched one src file by a
>    move.
>    THE LAW OF RECORD for the seam = `IF-T0-FLIGHT-RUN-SEAM.md` §LAW as corrected at the FIX (the two
>    states; the read set of FIVE `match` members inside the fork; the eighth state ranking the
>    remembered passer as a mate — #419 item 3). The intended-receiver predicate is FIXTURED (the fifth
>    walk-side strike discharged, #419 item 1(h)); the eighth `why` lands in OTHER in every frozen
>    seven-literal classifier and in `ds-c0`'s six-literal one, none edited (contract §4, declared).
> 2. ⭐⭐⭐ **IF-T1 「球在飞时的前插 · 考」 — DISPATCHED** (X-SRC-ZERO; Draft + independent Verify in the
>    DS-T1d form; FREEZE then RESULTS, two commits, the instrument byte-identical between them).
>    (i) **ARMS — FIVE, the OBM seat ABSENT throughout.** On E13 (world 13 empty-book): **`HATS-E13`**
>    (13) · **`OWNCOOP-E13`** (13 + `dsOwnRun` + `dsHatsOff` + `dsCoopHatsOff` — world 17's door set,
>    THE CONTROL) · **`OWNCOOP+IF-E13`** (the same + `ifFlightRun` — the WORLD-18 CANDIDATE); on D13
>    (the shipped loaders' L3 / PC doses) **`OWNCOOP-D13`** and **`OWNCOOP+IF-D13`** beside. THE
>    COMPARISON OF RECORD = `OWNCOOP+IF-E13` vs `OWNCOOP-E13`, paired on shared seeds; `HATS-E13` vs
>    `OWNCOOP+IF-E13` printed beside (world 13 against the world-18 candidate); the D13 pair beside. The
>    composer `a4MatchFlags(13)` CALLED; the doors set by the exam's OWN construction (IF-C0 §P.A's
>    form); `gWorld` proves every arm's flag set on the construction receipt and every walked match.
>    (ii) **FACES** (published on EVERY arm; ⛔ NO verdict word on any): **R1** (DS-T1c's predicate —
>    executed runs per in-possession open-play team-tick, the bodies not the board; `beyondToleranceUp`;
>    LOO off the `loo` array, every flipping row's seeds stored); **THE BAND** F-DS-b, ten limbs, by
>    anchor, tolerances by the house form, every breach with its direction; **THE SEAM'S OWN FACES**
>    (DS-T1c's, inherited) PLUS the eighth `why` as ITS OWN CLASS — the NINE-cell classifier becomes
>    TEN (`ownRunOntoFlight`), with DS-C0's eight-cell mirror beside — and for that class: its START-
>    STATE partition (the ball he sees loose · in the air (`|vel|` > 0 — a stored partition, not a
>    gate) · his memory's owner = the last passer · = another mate), its RESTRAINT partition (exactly 0
>    · exactly 1 · between; the remembered passer counted in `rankAbove` — #419 item 3's face), its
>    YIELD (the own-run yield family off the engine's ledgers) beside the seventh's; **IF-C0's Q4 FACES
>    AS FACES**, copied BY FIELD NAME from `if-c0-flight-run-census.ts`: the negative Δt half
>    (`emptiness.negativeDeltaT`'s partition), the eventual receiver's `startedDuringTheFlight` share,
>    `flight.intendedReceiverShare` (now FIXTURED — the firing / non-firing pair inherited from
>    `tests/ifFlightRun.test.ts`, cited by test title), same-side bodies already running at the release
>    (mean + bins), `run.inFlightShare`, the LEAK partition (`stalePasserStillCredited` — unchanged by
>    construction, PRINTED), the in-flight own-run yield vs at-feet; **the coupling faces** (DS-C0's,
>    by field name) and **the crowding family** (OBM-T1's, `spacingUnder4` included) beside; the
>    per-state line. **⭐ THE ≈ STAMP (#418 item 2(v))**: every face of this exam is an x64 number;
>    beside each face that IF-C0 also published, IF-C0's arm64 value is printed under `approx.ifC0`
>    with the stamp "≈ cross-architecture" — printed, never selecting; the CONTROL ARM on this host is
>    the exact comparator.
>    (iii) **THE READS, frozen ex ante** — three literals + the fallback, copied CHARACTER FOR
>    CHARACTER into the contract §3 this round (three homes must agree byte for byte:
>    this ruling, the contract, the instrument), on the comparison of record (`OWNCOOP+IF-E13` vs
>    `OWNCOOP-E13`, the seat absent):
>    **read 1** — *"THE FLIGHT RUN COSTS NOTHING THE BAND CAN SEE — IF-ENTRY is named (world 18 = 17 +
>    the run onto the flight)."*
>    **read 2** — *"THE FLIGHT RUN CARRIES A FACE — the guard is named; the commander decides between a
>    restraint slice and stop with the table."*
>    **read 3** — *"THE FLIGHT RUN FLOODS — the restraint needs the flight: a restraint slice is named
>    before any entry."*
>    **the FALLBACK** — *"THE READS DO NOT COVER THE SHAPE — the commander decides with the table."*
>    PRECEDENCE on STORED booleans: a **breach** (`holdsBand` FALSE) ⇒ read 2; else `floods` (R1 UP
>    beyond tolerance, resolved) ⇒ read 3; else ⇒ read 1; the fallback fires only if a stored boolean
>    is ABSENT (a defect, not a shape). ⭐ **LIVENESS IS A PRECONDITION OF EVERY READ**: if `gBiteIF`
>    (below) is RED, NO read is selected and the string *"THE SEAM DID NOT FIRE — no read"* is stored
>    instead. Printed beside every read, from stored fields, NO verdict word: the honesty line (*"nothing
>    the band can see" is NOT "nothing the eye can see" — the user's gate at world 18 judges*); the R1
>    ratio with its interval; the eighth class's count per match and its three partitions; the yield
>    pair (seventh · eighth); the Q4 faces with their ≈ twins; D13's word and the HATS-vs-candidate
>    guard table with its own `holdsBand` word — STORED counterfactuals, NEITHER SELECTING.
>    (iv) **GATES** — DS-T1d's set by anchor, with these changes: **`gBiteIF`** (the #414 ROW form,
>    VERBATIM from CANON *rare-event liveness on the row*): on every seed where the candidate arm
>    recorded ≥ 1 eighth-`why` decision, the candidate's and the control's per-seed ROWS differ in at
>    least one stored field — a STORED boolean; its non-vacuity = the eighth-`why` count > 0 on the
>    candidate arm over the battery; **`gArmIF`**: the eighth-`why` count is EXACTLY 0 on every arm
>    NOT carrying `ifFlightRun` and the belief map EMPTY there (a stored boolean of construction,
>    never narrated); **`gRepro` ARCHITECTURE-AWARE** (#418 item 2(v)): the RE-WALK of IF-C0's
>    `12,558,000–002` on `OWNCOOP-E13` and `HATS-E13` against `if-c0-flight-run-census.json`'s
>    `perSeedCells[]` GATES only when `process.arch === 'arm64'`; on x64 it STORES the re-walked rows
>    beside the arm64 rows as `repro.crossArch` (every differing field enumerated) and `gRepro` reads
>    `'≈ cross-architecture (stored, not gated)'` — the instrument's OWN determinism (`gDeterminism`,
>    the same seed walked twice byte-equal) and `gLockstep` carry the reproduction burden on this host;
>    **X-FP-PROD** arch-keyed (the x64 value of record); `gPredicateFixtures` includes the intended-
>    receiver pair; `gPullCount` (DS-T1c's idiom on every armed arm — ONE pull per own-run evaluation,
>    the belief write inside it); `gCodeFactGraph` incl. the seam's five-member read set at the FIX's
>    line numbers; `gSrcUntouched`; `gScratchBand`; `gSeedsBookedEqualWalked`; `gN`; `gTwoFractions`;
>    `gAnchoredConstants`; `gLedgerRead` (ONE new registered read: `match.ifLastSeenOwnerGid`, the
>    seam's own belief, read for the start-state partition — registry 86 → 87); `gClassesNonVacuous`
>    (the tenth cell non-vacuous on the candidate arms — this IS `gBiteIF`'s non-vacuity, stored
>    once); `gFaces` (every published face re-derived off the serialized artifact; bins stored for
>    every percentile face); `gReadLiterals` (three homes byte-equal); `gHashOrder`; `gStage`.
>    (v) **SEEDS** — block **12,559,000–999** (verify fresh against every consumed block … IF-C0
>    12,558,000–999); battery `12,559,000–998`, construction receipt `12,559,999`; N sized by a
>    DISCLOSED 12-seed smoke on `900,008,400–411` at a declared 0.05 half-width on R1's paired Δ
>    (candidate vs control, E13) and on the negative-Δt half's paired Δ; N = min(required, the block's
>    affordance) TAKEN AS THE AFFORDANCE (the #414 §CORR 8 floor reading) — say which; smoke receipt
>    `900,008,420`; world pin `470`; lockstep + X-DET + gPullCount `490–491`; fixtures' draw `499`; band
>    `900,008,400–499` STORED and asserted; verifier band `900,008,500–599`; the RE-WALKS
>    `12,558,000–002` are IF-C0's own consumed band (not a consumption); stats `{ consumed: 0,
>    nextBase: 117_600, registryOfRecord: 87 }`. ⚠ WALL TIME ON THIS HOST: five arms × the block is
>    the first full battery on x64 — the smoke STORES `perf.meanWallSecondsPerMatch` and the executor
>    runs the battery in the background with a log, polling; if the affordance would exceed ~10 h it
>    HALVES N and says so in §DEVIATIONS (a sizing deviation, never a read change).
>    (vi) **FILES** — `docs/world-model/IF-T1-FLIGHT-RUN-EXAM.md` (§0 with the arc's readings quoted by
>    field · §P inherited from DS-T1d section by section with each change ⭐ AMENDMENT · §DEV-PREFLIGHT
>    · §R1–§R6 with §R6 在说人话的层面 · §HONEST LIMITS the ONE home · §DEVIATIONS · §GATES with the
>    final hash and bytes), `scripts/probes/if-t1-flight-run-exam.ts` (copied BY RECIPE from
>    `ds-t1d-coop-hats-exam.ts` and `if-c0-flight-run-census.ts`), `docs/world-model/data/
>    if-t1-flight-run-exam.json` (compact; body hash last; `receipts.hashReproducesFromFile`);
>    X-SRC-ZERO — not one byte under `src/` or `tests/`; explicit paths; never push.
>    (vii) **WHAT THE READS WOULD MEAN** (the commander's, not the exam's): read 1 ⇒ IF-ENTRY drafted
>    (world 18 = 17 + `ifFlightRun`, the honest brief in the player's language, the user's gate
>    「看见球飞就跑 (v18) — keep | change | revert」); read 2 ⇒ the guard's own census before anything;
>    read 3 ⇒ a restraint slice designed on the eighth class's restraint partition (the coach's count
>    already binds it — what floods is the STATE, so the slice is about WHEN the memory counts, not a
>    weight); *no read* ⇒ the seam's liveness is the next question.
> 3. **CONTRACTS & CANON**: `IF-FLIGHT-RUN-CONTRACT.md` §3 IF-T1 REWRITTEN with the three reads verbatim
>    and the ≈ stamp; STATUS #420. `CANON.md` unchanged. **THE GATES OF RECORD**: world 12 (open) · 13
>    CLOSED KEEP · 14 · 15 · 16 · 17 OPEN. **CONSUMPTION**: block 12,559,000–999 BOOKED to IF-T1 at its
>    freeze; frontier next sim ≥ **12,560,000** once booked; stats ≥ 117,600; registry 87 at IF-T1's
>    freeze. THE QUEUE: **IF-T1 (dispatched)** → IF-ENTRY / a restraint slice / stop; the four eye gates
>    in parallel; DS-T0e HELD; ⑤ last.

> **COMMANDER RULING #421 (2026-09-19 — ⭐⭐⭐ IF-T1 「球在飞时的前插 · 考」 BANKED (FREEZE `ff34357` ·
> RESULTS `fd613f4`; verifier PASS, zero HIGH; ALL 27 GATES GREEN, `allGreen` a STORED true; the instrument
> byte-identical between the commits; §0–§DEV-PREFLIGHT untouched after sight; X-SRC-ZERO): THE READ OF
> RECORD = **read 2** — *"THE FLIGHT RUN CARRIES A FACE — the guard is named; the commander decides between
> a restraint slice and stop with the table."* — selected at precedence step (1), a BREACH; THE GUARD NAMED
> = **G9 through balls per match, UP** (5.557558 → 8.297297, +49 %, 1.78× tolerance, zero LOO flips, the
> same single breach on every door-carrying pair); the FLOOD printed, not read (R1 ×3.16); four MEDIUM +
> four LOW disposed in place as the exam doc's §COMMANDER CORRECTIONS (all stale text inside the hashed
> artifact — no read, no gate, no number moves); ⭐ THE RESTRAINT FORK IS THE USER'S — 等待裁决; NOTHING
> DISPATCHED; the block CONSUMED whole):**
>
> 0. **BOOKKEEPING.** Two commits above `ceaa3dc` on `main`, unpushed with the five before them — the
>    user pushes (`git log --oneline origin/main..HEAD`). X-SRC-ZERO (`git diff --stat ceaa3dc..HEAD -- src
>    tests` EMPTY). Nothing ships: `ifFlightRun` stays dormant; the x64 fingerprint of record unchanged
>    (`X-FP-PROD` GREEN, arch-keyed). Files: `IF-T1-FLIGHT-RUN-EXAM.md` (894 lines) ·
>    `scripts/probes/if-t1-flight-run-exam.ts` (7,581 lines) · `data/if-t1-flight-run-exam.json`
>    (34,144,497 bytes; `fileSha256 7ab686aa…e22b`, body `2baedec2…e118`, at the CANONICAL path — the
>    red-routing idiom did not fire).
> 1. ⭐⭐⭐ **THE READ OF RECORD — read 2, re-derived by the verifier off the serialized artifact with its
>    own code** (all 27 gate booleans rebuilt and equal to storage; the band re-derived on 36 guard rows
>    with ZERO mismatches; the five frozen strings byte-equal across this file, the contract §3, the
>    instrument and the exam doc). The selectors: `gBiteIF` GREEN (999 / 999 eligible rows differ; the
>    eighth `why` 730,280 decisions over the battery = **731.011011 per match**), so a read was owed;
>    `holdsBand` FALSE with `breachingGuards = ["G9 guard.throughBallsPerMatch"]` ⇒ step (1) ⇒ read 2.
>    `floods` TRUE (R1 0.244699 → 0.773695, Δ +0.528996 [0.521440, 0.536592] vs tolerance 0.067614,
>    ratio 3.161820) — PRINTED; the breach took precedence, exactly as frozen. D13's word `read2`
>    (`d13Agrees` true); the HATS-vs-candidate table's word `read2` — both stored, neither selecting.
>    `OWNCOOP-E13|HATS-E13` (DS-T1d's own comparison re-walked on this block and this architecture):
>    `holdsBand` TRUE, breach set EMPTY — world 17's read of record REPRODUCES on x64 as a WORD.
> 2. ⭐⭐⭐ **THE TABLE THE COMMANDER DECIDES WITH** (arm of record `OWNCOOP+IF-E13`, x64 numbers; the
>    control arm on this host the exact comparator; every IF-C0 twin ≈):
>    (a) THE GUARD: through balls per match 5.557558 → 8.297297 (Δ +2.739740 [2.519520, 2.973974] vs
>    1.535641); the ONLY breach on all three door-carrying pairs; G1–G8 unmoved or far inside; G10
>    offside FLAG true (gating nothing).
>    (b) THE SIZE OF THE CLASS: the tenth cell = **0.629314 of ALL attacking `MakeRun` decisions**;
>    135.701702 episodes per match, mean length 70.384942 ticks; visible candidates 3,064.968969 per
>    match (a floor).
>    (c) THE START STATE (116.227227 stamped starts per match): the ball he SEES is in the air
>    **1.000000** (loose 0.000000 — a measurement: the guard is `ownerGid === null`, which a still ball
>    also satisfies). His MEMORY holds **the last passer 0.166823 · another mate 0.833177**. The engine's
>    TRUTH at those ticks: `ballInFlight` **0.731602** · **`ownRestart` 0.227300** · `mateOwnsTheBall`
>    0.034450 · other 0.006649. ⇒ THE STATE IS LOOSER THAN THE USER'S SENTENCE: he runs on "my side had
>    the ball the last time I looked" — five times in six the body he remembers is NOT the passer, and
>    more than one start in five is at his OWN SIDE'S DEAD BALL (the perceived ball has no owner before
>    the taker picks it up — contract §4 said restarts were untouched; their BRANCHES are, the STATE is
>    not).
>    (d) THE RESTRAINT (#419 item 3's face, 2,960.532533 observations per match): exactly 0 **0.665404**
>    · exactly 1 0.332171 · between 0.002425 — the coach's count zeroes him two times in three, and the
>    class still floods.
>    (e) THE YIELD: 0.035510 shots per eighth-class episode vs the seventh's 0.049945 (HATS' runner-hat
>    0.063057); by truth state — at a mate's feet 0.029555 · in flight **0.008226** · at his own restart
>    **0.004163**; 4.818819 eighth-class-episode shots per match. Goals per match (G1) NOT breached.
>    (f) THE PASSER STILL DOES NOT SEE HIM: `flight.intendedReceiverShare` **0.000000** on every arm
>    (0 / 61,425 — FIXTURED now, a measurement); the receiver's `startedDuringTheFlight` 0.000000 →
>    0.004754; bodies already running at the release 0.869299 (≈ IF-C0 0.644204); in-flight share of
>    run starts 0.551466 (≈ 0.083077); the negative-Δt half 0.370729 (≈ 0.039719); the leak's
>    `stalePasserStillCredited` 0.859069 (≈ 0.894186) — unchanged by construction, printed.
>    (g) `gRepro` on x64 STORED, not gated: `HATS-E13` reproduces IF-C0's arm64 cells EXACTLY on 81 / 81
>    fields on all three seeds; `OWNCOOP-E13` differs on ONE field (`instrumentPulls`, an instrument
>    counter) on two seeds and on 51 fields on `12,558,001` — see item 4(vii) for the honest wording.
> 3. ⭐⭐⭐ **WHAT THE READ MEANS, AND THE FORK (the commander's, checked against VISION and REALITY).**
>    The seam WORKS as a capability — the run onto a flight exists, fires, and is chosen by the argmax
>    — and the band sees one thing: through balls +49 %. That face is not a mystery: 63 % of all runs are
>    now this class, so the passer finds a body in behind far more often. What VISION and REALITY object
>    to is not the through ball but THE STATE THAT LICENSES THE RUN: (i) the user's sentence was
>    「看见传球出去才跑」 — a run that starts BECAUSE he saw the pass leave a mate; the built state is "the
>    ball I see has no owner and the last owner I remember was a mate", which is satisfied by a stale
>    memory of a mate who is not the passer (0.833177) and by every dead ball of his own side
>    (0.227300); (ii) a real forward runs onto a ball played FORWARD, not onto a backpass or a clearance;
>    (iii) a real run needs a passer who might play him — 0 / 61,425 intended. The contract §4 declared
>    (ii) and (iii) non-claims; the exam now says the state without them floods. ⇒ **READ 2's OWN
>    SENTENCE: a restraint slice or stop — and WHICH restraint is a design fork on the user's football
>    intuition (#144(b), the #416 form), not the commander's to take alone.** THE OPTIONS, each an
>    identity or perception test, none a constant (the #200 red line honoured or named):
>    * **甲 — 死球不算** (the eighth state requires the game LIVE — `match.phase === 'playing'`, an
>      identity test on a state every body hears the whistle for). Removes the 0.227300 restart share
>      alone; cleanest; smallest.
>    * **乙 — 亲眼看见出脚** (the memory counts ONLY if written from a sighting of the ball AT A MATE'S
>      FEET on his PREVIOUS look and the ball he sees NOW has no owner — i.e. the pass left between two
>      consecutive looks of his own; a freshness test on his own two frames, no tick constant). This IS
>      the user's sentence; #200-clean; its honest cost: a body with old eyes does not start (VISION §1
>      感知诚实 — that is a player, not a bug). Expected to cut most of the 0.833177.
>    * **丙 — 球往前飞** (the perceived ball's velocity points toward the opponents' goal — a SIGN test
>      on his own percept). The most football-shaped; ⚠ it compares a football quantity against ZERO,
>      which the #200 red line has not yet admitted — a ruling on the red line itself if chosen.
>    * **丁 — 停** (the seam stays a dormant instrument; no world 18; the eye never sees it).
>    THE COMMANDER'S LEAN (VISION + REALITY, offered not taken): **乙 + 甲 together** — 乙 is the user's
>    own sentence built faithfully, 甲 is a whistle everyone hears; both are identity/perception tests;
>    丙 waits behind the red line; 丁 only if the user wants no run onto the flight at all. A restraint
>    slice = IF-T0b (dormant, pins from birth, the seven-literal probes untouched) → IF-T1b (this exam
>    re-walked by recipe on the next block; the reads unchanged).
> 4. **§COMMANDER CORRECTIONS on the exam doc (disposed in place; the artifact is FROZEN and NOT edited;
>    no read, gate or number moves):** (i) MEDIUM — `reads.precedence` and `reads.note` inside the
>    hashed body carry DS-T1d's TWO-read rule and stale provenance; the CODE and the sealed §P carry
>    #420's three-read rule, and step (1) fired, so no selection could differ; the strings are STALE
>    TEXT, corrected in the doc, the artifact left as it is. (ii) MEDIUM — `gSeedDisjoint` / `gSeedsBookedEqualWalked`
>    notes name DS-T1c's frontier and omit the two newest consumed blocks; the gate LOGIC holds all 15
>    blocks (verifier re-derived freshness independently against IF-C0 §P.H); stale notes, corrected in
>    the doc. (iii) MEDIUM — `stage.xSrcZero` asserts an accessor spy that §DEVIATIONS 5 says was
>    removed; the grep proves NO spy exists; §DEVIATIONS 5 is the truth. (iv) MEDIUM — `repro.crossArch`
>    does not exist; the rows live at `repro.rows` with `mismatches[]` / `delta{}` per row — a NAME
>    mismatch against the frozen §P (and against #420 item 2(iv)), the substance present; the doc's
>    references corrected to the real path. (v) LOW — `r1.what` and the 40 `toleranceForm` strings name
>    `OWN-E13` as the control; the computed tolerances are right on all 40 rows (verifier re-derived to
>    < 1e-12); stale text. (vi) LOW — "≈ 1.78" is the one hand-computed number in §R (2.739740 ÷
>    1.535641); it is now labelled as computed from the two stored fields. (vii) LOW — §HONEST LIMITS
>    5's "that is the architecture, not the seam" OVERSTATES the stored rows: `HATS-E13` 81 / 81 exact
>    on all three seeds; `OWNCOOP-E13` one instrument-side field on two seeds and 51 fields on one;
>    the attribution is now a HYPOTHESIS (#144(a)) — the cross-arch table is stored, not read. (viii)
>    LOW — `gFacesDetail` (3,357 face checks + 216 bin checks, all passing, verifier-read off disk) sits
>    OUTSIDE the hashed body by schema; stated in the doc; stale seed comments in the instrument's
>    header noted, the constants correct. THE LESSON, filed for the next instrument copied by recipe:
>    **every inherited prose string inside the hashed body is a claim and is re-read at the freeze** —
>    four of eight findings were DS-T1d's sentences carried into IF-T1's artifact untouched.
> 5. **CONTRACTS & CANON**: `IF-FLIGHT-RUN-CONTRACT.md` §3 IF-T1 DONE with the read of record; STATUS
>    #421 (等待裁决). `CANON.md` unchanged (the lesson in item 4 becomes canon only if it strikes twice).
> 6. **THE GATES OF RECORD**: unchanged — world 12 (open) · 13 CLOSED KEEP · 14 · 15 · 16 · 17 OPEN; no
>    world 18. **CONSUMPTION**: block 12,559,000–999 consumed whole (999 + the receipt). Frontier: next
>    sim ≥ **12,560,000**; stats ≥ 117,600; registry **87** (`match.ifLastSeenOwnerGid` registered).
>    THE QUEUE: **等待裁决 (the restraint fork, item 3)** → IF-T0b (the chosen restraint, dormant) →
>    IF-T1b → entry / stop; the four eye gates in parallel; DS-T0e HELD; ⑤ last. THIS ROUND ENDS HERE
>    (§0.0.5: a user gate ⇒ write, stop — the push is the user's).

> **COMMANDER RULING #422 (2026-09-19 — ⭐⭐⭐ THE RESTRAINT FORK RESOLVED BY DELEGATION TO VISION — the
> user, VERBATIM: 「按照vision来吧，开始自走」 — ⇒ **乙 + 甲**: the run onto the flight starts ONLY when he
> SAW THE PASS LEAVE (his previous look had the ball at a same-side mate's feet, this look has it
> ownerless) AND the game is LIVE; 丙 stays behind the #200 red line; 丁 declined by the choice. THE IF
> CONTRACT AMENDED (M-IF.5 the live-game test · M-IF.6 the two-look freshness — identity tests on his own
> bookkeeping, no constant, no truth read of the ball); §6 VISION / §7 REALITY audits PASS; 🔄 IF-T0b
> 「球在飞时的前插 · 看见出脚」 DISPATCHED (the restraint slice, dormant, pins re-recorded) → IF-T1b (the
> exam re-walked by recipe on the next block); SELF-DRIVE RUNS until the next true gate):**
>
> 0. **BOOKKEEPING.** The user's sentence is a DELEGATION, not a football intuition — it is anchored HERE,
>    not in VISION §3.1. Standing on #421 items 2–3 (the table and the fork), #417 item 1 (the user's
>    original sentence 「肯定是甲,现实里就是这样的」 — the after-the-strike run), #420 item 2(vii) (what read
>    2 means). The push remains the user's; nothing ships in this round.
> 1. ⭐⭐⭐ **THE RESOLUTION, CHECKED AGAINST VISION.** 乙 is the user's own #416/#417 sentence
>    「看见传球出去才跑」 built FAITHFULLY — IF-T0's state was satisfied by a stale memory of any mate
>    (0.833177 not the passer, #421 item 2(c)); VISION §1 感知诚实: he starts because HE SAW the pass leave,
>    and a body whose eyes were elsewhere does not — that is a player, not a defect. 甲 is the whistle every
>    body hears (`match.phase === 'playing'`, an identity test on a game state — the coach's own licence
>    already reads `restart`); it removes the 0.227300 dead-ball share, which contract §4 had declared
>    untouched and the exam showed was not. 丙 (the flight's DIRECTION) is the most football-shaped
>    restraint and the one that compares a perceived velocity against zero — the #200 red line has not
>    admitted a sign test; it is HELD as a named door, to be ruled on by the user if 乙 + 甲 still floods.
>    The commander's lean (#421 item 3) and VISION agree; the user delegated to VISION; resolved.
> 2. ⭐⭐⭐ **THE CONTRACT AMENDED — M-IF.5 and M-IF.6 (IF-T0b), inside the SAME dormant flag, the law of
>    M-IF.1–4 otherwise unchanged:**
>    * **M-IF.5 — THE GAME IS LIVE.** The eighth state additionally requires `match.phase === 'playing'`
>      (the whistle: a state every body on the pitch shares; the SAME field R1 reads and the coach's
>      licence reads through `restart`). At a dead ball the eighth state is FALSE; the seventh state is
>      untouched (a mate credited with the ball at a restart is still the own run's business, as before).
>      An identity test on a match state; no constant.
>    * **M-IF.6 — HE SAW IT LEAVE (the two-look freshness).** The per-body belief becomes a RECORD
>      `{ ownerGid, look }` — the gid he last saw with the ball AND THE INDEX OF THE LOOK that wrote it —
>      alongside ONE per-body look counter `ifLook: Map<gid, number>` (created empty), incremented ONCE per
>      own-run evaluation under the flag at the fork site (his own decision cadence; a hatted or
>      wall-licensed body does not look — the fork does not run for him — so his looks are the looks the
>      fork made). The eighth state holds ONLY when the belief was written AT HIS IMMEDIATELY PREVIOUS
>      LOOK (`belief.look === thisLook − 1` — "the previous", the same kind of index test as
>      `cands.length − 1`; NOT a tick bound, NOT an age bound) AND the belief's gid resolves on the roster
>      to a same-side mate other than himself AND the ball he sees NOW has no owner. If his previous look
>      saw no owner, or saw an opponent, or was more than one look ago, he does not start. The belief
>      write rule of M-IF.2 is unchanged (written from his own snapshot whenever it carries an owner).
>      ⛔ No read of the truth ball, `pendingPass`, `lastTouch`; ⛔ no second pull; ⛔ no constant.
>    * **THE READ SET of the fork grows by ONE `match` member** — `match.phase` — and one map
>      (`match.ifLook`): SEVEN members (`dsOwnRun` · `ifFlightRun` · `ifLastSeenOwnerGid` · `ifLook` ·
>      `perceivedSnapshot` · `phase` · `simTime`); DS-T0c's member-set pin narrowed POSITIVELY 5 → 7 (the
>      file's third narrow, authorised here; listed).
>    * **§6 VISION** (this ruling): 感知诚实 PASS (two looks of his own, his own counter); 共同 prior PASS
>      (the coach's count still restrains, unchanged); 底座给能力 PASS (a narrower licence, no mandate);
>      #200 PASS (identity tests: a game state, an index equality, roster identity); 不要写死预设 PASS (no
>      number; "the previous look" is a name, not a threshold). **§7 REALITY**: a real forward goes when he
>      sees the ball leave the boot — not because his side "had it a while ago"; nobody sprints in behind
>      on a dead ball before it is taken (the set-piece run is the coach's machinery, untouched); the
>      honest gaps stay named (no direction — 丙 held; no timing against the line; no passer read).
> 3. 🔄 **IF-T0b 「球在飞时的前插 · 看见出脚」 — DISPATCHED (the DS-T0b/T0c form: the law amended under the
>    same flag; Draft + independent Verify).** (i) SRC: `src/sim/Match.ts` (the belief map's value type
>    → `{ ownerGid: number; look: number }`; the new `ifLook: Map<number, number>` created empty, the
>    docblock idiom), `src/ai/PlayerBrain.ts` INSIDE the fork only (the look increment; the belief write
>    with the look; the state test gaining `match.phase === 'playing'` and the previous-look equality;
>    the seam's own IF-T0 lines MAY be rewritten — they are not shipped statements — but EVERY statement
>    that existed at `595a555` stays byte-unchanged: the whole-file stripped diff vs `595a555` remains a
>    PURE INSERTION), `tests/` — ZERO elsewhere. (ii) PINS — `tests/ifFlightRun.test.ts` amended (its own
>    suite): G-OFF re-recorded (the x64 column at THIS dispatch head in a clean worktree, the arm64 column
>    still inherited by identity for bare · 13 · 15 · 16, world 17 absent — the OFF world cannot move,
>    the pins prove it); the maps EMPTY with the flag absent (both); ARMED: the eighth `why` still
>    appears on 16 and 17 + the flag (non-vacuity); ⭐ NEW FIXTURES — (a) a body whose previous look saw a
>    mate with the ball and whose current look sees it ownerless in a live phase ⇒ the eighth `why`; (b)
>    the same with the phase a restart ⇒ NOT; (c) the same with the sighting TWO looks ago ⇒ NOT; (d) the
>    previous look saw an OPPONENT ⇒ NOT; (e) the look counter increments exactly once per evaluation
>    (spied vs unspied, the DS-T1c idiom — still ONE pull); the read-set needles (now `match.phase`
>    allowed inside the span, the truth `match.ball` / `ball.owner` / `pendingPass` / `lastTouch` /
>    `info.genome` still ZERO); the seam map re-counted (Match.ts, League.ts unchanged, PlayerBrain.ts;
>    `a4World.ts` 0); the seven literals + the eighth once; the MUTANT WALK re-run with the four IF-T0
>    mutants PLUS M5 the phase test dropped · M6 the look equality dropped (stale memory admitted) · M7
>    the look counter never incremented — each with the pin that kills it and its exact mutation text
>    in the table; `tests/dsOwnRun.test.ts` — the member-set pin narrowed 5 → 7 ONLY (the third and last
>    authorised narrow; the conditional-set and compares pins must pass unchanged — if the phase test
>    adds an `if` or a comparison the executor writes it as an expression, as IF-T0 did). (iii) DOCS:
>    `IF-T0-FLIGHT-RUN-SEAM.md` gains §LAW-B (the amended law verbatim with the read set) · §HONESTY-B ·
>    §PINS-B · §DEVIATIONS-B at its foot, §LAW governing where they differ (the DS-T0 amendment form).
>    (iv) SEEDS: scratch `900,008,600–699` (executor) / `700–799` (verifier); G-OFF on DS-T0d's
>    `900,007,400–411` as at IF-T0; ZERO frontier, ZERO stats. (v) SUITE: full serial, the verdict =
>    green outside the #418 inventory; `npm run fingerprint` = the x64 value of record. (vi) GIT: ONE
>    commit, explicit paths, never push. (vii) THE VERIFIER: pure insertion vs `595a555`; G-OFF on its own
>    seeds; the seven fixtures falsified by hand (each made to fail by the change it guards against);
>    the mutants replicated at source from the table's text; the narrow positive; the full suite serial
>    minus the inventory.
> 4. **THEN IF-T1b 「球在飞时的前插 · 复考」** (dispatched by the commander at IF-T0b's PASS in the same
>    self-drive; block **12,560,000–999**): the IF-T1 instrument re-walked BY RECIPE with the amended
>    seam, the same five arms, the same faces, the SAME three reads + fallback + precedence + liveness
>    precondition, PLUS: the eighth class's start state by PHASE and by LOOK DISTANCE (a stored
>    partition); #421 item 4's eight corrections APPLIED AT THE FREEZE (every inherited prose string in
>    the hashed body re-read — the lesson); `repro.rows` named as it is; the ≈ twins now IF-T1's x64
>    numbers (an EXACT twin on the same host — `approx` becomes `prior.ifT1`, exact, and IF-C0's arm64
>    stays ≈). Registry 87 → 88 (`match.ifLook`, the look counter, if the instrument reads it — else 87).
> 5. **HELD DOORS (named, not opened)**: 丙 the flight's direction (behind the #200 red line — a sign
>    test on a perceived velocity; the user's ruling if 乙 + 甲 still floods) · a timing model against the
>    line · the passer's read of the runner (RC).
> 6. **CONTRACTS & CANON**: `IF-FLIGHT-RUN-CONTRACT.md` §2 M-IF.5 / M-IF.6 NEW, §3 IF-T0b / IF-T1b, §6 / §7
>    audit records extended, STATUS #422. `CANON.md` unchanged. **THE GATES**: unchanged. **CONSUMPTION**:
>    zero this ruling; block 12,560,000–999 RESERVED for IF-T1b (booked at its freeze). Frontier: next sim
>    ≥ 12,560,000 (≥ 12,561,000 once IF-T1b books); stats ≥ 117,600; registry 87. THE QUEUE: **IF-T0b
>    (dispatched)** → IF-T1b → entry / a further restraint (丙, the user's) / stop; the four eye gates in
>    parallel; DS-T0e HELD; ⑤ last.

> **COMMANDER RULING #423 (2026-09-19 — ⭐⭐⭐ IF-T0b 「球在飞时的前插 · 看见出脚」 LANDED (`159f671`, verifier
> PASS, zero HIGH): M-IF.5 + M-IF.6 built as written — the look counter, the belief with its look, the eighth
> state = ownerless NOW ∧ live ∧ the previous look ∧ a same-side mate; G-OFF x64 literals BIT-IDENTICAL to
> IF-T0's (the OFF world did not move — now pinned as an identity); 143 / 0 pure insertion vs `595a555`;
> seven fixtures (fixture (b) rebuilt after it was caught passing above the fork); seven mutants dead; the
> #418 subtraction exact; ONE MEDIUM — the M5 mutant row's RUNTIME half is vacuous (its scene never
> reaches the seam) while M-IF.5's runtime liveness is carried by fixture (b) ⇒ a one-scene FIX dispatched
> AHEAD of IF-T1b in the same self-drive; 🔄 IF-T1b 「球在飞时的前插 · 复考」 DISPATCHED on block
> 12,560,000–999):**
>
> 0. **BOOKKEEPING.** `159f671` above `59cd9f7` on `main`, unpushed (10 commits above `origin/main` =
>    `8d98358`); the user pushes. Nothing ships: `ifFlightRun` dormant, named by no world; the x64
>    fingerprint of record unchanged. Frontier and stats consumption this ruling ZERO.
> 1. ⭐⭐⭐ **IF-T0b LANDED — re-derived by the verifier.** (a) Git: one commit, five authorised files, none
>    other. (b) The law at the fork (`PlayerBrain.ts` 2213–2326): four aliases as the fork's first four
>    statements (`ifFlightRun` · `ifLastSeenOwnerGid` · `ifLook` · `phase`); the look counter incremented
>    ONCE per own-run evaluation under the door, below the hat / wall guard; the belief written
>    `{ ownerGid, look }` from his own snapshot; the eighth state `ifPhase === 'playing' ∧ seenBall !== null
>    ∧ ownerGid === null ∧ ifPrev.look === ifThisLook − 1 ∧ a same-side mate ≠ him` — identity tests only,
>    the seam's numeric set exactly {0, 1}; needles over the span `pendingPass` · `match.ball` ·
>    `ball.owner` · `lastTouch` · `info.genome` · `pendingPassWindup` all ZERO; ONE pull (3 in the file, 1 in
>    the span); the eighth literal once, a RELABEL of the candidate pushed the line above (`MakeRun` pushes
>    still 6). (c) PURE INSERTION vs `595a555`: `PlayerBrain.ts` 64 / 0 · `Match.ts` 78 / 0 · `League.ts`
>    1 / 0 (IF-T0's) — 143 / 0, every hunk `a`. (d) G-OFF: the x64 literals re-recorded at `59cd9f7` in a
>    clean worktree and BIT-IDENTICAL to IF-T0's five (the OFF world cannot move — a NEW pin asserts the
>    identity explicitly); the verifier's own seeds byte-equal head vs commit; `npm run fingerprint` = the
>    x64 value of record; the arm64 column inherited by identity, 17 absent. (e) THE SEVEN FIXTURES, each
>    falsified by hand by the verifier; ⭐ fixture (b) (the dead ball) was caught by the executor passing
>    ABOVE the fork — `decidePlayer` returns at its dead-ball branch when `phase !== 'playing'` and no
>    `restart` object is set — and rebuilt with a restart taker who is a mate, asserting he LOOKED and his
>    belief IS the previous look's before asserting nothing fires (§DEVIATIONS-B 4). (f) THE MUTANTS (source
>    restored and sha256-verified after each): M1 4 (WEAKER under the amended law — declared, §DEVIATIONS-B 5)
>    · M2 17 · M3 collection failure + M3′ 27 (four-replacement text in the table) · M4 13 on the stored
>    divergence seed 900,008,660 (every seed of the band diverges — "reproduces", not "selected") · M5 5 ·
>    M6 4 (the narrowest kill — the slice's own conjunct, visible ONLY because fixture (c) constructs a stale
>    memory by hand) · M7 17. (g) The narrow: `dsOwnRun.test.ts`'s member-set pin SEVEN, green; the
>    conditional-set and compares pins unchanged and green; the seam-span pin enumerates SIX inside the
>    span + `if (match.dsOwnRun) {` as the line above (§DEVIATIONS-B 8). (h) THE SUITE SERIAL: executor 2,365 /
>    2,424, 59 red = the #418 inventory exactly; verifier 2,364 / 2,424, 60 red — the one extra a SECOND
>    class-D timeout in `careers.test.ts` (host load; class D is "these files time out here", not a fixed
>    count — registered). `ifFlightRun.test.ts` 51 / 51. `tsc` clean. (i) ⚠ THIS STAGE MEASURES NOTHING
>    ABOUT THE FLOOD: the eighth `why` still fires on every seed of the band when armed (2,427–4,662
>    recorded menu entries per match, a count not a rate); whether 乙 + 甲 removes the R1 flood and the G9
>    breach is IF-T1b's question — the executor said so, correctly.
> 2. ⭐ **MEDIUM — THE M5 ROW'S RUNTIME HALF IS VACUOUS; M-IF.5 IS ALIVE THROUGH FIXTURE (b).** The
>    mutant-table's M5 runtime scene (`ifFlightRun.test.ts` ~L1344) sets `phase = 'restart'` WITHOUT a
>    restart object, so the body returns above the fork and the `toBeNull` cannot fail for the reason it
>    appears to test (the verifier measured it: REACHED THE FORK = false). The SAME scene with a mate as
>    taker reaches the fork and fires nothing — that is fixture (b), which IS M-IF.5's runtime pin and which
>    the verifier falsified by hand. ⇒ NOT a liveness gap in the law; a mislabelled row. THE FIX (one
>    scene): the M5 row's runtime check REUSES fixture (b)'s scene (a restart with a mate as taker; assert
>    the body looked) so that dropping the phase test makes it fire — and the row's runtime column names
>    fixture (b). Dispatched as IF-T0b-FIX, the first stage of the IF-T1b workflow, with its own light
>    verify (falsify the repaired scene by applying M5 at source; the file 51 / 51; the pure-insertion
>    invariant untouched — the FIX edits `tests/` and the stage doc only). LOW (i): the report's flag-absent
>    seventh-`why` band quoted world 16's alone — imprecision, nothing depends on it. LOW (ii): IF-T0's
>    §HONESTY 1 ("no freshness bound — 乙 was NOT chosen") is superseded by §LAW-B; the top banner resolves
>    it for a careful reader; the FIX adds a one-line bracketed annotation at §HONESTY 1 pointing at §LAW-B
>    (an annotation, not a rewrite — the amendment form stands), and the contract's §4 "the leak … 乙 was NOT
>    chosen" clause is amended by THIS ruling: 乙 was not chosen FOR THE LEAK (#417) and IS chosen AS THE
>    RESTRAINT (#422) — the leak itself is still untouched and printed.
> 3. 🔄 **IF-T1b 「球在飞时的前插 · 复考」 — DISPATCHED (#422 item 4 binds; X-SRC-ZERO after the FIX; FREEZE
>    then RESULTS; Draft + independent Verify in the IF-T1 form).** (i) THE INSTRUMENT: IF-T1's, re-walked
>    BY RECIPE with the amended seam — the same five arms, the same faces, THE SAME three reads + fallback +
>    precedence + liveness precondition (`gReadLiterals` against this ruling, #420 item 2(iii) and the
>    contract §3, byte for byte); PLUS the eighth class's start state BY PHASE (`playing` / not — expected
>    1.000000 `playing` by construction; stored, enumerated) and BY LOOK DISTANCE (the belief's look vs the
>    current look at the start: 1 by construction — stored as a receipt of M-IF.6, never narrated) and the
>    MEMORY partition kept (the last passer vs another mate — the number 乙 exists to move). (ii) THE
>    CORRECTIONS OF #421 ITEM 4 APPLIED AT THE FREEZE: every inherited prose string inside the hashed body
>    re-read and re-written for THIS exam (the precedence string = the three-read rule; the seed notes name
>    all 16 consumed blocks and this frontier; `stage.xSrcZero` names no spy; the cross-arch rows named
>    `repro.rows` in code, doc and this ruling; `r1.what` and the tolerance strings name `OWNCOOP-E13` as the
>    control; the |Δ| ÷ tolerance ratio STORED as a field; `gFacesDetail`'s exclusion stated in the receipts
>    note) — a gate `gInheritedProse` lists every prose field in the body with its source and a "re-read"
>    boolean. (iii) THE TWINS: IF-T1's x64 numbers are printed beside every face as `prior.ifT1` (EXACT — same
>    host, same architecture; a paired Δ per face where the seeds differ is NOT claimed, the blocks differ);
>    IF-C0's arm64 as `approx.ifC0` (≈). (iv) `gRepro` architecture-aware as at IF-T1 (the re-walks
>    `12,558,000–002` IF-C0's own band); `gRepro` ALSO re-walks IF-T1's `12,559,000–002` on `OWNCOOP+IF-E13`
>    against `if-t1-flight-run-exam.json`'s `perSeedCells[]` — on the SAME architecture this one GATES
>    (field for field, the eighth class WILL differ by construction of M-IF.5/6 — so the gate compares the
>    control arm `OWNCOOP-E13` and `HATS-E13` exactly and STORES the candidate arm's differences enumerated:
>    "the seam changed, not the host"). (v) `gLedgerRead`: `match.ifLook` registered if read (registry 87 →
>    88). (vi) SEEDS: block **12,560,000–999** (fresh against all 16 consumed blocks … IF-T1 12,559,000–999);
>    battery `12,560,000–998`, receipt `12,560,999`; the 12-seed smoke on `900,008,800–811` at the declared
>    0.05 half-width on R1's paired Δ and the negative-Δt half; receipt `820`, world pin `870`, lockstep
>    `890–891`, fixtures `899`; band `900,008,800–899` stored; verifier `900,008,900–999`; N = the affordance
>    (say so); wall time as at IF-T1 (~2 h battery). (vii) FILES: `IF-T1B-FLIGHT-RUN-EXAM-RERUN.md`,
>    `scripts/probes/if-t1b-flight-run-exam.ts`, `data/if-t1b-flight-run-exam.json`; §0 quotes IF-T1's read
>    of record and table by field; the house sections; §R6 在说人话的层面. (viii) WHAT THE READS WOULD MEAN:
>    read 1 ⇒ IF-ENTRY drafted (world 18 = 17 + `ifFlightRun`; the honest brief; the user's eye gate 「看见出脚
>    就跑 (v18) — keep | change | revert」); read 2 ⇒ the guard's census; read 3 ⇒ 丙 goes to the user (the
>    #200 question); no read ⇒ liveness first.
> 4. **CONTRACTS & CANON**: `IF-FLIGHT-RUN-CONTRACT.md` §4 (the 乙 clause) amended; STATUS #423. `CANON.md`
>    unchanged. **THE GATES**: unchanged. **CONSUMPTION**: zero this ruling; 12,560,000–999 BOOKED to IF-T1b
>    at its freeze; frontier ≥ 12,561,000 once booked; stats ≥ 117,600; registry 87 (88 at IF-T1b if the look
>    counter is read). THE QUEUE: **IF-T0b-FIX → IF-T1b (one workflow, this round)** → entry / 丙 / stop;
>    the four eye gates in parallel; DS-T0e HELD; ⑤ last.

> **COMMANDER RULING #424 (2026-09-20 — ⭐⭐⭐ IF-T1b 「球在飞时的前插 · 复考」 BANKED (FREEZE `b55b62d` ·
> RESULTS `272cbf6`; verifier PASS, zero HIGH; ALL 28 GATES GREEN, `allGreen` a STORED true; the instrument
> byte-identical between the commits; X-SRC-ZERO; IF-T0b-FIX `74b269f` verified in the same workflow): THE
> READ OF RECORD = **read 1** — *"THE FLIGHT RUN COSTS NOTHING THE BAND CAN SEE — IF-ENTRY is named (world
> 18 = 17 + the run onto the flight)."* — selected at precedence step (3): the band HOLDS on all four pairs
> with an EMPTY breach set, R1 does NOT flood (ratio 1.195, the Δ at 0.706 of tolerance), G9 through balls
> UNRESOLVED at 0.024 of tolerance; the restraint 乙 + 甲 did what it was chosen for — the eighth class
> 731.011011 → 45.967968 per match, the remembered body IS the passer 0.450157 (was 0.166823), dead-ball
> starts EXACTLY 0.000000 (was 0.227300); ⭐ the same-architecture re-walk GATED for the first time on x64
> (the control arms reproduce IF-T1's cells 224 × 6 with ZERO mismatches); two MEDIUM + one LOW disposed in
> place; ⇒ 🔄 IF-ENTRY 「看见出脚就跑 · 世界 18」 DISPATCHED (world 18 = 17 + `ifFlightRun`; the honest brief;
> THE USER'S EYE GATE OPENS AT THE NEXT PUSH); the round ENDS at the entry's PASS):**
>
> 0. **BOOKKEEPING.** Three commits above `ee6062b` (`74b269f` the FIX · `b55b62d` · `272cbf6`), 14 above
>    `origin/main` = `8d98358`, unpushed — the user pushes. X-SRC-ZERO for the exam (`git diff --stat
>    74b269f..HEAD -- src tests` EMPTY); the FIX touched `tests/` and the stage doc only (`PlayerBrain.ts`
>    sha256 unchanged from IF-T0b — the 143 / 0 pure-insertion invariant untouched). Nothing ships yet.
>    Files: `IF-T1B-FLIGHT-RUN-EXAM-RERUN.md` · `scripts/probes/if-t1b-flight-run-exam.ts` ·
>    `data/if-t1b-flight-run-exam.json` (36,802,586 bytes; `fileSha256 da5c1a6b…f26f`; body
>    `21974e02…7aa2`; canonical path).
> 1. ⭐⭐⭐ **IF-T0b-FIX VERIFIED** (`74b269f`): the M5 row's runtime scene REUSES fixture (b)'s (a restart with
>    a mate as taker; the look asserted to have advanced) and goes RED under M5 at source on its own
>    `toBeNull` (`expected +0 to be null` — the eighth `why` fires at the dead ball without the phase test);
>    ⭐ the verifier ALSO ran the OLD scene under the same mutant and it PASSES — the pre-fix vacuity
>    confirmed positively, not by shape. M5's kill count stays 5 (the row was already red via its source
>    half; the repair changes WHY it dies). `ifFlightRun.test.ts` 51 / 51; `tsc` clean; §HONESTY 1 carries
>    the bracketed annotation. LOW: the report's "11 commits" was 12 — prose only.
> 2. ⭐⭐⭐ **THE READ OF RECORD — read 1, re-derived by the verifier off the serialized artifact with its
>    own canonicaliser** (the 50-key body hash reproduced; all 28 gate booleans rebuilt; `holdsBand` TRUE on
>    the comparison of record ⇒ step (1) not taken; `floods` FALSE ⇒ step (2) not taken ⇒ step (3) ⇒ read 1;
>    `gBiteIF` GREEN — 999 / 999 rows differ on all three door-carrying contrasts, 0 exempt — so a read was
>    owed; the five frozen strings byte-equal across four homes). THE TABLE (arm of record
>    `OWNCOOP+IF-E13` vs `OWNCOOP-E13`, x64, N = 999 = the affordance, sizing resolved at n = 8):
>    (a) R1 0.241767 → 0.288929, Δ +0.047162 [0.042836, 0.051299] vs tolerance 0.066804 — resolved, up,
>    NOT beyond (0.705973 of tolerance); ratio 1.195072 [1.175962, 1.213609]; 0 LOO flips. IF-T1's exact
>    prior twin (same host, different block — no paired Δ claimed): 0.244699 → 0.773695, ×3.161820.
>    (b) THE BAND: `holdsBand` TRUE on all four pairs, breach set EMPTY on every one. G9 through balls
>    5.486486 → 5.450450, Δ −0.036036 [−0.223223, 0.149149] vs 1.516003, UNRESOLVED (0.023770 of
>    tolerance) — the guard IF-T1 named UP at 1.78× is at its control's level. G1 goals the closest limb at
>    0.156090 of tolerance, unresolved — and the ONE LOO-sensitive row on the comparison of record (59 seeds,
>    all UP — a RESOLUTION flip; at that ratio it cannot breach; declared). G10 offside FLAG true on the D13
>    pair alone (gates nothing). (c) THE EIGHTH CLASS: **45.967968** decisions per match (45,922 over the
>    battery; IF-T1 731.011011); **0.092214** of all attacking `MakeRun` (IF-T1 0.629314). START STATE: by
>    PHASE `playing` 1.000000 (M-IF.5's receipt); by LOOK DISTANCE 1 → 1.000000 (M-IF.6's receipt); MEMORY:
>    **the last passer 0.450157 · another mate 0.549843** (IF-T1 0.166823 / 0.833177); the engine's truth at
>    the start: `ballInFlight` 0.928184 · `mateOwnsTheBall` 0.068511 · **`ownRestart` 0.000000** (IF-T1
>    0.227300) · other 0.003305. (d) THE PASSER STILL DOES NOT SEE HIM: `flight.intendedReceiverShare`
>    0.000000 on every arm (fixtured); the leak's `stalePasserStillCredited` 0.896515 → 0.896442 —
>    unchanged by construction, exactly as contract §4 says it should look. (e) ⭐ `gRepro` on the SAME
>    architecture GATED: on IF-T1's `12,559,000–002` the two control arms reproduce its stored
>    `perSeedCells[]` on 224 fields × 6 rows with ZERO mismatches; the candidate arm differs on 177 fields,
>    stored — *the seam changed, not the host*. This retires much of #421 item 4(vii)'s doubt on the x64
>    reproduction: on one architecture the programme's instruments reproduce each other to the field.
>    IF-C0's arm64 rows stay ≈ (stored, not gated). (f) `gInheritedProse` NEW: 8,638 prose fields in the
>    hashed body enumerated against nine frozen stale tokens, 0 failing (but see item 4(i)).
> 3. ⭐⭐⭐ **WHAT THE READ MEANS (VISION and REALITY).** A NEGATIVE read, honestly weaker than a positive:
>    at N = 999 no limb resolved past tolerance; goals is the closest and it is LOO-sensitive in resolution
>    only. The two things VISION objected to at #421 moved the way the user's sentence asked: the run
>    starts because he SAW the ball leave a mate (0.450157 the actual passer; the rest another mate seen
>    with the ball on his previous look — his eyes, honestly) and NEVER at a dead ball. 丙 (the flight's
>    direction) was NOT needed — the #200 red line is not asked to admit a sign test; the door stays HELD.
>    ⇒ **IF-ENTRY is named: world 18 = 17 + `ifFlightRun`** — a capability the eye has never seen (nobody
>    has yet LOOKED at a run onto a flight in this engine); the honest brief says the class is one run in
>    eleven, that the passer does not target him, that the yield per run is lower than the at-feet run's
>    (IF-T1's 0.035510 vs 0.049945 — restated from IF-T1b's own fields at the rung), and that the table
>    sees nothing — which is NOT "the eye sees nothing". THE USER'S EYE GATE: 「看见出脚就跑 (v18) — keep |
>    change | revert — <一句人话>」.
> 4. **§COMMANDER CORRECTIONS on the exam doc (disposed in place; the artifact FROZEN):** (i) MEDIUM — 15
>    face entries (`ifStart.memoryShare.*` on five arms) carry IF-T1's sentence "registry 87 … THE ONE NEW
>    REGISTERED LEDGER READ" while `stats.registryOfRecord` = 88 and `gLedgerRead` names TWO reads;
>    `gInheritedProse`'s nine tokens missed it by wording — the token class is the lesson's SECOND strike
>    (the first at #421 item 4): a token list is a list-shaped blind spot; the NEXT instrument's
>    `gInheritedProse` re-reads by DIFF AGAINST ITS SOURCE INSTRUMENT (every prose string identical to the
>    inherited instrument's is flagged for a human re-read, listed) rather than by tokens. (ii) MEDIUM — the
>    doc's §GATES row says "the 49-key allowlist schema" where `receipts.bodySchemaKeys` = 50 and the gate
>    note says 50 — one hand-typed number; corrected in the doc. (iii) LOW — `gInheritedProse`'s own note
>    claims it is scanned and is the one prose field the walk omits (written after the walk): 8,639 vs
>    8,638; stated. THE LESSON, filed and now CANON (two strikes): **inherited prose inside a hashed body is
>    re-read by diff against the source instrument, never by a token list** — `CANON.md` refreshed.
> 5. 🔄 **IF-ENTRY 「看见出脚就跑 · 世界 18」 — DISPATCHED (the DS-ENTRY-2 rung form, #414 item 5 / #415;
>    Draft + independent Verify).** (i) THE BUNDLE: `a4MatchFlags(18) = { ...a4MatchFlags(17),
>    ...IF_WORLD_DOORS }` with `IF_WORLD_DOORS = { ifFlightRun: true }` — world 17 CALLED plus EXACTLY ONE
>    door, no gene, no constant, no dose; `armIfWorld` = `armDs2World` CALLED and nothing more;
>    `ifArmedVersion(match)` containment-ordered 18 → 17 → 16 → …; `IF_WORLD_VERSION = 18`; the version
>    union grows by one; the URL parses 18 and the bound moves to 19; the badge carries 18 in both dose
>    forms (`🧪 看见出脚就跑 · 剂量成熟` / `· 空账本(全新手)`); the ⚙ → 🧬 checkbox (`SettingsScreen.ts`) and the
>    GameApp feed line in the world-17 idiom; ⛔ the default landing world 0 untouched; ⛔ no other flag
>    named. (ii) THE DOOR SET IS THE EXAM'S, in two halves: (a) IF-T1b's own construction on WORLD 13 re-run
>    here reproduces its STORED per-seed whole-match signatures for `OWNCOOP+IF-E13` on its first twelve
>    battery seeds `12,560,000–011` (consumed; not a consumption; SAME host ⇒ exact); (b) `a4MatchFlags(17)`
>    + the flag ≡ `a4MatchFlags(18)` in whole-match signatures on six scratch seeds. (iii) IDENTITY BELOW 18,
>    ARCH-KEYED (#418 item 2(ii)): pooled digests for bare · 12 · 13 · 14 · 15 · 16 · 17 on the family
>    IDENTITY band `900,007,200–211` with `ds2PlaytestEntry.test.ts`'s `signature` recipe — the x64 column
>    RECORDED at THIS dispatch head in a clean throwaway worktree; the arm64 column INHERITED BY IDENTITY
>    from `ds2PlaytestEntry.test.ts`'s `BASELINE_DIGESTS` for bare · 12 · 13 · 14 · 15 · 16 (same seeds, same
>    recipe, byte-identical worlds since `4d3ff94` — stated literal for literal), world 17 ABSENT on arm64
>    (skip by title); the fingerprint pin arch-keyed. (iv) DORMANCY: worlds 1–17 carry no `ifFlightRun`; a
>    plain League match reads as no world; `League.toJSON` omits matchFlags. (v) LIVENESS (the #402 item
>    2(iii) form) + THE MUTANT WALK (four mutants: the door dropped from the bundle · the version reader
>    reading 17's flag only · the arming re-writing a gene · the badge text off-by-one) with exact texts.
>    (vi) ⭐⭐ THE HONEST BRIEF — three surfaces (the GameApp feed line in both dose forms, the settings
>    blurb, the badge), in the player's language, every numeral a 6-dp string traced BY FIELD AND ARM to
>    `if-t1b-flight-run-exam.json` (E13 = the measured arm; D13 beside, each under its own heading — the
>    #387 item 1 class), the COST BEFORE the win: the run onto the flight is now one attacking run in
>    eleven (0.092214); the passer never targets him (0.000000); the yield per run — restated from the
>    artifact's own yield fields; runs per possession tick +19.5 % (1.195072); through balls unmoved
>    (5.486486 → 5.450450); goals unmoved (the G1 line with its interval); ⚠ 别期待: the table sees nothing ≠
>    the eye sees nothing; no timing against the line; no direction (丙 held — a backpass in the air can
>    start him); no passer read; the leak unchanged; 「有人挤人」 not this door's (the crowding family's
>    numbers). 你的眼睛要判的: 有没有「球一出脚就有人往身后冲」的画面? 冲的人是不是刚看见传球的那个? 死球时没人乱跑了吗?
>    直塞还在吗? 对比 v17, 同一台设备, `?a4world=18` 对 `?a4world=17`; `&pcdose=0` = the measured arm. The
>    honesty line on every surface. ⚠ 联赛后台快速模拟跑的是原版世界. (vii) TESTS: `tests/ifPlaytestEntry.test.ts`
>    (the `ds2PlaytestEntry` form: fidelity · version · URL/badge · the honest brief's numerals by field ·
>    identity arch-keyed · dormancy · liveness · mutants · the scratch band). (viii) DOCS:
>    `docs/world-model/IF-ENTRY-RUNG.md` (§1 the bundle · §2 the door set proven · §IDENTITY · §THE HONEST
>    BRIEF with the trace table · §DEVIATIONS); the contract STATUS and PROGRAMME are the commander's.
>    (ix) SEEDS: the family IDENTITY band `900,007,200–211` (re-used on purpose); the executor's own
>    `900,009,000–099`; the verifier's `900,009,100–199`; IF-T1b's `12,560,000–011` for the door-set pin
>    (consumed, not a consumption); ZERO frontier, ZERO stats. (x) GATES: `tsc` · `npm run build` · the
>    fingerprint (x64 of record) · the full suite serial minus the #418 inventory · `ifPlaytestEntry` green.
>    (xi) GIT: ONE commit, explicit paths, never push. (xii) THE VERIFIER: re-derives the door-set identity
>    on its own six seeds and the twelve battery seeds; rebuilds the identity digests at the dispatch head;
>    traces EVERY numeral on the three surfaces to its field and arm (zero cross-arm, zero untraceable);
>    replicates the four mutants; runs the build; the suite serial minus the inventory.
> 6. **CONTRACTS & CANON**: `IF-FLIGHT-RUN-CONTRACT.md` §3 IF-T1b DONE (read 1), IF-ENTRY named; STATUS
>    #424. `CANON.md` REFRESHED: NEW — *inherited prose re-read by diff* (item 4; two strikes: #421 item 4,
>    #424 item 4(i)). **THE GATES OF RECORD**: world 12 (open) · 13 CLOSED KEEP · 14 · 15 · 16 · 17 OPEN ·
>    **world 18 OPENS AT THE NEXT PUSH** (after the entry's PASS). **CONSUMPTION**: block 12,560,000–999
>    consumed whole; frontier next sim ≥ **12,561,000**; stats ≥ 117,600; registry **88** (`match.ifLook`).
>    THE QUEUE: **IF-ENTRY (dispatched)** → the entry's PASS ⇒ the user's eye gate at the push — THE ROUND
>    ENDS THERE (§0.0.5); the five eye gates then in parallel; DS-T0e HELD; 丙 HELD; ⑤ last.

> **COMMANDER RULING #425 (2026-09-20 — ⭐⭐⭐ IF-ENTRY 「看见出脚就跑 · 世界 18」 BANKED (`e04f54c` + the errata
> `9c6ba20`; verifier PASS, zero HIGH): WORLD 18 = 17 + `ifFlightRun` — one door, no gene, no constant, no dose,
> the seat absent; the door set proven the exam's in both halves (12 / 12 stored IF-T1b signatures reproduced on
> world 13; 6 / 6 scratch signatures equal); worlds ≤ 17 byte-identical under 18 on the x64 column (recorded at the
> dispatch head), the arm64 column inherited by identity; the x64 fingerprint unchanged; the honest brief's 128 (after the errata; 116 at the entry)
> numerals traced by field and arm, zero cross-arm; the 30 narrows in 14 suites RATIFIED (the #415 precedent);
> the FULL SUITE serial = the #418 inventory exactly; ⭐⭐⭐ THE USER GATE 「看见出脚就跑 (v18) — keep | change |
> revert — <一句人话>」 OPENS AT THE NEXT PUSH; THIS ROUND ENDS HERE):**
>
> 0. **BOOKKEEPING.** `e04f54c` above `05df245`; the errata `9c6ba20` above it; 17 commits above
>    `origin/main` = `8d98358`, unpushed — the user pushes from the terminal (`git log --oneline
>    origin/main..HEAD`); world 18 DEPLOYS with that push (Road B: the default landing world 0; `?a4world=18`
>    or the ⚙ → 🧬 checkbox; the corner badge is the ground truth). Zero frontier, zero stats.
> 1. ⭐⭐⭐ **IF-ENTRY LANDED — re-derived by the verifier.** (a) Git: one commit; the six named paths plus 14
>    existing suites (item 2); ⛔ `Match.ts` / `PlayerBrain.ts` / `League.ts` byte-identical (sha256 vs
>    `05df245`); nothing under `scripts/` or `src/evolution`. (b) THE BUNDLE, measured: `a4MatchFlags(18)`
>    adds exactly `['ifFlightRun']` to world 17's 30 keys, by the CALL; `armIfWorld` = `armDs2World` called and
>    nothing more; `ifArmedVersion` containment-ordered (the world below CALLED, never re-read); worlds 1–17
>    name no `ifFlightRun`; the default landing world untouched; the URL 18 → 18, 19 → null; `a4World.ts`
>    names `ifFlightRun` at exactly two executable sites; badge tables 18 / 11 distinct names. (c) THE DOOR
>    SET IS THE EXAM'S: IF-T1b's world-13 construction, rebuilt from the PROBE source, reproduces the stored
>    `OWNCOOP+IF-E13` per-seed signatures on `12,560,000–011` (12 / 12, exact — same host); `a4MatchFlags(17)`
>    + the flag ≡ `a4MatchFlags(18)` on six scratch seeds. (d) IDENTITY BELOW 18, arch-keyed: the x64 pooled
>    digests for bare · 12 · 13 · 14 · 15 · 16 · 17 recorded at `05df245` in a clean throwaway worktree
>    (`1d75378f…a500` · `ee39881f…8119` · `7c4f2063…e953` · `49fd7449…2957` · `8431aafb…cf9e` · `b57a0d6c…dd01` ·
>    `5d60981a…2933`) and re-derived at the rung; the arm64 column inherited literal for literal from
>    `ds2PlaytestEntry.test.ts` for bare … 16, world 17 absent (skipped by title); world 18 ≠ 17 asserted as
>    an inequality. (e) LIVENESS on six scratch seeds: the eighth `why` in whole matches on world 18 (≥ 3 of
>    6) and exactly 0 on world 17 on all six; the four mutants dead (M1 10 · M2 3 · M3 4 · M4 2 of 33) from
>    the table's exact texts. (f) GATES: `tsc` clean; `npm run build` exit 0; the fingerprint = the x64 value
>    of record; `ifPlaytestEntry` 33 / 33; `ifFlightRun` 51 / 51 (its three narrows); `ds2PlaytestEntry`'s two
>    reds = its inventory entries; THE FULL SUITE serial after the re-install (item 4): 2,399 / 2,457, 58 red
>    in 37 files, every one in the #418 inventory (A 35 · C 20 · B 1 · D 2 — `simRunner` passed this time).
> 2. ⭐⭐ **THE NARROWS RATIFIED (the MEDIUM).** #424 item 5(xi) named six paths while gate (x) demanded the
>    suite equal the inventory; moving the URL bound to 19, widening the two badge tables and the two GameApp
>    predicates necessarily reddens pins in 14 existing suites. The executor took the #415 item 1 precedent
>    (27 narrows in DS-ENTRY-2's own commit), listed every one positively in the rung doc's §THE NARROWED
>    PINS, and the verifier audited every hunk: all positive widenings, nothing deleted, no claim weakened —
>    `?a4world=18` → 18 plus a NEW `?a4world=19` → null; badge distinct-name counts 17 → 18 and 10 → 11; the
>    GameApp armed-match guard and the PC-stack dose predicate widened by one world (without which
>    `armA4World` is never called for 18 and the doses never arrive — the fidelity claim itself would be
>    false). RATIFIED as the entry family's standing form: an entry rung's commit CARRIES its narrows,
>    listed positively; the dispatch's file list names the rung's own files and says "plus the family's
>    narrows". The prose count "26 hunks" is corrected in the rung doc to the measured 30 (31 described in
>    its own table) — LOW.
> 3. ⭐⭐ **THE HONEST BRIEF OF RECORD (three surfaces; the pin suite RE-DERIVES every 6-dp token from
>    `if-t1b-flight-run-exam.json` by field and arm and requires each surface's numerals to be in the set of
>    the arm it claims — the E13 line 29 numerals, the D13 line 29, the settings blurb 58, the badge 0; the
>    one shared token `0.000000` exempted by name and asserted a field of both arms).** The cost before the
>    win: 这一步造了什么 · ⚠ 代价说在最前面 (one attacking run in ~eleven, 0.092214; the passer never targets him,
>    0.000000; the yield per such run 0.038808 vs the at-feet run's 0.049224; runs per possession tick
>    0.241767 → 0.288929, ×1.195072 [1.175962, 1.213609]; through balls 5.486486 → 5.450450, Δ −0.036036
>    [−0.223223, 0.149149]; goals 3.249249 → 3.389389, Δ +0.140140 [−0.004004, 0.283283] — the closest limb at
>    0.156090 of tolerance; memory: the last passer 0.450157 / another mate 0.549843; dead-ball starts
>    0.000000) · ⭐ 量到的 · ⚠ 别期待 (the honesty line; no timing; no direction — 丙 held, a backpass in the air
>    can start him; no passer read; the leak 0.896515 → 0.896442; 「有人挤人」 0.445696 → 0.444503) · 你的眼睛要判的 ·
>    the comparison and the league caveat. D13 beside under its own heading, with its two UNFLATTERING facts
>    printed: the offside FLAG UP (gates nothing) and G9 resolving at 0.130871 of tolerance — AND, by the
>    errata (item 4), its G7 passes per match resolving (+0.906907 [0.183183, 1.661662]), which the verifier
>    found on no surface (LOW) against the brief's own rule. THE LIKELIEST 「change」 AND ITS ANSWER: 「冲的人
>    不是刚看见传球的那个」 ⇒ his previous look saw ANOTHER mate with the ball (0.549843) — honest eyes, not a
>    defect; 「往回传的球也有人冲」 ⇒ 丙 the flight's direction (HELD behind the #200 red line — the user's
>    ruling); 「传球的人从不找他」 ⇒ the passer's read of the runner (RC, held) — the next arc, not this door;
>    「前插还是太少/太多」 ⇒ the coach's count restrains as before; a continuous rank weight is a later slice.
> 4. **THE ERRATA COMMIT `9c6ba20` (three LOWs disposed ON THE SURFACE, not only in the doc):** the D13 G7
>    sentence added to the mature feed line and the blurb's D13 block (the rule "every guard's interval
>    contains zero or its |Δ| ÷ tolerance is printed" now met for every resolving D13 guard); the trigger
>    worded as the seam reads it — 他眼里的球没了主人（在他看来还在飞） — since the guard is an ownerless
>    PERCEIVED ball, not "in the air" (the perceived ball is airborne 1.000000; in engine truth a mate already
>    owns it on 0.068511 of starts — NOT added to the surfaces, it did not fit the list; recorded here: E13 0.068511, D13 0.068128); the badge docblock's field
>    citation corrected (`resolved: false` on every row of the arm of record, not `holdsBand`). The trace
>    pins re-derived the new numerals green. OTHER LOWs: the unpushed count (16 at the entry, prose); the
>    verifier's own CRLF tooling note (a text-mode Python rewrite converted the tree to CRLF and produced a
>    spurious 11th M1 kill; corrected with `newline=''` — the #418 item 0(a) hazard in a verifier's hands,
>    recorded). ⚠ **A DESTRUCTIVE MISTAKE, DECLARED AND REPAIRED**: `rm -rf` on the throwaway worktrees
>    followed a Windows JUNCTION and deleted part of the host's `node_modules`; no tracked file was touched;
>    `npm ci` restored it from the lockfile and the full suite was RE-RUN on the final tree (the quoted
>    verdict is that run). The lesson is filed in the project memory and in the executor brief form:
>    canonicalize before deleting — a junction is removed with `rmdir`, never `rm -rf` on its parent. FROZEN
>    PROBE RED, declared, not edited: `if-t1b-flight-run-exam.ts`'s `codeFacts.a4WorldCleanOfTheSwitch` reads
>    RED from `e04f54c` (world 18's own bundle names the flag — the same shape as DS-T1d's anchor at #415);
>    errata line written on IF-T1b's doc; not a vitest file.
> 5. **CONTRACTS & CANON**: `IF-FLIGHT-RUN-CONTRACT.md` §3 IF-ENTRY DONE; STATUS #425 (the user gate). `CANON.md`
>    unchanged. **THE GATES OF RECORD**: world 12 (open) · 13 CLOSED KEEP · 14 · 15 · 16 · 17 OPEN · **world 18
>    OPEN AT THE NEXT PUSH** (「看见出脚就跑 (v18) — keep | change | revert — <一句人话>」; `?a4world=18` vs
>    `?a4world=17`, same device; `&pcdose=0` = the measured arm). FIVE verdict lines owed; none blocks the
>    queue. **CONSUMPTION**: zero. Frontier: next sim ≥ 12,561,000; stats ≥ 117,600; registry 88. THE ARC ③
>    COMPLETE TO ITS THIRD GATE: DS-C0 → … → world 17 → IF-C0 → 甲 → IF-T0 → IF-T1 (read 2) → 乙 + 甲 → IF-T0b →
>    IF-T1b (read 1) → world 18. HELD: 丙 (the user's, only if the eye asks for it) · DS-T0e · the passer's
>    read (RC) · a timing model · a continuous rank weight. THE QUEUE: **the user's eye at world 18** → then,
>    on 自走: ④ a geometry note / ⑤ / or the next arc the eye names. THIS ROUND ENDS HERE (§0.0.5: a user gate
>    ⇒ write, stop — the push is the user's).
