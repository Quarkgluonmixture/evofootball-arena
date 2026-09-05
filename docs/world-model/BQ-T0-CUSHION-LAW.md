# BQ-T0 — THE CUSHION LAW（缓冲留球：脚碰到球，球跟着人走）

> **Authorized by COMMANDER RULING #384 items 5–6** (the seam form: BF-T0 / RC-T0b; the exact
> statements frozen here, at §1). **Binding contract:**
> [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md) **§2-AMENDMENT M-BK.5** — THE CUSHION
> KEEPS THE BALL; THE ROLL DECIDES THE TOUCH.
>
> **Lineage.** PT-C0 (the play-test forensic) → RC-T1b (FAIL) → BN-C0 (#382: the user's
> 「传到人身上弹回」 is a CONTROL-QUALITY event) → BQ-C0 (#383: the roll is an honest coin with no
> heavy face — and it is NOT the story) → BQ-C1 (#384: the window is MIXED, and its largest
> single piece is GEOMETRY) → **this stage builds the repair behind a shut door and nothing
> else.**
>
> ⛔ **THIS STAGE SHIPS NOTHING** (Road B): `bqCushion` is default OFF, never env- or
> bundle-armed, named by NO world and NO preset (`a4World.ts` contains no `bqCushion`); no gene
> is born; no constant is added; the production fingerprint is UNCHANGED — `npm run fingerprint`
> = the literal of record
> **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** at the seam commit.
> ⛔ **World 12's composition and bytes are untouched** — the user's play-test still compares
> like with like. The entry rung is a later stage's business, after BQ-T1 and the user's gate.
> **ZERO sims of record; scratch 900,003,100–199 only.** `npm run build` was NOT run: the seam
> adds no module and no entry layer names it.

## §0 THE WORDS OF RECORD

### RULING #384 item 5 — THE LAW (verbatim)

```text
5. ⭐⭐ **M-BK.5 — THE CUSHION KEEPS THE BALL; THE ROLL DECIDES THE TOUCH**
   (the BK contract's §2-AMENDMENT carries it). LAW OF RECORD, armed
   (`bqCushion`, default OFF, Road B): in `applyControlContact` the ball
   takes the body's velocity and NOTHING ELSE — `ball.vel = p.vel` — the
   relative velocity after a cushioning contact is ZERO; the outward
   normal release (`min(CONTACT_RELEASE_MAX_SPEED, max(CONTACT_RELEASE_MIN_SPEED,
   CONTACT_RELEASE_MIN_SPEED + |relativeNormal| · CONTACT_RELEASE_INCOMING_SHARE))`
   along `n`) and the tangential retention (`t · CONTACT_TANGENTIAL_RETENTION`)
   are RETIRED on the armed path; the constants stay for the shipped
   path, character for character. EVERYTHING ELSE STANDS: `ball.vz *=
   0.25`, `ball.spin *= 0.4`, `ball.lastTouch = p`, the commit cooldown,
   the trace, the offside branch, the `pendingControl` creation with
   `CONTACT_CONTROL_DELAY_TICKS`, the resolver's margin and roll, the
   body-strike and deflection channels, the overlap solver. ⛔ NO NEW
   CONSTANT — zero is the absence of a push, not a number chosen; ⛔ the
   margin, the window length and the roll are NOT touched (a reach-margin
   term for the roll is a HELD door; the window length is the contest's
   and stays). CONSEQUENCES the pins must show: a contact at the edge of
   reach by a running body keeps the ball inside reach at `readyTick`
   (armed) where the shipped law loses it — the census's mechanism on a
   fixture; an opponent within reach of the resting ball inside the
   window STILL replaces the attempt (the duel survives — G-CONTEST); the
   roll still runs and still knocks a failed touch 3.5–6.5 m/s; no
   ball–core penetration is introduced (the solver's own invariants).
```

### RULING #384 item 6 — THE SCOPE (verbatim)

