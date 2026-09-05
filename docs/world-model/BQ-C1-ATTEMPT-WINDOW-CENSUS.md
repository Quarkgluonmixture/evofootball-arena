# BQ-C1 — 「三拍」 THE ATTEMPT-WINDOW CENSUS（脚碰到球到球归我这三拍里，到底是谁把球带走的）

> **The census that follows EVERY control attempt from the cushioning contact to the tick it ENDS,
> attributes the ending to the engine's OWN `this.pendingControl = null` sites, and names the
> mechanism the quality law must address.** Authorized by **COMMANDER RULING #383 item 6**.
> Binding contract: [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md) **§2 M-BK.2** (ONE CONTACT
> LAW — "quality stays skill-priced") and its **§3 STATUS** line, which names this census.
> Lineage: [`PT-C0-PLAYTEST-FORENSIC-CENSUS.md`](PT-C0-PLAYTEST-FORENSIC-CENSUS.md) → the RC arc →
> [`RC-T1B-READY-EXAM.md`](RC-T1B-READY-EXAM.md) (**FAIL** — not the receiver's readiness) →
> [`BN-C0-BOUNCE-CENSUS.md`](BN-C0-BOUNCE-CENSUS.md) (**not the sector**; the bounce is a
> control-QUALITY event) → [`BQ-C0-FIRST-TOUCH-CENSUS.md`](BQ-C0-FIRST-TOUCH-CENSUS.md) (**not the
> coin** — it is honest, has no heavy face, and its failures are at most **0.163509** of the
> control attempts that end without possession) → **#383 item 4(iii)**, which labelled THE WINDOW a
> HYPOTHESIS and dispatched its probe → **#383 item 6**, this census.
> Census form of record: [`BQ-C0-FIRST-TOUCH-CENSUS.md`](BQ-C0-FIRST-TOUCH-CENSUS.md).
> Instrument: `scripts/probes/bq-c1-attempt-window-census.ts`.
> Artifact: `docs/world-model/data/bq-c1-attempt-window-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. **IT SHIPS NOTHING**, scores no hypothesis
> and arms no mechanism. The READ SENTENCES of #383 item 6(vi) are FROZEN LITERALS selected by
> **STORED booleans**. The commander rules.
> ⛔ **X-SRC-ZERO**: no file under `src/` is created or edited. The probe CALLS the shipped exports
> (`directBallAccess`, `pressureAt`, the composer, the dose loaders) and reads `Match` state per
> tick; the **contest-episode ledger** and the **E1a first-touch ledger** are READ, never
> re-implemented; the `= null` sites are **ANCHORED**, never re-implemented. There is NO WRAPPER —
> `gLockstep` proves observed ≡ unobserved byte for byte per arm, and `gTraceInert` proves both
> trace flags change no byte of the world.
> ⛔ **WORLD 12 IS UNTOUCHED**: no world is cut, no flag is armed, the user's play-test gate stays
> the user's.
> ⭐ **THE BINDING CANON IS #381 item 3** — VERBATIM: *"an event attribution reads the engine's
> own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is
> written only where no record exists, and says so"* (home: `RC-T1B-READY-EXAM.md` §COMMANDER
> CORRECTIONS item 5). **The `= null` sites ARE the ledger.** §P.B says, class by class, what is
> OBSERVED and what is INFERRED — and every inferred cell is published as a **BOUND**, which is
> BQ-C0 §COMMANDER CORRECTIONS item 2's own remedy.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**THE USER'S VERDICT, VERBATIM** (#368 item 1, received 2026-09-03) — the third clause is this
census's ancestor:

> 「12我看了下,还是有人挤人,传不出去球,**传到人身上弹回**,或经常传到对面身上」

**COMMANDER RULING #383 item 4(iii) — THE WINDOW, LABELLED A HYPOTHESIS. VERBATIM (the
arithmetic this census re-derives with declared denominators):**

> *"⭐⭐⭐ **THE COIN IS NOT THE STORY**. On E the roll's failures are **4,460**; the pending
> attempts that ended WITHOUT possession at their readyTick are at least 15,301 ABANDONED before
> the readyTick (0.111320 of 137,451 pending controls) + ≥ 7,516 NOT REACHED at it + 4,460 rolled
> failures = **≥ 27,277** — the roll is at most **0.163509** of that mass (a derivation on stored
> counts; the denominators declared: pending controls created, resolutions, trace entries; BN-C0's
> own-target no-possession share 0.227241 = 1 − 0.772759 is the same order on its own
> denominator). The user's 「弹回」 in the form he plays is therefore MOSTLY THE WINDOW: the three
> ticks (`CONTACT_CONTROL_DELAY_TICKS`) between the cushioning contact and the control resolution,
> during which the attempt is ABANDONED (another body's contact replaces it — an opponent's poke
> is a legitimate 被断, a teammate's is 「有人挤人」 — or the ball dies, goes out, or offside is
> called) or the body is NOT within reach when the tick comes (the cushion ran away from him, or he
> ran away from it). A MECHANISM, not a roll — LABELLED HYPOTHESIS with its probe (item 6)."*

**COMMANDER RULING #383 item 6, the scope this census instruments, VERBATIM:**

> *"⭐⭐ **BQ-C1 DISPATCHED — 「三拍」 THE ATTEMPT-WINDOW CENSUS** (a C0-form census; X-SRC-ZERO;
> definitions frozen at the executor's §P): THE QUESTION — when a control attempt ends WITHOUT
> possession, what ended it? (i) ARMS E / D as BQ-C0's (both traces on; the curve pinned; the dose
> pins). (ii) POPULATION: every `pendingControl` CREATED (the `applyControlContact` site —
> anchored; the type-view read, declared as at BQ-C0), tracked from its creation tick to its END;
> INTENDED TARGETS primary, all bodies beside. (iii) ⭐⭐ THE END, BY THE ENGINE'S OWN SITES — the
> census anchors EVERY `this.pendingControl = null` site in `Match.ts` (the enumeration is a gate:
> needle count = the sites listed) and classifies each ending by the site that fired, read at the
> tick it fired: RESOLVED-CLEAN (the resolver, `clean` — possession) · RESOLVED-ROLL-FAIL (the
> resolver, `!clean`) · RESOLVED-NOT-REACHED (the resolver's pre-roll returns — a missing /
> sent-off / stunned body, or the retention margin: WHICH, and for the margin the geometry — the
> ball's displacement since contact vs the body's, so "the cushion ran away" and "he ran away" are
> separated) · ABANDONED-BY-CONTACT (another claim applied within the window: the replacing body's
> SIDE and the contest ledger's kind — opponent poke / opponent control / teammate — and whether it
> was the SAME receiver again) · ABANDONED-DEFLECTION · ABANDONED-DEAD-BALL / OUT ·
> ABANDONED-OFFSIDE · ABANDONED-OTHER (each remaining site its own class; nothing pooled; an ending
> with no site fired is a published receipt, never imputed). (iv) THE WINDOW'S PHYSICS on every
> attempt: the cushion release speed and direction at the contact tick (the contact law's own
> `CONTACT_RELEASE_*` and `CONTACT_TANGENTIAL_RETENTION` — anchored; the ball's post-contact
> velocity relative to the body), the body's speed and heading, the nearest opponent's distance at
> contact and at the end tick (the `pressureAt` inputs, read from public state — a declared
> reconstruction beside the ledger's own pressure where a roll occurred), the receiver's
> `action.type` at contact and at the end, whether a PC hold was live (pure Map.get), the pass
> class, the ball speed at contact. Publish P(no possession | cell) and THE COMPOSITION of
> non-possession endings with the MAJORITY class STORED as a boolean per class (majority > 0.5;
> none ⇒ mixed), on intended targets, E primary, D beside with the agrees boolean. (v) THE
> RECONCILIATION FACE: the roll-fail share of non-possession endings (item 4(iii)'s 0.163509
> re-derived on this block with declared denominators) and BN-C0's own-target no-possession share
> on this block (its predicate re-used, anchored) — beside, so the three censuses' denominators are
> printed together once. (vi) PRE-REGISTERED READS (frozen literals on the E arm's stored majority
> booleans; D beside): RESOLVED-ROLL-FAIL ⇒ "THE WINDOW IS THE COIN AFTER ALL — BQ-T0 re-forms the
> roll."; ABANDONED-BY-CONTACT with the replacing body an OPPONENT ⇒ "THE WINDOW IS A DUEL — the
> defender's poke inside three ticks; 「被断」 not 「弹回」; the contest law and the pressure world are
> named."; ABANDONED-BY-CONTACT with the replacing body a TEAMMATE ⇒ "THE WINDOW IS CROWDING —
> steps ②/③ are named."; RESOLVED-NOT-REACHED with the ball's displacement the larger ⇒ "THE WINDOW
> IS THE CUSHION — the contact law's release constants are named; the ball runs away from the
> foot."; RESOLVED-NOT-REACHED with the body's displacement the larger ⇒ "THE WINDOW IS THE
> RECEIVER'S FEET — he runs off the ball; the executor's plan inside the window is named.";
> DEAD-BALL / OUT / OFFSIDE majority ⇒ "THE WINDOW IS THE LINE — not a control question."; no
> majority ⇒ "THE WINDOW IS MIXED — the commander decides with the table." (vii) SEEDS: block
> **12,542,000–999** (N sized by a disclosed 12-seed smoke on scratch 900,003,000–011; smoke
> receipt 900,003,020; trace-inert 900,003,080–081; lockstep 900,003,090–091; receipt 12,542,999);
> ZERO stats; registry 73; compact JSON; the hash receipt outside the body; honest-limits single
> home; every read word STORED; the prose sweep; universal sentences as stored booleans or not at
> all; engine ledgers before heuristics (the `= null` sites ARE the ledger). DOC
> `BQ-C1-ATTEMPT-WINDOW-CENSUS.md`; INSTRUMENT `scripts/probes/bq-c1-attempt-window-census.ts`
> (BQ-C0's arms, pairing, estimator, hash order and type-view read REUSED); ARTIFACT
> `docs/world-model/data/bq-c1-attempt-window-census.json`."*

**THE READ SENTENCES, VERBATIM** (#383 item 6(vi)) — frozen here, before any battery seed, and
PRINTED by the instrument from stored booleans:

| selector (a STORED boolean on the NON-POSSESSION composition, arm E, intended targets) | the sentence PRINTED, verbatim |
|---|---|
| **RESOLVED-ROLL-FAIL** majority | *"THE WINDOW IS THE COIN AFTER ALL — BQ-T0 re-forms the roll."* |
| **ABANDONED-BY-CONTACT**, replacing body an **OPPONENT**, majority | *"THE WINDOW IS A DUEL — the defender's poke inside three ticks; 「被断」 not 「弹回」; the contest law and the pressure world are named."* |
| **ABANDONED-BY-CONTACT**, replacing body a **TEAMMATE**, majority | *"THE WINDOW IS CROWDING — steps ②/③ are named."* |
| **RESOLVED-NOT-REACHED**, the **BALL's** displacement the larger, majority | *"THE WINDOW IS THE CUSHION — the contact law's release constants are named; the ball runs away from the foot."* |
| **RESOLVED-NOT-REACHED**, the **BODY's** displacement the larger, majority | *"THE WINDOW IS THE RECEIVER'S FEET — he runs off the ball; the executor's plan inside the window is named."* |
| **DEAD-BALL / OUT / OFFSIDE** majority | *"THE WINDOW IS THE LINE — not a control question."* |
| no majority | *"THE WINDOW IS MIXED — the commander decides with the table."* |
| a PARENT holds the majority but NEITHER sub-class does | the parent's name, then the MIXED literal APPENDED: *"ABANDONED-BY-CONTACT — THE WINDOW IS MIXED — the commander decides with the table."* / *"RESOLVED-NOT-REACHED — THE WINDOW IS MIXED — the commander decides with the table."* |

and beside them, from a stored boolean, one of: *"THE DOSED WORLD AGREES ON THE MAJORITY CLASS"* /
*"THE DOSED WORLD DISAGREES ON THE MAJORITY CLASS"*.

### in plain football language

Three censuses have taken three explanations away from the user's 「传到人身上弹回」. It is **not**
that the receiver was not ready (RC-T1b). It is **not** which side of his body the ball met
(BN-C0). And it is **not** the dice roll on his first touch (BQ-C0: the coin is fair, no face of it
is heavy, and it accounts for at most about one in six of the control attempts that end with
nobody in possession).

What is left is **the window**. In this engine, when a foot cushions a moving ball, the ball does
**not** become his. The engine opens a *pending control attempt* and gives it **three ticks**. Only
when the third tick comes does the engine ask "is he still there, and does the touch stick?" — and
only then can he own it.

Three ticks is a long time in a crowd. Inside that window the attempt can simply **disappear**:

* a **defender** gets a foot in and the ball is his contact now — that is 「被断」, an honest tackle;
* a **teammate** blunders into the same ball — that is 「有人挤人」;
* **the same man** touches it again, restarting his own three ticks;
* the ball is **deflected** off a body that is not allowed to control it;
* the ball goes **out**, the whistle goes, or **offside** is called;
* or nothing dramatic happens at all and, when the tick comes, **he is simply not within reach** —
  either the cushion pushed the ball further than he could follow, or he ran past it.

Nobody has ever counted which of those it is. This census does exactly that, and it does it by the
engine's own bookkeeping: there are **exactly ten places** in `Match.ts` where the engine writes
`this.pendingControl = null`, plus **one** place where a new contact writes straight over the old
attempt. The census lists all eleven with their line numbers, and every ending is attributed to one
of them from **public state at the tick the attempt vanished**.

It also prints, honestly, **which attributions the engine hands over and which the census has to
infer**. The roll failures come from the engine's own first-touch notebook. Possession comes from
the ball's own owner. The replacing body comes from the engine's own `pendingControl` field. Those
are **observed**. But the resolver's two pre-roll exits — "he was stunned" versus "he was out of
reach" — are invisible from outside, so those two cells are published as **bounds**, and only their
**sum** is exact. That is BQ-C0's own correction being obeyed rather than repeated.

⛔ Nothing here is decided, nothing is built and no world changes. **A census does not repair the
window. It names who is standing in it.**

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — two, PAIRED on shared seeds; and THE CURVE, PINNED

Arm `k` walks seed `s` with the **IDENTICAL population construction** (BQ-C0's own `buildMatch`
plumbing: genomes and squads drawn from the seed exactly as it does, the same 240 s match), so the
two arms differ **ONLY** in the world's own books and **every Δ is PAIRED per seed**.

| arm | composition — the composer **CALLED, never copied** | gate on the match |
|---|---|---|
| **E** | **world 12 EMPTY-BOOK — the exams' form**: `a4MatchFlags(12)` as construction flags + `armA4World(m, null, 12)` | `raArmedVersion(m) === 12` |
| **D** | **world 12 DOSED — THE FORM THE USER PLAYS**: the same, plus the two doses from the **SHIPPED LOADERS THEMSELVES** (`loadL3Dose` / `loadPcDose`, CALLED) | `raArmedVersion(m) === 12` |

**BOTH arms are constructed with `traceContests: true` AND `traceFirstTouch: true`.** Both are
**observation, not a world**. `gTraceInert` proves it on shared out-of-band scratch seeds: the same
seed built with both traces ON and both OFF runs to completion with a **byte-identical whole-match
signature**, on both arms.

**⭐⭐ THE CURVE IS PINNED BEFORE THE BATTERY** on a constructed match of **each** arm at scratch
seed **900,003,070**, stored, and asserted on **every** walked match by `gWorld`. The string
`edsTouchCost` appears **zero** times in the whole world composer `src/game/a4World.ts` (an anchor
with `want = 0`), and the probe's §1 envelope **refuses the `EDS_BUNDLE` env outright**.

**THE DOSES ARE PINNED.** `gDoseSource` hashes the FILE BYTES this process read from
`docs/world-model/data/l3-t1-convergence-exam.json` and
`docs/world-model/data/pc-t1-learning-exam.json` and compares them to the values #383 item 6
pinned; a mismatch is `process.exit(3)` **before any seed is walked**. Canon, VERBATIM: *"a
dose-source guard should hash the bytes it reads, not a self-declared field"* (home:
`BU-T1-MT-COMPOSITION.md` §COMMANDER CORRECTIONS item 6).

**THE PAIRED Δ (D − E)** is published on **every** face by a 2,000-draw cluster bootstrap that
resamples SEEDS, both arms moving together inside every draw. ⛔ **The census SCORES nothing.** The
reads rest on the **E** arm's stored booleans, with **D**'s printed beside at the same precision
and the same prominence.

### §P.B THE POPULATION, THE SITES, THE ATTRIBUTION AND THE FACES

#### ⭐⭐ THE SITE ENUMERATION — the engine's own ledger of endings

The needle **`this.pendingControl = null`** is counted in `src/sim/Match.ts`. **`gSiteEnumeration`
pins the count and lists EVERY occurrence with its line and its purpose**, read from the
surrounding code. Canon, VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle and
enumerates EVERY occurrence's site"* (home: `PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS
item 1). **At dispatch the needle occurs TEN times** (⚠ the dispatch brief said eleven — a
DECLARED DEVIATION, §DEVIATIONS item 1; the gate pins what the file holds and the note derives from
the pin), and the **creation** needle `this.pendingControl = {` occurs **once**.

