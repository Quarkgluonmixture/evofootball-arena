# LN-C3 — 「没走定价的那一半」 THE UNTRACED-FAMILY SPLIT（那一半弹回的球，是哪一类传球打的；那一类是谁定的价；那个定价的人，看得见自己人吗）

> **STATUS: FREEZE — §0 and §P below are FROZEN, and the complete instrument
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
