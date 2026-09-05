# BN-C0 — 「弹回」 THE BOUNCE CENSUS（球打在自己人身上没拿住的时候，引擎到底做了什么）

> **The census that defines the user's third sentence and partitions it by the engine's own
> ledger.** Authorized by **COMMANDER RULING #381 item 6**. Lineage:
> [`PT-C0-PLAYTEST-FORENSIC-CENSUS.md`](PT-C0-PLAYTEST-FORENSIC-CENSUS.md) (the POPULATION, the
> `ball.lastTouch` FIRST-BODY channel and the sector read, REUSED byte for byte; its **HONEST
> LIMIT 2** — the rebound face pooled controlled receptions with genuine bounces — is why this
> census exists) → the RC arc → [`RC-T1B-READY-EXAM.md`](RC-T1B-READY-EXAM.md) (**FAIL**: the
> third sentence is NOT a readiness/sector problem — turning the receiver did not change the
> body the ball met, and a front-on first touch does not keep the ball better here) → **#381
> item 6**, this census.
> Census form of record: [`RC-C0B-DETECTOR-CENSUS.md`](RC-C0B-DETECTOR-CENSUS.md).
> Instrument: `scripts/probes/bn-c0-bounce-census.ts`.
> Artifact: `docs/world-model/data/bn-c0-bounce-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. **IT SHIPS NOTHING**, scores no hypothesis
> and arms no mechanism. The **FIVE READ SENTENCES** of #381 item 6(vi) are FROZEN LITERALS
> selected by **STORED majority booleans**. The commander rules.
> ⛔ **X-SRC-ZERO**: no file under `src/` is created or edited. The probe CALLS the shipped
> exports and reads public `Match` state per tick; the **contest-episode ledger is READ, never
> re-implemented**. There is NO WRAPPER — `gLockstep` proves observed ≡ unobserved byte for
> byte PER ARM, and `gTraceInert` proves the ledger flag itself changes no byte of the world.
> ⛔ **WORLD 12 IS UNTOUCHED**: no world is cut, no flag is armed, the user's play-test gate
> stays the user's.
> ⭐ **THE BINDING CANON IS #381 item 3** — VERBATIM: *"an event attribution reads the engine's
> own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is
> written only where no record exists, and says so"* (home: `RC-T1B-READY-EXAM.md` §COMMANDER
> CORRECTIONS item 5). §P.B says, line by line, what is READ and what is a heuristic.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**THE USER'S VERDICT, VERBATIM** (#368 item 1, received 2026-09-03) — the third clause is this
census's subject:

> 「12我看了下,还是有人挤人,传不出去球,**传到人身上弹回**,或经常传到对面身上」

**COMMANDER RULING #381 item 6, the scope this census instruments, VERBATIM:**

> *"⭐⭐ **BN-C0 DISPATCHED — 「弹回」 THE BOUNCE CENSUS** (a C0 census; the PT-C0 / RC-C0b form;
> X-SRC-ZERO; definitions frozen at the executor's §P; no pre-commitment beyond the frozen
> partition and its reads): THE QUESTION — when a ground pass meets one of OUR OWN bodies and we
> do not come away with it, what did the engine DO? (i) POPULATION: every MEASURED GROUND PASS
> (PT-C0's definition, byte for byte) and its FIRST BODY contact (PT-C0's `ball.lastTouch`
> channel: ownTarget / ownNonTarget / opponent / none), on world 12 EMPTY-BOOK and DOSED arms
> paired on shared seeds (the composer CALLED; the dose pins). (ii) ⭐ THE USER'S EVENT, DEFINED:
> a **BOUNCE** = an OWN-body first contact (ownTarget or ownNonTarget) after which the passing
> side does NOT hold the ball within the engine's own settle window — K ticks read off the
> control-attempt law (`PendingControlAttempt.readyTick`'s own form, anchored; ⛔ never a typed
> K) — the ball being loose, the opponent's, or out. PT-C0's rebound face (velocity reversal) is
> published BESIDE, never pooled (its HONEST LIMIT 2). (iii) ⭐⭐ THE PARTITION, BY THE ENGINE'S
> OWN LEDGER (canon item 3): for every own-body first contact — the contact KIND at that tick
> from the contest-episode trace (`traceContests` armed in the probe only — observation,
> byte-inert, gLockstep proves it: `controlAttempt` · `deflection` · `bodyStrike` · `body` ·
> `poke`) · the control attempt's OUTCOME at its `readyTick` (possession gained / not) · the
> ball's speed at contact against the body's own `maxSpeed` branch (`intended ? 24 :
> CONTROL_MAX_SPEED`, `GK_CONTROL_MAX_SPEED` — anchored) · the BK sector (`BodySector`, CALLED)
> · intended target or not · a PC hold LIVE for that body at the contact tick (a pure `Map.get`)
> · the body's `action.type` at contact · the body's speed and the relative speed · the pass
> class (toFeet / carried) · the launch speed and distance · the contest-episode ORIGIN that
> follows (`passArrival` / `firstTouch` / `deflection`) · the outcome after K (same side /
> opponent / loose / out). Publish P(bounce | cell) with counts and the BOUNCE COMPOSITION —
> which class carries the bounces — with the majority class STORED as a boolean per candidate.
> (iv) THE RECEIVER'S HEADING THROUGH THE FLIGHT (item 4(i)'s probe): for completed and bounced
> ownTarget contacts, the angle between the receiver's heading and the ball's approach at
> RELEASE, at MID-FLIGHT and at FIRST TOUCH (bins stored); the share front-on at release that is
> side-on at touch. (v) THE OPPONENT FIRST CONTACTS (「传到对面身上」) partitioned beside: was an
> opponent inside the pass corridor at RELEASE (the passer's geometry — step ⑤'s question) or
> did he ARRIVE during the flight (movement — step ②/③'s)? corridor width = the engine's own
> pass-corridor constant, anchored. (vi) PRE-REGISTERED READS (frozen literals on the stored
> majority booleans): the majority bounce class is an INTENDED target whose control attempt
> FAILED ⇒ "THE THIRD SENTENCE IS A CONTROL-QUALITY QUESTION — the BK quality law is named."; an
> INTENDED target met above his `maxSpeed` (a deflection) ⇒ "THE THIRD SENTENCE IS A PASS-WEIGHT
> QUESTION — step ④ (the strike parameter space) is named."; an OWN NON-TARGET body ⇒ "THE THIRD
> SENTENCE IS A LANE-OCCUPANCY QUESTION — steps ②/③ (attacking off-ball eyes; designations
> retire) are named."; a body under a LIVE PC HOLD ⇒ "THE THIRD SENTENCE IS A REACTION QUESTION
> — and the dosed arm says whether the user's world still has it."; no class holds a majority ⇒
> "THE THIRD SENTENCE IS MIXED — the commander decides with the table." (vii) ARMS E / D paired;
> block **12,540,000–999** (N sized by a disclosed 12-seed smoke on scratch 900,002,800–811;
> receipt 12,540,999; lockstep 900,002,890–891); ZERO stats; registry 73; compact JSON; the hash
> receipt outside the body; honest-limits single home; every read word STORED; the prose sweep;
> the two-fractions rule. DOC `BN-C0-BOUNCE-CENSUS.md`; INSTRUMENT
> `scripts/probes/bn-c0-bounce-census.ts` (PT-C0's contact/sector/corridor code REUSED,
> anchored; the contest-episode ledger READ, never re-implemented); ARTIFACT
> `docs/world-model/data/bn-c0-bounce-census.json`."*

**THE FIVE READ SENTENCES, VERBATIM** (#381 item 6(vi)) — frozen here, before any battery seed,
and PRINTED by the instrument from stored booleans:

| selector (a STORED majority boolean) | the sentence PRINTED, verbatim |
|---|---|
| **C1** majority | *"THE THIRD SENTENCE IS A CONTROL-QUALITY QUESTION — the BK quality law is named."* |
| **C2** majority | *"THE THIRD SENTENCE IS A PASS-WEIGHT QUESTION — step ④ (the strike parameter space) is named."* |
| **C3** majority | *"THE THIRD SENTENCE IS A LANE-OCCUPANCY QUESTION — steps ②/③ (attacking off-ball eyes; designations retire) are named."* |
| **C4** majority | *"THE THIRD SENTENCE IS A REACTION QUESTION — and the dosed arm says whether the user's world still has it."* |
| no majority | *"THE THIRD SENTENCE IS MIXED — the commander decides with the table."* |

and beside them, from a stored boolean, one of: *"THE DOSED WORLD AGREES ON THE MAJORITY CLASS"*
/ *"THE DOSED WORLD DISAGREES ON THE MAJORITY CLASS"*.

### in plain football language

The user said the ball **hits one of our own players and comes off him**. The whole receiver arc
was built on one guess about why: he is standing side-on, not turned, so the ball hits the wrong
part of him. That guess has now been tested on a paired battery and **it is not the mechanism** —
turning the receiver did not change the body the ball met, and in this engine a man who takes the
ball on his side keeps it slightly *more* often than one who takes it on his front.

So nobody has yet measured **what the engine actually does** at the moment a pass meets one of our
bodies and we do not come away with it. PT-C0's 「弹回」 number could not answer it: it counted a
man **killing a ball properly** — which reverses the ball's direction too — in the same bucket as
a ball bouncing off a shin. It said so at the time.

This census does four plain things and stops.

1. **It defines the event honestly.** A **BOUNCE** is: the ball reaches one of our men first, and
   **a moment later our side does not have it**. "A moment" is not a number this census invented
   — it is exactly the time the engine itself gives a man to bring a ball under control.
2. **It asks the engine what happened**, instead of guessing. The engine keeps its own notebook of
   every contested touch: who touched it, on which tick, and what kind of touch it was — a
   controlled attempt, a deflection, a ball simply hitting a body. Where the notebook has an
   entry, we read it. Where it has none, we say so and publish how often that is.
3. **It sorts the bounces into five buckets**: the man it was meant for tried to control it and
   failed · the man it was meant for was hit by a ball travelling faster than he is allowed to
   control · it hit a *different* one of our men first · the man who touched it was still in his
   reaction delay · everything else, named.
4. **It watches the receiver's shoulders through the flight** — where he was facing when the pass
   was struck, halfway through, and at the moment he met it — because the last exam's leading
   suspicion is that the run to the ball turns him back off it.

Beside all that it splits 「传到对面身上」 in two: was the opponent **already standing in the passing
lane** when the ball was struck (a passer's problem), or did he **arrive during the flight** (a
movement problem)?

⛔ Nothing here is decided, nothing is built and no world changes. The census publishes the tables,
prints one frozen sentence naming which repair step the third sentence belongs to, and stops.

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — two, PAIRED on shared seeds

Arm `k` walks seed `s` with the **IDENTICAL population construction** (PT-C0's own `buildMatch`
plumbing: genomes and squads drawn from the seed exactly as it does, the same 240 s match), so
the two arms differ **ONLY** in the world's own books and **every Δ is PAIRED per seed**.

| arm | composition — the composer **CALLED, never copied** | gate on the match |
|---|---|---|
| **E** | **world 12 EMPTY-BOOK — the exams' form**: `a4MatchFlags(12)` as construction flags + `armA4World(m, null, 12)` | `raArmedVersion(m) === 12` |
| **D** | **world 12 DOSED — THE FORM THE USER PLAYS**: the same, plus the two doses from the **SHIPPED LOADERS THEMSELVES** (`loadL3Dose` / `loadPcDose`, CALLED) | `raArmedVersion(m) === 12` |

**BOTH arms are constructed with `traceContests: true`.** That is the only difference between
this census's matches and the exams' — and it is **observation, not a world**: the flag is read at
exactly ONE place, `traceContact`'s own early return (`if (!this.traceContests) return;`,
anchored), and no branch on it changes a byte. `gTraceInert` proves it on shared out-of-band
scratch seeds: the same seed built with the trace ON and OFF runs to completion with a
**byte-identical whole-match signature**, on both arms.

**THE DOSES ARE PINNED.** PT-C0 §COMMANDER CORRECTIONS item 2 required the next dosed arm to PIN
the two byte-hashes rather than merely publish them. `gDoseSource` hashes the FILE BYTES this
process read from `docs/world-model/data/l3-t1-convergence-exam.json` and
`docs/world-model/data/pc-t1-learning-exam.json` and compares them to the values #381 item 6
pinned; a mismatch is `process.exit(3)` **before any seed is walked**. Canon, VERBATIM: *"a
dose-source guard should hash the bytes it reads, not a self-declared field"* (home:
`BU-T1-MT-COMPOSITION.md` §COMMANDER CORRECTIONS item 6).

⚠ **THE `tables` ARGUMENT CANNOT REACH THESE ARMS** — PT-C0 §P.D traced it and this census
inherits the fact with its own anchor: `armA4World`'s RA branch RETURNS before the
`tables === null` refusal, so the user's form and the exams' form differ **ONLY in the two doses**.

**THE PAIRED Δ (D − E)** is published on **every** face: the bootstrap resamples SEEDS and both
arms move together inside every draw, so the interval is a PAIRED one by construction.
⛔ **The census SCORES nothing.** The reads are on the **E** arm's stored majority booleans, with
**D**'s printed beside at the same precision and the same prominence.

### §P.B THE POPULATION, THE BOUNCE, THE LEDGER AND THE FACES

| quantity | frozen form |
|---|---|
| **THE POPULATION** | ⭐⭐ **PT-C0's, BYTE FOR BYTE**: every **MEASURED GROUND PASS** — `isMeasurableGroundPass` (`shortPass` \| `throughBall` \| `cutback`, ground launch, with a pending-pass target), registered **at the strike** via `pendingPass`, **anchored** at RA-T1B's own source line. **ONE flight is tracked at a time**; a new release RETIRES the previous one |
| **E, THE AIM POINT AT THE STRIKE** | PT-C0's own: where the strike resolved a TRACKED wind-up record for this passer and target, `E = aim + (aimLead ?? 0)`; otherwise the target's own position at the strike tick. **LAUNCH** = `ball.pos − ball.vel · DT`; `u = unit(E − launch)`; `|E − launch| ≤ 1e-6` ⇒ **NO launch line** |
| **⭐⭐ THE FIRST BODY** | PT-C0's own channel: the **first** tick after the release at which `ball.lastTouch` is a body **OTHER than the passer**. CLASSES `ownTarget` / `ownNonTarget` / `opponent` / `none`, PT-C0's own ladder anchored verbatim. The engine's OWN touch channel; its **four honest `ball.lastTouch = p;` assignment sites** are anchored and **RECOUNTED** here |
| **⭐⭐ K — THE SETTLE WINDOW** | **READ OFF THE CONTROL-ATTEMPT LAW'S OWN `readyTick` FORM**, anchored at its site: `readyTick: this.stepCount + CONTACT_CONTROL_DELAY_TICKS`. ⛔ **K is not a typed constant of this census**: it IS `CONTACT_CONTROL_DELAY_TICKS`, imported. ⭐ **THE FORM IS A CONSTANT OFFSET — it does NOT read `relativeSpeed`** (which the same `PendingControlAttempt` object stores right beside it), so **K is ONE number for every contact**, and this doc states that rather than assuming it |
| **⭐⭐ THE BOUNCE (「弹回」), DEFINED** | an **OWN-body** first contact (`ownTarget` or `ownNonTarget`) after which the **PASSING SIDE does NOT hold the ball** at tick `contactTick + K` — the ball being **LOOSE** (`ball.owner === null`), the **OPPONENT's**, or **OUT** (the phase is neither `playing` nor `restart`). The four-way settle ladder `sameSide` / `opponent` / `loose` / `out` is STORED; **BOUNCE = not `sameSide`** |
| **THE `unresolved` CASE** | a contact whose settle window runs past **FULL TIME**. It is **COUNTED** (`bounce.unresolvedShare.*`) and enters **NO** bounce face. ⛔ never zero-imputed, never folded into `loose` |
| **THE 2K ROBUSTNESS BIN** | the same ladder read again at `contactTick + 2K`, **STORED**. ⛔ **A BIN, NOT A SECOND DEFINITION**: no read word, no majority boolean and no composition cell depends on it |
| **⭐⭐ PT-C0's REBOUND, BESIDE** | PT-C0's own face, its definition verbatim (`dot(ball.vel, u) < 0` at the contact tick, over own-body first contacts with a launch line), published **with its own denominator** and **NEVER pooled** with the bounce — PT-C0 **HONEST LIMIT 2** is the whole reason this census exists. The **2×2 overlap** (bounce ∧ rebound · bounce ∧ ¬rebound · ¬bounce ∧ rebound · neither) is a **STORED table** |

#### ⭐⭐ WHAT IS READ FROM THE ENGINE'S LEDGER, AND WHAT IS A HEURISTIC

Canon, VERBATIM: *"an event attribution reads the engine's own record when one exists (`shotLog`,
the contest episodes, `lastTouch`); a heuristic is written only where no record exists, and says
so"* (home: `RC-T1B-READY-EXAM.md` §COMMANDER CORRECTIONS item 5, ruling #381 item 3).

**READ FROM THE ENGINE — never re-implemented:**

* **THE CONTACT KIND** — from `Match.contestEpisodes`, the public append-only ledger. The
  vocabulary is `ContestContactKind`'s **own union**, read off the source at run time and never
  re-typed. ⚠ **A CORRECTION OF RECORD TO #381 item 6(iii)'s LIST**: the union is
  `'controlAttempt' | 'poke' | 'deflection' | 'header' | 'body'` — there is **no `bodyStrike`
  kind in the ledger**. `bodyStrike` is the **CLAIM** kind the BK contact law builds; when such a
  claim is APPLIED the engine records it in the ledger as **`body`** (`bkApplyBodyStrike`'s own
  `this.traceContact(allClaims, p, 'body')`, anchored). This census publishes the union's five
  kinds and never invents a sixth.
* **`unrecorded`** — a contact tick for which the ledger has **no entry at all**. It is a
  **PUBLISHED RECEIPT** (`partition.kind.share.unrecorded`), **never imputed into any kind**.
* **THE CONTROL ATTEMPT'S OUTCOME** — read from the engine at the contact's own `readyTick`:
  does **that body** own the ball there? The engine's own success path is `giveBall` inside
  `resolvePendingControlAttempt` (anchored).
* **THE CONTEST EPISODE'S ORIGIN** — the origin of the episode that CONTAINS the contact; if no
  episode contains it, the origin of the first episode that OPENED inside the K window; else the
  published cell `noEpisode`. Vocabulary read off `ContestOrigin`'s own union.
* **THE PC HOLD** — the seat's own `holdSnapshot()`, a **READ-ONLY view**, with the seat's own
  liveness rule (`simTick < untilTick`, quoted from its own comment). ⛔ **`holdFor` is NEVER
  called** — it DELETES expired entries, which would be a write.
* **`ball.lastTouch`**, the sector classifier (`ballAccessGeometry`, **CALLED**) and the pass
  wind-up record — PT-C0's own channels.

**HEURISTICS, SAID SO — where the engine keeps no record:**

1. **THE BALL'S SPEED AT CONTACT against that body's own `maxSpeed` branch.** The engine evaluates
   `speed` *inside* the step, before the contact resolves, and stores it nowhere. The probe
   therefore reads the ball's speed at the **END of the PREVIOUS tick** and evaluates the claim
   builder's own three-way expression on it — `p.role === 'GK' ? GK_CONTROL_MAX_SPEED : intended ?
   24 : CONTROL_MAX_SPEED`, with the `24` **anchored AT THAT SITE and nowhere else**. This is a
   **ONE-TICK-LAGGED RECONSTRUCTION**; it is **CROSS-CHECKED against the ledger's own word** on
   the same contact (`controlAttempt` ⇔ at-or-below, `deflection` ⇔ above) and the **agreement
   share is published as a receipt**. ⛔ Where the two disagree the **LEDGER is the record**; the
   probe's cell is only the published cut.
2. **THE PASS CLASS `toFeet` / `carried`** — `carried` iff the strike resolved a tracked wind-up
   whose own `aimLead` is non-null and non-zero (PT-C0's wind-up channel). The engine stores no
   pass-class label.
3. **THE SECTOR IS READ AT THE END OF THE CONTACT TICK** — PT-C0's declared limit, inherited
   verbatim (HONEST LIMIT 1 below).
4. **THE CORRIDOR MEMBERSHIP** (v) — see §P.B's corridor row: the engine ships **no boolean
   corridor width**, so the test is this census's, built from the engine's own two constants.

#### ⭐⭐ THE PARTITION — the cell stored for EVERY own-body first contact

`ledger KIND` (the five-kind union + `unrecorded`) · `possession at readyTick` (the control
attempt's own outcome) · `contest ORIGIN` · `SECTOR` (the law's own classifier, CALLED) ·
`speed vs his own maxSpeed branch` (at-or-below / above) · `intended target or not` (which IS the
`ownTarget` / `ownNonTarget` split) · `PC hold live` · `action.type ∈ ReceivePass / other` ·
`body speed` and `ball–body relative speed` (bins) · `pass class` (toFeet / carried) ·
`launch speed` and `passer→target distance` (bins) · the settle-window outcome at **+K** and
**+2K**.

Published per arm: `P(bounce | ownTarget)`, `P(bounce | ownNonTarget)`, `P(bounce | kind)`,
`P(bounce | sector)`, `P(bounce | speed vs max)`, `P(bounce | hold)`, `P(bounce | action)`,
`P(bounce | pass class)`, `P(bounce | launch-speed bin)`, `P(bounce | distance bin)`,
`P(bounce | origin)` — every one with its counts.

#### ⭐⭐ THE BOUNCE COMPOSITION — the five candidate classes and their FROZEN precedence

| class | frozen definition |
|---|---|
| **C1** the **control-QUALITY** class | INTENDED target · ledger kind `controlAttempt` · attempt **FAILED** (that body does NOT own the ball at his `readyTick`) |
| **C2** the **pass-WEIGHT** class | INTENDED target · met **ABOVE** his own maxSpeed branch — i.e. ledger kind `deflection` |
| **C3** the **LANE-OCCUPANCY** class | an **OWN NON-TARGET** body first (any kind) |
| **C4** the **REACTION** class | a body under a **LIVE PC HOLD** at the contact tick (any kind, any target flag) |
| **C5** the remainder | everything else, with **named sub-classes**: `postControlLoss` (a `controlAttempt` that SUCCEEDED at its `readyTick` and the ball was lost anyway inside the window) · `bodyStrikeOnIntendedTarget` (ledger kind `body` on the intended target) · `unrecordedOnIntendedTarget` · `otherKindOnIntendedTarget` |

**THE PRECEDENCE IS `C1 > C2 > C3 > C4 > C5`, and here is why — from the engine's OWN order of
operations.** The claim builder decides the contact KIND from the ball's speed against **this
body's own maxSpeed branch**, and that branch **reads `intended`**. So the ledger kind and the
target flag are properties of **the contact branch itself**, and they are read first. A live PC
hold is a **decision-layer** state that the contact branch **never reads at all** — it holds the
body's *decision*, not his *contact* — so it cannot pre-empt a class the engine's own branch
defines, and it is read AFTER them.

⭐ **C1, C2 and C3 are DISJOINT BY CONSTRUCTION** (C1 and C2 require the intended target and
differ in the ledger's kind; C3 requires a non-target), so the precedence does real work only at
**C4**, and **that is exactly where both readings are published**: `composition.C4` is the
EXCLUSIVE residue, and `composition.C4overlap.total` / `.withC1` / `.withC2` / `.withC3` are the
**OVERLAPPING** counts — the reader sees precisely how much the reaction class overlaps the
others. The composition's denominator is **RESOLVED BOUNCES** on both arms.

⚠ **C5 IS A REMAINDER, NOT A REPAIR STEP.** A C5 majority names no step, so the frozen form prints
the **no-majority sentence** for it. Stated here, before any battery seed.

#### (iv) THE RECEIVER'S HEADING THROUGH THE FLIGHT

For every `ownTarget` first contact, split by outcome (`held` / `bounced`), the angle between the
**receiver's heading** and the **ball's approach direction** (`ball.vel` REVERSED), at three
stages: **RELEASE** (the release tick's own sample) · **MID-FLIGHT** (the sample nearest half the
flight's duration) · **TOUCH** (⚠ the **LAST PRE-CONTACT** sample — declared, because at the end
of the contact tick the ball's velocity has already been changed by the contact itself). Bins
15° × 12, stored per stage per outcome; means published.

**FRONT-ON** uses the sector classifier's **OWN `Math.SQRT1_2` cone**, converted to degrees by
`acos(SQRT1_2)` — ⛔ never typed as a literal angle. Published: the front-on share at release, and
⭐⭐ **of the contacts front-on at RELEASE, the share that is SIDE-OR-BACK at TOUCH** — #381 item
4(i)'s labelled hypothesis (*the flight undoes the turn*) given a number. The receiver's
**lateral speed** at mid-flight (the component of his velocity perpendicular to the launch line)
is binned and its mean published.

#### (v) THE OPPONENT FIRST CONTACTS

For each `opponent` first contact, the corridor cell: **`corridorAtRelease`** (he was inside the
corridor at the release tick) · **`arrivedInFlight`** (outside at release, inside at contact) ·
**`struckThrough`** (never inside — the ball reached him elsewhere).

⚠ **A DECLARED CHOICE, per #381 item 6(v)'s own escape clause.** The engine ships **NO boolean
pass-corridor width**: its shipped corridor (`flightExposure`) is a **SOFT** exposure. What it
does own is the corridor family's own **metre normalizer** — `DV_CORRIDOR_SCALE`, which the seat
documents as `laneOpenness`'s answer to *"how many metres off a passing lane does a defender have
to be before he is irrelevant to it"* — and `laneOpenness`'s own clear-the-kicker guard
`DV_CLEAR_RADIUS`. The membership test is therefore **this census's**, built from **those two
engine constants and no new one**, on `closestPointOnSegment(launch, E, o.pos)` **CALLED**:
inside ⇔ the closest point is at least `DV_CLEAR_RADIUS` from the launch **and** the body is
nearer than the half-width. The **`CONTROL_RADIUS` half-width** — the BK shell's own reach — is
published **beside** as a **TIGHT-corridor robustness bin**. ⛔ A bin, not a second definition.

### §P.C THE READS (the literals and their selectors)

The five sentences of §0 are **frozen literals in the instrument**. The **SELECTOR** is a STORED
majority boolean per candidate class, computed from the artifact's own composition shares:
`majority(Cn) = share(Cn) > 0.5`; if exactly one class holds a majority it is the **majority
class**, otherwise `mixed = true` and the no-majority sentence prints. The **READ OF RECORD** is
selected on the **E** arm's booleans; **D**'s booleans, shares and sentence are printed BESIDE.
The agreement boolean (`E majority class === D majority class`) selects one of the two agreement
sentences. `gReadWords` re-derives **every** boolean, the `mixed` flag, the majority class, the
printed sentence and the agreement word by applying the frozen rule to the **SERIALIZED** per-seed
cells off disk, and asserts every printed sentence is one of the frozen literals. Canon, VERBATIM:
*"a counterfactual verdict sentence ('had X been scored, the rule would read W') quotes a word the
instrument STORED by applying the frozen rule to X's stored interval; a universal sentence about a
table ('every bin', 'the one bin') is a stored boolean or is not written"* (home:
`BF-T1-FACING-COST-EXAM.md` §COMMANDER CORRECTIONS items 1–2).

### §P.D THE ESTIMATOR

**Cluster bootstrap over match SEEDS, 2,000 draws**, rng seeded from the block base 12,540,000.
Every published share carries a 95 % percentile interval and its half-width; every paired Δ is
**D − E** on the seeds the arms share, so the interval is PAIRED by construction. Medians are
**BIN-DERIVED** (the lower edge of the bin whose cumulative count first reaches n/2) so `gFaces`
re-derives every one off disk — canon, VERBATIM: *"the re-derivation gate covers EVERY published
face; a percentile face requires stored bins"*. ⛔ **Nothing in this census is scored** and
⛔ **no null is cut anywhere**: an interval containing zero reads *"unresolved at this power"*.

### §P.E SEEDS AND SIZING

* **Block 12,540,000–999**: battery seeds **12,540,000–12,540,997** (**N_FROZEN = 998** — #381
  item 6(vii)'s own cap, the largest the block affords), construction receipt **12,540,999**.
  Each seed is walked **ONCE PER ARM** ⇒ **1,998 walks booked = walked**. The **UNWALKED TAIL IS
  DECLARED**: seed **12,540,998**, stored in the artifact's `seeds.unwalkedTail`.
* **Scratch, out-of-band only** (canon, VERBATIM: *"verifier scratch walks use the stage's own
  consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"*):
  smoke **900,002,800–811** with its receipt at **900,002,820**; **gTraceInert** at
  **900,002,880–881**; **gLockstep** at **900,002,890–891**. ⭐ **EVERY scratch seed walked is
  STORED in the artifact's `seeds` block** — PT-C0 §COMMANDER CORRECTIONS item 3 asked future
  instruments for exactly that.
* **Stats consumed: ZERO.** Registry **73** untouched.
* **SIZING** (the house form; §DEV-PREFLIGHT's smoke is the variance source). Target **0.05** on
  the three quantities the reads rest on, all on the **E** arm:

| face (arm E) | realised hw (12 clusters) | target | N required | resolvable at 998 |
|---|---|---|---|---|
| `composition.C1` | 0.09061511928715146 | 0.05 | **81** | ✅ |
| `composition.C3` | 0.08418638155899302 | 0.05 | **70** | ✅ |
| `bounce.rate.ownBody` | 0.040642249633885325 | 0.05 | **17** | ✅ |

  All three are resolvable well inside the block, so **N_FROZEN takes #381 item 6(vii)'s cap** and
  **no row is declared unresolvable**. Expected half-widths at N_FROZEN: 0.009936330280338725 ·
  0.009231392055292276 · 0.004456594207182387 (MDEs 0.014203054879360227 · 0.013195411613243654 ·
  0.006370284633643694). ⚠ **What is NOT sized is stated instead**: every face on a small cell —
  the `none` first-contact class, the `poke` / `header` ledger kinds, the C5 sub-classes — is
  reported with its own realised interval and no null is cut on it.
* **Bins** (frozen): heading angle 15° × 12 · launch speed 2 m/s × 13 · distance 5 m × 13 ·
  relative speed 2 m/s × 13 · body speed 1 m/s × 13 · lateral speed 0.5 m/s × 13 · along-launch
  velocity ±1 m/s × 21 signed (PT-C0's own grid) · first-contact class × 4 · ledger kind × 6 ·
  sector × 3 · settle ladder × 5 per own class · composition × 5 · C5 subs × 4 · C4 overlap × 4 ·
  bounce×rebound 2×2 · origin × 8 · opponent corridor × 3 (and its tight variant).
  Flight retire cap **720 ticks** (PT-C0's own, inherited).

### §P.F THE GATES (all liveness/receipt — NEVER direction)

`gWorld` (per arm, on EVERY walked match and the receipt: `raArmedVersion === 12`,
`traceContests` TRUE, every RC/BF flag ABSENT — `rcAnticipate` / `rcReady` / `bfFacingCost` all
not true — and `info.genome` clean of the world-12 pin, the corridor weight and the RC gene) ·
`gDoseSource` (the shipped loaders CALLED; the FILE BYTES hashed and compared to the PINNED
values; exit 3 on mismatch) · `gTraceInert` (trace ON vs OFF, byte-identical whole-match
signatures, on shared out-of-band scratch seeds, per arm) · `gLedgerNonVacuous` (contest episodes
and recorded contacts exist on BOTH arms; every kind counted comes from `ContestContactKind`'s own
union; the `unrecorded` share is published, never imputed) · `gAnchoredConstants` (anchored
extraction with line receipts over the ledger's seven sites, the claim builder's maxSpeed branch
with the `24` pinned AT ITS SITE, the `readyTick` form and K, the maxSpeed constants,
`CONTROL_RADIUS`, PT-C0's population and class ladders, the FOUR `ball.lastTouch = p` sites
RECOUNTED, the `BodySector` union AND the law's own SQRT1_2 cones verbatim, the corridor geometry
and both its constants, the PC seat's read-only hold view and its own liveness rule, and world
12's composition lines) · `gWalkFixtures` (the bounce predicate on constructed settle-window
states incl. the K window and the `unresolved` case; the class precedence on constructed contacts,
every branch and every C5 sub; the kind cross-check's three-way branch; the heading arithmetic
with the cone DERIVED from `Math.SQRT1_2`; the corridor test at both half-widths incl. the
clear-the-kicker guard; PT-C0's rebound sign; the law's own sector classifier CALLED; every bin
helper) · `gClassesNonVacuous` (measured ground-pass flights, own-body first contacts, BOUNCES,
ownTarget contacts both held and bounced with a defined release angle, and opponent first contacts
all exist on BOTH arms) · `gLockstep` (no wrapper; observed ≡ unobserved byte for byte, per arm,
on out-of-band scratch) · `gSrcUntouched` (`git diff --stat HEAD -- src` **AND**
`git status --porcelain -- src` both empty — canon: xSrcUntouched) · `gSeedsBookedEqualWalked` ·
`gN` · `gFaces` (**EVERY** published face, paired Δ, bin, median and partition re-derived off the
**SERIALIZED** artifact) · `gReadWords` (the five sentences, every majority boolean and the
agreement word re-derived off the serialized artifact) · `gHashOrder` (the body hash computed
**LAST** off an explicit ALLOWLIST SCHEMA, with a NON-body `receipts.hashReproducesFromFile`).

Canon quoted where it applies — VERBATIM: *"the hashed body is built from an explicit ALLOWLIST
SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"*
(home: `PC-T0-LATENCY-SEAM.md` §COMMANDER CORRECTIONS item 1); VERBATIM: *"the body hash is
computed after every body key is assigned, and a NON-body receipt field records that the hash
reproduces from the written file"* (home: `RC-T1A-PRECUE-EXAM.md` §COMMANDER CORRECTIONS item 3,
ruling #372 item 3); VERBATIM: *"an artifact is written as compact JSON — no indentation; the hash
is over the canonical body regardless; pretty-printing is a reader's tool, not a storage form"*
(home: ruling #372 item 5); VERBATIM: *"a src-extracted constant pins its extraction to the NAMED
call site — anchored match + line receipt — never first-occurrence"* (home:
`BK-C0-BODYBALL-CENSUS.md` §COMMANDER CORRECTIONS item 1); VERBATIM: *"a seam-map gate pins
occurrence COUNTS per needle and enumerates EVERY occurrence's site"* (home:
`PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 1) — the corridor expression's TWO sites
are enumerated for exactly that reason; VERBATIM: *"a field carries the unit its name claims"*
(home: ruling #294 item 3); VERBATIM: *"a scored face's walk-side predicate is pinned — anchored
extraction or fixture — because the re-derivation gate proves arithmetic, not definitions"* (home:
`DF-T3-SURFACE-EXAM.md` §COMMANDER CORRECTIONS item 2); VERBATIM: *"a gate's NOTE derives from the
same pinned values the gate checks; a count typed beside its pin is a second copy"* (home:
`PT-C0-PLAYTEST-FORENSIC-CENSUS.md` §COMMANDER CORRECTIONS item 1) — every gate NOTE here
interpolates the same values its `ok` reads; VERBATIM: *"a stage doc's prose quotes artifact
FIELDS verbatim or the number becomes a gated face"* (home: `PC-T2-ARMED-WORLD-READ.md`
§COMMANDER CORRECTIONS item 4); VERBATIM: *"a starred finding states its |Δ|÷half-width ratio"*
(home: `BU-T0B-PRICE-SEPARATION.md` §COMMANDER CORRECTIONS item 2); VERBATIM: *"a stage doc's
HONEST LIMITS list is the ONE home; the artifact stores that list verbatim or stores none"* (home:
`RC-C0-COOPERATION-CENSUS.md` §COMMANDER CORRECTIONS item 3, ruling #367 item 3) — **this artifact
stores NONE**; §HONEST LIMITS below is the list of record. Ledger and dose receipts are **never**
quoted as football effect sizes (ruling #289 item 1 + `BU-T1-MT-COMPOSITION.md` §COMMANDER
CORRECTIONS item 5).

