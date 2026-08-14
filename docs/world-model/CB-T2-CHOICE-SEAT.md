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

Every number below is quoted FROM `docs/world-model/data/cb-t2-choice-seat.json` and printed by
[`../../scripts/analysis/cb-t2-choice-result.ts`](../../scripts/analysis/cb-t2-choice-result.ts);
none is typed (#229.2). Probe:
[`../../scripts/probes/cb-t2-choice-seat.ts`](../../scripts/probes/cb-t2-choice-seat.ts). Sizing
artifact: [`data/cb-t2-sizing-smoke.json`](data/cb-t2-sizing-smoke.json).

**12 seeds × 3 paired arms, block 12,474,200–211 · 26/26 probe gates + G-SUITE · ⭐⭐ 87 conjuncts
MACHINE-DERIVED from the gate objects, 87 mutants, 87 live AND exactly-one, `uncoveredConjuncts`
empty · `resultSha256` `f42a16f8…` · G-DET digest `3a0cc5bf…` twice · 77.3 s wall.**

### The N rule as executed

```text
rarestScoredCellPerMatch  20.45   (the committed sizing smoke, block 12,474,100–119, 20 seeds)
precision term            ceil(200 / 20.45) = 10  ↑12  =  12          ⚠ THE FLOOR BINDS
wall term (envelope)      floor(0.5h / (123.5 ms × 3 arms × 2)) = 2,429   — does NOT bind
cap                       200                                            — does NOT bind
N* = 12, ran 12           ⇒ 248 chosen knocks · 188 challenger-observations in the CHOICE arm
```

### ⭐⭐ THE HEADLINE: THE ONE TABLE PRICES A KNOCK, AND THE CHOOSER USES IT — INCLUDING THE BACK COMPASS

**F-CB2-a did not fire** (the currency needed no new constant — §CURRENCY) and **F-CB2-b did not
fire** (the chooser knocks **20.7 times a match**, on **10.3 %** of its seat decisions). No fork
fired.

### R1/R2/R3 — the knock population, the compass, and the price gap

| quantity | CHOICE | BOTH |
| --- | ---: | ---: |
| seat decisions / match | 200.0 | 212.9 |
| candidates priced per decision (the realized compass) | **15.65** | 15.59 |
| ⭐ knocks CHOSEN / match | **20.667** | 19.000 |
| chosen share of seat decisions | **10.333 %** | 8.924 % |
| chosen : fired | **1.000** | 1.000 |
| ⭐⭐ **BACK-half share of chosen knocks** | **20.968 %** | **21.491 %** |
| step-0 (today's knock direction) share | **2.016 %** | 0.877 % |
| push, median | 3.6816 m | 3.6895 m |
| aim distance = the knock's own roll, median | 3.2582 m | 3.2019 m |
| ⭐ **price gap** — mean best knock vs mean winner | **0.5688 vs 0.8195** | 0.5518 vs 0.8080 |

* **THE COMPASS IS DERIVED AND IT MOVES WITH THE BODY**: steps per decision min 1 · q1 11 ·
  median 15 · q3 19 · max 23 (35,161 decisions). The angular chord never exceeds the control
  radius (max **1.2493 m** against `CONTROL_RADIUS` 1.25). 49.81 % of the candidates offered are
  in the back half.
* ⭐⭐ **THE BACK HALF IS REALLY USED.** CB-C0 measured the duel FRONTAL BY CONSTRUCTION (0 of
  9,956 challenges from behind); CB-T0 opened the back half; **a chooser given the whole circle
  aims one knock in five backwards**, and aims the INCUMBENT direction only 2 % of the time. The
  chosen bearings spread across all eight octants (CHOICE: 8·18·47·62·59·29·16·9).
* **THE TIMING READ (R2's second half)**: the nearest challenger sits at median **2.53 m** when a
  knock is chosen against **2.17 m** when one is not — the chooser knocks with slightly MORE room,
  not less. Reported without interpretation.
* ⭐ **THE PRICE GAP is the §STRAIN 1 evidence**: the one table values the best available knock at
  ≈ **69 %** of what it values the option that wins. It is not a rejected option — it wins one
  decision in ten — but it is systematically the cheaper one.

### ⭐⭐ R4 — THE L2b RE-READ, ON THE CHOOSER'S OWN KNOCK POPULATION (binding (b))

| population | beaten median (ticks) | censored | not-beaten median | gap | 95 % CI | median race window |
| --- | ---: | ---: | ---: | ---: | --- | ---: |
| **CHOICE (the chooser)** | 144 | 60.29 % | **23.5** | **120.5** | [98, 134] | 24.44 |
| **BOTH (chooser + duel physics)** | 144 | 68.80 % | **21.5** | **122.5** | [104, 130.0] | 24.45 |
| ⚠ CB-T1 (the DOSER, a different population) | 144 | 63.6 % | **5** | 139 | — | 24.1 |

⭐⭐ **THE LEVEL MOVED, AND #268.3(1) WAS RIGHT TO BIND THIS RE-READ.** The beaten set's median is
the censoring horizon in both populations (a lower bound, as CB-T1 declared). What CHANGES is the
**NOT-BEATEN** set: under the doser a not-beaten defender is back at the ball in **5 ticks**;
under the chooser it takes **23.5** — nearly five times longer. The elimination gap is
correspondingly smaller (120.5 vs 139 ticks). **The chooser knocks in geometries where even the
un-beaten defenders are further from a re-engagement**, and any statement of the form "a beaten
defender is out for ~6× the race he lost" is a statement about the population it was read on. The
qualitative claim survives on the chooser's own population (the gap CI excludes 0 comfortably, and
the beaten median still exceeds the median race window by ~6×); the LEVEL does not transfer.

### ⭐⭐ R5 — THE L3 RE-READ (binding (b)): THE TOUCH COST **DISAPPEARS** UNDER A CHOOSER

| population | knock retention @1.6 s | hold retention @1.6 s | gap | 95 % CI |
| --- | ---: | ---: | ---: | --- |
| **CHOICE (the chooser)** | **67.611 %** | 66.667 % | **+0.945 pp** | **[−7.734, +8.989]** — a NULL |
| ⚠ CB-T1 (the DOSER) | 55.815 % | 64.031 % | −8.215 pp | [−12.488, −3.606] |

⭐⭐ **THIS IS THE ROUND'S SHARPEST FINDING.** CB-T1 measured, on unchosen knocks, that the touch
costs about eight points of retention. **On the chooser's own knocks that cost is gone** — the
point estimate is +0.9 pp and the CI straddles zero. Read plainly: *a knock played where the table
says it is worth playing costs the carrier nothing measurable in retention.* ⚠ **STATED AS A
LEVEL, NOT A CLAIM ABOUT THE MECHANISM**: L3's contract question ("does the ball genuinely leave
his feet and can anyone win the race") is unchanged and still true — the races split both ways
(retained 167, lost 80; captures 28 of 248 inside the window). What the re-read shows is that
SELECTION prices the cost away, which is exactly what a chooser is for and exactly why the level
had to be re-read. **It is REPORTED, never gated.**

### ⭐ R7 — THE RECOVERY LEGS, NOT TOTAL-ONLY (binding (c), #268.2(iii)'s debt), BOTH arm

| bin | n | total min | median | mean | max | brake mean | turn+close mean | *(recon)* turn | *(recon)* close |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| s0 walk | 73 | **0.3690** | 0.6874 | 0.6607 | 0.9822 | 0.0615 | 0.5992 | 0.2422 | 0.3570 |
| s1 jog | 83 | **0.4245** | 0.7588 | 0.7563 | 0.9951 | 0.1537 | 0.6026 | 0.2339 | 0.3898 |
| s2 run | 97 | **0.5660** | 0.8060 | 0.8082 | 1.0396 | 0.2589 | 0.5493 | 0.1687 | 0.3905 |
| s3 drive | 86 | **0.6654** | 0.8851 | 0.8772 | 1.1455 | 0.3546 | 0.5225 | 0.1491 | 0.3734 |
| s4 OVERCOMMITTED | 51 | **0.7734** | 0.9961 | 0.9971 | 1.2192 | 0.4499 | 0.5472 | 0.1638 | 0.3833 |

**The min is published in every row.** `total` and `brake` are the ENGINE's own writes
(`tackleCooldown`, `stunTimer`); `turn+close` is their exact difference; ⚠ the *turn* and *close*
columns are **RECONSTRUCTED** from the post-step state and are labelled as such (the split is not
written to the world). The monotone gradient CB-T1 measured is reproduced on this venue
(0.6607 → 0.9971 s across the arrival bins), and the split says where the price comes from: at a
walk the interval is almost entirely **turn + close** (0.599 of 0.661); at an overcommitted arrival
the **brake** leg alone is 0.450.

### ⭐ R6 — CARRIER-ANCHORED SEPARATION AT t0 AND AT t0+RECOVERY (binding (c)), BOTH arm

| point | n | min | q1 | median | q3 | mean | max |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| at the MISS (t0) | 368 | 1.0174 | 1.0500 | **1.1021** | 1.4349 | 1.3504 | 28.7210 |
| at t0 + RECOVERY | 368 | 1.0421 | 1.1789 | **1.7625** | 2.8032 | 2.2853 | 27.3607 |

⭐ **THE #268.2(iii) DEBT IS PAID**: both ends ship, both anchored at the CARRIER (`|defender −
ball.owner|`), t0 = the miss instant. The beaten lunger is **0.66 m further from the carrier**
(median) by the time his own motion model has him back in the duel. ⚠ The max column carries
whistle-relocated bodies; no level is claimed from the tail.

### R8 — WORLD EFFECTS (REPORTED, NEVER GATED)

| ruler | OFF | CHOICE | BOTH | ⚠ CB-C0 (BARE PRODUCTION — a different venue) |
| --- | ---: | ---: | ---: | ---: |
| standing duels / match | 37.583 | 31.250 | 34.000 | 29.389 |
| **take rate** | **37.916 %** | 35.733 % | ⚠ **4.412 %** | 37.6 % |
| turnovers / match | 52.250 | 50.750 | 47.083 | 34.400 |
| mean possession spell | 4.742 s | 4.871 s | **5.240 s** | 4.357 s |
| goals / match | 2.500 | 2.417 | **1.917** | 2.163 |
| shots / match | 13.667 | 11.500 | 11.917 | n/a |
| fouls / match | 5.500 | 6.083 | **7.750** | n/a |
| yellows / match | 1.500 | 1.917 | **2.583** | n/a |
| reds / match | 0.167 | 0.083 | 0.167 | n/a |
| penalties / match | 0.083 | 0.083 | 0.000 | n/a |
| pressed share (first receptions) | 68.160 % | 67.647 % | 64.345 % | n/a |

⭐⭐ **THE CHOOSER'S WORLD IS WHERE THE TWO DOORS ACTUALLY MEET — WHICH §ROW-0 PREDICTED.** Under
the doser the touch door starved the duel to 1.5 challenges a match and the commitment door had
nothing to price. Under the chooser, knocks are rare enough that **34 standing duels a match
survive**, so the commitment door bites in full (take rate 37.9 % → **4.4 %**), fouls +41 % and
cards +72 % on pure volume (`foulP` is per-miss identical, #267.3(2)), goals −23 %, and — for the
first time in this arc — **the possession spell LENGTHENS** (4.742 → 5.240 s). ⚠ **No football
conclusion is drawn**: this is one dose, one venue, twelve seeds, and nothing here is gated. CB-C0's
column is a DIFFERENT VENUE laid beside, never differenced.

### ⭐ R9 — §STRAIN 1's FIRING RATES (the self-delivery degeneracies, measured)

| condition | CHOICE | BOTH |
| --- | ---: | ---: |
| decisions observed | 35,161 | 36,189 |
| the carrier is beyond the opponents' deepest outfield body (the **offside term's own condition**) | **20.802 %** | 20.412 % |
| the carrier is his team's licensed **overlapper** | 0.321 % | 0.058 % |

⚠ **THE OFFSIDE DEGENERACY IS NOT RARE.** On roughly **one seat decision in five** the shared
pricer's offside term is evaluated against the carrier's own position while he is beyond the last
defender — a condition that, for a self-delivery, is football-meaningless (a player is never
offside from his own touch) and that the shared pricer answers with a ×0.08 suppression. The
overlap degeneracy is negligible (≤ 0.3 %). **Both are left exactly as the shared pricer computes
them** (§STRAIN 1, alternative 甲) and are the commander's to rule on.

### Gate table

| gate | result | evidence |
| --- | --- | --- |
| `gDet` | **PASS** | digest `3a0cc5bf…` on both passes; pass B re-walks every match |
| `xFpProd` | **PASS** | `57b0bdab…c673`, re-derived in-process — **the seat moves nothing that ships** |
| `gIdent` | **PASS** | 3/3 league seeds identical (1337 · 20260728 · 424242), recomputed in-process; flag ABSENT ≡ FALSE on 6 seeds × BOTH world shapes |
| ⭐ `gBorn` | **PASS** | the door ARMED with the gene ABSENT is byte-identical on 12 arm-shape cells; **0** seats formed with the gene absent; the same door dosed formed **1,203** seats (the machinery is LIVE) |
| ⭐⭐ `gZero` | **PASS** | **THE DERIVED NEUTRAL FORM MEASURED**: with the gene PRESENT AT ZERO the seat formed **2,437** times and priced **35,745** candidates — and **chose 0**, fired 0, and the world stayed byte-identical on every cell |
| ⭐⭐ `gCross` | **PASS** | **27 banked flag families × 2 seeds** (CB-T0's own enumeration + the substrate's keys + ⭐ CB-T0's two doors): `F alone` ≡ `F + the key false` ≡ `F + the key ON with the gene absent`, 27/27; DORMANT-ALL holds; DISCRIMINATION holds |
| ⭐ `gBite` | **PASS** | the armed seat diverges from off on both probe seeds, and no divergence precedes an arming |
| ⭐⭐ `gCompass` | **PASS** | 6/6 — step 0 IS the incumbent bearing · max angular chord **1.2493 m ≤ CONTROL_RADIUS 1.25** · back half 49.81 % of candidates · **17 distinct step counts (7…23)** across bodies · deterministic · never degenerate |
| ⭐⭐ `gOneOwner` | **PASS** | 5/5 — **5,573** sampled candidates, **0** whose push differed from `touchPastPushFor` on its own line; 0 engine-written pushes outside the law's endpoints; 0 non-unit release directions; 476 knocks |
| ⭐⭐ `gOneTable` | **PASS** | 5/5 — the seat's executable source contains no policy weight (`W.`) and no `score` token; its import list is closed (6 modules); the brain prices the knock with the SHARED `groundCandidate`; no pass was ever aimed at the carrier |
| ⭐ `gArming` | **PASS** | 5/5 — chosen **=** armings (476 = 476); armings ≥ knocks; **0** armings in the OFF arm; 0 armings naming a keeper or a sent-off body; **0** knocks without a choice |
| `gRace` | **PASS** | 4/4 — every race window inside the engine's own push law; **0** captures credited outside the window; **0** reconstruction mismatches against `cbLedger`; every knock carries a named resolution |
| ⭐ `gLevels` | **PASS** | 5/5 — both L2b sets populated (136/52), L3 resolved on 247 knocks, **368** recovery-leg events, carrier-anchored separations at BOTH ends, and every level read on the CHOOSER's own population |
| `gCells` | **PASS** | 36 per-seed rows stored; both L3 rates re-derive from the stored cells alone |
| `gBoot` | **PASS** | 2,000 resamples × 12 clusters, indices in range, ONE shared matrix across every quantity |
| `gNonVac` | **PASS** | 5/5 — both armed arms non-vacuous, L3 splits both ways, every arrival bin populated, the OFF shadow arm sampled |
| `gLedger` | **PASS** | the OFF arm's choice ledger is all-zero and its carry-beat ledger untouched; the armed arms non-vacuous |
| `gTrace` | **PASS** | 8/8 quantities read back out of `src/**` — incl. `touchPastPushFor` being the ONE push owner and `performTouchPast` calling it — and **0** untraced numerals in the seat module |
| `gFork` | **PASS** | **1** choice fork · **1** arming block · **1** constructor init · **43** src occurrences classified, **0 unclassified** |
| `gPins` | **PASS** | 5/5 — the diff CONFINED to the six declared files + the new test; the eight banked seam modules byte-untouched; `performTouchPast`'s release verbatim; `types.ts` and the whole render layer untouched; **zero** pre-existing test files edited |
| `gSeed` | **PASS** | 3 intervals in band, pairwise disjoint, disjoint from the COMPLETE ledger (9 prior blocks incl. ⭐ ROW-0's own) |
| `gStats` | **PASS** | base **110,000**, on the 200 grid, ≥ 200 from every published base |
| ⭐ `gEnvClean` | **PASS** | preflight false, reasons [] — and all four refusals exercised by hand (§CHECKS) |
| ⭐⭐ `gHashEnvelope` | **PASS** | 3/3 — the same body written twice with DIFFERENT envelopes re-derives the SAME digest off disk; the committed file re-derives its own `resultSha256` after stripping `resultSha256` + `envelope`; **0 of 9** forbidden invocation keys in the hashed body |
| `gN` | **PASS** | precision term re-derives from the committed sizing artifact; N\* = min(12, 2429, 200) = 12; the battery ran at N\* |
| ⭐⭐ `gMutants` | **PASS** | **87 conjuncts MACHINE-DERIVED from the 23 gate objects · 87 mutants · 87 live AND exactly-one · `uncoveredConjuncts` = []** |
| `G-SUITE` | **PASS** | see §CHECKS |

### §CHECKS

```text
$ npx tsc --noEmit                                   → clean
$ npx vitest run tests/carryChoiceSeat.test.ts       → 18/18 green
$ npx vitest run                                     → 137 of 138 FILES green; the ONE red is
                                                       `Test timed out in 180000ms` in
                                                       formationEvolution — a TIMEOUT, never an
                                                       assertion
$ npx vitest run tests/formationEvolution.test.ts    → 3/3 GREEN ALONE at 150.2 s against its own
                                                       180 s limit (the same knife-edge CB-T0 /
                                                       CB-T1 / EK-T0 recorded: 149.2 / 144.1 /
                                                       171.4 s). The PTP-T0 disposition applies —
                                                       load-induced, disclosed, and NO test file
                                                       was edited
$ npx tsx scripts/fingerprint.ts                     → 57b0bdab…c673 (unchanged)
$ npx tsx scripts/analysis/cb-t2-choice-result.ts    → the tables above, printed from the artifact

⭐⭐ THE #268.3(a) REFUSAL PATH, EXERCISED (one registered mutant deleted by hand):
$ CBT2_MODE=sizing …                                 → FATAL (#268.3(a)): the MACHINE-DERIVED
                                                       coverage map has conjuncts without a mutant
                                                         · gCompass.wholeCircle
                                                       the probe REFUSES TO RUN.   exit 3
                                                       (the mutant was then restored)

$ npx tsx scripts/probes/cb-t2-choice-seat.ts        → FATAL exit 2 (CBT2_MODE is REQUIRED)
$ CBT2_MODE=full CBT2_BOGUS=1 …                      → FATAL exit 2 (whitelist-or-refuse)
$ CBT2_MODE=full EDS_BUNDLE=1 …                      → FATAL exit 2 (the ENGINE's own doors refused)
$ CBT2_MODE=full CBT2_N=2 CBT2_OUT=docs/world-model/../world-model/data/x.json …
                                                     → FATAL exit 2 (a PREFLIGHT may not write a
                                                       canonical repo path; the traversal spelling
                                                       is RESOLVED)
$ CBT2_MODE=sizing CBT2_SIZING_N=2 CBT2_OUT=/tmp/… → routed onto the GUARD block 12,474,050+ —
                                                       the receipt blocks stay VIRGIN
$ CBT2_MODE=sizing …                                 → the sizing artifact, block 12,474,100–119
$ CBT2_MODE=full …                                   → 26/26 GREEN · exit 0 · 77.3 s
```

### §SEED LEDGER — ⭐ BOOKED = WALKED (#268.2(iv))

| block | what walked it | status |
| --- | --- | --- |
| **12,474,000 – 12,474,011** (12) | ⭐ ROW-0, the both-doors row (`49ca172`) | CONSUMED |
| **12,474,050 – 12,474,051** | the ROW-0 preflight (2 seeds × 4 arms) | CONSUMED (guard) |
| **12,474,050 – 12,474,079** | the CB-T2 preflights (sizing ×2, liveness-refusal ×1 — which walked **nothing**, it refused before the first match) | CONSUMED (guard) |
| **12,474,100 – 12,474,119** (20) | the sizing smoke | CONSUMED |
| **12,474,120 – 12,474,125** (6) | the identity receipts (G-IDENT / G-BORN / G-ZERO / G-CROSS / G-BITE, 6 seeds × 2 shapes × 4+ arm spellings) | CONSUMED |
| **12,474,200 – 12,474,211** (12) | ⭐⭐ the CHOOSER SMOKE battery, ×3 arms ×2 X-DET passes | CONSUMED |
| **12,474,900 – 12,474,903** | `tests/carryChoiceSeat.test.ts` | CONSUMED |
| **12,474,999** | the world seed — **constructed, never stepped** (⚠ the frozen plan named it; the built probe does not construct it either, so it is **VIRGIN** and is said so) | VIRGIN |
| 012–049 · 080–099 · 126–199 · 212–899 · 904–998 | — | free, available to the frontend rung |

**STATS**: base **110,000**, step 200, ONE bootstrap of 2,000 resamples, cluster = match seed, one
shared resample-index matrix used by every published CI. The band 110,000–110,000 is the only
stats consumption of this stage.

### §DEV — the deviations, declared

1. ⚠ **A BUILD SMOKE RAN ON THE GUARD BLOCK BEFORE THE FREEZE COMMIT, and this is what it saw.**
   One match (seed **12,474,050**) was walked in four spellings (gene absent · gene 0 · gene 1 ·
   gene 1 with CB-T0's touch door SHUT) to prove the seat ran at all and that the derived neutral
   form held. **What was seen**: the choice-ledger counters and the final scorelines — gene absent
   0 seats and the baseline scoreline; gene 0 → 298 seats, 4,986 candidates, **0 chosen**, the
   baseline scoreline; gene 1 → 272 seats, **2 chosen**; gene 1 with the door shut → 6 chosen, **0
   fired**, 5 withdrawals. **No gate outcome, no rate, no level, no world effect and no receipt or
   battery seed was computed or walked.** ⚠ The 2-chosen figure is a SINGLE match on a single
   genome pair and is nine times below what the battery then measured (20.7/match) — it is
   recorded because F-CB2-b was named partly in its light, and naming a fork more pessimistically
   than the world turned out to be is the safe direction. The CB-C0 §DEV 1 idiom: what was and was
   not seen, stated.
2. ⭐ **THREE FROZEN CONJUNCTS WERE DEMOTED BY THE MACHINE, NOT BY AN EYEBALL — which is exactly
   what #268.3(a) is for.** All three were caught by the exactly-one mutant rule going RED on the
   first full run: (a) `gIdent.everySeed` is a SUPERSET of `gIdent.absentEqualsFalse` (every row is
   of one kind), so no input flips it alone; (b) `gSeed.ordered` is IMPLIED by pairwise
   disjointness on sorted intervals; (c) `gEnvClean.neverACanonicalPathUnderOverride` cannot be
   flipped without also flipping `notAPreflight`. Per the new canon all three are **FORBIDDEN from
   the gate list** and now ride as comments/parse-time refusals; the canonical-path refusal is
   exercised by hand in §CHECKS. The conjunct count fell 91 → 87 accordingly.
3. ⚠ **ONE FROZEN CONJUNCT WAS CORRECTED OF RECORD, and it went RED first.** §GATES row 9 froze
   "the chord between adjacent aims is ≤ `CONTROL_RADIUS`". Measured that way it FAILS
   (max adjacent-aim gap **2.2548 m**) — because the push law gives every LINE its own length, so
   adjacent aims differ RADIALLY as well as tangentially. The quantity §LAW's derivation actually
   defines is the **ANGULAR** chord at the derivation's own roll, and that holds with room to spare
   (**1.2493 m** vs 1.25). The conjunct now measures that, **and the raw adjacent-aim gap is
   PUBLISHED beside it** rather than dropped. No gate was added, removed or renamed.
4. ⚠ **`gArming.withdrawalsHappen` WAS DEMOTED TO REPORTED, and the reason is a real finding**:
   **0** withdrawals across the whole battery. CB-T0's fork consumes `forcedTouchPast` inside the
   very tick the brain armed it, so with the capability door OPEN there is never a stale arming to
   withdraw. The withdrawal path is live and pinned — but only when the door is SHUT
   (`tests/carryChoiceSeat.test.ts` exercises exactly that). The safety property it was meant to
   carry ("no knock ever fires on a stale aim") is carried instead, and better, by
   `gArming.noKnockWithoutAChoice`: every knock was chosen in its own tick, **0** exceptions.
5. ⭐ **R1's AIM-DISTANCE COLUMN WAS FIXED BEFORE THE BANKED RUN.** The first implementation
   recorded the ball-to-carrier gap (median 0.50 m) instead of the knock's own roll (median
   3.26 m), i.e. it did not emit what §READ R1 promised. Corrected, and the ball-to-carrier gap is
   published beside it rather than deleted (#268.2(iii)'s lesson, applied to itself).
6. **THE DOORS MATRIX WAS WIDENED BEFORE THE BANKED RUN** from the substrate's own 8 keys to
   CB-T0's full enumeration of banked families + the substrate + CB-T0's two doors = **27**, which
   is what the frozen gate says ("every banked flag family **including CB-T0's two doors**"). ⚠
   **SCOPED HONESTLY, as CB-T0 §DEV 4 was**: many of those flags do not move the world when armed
   alone at these seeds (they need their own probe drivers), so for those the pairwise identity is
   a weaker witness.
7. **THE WORLD SEED IS VIRGIN.** The frozen §SEEDS table reserved 12,474,999 as a construction
   seed; the built probe proves world identity on the identity block instead and never constructs
   it. Booked = walked (#268.2(iv)) ⇒ it is marked VIRGIN above, not consumed.
8. **THE `turn`/`close` SPLIT IN R7 IS RECONSTRUCTED.** The engine writes `total` and `brake`; the
   remaining `turn + close` is their exact difference, and the per-leg split is recomputed from the
   post-step state. Declared in the table itself, never presented as an engine write.
9. **THE PROBE'S CHURN AND PRESSING RULERS ARE REDUCED RE-IMPLEMENTATIONS** (a spell closes on a
   change of controlling side; pressed = a first reception with an opponent inside
   `TOUCH_CONTROL_DIST`). Their LEVELS are not commensurable with CB-C0's or the banked tempo
   walker's — only their contrast ACROSS these three arms is, and CB-C0's column is laid beside as
   a different venue, never differenced.

### §DOUBTS — ⭐ what the commander is asked to adjudicate

1. ⭐⭐ **STRAIN 1: THE OFFSIDE TERM FIRES ON ONE SEAT DECISION IN FIVE, AND IT IS
   FOOTBALL-MEANINGLESS THERE.** The one-table rule says the shared pricer prices the knock; the
   shared pricer contains a term that suppresses a delivery by ×0.08 when the RECEIVER stands
   beyond the last defender — and for a self-delivery the receiver is the carrier, who cannot be
   offside from his own touch. Measured: **20.8 %** of seat decisions meet that condition. So the
   chooser is systematically discouraged from knocking exactly where a dribbler most wants to —
   in behind. I did **not** patch it, because a per-seam exception is the one thing M-CB.2 forbids
   by name, and because patching a banked pricer after seeing a number is the post-sight move
   #267.3 rejected. The three alternatives are in §CURRENCY STRAIN 1. **This is the place the
   one-table rule strained hardest, and it is the commander's call.**
2. ⭐⭐ **THE L3 COST VANISHED UNDER SELECTION (+0.9 pp, CI straddling 0, vs the doser's −8.2 pp).**
   Two readings, and I do not choose between them: (甲) the chooser is doing its job — it knocks
   where the knock is safe, and "the touch costs the carrier" was always a statement about
   UNSELECTED knocks; (乙) the pricing is too conservative — a chooser that only knocks where
   nothing is at risk is not really taking the duel on, and the interesting knocks (the ones that
   beat a man at a real price) are being priced out. R2's timing read leans (乙): knocks are chosen
   with MORE room than average (2.53 m vs 2.17 m to the nearest challenger), not less. Deciding
   between them is a design question for the next arc, not a re-tune here.
3. **THE PRICE GAP IS STRUCTURAL, NOT INCIDENTAL** (best knock ≈ 69 % of the winner). The derived
   neutral form puts the appetite in [0,1] as a multiplier, so a knock can never outscore the
   delivery price it is derived from — the gene at 1 is "value it exactly as the table values the
   delivery", never more. That bound was declared ex ante in §GENE, and it means the ONLY way a
   population could knock more is for the underlying delivery price of knocks to rise. Whether the
   family should be allowed a wider domain is a contract question, not an implementation one.
4. **ONE DOSE, ONE VENUE, TWELVE SEEDS.** N* = 12 is the frozen rule's floor output; the cells are
   large (35k decisions, 476 knocks) but the CLUSTER count is small, so every CI here is
   cluster-limited. Re-sizing after seeing the smoke would be post-sight tuning (#200), so it was
   not done — the consequence is stated instead.

## §COMMANDER CORRECTIONS OF RECORD + THE §DOUBTS RULINGS (#269.2/#269.3, 2026-08-14)

The bounded-adversarial verify (#250.2) re-derived every headline from stored cells AND reproduced
the choice arm from the engine itself (3 battery seeds: seats/candidates/chosen cell-for-cell); ran
dormancy on five seeds of its OWN (10/10 byte-identical, both world shapes); proved the gene
arithmetic (absent ⇒ no seat; zero ⇒ 0 chosen of 2,562–5,408 priced; no Lamarck path by full
symbol census + RNG-tail equality); re-derived all three resultSha256 cross-machine; broke the
machine-liveness canon ON PURPOSE twice (throwaway conjunct → REFUSES TO RUN exit 3; doctored
double-flip → RED) — it held both times; and git-corroborated freeze-before-sight. VERDICT:
PASS-WITH-FINDINGS; the mechanism, the one-table rule, the derived neutral form, dormancy and
every headline HOLD. Adjudication:

* **(i) HIGH RATIFIED — THE HEADLINE STRAIN IS NOT REAL; the §DEV 1 doubt is WITHDRAWN.** The
  offside term CANNOT fire on a knock: `offsideLineLocalX` takes the ball's own localX as a floor,
  and the ball is at the carrier — so the suppression requires `localX(p) > localX(p) + 2.4`,
  structurally unsatisfiable. Verify instrumented the ACTUAL conjunct on the exact battery
  population: **0/2,400 (0.0000 %)**. The published "20.802 % of seat decisions" was (a) a PROXY
  condition (carrier beyond deepest outfielder) asserted as "the offside term's own condition"
  without checking the function's third argument, and (b) on the WRONG denominator (35,161 carrier
  ticks, not 2,400 seat decisions). CORRECTED OF RECORD: §DEV 1, §CURRENCY STRAIN 1 row 2, and
  R9's keep-out framing are superseded by this item; the 甲/乙/丙 alternatives answer a question
  that does not arise; the term is INERT on self-deliveries — the benign outcome. The step
  survives untouched (reporting defect; no gate, no code, no headline depends on it).
* **(ii) MED — THE REAL DOMINANT SELF-DELIVERY DEGENERACY IS THE SHORT-BALL BAND**: `d < 5 ⇒
  s *= 0.75` fires on **100 % of knock candidates** (every roll ≤ 4.198 m by the push law) — a
  counterparty-shaped rule ("a 5 m pass is a wasted pass") applied uniformly to self-deliveries.
  ENTERED OF RECORD as §STRAIN 1's true head row. §DEV 4's price-gap attribution RESTATED: un-
  haircut the best knock prices 0.7584 vs winner 0.8195 — the [0,1]-domain observation survives,
  the magnitude attribution was mixed. NO PATCH (a per-seam exception is what M-CB.2 forbids;
  patching after sight is #267.3's rejected move; the haircut is UNIFORM across knocks so
  knock-vs-knock choice is undistorted). The band is NAMED as an input to (a) the deferred
  contract question on the pricing family/gene domain and (b) the style-evolution arc's reading —
  if the table under-prices knocks, selection on `cbCarryProneness` is the instrument that will
  say so.
* **(iii) LOWs recorded**: price-gap denominator mismatch (arming-block calls vs seats; measured
  0.27 %, immaterial, unbounded in principle — next instrument aligns them) · `Match.ts` ledger
  comment names a field that doesn't exist (`decisions` → `candidates`) · two dead entries in
  gTrace's numeral whitelist ('2', '1e-12') · `gDet`/`xFpProd` ride as bare booleans OUTSIDE the
  liveness map — CANON NOTE: bare-boolean gates get conjunct structure or an EXPLICIT frozen
  exemption line, silent exclusion is the leak · the implicit `> 0` knock threshold contradicts
  the "no threshold" prose (harmless here — dvSeat null ⇒ s ≥ 0; prose corrected by this item;
  a negatively-priced world would need the comparison revisited).
* **(iv) The verify's honest non-coverage, recorded**: G-SUITE's load-timeout disposition stands
  on the draft's evidence alone (consistent with three prior rounds: green alone at 150.2 s) ·
  ⭐ the L3 re-read is CROSS-ARM BY CONSTRUCTION (knock retention from the choice world, hold
  retention from the OFF world's shadow moments — CB-T1's own frozen structure): the +0.9 pp null
  MIXES touch cost with the chooser's selection and is not a clean cost estimate — every quote of
  it carries this caveat · ⭐ ARMING-LIFECYCLE STALENESS is a NAMED DEBT: `clearTouchPastArming`'s
  safety is empirically clean here (0 stale, 0 unarmed) but structurally unproven for a world
  arming `o2Look`/`ekHoldVeto` alongside — any future world that arms those together must prove
  the arming lifecycle at that composition FIRST.

### THE §DOUBTS RULINGS (#269.3)

1. **§DEV 1 (offside strain): WITHDRAWN** per (i). Nothing to rule.
2. **§DEV 2 (the timing axis)**: stands as NAMED, NOT INVENTED — an in-tick timing axis needs a
   new engine control and is a contract question for a later slice, if ever wanted.
3. **§DEV 3 (the L3 cost vanished under selection — 甲 chooser working vs 乙 pricing too
   conservative): DELIBERATELY UNDECIDED.** No instrument in this round separates them (and the
   cross-arm mixing (iv) sits underneath). The EMERGENCE answer is the programme's: selection on
   `cbCarryProneness` (the style-evolution arc) is the instrument that adjudicates 乙 — if the
   table under-prices knocks, proneness walks up against the tax; if the chooser is simply
   selecting well, it won't. Until then the L3 level is quoted only with its caveat.
4. **§DEV 4 (the price gap is structural)**: declared ex ante, stands; the domain-widening
   question is a CONTRACT question (a §2 amendment), DEFERRED — not this arc's to answer; (ii)'s
   haircut is folded into its attribution.
5. **§DEV 5–7**: the mid-round conjunct corrections (angular chord; withdrawalsHappen demoted
   after 0 withdrawals, safety carried by `noKnockWithoutAChoice` at 0 exceptions) and the
   pre-freeze build smoke are ACCEPTED as declared; N\*=12 cluster-floor honesty noted.

**M-CB.2 IS COMPLETE.** The carry candidate is priced in the one table by the one currency (zero
new constants — verified at whitelist grain); the style gene is born absent with a DERIVED neutral
form; the chooser uses the back compass (20.968 %) and overrides the incumbent direction 98 % of
the time; the both-armed world's spells LENGTHEN (4.742 → 5.240 s) while take rate falls to 4.4 %
— the duel's other half is finally on the table, and what the defence does about it is layers 3+'s
to learn, not ours to write.
