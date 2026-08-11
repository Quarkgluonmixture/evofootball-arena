# DLC T0 — the DORMANT DELIVERY CONTEST (`dlcDeliveryChoice`, 出球的选择权: 想怎么传怎么传)

Status: **PRE-REGISTERED, then BUILT + RUN the same round** (the OBM-T0 / CTB-T0 / PTP-T0
two-part form).

The frozen law, the seam, the PTP interaction, the read-fork inventory, the gates, the seed
ledger, the PIN INVENTORY and the Road B statement below were written **before** the receipts
ran (the frozen-before-sight rule); the measured numbers arrive only in
[§RESULT](#result--the-gates-run) at the foot, and every number there is quoted FROM the
committed artifact.

Authority chain: contract [`DELIVERY-CHOICE-CONTRACT.md`](DELIVERY-CHOICE-CONTRACT.md) — §2
**M-DLC.1** (THE CONTEST: both candidates priced by the same machinery, both into the same
`bestPass` max, the winner struck at its own aim, NO new comparison logic) · **M-DLC.2** (genes
are TASTE not dose; ⚠ **the #236 amendment 1**: slice one carries **NO taste term at all**) ·
**M-DLC.3** (the menu grows by slices — nothing here authorizes slice two or three) ·
**M-DLC.4** (untouched; the flag hard-false; arming = flag + non-absent gene; two-doors gated
from birth) · §3 the **DLC-T0** clause with ⚠ **#236 amendment 2** (*"inherited" NEVER exempts
an identity gate — every byte-identity / fingerprint / G-IDENT / RNG receipt RE-RUNS in full*)
and ⚠ **#236 amendment 4** (*a REPORTED chooser-cost reading*). Rulings **#235** (the dial
retired, the contract drafted) and **#236** (the VISION re-audit and its four amendments).

