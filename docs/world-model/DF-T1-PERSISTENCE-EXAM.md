# DF-T1 — THE PERSISTENCE EXAM (H-DF.0 scored on virgin seeds)

> **Ordered by** COMMANDER RULING #323 item 4. **Bound by**
> [`DF-DEFENSIVE-BRAIN-CONTRACT.md`](DF-DEFENSIVE-BRAIN-CONTRACT.md) §1 (H-DF.1 / H-DF.2)
> and §2 M-DF.2 (*"the cap retires by measurement, never by deletion… two compensators may
> not be retired in one slice"*) + M-DF.4 (*"the ecological gate: EVERY DF exam reports the
> season ladder beside match-grain faces"*).
> **The seam under examination**: [`DF-T0-ASSIGNMENT-PERSISTENCE.md`](DF-T0-ASSIGNMENT-PERSISTENCE.md)
> — `dfAssignPersist`, dormant, `team.marks` itself persisting, the switch priced on the
> shipped `markSagMetres` slack. **The receipt instrument is REUSED VERBATIM** from that
> stage (which reused it from [`DF-C0-DEFENSIVE-BRAIN.md`](DF-C0-DEFENSIVE-BRAIN.md) §R2).
> **Road B**: nothing ships; this stage is **INSTRUMENT-ONLY** after commit 1 — `src/**` is
> UNTOUCHED and the door stays dormant.

---

## §CITATION SWEEP (commit 1 — #323 §CORR 2, comment/doc-only)

DF-T0's +100/+31 line shifts broke three deep provenance pointers. All three re-pointed to
the CURRENT line, each **quoting the rule text it lands on** (the pointer is now checkable
against the target, not just against a number):

| # | site | was | now | the rule text it re-points to |
|---|---|---|---|---|
| 1 | `src/evolution/genome.ts` (`MARK_SAG_MAX`'s traced ceiling) | `TeamBrain.ts:493` | **580** | `if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;` |
| 2 | `src/ai/actionExecutor.ts` (`markSagMetres`' `t_self` form) | `TeamBrain.ts:425` | **427** | `const t = dist(p.pos, land) / Math.max(p.topSpeed, 0.1);` |
| 3 | [`PHASE-MODULATION-CONTRACT.md`](PHASE-MODULATION-CONTRACT.md) (`assignMarks`' zonal zone centres) | `#L479` | **`#L500`** | `const zones = zonal ? new Map(free.map((p) => [p.index, formationSpot(p, team, match.ball, false, match.teams[1 - team.side])])) : null;` |

⚠ Pointer 3 was **actively misleading**: line 479 now lands on DF-T0's own
`if (!match.dfAssignPersist) team.marks.clear();`.

**COMMENT/DOC-ONLY — proved, not asserted.** `git diff -- src` at the sweep commit contains
comment lines only; `npm run fingerprint` returns
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — the fingerprint of
record, **unmoved**; `tests/markSagGene.test.ts` + `tests/dfAssignPersist.test.ts` green
(33 tests). Nothing beyond these three enumerated fixes was touched.

---

## §PRE-REGISTRATION (frozen before the battery — the freeze commit)

### §P0 What this stage is, and is NOT

An **exam**, not a receipt walk: DF-T0 published arming receipts and made no football claim
(canon: *receipts ≠ effect sizes*). This stage scores one pre-registered hypothesis on
**virgin seeds** with a **frozen CI rule**, and reports everything else.

⭐ **NAMED OUT, explicitly**: **H-DF.1's FULL surface** — *"per-defender decisions GENUINELY
DIFFERENTIATE (a non-degenerate distribution over the press/mark/cover/intercept surface at
claim grain, by situation and by body)"* — is **NOT** examined here. `dfAssignPersist` is a
persistence seam, not a decision surface; the differentiation limb belongs to the LATER
SURFACE SLICE. What this stage scores is the narrowed claim ruling #323 item 4 defines.

### §P1 ⭐⭐ H-DF.0 — THE SCORED CLAIM (frozen before the battery)

> **H-DF.0**: the thrash collapses at exam grain **without re-creating the swarm** and
> **without abandoning coverage**.

Three limbs, **ALL** must hold:

| limb | the rule (frozen) | kind |
|---|---|---|
| **(a) THE THRASH COLLAPSES** | `markSwitchesPerDefenderMinute` (DF-C0 §R2's definition VERBATIM) **FALLS RESOLVEDLY** | CI |
| **(b1) THE CAP'S BAND HOLDS** | the four-chaser bin is **EXACTLY ZERO** armed | structural |
| **(b2) THE SWARM DOES NOT RETURN** | `swarmZoneShare3` (≥3 bodies inside the engage radius) does **NOT RISE** resolvedly | CI |
| **(b3) THE CAP IS UNMOVED** | `assignChasers` + the Phase-31 cap lines **byte-identical** to the DF-T0 result commit | git |
| **(c) COVERAGE DOES NOT COLLAPSE** | `markHeldShare` does **NOT FALL** resolvedly | CI |

(c) exists because the cheapest way to buy assignment stability is to stop assigning: a
defender who never has a man never switches. The coverage limb closes that door.

### §P2 ⭐ THE FROZEN CI RULE (pre-registered; NEVER re-cut after sight)

* The estimand for every face is the **PAIRED DELTA** (armed − base) on **paired virgin
  seeds** (every seed walked twice, once per arm, the door the only difference).
* The interval is a **seed-clustered PAIRED bootstrap**: resample the walked seeds with
  replacement; in **each** draw compute both arms' ratios over the **SAME** resampled seed
  set, then the delta. **2,000 draws**, 95 % percentile interval.
* A face **MOVES RESOLVEDLY** iff its delta CI **EXCLUDES ZERO**; the direction is the sign
  of the interval. Limbs (b2) and (c) are **non-inferiority** reads: they fail only on a
  RESOLVED move in the bad direction.
* Canon VERBATIM: *"a starred finding states its |Δ|÷half-width ratio"* (home
  BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2) — **every** face carries
  `ratioToHalfWidth`.
* Canon (paraphrase): **moving denominators disclosed per face** (home PW-C0 §CORR item 2)
  — every face publishes its own `denNote`.
* Canon (paraphrase): **clock honesty** — the switch face is published on BOTH the
  defender-minute axis and the 240 s match clock; APPLIED values, never nominal.

### §P3 The arms, and the world

* **base** = the **world-9 stack** (`a4MatchFlags(9)` + `bkFacingLaw` + `bkContactLaw` +
  `armA4World` with the matured L3/PC doses), door SHUT.
* **armed** = the same, **+ `dfAssignPersist`**. That is the ONLY difference; `worldOk` is
  asserted per walk with `dfDoorMatchesArm` as a conjunct.
* ⭐ **THE SEASON LADDER runs the SHIPPED world**, not world-9 — canon VERBATIM:
  *"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true
  since #155, stated now, test-pinned; refines #270's E4 correction; matches the perf
  diagnostic)"* (home: ruling #283.2(iv)). The ladder is the **ecology**; the door is armed
  there through `League.matchFlags`, the League's own probe surface, which the **shipped
  `createMatch` spread** carries into every fixture — nothing is hand-written onto
  `info.genome` (dose-placement canon, home ruling #270.2).

### §P4 REPORTED, never gated

* **the other churn faces** — `dupMarkShare` · `reTargetLatencyMeanS` **with STORED BINS**
  (canon VERBATIM: *"the re-derivation gate covers EVERY published face; a percentile face
  requires stored bins"*, home PC-C0 §CORR item 4) · abandons/starts · chase starts/abandons
  · `multiChaseShare2/3` · `swarmStanceShare2`.
* **the R-乙 chain faces** — Q01 spell seconds · Q05 touches/spell · Q06 completion ·
  Q14 pressed share · Q07 forward share, **definitions reused VERBATIM** and cited to
  [`R-YI-STANDING-GAP-TABLE.md`](R-YI-STANDING-GAP-TABLE.md) §definitions (ported through
  [`BK-T2-COMPOSITION-EXAM.md`](BK-T2-COMPOSITION-EXAM.md) §(d)'s spell walker; the artifact
  quotes each definition in `definitions.ryiQ01/Q05/Q06/Q14/Q07`).
* **goals + the §2 equilibrium faces** — goals · shots · crosses · headers · longBalls ·
  cutbacks per match, both arms, with CIs. **REPORT ONLY: no band is a gate here**, because
  nothing ships from an exam (contract §4: *"no equilibrium promise"*).
* ⭐⭐ **THE SEASON LADDER, judged against the ATKFROZEN FLOOR** — see §P5.

### §P5 ⭐⭐ THE SEASON LADDER (reduced size), and the floor it is judged against

DF-C0's ladder design **rerun at reduced size**: **2 arms** (`liveBase` = the live world,
door shut; `liveArmed` = the live world + `dfAssignPersist`) × **4 paired league seeds** ×
**20 generations**, every generation measured, ≈ 160 league-seasons ≈ 11,360 matches
(DF-C0's anchor: 1 generation = 71 matches ≈ 5.3 s ⇒ ≈ 14 min). The DF-C0 freeze mechanism
is reused **verbatim** — with an **EMPTY frozen key set**, which is exactly its `both` arm,
so no gene is frozen in either arm here. Early/late windows are DF-C0's: **1–5 vs 16–20,
disjoint**. The slope point estimate goes through **DF-C0-FIX §RF1's ONE FORMULA**,
`slopeDeltaThroughOneFormula` = `mean(per-league (late − early))`, called by BOTH the
publish side and the on-disk re-derivation so the two cannot drift.

**THE FLOOR**: DF-C0 §R4's `atkFrozen` goals slope **+0.2211** (half-width 0.1423,
|Δ|÷hw 1.55) — the ecology's inflation with the ATTACK half frozen, i.e. what is left when
attack stops evolving. **QUOTED, never re-run.**

⚠ **The floor is a REFERENCE LINE, not a matched control** — a different counterfactual
(frozen attack genes vs an armed defensive door) on different league seeds (DF-C0's
12,508,900–903 vs this stage's 12,510,900–903). This read is REPORTED and is never gated.

**THE FACE**: does the armed world's goals-per-generation slope **bend toward the floor**?
Reported as `baseDistanceAboveFloor`, `armedDistanceAboveFloor`, `armedMinusBase` and
`fractionOfExcessClosed`. Beside it: the **reading-vs-contact mix** (interceptions and
tackles trajectories per arm), DF-C0 §R4's 「防守从读球退化成身体接触」 face.

⭐ **DIRECTION PRE-REGISTERED** (#323 item 4, frozen here before the battery): *persistence
should slow the reading collapse if assignment thrash was masking learned defence; if it
does not move, that routes to the SURFACE SLICE, not to a nudge.*

### §P6 Gates (frozen; a RED gate stays red and is reported)

`gWorldOkEveryWalk` · `gSeedsBookedEqualWalked` · `gArmsPairedPerSeed` ·
`gAnchorsResolveOnce` · ⭐ `gSrcUntouched` (porcelain AND `diff --stat HEAD` over `src` —
this stage is instrument-only) · `gCapIntactBothArms` · `gCapBinsNonEmpty` ·
⭐ `gCapLinesByteIdentical` · `gLatencyBinsStored` · `gSwarmBinsStored` ·
`gArmsDistinguishable` · `gRyiInstrumentAlive` (a zero spell/pass/reception denominator is a
silently dead instrument, not a pass) · `gLadderComplete` · `gLadderDoorHeld` (the door read
back off **every** created match) · `gLadderGen1Identical` · `gSeedDiscipline` ·
`gStatsDisjoint` · `gFingerprintUnmoved` · ⭐ `gFacesFromDisk` (canon, home ruling #287
item 1: the body is **STAGED to disk, re-parsed, and every published face re-derived** —
churn, latency percentiles from stored bins, chaser/swarm bins, every ladder face × arm ×
generation, every slope through the one formula, the floor read's arithmetic, and **all six
H-DF.0 limb booleans + the verdict**).

⭐ **THE BODY IS HASHED LAST**, after every gate is written including `gFacesFromDisk`
(DF-C0 §CORR item 2, ruling #321). A RED run writes `…RED.json`; the canonical path is only
reached all-green.

### §P7 Seeds and stats (pre-registered — BOOKED = WALKED, the block consumed whole)

* **Block 12,510,000–999**, opened by #323 item 4, **CONSUMED WHOLE**. Sub-ranges:
  `…000–…149` the exam battery (150 paired seeds) · `…800–…802` the in-band smoke prefix ·
  `…900–…903` the ladder's four league seeds (booked once, walked in both arms) · `…999`
  the xxx,999 world-construction receipt seed (**walked**, so 151 seeds × 2 arms = **302
  walks**).
* **Stats base 114,800, step 200**, against the **completed 59-entry registry** (IN-C0's
  completed 56 + 114,200 from IN-C0/IN-C0-FIX + 114,400 and 114,600 from DF-C0; DF-T0
  consumed zero). **TWO draws ⇒ TWO bases**: **114,800** (the paired match-battery
  bootstrap) and **115,000** (the ladder's league-clustered slope bootstrap). Next base
  ≥ **115,200**; next sim block ≥ **12,511,000**.
* **Override discipline**: a smoke / N / GENS / OUT run may NOT write the canonical
  artifact path (the probe refuses, exit 2).

### §P8 The instrument

`scripts/probes/df-t1-persistence-exam.ts`, frozen in this commit BEFORE the battery
(canon: **freeze-before-battery**, home ruling #266.3(c)); the artifact records its
`sha256`. The hashed body is built from an explicit **ALLOWLIST SCHEMA** — canon VERBATIM:
*"the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema
never enters the body; forbidden-name lists are retired"* (home PC-T0 §CORR item 1). Env
surface is **whitelist-or-refuse**: `DFT1_MODE` (required) · `DFT1_N` · `DFT1_GENS` ·
`DFT1_OUT`; any other `DFT1_*` var and any engine door is a fatal refusal.

---

## §RESULTS

> *(written by the result commit — this section is empty at freeze.)*
