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
