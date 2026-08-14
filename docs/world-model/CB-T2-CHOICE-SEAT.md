# CB T2 — THE LAYER-2 CHOICE SEAT (`cbChoiceSeat`, 这一脚要不要过人)

Status: **FROZEN (this half), then BUILT + RUN.** Per **#266.3(c)** everything from §ROW-0 to
§NON-CLAIMS — the design, the ⭐ CURRENCY DERIVATION, the gene family and its DERIVED neutral
form, the arming checklist, the read-fork and pin inventories, the ⭐⭐ MACHINE-DERIVED liveness
rule, the frozen gate list, the frozen REPORTED read list, the N rule and the seed ledger — lands
in **its own commit BEFORE any battery is read**, so git corroborates frozen-before-sight. The
measured numbers arrive only in [§RESULT](#result) at the foot, and every number there is quoted
FROM the committed artifact (#229.2).

Authority chain: the **CARRY-BEAT CONTRACT**
[`CB-CARRY-BEAT-CONTRACT.md`](CB-CARRY-BEAT-CONTRACT.md) **§2 M-CB.2** and **§3 CB-T2**,
dispatched by ruling **#268.4** with four bindings, each a named deliverable below. Instrument
inputs: [`CB-T0-DORMANT-LAYER1-SEAM.md`](CB-T0-DORMANT-LAYER1-SEAM.md) (the seam, its arming
checklist, its §COMMANDER CORRECTIONS) and [`CB-T1-BEATEN-EVENT-EXAM.md`](CB-T1-BEATEN-EVENT-EXAM.md)
(the beaten event, the L2b/L3 levels this stage must RE-READ, its §COMMANDER CORRECTIONS).
Form precedents: [`DV-T0-DORMANT-SEAM.md`](DV-T0-DORMANT-SEAM.md) and
[`DLC-T0S-DORMANT-SEAM.md`](DLC-T0S-DORMANT-SEAM.md) — ⭐⭐ **THE BANKED PRICER IDIOM**: a seam
that emits CANDIDATES and lets the brain's own hoisted `groundCandidate` price them, all into ONE
argmax. Hygiene canon in full: **#250.3** · **#251.3** · **#256.2/.3** · **#258.3** · **#259.3** ·
**#260.2** · **#261.2** · **#262.2** · **#263.2** · **#264.2** · **#266.2(i)** · **#266.3(a,b,c)**
· **#267.2** · ⭐⭐ **#268.3(a)** (LIVENESS BY MACHINE) · **#268.2(iii)** (promise only what the
generator emits) · **#268.2(iv)** (booked = walked) · **#163** · **#181.2** · **#200** · **#203** ·
**#229.2** · **#236** · **#247** · **#248.1**.

---

## §ROW-0 — ⭐⭐ THE BOTH-DOORS-ARMED FIRST ROW (binding (a), #268.3(3)) — RUN AND COMMITTED BEFORE THIS FREEZE

Ruling #268.3(3) ratified it: H-CB.1's sentence spans BOTH mechanisms, and CB-T0's smoke and
CB-T1's exam each armed one door at a time. The row is **instrument-only** (`src/**` byte-untouched
at the time it ran, checked in-probe), uses **CB-T1's frozen doser** re-implemented from that stage
doc's published §FORM text, and landed in its own commit **`49ca172`** — BEFORE this design was
frozen, so its numbers could not shape it. Probe
[`../../scripts/probes/cb-t2-both-doors-row.ts`](../../scripts/probes/cb-t2-both-doors-row.ts),
artifact [`data/cb-t2-both-doors-row.json`](data/cb-t2-both-doors-row.json), `resultSha256`
`816d4780…`, 12 seeds, block **12,474,000–011**, four paired arms, 5.0 s.

| ruler | OFF | COMMIT | TOUCH | ⭐ **BOTH** |
| --- | ---: | ---: | ---: | ---: |
| standing duels / match | 43.167 | 36.917 | 1.167 | **1.500** |
| take rate | 36.29 % | 7.00 % | 35.71 % *(14 duels)* | **5.56 %** *(18 duels)* |
| armed challenges (the door-a population) | 0 | **443** | 0 | ⚠ **18** |
| geometric-miss share | — | 48.08 % | — | 66.67 % |
| mean recovery interval | — | 0.7899 s | — | 0.8134 s |
| knocks | 0 | 0 | 1,600 | **1,561** |
| challengers aimed past | 0 | 0 | 2,043 | 1,996 |
| predicate-beaten share | — | — | 62.07 % | **63.63 %** |
| clean beats (every challenger) | — | — | 960 | 959 |
| mean push | — | — | 2.818 m | 2.833 m |
| race captured inside the window | — | — | 27.03 % | 27.12 % |
| turnovers / match | 48.667 | 42.667 | 78.417 | 75.667 |
| mean spell (this probe's own ruler) | 5.040 s | 5.794 s | 3.117 s | 3.231 s |
| goals / match | 2.083 | 2.917 | 1.417 | 1.333 |
| fouls / match | 5.083 | 7.500 | 0.083 | 0.250 |
| pressed share (first receptions) | 69.07 % | 66.47 % | 73.54 % | 72.39 % |

⭐⭐ **WHAT THE BOTH-ARMED WORLD DOES — AND THE ANSWER IS THAT THE TWO DOORS BARELY MEET.** Under
CB-T1's doser the touch door **starves the duel**: standing duels fall from 43.2 to 1.5 per match,
so the commitment door — which prices duels and nothing else — has **18 challenges in twelve
matches to price** instead of 443. Every knock-side quantity is within a point of the touch-alone
arm (beaten share 62.07 → 63.63 %, retention-at-the-marker 7.72 → 7.81 %, captures 27.03 → 27.12 %,
push 2.818 → 2.833 m). ⇒ **DOUBT-3's question — "does the beaten lunger's shortened recovery change
the touch-past's race?" — is answered NO at doser cadence, for a mechanical reason: at 130 knocks a
match the ball is loose so often that lunges barely happen.** The honest reading is that the two
doors are near-orthogonal *in the doser's world*, and that a world with a CHOOSER — where knocks are
rare — is the only place the interaction can be seen at all. That is this stage's BOTH arm.

⚠ **DECLARED**: this probe's spell/pressed rulers are its own reduced re-implementations (a spell
here closes on a change of controlling side and carries the loose ticks between); their LEVELS are
not commensurable with CB-C0's or CB-T1's, only their contrast ACROSS these four arms is. **No
football conclusion is drawn from the touch/both columns** — they are the doser's world, not a
policy (CB-T0 §DEV 6, CB-T1 §DEV 8, unchanged).

