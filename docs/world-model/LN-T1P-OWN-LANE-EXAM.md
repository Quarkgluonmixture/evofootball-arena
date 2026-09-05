# LN-T1′ — 「传球者看见自己人 · 考试」 THE OWN-LANE EXAM

> **STATUS: RESULTS — THE BATTERY IS WALKED (91 seeds × 7 arms, block
> 12,549,000–090, construction receipt 12,549,999). §P and the instrument were
> FROZEN at the previous commit and are byte-identical here; §DEV-PREFLIGHT was
> DISCLOSED before the first battery seed. ⛔ ONE GATE IS RED — `gFaces`, on THREE
> inherited partition-receipt checks, on the three armed E13/D13 dose arms — so the
> artifact is routed to `…-exam.json.RED.json` and THE READ IS NOT OF RECORD until
> the commander disposes of it. §DEVIATIONS 1 is the whole of it.** This was the
> FREEZE commit of a
> freeze-before-sight exam (canon **freeze-before-battery**: "freeze the instrument
> commit BEFORE the battery; artifact records the instrument hash"). §P below and
> `scripts/probes/ln-t1p-own-lane-exam.ts` are byte-frozen at this commit and are
> never edited after sight; the §DEV-PREFLIGHT scratch smoke that sized N is
> disclosed in full, and it ran on the out-of-band scratch band only
> (900,003,900–999 — canon **verifier scratch seeds**).
>
> Authorized by **COMMANDER RULING #394 item 4**. Contract:
> [`LN-OWN-LANE-CONTRACT.md`](LN-OWN-LANE-CONTRACT.md) §3 (the exam form) and §4
> (the non-claims). The seam under exam:
> [`LN-T0-OWN-LANE-PRICE.md`](LN-T0-OWN-LANE-PRICE.md).
>
> Instrument: `scripts/probes/ln-t1p-own-lane-exam.ts` ·
> Artifact: `docs/world-model/data/ln-t1p-own-lane-exam.json`.

---

## §0 WHAT THIS IS, AND WHY

Five censuses (LN-C0 → LN-T1 → LN-C1 → LN-C2 → LN-C3) ended on one mechanism: **the
passer's pricers do not see his own men.** LN-T0 built the graded read they were
missing — `ownLaneOpenness` (the shipped `laneOpenness` CALLED on own outfield minus
the passer minus the target) priced `w · (1 − openness)` at three sites — behind a
flag that is default OFF and a gene born ABSENT. Nothing shipped. The world is
byte-identical with the flag off.

This stage asks the ONE question the commander dispatched, quoted from ruling #394
item 4:

> "does the own-lane price, at doses w ∈ {0.25, 0.5, 1.0}, lower the user's own face
> — a measured ground pass whose FIRST body is an own NON-target teammate
> (`firstBody.ownNonTarget`) — on world 13, without breaking a guard, and does the
> kick-off tap-back's carom move (H-LN-2)?"

⛔ **IT IS AN EXAM, AND IT ARMS NOTHING.** The flag stays default OFF. World 12 and
world 13 bytes are untouched. `a4World.ts` never names the flag or the gene (an
anchored ZERO-occurrence receipt, §P.9). The production fingerprint
`57b0bdab…c673` is recomputed in-probe and must be UNCHANGED. **X-SRC-ZERO**: this
stage creates and edits NO file under `src/` or `tests/`, gated both ways
(`git diff --stat HEAD` and `git status --porcelain`) on the run that writes the
artifact. **Nothing ships.** The exam prints frozen literals selected by stored
booleans and hands the commander a table.

⛔ **NO LOOK-PRESSURE FACE IS READ OFF AN ARMED ARM** (#394 item 3(ii)). With the
`ownLaneFactor` hook live, the trace's `options[].price` is the **priced** value and
`blindOutpricesRead` / `blindOutpricesBand` are ASYMMETRIC between arms. This
instrument reads off the armed trace ONLY `chosenGid` / `legacyGid` (the path class)
and `tick` / `passerGid` (the join). The one look-pressure counter that survives in
the per-seed row is booked on UN-ARMED arms only, is published as no face at all,
and exists solely so G-REPRO-LNC3 can match LN-C3's own ABSENT-arm field; it is a
STATED exclusion in FLAG-HYGIENE's field comparison, whose byte-identity claim rests
on the whole-match signature (rng stream state included).

---

## §P THE FROZEN PROTOCOL

> Frozen at this commit, before any battery seed. Every constant below is either
> ANCHOR-EXTRACTED from `src/**` (or from an ancestor instrument) with a line
> receipt, or QUOTED from a banked artifact by field name. Canon **anchored
> extraction**: "a src-extracted constant pins its extraction to the NAMED call site
> — anchored match + line receipt — never first-occurrence".

### §P.1 THE ARMS — SEVEN, PAIRED ON SHARED SEEDS

All seven arms are built by ONE constructor, which is LN-C3's `buildMatch` byte for
byte (the composer CALLED, never a copied flag set): `a4MatchFlags(13)` +
`armA4World(m, null, 13)` for the E13 book, and `armA4World(m, null, 13, L3_DOSE,
PC_DOSE)` for the D13 book. `traceChoice: true` is passed EXPLICITLY on every walked
arm — the run envelope REFUSES the `EDS_TRACE_CHOICE` env door outright.

| arm | book | `lnOwnLanePrice` | `lnOwnLaneWeight` | what it is |
|---|---|---|---|---|
| **ABSENT** | E13 | *no key at all* | absent | the control — LN-C3's E13 arm exactly |
| **ARMED-ZERO** | E13 | `true` | absent | the IDENTITY arm (FLAG-HYGIENE) |
| **W025** | E13 | `true` | 0.25 | |
| **W050** | E13 | `true` | 0.5 | the shell's own weight, the reference dose |
| **W100** | E13 | `true` | 1.0 | the ceiling; the variance source |
| **D13-ABSENT** | D13 | *no key at all* | absent | the form the user plays — the pair's control |
| **D13-W050** | D13 | `true` | 0.5 | the play-form receipt, printed beside the read |

Δ is taken PAIRED on the shared seed against the arm's OWN control: the five E13
arms against ABSENT; D13-W050 against D13-ABSENT.

⭐ **ARMED-ZERO IS NOT A DOSE.** FLAG-HYGIENE requires it to be byte-identical to
ABSENT, so its every Δ is exactly 0 and it can never be a dose of record. Its
booleans are STORED anyway.

### §P.2 THE DOSE PLACEMENT — WITH ITS ANCHOR

Canon **dose placement**, VERBATIM: "dose NEVER in info.genome; truth-dosing writes
census values through the effective genome."

The anchor chain (each line pinned at §3 of the instrument with its line receipt):

1. `PlayerBrain.decideCarrier` reads **`const g = team.genome;`** two lines after
   `team` is bound, and in world 13 `inSnapshotLaw` is OFF (gated by `gWorld`), so
   `team` IS the truth `Team` object.
2. `Team`'s own accessor is **`get genome(): TacticalGenome { return this.effGenome; }`**
   — a FIELD, not `info.genome`.
3. `Match` REBUILDS the field at every brain tick:
   **`team.effGenome = applyMentality(team.baseGenome, team.mentality);`** — a dose
   written only on `effGenome` would be erased the first time the coach's mentality
   moved.
4. `applyMentality` SPREADS its input (`...raw`), so a gene it does not name
   survives the rebuild.

⇒ **THE DOSE IS WRITTEN ON `baseGenome` AND `effGenome`, AS COPIES, ON BOTH TEAMS,
AND NEVER ON `info.genome`** — the ratified weight-setting idiom (#334 item 1).

⚠ **THE T0 SUITE'S THREE-VIEW IDIOM IS NOT FOLLOWED, AND HERE IS WHY.**
`tests/lnOwnLane.test.ts` writes the gene on all three views (`info.genome`
included) because a unit pin wants the value wherever it is read and its `Match`
dies with the assertion. This exam runs inside the league's own construction path:
`info.genome` is the FRANCHISE'S OWN OBJECT, and `crossoverGenomes` copies a present
gene from parent A even with the evolution opt-in shut (contract §2 M-LN.2), so
writing it would open the Lamarck channel the contract names as a LATER slice.

**RECEIPT (`gArm`)**: the SHIPPED accessor `lnOwnLaneWeightOf` is CALLED and read
back off `effGenome` AND `baseGenome` of BOTH teams on EVERY walked match and equals
the arm's dose; read off `info.genome` it is 0 and the KEY IS ABSENT, on every arm
and every seed. LIVENESS: the whole-match signature differs ABSENT vs W100 on every
seed (or the count of differing seeds is published).

### §P.3 THE POPULATION AND THE CLASSES — INHERITED, RE-ANCHORED

- **The population**: PT-C0's measured ground passes, byte for byte (the population
  ladder, the class ladder, the flight retire cap).
- **The first-body channel**: LN-C0's, off the engine's own record `ball.lastTouch`
  — canon **engine ledgers before heuristics**.
- **The choice tick and the aim of record**: LN-C1's, INHERITED — where a wind-up
  record exists the ARM TICK is the choice tick, else the RELEASE tick is; the
  `dxStrikeAim` lead is the aim of record for synchronous strikes; a class with no
  establishable choice tick is COUNTED, never imputed.
- **The path classes**: LN-C2's, off `match.passChoiceTrace` —
  `legacyChosen · legacyNoOption · substituted · untraced`.
- **The family rule**: LN-C3's, INHERITED as a deterministic function of four record
  fields — **KICKOFF-PLAYBACK · SUBSTITUTED · LEGACY-outfield · KEEPER-pass ·
  THROUGH-BALL · CUTBACK · OTHER**, over the strike sites
  `arm · ledSynchronous · toFeetSynchronous · cutback · throughBall ·
  kickoffPlayback`.

⭐ **THE KICK-OFF SCORER'S SPAN IS RE-ANCHORED AT THIS HEAD, AND LN-C3'S STORED HASH
DIFFERS.** LN-T0's site (b) added ONE statement inside the span and `const s` became
`let s`. LN-C3's stored span values are READ out of its banked artifact
(`callGraphNodes.nodes[]` where `name === "kickoffPlaybackScorer"`) — never re-typed
— and compared to this head's freshly hashed span; the difference is a STORED
boolean (`lnC3KickoffSpan.hashDiffers`) with the reason beside it. The line anchors
are pinned afresh here. **The banked census is untouched.**

### §P.4 THE PRIMARY RULER R1

**R1 = `firstBody.ownNonTarget`** over ALL measured ground passes: the share whose
FIRST body (the `ball.lastTouch` channel) is an own NON-target teammate. Paired Δ vs
the arm's control per dose. **DOWN resolved = helpful** — the 95 % cluster-bootstrap
interval (2,000 draws, seeded from the block base) excludes zero on the helpful
side. Stored per dose: `r1Down(w)`, `r1Up(w)`, the Δ, the interval, the half-width,
|Δ|÷half-width and the LOO flips.

**THE PRIOR, QUOTED BY FIELD NAME** from LN-C3's banked artifact on its E13 arm:
`firstBody.ownNonTarget` = 0.10080881491032705 (860 / 8,531). ⚠ It is the PRIOR.
**This exam's own ABSENT arm is the control**, and every Δ is taken against it.

**PUBLISHED BY FAMILY**: per arm, `P(carom | family)` and the family's share of ALL
caroms. The **KICKOFF-PLAYBACK** family's own paired Δ on its carom rate is stored
per dose as **`kickDown(w)`** (DOWN resolved) — **H-LN-2's probe**. LN-C3's E13
priors, quoted by field: `family.KICKOFF-PLAYBACK.caromRate` =
0.5941780821917808 (347 / 584) and `family.KICKOFF-PLAYBACK.passShare` =
0.06845621849724534 (584 / 8,531).

### §P.5 THE SECONDARIES — PUBLISHED, NEVER GATING

The chosen lane's own-openness (LN-C1's CALLED reconstruction) by family and dose —
the seam's own face, expected UP; the shell-fired share (the shipped
`groundShellHazard` CALLED on the struck lane) by dose; the perceived substitution
rate and the `chosenGid = −1` rate (the factor touches no executability — expected
UNCHANGED, a receipt); the mean pass distance and passes per match; 撞车 (LN-C0's
crowd face) beside; LN-C3's path and family faces reproduced on ABSENT.

