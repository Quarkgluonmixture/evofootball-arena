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
