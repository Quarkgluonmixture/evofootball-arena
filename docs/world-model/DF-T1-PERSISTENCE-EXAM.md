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

> **Instrument**: `scripts/probes/df-t1-persistence-exam.ts`
> (`instrument.sha256` = `8aea835936c270b6c502aa2a8cee68f1a71158131bc5a35b3a661525692e2a07`),
> frozen at `4492341` **before** the battery.
> **Artifact of record**: `docs/world-model/data/df-t1-persistence-exam.json`
> (`bodySha256` = `bef00b786eae1bfd0f5bf1c6da097fae9803b8f299eb4318bf54b18e89568d45`).
> **302 walks** (151 paired seeds × 2 arms) + **160 league-seasons / 11,360 matches**;
> every `worldOk` true; **all 19 gates GREEN**; **502 re-derivation checks off disk, 0
> mismatches**. Wall: battery **30.6 s**, ladder **844 s** (≈ 14.6 min) — inside the 60-min
> ceiling.
> Every number below is quoted VERBATIM from an artifact field (canon: *"a stage doc's
> prose quotes artifact FIELDS verbatim or the number becomes a gated face"*, home PC-T2
> §CORR item 4).
> ⭐ **THE SEAL REPRODUCES INDEPENDENTLY**: delete `bodySha256`, `JSON.stringify` the rest
> with no indentation, sha256 it ⇒ `bef00b78…35d45`, matching. ⚠ Reproduce it in **Node**,
> not Python — `json.dumps` writes `1e-05` where `JSON.stringify` writes `0.00001`, so a
> Python re-hash disagrees on number FORMATTING, never on content.

### §R0 ⭐⭐ H-DF.0 — **PASS**, all five conjuncts

| limb | rule (frozen at §P1/§P2) | base | armed | Δ [95 % paired CI] | \|Δ\|÷hw | verdict |
|---|---|---:|---:|---|---:|:--:|
| **(a)** thrash FALLS resolvedly | `markSwitchesPerDefenderMinute` | **16.1832513714** | **6.06189104781** | **−10.1213603236** [−10.6501943431, −9.60890368181] | **19.44** | ✅ |
| **(b1)** four-chaser bin ≡ 0 armed | `chaserBins.armed[4]` | 0 | **0** | structural | — | ✅ |
| **(b2)** swarm does NOT RISE | `swarmZoneShare3` | 0.334372276289 | 0.308489641561 | **−0.0258826347285** [−0.0459258192569, −0.00562639185317] | 1.28452 | ✅ |
| **(b3)** cap lines byte-identical | `assignChasers` slice vs `4631fe6` | sha256 `f6bfb24c…e8dd` | sha256 `f6bfb24c…e8dd` | 126 lines, identical | — | ✅ |
| **(c)** coverage does NOT FALL | `markHeldShare` | 0.634112474036 | 0.656103574957 | **+0.0219911009207** [0.0152413037712, 0.0286665143055] | 3.27609 | ✅ |

**In the player's language**: a marker used to change his man **every ~3.7 seconds of
defending**; armed he changes him **every ~9.9 seconds** — and he does it while holding a
man MORE of the time (63.4 % → 65.6 %), with **fewer** bodies piling onto the carrier, not
more. The Phase-31 cap is untouched and still binds: the four-chaser bin is **exactly zero
in both arms** (base `[258861, 1029410, 532534, 126906, 0]`, armed
`[261095, 999747, 528636, 130387, 0]`), and `assignChasers` hashes identically to the
DF-T0 result commit, with the Phase-31 rule line occurring **exactly once**.

⭐ Two limbs passed **with margin in the good direction rather than merely not failing**:
(b2) and (c) were pre-registered as non-inferiority reads, and both moved RESOLVEDLY the
*helpful* way. That was not required and is not re-scored — it is reported.

### §R1 THE CHURN FAMILY (the rest — REPORTED, never gated)