---

## §LAW — the frozen law of the choice seat

```text
THE DOOR
  the choice seat  ⇔ match.cbChoiceSeat === true      [NEW flag — the CHOICE]
                     AND the team's `cbCarryProneness` gene is NON-ABSENT
                     AND the deciding body is an outfield carrier off his kick cooldown,
                         not a restart taker (the incumbent block's own conjuncts)
  a chosen knock FIRES ⇔ additionally match.cbTouchPast === true   [CB-T0's door — the CAPABILITY]
                         and CB-T0's own fork conjuncts hold at the next owned tick.
  ⇒ the door shut, or the gene absent ⇒ the incumbent world, byte for byte.
  ⇒ the door armed with the gene PRESENT AT ZERO ⇒ the seat forms, the whole compass is
    priced, and the world is STILL byte-identical — the neutral form, measured (G-ZERO).

⭐⭐ THE CANDIDATES (src/ai/carryChoiceSeat.ts)
  A TOUCH-PAST IS A DELIVERY WHOSE RECEIVER IS THE CARRIER HIMSELF — he knocks the ball into
  space and runs onto it. That sentence is the whole design: it is what lets the knock enter
  THE ONE TABLE beside the pass candidates without a single new scoring statement.

  THE COMPASS, derived — never a chosen K:
      anchor  = the INCUMBENT push's own bearing (`performDribbleTouch`: the direction of
                TRAVEL, `heading` as the slow fallback) ⇒ STEP 0 IS TODAY'S KNOCK
      pushMax = touchPastPushFor(p, anchor, [])        the engine's push law at its own
                open-field ceiling for THIS body (aheadD = 14 ⇒ open = 9)
      speedMax= |v| + max(pushMax, 0.8)                the engine's own release law
      L       = rolledDistance(speedMax, touchRaceWindow(pushMax))   how far the knock gets
                by the time its OWN race resolves
      Δ       = 2·asin( CONTROL_RADIUS / (2·L) )       the chord condition
      n       = ceil( 2π / Δ )                         THE WHOLE CIRCLE
      dir(k)  = anchor rotated by k·(2π/n),  k = 0 … n−1
  Two knocks whose landing points sit closer together than CONTROL_RADIUS — the engine's own
  answer to "how near must a body be to do anything about a loose ball" — are THE SAME KNOCK
  to every body on the pitch. So the sampling resolution is the world's, not an engineer's,
  and n is a per-body number that the smoke REPORTS rather than a constant anyone typed.
  ⭐ THE WHOLE CIRCLE, deliberately: CB-C0 proved the duel frontal by construction (0 of 9,956
  challenges from behind); CB-T0 opened the back half; a chooser that sampled only the front
  would close it again by omission.

  EACH CANDIDATE, in the engine's own quantities and no others:
      push(k)  = touchPastPushFor(p, dir(k), opponents)      ⭐ ONE OWNER — the very function
                 `performTouchPast` executes with (hoisted out of it, pure code motion)
      speed(k) = |v| + max(push(k), 0.8)
      W(k)     = touchRaceWindow(push(k))
      aim(k)   = ball.pos + dir(k) · rolledDistance(speed(k), W(k))
  ⭐ WHY `aim` IS THE BALL AT `t = W`: W is the interval the carrier cannot re-collect in,
  which IS how long the loose-ball race lasts (CB-T0 §LAW) and the interval `beatsDefender`
  samples over. The ball at t = W is the ball at the moment the world decides whose it is —
  the RECEPTION POINT of a knock, in exactly the sense `mate.pos` is a pass's.

⭐⭐ THE PRICE — THE ONE TABLE'S OWN CURRENCY, NOT A SECOND PATH (M-CB.2)
      score_knock(k) = groundCandidate( p, aim(k), |aim(k) − p.pos| ).s  ·  cbCarryProneness
  `groundCandidate` is the brain's OWN hoisted delivery pricer — the same function, the same
  call shape, that prices the to-feet candidate, the banked PTP-T0 led candidate and the
  banked DLC-T0s strike-plane candidates, and which already ends in the banked DV-T0 risk
  price. The knock is handed to it with the ACTUAL receiver (`p`) and the delivery's own
  flight (`|aim − p.pos|`), so nothing is adapted, wrapped, re-weighted or special-cased.
  ⇒ NO taste constant is introduced anywhere in this stage. The ONLY new multiplicand is the
  born-absent gene itself.

THE ENTRY, AND THE TIE
  The knock is pushed into `cands` LAST, after every incumbent candidate. `Array.sort` is
  stable, so a knock that merely TIES the incumbent's best stays behind it (the DLC-T0s
  zero-point precedent: every tie is the incumbent's). This is also what makes the
  present-at-zero gene inert: its score is exactly 0.

THE ARMING
  top === the knock candidate ⇒ match.armTouchPast(p, dir, backHalf) — the `armO2Look` idiom,
  writing CB-T0's OWN `forcedTouchPast` seam, which CB-T0's ONE fork consumes at this body's
  next owned tick. Otherwise ⇒ match.clearTouchPastArming(p), which withdraws an arming that
  names HIM and can never touch anyone else's ⇒ NO AIM EVER FIRES STALE.
  ⭐ ZERO NEW ACTION TYPES: the knock carries the incumbent CARRY label, so the executor's
  switch runs its shipped `default` branch and no executor, render or animation surface moves
  (the `puntCand` / `cutbackCand` idiom — a candidate identified by OBJECT IDENTITY, never by
  a new label).

NO PREDICATES (#200) — the complete conditional set of this stage is
  GATE     the flag fork + the gene's presence + the incumbent block's own conjuncts.
  GUARD    the degenerate `L ≤ CONTROL_RADIUS/2` compass collapse and the `|v| > 0.5` anchor
           fallback (the incumbent push's own).
  ARGMAX   the table's own comparison, which is the shipped one.
```

