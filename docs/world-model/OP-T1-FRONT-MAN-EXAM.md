# OP-T1 — 「身前那个人 · 考」 THE FRONT-MAN EXAM（把身前贴着的人算进传球许可：球少撞到对面身上了吗？代价是什么？）

> **STATUS: WALKED — 22 OF 23 GATES GREEN; `gBiteOP` IS RED, so by the frozen precedence NO READ IS SELECTED and the
> stored string is *"THE SEAT DID NOT FIRE — no read"* (§R-READ). The artifact sits at its RED side path
> `docs/world-model/data/op-t1-front-man-exam.RED.json`.** §0 through §DEV-PREFLIGHT and the instrument were sealed
> at the FREEZE commit `9a1e2e6` BEFORE any battery seed and were NOT edited after sight (`gFrozen` GREEN); only this
> STATUS paragraph moved and §R onward was appended.
> Authorized by **COMMANDER RULING #433 items 3–4** (the reads FROZEN EX ANTE at item 3, their FIRST home;
> the dispatch at item 4), standing on #432 (the user's 「甲吧」 ⇒ 甲 「身前贴着的人要算进去」) and #431.
> Contract: [`OP-FRONT-MAN-CONTRACT.md`](OP-FRONT-MAN-CONTRACT.md) §1 C1–C3 · §2 M-OP.1–4 · §3 OP-T1.
> The seam under exam: [`OP-T0-FRONT-MAN-SEAM.md`](OP-T0-FRONT-MAN-SEAM.md) (`f850404`, read through its
> §COMMANDER CORRECTIONS). The censuses of record: OP-C0 / OP-C1 / OP-C2, each read through its §COMMANDER
> CORRECTIONS.
> Exam form of record: [`IF-T1B-FLIGHT-RUN-EXAM-RERUN.md`](IF-T1B-FLIGHT-RUN-EXAM-RERUN.md) +
> `scripts/probes/if-t1b-flight-run-exam.ts` (the band F-DS-b, `NI_FRACTION` by anchor, the cluster bootstrap,
> the read precedence on stored booleans, `gReadLiterals`, the house gates) — copied in FORM, ⛔ never imported.
> Instrument: [`scripts/probes/op-t1-front-man-exam.ts`](../../scripts/probes/op-t1-front-man-exam.ts) — OP-C2's
> walker COPIED BY RECIPE from [`op-c2-feet-zone-census.ts`](../../scripts/probes/op-c2-feet-zone-census.ts),
> byte for byte in every line that writes a stored OP-C2 cell; the exam's own lines are marked `⭐OP-T1`.
> Artifact: `docs/world-model/data/op-t1-front-man-exam.json` (or its `.RED.json` side path if any gate is red).
>
> ⛔ **X-SRC-ZERO**: not one byte under `src/` or `tests/` is created or edited; no frozen probe and no pinned test
> is touched. Nothing ships: no world names `opFrontMan`.

## §0 WHAT THIS EXAM ASKS, AND THE NUMBERS IT STANDS ON

**THE USER'S SENTENCE** (the world-12 verdict, quoted at OP-C0 §0): 「12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上」.
**THE USER'S FORK ANSWER** (#432): 「甲吧」 ⇒ 甲 「身前贴着的人要算进去」.

**THE QUESTION.** With the licence's lane price armed to read the man strictly ahead of the kicker within 1.5 m
(`opFrontMan`, M-OP.1–2), does the ground pass meet an opponent first LESS often on the user's world (W18-D), and
what does the pressed passer do instead — does any face the band or the 传不出去 band can see get worse?

**THE NUMBERS OF RECORD, READ BY FIELD** (the instrument stores each under `priorOfRecord`, read out of the two
artifacts, never typed; both are x64 numbers on THIS host, on OTHER blocks — beside, never a paired Δ):

