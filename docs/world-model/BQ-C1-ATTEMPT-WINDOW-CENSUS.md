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

## §R RESULTS (every number below QUOTES the artifact's own fields at 6 dp — the artifact
## is the numbers of record, per the #357 standing order)

**RUN RECEIPTS.** Freeze **`b4b3e47`** (`stage.headAtRun` =
`b4b3e47a4eaf54b555c6e054ffef3dfb692beb79`).
`git diff b4b3e47..<results> -- scripts/probes/bq-c1-*.ts` is **EMPTY (0 bytes)** — no frozen
constant, no frozen definition, no frozen rule and no frozen sentence moved after sight.
**16/16 gates green**; `gFaces` **918/918 face-and-Δ** checks and **69/69** stored-bin / median /
partition / READ-WORD / sizing checks re-derived from the SERIALIZED artifact off disk (the two
counts are the lengths of the artifact's own `gFacesDetail.faceChecks` and
`gFacesDetail.binChecks` arrays, every entry `ok`).
Artifact `docs/world-model/data/bq-c1-attempt-window-census.json` — **compact JSON**,
**4,446,313 bytes**; `instrumentSha256 =
83d7e8d414554e7046f9e6391e243c908c641d0c469c857fbe914efa158bf8ec`; `hashedBodySha256 =
affb6157bcdbbe0e05a6f1a48d43e290213826ba23677d18552f113c2164c141`; the NON-body receipt
`receipts.hashReproducesFromFile` = **true**; **file byte-hash
`69f335365b7daf05fd89a85b1903bbd34b5283ec2e1b614257de876318c0cc95`**. Battery **998 seeds
(12,542,000–12,542,997) × 2 ARMS + the construction receipt at 12,542,999 ⇒ BOOKED = WALKED =
1,998 walks**; the **unwalked tail is DECLARED** (`seeds.unwalkedTail` = seed 12,542,998).
`gTraceInert` on scratch 900,003,080–081, `gLockstep` on 900,003,090–091, the curve pin on
900,003,070, the sizing smoke on 900,003,000–011 — every one STORED in the artifact's `seeds`
block. **ZERO stats consumed** — registry **73**.
**33** anchored sites, **28** walk fixtures, **612** faces and **306** paired Δs (the lengths of
the artifact's own `anchoredSites` / `fixtures` / `faces` / `deltas` arrays).
`npm run typecheck` clean with the probe in the tree; `npm run fingerprint` =
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **the literal of record in
`tests/a4HomeGrant.test.ts`, UNCHANGED** (a census cannot move it). Wall **194.107 s**
(`perf.batteryWallSeconds`; `perf.meanWallSecondsPerMatch` **0.092746**).

**⭐⭐ THE SITES OF RECORD.** `gSiteEnumeration` found the needle `this.pendingControl = null`
**10** times in `src/sim/Match.ts`, at lines **3661 · 3685 · 3828 · 4801 · 5582 · 5620 · 5636 ·
5681 · 5798 · 5865**, and the creation needle `this.pendingControl = {` **1** time, at line
**5625**. Each is listed with its purpose in §P.B and in the artifact's `sites.enumerated` block.

### §R1 THE POPULATION AND THE ENDINGS (both arms; the exact-sum receipts)

| face | E (empty book) | D (dosed — the user's world) | Δ (D − E), 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|
| `population.all.attemptsPerMatch` | **136.634269** [134.932866, 138.479960] | **155.102204** [151.092184, 160.646293] | +18.467936 [+14.457916, +24.042084] | 3.853842 |
| `population.intended.attemptsPerMatch` | **50.460922** [49.751503, 51.158317] | **57.372745** [56.663327, 58.135271] | +6.911824 [+6.140281, +7.700401] | 8.860629 |
| ⭐⭐ `population.intended.nonPossessionShare` | **0.177542** [0.173496, 0.181724] (8,941 of 50,360) | **0.182857** [0.178657, 0.187258] (10,470 of 57,258) | +0.005315 [−0.000272, +0.010935] · **CONTAINS ZERO** | 0.948482 |
| `population.all.nonPossessionShare` | **0.210221** [0.203646, 0.217735] (28,666 of 136,361) | **0.261829** [0.243373, 0.287112] (40,529 of 154,792) | +0.051607 [+0.031351, +0.077642] | 2.229659 |
| ⭐⭐ `population.intended.observedShare` | **0.911319** [0.909022, 0.913550] | **0.923452** [0.921334, 0.925486] | +0.012133 [+0.008816, +0.015139] | 3.837918 |
| ⭐⭐ `population.intended.inferredShare` | **0.088681** [0.086455, 0.090981] | **0.076548** [0.074515, 0.078667] | −0.012133 [−0.015122, −0.008814] | 3.846779 |
| `population.ledgerControlAttemptContactsPerMatch` | **138.927856** [137.221443, 140.785571] | **157.403808** [153.402806, 162.996994] | +18.475952 [+14.416834, +24.072144] | 3.827107 |
| `population.creationLedgerAgreementShare` | **0.983491** [0.982635, 0.984368] (136,361 of 138,650) | **0.985378** [0.984514, 0.986262] (154,792 of 157,089) | +0.001887 [+0.000954, +0.002863] | 1.976858 |

⭐⭐ **THE WINDOW OPENS OVER A HUNDRED TIMES A MATCH, AND NINE ATTEMPTS IN TEN GET THERE.** On the
empty book **136.634269** pending controls are created per 240 s match, **50.460922** of them for the man
the pass was meant for, and **0.177542** of those intended attempts end with **nobody on his side
holding the ball** (8,941 of 50,360). In the dosed world the same share is **0.182857**, and the
paired difference **CONTAINS ZERO** — the two worlds bounce at the same rate on this denominator.
Across **all** bodies the share is higher (**0.210221** E / **0.261829** D), because a body the
pass was not meant for is a worse receiver — BN-C0's own finding, re-met here.

⭐⭐ **THE ATTRIBUTION IS NINE-TENTHS OBSERVED.** **0.911319** of intended-target endings on arm E
land in a class with a **unique public signature** — the engine's first-touch ledger, the ball's
own owner, the engine's own `pendingControl` field, the contest ledger's kind or the engine's own
`restart.offside`. The remaining **0.088681** is INFERRED and is published as **BOUNDS** below.
(D: **0.923452** observed / **0.076548** inferred.)

**THE CREATION RECEIPT.** The census observed **136,361** creations against the contest ledger's
**138,650** `controlAttempt` contacts on arm E — an agreement of **0.983491**. The **2,289**
difference (138,650 − 136,361, an exact subtraction of two stored counts) is contacts the ledger
recorded that never became a tick-boundary-visible attempt: the offside branch aborting before the
creation, and any attempt created and ended inside one tick. ⛔ A plumbing receipt, never a
football effect size. (D: **154,792** against **157,089**, agreement **0.985378**, difference
**2,297**.)

### §R2 ⭐⭐ THE COMPOSITION OF NON-POSSESSION ENDINGS AND THE MAJORITY CLASS

**Denominators: 8,941 (E) and 10,470 (D) NON-POSSESSION endings on INTENDED TARGETS.** Every class
whose count is non-zero on either arm:

| class | E | D | Δ (D − E) | \|Δ\|÷hw |
|---|---|---|---|---|
| ⭐⭐ `resolvedNotReachedMargin` | **0.491891** [0.478089, 0.505459] (4,398) | **0.414040** [0.401203, 0.427139] (4,335) | −0.077851 [−0.095637, −0.059441] | **4.301658** |
| ⭐⭐ `resolvedRollFail` | **0.326138** [0.314975, 0.337499] (2,916) | **0.355874** [0.345423, 0.365849] (3,726) | +0.029736 [+0.014167, +0.044320] | 1.972379 |
| ⭐ `abandonedContactOpponent` | **0.112627** [0.100870, 0.126416] (1,007) | **0.157880** [0.144155, 0.173930] (1,653) | +0.045252 [+0.025269, +0.065556] | **2.246520** |
| `abandonedBodyStrike` | **0.048764** [0.038674, 0.060589] (436) | **0.057689** [0.049240, 0.067335] (604) | +0.008925 [−0.005227, +0.023149] · **CONTAINS ZERO** | 0.629002 |
| `abandonedContactTeammate` | **0.012974** [0.009740, 0.017190] (116) | **0.009933** [0.007159, 0.012997] (104) | −0.003041 [−0.008276, +0.001500] · **CONTAINS ZERO** | 0.622081 |
| `abandonedDeadBallOut` | **0.007605** [0.005891, 0.009630] (68) | **0.004585** [0.003344, 0.005920] (48) | −0.003021 [−0.005242, −0.000846] | 1.374416 |

**THE SEVEN CLASSES THAT ARE EMPTY ON BOTH ARMS**, read off the stored counts:
`resolvedNotReachedStunnedOrOff` (0), `resolvedOffside` (0), `abandonedContactSameReceiver` (0),
`abandonedDeflection` (0), `abandonedOffside` (0), `abandonedPossessionElsewhere` (0) and
`abandonedOther` (0) — on intended targets, both arms. The `other` RECEIPT class totals **0** on
all bodies on both arms as well (`gLedgerNonVacuous`'s own note): **nothing had to be imputed.**

**THE PARENTS, AND THE SUB-CLASSES THE READS SELECT ON:**

| face (share of the NON-POSSESSION endings) | E | D | Δ (D − E) | \|Δ\|÷hw |
|---|---|---|---|---|
| ⭐⭐ `composition.intended.parent.resolvedNotReached` | **0.491891** [0.478089, 0.505459] | **0.414040** [0.401203, 0.427139] | −0.077851 [−0.095637, −0.059441] | **4.301658** |
| ⭐⭐ `composition.intended.parent.abandonedByContact` | **0.125601** [0.113276, 0.140968] (1,123) | **0.167813** [0.153765, 0.183907] (1,757) | +0.042212 [+0.020685, +0.063027] | 1.993840 |
| `composition.intended.parent.line` | **0.007605** [0.005891, 0.009630] | **0.004585** [0.003344, 0.005920] | −0.003021 [−0.005242, −0.000846] | 1.374416 |
| ⭐⭐ `notReached.intended.ballLargerOfNonPossession` | **0.307796** [0.296586, 0.318679] (2,752) | **0.260649** [0.250819, 0.271115] (2,729) | −0.047146 [−0.062063, −0.032334] | **3.171656** |
| ⭐⭐ `notReached.intended.bodyLargerOfNonPossession` | **0.184096** [0.175422, 0.193187] (1,646) | **0.153391** [0.146131, 0.161185] (1,606) | −0.030705 [−0.042064, −0.018830] | 2.643108 |
| `notReached.intended.tieOfNonPossession` | **0.000000** (0) | **0.000000** (0) | 0.000000 | unresolved at this power |

⭐⭐ **THE STORED MAJORITY BOOLEANS.** `reads.E.majority` reads **false** for every class, every
parent and every sub-class; `reads.E.noMajority` is **true** and `reads.E.majorityClass` is
**`mixed`**. The same holds on D (`reads.D.majorityClass` = **`mixed`**), so
`reads.dosedAgreesOnMajorityClass` is **true**. ⚠ Read that against §R2's first row: the largest
single class on arm E, `resolvedNotReachedMargin` at **0.491891**, sits **below** the frozen 0.5
bar — and its interval's upper end, **0.505459**, sits above it. The MIX read is what the frozen
rule prints on this table; it is not a claim that the table is flat.

### §R3 THE NOT-REACHED GEOMETRY (ball vs body displacement)

**Within the RESOLVED-NOT-REACHED class itself** (denominators 4,398 E / 4,335 D):

| face | E | D | Δ (D − E) | \|Δ\|÷hw |
|---|---|---|---|---|
| ⭐⭐ `notReached.intended.ballLargerOfNotReached` | **0.625739** [0.610805, 0.639300] (2,752) | **0.629527** [0.615189, 0.644292] (2,729) | +0.003788 [−0.017346, +0.024123] · **CONTAINS ZERO** | 0.182699 |
| `notReached.intended.bodyLargerOfNotReached` | **0.374261** [0.360741, 0.389298] (1,646) | **0.370473** [0.355754, 0.384832] (1,606) | −0.003788 [−0.024034, +0.017382] · **CONTAINS ZERO** | 0.182928 |
| `notReached.intended.tieOfNotReached` | **0.000000** (0) | **0.000000** (0) | 0.000000 | unresolved at this power |

⭐⭐ **WHEN THE THIRD TICK COMES AND HE IS NOT THERE, IT IS USUALLY THE BALL THAT LEFT.** Five in
eight — **0.625739** on E, **0.629527** on D, and the paired difference CONTAINS ZERO — of
not-reached endings had the **ball** travel further than the receiver across the window. The
stored bin-derived medians are **0.100000** m for the ball's displacement and **0.100000** m for
the body's (`medians.values.E.notReachedBallDisplacementMetres` and
`…BodyDisplacementMetres`; identical on D) — both distributions sit in the same 0.1 m bin, so the
*comparison* is the signal and the *magnitudes* are small. ⚠ Neither cell holds a majority of the
NON-POSSESSION total (§R2: **0.307796** and **0.184096** on E), so neither read fires.

**THE STUNNED / MARGIN SPLIT — the BOUND, and what it turned out to be.**
`resolvedNotReachedStunnedOrOff` reads **0** on both arms, so on this battery the NOT-REACHED
class is the retention margin **entirely**, and the bound is not merely tight but empty on one
side. ⛔ It is still declared a BOUND at §P.B and stays one: the resolver's pre-roll returns are
not observable, only their sum is exact, and a battery where the stunned cell were non-zero would
carry the ambiguity §P.B describes.

**THE GEOMETRY CROSS-CHECK.** `notReached.marginCrossCheckAgreementShare` = **0.985208**
[0.982854, 0.987547] on E (10,057 of 10,208) and **0.986654** [0.984243, 0.988906] on D: the
SHIPPED `directBallAccess`, RE-CALLED at the end tick with the resolver's own arguments, puts the
body outside `sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN` on that share of the endings
the census booked to the margin. ⚠ A DECLARED RECONSTRUCTION one physics step after the resolver
read it — a receipt, ⛔ never a class definition and ⛔ never a football effect size.

### §R4 THE ABANDONED-BY-CONTACT SPLIT (side × the ledger's kind)

**Denominators: 1,123 (E) and 1,757 (D) ABANDONED-BY-CONTACT endings on intended targets.**

| face | E | D | Δ (D − E) | \|Δ\|÷hw |
|---|---|---|---|---|
| ⭐⭐ `abandonedSplit.opponent.total` | **0.896705** [0.865591, 0.921162] (1,007) | **0.940808** [0.922367, 0.957622] (1,653) | +0.044103 [+0.013319, +0.079864] | 1.325498 |
| `abandonedSplit.teammate.total` | **0.103295** [0.078901, 0.134513] (116) | **0.059192** [0.042386, 0.077699] (104) | −0.044103 [−0.079791, −0.013295] | 1.326486 |
| `abandonedSplit.sameReceiver.total` | **0.000000** (0) | **0.000000** (0) | 0.000000 | unresolved at this power |

**THE LEDGER'S KIND, ON EVERY ONE.** `abandonedSplit.opponent.controlAttempt` reads **0.896705**
(E) / **0.940808** (D) and `abandonedSplit.teammate.controlAttempt` reads **0.103295** /
**0.059192** — identical to the side totals above, so **every** replacement the census attributed
carried the ledger kind `controlAttempt`, and the `silent` cell (the ledger recorded nothing by
that body at that tick) reads **0.000000** on both arms. ⚠ The ledger's other four kinds
(`poke`, `deflection`, `header`, `body`) read **0.000000** in this table by construction: a
replacement IS `applyControlContact`, and `applyControlContact` writes `controlAttempt` — the
other kinds end an attempt through their own `= null` sites (`abandonedBodyStrike`,
`abandonedDeflection`) rather than by replacing it.

⭐ **WHEN SOMEBODY TAKES THE BALL INSIDE THE WINDOW, IT IS ALMOST ALWAYS A DEFENDER.** Nine in ten
on the empty book (**0.896705**), and higher still in the world the user plays (**0.940808**). ⚠
But the parent class is only **0.125601** (E) / **0.167813** (D) of the non-possession endings
(§R2), so the DUEL read does not fire: 「被断」 is real, well-formed, and a minority.

### §R5 THE WINDOW'S PHYSICS (the cushion, the pressure, the action)

| face (INTENDED TARGETS; denominators 50,360 E / 57,258 D) | E | D | Δ (D − E) | \|Δ\|÷hw |
|---|---|---|---|---|
| ⭐ `physics.meanReleaseSpeed` (m/s) | **1.286643** [1.279889, 1.293344] | **1.225690** [1.220298, 1.231079] | −0.060953 [−0.069190, −0.052892] | **7.479542** |
| ⭐ `physics.meanReleaseNormalComponent` (m/s) | **0.954563** [0.951491, 0.957705] | **0.979206** [0.975843, 0.982420] | +0.024644 [+0.020295, +0.028756] | **5.825576** |
| `physics.lawPredictedRangeShare` | **1.000000** (50,360 of 50,360) | **1.000000** (57,258 of 57,258) | 0.000000 | unresolved at this power |
| `physics.meanBodySpeedAtContact` (m/s) | **3.405157** [3.381527, 3.427090] | **2.916265** [2.896720, 2.935558] | −0.488893 [−0.516163, −0.463110] | **18.430347** |
| `physics.meanOpponentDistanceAtContact` (m) | **4.640569** [4.598022, 4.689841] | **4.163370** [4.121944, 4.206000] | −0.477199 [−0.526465, −0.432523] | **10.159426** |
| `physics.meanOpponentDistanceAtEnd` (m) | **4.532461** [4.490421, 4.580900] | **4.056223** [4.015952, 4.097700] | −0.476238 [−0.524648, −0.432691] | **10.357879** |
| `physics.meanPressureAtContact` | **0.379128** [0.374996, 0.382957] | **0.428730** [0.424475, 0.432980] | +0.049602 [+0.045331, +0.054293] | **11.069857** |
| `physics.meanPressureAtEnd` | **0.389629** [0.385508, 0.393411] | **0.439072** [0.434868, 0.443266] | +0.049444 [+0.045200, +0.054089] | **11.124476** |
| ⭐ `physics.holdLiveShare` | **0.133122** [0.128816, 0.137673] (6,704) | **0.054612** [0.051036, 0.058575] (3,127) | −0.078509 [−0.083982, −0.072824] | **14.071758** |
| `physics.pcSeatLiveShare` | **1.000000** (136,361 of 136,361) | **1.000000** (154,792 of 154,792) | 0.000000 | unresolved at this power |

**⭐ THE CUSHION AGAINST THE LAW'S OWN PREDICTION.** The contact law releases along the body→ball
normal at a speed clamped into [`CONTACT_RELEASE_MIN_SPEED` **0.25**, `CONTACT_RELEASE_MAX_SPEED`
**1.2**] with `CONTACT_RELEASE_INCOMING_SHARE` **0.12** and `CONTACT_TANGENTIAL_RETENTION`
**0.35** (all anchored at their own definition sites). Measured one physics step later, the mean
normal component is **0.954563** m/s on E and **0.979206** on D — inside that clamp — and
`physics.lawPredictedRangeShare` reads **1.000000** on both arms (50,360 of 50,360 · 57,258 of
57,258): **the stored face says every measured normal component this battery saw lay inside the
law's own clamp.** The *total* relative release speed is larger (**1.286643** E / **1.225690** D)
because the retained tangential component and the body's own velocity ride on top of the normal
release.

**⭐ THE PRESSURE BARELY MOVES ACROSS THE WINDOW.** `pressureAt` at the contact tick is
**0.379128** (E) and at the end tick **0.389629** — a rise of **0.010501** (an exact subtraction of
two stored means). In the dosed world: **0.428730** → **0.439072**, a rise of **0.010342**. The
nearest opponent closes by **0.108108** m on E (4.640569 → 4.532461) and by **0.107147** m on D.
⇒ **three ticks is not long enough for a defender to arrive**; whoever is going to contest the ball
is already there when the foot meets it.

**P(no possession | cell), arm E, the cells that separate** (every bin's own counts are stored;
the tables below quote the artifact's `physics.noPossession.*` faces):

| `pressureContact` bin | E | D |
|---|---|---|
| [0.0, 0.1) | 0.133363 (2,119 of 15,889) | 0.121636 (1,889 of 15,530) |
| [0.5, 0.6) | 0.172076 (737 of 4,283) | 0.174908 (856 of 4,894) |
| [0.7, 0.8) | 0.226518 (1,160 of 5,121) | 0.216446 (1,453 of 6,713) |
| [0.8, 0.9) | **0.289205** (1,870 of 6,466) | **0.309706** (3,194 of 10,313) |

| `relativeSpeed` bin (m/s) | E | D |
|---|---|---|
| [0, 2) | 0.080906 (511 of 6,316) | 0.112974 (829 of 7,338) |
| [4, 6) | 0.089853 (379 of 4,218) | 0.101742 (444 of 4,364) |
| [6, 8) | 0.199117 (1,083 of 5,439) | 0.204648 (1,224 of 5,981) |
| [10, 12) | 0.230761 (2,144 of 9,291) | 0.210430 (2,760 of 13,116) |
| [18, 20) | 0.333333 (48 of 144) | 0.259669 (47 of 181) |

| `releaseSpeed` bin (m/s) | E | D |
|---|---|---|
| [0.25, 0.50) | 0.075837 (419 of 5,525) | 0.102731 (647 of 6,298) |
| [1.00, 1.25) | 0.195707 (3,255 of 16,632) | 0.197857 (4,321 of 21,839) |
| [2.00, 2.25) | 0.235249 (307 of 1,305) | 0.245719 (330 of 1,343) |
| [3.00, 3.25) | 0.317029 (175 of 552) | 0.298153 (113 of 379) |
| [4.75, 5.00) | 0.392523 (42 of 107) | 0.333333 (8 of 24) |

| `bodySpeed` bin (m/s) | E | D |
|---|---|---|
| [0, 1) | 0.243539 (1,470 of 6,036) | 0.223990 (2,013 of 8,987) |
| [3, 4) | 0.159424 (1,174 of 7,364) | 0.178855 (1,575 of 8,806) |
| [7, 8) | 0.100191 (368 of 3,673) | 0.064344 (181 of 2,813) |
| [8, 9) | 0.079498 (38 of 478) | 0.062500 (22 of 352) |

| `oppDistContact` bin (m) | E | D |
|---|---|---|
| [1, 2) | **0.257681** (3,405 of 13,214) | **0.265014** (5,035 of 18,999) |
| [3, 4) | 0.145245 (921 of 6,341) | 0.145152 (994 of 6,848) |
| [8, 9) | 0.118119 (206 of 1,744) | 0.117529 (234 of 1,991) |
| [15, 16) | 0.112613 (75 of 666) | 0.133038 (60 of 451) |

**⭐ THE WINDOW'S OWN LENGTH.** `windowTicks` (bin width 1 tick; ⚠ the **top bin is the CLAMP bin**
— "9 ticks or more"):

| `windowTicks` bin | E | D |
|---|---|---|
| [1, 2) | **1.000000** (1,149 of 1,149) | **1.000000** (1,671 of 1,671) |
| [2, 3) | **1.000000** (478 of 478) | **1.000000** (738 of 738) |
| [3, 4) | 0.149682 (7,291 of 48,710) | 0.146516 (8,032 of 54,820) |
| [9, ∞) — the clamp bin | **1.000000** (23 of 23) | **1.000000** (29 of 29) |

The bin-derived median window is **3** ticks on both arms (`medians.values.<arm>.physics[8]`) —
`CONTACT_CONTROL_DELAY_TICKS` exactly. An attempt that ends at tick 1 or 2 of its window ended
before it could be resolved and therefore reads **1.000000** by construction (there is no
possession to be had before `readyTick`); 1,149 + 478 = **1,627** such endings on E, which is
exactly the four ABANDONED classes' counts summed (1,007 + 436 + 116 + 68 = 1,627 — an exact
addition of stored counts). The clamp bin's **23** endings on E are attempts whose resolution came
**nine or more ticks** after the contact, and all 23 read non-possession.

**THE RECEIVER'S ACTION**, at the contact tick and at the end tick (shares of intended-target
attempts; the six names with any count):