### §P.6 THE GUARDS (F-LN′-b) — WITH THEIR HARMFUL DIRECTIONS

Tolerance form, frozen ex ante: **tolerance = NI_FRACTION · |control level|**, with
`NI_FRACTION = 1 − 0.275 / 0.380` **INHERITED BY ANCHOR** from
`scripts/probes/ln-t1-lane-exam.ts`'s own line and EVALUATED FROM ITS TWO NUMERALS —
never typed as a decimal here or in the instrument (the same expression is anchored a
second time in OBM-T1's probe, its origin, and the two evaluations must agree).
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

**G1's predicate is the chooser's own form, ANCHORED and CALLED** on the struck aim
of record with the passer's `localX` at the choice:
`gain = clamp01((team.localX(aim.x) - localX + 30) / 60) * 2 - 1` — the line inside
`groundCandidate` (`src/ai/PlayerBrain.ts`, pinned with its line receipt), plus the
line the form subtracts, `const localX = team.localX(p.pos.x);`. G1 is FIRST because
of LN-C1's warning: the own-clear alternative points BACKWARD on 0.570033 of the
passes that had one, so a price on our own bodies in the lane could buy its lane's
clearance by turning the ball round. The BREACHING GUARD NAMES are stored per dose.

### §P.7 THE READS — FROZEN LITERALS ON STORED BOOLEANS

`Q = { w ∈ {0.25, 0.5, 1.0} : r1Down(w) ∧ ¬breach(w) }`.

- **READ 1** — Q non-empty ⇒
  *"THE PASSER SEES HIS OWN MEN AND THE CAROM FALLS — LN-ENTRY is named: world 14 =
  world 13 + the own-lane door at the SMALLEST qualifying dose."*
  The smallest w in Q is a STORED FIELD printed on its own annotation line beneath
  the sentence, never spliced into the literal. The D13 pair at 0.5 prints beside it
  as the play-form receipt, with its own paired Δ and interval.
- **READ 2** — Q empty, some w with `r1Down ∧ breach` ⇒
  *"THE CAROM FALLS BUT A GUARD BREAKS — the dose is disqualified; the commander
  decides with the table."* The breaching guard names are the stored annotation.
- **READ 3** — no `r1Down` at any dose ⇒ **F-LN′-a**
  *"THE PRICE MOVES NOTHING THE USER SEES — the seam stays dormant; the commander
  decides with the table."*

**BESIDE EVERY READ, H-LN-2's OWN SENTENCE**, on a stored boolean over the doses:

- `kickDown` at NO dose ⇒ *"THE KICK-OFF TAP-BACK DID NOT MOVE — the restart SHAPE
  is named (H-LN-2 holds)."*
- `kickDown` at some dose ⇒ *"THE KICK-OFF TAP-BACK MOVED TOO (H-LN-2 refuted at
  <w>)."* with the SMALLEST such w.

