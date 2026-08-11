# DLC T0s — the DORMANT GROUND STRIKE PLANE (`dlcStrikePlane`, 控制的是那一脚)

Status: **PRE-REGISTERED, then BUILT + RUN the same round** (the OBM-T0 / CTB-T0 / PTP-T0 /
DLC-T0 two-part form).

The frozen law, the seam, the precedence chain, the read-fork inventory, the gates, the seed
ledger, the PIN INVENTORY and the Road B statement below were written **before** the receipts
ran (the frozen-before-sight rule); the measured numbers arrive only in
[§RESULT](#result--the-gates-run) at the foot, and every number there is quoted FROM the
committed artifact.

Authority chain: contract [`DELIVERY-CHOICE-CONTRACT.md`](DELIVERY-CHOICE-CONTRACT.md) — §2
**M-DLC.1″** (THE STRIKE SPACE, the #241 amendment: *the control variables are the STRIKE's
own parameters — direction, power, elevation, spin — and the trajectory is the ball physics'
product*), whose **SLICE DISCIPLINE** names this stage exactly: ***one-s* = the GROUND strike
plane (direction × power; elevation 0, spin 0 — the incumbent ground pass is the zero-point;
subsumes M-DLC.1′'s segment)**. Also binding: **M-DLC.2** as amended (#236 amendment 1 —
slice one carries **NO taste term at all**), **M-DLC.3/4** (the menu grows by slices, each
born absent; the flag hard-false; two-doors gated from birth), and §3's DLC-T0 clause with
⚠ **#236 amendment 2** (*"inherited" NEVER exempts an identity gate*) and ⚠ **#236 amendment
4** (*a REPORTED chooser-cost reading*). Rulings **#240** (continuous aim ruled in; the gene's
**magnitude role retires**) and **#241** (控制的是那一脚 — M-DLC.1″ supersedes the unbuilt 1D
aim segment; the loft/bender slices dissolve into one continuous kick space).