```text
6. ⭐⭐ **BQ-T0 DISPATCHED — THE DORMANT CUSHION LAW** (the seam form:
   BF-T0 / RC-T0b; definitions frozen at the executor's §1): (i) Match
   config `bqCushion?: boolean`, `readonly bqCushion`, `?? false`; League
   `matchFlags` union; named by NO world, preset, env or bundle. (ii) THE
   ONE SEAM in `applyControlContact`: the two velocity assignments become
   `ball.vel.x = p.vel.x + (this.bqCushion ? 0 : n.x * release + tx *
   CONTACT_TANGENTIAL_RETENTION)` in FORM — the executor freezes the exact
   statement so that the flag-OFF path evaluates the SHIPPED expression
   character for character (the BK-T1 idiom at Match.ts ~l.4366) and the
   armed path adds NO arithmetic; `release` is still computed (or
   skipped) so that no shipped byte moves — the executor states which
   and proves byte-identity with G-OFF. (iii) PINS
   (`tests/bqCushion.test.ts`, from birth; the `bkContactLaw.test.ts` /
   `bfFacingCost.test.ts` idioms): prohibitions · no serialization ·
   **G-OFF** (absent ≡ false ≡ byte-identical whole-match signatures on
   the bare world AND world 12's composition, ≥ 2 scratch seeds each from
   900,003,100–199, pooled digest, distinct cells) · **G-KEEP** (fixture:
   a body running at the census's mean 3.405157 m/s across a pass
   arriving at 8 m/s relative, contact at `d` = 1.20 m (the reach edge;
   `CONTROL_RADIUS` anchored): shut ⇒ at `readyTick` the ball lies
   OUTSIDE `sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN` and the
   resolver returns false; armed ⇒ INSIDE and the roll runs — the
   census's mechanism reproduced; the relative velocity after the armed
   contact is exactly zero) · **G-CONTEST** (fixture: an opponent within
   `CONTROL_RADIUS` of the resting ball at tick contact+1 submits a claim
   and REPLACES the attempt, armed exactly as shut — the abandoned-by-
   contact class survives) · **G-ROLL** (the roll still runs at
   `readyTick` on the armed path and a forced failure still knocks the
   ball inside [3.5, 6.5] m/s — `attemptFirstTouch` and `touchFailChance`
   byte-identical, anchored) · **G-STRIKE** (`bkApplyBodyStrike` and the
   deflection path byte-identical) · **G-SOLVER** (a live armed walk
   records no tick with the ball inside any body core beyond the
   solver's own tolerance — reuse `contactSolver.test.ts`'s invariant if
   one exists, anchored) · **G-WINDOW** (`CONTACT_CONTROL_DELAY_TICKS`,
   the margin line and the resolver byte-identical) · seam map (needle
   counts: `bqCushion`; every site enumerated) · **G-RNG** (zero draws;
   the armed contact consumes the same rng as shut) · the fingerprint
   literal RUN (the a4HomeGrant form) · full suite. Existing pins
   narrowed per DF-T0 §P7 only, each listed. (iv) STAGE DOC
   `BQ-T0-CUSHION-LAW.md` (the RC-T0 form: §0 this item + item 5
   VERBATIM · plain football 「缓冲留球：脚碰到球，球跟着人走，三拍之后还在脚
   边；球能不能拿住由停球那一掷决定，对手能不能戳走由对抗决定」 · §1 the
   mechanism (the shipped expression and the armed one side by side) ·
   §2 files · §3 pins · §4 honest limits — the zero is a form, not a
   fit; the window length and margin untouched; a full-stretch touch that
   should run away is now the roll's to price (held door: a reach term);
   the body-strike channel still caroms; nothing shipped). ZERO sims of
   record; scratch **900,003,100–199**. (v) THEN BQ-T1 (#385): H-BQ.1 on
   world 12 E-SHUT / E-ARMED (and the dosed pair beside) — the intended
   target's non-possession share FALLS ∧ the margin class FALLS ∧ the
   opponent-contact class does NOT fall (the duel intact) ∧ do-no-harm
   (BF-T1's bands) ∧ the user's own-target bounce face and 撞车 reported;
   the frozen rules' words STORED for every reported pair; BQ-C1's
   instrument REUSED for the classes.
```

