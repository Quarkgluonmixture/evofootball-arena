# DF-T2 — THE DEFENSIVE DECISION SURFACE (the dormant src seam)

> **Ordered by** COMMANDER RULING #325 item 5. **Bound by**
> [`DF-DEFENSIVE-BRAIN-CONTRACT.md`](DF-DEFENSIVE-BRAIN-CONTRACT.md) §2 — M-DF.1 (ONE surface,
> EXISTING accounts, derived thresholds only, reads truth STATED not hidden), M-DF.2 (the cap
> retires by measurement — it is UNTOUCHED here), M-DF.3 (styles emerge or the substrate is
> biased — REPORTED, never templated) and M-DF.4 (coordination is OUT; flags off ⇒
> byte-identity; composition proof at the world-9 stack; pins from birth).
> **Doctrine of record**: [`DEF-DOCTRINE.md`](DEF-DOCTRINE.md) §2 clause 1 —
> *「press-vs-mark-vs-cover-vs-intercept is ONE CONTINUOUS decision surface per defender —
> priced, snapshot-consuming, book-informed — never an enum, never a cap.」*
> **Measured mandate**: [`DF-T1-PERSISTENCE-EXAM.md`](DF-T1-PERSISTENCE-EXAM.md) §R4 / ruling
> #324 item 2 — **保住自己的人买回了「阅读」,但光有阅读买不回进球**.
> **Road B**: nothing ships. Flag `dfSurface`, default OFF, absent from `a4World`.

---

## §PRE-REGISTRATION (frozen before the battery — freeze commit)

### §P0 What this stage is, and is NOT

