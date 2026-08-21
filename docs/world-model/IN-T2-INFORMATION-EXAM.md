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

---

## §RESULTS

> **Instrument**: `scripts/probes/in-t2-information-exam.ts`
> (`instrument.sha256` = `2d4536572542b4c61cc2d52a2c27f50925d1043cc61c11638b6f1d7e1c7d9565`),
> frozen at `5c38e27` **before** the battery. This results section is appended **BELOW the
> marker**; not one byte above it moved.
> **Artifact of record**: `docs/world-model/data/in-t2-information-exam.json`
> (`bodySha256` = `a88fd0d19e2e6d61f7f15535fd0b1792a678e9067ebb97b2eb13406031464bf5`).
> **82 walks** (41 paired seeds × 2 arms) + **160 league-seasons / 11,360 matches**; every
> `worldOk` true; **all 24 gates GREEN**; **601 re-derivation checks off disk, 0 mismatches**.
> Wall: battery **142 s**, ladder **3,320 s** (≈ 55.3 min).
> ⚠ **THE SESSION-LIMIT INHERITANCE, NAMED**: the dispatch session died at the account limit
> after landing commits 1 and 2 with a clean tree; the battery had never run. This section is
> the CONTINUATION's work at the inherited frozen tree (`git diff 5c38e27..HEAD` empty at the
> start of the walk, and `srcTouched.head` = `5c38e2702a149171a97e860e1d7962c8749ecea5`
> recorded INSIDE the artifact). The inheritance was re-verified as a HYPOTHESIS before any
> walk (IN-T0 §R8 item 10's lesson): **34/34 pins green**, the argmax `− loss` rider mutant
> re-run live and killing **exactly 1** pin (33 pass), `src/ai/inLookAct.ts` sha
> `f0e09b51…f5c93` identical before and after, fingerprint `57b0bdab…c673` by hand.
> Every number below is quoted VERBATIM from an artifact field (canon: *"a stage doc's prose
> quotes artifact FIELDS verbatim or the number becomes a gated face"*, home PC-T2 §CORR
> item 4).

### §R0 ⭐⭐ THE VERDICT — **H-IN.1(b) PASS · H-IN.1(a) FAIL on (a1)** (`verdict` = `FAIL — (a)`)

| conjunct | the rule (frozen at §P1) | the number | verdict |
|---|---|---|:--:|
| **(a1) USAGE NON-DEGENERACY BY SITUATION** | the three situation look shares **PAIRWISE RESOLVED DISTINCT** — **all THREE** pairs of intervals **DISJOINT** | carrier **0.719124403207** [0.638524822695, 0.78707450607] · offBall **0.66964132854** [0.652113176346, 0.687541050649] · keeper **0.0970949153554** [0.0789204362701, 0.11594057014]. `pairsDisjoint` = **false / true / true** | ⛔ |
| **(a2) THE ALL-SCANNING GUARD** | the DECLINE share's 95 % interval **LOWER EDGE > 0** | **0.455821440403** [**0.442198929527**, 0.470322764672]; `halfWidthsFromZero` **32.4153**; refund `abortedBallArrivedShare` **0.0626575529398** | ✅ |
| **(b) INFORMATION DIFFERENTIATES OUTCOMES** | the **STRATUM-STANDARDISED** flip share's **PAIRED** interval of (armed − shut) **ENTIRELY BELOW ZERO** | **0.232262918309 → 0.0500095244943**, Δ **−0.182253393815** [**−0.203616155356**, **−0.157741268332**], hw 0.0229374435125, **\|Δ\|÷hw 7.94567**, **6 of 6 strata retained** | ✅ |

**H-IN.1(a) FAILS because (a1) fails; H-IN.1(b) PASSES.** `a_looksGenuinelyTakenAtTheirCost.pass`
= `false`, `b_informationDifferentiatesOutcomes.pass` = `true`.

⛔ **THE RED STAYS RED, AND THE RULE WAS NOT RE-CUT — AND IT IS THE RED §P10 ITEM 1 PREDICTED
BY NAME.** The pre-registration wrote, before the battery: *"(a1) MAY GO RED ON THE
CARRIER-vs-OFF-BALL PAIR … the pairwise rule is frozen as it stands; if the carrier/off-ball
pair overlaps, (a1) is RED, is reported as RED, and is not re-cut to 'at least one pair'."*
It overlapped. The carrier share **0.7191** and the off-ball share **0.6696** sit
**0.049483074667** apart with `ratioToHalfWidth` **0.666216** — well under one half-width —
and the carrier interval's low edge (0.638524822695) sits **0.049016227954** inside the
off-ball interval's high edge (0.687541050649). The carrier's interval is **four times wider**
than the off-ball's (hw 0.0743 vs 0.0177), which is the mechanism: the carrier's decision
population per seed is small and volatile, the off-ball population is eleven bodies deep.
IN-T1 §R2's draw had these disjoint (0.7746 vs 0.6873) on a different 41-seed draw; **on
virgin seeds they do not separate.** The other two pairs are enormous (**8.37** and **30.93**
half-widths).

⭐ **IN THE PLAYER'S LANGUAGE**: the keeper answer is emphatic and is football — **the man
between the posts looks on 9.7 % of his decisions while everybody else looks on ~70 %**, and
that gap is 8–31 half-widths wide. The gap the exam could not establish is a narrower claim:
that **the man on the ball** looks meaningfully more than **his team-mates off it**. On this
draw he looks a little more (0.719 vs 0.670) and the exam cannot tell it from noise. The
distribution is manifestly not one degenerate corner; the frozen conjunct asked for three
resolved separations and got two.

### §R1 ⭐⭐ H-IN.1(b) — THE STRONGEST SCORED RESULT IN THE INFORMATION ARC

At matched situations, with the SHUT arm's stratum weights held fixed, **the armed carrier's
believed pass choice disagrees with the truth choice on 5.0 % of priced moments against
23.2 % shut** — a resolved fall of **18.2 points at 7.95 half-widths**, with **every one of
the 6 strata retained** (`gStrataMatchingLive` needed ≥ 4). Per stratum
(`hin1.b_…​.perStratum`, shut share → armed share):

| stratum | shut n | shut flip share | armed n | armed flip share | shut weight |
|---|---:|---:|---:|---:|---:|
| `free:defThird` | 59,617 | 0.030293 | 62,827 | 0.010887 | 0.283874 |
| `free:midThird` | 12,883 | 0.371187 | 11,743 | 0.075875 | 0.061344 |
| `free:attThird` | 6,703 | 0.304938 | 68,058 | 0.107350 | 0.031917 |
| `pressed:defThird` | 23,907 | 0.194253 | 22,842 | 0.028850 | 0.113836 |
| `pressed:midThird` | 66,738 | 0.316162 | 26,860 | 0.088161 | 0.317782 |
| `pressed:attThird` | 40,164 | 0.358580 | 41,126 | 0.039415 | 0.191246 |

**The armed share is lower in all six cells**, so the standardised contrast is not a weighting
artefact. The raw pooled view agrees (`flipShare` 0.232262918 → 0.0579509629, Δ
**−0.174311955** [−0.2130323, −0.1277515], 4.09 hw) — the standardisation moves the number by
0.008, which is the honest measure of how much the situation mix was doing.

⚠⚠ **§P10 ITEM 2 STANDS UNREPAIRED AND MUST BE READ WITH THE PASS**: the denominator moves
between the arms — `viewsBuiltPerMatch` **422.658537 → 152.097561** (resolved down, 6.46 hw)
— because a locked carrier does not re-decide. The strata *weights* are matched; the
*moments inside* a stratum are not the same moments. `free:attThird` is the loudest instance:
6,703 shut moments against 68,058 armed. This is a matched-situation contrast between two
worlds, exactly as pre-registered, and not a within-world experiment.

⚠ **AND THE FLIP SHARE IS A LOWER BOUND** (the declared oracle, restated verbatim in
`instrument.flipOracleLimits`): the perceived-choice chooser, not `decideCarrier`'s full
ladder, read at every carrier tick.

**THE MECHANISM BEHIND IT, in the book's own numbers**: `carrierBookAgeMeanTicks`
**789.530126 → 25.0451746** (**13.16 → 0.417 sim-seconds**, 6.23 hw down) and
`chooserStaleAgeMeanTicks` **1702.12959 → 62.3943337** (**28.37 → 1.04 sim-seconds**). IN-T1
§R1's mandate figure — 27.49 sim-seconds bought back to 0.95 — **reproduces on virgin seeds at
28.37 → 1.04.** ⚠ And `oracleStaleShare` **RISES** 0.449016619 → 0.598751332 (1.93 hw up),
exactly as IN-T1 §P9(4) pre-registered: a fuller book makes MORE bodies eligible to be served
from memory, because a body never seen is served TRUTH by IN-T0's cold-start rule. Mechanism,
not contradiction.

**THE SUPPORTING WITHIN-ARM LIMB (REPORTED, NEVER GATED)** — and §P10 item 4's warning is
exactly right, so read it as mechanism: `lookShut` fresh **0.0449150710591**
[0.0360274564535, 0.0548501270699] vs stale **0.333735839848** [0.304884813848,
0.359161256609], disjoint; `lookArmed` fresh **0.0254520954868** vs stale **0.219474741166**
[0.09434329682, 0.390971428281], disjoint. Both arms say fresh flips far less. The armed arm
also **moves the population into the fresh bin** — 210,350 fresh / 23,106 stale moments armed
against 68,178 / 141,834 shut. A moment with nothing in memory cannot flip at all, which is
why this limb is not the conjunct.

### §R2 ⭐ THE LOOK USAGE AND COST RECEIPTS AT EXAM GRAIN (REPORTED)

`lookShareOfDecisions` **0.544178559597** [0.529734499184, 0.557838939493] ·
`declineShareOfDecisions` **0.455821440403** · `turnTicksPerLook` **20.0478838368** ticks =
**0.334131397279 sim-seconds**, inside the **derived [15, 29] band** (`gPaidTimeWithinDerivedBand`
GREEN — no chosen number at either edge) · `lockedDecisionsPerLook` **0.984588922164** ·
`looksPerMatch` **5969.73170732** · `gainPerLook` **140.649577748** body-ticks against
`lossPerLook` **28.1057244065** · `bodiesPerLook` **9.18137024583** vs
`bodiesPerPassivePass` **6.45157933821**.

⚠⚠ **THE APPROXIMATION'S SIZE IS PUBLISHED, AS ORDERED**: `abortedBallArrivedShare`
**0.0626575529398** — **6.3 % of looks are cut short by the ball arriving and refunded**. The
direction is CHEAPENING (§P1), so (a2)'s pass is conservative in the right direction: the
guard held at 32 half-widths from zero against a **more permissive** world than a physical
sweep would be.

**THE PER-BODY SPREAD, REPORTED AND NOT A CONJUNCT** (#329 §CORR item 3, and the max−min canon
— no interval attached): `gidsThatLookedPerMatch` **11.9756097561**, `gidsThatLookedMin`
**11**, `gidsThatLookedMax` **12**. Eleven or twelve of twelve bodies look in every single
walk. **IN-T1's retired `gEveryBodyLooks` would very nearly have passed here** — and that is
precisely why it was retired: the interesting fact is not that everyone looks once, it is that
the keeper looks a seventh as often as everyone else.

### §R3 ⭐⭐ THE SEASON LADDER — **THE ARMED ARM'S GOALS SLOPE IS FLAT, AND IT SITS BELOW THE FLOOR**

2 arms × 4 paired leagues × 20 generations = **160 league-seasons, 11,360 matches**, every
generation measured. `gLadderDoorHeld` GREEN: `doorWrong` **0** on every one of the created
matches; `gLadderGen1Identical` GREEN over the four league fingerprints.

**goals/match, early (gens 1–5) → late (gens 16–20):**

| arm | gen 1 | gen 20 | early → late | Δ | half-width | \|Δ\|÷hw |
|---|---:|---:|---|---:|---:|---:|
| `liveShut` | 1.97183098592 | 3.51056338028 | 2.19929577465 → 3.18450704225 | **+0.985211267606** | 0.112323943662 | **8.77116** |
| `liveArmed` | 1.59154929577 | 1.73943661972 | 1.65211267606 → 1.74788732394 | **+0.0957746478873** | 0.169718309859 | 0.564315 |
| *(reference)* `atkFrozen` **FLOOR** | — | — | — | **+0.2211** | 0.1423 | 1.55 |

⭐⭐ **THE READ**: the shut arm inflates hard and resolvedly (+0.985, 8.8 hw). **The armed arm
does not inflate at all** — +0.0958 with an interval [−0.0802816901408, 0.259154929577] that
**straddles zero**. `shutDistanceAboveFloor` **0.764111267606**;
`armedDistanceAboveFloor` **−0.125325352113** — the armed slope is *below* the atkFrozen
reference line; `armedMinusShut` **−0.889436619719**; `fractionOfExcessClosed`
**1.16401453221**; `bendsTowardFloor` **true**. DF-T3 closed 11.4 % of the excess; **this door
closes all of it and overshoots.**

⚠⚠ **THREE CAUTIONS, AND THEY MATTER MORE THAN THE HEADLINE.**
1. **NO BETWEEN-ARM SLOPE TEST WAS PRE-REGISTERED AND NONE IS INVENTED** (§P6, DF-T1 §R8 item
   2's discipline). The two league-clustered intervals happen **not to overlap**
   ([0.891549295775, 1.1161971831] vs [−0.0802816901408, 0.259154929577]) — that is *reported
   as an overlap read and nothing more*; it is **not** a scored contrast, and 4 leagues per arm
   is the whole cluster count.
2. **THE FLOOR IS A REFERENCE LINE, NOT A MATCHED CONTROL** (frozen §P6, and
   `floorRead.interpretationNote`): a different counterfactual on different league seeds
   (12,508,900–903 vs 12,516,900–903). `fractionOfExcessClosed` > 1 is arithmetic about two
   published point estimates, not a claim that this door *did the floor's job*.
3. ⚠⚠ **THE ARMED LADDER IS A DIFFERENT ECOLOGY FROM GENERATION 1, NOT A BENT VERSION OF THE
   SAME ONE.** Its gen-1 LEVELS already differ: goals **1.59 vs 1.97**, `passCompletion`
   **0.494277449377 vs 0.680161428708**, interceptions **3.05457746479 vs 16.1707746479** per
   team-match. A slope measured on a curve that starts somewhere else is **not** the same
   estimand. §P10 item 5 pre-registered that the ladder might not reproduce the friendly
   receipt; what it did not anticipate is that the *level* separation would be this large at
   generation 1. **This is a labelled hypothesis about mechanism, not a finding: the flat armed
   slope may be a ceiling effect of a low-scoring world rather than the door disciplining
   inflation.** The two readings are not separated by this exam.

**⭐ THE READING-vs-GOALS MANDATE AT LADDER GRAIN** (`readingAtLadderGrain`, ORDERED at
dispatch — DF-C0 §R4's estimand, evolved league play per team-match):

| arm | interceptions Δ [95 % CI] | \|Δ\|÷hw | gen 1 → gen 20 | passCompletion Δ [95 % CI] |
|---|---|---:|---|---|
| `liveShut` | **−7.35633802817** [−8.10281690141, −6.52218309859] | 9.30809 | 16.1707746479 → 6.41901408451 | −0.00134914249165 [−0.0346241753292, 0.0264972617515] |
| `liveArmed` | **−0.43838028169** [−0.68485915493, −0.161971830986] | 1.67677 | 3.05457746479 → 2.53521126761 | +0.00795238376786 [−0.00987717114198, 0.028013621901] |

⛔ **THE ANSWER TO "DOES BETTER INFORMATION STARVE DEFENDERS OF INTERCEPTIONS ACROSS
SEASONS?" IS: IT ALREADY DID, ON DAY ONE, AND THEN STOPPED.** The armed world begins at
**3.05** interceptions per team-match where the shut world begins at **16.17** — a level
collapse of **81 %** present at generation 1, before any evolution — and then decays only
**−0.438** across twenty generations while the shut world sheds **−7.356**. Both arms end in
the same neighbourhood (6.42 vs 2.54). ⚠ The two Δ intervals **do not overlap**, reported as
an overlap read only, per caution 1. ⚠ **This is NOT the friendly-match number**
(`interceptionsPerMatch` 31.5365854 → 8.85365854, §R4) and the two must never be quoted as
the same thing (DF-T2 §R11 item 6, honoured). `passCompletion` is flat *within* both arms and
separated *between* them (~0.68 vs ~0.50) — the same level story as the goals curve.

⚠ Per the frozen direction (#320 item 3, restated at dispatch): the ladder is **REPORTED** and
a deviation **ROUTES TO A SLICE, never to a nudge**.

### §R4 THE §2 EQUILIBRIUM FACES AND THE R-乙 CHAIN, AT FRIENDLY GRAIN (REPORT ONLY — NO BAND IS A GATE)

| face | shut | armed | Δ [95 % paired CI] | \|Δ\|÷hw | resolved |
|---|---:|---:|---|---:|:--:|
| ⚠⚠ `goalsPerMatch` | **3.04878049** | **1.7804878** | **−1.26829268** [−1.878049, −0.5609756] | 1.926 | ↓ |
| `shotsPerMatch` | 14.8292683 | 3.63414634 | −11.195122 [−12.63415, −9.731707] | 7.714 | ↓ |
| `tacklesPerMatch` | 3.3902439 | 1.7804878 | −1.6097561 [−2.414634, −0.8292683] | 2.031 | ↓ |
| `interceptionsPerMatch` | 31.5365854 | 8.85365854 | −22.6829268 [−25.39024, −20.12195] | 8.611 | ↓ |
| `ryiQ01SpellSeconds` | 3.64656151 | 6.57569231 | +2.92913079 [2.071483, 4.063986] | 2.94 | ↑ |
| `ryiQ05TouchesPerSpell` | 2.27949527 | 1.86 | −0.419495268 [−0.5416256, −0.3113425] | 3.643 | ↓ |
| `ryiQ06PassCompletion` | 0.592839301 | 0.382459313 | −0.210379988 [−0.2383198, −0.1826668] | 7.56 | ↓ |
| `ryiQ14PressedReceptionShare` | 0.798107256 | 0.644615385 | −0.153491871 [−0.1944537, −0.1120354] | 3.725 | ↓ |
| `ryiQ07ForwardPassShare` | 0.517346656 | 0.663652803 | +0.146306147 [0.113662, 0.1768294] | 4.632 | ↑ |
| `matchSimSeconds` | 254.99878 | 254.008943 | −0.989837398 [−3.715854, 1.850813] | 0.3556 | — |

⚠⚠ **IN-T1 §R5's LOUDEST RECEIPT, RE-MEASURED ON VIRGIN SEEDS**: `goalsPerMatch`
**3.04878049 → 1.7804878**. The **armed** side lands on 1.78 against the receipt's 1.80; the
**shut** side is higher than the receipt's 2.93 (3.05). The receipt reproduces, and **the
verdict on this quantity lives at ladder grain (§R3), not here** — as §P5 froze.

⭐ **THE CHAIN'S SHAPE**: possessions get **longer in seconds** (3.65 → 6.58, +80 %) with
**fewer touches** (2.28 → 1.86) — the ball is *held*, not passed around — passes go **more
forward** (0.517 → 0.664) and **complete less** (0.593 → 0.382), and receptions happen under
**less** pressure (0.798 → 0.645). ⚠ Every one of these is at friendly grain with random
genomes; the ladder's own `passCompletion` (≈ 0.50 armed) is the evolved-play number.

### §R5 ⭐ THE PRESS-IMMUNITY FACE — 压迫压的是没看的人吗 (REPORTED, NEVER GATED)

Window = the **DERIVED** full reversal, `windowTicks` **29** = `windowSimSeconds`
**0.483333333333**. `gPressImmunityAlive` GREEN (every cell of both arms carries receptions).

| cell | shut receptions | shut turnovers | shut share [95 % CI] | armed receptions | armed turnovers | armed share [95 % CI] |
|---|---:|---:|---|---:|---:|---|
| `free:freshBook` | 84 | 1 | 0.011905 [0, 0.043478] | 215 | 0 | **0** [0, 0] |
| `free:staleBook` | 236 | 0 | 0 [0, 0] | 16 | 0 | 0 [0, 0] |
| `pressed:freshBook` | 150 | 2 | 0.013333 [0, 0.033784] | 393 | 3 | 0.007634 [0, 0.017199] |
| `pressed:staleBook` | 1,115 | 21 | **0.018834** [0.009582, 0.02944] | 26 | 0 | **0** [0, 0] |

⭐⭐ **THE ANSWER IS IN THE DENOMINATORS, NOT THE SHARES.** The only cell with a turnover rate
resolvedly above zero anywhere in the table is **shut `pressed:staleBook`** (0.0188, low edge
0.0096) — *the pressed man with an old book*, and in the shut world **that is where the game
is played**: 1,115 of 1,585 first receptions (**70.3 %**). Arming the look **empties that
cell**: 26 of 650 armed receptions (**4.0 %**), and its turnover count goes to zero. The armed
world moves its receptions into the fresh-book cells (608 of 650, **93.5 %**), where the
turnover shares are 0 and 0.0076.

⚠ **NEITHER CLASS IS RANDOMISED** (frozen §P5, `pressImmunity.honestLimit`): a receiver with a
fresh book is a receiver who has just looked or has just been facing the play. Read as a
description of the world, never as a causal estimate. ⚠ Three of eight cells have zero
turnovers with double-digit-to-hundreds denominators, so most of these intervals are
zero-touching by arithmetic, not by resolution.

### §R6 ⭐ HOLDING USAGE — 拿住球 GAINS A PRODUCT, AND IT RISES (REPORTED)

`meanCarrySimSecondsPerOwnership` **0.698606095166 → 1.64878385849**, Δ **+0.950177763**
[0.6353672, 1.362399], **2.614 hw, resolved UP** — a body keeps the ball **2.36×** as long
once he gets it. Its own denominator is published beside it as the moving-denominator canon
requires: `ownershipEpisodesPerMatch` **128.317073 → 58.8292683** (resolved down, 7.20 hw) —
possession changes hands **less than half** as often.

`perSeedCorrelationLookShareVsCarrySeconds` = **0.332678** over `correlationN` **41** seeds.
⛔ **NOTHING IS CLAIMED FROM THIS CORRELATION** (frozen §P5): a cross-seed association inside
ONE arm, no randomisation, no adjustment, published because #332 item 6 ordered it reported.

The contract's H-IN.2 direction was *"if holding usage rises it must rise because looks pay,
never because a weight was nudged."* **No weight was nudged** — `gSrcUntouched` GREEN,
`srcTouched.gitStatusSrc` and `gitDiffStatSrcHead` both **empty strings**, `srcTouched.head`
`5c38e2702a149171a97e860e1d7962c8749ecea5`. The rise is the priced act's own doing.

### §R7 THE BODY-TICK ATTRIBUTION SPLIT (REPORTED; NOT A COUNTERFACTUAL)

`lookAgeErasedShare` **0.459063172694** [0.446689948722, 0.470250994354] —
`lookAgeErasedTicks` **37,400,288** against `passiveAgeErasedTicks` **44,070,608**. **The
elective look erases 45.9 % of all erased staleness; the free passive refresh erases 54.1 %.**

⛔ **THIS IS AN ATTRIBUTION, NOT A COUNTERFACTUAL**, and the **PASSIVE-vs-LOOK HALF-SPLIT
COUNTERFACTUAL REMAINS NAMED OUT** (§P0, #332 item 6): it needs a third arm behind a sub-flag,
an `src/**` change this instrument-only stage may not make. It is a later slice **if the number
matters** — and at 45.9 % it is now a number with a size, which is the one new thing this face
says about whether the slice is worth buying.

### §R8 THE INSTRUMENT'S OWN RECEIPTS, AND THE SEED LEDGER

**THE THREE ANCHORED EXTRACTIONS, each matching EXACTLY ONCE** (line numbers REPORTED, never
asserted): `bkTurnTicksForm` `src/sim/Match.ts:226` capturing `TURN_RATE` ·
`touchControlDist` `src/sim/constants.ts:315` capturing `4.2` · `pitchLength`
`src/sim/constants.ts:34` capturing `90`. The **LIVE cross-check** against the shipped
`bkFacingExtraTicks` agrees at all nine angles (100° ⇒ 17 ticks … 180° ⇒ 29 ticks).

**THE WALK-SIDE PREDICATE PINS** (the NEW canon, §P2(v)): **22 fixtures, all pass**,
evaluated in the CONSTRUCTION CLASS before any battery walk, across `pressIndexOf`,
`zoneIndexOf` (**including the mirror**), `stratumIndexOf` and `freshIndexOf`.
`gWalkSidePredicatesPinned` GREEN.

**SEEDS — BOOKED = WALKED, THE BLOCK CONSUMED WHOLE**: block **12,516,000–999**.
`…000–…039` the battery (40 paired seeds) · `…999` the xxx,999 world-construction receipt
seed **WALKED** ⇒ 41 × 2 = **82 walks**, `bookedEqualsWalked` **true** · `…800–…802` the
in-band smoke prefix (run first, to `/tmp`, 24/24 gates GREEN, 277 re-derivations 0
mismatches; an override run **may not** write the canonical path and did not) ·
`…900–…903` the ladder's four league seeds, booked once and walked in both arms.
**Next sim block ≥ 12,517,000.**

**STATS — THREE DRAWS, THREE BASES**: **115,800** (paired between-arm) · **116,000** (the
ladder's league-clustered slopes) · **116,200** (within-arm: (a1), (a2), the supporting limb,
the press cells, the attribution). `registryEntries` **64** — the registry of record entering
this stage, per #332 item 4's correction — `registryComplete` **true**,
`minGapToAnyPublishedBase` **200** on a step-200 lattice. **Next base ≥ 116,400.**
`gStatsDisjoint` GREEN. **This stage adds three: the registry leaves at 67.**

**THE FINGERPRINT**: `fingerprint.ofRecord` = `fingerprint.recomputed` =
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`, recomputed **inside** the
run and again by hand after the results commit. `gFingerprintUnmoved` GREEN — as an
instrument-only stage must leave it.

### §R9 WHAT THIS STAGE OWES FORWARD (findings, not proposals)

1. ⭐⭐ **(a1) IS UNDERPOWERED, NOT CONTRADICTED — and the remedy is power, not a new cut.**
   The carrier/off-ball gap is 0.666 half-widths at 41 seeds with the carrier's half-width
   4.2× the off-ball's. The DF-T3B precedent applies exactly: the same frozen conjunct on a
   larger virgin battery. **The rule is not re-cut here and must not be re-cut there.**
2. ⚠⚠ **THE LADDER'S LEVEL SEPARATION AT GENERATION 1 IS THE REAL QUESTION THIS EXAM OPENED**
   (goals 1.59 vs 1.97, passCompletion 0.494 vs 0.680, interceptions 3.05 vs 16.17). Until a
   stage separates *ceiling effect* from *disciplined inflation*, the flat armed slope is a
   labelled hypothesis. **The friendly-grain faces (§R4) say the same door produces a
   lower-scoring, longer-holding, less-completing world; that is a mechanism candidate and it
   is not tested here.**
3. ⭐ **THE ATTRIBUTION NOW HAS A SIZE (45.9 %)**, so the named-out half-split counterfactual
   is a slice with a known payoff rather than an unknown one.
4. **THE PRESS FACE'S ANSWER LIVES IN THE DENOMINATOR**, so any future pressing work should
   read cell occupancy first and turnover shares second.
5. ⛔ **NOTHING SHIPS.** Road B held: `src/**` untouched, both doors dormant, the exam's only
   writes are this section and the artifact.
