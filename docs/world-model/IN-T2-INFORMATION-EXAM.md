# IN-T2 — THE INFORMATION EXAM (H-IN.1(a)+(b) scored on virgin seeds)

> **Ordered by** COMMANDER RULING #332 item 6. **Bound by**
> [`IN-SNAPSHOT-CONTRACT.md`](IN-SNAPSHOT-CONTRACT.md) §1 (H-IN.1 / H-IN.2), §2 (M-IN.1 the
> snapshot law · M-IN.2 scanning as an ACT · M-IN.3 no new knobs · M-IN.4 scope & debts) and
> **§4's own sentence**: *"an all-scanning world is a FAILURE mode (the look must cost real
> time, so situations must differentiate)"*.
> **The seams under examination**: [`IN-T0-SNAPSHOT-LAW.md`](IN-T0-SNAPSHOT-LAW.md) (the
> private book, armed at F2 on BOTH arms — the matched floor) and
> [`IN-T1-THE-LOOK.md`](IN-T1-THE-LOOK.md) (`inLookAct`, the priced look — the ONLY arm
> difference). **Their frozen bytes STAND**; every correction this stage carries lands HERE.
> **Measured mandate**: IN-T1 §R1 / ruling #329 item 2 — the book was **27.49 sim-seconds**
> old and the look buys it back to **0.95**; IN-T1 §R5's loudest world-level receipt is
> **goalsPerMatch 2.93 → 1.80**, and #332 item 6 orders it weighed **at ladder grain**.
> **Road B**: nothing ships. This stage is **INSTRUMENT-ONLY after commit 1** — `src/**` is
> UNTOUCHED and both doors stay dormant.

---

## §COMMIT 1 — THE RIDERS (#329 §CORR item 1; TESTS ONLY, zero src)

Result commit: `0ebbd86`. Three ordered pins, three mutants, three kills.

### §C1.1 ⭐⭐ THE ARGMAX `− loss` SELECTION PIN (verify MED 1)

IN-T1 §COMMANDER CORRECTIONS item 1 records the gap in its own words: neutralising the
argmax to `gain`-only left **31/31 pins green** while the armed world visibly moved. The
THRESHOLD was pinned (M1); the **SELECTION rule was not**.

THE FIXTURE (reader at the origin, facing `+x`, F2 ⇒ a 90° half-angle field):

| body | bearing | turn | remembered age | role in the fixture |
|---|---:|---:|---:|---|
| `B` | +150° | **25 ticks** | 29 (the cap) | candidate, walked FIRST in the roster |
| `A` | +100° | **17 ticks** | 29 (the cap) | candidate, walked SECOND |
| `L` | +30° | — (inside the heading field, never a candidate) | **0** | the whole of `B`'s loss |

`A`'s field (10°..190°) covers A, B **and** L; `B`'s field (60°..240°) covers A and B but
**not** L. L's age is **zero**, so he adds nothing to either gain — **the two gains are equal
at 58 body-ticks** — but he sits in the heading field, so he is `loss(B) = 25 × 1`. `A`
therefore wins on `− loss` alone, **from second place in the roster**.

