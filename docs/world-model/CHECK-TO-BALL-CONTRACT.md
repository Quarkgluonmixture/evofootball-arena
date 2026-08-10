# CTB — 回撤接应 (THE CHECK-TO-BALL CONTRACT: the missing limb of the support seat)

> Drafted by the commander 2026-08-10 under rulings #219 (sequence 甲→乙→丙; this
> is 乙) and #223 (the user's shape amendment: **前后左右轴 — the FULL 2D PLANE**,
> not a front-back axis alone). Inherits the build-up arc's ruler from #218 and
> O2-T1's decode from #222. Binding once the embedded §6/§7 audits are ruled.

## §0 The finding this slice answers

Three instruments and one code fact point at one seat:

1. **The genealogy census (#218)**: the attack has scramble + set-piece factories
   and NO build-up factory (constructed ≥5-pass goals 7.5–9.2%; the median goal
   is born ONE pass from the regain).
2. **The wedge exam (#222, F-O2a fired)**: the look demonstrably refreshes
   perception (E-ABSTAIN-UNSEEN −6.30 pp RESOLVED) but hold classification does
   not move — the freed share converts ENTIRELY to E-ACTNOW-DECLINED, the
   TRUE-holdable supply itself SHRINKS under looks (−0.157 pp RESOLVED), and the
   support feature stays half-blind (59% agreement). **H-O2T1a: holding fails
   for want of HOLDABLE STATE, not information — you cannot see support that
   does not exist.**
3. **The code fact (this ruling's map, `src/ai/formations.ts:604-618`)**: the
   ONLY "support the carrier" positioning is `supportSpot`, and its x-term is
   `ball.x + attackDir · radius · aheadBias` with `aheadBias ∈ {0.75 attack,
   0.35 otherwise}` (a hand ternary, no gene) and `radius = 10 +
   supportDistance·8` (10–18 m). **No genome in the entire evolvable space can
   place a supporter level with or behind the ball.** Laterally, the fan is
   lane-pulled by hard constants (pull 0.75, cap 0.9·radius) — also outside the
   gene space. The off-ball attack repertoire is {ahead-biased fan, runs in
   behind, lane stations}: nothing can move a body TOWARD a pressed carrier.
4. **The historical elasticity receipt (Phase 30.5 comment, same function)**:
   when a first cut parked support 30 m out, "no short options left,
   neutral-genome attacks starved (mirror goals 1.47 → 0.93)" — short-option
   supply is a GOALS-LEVEL signal this world demonstrably feels.

The user's anchors, verbatim (2026-08-10, ruled into VISION §3):

> 回撤接应这个是底座还是写死的?以及这个没人传是不是因为底座缺陷?
> 但是你说,按理来说现实里的人会进化出回撤这个现象的啊
> 前后左右轴

The ontology this fixes into place: **底座 = 身体自由度, 基因 = 倾向, 进化只能在
身体给的自由度里发现用法.** Real football evolved 回撤 culturally on COMPLETE
bodies — players could always run toward the ball; the tactic was a discovered
USE of an existing degree of freedom. Our players' bodies have a hole: the
target-generator menu contains no such direction. **缺一条腿, 不是缺一个习惯.**
This slice restores the limb; it does not teach the habit.

## §1 The claim (H-CTB)

Giving the support seat the missing **2D positional freedom** (前后左右: the
ahead-bias becomes a signed continuous quantity, the lateral fan becomes a
continuous width) — gene-weighted, born absent — lets 接应 EMERGE wherever
selection or dose favors it. At exam grain, success = the RECEIVER-SIDE RULER
moves: the TRUE-holdable supply (the O2-T1 instrument) and support-existence at
pressed moments RISE, the pressed-first-reception share (80.8%, #173) falls —
with the interception/clump guards held. At arc grain (#218): the
constructed-goal share and the scramble share MOVE.

## §2 Mechanism (M-CTB, dormant behind its own explicit flag)

* **M-CTB.1 — the AXIS PAIR (the user's 前后左右, both around today's
  zero-point).** (i) 前后: the ahead-bias becomes signed and continuous,
  centered EXACTLY on the incumbent mode value (0.75/0.35), gene-scaled with a
  bound TRACED from the existing geometry family (the radius family 10–18 m is
  the natural neighbour; T0 freezes the exact constant from code, never a typed
  literal — the #202 form). Negative reach = level-with or behind the ball
  becomes EXPRESSIBLE. (ii) 左右: the lane-pull factor (0.75) and cap
  (0.9·radius) become gene-scaled around their incumbent values — the fan can
  narrow toward the ball or widen toward the touchline. The mode ternary is not
  deleted; it is ABSORBED as the zero-point (born absent ⇒ byte-identical).
* **M-CTB.2 — born absent, the full arming checklist (#196.3-D4).** New genes
  optional and OUTSIDE `GENE_KEYS`; explicit `evolveCtbSupportPlane` opt-in;
  consumption `MatchConfig` flag `ctbSupportPlane` hard-false, never
  bundle-defaulted. Armed = flag + opt-in + non-absent gene, ALL THREE. Genes
  absent ⇒ `supportSpot` output byte-identical on every receipt seed.
* **M-CTB.3 — NO predicates (the #200 red line).** Slice one is STATIC plane
  freedom: unconditional geometry, genes scale continuous offsets, the complete
  conditional set = gate/guard/zero/cap. The DYNAMIC account (e.g.
  pressure-on-carrier × gene, the MT slack-account form — "check WHEN he is
  pressed") is a NAMED LATER SLICE, deliberately deferred exactly as MT §7
  deferred the carrier-state term. Nothing here decides WHEN to check; this
  slice only makes checking EXPRESSIBLE.
* **M-CTB.4 — the consumer is untouched around the seam.** Exactly one read
  site: the `SupportBallCarrier` executor case (`actionExecutor.ts:402`). WHO
  supports (TeamBrain assignment), pass selection, the carrier's own behavior,
  the certified price table: all byte-untouched. Per-body offsets are a later
  slice (the S2 lesson: heterogeneity is its own contract).

## §3 Instruments & gates (the arc)

* **CTB-T0 — mechanism dormant.** The seam behind `ctbSupportPlane`; flag-off
  byte-identity + fingerprint + RNG-stream receipts (the #181.2 stack; head/wall
  in the unhashed envelope); born-equivalence GATED on receipt seeds; ⚠ a PIN
  INVENTORY is a named deliverable: every test/invariant that pins `supportSpot`
  geometry (the Phase 30.5 history — the 5v6 sanity invariant, the
  interception/mirror-goals numbers) is listed, and none is renegotiated
  silently.
* **CTB-T1 — the SUPPORT-SUPPLY EXAM (the PM-T1 form: hand-dose the axes,
  measure the world).** Arms across the plane (deeper / shallower / narrower /
  wider + corners at traced bounds) vs armed-zero and absent. Ruler inherited,
  not invented: TRUE-holdable supply (the O2-T1 `trueCellOf` instrument
  verbatim), support-existence at pressed moments, pressed-first-reception
  share (#173), plus the #218 constructed/scramble shares via census-form
  instruments where the frame carries them. GUARDS: interception count (the
  Phase 30.5 column disease, 33/match history = the named ceiling family),
  offside flag (#157 — freed forward drift must not buy offside), spacing/clump
  (spreadY, the B1-a family), the equilibrium band, X-family. Pre-named FAILs:
  **F-CTB-a** no dose moves the supply (geometry is not the binding constraint
  — receiver-side needs different surgery; STOP) · **F-CTB-b** clump/
  interception re-import (the old column disease returns; STOP) · **F-CTB-c**
  offside or box pathology (STOP).
* **CTB-T2 — CO-EVOLUTION, with the user's hypothesis PRE-REGISTERED.** The
  MT-T2 instrument set verbatim (win-only fitness, neutral-drift shadow,
  fitness–gene correlation, checkpoint/resume). **The prediction (user,
  2026-08-10, frozen ex ante): attack-side selection ENGAGES** — short-option
  supply is a goals-level signal (the Phase 30.5 starvation receipt), and goals
  are exactly what win-only fitness hears; contrast pre-named with MT-T2's
  defensive indifference (the VISION §3 soft spot). Outcomes: (i) engages ⇒
  selection sets the dose, play-test entry; (ii) indifferent ⇒ honest
  UNSUPPORTED, the hand-dose decision returns (the MT path) AND the soft-spot
  ledger gains its attack-side entry; (iii) genes pinned at a pathological
  corner with guards blown ⇒ a substrate finding.
* **Exit** = the play-test (#168/#185 entry form): 回撤看得见吗 — a checking
  receiver is READABLE MOTION toward the ball; keep/change/revert is the
  user's word, per lever.

## §4 Non-claims

No pass-selection or carrier change. No TeamBrain assignment change (who
supports stays). No price-table change. No dynamic/state-coupled checking in
slice one (named deferred). No per-body offsets (later slice). No coach rungs,
no offside work. Nothing ships without the play-test verdict.

## §5 Sequencing

CTB-T0 dispatches on the next "go" (one writer; the O2 arc is closed at #222's
STOP). 丙 (progression value) stays queued behind this arc per #219.

## §6 VISION audit record (the #91 form, clause-by-clause at drafting)

* **vs §1 底座给能力,不替球队定行为**: this IS that clause enacted — a limb, not
  a habit; the freedom is unconditional, the use is discovered. PASS.
* **vs the #200 red line (no decline/trigger predicates)**: slice one is pure
  geometry × genes; the dynamic account is explicitly deferred, not smuggled.
  PASS.
* **vs §2 watchability**: a receiver checking toward the ball is readable body
  motion (more readable than any prior seam — it is a RUN); the render carries
  it natively. PASS.
* **vs §1 感知诚实**: `supportSpot` reads ball truth today (an incumbent read);
  this slice adds NO new information channel and no percept optimism. The
  receiver's own perception of the carrier's plight belongs to the deferred
  dynamic slice, where the percept path will be the required route. PASS.
* **vs §3.1 the missing seats**: 回撤接应 named missing at #218/#219; this is
  the state-creating seat the F-O2a decode points at (座2 sees; this creates
  what there is to see). PASS.
* **vs emergence (capability-not-mandate)**: genes born absent; instruments
  dose; ships never do; selection or the user's eyes decide. PASS.
* Amendments produced: none.

## §7 REALITY audit record (the #201 standing rule)

* **Real receivers position in the full plane** — short between the lines,
  half-space, touchline width, drop-behind: the user's 前后左右 is how real
  showing-for-the-ball actually parameterizes. PASS.
* **Check-to-ball is the universal pressing escape** in real football; a team
  that cannot show for the carrier cannot play out — exactly the measured
  disease (80.8% pressed receptions, spells dying one-touch). PASS.
* **The freedom belongs to the body, the habit is learned**: real tactics
  evolved culturally on fixed anatomy; genes here play the culture role,
  the substrate plays the anatomy role. The user's "现实里会进化出来" is
  therefore a TESTABLE claim about THIS world once the limb exists — frozen
  into CTB-T2 ex ante. PASS.
* **Honest gaps, named**: (a) real checking is DYNAMIC (triggered by the
  carrier's plight; timed to beat the marker) — slice one is static plane
  freedom; the account-coupled slice is deferred by name. (b) The check's
  BURST (a real receiver accelerates to the ball) stays at the incumbent
  `speedF`; velocity shaping is not this slice. (c) A real check drags a
  marker and OPENS SPACE ELSEWHERE — second-order effects this ruler reads
  only through the supply/interception instruments; the E4 value question
  (what a check is WORTH) is 丙's seat.
