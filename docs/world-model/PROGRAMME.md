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
3. **Contracts get a VISION audit.** After the commander drafts a
   design contract, audit it clause-by-clause against
   [`../VISION.md`](../VISION.md) BEFORE any executor work; findings
   become amendments + a ruling (precedent #90→#91: the audit caught
   the designation-anchor violation).
4. **Long runs** are supervised by the COMMANDER's resident session
   (#49.5): detached `nohup … & disown` + Monitor on PID + output
   file — sub-agent sessions die and orphan background processes.
5. **The round shape.** User "go" ⇒ ONE round: pull → read this queue
   head + the rulings tail → execute exactly the authorized step (or
   present the fork in plain language and wait) → push →
   plain-Chinese summary. Pre-registration discipline (gates freeze
   before runs; predicates never change after sight; FAILs reported
   as-is) and Road B (nothing ships, flags dormant, fingerprint
   unchanged) bind every round.

## 0. Where we are (context, 2026-07-24)

Banked, all dormant unless noted: M0–M4 embodied contest slice (LIVE),
S3a perception, D-PROC-0T intent privacy, S3-G0 active gaze, S3-G1
memory-guided attention. Closed with prejudice: D-ROTATE/D-INTENT/D-HANDOVER
(commander replacement, pre-gaze), C-RNG portability, static kick-vector
estimators. Full narrative: [`WORLD-MODEL-NEXT-AUTHORITY.md`](WORLD-MODEL-NEXT-AUTHORITY.md).

The three walls to VISION: **information** (nearly through), **decision
layer** (**first brick landed 2026-07-24** — A3/D-MUT-0 PASSED: two bodies
resolve a private conflict through observation alone, 76.9% resolved, no
commander and no communication. The road here: A2/D-PROC-1G fixed the
braking-vs-commitment confusion that sank D-PROC-1 (2/96) but was too slow
inside a unilateral 0.8s window; symmetrising it — where resolution needs only
ONE party to fire — cleared the cadence problem), **selection** (deliberately
unopened). Everything below is sequenced against those walls.

## 0.5 Direction (commander deep-think, 2026-07-24)

**Two engines of emergence.** Track A builds the information→decision
substrate (who sees what, believes what, responds how) — *tactics* live
there. Track C builds the craft-choice substrate (pass weight, body shape,
aerial timing, one-touch vs control) — *style* lives there. VISION needs
both, and they must go LIVE together: S3b proved one-sided live perception
fails at PAYS, and the vision-attr saga proved read/craft upgrades inflate
goals unless attack and defence co-evolve.

**The cadence reframe.** D-PROC-1G measured pure-evidence response at
~0.3–0.5s. Real players act faster — on PRIORS, not on accumulated evidence.
That is exactly what A4's layers are FOR, causally: coach doctrine = shared
priors that let a player act safely on less evidence; familiarity = faster,
stabler interpretation of the same external cues. Neither may reveal an
unobserved body — they buy LATENCY, not information. D-MUT-0 measures how far
pure evidence gets; whatever gap remains to football-speed coordination is
the quantified value of doctrine/familiarity when A4 opens. The cadence
finding was not a setback; it located the causal seat of coaching.

**The integration milestone** (first visible VISION moment): an **Embodied
Decision Slice** — one live, co-evolved bundle: perception-based pass choice
(the S3b redo, both sides reading), pass power (C1), first-touch decision
(C5), shipped only through six-layer + §2 band + user play-test. Until that
bundle survives PAYS, everything stays dormant by design; after it, the
discovery archive and "understand" UI (Track D4/D5) stop being fiction.

**Sequencing instinct:** when in doubt, prefer the step that (a) closes a
causal gap a prior FAIL named, (b) reuses banked machinery, (c) keeps the
live baseline untouched. That instinct produced S3-G0→G1→1MG→1G→D-MUT; it
generalises.

> **Self-drive status (2026-07-24, autonomous run COMPLETE — queue drained to
> user gates).** The delegated queue `ship B1 + apply B2 → C1-Phase0 →
> A3(D-MUT-0)` was executed in one session: B1 shipped, B2 applied,
> C1-Phase0 answered (drafted Phase-2 shape refuted; fork in the contract's
> §7), A3 **PASSED** — the decision-layer wall's first brick.
>
> **COMMANDER RULING on the three open forks (2026-07-24, pending the user's
> one-word ratification — on it, the autonomous queue below unlocks):**
>
> 1. **A3 fork → three-body direction, entered via S3-G2 first.** D-MUT's own
>    data locates the next constraint: all 15 unresolved states were mutual-
>    staleness safe-fails, and S3-G1 banked SINGLE-target attention only. A
>    three-body process makes every player track TWO moving partners with one
>    gaze — attention scheduling becomes the binding constraint before any
>    rotation shape can be honest. Ladder: **S3-G2** (dual-target interleaved
>    attention gate: can alternating memory-guided gaze sustain qualified
>    evidence on two moving targets? same G-series pattern, ceiling arm,
>    frozen support gates derived from S3-G1/1MG numbers) → **D-TRI-0**
>    (three-body rotation-shaped mutual response, gates derived from D-MUT's
>    banked numbers). Autonomous session drafts both contracts in that order
>    under pre-registration discipline.
> 2. **C1 fork → C1-A now (dormant, autonomous), C1-B GO as the next LIVE
>    slice** (user play-test gate at the end stays): honest speed-dependent
>    control cost is a standalone substrate-truth fix (heavy balls barely
>    cost anything today — the +0.07 raw term saturates at 14 m/s) and is the
>    prerequisite for the ENTIRE craft engine (C1-C, C5 both need reception
>    cost to be real). Six-layer + §2 band + paired A/B, narrow slice, lands
>    between Track-A experiments. **C1-C is DEFERRED into the Embodied
>    Decision Slice** — teaching the evaluator to price time/speed belongs to
>    the S3b-redo bundle, not a patch on `laneOpenness`.
> 3. **D1 GO, parallel, Sonnet-tier** — pure UI, user's eyes accept.
>
> Recommended queue on ratification: `C1-A → S3-G2 → C1-B(≤user play-test) →
> D-TRI-0`, D1 parallel. B2's render: user looks whenever; small tweaks only.
>
> **RATIFIED by the user 2026-07-24** ("按指挥官裁决继续"), then executed in one
> autonomous run: **C1-A** substrate banked (bit-identical) with its ledger
> honestly failed and re-posed as **C1-A2** (which came back clean: pace buys
> −17.4pp interception and costs the receiver nothing) → **S3-G2 PASSED** (dual
> attention banked; one acceptance-shortfall escalation resolved by sampling
> budget only, flagged for veto) → **C1-B implemented, §2 band broke on goals and
> long balls, honest-reverted**.
>
> **Queue state: back at user gates.** Per the self-drive protocol C1-B's
> non-PASS stops the queue. Open, all the user's:
> 1. ✅ **D-TRI-0 DONE — PASSED** (ruling #2 executed): three bodies resolve a
>    rotation-shaped conflict by observation alone at 77.0%, second-order churn
>    zero. The pre-laid fork is now live: **open A4** (coach doctrine /
>    familiarity as latency-reducing priors) **or prioritise the Embodied
>    Decision Slice**. Nothing else in Track A is authorised until you pick.
> 2. **The touch-cost fork** — fold C1-B into the Embodied Decision Slice
>    (recommended, `PASS-POWER-SLICE.md` §13.4) or spend the one unspent redraw.
> 3. ✅ **D1 BUILT** (ruling #3) — dual shell in place, fingerprint unchanged.
>    Waiting on your eyes; feedback is small CSS tweaks, not a new step. D2
>    (evolution scatter trails) becomes READY behind it.
> 4. **B2's render** — look whenever; feedback is small tweaks.
>

## Commander rulings — index

All commander rulings now live verbatim in
[`PROGRAMME-RULINGS.md`](PROGRAMME-RULINGS.md) (moved by ruling #45.2(0)).
The earliest unnumbered *"three open forks"* ruling remains inline in the
context block above; the numbered rulings are:

- COMMANDER RULING #2 (2026-07-24, pending the user's one-word ratification): &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #3 (2026-07-24, pending the user's one-word ratification): &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #5 (2026-07-24 — the D-TRI sync race + E1a re-stage): &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #6 (2026-07-25 — the E1a split verdict): &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #7 (2026-07-25 — E1b accepted; E2 split and constrained): &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #8 (2026-07-25 — E2a-1's selected-sample catch; the &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #9 (2026-07-25 — E2b-0 accepted; concurrency rule; &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #10 (2026-07-25 — E2b-1's split verdict; the &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #11 (2026-07-25 — E2b-1R accepted; E3 reviewed, GO): &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #12 (2026-07-25 — E3's verdict; the thesis amended by &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #13 (2026-07-25 — E3R 26/28; the last two gates get &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #14 (2026-07-26 — E3R2 accepted 29/29; E4 opens): &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #15 (2026-07-26 — E4 round 1 disposed; the value &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #16 (2026-07-26 — E5's split verdict; the &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #17 (2026-07-26 — E5c: both hypotheses refuted, &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #18 (2026-07-26 — E5d Phase 0: the axis re-ranks; &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #19 (2026-07-26 — Phase 1's stop; C3 redrawn on &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #20 (2026-07-26 — the cross-AI statistical audit, &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #21 (2026-07-26 — C3R accepted; the seesaw named; &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #22 (2026-07-26 — E5e Phase 0 disposed: Phase 1 closed &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #23 (2026-07-26 — E5f disposed: the collapse is one &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #24 (2026-07-27 — E5g disposed: nothing is broken; &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #25 (2026-07-27 — E5h disposed: the overlap file &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #26 (2026-07-27 — the user's verdict: ROAD B. The &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #27 (2026-07-27 — C5 T0's FAIL disposed: both fired &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #28 (2026-07-27 — C5 T1 approved to run; C4 T0's FAIL &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #29 (2026-07-27 — C5 T1's split verdict: the &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #30 (2026-07-27 — C4 T0R+T0b accepted in full; the &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #31 (2026-07-27 — T1-FLIGHT's three pre-run questions &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #32 (2026-07-27 — T1-FLIGHT Phase A disposed: F2 &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #33 (2026-07-27 — T2-ARRIVAL's pre-registration &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #34 (2026-07-27 — T2-ARRIVAL disposed: the defect &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #35 (2026-07-27 — Stage III P0 accepted; the &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #36 (2026-07-27 — the cross-AI audit disposed, &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #37 (2026-07-27 — O1/O2 released to run): &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #38 (2026-07-27 — O1 LEVER + O2 resolved harm &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #39 (2026-07-27): Stage III contract amended (§4.5 &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #40 (2026-07-27 — P1 disposed: the treatment never &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #41 (2026-07-27 — the station estimand re-founded: &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #42 (2026-07-27 — P1R accepted: the eye's premise &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #43 (2026-07-28 — P2 contract reviewed: compliance &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #44 (2026-07-28 — P2's double FAIL accepted as &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)
- COMMANDER RULING #45 (2026-07-28 night — OVERNIGHT AUTONOMOUS RUN &rarr; [PROGRAMME-RULINGS.md](PROGRAMME-RULINGS.md)


## Track E — the Embodied Decision Slice (the integration milestone)

(Superseded stub — the authoritative Track E table lives in the Track E
section below, maintained by the executing sessions.)

## Track A — the epistemology chain (information → decision)

| ID | Step | Contract | Status |
|----|------|----------|--------|
| A1 | D-PROC-1MG gaze-supported motion evidence | [`GAZE-SUPPORTED-MOTION-EVIDENCE.md`](GAZE-SUPPORTED-MOTION-EVIDENCE.md) | ✅ **PASS 2026-07-24** (`58d6632`): support 77.4%→100%, every 1M gate cleared, SHA `28971096…1b58` |
| A2 ★ | Motion-gated response consumer (D-PROC-1G): D-PROC-1 verbatim with two causal substitutions — gaze channel + three-sample motion-phase support predicate (braking ≠ commitment); H false-reopening ceiling `<=4/96` is the crux gate | [`MOTION-GATED-INTENT-REOPENING.md`](MOTION-GATED-INTENT-REOPENING.md) | ⛔ **STRICT FAIL — CADENCE FINDING 2026-07-24** (`80a1a848…2748`): crux gate FIXED (held false reopening 7/96→2/96), but jointly-completed 59<72 and ordered 50<56 — response works, too slow inside the 48-tick window. Family parked; no tuning; NO D-PROC-2. **Fork returns to the user (self-drive stopped).** |
| A3 ★ | Decision-layer wall, attempt 4 = **D-MUT-0 mutual motion-gated response** (attack-side entry). Commander CORRECTED the ratified fork's shape: the naive D-ROTATE re-pose is rejected by D-ROTATE-0's own anatomy (bids were 99.2% supported — observation was never the constraint; commander-gated action authority was, and its stop rule closes plain re-runs). Instead the banked 1G consumer is symmetrised: two off-ball teammates with conflicting private intents each read the other via gaze+motion evidence and each run the UNCHANGED 1G consumer — the first two-body mutual temporal process. Zero new src code; new coupled failure modes = mutual staleness + cross-player loops | [`MUTUAL-MOTION-GATED-RESPONSE.md`](MUTUAL-MOTION-GATED-RESPONSE.md) §7 | ✅ **PASS 2026-07-24 — THE WALL'S FIRST BRICK** (SHA `16e3867a…0097`, twice byte-identical, 96/96 accepted, zero `src/**` changes, fingerprint unchanged): materiality 65/65, **resolved 50/65 = 76.9%** (≥60%), progress 78.6%, combined revisions max 2, per-player max 1, zero cycles, gaze purity zero for BOTH observers. Cross-player loops absent; mutual staleness fails SAFE (all 15 unresolved states had zero revisions, honest retention). 20 states resolved with BOTH players revising. **Fork is the USER's** (§6): three-body extension, or bank and pivot to B/C |
| A3b | **S3-G2 dual-target interleaved attention** (ratified entry to the three-body direction): with one gaze and 6 scans per 48-tick window, can an observer keep a qualified three-sample history alive on TWO moving teammates, where attending to one starves the other? Analytic groundwork inside the contract: the 253.74° field means at most one target is ever out of field, so this is a CADENCE problem with zero slack (strict alternation = exactly 3 samples each = the predicate's minimum). Zero `src/**` changes | [`DUAL-TARGET-ATTENTION-SCHEDULE.md`](DUAL-TARGET-ATTENTION-SCHEDULE.md) | ✅ **PASS 2026-07-24** (§9, SHA `bc242ff8…7d4c`, 96/96 accepted in 681 seeds, 93 completed, fingerprint unchanged, all purity audits zero): **dual fresh 88.2%** (≥80) · **dual qualified support 74.2%** (≥60) · single-target gaze starves the other partner in **92.5%** of the same windows (0.42 vs 2.81 fresh) · I never worse on A2 (100%) · and the cost is real — splitting hurt the attended partner in 86.0% (6.00→3.56). Run 1 was an **acceptance shortfall** (69/96 in the frozen 512-seed budget) = a hard escalation; resolved by raising the SAMPLING BUDGET only (§8.1, same seeds, every gate verbatim) — flagged for the user's veto. Carry-forwards for D-TRI-0: comparison is vs single-target gaze not vs no policy (body-facing holds both in 44.1%), and dual SUPPORT ceilings at 86% even truth-aimed. **D-TRI-0 authorised** |
| A3c ★ | ⚠️ **VARIANT ACTUALLY RUN — not the commander's drafted A5 design (see the disclosure note under Track A).** D-TRI-0 triadic motion-gated rotation — three teammates in a CHAIN conflict (A–B, B–C), each reading its TWO partners via S3-G2's interleaved gaze and running the UNCHANGED consumer once per partner (first reopening wins; no belief merging). Spends both banked bricks at once. New failure mode: **second-order churn** — a replacement admissible against partner 1 may conflict with partner 2's supported set. Zero `src/**` changes | [`TRIADIC-MOTION-GATED-ROTATION.md`](TRIADIC-MOTION-GATED-ROTATION.md) | **PRE-REGISTERED 2026-07-24** (ruling #2 ratified): seeds `95,000..99,095` (budget set generously ex ante — the S3-G2 shortfall lesson), completion ≥40/96, materiality ≥70%, **resolved ≥45%** (0.769² × 0.92 ≈ 0.54 derived), progress ≥75%, combined revisions ≤6 / per-player ≤3 / zero cycles. ✅ **PASS 2026-07-24** (§7, SHA `d3624042…b435`, 96/96 accepted in 366 seeds, **74 completed** (≥40), zero `src/**` changes, fingerprint unchanged, 702/702): materiality **97.3%**, **resolved 57/74 = 77.0%** (gate 45) — *identical to D-MUT-0's two-body 76.9%, the third body cost nothing* — progress 76.6%, combined revisions max 4 / per-player max 2, zero cycles, and **second-order churn 0 of 145 revisions**. Responders A 38 · B 51 · C 50, all three in only 27% ⇒ chains settle on one or two moves, not a scramble. Purity/identity audits zero for all THREE observers; N/M equality 96/96 physical + 96/96 evidence. **Fork is the USER's, as pre-laid: open A4, or prioritise the EDS** |
| A4 ★ | Relevance selection ("who deserves attention"), then coach doctrine / familiarity as separate interpretation priors — the layering Codex pinned: neither may reveal unobserved bodies. Ref: [`../efootball_engine_research_for_evofootball.md`](../efootball_engine_research_for_evofootball.md) §1/§18 — external convergence on the latency-prior seat: eFootball's awareness is a CONTEXT-GATED startup bonus (task-state only, saturating ~90, never top speed), and §18.4's warning binds the draft: decision latency and movement acceleration are two channels — pre-register which attr feeds which, or one stat gets paid twice | TBD | Awaiting D-TRI-0's outcome: a resolution-axis FAIL makes the prior layers the direct next hypothesis; a PASS makes A4 one arm of the user fork (vs EDS-first) |
| A5 ★ | **D-TRI-0 three-body chain-conflict response**: targets chained A–B and B–C (A–C clear); A and C read B single-target (banked S3-G1), B reads BOTH via S3-G2 alternation — dual attention isolated at its minimal seat; all three run the unchanged 1G consumer, B's admissibility = union of both partners' supported sets (probe-level). Propagation is rotation's causal primitive | [`THREE-BODY-CHAIN-RESPONSE.md`](THREE-BODY-CHAIN-RESPONSE.md) + [`HANDOFF-D-TRI-0.md`](HANDOFF-D-TRI-0.md) | ⚠️ **STILL UNRUN.** The executor did not read this handoff (it landed mid-flight) and ran the A3c variant instead, so **the minimal-seat isolation and the union-admissibility rule were never tested** — see the disclosure note. Key gates unchanged: completion ≥42/96, B dual-support transfer ≥55%, partial resolution ≥65%, full-chain ≥45%, combined revisions ≤6, budget 2048 pre-authorised |

FAIL anywhere: the step's own stop rule binds; the fork returns to the user;
do NOT improvise a rescue or skip ahead.

> ⚠️ **DISCLOSURE (2026-07-24, executor): A3c is not A5.** Commander ruling #2
> drafted D-TRI-0 as [`THREE-BODY-CHAIN-RESPONSE.md`](THREE-BODY-CHAIN-RESPONSE.md)
> + a handoff, committed at `04af61d` while the executor was already mid-flight on
> a self-drafted contract. The executor never read them and ran its own variant
> ([`TRIADIC-MOTION-GATED-ROTATION.md`](TRIADIC-MOTION-GATED-ROTATION.md)), which
> PASSED on its own frozen gates. The differences are material:
> * **minimal seat lost** — A5 isolates dual attention at B alone (A and C read B
>   with banked single-target S3-G1). In the variant ALL THREE alternated, so dual
>   attention is confounded rather than isolated, and A5's `B dual-support
>   transfer >= 55%` gate has no data;
> * **union admissibility untested** — A5 specifies B's admissibility as the UNION
>   of both partners' supported sets; the variant explicitly forbade belief merging
>   and used first-reopening-wins, so its "second-order churn = 0" result speaks
>   to the weaker composition only;
> * **A–C clear not required** in the variant (A5 requires it), and A5's
>   partial-resolution ≥65% metric was not measured.
> What the variant does establish stands: a broader triadic configuration resolves
> 57/74 = 77.0% with zero churn, twice byte-identical. It bounds the question
> favourably but does not answer A5's question. Whether to run A5 as drafted is
> the user's/commander's call; the handoff is deliberately NOT deleted.

## Track B — make it visible (no gameplay risk)

| ID | Step | Contract | Status |
|----|------|----------|--------|
| B1 | Perception sandbox: default-off render overlay (`src/render3d/PerceptionSandbox3D.ts`) | handoff consumed (ROADMAP B1 block) | ✅ **SHIPPED 2026-07-24** (user gate waived): tsc + build clean, 697/697, fingerprint exact `57b0bdab…c673` ⇒ render-only proven. B2 respec applies on top |
| B2 | Exception-based rendering respec, grounded in `scripts/probes/perception-divergence-census.ts` data (at awareness 0.8: mean ghost error 0.45m ≈ 0.7% of pitch length, 9 near-truth ghosts/tick = ink without signal): ① render ONLY divergence — ghosts with error > 1m (8.6%), facts older than 15 ticks, an explicit warning marker for absent-but-within-12m bodies (0.27/tick, the real drama), lost/stale ball; hide the ~90% that matches truth; ② draw the ~106° rear BLIND wedge instead of the 254° cone; ③ prominent awareness 0.2↔0.8 toggle (at 0.2: 5 missing bodies, 28% lost ball — the legible contrast). Non-blocking; the user looks later | commander spec (this row) | ✅ **APPLIED 2026-07-24** (all three parts; thresholds are the census' own `ERR_M 1` / `STALE_TICKS 15` / `NEAR_RADIUS 12`; awareness chip lives in the overlay itself and rebuilds memory on switch). tsc + build clean, 697/697, fingerprint exact. **User looks whenever they like** — feedback = small render tweaks, no new step needed |

B1 is deliberately independent: it renders banked dormant machinery read-only
and can run in parallel with Track A.

## Track C — substrate slices (base + emergence, parallel-capable)

| ID | Step | Contract | Status |
|----|------|----------|--------|
| C1 ★ | Pass power as a priced choice | [`PASS-POWER-SLICE.md`](PASS-POWER-SLICE.md) | ⛔ **C1-B IMPLEMENTED → §2 BAND BROKE → HONEST REVERT (§13)** — fold touch-cost into the EDS — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| C2 ★ | Body orientation as a decision: outfield "open body / half-turn" — expose the existing capped-turn heading to the decision layer symmetrically (receive AND defend), gene/attr-priced. The S3-G0 twin: gaze freed the eyes; this frees the shoulders | **TBD — draft after C1 lands** (same convex-option-inflation risk family) | TBD |
| C3 | 假动作/feints: **NOT a buildable step — do not hand-code.** Deception becomes selectable only when opponents act on observed evidence at a cost (A1+A2) and the body can express misdirection (C2). When those land, feinting is an EVOLUTION observation, not a mechanic. Any session proposing a feint mechanic violates the soul — refuse | doctrine note only | GUARD |
| C4 ★ | Aerial contest as an embodied process | [`C4-AERIAL-ARRIVAL.md`](C4-AERIAL-ARRIVAL.md) | ⛔ **T2-ARRIVAL Phase A RUN 2026-07-27 — FAIL on D1 and F2** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| C5 ★ | First-touch decision: one-touch layoff vs control-first as a priced choice | [`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md) | ⛔ **T1 RUN 2026-07-27 — FAIL on H1** (T0R passed first) — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| C6 ★ | Embodied carrying — kill the glue | TBD — C-track template, Phase-0 code-map first | **REGISTERED 2026-07-26** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| C7 ★ | **Kick wind-up as sim time** (user anchor 2026-07-26, verbatim in VISION §3.1: 摆腿向那个方向,不是突然把球弹出去). Today a kick launches the SAME TICK the brain decides — zero preparation window (后摇 exists crudely as `kickCooldown` 0.3–0.5s). Make 前摇 real: a technique/pressure-priced preparation delay between commit and contact, during which the kick is committed (or cancellable at a cost) and defenders can close/block — pressing gains its real payoff seat; **one-touch BYPASSES the delay at an accuracy price** (C5's exact tradeoff — same family, likely one slice). ⭐ Bonus causal seat: the wind-up is OBSERVABLE — a defender reading the backswing is the 内心/外显/推断 model's external evidence, a future anticipation consumer. Ref: [`../efootball_engine_research_for_evofootball.md`](../efootball_engine_research_for_evofootball.md) §5/§20 (preparation delay = a pause before the windup, never animation scaling; low-stat floor, top-end diminishing; settled/first-time/chase kicks are different pipelines). ⭐ **bodyOrientationTerm named explicitly (user anchor 2026-07-27: 拧着身子传球——动画/前摇/精度都该变,且和能力有关):** the ACCURACY half already exists game-wide (`kickMisalignment`, `mechanics.ts:77`, ability-scaled, applied at passes/crosses/shots/clears) — C7 adds the TIME half (a twisted body pays extra preparation, technique shortens it), F9 the visible twist. ⚠️ Shifts EVERY pass/shot in the game (completion, interception, pressing value) → full §2 band + co-evo + #20 watchability battery; the VISUAL half is split off to **F9** (render-only, can land first) | **TBD — C-track template, Phase-0 code-map first.** C5-family (ball-foot interface); does not jump the queue | **REGISTERED 2026-07-26** |

**C-track template** (proven shape from C1; user's standing rule 2026-07-24:
"球员自己选择传球力度、空中争抢、停球是直接一脚给队友还是自己停——这些
职业足球的内容应该在底座下涌现"): Phase-0 code-map with file:line evidence
→ honest two-sided consequence in the substrate (benefit AND cost both real)
→ options priced by EXISTING evaluators, never a hand-written "when to X"
rule → technique/attr-scaled execution noise → six-layer acceptance + §2
equilibrium band + user play-test. Craft dimensions become choices; usage
patterns become evolution's discovery.

## Track E — the Embodied Decision Slice (the integration milestone)

Design contract: [`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md)
(commander-owned; **user chose EDS over A4-first, 2026-07-24**, and directed
`E0→E1→E2→E3, stop at E4 for play-test`). Each stage pre-registers its own
contract. Nothing ships partially, in either direction: E4 reverts the WHOLE
bundle or ships it.

| ID | Step | Contract | Status |
|----|------|----------|--------|
| E0 | Dormant pass-option valuation: observation-only, 2–3 power levels, priced in flight time / corridor interception margin / touch difficulty. Must reproduce the C1-A2 ledger **including the world's near-flat reception cost** — modelling the defect is the point | [`EDS-E0-OPTION-VALUATION.md`](EDS-E0-OPTION-VALUATION.md) + [`EDS-E0B-OPTION-VALUATION-REDRAW.md`](EDS-E0B-OPTION-VALUATION-REDRAW.md) | ⚠️ **E0 FAIL → E0b FAIL; no third re-pose authorised.** ✅ Banked twice on identical numbers: the evaluator models the interception physics — per-state ranking by predicted corridor threat moves the MEASURED opponent-first rate **0.558→0.346 (21.2pp)**, safest=1.15 in **52/52** contested, flight time and arrival speed monotone. ⭐ Banked finding: at awareness 0.8 the passer can price **nothing** in 55/120 states, split by distance (21.7m unpriced vs 16.8m priced) ⇒ observation DELETES ~46% of options, mostly long ones — the mechanism behind S3b's route collapse and **E2's central design problem**. ⛔ Unsettled: what the world charges for pace at reception — three metrics disagree (eventual control ~0, raw-4-tick INVERTED, formula +4pp), and E0b's reproduction gate caught the raw metric contaminating its companion. **E1 must be re-scoped to build a trustworthy reception measurement first — the user's call** |
| E1 | First-touch instrument re-scope (E1a → E1b) | [`EDS-E1A-FIRST-TOUCH-INSTRUMENT.md`](EDS-E1A-FIRST-TOUCH-INSTRUMENT.md) | ✅ **DISPOSED by ruling #6 (2026-07-25): E1b OPEN on I1's pass; I2 RETIRED** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| E1b | Flagged touch-cost curve | [`EDS-E1B-TOUCH-COST-CURVE.md`](EDS-E1B-TOUCH-COST-CURVE.md) | ✅ **PASS 2026-07-25** — Queue advances to E2 — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| E2 | Both-sides perception (dormant build), split E2a → E2b | [`EDS-E2A-CENSUS-PRIORS.md`](EDS-E2A-CENSUS-PRIORS.md) · E2b TBD | ✅ **DISPOSED by ruling #8 (2026-07-25): E2a re-posed as E2a-2** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| E2a-2 | Counterfactual option-space census | [`EDS-E2A2-OPTION-SPACE-CENSUS.md`](EDS-E2A2-OPTION-SPACE-CENSUS.md) | ✅ **PASS 2026-07-25** — E2b proceeds without a new ruling — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| E2b-0 | Threat calibration | [`EDS-E2B0-THREAT-CALIBRATION.md`](EDS-E2B0-THREAT-CALIBRATION.md) | ✅ **PASS 2026-07-25** — E2b-1 drafts on this PASS — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| E2b-1 | Both-sides perception A/B | [`EDS-E2B1-BOTH-SIDES-AB.md`](EDS-E2B1-BOTH-SIDES-AB.md) | ⛔ **FAIL 2026-07-25 — G3 perf and X3; QUEUE STOPS** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| E2b-1R | **Consumption-scoped perception** (ruling #10.3): the O(1) ball percept the sim actually reads, `perceiveSnapshot` split into advance-memory / materialise-snapshot, probe materialises only at pass moments. Honesty frozen; budget unchanged | [`EDS-E2B1R-CONSUMPTION-SCOPED.md`](EDS-E2B1R-CONSUMPTION-SCOPED.md) | ✅ **PASS 2026-07-25 — every gate** (§6, world hash `dd6dbd0a…bf38` identical across two invocations with perf reported beside it, fingerprint `57b0bdab…c673` unchanged, 734/734). ⭐ **G3: 1.329× → 1.0692×** (p95 1.406 → 1.0728) — honest perception at brain cadence costs **6.9%**, and not one rule about what a body can see moved. The diagnosis held exactly: the sim only ever read the BALL, so scanning a squad and allocating an `ObservedPlayer[]` was work whose output was discarded. Flag-OFF measured **5.319 µs/step** vs the frozen baseline's 5.32. ⭐ **B1 behaviour-neutrality — all seven families exact** (realized success, long-share, mean distance, brain agreement, class shares, look-pressure ×2, chosen counts): 3,000 moments × 4 arms and not one choice changed ⇒ **G1 and G2 reproduce BY CONSTRUCTION** — *not-looking never wins* and *the route mix survives perception* are now VERIFIED, not merely banked. **X6 honesty pin**: the cheap ball path returns exactly what the full path returns, asserted in-probe every run + `tests/observeBall.test.ts` every commit. **X3 corrected scheme demonstrated its own point** — the perf measurement changed mid-development and the world hash did not move. ⚠️ Two disclosures, both fixed by making the redraw MORE faithful: a keeper-passer skip I had silently dropped (oracle arm 64.6→68.3% at smoke — a behaviour change wearing a performance costume; B1 exists to catch exactly this), and a perf measurement order that let drift land entirely on the ON arm (now interleaved). **E3 drafts next; queue stops at E4** |
| E3 | Co-evolution audit | [`EDS-E3-COEVOLUTION-AUDIT.md`](EDS-E3-COEVOLUTION-AUDIT.md) | ⛔ **FAIL 2026-07-25 — five gates; QUEUE STOPS, the fork is the COMMANDER's** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| E3R | Revised-bundle audit | [`EDS-E3R-REVISED-BUNDLE-AUDIT.md`](EDS-E3R-REVISED-BUNDLE-AUDIT.md) | ⛔ **FAIL 2026-07-25 — 2 of 28 gates; QUEUE STOPS at the commander** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| E3R2 | Narrow re-audit | [`EDS-E3R2-NARROW-REAUDIT.md`](EDS-E3R2-NARROW-REAUDIT.md) | ✅ **PASS 2026-07-26 — ALL 29 GATES; the queue reaches E4** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| E4 ★ | Ship gate — user play-test of the whole bundle | design §3 | **OPEN** — **ROUND 2 VERDICT (2026-07-27): ROAD B** (no ship; flags default-OFF) — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |

| E5 | The value axis | [`EDS-E5-VALUE-AXIS.md`](EDS-E5-VALUE-AXIS.md) | ⛔ **E5b FAIL 2026-07-26 — 30/32 gates pass, the CENTRAL HYPOTHESIS does not; the fork is the COMMANDER's** (E5a PASSED) — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |

| E5c | The attribution experiment | [`EDS-E5C-VALUE-ATTRIBUTION.md`](EDS-E5C-VALUE-ATTRIBUTION.md) | ⛔ **RUN 2026-07-26 — NEITHER FIRES; the queue returns to the COMMANDER with a third cause named** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |

| E5d | The attempt-value axis | [`EDS-E5D-ATTEMPT-VALUE.md`](EDS-E5D-ATTEMPT-VALUE.md) | ⚠️ **RUN 2026-07-26 — THE AXIS RE-RANKS, and Phase 0 is still NON-PASS; the fork is the COMMANDER's** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |

| E5d-P1 | The attempt axis censused where it is deployed | [`EDS-E5D-PHASE1.md`](EDS-E5D-PHASE1.md) | ⛔ **THE LIVE AUDIT FIRES ON H1 AND H2 — 30/32, E4 round 2 does NOT open, the fork is the COMMANDER's** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |

| E5e-P0 | State-conditional value, Phase 0 | [`EDS-E5E-STATE-CONDITIONAL.md`](EDS-E5E-STATE-CONDITIONAL.md) | ⛔ **(b) RUN 2026-07-26 — NOT CERTIFIED; the fork is the COMMANDER's** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |

| E5f | The overlap funnel | [`EDS-E5F-OVERLAP-FUNNEL.md`](EDS-E5F-OVERLAP-FUNNEL.md) | ⛔ **RUN 2026-07-26 — MEASURED, and it lands on the branch §5 designated HARD ESCALATION; the fork is the COMMANDER's** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |

| E5g | The decision-moment trace | [`EDS-E5G-DECISION-TRACE.md`](EDS-E5G-DECISION-TRACE.md) | ✅ **RUN 2026-07-26 — MEASURED; the contradiction resolves WITHOUT a defect** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |

| E5h | The clock twin and the downstream fate | [`EDS-E5H-CLOCK-TWIN.md`](EDS-E5H-CLOCK-TWIN.md) | ✅ **RUN 2026-07-27 — MEASURED** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |

**Queue state (2026-07-28 night, #45 running): 📝 C6 DESIGN CONTRACT DRAFTED
by the commander** → [`C6-EMBODIED-CARRYING.md`](C6-EMBODIED-CARRYING.md)
(the map's six questions ruled: **v1 = THE HONEST OFFSET** — the turn as
geometry, `carry 0.85` becomes a magnitude/lag/noise law of the body's own
state + dribbling, NO opponent input, NO touch cost ever in C6 (#12
boundary), ZERO new loose balls by construction; pressured-carry de-glue =
v2 seat behind a pre-registered scramble ceiling; T2's verdict triggers the
#29.3 C5-re-census decision back to the commander). **T0 RAN and PASSES
every gate — ruling #47: reading (c) RICH MOVABLE GEOMETRY** (4,116 turn
episodes; far-side baseline 0.0476% point-mass; ⭐ only the COMBINED shape
moves it — B tuck+lag+speed +1.425 pp [+1.33, +1.53] while tuck-only and
lag-only drive it to ~0; ⭐ ALL candidates RAISE tackle-eligibility, B
+19.1% — **the glue was quietly protective**, honest carrying costs
eligibility and buys technique-priced side-protection; kick displacement
p50 0.35 m corrects the contract's "centimetres" premise, #47.4).
**T1 CHAIN COMPLETE
(#48 → build `0531b4e` → run FAIL on 69 unexplained → #49 diagnosis
(advantage-foul injury, code-verified) → T1R `72aaa6b` → GATES PASS →
ruling #50: ⭐ READING (A), BOTH AXES CERTIFIED** — eligibility +11.63%
CI [+8.51, +14.85] (band low half, live damping), far-side +1.3215 pp
CI [+1.254, +1.3925] (degenerate 0.048% baseline broken), receipts
closing 69+24=93 exactly, dormant, zero-loose structural, fingerprint
unchanged. **The honest offset does what T0 sized. T2 queues for
daylight** (watchability battery; #29.3's C5 re-census stays parked
behind its verdict). Also drafted tonight:
[`STAGE3-V2-DIRECTION-MEMO.md`](STAGE3-V2-DIRECTION-MEMO.md) — the
anticipatory census (COMMANDER DRAFT, #45.2(c), awaiting the user's
morning ratification; nothing authorized). **Both morning forks RULED
2026-07-29: ① Stage III v2 = 先攒底子 (user verdict, ruling #53 — parked
with the memo banked as the revival direction; unpark = C6 T2 verdict +
#29.3 C5 re-census decision + C7 map) · ② C6 T2 = 跑 (ruling #51 → #52
review PASS → probe build in flight; the resident session runs it).**
THE ROAD: C6 T2 → C5 re-census decision → C7 Phase-0 map → Stage III v2
revisit.

**Update (2026-07-29, #54): ⭐⭐ C6 v1 CERTIFIED END TO END** — T2 all
quiet (every limb ~100× inside its edge; §2 band holds; PC-LOOSE did not
transfer, −0.76% unresolved — no loose-ball tax at match level; PC-KICK
inside ±5%). The honest offset is deployment-safe, dormant behind
`c6Carry`, nothing shipped. **#29.3 decided: ONE C5 re-census after C7's
first slice** (C6 moved the hold's cost side — stationary tuck 0.55 m;
C7 wind-up is the payoff-side lever; #26.5 staleness makes per-lever
re-censuses waste). **C7 PHASE-0 CODE MAP DONE** →
[`C7-PHASE0-CODE-MAP.md`](C7-PHASE0-CODE-MAP.md) (⭐ release is
synchronous — the committed-but-unstruck tick DOES NOT EXIST; the
reception side's `pendingControl` already runs the missing shape;
`kickMisalignment` = the one double-charge hazard). **C7 DESIGN CONTRACT
DRAFTED by the commander** → [`C7-RELEASE-WINDUP.md`](C7-RELEASE-WINDUP.md)
(v1 = SHOT `pendingKick`: time-only, existing prices evaluated at strike
time, interruption free via the existing ball-keyed tackle, no opponent
input, shots-only bounds watchability; pass wind-up deferred with §2
obligations). **⭐⭐ C7 v1 CERTIFIED END TO END (2026-07-29, rulings #55–#60)**:
T0 census (reading (d): interruption seat real 10–14%, head-room
tail-concentrated) → T1 `pendingKick` (all 16 gates; quality axis =
design case, noise −3.68 pp carried by the twisted tail −13.61 pp;
interruption 3.52% = real but thin, static defenders) → T2 match A/B
(all quiet; goals +8.79% paired, absolute mid-band — the pre-named risk
did not bite; conversion effect, not chance-manufacturing). Dormant
behind `c7Windup`, nothing shipped. Chain docs:
[`C7-T0-SHOT-RELEASE.md`](C7-T0-SHOT-RELEASE.md) ·
[`C7-T1-PENDINGKICK.md`](C7-T1-PENDINGKICK.md) ·
[`C7-T2-MATCH-AB.md`](C7-T2-MATCH-AB.md). **⭐⭐⭐ THE SUBSTRATE ROAD
IS COMPLETE (2026-07-29, rulings #60–#63)**: the single C5 re-census
over the C6+C7-enriched world ran (labelled FAIL on the power floor →
#62's mechanical extension, optional-stopping door closed) and
**CERTIFIED at 3.17σ: the unpark FIRES** — in exactly one context
(unpressured · fresh percept · low support, k=30) half a second of
holding is statistically indistinguishable from free (−0.67 pp
[−4.66, +3.15]); the mid-support twin died as small-n noise; every
longer/pressured/stale cell still charges. Patience has a PERMITTED
corner, no subsidy; the enriched world plays FASTER (30.7 vs 28.8
releases/min). → [`C5-RECENSUS.md`](C5-RECENSUS.md). **NEXT: (a)
executor drafts C5-T2 (the WHETHER seat) per #63.3; (b) the #53 Stage
III v2 unpark condition is MET — the revisit is the USER'S fork,
presented next round.** **C5-T2 CHAIN COMPLETE
(freeze `24ecd16` → #64 review PASS → build+smoke `f448eee` → ⭐ ruling
#65: the #44.5 sign-off REFUSED, the fork stage NEVER RUNS)** →
[`C5-T2-WHETHER-SEAT.md`](C5-T2-WHETHER-SEAT.md): the sizing smoke
measured a RATE shortfall no match count cures — live chooser-hold rate
**0.141%** vs the frozen 0.29% floor, E-ABSTAIN-UNSEEN 70.7%, context
agreement 50.2% — so **the seat RE-PARKS on a PERCEPTION wall** with its
machinery banked dormant (868/868 green; unpark = any perception-trunk
change that raises the perceived-cell share, cheap smoke first). ⭐⭐⭐
Banked (#65.2): **the certified patience corner exists in true context
(0.586%) but the carrier cannot SEE it — perception, not price, is the
binding constraint.** Third independent arrow at the perception trunk
this week (#56.2 defenders don't anticipate shots · #44 the eye can't
see neighbours' motion · #65.2 the carrier can't see his own calm).
**STAGE III v2 LAUNCHED
(user "1", ruling #66) and the chain is running**: contract drafted
([`STAGE3-V2-ANTICIPATORY-EYE.md`](STAGE3-V2-ANTICIPATORY-EYE.md)) →
V2-P0 wedge map RAN, reading W1, both teeth clear (**the off-ball body
SEES: A 93.08%, W_r 0.851** — the complement of #65.2's blind carrier;
#67/#68) → ⭐⭐⭐ **V2-P1 THE ANTICIPATORY CENSUS RAN AND PASSES (ruling
#70): THE COMPOSITION PRICE EXISTS AND IT IS GEOMETRIC** — 36 resolved-
negative cells concentrate in the behind/lateral ring (following a
teammate into cover duplicates it; median −9.7 pp, floor −20.4 pp) vs
36 resolved-positive dead ahead (a teammate's forward run marks real
opportunity; up to +38.2 pp); the pooled ≈0 is the two structures
cancelling; 不要重复补位,要支援进攻 — in the table, not in a rule
([`STAGE3-V2-P1-ANTICIPATORY-CENSUS.md`](STAGE3-V2-P1-ANTICIPATORY-CENSUS.md)
§9; 932,786 forks, the heaviest run of the programme). **V2-P2 RAN (chain: freeze
`5cb8339` → #71 review → control-recovery GUARD PASS → prediction
recomputed + #65 checkpoint PASS → build `f92636a` → run `9c28826`) —
⛔ READINGS (b)+(h) TOGETHER (ruling #72): DELIVERED AND FLAT, AND THE
EYE CONVERGES EVEN SEEING OTHERS COMING** — DEV 61.56% (v1's killer
genuinely fixed; a clean negative), ATE +0.006 CI containing zero,
ORACLE ≈ 0 (truth doesn't beat percept — the table itself does not
transfer), FORK-SPACING closed −1.05 m, going=1-avoidance INVERTED,
60.4% of deviations into the 180-ring (v1's attractor, harder).
⭐⭐⭐ **The diagnosis, named (#72.2): SIMULTANEITY — the going-bit reads
motion, and simultaneous deciders cannot see each other's incipient
choices; one lagged bit of anticipation cannot break the behind-ring
attractor. Real football solves this with SHARED PRIORS — the A4
doctrine seat.** Stage III v2 CLOSES at fork grain (two generations,
two different measured convergence mechanisms); the P1 composition-price
census STANDS certified; all machinery banked dormant. **THE FORK IS
THE USER'S (#72.4): (A) the A4 doctrine seat (RECOMMENDED) · (B) the
R3-saturation census · (C) park Stage III, return to the C-track.**
R20 gaps / F9 available. Road B stands; nothing ships. Earlier tonight: the #45.2(0) doc split landed and was
accepted (43 rulings verified in RULINGS, 0 giant lines left, orphaned P1
review re-homed).

**⭐⭐⭐ STAGE III v3 CLOSED END-TO-END (2026-07-31, rulings #77–#88).** The
user took fork (B) from #72.4 (the R3-saturation direction) and v3 ran the
ROLE eye — every body reads HIS OWN role's column: contract + launch (#77) →
V3-P0 role map (R3 clear, roles separate; #78/#79) → V3-P1 the role-conditioned
census CERTIFIED (division of labour lives in the PRICES — the 16 BH-resolved
cells, DF near-ball build-up, WG width already paid; #80–#82) → V3-P2 the role
consumer (#83–#85): the FIRST POSITIVE PAYOFF in three generations (ATE +0.0108,
DEV 42%) + real per-role signatures, BUT reading (c) fired at fork grain
(spacing did not open) — #85.3 named the metric confound (the table PAYS DF
proximity, so fork spacing cannot tell 到岗 from 扎堆) → the user ratified
V3-P3 ("来吧,a", #86): two sub-stages, P3a the cheap deployment gate first →
V3-P3a pre-reg PASS + build/run authorized (#87, the R0 two-pin resolution
ratified) → **V3-P3a RAN and GATES FAIL (ruling #88): THREE HARD LIMBS FIRE**
— rest defence 66.9%→46.7% (−30.2% rel both sides, band −20%), offsides
3.27→4.01 (+22.8%, band +10%), restart ticks +50.8% (band +10%, the v1 pin-3
warning live); the §2 band also breaks (headers −44.9% / long balls −35.0% /
cutbacks −33.0%, goals inside, R0 inside — no substrate-drift excuse).
**The deployment answer is NO; P3b does NOT run** (probe/data/doc:
[`STAGE3-V3-P3A-DEPLOYMENT.md`](STAGE3-V3-P3A-DEPLOYMENT.md) §RESULT · data SHA
`7dee0f62…150b3` · 3,200 matches · fingerprint `57b0bdab…c673` unchanged).
⭐⭐ **#88.2 THE SHAPE VICTORY, banked — the #85.3 confound RESOLVED FOR THE
EYE**: at full deployment the three-generation pile-up disease is CURED —
DEGEN-PILEUP quiet, scramble/box quiet, spacing median opens, duplicate runs
FALL −3.6 pp, live role-separation TV 0.654 > incumbent 0.407, WG silent as
priced, eye ball-ledger exactly 0, goals differential null. Division of labour
DISPERSES, it does not clump; 扎堆 is dead. ⭐⭐ **#88.3 THE ESTIMAND BATON,
banked**: what killed the deployment is a NEW, different disease — the certified
table prices ONE thing (the 6/10 s two-face axis) and the eye faithfully harvests
it, but the incumbent's hand-tuned defaults were silently doing UNPRICED
LONG-HORIZON JOBS (holding the rest slot, staying onside, resettling for
restarts); value visible at 6 s crowds out value at 30+ s. The eye is not wrong,
the PRICE LIST is incomplete — pricing discipline is design work, a future
contract, NOT a patch. **Nothing shipped anywhere (Road B held across 46 rulings;
the production fingerprint never moved).** All machinery, tables, findings banked.
**#88.4 RULED (2026-07-31, "按推荐go", ruling #90): fork (i) taken — the
ESTIMAND direction launches as STAGE III v4.** The commander-owned design
contract is drafted: [`STAGE3-V4-LONG-HORIZON-PRICE.md`](STAGE3-V4-LONG-HORIZON-PRICE.md)
(v4 amends WHAT the map prices; three frozen mechanism classes H/S/J with
P0 routing by measurement; the no-free-weights law I3 — every long-horizon
term enters in goal-value units through a measured calibration or not at
all; V4-P4 re-runs the P3a battery with the three fired limbs as named
gates at their exact bands, shape adjudicators re-run as gates).
**Amended by #91 (the user-ordered VISION audit)**: the occupancy census
prices HELD LATTICE CANDIDATES, never the incumbent designation (the #90
draft smuggled the menu's answer into the price list — fixed); I3 bans
hand constants, not gene weights; adjudication class E-RELOCATED-CURE
frozen ex ante for the incumbent-anchored I5(b) gate.
**V4-P0 PRE-REGISTERED (executor commit `1ce1209`) → commander review
PASS WITH AMENDMENTS (ruling #93)**: routing battery frozen (uniform
3-test form H/S/J, ordered dominance J→H→S, UNROUTABLE→stop), amendments
A1–A4 applied at review before any datum was seen (face-matched H
boundary 6 s/10 s; the delivery SUPPRESSION limb routes on the incumbent
side; designation-use boundary; the rest ratified) — see the prereg's §7
([`STAGE3-V4-P0-AUTOPSY-MAP.md`](STAGE3-V4-P0-AUTOPSY-MAP.md)).
**Probe BUILT (`5cdc4f8`; verify 8/8, X-CORPUS-IDENT byte-identical on
the 8-seed smoke slice) → commander review #94: PASS with ONE fix —
R1: the CLASS S contrast must be stratified within (context×role),
raw pooling risks Simpson confounding; 10 other disclosed deviations
ratified.** **→ NEXT: executor applies R1 (workflow Draft→Verify,
§0.0); then the FULL RUN launches detached under the commander's
resident session (#49.5)** — output
`docs/world-model/data/stage3-v4-p0-autopsy-map.json`, routing
verdicts to the commander, UNROUTABLE stops the stage. The operations
protocol itself is codified at §0.0 (ruling #92). Forks (ii)/(iii)
stay banked. R20 gaps / F9 any time. Road B stands; nothing ships.

Earlier (2026-07-28, #44 ruled): ⛔ Stage III P2's double FAIL ACCEPTED
as written — Stage III v1 is CLOSED, rejected on deployment grounds (#44.3);
NO payoff re-run; the pre-named pile-up lever (anticipatory density, §4.5.6)
is LIVE and constrains the successor (#44.4); Stage III v2 direction memo =
commander's, parked for the user's morning ratification (#45.2(c)).
→ [`STAGE3-P2-DORMANT-EYE.md`](STAGE3-P2-DORMANT-EYE.md) §6.5 (P2-A SHA
`d4de82bc…4945`, P2-B SHA `795ab346…6b77`, both twice byte-identical, HEAD
`ae6e49c`, fingerprint unchanged, nothing shipped).

**Doc split (#45.2(0), 2026-07-28):** this `PROGRAMME.md` is the operational entry; all commander rulings now live verbatim in [`PROGRAMME-RULINGS.md`](PROGRAMME-RULINGS.md), and the moved track-table histories in [`PROGRAMME-LOG.md`](PROGRAMME-LOG.md).

* ⛔ **P2-A = reading (d), UNDELIVERED**: DEV **18.47%** against the frozen 22%
  floor. Every other gate passes — clone 12,000/12,000 · X5 480/0 · **X6
  unexplained 0 across 7.08 M ticks** · determinism · **PC resolves
  (−0.0136 [−0.0211, −0.0060])**, so the budget could see this family. By §7 the
  payoff numbers are published labelled and NOT interpreted (NEUTRAL ATE
  +0.00095 [−0.0041, +0.0059]; realised half-width **0.005**, inside the
  pre-registered 0.009 MDE).
* ⭐⭐⭐ **The decision classes say the CHOOSER is fine and the GATE's
  denominator is not**: deviation among decisions that had a priceable context
  is **42.5%** against the table's ex-ante **44.4%**, and the oracle-context arm
  lands at **44.7%** — on the prediction to within a fifth of a point. DEV's
  denominator counts the 56.6% of windows with no cell at all (the ball in
  flight has no owner, so no context exists). Disclosed as item 6 BEFORE the run
  and the floor left exactly as frozen, so the FAIL stands as written.
* ⚠️ **One real delivery defect, owned**: 20.5% of decisions had **no percept
  memory yet** — it is created at a body's own AI tick and the fork's first eye
  decision often precedes it, so the very window the census priced is the one
  most likely to abstain.
* ⛔ **P2-B = reading (h), the queue stops whatever P2-A says**: **C-OFFSIDE
  FIRES** (2.79 → 3.31 per match, **+18.7%** [+0.35, +0.69] vs a +10% band) ·
  **DEGEN-PILEUP FIRES** (spacing under 4 m **9.5% → 17.4%, +84%**) ·
  **DEGEN-RESTDEF FIRES** (designated slot **66.9% → 52.2%**). Quiet: the box
  canary — and it moves the OTHER way (**+19.5%** attackers in the box at cross
  arrival, so revert 1's failure mode is absent) — and the scramble limb (+7.9%
  vs a +25% band). R0 reproduces the shipped world 800/800.
* ⭐⭐ **The strongest thing the run produced is a substrate law**: positional
  value measured ONE BODY AT A TIME does not compose. Each body prices his
  approach against a table censused while the other eleven held the incumbent
  shape; deployed together they converge — spacing −2.33 m, duplicate runs
  55.5% → 70.4%, rest defence 1.32 → 0.98 bodies, restart ticks **+20.8%**
  (pin 3's warning, live). VISION's one-metre shape delta is **tripled**
  (0.85 → 2.56 m) — the faces do price differently — but bought with all of the
  above. The only payoff interval excluding zero has the wrong sign: at the
  one-team rung **goals −0.339 [−0.484, −0.190]**.
* **Banked**: the chooser works and the percept is honest (context agreement
  **95.6%**, face 99.8%); the 180° ring is **25.9%** of everything the eye
  chooses — a quarter of its behaviour is a seat the incumbent cannot express;
  clamp composition's biggest cell is `r7a0|onside`, not r21a0, and on these
  numbers #43.3's removed floor would have passed anyway (recorded so the
  amendment is not credited with a rescue it did not perform).

Earlier (2026-07-27, #42.3 executed): 📝 **Stage III P2 was DRAFTED AND
FROZEN** — the dormant eye that consumes the P1R table under #41.2's meaning and
no other** → [`STAGE3-P2-DORMANT-EYE.md`](STAGE3-P2-DORMANT-EYE.md) (contract
only; zero `src/**`, nothing implemented, nothing run). ✅ **REVIEWED AND
AUTHORIZED by ruling #43 (2026-07-28)** — §4.5 compliance PASS, the ex-ante
prediction reproduced to the digit by independent recomputation, and **ONE
pre-run amendment required before implementation (#43.3): X6 splits — the
per-record fidelity predicate stays HARD, the 0.84 ok-share floor and clamp
shares become REPORTED per-candidate × per-context** (the floor was derived on
P1R's uniform forced mix; the eye's argmax mix concentrates 54.9% on r21a0,
and pin 1 already declares clamp rewrites counted-not-failures). The executor
applies the amendment, then implements and runs P2-A and P2-B. Nothing else
moves.

* **The central hypothesis is #42.3's, pre-named and unmoved**: a
  context-reading, percept-honest chooser over the SAME lattice recovers the
  40-cell conditional payoff every fixed policy loses.
* **Two halves, two instruments.** **P2-A** tests the payoff at the census's own
  unit — paired same-seed forks, five arms (control · neutral · gene-mapped ·
  oracle-context · **inverted argmin as the positive control**) — and **P2-B**
  tests deployment safety at match level across the adoption ladder (one body →
  one team → both teams) on P0's seven instruments with both reverts' canaries
  HARD.
* ⭐ **The methodological spine is OUT-OF-SAMPLE.** The 40 cells were selected
  on P1R's own sample, so P2-A runs on a disjoint seed block (2,000,000+) and
  the contract predicts shrinkage in advance rather than explaining it
  afterwards. Ex ante from the committed table: **44.4% of moments deviate**,
  in-sample ATE **+0.0207**; at 12,000 moments the paired MDE is **≤0.009**, so
  the run resolves H-COND if ≥44% of the in-sample advantage survives. FLAT is
  registered as a **negative verdict**, not a request for budget.
* **P1's ghost is a gate this time**: `DEV` — the eye must actually deviate on
  ≥22% of decisions or **no payoff reading is available**, with the decision
  classes (abstain-unseen / no-cell / tie / non-station) decomposing exactly why.
* **§4.5's eleven items carried verbatim**, plus the three #42.2 handover facts
  as design INPUTS (direction dominates 3× → the deviation mix by angle/radius
  is instrumented; the 180° ring's share is a reported emergence claim).
* **Registered exposure, in advance**: the committed table carries no per-cell
  CI, so the chooser cannot condition on cell precision beyond the 150 floor —
  that is the winner's-curse exposure, and the disjoint block is the test of it.

Earlier (2026-07-27, #41 executed): ✅ **Stage III P1R RAN and PASSES every
gate — the approach table is a SHIPPING TABLE** →
[`STAGE3-P1R-APPROACH-CENSUS.md`](STAGE3-P1R-APPROACH-CENSUS.md) §5 (SHA
`2c93d5b2…a964`, table SHA `59a3f72e…6e12d`, 6,000 moments / 114,000 forks,
twice byte-identical; fingerprint unchanged; nothing shipped). Nothing in
flight — returned for P2's scoping.

* ✅ **Every gate**: clone coverage 6,000/6,000 · X5 240 checked / **0
  mismatched** · X6 **unexplained 0** with ok **91.7%** against the derived 84%
  floor · **PC resolved in BOTH faces** (−0.0396 [−0.0546, −0.0259]) · SAT
  inside ±0.05 ⇒ SHIPPING TABLE · determinism. The population filter behaved as
  sized: **14.03%** ball-directed moments excluded.
* **Pooled = reading (c), and unlike P1 that reading is AVAILABLE**: all 18
  candidates resolve negative (−0.024 … −0.076). **The incumbent's station
  function beats every fixed ball-relative approach direction on the lattice**
  — a strong result for something billed as a hand-tuned interim, and the first
  time it has been tested on a measurement that could have gone either way.
* ⭐⭐⭐ **DIRECTION DOMINATES DISTANCE, ~3×.** Angle spread **2.9pp**
  (0° −0.0311 and 180° −0.0346 cheapest; 60° −0.0599 dearest) against a radius
  spread of **0.9pp** (7 m −0.0447 · 14 m −0.0441 · 21 m −0.0536). **Which way
  a body commits its window matters about three times as much as how far.**
  Undesigned — the lattice was built to cover named seats, not to test an axis.
* ⭐⭐ **Conditionally it is reading (a): 40 of 216 cells BEAT their control**,
  none under-powered, and the structure is legible — **deep in our own third a
  long FORWARD approach pays** (`ours|ownThird|crowded` r21a0 **+0.0819**);
  **defending a crowded midfield a BACKWARD one pays** (`theirs|middle|crowded`
  r21a180 **+0.0545**). The pooled negative averages over contexts where the
  incumbent already does the right thing, so **it does not bound what a
  conditional chooser can do** — reading it as a ceiling would be the
  ecological fallacy in a table.
* ⭐ **The 180° ring pays where the incumbent cannot go.** `supportSpot` puts
  every supporter AHEAD of the ball at both `aheadBias` settings (P0 §1.4), so
  approach-from-behind is **inexpressible** in the incumbent — and it is one of
  the two cheapest directions pooled and positive in two contexts. Measured
  support for §3.3's drop-to-receive claim.
* ⚠️ **Honest notes on passes**: PC resolved but is only **5th of 18** — its
  premise ("21 m behind the ball is obviously bad") is **wrong**, since
  backward beats diagonal, so the instrument is weaker than its pass suggests.
  SAT's four gaps are all **positive** (0.017–0.047): under saturation the cost
  SHRINKS, so the unilateral table is conservative — but `r7a180` sits close to
  the band edge and the next census should not assume the margin. X6's derived
  floor was the right repair: ok landed at 91.7% against the 91.9% the clamp
  measurement predicted, and **P1's 99% floor would have failed this run too**.
* **Mediators describe rather than gate**, as #41.3 ruled: occupancy 0.9–19%,
  ETA 2.1–2.9 s of a 3 s window, target error 10–28 m. **A cell can carry
  positive value at ~2% occupancy** — value bought purely by moving, which is
  exactly the object the re-founded estimand said the world contains.
* **For P2, three things it should not have to rediscover**: direction
  dominates distance ~3×; the payoff is conditional and the pooled sign is not
  the eye's ceiling; the behind-the-ball ring is cheap, positive in two
  contexts, and inexpressible in the incumbent.

Earlier (2026-07-27, #40 executed): ⏸ P1R was NOT FROZEN — the pre-freeze
sizing says the scoped repair still does not deliver the treatment** →
[`STAGE3-P1R-PREFREEZE-SIZING.md`](STAGE3-P1R-PREFREEZE-SIZING.md) (read-only,
zero `src/**`, 400 moments, block 970,000). **The fork is back with the
commander**; nothing in flight.

* **#40.4's ex-ante requirement, measured.** Body→target distance
  **p50 19.68 m / p90 35.21 m**, i.e. **p50 2.66 s / p90 4.77 s** of travel.
  P1's W = 2.0 s covered roughly the bottom third — the diagnosis was right and
  this is its size.
* ⛔ **But no (W, margin) in the grid delivers a treatment.** Best cell
  W = 3 s, margin 0.4: occupancy **16.3% mean / 5.6% median**, and it cuts the
  lattice to **2.7 of 18** candidates — no longer a census of a lattice.
  W = 4 s at full margin gives 9.8% mean. Tightening trades coverage for
  occupancy at a rate that never crosses.
* ⭐⭐⭐ **Why, and it is a SUBSTRATE fact**: the target **moves with the ball**
  while the body runs to it. A station is ball-relative by definition, so a
  body crossing 20 m at ~7 m·s⁻¹ chases a point often travelling faster than he
  is. **This closes on P0's I2 from the other side** — the incumbent's own
  station target drifts 2.571 m/s median and exceeds 4 m/s on 27.35% of ticks.
  **Stations in this engine are not occupied; they are perpetually approached**,
  `emergentStation` included. ⚠️ This does NOT refute Stage III's premise — it
  says the CENSUS CELL as defined describes something the world does not
  contain.
* **I did not freeze P1R.** #29.5 makes deliverability a freeze-time
  obligation; freezing a census I already know is undelivered would be the
  "disclosed it and ran anyway" failure the ruling was codified from (C5 T1's
  H1). The round stops at the measurement.
* **Settled cheaply and banked**: the station-family filter is unambiguous —
  **16.8%** of sampled moments are ball-directed jobs (matching P0's 19.4% of
  body-ticks), #40.4 item 2 done; and the clamp share under that population is
  **8.08%** of live ticks, so **X6's floor must be derived against ~8%** — P1's
  99% floor would fail again on a perfectly faithful seam.
* **The fork (commander's, not mine)**: the census needs an estimand the world
  can deliver. Four shapes exist in already-banked material — price the
  **direction** rather than the point (occupancy becomes the mediator it
  already is) · **lead** the target as `runBurstPoint` and the C4 meet point
  already do · **body-anchored** candidates (reachable by construction, but no
  longer a policy the eye can express) · or **accept approach as the
  treatment** and read the table as the value of moving toward a region, which
  is what P1 actually measured. Each is a different claim about what a station
  IS — a design question, not an executor's call.

Earlier (2026-07-27, #39 executed): ⛔ Stage III P1 RAN and FAILS on X6
— and ⭐⭐⭐ the MEDIATORS say the treatment was never delivered** →
[`STAGE3-P1-STATION-CENSUS.md`](STAGE3-P1-STATION-CENSUS.md) §7 (SHA
`92edc587…ff80`, table SHA `d9923b17…cd8f`, 6,000 moments / 114,000 forks,
twice byte-identical; fingerprint `57b0bdab…c673` unchanged; nothing shipped).
Nothing in flight.

* ⭐⭐⭐ **The bodies never arrived.** Occupancy **0.8–5.3%** of W within 2 m of
  the target; ETA **1.75–1.97 s** against a 2.0 s window. §4.4's mediators
  exist so *bad location* can never be confused with *failed to arrive*, and
  they just earned their place: **this census measured two seconds of walking,
  not two seconds of standing.**
* **The cause is a derivation error in §2.4, mine.** W was derived as "travel
  time to the ring" (`14 m ÷ 7 m·s⁻¹ ≈ 2 s`), which treats the ring radius as
  the distance the BODY must cover. The lattice is **ball-relative** — a body
  25 m from the ball asked to stand 14 m beyond it must cover ~35 m. The right
  quantity is `dist(body, ball+offset) ÷ speed`, which is a distribution W
  would have to dominate, not a constant.
* **All 18 candidates resolve, all NEGATIVE** (best `r7a180` −0.0220
  [−0.0359, −0.0081]; worst `r21a120` −0.0524). ⚠️ The naive reading — *the
  incumbent beats every station* — **is not available**, because no station was
  occupied. The honest estimand is: overriding an off-ball body's job with a
  ball-relative target he cannot reach in 2 s costs 2–5 pp of signed value, and
  costs more the farther the target. The monotone structure fits that and
  nothing subtler.
* ⚠️ **Second scope limit, also un-caught at freeze**: §3.4 required only an
  *off-ball outfielder*, not a body on a STATION family. P0 measured
  ball-directed actions at 19.4% of body-ticks, so ~1 moment in 5 forced a
  chaser/receiver/marker to abandon the ball. **C4 O2's lesson in full
  generality**, not carried across.
* ✅ **PC RESOLVED in both faces** (−0.0324 [−0.0463, −0.0184]) — §4.5.5's
  power obligation is discharged: the census could see an effect of this size.
  The failure is not power and not the harness. **X5's 240 checks reproduce
  the base bit-identically and X6's unexplained residual is exactly 0** across
  12.27 M classified live ticks.
* ⛔ **X6 fails on its 99% floor (92.68%), and it is the same defect family
  again.** The onside clamp fired 453,032 times and the barred-box clamp
  444,407 — 7.3% of live ticks. **P0 §1.3 warned in writing** that the onside
  clamp *"rewrites a station beyond the line rather than penalising it"*; I
  documented the pin and then set a floor assuming it almost never fires, on a
  lattice deliberately containing stations 21 m ahead of the ball. The floor
  **conflated "the seam is faithful" (passed decisively) with "the clamps
  rarely bite" (a property of the lattice)**. Consequence on the record:
  beyond-the-line candidates are censused **as-clamped**.
* **Reported**: 18 of 216 cells UNDER-POWERED (the two rarest contexts); 4,135
  forks excluded for ending inside the horizon, counted not zeroed;
  `reconstructionDiverged` 126,716 (1.0%). **SAT agrees within 0.002–0.024** —
  but that is agreement between two versions of a treatment **not delivered in
  either arm**, so it certifies nothing about a table that prices standing.
* **The table is committed as data with its SHA and must NOT be consumed by
  P2** as a station-value table: it prices displacement-in-transit, not
  occupancy. §8 forbids re-cutting W, the lattice, the contexts or the moment
  definition here; the two defects are named and the fix is the commander's to
  scope.

Earlier (2026-07-27, #39 executed): Stage III P1 was PRE-REGISTERED
and NOT RUN** → [`STAGE3-P1-STATION-CENSUS.md`](STAGE3-P1-STATION-CENSUS.md).
Drafted under the amended §4.5 constraint set; nothing in flight; the census
runs on the commander's word.

* **Seam = a POLICY, not a point** (§4.5.1): `forcedStationPolicy` carries a
  BALL-LOCAL `(dx, dy)` recomputed every tick, consumed at the executor's READ
  (#35.3) before the clamps — a station is a *relation to the ball*, and P0
  §1.1 is why a fixed point would price something the eye cannot express.
  Explicitly a DIFFERENT seam from C4 O2's `forcedStation`.
* ⚠️ **§5-P1's original harness gate is unimplementable and is replaced**:
  *"forcing the incumbent's own target reproduces the match"* needs a stored
  incumbent target, and P0 proved there is none. The identity arm is
  **NO-OVERRIDE** (seam armed and null ⇒ shipped world) and the real gate is
  **X5, the CONTROL fork reproducing the base bit-identically** per record.
* **Lattice**: 18 candidates + control, ball-local polar, `r ∈ {7, 14, 21}`
  bracketing P0's measured geometry (`supportSpot`'s 10–18 m band and the
  12.95 m median spacing) × 6 angles — the coarsest grid that can express
  回撤接应 / 内切 / 包抄 / 超载 / 强弱侧, and **180° is reachable at all**,
  which `supportSpot` cannot be (both `aheadBias` settings are positive).
* **W = 2.0 s, DERIVED as a new quantity** from P0's anchors (action clock
  0.15 · licence clock 0.40 · dwell mean 1.47 · 14 m ÷ 7 m·s⁻¹ ≈ 2.0): W must
  exceed the travel time to the ring being priced, or the census prices a
  station nobody reached. The far ring is knowingly under-covered and the
  **arrival mediators are the instrument that says so**, not a footnote.
* **Face-specific horizons** (§4.5.4): H_score 6.0 s, H_concede 10.0 s, one
  fork read at two points, the score face read once and never again (the C5 T1
  lesson). Outcome = **ANY shot each way, signed** — shots not goals, derived:
  at this per-cell budget a goal-based concede face would be almost all zeros
  and the signed axis would be attack-only, the exact tilt §4.5.4 forbids.
* **#24 attainability done ex ante and stated**: 216 cells × a 150 floor
  (SE ≤ 3pp) = 32,400 forks; 6,000 moments × 19 = 114,000 forks ≈ **68 M ticks,
  the largest single measurement in the programme**. Per-cell n is published
  for all 216 and an under-filled cell is labelled **UNDER-POWERED**, never
  pooled away.
* ⭐ **The POSITIVE CONTROL is a power GATE, not a hope** (§4.5.5): the
  `(21 m, 180°)` candidate must price below the control in every face, CI
  upper bound < 0. **If it does not resolve, the budget was wrong and no
  shipping table is published.** C4 O2 is cited as banked supporting evidence
  that this executor path resolves displacement effects — not as a substitute.
* **SAT, the saturation-gap arm** (§4.5.2): the same relative policy applied
  to ALL own outfielders on a pre-registered subset. **The table is labelled
  DESIGN-CALIBRATION ONLY unless SAT lands within ±0.05** — #26.5's population
  law made concrete rather than assumed.
* **Mediators mandatory** (ETA / target-error / occupancy-time): *bad location
  ≠ failed to arrive*, and without them the table cannot tell P2 which it
  measured. **Side-split always** (P0's I4 found the scramble symmetric).
  **The gene mapping is frozen HERE** so P2's ablation cannot be a post-hoc
  fit, and it holds a neutral genome at exactly the unweighted signed axis.
* **#38.1's boilerplate is in**: eight standing exception classes including
  **E-PAUSED**, and §6 lays out the full sign space — gradient / **flat** /
  noise / gradient-but-SAT-fails. Flat is written as a real result: it would
  say the positioning seat is not where the value is, and send the budget to
  perception instead.

Earlier (2026-07-27, #36.3 executed): BOTH C4 oracles RAN.
⭐⭐⭐ O1 = LEVER · ⛔ O2 = GATES FAIL on X6, with a large RESOLVED HARM** →
[`C4-O1-FLIGHT-FORK.md`](C4-O1-FLIGHT-FORK.md) §7 (SHA `dc29a408…fce3`,
5,404 crosses / 10,808 forks) and
[`C4-O2-SECOND-BODY-FORK.md`](C4-O2-SECOND-BODY-FORK.md) §7 (SHA
`f5a69e49…b2ff`, 5,418 crosses / 10,836 forks). Both twice byte-identical,
both **clone coverage 100%** and **harness identity 0 mismatched**, fingerprint
`57b0bdab…c673` unchanged, nothing shipped, both seams null in production.
**Stage III P1 still HOLDS** pending the contract revision. Nothing in flight.

* ⭐⭐⭐ **O1 = LEVER, and the bands separate 43×.** Contests **+12.36pp**
  CI [10.79, 14.04] on deliveries the unforced law leaves SHORT of the header
  band, against **+0.25pp** CI [0.08, 0.46] on the LONG ones it already lifts
  (SHORT/FULL +7.29, LONG/FULL +0.17; pooled +4.18pp). **The 14.454 m boundary
  was derived from `peak = g·T²/8` before any data existed and the world
  agreed with it** — nothing fitted. ⇒ **T1-FLIGHT's blanket floor was doing
  almost all of its work on a third of crosses** (SHORT = 33.4%); the other
  two thirds paid the mandate and got nothing measurable.
* ⭐⭐ **The withdrawn goal claim RETURNS under a compliant estimand.** ANY
  goal in a fixed 4.0 s horizon, censoring impossible inside a fork:
  **−1.65pp CI [−2.16, −1.13]**, resolved. Scope stated precisely — this
  re-establishes that *forcing one delivery to loft* lowers the 4-second goal
  chance; **T1-FLIGHT's match-wide policy claim stays withdrawn** (#36.1). And
  the trade is concentrated: SHORT/THIN is +12.36pp of contests **and**
  −5.27pp of goals. Where lofting buys the most aerial football it costs the
  most goals — Q5's ceiling doing its job.
* O1's contest gain is **75% defensive** (C3atk +1.05 vs C3def +3.13), against
  T1-FLIGHT's 71% under a mandate: the asymmetry is a property of the
  substrate, reproduced by a cleaner design. **C4's closure is NOT certified
  on O1 — it re-opens as a SELECTION question**, and selecting needs something
  that reads pre-kick context, which is Stage III's shape.
* ⛔ **O2 fails X6 on the class ruling #36.1 had already named.** All **33**
  unexplained records reproduce as `phase: 'halftime'` — the paused world, the
  exact class the ruling created after T2's F2 hit it, and I did not put it in
  O2's four exception classes. Every other class came back **empty** and the
  force bit on **222,171 of 222,204** live ticks (99.985%).
* ⛔⛔ **O2's measurement is a large RESOLVED HARM, and the frozen rule
  understates it.** C3atk **27.51% → 18.90% = −8.61pp** CI [−9.62, −7.64];
  C3def **+8.06pp**; shots −8.22pp. The duel does not vanish, **it changes
  hands** — and the mechanism is measured: the nearest ATTACKER ends up
  **farther** from the ball (median 1.943 → 2.367 m). The rule returns
  UNRESOLVED because I wrote a two-sided question with one-sided branches
  (LEVER = helps, NO LEVER = does nothing, *hurts* falls through). **My
  rule-design gap; reported as the rule says, not re-cut.**
* ⭐⭐⭐ **O2's primary and its H3 subgroup disagree in SIGN — the
  pre-registered contingency, live.** All eligible crosses **−8.61pp**;
  control-arm-H3 crosses **+7.28pp** CI [+5.38, +9.28]. §4.3 demoted H3 from
  primary BEFORE the run on the regression-to-the-mean argument and said in
  advance that a disagreement is itself the finding. **Had #36.3(ii)'s literal
  "at H3 crosses" been the headline, O2 would have reported +7.28pp and
  re-opened C4 on a selection artefact.**
* **What O2 does and does not establish**, stated: it supports #34.3's
  doctrine BY MEASUREMENT — overriding an already-licensed body's routing with
  a scripted meet point costs more than it buys — but it cannot separate *"a
  second body does not help"* from *"overriding a chaser hurts"* (eligibility
  is read once at the kick; `team.chasers` refreshes every 0.4 s), and the
  corner machinery's 2.5 m meet point looks like the wrong place to stand for
  an open-play delivery (`minOutfieldDistInBand` barely moves, 1.478 → 1.474).
  A second body was available on **94.1%** of crosses, so the branch was never
  closed by arithmetic.

Earlier (2026-07-27, #36 executed): BOTH C4 compliant oracles were
PRE-REGISTERED and NOT RUN** → [`C4-O1-FLIGHT-FORK.md`](C4-O1-FLIGHT-FORK.md)
and [`C4-O2-SECOND-BODY-FORK.md`](C4-O2-SECOND-BODY-FORK.md). Gap work, per
#36.3; **Stage III P1 continues to HOLD** pending the commander's contract
revision (#36.4). Nothing is in flight.

* **O1 — the per-cross flight fork** (audit finding 8). Seam
  `forcedCrossProfile`, read at exactly one place (`mechanics.ts:564`'s
  `tMinCross`). At every real cross, two forks from the same pre-step clone —
  `'current'` vs `'lofted'` — so **both arms share the same delivery struck by
  the same body from the same world**, which is the direct answer to the
  post-treatment-selection objection (T1-FLIGHT's arms held 5,547/5,633/5,548
  *different* crosses). ⭐ **The deliverable is HETEROGENEITY, not a headline**:
  a frozen 2×2 of pre-kick context (distance **< / ≥ 14.454 m**, the DERIVED
  boundary at which the unforced law already clears the band, #31.4 × box
  occupancy 0–1 / ≥2), with a three-branch decision rule — **LEVER** (bands
  separate ⇒ the profile is selectable, C4 reopens), **FLAT** (every band
  inside ±2.32pp of pooled ⇒ blanket lofting was the honest summary, closure
  CERTIFIED BY MEASUREMENT), **UNRESOLVED** (anything else, read as neither —
  #20 forbids reading a straddling interval as "no effect").
* **O2 — the second-body station fork** (audit finding 14). Seam
  `forcedStation`, applied **before** the existing onside and barred-box clamps
  so the forced body gets no privilege the world does not have. Forces the
  already-licensed body closest to the landing who is **not** the registered
  receiver and **not** a chaser — i.e. genuinely *additional*, nobody new
  licensed. ⭐ This is the branch **#34.3 closed by DOCTRINE**; O2 does not
  challenge the doctrine, it converts the closure from doctrinal to measured.
  **A LEVER reading does NOT authorize shipping the choreography** — it
  authorizes re-opening, and hands Stage III a sized target instead of a
  hypothesis.
* **Both fix the three verified estimand defects at the source**: the horizon
  is fixed at 4.0 s and counts **ANY** goal (finding 10 — and inside a fork
  overlapping windows *cannot* occur, so this is a property of the design, not
  a patch); seed ranges are **disjoint per combination** so "cluster unit = the
  match seed" is exact (finding 15); and both decision rules are **interval
  tests**, not MDE arguments (finding 7 — the correction that re-read T2's D1
  as inconclusive-on-sign, applied in advance).
* **Both carry the harness gates the fork grammar requires**: clone coverage
  **100%** as a GATE rather than an assumption, and the control fork
  reproducing the base continuation **bit-identically** — a fork that cannot
  reproduce its own control is not a counterfactual. O2 adds a force-bites gate
  whose population is **explicitly conditioned on the body's action path**,
  which is precisely the defect T2's F2 had.
* ⚠️ **O2's H3 subgroup is REPORTED, not primary, and the reason is stated**:
  H3 is a post-delivery outcome, so selecting on the control arm's H3 induces
  regression to the mean in the treated arm. Primary is all crosses with an
  eligible second body; the two are read together and a disagreement is itself
  returned to the commander.
* O1 and O2 are **independent** — neither rescues nor blocks the other, either
  order. Both ship nothing; both seams stay null in every production path.

Earlier (2026-07-27, #34 executed): ✅ Stage III P0 is DONE — the
consumer map and the incumbent instrument baselines are banked** →
[`STAGE3-P0-CONSUMER-MAP.md`](STAGE3-P0-CONSUMER-MAP.md) (read-only, zero
`src/**`; 300 random-genome matches on fresh block 930,000, 389,865 samples at
6 Hz, twice byte-identical, SHA `dc74fb02…813f`). Definitions and the
two-meanings sweep were committed BEFORE anything was measured (`ecad616`).
Nothing is in flight; per #34.4 the next step is P1's pre-registration.

* ⭐⭐⭐ **There is no station DECISION — there is a station FUNCTION at
  60 Hz.** Every producer (`formationSpot`/`emergentStation`/`supportSpot`/
  `runTarget`/the mark stance) is a pure function recomputed inside
  `executeAction` every tick; what runs on a clock is the ACTION (0.15 s) and
  the LICENCES (0.4 s). **So §4-Q5's commitment window W is a NEW quantity,
  not an inherited cadence** — P0 can only supply anchors, and does.
* ⭐⭐⭐ **I2: the incumbent has no commitment and a quarter of its motion is
  untrackable.** Station-target drift median **2.571 m/s**, p90 6.244,
  **27.35% above 4 m/s** — faster than the body chasing it — and a p99 of
  54 m/s, a 9 m jump inside one sample. Cause visible in code, not inferred:
  `hasBall` is an INPUT to `formationSpot`, so a possession flip re-evaluates
  the whole block in one tick. The incumbent's apparent stability is slow
  inputs, not commitment.
* ⭐⭐ **I6: duplicate runs are the NORM, 54.71%** CI [52.96, 56.37] of
  multi-runner ticks have two run targets within 4 m — structural, since
  `runTarget` maps every runner to the same shoulder of the same line and then
  narrows them into the same lane. The survey's duplicate-run warning is not a
  risk the eye might introduce; it is the incumbent's steady state.
* ⭐⭐ **I7: the attack/defence shape delta is ONE METRE.** Centroid depth
  −0.774 in possession vs −1.760 out, delta **+0.987 m** CI [0.507, 1.446];
  spreadX +1.372; spreadY +0.740. VISION's 2026-07-27 anchor makes this
  difference an acceptance criterion — the bar is a stride.
* ⭐ **I4's split paid for itself immediately.** Own bodies within 5 m of the
  ball **0.956** vs opponent **0.952**; within 10 m 2.204 vs 2.197 — **the two
  sides are indistinguishable**. Pooled, this would have read "1.9 bodies
  within 5 m" and been filed as the 乱抢 residual. **E4 r2's scramble is
  SYMMETRIC**, which re-frames P3's H-SCRAMBLE before P1 starts.
* Also banked: I1 dwell median 0.667 s / mean 1.466 s, 43.98 family changes per
  body per minute, station families owning 77.4% of body-ticks (MARK 32.11%,
  FORMATION 29.04%); I3 spacing p10 4.188 m with **9.40% of pairs under 4 m**;
  I5 rest defence 1.328 bodies deep in possession but **the DESIGNATED slot is
  one of them only 65.82%** of the time.
* ⚠️ **Three consumers a naive replacement breaks**, mapped: the onside clamp
  **rewrites** a station beyond the line rather than penalising it (different
  from revert 2's blast, and must not be confused with it); the ZONAL scheme
  uses `formationSpot` as its marking lattice (`TeamBrain.ts:479`); and
  `shapeReady` makes the station a **restart gate**. Plus `supportSpot` calls
  `formationSpot` internally, so support geometry moves whether P1 intends it
  or not. **P1's harness gate must pre-register whether it forks the executor's
  READ or the FUNCTION** — they are not the same intervention.
* The two-meanings sweep split three of six instruments before measurement
  (station-switch → dwell + drift; ball convergence → per side; rest defence →
  any-body + designated-slot). All three splits changed a reading.

Earlier (2026-07-27, #33 executed): ⛔ C4 T2-ARRIVAL Phase A FAILS on
D1 and on F2 — the box stops emptying and it changes nothing** →
[`C4-T2-ARRIVAL.md`](C4-T2-ARRIVAL.md) §7 (Phase A SHA `fc66f1f6…c597`, twice
byte-identical, 5,745 / 5,637 / 5,632 crosses across three paired arms on
block 920,000; flags-off fingerprint `57b0bdab…c673` unchanged; 820/820 plus
7 new identity pins). #32.1's coupon-collector ban was codified first
(`3c61d68`). Nothing is in flight.

* ✅ **A0 PROCEEDED, and cleanly**: R3+R4 = **1.36%** CI [0.76, 2.02] against
  an 80% stop threshold — the nearest licensed body needs a median 3.35 m
  and has 7.95 m of budget over a 1.03 s flight, **4.86 m of slack**. The
  target replicated on a block it was never measured on (H3 23.03% vs the
  banked 22.90%, median miss 2.32 vs 2.39 m, C3atk 25.50% vs 25.17%). The
  arrival gap is a ROUTING failure, not a reachability one.
* ✅ **F1 — the defect is real and the fix closes it.** Licensed bodies still
  on `MakeRun` when the ball enters the header band: **58.66% → 93.53% (A1)
  → 93.17% (A2)**. §2.2's reading of `PlayerBrain.ts:1144` was right, and
  right about the size: **the box empties on 41% of crosses**, and the
  licence takes that to 7%.
* ⛔ **D1 FAILS, and it is a RESOLVED ABSENCE, not noise.** C3atk
  **25.50% → 25.91% = +0.41pp, CI [−0.65, +1.46]** — the interval straddles
  zero, but its UPPER bound sits below the pre-registered 2.32pp MDE and far
  below the expected +5.7pp. The gate had the power it claimed. **Reading
  (b).** Mediators agree three ways: H3 **flat** (+0.14pp CI [−0.95, 1.16]),
  min attacker distance in band **+0.069 m — the wrong way** (CI [−0.004,
  0.133]), bodies-in-box at band entry **+0.027 resolved** (CI [0.002,
  0.054]). **They stayed, and they arrived no nearer the ball.**
* ⭐⭐⭐ **WHY, and this is the finding: the closest licensed body was
  already going.** Across 66,469 live-licence ticks the new branch fired on
  **45.6%** and had **nothing to add on 54.4%** — because the closest
  licensed body was already the registered receiver (**83%** of that bucket,
  carrying the identical `landing − flightDir·2.5` re-route since Phase 63)
  or already a chaser routing through `interceptBall` to the same landing
  (**17%**). §2.1 established *that* the receiver had the re-route; it never
  asked *how often the receiver IS the closest licensed body*.
* ⚠️ **The pre-registered backfire HAPPENED.** Licence survival ALONE (A1):
  C3atk **−0.75pp CI [−1.77, +0.29]** — §4.8 named it in advance (the
  arriver's 16 m arc target points AWAY from the landing, so holding him on
  it through the flight is worse than letting him go home). The re-route rung
  recovers it to about zero: **the two halves roughly cancel.**
* ⛔ **F2 FAILS — my gate, the third time in this family, and two distinct
  freeze-time defects.** (i) The population was mis-specified: F2 predicted a
  fire for the closest licensed body without conditioning on his ACTION, when
  the branch lives inside `case 'MakeRun'` — the 36,121 `noTrace` records are
  the gate asking a question the mechanism was never going to answer yes to.
  (ii) The 72 `unexplained` reproduce in **one cell on one seed**, every one
  at `phase: 'halftime'` with the ball state frozen to the last digit: at
  half-time `Match.step` returns before `simTime += dt`, so nothing executes
  and the probe compares a fresh expectation against a **stale trace** held
  across the pause. 1.57 cm, one match, a paused world — not a fidelity
  failure. E1/E2/E3 and corner-precedence all came back **exactly empty** as
  §4.3b predicted; both classes I actually needed were ones I did not name.
  **#32.1 banned the coupon-collector form and I replaced it with a
  per-record form whose population was wrong** — a different error in the
  same family.
* ✅ I2 bounded (+0.19pp CI [−0.47, 0.83], "did not rise beyond resolution");
  shots flat. ⚠️ The **offside canary passes but resolves POSITIVE**:
  both-team offsides 2.4494 → 2.5150/match, CI [+0.013, +0.117] — a fifth of
  the 0.29 band, and **not** the attacking side (attacking-only +0.023,
  CI [−0.010, +0.057], inconclusive).
* **Nothing shipped**: both flags default OFF, `src` committed and dormant
  (the E1b precedent). §8 forbids re-posing the mechanism in this session;
  the residual's location is reported, not proposed.

**Open, and the commander's:** dispose F2 (two freeze-time defects, one of
them the successor to the form #32.1 banned); rule what *"the box empties on
41% of crosses, we closed it, and nothing moved"* means for C4 v1 — the
defect was real, the fix works, and the deliverable did not follow; and
whether the residual (only one body is ever AIMED at the delivery, and 83% of
the time it is the one the engine already aimed) is a licensing question,
Q2's forbidden pre-kick half, or the end of v1. Phase B stays held per #32.3.
F9 render-only any time; R20 + Stage III P0 in gaps.

Earlier (2026-07-27, #32 executed): C4 T2-ARRIVAL PRE-REGISTERED.
⭐⭐ **The pre-registration turned up two code findings that changed the
mechanism, both surfaced for reversal before the run (#33 accepted both):**

* ⚠️ **One of #32.4's three authorized components ALREADY EXISTS.** The
  post-kick landing re-route has been in open play since Phase 63 —
  `actionExecutor.ts:159–166`, whose own comment calls it *"the 31.9 corner
  principle in open play"*: attack the descent 2.5 m upstream via the shared
  `ballLanding` projector. **It is granted to exactly ONE body — the
  registered pass target** (`pendingPass`, live 3.5 s, longer than any
  cross flight). So T2's mechanism is not *add a re-route* but **widen who
  is eligible for the one that already works**. Still Q2's safe half, still
  post-kick, still observable physics — but the contract's §2 premise was
  wrong and is corrected here rather than worked around.
* ⭐⭐⭐ **The real defect: the box EMPTIES during the flight.**
  `PlayerBrain.ts:1144` gates every licensed attacking run on
  `carrier ? carrier !== p : phase === 'restart' || crashLive`. A cross in
  open play clears `ball.owner`, the phase is `playing`, and `cornerCrash`
  is corner-only — so **every runner and the arriver lose `MakeRun` the
  instant the ball leaves the boot** and fall through to
  `MoveToFormationSpot`. Upstream, `assignRunners` clears `team.arriver`
  every tick and re-sets it only while the ball is in the wide channel,
  which a ball flying into the box has left. **This is Phase 31.9's bug,
  still present in open play** — the engine has already been patched for the
  identical shape twice (`team.cornerCrash`, and the overlap license at
  `TeamBrain.ts:114–117`, both with the reason in-comment). It explains H3
  exactly: for most of the ~1.1 s flight, every attacking body except the
  registered target is running **away from the box**.
* **Intervention, therefore** = the open-play analogue of `cornerCrash`, two
  nested default-OFF flags, crosses only: `c4Arrival` snapshots the
  ALREADY-licensed bodies at the kick and holds them for exactly
  `ballLanding(ball).t` (derived, not chosen; armed only when
  `cornerCrash === null` so corners can never be double-licensed);
  `c4ArrivalReroute` gives the closest of them the meet point that already
  works. **No new license, no new count, no new scorer, nothing pre-kick** —
  so revert 2's offside exposure is structurally bounded (the flag is judged
  at the kick; every body this stage moves starts after it), and the arc
  cutback channel is untouched.
* **Gates**: A0 reachability census FIRST (read-only; may stop the stage,
  may not re-tune it — STOP if `R3+R4 > 80%` of H3, derived from D1's MDE);
  X1–X6 incl. **X6 corners-untouched**; F1 license survival ≥90%; **F2 in
  #32.1's new per-record-with-named-exception-classes form, applied to my
  own gate the same day the ban was codified**; **D1 = C3atk rises** (MDE
  2.32pp vs an expected ≈+5.7pp) with M1–M3 mediators; I2 HARD in #31.2's
  interval form; **the offside canary HARD at +0.29/match = ¼ of revert 2's
  measured blast, its SD MEASURED in a pre-freeze smoke (2.4861/match,
  SD 1.8298, over-dispersion 1.35 — a Poisson assumption would have been
  16% optimistic) rather than assumed**, per #29.5.
* ⚠️ **The one interpretive call**: the defence gets no equivalent re-route.
  Defensible because the defending landing-chase already **excludes box
  landings** by measured design (`TeamBrain.ts:391–418`, 0.77 goals/match)
  and the defence took 71% of T1-FLIGHT's new contests unaided — but unlike
  T1-FLIGHT §2.4 I do **not** run the alternative as an arm, because it is
  outside #32.4's scope. Registered for the commander.
* Phase B is **not this stage's** (#32.3): the live battery runs once on the
  flight+arrival PAIR, its own pre-registration.

Earlier (2026-07-27, #30.3 + #31 executed): ⛔ C4 T1-FLIGHT Phase A
FAILS on F2 — my own instrument gate, on ONE cross of 5,547 — while everything
the stage exists to measure landed** → [`C4-T1-FLIGHT.md`](C4-T1-FLIGHT.md) §7
(SHA `7a1afab2…5075`, twice byte-identical, 5,547 / 5,633 / 5,548 crosses across
three arms on block 900,000; flags-off fingerprint `57b0bdab…c673` unchanged;
820/820 green).

* ⛔ **F2 fired on 1 cross of 5,547; the other 5,546 are exactly 0.** The
  offender's measured peak (2.661 m) sits 1.02 m ABOVE the apex its launch
  implies — diagnosed read-only as a delivery **re-struck by the same player
  inside its own window**, so `lastTouch` never changes and the `maxZ` guard
  never trips. **A max-statistic over thousands of records at a 1e-3 tolerance
  is a coupon-collector gate**: it asks that no single record anywhere be
  pathological, which is not the claim "the arithmetic reached the world". My
  gate-design defect, the SECOND instrument fire in this stage, and **not
  re-scoped after sight**.
* ✅ **The mechanism works.** Launch-apex headable **74.02% → 100.00%**, apex
  1.871 → 1.964 m, and **H0 height-preempted collapses 54.76% → 1.62%** of C2.
  The ball gets up.
* ⭐⭐⭐ **The payoff is real and it goes to the DEFENCE.** Contests
  **57.36% → 60.78% = +3.42pp**, CI [2.14, 4.69], clearing the pre-registered
  2.7pp MDE — but split C3atk +0.98pp vs **C3def +2.44pp**, so **71% of the new
  contests are defensive**. Nobody designed that; it falls out of giving both
  sides the same extra hang time, which §2.3 registered in advance as an honest
  symmetric cost.
* ⭐⭐ **Conversion moved the OTHER way, resolved**: goals **10.76% → 8.72%,
  −2.05pp CI [−2.82, −1.35]**; shots −1.19pp. I2's ceiling is respected with
  enormous room, and per #31.2's clause the point is reported beside the
  verdict — this is a **resolved DECREASE**, not "did not rise beyond
  resolution". Honest flight makes crossing produce **more aerial football and
  fewer goals**.
* ⭐⭐ **T0R §7.4's partition question is ANSWERED, against the flight.**
  H3 as a share of ALL crosses **11.74% → 22.90%** — it nearly DOUBLED — with
  its median nearest man **2.08 → 2.39 m** and within-2 m falling 47.0% → 33.0%.
  **Fixing the height did not shrink the arrival problem; it enlarged it.** The
  half-metre of arrival is now the whole remaining story, and T2-ARRIVAL's
  target is sized here at 22.90% of all crosses.
* ✅ **§2.4's fork cost nothing, measured**: the stale-lead arm is
  indistinguishable on the deliverable (contests 60.71% vs 60.78%, goals 9.19%
  vs 8.72%). #31.1's call was right and free.
* Reported: C0 10.76% → 11.68% (a longer flight is a longer window to be cut
  out — the change does cost something); C1 4.98% → 3.46%; C2 26.90% → 24.07%;
  the pre-existing not-a-launch-at-capture caveat is flag-independent as
  predicted (150/167/173 per arm); F2's clean-flight slice is only 3.5% of
  crosses, itself a scoping fact.

**Phase B did NOT run.** Its condition (X-series + D1) is met in substance, but
§8 stops a failed stage before the expensive half; running an 8-season
calibrate off a FAIL would be the improvisation the discipline forbids.
Nothing shipped — `c4Flight` default OFF, `src` committed and dormant (the E1b
precedent).

**Open, and the commander's:** dispose F2 (re-pose as a share-based or
per-record gate with the re-strike case named, or accept the stage on F1's
launch-side evidence); rule what a **71%-defensive, goal-reducing** contest
gain means for C4 v1 — the deliverable was CONTESTS, never goals, and it was
delivered; and whether T2-ARRIVAL now becomes the seat on its freshly doubled
22.90% target. C5's live half stays parked (#29.3). Nothing is in flight.
F9 render-only any time; R20 + Stage III P0 in gaps.

Earlier (ruling #30 issued): the executor PRE-REGISTERS C4
T1-FLIGHT next** — the ball gets up, aim untouched (design contract §5.5
amendment); the T0b ladder re-runs inside T1-FLIGHT's audit (partition≠causal,
answered by measurement); T2-ARRIVAL on the residual only; **I2 re-named with
cause to the T0R reference (10.48/11.94%, #20 CI semantics)**. The commander
drafts the C6 design contract on the received map in parallel (#29.3: C6 feeds
the C5 re-census). Stage III P0 + R20 in gaps; F9 any time. Earlier:

**(2026-07-27, #28.4 + #29.4 executed): ✅ C4 T0R+T0b PASSES every
gate, and §6's frozen rule returns HEIGHT-DOMINATED** →
[`C4-T0R-T0B.md`](C4-T0R-T0B.md) §7 (SHA `55b2e4a8…7528`, twice byte-identical,
5,571 + 5,517 crosses over 5,390 matches, zero `src/**`, fingerprint unchanged).

* ✅ **T0R's budget model worked, which was its whole point.** Sizing to a
  common cross TARGET instead of a common match count put every combination at
  **911–967** build and **849–996** held-out; the cell that failed T0 at 296
  now returns 930 / 867, the smallest at **2.8×** the floor. The gate text
  never moved — only the matches behind it, which is the only thing #24 says
  was mine to move.
* ⭐ **The census REPLICATES on two never-seen blocks** (880k/890k vs T0's
  909k/870k): C0 10.05 / C1 6.00 / C2 26.21 / C3atk 25.13 / C3def 32.62 against
  T0's 10.90 / 5.70 / 27.95 / 24.71 / 30.74 — while the X4 pin reproduces the
  unmodified `cross-anatomy` exactly. Both instruments intact. S1 max **0.85pp**
  against a 3.5pp tolerance; S2 max 1.07pp against 7.0pp.
* ⭐⭐⭐ **T0b: the ladder explains C2 completely and the RESIDUAL IS ZERO.**
  H0 height-preempted **56.78%** [54.19, 59.36] · H1 keeper **0.00%** ·
  H2 taken-down-at-height **1.37%** · H3 no-contender-at-height **41.85%** ·
  **H4 residual 0 of 1,460** (2 of 1,445 held out). A ladder derived from
  `tryAerial`'s own gate order BEFORE any data accounts for every C2 cross but
  two — the strongest form of *the code says where the gradient lives first*.
  H1 being exactly zero is itself a finding: keeper claims all happen BEFORE
  arrival, so they sit in C0. ⚠️ H2 would have read zero without §3.2's pre-run
  contact-height fix (a class unfireable by construction, which #29.5 now
  forbids).
* ⭐⭐ **Both dominant rungs are MARGINS, not absences.** H0's deliveries peak
  at a median **1.00–1.06 m** — a third of a metre below the 1.35 m band floor,
  consistently, not marginally. In H3 the nearest outfielder's median distance
  while the ball was headable is **1.75–2.20 m**, p10 1.42–1.53 m, with
  **40–66% within 2 m** and 73–91% within 3 m. **Nobody is absent; everybody is
  close and nobody is close enough** — #28.3(ii) sharpened from "the box fills"
  to *the contest fails by about half a metre*.
* ⚠️ **Registered against over-reading it: H0 and H3 are a PARTITION, not a
  causal decomposition.** A low delivery also spends fewer ticks in the band and
  so has fewer chances to have anyone inside the radius; *"fix the height and H3
  shrinks too"* is a hypothesis this census cannot test.
* 🎯 **RE-AIM by §6's frozen rule: HEIGHT-DOMINATED** (H0's CI lower bound
  clears 0.50) ⇒ per #28.4b **the delivery's FLIGHT PROFILE becomes C4 v1's
  named seat, in its own contract, I2 binding hard**; the routing fix goes
  further back. ⚠️ **The verdict is archetype-dependent and the pooled number
  hides it**: H0 is 59–61% of C2 for the CROSS archetype but **46–54% for BAL**,
  whose deliveries do get up (76–84% headable) — close to contest-dominated by
  the same rule. Scoping the flight contract to cross-spam or to the delivery
  generally is a call §6 did not pre-register.
* ⚠️ **I2's ceiling now has two candidate pairs.** #28.5 named T0's build
  10.27% / held-out 10.73%; the fresh blocks give **10.48% / 11.94%**. A stage
  gating on non-increase needs one named number.

✅ **#29.5 CODIFIED** in [`../PROBE-CONTRACTS.md`](../PROBE-CONTRACTS.md) §2:
power is a freeze-time obligation, a pre-run disclosure does not discharge it,
plus the corollary — a floor the population cannot supply is not a gate, it is
a reported quantity.

✅ **C6's Phase-0 code map DONE as gap work** →
[`C6-PHASE0-CODE-MAP.md`](C6-PHASE0-CODE-MAP.md): the de-glue already exists and
is gated to ONE regime by three different conditions, only one of which is about
close control (speed excludes the slow carry — defensible; space `>4.2 m`
excludes the pressured carry — the honest inversion; an action label excludes
the turn — bookkeeping). ⭐ **The turn is literally `Match.ts:1334`'s
assignment** — `ball.pos = owner.pos + heading·0.85` held through a 0.48 s
rate-capped 180° pivot, so 以自己为圆心连球带人一起转 is the implementation, not
an approximation — and it ALREADY costs 0.48 s, so a touch charge on top would
double-charge it. `performDribbleTouch` already prices 一步一带/爆趟 as one
continuous variable (VISION §1 honoured), `dribbleTouch` means the
ball-exists-between-touches substrate already exists for one regime, and
`tryTackles` keying on the BALL means C6 need not build an attack. Six open
questions in §7; #29.3 names C6 as a C5-unpark trigger, so C6 FEEDS the
re-census rather than waiting behind it.

**Open, and all the commander's:** draft the flight-profile contract (it must
resolve the partition-not-decomposition warning, the archetype split, and which
conversion pair I2 pins to); C5's live half stays parked per #29.3 with its
unpark condition pre-registered. **Nothing is in flight.** F9 render-only any
time; R20 + Stage III P0 in gaps.

Earlier (ruling #29 issued): C4 T0R+T0b IS THE ONE EXPERIMENT
IN FLIGHT** (authorized at #28.4, unblocked by T1's landing). **C5 T1's H1 FAIL
stands as fired; the measurement is BANKED as the BEFORE table** (waiting costs
−7.55/−12.77/−16.12pp, twin- and concession-confirmed; tempo baseline median
spell 0.33 s banked for the 1.1–1.2× anchor) — **T2 the WHETHER seat PARKS with
a pre-registered unpark condition** (re-census after any live enrichment, H1
re-powered; T2 drafts iff any hold cell's cost interval reaches zero); neither
adopt-as-priced nor T1R-now (the re-census subsumes T1R, the I2 precedent).
**C6's Phase-0 code map authorized as gap work** (an unpark lever, priced when
the fork arrives); Stage III P0 gap work per its ratified slot; F9 any time;
R20 in gaps. Gate lesson to codify in PROBE-CONTRACTS with the executor's next
commit: disclosed-as-under-powered at freeze time ⇒ re-power ex ante, never run
the known coin-flip. Earlier state below.

**(2026-07-27, ruling #28 issued): C5 T1 RUNS NEXT** (approved as
pre-registered — the decision-moment horizon origin is ratified); **C4 T0R+T0b
queues after T1 lands** (floor per-archetype + the C2 decomposition that
decides the v1 re-aim; T1-the-routing-fix demoted to a 5.70pp repair); Q1
amended (flight ≠ aim), I2's ceiling named (goal-within-window 10.27/10.73%,
ROADMAP's ≈5% retired from gate duty); **Stage III design contract MERGED**
([`STAGE3-POSITIONING-EYE.md`](STAGE3-POSITIONING-EYE.md), slot ratified by the
user: P0 = gap work now, P1–P4 behind C4 T3); F9 any time; R20 + P0 in gaps.
Earlier state below.

**(2026-07-27, #27.5 executed — both authorised items done, and the
queue is back at the commander).**

**(1) ⛔ C5 T1 RUN AND FAILED — but the measurement it exists for came back
resolved** → [`C5-T1-WAITING-CENSUS.md`](C5-T1-WAITING-CENSUS.md) §11 (SHA
`72c187aa…8e43`, twice byte-identical, 6,000 + 2,500 moments over 75 + 32
clusters, zero `src/**`, fingerprint unchanged; table committed at
`docs/world-model/data/c5-t1-waiting-census.json`, table SHA `7ea8152a…06e1`).

* ⛔ **H1 fired on the ACT-NOW arm alone, 2.99pp against a 2.0pp tolerance.**
  All three HOLD arms reproduce across disjoint blocks at 1.56 / **0.06** /
  0.87pp and all twelve gated pressure rows are inside H2's 5.0pp. §7.2b had
  disclosed this gate BEFORE the run as 2.1σ rather than ~3σ at the realised
  base rate, and it fired at ≈3.1σ — the edge where a mis-sized tolerance and a
  real block difference are indistinguishable by this design (32 held-out
  clusters, and "how shot-heavy a match is" is a cluster property). **Not
  relaxed after sight**; a T1R would re-power H1 off this run's own cluster
  variance and take more held-out clusters.
* ⭐⭐⭐ **Reading (a), resolved and monotone: waiting is expensive at both
  ends.** Paired per-moment cost **−7.55 / −12.77 / −16.12pp** at k = 30/60/90,
  every CI far from zero — ten times the resolution §7.1 worried about — with
  the concession twin **+1.45 / +2.63 / +3.55pp** on top. Marginal shot rates
  31.35% act-now → 23.80 / 18.58 / **15.23%**.
* ⭐⭐ **§8.3's twin closes the obvious defence.** Re-anchoring the window at
  the RELEASE still leaves **−6.53 / −10.20 / −12.40pp**: the ball is not
  better when it finally goes, it is just later.
* ⭐ **The consequence T2 needs before it is drafted: a chooser priced from
  this table would essentially never hold.** Registered honestly — part of the
  cost is mechanical by construction (a held tick is a tick removed from the
  same window, which §4 fixed the horizon to count rather than hide), so the
  claim is *"in THIS world a held tick is a spent tick and nothing pays it
  back"*, not *"patience has no value"*. **Q2 anticipated exactly this** and
  its answer stands: road B enriches the world and re-censuses (#26.5). This
  table is the before.
* By pressure at k=90: free −10.53 / mid −18.87 / pressed −16.77pp — the world
  only charges for time when there is someone to charge you, the same shape
  T0R found. Hold survives its own window 84.8 / 76.7 / 68.8%.
* ⭐ **§9's tempo baseline, the number the 1.1–1.2× anchor was waiting for:
  the median ownership spell in this game is 0.33 s and the mean is 0.68 s** —
  about four and a half decision ticks on the ball. Passes/min 28.34 legacy vs
  29.64 VALUE; one-touch share 19.4 / 19.6%; the two worlds are within 5% on
  every instrument, so the perceived brain is not what sets the tempo.
* ✅ X4 (seam inert, 3/3), X5 (bites, **100%**), C1/C2/C3 and determinism all
  pass. The ladder resolved 5 of 27 cells at cell level, 9 at (pressure ×
  stale), 13 at the pressure row — exactly what §5 said would happen, which is
  why no per-cell floor was gated.

Earlier, C5 T1 PRE-REGISTERED →
[`C5-T1-WAITING-CENSUS.md`](C5-T1-WAITING-CENSUS.md). Four paired arms off one
pre-step state (act-now vs hold-30/60/90), E5d's shot-within-240 axis so the
numbers are comparable to the committed attempt tables, concession twin beside
it. ⭐ **The load-bearing choice is made in advance: the horizon starts at the
DECISION MOMENT in every arm, not at the release** — a hold arm spends k of its
own ticks holding, which IS the price of waiting; a release origin would hand
the hold arms free time and manufacture the result Q2 forbids assuming (the
release-origin twin is reported beside it). The exchange rate is **REPORTED,
never gated**, with three exhaustive readings fixed now; what is gated is
instrument quality — seam inert when inactive / biting when active, coverage,
and held-out calibration at E5d's inherited tolerances. Floors are checked, not
performed: the pressure-row floor is derivable from T0R's banked band shares,
the joint 27-cell occupancy is NOT, so it gets a frozen ladder and a coverage
report rather than a floor I would have invented. Time-signature instruments
defined in §9 (the tempo census the 1.1–1.2× anchor has been waiting for).

**(2) ⛔ C4 T0 RUN AND FAILED** → [`C4-T0-ARRIVAL-CENSUS.md`](C4-T0-ARRIVAL-CENSUS.md)
§7 (SHA `21f42c3d…dd66`, twice byte-identical, 3,331 + 3,262 crosses, zero
`src/**`, fingerprint unchanged, 820/820). **Two independent routes return it to
the commander, and they agree.**

* ⛔ **Gate C1 fired: held-out BAL vs PRESS produced 296 crosses against a 300
  floor, short by four.** Mine, and the #24 family again — the floor came from
  E5h's league-wide 2.49 crosses/match, a rate describing neither archetype and
  least of all the quietest cell (a balanced side vs a press crosses 1.18/match).
  §5.2 had already recorded the margin collapsing 2.1× → 1.1× when the X4
  reference landed, and the floor was left frozen rather than tuned, which is
  what let it fire honestly. Not re-derived after sight.
* ⭐⭐⭐ **The headline, and it re-aims C4: `noAerial` was almost never "nobody
  there".** Pooled C0 **10.90%** / C1 **5.70%** / C2 **27.95%** / C3atk 24.71% /
  C3def 30.74% — the conflated 43.6% is **one part in eight** nobody-there. That
  is pre-laid reading (b): bodies ARE arriving and not heading. Q6's insistence
  on splitting first is vindicated exactly.
* ⭐⭐ **A new instrument says why — the delivery does not get up.** Only
  **60–63%** of CROSS-archetype crosses ever reach `HEADER_MIN_HEIGHT` (BAL
  81–84%), and among C1 crosses only 24–58% were headable at all. ⚠️ **This
  lands on Q1's "delivery healthy, untouched"**: the archetype that crosses 2.2×
  more often does it with deliveries 20pp less likely to be headable, which is a
  DELIVERY property. Whether Q1 survives is the commander's.
* ⭐ **The map's sharpest claim is CONFIRMED and is not the mechanism**: the
  licensed arriver is nearer the Phase-31 cutback arc than the ball in
  **74–89%** of crosses and sits 8–9 m from it at arrival. So (a)'s second half
  is true while (a)'s first half is false — T1's routing fix would move one body
  in about half the crosses, against a C1 of 5.70%.
* ✅ **X4 exact on all six combinations** (the unmodified `cross-anatomy`'s own
  output reproduced share for share and rate for rate), partition, pooled
  coverage, stability (max 1.40pp vs a 3.5pp tolerance) and determinism all
  pass — **the instrument is not in doubt; one cell's certification is.**
* Also banked: C0 is *cut out by the defence* in ~85% of cases, not dead-ball
  attrition; the box runs ~2:1 against and fills between kick and arrival; even
  C1 is usually a near miss (nearest attacker median 1.8–2.3 m, 69–93% within
  3 m); and I2's conversion baseline is **34.40% shot / 10.27% goal** on
  `cross-anatomy`'s window — ⚠️ **which is NOT the "cross→goal ≈5%" I2 quotes
  from ROADMAP**, so a non-increase gate must name which measurement it means.

**Three pre-run corrections are disclosed in the contract's own §3.3, in their
own commit**: C1/C2 decided over the whole descent rather than one instant (the
single-instant read had the nearest attacker 5.4 m away on crosses that were
then headed), C2 also firing on an attacking touch (the chest trap was landing
in C1 because the contest resolves inside the step), and arrival kept at the
frozen predicate rather than the header band (an intermediate version called
low crosses "never arrived" — a third meaning inside C0).

**Open, and all the commander's.** C5: adopt T1's table on the mis-sized-gate
reading or order T1R with a re-powered H1 and more held-out clusters; and rule
what T2 becomes now that a chooser priced from this table would never hold —
Q2's road-B re-census, a richer world first, or a re-posed axis. C4: re-size
T0's coverage floor off this run's per-archetype rates; re-aim C4 v1 now that
C1 is 5.70% and C2 is 27.95% (arrival vs contest vs the delivery's flight
height); rule on Q1; and name the conversion measurement I2 gates on. Nothing
is in flight. F9 render-only any time; R20 in gaps.

Earlier — **C5 T0R PASSED every gate**
→ [`C5-T0R-REDRAW.md`](C5-T0R-REDRAW.md) (SHA `495faec0…f503`, 12,000 holds /
76 clusters, fresh block 840,000+, zero `src/**`). ⭐ **The authorized
diagnostic first REFUTED my own named confound** — the attrs are flat across
the pressure bands (strength 0.391/0.394/0.386), so there was no skew to
confound with — and then found the real thing: within every band, stronger
holders are tackled MORE and more technical holders LESS. ⭐⭐ **The code had
said so before any data**, which is how #27.3 asked A3R to be derived: the
standing challenge prices the carrier at `dribbling ×0.18`, `strength ×0.10`
and `pace × drive ×0.16` — and that largest term is **switched off by
construction** during a hold, because `drive ≈ 0`. T0's A3 gated the
third-largest term in a formula it never read. **A2aR: tackle-loss 4.52% →
17.72% → 23.76%**, steps +13.20pp [11.11, 15.32] and +6.04pp [4.02, 8.08] —
the world grades a held ball HARD, the rate more than quintuples, both steps
clear zero by 5σ and 4σ. **A3R: −2.76pp, CI [−5.14, −0.49]**, and its per-band
shape is coherent without anyone designing it in — technique buys −0.79pp when
free and **−3.73pp when pressed**, because the formula is only consulted when a
tackler is in range. Transfers all re-earned: A1 95.81%, A2b 67.57%, A2c
rising. ⚠️ Honest margins: A3R's CI upper bound is −0.49pp, close to zero, and
smaller than the frozen block's −3.32pp — re-power rather than inherit it. ⭐
**The strength channel, reported beside it, is UNSTABLE across blocks**
(+1.24/+2.33/+3.63pp frozen → −2.27pp [−4.69, +0.19] fresh): INCONCLUSIVE under
#20, and exactly what a noise-dominated ×0.10 term looks like. Generalised
lesson: **gate where the substrate says the gradient lives — the code tells you
before the data does.** **Next, both authorized without a new ruling (#27.5):
T1 (the waiting census) pre-registers, and C4 T0 runs after this lands (one
experiment in flight).** F9 render-only any time; R20 in gaps. Earlier,
BOTH road-B design contracts IN PLACE —
[`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md) +
[`C4-AERIAL-ARRIVAL.md`](C4-AERIAL-ARRIVAL.md), each drafted by the
commander on its Phase-0 map, all twelve open questions ruled. Executor
next: **pre-register C5 T0** (Autonomous mode, both contracts in hand);
C4 T0 slots into a C5 queue gap; F9 render-only any time; R20 in gaps.
Stage III drafting continues (commander).** Earlier,
C5 DESIGN CONTRACT IN PLACE —
[`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md), drafted by the commander on
the Phase-0 map, six questions ruled (Hold = candidate · the census prices
waiting · stagnation legacy-only · new shield-Hold · C7 shares contract not
stages · NO FREE TIME). Executor next: C4 Phase-0 code map (#26.4), then T0
pre-registers under Autonomous mode; F9 render-only any time; R20 in gaps.
Stage III drafting continues (commander).** Earlier,
C5 PHASE-0 CODE MAP DONE
and reported back → [`C5-PHASE0-CODE-MAP.md`](C5-PHASE0-CODE-MAP.md).
Read-only, zero code. Headline for the contract draft: **there is no "whether"
seat** — a single-shot argmax over ways to get rid of the ball, re-run every
0.15 s, whose default is to CARRY, and **the only time term in it penalises
waiting** (`stagnation`, `PlayerBrain.ts:176`, applied against `HoldUp` at
`606`). `HoldUp` already exists but is gated to ST/corner-hold with back to
goal under pressure; the wind-up seat is a zero-tick hole (kick fires inside
the decision function); one-touch has a real technique-scaled price but no
chooser; and a hold cannot be attacked differently from a carry because the
ball is glued either way. Six open design questions in §7 for the commander.
**C4 PHASE-0 CODE MAP ALSO DONE 2026-07-27** →
[`C4-PHASE0-CODE-MAP.md`](C4-PHASE0-CODE-MAP.md): the delivery is healthy, the
contest is a one-tick 1.35 m lottery with a die as big as its signal, and the
single wide-ball arriver runs to the CUTBACK arc 16 m out while the cross drops
near the penalty spot — **and the engine already knows how to fill a box on a
delivery, it just only does it for corners** (timed multi-body crash, landing
re-route). Two honest reverts already sit at this seat, so the option space is
narrow; the `noAerial` instrument needs splitting into *nobody arrived* vs
*arrived and did not head it* before it gates anything. **Both maps are with
the commander; the C5 design contract came back
([`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md)) and its first stage is now
RUN: [`C5-T0-HOLD-MECHANICS.md`](C5-T0-HOLD-MECHANICS.md) — **T0 BUILT, and
FAIL on A2a + A3; the queue stops and the fork is the COMMANDER's.** X-series
6/6 (fingerprint unchanged, arming-with-seams-shut byte-identical, zero live
callers, legacy `HoldUp` untouched), A1 far-side **95.81%**, A2b ceiling
**68.81%** and A2c stamina strictly rising — but **A2a 72.82 → 80.32 → 68.81%**
(non-monotone on the low→mid step) and **A3 −3.44pp, CI [−6.72, +0.18]** (the
strength gradient runs BACKWARDS). ⭐ **A2a's loss-cause column gives a THIRD
reading neither pre-laid option covers**: lost-to-tackle by band is **3.44% →
14.59% → 22.60%, perfectly monotone** — the world DOES order holds by pressure
on the channel pressure drives; A2a measured *ownership survival*, which
bundles tackles with dead balls, and in the low band only 3.44% lose to a
tackle while 27.2% lose the ball. **A gate-definition limitation I own, not a
band artefact and not a world finding** — and NOT re-cut, since rewriting it is
a redraw with a #19 re-powering attached. ⚠️ **A3's leading candidate is a
confound in my own gate**: the terciles are not stratified by pressure band and
the bands differ ~4pp, so a strength skew toward high-pressure moments could
manufacture the whole −3.4pp. Labelled, **not run** — computing a new statistic
to explain away a fired gate is the move the discipline prevents; it is the
commander's to authorize. ⚠️ **One number flagged louder than itself**: the
carry baseline survives 12.31% against the hold's 71.2%, but the baseline arm
counts a COMPLETED PASS as not-survived, so the two are not comparable and the
6× gap is mostly holding-vs-playing, not keeping-vs-losing — flagged precisely
because it is the number most likely to be misread as "holding is free", which
the commander's binding interpretation forbids drawing at this stage. Earlier, the
dormant hold + fork mechanics were pre-registered with gates frozen. ⭐ One finding from re-reading the
tackle path reshaped the build: **the attack surface already exists and already
punishes standing still** (the tackle search measures `dist(o.pos, ball.pos)`,
not the man — so a ball on the far side of a body is harder to reach by
existing geometry; `strength` already shields; a stopped-and-doubled carrier
already takes +0.12). So T0 invents no attack — it makes the shield a
deliberate body position, adds the one genuinely missing cost (stamina), and
then MEASURES whether the existing attack still reaches a hold. That reframing
names T0's real risk, and I1 is gated accordingly as a **CEILING on hold
survival** (< 0.90 under the top pressure band) rather than merely "loss is
possible" — a hold that survives a real press nine times in ten is E5h's `×1.3`
in a new costume. A3's floor is derived AND its attainability stated (forced
holds can be staged at any ball-owner tick, so the floor is budget-bound, not
population-bound — the opposite of E5g's P2, which is why that failure cannot
recur here). **F9 remains available at any time**
(render-only; road B does not pause Track F). R20's three remaining
re-analyses in gaps. All flags default-OFF; the E4 ship gate is closed for
this cut and re-opens per-slice. Earlier,
ruling #25: THE OVERLAP FILE IS CLOSED, fully
attributed — the regression is the removal of a hand subsidy that honest
measurement does not support (73% → 49% per commit; no premium; everything
else measured-innocent). The E5 probe chain closes at eight members, every
one disposed. The fork is the USER's round-2 verdict (#25.4): road A =
direct football as v1's identity + honest pre-ship references, road B =
make combinations genuinely pay (joint value has a measured third-man
target; overlap needs substrate change first). Executor idle apart from R20
gap work; seat 2 parked; the commander drafts Stage III. Earlier,
ruling #24 executed: E5h RUN — and it CORRECTS the
decomposition #24 had just banked. The clock is **not** the overlap file's
first component: commits per matured run are **0.2499 OFF vs 0.2267 VALUE
(0.907×, indistinguishable)** — in BOTH arms only a quarter of matured runs
ever meet a pass commit, so **C5 cannot restore this counter** (which is not an
argument against C5 itself). **The entire differentiator is at the commit:
releases per commit 72.99% → 49.04%, 0.672×, disjoint intervals and every
cluster separating — the legacy `×1.3` quantified**, and independently
confirmed by E5g's 51.17% from a trace-based definition that was never tuned to
this one. ⛔ **The C4 link is also NOT the mechanism at the deployed horizon** —
releases become crosses 1.2% / 2.1% of the time, so the chain cannot be the
depressant — though **#24.3's conclusion survives by another route**: the ball
cashes above the table's marginal (7.24%) and below its own alternatives
(E5e's 8.29%), so the honest table is right about it in this substrate. So both
roads #24.5 ranked ahead of the deep fix are now measured NOT to be the overlap
file's cause; what remains for that file is the subsidy question itself. The
design fork awaits the **USER's round-2 verdict (#24.5)**. E4 ROUND 2 stays
LIVE. Seat 2 parked. R20's three remaining re-analyses in gaps. Stage III
drafting continues (commander). Earlier,
ruling #23 executed: E5g RUN — the contradiction
resolves WITHOUT a defect, and what returns to the commander is a DESIGN
question. Outcome **(c) is exactly zero** (437 at rank 1, 437 chosen — the
live argmax is clean), so the hard stop does not fire and **the
harvest-B-on-VALUE fork stays unauthorized**. The dominant fact sits UPSTREAM
of all three outcomes: **0.177 decisions per matured run — in 82% of matured
overlap runs nobody takes a pass decision while the licence is live**. And the
flip benchmark **did not transfer**, exactly as #23.2 registered in advance:
0.82pp ahead flags-off → **0.92pp behind** deployed, with geometry innocent
(priced cell = truth cell 96.27%, `band === −1` never). ⛔ P2 fired as **my own
design error** — a 2,000-moment floor against a staging that contains 854, i.e.
unreachable by construction — owned, not lowered. **E4 ROUND 2 stays LIVE**
(off / v1 / triple): the user's eyes, direction feedback not a ship vote. Seat 2
parked by measurement. All flags default OFF; R20's three remaining re-analyses
in gaps; the commander drafts Stage III.
Earlier,
BOTH of #22's executor steps are DONE.
E4-PREP-2 SHIPPED (the audited triple is reachable from Settings as a closed
mode list; defaults OFF; the excluded-axis pin amended in its own disclosed
commit) — **E4 ROUND 2 IS OPEN and waiting on the user's eyes**, direction
feedback not a ship vote. E5f RUN and back at the COMMANDER on §5's own
HARD-ESCALATION branch: the overlap collapse is **one stage wide** (F1 1.102×
and F2 1.177× — MORE overlappers assigned and MORE coming around — then
**F2→F3 halves, 22.86% → 11.43%**, and F3→F4 is untouched at 0.985×), and the
perception hypothesis is **dead**: never-READ runners release MORE (13.01%)
than ever-READ ones (11.03%), so **seat 2 (gaze) does NOT unpark** — the men
the passer can see are the ones being declined. P0 was the run's other result:
~85,000 extra `perceivedSnapshot()` calls reproduced all twelve banked
integers, so the perception pull is re-entrant in fact. The contradiction with
Phase 0 (b)'s flip benchmark is now sharp and unexplained, with two untested
reconciliations named and unchosen. All flags default OFF; the commander drafts
Stage III in parallel.** Earlier,
E5e PHASE 0 RUN — (a) MEASURED, (b) NOT CERTIFIED;
back at the COMMANDER. (a) settles the magnitude question: `0.468×` was real,
overlap pools to **0.516×** and third-man to **0.660×**, both REFUTED on six
clusters under ruling #20's own semantics. (b) certifies **only one of the two
premiums** — third-man **+1.49pp** [+0.60, +2.47] against the deployed axis,
overlap **−3.52pp** [−4.78, −2.28] carried as INCONCLUSIVE because P4's control
arm is off-band. ⭐⭐ **The reading I labelled after the live audit is refuted by
measurement**: overlap runners land in the MIDDLE third, and at their own
moments they are already the **top-priced option** (flip benchmark −0.82pp).
⭐⭐⭐ So Phase 1 as designed would raise third-man and **lower** overlap —
pushing the seesaw further, not holding both ends up — and the live collapse
must be **upstream** of the price comparison, which is now the sharp open
question. E4 round 2 stays shut, all flags default OFF, seat 2 still held.
Ruling #20's cheap re-analyses run as independent small steps in the gaps:
**R20-2 (frozen cutpoints) RUN and PASSED** — E2b-0's held-out claim survives
the correction (held-out spread 40.23pp, cutpoints stable to 6.6%), with one
CI-level ~3pp miscalibration at Q2 recorded against it. Earlier,
C3R PASSED and the axis went live behind its flag,
then THE LIVE AUDIT FIRED ON H1 AND H2 — back at the COMMANDER. The attempt
axis is the best chooser the slice has built (§2 band essentially neutral,
forward share ABOVE flags-off for the first time, shots +22%, third-man at its
slice best 0.642×) and it regressed the one counter every previous axis kept:
overlap 0.468×. The two combination counters now provably trade off against
each other under every axis tried. E4 round 2 stays shut, all flags default OFF,
seat 2 still held. Earlier,
PHASE 0 RUN — the attempt axis RE-RANKS
(+15.56pp of decisions, ordering sign restored) but Phase 0 is NON-PASS on two
gates, so per the contract and the standing instruction the fork is the
COMMANDER's before Phase 1. Both failures are about the OLD table's defects
(X6: E5a's V is deflated 1.91pp / 27% relative by a late window start and
unsimulated windows) and the NEW table's population (C3: over-predicts the
control arm by 2.08pp on selected moments) — not about the axis doing its job.
Earlier,
E5 + E5c RUN and returned to the commander: E5c's two
attribution tests BOTH refuted on their own criteria, so per ruling #16.4 and
the contract's §6 the third cause is reported rather than hunted: a per-option
argmax over P̂ × V̂ inverts the true ordering of the third-man pass (realized
4.89% vs 3.80%, scored 3.53% vs 3.83%). Two side findings need a ruling of their
own: E5a's V table is deflated by unfollowed windows (§7.1), and ruling #16.3's
geometric premise is refuted by measurement (§7.2 B2). E4 round 2 stays shut,
every flag default OFF, seat 2 still held. Earlier state — E5a PASS on every gate
(banked as a milestone by ruling #16.1: the game owns a validated value
instrument), E5b 30/32 with the CENTRAL HYPOTHESIS FAILED and accepted exactly
as pre-registered. E4 round 2 does not open and every flag stays default OFF
until E5c attributes; seat 2 (gaze) HOLDS per ruling #16.5. Nothing was repaired
after the result: a one-step measured value buys a coherent, more direct game
(shots +17.5%, overlaps and give-and-gos recovered, the §2 band healthier than
E3R's) and cannot see two-pass patterns.**

> ⚠️ **CI was RED for five days and is now GREEN again (2026-07-26,
> user-ratified fix).** The Pages deploy had **0 successes in its last 100 runs**
> (since 2026-07-21), so the build the user plays was stale and E4 could not
> start. Two independent causes, neither a code regression (the fingerprint is
> unchanged across all of it), each masking the other: (a) `npm test` died with
> `[vitest-worker]: Timeout calling "onTaskUpdate"` at 600–720s with EVERY test
> green — the failure `vite.config.ts` already documents, whose `singleThread`
> mitigation a 99-file/~700s suite has outgrown; (b) once a run got past that,
> `stamina.test.ts` read **0.9406 against its 0.93 gate on the ubuntu runner**
> while the same commit reads 0.9161 on macOS under Node 22 AND Node 26 —
> platform libm drift eating the 1.4pp of headroom E3R §5.7 had already measured.
> Fix (`2b77f47`): CI runs on **macos-latest**, the platform every behavioural
> contract in this repo was calibrated on, and `npm test` becomes **three
> sequential `vitest run --shard=i/3` steps** so no single process accumulates
> enough blocked event-loop time to trip the RPC budget. No test semantics, no
> gameplay, no fingerprint change — re-baselining the stamina contract was the
> alternative and C1-B §12.4 forbids it. Verified: build+deploy green, and the
> live bundle carries `evo:edsPreview`.

> ⭐⭐ **E4 FEEDBACK, ROUND 1 (the user played it, 2026-07-26). No ship verdict
> given, no revert asked for: "方向没问题,可以等" — the direction is affirmed and
> the missing seats are judged worth waiting for. Flags therefore stay
> default-OFF (status quo) and this is the commander's to draft on.**
>
> **What the user saw:** a man you cannot see cannot be passed to is realistic,
> but (a) a midfielder with vision would TURN AND LOOK before playing, and would
> play one-touch because he looked BEFORE receiving; (b) a real back-pass comes
> after HOLDING the ball and drawing a defender, not as a first-touch reflex;
> (c) as it plays now it is safe recycling — "什么配合都打不出来".
>
> **Measured, same seed, two seasons, flags-off vs bundle** (`npx tsx` two-arm
> League probe; numbers are per match unless noted):
>
> ```text
>                        flags-off    bundle     delta
> forward-pass share       58.56%     53.47%    -5.1pp   <= the "safe balls" impression
> passes                   101.58     107.49     +5.8%   <= more circulation
> shots                     13.47      12.66     -6.0%   <= the watchability cost
> pass completion          72.43%     70.25%    -2.2pp
> one-touch share          20.78%     20.28%    -0.5pp   <= one-touch did NOT increase
> third-man releases       10.014      6.437    -35.7%   <= COMBINATION PLAY COLLAPSES
> overlap releases          0.176      0.056    -68.0%
> give-and-gos (small n)    0.578      0.732    +26.8%
> longest pass chain         5.88       6.62    +12.7%   <= circulate, don't progress
> ```
>
> **The mechanism, indicted in code and NOT a perception problem.** The E3 seam
> replaced WHO gets the ball and left WHETHER to pass on the legacy score. The
> legacy pass loop carries the whole tactical layer — the 2过1 return bonus
> (×1.15+), third-man (×1+passBias·0.3·thirdManW), overlap release
> (×1.3+width·0.6) and an explicit **×0.55 "don't hand it straight back"
> penalty** — and all of it only ever shaped `bestMate`. The perceived chooser
> then overrides the target with `argmax P(clean reception)`. So **the licence
> and the delivery are now granted by two different judges**: the overlap runner
> earns the pass, the ball goes to a safer man, and the anti-back-pass penalty
> vanishes with him.
>
> **The deeper reading: the measured axis is half a decision.** Football wants
> P(success) × WHAT THE BALL IS WORTH THERE. E0 refused a scalar by design and
> rulings #8/#9 forbade invented weights, so the chooser is progression-blind BY
> CONSTRUCTION and the safest recycle wins every tie. The honest repair is not to
> re-add hand-tuned bonuses but to MEASURE the value half with E2a-2's own
> fork-and-force harness — for each candidate, not "did he control it" but "what
> happened next" (shot within N seconds / threat delta). Same move E2b-0 made for
> the corridor read: measure the exchange rate, never invent the weight.
>
> **Three named seats, in the order the user's eyes prioritised them:**
> 1. **The value half of the axis** (cheapest single fix; explains BOTH the
>    back-passes and the lost combinations).
> 2. **A gaze consumer — look-before-pass.** S3-G0 / S3-G1 / S3-G2 are banked and
>    dormant; A4 was parked precisely because "latency only binds against live
>    coordination — build it once a live seam exists", and the seam now exists.
>    Look-pressure is already measured at 6.59% of live pass moments.
> 3. **The time dimension** — hold-draw-release, and one-touch vs control as a
>    priced choice (C5, where ruling #12 already re-seated the touch cost).
>
> ⚠️ **And a gap in the GATE SET, not in the bundle:** E3R's §2 band passed on all
> five dimensions while watchability measurably dropped, because the band has no
> progression or combination dimension and 29 gates contained no watchability
> instrument at all — the user's eyes are the only one, and they sit at the END of
> the chain. The four numbers above cost minutes to produce. Recommendation for
> any redraw: carry forward-share, the three combination counters, shots and
> chain length as REPORTED band dimensions from now on, so a probe can see what
> until now only a play session could.

**How to run E4 (the deployed build, on the phone or the desktop):**

1. ⚙ Settings → 🧬 Experimental → tick **“EDS preview: players act on what they
   SEE”**. It takes effect at the **next kickoff**, so the cleanest read is to
   watch a match, tick it, watch the next one, untick it, watch a third.
2. What is actually different: the passer picks his target from his OWN view
   (a man he cannot see cannot be passed to) and the defender's interception
   read runs off his own view of the ball. Everything else — power, aim,
   execution — is the shipped game, and `edsTouchCost` is NOT in this bundle
   (ruling #12.3 re-seated it to a future C5-coupled slice).
3. Registered feel items (ruling #14.4): play is measurably **CALMER** — later
   tackles, better-supported passes, fewer loose-ball scrambles — and a full
   match no longer spends the stamina tank (0.9697 vs a 0.93 contract). The
   question is whether calm reads as football or reads as flat; the
   fatigue-economy re-seat is already queued if the bundle ships.
4. **F-ACCEPT** (art F2–F7: body proportions, crowd + closed bowl, turf grain,
   ball trail/height, goal fireworks + flame jets day AND night, day/night
   toggle) can be judged in the same session.

Ship = both v1 flags default ON + fingerprint/perf rebaseline + a ROADMAP
entry, and the toggle's fate (keep as a “legacy brain” switch or remove) is
decided then. Revert = the whole bundle, dormant assets stay banked. Until the
user says either, `main` plays exactly the game it played before: the flags are
default-off and the fingerprint is untouched.

The slice is complete as engineering: a body inside a live match chooses its
pass from what it can see, the defender reads his own ball, perception is
honest and costs 19.8% at brain cadence, the equilibrium holds on all five §2
dimensions, power usage stays situational, and the ecology keeps its variety
(median entropy ratio 1.5253 over five fresh seeds — usually MORE varied than
without the bundle). Every claim is pinned: E3R's banked live numbers return
17/17 bit-identical under the pull implementation, and the lazy/eager
equivalence is a perpetual test rather than a promise.

**What E4 is, exactly:** the user plays. Ship = the three v1 flags default ON
(`edsPerceivedChoice`, `edsPerceivedDefence`; `edsTouchCost` stays OUT of v1 by
ruling #12.3) plus a fingerprint/perf rebaseline. Revert = the whole bundle.
Nothing is flipped until the user says so — the flags are still default-off at
this commit, so `main` plays exactly the game it played before.

**Two things the user should know while playing** (both measured, neither a
blocker): the game is CALMER — defenders commit later and passers pick
better-supported balls, so there are fewer loose-ball scrambles, and the
stamina contract breaks because a full match no longer spends the tank (0.9697
vs a 0.93 gate; ruling #13.4 carries this to E4 as a FEEL item, with a
fatigue-economy re-seat registered as the follow-up slice IF the bundle ships).
And per-seed CE1 is noisy (2/5 fresh seeds shrink), which is honest context for
"co-evolution restored", not a contradiction of it.

Below, the E3R record as it stopped:


**(E3R result record) ⛔ E3R stopped at a commander gate —
E3R passed 26 of 28 gates and E4 is NOT reached.** Ruling #12's amended thesis
survived its own audit: with the mechanical tax gone, **the live game absorbs
honest two-sided perception** — every §2 dimension in band (goals +2.20%),
power usage situational at 21.86%, and the attacking advantage decaying
+0.2864 → +0.0282 across ten generations. The chain is exact end to end
(re-bank 7/7 bit-identical, X4R 0/10,292), which also PROVES the premise
correction §1.1 registered before the run: the reference was always
flag-off-honest.

**Two things return here, and neither is a gameplay break:**

1. **Style entropy 0.5797 vs a 0.60 floor — H2 stands by the letter only.**
   All three pre-registered discriminators refute the genome-blind mechanism
   (clubs play MORE differently, genes express MORE strongly, the chooser
   varies club to club), and the pre-registered robustness seed INVERTS the
   statistic (ratio 1.5321). The honest reading is that a single
   final-generation entropy over 16 clubs cannot decide this; what the
   commander now has to rule is whether CE2 needs a powered form (multi-seed,
   multi-generation) before it can gate a ship — the sixth threshold type
   applied to an ecology statistic.
2. **Perf 1.3238× against 1.25×,** with the named lever spent and the residual
   cost identified as the honest per-observation math. The one honest lever
   left — deferred reconstruction, ~40× fewer observations with identical
   values — needs a commander ruling because it decides what "the moment I
   looked" means (per-tick frame vs mid-decide-loop refresh).

**Plus one measured correction worth a ruling of its own:** the stamina
contract breaks on the PERCEPTION bundle, not the touch cost — honest
perception makes the game calmer, so a full match stops spending the tank
(0.9697 vs a 0.93 gate, flags-off 0.9161). That is either a real play-feel
finding for E4's play-test or a fatigue-economy re-seat; it is not a constant
to re-baseline.

Below, the E3 record as it stopped:

**(E3 result record) ⛔ E3 FAILED five gates and E4 was NOT reached.** The build did its job: the live
chooser reproduces E2b-1R absolutely (X4: 0/10,292 per-moment disagreements,
7/7 banked families bit-identical), so for the first time a body inside a live
match chooses a pass from what it can see. The world did not absorb it: the §2
band broke on headers (+30.44%) and long balls (+45.20%), the always-heavy
canary read 17.42% against a ≥20% floor (failing on the anti-dominance side),
co-evo restoration did not shrink, style entropy halved, and the bundle costs
1.3223× at brain cadence. Nothing shipped; every flag is default-off and the
fingerprint is untouched.

**What E3 hands the commander** (full text in
[`EDS-E3-COEVOLUTION-AUDIT.md`](EDS-E3-COEVOLUTION-AUDIT.md) §6):

1. **The failing component is NAMED.** The §4-authorised ablation: bundle minus
   the touch cost is inside EVERY band (goals +2.20%, headers −0.43%, long
   balls +8.06%); touch cost alone is C1-B to the decimal. E1b's curve is a
   measured substrate truth, and it re-routes the game whether or not the
   evaluator can see it — because the re-route is not a decision (R1: the
   chooser's long share is 19.06% vs 18.05% dormant).
2. **Both-sides perception PASSED its own test, live.** The chooser alone costs
   −21.69% of the goals; chooser + perceived defence lands at +2.20%. The
   S3b/vision-attr lesson — one-sided reads inflate, co-evolved reads hold —
   is now confirmed in a live equilibrium, not just in probes.
3. **Three axes to redraw on:** the touch cost's home (its band break is
   mechanical, not evaluative — reprice, re-seat, or hold it dormant); the
   dominance predicate's lower edge against a 49/33/17 distribution and a
   five-step corridor axis; and perception's cost for a consumer that reads
   BODIES (E2b-1R's 1.069× came from reading only a ball — the remaining
   consumption-scoping lever is WHICH bodies might be asked to pass).
4. **Style entropy halving** is the one finding with no benign reading yet, and
   it is the ecology gate, not a gameplay one.

Earlier (after E2b-1): the queue stopped at a commander gate. The experiment's own
questions came back well — **not-looking does not win** and **the route mix
survives perception at awareness 0.8, indistinguishable from omniscience**,
which is the gate S3b failed. It stopped on plumbing: brain-cadence perception
costs **1.329× against a 1.25× budget**, and the probe hashes wall-clock
timings so it cannot be byte-identical. Two questions are the commander's,
both in [`EDS-E2B1-BOTH-SIDES-AB.md`](EDS-E2B1-BOTH-SIDES-AB.md) §7: cheapen
perception and re-run (the defender entry needs only the ball percept), and
how a probe should carry a perf gate without forfeiting byte-identity.

Earlier (after E2b-0): E2b-1 was next —
E2b was split by the executor under ruling #8's standing authorisation, on the
same instrument-first principle the commander has applied three times: a blind
option and a seen one were not on a common axis, and inventing the weight to
join them was forbidden. **E2b-0 PASSED** and supplies that axis, plus three
constraints E2b-1's drafting must answer: the corridor read is the dominant
term (**39.72pp vs 6.64pp** — looking beats remembering by ~6×), **28.48%** of
playable options carry no read at all and need an explicit third class, and
look-pressure is a function of the read rather than the band. Ruling #7 (c)–(g)
and #8 (l) already fix the rest of E2b-1's shape.

⚠️ **Sync (ruling #5)**: Track F (art direction) and D6 landed from another
session mid-run. Render/docs/tests only — zero `src/sim`, `src/ai`,
`src/evolution` — fingerprint unchanged, no step-ID collision, and E2b-0 was
re-run at the post-merge HEAD to the same SHA.

Earlier (after E2a-2): E2b was next and proceeded without a new ruling — E2a-2 PASSED on every gate. The prior is now measured
over the population it will actually price, and it hands E2b three numbers to
respect: the chooser it must beat is worth **+18.62pp**, a remembered distance
is worth **4.48pp** and is non-monotone, and **18.33%** of real passes fall
outside the censused window and take the marginal. Ruling #8 (l) already
settled the aiming rule, so E2b's remaining drafting work is the A/B itself.

Earlier (ruling #8): E2a-2 was the next step — E2a-1's split verdict is
disposed: the FAIL was a correct catch (a base rate over CHOSEN passes is a
selected sample; the prior must price the option space), the census/pricing
layer/table stay banked, and both open questions are answered — Q1: recensus
counterfactually by fork-and-force (intervene on target choice only, live
execution, bit-identical reproduction of the chosen pass as the harness
gate; direction reported, never gated; chooser-lift prediction registered);
Q2: re-key routing onto the priced quantity (8.32pp receptionSuccessRate
gradient), pricing classes fully-unknown→marginal / stale-memory→banded.
E2b's aiming rule is settled in the same ruling (priced always, executable
only with an honest aim point; look-pressure statistic reported). Full
constraints: design contract §3 (h)–(l).

Earlier (ruling #7): E1b PASSED on every gate and is
ACCEPTED (ruling #7): the touch-cost curve is banked behind
`Match.edsTouchCost`, default OFF, proven to land at the real adjudication
within noise of its own arithmetic and carried by the speed channel alone.
The C1-B redraw is spent, in its correct home, on a measurement rather than
a weight. E2's drafting constraints live in the design contract §3
(census-derived priors as data, zero-deletion pricing on E0's banked states,
both-sides evaluator = corridor + touch term, not-looking-must-not-win,
route-mix vs the S3b signature, PERF hard gate). One thing E2 and E3 both
inherit: the canary sized the cost at 6.53pp against power's 21.2pp threat
benefit — heavy is still the safer option on the axis E0 ranks by, so
no-strict-dominance is a live risk E3 must gate, not an assumption.

Earlier (ruling #6): E1a came back
split (I1 PASSES, I2 undecided, probe verdict FAIL — frozen in the contract
§6) and ruling #6 disposed it: E1b OPEN on I1's pass (the contract's own §4
condition), I2 RETIRED (question settled by its decomposition; the powered
flat-vs-rising test is subsumed by E1b's OFF/ON contrast). E1b's drafting
constraints are in the design contract §3 (two-channel amendment: speed
and/or misalign carry the increase, pressure bounded; I1 staging, same-seed
OFF/ON, interval-test predicates per PROBE-CONTRACTS' sixth threshold type;
contested states diagnostics only; always-heavy canary unchanged). After
E1b: E2 (unseen-pricing amendment) → E3 (co-evolution audit) → **STOP at E4
for the user's play-test**.

## Track D — world-observatory UI (no sim contact, Sonnet-friendly)

Direction doc: [`../UI-NORTHSTAR.md`](../UI-NORTHSTAR.md) (commander-curated
from the user's + GPT's direction; events/time/lineage/evidence thesis
adopted, behavior-narrative pages DEFERRED until the behaviors exist).

| ID | Step | Contract | Status |
|----|------|----------|--------|
| D1 | Shell split: world-mode pages drop the match side-columns (floating mini-player instead); match-mode unchanged | UI-NORTHSTAR §全盘采纳 1 | ✅ **BUILT 2026-07-24** (ruling #3): `body.world-mode` toggles on the four world pages (+ settings and the entity-link deep dives resync it); both `aside` columns step aside, the live match shrinks to a 288×162 floating player top-right with a `⤢` restore control, and match-only chrome (cinematic enter, replay bar, reel bug, tacmap, perception readout) hides while the in-host score bug/banner shrink with it. Phones keep the stacked strip instead of a floating card. Zero sim contact: build clean, 702/702, fingerprint `57b0bdab…c673` unchanged. **Acceptance = the user's eyes** |
| D2 | Evolution scatter: season trails + ghost points + hover/lock + generation slider | UI-NORTHSTAR §全盘采纳 2 | **READY** (D1 shipped 2026-07-24) |
| D3 ★ | WorldEvent v0 (honest event set only — champions/streaks/records/style-drift/ELO turns/counter flips) + world home + Dynasty Ribbon; every event carries real telemetry evidence, candidate→confirmed lifecycle | UI-NORTHSTAR §带纪律采纳 | TBD — commander drafts the event-detector contract before any narrative UI |
| D4 | Behavior discovery archive | — | LOCKED until Track A is live in players |
| D5 | Causal replay / counterfactual mode | — | LOCKED until counterfactual authority is productised (E2a-2's fork-and-force harness is its named seed) |
| D6 ★ | **POV suite** (user-ratified direction 2026-07-25, "应该多搞,之后出效果再说"): player-eye BELIEF view — render what the player believes, not truth: unseen teammates as fading ghosts, ball gone when out of cone (9.4% of the time at 0.8 awareness), gaze visibly alternating between targets; plus the literal second person (watch a player through their marker's eyes) and a follow-cam. "就好像我们在踢球一样,能直观知道球员想干啥,看到了什么" | TBD — commander drafts after EDS ships | **LOCKED until E4 ships the bundle** — before EDS, live behavior is not perception-driven and a POV view would narrate behaviors that do not exist (UI-NORTHSTAR's deferral rule) |

Track D rules: zero sim contact (fingerprint gate every step), acceptance =
the user's eyes, never displaces a Track A experiment slot, and no narrative
number may appear without a real detector behind it.

## Track F — art direction (opened by the user 2026-07-25; parallel-safe)

The renderer already has real bones: Three.js match view with hemisphere +
directional sun and PCF soft shadows, fog, crowd/broadcast/FX layers, a
630-line procedural AnimationSystem, procedural box-geometry players, a
PlayerShowcase stage and a playwright visual-debug harness. The gap is not
machinery, it is **coherence** — MeshBasic flat elements sit next to
MeshStandard PBR elements, and no document says what the game should LOOK
like. Art's "high standard" is therefore a different shape from physics':
beauty cannot be probe-gated, so the discipline adapts —

* ✅ **[`F-DIRECTION.md`](../F-DIRECTION.md) WRITTEN 2026-07-25** — art's
  VISION.md, now the gold standard for the look: the committed style, palette
  as data (`src/render3d/stylePresets.ts`), material-language rules, scale
  rules, surface rules, camera rules, the standing lever list and the
  what-not-to-do list. It supersedes `ART_DIRECTION.md` on atmosphere/palette
  (which keeps UI registers, animation timings, effects and icons). Every
  later lever is measured against it by the only valid judge — the user's
  eyes.
* Hard gates stay objective: **zero sim contact + fingerprint every step;
  PERF budget per PROBE-CONTRACTS §5.5** (phone is the binding constraint —
  the user plays at ≤390–640px; fluency > interruptions is on record);
  screenshot A/B (fixed seed/camera/tick via the existing harness) as a
  COMPARISON AID for the user, never a pass/fail gate (headless render
  checks are flaky — verify data/code/types, trust the browser for pixels).
* **Explicit-path staging only** — art work is where binary assets sneak
  in; the procedural-first rule below keeps the repo asset-free.

| ID | Step | Status |
|----|------|--------|
| F1 | Player-scale honesty | ✅ **DONE 2026-07-25 — AWAITING THE USER'S EYES** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| F0 ★ | Style-direction showcase | ✅ **DONE 2026-07-25 — PICKED AND SHIPPED: arm (a) toy/board-game, daylight, night switchable** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| F2 | **Character proportions — toy anatomy** (first lever off F-DIRECTION's list, user delegated "按照推荐自走"). Limbs +~35% thick, shoulders tucked IN (`SHOULDER_X` 0.55→0.50) so the F1 anchor survives untouched — widest body 1.6165 m, **0.64 still the largest 0.01 step that fits**, the model neither grew nor shrank. Head 0.30→0.34 and bedded 0.115 INTO the shoulder line (no visible neck — a stub neck was built, found to be fully buried, and deleted rather than shipped as dead geometry); eyes added; chest NARROWED 0.86→0.72 so the thick arms stop merging into the shirt; shirt shortened 0.95→0.86 so the legs read; boot chunkier and shorter. Officials + coaches thickened to match. Limb LENGTHS untouched on purpose — every elbow/knee pivot and AnimationSystem pose is written against them. ⚠️ **Three defects the review stage caught and that are now test-guarded**: the hair cap swallowed the new eyes and faceted at the bigger radius; deepening the torso buried the back number behind a hand-fitted `-0.253` literal (now derived from an exported `TORSO_BASE`); and `armSpan()`'s "arms are the widest part" was a COMMENT, not a check — now asserted for every role at max bulk. Also re-framed `PlayerShowcase`'s camera (an F1 leftover: it framed a 2.7 m figure). Gates: tsc + build clean · **723/723** · fingerprint `57b0bdab…c673` unchanged | ✅ **DONE 2026-07-25 — user's eyes next** |
| F3 | **Crowd palette** (second lever, same delegation). The terrace was the last element no preset owned — a night-navy crowd sat under the daylight arms' noon sky. `StylePreset.crowd` now carries the shirt palette; the toy arm gets a 12-hue confetti and its NIGHT palette is the day one DIMMED rather than re-guessed (a test asserts same length + every hue darker). Heads gained per-instance skin tones from the players' own six-tone palette — one skin tone for a whole crowd was its own small incoherence. `CrowdSystem` moved into the renderer constructor so it is built after the style is applied. Gates: tsc + build clean · **724/724** · fingerprint `57b0bdab…c673` unchanged | ✅ **DONE 2026-07-25** |
| F4 | **Ball readability cues** (third lever, same delegation). Chosen over the remaining polish items because it repays a debt F1b created: shrinking the ball 36% degraded the single most important object on screen, worst on a phone. Three fixes. ① **Height cue** — the contact shadow was a fixed disc, so a ball 3 m up drew identically to one on the grass; it now shrinks and fades with altitude, clamped so a high ball still leaves a findable mark. ② **The wake is a ribbon, not a line** — WebGL caps `linewidth` at 1 on every desktop platform, so the old `THREE.Line` trail was a one-pixel hair; now a tapered two-vertex-per-sample strip that reads as direction. ③ **Proportional fade** — trail floor 7→5.5 m/s with opacity scaled by speed, so a smaller ball gets a wake sooner without a crawling one painting the pitch. New math lives in the PURE `ballPresentation` module (this repo's own pattern) and is pinned by tests: shadow monotone in height, clamped both ends, never negative; trail opacity clamped, shots hotter. ⚠️ Also **caught and fixed a defect I shipped in F3**: the per-head skin lottery drew from the seat generator's own LCG, so adding it reseated the whole terrace 192→184 bodies — the visual suite's crowd count found it; skins now have their own stream (`2bcc956`). Gates: tsc + build clean · **726/726** · fingerprint `57b0bdab…c673` unchanged · visual suite's own trail check green on the new ribbon | ✅ **DONE 2026-07-25** |
| F5 | **Turf grain frequency** (fourth lever). Started as a check on a suspected F0 regression — the daylight arms looked mottled — and the check REFUTED my own hypothesis: rendering the same frozen tick through `coherence` (no wear at all) and the frozen `current` baseline showed the identical blotches, so metre-scale grain clouds are PRE-EXISTING and F0's brighter key merely exposed them. Diagnosis: the defect is spatial frequency, not contrast. Grain moved to boot-stud scale — coherence 900@≤0.9 m → 2400@≤0.34 m, toy 1600@≤0.45 m → 3600@≤0.26 m — so it mips away with distance and only shows as texture underfoot. Side effect worth the step on its own: the goalmouth and centre-circle WEAR now reads as deliberate, where before it was lost in the noise. `current` untouched, per F-DIRECTION's frozen-baseline rule. Also verified in passing (and found sound, so NOT changed): team kit distinction under the toy daylight — the clash rule keys on raw kit colour, so lighting cannot break it. Gates: tsc + build clean · **726/726** · fingerprint `57b0bdab…c673` unchanged | ✅ **DONE 2026-07-25** |
| F6 | **The bowl** (user 2026-07-25: "球场后面的背景…白天和晚上应该在球场里"). The ground was a diorama floating in a void — one far stand, two low goal banks, nothing on the near side, and you could see straight through the corners. Now enclosed: main stand 3→5 rows with a roof canopy + fascia + back wall + pillars, corners filled with 45° sections, a near bank, goal ends unchanged in height. Crowd 192→**369** (CrowdSystem reads `terraceSlabs()`, so new steps seat themselves). ⭐ **Every height is camera-bound, and that is now a CONTRACT, not a comment**: the render3d test pushes each camera's sight line into every slab's own oriented frame (an AABB over-rejects the 45° corners by spanning their whole diagonal) with crowd head height included, and asserts it reaches the pitch. It immediately caught two real blocks — a corner wedge whose inner tip landed ON the playing surface and blocked follow-cam corner play (my bug, twice), and a **pre-existing** one: the behindGoal sight line grazed the goal-end crowd's heads at 2.15 m, so every goal shot had spectators in its lower edge (bank moved +2.2→+4.0 m). Side effect: the visual suite's `crowd > 200` check, red for ages, now passes; I also fixed its stale linesman bounds (hard-coded to the pre-`FIELD_SCALE 0.7` pitch, `46aa1ac`) — **all 52 3D checks green for the first time**. Gates: tsc + build clean · **729/729** · fingerprint `57b0bdab…c673` unchanged | ✅ **DONE 2026-07-25** |
| F7 | **The goal moment** (user 2026-07-25: "进球得有点特效比如烟花喷火之类的"). Started as a check and found a real **F0 regression**: goal particles use ADDITIVE blending, which glowed against the old night diorama and all but vanishes against bright daylight grass — so shipping the toy/day arm had quietly killed every celebration. Blending is now preset-driven (`fxBlending`): solid confetti by day, glow by night. **Fireworks** added — three staggered shells over the main stand, verified rendering. ✅ **Flame jets SHIPPED, on the fifth attempt.** Four `THREE.Points` rewrites rendered nothing — vertex colours removed, 6 m point size, moved from behind the goal line into open pitch, restructured to mirror `Firework` exactly — with a clean console and a probe reporting visible/parented/opacity≈1/full drawRange/sane NDC, while the near-identical `Firework` Points worked. **Never explained.** Rebuilt as ONE stretched `THREE.Sprite` per jet with a procedural flame gradient: renders immediately, looks better, and costs 4 draw calls instead of 360. Codified in F-DIRECTION: prefer Sprites for billboard-shaped FX until someone explains the Points case. Tuned saturated-orange and 4.6 m (7.5 m towered over 1.7 m players; a white-hot gradient over bright grass reads as haze) — exact look is the user's eyes, since headless capture of a 1.5 s effect is flaky by nature. ⭐ Also fixed a perf debt **F6 created**: `CrowdSystem.update` rewrote and re-uploaded all 369×2 instance matrices EVERY frame, double the pre-bowl cost, on the platform where the phone is the binding constraint — calm stands now refresh at 20 Hz (a 3.5 cm idle bob nobody can resolve), eruptions still get every frame, pinned by a test. Gates: tsc + build clean · **731/731** · fingerprint `57b0bdab…c673` unchanged | ✅ **DONE 2026-07-25 — fireworks + 喷火** |
| F8 | PWA / install to the home screen | ✅ **DONE 2026-07-26 — USER ACCEPTED ("pwa没问题"): installed on the phone, works. F8 closed** — full history → [PROGRAMME-LOG.md](PROGRAMME-LOG.md) |
| F9 | **Kick anticipation + follow-through — the VISUAL half of C7** (user anchor 2026-07-26: "真的摆腿向那个方向,而不是人拿着球,突然把球弹出去"). The AnimationSystem's kick one-shot is REACTIVE — it fires at/after ball launch (0.38s, ball-side foot), so the read is "ball suddenly ejects, leg waves afterwards". Render-only lever: a fast backswing inserted at kick detection + a stronger, direction-matched follow-through; kick amplitudes were tuned for the pre-F2 bodies, so this also retires the standing polish debt (the open-list item, now user-requested). **Honest limit stated up front:** without C7's sim-side preparation delay the backswing can only be a few frames — TRUE anticipation (leg swinging before the ball leaves) needs the causal half. F9 buys the read now; C7 buys the physics later. **Extended 2026-07-27 (user anchor, VISION §2):** the swing must also DIFFERENTIATE by action — curl kicks wrap around the ball (sim already emits spin), backswing/follow-through scale with power, shots vs passes vs dribble touches get distinct move sets; the sim events carry all the distinguishing data, so this is honest render differentiation, same lever. Also registered same anchor batch: a sub-1× match-speed feel option is a trivial UI addition on the existing speed pipeline if the user wants to sample a slower tempo before any calibration decision | **READY — render-only, fingerprint gate, user's eyes accept; any session, never displaces a Track E slot** |
| F1+ | One lever per step, drafted after F0 from the standing lever list: tone mapping/exposure · palette unification · pitch (mowing stripes, wear, line crispness) · lighting presets (day/dusk/floodlight) · player silhouette + kit readability · procedural animation polish (anticipation/follow-through in AnimationSystem) · ball trail/spin/height cues · goal-moment FX + camera work · post (bloom/vignette/AA within phone budget) | TBD after F0 |

### Track F session handoff (2026-07-25, art session — READ THIS FIRST)

> **MERGED by the commander 2026-07-25** (merge commit `5c35582`), verified
> in an ISOLATED worktree — not the shared tree, which held E2b-1R's
> in-flight uncommitted work: tsc clean · **731/731** · fingerprint
> **`57b0bdab…c673` unchanged at the merged HEAD**. The merge commit
> contains zero `src/sim`/`src/ai` files; the E session's uncommitted work
> was untouched. **F-ACCEPT ★ is now the open user gate: F2–F7 are
> PROVISIONAL until the user plays** — first real session should look at:
> body proportions (F2), crowd + closed bowl (F3/F6), turf grain (F5),
> ball trail/height (F4), goal fireworks + flame jets day AND night (F7),
> day/night toggle (F0). Verdict = keep / tweak-list / revert-a-lever.

**Where the work lives.** F1–F4 are on `main`. **F5, F6, F7 and three fixes are
on the branch `art/track-f`**, developed in a worktree at
`.claude/worktrees/art-track-f` because a second session was writing to `main`
throughout. It has NOT been merged: merging during live concurrency is the
commander's call, not an executor's. `git merge art/track-f` from the repo root
when the other session is quiet. **Verified clean** with `git merge-tree
--write-tree main art/track-f` against `main@e9e3b49` — zero conflicts. The
only file both lines touch is this one, and the edits are in different
sections (their rulings and Track E rows, my Track F rows); everything else
of mine is `src/render3d/**`, `src/ui/**`, `src/game/GameApp.ts`,
`scripts/visual-debug-3d.mjs` and `tests/render3d.test.ts`. Note their side
DOES touch `src/ai/PlayerBrain.ts` and `src/sim/Match.ts`, so after the merge
the fingerprint is whatever theirs is — my `57b0bdab…c673` claim is against
this branch's own base, which is the correct claim for render-only work.

**State.** Every step gated: tsc + build clean, **731/731**, fingerprint
`57b0bdab…c673` unchanged at every single commit, all 52 3D visual checks green
(they were 2 red when the session started — both stale assertions, both fixed).

**What the user has actually SEEN and approved:** the F0 style pick (toy,
daylight, night switchable) and the F1 scale. Everything from F2 on has been
reported with screenshots but not play-tested. F-DIRECTION's rule stands — the
user's eyes are the only valid judge, so treat F2–F7 as provisional until they
play it.

**Three findings that outlived their steps** (all now codified in
[`../F-DIRECTION.md`](../F-DIRECTION.md)): the game shipped for months with
three's default `NoToneMapping`; particle blending is a STYLE choice, not a
constant, and additive FX die in daylight; and a `THREE.Points` column can
render nothing here with a clean console and an all-green scene-graph probe
while a near-identical Points effect works — prefer Sprites for billboard FX.

**Open, in the order I'd take them:** procedural animation polish (F2 changed
the bodies; the amplitudes were tuned for the old ones) · ball SPIN cue (F4
did trail and height only) · goal-moment CAMERA (F7 did FX only — live goals
still get no camera response, `cameraForEvent('goal')` is replay-only) · post
(tilt-shift/vignette; deferred three times on readability risk — it must not
touch the play area and should be gated to High) · sky gradient (low priority
now the bowl encloses the frame).

Track F rules: everything in Track D's rules applies verbatim, plus:
procedural-first (geometry/materials/textures generated in code — no binary
asset pipeline unless the user rules otherwise at F0); one lever per step;
PlayerShowcase is the review stage for any player-model change; never
displaces a Track E slot.

## Self-drive protocol (2026-07-24, user-delegated)

Roles: **user** = play-test authority + final say on anything live/visible;
**commander** = the planning-grade session (Fable) that drafts every contract
and redraws the map on FAIL; **executor** = the session running one step.

The executor SELF-DRIVES — after landing a step it proceeds to the next READY
step in queue order (currently `A2 → B1 → C1-Phase0`) — as long as the step
ended on the green path: verdict PASS (or the step's defined report-back),
all red lines held, result + status pushed.

The executor STOPS and reports (to the commander via the user) when:

1. **any verdict other than PASS** — FAIL / CHANNEL-INVALID / cadence
   finding / §2-band break: authority has been reshaped; only the commander
   drafts what follows;
2. **the next step has no contract** (TBD rows) — executors never author or
   modify a pre-registration, ever;
3. **a hard escalation trigger fires** (contract-specific list: src/** seems
   to need changing, gate values look wrong after results, determinism
   unrestorable, acceptance/seed shortfall, fingerprint drift);
4. **a designed report-back is reached** (e.g. C1 Phase 0 answers) — that
   report goes to the commander before any code;
5. **a user-gate is reached** — B1 render acceptance and any live-gameplay
   ship/revert (C1 Phase 2) belong to the USER's eyes, never delegated.

★ semantics under self-drive: the user's standing delegation lets the
commander ratify routine experiment forks (A2-style: same family, gates
inherited, dormant-only). The user personally keeps: opening the selection/
ecology wall (A3 and beyond), anything that ships into the live game, and
anything that changes what they watch.

Reporting medium = the repo itself (frozen result sections + this file's
status column + ROADMAP blocks) plus the executor's final message. One step
per commit-pair; never two experiments in flight at once.

### Autonomous mode (2026-07-24, Fable-grade executor)

The user may hand this programme to a single strong session (Opus 5 /
Fable-grade) that holds BOTH roles — executor and working commander. Under
autonomous mode that session may additionally:

* **draft new contracts**, but only within the existing tracks and under the
  full pre-registration discipline: the contract commits with frozen gates
  BEFORE any implementation (two-commit pattern), gate values derive from
  banked numbers or prior contracts with stated reasoning, stop rules bind,
  and nothing is ever tuned after first sight of results;
* **redraw after honest FAILs** the way the commander has — including
  rejecting a doomed re-pose on a prior experiment's own anatomy (the
  D-ROTATE lesson: read the closed experiment's stop rule and failure
  diagnosis BEFORE proposing its successor);
* **judge C-track Phase-0 report-backs** against the C-track template.

It still STOPS for the user on: anything that ships into the live game
(§2-band changes, fingerprint-moving merges, play-test acceptance),
opening the selection/ecology wall, restructuring or abandoning a track,
and everything marked LOCKED here or in UI-NORTHSTAR. Doc discipline is
unchanged: every session starts by reading this file top to bottom, ends by
updating it, and the authority chain (contract docs + ROADMAP +
WORLD-MODEL-NEXT-AUTHORITY) remains the single source of truth.

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

## Sequence at a glance

```text
now ──► A1 (1MG) ──► A2 draft ★ ──► A2 ──► A3 ★ (decision wall, attempt 4)
   └──► B1 (sandbox, parallel) ──► B2 play-feel
   └──► C1 ★ (pass power, lands between A-steps) ──► C2 ★ ──► (C3 emerges)
```

The visible-payoff promise this programme makes: B1 within days; the first
surviving live perception consumer = A-chain × C-chain convergence, weeks;
emergent deception/tactics = after the decision wall falls, months. If any
wall resists three more contracts, the fork returns to the user rather than
grinding the same family.