| face | base | armed | Δ [95 % paired CI] | \|Δ\|÷hw | resolved |
|---|---:|---:|---|---:|:--:|
| `markSwitchesPerDefenderMatch` (240 s clock — the dual axis) | 64.7330054855 | 24.2475641912 | −40.4854412943 [−42.6007773722, −38.4356147273] | 19.44 | ↓ |
| `dupMarkShare` | 0.282120862505 | 0.255330777937 | −0.0267900845671 [−0.0411874337413, −0.0115538101718] | 1.80809 | ↓ |
| `markAbandonsPerDefenderMinute` | 14.328947527 | 13.7153950968 | −0.613552430194 [−0.95744036357, −0.269105054844] | 1.78271 | ↓ |
| `markStartsPerDefenderMinute` | 14.6749606244 | 14.0853802594 | −0.589580364978 [−0.932122012026, −0.241510080245] | 1.70741 | ↓ |
| `reTargetLatencyMeanS` | 1.05099454382 | 1.02294578763 | −0.0280487561957 [−0.0592698564914, 0.00486290018772] | 0.874709 | — |
| `chaseStartsPerDefenderMinute` | 9.95909508736 | 9.90499912371 | −0.0540959636536 [−0.322841985238, 0.210073400628] | 0.203019 | — |
| `chaseAbandonsPerDefenderMinute` | 9.79220774137 | 9.74369461685 | −0.0485131245145 [−0.31342042171, 0.212796455287] | 0.184385 | — |

⭐ **`dupMarkShare` RESOLVES AT EXAM GRAIN.** DF-T0's 82-walk receipt put it *inside* its
half-width (−0.0116, explicitly not claimed). At 302 paired walks with the paired estimand
it separates: accidental double-marking falls **0.2821 → 0.2553**. That is the exam doing
the job the receipt stage refused to do, not a number changing its mind.

Stored latency bins (canon: a percentile face requires stored bins) —
`latencyBins.base` = `[16977, 3468, 2143, 1350, 1093, 1289, 658, 1980]`,
`latencyBins.armed` = `[16235, 3199, 2075, 1284, 972, 1103, 613, 1776]`;
`baseMedianS` 0.5 · `baseP90S` 3 · `armedMedianS` 0.5 · `armedP90S` 3 — **the wait for a
new man does not move**: persistence removes switches, it does not shorten re-targeting.

### §R2 THE SWARM FAMILY, AND THE ONE FACE THAT NEARLY WENT THE OTHER WAY

`swarmBins.baseZone` = `[110070, 154409, 232687, 158074, 70334, 21339]`,
`swarmBins.armedZone` = `[99662, 154754, 246604, 149027, 61865, 12618]`;
`swarmBins.baseStance` = `[443677, 236186, 56233, 9508, 1166, 143]`,
`swarmBins.armedStance` = `[432119, 230672, 52255, 8459, 1021, 4]`.

| face | base | armed | Δ [95 % paired CI] | \|Δ\|÷hw | resolved |
|---|---:|---:|---|---:|:--:|
| `swarmZoneShare3` (SCORED) | 0.334372276289 | 0.308489641561 | −0.0258826347285 [−0.0459258192569, −0.00562639185317] | 1.28452 | ↓ |
| `swarmStanceShare2` | 0.0897694912259 | 0.0852124825749 | −0.00455700865098 [−0.0130128335462, 0.00427009987907] | 0.527342 | — |
| `multiChaseShare2` | 0.403150672764 | 0.405672794702 | +0.00252212193763 [−0.00811479891039, 0.0131965034197] | 0.236693 | — |
| ⚠ `multiChaseShare3` | 0.120873681978 | 0.126814124951 | **+0.00594044297301** [**−0.0000121478292586**, 0.0124502755407] | 0.953337 | — |

⚠⚠ **THE HONEST SPLINTER**: `multiChaseShare3` — ≥3 bodies in the BALL family — is the one
swarm-adjacent face that moves UP, and its interval's low edge is **−1.21 × 10⁻⁵**. By the
frozen rule it is **UNRESOLVED**, and unresolved it stays; the rule is not re-cut after
sight. But it grazes zero by twelve millionths, so it is stated as loudly as if it had
resolved: **a hair more of the licensed multi-chase, on a face that was NOT one of H-DF.0's
scored limbs.** The cap's own output is unmoved (bin 4 ≡ 0) and the geometric pile-up faces
both fall, so this is not the swarm returning — but it is the honest reading, and it is the
first thing a later surface slice should re-measure.

### §R3 THE R-乙 CHAIN FACES (REPORTED; definitions reused VERBATIM, cited)

