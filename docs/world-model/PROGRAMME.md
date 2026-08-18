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

**STATE (#303, 2026-08-19): ⭐⭐⭐ THE PERCEPTION ARC (#296→#303) IS CLOSED — CONFIRMED AT
ITS PLAY-TEST GATE BY THE USER'S EYES.** H-PC.1 POSITIVE (#300); the disease faces moved
for the first time in the programme; entry **`?a4world=8`** live (#301, fix #302); the
verdict of record: 「但是确实这一版本很像足球」. Gate sub-questions 过人慢半拍 · 逼抢读作
时间攻击 remain OPEN, non-blocking — the user may answer any time. The play session's ten
observations are registered and mechanism-answered at file:line grain in **#303 item 3**
(zero seeds consumed; the sweep was read-only).

**AUTHORIZED NEXT STEP (user directive, #303 item 3(iii)): THE ROUND-BODY PRESENTATION
SLICE** — the 3D mannequin is all BoxGeometry (`PlayerModel.ts:134–160`) and reads square;
round the body (render3d layer ONLY, zero sim files, fingerprint untouched by
construction, before/after screenshots for the user's eyes). Next `go` dispatches this
unless the user's word reorders.

**THE FORK (#303 item 6 — awaiting the user's word):**
① **拿住球买信息** — INFO-DOCTRINE slice 2 (scanning / private snapshots), the user's own
   repeated ask (#169 → #303 item 3(viii)); composes with the confirmed slice-1 world.
   **RECOMMENDED.**
② **犯规可见性** — write the victim's stumble at `awardFoul` + presentation (substrate
   complete: ten stun write sites, both renderers animate it; #303 item 3(vii)).
③ **GK-distribution census** — H-303a: pricing defect vs low-passBias ecology; mix ×
   situation × genes × outcomes; the punt's missing landing price (#303 item 3(x)).
④ **ball-contact honesty census** — the z ∈ (1.30, 1.35) dead band (code fact) +
   through-body flight frequency (#303 item 3(vi)).
⑤ **world-8 default promotion** — costed (worker fixtures play the shipped world ⇒ full
   rebaseline); not recommended before more soak.

**DOORS / MENU HELD (unchanged)**: PW entry (有压力才改力度 watchable; debts pwPowerLadder
fail-closed validation + pairsAsked ride with it) · movement/coached-shape · M-CB.5
carry-weight · EK-holds (持球买身后支援) · zone-keyed recognition widening · per-body dose ·
the derived ~2 kB dose artifact · style arc + R-丙 · perf menu ①–⑤ (+ the user's fx-low
test & Mac model answers still open) · #248 discharge fork (甲 recommended) · six-source
registrations · the pricing shelf (now also: the punt landing price · windup-power
coupling, both #303) · deflation · pitch × numbers · MT eyeball entry · INFO-DOCTRINE
slice 3 (feints/leakage) · teach-the-pass-oracle processing time.

**STANDING DEBTS**: the CB seam's S∧¬T guard (falls due at the next CB src work) ·
o2Look/ekHoldVeto composition discharges · the σ-half of #291.1 · the #248
earned-knowledge ledger (hold table · mode doctrine · assignMarks scheme) · every new
probe generation quotes CANON.md's worker-fixture sentence verbatim.

**FRONTIER**: next sim block ≥ **12,501,000** (12,494,000 permanently retired; #303 drew
ZERO) · next stats base ≥ **113,800** · fingerprint of record `57b0bdab…c673`. Seed
consumption history lives in the rulings and the LOG-preserved QUEUE blocks, not here.

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
