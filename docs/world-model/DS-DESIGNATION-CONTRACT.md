# DS — THE DESIGNATION CONTRACT (点名 · 谁决定这个人要不要前插)

> **What this contract binds.** Who decides that a body runs in behind. Today the COACH
> decides, per tick, for everyone; this contract opens the way to the PLAYER deciding, priced,
> with the coach's convention surviving as a shared prior. Its first stage is
> [`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md). Authority: **COMMANDER RULING #405 item 3**
> (the law, the pins, the file list) standing on **#405 items 1–2** (DS-C0 banked as
> measurement). Method docs govern as always; VISION is the gold standard.

---

## §0 THE DIAGNOSIS CHAIN — the numbers of record

Every number in this section is QUOTED BY FIELD NAME at 6 dp from
[`data/ds-c0-designation-census.json`](data/ds-c0-designation-census.json), arm **E13**
(world 13 EMPTY-BOOK, ③'s control), the artifact of
[`DS-C0-DESIGNATION-CENSUS.md`](DS-C0-DESIGNATION-CENSUS.md). Canon **doc-prose fidelity**:
*"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"*.
The four faces ruling #405 item 1 DOWNGRADED are marked ≈ and load-bear nothing.

**THE READ OF RECORD (#405 item 1): EVERY OPEN-PLAY RUN IS A HAT.**

1. **The coach speaks, and he speaks about running.** `coach.ticksPerMatch` = **1352.582583**
   team-brain ticks a match, of which `coach.inPossessionShare` = **0.487776** run past
   `assignRunners`' possession gate. Each such tick names `runCount.mean` = **1.509372**
   runners — bins `runCount.binShare.0` = **0.093400**, `.1` = **0.372098**, `.2` =
   **0.466231**, `.3` = **0.068271**, `.4plus` = **0** — for
   `runCount.designationsPerMatch` = **995.819820** run designations per match.
2. **Who is named is the number on his back.** `runnersByRole.share.ST` = **0.555074** ·
   `.WG` = **0.381453** · `.MF` = **0.045806** · `.DF` = **0.017666**. The arriver is the MF
   `arriverByRole.share.MF` = **0.841065** of the time (the code says "player 2").
3. **THE PLAYERS HAVE NO RUN OF THEIR OWN.** Read off the engine's OWN decision record — the
   winner's `why` in `p.action.scores[0]` — the attacking `MakeRun` decisions split
   `hatClass.shareOfMakeRun.attackingTheBox` = **0.479782** ·
   `.licensedRunInBehind` = **0.471779** · `.arrivingLate` = **0.038211** ·
   `.overlapping` = **0.005431** · `.oneTwoBurst` = **0.003058** · `.keeperUp` = **0.001740**
   · `.noWhyRecorded` = **0** · **`.OTHER` = 0 of 964,441**. `offBall.makeRunOtherShare` =
   **0**. The hatted share of the attacking outfield, `hatted.shareOfAttackingOutfield`, is
   **0.352495**. (`MakeRun`'s share of attacking off-ball decision ticks is ≈ **0.165296**,
   `offBall.actionShare.MakeRun` — DOWNGRADED to an approximation at #405 item 1 and used
   here for scale only.)
4. **The code fact, over the EXTRACTED call graph** (canon **code facts over the call
   graph**): `codeFacts.makeRunCandidatesAllHatGuarded` = **true** over **five** enumerated
   `MakeRun` pushes and **six** `why` literals, with **72** designation field sites
   (`codeFacts.everyFieldSiteResolved` = true) and a 238-span closure at depth 6. The OBM
   seat reads no designation (`codeFacts.obmSeat.obmSeatReadsNoDesignation` = true).
5. **The six `why` literals** (`definitions.engineConstants.whyLiterals`): `licensed run in
   behind` · `arriving late at the cutback arc` · `attacking the box for the delivery` ·
   `bursting for the one-two return` · `overlapping outside the carrier` · `keeper UP for the
   corner — nothing left to lose`. There is no seventh.
6. **The passer reads the hats — SIX consumption sites, not four, and the ⑤ boundary is
   STATED** (`passerReadTable`): THREE LABEL reads (`wallRun.partnerGid` · `team.overlapper` ·
   `team.arriver`) and THREE ACTION-TYPE reads (the through-ball's runner scan, the wall
   trigger, `registerPass`'s bounce classification). Whether a passer may read a LABEL his
   own coach wrote is question ⑤ and is NOT this contract's first slice.
7. **The yield, printed without a verdict word** (#405 item 1 struck the verdict words):
   a runner hat is set `ep.setsPerMatch.runner` = **141.890891** times a match, aimed at
   `ep.passAimedPerEpisode.runner` = **0.309018** passes per episode, completed
   `ep.passCompletedPerEpisode.runner` = **0.156763**, shots
   `ep.shotsPerEpisode.runner` = **0.062935**. The overlap is named
   `overlap.setsPerMatch` = **3.032032** times and the ball reaches the overlapper
   `overlap.playedToPerSet` = **0.013536** per set (41 arrivals in 999 matches). The wall-pass
   licence issues `wall.firesPerMatch` = **10.464464** times a match and the return is played
   `wall.returnShareOfFires` = **0.026880** of the time. The arriver's cutback candidate forms
   `arriver.cutbackFormedPerMatch` = **14.197197** times and is taken
   `arriver.cutbackTakenPerMatch` = **4.993994**. Shots within 6 s per completed pass, to a
   HATTED receiver `downstream.shotsPerCompletedPassHatted` = **0.438567** vs UNHATTED
   `downstream.shotsPerCompletedPassUnhatted` = **0.213764** — printed beside each other, the
   two groups differing in far more than the hat.

**THE DIAGNOSIS.** 前插 in this engine is a top-down LICENCE with no player-side choice. The
run exists; the *decision* does not. That is a substrate gap of exactly the kind VISION §1
names, and it is the DF path's shape: build the priced decision FIRST, retire the
compensator by MEASUREMENT afterwards (DF §2 M-DF.2), never by deletion.

## §1 CLAIMS

* **C-DS.1** The run in behind should be a candidate the body PRICES, on the same menu and
  settled by the same argmax as everything else he does.
* **C-DS.2** The coach's ranking should survive as a **共同 prior** — a pre-match convention —
  not as a per-0.4-s order.
* **C-DS.3** The eyes that price the run are the OBM seat's, already built and already
  computed at that exact site; the own run needs no new sense.
* **C-DS.4** Whether the hat can then be retired is a QUESTION FOR MEASUREMENT, and the
  measurement needs an arm in which the hat is absent. That arm is `dsHatsOff`.
* **C-DS.5** None of the above may cost one byte of the shipped world until the commander
  rules on the exam.

## §2 THE MECHANISM — M-DS.1–5 (built at DS-T0, dormant)

* **M-DS.1 — THE OWN RUN.** ONE new `MakeRun` candidate in `decideOffBall`'s in-possession
  branch, for a body carrying NO hat (not in `team.runners`, not `team.arriver`, not
  `team.overlapper`, no live `p.wallRun`; the carrier and the keeper are excluded
  STRUCTURALLY by `decidePlayer`'s own dispatch), pushed ONLY when `match.dsOwnRun` is true;
  `why: 'own run in behind'` — the SEVENTH literal, pinned, with the six unchanged. **Its
  executor routing is the EXISTING default branch of the `MakeRun` case (`runTarget`) — NO
  executor edit**, and a fixture MEASURES that the unhatted body's steering is that branch's
  own arithmetic (#401: who enters a branch is a measurement).
* **M-DS.2 — THE PRIOR IS THE COACH'S OWN RANKING, MOVED TO THE PLAYER.**
  `score = W.runScore · prior · obmRunMul · (tired ? OFFBALL_TIRED_MUL : 1)`, with
  `prior = clamp01((RUN_ROLE_W[role] + localX / RUN_DEPTH_DIV) / RUN_PRIOR_MAX) ∈ [0, 1]`.
  `RUN_ROLE_W` is `assignRunners`' own object, EXPORTED and never re-typed; `RUN_DEPTH_DIV`
  is the designation's own `/ 45` given a home; `RUN_PRIOR_MAX` is DERIVED IN CODE as
  `Math.max(...Object.values(RUN_ROLE_W)) + HALF_L / RUN_DEPTH_DIV`. **NO NEW CONSTANT
  ANYWHERE.** The bound and the clamp's exact bite are derived in the stage doc's §LAW.
* **M-DS.3 — THE EYES ARE THE OBM SEAT'S.** The same `obmRunMul` the licensed run already
  uses — exactly 1 when `obmMovement` is absent, and `s *= 1` is an IEEE-754 identity. NO new
  feature, NO new gene, NO new percept pull at T0.
* **M-DS.4 — THE HATS-OFF ARM, dormant.** A SECOND flag `match.dsHatsOff` under which
  `assignRunners` skips exactly its TWO OPEN-PLAY blocks (the runner scoring and the open-play
  arriver pick), so open play carries no 前插 hat. The corner-crash-held, live-corner and
  cross-flight branches, the 套边 block and the wall-pass trigger are UNTOUCHED. The bypass is
  PURELY ADDITIVE (the DF-T4 idiom). **This is M-DF.2's law applied here: the compensator
  retires by MEASUREMENT, never by deletion — the shipped designation stays in the code and
  stays ON in every world.**
* **M-DS.5 — BORN INCUMBENT-EQUIVALENT, NO PREDICATES (#200).** Both flags default OFF and
  appear in no world, preset or `a4MatchFlags`; OFF ⇒ every decision and every match
  byte-identical to HEAD. The score is weight × continuous quantity: the fork's whole
  conditional set is the GATE (the flag), the GUARDS (the hat reads and the wall licence's own
  clock liveness), the CAP (`clamp01`) and the incumbent `tired` multiplier. The fork's
  COMPLETE READ SET is enumerated in the stage doc — his own `pos`/`role`/`stamina`, his own
  side's licence board (stated as such, not a percept), `obmRunMul`, `W.runScore`,
  `team.localX` — and ⛔ NOT `pendingPass`, NOT `pendingPassWindup`, NOT an opponent's truth
  position, NOT `info.genome`.

## §3 INSTRUMENTS AND THE ARC

* **DS-C0** (done, #405 item 1) — the census of record; its instrument DEBTS are named there
  and inherited below.
* **DS-T0** (this stage) — the seam and its permanent pin suite. Dormant. Ships nothing.
* **DS-T1** (next, X-SRC-ZERO) — the exam, three arms on shared seeds: **HATS** (shipped) ·
  **HATS + OWN RUN** · **OWN RUN ALONE** (`dsHatsOff` armed), each with the OBM seat **ABSENT**
  and **DOSED** where DS-T0's §HONESTY says the eyes matter. Faces = DS-C0's own (designations
  → runs per tick, the hatted/own share, through balls, completion, shots, goals, the crowding
  family from OBM-T1, `spacingUnder4`), plus the two named probes of **H-DS-1** and
  **H-DS-2**. **E13 is the control.** DS-C0's instrument debts are PAID there: the decision
  holds read AFTER the step (or the engine's `pcLatency.ledger` delta carried as a calibration
  receipt beside the predicate — canon **engine ledgers before heuristics**), the shooter gid
  recorded at the push so `goalsPerEpisode` is not VOID, and bins past one full licence with
  the top bin's share printed beside every median.
* **ENTRY or STOP** — the commander's, on DS-T1's read. Nothing ships before it.
* **DS-T2** — the committed licences: **套边** and **二过一**, each with its own law and its
  own timing, untouched by slice one.
* **⑤ LAST** — whether the passer may read a label his own coach wrote (the six consumption
  sites of §0.6).

## §4 NON-CLAIMS

This contract's first slice claims **nothing** about: the **overlap** (its own licence, DS-T2)
· the **wall pass** (ditto) · **corners** and **crosses** (their branches are untouched) · the
**passer's label reads** (the ⑤ boundary, stated not fixed) · **the count restraint itself**
(1–3 runners lived in the coach; whether the player-side prior needs one is H-DS-1's question,
not an answer) · **the arriver's arc routing** (an own run lands in `runTarget`, in behind —
it does not reproduce the late cutback body) · **the prior's evolution** (it is still
hand-written numbers, moved not grown). It claims no football effect of any kind; DS-T0
measures identity and plumbing only.

## §6 VISION audit record (the #91 form, clause-by-clause at drafting)

* **vs §1, the commander sentence — VERBATIM from `docs/VISION.md` §1:**
  > 拆解(每条都接到既有骨架):**(a) FM 对比 = 本底座的存在理由**——FM 定死阵型是因为
  > 它的球员是代码执行器;我们的球员有真决策核(感知→价值→动作),所以阵型层的正确
  > 形态是**信念,不是指令**(= "共同 prior ≠ 逐 tick commander"铁律的"为什么")。

  Today's 前插 is exactly 指令: a per-0.4-s order from `assignRunners` that the body executes.
  M-DS.1 makes it 信念 — a candidate he prices — and M-DS.2 keeps the coach's ranking as the
  **共同 prior** the sentence licenses. PASS.
* **vs §1 底座给能力,不替球队定行为**: the seam adds a CAPABILITY (a run he may choose) and
  no mandate; who actually runs is the argmax's and the genes' business. PASS.
* **vs §1 不要写死预设**: no new taste number exists — every literal is an existing constant
  or a code-move of one. The prior is the coach's own numbers, and that they are still
  hand-written is DECLARED (stage doc §HONESTY 3), not hidden. PARTIAL, declared.
* **vs the #200 red line**: no predicate on a football quantity; gate/guard/cap only, pinned
  as a source assertion. PASS.
* **vs emergence (capability-not-mandate)**: born absent, dormant, armed only by a probe;
  selection or the user's eyes decide whether it is worth anything. PASS.
* **vs §2 watchability**: a striker who chooses his own run is the most readable thing in
  football — but DS-T0 shows the user nothing, by construction. DEFERRED to the play-test rung
  after DS-T1.
* Amendments produced: none.

## §7 REALITY audit record (the #201 standing rule)

* **A real forward's run is HIS OWN READ** — of the last line, of the ball, of his marker's
  hips — taken in the second it is on and gone if he waits for permission. No coach calls
  1.509372 runs every 0.4 s from the touchline; the engine does, and that is the gap. PASS
  (the mechanism moves toward the real thing).
* **The team's convention is REAL and it is a PRIOR** — "you're the striker, you run the
  channel" is agreed before kick-off and refreshed at natural beats, which is exactly what
  M-DS.2's prior is and exactly what the shipped per-tick order is not. PASS.
* **The coach's shout exists too** — real coaches DO shout "go!", but rarely, at beats, and
  the player may ignore it. Slice one keeps the shipped licence in place (it is ON in every
  world) and merely adds the player's own option beside it, which is closer to the real
  mixture than either extreme. PASS.
* **Honest gaps, named**: (a) a real run is timed against the DEFENSIVE LINE and the
  carrier's head-up moment — the own run at T0 has no timing model beyond the OBM seat's
  multipliers, so it may be early or late in ways the real thing is not; (b) real runners
  COORDINATE (one goes short as another spins) — nothing here builds that, and whether it
  emerges is DS-T1's to look at, not this stage's to claim; (c) a real player's prior is
  taught and re-taught, i.e. it evolves — this one does not yet.

## STATUS

* **#405 (2026-09-07) — DS-T0 BUILT, PINNED, DORMANT.** Both flags OFF everywhere; the OFF
  world byte-identical to HEAD `ca61a6a` on 36 recorded whole-match signatures across the bare
  world and worlds 13 and 15; the production fingerprint `57b0bdab…c673` unchanged; 31 pins
  green; `npm test` green (the two known wall-clock flakes re-run alone); `tsc --noEmit`
  clean. Nothing ships. The queue: **DS-T1** → entry/stop → DS-T2 → ⑤.
