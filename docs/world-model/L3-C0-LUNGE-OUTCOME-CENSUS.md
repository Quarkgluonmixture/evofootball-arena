# L3-C0 — THE LUNGE-OUTCOME CENSUS (扑上去了会怎样：这个世界自己的真相)

Status: **FROZEN (this half), then RUN.** Per **#266.3(c)** everything from §0 to §NON-CLAIMS —
the world, the population, the arrival bands and their coarser grains, the punishment CANDIDATES,
the windows and their traces, the estimator, the ⭐ #246 shape predicate, the gate list (frozen
**after** the machine-liveness audit), the N rule and the seed ledger — lands in **its own commit
BEFORE any battery is read**, so git corroborates frozen-before-sight rather than self-attestation.
The measured numbers arrive only in [§RESULT](#result) at the foot, and every number there is
**GENERATED PROGRAMMATICALLY** from the committed artifact by a committed generator
(`scripts/analysis/l3-c0-census-result.ts`), never typed (#229.2).

⚠ **This document reports; it does not adjudicate (#203).** The #246 shape flags are mechanical CI
readings. The **LABEL PICK** in §PICK is a *recommendation with its arithmetic* — the **COMMANDER
ratifies it**, and L3-T0 does not start here.

Authority chain: the **DEFENCE-BOOK CONTRACT**
[`CB-L3-DEFENCE-BOOK-CONTRACT.md`](CB-L3-DEFENCE-BOOK-CONTRACT.md) **§3 L3-C0** (and **§2 M-L3.1**,
the observable label this census is choosing the definition of), bound and dispatched by ruling
**#277**. Form precedents: [`EK-C0-HOLD-OUTCOME-CENSUS.md`](EK-C0-HOLD-OUTCOME-CENSUS.md) (**THE
CENSUS FORM** — the N rule, the full-accounting table, the event-rate moments, the yardstick
schema) and [`CB-C0-DISPOSSESSION-CENSUS.md`](CB-C0-DISPOSSESSION-CENSUS.md) (**THE DUEL
DETECTOR, THE v\* BAND FAMILY and THE REFUSAL CLASS**) — ⭐ both read **including their
§COMMANDER CORRECTIONS sections** before any number of theirs was quoted (#276.3's canon; the
corrections that bind here are named in §TRACE). World of record:
[`CB-AFTERMATH-POLISH.md`](CB-AFTERMATH-POLISH.md) + its corrections (#273.2). Hygiene canon:
**#163** · **#181.2** · **#200** · **#203** · **#229.2** · **#246** · **#247** · **#250.3** ·
**#256.3** · **#258.3** · **#261.2 / #262.2** · **#263.2** · **#266.2(i)** · **#266.3(a,b,c)** ·
**#268.2(iv)** · ⭐⭐ **#268.3(a)** (LIVENESS BY MACHINE, EXACTLY-ONE ENFORCED) · **#270.2 /
#272.3(ii)** (clock honesty) · **#273.3** (tree-clean gates compare WORKTREE vs HEAD) ·
**#276.3** (a stage-doc number is quotable only after its corrections section is checked).

> ⭐ **INSTRUMENT-ONLY ROUND.** `src/**` is **byte-untouched** — `xSrcUntouched` is a HARD gate and
> compares the **WORKTREE against HEAD** (#273.3), plus an untracked-file conjunct. **Nothing
> measured here reaches any player** (#247): this table is the truth L3-T1 will score learned
> books against, and the sizing source L3-T0/T1 take their run length from.

---

## §0 THE QUESTION, in football

Ruling #274 named the disease: 还有点乱抢. #273's world already **punishes** diving in — χ condemns
a lunge by geometry, and a beaten lunger pays the recovery interval his own body needs — but
**nothing learns from the punishment**. Before a defence can earn "don't dive in from here", three
things have to be measured in the world as it stands:

1. **What does a lunge actually cost, by how fast he arrived?** Photograph every armed standing
   challenge by the lunger's OWN arrival speed and read the take rate and the geometric-miss share
   off the band.
2. **WHICH punishment can a team actually observe?** The contract names three candidate labels and
   refuses to guess between them: the recovery interval paid · the carrier retained/gained at a
   **carrier-anchored** t0 · a concession inside a window. This census measures **all of them** and
   picks by arithmetic.
3. **How often would a book see one?** Events per band per team per match — and per season — is the
   difference between a book that fills and a starving grain (the T2-C0 rarity lesson).

And the symmetric half: **the restraint that already exists** — the jockey refusal — counted per
band, because it is the behaviour the learned belief will make *more* likely and it is unpriced by
history today.

## §WORLD — the polished armed world, and nothing else

```text
match       new Match({ seed, teamA: team('A', seed*2+1), teamB: team('B', seed*2+2),
                        ...a4MatchFlags(6) });  armA4World(match, null, 6)
assertion   cbArmedVersion(match) === 6            (the play entry's own arming, dose 1.0 uniform)
duration    the ENGINE DEFAULT match clock (MATCH_DURATION) — never overridden (#270.2)
```

This **is** the #273 truth: the world the user played and passed at #274, with the knock-and-go and
the derived marker in it. `gWorld` reads every conjunct back off a **freshly constructed,
never-stepped** match: armed at version 6, all three CB doors open, **no eye, no book, no forced
seam**, no engine door set, the default duration.

## §TRACE — where every number in the instrument comes from

Nothing here is a typed metre, second or radian. Three sources are *read* at run time and each is a
gate (`gConstTrace`, a mutant per conjunct):

| constant | source (extracted at run time) | what it is |
|---|---|---|
| `R_TACKLE` | `src/sim/mechanics.ts` — the `tryTackles` candidate scan `if (d < 1.15 && d < best)` | the challenge radius |
| `CB_TACKLE_RADIUS` | `src/sim/carryBeat.ts` — the CB module's own copy | asserted **equal** to the above |
| `MISS_COOLDOWN_S` / `MISS_STUN_S` | `mechanics.ts` — the INCUMBENT miss price | the flat pair the armed branch replaces; still the traced duel horizon |
| `WIN_COOLDOWN_S` | `mechanics.ts` — the win branch | names a WIN in the detector |
| slide / grab / smother / GK-aerial cooldowns | `mechanics.ts` | the other writers of `tackleCooldown`, traced so no jump is misread |
| `ACCEL` | `src/sim/Player.ts` (`const ACCEL = 14`) | the body's acceleration constant |
| `TURN_RATE` · `DT` · `MATCH_DURATION` · `HALF_L` | imported | the engine's own |
| `TEAMS_PER_DIVISION` | `src/sim/League.ts` | ⇒ **season fixtures per team** = that − 1 (the round-robin the League schedules) |
| the display clock | `Match.minute()`'s own expression + `MATCH_DURATION` | the R-乙 CLOCK_LAW mapping, both terms extracted |

⭐ **A TRACE FINDING, STATED EX ANTE.** CB-C0 asserted **six** assignments to `tackleCooldown` in
`mechanics.ts`. The CB-T0 seam added a **seventh** — the armed miss branch's
`tackler.tackleCooldown = rec.total` — so this census's conjunct is
`sevenTackleCooldownWriters`, all seven traced. (CB-C0's number is not wrong of record; the world
moved under it. Its §COMMANDER CORRECTIONS section carries no amendment to that row.)

### ⭐⭐ HOW AN ARMED CHALLENGE IS SEEN WITHOUT TOUCHING THE ENGINE

CB-C0's detector, inherited, plus the armed world's own in-engine ledger:

* `Match.step` runs brains → executors → `physicsStep` (which **decrements** every cooldown) →
  `stepBall`, whose owned-ball branch writes the glued ball (`ball.pos` from the carrier,
  `ball.vel = owner.vel`) and **then** runs the duel mechanics. So at POST-STEP a **strict increase**
  of `tackleCooldown` is a duel mechanic firing, and the geometry read at that instant **is** the
  instant the mechanic saw: `tryTackles` writes no position and no velocity, and the ball's carried
  position was written earlier in the same call.
* The armed miss branch no longer writes a constant, so the value cannot name the branch alone.
  The **ENGINE'S OWN LEDGER** does: `cbLedger.armedChallenges` (+1 per armed lunge, both outcomes),
  `cbLedger.recoveries` (+1 per armed MISS) and `cbLedger.recoverySeconds` (+= the interval he
  paid). `tryTackles` picks **at most one** tackler per tick, so the per-tick deltas classify the
  event exactly — and `gDetect` proves it: detected lunges **=** `armedChallenges`, detected misses
  **=** `recoveries`, detected standing wins + slide wins **=** the engine's own `stats.tackles`
  delta, zero unclassified cooldown jumps, never two lunges in a tick.
* ⚠ **THE WHISTLED DUEL IS EXCLUDED** (CB-C0 §DEV 2, inherited): a missed lunge can become a foul,
  and a penalty/sending-off makes the post-step geometry the RESTART's. Whistled duels are
  **counted** and excluded from every table and from both law re-derivations.

### ⭐⭐ χ AND THE RECOVERY INTERVAL ARE RE-DERIVED, NEVER IMPORTED

The probe re-implements the commitment factor χ and the three-leg recovery interval from the traced
constants, and **never imports `carryBeat.ts`'s versions** — so `gLawsRederived` is a check and not
a tautology:

```text
χ        = clamp( max over t ≤ sqrt(2R/a) of [ ½·a·t² − |(ball + ballVel·t) − (pos + vel·t)| ] / R , 0, 1 )
recovery = |v|/a  +  θ(momentum → ball)/TURN_RATE  +  sqrt(2·d/a)
```

* the χ re-derivation's **χ = 0 count** is checked against the engine's own `geometricMisses`
  counter (the only admissible residue is the whistled set, whose geometry is the restart's);
* the recovery re-derivation is checked **per event** against the interval the engine wrote, at a
  **DERIVED** tolerance — the ANGLE-RESOLUTION QUANTUM `sqrt(2·ε)/TURN_RATE` (the polish's bound as
  **relabelled of record** by #273.2(ii)); ⭐ per §DOUBTS 4 of that round, a run that exceeds it is
  answered by **re-deriving the bound, never by hand-widening it**;
* and the summed intervals are checked against `cbLedger.recoverySeconds` over the whole population.

## §BANDS — frozen, CB-C0's OWN v\* family

```text
v*   = sqrt(2 · ACCEL · R_TACKLE)          the arrival that cannot be braked inside the challenge
                                            radius (CB-C0 §BINS' identity, re-derived from the two
                                            traced constants; check: v*²/(2a) = R exactly)
cuts = the QUARTERS of v*                   b0 walk · b1 jog · b2 run · b3 drive · b4 OVERCOMMITTED
```

⭐ **THE BAND IS THE LUNGER'S OWN VELOCITY, READ AT THE LUNGE DECISION** — the self-percept
(M-L3.1: the book indexes what the chooser reads; the #256.2/#257.2 commensurability rule applied
at the source). It is not a truth-side quantity and no truth-side band is ever computed.

⭐ **THE COARSER GRAINS ARE CONTIGUOUS UNIONS OF THE FIVE, NEVER NEW CUTS** (the T2-C0 rarity
lesson: a starving grain is a wrong grain, and the census sizes the grain):

| grain | groups |
|---|---|
| **g5** | b0 · b1 · b2 · b3 · b4 |
| **g3** | walk+jog · run+drive · OVERCOMMITTED |
| **g2** | controlled (< v\*) · OVERCOMMITTED (≥ v\*) |

`gBandsDerived` proves v\* is the braking identity, that the cuts are its quarters, and that every
grain is an ordered partition of the same five bands.

## §CANDIDATES — every punishment label the contract names, measured side by side

For **every MISSED lunge** (the population M-L3.1's label closes on), at the lunger's own band:

**(a) THE RECOVERY INTERVAL PAID** — the engine's own price, in seconds: full distribution per band
(n, mean, SD, **min**, p10, median, p90, max) plus the binary
`recoveryOverIncumbent` = *he paid more than the incumbent flat price* (`MISS_COOLDOWN_S`, traced —
no invented threshold).

**(b) THE CARRIER RETAINED / GAINED, CARRIER-ANCHORED (#266.2(i))** — ⭐ **the t0 anchor is the
CARRIER, never the ball.** CB-C0's own Δsep/Δspace columns were RATIFIED WRONG on exactly this
point (its §COMMANDER CORRECTIONS (i)), and its binding instruction is followed here:

```text
sep(t)    = | taker − CARRIER |            (never taker − ball)
space(t)  = | CARRIER − his nearest opponent |
labels    sepGainedH1 · sepGainedOwnRecovery · spaceGainedH1     (Δ > 0, no threshold constant)
```

**(c) THE CONCESSION WITHIN A WINDOW** — the loss semantics and the window family are **TRACED, not
re-typed**:

```text
LOSS            a TEAM-level turnover at DV-C0's own possession-segment semantics: a maximal
                interval of same-owner-TEAM control while phase === 'playing', suspended while the
                ball is loose in play, ended by an OPPONENT establishing ownership. A dead ball is
                NOT a loss. ⭐ PROVED, not promised: G-REPRO-DVC0 re-walks DV-C0's own committed
                smoke block (12,429,000–011) in BARE PRODUCTION with THIS probe's walker and must
                reproduce its eleven committed integers.
KEPT-THROUGH-W  the carrier's team still holds it W after the miss — i.e. NO turnover with the
                carrier's team as loser is stamped inside W. (The lunger's team never got it back.)
WINDOWS         the two shortest rungs are the ENGINE'S OWN duel horizons (MISS_COOLDOWN_S and
                twice it — CB-C0's H1/H2); the rest are DV-C0's committed ladder 5/10/15/20 s with
                its committed PRIMARY 10 s, checked to be a member of the #218 co-occurrence family
                (read off the goal-genealogy census's own artifact) and integer multiples of that
                family's minimum.
ownRecovery     ⭐ a PER-EVENT window: the recovery interval THIS lunger actually paid — the only
                window in the set the world itself chose for him.
shot / goal     `shotConcededPrimary` / `goalConcededPrimary`: the carrier's team took a shot /
                scored inside the primary window.
```

A window truncated by full time is **CENSORED, not a zero**: the event leaves the denominator and
the censored count is published (censoring can only lose events, never manufacture them).

## §WITHHELD — the restraint that already exists

CB-C0 §FORM (ii), inherited verbatim: a tick at which an eligible candidate (`tryTackles`' own
predicate — an opponent of the carrier, not sent off, no cooldown, no stun, inside `R_TACKLE` of the
ball) stood there and **no lunge fired**, indexed by **that candidate's own arrival band**. ⚠ It is
a **TICK DENSITY, not an event rate** (a declined challenge leaves no mark in the world), and it is
published per band per team per match on the match clock.

## §ESTIMATOR

Cluster bootstrap by **match seed** (#20) — the set grain — **2,000** resamples, percentile 95 % CI,
**ratio-of-sums**. ⭐ **ONE SHARED resample-index matrix**, so every rate *and* every band
DIFFERENCE (the #246 predicates) is computed on the same resampled clusters — the differences are
paired by construction. Stats stream base **110,800** (ruling #277's floor, on the 200 grid),
disjoint from the match RNG (#163). ⭐ **Per-cluster cells are STORED** (`perClusterCells`: per seed
× **side** × band — every count, every moment sum, every window's numerator and denominator, and the
recovery-interval pool), so **every number in §RESULT re-derives without a re-run** (#256.3), and
the per-SIDE storage is what makes "per team per match" a stored grain rather than a division.

**CLOCK HONESTY (#270.2 / #272.3(ii)).** The battery runs the engine's default match clock and every
count rate is published **per match / per team per match on that clock (convention A)** with the
display-clock (90′) mapping printed beside it from the extracted
`displaySecondsPerSimSecond`. No rate is published on a third clock.

## §SHAPE — the ⭐ #246 check, PRE-REGISTERED

> **FASTER ARRIVAL ⇒ MORE PUNISHED.** CB-T0's physics predicts it: overrun and the recovery interval
> are monotone in arrival speed, so a body who lunged from further up the speed scale should be
> punished more often on **every** candidate label.

Frozen predicate, evaluated at **every grain** and for **every candidate**: the paired
cluster-bootstrap CI of `(top band) − (bottom band)` excluding zero ⇒ `RESOLVED-CONFIRM` ·
`RESOLVED-INVERT` · `UNRESOLVED`; the per-band point sequence's **monotonicity** is reported beside
it. ⚠⚠ **AN INVERSION IS A FINDING, NOT AN ERROR** (#246): it is PUBLISHED as measured and **ROUTED
TO DIAGNOSIS**, never corrected into the table, and this document does not adjudicate it (#203).

## §PICK — how the frozen label and grain will be chosen (the rule, frozen before the numbers)

The contract instructs this census to PICK, by arithmetic, and hand the pick up. The three criteria
are frozen here, before any battery is read:

1. **RESOLVABLE GRADIENT AT FEASIBLE N.** The candidate's top−bottom difference must be resolvable
   at this battery's own N, shown with the CI arithmetic (and the implied N for a target
   half-width, from the measured per-cluster variance).
2. **A BOOK MUST BE ABLE TO FILL IT.** Events per band **per team per match** and **per team per
   season** (season = the League's own round-robin, traced), with the dispersion and the zero-share
   — the T2-C0 rarity lesson. A grain that starves is the wrong grain; collapsing bands is the
   remedy and the arithmetic for the collapse is shown.
3. **COMMENSURABILITY WITH WHAT A BOOK CAN OBSERVE FROM ITS OWN EVENTS** (the EK-C0 §0 lesson): the
   label must close from events the lunging team itself witnesses, with **no counterfactual** and no
   quantity that requires knowing what would have happened had he jockeyed.

The pick and the runners-up (with why not) go in §PICK's results block as the **T0 HANDOFF**. ⭐ The
commander ratifies; **L3-T0 does not start in this round**.

## §NRULE — EK-C0 / CB-C0's rule form, with this census's own numerator

```text
N* = min( max( ceil(600 / rarestBandMissesPerMatch), 60 ),
          floor(0.5 h / msPerMatch),
          700 )
```

The numerator is **a MISSED LUNGE in the rarest ARRIVAL BAND at the g5 grain** — the scarcest
numerator any published punishment rate has. **600** events ⇒ a rate near ½ carries SE ≈ 2.0 pp, so
a band DIFFERENCE carries SE ≈ 2.9 pp and gradients from ~6 pp up are resolvable: that is the
precision §PICK criterion 1 needs, and it is why the target is 600 rather than DV-C0's ordering-only
60. `rarestBandMissesPerMatch` and `msPerMatch` are the **only two numbers** the full run reads out
of the committed sizing artifact; they feed **only** N. The 700 cap is the reserved seed room.
⭐ **THE ZERO-EVENT CLAUSE** (frozen with the rest): if the sizing sees zero misses in the rarest
band the precision term is **UNBOUNDED** — it will not be invented — and the wall term and the cap
bind; `gN.precisionTermIsBounded` records which way it went.

## §GATES — the frozen list (every conjunct mutant-flipped, EXACTLY-ONE ENFORCED)

⭐⭐ **LIVENESS BY MACHINE (#268.3(a)):** the coverage map is enumerated **from the gate objects
themselves** at startup; a conjunct without a mutant, or a mutant naming a conjunct that does not
exist, makes the probe **REFUSE TO RUN** (exit 3). Every mutant must **flip its own conjunct AND
leave every other conjunct of that gate unchanged** (`live = flipped && othersSurvived`).
⭐ Per #266.3(b) the list below was frozen **after** a conjunct-grain dead-predicate audit — the
audit's own findings are recorded in §DEV.

| gate | asserts |
| --- | --- |
| `gDet` | the whole measured core of the anchor seed re-derives **bit-identically** on a second independent walk |
| `xSrcUntouched` | ⭐ `git diff HEAD -- src` empty **and** `git status --porcelain -- src` empty — the WORKTREE against HEAD (#273.3), HARD |
| `xFpProd` | the shipped League fingerprint re-derives: 3 seeds × 2 seasons headless equal their frozen baselines |
| `gWorld` | armed at `cbArmedVersion === 6`, all three CB doors open, no eye/book/seam, no engine door, the default match clock, read back on a **never-stepped** match |
| `gConstTrace` | every duel/motion/clock/season constant is EXTRACTED from `src/**` at run time; the CB module's radius equals `tryTackles`'; **seven** `tackleCooldown` writers, all traced |
| `gBandsDerived` | v\* is the braking identity, the cuts are its quarters, every grain is an ordered partition of the five |
| `gDetect` | detected lunges = the engine's `armedChallenges`; detected misses = `recoveries`; standing wins + slide wins = the engine's `stats.tackles`; no unclassified cooldown jump; never two lunges in a tick; every unwhistled duel inside `R_TACKLE`; tabulated + whistled = every lunge |
| `gLawsRederived` | ⭐⭐ the INDEPENDENT χ re-derivation agrees with the engine's own geometric-miss counter (residue confined to whistled duels); the recovery law re-derives on **every** unwhistled miss inside the DERIVED tolerance; the summed intervals equal `cbLedger.recoverySeconds`; the tolerance is the derived quantum, not a chosen bar |
| `gAccounting` | every tabulated lunge sits in exactly one band; wins + misses = the band population; refusal cells cover every refusal tick; kept-counts are **monotone** in the window and longer windows **censor more**; every band carries lunges; every miss carries a recovery reading |
| `gReproDvc0` | ⭐⭐ the loss semantics **are** DV-C0's: its own committed smoke block (its artifact's own recorded base/n) re-walked in bare production, **eleven** committed integers reproduced |
| `gWindowTrace` | the primary window **is** DV-C0's committed primary, the ladder **is** its committed ladder, the primary is a member of the #218 family, the ladder are multiples of that family's minimum, and the two shortest rungs are the ENGINE's own duel horizons |
| `gNonVac` | every published rate has a non-empty denominator **at its own claim grain** (#263.2 — checked over every grain × every candidate), the withheld baseline exists, misses exist, wins exist, > 1 cluster |
| `gBoot` | ONE shared resample matrix, B = 2000, indices in range, clusters = the walked seeds |
| `gSeed` | booked = walked: every interval inside band **12,480,000–999**, pairwise disjoint, disjoint from the ledger — and ⭐ the re-walk receipt's predicate **INVERTED** (it must collide) |
| `gStats` | stats base at/above **110,800**, on the 200 grid, clear of every published base |
| `gEnvClean` | whitelist-or-refuse held, no override set, no preflight aimed at a canonical path |
| `gN` | N is the frozen rule's output, both terms from the **committed** sizing artifact, and the precision term was bounded |
| `gValuesUnreachable` | none of the published rates appears in `src/**` (raw 5-dp **and** formatted-percentage forms), with non-vacuity floors on the needle and file sets and a control needle that must be found |
| `gHashEnvelope` | ⭐ the hashed body carries **no invocation context**; the digest re-derives off disk; a second invocation to another path with another envelope re-derives the **identical** stripped digest (cross-`OUT` acceptance, #266.3(a)) |
| `gMutants` | every conjunct of every gate has a mutant and every mutant is `live` |

⭐ **THE HEADLINE COUNT, HAND-CHECKED against this frozen list (#250.3(i)):** the table has **20**
rows — `gDet · xSrcUntouched · xFpProd · gWorld · gConstTrace · gBandsDerived · gDetect ·
gLawsRederived · gAccounting · gReproDvc0 · gWindowTrace · gNonVac · gBoot · gSeed · gStats ·
gEnvClean · gN · gValuesUnreachable · gHashEnvelope · gMutants` — and the probe REFUSES to publish
unless the artifact's `gates` object carries exactly those 20 keys.

**No gate reads a rate.** The #246 flags are mechanical CI readings: an inversion turns nothing red.

## §ENV — whitelist-or-refuse (#261.2 / #262.2)

Accepted: `L3C0_MODE` (sizing|full, REQUIRED) · `L3C0_N` · `L3C0_SIZING_N` · `L3C0_SKIP_FP` ·
`L3C0_OUT`. ANY other `L3C0_*`, and ANY of the ENGINE's own doors, is a FATAL refusal (exit 2).
Every override makes the run a **PREFLIGHT**: it is routed onto the GUARD block, it may never write
a canonical repo path (checked on the RESOLVED absolute path), it reads its **own /tmp sizing file**
rather than the committed one, and `gEnvClean` goes RED.

## §SEEDS — the ledger (#163, booked = walked)

Band **12,480,000–12,480,999** (ruling #277.2's pre-registration), opened above R-乙's consumption
through 12,479,999.

| block | seeds | kind |
|---|---|---|
| reserved (unused this round) | 12,480,000–12,480,049 | reserved |
| ⭐ exit-semantics **guard block** | 12,480,050–12,480,099 | reserved — where EVERY preflight invocation is routed |
| sizing smoke | 12,480,100–12,480,104 (5) | the committed sizing artifact's own block |
| census battery | 12,480,200 – 12,480,200+N−1 (N ≤ 700) | the battery |
| determinism anchor (G-DET, walked twice) | 12,480,998 | anchor |
| `gWorld` construction seed | 12,480,999 | constructed, **never stepped** |
| ⭐⭐ **G-REPRO-DVC0 re-walk** | 12,429,000–12,429,011 | **receipt** — DV-C0's own smoke block |

⭐ **THE RE-WALK'S PREDICATE IS INVERTED**: it *must* collide with the consumed ledger, because a
re-walk that came back clash-free would prove it is walking fresh seeds instead of reproducing a
receipt. Every other block carries the ordinary predicate. Stats base **110,800**, step 200.

## §NON-CLAIMS

1. **NOTHING SHIPS.** Zero `src/**` bytes (worktree vs HEAD); the production fingerprint re-derived
   unchanged; no flag, no gene, no eye, no book anywhere.
2. ⭐⭐ **THE TABLE IS WIRED INTO NO PLAYER (#247).** It is instrument-side truth: the yardstick
   L3-T1 scores learned books against and the sizing source L3-T0/T1 take their run length from.
3. **NO PASS/FAIL ON ANY MEASURED RATE.** The gates are the X-family, the trace gates, the detector
   and law identities, the DV-C0 inheritance receipt, the accounting identities and the mutant
   liveness proof.
4. **THE RATES ARE CONDITIONAL, NOT CAUSAL.** Arrival bands are not randomly assigned: a body who
   arrives at 6 m/s is challenging a different carrier in a different state from one who arrives at
   1 m/s, and that state is part of the price. **No counterfactual is claimed** — the counterfactual
   is precisely the quantity the contract §0 says a team cannot observe.
5. **THE WITHHELD CHALLENGE IS A TICK DENSITY, NOT AN EVENT RATE** (CB-C0 §DEV 2, inherited), and
   the four non-standing duel mechanics are counted but never pooled into the band tables.
6. **THE WINDOW LADDER AND THE GRAIN LIST ARE REPORTING GRIDS.** L3-T0 freezes ONE label and ONE
   grain — the commander's ratification of §PICK.
7. **THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203).** L3-T0 / L3-T1 / L3-T2 are the
   contract's, and none of them starts here.

---

<a id="result"></a>

<!-- §RESULT is generated: npx tsx scripts/analysis/l3-c0-census-result.ts docs/world-model/data/l3-c0-lunge-outcome-census.json -->

## §RESULT

**158 seeds × 1 arm (THE POLISHED ARMED WORLD — the play entry's own arming, `cbArmedVersion === 6`), block 12,480,200–12,480,357, 20/20 gates PASS**, `resultSha256` `67cd4b22…`. Every number below is printed by `scripts/analysis/l3-c0-census-result.ts` from the committed artifact; none is typed (#229.2).

### The run

```text
world             the POLISHED ARMED world — a4MatchFlags(6) + armA4World(match, null, 6), dose 1.0
matches           158   (242.0431 sim-seconds each — the ENGINE DEFAULT match clock)
armed challenges  5554   (33.5949 per match · 16.7975 per TEAM per match)
  won             328      missed 5226
  whistle-excl.   246   (the tick's own whistle moved the ball or the taker — CB-C0 §DEV 2)
  TABULATED       5308   (the band tables' population)
geometric misses  2584   (χ = 0 — his own momentum had lost the duel before the roll)
refusal ticks     3927   (12.4272 per team per match; proximity ticks 9481)
other duels       slide 990 · tactical grab 949   (counted, NEVER pooled into the band tables)
turnovers         5621   (35.5759 per match, DV-C0 semantics — one every 6.8036 s)
v*                sqrt(2 · ACCEL · R_TACKLE) = 5.674504 m/s   cuts 1.4186 / 2.8373 / 4.2559 / 5.6745
primary window    10 s (DV-C0's own committed primary, in the #218 family [5,10])
window ladder     1.2 / 2.4 / 5 / 10 / 15 / 20 s   + the PER-EVENT ownRecovery window
law receipts      max recovery-law deviation 3.553e-15 s against the DERIVED tolerance 3.242e-9 s
estimator         cluster bootstrap by match seed, 2000 resamples, stats base 110800
clock             convention A (the 240 s match clock) throughout; × 22.5 maps a per-match count onto the 90′ display clock
```

### ⭐⭐ THE LUNGE TABLE — what an armed standing challenge is, BY ARRIVAL BAND

| arrival band | window (m/s) | lunges | wins | **P(won \| lunged)** | CI 95 % (pp) | geometric-miss share | mean χ | lunges /team/match | refusal ticks /team/match |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| b0 walk | [0.000, 1.419) | 864 | 56 | **6.481 %** | [4.79, 8.25] | 41.551 % | 0.178 | 2.734 | 2.253 |
| b1 jog | [1.419, 2.837) | 1381 | 103 | **7.458 %** | [6.22, 8.71] | 41.781 % | 0.177 | 4.370 | 3.601 |
| b2 run | [2.837, 4.256) | 1380 | 87 | **6.304 %** | [4.95, 7.67] | 47.681 % | 0.145 | 4.367 | 3.016 |
| b3 drive | [4.256, 5.675) | 1024 | 48 | **4.688 %** | [3.47, 6.00] | 56.836 % | 0.114 | 3.241 | 2.392 |
| b4 OVERCOMMITTED | [5.675, ∞) | 659 | 33 | **5.008 %** | [3.51, 6.52] | 42.792 % | 0.164 | 2.085 | 1.165 |

**ALL BANDS**: 5308 tabulated lunges, 328 won ⇒ **6.179 %**; geometric misses 46.525 % of every armed challenge; the withheld challenge is **41.420 %** of all proximity ticks.

### CANDIDATE (a) — THE RECOVERY INTERVAL PAID (the engine's own law), full distribution

| arrival band | misses | mean (s) | SD | **min** | p10 | median | p90 | max | share ABOVE the incumbent flat price |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| b0 walk | 808 | **0.6545** | 0.1254 | **0.3147** | 0.4787 | 0.6643 | 0.8151 | 0.9626 | 0.000 % |
| b1 jog | 1278 | **0.7220** | 0.1197 | **0.4046** | 0.5604 | 0.7208 | 0.8837 | 1.0646 | 0.000 % |
| b2 run | 1293 | **0.8010** | 0.1033 | **0.5046** | 0.6709 | 0.7980 | 0.9399 | 1.1384 | 0.000 % |
| b3 drive | 976 | **0.8836** | 0.0956 | **0.6318** | 0.7638 | 0.8794 | 1.0075 | 1.1996 | 0.000 % |
| b4 OVERCOMMITTED | 626 | **0.9872** | 0.0949 | **0.7365** | 0.8460 | 1.0011 | 1.0981 | 1.2825 | 0.959 % |

### CANDIDATE (b) — THE CARRIER-ANCHORED SEPARATION PICTURE (#266.2(i): t0 is the CARRIER, never the ball)

| arrival band | sep at t0 (m) | Δsep over H1 (m) | Δsep over HIS OWN recovery (m) | ⭐ Δsep ÷ his own recovery (m/s) | Δspace over H1 (m) |
|---|---:|---:|---:|---:|---:|
| b0 walk | 1.2427 | 2.2046 | **0.6032** | **0.9215** | 1.6315 |
| b1 jog | 1.2694 | 2.0200 | **0.6842** | **0.9476** | 1.4490 |
| b2 run | 1.3039 | 2.0447 | **0.8879** | **1.1085** | 1.4646 |
| b3 drive | 1.3795 | 2.0696 | **1.1125** | **1.2590** | 1.4929 |
| b4 OVERCOMMITTED | 1.2576 | 1.9529 | **1.3563** | **1.3739** | 1.4055 |

> ⭐ The last-but-one column is the label's own confound made visible and then answered: the per-event window IS longer for a faster arrival, so the raw Δ must be divided by it. It still rises with arrival speed — the carrier pulls away FASTER, not merely for longer.

### THE PUNISHMENT-CANDIDATE TABLE — grain `g5` (b0 walk · b1 jog · b2 run · b3 drive · b4 OVERCOMMITTED)

| candidate | b0 walk | b1 jog | b2 run | b3 drive | b4 OVERCOMMITTED | ⭐ top − bottom (pp) | CI 95 % | #246 verdict | monotone |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| `recoveryOverIncumbent` | 0.0 % <sub>n=808</sub> | 0.0 % <sub>n=1278</sub> | 0.0 % <sub>n=1293</sub> | 0.0 % <sub>n=976</sub> | 1.0 % <sub>n=626</sub> | **0.96** | [0.31, 1.74] | **RESOLVED-CONFIRM** | yes |
| `sepGainedH1` | 85.3 % <sub>n=804</sub> | 83.2 % <sub>n=1274</sub> | 80.2 % <sub>n=1291</sub> | 81.8 % <sub>n=972</sub> | 81.6 % <sub>n=621</sub> | **-3.68** | [-7.51, 0.12] | **UNRESOLVED** | no |
| `sepGainedOwnRecovery` | 72.9 % <sub>n=805</sub> | 70.5 % <sub>n=1276</sub> | 72.7 % <sub>n=1292</sub> | 77.9 % <sub>n=975</sub> | 82.2 % <sub>n=622</sub> | **9.24** | [4.35, 13.98] | **RESOLVED-CONFIRM** | no |
| `spaceGainedH1` | 79.6 % <sub>n=804</sub> | 78.2 % <sub>n=1274</sub> | 75.3 % <sub>n=1291</sub> | 77.4 % <sub>n=972</sub> | 75.0 % <sub>n=621</sub> | **-4.56** | [-9.15, -0.21] | **RESOLVED-INVERT** | no |
| `keptOwnRecovery` | 87.3 % <sub>n=805</sub> | 85.6 % <sub>n=1276</sub> | 89.0 % <sub>n=1292</sub> | 86.9 % <sub>n=975</sub> | 85.0 % <sub>n=622</sub> | **-2.28** | [-5.98, 1.30] | **UNRESOLVED** | no |
| `keptThrough1p2s` | 76.2 % <sub>n=804</sub> | 75.9 % <sub>n=1274</sub> | 80.2 % <sub>n=1291</sub> | 79.8 % <sub>n=972</sub> | 79.7 % <sub>n=621</sub> | **3.47** | [-0.74, 7.47] | **UNRESOLVED** | no |
| `keptThrough2p4s` | 58.4 % <sub>n=799</sub> | 59.5 % <sub>n=1266</sub> | 64.4 % <sub>n=1288</sub> | 63.8 % <sub>n=969</sub> | 59.9 % <sub>n=621</sub> | **1.46** | [-4.03, 6.58] | **UNRESOLVED** | no |
| `keptThrough5s` | 42.6 % <sub>n=796</sub> | 41.1 % <sub>n=1257</sub> | 43.7 % <sub>n=1282</sub> | 42.8 % <sub>n=964</sub> | 42.6 % <sub>n=613</sub> | **-0.01** | [-5.05, 4.96] | **UNRESOLVED** | no |
| `keptThrough10s` | 23.7 % <sub>n=782</sub> | 27.2 % <sub>n=1235</sub> | 26.6 % <sub>n=1263</sub> | 26.9 % <sub>n=953</sub> | 25.5 % <sub>n=605</sub> | **1.80** | [-3.03, 6.50] | **UNRESOLVED** | no |
| `keptThrough15s` | 14.3 % <sub>n=769</sub> | 18.5 % <sub>n=1206</sub> | 18.0 % <sub>n=1243</sub> | 17.9 % <sub>n=933</sub> | 18.0 % <sub>n=593</sub> | **3.74** | [-0.55, 7.99] | **UNRESOLVED** | no |
| `keptThrough20s` | 8.0 % <sub>n=754</sub> | 12.7 % <sub>n=1186</sub> | 12.5 % <sub>n=1220</sub> | 11.5 % <sub>n=919</sub> | 12.7 % <sub>n=584</sub> | **4.71** | [1.40, 8.07] | **RESOLVED-CONFIRM** | no |
| `shotConcededPrimary` | 33.9 % <sub>n=782</sub> | 33.5 % <sub>n=1235</sub> | 36.8 % <sub>n=1263</sub> | 33.8 % <sub>n=953</sub> | 32.7 % <sub>n=605</sub> | **-1.16** | [-6.39, 3.98] | **UNRESOLVED** | no |
| `goalConcededPrimary` | 8.1 % <sub>n=782</sub> | 7.8 % <sub>n=1235</sub> | 8.0 % <sub>n=1263</sub> | 7.7 % <sub>n=953</sub> | 9.3 % <sub>n=605</sub> | **1.20** | [-1.83, 4.29] | **UNRESOLVED** | no |

### THE PUNISHMENT-CANDIDATE TABLE — grain `g3` (walk+jog · run+drive · OVERCOMMITTED)

| candidate | walk+jog | run+drive | OVERCOMMITTED | ⭐ top − bottom (pp) | CI 95 % | #246 verdict | monotone |
|---|---:|---:|---:|---:|---:|---|---|
| `recoveryOverIncumbent` | 0.0 % <sub>n=2086</sub> | 0.0 % <sub>n=2269</sub> | 1.0 % <sub>n=626</sub> | **0.96** | [0.31, 1.74] | **RESOLVED-CONFIRM** | yes |
| `sepGainedH1` | 84.0 % <sub>n=2078</sub> | 80.9 % <sub>n=2263</sub> | 81.6 % <sub>n=621</sub> | **-2.38** | [-5.70, 0.87] | **UNRESOLVED** | no |
| `sepGainedOwnRecovery` | 71.4 % <sub>n=2081</sub> | 74.9 % <sub>n=2267</sub> | 82.2 % <sub>n=622</sub> | **10.75** | [7.00, 14.55] | **RESOLVED-CONFIRM** | yes |
| `spaceGainedH1` | 78.7 % <sub>n=2078</sub> | 76.2 % <sub>n=2263</sub> | 75.0 % <sub>n=621</sub> | **-3.69** | [-7.62, 0.23] | **UNRESOLVED** | no |
| `keptOwnRecovery` | 86.3 % <sub>n=2081</sub> | 88.1 % <sub>n=2267</sub> | 85.0 % <sub>n=622</sub> | **-1.21** | [-4.55, 2.10] | **UNRESOLVED** | no |
| `keptThrough1p2s` | 76.0 % <sub>n=2078</sub> | 80.0 % <sub>n=2263</sub> | 79.7 % <sub>n=621</sub> | **3.68** | [0.02, 7.33] | **RESOLVED-CONFIRM** | no |
| `keptThrough2p4s` | 59.1 % <sub>n=2065</sub> | 64.2 % <sub>n=2257</sub> | 59.9 % <sub>n=621</sub> | **0.82** | [-3.61, 5.15] | **UNRESOLVED** | no |
| `keptThrough5s` | 41.7 % <sub>n=2053</sub> | 43.3 % <sub>n=2246</sub> | 42.6 % <sub>n=613</sub> | **0.88** | [-3.23, 5.03] | **UNRESOLVED** | no |
| `keptThrough10s` | 25.8 % <sub>n=2017</sub> | 26.7 % <sub>n=2216</sub> | 25.5 % <sub>n=605</sub> | **-0.38** | [-4.52, 3.94] | **UNRESOLVED** | no |
| `keptThrough15s` | 16.9 % <sub>n=1975</sub> | 18.0 % <sub>n=2176</sub> | 18.0 % <sub>n=593</sub> | **1.18** | [-2.48, 5.18] | **UNRESOLVED** | yes |
| `keptThrough20s` | 10.9 % <sub>n=1940</sub> | 12.1 % <sub>n=2139</sub> | 12.7 % <sub>n=584</sub> | **1.79** | [-1.26, 4.80] | **UNRESOLVED** | yes |
| `shotConcededPrimary` | 33.7 % <sub>n=2017</sub> | 35.5 % <sub>n=2216</sub> | 32.7 % <sub>n=605</sub> | **-0.94** | [-5.33, 3.24] | **UNRESOLVED** | no |
| `goalConcededPrimary` | 7.9 % <sub>n=2017</sub> | 7.9 % <sub>n=2216</sub> | 9.3 % <sub>n=605</sub> | **1.37** | [-1.12, 4.10] | **UNRESOLVED** | no |

### THE PUNISHMENT-CANDIDATE TABLE — grain `g2` (controlled (< v*) · OVERCOMMITTED (≥ v*))

| candidate | controlled (< v*) | OVERCOMMITTED (≥ v*) | ⭐ top − bottom (pp) | CI 95 % | #246 verdict | monotone |
|---|---:|---:|---:|---:|---|---|
| `recoveryOverIncumbent` | 0.0 % <sub>n=4355</sub> | 1.0 % <sub>n=626</sub> | **0.96** | [0.31, 1.74] | **RESOLVED-CONFIRM** | yes |
| `sepGainedH1` | 82.4 % <sub>n=4341</sub> | 81.6 % <sub>n=621</sub> | **-0.73** | [-3.73, 2.32] | **UNRESOLVED** | no |
| `sepGainedOwnRecovery` | 73.3 % <sub>n=4348</sub> | 82.2 % <sub>n=622</sub> | **8.90** | [5.72, 12.09] | **RESOLVED-CONFIRM** | yes |
| `spaceGainedH1` | 77.4 % <sub>n=4341</sub> | 75.0 % <sub>n=621</sub> | **-2.36** | [-6.07, 1.31] | **UNRESOLVED** | no |
| `keptOwnRecovery` | 87.2 % <sub>n=4348</sub> | 85.0 % <sub>n=622</sub> | **-2.16** | [-5.27, 0.95] | **UNRESOLVED** | no |
| `keptThrough1p2s` | 78.1 % <sub>n=4341</sub> | 79.7 % <sub>n=621</sub> | **1.59** | [-1.85, 5.05] | **UNRESOLVED** | yes |
| `keptThrough2p4s` | 61.7 % <sub>n=4322</sub> | 59.9 % <sub>n=621</sub> | **-1.83** | [-6.26, 2.46] | **UNRESOLVED** | no |
| `keptThrough5s` | 42.5 % <sub>n=4299</sub> | 42.6 % <sub>n=613</sub> | **0.03** | [-4.05, 4.35] | **UNRESOLVED** | yes |
| `keptThrough10s` | 26.3 % <sub>n=4233</sub> | 25.5 % <sub>n=605</sub> | **-0.84** | [-4.77, 3.44] | **UNRESOLVED** | no |
| `keptThrough15s` | 17.4 % <sub>n=4151</sub> | 18.0 % <sub>n=593</sub> | **0.60** | [-2.92, 4.42] | **UNRESOLVED** | yes |
| `keptThrough20s` | 11.5 % <sub>n=4079</sub> | 12.7 % <sub>n=584</sub> | **1.15** | [-1.77, 4.10] | **UNRESOLVED** | yes |
| `shotConcededPrimary` | 34.6 % <sub>n=4233</sub> | 32.7 % <sub>n=605</sub> | **-1.91** | [-6.15, 2.16] | **UNRESOLVED** | no |
| `goalConcededPrimary` | 7.9 % <sub>n=4233</sub> | 9.3 % <sub>n=605</sub> | **1.39** | [-0.93, 3.90] | **UNRESOLVED** | yes |

### ⭐ THE EVENT-RATE ARITHMETIC — what L3-T0/T1 size from (#256.3)

Per band **per team per match** on the 240 s match clock (convention A); the season column is the League's own round-robin (**7** league fixtures per team, traced from `League.ts`); the K grid is the MATCHES a single team must play for its book to hold K events in that band.

**grain `g5` — MISSED lunges (the population every candidate label closes on):**

| band | misses /team/match | SD | CV | median | p90 | zero-share | per SEASON | K=10 / 20 / 30 / 50 / 100 matches |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| b0 walk | **2.557** | 1.835 | 0.718 | 2 | 5 | 10.4 % | **17.9** | 4 / 8 / 12 / 20 / 40 |
| b1 jog | **4.044** | 2.434 | 0.602 | 4 | 7 | 3.2 % | **28.3** | 3 / 5 / 8 / 13 / 25 |
| b2 run | **4.092** | 2.760 | 0.674 | 4 | 8 | 4.7 % | **28.6** | 3 / 5 / 8 / 13 / 25 |
| b3 drive | **3.089** | 2.303 | 0.746 | 3 | 6.5 | 8.9 % | **21.6** | 4 / 7 / 10 / 17 / 33 |
| b4 OVERCOMMITTED | **1.981** | 1.543 | 0.779 | 2 | 4 | 14.6 % | **13.9** | 6 / 11 / 16 / 26 / 51 |

**grain `g2` — MISSED lunges (the population every candidate label closes on):**

| band | misses /team/match | SD | CV | median | p90 | zero-share | per SEASON | K=10 / 20 / 30 / 50 / 100 matches |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| controlled (< v*) | **13.782** | 6.376 | 0.463 | 12.5 | 22 | 0.0 % | **96.5** | 1 / 2 / 3 / 4 / 8 |
| OVERCOMMITTED (≥ v*) | **1.981** | 1.543 | 0.779 | 2 | 4 | 14.6 % | **13.9** | 6 / 11 / 16 / 26 / 51 |

And the WITHHELD-CHALLENGE baseline (the restraint that already exists, unpriced by history today):

| arrival band | refusal ticks /team/match | SD | zero-share | per SEASON | lunges /team/match | ⭐ refusal ticks per lunge |
|---|---:|---:|---:|---:|---:|---:|
| b0 walk | **2.253** | 2.722 | 20.3 % | 15.8 | 2.734 | 0.824 |
| b1 jog | **3.601** | 3.769 | 10.8 % | 25.2 | 4.370 | 0.824 |
| b2 run | **3.016** | 3.379 | 16.1 % | 21.1 | 4.367 | 0.691 |
| b3 drive | **2.392** | 3.223 | 29.4 % | 16.7 | 3.241 | 0.738 |
| b4 OVERCOMMITTED | **1.165** | 1.602 | 40.2 % | 8.2 | 2.085 | 0.558 |

### ⭐ THE #246 CHECK — PRE-REGISTERED, evaluated with paired CIs

> ⭐ #246, frozen BEFORE the battery: FASTER ARRIVAL ⇒ MORE PUNISHED (the top band's punishment rate exceeds the bottom band's), for EVERY candidate. An inversion is PUBLISHED and routed to diagnosis, NEVER corrected into the table.

Across 13 candidates × 3 grains = 39 pre-registered readings: **8** RESOLVED-CONFIRM · **30** UNRESOLVED · **1** RESOLVED-INVERT.

The take rate itself (CONTEXT, not a punishment label — the armed take is `p_incumbent · χ`):

| grain | top − bottom (pp) | CI 95 % | verdict |
|---|---:|---:|---|
| `g5` | -1.47 | [-3.68, 0.66] | **UNRESOLVED** |
| `g3` | -2.07 | [-3.86, -0.34] | **RESOLVED-INVERT** |
| `g2` | -1.32 | [-2.92, 0.26] | **UNRESOLVED** |

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
| `gAccounting` | **PASS** |
| `gReproDvc0` | **PASS** |
| `gWindowTrace` | **PASS** |
| `gNonVac` | **PASS** |
| `gBoot` | **PASS** |
| `gSeed` | **PASS** |
| `gStats` | **PASS** |
| `gEnvClean` | **PASS** |
| `gN` | **PASS** |
| `gValuesUnreachable` | **PASS** |
| `gHashEnvelope` | **PASS** |
| `gMutants` | **PASS** |

⭐ **THE HEADLINE COUNT, HAND-CHECKED**: the artifact's `gates` object carries exactly **20** keys — `gDet · xSrcUntouched · xFpProd · gWorld · gConstTrace · gBandsDerived · gDetect · gLawsRederived · gAccounting · gReproDvc0 · gWindowTrace · gNonVac · gBoot · gSeed · gStats · gEnvClean · gN · gValuesUnreachable · gHashEnvelope · gMutants` — and **20** of them pass. ⭐⭐ **86 / 86 mutants LIVE**, over **86** conjuncts enumerated FROM THE GATE OBJECTS THEMSELVES (uncovered conjuncts: 0).

### The N rule as executed

```text
rule            N* = min( max( ceil(600 / rarestBandMissesPerMatch), 60 ), floor(0.5 h / msPerMatch), 700 )
numerator       a MISSED LUNGE in the RAREST ARRIVAL BAND at the g5 grain
sizing artifact docs/world-model/data/l3-c0-lunge-outcome-census-sizing.json (COMMITTED; the only two numbers a full run reads from it)
rarest band     3.8 misses/match  ·  ms/match 270.2
precision term  158   ·   wall term 6661   ·   seed-room cap 700
⇒ N*            158   (binding: precision)   ·   as executed N 158, overridden false
```

### Registered non-claims (from the artifact)

1. NOTHING SHIPS: zero src/** bytes (xSrcUntouched compares the WORKTREE against HEAD, #273.3); the production fingerprint re-derives unchanged.
2. THE TABLE IS WIRED INTO NO PLAYER (#247). It is instrument-side truth: the yardstick L3-T1 scores learned books against, and the sizing source L3-T0/T1 take their run length from.
3. NO PASS/FAIL ON ANY MEASURED RATE. The #246 shape flags are mechanical CI readings.
4. THE RATES ARE CONDITIONAL, NOT CAUSAL: arrival bands are not randomly assigned, and the state that put a body in a band is part of the price. No counterfactual is claimed.
5. THE WITHHELD CHALLENGE IS A TICK DENSITY, NOT AN EVENT RATE (CB-C0 §DEV 2, inherited).
6. THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203). The label PICK is a RECOMMENDATION with its arithmetic; the COMMANDER ratifies it.

**VERDICT (the probe's own, mechanical):** L3-C0 LUNGE-OUTCOME CENSUS at N=158 × 1 arm (the polished armed world) — 20/20 gates, 86/86 mutants live. THE TABLE IS DESCRIPTIVE TRUTH; the #246 flags are mechanical and the commander adjudicates them (#203), as is the §PICK handoff.


---

## §PICK — ⭐⭐ THE T0 HANDOFF: the label and the grain, picked by the frozen §PICK arithmetic

⚠ **A RECOMMENDATION WITH ITS ARITHMETIC, NOT A RULING (#203).** The commander ratifies; L3-T0 does
not start in this round.

### THE PICK

```text
LABEL   sepGainedOwnRecovery
        — a MISSED lunge is PUNISHED iff, at the moment his own recovery interval ended, the
          carrier he dived at was FURTHER AWAY than at the instant he lunged.
          t0 is the CARRIER (#266.2(i)); the window is the interval the ENGINE'S OWN law made
          THIS body pay; the threshold is ZERO metres (no constant is introduced).
GRAIN   g3 — walk+jog · run+drive · OVERCOMMITTED (contiguous unions of CB-C0's v* quarters),
        with g2 (controlled | overcommitted) as the named fallback.
```

### CRITERION 1 — a resolvable per-band gradient at feasible N (the CI arithmetic)

| grain | bottom → top | ⭐ top − bottom | CI 95 % | half-width | N for a ±3 pp read | N for a ±2 pp read |
|---|---|---:|---:|---:|---:|---:|
| `g5` | 72.9 % → 82.2 % | **+9.24 pp** | [4.35, 13.98] | 4.82 pp | 407 | 916 |
| ⭐ `g3` | 71.4 % → 82.2 % | **+10.75 pp** | [7.00, 14.55] | 3.78 pp | 250 | 563 |
| `g2` | 73.3 % → 82.2 % | **+8.90 pp** | [5.72, 12.09] | 3.19 pp | 178 | 401 |

The implied N scales as `N × (half-width / target)²` off THIS battery's measured half-widths — so
L3-T1 can buy a ±2 pp reading of the true ordering for **563 matches** at the recommended grain, well
inside a single seed block. **`sepGainedOwnRecovery` is the ONLY candidate resolved at ALL THREE
grains**, and the only one that is **monotone** at the recommended one.

### CRITERION 2 — can a book actually fill it? (the T2-C0 rarity arithmetic)

The book is per-team and **season-reset** (M-L3.2), and the season is the League's own round-robin —
**7** league fixtures per team (traced). At the measured miss rates:

| grain | group | misses /team/match | per SEASON | belief SE after one season | 
|---|---|---:|---:|---:|
| `g3` | walk+jog | 6.60 | 46.2 | 6.65 pp |
| `g3` | run+drive | 7.18 | 50.3 | ~6.3 pp |
| `g3` | ⭐ OVERCOMMITTED | **1.98** | **13.9** | **10.26 pp** |
| `g2` | controlled | 13.78 | 96.5 | 4.50 pp |

`SE = sqrt(p(1−p)/n)` on the published per-band rates. ⭐ **THE BINDING CELL IS THE OVERCOMMITTED
BAND, AND IT IS THE SAME CELL AT EVERY FROZEN GRAIN** — collapsing bands cannot feed it, because it
is never split. So the grain choice is decided on the *other* side of the comparison the decline-only
veto actually makes (own band vs the rest of the book), and the season-one z-scores are:

```text
g5   gap  9.24 pp   SE 14.68 pp   z 0.63    ⇒ 9.7 team-seasons for a 95 % read
g3   gap 10.75 pp   SE 12.23 pp   z 0.88    ⇒ 5.0 team-seasons   ⭐ the best of the three
g2   gap  8.90 pp   SE 11.20 pp   z 0.79    ⇒ 6.1 team-seasons
```

⚠ **STATED PLAINLY: one team-season does not statistically resolve the ordering at ANY grain.** That
is not fatal to the mechanism and it is not hidden: the decline-only veto consumes an **ORDERING**,
not a significance test (the EK-T0 integer cross-multiplication idiom), and an empty band is ABSENT
rather than wrong. But it IS the honest sizing fact L3-T1 must design around, and the K grid says how
long the top band takes to fill: **6 / 11 / 16 / 26 / 51 matches for K = 10 / 20 / 30 / 50 / 100**.

### CRITERION 3 — commensurability: can the lunging team observe it from ITS OWN events?

Yes, and with nothing else in it. The label closes on three quantities the body himself owns: **his
own arrival velocity** (the band — the self-percept M-L3.1 requires), **his own recovery interval**
(the timer the engine hands him), and **the distance to the one man he dived at**, read at t0 and at
the end of that timer. No counterfactual — nothing asks what would have happened had he jockeyed
(the EK-C0 §0 lesson) — and no third body, no team-level bookkeeping, no ball-anchored quantity.

### THE RUNNERS-UP, and why not

| candidate | why not |
|---|---|
| **the concession family** (`keptThrough…`, the DV-C0 window ladder) | **FLAT.** 20 of 21 grain × rung readings are UNRESOLVED; the one CONFIRM (20 s at g5, +4.71 pp) does not survive the grain change. The mechanism is measured in the same artifact: this world turns the ball over every **6.80 s**, so a 10 s window is ~1.5 possessions and the label is dominated by global churn rather than by the lunge. (The EK-C0 saturation lesson, arriving from the other direction.) |
| **`spaceGainedH1`** | ⚠ **RESOLVED-INVERT** at g5 (−4.56 pp [−9.15, −0.21]): at a FIXED window the faster arrival's carrier gains *less* space. Routed to diagnosis (§DOUBTS 2), never corrected. |
| **`sepGainedH1`** (the same quantity at the fixed incumbent window) | flat-to-inverted at every grain — the fixed window is the wrong clock for this world (see §DOUBTS 2). |
| **the recovery interval paid** (`recoveryOverIncumbent`) | the CONTINUOUS quantity has the cleanest gradient in the whole census (0.655 → 0.987 s, monotone, non-overlapping p10/p90) — but it is a **DETERMINISTIC function of the very state the book already indexes**, so a per-band belief over it carries **no information a band label does not already have**. Its binary form starves: **6 events in the entire battery** (0.96 % of 626). Rejected on both limbs. |
| **the outcome itself** (`P(won \| lunged)`) | nearly flat and tiny: 6.5 / 7.5 / 6.3 / 4.7 / 5.0 %, top−bottom −1.47 pp (UNRESOLVED at g5, INVERT at g3). A book learning "I lose the duel" learns the same ~94 % everywhere. |
| **`shotConcededPrimary` / `goalConcededPrimary`** | flat (−1.16 pp / +1.20 pp, both UNRESOLVED) and the goal label is rare (7.9 %). |

---

## §SEEDS — consumption, as walked (#163, booked = walked)

| block | seeds | status |
|---|---|---|
| reserved | 12,480,000–12,480,049 | unused |
| guard block (every preflight) | 12,480,050–12,480,099 | walked by the preflights only |
| sizing smoke | 12,480,100–12,480,104 (5) | **CONSUMED** |
| census battery | 12,480,200–12,480,357 (N = 158) | **CONSUMED** |
| determinism anchor (walked twice) | 12,480,998 | **CONSUMED** |
| `gWorld` construction seed | 12,480,999 | constructed, **never stepped** |
| ⭐⭐ G-REPRO-DVC0 re-walk | 12,429,000–12,429,011 | **receipt** (predicate INVERTED — it must collide) |

**Remaining in the band:** 12,480,000–049 · 12,480,105–199 · 12,480,358–997.
**Stats stream:** base **110,800**, step 200, minimum gap 200 to every published base.
⇒ **the next block is ≥ 12,481,000 and the next stats base ≥ 111,000.**

## §CHECKS (#226.1)

```text
$ npx tsc --noEmit
(clean)

$ L3C0_MODE=sizing L3C0_SIZING_N=2 npx tsx scripts/probes/l3-c0-lunge-outcome-census.ts
  → routed onto the GUARD block, written to /tmp (a preflight may never write a canonical path)

$ L3C0_MODE=full L3C0_N=6 L3C0_SKIP_FP=1 npx tsx scripts/probes/l3-c0-lunge-outcome-census.ts
  GATES *** RED ***: xFpProd, gConstTrace, gEnvClean, gN, gMutants   ← the preflight's own shape
  (gEnvClean/gN red BY CONSTRUCTION in a preflight; the other two were REAL findings — see §DEV 1)

$ (deliberate break) one mutant deleted from gStats
  L3-C0 FATAL (#268.3(a)): the MACHINE-DERIVED coverage map has conjuncts without a mutant —
    · gStats.onTheGrid                                        ← the refusal fires, exit 3

$ L3C0_MODE=sizing npx tsx scripts/probes/l3-c0-lunge-outcome-census.ts
  ms/match 270.2 · rarest-band misses/match 3.8
  resultSha256 f1500da692a8ad08dd585022a5dd1b9ee73bc8bf3b68cfd2842d6e095e19fb1a
  artifact docs/world-model/data/l3-c0-lunge-outcome-census-sizing.json

$ L3C0_MODE=full npx tsx scripts/probes/l3-c0-lunge-outcome-census.ts
  liveness: 20 gate objects · 86 conjuncts enumerated FROM THE OBJECTS
  GATES GREEN (20) · mutants 86/86 live · re-derives true · crossOut true
  exit 0 · resultSha256 67cd4b22679e0c77190dc29201bb995f8a97edcba85e94b8401578575f7fe6fd
  artifact docs/world-model/data/l3-c0-lunge-outcome-census.json

$ npx tsx scripts/analysis/l3-c0-census-result.ts docs/world-model/data/l3-c0-lunge-outcome-census.json
  → the whole §RESULT section above, on stdout
```

⭐ Every command run in this round is transcribed above. `npm test` is **not** re-run and is named
rather than implied: this round adds **one probe, one generator, two artifacts and one doc**, touches
**no** `tests/**` file and **no** `src/**` byte (`xSrcUntouched` is a HARD gate comparing the WORKTREE
against HEAD and PASSES on the run that wrote the artifact), so the suite's state is the one banked at
the previous commit.

## §DEV — deviations and what the liveness audit caught

1. ⭐⭐ **THE CONJUNCT-GRAIN AUDIT (#266.3(b)) CAUGHT SIX REAL EXACTLY-ONE VIOLATIONS AND TWO WRONG
   TRACES, BEFORE THE FREEZE COMMIT.** Six mutants flipped their own conjunct but also disturbed a
   sibling (`gConstTrace.challengeRadiusTraced` · `gBandsDerived.vStarIsTheBrakingIdentity` ·
   `gDetect.detectedLungesAreTheEngineLedger` · `gAccounting.everyTabulatedLungeSitsInExactlyOneBand`
   · `gWindowTrace.primaryIsDvc0Primary` and `…ladderMultiplesOfTheFamilyMinimum` ·
   `gBoot.clustersAreTheWalkedSeeds`): each was fixed by giving the conjunct its **own input field**
   to mutate rather than a shared one. Two conjuncts were found DEAD because their premise was false:
   the `tackleCooldown` writer count is **seven**, not CB-C0's six (the armed branch is the seventh —
   recorded in §TRACE), and the display-clock regex did not match `Match.minute()`'s own expression.
   One conjunct (`gBandsDerived.grainsAreContiguousUnions`) was DELETED as **dead by construction**:
   the partition conjunct already checks the flattened grain equals `0..4` **in order**, which makes
   contiguity a theorem, not a test. This is the machine-liveness canon doing exactly its job.
2. ⭐ **THE DETECTOR IS RE-KEYED ONTO THE ENGINE'S OWN LEDGER, and it had to be.** CB-C0 named a
   standing miss by its cooldown VALUE (`1.2` with stun `0.35`). In the armed world that value is the
   derived recovery interval — a different real number on every miss — so the value cannot name the
   branch. The re-key uses `cbLedger.armedChallenges` / `recoveries` / `recoverySeconds`, which are
   pure bookkeeping the sim never reads, and `gDetect` proves the classification against the ENGINE'S
   OWN counters on all three limbs.
3. **THE PREFLIGHTS RAN BEFORE THE FREEZE COMMIT, ON THE GUARD BLOCK, AND ARE DISCLOSED.** Three
   preflight invocations (2–6 matches on 12,480,050+) were used to exercise the gate machinery. What
   was read from them: gate verdicts, mutant liveness, and the counters `gDetect` compares. No band
   rate, no candidate rate, no #246 verdict and no §PICK criterion was evaluated on them, and the
   census block was virgin at the freeze commit. Self-attested, as always, but the freeze commit is
   git-corroborated (#266.3(c)) and the probe file is IN it.
4. **A WHISTLED DUEL IS COUNTED AND EXCLUDED** (246 of 5,554 = 4.4 %) — CB-C0 §DEV 2's rule,
   inherited, and the reason the χ identity in `gLawsRederived` is stated as *disagreements confined
   to the whistled set* rather than as an exact equality (a penalty award relocates the ball inside
   the same tick, so a whistled duel's post-step geometry is the restart's). ⭐ **THE MEASURED RESIDUE
   IS 10 EVENTS**: the probe's independent re-derivation sees **2,584** χ-zero challenges against the
   engine's own counter of **2,574** — a gap of 10, i.e. **4.1 % of the 246 whistled duels** and
   **0.18 %** of the population, entirely inside the admissible set. On the UNWHISTLED population the
   probe sees 2,458 χ-zero events; the 10 disagreements can only live among the whistled ones,
   because nothing else can move the ball inside the tick the mechanic ran.
5. **THE `ownRecovery` WINDOW IS PER-EVENT AND THAT IS DELIBERATE.** It is the only window in the set
   the world itself chose for the lunger, and it is what makes the picked label his own experience
   rather than a clock someone else imposed. Its confound (the window is longer for a faster arrival)
   is measured and answered in the Δsep ÷ recovery column, not argued away.
6. **THE BATTERY RAN IN THE FOREGROUND** (22 s of walking at N = 158, 270 ms/match): a background job
   plus a monitor would have cost more than the run.

## §DOUBTS

1. ⭐⭐ **THE ARMED STANDING CHALLENGE ALMOST NEVER WINS THE BALL — 6.18 %**, against CB-C0's
   **37.1 %** in bare production. χ averages 0.15 and condemns **46.5 %** of all armed challenges by
   geometry before the roll. The bodies keep throwing them anyway: **16.80 lunges per team per
   match**. That is 乱抢 measured on the polished world, and it is the disease layer 3 exists to
   treat — but it also says the *level* of the take rate is now very low, which the pricing family
   (the #273.2(v) staleness question) may want to know.
2. ⭐ **AT A FIXED WINDOW THE PRE-REGISTERED SHAPE DOES NOT APPEAR — AND SPACE-GAINED INVERTS**
   (−4.56 pp at g5). Named mechanism, UNTESTED (a labelled hypothesis, not a finding): the fixed
   1.2 s window is ~1.5–2× the recovery a lunger actually pays in this world (median 0.66–1.00 s), so
   by H1 both arms are back on their feet and the difference has been washed out by everything that
   happened next; and a fast arrival is disproportionately a chase in open field, where the carrier's
   nearest opponent at t0 is already far. The probe that would settle it is a two-window contrast on
   the SAME events, which this census's stored cells already support.
3. **THE PICKED LABEL FIRES ON MOST MISSES** (71–82 %). The belief it feeds is therefore a
   discrimination *within* a common event, not a rare-event alarm; a decline-only veto that compares
   bands is fine with that, but a threshold form would not be.
4. ⚠ **THE ARMED WORLD'S MISS PRICE IS CHEAPER IN TIME THAN THE CONSTANT IT REPLACED.** The derived
   recovery interval is **below** the incumbent flat 1.2 s on **99.88 %** of misses (6 of 4,981) (medians 0.66 s at
   a walk to 1.00 s overcommitted). CB-T0 made diving-in *more likely to fail* (χ) while making it
   *quicker to recover from*. Both halves are the seam's own physics and nothing here is tuned — but
   the net price of recklessness is a commander-level question the pricing shelf owns, and it is the
   reason the "recovery over the incumbent" label starves.
5. **THE OVERCOMMITTED BAND CANNOT FILL WITHIN ONE SEASON** (13.9 misses per team per season) and no
   grain can fix it, because it is never split. L3-T1 must either run multi-season, pool teams, or
   accept an ABSENT band early in a season (M-L3.2's empty ⇒ absent rule already says the last one is
   legal).
6. **THE RATES ARE CONDITIONAL.** A body who arrives at 6 m/s is challenging a different carrier in a
   different place from one who arrives at 1 m/s. Nothing here is a counterfactual, and the census
   makes no claim that slowing down would have produced the slower band's numbers — that is precisely
   the quantity a team cannot observe, and it is why this table exists.
