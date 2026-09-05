# LN-C0 — 「谁站在传球线上」 THE LANE CENSUS（球出脚的时候,谁站在线上,是谁把他放在那里的）

> **The census that names the lever before anything is armed.** Authorized by
> **COMMANDER RULING #388 item 2** — the first stage of **step ②** of the ratified order
> (#366 item 1). Lineage: **PT-C0** (the play-test forensic census — its POPULATION, its
> `ball.lastTouch` FIRST-BODY channel and its CROWD limbs are reused byte for byte) →
> **BN-C0** (the CORRIDOR membership test and its present/arrived split, reused and anchored;
> its C3 lane-occupancy class is the finding this census decomposes) → **BQ-T1** (every lane
> face UNMOVED by the cushion ⇒ **world 12 is not walked**) → this census.
> Census form of record: [`BN-C0-BOUNCE-CENSUS.md`](BN-C0-BOUNCE-CENSUS.md).
> Instrument: `scripts/probes/ln-c0-lane-census.ts`.
> Artifact: `docs/world-model/data/ln-c0-lane-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> **THE TWO SHUT SEAMS THIS CENSUS IS FOR**, with their exams' verdicts of record:
> **CTB** (`CHECK-TO-BALL-CONTRACT.md` — the support plane's 2D freedom) — **CTB-T1 (#226):
> F-CTB-a FIRED**, static plane geometry is not the binding constraint, and **two doses were
> DISQUALIFIED for CLUMPING** (spacing-under-4-m +0.0527 / +0.0441 beyond the frozen
> tolerance). **OBM** (`OFFBALL-MOVEMENT-CONTRACT.md` — the percept-fed movement policy) —
> **OBM-T1 (#230): F-OBM-a FIRED**, no policy dose moved the supply, but the movement was
> **GUARD-CLEAN** and ⭐ **spacing-under-4-m IMPROVED resolvedly at the MARKER-ESCAPE corner**
> — the one recorded dose that moved the user's own first sentence's face in the right
> direction, banked as a labelled fact and never followed.
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. **IT SHIPS NOTHING**, scores no
> hypothesis and **arms no mechanism** — it NAMES a lever, it does not pull one. The commander
> rules.
> ⛔ **X-SRC-ZERO**: no file under `src/` or `tests/` is created or edited. The probe CALLS
> the shipped exports (`formationSpot`, `supportSpot`, `closestPointOnSegment`, `a4MatchFlags`,
> `armA4World`) and reads public `Match` / `Team` state per tick. **THERE IS NO WRAPPER** —
> `gLockstep` proves observed ≡ unobserved byte for byte, **PER ARM**.
> ⛔ **WORLD 13 IS THE BASE, UNTOUCHED** — the play-test entry banked at #387 is neither
> reverted nor promoted, and both user gates (world 12 and world 13) remain the user's.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**THE USER'S VERDICT, VERBATIM** (#368 item 1, received 2026-09-03):

> 「12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上」

**#388 item 2, the scope this census instruments, VERBATIM:**

> *"⭐⭐ **LN-C0 DISPATCHED — 「谁站在传球线上」 THE LANE CENSUS** (a C0 census; the BN-C0 /
> BQ-C1 form; X-SRC-ZERO; definitions frozen at the executor's §P). (i) ARMS: **E13** (world 13
> EMPTY-BOOK — `a4MatchFlags(13)` + `armA4World(m, null, 13)`; the new base) and **D13** (dosed
> via the shipped loaders, the two byte-hashes pinned), paired on shared seeds; world 12 is NOT
> walked (BQ-T1 showed every lane face unmoved by the cushion — stated, with the fields). (ii)
> POPULATION A — THE LANE: every MEASURED GROUND PASS (PT-C0's definition, byte for byte) at
> its RELEASE tick and at its ARM tick (the wind-up record's start — the census's right, as
> RC-C0/BN-C0 read it); the corridor = BN-C0's membership test REUSED and anchored
> (`closestPointOnSegment` from the passer to the aim; half-width `DV_CORRIDOR_SCALE` = 4 m;
> the `DV_CLEAR_RADIUS` = 1.5 m clear-the-kicker guard; the `CONTROL_RADIUS` tight bin BESIDE);
> a LANE OCCUPANT = an attacking-side OUTFIELD body that is neither the passer nor the target
> and is inside the corridor at release; opponents inside are published beside (「传到对面身上」's
> ⑤ question, not this census's read). For EVERY own occupant, from public state and the team's
> OWN sets (the ledger canon — `team.runners` · `team.arriver` · `team.overlapper` ·
> `team.chasers`, read at the release tick and at the arm tick): his DESIGNATION (runner /
> arriver / overlapper / none) · his `action.type` at release and at arm · his distance to the
> carrier, to the lane's centre line and to the target · his velocity across and along the lane
> · PRESENT (inside the corridor at the arm tick) vs ARRIVED (outside at arm, inside at
> release) · his FORMATION SPOT at release (`formationSpot` CALLED with the census's own
> arguments — a declared reconstruction) and whether THAT SPOT lies inside the corridor · his
> SUPPORT SPOT (`supportSpot` CALLED) and whether it lies inside · the pass class (toFeet /
> carried) · the OUTCOME (PT-C0's first-body channel: the target / THIS occupant / another own
> body / an opponent / none). THE CAUSE CLASSES for occupants (mutually exclusive; a FROZEN
> precedence justified from the decision surface — a designation licenses `MakeRun` over the
> fan, then the action the body actually chose): **L1 DESIGNATED** (a runner / arriver /
> overlapper at release, any action) · **L2 SUPPORT** (`SupportBallCarrier`, undesignated) ·
> **L3a SHAPE — SPOT IN LANE** (`MoveToFormationSpot`, his formation spot itself inside the
> corridor) · **L3b SHAPE — PATH ACROSS** (`MoveToFormationSpot`, his spot outside — he is
> crossing the lane to reach it) · **L4 OTHER** (`ChaseBall`, `Dribble`, a stale `ReceivePass`,
> `InterceptPass`, … — each named, none pooled). (iii) POPULATION B — THE CROWD: every sampled
> open-play tick's attacking-outfield DUP-RUN PAIRS (PT-C0's `DUP_RUN_M` = 4 m, anchored to the
> A4 battery's own constant) and the 撞车 ticks (min pairwise < 4 m); for each pair: the two
> bodies' actions and designations, whether their two FORMATION SPOTS are themselves within 4 m
> (a formation-table cause) or apart (a movement cause), the carrier's distance to the pair,
> whether either is the carrier's support or a runner; THE PAIR CLASSES: **P1 TABLE** (both
> shape-keeping, spots within 4 m) · **P2 DESIGNATED** (at least one designated) · **P3
> SUPPORT** (at least one `SupportBallCarrier`, none designated) · **P4 SHAPE-PATHS** (both
> shape-keeping, spots apart) · **P5 OTHER**. (iv) FACES per arm, with counts: occupants per
> measured pass (mean) and the share of passes with ≥ 1 own occupant; THE OCCUPANT COMPOSITION
> by cause with the MAJORITY STORED as a boolean per class (> 0.5; none ⇒ mixed); PRESENT vs
> ARRIVED per cause; P(first body = this occupant | cause) — the visible carom by cause, with
> BN-C0's own-non-target first-contact share reproduced as the total; the SPOT-in-lane share;
> THE PAIR COMPOSITION by class with the majority stored; the 撞车 share (PT-C0's face,
> reproduced on world 13) and its E13 → D13 Δ; opponents-in-lane at release beside; the
> designation ledger's own rates (runners / arriver / overlapper licensed per match; the share
> of measured passes struck while a designation is live). (v) PRE-REGISTERED READS (frozen
> literals on the E13 arm's stored majority booleans; D13 beside; the agrees booleans printed)
> … (vi) SEEDS: block **12,544,000–999** … ZERO stats; registry 73; compact JSON; the hash
> receipt outside the body; honest-limits single home; every read word STORED; universal
> sentences as stored booleans or not at all (six stages have fallen to that canon); engine
> ledgers before heuristics (the team's own designation sets ARE the ledger; `formationSpot` /
> `supportSpot` CALLED are declared reconstructions at the census's instant); the prose sweep;
> the two-fractions rule."*

**THE PRE-REGISTERED READ SENTENCES, VERBATIM from #388 item 2(v)** — frozen literals in the
instrument, selected by STORED majority booleans on the **E13** arm:

| selector | the sentence PRINTED |
|---|---|
| **L1** majority | *"THE LANE IS THE COACH'S — step ③ (retire the hand-written designations) is named first, and ② gives it the control arm."* |
| **L2** majority | *"THE LANE IS THE SUPPORT SEAT'S — step ② (arm obmMovement + ctbSupportPlane: the percept-driven support choice) is named first."* |
| **L3a** majority | *"THE LANE IS THE FORMATION TABLE'S — the spots themselves stand in the passing lane; the table, not a decision, is named."* |
| **L3b** majority | *"THE LANE IS THE SHAPE-KEEPER'S PATH — he crosses the lane on his way to his spot; step ② (movement) is named."* |
| **L4** majority **or no majority** | *"THE LANE IS MIXED — the commander decides with the table."* |
| **P1** majority | *"THE CROWD IS THE FORMATION TABLE'S — two spots within four metres."* |
| **P2** majority | *"THE CROWD IS THE COACH'S."* |
| **P3** majority | *"THE CROWD IS THE SUPPORT SEAT'S."* |
| **P4** majority | *"THE CROWD IS MOVEMENT — shape-keepers crossing."* |
| else | *"THE CROWD IS MIXED — the commander decides with the table."* |

plus the two agreement sentences, each selected by a STORED boolean: *"THE DOSED WORLD AGREES
ON THE LANE MAJORITY"* / *"THE DOSED WORLD DISAGREES ON THE LANE MAJORITY"* and *"THE DOSED
WORLD AGREES ON THE CROWD MAJORITY"* / *"THE DOSED WORLD DISAGREES ON THE CROWD MAJORITY"*.

### in plain football language

The user's first sentence was 「有人挤人」 — our attackers standing on top of each other — and the
bounce he SEES is a pass hitting **a teammate who was standing in the lane and was never meant
to get it**: one ground pass in ten meets such a body first, and we lose it four times out of
five. The cushion door did not touch that. Two ways of fixing an attacker's off-ball movement
are already built and switched off, and both failed their exams. **Before switching either on,
this census asks the only question that decides which one to pull:**

1. **When the ball is struck, who is standing on the line?** For every ground pass along the
   ground, the census draws the four-metre corridor from the kicker to the point he aimed at,
   and lists every one of OUR OWN outfielders standing inside it who is neither the kicker nor
   the intended receiver.
2. **What put him there?** Four honest answers, in a fixed order. **The coach told him to run**
   (he is in the team's own runner / arriver / overlapper list — the engine's own ledger, read,
   never guessed). **He is going to help the man on the ball** (his chosen action is the
   support fan). **His shape position is itself on the line** (the table put his spot in the
   lane — no decision required). **He is crossing the line to get to his spot.** Anything else
   is named one by one.
3. **Did he walk into the lane, or was he already there when the kicker started his swing?**
   The engine keeps a wind-up record, so the census can look at the moment the pass was ARMED
   as well as the moment it left the boot.
4. **And when two of ours are inside four metres of each other, why?** The same four answers,
   plus the one only this census can ask: **were their two shape positions themselves within
   four metres of each other?** If they are, the crowding is the formation table's, not
   anybody's decision.

⛔ Nothing here is armed, ships, or is blamed. The census prints one sentence for the lane and
one for the crowd, from a list frozen before any seed was walked, and stops.

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — two, PAIRED on shared seeds; and why world 12 is not walked

Arm `k` walks seed `s` with the **IDENTICAL population construction** (PT-C0's own `buildMatch`
plumbing: genomes and squads drawn from the seed exactly as it does, the same 240 s match), so
the two arms differ **ONLY** in the world's own books and **every Δ is PAIRED per seed**.

| arm | composition — the composer **CALLED, never copied** | gate on the match |
|---|---|---|
| **E13** | **world 13 EMPTY-BOOK — the new base**: `a4MatchFlags(13)` as construction flags + `armA4World(m, null, 13)` | `bqArmedVersion(m) === 13` |
| **D13** | **world 13 DOSED — THE FORM THE USER PLAYS**: the same, plus the two doses from the **SHIPPED LOADERS THEMSELVES** (`loadL3Dose` / `loadPcDose`, CALLED) | `bqArmedVersion(m) === 13` |

⭐ **`bqArmedVersion` is a deep gate, not a flag check**: it calls `raArmedVersion`, which calls
`corridorArmedVersion`, so asserting it asserts world 12's five delivery/access doors, world
11's corridor price **and the two RA gene PINS on both effective genomes** — *the gene set as
world 13 pins it* — before adding `bqCushion`. `gWorld` asserts it on **every** walked match and
the construction receipt, together with: `bqCushion` TRUE · **`obmMovement` and
`ctbSupportPlane` ABSENT** (⛔ the two step-② seams are NOT armed here — this is the census of
the lane **as it stands**) · every RC/BF flag absent (`rcAnticipate`, `rcReady`, `bfFacingCost`)
· `info.genome` clean of the RA / corridor / RC / CTB / OBM genes (canon: dose placement,
#270.2 / #334 item 1) · and `emergentPosOn()` TRUE (§P.B). It is pinned again on a CONSTRUCTED
match of **each** arm at scratch seed **900,003,470**.

**THE DOSES ARE PINNED.** `gDoseSource` hashes the FILE BYTES this process read from
`docs/world-model/data/l3-t1-convergence-exam.json` and
`docs/world-model/data/pc-t1-learning-exam.json` and compares them to the values #388 item 2(i)
pinned (`a41a114c…37db` · `0301d710…982f`); a mismatch is `process.exit(3)` **before any seed is
walked**. Canon, VERBATIM: *"a dose-source guard should hash the bytes it reads, not a
self-declared field"* (home: `BU-T1-MT-COMPOSITION.md` §COMMANDER CORRECTIONS item 6).
⚠ The `tables` argument cannot reach these arms — `armA4World`'s BQ branch **RETURNS** before
the `tables === null` refusal (anchored) — so the user's form and the empty-book form differ
**ONLY in the two doses**, exactly as PT-C0 §P.D traced.

**⛔ WORLD 12 IS NOT WALKED, AND HERE ARE THE FIELDS.** BQ-T1 §R4 measured the lane faces across
the cushion door on the SCORED pair, and every one of the three intervals **CONTAINS ZERO**:
`contact.ownTargetSideBackShare` +0.003593 [-0.001268, +0.008158] ·
`crowd.crashShare` -0.001125 [-0.006531, +0.004672] ·
`bounce.ownNonTargetFirstShare` -0.001005 [-0.004069, +0.002121]. ⇒ world 13 is the base.

**THE PAIRED Δ (D13 − E13)** is published on **every** face by a 2,000-draw cluster bootstrap
that resamples SEEDS, both arms moving together inside every draw. ⛔ **The census SCORES
nothing.** The reads rest on the **E13** arm's stored majority booleans, with **D13**'s printed
beside at the same precision and the same prominence.

### §P.B THE TWO POPULATIONS, THE CORRIDOR, THE SETS, THE SPOTS AND THE FACES

#### POPULATION A — THE LANE

| quantity | frozen form |
|---|---|
| **THE POPULATION** | ⭐⭐ **PT-C0's, BYTE FOR BYTE**: every **MEASURED GROUND PASS** — `isMeasurableGroundPass` (`shortPass` \| `throughBall` \| `cutback`, ground launch, with a pending-pass target), registered **at the strike** via `pendingPass`, anchored at PT-C0's and RA-T1B's own source lines. **ONE flight is tracked at a time**; a new release RETIRES the previous one — and ⭐ the retired flight is **BOOKED**, so every flight enters the faces exactly once |
| **E, THE AIM POINT** | PT-C0's own: where the strike resolved a TRACKED wind-up record for this passer and target, `E = aim + (aimLead ?? 0)`; otherwise the target's own position at the strike tick. **LAUNCH** = `ball.pos − ball.vel · DT`; a pass with `\|E − launch\| ≤ 1e-6` has **NO launch line** and enters no corridor face |
| **⭐⭐ THE CORRIDOR** | **BN-C0's membership test, REUSED and anchored** (its `inCorridorOf` is the code this census COPIES): `closestPointOnSegment(launch, E, body)` **CALLED**; inside ⇔ the closest point is at least `DV_CLEAR_RADIUS` = **1.5 m** from the launch **and** the body is nearer than the half-width `DV_CORRIDOR_SCALE` = **4 m**. ⚠ The engine ships **NO boolean corridor width** (its shipped corridor is a SOFT exposure) — the test is this family's construction from **the engine's own two constants and no new one**, and says so. The **`CONTROL_RADIUS` half-width** is published **beside** on every face as a **TIGHT robustness BIN**. ⛔ A bin, not a second definition |
| **⭐⭐ A LANE OCCUPANT** | an **attacking-side OUTFIELD** body (`role !== 'GK' && !sentOff`) that is **neither the passer nor the target** and is inside the **WIDE** corridor at the **RELEASE** tick |
| **THE ARM TICK** | the tick at which a NEW `pendingPassWindup` record appears (its `gid` / `readyTick` / `aim` / `targetGid` / `aimLead` are the record's own fields, anchored). At that tick the census snapshots, for every outfield body but the passer: corridor membership at **both** half-widths **from the passer's ARM-tick position to the record's own aim**, his designation and his `action.type` |
| **⭐⭐ PRESENT vs ARRIVED** | BN-C0's split, MIRRORED. Every occupant is inside at release by definition: **PRESENT** = also inside the ARM-tick corridor · **ARRIVED** = outside it at the arm tick · **`noWindup`** = the strike resolved NO tracked record (a restart or a first-time strike) so there is no arm tick at all — **COUNTED**, never imputed into either |
| **⭐⭐ THE DESIGNATION** | **READ OFF THE TEAM'S OWN SETS at the tick** — `team.runners` (a Set of player indices) · `team.arriver` · `team.overlapper` · `team.chasers`, each anchored at its `Team.ts` declaration, with `assignRunners` (their ONE writer) and its own licensing lines anchored beside. ⛔ **Never inferred from movement.** Precedence runner > arriver > overlapper > chaser > none. ⛔ Only the first THREE count as "designated": a **chaser** is a loose-ball assignment, not an in-possession licence, and he lands in **L4** under his own action's name |
| **THE ACTION** | the body's own `action.type`, read at release and (from the snapshot) at arm. The vocabulary is read off **`ActionType`'s own union** at run time — **23** names — and never re-typed |
| **⭐⭐ THE FORMATION SPOT — A DECLARED RECONSTRUCTION** | `formationSpot(p, team, ball, hasBall = **TRUE**, opp = the other team, abandonRest = `match.abandonRestDesignation === team.side`, pmMover = `match.pmLaneConvergence && match.phase === 'playing'`)` — **CALLED**, never re-implemented. The last two arguments are the **PRODUCTION recipe**, read off the match (anchored at `actionExecutor.ts`); `hasBall = TRUE` is **the census's own declared argument** for the side in possession (#388 item 2(ii)), and the receipt `receipt.hasBallRecipeAgreesShare` publishes how often the production recipe agrees at the census's instant |
| **⭐⭐ THE TOGGLE, STATED** | `formationSpot` opens with `if (emergentPosOn()) return emergentStation(…)`. The toggle **DEFAULTS ON**, its only env door (`EMERGENT_POS=0`) is **REFUSED by this instrument's §1 envelope**, and `setEmergentPos` is never called here ⇒ **WORLD 13 TAKES THE `emergentStation` PATH** (the DEFAULT-ON emergent positioning field). The value is READ from the shipped function, STORED per walked match, and asserted by `gWorld` |
| **⭐⭐ THE SUPPORT SPOT** | `supportSpot(p, team, ball, ctbPlane = `match.ctbSupportPlane`)` — **CALLED** with the shipped argument the world uses, which is **FALSE** here (asserted by `gWorld`) |
| **THE SPOT-IN-LANE TEST** | ⭐ **THE SAME corridor membership test**, applied to the SPOT instead of the body. Published two ways: over **ALL** eligible own outfield bodies at release (how often the table itself puts a spot in the lane) and over the occupants |
| **THE OUTCOME** | PT-C0's **FIRST-BODY** channel, reused: the first tick after the release at which `ball.lastTouch` is a body OTHER than the passer, classed `ownTarget` / `ownNonTarget` / `opponent` / `none`. ⭐ **P(first body = THIS occupant \| cause)** is the visible carom by cause; the `ownNonTarget` cell REPRODUCES BN-C0's own-non-target first-contact share as the total |
| **THE OPPONENTS** | opponents inside the corridor at release are counted with the SAME test and the SAME present/arrived split, published **BESIDE** (「传到对面身上」's ⑤ question) and ⛔ **never read** |

#### ⭐⭐ THE CAUSE CLASSES AND THEIR FROZEN PRECEDENCE — `L1 > L2 > L3a > L3b > L4`

| class | frozen definition |
|---|---|
| **L1 DESIGNATED** | a **runner / arriver / overlapper** at release, **whatever his action** |
| **L2 SUPPORT** | `SupportBallCarrier`, **undesignated** |
| **L3a SHAPE — SPOT IN LANE** | `MoveToFormationSpot`, undesignated, **his CALLED formation spot lies inside the release corridor** |
| **L3b SHAPE — PATH ACROSS** | `MoveToFormationSpot`, undesignated, **his spot lies outside** — he is crossing the lane to reach it |
| **L4 OTHER** | everything else — **each action NAMED with its own count** (`bins.l4Action`), none pooled |

**WHY THIS ORDER, from the decision surface itself** (every line anchored): a DESIGNATION is a
**top-down licence** written by `assignRunners` into the team's own sets, and the `MakeRun`
candidate **exists at all only for an already-licensed body** — the licence therefore describes
what put him in motion whatever score won, so it is read **FIRST, off the engine's ledger**
(canon, VERBATIM: *"an event attribution reads the engine's own record when one exists
(`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no record
exists, and says so"*, home: `RC-T1B-READY-EXAM.md` §COMMANDER CORRECTIONS item 5). Only then is
the action he actually **CHOSE** read; and inside the shape-keeping action the **SPOT** is asked
before his **path** to it, because a spot in the lane needs no movement story at all.