### in plain football language

「缓冲留球：脚碰到球，球跟着人走，三拍之后还在脚边；球能不能拿住由停球那一掷决定，对手能不能戳走
由对抗决定」

今天引擎是这样的：脚一碰到球，球被**推离**这只脚——沿着人到球的那条线往外，至少 0.25 m/s，再加上
球原来横向速度的 0.35——然后**三拍之后**再问一句「球还在他脚边两厘米以内吗」。在够得着
的**边缘**碰到的那一下，光凭几何就输了，连停球那一掷都还没掷。真实足球不是这样的：缓冲的第一脚，
球是**跟着人走**的——那正是这一脚的目的；伸长了脚够到、球跑掉了，那是**技术**失误，而这个引擎本来
就有一掷在算技术。这一版把诚实的那条法则放进一扇**关着**的门：开门时，球接过人的速度，别的什么也
不接。三拍的窗口留着（够得着的对手照样能把球捅走——那正是窗口的用处），两厘米的余量留着，那一掷
留着，撞身体和折射两条通道留着。**这一版什么都没上线。**

## §1 THE MECHANISM (what armed means)

THE ONE SEAM is in `Match.applyControlContact` — the cushioning contact — and it is the two
velocity assignments and nothing else:

```ts
    const relativeNormal = rvx * n.x + rvy * n.y;      //  ← unchanged, above the seam
    const tx = rvx - relativeNormal * n.x;             //  ← unchanged
    const ty = rvy - relativeNormal * n.y;             //  ← unchanged
    const release = Math.min(                          //  ← unchanged
      CONTACT_RELEASE_MAX_SPEED,
      Math.max(
        CONTACT_RELEASE_MIN_SPEED,
        CONTACT_RELEASE_MIN_SPEED + Math.abs(relativeNormal) * CONTACT_RELEASE_INCOMING_SHARE,
      ),
    );
    if (!this.bqCushion) {
      // THE SHIPPED EXPRESSION, character for character
      ball.vel.x = p.vel.x + n.x * release + tx * CONTACT_TANGENTIAL_RETENTION;
      ball.vel.y = p.vel.y + n.y * release + ty * CONTACT_TANGENTIAL_RETENTION;
    } else {
      // THE ARMED EXPRESSION — the body's velocity and NOTHING else
      ball.vel.x = p.vel.x;
      ball.vel.y = p.vel.y;
    }
```

