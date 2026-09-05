# LN-C3 — 「没走定价的那一半」 THE UNTRACED-FAMILY SPLIT（那一半弹回的球，是哪一类传球打的；那一类是谁定的价；那个定价的人，看得见自己人吗）

> **STATUS: RESULTS — §0 and §P below are FROZEN, and the complete instrument
> `scripts/probes/ln-c3-untraced-family-census.ts` is committed WITH THEM, BEFORE ANY BATTERY
> SEED IS WALKED.** §DEV-PREFLIGHT is DISCLOSED in full (a 12-seed out-of-band scratch smoke
> and the sizing it produced) and is NOT part of the frozen pair. canon: *freeze-before-battery*
> — freeze the instrument commit BEFORE the battery; the artifact records the instrument hash.
> The RESULTS commit adds §R1–§R7, §HONEST LIMITS, §DEVIATIONS and §GATES and flips this word
> to **RESULTS**; §P is never edited after sight, and the instrument is byte-identical between
> the two commits.
>
> Authorized by **COMMANDER RULING #392 item 5**. Arms **E13** (the read of record) and **D13**
> (beside). Block **12,548,000–999**. Registry **77**. ⛔ **X-SRC-ZERO** — no file under `src/`
> or `tests/` is created or edited. ⛔ **THIS CENSUS ARMS NOTHING.** It is the LAST census of
> the lane arc.

## §0 WHAT THIS IS AND WHY

### THE RULING THAT DISPATCHED IT (#392 item 5, quoted in the compressed form of its own text)