| line | site | purpose (read from the surrounding code) | the ending class it serves |
|---|---|---|---|
| **3661** | `kickBall` | the low-level kick releases the ball with velocity and a re-capture cooldown; any pending control on that ball is void | `abandonedPossessionElsewhere` / `abandonedOther` |
| **3685** | `giveBall`'s OFFSIDE branch | the flagged target touches the ball, so the "reception" is a dead ball, not a control | `resolvedOffside` / `abandonedOffside` |
| **3828** | `giveBall`'s TAIL | a body is given clean control; the attempt is consumed by the possession it produced | `resolvedClean` (and `abandonedPossessionElsewhere` off other callers) |
| **4801** | `awardRestart` | a restart (kickIn / corner / goalKick / freeKick) kills the live ball; the contest resolves `out` or `deadBall` | `abandonedDeadBallOut` (and `abandonedOffside` via `callOffside`) |
| **5582** | ⭐ `bkApplyBodyStrike` | **THE DEFLECTION PRECEDENT**, in the engine's own comment: *"the deflection precedent: that attempt's ball is gone"* | `abandonedBodyStrike` (ledger kind `body`) |
| **5620** | `applyControlContact`'s OFFSIDE branch | the cushioning contact itself is an offside reception; no attempt is created | `abandonedOffside` |
| **5636** | ⭐⭐ `resolvePendingControlAttempt`'s OWN CLEAR | fires **UNCONDITIONALLY** once `stepCount >= readyTick`, BEFORE the pre-roll returns and before the roll. **Every RESOLVED-\* ending is this one site** | `resolvedClean` · `resolvedRollFail` · `resolvedNotReached*` |
| **5681** | `tryCapture`'s APPLIED-DEFLECTION branch | `mech.tryDeflection` succeeded and the ball is gone off a stretched leg | `abandonedDeflection` (ledger kind `deflection`) |
| **5798** | `setupKickoff` | a kickoff (match start, after a goal, after half-time) resets the world | `abandonedDeadBallOut` |
| **5865** | `endMatch` | THE WHISTLE; the contest resolves `stillLoose` | `abandonedDeadBallOut` |