⭐⭐ **THE SHIPPED PATH EXECUTES THE SHIPPED EXPRESSION, CHARACTER FOR CHARACTER** (the BK-T1
idiom at this file's own z-partition seam: *"One boolean on the flag-OFF path; `bkContactLaw`
OFF ⇒ the shipped expression, character for character"*). The whole shipped-path delta is the
branch test `if (!this.bqCushion)`. **The armed path adds NO ARITHMETIC AT ALL** — the seam-map
pin reads the armed branch and requires it to contain no `+`, no `*`, no `release`, no `n.x`,
no `tx`, no `CONTACT_` and no `rng`.

⭐ **`release`, `tx` and `ty` STAY COMPUTED ON BOTH PATHS**, above the branch — they are PURE
LOCALS (no rng, no state, no side effect), so guarding them would move shipped bytes for no
gain. **G-OFF proves the byte-identity rather than asserting it**: whole-match signatures on the
bare world and on world 12's composition, absent ≡ explicit-false, on two scratch seeds each,
four distinct cells and one pooled digest.

⛔ **NOTHING ELSE IN THE FUNCTION MOVES**: `ball.vz *= 0.25`, `ball.spin *= 0.4`,
`ball.lastTouch = p`, the commit cooldown, `traceContact`, the offside branch, and the
`pendingControl` creation with its `readyTick`. ⛔ **NOTHING ELSE IN `src/**` MOVES**: the
retention margin, the window length, `resolvePendingControlAttempt`, `attemptFirstTouch` /
`touchFailChance`, `bkApplyBodyStrike`, the applied-deflection branch and `resolveOverlaps` are
each pinned **BYTE-IDENTICAL to the dispatch HEAD** (`83e8a95`) by a verbatim block in the pin
suite. ⛔ **NO NEW CONSTANT** — zero is the ABSENCE of a push, not a number chosen (#384 item 5);
the four retired constants' occurrence counts across `src/**` are the dispatch HEAD's, per needle
per file, because they still live in the shipped expression.

### The census numbers this law answers (quoted from BQ-C1 by field, arm D = the world the user plays)

| BQ-C1 field | value | what it says |
|---|---|---|
| `composition.intended.parent.resolvedNotReached` | **0.414040** | of the intended target's non-possession endings, the ball was NOT within reach at the third tick |
| `notReached.intended.ballLargerOfNotReached` (arm E) | **0.625739** | of those, it was the BALL that had travelled further, not the man |
| `physics.meanReleaseSpeed` (arm E, m/s) | **1.286643** | how fast the cushion leaves the ball relative to the body |
| `physics.meanReleaseNormalComponent` (arm E, m/s) | **0.954563** | of it, along the body→ball normal — the outward push |
| `physics.meanBodySpeedAtContact` (arm E, m/s) | **3.405157** | how fast the receiver is running when the foot meets the ball |
| `CONTACT_CONTROL_DELAY_TICKS` (anchored) | **3** | the window |
| `CONTACT_CONTROL_RETENTION_MARGIN` (anchored, m) | **0.02** | the bar the resolver holds him to |

## §2 THE FILES

| file | what |
|---|---|
| `src/sim/Match.ts` | `bqCushion?: boolean` config field + `readonly bqCushion: boolean` + `this.bqCushion = cfg.bqCushion ?? false;` + **THE ONE SEAM** inside `applyControlContact` (four sites; needle count **5**, the initialiser naming it twice) |
| `src/sim/League.ts` | the `matchFlags` key union only, on its own line (`League.toJSON` omits `matchFlags` — nothing serializes) |
| `tests/bqCushion.test.ts` | THE PERMANENT PIN SUITE — see §3 |
| `docs/world-model/BQ-T0-CUSHION-LAW.md` | this file |

⛔ No other `src/**` file changed. No new module, no new field on `Player`, no new constant,
no gene, no entry-layer mention.

## §3 THE PINS (`tests/bqCushion.test.ts` — ALL GREEN; **the suite is the living inventory, and the count derives from it**)

* **Road B**: the PROHIBITION SET (no world / preset / env / bundle names the flag; `a4World.ts`
  contains no `bqCushion`; every version 1–12 carries no flag; a bare `Match`, a world-12
  `Match` and a League match all read `false`) · NO SERIALIZATION (`League.toJSON` omits it) ·
  **G-OFF** (absent ≡ explicit-false, byte for byte, BARE world + WORLD 12's composition × 2
  scratch seeds each, pooled digest, four distinct cells).
* **G-KEEP — BQ-C1's mechanism on a fixture, DERIVED not typed.** A receiver runs ACROSS the
  ball's line at the census's `physics.meanBodySpeedAtContact` **3.405157** m/s; the ball arrives
  at him so the relative speed is exactly **8** m/s (above `attemptFirstTouch`'s own no-roll gate
  `speed <= 6`, so the fixture reaches the roll); the touch is made at a centre distance
  **DERIVED** from the resolver's own two constants, `CONTROL_RADIUS − CONTACT_CONTROL_RETENTION_MARGIN`,
  with the reach itself READ from `directBallAccess` CALLED. The contact and the whole window run
  through the ENGINE's own `tryCapture` / `stepBall`; only the BODY is held on a straight line
  (a declared fixture control). **SHUT** ⇒ at `readyTick` the ball lies OUTSIDE
  `sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN`, the resolver returns false, there is no
  possession and **no trace entry at all** (the roll was never asked). **ARMED** ⇒ INSIDE, and the
  roll RUNS (one `traceFirstTouch` entry for that body). **AND the relative velocity of the ball
  to the body immediately after the armed contact is EXACTLY ZERO** — `toBe(0)` on both
  components, read at the end of the contact tick — while the shipped law's is not (the pin is
  alive). The shut drift is compared against **the law's own arithmetic integrated OUTSIDE the
  engine** (the release and retention constants IMPORTED, the ground-friction form
  `Math.exp(-BALL_FRICTION_K * dt)` in `stepBall`'s own order), to 12 dp.
* **G-CONTEST — the duel survives.** An opponent placed inside `CONTROL_RADIUS` of the resting
  ball at tick contact + 1, free to claim: **armed exactly as shut**, his claim REPLACES the
  attempt — the engine's own `pendingControl` field now names HIM (BQ-C1's
  `abandonedContactOpponent`, the creation site's overwrite), the contest ledger records both
  contacts as `controlAttempt`, and `ball.lastTouch` is his. Canon copied — VERBATIM: *"an event
  attribution reads the engine's own record when one exists (`shotLog`, the contest episodes,
  `lastTouch`); a heuristic is written only where no record exists, and says so"* (home:
  `RC-T1B-READY-EXAM.md` §COMMANDER CORRECTIONS item 5). **THE MUTANT READ**: with the opponent
  removed, the armed attempt resolves.
