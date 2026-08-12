# EK-C0 — THE OBSERVABLE HOLD-OUTCOME CENSUS (持球被罚：这个世界自己的真相)

Status: **FROZEN, then RUN.** Everything from §TRACE to §NON-CLAIMS — the world, the hold
population, the label, the index, the window, the estimator, the seed ledger, the N rule, the
⭐ #246 shape predicates and the gate list — is the design fixed **in the probe's own frozen
constants and gate predicates before any receipt ran**, and every clause below is machine-checkable
against the committed artifact rather than a promise about it. The measured numbers live in
[§RESULT](#result), **GENERATED PROGRAMMATICALLY** from the artifact by a committed generator
(`scripts/analysis/ek-c0-census-result.ts`), never typed (#229.2).

⚠ **This document reports; it does not adjudicate (#203).** The #246 shape flags are mechanical CI
readings printed exactly as the artifact records them. What an inversion *means* — deliberate arcade
trade-off or substrate defect — is the commander's.

Authority chain: the **EK-HOLD EARNED-BELIEF CONTRACT**
[`EK-HOLD-EARNED-BELIEF-CONTRACT.md`](EK-HOLD-EARNED-BELIEF-CONTRACT.md) **§2 M-EK.1** (THE
OBSERVABLE HOLD LABEL) and **§3 EK-C0**, bound by ruling **#259.2** and dispatched by **#259.3**.
Form precedents: [`DV-T2-C0-PASS-LEVEL-CENSUS.md`](DV-T2-C0-PASS-LEVEL-CENSUS.md) (**THE CENSUS
FORM** — its N rule, its full-accounting table, its event-rate moments, its yardstick schema) and
[`DV-C0-LOSS-COST-CENSUS.md`](DV-C0-LOSS-COST-CENSUS.md) (**THE WALKER** — its loss-tick semantics,
its window family, its estimator). World sources:
[`C5-T2-WHETHER-SEAT.md`](C5-T2-WHETHER-SEAT.md) (the seat, its eligibility, its exam
configuration), [`C5-RECENSUS.md`](C5-RECENSUS.md) (the certified table), and
[`C5-T0-HOLD-MECHANICS.md`](C5-T0-HOLD-MECHANICS.md) (the hold machinery). Hygiene canon: **#250.3**
(mode-conditioned literals) · **#251.3 / #252.3** (derive your own predicates; a mutant per
conjunct) · **#256.3** (per-cluster cells stored; liveness claims scoped) · **#258.3** (timings in
the UNHASHED envelope) · **#163** · **#181.2** · **#20** · **#128** · **#203** · **#229.2**.

> ⭐ **INSTRUMENT-ONLY ROUND.** `src/**` is **byte-untouched** (`xSrcUntouched` is a HARD gate). No
> production or a4 world arms the seat; the arming happens inside this probe's own matches and
> nowhere else. **Nothing measured here reaches any player** (#247) — this table is the yardstick
> EK-T1's learned books will be scored against, and the sizing source EK-T1's run length comes from.

---

## §TRACE — where the world, the window and the loss semantics come from

Three things had to be *traced*, not re-typed. Each trace is a gate.

### (a) THE WORLD — the canonical whetherEye-ARMED world

The C5-T2 seat's own committed **exam configuration** lives in
[`scripts/probes/c5-t2-whether-seat.ts`](../../scripts/probes/c5-t2-whether-seat.ts) (the fork
stage). This census reconstructs it exactly:

| item | value | how it is proved |
|---|---|---|
| flags | `edsPerceivedDefence` `edsPerceivedChoice` `edsValueAxis` `c5Hold` `c6Carry` `c7Windup` armed, `c5TouchFork` off | **G-CONFIG-IDENTITY** reads the exam probe's own `CENSUS_FLAGS` block out of its SOURCE and compares flag by flag |
| duration / grid | 240 s · per-match cap **80** · moment spacing **30** ticks · support window **6–30 m** | the same source read, constant by constant |
| squad derivation | `teamA: team('A', seed*2+1)`, `teamB: team('B', seed*2+2)` | the same source read |
| certified table | `docs/world-model/data/c5-recensus.json`, tableSha `184d1e84…c0b20b53`, INJECTED (never bundled in `src`) | the SHA is asserted in both probes and re-checked against the artifact at run time |
| arm | `neutral` (C5-T2 §1.1: v1 admits no other) | the seat's own type admits nothing else |
| scope | `both` teams | ⚠ **DECLARED RECONSTRUCTION** — see below |
| live arming | `match.whetherEye` **set**, so the seat's D-HOLD takes actually happen in the trajectory | ⚠ **DECLARED RECONSTRUCTION** — see below |

⚠ **THE TWO DECLARED RECONSTRUCTIONS, and why the G-REPRO idiom lands where it does.** The C5-T2
fork stage was **written but never run for real** (its own header says the real run is deferred to a
commander ceiling sign-off, #44.5) — so it has **no committed artifact whose rows could be
re-walked**, and it never armed the live seam at all: it classified decisions on pristine clones.
Two facts therefore cannot come from it and are **declared here ex ante**: the **scope** (`both`,
which is the seat doc §5.4's R3 deployment rung — the rung its own adoption battery binds on) and
the **live arming** itself, which the contract §3 explicitly requires (*"holds must actually
occur"*). Everything else is proved against the committed source (**G-CONFIG-IDENTITY**), and the
family's *measurement* machinery is proved by re-walking the one C5-T2 artifact that **does** exist:

⭐⭐ **G-REPRO65** re-walks the **#65 sizing smoke's own committed block** (8,500,000–8,500,047) in
the **#65 configuration** (`whetherEye` null on the live match, every decision classified on a
pristine clone) with **this probe's walker**, and must reproduce
[`c5-t2-whether-sizing.json`](data/c5-t2-whether-sizing.json)'s committed integers: the qualifying
and eligible counts, all four coverage exclusions, all four decision-class counts, the D-HOLD takes,
the perceived-vs-true agreement counts and **the whole perceived-cell mix** — i.e. the very band
placement this census indexes by. Nothing about the eligibility predicate or the band placement is
asserted in prose.

### (b) THE INDEX — the seat's OWN perceived pressure band

M-EK.1: *"indexed by the PERCEIVED pressure band b at the decision (the seat's own band placement —
the book indexes what the chooser reads)"*. Every band in this census is the band
`whetherEyeDecision` itself placed from the body's own snapshot (`src/ai/whetherEye.ts:112-172`);
the probe **never** recomputes a truth-side band for the table. **G-BAND-TRACE** proves the cuts are
the certified table's own `parameters.pressureBands`, that the seat's band function and percept pull
are the shipped ones, and sweeps the cut rule over 2,001 samples. (The perceived-vs-true agreement
is published only inside the G-REPRO65 receipt — where #65 published it.)

### (c) ⭐⭐ W AND THE LOSS SEMANTICS — a DECLARED FALLBACK, traced

M-EK.1 says W and the loss semantics are traced from the C5 census family's own committed
definitions, *"with the fallback DECLARED ex ante"* if C5 has no outcome window of its own. **It has
none**, and this is the load-bearing reading of this stage's frozen half:

* C5-RECENSUS's **240-tick horizon** is a **shot-for** axis (`mean(shot_holdk − shot_actnow)`), not
  a possession-loss window.
* C5-T0's **hold survival** is a **SAME-BODY retention** read — and C5-T0 §6.3 warns explicitly that
  in the untouched arm the man usually **passes**, *"and a completed pass counts as not-survived"*,
  so retention is not team possession.

⇒ **The fallback fires, as the contract authorises**: the loss semantics are **DV-C0's own**, and W
is the **#218 / DV-C0 10 s family**.

```text
LOSS (a possession loss)  a TEAM-level turnover at DV-C0 / #215.3-H1 semantics: a possession segment
                          is a maximal interval of same-owner-TEAM control while phase === 'playing',
                          suspended while the ball is loose in play, ended by an OPPONENT
                          ESTABLISHING OWNERSHIP — stamped at the tick control is established.
                          A dead ball is NOT a loss (DV-C0's own turnover definition).
PUNISHED @ W              the FIRST such turnover with the HOLDING TEAM as loser is stamped within
                          W sim-seconds of the decision instant.
PRIMARY W                 10 s — DV-C0's committed primary, itself the #218 census's co-occurrence
                          window.   LADDER (sensitivity): 5 / 15 / 20 s — DV-C0's own ladder.
⭐ C5-NATIVE ROW           4 s — the re-census's OWN 240-tick fork horizon (read from its committed
                          `parameters.horizon`, divided by the engine's DT). Published as a REPORTED
                          sensitivity row, never the primary; it is not a member of the #218 family.
```

⭐⭐ **NONE OF THIS IS RE-TYPED**: **G-REPRO-DVC0** re-walks **DV-C0's own committed smoke block**
(12,429,000–12,429,011) in bare production with this probe's segment walker and must reproduce its
tick partition, its span ordering, its turnover total, its goal counts and its per-third turnover
cells. **G-WINDOW-TRACE** reads the primary window and the ladder off DV-C0's committed artifact and
the family off the goal-genealogy census's, and re-derives the C5-native row from the certified
table's own horizon. The loss semantics are **theirs**, proved rather than promised.

---

## §FORM

### The measured population — ⭐⭐ TWO, and which one is primary

**(i) THE DOSED CENSUS — PRIMARY.** At every eligible decision moment whose perceived cell the seat
could place, the hold is **DOSED** on a paired clone of the pre-decision state through the C5
forced-hold machinery (`Match.forcedHold`, the same physical hold the seam commits — the C5-T2 fork
probe's own words), for **k = 30 ticks**, the seat's own least commitment and a member of the
certified ladder. The label then closes on that clone.

**(ii) THE SEAT'S OWN TAKES (D-HOLD) — published beside it.** The holds the armed seat actually took
in the live trajectory, read off `Match.whetherHoldState` (public state), indexed by the seat's own
`cellAtDecision`, labelled on the live world.

⚠ **WHY THE PRIMARY IS DOSED — a deviation from the contract §3's letter, declared before any
receipt ran.** §3 asks for *"every HOLD the seat takes"*. R-B (#64.1) licenses a take **only** where
the certified cost interval reaches zero, and in the certified table **exactly one (cell, k) does**:
`0|0|0` at k30. That is C5-T2 §0.1's claim, and it is re-derived from the committed table rather
than quoted:

```text
$ node -e "const t=JSON.parse(require('fs').readFileSync('docs/world-model/data/c5-recensus.json','utf8')).build.table.cells;
           const rz=t.flatMap(c=>c.costs.filter(k=>k.reachesZero).map(k=>[c.pressureBand+'|'+c.staleBand+'|'+c.supportBand,k.holdTicks]));
           console.log('cells',t.length,'reachesZero rows',rz.length,JSON.stringify(rz));"
  cells 27 reachesZero rows 1 [["0|0|0",30]]
```

So a take-only census would carry **one pressure
band** and could not be the **three-band yardstick** M-EK.2's belief needs — the belief has a weight
per band, and a yardstick with two empty cells cannot score it. The dosed census is the C5-RECENSUS
treatment idiom (that census priced **every** cell by forcing the hold), and it is what makes
P(punished | held, b) measurable at every b. The two populations are **never merged**; the take
table is published in full so the seat's own realised risk is visible beside the world's.

### The world — ONE arm, the armed exam world

`new Match({ seed, teamA, teamB, duration: 240, ...CENSUS_FLAGS })` with `whetherEye` armed
(§TRACE (a)). ⭐ **This is a CENSUS, not a contrast**: one arm, no A/B predicate, no pairing across
arms. (The two *fork receipts* below are paired by construction, but they gate the instrument, not
a finding.)

### The three outcome classes — a full accounting

For a dosed hold by team *T* at the decision instant, at window W:

* **PUNISHED** ⇔ the first turnover with *T* as loser is stamped within W.
* **LOST-BUT-UNPUNISHED** ⇔ *T* loses it inside the longest published window but **after** W.
* **NO-LOSS-IN-WINDOW** ⇔ no such turnover inside the longest window at all.

The three **partition** every dosed hold at every window — `gAccounting` checks that, with the
denominator **tied to the independently incremented dose counter** and every class **non-negative**
(the algebraic restatement alone is a tautology, and its mutant is what proved it dead).

**Published cross-cuts.** ⭐ The **SAME-CHAIN** share: the fraction of punishments where the chain
that was live at the decision is itself the one that ended in the loss (the mechanical rule counts
the first loss by *T* even if a dead ball and a regain intervened — a RULE, not a truth, so its
narrower reading is published beside every cell). **CENSORED** counts: a window truncated by full
time, which can only *lose* punishments, never manufacture them.

### The estimator

Cluster bootstrap by **match seed** (#20) — the set grain — 2,000 resamples, percentile 95 % CI,
**ratio-of-sums** per band (the right estimator for a rate whose denominator is itself random).
⭐ **ONE SHARED resample-index matrix**, so every band rate *and* every band **difference** (the
#246 predicates) is computed on the **same** resampled clusters — the differences are paired by
construction. Stats stream base **108,200** (ruling #259.3's floor), disjoint from the match RNG
(#163). ⭐ **Per-cluster cells are STORED** in the artifact (`census.clusterCells`: per seed × side ×
band, the moment count, the punished count at every window, the same-chain and censored counts, the
lost count and the live-take counts), so every CI in this document **re-derives without a re-run**
(#256.3).

### ⭐ The event-rate moments — what EK-T1 sizes its run length from

Frozen as a **deliverable of this stage**, at the grain EK-T1's arithmetic needs: **per perceived
band, per team, per match** — mean, **SD**, CV, min / p10 / median / p90 / max, and the share of
team-matches with zero. **TWO families are published, because they bracket what a book can see**:

* **CENSUS MOMENTS** — eligible moments whose cell was placed, i.e. every moment at which a hold
  *could* be booked. ⚠ These are **GRID-LIMITED**: the C5-T2 exam grid samples at spacing 30 ticks
  with a cap of 80 per match, so this is a count *at the census grid*, not the world's full decision
  rate.
* **LIVE D-HOLD TAKES** — the holds the armed seat actually took, counted off the live world with
  **no grid**.

Beside them: punished holds per band per team per match, and a **run-length K grid** (matches a team
must play to hold K = 10/20/30/50/100 events in each band, at each of the two rates). ⚠ The K grid is
a **REPORTING GRID** — EK-T1 freezes its own K, ex ante, from these moments.

### The E-class mix (context for EK-T1)

The four mutually exclusive decision classes (`D-HOLD · E-ACTNOW-DECLINED · E-ABSTAIN-UNSEEN ·
E-NOCELL`, `whetherEye.ts:72-76`) as shares of eligible moments, with the four coverage exclusions
(`X-FIRSTTOUCH · X-MUSTKICK · X-A0-SHOOT · X-A0-CLEAR`) beside them. Only the first two classes
place a cell, so only they enter the band table — the other two carry **no band and no label**, by
the seat's own honesty rule (perceiving nobody is not perceiving no pressure).

## §SHAPE — the ⭐ #246 reality-shape check, PRE-REGISTERED

Real football's structure, cited as a **SHAPE ONLY** (VISION §3 — 常数永不进口; no real-football
number appears anywhere in this probe): *the tighter you are pressed, the more it costs to dwell on
the ball.*

1. **SHAPE-1** `P(punished | pressed) > P(punished | mid)`
2. **SHAPE-2** `P(punished | mid) > P(punished | free)`
3. **SHAPE-3 (THE GRADIENT)** both together — hold risk rises with perceived pressure.

Each is resolved by the **paired cluster-bootstrap CI of the difference** excluding zero:
`RESOLVED-CONFIRM` · `RESOLVED-INVERT` · `UNRESOLVED`. Evaluated at **every** window; the **primary**
window's reading is the one the yardstick freezes.

⚠⚠ **AN INVERSION IS A FINDING, NOT AN ERROR.** Per #246 it is **PUBLISHED** and routed to the
**街机偏离 test** (deliberate arcade trade-off vs substrate defect) and is **NEVER** silently
corrected into the table. **MAGNITUDES are OUR world's and are supposed to be**; only the **SHAPE**
is the fidelity check. It matters twice over here: H-EK predicts a team's own book grows *this*
shape, so an inverted truth would make the claim a prediction about a different shape — a
commander's call, not a probe's.

## §YARDSTICK — the convergence schema EK-T1 may not re-cut

The artifact carries `result.census.yardstick`, schema **`ek-c0.hold-truth-table.v1`**, frozen
**now**, before any hold account book exists (#247):

```
{ schema, frame, index, windowS, holdTicks, bandCuts,
  bands{p0|p1|p2 → {punishRate, ci95, holds, punished, lost, punishGivenLost, punishGivenLostCi95}},
  relative{band → punishRate / mean(finite band rates)},   ordering[ranked bands],
  bandsWithNoData[], baselinePunishRateAllBands }
```

**EK-T1 compares a learned belief vector against `bands` (absolute), `relative` (scale-free — the
shape only) and `ordering` (the rank vector), and against nothing else.** Freezing the schema here is
what stops EK-T1 from re-cutting the yardstick after seeing beliefs. ⭐ Because the index is the
**seat's own perceived band**, this table is **commensurable with the belief the seam will read** —
the #256.2/#257.2 rule applied at the source.

## §SEEDS — fresh, strictly above everything the programme has consumed (#163)

Band **12,448,000–12,448,999** (ruling #259.3's pre-registration), opened above DV-T2-T1's
consumption through 12,447,999.

| block | seeds | kind |
|---|---|---|
| smoke | 12,448,000–12,448,011 | reserved, walked in smoke mode |
| ⭐ exit-semantics **guard block** | 12,448,050–12,448,099 | reserved — where EVERY non-census invocation is routed |
| census + reserve | 12,448,100–12,448,899 (N ≤ 800) | reserved, walked in full mode |
| G-WORLD construction seed | 12,448,999 | constructed, **never stepped** |
| ⭐⭐ **G-REPRO65 re-walk** | 8,500,000–8,500,047 | **receipt** — the C5-T2 sizing smoke's own block |
| ⭐⭐ **G-REPRO-DVC0 re-walk** | 12,429,000–12,429,011 | **receipt** — DV-C0's own smoke block |

⭐ **THE RE-WALKS' PREDICATE IS INVERTED**: each *must* collide with the consumed ledger, because a
re-walk that came back clash-free would prove it is walking fresh seeds instead of reproducing a
receipt. Every other block carries the ordinary predicate (collision-free), and the sub-blocks are
ordered and disjoint. The ledger is the **COMPLETE** #163-regime list carried forward from
DV-T2-C0's committed probe and extended with DV-T2-C0's own band (12,436,*), DV-T2-T0's
(12,437,*) and **DV-T2-T1's (12,438,000–12,447,999)** — the last is itself a gate conjunct.

**Stats stream:** base **108,200**, minimum gap to any published base **400** (the #163 floor is
200); the published ledger is DV-T2-C0's complete list plus its own 107,400 and DV-T2-T1's 107,800.

## §NRULE — DV-C0 / DV-T2-C0's rule form, with this census's own numerator

Holds are plentiful; the scarce quantity is the **numerator** — a **PUNISHED HOLD in the rarest
perceived pressure band** at the primary window — and it is the numerator that sets that cell's CI
width. So the rule targets the **rarest band**, exactly as its parents target the rarest zone:

```
N* = min( ceil(60 / rarestBandPunishedPerMatch) ↑25,
          floor(0.5 h / (ms/match × 1 arm × 2 X-DET)),
          800 )
```

60 events ⇒ a count's relative SE ≈ `1/sqrt(60)` ≈ 13 %, the precision at which a rate **ORDERING**
(the #246 check) is readable — DV-C0's own target, inherited with its own justification.
`rarestBandPunishedPerMatch` and `ms/match` are the **only two numbers** a full run reads out of the
committed smoke artifact; they feed **only** N — no rate, CI, ordering or shape verdict is read from
the smoke anywhere. The 800 cap is the reserved seed room, an honest **seed-budget** cap.

⭐ **THE ZERO-EVENT CLAUSE (frozen with the rest of the rule, before the smoke ran):** if the smoke
sees **zero** punished holds in the rarest band, the precision term is **UNBOUNDED** — it cannot be
estimated from a zero count and this stage will not invent a floor for it — so the wall term and the
seed-budget cap bind. That is the `min()` doing its job, and the artifact records
`precisionTermUnbounded` either way.

⭐ **THE RAREST-BAND TARGET, DECLARED.** The rarest band is expected to be the **free** band
(perceived pressure below the first cut): the C5-T2 sizing smoke's *committed* perceived-cell mix
carries **9 of 820** placed cells in a band-0 cell (≈ 1.1 %). This is stated here, from a committed
artifact, so that a thin `p0` cell in §RESULT is read as the frozen rule's own outcome and not as a
surprise — and it is why the zero-event clause was written before the smoke ran.

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

| gate | what it proves |
|---|---|
| **xDet** (×2) | the whole measured core computed twice (two independent walks; pass B **never** resumes from the checkpoint), canonical-JSON digests identical |
| **xSrcUntouched** | `git diff --stat -- src` empty — instrument-only, HARD |
| **xFpProd** | the shipped league fingerprint re-derived in this process, unchanged |
| ⭐⭐ **gConfigIdentity** | the armed world **is** C5-T2's committed exam configuration, checked against the exam probe's own **SOURCE**, conjunct by conjunct (flags, duration, grid, support window, squad derivation, table SHA and path) — with the two declared reconstructions named in the gate's own note |
| ⭐⭐ **gRepro65** | the eligibility predicate and the band placement **are** the C5-T2 family's: the #65 sizing smoke's committed block re-walked in the #65 configuration, its integer rows reproduced |
| ⭐⭐ **gReproDvc0** | the loss-tick semantics **are** DV-C0's: its committed smoke block re-walked, its accounting and per-third turnover rows reproduced |
| **gWindowTrace** | the primary window **is** DV-C0's committed primary, **is** a member of the #218 family, the ladder **is** DV-C0's and integer multiples of the family minimum, and the C5-native row **is** the certified table's own horizon ÷ DT — all read from artifacts, never typed |
| ⭐ **gBandTrace** | the index is the SEAT's own perceived band at the certified table's own cuts; the shipped band rule and percept pull are present; the cut rule swept over 2,001 samples |
| ⭐ **gArmed** | the world really is armed and holds really do occur: the seat is null by default and on a fresh match, arming sticks, the seat's OWN takes are non-zero, and the DOSE **bites** (its 240-tick signature differs from the untouched continuation) while an **undosed twin reproduces that continuation bit-identically** — the C5-T2 X5 / X-CONTROL receipts, sampled 1-in-25 |
| ⭐⭐ **gAccounting** | DV-C0's tick identities (partition, ordered spans, closed turnover ledger) **+ this census's**: every qualifying moment in exactly one of {eligible · the four exclusions}; every eligible moment in exactly one decision class; the dosed population **is** the placed-cell population; the three outcome classes partition the dosed holds at **every** window, with the denominator tied to the independent dose counter and every class non-negative; punished ⊆ lost; punished and censored **monotone** in the window while lost and the moment count are **invariant** in it |
| **gWorld** | the arm is the exam world and nothing else moved, read back on a freshly constructed, never-stepped match |
| **gSeedDisjoint** | every block machine-checked against the COMPLETE ledger; the two re-walks' predicates **inverted**; the DV-T2-T1 block's presence is itself a conjunct |
| **gStatsDisjoint** | stats base 108,200 ≥ the #259.3 floor, min gap ≥ 200 to the published ledger |
| ⭐ **gCleanInvocation** | any `EKC0_N` / `_CAP` / `_SKIP_FP` routes the run onto the **guard block**, turns this gate RED and exits 1 — the census block stays VIRGIN; a preflight can never write a canonical repo path (guarded at parse time **and** on the RESOLVED absolute path) |
| **gNDerived** | the N run **is** the frozen §NRULE output |
| ⭐ **gValuesUnreachable** | none of the published band rates appears in `src/**`, searched in BOTH the raw 5-dp form **and the formatted percentage form the tables print**; degenerate cells excluded by a declared floor, a non-vacuity floor on the search-set size, and a control needle that must be found |
| ⭐⭐ **gMutants** | **#251.3 / #252.3 discharged at source**: every conjunct of every composite gate above carries its OWN mutant, and each mutant must flip exactly that conjunct to false. ⚠ The liveness claim is **SCOPED** — the artifact lists the gates the mutants cover, and the single-predicate gates (stats/clean-invocation/N-derived/src/fingerprint) print their evidence in full instead |

⭐ **THE HEADLINE COUNT, HAND-CHECKED against this frozen list (#250.3(i), the standing check):**
the table above has **17** rows — `xDet · xSrcUntouched · xFpProd · gConfigIdentity · gRepro65 ·
gReproDvc0 · gWindowTrace · gBandTrace · gArmed · gAccounting · gWorld · gSeedDisjoint ·
gStatsDisjoint · gCleanInvocation · gNDerived · gValuesUnreachable · gMutants` — and the artifact's
`gates` object carries exactly those **17** keys, which is the number every headline in this
document quotes.

**No gate reads a rate.** The #246 shape flags are mechanical CI readings, not gates: an inversion
turns nothing red.

## §CHECKPOINT — how a torn-down battery is resumed

Pass A appends one JSON line per walked match to `/tmp/ek-c0-checkpoint.<mode>.jsonl` (outside the
repo, so a kill leaves no repo state). `EKC0_RESUME=1` lets pass A re-use those rows; **pass B never
resumes**, so **X-DET is itself the checkpoint's integrity proof** — a stale or corrupt line cannot
survive the digest comparison. `EKC0_RESUME` is therefore *not* a preflight trigger and does not
route the run onto the guard block; the artifact's unhashed envelope records whether it was set.

## §NON-CLAIMS

1. **NOTHING SHIPS.** Zero `src/**` bytes; the production fingerprint re-derived unchanged; the seat
   is armed only inside this probe's own matches, and no production or a4 world arms it.
2. ⭐⭐ **THE TABLE IS WIRED INTO NO PLAYER (#247).** It is instrument-side truth: it yardsticks
   EK-T1's learned books and sizes EK-T1's run length. No chooser reads it.
3. **NO PASS/FAIL ON ANY MEASURED RATE.** The gates are the X-family, the two inheritance receipts,
   the trace gates, the accounting identities and the mutant-liveness proof.
4. **THE RATE IS A CONDITIONAL RATE, NOT A CAUSAL EFFECT.** Bands are not randomly assigned: a body
   under heavy perceived pressure is in a different state from a free one, and that state is part of
   the price. **No counterfactual is claimed** — the counterfactual is precisely the quantity the
   contract §0 says a team cannot observe, and replacing it is why this census exists.
5. ⭐ **THE DOSED HOLD IS A TREATMENT, NOT A CHOICE.** The primary population holds at moments the
   seat itself would mostly DECLINE. That is what makes the three-band table measurable; it is also
   why the seat's own takes are published separately and never merged into it.
6. **THE WINDOW LADDER AND THE RUN-LENGTH K GRID ARE REPORTING GRIDS.** No window is privileged
   beyond the pre-registered primary; EK-T1 freezes its own K.
7. **THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203).** EK-T0 (the dormant belief seam)
   and EK-T1 (the convergence exam) are the contract's.

---
## §RESULT

**583 seeds × 1 arm (the whetherEye-ARMED exam world), block 12,448,100–12,448,682, 17/17 gates PASS**, `resultSha256` `8157577e…3921`. Every number below is printed by `scripts/analysis/ek-c0-census-result.ts` from the committed artifact; none is typed (#229.2).

### The run

```text
world            the whetherEye-ARMED C5-T2 exam world (CENSUS_FLAGS + the certified table
                 184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53 injected, arm neutral, scope BOTH)
matches          583   (241.7357 sim-seconds each)
eligible moments 34,778   (59.6535 per match, the C5-T2 grid)
dosed holds      11,269   (19.3293 per match — the census population)
live D-HOLD      2,391   (4.1012 per match — the seat's OWN takes)
turnovers        25,662   (44.0172 per match, DV-C0 semantics)
primary window   10 s   (DV-C0's own, the #218 family — the DECLARED FALLBACK)
estimator        cluster bootstrap by match seed, 2,000 resamples, stats base 108,200
```

### ⭐⭐ THE HOLD-OUTCOME TABLE — P(punished | held, perceived pressure band) (PRIMARY WINDOW)

A full accounting: every dosed hold is in exactly one of the three outcome classes.

| perceived band | holds | lost | punished | **P(punished)** | CI 95 % (pp) | P(punished \| lost) | same-chain share |
|---|---:|---:|---:|---:|---:|---:|---:|
| **free** (band 0) | 272 | 245 | 216 | **79.412 %** | [74.131, 84.039] | 88.163 % | 88.889 % |
| mid (band 1) | 2,319 | 2,047 | 1,611 | **69.470 %** | [67.312, 71.765] | 78.701 % | 71.695 % |
| ⭐ **pressed** (band 2) | 8,678 | 7,859 | 6,494 | **74.833 %** | [73.753, 75.902] | 82.631 % | 77.487 % |
| **ALL BANDS** | 11,269 | 10,151 | 8,321 | **73.840 %** | [72.855, 74.870] | — | — |

The complement accounting, as shares of the holds in each band (they sum to 1 with `P(punished)` by construction — G-ACCOUNTING checks the partition, its denominator tied to the independent dose counter):

| perceived band | punished | lost-but-unpunished | no-loss-in-window | censored by full time |
|---|---:|---:|---:|---:|
| **free** (band 0) | 79.412 % | 10.662 % | 9.926 % | 0 |
| mid (band 1) | 69.470 % | 18.801 % | 11.729 % | 0 |
| ⭐ **pressed** (band 2) | 74.833 % | 15.729 % | 9.438 % | 1 |

### ⭐ THE #246 REALITY-SHAPE CHECK — pre-registered, evaluated with CIs

EXPECTED: higher perceived pressure ⇒ higher hold risk. An inversion is published and routed to the 街机偏离 test, never corrected into the table.

| window | pressed − mid (pp) | CI 95 % | verdict | mid − free (pp) | CI 95 % | verdict | ⭐ GRADIENT |
|---|---:|---:|---|---:|---:|---|---|
| 5 s | 7.000 | [4.334, 9.580] | RESOLVED-CONFIRM | -4.737 | [-12.139, 2.951] | UNRESOLVED | UNRESOLVED |
| 10 s **(PRIMARY)** | 5.363 | [2.928, 7.611] | RESOLVED-CONFIRM | -9.942 | [-15.129, -4.384] | RESOLVED-INVERT | INVERSION-PRESENT |
| 15 s | 2.357 | [0.393, 4.205] | RESOLVED-CONFIRM | -4.341 | [-8.355, -0.068] | RESOLVED-INVERT | INVERSION-PRESENT |
| 20 s | 2.280 | [0.668, 3.869] | RESOLVED-CONFIRM | -1.803 | [-5.321, 1.656] | UNRESOLVED | UNRESOLVED |
| 4 s *(C5-native, REPORTED)* | 7.721 | [5.253, 10.298] | RESOLVED-CONFIRM | -2.595 | [-10.081, 4.547] | UNRESOLVED | UNRESOLVED |

Routing recorded in the artifact at the primary window: *⚠ AN INVERSION IS PRESENT AT THIS WINDOW — ROUTED to the 街机偏离 test (#246). It is PUBLISHED as measured and is NEVER corrected into the table.*

### THE WINDOW LADDER — the label's window-dependence, made visible

| window | free | mid | pressed | all bands |
|---|---:|---:|---:|---:|
| 5 s | 55.147 % | 50.410 % | 57.410 % | 55.914 % |
| 10 s **(PRIMARY)** | 79.412 % | 69.470 % | 74.833 % | 73.840 % |
| 15 s | 87.868 % | 83.527 % | 85.884 % | 85.447 % |
| 20 s | 90.074 % | 88.271 % | 90.551 % | 90.070 % |
| 4 s *(C5-native)* | 45.588 % | 42.993 % | 50.714 % | 49.002 % |

Holds and their denominators do not move with the window — the same population sits under every row (G-ACCOUNTING checks that invariance explicitly); only the punished numerator grows.

### ⭐ THE SEAT'S OWN TAKES (D-HOLD) — the charter's literal population

| perceived band | takes | punished | P(punished) |
|---|---:|---:|---:|
| **free** (band 0) | 2,391 | 1,879 | 78.586 % |
| mid (band 1) | 0 | 0 | n/a |
| ⭐ **pressed** (band 2) | 0 | 0 | n/a |

Perceived-cell mix of the takes: `{"0|0|0":2391}` — R-B (#64.1) licenses a take ONLY where the certified interval reaches zero, and in the certified table that is the single cell `0|0|0`, so the takes are confined to one band by construction. That is why the dosed census, not this table, carries the three-band shape.

### ⭐ THE EVENT-RATE MOMENTS — what EK-T1 sizes its run length from

Per perceived band, **per team per match**. TWO families, because they bracket what a book can see: CENSUS MOMENTS are grid-limited (the C5-T2 spacing/cap); LIVE D-HOLD TAKES are ungridded.

| perceived band | census moments/team/match | SD | CV | median | p90 | zero-share | live D-HOLD takes/team/match | punished/team/match |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **free** (band 0) | 0.2333 | 0.6874 | 2.9469 | 0.0 | 1.0 | 83.619 % | 2.0506 | 0.1852 |
| mid (band 1) | 1.9889 | 2.4405 | 1.2271 | 1.0 | 6.0 | 36.021 % | 0.0000 | 1.3816 |
| ⭐ **pressed** (band 2) | 7.4425 | 6.4570 | 0.8676 | 6.0 | 16.0 | 8.919 % | 0.0000 | 5.5695 |

All bands together: **9.6647** census moments per team per match (SD 7.6264), and **2.0506** live D-HOLD takes per team per match (zero-share 43.053 %).

⭐ **THE RUN-LENGTH K GRID** — matches a single team must play for its book to hold K events in each band, at the measured mean rates. ⚠ A REPORTING GRID: EK-T1 freezes its own K ex ante from these moments, and the dispersion column above is why a mean alone is not enough.

| perceived band | at the census-moment rate: K=10 / 20 / 30 / 50 / 100 | at the live D-HOLD rate: K=10 / 20 / 30 / 50 / 100 |
|---|---|---|
| **free** (band 0) | 43 / 86 / 129 / 215 / 429 | 5 / 10 / 15 / 25 / 49 |
| mid (band 1) | 6 / 11 / 16 / 26 / 51 | — / — / — / — / — |
| ⭐ **pressed** (band 2) | 2 / 3 / 5 / 7 / 14 | — / — / — / — / — |

### THE E-CLASS MIX (context for EK-T1)

| class | count | share of eligible |
|---|---:|---:|
| `D-HOLD` | 223 | 0.641 % |
| `E-ACTNOW-DECLINED` | 11,046 | 31.761 % |
| `E-ABSTAIN-UNSEEN` | 23,412 | 67.318 % |
| `E-NOCELL` | 97 | 0.279 % |

### ⭐ THE CONVERGENCE YARDSTICK — the schema EK-T1 may not re-cut

```json
{
  "schema": "ek-c0.hold-truth-table.v1",
  "frozenBy": "EK-C0, before any hold account book exists (#247/#259.2). EK-T1 MAY NOT RE-CUT THIS SHAPE: a belief is scored against `bands` (absolute), `relative` (scale-free) and `ordering` (the rank vector), and against nothing else.",
  "frame": "the HOLDING team's own possession — \"did I lose it after holding on\".",
  "index": "the SEAT'S OWN perceived pressure band at the decision instant (M-EK.1: the book indexes what the chooser reads — the #256.2/#257.2 commensurability rule at the source).",
  "windowS": 10,
  "holdTicks": 30,
  "bandCuts": [
    0.15,
    0.45
  ],
  "bands": {
    "p0": {
      "punishRate": 0.79412,
      "ci95": [
        0.74131,
        0.84039
      ],
      "holds": 272,
      "punished": 216,
      "lost": 245,
      "punishGivenLost": 0.88163,
      "punishGivenLostCi95": [
        0.83495,
        0.92223
      ]
    },
    "p1": {
      "punishRate": 0.6947,
      "ci95": [
        0.67312,
        0.71765
      ],
      "holds": 2319,
      "punished": 1611,
      "lost": 2047,
      "punishGivenLost": 0.78701,
      "punishGivenLostCi95": [
        0.7681,
        0.80666
      ]
    },
    "p2": {
      "punishRate": 0.74833,
      "ci95": [
        0.73753,
        0.75902
      ],
      "holds": 8678,
      "punished": 6494,
      "lost": 7859,
      "punishGivenLost": 0.82631,
      "punishGivenLostCi95": [
        0.8169,
        0.83534
      ]
    }
  },
  "relative": {
    "p0": 1.06491,
    "p1": 0.93159,
    "p2": 1.0035
  },
  "ordering": [
    "p0",
    "p2",
    "p1"
  ],
  "bandsWithNoData": [],
  "baselinePunishRateAllBands": 0.7384
}
```

### Gate table

| gate | result | evidence |
|---|---|---|
| `xDet` | **PASS** | digest `07e588be…1b26` twice (two independent walks; pass B never resumes) |
| `xSrcUntouched` | **PASS** | `git diff --stat -- src` empty |
| `xFpProd` | **PASS** | observed `57b0bdab…c673` = baseline, re-derived in-process |
| `gConfigIdentity` | **PASS** | 20 conjuncts against the committed exam probe's SOURCE |
| `gRepro65` | **PASS** | 36 integer fields, **0 mismatches**, block 8500000..8500047 — the #65 sizing smoke's own rows |
| `gReproDvc0` | **PASS** | 12 integer fields, **0 mismatches**, block 12429000..12429011 — DV-C0's own smoke rows |
| `gWindowTrace` | **PASS** | primary 10 s = DV-C0's committed primary · family `[5,10]` · ladder `[5,10,15,20]` · C5-native row = 240 ticks ÷ 60 = 4 s |
| `gBandTrace` | **PASS** | cuts `[0.15,0.45]` from the committed table · 2,001 swept samples, 0 disagreements |
| `gArmed` | **PASS** | live takes 2,391 · dosed 11,269 · dose bites 97.452 % of 157 sampled · fork control 157 checked, 0 unexplained |
| `gAccounting` | **PASS** | ticks · spans · turnover ledger · eligibility partition · class partition · dose tie · non-negativity · punished ⊆ lost · monotone in the window · lost and moments invariant |
| `gWorld` | **PASS** | read back on a never-stepped match at seed 12,448,999 |
| `gSeedDisjoint` | **PASS** | 6 blocks machine-checked (2 re-walks, predicates INVERTED) · ledger 71 entries |
| `gStatsDisjoint` | **PASS** | base 108,200, minGap 400 ≥ 200 |
| `gCleanInvocation` | **PASS** | envN null · capped false · skipFp false · routedToGuardBlock false |
| `gNDerived` | **PASS** | ran N 583 = derived N* 583 (binding term: wall (precision term UNBOUNDED — the zero-event clause)) |
| `gValuesUnreachable` | **PASS** | 140 src files scanned · 14 needles (raw 5-dp + formatted %) · 0 hits · control needle found true |
| `gMutants` | **PASS** | **75 conjuncts, 0 dead** — ⚠ coverage SCOPED to 11 gates: gAccounting, gConfigIdentity, gRepro65, gReproDvc0, gWindowTrace, gBandTrace, gArmed, gWorld, gSeedDisjoint, gValuesUnreachable, xDet |

### THE ACCOUNTING IDENTITIES (gate input — ticks, moments, holds and losses, not football)

```text
ticks         8,801,479 = segment 7,478,742 + loose 0 + deadBall 1,322,737   ⇒ ok
no overlap    assignedTicksSum 7,478,742 = segmentTicks 7,478,742 · spanOrderViolations 0
turnovers     walked 25,662 = ledgered 25,662
eligibility   qualifying 46,611 = eligible 34,778 + firstTouch 8,110 + mustKick 2,211 + A0-shoot 1,471 + A0-clear 41
classes       D-HOLD 223 · E-ACTNOW-DECLINED 11,046 · E-ABSTAIN-UNSEEN 23,412 · E-NOCELL 97
dose tie      dosed forks 11,269 = D-HOLD + E-ACTNOW-DECLINED (the moments whose cell was placed)
  @ 5 s      punished  6,301 + lost-unpunished  3,850 + no-loss  1,118 = 11,269   (lost 10,151 INVARIANT · censored 1)
  @10 s      punished  8,321 + lost-unpunished  1,830 + no-loss  1,118 = 11,269   (lost 10,151 INVARIANT · censored 1)
  @15 s      punished  9,629 + lost-unpunished    522 + no-loss  1,118 = 11,269   (lost 10,151 INVARIANT · censored 1)
  @20 s      punished 10,150 + lost-unpunished      1 + no-loss  1,118 = 11,269   (lost 10,151 INVARIANT · censored 1)
  @ 4 s      punished  5,522 + lost-unpunished  4,629 + no-loss  1,118 = 11,269   (lost 10,151 INVARIANT · censored 1)
receipts      dose-bite 153/157 sampled · fork-control unexplained 0/157
```

### THE N RULE AS EXECUTED (in-probe, from the committed smoke)

```text
rule            N* = min( ceil(60 / rarestBandEventsPerMatch) ↑25, floor(0.5 h / (ms/match × 1 arm × 2 X-DET)), 800 ) — DV-C0 / DV-T2-C0 §NRULE's form, inherited, with THIS census's own numerator: the rarest-band event is a PUNISHED HOLD in the RAREST of the three PERCEIVED pressure bands at the PRIMARY window, i.e. the scarcest numerator the published table contains. Frozen in the stage doc §NRULE BEFORE the smoke ran.
smoke artifact  docs/world-model/data/ek-c0-hold-outcome-census-smoke.json  (sha256 2f28e5c1…c19f)
rarest-band events/match 0.00000  · precision term unbounded: true
wall term 583 · cap 800   ⇒ N* 583  (wall (precision term UNBOUNDED — the zero-event clause); projected 0.4995 h)
as executed     N 583 · ms/match (from the smoke's UNHASHED envelope) 1542.2 · rarest band at battery p0 with 272 holds and 216 punished
```

### Deviations recorded

1. ⭐⭐ THE PRIMARY POPULATION IS DOSED, NOT SEAT-TAKEN. The contract §3 asks for "every HOLD the seat takes"; the certified table licenses a take in exactly ONE cell (0|0|0, k30 — the only reaches-zero row), so a take-only census would carry ONE band and could not be the three-band yardstick M-EK.2's belief needs. The dosed census (the C5-RECENSUS treatment idiom) is therefore the primary table and the seat's own takes are published beside it. Declared in the stage doc §FORM BEFORE any receipt ran.
2. ⭐ THE WINDOW IS A DECLARED FALLBACK (see frozenDesign.windows.fallbackDeclaration).
3. THE CENSUS GRID IS THE EXAM GRID: eligible moments are sampled at the C5-T2 spacing/cap (30 ticks / 80 per match), so the per-team-per-match moment counts are GRID-LIMITED. The live D-HOLD counts are NOT gridded, and both are published.
4. A WINDOW TRUNCATED BY FULL TIME IS CENSORED, NOT PUNISHED. Censored counts are published per window; censoring can only LOSE punishments, never manufacture them.
5. THE FORK RECEIPTS ARE SAMPLED, not exhaustive (1-in-25, on a 240-tick horizon), so the dose-bite and fork-control claims are scoped to that sample.

### Registered non-claims (from the artifact)

1. NOTHING SHIPS: zero src/** bytes; the production fingerprint re-derived unchanged; the seat is armed only inside this probe's own matches and no production or a4 world arms it.
2. ⭐⭐ THE TABLE IS WIRED INTO NO PLAYER (#247). It is instrument-side truth: it yardsticks EK-T1's books and sizes EK-T1's run length.
3. NO PASS/FAIL ON ANY MEASURED RATE. The gates are the X-family, the two inheritance receipts, the trace gates, the accounting identities and the mutant-liveness proof. The #246 shape flags are MECHANICAL CI readings, not gates: an inversion turns nothing red and is ROUTED.
4. THE RATE IS A CONDITIONAL RATE, NOT A CAUSAL EFFECT: bands are not randomly assigned, and the state that put a body in a band is part of the price. No counterfactual is claimed — that is exactly the quantity the contract §0 says a team cannot observe.
5. ⭐ THE DOSED HOLD IS A TREATMENT, NOT A CHOICE. The primary population holds at moments the seat itself would mostly DECLINE; that is what makes the three-band table measurable, and it is why the seat's own takes are published separately and never merged into it.
6. THE WINDOW LADDER AND THE RUN-LENGTH K GRID ARE REPORTING GRIDS. EK-T1 freezes its own K.
7. THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203). EK-T0 / EK-T1 are the contract's.

**VERDICT (the probe's own, mechanical):** EK-C0 HOLD-OUTCOME CENSUS at N=583 × 1 arm (the whetherEye-ARMED world) — 17/17 gates. THE TABLE IS DESCRIPTIVE TRUTH: the #246 shape flags are mechanical and the commander adjudicates them (#203).

### §CHECKS (#226.1)

```text
$ npx tsc --noEmit
(clean)

$ EKC0_MODE=smoke EKC0_CAP=2 EKC0_SKIP_FP=1 EKC0_OUT=/tmp/ekc0-guard.json \
    npx tsx scripts/probes/ek-c0-hold-outcome-census.ts
  seeds 12448050..12448051            ← routed onto the exit-semantics GUARD block
  GATES *** RED ***: … gCleanInvocation FAIL … (gArmed and gValuesUnreachable also red — at two
  matches the 1-in-25 fork receipts never fire and the needle set is degenerate, which is what a
  two-match preflight looks like)
  exit 1                              ← the census block stays VIRGIN

$ EKC0_MODE=smoke EKC0_CAP=2 EKC0_OUT=docs/world-model/../world-model/data/x.json \
    npx tsx scripts/probes/ek-c0-hold-outcome-census.ts
  EK-C0 FATAL — a PREFLIGHT invocation may not write a canonical repo path
  exit 2 · no file written (the traversal spelling is RESOLVED, not substring-tested)

$ EKC0_MODE=smoke npx tsx scripts/probes/ek-c0-hold-outcome-census.ts
  GATES GREEN (17) · G-REPRO65 36 fields 0 mismatches · G-REPRO-DVC0 12 fields 0 mismatches
  G-MUTANTS 75 conjuncts · 0 dead
  exit 0 · resultSha256 027063ffc33961b8722d42176e0e04080f52c2d534c94919c05508132d74f87e
  wall 108.8 s (CONTEXT ONLY) · artifact docs/world-model/data/ek-c0-hold-outcome-census-smoke.json

$ EKC0_MODE=full EKC0_RESUME=1 npx tsx scripts/probes/ek-c0-hold-outcome-census.ts
  GATES GREEN (17) · N* 583 (the wall term binds; the zero-event clause fired) ·
  block 12,448,100–12,448,682
  exit 0 · resultSha256 8157577e8dd0a9f13c969b22f7caf5986775b99a1353193f0c23d018043b3921
  wall 1,762.2 s (CONTEXT ONLY) · artifact docs/world-model/data/ek-c0-hold-outcome-census.json

$ npx tsx scripts/analysis/ek-c0-census-result.ts \
    docs/world-model/data/ek-c0-hold-outcome-census.json
  → the whole §RESULT section above, on stdout
```

⭐ Six commands were run in this round and all six are transcribed above; the `resultSha256` in the
§RESULT header is the one the generator read out of the committed artifact, so the two are the same
string or this document would not build. `npm test` is **not** re-run and is named rather than
implied: this round adds **one probe, one generator, two artifacts and one doc**, touches **no**
`tests/**` file and **no** `src/**` byte (`xSrcUntouched` is a HARD gate and PASSES on the run that
wrote the artifact), so the suite's state is the one banked at the previous commit.

### Facts that are *not* deviations, recorded anyway

1. ⚠⚠ **THE #246 CHECK SPLITS, AND THE SPLIT IS THE STAGE'S BIGGEST NUMBER.** `pressed − mid` is
   **RESOLVED-CONFIRM at every published window** (+5.363 pp at the primary, +7.0 / +2.4 / +2.3 /
   +7.7 pp across the ladder) — the expected direction. But `mid − free` is **RESOLVED-INVERT at the
   primary window** (−9.942 pp, CI [−15.129, −4.384]) and again at 15 s, so the **free band is the
   MOST punished band** (79.412 %) and the ordering is `free > pressed > mid`, not monotone in
   pressure. Per #246 this is **PUBLISHED as measured and ROUTED to the 街机偏离 test**; it is not
   corrected into the table and this document does not adjudicate it (#203).
2. ⭐ **A CANDIDATE MECHANISM FOR THE INVERSION — NAMED AS AN UNTESTED HYPOTHESIS, WITH ITS PROBE.**
   Band 0 is *"I perceive no opponent near me"*, and the seat's percept is honest, so a body who
   places himself in band 0 is disproportionately a body who **has not seen** the man about to rob
   him: the C5-T2 sizing smoke's *committed* M-CTX puts perceived-vs-true **pressure** agreement at
   **82.4 %**, i.e. roughly one placement in six is wrong on this very feature. If that is the
   cause, the label indexed by TRUE pressure would be monotone while the label indexed by PERCEIVED
   pressure is not — and *the perceived index is the right one for a book* (M-EK.1), so the
   inversion would be a fact about **what a chooser can know**, not about the world's physics. ⚠
   **This census does not compute the truth-indexed cross-cut** (its instrument is frozen on the
   perceived index), so the hypothesis is **labelled, not tested**; the probe that would settle it
   is a one-flag extension the commander can order.
3. ⭐ **THE SEAT TAKES ITS HOLDS IN EXACTLY THE BAND THIS LABEL PUNISHES MOST**: all 2,391 live
   D-HOLD takes sit in cell `0|0|0` (band 0, by R-B's construction) and **78.586 %** of them end in
   a possession loss inside 10 s. ⚠ **THIS IS NOT A CONTRADICTION OF THE CERTIFIED TABLE.** The
   certified quantity is a **counterfactual** value differential on the **shot-for** axis at 240
   ticks (hold-k vs act-now); this one is an **observable possession-loss hazard** at 10 s. They are
   different quantities on different axes — which is precisely the split the contract §0 was written
   around. Reported; the commander adjudicates what it means.
4. ⚠ **THE PRIMARY WINDOW IS NEAR-SATURATING FOR THIS LABEL.** 73.840 % of all dosed holds are
   punished at 10 s, and by 20 s the label has swallowed essentially every loss (90.070 %, with just
   **1** lost-but-unpunished hold left). The reason is in the same artifact: this world turns the
   ball over every **5.492** sim-seconds on average (44.017 turnovers per 241.7 s match), so a 10 s
   window is roughly two possessions long. The discriminating rows are the short ones (4 s: 49.002 %
   overall, and the widest `pressed − mid` gap of the whole ladder). The primary was frozen **ex
   ante** from DV-C0's committed family, not chosen after sight, and the ladder is published so the
   saturation is visible rather than hidden. Whether EK-T0's belief should learn on a shorter window
   is the commander's question, not this stage's.
5. **THE N RULE'S ZERO-EVENT CLAUSE FIRED, AND THE BATTERY CAME IN *OVER* TARGET.** The smoke saw
   **0** punished holds in the rarest band (12 matches, zero band-0 census moments), so the
   precision term was UNBOUNDED and the **wall term bound** at N* = **583** (projected 0.4995 h
   against the rule's 0.5 h budget). At battery grain the rarest band (p0) carries **272** holds and
   **216** punished events against the rule's target of **60** — the opposite of DV-T2-C0's
   shortfall, and it is recorded for the same reason: the N that ran is the frozen rule's own output
   (`gNDerived`), whichever way the realised rate went.
6. **THE GRID AND THE LIVE WORLD DISAGREE ABOUT HOW OFTEN THE SEAT HOLDS, STRUCTURALLY.** At the
   census grid `D-HOLD` is **0.641 %** of eligible moments (223 of 34,778); the live armed world
   takes **2,391** holds (**4.1012** per match, **2.0506** per team per match). Two structural
   causes, both declared: the grid samples ≤ 80 moments per match spaced 30 ticks while the seat
   decides at its own cadence, and **this world is ARMED** while #65's committed 0.141 % was
   measured on an unarmed one. ⇒ **EK-T1 should size its run length from the LIVE column**, and the
   K grid publishes both.
7. **BAND 0 IS RARE ON THE GRID AND COMMON IN THE LIVE TAKES.** 83.619 % of team-matches carry zero
   band-0 *census moments*, but only 43.053 % carry zero band-0 *live takes* — the same asymmetry as
   fact 6, at the grain EK-T1 will actually book.
8. **THE WALL IS CONTEXT ONLY (#128 / #258.3).** 1,762.2 s for 583 × 2 passes plus the two re-walk
   blocks, the fingerprint, the mutant battery and the gates; it enters no rate and no gate, and it
   lives **outside** `resultSha256` in the artifact's `envelopeUnhashed`.
9. **THE CHECKPOINT WAS ARMED AND UNUSED.** The full run wrote 583 checkpoint lines to
   `/tmp/ek-c0-checkpoint.full.jsonl` and resumed from none of them (the run was not torn down);
   pass B walked the block fresh and produced the identical digest, which is the integrity proof the
   §CHECKPOINT section describes.

### Disposition

The census is run, twice-deterministic and **gate-green on 17/17 at 583 seeds**, with **G-REPRO65**
reproducing the C5-T2 family's committed sizing rows on **36 integer fields, 0 mismatches**,
**G-REPRO-DVC0** reproducing DV-C0's committed smoke rows on **12 integer fields, 0 mismatches** —
so the eligibility predicate, the band placement and the loss semantics are all *theirs* rather than
asserted — and **G-MUTANTS** proving all **75** covered gate conjuncts live (#251.3 / #252.3
discharged at source, with the coverage set stated). **The `ek-c0.hold-truth-table.v1` yardstick is
frozen before any hold book exists**, the **event-rate moments** EK-T1 needs are published in both
the grid-limited and the ungridded form, and the **#246 shape check reads `free > pressed > mid`**:
the pressed−mid limb confirms at every window, the mid−free limb **INVERTS at the primary window**
and is routed to the 街机偏离 test. What that inversion *means* — an honest perception effect that a
book must learn as-is, an arcade deviation, or a substrate defect — and whether EK-T0's belief
should learn on a shorter window than the inherited 10 s, are the commander's (#203).
