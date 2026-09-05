# BQ-C0 — 「停球」 THE FIRST-TOUCH CENSUS（停球失误是掷骰子掷出来的——骰子的哪一面在重）

> **The census that reads the first-touch roll's own ledger LIVE on world 12 and names the term
> the quality law must address.** Authorized by **COMMANDER RULING #382 item 6**. Binding
> contract: [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md) **§2 M-BK.2** (ONE CONTACT LAW —
> "quality stays skill-priced") and its **§3 STATUS** line, which names this census.
> Lineage: [`PT-C0-PLAYTEST-FORENSIC-CENSUS.md`](PT-C0-PLAYTEST-FORENSIC-CENSUS.md) → the RC arc
> → [`RC-T1B-READY-EXAM.md`](RC-T1B-READY-EXAM.md) (**FAIL**: the third sentence is not a
> readiness/sector problem) → [`BN-C0-BOUNCE-CENSUS.md`](BN-C0-BOUNCE-CENSUS.md) (**the bounce is
> a CONTROL-QUALITY event** — C1 the majority class on both arms, and the failing law LOCATED) →
> **#382 item 6**, this census.
> **The ledger's birth**: [`EDS-E1A-FIRST-TOUCH-INSTRUMENT.md`](EDS-E1A-FIRST-TOUCH-INSTRUMENT.md)
> built `traceFirstTouch` → `firstTouchTrace[]` with a zero-behaviour proof and passed **I1** (the
> instrument recovers the formula's own speed term);
> [`EDS-E1B-TOUCH-COST-CURVE.md`](EDS-E1B-TOUCH-COST-CURVE.md) added the second speed curve behind
> `edsTouchCost`. ⚠ **Both measured the law on STAGED passes in a HELD world** (E1a §6: mean
> pressure exactly 0, mean misalign ≤ 0.0005). **Nobody has read its terms on world 12 live.**
> Census form of record: [`BN-C0-BOUNCE-CENSUS.md`](BN-C0-BOUNCE-CENSUS.md).
> Instrument: `scripts/probes/bq-c0-first-touch-census.ts`.
> Artifact: `docs/world-model/data/bq-c0-first-touch-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. **IT SHIPS NOTHING**, scores no hypothesis
> and arms no mechanism. The READ SENTENCES of #382 item 6(v) are FROZEN LITERALS selected by
> **STORED booleans**. The commander rules.
> ⛔ **X-SRC-ZERO**: no file under `src/` is created or edited. The probe **CALLS the shipped
> exports** — `touchFailChance` ITSELF, `TOUCH_SPEED_COST`, the world composer, the dose loaders —
> and reads `Match` state per tick; **the E1a ledger is READ, never re-implemented**. There is NO
> WRAPPER — `gLockstep` proves observed ≡ unobserved byte for byte per arm, and `gTraceInert`
> proves **both** trace flags change no byte of the world.
> ⛔ **WORLD 12 IS UNTOUCHED**: no world is cut, no flag is armed, the user's play-test gate stays
> the user's.
> ⭐ **THE BINDING CANON IS #381 item 3** — VERBATIM: *"an event attribution reads the engine's
> own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is
> written only where no record exists, and says so"* (home: `RC-T1B-READY-EXAM.md` §COMMANDER
> CORRECTIONS item 5). §P.B says, line by line, what is READ and what is a heuristic.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**THE USER'S VERDICT, VERBATIM** (#368 item 1, received 2026-09-03) — the third clause is this
census's ancestor:

> 「12我看了下,还是有人挤人,传不出去球,**传到人身上弹回**,或经常传到对面身上」

**COMMANDER RULING #382 item 5 — THE FAILING LAW, LOCATED. VERBATIM (the code facts of record
this census anchors):**

> *"⭐⭐ **THE FAILING LAW, LOCATED** (code facts of record, symbol-stable):
> `Match.resolvePendingControlAttempt()` at `readyTick` calls `mech.attemptFirstTouch(this, p,
> {relativeSpeed, incomingDir})`; a keeper or a ball at `speed ≤ 6` is clean without a roll;
> otherwise `misalign = (1 + incomingDir·heading) / 2` (face = 0, behind = 1), `pressure =
> pressureAt(pos, opponents)`, and **`pFail = touchFailChance(speed, pressure, misalign,
> attrs.dribbling, attrs.positioning, edsTouchCost)`** = `clamp(raw · (1.3 − 0.85 · technique), 0,
> 0.4)` with `raw = 0.01 + clamp01((speed − 6) / span) · weight + (pressure · 0.1 + misalign ·
> 0.05) · aware`, `aware = 1 − (positioning − 0.5) · 0.6`, the curve `{span 8, weight 0.07}`
> (base) or `{16, 0.24}` (E1b's heavy, behind `edsTouchCost`, default = the `EDS_BUNDLE` env — the
> census pins world 12's value); a re-collected own touch pays ×0.45; **`clean =
> !rng.chance(pFail)`**; a failure increments `miscontrols`, knocks the ball loose at 3.5–6.5 m/s
> rotated ±0.8 rad and sets `kickCooldown` 0.5. ⭐ The E1a INSTRUMENT already exists:
> `traceFirstTouch: true` appends every adjudication's exact terms (`intendedTarget ·
> relativeSpeed · pressure · misalign · technique · positioning · pFail · clean`) to the public
> `firstTouchTrace[]` — a LEDGER, observation-only (E1a's own exact validity). E1a/E1b measured
> this law on STAGED passes in a held world (pressure 0, misalign 0); no one has read its terms on
> world 12 live. ⭐ THE FORM QUESTION, NAMED FOR THE USER IN PLAIN FOOTBALL: 「停球失误是掷骰子掷
> 出来的」 — in this engine whether a first touch sticks is a coin weighted by speed, pressure,
> blind side and technique, capped at 40 %. Whether the weights are human, and whether a coin is
> the honest law at all (the BK arc removed the EXISTENCE roll and kept QUALITY as skill-priced
> rolls), is what BQ-C0 measures and BQ-T0 decides."*

**COMMANDER RULING #382 item 6, the scope this census instruments, VERBATIM:**

> *"⭐⭐ **BQ-C0 DISPATCHED — 「停球」 THE FIRST-TOUCH CENSUS** (a C0 census; the BN-C0 form;
> X-SRC-ZERO; definitions frozen at the executor's §P): (i) ARMS E / D, world 12's composition,
> the composer CALLED, BOTH with `traceFirstTouch: true` (observation-only; gTraceInert ON vs OFF
> signatures on shared scratch seeds) and `traceContests: true` (for the outcome ladder); the
> world conjunct PINS `edsTouchCost`'s value in world 12 (expected false — the base curve — unless
> the env arms the bundle; the census states which curve it measured). (ii) POPULATION: every
> control-attempt RESOLUTION (`resolvePendingControlAttempt` reaching its body) — split into the
> FREE TRAPS (keeper, or `speed ≤ 6`: no roll, no trace entry — counted as resolutions minus trace
> entries, anchored to the two early-return lines) and the ROLLED ADJUDICATIONS (the
> `firstTouchTrace` entries), each entry split `intendedTarget` vs not. (iii) FACES per arm,
> INTENDED TARGETS PRIMARY (all bodies beside): the realised FAIL share vs the mean logged `pFail`
> (the roll's calibration — E1a's I1 form, live: a stored boolean "calibrated" iff the realised
> share lies inside the bootstrap interval of the mean pFail); the pFail distribution (bins 0.01 ×
> 41) and the CAP-HIT share (pFail = 0.4); ⭐ THE TERM DECOMPOSITION at every adjudication — the
> four addends of `raw` (floor 0.01 · speed term · pressure term · misalign term) recomputed from
> the logged terms with the shipped `touchFailChance` arithmetic (IMPORTED constants; a fixture
> proves the recomposition equals the logged pFail bit-exactly), each term's MEAN SHARE of raw
> over FAILED adjudications and over ALL, the technique multiplier's distribution, and THE
> MAJORITY TERM over failures STORED as a boolean per term (majority = share > 0.5; none ⇒
> 'noMajority' true); the marginals — P(fail | speed bin 2 m/s), P(fail | pressure bin 0.1),
> P(fail | misalign bin 0.1), P(fail | dribbling bin 0.1), P(fail | positioning bin 0.1) — with
> counts; the distributions of speed, pressure, misalign, dribbling, positioning on
> intended-target adjudications (bins); the own-touch (×0.45) share; WHAT THE OTHER CURVE WOULD
> HAVE SAID — the heavy (or base) pFail recomputed per adjudication and published beside, never
> scored; the `miscontrols` team stat per match against the trace's fail count (a cross-check
> receipt); THE FAIL'S AFTERMATH — BN-C0's settle ladder at +K after a failed touch (same side /
> opponent / loose / out) and the knock speed bins; the SPEED SOURCE — for intended-target
> adjudications the pass's launch speed, distance and power (C1-A's `PASS-POWER-SLICE` — every
> live call passes 1.0; anchored) so item 4(iv)'s pass-weight question has its live distribution.
> (iv) THE REALITY ANCHOR — the executor cites the literature / coaching figures for first-touch
> failure rates on ground passes (open vs under pressure; elite vs amateur) with the caveat of its
> access, the BF-C0 form; the commander ratifies at banking. (v) PRE-REGISTERED READS (frozen
> literals on the E arm's stored majority-term booleans; D beside; the dosed-agrees boolean
> printed): SPEED majority ⇒ *"THE FIRST TOUCH FAILS ON PASS WEIGHT — the speed term is named, and
> step ④'s power chooser with it."*; PRESSURE majority ⇒ *"THE FIRST TOUCH FAILS UNDER PRESSURE —
> the pressure term is named."*; MISALIGN majority ⇒ *"THE FIRST TOUCH FAILS ON THE BLIND SIDE —
> the misalign term is named; the receiver's body returns as a quality term."*; the FLOOR majority
> ⇒ *"THE FIRST TOUCH FAILS BY THE FLOOR — the roll's constant and its technique multiplier are
> named; the law's FORM is the commander's question."*; no majority ⇒ *"THE FIRST TOUCH FAILS ON A
> MIX — the commander decides with the table."*; and, from the calibration boolean, *"THE ROLL IS
> CALIBRATED ON WORLD 12"* / *"… IS NOT"*. (vi) SEEDS: block **12,541,000–999** (N sized by a
> disclosed 12-seed smoke on scratch 900,002,900–911; smoke receipt 900,002,920; trace-inert
> 900,002,980–981; lockstep 900,002,990–991; receipt 12,541,999); ZERO stats; registry 73; compact
> JSON; the hash receipt outside the body; honest-limits single home; every read word STORED; the
> prose sweep; the two-fractions rule; engine ledgers before heuristics. DOC
> `BQ-C0-FIRST-TOUCH-CENSUS.md`; INSTRUMENT `scripts/probes/bq-c0-first-touch-census.ts` (BN-C0's
> arms, pairing, estimator, hash order and settle ladder REUSED; E1a's ledger READ); ARTIFACT
> `docs/world-model/data/bq-c0-first-touch-census.json`."*

**THE READ SENTENCES, VERBATIM** (#382 item 6(v)) — frozen here, before any battery seed, and
PRINTED by the instrument from stored booleans:

| selector (a STORED boolean) | the sentence PRINTED, verbatim |
|---|---|
| **speed** majority | *"THE FIRST TOUCH FAILS ON PASS WEIGHT — the speed term is named, and step ④'s power chooser with it."* |
| **pressure** majority | *"THE FIRST TOUCH FAILS UNDER PRESSURE — the pressure term is named."* |
| **misalign** majority | *"THE FIRST TOUCH FAILS ON THE BLIND SIDE — the misalign term is named; the receiver's body returns as a quality term."* |
| **floor** majority | *"THE FIRST TOUCH FAILS BY THE FLOOR — the roll's constant and its technique multiplier are named; the law's FORM is the commander's question."* |
| no majority | *"THE FIRST TOUCH FAILS ON A MIX — the commander decides with the table."* |
| `calibrated` TRUE | *"THE ROLL IS CALIBRATED ON WORLD 12"* |
| `calibrated` FALSE | *"THE ROLL IS NOT CALIBRATED ON WORLD 12"* |

and beside them, from a stored boolean, one of: *"THE DOSED WORLD AGREES ON THE MAJORITY TERM"* /
*"THE DOSED WORLD DISAGREES ON THE MAJORITY TERM"*.

### in plain football language

The bounce census settled **what** the user's 「传到人身上弹回」 is. The ball reaches the man it was
meant for, he tries to bring it under control, and he fails. It is not a pass that never got there
and it is not a ball that hit the wrong man — it is a **bad first touch**.

Now, **why** does he fail? In this engine that is not a story about his body or his balance. It is
a **coin toss**. The engine builds a number — the chance this touch gets away from him — out of
four things added together: a **flat constant** that every touch pays, how **fast** the ball is
travelling, how close the nearest **defender** is, and whether the ball is arriving at his **face
or his back**. Then it multiplies the whole thing by how **good he is at controlling a ball**,
caps it at four-in-ten, and tosses a weighted coin.

Nobody has ever looked at that number in the world the user actually plays. E1a and E1b measured
it on a **frozen practice pitch** — one passer, one receiver, nobody within thirty metres — where
two of the four ingredients are zero by construction. This census reads the engine's own notebook
of **every single toss in a real match**, and does six plain things.

1. **It counts how often the world even asks the question.** A keeper never rolls. A ball under 6
   m/s never rolls — it is a free trap by fiat. Everything else is adjudicated.
2. **It checks the coin is honest.** If the engine says "this touch fails 10 % of the time", does
   it fail 10 % of the time? That is one stored boolean, and it is also checked band by band.
3. **⭐⭐ It weighs the four ingredients.** For every touch that FAILED, what share of the number
   came from the speed, from the defender, from the blind side, and from the flat constant? The
   biggest one — if any of them is more than half — is the thing the repair has to address, and
   it is printed as one frozen sentence.
4. **It asks what the other curve would have said.** E1b built a second, heavier speed curve. It
   is not switched on. The census recomputes what every touch would have scored under it and
   publishes it beside — **never scored, never a recommendation**.
5. **It follows the loose ball.** Three ticks after a touch is spilled, who has it?
6. **It looks at where the speed came from** — how hard the pass was struck and from how far —
   because #382 item 4(iv) established that pass weight reaches the receiver **only** through this
   roll's speed term.

Beside all that it cites what **real** first-touch failure rates look like, so the commander can
ask whether this world's number is a human number.

⛔ Nothing here is decided, nothing is built and no world changes. **A census does not say a coin
is wrong. It says which face is heavy.**

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — two, PAIRED on shared seeds; and THE CURVE, PINNED

Arm `k` walks seed `s` with the **IDENTICAL population construction** (BN-C0's own `buildMatch`
plumbing: genomes and squads drawn from the seed exactly as it does, the same 240 s match), so the
two arms differ **ONLY** in the world's own books and **every Δ is PAIRED per seed**.

| arm | composition — the composer **CALLED, never copied** | gate on the match |
|---|---|---|
| **E** | **world 12 EMPTY-BOOK — the exams' form**: `a4MatchFlags(12)` as construction flags + `armA4World(m, null, 12)` | `raArmedVersion(m) === 12` |
| **D** | **world 12 DOSED — THE FORM THE USER PLAYS**: the same, plus the two doses from the **SHIPPED LOADERS THEMSELVES** (`loadL3Dose` / `loadPcDose`, CALLED) | `raArmedVersion(m) === 12` |

**BOTH arms are constructed with `traceFirstTouch: true` AND `traceContests: true`.** Both are
**observation, not a world**. `traceFirstTouch` is read at exactly ONE place — the
`if (match.traceFirstTouch) {` push that happens **AFTER** `const clean = !match.rng.chance(pFail);`
(both anchored), so the branch cannot influence a roll that has already been made — and
`traceContests` at `traceContact`'s own early return. `gTraceInert` proves it on shared
out-of-band scratch seeds: the same seed built with both traces ON and both OFF runs to completion
with a **byte-identical whole-match signature**, on both arms.

**⭐⭐ THE CURVE IS PINNED BEFORE THE BATTERY.** `this.edsTouchCost = cfg.edsTouchCost ??
EDS_BUNDLE_ARMED` (anchored), and the string `edsTouchCost` appears **zero** times in the whole
world composer `src/game/a4World.ts` (an anchor with `want = 0` — the receipt that world 12 never
sets it). The probe's §1 envelope **refuses the `EDS_BUNDLE` env outright**, so the pinned value is
what a shipped world 12 gets. The instrument reads `m.edsTouchCost` off a real constructed match of
**each** arm before any battery seed, stores it, asserts it on **every** walked match in `gWorld`,
and **states which curve it measured everywhere**. #382 item 6(i) instructed: if it is true, say
so and measure that curve.

**THE DOSES ARE PINNED.** `gDoseSource` hashes the FILE BYTES this process read from
`docs/world-model/data/l3-t1-convergence-exam.json` and
`docs/world-model/data/pc-t1-learning-exam.json` and compares them to the values #382 item 6
pinned; a mismatch is `process.exit(3)` **before any seed is walked**. Canon, VERBATIM: *"a
dose-source guard should hash the bytes it reads, not a self-declared field"* (home:
`BU-T1-MT-COMPOSITION.md` §COMMANDER CORRECTIONS item 6).

**THE PAIRED Δ (D − E)** is published on **every** face: the bootstrap resamples SEEDS and both
arms move together inside every draw, so the interval is a PAIRED one by construction.
⛔ **The census SCORES nothing.** The reads rest on the **E** arm's stored booleans, with **D**'s
printed beside at the same precision and the same prominence.

### §P.B THE POPULATION, THE LEDGER, THE DECOMPOSITION AND THE FACES

| quantity | frozen form |
|---|---|
| **⭐⭐ THE POPULATION** | every **CONTROL-ATTEMPT RESOLUTION**: a `pendingControl` that **ENDS at a tick AT OR AFTER its own `readyTick`** — the resolver's own gate `if (attempt === null \|\| this.stepCount < attempt.readyTick) return false;` (anchored). A pending control that ends EARLIER was abandoned by another path (a restart, a `giveBall`, a dead ball) and is **COUNTED SEPARATELY** as `population.abandonedBeforeReadyShare`; ⛔ it is never a resolution |
| **⚠ THE PRIVATE-FIELD READ, DECLARED** | `Match.pendingControl` is declared `private` (anchored at its own line) and the engine publishes **no mirror** of the control-attempt queue. The census reads it through a TypeScript **TYPE VIEW** — a **READ of engine state, never a write**; `gLockstep` proves the whole observation byte-inert. Declared here rather than assumed |
| **⭐⭐ ROLLED ADJUDICATIONS** | the **E1a trace entries** — one per roll, appended by `attemptFirstTouch` itself. Split `intendedTarget` vs not, on the ledger's **own** flag (never re-derived from `pendingPass` by the probe) |
| **⭐⭐ THE FREE TRAPS** | `attemptFirstTouch`'s **ONE** early return, in the **ENGINE'S OWN ORDER**: `if (p.role === 'GK' \|\| speed <= 6) return true;` (anchored). A **keeper** first, then a ball at **`speed <= 6`**. No roll, no rng draw, **NO trace entry** |
| **⛔ A THIRD CLASS, PUBLISHED RATHER THAN POOLED** | `notReached` — the **RESOLVER'S OWN** pre-roll early returns (a missing / sent-off / stunned body, or the retention margin; both anchored). These never reach `attemptFirstTouch` at all, so ⛔ **"resolutions minus trace entries" is NOT the free traps alone** and this census refuses to call it that. The identity **RESOLUTIONS − TRACE ENTRIES = free traps + `notReached`** is a **GATE** (`gLedgerNonVacuous`) and each class is published with its own share |
| **⭐ THE SPEED THE ROLL READS** | the `PendingControlAttempt`'s own frozen `relativeSpeed` — the resolver hands exactly that value in (anchored), so it is what the free-trap test `speed <= 6` reads AND what the ledger logs. Their bit-equality is a **published receipt** |
| **⭐⭐ THE CALIBRATION RULE** | **FROZEN**: `calibrated` iff the **REALISED** fail share (entries with `clean === false` / entries) lies **INSIDE** the 2,000-draw cluster-bootstrap interval of the **MEAN LOGGED `pFail`**, on INTENDED-TARGET adjudications. This is **E1a's I1 form, live** (E1a §3 compared \|empirical spill − mean logged pFail\| against a stated tolerance on staged buckets; here the interval is the census's own estimator and no new tolerance is invented). The calibration per `pFail` **DECILE** is published beside |
| **⭐⭐ THE TERM DECOMPOSITION** | the FOUR addends of `raw`, recomputed from the **LOGGED** terms with the shipped arithmetic and IMPORTED constants: `floor = 0.01` · `speed = clamp01((relativeSpeed − 6) / span) · weight` · `pressure = pressure · 0.1 · aware` · `misalign = misalign · 0.05 · aware`, with `aware = 1 − (positioning − 0.5) · 0.6`. Each term's **MEAN SHARE** is the mean over entries of (term ÷ raw) — ⛔ not a ratio of sums |
| **⭐⭐ WHAT THE MULTIPLIER AND THE CAP DO TO A SHARE** | **THE DECOMPOSITION IS OF `raw`, BEFORE the technique multiplier `1.3 − 0.85 · technique` and BEFORE the cap 0.4.** Both act on the **PRODUCT**: the multiplier scales every addend equally and therefore **cannot move a share at all**, and the cap — where it bites — truncates the product, not the mix. So neither is attributed to a term; the multiplier's own **mean and distribution** and the **CAP-HIT share** are published as their own faces so the reader sees exactly what they do |
| **⭐⭐ THE RECOMPOSITION** | the **SHIPPED `touchFailChance` is CALLED** on each entry's own logged terms with the pinned curve. A non-own-touch entry's logged `pFail` must equal it **BIT-EXACTLY**; an **own-touch** entry must equal **EXACTLY 0.45 ×** it (the discount is applied AFTER the clamp — anchored). A third class turns **`gRecomposition` RED** |
| **⭐⭐ THE OWN-TOUCH (×0.45) CLASS** | detected **ARITHMETICALLY** from the ledger's own logged `pFail`, which is the **ENGINE'S OWN RECORD** of the discount (the push happens after the `*= 0.45` line). ⛔ **NOT** read off `match.dribbleTouch`: that field is public but **mutable between the roll and the end of the tick**. The end-of-tick `dribbleTouch` read is published as a **cross-check RECEIPT** with its agreement share, and the arithmetic is the record |
| **⭐⭐ THE MARGINALS** | P(fail \| bin) on INTENDED-TARGET adjudications for `relativeSpeed` (2 m/s), `pressure` (0.1), `misalign` (0.1), `dribbling` (0.1) and `positioning` (0.1), each with its counts; the **DISTRIBUTIONS** of the same five are the same bins' own N and are published as their own share faces |
| **⭐ THE OTHER CURVE** | the other of `TOUCH_SPEED_COST`'s two curves, recomputed per adjudication from the SAME logged terms (the own-touch ×0.45 carried over). ⛔ **AN EXPECTATION UNDER A COUNTERFACTUAL CURVE — no coin was tossed at those values — NEVER a measured share and NEVER SCORED** |
| **⭐⭐ THE FAIL'S AFTERMATH** | **BN-C0's settle ladder at +K, REUSED**, where `K = CONTACT_CONTROL_DELAY_TICKS` is READ OFF the control-attempt law's own `readyTick` form (a CONSTANT offset; anchored). Read from the **FAILED RECEIVER'S OWN side**: `sameSide` / `opponent` / `loose` / `out`, plus `unresolved` for a window that ran past FULL TIME (COUNTED; it enters no other reading). The **KNOCK SPEED** is \|ball.vel\| at the **END of the fail tick** — bins |
| **⭐ THE SPEED SOURCE** | for intended-target adjudications, the **launch speed** and **passer→target distance** of the delivery (`pendingPass`) live at the entry's tick, plus P(fail \| launch-speed bin) and P(fail \| distance bin). The linkage share is a published receipt |
| **⭐⭐ `powerAlwaysOne`** | a **STORED boolean** from the **ENGINE'S OWN LEDGER**: `pwChooserLedger.struckAtChosenPower` — *"strikes that reached `performPass` carrying a non-default weight"*, the engine's own words — reads **0** on EVERY walked match on BOTH arms, **AND** every `performPass(` call site is **ENUMERATED** (needle counts anchored) and passes no weight or the LITERAL `1` |

#### ⭐⭐ WHAT IS READ FROM THE ENGINE, AND WHAT IS A HEURISTIC

Canon, VERBATIM: *"an event attribution reads the engine's own record when one exists (`shotLog`,
the contest episodes, `lastTouch`); a heuristic is written only where no record exists, and says
so"* (home: `RC-T1B-READY-EXAM.md` §COMMANDER CORRECTIONS item 5, ruling #381 item 3).

**READ FROM THE ENGINE — never re-implemented:**

* **EVERY ROLL TERM** — `relativeSpeed`, `pressure`, `misalign`, `technique`, `positioning`,
  `pFail`, `clean` and `intendedTarget`, from the **E1a ledger's own record**. ⛔ **Not one of
  them is re-derived from state**: the whole point of #382 item 5 is that this ledger exists.
* **THE ARITHMETIC** — the **shipped `touchFailChance` is CALLED**, not copied; `TOUCH_SPEED_COST`
  is **IMPORTED**.
* **THE POPULATION** — `pendingControl`'s own record (through the declared type view) and its own
  `readyTick`.
* **THE OWN-TOUCH CLASS** — the ledger's own logged `pFail` (exactly 0.45 × the recomposition).
* **`miscontrols`** — the engine's own team stat. **THE POWER LEDGER** — `pwChooserLedger`.
* **THE AFTERMATH** — `ball.owner` and `phase`, BN-C0's own channels.

**HEURISTICS, SAID SO — where the engine keeps no record:**

1. **THE SPEED SOURCE.** The engine stores **no launch speed, no pass distance and no per-strike
   power** on `pendingPass` (its record is `side · passerGid · targetGid · t · offside ·
   offsideSpot · bounce` — the registration site is anchored). The probe therefore reads the
   **launch speed as \|ball.vel\| at the END of the release tick** and the **distance as
   passer→target at that tick**. ⚠ The strike's own `d` is measured to the **LED point**
   (`clamp(d · 0.6 + 8.2, 9, 22) · executedMul`, anchored); this census's distance is to the
   **target himself**, and they differ by the lead. Declared.
2. **THE KNOCK SPEED** is \|ball.vel\| at the **END of the fail tick** — one tick of physics after
   the knock line itself set it. Declared.
3. **THE `dribbleTouch` CROSS-CHECK** is an END-OF-TICK read of a mutable field; a clean touch's
   `giveBall` can clear the tag inside the same tick. It is a **RECEIPT only**.
4. **THE `powerAlwaysOne` CALL-SITE CENSUS.** The engine's `struckAtChosenPower` counter is a real
   record and is read; the **call-site half** is a text census of `src/`, with every occurrence
   enumerated. Declared as a code census, not a runtime observation.

#### ⭐⭐ THE MAJORITY RULE, FROZEN

`majority(term) = meanShare(term over FAILED INTENDED-TARGET adjudications) > 0.5`. If **exactly
one** term holds a majority it is the **majority term**; otherwise `noMajority = true` and the MIX
literal prints. **The floor counts as a term**, per #382 item 6(iii). ⚠ The four shares sum to 1
by construction, so at most one can exceed 0.5 — the "exactly one" form is a guard, not a
tie-break.

### §P.C THE READS (the literals and their selectors)

The sentences of §0 are **frozen literals in the instrument**. The **SELECTORS** are STORED
booleans: the four `majority[term]` booleans and `noMajority` (from the frozen majority rule
applied to the artifact's own term-share faces), and `calibrated` (from the frozen calibration
rule). The **READ OF RECORD** is selected on the **E** arm's booleans; **D**'s booleans, shares and
sentence are printed BESIDE. The agreement boolean (`E majorityTerm === D majorityTerm`) selects
one of the two agreement sentences. `gReadWords` re-derives **every** boolean, the `noMajority`
flag, the majority term, the calibration boolean, `powerAlwaysOne` and every printed sentence by
applying the frozen rules to the **SERIALIZED** per-seed cells off disk, and asserts every printed
sentence is one of the frozen literals. Canon, VERBATIM: *"a counterfactual verdict sentence ('had
X been scored, the rule would read W') quotes a word the instrument STORED by applying the frozen
rule to X's stored interval; a universal sentence about a table ('every bin', 'the one bin') is a
stored boolean or is not written"* (home: `BF-T1-FACING-COST-EXAM.md` §COMMANDER CORRECTIONS items
1–2).

### §P.D THE ESTIMATOR

**Cluster bootstrap over match SEEDS, 2,000 draws**, rng seeded from the block base 12,541,000.
Every published share carries a 95 % percentile interval and its half-width; every paired Δ is
**D − E** on the seeds the arms share, so the interval is PAIRED by construction. Medians are
**BIN-DERIVED** (the lower edge of the bin whose cumulative count first reaches n/2) so `gFaces`
re-derives every one off disk — canon, VERBATIM: *"the re-derivation gate covers EVERY published
face; a percentile face requires stored bins"*. ⛔ **Nothing in this census is scored** and ⛔ **no
null is cut anywhere**: an interval containing zero reads *"unresolved at this power"*.

### §P.E SEEDS AND SIZING

* **Block 12,541,000–999**: battery seeds **12,541,000–12,541,997** (**N_FROZEN = 998** — #382
  item 6's own cap, the largest the block affords), construction receipt **12,541,999**. Each seed
  is walked **ONCE PER ARM** ⇒ **1,998 walks booked = walked**. The **UNWALKED TAIL IS DECLARED**:
  seed **12,541,998**, stored in the artifact's `seeds.unwalkedTail`.
* **Scratch, out-of-band only** (canon, VERBATIM: *"verifier scratch walks use the stage's own
  consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"*):
  smoke **900,002,900–911** with its receipt at **900,002,920**; the **curve pin** at
  **900,002,970**; the **trace-overhead bench** at **900,002,940–951**; **gTraceInert** at
  **900,002,980–981**; **gLockstep** at **900,002,990–991**. ⭐ **EVERY scratch seed walked is
  STORED in the artifact's `seeds` block.**
* **Stats consumed: ZERO.** Registry **73** untouched.
* **SIZING** (the house form; §DEV-PREFLIGHT's smoke is the variance source). The reads rest on the
  **four term-share faces** over FAILED intended-target adjudications plus the realised fail share,
  all on the **E** arm. **THE DECLARED HALF-WIDTH IS 0.02** — the value the block certifies on
  every one of the five. The tighter **0.01** target is published on the same five faces so the
  reader sees exactly what the block does **not** afford:

| face (arm E) | realised hw (12 clusters) | N required @ 0.02 | N required @ 0.01 | resolvable at 998 |
|---|---|---|---|---|
| `decomposition.intendedFailed.floor.meanShare` | 0.011946378699922516 | **9** | **35** | ✅ both |
| `decomposition.intendedFailed.speed.meanShare` | 0.05813210452909154 | **208** | **829** | ✅ both |
| `decomposition.intendedFailed.pressure.meanShare` | 0.09736939744402595 | **582** | **2325** | ✅ at 0.02 · ⛔ at 0.01 |
| `decomposition.intendedFailed.misalign.meanShare` | 0.05482260993702704 | **185** | **737** | ✅ both |
| `roll.intended.realisedFail` | 0.034021875294656445 | **71** | **284** | ✅ both |

  Expected half-widths at N_FROZEN: 0.0013099708453759645 · 0.006374430614187032 ·
  0.010676965387371005 · 0.006011530564102229 · 0.0037306422189098865 (MDEs
  0.00187248081357079 · 0.009111652419316116 · 0.015261723499864427 · 0.008592920736526148 ·
  0.005332604158225409). ⚠ **What is NOT sized is stated instead**: every face on a small cell —
  the CAP-HIT class, the own-touch class, the tail marginal bins, the `notReached` class — is
  reported with its own realised interval and **no null is cut on it**.
* **Bins** (frozen): `pFail` 0.01 × 41 · calibration deciles 0.04 × 10 · technique multiplier
  0.05 × 28 · relative speed 2 m/s × 13 · the four unit terms 0.1 × 11 · knock speed 0.5 m/s × 16
  · launch speed 2 m/s × 13 · distance 5 m × 13 · resolution cells × 4 · recomposition cells × 3 ·
  aftermath ladder × 5 per group · decomposition cells × 4 · groups × 2.

### §P.F THE GATES (all liveness/receipt — NEVER direction)

`gWorld` (per arm, on EVERY walked match and the receipt: `raArmedVersion === 12`, **BOTH** trace
flags TRUE, **`edsTouchCost` PINNED and equal on every match of both arms**, every RC/BF flag
ABSENT, `info.genome` clean) · `gDoseSource` (the shipped loaders CALLED; the FILE BYTES hashed and
compared to the PINNED values; exit 3 on mismatch) · `gTraceInert` (both traces ON vs OFF,
byte-identical whole-match signatures, on shared out-of-band scratch seeds, per arm) ·
`gLedgerNonVacuous` (trace entries, INTENDED-TARGET entries and FAILURES exist on BOTH arms, and
**the free-trap identity holds**: resolutions − entries = free traps + `notReached`) ·
**`gRecomposition`** (`clamp(raw · mult, 0, 0.4)` — through the SHIPPED function, CALLED —
reproduces the logged `pFail` bit-exactly on every non-own-touch entry, and exactly 0.45 × it on
the own-touch class; the `neither` class must be **0** on the battery AND the receipt) ·
`gAnchoredConstants` (anchored extraction with line receipts over **every** `touchFailChance`
constant at its own site, the two free-trap branches, the ×0.45 line, the `rng.chance` line, the
knock lines, `CONTACT_CONTROL_DELAY_TICKS` at its `readyTick` site, the launch-speed form,
`PASS_POWER_MIN`/`PASS_POWER_MAX`, `EDS_BUNDLE_ARMED`'s line, both `.stats.miscontrols++` sites
ENUMERATED, both `pressureAt(p.pos, …)` sites ENUMERATED, and every `performPass(` call site
ENUMERATED) · `gWalkFixtures` (the decomposition on constructed terms; the recomposition against
the shipped law; the calibration rule; the majority rule; the free-trap classifier in the engine's
own order; the settle ladder on constructed states) · `gClassesNonVacuous` · `gLockstep` ·
`gSrcUntouched` · `gSeedsBookedEqualWalked` · `gN` · `gHashOrder` · `gReadWords` · `gFaces`.

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
`PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 1) — the `miscontrols`, `pressureAt` and
`performPass` needles are enumerated for exactly that reason; VERBATIM: *"a field carries the unit
its name claims"* (home: ruling #294 item 3); VERBATIM: *"a scored face's walk-side predicate is
pinned — anchored extraction or fixture — because the re-derivation gate proves arithmetic, not
definitions"* (home: `DF-T3-SURFACE-EXAM.md` §COMMANDER CORRECTIONS item 2); VERBATIM: *"a gate's
NOTE derives from the same pinned values the gate checks; a count typed beside its pin is a second
copy"* (home: `PT-C0-PLAYTEST-FORENSIC-CENSUS.md` §COMMANDER CORRECTIONS item 1) — every gate NOTE
here interpolates the same values its `ok` reads; VERBATIM: *"a stage doc's prose quotes artifact
FIELDS verbatim or the number becomes a gated face"* (home: `PC-T2-ARMED-WORLD-READ.md` §COMMANDER
CORRECTIONS item 4); VERBATIM: *"a stage doc's numeric sweep covers EVERY numeric literal in prose
at ANY precision; a hand-written percentage is the likeliest second copy"* (home:
`BF-C0-MOVEMENT-FACING-CENSUS.md` §COMMANDER CORRECTIONS item 6); VERBATIM: *"a starred finding
states its \|Δ\|÷half-width ratio"* (home: `BU-T0B-PRICE-SEPARATION.md` §COMMANDER CORRECTIONS item
2); VERBATIM: *"a stage doc's HONEST LIMITS list is the ONE home; the artifact stores that list
verbatim or stores none"* (home: `RC-C0-COOPERATION-CENSUS.md` §COMMANDER CORRECTIONS item 3) —
**this artifact stores NONE**; §HONEST LIMITS below is the list of record. Ledger, dose, linkage
and timing receipts are **never** quoted as football effect sizes (ruling #289 item 1 +
`BU-T1-MT-COMPOSITION.md` §COMMANDER CORRECTIONS item 5).