> ⭐⭐ **LN-C3 DISPATCHED — 「没走定价的那一半」 THE UNTRACED-FAMILY SPLIT** (a C0-form census;
> X-SRC-ZERO; definitions frozen at the executor's §P; LN-C2's instrument REUSED with the
> UNTRACED class split). (i) ARMS: E13 of record, D13 beside; the choice ledger armed as LN-C2
> (byte-inertness re-proved). (ii) THE FAMILY of every measured ground pass, off the engine's
> OWN records, never inferred from geometry: the flight record's kind (`shortPass` · `throughBall`
> · `cutback` — PT-C0's own field) × the passer's role (GK / outfield) × the strike site (the arm
> record, the synchronous `performPass`, `performCutback`, `performThroughBall`, the kickoff
> play-back — each anchored, and the kickoff play-back identified by the engine's own restart
> state at the strike, never by geometry) ⇒ the family set F = {LEGACY-outfield, SUBSTITUTED,
> KEEPER-pass, THROUGH-BALL, CUTBACK, KICKOFF-PLAYBACK, OTHER} — LEGACY / SUBSTITUTED reproduced
> from LN-C2 (G-REPRO-LNC2 on the shared fields), the UNTRACED class PARTITIONED into the rest (a
> stored partition receipt: the sum equals LN-C2's UNTRACED count on the re-walked seeds).
> (iii) THE PRICER of each family as a CODE FACT under the amended canon: which function scores
> the struck candidate (groundCandidate → sGc; the through-ball scorer at ~l.905–970; the cutback
> scorer at ~l.1048; the keeper's path; the play-back unpriced), and for each: does its call graph
> read OUR bodies (through the shell or otherwise), does it read the corridor for opponents —
> whole-text hashes of the function AND of every callee whose return enters the score, the call
> graph stored beside each boolean. (iv) FACES per family: pass share, carom share, P(carom |
> family), the shell at the choice (fired / own-only / opp-only) and P(carom | shell, family),
> own-openness cells × shell, present-at-choice, the aim class; LN-C2's path faces reproduced.
> (v) READS (frozen literals on STORED booleans, E13 of record, D13 beside): let the families be
> ranked by carom share; M = the top family's carom share among UNTRACED caroms; K = the smallest
> number of pricers (distinct scoring functions) whose families together hold ≥ 0.8 of ALL caroms.
> M > 0.5 ⇒ *"ONE FAMILY HOLDS THE UNTRACED CAROMS — <its pricer> is hooked first; LN-T0 prices
> the own lane there, at the lane argmax and at the perceived pricer."*; M ≤ 0.5 ⇒ *"THE UNTRACED
> CAROMS ARE SPREAD — LN-T0 prices the own lane at every ground-delivery pricer, the GC hoisting
> precedent."*; beside either, K printed with the pricer list (data, not a literal), and the
> stored boolean `unpricedFamilyHoldsMajorityOfItsCaroms` (a family whose pricer reads NO own
> body at all holds > 0.5 of that family's caroms with the shell fired — the "never charged" fact
> of LN-C2, made per family). (vi) SEEDS: block **12,548,000–999** … RE-WALKS 12,547,000–011
> (G-REPRO-LNC2); ZERO stats; registry **77**; … the join map's duplicate-key count stored
> (§CORR 7); the instrument's inherited descriptive strings RE-POINTED to this census (§CORR 2–4, 6).

### WHAT LN-C2 LEFT (#392 items 2 and 4, quoted; NOT re-argued here)

> UNTRACED (no ledger row — the cutback, the through ball, the kickoff play-back, the keeper's
> passes; the verifier proved the class is exactly these, no join failure) 0.309434 of passes ·
> **0.527230** of caroms · P(carom) **0.179489** … on UNTRACED caroms the shell had fired on
> **0.789421**, and OUR body alone fired it on 0.214420 of UNTRACED passes.

> (ii) **BUT THE PRICERS IT MUST HOOK ARE NOT YET ENUMERATED WITH NUMBERS**: the UNTRACED half is
> 0.527230 of caroms and LN-C2 counted it as one class (its ledger has no row). Building a seam
> that misses the family holding most of those caroms is the RC-T0b error again.

### THE CANON THIS CENSUS'S CODE GATE IS SHAPED BY (#392 item 3, quoted)

> *"a code-fact boolean about what a function reads or does not read is derived from the
> function's WHOLE text and from every callee whose return enters the read, each pinned by an
> anchored text hash — the call graph it was checked over is stored beside the boolean; a hash
> pins a body, it cannot see through a call; a needle list is a confirmation, not a census"*

⭐ THE LESSON, THE THIRD TIME: LN-C1 anchored believed lines and missed a line of the same
function; LN-C2 hashed the whole function and missed a term reached through a CALL. This census
therefore hashes **every node of every pricer's transitive call graph** and stores the graph
beside every boolean. ⛔ **A CODE FACT IS WRITTEN ONLY IF ITS WHOLE GRAPH IS GREEN.**
⚠ **THESE ARE CODE READS, NOT MEASUREMENTS**, and the doc says so wherever they appear.

### in plain football language

LN-C2 counted the passes that carom off one of our own men and found that **more than half of
them never went past either of the two chooser's price lists at all**. Those are the balls struck
by a different piece of the brain: the through ball into a runner, the cutback from the byline,
the keeper's distribution, the kick-off played backwards. Each of those has **its own little
scorer** — and the commander now has to decide which of those scorers gets the new "can I see my
own man in the way?" term. This census answers the only question that decision needs: **which
family holds those caroms, and who prices it.** It measures. It arms nothing.

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — LN-C2's construction, CALLED byte for byte

| arm | composition — the composer **CALLED, never copied** | gate on the match |
|---|---|---|
| **E13** | **world 13 EMPTY-BOOK — the read of record**: `a4MatchFlags(13)` as construction flags + `armA4World(m, null, 13)`, **plus `traceChoice: true` passed EXPLICITLY on the construction** | `bqArmedVersion(m) === 13` |
| **D13** | **world 13 DOSED — THE FORM THE USER PLAYS**: the same, plus the two doses from the **SHIPPED LOADERS THEMSELVES** (`loadL3Dose` / `loadPcDose`, CALLED) | `bqArmedVersion(m) === 13` |

The two arms are **PAIRED on shared seeds** with the IDENTICAL population construction, so they
differ **ONLY** in the world's own books. `gDoseSource` hashes the FILE BYTES this process read
and compares them to the house's standing pins; a mismatch is `process.exit(3)` **before any seed
is walked** — canon, VERBATIM: *"a dose-source guard should hash the bytes it reads, not a
self-declared field"*.

⭐⭐ **`traceChoice` IS NEVER TAKEN FROM AN ENV.** `Match` defaults the flag from
`EDS_TRACE_ARMED` (the `EDS_TRACE_CHOICE` env door — both lines anchored); this instrument's §1
envelope **REFUSES that env outright** (`process.exit(3)` if it is set at all) and the
construction states the boolean itself.

⭐⭐ **THE LEDGER'S BYTE-INERTNESS IS RE-PROVED, NOT INHERITED (`gLockstepTrace`).** The same arm
is walked at the SAME out-of-band scratch seed twice — once with `traceChoice: true`, once with
`false` — and the whole-match signatures (score, phase, ball, every body's position / velocity /
heading / stamina **and the rng stream state**) must be IDENTICAL, with the ledger NON-EMPTY on
the traced walks and EMPTY on the untraced ones. ⛔ **If they are not, the instrument STOPS with
`process.exit(4)` before any battery seed and the census reports BLOCKED.**

`gWorld` asserts, per arm, on EVERY walked match and the construction receipt: `bqArmedVersion` =
13 · `bqCushion` TRUE · `obmMovement` and `ctbSupportPlane` ABSENT · every RC/BF flag absent ·
`info.genome` clean of the RA / corridor / RC / CTB / OBM genes · `emergentPosOn()` TRUE ·
`inSnapshotLaw` ABSENT · `edsPerceivedChoice` TRUE · `traceChoice` TRUE on every walked match
(and FALSE on the untraced lockstep twin) · `bkGroundCorridor` and `dxWindupAim` OPEN ·
`dvExposureWeight` READ off the constructed match's EFFECTIVE genome as a RECEIPT. Pinned again
on a CONSTRUCTED match of each arm at scratch seed **900,003,870**.

⛔ **The census SCORES nothing.** The paired Δ (D13 − E13) is published on every face by a
2,000-draw cluster bootstrap that resamples SEEDS; an interval containing zero reads *"unresolved
at this power"*, never "no difference".

### §P.B THE POPULATION, THE CHOICE TICK, THE AIM AND THE SHELL — INHERITED

| quantity | frozen form |
|---|---|
| **THE POPULATION** | ⭐⭐ **PT-C0's, BYTE FOR BYTE** (LN-C1's and LN-C2's, inherited): every **MEASURED GROUND PASS** — `isMeasurableGroundPass` (`shortPass` \| `throughBall` \| `cutback`, ground launch, with a pending-pass target), registered **at the strike** via `pendingPass`. ONE flight is tracked at a time; a retired flight is **BOOKED** |
| **⭐⭐ THE CHOICE TICK** | **LN-C1's rule, INHERITED**: the **ARM tick** where a wind-up record exists (`arm` class); the **RELEASE tick** for a synchronous strike (`release` class). The `none` class is COUNTED, never imputed |
| **⭐⭐ THE JOIN** | each struck pass is joined to its ledger row by **(decision tick, passerGid)**; `match.passChoiceTrace` is DRAINED per tick into a map on that key. ⭐ **THE JOIN RATE IS A RECEIPT**, never a filter — and, LN-C2 §CORR 7's debt PAID, **the map's DUPLICATE-KEY COUNT is STORED** (`trace.duplicateJoinKeysPerMatch`) |
| **⭐⭐ THE PATH CLASS** | LN-C2's, off the ledger, FROZEN: `legacyChosen` · `legacyNoOption` · `substituted` · `untraced`. **LEGACY** = both legacy sub-classes; **TRACED** = everything but `untraced` |
| **⭐⭐ THE AIM OF RECORD** | ⛔ **NEVER RECOMPUTED.** `arm` class: the wind-up record's OWN `aim` **plus its own `aimLead`**. `release` class: the target's own body position **plus the ENGINE'S OWN recorded strike lead** — `match.dxStrikeAim`'s `lead` when its `gid` and `tick` match this strike. ⚠ **WHERE NO RECORD EXISTS the class is COUNTED as `aim.bodyFallback`** and the target's own position is used — LN-C1's inherited rule, DECLARED, with its own published share. (⭐ LN-C2 §CORR 4 struck an inherited string that stated LN-C1's release rule instead of this one; the instrument's `choiceTick.theAimOfRecord` now states THIS rule, and says so.) |
| **⭐⭐ THE SHELL AT THE CHOICE** | `shellFired` = **`groundShellHazard(passer.pos, aim, [team.players, opp.players], passer.gid, target.gid)` CALLED** — the SHIPPED function, at the CHOICE tick's geometry on the STRUCK lane. Beside it, the SAME function on `[team.players]` (**own-only**) and on `[opp.players]` (**opp-only**). ⛔ Never re-implemented; `gShellFixtures` pins it on hand-built geometry |
| **⭐⭐ THE OWN-OPENNESS** | **LN-C1's CALLED reconstruction, INHERITED byte for byte**: the SHIPPED `laneOpenness(passer.pos, aim, own outfield minus passer minus target)`. Binned on the **fine 0.1 grid** and cut into **[0.0, 0.1) / [0.1, 0.4) / [0.4, 1.0]** on the chooser's OWN anchored 0.4 gate |
| **THE FIRST BODY** | PT-C0's **`ball.lastTouch` FIRST-BODY channel**, byte for byte. **A CAROM = `ownNonTarget`** |

### §P.C ⭐⭐⭐ THE STRIKE SITE — off the engine's own records ONLY

Every measured ground pass is assigned exactly one **STRIKE SITE**, and **NOTHING here is
inferred from geometry or from timing**:

| site | the record that names it | the anchored `src/**` line |
|---|---|---|
| **`cutback`** | PT-C0's own flight kind is `cutback` — the engine's own `cutbacks` counter | `match.performCutback(p, cutbackMate!);` |
| **`throughBall`** | PT-C0's own flight kind is `throughBall` | `match.performThroughBall(p, bestRunner!, bestThroughChip, offsideExemptKick);` |
| **`kickoffPlayback`** | ⭐⭐ **the ENGINE'S OWN RESTART STATE `match.kickoffKickGid`, READ BEFORE THE TICK IS STEPPED**, equals this passer's gid | `match.performPass(p, back);` inside `if (match.kickoffKickGid === p.gid) {` |
| **`arm`** | a TRACKED wind-up record (`pendingPassWindup`) resolved into this strike | `match.armPendingPass(p, passMate!, offsideExemptKick);` (+ the resolve `if (this.pendingPassWindup !== null) this.resolvePendingPassWindup();`) |
| **`ledSynchronous`** | no wind-up record, and `match.dxStrikeAim` names THIS gid at THIS tick | `match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));` |
| **`toFeetSynchronous`** | no wind-up record, no lead deposit | `} else match.performPass(p, passMate!, offsideExemptKick);` |

⭐ **WHY THE KICKOFF STATE IS READ BEFORE THE STEP**: the branch's own first statement is
`match.kickoffKickGid = null;` and the strike happens in the same call, so the value standing
*before* the tick is stepped names the kick-off taker of the strike that tick may produce. Both
lines are anchored, as is the state's declaration on `Match` and its ONE writer
(`this.kickoffKickGid = st.gid;`). `gStrikeSites` demands every site's anchor at its pinned
occurrence count **and** that every site is NON-EMPTY on both arms.

### §P.D ⭐⭐⭐ THE FAMILY — the frozen function of the record fields

**THE FAMILY IS A DETERMINISTIC FUNCTION of four RECORD FIELDS** — the flight **KIND**
(PT-C0's own `klassOf`), the passer's **ROLE** (`Player.role`), the **STRIKE SITE** (§P.C) and
LN-C2's **LEDGER PATH CLASS** — applied in **THIS FROZEN ORDER**:

1. strike site `kickoffPlayback` ⇒ **KICKOFF-PLAYBACK**
2. flight kind `throughBall` ⇒ **THROUGH-BALL**
3. flight kind `cutback` ⇒ **CUTBACK**
4. passer role `GK` ⇒ **KEEPER-pass**
5. ledger path ∈ {`legacyChosen`, `legacyNoOption`} ⇒ **LEGACY-outfield**
6. ledger path `substituted` ⇒ **SUBSTITUTED**
7. otherwise ⇒ **OTHER**

⭐⭐ **THE RULE IS BY (KIND, SITE) FIRST, AND THE LEDGER CLASS IS PUBLISHED BESIDE AS A RECEIPT**
(`ledgerFam.<family>.<path>Share`). **THE ANCHOR FOR THAT ORDER** is the EDS block's own gate,
anchored at the instrument's §3:

```
    match.edsPerceivedChoice && top.action === 'Pass' && top !== cutbackCand
    && p.role !== 'GK' && bestMate !== null
```

— so a **THROUGH BALL** (a different `top.action`; its `action: 'ThroughBall'` push is anchored),
a **CUTBACK** (excluded by IDENTITY, `top !== cutbackCand`; the `cutbackCand = {` site is
anchored), a **KEEPER's** pass (`p.role !== 'GK'`) and the **KICKOFF PLAY-BACK** (a pre-ladder
branch that `return`s before the ladder runs at all) can carry **NO LEDGER ROW BY CONSTRUCTION**.
⚠ **The census does not assume this.** `gFamilyPartition` asserts, on every walked match of both
arms, that the UNTRACED families hold **exactly** the passes and **exactly** the caroms LN-C2's
ledger class calls UNTRACED, and the TRACED families exactly the traced ones — and the
`ledgerFam.*` receipt publishes each family's ledger class either way.

⛔ **`OTHER` IS COUNTED, NEVER POOLED SILENTLY**: every `(kind, role, site, ledger)` combination
that lands in it is itemised in its own stored bin (`families.otherBin`). ⚠ `gClassesNonVacuous`
deliberately does **not** require `OTHER` to be non-empty — an empty `OTHER` is a **RESULT** (the
frozen rule covered every pass), not a vacuous face.

### §P.E ⭐⭐⭐ THE PRICER OF EACH FAMILY — a CALL-GRAPH CODE FACT

| family | its PRICER (the function that scores the struck candidate) |
|---|---|
| LEGACY-outfield · KEEPER-pass | `groundCandidate` (`PlayerBrain.ts`) |
| SUBSTITUTED | `choosePerceivedPassTarget` (`perceivedPassChoice.ts`) |
| THROUGH-BALL | the through-ball scorer (`PlayerBrain.ts`, its own inline candidate and argmax) |
| CUTBACK | the cutback scorer (`PlayerBrain.ts`, its own inline candidate) |
| KICKOFF-PLAYBACK | the kickoff play-back's own pre-ladder scorer (`PlayerBrain.ts`) |
| OTHER | ⛔ no single named scorer — its own bucket in the K ranking, COUNTED |

For each pricer the instrument extracts, by an **ANCHORED START NEEDLE** (occurring exactly ONCE
in its file) and an **ANCHORED END NEEDLE**, the WHOLE TEXT of the scorer **and of every node of
its transitive call graph**, hashes each with sha256, stores the graph (function → callees)
beside the booleans, and derives — from those texts, never typed —

* `readsOwnBodiesThroughTheShell` / `readsOwnBodiesThroughAnotherTerm` /
  `readsOwnBodiesNotAtAll`, with the **named term**;
* `enumeratesOwnBodiesAsCandidatesOnly` (a receipt: reading own bodies to LIST them as options is
  not reading them as obstacles);
* `readsCorridorForOpponents`, with the **named term**.

⭐ **`gcBodies` IS A SEPARATE ANCHORED CONJUNCT** (LN-C2 §CORR 10): the line
`gcSeat === null ? [] : [team.players, opp.players];` is built **ABOVE** `groundCandidate`'s
hashed span, so the shell's POPULATION is exactly the kind of fact a hash cannot see — it is
anchored on its own and ANDed into the shell boolean.

⛔ **`gCodeFactGraph` IS RED AND NO BOOLEAN IS WRITTEN** if any node of any pricer's closure fails
to extract, if any hash is empty, or if two nodes hash the same. A node that is a **leaf**
(pure arithmetic, reads no players) says so in its stored `note` **and is hashed anyway**.

### §P.F THE READS (the literals and their selectors)

Rank the families by **carom share** (of ALL caroms) on the arm being read; ties break on the
FROZEN vocabulary order — a stated tie-break. Let **M** = the **TOP UNTRACED family's** share of
the **UNTRACED caroms**. The **SELECTOR IS A STORED BOOLEAN** (`M > 0.5`), and ONE function
applies the frozen rule to every arm:

* **M > 0.5** ⇒ *"ONE FAMILY HOLDS THE UNTRACED CAROMS — `<its pricer>` is hooked first; LN-T0
  prices the own lane there, at the lane argmax and at the perceived pricer."*
* **M ≤ 0.5** ⇒ *"THE UNTRACED CAROMS ARE SPREAD — LN-T0 prices the own lane at every
  ground-delivery pricer, the GC hoisting precedent."*

The **pricer NAME inside the first literal is DATA**, filled from the stored ranking. Beside
either sentence, as **DATA and never as a literal**: **K** — the smallest number of **DISTINCT
SCORING FUNCTIONS** whose families together hold **≥ 0.8** of ALL caroms — with the **ordered
pricer list and every cumulative carom share** (each its own gated face, with numerator,
denominator and interval); and the per-family boolean
**`unpricedFamilyHoldsMajorityOfItsCaroms`**, written **only** for a family whose pricer's call
graph is GREEN **and** reads NO own body at all, and `null` — never `false` — otherwise.

The **READ OF RECORD** is **E13**; **D13**'s selection is printed BESIDE with an AGREEMENT
boolean; and the SAME rule is applied to **each ESTABLISHED CHOICE-TICK CLASS TAKEN ALONE** (the
`arm` class and the `release` class) as the **counterfactual words**, STORED. canon, VERBATIM:
*"a counterfactual verdict sentence ('had X been scored, the rule would read W') quotes a word
the instrument STORED by applying the frozen rule to X's stored interval; a universal sentence
about a table ('every bin', 'the one bin') is a stored boolean or is not written"*.
⭐⭐ **This doc writes no universal that is not a stored boolean.**

`gReadWords` re-derives, **from the SERIALIZED per-seed cells off disk**: M with its numerator
and denominator, the family ranking, the pricer order, every cumulative carom share, K, the
selector boolean, the printed sentence *with its pricer name filled from the ranking*, the
agreement boolean, the counterfactual words per established class and every
`unpricedFamilyHoldsMajorityOfItsCaroms` — **and LN-C2's inherited read words beside them**.

### §P.G THE ESTIMATOR

**Cluster bootstrap over match SEEDS, 2,000 draws**, rng seeded from the block base 12,548,000.
Every published share carries a 95 % percentile interval and its half-width; every paired Δ is
**D13 − E13** on the seeds the arms share. Medians are **BIN-DERIVED**. ⛔ **Nothing is scored
and no null is cut anywhere.** ⭐ **LEAVE-ONE-OUT** is computed for **every read-bearing share** —
**M on both arms** (this census's own) and LN-C2's `sShare` / `fShare` rows, which this census
reproduces and republishes: drop each seed, re-derive the POINT share, count a FLIP when the
frozen `> 0.5` selector changes. ⚠ A RECEIPT — it gates no direction, and the doc's LOO sentence
is scoped to the rows it covers.

### §P.H SEEDS AND SIZING

* **Block 12,548,000–999** (the frontier of record at #392 item 8; `gSeedDisjoint` checks it
  against the published consumed intervals — LN-C0 12,544,000–999, LN-T1 12,545,000–999, LN-C1
  12,546,000–999 and LN-C2 12,547,000–999). Battery seeds **12,548,000–12,548,111**
  (**N_FROZEN = 112**), construction receipt **12,548,999**. Each seed is walked **ONCE PER ARM
  in EACH of the TWO X-DET passes** ⇒ **448 walks booked = walked**. The **UNWALKED TAIL IS
  DECLARED**: **12,548,112–12,548,998**, stored in `seeds.unwalkedTail`.
* **⭐⭐ N IS SIZED, NOT CHOSEN.** `N = min(the largest nRequired over the two SIZED rows, the
  block's affordance after the construction receipt)`, at a **DECLARED half-width target of
  0.05** on **M** and on the **top family's carom share**, with the house form
  `se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/se(needed))²) ·
  MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`. **WHICH BRANCH BOUND IT IS STORED**
  (`sizing.boundBy`). The table is in §DEV-PREFLIGHT.
* **⚠ WHAT IS NOT SIZED IS STATED INSTEAD**: every other face — the family shares, the shell
  shares, the full cross grid, the strike-site receipts, LN-C2's whole reproduced path table — is
  reported with its **own realised interval** and ⛔ no null is cut on it.
* **Scratch, out-of-band only** (canon, VERBATIM: *"verifier scratch walks use the stage's own
  consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin
  block"*): smoke **900,003,800–811** with its receipt at **900,003,820**; the **world pin** at
  **900,003,870**; **gLockstep** and **gLockstepTrace** at **900,003,890–891**; the scratch band
  **900,003,800–899** is this stage's.
* **⭐ RE-WALKS, NOT CONSUMPTION**: **12,547,000–011** (G-REPRO-LNC2) lie inside LN-C2's OWN
  already-consumed block and are declared re-walks. ⭐⭐ **They are walked with the TRACE ON**,
  because LN-C2's own E13 arm walked them armed — the comparison is like with like.
* **Stats consumed: ZERO.** Registry **77**.

### §P.I THE GATES (all liveness/receipt — NEVER direction)

**X-DET** · **X-FP-PROD** (the production fingerprint recomputed in-probe through the SHIPPED
`League` / `runHeadless` path; the baseline EXTRACTED from OBM-T1's own probe line) ·
**gSrcUntouched** (`git diff --stat HEAD` AND `git status --porcelain` over **`src/` AND
`tests/`** — canon: xSrcUntouched) · **gSeedDisjoint** · **gSeedsBookedEqualWalked** · **gN** ·
**gWorld** · **gDoseSource** · **gAnchoredConstants** · **gLedgerRead** · **gWalkFixtures** ·
**gReproducePTC0** · **gLockstep** · **gTwoFractions** · **gLoo** · **gFaces** (EVERY published
face, paired Δ, bin, median and partition re-derived off the **SERIALIZED** artifact) ·
**gReadWords** · **gHashOrder** (the body hash computed **LAST** off an explicit ALLOWLIST SCHEMA
that **INCLUDES `allGreen`**, with a NON-body `receipts.hashReproducesFromFile`, and EVERY
non-body key enumerated) · **gChoiceTickRule** · **gCodeFact** · **gFnTexts** · **gShellFixtures**
· **gLockstepTrace** · **gTraceJoin** (join share, `targetAgreesShare` = 1.000000, **and the
duplicate-key count STORED**) · **gClassesNonVacuous** · **PLUS LN-C3's OWN THREE**:

* **⭐⭐⭐ gFamilyPartition** — on EVERY walked match and the construction receipt of BOTH arms:
  the family counts SUM to the pass count; the strike-site counts sum to it; every family
  sub-grid (ledger class, strike site, choice class, first body, aim record, the own-openness ×
  shell grid, the carom presence) sums to its own family total; the family caroms sum to the
  first-body `ownNonTarget` cell; the `OTHER` bin's itemised combinations sum to `OTHER`; and —
  **THE RECEIPT OF RECORD** — the UNTRACED families hold **exactly** the passes and **exactly**
  the caroms LN-C2's ledger class calls UNTRACED.
* **⭐⭐ gStrikeSites** — every strike site of the population ANCHORED at its own line at its
  pinned occurrence count (arm · led synchronous · to-feet synchronous · cutback · through ball ·
  kickoff play-back · the wind-up resolve · the restart state and its ONE writer) **and** every
  site NON-EMPTY on both arms.
* **⭐⭐⭐ gCodeFactGraph** — every pricer's function hash **AND** every callee hash **AND** the
  stored call graph; all hashes DISTINCT; every pricer's transitive closure GREEN; the anchored
  `gcBodies` conjunct present. ⛔ A boolean is written only when its graph is green.
* **⭐⭐ G-REPRO-LNC2** — LN-C2's seeds 12,547,000–011 RE-WALKED on E13 with the ledger ARMED and
  matched **FIELD FOR FIELD** against LN-C2's committed `perSeedCells[].E13` over every field the
  two instruments SHARE (the ONE excluded shared field is `wallMs`, a machine timing); the field
  COUNT and the mismatch count are stored.

Canon quoted where it applies — VERBATIM: *"the hashed body is built from an explicit ALLOWLIST
SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"* ·
*"the body hash is computed after every body key is assigned, and a NON-body receipt field
records that the hash reproduces from the written file"* · *"an artifact is written as compact
JSON — no indentation; the hash is over the canonical body regardless; pretty-printing is a
reader's tool, not a storage form"* · *"a src-extracted constant pins its extraction to the NAMED
call site — anchored match + line receipt — never first-occurrence"* · *"a seam-map gate pins
occurrence COUNTS per needle and enumerates EVERY occurrence's site"* · *"a field carries the
unit its name claims"* · *"a scored face's walk-side predicate is pinned — anchored extraction or
fixture — because the re-derivation gate proves arithmetic, not definitions"* · *"a stage doc's
prose quotes artifact FIELDS verbatim or the number becomes a gated face"* · *"a stage doc's
numeric sweep covers EVERY numeric literal in prose at ANY precision; a hand-written percentage
is the likeliest second copy"* · *"a gate's NOTE derives from the same pinned values the gate
checks; a count typed beside its pin is a second copy"* · *"a stage doc's HONEST LIMITS list is
the ONE home; the artifact stores that list verbatim or stores none"* (**this artifact stores
NONE, and its `honestLimitsNote` points at THIS doc**) · *"an event attribution reads the
engine's own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic
is written only where no record exists, and says so"* · *"a code-fact boolean about what a
function reads or does not read is derived from the function's WHOLE text and from every callee
whose return enters the read, each pinned by an anchored text hash — the call graph it was
checked over is stored beside the boolean; a hash pins a body, it cannot see through a call; a
needle list is a confirmation, not a census"*.

## §DEV-PREFLIGHT — the sizing smoke, DISCLOSED in full (⚠ a DISCLOSURE block, not part of the frozen pair)

A **12-cluster scratch smoke** (`LNC3_MODE=smoke LNC3_N=12`, seeds **900,003,800–811**, receipt
900,003,820, world pin 900,003,870, lockstep 900,003,890–891, artifact off the canonical path
under `/tmp`) was run **BEFORE this freeze**. Its realised half-widths were read out of the smoke
artifact's own `faces[].halfWidth` fields — **never re-typed from the console's rounded print** —
and are hardcoded in the instrument's `SIZING_INPUTS`:

| face | realised hw (12 clusters) | target | N required | expected hw at N = 112 | MDE at N = 112 |
|---|---|---|---|---|---|
| `family.KICKOFF-PLAYBACK.caromShareOfUntracedCaroms@E13` (**M**) | 0.10651629072681706 | 0.05 | **112** | 0.034865640357254424 | 0.04983717221819645 |
| `family.KICKOFF-PLAYBACK.caromShareOfAllCaroms@E13` (the top family) | 0.06994554118447924 | 0.05 | **48** | 0.02289505264303766 | 0.032726336583068984 |

⇒ **max(nRequired) = 112**, the block affords **999** after the construction receipt, so
**N = min(112, 999) = 112 — BOUND BY THE SIZING**, and the unwalked tail is declared.

**Disclosed honestly:**

* ⭐ **NEITHER SIZED ROW IS DEGENERATE ON E13** at 12 clusters, so — unlike LN-C2, which had to
  take its F row's variance from D13 — **both variance sources here are the read-of-record arm**.
  Nothing is substituted and there is no sizing deviation to declare on that count.
* ⚠ **THE SIZING ROWS NAME THE FAMILY THE SMOKE'S OWN RANKING PICKED.** On 12 scratch seeds the
  top family and the top UNTRACED family were both `KICKOFF-PLAYBACK`; the sizing rows are
  labelled with that name because that is the face whose variance was read. ⛔ **The battery's
  own ranking is what §R5 reports**, and a battery that ranked a different family first would be
  reported as-is — the sizing row would then be a variance source measured on a neighbouring
  share, which is what it always is.
* ⚠ **12 clusters is a NOISY variance estimate** — a strictly weaker assumption than sizing off a
  published battery. Said here, before the battery.
* ⭐⭐ **THE BYTE-INERTNESS RECEIPT PASSED IN THE SMOKE**: on all 4 arm × scratch-seed pairs the
  traced and untraced whole-match signatures were IDENTICAL, while the ledger itself held 54 / 64
  / 48 / 60 rows on the traced walks and 0 on every untraced one.
* ⭐⭐ **G-REPRO-LNC2 PASSED IN THE SMOKE**: 1,572 field comparisons against LN-C2's committed
  artifact over seeds 12,547,000–011, **0 mismatches**.
* The smoke ran **29/29 GREEN** at N = 112 (the first pass, at the pre-sizing placeholder, was RED
  on `gN` — exactly what the sizing conjunct is there to catch — and on `gClassesNonVacuous`,
  which had demanded a non-empty `OTHER`; `OTHER` was EMPTY, and an empty residue is a RESULT of
  the frozen rule, not a vacuous face, so the conjunct was narrowed to the classes the READ
  stands on and the change is stated HERE, before the battery). With that, `gFaces` re-derived
  3,378/3,378 face-and-Δ checks and 198/198 stored-bin / median / partition / read-word / sizing
  checks off the serialized artifact, over 171 anchored sites, 151 walk-side fixtures, 2,252 face
  rows and 40 call-graph nodes.
* ⚠ The smoke's own POINT readings are **UNPOWERED and bind nothing**. For the record, so nobody
  can claim the freeze was written after seeing a battery: on 12 scratch seeds the E13 arm read a
  family split whose top UNTRACED family was `KICKOFF-PLAYBACK` with M = 0.693878 (34/49), K = 3,
  and it printed **"ONE FAMILY HOLDS THE UNTRACED CAROMS"** with **"THE DOSED WORLD AGREES ON THE
  FAMILY READ"**. **None of these numbers is a finding**; the battery's own §R replaces every one
  of them, and a battery that printed a different sentence would be reported as-is.
* **This section binds nothing.** The freeze is §0–§P.I above.

## §R RESULTS (every number below QUOTES the artifact's own fields at 6 dp — the artifact is the numbers of record, per the #357 standing order)

**THE BATTERY**: N = 112 seeds (12,548,000–12,548,111) × 2 arms × 2 X-DET passes, plus the
construction receipt at 12,548,999 ⇒ **BOOKED = WALKED = 452** (`seeds.walksBooked`). Unwalked
tail declared: 12,548,112–12,548,998. Wall 91.123 s (`perf.batteryWallSeconds`), mean 0.126107 s
per match. **29 of 29 gates GREEN.** Artifact
`docs/world-model/data/ln-c3-untraced-family-census.json`, 3,440,083 bytes,
`hashedBodySha256` `d38134fa43c9ef45206961eeb0ed6da6bee80b819817cc5e65f985c140f8aef5`,
`fileByteSha256` `bf69fd84c4c4d3f17ed90492a295ecf5a92db5afc566ba2dbecbd8d3c2469d72`,
`receipts.hashReproducesFromFile` TRUE.

**THE POPULATION**: 8,531 measured ground passes and 860 caroms on **E13**; 9,429 and 910 on
**D13**.

### §R1 THE FAMILY PARTITION AND THE STRIKE-SITE RECEIPTS

**THE STRIKE SITES** (`site.<site>.passShare` / `.caromShareOfAllCaroms`, E13):

| strike site | passes | share of ALL passes | share of ALL caroms |
|---|---|---|---|
| `arm` (the wind-up) | 4,886 | 0.572735 | 0.436047 (375/860) |
| `ledSynchronous` | 117 | 0.013715 | 0.002326 (2/860) |
| `toFeetSynchronous` | 1,842 | 0.215918 | 0.118605 (102/860) |
| `cutback` | 562 | 0.065877 | 0.012791 (11/860) |
| `throughBall` | 540 | 0.063299 | 0.026744 (23/860) |
| `kickoffPlayback` | 584 | 0.068456 | **0.403488 (347/860)** |

Every one of those six sites is ANCHORED at its own `src/**` line at a pinned occurrence count,
together with the wind-up RESOLVE, the restart state's declaration and its ONE writer
(`gStrikeSites` GREEN); and every site is NON-EMPTY on both arms.

**THE FAMILY PARTITION** (`family.<F>.passShare`, E13 / D13; `gFamilyPartition` GREEN on every
walked match and the construction receipt of both arms):

| family | E13 passes | E13 pass share | D13 passes | D13 pass share |
|---|---|---|---|---|
| LEGACY-outfield | 2,824 | 0.331028 | 2,980 | 0.316046 |
| SUBSTITUTED | 3,211 | 0.376392 | 3,778 | 0.400679 |
| KEEPER-pass | 810 | 0.094948 | 903 | 0.095768 |
| THROUGH-BALL | 540 | 0.063299 | 613 | 0.065012 |
| CUTBACK | 562 | 0.065877 | 665 | 0.070527 |
| KICKOFF-PLAYBACK | 584 | 0.068456 | 490 | 0.051967 |
| **OTHER** | **0** | **0.000000** | **0** | **0.000000** |

⭐⭐ **THE `OTHER` BIN IS EMPTY ON BOTH ARMS** (`families.otherBin.pooled` is an empty list for
E13 and for D13, and `gFamilyPartition` asserts its itemised combinations sum to the family's own
count). The frozen (kind, site, role, ledger) rule covered **every** measured ground pass; there
is no residue to itemise. That is a RESULT of the rule, not an untested assumption — the bin
exists and is published, and it is empty.

**THE LEDGER RECEIPT BESIDE THE RULE** (`ledgerFam.<F>.<path>Share`, E13): LEGACY-outfield is
`legacyChosen` 0.935552 + `legacyNoOption` 0.064448 and `substituted` 0.000000 / `untraced`
0.000000; SUBSTITUTED is `substituted` **1.000000**; and KEEPER-pass, THROUGH-BALL, CUTBACK and
KICKOFF-PLAYBACK are each `untraced` **1.000000**. ⭐⭐ **THE PARTITION RECEIPT OF RECORD**: the
untraced families hold **exactly** the passes (2,496 = `path.established.untraced.passShare`'s
own numerator) and **exactly** the caroms (426) that LN-C2's ledger class calls UNTRACED, and the
traced families exactly the traced ones — asserted per match, per arm, both in the walk
(`gFamilyPartition`) and again off the SERIALIZED artifact
(`partition.untracedFamiliesAreExactlyTheUntracedLedgerClass`).

⭐ **THE (KIND, SITE)-FIRST RULE AND THE LEDGER NEVER DISAGREED.** The rule's order was frozen
because the EDS block's own gate makes a row impossible for those four families; the receipt
above is what the walk found, and it agrees. The receipt is published either way.

**G-REPRO-LNC2**: LN-C2's seeds 12,547,000–011 re-walked on E13 with the ledger armed —
**1,572 field comparisons, 0 mismatches** against the committed artifact
(`reproLnc2.fieldsCompared` / `.mismatches`), the ONE excluded shared field being `wallMs`.

**THE JOIN**: `trace.duplicateJoinKeysPerMatch` is **0.000000 (0/112)** on E13 and on D13 — LN-C2
§CORR 7's debt paid, with a number.

### §R2 THE PRICERS — CALL-GRAPH CODE FACTS (⚠ CODE READS, NOT MEASUREMENTS)

`gCodeFactGraph` GREEN: 40 graph nodes extracted by anchored start/end needles and hashed whole,
all hashes DISTINCT, every pricer's transitive closure green, the anchored `gcBodies` conjunct
present. The full node list, every hash, every line span and the declared graph are in the
artifact's `callGraphNodes`; the per-pricer facts are in `pricers.facts`.

| pricer | families | nodes in its closure | reads OUR bodies | reads the corridor for OPPONENTS |
|---|---|---|---|---|
| `groundCandidate` | LEGACY-outfield · KEEPER-pass | 14 | **YES — through the shell** | YES |
| `choosePerceivedPassTarget` | SUBSTITUTED | 17 | **NO — not at all** | YES |
| `throughBallScorer` | THROUGH-BALL | 12 | **NO — not at all** | YES |
| `cutbackScorer` | CUTBACK | 7 | **NO — not at all** | YES |
| `kickoffPlaybackScorer` | KICKOFF-PLAYBACK | 5 | **NO — not at all** | **NO** |

**`groundCandidate`** — the lane argmax's pricer. Its own lane term is opponent-only, and the
same function subtracts the shell:

```ts
      const lane = Math.min(
        1,
        laneOpenness(p.pos, aim, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),
      );
      const open = opennessAt(aim, opp.players);
      ...
      const sGc = gcSeat === null ? sDv
        : sDv - gcSeat.exposureWeight * groundShellHazard(p.pos, aim, gcBodies, p.gid, mate.gid);
```

with, ABOVE the hashed span and anchored on its own (LN-C2 §CORR 10):

```ts
    gcSeat === null ? [] : [team.players, opp.players];
```

⇒ `readsOwnBodiesThroughTheShell` TRUE, the named term being
`gcSeat.exposureWeight · groundShellHazard(p.pos, aim, gcBodies, p.gid, mate.gid)` over BOTH
teams; `readsCorridorForOpponents` TRUE, the named term `laneOpenness(p.pos, aim, opp.players)`.
Its closure also carries `passMul` → `kickMisalignment`, `deliveryRiskPrice` → `flightExposure`,
`receiverAccessDeficit`, `opennessAt`, and the arithmetic leaves `closestPointOnSegment`,
`receptionZoneIndex`, `clamp01`, `dist` and the `coreRadius` getter — each hashed, each declared
as reading no players where that is true.

**`choosePerceivedPassTarget`** — its argmax runs over `pricePassOption`, whose READ branch prices

```ts
  const reception = threatQuintilePrice(read.interceptionThreatSeconds);
```

and `interceptionThreatSeconds` is built in `evaluatePassOption` by

```ts
  for (const entry of snapshot.players) {
    if (entry.side === passer.side) continue;
    const corridor = evaluatePassCorridorInterception({
```

whose callee marches the flight

```ts
  for (let tick = 1; tick <= ticks; tick++) {
```

and itself refuses a same-side defender (`|| defender.side === passer.side`), while
`evaluatePassAffordance`'s population is

```ts
  const opponents = snapshot.players.filter((p) => p.side !== passer.side);
```

⇒ **`readsCorridorForOpponents` TRUE** (#392 item 3's correction, re-derived here over the whole
graph) and **`readsOwnBodiesNotAtAll` TRUE** — the same-side skip is present at BOTH levels, and
the one same-side loop in the graph (`exitOptionCount`, anchored) feeds no field the price reads.
`enumeratesOwnBodiesAsCandidatesOnly` TRUE: `passChoiceCandidateGids` reads own bodies to LIST
them as options, never as obstacles.

**`throughBallScorer`** — its own inline candidate and argmax:

```ts
      const lane = laneOpenness(p.pos, point, opp.players);
      const behind = clamp01((team.localX(point.x) - line) / 10);
      ...
      const s =
        (W.throughBase + lane * W.throughOpenW + behind * W.throughBehindW) *
        gates * (0.4 + 0.6 * clamp01(lane / 0.45)) * bounceMul;
```

and, on the chip branch, `const landOpen = 1 - pressureAt(point, opp.players);`. Its aim point
comes from `runBurstPoint` → `runTarget`, whose only own-side reads are `team.localX` and
`team.attackDir` (`return v2(targetLocalX * team.attackDir, y);`, anchored), and whose
`defenderLineLocalX` iterates opponents only (anchored). ⇒ **no shell call anywhere in the
closure, and no own body enters the score as an obstacle**.

**`cutbackScorer`**:

```ts
      const lane = laneOpenness(p.pos, arr.pos, opp.players);
      const open = opennessOf(arr, opp.players);
      ...
      let sCB =
        (0.48 + lane * 0.3 + open * 0.28) *
        (inArc ? 1.15 : 0.6) *
        (0.8 + g.attackingWidth * 0.4);
```

⇒ an opponent-only lane and an opponent-radial openness; **no shell**.

**`kickoffPlaybackScorer`** — ⭐⭐ **THE PLAY-BACK IS PRICED, AND #392 item 5(iii)'s parenthetical
"the play-back unpriced" IS WRONG.** It has its own scorer, in the pre-ladder branch:

```ts
  if (match.kickoffKickGid === p.gid) {
    match.kickoffKickGid = null;
    ...
      if (team.localX(mate.pos.x) > -0.5) continue; // must be behind the ball
      const d = dist(p.pos, mate.pos);
      // … (one source comment line elided here — §COMMANDER CORRECTIONS item 12)
      const s = opennessOf(mate, opp.players) - Math.abs(d - 12) * 0.02 - (mate.role === 'GK' ? 0.3 : 0);
```

⇒ it prices a **RADIAL** opponent openness at the mate's own body, a 12 m distance preference and
a keeper penalty. Its closure is `opennessOf` → `opennessAt` → `dist` / `clamp01`.
**`readsCorridorForOpponents` is FALSE** — of the FIVE pricers this census hashed it is the one that
never reads a segment (no boolean is stored over the engine's pricers at large — §COMMANDER
CORRECTIONS item 7) — and `readsOwnBodiesNotAtAll` is TRUE.

### §R3 THE CAROMS AND THE SHELL, BY FAMILY

E13 (`family.*` / `shellFam.*`; every share carries its own numerator and denominator in the
artifact):

| family | share of ALL caroms | P(carom \| family) | shell fired | fired on its caroms | P(carom \| fired) | P(carom \| clear) |
|---|---|---|---|---|---|---|
| **KICKOFF-PLAYBACK** | **0.403488** (347/860) | **0.594178** | **0.828767** | **0.942363** | **0.675620** | 0.200000 |
| SUBSTITUTED | 0.355814 (306/860) | 0.095297 | 0.335098 | 0.539216 | 0.153346 | 0.066042 |
| LEGACY-outfield | 0.148837 (128/860) | 0.045326 | 0.014164 | 0.031250 | 0.100000 | 0.044540 |
| KEEPER-pass | 0.052326 (45/860) | 0.055556 | 0.003704 | 0.022222 | 0.333333 | 0.054523 |
| THROUGH-BALL | 0.026744 (23/860) | 0.042593 | 0.424074 | 0.695652 | 0.069869 | 0.022508 |
| CUTBACK | 0.012791 (11/860) | 0.019573 | 0.297153 | 0.454545 | 0.029940 | 0.015190 |
| OTHER | 0.000000 (0/860) | — | — | — | — | — |

D13 agrees on the shape (share of all caroms: SUBSTITUTED 0.393407 · KICKOFF-PLAYBACK 0.315385 ·
LEGACY-outfield 0.176923 · KEEPER-pass 0.056044 · THROUGH-BALL 0.038462 · CUTBACK 0.019780 ·
OTHER 0.000000). The paired Δ (D13 − E13) on
`family.KICKOFF-PLAYBACK.caromShareOfAllCaroms` is −0.088104 [−0.125450, −0.051541] — the dosed
world's play-back holds a SMALLER share of its caroms — while the Δ on that family's own carom
RATE, `family.KICKOFF-PLAYBACK.caromRate`, is −0.008464 [−0.063801, 0.047589], **unresolved at
this power**.

**WHOSE BODY FIRED THE SHELL** (`shellFam.<F>.ownOnlyShare` / `.oppOnlyShare`, E13):
KICKOFF-PLAYBACK own-only **0.828767**, opponent-only **0.000000** — at the kick-off restart the
shell that fires is **always ours and only ours**. SUBSTITUTED own-only 0.092183 / opp-only
0.273435; THROUGH-BALL 0.083333 / 0.390741; CUTBACK 0.051601 / 0.274021; LEGACY-outfield
0.003541 / 0.010623; KEEPER-pass 0.002469 / 0.002469.

**THE FIRST BODY AT THE CHOICE** (`caromFam.<F>.presence.presentAtChoice`, E13): KEEPER-pass
0.888889 · THROUGH-BALL 0.826087 · CUTBACK 0.818182 · KICKOFF-PLAYBACK 0.720461 · SUBSTITUTED
0.673203 · LEGACY-outfield 0.468750. Pooled over the untraced families: 0.746479 (318/426), with
`arrivedAfterChoice` 0.000000. For THROUGH-BALL, CUTBACK and KICKOFF-PLAYBACK the choice tick IS the
release tick (`choiceFam.*.armShare` 0.000000 — the cell is structurally empty there); for KEEPER-pass
0.422222 of passes are ARM-class (16 of the 426 untraced caroms), so for those the cell was reachable
and its zero is an EMPIRICAL result (§COMMANDER CORRECTIONS item 3).

**THE AIM CLASS** (`aimFam.<F>.recordShare`, E13): LEGACY-outfield 0.831445 · SUBSTITUTED
0.720336 · KEEPER-pass 0.422222 · THROUGH-BALL, CUTBACK and KICKOFF-PLAYBACK **0.000000** — the
three synchronous families carry no aim record at all, so their aim of record is the DECLARED
body fallback on every pass (`aimFam.*.bodyFallbackShare` 1.000000 each). **THE CHOICE-TICK
CLASS** beside it (`choiceFam.<F>.armShare` 0.790014 · 0.720336 · 0.422222 · 0.000000 · 0.000000 ·
0.000000) differs from the aim-record share on LEGACY-outfield by 0.041431 — the 117 `ledSynchronous`
strikes, release-class strikes carrying a `dxStrikeAim` lead deposit (an aim record without an arm
tick), exactly as §P.B's aim rule provides (§COMMANDER CORRECTIONS item 4).

**LN-C2's PATH FACES, REPRODUCED** on this block (E13, established): LEGACY passes 0.331028 /
caroms 0.148837 / P(carom) 0.045326; SUBSTITUTED 0.376392 / 0.355814 / 0.095297; UNTRACED
0.292580 / **0.495349** / 0.170673. The shell: fired on 0.014164 of LEGACY, 0.335098 of
SUBSTITUTED and 0.353766 of UNTRACED passes; on UNTRACED caroms it had fired on **0.819249**, and
P(carom | fired) on that path is 0.395243. LN-C2's own read reproduces: `read.established.sShare`
**0.705069** (306/434) > 0.5, `read.established.fShare` 0.031250 (4/128),
`read.established.untracedShareOfAllCaroms` **0.495349**.

### §R4 OWN-OPENNESS × SHELL × FAMILY — THE FULL GRID

E13, `cellFam.<family>.<cell>.shell<0|1>.share` (share of that family's passes with a choice
geometry) with `.caromRate` beside. **EVERY CELL IS PRINTED, INCLUDING THE EMPTY ONES.**

| family | [0.0,0.1) clear | [0.0,0.1) FIRED | [0.1,0.4) clear | [0.1,0.4) FIRED | [0.4,1.0] clear | [0.4,1.0] FIRED |
|---|---|---|---|---|---|---|
| LEGACY-outfield | 0.000000 (0/2824) — | 0.000354 (1/2824) cr 0.000000 | 0.064448 (182/2824) cr 0.307692 | 0.003187 (9/2824) cr 0.222222 | 0.921388 (2602/2824) cr 0.026134 | 0.010623 (30/2824) cr 0.066667 |
| SUBSTITUTED | 0.000000 (0/3211) — | 0.051697 (166/3211) cr 0.397590 | 0.070383 (226/3211) cr 0.309735 | 0.065712 (211/3211) cr 0.274882 | 0.594519 (1909/3211) cr 0.037192 | 0.217689 (699/3211) cr 0.058655 |
| KEEPER-pass | 0.000000 (0/810) — | 0.001235 (1/810) cr 0.000000 | 0.141975 (115/810) cr 0.243478 | 0.002469 (2/810) cr 0.500000 | 0.854321 (692/810) cr 0.023121 | 0.000000 (0/810) — |
| THROUGH-BALL | 0.000000 (0/540) — | 0.051852 (28/540) cr 0.071429 | 0.068519 (37/540) cr 0.162162 | 0.077778 (42/540) cr 0.166667 | 0.507407 (274/540) cr 0.003650 | 0.294444 (159/540) cr 0.044025 |
| CUTBACK | 0.000000 (0/562) — | 0.032028 (18/562) cr 0.055556 | 0.048043 (27/562) cr 0.000000 | 0.049822 (28/562) cr 0.142857 | 0.654804 (368/562) cr 0.016304 | 0.215302 (121/562) cr 0.000000 |
| KICKOFF-PLAYBACK | 0.000000 (0/584) — | 0.505137 (295/584) cr 0.911864 | 0.051370 (30/584) cr 0.466667 | 0.054795 (32/584) cr 0.812500 | 0.119863 (70/584) cr 0.085714 | 0.268836 (157/584) cr 0.203822 |
| OTHER | 0.000000 (0/0) — | 0.000000 (0/0) — | 0.000000 (0/0) — | 0.000000 (0/0) — | 0.000000 (0/0) — | 0.000000 (0/0) — |
| UNTRACED-ALL | 0.000000 (0/2496) — | 0.137019 (342/2496) cr 0.795322 | 0.083734 (209/2496) cr 0.229665 | 0.041667 (104/2496) cr 0.365385 | 0.562500 (1404/2496) cr 0.020655 | 0.175080 (437/2496) cr 0.089245 |
| TRACED-ALL | 0.000000 (0/6035) — | 0.027672 (167/6035) cr 0.395210 | 0.067606 (408/6035) cr 0.308824 | 0.036454 (220/6035) cr 0.272727 | 0.747473 (4511/6035) cr 0.030814 | 0.120795 (729/6035) cr 0.058985 |
| ALL | 0.000000 (0/8531) — | 0.059665 (509/8531) cr 0.664047 | 0.072324 (617/8531) cr 0.282010 | 0.037979 (324/8531) cr 0.302469 | 0.693354 (5915/8531) cr 0.028402 | 0.136678 (1166/8531) cr 0.070326 |

⚠ The `[0.0, 0.1) shell CLEAR` column is **empty in every row** — a body ON the line is, by
construction, inside the shell — and the artifact stores it as a face with a zero numerator, so
this doc can print it rather than omit it (LN-C2 §CORR 9's debt paid, structurally).

⭐ **LN-C2's GRADED GAP, PER FAMILY**: the `[0.1, 0.4) shell CLEAR` cell — our body between 0.1
and 0.4 openness with the shell not firing — is where a graded own-body term would bite and the
binary shell does not. On E13 it is 0.064448 of LEGACY-outfield's passes caroming 0.307692;
0.070383 of SUBSTITUTED's caroming 0.309735; 0.141975 of KEEPER-pass's caroming 0.243478;
0.068519 of THROUGH-BALL's caroming 0.162162; 0.048043 of CUTBACK's caroming 0.000000; and
0.051370 of KICKOFF-PLAYBACK's caroming 0.466667.

`openFam.<F>.ownOpennessMean` (E13): LEGACY-outfield 0.900429 · CUTBACK 0.832303 · KEEPER-pass
0.798299 · SUBSTITUTED 0.788658 · THROUGH-BALL 0.767597 · **KICKOFF-PLAYBACK 0.413493**;
`openFam.<F>.ownOpenBelow40Share` KICKOFF-PLAYBACK **0.611301** (357/584) against LEGACY-outfield
0.067989 · SUBSTITUTED 0.187792 · KEEPER-pass 0.145679 · THROUGH-BALL 0.198148 · CUTBACK 0.129893 — the
six stored values, printed together (§COMMANDER CORRECTIONS item 7).

### §R5 THE RANKING, M, K AND THE PRICER LIST

**THE FAMILY RANKING BY CAROM SHARE** (`familyReads.cells.E13.familyRanking`): KICKOFF-PLAYBACK
0.403488 · SUBSTITUTED 0.355814 · LEGACY-outfield 0.148837 · KEEPER-pass 0.052326 · THROUGH-BALL
0.026744 · CUTBACK 0.012791 · OTHER 0.000000.

**M** — the TOP UNTRACED family's share of the UNTRACED caroms — is
**0.814554 (347/426), 95 % CI [0.774775, 0.855422], half-width 0.040323** on **E13**, and the top
untraced family is **KICKOFF-PLAYBACK**, priced by **`kickoffPlaybackScorer`**. On **D13** M is
0.734015 (287/391) [0.695090, 0.775561]; the paired Δ is −0.080539 [−0.132098, −0.026590].
⭐ **LOO**: over the 112 seeds, dropping any one leaves M in [0.810552, 0.822275] on E13 and
[0.729870, 0.744125] on D13, with **0 selector flips on either arm** (`loo.rows`, the two M rows;
this sentence is scoped to those two rows).

**K = 3** on both arms (`familyReads.cells.<arm>.k`, target 0.8). The ordered pricer list with
its cumulative carom shares (E13, each its own gated face with an interval):

| rank | pricer | cumulative carom share | half-width |
|---|---|---|---|
| 1 | `kickoffPlaybackScorer` | 0.403488 (347/860) | 0.035815 |
| 2 | `choosePerceivedPassTarget` | 0.759302 (653/860) | 0.028411 |
| 3 | `groundCandidate` | **0.960465 (826/860)** | 0.015030 |
| 4 | `throughBallScorer` | 0.987209 (849/860) | 0.007984 |
| 5 | `cutbackScorer` | 1.000000 (860/860) | 0.000000 |
| 6 | OTHER (no single named scorer) | 1.000000 (860/860) | 0.000000 |

On **D13** the order's first two swap — `choosePerceivedPassTarget` 0.393407, then
`kickoffPlaybackScorer` 0.708791, then `groundCandidate` 0.941758 — and **K is 3 there too**.
⚠ The D13 cumulative rows carry no interval: the cumulative faces were DEFINED on the E13 order
(the read-of-record arm's), and D13's own order differs, so its rows are stored with their
numerators, denominators and point shares and with `halfWidth` = null. That is a declared
deviation (§DEVIATIONS 2), not a silent gap.

**`unpricedFamilyHoldsMajorityOfItsCaroms`** — written ONLY for a family whose pricer's call graph
is green AND reads NO own body at all, `null` otherwise (E13 and D13 identical):

| family | boolean | why |
|---|---|---|
| SUBSTITUTED | **true** | `choosePerceivedPassTarget` reads no own body; 0.539216 of its caroms had the shell firing |
| THROUGH-BALL | **true** | `throughBallScorer` reads no own body; 0.695652 |
| KICKOFF-PLAYBACK | **true** | `kickoffPlaybackScorer` reads no own body; 0.942363 |
| CUTBACK | false | `cutbackScorer` reads no own body, but only 0.454545 of its caroms had the shell firing |
| LEGACY-outfield · KEEPER-pass | null | their pricer `groundCandidate` DOES read our bodies, through the shell |
| OTHER | null | no single named scorer |

### §R6 THE READS, PRINTED

**THE READ OF RECORD (E13):**

> **ONE FAMILY HOLDS THE UNTRACED CAROMS — `kickoffPlaybackScorer` is hooked first; LN-T0 prices
> the own lane there, at the lane argmax and at the perceived pricer.**

**THE DOSED WORLD AGREES ON THE FAMILY READ** (D13 selects the same literal, with the same
pricer name filled from its own ranking).

The selector is the STORED boolean `mGreaterThanHalf` = TRUE on both arms; M and its interval are
in §R5; the pricer NAME is DATA, filled from the stored ranking.

**K AND THE PRICER LIST, BESIDE** (data, not a literal): **K = 3**, the ordered list being
`kickoffPlaybackScorer` → `choosePerceivedPassTarget` → `groundCandidate` on E13
(cumulative 0.960465), and `choosePerceivedPassTarget` → `kickoffPlaybackScorer` →
`groundCandidate` on D13 (cumulative 0.941758). **The two arms name the same three functions.**

**THE COUNTERFACTUAL WORDS** — the SAME frozen rule applied to each ESTABLISHED choice-tick class
TAKEN ALONE on E13 (`familyReads.counterfactualWordsByClass`):

* **`arm` class alone**: M = 1.000000 (16/16), top untraced family **KEEPER-pass** ⇒ *"ONE FAMILY
  HOLDS THE UNTRACED CAROMS — `groundCandidate` is hooked first…"*. ⚠ On sixteen caroms: the
  `arm` class is the wind-up, and the only untraced family that ever carries a wind-up record is
  the keeper's (`aimFam.KEEPER-pass.recordShare` 0.422222) — the through ball, the cutback and
  the play-back are all synchronous.
* **`release` class alone**: M = 0.846341 (347/410), top untraced family **KICKOFF-PLAYBACK** ⇒
  the SAME sentence as the read of record, with the SAME pricer name.

**LN-C2's OWN READ, REPRODUCED** on this block and printed beside, unchanged in form: *"THE CAROM
COMES THROUGH THE PERCEIVED CHOOSER"*, with S = 0.705069 and the UNTRACED share of all caroms
0.495349.

### §R7 在说人话的层面

**开球那一脚往回传，是这套引擎里最容易撞到自己人的球。** 它只占所有地面传球的 0.068456，却占了所有
「撞到自己人」的 0.403488；每三脚里差不多有两脚会先碰到自己人（P(carom | family) 0.594178）。原因在
数字里摆着：开球时全队都挤在球后面，那条线上的「贴身壳」在 0.828767 的开球回传上是响的，而且**响的
永远是我们自己人**（opponent-only 0.000000）。可是这脚球的定价函数只会问「这个人身边有没有对手」
（一个以他身体为中心的半径读数），**连一条线都不看**——这次普查 hash 过的五个地面传球定价器里，它是唯一
一个连走廊都不读的（§COMMANDER CORRECTIONS 7）。

**但「一个家族」不等于「只修一个地方」。** M = 0.814554 说的是：**没进定价台账的那一半 caroms 里，
八成是开球回传**。而把所有 caroms 摆在一起看，要盖住八成得用**三个**定价函数（K = 3）：开球回传的
那个、感知选择器、以及球道 argmax 的 `groundCandidate`——两个 arm 点的是同样这三个。剩下三个家族
（穿透球、倒三角、门将）加起来只补最后的 0.039535。

**还有一条对得上的旧账。** 三个「读不到自己人」的家族里，有三个的 caroms 大多数是在壳**已经响了**的
情况下发生的（SUBSTITUTED 0.539216、THROUGH-BALL 0.695652、开球回传 0.942363）——引擎其实**看得
见**那个人，只是**这些定价器从来没被收过这笔钱**。倒三角是唯一一个不到一半的（0.454545）。

**这仍然只是普查。** 它没有装任何东西，也没有说该收多少钱。它给指挥官的是一张表：**先钩哪个函数、
一共要钩几个、以及每个函数现在到底看得见什么。**

## §HONEST LIMITS

⛔ canon, VERBATIM: *"a stage doc's HONEST LIMITS list is the ONE home; the artifact stores that
list verbatim or stores none"*. **THIS IS THE ONE HOME**; the artifact stores NONE and its
`honestLimitsNote` points here.

1. ⚠⚠ **THE HEADLINE FAMILY IS A RESTART FAMILY, NOT OPEN PLAY.** The kick-off play-back happens
   once per kick-off, with the whole team packed behind the ball by the restart's own shape —
   which is exactly why its own-openness mean (0.413493) is far below every other family's and
   why the shell fires on it so often. Its carom share is a real measurement of a real ball the
   user watches; it is **not** evidence about open-play lanes, and a seam priced only there would
   move a restart, not the game.
2. ⚠ **PRICING THE PLAY-BACK MAY BE NEARLY VACUOUS.** Its scorer's candidate set is "mates behind
   the ball"; at kick-off nearly every mate is behind the ball and nearly every lane has one of
   ours in it. An own-lane price there could have no admissible alternative to move to. This
   census measures the caroms; it does NOT show that a price would change any of them.
3. ⚠ **THE CAROM IS A FIRST-BODY EVENT, NOT A LOST BALL.** `ownNonTarget` first contact is
   PT-C0's channel, inherited; a carom off our own man may still end in our possession. No
   outcome axis is measured here.
4. ⚠ **THE SHELL AT THE CHOICE IS A CALLED RECONSTRUCTION OF A COUNTERFACTUAL.** For the four
   untraced families the shipped `groundShellHazard` was never invoked by the engine on that
   lane; this census CALLS the shipped function at the choice tick's geometry to ask what it
   would have said. That is a declared reconstruction, not a record of a price that was paid.
5. ⚠ **THE OWN-OPENNESS IS LN-C1's DECLARED RECONSTRUCTION**, inherited byte for byte: the
   shipped `laneOpenness` called with own outfield minus passer minus target. The engine never
   computes it.
6. ⚠ **THE AIM OF RECORD IS A BODY FALLBACK ON EVERY SYNCHRONOUS UNTRACED PASS**
   (`aimFam.THROUGH-BALL/CUTBACK/KICKOFF-PLAYBACK.bodyFallbackShare` all 1.000000): those strike
   sites deposit no aim record, so the lane read is passer → target's body. For the through ball
   in particular the ENGINE aimed at a projected burst point, not at the body — so this census's
   through-ball lane is the LAUNCH-TO-TARGET line, not the scorer's own aim. That understates
   nothing and overstates nothing in a known direction; it is simply a different segment.
7. ⚠ **THE CODE FACTS ARE CODE READS.** `readsOwnBodiesNotAtAll` means "no own body enters the
   score as an obstacle anywhere in the stored call graph". It does not mean the function is
   blind to teammates: four of the five pricers enumerate own bodies as CANDIDATES
   (`enumeratesOwnBodiesAsCandidatesOnly`), which is stored beside the boolean.
8. ⚠ **THE CALL GRAPH IS DECLARED, AND A DECLARED GRAPH CAN BE INCOMPLETE.** It is built from
   the callees whose return the executor traced into each score, and every node in it is hashed;
   a callee that was never named would not be hashed and the gate could not know. This is the
   third form of the same lesson (anchors → whole function → graph) and it is not proof against
   a fourth.
9. ⚠ **`OTHER` IS EMPTY, SO ITS ITEMISATION SHOWS NOTHING.** The bin, the gate and the face all
   exist; the frozen rule left no residue on these 112 seeds. A different world could.
10. ⚠ **N = 112 IS SIZED ON M AND ON THE TOP FAMILY'S CAROM SHARE ONLY.** Every other face —
    including CUTBACK's own caroms (11 on E13, 18 on D13) and the `arm`-class counterfactual's
    sixteen — is reported with its realised interval and is NOT powered.
11. ⚠ **THE `arm`-CLASS COUNTERFACTUAL RESTS ON SIXTEEN CAROMS** and names a different pricer
    (`groundCandidate`) purely because the keeper is the only untraced family that ever winds up.
    It is a stored word, not a finding.
12. ⚠ **TWO ARMS, ONE WORLD.** E13 and D13 differ only in the two shipped dose books; neither is
    a different mechanic. Nothing here says what any world OTHER than world 13 would do.
13. ⚠ **THE D13 CUMULATIVE ROWS CARRY NO INTERVAL** (§DEVIATIONS 2).
14. ⚠ **ZERO STATS CONSUMED**, so nothing here touches the evolutionary ledger; and the census
    ARMS NOTHING.

## §DEVIATIONS

1. **NONE ON THE SIZING'S VARIANCE SOURCE.** Unlike LN-C2, neither sized row was degenerate on
   the read-of-record arm at 12 clusters, so both half-widths come from E13. Stated because the
   ancestor's deviation was on exactly this line.
2. **THE CUMULATIVE-CAROM-SHARE FACES ARE DEFINED ON E13's PRICER ORDER.** The face keys
   (`pricerCumulative.rank<r>.caromShare`) are frozen at the instrument's estimator on the
   read-of-record arm's ranking. D13's own ranking differs at ranks 1–2, so D13's stored
   cumulative rows carry point shares, numerators and denominators but `halfWidth` = null. K is
   computed on each arm's own cumulative sums either way, and `gReadWords` re-derives both arms'
   orders, cumulative sums and K off the serialized artifact.
3. **THE SIZING ROWS ARE LABELLED WITH THE SMOKE'S OWN TOP FAMILY** (`KICKOFF-PLAYBACK`), which
   the battery's ranking also produced. Had the battery ranked a different family first, the
   sizing row would have been a variance source measured on a neighbouring share. Disclosed in
   §DEV-PREFLIGHT before the battery.
4. **`gClassesNonVacuous` DOES NOT REQUIRE `OTHER` TO BE NON-EMPTY.** The conjunct was narrowed
   before the freeze (stated in §DEV-PREFLIGHT) because an empty residue is a RESULT of the
   frozen rule, not a vacuous face; the six named families, the pooled untraced caroms, the top
   untraced family's caroms and every strike site are all still required non-empty.
5. **#392 item 5(iii)'s PARENTHETICAL "the play-back unpriced" IS CORRECTED BY THE CODE.** The
   kick-off play-back HAS its own scorer (quoted at §R2). The ruling's family set, seeds, gates
   and reads are unchanged; only that parenthetical is contradicted, and it is contradicted by an
   anchored, hashed function body.
6. **THE THROUGH-BALL AND CUTBACK SCORERS ARE INLINE BLOCKS, NOT NAMED FUNCTIONS.** They are
   extracted as anchored spans (start needle unique in the file, end needle at the candidate
   push) and hashed as such. They are "functions" in the graph's sense, not in TypeScript's.
7. **`OTHER` IS CARRIED AS A SIXTH "PRICER" IN THE K RANKING** ("OTHER (no single named
   scorer)"), so that K is computed over a partition of ALL caroms. It contributed nothing here.
8. **THE COUNTERFACTUAL WORDS ARE COMPUTED ON THE READ-OF-RECORD ARM ONLY** (E13), per class;
   D13's whole-arm word is stored separately as the agreement boolean.

## §PROSE SWEEP

Every numeric literal in this doc's prose is either quoted from an artifact FIELD at 6 dp or is
one of the following DOC-AUTHORED values, listed here so the sweep is complete: the seed numbers
and block bounds (12,544,000–12,548,999 and their members, `seeds.*`); **N = 112** and
**BOOKED = WALKED = 452** (`sizing.nFrozen`, `seeds.walksBooked`); the gate count **29 of 29**
(`Object.keys(gates).length`); the artifact's **3,440,083** bytes and its two hashes; the counts
**40** graph nodes, **171** anchored sites, **151** fixtures, **2,252** face rows, **1,572** field
comparisons and **0** mismatches (`callGraphNodes.nodes.length`, `anchoredSites.length`,
`fixtures.length`, `faces.length`, `reproLnc2.fieldsCompared`, `reproLnc2.mismatches`); the node
counts per pricer (**14 / 17 / 12 / 7 / 5**, `pricers.facts[].nodes.length`); **K = 3**
(`familyReads.cells.<arm>.k`) and its target **0.8** (`familyReads.kTarget`); the cell edges
**0.0 / 0.1 / 0.4 / 1.0** and the gate **0.4** (the chooser's own, anchored-extracted); the
sizing table's own values (§DEV-PREFLIGHT, all read from the smoke artifact); the code quotes in
§R2, which are `src/**` text; **12 m** and **0.02** and **0.3** and **−0.5** inside the quoted
kick-off scorer; **0.48 / 0.3 / 0.28 / 1.15 / 0.6 / 0.8 / 0.4** inside the quoted cutback scorer;
**1.15** inside the quoted `groundCandidate`; **0.45** and **10** inside the quoted through-ball
scorer; the raw counts quoted beside their own shares as numerator/denominator pairs; and
**0.039535**, the ONE derived value in §R7 — `1 − 0.960465`, the residue the last three families
add to the K = 3 cumulative share. **NOT FROM THIS ARTIFACT, and each labelled where it stands:**
0.527230 · 0.309434 · 0.179489 · 0.789421 · 0.214420 are LN-C2's own published fields, quoted
INSIDE the block quotations of ruling #392 at §0; and 0.693878 is the 12-seed scratch smoke's own
unpowered point reading, disclosed at §DEV-PREFLIGHT and binding nothing. An automated sweep of
every 6-decimal literal in this doc against the artifact's own values returns exactly those six
plus 0.039535, and nothing else.

## §GATES — 29 of 29 GREEN

Every gate below is a LIVENESS or RECEIPT gate; ⛔ **not one of them is a direction**. Their
NOTES derive from the same pinned values they check (canon: *gate notes derive*).

| gate | what it proved |
|---|---|
| `gWorld` | world 13 on every walked match and the construction receipt of both arms: `bqArmedVersion` 13, `bqCushion`, the step-② seams absent, RC/BF absent, `info.genome` clean, `emergentPosOn()`, `inSnapshotLaw` absent, `edsPerceivedChoice`, `traceChoice` TRUE (and FALSE on the untraced twin), `bkGroundCorridor` and `dxWindupAim` open, `dvExposureWeight` read as **0.5** on both sides of both arms; re-pinned on a constructed match at scratch 900,003,870 |
| `gDoseSource` | the two dose files' BYTES hashed against the house pins before any seed |
| `gAnchoredConstants` | 171 anchored sites at their pinned occurrence counts, with line receipts |
| `gLedgerRead` | the engine's own `passChoiceTrace` read, never written |
| `gWalkFixtures` · `gShellFixtures` | 151 walk-side fixtures, including the shipped `groundShellHazard` called on hand-built geometry |
| `gClassesNonVacuous` | no read-bearing face on an empty class (§DEVIATIONS 4) |
| `gReproducePTC0` | PT-C0's population and first-body ladder reproduced |
| `gLockstep` | observed ≡ unobserved, per arm |
| `gLockstepTrace` | **traced ≡ untraced whole-match signatures, rng stream state included**, on both arms at both scratch lockstep seeds, with the ledger non-empty on the traced walks and empty on the untraced |
| `gSrcUntouched` | `git diff --stat HEAD` AND `git status --porcelain` over `src/` AND `tests/`, both empty |
| `gSeedDisjoint` | block base = the frontier of record at #392 item 8; disjoint from all four quoted consumed intervals; every scratch seed ≥ 900,000,000; the re-walk seeds inside LN-C2's own block |
| `gSeedsBookedEqualWalked` | 452 booked = 452 walked |
| `xDet` | the whole core run TWICE, digests byte-identical (`wallMs` the one named exclusion) |
| `xFpProd` | the production fingerprint reproduced UNCHANGED: `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` |
| `gCodeFact` · `gFnTexts` | LN-C2's anchored code-fact sites and its four whole-function hashes |
| `gCodeFactGraph` | **40 graph nodes hashed whole, all distinct, every pricer's transitive closure green, the anchored `gcBodies` conjunct present** |
| `gChoiceTickRule` | the choice-tick grid is a partition on every match; the `none` class empty by the engine's rule |
| `gStrikeSites` | **every strike site anchored at its pinned occurrence count and non-empty on both arms** |
| `gFamilyPartition` | **the family counts partition the passes; every family sub-grid sums to its family; the untraced families hold exactly LN-C2's UNTRACED passes and caroms** |
| `gTraceJoin` | join share non-zero, `targetAgreesShare` 1.000000 on both arms, **duplicate-key count STORED and 0** |
| `gReproLnc2` | **1,572 field comparisons against LN-C2's committed artifact, 0 mismatches** |
| `gTwoFractions` | every face's value equals its own numerator ÷ denominator |
| `gLoo` | leave-one-out on every read-bearing share (M on both arms + LN-C2's inherited rows) |
| `gN` | the battery ran at exactly the SIZED N_FROZEN; `sizing.boundBy` = "the SIZING (N = max nRequired)" |
| `gFaces` | **3,378/3,378 face-and-Δ checks and 198/198 stored-bin / median / partition / read-word / sizing checks re-derived off the SERIALIZED artifact** |
| `gReadWords` | M, the ranking, the pricer order, every cumulative share, K, the selector, the printed sentence WITH its pricer name, the agreement boolean, the counterfactual words and every `unpricedFamilyHoldsMajorityOfItsCaroms` — all re-derived off disk, plus LN-C2's inherited read words |
| `gHashOrder` | the body hash computed LAST off the explicit ALLOWLIST SCHEMA (which INCLUDES `allGreen` and EXCLUDES the FIVE non-body keys `hashedBodySha256`, `gFacesDetail`, `receipts`, `worldTwelveNotWalked` and `honestLimitsNote` — the artifact's own note enumerates three of the five, §COMMANDER CORRECTIONS item 12), with the NON-body `receipts.hashReproducesFromFile` TRUE |

## §COMMANDER CORRECTIONS (ruling #393 — the census BANKED, the READ standing; verifier FAIL on three HIGH that are RECEIPT and CLAIM defects, not wrong measurements; four MEDIUM and six LOW disposed; the artifact, the instrument and §P UNCHANGED)

The independent verifier re-derived every family face, the full cross grid, M, K, the pricer
ranking, all seven `unpricedFamilyHoldsMajorityOfItsCaroms` values and both counterfactual words off
the serialized artifact (all reproduce), ran its own bootstrap and LOO (exact), recomputed all 40
node hashes and all 171 anchors (exact), built its own traced/untraced pairs (identical), re-ran the
family rule off the engine's records on four scratch matches (the partition held), and then READ THE
CALL GRAPH PAST THE DECLARATION. Verdict **FAIL — three HIGH**. The items:

1. **HIGH — THE ARTIFACT RECORDS LN-C2's INSTRUMENT, NOT THIS ONE'S.** `stage.instrument` and
   `stage.instrumentSha256` name `scripts/probes/ln-c2-chooser-path-census.ts` (hash df8ef2a9…);
   the committed LN-C3 instrument hashes to bce23ede5bd511f3171867184ea976b1474cdbd129b078fe1bc328a57a3542ac
   and that string appears nowhere in the artifact. The FREEZE ITSELF HELD — `git diff 1834e73
   44882fc -- scripts/probes/ln-c3-untraced-family-census.ts` is 0 bytes and the doc diff is the
   STATUS word plus the append — but the artifact's receipt of it is vacuous. RULED: the receipt of
   record for LN-C3's freeze is the git diff between the two commits, stated here; the artifact is not
   edited (the field is inside the hashed body); the next instrument's `stage` block is written from
   its own path and hashed by a gate that compares it to the running file.
2. **HIGH — THE DECLARED CALL GRAPH HAS TWO FALSE EDGES AND MISSES LIVE CALLEES.**
   `declaredGraph.bkCorridorPriceOf` lists `flightExposure` and `dist`; the hashed body calls neither
   — it returns `seat.exposureWeight * bkCorridorHazard(...)`, and `bkCorridorHazard` →
   `bkCorridorFlightOf` → `flightExposure(…aloft)` → `bkCorridorClearsBody` are not nodes; the door
   is LIVE in world 13 (`bkCorridorPrice` true) on every chip candidate of the through-ball scorer.
   `declaredGraph.pricePassOption` lists `passChoiceCandidateGids`, which it never calls, and omits
   `optionSpacePriorAt`, which prices the UNSEEN and SEEN-UNREAD branches (2,486 of 19,662 options on
   E13). Also absent: `reachState`, `pressureAtArrival`, `predictObservedPosition`, `localX`, the
   `finite(…)` guard, `airLaneOpenness` (above the through-ball span), `team.localX`. THE VERIFIER
   READ EVERY ONE TO A LEAF: all opponent-only, single-body or arithmetic — **no boolean flips**;
   `readsOwnBodiesNotAtAll`, `readsOwnBodiesThroughTheShell` and `readsCorridorForOpponents` STAND as
   published, with the verifier's read as their receipt of record (stated here). What failed is the
   canon's receipt: a DECLARED graph. The third iteration of the lesson (anchors → whole function →
   declared graph). CANON AMENDED at #393 item 3: the callee list is EXTRACTED from the hashed text,
   never typed.
3. **HIGH — A FALSE UNIVERSAL IN §R3** ("every untraced family's choice tick IS its release tick"):
   KEEPER-pass is untraced and 0.422222 of its passes are ARM-class (16 of 426 untraced caroms).
   Rewritten in place with the per-family facts.
4. **MEDIUM — "THE CHOICE-TICK CLASS matches it exactly"** was false by 117 `ledSynchronous` passes
   (0.831445 vs 0.790014). Rewritten in place with the mechanism.
5. **MEDIUM — THE `stage` BLOCK IS LN-C2's** (`title`, `authorizedBy` "#391 item 4", `lineage`) —
   the inherited-string class #392 item 5(vi) ordered re-pointed; the four named strings WERE
   re-pointed and this block was missed. Of record; the artifact is not edited.
6. **MEDIUM — `stage.theMechanismOfRecord` REPUBLISHES "no lane term"**, the words #392 item 3
   struck; this census's own `pricers.facts` has `readsCorridorForOpponents` TRUE for the perceived
   chooser. Of record; the doc's §R2 is the text of record.
7. **MEDIUM — ENGINE-WIDE UNIVERSALS WITHOUT A STORED COMPARISON** ("the ONE ground-delivery pricer
   in the engine"; "the highest of the six"). Re-scoped in place to the five hashed pricers; the six
   values printed together.
8. **LOW — §P.H FROZE "448 walks"**; the battery booked and walked 452 (the receipt seed is walked per
   arm per pass). §P is not edited; of record as the deviation §DEVIATIONS did not carry.
9. **LOW — "91.12 s"** was a hand rounding of the stored 91.123; corrected in place.
10. **LOW — A FACE-NAME COLLISION**: `pricerCumulative.rank1.caromShare@D13` (E13's order evaluated on
    D13, WITH an interval) vs `familyReads.cells.D13.pricerCumulative` (D13's own order, no interval).
    Both correct in their frame; of record — the next instrument keys cumulative faces by arm order.
11. **LOW — A PRECEDENCE MISMATCH** between `strikeSiteOf` (cutback and throughBall tested before the
    kickoff state) and §P.D's family order (kickoff first): harmless here (all 584 play-backs are
    `shortPass`-kind; OTHER empty). Of record.
12. **LOW ×2 — the hash-order note enumerated three of five non-body keys; the §R2 kick-off quote
    elided a comment line without a marker.** Both corrected in place.
13. **RATIFIED**: the eight declared §DEVIATIONS — including item 5, which CORRECTS ruling #392 item
    5(iii)'s parenthetical "the play-back unpriced" from the code (the kick-off play-back IS priced
    by an inline scorer: `opennessOf(mate, opp.players) − |d − 12|·0.02 − (GK ? 0.3 : 0)`); the
    fourteen HONEST LIMITS as the ONE home (the artifact's pointer names this doc); N = 112 by the
    sizing, neither row degenerate.