#### POPULATION B — THE CROWD

| quantity | frozen form |
|---|---|
| **SAMPLE CADENCE** | PT-C0's, which is the A4 battery's own: every `SAMPLE_EVERY` = **10** ticks, `m.phase === 'playing'`, **anchored at the battery's own line**. ⛔ NO new constant |
| **THE ATTACKING SIDE** | `ball.owner.side` when the ball is OWNED; else the passer's side of a LIVE tracked measured-ground-pass flight; else the tick has **NO possession side** and is **EXCLUDED**, counted in `crowd.unattributedSampleShare` |
| **THE POPULATION** | the A4 limb's own filter, verbatim: `role !== 'GK' && !sentOff` on the attacking side |
| **THE DUP-RUN PAIRS** | the A4 battery's own limb and its own constant, **anchored**: attacking outfield **PAIRS** (`b > a`, each counted once) with `hypot < DUP_RUN_M` = **4 m** |
| **⭐ THE 撞车 FACE** | PT-C0's, REPRODUCED on world 13: the share of sampled attacking ticks whose **MINIMUM PAIRWISE** outfield distance is below 4 m (bins 0.5 m × 61 stored, as PT-C0 stores them) |
| **THE SPACING LIMB** | PT-C0's nearest-same-side-outfielder mean, with its own 0.5 m × 61 bins |
| **PER PAIR** | both bodies' `action.type` and designations (read off the same team sets) · whether their two **CALLED formation spots** are themselves within `DUP_RUN_M` · the carrier's distance to the pair's midpoint (bins; pairs sampled with no owner are counted and enter no bin) · whether either is a `SupportBallCarrier` or in `team.runners` |

