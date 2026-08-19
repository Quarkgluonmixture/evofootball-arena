# DF-T0 — ASSIGNMENT PERSISTENCE (the dormant src seam)

> **Ordered by** COMMANDER RULING #322 item 2 (the fork delegated: DF-T0 first, IN-T0
> next-after). **Bound by** [`DF-DEFENSIVE-BRAIN-CONTRACT.md`](DF-DEFENSIVE-BRAIN-CONTRACT.md)
> §2 M-DF.1 (one surface, EXISTING accounts, derived thresholds only), M-DF.2 (the cap
> retires by measurement — two compensators never move in one slice) and M-DF.4 (flags off ⇒
> byte-identity per seam; composition proof at the world-9 stack; pins from birth).
> **Diagnosis of record**: [`DF-C0-DEFENSIVE-BRAIN.md`](DF-C0-DEFENSIVE-BRAIN.md) §R2 —
> `team.marks.clear()` + nearest-first greedy re-runs the whole scan every pass ⇒
> **16.1267** mark-switches per defender-minute, **0.2831** dupMarkShare, **0.6329**
> markHeldShare, **1.0576** s reTargetLatencyMeanS.
> **Road B**: nothing ships. Flag `dfAssignPersist`, default OFF, absent from `a4World`.

---

## §PRE-REGISTRATION (frozen before the battery — freeze commit)

### §P0 What this stage is, and is NOT