| source artifact | arm | field | num / den | value |
| --- | --- | --- | --- | --- |
| `op-c0-opponent-first-census.json` | W18-D | `faces.W18-D.fb.ground.opponent` | 24,900 / 79,964 | 0.31139 |
| `op-c0-opponent-first-census.json` | W18-E | `faces.W18-E.fb.ground.opponent` | 22,434 / 70,563 | 0.317929 |
| `op-c0-opponent-first-census.json` | W18-D | `faces.W18-D.q2.wide.corridorAtRelease` | 13,511 / 24,900 | 0.54261 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.fb.ground.opponent` | 25,050 / 80,724 | 0.310317 |
| `op-c2-feet-zone-census.json` | W18-E | `faces.W18-E.fb.ground.opponent` | 22,488 / 70,548 | 0.318762 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.qd.zoneShare` | 55,196 / 80,724 | 0.683762 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.qd.zone.aheadShare` | 17,054 / 55,196 | 0.308972 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.qd.zoneAhead.zoneManFirst` | 3,767 / 17,054 | 0.220887 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.qd.zoneAhead.anyOppFirst` | 7,320 / 17,054 | 0.429225 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.qd.zoneBehindOnly.zoneManFirst` | 2,063 / 38,142 | 0.054087 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.qd.noZone.anyOppFirst` | 6,712 / 25,528 | 0.262927 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.qb.all.decider.snapshot` | 57,968 / 80,724 | 0.718101 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.qc.givenReading.guardSkip.snapshot` | 4,947 / 5,448 | 0.90804 |

**THE SEAM, AS OP-T0 BANKED IT** (`f850404`; read, never touched): `laneOpennessFront(from, to, opponents)` skips a
man only when his closest point on the segment IS the kicker (`along === 0`); a man at `0 < along < 1.5` is read at
`clamp01(d / CONTROL_RADIUS)`; beyond, `clamp01(d / 4)` as shipped. The seat is the ONE call inside
`groundCandidate`, bound by `const laneOpenness = match.opFrontMan ? laneOpennessFront : laneOpennessShipped;`.

### 在说人话的层面

传球前，传球人会给每条线打个分。原来的打分规则把"贴在传球人身前 1.5 米内"的对手当作不存在。这一版开关打开后，
身前那个人要算进去。我们要看两件事：球撞到对面身上的比例有没有降；以及传球人被身前的人压着时，会不会变成
"传不出去"——每次控球传得更少、被断得更多、或者整段控球一脚没传就丢了。

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — FOUR, PAIRED on shared seeds (#433 item 3(i))

World 18 is composed by CALLING `a4MatchFlags(18)`; the dose is OP-C2's, copied BY ANCHOR (its `buildMatch` lines,
the L3 / PC dose-file pins). Every arm: `new Match({ seed, teamA: teamInfo('A', 2·seed+1), teamB: teamInfo('B',
2·seed+2), ...a4MatchFlags(18) [, opFrontMan: true] })`, then `armA4World(m, null, 18, L3, PC)` on the D arms and
`armA4World(m, null, 18)` on the E arms.

| arm | dose | `opFrontMan` | role |
| --- | --- | --- | --- |
| `W18-D` | the shipped loaders' played book | absent | ⭐ **THE CONTROL** (the user's play) |
| `W18-D+OP` | the same | `true` | ⭐⭐⭐ **THE ARM OF RECORD** |
| `W18-E` | none (empty book) | absent | the E control |
| `W18-E+OP` | none | `true` | the E candidate |

**THE COMPARISON OF RECORD = `W18-D+OP|W18-D`** (candidate − control). The E pair `W18-E+OP|W18-E` is printed
beside with its own stored booleans and word — STORED, COUNTERFACTUAL, NEVER SELECTING.

### §P.B THE WALKER — OP-C2's, COPIED; the exam's reads added

OP-C2's walker (public state and `p.action` around `match.step(DT)`; OP-C2's observing wrapper on
`perceivedSnapshot` and the E3 chooser's own trace door, both pure observation) is copied byte for byte in every
line that writes an OP-C2 cell, so the exam's per-seed row CONTAINS OP-C2's whole 85-key row (`gRepro` compares it).
The exam adds, all pure reads of public state (gLockstep proves the walk inert):

* the door `m.opFrontMan` read off every walked match (`opFlag`; gArmOP);
* a per-step **trajectory digest** (a 32-bit FNV-1a over the tick, the ball's position and velocity, the match rng
  state and every body's position, folded every stepped tick) — gBiteOP's eligibility (§DEVIATIONS 1);
* the predicates of §P.D.

### §P.C THE WIN FACE (#433 item 3(ii))

`fb.ground.opponent` = OP-C0's definition BY FIELD (the copied OP-C2 face line): among MEASURABLE GROUND passes (a
`shortPass`, `throughBall` or `cutback` released on the ground with a target), the share whose FIRST BODY other than
the passer is an opponent: `fbG[opponent] / Σ fbG`.

`fixes(contrast)` = the paired Δ (candidate − control) of `fb.ground.opponent` is **RESOLVED AND DOWN**: the 95 %
cluster-bootstrap interval over seeds lies wholly below zero (`hi < 0`).

**PRINTED BESIDE, NEVER SELECTING:**

* **THE FRONT-MAN FACES.** A **front man** of a ground release is a live (not sent-off) opponent whose closest point
  on the release segment L→E lies STRICTLY ahead of the kicker and short of 1.5 m: `0 < along < 1.5`, `along` = the
  distance from L of `closestPointOnSegment(L, E, his position)` — the seam's own partition, the radius PARSED from
  the seam's form line. L = the ball's position minus its velocity × DT at the release step (OP-C2's launch), E =
  OP-C2's priced aim, his position = the release step's. ⚠ There is NO lateral bound (the seam has none; beyond
  `CONTROL_RADIUS` aside his read is 1, but he is in the partition). Faces: `front.share` = ground releases with ≥ 1
  front man ÷ ground releases; `front.manFirst` = of those, the share whose first body is one of the front men.
* **OP-C2's `qd.*` FACES BY FIELD NAME** (the copied face lines): `qd.zoneShare`, `qd.zone.aheadShare`,
  `qd.zoneAhead.zoneManFirst`, `qd.zoneAhead.anyOppFirst`, `qd.zoneBehindOnly.*`, `qd.noZone.anyOppFirst`. ⚠ THE
  DIFFERENCE, STATED: OP-C2's zone takes the projection `t < 1.5` (behind the kicker included) AND a segment distance
  `< 4 m`; its "ahead" cell counts `t ≥ 0` (level men included). The front partition is strictly ahead (`along > 0`),
  has no 4 m bound, and measures `along` on the clamped closest point. Both are printed.
* **THE RE-SEAT FACE (M-OP.4).** Among ground releases WITH a front man, the share whose target was seated by the
  snapshot chooser — OP-C2's decider attribution copied by anchor (`deciderOfQb` of OP-C1's QB cell):
  `front.reseat.snapshot` (and the other deciders beside), on every arm; the armed arms are the M-OP.4 read.

### §P.D THE NEW PREDICATES — each with a FIRES and a DOES-NOT fixture (`gPredicateFixtures`)

1. **THE POSSESSION**, off the engine's own `match.possessionSide` read after every step: a possession of side s
   OPENS on a step whose value is s and was not s on the previous step (from the other side or from −1), and CLOSES
   on the first step whose value is not s, or at full time. The possession open before the first step (the kick-off
   side) is opened from the pre-walk value. A same-side restart does not split a possession. Its LENGTH in ticks =
   the number of steps after which `possessionSide` was s.
2. **THE PASS ATTEMPT**: a step on which the possessing side's engine `stats.passes` rose; each step's passes are
   credited to the possession open at the start of the step's bookkeeping (before that step closes or opens one).
3. **THE DISPOSSESSION** (S2): after a step, `ball.owner` is a player of the OTHER side than the last non-null owner
   AND no RELEASE happened since that owner last held it. A release = a step on which the last owner's side booked a
   pass, a shot or a clearance, or wrote a new `pendingPass`, or the phase was not `playing`; owning the ball clears
   it. Tackles, steals and loose balls the other side collects after the carrier lost it — never an interception of a
   pass, a shot or a clearance. The engine's own won-tackle counter `stats.tackles` is printed beside.
4. **THE PRESSED DECISION TICK**: a step on which the PRE-STEP ball owner made a FRESH decision (his
   `action.scores` is a new array — OP-C2's own `fresh` test) and the engine's own pressure, `pressureAt(p.pos,
   opp.players)` CALLED at the pre-step positions (the positions the brain decided on), is strictly above **0.5** —
   PARSED from the `passOutletMul` line (`if (pressure > 0.5) bestPass *= W.passOutletMul;`).
5. **THE ACTION MIX** of a pressed decision, by `p.action.type` read after the step: **pass** = `Pass` · `LoftedPass`
   · `ThroughBall` · `Cross`; **dribble** = `Dribble`; **hold** = `HoldUp` · `ShieldHold` · `HoldPosition`;
   **shoot** = `Shoot`; **other** = everything else (`ClearBall`, `ThrowOut`, …). Beside: the share where
   `p.action.type` equals the decision's own top candidate (`scores[0].action`).
6. **THE BACKWARD PASS**: a measurable ground release whose priced aim lies against the passer's attack direction
   from the launch: `(E.x − L.x) · attackDir < 0` (a square ball is not backward).
7. **THE FRONT MAN**: §P.C. Its fixtures include a 4,000-lane sweep (`Rng(900,010,099)`) proving the partition IS
   the seam's: with one live opponent, `laneOpennessFront` differs from `laneOpenness` only where the predicate fires,
   and does differ wherever it fires with the man inside `CONTROL_RADIUS` of the line.

### §P.E THE BANDS — a BREACH = the paired Δ RESOLVED AND beyond `NI_FRACTION · |control level|` IN THE HARMFUL DIRECTION

`NI_FRACTION = 1 − 0.275/0.380`, inherited BY ANCHOR (parsed from `ctb-t1-supply-exam.ts`'s line, the identical
line in `dlc-t1-choice-exam.ts` required to agree), never typed. "beyond" = ceiling: Δ > tol · floor: Δ < −tol ·
both: |Δ| > tol. Every row stores the control level, the candidate level, Δ, its interval, the tolerance,
`absDeltaOverTolerance` and `breachDirection` ∈ {`UP`, `DOWN`, `none`}.

**F-DS-b, G1–G9 + the G10 FLAG — inherited unchanged from `if-t1b-flight-run-exam.ts` by anchor:**

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

**⭐ THE 传不出去 BAND, S1–S3 (new limbs, the same breach law):**

| id | face | harmful direction |
| --- | --- | --- |
| S1 | passes per possession (pass attempts credited to possessions ÷ possessions) | **floor** |
| S2 | dispossessions of the carrier per match | **ceiling** |
| S3 | the share of possessions that end without a pass attempt | **ceiling** |

`holdsBands(contrast)` = no breach among G1–G9 and S1–S3. Every breach stores its direction; the breach set with
directions is stored per contrast.

### §P.F THE 传不出去 FACES (published on every arm, ⛔ no verdict word)

Ground-pass attempts per possession (measurable ground releases by the possessing side ÷ possessions) · the pressed
carrier's action mix (§P.D 4–5) with the pressed share of carrier decisions and pressed decisions per match · the
backward share of ground releases · possession length in ticks and possessions per match · the re-seat face (§P.C).

### §P.G THE READS (frozen strings, #433 item 3(v), character for character)

> **read 1** — *"THE MAN IN FRONT IS COUNTED AND THE BALL HITS THE OTHER TEAM LESS, AT NO COST THE BANDS CAN SEE — OP-ENTRY is named (world 19 = 18 + opFrontMan)."*
>
> **read 2** — *"COUNTING THE MAN IN FRONT COSTS A FACE — the breached limb is named and the fork goes to the user (the cost of 甲 is the user's to weigh)."*
>
> **read 3** — *"COUNTING THE MAN IN FRONT DOES NOT MOVE THE SENTENCE — the commander decides with the table (the held target chooser, M-OP.4, is the first door to look at)."*
>
> **the FALLBACK** — *"THE READS DO NOT COVER THE SHAPE — the commander decides with the table."*
>
> **the liveness string** — *"THE SEAT DID NOT FIRE — no read"*

**THE PRECEDENCE**, on stored booleans of the comparison of record: (0) liveness `gBiteOP` RED ⇒ the liveness string
and nothing selects; (1) `holdsBands` FALSE ⇒ read 2; (2) else `fixes` TRUE ⇒ read 1; (3) else ⇒ read 3; (4) the
FALLBACK only if a stored boolean is ABSENT. The step that selected is a stored string, re-derived off the serialized
artifact (`gReadWords`). `gReadLiterals` finds all five strings in ruling #433 and in this §P on normalised prose
(blockquote markers — nested ones included — emphasis and backticks removed, whitespace collapsed); the instrument is
the third home.

### §P.H THE ESTIMATOR, THE SEEDS AND THE SIZING

* **Estimator** (IF-T1b's): every face is a ratio of sums over seeds (per-match faces divide by the seed count); the
  95 % interval is the cluster bootstrap over seeds, 2,000 draws, indices from `Rng(12,564,000)`, the percentile at
  `floor(q·n)` of the sorted finite draws; a paired Δ resamples the same seed indices on both arms.
* **Block `12,564,000–999`** (fresh — every consumed block through OP-C2 `12,563,000–999` ends below it): battery
  `12,564,000–998`, construction receipt `12,564,999`. BOOKED = WALKED: 999 × 4 + 4 = 4,000 walks.
* **gRepro's re-walk** `12,563,000–011` is OP-C2's own consumed band (not a consumption).
* **N = the affordance (999)**, the disclosed 12-seed smoke reporting the projected half-width of
  `fb.ground.opponent`'s paired Δ on the comparison of record against a declared **0.05** (§DEV-PREFLIGHT). If the
  smoke projected the battery past ~10 h, N would be HALVED and said so in §DEVIATIONS (a sizing deviation, never a
  read change).
* **Scratch from ONE base `900,010,000`**, inside `900,010,000–099`: smoke `000–011`, smoke receipt `020`, gArmOP's
  construction walks `040–041`, the world pin `070`, lockstep / X-DET `090–091`, the fixtures' sweep `099`. The
  verifier band `900,010,100–199` is not touched. ZERO stats.
* **The battery runs in chunks** (§DEVIATIONS 2): the frozen file in `OPT1_MODE=chunk` walks battery index ranges
  and writes their rows to a scratch directory OUTSIDE the repository, each file stamped with the running file's
  sha256 and the FREEZE commit; chunk mode REFUSES unless the running file is byte-identical to the FREEZE blob and
  walks gRepro FIRST in the same process. `OPT1_MODE=full` walks gRepro FIRST, reads the chunk files, re-walks the
  first seed of every chunk on all four arms (it must reproduce the stored signature, digest and row), walks the
  receipt, and writes the artifact.

### §P.I THE GATE SET (frozen ex ante) — **23 gates**

The sixteen named by #433 item 4(ii) — `gWorld` · `gArmOP` · `gBiteOP` · `gReadLiterals` · `gLockstep` ·
`gDeterminism` · `gRepro` · `gSeedDisjoint` · `gSeedsBookedEqualWalked` · `gScratchBand` · `gInheritedProse` ·
`gLedgerRead` · `gPredicateFixtures` · `gReadWords` · `gFrozen` · `gXSrcZero` — PLUS seven house gates of the IF-T1b /
OP-C2 form (§DEVIATIONS 3): `gAnchoredConstants` · `gFingerprintProd` · `gN` · `gPartition` · `gFaces` ·
`gHashOrder` · `gStage`.

* **`gRepro`** (FIRST, in every process): OP-C2's `W18-E` / `W18-D` re-walked on `12,563,000–011`; the whole-match
  signature AND all 85 keys of OP-C2's row compared field for field with `op-c2-feet-zone-census.json`'s stored
  `perSeedCells` (same host ⇒ it GATES). RED ⇒ no battery seed is walked or read.
* **`gWorld`**: every walk on world 18 (`ifArmedVersion` 18), the snapshot law absent, the E3 chooser on, the genome
  clean, the trace door shut at construction, `opFrontMan` as due per arm; the pin at `900,010,070`; the dose bytes.
* **`gArmOP`**: `opFrontMan` 1 on the two +OP arms and 0 on the two controls on every walk and the receipt; two
  construction walks at `900,010,040–041` × 4 arms, the door as due at construction and at full time.
* **`gBiteOP`** (the liveness precondition): the #414 ROW form with its eligibility — on EVERY seed where the door
  changed the match (the candidate's trajectory digest ≠ the control's), the per-seed rows (the door's own `opFlag`
  cell excluded) differ; on BOTH door-carrying contrasts; the door changed ≥ 1 match on each and the candidate has
  front releases. Rows that differ on a seed whose digests coincide, the strict every-seed count, the full-time
  signatures and the counterfactual word under the strict reading are stored beside, gating nothing (§DEVIATIONS 1).
* **`gReadLiterals`**: §P.G. **`gReadWords`**: every G and S row's breach, direction and tolerance, `holdsBands`,
  `fixes`, the G10 flag, the liveness boolean, the read word, its sentence and step, and the E pair's word — all
  re-derived off the serialized artifact with the frozen rule.
* **`gLockstep`** (4 arms × `090–091`, observed ≡ unobserved signatures) · **`gDeterminism`** (X-DET: signature,
  digest and row identical twice per arm; and, in full mode, the chunk re-walks).
* **`gSeedDisjoint`** · **`gSeedsBookedEqualWalked`** (exactly `12,564,000–998` in order, no gap, + the receipt) ·
  **`gScratchBand`** · **`gN`** (999, no override env).
* **`gInheritedProse`** — BY DIFF against the source instruments (CANON; #424 item 4), ⛔ no token list: every prose
  string in the hashed body (≥ 40 characters and ≥ 5 words; the anchors' code needles excluded, each re-checked by
  `gAnchoredConstants`) is compared byte for byte with every string of the OP-C2 and IF-T1b artifacts and with the
  text of the OP-C2 / OP-C1 / OP-C0 / IF-T1b instruments; every identical string is LISTED for a human re-read and
  the gate is RED unless each listed string carries a frozen re-read record in the instrument.
* **`gLedgerRead`**: `match.opFrontMan` REGISTERED — registry **88 → 89** — read on every walked match, never
  written; the engine records read and the declared reconstructions listed.
* **`gPredicateFixtures`** · **`gAnchoredConstants`** (every needle at its count; 0.5, 1.5 and `NI_FRACTION` parsed)
  · **`gFingerprintProd`** (in process, x64 `59f42aa7…a072d`) · **`gPartition`** (OP-C2's five partitions + the
  exam's) · **`gFaces`** (every face re-derived off disk) · **`gHashOrder`** · **`gStage`**.
* **`gFrozen`**: in full mode, the running instrument is byte-identical to the FREEZE commit's blob, this doc's region
  from `## §0` to `## §R` is byte-identical to the FREEZE commit's, and every chunk is stamped with this file and that
  commit. (In smoke it is not applicable and says so.)
