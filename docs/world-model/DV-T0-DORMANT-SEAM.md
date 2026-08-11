# DV T0 — the DORMANT RISK-PRICING SEAM (`dvDeliveryValue`, 出球价值)

Status: **PRE-REGISTERED, then BUILT + RUN the same round** (the OBM-T0 / CTB-T0 / PTP-T0 /
DLC-T0 / DLC-T0s two-part form).

The frozen law, the seam, the read-fork inventory, the gates, the seed ledger, the PIN
INVENTORY and the Road B statement below were written **before** the receipts ran (the
frozen-before-sight rule); the measured numbers arrive only in [§RESULT](#result--the-gates-run)
at the foot, and every number there is quoted FROM the committed artifact.

Authority chain: contract [`DELIVERY-VALUE-CONTRACT.md`](DELIVERY-VALUE-CONTRACT.md) — §2
**M-DV.1** (FLIGHT EXPOSURE: *"the interception hazard integrated over the ball's own travel —
computed from opponent positions/closing capability against the flight segment and time … the
through-ball's own corridor forms are the trace sources. Continuous, per-candidate, no
thresholds"*), **M-DV.2 as amended by ruling #247** (⭐⭐ the TRUTH/BELIEF split: the census
table is the INSTRUMENT's; *"the player's risk belief = evolvable coarse per-zone weights, BORN
ABSENT"*), **M-DV.3** (*"score′ = score − w_exposure · exposure − w_loss · lossCost, with the
weights BORN-ABSENT genes (zero = today's map byte-identical); no predicate anywhere"*) and
**M-DV.4** (the banked delivery seams untouched). Rulings **#245** (甲 ruled; the map-vs-reality
audit) · **#246** (the METHOD is reality's, the NUMBERS are this world's, the SHAPE is the
fidelity check) · **#247** (⭐⭐ 前场丢球危险不是先验的,是挣来的) · **#248** (the
earned-knowledge ledger — **this arc is the PILOT**, and #248.2(v): *no BELIEF representation
exists anywhere; the DV belief weights will be the programme's first*) · **#249** (DV-C0 banked
— THE TRUE TABLE measured, the #246 shape RESOLVED-CONFIRM at every window; DV-T0 queued with
seeds 12,430,000+).

The banked work this stage reuses **verbatim** and does **not** touch:
[`DLC-T0-DORMANT-SEAM.md`](DLC-T0-DORMANT-SEAM.md) — **THE FOUNDATION**: the hoisted
`groundCandidate` pricer (ONE function, called once per candidate), which is the single surface
this stage modifies and the reason the risk law reaches every delivery seam at once.
[`PTP-T0-DORMANT-SEAM.md`](PTP-T0-DORMANT-SEAM.md) — its `PTP_FLIGHT_SPEED` is **imported, not
re-typed**, as this stage's flight clock.
[`DLC-T0S-DORMANT-SEAM.md`](DLC-T0S-DORMANT-SEAM.md) — the strike plane, whose nine candidates
this stage prices without knowing they are nine.
[`DV-C0-LOSS-COST-CENSUS.md`](DV-C0-LOSS-COST-CENSUS.md) — **THE TRUE TABLE**, whose ZONING this
stage imports and whose HAZARDS it must never touch (§NOTABLE).

---

## §LAW — the frozen law of the risk price