Definitions quoted in full in the artifact's `definitions.ryiQ01/Q05/Q06/Q14/Q07`, reused
verbatim from [`R-YI-STANDING-GAP-TABLE.md`](R-YI-STANDING-GAP-TABLE.md) §definitions
(ported through [`BK-T2-COMPOSITION-EXAM.md`](BK-T2-COMPOSITION-EXAM.md) §(d)'s spell
walker).

| R-乙 row | field | base | armed | Δ [95 % paired CI] | \|Δ\|÷hw | R-乙's REAL band |
|---|---|---:|---:|---|---:|---|
| Q01 spell length | `ryiQ01SpellSeconds` | 4.2675004792 | 4.3105129222 | +0.0430124429998 [−0.115407721184, 0.207013998436] | 0.266809 | 9.6 – 10.4 s |
| Q05 touches/spell | `ryiQ05TouchesPerSpell` | 2.52903967798 | 2.5427325005 | +0.0136928225199 [−0.0510437488803, 0.0776791977287] | 0.212749 | 2.88 – 5.12 |
| Q06 completion | `ryiQ06PassCompletion` | 0.600351971842 | 0.604932182491 | +0.0045802106485 [−0.00707523945117, 0.0163697062103] | 0.390721 | 75.3 % – 88 % |
| Q14 pressed share | `ryiQ14PressedReceptionShare` | 0.763465593253 | 0.772159428911 | +0.00869383565853 [−0.00631304323777, 0.0243842724809] | 0.566423 | UNSOURCED |
| ⭐ Q07 direction mix | `ryiQ07ForwardPassShare` | 0.557235421166 | **0.580764488286** | **+0.0235290671198** [0.0114507720891, 0.0354145063431] | **1.96372** | UNSOURCED |