### ⭐ The traced quantities — every one, with its source

| quantity | source | what it is here |
| --- | --- | --- |
| the push law (cone, keeper envelope, 14 m ceiling, line guard) | `mechanics.ts` `touchPastPushFor`, hoisted verbatim out of `performTouchPast` | the length of EVERY candidate knock, ONE owner shared with the execution |
| `touchRaceWindow` · `rolledDistance` | `src/sim/carryBeat.ts` (CB-T0) | the race window and the engine's own turf decay |
| `CONTROL_RADIUS` = 1.25 m | `src/sim/constants.ts` | the compass RESOLUTION — the reach a body needs to contest a loose ball |
| the anchor bearing | `mechanics.ts` `performDribbleTouch` (`travel`, heading fallback) | compass step 0 = today's knock |
| `groundCandidate` | `src/ai/PlayerBrain.ts` (hoisted at DLC-T0) | ⭐ THE PRICE, in the one table's own currency |
| `cbCarryProneness` ∈ [0,1] | this stage's gene, born absent | the appetite, and the ONLY new multiplicand |

⭐ **THERE IS NO NEW NUMERAL IN `src/**` FROM THIS STAGE** beyond the algebra of its own closed
forms (the `2` of a chord, the `2π` of a circle). G-TRACE reads the shared quantities back out of
`src/**` at run time.

## §CURRENCY — ⭐⭐ THE DERIVATION, and where the one-table rule STRAINS (#268.4's named deliverable)

**The question M-CB.2 forces:** the pass table's currency is a utility score built as
`W.passBase + lane·W.passLaneW + open·W.passOpenW`, multiplied by forward-gain, style and
distance terms. Can a KNOCK be priced in that quantity without a new hand-painted constant?

**The derivation, term by term** — every input of `groundCandidate` is a function of
`(from, aim, receiver)`, and a knock supplies all three honestly:

| the pricer's term | what it reads | what it means for a knock | honest? |
| --- | --- | --- | --- |
| `lane = laneOpenness(p.pos, aim, opp)` | the corridor from the ball to the aim | can this knock actually get there, or is a body in its path | ✅ exact |
| `open = opennessAt(aim, opp)` | how free the reception point is | how free the space he is knocking INTO is | ✅ exact |
| `gain` | forward progress of `aim` vs the carrier | how far up the pitch the knock takes the ball | ✅ exact |
| the forward-gain / back-pass / risk-lane terms | `gain`, `lane`, `riskTolerance` | the same judgements, on the knock | ✅ exact |
| `d` (flight bands) | `|aim − from|` | the knock's own length | ✅ exact |
| the DV-T0 risk price | exposure + loss belief at the aim | the knock's own risk, priced by the banked seat | ✅ exact, and free |
| `passMul`'s style chain | `passBias`, `tempo`, mode tilts | ⚠ a knock scaled by the PASSING gene | ⚠ **STRAIN 1** |
| the offside term | `team.localX(mate.pos.x) > offLine` | ⚠ the carrier judged offside **against himself** | ⚠ **STRAIN 1** |
| the overlap bonus | `team.overlapper === mate.index` | ⚠ a carrier who is his own team's licensed overlapper bonuses his own knock | ⚠ **STRAIN 1** |
| `kickMisalignment(p, norm(mate.pos − p.pos))` | body orientation | ⚠ a zero vector for a self-delivery ⇒ the zero-safe `norm` gives a flat 0.5 misalignment | ⚠ **STRAIN 1** |
| the wall-return / hand-it-back / third-man tests | `lp.passerGid`, `mate.action` | dead by construction on a self-delivery (no pass to self exists) | ✅ inert |