The banked seam this stage reuses **verbatim**:
[`PTP-T0-DORMANT-SEAM.md`](PTP-T0-DORMANT-SEAM.md) — its projection function
(`src/ai/passLeadSeat.ts`) is **untouched code**, imported not re-derived, and its own law
receipts are cited only where G-TRACE proves the source lines verbatim.
[`PTP-T1-FULL-CHANNEL-EXAM.md`](PTP-T1-FULL-CHANNEL-EXAM.md) §RESULT is why the dial died
(the channel is real; the uniform max dose poisons the world), and its LEAD arm stays banked
as DLC-T1's CONTRAST anchor — which is exactly why **`ptpPassLead` and every one of its
pins survives this stage untouched**.
[`OBM-T0-DORMANT-SEAM.md`](OBM-T0-DORMANT-SEAM.md) / [`CTB-T0-DORMANT-SEAM.md`](CTB-T0-DORMANT-SEAM.md)
are the FORM: the G-CROSS two-doors matrix (#228) as a birth gate, and the OBM-T0
cost-reading form for the REPORTED wall-clock.

---

## §LAW — the frozen law of the contest

```text
THE CONTEST (M-DLC.1), for a mate in the ORDINARY pass loop, ARMED
  armed  ⇔  match.dlcDeliveryChoice === true  AND  g.passLeadSupport !== undefined
  (a) TO FEET   aim_a = the incumbent's own aim   (mate.pos, unless the banked
                ptpPassLead door is the one open — see THE PTP INTERACTION)
  (b) LED       lead  = passLeadOffset(seat, carrier.pos, mate)      [PTP-T0, VERBATIM]
                aim_b = mate.pos + lead
  score_a = GROUND(mate, aim_a, d)        score_b = GROUND(mate, aim_b, d)
  GROUND = the SHIPPED ground-pass scoring chain, ONE function, called TWICE.
           NO taste multiplier on either candidate (#236 amendment 1): the two calls
           differ in the AIM POINT and in NOTHING else — same mate, same d, same genes,
           same style chain, same bonuses.
  THE ARGMAX IS THE CHOICE: both candidates enter the SAME `bestPass` maximum, over all
  mates, exactly as the incumbent single candidate always did. No threshold, no
  predicate, no comparison logic of this stage's own.

THE ORDER AND THE TIE (a sharpening — the contract is silent, so it is FROZEN here)
  (a) is scored and compared FIRST; the argmax is strict `>`.
  ⇒ every TIE goes to the INCUMBENT candidate. This is the whole mechanism by which a
    led candidate with ~zero displacement is inert: aim_b's coordinates are then
    mate.pos's own (x + ±0 === x, IEEE-754), so score_b === score_a exactly, and the
    strict `>` keeps (a). To feet EMERGES; it is never branched on.

THE GENE IS TASTE (M-DLC.2), and it is the BANKED gene, REINTERPRETED
  passLeadSupport ∈ [0,1] scales the PROJECTION MAGNITUDE the chooser is willing to
  price — how far ahead this team imagines a runner — with the candidate free to LOSE.
  ⭐ IT HAS NO ZERO-DOSE SEMANTICS ANY MORE, stated honestly: PRESENT AT ANY VALUE,
  INCLUDING 0, THE LED CANDIDATE FORMS AND COMPETES. 0 is not "off"; it is "imagine no
  distance ahead", and it loses every tie by the rule above. The identity that IS
  structural is BORN-ABSENT: gene absent ⇒ no seat ⇒ no second candidate at all.
  ⭐ NO NEW GENE, NO NEW OPT-IN, NO GENOME CHANGE WHATSOEVER in this stage.

THE STRIKE — the winner is struck at ITS OWN aim, through the EXISTING machinery
  the winner's own displacement is carried in `bestLeadX/Y` and handed to
  `performPass(..., v2(bestLeadX, bestLeadY))` — the banked PTP-T0 led-strike statement,
  UNCHANGED, including its guards (the chooser's own winner must be the man being passed
  to, and the lead must be non-zero) and including the composition PTP-T0 §HONESTY 5
  measured: `struck = struckLead + ptpLead`, so a led ball lands BEYOND the priced aim.
  A to-feet winner reaches the incumbent 3-argument statement, byte for byte.

THE ZERO-POINT (M-DLC.4)
  flag off OR gene absent ⇒ the led candidate NEVER FORMS ⇒ the pass loop's arithmetic
  is byte-identical (IEEE-exact). Measured by G-OFF / G-BORN / G-IDENT / G-FP, not
  asserted.
```

### ⭐ THE PTP INTERACTION — frozen ex ante, and it is a DECLARED DEVIATION

`ptpPassLead` (the banked forced-aim dial) and `dlcDeliveryChoice` (this contest) are
**INDEPENDENT DOORS, and no exam design arms both**: DLC-T1's CONTRAST anchor re-walks the
PTP LEAD arm under `ptpPassLead` **alone**, exactly as PTP-T1 walked it. The armed-BOTH
behaviour is nonetheless defined **mechanically and ex ante**, because "no exam arms both" is
a promise and this programme gates promises:

> **ARMED-BOTH ≡ `ptpPassLead` ARMED ALONE, byte for byte, at every gene state.** The banked
> seam keeps PRECEDENCE.

**How, exactly** — not by a guard but BY ARITHMETIC. With both doors open, candidate (a) is
priced at the PTP forced aim `mate.pos + ptpLead` and candidate (b) at `mate.pos + lead`,
where both leads come from the SAME `passLeadOffset` with the SAME gene, the SAME motion
source and the SAME flight. The two aims are therefore the same doubles, the two scores are
equal, and the tie rule above keeps (a) — the PTP winner, with the PTP lead handed to the
strike. Gated by **G-CROSS** (the `ptp1·dlc1` rows) and pinned by a test.

⚠ **DECLARED DEVIATION from the dispatch's recommendation.** The brief recommended guarding
the PTP forced-aim branch on `!dlcDeliveryChoice`. That is **not available**: the PTP fork
line is pinned **VERBATIM** by `tests/ptpPassLead.test.ts` ("G-FORK: EXACTLY ONE
`match.ptpPassLead` fork in `src/**`", asserting the line's exact text and that there is
exactly one such line), and a pinned test is a STOP, never an edit. The precedence therefore
went the other way — which is also the standing precedent in this family: PTP-T0 §HONESTY 6
gives precedence to the banked seam (`o1PassWindup`) for the same reason, *"so the banked
seam's own pinned law is the one that holds, and it is stated here rather than discovered
later."* The behaviour is identical in kind and it is gated rather than promised.

### The other sharpenings, declared (the contract is silent on each)

1. **The candidate order and the strict-`>` tie rule** (above). It is what makes
   armed+zero-gene, armed+still-mate and armed-both identities *arithmetic* rather than
   *approximate*.
2. **Arming is STRUCTURAL, not arithmetic**: the seat is `null` when the gene is absent, so
   the led candidate is not formed, not scored and not allocated. (PTP-T0 let a zero weight
   do the work arithmetically; here the contract's own words — *"born absent ⇒ the led
   candidate never forms"* — are made literal.)
3. **The GROUND scoring chain is HOISTED into one function** (`groundCandidate`) so that both
   deliveries are priced by the SAME code. This is **pure code motion** (the `passMul`
   precedent of PTP-T0 §DEV 9): the statements, their order and their operands are the
   shipped chain verbatim. There is no second copy of the pricing anywhere, which is the
   only way "the same machinery" can be true rather than intended.
4. **The LOFT is fed the TO-FEET candidate's reads.** Under this door the lofted switch keeps
   its incumbent pricing exactly (`open`/`gain`/`mul` of candidate (a), i.e. at `mate.pos`),
   and its `d > 24` gate is untouched. The loft joining the contest is **slice two's**, and
   its zero-point is this shipped rule (M-DLC.3 as amended).
5. **No render cue, no `why`-string change, no new action type.** The winner-identity reading
   is taken through `performPass`'s recorded 5th argument in a probe, never by making the
   game say something new.

## §HONESTY — the epistemic limits, stated plainly

1. **Every information-honesty property is INHERITED, not re-opened.** The motion source
   (truth velocity in a bare world; this body's REMEMBERED percept velocity in a percept
   world; zero for a mate he has never seen), the truth-anchored base `mate.pos`, the scope
   gate on `mate.action.type === 'SupportBallCarrier'` and the two traced constants are the
   banked PTP-T0 seat's, byte for byte. This stage adds **no channel, no constant and no
   read**. G-EPI-MOTION is nonetheless RE-GATED here (#236 amendment 2), through this
   stage's own arming path.
2. ⭐ **The contest is only as honest as the pricing.** The argmax "is" the choice only in
   the sense that the incumbent score chain is the whole judge: a led ball that the score
   chain misprices will be chosen anyway. T0 claims nothing about whether the pricing is
   right — that is precisely DLC-T1's pre-named **F-DLC-a**.
3. **The menu is TWO entries.** Weight, first-time vs settled, driven vs floated, the loft
   and the bender are NOT in this contest (contract §7(c) and M-DLC.3). "The player chooses
   how to pass" is, at T0, "the player chooses between two points".
4. **The chooser now pays twice per support mate.** Two lane scans, two openness reads, two
   style-chain evaluations. That is a REAL cost and it is REPORTED, not assumed (#236
   amendment 4); the honest lever if it is dear is candidate scoping, never a pricing
   shortcut. ⚠ **And the T0 instrument does not SIZE it**: see §RESULT — the armed+dosed arm
   is a diverged world (different tick count), so the reading is per-tick, and this run's
   per-tick effect lands BELOW the instrument's own noise floor. T0 bounds the cost; it does
   not measure it.
5. **A non-support mate has ONE candidate by arithmetic, not by a branch.** `passLeadOffset`
   returns exactly zero displacement for him, so his led candidate degenerates onto his feet
   candidate and loses the tie. Nothing asks whether he is moving, checking, fast or free.
6. **The zero-gene world is not a "dose-off" world.** See §LAW: the code path differs (the
   candidate forms), the outcome does not. Stated so nobody reads a future `passLeadSupport
   = 0` arm as "the mechanism disabled" — what it disables is only the DISTANCE.

## §SEAM — the mechanism (all of it dormant)

### The gene

**None added.** Slice one reuses the banked `passLeadSupport` (born absent, outside
`GENE_KEYS`, evolving only under the banked `evolvePassLeadSupport` opt-in). `genome.ts` is
**untouched** by this stage, so the serialized genome, the rng stream, the mutation and the
crossover orders are the banked ones by construction — and G-IDENT / G-FP / G-RNG re-prove it
anyway.

### The consumption flag

**`dlcDeliveryChoice`**, a new **explicit** `MatchConfig` boolean, initialised
`cfg.dlcDeliveryChoice ?? false` (`Match.ts`) — a hard `false`, the `ptpPassLead` /
`obmMovement` / `ctbSupportPlane` form. **Never** `EDS_BUNDLE_ARMED`, never env-armed, never
default-ON, never bundle-defaulted: **absent from `src/game/a4World.ts` entirely**. It gets
its own `League.matchFlags` key so a probe world can arm it explicitly, and that key changes
no default.

⭐ **THE ARMING CHECKLIST — TWO limbs (binding)**: armed = the `dlcDeliveryChoice` flag **+**
a non-absent `passLeadSupport` gene (probe-written on all three genome views of both teams,
or an opted-in evolution run). Even ARMED the world is unchanged while the gene is absent
(G-BORN) and, by arithmetic, while it is at zero (G-ZERO).

### ⭐ The READ-FORK INVENTORY (a NAMED deliverable)

Exactly **ONE** `match.dlcDeliveryChoice` fork exists in `src/**`. Every consumer keys off the
nullable seat it produces, never off the flag again:

| # | site | file | what it feeds |
| --- | --- | --- | --- |
| **1** | `const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;` — THE SEAT FORK | `src/ai/PlayerBrain.ts`, `decideOnBall`'s pass block | the arming rule (flag + non-absent gene ⇒ a seat; otherwise `null`) and the world-appropriate motion source — ONE percept pull per decision, never per candidate mate, never per tick |

Downstream of it, and counted separately: **TWO** `CAND_SCORE` call sites (the ONE
`groundCandidate` function called once per delivery — feet, then led), **ONE** `LED_FORM`
(`ledDelivery` per candidate mate, behind the seat's null check), **ONE** `LED_CAPTURE` block
(the led winner's own displacement into `bestLeadX/Y`) and **ZERO** new strike statements —
the banked PTP-T0 led-strike statement is reused verbatim. Everything else that names the
flag or the module is a declaration, an init, the League union key, an import or the seat
module's own body — enumerated in the artifact with file:line and class, **zero
unclassified**.

**Byte-identity is arithmetic, not hope**: with the fork not taken, `dlcSeat` is `null`, the
led branch is never entered, `bestLeadX/Y` are written by the incumbent capture alone, and
`groundCandidate` is called exactly once per mate with the shipped aim — the incumbent
statements, in the incumbent order. That is what G-OFF / G-BORN / G-IDENT measure rather than
assert.

### Untouched (restated as a prohibition)

The `MakeRun` through-ball licence path — its guard, its `runBurstPoint` call, its lane read,
its chip branch — byte-identical · **the lofted switch and its `d > 24` gate** (slice two's,
SHIPPED INCUMBENT) · **the automatic ground bender** (`groundBend` / `bentKick`, slice
three's, SHIPPED INCUMBENT — the user's own Phase-71 ask) · the cutback, the cross, the
keeper's outlet · `whetherEye` and the certified price table · `TeamBrain` designation and
every licence · the OBM seat's and the CTB plane's laws, genes, flags and tests · the banked
PTP-T0 seat module (`src/ai/passLeadSeat.ts`) and ALL of its pins · `perceptionSnapshot.ts`'s
honesty rules · `genome.ts` entirely · `a4World.ts`'s flag set and all three play-test worlds
· the render layer.

---

## §PINS — the PIN INVENTORY (contract §3, a NAMED deliverable)

Everything that pins the touched surfaces, and what happened to it. **Nothing is silently
renegotiated**; had any of these broken, the standing instruction is STOP-and-report, never a
test edit.

| # | pin | where | class | disposition |
| --- | --- | --- | --- | --- |
| 1 | ⭐⭐ **the PTP-T0 G-FORK pin** — *exactly one* `match.ptpPassLead` line in `src/**`, asserted as EXACT TEXT | `tests/ptpPassLead.test.ts` | source text | **UNTOUCHED and GREEN — and this is what shaped the PTP INTERACTION.** The recommended `!dlcDeliveryChoice` guard would have edited that pinned line, so precedence went to the banked seam instead and is achieved by arithmetic (§LAW) |
| 2 | ⭐ **the PTP-T0 LOFT-BODY pin** (`tests/ptpPassLead.test.ts`, the 24th `it`) | test | mechanism | UNTOUCHED and GREEN — the loft still prices at the BODY under `ptpPassLead`, and under THIS door it keeps the to-feet candidate's own reads |
| 3 | **the whole banked `ptpPassLead` suite (24 pins)** — the T1 CONTRAST anchor's foundation | `tests/ptpPassLead.test.ts` | mechanism | UNTOUCHED and GREEN, verbatim, re-run in §CHECKS |
| 4 | ⭐⭐ **the O1 wind-up's SEAM-SINGULARITY pins** — the synchronous strike line, the wind-up fork line, the kickoff line, the cutback line, all VERBATIM | `tests/o1PassWindup.test.ts` | source text | UNTOUCHED and GREEN — this stage adds NO strike statement at all |
| 5 | **the `Pass` / `ThroughBall` action-type surface** | `tests/combos.test.ts` | type/label | UNTOUCHED — no new action type, no label, no `why`-string change, no render cue |
| 6 | **the banked OBM seat's 24 fixtures** and **the CTB plane's 16** | `tests/obmEyesSeat.test.ts`, `tests/ctbSupportPlane.test.ts` | mechanism | UNTOUCHED and GREEN — and crossed against this seam in G-CROSS |
| 7 | **the perceived-chooser's own pins** | `tests/perceivedPassChoice.test.ts` | mechanism | UNTOUCHED — the chooser is not modified; `edsPerceivedChoice` is READ as a world shape |
| 8 | **the production fingerprint** `57b0bdab…c673` | asserted in 13 test files | league identity | UNTOUCHED — and independently recomputed as G-IDENT / G-FP |
| 9 | **the 5v6 sanity invariant** and **the goal-level shape pin** | `tests/cards.test.ts`, `tests/formations.test.ts` | full-match directional | UNTOUCHED — flag born false ⇒ byte-identical world. Re-run in the FULL suite |
| 10 | **the whole suite** | every pre-change test file (plus this stage's new one) | everything downstream | G-SUITE runs it in full (§CHECKS). **No test file was edited by this stage**; the only `tests/**` change is the NEW `dlcDeliveryChoice.test.ts` |

## §GATES — frozen ex ante (the OBM-T0 / PTP-T0 form; ⚠ #236 amendment 2: EVERYTHING re-runs)

All computed IN-PROBE (#181.2); `head` / wall-clock / paths ride the UNHASHED envelope
(#197-M1) so `resultSha256` re-derives at any commit or path.

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with the flag and gene absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — all three RECOMPUTED IN-PROBE. **Semantics: this IS the sim path's RNG-stream receipt, and — because the ground-pass chain was HOISTED — it is also the receipt that the code motion is arithmetically exact** | HARD |
| **G-FP** | the 1337 row IS the production fingerprint; `npm run fingerprint` prints it unchanged | HARD |
| **G-OFF** | per-match whole-run signature **including the rng stream state**: flag ABSENT ≡ flag FALSE, in BOTH the percept-armed and the production-shaped world, on every receipt seed. **Semantics (#194): CONFIG EQUIVALENCE only** | HARD |
| **G-BORN** | ARMED with the gene ABSENT ≡ OFF, byte for byte. **Semantics: THE ARMS DIFFER IN CODE PATH** — armed ⇒ the arming rule is evaluated on every on-ball decision and returns `null`, so the second candidate never forms | HARD |
| **G-ZERO** | ⭐ **DEFINED, NOT n/a — and it is a DIFFERENT claim from PTP-T0's.** ARMED with the gene PRESENT at 0 ≡ OFF, byte for byte, **through a code path where the led candidate FORMS, is SCORED and ENTERS THE ARGMAX** and loses every tie by the frozen order rule. Non-vacuity is part of the gate: the probe counts the zero candidates and requires > 0. ⚠ **What that counter is, exactly**: a **PROBE-SIDE SEAT CONSTRUCTION** on sampled live states (the probe builds the seat and calls `ledDelivery` off a genome copy) — *not* a tally of candidates the BRAIN built. The brain-side formation is established by **code reading** (the read-fork inventory, machine-checked by G-FORK / G-NOTASTE) and **in simulation** by G-BITE's divergence receipt and G-WINNER | HARD |
| **G-BITE** | ARMED + DOSED the world DIVERGES on every receipt seed **in BOTH world shapes**; and in a FORCED smoke the WINNER IDENTITY is traced per chosen pass (led vs to-feet), yielding the **emergent led-share** — the number the retired dial used to fix | HARD |
| ⭐ **G-WINNER** | **THE ARGMAX ENTRY, PROVED END TO END THROUGH THE BRAIN.** On an ARMED + DOSED match, for every chosen `Pass` candidate the brain reports, its own printed openness (2 dp, its `why` string) is compared against BOTH re-derivations — `opennessAt(mate.pos)` and `opennessAt(mate.pos + lead)`. Every winner must match **ITS OWN** aim's openness and, where the two readings diverge MATERIALLY (> 0.05), never the loser's. **Non-vacuity is IN the predicate**: BOTH outcomes must occur — at least one materially-divergent decision won by the LED candidate and at least one won by TO FEET — otherwise there is no contest to speak of. ⚠ Declared intervention: an INSTRUMENT match (`decidePlayer` called on the carrier), compared to no signature anywhere | HARD |
| ⭐ **G-NOTASTE** | **#236 amendment 1, MACHINE-CHECKED.** The two candidate call sites are `groundCandidate(mate, aim, d)` and `groundCandidate(mate, ledBall.aim, d)` — matched VERBATIM — so the two calls differ in the AIM and in nothing else; there is exactly ONE `groundCandidate` declaration; and the led branch's source names no gene, no attribute and no multiplier of its own | HARD |
| ⭐ **G-EPI-MOTION** | **RE-GATED (#236 amendment 2), through THIS stage's arming path.** On a fixture whose truth MOTION is rewritten in place without stepping (no scan moment recorded; POSITIONS untouched so `flight` is identical): the PERCEPT world's led candidate is UNCHANGED for every body and equals the truth-derived value for NONE; the BARE world's FOLLOWS truth exactly. PLUS the source pin: the ONLY member of `match` either seat module names is `perceivedSnapshot`, and no truth-scan token appears in their executable bodies | HARD |
| ⭐⭐ **G-CROSS** | **THE TWO-DOORS MATRIX (#228), gated from birth, FOUR doors.** 96 cells — {`dlcDeliveryChoice` on/off} × {`ptpPassLead` on/off} × {`obmMovement` on/off} × {`ctbSupportPlane` on/off} × {the neighbours' gene banks dosed/absent} × {the shared gene absent/zero/dosed} — one FULL match per cell per seed, whole-run signature incl. rng state, inside the G-DET core. Claims stated EX ANTE: **(A)** dlc armed with every neighbour bank DOSED and its own gene ABSENT ≡ ALL-OFF, and a dosed contest is *unchanged* by those banks; **(B)** each neighbour armed alone is unmoved by this door at any gene state; **(PTP)** ⭐ the FROZEN INTERACTION — `ptp1·dlc1` ≡ `ptp1·dlc0` at every gene state (the banked seam keeps precedence), while `ptp0·dlc1·dosed` ≠ `ptp1·dlc0·dosed` (**the CONTEST is not the FORCED dose** — the discrimination that makes DLC-T1's contrast anchor meaningful); plus DORMANT-ALL and the non-vacuity BITE rows | HARD |
| **G-RNG** | the seam draws **zero** rng (an armed, dosed contest formed and scored over every outfielder against every mate on a stepped fixture leaves the match rng state EXACT); the flag-off stream is identical (G-IDENT/G-OFF); and **`genome.ts` is untouched by this stage**, machine-checked: the gene is still outside `GENE_KEYS`, `randomGenome` still never serializes it, and 8 generations of the shipped mutate+crossover with the opt-in OFF still reproduce a faithful PRE-GENE re-implementation's genomes AND final rng state exactly | HARD |
| **G-HYGIENE** | `dlcDeliveryChoice` absent from `a4World.ts` **entirely**; initialised `cfg.dlcDeliveryChoice ?? false`; no new gene anywhere; a fresh Match and a League match are both OFF; no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` anywhere on a seam line | HARD |
| **G-FORK** | ⭐ the READ-FORK INVENTORY: **exactly ONE** `match.dlcDeliveryChoice` fork in `src/**`, at the named site, feeding exactly ONE led-candidate formation, TWO candidate scorings and ONE led capture, with **ZERO** new strike statements; every other `src/**` occurrence enumerated with file:line and class, **zero unclassified** | HARD |
| **G-TRACE** | the banked PROJECTION FUNCTION is **verbatim-untouched** (both constants and both declarations, the projection body's law lines, the through-ball loop's `/ 18`, `runBurstPoint`'s `* 1.6`), the PTP fork line and led-strike statement are verbatim, and the UNTOUCHED INCUMBENTS are asserted in source form: the `MakeRun` guard, the burst call, **the loft's `d > 24` gate**, **the automatic bender's `bentKick(... groundBend(...) ...)` call** and the incumbent strike-time lead | HARD |
| **G-PINS** | the §PINS inventory's machine-checkable rows recomputed, **including the PTP-T0 G-FORK pin's exact text in BOTH the test file and `src/**`** and the O1 wind-up's four verbatim pins | HARD |
| **G-SEED** | seed-block disjointness proved in-probe for **all three** intervals this stage consumes, against the COMPLETE consumed ledger **incl. PTP-T0's and PTP-T1's blocks** (smoke 12,425,026–037 · dose-read 040 · guard 050–099 · battery+reserve 100–727 · test seeds 12,425,900–906) | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests | HARD |
| **G-SUITE** | FULL `npm test` green + `tsc --noEmit` clean. (The known #196.2 wall-clock flake is pre-existing — if it reds it is reproduced on the PRE-change tree) | HARD |
| **REPORTED (a)** | ⭐ the FORCED-SMOKE **WINNER-IDENTITY TABLE**: per chosen pass, which candidate won, and the emergent LED SHARE in both world shapes. No control, no CI, **no ANSWER** | REPORTED |
| **REPORTED (b)** | ⭐ **the CHOOSER-COST reading (#236 amendment 4)**: armed vs off, the OBM-T0 form — one full match per arm, minimum of repeats, stated honestly and used in no rate. ⚠ **The armed+dosed arm is a DIVERGED world and simulates a different NUMBER OF TICKS**, so the headline is **ms/TICK**, per-arm tick counts are published, total wall is CONTEXT, and the **noise floor** is the instrument's own control pair (`off` vs `bornArmed`, identical arithmetic) | REPORTED |

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any src diff outside
the seam path, any rng draw appearing on the dormant path, any predicate appearing anywhere,
or **any existing test breaking** (a STOP-and-report, never a test edit).

No bootstrap is used anywhere in this stage, so the ≥104,800 stats base does not apply.

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| everything consumed through PTP-T1 | see the probe's `CONSUMED` table (inherited in full: PTP-T0's 12,425,000–025 and 900–906; PTP-T1's smoke 026–037, dose-read 040, guard 050–099, battery+reserve 100–727) | prior |
| **DLC-T0 receipts (this stage)** | **12,426,000 – 12,426,023** (24 seeds × 8 arms; ⭐ the 96-cell G-CROSS matrix re-uses the FIRST 4 of these same seeds — **no new block**) + **12,426,024** (the contest/winner/G-EPI-MOTION/smoke read) | **CONSUMED here** |
| **DLC-T0 REPORTED cost read** | **12,426,025** | **CONSUMED here** |
| DLC-T0 test-file seeds (not a battery) | 12,426,900 – 12,426,906 | consumed here |
| free above | 12,426,026 – 12,426,899 and 12,426,907 + | available to DLC-T1 |

Disjointness is computed **in-probe** for all three intervals separately, not asserted here.

## §ROAD B — nothing ships

`dlcDeliveryChoice` is **OFF in every production path** — a hard `false` default, absent from
`a4World.ts` and from all three play-test worlds, absent from every League's `matchFlags`
unless a probe sets it explicitly — and even ARMED it does nothing while the gene is absent
(G-BORN), and nothing observable while the gene is at zero (G-ZERO). No gene, no opt-in and
no genome code was added or changed. The production fingerprint is unchanged, the flag-off
world is byte-identical on three league seeds and on every receipt match seed with the rng
stream included. **Nothing about the game the user plays changes in this commit.** The seam
exists so DLC-T1 can run the CHOICE EXAM.

## §NON-CLAIMS

DLC-T0 claims **no** football effect: not on TRUE-holdable supply, not on the goal band, not
on interceptions, offside, spacing or watchability. The REPORTED winner table is an
uncontrolled descriptive reading of ONE match per world shape at ONE gene value and
adjudicates nothing — **F-DLC-a** (the contest retains the poison), **F-DLC-b** (the contest
kills the gain) and **F-DLC-c** (an inherited guard STOPs) are all **DLC-T1's** to fire. It
does not claim the pricing is RIGHT (§HONESTY 2), nor that two entries is a MENU (§HONESTY
3), nor that the emergent led-share it reports is the share a real exam would produce. It
changes **no** TeamBrain assignment or licence, **no** receiver-side behaviour, **no** price
table, and adds no gene, no attribute, no action type and no render cue. It cannot authorize
DLC-T1 or slices two/three; only the commander can.

---

## §RESULT — the gates run

*(filled in from the committed artifact after the receipts ran; every number here is quoted
FROM `docs/world-model/data/dlc-t0-contest-seam.json`, which is recomputed by
`npx tsx scripts/probes/dlc-t0-contest-seam.ts` — the doc never carries evidence the artifact
does not.)*

Tests: [`../../tests/dlcDeliveryChoice.test.ts`](../../tests/dlcDeliveryChoice.test.ts) —
**19 pins** (19 `it()` blocks). Receipts:
[`../../scripts/probes/dlc-t0-contest-seam.ts`](../../scripts/probes/dlc-t0-contest-seam.ts),
artifact [`data/dlc-t0-contest-seam.json`](data/dlc-t0-contest-seam.json).
**24 seeds × 8 arms (absent · off · plain · plainOff · bornArmed · zeroArmed · contest ·
plainContest) = 192 full matches per core run, PLUS ⭐⭐ the 96-cell FOUR-DOOR crossing on the
first 4 receipt seeds = 384 more per core run, and the core runs TWICE (G-DET, byte-identical
digests), plus 3 league-seed 2-season identity runs, the contest geometry in both world
shapes, the G-WINNER instrument matches in both shapes, the G-EPI-MOTION divergence fixture
in both shapes, the two winner smokes and the seam rng fixture on seed 12,426,024, the
8-generation evolution-rng comparison, the `src/**` fork scan, and 9 timed matches for the
chooser-cost reading on seed 12,426,025.** Verdict: **GATES PASS** (`gates.allPass === true`),
probe exit 0. Wall ≈ 149 s (CONTEXT ONLY — used in no rate).

> ⚠ **SUPERSESSION — a REPORTED-LAYER CORRECTION, no HARD-gate measurement moved.** The prior
> receipt `e89a6bf8…3fe4` is **superseded** by the run below. Two instrument faults were found
> in the REPORTED / wording layer and fixed: **(1)** the chooser-cost reading was **not
> like-for-like** — the armed+dosed arm is a DIVERGED world that simulates ~3 % FEWER ticks, so
> the old total-wall headline priced a shorter match against a longer one and the old table's
> single "14,756 ticks per match" was a shared mutable overwritten by the last arm. The
> instrument now publishes **per-arm tick counts**, headlines **ms/tick**, demotes total wall to
> context and states the **noise floor** from its own control pair. **(2)** the G-ZERO / G-BITE
> geometry counters are **probe-side seat constructions** measured on **different arms per
> column**, not the clean "formed-and-scored by the brain" world-shape contrast the old wording
> implied; the wording is corrected and the arm is now recorded per column (`measuredOnArm`).
> The underlying claims are unchanged and independently verified true. **Every HARD-gate
> measurement in the artifact is byte-identical** to the superseded run; what moved is the two
> gate `semantics` strings, the two `measuredOnArm` labels, the whole `reported.chooserCost`
> block and, consequently, `resultSha256`.

* **G-DET digest** — `gates.gDet.digestA === digestB ===`
  `4cfef2cc565bc724e623a04d63caa41bef71562ddc5edc7572295a75f825788f`
* **resultSha256** `e4ae225f5fe23ea2f05c0d28ce8750b7a33959d9b18ffd4e8fa5a9647dc978c6`
  (⚠ supersedes `e89a6bf8e855835442a52bdb8fa90a4a5c51947a7cc43fa983e46124a6c73fe4` — see the
  supersession note above)
  (recomputable: `npx tsx scripts/probes/dlc-t0-contest-seam.ts`). Per #197-M1 the hashed body
  is **commit-free, timing-free and path-free** — `headContextOnly`, `wallMsContextOnly` and
  `artifactPathContextOnly` ride the envelope, OUTSIDE the hash, as do the REPORTED wall-clock
  readings under `reported.chooserCost`. Every GATE input is inside it.
* **Files touched** — the authoritative list is `git show <this commit> --stat`; no
  completeness claim is made here from a `git diff --stat` (the #194 L3 lesson).

### Gate table

| gate | verdict | evidence (all recomputed in-probe, #181.2) |
| --- | --- | --- |
| **G-IDENT** | ✅ PASS | all three league hashes IDENTICAL to the frozen pre-change baselines: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26` — `gates.gIdent.rows`. ⭐ **This is also the code-motion receipt**: the ground-pass chain was hoisted into one function so both deliveries could be priced by the same code, and the hoist reproduces HEAD's doubles exactly |
| **G-FP** | ✅ PASS | the 1337 row IS the production fingerprint (`gates.xFpProd`); `npm run fingerprint` re-derives `57b0bdab…c673` unchanged (§CHECKS) |
| **G-OFF** | ✅ PASS | 24/24 seeds: flag ABSENT ≡ flag FALSE in the percept-armed AND the production-shaped world, whole-match signature including the rng stream state. **CONFIG EQUIVALENCE ONLY** |
| **G-BORN** | ✅ PASS | 24/24: ARMED with the gene ABSENT ≡ OFF, byte for byte — through a live path where the arming rule is evaluated on every on-ball decision and returns `null`. `absentSeatsFormed: 0` in both world shapes |
| ⭐ **G-ZERO** | ✅ PASS | 24/24: ARMED at gene 0 ≡ OFF, byte for byte — **and NON-VACUOUSLY**: `1,900` (percept) and `1,075` (bare) zero-gene led candidates were **constructed PROBE-SIDE** on sampled live states, and **1,900 / 1,075 of them — every one — degenerated onto the feet candidate's own point**, which is what the strict-`>` tie rule then discards. ⚠ **The counter is a probe-side seat construction, not a brain-side tally** — that the brain really forms and prices them is G-FORK / G-NOTASTE (code) plus G-BITE's in-sim divergence and G-WINNER (behaviour) |
| **G-BITE** | ✅ PASS | **24/24 armed+dosed arms diverge** in the percept world **and 24/24 in the bare world**. Contest geometry, seed 12,426,024: **1,007 support samples (percept) and 368 (bare), 0 violations across all six law checks** (`arithmetic` · `direction` · `nonSupportNonZero` · `stillNonZero` · `zeroGeneNonZero` · `aimComposition`), and on the passes ACTUALLY STRUCK **0 sign and 0 magnitude violations** in both shapes |
| ⭐ **G-WINNER** | ✅ PASS | **the argmax entry, end to end through the brain.** percept: **154 Pass candidates, 0 violations**, 40 materially-divergent decisions of which **32 won by the LED candidate and 8 by TO FEET**; bare: **134 candidates, 0 violations**, 37 material of which **28 LED / 9 TO FEET** (max Δopenness 0.852 / 0.869). Every winner priced at ITS OWN aim; **both outcomes occur** — a contest, not a disguised forcing |
| ⭐ **G-NOTASTE** | ✅ PASS | both candidate calls matched VERBATIM, **exactly ONE** `groundCandidate` declaration, and **zero** banned tokens in the led branch (`ledBranchTokens: []`) or the seat module (`seatModuleTokens: []`) — no gene, no attribute, no multiplier of this stage's own |
| ⭐ **G-EPI-MOTION** | ✅ PASS | **percept world: 7/7 led candidates unchanged by the truth rewrite (they read his own eyes), 0/7 match the truth, 7/7 truth-vs-percept pairs genuinely differ** (mean remembered age 13.3 ticks). **bare world: 4/4 FOLLOW truth exactly.** Source pin over BOTH seat modules: `moduleMatchMembers === ['perceivedSnapshot']`, `moduleBannedHits === []` |
| ⭐⭐ **G-CROSS** | ✅ PASS | **22/22 claims held, 4/4 seeds each**, over 96 cells × 4 seeds = 384 full matches per core run. ⭐⭐ `PTP-KEEPS-PRECEDENCE` holds at **all three** gene states; ⭐⭐ `CONTEST-IS-NOT-THE-FORCED-DOSE` holds (the two worlds are genuinely different); `A-DLC-ALONE-INERT`, `A-DLC-ZERO-INERT`, `A-OTHER-GENES-INVISIBLE`, both `B-` families, three discrimination rows and three BITE rows. **The 96 cells collapse onto exactly TWELVE distinct worlds** — see the table below |
| **G-RNG** | ✅ PASS | (a) the seam: an ARMED, DOSED contest formed and scored over every outfielder against every mate on a 400-tick fixture leaves the match rng state EXACT — **1084273773 → 1084273773**, 50 contests. (b) evolution: genomes identical to the pre-gene re-implementation, final rng state identical, the gene stayed absent, `optInDraws: true`, `obmStreamUnmoved: true`, `crossoverOrderHeld: true` — **this stage added no gene and no opt-in** |
| **G-HYGIENE** | ✅ PASS | `cfg.dlcDeliveryChoice ?? false`; the flag absent from `a4World.ts` entirely; **no new gene** (`genome.ts` names nothing of this stage); a fresh Match and a League match are both OFF; no env door on any seam line |
| **G-FORK** | ✅ PASS | **exactly 1 flag fork, 1 `groundCandidate` declaration, 2 candidate scorings, 1 led formation, 2 led captures, and 3 `match.performPass(` statements — UNCHANGED**, i.e. ZERO new strike statements. **19 src occurrences total, ZERO unclassified** (kinds: `FLAG_FORK` 1 · `CAND_DECL` 1 · `CAND_SCORE` 2 · `LED_GUARD` 1 · `LED_FORM` 1 · `LED_ARGMAX` 4 · `LED_CAPTURE` 2 · `SEAT_DECL` 2 · `IMPORT` 1 · `CONFIG` 1 · `FIELD` 1 · `INIT` 1 · `UNION_KEY` 1) |
| **G-TRACE** | ✅ PASS | all **13** source lines matched VERBATIM — the banked projection's two constants, two declarations, projection body and scope gate; the through-ball loop's `/ 18` and `runBurstPoint`'s `* 1.6`; the MakeRun guard and burst call; ⭐ **the loft's `d > 24` hand gate** (slice two's zero-point) and ⭐ **the automatic bender's `bentKick(… groundBend(…) …)` call** (slice three's zero-point); the incumbent strike-time lead; the banked led-strike statement; and the `ptpPassLead` fork line. The banked projection module's whole-file sha256 is recorded: `f276c0d4cdfbe74b2ca9475e7db6ae5431455239d310b461a118e7b2126b142f` |
| **G-PINS** | ✅ PASS | **12/12 named pins present**, including the PTP-T0 G-FORK pin's exact text in the test file AND the fork line in `src/**` (`srcVerbatim: true`). Nothing renegotiated |
| **G-SEED** | ✅ PASS | 12,426,000–024 · 12,426,025 · 12,426,900–906, **zero collisions** with the **41** consumed blocks (`gates.seedDisjoint.collisions === []`) |
| **G-DET** | ✅ PASS | two invocations of the core, identical digests (above) |
| **G-SUITE** | ✅ PASS | see §CHECKS |

### ⭐⭐ G-CROSS — the four-doors table (seed 12,426,000, sha-12 per cell)

**96 cells collapse onto exactly TWELVE distinct worlds, and each is reached by exactly the
doors that should reach it.** (`others1` = the banked `offballMovementWeights` and
`ctbSupport*` banks dosed at their own domain corners.) Reproduced identically on all 4
crossing seeds; full table in `gates.gCross.table`.

| cell family | cells | sha-12 | which world |
| --- | --- | --- | --- |
| every `dlc0·ptp0` cell with `others0`, plus every `dlc*·ptp*` cell whose gene is inert and whose neighbour doors are shut | 45 | `6a1dd3d14226` | **INCUMBENT** — including ⭐ `dlc1·others1·gene-{absent,zero}` (claims A): the contest armed, both neighbour banks FULL, and **nothing happens** |
| `…·ctb1·others1` with the contest inert | 9 | `1215bc441b34` | **CTB STATIC PLANE ALONE** — unmoved by this door (claim B) |
| `…·obm1·others1` with the contest inert | 9 | `c7a7b23a4a48` | **OBM SEAT ALONE** — unmoved by this door (claim B) |
| `…·obm1·ctb1·others1` with the contest inert | 9 | `3bb60e46b110` | both banked seams — still unmoved by this door |
| ⭐⭐ `ptp1·gene-dosed` with the neighbour doors shut — **`dlc0` AND `dlc1` alike** | 10 | `d4060857796b` | ⭐⭐ **THE FORCED DOSE (PTP alone)** — and arming the contest beside it makes **no difference at all**: the precedence law, visible in the collapse |
| `ptp1·ctb1·others1·gene-dosed` (dlc either way) | 2 | `d0dfd45455a0` | the forced dose + the CTB plane |
| `ptp1·obm1·others1·gene-dosed` (dlc either way) | 2 | `253948b57d9b` | the forced dose + the OBM seat |
| `ptp1·obm1·ctb1·others1·gene-dosed` (dlc either way) | 2 | `183ff4d345a1` | the forced dose + both |
| ⭐ `dlc1·ptp0·gene-dosed`, neighbour doors shut | 5 | `944d93e6b469` | ⭐ **THE CONTEST ALONE** — and the neighbours' banks make **no difference to it** (claim A′). ⭐⭐ `944d93e6b469 ≠ d4060857796b`: **the contest is NOT the forced dose** |
| `dlc1·ctb1·others1·gene-dosed` | 1 | `bc30955cb0e3` | the contest + the CTB plane |
| `dlc1·obm1·others1·gene-dosed` | 1 | `0c1c78e0f72e` | the contest + the OBM seat |
| `dlc1·obm1·ctb1·others1·gene-dosed` | 1 | `b2f43764d0d8` | **all three** — the cell DLC-T1's combined arm would live in |

⭐ **The falsifiers, in one line each:** `944d93e6b469 ≠ d4060857796b` (the CONTEST is not the
FORCED DOSE — the whole point of #235), `944d93e6b469 ≠ c7a7b23a4a48 ≠ 1215bc441b34` (the
seams are distinguishable), and `dlc1·obm0·ctb0·others1·gene-zero === 6a1dd3d14226` (an
armed-inert door spends no neighbour's bank).

### G-BITE — the contest geometry (seed 12,426,024)

⚠ **READ THE CAPTION BEFORE THE TABLE — two labelled limits.**

1. **These counters are PROBE-SIDE SEAT CONSTRUCTIONS.** The probe builds the seat itself and
   calls `ledDelivery` off a *copy* of the genome on sampled live match states; the columns are
   **not** a tally of candidates the BRAIN formed on that match. The brain-side formation is
   established elsewhere and independently: by **code reading** (the read-fork inventory,
   machine-checked by G-FORK and G-NOTASTE) and **in simulation** — the independent
   verification of this stage reproduced the armed+dosed world's divergence from OFF **in-sim
   down to 1e-15**, which cannot happen unless the second candidate really forms, is really
   priced and really enters the argmax — plus G-WINNER end to end through the brain.
2. ⚠ **THE TWO COLUMNS ARE SAMPLED ON DIFFERENT ARMS**, so this is **NOT a clean world-shape
   contrast**: percept is read on `bornArmed` (a **gene-ABSENT** match) and bare on
   `plainContest` (a **gene-DOSED** match) — now recorded in the artifact as `measuredOnArm`
   per column. The *re-derivations* are arm-independent (dosed/zeroed genome copies), but the
   *match states they are sampled on* are not. Any percept-vs-bare difference below is
   therefore **world shape CONFOUNDED WITH ARM**. Re-measuring both columns on one arm would
   move HARD-gate numbers this round is forbidden to move; it is named here for a later stage.

| quantity | percept world (`bornArmed`) | bare world (`plainContest`) |
| --- | --- | --- |
| samples (carrier × mate) / of which SUPPORT-mode | 1,900 / **1,007** | 1,075 / **368** |
| samples the led candidate MOVED the aim | **214** | **362** |
| samples with EXACTLY ZERO motion ⇒ the led candidate IS the feet candidate | **793** | **6** |
| mean led displacement (max) | **0.89 m** (12.83 m) | **4.06 m** (15.49 m) |
| mean flight / mean motion speed | 0.550 s / **0.842 m/s** | 0.639 s / **3.781 m/s** |
| ⭐ zero-gene candidates CONSTRUCTED (probe-side) / of which degenerate | **1,900 / 1,900** | **1,075 / 1,075** |
| seats formed with the gene ABSENT | **0** | **0** |
| law violations (6 checks) | **0 / 0 / 0 / 0 / 0 / 0** | **0 / 0 / 0 / 0 / 0 / 0** |

⭐ **Read exactly** — and, per the caption, **as an arm-confounded reading**: the percept
column's mean remembered motion speed is **0.842 m/s against the bare column's 3.781**, and
**793 of 1,007** support samples project EXACTLY ZERO there — consistent with (not proof of)
the same HONEST LIMIT PTP-T0 measured (a carrier leads only the mates his own eyes have a
remembered velocity for). Under this contract that limit is no longer a weakness of the
mechanism: a mate he cannot project simply has ONE candidate, and the ball goes to his feet.

### ⭐ REPORTED — the WINNER TABLE (the emergent led share, seed 12,426,024)

`performPass` is wrapped on the instance so the **5th argument identifies the winning
candidate** for every chosen pass: non-null ⇒ the LED candidate won and its own displacement
was carried into the strike; null ⇒ TO FEET won.

| quantity | percept world | bare world |
| --- | --- | --- |
| passes chosen | 87 | 90 |
| ⭐ **won by the LED candidate** | **12 (13.8 %)** | **40 (44.4 %)** |
| won TO FEET | 75 | 50 |
| passes to a support-mode target | 47 | 57 |
| mean led displacement (max) | **4.67 m** (7.41 m) | **6.82 m** (11.99 m) |
| lead as a share of the pass distance | **0.396** | **0.432** |
| sign / magnitude violations | **0 / 0** | **0 / 0** |

**What this is and is not.** ⭐ **The led share IS the emergent dose** — the number the retired
dial used to fix at 1 (PTP-T1's forced arm led *every* support pass it could). Here the
chooser takes **13.8 % / 44.4 %**, by situation, with the rest played to feet in the same
match. It is a reading that the contest is genuinely two-sided and that the aim obeys the
banked law on real choices. It is **ONE match per world shape at ONE gene value**, with **no
control arm, no CI and no dose curve**; it says nothing about whether any of it helps —
**F-DLC-a/b** are DLC-T1's to fire.

### ⭐ REPORTED — the CHOOSER COST (#236 amendment 4, seed 12,426,025)

One full match per arm in a **percept-armed** world, minimum of 3 repeats. Machine-dependent,
outside the hash, used in **no** rate.

⚠ **NOT LIKE-FOR-LIKE AT THE TOTAL-WALL LEVEL, and the instrument now says so.** The
armed+dosed arm is a **DIVERGED WORLD**: it plays a different match and finishes in **14,756
ticks against the other two arms' 15,216** (~3 % fewer). Comparing total wall across the arms
therefore prices a *shorter* match against a *longer* one. ⇒ **the headline is ms/TICK**,
per-arm tick counts are published, and total wall is kept only as CONTEXT.

| arm | ticks | min wall (context) | **ms/tick (HEADLINE)** | **per-tick vs OFF** | total wall vs OFF (context) |
| --- | --- | --- | --- | --- | --- |
| flag OFF | 15,216 | 96 ms | **0.006309** | — | — |
| ARMED, gene absent (no second candidate forms) | 15,216 | 92 ms | **0.006046** | **−4.17 %** | −4.17 % |
| ARMED + DOSED (**the contest: every support mate priced twice**) | 14,756 | 95 ms | **0.006438** | **+2.04 %** | −1.04 % |

⭐ **THE NOISE FLOOR, AND WHAT IT DOES TO THE READING.** `off` and `bornArmed` are the
instrument's own **control pair**: they execute the *same arithmetic* (the seat is `null`, no
second candidate forms) on the *same* 15,216 ticks, so their per-tick spread is **pure
measurement scatter**. This run's spread is **4.17 %**. The contest's per-tick effect is
**+2.04 %** — **BELOW the floor** (`contestResolvedAboveNoiseFloor: false`). ⇒ **This
instrument does not resolve the chooser's per-tick cost.** What it supports is a *bound*: on a
shared machine, over one match per arm, the overhead is **not large enough to rise out of a
~4 % floor**. It is **not** the "≈ 3 %" the superseded table claimed — that figure was the
total-wall reading of a shorter match, which if anything *understated* the per-tick overhead.
**No lever is pulled on this number, and none should be**; per #236 amendment 4 the honest
lever if a properly-powered reading ever finds it dear is **CANDIDATE SCOPING**, never a
pricing shortcut. A reading that could actually resolve a few-percent effect would need
repeats sized against the floor, not a minimum-of-3 — DLC-T1's to size if it wants it.

## §CHECKS

* `npx tsc --noEmit` — **clean**.
* `npm run fingerprint` — `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`,
  **unchanged**, and independently recomputed in-probe as G-IDENT/G-FP.
* `npm test` — **1,288 of 1,289 pass across 132 files**, including `tests/ptpPassLead.test.ts`'s
  24 pins **verbatim** (the banked seam stays the DLC-T1 contrast anchor) and
  `tests/o1PassWindup.test.ts`'s source-text pins. No test file was edited by this stage; the
  only `tests/**` change is the NEW `dlcDeliveryChoice.test.ts` (19 pins).
* ⚠ **THE ONE FAILURE IS THE #196.2 WALL-CLOCK FLAKE — REPRODUCED ON THE PRE-CHANGE TREE, as
  the rule requires, and MEASURED rather than waved at.** The failing test is
  `tests/formationEvolution.test.ts > league-level style ecology > ten seasons`, timing out at
  the 180,000 ms vitest ceiling. Three receipts, all on a **clean `git worktree` at the
  PRE-change commit** (no stash, so nothing of this stage's work was ever at risk):
  1. **Pre-change FULL SUITE: the SAME test reds, at 181,389 ms** — 1,269 of 1,270 pass. The
     failure exists without this stage.
  2. Post-change full suite: **the same single test**, 181,013 ms — 1,288 of 1,289 pass.
     Every other file, including every banked seam's, is green on both trees.
  3. **In ISOLATION it passes on BOTH trees**: pre-change **147.04 s**, post-change
     **147.96 s** — **+0.6 %, inside the noise** of a shared machine, against a ceiling the
     test sits 18 % under even at rest. It times out only under the parallel-suite load the
     #196.2 lesson names.
  ⭐ Receipt (3) also answers the one performance question the HOIST raises (a closure per
  decision, a call and a small object per candidate mate): **on the heaviest wall-clock test
  in the suite it is not measurable.**

## §DEV — the deviations, declared

1. ⚠ **THE PTP INTERACTION went the OTHER WAY from the dispatch's recommendation** — see
   §LAW. Recommended: guard the PTP forced-aim branch on `!dlcDeliveryChoice`. Not available:
   that line is pinned VERBATIM by `tests/ptpPassLead.test.ts`, and a pinned test is a STOP,
   never an edit. Frozen instead: the banked seam keeps precedence, achieved by arithmetic
   (identical aims + the tie rule) and gated by three G-CROSS claim families plus a test.
   The armed-both world is therefore `ptpPassLead` armed alone, byte for byte, at every gene
   state — which is exactly what DLC-T1's CONTRAST anchor wants to be able to walk.
2. **The ground scoring chain was HOISTED** into `groundCandidate` (pure code motion, the
   `passMul` precedent). Declared because it is a diff inside the shipped pass loop rather
   than beside it; G-IDENT / G-FP are what make "pure" a measurement.
3. **G-ZERO was redefined rather than dropped.** The dispatch allowed "n/a or defined"; it is
   DEFINED here, with its own non-vacuity counter, because the identity is now the tie rule's
   rather than the arming rule's — a genuinely different claim from PTP-T0's, and worth its
   own receipt.
4. **G-WINNER's non-vacuity is POOLED across the two world shapes** (both outcomes must occur
   across percept + bare), not required per shape. Frozen that way in §GATES before the run;
   as measured, both shapes satisfied it individually anyway (32/8 and 28/9).
5. ⚠ **The banked PTP-T0 PROBE's G-FORK consumer counts are now stale against this tree —
   measured, not guessed.** That gate pins `BONUS_GATE === 10`; re-running its own counting
   rule over this tree yields **13** (`LOFT_BODY` 8 and `MUL_FACTOR` 2 are unmoved). The three
   extra rows are the hoist's own signature lines — the return type's `gain: number;`, the
   `return { s, lane, open, gain, mul };` and the `const { lane, open, gain, mul } = feet;`
   destructure — i.e. the SAME logical gates, now named at a function boundary. So re-running
   `scripts/probes/ptp-t0-pass-lead.ts` at this commit would RED its G-FORK. Its committed
   artifact stands as the receipt of the tree it ran on; **this stage's G-FORK is the
   inventory of the pass block as it now stands**, and G-TRACE plus
   `projectionFileSha256 = f276c0d4…b142f` are what keep PTP-T0's *law* receipts citable —
   the projection function itself is untouched, byte for byte. **The PTP-T0 TESTS, which are
   what the pin inventory binds, pass VERBATIM.**
