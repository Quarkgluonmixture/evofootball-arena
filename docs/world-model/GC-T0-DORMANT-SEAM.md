# GC T0 — THE GROUND-CORRIDOR DORMANT SEAM (`bkGroundCorridor`, 传球要为它撞到的身体买单)

Status: **PRE-REGISTERED, then BUILT + RUN the same round** (the DV-T0 / DF-T0 two-part
form). The law, the seam, the read-fork inventory, the seam map, the pin inventory and the
Road B statement below were written **before** the receipts ran; the measured digests
arrive only in [§RESULTS](#results--the-receipts) at the foot.

> **Ordered by** COMMANDER RULING **#343 item 4** (the dispatch; the arc opened at #343
> item 2). **Bound by** [`GC-GROUND-CORRIDOR-CONTRACT.md`](GC-GROUND-CORRIDOR-CONTRACT.md)
> §2 — **M-GC.1** (THE SEAT: the ONE hoisted `groundCandidate` pricer; the price is the
> LAST subtraction, beside DV's), **M-GC.2** (THE FORM: *"the census's own discriminator,
> translated, nothing invented"*) and **M-GC.3** (THE FLAG: new, additive, dormant, default
> `false`, never env-armed, never bundle-defaulted; pin suite from birth).
> **Design facts of record**: [`BK-C2-CAROM-CENSUS.md`](BK-C2-CAROM-CENSUS.md) §P.4 (the
> predicate this stage translates) and #342 item 2 (i)–(vi).
> **The user's word this exists for**: 「但是弹身体感觉很影响比赛」 (#341).
> **Road B**: nothing ships. `bkGroundCorridor` is default OFF and — unlike every prior
> corridor flag — is **named by NO world and NO preset at all**.

---

## §CORRECTIONS-READ — every canon sentence COPIED from [`CANON.md`](CANON.md), never re-typed

Per ruling #301 item 2's mechanism fix: the ledger is where a brief copies from. ⚠ Per
**#342 item 3** (the MED-1 lesson), a constraint that binds this executor beyond the
ruling's own sentences is cited as **"the dispatch brief"**, never as the ruling.