**FOUR OF THE FIVE CHAIN ROWS DO NOT MOVE.** The persistence door does not touch the
possession chain: spell length, touches per spell and pass completion all sit inside their
intervals. ⭐ The one that resolves is **Q07, the direction mix: the attack plays 2.4
points MORE of its passes forward against a defence that keeps its men.** That is a
plausible mechanism (a stable marker is a marker who can be played around rather than
scattered) and it is **labelled a HYPOTHESIS, not a finding** — no probe here discriminates
it (adjudication discipline, #144(a)). Q06 sits at 0.80× R-乙's low edge in BOTH arms — the
BK-T2 completion cost of record is unchanged by this door, neither repaired nor deepened.

### §R4 GOALS AND THE §2 EQUILIBRIUM FACES (REPORT ONLY — nothing ships from an exam)

| face | base | armed | Δ [95 % paired CI] | \|Δ\|÷hw | resolved |
|---|---:|---:|---|---:|:--:|
| `goalsPerMatch` | 2.83443708609 | 2.82119205298 | −0.0132450331126 [−0.384105960265, 0.384105960265] | 0.0344828 | — |
| `shotsPerMatch` | 13.4768211921 | 14.0264900662 | +0.549668874172 [−0.192052980132, 1.26490066225] | 0.754545 | — |
| `headersPerMatch` | 7.13245033113 | 7.76821192053 | +0.635761589404 [−0.377483443709, 1.68874172185] | 0.615385 | — |
| `crossesPerMatch` | 2.80132450331 | 3.27152317881 | +0.470198675497 [0.12582781457, 0.82119205298] | 1.35238 | ↑ |
| `longBallsPerMatch` | 3.46357615894 | 4.09271523179 | +0.629139072848 [0.119205298013, 1.11920529801] | 1.25828 | ↑ |
| `cutbacksPerMatch` | 6.49006622517 | 5.51655629139 | −0.973509933775 [−1.59602649007, −0.35761589404] | 1.57219 | ↓ |
| `interceptionsPerMatch` | 29.5960264901 | 28.059602649 | −1.53642384106 [−2.66887417219, −0.397350993377] | 1.35277 | ↓ |
| `tacklesPerMatch` | 2.24503311258 | 2.20529801325 | −0.0397350993377 [−0.390728476821, 0.324503311258] | 0.111111 | — |
| `tacklesPlusInterceptionsPerMatch` | 31.8410596026 | 30.2649006623 | −1.5761589404 [−2.84105960265, −0.364238410596] | 1.27273 | ↓ |

**GOALS DO NOT MOVE** (|Δ|÷hw 0.034 — as flat as a face gets). The delivery mix does: more
crosses and long balls, fewer cutbacks, against a defence that no longer scatters. ⚠ These
are match-grain REPORTED faces at n = 151 paired seeds, no band is a gate here, and no
causal story is attached to them beyond the label.

### §R5 ⭐⭐ THE SEASON LADDER, AGAINST THE ATKFROZEN FLOOR — **THE PRE-REGISTERED DIRECTION IS HALF-MET**

2 arms × 4 paired leagues × 20 generations = **160 league-seasons, 11,360 matches**, every
generation measured. `gLadderDoorHeld` GREEN: the door was read back off **every** created
match in both arms, `doorWrong` 0 everywhere. Gen-1 coach genomes are byte-identical across
arms per league seed (`gen1Fingerprints`).

**goals/match, early (gens 1–5) → late (gens 16–20):**

| arm | gen 1 | gen 20 | early → late | Δ | half-width | \|Δ\|÷hw |
|---|---:|---:|---|---:|---:|---:|
| `liveBase` | 2.02816901408 | 3.60211267606 | 2.4485915493 → 3.70492957746 | **+1.25633802817** | 0.281690140845 | 4.46 |
| `liveArmed` | 2.13028169014 | 4.27112676056 | 2.49436619718 → 4.00774647887 | **+1.51338028169** | 0.895070422535 | 1.69079 |
| *(reference)* `atkFrozen` **FLOOR** | — | — | — | **+0.2211** | 0.1423 | 1.55 |

⛔ **THE GOALS SLOPE DOES NOT BEND TOWARD THE FLOOR — IT BENDS AWAY.**
`baseDistanceAboveFloor` **+1.03523802817**, `armedDistanceAboveFloor` **+1.29228028169**,
`armedMinusBase` **+0.25704225352**, `fractionOfExcessClosed` **−0.248292901271** — i.e. the
armed world does not close a quarter of the excess, it **widens** it by a quarter.
`bendsTowardFloor` = **false**.

⚠ **HOW HARD TO READ THAT**: no between-arm slope test was pre-registered, and none is
invented now. What is published is each arm's own league-clustered interval, and they
**overlap heavily** (base [1.058, 1.622], armed [0.462, 2.252] — each arm's point estimate
sits inside the other's interval). The honest statement is therefore: **the point estimate
moves the wrong way and nothing here resolves it.** Per the frozen §P5 direction, that
routes to the **SURFACE SLICE, not to a nudge**.

⭐ **AND YET THE READING HALF MOVES THE PREDICTED WAY** — the reading-vs-contact mix,
early → late, per team-match:

| arm | interceptions Δ | \|Δ\|÷hw | tackles Δ | \|Δ\|÷hw | interceptions gen 1 → gen 20 |
|---|---:|---:|---:|---:|---|
| `liveBase` | **−5.12429577465** | **8.41944** | +2.69330985915 | 2.05701 | 11.764084507 → 5.14964788732 |
| `liveArmed` | **−3.95246478873** | 2.0337 | +2.72570422535 | 3.23485 | 11.7816901408 → 6.60387323944 |

**The reading collapse is 23 % shallower in the armed world** (−3.95 vs −5.12 interceptions
per team-match over 20 generations) while the contact rise is **the same in both arms**
(+2.69 vs +2.73). That is exactly the pre-registered shape — *persistence should slow the
reading collapse if assignment thrash was masking learned defence* — and it is the one
ecological face that moves. ⚠ **It is REPORTED, at 4 leagues, with the two intervals
overlapping**, and it does **not** rescue the goals face: defending reads more and still
concedes more. **The split itself is the finding**: keeping your man buys back READING, and
reading alone does not buy back GOALS.

⚠ **THE FLOOR IS A REFERENCE LINE, NOT A MATCHED CONTROL** (pre-registered in §P5 and
restated in the artifact's `floorRead.interpretationNote`): DF-C0's `atkFrozen` arm froze
the ATTACK genes on league seeds 12,508,900–903; this stage arms a defensive door on
12,510,900–903. The floor says *what the ecology's inflation looks like when attack stops
evolving*; it does not say what this door should have achieved.

### §R6 THE ANCHORED EXTRACTIONS (line receipts; numbers REPORTED, never asserted)

| id | file | value | line no. AT THIS COMMIT |
|---|---|---:|---|
| `markStanceBand` | `src/ai/actionExecutor.ts` | 2.6 | **297** |
| `zonalEngageRadius9` | `src/ai/TeamBrain.ts` | 9 | 580 |
| `markRange22` | `src/ai/TeamBrain.ts` | 22 | 582 |
| `touchControlDist` | `src/sim/constants.ts` | 4.2 | 315 |

Each matched EXACTLY ONCE (`gAnchorsResolveOnce` GREEN). ⭐ **`markStanceBand` moved 294 →
297 inside this very stage** — the citation sweep's own three comment lines pushed it down.
That is the anchored-extraction canon demonstrating itself: the line number is a receipt
discovered at run time, and a stage that had typed `294` into its probe would now be lying.

### §R7 SEEDS AND STATS

**BOOKED = WALKED** (`gSeedsBookedEqualWalked` + `gArmsPairedPerSeed` GREEN):
`12,510,000–149` (150 paired seeds) **+ `12,510,999`** = 151 seeds × 2 arms = **302 walks**;
the ladder's four league seeds `12,510,900–903` walked in **both** arms; the pin/smoke
prefix `12,510,800–802` in band. **BLOCK 12,510,000–999 CONSUMED WHOLE.** Next sim block
≥ **12,511,000**.

**STATS: TWO BASES CONSUMED** — **114,800** (the paired seed-clustered match-battery
bootstrap) and **115,000** (the ladder's league-clustered slope bootstrap), step 200,
against the **completed 59-entry registry** (IN-C0's 56 + 114,200 + 114,400 + 114,600;
`minGapToAnyPublishedBase` 200, `gStatsDisjoint` GREEN). Next base ≥ **115,200**.

### §R8 DEVIATIONS (honest)

1. ⚠ **`multiChaseShare3` grazes zero at −1.21 × 10⁻⁵** and is reported UNRESOLVED by the
   frozen rule. The criterion was NOT re-cut; the face is flagged in §R2 as the first thing
   the later surface slice should re-measure.
2. ⛔ **The ladder's goals slope moved AWAY from the atkFrozen floor** (+1.513 armed vs
   +1.256 base). Reported unhedged. No between-arm slope test existed in the freeze and
   none was invented after sight, so the move is stated as a point estimate inside
   overlapping intervals — not as a resolved regression.
3. ⚠ **`gLadderGen1Identical` pins GENOMES, not RESULTS.** Arming the door changes the
   world from generation 1, so the arms' gen-1 *outcomes* differ (goals 2.028 vs 2.130,
   passCompletion 0.7369 vs 0.7209). This is NOT DF-C0's `gGen1IdenticalAcrossArms`, which
   could hold because freezing genes changes nothing until evolution runs. Stated, not
   hidden; the gate's name and its artifact field say exactly what they check.
4. ⚠ **The re-derivation comparator normalises non-finite values to `null`** before
   comparing, because JSON cannot carry `NaN`. Without it a degenerate face would
   manufacture a phantom mismatch against its own serialization. Finite values are
   untouched; the smoke run caught this and the fix landed **before** the freeze commit.
5. **The R-乙 spell walker is a PORT, not a shared module.** It is copied from BK-T2's §(d)
   with the definitions quoted verbatim into the artifact, but it is not drift-gated against
   that file at run time (DF-C0 drift-gates its tokenizer; this stage does not). A future
   chain-face consumer should promote it rather than copy it a third time.
6. **Q07's forward-pass rise is a HYPOTHESIS**, labelled as such in §R3 — no instrument here
   discriminates the mechanism (#144(a)).
7. **`PROGRAMME.md` / the rulings file are NOT edited by this session** (executor iron rule:
   governance files are the commander's). The queue's status line, the frontier update and
   the ruling are the commander's to write.
8. **Two consumed-block bookkeeping notes**: `12,510,999` is WALKED (not merely booked), and
   the ladder league seeds were booked once and walked twice (once per arm) — both stated in
   `seeds.subRanges` so BOOKED = WALKED reads honestly.
