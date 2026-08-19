# DF-C0 — THE DEFENSIVE-BRAIN CENSUS (instrument-only)

> **Ordered by** COMMANDER RULING #319 item 3. **Bound by**
> [`DF-DEFENSIVE-BRAIN-CONTRACT.md`](DF-DEFENSIVE-BRAIN-CONTRACT.md) §3 (DF-C0) and the
> doctrine [`DEF-DOCTRINE.md`](DEF-DOCTRINE.md) §2. **Instrument:**
> `scripts/probes/df-c0-defensive-brain-census.ts`. **Artifact:**
> `docs/world-model/data/df-c0-defensive-brain-census.json`.
> **Two-commit pattern:** this file's §PRE-REGISTRATION is written and committed WITH the
> probe, BEFORE the battery runs (freeze-before-battery, home ruling #266.3(c)); §RESULTS is
> appended afterwards. Nothing in `src/**` is touched.

---

## §PRE-REGISTRATION (frozen before the battery)

### §P0 What this census is for

The user's four defensive observations (DEF-DOCTRINE §-1) name a disease and guess at a
cause: 压迫两人帽 · 乱跑 · 区域/链式防守长不出来 · 进球逐季通胀,「可能是底座缺失」. DF-C0
measures the substrate before anything is designed: what is hand-written today, how much the
assignment layer actually thrashes, which primitives a chain/zone would need and whether they
exist, whether goals really inflate across generations and — the arc's own question — whether
that inflation is **attack getting better** or **defence failing to answer**.

The census DECIDES NOTHING about the world; it picks the slice design and order.

### §P1 The five instruments, defined

**(a) THE HAND-RULE INVENTORY.** A text census over a FROZEN corpus of SEVEN ANCHORED
CONSTRUCTS (not whole files — the defensive-coordination layer, named line by line):
`teamMode` · `assignChasers` · `assignMarks` (TeamBrain.ts) · `markStance` ·
`jockeyStandoff` (actionExecutor.ts) · `defensiveActionMenu` (PlayerBrain.ts) ·
`restDefenceDepth` (formations.ts). Each construct pins its FIRST and LAST line verbatim;
both must resolve EXACTLY ONCE and in order or the probe refuses to run.

* **Needles, prefix stated.** (i) LITERAL needles: a numeric literal in CODE, PREFIX
  condition = "not preceded by `[A-Za-z0-9_$.]`, not followed by `[A-Za-z0-9_$]`"
  (`literalNeedleRegex` in the artifact); (ii) TOKEN needles: the 13 named coordination
  surfaces (`team.chasers`, `team.marks`, `style.scheme`, `count`, the six defensive genes,
  …). Counts are published PER NEEDLE and EVERY occurrence's site is enumerated (canon:
  needle-occurrence counts, home PC-C0 §CORR item 1).
* **Classing, frozen precedence** (first match wins; the order IS the definition):
  `cap` (the literal writes a body COUNT) → `role-bias` (the line tests/keys a ROLE) →
  `scheme` (the line touches the marking-scheme machinery) → `threshold` (the literal is
  compared with a relational operator) → `other-constant` (enumerated, never dropped).
  No per-site hand classing exists anywhere, so the inventory cannot be curated after sight.
* **The named rules of record** (16) are pinned to their NAMED CALL SITE by an EXACT-LINE
  anchored match — never first-occurrence (canon: anchored extraction, home BK-C0 §CORR
  item 1). Line numbers are RECEIPTS discovered at run time, never typed into the probe.
* **Tokenizer.** `stripTokens` is COPIED BYTE-VERBATIM from
  `scripts/probes/in-c0-fix-surface-rescan.ts` and DRIFT-GATED against that file; the
  historically buggy `stripComments` is kept as the MUTANT ORACLE (canon: text-census corpus
  integrity, home IN-C0 §CORR item 2). ANCHORS are located on RAW lines (a receipt is about
  the file a human opens, and `'Press'`/`'zonal'` only exist there) and are REQUIRED to be
  real code — the stripped counterpart must be non-empty. The LITERAL CENSUS runs on the
  STRIPPED text: no comment and no string content can contribute a counted number.
* **Deliberately OUT, named so the exclusion is auditable:** `assignRunners`,
  `pickCornerRoutine`, the corner crash counts — the ATTACKING off-ball caps.

**(b) THE 乱跑 DIAGNOSIS.** World-9 walks (`a4MatchFlags(8)` + `bkFacingLaw` +
`bkContactLaw` + `armA4World` with the matured L3/PC doses, both dose files hashed AS BYTES
before parsing). Per-seed cells; every rate published on BOTH the defender-minute and the
240 s match clock (clock honesty). Faces: mark-target switches · abandonments · assignments ·
chase starts · chase abandonments · `markHeldShare` · re-target latency (STORED BINS, 8 ×
0.5 s — a percentile face requires stored bins) · `dupMarkShare` · `multiChaseShare2/3` ·
the SWARM's own face at two SRC-EXTRACTED radii · `goalsPerMatch` ·
`tacklesPlusInterceptionsPerMatch`. Every denominator is disclosed per face, including the
moving ones.

