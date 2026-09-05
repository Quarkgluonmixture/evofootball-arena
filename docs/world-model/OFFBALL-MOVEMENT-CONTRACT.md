# OBM — 无球移动席位 (THE OFF-BALL MOVEMENT CONTRACT: 前插与回撤是同一个选择)

> Drafted by the commander 2026-08-10 under ruling #227 (the user's reframe after
> CTB-T1's F-CTB-a: off-ball movement is ONE perceived-situation choice, not two
> mechanisms). Absorbs the CHECK-TO-BALL contract's deferred dynamic slice and the
> #222.6(乙') support-percept surgery. The banked CTB plane genes (#224) are this
> seat's geometry vocabulary. Binding once the embedded §6/§7 audits are ruled.

## §0 The findings this contract answers

1. **CTB-T1 (#226, F-CTB-a)**: the 2D plane delivers geometry totally (97 %
   behind-ball at the check corner) but STATIC repositioning moves NO supply
   quantity — parked bodies feed the interception economy (+1.8…+3.2/match
   resolved at every depth dose) and drag markers into the build-up zone.
   H-CTB-T1a: **the missing dimension is WHEN, not WHERE.**
2. **The code map (this ruling's §0 facts, `src/ai/PlayerBrain.ts:1226-1298`)**:
   the off-ball attack decision reads NO percepts — `SupportBallCarrier` scores
   on TRUTH distance + hand role/mode constants; **前插 (`MakeRun`) is not the
   body's choice at all** — it is a top-down LICENSE (`team.runners`,
   `overlapper`, `arriver`, `wallRun`); `MoveToFormationSpot` is the default.
   The defence has the station eye; the attacking off-ball body has NO EYES.