* **`gXSrcZero`**: `git diff 59d8984 -- src/ tests/` empty, `git status --porcelain -- src tests` empty, and in full
  mode `git diff --stat FREEZE..HEAD -- src tests` empty.

### §P.K WHAT THE READS LEAD TO (#433 item 3(vi), restated)

read 1 ⇒ OP-ENTRY drafted on 自走 (world 19), the honest brief printing every resolved S face with its interval;
read 2 ⇒ STOP, a human gate; read 3 ⇒ the commander decides (the M-OP.4 census first); no read ⇒ liveness first.

### §P.L DEPARTURES DECLARED BEFORE THE FREEZE (each repeated at §DEVIATIONS; the commander disposes)

1. ⭐⭐ **`gBiteOP` CARRIES AN ELIGIBILITY.** #433 item 4(ii) words it "the #414 row form: per-seed rows differ on both
   door-carrying contrasts". The preflight (§DEV-PREFLIGHT) found that the door changes NO decision in some whole
   matches: the armed and shut walks of such a seed are identical tick for tick, so the strict every-seed reading is
   false whenever one such seed exists and would store the liveness string although the door demonstrably moves most
   matches. The #414 row form as IF-T1b inherited it carries an eligibility (the seeds where the seam's own event
   fired); the OP seam writes no record of its own, so the eligibility here is the door's EFFECT: the seeds whose
   trajectory digest differs between the candidate and the control. The gate keeps its teeth where the meaning is —
   the door moved ≥ 1 match on each contrast, and the row records every match it moved. The strict every-seed count
   and the word the frozen rule would give under the strict reading are STORED beside
   (`reads.strictEverySeedLivenessCounterfactual`), never selecting, so the strict reading is re-derivable.
