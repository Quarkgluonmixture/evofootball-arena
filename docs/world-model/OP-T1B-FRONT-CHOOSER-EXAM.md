# OP-T1b — 「身前那个人 · 再考」 THE FRONT-CHOOSER EXAM（两步都把身前贴着的人算进去：球少撞到对面身上了吗？代价是什么？）

> **STATUS: FROZEN — §0 through §DEV-PREFLIGHT and the instrument are sealed at the FREEZE commit BEFORE any
> battery seed. §R onward is written after the battery.**
> Authorized by **COMMANDER RULING #436 items 4–5** (the reads FROZEN EX ANTE at item 4, their FIRST home; the
> dispatch at item 5), standing on #435 (OP-C3 = MISREAD ⇒ M-OP.5), #434 (OP-T1's table and the liveness lesson),
> #433 (OP-T1's reads) and the user's 「甲吧」 ⇒ 甲 「身前贴着的人要算进去」 (#432).
> Contract: [`OP-FRONT-MAN-CONTRACT.md`](OP-FRONT-MAN-CONTRACT.md) §1 C1–C3 · §2 M-OP.1–5 · §3 OP-T1b.
> The seams under exam: [`OP-T0-FRONT-MAN-SEAM.md`](OP-T0-FRONT-MAN-SEAM.md) (`f850404`, the licence, `opFrontMan`) and
> [`OP-T0B-FRONT-CHOOSER-SEAM.md`](OP-T0B-FRONT-CHOOSER-SEAM.md) (`7050efa`, the chooser, `opFrontChooser`), each read
> through its §COMMANDER CORRECTIONS.
> Exam form of record: [`OP-T1-FRONT-MAN-EXAM.md`](OP-T1-FRONT-MAN-EXAM.md) + `scripts/probes/op-t1-front-man-exam.ts`
> (frozen at `9a1e2e6`; read through its §P.L departures and §COMMANDER CORRECTIONS) — copied in FORM and, in every
> line that writes a stored OP-T1 cell, byte for byte; ⛔ never imported. The chooser re-call: OP-C3's
> (`scripts/probes/op-c3-chooser-census.ts`, frozen at `fa556dc`), its argument construction copied by anchor.
> Instrument: [`scripts/probes/op-t1b-front-chooser-exam.ts`](../../scripts/probes/op-t1b-front-chooser-exam.ts); the
> exam's own lines are marked `⭐OP-T1b`.
> Artifact: `docs/world-model/data/op-t1b-front-chooser-exam.json` (or its `.RED.json` side path if any gate is red).
>
> ⛔ **X-SRC-ZERO**: not one byte under `src/` or `tests/` is created or edited; no frozen probe and no pinned test is
> touched. Nothing ships: no world names `opFrontMan` or `opFrontChooser`.

## §0 WHAT THIS EXAM ASKS, AND THE NUMBERS IT STANDS ON

**THE USER'S SENTENCE** (the world-12 verdict, quoted at OP-C0 §0): 「12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上」.
**THE USER'S FORK ANSWER** (#432): 「甲吧」 ⇒ 甲 「身前贴着的人要算进去」.

**THE QUESTION.** With BOTH steps of the pass reading the man strictly ahead of the kicker within 1.5 m — the licence
(WHETHER to pass, `opFrontMan`, M-OP.1–2) and the snapshot chooser (WHO gets it, `opFrontChooser`, M-OP.5) — does
the ground pass meet an opponent first LESS often on the user's world (W18-D), and what does the passer do instead:
does any face the band or the 传不出去 band can see get worse — including the cost #435 item 3(f) named, more passes
into safer, shorter or backward lanes?

**THE NUMBERS OF RECORD, READ BY FIELD** (the instrument stores each under `priorOfRecord`, read out of the two
artifacts, never typed; both are x64 numbers on THIS host, on OTHER blocks — beside, never a paired Δ):