It is a **dormant src seam plus its permanent pin suite plus arming RECEIPTS**. Canon:
**receipts ≠ effect sizes** (homes: ruling #289 item 1 + BU-T1 §CORR item 5) — the walks below
publish counts with units and **make no football claim**. H-DF.1(a) (genuine differentiation
at claim grain) and H-DF.1(b) (the swarm's absence) are the **EXAM's** business, a later
stage; so is the cap-off arm (M-DF.2: two compensators never move in one slice).

### §P1 The scope, as bound at dispatch (#325 item 5)

* ONE continuous **per-defender** chooser over the doctrine's four options at the
  `assignMarks` seat inside `updateTeamBrain` (DF-C0 §R5's adjacency).
* Every option priced from **EXISTING accounts ONLY**: the L3 access-time slack at the stance
  line, the defence books (learned threat), commitment physics (what a lunge costs).
* **Derived thresholds only (#200)** — no new pricing tables, no taste constants, no new
  attrs or genes; every constant an ANCHORED EXTRACTION with a line receipt.
* **THE CAP AND `assignChasers` UNTOUCHED** (M-DF.2). The surface arms **dormant BESIDE**
  them.
* **`dfAssignPersist` COMPOSED, not duplicated** — the persistence law is the HOLD option's
  substrate.
* ⚠ **IT READS TRUTH, STATED NOT HIDDEN** (M-DF.1): defenders price against the world as it
  is. Private snapshots arm defenders in a **later IN slice** — IN-T0's gateway is the
  **CARRIER's** chooser, not a defender's, and nothing in this seam touches it.

### §P2 THE FIVE DESIGN QUESTIONS, ANSWERED BEFORE THE CODE

**(a) THE OPTION SET, AND EACH OPTION'S EXECUTABLE FORM — the honesty question first.**

The seat's entire vocabulary is the mark ledger (`team.marks`: which opponent, if any, each
free defender is responsible for). An option is only real if it has an **exists-live action
primitive** (DF-C0 §R3's class). Audited option by option:

| # | doctrine option | THE EXECUTABLE FORM | primitive class |
|---|---|---|---|
| 0 | **press the carrier** | the **ABSENCE** of an assignment — which re-opens the shipped Phase-29.1 CONTAIN branch (`PlayerBrain`: a body with no mark, not a chaser, inside 8 m of the carrier, goal-side, in our own defensive territory jockeys the carrier) | **exists-live** |
| 1 | **hold my mark** | `team.marks[me]` survives the pass — DF-T0's persistence law | **exists-live** |
| 2 | **sit on a lane** *(→ JUMP)* | at ASSIGNMENT grain only: take the man the account says I reach **before the ball can** — the shipped stance line then puts me in that lane. The **standing** lane-sit (occupy a lane while marking nobody) has **NO action primitive** and is NAMED OUT | **exists-live at assignment grain; the positional act is MISSING** |
| 3 | **(the contact half of marking)** *(→ TAKE)* | take a man the ball beats me to — the shipped greedy | **exists-live** |
| — | **drop to cover** | ⛔ **NAMED OUT, NOT FAKED** | **MISSING** |

⚠⚠ **WHY 「drop to cover」 IS NAMED OUT, in two independent receipts.** (i) *No action*:
DF-C0 §R3 records the cover-rotation row as **2 dormant + 1 MISSING** — "what is missing is
the ACTION: there is no 'take that zone' for a chooser to price". (ii) *No price*: a cover
option needs a **cover FACT** (who is exposed, who arrives first), and the only producer of
one in the tree is `src/ai/defensiveCoordination.ts`, which is **snapshot-shaped and
DORMANT**, and which M-DF.4 puts squarely in the later coordination cluster. Pricing a cover
option today would mean inventing both the fact and the act. **It is therefore not priced,
not counted and not claimed.** The seam does not import that module and a pin asserts it
stays unwired.

⚠ **PRESS's honest limit, stated:** the surface **offers** a body to the contain branch; it
cannot make him press. That branch's own gates — including its 「ONE container only」 rule —
are untouched and still decide, and when they refuse him he holds the shipped block. This is
also why PRESS is the **only** option whose ledger write is the empty one: there is no second
option competing for the same write, so the usage distribution stays unambiguous.

**(b) THE PRICING ALGEBRA — one currency, three accounts, zero new constants.**

Every option is priced in **METRES OF NET ACCESS**: the distance to the body I take
responsibility for, **minus** the metres of recoverable slack the shipped L3 account grants me
on him. **Lower is better; the argmin decides.** For defender `p`:

```
price_hold      =  dist(p, myMan)  −  slack(myMan, p)
price_jump/take =  dist(p, m)      −  slack(m, p)          for a man m inside the shipped 22 m range
price_press     =  dist(p, carrier)                        (UNDISCOUNTED — see below)
```

* **ACCOUNT 1 — the L3 access-time slack.** `slack(man, p)` is the shipped `markSagMetres`
  called with the **stance line's own argument tuple**. Canon VERBATIM: *"a src-extracted
  constant pins its extraction to the NAMED call site — anchored match + line receipt — never
  first-occurrence"* (home: BK-C0 §CORR item 1). **THE NAMED CALL SITE**, quoted verbatim:
  `          if (w > 0) markDist += w * markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed);`
  (`src/ai/actionExecutor.ts`, the census's `l3SagSeam` rule; the LINE NUMBER is reported by
  the artifact, never asserted). Its output is **metres of recoverable slack**
  (`slack ≤ 0 ? 0 : min(slack·v, MARK_SAG_MAX)`) and it inherits its own frozen ceiling — the
  λ_LIN idiom, capped at the shipped region's edge.
  ⭐ **THE ACCOUNT'S OWN SIGN IS THE READING↔CONTACT SPLIT**: `slack > 0` means I am there
  before the ball can be (JUMP — 拦截线路); `slack = 0` means the ball beats me (TAKE — a
  contact assignment). That is a **derived** threshold, the shipped function's own branch, not
  a taste cut. It is also the mandate's own axis, made priceable for the first time.
  ⭐ **PRESS PRICES ITSELF**: the ball is at the carrier's feet ⇒ `t_ball ≈ 0 ⇒ slack < 0 ⇒
  zero sag`. Going at the ball buys **no head start**, and that — not a hand-written penalty
  — is what makes pressing expensive. No carve-out, no predicate.
* **ACCOUNT 2 — the defence books (learned threat).** The team's own `DefenceAccountBook`
  (live in world 9) may **DECLINE** the press option, through its own `declinesLunge`
  comparison. ⚠ **DECLINE-ONLY**, M-L3.3's discipline inherited verbatim: the book can only
  ever REMOVE press; there is no branch on which a belief makes pressing MORE likely, and an
  empty book declines nothing. A wrong book costs **patience**, never recklessness.
* **ACCOUNT 3 — commitment physics.** The group the book is indexed by is
  `arrivalGroup(len(p.vel))` — the engine's own overcommitment cut
  `v* = sqrt(2·ACCEL·R_TACKLE)`, i.e. **the arrival speed that cannot be braked inside the
  challenge radius**. A body already travelling recklessly is the body whose lunge costs the
  most, and that is exactly the body a punished book takes the press option away from.
* **THE THREE ANCHORED EXTRACTIONS** (values reported by the artifact with line receipts, never
  asserted in prose): `containRadius8` and `containTerritory35` from the shipped contain
  branch's ONE line in `src/ai/PlayerBrain.ts`, and `markRange22` from the greedy's own line
  in `src/ai/TeamBrain.ts`. **No new magnitude is invented anywhere in this seam.**
* ⚠ **ONE DELIBERATE CONSERVATISM, pre-registered**: the press election's "best marking
  alternative" is computed **without** the two creation RULES (the Phase-28.4 WG width
  discipline and the zonal zone gate). Omitting them can only make marking look **cheaper**,
  i.e. can only make pressing **LESS** likely. The rules themselves are byte-untouched and
  still govern every fresh pick.

**(c) THE PERSISTENCE INTERACTION — composed, never duplicated.**

`price_hold` **is DF-T0's algebra, rearranged**: DF-T0's frozen predicate
`dist(me,new) + slack(myMan) < dist(me,myMan)` is exactly `dist(me,new) < price_hold`. The
surface's extension is to put the SAME account on the **candidate's** side too. Therefore:

| dfAssignPersist | dfSurface | what the world is |
|---|---|---|
| off | off | the shipped world, byte for byte (both dormancy halves pinned) |
| **on** | off | DF-T0/DF-T1's banked world, **bit-identical to its frozen predicate** (the surface adds no term) |
| off | **on** | the surface WITHOUT a ledger to hold: **the HOLD option is structurally unreachable** (`byOption[hold] ≡ 0` — pinned) and the chooser is press/jump/take |
| **on** | **on** | the full four-option surface — **the battery's armed arm** |

All four cells build, run and are **distinct worlds** (pinned). The battery's **shut** arm is
the `persist-on / surface-off` cell, so the only arm difference is `dfSurface`.

**(d) THE CAP COEXISTENCE (M-DF.2).** `assignChasers` is **byte-identical** to HEAD's slice
(sha pinned in the suite AND re-checked by the probe as a gate), never names the needle, and
is never read, written or consulted by the surface. Pressing here is **containment**, not a
chaser licence: it does not add a body to `team.chasers`, so the Phase-31 「never three」 cap
binds in the armed world exactly as it binds in the shut one — the four-chaser bin must stay
**exactly zero in both arms**. The cap-off arm belongs to the exam.

**(e) THE TICK / CADENCE SEAT.** No new tick and no new call site: the surface lives inside
`assignMarks`, which is still called from exactly one place, on the shipped
`TEAM_AI_INTERVAL` (0.4 s) plus the shipped 0.05 s expedites. **NO NEW SERIALIZED STATE**: the
only addition is a **per-match transient usage ledger** (pure bookkeeping — nothing in the sim
reads it), which `League.toJSON` does not name, `cloneSimulationState` does not copy and the
render adapter never sees. Canon VERBATIM: *"WORKER-SIMMED fixtures play the SHIPPED world
(League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines #270's E4
correction; matches the perf diagnostic)"* (home: ruling #283.2(iv)).

### §P3 DEATH CONDITION (8) — the ONE the surface adds

DF-T0 enumerated seven conditions under which an assignment dies. The surface adds exactly
one more, live only when `dfSurface` is armed:

> **(8) HIS OWN PRICE SAYS THE BALL IS WORTH MORE THAN HIS MAN** — the press election wins,
> so the assignment is released and the body is offered to the contain branch.

That is what turns 「leave your man」 from an accident (the shipped re-greedy) into a decision.

### §P4 The pin suite (from birth — canon: *pin suites from birth*, home ruling #297 item 7)

`tests/dfSurface.test.ts`, in the house form (`dfAssignPersist.test.ts`): dormancy in the
**STRONG** form (absent ≡ explicit-false, both world shapes × 2 seeds, **pooled digest**) ·
arming is a real change · the ledger is empty unless armed · the four option pricing laws on
constructed fixtures, **each account provably entering a price**, each with its arithmetic
mutant stated · the cap intact (`assignChasers` **sha**, needle-free, four-chaser bin exactly
zero armed) · the composition power set × the world-9 + `inSnapshotLaw` stack, all four cells
distinct · no serialization · the seam map (occurrence COUNTS per needle, **PREFIX stated**) ·
`defensiveCoordination.ts` stays unwired · the anchored extractions · the fingerprint of
record.

### §P5 Gates (frozen; a RED gate stays red and is reported)

`gWorldOkEveryWalk` · `gSeedsBookedEqualWalked` · `gArmsPairedPerSeed` · `gAnchorsResolveOnce` ·
⭐ `gCapIntactBothArms` (four-chaser bin exactly zero in BOTH arms) · `gCapBinsNonEmpty` ·
⭐ `gCapSliceShaIdentical` (`assignChasers` byte-identical to the frozen slice) ·
`gLatencyBinsStored` · `gSwarmBinsStored` · `gLedgerZeroWhenShut` (dormancy measured
in-battery) · ⭐ `gEveryOptionUsed` (**NON-DEGENERACY LIVENESS**: all four options used at
least once — a one-corner surface goes RED and is reported as such) · `gArmsDistinguishable` ·
⭐ `gFacesFromDisk` (canon, home ruling #287 item 1: the body is STAGED to disk, re-parsed and
every published face, percentile-from-bins, bin vector and usage aggregate re-derived) ·
`gFingerprintUnmoved`.

⭐ **THE BODY IS HASHED LAST**, after every gate is written including `gFacesFromDisk`
(DF-C0 §CORR item 2, ruling #321). A RED run writes `…RED.json`.

### §P6 Seeds and stats (pre-registered — BOOKED = WALKED, the block consumed whole)

* **Block 12,512,000–999**, opened by #325 item 5, **consumed whole**.
* Battery: `12,512,000–039` (40 seeds) **+ the block's `12,512,999` receipt seed** = 41 seeds
  × 2 arms = **82 walks**.
* Smoke prefix **in band**: `12,512,800/801/802` — the same seeds the permanent pin suite uses.
* **STATS: none expected.** The receipts publish counts; cluster CIs are bootstrap resamples
  of the walked seeds, not a registry-consuming statistic (the IN-T0 precedent). If any
  registry-consuming statistic is drawn, the base is ≥ **115,200**.

### §P7 The receipts this stage will publish (pre-registered, no football claim)

1. ⭐ **THE USAGE DISTRIBUTION** over the four options — pooled, **by situation** (team mode
   Defend vs Press) and **by body** (per-`gid` counts, joined to each body's own `defending`
   attribute **in the instrument**, never in `src`). The NON-DEGENERACY receipt: the surface
   must not be one corner or a re-labelled cap. ⚠ The 范戴克/佩佩 axis is **REPORTED**
   (M-DF.3), never scored here.
2. ⭐ **`multiChaseShare3`, THE FIRST RECEIPT ORDERED** (#325 item 5) — re-measured at DF-T1's
   grain in BOTH arms (#324 left it grazing zero upward at −1.21 × 10⁻⁵, unresolved).
3. The churn / coverage / dupMark family at the DF-T0 grain, with stored latency bins.
4. The swarm band with the cap intact (the four-chaser bin, both arms).
5. ⭐ **THE INTERCEPTION FACE** — the mandate's own face, plus the reading-vs-contact mix as
   one number. ⚠ **DISCLOSED AT FREEZE**: these are `team.stats.interceptions` /
   `team.stats.tackles` read at the whistle of a **single friendly with random genomes**, and
   they are **NOT** DF-C0 §R4's ladder estimand (evolved league play across generations). The
   two must never be quoted as the same number.

### §P8 The instrument

`scripts/probes/df-t2-decision-surface.ts`, frozen in this commit **BEFORE** the battery
(canon: **freeze-before-battery**, home ruling #266.3(c)); the artifact records its `sha256`.
The hashed body is built from an explicit **ALLOWLIST SCHEMA** — canon VERBATIM: *"the hashed
body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never enters the
body; forbidden-name lists are retired"* (home PC-T0 §CORR item 1). Env surface is
**whitelist-or-refuse**: `DFT2_MODE` (required) · `DFT2_OUT`; any other `DFT2_*` var and any
engine door is a fatal refusal, and an override run may not write the canonical path.
**PERF** is measured against DF-C0 §R5's anchor (`docs/perf/baseline.json`, hashed as bytes;
the 0.106 µs/step budget = 2 % of the anchor tick) — **a budget, not a self-measured share**,
published as armed-minus-shut with its wall-measurement caveat attached.

---

## §RESULTS — THE RECEIPT WALKS

> **Instrument**: `scripts/probes/df-t2-decision-surface.ts`
> (`instrument.sha256` = `52a82d9b5aaa962057c9e523835fd698c7dd2dfccfba4615353d4cf57d8f380e`),
> frozen at `fe277b5` **before** the battery.
> **Artifact of record**: `docs/world-model/data/df-t2-decision-surface.json`
> (`bodySha256` = `9eae615097e0e70a8267f29560e567cae91a8675ebe7120e0aebd65597b8809e`).
> **82 walks** (41 seeds × 2 arms), every `worldOk` true, **all fourteen gates GREEN**,
> `rederiveChecks` **169** / `rederiveFails` **0**.
> ⭐ These are RECEIPTS, not effect sizes — **no football claim is made here**.
> Every number below is quoted VERBATIM from an artifact field (canon: *"a stage doc's prose
> quotes artifact FIELDS verbatim or the number becomes a gated face"*, home PC-T2 §CORR
> item 4). ⚠ The two arms' intervals are **independent bootstraps of the same 41 walked
> seeds**; **no paired between-arm test was pre-registered and none is invented here**, so
> every comparison below is read as "do the intervals separate", never as a Δ with a CI.

### §R1 ⭐⭐ THE USAGE DISTRIBUTION — the NON-DEGENERACY receipt, and its honest limit

`usage.optionOrder` = `["press","hold","jump","take"]` · `usage.electionsArmed` **85453**
defender-decisions · `usage.idleArmed` **8810**.

| option | `usage.byOption` | `usage.byOptionShare` | armed face value [95 % CI] |
|---|---:|---:|---|
| **press** | 283 | **0.00331176202123** | `usagePressShare` 0.00331176202123 [0.00265448901087, 0.00406726535486] |
| **hold** | 64584 | **0.755783881198** | `usageHoldShare` 0.755783881198 [0.744320124503, 0.766565950029] |
| **jump** | 6636 | **0.077656723579** | `usageJumpShare` 0.077656723579 [0.0744520954944, 0.0807724479034] |
| **take** | 13950 | **0.163247633202** | `usageTakeShare` 0.163247633202 [0.154037579051, 0.172902371494] |

`usageIdleShare` **0.0934619097631** [0.0678784317018, 0.121443254355] of defender-passes had
no affordable option at all. **`gEveryOptionUsed` GREEN**: all four options are genuinely
used — the surface is **not** a re-labelled cap and **not** a dead branch.

**BY SITUATION** (`usage.byModeOption` = `[262, 41729, 4106, 8865, 21, 22855, 2530, 5085]`,
[Defend×4, Press×4]): `byModeOptionShareDefend`
`[0.00476692987883, 0.759233652342, 0.0747061606201, 0.161293257159]` vs
`byModeOptionSharePress`
`[0.000688727821324, 0.749565445541, 0.0829753041881, 0.166770522449]`. The **press option is
~7× more used in DEFEND mode than in PRESS mode** — which is not a paradox but the shipped
geometry talking: a pressing team already has its chasers at the ball, so the contain branch's
「closest unassigned goal-side defender」 picture arises far more often when the team is
holding its block. Stated as a mechanism reading, not a finding.

⚠⚠ **THE HONEST LIMIT, REPORTED AS LOUDLY AS THE PASS: AT BODY GRAIN THE SURFACE IS ONE
CORNER.** `usage.bodiesCounted` **410**, `usage.bodyModalCounts` `[0, 407, 0, 3]`,
`usage.bodyModalShare` `[0, 0.992682926829, 0, 0.00731707317073]` — **407 of 410 bodies have
HOLD as their modal option and not one body is modal on press or jump.** The distribution is
non-degenerate in AGGREGATE and degenerate at the argmax-per-body grain. Both facts are the
receipt. H-DF.1(a) asks for genuine differentiation *at claim grain* and **this stage does not
answer it** — it hands the exam a measured starting point and an explicit caution: an
argmax-per-body reading of this surface would score it as one corner today.

**THE DEFENCE BOOK IS BITING**: `usage.pressOfferedArmed` **1086** offers,
`usage.pressDeclinedByBookArmed` **278** — `pressDeclinedByBookShare` **0.255985267035**
[0.224841341795, 0.287234042553]. **A quarter of every press the shipped geometry offered was
declined by the team's own learned book**, decline-only. `pressOfferedPerDefenderMinute`
**1.51178968583** [1.27281794737, 1.75754739423] armed vs **0** shut (structurally — the
election does not run with the door shut, which is `gLedgerZeroWhenShut` GREEN).

### §R2 ⚠ THE READING↔PHYSICAL GRADIENT — a LABELLED HYPOTHESIS, not a finding

`usage.byDefendingAttrTercile`, the body's own `attrs.defending` joined **in the instrument**
(no tercile, threshold or statistic lives in `src/**`):

| tercile | n | `defendingAttr` range | `shares` = [press, hold, jump, take] |
|---|---:|---|---|
| 0 | 136 | 0.102543868497 – 0.346829336882 | `[0.00183917441504, 0.773611253023, 0.0817751438984, 0.142774428664]` |
| 1 | 137 | 0.351101882197 – 0.528061392857 | `[0.00311383178231, 0.752910371183, 0.0774565655851, 0.16651923145]` |
| 2 | 137 | 0.529395691399 – 0.922207100922 | `[0.00506629298265, 0.739894362402, 0.0735151449822, 0.181524199634]` |

All four shares move **monotonically** with the body's own defending attribute: press ×2.75
and take up, hold and jump down. ⚠ **NO INTERVAL WAS FROZEN FOR THIS FACE AND NONE IS
COMPUTED** — per the adjudication discipline (#144(a)) this is registered as a **HYPOTHESIS**
for the exam's 范戴克/佩佩 axis (M-DF.3), never as a finding. It is also **not** the axis the
doctrine names: `defending` is one attribute, not a reading-vs-physical decomposition.

### §R3 ⭐ THE FIRST RECEIPT ORDERED — `multiChaseShare3`, re-measured

| arm | value | 95 % cluster CI | numerator / denominator |
|---|---:|---|---|
| shut | **0.131001635625** | [0.105112527151, 0.16227137832] | 69120 / 527627 |
| armed | **0.127483581104** | [0.100066759772, 0.158697654974] | 66056 / 518153 |

**THE ANSWER, AS FAR AS THIS INSTRUMENT CAN GIVE ONE:** at this stack (both arms on the
DF-T1-banked world) and this grain, `multiChaseShare3` sits **lower** armed, and the two
intervals overlap almost completely — the arms are **NOT resolved apart** on this face. #324's
graze-zero-**upward** does not reproduce here **in sign**; the surface does not push the face
further up. ⚠ This is a DIFFERENT COMPARISON from #324's (that one was persistence-on vs
persistence-off, scored with a paired rule; this one is surface-on vs surface-off with no
paired test frozen). The two must never be quoted as the same estimand. The face stays
**UNRESOLVED**, and the exam owns it.

Companions: `multiChaseShare2` 0.393090194399 → 0.389701497434 · `swarmStanceShare2`
0.0815962117102 → 0.0799818095418 · `swarmZoneShare3` 0.31406797218 → 0.309012963256 — every
one inside its own half-width.

### §R4 THE CHURN / COVERAGE FAMILY (DF-T0 grain; shut → armed)

| face | shut [95 % CI] | armed [95 % CI] | unit (verbatim) |
|---|---|---|---|
| `markSwitchesPerDefenderMinute` | **6.2444320861** [5.70993647458, 6.75426537996] | **6.81419015852** [6.24991300232, 7.34177820305] | switches per defender-minute |
| `markSwitchesPerDefenderMatch` | 24.9777283444 [22.8397458983, 27.0170615199] | 27.2567606341 [24.9996520093, 29.3671128122] | switches per defender-match (the 240 s match clock — the dual axis) |
| `markHeldShare` | 0.667314338838 [0.637329921838, 0.696224375497] | 0.660293556952 [0.632797885059, 0.686778701013] | share of defender body-ticks |
| `dupMarkShare` | 0.27493606966 [0.245090827648, 0.304782592893] | 0.25423910265 [0.222605605753, 0.285235967661] | share of ≥2-marker team-ticks with two mark targets within 4 m |
| `reTargetLatencyMeanS` | 1.0067317641 [0.934849271225, 1.0853342966] | 1.02766826496 [0.947137852963, 1.11413857678] | sim-seconds |

Stored latency bins (canon: a percentile face requires stored bins) — `latencyBins.shut` =
`[4635, 931, 576, 327, 258, 314, 192, 499]`, `latencyBins.armed` =
`[4492, 862, 572, 345, 235, 320, 153, 529]`; `shutMedianS` 0.5 · `shutP90S` 3 ·
`armedMedianS` 0.5 · `armedP90S` 3.

**THE ARMING RECEIPT, in one line**: the surface **adds switching on top of the persistence
law** (`markSwitchesPerDefenderMinute` 6.2444320861 → 6.81419015852) while coverage and
double-marking barely move — and **every one of these intervals overlaps**, so nothing here is
resolved. That is exactly what the seam's own algebra predicts: giving a holder a priced
reason to leave (options 0 and 2) necessarily buys back some of the churn DF-T0 removed. The
exam owns whether that trade is worth anything.

Companions, same run: `markAbandonsPerDefenderMinute` 13.9294656096 → 13.9596933421 ·
`markStartsPerDefenderMinute` 14.304679292 → 14.3411209424 ·
`chaseStartsPerDefenderMinute` 10.0321731278 → 9.89345239154 ·
`chaseAbandonsPerDefenderMinute` 9.87469293264 → 9.74450073741 ·
`goalsPerMatch` 3.12195121951 → 2.82926829268.
⚠ The last one is a **receipt of the walk, not a finding** — the exam owns football.

### §R5 ⭐ THE INTERCEPTION FACE (the mandate's own), with its estimand disclosed

| face | shut [95 % CI] | armed [95 % CI] |
|---|---|---|
| `interceptionsPerTeamMatch` | **14.0731707317** [13.0243902439, 15.1219512195] | **13.8170731707** [12.9512195122, 14.6219512195] |
| `tacklesPerTeamMatch` | 1.09756097561 [0.90243902439, 1.30487804878] | 1.39024390244 [1.12195121951, 1.68292682927] |
| `interceptionShareOfDefensiveEvents` | **0.927652733119** [0.913043478261, 0.941220798794] | **0.908580593424** [0.88996763754, 0.925746569814] |
| `tacklesPlusInterceptionsPerMatch` | 30.3414634146 [28.243902439, 32.487804878] | 30.4146341463 [28.7073170732, 32.0487804878] |

⚠⚠ **THE ESTIMAND DISCLOSURE, pre-registered at §P7(5) and repeated here**: these are
`team.stats.interceptions` / `team.stats.tackles` read at the whistle of **single friendlies
with random genomes**, and they are **NOT** DF-C0 §R4's ladder estimand (evolved league play
across generations, where the mix was 11.5 interceptions vs 6.0 tackles per team-match). The
two numbers must never be quoted as the same thing, and the mandate's 「阅读 vs 接触」 verdict
lives at the LADDER grain, which only the exam runs.

### §R6 THE CAP AND THE SWARM BAND (M-DF.2's own receipt)

`chaserBins.shut` = `[76898, 278156, 132948, 39625, 0]` (527,627 defending team-ticks)
`chaserBins.armed` = `[67667, 280722, 131733, 38031, 0]` (518,153 defending team-ticks)

**THE FOUR-CHASER BIN IS EXACTLY ZERO IN BOTH ARMS** (`gCapIntactBothArms` GREEN), and
`capSource.sha256` = `capSource.shaOfRecord` =
`5b4a21d036e9d97027a360f166621d747374ec5c42ead20b9ed132919872703c` over the 128-line
`assignChasers` slice (`gCapSliceShaIdentical` GREEN) — **the cap's own function is byte
material this stage never touched**, and the compensator binds armed exactly as it binds shut.
⚠ The bins are not bit-identical between arms and cannot be: arming the door produces a
DIFFERENT WORLD, so every trajectory and every denominator differs (DF-T0 §R2's disclosure,
inherited verbatim).

`swarmBins.armedStance` = `[111776, 68278, 13721, 1799, 133, 0]` ·
`swarmBins.shutStance` = `[123293, 62895, 14170, 2035, 260, 77]` ·
`swarmBins.armedZone` = `[24469, 44175, 66587, 41601, 16297, 2578]` ·
`swarmBins.shutZone` = `[26583, 41188, 71288, 41511, 18855, 3305]`.

### §R7 THE ANCHORED EXTRACTIONS (line receipts; the numbers are REPORTED, never asserted)

| id | file | value | line no. AT THIS COMMIT | matches |
|---|---|---:|---|---:|
| `markStanceBand` | `src/ai/actionExecutor.ts` | 2.6 | 297 | 1 |
| `zonalEngageRadius9` | `src/ai/TeamBrain.ts` | 9 | 733 | 1 |
| `markRange22` | `src/ai/TeamBrain.ts` | 22 | 748 | 1 |
| `containRadius8` | `src/ai/PlayerBrain.ts` | 8 | 1868 | 1 |
| `containTerritory35` | `src/ai/PlayerBrain.ts` | 35 | 1868 | 1 |

Each line matched EXACTLY ONCE (`gAnchorsResolveOnce` GREEN). The last two are THIS stage's
new extractions — the shipped Phase-29.1 contain branch, the executable form of PRESS.

### §R8 PERF, against the anchor (DF-C0 §R5's, re-hashed as bytes)

`anchorFile` `docs/perf/baseline.json` · `anchorSha256`
`192ed9481524eea3186e4acbf62b77cf0ed8b16741413cd8da8518d66647bd3a` · `anchorHead` `c07a19b` ·
`anchorUsPerStep` 5.32 · `anchorTeamBrainUsPerStep` 0.21 · `budgetUsPerStep` **0.106**.
Measured: `shutWallUsPerStep` **8.05742491147** · `armedWallUsPerStep` **7.32833338946** ·
`deltaWallUsPerStep` **−0.729091522012**.

⚠ **HONESTLY LABELLED** (`perf.budgetNote`, verbatim in the artifact): this is a **WALL**
measurement with the instrument INSIDE the timer, so it is an **upper bound**, never the
engine's own profiler number; the budget is a **BUDGET, not a self-measured share**; and the
negative sign is **NOT published as a speed-up** — the honest reading is **"no measurable cost
against the 0.106 µs/step budget"**. The flip-oracle lesson is respected: instrument cost must
never masquerade as seam cost, in either direction.

### §R9 SEEDS AND STATS

**BOOKED = WALKED**: `12,512,000–039` + `12,512,999` = 41 seeds, 82 walks
(`gSeedsBookedEqualWalked` and `gArmsPairedPerSeed` GREEN). The pin suite walks
`12,512,800/801/802` (the smoke prefix, in band). **Block 12,512,000–999 CONSUMED WHOLE.**
**STATS: NONE CONSUMED** — the CIs are bootstrap resamples of the walked seeds, not a
registry-consuming statistic (the IN-T0 precedent). The next stats base remains ≥ **115,200**
on the 59-entry registry.

### §R10 MUTANTS (run live on an UNCOMMITTED tree, restored from `/tmp` byte copies)

| mutant | edit (verbatim) | result |
|---|---|---|
| **M1 THE PRESS ELECTION** | `if (dist(p.pos, carrier.pos) < bestMarkPriceM) vacated.add(p.index);` → `if (false && dist(p.pos, carrier.pos) < bestMarkPriceM) vacated.add(p.index);` | **2 pins die** — the press pricing law and the book-decline law |
| **M2 THE BOOK VETO** | `if (book !== null && book.declinesLunge(arrivalGroup(len(p.vel)))) {` → `if (false && book !== null && book.declinesLunge(arrivalGroup(len(p.vel)))) {` | **1 pin dies** — the decline-only law (**ACCOUNT 2 is load-bearing**) |
| **M3 THE ARRIVAL GROUP** | `book.declinesLunge(arrivalGroup(len(p.vel)))` → `book.declinesLunge(arrivalGroup(0))` | **1 pin dies** — the same pin, through its reckless/controlled limb (**ACCOUNT 3 is load-bearing**) |
| **M4 THE PRICED GREEDY** | `const priceM = d - slackMetres(threat, p);` → `const priceM = d - 0 * slackMetres(threat, p);` | **1 pin dies** — the faster-body-outbids-nearer-body law (**ACCOUNT 1 is load-bearing**) |
| **M5 DEATH CONDITION (8)** | `team.marks.delete(idx);` → `if (false) team.marks.delete(idx);` | **1 pin dies** — the surface's own death condition |

**6 pin deaths across 5 mutants**, each reverted by byte-copy restore (`cmp`-verified), never
by `git checkout`. After the last restore: `git diff --stat HEAD -- src` empty,
`git status --porcelain -- src` empty, `npm run fingerprint` =
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

⚠ **DISCLOSED**: M5's first run killed **zero** pins. The reason was diagnostic, not
cosmetic — the press fixture's man sat 15 m out, so DF-T0's death condition **(7)** (the
account's 9 m ceiling) had already killed the assignment before **(8)** could fire, and the
pin was passing for the wrong reason. A second fixture was added **inside** the ceiling (the
man drifts 4 m → 6 m while the carrier stays 5 m away) so condition (8) is the only killer.
The pin suite therefore changed AFTER the freeze commit; the **src did not**, and the battery
of record ran at `fe277b5` against source byte-identical to the tree that carries these pins.

### §R11 DEVIATIONS (honest)

1. ⚠⚠ **THE BODY-GRAIN DEGENERACY (§R1)** — 407 of 410 bodies are HOLD-modal. Reported, not
   patched, not tuned away. Any exam that reads this surface by per-body argmax will score it
   as one corner; the aggregate distribution is non-degenerate and both readings are the
   receipt.
2. ⚠ **「drop to cover」 SHIPS AS A NAMED GAP, not as an option** (§P2(a)) — no action
   primitive, no cover-fact producer outside the dormant snapshot-shaped module M-DF.4 puts
   out of scope. The surface therefore prices **four** options of which one (PRESS) is a
   different doctrine clause from the one named-out; the doctrine's four-way phrasing is NOT
   satisfied in full and this stage does not pretend it is.
3. ⚠ **「sit on a lane」 ships at ASSIGNMENT grain only** — choosing the man you reach before
   the ball. The standing lane-sit (occupying a lane while marking nobody) has no primitive
   and is named out with the cover drop.
4. ⚠ **PRESS is an OFFER, not an act** — the surface vacates the ledger slot and the shipped
   contain branch decides. Its 「ONE container only」 rule is another live compensator this
   slice does not touch; two compensators never move in one slice, and there are more than two
   here.
5. ⚠ **The press election's alternative price omits the two creation RULES** (WG width, zonal
   zone) — pre-registered in §P2(b) as a conservatism that can only make pressing less likely.
6. ⚠ **The interception faces are friendly-match statistics, not the ladder's** (§R5) — the
   mandate's verdict needs the ladder, which only the exam runs.
7. ⚠ **No paired between-arm test exists** — none was pre-registered, none was invented; every
   comparison is read as interval overlap.
8. ⚠ **DF-T2 is the SECOND reader of the L3 defence book** (`declinesLunge`). The read is
   pure: `l3DefenceDeclines`'s veto counter — the lunge seam's own receipt — is deliberately
   NOT incremented, and the surface keeps its own count (`pressDeclinedByBook`). Disclosed for
   ratification, since L3-T0's prose calls its own site "THE ONE CONSUMPTION SITE".
9. ⚠ **Two full-suite contention flakes** — `careers` and `formationEvolution` timed out at
   180 s inside a 151-file parallel run and **both pass green when re-run in isolation**
   (12/12, 158 s). The same class DF-C0 §R7 item 3 and DF-T0 §R7 item 4 disclosed.
10. **`PROGRAMME.md` / the rulings file are NOT edited by this session** (executor iron rule:
    governance files are the commander's). The queue's status line, the frontier update (next
    sim block ≥ **12,513,000**) and the ruling are the commander's to write.

## §COMMANDER CORRECTIONS OF RECORD (ruling #327, 2026-08-20 — frozen bytes stand)

1. **(verify MED 1) THE PRESS ELECTION'S CANDIDATE-SIDE SLACK TERM IS UNPINNED — a real
   mutation-coverage gap the verifier found with its own mutant.** Neutralising
   `- slackMetres(threat, p)` at TeamBrain.ts:696 (the press election's best-marking-
   alternative price) kills ZERO of the 20 pins, though it is a real behaviour change
   (marking alternatives price cheaper ⇒ press strictly more likely). Compounding it,
   §R10's M4 verbatim edit matches BOTH sites as a substring (:696 election, :743 greedy
   — same line, different indentation), so "ACCOUNT 1 load-bearing" is PROVEN AT THE
   GREEDY ONLY. ORDERED: the DF exam's commit 1 adds the disambiguated pin (a fixture
   whose vacate decision flips on the :696 slack term) and re-records M4 site-anchored
   to :743. Until then the mutant table's account-1 row carries this asterisk.
2. **(verify MED 2, author-disclosed) THE BODY-GRAIN DEGENERACY IS RATIFIED AS
   RED-LEFT-RED**: 407/410 bodies HOLD-modal, zero press/jump-modal. Correct handling —
   reported loudly, not tuned away. H-DF.1(a)'s differentiation-at-claim-grain is NOT
   answered by this stage; the exam inherits the caution AND the tercile gradient
   (press .0018→.0051, take .143→.182 across defending terciles — a labelled hypothesis
   for the 范戴克/佩佩 axis, no interval frozen).
3. **(verify LOW 1) PRESS NUMBERS ARE ELECTION SHARES, NOT ACT SHARES** — the counter
   increments on the ABSENCE of an assignment; whether Phase-29.1's contain branch (its
   own goal-side test and ONE-container rule, untouched) licenses the body is never
   measured. The usage tables of record read as ELECTION shares. ORDERED: the DF exam
   gains a face joining vacations to realised contains (the press REALISATION rate).
4. **(verify LOW 2) SEAM-MAP COUNT CORRECTED OF RECORD**: TeamBrain.ts carries
   `match.dfSurface` ×5 + `match.dfSurfaceLedger` ×2 — §SEAM's "×7" was substring
   double-counting (the suite's own pin and the per-file line totals 11/7/1 are right).
5. **(verify LOW 3–5) THE MECHANISM OF RECORD IS: TWO PRICED ELECTIONS + ONE DERIVED
   LABEL** — press-vs-mark and hold-vs-switch are chosen; jump-vs-take is the account's
   own sign labelling the outcome (actionExecutor.ts:78's `slack <= 0` branch). The exam
   phrases H-DF.1(a) on that mechanism, never as "four choosable acts". The
   `ledger.idle` docblock's "no option was affordable" also absorbs NOT-LEGAL exclusions
   (WG width discipline, the zonal zone gate) — the one-word docblock fix ("affordable
   or legal") rides the DF exam's commit 1, with the dead `d` recompute (:750-752) as an
   optional tidy on the same commit.
6. **(§R11 item 8) THE SECOND READER OF THE DEFENCE BOOK IS RATIFIED.** The book is a
   learned ACCOUNT, readable by any priced chooser; L3-T0's "THE ONE CONSUMPTION SITE"
   sentence described its own seam's receipt integrity (the veto counter), which the
   pure read preserves by keeping its own `pressDeclinedByBook` count. That L3-T0
   sentence is HISTORICAL as of this stage — superseded here of record, its doc's frozen
   bytes stand. M5's zero-kill first run (§R10) is likewise ratified as the mutant
   discipline WORKING — a pin passing for the wrong reason was caught before it could
   certify anything.
