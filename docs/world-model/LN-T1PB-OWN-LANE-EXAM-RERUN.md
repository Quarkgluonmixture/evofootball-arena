# LN-T1′b — 「传球者看见自己人 · 考试 · 重走」 THE OWN-LANE EXAM, RE-RUN

> **STATUS: RESULTS — THE BATTERY IS WALKED (69 seeds × 7 arms, block 12,550,000–068,
> construction receipt 12,550,999). §P and the instrument were FROZEN at the previous commit and
> are byte-identical here; §DEV-PREFLIGHT was DISCLOSED before the first battery seed. ✅ ALL 26
> GATES ARE GREEN, so the artifact is written to its CANONICAL path and the read IS OF RECORD.**
> This was the FREEZE commit of a freeze-before-sight exam (canon **freeze-before-battery**:
> "freeze the instrument commit BEFORE the battery; artifact records the instrument hash"). §P
> below and `scripts/probes/ln-t1pb-own-lane-exam.ts` are byte-frozen at that commit and are
> never edited after sight; the §DEV-PREFLIGHT scratch smoke that sized N is DISCLOSED in full,
> and it ran on the out-of-band scratch band only (900,004,300–399 — canon **verifier scratch
> seeds**).
>
> Authorized by **COMMANDER RULING #395 item 4**. It re-freezes **LN-T1′**
> ([`LN-T1P-OWN-LANE-EXAM.md`](LN-T1P-OWN-LANE-EXAM.md), specification #394 item 4) with **FIVE
> DECLARED CHANGES AND NOTHING ELSE**. Contract:
> [`LN-OWN-LANE-CONTRACT.md`](LN-OWN-LANE-CONTRACT.md) §3 (the exam form) and §4 (the
> non-claims). The seam under exam: [`LN-T0-OWN-LANE-PRICE.md`](LN-T0-OWN-LANE-PRICE.md).
>
> Instrument: `scripts/probes/ln-t1pb-own-lane-exam.ts` ·
> Artifact: `docs/world-model/data/ln-t1pb-own-lane-exam.json`.

---

## §0 WHAT THIS IS, AND WHY

LN-T1′ walked the own-lane exam and its table read clean: R1 fell at every dose, no guard
broke, the kick-off tap-back moved. **But one gate was RED**, on a receipt conjunct inherited
from LN-C3, so the read was ruled TRUE ON THIS TABLE and NOT OF RECORD. The commander did not
grant a dispensation; he ordered the run again. Quoted from ruling #395 item 4:

> "**LN-T1′b DISPATCHED — 「传球者看见自己人 · 考试 · 重走」 THE RE-RUN** (the LN-T1′ exam
> re-frozen with FIVE declared changes and nothing else; X-SRC-ZERO; a fresh block)."

And the RED it re-walks around, quoted from ruling #395 item 3:

> "the failing conjunct is LN-C3's inherited identity 'the untraced families ARE the untraced
> ledger class' — a receipt about the (choice tick, passerGid) JOIN, which held on every
> un-armed arm and fails by ONE or TWO kick-off passes on three armed arms (1 + 1 of 456; 1 of
> 476; 1 of 415). The family assignment is by (kind, site) FIRST and is provably independent …
> THE MECHANISM (a labelled hypothesis until diagnosed): a pass armed through the perceived
> chooser (which writes a ledger row) whose flight is superseded by a restart, the same player
> then taking the kick-off with that arm tick as his choice tick".

So this stage asks LN-T1′'s question again, unchanged —

> "does the own-lane price, at doses w ∈ {0.25, 0.5, 1.0}, lower the user's own face — a
> measured ground pass whose FIRST body is an own NON-target teammate
> (`firstBody.ownNonTarget`) — on world 13, without breaking a guard, and does the kick-off
> tap-back's carom move (H-LN-2)?"

— on a **fresh block**, with a **fresh scratch band**, with the offending conjunct **demoted to
a published receipt**, and with the join **DIAGNOSED off the engine's own wind-up ledger**
instead of hypothesised. It also proves, seed by seed and field by field, that **the walker did
not change**: G-REPRO-LNT1P re-walks LN-T1′'s own first twelve seeds on all seven arms and
matches its RED artifact field for field.

⛔ **IT IS AN EXAM, AND IT ARMS NOTHING.** The flag stays default OFF. World 12 and world 13
bytes are untouched. `a4World.ts` never names the flag or the gene (an anchored ZERO-occurrence
receipt, §P.9). The production fingerprint `57b0bdab…c673` is recomputed in-probe and must be
UNCHANGED. **X-SRC-ZERO**: this stage creates and edits NO file under `src/` or `tests/`, gated
both ways (`git diff --stat HEAD` and `git status --porcelain`) on the run that writes the
artifact. **Nothing ships.**

