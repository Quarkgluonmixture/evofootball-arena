# 甲 — 位置是活的:防守相位调制 (THE PHASE-MODULATION CONTRACT, slice one: defensive lateral convergence)

> Drafted by the commander 2026-08-08 under rulings #188.3(甲) / #189.4 / #191.2
> (the user's 丙→乙→甲 sequencing; the corrected
> [`MARK-SELECTION-CODE-MAP.md`](MARK-SELECTION-CODE-MAP.md) banked #191).
> VISION anchor: §1 位置是活的 — 形势调制本体论 (the user's words, 2026-08-08).
> Binding once the embedded §6 VISION audit is ruled.

## §0 The finding this slice answers

1. **The station field NEVER asks the weak-side back to compress** — #188.2(b),
   H-186a(i) CONFIRMED: the defensive send target sits **18–20 m off the ball's
   lane** vs the 9 m spacing (cm-wide CIs, ALL four worlds;
   [`FARSIDE-DEFENDER-FORENSIC.md`](FARSIDE-DEFENDER-FORENSIC.md)).
2. **Why, in code** (the corrected map): out of possession the ONLY lateral
   ball-side term in the emergent station is a **COMMON translation**
   ([`formations.ts:292-296`](../../src/ai/formations.ts#L292)) — the same
   offset for every body, order- and gap-preserving by construction; the width
   squeeze ([`:282-284`](../../src/ai/formations.ts#L282)) shrinks lane anchors
   toward **y = 0**, not toward the ball's lane; solidity
   ([`:349-353`](../../src/ai/formations.ts#L349)) pulls central; anti-clump
   ([`:326-343`](../../src/ai/formations.ts#L326)) actively maintains ≥9 m-ish
   separation. **No per-body freedom to compress toward the ball's lane exists
   anywhere in the defensive station.**
3. **Substrate defect, not selection gap** (the maxed-genome criterion, analytic
   from the map's corrected §2.1.4 bands): at `defensiveCompactness = 1` the
   far-flank anchor is `0.6 × 20.3 × 0.55 ≈ 6.7 m` and the common shift maxes at
   `0.43 × |ball.y|`, so against a flank lane (|ball.y| ≈ 14) the ask still sits
   **≈14–15 m off the lane** — no genome can express the compression (zonal
   floors `widthMul` at 0.95 ⇒ ≈19–20 m). The measured 18–20 m at evolved
   genomes is the same fact at equilibrium.
4. **The architecture froze this choice by HAND**: the
   [`:292-294`](../../src/ai/formations.ts#L292) comment rejects per-body
   convergence outright ("do NOT converge each man onto ball.y — the first
   B1-a cut did, halving spreadY"). Keep-width-vs-compress was decided by the
   architect, once, for every team — exactly the class of hand choice VISION
   says must become a gene axis. Note the same comment already NAMES the
   intended tradeoff as emergent ("a team that commits… leaves a weak side —
   which width/switches then punish"); the compression half of that axis was
   never given a knob. The **legacy table path had one**
   ([`:209`](../../src/ai/formations.ts#L209): a per-body convergence at weight
   `defensiveCompactness × 0.25`) — the emergent rewrite dropped it.
5. **The user's ontology** (VISION §1 位置是活的, verbatim-anchored 2026-08-08):
   共识是粗的,执行是活的 — 住址先验给"该往哪走"的默契,实际站位被 **球权相位 ×
   对手形状 × 场上形势** 调制:攻→前压/过载集中,**守→向球侧压缩/弱侧收窄**;教练
   影响属后续档,**但调制自由度是底座义务**,强弱/方向应可被基因表达。(Depth
   already has an opponent term — B2, [`:304-313`](../../src/ai/formations.ts#L304);
   the LATERAL opponent-shape half is a later slice.)
6. **Boundary honesty**: on prod the weak-side body spends **82 % of trigger
   ticks in `MarkOpponent`**, glued 1.8 m to his mark — a SEPARATE channel this
   contract does not touch (the 乙 fork, #192.2). This slice fixes the **ASK**;
   whether the mark lets the body **ANSWER** is measured, not assumed (F-PM-a).

## §1 The claim (H-PM)

Giving the defensive phase a **per-body, gene-expressed lateral convergence
toward the ball's lane** — born absent, ONE strength knob, no role gates, no
scenario triggers — lets the station field ask the weak side to compress: at
forced doses the send-target lane gap falls resolvedly from the 18–20 m band
toward the 9 m spacing, with 弱侧收窄 emerging from geometry (far bodies move
more metres under the same affine contraction) rather than from any hand-written
weak-side rule — WITHOUT re-importing the B1-a collapse (spreadY / spacing /
dupRun non-inferior at frozen tolerances) and WITHOUT touching mark assignment,
restart machinery, the attacking phase, or the A4 home prior.

## §2 Mechanism (M-PM, dormant behind its own explicit opt-in)

* **M-PM.1 — the term.** In the defensive-phase branch of the emergent station,
  composing AFTER the existing width and common-translation terms (replacing
  neither), each outfield body's lateral station converges toward the ball's
  lane: `y += (ball.pos.y − y) · k_PM`. `k_PM` = the expression of ONE new
  tactical gene (working name `defLaneConvergence`; final name at PM-T0 within
  these semantics), **born ABSENT** (absent ⇒ `k_PM = 0` ⇒ byte-identical world
  — the S2-P2 birth form, [`genome.ts`](../../src/evolution/genome.ts) optional
  key NOT in `GENE_KEYS`, own explicit opt-in, draw-sequence discipline).
  Bounds frozen at the stage doc from the traced constant family (the legacy
  convergence weight ≤ 0.25 at `:209` is the natural neighbour; the anti-clump
  repulsion ±7 m is the structural spacing floor). An affine contraction with
  `k_PM < 1` preserves lateral ORDER; it shrinks gaps — anti-clump and the
  frozen guards price whether that collapses anything. No role gating, no
  per-body offsets in slice one (offsets = a later slice, the A4-S2 precedent).
* **M-PM.2 — the phase gate.** Live open play, out of possession only
  (`hasBall === false`, match in `playing`). Restart-pending / frozen states
  keep the unmodulated station — otherwise `shapeReady`, the onside clamp and
  the restart gates would wait for bodies near stations the walkers no longer
  walk to (a stall trap priced at PM-T0 by trace, not discovered at PM-T2).
* **M-PM.3 — fork the READ (#35.3 binding).** The modulated value serves
  **body-movement reads only**: the `MoveToFormationSpot`/`HoldPosition` walk
  target ([`actionExecutor.ts:135`](../../src/ai/actionExecutor.ts#L135)) and
  the marker's no-target fallback ([`:323`](../../src/ai/actionExecutor.ts#L323)).
  Assignment / gate / clamp reads keep the unmodulated station — explicitly:
  `assignMarks`' zonal zone centres
  ([`TeamBrain.ts:479`](../../src/ai/TeamBrain.ts#L479)) are NOT modulated in
  this slice (modulating them changes mark assignment = 乙's surface; a NAMED
  later fork), and the trap hold line, onside clamp, `shapeReady` and
  `supportSpot` are untouched (`supportSpot` is in-possession — excluded by
  M-PM.2's gate by construction). PM-T0's deliverable includes the enumerated
  read table (mover vs gate), per the map §4 S6.
* **M-PM.4 — perception honesty.** The term reads `ball.pos.y` — already a
  station input on the adjacent line ([`:296`](../../src/ai/formations.ts#L296));
  no new perception channel, no opponent mind-reading, no omniscience.
* **M-PM.5 — what is NOT built.** No attacking-phase modulation (前压/过载 =
  this arc's second slice, its own contract). No lateral opponent-shape term.
  No coach layer. No mark-selection change. No station-eye / A4-home change
  (the armed worlds' eye stays as-is; the interaction is a measured dimension,
  not a designed one).

## §3 Instruments & gates (the arc)

* **PM-T0 — dormant seam.** Gene born absent behind an explicit
  `evolveDefLaneConvergence`-style opt-in (own named boolean per #75; never
  bundle-defaulted); flag-off byte-identity + fingerprint; RNG-stream identity
  if any draw is added (the #181.2 receipt rule); the M-PM.3 read table traced
  and published; the M-PM.2 restart-gate trace.
* **PM-T1 — the COMPRESSION EXAM** (forced doses on frozen seeds, the
  grant/dose instrument family; dose vectors are measurement forks, never
  shipped content). Pre-registered success = **the ASK moves**: send-target
  lane gap falls resolvedly (CI excluding zero) and dose-responsively toward
  the spacing floor. **The ANSWER is measured separately** (body lane gap /
  detachment — the #188 instruments re-run). Guards at frozen tolerances:
  spreadY (the B1-a metric, named in the code comment this contract un-freezes),
  spacing / dupRun non-inferiority (the S2 form), and the #157 instrument debt
  (offside flag, foul counter, E4 combo counters) rides every battery.
  REPORTED (not gated): mark-assignment drift (far-side share, `markShare`) via
  the positional-feedback channel (map §2.4) — `assignMarks` reads `p.pos`, so
  compressed bodies re-rank nearest-body claims; that drift must be visible and
  attributed, not designed away.
* **Pre-named FAILs.** **F-PM-a** — the ask moves but the body does not (the
  mark-stance ticks swallow the compression; the swallowed share quantified):
  STOP; the result returns to the 乙 fork WITH numbers — the narrow mark fix
  re-enters as the evidence-backed next step. **F-PM-b** — the clump re-imports
  (spreadY / spacing blow the frozen tolerance at every dose that moves the
  ask — the B1-a collapse reproduced): STOP; the dimension is wrong, not the
  dose.
* **PM-T2 — live A/B** (evolution allowed to move the gene via the opt-in):
  equilibrium bands inherited verbatim; the E4 reported dimensions (forward
  share, combo counters, shots, chain length); shots-conceded + league shot
  volume (the Phase-30 direction instruments, map §5 trap 1).
* **Exit** = the user's play-test (防守知道往哪走了吗 · 弱侧后卫还乱转吗 ·
  紧凑像球还是像堆), keep/change/revert per lever; a play-test world entry per
  the #168/#185 precedent.

## §4 Non-claims

This slice does not claim to fix 乱转 by itself (the mark channel owns 82 % of
the trigger ticks on prod — the 乙 decision's business). It does not touch the
mark-vs-shape price (`markBase` vs the 0.42 literal). It does not make the A4
home phase-aware (the home prior is untouched; if H-PM passes, "phase-aware
home" becomes a cheap later amendment measured against this slice). It does not
rank or fix the release table (map §2.2). Nothing ships without the play-test
verdict — Road B binds: flags dormant, fingerprint unchanged.

## §5 Sequencing

O2-T0 is the next dispatch (the #189.4 / #191.2 promise; one writer per tree).
PM-T0 dispatches after it, subject to the user's 乙 ruling (#192.2): a narrow
mark fix, if ruled, inserts with its own contract, and the
`formations.test.ts:143-156` pin renegotiation rides whichever step first
touches marking behaviour (this slice does not).

## §6 VISION audit record (the #91 form, clause-by-clause at drafting)

* **vs §1 位置是活的 (the anchor itself)**: this IS the substrate half —
  modulation freedom as 底座义务; strength gene-expressed; 守→向球侧压缩/弱侧
  收窄 delivered as capability, not behaviour. PASS.
* **vs §1 涌现纪律 / 污染边界 (capability-not-mandate; hand-built = dimensions
  only)**: no formation table, no role gate, no scenario trigger; a hand-frozen
  architectural constant ("keep width", `:292-294`) becomes an evolvable axis;
  the DIMENSION (phase-gated lane convergence) is hand-built and the WEIGHT is
  evolved — the exact 诚实张力 split VISION states (涌现的是权重,不是维度本身).
  The dimension choice itself is anchored on the user's verbatim ontology, not
  the commander's taste. PASS.
* **vs the B1-a failure record (§2 watchability debt)**: the historical
  collapse (spreadY halved) is priced, not ignored — F-PM-b carries its exact
  metric; anti-clump now exists where the first B1-a cut had none. PASS.
* **vs BIRTH-NEUTRALITY (the A4-S2 precedent)**: born absent, own opt-in,
  byte-identity + RNG-stream identity gates at PM-T0. PASS.
* **vs #35.3 (fork the read, never the function)**: mover reads modulated;
  gate/assignment reads enumerated and untouched; the zone-centre exclusion is
  the explicit 甲/乙 boundary. PASS.
* **vs §1 感知诚实**: reads `ball.pos.y` only — an input the station already
  consumes; no new channel. PASS.
* **vs §3 现实锚点**: real defensive blocks compress toward the ball side and
  tuck the weak-side winger in; the switch-of-play punishing over-compression
  is the real game's own counter — present in-engine (width/switches, the
  `:286-291` comment) so the tradeoff is selectable, not scripted. PASS.
* Amendments produced: **none**.