2. **THE BATTERY RUNS IN CHUNKS** (§P.H): four background processes of the frozen file, stamped; the full run re-walks
   the first seed of every chunk. The rows are the same function of the same file; only the process boundary moves.
3. **SEVEN HOUSE GATES ARE ADDED** to #433's sixteen (§P.I), each from the IF-T1b / OP-C2 form; none selects a read.
4. **THE WALKER IS OP-C2's, WHICH OBSERVES**: #433 item 4(i) says "no wrapper on a walked match"; OP-C2's walker
   carries an observing wrapper on `perceivedSnapshot` and opens the E3 chooser's own trace door. Both are needed —
   the wrapper to reproduce OP-C2's stored rows in `gRepro`, the trace door for the decider attribution (the re-seat
   face). Both are pure observation; `gLockstep` (observed ≡ unobserved) and `gRepro` prove them inert.
5. **THE READ-LITERAL NORMALISER STRIPS NESTED BLOCKQUOTE MARKERS** (IF-T1b's strips one): the ruling quotes the reads
   in a blockquote inside its own blockquote (`>    > …`).
6. **THE DOOR'S OWN ROW CELL (`opFlag`) IS EXCLUDED FROM EVERY ROW COMPARISON** in `gBiteOP`: it differs by
   construction and made every row "differ" on the shake-out, including on seeds whose walks were identical.
7. **OP-C2's COPIED DECIDER READ PRICES `groundCandidate` WITH THE SHIPPED `laneOpenness`** (OP-C2's definition), so
   on the +OP arms its `gc*` cells and its why-lane receipt are NOT the armed licence's lane. This exam reads only its
   decider attribution (who seated the target), which does not depend on the lane.