⭐ **BOTH SIDES ARE ASSERTED** (M5's lesson, ratified #327 §CORR 6): a second fixture deletes
L from the book — **the only asymmetry** — and the very same geometry then elects **B** at the
**SAME gain of 58** with a loss of 0. The gains are shown equal, and the loss term is shown to
be the only thing that moved the election.

### §C1.2 THE TWO INERT-GUARD PINS (verify LOW)

* **THE WRITE-SIDE SENT-OFF GUARD** — the refresh pass neither cold-starts nor refreshes a
  sent-off body standing squarely inside the looked field, and his stale entry survives **to
  the byte**. The birth suite pinned the ELECTION side and then explicitly cleared `sentOff`
  before touching the refresh pass, so the WRITE side was inert. The pin also runs the
  sending-off **rescinded**, where the same call writes him and banks his 400 ticks.
* **THE DEGENERATE GUARD** — a body ON TOP of the reader is **FELT, not dropped**. Without
  the guard the field test divides by zero, `NaN >= dotMin` is false, and he vanishes from the
  book entirely.

### §C1.3 THE MUTANTS, RUN LIVE

On an UNCOMMITTED tree, restored from `/tmp` **byte copies** and `cmp`-verified after each —
**never `git checkout`**.

| mutant | edit (verbatim) | pins killed |
|---|---|---:|
| **M-SEL THE SELECTION TERM** | `    if (best === null \|\| gain - loss > best.gain - best.loss) {` → `    if (best === null \|\| gain > best.gain) {` | **1 — the new one** (33 pass) |
| **M-SO THE WRITE-SIDE SENT-OFF GUARD** | `    if (body === reader \|\| body.sentOff) continue;` → `    if (body === reader) continue;` | **1 — the new one** (33 pass) |
| **M-DG THE DEGENERATE GUARD** | `    if (!(d <= 1e-9 \|\| (ux * dx + uy * dy) / d >= dotMin)) continue;` → `    if (!((ux * dx + uy * dy) / d >= dotMin)) continue;` | **1 — the new one** (33 pass) |

**Each kills EXACTLY the pin that names it and no other** — which is what makes them
*specific* rather than merely present. `src/ai/inLookAct.ts` sha
`f0e09b5101d9c1f5156e14306a668d9dddda3d1e7201a124697f3a5b1bcf5c93` identical before and after
all three; `git diff --stat HEAD -- src` and `git status --porcelain -- src` both EMPTY at
commit time; **34/34 pins green** (31 + 3).

### §C1.4 THE FINGERPRINT, RE-VERIFIED AFTER COMMIT 1

`sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **unmoved**, as a
tests-only commit must leave it. Verified anyway, by hand, with `npm run fingerprint`.

---

## §PRE-REGISTRATION (frozen before the battery — THIS commit is the freeze commit)

### §P0 What this stage is, and is NOT

An **EXAM**. IN-T0 and IN-T1 published arming RECEIPTS and made no football claim (canon:
*receipts ≠ effect sizes*, homes ruling #289 item 1 + BU-T1 §CORR item 5). This stage scores
**two pre-registered hypotheses on virgin seeds with frozen CI rules**, and reports everything
else. **Every numeric rule below was frozen BEFORE a single battery walk and is NEVER re-cut
after sight** (canon **freeze-before-battery**, home ruling #266.3(c)).

⛔ **NAMED OUT, EXPLICITLY** (#332 item 6): **THE PASSIVE-vs-LOOK HALF-SPLIT COUNTERFACTUAL.**
A clean separation of the free passive refresh from the priced look needs a THIRD arm behind a
**sub-flag** — an `src/**` change this instrument-only stage may not make. The BODY-TICK
attribution is published instead, labelled as an attribution and never as a counterfactual.
It is a later slice **if the number matters**.

⛔ **ALSO OUT**: the receiver surface (IN-C0 §R4's blindest situation, still untouched); the
o2Look composition-discharge debt (IN-T1 §P2(d) ruled the look NEW; the debt STANDS on the
menu, unmoved); 默契 / shared snapshots (the six-source cluster); feints and leakage
(INFO slice 3); any nudge answering a ladder deviation (#320 item 3's frozen direction:
**deviations ROUTE TO SLICES, never to nudges**).

### §P1 ⭐⭐ THE SCORED CLAIMS (frozen before the battery, NEVER re-cut after sight)

> **H-IN.1** (contract §1, VERBATIM): *"with the snapshot law and the look armed and priced
> through EXISTING machinery, (a) LOOKS ARE GENUINELY TAKEN (usage > 0 at claim grain,
> distribution by situation reported, not one degenerate corner) at their derived time cost;
> AND (b) INFORMATION DIFFERENTIATES OUTCOMES: at matched situations, the carrier acting on a
> FRESH snapshot chooses/releases resolvedly better than the one acting on a STALE one (the
> user's 中场 story made measurable — 接球前观察 ⇒ 球到来时零处理传到应该传到的人).
> Capability + honest prices; NO usage promise beyond non-degeneracy."*

| conjunct | the rule (FROZEN) | kind |
|---|---|---|
| **(a1) USAGE NON-DEGENERACY BY SITUATION** | the three SITUATION look shares — **carrier / off-ball outfield / keeper**, src's OWN `inLookSituation` buckets read off the shipped ledger — are **PAIRWISE RESOLVED DISTINCT**: **all THREE** pairs of seed-clustered bootstrap intervals **DISJOINT** | CI (unpaired, within-arm) |
| **(a2) THE ALL-SCANNING GUARD** | the **DECLINE share of decisions** stays **RESOLVEDLY ABOVE ZERO**: the **lower edge** of its 95 % seed-clustered bootstrap interval **> 0** | CI (within-arm, one-sided read) |
| **(b) INFORMATION DIFFERENTIATES OUTCOMES** | the **STRATUM-STANDARDISED** flip-vs-truth share is **RESOLVEDLY LOWER armed**: the 95 % **PAIRED** seed-clustered bootstrap interval of *(standardised armed − shut)* lies **ENTIRELY BELOW ZERO** | CI (paired, between-arm, at matched strata) |

**H-IN.1(a) passes iff (a1) AND (a2). H-IN.1(b) passes iff its single conjunct passes.** The
verdict names which limb failed if either does.

⭐ **(a1)'s FORM IS #329 §CORR item 3, BINDING — BY SITUATION, NEVER PER-BODY.** IN-T1's
`gEveryBodyLooks` demanded every-BODY universality over a role whose geometry legitimately
declines, and the commander ratified it as a **MIS-PITCHED conjunct**: *a keeper who almost
never looks is footballing sense EMERGING from the price, not a defect.* The per-body spread
(`gidsThatLooked*`) is therefore **REPORTED beside the verdict and is not a conjunct of it**.

⚠⚠ **(a2) CARRIES #329 §CORR item 2's APPROXIMATION, NAMED IN THE PRE-REGISTRATION AS
ORDERED.** The slice's **SECOND REALITY APPROXIMATION of record** is *"sight before payment,
with an arrival refund"*: the looked field is served at TRUTH **instantly** and the turn is
paid **afterwards** (a physical sweep yields sight as it completes), and the ball-arrived
abort **refunds the unpaid balance** at exactly the payoff moment. Both halves are frozen §P3
law in IN-T1 and published faces here. ⭐ **THE DIRECTION OF THE APPROXIMATION IS
CHEAPENING** — it makes the look cost LESS than a physical sweep would — so this guard is
being re-checked against a **MORE PERMISSIVE** world than reality, and a PASS is therefore
conservative in the right direction. The refund's size (`abortedBallArrivedShare`) is
published beside the conjunct.

### §P2 ⭐⭐ H-IN.1(b)'s MATCHED DESIGN, PRE-REGISTERED BEFORE THE CODE

**(i) THE FRESHNESS MEASURE** — *the carrier's book age over the bodies his chooser reads AT
THE DECISION*, in TICKS: the mean, over **every other body on the pitch**, of that body's
entry age **when the carrier is reading him from MEMORY**, and **ZERO** otherwise (a body
inside his field, or one he has never seen — IN-T0's cold-start rule serves TRUTH — is at
truth and carries no age). Read out of the carrier's **REAL book** (`match.inSnapshotStore`),
which exists on **BOTH** arms because IN-T0's law is armed on both.
⭐ **THE FRESH/STALE CUT IS DERIVED, NOT CHOSEN**: FRESH iff the measure ≤
`IN_LOOK_AGE_CAP_TICKS` = **29 ticks** — IN-T1's own age cap, *the FULL REVERSAL*, the widest
turn the shipped form can charge for. No taste constant (#200).

**(ii) THE OUTCOME MEASURE** — the **FLIP-vs-TRUTH share**, IN-T0 §R2 / IN-T1 §R4's
instrument **REUSED VERBATIM**: at a carrier moment the shipped `choosePerceivedPassTarget`
is priced **twice** on the same tick — once on TRUTH and once on the carrier's REAL book — and
a **FLIP** is a different chosen target. This is *「传到应该传到的人」* made countable.
⚠ **ORACLE LIMITS RESTATED, VERBATIM (IN-T1 §R4)**: *"the oracle is the PERCEIVED-CHOICE
chooser, not `decideCarrier`'s full ladder; and it is read at EVERY carrier tick (a superset
of his decision ticks), so the flip share is a LOWER BOUND. Its denominator MOVES between arms
because the arms are different worlds — disclosed per face."* **A LOWER BOUND, and THE
DECLARED ORACLE.**

**(iii) THE MATCHING — SITUATION STRATA, FROZEN BEFORE THE BATTERY**: **PRESSURE** (nearest
opponent to the carrier ≤ `TOUCH_CONTROL_DIST` = 4.2 m, the substrate's OWN pressure switch,
by anchored extraction) × **ZONE** (the carrier's progress along **his own** `attackDir`, in
`PITCH_LENGTH` thirds) = **6 cells**. **STANDARDISATION**: the **SHUT** arm's stratum weights
are held **fixed** and both arms are read through them, so the contrast is at matched
situations. **RETENTION RULE, frozen**: a stratum with a **zero denominator in EITHER arm** is
DROPPED and the weights RENORMALISED over the retained set; the retained set is published and
`gStrataMatchingLive` requires **≥ 4 of 6** to survive.

**(iv) ⚠⚠ THE CONFOUND, STATED HONESTLY — AND IT IS WHY THE LIMBS ARE SPLIT.** Freshness is
**NOT randomly assigned WITHIN an arm**: a carrier whose book is fresh is a carrier who has
just looked, or has just been facing the play, which is itself a football situation. The
**DOOR**, by contrast, **IS** randomised between arms — the same seed walked twice with
`inLookAct` the only difference. ⇒ **FROZEN**: the **BETWEEN-ARM limb at matched strata is
THE CONJUNCT**; the **within-arm fresh-vs-stale contrast is SUPPORTING and is REPORTED, never
gated**, in both arms, standardised over the same strata.

**(v) WALK-SIDE PREDICATES PINNED.** Canon VERBATIM (NEW, ruling #332 item 3): *"a scored
face's walk-side predicate is pinned — anchored extraction or fixture — because the
re-derivation gate proves arithmetic, not definitions"* (home: DF-T3 §CORR item 2). Every
predicate this exam scores on carries **hand-computed FIXTURES evaluated in the CONSTRUCTION
CLASS, before any battery walk**; a disagreement exits 3 and writes nothing. The pins cover
`pressIndexOf` (inclusive at the radius, Infinity is free), `zoneIndexOf` (**including the
mirror**: the same point is the ATTACKING third for the team attacking the other way),
`stratumIndexOf` (the composition and its published cell order) and `freshIndexOf` (inclusive
at the full reversal, and IN-T1's two published book ages both land STALE). They are published
in the artifact as `walkSidePredicatePins` and gated by `gWalkSidePredicatesPinned`.

### §P3 ⭐ THE FROZEN CI RULES (pre-registered; NEVER re-cut after sight)

* **PER-SEED CELLS** are stored so every headline re-derives (canon, home ruling #282.2(ii)).
* **BETWEEN-ARM faces** (the same seeds walked twice, the look the only difference) use the
  **PAIRED DELTA** (armed − shut) with a **SEED-CLUSTERED PAIRED bootstrap**: resample the
  walked seeds with replacement; in **each** draw compute both arms over the **SAME** resampled
  seed set, then the delta. A face **MOVES RESOLVEDLY** iff its delta CI **EXCLUDES ZERO**.
* **WITHIN-ARM contrasts** ((a1)'s three situations, (a2)'s decline share, the supporting
  fresh-vs-stale limb, the press-immunity cells, the attribution split) are **UNPAIRED**: each
  side gets its own seed-clustered bootstrap interval and the frozen test is **INTERVAL
  OVERLAP** — **DISJOINT = resolved apart**.
* **2,000 resamples** everywhere; **95 % percentile** intervals; each bootstrap's rng is
  seeded from its **own published STATS BASE** (block-base discipline).
* Canon VERBATIM: *"a starred finding states its |Δ|÷half-width ratio"* (home BU-T0B §CORR
  item 2) — every between-arm face carries `ratioToHalfWidth`, and (a1) publishes each pair's
  gap over the larger half-width.
* Canon (paraphrase): **moving denominators disclosed per face** (home PW-C0 §CORR item 2) —
  every face publishes its own `denNote`. ⚠ The denominator problem is **acute here**: a
  locked carrier does not re-decide, so `viewsBuiltPerMatch` is published as its own face.
* Canon (paraphrase): **clock honesty** — every rate on the 240 s match clock or dual-axis;
  APPLIED values, never nominal. Every age face carries its sim-second twin.
* Canon VERBATIM: *"a max−min face reports a noise-floor comparison, not a zero-null CI"*
  (home PC-T1 §CORR item 3) — the only max/min faces published are the per-body look spread's
  `gidsThatLookedMin` / `Max`, and no interval is attached to them.

### §P4 The arms, and the world

* **shut** (`lookShut`) = the **world-9 stack** (`a4MatchFlags(9)` + `bkFacingLaw` +
  `bkContactLaw` + `armA4World` with the matured L3/PC doses) **+ `inSnapshotLaw` at F2** —
  IN-T1's own `lookShut` world, the matched floor.
* **armed** (`lookArmed`) = the same **+ `inLookAct`**. That is the ONLY difference.
* ⭐ **THE DF DOORS ARE SHUT ON BOTH ARMS** (#332 item 6, explicit): `dfAssignPersist` and
  `dfSurface` are both `false`, asserted per walk in `worldConjuncts`. One seam family per
  exam.
* The banked **o2Look** seam stays shut (IN-T1 §P2(d) built NEW), asserted per walk.
* ⭐ **THE SEASON LADDER runs the SHIPPED world**, not world-9 — canon VERBATIM: *"WORKER-
  SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since #155,
  stated now, test-pinned; refines #270's E4 correction; matches the perf diagnostic)"*
  (home: ruling #283.2(iv)). The doors are armed through `League.matchFlags`, the League's own
  probe surface, which the shipped `createMatch` spread carries into every fixture — nothing
  is hand-written onto `info.genome` (dose-placement canon, home ruling #270.2).

### §P5 REPORTED, never gated (H-IN.2's institutions)

* ⭐⭐ **THE SEASON LADDER** — see §P6.
* ⭐ **THE PRESS-IMMUNITY FACE — 压迫压的是没看的人吗** (the doctrine's 时间预算攻击
  SHARPENED). At every **open-play FIRST reception** the receiver is classed by (i) whether he
  is under pressure (nearest opponent ≤ `TOUCH_CONTROL_DIST`, the substrate's own switch) and
  (ii) whether **his own book** was FRESH or STALE at that tick (the same derived
  full-reversal cut). The outcome is whether the **OPPOSITION takes the ball within the
  DERIVED window** — `IN_LOOK_AGE_CAP_TICKS` = 29 ticks, *the time it takes to turn all the
  way round*. Four cells × two arms, with within-arm intervals. ⚠ **Neither class is
  randomised**: read as a description of the world, never as a causal estimate.
* ⭐ **HOLDING USAGE** (拿住球 gains a PRODUCT). The contract's H-IN.2 direction VERBATIM:
  *"拿住球 gains a PRODUCT (looks) — if holding usage rises it must rise because looks pay,
  never because a weight was nudged."* Face: **sim-seconds of ball ownership per ownership
  episode**, both arms, with its own denominator (`ownershipEpisodesPerMatch`) published
  beside it, **plus the per-seed correlation** between look usage and carry seconds inside the
  armed arm. ⛔ **NOTHING IS CLAIMED FROM THE CORRELATION** — it is a cross-seed association
  in ONE arm with no randomisation and no adjustment; it is published because #332 item 6
  ordered it reported.
* ⭐ **THE BODY-TICK ATTRIBUTION SPLIT** (`lookAgeErasedShare` — passive vs look), with the
  half-split counterfactual **NAMED OUT** per §P0.
* the **R-乙 chain faces** — Q01 spell seconds · Q05 touches/spell · Q06 completion · Q14
  pressed share — and the **DIRECTION MIX** (Q07 forward share), definitions reused
  **VERBATIM** and cited to [`R-YI-STANDING-GAP-TABLE.md`](R-YI-STANDING-GAP-TABLE.md)
  §definitions (ported through [`BK-T2-COMPOSITION-EXAM.md`](BK-T2-COMPOSITION-EXAM.md) §(d)'s
  spell walker; #324 §CORR 1's restored loose-ball clause carried in the artifact's quote).
* **the look USAGE and COST receipts at exam grain** — usage/decline/situation shares, turn
  ticks and sim-seconds per look, locked decisions per look, looks per match, gain and loss
  per look, the ball-arrived refund share, and the paid time inside the **derived [15, 29]
  band** (bounded BELOW by the smallest possible turn at F2 — the aim must lie OUTSIDE a 90°
  half-angle field, so θ > 90° ⇒ ≥ 15 ticks — and ABOVE by the FULL REVERSAL).
* **goals + the §2 equilibrium faces** at match grain, both arms, with CIs. **REPORT ONLY: no
  band is a gate here**, because nothing ships from an exam (contract §4: no equilibrium
  promise). ⚠⚠ IN-T1 §R5's **goalsPerMatch 2.93 → 1.80** is re-measured on virgin seeds, and
  the **verdict on that quantity lives at LADDER grain**, not here.

### §P6 ⭐⭐ THE SEASON LADDER (ORDERED at dispatch, #332 item 6), and the floor

The DF-T3 design reused: **2 arms** (`liveShut` = the live world + `inSnapshotLaw` at F2, the
look door shut; `liveArmed` = the same + `inLookAct`) × **4 paired league seeds** × **20
generations**, every generation measured — **160 league-seasons**. Early/late windows are
DF-C0's: **1–5 vs 16–20, disjoint**. The slope point estimate goes through DF-C0-FIX §RF1's
**ONE FORMULA**, `slopeDeltaThroughOneFormula = mean(per-league (late − early))`, called by
BOTH the publish side and the on-disk re-derivation so the two cannot drift.

**THE FLOOR**: DF-C0 §R4's `atkFrozen` goals slope **+0.2211** (half-width 0.1423, |Δ|÷hw
1.55). **QUOTED, never re-run.**

⚠ **The floor is a REFERENCE LINE, not a matched control** — a different counterfactual
(frozen attack genes vs an armed PERCEPTION door) on different league seeds (DF-C0's
12,508,900–903 vs this stage's 12,516,900–903). REPORTED, never gated.

⚠ **No between-arm SLOPE test is pre-registered and none will be invented after sight**: each
arm carries its own league-clustered interval and the comparison is read as **overlap** —
DF-T1 §R8 item 2's discipline, inherited verbatim.

⭐ **ALSO AT LADDER GRAIN, ORDERED**: `passCompletion` and `interceptions` — **does better
information starve defenders of interceptions across seasons?** REPORT, NEVER GATE. ⚠ DF-T2
§R11 item 6's warning binds: the friendly-match `interceptionsPerMatch` face is a **DIFFERENT
NUMBER** and the two are never quoted as the same thing. Both are published, each labelled
with its own estimand.

### §P7 Gates (frozen; a RED gate stays red and is reported)

`gWorldOkEveryWalk` · `gSeedsBookedEqualWalked` · `gArmsPairedPerSeed` · `gAnchorsResolveOnce`
· ⭐ `gWalkSidePredicatesPinned` (the NEW canon, §P2(v)) · ⭐ `gSrcUntouched` (porcelain AND
`diff --stat HEAD` over `src` — the exam is instrument-only) · `gShutLookLedgerEmpty`
(dormancy measured IN-BATTERY) · `gInLawFiresBothArms` (the matched floor is non-vacuous) ·
`gLookFiresEveryArmedWalk` (used AND declined on every armed walk) · `gFlipPopulationNonEmpty`
· ⭐ `gStrataCellsStored` · ⭐ `gStrataMatchingLive` (≥ 4 of 6 strata carry both arms — a
matching that collapses to one cell is not a matching) · ⭐ `gFreshnessBinsOccupied` (BOTH
bins occupied in BOTH arms — a one-bin split is a silently dead instrument) ·
⭐ `gPressImmunityAlive` (every cell of both arms has receptions — a zero denominator is not a
pass) · `gHoldingInstrumentAlive` · `gRyiInstrumentAlive` · `gPaidTimeWithinDerivedBand` ·
`gLadderComplete` · `gLadderDoorHeld` (the doors read back off **every** created match) ·
`gLadderGen1Identical` · `gSeedDiscipline` · `gStatsDisjoint` · `gFingerprintUnmoved` ·
⭐ `gFacesFromDisk` (canon, home ruling #287 item 1: the body is **STAGED to disk, re-parsed,
and every published face re-derived** — every between-arm face's shut/armed/delta and both
numerators, (a1)'s three point estimates and three pair booleans, (a2)'s share and its frozen
rule, (b)'s per-stratum cells, retained set, both standardised shares, the delta, the
|Δ|÷half-width and the conjunct boolean, the supporting limb's two arms, **the verdict
string**, the look receipts, the attribution, the holding correlation, all sixteen
press-immunity cells, every ladder face × arm × generation, every slope through the ONE
FORMULA, and the floor read's arithmetic).

⭐ **THE BODY IS HASHED LAST**, after every gate is written including `gFacesFromDisk`
(DF-C0 §CORR item 2, ruling #321). A RED run writes `…RED.json`; the canonical path is only
reached all-green.

### §P8 Seeds and stats (pre-registered — BOOKED = WALKED, the block consumed whole)

* **Block 12,516,000–999**, opened by #332 item 6, **CONSUMED WHOLE**. Sub-ranges:
  `…000–…039` the exam battery (40 paired seeds) · `…800–…802` the in-band smoke prefix ·
  `…900–…903` the ladder's four league seeds (booked once, walked in both arms) · `…999` the
  xxx,999 world-construction receipt seed (**WALKED**, so 41 seeds × 2 arms = **82 walks**).
* **Stats base 115,800, step 200.** ⭐ **THE REGISTRY OF RECORD ENTERING THIS STAGE IS 64**
  (ruling #332 item 4's correction): IN-C0's completed 56 + 114,200 + 114,400 + 114,600 +
  114,800 + 115,000 + 115,200 + 115,400 + 115,600. DF-T2, IN-T0, IN-T1 and BK-C1 consumed
  ZERO.
* **THREE draws ⇒ THREE bases**: **115,800** (the paired between-arm bootstrap — every face
  in `faces`, and H-IN.1(b)'s standardised delta) · **116,000** (the ladder's league-clustered
  slope bootstrap) · **116,200** (the WITHIN-ARM bootstrap that carries (a1), (a2), the
  supporting limb, the press-immunity cells and the attribution split). Next base ≥
  **116,400**; next sim block ≥ **12,517,000**.
* **Override discipline**: a smoke / N / GENS / OUT run may NOT write the canonical artifact
  path (the probe refuses, exit 2).

### §P9 The instrument

`scripts/probes/in-t2-information-exam.ts`, frozen in **this** commit **BEFORE** the battery
(canon: **freeze-before-battery**, home ruling #266.3(c)); the artifact records its `sha256`.
The hashed body is built from an explicit **ALLOWLIST SCHEMA** — canon VERBATIM: *"the hashed
body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never enters the
body; forbidden-name lists are retired"* (home PC-T0 §CORR item 1). Env surface is
**whitelist-or-refuse**: `INT2_MODE` (required) · `INT2_N` · `INT2_GENS` · `INT2_OUT`; any
other `INT2_*` var and any engine door is a fatal refusal.

**THE THREE ANCHORED EXTRACTIONS** (values REPORTED by the artifact with line receipts, never
asserted in prose): `bkTurnTicksForm` (IN-T1's own, plus the **LIVE cross-check** against the
shipped `bkFacingExtraTicks` at nine angles) · `touchControlDist` (the stratum's pressure
switch) · `pitchLength` (the stratum's zone thirds). Canon VERBATIM: *"a src-extracted
constant pins its extraction to the NAMED call site — anchored match + line receipt — never
first-occurrence"* (home BK-C0 §CORR item 1).

### §P10 Declared doubts (before the battery)

1. **(a1) MAY GO RED ON THE CARRIER-vs-OFF-BALL PAIR.** IN-T1 §R2 measured `lookShare_carrier`
   **0.774553387668** [0.725632244468, 0.818530999746] against `lookShare_offBall`
   **0.687301577478** [0.668574207175, 0.705280618437] — disjoint, but by far the
   narrowest of the three pairs, and on a different 41-seed draw. The keeper pair is a
   factor of seven apart and is not in doubt. **The pairwise rule is frozen as it stands**; if
   the carrier/off-ball pair overlaps, (a1) is RED, is reported as RED, and is not re-cut to
   "at least one pair".
2. **THE (b) DENOMINATOR MOVES BETWEEN ARMS, AND THE STANDARDISATION DOES NOT FIX THAT.**
   A locked carrier does not re-decide, so the armed arm prices fewer moments; the strata
   weights are matched but the **populations inside a stratum are not the same moments**.
   Stated here so the conjunct is read for what it is: a matched-situation contrast between
   two worlds, not a within-world experiment.
3. **THE FLIP SHARE IS A LOWER BOUND AND IT IS A CHOICE-QUALITY PROXY.** It says the believed
   choice differs from the truth choice; it does not say the truth choice was *better
   football*. The contract's own words are *"chooses/releases resolvedly better"*, and this
   exam measures the CHOOSING half against the engine's own oracle. The RELEASING half —
   whether the pass actually arrives — is the press-immunity face's territory and is REPORTED.
4. **THE SUPPORTING LIMB MAY LOOK ENORMOUS AND MEAN LITTLE.** A moment with nothing in memory
   cannot flip at all, so the fresh bin is structurally advantaged. Pre-registered here so a
   large within-arm gap is read as mechanism, not as an effect size — which is exactly why it
   is not the conjunct.
5. **THE LADDER MAY NOT REPRODUCE THE 2.93 → 1.80 RECEIPT.** The receipts were a friendly-
   match world-9 walk; the ladder is the evolving ecology with random-genome leagues learning
   against the door for twenty generations. Divergence between the two is information, not a
   contradiction, and both are published.