**⭐⭐ AND THE ELEVENTH ENDING, WHICH IS NOT A `= null` AT ALL.** `applyControlContact` ends with
`this.pendingControl = { gid, readyTick: this.stepCount + CONTACT_CONTROL_DELAY_TICKS, ... }` —
it **assigns straight over** any attempt already there. That overwrite **is**
ABANDONED-BY-CONTACT, and the census reads it off the engine's own `pendingControl` field at the
tick boundary. Both statements are anchored.

#### ⭐⭐ THE FROZEN PRECEDENCE, AND WHY

`tryCapture` opens with `if (this.resolvePendingControlAttempt()) return;` (anchored), and the
resolver's own clear fires **before** its pre-roll returns and before the roll. Therefore:

1. **An ending AT OR AFTER `readyTick` is ALWAYS the resolver's site** and is classified
   `RESOLVED-*` before any claim is considered. (Fixture: a replacement present at a resolved tick
   still books `resolvedNotReachedMargin`.)
2. Inside the RESOLVED branch: **offside first** (`giveBall`'s offside branch returns before any
   bookkeeping), then **the roll's failure** (a failed roll cannot grant possession), then
   **possession**, then **not reached**.
3. Inside the ABANDONED branch: **offside first** (both offside sites return immediately), then
   **the replacement** (the engine's own `pendingControl` field is the stronger record than a
   ledger kind at the same tick), then **the deflection kinds**, then **dead ball**, then
   **possession elsewhere**, then **other**.

