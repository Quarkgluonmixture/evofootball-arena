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

*(appended in the result commit — the freeze commit ends here)*