## §DEV-PREFLIGHT — THE DISCLOSED SMOKE (before the freeze)

Every run below used scratch seeds inside `900,010,000–099` (plus gRepro's re-walk of OP-C2's own band), with the
artifact routed OFF every canonical path by the instrument's override guard. ⛔ Their numbers are NOT results.

1. **THE SHAKE-OUT** (2 seeds `900,010,000–001`, four arms). gRepro 24 / 24 GREEN at the first attempt (OP-C2's 85-key
   rows reproduced field for field). Three defects were found and fixed BEFORE the freeze:
   * `gReadLiterals` RED — this doc did not exist yet (its second home);
   * `gInheritedProse` RED — 45 strings were listed, almost all of them the anchors' verbatim code needles, sha256
     values and paths; "prose" was narrowed to strings of ≥ 40 characters with ≥ 5 words, and the needles (each
     re-checked by `gAnchoredConstants`) were excluded;
   * `gBiteOP` GREEN FOR A WRONG REASON — the door's own row cell `opFlag` made every candidate row differ from its
     control, while on both seeds the `W18-E+OP` and `W18-E` walks had IDENTICAL full-time signatures. `opFlag` is now
     excluded from every row comparison (§P.L 6).
2. **A DIAGNOSTIC OUTSIDE THE INSTRUMENT** (scratch scripts in the session's scratch directory, seeds
   `900,010,000–002`, nothing stored): on world 18 armed by `armA4World(m, null, 18)` (the E arm) the door's lane
   differed from the shipped lane on 372 of 15,965 carrier → mate lane evaluations of seed `900,010,000` (taken at
   every step the ball had an owner, at the pre-step positions, aim = the mate's feet), and `groundCandidate` read the
   door 3,726 times, yet the whole match was identical with the door on all three seeds; on the D arm two of
   three matches moved; without `armA4World` all three moved. ⇒ the door can change NO decision in a whole match: the
   argmax absorbs the price change. Not a defect.
3. **THE FIRST 12-SEED SMOKE** (`900,010,000–011`) with the strict every-seed `gBiteOP`: RED (rows differ on 11 / 12
   seeds of the D pair and 9 / 12 of the E pair), so the read would have been the liveness string while the door
   moved 10 and 9 of the 12 matches ⇒ the eligibility of §P.L 1. A first draft of it also required the rows NOT to
   differ where the trajectory digests coincide; one D-pair seed's row differed with equal digests (the row moved, the
   trajectory did not), so that clause was dropped; such seeds are printed.