#### ⭐⭐ THE CLASSES, THEIR PUBLIC SIGNATURES, AND OBSERVED vs INFERRED

Canon, VERBATIM: *"an event attribution reads the engine's own record when one exists (`shotLog`,
the contest episodes, `lastTouch`); a heuristic is written only where no record exists, and says
so"*. ⭐⭐ **BQ-C0 §COMMANDER CORRECTIONS item 2 is the precedent this census must not repeat** — an
inferred split presented as observed. Every INFERRED cell below is published as a **BOUND**, with
its exact-sum receipt.

| class | the public signature the census reads | OBSERVED / INFERRED |
|---|---|---|
| `resolvedClean` | the body **OWNS the ball** at the end tick (`ball.owner.gid === attempt.gid`) | **OBSERVED** |
| `resolvedRollFail` | an **E1a first-touch trace entry** for that gid at that tick with `clean === false` — the engine's OWN ledger | **OBSERVED** |
| `resolvedNotReachedStunnedOrOff` | `p.sentOff \|\| p.stunTimer > 0` at the END of the tick | **INFERRED — a BOUND** |
| `resolvedNotReachedMargin` | the residual of the NOT-REACHED parent | **INFERRED — a BOUND** |
| `resolvedOffside` · `abandonedOffside` | a **NEW `restart` object** at that tick carrying `offside === true` — the engine's own record (`this.restart!.offside = true`, anchored) | **OBSERVED** |
| `abandonedContactOpponent` · `abandonedContactTeammate` · `abandonedContactSameReceiver` | a **NEW `pendingControl`** at the end of that tick — the engine's own field; the replacing body's SIDE off his own `side`, the KIND off the **contest-episode ledger** | **OBSERVED** |
| `abandonedDeflection` | a contest-episode contact of kind `deflection` at that tick | **OBSERVED** |
| `abandonedBodyStrike` | a contest-episode contact of kind `body` at that tick | **OBSERVED** |
| `abandonedDeadBallOut` | a NEW `restart` object, a phase outside `playing`, or the whistle at that tick | **INFERRED** |
| `abandonedPossessionElsewhere` | possession by a **different** body at the end of that tick | **INFERRED** |
| `abandonedOther` | none of the above — the **RECEIPT class**, published with its count and ⛔ never imputed | **INFERRED** |