The banked seams this stage reuses **verbatim** and **yields to**:
[`PTP-T0-DORMANT-SEAM.md`](PTP-T0-DORMANT-SEAM.md) — its projection function
(`src/ai/passLeadSeat.ts`) is **untouched code**, imported not re-derived; it is this grid's
one traced SCALE.
[`DLC-T0-DORMANT-SEAM.md`](DLC-T0-DORMANT-SEAM.md) — **THE FOUNDATION**: the hoisted
`groundCandidate` pricer (one function, called once per candidate), the strict-`>` tie rule,
the argmax entry, and the banked led-strike statement that carries a chooser's own
displacement into `performPass`. Its **two-point contest STAYS BANKED and untouched** as
DLC-T1s's CONTRAST ANCHOR — which is why `dlcDeliveryChoice` and every one of its pins
survives this stage verbatim.
[`OBM-T0-DORMANT-SEAM.md`](OBM-T0-DORMANT-SEAM.md) / [`CTB-T0-DORMANT-SEAM.md`](CTB-T0-DORMANT-SEAM.md)
are the FORM: the G-CROSS doors matrix (#228) as a birth gate, and the cost-reading form for
the REPORTED wall-clock (with DLC-T0's own **b8f5ef0 correction** — per-tick, per-arm tick
counts, a stated noise floor — applied **ex ante** here rather than after the fact).

---

## §LAW — the frozen law of the ground strike plane

```text
THE STRIKE PLANE (M-DLC.1″ slice ONE-S), for a mate in the ORDINARY pass loop, ARMED
  armed  ⇔  match.dlcStrikePlane === true  AND  g.passLeadSupport !== undefined
            AND the banked doors are shut (see THE PRECEDENCE CHAIN)

  THE CONTROL VARIABLES, and there are exactly two (elevation 0, spin 0 — one-s's bounds):
    DIRECTION   the bearing the ball is struck along
    POWER       the weight it is struck with

  THE SCALE, TRACED — ONE number, and it is the engine's own:
    reach = | passLeadOffset(seat AT WEIGHT 1, from, mate) |
          = |motion| · (d0 / PTP_FLIGHT_SPEED) · PTP_LEAD_FLIGHT_MUL
          = |motion| · (d0 / 18) · 1.6              [the through-ball loop's own divisor;
                                                     runBurstPoint's own in-stride factor]
    i.e. THE DISPLACEMENT THIS ENGINE ALREADY BELIEVES A RECEIVER COVERS WHILE THE BALL IS
    IN THE AIR. So the plane the chooser samples IS the receiver-reachable set: every grid
    member is a ball this mate could MEET, computed from the flight/projection family the
    engine owns. Nothing here is a taste knob and nothing here is new.

  THE GRID, K = 9 (3 directions × 3 powers), in a FROZEN ORDER (direction-major, then
  power, both ascending ⇒ index = (i+1)·3 + (j+1)):
    u      = (mate.pos − from) / d0                the mate-ward bearing (the incumbent's)
    θ      = atan2(reach, d0)                      the angle reach SUBTENDS at this distance
    r(i)   = u rotated by i·θ,      i ∈ {−1, 0, +1}          THE DIRECTION CONTROL
    L(j)   = d0 + j·reach,          j ∈ {−1, 0, +1}          THE POWER CONTROL
    strike(i,j) = r(i)·L(j) − u·d0                 the displacement off the incumbent point
    aim(i,j)    = mate.pos + strike(i,j)           THE RECEIVING POINT it is priced at

  PRICING: each of the nine is scored by the SAME hoisted `groundCandidate(mate, aim, d)` —
  the DLC-T0 pricer, ONE function, no second copy, NO taste multiplier (#236 amendment 1) —
  at ITS OWN receiving point. All nine enter the SAME `bestPass` argmax, exactly as the
  incumbent single candidate always did. THE ARGMAX IS THE CHOICE: no threshold, no
  predicate, no comparison logic of this stage's own.

THE ZERO-POINT IS TODAY'S KICK, and it is a GRID MEMBER (index 4: i = 0, j = 0)
  strike(0,0) = u·d0 − u·d0 = EXACTLY ±0 in IEEE-754.
  ⇒ aim(0,0) has mate.pos's own coordinates (x + ±0 === x), the shared pricer returns the
    INCUMBENT'S OWN DOUBLE, and — because the incumbent candidate is scored and compared
    FIRST and the argmax is strict `>` — the zero-point WINS EVERY TIE. Today's kick is not
    "the fallback"; it is the candidate the whole plane must beat.
  ⭐ THIS IS WHY THE GRID IS WRITTEN AS A DIFFERENCE OF DISPLACEMENTS rather than as an
    absolute point `from + r·L`: the latter leaves a ~1e-16 residue and the incumbent kick
    would not have been a member of its own grid.

THE STRIKE — the winner rides the EXISTING machinery, ZERO new strike statements
  the winning member's own `strike` is carried in `bestLeadX/Y` and handed to the BANKED
  statement `performPass(..., v2(bestLeadX, bestLeadY))`, unchanged, including its guards.
  ⭐ THAT IS HOW (direction, power) REACH THE KICK, and it is traced, not added:
    * DIRECTION — `performPass` strikes along `norm(sub(lead, passer.pos))`, the bearing to
      the point it is handed. Moving the point IS choosing the direction.
    * POWER     — `performPass` weights the ball `clamp(d · 0.6 + 8.2, 9, 22) · executedMul`
      where `d = dist(passer.pos, lead)`. The shipped speed law is MONOTONE in the struck
      distance, so the struck LENGTH IS the weight. `powerChoice` stays at the incumbent 1
      on every call — the 5th argument is not touched by this stage.
  THE COMPOSITION IS THE BANKED ONE (PTP-T0 §HONESTY 5, inherited verbatim): performPass
  ADDS the handed displacement to its own strike-time correction, so the ball is struck
  BEYOND the priced receiving point rather than on it. That is the design (the passer's
  body knowledge is not replaced) and it is why the born-absent world is byte-identical
  rather than merely close.

THE GENE'S MAGNITUDE HAS RETIRED (#240/#241), stated bluntly
  passLeadSupport GATES PRESENCE and scales NOTHING. The projection is evaluated at
  weight 1, so gene 0, 0.37 and 1 are ONE WORLD (G-VALUE). ⭐ 0 IS NOT "OFF" under this
  door — what disables the plane is ABSENCE, and only absence (G-BORN). Nobody may read a
  future gene-0 arm as "the mechanism disabled".
  ⭐ NO NEW GENE, NO NEW OPT-IN, NO GENOME CHANGE WHATSOEVER in this stage.

NO PREDICATES (#200) — the complete conditional set is GATE and GUARD
  a mate NOT in support mode, a mate this body has never seen, a mate standing still:
  reach === 0 ⇒ every one of the nine members' displacement is EXACTLY ±0 ⇒ the whole
  plane collapses onto today's kick and loses the tie. Without a branch, without a
  threshold, and without anything asking whether he is moving, checking, fast or free.

BOUNDED BY CONSTRUCTION — which is why NO CLAMP is taken (the PTP-T0 §NO-CAP precedent)
  reach = d0 · |motion| / 11.25, and no body in this engine carries |motion| ≥ 11.25 m/s
  (`BASE_SPEED` tops at 7.9 and `topSpeed` scales it by ≤ 1.12 ⇒ ≤ 8.848 m/s). So
  reach < d0 ALWAYS: every power variant's length is positive and every direction
  variant's rotation is under 45°. MEASURED in G-GRID, not trusted.

THE ZERO-POINT OF THE WORLD (M-DLC.4)
  flag off OR gene absent ⇒ no seat ⇒ NO GRID FORMS ⇒ the pass loop's arithmetic is
  byte-identical (IEEE-exact). Measured by G-OFF / G-BORN / G-IDENT / G-FP, not asserted.
```

### ⭐⭐ THE PRECEDENCE CHAIN — frozen ex ante, and gated rather than promised

Three doors now read the same gene. The law, in one line:

> **THE NEWEST SEAM YIELDS TO EVERY BANKED ONE.** No grid forms while the `ptpPassLead`
> seat or the `dlcDeliveryChoice` seat exists. ⇒ **armed-both ≡ the banked door armed
> ALONE, byte for byte, at every gene state**, and all three open resolves to the oldest
> (`o1PassWindup` > `ptpPassLead` > `dlcDeliveryChoice` > `dlcStrikePlane`).

**Why this direction and not the other.** The task allowed either strike-plane precedence or
banked-seam precedence. Banked-seam precedence is chosen because it is (a) the standing
precedent in this family — PTP-T0 §HONESTY 6 gave precedence to `o1PassWindup`, DLC-T0 §LAW
gave it to `ptpPassLead`, each time for the same reason — and (b) the only one **available
without editing a pinned line**: `tests/ptpPassLead.test.ts` and `tests/dlcDeliveryChoice.test.ts`
each assert their fork line as EXACT TEXT and assert there is exactly ONE such line, so a
`!dlcStrikePlane` guard on either is a test edit, and a pinned test is a **STOP**.

**How, exactly** — the guard is on the **SEATS**, never on another seam's flag:
`if (spSeat !== null && dlcSeat === null && ptpSeat === null)`. That line names no flag, so
both banked G-FORK pins ("exactly one `match.ptpPassLead` / `match.dlcDeliveryChoice` line,
and here is its text") stay green verbatim. Gated by **G-CROSS**'s `PTP-KEEPS-PRECEDENCE`,
`DLC-KEEPS-PRECEDENCE` and `CHAIN-IS-TRANSITIVE` claim families and by three tests.

**vs `obmMovement` / `ctbSupportPlane`** — independence, not precedence: different seats,
different genes, no shared surface. Proved by the `A-`/`B-`/`C-` claim families in the same
matrix (arming this door with both neighbour banks fully dosed is byte-identical to ALL-OFF;
each neighbour armed alone is unmoved by this door at every gene state).

### The other sharpenings, declared (the contract is silent on each)

1. **K = 9, and the grid steps are ±1** — the SMALLEST grid that contains the zero-point and
   samples both signs of both control variables. K is the scoping lever (the cost lesson), so
   it is stated, small, and named in the artifact rather than buried. Widening it is a
   commander's fork WITH the cost numbers, never a quiet edit.
2. **The grid's angular step is `atan2(reach, d0)`** — the angle the traced reach subtends at
   the pass distance. The alternative (a fixed angle in degrees) would have been an invented
   constant; this one is a function of two quantities the engine already computes.
3. **The plane is scored AFTER the loft block**, at the end of the mate loop. The argmax is
   order-independent except at exact ties, and ties go to whoever was compared FIRST — the
   incumbent — so the placement changes no outcome. It is chosen so the pinned DLC-T0
   `NO TASTE TERM` source slice (`if (dlcSeat !== null) {` … `// Lofted switch:`) is not
   even touched by this stage's diff.
4. **The projection is called at `weight: 1`** rather than by dividing out the gene — the
   #240/#241 magnitude retirement made literal, and it keeps the support-mode SCOPE GATE, the
   percept-honest motion source and both traced constants with exactly ONE owner
   (`passLeadOffset` itself), so nothing is re-derived here.
5. **The LOFT and the BENDER are untouched.** The lofted switch keeps its incumbent pricing
   and its `d > 24` gate (slice **two-s**'s zero-point); the automatic bender stays an
   automatic rule (slice **three-s**'s). Neither is a defect to repair — the #236 街机偏离
   clause binds.
6. **No render cue, no `why`-string change, no new action type.** The winning-member reading
   is taken through `performPass`'s recorded 5th argument in a probe, never by making the
   game say something new.

## §HONESTY — the epistemic limits, stated plainly

1. **Every information-honesty property is INHERITED, not re-opened.** The motion source
   (truth velocity in a bare world; this body's REMEMBERED percept velocity in a percept
   world; zero for a mate he has never seen), the truth-anchored base `mate.pos`, the
   support-mode scope gate and the two traced constants are the banked PTP-T0 seat's, byte
   for byte. This stage adds **no channel, no constant and no read**. G-EPI-MOTION is
   nonetheless RE-GATED here, through this stage's own arming path.
2. ⭐ **The plane is only as honest as the pricing.** The argmax "is" the choice only in the
   sense that the incumbent score chain is the whole judge: a kick the chain misprices will
   be chosen anyway — and this stage puts **nine** points in front of that chain where there
   was one, so any mispricing it has is now sampled harder. T0s claims nothing about whether
   the pricing is right; that is DLC-T1s's **F-DLC-a** in this slice's form.
3. ⚠ **"Receivability" here means the GRID'S BOUNDS, not an acceptance test.** No candidate
   is filtered for being catchable — filtering would be a predicate. What makes every member
   a meetable ball is that the plane is SIZED by the receiver's own projected reach. A member
   at the edge of that set is a ball he must sprint onto, and nothing prices his effort:
   the score chain reads lane/openness/gain at the point, not the receiver's difficulty. That
   is an honest gap and it belongs to a later slice (the receiver's own limb), not to this one.
4. ⭐ **The chooser now pays NINE TIMES per support mate** — nine lane scans, nine openness
   reads, nine style-chain evaluations against the incumbent's one. That is a REAL cost and
   it is REPORTED, per-tick, with a stated noise floor. The honest lever if it is dear is K
   (candidate scoping); never a pricing shortcut.
5. **"Direction × power" is TWO of the four strike parameters.** Elevation and spin are
   two-s's and three-s's; weight-as-in-driven-vs-floated, first-time vs settled, and the
   receiver's preference are not modelled at all (contract §7's honest gaps stand).
6. **The struck point is BEYOND the priced point.** `performPass` adds its own strike-time
   correction to the handed displacement (§LAW). The chooser prices where the ball would
   land from HIS estimate; the passer's body adds its own. Inherited from PTP-T0, measured
   there, unchanged here.

## §SEAM — the mechanism (all of it dormant)

### The gene

**None added.** This slice reuses the banked `passLeadSupport` (born absent, outside
`GENE_KEYS`, evolving only under the banked `evolvePassLeadSupport` opt-in) and reads only
its PRESENCE. `genome.ts` is **untouched** by this stage, so the serialized genome, the rng
stream, the mutation and the crossover orders are the banked ones by construction — and
G-IDENT / G-FP / G-RNG re-prove it anyway.

### The consumption flag

**`dlcStrikePlane`**, a new **explicit** `MatchConfig` boolean, initialised
`cfg.dlcStrikePlane ?? false` (`Match.ts`) — a hard `false`, the `ptpPassLead` /
`dlcDeliveryChoice` / `obmMovement` / `ctbSupportPlane` form. **Never** `EDS_BUNDLE_ARMED`,
never env-armed, never default-ON, never bundle-defaulted: **absent from
`src/game/a4World.ts` entirely**. It gets its own `League.matchFlags` key so a probe world
can arm it explicitly, and that key changes no default.

⭐ **THE ARMING CHECKLIST — TWO limbs (binding)**: armed = the `dlcStrikePlane` flag **+** a
non-absent `passLeadSupport` gene (probe-written on all three genome views of both teams, or
an opted-in evolution run). Even ARMED the world is unchanged while the gene is absent
(G-BORN) — and, unlike DLC-T0, **NOT** unchanged at gene 0 (G-VALUE: 0 is a present gene).

### ⭐ The READ-FORK INVENTORY (a NAMED deliverable)

Exactly **ONE** `match.dlcStrikePlane` fork exists in `src/**`. Every consumer keys off the
nullable seat it produces, never off the flag again:

| # | site | file | what it feeds |
| --- | --- | --- | --- |
| **1** | `const spSeat = match.dlcStrikePlane ? strikePlaneSeatOf(p, match, g, match.edsPerceivedChoice) : null;` — THE SEAT FORK | `src/ai/PlayerBrain.ts`, `decideOnBall`'s pass block | the arming rule (flag + non-absent gene ⇒ a seat; otherwise `null`) and the world-appropriate motion source — ONE percept pull per decision, never per candidate mate, never per grid member |

Downstream of it, and counted separately: **ONE** `GRID_FORM` (`groundStrikeGrid` per
candidate mate, behind the seat's null check and the precedence guard), **ONE** `CAND_SCORE`
call site (the ONE hoisted `groundCandidate`, called once per grid member inside the loop),
**ONE** `GRID_CAPTURE` pair (the winning kick's own displacement into `bestLeadX/Y`) and
**ZERO** new strike statements — the banked led-strike statement is reused verbatim.
Everything else that names the flag or the module is a declaration, an init, the League union
key, an import or the seat module's own body — enumerated in the artifact with file:line and
class, **zero unclassified**.

**Byte-identity is arithmetic, not hope**: with the fork not taken, `spSeat` is `null`, the
grid loop is never entered, `bestLeadX/Y` are written by the incumbent captures alone, and
`groundCandidate` is called exactly as before — the incumbent statements, in the incumbent
order. That is what G-OFF / G-BORN / G-IDENT measure rather than assert.

### Untouched (restated as a prohibition)

The `MakeRun` through-ball licence path — its guard, its `runBurstPoint` call, its lane read,
its chip branch — byte-identical · **the lofted switch and its `d > 24` gate** (slice two-s's,
SHIPPED INCUMBENT) · **the automatic ground bender** (`groundBend` / `bentKick`, slice
three-s's, SHIPPED INCUMBENT — the user's own Phase-71 ask) · the cutback, the cross, the
keeper's outlet · `whetherEye` and the certified price table · `TeamBrain` designation and
every licence · the OBM seat's and the CTB plane's laws, genes, flags and tests · **the
banked PTP-T0 seat module (`src/ai/passLeadSeat.ts`) and the banked DLC-T0 contest module
(`src/ai/deliveryChoiceSeat.ts`) and ALL of their pins** · `perceptionSnapshot.ts`'s honesty
rules · `genome.ts` entirely · `a4World.ts`'s flag set and all three play-test worlds · the
render layer · `performPass`'s signature and body.

---

## §PINS — the PIN INVENTORY (contract §3, a NAMED deliverable)

Everything that pins the touched surfaces, and what happened to it. **Nothing is silently
renegotiated**; had any of these broken, the standing instruction is STOP-and-report, never a
test edit.

| # | pin | where | class | disposition |
| --- | --- | --- | --- | --- |
| 1 | ⭐⭐ **the PTP-T0 G-FORK pin** — *exactly one* `match.ptpPassLead` line in `src/**`, asserted as EXACT TEXT | `tests/ptpPassLead.test.ts` | source text | **UNTOUCHED and GREEN — and one of the two pins that shaped the PRECEDENCE CHAIN.** A `!dlcStrikePlane` guard on that line would have edited it, so precedence went to the banked seam and is achieved by SEAT guards instead |
| 2 | ⭐⭐ **the DLC-T0 G-FORK pin** — *exactly one* `match.dlcDeliveryChoice` line, EXACT TEXT | `tests/dlcDeliveryChoice.test.ts` | source text | **UNTOUCHED and GREEN — the other shaping pin**, same reason |
| 3 | ⭐⭐ **the DLC-T0 ZERO-NEW-STRIKE pin** — `match.performPass(` appears **exactly 3×** in `PlayerBrain.ts`, and the banked led-strike statement is asserted verbatim (with `1` as its power argument) | `tests/dlcDeliveryChoice.test.ts` | source text | **UNTOUCHED and GREEN — and this is why POWER rides the AIM POINT.** Handing a chosen `powerChoice` would have required editing that statement or adding a fourth; instead the power control is expressed as the struck DISTANCE, which the shipped speed law already converts into weight |
| 4 | ⭐ **the DLC-T0 NO-TASTE pin** (the two banked candidate calls, verbatim, and *exactly one* `groundCandidate` declaration) | `tests/dlcDeliveryChoice.test.ts` | source text | UNTOUCHED and GREEN — this stage adds a THIRD call site to the SAME single declaration, and the pinned two are byte-identical |
| 5 | ⭐⭐ **the O1 wind-up's SEAM-SINGULARITY pins** — the synchronous strike line, the wind-up fork line, the kickoff line, the cutback line, all VERBATIM | `tests/o1PassWindup.test.ts` | source text | UNTOUCHED and GREEN — this stage adds NO strike statement at all |
| 6 | **the whole banked `ptpPassLead` suite (24 pins)** and **the whole banked `dlcDeliveryChoice` suite (19 pins)** — DLC-T1s's CONTRAST ANCHOR's foundation | `tests/ptpPassLead.test.ts`, `tests/dlcDeliveryChoice.test.ts` | mechanism | UNTOUCHED and GREEN, verbatim, re-run in §CHECKS |
| 7 | **the `Pass` / `ThroughBall` action-type surface** | `tests/combos.test.ts` | type/label | UNTOUCHED — no new action type, no label, no `why`-string change, no render cue |
| 8 | **the banked OBM seat's 24 fixtures** and **the CTB plane's 16** | `tests/obmEyesSeat.test.ts`, `tests/ctbSupportPlane.test.ts` | mechanism | UNTOUCHED and GREEN — and crossed against this seam in G-CROSS |
| 9 | **the perceived-chooser's own pins** | `tests/perceivedPassChoice.test.ts` | mechanism | UNTOUCHED — the chooser is not modified; `edsPerceivedChoice` is READ as a world shape |
| 10 | **the production fingerprint** `57b0bdab…c673` | asserted in 13 test files | league identity | UNTOUCHED — and independently recomputed as G-IDENT / G-FP |
| 11 | **the 5v6 sanity invariant** and **the goal-level shape pin** | `tests/cards.test.ts`, `tests/formations.test.ts` | full-match directional | UNTOUCHED — flag born false ⇒ byte-identical world. Re-run in the FULL suite |
| 12 | **the whole suite** | every pre-change test file (plus this stage's new one) | everything downstream | G-SUITE runs it in full (§CHECKS). **No test file was edited by this stage**; the only `tests/**` change is the NEW `dlcStrikePlane.test.ts` |

## §GATES — frozen ex ante (⚠ #236 amendment 2: EVERYTHING re-runs)

All computed IN-PROBE (#181.2); `head` / wall-clock / paths ride the UNHASHED envelope
(#197-M1) so `resultSha256` re-derives at any commit or path.

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with the flag and gene absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — all three RECOMPUTED IN-PROBE. **Semantics: this IS the sim path's RNG-stream receipt** | HARD |
| **G-FP** | the 1337 row IS the production fingerprint; `npm run fingerprint` prints it unchanged | HARD |
| **G-OFF** | per-match whole-run signature **including the rng stream state**: flag ABSENT ≡ flag FALSE, in BOTH the percept-armed and the production-shaped world, on every receipt seed. **Semantics (#194): CONFIG EQUIVALENCE only** | HARD |
| **G-BORN** | ARMED with the gene ABSENT ≡ OFF, byte for byte. **Semantics: THE ARMS DIFFER IN CODE PATH** — armed ⇒ the arming rule is evaluated on every on-ball decision and returns `null`, so no grid forms | HARD |
| ⭐ **G-VALUE** | **THIS STAGE'S G-ZERO-FORM, and a DIFFERENT CLAIM.** The #240/#241 magnitude retirement, MEASURED: gene **0 ≡ 0.37 ≡ 1**, byte for byte, on every receipt seed — the value scales nothing. ⚠ **The converse is IN the gate**: none of the three equals the incumbent world. Under this door 0 is **not** "off" | HARD |
| ⭐ **G-GRID** | **THE TRACED GRID, re-derived independently on sampled live states in BOTH world shapes.** Ten law checks, all required ZERO: K = 9 in the frozen order · the ZERO-POINT member's displacement EXACTLY ±0 and its receiving point `mate.pos` coordinate for coordinate · every aim = `mate.pos + strike` · `reach` = the banked projection at FULL weight · every member's struck LENGTH = `d0 + j·reach` and struck BEARING = the mate-ward one rotated by `i·θ` · a NON-SUPPORT mate and a mate with no remembered motion collapse the whole plane BY ARITHMETIC (#200) · `reach < d0` on every sample (the construction bound). ⚠ Probe-side seat constructions, and both columns measured on their own world shape's arm (`measuredOnArm`) — the DLC-T0 arm confound fixed, not repeated | HARD |
| **G-BITE** | ARMED + gene PRESENT the world DIVERGES on every receipt seed **in BOTH world shapes**; and in a FORCED smoke every struck ball's 5th argument matches a grid member EXACTLY (`unmatchedStrikes === 0`) with at least one SAMPLED member winning — yielding the **emergent strike distribution** | HARD |
| ⭐ **G-WINNER** | **THE ARGMAX ENTRY, PROVED END TO END THROUGH THE BRAIN.** On an ARMED match, for every chosen `Pass` candidate the brain reports, its own printed openness (2 dp, its `why` string) is compared against the openness of **every** grid member's receiving point. Every winner must match **ONE OF ITS OWN** grid points; where the readings SPREAD materially (> 0.05) the winner is identified, and **BOTH outcomes must occur** (a sampled strike wins somewhere, today's kick wins somewhere) — otherwise there is no contest. ⚠ Declared intervention: an INSTRUMENT match (`decidePlayer` called on the carrier), compared to no signature anywhere | HARD |
| ⭐ **G-NOTASTE** | **#236 amendment 1, MACHINE-CHECKED.** The plane's scoring call is `groundCandidate(mate, strike.aim, d)` — matched VERBATIM — against exactly ONE `groundCandidate` declaration; and the plane block's and the seat module's executable source name no gene, no attribute and no multiplier of their own | HARD |
| ⭐ **G-EPI-MOTION** | **RE-GATED, through THIS stage's arming path.** On a fixture whose truth MOTION is rewritten in place without stepping (no scan moment recorded; POSITIONS untouched so `flight` is identical): the PERCEPT world's grid scale is UNCHANGED for every body and equals the truth-derived value for NONE; the BARE world's FOLLOWS truth exactly. PLUS the source pin: the ONLY member of `match` either seat module names is `perceivedSnapshot` | HARD |
| ⭐⭐ **G-CROSS** | **THE DOORS MATRIX (#228), gated from birth, FIVE doors.** 192 cells — {`dlcStrikePlane`} × {`dlcDeliveryChoice`} × {`ptpPassLead`} × {`obmMovement`} × {`ctbSupportPlane`} × {the neighbours' gene banks dosed/absent} × {the shared gene absent/zero/dosed} — one FULL match per cell per seed, whole-run signature incl. rng state, inside the G-DET core. Claims EX ANTE: **(A)** the plane armed with every neighbour bank DOSED and its own gene ABSENT ≡ ALL-OFF, and an armed plane is *unchanged* by those banks; **(B)** each neighbour armed alone is unmoved by this door at any gene state; **(PRECEDENCE)** ⭐⭐ `sp1·ptp1 ≡ sp0·ptp1` and `sp1·dlc1 ≡ sp0·dlc1` at every gene state, and `sp1·dlc1·ptp1 ≡ ptp1` alone; **(DISCRIMINATION)** ⭐⭐ the plane is NEITHER the two-point contest NOR the forced dose; **(VALUE)** gene zero ≡ gene dosed, and gene zero ≠ ALL-OFF; plus DORMANT-ALL and the non-vacuity BITE rows | HARD |
| **G-RNG** | the seam draws **zero** rng (an armed grid formed over every outfielder against every mate on a stepped fixture leaves the match rng state EXACT); the flag-off stream is identical (G-IDENT/G-OFF); and **`genome.ts` is untouched by this stage**, machine-checked: the gene is still outside `GENE_KEYS`, `randomGenome` still never serializes it, and 8 generations of the shipped mutate+crossover with the opt-in OFF still reproduce a faithful PRE-GENE re-implementation's genomes AND final rng state exactly | HARD |
| **G-HYGIENE** | `dlcStrikePlane` absent from `a4World.ts` **entirely**; initialised `cfg.dlcStrikePlane ?? false`; no new gene anywhere; a fresh Match and a League match are both OFF; no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` anywhere on a seam line | HARD |
| **G-FORK** | ⭐ the READ-FORK INVENTORY: **exactly ONE** `match.dlcStrikePlane` fork in `src/**`, at the named site, feeding exactly ONE grid formation, ONE candidate-scoring call and ONE capture pair, with **ZERO** new strike statements (`match.performPass(` still 3×); every other `src/**` occurrence enumerated with file:line and class, **zero unclassified** | HARD |
| **G-TRACE** | the banked PROJECTION FUNCTION and the banked CONTEST MODULE are **verbatim-untouched** (constants, declarations, body, scope gate; whole-file sha256 recorded for both); ⭐⭐ **the INCUMBENT STRIKE'S OWN PARAMETERIZATION is traced in source** — `const aim = norm(sub(lead, passer.pos));` (the direction) and `const speed = clamp(d * 0.6 + 8.2, 9, 22) * executedMul;` (the power) — because those two lines ARE the (direction, power) this plane samples; plus the UNTOUCHED INCUMBENTS: the `MakeRun` guard, the burst call, **the loft's `d > 24` gate**, **the automatic bender's `bentKick(… groundBend(…) …)` call**, the incumbent strike-time lead, the banked led-strike statement and BOTH banked fork lines | HARD |
| **G-PINS** | the §PINS inventory's machine-checkable rows recomputed, **including both banked G-FORK pins' exact text in the test files AND in `src/**`**, DLC-T0's three-`performPass` pin, and the O1 wind-up's four verbatim pins | HARD |
| **G-SEED** | seed-block disjointness proved in-probe for **all three** intervals this stage consumes, against the COMPLETE consumed ledger **incl. DLC-T0's and DLC-T1's blocks** (DLC-T1's battery band is counted at its RESERVED extent 12,426,100–727, not its walked one) | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests | HARD |
| **G-SUITE** | FULL `npm test` green + `tsc --noEmit` clean. (The known #196.2 wall-clock flake is pre-existing — if it reds it is reproduced on the PRE-change tree) | HARD |
| **REPORTED (a)** | ⭐ the FORCED-SMOKE **STRIKE-DISTRIBUTION TABLE**: per chosen pass, WHICH GRID MEMBER won, by member / by direction / by power, in both world shapes. No control, no CI, **no ANSWER** | REPORTED |
| **REPORTED (b)** | ⭐ **the CHOOSER-COST reading**, in the corrected per-tick form ex ante: per-arm tick counts published, headline **ms/TICK**, total wall CONTEXT only, and the **noise floor** stated from the instrument's own control pair (`off` vs `bornArmed`, identical arithmetic). K = 9 is the lever and it is named | REPORTED |

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any src diff outside
the seam path, any rng draw appearing on the dormant path, any predicate appearing anywhere,
or **any existing test breaking** (a STOP-and-report, never a test edit).

No bootstrap is used anywhere in this stage, so the ≥104,800 stats base does not apply.

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| everything consumed through DLC-T1 | see the probe's `CONSUMED` table (inherited in full, incl. DLC-T0's 12,426,000–025 and 900–906, and DLC-T1's smoke 030–041 · dose-read 045 · guard 050–099 · battery+reserve 100–727) | prior |
| **DLC-T0s receipts (this stage)** | **12,427,000 – 12,427,023** (24 seeds × 9 arms; ⭐ the 192-cell G-CROSS matrix re-uses the FIRST 2 of these same seeds — **no new block**) + **12,427,024** (the grid/winner/G-EPI-MOTION/smoke read) | **CONSUMED here** |
| **DLC-T0s REPORTED cost read** | **12,427,025** | **CONSUMED here** |
| DLC-T0s test-file seeds (not a battery) | 12,427,900 – 12,427,906 | consumed here |
| free above | 12,427,026 – 12,427,899 and 12,427,907 + | available to DLC-T1s |

Disjointness is computed **in-probe** for all three intervals separately, not asserted here.

## §ROAD B — nothing ships

`dlcStrikePlane` is **OFF in every production path** — a hard `false` default, absent from
`a4World.ts` and from all three play-test worlds, absent from every League's `matchFlags`
unless a probe sets it explicitly — and even ARMED it does nothing while the gene is absent
(G-BORN). No gene, no opt-in and no genome code was added or changed. The production
fingerprint is unchanged, the flag-off world is byte-identical on three league seeds and on
every receipt match seed with the rng stream included. **Nothing about the game the user plays
changes in this commit.** The seam exists so DLC-T1s can run the strike-space exam.

**Road B statement**: fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **must not move, and
did not**.

## §NON-CLAIMS

DLC-T0s claims **no** football effect: not on TRUE-holdable supply, not on the goal band, not
on interceptions, offside, spacing or watchability. The REPORTED strike distribution is an
uncontrolled descriptive reading of ONE match per world shape and adjudicates nothing. It does
not claim the pricing is RIGHT (§HONESTY 2), nor that nine points is the strike space
(§HONESTY 5), nor that the distribution it reports is the one a real exam would produce. It
changes **no** TeamBrain assignment or licence, **no** receiver-side behaviour, **no** price
table, and adds no gene, no attribute, no action type and no render cue. **It does not touch
the banked two-point contest**, which stays banked as DLC-T1s's CONTRAST ANCHOR. It cannot
authorize DLC-T1s or slices two-s/three-s; only the commander can.

---

## §RESULT — the gates run

*(filled in from the committed artifact after the receipts ran; every number here is quoted
FROM `docs/world-model/data/dlc-t0s-strike-plane.json`, which is recomputed by
`npx tsx scripts/probes/dlc-t0s-strike-plane.ts` — the doc never carries evidence the
artifact does not.)*

Tests: [`../../tests/dlcStrikePlane.test.ts`](../../tests/dlcStrikePlane.test.ts) — **21 pins**
(21 `it()` blocks). Receipts:
[`../../scripts/probes/dlc-t0s-strike-plane.ts`](../../scripts/probes/dlc-t0s-strike-plane.ts),
artifact [`data/dlc-t0s-strike-plane.json`](data/dlc-t0s-strike-plane.json).
**24 seeds × 9 arms (absent · off · plain · plainOff · bornArmed · zeroArmed · midArmed ·
armed · plainArmed) = 216 full matches per core run, PLUS ⭐⭐ the 192-cell FIVE-DOOR crossing
on the first 2 receipt seeds = 384 more per core run, and the core runs TWICE (G-DET,
byte-identical digests), plus 3 league-seed 2-season identity runs, the grid geometry in both
world shapes, the G-WINNER instrument matches in both shapes, the G-EPI-MOTION divergence
fixture in both shapes, the two strike smokes, ⭐ the two SUBSTITUTION-DECODE matches (REPORTED
(c), post-hoc) and the seam rng fixture on seed 12,427,024, the
8-generation evolution-rng comparison, the `src/**` fork scan, and 9 timed matches for the
chooser-cost reading on seed 12,427,025.** Verdict: **GATES PASS** (`gates.allPass === true`),
probe exit 0. Wall ≈ 157 s (CONTEXT ONLY — used in no rate).

⚠⚠ **SUPERSESSION (the decode correction).** The receipts were re-run after a verify pass found
that this section's original reading of the winner table was **CONFOUNDED** — see
[REPORTED (c)](#-reported-c--the-substitution-decode-what-the-zero-point-row-really-is), which is
a **post-hoc instrument added in response to that finding and NOT frozen ex ante** (stated here
rather than backdated into §GATES, so the frozen-before-sight rule keeps its meaning). The prior
**resultSha256 `a7486708…c99` is SUPERSEDED** by the hash below. ⭐ **Every HARD-gate measurement
is byte-identical across the two runs** — the whole `gates.*` subtree, including
`gates.gDet.digestA/B`, is unchanged field for field; the only movements are the ADDED
`reported.substitutionDecode` block, the machine-dependent `reported.chooserCost` timings (outside
the hash, and their reading changed — see below) and the envelope.

* **G-DET digest** — `gates.gDet.digestA === digestB ===`
  `a26b97a2978729af8dd6c945b1053796a2c9d1e864f470edb7344ed62721f7db` (**unchanged** by the re-run)
* **resultSha256** `20ece8350c7f3e0dc779e7b27e25341ec8f9cae4b6a0cfafce6d0e67fbf61f10`
  (recomputable: `npx tsx scripts/probes/dlc-t0s-strike-plane.ts`). Per #197-M1 the hashed
  body is **commit-free, timing-free and path-free** — `headContextOnly`, `wallMsContextOnly`
  and `artifactPathContextOnly` ride the envelope, OUTSIDE the hash, as do the REPORTED
  wall-clock readings under `reported.chooserCost`. Every GATE input is inside it.
* **Files touched** — the authoritative list is `git show <this commit> --stat`; no
  completeness claim is made here from a `git diff --stat` (the #194 L3 lesson).

### Gate table

| gate | verdict | evidence (all recomputed in-probe, #181.2) |
| --- | --- | --- |
| **G-IDENT** | ✅ PASS | all three league hashes IDENTICAL to the frozen pre-change baselines: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26` — `gates.gIdent.rows` |
| **G-FP** | ✅ PASS | the 1337 row IS the production fingerprint (`gates.xFpProd`); `npm run fingerprint` re-derives `57b0bdab…c673` unchanged (§CHECKS) |
| **G-OFF** | ✅ PASS | 24/24 seeds: flag ABSENT ≡ flag FALSE in the percept-armed AND the production-shaped world, whole-match signature including the rng stream state. **CONFIG EQUIVALENCE ONLY** |
| **G-BORN** | ✅ PASS | 24/24: ARMED with the gene ABSENT ≡ OFF, byte for byte — through a live path where the arming rule is evaluated on every on-ball decision and returns `null`. `absentSeatsFormed: 0` in both world shapes |
| ⭐ **G-VALUE** | ✅ PASS | 24/24: **gene 0 ≡ 0.37 ≡ 1**, byte for byte — the #240/#241 MAGNITUDE RETIREMENT measured, not asserted — **and none of the three is the incumbent world**. ⚠ Read exactly: under this door a gene-0 arm is a LIVE arm |
| ⭐ **G-GRID** | ✅ PASS | **0 violations on all ten law checks, in both world shapes.** percept: 1,645 carrier×mate samples (836 support), **14,805 grid members**, zero-point EXACT 1,645/1,645; bare: 1,335 samples (607 support), **12,015 members**, zero-point EXACT 1,335/1,335. Construction bound MEASURED: `min (d0−reach)/d0` = **0.2803** (percept) / **0.3354** (bare) — always positive, i.e. `reach < d0` on every sample as §LAW predicted; max rotation **35.74° / 33.61°**, under 45° |
| **G-BITE** | ✅ PASS | **24/24 armed arms diverge** in the percept world **and 24/24 in the bare world**. On the forced smokes every struck ball matched a grid member EXACTLY (`unmatchedStrikes: 0 / 0`) with **19 and 45 sampled-member wins** — the plane is reachable and the strike carries exactly what the chooser priced |
| ⭐ **G-WINNER** | ✅ PASS | **the argmax entry, end to end through the brain.** percept: **205 Pass candidates, 0 violations**, 96 materially-spread decisions of which **90 won by a SAMPLED strike and 6 by TODAY'S KICK**; bare: **131 candidates, 0 violations**, 75 material of which **70 SAMPLED / 5 ZERO-POINT** (max openness spread 0.87 in both). Every winner priced at ONE OF ITS OWN grid points; **both outcomes occur** |
| ⭐ **G-NOTASTE** | ✅ PASS | the plane's scoring call matched VERBATIM, **exactly ONE** `groundCandidate` declaration, and **zero** banned tokens in the plane block (`planeBranchTokens: []`) or the seat module (`seatModuleTokens: []`) — no gene, no attribute, no multiplier of this stage's own |
| ⭐ **G-EPI-MOTION** | ✅ PASS | **percept world: 3/3 grid scales unchanged by the truth rewrite (they read his own eyes), 0/3 match the truth, 3/3 truth-vs-percept pairs genuinely differ** (mean remembered age 5.7 ticks). **bare world: 4/4 FOLLOW truth exactly.** Source pin over BOTH seat modules: `moduleMatchMembers === ['perceivedSnapshot']`, `moduleBannedHits === []` |
| ⭐⭐ **G-CROSS** | ✅ PASS | **28/28 claims held, 2/2 seeds each**, over 192 cells × 2 seeds = 384 full matches per core run. ⭐⭐ `PTP-KEEPS-PRECEDENCE` and `DLC-KEEPS-PRECEDENCE` hold at **all three** gene states, `CHAIN-IS-TRANSITIVE` holds, `PLANE-IS-NOT-THE-CONTEST` and `PLANE-IS-NOT-THE-FORCED-DOSE` hold, `PLANE-VALUE-INERT` and `PLANE-ZERO-BITES` hold together, plus `A-`/`B-`/`C-` families, DORMANT-ALL and three BITE rows. **The 192 cells collapse onto exactly SIXTEEN distinct worlds** — see below |
| **G-RNG** | ✅ PASS | (a) the seam: an ARMED grid formed over every outfielder against every mate on a 400-tick fixture leaves the match rng state EXACT — **2347946113 → 2347946113**, 50 grids. (b) evolution: genomes identical to the pre-gene re-implementation, final rng state identical, the gene stayed absent, `optInDraws: true`, `obmStreamUnmoved: true`, `crossoverOrderHeld: true` — **this stage added no gene and no opt-in** |
| **G-HYGIENE** | ✅ PASS | `cfg.dlcStrikePlane ?? false`; the flag absent from `a4World.ts` entirely; **no new gene**; a fresh Match and a League match are both OFF; no env door on any seam line |
| **G-FORK** | ✅ PASS | **exactly 1 flag fork, 1 grid formation, 1 candidate-scoring call, 1 capture pair (2 lines), and 3 `match.performPass(` statements — UNCHANGED**, i.e. ZERO new strike statements. **24 src occurrences total, ZERO unclassified** (kinds: `SEAT_BODY` 9 · `PLANE_ARGMAX` 4 · `GRID_CAPTURE` 2 · `FLAG_FORK` 1 · `PLANE_GUARD` 1 · `GRID_FORM` 1 · `CAND_SCORE` 1 · `IMPORT` 1 · `CONFIG` 1 · `FIELD` 1 · `INIT` 1 · `UNION_KEY` 1) |
| **G-TRACE** | ✅ PASS | all **17** source lines matched VERBATIM — the banked projection's two constants, two declarations, body and scope gate; the through-ball loop's `/ 18` and `runBurstPoint`'s `* 1.6`; ⭐⭐ **the incumbent strike's own parameterization** (`const aim = norm(sub(lead, passer.pos));` and `const speed = clamp(d * 0.6 + 8.2, 9, 22) * executedMul;`) and the incumbent strike-time lead; the MakeRun guard and burst call; ⭐ **the loft's `d > 24` gate** (two-s's zero-point) and ⭐ **the automatic bender** (three-s's); the banked led-strike statement; and BOTH banked fork lines plus the banked contest's own candidate call. Whole-file sha256 recorded for both banked modules: projection `f276c0d4…b142f`, contest `gates.gTrace.contestFileSha256` |
| **G-PINS** | ✅ PASS | **15/15 named pins present**, including both banked G-FORK pins' exact text in their test files, DLC-T0's three-`performPass` pin and NO-TASTE pin, and the O1 wind-up's verbatim pins; `srcVerbatim: true`. Nothing renegotiated |
| **G-SEED** | ✅ PASS | 12,427,000–024 · 12,427,025 · 12,427,900–906, **zero collisions** with the **48** consumed blocks (`gates.seedDisjoint.collisions === []`), DLC-T1's battery counted at its RESERVED extent |
| **G-DET** | ✅ PASS | two invocations of the core, identical digests (above) |
| **G-SUITE** | ✅ PASS | see §CHECKS |

### ⭐⭐ G-CROSS — the five-doors collapse (seed 12,427,000)

**192 cells collapse onto exactly SIXTEEN distinct worlds, and each is reached by exactly the
doors that should reach it.** (`others1` = the banked `offballMovementWeights` and
`ctbSupport*` banks dosed at their own domain corners.) Reproduced identically on both
crossing seeds; full table in `gates.gCross.table`.

| cell family | cells | sha-12 | which world |
| --- | --- | --- | --- |
| every cell whose gene-reading doors are shut or whose gene is inert to them, neighbour doors shut | 80 | `f768f213cd0c` | **INCUMBENT** — including ⭐ `sp1·others1·gene-absent` (claim A): the plane armed, both neighbour banks FULL, and **nothing happens** |
| ⭐⭐ `ptp1·gene-dosed`, neighbour doors shut — **`sp0`/`sp1` AND `dlc0`/`dlc1` alike** | 20 | `89b013623e2b` | ⭐⭐ **THE FORCED DOSE (PTP alone)** — and arming the contest and/or the plane beside it makes **no difference at all**: the precedence CHAIN, visible in the collapse |
| `…·ctb1·others1` / `…·obm1·others1` / `…·obm1·ctb1·others1`, gene-reading doors inert | 16 each | `4b000f91f038` · `16941003f911` · `f77e499f4583` | the banked movement seams alone — unmoved by this door |
| ⭐ `dlc1·gene-dosed`, neighbour doors shut (`sp` either way) | 10 | `1f612bbc6bba` | **THE BANKED TWO-POINT CONTEST ALONE** — and arming the plane beside it changes nothing |
| ⭐⭐ `sp1·ptp0·dlc0·gene-{zero,dosed}`, neighbour doors shut | 10 | `fe655aadf52f` | ⭐⭐ **THE STRIKE PLANE ALONE** — and the ten cells span **both** gene 0 and gene 1 (the magnitude retirement, visible in the collapse) and both neighbour-bank states (claim A′) |
| `ptp1` + one/both movement seams, gene-dosed | 4 each | `e291e8a6d4c0` · `d99b042bbe1c` · `071889e89380` | the forced dose + the neighbours |
| `dlc1` + one/both movement seams, gene-dosed | 2 each | `f8ef0bbba687` · `dfe2ac6107db` · `da88ece5759f` | the banked contest + the neighbours |
| `sp1` + one/both movement seams, gene present | 2 each | `2ba63dfd0fd5` · `4690f11b9f2f` · `788f26a77e9b` | **the plane + the neighbours** — the cell DLC-T1s's combined arm would live in |

⭐ **The falsifiers, in one line each:** `fe655aadf52f ≠ 1f612bbc6bba` (the PLANE is not the
two-point CONTEST — the whole point of #241), `fe655aadf52f ≠ 89b013623e2b` (nor the FORCED
DOSE), `fe655aadf52f ≠ f768f213cd0c` (an armed plane at gene **zero** is a live world — the
retirement's honest converse), and `sp1·others1·gene-absent === f768f213cd0c` (an armed-inert
door spends no neighbour's bank).

### ⭐ REPORTED — the STRIKE DISTRIBUTION (seed 12,427,024)

`performPass` is wrapped on the instance so the **5th argument identifies the winning grid
member** for every chosen pass, matched EXACTLY against the grid re-derived at strike time.
⚠⚠ **THE ORIGINAL READING OF THIS ROW WAS WRONG, AND IS RETRACTED HERE WITH ITS TRAIL KEPT.**
It said: *"a null 5th argument **IS** member 4 — today's kick — because its displacement is
exactly ±0 and the incumbent 3-argument statement is the one reached; the two are
indistinguishable at the strike by construction."* The **second half is true and the first half
does not follow from it**. A null 5th argument means only that **no displacement reached the
ball**, and in a PERCEPT world that happens for a second reason entirely: the pass **TARGET** is
re-chosen AFTER the plane has priced its nine points (`choosePerceivedPassTarget`,
`src/ai/PlayerBrain.ts`), and the banked led-strike guard
`passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)` then **DISCARDS the plane's
winner** and strikes to the substituted man's FEET. ⇒ **the 65 is a mixture, not a zero-point
victory count.** [REPORTED (c)](#-reported-c--the-substitution-decode-what-the-zero-point-row-really-is)
splits it, and every causal sentence that read this row as the chooser *preferring* today's kick
is retracted below.

| quantity | percept world | bare world |
| --- | --- | --- |
| passes chosen | 84 | 58 |
| ⭐ **won by a SAMPLED strike** | **19 (22.6 %)** | **45 (77.6 %)** |
| ⚠ **struck with NO displacement** (the CONFOUNDED row — *not* "won by the zero-point"; decoded in REPORTED (c)) | 65 | 13 |
| unmatched strikes | **0** | **0** |
| mean displacement off today's point (max) | **9.53 m** (20.87 m) | **10.46 m** (25.79 m) |
| displacement as a share of the pass distance | **0.601** | **0.603** |

**By grid member** (index · direction step · power step):

| world | 0 `d−1p−1` | 1 `d−1p0` | 2 `d−1p+1` | 3 `d0p−1` | **4 `d0p0` (today)** | 5 `d0p+1` | 6 `d+1p−1` | 7 `d+1p0` | 8 `d+1p+1` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| percept | 0 | 0 | 8 | 0 | **65** | 1 | 2 | 1 | 7 |
| bare | 4 | 0 | 13 | 2 | **13** | 2 | 3 | 1 | 20 |

By DIRECTION — percept `{−1: 8, 0: 66, +1: 10}`, bare `{−1: 17, 0: 17, +1: 24}`.
By POWER — percept `{−1: 2, 0: 66, +1: 16}`, bare `{−1: 9, 0: 14, +1: 35}`.

**What this is and is not.** ⭐ **This is the first sight of the emergent STRIKE**, and the only
part of it that survives the decode is the SHAPE OF THE SAMPLED WINS — those rows are counted
from displacements that actually reached the ball, so they stand: the corners of the plane
(`d±1 p+1` — turned AND driven long) take **15 of 19** sampled wins in the percept world and
**33 of 45** in the bare one, while the two "shorter" power variants are rarely chosen. It is
**ONE match per world shape**, with **no control arm, no CI and no exam**; it says nothing about
whether any of it helps — that is DLC-T1s's.

⚠⚠ **RETRACTED, verbatim, with the reason.** The original text continued: *"In the percept world
today's kick still wins **77 %** of passes — because a carrier can only bend the plane around a
mate whose motion his own eyes have … In the bare world, where every mate's motion is known, the
chooser reaches for a sampled strike **78 %** of the time."* **Both sentences are struck.** The
77 % was read off the confounded row: of those 84 kicks only **6** are genuine zero-point wins,
while **47** are kicks whose plane winner was **thrown away by the target substitution** and
**12** carry no chooser row at all. The percept/bare gap is therefore **NOT** established as an
eyes-vs-truth effect by this instrument, because the two shapes also differ in whether a
substituting chooser is running at all. What remains true, and is measured elsewhere in this
artifact rather than inferred from this table, is the inherited honesty limit itself: **648 of
836** support samples had no remembered motion in the percept world against **118 of 607** in the
bare one (G-GRID). That limit is real; attributing the 65 to it was not a measurement.

⭐ **The decision-time reading and the strike-time reading were never reconciled, and that is
the actual finding.** G-WINNER measures the ARGMAX and reports **90 of 96** materially-spread
percept decisions won by a SAMPLED strike (**94 %**); this table measures the STRIKE and reports
**22.6 %** sampled. Those are not in conflict — they are separated by the substitution, which
sits **between** the decision and the kick. Reading either as the other is the error this
correction fixes.

### ⭐⭐ REPORTED (c) — the SUBSTITUTION DECODE: what the zero-point row really is

**Added AFTER the run, in response to the verify finding — it is NOT one of the ex-ante gates**
(§GATES is left exactly as it was frozen; this section says so rather than backdating a row into
it). The decode runs its own match at the same seed and arm with the perceived chooser's own
sidecar trace armed, and **proves the sidecar perturbed nothing** by requiring the kick sequence
to be in LOCKSTEP with the untraced smoke — same kick count, same sampled count, same per-member
wins (`lockstepWithSmoke: true` in **both** shapes).

| bucket | what it means | percept | bare |
| --- | --- | --- | --- |
| kicks | every `performPass` in the match | **84** | **58** |
| **sampled-struck** | the plane's winner **rode the kick** (non-null 5th argument) | **19** | **45** |
| **genuine zero-point** | the chooser kept the legacy man **and** member 4 won the argmax | **6** | **0** |
| ⚠ **target-SUBSTITUTED** | the chooser replaced the man ⇒ **the plane's winner was DISCARDED** | **47** | **0** |
| no chooser row | keeper, cutback, no executable option — or **no chooser at all** (the bare world) | **12** | **13** |
| ⭐ **substitution rate** | `targetSubstituted / kicks` | **0.5595** | **0** |
| ⭐ **delivered rate** | `(sampledStruck + genuineZeroPoint) / kicks` | **0.2976** | **0.7759** |

⚠ **Read the bare column honestly.** With `edsPerceivedChoice` off there is no chooser and so no
substitution is possible; its 13 no-row kicks are *undetermined by this instrument* and are
deliberately folded into **neither** side rather than being counted as zero-point wins. The
percept column is the one the correction is about.

⭐⭐ **THE DESIGN NOTE FOR DLC-T1s — the treatment-delivery number.** In a percept world **the
plane's own choice reaches the ball on about ONE THIRD of kicks (0.298)**, because a majority
(0.560) are struck to a man the plane never priced. That is a **treatment-delivery** problem, not
a mechanism failure: the seam does exactly what §LAW says, and the banked guard that drops the
winner is the correct, banked behaviour (a substituted target was never priced with a lead).
⇒ **the exam must (a) publish DELIVERED-RATE PER ARM as a first-class number beside its effect,
(b) budget its power against the DELIVERED n and not the kick count, and (c) never read a
decision-time rate as a strike-time one.** This is the **OBM P1-trap lesson** in this slice's
form: an arm can be armed, live and gated green while the thing being tested is reaching the ball
a third of the time.

### ⭐ REPORTED — the CHOOSER COST (seed 12,427,025)

One full match per arm in a **percept-armed** world, minimum of 3 repeats. Machine-dependent,
outside the hash, used in **no** rate.

⚠ **NOT LIKE-FOR-LIKE AT THE TOTAL-WALL LEVEL, and the instrument says so ex ante** (the
b8f5ef0 lesson applied before the fact, not after). The armed arm is a **DIVERGED WORLD**: it
plays a different match and finishes in **14,931 ticks against the other two arms' 15,281**
(~2 % fewer). ⇒ **the headline is ms/TICK**, per-arm tick counts are published, and total wall
is kept only as CONTEXT.

⚠⚠ **THESE NUMBERS MOVED WITH THE RE-RUN, AND THE READING FLIPPED WITH THEM.** They are
wall-clock on a shared machine and ride OUTSIDE `resultSha256`, so the decode re-run re-measured
them; the previous run's table (floor **1.06 %**, plane **+3.45 %**, resolved **true**) is
superseded by the one below. **No gate depends on either.** That two runs of the same instrument
on the same machine disagree about whether the effect is resolvable is itself the honest reading:
**this instrument is at the edge of its resolution.**

| arm | ticks | min wall (context) | **ms/tick (HEADLINE)** | **per-tick vs OFF** | total wall vs OFF (context) |
| --- | --- | --- | --- | --- | --- |
| flag OFF | 15,281 | 98 ms | **0.006413** | — | — |
| ARMED, gene absent (no grid forms) | 15,281 | 94 ms | **0.006151** | **−4.09 %** | −4.08 % |
| ARMED + gene present (**the plane: every support mate priced K = 9 times**) | 14,931 | 94 ms | **0.006296** | **−1.82 %** | −4.08 % |

⭐ **THE NOISE FLOOR, AND WHAT IT DOES TO THE READING.** `off` and `bornArmed` are the
instrument's own **control pair**: same arithmetic (the seat is `null`, no grid forms), same
15,281 ticks, so their per-tick spread is pure measurement scatter — **4.09 %** on this run.
The plane's per-tick effect is **−1.82 %**, i.e. **BELOW the floor and of the physically
impossible sign** (`planeResolvedAboveNoiseFloor: false`). ⇒ **this instrument does NOT resolve
the cost on this run**: all that can honestly be said is that pricing NINE ground candidates per
support mate instead of one costs **less than the ~4 % scatter floor of a tick** on this machine,
because the pass block is a small share of a tick's work. ⚠ It is one seed, one machine,
minimum-of-3 — a *bound*, not a benchmark, and it is used in no rate. **No lever is pulled on
this number**; if a properly-powered reading ever finds it dear,
the honest lever is **K** (candidate scoping — stated in §LAW precisely so it can be moved
with numbers), never a pricing shortcut.

## §CHECKS

* `npx tsc --noEmit` — **clean**.
* `npm run fingerprint` — `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`,
  **unchanged**, and independently recomputed in-probe as G-IDENT/G-FP.
* `npm test` — see the run recorded below; `tests/ptpPassLead.test.ts` (24 pins) and
  `tests/dlcDeliveryChoice.test.ts` (19 pins) pass **verbatim** — the banked seams stay
  DLC-T1s's contrast anchors — as do `tests/o1PassWindup.test.ts`'s source-text pins. **No
  test file was edited by this stage**; the only `tests/**` change is the NEW
  `dlcStrikePlane.test.ts` (21 pins).

* **THE RUN**: **1,309 of 1,310 pass across 133 files** (duration 275 s). DLC-T0's tree was
  1,288 of 1,289 across 132 — the deltas are **+1 file and +21 tests**, i.e. exactly this
  stage's new test file and nothing else.
* ⚠ **THE ONE FAILURE IS THE #196.2 WALL-CLOCK FLAKE, and it is the SAME one DLC-T0 already
  reproduced on a PRE-change tree.** The failing test is
  `tests/formationEvolution.test.ts > league-level style ecology > ten seasons`, timing out at
  the 180,000 ms vitest ceiling (**181,363 ms** here). Receipts:
  1. **In ISOLATION on THIS tree it PASSES: 152.26 s** — 18 % under the ceiling it only
     breaches under parallel-suite load, exactly the #196.2 mechanism. (For context, DLC-T0
     measured the same test in isolation at **147.04 s pre-change / 147.96 s post-change**;
     this reading is **+2.9 %** on those, taken on a shared machine minutes after a 275 s full
     suite — a single unrepeated sample, stated rather than smoothed.)
  2. **The pre-change half is DLC-T0's own clean-worktree receipt** (§CHECKS there: the same
     test reds at **181,389 ms** on a `git worktree` at the pre-change commit, 1,269 of 1,270
     passing). It is citable here rather than re-run because this test runs **FLAG-OFF**, and
     the flag-off world of this tree is proved byte-identical to that one by **G-IDENT on three
     league seeds** and **G-FP**. The failure exists without this stage.
  3. Every other file — including every banked seam's (`ptpPassLead` 24 pins, `dlcDeliveryChoice`
     19 pins, `o1PassWindup` 26, `obmEyesSeat`, `ctbSupportPlane`) — is **green**.

## §DEV — the deviations, declared

1. ⚠ **THE PRECEDENCE went to the BANKED seams, and the guard is on SEATS not flags** — see
   §LAW. Both `match.ptpPassLead` and `match.dlcDeliveryChoice` fork lines are pinned VERBATIM
   (with "exactly one such line") by their own suites, so a `!dlcStrikePlane` guard on either
   was never available; a pinned test is a STOP, never an edit. The chain is therefore
   `o1PassWindup > ptpPassLead > dlcDeliveryChoice > dlcStrikePlane`, achieved by
   `spSeat !== null && dlcSeat === null && ptpSeat === null` and gated by three G-CROSS claim
   families plus three tests.
2. ⚠⚠ **POWER RIDES THE AIM POINT, not `performPass`'s `powerChoice` argument** — and this was
   checked FIRST, as instructed. `tests/dlcDeliveryChoice.test.ts` pins `match.performPass(`
   at **exactly 3** occurrences in `PlayerBrain.ts` AND pins the banked led-strike statement
   verbatim *with `1` as its power argument*; `tests/ptpPassLead.test.ts` pins the same
   statement. So handing a chosen weight through the 5th argument was impossible without a
   test edit. It was not needed: the shipped speed law `clamp(d·0.6 + 8.2, 9, 22)` is monotone
   in the struck DISTANCE, so the struck LENGTH already **is** the weight, and the plane's
   power axis rides the same displacement its direction axis does. **Zero new strike
   statements, `o1PassWindup`'s pinned lines verbatim.**
3. **K = 9 and the ±1 steps are a SHARPENING** — the contract fixes "sampled grids traced from
   existing mechanics constants" and leaves K open. Frozen here at the smallest grid that
   contains the zero-point and samples both signs of both controls, and named in the artifact
   as the scoping lever.
4. **The angular step is derived, not tabulated**: `θ = atan2(reach, d0)`. A fixed angle would
   have been an invented constant; this is a function of two quantities the loop already has.
5. **G-ZERO became G-VALUE.** The old zero-dose identity does not exist under this door (the
   gene's magnitude retired at #240/#241), so the gate was **redefined rather than dropped**:
   what is measured is that gene 0 ≡ 0.37 ≡ 1 **and** that none of them is the incumbent
   world. Both halves are in the gate, and the honest converse (`PLANE-ZERO-BITES`) is a
   G-CROSS row.
6. **G-WINNER's non-vacuity is POOLED across the two world shapes** (both outcomes must occur
   across percept + bare), not required per shape — frozen that way in §GATES before the run;
   as measured, both shapes satisfied it individually anyway (90/6 and 70/5).
7. **G-CROSS runs on 2 seeds, not DLC-T0's 4.** The matrix doubled (192 cells vs 96) when the
   fifth door joined, so the seed count halved to keep the crossing's match load where DLC-T0
   put it. Declared, and the claims held on both seeds.
8. ⚠ **The G-EPI-MOTION truth re-derivation had to walk the SAME arithmetic path.** A first
   cut compared `strikeReach` against `hypot(v)·flight·mul` and matched only 2 of 4 bodies in
   the bare world — a ROUNDING artifact of a different operation order, not a honesty failure.
   The re-derivation now goes componentwise and then takes the root, exactly as the seam does,
   and the identity is EXACT (4/4). Recorded because "the gate red-flagged and the fix was in
   the INSTRUMENT" is precisely the kind of move that must be visible.
9. **The banked PTP-T0 and DLC-T0 PROBES' own G-FORK consumer counts may now be stale against
   this tree** (they count `groundCandidate` consumers, and this stage adds a third call site).
   As at DLC-T0 §DEV 5: their committed artifacts stand as the receipts of the trees they ran
   on; **their TESTS, which are what the pin inventory binds, pass VERBATIM**, and G-TRACE plus
   both modules' whole-file sha256 keep their *law* receipts citable.