| source artifact | arm | field | num / den | value |
| --- | --- | --- | --- | --- |
| `op-t1-front-man-exam.RED.json` | W18-D | `faces.W18-D.fb.ground.opponent` | 25,349 / 81,321 | 0.311715 |
| `op-t1-front-man-exam.RED.json` | W18-D+OP | `faces.W18-D+OP.fb.ground.opponent` | 24,568 / 80,212 | 0.306288 |
| `op-t1-front-man-exam.RED.json` | W18-E | `faces.W18-E.fb.ground.opponent` | 22,506 / 70,698 | 0.318340 |
| `op-t1-front-man-exam.RED.json` | W18-E+OP | `faces.W18-E+OP.fb.ground.opponent` | 22,167 / 69,738 | 0.317861 |
| `op-t1-front-man-exam.RED.json` | W18-D | `faces.W18-D.front.share` | 27,627 / 81,321 | 0.339728 |
| `op-t1-front-man-exam.RED.json` | W18-D+OP | `faces.W18-D+OP.front.share` | 26,801 / 80,212 | 0.334127 |
| `op-t1-front-man-exam.RED.json` | W18-D | `faces.W18-D.front.manFirst` | 3,443 / 27,627 | 0.124624 |
| `op-t1-front-man-exam.RED.json` | W18-D+OP | `faces.W18-D+OP.front.manFirst` | 3,268 / 26,801 | 0.121936 |
| `op-t1-front-man-exam.RED.json` | W18-D | `faces.W18-D.front.reseat.snapshot` | 22,968 / 27,627 | 0.831361 |
| `op-t1-front-man-exam.RED.json` | W18-D+OP | `faces.W18-D+OP.front.reseat.snapshot` | 22,143 / 26,801 | 0.826201 |
| `op-t1-front-man-exam.RED.json` | W18-D | `faces.W18-D.stuck.backwardShareOfGroundReleases` | 25,242 / 81,321 | 0.310400 |
| `op-t1-front-man-exam.RED.json` | W18-D+OP | `faces.W18-D+OP.stuck.backwardShareOfGroundReleases` | 24,943 / 80,212 | 0.310963 |
| `op-t1-front-man-exam.RED.json` | W18-D | `faces.W18-D.s3.possessionsEndingWithoutAPassAttempt` | 5,997 / 47,350 | 0.126653 |
| `op-t1-front-man-exam.RED.json` | W18-D+OP | `faces.W18-D+OP.s3.possessionsEndingWithoutAPassAttempt` | 6,060 / 46,675 | 0.129834 |
| `op-t1-front-man-exam.RED.json` | `W18-D+OP\|W18-D` | `deltas.….fb.ground.opponent` | — | Δ −0.005427 [−0.008706, −0.002125] |
| `op-t1-front-man-exam.RED.json` | `W18-E+OP\|W18-E` | `deltas.….fb.ground.opponent` | — | Δ −0.000479 [−0.003458, 0.002528] |
| `op-c3-chooser-census.json` | W18-D+OP | `outcome.word` · `outcome.shares.c3.first.chosen.snapOpen` | 2,270 / 3,041 | MISREAD · 0.746465 |

**THE SEAMS, AS BANKED** (read, never touched): the licence's `laneOpennessFront` (OP-T0, `f850404`) reads a man at
`0 < along < 1.5` at `clamp01(d / CONTROL_RADIUS)`, bound inside `groundCandidate` by
`const laneOpenness = match.opFrontMan ? laneOpennessFront : laneOpennessShipped;`. The chooser's `frontContactOf`
(OP-T0b, `7050efa`) is TRUE iff an observed opponent holding a reach profile has his closest point on the passer →
predicted `targetPoint` segment at `0 < along < 1.5` and within `CONTROL_RADIUS` of the line; armed
(`frontContact: match.opFrontChooser` at the ONE chooser call site), `pricePassOption`'s READ branch then prices that
option in the calibration's LAST band (the threat used for reception and band is `+Infinity`).

### 在说人话的层面

上一轮（OP-T1）只让"要不要传"那一步看见身前的人，球撞到对面的比例降了一点点，但"传给谁"那一步还是照样往
那条线里塞。这一轮两步都开：传之前看见他，挑人时也把那条线算成最差的。我们看两件事：球撞到对面身上的比例有没
有明显降；以及代价——会不会更传不出去、更多往回传、传得更短。

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — SIX, PAIRED on shared seeds (#436 item 4(i))

World 18 is composed by CALLING `a4MatchFlags(18)`; the dose and the construction are OP-T1's, copied BY ANCHOR. Every
arm: `new Match({ seed, teamA: teamInfo('A', 2·seed+1), teamB: teamInfo('B', 2·seed+2), ...a4MatchFlags(18)
[, opFrontMan: true] [, opFrontChooser: true] })`, then `armA4World(m, null, 18, L3, PC)` on the D arms and
`armA4World(m, null, 18)` on the E arms.

| arm | dose | `opFrontMan` | `opFrontChooser` | role |
| --- | --- | --- | --- | --- |
| `W18-D` | the shipped loaders' played book | absent | absent | ⭐ **THE CONTROL** (the user's play) |
| `W18-D+OP` | the same | `true` | absent | the licence alone |
| `W18-D+OC` | the same | absent | `true` | the chooser alone |
| `W18-D+OP+OC` | the same | `true` | `true` | ⭐⭐⭐ **THE ARM OF RECORD** (what world 19 would ship) |
| `W18-E` | none (empty book) | absent | absent | the E control |
| `W18-E+OP+OC` | none | `true` | `true` | the E candidate |