**⚠ WHY THE STUNNED / MARGIN SPLIT IS A BOUND AND NOT A READ.** The resolver's two pre-roll returns
are `if (!p || p.sentOff || p.stunTimer > 0) return false;` and
`if (access.geometry.centerDistance > access.sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN)
return false;` (both anchored). Neither is observable from outside the step. The census reads
`sentOff` and `stunTimer` at the **END** of the tick — and `stunTimer` can also be **SET** later in
the same tick by a tackle (`Player.step` decays it; `mechanics` raises it), so the end-of-tick read
is neither a proven upper nor a proven lower bound on its own. ⇒ **only the SUM of the two cells is
exact**, and `gAttributionExhaustive` publishes that identity. Beside them the census publishes a
**cross-check receipt**: the **SHIPPED `directBallAccess`, RE-CALLED** at the end tick with the
resolver's own arguments (`p, ball, allPlayers, CONTROL_RADIUS`), compared against the same
retention-margin test. ⚠ That re-call is a **DECLARED RECONSTRUCTION one step later**, a receipt,
never a class definition.

#### THE POPULATION AND THE OTHER DEFINITIONS, FROZEN

| quantity | frozen form |
|---|---|
| **⭐⭐ THE POPULATION** | every `pendingControl` **CREATED** — the `applyControlContact` creation site, the ONE creation site (anchored, needle count 1) — tracked from its creation tick to the tick it **ENDS**. Counts are per match on the **240 s clock** |
| **⚠ THE PRIVATE-FIELD READ, DECLARED** | `Match.pendingControl` is declared `private` and the engine publishes **no mirror**. The census reads it through a TypeScript **TYPE VIEW** — a **READ of engine state, never a write**; `gLockstep` proves the whole observation byte-inert. The BQ-C0 precedent, ratified at #383 item 3 |
| **⚠ THE TICK BOUNDARY, DECLARED** | the population is observed **after `m.step(DT)`**. An attempt created **AND** ended inside ONE tick is invisible to that read. The **contest ledger's own `controlAttempt` contact count** is published beside as the receipt (`population.creationLedgerAgreementShare`); its gap is (a) contacts aborted by the offside branch before the creation and (b) any same-tick create-and-end |
| **INTENDED TARGET** | at the **creation** tick: `pendingPass !== null && pendingPass.targetGid === gid && pendingPass.side === side`. PRIMARY; all bodies published beside |
| **⭐⭐ THE DISPLACEMENT RULE** | for a RESOLVED-NOT-REACHED ending: `ballDisplacement` = \|ball position at the END tick − ball position at the CONTACT tick\|, `bodyDisplacement` the same for the receiver. The cell is `ballLarger` / `bodyLarger` / `tie` on a **STRICT** comparison. *"The cushion ran away"* and *"he ran away"* are exactly these two cells; both displacement distributions are stored as bins |
| **⭐ THE CUSHION RELEASE** | \|v_ball − v_body\| at the **END of the contact tick**, and its component along the body→ball **NORMAL**. ⚠ **ONE physics step after `applyControlContact` ran — a DECLARED phase.** The contact law's own constants are anchored **beside** as the law's own prediction (`release` clamped into [`CONTACT_RELEASE_MIN_SPEED`, `CONTACT_RELEASE_MAX_SPEED`] with `CONTACT_RELEASE_INCOMING_SHARE` and `CONTACT_TANGENTIAL_RETENTION`) — ⛔ never a tolerance |
| **⭐ THE PRESSURE** | the **SHIPPED `pressureAt` CALLED** on the receiver's position against the opposing side, at the contact tick and at the end tick, plus the raw nearest-opponent distance at each. ⚠ a **DECLARED RECONSTRUCTION** from public state — it is not the roll's own logged pressure, which exists only where a roll occurred |
| **THE ACTION** | `p.action.type` at the contact tick and at the end tick, over the **23-name `ActionType` vocabulary PARSED off `src/sim/types.ts` at run time** (⛔ never re-typed into the probe) |
| **THE PC HOLD** | a pure `holdSnapshot()` read of PC-T0's reaction-latency seat — `true` iff that gid holds a live hold at the contact tick. The seat's own existence is published as its own receipt |
| **THE PASS CLASS** | `toFeet` iff a `pendingPass` was live at the contact tick, else `carried` |
| **THE BALL SPEED AT CONTACT** | the attempt's **own frozen `relativeSpeed`** — the engine's own record, the value the resolver hands to the roll |
| **THE LEDGER'S KIND VOCABULARY** | **PARSED off `ContestContactKind` in `src/sim/physical.ts` at run time** (the BN-C0 precedent, #382 item 3), plus a `silent` cell for a tick at which the ledger recorded no contact by the replacing body — **published as such, never imputed** |

#### ⭐⭐ THE COMPOSITION AND THE MAJORITY RULE, FROZEN

**THE NON-POSSESSION TOTAL** = every ending **except** `resolvedClean`. **THE COMPOSITION** is each
class's count ÷ that total, on **INTENDED TARGETS** (E primary, D beside), with every count stored.

`majority(x) = share(x over the NON-POSSESSION endings, intended targets) > 0.5`, **STORED as a
boolean per class**, per parent and per sub-class. The selection runs in this **frozen order**:

1. `resolvedRollFail` majority ⇒ the ROLL-FAIL literal.
2. else the **ABANDONED-BY-CONTACT parent** (opponent + teammate + same receiver) majority ⇒
   opponent sub-class majority ⇒ the DUEL literal; else teammate sub-class majority ⇒ the CROWDING
   literal; else the **parent's name + the MIXED literal appended**.
