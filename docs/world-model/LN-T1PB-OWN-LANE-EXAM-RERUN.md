# LN-T1′b — 「传球者看见自己人 · 考试 · 重走」 THE OWN-LANE EXAM, RE-RUN

> **STATUS: FREEZE — §P AND THE INSTRUMENT ARE FROZEN AT THIS COMMIT. NO BATTERY SEED HAS BEEN
> WALKED.** This is the FREEZE commit of a freeze-before-sight exam (canon
> **freeze-before-battery**: "freeze the instrument commit BEFORE the battery; artifact records
> the instrument hash"). §P below and `scripts/probes/ln-t1pb-own-lane-exam.ts` are byte-frozen
> at this commit and are never edited after sight; the §DEV-PREFLIGHT scratch smoke that sized
> N is DISCLOSED in full, and it ran on the out-of-band scratch band only (900,004,300–399 —
> canon **verifier scratch seeds**).
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

*(§R1–§R6, §DEVIATIONS and §GATES are written at the RESULTS commit, after the battery. §P and
the instrument are byte-frozen here and are not edited after sight.)*