* **G-ROLL — the quality law is untouched.** `attemptFirstTouch` and `touchFailChance` are
  BYTE-IDENTICAL to the dispatch HEAD (verbatim blocks), and `mechanics.ts` never learns the flag
  exists. On an ARMED world-12 scratch walk adjudications happen and some of them FAIL. A FORCED
  FAILURE — forced **through the public seam only**, by a SEED SEARCH over this stage's own
  scratch band (900,003,100–199 × the first five outfield slots), taking the FIRST armed fixture
  whose stored trace entry reads `clean === false`; no rng is reached into and no private field
  is written — still knocks the ball inside **[3.5, 6.5]** m/s, grants nothing, and increments
  `miscontrols`.
* **G-STRIKE**: `bkApplyBodyStrike` and `tryCapture`'s APPLIED-DEFLECTION branch, each pinned
  BYTE-IDENTICAL to the dispatch HEAD by a verbatim block, and neither contains the flag.
* **G-SOLVER**: `resolveOverlaps` pinned BYTE-IDENTICAL to the dispatch HEAD; **`contactSolver.test.ts`'s
  OWN invariant RE-RUN with the door ARMED** (its four assertion lines anchored in this suite so
  the reuse is provable — canon, VERBATIM: *"a src-extracted constant pins its extraction to the
  NAMED call site — anchored match + line receipt — never first-occurrence"*, home:
  `BK-C0-BODYBALL-CENSUS.md` §COMMANDER CORRECTIONS item 1); and the armed law's own
  anti-penetration property proved twice — the radial relative speed after an armed cushion is
  EXACTLY 0 while the shipped law's is strictly OUTWARD, and on a live armed world-12 walk EVERY
  cushion leaves the ball at exactly the body's velocity (the SHUT walk of the same seed is the
  mutant: not one of its cushions does).
* **G-WINDOW**: `CONTACT_CONTROL_DELAY_TICKS` = 3 and `CONTACT_CONTROL_RETENTION_MARGIN` = 0.02
  anchored at their definition lines, the resolver's margin line and the creation site's
  `readyTick` line anchored verbatim, and the WHOLE of `resolvePendingControlAttempt` pinned
  BYTE-IDENTICAL to the dispatch HEAD.
