# LN-T1′ — 「传球者看见自己人 · 考试」 THE OWN-LANE EXAM

> **STATUS: FROZEN — §P AND THE INSTRUMENT ARE FROZEN, §DEV-PREFLIGHT IS DISCLOSED,
> NO BATTERY SEED HAS BEEN WALKED.** This is the FREEZE commit of a
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

## §DEVIATIONS

*(required even if empty — this section is completed at the RESULTS commit.)*

---

## §GATES

*(the table with derived notes is written at the RESULTS commit, off the artifact's
own `gates` block.)*

---

## §R1 – §R6

*(written at the RESULTS commit — the battery has not been walked.)*