| `action.type` | E at contact | E at end | D at contact | D at end |
|---|---|---|---|---|
| `ReceivePass` | **0.910008** | 0.152740 | **0.983915** | 0.178979 |
| `Dribble` | 0.000000 | **0.822458** | 0.000017 | **0.817143** |
| `SupportBallCarrier` | 0.040469 | 0.011577 | 0.005222 | 0.001502 |
| `MakeRun` | 0.015568 | 0.005302 | 0.004558 | 0.001188 |
| `ChaseBall` | 0.011060 | 0.002224 | 0.005397 | 0.000821 |
| `MarkOpponent` | 0.009948 | 0.002145 | 0.000140 | 0.000052 |
| `InterceptPass` | 0.005242 | 0.001747 | 0.000175 | 0.000122 |
| `MoveToFormationSpot` | 0.007387 | 0.001708 | 0.000489 | 0.000157 |
| `GoalkeeperPosition` | 0.000318 | 0.000099 | 0.000087 | 0.000035 |

⚠ **THE PASS CLASS CARRIES NO INFORMATION HERE.** `physics.noPossession.passClass.toFeet` equals
`population.intended.nonPossessionShare` (**0.177542** E / **0.182857** D) and
`physics.noPossession.passClass.carried` is computed on **0 of 0** — an intended target is by
definition a body with a live `pendingPass`, so the `carried` cell cannot be populated on this cut.
Declared at §HONEST LIMITS 6.

