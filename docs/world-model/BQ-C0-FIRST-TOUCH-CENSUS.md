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
  mean **93.055556 ms/match with both traces ON** against **92.777778 ms/match OFF** (the smoke
  artifact's own `perf.traceOverhead` fields) ⇒ an overhead
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

## §R RESULTS (every number below QUOTES the artifact's own fields at 6 dp — the artifact
## is the numbers of record, per the #357 standing order)

**RUN RECEIPTS.** Freeze **`b0202b1`** (`stage.headAtRun` =
`b0202b1ab3d9f522756354e85a7ad3cf15a34640`).
`git diff b0202b1..<results> -- scripts/probes/bq-c0-*.ts` is **EMPTY (0 bytes)** — no frozen
constant, no frozen definition, no frozen rule and no frozen sentence moved after sight.
**15/15 gates green**; `gFaces` **771/771 face-and-Δ** checks and **66/66** stored-bin / median /
partition / READ-WORD / sizing checks re-derived from the SERIALIZED artifact off disk (the two
counts are the lengths of the artifact's own `gFacesDetail.faceChecks` and
`gFacesDetail.binChecks` arrays, every entry `ok`).
Artifact `docs/world-model/data/bq-c0-first-touch-census.json` — **compact JSON**,
**5,805,677 bytes**; `instrumentSha256 =
7f68afdf069352886118493c7b81fbc2da63d6d062efa3408a15ef409b2120bd`; `hashedBodySha256 =
b8249c5a8fa1e831f55fd20eea8b35685aa4a1cdb097217c232bbd4b0a584013`; the NON-body receipt
`receipts.hashReproducesFromFile` = **true**; **file byte-hash
`b1d7406bb70b3a6db93edd0b4b4a56572b95fb49ba3fb19ea07b0e25412130e5`**. Battery **998 seeds
(12,541,000–12,541,997) × 2 ARMS + the construction receipt at 12,541,999 ⇒ BOOKED = WALKED =
1,998 walks**; the **unwalked tail is DECLARED** (`seeds.unwalkedTail` = seed 12,541,998).
`gTraceInert` on scratch 900,002,980–981, `gLockstep` on 900,002,990–991, the curve pin on
900,002,970, the trace-overhead bench on 900,002,940–951, the sizing smoke on 900,002,900–911 —
every one STORED in the artifact's `seeds` block. **ZERO stats consumed** — registry **73**.
**63** anchored sites, **45** walk fixtures, **514** faces and **257** paired Δs (the lengths of
the artifact's own `anchoredSites` / `fixtures` / `faces` / `deltas` arrays).
`npm run typecheck` clean with the probe in the tree; `npm run fingerprint` =
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **the literal of record in
`tests/a4HomeGrant.test.ts`, UNCHANGED** (a census cannot move it). Wall **204.452 s**
(`perf.batteryWallSeconds`; `perf.meanWallSecondsPerMatch` **0.094443**).

**⭐⭐ THE CURVE OF RECORD.** `curve.pinnedEdsTouchCost` = **false** on a constructed match of
**both** arms and on **every** walked match (`gWorld`), so **THIS CENSUS MEASURED THE BASE CURVE**
`{span 8, weight 0.07}` and publishes the **HEAVY** curve `{span 16, weight 0.24}` beside, never
scored. This is #382 item 6(i)'s expected value; no deviation is triggered.

**THE PLUMBING RECEIPTS** (⛔ never quoted as football effect sizes). `gDoseSource` hashed the two
dose files this process read and both **MATCH THE PINNED VALUES** (l3 `a41a114c…37db`, pc
`0301d710…982f`). `gTraceInert`: both traces ON vs OFF gave byte-identical whole-match signatures
on every arm × scratch-seed pair. `gRecomposition`: `decomposition.recomposition.neither` is
**0.000000** on **both** arms and on the construction receipt — the shipped `touchFailChance`,
CALLED on each entry's own logged terms, reproduces the logged `pFail` bit-exactly (or exactly
0.45 × it) on **every one** of the 43,769 (E) and 52,990 (D) adjudications. Two more receipts read
**1.000000** on both arms: `population.entriesLinkedToResolutionShare` (every trace entry matched a
resolving `pendingControl`) and `population.relativeSpeedAgreementShare` (every linked entry's
logged `relativeSpeed` is bit-equal to the `PendingControlAttempt`'s own stored value). The two
traces' measured cost was **94.361111** ms/match ON against **92.944444** OFF ⇒ **1.416667** ms per
match, ⚠ still inside this machine's own spread across the six repetitions (91.833333 to
95.916667) — a receipt that the ledgers are cheap, never a resolvable number.

### §R1 THE POPULATION AND THE LIVE CALIBRATION

| face | E (12 empty-book) | D (12 dosed — the user's world) | Δ (D − E), 95 % paired CI |
|---|---|---|---|
| `population.resolutionsPerMatch` | **122.394790** | **129.758517** | +7.363727 [+6.292585, +8.509018] |
| `population.abandonedBeforeReadyShare` | 0.111320 | 0.145864 | +0.034544 [+0.017341, +0.051618] |
| ⭐⭐ `population.cell.rolled` | **0.358322** | **0.409192** | +0.050871 [+0.046992, +0.055022] |
| ⭐⭐ `population.freeTrapShare` | **0.580147** | **0.532877** | −0.047271 [−0.051264, −0.043516] |
| `population.cell.freeTrapSlow` | 0.551257 | 0.503849 | −0.047407 [−0.051517, −0.043470] |
| `population.cell.freeTrapGk` = `population.gkExemptionShare` | 0.028891 | 0.029027 | +0.000137 [−0.001318, +0.001666] · **CONTAINS ZERO** |
| ⛔ `population.cell.notReached` | 0.061531 | 0.057931 | −0.003600 [−0.005395, −0.001778] |
| `population.adjudicationsPerMatch` | **43.856713** | **53.096192** | +9.239479 [+8.608216, +9.936874] |
| `population.intendedTargetShare` | **0.655852** | **0.663540** | +0.007688 [+0.001454, +0.014573] |
| `population.intendedShareOfFailures` | 0.634753 | 0.639600 | +0.004847 [−0.014380, +0.024764] · **CONTAINS ZERO** |

⭐⭐ **MOST OF THE TIME THE WORLD DOES NOT ADJUDICATE AT ALL.** On the empty-book arm
**0.580147** of control-attempt resolutions are a FREE TRAP — the ball is slower than the law's own
6 m/s threshold (0.551257) or the body is a keeper (0.028891) — and a further **0.061531** never
reach `attemptFirstTouch` because the resolver's own pre-roll returns fire first. Only
**0.358322** of resolutions (43,769 of 122,150 on E) are actually rolled. Of those,
**0.655852** (28,706 of 43,769) are the man the pass was meant for.

**⭐⭐ THE ROLL'S LIVE CALIBRATION — E1a's I1 form, on the world the user plays.**

| face (INTENDED-TARGET adjudications) | E | D |
|---|---|---|
| ⭐⭐ `roll.intended.realisedFail` | **0.098620** [0.094935, 0.102123] | **0.103723** [0.100542, 0.106989] |
| ⭐⭐ `roll.intended.meanPFail` | **0.099024** [0.098445, 0.099614] | **0.102958** [0.102342, 0.103532] |
| `roll.intended.capHitShare` | **0.000000** | **0.000000** |
| `roll.all.realisedFail` | 0.101899 [0.098980, 0.104751] | 0.107605 [0.105046, 0.110190] |
| `roll.all.meanPFail` | 0.102199 | 0.107078 |
| `roll.all.capHitShare` | **0.000000** | **0.000000** |

⭐⭐ **THE COIN IS HONEST ON THE EMPTY BOOK AND MISSES BY A HAIR ON THE DOSED ONE.** On arm E the
realised fail share **0.098620** (2,831 of 28,706) sits INSIDE the bootstrap interval of the mean
logged pFail (**0.099024**, [0.098445, 0.099614]) ⇒ the stored boolean `reads.E.calibration.
calibrated` is **true**. On arm D the realised **0.103723** (3,647 of 35,161) sits just ABOVE the
interval of its mean (**0.102958**, [0.102342, 0.103532]) ⇒ `reads.D.calibration.calibrated` is
**false**. ⚠ Read that D result for what the frozen rule actually tested: the interval is the
interval of the **MEAN pFail**, which at n = 35,161 is very tight, so the rule is a demanding one
and a miss of this size is a **hair**, not a broken coin. ⛔ **The census does not adjudicate it**
— it prints the stored boolean.

**THE CALIBRATION PER pFail DECILE** (arm E, intended-target; `calibration.intended.decile.*`,
denominators in the table):

| decile (pFail band) | realised fail | mean logged pFail | n |
|---|---|---|---|
| d0 (0.00–0.04) | **0.047088** [0.034615, 0.062574] | 0.033358 | 807 |
| d1 (0.04–0.08) | 0.060628 [0.055990, 0.065396] | 0.062460 | 9,517 |
| d2 (0.08–0.12) | 0.099183 [0.093138, 0.105258] | 0.099152 | 10,042 |
| d3 (0.12–0.16) | 0.138019 [0.129186, 0.146599] | 0.137384 | 6,289 |
| d4 (0.16–0.20) | 0.168592 [0.152038, 0.185471] | 0.173505 | 1,904 |
| d5 (0.20–0.24) | 0.215278 [0.147059, 0.287879] | 0.211111 | 144 |
| d6 (0.24–0.28) | 0.000000 [0.000000, 0.000000] | 0.257153 | 3 |
| d7 · d8 · d9 | — | — | 0 |

⚠ **d0 IS THE ONE BAND WHERE THE REALISED RATE'S INTERVAL EXCLUDES THE LOGGED MEAN** on arm E
(0.033358 sits below [0.034615, 0.062574]); d6 holds **3** adjudications and d7–d9 hold none, so
neither reads as anything. ⛔ No null is cut on any of them.

### §R2 ⭐⭐ THE TERM DECOMPOSITION AND THE MAJORITY TERM

**The mean share of `raw` carried by each term over FAILED INTENDED-TARGET adjudications** —
denominators **2,831** (E) and **3,647** (D):

| term | E | D | Δ (D − E) | \|Δ\|÷hw |
|---|---|---|---|---|
| `floor` (the constant 0.01) | **0.098087** [0.096654, 0.099646] | **0.093961** [0.092776, 0.095275] | −0.004125 [−0.006119, −0.002208] | 2.109601 |
| ⭐ `speed` | **0.369996** [0.363470, 0.377124] | **0.324672** [0.319160, 0.330332] | −0.045324 [−0.053743, −0.036937] | **5.393670** |
| ⭐ `pressure` | **0.373347** [0.365263, 0.381215] | **0.420079** [0.412574, 0.426859] | +0.046732 [+0.036439, +0.057294] | **4.481528** |
| `misalign` | **0.158570** [0.152233, 0.164783] | **0.161288** [0.156143, 0.166691] | +0.002718 [−0.005484, +0.010807] · **CONTAINS ZERO** | 0.333638 |
| `multiplierMean` (1.3 − 0.85·technique) | 0.985532 | 0.981661 | −0.003871 [−0.011039, +0.003298] · **CONTAINS ZERO** | 0.540022 |
| `meanRaw` | 0.114693 | 0.119262 | +0.004570 [+0.002873, +0.006291] | 2.673925 |

**THE MAJORITY BOOLEANS, STORED** (`reads.E.majority` / `reads.D.majority`): on **both** arms
`floor`, `speed`, `pressure` and `misalign` are ALL **false**; `noMajority` is **true** on both;
`majorityTerm` is **`noMajority`** on both. ⛔ Nothing was cut after sight — the booleans are the
frozen rule (mean share > 0.5) applied to the stored shares, and `gReadWords` re-derives every one
of them off the serialized artifact.

⭐⭐ **NO SINGLE FACE OF THE COIN IS HEAVY ENOUGH TO CARRY IT — AND THE TWO THAT MATTER SWAP
PLACES BETWEEN THE ARMS.** On the empty book the speed term carries **0.369996** and the pressure
term **0.373347** of `raw` over the 2,831 failures, and their intervals overlap across most of
their length ([0.363470, 0.377124] against [0.365263, 0.381215]); in **the world the user plays**
the pressure term rises to **0.420079** and the speed term falls to **0.324672**, both resolved
(4.481528 and 5.393670 half-widths). The blind-side term is a steady sixth on both arms (0.158570 /
0.161288) and the floor a steady tenth (0.098087 / 0.093961). ⛔ **The frozen rule prints the MIX
sentence and the census stops there.**

**THE SAME TABLE OVER THE OTHER THREE POPULATIONS** (the shares are of `raw`; each cell's
denominator is its own population's count, stored in the artifact):

| population (E arm) | floor | speed | pressure | misalign |
|---|---|---|---|---|
| FAILED intended-target (n = 2,831) | 0.098087 | 0.369996 | 0.373347 | 0.158570 |
| ALL intended-target (n = 28,706) | 0.112066 | **0.392070** | 0.317173 | 0.178690 |
| FAILED all bodies (n = 4,460) | 0.093978 | 0.358815 | **0.417540** | 0.129667 |
| ALL all bodies (n = 43,769) | 0.111423 | 0.374407 | 0.371180 | 0.142990 |

⚠ **THE POPULATION MOVES THE MIX, WHICH IS WHAT A CONDITIONAL SHARE DOES.** Conditioning on
FAILURE raises the pressure term's share and lowers the speed term's on both cuts (compare the
first row against the second, and the third against the fourth, all on arm E) — a failure is more
likely to have come from a touch the pressure term made expensive. ⛔ That is an ASSOCIATION
inside the roll's own arithmetic, not a cause, and no read word rests on it.

**THE MULTIPLIER AND THE CAP DID NOT MOVE ANYTHING.** `roll.intended.capHitShare` and
`roll.all.capHitShare` are **0.000000** on BOTH arms — **the law's own cap of 0.4 never bound
once** in 43,769 (E) or 52,990 (D) adjudications, so the census's §P.B statement that the cap
cannot move a share is not merely an argument here, it is vacuously true on this battery. The
technique multiplier's mean is **0.985532** (E) and its bin-derived median is **0.95**, and being
purely multiplicative on `raw` it cannot move a share at all.

### §R3 THE MARGINALS AND THE TERM DISTRIBUTIONS

**P(fail | bin)** on INTENDED-TARGET adjudications, arm E, with each bin's own n
(`marginals.<term>.b<i>.pFailRate` and `.share`; empty bins omitted, ⛔ no null cut on them):

| `relativeSpeed` (2 m/s bins) | 6–8 | 8–10 | 10–12 | 12–14 | 14–16 | 16–18 | 18–20 | 20–22 | 22–24 | 24+ |
|---|---|---|---|---|---|---|---|---|---|---|
| P(fail) | 0.082609 | 0.093777 | 0.100153 | 0.113311 | 0.108731 | 0.111789 | 0.146154 | 0.166667 | 0.142857 | 0.137255 |
| n | 4,600 | 9,224 | 7,828 | 4,395 | 1,821 | 492 | 130 | 60 | 105 | 51 |

| `pressure` (0.1 bins) | 0.0–0.1 | 0.1–0.2 | 0.2–0.3 | 0.3–0.4 | 0.4–0.5 | 0.5–0.6 | 0.6–0.7 | 0.7–0.8 | 0.8–0.9 |
|---|---|---|---|---|---|---|---|---|---|
| P(fail) | **0.067295** | 0.072248 | 0.083712 | 0.107090 | 0.095524 | 0.127560 | 0.126534 | 0.130174 | **0.131718** |
| n | 9,228 | 1,744 | 1,983 | 2,045 | 2,167 | 2,344 | 2,608 | 2,996 | 3,591 |

| `misalign` (0.1 bins) | 0.0–0.1 | 0.1–0.2 | 0.2–0.3 | 0.3–0.4 | 0.4–0.5 | 0.5–0.6 | 0.6–0.7 | 0.7–0.8 | 0.8–0.9 | 0.9–1.0 |
|---|---|---|---|---|---|---|---|---|---|---|
| P(fail) | 0.097965 | 0.104531 | 0.095456 | 0.090490 | 0.095238 | 0.098889 | 0.096283 | 0.103806 | 0.109870 | 0.101920 |
| n | 10,269 | 3,664 | 2,839 | 2,387 | 2,142 | 1,891 | 1,641 | 1,445 | 1,074 | 1,354 |

| `dribbling` (0.1 bins) | 0.0–0.1 | 0.1–0.2 | 0.2–0.3 | 0.3–0.4 | 0.4–0.5 | 0.5–0.6 | 0.6–0.7 |
|---|---|---|---|---|---|---|---|
| P(fail) | 0.200000 | **0.119164** | 0.117711 | 0.105328 | 0.091379 | 0.080323 | **0.077279** |
| n | 5 | 4,926 | 4,613 | 4,899 | 4,837 | 4,457 | 4,969 |

| `positioning` (0.1 bins) | 0.1–0.2 | 0.2–0.3 | 0.3–0.4 | 0.4–0.5 | 0.5–0.6 | 0.6–0.7 |
|---|---|---|---|---|---|---|
| P(fail) | 0.105446 | 0.102686 | 0.095847 | 0.099328 | 0.099959 | 0.088508 |
| n | 4,884 | 4,616 | 4,695 | 4,762 | 4,902 | 4,847 |

⭐⭐ **THE BLIND SIDE IS THE ONE TERM WHOSE MARGINAL DOES NOT MOVE.** Every rate in this
paragraph is a `marginals.*.pFailRate` face from the tables above, and each carries its own bin's
n. On arm E the `misalign` column spans **0.090490** (n = 2,387) to **0.109870** (n = 1,074), with
its largest bin reading **0.097965** (n = 10,269); the `pressure` column spans **0.067295**
(n = 9,228) to **0.131718** (n = 3,591); the `relativeSpeed` column spans **0.082609** (n = 4,600)
to **0.166667** (n = 60). The blind side's span is the narrowest of the three. ⚠ These are **raw
marginals on
observational cells** — every one of them pools whatever else was true at that moment — so the
honest statement is that in this world's *realised distribution*, taking the ball on the blind side
does not separate outcomes the way pressure and pace do. It is NOT a statement that the misalign
term is inert in the formula: it carries 0.158570 of `raw` over failures.

**THE DISTRIBUTIONS** (the same bins' own `share` faces, arm E): `relativeSpeed` is concentrated
in 8–10 m/s (0.321327) and 10–12 (0.272696) with a bin-derived median of **10** m/s; `pressure` is
bimodal — 0.321466 of intended-target adjudications happen with the nearest opponent beyond the
law's own 6 m pressure radius (bin 0.0–0.1) and 0.125096 in the top occupied bin — median
**0.30**; `misalign` is front-loaded (0.357730 in 0.0–0.1), median **0.20**; `dribbling` median
**0.30** and `positioning` median **0.40**.

### §R4 THE OTHER CURVE, THE CAP, THE OWN-TOUCH CLASS, THE `miscontrols` CROSS-CHECK

| face | E | D | Δ (D − E) |
|---|---|---|---|
| ⭐ `otherCurve.intended.meanPFail` (**heavy**) | **0.127416** [0.126693, 0.128148] | **0.128484** | +0.001068 [+0.000338, +0.001790] |
| ⭐ `otherCurve.all.meanPFail` (**heavy**) | **0.132604** | **0.135613** | +0.003009 [+0.002337, +0.003675] |
| `decomposition.recomposition.exact` | 0.990313 | 0.994508 | +0.004196 [+0.003033, +0.005223] |
| `decomposition.ownTouchShare` (= `…recomposition.ownTouch`) | **0.009687** | **0.005492** | −0.004196 [−0.005212, −0.003032] |
| `decomposition.recomposition.neither` | **0.000000** | **0.000000** | 0.000000 |
| `decomposition.dribbleTagAgreementShare` (receipt) | 0.990747 | 0.994773 | +0.004026 |
| `miscontrols.statPerMatch` | **4.514028** | **5.764529** | +1.250501 [+1.053106, +1.453908] |
| `miscontrols.traceFailsPerMatch` | **4.468938** | **5.713427** | +1.244489 [+1.045090, +1.447896] |
| `miscontrols.gapPerMatch` | **0.045090** | 0.051102 | +0.006012 [−0.013026, +0.026052] · **CONTAINS ZERO** |

⭐ **WHAT E1b's HEAVY CURVE WOULD HAVE SAID, ON THE SAME LOGGED TERMS.** Its mean pFail on
intended-target adjudications is **0.127416** against the live **0.099024** on arm E — a rise of
**0.028392** (stated derivation: `otherCurve.intended.meanPFail` minus `roll.intended.meanPFail`,
both arm E, both quoted above). Its bin-derived median pFail is **0.12** against the live **0.09**.
⛔ **THIS IS AN EXPECTATION UNDER A COUNTERFACTUAL CURVE — no coin was tossed at those values, it
is NOT a predicted fail rate, it is NOT scored, and NOTHING here recommends arming it.**

**THE `miscontrols` CROSS-CHECK AGREES, AND ITS GAP IS THE ONE THE ANCHORS PREDICTED.** The
engine's own team stat reads **4.514028** per match on arm E against the ledger's **4.468938**
failed adjudications — a gap of **0.045090** per match (`miscontrols.gapPerMatch` on arm E:
numerator **45** stat increments with no trace entry, denominator **998** matches; the stat's own
whole-battery total is 4,505 and the ledger's is 4,460). The gap's SIGN is positive and its cause is anchored, not guessed: `.stats.miscontrols++` has **exactly
two** sites in `mechanics.ts` and both are enumerated by `gAnchoredConstants` —
`attemptFirstTouch`'s (which pushes a trace entry) and **`tryChestTrap`'s (which does not)**. The
chest trap is a different act on a dropping ball, it prices itself with the same
`touchFailChance` plus its own additive term, and it spills without ever touching this ledger.

**THE OWN-TOUCH CLASS IS SMALL AND EXACT.** `decomposition.ownTouchShare` is **0.009687** on arm E
(424 of 43,769 adjudications) — a re-collected own touch paying the anchored ×0.45. It is detected
**arithmetically** from the ledger's own logged pFail; the independent END-OF-TICK `dribbleTouch`
read agrees on **0.990747** of adjudications, which is a receipt on a mutable field and not a
correction to the arithmetic.

### §R5 THE FAIL'S AFTERMATH

The settle ladder at **+K = 3 ticks** (read off `CONTACT_CONTROL_DELAY_TICKS` at its own
`readyTick` site), read from the FAILED RECEIVER'S own side. Denominators: **2,831** failed
intended-target and **4,460** failed adjudications on E; **3,647** and **5,702** on D.

| ladder cell | intended E | all E | intended D | all D |
|---|---|---|---|---|
| `sameSide` | **0.000000** | **0.000000** | **0.000000** | **0.000000** |
| `opponent` | **0.000000** | **0.000000** | **0.000000** | **0.000000** |
| ⭐⭐ `loose` | **1.000000** | **1.000000** | **1.000000** | **1.000000** |
| `out` | **0.000000** | **0.000000** | **0.000000** | **0.000000** |
| `unresolved` | **0.000000** | **0.000000** | **0.000000** | **0.000000** |

⭐⭐ **A FAILED FIRST TOUCH LEAVES THE BALL LOOSE — AS A STORED VALUE, ON EVERY CELL OF THIS
TABLE.** `aftermath.intended.loose` and `aftermath.all.loose` are **1.000000** on both arms
(2,831 of 2,831 and 4,460 of 4,460 on E; 3,647 of 3,647 and 5,702 of 5,702 on D), and every other
cell of the ladder is **0.000000**. ⚠ Read it with the mechanism the anchors show rather than as a
surprise: the failure branch knocks the ball away at 3.5–6.5 m/s and sets the receiver's
`kickCooldown` to 0.5, and K is three ticks — **the window is too short for anyone to have picked
it up yet**, so this face says *"three ticks later it is still on the floor"*, ⛔ **not** *"the
opponent never gets it"*. Who eventually wins the loose ball is BN-C0's question and this census
does not answer it. `aftermath.intended.failsPerMatch` is **2.836673** (E) / **3.654309** (D).

**THE KNOCK SPEED** (bins of 0.5 m/s, arm E, intended-target failures): every one of the 2,831
knocks lands in the six bins spanning **3.5–6.5 m/s** — the counts are 474 · 485 · 472 · 506 · 434
· 460 and every other bin is zero — with a bin-derived median of **4.5** m/s. That is the anchored
`rng.range(3.5, 6.5)` line reading back exactly, one tick of physics later.

### §R6 THE SPEED SOURCE (launch speed · distance · power)

| face | E | D | Δ (D − E) |
|---|---|---|---|
| `speedSource.linkedShare` (receipt) | **1.000000** | **1.000000** | 0.000000 |
| `speedSource.groundLaunchShare` | 0.976555 | 0.978357 | +0.001801 [−0.000394, +0.004223] · **CONTAINS ZERO** |
| `speedSource.meanLaunchSpeed` | **16.430632** m/s | **16.115938** m/s | −0.314695 [−0.372743, −0.258970] |
| `speedSource.meanDistance` | **15.876392** m | **15.096745** m | −0.779648 [−0.890293, −0.670754] |
| ⭐⭐ `speedSource.powerStruckAtChosenPerMatch` | **0.000000** | **0.000000** | 0.000000 |

⭐⭐ **`powerAlwaysOne` IS TRUE, AND IT IS STORED TWICE OVER.** The engine's own
`pwChooserLedger.struckAtChosenPower` — *"strikes that reached `performPass` carrying a
non-default weight"* — reads **0.000000** per match on **every** walked match of **both** arms, and
every `performPass(` call site is enumerated by `gAnchoredConstants` and passes no weight or the
literal `1`. `reads.powerAlwaysOne` is **true**. ⇒ **C1-A's power lever is dormant in the world the
user plays, exactly as `PASS-POWER-SLICE` §8 says**, and #382 item 4(iv)'s reading stands: pass
weight reaches the intended receiver ONLY through this roll's speed term.

**P(fail | launch-speed bin)**, arm E, intended-target adjudications with their n
(`speedSource.launchBin.b<i>.pFailRate`; the bin-derived median launch speed is **14** m/s and the
median passer→target distance **10** m):

| launch speed | 10–12 | 12–14 | 14–16 | 16–18 | 18–20 | 20–22 | 22–24 |
|---|---|---|---|---|---|---|---|
| P(fail) | 0.097522 | 0.093255 | 0.087059 | 0.095259 | 0.106848 | 0.109261 | 0.119438 |
| n | 3,148 | 4,611 | 6,352 | 4,451 | 3,023 | 5,885 | 854 |

⚠ **THE CURVE IN LAUNCH SPEED IS SHALLOW AND NOT MONOTONE** across the seven bins that hold
essentially all the mass: it dips to 0.087059 in the 14–16 m/s bin before climbing to 0.119438 in
the 22–24 bin. Two things are pooled in that shape and this census separates neither: the launch
speed is not the arrival speed (friction eats it over a flight whose length varies), and a harder
pass is chosen in different situations. The **relative-speed** marginal in §R3 — which IS the term
the law reads — is the cleaner column, and it rises from 0.082609 to 0.166667 across its occupied
bins.

### §R7 THE DOSED ARM BESIDE (paired Δ, D − E)

The dosed arm is the world the user plays. Its headline reads are printed above at the same
precision; the places where it differs resolvedly, ordered by \|Δ\|÷half-width:

| face | Δ (D − E) | 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|
| ⭐⭐ `population.adjudicationsPerMatch` | **+9.239479** | [+8.608216, +9.936874] | **13.907994** |
| ⭐⭐ `population.cell.rolled` | **+0.050871** | [+0.046992, +0.055022] | **12.669561** |
| ⭐⭐ `population.freeTrapShare` | **−0.047271** | [−0.051264, −0.043516] | **12.202933** |
| `population.cell.freeTrapSlow` | −0.047407 | [−0.051517, −0.043470] | 11.783088 |
| ⭐ `decomposition.intendedAll.speed.meanShare` | −0.034814 | [−0.037973, −0.031604] | 10.931949 |
| ⭐ `decomposition.intendedAll.pressure.meanShare` | +0.039745 | [+0.036113, +0.043585] | 10.638843 |
| `roll.all.meanPFail` | +0.004879 | [+0.004397, +0.005371] | 10.023760 |
| `context.interceptionsPerMatch` | +3.988978 | [+3.521042, +4.431864] | 8.759076 |
| ⭐ `roll.intended.meanPFail` | +0.003934 | [+0.003394, +0.004539] | 6.871081 |
| ⭐ `miscontrols.statPerMatch` | +1.250501 | [+1.053106, +1.453908] | 6.240000 |
| ⭐ `context.goalsPerMatch` | −0.786573 | [−0.932866, −0.647295] | 5.508772 |
| ⭐ `decomposition.intendedFailed.speed.meanShare` | −0.045324 | [−0.053743, −0.036937] | 5.393670 |
| ⭐ `decomposition.intendedFailed.pressure.meanShare` | +0.046732 | [+0.036439, +0.057294] | 4.481528 |
| `roll.intended.realisedFail` | +0.005102 | [+0.000472, +0.009812] | 1.092651 |
| `population.intendedShareOfFailures` | +0.004847 | [−0.014380, +0.024764] | 0.247640 · **CONTAINS ZERO** |
| `decomposition.intendedFailed.misalign.meanShare` | +0.002718 | [−0.005484, +0.010807] | 0.333638 · **CONTAINS ZERO** |

⭐⭐ **THE DOSE MAKES THE WORLD ASK THE QUESTION MORE OFTEN, AND MAKES PRESSURE THE ANSWER MORE
OFTEN.** With matured recognition and defence books the number of rolled adjudications per match
(`population.adjudicationsPerMatch`, denominator 998 matches per arm) rises by **9.239479**
(13.907994 half-widths) and the free-trap share (`population.freeTrapShare`, denominator
control-attempt resolutions — 122,150 on E and 129,499 on D) falls by **0.047271** (12.202933) —
more balls arrive fast enough to be adjudicated at all — while the pressure term's mean share of
`raw` over failures (`decomposition.intendedFailed.pressure.meanShare`, denominators 2,831 on E and
3,647 on D) rises by **0.046732** (4.481528) and the speed term's falls by **0.045324**
(5.393670).
⛔ **The printed sentence does not move**: both arms store `noMajority`, so
`reads.dosedAgreesOnMajorityTerm` is **true**. ⚠ `population.intendedShareOfFailures`,
`decomposition.intendedFailed.misalign.meanShare`, `population.gkExemptionShare` and
`miscontrols.gapPerMatch` all have intervals **containing zero** — unresolved at this power, never
"no difference".

### §R8 THE READS, PRINTED

Selected on the **E** arm's stored booleans by the frozen §P.C rules, from the frozen §0 literals,
and re-derived off the serialized artifact by `gReadWords`:

> **"THE FIRST TOUCH FAILS ON A MIX — the commander decides with the table."**

> **"THE ROLL IS CALIBRATED ON WORLD 12"**

> **"THE DOSED WORLD AGREES ON THE MAJORITY TERM"**

(`reads.E.majorityTerm` = `noMajority`; `reads.D.majorityTerm` = `noMajority`;
`reads.dosedAgreesOnMajorityTerm` = **true**; `reads.E.calibration.calibrated` = **true**;
`reads.D.calibration.calibrated` = **false**; `reads.powerAlwaysOne` = **true**.)

⚠ Read the MIX sentence with §R2's table in front of it. The frozen rule asked whether ONE face of
the coin carries more than half of `raw` over the failures, and none does: on arm E the four shares
are 0.098087 · 0.369996 · 0.373347 · 0.158570 on the same 2,831 failures. What the table says
instead is that **two terms carry roughly three-quarters of it between them and they trade places
between the arms**, that the blind-side term is a steady sixth whose realised marginal barely
moves, and that the floor — a constant nobody chose for football reasons — is a steady tenth.
⛔ **The census adjudicates nothing beyond printing the sentences**; the commander rules with the
table, and #382 item 6(iv) reserves the ratification of §P.G's citations to him.

## §HONEST LIMITS

1. **⭐⭐ THE TERMS ARE THE LEDGER'S, AND THE LEDGER IS ONE TICK'S STATE.** Every number in the
   decomposition comes from the engine's own record of the exact values the coin used — that is
   the census's strength — but those values were computed at ONE instant: the pressure is the
   nearest opponent's distance at the readyTick, the misalign is the receiver's heading at the
   readyTick. A defender who arrived a tick later, or a receiver who was still turning, is
   invisible to the roll and therefore to this census.
2. **⭐⭐ THE DECOMPOSITION IS OF `raw`, BEFORE THE MULTIPLIER AND BEFORE THE CAP, AND THAT IS
   ATTRIBUTED EXPLICITLY.** Both act on the PRODUCT: `1.3 − 0.85 · technique` scales all four
   addends equally and so cannot move a share by construction, and the cap truncates the product
   rather than the mix. On this battery the cap is not merely harmless but **never binds**
   (`capHitShare` 0.000000 on both arms), and the multiplier's mean is 0.985532 on arm E. ⇒ the
   shares in §R2 ARE the shares of the delivered pFail. A future world where the cap bites — a
   heavier curve, a harder passing game — would break that equivalence, and this limit is where
   that is written down.
3. **⭐⭐ ASSOCIATIONS, NOT CAUSES.** Every P(fail | bin) here is a conditional share on
   observational cells of one engine. "Pressure separates outcomes and the blind side does not" is
   a statement about THIS world's realised joint distribution, not about the terms' independent
   effects — the five terms co-vary (a ball played into pressure is a ball played into a crowd,
   and a receiver under pressure has been turning). ⛔ Nothing in this census is an A/B and nothing
   is scored.
4. **⭐⭐ THE MIX READ IS A PROPERTY OF THE FROZEN RULE, NOT A FINDING ABOUT FOOTBALL.** A
   majority threshold of 0.5 on four terms whose shares sum to 1 is a demanding bar; two terms
   sitting near 0.37 each on arm E produce `noMajority` exactly as they should. ⛔ The census does
   NOT report "no term matters"; it reports that no term is more than half, and publishes all four
   with their intervals so the commander can rank them himself.
5. **⚠ THE `notReached` CLASS IS NOT A FREE TRAP AND IS NOT A FAILURE.** 0.061531 of resolutions on
   arm E never reach `attemptFirstTouch` (a missing / sent-off / stunned body, or the retention
   margin). #382 item 6(ii) described the free traps as "resolutions minus trace entries"; that
   identity is **not** the free traps alone, and this census publishes the third class with its
   own share rather than folding it in — a declared deviation, item 3 of §DEVIATIONS below.
6. **⚠ THE AFTERMATH WINDOW IS THREE TICKS.** `aftermath.*.loose` = 1.000000 says the ball is
   still on the floor at +K, ⛔ **not** that the opponent never gets it. K is the control-attempt
   law's own delay and it is the right window for "did the touch stick", but it is far too short
   for "who won the second ball". That question belongs to BN-C0's settle ladder on a longer
   horizon, and no instrument here supplies it.
7. **⚠ THE SPEED SOURCE IS A RECONSTRUCTION, AND THE ENGINE RECORDS NO POWER.** The launch speed
   is |ball.vel| at the end of the release tick and the distance is passer→target at that tick,
   because `pendingPass` stores neither (its shape is anchored). The strike's own `d` is measured
   to the LED point, so this census's distance is systematically the shorter of the two. The
   `powerAlwaysOne` boolean rests on the engine's OWN `struckAtChosenPower` counter PLUS an
   enumerated call-site census of `src/` — the second half is a text census, not a runtime
   observation, and it is declared as such at §P.B.
8. **⚠ THE `miscontrols` GAP IS EXPLAINED, NOT ELIMINATED.** 0.045090 stat increments per match on
   arm E have no trace entry, and both writer sites are anchored, so the chest trap is the named
   cause. ⛔ This census does not instrument the chest trap and cannot prove that it accounts for
   the whole gap — it proves the gap's size, its sign and the existence of exactly one other
   writer.
9. **⚠ THE REALITY ANCHOR IS CITED FROM MEMORY, NOT FETCHED** (§P.G). This session had no web
   access and no literature database. Every range there is an executor's recollection of public
   football-analytics and coaching reporting, stated as a range, with no page reference and no
   standardised event definition behind it. ⛔ It is a comparison the commander reads and
   ratifies, and it is a rule, gate, target or tolerance for exactly nothing.
10. **⚠ BOTH SIDES ARE POOLED, AND BOTH BODIES.** The population is every control-attempt
    resolution by either team; no face separates the two sides. The primary cut is the intended
    target, with all bodies published beside — a world where one side's receiving differs from the
    other's would be invisible to every number above.
11. **⚠ 12 SCRATCH CLUSTERS SIZED THIS BATTERY**, and #382 item 6's own cap fixed N at 998
    regardless. The realised half-widths at 998 on the five sized faces came in at 0.001496 ·
    0.006827 · 0.007976 · 0.006275 · 0.003594, all inside the declared 0.02 target and, as it
    turned out, inside the 0.01 one too — but the sizing table was frozen on the smoke's noisier
    estimate and is published as it was frozen. Every small cell — the CAP-HIT class (0 on both
    arms), the own-touch class, decile d6 (n = 3), the tail marginal bins — is reported with its
    own realised interval, and ⛔ **no null is cut anywhere in this census**: an interval containing
    zero reads *"unresolved at this power"*, never *"no difference"*.
12. **⛔⛔ A CENSUS ADJUDICATES NOTHING — AND THIS ONE ESPECIALLY DOES NOT SAY THE COIN IS WRONG.**
    It reads the engine's own ledger, decomposes the number the coin used, checks the coin against
    its own declared weight, and prints frozen sentences. It does **not** say a chance roll is the
    wrong FORM for a first touch, does **not** recommend arming E1b's heavy curve (whose
    counterfactual mean is published precisely so nobody mistakes it for a proposal), does **not**
    rank the four terms beyond publishing their shares, and ships **nothing**: no world is cut, no
    flag is armed, the fingerprint is unchanged and the user's world-12 play-test gate remains the
    user's.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. **THE PRIVATE-FIELD READ.** `Match.pendingControl` is `private` and the engine publishes no
   mirror, so the population is read through a TypeScript TYPE VIEW — a read, never a write,
   proven byte-inert by `gLockstep`. #382 item 6(ii) said "count it from public state"; this is the
   nearest honest thing to that and it is declared at §P.B rather than glossed.
2. **THE POPULATION IS OBSERVED AT TICK BOUNDARIES.** A resolution is a `pendingControl` that ENDS
   at a tick at or after its `readyTick`. `resolvePendingControlAttempt` "reaching its body" is not
   observable from outside the step; this is the observable form of it, and the class that ends
   EARLIER (`abandonedBeforeReadyShare`) is published separately.
3. **THE FREE-TRAP IDENTITY IS THREE-WAY, NOT TWO-WAY** — HONEST LIMIT 5. `notReached` is
   published as its own class.
4. **THE OWN-TOUCH CLASS IS DETECTED ARITHMETICALLY**, from the ledger's own logged pFail, rather
   than from `match.dribbleTouch` (which #382 item 6(ii) offered as an alternative): the tag is
   mutable within the tick. The `dribbleTouch` read is published as a cross-check receipt at
   0.990747 agreement (E).
5. **THE SIZING TARGET IS A DECLARED 0.02**, with the 0.01 target published beside on the same five
   faces because the block cannot afford it on the pressure share (2,325 clusters required). #382
   item 6(vi) left the half-width to the smoke to name; it named this one.
6. **THE REALITY ANCHOR IS CITED WITHOUT WEB ACCESS** — HONEST LIMIT 9, and #382 item 6(iv)'s own
   "with the caveat of its access" clause.
7. **THE TRACE-OVERHEAD MEASUREMENT IS NOT RESOLVABLE** at 12 matches per state on this machine
   (1.416667 ms/match against a 91.833333–95.916667 spread across six repetitions). Reported as
   measured rather than re-run until it looked clean.