### §P.G THE REALITY ANCHOR — cited ranges, and their ROLE

**⛔ THE ROLE, STATED BEFORE THE BATTERY (the BF-C0 form):** the anchor is **a comparison the
commander reads**. It is **NEVER a rule, never a gate, never a target and never a tolerance**. No
face, no boolean, no read sentence and no gate in this census reads it. It exists so that when
this world's first-touch failure rate is printed, the commander can ask *"is that a human
number?"* — and #382 item 6(iv) reserves the **ratification** of these citations to him.

**⚠ THE CAVEAT OF MY ACCESS, STATED PLAINLY.** This executor session has **no web access and no
literature database**. The figures below are cited **from the executor's own knowledge of the
public football-analytics and coaching literature**, as **RANGES**, with their provenance named
and their softness admitted. ⛔ **They are not quotations from a fetched source, they carry no
page reference, and the commander should treat every one as a claim to be checked before it is
ever leaned on.** That is the honest statement of what this section is worth.

* **Ball retention on ordinary short ground passes, senior professional football.** Opta-family
  and StatsBomb-family public reporting has for years put **overall pass completion in elite
  league football around 0.80–0.86**, and short passes materially higher — commonly quoted around
  **0.90 and above**. Completion is not the same measurement as a first touch: it counts a pass as
  complete when the receiving team retains it, which pools *the pass arriving* with *the touch
  sticking*. Read as an **upper bound on first-touch failure**, it implies a controlled-reception
  failure rate on short ground passes in the low single-digit percents in elite play — call it a
  **0.02–0.06** band, with the honest note that no public feed isolates "the touch got away" as
  its own event.