* **THE SEAM MAP**: occurrence COUNTS per needle with EVERY site enumerated across `src/**` —
  canon copied, VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle and enumerates
  EVERY occurrence's site"* (home: `PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 1).
  The family is the single flag `bqCushion` and nothing else; it exists in TWO files
  (`Match.ts` 5, `League.ts` 1) and in no other spelling anywhere in `src/**`; every executable
  site is pinned by its own line, as are the two shipped assignment lines and the two armed ones.
  **AND THE FOUR RETIRED CONSTANTS' COUNTS ARE THE DISPATCH HEAD'S**, per needle per file.
* **G-RNG**: the armed contact consumes exactly the rng the shut one does — the fixture's rng
  state is compared before and after a constructed contact under both flags (this contact draws
  nothing on either arm), the CONTESTED fixture (which does draw, through the shipped
  blind-contact coin above the seam) ends at the SAME rng state on both arms, the seam's own
  branch contains no `rng` / `Math.random` / `chance(`, and this slice adds NO gene.
* **THE FINGERPRINT OF RECORD** is a literal in the suite and the suite RUNS it (the
  `a4HomeGrant` form: a 2-season headless league hashed and compared). ⭐ CANON "pin suites from
  birth" (home: ruling #297 item 7).

⭐ **Receipts are receipts** (home: ruling #289 item 1 + `BU-T1-MT-COMPOSITION.md` §COMMANDER
CORRECTIONS item 5): the fixture distances and the walk counts are ARMING PLUMBING — the law's
arithmetic proved on two bodies and one door — and are never quoted as football effect sizes.
What the law BUYS is BQ-T1's question, and this stage ran **ZERO sims of record**.

## §4 HONEST LIMITS