### §R6 THE RECONCILIATION (three denominators, once)

| denominator (per 240 s match) | whose | E | D |
|---|---|---|---|
| `reconciliation.pendingCreatedPerMatch` | **BQ-C1's own** | **136.634269** [134.932866, 138.479960] (136,361) | **155.102204** [151.092184, 160.646293] (154,792) |
| `reconciliation.resolutionsPerMatch` | **BQ-C0's own** | **122.716433** [121.521042, 123.903808] (122,471) | **130.947896** [129.680361, 132.328657] (130,686) |
| `reconciliation.ownTargetControlContactsPerMatch` | **BN-C0's own** | **50.460922** [49.751503, 51.158317] (50,360) | **57.372745** [56.663327, 58.135271] (57,258) |

| face | E | D | Δ (D − E) | \|Δ\|÷hw |
|---|---|---|---|---|
| ⭐⭐ `reconciliation.rollFailShareOfNonPossession` (all bodies) | **0.159353** [0.151589, 0.166679] (4,568 of 28,666) | **0.142688** [0.125796, 0.157427] (5,783 of 40,529) | −0.016665 [−0.034919, −0.000045] | 0.955686 |
| `reconciliation.rollFailShareOfNonPossessionIntended` | **0.326138** [0.314975, 0.337499] (2,916 of 8,941) | **0.355874** [0.345423, 0.365849] (3,726 of 10,470) | +0.029736 [+0.014167, +0.044320] | 1.972379 |
| `reconciliation.bnc0OwnTargetNoPossessionShare` | **0.177542** [0.173496, 0.181724] (8,941 of 50,360) | **0.182857** [0.178657, 0.187258] (10,470 of 57,258) | +0.005315 [−0.000272, +0.010935] · **CONTAINS ZERO** | 0.948482 |