* **Under pressure.** The pressure-events literature (StatsBomb's pressure and
  pressed-pass framing, and the possession-value work built on it) reports a consistent and large
  drop in retention when a receiver is closed down at reception — the commonly quoted shape is a
  **relative** worsening of roughly **1.5× to 3×** against the unpressed case, rather than an
  absolute number. In coaching terms this is the whole basis of pressing: **the touch under
  pressure is a different act from the touch in space.**
* **Elite vs amateur.** Coaching literature on receiving craft (the standard first-touch /
  "receiving with the back foot" material used through the youth and grassroots pathways) treats
  first-touch failure as the **dominant** error class at amateur level and a **coachable, largely
  eliminated** one at professional level. Ranges quoted in coaching material for amateur adult
  football are commonly an order of magnitude worse than elite — a **0.15–0.30** band on
  contested receptions is the shape usually described, again without a standardised event
  definition.
* **⚠ WHAT NONE OF THESE SOURCES SUPPLIES.** A definition of "first-touch failure" that matches
  this engine's, a rate conditional on ball speed, or any decomposition of *why* a touch fails.
  The comparison is therefore **shape and order of magnitude only**, and it is a comparison
  against a **6v6, 240-second, arcade-tuned** world whose deviations from real football are
  deliberate (`VISION.md`).

