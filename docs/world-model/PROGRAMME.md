# PROGRAMME — the stepwise handoff plan (2026-07)

> **Position in the doc hierarchy:** [`VISION.md`](../VISION.md) is the gold
> standard; [`EVO-BLUEPRINT.md`](../EVO-BLUEPRINT.md), [`SUBSTRATE-MAP.md`](../SUBSTRATE-MAP.md)
> and [`PROBE-CONTRACTS.md`](../PROBE-CONTRACTS.md) govern method. This file is
> the **operational sequencing layer**: which step is next, which contract
> binds it, and what an executor session may do. It creates no new authority —
> every step defers to its own contract doc.
>
> **How to use (user):** hand an executor ONE step: *"读
> `docs/world-model/PROGRAMME.md`,执行步骤 <ID>"*. Steps marked ★ need your
> ratification (usually: you handing it over IS the ratification). Steps
> marked TBD have no contract yet — they are drafted only after their
> gate-step lands, by a planning-grade session.
>
> **How to use (executor):** read this file, then the step's contract +
> handoff docs, then execute EXACTLY that step. Do not start the next step.
> Update this file's status column in your final commit.

## ⭐ QUEUE — THE LIVE STATE (read THIS section + the rulings tail; do NOT read the rest of this file on resume)

> **RESUME PROTOCOL** (2026-08-02 restructure; readability rotation 2026-08-19, #303).
> (a) **Resume = read THIS section + `tail -n 120 docs/world-model/PROGRAMME-RULINGS.md`**
> (the live rulings file holds #285+; #2–#284 in `PROGRAMME-RULINGS-ARCHIVE-001-284.md`).
> (b) **NEVER read the record files in full.** Find any ruling:
> `grep -n "RULING #N " docs/world-model/PROGRAMME-RULINGS*.md`.
> (c) **Live-state edits land ONLY in this section.** A superseded block moves verbatim to
> `PROGRAMME-LOG.md` (era 2; era 1 sealed in `PROGRAMME-LOG-ARCHIVE-1.md`) — never stack
> state here. Rotate any governance live file past ~1,500 lines (#303 item 2's process law).
> (d) **Contracts / stage docs are cited by the rulings** — open on demand, not on resume.
> Canon sentences are COPIED from [`CANON.md`](CANON.md), never re-typed (#301).
> (e) Below this section only §0.0 (operations protocol) and Governance remain — live law;
> all history is in [`PROGRAMME-ARCHIVE-1.md`](PROGRAMME-ARCHIVE-1.md).

**STATE (#303 + #304, 2026-08-19): THE PERCEPTION ARC (#296→#303) IS CLOSED — CONFIRMED AT
ITS PLAY-TEST GATE** (verdict of record 「但是确实这一版本很像足球」; H-PC.1 POSITIVE; entry
`?a4world=8` live; gate sub-questions 过人慢半拍 · 逼抢读作时间攻击 remain open,
non-blocking). The session's observations are registered and mechanism-answered at
file:line grain (#303 item 3; #304 item 1). ⭐ **RB ROUND-BODY SLICE BANKED (#305,
`c447a96`, verify PASS-WITH-FINDINGS 4 LOW)**: the 3D mannequin is round (lathed
rounded-rect barrels; bounding boxes byte-identical to the boxes replaced; pivots/
AnimationSystem untouched; fingerprint independently reproduced; screenshots committed
under docs/world-model/rb-round-body/ — the user's eyes judge in the morning; triangles
594→2,122/body accepted as honest inference, radial counts one-line tunable). ⭐⭐ **THE
BODY-BALL HONESTY ARC IS OPEN** —
contract [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md) bound (#304) on the user's
directive (「得和现实足球重新对一下」): OUT = the facing law (the kick's timeline absorbs
the required turn, derived from `TURN_RATE = 6.5` — a fully-reversed strike owes ≈29
unpaid ticks; a time cost, never a ban); IN = one contact law (through-body flights and
the z ∈ (1.30, 1.35) dead band collapse by construction); COMPOSITE = the GK-loop faces
REPORTED (the punt's missing landing price; the marked-defender half honestly scoped to
the movement/support doors, NOT promised).

**BK-C0 LANDED AND ADJUDICATED (#306, freeze `a6c0f4a` → result `e310401`, verify
PASS-WITH-FINDINGS 4 MED + 5 LOW, 219/220 faces independently re-derived; corrections
§CORR 1–5).** THE MAP REDRAWN: 反身 confirmed (26.9 % beyond square, 9.3 % backwards,
lives in the ordinary short pass) and its price NOT EVEN ORDERED (blind own-next-touch
.659 ≥ aligned .648); through-body has ONE dominant cause — cooldownInvisible 73.4 %/
81.9 % (the roll 5.2 %/0.18 %); the dead band real but tiny (8.49 ticks/match — closes
free); ⭐ H-303a REFUTED at frequency grain (86.2 % of GK distributions ARE short; the
user's eyes caught the loud minority, which is real: punts met in air 70.5 %, clearance
concedes 78.8 %, 瞬间被断 9.0 %); the turn-cost table: full reversal 29 ticks = 2.64× the
wind-up cap, the engine's own cone 68.28°, 33.6–36.3 % of releases outside it. **SLICE
ORDER RULED (#306 item 3): BK-T0 = the FACING LAW → BK-T1 = the CONTACT LAW
(cooldown-invisibility + the free z-partition) → composition exam → entry → THE BK
PLAY-TEST GATE.**

**BK-T0 BANKED (#307, freeze `2f1a6c8` → result `9ac9efe`, verify PASS-WITH-FINDINGS
1 MED + 3 LOW; §CORR 1–6).** THE FACING LAW IS DORMANT AND DERIVED: addedTicks =
max(0, ceil(θ/(TURN_RATE·DT)) − 11) in the shipped wind-up readyTick; cone = the
census's 68.28° edge; the body turns on shipped code; flag `bkFacingLaw` extends
whichever wind-up channels are armed (both-off ⇒ constructor refusal); byte-identity
double-proven + independently reproduced; 22 pins / 7 mutants killed; doors at the
world-8 stack clean. ⭐ Two red gates RATIFIED AS FROZEN: the law BOUNDS the residual
(.2999 → .0027 receipt), does not zero it for a moving body (exam question); the one
live-at-whistle arming = an INCUMBENT O1 debt. One-touch bypass is PASS-side only
(one-touch shots pay small facing ticks — named exam observation). Pass channel 46.5 %
of arms extended vs shots 8.7 % — the law bites exactly where 反身 lives.

**BK-T1 BANKED (#308, freeze `be13498` → result `dfb9fbd`, verify PASS, 2 LOW; §CORR
1–2).** THE CONTACT LAW IS DORMANT AND DERIVED: a cooldown/stunned body is struck (never
controls — the DEFLECT carom with its existence roll removed; the rejected cushion =
the superpower by the back door); shell = coreRadius + ball radius, closing condition =
the engine's own M1 rule; z-partition absorbed by the feet side BEHIND the flag.
Receipts: visual through-body 115.45 → 44.4 ticks/match, cooldown cause .804 → .492,
dead-band core cell 2 → 0, 0/1,078 strikes became ownership; the SHUT side reproduces
BK-C0 (instrument self-validation); composes freely (12/12 doors at world-8 + facing
law). Byte-identity + fingerprint independently reproduced; 23 pins / 7 mutants killed
(one VACUOUS PIN caught by its own mutant — fixture fixed, not the gate).

**IN FLIGHT (overnight self-drive)**: **BK-T2 — THE COMPOSITION EXAM** (dispatched #308
item 4): both BK laws armed atop the world-8 stack vs the base; H-BK.1/H-BK.2 SCORED on
virgin seeds (frozen CI rules); H-BK.3 REPORTED (GK-loop ledger · R-乙 chain faces ·
direction mix · the corridor rung if affordable); the #307 named observations measured
where cheap (one-touch shot tax · the moving-body residual split). Seed block
**12,504,000–999** + stats lattice from **113,800** opened to this stage.

**NAMED NEXT-AFTER (the user's own ask, held at priority)**: INFO-DOCTRINE slice 2
拿住球买信息 (scanning / private snapshots, #303 item 3(viii)) — the facing/turn
substrate BK builds is its natural prerequisite (a body that must turn to kick is the
body that must turn to look). Menu items held: the foul-visibility slice (#303 item
3(vii): write the victim's stumble at `awardFoul` — substrate complete) · world-8
default promotion (costed: full rebaseline; needs more soak) · RB-2 officials/coaches
rounding (#305 item 2: Referee/Linesman/Coach models are still the box species — one
file each).

**DOORS / MENU HELD (unchanged)**: PW entry (有压力才改力度 watchable; debts pwPowerLadder
fail-closed validation + pairsAsked ride with it) · movement/coached-shape · M-CB.5
carry-weight · EK-holds (持球买身后支援) · zone-keyed recognition widening · per-body dose ·
the derived ~2 kB dose artifact · style arc + R-丙 · perf menu ①–⑤ (+ the user's fx-low
test & Mac model answers still open) · #248 discharge fork (甲 recommended) · six-source
registrations · the pricing shelf (the punt landing price · windup-power coupling — both
#303, both now BK-C0-informed) · deflation · pitch × numbers · MT eyeball entry ·
INFO-DOCTRINE slice 3 (feints/leakage) · teach-the-pass-oracle processing time.

**STANDING DEBTS**: the CB seam's S∧¬T guard (falls due at the next CB src work) ·
o2Look/ekHoldVeto composition discharges · the σ-half of #291.1 · the #248
earned-knowledge ledger (hold table · mode doctrine · assignMarks scheme) · every new
probe generation quotes CANON.md's worker-fixture sentence verbatim.

**FRONTIER**: next sim block ≥ **12,504,000** (12,503,000–999 consumed whole by BK-T1
#308 item 3; 12,502,000–999 by BK-T0; 12,501,000–999 by BK-C0; 12,494,000 permanently
retired) · next stats base ≥ **113,800** ·
fingerprint of record `57b0bdab…c673`. Rulings live file = #303+ (#285–#302 rotated to
ARCHIVE-285-302, #306 item 4). Seed consumption history lives in the rulings and the
LOG-preserved QUEUE blocks, not here.

## 0.0 Operations protocol (how a step actually runs — codified
2026-07-31, ruling #92; user-ratified, reusable as-is)

1. **Roles & models.** COMMANDER = the Fable session: owns direction,
   drafts and reviews every design contract, disposes results via
   numbered rulings in [`PROGRAMME-RULINGS.md`](PROGRAMME-RULINGS.md)
   (the sole authority trail), reports to the user in plain Chinese
   (说人话). EXECUTOR = **Opus at medium effort** — never the
   commander inline (user cost ruling): executors pre-register
   stages, build probes, write up results; ONE authorized step each.
2. **Dispatch = the Workflow tool** (user-ratified 2026-07-31), at
   minimum two stages per executor step:
   * **Draft** — an Opus executor with the full brief: the binding
     contract, the read list, the deliverable, the iron rules
     (explicit-path staging only, NEVER `git add -A`; pre-commit
     `git status --short` must show only its own file(s), any foreign
     change = STOP; zero scope creep; structured-output return).
   * **Verify** — an INDEPENDENT Opus agent re-checks the commit
     against the binding contract WITHOUT trusting the author: git
     hygiene, frozen-before-sight criteria, number tracing (freeze
     honesty: every quoted figure traces to a published source),
     invariant fidelity. Machine-verify passing GATES the commander
     review; it never replaces it.
   * Post-flight rule: a "substantive" agent returning in seconds
     with zero tool calls did NOT do the work — verify repo state,
     retry (≤2), never silently accept.
   * ⚠ Do not edit the repo while a dispatched executor is running —
     its foreign-change STOP gate will (correctly) kill the step.
   * ⚠ Verify-stage agents are PURE CODE-REVIEW sessions (#95.5):
     fast output-producing commands only (git/grep/read); NEVER
     re-run silent long smokes — the workflow stall detector (180 s
     no-progress) kills them. The commander reviews the author's
     smoke evidence instead.
   * Stage pre-registrations that introduce NEW percepts or
     consumer mechanisms (not merely instruments) ALSO receive the
     explicit VISION audit at commander review (#111.4; the #91
     form).
3. **Contracts get a VISION audit — AND a REALITY audit.** After the
   commander drafts a design contract, audit it clause-by-clause
   against [`../VISION.md`](../VISION.md) BEFORE any executor work;
   findings become amendments + a ruling (precedent #90→#91: the
   audit caught the designation-anchor violation). ⭐ **Extended by
   the user 2026-08-08 (#201): EVERY commander decision —
   recommendations at forks, contract mechanisms, sequencing calls —
   is checked against BOTH VISION and REALITY (真实足球怎么做) before
   it is presented.** Precedent: the #200 challenge (a hand decline
   predicate passed blast-radius reasoning but failed the VISION
   shape test) and the #201 reality questions (the time-account
   mechanism replaced the lane-gap proxy). Contracts carry the two
   audits as parallel sections (§6 VISION / §7 REALITY, the
   MARK-TIGHTNESS form).
4. **Long runs** are supervised by the COMMANDER's resident session
   (#49.5): detached `nohup … & disown` + Monitor on PID + output
   file — sub-agent sessions die and orphan background processes.
5. **The round shape.** User "go" ⇒ ONE round: pull → read this queue
   head + the rulings tail → execute exactly the authorized step (or
   present the fork in plain language and wait) → push →
   plain-Chinese summary. Pre-registration discipline (gates freeze
   before runs; predicates never change after sight; FAILs reported
   as-is) and Road B (nothing ships, flags dormant, fingerprint
   unchanged) bind every round. Resume reads = the top ⭐ QUEUE section + the rulings tail, never a full read of this file.
6. **Adjudication discipline (user-ratified 2026-08-02, #144).**
   (a) **有故事就要有探针**: a causal STORY in a ruling either carries
   instrument evidence or is labelled HYPOTHESIS — never presented as
   a finding; a story that matters gets its own forensic probe
   (same-seed re-read + counters, discriminating predictions FROZEN
   before the run — the #140 form). (b) **决策点人话先行**: anything
   requiring the user's ruling (forks, gates, verdicts) is presented
   in plain football language FIRST (what happened / what it means /
   what each option buys and costs); numbers and codenames stay in
   the rulings, not the decision prompt.


## Governance (binds every executor session)

1. One step per session. Read the step's contract fully before touching code.
2. **Coordination rule:** Track C changes live mechanics → land only BETWEEN
   Track A experiments, never while one is mid-flight; every frozen result
   records the HEAD it ran at. After any live change: re-run
   `npm run fingerprint` + perf baseline and record both in the landing doc.
3. Escalate instead of improvising when: a contract seems to require a
   `src/**` change it doesn't authorise; any frozen gate value looks wrong
   AFTER seeing results (it isn't — report the FAIL); acceptance/seeds can't
   complete; determinism breaks; §2 equilibrium moves outside a C-contract's
   stated band.
4. Never `git add -A`. Stage explicit paths. Two-commit pattern for
   pre-registered experiments (pre-register, then implement+result).
   **Before every commit: `git status` must show ONLY files this session
   touched — any foreign modification means another session is writing;
   STOP, do not stage it, reconcile first** (ruling #9; commit `857784c`
   swept a concurrent session's uncommitted PROGRAMME edits).
   **The status check must be its OWN command whose output you read BEFORE
   the action it gates — never compounded with that action.** (Registered
   2026-07-25: the commander compounded `git status && git merge` and saw
   the E session's in-flight files only after the merge had run. No damage
   — the merge swept nothing, verified — but the check that fires after
   the action is not a check. This binds the commander too.)
4b. **One working tree = one writer (ruling #9).** Concurrent sessions must
   either stagger or run in separate `git worktree`s and merge through git
   (push/pull) — never through a shared directory, which silently swallows
   the other session's uncommitted work.
5. Model guidance: Track A = Opus med (discipline over creativity); B1 =
   Sonnet acceptable (user judges pixels); C1 = Opus med+high (live-balance
   risk). FAIL write-ups that reshape authority → strongest available model.
6. Update the status column here + the ROADMAP block in the same commit as
   the step's result. Delete a step's HANDOFF file in its final commit.


## Rotated history

All other historical sections (2026-07 context, direction, rulings index, track
tables, self-drive protocol, sequence sketch) live byte-verbatim in
[`PROGRAMME-ARCHIVE-1.md`](PROGRAMME-ARCHIVE-1.md) (rotated 2026-08-19, ruling #303).
