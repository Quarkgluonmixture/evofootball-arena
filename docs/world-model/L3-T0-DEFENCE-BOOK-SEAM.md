# L3 T0 — the DORMANT DEFENCE-BOOK SEAM (`l3DefenceLearn` / `l3DefenceVeto`, 防守的账本)

Status: **PRE-REGISTERED, then BUILT + RUN the same round** (the EK-T0 / DV-T2-T0 two-part form).

Everything above [§RESULT](#result--the-gates-run) — the frozen law, the label derivation, the
window derivation, the veto port, the seam, the read-fork inventory, the ⭐ ARMING CHECKLIST, the
gate list, the smoke read list and the seed ledger — was written and **committed BEFORE the machine
ran** (#266.3(c), the freeze-commit canon). The measured numbers arrive only in §RESULT, and every
number there is quoted FROM the committed artifact.

Authority chain: the **CB-L3 DEFENCE-BOOK CONTRACT**
[`CB-L3-DEFENCE-BOOK-CONTRACT.md`](CB-L3-DEFENCE-BOOK-CONTRACT.md) §2 — **M-L3.1** (THE OBSERVABLE
LUNGE LABEL), **M-L3.2** (THE BOOK), **M-L3.3** (CONSUMPTION, DECLINE-ONLY), **M-L3.4** (SCOPE) —
bound by **#277.1**, dispatched by ⭐ **#279.4**, and **BOUND BY THE LABEL RULING #279.3** (the
quantity · the window family · the grain). Hygiene canon in full: **#163** · **#181.2** · **#200** ·
**#203** · **#229.2** · **#247 / #248.1** · **#250.3** · **#256.2 / .3** · **#260.2** · **#261.2**
(env WHITELIST-OR-REFUSE) · **#263.2** · **#266.2(i)** (carrier-anchored t0) · **#266.3(a)**
(envelope + cross-OUT) · **#266.3(c)** (the freeze commit) · ⭐⭐ **#268.3(a)** (LIVENESS BY MACHINE,
EXACTLY-ONE ENFORCED) · **#270.2 / #272.3(ii)** (clock honesty) · **#273.3** (tree-clean gates
compare WORKTREE vs HEAD) · **#276.3 → #278.2(ii) → #279.3(i)** (⭐ THE HAT-TRICK: a stage-doc number
is quotable only after its **corrections section** is opened and read).

### ⭐ §CORRECTIONS-READ — the hat-trick class, discharged explicitly

Every stage-doc number this round quotes was read **after** opening that document's own corrections
section, and the checks are stated rather than implied:

* **L3-C0 §COMMANDER CORRECTIONS OF RECORD (#278.2) — READ IN FULL.** Binding here: (i) the
  `sepGainedOwnRecovery` pick is **NOT ratified** and is now FORMALLY DEAD (#279.3(1)) — this stage
  does not implement it; (ii) the bare-world contrast cell is **37.565 %**, never "37.1 %" (not used
  here); (iii) the honest tabulated take rate is **6.161 %** and the "16.7975 per team per match"
  headline mixed populations (not used here); (iv) the OVERCOMMITTED band cannot fill in one
  team-season (13.9 misses) — inherited into §DOUBTS 3 and into the smoke's honesty.
* **L3-C0b §COMMANDER CORRECTIONS OF RECORD + THE LABEL RULING (#279.2/#279.3) — READ IN FULL.**
  Binding here: (i) the "charter ±3–4 pp" citation had **no source** and was demoted — this stage
  quotes **no** pp requirement; (ii) "both inside noise" was a mischaracterisation (not repeated);
  (iii) the applied short rung is **0.6500 s (39 ticks)**, not 0.654537 s — so when this stage says
  its window sits inside the proven live regime it uses the **applied** rungs; (iv) the post-sight
  rung tie-break authority reverted to the ruling — so the window here is **neither** rung: it is
  the ruling's own engine-constants family.
* **The numbers this stage imports from those two documents**, all read from their committed
  artifacts at run time and **none typed into `src/**`**: the two applied common rungs (the live
  regime the derived window must sit inside), and the **g2 common-window punishment rates** (the
  TRUTH-DOSE, instrument-side for ever — G-NOTABLE).

---

## §LAW — the frozen law of the defence account book

```text
THE TWO DOORS, and they do DIFFERENT things (the EK-T0 / DV-T2-T0 two-limb form)
  learns    ⇔  match.l3DefenceLearn === true    [this stage's NEW flag — the ledger seat]
  consumes  ⇔  match.l3DefenceVeto  === true    [this stage's NEW flag — the veto]
              AND the ledger seat exists (a book to compare against)
              AND the book SPEAKS at this group (see THE VETO below)

  ⇒ armed to LEARN alone, the books fill and NOTHING reads them: byte-identical (G-BORN).
  ⇒ armed to learn AND veto with an EMPTY book, the book speaks nowhere, so no lunge is
    ever declined: byte-identical (G-ZERO, the flag's analogue — EMPTY ⇒ ABSENT is the law).
  ⇒ armed to learn AND veto with a ONE-GROUP book, there is no cross-group reference, so
    again nothing is declined: byte-identical (G-ZERO, second form).
  ⇒ the world moves only once the team's OWN book has evidence in BOTH groups and the
    group it is about to lunge from is strictly the worse one. Consumption is EARNED.

THE LABEL (M-L3.1), RULED BY #279.3 — every clause below is that ruling, not a choice
  a LUNGE      = a standing challenge the engine FIRES (`tryTackles` past its own jockey
                 gate). Withheld challenges carry no label (M-L3.1, slice one).
  its INDEX    = ⭐ THE LUNGER'S OWN ARRIVAL SPEED AT THE DECISION TICK — his own velocity,
                 his own self-percept (M-L3.1's commensurability rule at the source; the
                 book indexes what the chooser reads and the veto reads back the same
                 index). GRAIN = g2 (#279.3(3)):
                     RECKLESS   ⇔ |v_taker| ≥ v*        (the OVERCOMMITTED band)
                     CONTROLLED ⇔ the rest
                 v* = sqrt(2·ACCEL·R_TACKLE), the arrival that cannot be braked inside the
                 challenge radius — CB-C0's / L3-C0's own identity, re-derived here from the
                 SAME TWO ENGINE CONSTANTS (check: v*²/(2·ACCEL) = R_TACKLE exactly).
  the POPULATION = ⭐ THE MISSED LUNGE, and only it. #279.3(1): "after a MISSED lunge,
                 punished ⇔ …". A WON lunge carries NO label — folding wins in as
                 unpunished would smuggle `P(won)` (FORMALLY REJECTED by #279.3(1)) back
                 into the belief through the denominator. See §SHARP 1.
  PUNISHED     ⇔ ⭐ THE CARRIER-ANCHORED SEPARATION GAINED BY THE CARRIER OVER THE FROZEN
                 COMMON WINDOW IS ≥ 0:
                     sep(t) = | taker − CARRIER |        (never taker − ball; #266.2(i))
                     punished ⇔ sep(t0 + W) − sep(t0) ≥ 0
                 t0 = the tick the lunge missed; the threshold is ZERO METRES (no constant).
  CENSORED     = a window truncated by the whistle, or one whose two bodies cannot both be
                 read at closing time. ⭐ CENSORED IS NOT A ZERO: the event LEAVES the
                 denominator and is COUNTED (L3-C0/C0b's own rule, inherited).
  ⭐ THE LABEL CLOSES WHEN THE WINDOW CLOSES, and only then does the book move.

⭐⭐ THE WINDOW W — DERIVED FROM ENGINE CONSTANTS ONLY (#279.3(2)), NEVER TYPED
  The ruling names the family: THE STATIONARY MISSER'S RECOVERY BOUND. CB-T0's recovery law
  (`carryBeat.recoveryInterval`, banked #267) is three legs —

      recovery = |v|/a  +  θ/TURN_RATE  +  sqrt(2·d/a)      (brake + turn + close)

  — and the BOUND is that law evaluated at the worst case a MISSED challenge can present to
  a body who is not carrying momentum out of it:

      brake = 0                     he arrived at rest (the stationary misser)
      turn  = π / TURN_RATE         the widest angle a body can be asked to turn through
      close = sqrt(2·R_TACKLE/a)    the gap is at most the challenge radius — the very
                                    distance inside which the engine offers the duel at all
                                    (and this leg IS CB-T0's duel horizon `sqrt(2R/a)`)

      ⇒  W = sqrt(2·R_TACKLE / ACCEL)  +  π / TURN_RATE

  Every term is the engine's own (`R_TACKLE` from `tryTackles`' candidate scan through
  `CB_TACKLE_RADIUS`; `ACCEL` and `TURN_RATE` from `Player.ts`), and the only numerals in the
  expression are the algebra itself (the 2 of the braking identity, π as the half-turn).
  ⭐ NO TYPED DURATION. ⭐ NO CENSUS VALUE (G-NOTABLE will grep for every one of them).
  ⭐ It is a BOUND, not a fitted number: it is longer than the time the engine's own law gives
  a misser who arrived at rest, and it is COMMON — the same number of seconds for every group,
  which is the entire lesson of #278.2(i)/#279.

THE BOOK (M-L3.2), per TEAM, per group g ∈ {CONTROLLED, RECKLESS}
  lunges[g]  += 1 on every CLOSED label at g;  punished[g] += 1 when it closed punished.
  belief[g]   = punished[g] / lunges[g], the ZERO-CONSTANT running mean (an unseen group
                reads 0).
  ⭐ AN EMPTY BOOK SERVES NO BELIEF AT ALL (`null`) — born absent survives arming.
  SEASON RESET: wiped at the season boundary — structural and untuned. NO decay, NO
                half-life, NO window, NO configurability the contract does not name.
  GENE-FREE:    no gene, no genome field, no serialization (the EK-T0 improvement).
  OWN EVENTS:   a team's book is written ONLY by its own bodies' own lunges (G-OWNEVENTS).

⭐⭐ THE VETO (M-L3.3) — THE EK-T0 IDIOM, PORTED VERBATIM AND ZERO-CONSTANT
  At the decision instant where the engine's own gates have ALREADY licensed a standing lunge
  (past the candidate scan and past the jockey/containment gate, unchanged), with the veto
  door armed, the challenge is DECLINED iff

      lunges[g] > 0                                   (my book speaks at THIS group)
      AND  Σ_{g'≠g} lunges[g'] > 0                    (my book has a CROSS-GROUP reference)
      AND  punished[g] · Σ_{g'≠g} lunges[g']
             >  Σ_{g'≠g} punished[g'] · lunges[g]     (STRICT: this group's own believed
                                                       risk exceeds my own pooled reference)

  — i.e. `belief[g] > (pooled other-group punished)/(pooled other-group lunges)`, written as an
  INTEGER CROSS-MULTIPLICATION so no float, no epsilon and no tuned number enters. THE ONLY
  LITERAL IS `0`, and it is an EMPTINESS test, not a threshold. THE PROPERTIES, each gated:
    * DECLINE-ONLY / NEVER A SUBSIDY (R-B, #64.1): the veto sits in SERIES after the engine's
      own gates and can only make a lunge NOT happen. There is no branch on which it makes a
      lunge more likely, longer, or better-priced. Measured in-world as well as read: an armed
      arm's fired-lunge count is ≤ the learn-only arm's, on every seed.
    * OWN BOOK ONLY: both sides of the comparison are this team's own counters.
    * EMPTY / ONE-GROUP / TIE ⇒ declines NOTHING ⇒ byte-identical (G-ZERO).
    * A DECLINED LUNGE IS NOT A LUNGE: it writes no label (nothing was thrown), and the body
      simply takes the same early return the jockey gate takes — the withheld challenge that
      already exists in this world (L3-C0 measured ~⅓ of proximity ticks refusing).

THE WRITE PATH — ⭐ THERE IS NO GENE
  This seam writes NO genome field, adds NO gene, adds NO `GENE_KEYS` entry and serializes
  NOTHING: consumption reads the BOOK directly at the one decision site. The DV Lamarck catch is
  inherited as a PROHIBITION rather than a mitigation, and G-NOLAMARCK MEASURES it (crossover,
  mutation and serialization byte-untouched, grep-proved).

⭐ EPISTEMIC HONESTY, closed at the IMPORT LIST. `defenceBook.ts` imports EXACTLY the engine's
  own motion constants (`ACCEL`, `TURN_RATE`, `CB_TACKLE_RADIUS`) and NOTHING else — the
  `carryBeat.ts` form (EK-T0's empty list is not available to a module whose window must be
  DERIVED rather than typed, and #279.3(2) chose derivation over typing). It cannot name
  `Match`, `Player`, `Team`, a percept snapshot, an rng, an opponent's internals or any census
  artifact; everything else it is told arrives as primitive numbers from its caller: MY OWN
  body's lunge and its group, the PUBLIC clock, and the separation between two bodies anyone
  standing on the pitch can see.

NO PREDICATES (#200) — the complete conditional set is GATE, SELECTOR, WINDOW, EMPTY, VETO
  GATE     the arming rule (two flag forks ⇒ the nullable ledger seat + the veto read).
  SELECTOR the arrival group — a comparison against the DERIVED v*; it decides WHICH counter
           moves, never whether anything happens.
  WINDOW   the label's own definition (`t ≥ t0 + W`, `Δsep ≥ 0`); it decides how an event is
           REMEMBERED, after the fact.
  EMPTY    `lunges === 0 ⇒ no belief / no veto` — the born-absent rule, not a threshold.
  VETO     ⭐ THE ONE conditional in this seam that can change an action — and it is a
           COMPARISON OF THE TEAM'S OWN TWO RATIOS, declared above in full, never a constant.
```

### ⭐ §SHARP — the sharpenings, declared (the ruling is silent on each)

1. ⭐⭐ **THE DENOMINATOR IS THE MISS POPULATION.** `lunges[g]` counts **closed labels** — missed
   lunges whose window resolved — not every lunge thrown. #279.3(1) defines the label only "after a
   MISSED lunge", and it killed `P(won)` on its consumer's own terms; a denominator of ALL lunges
   would make `belief[g]` the product of a punishment rate and a miss rate, i.e. would re-admit the
   rejected candidate through the back door. The fired-lunge count is still published (a read, never
   a book cell).
2. **CENSORED ⇒ NOT WRITTEN** (unlike EK-T0, where censored ⇒ unpunished). L3-C0/C0b censor rather
   than zero, and this stage inherits **their** rule so T1's yardstick and the book measure the same
   quantity (#256.2). The censored count is published per group.
3. **THE OBSERVATION POINT IS THE HEAD OF `step`** + `endMatch` (EK-T0's sharpening 1, DV-T2-T0's
   before it): it reads the state the previous step left, and `simTime` only advances inside the
   step body, so the stamps agree with the label's own t0.
4. **THE GROUP IS READ ONCE PER DECISION**, before the veto and re-used by the label — so the veto
   and the book cannot disagree about which group a lunge came from (the commensurability rule
   applied to the seam's own two consumers).
5. **THE WINDOW AND THE GROUP COUNT ARE ON THE SHAPE SIDE OF #247.** `L3_DEFENCE_GROUPS = 2` is the
   arity of the RULED grain (#279.3(3)); `L3_DEFENCE_WINDOW_S` is DERIVED, not typed. No measured
   rate is anywhere near `src/**` (G-NOTABLE).
6. **THE BOOK IS THE SEASON'S, HELD BY THE LEAGUE** (`MatchConfig.l3DefenceBooks`), the EK/DV
   sharpening replayed, wiped in `finishSeason`. ⚠ Declared: no League world arms the CB doors, so a
   League season's books fill only through a fixture that shares the same book objects — G-RESET
   measures allocation + object identity + filling + the wipe.
7. **NO RENDER CUE, NO FEED LINE, NO NEW ACTION TYPE, NO SAVE FIELD, NO NEW GENE.**
8. ⭐ **`Player.ts` GAINS ONE KEYWORD.** `const ACCEL = 14` becomes `export const ACCEL = 14` so the
   window and v\* can be DERIVED from the engine's own constant instead of re-typed (#279.3(2)
   forbids the typed alternative). No value, no expression and no behaviour changes; G-PINS asserts
   the diff against HEAD is **exactly that one keyword** and the identity stack proves the world.

## §HONESTY — the epistemic limits, stated plainly

1. **NO NEW CHANNEL.** The seam adds a MEMORY of the body's own lunges and the public separation
   between two bodies. It adds **no percept pull**: the group is his own velocity, which his own
   motion already is.
2. ⚠ **THE BOOK IS A TEAM'S, NOT A PLAYER'S** — contract §4's named later slice.
3. ⚠ **A MISS IS NOT PER SE A BEATING** (L3-C0b §VETO, verbatim). This book teaches "don't get taken
   away from"; it does not teach "don't waste lunges" (that was `P(won)`, rejected #279.3(1)).
4. ⚠ **ONE TEAM-SEASON DOES NOT RESOLVE THE ORDERING** (#279.3(4), inherited from L3-C0's own
   corrections): ~15 binding-group events against ~4 pp gradients. T1 sizes multi-season. The
   fail-safe direction is the design's: a wrong book costs PATIENCE, never recklessness.
5. ⭐ **THIS STAGE SCORES NOTHING.** Whether a book grows the measured shape is **L3-T1's** question.
   The smoke is plumbing, and divergence is REPORTED, never fixed (#203).

## §SEAM — the mechanism (all of it dormant)

### The flags

**`l3DefenceLearn`** and **`l3DefenceVeto`**, two new **explicit** `MatchConfig` booleans,
initialised `cfg.l3DefenceLearn ?? false` / `cfg.l3DefenceVeto ?? false` (`Match.ts`) — the
`ekHoldLearn` / `dvLearnedMap` form. **Never** `EDS_BUNDLE_ARMED`, never env-armed, never default-ON,
never bundle-defaulted: **absent from `src/game/a4World.ts` entirely**. Each gets its own
`League.matchFlags` key so a probe world can arm it explicitly; neither key changes any default.

### ⭐ THE ARMING CHECKLIST (a NAMED deliverable — re-derived from #267/#269, no stale predicates)

| # | to see… | you must | why |
| --- | --- | --- | --- |
| 1 | a ledger at all | `l3DefenceLearn: true` | the one `Match` fork |
| 2 | the world of record's events | the **POLISHED ARMED WORLD**: `...a4MatchFlags(6)` **and** `armA4World(m, null, 6)`, asserted by `cbArmedVersion(m) === 6` — i.e. **all three CB doors** (`cbCommitPhysics` · `cbTouchPast` · `cbChoiceSeat`, #267/#269.4) plus the carry-proneness dose 1.0 on **both** sides | this is the #273 truth L3-C0/C0b measured in; the armed miss (χ-priced, physics-recovered) is the event the label is about. ⚠ the seam still LABELS in a bare world — the doors change the world, not the machinery (measured: G-BORN publishes the bare-world fill) |
| 3 | a season's book | a League with `matchFlags.l3DefenceLearn` (or `l3DefenceBooks` passed in) | otherwise the book dies with the match |
| 4 | ANY behaviour change | `l3DefenceVeto: true` **and** a book with evidence in **BOTH** groups **and** the lunging group strictly worse than its own cross-group reference | the veto's own three conjuncts |
| 5 | a veto in ONE match | ⭐ TRUTH-DOSING (the exam idiom): the instrument writes L3-C0b's committed g2 rates into the book before kickoff — because a real book needs a season | #279.3(4): no label resolves inside one team-season |

**Nothing in production satisfies even #1**: both flags are hard `false` and appear in no preset.

### The genes

**NONE.** No gene, no `GENE_KEYS` entry, no opt-in, no genome write of any kind (G-NOLAMARCK).

### ⭐ The READ-FORK INVENTORY (a NAMED deliverable)

| # | site | file | what it feeds |
| --- | --- | --- | --- |
| **1** | `this.l3Defence = this.l3DefenceLearn ? new LungeLabelLedger(…) : null;` — THE LEDGER FORK | `src/sim/Match.ts`, the constructor | the arming rule (flag ⇒ a ledger seat; otherwise `null`) |
| **2** | `...(this.matchFlags?.l3DefenceLearn === true ? { l3DefenceBooks: … } : {})` — THE SEASON FORK | `src/sim/League.ts`, `createMatch` | which two books the fixture learns into; allocates nothing when shut |
| **3** | `l3DefenceDeclines(side, group)` — THE VETO FORK | `src/sim/Match.ts` | the ONE consumption read; `false` whenever either door is shut |
| **4** | `l3DefenceGroup(taker)` — THE GROUP READ | `src/sim/Match.ts` | returns `-1` (no group) unless the ledger seat exists; the ONE index read, shared by the veto and the label |
| **5** | `l3DefenceNoteMiss(taker, carrier, group)` — THE LABEL CAPTURE | `src/sim/Match.ts`, called from `mechanics.tryTackles`' MISS branch | opens the label with its carrier-anchored `sep(t0)` |

⭐ **THE WIRING POINT, and why it is the decision seat:** the veto is consulted in
`mechanics.tryTackles`, **after** the candidate scan has chosen the one tackler and **after** the
jockey/containment gate has had its say (`if (goalSide && !looseTouch && !helpClose && !dangerZone
&& driveNow > …) return;`), and **before** `tackler.tackleAnimTimer` / `spendBurst` — the first line
that commits the body. Past that line the lunge has happened (the animation, the burst cost, the roll
and, armed, the χ pricing and the recovery interval all follow). It is therefore the exact instant at
which "does a standing lunge fire?" is decided, and it is where the world's own withheld-challenge
behaviour already exits. ⚠ **THE JOCKEY GATE IS NOT TOUCHED** (M-L3.4): the veto is a NEW gate in
SERIES after it, never a rewrite of it, and it can only add refusals.

**Byte-identity is structural, not hope**: with the forks not taken, `l3Defence` is `null`,
`l3DefenceGroup` returns `-1` on a field test, `l3DefenceDeclines` returns `false` on a field test,
no observation runs and no book exists.

### Untouched (restated as a prohibition)

⚠ **No defender-AI redesign** (M-L3.4): the jockey gate, containment, marking, the slide, the
tactical grab, the keeper duel and the duel's own probability expression are **not edited**. ⚠ **No
perception change.** Every banked seam's own law, gene, flag and module —
`src/ai/holdAccountBook.ts` · `deliveryAccountBook.ts` · `whetherEye.ts` · `perceptionSnapshot.ts` ·
`src/sim/carryBeat.ts` (CB-T0's physics) · `src/game/a4World.ts` and all play-test worlds · the
render layer · `evolve.ts` and every evolution path · `League.toJSON` / `fromJSON` — **byte-untouched**
(G-PINS). `src/sim/Player.ts` changes by **one keyword** (§SHARP 8) and by nothing else.

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

⭐ **#268.3(a): the coverage map is MACHINE-DERIVED from the gate objects and EXACTLY-ONE is
ENFORCED** — every conjunct must own a mutant, every mutant must name a real conjunct, every mutant
must flip **its own** conjunct and leave the others standing, or the probe **refuses to run**
(exit 3). ⭐ #260.2: every mutant RE-INVOKES the gate's own predicate function. `head` / wall-clock /
paths / all machine timings ride the UNHASHED envelope (#266.3(a)) and a cross-OUT proves it.

**THE TWO WORLD SHAPES** used throughout: **(P)** bare production (no CB doors — where the seam can
only be dormant) and **(A)** ⭐ **THE POLISHED ARMED WORLD** = L3-C0/C0b's own world of record
(`a4MatchFlags(6)` + `armA4World(m, null, 6)`, `cbArmedVersion === 6`, the ENGINE DEFAULT clock).

| gate | predicate | kind |
| --- | --- | --- |
| **gDet** | the receipts core runs **twice**, byte-identical digests | HARD |
| **gIdent** | with both flags absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines (1337 · 20260728 · 424242), all RECOMPUTED IN-PROBE | HARD |
| **xFpProd** | the 1337 row IS the production fingerprint `57b0bdab…c673` | HARD |
| **gOff** | per-match whole-run signature **including the rng stream state**: flags ABSENT ≡ flags FALSE, in **BOTH** world shapes, on every receipt seed | HARD |
| ⭐ **gBorn** | `l3DefenceLearn` ARMED ALONE (the veto shut) ≡ off, byte for byte, both shapes, every receipt seed — **with the machinery LIVE**: the armed world must close **> 0** labels and fill **> 0** book cells | HARD |
| ⭐⭐ **gZero** | **THE G-ZERO ANALOGUE, three forms.** (a) STRUCTURAL: an empty book serves `null`, declines nothing, and BOTH doors armed on an empty book is byte-identical; (b) ONE-GROUP: a book with evidence in a single group declines nothing and is byte-identical; (c) PREFIX: BOTH doors armed on a TRUTH-DOSED book is byte-identical to learn-only for every tick **up to and including** the tick before the FIRST VETO, and that prefix is non-empty | HARD |
| ⭐⭐ **gLabel** | **THE RULED LABEL, PROVED BY EQUALITY.** The in-world books' per-team per-group `(lunges, punished)` cells equal an INDEPENDENT probe-side re-labelling of the same trajectory — its own miss detection (the engine's own `cbLedger` deltas), its own carrier-anchored separation walk and its own window arithmetic — **0 mismatches over all cells**, on **> 0** punished. Coverage: the carrier anchor · the window length · the sign · the censoring rule · the miss population — a mutant each | HARD |
| ⭐⭐ **gWindow** | **ENGINE CONSTANTS ONLY.** `L3_DEFENCE_WINDOW_S` re-derives bit-exactly from `ACCEL`, `TURN_RATE` and `R_TACKLE` **extracted from `src/**` text at run time** (never imported by the checker); the three legs are published; it sits INSIDE the applied live regime read from L3-C0b's committed artifact; and the module's own window lines contain **no numeric literal** beyond the algebra | HARD |
| ⭐ **gGroup** | **THE GRAIN IS g2 AND THE CUT IS v\*.** `v*` re-derives from the extracted constants, satisfies `v*²/(2·ACCEL) = R_TACKLE` exactly, and equals L3-C0b's committed `bands.vStar`; the in-world group of every counted event equals a probe-side placement of the engine's own `|vel|` at that tick (bit-equality); the group count is **2** and the order is the census's own g2 order | HARD |
| **gBook** | the book's arithmetic re-derived independently on a hand-counted 500-event stream: `belief[g] = punished[g]/lunges[g]`, `0` on an unseen group, `punished ≤ lunges`, `total` = the sum, width 2, out-of-range ignored | HARD |
| ⭐⭐ **gVeto** | **THE PRE-REGISTERED FORM, machine-checked.** (i) EQUIVALENCE: exhaustive sweep of small hand-built books against an INDEPENDENT float re-derivation; (ii) EMPTY / ONE-GROUP / TIE ⇒ never; (iii) DIRECTION: the strictly worse group always declines, the strictly better never; (iv) ZERO-CONSTANT: the veto's own source lines carry no numeric literal but `0`; (v) ⭐ DECLINE-ONLY IN-WORLD: on every armed seed the fired-lunge count is **≤** the learn-only arm's | HARD |
| ⭐⭐ **gPort** | **THE PORT'S FIDELITY TO EK-T0.** `DefenceAccountBook.declinesLunge`'s executable body is **token-identical** to `HoldAccountBook.declinesHold`'s under the declared identifier renaming (`holds→lunges`, `band→group`, `EK_HOLD_BANDS→L3_DEFENCE_GROUPS`) — a machine comparison, not a claim | HARD |
| ⭐ **gReset** | THE SEASON BOUNDARY: an unarmed League allocates nothing; an armed one allocates one book per franchise and hands the SAME objects to its fixtures; a match sharing those objects fills them; after `finishSeason()` every cell is 0, every belief `null`, every group declines nothing | HARD |
| **gBite** | with BOTH doors armed on a TRUTH-DOSED book the world DIVERGES from the learn-only arm, and only after a veto has fired. ⚠ Divergence, not a target flip (#250.3) | HARD |
| ⭐⭐ **gCross** | **THE DOORS MATRIX (#228).** {learn on/off} × {veto on/off} × {the CB world armed / bare} × {truth-dosed / born-empty} — one FULL match per cell per seed, whole-run signature incl. rng state, inside the G-DET core; PLUS the **28-family door sweep**: every banked `MatchConfig` door enumerated FROM `a4MatchFlags`/the config surface and asserted unmoved. Claims EX ANTE: **(DORMANT-ALL)** · **(A)** learning armed beside the CB doors ≡ those alone · **(B)** the veto door armed ALONE ≡ off everywhere · **(INTERACTION)** the seam bites ONLY with both doors AND a two-group book · **(DISCRIMINATION)** a VETOED world is not a CB-DOORS-OFF world | HARD |
| ⭐⭐ **gNotable** | **THE #247 SPLIT, EXTENDED TO L3-C0 AND L3-C0b.** No file in `src/**` contains either artifact's name, schema name, or ANY of their measured values — as written, 5-dp, and the printed percentage form — and no seam file contains a loader, a `docs/` path or a dynamic import. Coverage stated: needle-set size, the declared decimal floor, and a CONTROL NEEDLE that must be FOUND | HARD |
| ⭐ **gEpi** | **THE LEARNER READS ONLY ITS OWN EVENT STREAM.** `defenceBook.ts`'s import list is EXACTLY the three engine constants from two engine modules; its executable source names no `Match`, `match.`, `Player`, `Team`, `perceivedSnapshot`, `opp`, `rng`, `attrs`, `readFileSync`, `docs/`, `import(`, `genome`; and every event kind the §LAW names exists | HARD |
| ⭐ **gNoLamarck** | after an armed match AND an armed League season, **no genome anywhere carries a defence belief**: zero `genome`/`Genome` writes on any seam line, `GENE_KEYS` unchanged, a save round-trip carries no book/belief/flag, and ⭐ `src/evolution/**` is **byte-untouched** (crossover/mutation grep-proved) | HARD |
| ⭐ **gOwnEvents** | **OWN EVENTS ONLY** (the EK-T0 form): every write to book `s` originates from a lunge by a body of side `s` — proved by replaying the ledger's own noted events against the sides recorded at capture, with a mutant that mis-routes one write | HARD |
| **gRng** | the seam draws **zero** rng: an armed-to-learn stream equals the unarmed arm's at every step, and the ledger driven directly on a stepped fixture leaves the match rng EXACT | HARD |
| **gHygiene** | both flags absent from `a4World.ts` entirely; initialised `?? false`; a fresh Match and a League match are both OFF; an unarmed League allocates **no** book; no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` on any seam line; no new `GENE_KEYS` entry; the book never reaches `toJSON`; ⭐ the probe's env surface is WHITELIST-OR-REFUSE (#261.2) incl. the engine's own known env doors | HARD |
| **gFork** | ⭐ the READ-FORK INVENTORY: exactly ONE of each of the five forks, feeding exactly the enumerated consumer sites; **ZERO** new duel statements (`tryTackles`' own gate and roll lines unchanged in count); every other `src/**` occurrence enumerated with file:line and class, **zero unclassified** | HARD |
| **gPins** | the §PINS rows recomputed: `holdAccountBook.ts` · `deliveryAccountBook.ts` · `whetherEye.ts` · `perceptionSnapshot.ts` · `carryBeat.ts` · `a4World.ts` · `src/evolution/**` byte-untouched vs HEAD; **zero test files edited**; ⭐ `Player.ts`'s diff vs HEAD is EXACTLY the one `export` keyword | HARD |
| **gSeed** | seed-block disjointness proved in-probe for every interval this stage consumes, against the COMPLETE consumed ledger incl. L3-C0's and L3-C0b's blocks | HARD |
| **gStats** | the stats-stream disposition is DECLARED and true: this stage draws **no bootstrap and no stats stream** (an identity round), so #279.4's ≥ 111,200 floor is **NOT DRAWN** | HARD |
| **gHashEnvelope** | #266.3(a): the machine envelope (head, wall-clock, paths, timings) sits OUTSIDE the hashed body, the written body re-derives its own digest from disk, and a **cross-OUT** written with a different envelope has the identical digest | HARD |
| **gMutants** | the MACHINE-DERIVED coverage map has no uncovered conjunct and no ghost mutant, and every mutant is LIVE (flips its own conjunct, leaves the rest) | HARD |
| **G-SUITE** | FULL `npm test` green + `tsc --noEmit` clean (load-induced timeout flakes reproduced/disclosed per the PTP-T0 disposition) | HARD |
| ⭐ **REPORTED** | **THE ARMED SMOKE** (below) | REPORTED |

**Pre-named FAIL ⇒ STOP** (#179): any HARD gate failing, any src diff outside the seam path, any rng
draw on the dormant path, any constant appearing in the veto or the window, or **any existing test
breaking** (a STOP-and-report, never a test edit).

### ⭐ THE SMOKE'S READ LIST — frozen before sight (REPORTED, no world claims)

1. **THE BOOK FILLS**: closed labels, censored labels and filled cells per group, per team per match,
   in the armed world over a declared seed block — beside the fired-lunge count.
2. **THE VETO FIRES WHEN TRUTH-DOSED WORSE**: the count of vetoes served over the same block with the
   book dosed from L3-C0b's committed g2 rates (reckless strictly worse) — expected **> 0**.
3. **AND NOT WHEN DOSED NEUTRAL**: the same block with an equal-rate dose — expected **exactly 0**
   (the tie declines nothing).
4. **THE WORLD-IDENTITY OF THE LEARN-ONLY ARM** on the same block.
5. The book's own rates beside L3-C0b's committed g2 rates, as a plumbing sanity read only.

⚠ **NO WORLD CLAIM IS MADE HERE.** Whether 乱抢 calms is L3-T2's REPORTED question and the play-test
is the USER GATE. Divergence between a filled book and the census is REPORTED, never fixed (#203).

## §PINS — the PIN INVENTORY (a NAMED deliverable)

| # | pin | where | class | disposition |
| --- | --- | --- | --- | --- |
| 1 | ⭐⭐ **`carryBeat.ts` byte-untouched** (CB-T0's banked physics) | `src/sim/carryBeat.ts` | source text | must hold — consumed, never edited |
| 2 | ⭐⭐ **`holdAccountBook.ts` byte-untouched** (the form this stage replicates) | `src/ai/holdAccountBook.ts` | source text | must hold |
| 3 | ⭐ **`whetherEye.ts` · `deliveryAccountBook.ts` · `perceptionSnapshot.ts` · `a4World.ts` untouched** | those files | source text | must hold |
| 4 | ⭐⭐ **`src/evolution/**` byte-untouched** — the G-NOLAMARCK receipt at source grain | `src/evolution/` | source text | must hold |
| 5 | ⭐ **`Player.ts` moves by ONE KEYWORD** (§SHARP 8) | `src/sim/Player.ts` | source text | machine-checked diff shape |
| 6 | the **production fingerprint** `57b0bdab…c673` | asserted across the suite | league identity | UNTOUCHED — recomputed as gIdent / xFpProd |
| 7 | the **save round-trip pins** | `careers.test.ts`, League JSON suites | persistence | UNTOUCHED — the book is never serialized |
| 8 | the whole suite | every pre-change test file (plus this stage's new one) | everything downstream | G-SUITE runs it in full. **No test file may be edited** |

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| everything consumed through L3-C0b | the probe's `CONSUMED` table (inherited in full) | prior |
| **L3-T0 receipts (this stage)** | **12,482,000 – 12,482,011** (12 seeds × the arm set; the doors matrix re-uses the FIRST 4 — no new block) | **CONSUMED here** |
| **L3-T0 label / book / veto / reset / rng reads** | **12,482,020 – 12,482,029** | **CONSUMED here** |
| **L3-T0 REPORTED armed smoke** | **12,482,100 – 12,482,119** | **CONSUMED here** |
| L3-T0 test-file seeds (not a battery) | 12,482,900 – 12,482,911 | consumed here |
| free above | 12,482,012 – 019 · 030 – 099 · 120 – 899 · 912 + | available to L3-T1 |

Disjointness is computed **in-probe** for every interval separately, not asserted here.

**STATS**: this stage runs **no bootstrap and draws no stats stream at all** — the identity-round
form. #279.4's ≥ **111,200** floor is therefore **NOT DRAWN**, and is said so rather than reserved
unused. L3-T1 opens at 111,200 unchanged (`gStats` asserts this disposition).

## §ROAD B — nothing ships

`l3DefenceLearn` and `l3DefenceVeto` are **OFF in every production path** — hard `false` defaults,
absent from `a4World.ts` and from every play-test world, absent from every League's `matchFlags`
unless a probe sets them explicitly — and even ARMED they change nothing while the book is empty or
one-grouped (gZero). No gene is added; nothing is serialized; no franchise genome is ever written
(G-NOLAMARCK). **Nothing about the game the user plays changes in this commit.** The seam exists so
L3-T1 can run the convergence exam.

**Road B statement**: fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **must not move.**

## §NON-CLAIMS

L3-T0 claims **no** football effect and **no** learning result. ⭐⭐ It does not claim any team learns
the RIGHT lunge map — that is L3-T1's registration, scored against the census truth re-measured AT
THE FROZEN WINDOW (#256.2); a wrong book is legal and is STYLE (#247). It does not give any team
either census's table (G-NOTABLE), does not touch the jockey gate, the duel's odds, the recovery law
or any perception channel, does not carry learning across a season boundary or into a genome, adds
**no** per-body book and **no** coach/opponent/imitation channel (contract §4's named later slices).
The REPORTED smoke is an uncontrolled descriptive reading and adjudicates nothing. It cannot
authorize L3-T1; only the commander can (#203).

---

## §RESULT — the gates run

*(filled in after the receipts ran; every number here is quoted FROM
`docs/world-model/data/l3-t0-defence-book-seam.json`.)*