```text
THE RISK PRICE (M-DV.1 + M-DV.2′ + M-DV.3), for EVERY candidate the shared ground pricer prices
  armed  ⇔  match.dvDeliveryValue === true
            AND (g.dvExposureWeight !== undefined OR g.dvLossBelief !== undefined)

LIMB ONE — THE FLIGHT EXPOSURE, and here is the EXACT FORM
  exposure(from, aim, opponents) = MAX over opponents o (o not sent off) of e(o), where

    cp    = closestPointOnSegment(from, aim, o.pos)   [laneOpenness's OWN geometry]
    SKIP    if dist(cp, from) < 1.5                   [laneOpenness's OWN near-field guard:
                                                       "the kick clears them"]
    t(o)  = dist(from, cp) / 18                       [the ball's travel time to cp; 18 is the
                                                       through-ball loop's own flight divisor,
                                                       IMPORTED as PTP_FLIGHT_SPEED]
    lack  = dist(cp, o.pos) − o.topSpeed · t(o)       [the metres he STILL LACKS after closing
                                                       for the WHOLE flight — his CAPABILITY]
    e(o)  = 1 − clamp01(lack / 4)                     [laneOpenness's OWN metre scale]

  no opponent contributes ⇒ exposure = 0.  exposure ∈ [0, 1], continuous, no threshold.

  ⭐ IT DEGENERATES ONTO TODAY'S CORRIDOR READ. At topSpeed 0 (or t 0) the expression is
    1 − clamp01(d/4) — precisely 1 − the term laneOpenness contributes for that body. So the
    limb ADDS EXACTLY ONE THING to the shipped read: the metres a defender covers WHILE THE
    BALL IS TRAVELLING. That is the H-T1s-a blind spot named at #244.3, and nothing else.
    MEASURED (G-EXPOSURE), not asserted.

LIMB TWO — THE LOSS-COST BELIEF (M-DV.2 as amended by #247)
  zone(aim) = the DV-C0 census's own three-way zoning of the RECEPTION point, in the PASSING
              (= the would-be LOSING) team's frame:
                 localX <  −HALF_L/3  ⇒  own    (index 0)
                 localX >  +HALF_L/3  ⇒  final  (index 2)
                 otherwise            ⇒  middle (index 1)
  belief    = dvLossBelief[zone(aim)] ∈ [0,1], THREE evolvable weights, BORN ABSENT.

  ⭐⭐ THE #247 SPLIT IS STRUCTURAL. The census's HAZARDS are the INSTRUMENT's: no src file
    names the artifact, its schema or ANY of its measured numbers (G-NOTABLE greps for exactly
    that, on the artifact's own values). What src owns is the census's ZONING — the SHAPE of the
    question, which #248.1 rules legitimately hand-buildable — and three weights a team can only
    EARN. A team is born knowing NOTHING about what losing the ball anywhere costs. A wrong
    belief is legal and is STYLE.

THE COMPOSITION (M-DV.3), the LAST statement of the ONE hoisted `groundCandidate`
  score′ = score − dvExposureWeight · exposure(p.pos, aim, opp.players)
                 − dvLossBelief[zone(aim)] · W.passBase

  * NO taste term beyond the two genes (#236 amendment 1): no attribute, no mode multiplier, no
    gene of the incumbent chain, no threshold, no predicate.
  * THE EXPOSURE LIMB CARRIES NO SCALE OF ITS OWN — the commander's frozen form is
    `score − w·exposure`, kept LITERAL rather than quietly normalised.
  * THE VALUE SCALE IS TRACED: `W.passBase`, the pricer's OWN base value of a pass (per-player
    policy, so a wildcard with learned weights scales it by his own).

⭐⭐ ONE PRICER, EVERY DELIVERY SEAM. Because the subtraction is the last statement of the ONE
  hoisted pricer, it applies to
    (a) the INCUMBENT to-feet candidate,
    (b) the banked DLC-T0 LED candidate,
    (c) all NINE banked DLC-T0s STRIKE-PLANE candidates,
    (d) and the banked PTP-T0 forced aim,
  IDENTICALLY, downstream of which seam formed them, with ZERO seam-specific wiring anywhere.
  There is no precedence chain to freeze here, because this seam does not COMPETE with those
  doors — it prices whatever they produce. GATED as G-SEAMS + four G-CROSS claims.

THE ZERO-POINT OF THE WORLD (M-DV.3), TWO forms, gated separately
  GENES ABSENT ⇒ no seat ⇒ the pricer never computes an exposure, never reads a belief and
    never subtracts: the shipped statements alone (G-BORN — STRUCTURAL).
  GENES PRESENT AT ZERO ⇒ the seat exists, the exposure IS computed on every priced candidate
    and the subtraction IS performed — and `0·e + 0·v` is exactly `+0`, and `s − (+0) === s` for
    every finite s (and for −0). Byte-identical, with the code path LIVE (G-ZERO — ARITHMETIC).
  ⚠ Unlike DLC-T0s's door (where gene 0 is a PRESENT gene that bites), HERE zero and absence are
    both inert — for DIFFERENT reasons, which is why both are gated.

NO PREDICATES (#200) — the complete conditional set is GATE, GUARD, SELECTOR
  GATE     the arming rule (the flag fork + "is any DV gene present").
  GUARD    `sentOff` and the 1.5 m clear-the-kicker radius — BOTH inherited verbatim from
           laneOpenness, not invented here.
  SELECTOR the zone lookup. ⚠ Stated exactly because it is the one thing that LOOKS like a
           threshold: it decides WHICH of three evolvable weights is read, never whether a
           candidate forms, competes or wins. A team whose three weights are equal is a team for
           which the zoning does not exist at all.
  (The running `max` is laneOpenness's own aggregation, written as a max because exposure is
  openness's complement.)
```

### ⭐ The sharpenings, declared (the contract is silent on each)

1. **THE EXPOSURE IS A MAX AT CLOSEST APPROACH, NOT A SAMPLED INTEGRAL.** M-DV.1 says
   *"integrated over the ball's own travel"* and is silent on the quadrature. A sampled integral
   needs a SAMPLE COUNT (an invented constant) and a per-sample kernel (an invented shape). The
   closest-approach point is where the corridor family ALREADY evaluates a defender against a
   lane, and for a straight-line closer it is the arg-max of the per-point hazard over the whole
   segment — so this form takes the same integral's maximum exactly, at **zero new constants**.
   The aggregation over bodies is `laneOpenness`'s own (worst body sets the reading).
2. **THE CLOSING MODEL IS `topSpeed · t`** — a body's own top speed times the flight, with no
   acceleration, no reaction delay and no facing. Deliberately the CHEAPEST capability that is
   still time-aware. The engine's richer `estimateReach` account needs a reach profile and a
   percept snapshot, i.e. a NEW CHANNEL, which §HONESTY 1 forbids this stage. Consequence,
   stated: the limb OVERSTATES a stationary defender's closing and understates nothing.