* **The dupRun lineage, reused not re-invented:** `DUP_RUN_M = 4` is the P3′ duplicate-run
  radius from `scripts/probes/mt-t1-ruler-rerun.ts:235`, documented in
  [`MT-T1-RULER-RERUN.md`](MT-T1-RULER-RERUN.md) and
  [`PM-T1-COMPRESSION-EXAM.md`](PM-T1-COMPRESSION-EXAM.md) ("the P3′ duplicate-run radius").
  `familyOf` is copied VERBATIM from the same file and drift-gated. The attacking face asks
  whether two licensed RUNNERS aim at points within 4 m; the defensive analogue asks whether
  two MARK-family defenders aim at target BODIES within the same 4 m.
* **The swarm radii are DERIVED, never chosen (#200):** 2.6 m = the mark stance base
  (extracted at the NAMED site `markStanceBand`), 9 m = the zonal engage radius (extracted at
  `zonalEngageRadius9`).

**(c) THE ZONAL/CHAIN PRIMITIVE-GAP ANALYSIS.** Code facts only. Four primitives — a
line-link, a cover rotation, a mark handoff, an offside-trap step — each decomposed into the
state/actions it would CONSUME, every item CLASSED `exists-live` / `exists-dormant` /
`MISSING` with a line receipt that is RE-VERIFIED VERBATIM against `src/**` at run time. No
speculation beyond the classing.

**(d) ⭐ THE SEASON LADDER — the arc's own ruler.** Long headless leagues in THE SHIPPED
WORLD (no matchFlags — canon, worker fixtures, home ruling #283.2(iv)), THREE ARMS ×
FOUR PAIRED LEAGUE SEEDS × 20 GENERATIONS, every generation measured (no sampling):

| arm | what it is |
|---|---|
| `both` | the live world — nothing frozen |
| `defFrozen` | attack evolves × the DEFENCE-relevant genes + defensive style frozen at gen-1 |
| `atkFrozen` | the converse |

* **The gene partition is PARTITION-GATED:** DEFENCE (9: pressIntensity ·
  defensiveCompactness · markingAggression · keeperAggression · formationDepth · jockeyBias ·
  coverBias · trapBias · transitionPress) ∪ ATTACK (8) ∪ NEUTRAL (6) = `GENE_KEYS` exactly,
  pairwise disjoint. Defensive STYLE = `formationDef` + `scheme`; attacking = `formationAtk`.
* **⭐⭐ THE LAWFUL FREEZE MECHANISM, PRE-REGISTERED.** After each shipped
  `League.finishSeason()`, the frozen sub-vector is re-copied onto `f.coach.genome` /
  `f.coach.style` — THE EXACT FIELDS the shipped evolution writer mutates (`evolveGroup`:
  `coach.genome = mutateGenome(…)`, `mutateStyle(coach.style, …)`) — and
  `League.createMatch` serializes it into `TeamInfo` exactly as it always does. NOTHING is
  ever written into `info.genome` by hand (dose-placement canon, home ruling #270.2). No RNG
  is consumed, so determinism is untouched. THE RECEIPT IS READ BACK AT THE SERIALIZED
  BOUNDARY: on each generation's first fixture the probe reads the frozen keys out of the
  real `TeamInfo` the shipped `createMatch` produced (`serializedKeyDrift`).
* **Stated limits.** Freezing is BY SLOT: a reborn club inherits the gen-1 frozen half —
  which IS the counterfactual the arm asks for (「防守这一半从来没进化过」). Squad
  ATTRIBUTES and coaches develop in EVERY arm: this ladder freezes the TACTICAL GENOME half
  only. `pressedShare` has NO shipped league-grain statistic and is NOT invented — it is
  reported at match grain by instrument (b) instead.
* **Depth rationale.** One generation = 71 matches ≈ 5.3 s measured (the fingerprint anchor's
  2 seasons/142 matches ≈ 1 min is the same order). 3 arms × 4 leagues × 20 generations =
  240 league-seasons ≈ 21 min, inside the 75-min ceiling with the churn battery (≈ 1 min).
  20 generations is chosen because `goals-warming.ts` (phase-82) reads its inflation over
  a 24-season horizon with the early/late means taken over 6 — this ladder's early/late
  windows are generations 1–5 vs 16–20, DISJOINT, three arms wide.

**(e) THE DECISION-SURFACE SIZING.** Seven verbatim-verified receipts: the two assignment
CALL SITES (`assignChasers` / `assignMarks`, adjacent inside `updateTeamBrain` — which is why
ONE surface can replace both without a new tick), the PlayerBrain consumer, and the four
accounts the surface could consume TODAY (L3 access-time at its live consumer · the defence
books · the commitment-physics decline site · the DORMANT observer-grounded commitment
module). **The perf bound is RE-ANCHORED against `docs/perf/baseline.json`** (hashed as
bytes before parsing), never self-measured — the IN-C0 perf-mislabel lesson.

### §P2 Gates (frozen; a RED gate stays red and is reported)

`gSrcUntouched` (porcelain AND `diff --stat HEAD` over `src`) · `gTokenizerVerbatim` ·
`gCorpusAnchored` · `gInventoryEnumerated` · `gNamedRulesAnchored` ·
`gExtractsMatchDoctrine` (0.62 / 0.78 / 9 / 22 / 2.6 read out of src equal the values the
doctrine cites) · `gCorpusIntegrityDiscriminates` (tokenizer corpus structurally sound AND
the naive stripper measurably breaks THIS corpus — swallowed code lines, broken balance, and
either lost literal sites or lost anchors; the mutation receipt: set the PRODUCTION ALIAS to
`stripComments` and it goes RED) · `gWorldNine` · `gChurnNonDegenerate` ·
`gLatencyBinsStored` · `gGapReceiptsVerbatim` · `gGapClassed` · `gGenePartition` ·
`gFreezeHeld` · `gFreezeBites` (mutant liveness: in each frozen arm the frozen half moved
EXACTLY zero while the free half moved) · `gGen1IdenticalAcrossArms` · `gLadderComplete` ·
`gSizingReceiptsVerbatim` · `gPerfAnchored` · `gSeedDiscipline` · `gStatsDisjoint` ·
`gFacesFromDisk` (EVERY published face — churn, latency percentiles from bins, all eight
ladder faces per arm×generation, and every slope level/delta — re-derived by RE-PARSING the
artifact off disk).

### §P3 Seeds and stats (pre-registered)

* **Block 12,508,000–999, CONSUMED WHOLE of record.** Sub-ranges: `…000–…249` the 乱跑
  battery (250 world-9 walks; the smoke's three walks are the FIRST THREE of this range —
  the in-band smoke prefix) · `…900–…903` the season ladder's four league seeds (the SAME
  four leagues in all three arms — the paired design; booked once, walked three times) ·
  `…999` the world-construction receipt (the xxx,999 convention). BOOKED = WALKED is
  reported in `seeds.bookedEqualsWalked`.
* **Stats base 114,400, step 200.** Checked against the COMPLETED registry: IN-C0's 56
  entries plus the one base consumed since that sweep (114,200, #317 item 4) = **57**;
  the completion METHOD is republished in the artifact so it re-runs. TWO DRAWS ⇒ TWO
  BASES BOOKED: 114,400 (the churn cluster bootstrap) and 114,600 (the ladder's
  league-clustered bootstrap). Next base ≥ **114,800**.
* **Override discipline:** a smoke / N / GENS / OUT run may NOT write the canonical artifact
  path (the probe refuses, exit 2).

---

## §RESULTS

> **Freeze commit** `61deb21` (instrument + §PRE-REGISTRATION). **Battery** run at that
> commit, `DFC0_MODE=full`. **21 of 22 gates GREEN; `gFacesFromDisk` RED — reported, not
> patched.** Because a RED run must not overwrite an artifact of record, the artifact is
> published at the SIDE PATH `docs/world-model/data/df-c0-defensive-brain-census.RED.json`
> (532,795 bytes; sha256 `ca7d0f65…5723`; `bodySha256` field `da540e1febb554ef…`), and the
> canonical path stays EMPTY. Every number below is quoted from that artifact's fields.
> Wall: `churnWallSeconds` 25.2 + `ladderWallSeconds` 1659.4 = `totalWallSeconds` 1685
> (ceiling 75 min). Fingerprint re-checked at HEAD: `57b0bdab…c673`, unmoved.

### §R0 THE RED GATE, PINNED (read this first)

`gFacesFromDisk` is RED with EXACTLY TWO entries in `faceReDerivationMismatches`:

```
slope defFrozen/tackles delta:    1.20176  ≠ 1.201761
slope defFrozen/clearances delta: 0.290846 ≠ 0.290845
```

**Cause, pinned:** the probe PUBLISHES a slope's `delta` as the mean of the four per-league
`late − early` deltas, and the disk re-derivation recomputes it as `late − early` of the two
league-means. The two are algebraically identical and differ only in floating-point
association — the disagreement is **1 × 10⁻⁶ on 2 of 15 slope deltas**. Nothing else
disagrees: every 乱跑 face, both latency percentiles from stored bins, all EIGHT ladder faces
across 3 arms × 20 generations (480 checks) and every early/late LEVEL re-derived bit-exactly
off disk.

**It stays red.** A criterion is not re-cut after sight. The repair is a one-line
DF-C0-FIX-class micro-generation (publish and re-derive `delta` through ONE formula) and it
is the commander's to order; no measured value changes at 5 decimal places. Until then the
census's faces are **REPORTED, not gated-of-record** — that is the honest status of every
number in §R2–§R5.

### §R1 (a) THE HAND-RULE INVENTORY — 105 hardcoded literals in 203 lines of code

The corpus resolved to seven constructs (`spans`): `teamMode` TeamBrain.ts:58–97 ·
`assignChasers` :316–440 · `assignMarks` :456–499 · `markStance` actionExecutor.ts:294–367 ·
`jockeyStandoff` :219–240 · `defensiveActionMenu` PlayerBrain.ts:1744–1783 ·
`restDefenceDepth` formations.ts:200–207. **203 code lines** carry
**`literalSitesEnumerated` = 105** numeric literals, classed:

| class | count | what it means |
|---|---:|---|
| `threshold` | 45 | a hand-drawn cut on a continuous quantity |
| `other-constant` | 40 | offsets, blend weights, radii used in arithmetic |
| `cap` | 15 | a literal that writes a body COUNT |
| `role-bias` | 3 | a constant that applies to some roles and not others |
| `scheme` | 2 | the marking-scheme machinery |

Per construct (`literalsByConstruct`): `assignChasers` 26 · `teamMode` 24 · `markStance` 24 ·
`defensiveActionMenu` 11 · `assignMarks` 7 · `jockeyStandoff` 7 · `restDefenceDepth` 6.
Token needles (`tokenNeedleCounts`): `count` 13 · `team.chasers` 8 · `markingAggression` 5 ·
`team.marks` 4 · `team.mode` 4 · `p.role` 4 · `role ===` 4 · `pressIntensity` 4 ·
`transitionPress` 2 · `coverBias` 2 · `style.scheme` 1 · `jockeyBias` 1 · `trapBias` 1.

**All 16 NAMED RULES anchored EXACTLY ONCE** (`namedRulesOfRecord`), receipts discovered at
run time. The ones the doctrine names:

| rule | receipt | class |
|---|---|---|
| `modeThreshold062` — the whole team is Press or Defend at one number | `src/ai/TeamBrain.ts:90` | threshold |
| `presserBase` — one presser by default | `src/ai/TeamBrain.ts:359` | cap |
| `presserSecond078` — a second, by mode or by a gene crossing 0.78 | `src/ai/TeamBrain.ts:367` | cap |
| `looseBallDuelCap` — a loose ball is a duel, one man | `src/ai/TeamBrain.ts:372` | cap |
| `transitionThirdPresser` — the window-bounded third, capped at three | `src/ai/TeamBrain.ts:384` | cap |
| `transitionDropCap` | `src/ai/TeamBrain.ts:385` | cap |
| `restartChaserCount` — 0 for a goal kick, else 1 | `src/ai/TeamBrain.ts:395` | cap |
| `schemeSwitch` — the marking scheme IS an enum | `src/ai/TeamBrain.ts:460` | scheme |
| `zonalEngageRadius9` — 9 m decides whether he may engage | `src/ai/TeamBrain.ts:493` | scheme |
| `markRange22` — 22 m, nearest-first greedy, no price | `src/ai/TeamBrain.ts:495` | scheme |
| `widthDisciplineWG` — a wide WG may not take a central threat | `src/ai/TeamBrain.ts:490` | role-bias |
| `markStanceBand` — 2.6 m base, 1.4 m of gene span (the CONTINUOUS half that exists) | `src/ai/actionExecutor.ts:294` | other |
| `l3SagSeam` — ⭐ the access-time account at its live consumer | `src/ai/actionExecutor.ts:326` | other |
| `jockeyGate025` — a gene crossing 0.25 flips containment on | `src/ai/actionExecutor.ts:237` | threshold |
| `trapHoldBlend` — the trap is a per-body disposition, not an act | `src/ai/actionExecutor.ts:362` | other |
| `coverBiasClamp` — the libero/stopper axis as a positional clamp | `src/ai/formations.ts:200` | other |

`srcExtractedConstants` read out of src match the doctrine's citations exactly:
`MODE_THRESHOLD` 0.62 · `PRESS_GENE_CUT` 0.78 · `SWARM_R_ZONE` 9 · `MARK_RANGE` 22 ·
`SWARM_R_STANCE` 2.6.

**Corpus integrity, proven non-vacuous ON THIS CORPUS:** the tokenizer leaves 0 balance
failures; the naive (historically buggy) stripper leaves 3, swallows **1,003 code lines**
inside these four files (`naiveDeficits`: PlayerBrain.ts 791, actionExecutor.ts 204,
formations.ts 8, TeamBrain.ts 0 swallowed / 44 altered), loses **11 of the 105 literal
sites** (`naiveLiteralSites` 94) AND destroys the anchors that define the corpus
(`naiveAnchorsResolved` false). Both manifestations fire at once.

### §R2 (b) THE 乱跑 DIAGNOSIS — 乱跑 is REAL, and it is ASSIGNMENT THRASH

250 world-9 walks, 3,786,162 ticks, every `worldOk` true. Faces (value [95 % cluster CI]):

| face | value | 95 % CI |
|---|---:|---|
`markSwitchesPerDefenderMinute` | **16.1267** | [15.5833, 16.6627]
`markSwitchesPerDefenderMatch` | **64.5067** | [62.3334, 66.6506]
`markAbandonsPerDefenderMinute` | 14.2877 | [14.049, 14.5266]
`markStartsPerDefenderMinute` | 14.646 | [14.4055, 14.8878]
`chaseStartsPerDefenderMinute` | 9.9248 | [9.7159, 10.1405]
`chaseAbandonsPerDefenderMinute` | 9.7676 | [9.5639, 9.9804]
`markHeldShare` | 0.6329 | [0.6208, 0.6453]
`dupMarkShare` | **0.2831** | [0.271, 0.2952]
`multiChaseShare2` | 0.3984 | [0.378, 0.419]
`multiChaseShare3` | **0.1169** | [0.1065, 0.1282]
`swarmStanceShare2` | 0.0847 | [0.0785, 0.0913]
`swarmZoneShare3` | 0.3246 | [0.3118, 0.3387]
`reTargetLatencyMeanS` | 1.0576 | [1.0277, 1.0899]
`goalsPerMatch` | 2.492 | [2.292, 2.684]
`tacklesPlusInterceptionsPerMatch` | 31.4 | [30.532, 32.308]

In the player's language: **a marker changes his man about every 3.7 seconds of defending**
(16.13 switches per defender-minute; 64.5 per match), he only HAS a man 63 % of the time, and
when he loses one he waits about a second for the next (median latency bin 0.5 s, p90 3 s;
`latencyBins.pooled` = [28052, 5824, 3574, 2216, 1796, 2083, 1025, 3354]). **28.3 % of
two-marker moments have two defenders sitting on targets less than 4 m apart** — the
dupRun-lineage face, defensive side: double-marking by accident, not by plan. Pressing
chatter matches: 9.9 chase starts and 9.8 chase abandonments per defender-minute — starts and
un-starts in near-equal number.

The cap's own output (`chaserCountBinsPooled` = [431172, 1719847, 877388, 193222, 0]):
one presser 53.4 %, two 27.2 %, three 6.0 %, zero 13.4 % of 3,221,629 defending team-ticks —
**the bin for four is EXACTLY ZERO**, so
the cap does bind, and the licensed third (Phase 112's window) is the whole of the three-body
share. Bodies actually converging (`swarm@9m` bins = [174359, 248456, 390905, 246863, 114434,
29821]) put ≥3 defenders inside the engine's own engage radius on **32.5 %** of carrier ticks,
while ≥2 inside the 2.6 m stance radius happens on 8.5 %. **This is the band H-DF.1(b) must
be matched against** — the swarm the cap holds today, measured, with its denominators stated.

### §R3 (c) THE PRIMITIVE GAPS — 12 items: 4 live, 2 dormant, **6 MISSING**

Every receipt verified verbatim against `src/**` (`gGapReceiptsVerbatim` GREEN).

* **A LINE-LINK (链式)**: depth exists and `coverBias` moves it (formations.ts:200) —
  but *no station term anywhere reads another defender's position*, and there is no
  team-level line object. **2 MISSING.** 链式防守 cannot emerge because the input does not exist.
* **A COVER ROTATION (补位)**: ⭐ **a commitment primitive EXISTS AND IS UNWIRED** —
  `defensiveCoordination.ts` builds observer-grounded commitments (target point, arrival time,
  valid-until tick) and cover facts (self-vs-committed arrival, relatively-exposed outlet),
  and **nothing in `src/**` imports it**. What is missing is the ACTION: there is no
  "take that zone" for a chooser to price. **2 dormant + 1 MISSING.**
* **A MARK HANDOFF (换人盯)**: ⭐⭐ **THE MECHANISM OF 乱跑, IN ONE LINE** —
  `TeamBrain.ts` `team.marks.clear()`: every assignment pass clears the whole map and re-runs
  the greedy scan, so a switch costs nothing and *is not even represented*. There is no state
  a handoff could hand off, and no channel to agree one. **2 MISSING.**
* **AN OFFSIDE-TRAP STEP (造越位)**: the law is live (Match.ts reads `trapBias`) and the trap
  is a per-body *disposition* (actionExecutor.ts:362) — but there is no synchronised team act
  at all: `updateTeamBrain` hands out assignments and a mode, never a timed collective action.
  **1 MISSING.**

### §R4 (d) ⭐⭐ THE SEASON LADDER — the inflation is ATTACK-DRIVEN, and reading dies

3 arms × 4 paired leagues × 20 generations, **17,040 matches**, every generation measured.
Generation 1 is bit-identical across the arms (`gGen1IdenticalAcrossArms` GREEN); the freeze
held at the SERIALIZED boundary in every cell (`gFreezeHeld`) and bit
(`gFreezeBites`: frozen half moved exactly 0, free half moved).

goals/match, generations 1 → 20 (`perGenerationFaces`):

| arm | gen 1 | gen 20 | early 1–5 → late 16–20 | Δ | half-width | **\|Δ\|÷hw** |
|---|---:|---:|---|---:|---:|---:|
| `both` (live) | 2.264 | **3.285** | 2.294 → 3.057 | **+0.7627** | 0.7250 | **1.05** |
| `defFrozen` | 2.264 | 3.028 | 2.322 → 2.738 | +0.4162 | 0.3789 | 1.10 |
| `atkFrozen` | 2.264 | **2.468** | 2.151 → 2.373 | **+0.2211** | 0.1423 | **1.55** |

**⭐ THE SPLIT THE ARC WAS BUILT TO GET.** Freeze the ATTACK half and the inflation the user
reported nearly disappears (+0.22 goals over 20 generations); freeze the DEFENCE half and it
still runs at 55 % of the live world (+0.42 vs +0.76). 「进球逐季通胀」 is, at ecology grain,
**attack evolving** — not defence decaying. The residual +0.22 in `atkFrozen` is honest and
expected: squad ATTRIBUTES develop in every arm (a pre-registered limit), so no arm is a pure
gene counterfactual.

**⭐⭐ AND THE DEFENSIVE EVENT MIX INVERTS** (`interceptionsPerTeamMatch` /
`tacklesPerTeamMatch`, early→late):

| arm | interceptions Δ | \|Δ\|÷hw | tackles Δ | \|Δ\|÷hw |
|---|---:|---:|---:|---:|
| `both` | **−3.2426** | **1.80** | +1.5567 | **2.30** |
| `defFrozen` | **−3.9201** | **3.30** | +1.2018 | 1.84 |
| `atkFrozen` | −1.4472 | 1.72 | +0.7525 | 1.08 |

Interceptions fall from 11.5 to 7.2 per team-match in the live world while tackles rise from
6.0 to 7.7 — **defending degenerates from READING to CONTACT as ecologies evolve**. Freeze
attack and the collapse is only a third as deep (11.5 → 9.7): the collapse is *attack-driven
too*. Shots barely move in any arm (`both` early→late +0.0722, |Δ|÷hw 0.13; gen 1 → gen 20
`shotsPerTeamMatch` 6.593 → 7.371), and pass completion is flat (`passCompletion` 0.727657 →
0.721486 in the live arm) — so this is not a general chaos rise; it is specifically the
defence's reading events being taken away. `pressedShare` has NO shipped league statistic and was NOT
invented (see §P1(d)).

### §R5 (e) THE DECISION-SURFACE SIZING

Seven receipts verified verbatim. **The seat:** `assignChasers(team, match);` and
`assignMarks(team, match);` sit adjacent inside `updateTeamBrain` — ONE surface can replace
both without a new tick; the consumer is the per-body menu at `PlayerBrain.ts:1744`.
**The accounts available TODAY:** the L3 access-time account at its live consumer
(`actionExecutor.ts:326`), the defence books (`defenceBook.ts` `DefenceAccountBook`, armed in
world 9), commitment physics at its live decline site (`mechanics.ts`
`match.l3DefenceDeclines(...)`), and the DORMANT observer-grounded commitment module
(`defensiveCoordination.ts`) — which consumes SNAPSHOTS, i.e. the IN interlock.
**The perf bound is the ANCHOR's, not ours:** `docs/perf/baseline.json` @ `c07a19b`
(hashed as bytes) — step 5.32 µs, `teamBrain` **0.21 µs/step (3.9 % of tick)**, `decide`
0.54 µs (10 %); a 2 %-of-tick budget is **0.106 µs/step**, i.e. about half the teamBrain
phase again for a 20-price surface (5 defenders × 4 options, once per team per
TEAM_AI_INTERVAL — not per body per tick). This is a BUDGET; the slice measures its own cost
against the same anchor.

### §R6 THE DESIGN THE CENSUS PICKS

1. **DF-T0 = THE PER-DEFENDER ASSIGNMENT SURFACE WITH PERSISTENCE, dormant beside the cap.**
   The census says the first cut is not "press vs mark" as a new price list — it is
   **assignment persistence**: `team.marks.clear()` + nearest-first greedy is the measured
   mechanism of 乱跑 (16.1 switches per defender-minute, 28.3 % accidental double-marking,
   63 % assignment coverage). A surface that prices *keeping* your man against *changing* him
   — on the L3 access-time slack that is already computed at the stance line — makes the
   switch cost something for the first time. Faces already exist to gate it: churn, dupMark,
   the swarm band, and the season ladder.
2. **The cap stays.** `multiChaseShare3` = 0.1169 and the FOUR-chaser bin is exactly zero:
   the cap binds today, so H-DF.1(b) has a real band to be matched against. Two compensators
   never retire in one slice.
3. **Coordination is correctly OUT of slice 1** — and the census says *why* in code: 6 of 12
   primitive items are MISSING, and the two dormant ones consume snapshots. 区域/链式防守
   cannot emerge from any amount of pricing until a defender's station can read a line-mate.
4. **⭐ THE IN-T0 vs DF-T0 INTERLOCK, from the numbers.** The DF surface's most valuable
   dormant input (`defensiveCoordination.ts`) is snapshot-shaped, and 拦截线路/卡身位 is the
   doctrine's own latency-free answer. But the ladder shows the disease is attack-driven, and
   the DF slice-1 cut identified here (persistence priced on the access-time account) needs
   **no new information channel at all** — it consumes only what is already live. So the two
   arcs are separable, and the honest fork for the user is a *pace* question, not a dependency
   one: DF-T0 first buys the 乱跑 fix on shipped accounts; IN-T0 first buys the perception
   substrate that the later coordination cluster (and the dormant cover module) will need
   anyway.

### §R7 DEVIATIONS (honest)

1. **`gFacesFromDisk` RED** — §R0. Reported, not patched; the artifact is at the `.RED.json`
   side path and the canonical path is empty.
2. **`ladderWallSeconds` 1659.4 is NOT a clean timing measurement.** The repo test suite and
   several targeted vitest runs were executed on the same machine during the ladder's first
   arm; the per-league banner shows 129 s for the first league and up to ~190 s under
   contention. It affects the WALL FIELD only — every result is deterministic and unaffected.
3. **Two vitest files failed while the battery ran** (`formationEvolution`, `simRunner` —
   multi-season simulation tests) and **both pass green when re-run** (8/8, 152 s). Read as
   contention flakes, not findings.
4. **No arm is a pure gene counterfactual:** squad attributes and coaches develop in all three
   arms (pre-registered in §P1(d)); the `atkFrozen` residual +0.22 goals is the visible
   consequence, disclosed rather than absorbed.
5. **`shotsConcededPerTeamMatch` ≡ `shotsPerTeamMatch`** in a closed league — published as the
   same number with that identity stated, not as two independent faces.

---

## §R-FIX — DF-C0-FIX: THE SLOPE-FORMULA CURE (ordered by RULING #320 item 1)

> **Instrument:** `scripts/probes/df-c0-fix-slope-formula.ts` (sha256
> `3d7a0d700053c4e76ffc0cd0244c269ab377bf569ffe57a8673ebf97bb5bb0b6`). **Source of cells:**
> the RED side-path artifact, byte-hashed before parsing (`ca7d0f65…5723`, `bodySha256`
> `da540e1f…239c`). **NO SIM RE-RUNS** — 0 seeds, 0 stats bases, 0 matches replayed; the
> frozen probe `scripts/probes/df-c0-defensive-brain-census.ts` (`7b47b7e9…a530`) is neither
> edited nor executed. `src/**` untouched. Fix run at `935dcce`.
>
> ⭐ **THIS SECTION SUPERSEDES §R0's "it stays red" and §R7 deviation 1.** Those paragraphs
> are left standing verbatim (the authorization for this step was APPEND-ONLY) and are
> HISTORY: the canonical path is no longer empty, and the census's faces are now
> **GATED-OF-RECORD**. The artifact of record is
> `docs/world-model/data/df-c0-defensive-brain-census.json` (539,318 bytes; bytes sha256
> `715ff471bcbee62bcb177ec436bb7f3fa077d11a0bfa627fe395513d24c81043`; `bodySha256`
> `d848af36949180bc1de8c8b8be2b63d1c2170f50f42d830f590fa245a789805f`). The `.RED.json` side
> path stays on disk as the red run's receipt.

### §RF1 THE ONE FORMULA, AND WHY THIS ONE

```
slopeDelta = mean( per-league (late − early) )          ← ADOPTED
slopeDelta = round(mean(late levels)) − round(mean(early levels))   ← REJECTED
```

Both sides now call **one function**, `slopeDeltaThroughOneFormula`, on the publish side and
inside the on-disk re-derivation — so the two can no longer drift apart by construction. The
adopted formula is the **pre-registered estimand**, and the choice is *forced* rather than
free: the league-clustered bootstrap that produces every slope's `ciLo`/`ciHi`/`halfWidth`
resamples **per-league deltas and means them**, so mean-of-deltas is the only point estimate
consistent with its own interval. The rejected alternative would have imported a rounding
step into the estimand.

The defect is quoted as a receipt rather than described: the frozen verifier's line
`if (!Object.is(round(l - e), s.delta)) {` occurs **exactly once**, and the two per-league
level expressions occur **twice each** in the frozen probe (once on its publish side, once
inside its own verifier) — that duplication *is* the disease. 39 frozen arithmetic snippets
(every helper, every one of the 15 churn accessors, `numOf`/`denOf`, the per-generation face
lines, the published slope levels, and THE ONE FORMULA itself) are copied byte-verbatim into
the fix instrument and **drift-gated** against the frozen file at run time, with occurrence
counts published per snippet (`fix.verbatimSnippets`).

### §RF2 ⭐ WHAT ACTUALLY MOVED — THE VERIFIER WAS THE DRIFTING COPY

**Published measurement fields changed: ZERO.** The publish side already *was* the estimand,
so adopting it changed no measured number at any decimal place. The two values that moved are
on the **re-derivation** side — the verifier's second-formula results landing on the
published estimand:

| re-derived field | old | new |
|---|---:|---:|
| `slope defFrozen/tackles delta` | 1.20176 | **1.201761** |
| `slope defFrozen/clearances delta` | 0.290846 | **0.290845** |

(The ruling's dispatch anticipated the two 1e-6 moves on the *publish* side. Measured, it is
the other way round: the estimand was right in print and wrong in the checker. §R0's cause
diagnosis was exact; only the direction of the repair inverted. Both slopes' published
`delta` fields are unchanged — `defFrozen/tackles` 1.201761 (early 6.208099 → late 7.409859,
hw 0.652289, |Δ|/hw 1.842) and `defFrozen/clearances` 0.290845 (2.207746 → 2.498592, hw
0.378521, |Δ|/hw 0.768) — so **every number quoted in §R1–§R6 stands as printed**.)

**THE DRIFT BOUND, gated both halves** (`gDriftBounded`): the changed-field set inside the
hashed body is **exactly `["gates.gFacesFromDisk"]`**, and of **17,936 numeric fields
compared** across the whole hashed body, **0 moved at 5 decimal places** — indeed 0 moved at
any decimal place. Cells are carried bit-exact (`gCellsCarriedBitExact`: `perSeedCells` and
`ladderCells` serialize identically to the RED artifact), and every face is **re-derived from
those carried cells and asserted identical** before publication (`gPublishedFacesReproduced`)
— nothing is copied on trust. Bootstrap intervals are carried unchanged: they are a
deterministic function of the same cells and the same two stats bases, and no draw was
re-taken.

### §RF3 THE FULL RE-DERIVATION — GREEN, 663 CHECKS OFF DISK

`gFacesFromDisk` re-parses the **canonical artifact from disk** and re-derives every
published face: all 15 churn faces, the pooled latency bins plus both stored-bin percentiles,
all 10 faces × 3 arms × 20 generations of the ladder (including `perLeagueGoalsPerMatch`), and
all 15 slopes' `early` / `late` / `delta` / `|Δ|÷hw` through the one formula. **663 checks, 0
mismatches**; `faceReDerivationMismatches` is now `[]`.

A red fix run cannot touch the record: the instrument writes a **staging path**, re-derives
off *that* file, and only renames onto the canonical path once every gate is green.

### §RF4 THE GATE TABLE (verbatim from the run)

```
--- GATES ---
  GREEN  gSrcUntouched  (fix)
  GREEN  gFrozenInstrumentUnmoved  (fix)
  GREEN  gRedSourceBytes  (fix)
  GREEN  gRedWasRedForExactlyThisReason  (fix)
  GREEN  gClockMatchesSrc  (fix)
  GREEN  gOneFormula  (fix)
  GREEN  gPublishedFacesReproduced  (fix)
  GREEN  gCellsCarriedBitExact  (fix)
  GREEN  gDriftBounded  (fix)
  GREEN  gFacesFromDisk  (fix)
  GREEN  gSrcUntouched  (census, carried)
  GREEN  gTokenizerVerbatim  (census, carried)
  GREEN  gCorpusAnchored  (census, carried)
  GREEN  gInventoryEnumerated  (census, carried)
  GREEN  gNamedRulesAnchored  (census, carried)
  GREEN  gExtractsMatchDoctrine  (census, carried)
  GREEN  gCorpusIntegrityDiscriminates  (census, carried)
  GREEN  gWorldNine  (census, carried)
  GREEN  gChurnNonDegenerate  (census, carried)
  GREEN  gLatencyBinsStored  (census, carried)
  GREEN  gGapReceiptsVerbatim  (census, carried)
  GREEN  gGapClassed  (census, carried)
  GREEN  gGenePartition  (census, carried)
  GREEN  gFreezeHeld  (census, carried)
  GREEN  gFreezeBites  (census, carried)
  GREEN  gGen1IdenticalAcrossArms  (census, carried)
  GREEN  gLadderComplete  (census, carried)
  GREEN  gSizingReceiptsVerbatim  (census, carried)
  GREEN  gPerfAnchored  (census, carried)
  GREEN  gSeedDiscipline  (census, carried)
  GREEN  gStatsDisjoint  (census, carried)
  GREEN  gFacesFromDisk  (census, carried)

seeds consumed: 0 · stats bases consumed: 0 · sim re-runs: 0 · src: UNTOUCHED

ALL GATES GREEN
```

**32 of 32 GREEN** — the census's 22 gates (21 carried + `gFacesFromDisk` cured) plus the fix
instrument's own 10. Five of those ten exist only to make the carry auditable: the RED source
is refused unless its bytes hash, its `bodySha256`, its `mode`/`isOverrideRun`, its freeze
commit `61deb21` and its **exact two-entry** mismatch list all match the pins quoted in §R0,
and unless `DT`/`MATCH_DURATION` read out of `src/sim/constants.ts` still equal the clock
stored with the cells.

### §RF5 RECEIPTS

* `npx tsc --noEmit` — **clean** (exit 0).
* `npm run fingerprint` — `seed=1337 seasons=2 matches=142`,
  `sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **unmoved**
  (identical to the value re-checked at the results commit; the world was not touched).
* `git status --porcelain -- src` — empty; `git diff --stat HEAD -- src` — empty.
* Seeds: **none consumed**. Stats bases: **none consumed**. Block 12,508,000–999 and bases
  114,400 / 114,600 stay booked to the census itself (#320 item 4 stands unchanged; next
  stats ≥ 114,800, next sim block ≥ 12,509,000).

### §RF6 DEVIATIONS (honest)

1. **The dispatch's expectation inverted.** #320 item 1 expected 2 published slope deltas to
   move at 1e-6. Measured: **0 published fields moved**; the 2 moves are on the re-derivation
   side (§RF2). The gate written is therefore the *measured* invariant — changed-field set
   exactly `{gates.gFacesFromDisk}` **and** 0 of 17,936 numeric fields moved at 5 dp — rather
   than the anticipated one. Asserting the anticipated direction would have made the gate
   fail on a correct fix.
2. **§R0 and §R7 deviation 1 are now stale in place.** The authorization was append-only, so
   the sentences "It stays red" and "the canonical path is empty" were **not edited**;
   §R-FIX's header carries the supersession. A reader entering at §R0 must read on.
3. **Bootstrap intervals were carried, not recomputed.** They are a deterministic function of
   the same cells and the same stats bases and no interval was in question; recomputing them
   would have required re-walking the RNG stream for no measurable gain. `|Δ|÷hw` *is*
   recomputed from the re-published delta and asserted unchanged for all 15 slopes.