#### ⭐⭐ THE PAIR CLASSES AND THEIR FROZEN PRECEDENCE — `P2 > P3 > P1 > P4 > P5`

**P1 TABLE** (both `MoveToFormationSpot`, undesignated, spots within 4 m) · **P2 DESIGNATED**
(at least one designated) · **P3 SUPPORT** (at least one `SupportBallCarrier`, none designated)
· **P4 SHAPE-PATHS** (both `MoveToFormationSpot`, undesignated, spots apart) · **P5 OTHER**.

The reading order is the **same** as the occupant classes' — the engine's own ledger first, then
the chosen action, then the table's geometry. ⭐ **The five are DISJOINT BY CONSTRUCTION** (P1
and P4 require BOTH bodies undesignated and shape-keeping and differ only in the spot distance;
P3 requires nobody designated and at least one supporter, which no both-shape-keeping pair can
be), so **the precedence does no work** — `gWalkFixtures` proves that on constructed pairs.

### §P.C THE READS (the literals and their selectors)

The sentences of §0 are **frozen literals in the instrument**. The **SELECTOR** is a STORED
majority boolean per class, computed from the artifact's own composition shares:
`majority(X) = share(X) > 0.5`; if exactly one class holds a majority it is the **majority
class**, otherwise `mixed = true` and the no-majority sentence prints. ⭐ **An L4 majority
prints the MIXED sentence** — #388 item 2(v)'s own wording ("L4 majority or no majority ⇒ THE
LANE IS MIXED"), stated here before any battery seed. The **READS OF RECORD** are selected on
the **E13** arm's booleans; **D13**'s booleans, shares and sentences are printed BESIDE. Two
agreement booleans (`E13 majority class === D13 majority class`, once for the lane and once for
the crowd) select the two agreement sentences. `gReadWords` re-derives **every** share, **every**
boolean, both `mixed` flags, both majority classes, all four printed sentences and both
agreement words by applying the frozen rules to the **SERIALIZED** per-seed cells off disk, and
asserts every printed sentence is one of the frozen literals. Canon, VERBATIM: *"a
counterfactual verdict sentence ('had X been scored, the rule would read W') quotes a word the
instrument STORED by applying the frozen rule to X's stored interval; a universal sentence about
a table ('every bin', 'the one bin') is a stored boolean or is not written"* (home:
`BF-T1-FACING-COST-EXAM.md` §COMMANDER CORRECTIONS items 1–2). ⭐⭐ **Six stages in a row have
fallen to that sentence**; this doc writes no universal that is not a stored boolean.

### §P.D THE ESTIMATOR

**Cluster bootstrap over match SEEDS, 2,000 draws**, rng seeded from the block base 12,544,000.
Every published share carries a 95 % percentile interval and its half-width; every paired Δ is
**D13 − E13** on the seeds the arms share, so the interval is PAIRED by construction. Medians
are **BIN-DERIVED** (the lower edge of the bin whose cumulative count first reaches n/2) so
`gFaces` re-derives every one off disk — canon, VERBATIM: *"the re-derivation gate covers EVERY
published face; a percentile face requires stored bins"*. ⛔ **Nothing in this census is scored**
and ⛔ **no null is cut anywhere**: an interval containing zero reads *"unresolved at this
power"*.

### §P.E SEEDS AND SIZING