* ⚠⚠ **ZERO IS A FORM, NOT A FIT.** Nothing in this engine or in BQ-C1 measures how much
  relative motion a real cushioning touch leaves. A real first touch leaves a little — the ball
  is set half a metre into space, or dies under the sole, depending on what the player wants —
  and **how much is a HELD QUESTION**. The law charges zero because zero is the ABSENCE of a
  push and therefore the only value that needs no constant (#384 item 5's own ⛔). A different
  real value would show up as a different world, not as a red pin.
* ⚠ **THE FIXTURE'S CONTACT DISTANCE IS NOT THE DISPATCH'S 1.20 m, AND THAT IS A MEASUREMENT.**
  At `d` = 1.20 m the shipped law's own three-tick drift is smaller than the 0.07 m this geometry
  would need to cross the bar, so the shut ball is STILL INSIDE at `readyTick` and the roll runs
  — a fixture there would prove nothing. The stage's `d` is therefore DERIVED from the resolver's
  own two constants (`CONTROL_RADIUS − CONTACT_CONTROL_RETENTION_MARGIN`), and the 1.20 m case is
  kept as a PINNED COUNTER-RECEIPT rather than hidden. ⇒ **the losing band at this geometry is
  narrower than the contract's "~5 cm"** (§DEVIATIONS 1). The census's 0.414040 is a population
  over every geometry, every heading and a body that is also moving; the fixture is one cell of it.
* ⚠ **THE ARMED BALL DOES NOT FREEZE IN THE BODY'S FRAME.** It takes the body's velocity at the
  instant of contact and is then a free ball again: the shipped ground friction bleeds its speed
  inside the window while the body does not slow, so it slips back by a hair. The pin measures
  that slip and holds it under a centimetre on the fixture. ⇒ a body ACCELERATING or TURNING hard
  through the window can still lose the ball at the margin, armed.
* ⚠ **THE WINDOW LENGTH AND THE MARGIN ARE UNTOUCHED** (#384 item 5's ⛔). So a body that is
  STUNNED or SENT OFF at `readyTick` still loses the attempt, a body who leaves the ball still
  loses it, and the resolver's own pre-roll returns are unchanged. The three ticks are the
  CONTEST's — G-CONTEST is the pin that says so.
* ⚠ **A FULL-STRETCH TOUCH THAT SHOULD RUN AWAY IS NOW THE ROLL'S TO PRICE.** The engine used to
  price it twice (once by geometry before skill, once by the roll); armed, only the roll prices
  it, and the roll does not know how far the body had to stretch. **A reach-margin term for the
  roll is a HELD DOOR** (#384 item 4(v): the roll's FORM question stays deferred, and once the
  geometry is honest the roll is THE quality law for the intended target).
* ⚠ **THE BODY-STRIKE CHANNEL STILL CAROMS**, by design: a body in cooldown or stunned still
  sends the ball off him at the DEFLECT family's own pace (BK-T1's `bkApplyBodyStrike`, pinned
  byte-identical here). The user's VISIBLE 「弹回」 is the LANE classes — a non-target teammate
  first (BN-C0's C3) plus body strikes — and those belong to steps ②/③ (#384 item 4(ii)), not to
  this seam.
* ⚠ **THE ENGINE HAS NO BALL–BODY SEPARATION SOLVER AT ALL.** `resolveOverlaps` separates
  BODIES; a free ball's centre can sit inside a body's core in the SHIPPED world too (BK-C0's
  球穿身, whose own door is BK-T1's). This seam introduces no closing term — it removes a push and
  adds none — but it does not close that geometry either, and does not claim to.
* ⚠ **BQ-C1'S FROZEN INSTRUMENT NO LONGER RE-ANCHORS AT THIS HEAD.**
  `scripts/probes/bq-c1-attempt-window-census.ts` pins the `this.pendingControl = null` sites by
  LINE and pins the shipped cushion block as ONE contiguous needle. This seam adds lines above
  those sites and puts the branch between the `release` clamp and the two assignments, so both
  receipts refer to the dispatch HEAD (`83e8a95`) and not to this commit. **The banked census is
  untouched** (it ran at its own frozen head); **BQ-T1, which reuses that instrument, must
  re-anchor it at its own head before the battery** (§DEVIATIONS 2).
* ⚠ **WITH THE FLAG OFF THE SHIPPED LAW STANDS BYTE FOR BYTE**, and this stage states **NO
  FOOTBALL CLAIM**. ARMED means "the capacity exists behind a shut door", not that the world is
  better, not that any face moves. Whether the intended target's non-possession share falls, and
  what it costs elsewhere, is **BQ-T1** (#384 item 6(v)).

## §DEVIATIONS (declared by the executor; the commander disposes)

1. **THE FIXTURE'S CONTACT DISTANCE.** #384 item 6(iii) and the dispatch specify `d` = 1.20 m.
   MEASURED at this head: at 1.20 m the shut fixture ends the window INSIDE the bar and the roll
   runs, so the fixture would not have expressed the mechanism it exists to express. `d` is
   therefore **DERIVED** as `CONTROL_RADIUS − CONTACT_CONTROL_RETENTION_MARGIN` (both IMPORTED;
   no new constant), and the 1.20 m case is pinned as an explicit COUNTER-RECEIPT. The
   substantive requirement — SHUT loses at the margin, ARMED keeps and the roll runs — is met in
   full.
2. **BQ-C1'S PROBE ANCHORS.** See §4. No frozen instrument was EDITED (⛔ a banked census's
   instrument is not this stage's to touch); the consequence is declared for BQ-T1.
3. **`League.ts`'s union line.** `'bqCushion'` was put on its OWN line rather than appended to
   `'bfFacingCost'`'s, so that BF-T0's existing line pin stays exact. **ZERO narrowed pins** in
   this stage (the BF-T0 §CORR 5 precedent: reword/relocate rather than narrow someone else's
   pin).