⭐⭐ **#383 item 4(iii)'s 0.163509 IS RE-DERIVED AT 0.159353.** On all bodies, the roll's failures
are **4,568** of the **28,666** endings that produce no possession on the empty book —
**0.159353**. The commander's own arithmetic put the same quantity at **at most 0.163509** from
BQ-C0's stored counts on a different block, with a bounded denominator; this census measures it
directly, on its own block, with an exact denominator. ⭐ **The coin is a sixth of the mass, as
#383 item 4(iii) said.** On intended targets alone it is a **third** (**0.326138**) — the intended
receiver is the body the roll is most often invoked for.

⚠ **BN-C0's PREDICATE, RE-USED, PRINTS 0.177542 AGAINST ITS OWN 0.227241 — AND THE DENOMINATORS
DIFFER.** BN-C0's 0.227241 was the no-possession share over *own-target FIRST contacts of a
measured pass* (its `controlAttemptPossessionAtReadyTick` denominator); this census's denominator
is **every** own-target contact recorded `controlAttempt` in the contest ledger, which includes
repeat contacts inside a single episode. ⛔ The two numbers are the same predicate on **different
populations** and are not to be read as a discrepancy. That is exactly why #383 item 6(v) asked
for the three denominators to be printed together once.

### §R7 THE DOSED ARM BESIDE (paired Δ, D − E)

