# BF T0 — THE DORMANT FACING-COST LAW (背着跑、侧着跑，跑不出全速)

> **Authorized by COMMANDER RULING #374 item 5, amended by RULING #375** (the RC-T0 / RA-T0
> form; scope bound at the rulings, the exact forms frozen here). **Binding contract:**
> [`BF-BODY-FACING-CONTRACT.md`](BF-BODY-FACING-CONTRACT.md) §2 **M-BF.1** (the facing
> factor) · **M-BF.2** (agility bites — ⭐ **HELD**, ruling #375 item 2) · **M-BF.3** (nothing
> else changes; Road B) · **M-BF.4** (the coupling to RC: RC-T0b comes after this stage).
>
> **Lineage.** RC-C0b (#373) found that a body's `heading` is written after its position and
> never read back into motion — two identical bodies driven at one target for 120 ticks cover
> the SAME distance with one facing 90° off (ratio exactly 1). #373 bound the BF contract;
> [`BF-C0-MOVEMENT-FACING-CENSUS.md`](BF-C0-MOVEMENT-FACING-CENSUS.md) sized the blast radius
> and re-ran that fixture at its own head; #374 item 4 froze **THE LAW OF RECORD**; #375
> corrected the attribute reading and cut the depth to ONE FLAT number. **This stage builds
> that law behind a shut door and nothing else.**
>
> ⛔ **THIS STAGE SHIPS NOTHING** (Road B): `bfFacingCost` is default OFF, never env- or
> bundle-armed, named by NO world and NO preset (`a4World.ts` contains neither `bfFacingCost`
> nor `facingDepth`); no gene is born; the production fingerprint is UNCHANGED — `npm run
> fingerprint` = the literal of record
> **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** at the seam commit.
> ⛔ **World 12's composition and bytes are untouched** — the user's play-test still compares
> like with like. The entry rung is a later stage's business, after BF-T1 and the user's gate.
> **ZERO sims of record; registry 73; scratch 900,002,400–499 only.** `npm run build` was NOT
> run: no bundle path changes (the seam adds one src module reachable only from `Match` and
> `Player`, and no entry layer names it).

## §1 THE MECHANISM (what armed means)

Armed (`bfFacingCost: true`), every body of both teams carries a **facing depth**, and inside
`Player.physicsStep` — **BEFORE** the top-speed clamp and the accel approach — its INTENDED
velocity is scaled by how far its heading is from where it intends to go:

```text
cos φ  = facingCosine(heading, unit(desiredVel))      [degenerate ⇒ 1 = no penalty]
f      = facingFactor(cos φ, D) = 1 − D · (1 − max(cos φ, 0))
desiredVel ← desiredVel · f            (both components by the SAME f: the DIRECTION of the
                                        intent never moves; |desiredVel| ≈ 0 ⇒ f = 1)

D = BF_DEPTH = 1 − BF_OFF_HEADING_FRACTION = 1 − 0.70 = 0.30      (ONE flat depth, #375 item 2)
```

⭐ **THE SHAPE IS THE ENGINE'S OWN.** `facingFactor` is the cosine misalignment family the BK
facing law already uses (`kickMisalignment = (1 − cos θ)/2`, `src/sim/mechanics.ts`) — **flat
near 0° and saturating at 90°**, which is ruling #374 item 4(i)'s exact requirement:
`f(φ) = 1 − D·(1 − cos(min(φ, π/2)))`. On the cosine there is no `acos` in the loop:
`min(φ, π/2)` is `max(cos φ, 0)`. Re-derived by the pins, never typed: **f(7.5°) = 0.99743**,
**f(45°) = 0.91213**, **f(≥ 90°) = 0.70 = `BF_OFF_HEADING_FRACTION`**.

⭐ **THE ONE RATIFIED CONSTANT** is `k = 0.70` (#374 item 4(ii) — "k = 1 − D = 0.70 on BOTH
sides (lateral = back), the one figure the literature supports on both directions at one
remove"; BF-C0 §R4: backward ≈ 0.70–0.74 verified at one remove, lateral ≈ two thirds, the
ordering NOT established). `BF_DEPTH` is **DERIVED** from it in one line and 0.30 is never
typed as a literal anywhere in `src/`.

**The football sentence**: 「背着跑、侧着跑，跑不出全速」 — 而且直到身体转过来之前，改变方向
本身就要付速度。

⭐⭐ **THE PRICE LANDS ON THE INTENT, NOT ON A STEERING RULE** (#374 item 4(iv)). Because
`physicsStep` scales `desiredVel` and then runs the shipped clamp and accel approach unchanged,
one rule covers all three cases the census found: a slow off-heading DRIFT pays; a DIRECTION
CHANGE pays until the heading catches up at `TURN_RATE` (BF-C0 §CORR 4: **96.5 %** of outfield
misalignment is that lag); and a STANDING TURN pays by construction — a body facing 180° from
its intent starts at 0.70 of it and rises to 1 as the heading integrates, closing #374 item
3(h)'s hole (the census's 0.5 m/s floor excluded standing turns) without a second rule.

⛔ **NOTHING ELSE CHANGES** (M-BF.3). `TURN_RATE` = 6.5 is untouched and the heading-rotation
block is byte-identical to the dispatch HEAD (pinned). Every one of the **57 `faceTarget`
occurrences in 8 files** BF-C0 §R3 mapped is unchanged — not one line moved (pinned by
recount). No executor is told to face differently; no ball, shell, contact or perception law is
touched; no attribute is added (M-BF.2 HELD) and no existing attribute is pressed into service
as a proxy; no gene is born; no rng is drawn.

⭐⭐ **THE SHIPPED PATH EXECUTES NO NEW ARITHMETIC** (#375 item 3). The flag never reaches the
physics loop: `Match` writes a PER-BODY NUMBER, `Player.facingDepth`, which is **0** unless the
match was constructed with the door open. `physicsStep`'s only new statement on the shipped
path is `if (this.facingDepth > 0) { … }` — it reads a field and compares it, and everything
below is the incumbent code, character for character. G-OFF PROVES it rather than asserting it:
whole-match signatures on the bare world and on world 12's composition, absent ≡ explicit-false,
byte for byte, on two scratch seeds each.

## §2 THE FILES

| file | what |
|---|---|
| `src/sim/bodyFacing.ts` | NEW — **PURE** (its import list is EMPTY; comment-stripped it names no `Match`, no `Player`, no rng, holds no state): `BF_OFF_HEADING_FRACTION` = 0.70 and `BF_DEPTH` = `1 − BF_OFF_HEADING_FRACTION` (the depth DERIVED, never typed twice), both traced in the docblock to #374 item 4(ii) / #375 item 2 · `facingFactor(cosPhi, depth)` (the law on scalars; cosine clamped to [−1, 1]; no `acos`) · `facingCosine(headX, headY, dirX, dirY)` (unit inputs; degenerate ⇒ 1) |
| `src/sim/Player.ts` | `facingDepth: number = 0` (a public field — ⚠ unit-name truth: a DEPTH, not a fraction kept) + **THE ONE SEAM** at the top of `physicsStep`, above the clamp + a module scratch vector (`bfIntent`, the `turnCos`/`turnSin` idiom) touched only when armed |
| `src/sim/Match.ts` | `bfFacingCost` config field + `readonly` + `?? false`; the private writer `setFacingDepth()` and its **three** call sites — right after `this.teams = [...]`, and after EACH of the two `becomeSub` paths |
| `src/sim/League.ts` | the `matchFlags` key union only (`League.toJSON` omits `matchFlags` — nothing serializes) |
| `src/sim/rendezvousRecovery.ts` | `facingDepth` added to `PlayerPhysicsSnapshot`, `snapshotPlayerPhysics` and `shadowPlayerFromSnapshot` — that file's contract is "a COMPLETE shadow of every field read or written by `Player.physicsStep()`", and the seam reads one more |
| `tests/bfFacingCost.test.ts` | THE PERMANENT PIN SUITE — 19 pins, see §3 |
| `docs/world-model/BF-T0-FACING-COST-SEAM.md` | this file |

⭐ **THE DEPTH PATH, in full** (how the number reaches every body): `Match`'s constructor calls
`setFacingDepth()` immediately after `this.teams = [new Team(0, …), new Team(1, …)]`, and that
writer is `const depth = this.bfFacingCost ? BF_DEPTH : 0; for (const t of this.teams) for
(const p of t.players) p.facingDepth = depth;`. **The bench holds no bodies** — a bench entry is
a plain roster row, and a substitute IS the same pitch-slot `Player` object with a new identity
(`becomeSub`, the Phase-61 form) — so the same writer is called again after BOTH substitution
paths (`trySubstitution` and the injury `forceSubstitution`), and the entering man carries the
match's depth from his first step. A `rendezvousRecovery`-constructed `Player` inherits it
through the snapshot, so the write cannot escape into a shadow body.

## §3 THE PINS (`tests/bfFacingCost.test.ts` — 19, ALL GREEN at the seam commit; the suite is the living inventory)

* **Road B**: the PROHIBITION SET (no world / preset / env / bundle names the flag; `a4World.ts`
  contains neither `bfFacingCost` nor `facingDepth`; every version 1–12 carries no flag; a bare
  `Match`, a world-12 `Match` and a League match all read `false` **and every body in them
  carries `facingDepth === 0`**) · NO SERIALIZATION (`League.toJSON` omits it) · **G-OFF**
  (absent ≡ explicit-false, byte for byte, BARE world + WORLD 12's composition × 2 scratch seeds
  each, pooled digest, four distinct cells).
* **G-DEPTH** (both directions): shut ⇒ every body 0 through a whole world-12 match **and**
  through a substitution; armed ⇒ every body `BF_DEPTH` at kickoff and at full time, and a
  substitute carries it the moment he enters (the sub path exercised, the man's name proven to
  have changed).
* **The law on fixtures**: **G-AHEAD** (`facingFactor(1, depth)` is EXACTLY 1 at every depth;
  the fixture body driven straight ahead covers the SAME ground armed and shut — path LIVE) ·
  **G-SIDE** (BF-C0 §R3's own two-body fixture, re-used: shut, the ratio is exactly 1 — the
  census's receipt at this head; armed, the faced body covers LESS, and its distance equals the
  law's own prediction **integrated step by step OUTSIDE the engine** — the clamp, the accel
  approach, the position advance, the heading rotation and the stamina economy re-implemented
  in the test from `facingFactor`/`facingCosine`; DERIVED, never typed) · **G-BACK** (a 180°
  standing start: the first tick's factor is EXACTLY `1 − D` = 0.70, the sequence is monotone
  non-decreasing and reaches EXACTLY 1 within `ceil(π / (TURN_RATE·DT))` = 29 ticks — the
  engine's own full-reversal cost, derived; and in the engine the priced body's first-tick
  speed is no greater than the shut one's) · **G-SMALL** (f(7.5°) re-derived and ≥ 0.997) ·
  **G-MONOTONE** (non-increasing over 181 one-degree samples, FLAT at `1 − D` for every
  φ ≥ 90°, corners exact: f(0) = 1, f(90°) = f(180°) = 1 − D; out-of-range cosines CLAMPED;
  depth 0 is the identity at every angle) · DEGENERATE inputs (a zero heading, a zero direction,
  a zero intent ⇒ factor 1 and the body untouched) and **the direction of the intent never
  moves** (armed and shut accelerate along the same bearing).
* **G-TURNRATE**: `TURN_RATE` is 6.5 and the whole heading-rotation block of `physicsStep` is
  **byte-identical** to the dispatch HEAD (the block quoted verbatim in the suite), with the
  seam anchored ABOVE it and above the top-speed clamp.
* **G-SITES**: every `faceTarget` occurrence in `src/**` RECOUNTED against BF-C0 §R3's seam map
  — **57 in 8 files** with the per-file counts pinned (`PlayerBrain` 1 · `actionExecutor` 18 ·
  `inLookAct` 1 · `pcLatency` 1 · `receiverAnticipationSeat` 1 · `Match` 12 · `Player` 3 ·
  `rendezvousRecovery` 20), plus `Player.ts`'s three sites anchored line by line. Canon copied —
  VERBATIM: *"a src-extracted constant pins its extraction to the NAMED call site — anchored
  match + line receipt — never first-occurrence"* (home: `BK-C0-BODYBALL-CENSUS.md` §COMMANDER
  CORRECTIONS item 1, ruling #306 item 4).
* **THE SEAM MAP**: occurrence COUNTS per needle with EVERY site enumerated across `src/**` —
  canon copied, VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle and enumerates
  EVERY occurrence's site"* (home: `PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 1).
  The family (`bfFacingCost` · `setFacingDepth` · `facingDepth` · `facingFactor` ·
  `facingCosine` · `BF_DEPTH` · `BF_OFF_HEADING_FRACTION`) exists in FIVE files and no other
  spelling exists in `src/**`; every executable site is additionally pinned by its own line.
* **PURITY**: the module's import list is EMPTY and its comment-stripped code contains none of
  `Match` · `Player` · `rng`/`Rng` · `Math.random` · `let ` · `class ` · `require(` · `import`;
  the same arguments give the same answer forever. **G-RNG**: pricing every body on a live armed
  walk moves the match rng not at all, and this slice adds no gene (a random genome contains no
  `facing` key).
* **THE FINGERPRINT OF RECORD** is a literal in the suite and the suite RUNS it (the
  `a4HomeGrant` form: a 2-season headless league hashed and compared). ⭐ CANON "pin suites from
  birth" (home: ruling #297 item 7).

⭐ Receipts are receipts: the fixture metres in §3 and §4 are ARMING PLUMBING — the law's
arithmetic proved on two bodies in a vacuum — and are never quoted as football effect sizes
(home: ruling #289 item 1 + `BU-T1-MT-COMPOSITION.md` §COMMANDER CORRECTIONS item 5). What the
price BUYS is BF-T1's question, and this stage ran ZERO sims of record.

## §4 HONEST LIMITS

* ⚠ **THE SHAPE IS A RATIFIED CHOICE, NOT A MEASUREMENT.** Nothing in this engine or in BF-C0
  measures how speed falls off with φ. The cosine-flat family was chosen at #374 item 4(i)
  because it is the engine's OWN misalignment shape and because it makes BF-C0 §CORR 3's
  finding — that under a LINEAR shape ~56 % of the priced metres would be a toll on
  nearly-aligned running — vanish by construction. A different real curve would show up as a
  different world, not as a red pin.
* ⚠ **k = 0.70 IS AT ONE REMOVE.** BF-C0 §R4 verified backward ≈ 0.70–0.74 by web search
  without reading full texts, found NO clean maximal lateral ratio (the practitioner's "two
  thirds" is explicitly marked ⛔ FROM MEMORY, UNVERIFIED in the census), and therefore the
  ordering BACK ≤ LATERAL **is not established**. The law charges the SAME k on both sides
  because the evidence does not impose an ordering — a declared modelling choice. BF-T1 reports
  k = 0.60 / 0.80 rungs beside the ratified 0.70.
* ⚠ **THE DEPTH IS FLAT — `agility` IS HELD.** #375 item 1: `ATTR_KEYS` has nine keys and
  `agility` is not among them; SUBSTRATE-MAP S1's name is a HOOK. Adding an attribute is a
  BUDGET slice with its own contract (the `positioning` precedent), so **M-BF.2 is a HELD
  DOOR** and no existing attribute was pressed into service as a proxy. Consequence, stated:
  in this law every body pays the same price for the same angle — the world contains no
  "nimble" body, and the band an attribute would have supplied is stood in for by BF-T1's
  reported rungs.
* ⚠ **THE KEEPER IS THE FIRST PAYER.** BF-C0 §R1: `GoalkeeperPosition` × GK runs **0.855206**
  of his moving ticks more than 45° off his heading (every outfield role 0.047–0.071), and that
  one row carries **55.504 %** of all misaligned ground in the world; but of the COST it is
  **24.1 %**, not 60 % (§CORR 1 — the 60 % is his share of misaligned METRES, a different
  denominator). What he does with the price — keep facing the ball and shuffle slower, or turn
  and run — is BF-T1's exam, not a claim here.
* ⚠ **ON OUTFIELD BODIES THE LAW PRICES DIRECTION CHANGES.** BF-C0 §CORR 4: **96.5 %** of
  outfield misalignment is turn-rate LAG, not a `faceTarget` decision (`MarkOpponent` never
  writes `faceTarget`; `ReceivePass` sits at the baseline **0.021463**). So armed, the biggest
  outfield effect is the S1 **turn cost**: you cannot sprint the new way until you have turned.
  Reality (the #201 oracle) says that is correct; whether the football improves is BF-T1's
  question. ⭐ The census also says plainly that the marker's backpedal and the receiver's
  open-body drift **do not exist in this engine yet** — the law does not price them; it opens
  a price at which they could evolve.
* ⚠ **THE LAW SCALES THE INTENT, SO THE CLAMP STILL APPLIES AFTER IT.** `topSpeed` (and with it
  the stamina economy) is unchanged and binds the PRICED intent, not the raw one — which also
  means a priced body runs slower, tires LESS, and therefore keeps a slightly higher top speed
  later. That feedback is real, it is the engine's own, and G-SIDE's outside-the-engine
  prediction had to mirror it to match.
* ⚠ **NO STOP LAW, NO DECELERATION LAW, NO PERCEPTION COST.** Braking is free, the turn RATE is
  unchanged (agility → turn rate is a second door, HELD), carrying and low-speed/under-pressure
  glue are S11's other two scenarios (HELD), and facing costs nothing in SIGHT — a gaze model
  is the IN arc's business. This law prices exactly one thing: speed in a direction the body is
  not facing.
* ⚠ **THE ENGINE'S HEADING ONLY FOLLOWS MOTION ABOVE 0.5 m/s** (`physicsStep`'s own floor).
  A body accelerating from rest with no `faceTarget` therefore keeps its old heading for the
  first few ticks, so the real in-engine recovery from a standing 180° is SLOWER than G-BACK's
  29-tick pure-law budget. Stated, not hidden; G-BACK pins the LAW's clock and the first tick's
  price in the engine, not a whole-body recovery time.
* ⚠ **WHAT ARMED DOES NOT CLAIM.** ARMED means "the capacity exists behind a shut door", not
  that the world is better, not that anything evolves, and not that any face moves. This stage
  ran ZERO sims of record and states no football finding.

## §COMMANDER CORRECTIONS (ruling #376 — the verifier's two MEDIUM and two LOW, disposed; ⭐ ONE CORRECTS THE LAW OF RECORD and is fixed by BF-T0-FIX before any exam)

1. **⭐⭐ MEDIUM — THE APPLICATION POINT WAS WRONG IN THE RULING, and the seam obeyed it.** #374
   item 4(iv) ordered the factor "applied to the magnitude of the INTENDED velocity BEFORE the
   top-speed clamp". With that order, whenever |desiredVel| ≥ topSpeed / f the clamp absorbs the
   price entirely and the body pays NOTHING for facing — and the executors DO over-saturate the
   intent (`arrive(…, topSpeed·speedF)` PLUS `separation` PLUS `avoidOpponents`, actionExecutor.ts
   ~ll.1304–1321); at 90° the price vanishes above 1.43× topSpeed of headroom. THE LAW OF RECORD
   IS CORRECTED (ruling #376 item 2): **the factor scales the CLAMPED target — after the top-speed
   clamp, before the stun multiplier** — so a slow drift (unclamped) still pays on its own
   magnitude, a saturated sprint pays on topSpeed, and no intent can absorb the price. BF-T0-FIX
   moves the seam by one statement, re-derives G-SIDE's predictor for the new order, and adds
   **G-SATURATED** (an intent of 3× topSpeed at 90° pays exactly the same as an intent of topSpeed).
   The commander's error, not the executor's.
2. **MEDIUM — G-BACK's engine-side half was VACUOUS.** On tick one both bodies are accel-capped
   (`maxDelta = ACCEL·DT ≈ 0.21–0.26 m/s` against targets of 4.5–7.6 m/s), so `|p.vel| ≤ |q.vel|`
   compares two EQUAL numbers and would pass with the seam deleted; the comment beside it ("the
   accel approach never saw the full intent") is false for tick one. BF-T0-FIX replaces it with a
   non-vacuous engine assertion: the heading LOCKED away from the run (a `faceTarget` behind the
   body) and the speeds compared AFTER the accel transient — the priced body settles at
   `BF_OFF_HEADING_FRACTION` × the shut body's speed, derived. The law-side half of G-BACK (the
   29-tick monotone recovery, `ceil(π / (TURN_RATE·DT))`) stands.
3. **LOW — two keeper denominators in one §4 sentence** ("55.504 % of all misaligned ground" = the
   `GoalkeeperPosition × GK` ROW; "~60 %" = the GK ROLE's share of misaligned metres, 59.649 %).
   Both traceable; the sentence is corrected by the fix commit to name row vs role.
4. **LOW — the dispatch's file list was widened by one, correctly.** `src/sim/rendezvousRecovery.ts`
   (+4 lines: `facingDepth` in `PlayerPhysicsSnapshot`, the snapshot writer and the shadow reader)
   — its contract is "a complete shadow of every field read or written by `Player.physicsStep()`",
   and `physicsStep` now reads one more field; omitting it would let a shadow body escape the depth
   write. RATIFIED; the field is required (typecheck enforces every snapshot literal).
5. **Of record — the shipped-path delta** is `const dv` → `let dv: V2` plus the `facingDepth > 0`
   branch (identical JS semantics, G-OFF byte-identity proven on bare + world 12 × 2 scratch seeds);
   the module-level scratch vector idiom; the private `setFacingDepth()` writer at three sites (the
   bench holds no bodies; a substitute IS the slot object); zero narrowed pins (a decorative comment
   that tripped RC-T0's seam map was reworded rather than narrowing someone else's pin). Endorsed.
6. **For BF-T1 (the verifier's own note, adopted):** the exam instruments the share of armed moving
   ticks on which the price actually bit (factor < 1 applied to a non-degenerate clamped target) —
   after the fix that share is the law's live coverage, and it is REPORTED so the exam's effect
   sizes are read against it.