3. **THE BELIEF IS ONE ARRAY GENE, NOT THREE SCALARS** (`dvLossBelief`, `DV_BELIEF_SLOTS = 3`, in
   the census's frozen `['own','middle','final']` order). A risk MAP is one agreement about the
   world, so it crosses over as ONE draw (the #164.3 offset-family law) rather than as three
   independent ones — and DV-T2 selects on it as a map.
4. **ONE OPT-IN FOR BOTH GENES** (`evolveDeliveryValue`). The map and the care that reads it are
   one disposition; DV-T2 doses and selects them together.
5. **THE VALUE SCALE IS `W.passBase`, NOT `W.passLaneW`.** Both are the pricer's own numbers. The
   loss cost is a VALUE quantity, and `passBase` is the score's own statement of what a pass is
   worth before its qualities; `passLaneW` is the weight on a CORRIDOR quantity and belongs to
   the exposure family, not this one. Declared so it is not re-cut after sight.
6. **THE RISK PRICE IS APPLIED AT THE END OF THE PRICER, NOT AT THE ARGMAX.** Placing it inside
   `groundCandidate` is what makes "every delivery seam, identically" TRUE BY CONSTRUCTION
   instead of by three copies — and it keeps both banked NO-TASTE source slices (DLC-T0's
   `if (dlcSeat !== null) {` … `// Lofted switch:` and DLC-T0s's plane block … `if (pressure > 0.5)`)
   **untouched by this stage's diff**.
7. **NO RENDER CUE, NO `why`-STRING CHANGE, NO NEW ACTION TYPE.** The repricing is read through
   instruments, never by making the game say something new.

## §HONESTY — the epistemic limits, stated plainly

1. **NO NEW CHANNEL, and it is closed at the IMPORT LIST.** `deliveryValueSeat.ts` does not
   import `Match` and never names it in executable source, so it cannot reach a percept snapshot
   or any other channel. Its position source is the caller's own `opp.players` — the very array
   `laneOpenness(p.pos, aim, opp.players)` is called with ONE STATEMENT EARLIER. The DV term is
   therefore **exactly as honest, no more and no less, as the corridor read it extends**.
2. ⚠ **AND THAT IS A LIMIT, NOT A BOAST.** The corridor read is truth-sourced in BOTH world
   shapes today. Making the corridor family percept-honest is the percept trunk's question and
   is out of this stage's scope; DV inherits the incumbent's honesty rather than improving OR
   degrading it. Nobody may read G-EPI as "the exposure is percept-honest".
3. **`topSpeed` IS BODY KNOWLEDGE, WHICH #248.1 RULES LEGITIMATELY INNATE.** A passer knowing
   roughly how fast a man can run is physics, not a contingent world price. What must be EARNED
   is the loss cost, and that is exactly what is born absent.
4. ⭐ **THE PRICE IS ONLY AS GOOD AS THE PRICER.** The risk terms enter a score chain this stage
   does not otherwise touch; if that chain misprices something, DV does not fix it — it adds two
   terms to it. Whether a corrected map moves the #244 deflation at all is **DV-T1's F-DV-a**,
   not a claim here.
5. ⭐ **THE TRUTH DOSE IS SMALL BY CONSTRUCTION, and this is stated BEFORE the exam.** The
   census's hazards are ~0.018–0.082, so a truth-dosed belief limb subtracts ~0.4–1.6 % of a
   pass's base value, and the own-vs-final differential is ~1.3 % of it. That is an honest fact
   about the DOSE (the world's prices are what they are — #246), not a prediction about the
   exam. If DV-T1 needs a louder dose that is a commander's fork WITH numbers, never a quiet
   re-scale after sight.
6. **THE THREE-CELL MAP IS COARSE ON PURPOSE** (M-DV.2: *"coarse per-zone weights"*). The
   census's own secondary lateral axis exists and is NOT read here; a finer belief is a later
   slice's, and re-cutting the zoning after seeing beliefs is exactly what DV-C0's frozen
   yardstick forbids.
7. **THE COST IS REAL AND IS REPORTED.** The exposure limb is one loop over the opposition PER
   PRICED CANDIDATE — so with the strike plane also armed it is NINE scans per support mate. The
   honest lever if it is dear is candidate scoping (K), never a pricing shortcut.

## §SEAM — the mechanism (all of it dormant)

### The genes

**Two new keys, both BORN ABSENT and both outside `GENE_KEYS`**:

| gene | domain | what it is |
| --- | --- | --- |
| `dvExposureWeight` | scalar [0,1] | how much of a delivery's measured flight exposure this team subtracts from its price |
| ⭐⭐ `dvLossBelief` | `number[3]`, each [0,1], order `own · middle · final` | **the programme's FIRST evolvable world-price BELIEF** (#248.2(v)) — what this team believes losing it in each third costs |

They gain values ONLY under the new explicit `evolveDeliveryValue` opt-in (#75), whose draws sit
**STRICTLY AFTER** the `passLeadSupport` block — exposure first, then the three belief slots in
zone order — so no existing opt-in run's stream moves and the flag-off stream is byte-identical
to HEAD. Crossover: the scalar law for the weight, **ONE draw for the whole belief vector** (a
map is one agreement), and parent A's belief is **COPIED, never aliased** (the OBM-T0 catch).

### The consumption flag

**`dvDeliveryValue`**, a new **explicit** `MatchConfig` boolean, initialised
`cfg.dvDeliveryValue ?? false` (`Match.ts`) — the `ptpPassLead` / `dlcDeliveryChoice` /
`dlcStrikePlane` form. **Never** `EDS_BUNDLE_ARMED`, never env-armed, never default-ON, never
bundle-defaulted: **absent from `src/game/a4World.ts` entirely**. It gets its own
`League.matchFlags` key so a probe world can arm it explicitly, and that key changes no default.

⭐ **THE ARMING CHECKLIST — TWO limbs (binding)**: armed = the `dvDeliveryValue` flag **+** at
least one non-absent DV gene (probe-written on all three genome views of both teams, or an
opted-in evolution run). Even ARMED the world is unchanged while both genes are absent (G-BORN)
**and** while they are present at zero (G-ZERO).

### ⭐ The READ-FORK INVENTORY (a NAMED deliverable)

Exactly **ONE** `match.dvDeliveryValue` fork in `src/**`. Every consumer keys off the nullable
seat it produces, never off the flag again:

| # | site | file | what it feeds |
| --- | --- | --- | --- |
| **1** | `const dvSeat = match.dvDeliveryValue ? deliveryValueSeatOf(g) : null;` — THE SEAT FORK | `src/ai/PlayerBrain.ts`, `decideOnBall`'s pass block | the arming rule (flag + a non-absent gene ⇒ a seat; otherwise `null`). It reads **the genome and nothing else** — no `match` member, no percept pull, no world state |

Downstream of it, and counted separately: **ONE** `RISK_PRICE` call site (inside the ONE hoisted
`groundCandidate`, as its last statement), **ONE** `PRICER_RETURN` (`return { s: sDv, … }`) and
**ZERO** new strike statements (`match.performPass(` still 3×, `const groundCandidate = (`
still 1×). Everything else that names the flag or the module is a declaration, an init, the
League union key, an import or the seat/genome module's own body — enumerated in the artifact
with file:line and class, **zero unclassified**.

**Byte-identity is arithmetic, not hope**: with the fork not taken, `dvSeat` is `null`, the
ternary returns `s` itself, and `groundCandidate` returns the incumbent statements' own double.

### Untouched (restated as a prohibition)

Every banked delivery seam's own law, gene, flag, module and tests — `passLeadSeat.ts`,
`deliveryChoiceSeat.ts`, `strikePlaneSeat.ts`, all three fork lines, the strike plane's
precedence guard, the banked led-strike statement · the `MakeRun` through-ball licence path ·
**the lofted switch and its `d > 24` gate** (which has its OWN pricing chain, `sL`, and is
therefore NOT priced by this seam — stated, not hidden) · the automatic ground bender · the
cross, the cutback, the keeper's outlet · ⚠ **`whetherEye` and its certified hold table — the
#248 archetype debt, explicitly NOT this round's** · `TeamBrain` designation and every licence ·
the OBM seat and the CTB plane · `perceptionSnapshot.ts` · `a4World.ts`'s flag set and all three
play-test worlds · the render layer · `performPass`'s signature and body.

⚠ **SCOPE NOTE, stated so nobody over-reads "every delivery seam"**: the risk price reaches every
candidate that goes through the **ground-pass pricer**. The LOFT, the THROUGH BALL, the CROSS and
the CUTBACK price themselves on their own chains and are **not** priced by this seam. Extending
it to them is a later slice's, with its own contract.

---

## §PINS — the PIN INVENTORY (a NAMED deliverable)

Everything that pins the touched surfaces, and what happened to it. **Nothing is silently
renegotiated**; had any of these broken, the standing instruction is STOP-and-report, never a
test edit.

| # | pin | where | class | disposition |
| --- | --- | --- | --- | --- |
| 1 | ⭐⭐ the **DLC-T0 NO-TASTE pin** — the two banked candidate calls VERBATIM and *exactly one* `groundCandidate` declaration; its scanned slice runs `if (dlcSeat !== null) {` → `// Lofted switch:` and bans `*= `, `attrs.`, gene names | `tests/dlcDeliveryChoice.test.ts` | source text | **UNTOUCHED and GREEN — and it SHAPED the design.** The risk price is added at the pricer's RETURN, which is outside that slice; adding a per-seam term inside it would have been a test edit, and a pinned test is a STOP |
| 2 | ⭐⭐ the **DLC-T0s NO-TASTE pin** — the plane block's slice (`if (spSeat !== null …` → `if (pressure > 0.5)`) under the same bans | `tests/dlcStrikePlane.test.ts` | source text | **UNTOUCHED and GREEN — the other shaping pin**, same reason |
| 3 | ⭐⭐ the **three banked G-FORK pins** — *exactly one* `match.ptpPassLead` / `match.dlcDeliveryChoice` / `match.dlcStrikePlane` line, each asserted as EXACT TEXT | `tests/ptpPassLead.test.ts`, `tests/dlcDeliveryChoice.test.ts`, `tests/dlcStrikePlane.test.ts` | source text | UNTOUCHED and GREEN — this seam adds a FOURTH fork of its own and edits none of theirs |
| 4 | ⭐ the **DLC-T0 ZERO-NEW-STRIKE pin** — `match.performPass(` exactly 3× in `PlayerBrain.ts` | `tests/dlcDeliveryChoice.test.ts` | source text | UNTOUCHED and GREEN — this stage adds no strike statement at all |
| 5 | ⭐ the **strike plane's PRECEDENCE GUARD**, verbatim | `tests/dlcStrikePlane.test.ts` | source text | UNTOUCHED — DV has no precedence relation to freeze (it prices, it does not compete) |
| 6 | the **O1 wind-up's SEAM-SINGULARITY pins** | `tests/o1PassWindup.test.ts` | source text | UNTOUCHED and GREEN |
| 7 | the whole banked `ptpPassLead` (24) / `dlcDeliveryChoice` (19) / `dlcStrikePlane` (21) suites | those files | mechanism | UNTOUCHED and GREEN, verbatim, re-run in §CHECKS |
| 8 | the banked OBM seat's and CTB plane's fixtures | `tests/obmEyesSeat.test.ts`, `tests/ctbSupportPlane.test.ts` | mechanism | UNTOUCHED and GREEN — and crossed against this seam in G-CROSS |
| 9 | the **production fingerprint** `57b0bdab…c673` | asserted in 13 test files | league identity | UNTOUCHED — and independently recomputed as G-IDENT / G-FP |
| 10 | the 5v6 sanity invariant and the goal-level shape pin | `tests/cards.test.ts`, `tests/formations.test.ts` | full-match directional | UNTOUCHED — flag born false ⇒ byte-identical world. Re-run in the FULL suite |
| 11 | the whole suite | every pre-change test file (plus this stage's new one) | everything downstream | G-SUITE runs it in full (§CHECKS). **No test file was edited by this stage**; the only `tests/**` change is the NEW `dvDeliveryValue.test.ts` |

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

`head` / wall-clock / paths ride the UNHASHED envelope (#197-M1) so `resultSha256` re-derives at
any commit or path.

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with the flag and genes absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — all three RECOMPUTED IN-PROBE. **Semantics: this IS the sim path's RNG-stream receipt** | HARD |
| **G-FP** | the 1337 row IS the production fingerprint; `npm run fingerprint` prints it unchanged | HARD |
| **G-OFF** | per-match whole-run signature **including the rng stream state**: flag ABSENT ≡ flag FALSE, in BOTH world shapes, on every receipt seed. **Semantics (#194): CONFIG EQUIVALENCE only** | HARD |
| **G-BORN** | ARMED with both genes ABSENT ≡ OFF, byte for byte. **Semantics: THE ARMS DIFFER IN CODE PATH** — armed ⇒ the arming rule runs on every on-ball decision and returns `null` | HARD |
| ⭐ **G-ZERO** | ARMED with the genes PRESENT AT ZERO ≡ OFF, byte for byte, in BOTH world shapes. **Semantics: THE STRONGER FORM** — the seat exists, the exposure IS computed for every priced candidate and the subtraction IS performed, and the world is still the shipped one because `0·e + 0·v` is exactly `+0` | HARD |
| ⭐ **G-EXPOSURE** | **THE FROZEN LAW, re-derived INDEPENDENTLY on sampled live states in BOTH world shapes.** Four checks, all required ZERO: the module's output equals an independent re-implementation `Object.is`-exactly · every reading is in [0,1] · with every closer FROZEN (`topSpeed 0`) the reading is EXACTLY `1 − laneOpenness` (the degeneracy that makes this a sharpening, not a new sense) · DOUBLING every body's top speed never LOWERS the reading. ⚠ Probe-side computations on live states, not a tally of prices the brain formed | HARD |
| ⭐ **G-BELIEF** | the zoning re-derived from `HALF_L` at 0.25 m resolution across the whole pitch (mismatches ZERO) · the composition equals `w·exposure + belief[zone]·passBase` on 400 randomized fixtures, `Object.is`-exact · the all-zero seat returns EXACTLY `+0` and `s − price === s` on every probe value | HARD |
| **G-BITE** | ARMED + dosed the world DIVERGES on every receipt seed **in BOTH world shapes**; ⭐ **the CORNER READ**: EACH LIMB ALONE reprices — a belief doped on the OWN THIRD only (exposure weight 0) moves the world, and an exposure weight of 1 (belief flat zero) moves it too, so neither limb is carried by the other | HARD |
| ⭐⭐ **G-SEAMS** | **ONE PRICER, EVERY DELIVERY SEAM**: exactly ONE `groundCandidate` declaration (machine-counted) and ONE risk-price call site, plus FOUR matrix claims — adding this door moves the world on top of (a) the incumbent to-feet loop, (b) the banked two-point contest, (c) the banked strike plane and (d) the banked forced aim | HARD |
| ⭐⭐ **G-NOTABLE** | **THE #247 SPLIT, HELD BY GREP.** No file in `src/**` contains the census artifact's name, its schema name, or ANY of its measured values (every zone hazard, every relative-shape number, the all-zones baseline — as written and as percentages), and no DV seam file contains a loader, a `docs/` path or a dynamic import | HARD |
| ⭐ **G-EPI** | the seat module never names `Match` in executable source and never imports it; its position source is the caller's own `opp.players`, the same array the shipped corridor read is called with; and its executable source names no gene, attribute, trait or rng | HARD |
| ⭐⭐ **G-CROSS** | **THE DOORS MATRIX (#228), gated from birth, FOUR doors.** 96 cells — {`dvDeliveryValue`} × {`dlcDeliveryChoice`} × {`ptpPassLead`} × {`dlcStrikePlane`} × {the neighbours' banks dosed/absent} × {DV's genes absent/zero/dosed} — one FULL match per cell per seed, whole-run signature incl. rng state, inside the G-DET core. Claims EX ANTE: **(DORMANT-ALL)** every door shut ⇒ every gene state is the incumbent world · **(A)** DV armed with every neighbour bank DOSED and its own genes ABSENT ≡ ALL-OFF, and the same at gene ZERO, and an armed DV is *unchanged* by those banks · **(B)** each neighbour armed alone is unmoved by this door at every DV gene state · **(INTERACTION)** ⭐⭐ the four DV-BITES-ON rows · **(DISCRIMINATION)** DV is NEITHER the contest NOR the plane · plus the non-vacuity BITE rows | HARD |
| **G-RNG** | the seam draws **zero** rng (an armed, dosed price computed over every body pair on a stepped fixture leaves the match rng state EXACT); and the GENOME: with the opt-in OFF, 8 generations of the shipped mutate+crossover reproduce a faithful PRE-GENE re-implementation's genomes AND final rng state exactly, the keys stay absent, no existing opt-in run's stream moves, the opt-in DOES draw when asked, the belief materialises at its frozen width, and crossover COPIES parent A's belief rather than aliasing it | HARD |
| **G-HYGIENE** | `dvDeliveryValue` absent from `a4World.ts` **entirely**; initialised `cfg.dvDeliveryValue ?? false`; both genes outside `GENE_KEYS` and never serialized by `randomGenome`; a fresh Match and a League match are both OFF; no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` anywhere on a seam line | HARD |
| **G-FORK** | ⭐ the READ-FORK INVENTORY: **exactly ONE** `match.dvDeliveryValue` fork in `src/**`, at the named site, feeding exactly ONE risk-price call inside the ONE shared pricer, with **ZERO** new strike statements (`match.performPass(` still 3×) and the `groundCandidate` declaration still 1×; every other `src/**` occurrence enumerated with file:line and class, **zero unclassified** | HARD |
| **G-TRACE** | every constant back to the line it came from, VERBATIM — the flight speed is not even re-typed (the banked `PTP_FLIGHT_SPEED` symbol is imported), the corridor scale and the near-field guard are `laneOpenness`'s own lines, the zoning is re-derived from `HALF_L`, the value scale is the pricer's own `passBase` — plus the UNTOUCHED INCUMBENTS: all three banked candidate calls, the banked led-strike statement, the loft's `d > 24` gate, the through-ball licence guard and `whetherEye` (the #248 debt, explicitly not this round's) | HARD |
| **G-PINS** | the §PINS inventory's machine-checkable rows recomputed, **including all three banked G-FORK pins' exact text in the test files AND in `src/**`** | HARD |
| **G-SEED** | seed-block disjointness proved in-probe for **all four** intervals this stage consumes, against the COMPLETE consumed ledger **incl. DV-C0's four blocks** | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests | HARD |
| **G-SUITE** | FULL `npm test` green + `tsc --noEmit` clean. (Load-induced timeout flakes are reproduced on the PRE-change tree before being accepted) | HARD |
| ⭐ **REPORTED (a)** | **THE TRUTH-DOSED SMOKE**: the instrument READS DV-C0's artifact and WRITES the census hazards into the belief genes (the DV-T1 mechanism, executed here), and the chosen-delivery mix is published beside the zero-belief arm. No control, no CI, **no ANSWER** | REPORTED |
| **REPORTED (b)** | the **CHOOSER-COST** reading in the corrected per-tick form ex ante: per-arm tick counts published, headline **ms/TICK**, total wall CONTEXT only, and the **noise floor** stated from the instrument's own control pair (`off` vs `bornArmed`) | REPORTED |

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any src diff outside the
seam path, any rng draw appearing on the dormant path, any predicate appearing anywhere, or
**any existing test breaking** (a STOP-and-report, never a test edit).

No bootstrap is used anywhere in this stage, so the ≥106,200 stats base does not apply — this
stage draws no stats stream at all, and says so rather than reserving one it does not use.

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| everything consumed through DV-C0 | see the probe's `CONSUMED` table (inherited in full, incl. DV-C0's smoke 12,429,000–011 · guard 050–099 · census+reserve 100–899 · G-WORLD 999) | prior |
| **DV-T0 receipts (this stage)** | **12,430,000 – 12,430,023** (24 seeds × 9 arms; ⭐ the 96-cell G-CROSS matrix re-uses the FIRST 2 of these same seeds — **no new block**) + **12,430,024** (the exposure/belief/corner reads) | **CONSUMED here** |
| **DV-T0 REPORTED cost read** | **12,430,025** | **CONSUMED here** |
| **DV-T0 REPORTED truth-dosed smoke** | **12,430,026** | **CONSUMED here** |
| DV-T0 test-file seeds (not a battery) | 12,430,900 – 12,430,911 | consumed here |
| free above | 12,430,027 – 12,430,899 and 12,430,912 + | available to DV-T1 |

Disjointness is computed **in-probe** for all four intervals separately, not asserted here.

## §ROAD B — nothing ships

`dvDeliveryValue` is **OFF in every production path** — a hard `false` default, absent from
`a4World.ts` and from all three play-test worlds, absent from every League's `matchFlags` unless
a probe sets it explicitly — and even ARMED it does nothing while the genes are absent (G-BORN)
or zero (G-ZERO). The two genes are born absent, outside `GENE_KEYS`, and evolve only under a
new explicit opt-in that every production `evolve.ts` call omits. The production fingerprint is
unchanged, the flag-off world is byte-identical on three league seeds and on every receipt match
seed with the rng stream included. **Nothing about the game the user plays changes in this
commit.** The seam exists so DV-T1 can run the map exam.

**Road B statement**: fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **must not move, and did
not**.

## §NON-CLAIMS

DV-T0 claims **no** football effect: not on supply, the goal band, interceptions, offside,
spacing or watchability. ⭐⭐ **It does not give any team the census's map** (#247): it adds the
BELIEF REPRESENTATION — the programme's first evolvable world-price belief (#248.2(v)) — born
absent. It does not claim the risk law is RIGHT (§HONESTY 4: the closing model is `topSpeed · t`
and the map is three cells); whether a correct map fixes the #244 deflation is DV-T1's
F-DV-a/b/c and whether evolution FINDS it is DV-T2's. It adds **no** value-side nonlinearity and
**no** reception-context term (contract §4's named later slices), prices **no** loft, through
ball, cross or cutback (§SEAM's scope note), discharges **none** of the #248 debts (the hold
table above all), and changes no TeamBrain assignment, no licence, no attribute, no action type
and no render cue. The truth-dosed smoke is an uncontrolled descriptive reading of one seed and
adjudicates nothing. It cannot authorize DV-T1 or DV-T2; only the commander can (#203).

---

## §RESULT — the gates run

*(filled in from the committed artifact after the receipts ran; every number here is quoted FROM
`docs/world-model/data/dv-t0-risk-pricing.json`, which is recomputed by
`npx tsx scripts/probes/dv-t0-risk-pricing.ts` — the doc never carries evidence the artifact does
not.)*

Tests: [`../../tests/dvDeliveryValue.test.ts`](../../tests/dvDeliveryValue.test.ts) — **23 pins**
(23 `it()` blocks). Receipts:
[`../../scripts/probes/dv-t0-risk-pricing.ts`](../../scripts/probes/dv-t0-risk-pricing.ts),
artifact [`data/dv-t0-risk-pricing.json`](data/dv-t0-risk-pricing.json).

**24 seeds × 9 arms, block 12,430,000–023 · 96-cell G-CROSS matrix on the first 2 · 19/19 HARD
gates PASS**, `resultSha256` `9220ae88…c2a7`, G-DET digest `502faa31…aad2` twice, 104 s.

### Gate table

| gate | result | evidence |
| --- | --- | --- |
| `gDet` | **PASS** | digest `502faa31101df62c…` on both runs |
| `gIdent` | **PASS** | 3/3 league seeds identical: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…39f26` — all recomputed in-process |
| `xFpProd` | **PASS** | observed `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` = baseline |
| `gOff` | **PASS** | 24/24 seeds, both world shapes |
| `gBorn` | **PASS** | 24/24 seeds — armed with both genes absent ≡ off |
| ⭐ `gZero` | **PASS** | 24/24 seeds in BOTH shapes — the seat exists, the exposure is computed for every priced candidate, the subtraction happens, and the world is byte-identical |
| ⭐ `gExposure` | **PASS** | percept **51,420** priced pairs over 857 samples · bare **53,580** · mismatches vs the independent re-derivation **0** · out-of-range **0** · degeneracy-vs-`1 − laneOpenness` mismatches **0/51,420** · monotonicity violations **0/51,420** |
| ⭐ `gBelief` | **PASS** | boundary **10.5000 m** = `HALF_L / 3` · 252 zone checks, **0** mismatches · 400 composition fixtures, **0** mismatches · zero-point exactly `+0` · 1,600 `s − price === s` identity checks, **0** violations · scale `passBase` 0.2 |
| `gBite` | **PASS** | diverged 24/24 percept, 24/24 bare; ⭐ corner read 2/2 belief-only flips **and** 2/2 exposure-only flips (seeds 12,430,024 / 023) |
| ⭐⭐ `gSeams` | **PASS** | 4/4 DV-BITES-ON rows (feet · contest · plane · forced aim), against **1** `groundCandidate` declaration and **1** risk-price call site |
| ⭐⭐ `gCross` | **PASS** | **96 cells × 2 seeds, 22/22 claims**, every one on every seed |
| `gRng` | **PASS** | seam: 60 priced deliveries, rng state `452442103` → `452442103`; genome: all 8 evolution limbs true |
| `gHygiene` | **PASS** | 8/8 (hard false · absent from a4World · fresh Match off · League match off · no env door · both genes outside `GENE_KEYS` · never serialized · degrade to zero) |
| `gFork` | **PASS** | **1** flag fork · **1** risk-price site · **1** pricer return · `performPass` **3×** · `groundCandidate` **1×** · 52 src occurrences classed, **0 unclassified** |
| `gTrace` | **PASS** | 14/14 source lines found VERBATIM |
| ⭐⭐ `gNotable` | **PASS** | **7** census values checked (3 hazards + 3 relatives + the all-zones baseline), each as written and ×100 — **0** artifact-name hits, **0** value hits, **0** loader hits across the whole `src` tree |
| ⭐ `gEpi` | **PASS** | the seat's executable source names no `Match`, no `match.`, no `perceivedSnapshot`, no gene/attr/trait/rng; it does not import `Match`; the brain hands it the pricer's own `opp.players` |
| `gPins` | **PASS** | 9/9 rows held |
| `gSeed` | **PASS** | 4/4 intervals disjoint from the complete ledger (60 blocks, incl. DV-C0's four) |

### ⭐ THE EXPOSURE READING — what the world's lanes actually look like

| world shape | priced pairs | mean exposure | max | pairs reading exactly 0 | mean flight |
|---|---:|---:|---:|---:|---:|
| percept-armed | 51,420 | **0.8126** | 1 | 7,242 | 1.0846 s |
| bare production | 53,580 | **0.8321** | 1 | — | — |

⚠ **A FACT DV-T1 MUST KNOW, published here rather than discovered mid-exam: the reading
SATURATES HIGH.** With a mean flight of ~1.08 s, a body covers ~7–9 m, which is comfortably more
than the corridor family's own 4 m scale — so most body-to-body lanes in a 6v6 read as
substantially exposed and the term behaves more like "how much *less* than 1" than like a sparse
alarm. That is a property of THIS world's geometry (the #246 rule: the numbers are ours), not a
defect, and it is exactly why the exposure weight is a gene rather than a constant. It also means
a dose of 1 is a very large lever — visible in the cost row below, where the dosed arm is a
materially different world.

### ⭐⭐ REPORTED (a) — THE TRUTH-DOSED SMOKE (the DV-T1 mechanism, executed)

The instrument read `docs/world-model/data/dv-c0-loss-cost.json` →
`result.census.yardstick.zones[z].hazard` in the frozen `own · middle · final` order and WROTE
**`[0.0816, 0.04209, 0.01807]`** into `dvLossBelief` on all three genome views of both teams.
INSTRUMENT → GENES; never CODE → TABLE (`gNotable` proves the second half).

| arm (seed 12,430,026) | deliveries priced | zone shares own / middle / final | mean exposure | mean risk price |
|---|---:|---|---:|---:|
| BELIEF-ZERO (the incumbent map) | 103 | 0.262 / 0.544 / 0.194 | 0.712 | 0 |
| ⭐ TRUTH-DOSED (census hazards) | 85 | 0.212 / **0.741** / 0.047 | 0.711 | 0.009865 |
| ⭐ TRUTH-DOSED + exposure at 1 | 37 | 0.351 / 0.568 / 0.081 | **0.418** | 0.428614 |

⚠ **DESCRIPTIVE ONLY — three arms of ONE seed, no control, no CI, no verdict (#203).** What it
shows is that the mechanism is CONNECTED: a truth-dosed belief moves the delivered mix, and a
dosed exposure weight cuts the mean exposure of the balls actually struck from 0.712 to 0.418 —
the chooser really is buying safer flights when it is told to care. It shows nothing about
whether that is GOOD; that is DV-T1's pre-registered JOINT.

### REPORTED (b) — THE CHOOSER COST (per-tick, seed 12,430,025, best of 3)

| arm | ticks | ms/tick | per-tick vs off |
|---|---:|---:|---:|
| off | 15,043 | 0.005983 | — |
| bornArmed (seat null — NO exposure work) | 15,043 | 0.006049 | +1.10 % |
| ⭐ zeroArmed (seat live — FULL exposure work) | 15,043 | 0.006049 | **+1.10 %** |
| armed + dosed | 15,335 | 0.005543 | −7.35 % |

⭐ **THE LIKE-FOR-LIKE COST IS THE `zeroArmed` ROW, and it is +1.10 % — IDENTICAL to the
born-armed control that does no exposure work at all.** Same tick count, same world, the only
difference being that `zeroArmed` computes an exposure for every priced candidate. The two agree
to the reported precision, so **the exposure scan's cost is below this instrument's resolution
(noise floor 1.10 %/tick)**. ⚠ The `armed` row is **NOT a cost reading**: it is a DIVERGED world
with a different tick count (15,335 vs 15,043), and its negative sign is world composition, not
work — reported for completeness and explicitly not interpreted. The lever, named not pulled:
one opposition scan per priced candidate ⇒ nine per support mate when the strike plane is also
armed.

### §CHECKS

* `npx tsc --noEmit` — clean.
* `npm test` — **1,331 of 1,333 tests green across 134 files** (23 new DV pins; no test file
  edited). ⚠ The two reds are `careers.test.ts > save/load: v7 roundtrips…` and
  `formationEvolution.test.ts > ten seasons…`, **both `Test timed out`**, never an assertion.
  Reproduced on the **PRE-change tree** before any DV code existed (that run also failed 2 of
  1,310 with the same timeout signature, and an earlier full run failed 5), and both pass when
  their files are run alone (`formationEvolution` needs 158 s against a 180 s limit that the
  parallel run exhausts). Recorded as environmental load, not accepted as green-by-assertion and
  not silenced by a config edit.
* `npm run fingerprint` — `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`,
  unchanged.

### §DEV — the deviations, declared

1. **THE EXPOSURE IS A MAX AT CLOSEST APPROACH, NOT A SAMPLED INTEGRAL** (§LAW sharpening 1). The
   contract says "integrated over the ball's own travel" and is silent on the quadrature; a
   sampled integral would have required an invented sample count and an invented kernel.
2. **THE CLOSING MODEL IS `topSpeed · t`** — no acceleration, no reaction delay, no facing
   (§HONESTY, sharpening 2). It overstates a stationary defender's closing and understates
   nothing; the richer `estimateReach` account would have been a new channel.
3. **THE READING SATURATES HIGH** (mean 0.81). Published above as a fact about this world's
   geometry, not corrected — correcting it would be re-scaling a measured quantity to taste.
4. **THE BELIEF IS ONE ARRAY GENE WITH ONE OPT-IN**, crossing over as one draw (sharpenings 3/4).
5. **THE VALUE SCALE IS `W.passBase`**, with `W.passLaneW` named and rejected (sharpening 5).
   Consequence, stated: the truth dose subtracts only ~0.4–1.6 % of a pass's base value
   (§HONESTY 5), which is small — an honest property of the world's own prices.
6. **THE SEAM PRICES THE GROUND-PASS PRICER'S CANDIDATES ONLY.** The loft, through ball, cross
   and cutback have their own chains and are untouched (§SEAM scope note) — "every delivery seam"
   in this stage means every seam that feeds `groundCandidate`.
7. **THE ZONE LOOKUP IS A SELECTOR, NOT A PREDICATE**, and is declared as such in §LAW rather
   than left for a reader to adjudicate.
8. ⚠ **PROCESS DEVIATION, RECORDED IN FULL.** Mid-round, a CONCURRENT session judged this
   executor dead and (per its own checkpoint commits `dfba536` / `ba91a11`) deleted the untracked
   partials and reverted the tracked seam edits while this executor was still live; the work was
   reconstructed and immediately staged so it would no longer read as an untracked stray. No
   third-party file was touched, `PROGRAMME.md` / `PROGRAMME-RULINGS.md` were not edited, and
   every gate above was run AFTER the reconstruction on the reconstructed tree. HEAD moved from
   `2d1f919` to `ba91a11` during the round; the fingerprint and all three G-IDENT baselines were
   re-derived against the new HEAD and are unchanged.
9. **NO CHECKPOINT/RESUME** in the probe: the receipts are ~2 minutes; a kill costs the run.