⭐ **THE VERDICT OF THE DERIVATION: THE CURRENCY PRICES A KNOCK, AND IT DOES SO WITH ZERO NEW
CONSTANTS.** F-CB2-a (the pre-named fork "the table cannot price a knock without inventing
something") **does not fire**. Nothing was hand-painted, nothing was normalised, no scale was
chosen.

### ⚠ STRAIN 1 — the SELF-DELIVERY degeneracies, DECLARED AND MEASURED, never patched

Four terms of the shared pricer are defined against a *counterparty*, and a self-delivery has none.
They are left EXACTLY AS THE SHARED PRICER COMPUTES THEM, because a per-seam exception is precisely
what "one table, no per-seam special cases" forbids — and instead their firing rates are MEASURED
and REPORTED (§READ R9). **The commander is asked to rule on this in §DOUBTS.** The three honest
alternatives, none taken here: (甲) leave it, measure it, and let a later slice decide (built);
(乙) hoist the counterparty-relative terms out of the shared pricer into a receiver-scoped block —
a refactor of a BANKED pricer, hence a second change in the same round (#31.1); (丙) give the knock
its own pricing path — which is the one thing M-CB.2 forbids by name.

### ⚠ STRAIN 2 — "direction × timing", and the engine gives exactly ONE control

M-CB.2's words are "touch-past candidates (**direction × timing**)". The engine as CB-T0 built it
gives the knock **exactly one control parameter**: `performTouchPast(match, p, dir)` — the push, the
release speed, the race window and the roll are all LAWS of the world, derived from the chosen line
and the body's own state. So:

* **DIRECTION** is a real candidate axis and is built in full (the whole compass).
* **TIMING** is expressed as the **ACROSS-TICK** axis: the candidate table is re-priced at every
  decision against the live geometry, and the argmax decides WHEN the knock happens. The smoke
  MEASURES whether that timing is real (§READ R2: the state of the nearest challenger at the
  moment a knock is chosen, against the moments it is not).
* ⛔ **AN IN-TICK TIMING AXIS IS NOT INVENTED HERE.** Building one would mean a new engine
  control (a delayed release) — a MECHANISM change, not a pricing change, and out of this
  stage's scope. Named for the commander, not built.

## §GENE — the style family, and the DERIVED neutral form (#268.4's named deliverable)

**`cbCarryProneness ∈ [0, 1]`, ONE team-level scalar, BORN ABSENT** — the contract's *riskTolerance
family*: an unsigned taste in the same domain as the shipped genes. Birth discipline is
`dvExposureWeight`'s verbatim: outside `GENE_KEYS`; `randomGenome` / `mutateGenome` /
`crossoverGenomes` / `geneDistance` draw the EXACT same rng in the EXACT same order as HEAD;
`JSON.stringify` omits the key; it gains a value ONLY under its own explicit `evolveCarryChoice`
opt-in, whose draws sit **strictly after** the delivery-value block, so no existing opt-in run's
stream moves. No franchise write, no serialization, no save field.

⭐⭐ **THE NEUTRAL FORM IS DERIVED, NOT CHOSEN.** Two worlds must agree:

```text
  (i)  gene ABSENT   ⇒ no seat ⇒ no compass, no candidate, no pricing call  ⇒ the shipped world
  (ii) gene PRESENT AT 0 ⇒ the seat forms and prices its whole compass      ⇒ must ALSO be the
                                                                              shipped world
  ⇒ the appetite must enter such that value 0 annihilates the knock's score and NOTHING else.
  ⇒ it enters MULTIPLICATIVELY, and the multiplier is the GENE ITSELF:
        score_knock = groundCandidate(...).s · cbCarryProneness
  ⇒ no weight, no base, no width, no centre — i.e. ZERO taste constants (#200/#236).
```

Requiring (i) ≡ (ii) is what *forces* the form; nothing here was tuned, and the identity is
**MEASURED (G-ZERO)**, not assumed. ⚠ **A DECLARED CONSEQUENCE, stated ex ante**: with the
multiplier in [0, 1] the knock can never outscore the delivery price it is derived from, so a team
must evolve toward 1 for knocks to be competitive at all — the gene spans "never carries past a
man" to "values the knock at exactly what the delivery table says it is worth". **NO EVOLUTION EXAM
RIDES HERE** (#268.4): the gene exists and is plumbed; whether selection finds a dribbling style is
a later arc's.

## §ARMING — ⭐ THE ARMING CHECKLIST, RE-DERIVED (never inherited)

| # | to see… | you must | why |
| --- | --- | --- | --- |
| 1 | the seat exist at all | `cbChoiceSeat: true` **and** the team's `cbCarryProneness` NON-ABSENT | the one fork + the born-absent gate |
| 2 | a candidate priced | the above **and** an on-ball decision by an OUTFIELD carrier who is **off his `kickCooldown`** and is **not a restart taker** (`mustKick`) | the incumbent pass block's own conjuncts — the seat sits inside them |
| 3 | a knock CHOSEN | the above **and** the knock winning the table outright (ties go to the incumbent, by push order) | the argmax IS the choice |
| 4 | a knock actually FIRE | the above **and** `cbTouchPast: true` **and** CB-T0's own fork conjuncts at the next owned tick (still the owner, phase `playing`, outfield, no keeper hold, off the kick cooldown) | ⭐ the CHOICE and the CAPABILITY are two separate doors, on purpose |
| 5 | a BEATEN defender counted | the above **and** an opponent inside `CONTEST_RADIUS` at the knock whose own motion model cannot meet it inside the race window | CB-T0's ledger scope; it gates no mechanic |
| 6 | the armed duel priced beside it | additionally `cbCommitPhysics: true` | CB-T0's door (a) — this stage's BOTH arm |
| 7 | a LEAGUE season with the seat | `matchFlags.cbChoiceSeat` set explicitly on the League | otherwise the door dies with the match; no production League sets it |

**Nothing in production satisfies even #1**: the flag is absent from `a4World.ts`, from every preset
and from every play-test world, and no production genome carries the gene.

## §SEAM — the read-fork and pin inventories (NAMED deliverables)

### The READ-FORK INVENTORY

| # | site | file | what it feeds |
| --- | --- | --- | --- |
| **1** | `match.cbChoiceSeat && !mustKick && p.role !== 'GK' ? carryChoiceSeatOf(g) : null` | `src/ai/PlayerBrain.ts` (on-ball decision) | THE ONE CHOICE FORK — the seat, hence the compass, hence the candidates |
| **2** | `if (cbSeat !== null) { … armTouchPast / clearTouchPastArming }` | `src/ai/PlayerBrain.ts` (before the action switch) | the arming, the withdrawal and the price-gap bookkeeping |
| **3** | `this.cbChoiceSeat = cfg.cbChoiceSeat ?? false;` | `src/sim/Match.ts` (constructor) | the arming rule itself |

Downstream, counted separately: `cbChoiceLedger`'s write sites (pure bookkeeping, never read by the
sim), the `carryChoiceSeat.ts` module body, and the `touchPastPushFor` hoist (pure code motion, one
owner shared with `performTouchPast`). Every other `src/**` occurrence is a declaration, an init, a
type, an import or the League union key — enumerated in the artifact with file:line and class,
**zero unclassified** (G-FORK).

### THE `src/**` DIFF SURFACE, declared in full (six files, no others)

`src/ai/carryChoiceSeat.ts` (new) · `src/ai/PlayerBrain.ts` (the fork + the arming) ·
`src/sim/mechanics.ts` (the `touchPastPushFor` hoist ONLY) · `src/sim/Match.ts` (flag, ledger, two
arming methods) · `src/evolution/genome.ts` (the born-absent gene, its accessor, its opt-in) ·
`src/sim/League.ts` (the `matchFlags` union key). Plus `tests/carryChoiceSeat.test.ts` (new).
**No other file in `src/**` or `tests/**` may move** (G-PINS).

### The PIN INVENTORY

| # | pin | class | disposition |
| --- | --- | --- | --- |
| 1 | ⭐⭐ the production fingerprint `57b0bdab…c673` | league identity | UNTOUCHED — recomputed in-probe (G-IDENT / X-FP-PROD) |
| 2 | ⭐ the banked seam modules byte-untouched (`whetherEye.ts`, `holdAccountBook.ts`, `deliveryAccountBook.ts`, `deliveryValueSeat.ts`, `strikePlaneSeat.ts`, `passLeadSeat.ts`, `carryBeat.ts`, `a4World.ts`) | source text | must hold |
| 3 | ⭐ `performTouchPast`'s RELEASE, ledger and beaten set byte-untouched (only the push COMPUTATION moved out) | source text | must hold |
| 4 | the `src/**` diff CONFINED to the six declared files | source text | must hold |
| 5 | ZERO new action types — `src/sim/types.ts`'s `ActionType` and the render layer byte-untouched | mechanism | must hold |
| 6 | the save round-trip pins | persistence | UNTOUCHED — nothing here is serialized |
| 7 | the whole suite | everything downstream | G-SUITE runs it in full. **No pre-existing test file is edited** |

## §LIVENESS — ⭐⭐ THE MACHINE-DERIVED COVERAGE MAP (#268.3(a), NEW CANON, third-strike upgrade)

Eyeball liveness audits failed three consecutive rounds (#266.3(b) → #267.2(iii) → #268.2(i), the
last at scale: 21 of 55 conjuncts dead). This stage does not run one. Instead:

```text
1. EVERY gate is a PREDICATE FUNCTION returning a conjunct object, registered with a cheap
   SAMPLE INPUT.
2. AT STARTUP — before a single match is walked — the probe CALLS each predicate on its sample
   and ENUMERATES `Object.keys(...)`. That key set IS the coverage map. It is DERIVED FROM THE
   GATE OBJECTS THEMSELVES; no map is written by hand anywhere in this probe.
3. Every enumerated conjunct must be named by at least one registered mutant. If ANY is not,
   the probe THROWS AND REFUSES TO RUN (exit 3, a build error, not a warning) — no battery, no
   artifact, no seeds walked.
4. Every mutant must FLIP its own conjunct and LEAVE EVERY SIBLING STANDING (the exactly-one
   rule, CB-T1's built form). A mutant that fails either is a RED.
⇒ AN UNFALSIFIABLE CONJUNCT IS FORBIDDEN FROM A GATE (#268.3(a)). Claims that cannot be flipped
  by any achievable input ride as COMMENTS or as assertions OUTSIDE the gate table — never as
  gated conjuncts. The refusal path is EXERCISED by hand and published in §CHECKS.
```

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

⭐ #250.3(i): the probe freezes this list as `FROZEN_GATE_NAMES` and the artifact's gate-object key
set must equal it exactly (minus G-SUITE, which runs outside) or the probe exits 1 before writing.
⭐ #266.3(a): the hashed body excludes ALL invocation context; §HASH's three-part acceptance test is
CB-T1's, kept whole, including the cross-machine re-derivation.

| # | gate | predicate | kind |
| --- | --- | --- | --- |
| 1 | **G-DET** | the deterministic core runs **twice**, canonical digests identical; pass B never reads pass A's memo | HARD |
| 2 | **X-FP-PROD** | the shipped league fingerprint `57b0bdab…c673` re-derived **in this process**, unchanged | HARD |
| 3 | **G-IDENT** | the 2-season league hash on 3 league seeds equals the frozen pre-change baselines (1337 · 20260728 · 424242), all recomputed in-probe | HARD |
| 4 | **G-OFF** | whole-run signature incl. the rng stream state: the flag ABSENT ≡ FALSE, in BOTH world shapes, on every receipt seed | HARD |
| 5 | ⭐ **G-BORN** | the door ARMED with the gene ABSENT ≡ off, byte for byte, both shapes, every receipt seed — **and the machinery is LIVE**: the same door with the gene dosed forms seats and prices candidates | HARD |
| 6 | ⭐⭐ **G-ZERO** | **THE DERIVED NEUTRAL FORM.** With the gene PRESENT AT ZERO: seats form, candidates are priced, **chosen = 0**, and the world is byte-identical to off — on every receipt seed, both shapes | HARD |
| 7 | ⭐⭐ **G-CROSS** | **THE DOORS MATRIX (#228)**: for every enumerated banked construction flag F **including CB-T0's two doors**, `sig(F, CB-T2 key ABSENT)` = `sig(F, key FALSE)` = `sig(F, key ON with the gene absent)`; plus DORMANT-ALL and DISCRIMINATION (an armed-choice world is no banked flag's world) | HARD |
| 8 | ⭐ **G-BITE** | the seat at full appetite DIVERGES from off, and the FIRST divergent tick is at or after a tick at which a knock was armed — non-vacuity, ⚠ a divergence claim, never a target flip (#250.3) | HARD |
| 9 | ⭐⭐ **G-COMPASS** | the compass is DERIVED and WHOLE: step 0 IS the incumbent bearing · the chord between adjacent aims is ≤ `CONTROL_RADIUS` (within float) · the BACK half is populated · `n` RESPONDS to the body's own state (two bodies, two counts) · the candidate set is deterministic | HARD |
| 10 | ⭐⭐ **G-ONE-OWNER** | every candidate's push IS `touchPastPushFor` on its own line **and** — the live half — for every knock the engine actually fired, the push the ENGINE wrote (inverted from the carrier's own `kickCooldown`) equals the chosen candidate's push, **zero tolerated mismatches** | HARD |
| 11 | ⭐⭐ **G-ONE-TABLE** | no second scoring path exists: the seat module's executable source contains **no** policy-weight token (`W.`), no `score`, no genome read beyond its own accessor, and its import list is closed; and in-engine every seat decision priced **exactly one** knock entry into `cands` and **no pass was ever aimed at the carrier himself** | HARD |
| 12 | ⭐ **G-ARMING** | every arming names the deciding body; armings ≤ seat decisions; every knock the engine fired in these arms was preceded by a seat arming (**no probe writes `forcedTouchPast` in any arm of this battery**); armings and withdrawals reconcile with the ledger | HARD |
| 13 | **G-RACE** | the race window of every knock IS the engine-written `kickCooldown` (never a probe constant); the captor is read from `match.ball.owner`; every knock carries a NAMED resolution | HARD |
| 14 | ⭐ **G-LEVELS** | the L2b/L3 RE-READS and the two missing cuts re-derive from the stored per-seed cells ALONE, and each is computed on the CHOOSER's own population (never the doser's) | HARD |
| 15 | **G-CELLS** | per-seed/per-cell counts are IN the artifact and every published rate, level and CI re-derives from those stored cells alone (#256.3) | HARD |
| 16 | **G-BOOT** | the paired cluster bootstrap: 2,000 resamples, cluster = seed, **ONE shared resample-index matrix** proved shared across every quantity | HARD |
| 17 | **G-NONVAC** | non-vacuity at claim grain for every published cell: knocks > 0 in both armed arms, both L3 outcomes present, both L2b sets non-empty, every recovery leg populated in the BOTH arm | HARD |
| 18 | **G-LEDGER** | `cbChoiceLedger` is all-zero in the OFF arm and in bare production; CB-T0's `cbLedger` duel counters are 0 in the arm without the commitment door; both armed arms non-vacuous | HARD |
| 19 | **G-TRACE** | every shared quantity READ OUT of `src/**` at run time and equal: `CONTROL_RADIUS` · the touch constants · the push law present VERBATIM in `touchPastPushFor` · the anchor rule present in `performDribbleTouch` · **zero new numerals** in the seat module beyond its declared algebra | HARD |
| 20 | **G-FORK** | the READ-FORK INVENTORY: exactly ONE choice fork, ONE arming block, ONE constructor init; every other `src/**` occurrence enumerated with file:line and class, **zero unclassified** | HARD |
| 21 | **G-PINS** | the §PINS inventory recomputed: the six-file diff surface, the banked modules byte-untouched, `performTouchPast`'s release untouched, `types.ts` + the render layer untouched, and **zero pre-existing test files edited** | HARD |
| 22 | **G-SEED** | every interval this stage consumes proved disjoint from the COMPLETE consumed ledger and ordered; ⭐ **BOOKED = WALKED** (#268.2(iv)): the ledger records only blocks this run actually walked | HARD |
| 23 | **G-STATS** | stats base 110,000, step 200, min gap ≥ 200 to every published base | HARD |
| 24 | ⭐ **G-ENV-CLEAN** | WHITELIST-OR-REFUSE incl. the ENGINE's own doors; every override makes the run a PREFLIGHT routed onto the guard block, reds this gate, and may never write a canonical repo path (parse time AND resolved absolute path) | HARD |
| 25 | ⭐⭐ **G-HASH-ENVELOPE** | the three-part acceptance test: mutated-envelope digest identity, re-derivation from the written body alone, and the forbidden-key deep scan | HARD |
| 26 | **G-N** | N\* IS the frozen §NRULE output computed from the committed sizing artifact (two numbers only), and the battery ran at N\* | HARD |
| 27 | ⭐⭐ **G-MUTANTS** | the ⭐ MACHINE-DERIVED coverage map (§LIVENESS): every conjunct enumerated FROM THE GATE OBJECTS, every one carrying a mutant that RE-INVOKES its gate's own function, flips exactly that conjunct and leaves every sibling standing; `uncoveredConjuncts` empty **or the probe refuses to run** | HARD |
| 28 | **G-SUITE** | FULL `npm test` green + `npx tsc --noEmit` clean, run OUTSIDE the probe; the known load-timeout pattern dispositioned only if each red file reproduces GREEN ALONE on this tree | HARD |

**Hand-counted headline**: rows 1–27 are computed in the probe and land in the artifact's `gates`
object; **G-SUITE** runs outside it. Every headline in this document quotes **27 probe gates +
G-SUITE = 28**.

**Pre-named FAIL ⇒ STOP** (#179's red lines): any HARD gate failing, any `src` diff outside the six
declared files, any seed-block collision, any measured value from a census reaching `src/**`, or any
existing test breaking (a STOP-and-report, never a test edit).

## §READ — the frozen REPORTED read list (⭐ #268.2(iii): promise ONLY what the generator emits)

Every item below is emitted by the results generator; nothing else is promised. **ALL REPORTED,
NEVER GATED** — this rung ships nothing and the contract's rung-one honesty stands.

| # | read | where |
| --- | --- | --- |
| **R1** | **THE KNOCK POPULATION**: seat decisions/match · candidates per decision (the realized compass size) · knocks CHOSEN/match · chosen share of seat decisions · chosen-to-fired · the push distribution (min/q1/median/q3/mean/max) · the aim distance distribution | CHOICE + BOTH arms |
| **R2** | ⭐ **COMPASS USAGE**: the chosen step as a bearing offset from the incumbent anchor, in octants · the **BACK-half share** · the step-0 (today's knock) share · and the TIMING read: the nearest challenger's distance and closing speed at chosen vs unchosen seat decisions | CHOICE + BOTH |
| **R3** | ⭐ **THE PRICE GAP** (the §STRAIN evidence): mean best-knock score vs mean winning-candidate score over seat decisions, and the chosen share it implies | CHOICE + BOTH |
| **R4** | ⭐⭐ **THE L2b RE-READ** (binding (b)): re-engagement ticks (first tick inside `CB_TACKLE_RADIUS` of the ball, horizon 2.4 s) for predicate-BEATEN vs NOT-beaten challengers of **CHOSEN** knocks, medians + censored shares, beside the median race window — and beside CB-T1's own doser-population levels, labelled as a different population | CHOICE + BOTH |
| **R5** | ⭐⭐ **THE L3 RE-READ** (binding (b)): knock retention at the engine's own 1.6 s marker horizon vs the OFF arm's retention at seat-eligible shadow moments, same horizon, paired-bootstrap CI on the gap | all three arms |
| **R6** | ⭐ **MISSING CUT A** (binding (c), #268.2(iii)): **commitment-arm separation at t0 + recovery, CARRIER-ANCHORED** — `|defender − CARRIER|` at the miss instant and again at `t0 + recovery`, with t0 the miss | BOTH arm |
| **R7** | ⭐ **MISSING CUT B** (binding (c)): **the recovery LEGS, not total-only** — brake / turn / close / total, per CB-C0 arrival-speed bin, with the min in every row | BOTH arm |
| **R8** | **WORLD EFFECTS** vs the OFF arm, beside CB-C0's bare-production reference (a DIFFERENT VENUE, laid beside, never differenced): turnovers · spell · standing duels · take rate · goals · shots · fouls · yellows · reds · pressed share | all three arms |
| **R9** | ⭐ **§STRAIN 1's FIRING RATES**: the share of seat decisions at which the carrier was beyond the opponents' deepest outfield body (the offside term's own condition) and at which he was his team's licensed overlapper | CHOICE + BOTH |

**THE ARMS, frozen** — paired on the same seeds, in the ARMED SUBSTRATE (`a4MatchFlags(3)`, the
venue CB-T0's smoke and CB-T1's exam both used):

| arm | doors | gene |
| --- | --- | --- |
| **OFF** | every CB flag false | absent |
| **CHOICE** | `cbChoiceSeat` + `cbTouchPast` | `cbCarryProneness = 1` |
| ⭐ **BOTH** | `cbChoiceSeat` + `cbTouchPast` + `cbCommitPhysics` | `cbCarryProneness = 1` |

⚠ **THE DOSE IS THE DOMAIN'S OWN ENDPOINT (1.0), DECLARED**: it is the CAPABILITY dose — the
appetite at which the seat's candidates compete on the table's own terms — not a tuned value, and
not a claim that any team should carry it. DV-T1's hand-dose precedent.

## §NRULE — frozen before the sizing smoke ran

```text
N* = min( ceil(200 / rarestScoredCellPerMatch) ↑12,
          floor(0.5 h / (msPerMatch × 3 arms × 2 X-DET)),
          200 )
```

⭐ **THE TARGET IS 200 EVENTS, NOT 60, AND HERE IS WHY, EX ANTE**: CB-C0/CB-T0/CB-T1 all targeted 60
because they needed an ORDERING to be readable (relative SE ≈ 13 %). This stage is bound by
#268.3(1) to **RE-READ LEVELS** and lay them beside CB-T1's banked ones (recovery 0.8118 s,
retention 55.815 %, re-engagement medians) — a level comparison needs a tighter cell than an
ordering, so the target is 200 events (relative SE ≈ 7 %). Stated before the smoke, with its
justification, exactly as the 60 was.

⭐ **THIS STAGE'S NUMERATOR**: **challenger-observations of CHOSEN knocks per match in the CHOICE
arm** — the population every re-read level is read from. `rarestScoredCellPerMatch` and
`msPerMatch` are the **only two numbers** the full run reads out of the committed sizing artifact;
no rate, share, level or verdict is ever read from it. The 200 cap is the honest seed-budget cap;
the ↑12 floor is the identity-receipt minimum.

⭐ **THE ZERO-EVENT CLAUSE** (frozen with the rule): if the sizing smoke sees **zero** chosen knocks
the precision term is UNBOUNDED — it cannot be estimated from a zero count and this stage will not
invent a floor — so the wall term and the cap bind, and the zero itself is published as the first
fact of §RESULT.

## §HASH — the envelope split (CB-T1's discharged form, kept whole)

```text
HASHED BODY:      precisionTerm · cap · nStar · ran · rarestPerMatch · every measured cell
UNHASHED ENVELOPE: wallTerm · projectedHours · msPerMatch · wallMs · generatedAt · head ·
                   outPath · preflight flags · the G-DET digests
⇒ the wall term is computed from the COMMITTED SIZING ARTIFACT's envelope (a fixed committed
  number), never from this run's clock, so nStar and the whole body re-derive on another machine.
```

Acceptance test, run in-probe and published in §CHECKS: (1) cross-`OUT` digest identity against a
MUTATED envelope; (2) re-derivation from the written body alone after stripping `resultSha256` and
`envelope`; (3) the forbidden-key deep scan.

## §SEEDS — band **12,474,000 – 12,474,999** (#268.4's pre-registration)

⭐ **BOOKED = WALKED** (#268.2(iv)): this table is the PLAN; §SEED LEDGER at the foot records only
what the runs actually walked, and any block that stayed virgin is marked VIRGIN.

| item | block | plan |
| --- | --- | --- |
| everything consumed through CB-T1 | the probe's `CONSUMED` table (inherited in full) | prior |
| ⭐ **ROW-0, the both-doors row** | **12,474,000 – 12,474,011** (12) | CONSUMED (`49ca172`) |
| ⭐ exit-semantics GUARD block — where EVERY preflight is routed | **12,474,050 – 12,474,099** | reserved |
| sizing smoke | **12,474,100 – 12,474,119** (20) | planned |
| identity receipts + direct reads | **12,474,120 – 12,474,139** | planned |
| ⭐⭐ the CHOOSER SMOKE battery | **12,474,200 – 12,474,399** (N ≤ 200) | planned, exact sub-band in §RESULT |
| test-file seeds (not a battery) | **12,474,900 – 12,474,903** | consumed by `tests/carryChoiceSeat.test.ts` |
| G-WORLD construction seed | **12,474,999** | constructed, never stepped |
| free | 012–049 · 140–199 · 400–899 · 904–998 | available to the frontend rung |

Disjointness is computed **in-probe** for every interval, against the COMPLETE consumed ledger.

**STATS**: stream base **110,000** (#268.4's floor), step **200**, minimum gap 200 to every
published base. ONE bootstrap, **2,000 resamples**, cluster = match seed, one shared
resample-index matrix.

## §FORKS — pre-named, printed MECHANICALLY, never resolved here (#203)

* **F-CB2-a** — the one table's currency **cannot** price a knock without a new hand-painted
  constant ⇒ surface the fork and the honest alternatives, **never invent one** (#200). *Resolved in
  the frozen half: it does NOT fire — §CURRENCY's derivation prices the knock at zero new
  constants. Kept named for the record.*
* **F-CB2-b** — the chooser **rarely or never** knocks ⇒ the table's own currency values a knock
  below the incumbent options; that is a FINDING about the map, REPORTED with its price-gap
  evidence (R3), and **no re-pricing happens here** (#200 — a knock-specific bonus after seeing the
  rate is exactly the post-sight tuning #267.3 rejected).
* **F-CB2-c** — any HARD gate breach ⇒ **STOP** and report. This rung gates no football ruler.

**A fired fork is STILL A COMMIT.** The honest result lands; the adjudication is the commander's.

## §ROAD B — nothing ships

`cbChoiceSeat` is **OFF in every production path** (hard `false` default, absent from `a4World.ts`,
from all three play-test worlds and from every League's `matchFlags`), the gene is **BORN ABSENT**
in every production genome, and even armed a chosen knock cannot fire without CB-T0's own
`cbTouchPast` door, which no production path arms either. Nothing is serialized. **Nothing about the
game the user plays changes in this commit.** Road B statement: fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **must not move.**

## §NON-CLAIMS

CB-T2 claims **no** football effect and **no** tempo cure. It does not claim the chooser's policy is
good football, does not adjudicate the `p·χ` level (#267.3 ruled 甲), does not re-anchor any
recovery level, runs **no evolution exam** (the gene is plumbed, selection is a later arc's), builds
**no** frontend affordance (M-CB.3's rung), makes no claim about the LEVELS it re-reads beyond
publishing them on the chooser's own population, and discharges none of the #248 debts. The dose is
an instrument setting. This stage cannot authorize the frontend rung; only the commander can.

<a id="result"></a>

## §RESULT

*(the battery's numbers land here, quoted from the committed artifact — nothing above this line
moves after the freeze commit)*