## §DEV-PREFLIGHT — the sizing smoke, disclosed in full

A **12-cluster scratch smoke** (`BNC0_MODE=smoke BNC0_N=12`, seeds **900,002,800–811**, receipt
900,002,820, gTraceInert on 900,002,880–881, gLockstep on 900,002,890–891, artifact off the
canonical path at `/tmp/bn-c0-smoke.json`) was run **BEFORE this freeze**. Its realised
half-widths were read out of the smoke artifact's own `faces[].halfWidth` fields on the E arm —
**never re-typed from the console's rounded print** — and are hardcoded in the instrument's
`SIZING_INPUTS` (the three rows in §P.E's table).

**Disclosed honestly:**

* The first 12-cluster run went **RED on one gate**, an instrument defect fixed before this freeze
  and stated here so the record shows what moved and when: `gAnchoredConstants` — the corridor
  expression `const cp = closestPointOnSegment(from as V2, aim as V2, o.pos);` was pinned at
  **1** occurrence and the file honestly carries **2** (`flightExposure`'s and the BK shell
  loop's). Fixed by pinning the NAMED site with its own following guard line **and** adding a
  second anchor that enumerates BOTH occurrences — which is the anchored-extraction and
  needle-count canon working exactly as intended: a wrong count is a RED gate, not a silent pass.
  After the fix the same 12-cluster smoke re-ran **14/14 GREEN**.
* ⭐ **THE TRACE OVERHEAD, MEASURED** (#381's run-discipline asked for it). On 24 world-12
  empty-book matches run to completion on this machine, twice, discarding a warm-up pass: mean
  **89.333333 ms/match with `traceContests` ON** against **88.000000 ms/match OFF** ⇒ an overhead
  of **1.333333 ms per match**. ⚠ A machine reading on one machine, and a receipt, **never** a
  football number. The smoke's own `perf.meanWallSecondsPerMatch` was **0.111292** s ⇒ the full
  battery (998 seeds × 2 arms) is expected to take roughly **3.7 minutes** of walking plus the
  lockstep and trace-inertness fixtures.
* ⚠ **12 clusters is a NOISY variance estimate** — a strictly weaker assumption than sizing off a
  published battery. Said here, before the battery.
* ⚠ The smoke's own POINT readings are **UNPOWERED and bind nothing**. For the record, so nobody
  can claim the freeze was written after seeing a battery: on 12 scratch seeds the E arm read an
  own-body bounce rate ≈ 0.33, a C1 share ≈ 0.57 against a C3 share ≈ 0.41 with C2 and the
  exclusive C4 at zero, a C4 OVERLAP ≈ 0.46, and the printed sentence was the CONTROL-QUALITY one
  on both arms. **None of these numbers is a finding**; the battery's own §R replaces every one of
  them, and a battery that printed a different sentence would be reported as-is.
* The smoke ALSO confirmed instrument liveness: both arms carried measured ground-pass flights,
  own-body first contacts, bounces, held and bounced ownTarget contacts with defined release
  angles, and opponent first contacts; the contest ledger was non-vacuous on both; `gTraceInert`
  and `gLockstep` were green on all their arm × scratch-seed walks; and
  `receipts.hashReproducesFromFile` read true off the written file.
* **This section binds nothing.** The freeze is §0–§P.F above.

## §R RESULTS

*(written at the results commit, after the battery — every number quotes the artifact's own fields
at 6 dp or carries a stated derivation)*