3. else the **RESOLVED-NOT-REACHED parent** (the two bounds) majority ⇒ `ballLarger` sub-class
   majority ⇒ the CUSHION literal; else `bodyLarger` sub-class majority ⇒ the FEET literal; else
   the **parent's name + the MIXED literal appended**.
4. else **the LINE** (`abandonedDeadBallOut` + `abandonedOffside` + `resolvedOffside`) majority ⇒
   the LINE literal.
5. else `noMajority` is **true** and the MIXED literal prints.

⚠ A sub-class share can never exceed its parent's, so steps 2 and 3 cannot be skipped by a
sub-class alone. ⚠ The sub-class shares are of the **NON-POSSESSION total**, exactly as #383 item
6(vi) specifies — not of their parent (those are published too, at
`notReached.<group>.<cell>OfNotReached`).

#### THE RECONCILIATION FACE — the three denominators, printed together ONCE

| denominator | this census's field | whose it is |
|---|---|---|
| pending controls **CREATED** | `reconciliation.pendingCreatedPerMatch` | **BQ-C1's own** |
| **RESOLUTIONS** — endings at or after `readyTick` | `reconciliation.resolutionsPerMatch` | **BQ-C0's own** |
| own-target first contacts recorded **`controlAttempt`** | `reconciliation.ownTargetControlContactsPerMatch` | **BN-C0's own** |

