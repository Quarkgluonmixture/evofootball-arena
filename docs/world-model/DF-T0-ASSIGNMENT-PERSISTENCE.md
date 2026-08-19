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

## §RESULTS

*(written in the result commit, after the frozen battery — freeze-before-battery, home
ruling #266.3(c))*