⛔ **NO LOOK-PRESSURE FACE IS READ OFF AN ARMED ARM** (#394 item 3(ii)) — inherited whole from
LN-T1′, including the one censored counter and its stated exclusion.

---

## §P THE FROZEN PROTOCOL

> Frozen at this commit, before any battery seed. **§P IS LN-T1′'s §P WITH FIVE AMENDMENTS AND
> NOTHING ELSE.** Every amendment is marked **⭐ AMENDMENT (x)** at the section it changes and
> the five are listed together at §P.0. Everything not so marked is INHERITED WHOLE from
> LN-T1′'s §P (specification #394 item 4) and is re-anchored at THIS head. Every constant below
> is either ANCHOR-EXTRACTED from `src/**` (or from an ancestor instrument) with a line receipt,
> or QUOTED from a banked artifact by field name. Canon **anchored extraction**: "a
> src-extracted constant pins its extraction to the NAMED call site — anchored match + line
> receipt — never first-occurrence".

### §P.0 THE FIVE AMENDMENTS — THE WHOLE OF THE DELTA

⭐ **AMENDMENT (a) — THE CONJUNCT IS DEMOTED TO A PUBLISHED RECEIPT.** The `gFaces` conjunct
`<arm>.partition.untracedFamiliesAreExactlyTheUntracedLedgerClass` **no longer gates
`allGreen`**. In its place, for each untraced family (KEEPER-pass · THROUGH-BALL · CUTBACK ·
KICKOFF-PLAYBACK · OTHER) and each arm, the **share of that family's measured ground passes
that CARRY a ledger row** is PUBLISHED, with its own numerator and denominator, as the FACES
`ledgerRow.<FAMILY>.share` — so `gTwoFractions` and `gFaces` both cover its arithmetic. The
identity LN-T1′ asserted is stored beside it as a per-arm OBSERVATION
(`ledgerJoin.untracedFamiliesAreExactlyTheUntracedLedgerClass`) that gates nothing. ⛔ **THE
FAMILY ASSIGNMENT IS UNCHANGED**: it stays by **(kind, site) FIRST**, byte for byte as LN-C3
froze it and LN-T1′ ran it.

⭐ **AMENDMENT (b) — THE JOIN IS DIAGNOSED, OFF THE ENGINE'S OWN RECORDS.** Canon **engine
ledgers before heuristics**, VERBATIM: "an event attribution reads the engine's own record when
one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no
record exists, and says so". For **every** measured ground pass whose FAMILY and LEDGER CLASS
disagree — an untraced family whose pass carries a ledger row, or a traced family whose pass
carries none (LEGACY-outfield and SUBSTITUTED are traced BY CONSTRUCTION, so only the first
kind should occur; **both are counted**) — the instrument stores an ITEMISED ROW:

| field | what it is |
|---|---|
| `seed` · `arm` | attached when the list is published (they are not properties of the world) |
| `strikeTick` | the tick the strike happened on |
| `passerGid` | the passer |
| `site` | the STRIKE SITE (LN-C3's, off the engine's records) |
| `choiceClass` | the CHOICE-TICK class — `arm` or `release` |
| `chosenGid` · `legacyGid` | the ledger row's own two gids (null where there is no row) |
| `family` · `pathClass` | the family assigned, and the ledger path class it disagrees with |
| `ledgerRowTick` | the ledger row's own tick — the JOIN key's tick (null where there is no row) |
| `ledgerAtStrikeTick` · `ledgerAtStrikeTickMinusOne` | `match.o1WindupLedger` = `[arms, evictions, struck, cancelledMate]` |
| `ledgerAtRowTick` · `ledgerAtRowTickMinusOne` | the same four, at the ledger row's tick and the tick before |
| `windupArmedNotStruckBeforeRestart` | the STORED BOOLEAN, below |

**THE PREDICATE, STATED EX ANTE:**

> `windupArmedNotStruckBeforeRestart` = `arms@strikeTick − arms@ledgerRowTick > 0` **AND**
> `struck@strikeTick − struck@ledgerRowTick === 0`; **false** when the row has no
> `ledgerRowTick`.

The list is stored in the artifact (`ledgerJoin.disagreementRows`, expected SHORT) with per-arm
counts published as the FACES `joinDisagreement.untracedFamilyWithLedgerRow.share` and
`joinDisagreement.tracedFamilyWithoutLedgerRow.share`. **Written only if the list is
non-empty** (canon **counterfactual words are stored**: "a universal sentence about a table …
is a stored boolean or is not written"): the stored boolean
`everyDisagreementIsAKickoffWithAnUnstruckWindup`, with its two limbs
(`everyDisagreementIsAKickoff`, `everyDisagreementHasAnUnstruckWindup`) beside it. On an empty
list all three are `null`. ⛔ **THIS DIAGNOSES; IT CHANGES NO FAMILY.** The wind-up ledger's own
docblock in `src/sim/Match.ts` says "nothing in the sim ever READS these fields, so they cannot
influence a single tick" — and `gLockstep` re-proves the observation is inert anyway.

⭐ **AMENDMENT (c) — G-ARM READS BACK PER TEAM, AT BOTH ENDS OF THE MATCH.** LN-T1′ §CORR 2:
its read-back was a `Math.max` over the two teams, taken at construction only, which is weaker
than the sentence it carried. Here, for **side 0 and side 1 separately**, the SHIPPED
`lnOwnLaneWeightOf` is CALLED on `effGenome`, on `baseGenome` and on `info.genome`, and the
KEY's own presence on `info.genome` is read — **at CONSTRUCTION and again at FULL TIME**, stored
per cell. **The gate requires** each dosed side's `eff` and `base` to equal the arm's dose at
BOTH times, and `info.genome` to carry no key and read 0 on both sides at both times. LN-T1′'s
four `Math.max` fields are LEFT UNCHANGED beside them, so G-REPRO-LNT1P can compare them field
for field.

⭐ **AMENDMENT (d) — THE FILE HASH AND BYTE COUNT ARE CARRIED BY THE DOC.** LN-T1′ §CORR 4: the
artifact's `receipts.note` promised a doc-published file hash and byte count, and the doc did
not carry them. **THE PROMISE IS KEPT, NOT DROPPED**: the artifact's `receipts` block still
carries neither (both are self-referential — writing either changes the bytes they describe)
and names where they live; **§GATES of THIS doc carries the final file sha256 and byte count**,
recomputed with `shasum -a 256` and `wc -c` on the committed artifact AFTER the final write.
The doc is written after the artifact, which is why it can.

⭐ **AMENDMENT (e) — G-REPRO-LNT1P, THE IDENTITY RECEIPT.** LN-T1′'s seeds **12,549,000–011**
are RE-WALKED on **ALL SEVEN ARMS** with THIS instrument and matched **FIELD FOR FIELD** against
every `perSeedCells` field the two runs SHARE, off LN-T1′'s own committed artifact
(`docs/world-model/data/ln-t1p-own-lane-exam.json.RED.json` — its fail-closed routing wrote
that path and deliberately left the canonical one unwritten). **0 mismatches on every arm is
required.** The walker and the observation are the same; only the receipts changed. EXCLUSIONS,
declared: the ONE shared field `wallMs` (a machine timing); and every field THIS instrument
ADDS, which is absent from LN-T1′'s cells and so is not a shared field at all — each is listed
by name in the artifact's `reproLnt1p.fieldsIAddedThatLnT1pDoesNotHave`, and the counts are
published at §GATES. ⛔ **RE-WALKS, NOT CONSUMPTION.** G-REPRO-LNC3 (12,548,000–011 on ABSENT)
is INHERITED unchanged from LN-T1′.

⛔ **NOTHING ELSE CHANGES.** Every other line of the instrument is LN-T1′'s, byte for byte,
except the renames and re-pointings the new stage forces (its own doc path, instrument path,
artifact path, `stage` block, env prefix, block, scratch band, registry, lineage) — see
§DEVIATIONS.

### §P.1 THE ARMS — SEVEN, PAIRED ON SHARED SEEDS *(inherited)*

All seven arms are built by ONE constructor, which is LN-C3's `buildMatch` byte for byte (the
composer CALLED, never a copied flag set): `a4MatchFlags(13)` + `armA4World(m, null, 13)` for
the E13 book, and `armA4World(m, null, 13, L3_DOSE, PC_DOSE)` for the D13 book. `traceChoice:
true` is passed EXPLICITLY on every walked arm — the run envelope REFUSES the
`EDS_TRACE_CHOICE` env door outright.

| arm | book | `lnOwnLanePrice` | `lnOwnLaneWeight` | what it is |
|---|---|---|---|---|
| **ABSENT** | E13 | *no key at all* | absent | the control — LN-C3's E13 arm exactly |
| **ARMED-ZERO** | E13 | `true` | absent | the IDENTITY arm (FLAG-HYGIENE) |
| **W025** | E13 | `true` | 0.25 | |
| **W050** | E13 | `true` | 0.5 | the shell's own weight, the reference dose |
| **W100** | E13 | `true` | 1.0 | the ceiling; the variance source |
| **D13-ABSENT** | D13 | *no key at all* | absent | the form the user plays — the pair's control |
| **D13-W050** | D13 | `true` | 0.5 | the play-form receipt, printed beside the read |

Δ is taken PAIRED on the shared seed against the arm's OWN control: the five E13 arms against
ABSENT; D13-W050 against D13-ABSENT.

⭐ **ARMED-ZERO IS NOT A DOSE.** FLAG-HYGIENE requires it to be byte-identical to ABSENT, so
its every Δ is exactly 0 and it can never be a dose of record. Its booleans are STORED anyway.

### §P.2 THE DOSE PLACEMENT — WITH ITS ANCHOR *(inherited; ⭐ AMENDMENT (c) strengthens its receipt)*

Canon **dose placement**, VERBATIM: "dose NEVER in info.genome; truth-dosing writes census
values through the effective genome."

The anchor chain (each line pinned at §3 of the instrument with its line receipt):

1. `PlayerBrain.decideCarrier` reads **`const g = team.genome;`** two lines after `team` is
   bound, and in world 13 `inSnapshotLaw` is OFF (gated by `gWorld`), so `team` IS the truth
   `Team` object.
2. `Team`'s own accessor is **`get genome(): TacticalGenome { return this.effGenome; }`** — a
   FIELD, not `info.genome`.
3. `Match` REBUILDS the field at every brain tick:
   **`team.effGenome = applyMentality(team.baseGenome, team.mentality);`** — a dose written only
   on `effGenome` would be erased the first time the coach's mentality moved.
4. `applyMentality` SPREADS its input (`...raw`), so a gene it does not name survives the
   rebuild.

⇒ **THE DOSE IS WRITTEN ON `baseGenome` AND `effGenome`, AS COPIES, ON BOTH TEAMS, AND NEVER ON
`info.genome`** — the ratified weight-setting idiom (#334 item 1; RATIFIED at #395 §CORR 9).

⚠ **THE T0 SUITE'S THREE-VIEW IDIOM IS NOT FOLLOWED, AND HERE IS WHY.**
`tests/lnOwnLane.test.ts` writes the gene on all three views (`info.genome` included) because a
unit pin wants the value wherever it is read and its `Match` dies with the assertion. This exam
runs inside the league's own construction path: `info.genome` is the FRANCHISE'S OWN OBJECT, and
`crossoverGenomes` copies a present gene from parent A even with the evolution opt-in shut
(contract §2 M-LN.2), so writing it would open the Lamarck channel the contract names as a
LATER slice.

**RECEIPT (`gArm`)** — ⭐ **AMENDMENT (c)**: the SHIPPED accessor `lnOwnLaneWeightOf` is CALLED
and read back **PER TEAM** (side 0 and side 1 SEPARATELY) off `effGenome` AND `baseGenome` on
EVERY walked match, **at CONSTRUCTION AND AT FULL TIME**, and equals the arm's dose at both
times on both sides; read off `info.genome` it is 0 and the KEY IS ABSENT, on both sides, at
both times, on every arm and every seed. LN-T1′'s pooled `Math.max` fields are kept beside them
unchanged. LIVENESS: the whole-match signature differs ABSENT vs W100 on every seed (or the
count of differing seeds is published).

### §P.3 THE POPULATION AND THE CLASSES — INHERITED, RE-ANCHORED *(inherited)*

- **The population**: PT-C0's measured ground passes, byte for byte (the population ladder, the
  class ladder, the flight retire cap).
- **The first-body channel**: LN-C0's, off the engine's own record `ball.lastTouch` — canon
  **engine ledgers before heuristics**.
- **The choice tick and the aim of record**: LN-C1's, INHERITED — where a wind-up record exists
  the ARM TICK is the choice tick, else the RELEASE tick is; the `dxStrikeAim` lead is the aim
  of record for synchronous strikes; a class with no establishable choice tick is COUNTED, never
  imputed.
- **The path classes**: LN-C2's, off `match.passChoiceTrace` — `legacyChosen · legacyNoOption ·
  substituted · untraced`.
- **The family rule**: LN-C3's, INHERITED as a deterministic function of four record fields —
  **KICKOFF-PLAYBACK · SUBSTITUTED · LEGACY-outfield · KEEPER-pass · THROUGH-BALL · CUTBACK ·
  OTHER** — over the strike sites `arm · ledSynchronous · toFeetSynchronous · cutback ·
  throughBall · kickoffPlayback`. ⭐ **THE ASSIGNMENT IS BY (KIND, SITE) FIRST AND AMENDMENTS
  (a) AND (b) DO NOT TOUCH IT.**

⭐ **THE KICK-OFF SCORER'S SPAN IS RE-ANCHORED AT THIS HEAD, AND LN-C3'S STORED HASH DIFFERS.**
LN-T0's site (b) added ONE statement inside the span and `const s` became `let s`. LN-C3's
stored span values are READ out of its banked artifact (`callGraphNodes.nodes[]` where `name ===
"kickoffPlaybackScorer"`) — never re-typed — and compared to this head's freshly hashed span;
the difference is a STORED boolean (`lnC3KickoffSpan.hashDiffers`) with the reason beside it.
The line anchors are pinned afresh here. **The banked census is untouched.**

### §P.4 THE PRIMARY RULER R1 *(inherited)*

**R1 = `firstBody.ownNonTarget`** over ALL measured ground passes: the share whose FIRST BODY
(the `ball.lastTouch` channel) is an own NON-target teammate. Paired Δ vs the arm's control per
dose. **DOWN resolved = helpful** — the 95 % cluster-bootstrap interval (2,000 draws, seeded
from the block base) excludes zero on the helpful side. Stored per dose: `r1Down(w)`, `r1Up(w)`,
the Δ, the interval, the half-width, |Δ|÷half-width and the LOO flips.

**THE PRIOR, QUOTED BY FIELD NAME** from LN-C3's banked artifact on its E13 arm:
`firstBody.ownNonTarget` = 0.10080881491032705 (860 / 8,531). ⚠ It is the PRIOR. **This exam's
own ABSENT arm is the control**, and every Δ is taken against it. ⚠ LN-T1′'s own numbers are
NOT a prior here either: this is an independent block, and §R6 puts the two tables side by side
only after both are printed.

**PUBLISHED BY FAMILY**: per arm, `P(carom | family)` and the family's share of ALL caroms. The
**KICKOFF-PLAYBACK** family's own paired Δ on its carom rate is stored per dose as
**`kickDown(w)`** (DOWN resolved) — **H-LN-2's probe**. LN-C3's E13 priors, quoted by field:
`family.KICKOFF-PLAYBACK.caromRate` = 0.5941780821917808 (347 / 584) and
`family.KICKOFF-PLAYBACK.passShare` = 0.06845621849724534 (584 / 8,531).

### §P.5 THE SECONDARIES — PUBLISHED, NEVER GATING *(inherited; ⭐ AMENDMENTS (a) + (b) add two)*

The chosen lane's own-openness (LN-C1's CALLED reconstruction) by family and dose — the seam's
own face, expected UP; the shell-fired share (the shipped `groundShellHazard` CALLED on the
struck lane) by dose; the perceived substitution rate and the `chosenGid = −1` rate (the factor
touches no executability — expected UNCHANGED, a receipt); the mean pass distance and passes per
match; 撞车 (LN-C0's crowd face) beside; LN-C3's path and family faces reproduced on ABSENT.
⭐ **AND, NEW**: the per-family ledger-row shares of AMENDMENT (a), and the join-disagreement
shares and itemised rows of AMENDMENT (b). Neither gates anything.

### §P.6 THE GUARDS (F-LN′-b) — WITH THEIR HARMFUL DIRECTIONS *(inherited)*

Tolerance form, frozen ex ante: **tolerance = NI_FRACTION · |control level|**, with
`NI_FRACTION = 1 − 0.275 / 0.380` **INHERITED BY ANCHOR** from
`scripts/probes/ln-t1-lane-exam.ts`'s own line and EVALUATED FROM ITS TWO NUMERALS — never typed
as a decimal here or in the instrument (the same expression is anchored a second time in
OBM-T1's probe, its origin, and the two evaluations must agree).
**breach(w) = RESOLVED **and** beyond tolerance IN THE HARMFUL DIRECTION.**

| # | face | harmful direction | what |
|---|---|---|---|
| **G1 — FIRST** | `guard.backwardPassShare` | **UP** (ceiling) | the share of measured ground passes whose STRUCK aim has the chooser's own `gain` < 0 |
| G2 | `context.passCompletion` | DOWN (floor) | the engine's own completion stat |
| G3 | `guard.interceptionsPerMatch` | UP (ceiling) | interceptions per match, both sides |
| G4 | `context.goalsPerMatch` | **BOTH** | the exam claims no effect either way |
| G5 | `context.shotsPerMatch` | **BOTH** | the same |
| G6 | `guard.offsidesPerMatch` | a resolved INCREASE **FLAGS** | the #157 FLAG form — flips NO gate, enters neither `breach` nor Q |
| G7 | `context.ownedBallSampleShare` | DOWN (floor) | possession |

**G1's predicate is the chooser's own form, ANCHORED and CALLED** on the struck aim of record
with the passer's `localX` at the choice:
`gain = clamp01((team.localX(aim.x) - localX + 30) / 60) * 2 - 1` — the line inside
`groundCandidate` (`src/ai/PlayerBrain.ts`, pinned with its line receipt), plus the line the
form subtracts, `const localX = team.localX(p.pos.x);`. G1 is FIRST because of LN-C1's warning:
the own-clear alternative points BACKWARD on 0.570033 of the passes that had one, so a price on
our own bodies in the lane could buy its lane's clearance by turning the ball round. The
BREACHING GUARD NAMES are stored per dose.

### §P.7 THE READS — FROZEN LITERALS ON STORED BOOLEANS *(inherited VERBATIM, #394 item 4(v))*

`Q = { w ∈ {0.25, 0.5, 1.0} : r1Down(w) ∧ ¬breach(w) }`.

- **READ 1** — Q non-empty ⇒
  *"THE PASSER SEES HIS OWN MEN AND THE CAROM FALLS — LN-ENTRY is named: world 14 = world 13 +
  the own-lane door at the SMALLEST qualifying dose."*
  The smallest w in Q is a STORED FIELD printed on its own annotation line beneath the sentence,
  never spliced into the literal. The D13 pair at 0.5 prints beside it as the play-form receipt,
  with its own paired Δ and interval.
- **READ 2** — Q empty, some w with `r1Down ∧ breach` ⇒
  *"THE CAROM FALLS BUT A GUARD BREAKS — the dose is disqualified; the commander decides with
  the table."* The breaching guard names are the stored annotation.
- **READ 3** — no `r1Down` at any dose ⇒ **F-LN′-a**
  *"THE PRICE MOVES NOTHING THE USER SEES — the seam stays dormant; the commander decides with
  the table."*

**BESIDE EVERY READ, H-LN-2's OWN SENTENCE**, on a stored boolean over the doses:

- `kickDown` at NO dose ⇒ *"THE KICK-OFF TAP-BACK DID NOT MOVE — the restart SHAPE is named
  (H-LN-2 holds)."*
- `kickDown` at some dose ⇒ *"THE KICK-OFF TAP-BACK MOVED TOO (H-LN-2 refuted at <w>)."* with
  the SMALLEST such w.

**STORED**: the selector booleans per arm, the selected read key and sentence, Q, the smallest
qualifying dose and its weight, the **counterfactual word per dose arm taken alone** (canon
**counterfactual words are stored**), the D13 pair's own word, and every universal as a BOOLEAN
(`everyDoseHasR1Down`, `noDoseHasKickDown`, `everyGuardHeldOnEveryDose`, …) — canon: "a
universal sentence about a table … is a stored boolean or is not written". No percentage in
prose restates a stored share; no literal count of the sweep is written; the LOO sentence is
scoped to its rows.

### §P.8 SIZING, SEEDS, STATS *(inherited form; the block and band are THIS stage's)*

- **Block 12,550,000–999** is this stage's, verified FRESH against the published frontier of
  record at #395 item 8 (next sim ≥ 12,550,000). Consumed: LN-C0 12,544,000–999 · LN-T1
  12,545,000–999 · LN-C1 12,546,000–999 · LN-C2 12,547,000–999 · LN-C3 12,548,000–999 · LN-T1′
  12,549,000–999.
- **Construction receipt** at 12,550,999 (the block top); battery from 12,550,000; BOOKED =
  WALKED, and the unwalked tail is DECLARED.
- **RE-WALKS, NOT CONSUMPTION**: LN-C3's own 12,548,000–011 on the ABSENT arm (G-REPRO-LNC3) and
  ⭐ LN-T1′'s own 12,549,000–011 on **all seven arms** (G-REPRO-LNT1P, AMENDMENT (e)).
- **Scratch (out of band, ≥ 900,000,000)**: the 12-seed sizing smoke on 900,004,300–311 within
  the declared band 900,004,300–399; its receipt seed 900,004,320; the world pin 900,004,370;
  the lockstep twins 900,004,390–391.
- **Sizing form** (the house form, shown): `se(n) = hw(n)/z.975` ·
  `se(needed) = |target|/(z.975 + z.80)` · `N = ceil(n · (se(n)/se(needed))²)` ·
  `MDE(N) = hw(n)·√(n/N)·(z.975+z.80)/z.975`, at a **DECLARED 0.01 ABSOLUTE target** on R1's
  paired Δ, with the **CEILING arm W100** as the variance source (LN-T1's form).
  `N = min(nRequired, the block's affordance)`; if the sizing asks for more than the block
  holds, N = the affordance and the MDE at N is published. The bound branch is STORED, not
  typed.
- **STATS**: ZERO consumed. Every interval is a CLUSTER BOOTSTRAP over match seeds, 2,000 draws,
  seeded from the block base.
- **Registry 79** at this freeze.

### §P.9 THE GATE SET *(inherited; ⭐ AMENDMENT (a) removes one conjunct, AMENDMENT (e) adds one gate)*

The house set — X-DET (the whole core walked twice, digests compared) · X-FP-PROD (the
production fingerprint recomputed in-probe through the shipped `League`/`runHeadless` path,
baseline inherited by anchor) · X-SRC-UNTOUCHED over `src/` **and** `tests/`, both `git diff
--stat HEAD` and `git status --porcelain` (canon **xSrcUntouched**) · SEED-DISJOINT against the
published ledger · gN · gFaces re-derived off the SERIALIZED artifact (canon
**gFaces-from-disk**) · gReadWords · gHashOrder (the body hash computed LAST, `allGreen` INSIDE
the allowlist, a NON-body `receipts.hashReproducesFromFile`, EVERY non-body key enumerated —
canon **hash receipt outside the body**, **hashed-body exclusion / allowlist**) · BOOKED =
WALKED · LOO on R1 per dose and on `kickDown` · two-fractions (every published face carries its
own numerator and denominator and its value is exactly their ratio) — PLUS:

- **gStage** — the artifact's `stage.instrument` is written from THIS instrument's own path
  constant and `stage.instrumentSha256` is compared to the bytes of the file at that path, read
  at run time (LN-C3 §COMMANDER CORRECTIONS item 1).
- **FLAG-HYGIENE** — ARMED-ZERO ≡ ABSENT on EVERY seed, the whole-match signature including the
  RNG STREAM STATE compared, with the excluded fields stated. ⭐ AMENDMENT (c)'s eight per-team
  fields are excluded BY NAME beside LN-T1′'s four, being the same arm definition at a finer
  grain; the diagnosis rows and counts of AMENDMENT (b) are NOT excluded and must be identical.
- **G-ARM** — §P.2's receipt, **PER TEAM at construction and at full time** (⭐ AMENDMENT (c)),
  plus the liveness divergence ABSENT vs W100.
- **gLockstepTrace** — the ledger is BYTE-INERT re-proved at this head AND under the dose: the
  same arm at the same out-of-band scratch seed, once with `traceChoice: true` and once without,
  byte-identical.
- **G-REPRO-LNC3** — LN-C3's seeds 12,548,000–011 RE-WALKED on ABSENT with the trace ON, matched
  FIELD FOR FIELD against every `perSeedCells[].E13` field this exam also computes; the field
  count is stored. **0 mismatches is the DORMANCY receipt in the census's own arithmetic.**
- ⭐ **G-REPRO-LNT1P** (AMENDMENT (e)) — LN-T1′'s seeds 12,549,000–011 RE-WALKED on **ALL SEVEN
  ARMS**, matched FIELD FOR FIELD against LN-T1′'s own artifact. **0 mismatches on every arm is
  the IDENTITY RECEIPT between the two runs.**
- **gCodeFactGraph** — canon **code facts over the call graph**, VERBATIM: "…the callee list is
  EXTRACTED from the hashed text — every identifier called within the span, resolved to its
  definition and hashed — never typed, and a declared edge absent from the text, or a call
  present in the text and absent from the graph, is RED". The roots are the THREE price sites,
  the scope site and the seat module (`ownLaneOpenness`, `ownLanePrice`, `ownLaneScopeGids`,
  `groundCandidate`, the kick-off span, `choosePerceivedPassTarget`); every other node is
  DISCOVERED from the stripped text. The graph is STORED beside the booleans.
- **gWorld** — `bqArmedVersion` 13 on every walked match; `lnOwnLanePrice` as CONSTRUCTED per
  arm; the gene as READ per arm; `edsPerceivedChoice` true; `traceChoice` true on the arms and
  false on the untraced lockstep twin.
- **gShellFixtures**, **gWalkFixtures**, **gClassesNonVacuous**, **gAnchoredConstants**,
  **gDoseSource** (canon **dose/data-source guards**: the D13 books' BYTES are hashed, not a
  self-declared field).

⛔ **THE ONE CONJUNCT THAT IS GONE** is
`<arm>.partition.untracedFamiliesAreExactlyTheUntracedLedgerClass` (⭐ AMENDMENT (a)). In its
place `gFaces` re-derives, off the serialized artifact and per arm, the ARITHMETIC of the
published ledger-row receipt, the stored identity OBSERVATION, and the itemised diagnosis
list's own length.

⛔ Every gate is a LIVENESS or RECEIPT gate. **No gate tests a direction.**

---

## §DEV-PREFLIGHT — THE DISCLOSED SCRATCH SMOKE AND THE SIZING

Run BEFORE this freeze commit, on the OUT-OF-BAND scratch band only. **No battery seed was
walked.** Command:
`LNT1PB_MODE=smoke LNT1PB_N=12 npx tsx scripts/probes/ln-t1pb-own-lane-exam.ts`
(the override path is refused the canonical artifact name by the run envelope; it wrote
`/tmp/ln-t1pb-own-lane-exam-override.json`).

- 12 scratch clusters, seeds **900,004,300–900,004,311**; receipt 900,004,320; world pin
  900,004,370; lockstep twins 900,004,390–391 — all inside the declared band 900,004,300–399.
- **ALL 26 GATES GREEN** on the smoke, including X-DET, X-FP-PROD, FLAG-HYGIENE (ARMED-ZERO ≡
  ABSENT, signature with rng state, 12/12), G-ARM with its new per-team read-back,
  gLockstepTrace, G-REPRO-LNC3, gStage — **and G-REPRO-LNT1P, which matched LN-T1′'s twelve
  seeds on all seven arms with 0 mismatches at 13,944 field comparisons.** Wall: about 55 s for
  the whole seven-arm smoke plus both re-walks.
- **THE SIZING** (the variance source is the CEILING arm W100, LN-T1's form, at the declared
  **0.01 absolute** target on R1's paired Δ):

| quantity | value |
|---|---|
| `hwSmoke` (W100's realised half-width, 12 clusters) | 0.016692084284591215 |
| `seSmoke = hw/z.975` | 0.008516526024120395 |
| `seNeeded = 0.01/(z.975+z.80)` | 0.003569407753013907 |
| `nRequired = ceil(12 · (seSmoke/seNeeded)²)` | **69** |
| block affordance (after the construction receipt) | 999 |
| **N_FROZEN = min(nRequired, affordance)** | **69** |
| bound by | the SIZING |
| expected half-width at N | 0.006961080347985687 |
| **MDE at N** | **0.009950213349661955** |

⚠ **12 clusters is a NOISY variance estimate.** It is disclosed as such; the sizing is a plan,
not a claim, and the realised half-widths at N are what §R2 reports.

⛔ **THE SMOKE'S EFFECT NUMBERS ARE NOT READ AND NOT QUOTED HERE.** Only the half-width that
sized N is carried forward, which is the disclosure the house form requires. The read is taken
on the battery, once.

⚠ **THE SMOKE RAN THE INSTRUMENT AS IT THEN STOOD**; the only edits between that run and this
freeze are the two sizing constants the smoke itself produced (`SMOKE_HW_R1` — read out of the
smoke artifact's own `deltas[].halfWidth` field, never re-typed from the console — and
`N_FROZEN`). That is the disclosed house sequence.

---

## §HONEST LIMITS

*(the ONE home — canon **honest-limits single home**: "a stage doc's HONEST LIMITS list is the
ONE home; the artifact stores that list verbatim or stores none". The artifact stores NONE and
its `honestLimitsNote` points here.)*

1. **This is a measurement, not a ship.** Nothing in this stage arms the flag for the user. A
   read naming LN-ENTRY is a NAMING; the door is the commander's to open.
2. **One world, one composition.** Every arm is world 13. The E13 arms are the EMPTY-BOOK
   composition; the D13 pair is the dosed form. Nothing here speaks to world 12, to any other
   composition, or to an evolved population.
3. **The dose is a fixed weight, not an evolved gene.** The gene is written by the instrument on
   the match-local genome views. Nothing here says what evolution would do with it.
4. **The perceived chooser's price is a declared currency mix** (contract §4; T0 doc §4): a
   score-unit weight discounting a measured probability. The currency-correct form is a later
   door. Any effect measured here is an effect of THAT approximation, not of the ideal seam.
5. **The armed trace's prices are PRICED.** No look-pressure face is read off an armed arm
   (#394 item 3(ii)), so this exam publishes no armed look-pressure comparison at all — not
   because it held, but because it is not comparable.
6. **The guards are a tolerance test, not a proof of safety.** A guard that does not RESOLVE is
   not a guard that held; it is a guard the exam could not read at this N. The half-widths are
   published beside every guard row.
7. **The family rows are conditional rates on unequal denominators.** A family whose pass count
   moves under the dose changes its own denominator; the shares of all caroms are published
   beside the rates for exactly that reason (canon **moving denominators**).
8. **G-REPRO-LNC3 proves DORMANCY, not correctness.** Field-for-field agreement on the ABSENT
   arm says the flag-off world is the world LN-C3 walked. It says nothing about whether the
   armed arms are right.
9. ⭐ **G-REPRO-LNT1P proves IDENTITY OF THE WALKER, not correctness of it.** Field-for-field
   agreement with LN-T1′ on twelve seeds and seven arms says this instrument observes what its
   parent observed — the five changes touched receipts only. It says nothing about whether
   either of them observes the right thing, and twelve seeds is not the block.
10. ⭐ **THE JOIN DIAGNOSIS IS A DIAGNOSIS, NOT A CAUSAL CLAIM.** AMENDMENT (b) reads the
    engine's own wind-up counters at four named ticks and evaluates ONE frozen predicate on
    them. A row satisfying that predicate is CONSISTENT with the mechanism ruling #395 item 3
    hypothesised; it is not a proof of it, and the counters are pooled per match, not per body.
    If the list is empty the predicate says nothing at all.
11. ⭐ **THE DEMOTED CONJUNCT IS NOW UNGATED.** After AMENDMENT (a) nothing in the gate set
    fails if the untraced families stop being exactly the untraced ledger class. That is the
    commander's instruction and it is a REAL loss of a tripwire; what replaces it is a published
    share per family per arm and an itemised list, which a reader must actually read.
12. **The sizing rests on 12 scratch clusters.** See §DEV-PREFLIGHT.
13. **LOO is a conservative point-shift receipt scoped to its own rows** (R1 per dose and
    `kickDown`), not a general robustness claim.

---


## §R1 R1 — THE USER'S OWN FACE, PER DOSE, AND THE FAMILY TABLE

**R1 = `firstBody.ownNonTarget`** over all measured ground passes. Control level on this exam's
own **ABSENT** arm: **0.102798** (529 / 5,146) — beside LN-C3's banked E13 prior
`firstBody.ownNonTarget` = 0.10080881491032705 (860 / 8,531), which the exam quotes and does not
use as its control.

| arm | level | paired Δ vs its control | 95 % interval | \|Δ\|÷half-width | `r1Down` | `r1Up` | `breach` |
|---|---|---|---|---|---|---|---|
| ARMED-ZERO | 0.102798 (529/5146) | 0.000000 | [0.000000, 0.000000] | — | false | false | false |
| **W025** | 0.058788 (289/4916) | **−0.044011** | [−0.053358, −0.035266] | 4.865283 | **true** | false | false |
| **W050** | 0.050337 (254/5046) | **−0.052461** | [−0.063186, −0.042102] | 4.976597 | **true** | false | false |
| **W100** | 0.039949 (189/4731) | **−0.062849** | [−0.073845, −0.052351] | 5.848112 | **true** | false | false |
| D13-ABSENT | 0.089528 (501/5596) | — (it is a control) | — | — | — | — | — |
| D13-W050 | 0.040022 (219/5472) | −0.049506 | [−0.058276, −0.041392] | 5.864480 | true | false | false |

`everyDoseHasR1Down` is a STORED boolean and it is **true**; `noDoseHasR1Up` is **true**.
ARMED-ZERO's Δ is exactly zero on every face WHERE IT IS DEFINED — FLAG-HYGIENE (the five
OTHER-family faces are NaN on control and arm alike, the family being empty by the frozen rule;
the stored evidence is the 69/69 × 163-field row identity, not a per-face boolean).
ARMED-ZERO's |Δ|÷half-width is stored `null`: the ratio is 0/0.

### The family table — P(carom \| family) and the family's share of ALL caroms

| family | ABSENT | ARMED-ZERO | W025 | W050 | W100 | D13-ABSENT | D13-W050 |
|---|---|---|---|---|---|---|---|
| LEGACY-outfield | 0.055085 (91/1652) | 0.055085 (91/1652) | 0.032924 (51/1549) | 0.025466 (41/1610) | 0.015222 (23/1511) | 0.042407 (74/1745) | 0.016324 (27/1654) |
| SUBSTITUTED | 0.094995 (186/1958) | 0.094995 (186/1958) | 0.070679 (128/1811) | 0.070831 (127/1793) | 0.054468 (89/1634) | 0.083484 (185/2216) | 0.057248 (124/2166) |
| KEEPER-pass | 0.050100 (25/499) | 0.050100 (25/499) | 0.017621 (8/454) | 0.026846 (12/447) | 0.013825 (6/434) | 0.053950 (28/519) | 0.014113 (7/496) |
| THROUGH-BALL | 0.057377 (21/366) | 0.057377 (21/366) | 0.059740 (23/385) | 0.054422 (24/441) | 0.074074 (32/432) | 0.061321 (26/424) | 0.071111 (32/450) |
| CUTBACK | 0.012500 (4/320) | 0.012500 (4/320) | 0.035326 (13/368) | 0.038363 (15/391) | 0.025000 (9/360) | 0.040431 (15/371) | 0.023560 (9/382) |
| **KICKOFF-PLAYBACK** | **0.575499 (202/351)** | **0.575499 (202/351)** | **0.189112 (66/349)** | **0.096154 (35/364)** | **0.083333 (30/360)** | **0.538941 (173/321)** | **0.061728 (20/324)** |
| OTHER | *(empty by the frozen rule — every face on it is NaN on 0/0)* | | | | | | |

Share of ALL caroms — KICKOFF-PLAYBACK: ABSENT **0.381853** · W025 **0.228374** · W050
**0.137795** · W100 **0.158730** · D13-ABSENT **0.345309** · D13-W050 **0.091324**. SUBSTITUTED
takes the room it leaves: 0.351607 → 0.442907 / 0.500000 / 0.470899 (D13 0.369261 → 0.566210).
⚠ These are rates on denominators that MOVE with the dose (§HONEST LIMITS 7): the family's pass
counts are printed above beside every rate.

### `kickDown(w)` — H-LN-2's probe

| arm | paired Δ on `family.KICKOFF-PLAYBACK.caromRate` | 95 % interval | `kickDown` |
|---|---|---|---|
| ARMED-ZERO | 0.000000 | [0.000000, 0.000000] | false |
| W025 | −0.386387 | [−0.460015, −0.313814] | **true** |
| W050 | −0.479345 | [−0.561037, −0.400091] | **true** |
| W100 | −0.492165 | [−0.568767, −0.419717] | **true** |
| D13-W050 | −0.477212 | [−0.556479, −0.400082] | true |

`everyDoseHasKickDown` is a STORED boolean and it is **true**.

---

## §R2 THE GUARDS AND THE BAND

Control = each arm's own control arm; tolerance = `NI_FRACTION · |control level|` with
`NI_FRACTION` inherited by anchor; breach = RESOLVED **and** beyond tolerance in the harmful
direction. **G1 is first.**

| arm | guard | control | tolerance | Δ | 95 % interval | resolved | breach |
|---|---|---|---|---|---|---|---|
| W025 | **G1** backwardPassShare | 0.326467 | 0.090208 | 0.014664 | [−0.001725, 0.030172] | false | false |
| W025 | G2 passCompletion | 0.592215 | 0.163638 | 0.023227 | [0.005546, 0.041504] | true | false |
| W025 | G3 interceptionsPerMatch | 27.173913 | 7.508581 | −2.565217 | [−4.101449, −0.971014] | true | false |
| W025 | G4 goalsPerMatch | 3.231884 | 0.893021 | −0.072464 | [−0.652174, 0.536232] | false | false |
| W025 | G5 shotsPerMatch | 13.217391 | 3.652174 | 0.884058 | [−0.115942, 1.913043] | false | false |
| W025 | G7 ownedBallSampleShare | 0.347926 | 0.096137 | −0.002297 | [−0.020220, 0.017040] | false | false |
| W050 | **G1** backwardPassShare | 0.326467 | 0.090208 | 0.008848 | [−0.007182, 0.024681] | false | false |
| W050 | G2 passCompletion | 0.592215 | 0.163638 | 0.022084 | [0.005041, 0.039252] | true | false |
| W050 | G3 interceptionsPerMatch | 27.173913 | 7.508581 | −2.173913 | [−3.724638, −0.710145] | true | false |
| W050 | G4 goalsPerMatch | 3.231884 | 0.893021 | 0.159420 | [−0.478261, 0.869565] | false | false |
| W050 | G5 shotsPerMatch | 13.217391 | 3.652174 | 0.028986 | [−0.884058, 1.043478] | false | false |
| W050 | G7 ownedBallSampleShare | 0.347926 | 0.096137 | −0.003268 | [−0.018851, 0.012677] | false | false |
| W100 | **G1** backwardPassShare | 0.326467 | 0.090208 | −0.003068 | [−0.017060, 0.011217] | false | false |
| W100 | G2 passCompletion | 0.592215 | 0.163638 | 0.019294 | [0.001280, 0.037315] | true | false |
| W100 | G3 interceptionsPerMatch | 27.173913 | 7.508581 | −3.246377 | [−4.826087, −1.739130] | true | false |
| W100 | G4 goalsPerMatch | 3.231884 | 0.893021 | 0.043478 | [−0.521739, 0.637681] | false | false |
| W100 | G5 shotsPerMatch | 13.217391 | 3.652174 | 0.710145 | [−0.347826, 1.753623] | false | false |
| W100 | G7 ownedBallSampleShare | 0.347926 | 0.096137 | 0.003867 | [−0.015234, 0.022826] | false | false |
| D13-W050 | **G1** backwardPassShare | 0.327198 | 0.090410 | 0.000105 | [−0.015174, 0.015072] | false | false |
| D13-W050 | G2 passCompletion | 0.604002 | 0.166895 | 0.004790 | [−0.012923, 0.021184] | false | false |
| D13-W050 | G3 interceptionsPerMatch | 29.710145 | 8.209382 | −1.028986 | [−2.637681, 0.623188] | false | false |
| D13-W050 | G4 goalsPerMatch | 2.710145 | 0.748856 | 0.072464 | [−0.492754, 0.579710] | false | false |
| D13-W050 | G5 shotsPerMatch | 12.913043 | 3.568078 | −0.072464 | [−1.130435, 0.942029] | false | false |
| D13-W050 | G7 ownedBallSampleShare | 0.371200 | 0.102568 | 0.001450 | [−0.012596, 0.016577] | false | false |

ARMED-ZERO's every guard Δ is exactly 0.000000 with the interval [0.000000, 0.000000] and
nothing resolved — the identity arm.

**G6, THE OFFSIDE FLAG (#157 form — flips no gate).** Δ per arm: ARMED-ZERO 0.000000 · W025
−0.289855 · W050 −0.275362 · W100 −0.144928 · D13-W050 −0.043478; **not one of them resolved**.
The flag raises on a resolved **INCREASE**, so `noOffsideFlagOnAnyDeltaArm` is a STORED boolean
and it is **true**.

**THE BAND.** `everyGuardHeldOnEveryDose` and `everyGuardHeldOnEveryDeltaArm` are STORED
booleans and both are **true**: no gating guard breached on any arm, at any dose. Six guard
ROWS resolved a movement — G2 and G3 on each of W025, W050 and W100 — and every one of them
moved the SAFE way (completion UP, interceptions DOWN). On the D13 pair nothing resolved.

**LOO** — scoped to its own ten rows (R1 per Δ-arm and `kickDown` per Δ-arm), 69 seeds dropped
one at a time: **no row flips**, on either direction, on any arm; the largest single-seed
influence share over those ten rows is 0.036683.

---

## §R3 THE SECONDARIES (published, never gating)

| arm | own-openness (ALL) | shell fired | substituted | `chosenGid = −1` | mean pass distance (m) | passes/match | 撞车 |
|---|---|---|---|---|---|---|---|
| ABSENT | 0.807635 | 0.241741 | 0.380490 | 0.030471 | 14.492657 | 74.579710 | 0.480113 |
| ARMED-ZERO | 0.807635 | 0.241741 | 0.380490 | 0.030471 | 14.492657 | 74.579710 | 0.480113 |
| W025 | 0.873700 | 0.194467 | 0.368389 | 0.023810 | 14.347704 | 71.246377 | 0.471220 |
| W050 | 0.887041 | 0.194808 | 0.355331 | 0.028504 | 14.141420 | 73.130435 | 0.458118 |
| W100 | 0.918761 | 0.185584 | 0.345593 | 0.022250 | 14.210265 | 68.565217 | 0.470223 |
| D13-ABSENT | 0.799628 | 0.258935 | 0.395997 | 0.025233 | 14.117331 | 81.101449 | 0.513545 |
| D13-W050 | 0.893415 | 0.209613 | 0.396016 | 0.021460 | 13.669135 | 79.304348 | 0.505848 |

**THE SEAM'S OWN FACE — the chosen lane's own-openness BY FAMILY** (LN-C1's CALLED
reconstruction; expected UP):

| family | ABSENT | ARMED-ZERO | W025 | W050 | W100 | D13-ABSENT | D13-W050 |
|---|---|---|---|---|---|---|---|
| LEGACY-outfield | 0.899051 | 0.899051 | 0.953568 | 0.967831 | 0.992634 | 0.894139 | 0.973281 |
| SUBSTITUTED | 0.793488 | 0.793488 | 0.831534 | 0.843064 | 0.888563 | 0.776136 | 0.850286 |
| KEEPER-pass | 0.799889 | 0.799889 | 0.902167 | 0.908661 | 0.965222 | 0.795352 | 0.919114 |
| THROUGH-BALL | 0.790248 | 0.790248 | 0.754378 | 0.734919 | 0.718126 | 0.787677 | 0.748394 |
| CUTBACK | 0.858100 | 0.858100 | 0.838804 | 0.829846 | 0.850636 | 0.828783 | 0.860506 |
| **KICKOFF-PLAYBACK** | **0.439437** | **0.439437** | **0.869416** | **0.965509** | **0.998637** | **0.437027** | **0.974911** |

⚠ THROUGH-BALL and CUTBACK are the two families the seam prices at NO site (the through-ball and
cutback scorers are untouched by LN-T0). No stored boolean asserts anything about their
direction; their rows are printed here as a receipt of what an unpriced site looks like beside a
priced one.

**THE SHELL, BY FAMILY** (`groundShellHazard` CALLED on the struck lane — does the graded price
empty the binary shell?): KICKOFF-PLAYBACK falls 0.797721 → 0.426934 → 0.329670 → 0.300000
across ABSENT / W025 / W050 / W100 (D13-ABSENT 0.803738 → D13-W050 0.250000); SUBSTITUTED
0.358529 → 0.309221 → 0.321807 → 0.298042; LEGACY-outfield 0.012107 → 0.010975 → 0.012422 →
0.005295; the two unpriced families do not fall monotonically (THROUGH-BALL 0.385246 → 0.348052
→ 0.333333 → 0.412037; CUTBACK 0.312500 → 0.258152 → 0.304348 → 0.266667).

**THE EXECUTABILITY RECEIPT.** The factor touches no executability, and the table above is the
receipt: the `chosenGid = −1` rate moves from 0.030471 on ABSENT to 0.023810 / 0.028504 /
0.022250 across the three doses, and the perceived substitution rate from 0.380490 to 0.368389 /
0.355331 / 0.345593. Both are published, neither gates.

### ⭐ THE DEMOTED CONJUNCT, PUBLISHED (AMENDMENT (a))

The share of each UNTRACED family's measured ground passes that CARRY a ledger row, per arm —
the quantity LN-T1′ asserted to be zero inside `gFaces`:

| arm | KEEPER-pass | THROUGH-BALL | CUTBACK | KICKOFF-PLAYBACK | OTHER | identity (observation) |
|---|---|---|---|---|---|---|
| ABSENT | 0.000000 (0/499) | 0.000000 (0/366) | 0.000000 (0/320) | 0.000000 (0/351) | NaN (0/0) | true |
| ARMED-ZERO | 0.000000 (0/499) | 0.000000 (0/366) | 0.000000 (0/320) | 0.000000 (0/351) | NaN (0/0) | true |
| W025 | 0.000000 (0/454) | 0.000000 (0/385) | 0.000000 (0/368) | 0.000000 (0/349) | NaN (0/0) | true |
| W050 | 0.000000 (0/447) | 0.000000 (0/441) | 0.000000 (0/391) | 0.000000 (0/364) | NaN (0/0) | true |
| **W100** | 0.000000 (0/434) | 0.000000 (0/432) | 0.000000 (0/360) | **0.002778 (1/360)** | NaN (0/0) | **false** |
| **D13-ABSENT** | 0.000000 (0/519) | 0.000000 (0/424) | 0.000000 (0/371) | **0.006231 (2/321)** | NaN (0/0) | **false** |
| **D13-W050** | 0.000000 (0/496) | 0.000000 (0/450) | 0.000000 (0/382) | **0.003086 (1/324)** | NaN (0/0) | **false** |

The disagreement is again **only** in KICKOFF-PLAYBACK, and again by one or two passes. ⭐⭐
**BUT ONE OF THE THREE ARMS THAT CARRY IT IS `D13-ABSENT` — AN UN-ARMED CONTROL**, whose
`lnOwnLanePrice` key does not exist. LN-T1′ §DEVIATIONS 1 hypothesised that "the seam shifts
tick sequences on every armed arm, so a coincidence that never occurred in LN-C3's two un-armed
arms occurs once or twice here"; a stored `false` on an arm the seam never touched says the
coincidence is not the seam's doing. It is a property of the world at a kick-off, and the arm it
lands on is luck of the seed.

### ⭐ THE JOIN DIAGNOSIS, OFF THE ENGINE'S OWN RECORDS (AMENDMENT (b))

`joinDisagreement.tracedFamilyWithoutLedgerRow.share` is **0 on every arm** (0/5146 · 0/5146 ·
0/4916 · 0/5046 · 0/4731 · 0/5596 · 0/5472) — the direction that cannot happen, counted anyway.
`joinDisagreement.untracedFamilyWithLedgerRow.share`: 0 on ABSENT, ARMED-ZERO, W025 and W050;
0.000211 (1/4731) on W100; 0.000357 (2/5596) on D13-ABSENT; 0.000183 (1/5472) on D13-W050. **Four
rows in all**, and here they are:

| seed | arm | strike tick | passer | site | choice class | family | path | ledger row tick | `chosenGid` | `legacyGid` |
|---|---|---|---|---|---|---|---|---|---|---|
| 12,550,037 | W100 | 7382 | 11 | kickoffPlayback | arm | KICKOFF-PLAYBACK | substituted | 7255 | 9 | 10 |
| 12,550,036 | D13-ABSENT | 7557 | 11 | kickoffPlayback | arm | KICKOFF-PLAYBACK | legacyChosen | 7427 | 10 | 10 |
| 12,550,051 | D13-ABSENT | 7382 | 11 | kickoffPlayback | arm | KICKOFF-PLAYBACK | legacyChosen | 7251 | 9 | 9 |
| 12,550,049 | D13-W050 | 7382 | 11 | kickoffPlayback | arm | KICKOFF-PLAYBACK | substituted | 7242 | 7 | 10 |

And the engine's own wind-up ledger `[arms, evictions, struck, cancelledMate]` at the four
named ticks:

| seed / arm | at row tick − 1 | at row tick | at strike tick − 1 | at strike tick | `windupArmedNotStruckBeforeRestart` |
|---|---|---|---|---|---|
| 12,550,037 / W100 | [11, 0, 11, 0] | [12, 0, 11, 0] | [12, 0, 11, 0] | [12, 0, 12, 0] | **false** |
| 12,550,036 / D13-ABSENT | [24, 0, 24, 0] | [25, 0, 24, 0] | [25, 0, 24, 0] | [25, 0, 25, 0] | **false** |
| 12,550,051 / D13-ABSENT | [26, 0, 26, 0] | [27, 0, 26, 0] | [27, 0, 26, 0] | [27, 0, 27, 0] | **false** |
| 12,550,049 / D13-W050 | [31, 0, 31, 0] | [32, 0, 31, 0] | [32, 0, 31, 0] | [32, 0, 32, 0] | **false** |

**THE STORED BOOLEANS** (the list is non-empty, so they are written):
`everyDisagreementIsAKickoff` = **true** · `everyDisagreementHasAnUnstruckWindup` = **false** ·
`everyDisagreementIsAKickoffWithAnUnstruckWindup` = **false**.

**WHAT THE COUNTERS SAY.** On every one of the four rows: `arms` steps up by one **at the ledger
row's own tick** and does not move again; `struck` steps up by one **at the strike tick** and not
before. So between the choice and the strike a wind-up was **armed and then struck** — it was
NOT armed-and-left-hanging. The frozen predicate #395 item 4(i)(b) asked for
(`arms` up, `struck` flat) is therefore **false on every row**, and it is stated as false.

The shape the counters DO show is this: the ledger row and the wind-up arm land on the SAME
tick (the perceived chooser and `armPendingPass` run in the same brain decision); the strike
comes 127–140 ticks later; and at that later tick the engine's own restart state
`kickoffKickGid` still names this passer, so the frozen (kind, site) rule calls the strike
`kickoffPlayback` while the join — keyed on (choice tick, passerGid) — still finds the chooser's
row from before the stoppage. **The disagreement is a wind-up that survived a dead ball and
resolved on the kick-off**, not a wind-up that never resolved. ⚠ The counters are POOLED over
the match (both teams), so they say a wind-up armed at that tick and a wind-up struck at that
tick — not that it was THIS body's (§HONEST LIMITS 10).

⛔ **AND NONE OF THIS MOVES A FAMILY.** The assignment is by (kind, site) FIRST; `gFaces`
re-derived every family face, every Δ and every bin off the serialized artifact and all
1,728 / 1,728 face-and-Δ checks and 341 / 341 bin checks pass.

---

## §R4 THE D13 PAIR — THE FORM THE USER PLAYS

D13-W050 against its own control D13-ABSENT, on the same 69 seeds, dosed through the SHIPPED
loaders (bytes hashed by `gDoseSource`) and then the gene written on the anchored views:

- **R1**: control 0.089528 (501/5596) → arm 0.040022 (219/5472); Δ **−0.049506**, 95 %
  [−0.058276, −0.041392], \|Δ\|÷half-width 5.864480, `r1Down` **true**, `breach` **false**,
  LOO 0 flips.
- **`kickDown`**: Δ **−0.477212**, 95 % [−0.556479, −0.400082], **true**.
- The pair's own stored counterfactual word is **`read1`**.

The play form AGREES with the empty-book arms, at the same dose, on both faces.

---

## §R5 THE READS

Selector, from the STORED booleans: `Q = { W025, W050, W100 }` (every dose has `r1Down` and none
breached), so `Q` is non-empty and the selected read is **`read1`**. The smallest qualifying dose
is **W025**, weight **0.25**. `kickDown` holds at every dose, so H-LN-2's sentence is the REFUTED
one, at the smallest such dose, **0.25**.

> **THE PASSER SEES HIS OWN MEN AND THE CAROM FALLS — LN-ENTRY is named: world 14 = world 13 +
> the own-lane door at the SMALLEST qualifying dose.**
> ↳ the SMALLEST qualifying dose: **w = 0.25** · the D13 pair at 0.5 beside it:
> Δ −0.049506, 95 % [−0.058276, −0.041392], `read1`.
>
> **THE KICK-OFF TAP-BACK MOVED TOO (H-LN-2 refuted at w = 0.25).**

**THE COUNTERFACTUAL WORD PER ARM TAKEN ALONE** (the frozen rule applied to that arm's own
stored intervals): ARMED-ZERO **`read3`** · W025 **`read1`** · W050 **`read1`** · W100
**`read1`** · D13-W050 **`read1`**.

✅ **AND THE READ IS OF RECORD.** All 26 gates are green, the artifact is written to the
canonical path `docs/world-model/data/ln-t1pb-own-lane-exam.json`, and the sentence above is the
one the instrument SELECTED and STORED from the frozen literals. Naming LN-ENTRY is still the
commander's act, not this stage's.

---

## §R6 在说人话的层面

先说结论：**LN-T1′ 那张表是真的。** 重走一遍，换了新的种子块、新的 scratch 带、改了收据，
结论一个字没变——给传球者装上「看得见自己人」这只眼睛之后，他确实不再往自己人身上撞了。

世界 13 上，一脚落地传球第一个碰到的是自家非目标队友的比例，从 0.102798 降到 0.058788
（w = 0.25）、0.050337（w = 0.5）、0.039949（w = 1.0）——三档都降，三档都没有守门被打破，
用户实际在玩的那个 D13 形态从 0.089528 降到 0.040022，也一样。

最好看的还是**开球回敲**。那一脚过去是全场撞车最集中的地方：碰自己人的概率 0.575499，
占全部撞车的 0.381853。这一档的传球线路上「自己人的开阔度」原本只有 0.439437 ——半个队都堵在
球前面，而原来的评分器根本不看线。装上眼睛以后开阔度升到 0.869416 / 0.965509 / 0.998637，
撞车概率掉到 0.083333。**H-LN-2 又一次被推翻**：开球那一脚不是形状问题，是没长眼睛的问题。

代价那一栏还是空的：回传比例三档都没 resolve；进球、射门、控球、越位没有一条越过容差；
这次 resolve 的六行全是好消息（完成率升、抢断降）。要盯的是别的东西：每场传球数从 74.579710
掉到 68.565217（w = 1），传球更少也更短——这是要写进 LN-ENTRY 说明里的那句「代价先说」。

**跟 LN-T1′ 并排看**（它的表见 #395 item 2）：R1 的控制水平 0.100585 → 这次 0.102798；
w = 0.25 的 Δ −0.034048 → 这次 −0.044011；w = 1 的 Δ −0.057487 → 这次 −0.062849；开球回敲
0.582000 → 这次 0.575499，w = 1 上 0.071429 → 这次 0.083333。**两块独立的种子块，同一个方向，
同一个量级**，而且这一次每一个数都在绿色产物里。

至于那条红掉的收据：这次把它降级成了公开的收据，并且**真的去问了引擎**。答案不是当初猜的那个。
四条分歧行全部是开球回敲，全部是「上弦」那一类——但引擎的计数器说，那个上弦**打出去了**，
只是隔了一百多个 tick、隔了一次死球，打在开球那一脚上。所以它不是「上了弦没打出去」，
而是「上了弦，熬过了一次死球，在开球那一脚上打了出来」。⭐ **而且其中两条落在一条根本没上药的
控制臂上**——所以它跟这个 seam 没关系，是世界本来就有的巧合。

---

## §DEVIATIONS

1. ⭐⭐⭐ **THE FIVE DECLARED CHANGES ARE THE WHOLE OF THE DELTA FROM LN-T1′'s §P**, each stated
   as an amendment at §P.0 and marked at its site: **(a)** the conjunct
   `<arm>.partition.untracedFamiliesAreExactlyTheUntracedLedgerClass` DEMOTED from a `gFaces`
   assertion to a published receipt (the faces `ledgerRow.<FAMILY>.share` plus a stored per-arm
   observation); **(b)** the JOIN DIAGNOSIS off `match.o1WindupLedger`, itemised, with the
   frozen predicate `windupArmedNotStruckBeforeRestart` and the three stored booleans;
   **(c)** G-ARM's read-back PER TEAM at construction and at full time; **(d)** the final file
   hash and byte count carried by §GATES of this doc (the promise KEPT, not dropped); **(e)**
   G-REPRO-LNT1P. Nothing else in the protocol changed.
2. **THE INSTRUMENT IS A COPY, NOT AN IMPORT.** `scripts/probes/ln-t1pb-own-lane-exam.ts` is
   LN-T1′'s instrument file with the five changes and the renames/re-pointings they force: this
   stage's doc path, instrument path, artifact path, `stage` block (`id`, `title`,
   `authorizedBy`, `lineage`, `reRunOf`, `reRunOfArtifact`), env prefix (`LNT1PB_*`), block
   (12,550,000–999), scratch band (900,004,300–399), consumed ledger (LN-T1′ added), published
   frontier (#395 item 8) and registry (79). LN-T1′'s file is untouched, and G-REPRO-LNT1P is
   the receipt that the copy walks identically.
3. **N IS 69 HERE AND WAS 91 THERE.** The sizing smoke is this stage's own, on this stage's own
   fresh scratch band, and it measured a smaller half-width, so the same frozen rule at the same
   declared 0.01 absolute target asked for fewer seeds. N is bound by the SIZING, not by the
   block; the branch is STORED.
4. ⭐⭐ **THE FROZEN PREDICATE CAME OUT FALSE, AND IT IS REPORTED AS FALSE.**
   `windupArmedNotStruckBeforeRestart` is false on all four disagreement rows, so
   `everyDisagreementIsAKickoffWithAnUnstruckWindup` is false. The predicate was frozen at §P.0
   before any battery seed and was not touched after sight. What the counters do say is at §R3;
   the mechanism ruling #395 item 3 hypothesised is **not** what they show.
5. ⭐⭐ **THE DISAGREEMENT IS NOT A SEAM ARTEFACT.** Two of the four rows are on `D13-ABSENT`, an
   UN-ARMED control arm. LN-T1′ §DEVIATIONS 1's hypothesised limb — that the seam's tick-shifting
   is what makes the coincidence possible — does not survive that. Stated, not gated.
6. **THE `OTHER` FAMILY IS EMPTY BY THE FROZEN RULE**, so its `ledgerRow.OTHER.share` face, like
   its five sibling family faces, is NaN on 0/0 on every arm. `gClassesNonVacuous` exempts
   `OTHER` deliberately — an empty `OTHER` is a RESULT of the rule, not a gap in it. ARMED-ZERO's
   `|Δ|÷half-width` is stored `null` for the same arithmetic reason (0/0).
7. **The read literals are not interpolated.** Ruling #394 item 4(v) gives READ 1 and READ 2 as
   sentences and asks separately that the smallest qualifying dose and the breaching guard be
   stored. The instrument therefore stores the sentences VERBATIM and prints the dose / guard on
   a SEPARATE annotation line beneath, as stored fields, rather than splicing them into the
   literal. The H-LN-2 refuted literal keeps its `<w>` slot, which the ruling puts inside the
   sentence. *(Inherited from LN-T1′ §DEVIATIONS 3.)*
8. **One look-pressure counter is censored, not published.** #394 item 3(ii) forbids reading a
   look-pressure face off an armed arm. The per-seed row keeps `cpBlindRead` so G-REPRO-LNC3 can
   match LN-C3's ABSENT-arm field, books it on UN-ARMED arms only, and publishes it as NO face.
   It is consequently a STATED exclusion in FLAG-HYGIENE's field comparison, whose byte-identity
   claim rests on the WHOLE-MATCH SIGNATURE (rng stream state included), compared and identical
   on 69 / 69 seeds. *(Inherited from LN-T1′ §DEVIATIONS 4.)* ⭐ AMENDMENT (c)'s eight per-team
   gene fields are excluded from FLAG-HYGIENE by name for the same reason LN-T1′'s four pooled
   ones are: they ARE the arm definition. The diagnosis rows and counts of AMENDMENT (b) are NOT
   excluded and were identical on every seed.
9. **The LN-C3 kick-off span values are READ, not typed.** The instrument opens LN-C3's banked
   artifact and reads `callGraphNodes.nodes[]` for `kickoffPlaybackScorer` rather than
   transcribing its hash. Stored: LN-C3 `63a82a04…c80a` (lines 261–296, 1,625 chars) vs this
   head `837a9e04…9867` (lines 278–322, 2,293 chars); `hashDiffers` is **true**, with the reason
   stored beside it. The banked census is untouched. *(Inherited from LN-T1′ §DEVIATIONS 5.)*
10. **The battery tail is declared, not walked.** Seeds 12,550,069–12,550,998 are the DECLARED
    unwalked tail; the block is consumed whole of record.
11. **No other deviation.** Nothing under `src/` or `tests/` was created or edited;
    `PROGRAMME.md`, `PROGRAMME-RULINGS.md`, `PROGRAMME-LOG.md`, `CANON.md`, every contract, and
    every other stage doc — LN-T1′'s doc and its RED artifact included — are untouched by this
    stage.

---

## §GATES

26 gates, **26 GREEN, 0 RED**. Notes derive from the same pinned values the gates check (canon
**gate notes derive**); the full notes are in the artifact's `gates` block.

| gate | verdict | the receipt it carries |
|---|---|---|
| `gWorld` | ✅ | `bqArmedVersion` 13 on every walked match; `lnOwnLanePrice` as CONSTRUCTED per arm; the gene as READ per arm; `edsPerceivedChoice` true; `traceChoice` true on the arms and false on the untraced twin |
| `gDoseSource` | ✅ | the D13 books' BYTES hashed against their pins before either dosed arm is built |
| `gAnchoredConstants` | ✅ | 103 anchored sites with line receipts, incl. LN-T0's whole seam and the ZERO-occurrence anchor proving `a4World.ts` never names the flag or the gene |
| `gCodeFactGraph` | ✅ | the EXTRACTED call graph over the three price sites, the scope site and the seat module — 53 nodes, hashes distinct, the graph STORED beside the booleans |
| `gWalkFixtures` | ✅ | 168 / 168 walk-side predicate fixtures |
| `gShellFixtures` | ✅ | the shipped `groundShellHazard` and `laneOpenness` CALLED on hand-built geometries |
| `gClassesNonVacuous` | ✅ | no face computed on an empty class, on all seven arms (`OTHER` deliberately exempt — an empty `OTHER` is a RESULT of the frozen rule) |
| `gLockstep` | ✅ | the instrument installs no wrapper: 14 arm × scratch-seed walks, observed ≡ unobserved — the per-tick wind-up-ledger snapshot of AMENDMENT (b) included |
| `gLockstepTrace` | ✅ | the ledger is BYTE-INERT at this head **and under the dose** |
| `gFlagHygiene` | ✅ | ARMED-ZERO ≡ ABSENT on 69 / 69 seeds, 163 row fields each, whole-match signature incl. the RNG STREAM STATE |
| `gArm` | ✅ | the gene reads back as the arm's dose off `effGenome` AND `baseGenome` of both teams on every dosed seed; `info.genome` carries no gene on any arm; ⭐ **AMENDMENT (c)**: the same read-back PER TEAM (side 0 and side 1 separately) at CONSTRUCTION and at FULL TIME, `perTeamOk` true; liveness — ABSENT vs W100 differs on 69 / 69 seeds |
| `gReproLnc3` | ✅ | **1,872 field comparisons, 0 mismatches** on LN-C3's own 12,548,000–011 re-walked on ABSENT with the trace ON — the DORMANCY receipt in the census's own arithmetic |
| **`gReproLnt1p`** | ✅ | ⭐ **AMENDMENT (e)** — LN-T1′'s own 12,549,000–011 re-walked on ALL SEVEN ARMS: **13,944 field comparisons (166 shared fields × 12 seeds × 7 arms), 0 mismatches on every arm.** Excluded: the one shared field `wallMs`; and the 11 fields this instrument ADDS, absent from LN-T1′'s cells and so not shared at all (`lnEffBySideAtConstruction`, `lnBaseBySideAtConstruction`, `lnInfoBySideAtConstruction`, `lnInfoKeyBySideAtConstruction`, `lnEffBySideAtFullTime`, `lnBaseBySideAtFullTime`, `lnInfoBySideAtFullTime`, `lnInfoKeyBySideAtFullTime`, `joinDisagreements`, `joinUntracedFamilyWithLedgerRow`, `joinTracedFamilyWithoutLedgerRow`) |
| `gSrcUntouched` | ✅ | X-SRC-ZERO — `git diff --stat HEAD` and `git status --porcelain` both empty over `src/` AND `tests/` on the run that wrote the artifact |
| `gSeedsBookedEqualWalked` | ✅ | BOOKED = WALKED off the cells' own distinct seeds: 980 walks booked; the tail declared |
| `gSeedDisjoint` | ✅ | the block base equals the published frontier at #395 item 8; disjoint from every consumed block, LN-T1′'s included; both re-walk sets lie inside their own already-consumed blocks and are DECLARED re-walks |
| `xDet` | ✅ | the whole core walked TWICE — pass 1 and pass 2 digests identical (`2a042bfc…d4b1`) |
| `xFpProd` | ✅ | the production fingerprint recomputed in-probe: `57b0bdab389122af…` **UNCHANGED** |
| `gTwoFractions` | ✅ | every published face carries its own numerator and denominator and equals their ratio |
| `gLoo` | ✅ | 10 LOO rows, all finite, no flips |
| `gN` | ✅ | the walked n equals the frozen N (69), on the canonical path with no override declared |
| `gReproduceCrowd` | ✅ | 撞车's two quantities recomputed by a second, independently shaped implementation |
| `gFaces` | ✅ | **1,728 / 1,728** face-and-Δ checks and **341 / 341** bin checks re-derive off the SERIALIZED artifact. ⭐ **AMENDMENT (a)**: the untraced-family identity is no longer among them; in its place the per-arm ledger-row receipt's ARITHMETIC, the stored identity OBSERVATION and the diagnosis list's own length are re-derived |
| `gReadWords` | ✅ | every selector boolean, Q, the smallest qualifying dose, both sentences and every counterfactual word re-derived off disk |
| `gStage` | ✅ | `stage.instrument` written from the instrument's own path constant and `stage.instrumentSha256` = `697126de…80d8`, compared to the running file's bytes |
| `gHashOrder` | ✅ | the body hash computed after every body key, `allGreen` inside the allowlist, all 46 body keys enumerated, and a NON-body `receipts.hashReproducesFromFile` |

**THE FINAL FILE** — ⭐ **AMENDMENT (d)**, the promise the artifact's `receipts` block makes to
this section, recomputed with `shasum -a 256` and `wc -c` on the committed artifact after the
final write: `docs/world-model/data/ln-t1pb-own-lane-exam.json` — sha256
`609ceef1d06b373a1372a0cab0ddc81241854340bdf51d0a5933193ab8e77433`, **5,059,859** bytes; the
hashed body is `cd00378a630846d62865ec91bc89498392078b2735a552a3a67b3fd4c05b837e`.
**G-REPRO-LNT1P**: 166 shared fields per arm per seed, 13,944 comparisons, **0 mismatches**.
Battery wall: 154.775 s.
