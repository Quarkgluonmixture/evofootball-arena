# L3-C0b — THE WINDOW DECOMPOSITION (那 +10.75 pp 是世界在教，还是他自己的秒表在数？)

Status: **FROZEN (this half), then RUN.** Per **#266.3(c)** everything from §0 to §NON-CLAIMS — the
world, the population, the two COMMON windows and the arithmetic that derives them, the CLOSED
candidate set, the veto frame, the estimator, the gate list (frozen **after** the machine-liveness
audit), the N rule and the seed ledger — lands in **its own commit BEFORE any battery is read**, so
git corroborates frozen-before-sight rather than self-attestation. The measured numbers arrive only
in [§RESULT](#result) at the foot, and every number there is **GENERATED PROGRAMMATICALLY** from the
committed artifact by a committed generator
(`scripts/analysis/l3-c0b-decomposition-result.ts`), never typed (#229.2).

⚠ **This document reports; it does not adjudicate (#203).** The verdicts are mechanical CI
readings. The **RECOMMENDATION** in §DECISION is *a recommendation with its arithmetic* — the
**COMMANDER ratifies the frozen label**, and L3-T0 does not start here.

Authority chain: **RULING #278.2(i)** — the label pick is NOT ratified, the window confound is HIGH,
and ONE decomposition instrument decides it before T0 freezes anything. Contract:
[`CB-L3-DEFENCE-BOOK-CONTRACT.md`](CB-L3-DEFENCE-BOOK-CONTRACT.md) **§2 M-L3.1** (the observable
label) and **§2 M-L3.3** (the decline-only veto). Source census:
[`L3-C0-LUNGE-OUTCOME-CENSUS.md`](L3-C0-LUNGE-OUTCOME-CENSUS.md) — ⭐ read **including its
§COMMANDER CORRECTIONS OF RECORD (#278.2)** before any of its numbers were quoted, and the
corrections that bind here are named in §CORRECTIONS-READ. Form precedent:
[`EK-C0B-INVERSION-DIAGNOSTIC.md`](EK-C0B-INVERSION-DIAGNOSTIC.md) (the diagnostic that decomposes a
banked census's own confound on a fresh block). Veto form:
[`EK-T0-HOLD-BELIEF-SEAM.md`](EK-T0-HOLD-BELIEF-SEAM.md) **§THE VETO (M-EK.3)**. Hygiene canon:
**#163** · **#181.2** · **#200** · **#203** · **#229.2** · **#246** · **#247** · **#250.3** ·
**#256.3** · **#261.2 / #262.2** · **#263.2** · **#266.2(i)** · **#266.3(a,b,c)** · ⭐⭐ **#268.3(a)**
(LIVENESS BY MACHINE, EXACTLY-ONE ENFORCED) · **#270.2 / #272.3(ii)** (clock honesty) · **#273.3**
(tree-clean gates compare WORKTREE vs HEAD) · **#276.3** (a stage-doc number is quotable only after
its corrections section is checked).

> ⭐ **INSTRUMENT-ONLY ROUND.** `src/**` is **byte-untouched** — `xSrcUntouched` is a HARD gate
> comparing the **WORKTREE against HEAD** (#273.3) plus an untracked-file conjunct. **Nothing
> measured here reaches any player** (#247). The veto replay in §VETO is an **OFFLINE ARITHMETIC on
> stored counters**: no belief, no flag, no seam exists in `src/**`, and none is proposed here.

---

## §0 THE QUESTION, in football

L3-C0 measured what a lunge costs and recommended one punishment label: **the carrier was further
away when your own recovery ended**. It carried the only monotone, three-grain-resolved gradient in
the census (+10.75 pp at g3). #278.2(i) then ruled the HIGH: **that label's window IS the recovery
interval**, and the recovery interval is a deterministic function of the very band the book indexes
(0.655 s at a walk → 0.987 s overcommitted). A defender who dives at full tilt is measured over a
third of a second longer than one who dives at a walk. So the gradient may be nothing but *more
seconds of football happening*.

In plain football language: **did the world teach him that diving fast gets you taken away from — or
did we simply hold the stopwatch longer on the fast divers?** The way to tell is to hold the
stopwatch for **the same number of seconds for everyone** and look again.

Three things are decided here, and nothing else:

1. **Does a band gradient survive a COMMON window?** If yes, the punishment is world-taught. If it
   vanishes or inverts, the picked label was reading its own clock.
2. **The two-window contrast**, published side by side on the SAME events, so the gap between "his
   own clock" and "a common clock" is a measured quantity rather than an argument.
3. **P(won | band) re-examined under the VETO'S OWN consumption frame** — because the decline-only
   veto consumes an **ORDERING of ratios**, not an absolute gap, and the census's draft rejected
   P(won) on absolute flatness (~2 pp on a ~6 % base), which is the wrong test for that consumer.

⭐ **THE CANDIDATE SET CLOSES HERE (#278.2(i)(d)):** common-window separation · P(won) · the original
pick. **Nothing new after sight.**

## §CORRECTIONS-READ — ⭐ the #276.3 canon, discharged explicitly

The corrections-before-quoting rule has now been struck **twice** (#276.3, #278.2(ii)). Every
stage-doc number this round quotes was checked against its own corrections section **first**, and
the checks are stated rather than implied:

* **L3-C0 §COMMANDER CORRECTIONS OF RECORD (#278.2) — READ IN FULL.** Binding consequences carried
  here: (i) the +10.75 pp pick is **NOT ratified** and the "confound, answered not argued" sentence
  is **WITHDRAWN** — this document does not repeat it; (ii) the bare-world contrast cell is
  **37.565 %**, never "37.1 %" — that number is not used here at all; (iii) the honest tabulated
  take rate is **6.161 %** and the headline "16.7975 per TEAM per match" mixed populations — so this
  round publishes its own lunge rate on ITS OWN tabulated population and never mixes the two;
  (iv) the LOW about separation censoring published only by subtraction is answered structurally
  (censoring is a stored counter per band per window here, `gPaired`).
* **The numbers this round DOES import from L3-C0**, all from its committed artifact and none typed:
  the **b0 mean recovery interval** (the short common window), the **five band mean recovery
  intervals** (to prove the long rung covers them all), the **b0 mean separation at t0** and its
  **p10/p90** (the window arithmetic), and the **g3 own-recovery CI half-width + N** (the N rule).
  None of these sits in a corrected row.
* **CB-C0 / DV-C0 numbers are NOT quoted this round** — the concession family is out of the closed
  candidate set, so no window ladder and no loss semantics are imported.

## §WORLD — L3-C0's world, unchanged

```text
match       new Match({ seed, teamA: team('A', seed*2+1), teamB: team('B', seed*2+2),
                        ...a4MatchFlags(6) });  armA4World(match, null, 6)
assertion   cbArmedVersion(match) === 6            (the play entry's own arming, dose 1.0 uniform)
duration    the ENGINE DEFAULT match clock (MATCH_DURATION) — never overridden (#270.2)
```

`gWorld` reads every conjunct back off a **freshly constructed, never-stepped** match. The walker,
the duel detector (re-keyed onto `cbLedger`), the χ and recovery re-derivations and the band
placement are **L3-C0's own, inherited** — and `gReproL3c0` proves it rather than asserting it (see
§RECEIPT).

## §BANDS — L3-C0's, unchanged

`v* = sqrt(2·ACCEL·R_TACKLE)`, both constants extracted from `src/**` at run time; the five bands are
its quarters (CB-C0's family); the coarser grains are contiguous unions, never new cuts.
**The band is the LUNGER'S OWN velocity read at the lunge decision** (the self-percept, M-L3.1).
⭐ **The veto's grain is `g3`** (walk+jog · run+drive · OVERCOMMITTED) — the grain the census's own
§PICK recommended and the one #278.2(i)(c) names for the P(won) re-examination; g5 and g2 are
published beside it.

## §WINDOWS — ⭐⭐ the two COMMON rungs, derived and frozen (not typed)

> **A COMMON WINDOW IS THE SAME NUMBER OF SECONDS FOR EVERY BAND.** That is the whole instrument.

```text
W_short   = L3-C0's COMMITTED b0 mean recovery interval, READ from its artifact at run time
          = the ENGINE'S OWN recovery law, averaged over the arrivals of the SHORTEST band
          ≈ 0.6545 s   (the charter's "≈0.65 s")
W_long    = 1.0 s       (#278.2(i)(a)'s second rung — ABOVE every band's own mean recovery,
                         so at this rung every band has finished recovering)
```

**THE ARITHMETIC BEHIND W_short, shown** (`gWindowsDerived` checks each limb). The recovery law is
`|v|/a + θ/TURN_RATE + sqrt(2·d/a)`. At b0's own committed state — band midpoint arrival
`v̄ = v*/8` and L3-C0's committed b0 mean separation at t0 `d̄` — two of the three legs are computed
here from traced constants and the third is the **published residual**:

```text
brake leg  = v̄ / ACCEL
close leg  = sqrt(2·d̄ / ACCEL)
turn leg   = W_short − brake − close        ⇒ implied mean turn angle = that × TURN_RATE
gate       brake + close  <  W_short        (the residual must be a POSITIVE turn leg, not a fudge)
gate       W_short lies strictly inside b0's own committed p10…p90
gate       W_long exceeds EVERY band's committed mean recovery
```

The measured values of all four quantities are printed in §RESULT. ⚠ `W_short` is **read**, never
typed: a mutant that replaces it with the hand-typed `0.65` turns `gWindowsDerived` RED.

## §CANDIDATES — ⭐ THE CLOSED SET (#278.2(i)(d)), measured on the same misses

For every **MISSED** lunge (the population M-L3.1's label closes on), at the lunger's own band, with
**t0 anchored on the CARRIER** (#266.2(i) — never the ball):

| id | window | what it says |
|---|---|---|
| `sepGainedCommonShort` | **COMMON** `W_short` | the carrier was further away `W_short` after the miss |
| `sepGainedCommonLong` | **COMMON** `W_long` | the same, `W_long` after the miss |
| `sepGainedOwnRecovery` | **PER-EVENT** | ⭐ THE ORIGINAL PICK — further away when HIS OWN recovery ended |
| `lungeLost` | none | ⭐ P(won \| band) written as its punishment complement: the lunge did not win the ball. **Every lunge is an event** |
| `pairedCommonShort/Long` · `pairedOwnRecovery` | as above | the same three, restricted to events resolved at **EVERY** window — the exactly-paired contrast |

`sep(t) = |taker − CARRIER|`; the threshold is **zero metres** (no constant is introduced). A window
truncated by full time is **CENSORED, not a zero**: the event leaves that window's denominator and
the censored count is **stored per band per window** (`gPaired`), never inferred by subtraction.

## §CONTRAST — what the two-window contrast publishes

Per band, on the **paired** population: the label at his own recovery window, the label at each
common window, and the **gap (own − common)** with its paired cluster-bootstrap CI. The gap is the
size of the clock effect, in percentage points, measured rather than argued.

## §VETO — ⭐⭐ P(won) under the consumer's own frame (#278.2(i)(c))

The book's consumer is the **decline-only veto**, and its form is EK-T0's, verbatim and
zero-constant (M-L3.3 binds this idiom):

```text
decline at band b  ⇔  events[b] > 0
                  AND Σ_{b'≠b} events[b'] > 0
                  AND punished[b]·Σ_{b'≠b} events[b']  >  Σ_{b'≠b} punished[b']·events[b]
```

— integer cross-multiplication, so no float, no epsilon, no threshold. It consumes an **ORDERING of
ratios**; an absolute gap is not what it reads. Three things are therefore measured:

1. **`gVetoForm`** — the predicate itself, exhaustively swept over every 3-band book with ≤ 4 events
   per band, checked against an INDEPENDENT float re-derivation, plus: empty and one-band books
   decline nothing, a tie declines nothing, the strictly-worse band always declines and the
   strictly-better band never does.
2. **THE REPLAY ON REAL BOOKS.** One book per (consecutive block of the League's own fixture count ×
   side) — the **event volume of a team-season** (the season is traced from `League.ts`, not typed).
   Per band: how often the book **speaks** at all, how often it would **decline**, and how often its
   decision **agrees with the population's** own decision at that band. This is the fill arithmetic
   and the consumption arithmetic in one table.
3. **ORDERING STABILITY ACROSS SEED BLOCKS** — the battery's four quarters read independently; the
   argmax/argmin band of each candidate published per quarter.

⭐ **THE FOOTBALL HONESTY, STATED HERE AND NOT BURIED.** A miss is **not per se a beating**. A
P(won) book teaches *"don't waste lunges — from here you rarely get the ball"*; a separation book
teaches *"don't get taken away from — from here he leaves you behind"*. **Both are restraint, and
they are different lessons.** Which one the defence's book carries is the COMMANDER's pick; this
document measures both and does not choose for him.

## §ESTIMATOR

Cluster bootstrap by **match seed** (#20) — the set grain — **2,000** resamples, percentile 95 % CI,
**ratio-of-sums**, ⭐ **ONE SHARED resample-index matrix** so every rate, every band difference and
every two-window gap is paired by construction. Stats stream base **111,000** (ruling #278.4's
floor), on the 200 grid, disjoint from the match RNG (#163). ⭐ **Per-cluster cells are STORED**
(per seed × side × band: every count, every window's numerator/denominator/censored count, the
paired subset and the recovery pool), so every number in §RESULT re-derives without a re-run
(#256.3). **CLOCK HONESTY (#270.2 / #272.3(ii)):** every count rate is published per team per match
on the engine's default 240 s clock (convention A), with the extracted display mapping beside it; no
rate is published on a third clock.

## §NRULE — sized EX ANTE off L3-C0's OWN COMMITTED MOMENTS

The quantity that must resolve is a **COMMON-WINDOW separation gradient at g3**. Its per-cluster
variance is the same family as L3-C0's own g3 separation gradient, whose committed 95 % CI
half-width at N₀ = 158 is `hw₀`. A cluster-bootstrap half-width scales as `1/sqrt(N)`, so:

```text
N* = min( max( ceil( N₀ · (hw₀ / 0.03)² ), 60 ),  floor(0.5 h / msPerMatch),  700 )
```

with the target half-width **3 pp** — the tight end of the charter's ±3–4 pp requirement. `hw₀` and
`N₀` are read from L3-C0's **committed census artifact**; `msPerMatch` from its **committed sizing
artifact**. Those are the only three numbers a full run reads out of them, and they feed **only** N.
`gN` checks the rule's output, that the terms came from the committed artifacts, and that the target
half-width sits inside the charter's own band.

## §RECEIPT — ⭐ the declared re-walk of L3-C0's own block

The charter permits **one** declared receipt re-walk of L3-C0's own block, for **ONE overlap
statistic**, drawing **no new conclusion**. It is: the twelve seeds at the head of L3-C0's battery
(**12,480,200–211**) re-walked with THIS probe's walker, and the **summed MISSED lunges over its own
committed per-cluster cells** reproduced exactly. That is the proof that the walker/detector/band
machinery is L3-C0's own rather than a look-alike. ⭐ **Its seed predicate is INVERTED** (it *must*
collide with the consumed ledger — a clash-free re-walk would prove it was walking fresh seeds
instead of reproducing a receipt), and **nothing else is read from those twelve matches**.

## §GATES — the frozen list (every conjunct mutant-flipped, EXACTLY-ONE ENFORCED)

⭐⭐ **LIVENESS BY MACHINE (#268.3(a)):** the coverage map is enumerated **from the gate objects
themselves** at startup; a conjunct without a mutant, or a mutant naming a conjunct that does not
exist, makes the probe **REFUSE TO RUN** (exit 3). Every mutant must **flip its own conjunct AND
leave every other conjunct of that gate unchanged**. ⭐ Per #266.3(b) this list was frozen **after** a
conjunct-grain dead-predicate audit whose findings are in §DEV.

| gate | asserts |
| --- | --- |
| `gDet` | the whole measured core of the anchor seed re-derives **bit-identically** on a second independent walk |
| `xSrcUntouched` | `git diff HEAD -- src` empty **and** `git status --porcelain -- src` empty — WORKTREE vs HEAD (#273.3), HARD |
| `xFpProd` | the shipped League fingerprint re-derives: 3 seeds × 2 seasons headless equal their frozen baselines |
| `gWorld` | armed at `cbArmedVersion === 6`, all three CB doors open, no eye/book/seam, no engine door, the default clock, read on a **never-stepped** match |
| `gConstTrace` | every duel/motion/clock/season constant EXTRACTED from `src/**` at run time; the CB module's radius equals `tryTackles`'; **seven** `tackleCooldown` writers |
| `gBandsDerived` | v\* is the braking identity, the cuts are its quarters, every grain is an ordered partition of the five |
| `gDetect` | detected lunges = `cbLedger.armedChallenges`; misses = `recoveries`; standing + slide wins = `stats.tackles`; no unclassified jump; never two lunges in a tick; every unwhistled duel inside `R_TACKLE`; tabulated + whistled = every lunge |
| `gLawsRederived` | the INDEPENDENT χ re-derivation agrees with the engine's geometric-miss counter (residue confined to whistled duels); the recovery law re-derives on **every** unwhistled miss inside the DERIVED tolerance; the summed intervals equal `cbLedger.recoverySeconds` |
| ⭐⭐ `gWindowsDerived` | the short rung **is** L3-C0's committed b0 mean recovery (a typed `0.65` flips it); it sits inside b0's own p10…p90; brake + close legs are **below** it (the residual is a positive turn leg); the long rung exceeds **every** band's committed mean recovery; the two rungs are distinct COMMON windows |
| ⭐ `gPaired` | every miss is **resolved or censored** at the own window and at **every** common window; censoring is monotone in the rung; the paired subset is non-empty and no larger than any window's resolved set; censoring is under a hundredth of the population |
| ⭐⭐ `gReproL3c0` | the DECLARED RECEIPT: twelve of L3-C0's own committed seeds re-walked, the overlap statistic reproduced exactly, every receipt seed present in its artifact, the block **is** L3-C0's battery head |
| ⭐⭐ `gVetoForm` | the EK-T0 predicate: integer form **=** an independent float re-derivation over an exhaustive small-book sweep; empty/one-band books decline nothing; a tie declines nothing; the strictly-worse band always declines and the strictly-better never |
| `gNonVac` | every published rate has a non-empty denominator **at its own claim grain** (#263.2 — every grain × every candidate); misses exist; wins exist; > 1 cluster; the veto replay built books |
| `gBoot` | ONE shared resample matrix, B = 2000, indices in range, clusters = the walked seeds |
| `gSeed` | booked = walked: every interval inside band **12,481,000–999**, pairwise disjoint, disjoint from the ledger (which now includes L3-C0's whole band) — and ⭐ the receipt re-walk's predicate **INVERTED** (it must collide) |
| `gStats` | stats base at/above **111,000**, on the 200 grid, clear of every published base |
| `gEnvClean` | whitelist-or-refuse held, no override set, no preflight aimed at a canonical path |
| `gN` | N is the frozen rule's output, both sizing terms from the **committed** L3-C0 artifacts, the target half-width inside the charter band, the precision term bounded |
| `gValuesUnreachable` | none of the published rates appears in `src/**` (raw 5-dp **and** formatted-percentage forms), with non-vacuity floors and a control needle that must be found |
| `gHashEnvelope` | the hashed body carries **no invocation context**; the digest re-derives off disk; a second invocation to another path with another envelope re-derives the **identical** stripped digest (cross-`OUT`, #266.3(a)) |
| `gMutants` | every conjunct of every gate has a mutant and every mutant is `live` |

⭐ **THE HEADLINE COUNT, HAND-CHECKED against this frozen list (#250.3(i)):** the table has **21**
rows — `gDet · xSrcUntouched · xFpProd · gWorld · gConstTrace · gBandsDerived · gDetect ·
gLawsRederived · gWindowsDerived · gPaired · gReproL3c0 · gVetoForm · gNonVac · gBoot · gSeed ·
gStats · gEnvClean · gN · gValuesUnreachable · gHashEnvelope · gMutants` — and the probe REFUSES to
publish unless the artifact's `gates` object carries exactly those 21 keys.

**No gate reads a rate.** Every shape verdict is a mechanical CI reading; a vanished gradient turns
nothing red — that is the finding this instrument exists to be able to return.

## §ENV — whitelist-or-refuse (#261.2 / #262.2)

Accepted: `L3C0B_N` · `L3C0B_SKIP_FP` · `L3C0B_OUT`. ANY other `L3C0B_*`, and ANY of the ENGINE's
own doors, is a FATAL refusal (exit 2). Every override makes the run a **PREFLIGHT**: routed onto
the GUARD block, `gEnvClean` RED, and it may never write a canonical repo path (checked on the
RESOLVED absolute path).

## §SEEDS — the ledger (#163, booked = walked)

Band **12,481,000–12,481,999** (ruling #278.4's assignment), opened above L3-C0's consumption
through 12,480,999.

| block | seeds | kind |
|---|---|---|
| reserved (unused this round) | 12,481,000–12,481,049 | reserved |
| ⭐ exit-semantics **guard block** | 12,481,050–12,481,099 | reserved — where EVERY preflight invocation is routed |
| decomposition battery | 12,481,200 – 12,481,200+N−1 (N ≤ 700) | the battery |
| determinism anchor (G-DET, walked twice) | 12,481,998 | anchor |
| `gWorld` construction seed | 12,481,999 | constructed, **never stepped** |
| ⭐⭐ **THE DECLARED RECEIPT re-walk** | 12,480,200–12,480,211 | **receipt** — L3-C0's own battery head |

Stats base **111,000**, step 200.

## §NON-CLAIMS

1. **NOTHING SHIPS.** Zero `src/**` bytes (worktree vs HEAD); the production fingerprint re-derived
   unchanged; no flag, no gene, no eye, no book anywhere.
2. ⭐⭐ **NOTHING HERE REACHES A PLAYER (#247).** The veto replay is arithmetic over stored counters,
   not a seam: it says what the frozen predicate WOULD do with these books, never what the world
   would then look like (that is L3-T2's question).
3. **NO PASS/FAIL ON ANY MEASURED RATE.** The gates are the X-family, the trace/law identities, the
   window derivation, the paired accounting, the L3-C0 receipt, the veto-form proof and mutant
   liveness.
4. **THE RATES ARE CONDITIONAL, NOT CAUSAL** (L3-C0 non-claim 4, inherited): arrival bands are not
   randomly assigned and **no counterfactual is claimed**.
5. ⭐ **A MISS IS NOT PER SE A BEATING.** A P(won) book teaches "don't waste lunges"; a separation
   book teaches "don't get taken away from". Both are restraint; the lesson is the commander's pick.
6. **THE CANDIDATE SET IS CLOSED (#278.2(i)(d)).** No candidate was added after sight; the runners-up
   L3-C0 already rejected are not re-litigated here.
7. **THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203).** L3-T0 does not start here.

---

<a id="result"></a>

<!-- §RESULT is generated: npx tsx scripts/analysis/l3-c0b-decomposition-result.ts docs/world-model/data/l3-c0b-window-decomposition.json -->

## §RESULT

*(pending the battery — this half is the freeze commit)*
