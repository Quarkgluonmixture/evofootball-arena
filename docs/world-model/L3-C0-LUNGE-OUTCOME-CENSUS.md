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

## §RESULT

*(pending — this half of the document is the FREEZE COMMIT; the battery is read after it.)*
