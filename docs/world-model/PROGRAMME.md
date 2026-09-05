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
> (the live rulings file holds #382+; earlier eras in the seven ARCHIVE files).
> (b) **NEVER read the record files in full.** Find any ruling:
> `grep -n "RULING #N " docs/world-model/PROGRAMME-RULINGS*.md`.
> (c) **Live-state edits land ONLY in this section.** A superseded block moves verbatim to
> `PROGRAMME-LOG.md` (era 2; era 1 sealed in `PROGRAMME-LOG-ARCHIVE-1.md`) — never stack
> state here. Rotate any governance live file past ~1,500 lines (#303 item 2's process law).
> (d) **Contracts / stage docs are cited by the rulings** — open on demand, not on resume.
> Canon sentences are COPIED from [`CANON.md`](CANON.md), never re-typed (#301).
> (e) Below this section only §0.0 (operations protocol) and Governance remain — live law;
> all history is in [`PROGRAMME-ARCHIVE-1.md`](PROGRAMME-ARCHIVE-1.md).

**STATE (#384 LANDED — ⭐⭐⭐ BQ-C1 BANKED AS A MIX READ, THE THIRD SENTENCE'S FORENSIC COMPLETE
(four censuses): of the intended target's lost receptions in the user's world 0.414040 is GEOMETRY
(the cushion pushes the ball ≥ 0.25 m/s off the foot and three ticks later the resolver wants it
inside a 2 cm margin — a contact at the edge of reach loses before skill is asked; the ball moved
more than the body on 0.63), 0.355874 the coin (honest, no heavy face), 0.157880 a defender's foot
inside the window (a real 被断), 0.057689 a body strike, 0.009933 a teammate, 0.004585 the line; the
visible 「弹回」 (a carom off a body) is the LANE classes — a non-target teammate first (BN-C0 C3) +
body strikes — which steps ②/③ inherit with 「有人挤人」; ⭐⭐ M-BK.5 THE CUSHION KEEPS THE BALL (BK
§2-AMENDMENT): armed, the ball takes the body's velocity and nothing else — the outward release and
tangential retention retired on the armed path, the window, margin, roll, contest and strike channels
untouched, no new constant; 🔄 BQ-T0 THE DORMANT CUSHION LAW DISPATCHED = the running step,
2026-09-05).** 🔄 **BQ-T0** (#384 item 6): flag `bqCushion` (default OFF); the ONE seam in
`applyControlContact` (shipped expression character for character when off); pins from birth
(`tests/bqCushion.test.ts`): G-OFF · G-KEEP (the census's mechanism on a fixture: edge-of-reach
contact by a running body — shut loses at the margin, armed keeps it and the roll runs; relative
velocity exactly zero) · G-CONTEST (an opponent within reach still replaces the attempt) · G-ROLL ·
G-STRIKE · G-SOLVER · G-WINDOW · seam map · G-RNG · fingerprint RUN; stage doc `BQ-T0-CUSHION-LAW.md`;
ZERO sims; scratch 900,003,100–199. THEN **BQ-T1** (#385): H-BQ.1 on world 12 — the intended target's
non-possession share FALLS ∧ the margin class FALLS ∧ the opponent-contact class does NOT fall ∧
do-no-harm ∧ the user's faces reported; BQ-C1's instrument reused. THEN steps ②/③ (the lane). THE
USER'S SENTENCES: 「弹回」 = geometry (BQ-T0) + the lane (②/③) · 「有人挤人」 → ②/③ · 「传到对面身上」 → ⑤ ·
「传不出去球」 untouched. THE RATIFIED ORDER (#366 item 1): ① CLOSED; M-BK.5 precedes ②. RC door
dormant, banked, HELD; BF's entry its own question; the roll's FORM deferred (it is now THE quality
law once the geometry is honest). ⛔⛔ World 12 untouched; the user's gate open (faces: opponent-first
0.322 · side-on 0.572 · completion 0.587). Held doors: a reach-margin term for the roll · the RC door
· a flight-facing limb · the heavy touch curve · the offer channel · 默契 · the chase limb · a keeper
READY limb · agility (a budget slice) · agility → turn rate · 低速/受压 glue · the dose middle 0.5 · DX
slices 3/4 · #358's set. Frontier: next sim ≥ **12,543,000** (open to BQ-T1); stats ≥ **117,600**;
registry **73**. Live rulings file = #382+ (#373–#381 in ARCHIVE-373-381). Prior: #384, #383, #382,
#381 — rulings.**
(1) THE PERCEPTION ARC (#296→#303) CLOSED CONFIRMED (verdict 「但是确实这一版本很像足球」;
gate sub-questions 过人慢半拍 · 逼抢读作时间攻击 still open, non-blocking). (2) ⭐⭐⭐ **THE
BODY-BALL HONESTY ARC (#304→#310) IS COMPLETE AND PAUSED AT ITS PLAY-TEST USER GATE** —
opened by the user's 「反人类的传球…得和现实足球重新对一下」+「球穿身体」+ the GK loop;
census → facing law → contact law → exam (**H-BK.1 PASS · H-BK.2 PASS**, 55/56 faces
re-derived bit-for-bit) → entry, six rounds of overnight self-drive (#305–#310), every
stage adversarially verified, two red gates ratified as frozen honesty along the way.
**THE ENTRY: `?a4world=9` = 「身体诚实的世界」** (world 8 + bkFacingLaw + bkContactLaw by
containment call; cost +2.86 kB main path, zero opt-in delta; the blurb carries the
honest cost). ⭐ THE RB ROUND-BODY SLICE also banked (#305, screenshots in
docs/world-model/rb-round-body/).

**SELF-DRIVE NIGHT 2 IS RUNNING (#311, user: 「继续自走吧,去做下面的那些」)** — the
ladder: ✅ R7 RB-2 BANKED (#312, `5ef0017` — one species on the pitch) → ✅ R8 BANKED (#313, `03d4902` — three doors discharged; #308 §CORR 2's attribution
corrected) → ✅ R8-FIX BANKED (#314, `579b5ae` — both ordered mutants die, guard 53 rows) → ✅ R9 BANKED
(#315: the +47 % = DIRECT CAROM only, distribution family 81 %, save family flat, punt
came home in the BASE world too; which-law attribution honestly UNSPLIT — named
instrument; the gate addendum written in the player's language) → ⭐⭐ R10: THE PRIVATE-SNAPSHOT CONTRACT BOUND (#316) → R11: IN-C0 ADJUDICATED ON A VERIFY FAIL
(#317 — the stripComments phantom-block bug blanked 1,194 code lines; static seam-map
numbers VOID, qualitative verdicts survive at the verifier's 1,488/254/77; ⭐ THE BATTERY
STANDS bit-exact: receiver = the blindest situation at every field (F2 .505 — the user's
接球前观察 story lands); argmax flips 5.6→15.7 % across k; the look CANNOT TURN and the
gaze machinery sits unwired; F2 recommended, F1/F5 rejected; stats registry completed at
56 entries; new canon: text-census corpus integrity) → ✅ IN-C0-FIX BANKED (#319, `17a3019` — numbers of record 1,490/255/79; naive pass
reproduces the void numbers exactly; mutation 5-gates-red run by the verifier's own
hands; ⭐ 81 alias gateways = IN-T0 call-graph homework; THE IN CENSUS CLOSES) →
⭐⭐⭐ THE DEFENSIVE DOCTRINE REGISTERED (#318, [`DEF-DOCTRINE.md`](DEF-DOCTRINE.md) — the
user's two messages verbatim: 压迫两人帽该由涌现决策取代(帽子实证在 TeamBrain.ts:363-367,
先让决策可定价再撤帽)· 乱跑 · 区域/链式长不出来 · 进球逐季通胀(与 goals-warming 仪器 +
BK-T2 对照臂出带双证)· 防守和进攻一样大) → ⭐⭐ R13: THE DF CONTRACT BOUND (#319 item 2,
[`DF-DEFENSIVE-BRAIN-CONTRACT.md`](DF-DEFENSIVE-BRAIN-CONTRACT.md) — one continuous
press/mark/cover/intercept surface per defender on SHIPPED accounts; the Phase-31 cap
retires only by measurement, two compensators never in one slice; styles emerge or the
substrate is biased; every exam carries the season ladder) → R14: DF-C0 STAGE-STOPPED
AND RATIFIED (#320 — the red gate = float association on 2/15 slope deltas at 1e-6, cause
pinned; the discipline honoured to the letter). ⭐⭐⭐ FINDINGS (provisional pending the fix
verify): 乱跑 = assignment thrash, mechanism one line (`team.marks.clear()` re-greedy every
pass; 16.13 switches/defender-min); 补位 module BUILT AND UNWIRED (defensiveCoordination.ts
imported by nothing); ⭐ the season ladder ATTRIBUTES the inflation — 攻在进化不是防在腐烂
(live 2.264→3.285 · defFrozen 3.028 · atkFrozen 2.468), and defending DEGENERATES FROM
READING TO CONTACT (interceptions 11.5→7.2, tackles rise); the cap's band is real (4-chaser
bin exactly zero). → ✅ DF-C0 BANKS WHOLE (#321: the fix moved ZERO
published numbers — the drifting copy was the frozen probe's own verifier side; 832
re-derivations exact; ⭐⭐ verify found THE ZONAL ADOPTION CAP — the ecology hand-caps
zonal at 4/16 clubs + a 0.3 entry coin (League.ts:988, evolve.ts:141): 区域防守长不出来
has TWO pinned reasons now; retiring it = a named measured menu item). ⭐⭐ THE FORK RESOLVED BY DELEGATION (#322, user 「自走吧」): DF-T0 first, IN-T0
next-after. NIGHT 3 RUNS. Previously: ① DF-T0 盯人持久化 (the 乱跑 cure, shipped
accounts, no new channel, the cap stays through its exam) vs ② IN-T0 私有快照+抬头 (the
perception substrate; the coordination cluster's true prerequisite; design ready: F2 law ·
gateway interposition · o2Look+gaze · 81 alias call-graph homework). A PACE question, not
a dependency (#320 item 3). THE BK PLAY-TEST GATE stays open in parallel (?a4world=9 vs 8,
wild ?pcdose=0). ✅ **DF-T0 BANKED** (#323: 盯人持久化 dormant on the shipped
markSagMetres slack; 乱跑 receipts 15.47→5.59 with the cap intact) → ✅ **DF-T1 BANKED**
(#324: H-DF.0 PASS all five conjuncts — 乱跑 CURED at exam grain, coverage RISING; ⭐⭐⭐
the reading-vs-goals split = the surface slice's measured mandate) → ✅ **IN-T0 BANKED**
(#325: the snapshot law at the carrier's gateway — one dispatch death at the account
session limit 2026-08-19, resumed 21:00, landed by the same workflow's continuation;
detail in the STATE block above) → ✅ **DF-T2 BANKED** (#327: one currency, the cap
intact, the book bites; body-grain degeneracy red-left-red for the exam) → ⭐⭐⭐ **THE
USER'S BK VERDICT** (#326: 2/3 positive, registration deferred past the in-flight
executor per §0.0) → ✅ **IN-T1 BANKED** (#329: the look buys the book back 27.5→0.95
sim-s; the keeper won't turn his back — emergent; one red ratified as a mis-pitched
conjunct) → ⭐⭐⭐ **THE USER'S GK REFINEMENT + ARC HYPOTHESIS** (#328: distribution carom
unrealistic, insert-queued) → ✅ **BK-C1 BANKED, ZERO RED** (#331: B alone — the lines
exist and are never chosen; more ceiling buys nothing; the z=0 release-height surprise) →
⭐⭐ **THE USER GENERALIZED THE CORRIDOR MANDATE** (#330: passes AND shots; curl exists,
election unmeasured) → ✅ **DF-T3 BANKED ON AN HONEST RED** (#332: (b) all-pass inside
the cap, (a2) TAKE misses by 0.008 unrescued → DF-T3B queued; the two doors trade
reading vs goals; registry corrected 64) → ✅ **IN-T2 BANKED** (#333: H-IN.1(b) PASS at
7.95 hw — the 中场 story is law; (a1) red as pre-named → IN-T2B; the gen-1 level
separation = the arc's pre-entry question; landed through two session deaths, verify
clean PASS) → ✅ **BK-T3 BANKED** (#334: the carom falls 8× while unpriced controls
stand still; the suppression-vs-re-aim question named; one HIGH corrected of record;
survived a network death by full re-walk, byte-equal ×3) → ✅ **THE POWER PAIR BANKED**
(#335: H-DF.1 passes of record, cap-off unlocked; H-IN.1(a1) closed as measured —
carrier ≈ off-ball is the world's answer) → 🔄 **BK-T4 DISPATCHED** (the corridor exam:
dose ladder + evolution finds the weight, #335 item 5). NIGHT 5 RUNS.

**THE GATE (the user's eyes are the authority — 2/3 ANSWERED POSITIVE, #326):**
`?a4world=9` vs `?a4world=8`: **球不再穿人了吗 ✅** (「球不穿过人了」) · **门将的球看着
讲理了吗 ✅** (「门将的球看着还不错」 — the +47 % carom accepted as football liveliness)
· **传球像人了吗 — OPEN**, verdict welcome any time (the facing law's perceptual half;
its honest cost: 传球完成率 −8.9 pp, the pass oracle has not learned to avoid bodies
yet).

**MENU (named doors, none in flight; the IN and DF arcs above ARE the running work)**: the foul-visibility slice (#303 item 3(vii)) · world-8/9 default
promotion (costed: full rebaseline) · RB-2 officials/coaches rounding (#305 item 2) ·
⭐ the pricing shelf, now EXAM-BACKED at its top: the punt landing price (#309 item 3(i))
+ oracle-hazard pricing (teach the pass oracle the contact law, #309 item 3(iii)) +
windup-power coupling (#303) · the possession-chain ledger (splits 弹回门将, #309 item
3(ii)) · the `League['matchFlags']` naming door (#310 §CORR 3, one line, src/sim
authority) · o2Look/ekHoldVeto discharges · the σ-half of #291.1 · the #248 ledger ·
PW entry · movement/coached-shape · M-CB.5 · EK-holds · zone-keyed widening · per-body
dose · derived dose artifact · style arc + R-丙 · perf menu ①–⑤ · #248 fork ·
six-source registrations · deflation · pitch × numbers · MT eyeball entry · INFO slice 3.

**STANDING DEBTS**: the CB seam's S∧¬T guard (due at next CB src work) · every new probe
generation quotes CANON.md's worker-fixture sentence verbatim · (the anti-pinball comment
anchor was discharged at #313 — struck by #329 §CORR 6, verified in Match.ts).

**FRONTIER (the rulings' consumption items are the authority)**: next sim block ≥
**12,520,000** (12,520,000–999 OPEN to BK-T4 in flight; 12,518/12,519 consumed whole by
DF-T3B/IN-T2B #335; 12,517 by BK-T3; 12,516 by IN-T2; 12,515 by DF-T3; 12,514 by BK-C1;
12,513 by IN-T1; 12,512 by DF-T2; 12,511 by IN-T0; 12,510/12,509 by DF-T1/DF-T0; 12,508
by DF-C0; 12,507 by the IN census; 12,506 by R9; 12,505–12,501 by the BK arc; 12,494,000
permanently retired) · next stats base ≥ **116,800** (registry of record **69**;
116,400/116,600 consumed by #335; 116,800 open to BK-T4) · fingerprint of record
`57b0bdab…c673` (unmoved through every arc). Rulings live file = #373+.

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
