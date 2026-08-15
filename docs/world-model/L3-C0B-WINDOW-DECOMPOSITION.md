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
readings. The **RECOMMENDATION** under §RESULT's decision table is *a recommendation with its
arithmetic* — the
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

**251 seeds × 1 arm (THE POLISHED ARMED WORLD, `cbArmedVersion === 6`), block 12,481,200–12,481,450, 21/21 gates PASS**, `resultSha256` `f56a6848…`. Every number below is printed by `scripts/analysis/l3-c0b-decomposition-result.ts` from the committed artifact; none is typed (#229.2).

### The run

```text
matches           251   (242.0786 sim-seconds each — the ENGINE DEFAULT match clock)
⚠ TWO POPULATIONS, NEVER MIXED (#278.2(iii)): the ENGINE-LEDGER population and the TABULATED one.
armed challenges  8987   (the engine ledger's own count: won 500 · missed 8487)
  whistle-excl.   392   (of which 1 LEDGER-ONLY — the restart erased the write, §DEV 2)
  TABULATED       8595   = won 499 + missed 8096   ⇐ EVERY rate below rides THIS population
                  17.1215 lunges · 16.1275 misses per TEAM per match (tabulated)
geometric misses  4293   (χ = 0)
COMMON windows    W_short 0.654537 s (39 ticks) · W_long 1.0000 s (60 ticks)
censoring         own 19 · W_short 11 · W_long 21   ⇒ PAIRED population 8075
law receipts      max recovery-law deviation 3.553e-15 s against the DERIVED tolerance 3.242e-9 s
estimator         cluster bootstrap by match seed, 2000 resamples, stats base 111000
receipt           L3-C0's own seeds 12,480,200–12,480,211 re-walked: misses 348 = its committed 348
```

### ⭐⭐ THE TWO COMMON WINDOWS — derived, with the arithmetic shown

```text
W_short = 0.654537 s   READ from L3-C0's committed b0 mean recovery interval (never typed)
          it sits inside b0's OWN committed spread: p10 0.4787 < 0.6545 < p90 0.8151
          THE LAW AT b0's OWN COMMITTED STATE — brake + turn + close:
            brake  = v̄/a          = 0.7093 / 14   = 0.050665 s
            close  = sqrt(2·d̄/a)  = sqrt(2 · 1.2427 / 14) = 0.421345 s
            turn   = the RESIDUAL  = 0.654537 − 0.050665 − 0.421345 = 0.182526 s
                   ⇒ implied mean turn angle = 0.182526 × 6.5 = 1.1864 rad
W_long  = 1.0000 s     ABOVE every band's own committed mean recovery
          (0.6545 · 0.7220 · 0.8010 · 0.8836 · 0.9872)
          ⇒ at this rung EVERY band has finished recovering: the label reads the carrier's
            departure, not the defender still being on the floor.
```

### ⭐⭐ (1) THE COMMON-WINDOW RUNGS — the same clock for every band

**grain `g5`** — published beside it

| arrival band | misses | mean arrival (m/s) | mean own recovery (s) | **W_short = 0.6545 s** | CI 95 % (pp) | **W_long = 1.0000 s** | CI 95 % (pp) | the ORIGINAL PICK (own recovery) | CI 95 % (pp) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| b0 walk | 1263 | 0.849 | 0.6677 | **68.70 %** | [65.93, 71.30] | **79.32 %** | [77.03, 81.72] | 68.07 % | [65.38, 70.75] |
| b1 jog | 2113 | 2.133 | 0.7260 | **70.68 %** | [68.61, 72.71] | **79.19 %** | [77.46, 80.96] | 72.04 % | [70.19, 73.91] |
| b2 run | 2014 | 3.526 | 0.8001 | **68.19 %** | [66.28, 70.14] | **78.26 %** | [76.50, 80.04] | 71.82 % | [69.92, 73.70] |
| b3 drive | 1639 | 4.923 | 0.8831 | **68.64 %** | [66.33, 71.03] | **78.97 %** | [76.83, 81.10] | 77.19 % | [74.82, 79.53] |
| b4 OVERCOMMITTED | 1067 | 6.450 | 0.9894 | **73.87 %** | [71.22, 76.49] | **83.05 %** | [80.61, 85.33] | 82.49 % | [80.09, 84.90] |

| candidate | top − bottom (pp) | CI 95 % | half-width (pp) | verdict | monotone rising |
|---|---:|---:|---:|---|---|
| `sepGainedCommonShort` (COMMON W_short) | **5.17** | [1.43, 9.03] | 3.80 | **RESOLVED-CONFIRM** | no |
| `sepGainedCommonLong` (COMMON W_long) | **3.73** | [0.37, 7.04] | 3.34 | **RESOLVED-CONFIRM** | no |
| `sepGainedOwnRecovery` (PER-EVENT — the original pick) | **14.42** | [10.75, 18.13] | 3.69 | **RESOLVED-CONFIRM** | no |
| `lungeLost` = 1 − P(won \| band) (no window) | **1.00** | [-0.87, 2.98] | 1.92 | **UNRESOLVED** | no |

**grain `g3`** — ⭐ THE VETO'S OWN GRAIN

| arrival band | misses | mean arrival (m/s) | mean own recovery (s) | **W_short = 0.6545 s** | CI 95 % (pp) | **W_long = 1.0000 s** | CI 95 % (pp) | the ORIGINAL PICK (own recovery) | CI 95 % (pp) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| walk+jog | 3376 | 1.651 | 0.7042 | **69.94 %** | [68.35, 71.55] | **79.24 %** | [77.88, 80.70] | 70.55 % | [69.03, 72.09] |
| run+drive | 3653 | 4.144 | 0.8374 | **68.39 %** | [66.92, 69.90] | **78.58 %** | [77.11, 79.94] | 74.22 % | [72.81, 75.66] |
| OVERCOMMITTED | 1067 | 6.450 | 0.9894 | **73.87 %** | [71.22, 76.49] | **83.05 %** | [80.61, 85.33] | 82.49 % | [80.09, 84.90] |

| candidate | top − bottom (pp) | CI 95 % | half-width (pp) | verdict | monotone rising |
|---|---:|---:|---:|---|---|
| `sepGainedCommonShort` (COMMON W_short) | **3.93** | [0.80, 7.01] | 3.10 | **RESOLVED-CONFIRM** | no |
| `sepGainedCommonLong` (COMMON W_long) | **3.81** | [1.02, 6.48] | 2.73 | **RESOLVED-CONFIRM** | no |
| `sepGainedOwnRecovery` (PER-EVENT — the original pick) | **11.93** | [9.15, 14.76] | 2.80 | **RESOLVED-CONFIRM** | yes |
| `lungeLost` = 1 − P(won \| band) (no window) | **0.59** | [-0.96, 2.21] | 1.59 | **UNRESOLVED** | no |

**grain `g2`** — published beside it

| arrival band | misses | mean arrival (m/s) | mean own recovery (s) | **W_short = 0.6545 s** | CI 95 % (pp) | **W_long = 1.0000 s** | CI 95 % (pp) | the ORIGINAL PICK (own recovery) | CI 95 % (pp) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| controlled (< v*) | 7029 | 2.936 | 0.7734 | **69.14 %** | [67.99, 70.34] | **78.90 %** | [77.92, 79.87] | 72.46 % | [71.47, 73.48] |
| OVERCOMMITTED (≥ v*) | 1067 | 6.450 | 0.9894 | **73.87 %** | [71.22, 76.49] | **83.05 %** | [80.61, 85.33] | 82.49 % | [80.09, 84.90] |

| candidate | top − bottom (pp) | CI 95 % | half-width (pp) | verdict | monotone rising |
|---|---:|---:|---:|---|---|
| `sepGainedCommonShort` (COMMON W_short) | **4.74** | [1.88, 7.57] | 2.84 | **RESOLVED-CONFIRM** | yes |
| `sepGainedCommonLong` (COMMON W_long) | **4.15** | [1.59, 6.52] | 2.47 | **RESOLVED-CONFIRM** | yes |
| `sepGainedOwnRecovery` (PER-EVENT — the original pick) | **10.03** | [7.47, 12.52] | 2.52 | **RESOLVED-CONFIRM** | yes |
| `lungeLost` = 1 − P(won \| band) (no window) | **-0.21** | [-1.65, 1.24] | 1.44 | **UNRESOLVED** | no |

> ⭐⭐ **THE ANSWER TO #278.2(i), IN ONE LINE.** At the veto's own grain the picked label's gradient is 11.93 pp; at a COMMON window the SAME quantity on the SAME misses still rises by 3.93 pp (W_short) and 3.81 pp (W_long), both RESOLVED-CONFIRM. So the punishment is **partly world-taught and mostly clock**: the world-taught share is 33.0 % (W_short) / 31.9 % (W_long) of the picked label's gradient, and the remaining 68.1 % is the window growing with the band.

### ⭐ (2) THE TWO-WINDOW CONTRAST — same events, paired

On the **8075** of the **8096** TABULATED misses that resolve at EVERY window (censoring drops 21 — 0.26 % of the population):

**grain `g3`**

| arrival band | own recovery | W_short | gap (own − W_short) | CI 95 % | verdict | W_long | gap (own − W_long) | CI 95 % | verdict |
|---|---:|---:|---:|---:|---|---:|---:|---:|---|
| walk+jog | **70.55 %** | 69.93 % | **0.62** | [-0.51, 1.81] | UNRESOLVED | 79.24 % | **-8.69** | [-10.09, -7.32] | RESOLVED-INVERT |
| run+drive | **74.27 %** | 68.44 % | **5.82** | [4.79, 6.87] | RESOLVED-CONFIRM | 78.58 % | **-4.31** | [-5.30, -3.33] | RESOLVED-INVERT |
| OVERCOMMITTED | **82.49 %** | 73.92 % | **8.57** | [6.29, 10.84] | RESOLVED-CONFIRM | 83.05 % | **-0.56** | [-1.63, 0.59] | UNRESOLVED |

**grain `g5`**

| arrival band | own recovery | W_short | gap (own − W_short) | CI 95 % | verdict | W_long | gap (own − W_long) | CI 95 % | verdict |
|---|---:|---:|---:|---:|---|---:|---:|---:|---|
| b0 walk | **68.07 %** | 68.70 % | **-0.63** | [-2.33, 1.07] | UNRESOLVED | 79.32 % | **-11.25** | [-13.60, -8.84] | RESOLVED-INVERT |
| b1 jog | **72.04 %** | 70.66 % | **1.37** | [-0.10, 2.94] | UNRESOLVED | 79.19 % | **-7.16** | [-8.68, -5.61] | RESOLVED-INVERT |
| b2 run | **71.89 %** | 68.26 % | **3.63** | [2.25, 5.07] | RESOLVED-CONFIRM | 78.26 % | **-6.37** | [-7.80, -4.96] | RESOLVED-INVERT |
| b3 drive | **77.19 %** | 68.67 % | **8.52** | [6.95, 10.07] | RESOLVED-CONFIRM | 78.97 % | **-1.78** | [-3.17, -0.45] | RESOLVED-INVERT |
| b4 OVERCOMMITTED | **82.49 %** | 73.92 % | **8.57** | [6.29, 10.84] | RESOLVED-CONFIRM | 83.05 % | **-0.56** | [-1.63, 0.59] | UNRESOLVED |

> The gap own − W_short is the clock effect made visible, and it grows with the band exactly as the confound predicts: 0.62 pp (walk+jog, UNRESOLVED) → 5.82 pp (run+drive) → 8.57 pp (OVERCOMMITTED). Against W_long the sign flips for the slow bands (-8.69 pp) and vanishes for the fastest (-0.56 pp, UNRESOLVED) — because the overcommitted body's OWN recovery very nearly IS the long rung. The per-event window is a sliding clock that lands near W_short for a walker and near W_long for an overcommitted diver.

### ⭐⭐ (3) P(won \| band) UNDER THE VETO'S OWN FRAME

**P(won) at the veto's grain, and its event stream:**

| arrival band | lunges | wins | **P(won)** | CI 95 % (pp) | 1 − P(won) | lunges /team/match | lunges /team/SEASON |
|---|---:|---:|---:|---:|---:|---:|---:|
| walk+jog | 3614 | 238 | **6.59 %** | [5.82, 7.39] | 93.41 % | 7.199 | 50.4 |
| run+drive | 3846 | 193 | **5.02 %** | [4.37, 5.65] | 94.98 % | 7.661 | 53.6 |
| OVERCOMMITTED | 1135 | 68 | **5.99 %** | [4.70, 7.32] | 94.01 % | 2.261 | 15.8 |

**Resolvability at g3:** top − bottom = **0.59** pp, CI [-0.96, 2.21], **UNRESOLVED**. ⚠ L3-C0's own g3 take-rate reading was RESOLVED-INVERT on its block; **on this fresh block the same ordering does not resolve** — the first thing the veto frame needed to know.

**THE VETO PREDICATE ITSELF** (`gVetoForm`): the integer cross-multiplication was compared with an independent float re-derivation on **10125** band-decisions over an exhaustive small-book sweep — **0** mismatches; empty books 0, one-band books 0 and ties 0 declines; the strictly-worse band declined in 4254/4254 cases and the strictly-better band in 0/4254.

**WHAT THE VETO WOULD DO** — the predicate replayed on **70** books, each holding one team's events over the League's own **7**-fixture season (a VOLUME proxy, §DEV 4):

**`lungeLost`** — population rates 93.41 % · 94.98 % · 94.01 %; the POPULATION book would decline: walk+jog no · run+drive YES · OVERCOMMITTED no

| band | book speaks | would DECLINE | agrees with the population | events /book (mean) | median | min | zero-share |
|---|---:|---:|---:|---:|---:|---:|---:|
| walk+jog | 100.0 % | **44.3 %** | 55.7 % | 50.4 | 51.0 | 25 | 0.0 % |
| run+drive | 100.0 % | **57.1 %** | 57.1 % | 53.5 | 52.0 | 27 | 0.0 % |
| OVERCOMMITTED | 100.0 % | **48.6 %** | 51.4 % | 15.7 | 15.5 | 7 | 0.0 % |

**`sepGainedCommonShort`** — population rates 69.94 % · 68.39 % · 73.87 %; the POPULATION book would decline: walk+jog YES · run+drive no · OVERCOMMITTED YES

| band | book speaks | would DECLINE | agrees with the population | events /book (mean) | median | min | zero-share |
|---|---:|---:|---:|---:|---:|---:|---:|
| walk+jog | 100.0 % | **51.4 %** | 51.4 % | 47.1 | 48.0 | 22 | 0.0 % |
| run+drive | 100.0 % | **44.3 %** | 55.7 % | 50.7 | 49.0 | 26 | 0.0 % |
| OVERCOMMITTED | 100.0 % | **65.7 %** | 65.7 % | 14.7 | 14.5 | 7 | 0.0 % |

**`sepGainedCommonLong`** — population rates 79.24 % · 78.58 % · 83.05 %; the POPULATION book would decline: walk+jog no · run+drive no · OVERCOMMITTED YES

| band | book speaks | would DECLINE | agrees with the population | events /book (mean) | median | min | zero-share |
|---|---:|---:|---:|---:|---:|---:|---:|
| walk+jog | 100.0 % | **50.0 %** | 50.0 % | 47.1 | 48.0 | 22 | 0.0 % |
| run+drive | 100.0 % | **42.9 %** | 57.1 % | 50.6 | 49.0 | 26 | 0.0 % |
| OVERCOMMITTED | 100.0 % | **67.1 %** | 67.1 % | 14.7 | 14.5 | 7 | 0.0 % |

**`sepGainedOwnRecovery`** — population rates 70.55 % · 74.22 % · 82.49 %; the POPULATION book would decline: walk+jog no · run+drive YES · OVERCOMMITTED YES

| band | book speaks | would DECLINE | agrees with the population | events /book (mean) | median | min | zero-share |
|---|---:|---:|---:|---:|---:|---:|---:|
| walk+jog | 100.0 % | **25.7 %** | 74.3 % | 47.1 | 48.0 | 22 | 0.0 % |
| run+drive | 100.0 % | **51.4 %** | 51.4 % | 50.6 | 49.0 | 26 | 0.0 % |
| OVERCOMMITTED | 100.0 % | **80.0 %** | 80.0 % | 14.7 | 14.5 | 7 | 0.0 % |

**ORDERING STABILITY ACROSS SEED BLOCKS** — the battery's four quarters, read independently at g3:

| candidate | block 1 | block 2 | block 3 | block 4 | argmax band stable | argmin band stable |
|---|---|---|---|---|---|---|
| `sepGainedCommonShort` (COMMON W_short) | 70.5 % / 68.4 % / 67.0 % | 69.6 % / 68.1 % / 71.3 % | 70.2 % / 68.8 % / 78.0 % | 69.5 % / 68.3 % / 78.7 % | NO | NO |
| `sepGainedCommonLong` (COMMON W_long) | 79.2 % / 78.4 % / 77.2 % | 78.5 % / 78.5 % / 83.6 % | 79.5 % / 79.6 % / 86.7 % | 79.8 % / 77.8 % / 84.8 % | NO | NO |
| `sepGainedOwnRecovery` (PER-EVENT — the original pick) | 69.4 % / 73.6 % / 76.4 % | 70.7 % / 74.3 % / 84.0 % | 71.3 % / 76.1 % / 86.7 % | 70.8 % / 73.0 % / 83.1 % | **yes** | **yes** |
| `lungeLost` = 1 − P(won \| band) (no window) | 93.7 % / 94.8 % / 92.7 % | 93.6 % / 95.0 % / 94.8 % | 93.2 % / 94.9 % / 93.0 % | 93.1 % / 95.3 % / 95.5 % | NO | NO |

> ⭐ **THE FOOTBALL HONESTY (a non-claim, restated where it matters).** A miss is **not per se a beating**. A P(won) book teaches *"don't waste lunges"*; a separation book teaches *"don't get taken away from"*. Both are restraint. **Which lesson the defence's book carries is the commander's pick, not this instrument's.**

### ⭐⭐ (4) THE DECISION TABLE

| | `sepGainedCommonShort` | `sepGainedCommonLong` | `sepGainedOwnRecovery` (the original pick) | `lungeLost` = 1 − P(won) |
|---|---|---|---|---|
| **window** | COMMON 0.6545 s | COMMON 1.0000 s | PER-EVENT (= the indexed band) | none |
| **g3 gradient (pp)** | **3.93** | **3.81** | **11.93** | **0.59** |
| **g3 CI 95 %** | [0.80, 7.01] | [1.02, 6.48] | [9.15, 14.76] | [-0.96, 2.21] |
| **g3 verdict** | **RESOLVED-CONFIRM** | **RESOLVED-CONFIRM** | **RESOLVED-CONFIRM** | **UNRESOLVED** |
| **resolved at ALL THREE grains** | yes | yes | yes | NO |
| **monotone at g3** | no | no | yes | no |
| **fill: events /team/SEASON, binding (top) band** | 14.7 | 14.7 | 14.7 | 15.7 |
| **book speaks in the top band** | 100.0 % | 100.0 % | 100.0 % | 100.0 % |
| **veto declines the top band, per book** | **65.7 %** | **67.1 %** | **80.0 %** | **48.6 %** |
| **book agrees with the population there** | 65.7 % | 67.1 % | 80.0 % | 51.4 % |
| **ordering stable across seed blocks** | NO | NO | yes | NO |
| **commensurability — what the body reads from its OWN events** | his own arrival band · a fixed stopwatch · the distance to the man he dived at | same, one stopwatch longer | his own arrival band · **his own recovery timer** · that distance | his own arrival band · did I get the ball |
| **what the veto consumes** | an ordering of ratios over a clock the world does not vary | same | an ordering partly produced by the index itself | an ordering that does not resolve here |

### ⭐ THE RECOMMENDATION (a recommendation with its arithmetic — the COMMANDER ratifies, #203)

```text
LABEL   sepGainedCommonLong  —  a MISSED lunge is PUNISHED iff, 1.0000 s after he lunged,
        the carrier he dived at was FURTHER AWAY than at the instant he lunged.
        t0 is the CARRIER (#266.2(i)); the window is COMMON — the same number of seconds for
        every band — and it is LONGER than every band's own recovery, so no band is scored
        while its body is still on the floor. The threshold is ZERO metres.
GRAIN   g3 (walk+jog · run+drive · OVERCOMMITTED), with W_short (0.6545 s) as the named
        FALLBACK rung — it carries the same verdict at every grain.
```

**The arithmetic, in order of the charter's own questions:**

1. **THE GRADIENT SURVIVES A COMMON CLOCK.** 3.81 pp, CI [1.02, 6.48], RESOLVED-CONFIRM — and RESOLVED-CONFIRM at **all three grains** (g5 3.73 pp · g2 4.15 pp). The punishment is therefore **world-taught**: faster arrivals really are left behind more often, measured on a stopwatch the world does not get to lengthen.
2. **AND THE CLOCK WAS REAL TOO.** The picked label's 11.93 pp decomposes into ≈ 3.81 pp of world and ≈ 8.12 pp of window (68 % of the gradient was the sliding clock). #278.2(i)'s HIGH is upheld as a finding, not merely as a risk: a book keyed to the own-recovery window would learn, in majority, its own index.
3. **RESOLVABILITY AT g3.** half-width 2.73 pp at N = 251 — inside the charter's ±3–4 pp requirement, and the tightest of the two common rungs (W_short 3.10 pp).
4. **FILL.** 14.7 events per team-season in the binding OVERCOMMITTED band (min 7), and the book **speaks in 100 % of books at every band** — no ABSENT-band problem at this grain in a full season. Per team per match: walk+jog 6.72 · run+drive 7.25 · OVERCOMMITTED 2.12.
5. **WHAT THE VETO DOES WITH IT.** Replayed on 70 season books: it declines the overcommitted band in 67 % of books against 50 % / 43 % for the slower groups — the asymmetry points the right way, and the veto is decline-only, so the wrong-way books cost patience, never recklessness.
6. **WHY NOT THE ORIGINAL PICK.** It is sharper at book grain (declines the top band in 80 % of books vs 26 % at walk+jog, and its ordering is the only one stable across all four seed blocks) — but that sharpness IS largely the clock, and L3-C0's own runner-up rejection ("a deterministic function of the indexed state carries no information a band label does not already have") lands on it. It is not empty — a third of its gradient is world — but a cleaner label with the same sign is available, so the confounded one should not be the frozen one.
7. **WHY NOT P(won).** Re-examined on its consumer's own terms and it fails there, not merely on absolute flatness: the ordering **does not resolve** at g3 on a fresh block (0.59 pp, [-0.96, 2.21], UNRESOLVED) and L3-C0's inverted reading did not replicate; the population book would decline the **MIDDLE** group (walk+jog no · run+drive YES · OVERCOMMITTED no), not the fast one; per-book agreement with even that is 56 % / 57 % / 51 % — a coin flip. Its event stream is the best in the set (every lunge is an event, 15.7 per team-season even in the top band), so if the commander wants the "don't waste lunges" LESSON, the fill is there — but this world does not currently teach a stable ordering for it.

**⚠ THE ONE OPEN DESIGN QUESTION FOR L3-T0, stated rather than solved (#203).** A common window is a NUMBER OF SECONDS, and M-L3.2 forbids constants in the book. This label's window must therefore enter T0 as a TRACED or DOSED quantity, not a typed one — the contract's own truth-dosing idiom (M-L3.3: "the instrument writes L3-C0's census values") already covers it, and the engine's own nearest constant is the incumbent miss price, at which L3-C0 measured the same quantity as FLAT-to-inverted. So the rung matters and the seam must carry it honestly. That is a T0 design point for the commander, not a fact this instrument can settle.

### Gate table

| gate | result |
|---|---|
| `gDet` | **PASS** |
| `xSrcUntouched` | **PASS** |
| `xFpProd` | **PASS** |
| `gWorld` | **PASS** |
| `gConstTrace` | **PASS** |
| `gBandsDerived` | **PASS** |
| `gDetect` | **PASS** |
| `gLawsRederived` | **PASS** |
| `gWindowsDerived` | **PASS** |
| `gPaired` | **PASS** |
| `gReproL3c0` | **PASS** |
| `gVetoForm` | **PASS** |
| `gNonVac` | **PASS** |
| `gBoot` | **PASS** |
| `gSeed` | **PASS** |
| `gStats` | **PASS** |
| `gEnvClean` | **PASS** |
| `gN` | **PASS** |
| `gValuesUnreachable` | **PASS** |
| `gHashEnvelope` | **PASS** |
| `gMutants` | **PASS** |

⭐ **THE HEADLINE COUNT, HAND-CHECKED**: the artifact's `gates` object carries exactly **21** keys — `gDet · xSrcUntouched · xFpProd · gWorld · gConstTrace · gBandsDerived · gDetect · gLawsRederived · gWindowsDerived · gPaired · gReproL3c0 · gVetoForm · gNonVac · gBoot · gSeed · gStats · gEnvClean · gN · gValuesUnreachable · gHashEnvelope · gMutants` — and **21** of them pass. ⭐⭐ **91 / 91 mutants LIVE**, over **91** conjuncts enumerated FROM THE GATE OBJECTS THEMSELVES (uncovered conjuncts: 0).

### The N rule as executed

```text
rule            N* = min( max( ceil( N0 · (hw0 / 0.03)² ), 60 ), floor(0.5 h / msPerMatch), 700 )
terms           N0 158 · hw0 3.78 pp (L3-C0's committed g3 own-recovery CI) · target 3.00 pp · ms/match 270.2
precision term  251   ·   wall term 6661   ·   seed-room cap 700
⇒ N*            251   (binding: precision)   ·   as executed N 251, overridden false
```


---

## §SEEDS — consumption, as walked (#163, booked = walked)

| block | seeds | status |
|---|---|---|
| reserved | 12,481,000–12,481,049 | unused |
| guard block (every preflight) | 12,481,050–12,481,099 | walked by the preflights only |
| decomposition battery | 12,481,200–12,481,450 (N = 251) | **CONSUMED** |
| determinism anchor (walked twice) | 12,481,998 | **CONSUMED** |
| `gWorld` construction seed | 12,481,999 | constructed, **never stepped** |
| ⭐⭐ THE DECLARED RECEIPT re-walk | 12,480,200–12,480,211 | **receipt** (predicate INVERTED — it must collide) |

**Remaining in the band:** 12,481,000–049 · 12,481,100–199 · 12,481,451–997.
**Stats stream:** base **111,000**, step 200, minimum gap 200 to every published base.
⇒ **the next block is ≥ 12,482,000 and the next stats base ≥ 111,200.**

## §CHECKS (#226.1)

```text
$ npx tsc --noEmit
(clean)

$ L3C0B_N=4 L3C0B_SKIP_FP=1 npx tsx scripts/probes/l3-c0b-window-decomposition.ts
  → routed onto the GUARD block, written to /tmp (a preflight may never write a canonical path)
  GATES RED: xFpProd, gNonVac, gEnvClean, gN, gMutants   ← the preflight's own shape
  mutants 80/90 live  ← THREE REAL exactly-one violations found here (see §DEV 1)

$ L3C0B_N=21 npx tsx scripts/probes/l3-c0b-window-decomposition.ts     (after the three fixes)
  GATES RED: gEnvClean, gN, gMutants   (all three RED BY CONSTRUCTION in a preflight)
  mutants 86/90 live — every remaining dead mutant belongs to a by-construction-RED gate

$ npx tsx scripts/probes/l3-c0b-window-decomposition.ts        (THE RECORD RUN, first attempt)
  GATES *** RED ***: gDetect, gLawsRederived, gMutants (18/21)
  ← A REAL INSTRUMENT DEFECT, caught by the gate: ONE armed challenge of 8,987 (§DEV 2)

$ npx tsx scripts/probes/l3-c0b-window-decomposition.ts        (THE RECORD RUN, after §DEV 2's fix)
  liveness: 21 gate objects · 91 conjuncts enumerated FROM THE OBJECTS
  GATES GREEN (21) · mutants 91/91 live · re-derives true · crossOut true
  exit 0 · resultSha256 f56a6848a3065aaa159c8306a28ec742fd65de0bec3ca1d9f06d8b03f1f0dba5
  artifact docs/world-model/data/l3-c0b-window-decomposition.json   (~30 s in the foreground)

$ npx tsx scripts/analysis/l3-c0b-decomposition-result.ts docs/world-model/data/l3-c0b-window-decomposition.json
  → the whole §RESULT section above, on stdout
```

⭐ Every command run in this round is transcribed above. `npm test` is **not** re-run and is named
rather than implied: this round adds **one probe, one generator, one artifact and one doc**, touches
**no** `tests/**` file and **no** `src/**` byte (`xSrcUntouched` is a HARD gate comparing the WORKTREE
against HEAD and PASSES on the run that wrote the artifact), so the suite's state is the one banked
at the previous commit.

## §DEV — deviations, disclosures and what the gates caught

1. ⭐ **THE CONJUNCT-GRAIN AUDIT (#266.3(b)) CAUGHT THREE EXACTLY-ONE VIOLATIONS BEFORE THE FREEZE
   COMMIT.** `gPaired.longerCommonWindowsCensorAtLeastAsMuch`,
   `gPaired.censoringIsSmallEnoughToBeAnAside` and `gN.theTargetHalfWidthIsInsideTheCharterBand`
   each flipped their own conjunct **and disturbed a sibling**. Each was fixed the banked way — by
   giving the conjunct its **own input field** to mutate (`censorLadder`,
   `censoredOfThePopulation`, `targetInBand`) rather than a shared one.
2. ⭐⭐ **A POST-FREEZE INSTRUMENT CORRECTION, DISCLOSED IN FULL — the gate caught it, not a human.**
   The first record run went RED on `gDetect` and `gLawsRederived`: over 251 matches the engine's
   own ledger counted **one** armed challenge (seed 12,481,357, tick 13,784) for which **no cooldown
   jump was visible at post-step**. The cause is not a mystery and was diagnosed before anything was
   changed: the tick's own whistle produced a **restart**, and the restart erased the cooldown the
   duel mechanic had just written. It is exactly CB-C0 §DEV 2's WHISTLED class arriving by a second
   route. The correction: an engine-ledger event with no visible jump is **counted as a whistled
   duel** (so the three ledger identities stay EXACT) and is **excluded from every table** — it
   never reaches a band — with a **new conjunct**, `gDetect.everyLedgerOnlyEventIsARestartErasure`,
   asserting that such an event can never occur while the ball is in play (measured: **0** did).
   The battery was then re-run **from scratch on the same seeds**. ⭐ What did NOT change: the
   candidate set, the windows, the grains, the estimator, the N rule, the seed ledger and every
   other gate predicate. What DID change: the classification of one event out of 8,987, and the
   conjunct count 90 → 91. The 21-gate list of the freeze commit is unchanged at gate grain.
3. ⚠ **PREFLIGHT DISCLOSURE, INCLUDING A DEVIATION FROM L3-C0'S TIGHTER DISCIPLINE.** Two preflight
   invocations ran on the guard block before the freeze commit (N = 4 and N = 21). L3-C0 §DEV 3 read
   only gate verdicts, mutant liveness and detector counters from its preflights; **this round also
   read the N = 21 preflight's g3 shape block** — i.e. guard-block candidate rates were seen before
   the freeze commit. Stated plainly rather than buried. Two facts bound the damage and both are
   checkable: (a) the frozen design was **not touched afterwards** — the probe committed at the
   freeze is byte-identical to the one that produced that preflight, and the doc was written after
   it; (b) the things a peek could have steered are not this round's to steer — the candidate set,
   the two window rungs and the grain were fixed **by ruling #278.2(i)** before this stage existed.
   The census block itself was virgin at the freeze commit.
4. **THE TEAM-SEASON BOOK IS A VOLUME PROXY, NOT A FRANCHISE.** The veto replay groups the battery
   into consecutive blocks of the League's own fixture count (traced: 7) × side. That reproduces the
   **event volume** a season-reset book would hold, not the identity of a franchise meeting the same
   opponents. It is the right instrument for "how much evidence does a book have when the veto reads
   it"; it is not a claim about any particular team.
5. **THE RECEIPT RE-WALK IS ONE STATISTIC AND NOTHING ELSE.** Twelve of L3-C0's own committed seeds,
   one comparison (348 tabulated misses = its committed 348). No rate, no candidate and no verdict
   was computed from those twelve matches, and its seed predicate is INVERTED because a re-walk that
   came back clash-free would prove it was walking fresh seeds instead of reproducing a receipt.
6. **THE BATTERY RAN IN THE FOREGROUND** (~30 s of walking at N = 251, ~110 ms/match): a background
   job plus a monitor would have cost more than the run.

## §DOUBTS

1. ⭐⭐ **WHAT SURVIVES A COMMON CLOCK IS SMALL, AND IT IS NOT A LADDER.** The common-window gradient
   is +3.81 pp (W_long) / +3.93 pp (W_short) at g3 and it is **not monotone**: walk+jog 79.24 %,
   run+drive 78.58 %, OVERCOMMITTED 83.05 %. The world does not teach "the faster you arrive the
   worse it gets" — it teaches **"overcommitting is punished"**, one step, at the band above v\*.
   Everything the commander might want to read as a smooth ladder in L3-C0's own-recovery column was
   the clock.
2. ⭐⭐ **THE STRONGEST ARGUMENT AGAINST THIS ROUND'S OWN RECOMMENDATION: the common labels' ordering
   is NOT stable across seed blocks.** Read on the battery's four quarters, `sepGainedCommonLong`
   gives 77.2 % for the overcommitted band in block 1 (its **lowest** group) and 86.7 % in block 3
   (its highest). The only candidate whose argmax and argmin bands are stable across all four blocks
   is the **original pick** — and it is stable precisely because a deterministic clock term is
   stable by construction. So the recommendation trades a stable-but-confounded signal for an
   honest-but-noisy one. That is a commander-level trade and it is stated, not hidden.
3. ⚠ **THE SURVIVING SIGNAL IS WINDOW-DEPENDENT, AND THE RUNG IS LOAD-BEARING.** It is present at
   0.65 s and 1.0 s. At the ENGINE's own duel horizon (the incumbent miss price, 1.2 s) L3-C0's
   committed reading of the same quantity is **flat-to-inverted** (`sepGainedH1` at g3: 84.0 % /
   80.9 % / 81.6 %, −2.38 pp, UNRESOLVED — quoted after reading its corrections section, which
   leaves that row unamended). Named mechanism, **UNTESTED** (a labelled hypothesis, not a finding):
   by ~1.2 s the next phase of play has washed the duel out. A book keyed to a 1.0 s window is
   therefore keyed near the edge of the phenomenon, and T1 should measure the label's sensitivity to
   the rung rather than assume it.
4. **NO LABEL RESOLVES ITS ORDERING INSIDE ONE TEAM-SEASON.** At ~15 events in the binding band the
   belief's SE is ≈ 11 pp against gradients of ~4 pp. The replay makes the consequence concrete:
   the recommended label declines the overcommitted band in 67 % of season books — so about a third
   of books get that band "wrong" in the first season. The veto is **decline-only**, so a wrong book
   costs patience, never recklessness (that is the form doing its job) — but L3-T1 must run
   multi-season or accept honest ABSENT/wrong-early behaviour, exactly as L3-C0 already warned.
5. ⚠ **P(won)'s ORDERING DID NOT REPLICATE.** L3-C0 read the g3 take-rate difference as
   RESOLVED-INVERT (−2.07 pp) on its own block; this fresh block reads +0.59 pp UNRESOLVED for the
   punishment complement. Two blocks, two answers, both inside noise ⇒ the honest statement is that
   **this world does not currently carry a stable P(won) ordering by arrival band**, not that it
   carries one in either direction.
6. **THE RATES ARE CONDITIONAL** (L3-C0 non-claim 4, inherited). A body who arrives at 6.45 m/s is
   challenging a different carrier in a different place from one who arrives at 0.85 m/s, and that
   state is part of the price. Nothing here is a counterfactual.
7. **A COMMON WINDOW IS A NUMBER, AND M-L3.2 FORBIDS CONSTANTS.** The recommendation's honest
   consequence is that L3-T0 must carry the rung as a traced or census-dosed quantity. The one
   window the engine already owns (1.2 s) is the one where the signal is gone. That tension is real
   and it is the commander's to resolve, not this instrument's (#203).

## §COMMANDER CORRECTIONS OF RECORD + THE LABEL RULING (#279.2/#279.3, 2026-08-15)

The verify: windows proven genuinely common (doctored the derivation, the gate went RED);
carrier-anchoring walked at both ends; the pairing proven same-events; every decision-table cell
re-derived (own bootstrap); the veto replay reproduced exactly; the candidate set proven CLOSED;
machine-liveness and exactly-one broken in copies and both held; the post-freeze diff proven to be
ONLY the disclosed §DEV 2 hunk. VERDICT: PASS-WITH-FINDINGS. Adjudicated:

* **(i) MED RATIFIED — ⭐ THE THIRD #276.3-CLASS STRIKE**: "the charter's ±3–4 pp requirement" has
  NO source (the contract states no pp figure; the true provenance is L3-C0 §PICK's sizing
  COLUMNS — a target from a different document), and the conjunct that "checks" it compares one
  typed constant to two typed bounds (unfalsifiable without a source edit — the dead-conjunct
  class wearing a citation). CORRECTED OF RECORD: criterion 3 reads "meets L3-C0's OWN ±3 pp
  sizing target"; the conjunct is DEMOTED. ⭐ THE CLASS IS NOW A HAT-TRICK (#276.3 · #278.2(ii) ·
  here) — wrong-source/wrong-cell citation joins the STANDING verify hunt list permanently: every
  attributed number gets its source OPENED, not pattern-matched.
* **(ii) LOWs recorded**: "both inside noise" mischaracterised L3-C0's RESOLVED-INVERT (honest
  form: one resolved, one not — the instability conclusion survives) · §1's one-liner says
  "same misses" over the unpaired table (§2 is the paired form and agrees) · the applied short
  rung is 0.6500 s (39 ticks), disclosed · ⭐ the tie-break between the two surviving rungs was
  NOT a frozen criterion and was exercised post-sight by a runner who had seen guard-block shape
  numbers — damage bounded (both rungs CONFIRM at all grains), and the tie-break authority now
  reverts to the ruling below · "no ABSENT-band problem" read stronger than #278.1's banked
  limit (two senses of fill; §DOUBTS 4 carries the honest one).

### THE LABEL RULING (#279.3 — what L3-T0 freezes)

1. ⭐⭐ **THE QUANTITY IS RATIFIED**: the defence book's punishment label = **carrier-anchored
   separation gained by the carrier over a COMMON window** after a missed lunge. The
   decomposition proved the world-taught part exists (+3.8–3.9 pp, RESOLVED at every grain on
   BOTH common rungs) and quantified the confound (68 % of the original pick's gradient was its
   own clock). The original pick (`sepGainedOwnRecovery`) is FORMALLY DEAD as a label — its
   stability was the stability of a deterministic clock. `P(won)` is FORMALLY REJECTED on its
   consumer's own terms (the L3-C0 ordering did not replicate; 70-book veto replay = coin-flip
   agreement).
2. ⭐ **THE WINDOW**: T0 derives it from ENGINE CONSTANTS ONLY — no typed number, no census
   value reachable from src (G-NOTABLE). The principled family is named: the stationary-misser
   recovery bound `sqrt(2·R_TACKLE/ACCEL) + π/TURN_RATE ≈ 0.405 + 0.483 = 0.888 s` — every term
   the engine's own, and it sits INSIDE the proven live regime [0.65, 1.0] (the signal is dead
   by the incumbent 1.2 s horizon — L3-C0's H1 reading, quoted corrections-checked). T0 freezes
   the exact derivation; ⭐ COMMENSURABILITY (#256.2): T1's convergence yardstick re-measures
   the census truth AT THE FROZEN WINDOW inside its own instrument — L3-C0b's rungs were the
   decomposition's, not the yardstick's.
3. ⭐ **THE GRAIN: g2** — RECKLESS vs CONTROLLED (the overcommitted band against the rest).
   Reasons on the record, all measured: the shape is a STEP, not a ladder (both censuses);
   the binding band's fill is least-starved at the coarsest grain; the football lesson is
   binary (don't dive at full tilt). g3 is the NAMED FALLBACK if T1's ex-ante sizing prefers it.
4. **THE STABILITY CAVEAT REGISTERED**: no label resolves its ordering inside one team-season
   (SE ≈ 11 pp at ~15 binding-band events vs ~4 pp gradients) ⇒ T1 sizes MULTI-SEASON ex ante
   from the committed moments; the block-instability of the common-window ordering is the
   world's own noise floor, not an instrument defect — and DECLINE-ONLY means a wrong book
   costs patience, never recklessness: the fail-safe direction is the design's own virtue.
   F-L3-a (the ordering never audibly emerges) remains a live, honest outcome.