4. **THE SMOKE OF RECORD** (12 seeds `900,010,000–011` × 4 arms, receipt `020`): **23 / 23 GATES GREEN** on the file
   frozen here, minus the two sizing constants transcribed from it (`HW_SMOKE_RECORD`, `WALL_PER_MATCH_SMOKE_RECORD`,
   used only in full mode). 219 fixtures; 50 anchors; 89 prose fields compared by diff, 2 listed (the frozen fallback
   literal, identical to IF-T1b's by #433's design; the in-process fingerprint note, identical to OP-C2's) and both
   carry a re-read record — a third record covers the full-mode `gN` note, identical to OP-C2's. Liveness: the door
   moved 10 / 12 (D pair) and 9 / 12 (E pair) matches, rows differ on all of them.

**SIZING** (the house form, #415): the paired Δ of `fb.ground.opponent` on `W18-D+OP|W18-D` at n = 12 has half-width
**0.027741506756226275** against the declared target **0.05**: `se(12) = 0.01415409006239285`,
`se(needed) = 0.05 / (z.975 + z.80) = 0.017847038768172088`, `nRequired = 8`. **N = THE AFFORDANCE, 999** — ≥ the
required n, the #414 §CORR 8 floor reading (a 12-cluster variance is noisy; the front-man and pressed classes are a
few dozen per seed). **WALL**: 0.2641041666666667 s per walked match ⇒ 4,000 walks ≈ **0.29 h** — far inside ~10 h,
so N is NOT halved.

The smoke's own faces are scratch and are not quoted as results; no read is taken on them.

## §R — THE RESULTS

Walked on the frozen instrument (`git diff 9a1e2e6 -- scripts/probes/op-t1-front-man-exam.ts` EMPTY): four chunk
processes (`0–250 · 250–500 · 500–750 · 750–999`, each gRepro 24 / 24 first) and the full run. **999 seeds × 4 arms +
4 receipt walks = 4,000 walks BOOKED = WALKED**; block `12,564,000–999` consumed whole. `perf.batteryInWalkSeconds`
1,288.713 over 3,996 battery walks (`perf.meanWallSecondsPerMatch` 0.32250075075075074 — a machine reading). Every
number below is quoted from an artifact field (`docs/world-model/data/op-t1-front-man-exam.RED.json`), six decimals.

### §R1 — THE WIN FACE (`winTable`, `deltas`)

| contrast | control `fb.ground.opponent` | candidate | paired Δ | 95 % interval | resolved | `fixes` |
| --- | --- | --- | --- | --- | --- | --- |
| **`W18-D+OP\|W18-D`** (of record) | 0.311715 (25,349 / 81,321) | 0.306288 (24,568 / 80,212) | **−0.005427** | [−0.008706, −0.002125] | true | **true** |
| `W18-E+OP\|W18-E` (beside) | 0.318340 (22,506 / 70,698) | 0.317861 (22,167 / 69,738) | −0.000479 | [−0.003458, 0.002528] | false | false |

**THE FRONT-MAN FACES** (the seam's partition) and OP-C2's zone faces beside:

| face | W18-D | W18-D+OP | Δ [interval] (D pair) | W18-E | W18-E+OP | Δ [interval] (E pair) |
| --- | --- | --- | --- | --- | --- | --- |
| `front.share` | 0.339728 | 0.334127 | −0.005601 [−0.009068, −0.002212] | 0.310263 | 0.306648 | −0.003616 [−0.006829, −0.000436] |
| `front.manFirst` | 0.124624 | 0.121936 | −0.002689 [−0.007412, 0.001900] | 0.114201 | 0.107973 | −0.006228 [−0.010362, −0.002253] |
| `front.reseat.snapshot` (M-OP.4) | 0.831361 | 0.826201 | −0.005160 [−0.010138, −0.000171] | 0.819922 | 0.811223 | −0.008700 [−0.013750, −0.003809] |
| `qd.zoneShare` | 0.689281 | 0.682604 | −0.006677 [−0.009977, −0.003342] | 0.620569 | 0.617368 | −0.003201 [−0.006354, 0.000171] |
| `qd.zone.aheadShare` | 0.306157 | 0.302267 | −0.003890 [−0.008187, 0.000276] | 0.286053 | 0.281925 | −0.004128 [−0.008463, −0.000057] |
| `qd.zoneAhead.zoneManFirst` | 0.216130 | 0.211903 | −0.004226 [−0.011752, 0.002750] | 0.203984 | 0.194678 | −0.009306 [−0.016136, −0.002812] |
| `qd.zoneAhead.anyOppFirst` | 0.424509 | 0.425559 | +0.001050 [−0.007137, 0.009768] | 0.436653 | 0.430961 | −0.005693 [−0.013882, 0.002252] |

### §R2 — THE BANDS (`bands`, every row with |Δ| ÷ tolerance)

**`W18-D+OP|W18-D` — `holdsBands` TRUE, breach set EMPTY.**

| id | control | candidate | Δ | interval | tolerance | \|Δ\|÷tol | resolved | breach |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| G1 goals | 2.766767 | 2.828829 | +0.062062 | [−0.043043, 0.171171] | 0.764501 | 0.081180 | false | none |
| G2 shots | 11.396396 | 11.471471 | +0.075075 | [−0.141141, 0.297297] | 3.149004 | 0.023841 | false | none |
| G3 xG conversion | 1.407163 | 1.425433 | +0.018270 | [−0.025658, 0.065420] | 0.388821 | 0.046988 | false | none |
| G4 completion (floor) | 0.608526 | 0.613865 | +0.005340 | [0.002011, 0.008793] | 0.168145 | 0.031756 | true | none |
| G5 interceptions (ceiling) | 29.226226 | 28.365365 | −0.860861 | [−1.219219, −0.513514] | 8.075668 | 0.106599 | true | none |
| G6 possession A | 0.499773 | 0.501073 | +0.001300 | [−0.002666, 0.005254] | 0.138095 | 0.009415 | false | none |
| G7 passes | 88.058058 | 86.965966 | −1.092092 | [−1.680681, −0.516517] | 24.331832 | 0.044883 | true | none |
| G8 aim distance | 14.690180 | 14.717370 | +0.027190 | [−0.020242, 0.076897] | 4.059129 | 0.006699 | false | none |
| G9 through balls | 7.019019 | 7.077077 | +0.058058 | [−0.121121, 0.238238] | 1.939466 | 0.029935 | false | none |
| G10 offsides (FLAG) | 2.420420 | 2.394394 | −0.026026 | [−0.130130, 0.079079] | — | — | false | flag false |
| **S1 passes / possession (floor)** | 1.857867 | 1.861360 | +0.003494 | [−0.010151, 0.017887] | 0.513358 | 0.006805 | false | none |
| **S2 dispossessions / match (ceiling)** | 2.761762 | 2.762763 | +0.001001 | [−0.120120, 0.126126] | 0.763118 | 0.001312 | false | none |
| **S3 possessions without a pass attempt (ceiling)** | 0.126653 | 0.129834 | +0.003181 | [0.000014, 0.006262] | 0.034996 | 0.090906 | **true (UP)** | none |

**`W18-E+OP|W18-E` (beside) — `holdsBands` TRUE, breach set EMPTY.** Resolved rows (none beyond tolerance): G1 +0.109109
[0.005005, 0.219219] (0.118854 of tol) · G2 +0.280280 [0.095095, 0.468468] (0.082131) · G5 −0.277277 (0.041399) · G7
−0.893894 (0.041882) · S3 +0.003207 [0.000463, 0.006004] (0.090449). S1 −0.009923 [−0.022320, 0.002455] and S2 +0.056056
[−0.032032, 0.145145] unresolved. The G10 flag false (Δ −0.113113, resolved DOWN).

### §R3 — THE 传不出去 FACES (`stuck`; no verdict word)

| face | W18-D | W18-D+OP | Δ [interval] (D) | W18-E | W18-E+OP | Δ [interval] (E) |
| --- | --- | --- | --- | --- | --- | --- |
| ground-pass attempts / possession | 1.717445 | 1.718522 | +0.001077 [−0.011718, 0.014932] | 1.663287 | 1.650838 | −0.012449 [−0.023813, −0.001254] |
| pressed mix — pass | 0.343805 | 0.332141 | −0.011665 [−0.018244, −0.005299] | 0.337622 | 0.317271 | −0.020351 [−0.027256, −0.013524] |
| pressed mix — dribble | 0.594929 | 0.606358 | +0.011429 [0.003993, 0.018862] | 0.599243 | 0.622328 | +0.023085 [0.014980, 0.031065] |
| pressed mix — hold | 0.004699 | 0.004986 | +0.000287 [−0.000541, 0.001166] | 0.005106 | 0.005067 | −0.000038 [−0.000897, 0.000783] |
| pressed mix — shoot | 0.033594 | 0.033602 | +0.000008 [−0.001122, 0.001200] | 0.035080 | 0.034094 | −0.000986 [−0.002244, 0.000292] |
| pressed mix — other | 0.022973 | 0.022914 | −0.000059 [−0.001039, 0.000890] | 0.022950 | 0.021240 | −0.001710 [−0.002585, −0.000839] |
| pressed share of carrier decisions | 0.434693 | 0.439281 | +0.004588 [−0.003371, 0.012452] | 0.364888 | 0.376365 | +0.011477 [0.004726, 0.017837] |
| pressed decisions / match | 152.113113 | 153.597598 | +1.484484 [−1.170170, 4.060060] | 118.419419 | 123.664665 | +5.245245 [2.812813, 7.685686] |
| `p.action.type` = top candidate (pressed) | 0.997401 | 0.997556 | +0.000155 | 0.997760 | 0.997734 | −0.000026 |
| backward share of ground releases | 0.310400 | 0.310963 | +0.000564 [−0.002803, 0.003825] | 0.310334 | 0.309716 | −0.000618 [−0.003695, 0.002596] |
| possession length (ticks) | 311.225259 | 316.065217 | +4.839958 [2.099005, 7.583663] | 348.764075 | 350.875627 | +2.111552 [−0.705710, 4.816176] |
| possessions / match | 47.397397 | 46.721722 | −0.675676 [−1.073073, −0.274274] | 42.547548 | 42.286286 | −0.261261 [−0.582583, 0.081081] |
| won tackles / match (engine, beside S2) | 1.962963 | 1.910911 | −0.052052 [−0.154154, 0.038038] | 1.182182 | 1.238238 | +0.056056 [−0.011011, 0.125125] |
| ground releases / match | 81.402402 | 80.292292 | −1.110110 [−1.753754, −0.484484] | 70.768769 | 69.807808 | −0.960961 [−1.454454, −0.463463] |

**THE RE-SEAT FACE (M-OP.4)**: on the arm of record, of the 26,801 ground releases WITH a front man, the snapshot
chooser seated 22,143 — **0.826201** (control 0.831361; Δ −0.005160 [−0.010138, −0.000171]).

### §R4 — LIVENESS (`bite`, `gates.gBiteOP`)

| contrast | seeds whose trajectory moved (eligible) | rows differ on eligible | rows differ, trajectory unmoved | strict every-seed | signatures differ |
| --- | --- | --- | --- | --- | --- |
| `W18-D+OP\|W18-D` | 907 / 999 | **906 / 907** | 25 | 931 / 999 | 907 |
| `W18-E+OP\|W18-E` | 764 / 999 | 764 / 764 | 52 | 816 / 999 | 764 |

⇒ **`gBiteOP` RED.** One seed of the D pair — **12,564,990** — has a moved trajectory (digests `5b28b996` vs
`5d9884f4`, full-time signatures differ) and a row identical in every one of its counted cells (the door's `opFlag`
aside): the door moved bodies in that match without changing a single event the row counts. The frozen gate requires
a differing row on every eligible seed, so it is RED. The door moved 907 of 999 matches on the D pair and 764 on the
E pair; the gate is RED on one row, not on a dead seat.

## §R-READ — THE READ OF RECORD

> ## THE SEAT DID NOT FIRE — no read

**Selected at PRECEDENCE STEP (0)** — *LIVENESS: gBiteOP is RED, so NO READ IS SELECTED* — `reads.word` = `noRead`,
`reads.selectors` = `{ gBiteOP: false, holdsBands: true, fixes: true }`. Re-derived off the serialized artifact by
`gReadWords` (GREEN). Nothing selects.

**PRINTED BESIDE, STORED, NEVER SELECTING:**

* The stored selectors of the comparison of record are `holdsBands` **true** (breach set `[]`) and `fixes` **true**. Had
  the liveness boolean been true, step (2) of the frozen rule would have read *read 1*. This is a counterfactual stated
  off stored booleans; ⛔ it is NOT the read.
* `reads.strictEverySeedLivenessCounterfactual` (the every-seed reading of #433's wording): `strictLiveness` false ⇒
  word `noRead` as well.
* The E pair's stored word: `noRead` (it shares the one liveness gate); its own `holdsBands` true and `fixes` false.

By #433 item 3(vi): **no read ⇒ liveness first** — the commander decides what to do with the one RED row.

## §R6 — 在说人话的层面

这一轮的结论是：按冻结的规矩，**没有读数**。

* 规矩说：开关改动过的每一场，记录表都必须看得出不同。999 场里开关改动了 907 场，其中 906 场看得出，有 1 场（种子
  12,564,990）人跑的位置变了，但我们数的东西一样都没变。就这 1 场，让存活闸亮红，读数就不选。
* 表上能看到的：在用户那组（D）里，球先碰到对面的人从 0.311715 降到 0.306288，区间整个在零以下。
* 代价那边：十条老护栏和三条"传不出去"护栏都没顶穿。每段控球一脚没传就丢的比例从 0.126653 升到 0.129834，
  看得出在升，但只到容差的 0.09。
* 被身前的人压着时，传球少了一点（0.343805 → 0.332141），带球多了一点（0.594929 → 0.606358）。
* 这些都不是读数。读数是"没有读数"，下一步由指挥官决定怎么处理那 1 场。

## §HONEST LIMITS

1. **THE READ IS "NO READ", AND IT TURNS ON ONE SEED.** `gBiteOP` failed on seed 12,564,990 of the D pair alone. The
   eligibility (the trajectory digest) and the row are both the frozen instrument's; a row that counts events can miss
   a match whose bodies moved but whose counted events did not. That is a property of the gate's form, stated, not
   repaired after sight.
2. **THE TABLE'S WORDS ARE NOT A READ.** `fixes` true and `holdsBands` true are stored booleans; under the frozen
   precedence they select nothing because liveness is RED.
3. **THE WIN IS SMALL.** `fb.ground.opponent` moves by −0.005427 on the D pair (about 1.7 % of its level); the E pair
   does not resolve. `front.manFirst` does not resolve on the D pair either (−0.002689 [−0.007412, 0.001900]).
4. **THE BAND'S TOLERANCE IS WIDE** (`NI_FRACTION` = 0.2763157894736842 of the control level). S3's resolved rise
   (+0.003181, 0.090906 of tolerance) and the pressed carrier's pass → dribble shift are visible as faces and are not
   breaches; whether they read as 「传不出去」 is the eye's question.
5. **THE FRONT PARTITION HAS NO LATERAL BOUND** (the seam's own); a man far aside whose closest point falls in
   (0, 1.5 m) is a front man though his read is 1. OP-C2's `qd.*` faces (bounded at 4 m) are printed beside.
6. **THE PRESSURE AND THE FRONT MAN ARE RECONSTRUCTIONS** at the positions the instrument reads (the pre-step positions
   for the pressure; the release step's for the front man) — the engine's closure values are not readable.
7. **OP-C2's COPIED `gc*` CELLS PRICE THE SHIPPED LANE** on every arm (§P.L 7); only the decider attribution is read.
8. **ONE BLOCK, ONE HOST, x64.** Every number is world 18 at this head on x64, N = 999.
9. **NO GATE MEASURES QUALITY.**

## §DEVIATIONS (declared by the executor; the commander disposes)

1–7. **As declared before the freeze at §P.L 1–7** (gBiteOP's eligibility by trajectory digest; the chunked battery;
   the seven house gates; OP-C2's observing walker; the nested-blockquote normaliser; `opFlag` excluded from row
   comparisons; the copied decider read's shipped lane). ⭐ **§P.L 1 is the one the result turns on**: under it
   `gBiteOP` is RED on one seed; under the strict every-seed wording it would be RED on 68 (D) and 183 (E) seeds.
   Either way the stored read is the liveness string.
8. **THE ARTIFACT SITS AT THE RED SIDE PATH** `docs/world-model/data/op-t1-front-man-exam.RED.json` (the red-routing
   idiom, frozen), not at the canonical `…/op-t1-front-man-exam.json` named in #433 item 4(iv).
9. **THE DIAGNOSTIC SCRIPTS OF §DEV-PREFLIGHT 2** lived in the session's scratch directory, used scratch seeds
   `900,010,000–002`, and stored nothing.
10. **NOT PUSHED.** Two commits on the local branch `wm/op-t1-433`.

## §GATES — 22 of 23 GREEN (`allGreen` = **false**, a STORED boolean)

| gate | verdict | note |
| --- | --- | --- |
| `gRepro` | ✅ | 24 / 24: OP-C2's signature and all 85 row keys reproduced on 12,563,000–011 (and in each chunk process) |
| `gLockstep` | ✅ | 8 / 8 observed ≡ unobserved |
| `gDeterminism` | ✅ | X-DET 8 / 8; chunk integrity 16 / 16 |
| `gFingerprintProd` | ✅ | x64 `59f42aa7…` in process (and `npm run fingerprint` = `59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d`) |
| `gXSrcZero` | ✅ | all three diffs 0 bytes |
| `gFrozen` | ✅ | instrument = FREEZE blob of `9a1e2e6`; §0 → §R region (26,746 bytes) identical; chunks stamped |
| `gWorld` | ✅ | every walk and the pin |
| `gArmOP` | ✅ | door as due on all 999 seeds + receipt; 8 / 8 construction walks |
| `gSeedsBookedEqualWalked` | ✅ | 4,000 walks |
| `gSeedDisjoint` | ✅ | 20 consumed blocks below the base |
| `gN` | ✅ | 999 |
| `gScratchBand` | ✅ | 6 scratch seeds in full mode, one base |
| `gAnchoredConstants` | ✅ | 50 / 50 |
| `gPredicateFixtures` | ✅ | 219 / 219 |
| `gLedgerRead` | ✅ | registry 88 → 89 (`match.opFrontMan`) |
| `gPartition` | ✅ | all four arms, every seed |
| **`gBiteOP`** | ❌ | D pair 906 / 907 eligible rows differ (seed 12,564,990); E pair 764 / 764 |
| `gReadLiterals` | ✅ | 10 / 10 |
| `gFaces` | ✅ | 208 / 208 |
| `gReadWords` | ✅ | 33 / 33 |
| `gInheritedProse` | ✅ | 88 prose fields by diff; 3 listed, 3 re-read records |
| `gHashOrder` | ✅ | 37-key schema |
| `gStage` | ✅ | running file's hash |

**CONSUMPTION.** Block `12,564,000–999` consumed whole. Scratch `900,010,000–099` (executor). ZERO stats. Registry 89.
Next sim ≥ **12,565,000**.