3. **O2-T1 (#222)**: the carrier's look works, but "you cannot see support that
   does not exist" — and the receiver side never looks at all. The support
   percept feature is half-blind (59 % agreement) partly because there is no
   receiver policy generating readable support.
4. **CTB-T1's saturation decode (#225.3(b))**: raw proximity is ~94.5 %
   saturated — scarcity lives in SAFE support. Safety is a function of
   opponents and timing, exactly the features today's decision never reads.

The user's anchor, verbatim (2026-08-10, ruled into VISION §3):

> 其实我思考了下,这个回撤其实和跑位是一样的,前插和回撤在我们的系统里,都应该是
> 球员的可选择性,并且不止是说仅仅看队友位置,还有时机,对手位置等等,这些都感知后
> (像人眼一样获得数据)然后通过进化就决定了他们是怎么走的

## §1 The claim (H-OBM)

Giving the off-ball attacker a PERCEPT-FED, GENE-WEIGHTED movement policy — one
seat where 前插, 回撤, width-holding and shape-keeping are expressions of ONE
evolved weighting over the situation he can SEE (teammates, opponents, the
carrier's plight, the freshness of his own information) — un-blocks the
receiver-side supply that static geometry could not move: TRUE-holdable supply
and pressed-first-reception move at exam grain, and the #218 constructed /
scramble shares move at arc grain, without re-importing the interception /
clump / offside diseases.

## §2 Mechanism (M-OBM, dormant behind its own explicit flag)

* **M-OBM.1 — the SEAT, on today's decision surface.** Slice one modulates the
  EXISTING candidate triplet of the off-ball attacker (`SupportBallCarrier`
  score + target · `MakeRun` score for ALREADY-LICENSED bodies · the implicit
  preference against `MoveToFormationSpot`) — no new action type, no new actor,
  assignment/licensing untouched (M-OBM.4). Born incumbent-equivalent: genes
  absent ⇒ today's scores and targets byte-identical.
* **M-OBM.2 — the EYES (像人眼一样获得数据; VISION §1 感知诚实).** Every input
  is the body's OWN `perceivedSnapshot` (the E3R2 recorder trunk: cone on his
  own heading, range by awareness, keyed noise, staleness — the same honesty
  rules the whether-seat and the look seam obey). NO truth scans, NO new
  information channel, no omniscience. The slice-one FEATURE FAMILIES, each a
  continuous quantity computed from percepts he already owns, constants traced
  at T0 (#202 form, never typed):
  - **f1 the carrier's plight** — perceived opponents closing his perceived
    carrier (the pressure-radius family the whether-eye already prices);
  - **f2 his own marker** — nearest perceived opponent's distance/goal-side-ness
    to himself;
  - **f3 space at the candidate spot** — nearest perceived opponent to the
    candidate target;
  - **f4 timing** — the AGE of his own readings (staleness is data; a body with
    stale eyes should behave differently, and that difference is evolvable).
  The families are named as slice-one BOUNDS (an honest scope, not an exhaustive
  feature list — the #91-form audit forbids pretending completeness).
* **M-OBM.3 — the POLICY (weights evolve; NO predicates, #200).** Genes, born
  absent and outside GENE_KEYS behind one explicit `evolveOffballMovement`
  opt-in, weight feature→output contributions: outputs are (i) the position on
  the BANKED CTB PLANE (the depth/width axes become perceived-situation-driven
  instead of static — the #224 limb is this seat's vocabulary, not a rival);
  (ii) continuous modulation of the `SupportBallCarrier` and licensed-`MakeRun`
  candidate SCORES. Everything is weight × continuous feature; the complete
  conditional set = gate/guard/zero/cap. 前插-vs-回撤 is never written anywhere
  — it is where the evolved weights put a body when f1 rises and f2 loosens.
* **M-OBM.4 — untouched.** TeamBrain designation (runners/overlapper/arriver/
  restDefence), pass selection, the carrier's own seats (C5/C7/O1/O2), the
  certified price table, assignMarks and the whole defensive trunk, per-body
  gene heterogeneity (the S2 lesson: later slice). The percept-pull cost is
  bounded at T0 from the existing cadence laws (the scan clock / AI_INTERVAL
  families) — the seat reads at the body's existing decision cadence, armed
  worlds only.

## §3 Instruments & gates (the arc)

* **OBM-T0 — seat dormant.** The full #181.2 stack (byte-identity, fingerprint,
  RNG-stream, born-equivalence GATED, arming checklist = flag +
  `evolveOffballMovement` + non-absent genes ALL, single read-fork inventory,
  pin inventory incl. the CTB plane tests); the §LAW freezes the feature
  constants + weight bounds with traces; percept-pull cost bounded and measured.
* **OBM-T1 — the POLICY EXAM.** The CTB-T1 instrument set INHERITED WHOLE (the
  probe, ruler, guards, genealogy lift, N rule — all banked and twice-verified):
  hand-dosed policy corners (e.g. check-when-pressed weighting vs run-when-line-
  high weighting vs zero) on the SAME ruler — success = a policy dose moves
  ruler 1 or 2 resolvedly helpful with that dose's guards held (the #225.3(c)
  per-dose granularity verbatim). Pre-named: **F-OBM-a** no policy dose moves
  the supply (the receiver-side program itself is re-examined — the arc's
  honest death branch); **F-OBM-b/c** = F-CTB-b/c verbatim (clump/interception ·
  offside/health).
* **OBM-T2 — CO-EVOLUTION: ⭐ the user's OPEN hypothesis, finally on its true
  object.** "现实里会进化出回撤" re-registered here ex ante: with the BEHAVIOR
  expressible (a policy, not a parked fan), attack-side selection ENGAGES via
  goals (the Phase 30.5 receipt; the MT-T2 instrument set verbatim: win-only
  fitness, neutral-drift shadow, fitness–gene correlation, checkpoint/resume).
  Outcomes as MT-T2: (i) engages ⇒ selection sets the weights, play-test entry;
  (ii) indifferent ⇒ honest UNSUPPORTED + hand-dose returns + the VISION §3
  soft-spot ledger; (iii) pathological corner ⇒ substrate finding.
* **Exit** = the user's play-test (回撤和前插看得见吗 — movement choices are
  readable motion), keep/change/revert per lever.

## §4 Non-claims

No new action types, no assignment/licensing change, no pass-selection change,
no carrier change, no per-body genes (later slice), no coach rungs, no offside
work, no render cue at T0. The CTB plane genes stay as banked (#224) — this
contract DRIVES them, it does not re-cut them. Nothing ships without the
play-test verdict.

## §5 Sequencing

OBM-T0 dispatches on the next "go". The CHECK-TO-BALL contract's own deferred
"dynamic account" slice is ABSORBED here of record (its narrow form — one
hand-chosen feature — is strictly contained in M-OBM.2/M-OBM.3); CTB-T2 as
originally scoped does not run. 丙 (progression value) stays behind this arc
per #219.

## §6 VISION audit record (the #91 form, clause-by-clause at drafting)

* **vs §1 感知诚实 (像人眼一样获得数据 — the user's own words)**: every input
  is the body's own percept snapshot under the standing honesty rules; f4 makes
  staleness itself a policy input rather than a hidden defect. NO truth reads.
  PASS.
* **vs §1 底座给能力,不替球队定行为**: the seat is a capability (eyes + a
  weighting); WHERE a body goes is the evolved weights' business; 前插/回撤 are
  never named in code. PASS.
* **vs the #200 red line**: no predicates — features are continuous, weights
  are genes, the conditional set is gate/guard/zero/cap. PASS.
* **vs §2 watchability**: movement choices are the MOST readable behavior in
  football; the play-test exit question is exactly 看得见吗. PASS.
* **vs §3.1 the missing seats**: this is the receiver-side seat the F-O2a
  decode demanded (座2 sees; this seat makes there be something to see) — and
  it is the attack-side symmetric of the station eye. PASS.
* **vs emergence (capability-not-mandate)**: born absent; instruments dose;
  ships never do; selection or the user's eyes decide. PASS.
* Amendments produced: none.

## §7 REALITY audit record (the #201 standing rule)

* **Real off-ball movement is one skill** — coaches teach "movement off the
  ball": check short, spin in behind, hold width, drop between lines — one
  decision space read off the same scan (marker's blind side, carrier's
  plight, the line's height). The user's unification is how the real thing is
  actually structured. PASS.
* **Real players' movement inputs are exactly f1–f4**: the pressing trap on
  the carrier, the marker's attention, the pocket of space, and whether your
  picture of it is current (scanning frequency correlates with elite receiving
  — the timing IS the skill). PASS.
* **Real 前插 is also the runner's choice** within the team's structure — a
  license without the run is nothing; today's engine has the license but not
  the choice. This slice restores the choice half; the license half stays
  (M-OBM.4), which mirrors real coaching (patterns licensed, decisions owned).
  PASS.
* **Honest gaps, named**: (a) slice one modulates EXISTING candidates only —
  an unlicensed body still cannot originate a run (the license absorption is a
  later slice); (b) the receiver does not YET spend time to look (the O2 look
  is the carrier's; an off-ball look action is future work — f4 prices stale
  eyes but cannot refresh them); (c) coordination between two movers (one
  checks, one spins — the third-man geometry) is emergent-or-absent, not
  built; the E4 value question stays 丙's.

## STATUS

* **#390 (2026-09-05) — STAGE-STOPPED at LN-T1, BANKED-DORMANT, HELD, with a LABELLED POSITIVE.**
  The exam record: OBM-T1 (#230) F-OBM-a — no policy corner moved the supply rulers; guard-clean;
  `spacingUnder4` DOWN resolved at MARKER-ESCAPE and KITCHEN-SINK. LN-T1 (#389 item 4 / #390 item 2)
  on world 13's empty-book composition, `obmMovement` ALONE (`ctbSupportPlane` never passed): 撞车
  `crowd.crashShare` DOWN resolved at MARKER-ESCAPE only (−0.012779 [−0.018640, −0.007265] on
  0.469990); the visible carom `firstBody.ownNonTarget` unmoved at every corner; no guard or band
  breach; `context.passCompletion` DOWN resolved on all three corners inside tolerance. READ 2 of
  record: *"THE EYES THIN THE CROWD BUT THE CAROM STANDS."* NO ENTRY (#390 item 3(i)); the dose
  space is selection's — the user's 「现实里会进化出回撤」 hypothesis stays OPEN (third time) attached to
  a future OBM-T2. Nothing ships; the flag stays default OFF; the fingerprint unchanged.
