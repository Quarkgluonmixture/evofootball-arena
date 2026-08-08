# 乙 — 盯防松紧 (THE MARK-TIGHTNESS CONTRACT: access-time-priced marking)

> Drafted by the commander 2026-08-08 under ruling #201 (the user ruled 甲
> "按照推荐走" on the #200.4 fork, with the mechanism DEFINED by the user's two
> reality questions — verbatim-anchored in VISION §1: 盯不盯人是判断不是规则 ·
> 真实后卫算的是时间账,输出是松紧不是开关). Binding once the embedded §6 VISION
> audit + §7 REALITY audit are ruled. Per the user's standing rule (2026-08-08,
> #201): every mechanism clause below is checked against BOTH.

## §0 The findings this slice answers

1. **PM-T1 (#199)**: the mark channel owns **79.97–84.57 %** of material-ask
   ticks at every dose — a certified compression ask is inaudible because the
   weak-side body is executing a mark stance, glued **1.2–2.6 m**
   ([`actionExecutor.ts:239`](../../src/ai/actionExecutor.ts#L239):
   `markDist = 2.6 − markingAggression·1.4`) to a man **15 m off the ball's
   lane** (#188.2(d)).
2. **The banked map (#191)**: mark selection carries NO ball-relevance variable
   anywhere — and (#200) a hand-written decline predicate would be the
   formation-menu violation family. **The user's reshape (#200/#201)**: keep
   the ASSIGNMENT (bookkeeping/handover are real football), fix the TIGHTNESS —
   today it is a fixed band read off one gene
   (`markingAggression`), blind to ball access.
3. **The reality model (the user's Q2, VISION-anchored)**: a real defender runs
   a TIME ACCOUNT — *how long would the ball take to reach my man vs how long
   do I take to close on him*; the flight time is his sagging allowance. The
   judgment is continuous and its output is continuous (touch-tight ↔ tucked-in
   loose marking), never a mark/don't-mark switch.

## §1 The claim (H-MT)

Pricing the mark STANCE by the access-time account — a gene-weighted sag that
grows with the slack between ball-reach time and own-recovery time, born
absent, assignment untouched — un-swallows the defensive ask: on the PM-T1
ruler re-run, the weak-side BODY moves (the #199 null body contrast resolves
negative) while marking's defensive function holds (equilibrium band incl.
goals, offside flag, spread/spacing/dupRun guards all quiet) — with NO decline
predicate, NO assignment change, NO box carve-out (short flight times in the
box price tight marking automatically).

## §2 Mechanism (M-MT, dormant behind its own explicit opt-in)

* **M-MT.1 — the ACCESS-TIME account.** For a marker with an assigned mark and
  the ball in play, out of possession: `slack = t_ball − t_self`, where
  `t_ball` = the ball's travel time from its position to the mark (from the
  engine's EXISTING kick/pass speed constant family — traced and frozen at
  MT-T0, no invented speeds) and `t_self` = the marker's closing time
  (`dist(marker, mark) / topSpeed` — the attack-the-drop arrival form,
  [`TeamBrain.ts:421-434`](../../src/ai/TeamBrain.ts#L421), an existing engine
  quantity). Both inputs (ball pos, mark pos, own speed) are ALREADY read by
  the stance code — no new perception channel.
* **M-MT.2 — the OUTPUT is stance distance, nothing else.** The existing stance
  ([`actionExecutor.ts:257-274`](../../src/ai/actionExecutor.ts#L257)) places
  the marker `markDist` from his man along the existing (mark→goal, mark→ball)
  blend. This slice adds a gene-weighted SAG on that same geometry:
  `markDist′ = markDist + g_MT · sagOf(slack)` — sag grows with positive slack,
  zero at zero/negative slack, capped by a frozen ceiling from a traced family
  (the 9 m zonal engagement radius
  [`TeamBrain.ts:493`](../../src/ai/TeamBrain.ts#L493) is the named neighbour;
  MT-T0 freezes the exact form). Direction is UNCHANGED (the existing goal/ball
  blend — sagging therefore moves the body ball-side/goal-side, the real
  tuck-in). No score change, no speed change, no new action.
* **M-MT.3 — the gene.** ONE new tactical gene (working name `markSag`), born
  ABSENT (absent ⇒ sag 0 ⇒ byte-identical), own explicit opt-in
  (`evolveMarkSag`-style, the #75/S2-P2 form), SEPARATE from
  `markingAggression` (which keeps its fixed-tightness preference and its
  triple coupling — map §5.3 — untouched); the two co-evolve (the separate-
  budget-lines lesson).
* **M-MT.4 — what is deliberately NOT touched.** `assignMarks` byte-identical
  (assignment, handover, the 22 m gate, threat ordering, zonal gate — all
  as-is); no decline/release predicate ANYWHERE (the #200 red line); the
  formations.test.ts man-tracking pin is expected to SURVIVE (a sagged marker
  still tracks his man — MT-T0 verifies which assertions read distances);
  `whetherEye`/price tables untouched; the PM compression seam stays banked
  and separate (it owns the FREE body's station; this contract owns the
  MARKING body's stance — the two channels together cover the trigger).
* **M-MT.5 — honesty limits (slice one).** The account reads geometry only —
  it does NOT read the carrier's ability to release (pressure/orientation/
  wind-up state); that refinement is a later slice and connects naturally to
  the O2 LOOK world. `t_ball` is a straight-line proxy (no lofted-arc solver
  in the stance layer); stated, not hidden. Sag uses the existing stance
  geometry — if that geometry cannot deliver lane-ward motion, F-MT-a exists
  to catch it.

## §3 Instruments & gates (the arc)

* **MT-T0 — dormant seam**: gene born absent + explicit opt-in, never
  bundle-defaulted; flag-off byte-identity + fingerprint + RNG-stream receipts
  (#181.2, the PM-T0 probe form); the traced constant freeze (`t_ball` speed
  family, sag cap family, `sagOf` shape) published with real file:line; the
  stance read-surface table (which executors/tests read `markDist`).
* **MT-T1 — THE RULER RE-RUN (the decisive test)**: the PM-T1 battery re-run
  under its OWN frozen instruments/predicates/seeds-discipline (fresh seed
  block; same N rule), arms = 2×2 at top dose {PM gene 0/1} × {MT gene 0/1}
  plus the absent control. Pre-registered success: with MT armed (alone and
  with PM), the BODY contrasts that were null in #199 resolve — body lane gap
  falls (CI < 0 at the top dose), shortfall falls, detachment does not rise —
  while the FULL #198-form guard set holds (equilibrium band incl. goals on
  ALL gated dimensions, offside flag, spreadY/spacing/dupRun non-inferiority).
  REPORTED (no gate): the swallow share (markStance may legitimately stay the
  steer owner — the body now compresses WHILE marking; the gate is the body,
  not the label), mark-assignment drift, the #188 detach/steer receipts.
* **Pre-named FAILs**: **F-MT-a** — the sag fires (stance targets move,
  instrument-verified) but the body lane gap stays null ⇒ the stance geometry
  is the wrong delivery (STOP; the fork returns to the user with the trace).
  **F-MT-b** — marking's defensive function breaks: the equilibrium band fails
  on a gated dimension (goals/crosses/headers…) or shots-conceded-style
  dimensions blow up at every body-moving dose (the Phase-30 axis made a
  gate) ⇒ STOP. **F-MT-c** — the clump re-imports (the PM-T1 guard set fails
  at every body-moving dose) ⇒ STOP.
* **MT-T2 / exit** = live A/B + the user's play-test (弱侧后卫还乱转吗 ·
  防守知道往哪走了吗 · 看得出"松盯内收"吗), keep/change/revert per lever;
  entries per the #168/#185 precedent.

## §4 Non-claims

No assignment/selection change (S1/S2 stay inventoried, untouched). No decline
predicate — ever, per #200. No carrier-state term in slice one (M-MT.5). No
zonal-scheme change. No claim about oscillation (the churn instrument is
retracted, #188 §8.4). Nothing ships without the play-test verdict — Road B
binds: flags dormant, fingerprint unchanged.

## §5 Sequencing

MT-T0 dispatches now (#201). MT-T1 (the ruler re-run) after MT-T0 banks.
O2-T1 stays queued behind or alongside per commander sequencing (#199.5) — the
arcs are independent. One writer per tree throughout.

## §6 VISION audit record (the #91 form, clause-by-clause at drafting)

* **vs §1 盯不盯人是判断,不是规则 (the #200 anchor)**: no predicate exists in
  the design; the judgment is a continuous gene-weighted account; "放人" does
  not appear. PASS.
* **vs §1 涌现纪律 / 污染边界**: the hand-built part is the DIMENSION (the
  time account — an engine-derivable quantity) and the frozen cap; the WEIGHT
  is the gene; style divergence (tuck-in vs man-glue) is selection's. PASS.
* **vs §1 感知诚实**: reads ball pos + mark pos + own speed — all already read
  by the stance path; no carrier mind-reading (explicitly deferred, M-MT.5).
  PASS.
* **vs the A4/PM precedent (BIRTH-NEUTRALITY)**: born absent, own opt-in,
  byte-identity gates at MT-T0. PASS.
* **vs #35.3 / blast radius**: the write surface is ONE stance scalar
  (`markDist`) behind the gene; assignment, gates, eyes untouched; the two
  prior stance reverts (30.5 floor, 31.6 stand-off — map §5.2) are respected
  because sag only ADDS distance above the existing floor, never tightens.
  PASS.
* **vs §2 watchability**: the sag is a READABLE body behaviour (tucking in off
  your man is visible); the play-test exit asks for it by name. PASS.
* Amendments produced: **none**.

## §7 REALITY audit record (the user's standing rule, 2026-08-08 #201: every
mechanism clause checked against real football)

* **The time account** = how actual defenders decide tightness (the flight
  time of the potential pass is the sagging allowance) — the user's Q2 answer,
  anchored. MATCHES.
* **Output continuity** — real marking runs touch-tight ↔ 8-10 m sag, never a
  binary release; the marker keeps ball-and-man in view (the existing stance
  blend already faces ball/goal). MATCHES.
* **The box prices itself** — crosses arrive in 1–2 s and box recovery
  distances are short ⇒ slack ≈ 0 ⇒ tight marking emerges without a carve-out,
  exactly as in real football where box marking is non-negotiable. MATCHES
  (MT-T1's box-threat receipts verify it empirically, not by assertion).
* **Assignment/handover kept** — real teams keep the bookkeeping (who has whom,
  passing runners on) even when sagging; we change tightness only. MATCHES.
* **Known simplification, disclosed** — real defenders also read the carrier's
  release ability (pressure, orientation); slice one omits it (M-MT.5).
  HONEST GAP, deferred to the O2-adjacent slice.
