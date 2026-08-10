# PTP — 传球到路 (THE PASS-TO-PATH CONTRACT: the carrier's sight of moving receivers)

> Drafted by the commander 2026-08-11 under ruling #231 (the user's substrate
> census: the missing layer is RELATIONAL — 动作之间的互相看见). Child of the
> build-up arc; sibling of OFFBALL-MOVEMENT (#227): OBM gave the receiver eyes;
> this gives the PASSER sight of the receiver's motion. Binding once the
> embedded §6/§7 audits are ruled.

## §0 The findings this slice answers

1. **The code fact (`src/ai/PlayerBrain.ts:395-500`, mapped at #231)**: lead
   pricing exists ONLY for license holders — the through-ball loop opens with
   `if (mate.action.type !== 'MakeRun') continue`, and its aim point is the
   `runBurstPoint` projection ("meet the run, not the hover", Phase 29).
   `SupportBallCarrier` receivers — which includes EVERY movement the banked
   OBM seat drives — are priced by the ordinary pass loop at their CURRENT
   position (to feet), always. **The ball goes where bodies ARE, never where
   support is GOING.**
2. **The two nulls this explains (#226, #230)**: static repositioning (CTB-T1)
   and clean situational movement (OBM-T1) both left every supply ruler flat —
   because the pass model prices both identically (the standing spot). Movement
   cannot be cashed by a chooser that cannot see it.
3. **The corroborating sliver (#230.4)**: the ONLY battery signal
   (constructedGe5 at CHECK-AND-SHOW, boundary-resolved) came from the one arm
   that dosed the SCORE channel — the single existing conduit from movement
   into the pass model. The signal leaked through the only crack in the wall.
4. **The user's census verdict, verbatim (2026-08-11, VISION §3)**:
   > 我感觉是不是我们的底座还是不够多?,按照真实的现实球员整体看下
   The audit's answer: the per-body action library is largely complete; the
   RELATIONAL layer is missing. This slice builds its first limb.

## §1 The claim (H-PTP)

Giving the carrier's pass model SIGHT of a support-mode receiver's motion — an
aim-point projection priced through the EXISTING chooser, gene-weighted, born
absent — opens the value channel the movement arcs lacked. With the channel
open, receiver movement can change reception outcomes: at exam grain the supply
rulers AND the #218 shares move in the combined cell (movement × lead) where
each alone moved nothing; the #230 boundary signal is confirmed or killed under
a design built to kill it.

## §2 Mechanism (M-PTP, dormant behind its own explicit flag)

* **M-PTP.1 — the PROJECTION (the runBurstPoint idiom, extended to support).**
  For a support-mode mate, the chooser prices an AIM POINT projected along the
  mate's motion over the pass flight time, exactly as the through-ball path
  already does for licensed runners — same flight arithmetic family, constants
  traced, never re-derived. **Information honesty (the binding rule)**: the
  projection consumes ONLY the position source the chooser ALREADY uses in
  that world (truth in the bare world, the perceived snapshot in
  percept-armed worlds — the incumbent `edsPerceivedChoice` fork's own rule);
  motion is inferred from that same source's own history/fields, never from a
  new channel, never truth-through-a-percept-door. T0 traces what the source
  honestly exposes (remembered frames / velocity fields) and freezes the
  inference form; if the percept layer exposes NO honest motion, the T0 answer
  is the staleness-degraded fallback stated plainly — never a truth read.
* **M-PTP.2 — the GENE (born absent).** One team-level gene `passLeadSupport`
  ∈ [0, 1], outside GENE_KEYS, behind explicit `evolvePassLeadSupport`: the
  aim point = mate.pos + gene · (projected displacement). 0 = to-feet =
  today's arithmetic EXACTLY (the zero-point identity, arithmetic-exact).
  EXECUTION follows pricing: a pass chosen against a led point is AIMED at
  that point (the through-ball execution machinery reused, not duplicated).
  The scoring inputs (lane, open, gain) are evaluated at the led point — the
  chooser sees the pass it would actually play.
* **M-PTP.3 — NO predicates (#200).** The lead is unconditional geometry ×
  gene; no "if checking then lead" — a stationary mate's projection IS his
  standing spot (displacement ≈ 0), so to-feet emerges where motion is absent.
  The complete conditional set = gate/guard/zero/cap.
* **M-PTP.4 — untouched.** The `MakeRun` through-ball path byte-identical (its
  own license world is not this slice's business); the whether seat and the
  certified price table; the OBM seat's own law; TeamBrain designation;
  defensive trunk. Consumption flag `ptpPassLead` hard-false, never
  bundle-defaulted; arming = flag + opt-in + non-absent gene (+ nothing else —
  the projection's information source is the chooser's own, world-appropriate
  in both world shapes).

## §3 Instruments & gates (the arc)

* **PTP-T0 — mechanism dormant.** The full #181.2 stack (byte-identity ×
  fingerprint × RNG × born-equivalence × zero-point arithmetic-exact ×
  read-fork inventory × pin inventory incl. the through-ball and OBM tests);
  ⭐ G-EPI-MOTION: in a percept world, the projection's motion estimate must
  derive from the percept source (a truth/percept-diverging fixture, the
  OBM-T0 G-EPI form); the two-doors lesson (#228) gated from birth: arming
  `ptpPassLead` alone must not express any OTHER seam's genes (G-CROSS form
  vs the OBM and CTB doors).
* **PTP-T1 — THE FULL-CHANNEL EXAM (the decisive test; the #230.5(甲)
  confirmatory design FOLDED IN).** The OBM-T1 battery form re-run with a
  2×2+ arm set: ABSENT · ARMED-ZERO(s) · OBM CHECK-AND-SHOW alone (the #230
  cell reproduced) · PTP lead alone · ⭐ COMBINED (CHECK-AND-SHOW × lead) ·
  the lead-dose corner(s). PRE-REGISTERED PRIMARY, two-tier: (i) the supply
  rulers 1+2 (inherited verbatim, the CTB/OBM chain); (ii) ⭐ the #218 shares
  at the COMBINED cell (constructedGe5 + scramble — H-OBM-T1a's confirmatory
  primary, sized so the #230 boundary signal is decisively confirmed or
  killed). Guards + per-dose STOP granularity inherited verbatim. Pre-named:
  **F-PTP-a** the combined cell moves nothing (the relational-layer hypothesis
  itself takes the hit — the arc's honest death branch, and H-OBM-T1a dies
  with it); **F-PTP-b/c** = the inherited guard/pathology STOPs (interception
  economy fed by led passes into traffic is the named risk — a led pass is a
  through-ball-shaped gamble and the chooser must price it, not be subsidized).
* **PTP-T2 — co-evolution**: `evolvePassLeadSupport` + `evolveOffballMovement`
  co-armed (the passer's trust and the receiver's movement evolve TOGETHER —
  the relational pair is the unit of selection); ⭐ the user's twice-open
  hypothesis re-registers here (third registration, its truest object yet:
  回撤 pays only when someone passes to it). The MT-T2 instrument set
  verbatim.
* **Exit** = the play-test (传球提前量看得见吗 — a led pass into a checking
  receiver is READABLE football), keep/change/revert per lever.

## §4 Non-claims

No new pass types (the lead deforms the existing pass's aim, the through-ball
stays licensed); no receiver-side change (OBM's law untouched); no price-table
change (丙's business — the E4 value question stays queued behind this arc);
no license origination; no communication channel (要球 as a SIGNAL is a later
limb; the score-mod conduit stays as-is). Nothing ships without the play-test
verdict.

## §5 Sequencing

PTP-T0 dispatches under the live self-drive (#231). 丙 (progression value)
stays behind this arc per #219/#231. The #230.5 fork is DISPOSED by this
contract: (甲 confirmatory) is folded into PTP-T1's two-tier primary; (乙
T2-override) is superseded by PTP-T2's co-armed design.

## §6 VISION audit record (the #91 form)

* **vs §1 感知诚实**: the projection consumes the chooser's OWN world-
  appropriate source; motion inference traced at T0; no new channel, no truth
  door in percept worlds (G-EPI-MOTION gates it). PASS.
* **vs §1 底座给能力**: the limb is SIGHT + a trust gene; whether to lead, how
  much, to whom — the weights' business. 不写"回撤就领它"。PASS.
* **vs the #200 red line**: unconditional geometry × gene; a still mate's led
  point degenerates to his feet — to-feet EMERGES, it is not predicated. PASS.
* **vs §2 watchability**: a pass played into a teammate's stride is among the
  most readable acts in football. PASS.
* **vs §3.1/§3.3**: this is the relational layer the census named; it is also
  E4's "真实回传是持球引人之后的选择" seen from the passer's side. PASS.
* **vs emergence**: born absent; instruments dose; PTP-T2 selects the PAIR.
  PASS. Amendments: none.

## §7 REALITY audit record (the #201 standing rule)

* **Real passers pass to where the receiver will be** — coaching's first
  passing lesson ("play it in front of him"); to-feet vs to-path is an actual
  taught distinction, and elite passers are separated by exactly this. PASS.
* **The relational pair is the real unit**: a check nobody passes to is a
  wasted run; a lead nobody makes is a turnover — real 默契 is the CO-tuned
  pair, which is what PTP-T2 co-arms. PASS.
* **The named risk is real football too**: leading into traffic is how
  interceptions happen; the guard set prices it and F-PTP-b watches it. PASS.
* **Honest gaps, named**: (a) motion inference from percepts is bounded by
  what the eyes honestly carry — a stale reading leads badly, and that
  degradation is the DESIGN, not a defect; (b) the receiver still cannot
  signal (要球 as communication is a later limb); (c) timing co-ordination
  finer than flight-time projection (the give-and-go's rhythm) stays
  emergent-or-absent.