(a) **#383 item 4(iii)'s 0.163509, RE-DERIVED** on this block: `RESOLVED-ROLL-FAIL endings ÷
NON-POSSESSION endings` — published on all bodies and on intended targets, each with its own
declared denominator. (b) **BN-C0's own-target no-possession predicate, REUSED**: an own-target
contact recorded `controlAttempt` in the contest ledger, read at `contactTick + K` for possession
by that **same** body — `K = CONTACT_CONTROL_DELAY_TICKS`, imported. BN-C0 printed **0.227241** =
1 − 0.772759 on **its own** block and denominator.

### §P.C THE READS (the literals and their selectors)

The sentences of §0 are **frozen literals in the instrument**. The **SELECTORS** are STORED
booleans: `majority[class]` for every class, `majority[parent]` for both parents and the LINE, and
`majority[notReached_ballLarger]` / `majority[notReached_bodyLarger]` — all from the frozen majority
rule applied to the artifact's own composition faces. The **READ OF RECORD** is selected on the
**E** arm's booleans; **D**'s booleans, shares and sentence are printed BESIDE. The agreement
boolean (`E majorityClass === D majorityClass`) selects one of the two agreement sentences.
`gReadWords` re-derives **every** share, **every** boolean, the majority class and **every** printed
sentence by applying the frozen rules to the **SERIALIZED** per-seed cells off disk, and asserts
every printed sentence is one of the frozen literals. Canon, VERBATIM: *"a counterfactual verdict
sentence ('had X been scored, the rule would read W') quotes a word the instrument STORED by
applying the frozen rule to X's stored interval; a universal sentence about a table ('every bin',
'the one bin') is a stored boolean or is not written"* (home: `BF-T1-FACING-COST-EXAM.md`
§COMMANDER CORRECTIONS items 1–2). ⭐⭐ **Three censuses in a row fell to that sentence** (BN-C0
§CORR 1, BQ-C0 §CORR 1, RC-T1b §CORR 1); this doc writes no universal that is not a stored boolean.

### §P.D THE ESTIMATOR

**Cluster bootstrap over match SEEDS, 2,000 draws**, rng seeded from the block base 12,542,000.
Every published share carries a 95 % percentile interval and its half-width; every paired Δ is
**D − E** on the seeds the arms share, so the interval is PAIRED by construction. Medians are
**BIN-DERIVED** (the lower edge of the bin whose cumulative count first reaches n/2) so `gFaces`
re-derives every one off disk — canon, VERBATIM: *"the re-derivation gate covers EVERY published
face; a percentile face requires stored bins"*. ⛔ **Nothing in this census is scored** and ⛔ **no
null is cut anywhere**: an interval containing zero reads *"unresolved at this power"*.

### §P.E SEEDS AND SIZING

* **Block 12,542,000–999**: battery seeds **12,542,000–12,542,997** (**N_FROZEN = 998** — the
  largest N the block affords after the construction receipt), construction receipt
  **12,542,999**. Each seed is walked **ONCE PER ARM** ⇒ **1,998 walks booked = walked**. The
  **UNWALKED TAIL IS DECLARED**: seed **12,542,998**, stored in the artifact's `seeds.unwalkedTail`.
* **Scratch, out-of-band only** (canon, VERBATIM: *"verifier scratch walks use the stage's own
  consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"*):
  smoke **900,003,000–011** with its receipt at **900,003,020**; the **curve pin** at
  **900,003,070**; **gTraceInert** at **900,003,080–081**; **gLockstep** at **900,003,090–091**.
  ⭐ **EVERY scratch seed walked is STORED in the artifact's `seeds` block.**
* **Stats consumed: ZERO.** Registry **73** untouched.
* **SIZING** (the house form; §DEV-PREFLIGHT's smoke is the variance source). The reads rest on the
  **composition of NON-POSSESSION endings** on the **E** arm, so the six faces the selection rule
  can turn on are what is sized. **THE DECLARED HALF-WIDTH IS 0.02** — the value the block
  certifies on every one of the six. The tighter **0.01** target is published on the same six faces
  so the reader sees exactly what the block does **not** afford:

| face (arm E) | realised hw (12 clusters) | N required @ 0.02 | N required @ 0.01 | resolvable at 998 |
|---|---|---|---|---|
| `composition.intended.resolvedRollFail` | 0.07385471671185959 | **335** | **1338** | ✅ at 0.02 · ⛔ at 0.01 |
| `composition.intended.parent.abandonedByContact` | 0.06601439496176338 | **268** | **1069** | ✅ at 0.02 · ⛔ at 0.01 |
| `composition.intended.abandonedContactOpponent` | 0.06601439496176338 | **268** | **1069** | ✅ at 0.02 · ⛔ at 0.01 |
| `composition.intended.parent.resolvedNotReached` | 0.08751715668568952 | **470** | **1878** | ✅ at 0.02 · ⛔ at 0.01 |
| `notReached.intended.ballLargerOfNonPossession` | 0.10526315789473684 | **680** | **2717** | ✅ at 0.02 · ⛔ at 0.01 |
| `notReached.intended.bodyLargerOfNonPossession` | 0.05849056603773585 | **210** | **839** | ✅ both |

  Expected half-widths at N_FROZEN: 0.008098481398941804 · 0.007238757028153215 ·
  0.007238757028153215 · 0.009596625605816181 · 0.011542549537225569 · 0.0064137374315338305
  (MDEs 0.011576021781023902 · 0.010347126195337161 · 0.010347126195337161 ·
  0.01371747881667983 · 0.016498995091713084 · 0.009167837838697178). ⚠ **What is NOT sized is
  stated instead**: every face on a small cell — the offside classes, the `other` receipt class,
  the tail physics bins, the `silent` ledger cell — is reported with its own realised interval and
  **no null is cut on it**.
* **Bins** (frozen, all STORED EDGES — ⛔ never rules): cushion release 0.25 m/s × 20 · its normal
  component 0.25 m/s × 20 · body speed 1 m/s × 12 · relative speed 2 m/s × 13 · opponent distance
  1 m × 16 · pressure 0.1 × 11 · displacement 0.1 m × 20 · window length 1 tick × 10 · ending
  classes × 14 · displacement cells × 3 · replacing sides × 3 · ledger kinds × 6 · pass classes × 2
  · action names × 23 · groups × 2.

### §P.F THE GATES (all liveness/receipt — NEVER direction)

`gWorld` (per arm, on EVERY walked match and the receipt: `raArmedVersion === 12`, **BOTH** trace
flags TRUE, `edsTouchCost` PINNED and equal on every match of both arms, every RC/BF flag ABSENT,
`info.genome` clean) · `gDoseSource` (the shipped loaders CALLED; the FILE BYTES hashed and
compared to the PINNED values; exit 3 on mismatch) · `gTraceInert` (both traces ON vs OFF,
byte-identical whole-match signatures, on shared out-of-band scratch seeds, per arm) ·
**`gSiteEnumeration`** (the `this.pendingControl = null` needle count in `Match.ts` equals the
pinned list, every site carries its line **and** its purpose, and the creation site is pinned at 1)
· **`gAttributionExhaustive`** (every ended attempt lands in **exactly one** class: per arm and per
group the class counts SUM to the endings, the OBSERVED and INFERRED counts sum to the same total,
the displacement cells sum to the NOT-REACHED parent, and the side × kind table sums to the
ABANDONED-BY-CONTACT parent) · `gLedgerNonVacuous` (attempts exist on both arms; **every non-empty
class is NAMED and every empty one too**; the `other` receipt is published with its totals) ·
`gAnchoredConstants` (anchored extraction with line receipts over the delay, the retention margin,
every `CONTACT_RELEASE_*`, the tangential retention, the commit time, `CONTROL_RADIUS`,
`pressureAt`'s whole body, the resolver's gate and both pre-roll return lines, the roll's own early
return, the cushion statement, the replacement statement, the offside record, and both parsed
vocabularies) · `gWalkFixtures` (the class precedence on constructed endings — including the three
precedence guards — the displacement comparison, the parsed vocabularies, the site counts, and the
reconciliation arithmetic on constructed counts) · `gClassesNonVacuous` (all four classes the reads
can select are reachable on both arms) · `gLockstep` · `gSrcUntouched` · `gSeedsBookedEqualWalked`
· `gN` · `gHashOrder` · `gReadWords` · `gFaces`.

Canon quoted where it applies — VERBATIM: *"the hashed body is built from an explicit ALLOWLIST
SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"* (home:
`PC-T0-LATENCY-SEAM.md` §COMMANDER CORRECTIONS item 1); VERBATIM: *"the body hash is computed after
every body key is assigned, and a NON-body receipt field records that the hash reproduces from the
written file"* (home: `RC-T1A-PRECUE-EXAM.md` §COMMANDER CORRECTIONS item 3, ruling #372 item 3);
VERBATIM: *"an artifact is written as compact JSON — no indentation; the hash is over the canonical
body regardless; pretty-printing is a reader's tool, not a storage form"* (home: ruling #372 item
5); VERBATIM: *"a src-extracted constant pins its extraction to the NAMED call site — anchored
match + line receipt — never first-occurrence"* (home: `BK-C0-BODYBALL-CENSUS.md` §COMMANDER
CORRECTIONS item 1); VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle and enumerates
EVERY occurrence's site"* (home: `PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 1) — the
`= null`, `traceContact(`, `callOffside(` and creation needles are enumerated for exactly that
reason; VERBATIM: *"a field carries the unit its name claims"* (home: ruling #294 item 3); VERBATIM:
*"a scored face's walk-side predicate is pinned — anchored extraction or fixture — because the
re-derivation gate proves arithmetic, not definitions"* (home: `DF-T3-SURFACE-EXAM.md` §COMMANDER
CORRECTIONS item 2); VERBATIM: *"a gate's NOTE derives from the same pinned values the gate checks;
a count typed beside its pin is a second copy"* (home: `PT-C0-PLAYTEST-FORENSIC-CENSUS.md`
§COMMANDER CORRECTIONS item 1) — every gate NOTE here interpolates the same values its `ok` reads;
VERBATIM: *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated
face"* (home: `PC-T2-ARMED-WORLD-READ.md` §COMMANDER CORRECTIONS item 4); VERBATIM: *"a stage doc's
numeric sweep covers EVERY numeric literal in prose at ANY precision; a hand-written percentage is
the likeliest second copy"* (home: `BF-C0-MOVEMENT-FACING-CENSUS.md` §COMMANDER CORRECTIONS item
6); VERBATIM: *"a starred finding states its \|Δ\|÷half-width ratio"* (home:
`BU-T0B-PRICE-SEPARATION.md` §COMMANDER CORRECTIONS item 2); VERBATIM: *"a stage doc's HONEST
LIMITS list is the ONE home; the artifact stores that list verbatim or stores none"* (home:
`RC-C0-COOPERATION-CENSUS.md` §COMMANDER CORRECTIONS item 3) — **this artifact stores NONE**;
§HONEST LIMITS below is the list of record; VERBATIM: *"the re-derivation gate covers EVERY
published face; a percentile face requires stored bins"* (home: `PC-C0-REACTION-BASELINE.md`
§COMMANDER CORRECTIONS item 4). Ledger, dose, geometry and timing receipts are **never** quoted as
football effect sizes (ruling #289 item 1 + `BU-T1-MT-COMPOSITION.md` §COMMANDER CORRECTIONS item
5). Every rate is on the **240 s match clock** (1 sim-s = 22.5 display-s).