⚠ **THIS IS A SELECTION, NOT THE COMPLETE ORDERED LIST** — the artifact's `deltas` array holds all
**306**, of which **102** resolve (an interval excluding zero). The rows below are the ones
§R2–§R6 already quote, ordered by \|Δ\|÷half-width. ⛔ They are NOT the top of the resolved list:
the largest resolved ratio in the whole array is `physics.actionAtContact.ReceivePass` at
**23.605346** (Δ +0.073907), and the smallest is `reconciliation.rollFailShareOfNonPossession` at
**0.955686**. Read the full array for the ordering.

| face | Δ (D − E) | \|Δ\|÷hw |
|---|---|---|
| `physics.meanBodySpeedAtContact` | −0.488893 | **18.430347** |
| `physics.holdLiveShare` | −0.078509 | **14.071758** |
| `physics.meanPressureAtEnd` | +0.049444 | **11.124476** |
| `physics.meanPressureAtContact` | +0.049602 | **11.069857** |
| `physics.meanOpponentDistanceAtEnd` | −0.476238 | **10.357879** |
| `physics.meanOpponentDistanceAtContact` | −0.477199 | **10.159426** |
| `population.intended.attemptsPerMatch` | +6.911824 | 8.860629 |
| `physics.meanReleaseSpeed` | −0.060953 | 7.479542 |
| `physics.meanReleaseNormalComponent` | +0.024644 | 5.825576 |
| ⭐⭐ `composition.intended.parent.resolvedNotReached` | −0.077851 | 4.301658 |
| `population.intended.observedShare` | +0.012133 | 3.837918 |
| ⭐⭐ `notReached.intended.ballLargerOfNonPossession` | −0.047146 | 3.171656 |
| `notReached.intended.bodyLargerOfNonPossession` | −0.030705 | 2.643108 |
| ⭐ `composition.intended.abandonedContactOpponent` | +0.045252 | 2.246520 |
| `composition.intended.parent.abandonedByContact` | +0.042212 | 1.993840 |
| `composition.intended.resolvedRollFail` | +0.029736 | 1.972379 |
| `population.intended.nonPossessionShare` | +0.005315 · **CONTAINS ZERO** | 0.948482 |