**THE COMPARISON OF RECORD = `W18-D+OP+OC|W18-D`** (candidate − control). `W18-D+OP|W18-D`, `W18-D+OC|W18-D` and the E
pair `W18-E+OP+OC|W18-E` are printed beside, each with its own stored booleans and word — STORED, COUNTERFACTUAL,
NEVER SELECTING.

### §P.B THE WALKER — OP-T1's, COPIED; the chooser-seat re-call added

OP-T1's walker (OP-C2's: public state and `p.action` around `match.step(DT)`; OP-C2's observing wrapper on
`perceivedSnapshot`; the E3 chooser's own trace door; OP-T1's trajectory digest and predicates) is copied byte for
byte in every line that writes an OP-T1 cell, so the exam's per-seed row CONTAINS OP-T1's whole 110-key row (`gRepro`
compares it). The exam adds, all pure (gLockstep proves the walk inert):

* the chooser door `m.opFrontChooser` read off every walked match (`ocFlag`; gArms);
* the ground-pass length of every measurable ground release (§P.D 1);
* ⭐ **THE CHOOSER-SEAT RE-CALL** inside the observing wrapper (§P.D 2): on every scoped snapshot pull, at the moment
  the engine receives the snapshot, the shipped pure `choosePerceivedPassTarget` is CALLED on that very snapshot object
  with the E3 block's argument construction (OP-C3's `recallOf`, copied by anchor: `passChoiceCandidateGids(p,
  team.players)`, `team.attackDir`, `m.reachProfiles()`, `valueAxis: match.edsValueAxis`, the LN own-lane factor) —
  once with `frontContact` AS THE CALL SITE HANDS IT (`m.opFrontChooser`) and once with `frontContact` ABSENT (the same
  call priced shut). On an arm whose chooser door is shut the two are the same call (`frontContact: false` ≡ absent,
  OP-T0b F1), so the shut side is not re-run.

### §P.C THE WIN FACE (#436 item 4(ii))

`fb.ground.opponent` = OP-C0's definition BY FIELD through OP-T1 (the copied face line): among MEASURABLE GROUND passes
(a `shortPass`, `throughBall` or `cutback` released on the ground with a target), the share whose FIRST BODY other than
the passer is an opponent: `fbG[opponent] / Σ fbG`.

`fixes(contrast)` = the paired Δ (candidate − control) of `fb.ground.opponent` is **RESOLVED AND DOWN**: the 95 %
cluster-bootstrap interval over seeds lies wholly below zero (`hi < 0`).

**PRINTED BESIDE, NEVER SELECTING:**