## §DEV-PREFLIGHT — the sizing smoke, disclosed in full

A **12-cluster scratch smoke** (`BQC1_MODE=smoke BQC1_N=12`, seeds **900,003,000–011**, receipt
900,003,020, the curve pin at 900,003,070, gTraceInert on 900,003,080–081, gLockstep on
900,003,090–091, artifact off the canonical path at `/tmp/bq-c1-smoke2.json`) was run **BEFORE this
freeze**. Its realised half-widths were read out of the smoke artifact's own `faces[].halfWidth`
fields on the E arm — **never re-typed from the console's rounded print** — and are hardcoded in
the instrument's `SIZED_FACES` (the six rows in §P.E's table).

**Disclosed honestly:**

* The first 12-cluster run went **RED on two gates**, both instrument defects fixed before this
  freeze and stated here so the record shows what moved and when.
  (a) `gAnchoredConstants` and `gWalkFixtures` — the probe asserted the parsed `ActionType`
  vocabulary held **25** names; the union in `src/sim/types.ts` holds **23** (the executor
  miscounted a list that carries two doc comments). The vocabulary is **parsed off `src/`**, so the
  wrong assertion was a RED gate rather than a silent pass — the anchored-extraction and
  parse-don't-retype canons working exactly as intended. Corrected to 23.
  (b) A **face description was false**, and the smoke is what caught it: `physics.holdLiveShare`
  was written as a receipt reading "the seat is `null` in every production path, so this reads 0 by
  construction". **`match.pcLatency` is NOT null on world 12** — the seat receipt read 1 on both
  arms and holds were live at 0.121726 of intended-target contacts. The face is now described as
  what it is, a real cell, and the seat's own existence is published as its own receipt. ⛔ No
  number of record was moved by either fix; the battery's §R replaces every smoke figure.
* ⭐ **THE CURVE, PINNED AT THE SMOKE**: `m.edsTouchCost` read **false** on a constructed match of
  **both** arms ⇒ **the census measures the BASE curve**, the expected value of #383 item 6(i), and
  no deviation is triggered. (This census reads no curve term; the pin exists so the world is the
  same world BQ-C0 measured.)
* ⭐ **THE SITE COUNT, FOUND AT THE SMOKE**: the needle occurs **10** times, at lines 3661, 3685,
  3828, 4801, 5582, 5620, 5636, 5681, 5798 and 5865, and the creation needle **1** time at line
  5625. The dispatch brief said eleven `= null` occurrences; the gate pins what the file holds.
  Declared at §DEVIATIONS item 1.
* ⚠ **12 clusters is a NOISY variance estimate** — a strictly weaker assumption than sizing off a
  published battery. Said here, before the battery.
* ⚠ The smoke's own POINT readings are **UNPOWERED and bind nothing**. For the record, so nobody
  can claim the freeze was written after seeing a battery: on 12 scratch seeds the E arm read about
  134 pending controls created per match, a non-possession share near 0.18 on intended targets, a
  composition near 0.39 roll-fail / 0.47 not-reached-margin / 0.08 opponent contact on **119**
  non-possession endings, and the printed sentence was the **MIXED** one on both arms. **None of
  these numbers is a finding**; the battery's own §R replaces every one of them, and a battery that
  printed a different sentence would be reported as-is. ⚠ Note especially that at n = 119 the two
  leading class shares sit inside each other's intervals — which is exactly why the battery is
  sized on those faces.
* The smoke ALSO confirmed instrument liveness: on both arms the classes `resolvedClean`,
  `resolvedRollFail`, `resolvedNotReachedMargin`, `abandonedContactOpponent` and
  `abandonedBodyStrike` all carried counts (E additionally `abandonedContactTeammate` and
  `abandonedDeadBallOut`, D additionally `abandonedContactTeammate`); `abandonedOther` totalled
  **0** on both; the margin cross-check agreed on 1.000000; the creation-ledger receipt read
  0.986478; `gTraceInert` and `gLockstep` were green on all their arm × scratch-seed walks; and
  `receipts.hashReproducesFromFile` read true off the written file. The smoke's own
  `perf.meanWallSecondsPerMatch` was **0.09096153846153845** s ⇒ the full battery (998 seeds × 2
  arms plus the receipt) is expected to take roughly **3.0 minutes** of walking plus the bootstrap
  and the fixture suite.
* **This section binds nothing.** The freeze is §0–§P.F above.