⭐⭐ **THE DOSED WORLD SHIFTS THE MIX WITHOUT MOVING THE RATE.** The non-possession share itself is
statistically indistinguishable between the arms (Δ +0.005315, interval containing zero), but
**what ends the attempts changes**: the retention margin falls (−0.077851 at 4.301658 half-widths),
the opponent's poke rises (+0.045252 at 2.246520) and the roll's failures rise (+0.029736 at
1.972379). The receiver in the dosed world is **slower at the contact** (−0.488893 m/s) and **more
pressed** (+0.049602 pressure, nearest opponent −0.477199 m). ⛔ These are associations on
observational cells, ⛔ not an A/B and ⛔ nothing here is scored.

### §R8 THE READS, PRINTED

Selected on the **E** arm's stored booleans by the frozen §P.C rules, from the frozen §0 literals,
and re-derived off the serialized artifact by `gReadWords`:

> **"THE WINDOW IS MIXED — the commander decides with the table."**

> **"THE DOSED WORLD AGREES ON THE MAJORITY CLASS"**

(`reads.E.majorityClass` = `mixed`; `reads.D.majorityClass` = `mixed`;
`reads.E.noMajority` = **true**; `reads.D.noMajority` = **true**;
`reads.dosedAgreesOnMajorityClass` = **true**. D's own printed sentence is the same literal.)

⚠ Read the MIXED sentence with §R2's table in front of it. The frozen rule asked whether ONE class
carries more than half of the non-possession endings, and none does. What the table says instead,
on arm E's 8,941 intended-target non-possession endings, is that **the biggest single thing that
ends a control attempt is that the man is not within reach when the third tick comes**
(**0.491891**, and within it the ball travelled further than the receiver on **0.625739**), that
**the coin is the second thing** (**0.326138**), that **a defender's foot is the third**
(**0.112627**, of which **0.896705** are opponents), that **a teammate crowding him is rare**
(**0.012974**) and that **the line barely features at all** (**0.007605**). ⛔ **The census
adjudicates nothing beyond printing the sentences**; the commander rules with the table.

## §HONEST LIMITS

1. **⭐⭐ THE STUNNED / MARGIN SPLIT IS A BOUND, AND SAYS SO BEFORE IT IS READ.** The resolver's two
   pre-roll returns are invisible from outside the step. The census reads `sentOff` and
   `stunTimer` at the END of the tick, and `stunTimer` can be RAISED later in the same tick by a
   tackle as well as decayed by `Player.step` — so the end-of-tick read is neither a proven upper
   nor a proven lower bound on its own, and **only the SUM of the two cells is exact**
   (`gAttributionExhaustive`). On this battery the stunned cell read **0** on both arms, so the
   ambiguity did not bite; ⛔ that is a fact about this battery, not a property of the instrument.
2. **⭐⭐ FOUR CLASSES ARE INFERRED, AND THEIR TOTAL IS PUBLISHED.** `resolvedNotReachedStunnedOrOff`,
   `resolvedNotReachedMargin`, `abandonedDeadBallOut`, `abandonedPossessionElsewhere` and
   `abandonedOther` do not carry a unique public signature; together they are
   `population.intended.inferredShare` = **0.088681** (E) / **0.076548** (D), and the complement
   **0.911319** / **0.923452** is OBSERVED. §P.B declares which is which, class by class, BEFORE
   the battery — which is BQ-C0 §COMMANDER CORRECTIONS item 2's own remedy applied rather than its
   defect repeated.
3. **⚠ THE POPULATION IS OBSERVED AT TICK BOUNDARIES.** An attempt created AND ended inside one
   tick is invisible. The receipt is `population.creationLedgerAgreementShare` = **0.983491** (E) /
   **0.985378** (D) against the contest ledger's own `controlAttempt` contacts; the gap pools the
   offside branch's pre-creation aborts with any same-tick create-and-end, and this census cannot
   separate them.
4. **⚠ THE CUSHION READ IS ONE PHYSICS STEP LATE.** `applyControlContact` sets the ball's velocity
   and the census reads it at the END of that tick, after one integration. The contact law's own
   constants are published beside as the law's prediction, ⛔ never as a tolerance, and
   `physics.lawPredictedRangeShare` = **1.000000** is a stored face, not an assertion that the
   read is exact.
5. **⚠ THE PRESSURE AND THE OPPONENT DISTANCE ARE THE CENSUS'S OWN RECONSTRUCTION.** The SHIPPED
   `pressureAt` is CALLED, but at the census's chosen instants (the contact tick and the end tick),
   not at the roll's instant. Where a roll occurred the engine logged its OWN pressure; this census
   does not join the two, and no face here claims to be the roll's logged term.
6. **⚠ THE PASS-CLASS CUT IS DEGENERATE ON THE PRIMARY POPULATION.** An intended target is defined
   by a live `pendingPass`, so `physics.noPossession.passClass.carried` has denominator **0** on
   intended targets and the `toFeet` cell is numerically identical to the non-possession share.
   The cut would only separate on the all-bodies population, which this census does not publish it
   for.
7. **⚠ THE `windowTicks` TOP BIN IS A CLAMP BIN.** It reads "9 ticks or more", not "exactly 9",
   and it holds **23** (E) / **29** (D) endings. Every histogram in this census clamps its top bin
   the same way; the bin edges are stored and every published cut re-derives off disk.
8. **⭐⭐ ASSOCIATIONS, NOT CAUSES.** Every P(no possession | cell) here is a conditional share on
   observational cells of one engine. "Failure rises with pressure and with release speed" is a
   statement about THIS world's realised joint distribution, not about independent effects — the
   cells co-vary heavily (a fast ball into a crowd is also a fast release off the foot). ⛔ Nothing
   in this census is an A/B and ⛔ nothing is scored.
9. **⚠ THE MIX READ IS A PROPERTY OF THE FROZEN RULE.** A 0.5 bar on fourteen classes is a
   demanding one, and arm E's largest class sits at **0.491891** with an interval reaching
   **0.505459**. ⛔ The census does NOT report "no class matters"; it reports that no class is more
   than half, and publishes every class with its interval so the commander can rank them himself.
10. **⚠ `composition.<group>.resolvedClean` IS NOT A COMPOSITION SHARE.** The composition faces are
    defined over the NON-POSSESSION denominator for every class uniformly, so the possession
    class's own row is a ratio of possession endings to non-possession endings (**4.632480** on E)
    and is **not** a share of anything. It is stored for the re-derivation gate's completeness;
    §R2 publishes only the non-possession classes.
11. **⚠ BN-C0'S NUMBER AND THIS ONE HAVE DIFFERENT DENOMINATORS** (§R6). 0.227241 was over
    own-target FIRST contacts of a measured pass; **0.177542** is over every own-target
    `controlAttempt` contact in the ledger. ⛔ Not a discrepancy.
12. **⚠ BOTH SIDES ARE POOLED, AND ONLY GROUND CONTACT IS SEEN.** The population is every
    `pendingControl` by either team; no face separates the two sides. And `applyControlContact` is
    a GROUND-contact path — an aerial arrival that never opens a pending control is outside this
    census entirely.
13. **⚠ 12 SCRATCH CLUSTERS SIZED THIS BATTERY**, and N was fixed at 998 by the block. The realised
    half-widths at 998 on the six sized faces came in at 0.011262 · 0.013846 · 0.012773 · 0.013685
    · 0.011047 · 0.008883 (read off the battery artifact's own `faces[].halfWidth`), all inside the
    declared 0.02 target and, as it turned out, close to the 0.01 one — but the sizing table was
    frozen on the smoke's noisier estimate and is published as it was frozen. Every small cell —
    the seven empty classes, the `silent` ledger cell, the tail physics bins — is reported with its
    own realised interval, and ⛔ **no null is cut anywhere in this census**: an interval containing
    zero reads *"unresolved at this power"*, never *"no difference"*.
14. **⛔⛔ A CENSUS ADJUDICATES NOTHING — AND THIS ONE DOES NOT SAY THE WINDOW IS WRONG.** It counts
    what ends a control attempt, attributes each ending to the engine's own sites, and prints
    frozen sentences. It does **not** say three ticks is too long, does **not** say the retention
    margin is mis-set, does **not** recommend a contest law or a cushion change, and ships
    **nothing**: no world is cut, no flag is armed, the fingerprint is unchanged and the user's
    world-12 play-test gate remains the user's.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. **THE SITE COUNT IS TEN, NOT ELEVEN.** The dispatch brief stated eleven `this.pendingControl =
   null` occurrences plus one creation site; the file at `c5115db`/`b4b3e47` holds **10** plus the
   one creation site. `gSiteEnumeration` pins what the file holds and enumerates all ten with their
   purposes (§P.B); the gate note derives from the pin. ⭐ The census also names the **eleventh
   ending that is not a `= null` at all** — the creation site's own overwrite, which IS
   ABANDONED-BY-CONTACT.
2. **THE PRIVATE-FIELD READ**, as at BQ-C0: `Match.pendingControl` is `private` and the engine
   publishes no mirror, so the population is read through a TypeScript TYPE VIEW — a read, never a
   write, proven byte-inert by `gLockstep`. Declared at §P.B (the #383 item 3 precedent).
3. **THE POPULATION IS OBSERVED AT TICK BOUNDARIES** — HONEST LIMIT 3, with the contest ledger's
   own contact count published as the receipt.
4. **THE `abandonedBodyStrike` CLASS IS SPLIT OUT FROM `abandonedDeflection`.** #383 item 6(iii)
   named one ABANDONED-DEFLECTION class; the engine has **two** sites with two different ledger
   kinds — `bkApplyBodyStrike` (kind `body`, line 5582, the deflection precedent) and
   `tryCapture`'s applied deflection (kind `deflection`, line 5681). "Each remaining site its own
   class; nothing pooled" is the ruling's own instruction, so they are two classes.
5. **THE `resolvedOffside` CLASS IS SPLIT OUT FROM `abandonedOffside`.** Offside can be called
   inside the window (`applyControlContact`, line 5620) or at the resolution (`giveBall`, line
   3685); the precedence differs, so the two are separate classes. Both read **0** on this battery.
6. **THE SIZING TARGET IS A DECLARED 0.02**, with 0.01 published beside on the same six faces
   because the smoke's estimate did not afford it on five of them. #383 item 6(vii) left the
   half-width to the smoke to name; it named this one.
7. **`physics.holdLiveShare` IS A REAL CELL, NOT A RECEIPT.** The freeze originally described it as
   a receipt reading zero by construction; the preflight smoke proved `match.pcLatency` is **not**
   null on world 12 (`physics.pcSeatLiveShare` = 1.000000) and holds are live on **0.133122** of
   intended-target contacts on E. The description was corrected BEFORE the freeze and the fix is
   disclosed at §DEV-PREFLIGHT.