It is a **dormant src seam plus its permanent pin suite plus arming RECEIPTS**. Canon:
**receipts ≠ effect sizes** (homes: ruling #289 item 1 + BU-T1 §CORR item 5) — the walks
below publish counts with units and **make no football claim**. H-DF.1 (differentiation +
the swarm's absence) is the EXAM's business, a later stage.

### §P1 The scope, as bound at dispatch (#322 item 2)

* `assignMarks` **PERSISTENCE ONLY**: assignments survive across passes; the greedy scan
  runs only for UNASSIGNED slots.
* 「change my man」 outprices 「keep my man」 **only** on the L3 access-time slack ALREADY
  computed at the stance line — anchored extraction; the hysteresis DERIVED from the
  shipped account's own algebra (the λ_LIN idiom), never a taste constant (#200).
* `assignChasers` and the Phase-31 cap are **UNTOUCHED**.

### §P2 THE FOUR DESIGN QUESTIONS, ANSWERED BEFORE THE CODE

**(a) Where the persistent state lives.** ⭐ **`team.marks` ITSELF becomes persistent — no
parallel seat, no new field anywhere.** The ledger the readers already read (`PlayerBrain`'s
mark menu, `RenderStateAdapter`, `Match`'s send-off pruning) simply stops being erased every
pass. **Consequences, pre-registered:** (i) nothing new can leak into `League.toJSON` because
nothing new exists — canon VERBATIM: *"WORKER-SIMMED fixtures play the SHIPPED world
(League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines #270's E4
correction; matches the perf diagnostic)"* (home: ruling #283.2(iv)), so a worker fixture
plays with the door SHUT and clears every pass exactly as today; (ii) `cloneSimulationState`
already deep-clones `Map`s and therefore already carries `team.marks` — no clone decision is
needed and none is made; (iii) the render adapter's `for (const [ownIdx, oppIdx] of
team.marks)` is unchanged. The pin suite asserts (i)–(iii) as source facts.

**(b) The assignment DEATH conditions — the complete enumeration.** An assignment dies when:

| # | condition | where it lives |
|---|---|---|
| 1 | **possession flips to us** (we have the ball) | the early return in `assignMarks` (shipped semantics, kept) |
| 2 | **phase leaves {playing, restart}** | `updateTeamBrain`'s top (SHIPPED LINE, untouched) |
| 3 | **half-time / kickoff reset** · **send-off pruning both directions** | `Match.ts` (SHIPPED LINES, untouched) |
| 4 | **the marker is ineligible**: sent off, keeper, or now a CHASER (not in `free`) | the survivor pass |
| 5 | **the man is ineligible**: sent off, keeper, now the CARRIER, or the restart taker (not in `threats`) | the survivor pass |
| 6 | **aliasing**: a lower-index marker already holds him (the ledger stays injective) | the survivor pass |
| 7 | ⭐ **THE ACCOUNT'S OWN CEILING**: `dist(marker, man) > MARK_SAG_MAX` | the survivor pass |

(7) introduces **no new constant**: `MARK_SAG_MAX = 9` is the shipped export whose own
docstring traces it to `assignMarks`' zonal engagement radius — *"the engine's own standing
answer to 'how far from his station may a defender be asked to engage a man'"*. It is
**strictly tighter than the shipped 22 m creation range**, so a survivor is never a pairing
the greedy could not have made on range grounds. The doctrine's continuous ideal (a defender
who *hands off* rather than drops) is the coordination cluster's, explicitly OUT (M-DF.4).

**⚠ STATED, NOT HIDDEN**: the two OTHER creation rules — the WG width discipline (Phase 28.4)
and the zonal zone gate — are **not re-litigated on a survivor**. They govern every fresh
pick (their lines are untouched and pinned), and the shipped code itself says engagement is
supposed to drag a zone defender off his lattice ("engaging a zone runner drags its defender
OFF the spot lattice, which is how attacks open a zone up"). Death condition (7) bounds the
consequence at 9 m.

**(c) The re-decide cadence.** The **shipped `TEAM_AI_INTERVAL` (0.4 s)** and the shipped
0.05 s expedites on possession swings and send-offs. **No new tick, no new call site**:
`assignMarks` is still called from exactly one place.

**(d) Staleness interplay with the PC latency seam.** They act on **different objects at
different grains and never contest**: PC latency delays a BODY's reaction to its own percept
(body grain, per tick, mid-hold stale targets); persistence governs the TEAM's assignment
ledger (team grain, per `TEAM_AI_INTERVAL`). Persistence **never invalidates, re-reads or
touches any held percept**, and the switch price reads only positions and `topSpeed` at the
team-brain instant — the same inputs the shipped greedy already reads. Composition: a body
may hold a stale target for a mark that persistence keeps (the two agree), and when
persistence DOES change the man, the body's own latency machinery decides when it acts on
it — unchanged. The seam therefore **composes freely and refuses nothing**.

### §P3 ⭐⭐ THE SWITCH PREDICATE (frozen, pre-registered, exact)

A body that HOLDS a man leaves him for an unassigned man **iff**

```
dist(me, newMan)  +  markSagMetres(ball.pos, myMan.pos, me.pos, me.topSpeed)  <  dist(me, myMan)
```

* `markSagMetres` is the **shipped L3 access-time account**, called with the **stance line's
  own argument tuple**. Canon VERBATIM: *"a src-extracted constant pins its extraction to the
  NAMED call site — anchored match + line receipt — never first-occurrence"* (home: BK-C0
  §CORR item 1). **THE NAMED CALL SITE**, quoted verbatim:
  `          if (w > 0) markDist += w * markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed);`
  (`src/ai/actionExecutor.ts`, the census's `l3SagSeam` rule; the LINE NUMBER is reported by
  the artifact, never asserted — it is the thing that drifts).
* The account's output is **metres of recoverable slack**
  (`slack ≤ 0 ? 0 : min(slack·v, MARK_SAG_MAX)`), so it prices metres of greed **directly**
  and inherits its own frozen ceiling: the **λ_LIN idiom** — the expressible region of the
  shipped seam, capped at its edge, no new magnitude invented.
* **Where the ball is arriving faster than I can reach my man (`slack ≤ 0` — every cross
  into the box) the budget is 0 and nearest-first decides exactly as today.** The seam buys
  loyalty only in the idle moments and never in the tight ones.
* The `markSag` GENE is deliberately **not** read: the ASSIGNMENT price is the account's raw
  geometry; the STANCE keeps its own gene channel untouched.

### §P4 The pin suite (from birth — canon: *pin suites from birth*, home ruling #297 item 7)

`tests/dfAssignPersist.test.ts`, in the house form (`bkContactLaw.test.ts`): dormancy
(absent ≡ false, byte for byte, BOTH world shapes × 2 seeds, pooled digest) · arming is a
real change · the persistence law · the switch price + its arithmetic mutant · greedy fills
unassigned only · all seven death conditions · the ledger stays injective over a full walk ·
**the cap untouched** (`assignChasers` slice free of the needle, its Phase-31 rules verbatim
and singular, four-chaser bin exactly zero armed) · composition semantics · the seam map
(occurrence COUNTS per needle, PREFIX stated) · the fingerprint of record.

### §P5 Gates (frozen; a RED gate stays red and is reported)

`gWorldOkEveryWalk` · `gSeedsBookedEqualWalked` · `gArmsPairedPerSeed` ·
`gAnchorsResolveOnce` · ⭐ `gCapIntactArmed` (four-chaser bin exactly zero in BOTH arms) ·
`gCapBinsNonEmpty` · `gLatencyBinsStored` · `gArmsDistinguishable` · `gFingerprintUnmoved`.

### §P6 Seeds and stats (pre-registered — BOOKED = WALKED, the block consumed whole)

* **Block 12,509,000–999**, opened by #322 item 2, **consumed whole**.
* Battery: `12,509,000–039` (40 seeds) **+ the block's `12,509,999` receipt seed** = 41
  seeds × 2 arms = **82 walks**.
* Smoke prefix **in band**: `12,509,800/801/802` — the same seeds the permanent pin suite
  uses.
* **STATS: none expected.** The receipts publish counts; cluster CIs are bootstrap
  resamples of the walked seeds, not a registry-consuming statistic.

### §P7 ⚠ THE ONE PRE-EXISTING PIN THIS SLICE NARROWS (disclosed at freeze, for ratification)

`tests/markSagGene.test.ts` (MT-T0's frozen suite) asserted, on the 甲/乙 boundary, that
`src/ai/TeamBrain.ts` **never contains the string `markSag`** — because MT-T0's own claim is
that the sag SEAM leaves mark ASSIGNMENT untouched. DF-T0 is dispatched to price assignment
on **that very account**, so the letter of that assertion and the letter of #322 item 2
cannot both stand. **NARROWED, NOT DELETED, in the freeze commit**, and made POSITIVELY:
`TeamBrain.ts` may not contain `mtMarkSag`, `markSagWeight` or `.markSag` (the flag, the
weight map and the gene — the MT seam entire), and may name `markSagMetres` at **exactly one
call**, pinned to the `const budget = markSagMetres(` line. MT-T0's substantive claim is
therefore unweakened: nothing in the assignment path can move with the MT flag or the MT
gene. **Flagged for commander ratification** — it is another stage's pin.

---

## §RESULTS — THE RECEIPT WALKS

> **Instrument**: `scripts/probes/df-t0-assignment-persistence.ts`
> (`instrument.sha256` = `06f97322b82c655fb9bb8ac64948284b73cdf19c021bad62e4c99417b078d6ff`).
> **Artifact of record**: `docs/world-model/data/df-t0-assignment-persistence.json`
> (`bodySha256` = `f28de81d5898f8491ffaa436713b24f460b586ebef1e0adbedf7cde3e35cdba8`).
> **82 walks** (41 seeds × 2 arms), every `worldOk` true, **all nine gates GREEN**.
> ⭐ These are RECEIPTS, not effect sizes — no football claim is made here.
> Every number below is quoted VERBATIM from an artifact field (canon: *"a stage doc's
> prose quotes artifact FIELDS verbatim or the number becomes a gated face"*, home PC-T2
> §CORR item 4).

### §R0 THE PRE-BATTERY ROUTING FIX, AND ITS 「0 FIELDS MOVED」 RECEIPT

The first frozen cut chose the output path off `gates.gatesAllGreen` — a field that never
existed on `gates` — so a run with **all nine gates GREEN** was routed to the `.RED.json`
side path and exited 1. Fixed in `a7c9839` **before** the battery of record, with the
pre-fix artifact committed as evidence
(`docs/world-model/data/df-t0-assignment-persistence.RED.json`). **THE RECEIPT: 4,453
compared fields, 0 moved** (comparison excludes only the instrument sha256, the wall
timings and the body hash — the three things that must move). The routing line touches no
gate, face, seed or denominator.

### §R1 ⭐⭐ THE FOUR CHURN FACES — shut → armed (value [95 % cluster CI])

| face | shut | armed | unit (verbatim) |
|---|---:|---:|---|
| `markSwitchesPerDefenderMinute` | **15.4691726707** [14.1322559513, 16.8153552751] | **5.59200653809** [5.13043504983, 6.0436064445] | switches per defender-minute |
| `markSwitchesPerDefenderMatch` | 61.8766906829 [56.5290238053, 67.2614211005] | 22.3680261524 [20.5217401993, 24.174425778] | switches per defender-match (the 240 s match clock — the dual axis) |
| `dupMarkShare` | 0.273636386421 [0.242234242034, 0.302985903431] | 0.262003335186 [0.228660716955, 0.297247634173] | share of ≥2-marker team-ticks with two mark targets within 4 m |
| `markHeldShare` | 0.616390048807 [0.587357751006, 0.643836320407] | 0.641918347747 [0.612178742055, 0.670764783984] | share of defender body-ticks |
| `reTargetLatencyMeanS` | 1.06123142251 [0.986579764122, 1.1388319313] | 1.02014760657 [0.941323695407, 1.1011942446] | sim-seconds |

Stored latency bins (canon: a percentile face requires stored bins) —
`latencyBins.shut` = `[4533, 989, 593, 387, 320, 355, 143, 530]`,
`latencyBins.armed` = `[4320, 860, 564, 333, 256, 278, 147, 491]`;
`shutMedianS` 0.5 · `shutP90S` 3 · `armedMedianS` 0.5 · `armedP90S` 3.

**THE ARMING RECEIPT, in one line**: the door moves `markSwitchesPerDefenderMinute` from
**15.4691726707 to 5.59200653809** — the CI of the armed arm ends at 6.0436064445 and the
CI of the shut arm starts at 14.1322559513, so the two do not touch. The other three faces
move in the same direction but **inside** their intervals: `dupMarkShare` −0.0116,
`markHeldShare` +0.0255, `reTargetLatencyMeanS` −0.0411 s, every one of them well under its
own half-width. **That is the whole receipt**: the seam does what its name says (it stops
the re-scan) and the downstream faces are NOT claimed to have moved.

Companion faces, same run: `markAbandonsPerDefenderMinute` 14.617733688 → 13.6967452684 ·
`markStartsPerDefenderMinute` 14.962948532 → 14.0513535602 ·
`chaseStartsPerDefenderMinute` 10.2036229365 → 9.98721009156 ·
`chaseAbandonsPerDefenderMinute` 10.0344267285 → 9.81544670025 ·
`goalsPerMatch` 2.73170731707 → 2.65853658537 ·
`tacklesPlusInterceptionsPerMatch` 33.0975609756 → 30.9024390244.
⚠ The last two are **receipts of the walk, not findings** — the exam owns football.

### §R2 ⭐⭐ THE SWARM BAND AND THE CAP (M-DF.2's own receipt)

`chaserBins.shut` = `[73267, 267242, 160427, 29117, 0]` (530,053 defending team-ticks)
`chaserBins.armed` = `[74930, 256937, 157828, 30696, 0]` (520,391 defending team-ticks)

**THE FOUR-CHASER BIN IS EXACTLY ZERO IN BOTH ARMS** (`gCapIntactArmed` GREEN): the
Phase-31 cap binds armed exactly as it binds shut. Shares: shut
`0.138226 / 0.504180 / 0.302662 / 0.054932 / 0` vs armed
`0.143988 / 0.493738 / 0.303287 / 0.058986 / 0` — the licensed third presser (Phase 112's
window) is 5.49 % shut and 5.90 % armed.

⚠ **HONEST WORDING (a deviation from the dispatch's phrasing)**: the dispatch asked for the
chaser bins **UNCHANGED** armed. They cannot be bit-identical — arming the door produces a
DIFFERENT WORLD, so every trajectory (and therefore every denominator) differs. What is
actually pinned, and what M-DF.2 needs, is that **the cap's binding face is intact**:
bin 4 ≡ 0, the shape unmoved to the third decimal, and `assignChasers` byte-identical to
HEAD (`cmp`-verified, 125 lines, in the freeze commit).

The swarm band: `swarmStanceShare2` 0.0851965179909 → 0.0836119369207 ·
`swarmZoneShare3` 0.314997256509 → 0.281238748701 · `multiChaseShare3` 0.117305250607 →
0.116318306812. Bins stored (`swarmBins`): `shutZone` = `[30762, 41713, 66099, 40034,
19764, 3925]`, `armedZone` = `[24897, 42256, 72590, 36649, 14709, 3321]`.

### §R3 THE ANCHORED EXTRACTIONS (line receipts; the numbers are REPORTED, never asserted)

| id | file | value | line no. AT THIS COMMIT |
|---|---|---:|---|
| `markStanceBand` | `src/ai/actionExecutor.ts` | 2.6 | 294 |
| `zonalEngageRadius9` | `src/ai/TeamBrain.ts` | 9 | 580 |
| `markRange22` | `src/ai/TeamBrain.ts` | 22 | 582 |

Each line matched EXACTLY ONCE (`gAnchorsResolveOnce` GREEN).

### §R4 PERF, against the anchor (DF-C0 §R5's, re-hashed as bytes)

`anchorFile` `docs/perf/baseline.json` · `anchorSha256`
`192ed9481524eea3186e4acbf62b77cf0ed8b16741413cd8da8518d66647bd3a` · `anchorHead` `c07a19b`
· `anchorUsPerStep` 5.32 · `anchorTeamBrainUsPerStep` 0.21 · `budgetUsPerStep` **0.106**.
Measured: `shutWallUsPerStep` 7.28414755093 · `armedWallUsPerStep` 6.94965163242 ·
`deltaWallUsPerStep` **−0.334495918508**. ⚠ This is a WALL measurement with the instrument
INSIDE the timer (the artifact's `budgetNote` says so verbatim) and is therefore an upper
bound, not the engine's profiler number; the sign is unsurprising (the armed pass does not
re-run the whole scan) but **it is not published as a speed-up** — the honest reading is
"no measurable cost against the 0.106 µs/step budget".

### §R5 SEEDS AND STATS

**BOOKED = WALKED**: `12,509,000–039` + `12,509,999` = 41 seeds, 82 walks
(`gSeedsBookedEqualWalked` and `gArmsPairedPerSeed` GREEN). The pin suite walks
`12,509,800/801/802` (the smoke prefix, in band). **Block 12,509,000–999 CONSUMED WHOLE.**
**STATS: NONE CONSUMED** — the CIs are bootstrap resamples of the walked seeds; the next
stats base remains ≥ **114,800** on the 57-entry registry.

### §R6 MUTANTS (run live on an UNCOMMITTED tree, restored from `/tmp` byte copies)

| mutant | edit | result |
|---|---|---|
| M1 THE HYSTERESIS | `budget` → `0 * markSagMetres(...)` | **2 pins die** — the switch-price pin and the seam-map extraction pin |
| M2 NO PERSISTENCE | the survivor pass's clear made unconditional | **4 pins die** — arming-is-real, the persistence law, the death conditions, the seam map |
| M3 THE CEILING | `> MARK_SAG_MAX` → `> MARK_SAG_MAX * 1000` | **1 pin dies** — death condition (7) |

Every mutant was reverted by byte-copy restore (`cmp`-verified), never by `git checkout`.

### §R7 DEVIATIONS (honest)

1. **§R0's routing bug** — a clerical defect in the first frozen cut, fixed pre-battery in
   its own commit, with the RED artifact kept and a 0-of-4,453-fields-moved receipt.
2. **§P7's narrowing of MT-T0's pin** — another stage's frozen assertion, narrowed (not
   deleted) because #322 item 2 orders the very consumption it forbade. **Flagged for
   commander ratification.**
3. **§R2's wording** — "chaser bins unchanged armed" is impossible across a diverged world;
   what is delivered is the cap's binding face intact plus `assignChasers` byte-identical.
4. **Two full-suite contention flakes** — `careers` (2 tests) and `formationEvolution`
   (1 test) timed out at 180 s inside a 149-file parallel run and **both pass green when
   re-run in isolation** (12/12, 154 s). The same class DF-C0 §R7 item 3 disclosed.
5. **The WG width rule and the zonal zone gate are not re-litigated on a survivor** —
   pre-registered in §P2(b), bounded by death condition (7) at 9 m, stated not hidden.
6. **`PROGRAMME.md` / the rulings file are NOT edited by this session** (executor iron
   rule: governance files are the commander's). The queue's status line, the frontier
   update (next sim block ≥ **12,510,000**) and the ruling are the commander's to write.

---

## §COMMANDER CORRECTIONS OF RECORD (ruling #323, 2026-08-19)

1. **THE MT-T0 PIN NARROWING IS RATIFIED** (the executor's ⚠⚠ ask): #322's dispatch and
   the old "TeamBrain never contains markSag" letter could not both stand; the narrowed
   positive form (forbid mtMarkSag/markSagWeight/.markSag; exactly one `const budget =
   markSagMetres(` call) preserves MT-T0's substantive claim. Caveat of record (verify
   LOW 3): the companion count-of-3 includes two PROSE citations — the load-bearing pin
   is the exactly-one CALL; the count pin is drift-resistant only weakly.
2. **STALE PROVENANCE CITATIONS ORDERED SWEPT** (verify MED): DF-T0's +100/+31 lines
   shifted three deep pointers — genome.ts:478's "TeamBrain.ts:493" (now 580),
   actionExecutor.ts:52's "TeamBrain.ts:425", and PHASE-MODULATION-CONTRACT.md's
   `#L479` link (now landing on DF-T0's own clear() line — actively misleading). The
   sweep (comment/doc-only, enumerated) rides the DF-T1 dispatch as its first commit.
3. Notes of record: death condition (6) is an INVARIANT RESTATEMENT (correct by the
   greedy's own structure; six of seven conditions mutant-provable); the seam map's
   Match.ts line numbers are pre-freeze (+31 shift, lines byte-untouched); the clerical
   routing bug (green run → .RED path) was fixed PRE-BATTERY in its own commit with the
   RED evidence committed and 4,453 fields compared 0 moved — accepted; the 「chaser
   bins unchanged」 dispatch wording is satisfied in its M-DF.2 substance (four-chaser
   bin exactly zero both arms; assignChasers byte-identical), not its letter (different
   worlds have different denominators — disclosed).