* **Block 12,544,000–999**: battery seeds **12,544,000–12,544,997** (**N_FROZEN = 998** — #388
  item 2(vi)'s own cap, the largest the block affords after the construction receipt),
  construction receipt **12,544,999**. Each seed is walked **ONCE PER ARM** ⇒ **1,998 walks
  booked = walked**. The **UNWALKED TAIL IS DECLARED**: seed **12,544,998**, stored in the
  artifact's `seeds.unwalkedTail`.
* **Scratch, out-of-band only** (canon, VERBATIM: *"verifier scratch walks use the stage's own
  consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin
  block"*): smoke **900,003,400–411** with its receipt at **900,003,420**; the **world pin** at
  **900,003,470**; **gLockstep** at **900,003,490–491**. ⭐ **EVERY scratch seed walked is
  STORED in the artifact's `seeds` block.** ⚠ No trace flag is used by this instrument at all,
  so the trace-inert band 900,003,480–481 is **NOT walked**.
* **Stats consumed: ZERO.** Registry **73** untouched.
* **SIZING** (the house form; §DEV-PREFLIGHT's smoke is the variance source). The reads rest on
  the two COMPOSITIONS on the **E13** arm, so all ten shares the selection rules can turn on are
  sized. **THE DECLARED HALF-WIDTH IS 0.05** — the value the block certifies on every row:

| face (arm E13) | realised hw (12 clusters) | target | N required | resolvable at 998 |
|---|---|---|---|---|
| `composition.L1` | 0.050630517023959654 | 0.05 | **26** | ✅ |
| `composition.L2` | 0.04984116551648593 | 0.05 | **25** | ✅ |
| `composition.L3a` | 0.05124117136838627 | 0.05 | **26** | ✅ |
| `composition.L3b` | 0.018855882121188244 | 0.05 | **4** | ✅ |
| `composition.L4` | 0.01779529522595661 | 0.05 | **4** | ✅ |
| `pair.P1` ⚠ | 0 | 0.05 | **0** | ⚠ DEGENERATE — see below |
| `pair.P2` | 0.06808052834571476 | 0.05 | **46** | ✅ |
| `pair.P3` | 0.0737102451872949 | 0.05 | **54** | ✅ |
| `pair.P4` | 0.011595668837312653 | 0.05 | **2** | ✅ |
| `pair.P5` | 0.011717005608504277 | 0.05 | **2** | ✅ |

  Expected half-widths at N_FROZEN: 0.00555184988302177 · 0.005465294158687428 ·
  0.0056188107092180984 · 0.002067627057793062 · 0.0019513292284139996 · 0.0 ·
  0.007465317274033571 · 0.008082639486516243 · 0.0012715140287334692 · 0.0012848191178090492
  (MDEs 0.007935850192757459 · 0.0078121268796067286 · 0.008031564431556025 ·
  0.002955479512390351 · 0.0027892426415921127 · 0.0 · 0.010670972878663226 ·
  0.011553377248764395 · 0.001817510390703543 · 0.0018365287712307243).
  ⚠⚠ **THE `pair.P1` ROW IS DECLARED, NOT SIZED**: the P1 class was **EMPTY in the 12-cluster
  smoke**, so its bootstrap half-width is 0 and its "N required = 0" is a **degenerate variance
  estimate, not a power claim**. It is reported at the battery with its own realised interval,
  and ⛔ no null is cut on it. ⚠ **What else is NOT sized is stated instead**: every face on a
  small cell — the `noWindup` presence cell, the per-cause carom cells, the L4 action items, the
  tight-corridor bins — is reported with its own realised interval and no null is cut on it.
* **Bins** (frozen, all STORED EDGES — ⛔ never rules): nearest-mate 0.5 m × 61 · min-pairwise
  0.5 m × 61 (both PT-C0's own grids) · occupants per pass 1 × 7 · occupant→carrier 2 m × 16 ·
  occupant→centre line 0.5 m × 12 · occupant→target 5 m × 13 · velocity across the lane ±1 m/s
  × 13 signed · velocity along the lane ±1 m/s × 13 signed · carrier→pair midpoint 2 m × 16 ·
  cause × 5 · cause × presence 5 × 3 · pair class × 5 · designation × 5 · action × 24 (the
  union's 23 names + `unknown`) · first-body class × 4 · opponent presence × 3 (and its tight
  variant). Flight retire cap **720 ticks** (PT-C0's own, inherited).

### §P.F THE GATES (all liveness/receipt — NEVER direction)

`gWorld` (§P.A, per arm, on EVERY walked match and the receipt, plus the constructed world pin)
· `gDoseSource` (the shipped loaders CALLED; the FILE BYTES hashed and compared to the PINNED
values; exit 3 on mismatch) · `gAnchoredConstants` (**60 anchored sites with line receipts**:
THE FOUR DESIGNATION SETS as `Team.ts` declares them and `assignRunners`, their ONE writer, with
`RUN_ROLE_W`, the count rule, the scoring line, the arriver's arc trigger, 套边's width ×
`overlapW` gate and the possession-side early return · THE DECISION SURFACE (`MakeRun`'s
licensing line, the arriver and overlapper licence reads, the `SupportBallCarrier` push site and
`W.supportBase`, **both** `MoveToFormationSpot` push sites enumerated and `W.formationBase`, the
stored top-4 `scores`) · `formationSpot`'s and `supportSpot`'s SIGNATURES, the `emergentPosOn()`
TOGGLE at `formationSpot`'s head, its DEFAULT-ON line and its only env door · the executor's
PRODUCTION argument recipe for both functions · THE CORRIDOR (`DV_CORRIDOR_SCALE`,
`DV_CLEAR_RADIUS`, `laneOpenness`'s own two lines, `closestPointOnSegment`, `CONTROL_RADIUS` and
BN-C0's own `inCorridorOf`) · PT-C0's crowd limbs and the A4 battery's own `DUP_RUN_M` and
`SAMPLE_EVERY` at their own lines · PT-C0's population / ground-launch / first-body ladders and
RA-T1B's ancestor line · the wind-up record's fields, `pendingPass` and `possessionSide` ·
world 13's own composition lines; the ACTION vocabulary is READ OFF `ActionType`'s own union) ·
`gLedgerRead` (⭐ every designation cell is read off a team set: `designationOf` is a PURE
function of the four sets and the fixtures show the class FOLLOWING an EDITED set — index 2 in
`runners` reads `runner`, the same index with the set holding 3 instead reads `none` — with the
whole precedence pinned branch by branch, and both arms carry occupants read as `runner` and as
`none`) · `gWalkFixtures` (**93** fixtures: the corridor test on constructed geometry at both
half-widths incl. the clear-the-kicker guard on both sides of its own radius, the spot-in-lane
test, the cause precedence on constructed occupants, the pair classes and their disjointness,
the present/arrived split, PT-C0's population and crowd limbs and every bin helper) ·
`gClassesNonVacuous` (own occupants, DESIGNATED occupants, dup-run pairs, 撞车 ticks and
opponents-in-lane all exist on BOTH arms) · `gReproducePTC0` (PT-C0's three limb lines anchored
in its own instrument; its `nearestMateOf` / `dupRunPairsOf` / `minPairwiseOf` COPIED; and the
撞车 and dup-run quantities recomputed by a **SECOND, independently shaped implementation** on
EVERY sampled tick of EVERY walked match — the two agree cell for cell. ⚠ What is reproduced is
the **ARITHMETIC**, not PT-C0's NUMBERS: PT-C0 walked worlds 12/11/shipped, this census walks
world 13, and no equality of values is asserted anywhere) · `gLockstep` (no wrapper; observed ≡
unobserved byte for byte, per arm, on out-of-band scratch) · `gSrcUntouched` (`git diff --stat
HEAD` **AND** `git status --porcelain` over **`src/` AND `tests/`**, all empty — canon:
xSrcUntouched) · `gSeedsBookedEqualWalked` · `gN` · `gHashOrder` (the body hash computed
**LAST** off an explicit ALLOWLIST SCHEMA that **INCLUDES `allGreen`** — BQ-T1 §CORR 4 — with a
NON-body `receipts.hashReproducesFromFile`) · `gReadWords` · `gFaces` (**EVERY** published face,
paired Δ, bin, median and partition re-derived off the **SERIALIZED** artifact).

Canon quoted where it applies — VERBATIM: *"the hashed body is built from an explicit ALLOWLIST
SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"*
(home: `PC-T0-LATENCY-SEAM.md` §COMMANDER CORRECTIONS item 1); VERBATIM: *"the body hash is
computed after every body key is assigned, and a NON-body receipt field records that the hash
reproduces from the written file"* (home: `RC-T1A-PRECUE-EXAM.md` §COMMANDER CORRECTIONS item 3,
ruling #372 item 3); VERBATIM: *"an artifact is written as compact JSON — no indentation; the
hash is over the canonical body regardless; pretty-printing is a reader's tool, not a storage
form"* (home: ruling #372 item 5); VERBATIM: *"a src-extracted constant pins its extraction to
the NAMED call site — anchored match + line receipt — never first-occurrence"* (home:
`BK-C0-BODYBALL-CENSUS.md` §COMMANDER CORRECTIONS item 1, ruling #306 item 4); VERBATIM: *"a
seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's site"* (home:
`PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 1) — the four needles that legitimately
occur twice are declared with `want = 2` and every occurrence's line is stored; VERBATIM: *"a
field carries the unit its name claims"* (home: ruling #294 item 3); VERBATIM: *"a scored face's
walk-side predicate is pinned — anchored extraction or fixture — because the re-derivation gate
proves arithmetic, not definitions"* (home: `DF-T3-SURFACE-EXAM.md` §COMMANDER CORRECTIONS item
2); VERBATIM: *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a
gated face"* (home: `PC-T2-ARMED-WORLD-READ.md` §COMMANDER CORRECTIONS item 4); VERBATIM: *"a
stage doc's numeric sweep covers EVERY numeric literal in prose at ANY precision; a hand-written
percentage is the likeliest second copy"* (home: `BF-C0-MOVEMENT-FACING-CENSUS.md` §COMMANDER
CORRECTIONS item 6); VERBATIM: *"a starred finding states its |Δ|÷half-width ratio"* (home:
`BU-T0B-PRICE-SEPARATION.md` §COMMANDER CORRECTIONS item 2); VERBATIM: *"a gate's NOTE derives
from the same pinned values the gate checks; a count typed beside its pin is a second copy"*
(home: `PT-C0-PLAYTEST-FORENSIC-CENSUS.md` §COMMANDER CORRECTIONS item 1) — every gate NOTE here
interpolates the same values its `ok` reads; VERBATIM: *"a stage doc's HONEST LIMITS list is the
ONE home; the artifact stores that list verbatim or stores none"* (home:
`RC-C0-COOPERATION-CENSUS.md` §COMMANDER CORRECTIONS item 3, ruling #367 item 3) — **this
artifact stores NONE**; §HONEST LIMITS below is the list of record. Dose and reconstruction
receipts are **never** quoted as football effect sizes (ruling #289 item 1 +
`BU-T1-MT-COMPOSITION.md` §COMMANDER CORRECTIONS item 5).

## §DEV-PREFLIGHT — the sizing smoke, disclosed in full

A **12-cluster scratch smoke** (`LNC0_MODE=smoke LNC0_N=12`, seeds **900,003,400–411**, receipt
900,003,420, world pin 900,003,470, lockstep 900,003,490–491, artifact off the canonical path at
`/tmp/ln-c0-smoke.json`) was run **BEFORE this freeze**. Its realised half-widths were read out
of the smoke artifact's own `faces[].halfWidth` fields on the E13 arm — **never re-typed from
the console's rounded print** — and are hardcoded in the instrument's `SIZING_INPUTS` (the ten
rows in §P.E's table).

**Disclosed honestly:**

* The first run went **RED on two gates**, both instrument defects fixed before this freeze and
  both stated here so the record shows what moved and when: (a) `gAnchoredConstants` — four
  needles were pinned at **1** occurrence and the files honestly carry **2** (the
  `MoveToFormationSpot` push site exists twice — in possession and out of it; PT-C0's
  `isMeasurableGroundPass` and `isGroundLaunch` each appear in its definition **and** in its own
  anchor pin; `armRaWorld(match, l3Dose, pcDose);` is called by both `armBqWorld` and
  `armA4World`'s RA branch). The pins were corrected to 2 and every occurrence's line is stored
  — the anchored-extraction canon working exactly as intended: a wrong count is a RED gate, not
  a silent pass. (b) `gWalkFixtures` — the `ActionType` union was asserted at 24 names and
  honestly has **23**; the fixture and the gate now read the union's own length.
  After both fixes the same 12-cluster smoke re-ran **14/14 GREEN**, with `gFaces` at **282/282
  face-and-Δ** and **89/89** stored-bin / median / partition / read-word / sizing checks.
* ⚠ **12 clusters is a NOISY variance estimate** — a strictly weaker assumption than sizing off
  a published battery. Said here, before the battery. The **P1 row is degenerate** (§P.E).
* ⚠ The smoke's own POINT readings are **UNPOWERED and bind nothing**. For the record, so nobody
  can claim the freeze was written after seeing a battery: on 12 scratch seeds the smoke read an
  occupants-per-pass ≈ 0.41 (E13), a composition ≈ L1 0.38 / L2 0.36 / L3a 0.12 / L3b 0.09 /
  L4 0.04, a pair composition ≈ P1 0.00 / P2 0.54 / P3 0.27 / P4 0.09 / P5 0.11, a 撞车 share
  ≈ 0.47, and printed **"THE LANE IS MIXED"** with **"THE CROWD IS THE COACH'S"**. **None of
  these numbers is a finding**; the battery's own §R replaces every one of them, and a battery
  that printed different sentences would be reported as-is.
* The smoke ALSO confirmed instrument liveness: both arms carried measured ground passes, own
  lane occupants, DESIGNATED occupants, dup-run pairs, 撞车 ticks and opponents in the lane;
  `gLockstep` was green on all 4 arm × scratch-seed walks; the world pin held on both arms; and
  the crowd arithmetic's two independent implementations agreed on every walked match.
* **This section binds nothing.** The freeze is §0–§P.F above.

## §R RESULTS (every number below QUOTES the artifact's own fields at 6 dp — the artifact
## is the numbers of record, per the #357 standing order)

**RUN RECEIPTS.** Freeze **`b0c0bb6`** (`stage.headAtRun` =
`b0c0bb68b8c6c4ddfc51978c6fafaf931523c98b`).
`git diff b0c0bb6..<results> -- scripts/probes/ln-c0-*.ts` is **EMPTY (0 bytes)** — no frozen
constant, no frozen definition and no frozen printed form moved after sight. **`allGreen` =
true** (a STORED boolean; 14 of 14 gate objects carry `ok: true`); `gFaces` **282/282
face-and-Δ** checks and **89/89** stored-bin / median / partition / READ-WORD / sizing checks
re-derived from the SERIALIZED artifact off disk. Artifact
`docs/world-model/data/ln-c0-lane-census.json` (**4,567,852 bytes**), `instrumentSha256 =
851f0b079dc52fd8485e876b0c593e91815e14dd6dd388417bb69736bd981abc`, `hashedBodySha256 =
c11cfaf92d21e5ef86fb2759a7fa951372d4d1d83ec3d0976cee1066db9dd3c3`, **file byte-hash
`7f6f2a9e5083737529b06324d94831deb0e13e36107dc91104b4f60a835c0ddb`**, and the NON-body
`receipts.hashReproducesFromFile` = **true**. Battery **998 seeds (12,544,000–12,544,997) × 2
ARMS + the construction receipt at 12,544,999 ⇒ BOOKED = WALKED = 1,998 walks**; the
**UNWALKED TAIL IS DECLARED**: `seeds.unwalkedTail` = **[12544998, 12544998]**. Scratch: the
sizing smoke on 900,003,400–411 (receipt 900,003,420), the world pin at 900,003,470, lockstep on
900,003,490–491 — every one STORED in the `seeds` block. **ZERO stats consumed** — registry
**73**. `npm run typecheck` clean with the probe in the tree; `npm run fingerprint` =
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **the literal of record in
`tests/a4HomeGrant.test.ts`, UNCHANGED** (a census cannot move it). Wall **230.168 s**
(`perf.meanWallSecondsPerMatch` **0.113087**).

**THE RECONSTRUCTION RECEIPTS** (⛔ never quoted as football effect sizes):
`receipt.hasBallRecipeAgreesShare` = **1.000000** on both arms (74,691 of 74,691 releases on
E13; 83,320 of 83,320 on D13): the stored share of measured releases at which the production
`hasBall` recipe returned the same value as the census's declared `hasBall = TRUE` argument.
`receipt.armBodyMissingPerPass` = **0.000000** on both arms (0 of 74,691; 0 of 83,320): the
stored count of occupants absent from their flight's arm snapshot, over the passes. `worldPin.formationSpotPath` =
**`emergentStation` (the DEFAULT-ON emergent positioning field) — world 13 takes THIS path**.

### §R1 THE LANE — occupants per pass, the composition and the majority

| face | E13 | D13 | Δ (D13 − E13), 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|
| `lane.occupantsPerPass` | **0.390020** | **0.410970** | +0.020950 [+0.014676, +0.027166] | 3.354590 |
| `lane.tight.occupantsPerPass` (bin) | 0.127713 | 0.129093 | +0.001380 [−0.001836, +0.004687] · **CONTAINS ZERO** | 0.423104 |
| ⭐⭐ `lane.passesWithOccupantShare` | **0.328098** | **0.341563** | +0.013464 [+0.008742, +0.018116] | 2.872582 |
| `lane.tight.passesWithOccupantShare` (bin) | 0.122331 | 0.123548 | +0.001217 [−0.001857, +0.004343] · **CONTAINS ZERO** | 0.392630 |
| `lane.armRecordShare` | 0.561513 | 0.560250 | −0.001264 [−0.006007, +0.003333] · **CONTAINS ZERO** | 0.270631 |
| `lane.noWindupShare` | 0.438487 | 0.439750 | +0.001264 [−0.003322, +0.006026] · **CONTAINS ZERO** | 0.270406 |

⭐⭐ **ONE MEASURED GROUND PASS IN THREE IS STRUCK WITH ONE OF OUR OWN BODIES ALREADY STANDING
IN ITS FOUR-METRE CORRIDOR.** On the empty-book arm `lane.passesWithOccupantShare` =
**0.328098** (24,506 of 74,691 measured ground passes), and the mean count is
`lane.occupantsPerPass` **0.390020** (29,131 occupants over the same 74,691 passes). At the
BK-shell-tight half-width the same share reads **0.122331** (9,137 of 74,691) — narrowing the
corridor to the body's own reach reclassifies most of them, which is what a narrower corridor
must do. The stored `bins.E13.occupantsPerPass` histogram is
`[50185, 20213, 3970, 314, 9, 0, 0]` over the seven stored cells (0, 1, 2, 3, 4, 5, 6-or-more
occupants), summing to the same 74,691 passes.

**⭐⭐ THE OCCUPANT COMPOSITION** — denominator **29,131** own lane occupants (E13) and
**34,242** (D13):

| cause | E13 share | E13 count | D13 share | D13 count | Δ, 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|---|---|
| **L1 DESIGNATED** | **0.375270** | 10,932 | **0.387390** | 13,265 | +0.012119 [+0.005146, +0.020034] | 1.628073 |
| **L2 SUPPORT** | **0.368062** | 10,722 | **0.390193** | 13,361 | +0.022132 [+0.013432, +0.030352] | 2.616067 |
| **L3a SPOT IN LANE** | 0.102056 | 2,973 | 0.095789 | 3,280 | −0.006267 [−0.010906, −0.001747] | 1.368668 |
| **L3b PATH ACROSS** | 0.109849 | 3,200 | 0.119006 | 4,075 | +0.009157 [+0.004104, +0.014321] | 1.792511 |
| **L4 OTHER** | 0.044763 | 1,304 | 0.007622 | 261 | −0.037141 [−0.039935, −0.034400] | 13.420258 |

**THE MAJORITY IS STORED, AND THERE IS NONE.** `reads.lane.E13.majority` reads `false` for
every one of the five classes and `reads.lane.E13.mixed` = **true**, so
`reads.lane.E13.majorityClass` = **`mixed`** — the frozen rule prints the no-majority sentence
(§R8). The two leading classes are **the coach's licence** and **the support seat**, and their
shares sit within 0.007208 of each other (a stated derivation: 0.375270 − 0.368062). Together
they account for **0.743332** of occupants (a stated derivation: 0.375270 + 0.368062), against
**0.211905** for the two shape-keeping classes (0.102056 + 0.109849).

**L4's ACTIONS, ITEMISED, NONE POOLED** (`bins.<arm>.l4Action`, counts over the same occupant
denominators): E13 — `MarkOpponent` 595 · `ChaseBall` 443 · `MakeRun` 132 · `InterceptPass` 94
· `ReceivePass` 40 (1,304 in total, matching `composition.L4`'s numerator). D13 — `MakeRun` 181
· `ChaseBall` 39 · `MarkOpponent` 39 · `InterceptPass` 2 (261 in total). ⚠ An `MarkOpponent` or
`InterceptPass` occupant on the ATTACKING side is a body whose brain took the
out-of-possession branch at that tick — a decision-cadence boundary, HONEST LIMIT 1.

**THE DESIGNATION CELLS, READ OFF THE TEAM'S OWN SETS** (`occupantDesignation.*`, E13, over
29,131 occupants): `runner` **0.361162** (10,521) · `arriver` 0.008685 (253) · `overlapper`
0.005424 (158) · `chaser` **0.000000** (0) · `none` **0.624730** (18,199). ⭐ The chaser cell is
empty at this n because a chase licence is a loose-ball assignment and a measured ground pass is
struck from possession; it is REPORTED as empty, never zero-imputed.

### §R2 PRESENT vs ARRIVED, AND THE CAROM BY CAUSE

| cell | E13 | D13 | Δ, 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|
| `presence.all.present` | **0.483094** | **0.506425** | +0.023331 [+0.014247, +0.032108] | 2.612468 |
| `presence.all.arrived` | **0.037829** | 0.038199 | +0.000370 [−0.002489, +0.003283] · **CONTAINS ZERO** | 0.128046 |
| `presence.all.noWindup` | **0.479077** | 0.455376 | −0.023701 [−0.032429, −0.014819] | 2.691744 |

⭐⭐ **HE WAS ALREADY THERE WHEN THE KICKER STARTED HIS SWING.** Of the E13 arm's 29,131 own
occupants, 14,073 were inside the ARM-tick corridor too (`presence.all.present` **0.483094**)
and only 1,102 were outside it at the arm and inside at release (`presence.all.arrived`
**0.037829**); the remaining 13,956 passes carried NO wind-up record at all
(`presence.all.noWindup` **0.479077**) and are counted, never imputed. Per cause, the
present shares on E13 read `presence.L1.present` **0.480241** (5,250 of 10,932) ·
`presence.L2.present` **0.623671** (6,687 of 10,722) · `presence.L3a.present` 0.100572 (299 of
2,973) · `presence.L3b.present` 0.229375 (734 of 3,200) · `presence.L4.present` 0.845859
(1,103 of 1,304).

**⭐⭐ THE VISIBLE CAROM, BY CAUSE** — `carom.<cause>` = P(the first body the ball meets is THIS
occupant | his cause):

| cause | E13 | E13 counts | D13 | Δ, 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|---|
| L1 DESIGNATED | 0.103183 | 1,128 of 10,932 | 0.098153 | −0.005030 [−0.011871, +0.001973] · **CONTAINS ZERO** | 0.726755 |
| L2 SUPPORT | 0.123111 | 1,320 of 10,722 | 0.132251 | +0.009139 [+0.000451, +0.017251] | 1.088012 |
| ⭐⭐ **L3a SPOT IN LANE** | **0.472587** | 1,405 of 2,973 | 0.376829 | −0.095757 [−0.120624, −0.071487] | 3.897557 |
| ⭐ **L3b PATH ACROSS** | **0.367188** | 1,175 of 3,200 | 0.277546 | −0.089641 [−0.106701, −0.073032] | 5.324747 |
| L4 OTHER | 0.191718 | 250 of 1,304 | 0.168582 | −0.023135 [−0.069265, +0.029415] | **CONTAINS ZERO** · 0.468900 |
| **all occupants** | **0.181182** | 5,278 of 29,131 | 0.160037 | −0.021144 [−0.026244, −0.016125] | 4.179312 |

⭐⭐ **THE COMPOSITION AND THE CAROM DISAGREE ABOUT WHICH BODY MATTERS.** The two SHAPE classes
are the SMALLEST of the four causes by share (§R1) and the LARGEST by carom rate: an L3a
occupant — a body standing on the line because the formation table put his spot there — is the
first body the ball meets on **0.472587** of the occasions he is in the lane (1,405 of 2,973),
and an L3b occupant on **0.367188** (1,175 of 3,200), against **0.103183** for a designated
runner (1,128 of 10,932). ⚠ A rate is not a volume: multiplying each cause's carom rate by its
count gives 1,128 · 1,320 · 1,405 · 1,175 · 250 caroms out of 5,278 in total (the same counts
the table above quotes), so the two shape classes contribute 2,580 of those 5,278 — a stated
derivation, 1,405 + 1,175 = 2,580.

**BN-C0's OWN FACE, REPRODUCED ON WORLD 13.** `firstBody.ownNonTarget` = **0.104711** (7,821 of
74,691) on E13 and **0.096447** (8,036 of 83,320) on D13 — the same order as BQ-T1's
`bounce.ownNonTargetFirstShare` 0.105436 (SHUT) / 0.104432 (ARMED) on world 12, on a different
world and a different battery. The rest of the first-body partition on E13:
`firstBody.ownTarget` **0.575866** (43,012) · `firstBody.opponent` **0.318178** (23,765) ·
`firstBody.none` 0.001245 (93); 43,012 + 7,821 + 23,765 + 93 = 74,691, the same denominator,
and `gFaces`'s stored `E13.partition.firstBodySumsToFlights` check re-derives that off disk.

### §R3 THE SPOTS — the table's own geometry

| face | E13 | D13 | Δ, 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|
| ⭐⭐ `spot.inLaneShareAllBodies` | **0.104571** | 0.103626 | −0.000945 [−0.002748, +0.000782] · **CONTAINS ZERO** | 0.535672 |
| `spot.supportSpotInLaneShareAllBodies` | **0.205353** | 0.198376 | −0.006977 [−0.010311, −0.003609] | 2.082181 |
| `spot.occupantSpotInLaneShare` | **0.363050** | 0.350476 | −0.012574 [−0.020103, −0.005168] | 1.683778 |
| `spot.occupantSupportSpotInLaneShare` | 0.353713 | 0.343788 | −0.009924 [−0.017885, −0.001499] | 1.211277 |

⭐⭐ **THE TABLE PUTS A SPOT IN THE PASSING LANE ONCE IN TEN.** Across every eligible own
outfield body at every measured release on E13 — 231,134 body-releases — the CALLED formation
spot lies inside the corridor on 24,170 of them (`spot.inLaneShareAllBodies` **0.104571**). The
CALLED support spot lies inside twice as often: 47,464 of the same 231,134 body-releases
(`spot.supportSpotInLaneShareAllBodies` **0.205353**). ⭐ Among the bodies who are ACTUALLY in
the lane, the spot is inside on **0.363050** (10,576 of 29,131 occupants) — so a body in the
lane is about three and a half times as likely to have his spot there as an arbitrary body is
(a stated derivation: 0.363050 ÷ 0.104571 = 3.472).

⚠⚠ **AND THE PAIR-SIDE VERSION OF THE SAME QUESTION READS "NO" ALMOST EVERYWHERE**:
`pair.spotsWithinShare` = **0.001467** (813 of 554,376 dup-run pairs on E13). Two attackers
inside four metres of each other rarely have two formation spots inside four metres of each
other — which is why the P1 class is nearly empty (§R4).

### §R4 THE CROWD — 撞车 reproduced on world 13, and the pair composition

| face | E13 | D13 | Δ, 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|
| ⭐⭐ `crowd.crashShare` (min pairwise < 4 m) | **0.467745** | **0.514898** | +0.047154 [+0.041127, +0.052883] | 8.022130 |
| `crowd.dupRunPairsPerSample` | 0.676866 | 0.793419 | +0.116553 [+0.104103, +0.128764] | 9.452439 |
| `crowd.nearestMateMeanMetres` | 8.887812 | 8.533796 | −0.354015 [−0.394982, −0.312337] | 8.567137 |
| `crowd.unattributedSampleShare` | 0.347727 | 0.325944 | −0.021783 [−0.026017, −0.017792] | 5.296486 |
| `crowd.samplesPerMatch` | 820.675351 | 847.420842 | +26.745491 [+20.698397, +32.903808] | 4.382563 |

Bin-derived medians (`medians.values`): nearest-mate **8** m (E13) / **7.5** m (D13);
min-pairwise **4** m (E13) / **3.5** m (D13).

**⭐⭐ THE PAIR COMPOSITION** — denominator **554,376** dup-run pairs (E13) and **671,015**
(D13):

| class | E13 share | E13 count | D13 share | D13 count | Δ, 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|---|---|
| **P1 TABLE** | **0.000005** | 3 | **0.000006** | 4 | +0.000001 [−0.000008, +0.000009] · **CONTAINS ZERO** | 0.065119 |
| **P2 DESIGNATED** | **0.507868** | 281,550 | **0.515321** | 345,788 | +0.007453 [+0.000478, +0.014447] | 1.066974 |
| **P3 SUPPORT** | 0.281333 | 155,964 | 0.317130 | 212,799 | +0.035797 [+0.028889, +0.042651] | 5.202240 |
| **P4 SHAPE-PATHS** | 0.096667 | 53,590 | 0.093177 | 62,523 | −0.003490 [−0.006094, −0.000860] | 1.333780 |
| **P5 OTHER** | 0.114127 | 63,269 | 0.074366 | 49,901 | −0.039760 [−0.041924, −0.037561] | 18.226650 |

**THE MAJORITY IS STORED, AND IT IS P2.** `reads.crowd.E13.majority.P2` = **true** (share
0.507868 > 0.5), every other class's boolean is `false`, `reads.crowd.E13.mixed` = **false**
and `reads.crowd.E13.majorityClass` = **`P2`** — so the frozen rule prints *"THE CROWD IS THE
COACH'S."* (§R8). Beside it: `pair.eitherRunnerShare` **0.501950** (278,269 of 554,376) and
`pair.eitherSupportShare` **0.388375** (215,306 of the same 554,376);
`pair.noCarrierShare` 0.319543 (177,147 of 554,376) — pairs sampled with no owner, which enter
no carrier-distance bin. The bin-derived median carrier-to-pair-midpoint distance is **4** m on
both arms.

⚠ **P1 IS ALL BUT EMPTY AND IT IS REPORTED AS SUCH**, not zero-imputed: 3 pairs of 554,376 on
E13 and 4 of 671,015 on D13, both intervals reaching zero. §P.E declared this row's smoke
variance DEGENERATE before the battery, and the battery agrees with the declaration.

### §R5 THE DESIGNATION LEDGER — rates and shares

| face | E13 | D13 | Δ, 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|
| ⭐⭐ `lane.passesWithLiveDesignationShare` | **0.962124** | **0.971675** | +0.009552 [+0.007849, +0.011301] | 5.533265 |
| `designation.runnersPerSampledTick` | **1.549301** | 1.559996 | +0.010695 [+0.004763, +0.016458] | 1.829118 |
| `designation.chasersPerSampledTick` | 0.024490 | 0.027626 | +0.003136 [+0.002407, +0.003851] | 4.344564 |
| `designation.arriverLiveShare` | 0.083262 | 0.077797 | −0.005464 [−0.007909, −0.002989] | 2.221289 |
| `designation.overlapperLiveShare` | 0.013275 | 0.012777 | −0.000498 [−0.001493, +0.000478] · **CONTAINS ZERO** | 0.505475 |
| `designation.runnersDistinctBodiesPerMatch` | 8.746493 | 8.609218 | −0.137275 [−0.212425, −0.061122] | 1.814570 |
| `designation.arriverDistinctBodiesPerMatch` | 3.229459 | 3.251503 | +0.022044 [−0.060120, +0.104208] · **CONTAINS ZERO** | 0.268293 |
| `designation.overlapperDistinctBodiesPerMatch` | 2.193387 | 2.309619 | +0.116232 [+0.017034, +0.217435] | 1.160000 |
| `designation.chasersDistinctBodiesPerMatch` | 10.000000 | 10.000000 | +0.000000 · both intervals degenerate | null |

⭐⭐ **A DESIGNATION IS LIVE ON 0.962124 OF THE PASSES.**
`lane.passesWithLiveDesignationShare` = **0.962124** —
71,862 of the 74,691 measured ground passes on E13 were struck while at least one runner,
arriver or overlapper licence was live on the passing side; a mean of **1.549301** runners is
licensed per attributable sampled tick (1,268,930 licence-slots over 819,034 samples). ⚠ The
`chasersDistinctBodiesPerMatch` row reads **10.000000** on both arms with a zero-width interval
(9,980 distinct bodies over 998 matches on each arm), so that face carries no variation at this
n and is a saturated receipt, not a discriminating one. ⛔ It is reported, not read.

### §R6 THE OPPONENTS IN THE LANE (beside; step ⑤'s number, ⛔ never read here)

| face | E13 | D13 | Δ, 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|
| `opponent.inLanePerPass` | **0.994939** | 1.075300 | +0.080361 [+0.071090, +0.089320] | 8.816789 |
| ⭐⭐ `opponent.passesWithInLaneShare` | **0.660160** | 0.702076 | +0.041916 [+0.037301, +0.046473] | 9.140813 |
| `opponent.tight.passesWithInLaneShare` (bin) | 0.235142 | 0.278733 | +0.043590 [+0.039247, +0.047932] | 10.038035 |
| `opponent.presence.present` | 0.459166 | 0.458792 | −0.000374 [−0.006826, +0.006069] · **CONTAINS ZERO** | 0.058018 |
| `opponent.presence.arrived` | 0.044770 | 0.042994 | −0.001776 [−0.003749, +0.000336] · **CONTAINS ZERO** | 0.869477 |
| `opponent.presence.noWindup` | 0.496064 | 0.498214 | +0.002150 [−0.004349, +0.008977] · **CONTAINS ZERO** | 0.322715 |

⭐⭐ **TWO GROUND PASSES IN THREE ARE STRUCK THROUGH A CORRIDOR AN OPPONENT IS ALREADY STANDING
IN** (`opponent.passesWithInLaneShare` **0.660160** — 49,308 of 74,691 measured ground passes on
E13), and the mean count is `opponent.inLanePerPass` **0.994939** (74,313 opponents over the
same 74,691 passes). Of those 74,313 opponent occupants, 34,122 were inside the arm-tick
corridor as well and 3,327 arrived after the arm; the remaining 36,864 belong to passes with no
wind-up record. ⛔ This is the ⑤ question 「传到对面身上」 and this census does not read it.

### §R7 THE DOSED ARM BESIDE — the COMPLETE ordered list of resolved paired Δs

⭐ This is the **COMPLETE** list, not a selection: **63** of the census's **94** paired Δ rows
have an interval that excludes zero, ordered by \|Δ\|÷half-width. Left column = D13, right =
E13; the Δ is D13 − E13. ⛔ Nothing here is scored, and ⛔ no null is cut on the 31 rows whose
intervals contain zero — they read *"unresolved at this power"*.

| face | D13 | E13 | Δ, 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|
| `pair.P5` | 0.074366 | 0.114127 | −0.039760 [−0.041924, −0.037561] | 18.226650 |
| `composition.L4` | 0.007622 | 0.044763 | −0.037141 [−0.039935, −0.034400] | 13.420258 |
| `context.groundPassesPerMatch` | 83.486974 | 74.840681 | +8.646293 [+7.823647, +9.505010] | 10.284863 |
| `pair.eitherSupportShare` | 0.451705 | 0.388375 | +0.063330 [+0.057008, +0.069369] | 10.246116 |
| `opponent.tight.passesWithInLaneShare` | 0.278733 | 0.235142 | +0.043590 [+0.039247, +0.047932] | 10.038035 |
| `crowd.dupRunPairsPerSample` | 0.793419 | 0.676866 | +0.116553 [+0.104103, +0.128764] | 9.452439 |
| `crowd.pairsPerSample` | 0.793419 | 0.676866 | +0.116553 [+0.104103, +0.128764] | 9.452439 |
| `opponent.passesWithInLaneShare` | 0.702076 | 0.660160 | +0.041916 [+0.037301, +0.046473] | 9.140813 |
| `opponent.inLanePerPass` | 1.075300 | 0.994939 | +0.080361 [+0.071090, +0.089320] | 8.816789 |
| `crowd.nearestMateMeanMetres` | 8.533796 | 8.887812 | −0.354015 [−0.394982, −0.312337] | 8.567137 |
| `context.interceptionsPerMatch` | 31.001002 | 27.068136 | +3.932866 [+3.452906, +4.421844] | 8.117890 |
| `crowd.crashShare` | 0.514898 | 0.467745 | +0.047154 [+0.041127, +0.052883] | 8.022130 |
| `context.ownedBallSampleShare` | 0.366087 | 0.336958 | +0.029129 [+0.025415, +0.032714] | 7.982211 |
| `pair.noCarrierShare` | 0.283736 | 0.319543 | −0.035807 [−0.041306, −0.030399] | 6.566278 |
| `lane.passesWithLiveDesignationShare` | 0.971675 | 0.962124 | +0.009552 [+0.007849, +0.011301] | 5.533265 |
| `carom.L3b` | 0.277546 | 0.367188 | −0.089641 [−0.106701, −0.073032] | 5.324747 |
| `crowd.unattributedSampleShare` | 0.325944 | 0.347727 | −0.021783 [−0.026017, −0.017792] | 5.296486 |
| `pair.P3` | 0.317130 | 0.281333 | +0.035797 [+0.028889, +0.042651] | 5.202240 |
| `crowd.samplesPerMatch` | 847.420842 | 820.675351 | +26.745491 [+20.698397, +32.903808] | 4.382563 |
| `designation.chasersPerSampledTick` | 0.027626 | 0.024490 | +0.003136 [+0.002407, +0.003851] | 4.344564 |
| `carom.all` | 0.160037 | 0.181182 | −0.021144 [−0.026244, −0.016125] | 4.179312 |
| `context.goalsPerMatch` | 2.667335 | 3.237475 | −0.570140 [−0.712425, −0.430862] | 4.049822 |
| `presence.L4.noWindup` | 0.348659 | 0.101227 | +0.247432 [+0.188185, +0.312777] | 3.971875 |
| `carom.L3a` | 0.376829 | 0.472587 | −0.095757 [−0.120624, −0.071487] | 3.897557 |
| `presence.L4.present` | 0.593870 | 0.845859 | −0.251989 [−0.321707, −0.186666] | 3.732019 |
| `presence.L2.noWindup` | 0.283437 | 0.330535 | −0.047098 [−0.060602, −0.033587] | 3.486846 |
| `presence.L3b.present` | 0.308957 | 0.229375 | +0.079582 [+0.055954, +0.101980] | 3.458103 |
| `presence.L3b.noWindup` | 0.676564 | 0.756250 | −0.079686 [−0.102221, −0.055385] | 3.402746 |
| `lane.occupantsPerPass` | 0.410970 | 0.390020 | +0.020950 [+0.014676, +0.027166] | 3.354590 |
| `firstBody.ownNonTarget` | 0.096447 | 0.104711 | −0.008264 [−0.011024, −0.005640] | 3.069840 |
| `presence.L2.present` | 0.664396 | 0.623671 | +0.040725 [+0.026591, +0.054615] | 2.906489 |
| `lane.passesWithOccupantShare` | 0.341563 | 0.328098 | +0.013464 [+0.008742, +0.018116] | 2.872582 |
| `presence.all.noWindup` | 0.455376 | 0.479077 | −0.023701 [−0.032429, −0.014819] | 2.691744 |
| `composition.L2` | 0.390193 | 0.368062 | +0.022132 [+0.013432, +0.030352] | 2.616067 |
| `presence.all.present` | 0.506425 | 0.483094 | +0.023331 [+0.014247, +0.032108] | 2.612468 |
| `designation.arriverLiveShare` | 0.077797 | 0.083262 | −0.005464 [−0.007909, −0.002989] | 2.221289 |
| `spot.supportSpotInLaneShareAllBodies` | 0.198376 | 0.205353 | −0.006977 [−0.010311, −0.003609] | 2.082181 |
| `designation.runnersPerSampledTick` | 1.559996 | 1.549301 | +0.010695 [+0.004763, +0.016458] | 1.829118 |
| `pair.spotsWithinShare` | 0.001975 | 0.001467 | +0.000508 [+0.000233, +0.000792] | 1.817649 |
| `designation.runnersDistinctBodiesPerMatch` | 8.609218 | 8.746493 | −0.137275 [−0.212425, −0.061122] | 1.814570 |
| `composition.L3b` | 0.119006 | 0.109849 | +0.009157 [+0.004104, +0.014321] | 1.792511 |
| `spot.occupantSpotInLaneShare` | 0.350476 | 0.363050 | −0.012574 [−0.020103, −0.005168] | 1.683778 |
| `composition.L1` | 0.387390 | 0.375270 | +0.012119 [+0.005146, +0.020034] | 1.628073 |
| `occupantDesignation.none` | 0.612610 | 0.624730 | −0.012119 [−0.020030, −0.005107] | 1.624271 |
| `presence.L1.present` | 0.501018 | 0.480241 | +0.020776 [+0.008227, +0.034170] | 1.601635 |
| `occupantDesignation.runner` | 0.372700 | 0.361162 | +0.011539 [+0.004427, +0.019528] | 1.528122 |
| `spot.inLane.L1` | 0.236412 | 0.251829 | −0.015418 [−0.026260, −0.004576] | 1.422016 |
| `firstBody.none` | 0.000804 | 0.001245 | −0.000441 [−0.000752, −0.000130] | 1.419535 |
| `context.shotsPerMatch` | 12.029058 | 12.409820 | −0.380762 [−0.657315, −0.114228] | 1.402214 |
| `composition.L3a` | 0.095789 | 0.102056 | −0.006267 [−0.010906, −0.001747] | 1.368668 |
| `pair.P4` | 0.093177 | 0.096667 | −0.003490 [−0.006094, −0.000860] | 1.333780 |
| `presence.L1.noWindup` | 0.460008 | 0.476948 | −0.016941 [−0.030334, −0.004245] | 1.298693 |
| `pair.eitherRunnerShare` | 0.510880 | 0.501950 | +0.008930 [+0.001948, +0.015885] | 1.281469 |
| `presence.L3a.present` | 0.123171 | 0.100572 | +0.022599 [+0.004426, +0.040637] | 1.248161 |
| `spot.occupantSupportSpotInLaneShare` | 0.343788 | 0.353713 | −0.009924 [−0.017885, −0.001499] | 1.211277 |
| `presence.L2.arrived` | 0.052167 | 0.045794 | +0.006373 [+0.001044, +0.011699] | 1.196260 |
| `designation.overlapperDistinctBodiesPerMatch` | 2.309619 | 2.193387 | +0.116232 [+0.017034, +0.217435] | 1.160000 |
| `firstBody.opponent` | 0.323176 | 0.318178 | +0.004998 [+0.000516, +0.009182] | 1.153506 |
| `spot.inLane.L4` | 0.321839 | 0.255368 | +0.066471 [+0.010230, +0.126207] | 1.146288 |
| `carom.L2` | 0.132251 | 0.123111 | +0.009139 [+0.000451, +0.017251] | 1.088012 |
| `pair.P2` | 0.515321 | 0.507868 | +0.007453 [+0.000478, +0.014447] | 1.066974 |
| `presence.L3a.noWindup` | 0.870732 | 0.890010 | −0.019278 [−0.037360, −0.000798] | 1.054536 |
| `context.passCompletion` | 0.592035 | 0.587186 | +0.004849 [+0.000229, +0.009587] | 1.036506 |

⭐⭐ **THE DOSE MAKES THE PITCH BUSIER AND THE LANE FULLER, AND IT DOES NOT MOVE EITHER
MAJORITY.** With matured books the world plays more ground passes (`context.groundPassesPerMatch`
+8.646293/match), crowds more (`crowd.crashShare` +0.047154, 8.022130 half-widths;
`crowd.dupRunPairsPerSample` +0.116553), puts more opponents in the corridor
(`opponent.passesWithInLaneShare` +0.041916) and more of our own bodies in it
(`lane.occupantsPerPass` +0.020950) — and both stored majority booleans land in the same place
as the empty-book arm's (§R8). ⚠ The `composition.L4` and `pair.P5` rows are the two largest
ratios in the list and both are about the OTHER class shrinking under the dose, not about a
lever.

### §R8 THE READS, PRINTED

Selected on the **E13** arm's stored majority booleans by the frozen §P.C rules, from the frozen
§0 literals, and re-derived off the serialized artifact by `gReadWords`:

> **"THE LANE IS MIXED — the commander decides with the table."**

> **"THE CROWD IS THE COACH'S."**

> **"THE DOSED WORLD AGREES ON THE LANE MAJORITY"**

> **"THE DOSED WORLD AGREES ON THE CROWD MAJORITY"**

(`reads.lane.E13.majorityClass` = `mixed`; `reads.lane.D13.majorityClass` = `mixed`;
`reads.crowd.E13.majorityClass` = `P2`; `reads.crowd.D13.majorityClass` = `P2`;
`reads.dosedAgreesOnLaneMajority` = **true**; `reads.dosedAgreesOnCrowdMajority` = **true**.)

⚠ **READ THE MIXED SENTENCE WITH §R1's TABLE, WHICH IS WHY THE FROZEN FORM CARRIES IT.** The
lane read is `mixed` because the two leading causes are within 0.007208 of each other (a stated
derivation: `composition.L1` 0.375270 − `composition.L2` 0.368062) and neither crosses 0.5 —
⛔ NOT because the classes are evenly spread. **Three quarters of the bodies standing in the
passing lane are there because the coach named them or because the support fan sent them**
(0.743332, a stated derivation: 0.375270 + 0.368062), and the frozen rule has no way to say
that in one sentence. The crowd read is unambiguous on its own rule: `pair.P2` **0.507868**
carries a stored majority boolean of `true`, and `reads.crowd.E13.mixed` = **false** is the
stored boolean that says exactly one class does. ⛔ **The census adjudicates nothing
beyond printing the sentences**; the commander rules with the table.

## §HONEST LIMITS

1. **⛔⛔ THIS CENSUS NAMES A LEVER; IT DOES NOT PULL ONE, AND IT ATTRIBUTES NOTHING.** It
   measures who stands in a corridor and what class he falls into under a precedence THIS
   EXECUTOR FROZE. A different §P — a different precedence, a different corridor width, a
   different eligibility rule — would produce different shares on the same world. The mapping
   from the user's 「有人挤人」 and 「弹回」 to these faces is a choice, and it is falsifiable.
2. **⭐⭐ THE DESIGNATION AND THE ACTION ARE READ AT A TICK BOUNDARY, NOT AT HIS DECISION.**
   `team.runners` / `arriver` / `overlapper` / `chasers` and `p.action.type` are read at the
   RELEASE tick and at the ARM tick — but a body decides at his own `AI_INTERVAL` cadence and
   the licence is re-assigned at the TeamBrain's own cadence, so an occupant can carry an action
   chosen several ticks earlier under a licence assigned at a different tick. That is exactly
   why §R1's L4 cell contains `MarkOpponent` and `InterceptPass` bodies on the attacking side.
   ⛔ The cells are what the engine's state SAID at the census's instant, not a claim about what
   the body was thinking.
3. **⭐⭐ THE TWO SPOTS ARE CALLED RECONSTRUCTIONS AT THE CENSUS'S INSTANT.** `formationSpot`
   and `supportSpot` are the shipped functions, CALLED, but they are evaluated **at the release
   tick or the sampled tick**, not at the tick the body last consulted them, and `hasBall` is
   the census's own declared `TRUE` rather than a value the engine handed over (the production
   recipe agreed at every walked release — `receipt.hasBallRecipeAgreesShare` 1.000000 — which
   is a receipt about the ARGUMENT, not a proof that the body's own walk target was this point).
   The toggle path is stated and asserted: world 13 takes `emergentStation`.
4. **⭐⭐ THE CORRIDOR IS BN-C0's CONSTRUCTION, NOT A SHIPPED PREDICATE.** The engine ships no
   boolean corridor width; the test is built from `DV_CORRIDOR_SCALE` and `DV_CLEAR_RADIUS`, the
   two constants `laneOpenness` owns, and the `CONTROL_RADIUS` variant is published beside as a
   bin. The wide and tight readings disagree by a lot (§R1), and neither is "the" lane.
5. **⚠ THE CLEAR-THE-KICKER GUARD REMOVES BODIES AT THE PASSER'S FEET.** A teammate closer than
   `DV_CLEAR_RADIUS` = 1.5 m to the launch point is EXCLUDED from every corridor face by
   construction — `laneOpenness`'s own "the kick clears them" assumption, inherited. A body
   standing on the kicker's toes is therefore not a lane occupant here, and 「有人挤人」 at the
   very closest range is measured by POPULATION B instead.
6. **⚠ NEARLY HALF THE PASSES HAVE NO ARM TICK.** `lane.noWindupShare` 0.438487 (E13) —
   restarts and first-time strikes resolve no wind-up record, so their occupants carry the
   `noWindup` presence cell and contribute to no present/arrived reading. The present/arrived
   split is a statement about the passes that HAVE a record, and the cell is counted rather than
   imputed.
7. **⚠ ONE FLIGHT IS TRACKED AT A TIME** (PT-C0 / RA-T1B's inherited idiom): a ground pass
   struck while another is still live retires the earlier one — the retired flight is BOOKED, so
   no flight is lost from the denominators, but overlapping deliveries are under-counted.
8. **⚠ THE CROWD SAMPLE IS CENSORED WHERE POSSESSION IS UNATTRIBUTABLE** —
   `crowd.unattributedSampleShare` 0.347727 (E13) of sampled open-play ticks have no owner and
   no live tracked ground-pass flight. Those ticks enter no crowd face, and loose-ball scrambles
   are plausibly the most crowded ticks of all, so the crowd faces may be **optimistic by
   selection** (PT-C0's own limit 6, inherited and re-measured on world 13).
9. **⚠ BOTH SIDES ARE POOLED.** Every face pools the two teams; no face is per-side, and a
   difference between the home and away books would not be visible here.
10. **⚠ THE PAIR CLASSES ANSWER "WHO IS IN THIS PAIR", NOT "WHY ARE THESE TWO TOGETHER".**
    P2's majority says at least one of the two bodies carries a licence — it does not say the
    licence PUT them within four metres of each other. `pair.eitherRunnerShare` 0.501950 (E13)
    is the same statement in its plainest form.
11. **⚠ ASSOCIATIONS, NOT CAUSES.** The carom rates by cause (§R2) are conditional
    probabilities on a class defined at release; they are not a claim that the class caused the
    contact. ⛔ No null is cut anywhere in this census: an interval containing zero reads
    *"unresolved at this power"*, never "no difference".
12. **⚠ THE `pair.P1` AND `occupantDesignation.chaser` CELLS ARE ALL BUT EMPTY**, and both were
    handled as declarations rather than sized faces: P1's smoke variance was declared degenerate
    BEFORE the battery (§P.E) and the chaser cell is structurally unreachable from a pass struck
    in possession. Both are reported as they read, never zero-imputed.
13. **⚠ 12 SCRATCH CLUSTERS SIZED THIS BATTERY**, and the block capped it at 998 seeds
    regardless. The realised half-widths on the ten sized rows are in the artifact's `faces`
    block beside every value; no row was re-cut after sight.
14. **⛔ A CENSUS DOES NOT ADJUDICATE.** Which lever the commander pulls — step ② (arm
    `obmMovement` + `ctbSupportPlane`), step ③ (retire the hand-written designations), or the
    formation table itself — is the commander's, with #388 item 2(v)'s frozen sentences and this
    table in front of him. **Nothing here ships, nothing is armed, and world 13 is untouched.**