* **OP-T1's FRONT-MAN FACES BY FIELD.** A front man of a ground release is a live opponent whose closest point on the
  release segment L→E lies at `0 < along < 1.5` m from L (OP-T1's partition, no lateral bound). `front.share` = ground
  releases with ≥ 1 front man ÷ ground releases; ⭐ `front.manFirst` = of those, the share whose first body is one of
  the front men (the mechanism's own face). OP-C2's `qd.*` zone faces stay printed beside, as in OP-T1.
* **THE RE-SEAT FACE** (OP-T1's definition by anchor): among ground releases WITH a front man, the share whose target
  was seated by the snapshot chooser (`front.reseat.snapshot`; the other deciders beside), on every arm.
* ⭐ **THE CHOOSER-SEAT FACE** (§P.D 2), on every arm (zero by construction where the chooser door is shut):
  `chooserSeat.repricedShareOfCalls` = chooser calls on which the seat repriced ≥ 1 option ÷ chooser calls;
  `chooserSeat.changedShareOfCalls` = chooser calls on which the chosen target differs from the same call priced shut
  ÷ chooser calls; beside: `chooserSeat.repricedOptionsPerCall`, `chooserSeat.recallAgreesShare`,
  `chooserSeat.callsPerMatch`.

### §P.D THE NEW PREDICATES — each with a FIRES and a DOES-NOT fixture (`gPredicateFixtures`)

OP-T1's predicates (the possession, the pass attempt, the dispossession, the pressed decision tick, the action mix, the
backward pass, the front man) are carried byte for byte with their fixtures. NEW here:

1. **THE GROUND-PASS LENGTH**: for a measurable ground release, the metres from the launch L (the ball's position
   minus its velocity × DT at the release step) to the priced aim E — `hypot(E − L)`, the same L and E the front man
   and the backward pass read. The face `stuck.meanGroundPassLengthMetres` = Σ length ÷ measurable ground releases
   (a degenerate L = E release adds 0).
2. **THE CHOOSER-SEAT A/B.** A **chooser call** is an E3 trace entry whose passer pulled a scoped snapshot on the same
   step (a trace entry with no pull — no candidate, nothing priced — is not a call of the face). On it:
   * **the re-call agrees** when the as-called re-call reproduces the engine's own trace entry: the same pick
     (`chosenGid`), the same number of options, and option for option the same `targetGid`, `infoClass`, `price`
     (`Object.is`), `executable`, `cell` and `band`; a re-call with no pick agrees only with an entry whose
     `chosenGid` is −1 and whose menu is empty (OP-C3's `recallAgreesOf`, its form);
   * **one option is repriced** when the as-called option and the shut option at the same index differ in `band`,
     `price`, `reception` or `value` (`Object.is`, so NaN equals NaN), or carry different target gids (two menus of
     different length count every option of the longer as repriced);
   * **the call is repriced** when ≥ 1 option is repriced; if exactly one of the two re-calls returns no pick, the call
     is a NULL MISMATCH (counted as repriced; the seam forbids it — the seat never changes executability — and
     `gPartition` requires its count to be 0);
   * **the pick changed** when the as-called pick differs from the shut pick (no pick = −1).
3. **THE HOUSE MAJORITY**: k of n seeds is a majority iff `k > 0.5 · n` (strict: exactly half is not; n = 0 never is).
4. **THE DOOR CELLS**, excluded from every liveness row comparison: `opFlag`, `ocFlag` and the chooser-seat face's six
   cells (`seatCalls`, `seatRecallAgrees`, `seatRepriced`, `seatRepricedOptions`, `seatChanged`, `seatNullMismatch`)
   (§P.L 2). Every other cell of the row — OP-T1's 110 keys minus `opFlag`, and `groundLenSum` — is a game cell.
5. **`gBiteOC`** (§P.I), built from 3 and 4.

### §P.E THE BANDS — a BREACH = the paired Δ RESOLVED AND beyond `NI_FRACTION · |control level|` IN THE HARMFUL DIRECTION

`NI_FRACTION = 1 − 0.275/0.380`, inherited BY ANCHOR (parsed from `ctb-t1-supply-exam.ts`'s line, the identical line in
`dlc-t1-choice-exam.ts` required to agree), never typed. "beyond" = ceiling: Δ > tol · floor: Δ < −tol · both: |Δ| >
tol. Every row stores the control level, the candidate level, Δ, its interval, the tolerance, `absDeltaOverTolerance`
and `breachDirection` ∈ {`UP`, `DOWN`, `none`}, on all four contrasts.

**F-DS-b, G1–G9 + the G10 FLAG — inherited unchanged from `if-t1b-flight-run-exam.ts` by anchor, through OP-T1:**

| id | face | harmful direction |
| --- | --- | --- |
| G1 | goals per match | both |
| G2 | shots per match | both |
| G3 | xG conversion (goals ÷ Σ `shotLog` xg) | both |
| G4 | pass completion over all deliveries (engine `passesCompleted ÷ passes`) | floor |
| G5 | interceptions per match | ceiling |
| G6 | possession share, side A (`possessionTime`) | both |
| G7 | passes per match | both |
| G8 | mean aim distance (passer → target at the step a new `pendingPass` appears) | both |
| G9 | through balls per match (engine counter) | both |
| G10 | offsides per match | FLAG only: a resolved increase flags, gates nothing |

**THE 传不出去 BAND, S1–S4 (S1–S3 OP-T1's definitions by anchor; S4 new, #436 item 4(iii); the same breach law):**

| id | face | harmful direction |
| --- | --- | --- |
| S1 | passes per possession (pass attempts credited to possessions ÷ possessions) | **floor** |
| S2 | dispossessions of the carrier per match | **ceiling** |
| S3 | the share of possessions that end without a pass attempt | **ceiling** |
| ⭐ S4 | the backward-pass share of ground passes (`stuck.backwardShareOfGroundReleases`: measurable ground releases whose priced aim lies against the passer's attack direction from the launch, `(E.x − L.x) · attackDir < 0` — OP-T1's predicate and face, by anchor) | **ceiling** |

`holdsBands(contrast)` = no breach among G1–G9 and S1–S4. Every breach stores its direction; the breach set with
directions is stored per contrast.

### §P.F THE FACES PUBLISHED ON EVERY ARM (⛔ no verdict word; #436 item 4(iv))

OP-T1's 传不出去 faces by field — ground-pass attempts per possession; the pressed carrier's action mix at `pressure >
0.5` (pass · dribble · hold · shoot · other), with the pressed share of carrier decisions and pressed decisions per
match; the backward share of ground releases; possession length in ticks and possessions per match — plus ⭐ the mean
ground-pass length (§P.D 1, the "shorter lanes" half of the named cost); the front-man, re-seat and chooser-seat faces
(§P.C).

### §P.G THE READS (frozen strings, #436 item 4(v), character for character)

> **read 1** — *"BOTH STEPS COUNT THE MAN IN FRONT AND THE BALL HITS THE OTHER TEAM LESS, AT NO COST THE BANDS CAN SEE — OP-ENTRY is named (world 19 = 18 + opFrontMan + opFrontChooser)."*
>
> **read 2** — *"COUNTING THE MAN IN FRONT AT BOTH STEPS COSTS A FACE — the breached limb is named and the fork goes to the user (the cost of 甲 is the user's to weigh)."*
>
> **read 3** — *"COUNTING THE MAN IN FRONT AT BOTH STEPS DOES NOT MOVE THE SENTENCE — the commander decides with the table and tells the user plainly what 甲 can and cannot reach."*
>
> **the FALLBACK** — *"THE READS DO NOT COVER THE SHAPE — the commander decides with the table."*
>
> **the liveness string** — *"THE CHOOSER SEAT DID NOT FIRE — no read"*

**THE PRECEDENCE**, on stored booleans of the comparison of record: (0) liveness `gBiteOC` RED ⇒ the liveness string
and nothing selects; (1) `holdsBands` FALSE ⇒ read 2; (2) else `fixes` TRUE ⇒ read 1; (3) else ⇒ read 3; (4) the
FALLBACK only if a stored boolean is ABSENT. The step that selected is a stored string, re-derived off the serialized
artifact (`gReadWords`). The same rule applied to each beside contrast's own stored booleans is stored as that
contrast's word — never selecting. `gReadLiterals` finds all five strings in ruling #436 and in this §P on normalised
prose (blockquote markers — nested ones included — emphasis and backticks removed, whitespace collapsed); the
instrument is the third home.

### §P.H THE ESTIMATOR, THE SEEDS AND THE SIZING

* **Estimator** (OP-T1's = IF-T1b's): every face is a ratio of sums over seeds (per-match faces divide by the seed
  count); the 95 % interval is the cluster bootstrap over seeds, 2,000 draws, indices from `Rng(12,566,000)`, the
  percentile at `floor(q·n)` of the sorted finite draws; a paired Δ resamples the same seed indices on both arms.
* **Block `12,566,000–999`** (fresh — every consumed block through OP-C3 `12,565,000–999` ends below it): battery
  `12,566,000–998`, construction receipt `12,566,999`. BOOKED = WALKED: 999 × 6 + 6 = 6,000 walks.
* **gRepro's re-walk** `12,564,000–011` is OP-T1's own consumed band (not a consumption).
* **N = the affordance (999)**, the disclosed 12-seed smoke reporting the projected half-width of `fb.ground.opponent`'s
  paired Δ on the comparison of record against a declared **0.05** (§DEV-PREFLIGHT). If the smoke projected the battery
  past ~10 h, N would be HALVED and said so in §DEVIATIONS (a sizing deviation, never a read change).
* **Scratch from ONE base `900,010,600`**, inside `900,010,600–699`: smoke `600–611`, smoke receipt `620`, gArms'
  construction walks `640–641`, the world pin `670`, lockstep / X-DET `690–691`, the fixtures' sweep `699`. The
  verifier band `900,010,700–799` is not touched. ZERO stats.
* **The battery runs in chunks** (OP-T1's form): the frozen file in `OPT1B_MODE=chunk` walks battery index ranges and
  writes their rows to a scratch directory OUTSIDE the repository, each file stamped with the running file's sha256
  and the FREEZE commit; chunk mode REFUSES unless the running file is byte-identical to the FREEZE blob and walks
  gRepro FIRST in the same process. `OPT1B_MODE=full` walks gRepro FIRST, reads the chunk files, re-walks the first
  seed of every chunk on all six arms (it must reproduce the stored signature, digest and row), walks the receipt, and
  writes the artifact.

### §P.I THE GATE SET (frozen ex ante) — **24 gates**

OP-T1's 23 by anchor — with `gArmOP` widened to both doors per arm (`gArms`) and `gBiteOP` replaced by `gBiteOC` (#436
item 5(ii)) — PLUS one house gate of OP-C3's form, `gRecall` (§P.L 1): `gRepro` · `gWorld` · `gArms` · `gBiteOC` ·
`gReadLiterals` · `gLockstep` · `gDeterminism` · `gSeedDisjoint` · `gSeedsBookedEqualWalked` · `gScratchBand` ·
`gInheritedProse` · `gLedgerRead` · `gPredicateFixtures` · `gReadWords` · `gFrozen` · `gXSrcZero` ·
`gAnchoredConstants` · `gFingerprintProd` · `gN` · `gPartition` · `gFaces` · `gHashOrder` · `gStage` · `gRecall`.

* **`gRepro`** (FIRST, in every process): OP-T1's `W18-D` and `W18-D+OP` re-walked on `12,564,000–011`; the whole-match
  signature, the trajectory digest AND all 110 keys of OP-T1's row compared field for field with
  `op-t1-front-man-exam.RED.json`'s stored `perSeedCells` (same host ⇒ it GATES; it proves both doors' shut paths are
  the banked ones). RED ⇒ no battery seed is walked or read.
* **`gWorld`**: every walk on world 18 (`ifArmedVersion` 18), the snapshot law absent, the E3 chooser on, the genome
  clean, the trace door shut at construction, `forcedPassTarget` null, `opFrontMan` AND `opFrontChooser` as due per
  arm; the pin at `900,010,670` (six arms; `a4MatchFlags(18)` names neither door); the dose bytes.
* **`gArms`**: both doors read off every walked match and the receipt as due per arm (§P.A); two construction walks at
  `900,010,640–641` × 6 arms, both doors as due at construction and at full time.
* ⭐⭐ **`gBiteOC`** (the liveness precondition, #436 item 4(vi) — a SHARE, ⛔ never every seed): GREEN iff on BOTH
  door-carrying contrasts of the chooser — `W18-D+OP+OC|W18-D+OP` and `W18-E+OP+OC|W18-E` — the per-seed rows (the
  door cells excluded, §P.D 4) differ on a MAJORITY of the N seeds (`> 0.5 · N`), AND on the arm of record
  (`W18-D+OP+OC`) the chooser seat repriced ≥ 1 option (Σ over seeds of repriced calls ≥ 1). The every-seed count, the
  trajectory-moved count, the differing full-time signatures and the row count WITHOUT OP-T1's trace-band cells (§P.L
  10) are stored beside, gating nothing. OP-T1's `gBiteOP`
  is carried in the same SHARE form on `W18-D+OP|W18-D` (rows differ on a majority AND the candidate has front
  releases), STORED, GATING NOTHING.
* **`gReadLiterals`**: §P.G. **`gReadWords`**: every G and S row's breach, direction and tolerance on all four
  contrasts, `holdsBands`, `fixes`, the G10 flag, `gBiteOC` re-derived from the serialized per-seed cells, the read
  word, its sentence and step, and the three beside words — all re-derived off the serialized artifact with the frozen
  rule.
* **`gLockstep`** (6 arms × `690–691`: observed ≡ unobserved in signature AND trajectory digest — the snapshot wrapper,
  the trace door and the chooser-seat re-calls open on the observed walk) · **`gDeterminism`** (X-DET: signature,
  digest and row identical twice per arm; and, in full mode, the chunk re-walks).
* **`gSeedDisjoint`** · **`gSeedsBookedEqualWalked`** (exactly `12,566,000–998` in order, no gap, + the receipt) ·
  **`gScratchBand`** · **`gN`** (999, no override env).
* **`gInheritedProse`** — BY DIFF against the source instruments (CANON: "inherited prose re-read by diff"; #424 item
  4), ⛔ no token list: every prose string in the hashed body (≥ 40 characters and ≥ 5 words; the anchors' code needles
  excluded, each re-checked by `gAnchoredConstants`) is compared byte for byte with every string of the OP-T1, OP-C3,
  OP-C2 and IF-T1b artifacts and with the text of the OP-T1 / OP-C3 / OP-C2 / OP-C1 / OP-C0 / IF-T1b instruments;
  every identical string is LISTED for a human re-read and the gate is RED unless each listed string carries a frozen
  re-read record in the instrument.
* **`gLedgerRead`**: `match.opFrontChooser` REGISTERED — registry **89 → 90** — read on every walked match and handed
  to the re-call exactly as the call site hands it, never written; `match.opFrontMan` already registered (#434); the
  engine records read and the declared reconstructions listed.
* **`gPredicateFixtures`** · **`gAnchoredConstants`** (every needle at its count — OP-T1's, the OP-T0b seam's, OP-C3's
  re-call call site, OP-T1's copied lines; 0.5, 1.5 and `NI_FRACTION` parsed) · **`gFingerprintProd`** (in process, x64
  `59f42aa7…a072d`) · **`gPartition`** (OP-C2's five partitions, OP-T1's, and the exam's: the chooser-seat cells nest
  — agrees ≤ calls, repriced ≤ calls, changed ≤ repriced, repriced options ≥ repriced calls — the null mismatch is 0,
  and an arm whose chooser door is shut reprices nothing) · **`gFaces`** (every face re-derived off disk) ·
  **`gHashOrder`** · **`gStage`**.
* **`gFrozen`**: in full mode, the running instrument is byte-identical to the FREEZE commit's blob, this doc's region
  from `## §0` to `## §R` is byte-identical to the FREEZE commit's, and every chunk is stamped with this file and that
  commit. (In smoke it is not applicable and says so.)
* **`gXSrcZero`**: `git diff 7050efa -- src/ tests/` empty (the OP-T0b seam, #436 item 5(ii)), `git diff 5dd8cdb --
  src/ tests/` empty (the dispatch head), `git status --porcelain -- src tests` empty, and in full mode `git diff
  --stat FREEZE..HEAD -- src tests` empty.
* ⭐ **`gRecall`** (§P.L 1): on every arm, over the battery, the chooser calls number > 0 and on EVERY one of them the
  as-called re-call reproduced the engine's trace entry (§P.D 2) — the chooser-seat face is the engine's own call.

### §P.K WHAT THE READS LEAD TO (#436 item 4(vii), restated)

read 1 ⇒ OP-ENTRY drafted on 自走 (world 19 = 18 + both doors), the honest brief printing the win face's size in the
player's language and every resolved S face, harmful or not, with its interval ⇒ the user's eye gate, with #435 item
2(b)'s appetite question beside it; read 2 ⇒ STOP, a human gate; read 3 ⇒ the commander decides and reports plainly;
no read ⇒ liveness first.

### §P.L DEPARTURES DECLARED BEFORE THE FREEZE (each repeated at §DEVIATIONS; the commander disposes)

1. **A 24th GATE, `gRecall`**, of OP-C3's form (its `gRecall`), is added to OP-T1's 23. The chooser-seat face is an
   in-process re-call; it means something only if the re-call IS the engine's call. `gLockstep` proves the re-call
   inert; `gRecall` proves it faithful. It selects no read.
2. ⭐ **"THE DOOR CELLS" ARE THE TWO FLAG CELLS AND THE CHOOSER-SEAT FACE'S SIX CELLS.** #436 item 4(vi) excludes "the
   door cells" from `gBiteOC`'s row comparison. On a shut chooser arm the seat cells `seatRepriced`,
   `seatRepricedOptions`, `seatChanged` are zero by construction and on an armed arm they are the instrument's own A/B
   of the door — counting them would make a row "differ" with no game event moved (the OP-T1 §P.L 6 lesson for
   `opFlag`). `seatCalls` and `seatRecallAgrees` are excluded with them, as the same instrument family; liveness must
   come from the game's cells. This is the stricter reading.
3. **THE BATTERY RUNS IN CHUNKS** (§P.H): background processes of the frozen file, stamped; the full run re-walks the
   first seed of every chunk on all six arms. The rows are the same function of the same file; only the process
   boundary moves.
4. **THE CHOOSER-SEAT DENOMINATOR IS THE CALLS WITH A PULL** (§P.D 2): a trace entry whose passer pulled no scoped
   snapshot that step (no candidate) has nothing to price and is not a call of the face.
5. **ON A SHUT CHOOSER ARM THE SHUT RE-CALL IS NOT RE-RUN** (§P.B): `frontContact: false` ≡ absent is pinned by OP-T0b
   F1; the face there is zero by construction (and `gPartition` checks it).
6. **`gXSrcZero` CHECKS TWO HEADS** (`7050efa`, named by #436, and `5dd8cdb`, the dispatch head; `src/` and `tests/`
   are identical at both) — a superset of the ruling's wording.
7. **`gRepro` ALSO COMPARES THE TRAJECTORY DIGEST** (OP-T1 stored it) — a superset of "field for field".
8. **ON THE ARMED CHOOSER ARMS THE TRACE STORES THE SEAT'S BAND** (OP-T0b §HONESTY 4): OP-T1's copied `qb` cells read
   the chosen option's band off the trace, so on a +OC arm a repriced pick reads `snapShut`. The re-seat face reads
   only the decider (who seated the target), which does not depend on the band. OP-C2's copied decider read still
   prices `groundCandidate` with the SHIPPED `laneOpenness` (OP-T1 §P.L 7).
9. **THE READ-LITERAL NORMALISER STRIPS NESTED BLOCKQUOTE MARKERS** (OP-T1 §P.L 5), unchanged.
10. ⭐ **SOME OF OP-T1's ROW CELLS MOVE WITH THE SEAT'S PRICE, NOT WITH THE GAME** (found on the shake-out,
    §DEV-PREFLIGHT 2): `qbAll`, `qbInLane`, `qbInLaneByOwner`, `snapBandInLane`, `snapPriceBinInLane`,
    `snapPriceSumE6InLane`, `snapHigherAltInLane`, `snapHigherAltAll` and `qcGsSnapBand` read the chosen option's band
    or price off the E3 trace, which on an armed chooser arm stores the SEAT's band (§P.L 8). A seed where the seat
    repriced a pick that stayed the pick can therefore differ in these cells with every body unmoved. They are OP-T1's
    row cells, not door cells, so they stay IN `gBiteOC`'s gated form (#436's wording, unsoftened and unhardened); the
    count of seeds whose rows differ WITHOUT them is stored beside per pair (`rowsDifferSansTraceBand`,
    `majoritySansTraceBand`), with the trajectory-moved count, gating nothing — so the reader sees whether the
    majority holds on game cells alone.

## §DEV-PREFLIGHT — THE DISCLOSED SMOKE (before the freeze)

Every run below used scratch seeds inside `900,010,600–699` (plus gRepro's re-walk of OP-T1's own band), with the
artifact routed OFF every canonical path by the instrument's override guard. ⛔ Their numbers are NOT results.

1. **THE SHAKE-OUT** (12 seeds `900,010,600–611` × six arms, receipt `620`). gRepro 24 / 24 GREEN at the first attempt
   (OP-T1's signature, trajectory digest and 110-key rows reproduced field for field at the OP-T0b head). 22 / 24; two
   REDs, both fixed BEFORE the freeze:
   * `gReadLiterals` RED (5 / 10) — this doc did not exist yet (its second home);
   * `gInheritedProse` RED — 59 strings byte-identical to OP-T1's / OP-C3's were listed with no re-read record. Each
     was re-read against this exam (OP-T1's anchor descriptions, whose needles `gAnchoredConstants` re-counts; the win
     face definition; the front-man partition and its stated zone difference; the tolerance form; the frozen fallback;
     the halving rule; the ledger reads; three gate notes) and is true here; one (`sizing.whichNWasTaken`) was
     rewritten as this exam's own sentence instead. A record per string now sits in the instrument, plus the full-mode
     `gN` note (identical to OP-T1's / OP-C2's).
2. **A FINDING ON THE SECOND RUN** (24 / 24, same seeds): `gBiteOC`'s rows differed on 12 / 12 seeds of both chooser
   pairs while the trajectory moved on 10 (D) and 11 (E). On the extra seeds the only differing cells were `qbAll` and
   `qcGsSnapBand` — OP-T1 cells that read the chosen option's band off the trace, which on an armed chooser arm stores
   the seat's band. ⇒ §P.L 10: those cells stay in the gated form; the count without them is stored beside.
3. **THE SMOKE OF RECORD** (12 seeds `900,010,600–611` × six arms, receipt `620`): **24 / 24 GATES GREEN** on the file
   frozen here, minus the two sizing constants transcribed from it (`HW_SMOKE_RECORD`, `WALL_PER_MATCH_SMOKE_RECORD`,
   used only in full mode). 254 fixtures; 85 anchors; 120 prose fields compared by diff, 58 listed, all 58 carrying a
   re-read record. Liveness: rows differ on 12 / 12 seeds of both chooser pairs (10 and 11 without the trace-band
   cells, = the trajectory-moved counts); the seat repriced 133 chooser calls on the arm of record. `gRecall`: the
   as-called re-call reproduced every paired trace entry on all six arms (W18-D 694 / 694 · W18-D+OP 659 / 659 ·
   W18-D+OC 691 / 691 · W18-D+OP+OC 651 / 651 · W18-E 627 / 627 · W18-E+OP+OC 607 / 607).

**SIZING** (the house form, #415): the paired Δ of `fb.ground.opponent` on `W18-D+OP+OC|W18-D` at n = 12 has half-width
**0.030455404034633232** against the declared target **0.05**: `se(12) = 0.015538756974547275`,
`se(needed) = 0.05 / (z.975 + z.80) = 0.017847038768172088`, `nRequired = 10`. **N = THE AFFORDANCE, 999** — ≥ the
required n (#436 item 5(iii)). **WALL**: 0.3047222222222222 s per walked match ⇒ 6,000 walks ≈ **0.5078703703703704
h** — far inside ~10 h, so N is NOT halved.

The smoke's own faces are scratch and are not quoted as results; no read is taken on them.

## §R — THE RESULTS

_(written after the battery)_
