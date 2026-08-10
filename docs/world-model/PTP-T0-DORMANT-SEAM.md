# PTP T0 — the DORMANT PASS-LEAD SEAM (`ptpPassLead`, 传球到路: 球到人要去的地方)

Status: **PRE-REGISTERED, then BUILT + RUN the same round.** The gene law with its traced
constants, the seam, the motion-inference answer, the read-fork inventory, the gates, the
seed ledger, the PIN INVENTORY and the Road B statement below were written **before** the
receipts ran (the frozen-before-sight rule, the OBM-T0 / CTB-T0 two-part form); the
measured numbers arrive only in [§RESULT](#result--the-gates-run) at the foot.

Authority chain: contract [`PASS-TO-PATH-CONTRACT.md`](PASS-TO-PATH-CONTRACT.md) — §0 (the
code fact: lead pricing exists ONLY for `MakeRun` license holders; every support receiver
is priced AT HIS FEET, always) · §2 **M-PTP.1** (THE PROJECTION and its information-honesty
rule) · **M-PTP.2** (THE GENE, born absent; execution follows pricing) · **M-PTP.3** (NO
predicates, #200) · **M-PTP.4** (untouched: the `MakeRun` through-ball path, the whether
seat, the certified table, the OBM/CTB laws, TeamBrain) · §3 the **PTP-T0** clause (⚠ the
PIN INVENTORY, the READ-FORK INVENTORY and **G-EPI-MOTION** are NAMED deliverables) · §4
the non-claims. Ruling **#231** (the dispatch, carrying the user's census verdict
*我感觉是不是我们的底座还是不够多* and its answer: the missing layer is RELATIONAL) and the
**#181.2 / #194 / #196 / #197-M1 / #200 / #202 / #228** evidence lessons verbatim.
[`OBM-T0-DORMANT-SEAM.md`](OBM-T0-DORMANT-SEAM.md) and
[`CTB-T0-DORMANT-SEAM.md`](CTB-T0-DORMANT-SEAM.md) are the FORM this document and its
receipts follow — the former's **G-EPI** fixture form is the template for G-EPI-MOTION, and
its **G-CROSS** matrix (the #228 two-doors lesson) is carried here as a birth gate rather
than a remembered caution.

Banked evidence this stage stands on: **CTB-T1 / F-CTB-a** (#226 — static repositioning
moved no supply ruler), **OBM-T1 / F-OBM-a** (#230 — clean situational movement moved none
either, and the ONLY signal came from the one arm that dosed the SCORE channel), and the
#231 census reading that explains both nulls in one sentence: **movement cannot be cashed
by a chooser that cannot see it.**

---

## §LAW — the frozen law, and where every constant comes from

```text
THE PROJECTION (M-PTP.1), for a SUPPORT-mode mate in the ORDINARY pass loop
  flight  = dist(carrier.pos, mate.pos) / PTP_FLIGHT_SPEED          [seconds]
  disp    = motion · flight · PTP_LEAD_FLIGHT_MUL                   [metres]
  lead    = passLeadSupportWeight(g) · disp
  aim     = mate.pos + lead
      PTP_FLIGHT_SPEED     = 18   ← the THROUGH-BALL loop's OWN flight divisor
                                    `const flight = dist(p.pos, mate.pos) / 18;`
                                    (src/ai/PlayerBrain.ts, pinned VERBATIM)
      PTP_LEAD_FLIGHT_MUL  = 1.6  ← runBurstPoint's OWN in-stride lead factor
                                    `return v2(p.pos.x + p.vel.x * flight * 1.6, …);`
                                    (src/ai/formations.ts, pinned VERBATIM)

THE PRICING — the three scoring inputs the contract names move to the aim:
  lane = laneOpenness(p.pos, AIM, opp)   open = opennessAt(AIM, opp)
  gain = clamp01((team.localX(AIM.x) − localX + 30) / 60) · 2 − 1
  everything else stays anchored to the BODY: d (the flight this lead is derived
  from, and the long/short bands), the offside read (the flag is judged on where he
  STANDS), the kick misalignment (body mechanics), and every incumbent bonus.

THE MOTION SOURCE — ONE inference form per WORLD SHAPE (the honesty core)
  bare world   (match.edsPerceivedChoice === false) ⇒ motion = mate.vel   (TRUTH)
  percept world(match.edsPerceivedChoice === true ) ⇒ motion = the REMEMBERED
        velocity of that mate in THIS body's own perceivedSnapshot
        (`ObservedPlayer.vel`, recorded at observedTick, stale by ageTicks)
  ⭐ no snapshot, or that mate not in it ⇒ motion EXACTLY ZERO ⇒ to feet.

THE EXECUTION (M-PTP.2) — pricing and strike agree
  performPass:  lead = struckLead + ptpLead        (struckLead = the INCUMBENT
                mate.vel · flight · 0.8 correction, arithmetic untouched)
  the winner's OWN priced displacement is handed to the strike; a substituted
  target (forcedPassTarget / the perceived chooser) carries NO lead.
```

### 1. Why these two constants and no others (#202, the MARK_SAG_BALL_SPEED form)

Both are TRACED **by question identity** and neither is re-derived, re-cut or re-typed
anywhere else. The seat DECLARES them at its own site with the source line quoted, and
**G-TRACE matches those source lines VERBATIM**, so the family cannot drift without
reddening a gate (the `MARK_SAG_BALL_SPEED = 16` precedent exactly).

* **`18`** — the loop that ALREADY prices a led pass (the through-ball) turns a distance
  into a flight with `/ 18`. This slice asks that loop's own question of a support mate, so
  it takes that loop's own answer. Deliberately NOT `performPass`'s executed
  `16 · powerMul` (a specific body's orientation and chosen weight — the chooser does not
  know it while scoring) and NOT `MARK_SAG_BALL_SPEED` (an access-time account).
* **`1.6`** — `runBurstPoint`'s in-stride lead factor IS the projection this slice extends
  from licensed runners to support mates. Taken whole.
* ⭐ **The through-ball's `speed > 3` branch is NOT taken.** `runBurstPoint` picks between a
  velocity lead and a run-target burst on a speed threshold; that threshold exists because a
  runner HELD at the offside line hovers, and it is the LICENSE path's own business
  (M-PTP.4). Taking it here would be a predicate on a continuous feature — the #200 red
  line. This seat takes the velocity arm ALONE, unconditionally, which is exactly why a
  still mate's led point degenerates to his feet **by arithmetic**.

### 2. Why the gene is UNSIGNED [0,1]

Unlike the CTB/OBM deformation genes (whose zero must be interior because they deform an
incumbent CENTRE), this gene runs from *none* to *all*: 0 = to feet (today), 1 = the whole
projected displacement. A negative lead would aim BEHIND a moving receiver, which is not a
footballing choice — it is a mistake. The domain is `clamp01`'s own, so the map introduces
no constant of its own.

### 3. ⭐ NO CAP, declared as a decision

The displacement is bounded BY CONSTRUCTION (|motion| ≤ a body's top speed; flight ≤ the
loop's own long-ball distance / 18; gene ≤ 1) and the **pricing is evaluated AT the led
point** — so a lead too greedy to be a real pass prices ITSELF out through lane, openness
and gain, rather than through an engineer's ceiling. That is the emergence-honest form:
the chooser sees the pass it would actually play and may decline it. Any cap is a T1 fork
WITH numbers, never a quiet re-freeze after sight.

### 4. ⭐ The SLICE SCOPE is a gate, not a predicate

Only a mate whose action is `SupportBallCarrier` is led (contract M-PTP.1: *"for a
support-mode mate in the ordinary pass loop"*). A `MakeRun` mate keeps his licensed
through-ball path untouched; every other action type is out of slice one. This gates **WHO
this limb is about**; nothing anywhere asks whether a mate is moving, checking, fast or
free. The complete conditional set of this slice is **gate** (the flag fork, the support
scope, the strike guards), **guard** (the finite/absent gene checks, the "did I see him"
zero) and **zero** (born-absent ⇒ 0). There is no threshold on any continuous quantity.

## §HONESTY — the epistemic limits, stated plainly (the O2-T0 / OBM-T0 form)

1. ⭐ **What the percept layer HONESTLY carries — traced, not assumed.**
   `ObservedPlayer` in [`src/ai/perceptionSnapshot.ts`](../../src/ai/perceptionSnapshot.ts)
   carries `pos`, **`vel`**, `bodyDir`, `observedTick` and `ageTicks`. So a percept world
   DOES honestly carry motion: **the velocity as it was at the moment his eyes were last
   open on that man**, aged by `ageTicks`. The frozen inference form is therefore that
   remembered velocity — NOT a fresh read, NOT a truth read, and NOT a reconstruction from
   position history. A stale reading leads badly, and **that degradation is the design**
   (contract §7(a)), not a defect to paper over.
2. ⭐⭐ **THE ANCHOR STAYS TRUTH IN BOTH WORLDS — the honesty limit of this slice, stated
   rather than hidden.** The base of the aim point is `mate.pos`, i.e. TRUTH, in the percept
   world too. Two reasons, both binding: (i) that is what the ordinary pass loop has ALWAYS
   priced — the `edsPerceivedChoice` fork swaps WHO gets the ball, it does not re-anchor the
   loop's positions — so consuming truth position here adds no channel the chooser did not
   already have; (ii) the zero-point identity REQUIRES it (`x + 0 === x` only if the base is
   the incumbent's own base). **This slice adds a MOTION channel and makes THAT channel
   world-appropriate; it does not re-anchor the incumbent's POSITION channel.** Re-anchoring
   the whole pass loop onto percepts is a much larger question and it belongs to the percept
   trunk, not to this limb. Declared here, and gated exactly as far as it goes:
   G-EPI-MOTION proves the MOTION half honest in both directions.
3. **Zero is SILENCE, not "he is standing still."** A mate he has never seen, or a body with
   no snapshot at all, yields zero displacement — the same continuous form of the
   whether-seat's E-NOCELL rule the OBM seat records. Anyone reading the lead stream at T1
   must price this: in the percept world the lead is zero for **unseen** mates and for
   **remembered-as-stationary** mates alike, and those are different facts.
4. **He cannot choose to look.** The seat prices what his eyes already recorded; it cannot
   refresh them. An on-ball LOOK is the banked O2 seat's business, not this one's.
5. **The strike keeps the incumbent's own correction.** `performPass` has always led a
   receiver by `mate.vel · flight · 0.8` at strike time. That is the passer's own body
   knowledge and it is UNTOUCHED; the gene's projection rides ON TOP of it. So at gene 1 the
   ball is led by the priced amount BEYOND the incumbent's small correction — recorded as a
   deviation (§DEV 2), not smoothed away, and it is precisely why gene 0 is byte-identical
   rather than merely close.
6. **With `o1PassWindup` also armed, the wind-up keeps precedence** and the led aim is not
   carried into the delayed strike. Both seams are dormant and no world arms both; the
   ordering is chosen so the banked seam's own pinned law is the one that holds, and it is
   stated here rather than discovered later.

## §SEAM — the mechanism (all of it dormant)

### The gene

* **`passLeadSupport?: number`** — one OPTIONAL `TacticalGenome` key in [0,1], **BORN
  ABSENT**, the `markSag` / `ctbSupportDepth` / `offballMovementWeights` birth form verbatim:
  * deliberately **NOT in `GENE_KEYS`**, so `randomGenome` / `mutateGenome` /
    `crossoverGenomes` / `geneDistance` draw the EXACT same rng in the EXACT same order as
    HEAD, and an absent optional key is omitted by `JSON.stringify` ⇒ the serialized genome
    and the production fingerprint are byte-identical;
  * it evolves ONLY under **ONE OWN explicit `evolvePassLeadSupport` boolean** (#75), whose
    draws sit **STRICTLY AFTER the `offballMovementWeights` block** (hence after
    `ctbSupportPlane`, `markSag`, `defLaneConvergence` and both home-prior blocks), in
    mutation AND in crossover;
  * absent ⇒ `passLeadSupportWeight()` is `0` ⇒ every displacement is exactly `±0` ⇒ the
    term vanishes EXACTLY.
* **Crossover draws ONCE**, the scalar law (`markSag`'s verbatim): from A, from B, or their
  mean. Flag-off ⇒ parent A's value is carried with NO draw.

### The consumption flag

* **`ptpPassLead`**, a new **explicit** `MatchConfig` boolean, initialised
  `cfg.ptpPassLead ?? false` (`Match.ts`) — a **hard `false`**, the `obmMovement` /
  `ctbSupportPlane` / `o2Look` form. **Never** `EDS_BUNDLE_ARMED`, never env-armed, never
  default-ON, never bundle-defaulted: **absent from `src/game/a4World.ts` entirely**, so no
  play-test world, preset or env bundle can turn it on. It gets its own `League.matchFlags`
  key so a probe world can arm it EXPLICITLY, and that key changes no default.
* ⭐ **THE ARMING CHECKLIST — THREE limbs (binding)**: armed = the `ptpPassLead` flag **+**
  the `evolvePassLeadSupport` opt-in (for evolution runs) or a probe-written gene **+** a
  non-absent gene. Even ARMED the world is unchanged while the gene is absent (G-BORN) and
  while it is AT ZERO (G-ZERO). Dosing goes through the REAL gene channel on all three
  genome views (`info.genome` / `baseGenome` / `effGenome`) of BOTH teams.
* ⭐⭐ **AND THE TWO-DOORS STATEMENT, GATED FROM BIRTH (#228):** arming `ptpPassLead`
  expresses **NOTHING but its own gene** — with the banked `offballMovementWeights` and
  `ctbSupport*` banks fully dosed and their flags shut, an armed-inert ptp world is
  byte-identical to ALL-OFF; and the neighbours armed alone are unmoved by this gene at any
  dose. Gated by **G-CROSS** (48 cells) and by two fixtures in `tests/ptpPassLead.test.ts`.
  Unlike OBM-T0, this stage carries no composition with a neighbouring bank at all — the
  seat reads ONE gene — so the matrix is a *falsification attempt*, not a repair.

### ⭐ The READ-FORK INVENTORY (a NAMED deliverable)

Exactly **ONE** `match.ptpPassLead` fork exists in `src/**`. Every consumer keys off the
nullable seat it produces, never off the flag again:

| # | site | file | what it feeds |
| --- | --- | --- | --- |
| **1** | `const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;` — THE SEAT FORK | `src/ai/PlayerBrain.ts`, `decideOnBall`'s pass block | the gene weight + the world-appropriate motion source (ONE percept pull per decision, never per candidate mate, never per tick) |

Downstream of it, and counted separately: **ONE** `LEAD_COMPUTE` (`passLeadOffset` per
candidate mate), **ONE** `AIM_COMPOSE` (`aim = mate.pos + lead`, the composition's single
owner), **THREE** `AIM_APPLY` sites (lane · open · gain — exactly the three inputs the
contract names), **TWO** `LEAD_CAPTURE` statements (the winner's own displacement), **ONE**
`STRIKE_GUARD` and **ONE** `STRIKE_LED` statement. Everything else that names the flag, the
gene, the opt-in or the seat module is a declaration, an init, the League union key, an
import or the seat module's own body — enumerated in the artifact with file:line and class,
**zero unclassified**.

**Byte-identity is arithmetic, not hope**: with the fork not taken, `ptpSeat` is `null`,
`aim` is **literally the `mate.pos` object** the shipped loop passes, `bestLeadX/Y` stay
`0`, and the led-strike statement is never reached — the incumbent
`match.performPass(p, passMate!, offsideExemptKick)` runs verbatim. That is what G-OFF /
G-BORN / G-ZERO measure rather than assert.

### The incumbent openness read is DRIVEN, not re-cut

`opennessAt(pos, opponents)` is `opennessOf`'s body verbatim with the point as the argument;
`opennessOf` is now its one-line body form. **Pure code motion, zero duplicated arithmetic,
signature and behaviour untouched** — the CTB-T0 `supportSpotDeformed` precedent.

### Untouched (restated as a prohibition)

The `MakeRun` through-ball loop — its guard, its `runBurstPoint` call, its lane read and its
chip branch — byte-identical (pinned in `src/**` by G-TRACE and in the test) · the cutback,
the cross, the lofted switch, the keeper's outlet and every incumbent pass bonus · the
`whetherEye` and the certified price table · `TeamBrain` designation and every license · the
OBM seat's and the CTB plane's own laws, genes, flags and tests · `perceptionSnapshot.ts`'s
honesty rules · `a4World.ts`'s flag set and all three play-test worlds · the render layer.

---

## §PINS — the PIN INVENTORY (contract §3, a NAMED deliverable)

Everything that pins the touched surfaces, and what happened to it. **Nothing is silently
renegotiated**; had any of these broken, the standing instruction is STOP-and-report, never
a test edit.

| # | pin | where | class | disposition |
| --- | --- | --- | --- | --- |
| 1 | ⭐⭐ **the O1 wind-up's SEAM-SINGULARITY pins** — `else match.performPass(p, passMate!, offsideExemptKick);`, the wind-up fork line, the kickoff line and the cutback line, all asserted VERBATIM | `tests/o1PassWindup.test.ts:151-178` | source text | **UNTOUCHED and GREEN — and this is what shaped the design.** The led strike could never be an extra argument on that pinned line, so it is its **own armed-only statement** beside it and the wind-up keeps precedence (§DEV 1). Re-checked in-probe as G-PINS rows against `src/**` as well as the test file |
| 2 | **the `MakeRun` through-ball surface** (guard · `runBurstPoint` call · lane read) | `src/**` (G-TRACE) + `tests/ptpPassLead.test.ts` | source text | UNTOUCHED — M-PTP.4's prohibition, machine-checked in both directions (the through-ball block contains no `ptp`/`passLead` token) |
| 3 | **the `Pass` / `ThroughBall` action-type surface** | `tests/combos.test.ts:193` | type/label | UNTOUCHED — no new action type, no label change, no `why`-string change, no render cue |
| 4 | **the banked OBM seat's 24 fixtures** | `tests/obmEyesSeat.test.ts` | mechanism | UNTOUCHED and GREEN — re-run in §CHECKS, and crossed against this seam in G-CROSS |
| 5 | **the banked CTB plane's 16 fixtures incl. its verbatim `supportSpot` signature pin** | `tests/ctbSupportPlane.test.ts` | source text + geometry | UNTOUCHED and GREEN — this stage adds nothing to `formations.ts` |
| 6 | **the perceived-chooser's own pins** (the fork this stage reads the WORLD SHAPE from) | `tests/perceivedPassChoice.test.ts` | mechanism | UNTOUCHED — the chooser is not modified; `edsPerceivedChoice` is READ as a world-shape argument and never re-forked |
| 7 | **direct `performPass` / `performThroughBall` callers in `tests/**`** | `tests/offside.test.ts:97`, `tests/magnus.test.ts:218,235` | signature | UNTOUCHED — the new `ptpLead` parameter is OPTIONAL and defaults to `null`, so every 2–3-argument call compiles and behaves identically |
| 8 | **the production fingerprint** `57b0bdab…c673` | asserted in 13 test files | league identity | UNTOUCHED — and independently recomputed as G-IDENT / G-FP |
| 9 | **the 5v6 sanity invariant** and **the goal-level shape pin** | `tests/cards.test.ts`, `tests/formations.test.ts` | full-match directional | UNTOUCHED — flag born false ⇒ byte-identical world. Re-run in the FULL suite |
| 10 | **the whole suite** | 130 pre-change test files (131 with this stage's) | everything downstream | G-SUITE runs it in full (§CHECKS). **No test file was edited by this stage**; the only `tests/**` change is the NEW `ptpPassLead.test.ts` |

## §GATES — frozen ex ante (the OBM-T0 form)

All computed IN-PROBE (#181.2); `head` / wall-clock / paths ride the UNHASHED envelope
(#197-M1) so `resultSha256` re-derives at any commit or path.

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with the gene and flag absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — all three RECOMPUTED IN-PROBE. **Semantics: this IS the sim path's RNG-stream receipt** | HARD |
| **G-FP** | the 1337 row IS the production fingerprint; `npm run fingerprint` prints it unchanged | HARD |
| **G-OFF** | per-match whole-run signature **including the rng stream state**: flag ABSENT ≡ flag FALSE, in BOTH the percept-armed and the production-shaped world, on every receipt seed. **Semantics (#194): CONFIG EQUIVALENCE only** | HARD |
| **G-BORN** | ARMED with the gene ABSENT ≡ OFF, byte for byte. **Semantics: THE ARMS DIFFER IN CODE PATH** — armed ⇒ the seat is built on every on-ball decision, the percept is pulled in a percept world, and the aim is composed per candidate mate through the live branch | HARD |
| **G-ZERO** | ARMED with the gene PRESENT at 0 ≡ OFF, byte for byte — **ARITHMETIC-EXACT**: the projection term is exactly `±0`, and the aim composition, the three re-anchored scoring inputs and the strike are IEEE-754 identities | HARD |
| **G-BITE** | ARMED at the domain corner the world DIVERGES on every receipt seed **in BOTH world shapes**, AND the aim points move as §LAW says: on sampled live decisions the led displacement equals an INDEPENDENT re-derivation exactly, points ALONG the motion (sign) with magnitude `gene·|motion|·flight·MUL`, is exactly zero for a NON-support mate, exactly zero for a STILL mate (without a branch) and exactly zero at the zero dose — **and the same law re-checked on the passes ACTUALLY CHOSEN and struck** (`performPass` wrapped, the real 5th argument recorded) | HARD |
| ⭐ **G-EPI-MOTION** | **THE HONESTY CORE, PROVED NOT ASSERTED.** On a fixture whose truth MOTION is rewritten in place without stepping (no scan moment recorded; POSITIONS untouched so `flight` is identical and only the motion source can move a projection): the PERCEPT world's projection is UNCHANGED for every body and equals the truth-derived value for NONE; the BARE world's projection FOLLOWS truth exactly for every body. PLUS the source-level pin: the ONLY member of `match` the seat module names is `perceivedSnapshot`, and no truth-scan token appears in its executable body | HARD |
| ⭐⭐ **G-CROSS** | **THE TWO-DOORS MATRIX (#228), gated from birth.** 48 cells — {`ptpPassLead` on/off} × {`obmMovement` on/off} × {`ctbSupportPlane` on/off} × {the neighbours' gene banks dosed/absent} × {this gene absent/zero/dosed} — one FULL match per cell per seed, whole-run signature incl. rng state, inside the G-DET core. 18 claims stated EX ANTE: **(A)** ptp armed with BOTH neighbour banks DOSED and its own gene inert ≡ ALL-OFF, and ptp fully dosed is *unchanged* by those banks; **(B)** each neighbour armed alone is unmoved by this gene at any dose; **(C)** the DISCRIMINATION rows — this seam dosed must DIFFER from each neighbour armed on its own bank, and an armed-inert ptp world must differ from them too; plus DORMANT-ALL and three non-vacuity BITE rows | HARD |
| **G-RNG** | the seam draws **zero** rng (an armed, dosed seat built and applied over every outfielder against every mate on a stepped fixture leaves the match rng state EXACT), and the opt-in's draws sit strictly after every existing draw: 8 generations of the shipped mutate+crossover with the opt-in OFF reproduce a faithful PRE-GENE re-implementation's genomes AND final rng state exactly, the gene stays absent, the opt-in path is shown live, **and the OBM/CTB opt-ins' OWN values are unmoved in mutation AND in crossover** | HARD |
| **G-HYGIENE** | `ptpPassLead` and the gene are absent from `a4World.ts` **entirely**; initialised `cfg.ptpPassLead ?? false`; gene absent from `GENE_KEYS`; a fresh Match and a League match are both OFF; no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` anywhere on a seam line | HARD |
| **G-FORK** | ⭐ the READ-FORK INVENTORY: **exactly ONE** `match.ptpPassLead` fork in `src/**`, at the named site, feeding exactly one lead computation, one aim composition, **three** aim-priced scoring inputs, one lead capture pair and **one** led-strike statement; every other `src/**` occurrence enumerated with file:line and class, **zero unclassified** | HARD |
| **G-TRACE** | both projection constants matched **VERBATIM** at the lines they are taken from (the through-ball loop's `/ 18`; `runBurstPoint`'s `* 1.6`), the seat's own declarations matched verbatim, **M-PTP.4 asserted in source form** (the MakeRun guard and the burst call untouched), the incumbent strike-time lead untouched, and the gene domain checked at both ends and at absence | HARD |
| **G-PINS** | the §PINS inventory's machine-checkable rows recomputed, **including the O1 wind-up's four verbatim pins in both the test file and `src/**`** | HARD |
| **G-SEED** | seed-block disjointness proved in-probe for **all three** intervals this stage consumes, against the COMPLETE consumed ledger **incl. OBM-T1's four blocks** (smoke 12,424,026–037 · dose-read 040 · guard 050–099 · battery+reserve 100–727) | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests | HARD |
| **G-SUITE** | FULL `npm test` green + `tsc --noEmit` clean. (The two known wall-clock flakes are pre-existing, #196.2 — if they red they are reproduced on the PRE-change tree) | HARD |
| **REPORTED (a)** | the forced-dose smoke: led passes actually CHOSEN and AIMED, descriptive counts in both world shapes. No control, no CI, **no ANSWER** | REPORTED |
| **REPORTED (b)** | the seat's wall-clock cost, stated honestly. **Measured, not assumed** | REPORTED |

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any src diff outside
the seam path, any rng draw appearing on the dormant path, any predicate appearing anywhere,
or **any existing test breaking** (a STOP-and-report, never a test edit).

No bootstrap is used anywhere in this stage, so the ≥104,800 stats base does not apply —
every number here is an identity, a count, a geometric quantity or a wall-clock read off a
deterministic run.

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| everything consumed through OBM-T1 | see the probe's `CONSUMED` table (inherited in full, extended with OBM-T1's four blocks and OBM-T0's test seeds) | prior |
| **PTP-T0 receipts (this stage)** | **12,425,000 – 12,425,023** (24 seeds × 8 arms; ⭐ the 48-cell G-CROSS matrix re-uses the FIRST 4 of these same seeds — **no new block**) + **12,425,024** (the aim-geometry + G-EPI-MOTION + chosen-pass smoke read) | **CONSUMED here** |
| **PTP-T0 REPORTED cost read** | **12,425,025** | **CONSUMED here** |
| PTP-T0 test-file seeds (not a battery) | 12,425,900 – 12,425,906 | consumed here |
| free above | 12,425,026 – 12,425,899 and 12,425,907 + | available to PTP-T1 |

Disjointness is computed **in-probe** (`gates.seedDisjoint`) for all three intervals
separately, not asserted here.

## §ROAD B — nothing ships

The gene is **BORN ABSENT** in every genome; `ptpPassLead` is **OFF in every production
path** — a hard `false` default, absent from `a4World.ts` and from all three play-test
worlds, absent from every League's `matchFlags` unless a probe sets it explicitly — and even
ARMED it does nothing while the gene is absent (G-BORN) and nothing while it is at zero
(G-ZERO). The production fingerprint is unchanged, the flag-off world is byte-identical on
three league seeds and on every receipt match seed with the rng stream included, and an
opted-out evolution run draws zero extra rng. **Nothing about the game the user plays
changes in this commit.** The seam exists so PTP-T1 can force it.

## §NON-CLAIMS

PTP-T0 claims **no** football effect: not on TRUE-holdable supply, not on
pressed-first-reception, not on the #218 constructed/scramble shares, not on interceptions,
offside, spacing, goals, the equilibrium band or watchability. The REPORTED smoke is an
uncontrolled descriptive reading and adjudicates nothing — **F-PTP-a** (the combined cell
moves nothing) and **F-PTP-b/c** (the inherited guard/pathology STOPs, the interception
economy above all) are all **PTP-T1's** to fire. It does not claim the frozen constants are
the RIGHT constants — only that they are traced to their source lines, frozen before sight,
and unre-cut. It does not claim the projection is a COMPLETE account of anticipation (the
give-and-go's finer rhythm stays emergent-or-absent, contract §7(c)), nor that the percept
world's remembered motion is GOOD information — only that it is HIS information. It changes
**no** TeamBrain assignment or licence, **no** receiver-side behaviour, **no** price table,
and adds no per-body gene, no attribute, no new action type, no render cue. It cannot
authorize PTP-T1; only the commander can.

---

## §RESULT — the gates run

*(filled in from the committed artifact after the receipts ran; every number here is quoted
FROM `docs/world-model/data/ptp-t0-pass-lead.json`, which is recomputed by
`npx tsx scripts/probes/ptp-t0-pass-lead.ts` — the doc never carries evidence the artifact
does not.)*

Tests: [`../../tests/ptpPassLead.test.ts`](../../tests/ptpPassLead.test.ts) — **23 pins**
(23 `it()` blocks). Receipts:
[`../../scripts/probes/ptp-t0-pass-lead.ts`](../../scripts/probes/ptp-t0-pass-lead.ts),
artifact [`data/ptp-t0-pass-lead.json`](data/ptp-t0-pass-lead.json).
**24 seeds × 8 arms (absent · off · plain · plainOff · bornArmed · zeroArmed · forced ·
plainForced) = 192 full matches per core run, PLUS ⭐⭐ the 48-cell TWO-DOORS crossing on the
first 4 receipt seeds = 192 more full matches per core run, and the core runs TWICE (G-DET,
byte-identical digests), plus 3 league-seed 2-season identity runs, the aim-geometry read in
both world shapes, the G-EPI-MOTION divergence fixture in both world shapes, the two chosen-
pass smokes and the seam rng fixture on seed 12,425,024, the 8-generation evolution-rng
comparison, the `src/**` fork scan, and 9 timed matches for the cost reading on seed
12,425,025.** Verdict: **GATES PASS** (`gates.allPass === true`), probe exit 0. Wall ≈ 108 s
(CONTEXT ONLY — used in no rate).

* **G-DET digest** — `gates.gDet.digestA === digestB ===`
  `d0e74c12dbc977f8799ab0d010118f0f6693c701c4a2645abb33535350e286f2`
* **resultSha256** `acc76c5b440a90b7b7f418defe082aa706e54bccdb333036dc1b70e7e17c91e1`
  (recomputable: `npx tsx scripts/probes/ptp-t0-pass-lead.ts`). ⭐ Per #197-M1 the hashed
  body is **commit-free, timing-free and path-free** — `headContextOnly`,
  `wallMsContextOnly` and `artifactPathContextOnly` ride the envelope, OUTSIDE the hash.
  ⚠ Stated exactly: the REPORTED **wall-clock numbers are also outside the hash**; every
  GATE input is inside it. The substitution is declared in the artifact's own `hashNote`.
* **Files touched** — the authoritative list is `git show <this commit> --stat`; no
  completeness claim is made here from a `git diff --stat` (the #194 L3 lesson).

### Gate table

| gate | verdict | evidence (all recomputed in-probe, #181.2) |
| --- | --- | --- |
| **G-IDENT** | ✅ PASS | all three league hashes IDENTICAL to the frozen pre-change baselines: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26` — `gates.gIdent.rows` |
| **G-FP** | ✅ PASS | the 1337 row IS the production fingerprint (`gates.xFpProd`); `npm run fingerprint` re-derives `57b0bdab…c673` unchanged (§CHECKS) |
| **G-OFF** | ✅ PASS | 24/24 seeds: flag ABSENT ≡ flag FALSE in the percept-armed AND the production-shaped world (`identical` ∧ `plainIdentical`), whole-match signature including the rng stream state. **CONFIG EQUIVALENCE ONLY** |
| **G-BORN** | ✅ PASS | 24/24: ARMED with the gene ABSENT ≡ OFF, byte for byte — through a LIVE branch that builds the seat on every on-ball decision and pulls this body's percept |
| **G-ZERO** | ✅ PASS | 24/24: ARMED with the gene PRESENT at 0 ≡ OFF, byte for byte. The projection term is **exactly `+0`** and the aim composition an IEEE-754 identity |
| **G-BITE** | ✅ PASS | **24/24 forced arms diverge** in the percept world **and 24/24 in the bare world**. Aim geometry, seed 12,425,024: **1,109 support samples (percept) and 608 (bare), 0 violations across all five law checks** (`arithmetic` · `direction` · `nonSupportNonZero` · `stillNonZero` · `zeroDoseNonZero`), and on the passes ACTUALLY CHOSEN **0 sign and 0 magnitude violations** in both world shapes — see the tables below |
| ⭐ **G-EPI-MOTION** | ✅ PASS | **percept world: 4/4 projections unchanged by the truth rewrite (they read his own eyes), 0/4 match the truth, 4/4 truth-vs-percept pairs genuinely differ** (mean remembered age 8 ticks). **bare world: 12/12 projections FOLLOW truth exactly** — the frozen law's other half. Source pin: `gates.gEpiMotion.moduleMatchMembers === ['perceivedSnapshot']`, `moduleBannedHits === []` |
| ⭐⭐ **G-CROSS** | ✅ PASS | **18/18 claims held, 4/4 seeds each**, over 48 cells × 4 seeds = 192 full matches per core run. ⭐ `A-PTP-ALONE-INERT` (both neighbour banks DOSED, this gene absent **and** zero) ≡ ALL-OFF; ⭐ `A-OTHER-GENES-INVISIBLE` — this seat fully live and fully dosed is *unchanged* by the neighbours' banks; ⭐ `B-OBM/CTB-UNTOUCHED-BY-LEAD` at all three gene states; ⭐ three DISCRIMINATION rows and three non-vacuity BITE rows. **The whole crossing collapses onto exactly EIGHT distinct worlds** — see the table below |
| **G-RNG** | ✅ PASS | (a) the seam: an ARMED, DOSED seat over every outfielder against every mate on a 400-tick fixture leaves the match rng state EXACT — **4179509926 → 4179509926**, 50 projections. (b) evolution, 8 generations, opt-in OFF: genomes identical to the pre-gene re-implementation, the gene stayed absent, final rng state matches exactly; `optInDraws: true`, **`obmStreamUnmoved: true`** and **`crossoverOrderHeld: true`** |
| **G-HYGIENE** | ✅ PASS | `cfg.ptpPassLead ?? false`; the flag AND the gene absent from `a4World.ts` entirely; gene absent from `GENE_KEYS`; `randomGenome` never creates or serializes it; a fresh Match and a League match are both OFF; no env door on any seam line of the 7 seam files |
| **G-FORK** | ✅ PASS | **exactly 1 flag fork, 3 aim-priced inputs, 1 led-strike statement**, at the named sites; **50 src occurrences total, ZERO unclassified** (kinds: `FLAG_FORK` · `LEAD_COMPUTE` · `AIM_COMPOSE` · `AIM_APPLY_LANE/OPEN/GAIN` · `LEAD_CAPTURE` · `LEAD_NEUTRAL` · `STRIKE_GUARD` · `STRIKE_LED` · `STRIKE_MACHINERY` · `SEAT_DECL` · `SEAT_BODY` · `GENE_DECL` · `GENE_RW` · `OPTIN_DECL` · `OPTIN_RW` · `CONFIG` · `FIELD` · `INIT` · `UNION_KEY` · `IMPORT`) |
| **G-TRACE** | ✅ PASS | all 8 source lines matched VERBATIM — the through-ball loop's `const flight = dist(p.pos, mate.pos) / 18;`, `runBurstPoint`'s `* 1.6` return, both seat declarations, **the MakeRun guard and the burst call (M-PTP.4)**, the incumbent `struckLead` line and `opennessOf`'s new one-line body — and the identities hold: `PTP_FLIGHT_SPEED === 18`, `PTP_LEAD_FLIGHT_MUL === 1.6`, the gene map clamps at both ends and returns 0 when absent |
| **G-PINS** | ✅ PASS | **10/10 named pins present**, including the O1 wind-up's verbatim strike statement in BOTH the test file and `src/**` (`srcVerbatim: true`). Nothing renegotiated |
| **G-SEED** | ✅ PASS | 12,425,000–024 · 12,425,025 · 12,425,900–906, **zero collisions** with the 34 consumed blocks (`gates.seedDisjoint.collisions === []`) |
| **G-DET** | ✅ PASS | two invocations of the core, identical digests (above) |
| **G-SUITE** | ✅ PASS (with the pre-existing flake disclosed) | see §CHECKS |

### ⭐⭐ G-CROSS — the two-doors table (seed 12,425,000, sha-12 per cell)

**48 cells collapse onto exactly EIGHT distinct worlds, and each is reached by exactly the
doors that should reach it.** (`others1` = the banked `offballMovementWeights` and
`ctbSupport*` banks dosed at their own domain corners.) Reproduced identically on all 4
crossing seeds; full table in `gates.gCross.table`.

| cell family | sha-12 | which world |
| --- | --- | --- |
| every cell with `others0` and `lead-{absent,zero}` (16 cells) | `146f97adad0e` | **INCUMBENT** — nothing banked, nothing to read |
| ⭐ `ptp1·obm0·ctb0·others1·lead-{absent,zero}` (2 cells) | `146f97adad0e` | ⭐ **INCUMBENT** — this seat ARMED, BOTH neighbour banks FULL, and **nothing happens** (claim A) |
| `ptp{0,1}·obm0·ctb1·others1·lead-{absent,zero}` (4 cells) | `f8d6dcfc2bca` | **CTB STATIC PLANE ALONE** — unmoved by this gene (claim B) |
| `ptp{0,1}·obm1·ctb0·others1·lead-{absent,zero}` (4 cells) | `8b61f740a954` | **OBM SEAT ALONE** — unmoved by this gene (claim B) |
| `ptp{0,1}·obm1·ctb1·others1·lead-{absent,zero}` (4 cells) | `815a4907aa0d` | both neighbours armed — still unmoved by this gene |
| ⭐ `ptp1·…·others{0,1}·lead-dosed` with both neighbour doors shut (6 cells) | `2a60b94c0e02` | ⭐ **THE PASS LEAD ALONE** — and the neighbours' banks make **no difference to it** (claim A′) |
| `ptp1·obm0·ctb1·others1·lead-dosed` (1 cell) | `c4ca1b7c253c` | lead + the CTB plane |
| `ptp1·obm1·ctb0·others1·lead-dosed` (1 cell) | `5c0fbc20c5f1` | lead + the OBM seat |
| `ptp1·obm1·ctb1·others1·lead-dosed` (1 cell) | `80ac2f12a380` | **all three** — the cell PTP-T1's combined arm lives in |

⭐ **The falsifiers, in one line each:** `2a60b94c0e02 ≠ 8b61f740a954 ≠ f8d6dcfc2bca` (the
three seams are distinguishable), and `ptp1·obm0·ctb0·others1·lead-zero === 146f97adad0e`
(an armed-inert door spends no neighbour's bank).

### G-BITE — the aim geometry (seed 12,425,024)

| quantity | percept world | bare world |
| --- | --- | --- |
| samples (carrier × mate) / of which SUPPORT-mode | 2,095 / **1,109** | 1,335 / **608** |
| samples the lead MOVED the aim | **188** | **518** |
| samples with EXACTLY ZERO motion ⇒ to feet | **921** | **90** |
| mean led displacement (max) | **0.78 m** (13.71 m) | **2.54 m** (18.79 m) |
| mean flight / mean motion speed | 0.541 s / **0.717 m/s** | 0.545 s / **2.513 m/s** |
| law violations (5 checks) | **0 / 0 / 0 / 0 / 0** | **0 / 0 / 0 / 0 / 0** |

⭐ **Read exactly, because this is the stage's most informative number.** The percept world's
mean motion speed is **0.717 m/s against the bare world's 2.513**, and **921 of 1,109**
support samples project EXACTLY ZERO there. That is the HONEST LIMIT of §HONESTY 1 in
numbers: a carrier leads only the mates his own eyes have a remembered velocity for, and a
remembered velocity is often absent or old. It is **not** evidence that the mechanism is
weak — it is evidence that the percept channel is thin, which is exactly the kind of fact
this programme wants measured rather than assumed, and which PTP-T1 must budget for when it
chooses its exam world.

### REPORTED — the chosen-pass smoke (ONE forced match per world shape, seed 12,425,024)

`performPass` is wrapped on the instance so the **actual 5th argument** — the aim the ball
was really struck at — is recorded for every chosen pass.

| quantity | percept world | bare world |
| --- | --- | --- |
| passes chosen | 106 | 89 |
| of which struck at a LED point | **23 (21.7 %)** | **56 (62.9 %)** |
| passes to a support-mode target | 53 | 57 |
| mean led displacement (max) | **5.36 m** (12.67 m) | **5.54 m** (18.75 m) |
| lead as a share of the pass distance | **0.414** | **0.400** |
| sign / magnitude violations | **0 / 0** | **0 / 0** |

**What this is and is not.** It is a reading that led passes are genuinely CHOSEN and
STRUCK at scale, that the aim obeys the frozen law on those real choices, and that to-feet
passes still happen in the same match (no predicate forced a lead). It is **ONE match per
world shape at ONE dose**, with **no control arm, no CI and no dose curve**; it says nothing
about whether any of it helps. The 18.75 m maximum in the bare world is the no-cap decision
(§LAW 3) visible in the data — a corner PTP-T1's guards must watch, not a defect T0 hides.

### ⭐ REPORTED — the seat's cost (seed 12,425,025)

Wall-clock, one full match per arm in a **percept-armed** world, minimum of 3 repeats,
15,042 ticks per match:

| arm | min wall | ms / tick | overhead vs OFF |
| --- | --- | --- | --- |
| **off** | **88 ms** | 0.005964 | — |
| **armed, gene 0** | **87 ms** | 0.005896 | **−1.1 %** |
| **armed, dosed** | **91 ms** | 0.006050 | **+3.4 %** |

**Stated honestly.** This is a wall-clock on a shared machine; it is used in no rate and
bounds nothing. The armed-zero arm measuring *below* OFF is noise at this precision — read
the three rows as *"the seat costs a few percent at most"*. The reason it is so much cheaper
than the OBM seat's ~40 % is structural and worth recording: this seat pulls **one percept
per on-ball decision of the ONE carrier**, where the OBM seat pulls one per **off-ball
decision of every body**.

### §CHECKS

```text
$ npx tsc --noEmit
tsc clean

$ npx vitest run tests/ptpPassLead.test.ts
 Test Files  1 passed (1)
      Tests  23 passed (23)

$ npm run fingerprint
seed=1337 seasons=2 matches=142
sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673

$ npx tsx scripts/probes/ptp-t0-pass-lead.ts        (exit 0)
GATES PASS — artifact docs/world-model/data/ptp-t0-pass-lead.json

$ npm test          (vitest run, THIS tree)
 Test Files  1 failed | 130 passed (131)
      Tests  1 failed | 1268 passed (1269)
   Duration  269.05s
 FAIL tests/formationEvolution.test.ts > league-level style ecology > ten seasons: …
                                                        Error: Test timed out in 180000ms.

$ npx vitest run tests/formationEvolution.test.ts          (same tree, ISOLATED)
 ✓ league-level style ecology > ten seasons: …  146361ms   (budget 180000ms)
 Test Files  1 passed (1)
      Tests  3 passed (3)
```

**G-SUITE, stated exactly.** ONE file red on the full-suite run, a pure **wall-clock
TIMEOUT, not an assertion** — the #196.2 flake family, the SAME file and the SAME message
OBM-T0 recorded and reproduced on ITS pre-change tree. Isolated on this tree it passes in
**146.4 s** against the 180 s budget, so the mechanism is parallel-load contention. ⚠
Stated exactly, so no reader over-reads it: **this round did NOT re-run the stash-out
pre-change comparison** — the evidence offered is (i) the identical file/message/timeout
signature already banked at OBM-T0, (ii) the isolated pass here, and (iii) the structural
fact that this stage's flag is `false` in that test's world, which G-IDENT / G-OFF /
G-BORN / G-ZERO prove byte-identical. Every other test — **1,268 of 1,269**, the banked OBM
seat's 24 and the CTB plane's 16 included — is green.

### Deviations recorded

1. ⭐ **The led strike is its OWN statement, not a fifth argument on the pinned one.**
   `tests/o1PassWindup.test.ts` asserts `else match.performPass(p, passMate!,
   offsideExemptKick);` VERBATIM; adding an argument there would have reddened a banked pin,
   which is a STOP for that design and never a test edit. So the seam adds a separate
   armed-only `else if` branch and leaves the incumbent statement byte-identical — the
   OBM-T0 §DEV 2 precedent (a second entry point rather than a fifth parameter). The O1
   wind-up keeps PRECEDENCE over it, so with both dormant seams armed the strike resolves
   through the wind-up's own aim; declared in §HONESTY 6 rather than discovered later.
2. **The gene's projection is ADDITIVE on the incumbent strike-time lead**, not a
   replacement for it. `performPass`'s `mate.vel · flight · 0.8` is the passer's own body
   knowledge and stays; the priced displacement rides on top. Recorded because it is a
   choice: replacing it would have made the chooser's aim and the strike's aim identical at
   the cost of touching a line the whole pass economy sits on.
3. **`opennessAt` was extracted from `opennessOf`** (pure code motion, identical loop and
   order) so a pass can be priced at the point it is AIMED at rather than only at a body.
   `opennessOf` is now its one-line body form; no caller changed.
4. **Exactly THREE scoring inputs move to the aim** — lane, open and gain, the three the
   contract names. `d`, the offside read, the misalignment term and every bonus stay
   anchored to the BODY, each for a stated reason (§LAW's block). Declared, not smuggled.
5. **NO CAP** (§LAW 3), and the 18.75 m maximum lead the smoke observed is the honest
   consequence, reported rather than clipped after sight.
6. **The percept world's motion channel is THIN** (0.72 m/s mean, 83 % exactly-zero
   projections). Discovered by the receipts, recorded as a measured fact about the trunk —
   **not** repaired by widening the seat's information, which would have broken the honesty
   rule this stage exists to prove.
7. **The two-doors matrix is a FALSIFICATION ATTEMPT, not a repair.** This seat composes
   with no neighbouring bank at all (it reads one gene), so G-CROSS could have been argued
   unnecessary. It is run in full anyway: #228's lesson is that the argument "it cannot
   leak" is exactly what the previous stage believed.
8. **No bootstrap, no CI anywhere in this stage** — every number is an identity, a count, a
   deterministic geometric quantity or a disclosed wall-clock.

### Disposition

The seam is BUILT and DORMANT: the gene is born absent and outside `GENE_KEYS`, the
consumption flag is a hard `false` absent from every bundle, the production fingerprint is
unchanged, flag-off byte-identity holds on three league seeds and 24 match seeds with the
rng stream included, an ARMED world is byte-identical to OFF with the gene ABSENT and with
it AT ZERO *through the live branch and through a live percept pull*, ⭐ arming this door is
proved to express NOTHING but its own gene across the full 48-cell crossing of all three
movement-family doors, the seam draws zero rng and an opted-out evolution run draws zero
extra, exactly one read fork exists in `src/**`, both projection constants are traced to the
lines they were taken from and matched verbatim, the `MakeRun` through-ball path and every
banked pin — the O1 wind-up's strike statement above all — are untouched and green, and
under force the aim points move exactly as §LAW says with zero violations across five checks
on 1,717 sampled projections and on 79 passes actually chosen and struck. **The motion
channel is honest, and that is proved rather than promised**: where the chooser reads
percepts the projection follows his remembered velocity and never the truth, and where it
reads truth it follows truth — one inference form per world shape, both halves gated. There
is **no predicate anywhere** (#200). **Nothing ships.** PTP-T0 cannot authorize PTP-T1 — the
FULL-CHANNEL EXAM is the commander's call.