## §DEV-PREFLIGHT — the sizing smoke, disclosed in full

A **12-cluster scratch smoke** (`BQC0_MODE=smoke BQC0_N=12`, seeds **900,002,900–911**, receipt
900,002,920, the curve pin at 900,002,970, the overhead bench on 900,002,940–951, gTraceInert on
900,002,980–981, gLockstep on 900,002,990–991, artifact off the canonical path at
`/tmp/bq-c0-smoke2.json`) was run **BEFORE this freeze**. Its realised half-widths were read out of
the smoke artifact's own `faces[].halfWidth` fields on the E arm — **never re-typed from the
console's rounded print** — and are hardcoded in the instrument's `SIZED_FACES` (the five rows in
§P.E's table).

**Disclosed honestly:**

* The first 12-cluster run went **RED on one gate**, an instrument defect fixed before this freeze
  and stated here so the record shows what moved and when: `gAnchoredConstants` — the pressure
  read `const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);` was pinned at **1**
  occurrence and `mechanics.ts` honestly carries **2** (`attemptFirstTouch`'s and a second
  body-contact site's). Fixed by pinning the NAMED site with its own **following** line (`let
  pFail = touchFailChance(`) **and** adding a second anchor that enumerates BOTH occurrences —
  the anchored-extraction and needle-count canon working exactly as intended: a wrong count is a
  RED gate, not a silent pass. After the fix the same 12-cluster smoke re-ran **15/15 GREEN**.
* ⭐ **THE CURVE, PINNED AT THE SMOKE**: `m.edsTouchCost` read **false** on a constructed match of
  **both** arms ⇒ **the census measures the BASE curve** `{span 8, weight 0.07}` and publishes the
  **HEAVY** one `{span 16, weight 0.24}` beside. This is the expected value of #382 item 6(i) and
  no deviation is triggered.
* ⭐ **THE TWO TRACES' OVERHEAD, MEASURED** (#382's run discipline asked for it). On 12 world-12
  empty-book matches per state, alternating ON/OFF three times each and discarding a warm-up pass:
  mean **93.055556 ms/match with both traces ON** against **92.777778 ms/match OFF** ⇒ an overhead
  of **0.277778 ms per match**. ⚠⚠ **That difference is smaller than this machine's own
  run-to-run spread** (the six raw repetitions ranged 91.333333 to 95.166667 ms/match), so the
  honest reading is that **the overhead is not resolvable at this sample** — it is a receipt that
  the traces are cheap, ⛔ never a football number and ⛔ never a claim that the overhead is
  exactly that value. The smoke's own `perf.meanWallSecondsPerMatch` was **0.093833** s ⇒ the full
  battery (998 seeds × 2 arms) is expected to take roughly **3.1 minutes** of walking plus the
  bootstrap, the bench and the two fixture suites.
* ⚠ **12 clusters is a NOISY variance estimate** — a strictly weaker assumption than sizing off a
  published battery. Said here, before the battery.
* ⚠ The smoke's own POINT readings are **UNPOWERED and bind nothing**. For the record, so nobody
  can claim the freeze was written after seeing a battery: on 12 scratch seeds the E arm read
  about 127 resolutions per match of which roughly four in seven were free traps, a realised
  intended-target fail share near 0.10 against a mean logged pFail near 0.10, term shares near
  0.10 floor / 0.38 speed / 0.39 pressure / 0.13 misalign on **38** failed intended-target
  adjudications, and the printed sentence was the **MIX** one on both arms with `calibrated` TRUE
  on E and FALSE on D. **None of these numbers is a finding**; the battery's own §R replaces every
  one of them, and a battery that printed a different sentence would be reported as-is. ⚠ Note
  especially that at **n = 38** the two leading term shares are inside each other's intervals —
  which is exactly why the battery is sized on those faces.
* The smoke ALSO confirmed instrument liveness: both arms carried rolled adjudications,
  intended-target entries, failures, BOTH free-trap branches, aftermath events and linked
  speed-source deliveries; `gRecomposition`'s `neither` class was **0** on both arms;
  `gTraceInert` and `gLockstep` were green on all their arm × scratch-seed walks; and
  `receipts.hashReproducesFromFile` read true off the written file.
* **This section binds nothing.** The freeze is §0–§P.G above.