| canon, verbatim | its home | how it binds here |
| --- | --- | --- |
| *"a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's site"* | **PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1** | [§SEAM MAP](#seam-map--every-occurrence-counted-and-sited) counts both needles in every `src/**` file and names every site; the counts are re-asserted inside the pin suite, so the map cannot drift from the code |
| *"a src-extracted constant pins its extraction to the NAMED call site — anchored match + line receipt — never first-occurrence"* | **BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1** | the shell is anchored to the contact law's own line `      const shell = p.coreRadius + ball.radius;` in `src/sim/Match.ts`, matched EXACTLY ONCE by the pin suite; this stage introduces **no constant of its own at all** |
| pin suites from birth — no one-shot-probe-only seams; every src seam ships its permanent pin suite (paraphrase) | **ruling #297 item 7** | `tests/gcGroundCorridor.test.ts` lands in the SAME commit as the seam (21 pins) |
| *"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines #270's E4 correction; matches the perf diagnostic)"* | **ruling #283.2(iv)** | the flag gets a `League.matchFlags` key so a probe world can arm it, and the pin suite proves the key never reaches `League.toJSON()` |
| *"verifier scratch walks use the stage's own consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"* | **PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6** | ⭐ EVERY walk in this stage — receipts and pin suite alike — uses seeds **900,000,100–102**. **ZERO frontier consumption**: next sim stays ≥ 12,524,000, next stats ≥ 117,600, registry 73 |
| *"arming receipts, not football findings"* (receipts ≠ effect sizes) | **ruling #289 item 1** (+ BU-T1 §CORR item 5) | every number in §RESULTS is a digest or a count. **No football claim is made anywhere in this document.** H-GC.1 is GC-T1's business |
| *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"* | **PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4** | every digest below is quoted at full 64 hex characters from the run that produced it, and the method that reproduces it is stated beside it |
| a build/measurement of record runs on a CLEAN tree at a named commit (paraphrase) | **PC-ENTRY-RUNG.md §COMMANDER CORRECTIONS item 4** | the G-OFF baseline was walked on the CLEAN tree at the dispatch commit **`c758b07`** BEFORE a byte of this stage existed, and re-walked on the finished tree; see §R1 |

---

## §P0 WHAT THIS STAGE IS, AND IS NOT

It is a **dormant `src` seam plus its permanent pin suite plus arming RECEIPTS**. It makes
**no football claim**: not that caroms fall, not that the ground game survives the price,
not that teammates stop being hit. Those are **H-GC.1**'s conjuncts (contract §3), scored
by GC-T1 on virgin seeds at a frozen §P. What lands here is the machinery, proven inert.

**⛔ WHAT IS NOT TOUCHED** (restated as a prohibition): the dormant DV ground exposure limb
(`deliveryRiskPrice` → `flightExposure`) is **byte-untouched** — #343 item 3's resolution
of record, so its exams re-derive; the incumbent `lane` term stays (it prices
interception-openness, a different real thing); the lofted family's price
(`bkCorridorPriceLed` / `bkCorridorPriceOf`) is untouched and **not double-charged**; no
launch parameterization, no arc, no strike statement, no render cue, no `why` string, no
new gene, no new constant, no new perception channel; `a4World.ts` is not edited at all.

---

## §LAW — the frozen law of the ground-corridor price

```text
THE GROUND-CORRIDOR PRICE (M-GC.1 + M-GC.2), for EVERY candidate the shared ground pricer prices
  armed  ⇔  match.bkGroundCorridor === true
            AND deliveryValueSeatOf(g) !== null
                (i.e. g.dvExposureWeight !== undefined OR g.dvLossBelief !== undefined —
                 the SAME accessor, the SAME arming rule the lofted bk seat uses)

THE HAZARD — BK-C2 §P.4's shell predicate, translated (M-GC.2)
  groundShellHazard(from, aim, players, kickerGid, receiverGid) = 1  iff  SOME body o, over
  ALL of `players` (BOTH TEAMS), satisfies EVERY one of:

    o.sentOff === false
    o.gid !== kickerGid                                   [he is not on his own line]
    o.gid !== receiverGid                                 [BK-C1 §4(ii)'s ARRIVING RULE]
    cp   = closestPointOnSegment(from, aim, o.pos)
    dist(cp, o.pos)  <  shell,      shell = o.coreRadius + BALL_RADIUS
    dist(from, cp)   <  d − shell,  d = dist(from, aim)   [SHORT OF THE TARGET]

  otherwise 0.  Range {0, 1} — a BINARY discriminator, never graded.

THE COMPOSITION (M-GC.1), the LAST statement of the ONE hoisted `groundCandidate`
  s″ = s′ − dvExposureWeight · groundShellHazard(p.pos, aim, [team.players, opp.players],
                                                 p.gid, mate.gid)

  where s′ is the DV limb's own output (`sDv`) — so the two subtractions COMPOSE at one
  seat, in one currency, on one gene, and neither is a second scoring path.

THE ZERO-POINT OF THE WORLD, TWO forms, gated separately
  GENE ABSENT  ⇒ no seat ⇒ the pricer never computes a hazard and never subtracts
                 (G-BORN — STRUCTURAL).
  GENE AT ZERO ⇒ the seat exists, the hazard IS computed on every priced candidate and the
                 subtraction IS performed — and `0 · h` is exactly `+0` for h ∈ {0,1}, and
                 `s − (+0) === s` for every finite s. Byte-identical with the path LIVE
                 (G-ZERO — ARITHMETIC, MEASURED not assumed).

NO PREDICATES (#200) — the complete conditional set is GATE and GUARD, and nothing else
  GATE   the arming rule (the ONE flag fork + "is a DV gene present").
  GUARD  `sentOff`, the KICKER exclusion and the RECEIVER exclusion — all three the
         census's own, none invented here.
  ⛔ THE SHELL AND THE SHORT-OF-TARGET TESTS ARE THE PREDICATE ITSELF, not gates on whether
     an action happens: a blocked line still COMPETES, at a price, in the same argmax.
```

### ⭐ THE CENSUS-TO-CODE TRANSLATION TABLE (M-GC.2's *"nothing invented"*, clause by clause)

`scripts/probes/bk-c2-carom-census.ts`'s `strikeBodies()` + `shellRead()` are the reference
implementation; `src/ai/deliveryValueSeat.ts`'s `groundShellHazard` is the translation.

| # | BK-C2 §P.4 clause (census) | census code (`bk-c2-carom-census.ts`) | GC-T0 code (`deliveryValueSeat.ts`) | identical? |
| --- | --- | --- | --- | --- |
| 1 | *"every body on the pitch … **both sides**"* | `for (const p of m.allPlayers)` | `for (const side of players) for (const o of side)`, called with `[team.players, opp.players]` | ✅ same body set, reached through the CALLER's own collections instead of `Match` (M-GC.3: no new channel) |
| 2 | *"(i) not `sentOff`"* | `if (p.sentOff) continue;` | `if (o.sentOff) continue;` | ✅ verbatim |
| 3 | *"except the kicker himself"* | `if (p.gid === kicker.gid) continue;` | `if (o.gid === kickerGid) continue;` | ✅ verbatim |
| 4 | ⭐⭐ *"THE INTENDED RECEIVER IS NAMED OUT"* (BK-C1 §4(ii)'s arriving rule) | `if (p.gid === targetGid) continue;` | `if (o.gid === receiverGid) continue;` | ✅ verbatim |
| 5 | the closest point of the segment to him | `closestPointOnSegment(from, aim, o.pos)` | `closestPointOnSegment(from as V2, aim as V2, o.pos)` | ✅ same exported helper |
| 6 | *"the shell is the contact law's own (`const shell = p.coreRadius + ball.radius;`)"* | `const shell = o.coreRadius + BALL_RADIUS;` | `const shell = o.coreRadius + BALL_RADIUS;` | ✅ verbatim |
| 7 | *"a body is on the line when the closest point of the segment to him is inside his shell"* | `perp < shell` | `dist(cp, o.pos) < shell` | ✅ same expression (`perp` IS `dist(cp, o.pos)`) |
| 8 | *"**short of the target**, i.e. `along < d − shell`"* | `dist(from, cp) < d - shell` | `dist(from as V2, cp) < d - shell` | ✅ verbatim |
| 9 | *"NO 1.5 m guard is applied here"* | (absent; `DV_CLEAR_RADIUS` used only for the SEPARATE `blockedOutsideGuard` face) | (absent) | ✅ the guard is not present |
| 10 | the reading is the BLOCKED predicate, `boolean` | `let blocked = false; … blocked = true;` | `return 1;` … `return 0;` | ✅ same truth value, expressed as {0,1} so it can be priced (early return ≡ the census's full-loop OR) |
| 11 | ⛔ *cooldown-at-choice* (the census's `cooling` body set) | `if (coolingOnly && !(…kickCooldown > 0 …)) continue;` | **DELIBERATELY ABSENT** | ⚠ **THE ONE CENSUS OPTION NOT TRANSLATED** — and by order: #343 item 2's design fact (iii), *"the ground hazard must be GEOMETRIC … NEVER cooldown-gated"*. The census published `all` and `cooling` as an upper and a lower bound; **the price uses `all`** |
| 12 | ⛔ the census's OTHER read, `flightExposure(kicker.pos, aim, strikeBodies)` | the graded hazard, published beside the predicate | **NOT WIRED** | ⚠ the contract §4 names a graded refinement a **held door**, not this slice's; the binary predicate is what §P.4's disjoint intervals measured |

**Row 11 and row 12 are the only two places this stage exercises judgement, and both are
ORDERED rather than chosen** — 11 by ruling #343 item 2 (iii), 12 by the contract's §4
non-claim. Everything else is a transcription.

---

## §SEAM — the mechanism (all of it dormant)

### The flag

**`bkGroundCorridor`**, a new **explicit** `MatchConfig` boolean, initialised
`cfg.bkGroundCorridor ?? false` (`Match.ts`) — the `dvDeliveryValue` / `bkCorridorPrice`
form. **Never** `EDS_BUNDLE_ARMED`, never env-armed, never default-ON, never
bundle-defaulted. It gets a `League.matchFlags` key so a probe world can arm it explicitly,
and that key changes no default.

⭐⭐ **AND IT IS ARMED BY NOTHING.** Unlike `bkCorridorPrice` (which world 11 arms) and
`dfAssignPersist` (which world 10 arms), **`a4World.ts` does not contain the string at
all**, at any version, and no preset reaches it. `a4MatchFlags(v)` carries no such key for
v ∈ {6,7,8,9,10,11}. Both docblocks in `Match.ts` say so in those words. The entry rung is
**GC-T1's business** (contract §3), and this stage does not anticipate it.

⭐ **THE ARMING CHECKLIST — TWO limbs (binding)**: armed = the flag **+** a non-absent DV
gene. Even ARMED the world is unchanged while the gene is absent (G-BORN) **and** while it
is present at zero (G-ZERO).

### The gene — **there is no new gene**

`dvExposureWeight`, born absent, outside `GENE_KEYS`, read through the SAME
`deliveryValueSeatOf(g)` accessor the lofted `bkSeat` uses. **One knob prices the whole
corridor family** (#343 item 3: *"one currency — world 11's 0.5 pin prices the whole
corridor family"*). No opt-in, no draw, no crossover law and no serialization changes in
this stage; `genome.ts` is untouched.

### ⭐ The READ-FORK INVENTORY (a NAMED deliverable)

Exactly **ONE** `match.bkGroundCorridor` fork in `src/**`. Every consumer keys off the
nullable seat it produces, never off the flag again:

| # | site | file | what it feeds |
| --- | --- | --- | --- |
| **1** | `  const gcSeat = match.bkGroundCorridor ? deliveryValueSeatOf(g) : null;` — THE SEAT FORK | `src/ai/PlayerBrain.ts`, `decideCarrier`'s pass block | the arming rule (flag + a non-absent DV gene ⇒ a seat; otherwise `null`). It reads **the genome and nothing else** — no `match` member, no percept pull, no world state |

Downstream of it, and counted separately: **ONE** body-set line (`gcBodies`, built once per
decision beside the seat, `[]` while the seat is null), **ONE** `groundShellHazard(` call
site (inside the ONE hoisted `groundCandidate`, as its last statement) and **ONE**
`PRICER_RETURN` (`return { s: sGc, … }`). **ZERO** new strike statements, **ZERO** new
candidate kinds, **ZERO** new comparisons.

**Byte-identity is arithmetic, not hope**: with the fork not taken, `gcSeat` is `null`, the
ternary returns `sDv` itself, and `groundCandidate` returns the shipped statements' own
double.

### ⭐⭐ WHICH CANDIDATE KINDS THE TERM TOUCHES — the dispatch brief's ⚠ CHECK, discharged

The dispatch brief ordered this checked before a line was written, because *"if the hoisted
pricer also prices lofted candidates, your term must apply exactly where the contract says
… and NOT double-price the lofted family (which `bkCorridorPrice` owns)"*. **It does not.**
Evidence, machine-counted in the pin suite (`GC T0 §SCOPE`):

| kind | where it is formed | priced by `groundCandidate`? | priced by GC-T0? |
| --- | --- | --- | --- |
| **(a) TO FEET** — the incumbent | `const feet = groundCandidate(mate, aim, d);` | ✅ | ✅ |
| **(b) LED** — DLC-T0's second delivery | `const ledCand = groundCandidate(mate, ledBall.aim, d);` | ✅ | ✅ |
| **(c) STRIKE PLANE** — DLC-T0s's K = 9 grid | `const planeCand = groundCandidate(mate, strike.aim, d);` | ✅ | ✅ |
| **(d) KNOCK** — CB-T2's touch-past (a delivery to YOURSELF) | `const cand = groundCandidate(p, knock.aim, dist(p.pos, knock.aim));` | ✅ | ✅ |
| ⛔ **the LOFTED SWITCH** | its OWN `sL` chain (`let sL = (W.loftBase …`), priced by `bkCorridorPriceLed` | ❌ **never enters `groundCandidate`** | ❌ |
| ⛔ the punt · the keeper throw · the dink | their own choosers, priced by `bkCorridorPriceOf` / `bkCorridorPriceLed` | ❌ | ❌ |
| ⛔ the through ball · the cross · the cutback · the shot | their own scoring chains | ❌ | ❌ |

Machine evidence, pinned: `count(brainSource, /const groundCandidate = \(/g) === 1` ·
`count(brainSource, /groundCandidate\(/g) === 4` (the four rows above, each pinned VERBATIM
by DV-T0's and CB-T2's own suites) · `count(brainSource, /groundShellHazard\(/g) === 1`,
and that one call is INSIDE the pricer slice · and the lofted slice (`let sL = (W.loftBase`
→ `if (sL > bestLoft)`) contains `bkCorridorPriceLed(` and contains **neither**
`groundShellHazard` **nor** `gcSeat` **nor** `gcBodies`. **THE LOFTED FAMILY IS NOT
DOUBLE-PRICED.**

⚠ **DISCLOSED, not hidden — the KNOCK is a SELF-DELIVERY.** On row (d) the caller passes
`p` as the "mate", so `kickerGid === receiverGid === p.gid` and both exclusions bite the
same body: the carrier is named out once, by two rules. That is the correct reading (a man
cannot block his own knock) and it is the CB-T2 §STRAIN convention — the degenerate terms
of a self-delivery are named and measured, never special-cased away.

### Untouched (restated as a prohibition)

`deliveryRiskPrice` · `flightExposure` · `bkCorridorHazard` / `bkCorridorPriceOf` /
`bkCorridorPriceLed` / `bkCorridorClearsBody` / `bkCorridorHeightAt` /
`bkCorridorFlightOf` / `bkCorridorLeadAim` / `BK_CORRIDOR_FAMILIES` · the `lane` /
`open` / `gain` / `mul` chain and every Phase bonus inside the pricer · all three banked
delivery seams (`passLeadSeat.ts`, `deliveryChoiceSeat.ts`, `strikePlaneSeat.ts`) and their
fork lines · `carryChoiceSeat.ts` and `knockCandidates` · `mechanics.ts` (not one byte) ·
`genome.ts` · `perceptionSnapshot.ts` · `a4World.ts` · the render layer · `Team.ts` ·
`cloneState.ts` · every world 6–11.

---

## §SEAM MAP — every occurrence, COUNTED and SITED

**PREFIX STATED**: this seam's whole needle family is exactly **two names** — the flag
`bkGroundCorridor` and the exported predicate `groundShellHazard`. There is no third
spelling, no type, no constant, no gene and no alternate casing (the pin suite asserts the
case-insensitive count equals the case-sensitive count, file by file, across all of
`src/**`). Local bindings `gcSeat` / `gcBodies` are counted separately below.

| file | `bkGroundCorridor` | `groundShellHazard` | the sites |
| --- | ---: | ---: | --- |
| `src/sim/Match.ts` | **4** | **1** | the `MatchConfig` field (1) · the `readonly` field (1) · the `this.`/`cfg.` pair on the ONE initialiser line (2). The single `groundShellHazard` is PROSE, inside the config docblock. The two docblocks never re-type the flag name |
| `src/sim/League.ts` | **1** | **0** | the `matchFlags` key union, and nowhere else |
| `src/ai/PlayerBrain.ts` | **2** | **3** | the ONE seat fork line (1) + one PROSE mention in its docblock (1); the import (1) + one PROSE mention (1) + **the ONE call** (1) |
| `src/ai/deliveryValueSeat.ts` | **0** | **2** | the `export function` definition (1) + the docblock's own pseudocode transcription (1). **The module never names the flag** — it cannot be armed from inside itself |
| every other file in `src/**` | **0** | **0** | ⛔ nothing: no executor, physics, render, evolution, entry-layer, snapshot or League consumer |

Local bindings, same discipline: `gcSeat` appears **4×** in `PlayerBrain.ts` (the
declaration · the `gcBodies` guard · twice in the pricer's ternary) and **0×** anywhere
else; `gcBodies` appears **2×** (the declaration · the ONE use) and **0×** anywhere else.

Every count above is re-asserted inside `tests/gcGroundCorridor.test.ts` (`GC T0 §SEAM
MAP`), so the map in this document cannot drift from the code without a red test.

---

## §PINS — the PIN INVENTORY (a NAMED deliverable)

`tests/gcGroundCorridor.test.ts`, in the house form (`bkCorridorPrice.test.ts` /
`dfAssignPersist.test.ts` / `dfCapOff.test.ts`) — **21 pins**, all green from birth.

| group | what it pins |
| --- | --- |
| **ROAD B** | ⭐⭐ the PROHIBITION SET (the `dfCapOff` form): `a4World.ts` does not contain the string, `a4MatchFlags(6…11)` never carries the key, a bare `Match` and a League match are both `false`, no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` on any seam line · ⭐ NO SERIALIZATION (`League.toJSON()`) · the gene still born absent and outside `GENE_KEYS` |
| **G-OFF** | ⭐⭐ ABSENT ≡ EXPLICIT-FALSE, byte for byte, BOTH world shapes (bare · world 11) × 2 scratch seeds, per-cell AND pooled digest; the four cells are proven DISTINCT (a non-vacuity check) |
| **G-BORN** | ⭐⭐ armed with the gene ABSENT ≡ shut, and the seat really is `null` on every armed view |
| **G-ZERO** | ⭐⭐ armed with the gene PRESENT AT ZERO ≡ shut **against a comparator carrying the SAME gene**, both world shapes × 2 seeds, pooled; and the path is proven LIVE (a seat exists on `baseGenome` and `effGenome` of both teams, at weight exactly 0) |
| **the zero point** | ⭐ IEEE-exact: with the hazard measured at **1**, `w · h` is exactly `+0` and `s − price === s` for every probe value |
| **G-BITE** | ⭐ arming with a dosed gene genuinely reprices — the world diverges, in the bare shape at weight 1 AND at world 11's own 0.5 pin |
| **the PREDICATE LAW** (7 pins) | the range is exactly {0,1} · ⭐⭐ BOTH TEAMS (a teammate blocks exactly as an opponent does, on either collection) · ⭐⭐ the ARRIVING RULE (the receiver is named out by GID, on either side, at the aim AND mid-line; a DIFFERENT body at the same point still blocks) · the KICKER and a SENT-OFF body are named out · ⭐⭐ the SHELL is the contact law's own line (anchored, matched once) and is the ONLY width (just-inside blocks, just-outside does not) · ⭐⭐ SHORT OF THE TARGET (`along < d − shell`: just-short blocks, just-beyond does not) · ⭐⭐ NO 1.5 m GUARD (a body at 0.5 m from the kicker's feet BLOCKS, and the function body never names `DV_CLEAR_RADIUS`) · ⛔ NO COOLDOWN GATE and NO SPEED READ (the function body names none of `kickCooldown`, `stunTimer`, `topSpeed`, `lastTouch`, `DV_FLIGHT_SPEED`, `DV_CORRIDOR_SCALE`, `clamp01`, `simTime`, `vel`) · PURE and CHANNEL-CLOSED (no `Match` import, no `match.`, no rng) |
| **§SCOPE** (3 pins) | ⭐⭐ ONE hoisted pricer, FOUR ground call sites, the hazard called EXACTLY ONCE and inside the pricer, and the LOFTED chain names none of this seam's symbols · ⭐ the hazard reads THIS CANDIDATE's own aim and own receiver (the call pinned VERBATIM) and the body set is the loop's own collections · ⭐ the arming rule is the BK seat's own (both fork lines pinned verbatim; ONE `deliveryValueSeatOf` definition) |
| **§SEAM MAP** | ⭐⭐ every count in the table above, plus the whole-tree "no other file" sweep |
| **the fingerprint** | ⭐ `57b0bdab…c673` a literal in this suite; and a bare `Match` has all three corridor/DV doors `false` |

### ⚠⚠ THE TWO PRE-EXISTING PINS THIS STAGE NARROWS (disclosed at freeze, for ratification)

The **DF-T0 §P7 precedent** applies exactly (ratified at **ruling #323 item 1**): where a
banked stage's frozen assertion and the letter of a new dispatch cannot both stand, the pin
is **NARROWED, NOT DELETED, and made POSITIVELY**, in the same commit, and flagged.
**A pinned test is a STOP, never a silent edit** — both narrowings are recorded here and in
§DEV, and neither weakens its owner's substantive claim.

1. ⭐⭐ **`tests/dvDeliveryValue.test.ts`** — *"⭐ ONE PRICER: the risk price is the last
   statement of the ONE `groundCandidate`"* asserted the pricer's return line VERBATIM as
   `      return { s: sDv, lane, open, gain, mul };`. **#343 item 4 orders a SECOND and LAST
   subtraction beside DV's** (*"the ONE pricer statement … the last subtraction beside
   DV's"*), so the pricer now returns the value formed FROM `sDv`. **NARROWED to the
   positive form**: `sDv` is still formed from `s` by exactly ONE `deliveryRiskPrice` call
   (that pin is untouched and green), the new binding `sGc` is pinned as `const sGc =
   gcSeat === null ? sDv`, and the return is pinned as `return { s: sGc, … }`. DV-T0's
   substantive claim — one risk price, one call site, no per-seam copy, no double
   application — is **unweakened**. Its NO-TASTE slice check (which scans from the DV
   comment to the mate loop, and therefore now scans MY statement too) was **not touched
   and passes**: the added statement names no gene, no attribute and no multiplier.
2. ⭐ **`tests/bkCorridorPrice.test.ts`** — *"⭐⭐ ONE corridor loop"* asserted
   `count(codeLinesOf(seatSource), /closestPointOnSegment\(/g) === 1`, a FILE-LEVEL count
   that cannot survive a second, separate predicate landing in the same module. **NARROWED
   to the positive form**: the CORRIDOR LOOP itself (`flightExposure`'s own slice) still
   evaluates the geometry EXACTLY ONCE — which is BK-T3's actual claim (the height half is
   a statement inside the shipped loop, never a second loop that could drift) — the file
   count is pinned at 2, and the second occurrence is pinned to live inside
   `groundShellHazard`, which is proven NOT to be a corridor loop (it never contains
   `for (const o of opponents)`). BK-T3's `for (const o of opponents)` singularity pin is
   **untouched** and green.

**⚠ BOTH ARE FLAGGED FOR COMMANDER RATIFICATION.** No other test file was edited by this
stage; the only other `tests/**` change is the NEW `gcGroundCorridor.test.ts`.

---

## §HONESTY — the epistemic limits, stated plainly

1. **NO NEW CHANNEL, and it is closed at the IMPORT LIST.** `deliveryValueSeat.ts` still
   does not import `Match` and never names it in executable source, so `groundShellHazard`
   cannot reach a percept snapshot or any other channel. Its body source is the caller's
   own `[team.players, opp.players]` — the very collections `laneOpenness(p.pos, aim,
   opp.players)` and the mate loop are already reading, snapshot-borne wherever the percept
   world is armed (the IN-T0 gateway shadowing at `PlayerBrain.ts` L155-159).
2. ⚠ **AND THAT IS A LIMIT, NOT A BOAST.** The term inherits the chooser's existing
   honesty exactly — no more, no less. ⚠ **ONE THING IS WIDER THAN THE INCUMBENT AND IS
   NAMED HERE**: the incumbent corridor read walks `opp.players` only, and this term also
   walks `team.players`. That widening is #343 item 2 (ii)'s ORDERED departure (the 2-in-5
   teammate carom), and a passer seeing his own teammates is the least controversial
   perception in football — but it IS a wider read than the line it sits beside, and GC-T1
   should not describe the two as equally scoped.
3. **THE BINARY FORM IS A CHOICE THE CENSUS MADE, NOT A LAW OF NATURE.** BK-C2 measured a
   ~3.3× discrimination with THIS predicate; nothing here claims it is the best predicate.
   A graded refinement is a NAMED DOOR (contract §4), openable only on GC-T1's red.
4. ⭐ **THE PRICE IS ONLY AS GOOD AS THE PRICER.** The term enters a score chain this stage
   does not otherwise touch. If that chain misprices something, GC does not fix it — it
   adds one term to it.
5. **THE COST IS REAL AND IS REPORTED HONESTLY AS UNMEASURED.** The hazard is one loop over
   both teams PER PRICED CANDIDATE — so with the strike plane also armed it is up to nine
   scans per support mate, plus one per knock. **No perf reading is published by this
   stage**: the dispatch did not order one and inventing one would be a number without a
   method. The early return on the first blocking body makes the armed cost strictly
   data-dependent. ⚠ GC-T1's dispatch should decide whether it wants a cost face.
6. **DV + GC DOUBLE-ARMING IS UNMEASURED COMPOSITION** (contract §4, restated): no world
   arms both, and this stage measures the two composed only in the sense that the DV limb
   is `null` in every walk here.
7. ⚠ **THE MUTANT COVERAGE IS NOT UNIFORM** — see §R4 row M4: the both-sides body set is
   defended by a SOURCE-TEXT pin at the call site, not by a behavioural fixture, because
   the fixture-level "both teams" pin exercises the FUNCTION and the mutant moves the
   CALLER. Stated rather than glossed.

---

## §ROAD B — nothing ships

`bkGroundCorridor` is **OFF in every production path** — a hard `false` default, **absent
from `a4World.ts` entirely**, absent from every play-test world, absent from every
`League.matchFlags` unless a probe sets it explicitly — and even ARMED it does nothing
while the gene is absent (G-BORN) or zero (G-ZERO). No gene is created. The production
fingerprint is unchanged and the flag-off world is byte-identical on every walked seed with
the trace, the score, the stats and the event count included. **Nothing about the game the
user plays changes in this commit.** The seam exists so GC-T1 can run the exam.

**Road B statement**: fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **must not move, and
did not** (§R0).

---

## §RESULTS — the receipts

*(filled in by the receipts commit, after the walks ran — the frozen-before-sight rule.
Every digest there is quoted from the run that produced it, at full precision, with the
method that reproduces it stated beside it.)*