**STORED**: the selector booleans per arm, the selected read key and sentence, Q,
the smallest qualifying dose and its weight, the **counterfactual word per dose arm
taken alone** (canon **counterfactual words are stored**), the D13 pair's own word,
and every universal as a BOOLEAN (`everyDoseHasR1Down`, `noDoseHasKickDown`,
`everyGuardHeldOnEveryDose`, …) — canon: "a universal sentence about a table … is a
stored boolean or is not written". No percentage in prose restates a stored share;
no literal count of the sweep is written; the LOO sentence is scoped to its rows.

### §P.8 SIZING, SEEDS, STATS

- **Block 12,549,000–999** is this stage's, verified FRESH against the published
  frontier of record at #394 item 7 (next sim ≥ 12,549,000). Consumed: LN-C0
  12,544,000–999 · LN-T1 12,545,000–999 · LN-C1 12,546,000–999 · LN-C2
  12,547,000–999 · LN-C3 12,548,000–999.
- **Construction receipt** at 12,549,999 (the block top); battery from 12,549,000;
  BOOKED = WALKED, and the unwalked tail is DECLARED.
- **RE-WALKS, NOT CONSUMPTION**: LN-C3's own 12,548,000–011 are re-walked on the
  ABSENT arm for G-REPRO-LNC3.
- **Scratch (out of band, ≥ 900,000,000)**: the 12-seed sizing smoke on
  900,003,900–911 within the declared band 900,003,900–999; its receipt seed
  900,003,920; the world pin 900,003,970; the lockstep twins 900,003,990–991.
- **Sizing form** (the house form, shown): `se(n) = hw(n)/z.975` ·
  `se(needed) = |target|/(z.975 + z.80)` · `N = ceil(n · (se(n)/se(needed))²)` ·
  `MDE(N) = hw(n)·√(n/N)·(z.975+z.80)/z.975`, at a **DECLARED 0.01 ABSOLUTE target**
  on R1's paired Δ, with the **CEILING arm W100** as the variance source (LN-T1's
  form). `N = min(nRequired, the block's affordance)`; if the sizing asks for more
  than the block holds, N = the affordance and the MDE at N is published. The bound
  branch is STORED, not typed.
- **STATS**: ZERO consumed. Every interval is a CLUSTER BOOTSTRAP over match seeds,
  2,000 draws, seeded from the block base.
- **Registry 78** at this freeze.

### §P.9 THE GATE SET

The house set — X-DET (the whole core walked twice, digests compared) · X-FP-PROD
(the production fingerprint recomputed in-probe through the shipped
`League`/`runHeadless` path, baseline inherited by anchor) · X-SRC-UNTOUCHED over
`src/` **and** `tests/`, both `git diff --stat HEAD` and `git status --porcelain`
(canon **xSrcUntouched**) · SEED-DISJOINT against the published ledger · gN ·
gFaces re-derived off the SERIALIZED artifact (canon **gFaces-from-disk**) ·
gReadWords · gHashOrder (the body hash computed LAST, `allGreen` INSIDE the
allowlist, a NON-body `receipts.hashReproducesFromFile`, EVERY non-body key
enumerated — canon **hash receipt outside the body**, **hashed-body exclusion /
allowlist**) · BOOKED = WALKED · LOO on R1 per dose and on `kickDown` ·
two-fractions (every published face carries its own numerator and denominator and
its value is exactly their ratio) — PLUS:

- **gStage** — the artifact's `stage.instrument` is written from THIS instrument's
  own path constant and `stage.instrumentSha256` is compared to the bytes of the
  file at that path, read at run time (LN-C3 §COMMANDER CORRECTIONS item 1: the
  ancestor shipped its PREDECESSOR's instrument receipt).
- **FLAG-HYGIENE** — ARMED-ZERO ≡ ABSENT on EVERY seed, the whole-match signature
  including the RNG STREAM STATE compared, with the excluded fields stated.
- **G-ARM** — §P.2's receipt, plus the liveness divergence ABSENT vs W100.
- **gLockstepTrace** — the ledger is BYTE-INERT re-proved at this head AND under the
  dose: the same arm at the same out-of-band scratch seed, once with
  `traceChoice: true` and once without, byte-identical.
- **G-REPRO-LNC3** — LN-C3's seeds 12,548,000–011 RE-WALKED on ABSENT with the trace
  ON, matched FIELD FOR FIELD against every `perSeedCells[].E13` field this exam
  also computes; the field count is stored. **0 mismatches is the DORMANCY receipt
  in the census's own arithmetic.**
- **gCodeFactGraph** — canon **code facts over the call graph**, VERBATIM: "…the
  callee list is EXTRACTED from the hashed text — every identifier called within the
  span, resolved to its definition and hashed — never typed, and a declared edge
  absent from the text, or a call present in the text and absent from the graph, is
  RED". The roots are the THREE price sites, the scope site and the seat module
  (`ownLaneOpenness`, `ownLanePrice`, `ownLaneScopeGids`, `groundCandidate`, the
  kick-off span, `choosePerceivedPassTarget`); every other node is DISCOVERED from
  the stripped text. The graph is STORED beside the booleans.
- **gWorld** — `bqArmedVersion` 13 on every walked match; `lnOwnLanePrice` as
  CONSTRUCTED per arm; the gene as READ per arm; `edsPerceivedChoice` true;
  `traceChoice` true on the arms and false on the untraced lockstep twin.
- **gShellFixtures**, **gWalkFixtures**, **gClassesNonVacuous**,
  **gAnchoredConstants**, **gDoseSource** (canon **dose/data-source guards**: the
  D13 books' BYTES are hashed, not a self-declared field).

⛔ Every gate is a LIVENESS or RECEIPT gate. **No gate tests a direction.**

---

## §DEV-PREFLIGHT — THE DISCLOSED SCRATCH SMOKE AND THE SIZING

Run BEFORE this freeze commit, on the OUT-OF-BAND scratch band only. **No battery
seed was walked.** Command:
`LNT1P_MODE=smoke LNT1P_N=12 npx tsx scripts/probes/ln-t1p-own-lane-exam.ts`
(the override path is refused the canonical artifact name by the run envelope; it
wrote `/tmp/ln-t1p-own-lane-exam-override.json`).

- 12 scratch clusters, seeds **900,003,900–900,003,911**; receipt 900,003,920; world
  pin 900,003,970; lockstep twins 900,003,990–991 — all inside the declared band
  900,003,900–999.
- **ALL 25 GATES GREEN** on the smoke, including X-DET, X-FP-PROD, FLAG-HYGIENE
  (ARMED-ZERO ≡ ABSENT, signature with rng state, 12/12), G-ARM, gLockstepTrace,
  G-REPRO-LNC3 and gStage. Wall: about 43 s for the whole seven-arm smoke.
- **THE SIZING** (the variance source is the CEILING arm W100, LN-T1's form, at the
  declared **0.01 absolute** target on R1's paired Δ):

| quantity | value |
|---|---|
| `hwSmoke` (W100's realised half-width, 12 clusters) | 0.019262551319936264 |
| `seSmoke = hw/z.975` | 0.009828012895826892 |
| `seNeeded = 0.01/(z.975+z.80)` | 0.003569407753013907 |
| `nRequired = ceil(12 · (seSmoke/seNeeded)²)` | **91** |
| block affordance (after the construction receipt) | 999 |
| **N_FROZEN = min(nRequired, affordance)** | **91** |
| bound by | the SIZING |
| expected half-width at N | 0.0069949358449627255 |
| **MDE at N** | **0.009998606616387837** |

⚠ **12 clusters is a NOISY variance estimate.** It is disclosed as such; the sizing
is a plan, not a claim, and the realised half-widths at N are what §R2 reports.

⛔ **THE SMOKE'S EFFECT NUMBERS ARE NOT READ AND NOT QUOTED HERE.** Only the
half-width that sized N is carried forward, which is the disclosure the house form
requires. The read is taken on the battery, once.

---

## §HONEST LIMITS

*(the ONE home — canon **honest-limits single home**: "a stage doc's HONEST LIMITS
list is the ONE home; the artifact stores that list verbatim or stores none". The
artifact stores NONE and its `honestLimitsNote` points here.)*

1. **This is a measurement, not a ship.** Nothing in this stage arms the flag for
   the user. A read naming LN-ENTRY is a NAMING; the door is the commander's to
   open.
2. **One world, one composition.** Every arm is world 13. The E13 arms are the
   EMPTY-BOOK composition; the D13 pair is the dosed form. Nothing here speaks to
   world 12, to any other composition, or to an evolved population.
3. **The dose is a fixed weight, not an evolved gene.** The gene is written by the
   instrument on the match-local genome views. Nothing here says what evolution
   would do with it.
4. **The perceived chooser's price is a declared currency mix** (contract §4; T0 doc
   §4): a score-unit weight discounting a measured probability. The
   currency-correct form is a later door. Any effect measured here is an effect of
   THAT approximation, not of the ideal seam.
5. **The armed trace's prices are PRICED.** No look-pressure face is read off an
   armed arm (#394 item 3(ii)), so this exam publishes no armed look-pressure
   comparison at all — not because it held, but because it is not comparable.
6. **The guards are a tolerance test, not a proof of safety.** A guard that does not
   RESOLVE is not a guard that held; it is a guard the exam could not read at this
   N. The half-widths are published beside every guard row.
7. **The family rows are conditional rates on unequal denominators.** A family whose
   pass count moves under the dose changes its own denominator; the shares of all
   caroms are published beside the rates for exactly that reason (canon **moving
   denominators**).
8. **G-REPRO-LNC3 proves DORMANCY, not correctness.** Field-for-field agreement on
   the ABSENT arm says the flag-off world is the world LN-C3 walked. It says nothing
   about whether the armed arms are right.
9. **The sizing rests on 12 scratch clusters.** See §DEV-PREFLIGHT.
10. **LOO is a conservative point-shift receipt scoped to its own rows** (R1 per
    dose and `kickDown`), not a general robustness claim.

---

## §R1 R1 — THE USER'S OWN FACE, PER DOSE, AND THE FAMILY TABLE

**R1 = `firstBody.ownNonTarget`** over all measured ground passes. Control level on
the exam's own **ABSENT** arm: **0.100585** (705 / 7,009) — beside LN-C3's banked
E13 prior `firstBody.ownNonTarget` = 0.10080881491032705 (860 / 8,531), which the
exam quotes and does not use as its control.

| arm | paired Δ vs its control | 95 % interval | \|Δ\|÷half-width | `r1Down` | `r1Up` | `breach` |
|---|---|---|---|---|---|---|
| ARMED-ZERO | 0.000000 | [0.000000, 0.000000] | — | false | false | false |
| **W025** | **−0.034048** | [−0.041915, −0.026062] | 4.295310 | **true** | false | false |
| **W050** | **−0.051184** | [−0.058889, −0.043426] | 6.620066 | **true** | false | false |
| **W100** | **−0.057487** | [−0.066059, −0.049176] | 6.810189 | **true** | false | false |
| D13-W050 | −0.043160 | [−0.051369, −0.035326] | 5.380490 | true | false | false |

`everyDoseHasR1Down` is a STORED boolean and it is **true**; `noDoseHasR1Up` is
**true**. ARMED-ZERO's Δ is exactly zero on every face — FLAG-HYGIENE.

### The family table — P(carom \| family) and the family's share of ALL caroms

| family | ABSENT | W025 | W050 | W100 | D13-ABSENT | D13-W050 |
|---|---|---|---|---|---|---|
| LEGACY-outfield | 0.049011 (109/2224) | 0.032640 (69/2114) | 0.017363 (37/2131) | 0.020673 (43/2080) | 0.046601 (109/2339) | 0.024921 (55/2207) |
| SUBSTITUTED | 0.090286 (237/2625) | 0.083299 (204/2449) | 0.067485 (165/2445) | 0.059079 (136/2302) | 0.082488 (252/3055) | 0.065752 (187/2844) |
| KEEPER-pass | 0.048295 (34/704) | 0.028614 (19/664) | 0.020440 (13/636) | 0.011475 (7/610) | 0.042254 (30/710) | 0.018732 (13/694) |
| THROUGH-BALL | 0.032787 (16/488) | 0.083789 (46/549) | 0.083618 (49/586) | 0.075269 (42/558) | 0.074266 (43/579) | 0.073095 (47/643) |
| CUTBACK | 0.038462 (18/468) | 0.040340 (19/471) | 0.039014 (19/487) | 0.037500 (18/480) | 0.027079 (14/517) | 0.038314 (20/522) |
| **KICKOFF-PLAYBACK** | **0.582000 (291/500)** | **0.195175 (89/456)** | **0.107143 (51/476)** | **0.071429 (35/490)** | **0.601467 (246/409)** | **0.072115 (30/416)** |
| OTHER | *(empty by the frozen rule)* | | | | | |

Share of ALL caroms — KICKOFF-PLAYBACK: ABSENT **0.412766** · W025 **0.199552** ·
W050 **0.152695** · W100 **0.124555** · D13-ABSENT **0.354467** · D13-W050
**0.085227**. ⚠ These are rates on denominators that MOVE with the dose (§HONEST
LIMITS 7): the family's pass counts are printed above beside every rate.

### `kickDown(w)` — H-LN-2's probe

| arm | paired Δ on `family.KICKOFF-PLAYBACK.caromRate` | 95 % interval | `kickDown` |
|---|---|---|---|
| ARMED-ZERO | 0.000000 | [0.000000, 0.000000] | false |
| W025 | −0.386825 | [−0.450829, −0.323661] | **true** |
| W050 | −0.474857 | [−0.541259, −0.410815] | **true** |
| W100 | −0.510571 | [−0.574564, −0.443583] | **true** |
| D13-W050 | −0.529352 | [−0.596061, −0.463986] | true |

`everyDoseHasKickDown` is a STORED boolean and it is **true**.

---

## §R2 THE GUARDS AND THE BAND

Control = each arm's own control arm; tolerance = `NI_FRACTION · |control level|`
with `NI_FRACTION` inherited by anchor; breach = RESOLVED **and** beyond tolerance
in the harmful direction. **G1 is first.**

| arm | guard | control | tolerance | Δ | 95 % interval | resolved | breach |
|---|---|---|---|---|---|---|---|
| W025 | **G1** backwardPassShare | 0.330290 | 0.091264 | −0.007151 | [−0.019923, 0.005916] | false | false |
| W025 | G2 passCompletion | 0.596040 | 0.164695 | 0.002644 | [−0.010133, 0.015565] | false | false |
| W025 | G3 interceptionsPerMatch | 26.989011 | 7.457490 | −1.230769 | [−2.450549, −0.065934] | true | false |
| W025 | G4 goalsPerMatch | 3.582418 | 0.989879 | −0.450549 | [−0.945055, 0.043956] | false | false |
| W025 | G5 shotsPerMatch | 12.208791 | 3.373482 | 0.197802 | [−0.703297, 1.043956] | false | false |
| W025 | G7 ownedBallSampleShare | 0.329001 | 0.090908 | 0.007132 | [−0.002735, 0.016828] | false | false |
| W050 | **G1** backwardPassShare | 0.330290 | 0.091264 | 0.004424 | [−0.008969, 0.018662] | false | false |
| W050 | G2 passCompletion | 0.596040 | 0.164695 | 0.007501 | [−0.006559, 0.022425] | false | false |
| W050 | G3 interceptionsPerMatch | 26.989011 | 7.457490 | −0.769231 | [−2.043956, 0.549451] | false | false |
| W050 | G4 goalsPerMatch | 3.582418 | 0.989879 | −0.296703 | [−0.758242, 0.164835] | false | false |
| W050 | G5 shotsPerMatch | 12.208791 | 3.373482 | 0.626374 | [−0.230769, 1.472527] | false | false |
| W050 | G7 ownedBallSampleShare | 0.329001 | 0.090908 | 0.001343 | [−0.010390, 0.014074] | false | false |
| W100 | **G1** backwardPassShare | 0.330290 | 0.091264 | 0.005600 | [−0.008555, 0.020220] | false | false |
| W100 | G2 passCompletion | 0.596040 | 0.164695 | 0.010548 | [−0.003715, 0.024186] | false | false |
| W100 | G3 interceptionsPerMatch | 26.989011 | 7.457490 | −2.098901 | [−3.296703, −0.923077] | true | false |
| W100 | G4 goalsPerMatch | 3.582418 | 0.989879 | −0.043956 | [−0.560440, 0.472527] | false | false |
| W100 | G5 shotsPerMatch | 12.208791 | 3.373482 | 0.494505 | [−0.384615, 1.351648] | false | false |
| W100 | G7 ownedBallSampleShare | 0.329001 | 0.090908 | 0.006228 | [−0.003451, 0.016104] | false | false |
| D13-W050 | **G1** backwardPassShare | 0.332370 | 0.091839 | −0.006271 | [−0.017780, 0.004906] | false | false |
| D13-W050 | G2 passCompletion | 0.585135 | 0.161682 | 0.021658 | [0.007861, 0.036219] | true | false |
| D13-W050 | G3 interceptionsPerMatch | 31.846154 | 8.799595 | −3.065934 | [−4.582418, −1.637363] | true | false |
| D13-W050 | G4 goalsPerMatch | 2.571429 | 0.710526 | 0.065934 | [−0.373626, 0.505495] | false | false |
| D13-W050 | G5 shotsPerMatch | 11.879121 | 3.282389 | 0.087912 | [−0.835165, 1.076923] | false | false |
| D13-W050 | G7 ownedBallSampleShare | 0.367255 | 0.101478 | −0.004065 | [−0.018400, 0.009741] | false | false |

ARMED-ZERO's every guard Δ is exactly 0.000000 with the interval [0.000000,
0.000000] and nothing resolved — the identity arm.

**G6, THE OFFSIDE FLAG (#157 form — flips no gate).** Δ per arm: ARMED-ZERO
0.000000 (not resolved) · W025 −0.340659 (not resolved) · W050 −0.516484
(RESOLVED) · W100 −0.571429 (RESOLVED) · D13-W050 −0.153846 (not resolved). The
flag raises on a resolved **INCREASE**; every resolved movement here is a DECREASE,
so `noOffsideFlagOnAnyDeltaArm` is a STORED boolean and it is **true**.

**THE BAND.** `everyGuardHeldOnEveryDose` and `everyGuardHeldOnEveryDeltaArm` are
STORED booleans and both are **true**: no gating guard breached on any arm, at any
dose. Two guards resolved a movement and both moved the SAFE way (interceptions
DOWN, completion UP on the D13 pair).

**LOO** — scoped to its own ten rows (R1 per Δ-arm and `kickDown` per Δ-arm), 91
seeds dropped one at a time: **no row flips**, on either direction, on any arm; the
largest single-seed influence share over those ten rows is 0.044 (W025's R1).

---

## §R3 THE SECONDARIES (published, never gating)

| arm | own-openness (ALL) | shell fired | substituted | `chosenGid = −1` | mean pass distance (m) | passes/match | 撞车 |
|---|---|---|---|---|---|---|---|
| ABSENT | 0.802500 | 0.248110 | 0.374518 | 0.030728 | 14.733520 | 77.021978 | 0.455089 |
| ARMED-ZERO | 0.802500 | 0.248110 | 0.374518 | 0.030728 | 14.733520 | 77.021978 | 0.455089 |
| W025 | 0.864983 | 0.210354 | 0.365508 | 0.028916 | 14.467386 | 73.659341 | 0.461121 |
| W050 | 0.898412 | 0.190800 | 0.361633 | 0.030588 | 14.341264 | 74.296703 | 0.445880 |
| W100 | 0.916100 | 0.184202 | 0.353067 | 0.031492 | 14.093857 | 71.648352 | 0.452686 |
| D13-ABSENT | 0.797577 | 0.267578 | 0.401498 | 0.024472 | 14.254707 | 83.615385 | 0.509494 |
| D13-W050 | 0.886310 | 0.220311 | 0.388206 | 0.023357 | 13.887165 | 80.505495 | 0.493383 |

**THE SEAM'S OWN FACE — the chosen lane's own-openness BY FAMILY** (LN-C1's CALLED
reconstruction; expected UP):

| family | ABSENT | W025 | W050 | W100 | D13-ABSENT | D13-W050 |
|---|---|---|---|---|---|---|
| LEGACY-outfield | 0.903000 | 0.949898 | 0.974723 | 0.991203 | 0.890096 | 0.974067 |
| SUBSTITUTED | 0.792183 | 0.833020 | 0.860068 | 0.880790 | 0.782242 | 0.845952 |
| KEEPER-pass | 0.802068 | 0.878933 | 0.907934 | 0.962000 | 0.793826 | 0.913531 |
| THROUGH-BALL | 0.771943 | 0.726405 | 0.756374 | 0.746341 | 0.746616 | 0.712536 |
| CUTBACK | 0.830670 | 0.825307 | 0.847497 | 0.822295 | 0.847441 | 0.840911 |
| **KICKOFF-PLAYBACK** | **0.413703** | **0.830495** | **0.967963** | **0.991243** | **0.398635** | **0.976788** |

⚠ THROUGH-BALL and CUTBACK are the two families the seam prices at NO site (the
through-ball and cutback scorers are untouched by LN-T0), and their own-openness
does not rise. That is a receipt, not a finding: it is what an unpriced site should
look like beside a priced one.

**THE SHELL, BY FAMILY** (`groundShellHazard` CALLED on the struck lane — does the
graded price empty the binary shell?): KICKOFF-PLAYBACK falls 0.806000 → 0.392544 →
0.273109 → 0.271429 across ABSENT / W025 / W050 / W100; SUBSTITUTED 0.370667 →
0.332381 → 0.306748 → 0.304518; LEGACY-outfield 0.015288 → 0.009934 → 0.007039 →
0.009135; the two unpriced families do not fall monotonically (THROUGH-BALL
0.405738 → 0.437158 → 0.409556 → 0.388889; CUTBACK 0.277778 → 0.326964 → 0.316222 →
0.270833).

**THE EXECUTABILITY RECEIPT.** The factor touches no executability, and the table
above is the receipt: the `chosenGid = −1` rate moves from 0.030728 on ABSENT to
0.028916 / 0.030588 / 0.031492 across the three doses, and the perceived
substitution rate from 0.374518 to 0.365508 / 0.361633 / 0.353067. Both are
published, neither gates.

---

## §R4 THE D13 PAIR — THE FORM THE USER PLAYS

D13-W050 against its own control D13-ABSENT, on the same 91 seeds, dosed through the
SHIPPED loaders (bytes hashed by `gDoseSource`) and then the gene written on the
anchored views:

- **R1**: Δ **−0.043160**, 95 % [−0.051369, −0.035326], \|Δ\|÷half-width 5.380490,
  `r1Down` **true**, `breach` **false**, LOO 0 flips.
- **`kickDown`**: Δ **−0.529352**, 95 % [−0.596061, −0.463986], **true**.
- The pair's own stored counterfactual word is **`read1`**.

The play form AGREES with the empty-book arms, at the same dose, on both faces.

---

## §R5 THE READS

Selector, from the STORED booleans: `Q = { W025, W050, W100 }` (every dose has
`r1Down` and none breached), so `Q` is non-empty and the selected read is
**`read1`**. The smallest qualifying dose is **W025**, weight **0.25**. `kickDown`
holds at every dose, so H-LN-2's sentence is the REFUTED one, at the smallest such
dose, **0.25**.

> **THE PASSER SEES HIS OWN MEN AND THE CAROM FALLS — LN-ENTRY is named: world 14 =
> world 13 + the own-lane door at the SMALLEST qualifying dose.**
> ↳ the smallest qualifying dose: **w = 0.25** · the D13 pair at 0.5 beside it:
> Δ −0.043160, 95 % [−0.051369, −0.035326], `read1`.
>
> **THE KICK-OFF TAP-BACK MOVED TOO (H-LN-2 refuted at w = 0.25).**

**THE COUNTERFACTUAL WORD PER ARM TAKEN ALONE** (the frozen rule applied to that
arm's own stored intervals): ARMED-ZERO **`read3`** · W025 **`read1`** · W050
**`read1`** · W100 **`read1`** · D13-W050 **`read1`**.

⛔ **AND THE READ IS NOT OF RECORD.** `gFaces` is RED (§DEVIATIONS 1), so the
artifact carries the `.RED.json` routing and the sentence above is a sentence the
instrument SELECTED and STORED, not a banked read. It stands or falls on the
commander's disposal of that one receipt.

---

## §R6 在说人话的层面

给传球者装上「看得见自己人」这只眼睛之后，**他确实不再往自己人身上撞了**。世界 13 上，
一脚落地传球第一个碰到的是自家非目标队友的比例，从 0.100585 降到 0.066537（w = 0.25）、
0.049401（w = 0.5）、0.043098（w = 1.0）——三档都降，三档都没有守门被打破，一档比一档
更干净，用户实际在玩的那个 D13 形态也一样降。

最好看的是**开球回敲**。那一脚过去是全场撞车最集中的地方：碰自己人的概率 0.582000，
占全部撞车的 0.412766。这一档的传球线路上「自己人的开阔度」原本只有 0.413703 ——
半个队都堵在球前面，而原来的评分器根本不看线。装上眼睛以后开阔度升到 0.830495 /
0.967963 / 0.991243，撞车概率掉到 0.071429。**H-LN-2 被推翻了**：开球那一脚不是形状
问题，是没长眼睛的问题。

代价那一栏是空的：回传比例没有显著变化（G1 三档都没 resolve），完成率、抢断、进球、
射门、控球、越位——没有一条越过容差，唯二 resolve 的两条都往安全的方向走。

⚠ 但这份读数**现在还不能算数**：有一条继承自 LN-C3 的分区收据在三个上药臂上红了
（§DEVIATIONS 1）。红的是收据，不是这张表——但按房规，红了就不是 of record。

---

## §DEVIATIONS

1. ⛔ **ONE GATE IS RED: `gFaces`, on THREE inherited partition-receipt checks.**
   `<arm>.partition.untracedFamiliesAreExactlyTheUntracedLedgerClass` fails on
   **W025, W050 and D13-W050** (it holds on ABSENT, ARMED-ZERO, W100 and
   D13-ABSENT). 1,644 / 1,644 face-and-Δ checks pass and 338 / 341 bin checks pass;
   these three are the whole of the red.
   **WHAT IT IS.** LN-C3's family rule assigns the family by **(kind, site) FIRST**,
   and the ledger path class is published BESIDE as a receipt (`familyByPath`). The
   instrument's own frozen comment says exactly what happens if the walk ever
   disagrees with the code: *"If the walk ever disagreed with the code, the RECEIPT
   would say so and the family would still be the (kind, site) one."* It disagreed.
   On the three arms named, the KICKOFF-PLAYBACK family's `familyByPath` row is not
   entirely `untraced`: W025 carries one `legacyChosen` and one `substituted`, W050
   one `legacyChosen`, D13-W050 one `legacyChosen` — against 454 / 475 / 415
   `untraced` in the same rows. **Every other untraced family is 100 % untraced on
   every arm.** The FAMILY ASSIGNMENT IS UNAFFECTED (it is by site), so §R1's family
   table and `kickDown` are computed exactly as frozen; what fails is the identity
   "the untraced families hold exactly the untraced ledger passes".
   **MECHANISM — A LABELLED HYPOTHESIS, NOT A MEASUREMENT.** The trace join is
   (choice tick, passerGid), and where a wind-up record exists the ARM TICK is the
   choice tick. A pass armed through the perceived chooser (which writes a ledger
   row) whose flight is then superseded by a restart, leaving the SAME player taking
   the kick-off at a later tick with that arm tick as his choice tick, would join a
   chooser row onto a `kickoffPlayback` strike. The seam shifts tick sequences on
   every armed arm, so a coincidence that never occurred in LN-C3's two un-armed
   arms occurs once or twice here. **This is a hypothesis; the exam did not
   instrument it** and the frozen instrument cannot be edited to do so.
   **WHY THE INSTRUMENT WAS NOT FIXED.** Freeze-before-sight. The instrument is
   byte-identical between the FREEZE and RESULTS commits
   (`git diff <freeze>..<results> -- scripts/probes/ln-t1p-own-lane-exam.ts` is
   EMPTY), which is the whole point of the protocol; editing a re-derivation
   identity after seeing the table is exactly what it forbids. The red is therefore
   REPORTED, not repaired.
   **CONSEQUENCE.** The artifact is routed by the instrument's own red-routing idiom
   to `docs/world-model/data/ln-t1p-own-lane-exam.json.RED.json` — the canonical
   `…-exam.json` path is NOT written, deliberately. The read in §R5 is a stored,
   selected sentence and is **NOT of record**.
2. **The artifact path of record differs from the dispatch's.** #394 item 4(vii)
   names `docs/world-model/data/ln-t1p-own-lane-exam.json`; the file committed is
   `…-exam.json.RED.json`, because the instrument routes a red run away from the
   canonical name. The file is NOT renamed: the routing IS the receipt.
3. **The read literals are not interpolated.** Ruling #394 item 4(v) gives READ 1
   and READ 2 as sentences and asks separately that the smallest qualifying dose and
   the breaching guard be stored. The instrument therefore stores the sentences
   VERBATIM and prints the dose / guard on a SEPARATE annotation line beneath, as
   stored fields, rather than splicing them into the literal. The H-LN-2 refuted
   literal keeps its `<w>` slot, which the ruling puts inside the sentence.
4. **One look-pressure counter is censored, not published.** #394 item 3(ii) forbids
   reading a look-pressure face off an armed arm. The per-seed row keeps
   `cpBlindRead` so G-REPRO-LNC3 can match LN-C3's ABSENT-arm field, books it on
   UN-ARMED arms only, and publishes it as NO face. It is consequently a STATED
   exclusion in FLAG-HYGIENE's field comparison — that gate's byte-identity claim
   rests on the WHOLE-MATCH SIGNATURE (rng stream state included), which is compared
   and identical on 91 / 91 seeds.
5. **The LN-C3 kick-off span values are READ, not typed.** §P.3 promised a stored
   comparison; the instrument opens LN-C3's banked artifact and reads
   `callGraphNodes.nodes[]` for `kickoffPlaybackScorer` rather than transcribing its
   hash. Stored: LN-C3 `63a82a04…c80a` (lines 261–296, 1,625 chars) vs this head
   `837a9e04…9867` (lines 278–322, 2,293 chars); `hashDiffers` is **true**, with the
   reason stored beside it. The banked census is untouched.
6. **The battery tail is declared, not walked.** N was SIZED to 91 by the disclosed
   smoke, bound by the sizing (not by the block). Seeds 12,549,091–12,549,998 are
   the DECLARED unwalked tail; the block is consumed whole of record.
7. **No other deviation.** Nothing under `src/` or `tests/` was created or edited;
   `PROGRAMME.md`, `PROGRAMME-RULINGS.md`, `PROGRAMME-LOG.md`, `CANON.md` and every
   contract and other stage doc are untouched by this stage.

---

## §GATES

25 gates, 24 GREEN, 1 RED. Notes derive from the same pinned values the gates check
(canon **gate notes derive**); the full notes are in the artifact's `gates` block.

| gate | verdict | the receipt it carries |
|---|---|---|
| `gWorld` | ✅ | `bqArmedVersion` 13 on every walked match; `lnOwnLanePrice` as CONSTRUCTED per arm; the gene as READ per arm; `edsPerceivedChoice` true; `traceChoice` true on the arms and false on the untraced twin |
| `gDoseSource` | ✅ | the D13 books' BYTES hashed against their pins before either dosed arm is built |
| `gAnchoredConstants` | ✅ | 103 anchored sites with line receipts, incl. LN-T0's whole seam and the ZERO-occurrence anchor proving `a4World.ts` never names the flag or the gene |
| `gCodeFactGraph` | ✅ | the EXTRACTED call graph over the three price sites, the scope site and the seat module — 53 nodes, hashes distinct, the graph STORED beside the booleans |
| `gWalkFixtures` | ✅ | 168 / 168 walk-side predicate fixtures |
| `gShellFixtures` | ✅ | the shipped `groundShellHazard` and `laneOpenness` CALLED on hand-built geometries |
| `gClassesNonVacuous` | ✅ | no face computed on an empty class, on all seven arms (`OTHER` deliberately exempt — an empty `OTHER` is a RESULT of the frozen rule) |
| `gLockstep` | ✅ | the instrument installs no wrapper: 14 arm × scratch-seed walks, observed ≡ unobserved |
| `gLockstepTrace` | ✅ | the ledger is BYTE-INERT at this head **and under the dose** |
| `gFlagHygiene` | ✅ | ARMED-ZERO ≡ ABSENT on 91 / 91 seeds, whole-match signature incl. the RNG STREAM STATE |
| `gArm` | ✅ | the gene reads back as the arm's dose off `effGenome` AND `baseGenome` of both teams on every dosed seed; `info.genome` carries no gene on any arm; liveness — ABSENT vs W100 differs on 91 / 91 seeds (and W050, W025 and the D13 pair likewise) |
| `gReproLnc3` | ✅ | **1,872 field comparisons, 0 mismatches** on LN-C3's own 12,548,000–011 re-walked on ABSENT with the trace ON — the DORMANCY receipt in the census's own arithmetic |
| `gSrcUntouched` | ✅ | X-SRC-ZERO — `git diff --stat HEAD` and `git status --porcelain` both empty over `src/` AND `tests/` on the run that wrote the artifact |
| `gSeedsBookedEqualWalked` | ✅ | BOOKED = WALKED off the cells' own distinct seeds; the tail declared |
| `gSeedDisjoint` | ✅ | the block base equals the published frontier at #394 item 7; disjoint from every consumed block |
| `xDet` | ✅ | the whole core walked TWICE — pass 1 and pass 2 digests identical (`76861c63…b2e0`) |
| `xFpProd` | ✅ | the production fingerprint recomputed in-probe: `57b0bdab389122af…` **UNCHANGED** |
| `gTwoFractions` | ✅ | every published face carries its own numerator and denominator and equals their ratio |
| `gLoo` | ✅ | 10 LOO rows, all finite, no flips |
| `gN` | ✅ | the walked n equals the frozen N, on the canonical path with no override declared |
| `gReproduceCrowd` | ✅ | 撞车's two quantities recomputed by a second, independently shaped implementation |
| **`gFaces`** | ⛔ **RED** | 1,644 / 1,644 face-and-Δ checks and **338 / 341** bin checks re-derive off the SERIALIZED artifact; the three failures are §DEVIATIONS 1 |
| `gReadWords` | ✅ | every selector boolean, Q, the smallest qualifying dose, both sentences and every counterfactual word re-derived off disk |
| `gStage` | ✅ | `stage.instrument` written from the instrument's own path constant and `stage.instrumentSha256` = `d92d6abf…5aab`, compared to the running file's bytes (LN-C3 §CORR 1) |
| `gHashOrder` | ✅ | the body hash computed after every body key, `allGreen` inside the allowlist, EVERY non-body key enumerated, and a NON-body `receipts.hashReproducesFromFile` |
