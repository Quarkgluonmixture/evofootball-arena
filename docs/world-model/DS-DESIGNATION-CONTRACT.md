# DS — THE DESIGNATION CONTRACT (点名 · 谁决定这个人要不要前插)

> **What this contract binds.** Who decides that a body runs in behind. Today the COACH
> decides, per tick, for everyone; this contract opens the way to the PLAYER deciding, priced,
> with the coach's convention surviving as a shared prior. Its first stage is
> [`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md), amended at DS-T0b in that same document's
> **§LAW-B** and again at DS-T0c in its **§LAW-C** (the law of record). Authority: **COMMANDER
> RULING #405 item 3** (the law, the pins, the file list) standing on **#405 items 1–2**
> (DS-C0 banked as measurement), then **#407 item 5** (the restraint slice) standing on
> **#407 items 2–4**, then **#409 item 4** (the rank slice) standing on **#409 items 2–3**
> (DS-T1b's numbers and the commander's diagnosis: the coach RANKED, he did not weigh motion).
> Method docs govern as always; VISION is the gold standard.

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

## §2 THE MECHANISM — M-DS.1–5 (DS-T0) · M-DS.6″ (DS-T0c, replacing M-DS.6) · M-DS.7 (DS-T0b) — all dormant

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

* ⛔ **M-DS.6 — THE COUNT PRIOR READ AS A VELOCITY MASS: SUPERSEDED AT DS-T0c** (built at
  DS-T0b under ruling #407 item 5(i); replaced by M-DS.6″ below under ruling #409 item 4(i)).
  Its form was `runningMates = Σ clamp01((a perceived mate's forward speed) / p.topSpeed)` and
  `restraint = clamp01(1 − runningMates / count)`. DS-T1b measured the over-correction and the
  commander struck the form (ruling #409 items 2–3): quoted BY FIELD from
  [`data/ds-t1b-own-run-exam.json`](data/ds-t1b-own-run-exam.json), arm of record
  `OWN-E13-ABSENT` against `HATS-E13-ABSENT` — `r1.runsPerInPossessionTick` **0.585428 →
  0.138356** (the own run a quarter of the coach's designations),
  `guard.throughBallsPerMatch` **6.156156 → 2.133133** (a guard BREACHED DOWNWARD),
  `seamFaces['OWN-E13-ABSENT'].restraint.mean` **0.570614** with `.exactlyZeroShare`
  **0.191379** (a fifth of candidates priced to exactly nothing), and
  `seamFaces['OWN-E13-ABSENT'].inFlightAndRestart.ownRunShareBallInFlight` **0.100272**. THE
  DIAGNOSIS (ruling #409 item 3(iv)): the velocity mass discounts EVERY body by the forward
  motion the whole team's advance supplies, whether or not anyone is running in behind; the
  coach's rule was a RANKED SELECTION. The term is **REMOVED from the source, not kept beside
  it** — `runningMates` and `p.topSpeed` appear nowhere in the fork, pinned positively. H-DS-3
  (the perceived restraint holds the coach's count) is NOT supported in this form.
* ⭐⭐⭐ **M-DS.6″ — THE RANK RESTRAINT** (built at DS-T0c, ruling #409 item 4(i); the law of
  record, seam doc §LAW-C). (a) The coach's own RANKING expression is CODE-MOVED out of
  `assignRunners`' `.map` as ONE exported pure function `runRank(role, localX) =
  RUN_ROLE_W[role] + localX / RUN_DEPTH_DIV`, and **the shipped `.map` CALLS it**, so the
  expression — and the `/ 45` — exists exactly ONCE in `src/**` (the arithmetic is identical
  and G-OFF measures it byte for byte). It is the side's shared convention on WHO should go,
  beside `runnerCount`'s shared convention on HOW MANY — a **共同 prior**, DECLARED, not a
  percept. (b) `rankAbove` = the number of bodies in HIS OWN
  `match.perceivedSnapshot(p).players` with `side === p.side` that resolve by gid to a roster
  mate who is not himself, not the perceived carrier (`snapshot.ball.ownerGid`), not the keeper
  and not sent off (role, side, sent-off and INDEX read off `team.players` by gid — a ROSTER
  fact, declared), and whose ranking `runRank(mate.role, team.localX(body.pos.x))` — **the ROLE
  from the roster, the POSITION from the SNAPSHOT'S COPY, never the mate's truth `pos`** —
  ranks above his own `runRank(p.role, team.localX(p.pos.x))`, with ties broken EXACTLY as the
  coach's sort breaks them (`b.s - a.s || a.p.index - b.p.index`: an EQUAL ranking and a LOWER
  roster index ranks above him, a higher index does not). A mate outside the cone is not in the
  snapshot at all and does NOT outrank him; a stale reading ranks him where he WAS. (c)
  `restraint = clamp01(count − rankAbove)` with `count = runnerCount(mode, tempo, urgency)` —
  **EXACTLY the coach's `scored.slice(0, count)` expressed as a cap**: 1 for the top `count`
  bodies he can see, 0 for the rest; and the score is
  `W.runScore · prior · restraint · obmRunMul · (tired ? OFFBALL_TIRED_MUL : 1)` in DS-T0's own
  statement order, with `prior = clamp01(mine / RUN_PRIOR_MAX)` built from that same ranking.
  **NO NEW CONSTANT**: the ranking's literals are the coach's own numbers moved (and now stored
  once each) and the count's are DS-T0b's code-move. **NO PREDICATE on a football quantity**
  (#200): the conditionals the slice adds are IDENTITY tests plus THE COACH'S OWN COMPARATOR — a
  ranking against a ranking and an index against an index, naming no constant and no threshold;
  the block's only inequality against a NUMBER is still the 2过1 licence's clock (the sentence
  is NARROWED, not left standing — seam doc §DEVIATIONS-C 1). **THE STEP FORM IS THE COACH'S
  OWN `slice`, DECLARED**; a continuous rank weight is a NON-CLAIM (§4).
* **M-DS.7 — THE STATE GUARD, PERCEIVED** (built at DS-T0b, ruling #407 item 5(ii);
  **BYTE-UNCHANGED at DS-T0c**, ruling #409 item 4(ii)). The own
  run is pushed ONLY when the PERCEIVED ball has an owner who is a same-side mate other than
  himself — `snapshot.ball !== null && snapshot.ball.ownerGid !== null && ownerGid !== p.gid`
  and the owner resolved on the ROSTER by gid. This is the shipped licence's own condition ("a
  carrier who is not me") read off `snapshot.ball` instead of `match.ball.owner`. **The
  in-flight and restart runs — 0.777604 of DS-T1's own runs — are WITHDRAWN from slice one**;
  a run onto a ball in flight is real football and is NAMED as the next slice (§4), not
  smuggled and not dismissed. ONE percept pull per own-run evaluation at the body's existing
  decision cadence, INSIDE the flag (absent ⇒ zero pulls ⇒ byte-identical); with the OBM seat
  armed the site takes a second, idempotent, rng-free pull rather than change that seat's
  signature (the seam doc's §DEVIATIONS-B 1). The fork's COMPLETE READ SET is enumerated in the
  stage doc's §LAW-B, and ⛔ it contains NO `match.ball`, NO `ball.owner`, NO `pendingPass`, NO
  other body's truth `pos`/`vel`, NO `info.genome`.

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
* **DS-T0b** (done, ruling #407 item 5) — THE RESTRAINT SLICE: M-DS.6–7 above, under the SAME
  flag `dsOwnRun`. Dormant. Ships nothing.
* **DS-T1b** (next, X-SRC-ZERO) — the same nine arms with the dose corrected, and with a
  **RUN-CAUTION probe corner** (`targetCongestion` and `ownMarker` pricing the run down — a
  hand-set corner in OBM-T1's form, declared a probe, not a dose of record) so **H-DS-2** is
  finally reachable; H-DS-3 is read off R1 on the OWN arm and H-DS-4 off G9 and the yield pair.
  The reads of #406 item 5(v) are re-frozen with the precedence unchanged.
* **DS-T0c** (done, ruling #409 item 4) — THE RANK SLICE: M-DS.6″ above REPLACING M-DS.6,
  under the SAME flag `dsOwnRun`, with M-DS.7 byte-unchanged. Dormant. Ships nothing.
* **DS-T1c** (next, X-SRC-ZERO) — DS-T1b's instrument with **`rankAbove` replacing
  `runningMates`** in the seam's own faces (the `restraint` distribution keeps its frozen bins
  and is now a two-point distribution by construction; the `rankAbove` distribution takes the
  place of the running-mates one), **twelve arms** as at DS-T1b (HATS · HATS + OWN · OWN on
  E13, each with the seat ABSENT · RUN-CAUTION · KITCHEN-SINK, plus the three seat-absent arms
  on D13), and **the reads RE-FROZEN UNCHANGED** with the precedence unchanged. H-DS-5 is read
  off R1 and G9 on the OWN arm; H-DS-6 off the RUN-CAUTION OWN arm.
* **ENTRY or STOP** — the commander's, on the read. Nothing ships before it.
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
hand-written numbers, moved not grown) · **a clean 前插 subtraction under `dsHatsOff`** (the overlap
pick and the cross-flight snapshot READ the board the arm empties, and the wall run moves downstream —
DS-T1 publishes those faces on every arm; ruling #406 item 1) · **a state condition on the own run**
(it is priced while the ball is in flight between mates and during the side's own restart, where the
shipped licence is not; DS-T1 publishes per-state faces — and DS-T0b's M-DS.7 CLOSES this, which
creates the next non-claim) · ⭐ **THE RUN ONTO A BALL IN FLIGHT** (DS-T0b WITHDRAWS it: the perceived
state guard fires only with a carrier at a teammate's feet, so 0.777604 of DS-T1's own runs — 0.542593
in flight plus 0.235011 at the side's own restart — are gone from slice one. That run is REAL football
and it is NAMED AS THE NEXT SLICE, not dismissed; what it cost is H-DS-4's question, measured at
DS-T1b, not answered here) · **that the perceived restraint works** (H-DS-3 is a labelled hypothesis;
DS-T0b measures identity, arithmetic and plumbing only) · **that a body with poor eyes restrains
himself correctly** (at DS-T0b an unseen run counted as NO running; at DS-T0c an unseen mate does not
OUTRANK him and a stale reading ranks him where he WAS, so a body with bad eyes ranks HIMSELF higher —
a declared limit, not a claim) · ⭐ **A CONTINUOUS RANK WEIGHT** (DS-T0c's `clamp01(count − rankAbove)`
is a STEP because the coach's `scored.slice(0, count)` is a step; that a body just outside the cut
should go at a DISCOUNT rather than at zero is football's more likely answer, and it is HELD — a door
for after the step form is measured, not a claim of this slice) · ⭐ **THE RUN ONTO A BALL IN FLIGHT,
STILL** (M-DS.7 is byte-unchanged at DS-T0c, and DS-T1b measured that the guard nevertheless leaks
through stale eyes: `seamFaces['OWN-E13-ABSENT'].inFlightAndRestart.ownRunShareBallInFlight` =
**0.100272** of own runs are won with the ball in flight, the guard reading the PERCEIVED owner while
the state classifier reads the truth — the named next slice, measured, not fixed here) · **that the
RANK restraint works** (H-DS-5 and H-DS-6 are labelled hypotheses; DS-T0c measures identity,
arithmetic and plumbing only). It claims no football effect of any kind; DS-T0, DS-T0b and DS-T0c
measure identity and plumbing only.

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
* ⭐⭐ **vs §1 「共同 prior ≠ 逐 tick commander」 and 感知诚实 (the DS-T0b clause)**: the count that
  used to be issued as an order — `slice(0, count)`, every 0.4 s — is now a **共同 prior** the body
  prices himself against, and what he prices it against is **像人眼一样获得数据**: his own
  `perceivedSnapshot`, with the trunk's cone, range, noise and staleness, and no truth read of any
  kind. The one thing he is allowed to know without looking is who is on his team, who is the keeper
  and who has been sent off — the team sheet and the referee's card, declared as shared knowledge.
  PASS.
* ⭐⭐ **vs §1 「共同 prior ≠ 逐 tick commander」 (the DS-T0c clause)**: the coach's per-0.4-s
  ORDER was two expressions — how many go (`count`) and WHO goes (the ranked `slice`). DS-T0b
  moved the first and mistranslated the second as a velocity mass; M-DS.6″ moves the second AS
  IT IS, and the player evaluates it on **his own eyes' account of where his mates are**. What
  is shared is the CONVENTION (the role weights, the depth divisor, the count) — a pre-match
  agreement; what is private is the READING. That is the sentence's own division of labour.
  PASS, with the declared limit that the convention's numbers are still hand-written and the
  cut is still a step.
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
* ⭐⭐ **A REAL FORWARD COUNTS WHO IS ALREADY GOING, AND HE WAITS FOR THE BALL TO BE AT A
  TEAMMATE'S FEET (the DS-T0b clause).** Both halves are what players actually do: you do not make
  the third run in behind when two are already gone — you hold, because somebody has to be there for
  the ball — and you start the run when a teammate is ON the ball and can see you, not while it is
  bouncing loose. M-DS.6 is the first sentence and M-DS.7 is the second, and both are read off his
  eyes rather than announced to him. PASS — with the honest caveat that the real player also runs
  ONTO a ball already travelling (the striker who goes as the pass is struck), which slice one
  cannot express and therefore WITHDRAWS and names (§4).
* ⭐⭐ **A REAL FORWARD KNOWS WHERE HE IS IN THE QUEUE (the DS-T0c clause).** "You're the
  striker and you're highest up — you go; the full-back forty metres behind does not" is a
  team convention every player carries, and what he checks in the moment is whether somebody
  ahead of him has already gone. That is `rankAbove`, and he checks it by LOOKING. PASS — with
  two honest caveats: a real player's queue is not a hard cut (the fourth-ranked forward still
  makes the run sometimes, which the step form forbids and §4 holds as a door), and a real
  queue is judged on more than role and depth (who is fresh, who is marked, which side the
  ball is on) — none of which this slice adds.
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

* **#406 (2026-09-07) — DS-T0 BANKED-DORMANT** (verifier PASS, zero HIGH; five MEDIUM disposed at the
  seam doc's §COMMANDER CORRECTIONS 1–8). The seam reached `origin/main` inside a commander CI push
  before verification — dormant, byte-identical, disclosed. DS-T1 dispatched: HATS · HATS + OWN RUN ·
  OWN RUN ALONE × OBM absent / dosed on E13 (D13 beside); R1 the flood face; the band the guards; reads
  naming DS-ENTRY, or OBM-T2 first, or a restraint slice, or a broken guard.

* **#407 (2026-09-07) — DS-T1 BANKED, THE READ OF RECORD (read 3, with G9 breaching beside it):** *"THE
  RESTRAINT WAS THE COACH'S — H-DS-1 holds with or without eyes; the law needs a player-side restraint
  term (a later slice); the seam stays dormant."* R1 `r1.runsPerInPossessionTick` 0.584786 → 1.832816
  (OWN, seat absent, E13; Δ +1.248030 [1.231920, 1.262842], tolerance 0.161586); ≥ 3 runners 0.014729 →
  0.328737; the same on D13 and with the seat dosed. `holdsBand` FALSE on every contrasted arm on ONE
  guard — through balls 5.962963 → 8.750751 (tolerance 1.647661); goals, shots, xG conversion,
  completion, interceptions, possession, passes, mean aim distance hold; the offside FLAG raised on all
  six arms. H-DS-2 UNTESTED (MARKER-ESCAPE prices the plane, not the run — `runMul ≡ 1`). Structural
  facts: 0.542593 of own runs are won with the ball in flight (the hats: 0.080620); the runner shifts
  ST 0.511573 → 0.349599, WG 0.425219 → 0.577084. NEXT: DS-T0b the restraint slice (the coach's count
  moved to the player against PERCEIVED running mates; the licence's state guard moved to the perceived
  ball's owner), then DS-T1b with a RUN-CAUTION probe corner for H-DS-2.

* **#408 (2026-09-08) — DS-T0b BANKED-DORMANT** (verifier PASS, zero HIGH; three MEDIUM disposed at the
  seam doc's §COMMANDER CORRECTIONS-B). M-DS.6–7 built under the same flag: the coach's count code-moved
  whole (`runnerCount`), read against PERCEIVED running mates (Σ clamp01(forward speed ÷ the observer's
  topSpeed)); the own run only when the PERCEIVED ball's owner is a mate; OFF byte-identical in five worlds;
  zero pulls with the flags absent; the second-pull form kept by ruling. The own run now needs the percept
  trunk (the bare world loses it — pinned). DS-T1b dispatched (RUN-CAUTION probe corner + KITCHEN-SINK).

* **#409 (2026-09-08) — DS-T1b BANKED, THE READ OF RECORD read 4:** *"A GUARD BREAKS — the guard is named;
  the commander decides with the table."* — G9 through balls, DOWNWARD (6.156156 → 2.133133, Δ −4.023023,
  tolerance 1.701043) on every OWN arm. THE FLOOD IS GONE AND OVERSHOT: R1 0.585428 → 0.138356 (Δ −0.447072;
  ≥ 3 runners 0.014271 → 0.004814); the own run is now a quarter of the coach's designations. HATS + OWN
  holds the band with no breach and no flood (+0.047939). The eyes at RUN-CAUTION price runs down (below-1
  share 0.901426; H-DS-2 measured as a face; read 2 unreachable by precedence once the flood is gone). The
  in-flight own run 0.100272 (stale eyes). Yield per own episode 0.037533 shots vs the hat's 0.127490.
  DIAGNOSIS (#409 item 3): the velocity-mass restraint over-corrects — it discounts EVERY body by the team's
  forward motion; the coach's rule was a RANKED SELECTION. NEXT: DS-T0c the rank slice (the coach's
  `slice(0, count)` moved to the player as `clamp01(count − rankAbove)` over PERCEIVED mates), then DS-T1c.

* **#410 (2026-09-08) — DS-T0c BANKED-DORMANT** (verifier PASS, zero HIGH; three MEDIUM disposed at the seam
  doc's §COMMANDER CORRECTIONS-C). M-DS.6″ built under the same flag: `runRank(role, localX)` code-moved
  (the shipped map calls it — the ranking exists once); `rankAbove` over PERCEIVED mates by the coach's own
  comparator (ties by roster index); `restraint = clamp01(count − rankAbove)` = the coach's `slice(0, count)`
  as a cap; the velocity mass removed; M-DS.7 unchanged; OFF byte-identical in five worlds; the pull count
  unchanged. DS-T1c dispatched (DS-T1b's instrument with `rankAbove` in the seam faces; the reads unchanged).

* **#411 (2026-09-08) — DS-T1c BANKED, THE READ OF RECORD read 1:** *"THE HAT CAN COME OFF — the player's own
  run holds the band without the coach and without eyes; DS-ENTRY is named: world 16 = world 15 + the own run
  with the open-play hats off."* `holdsBand` TRUE with an EMPTY breach set on the arm of record (G9 through
  balls 5.860861 → 5.306306, Δ −0.554555 inside tolerance 1.619448; goals 3.324324 → 3.350350; completion
  0.582113 → 0.586816; interceptions 27.384384 → 25.870871; the offside FLAG down); `floods` FALSE — R1
  0.588555 → 0.253849 (RESOLVED DOWN; the own run 0.431309 of the hats' rate — a fact the read does not
  carry); D13 agrees (read 1); RUN-CAUTION OWN ⇒ read 1 (H-DS-6 positive on the clean arm); KITCHEN-SINK OWN ⇒
  read 4 (G9 −3.248248 — the ceiling probe moves the plane too). The in-flight own run 0.119467 (stale eyes;
  the named next slice). Yield per own-run episode 0.047234 shots vs the hat's 0.132072; 63.429429 episodes a
  match vs 12.384384. H-DS-5: the band half SUPPORTED, the R1-within-tolerance half NOT. DS-ENTRY dispatched
  (world 16 = 15 + `dsOwnRun` + `dsHatsOff`; the seat absent).

* **#412 (2026-09-08) — DS-ENTRY BANKED: WORLD 16 = 15 + `dsOwnRun` + `dsHatsOff` OPEN** at `?a4world=16` (the
  user gate 「自己的前插 (v16) — keep | change | revert — <一句人话>」). Two doors, no gene, no constant, the seat
  absent; worlds ≤ 15 byte-identical; cost +7,180 B raw. The coach's open-play run licence (runner + arriver)
  retired by measurement. Remaining hats: 套边 · 二过一 (DS-T0d the switch → DS-T1d the measurement), corners
  / crosses / restarts (untouched by design); the in-flight run the slice after.
