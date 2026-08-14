# R-乙 — THE STANDING GAP TABLE (an institution, not a one-shot)

> Dispatched by **ruling #271.2** under
> [`RULER-COVERAGE-CONTRACT.md`](RULER-COVERAGE-CONTRACT.md) §1 R-乙, which exists
> to close **blind spot 5** of that contract's §0: *"THE GAP TABLE IS NOT AN
> INSTITUTION — the 2026-08-08 'ours vs real' census (#170–#173) was one-shot; no
> arc since has re-run it."*
>
> ⭐⭐ **THIS IS THE FREEZE HALF.** §RESULT is deliberately EMPTY in the freeze
> commit and lands in the results commit (#266.3(c)): the quantity list, the
> measurement semantics, the sizing rule, the seed ledger and the gate set are all
> declared here BEFORE any battery is read.

## §0 WHAT THIS INSTRUMENT IS

Not an A/B and not a gate. A **standing ruler**: ~20 quantities of our football,
measured with the instruments we already have, printed beside the published
real-football references, and **appended to an append-only ledger under a LABEL**.

The deliverable is the **standing-ness**:

* `RYI_LABEL` names an **epoch** (this first run: `post-CB`).
* [`docs/world-model/data/r-yi-gap-table-ledger.jsonl`](data/) gets **one line per
  (label, arm, quantity)** and is **never rewritten**. A label that already has
  rows is a **FATAL refusal**, so an epoch cannot be silently overwritten and two
  runs always diff cleanly.
* The contract's **RE-RUN TRIGGER**: after every arc that lands a world-facing
  mechanism. **Drift between labels is REPORTED to the ruling chain** — this
  instrument adjudicates nothing.

### §0.1 THE THREE COLUMN LAWS

| column | law |
|---|---|
| **OURS** | every row names the **existing** instrument semantics it is measured with, traced to the file that owns them. No row invents a measurement. Where a quantity is not measurable with existing semantics, the row says so **by name** (Q07) rather than improvising. |
| **REAL** | a cited published value with a confidence grade (HIGH/MED/LOW), or the honest word **UNSOURCED**. The **#170-vetted** bands are inherited, and the inheritance is **machine-checked** against the committed tempo-census artifact (`G-REAL-HONEST`) — proven, not asserted. |
| **STATUS** | **`UNADJUDICATED` on every row, always.** Deliberate arcade deviation · gap · unknown is the ruling chain's word (contract §1, §4; #203). The TypeScript type has exactly one member so the executor *cannot* write a verdict. |

### §0.2 WHAT IS NEW SINCE #170–#173

* **The take-on rows (Q10, Q11) are newly measurable.** In bare production a
  take-on does not exist (R-甲 A7: `performTouchPast` is reachable only through
  `Match.forcedTouchPast`, null in every production path) — so Q10 is
  **declared zero-by-structure** on that arm ex ante. The **CB play world has real
  dribbles**, so both arms are measured and labelled.
* **Nine rows are sourced this round** (Q06 pass completion · Q09 goals · Q11
  take-on success · Q13 cards · Q17/Q18 the margin tail · Q21 the dead-ball share),
  and **eight ship REAL = UNSOURCED** with the search recorded.
* **The #270.2 lesson is a GATE**, not a habit: `G-TRACE.ranOnTheMatchClock`
  proves from a constructed match that the battery ran on the engine's own
  `MATCH_DURATION` (240 sim-seconds = one real match, displayed as 90′). No rate
  in this document sits on a non-match clock.

## §NRULE — THE SIZING, FROZEN BEFORE THE SMOKE RAN

```text
N* = min( max( shareTerm, spellTerm, knockTerm ) ↑25 , wallTerm , seedRoom 500 )

shareTerm  = ceil( 0.25 / SE_target² ),  SE_target = 0.025 on a MATCH-LEVEL SHARE
             (Q17–Q19 are Bernoulli at match grain; 0.25 is the worst-case p=0.5
             variance) ⇒ 400.  This term contains no measured input at all and was
             therefore fixed before anything ran.
spellTerm  = ceil( 12,000 open-play spells per arm / spellsPerMatch_binding )
             — #170's own quantile-precision target, scaled to two arms.
knockTerm  = ceil( 1,500 aimed knocks in the CB arm / knocksPerMatch_cb )
             — a take-on success-rate SE of ≈1.3 % at p≈0.5.
wallTerm   = floor( 0.5 h / (ms per match × 2 arms × 2 X-DET) )
seedRoom   = 500 (the band's core allocation)
```

⭐ **The wall term may never bind.** `G-N-DERIVED.wallTermNotBinding` requires
`wallTerm ≥ stepped`, so **no machine timing can move a number inside
`resultSha256`** — the design term `min(stepped, seedRoom)` is what is hashed, and
the wall cap and `ms/match` live in the unhashed envelope. If the cap ever binds,
the gate reds and the round is re-designed rather than silently hashing a stopwatch.

## §SEEDS — booked = walked, exact ledger

| block | seeds | job |
|---|---|---|
| sizing smoke | 12,477,000–024 (25) | the N rule's event rates + `ms/match` |
| core battery | 12,477,100 + N* | the two arms, **shared seeds** (the pairing) |
| G-WORLD read-back | 12,477,900 | arming read back on a never-stepped match |
| ⭐ **DECLARED RE-WALK** | 12,293,000–039 | `G-SEMANTICS-INHERITED`: the #173 census's OWN smoke block, re-walked to prove this probe's spell/touch walker reproduces that instrument **exactly**. A re-walk of a CONSUMED block, declared here; the disjointness predicate is **INVERTED** for it (the CB-C0 `gReproDvc0` precedent). It draws no statistic. |

Band booked by #271.2: **12,477,000–999**. Stats: base **110,200** (the ruling's
floor, on the 200-step grid), 2,000 resamples (500 for the quantile triple — a
**prefix** of the same matrix, so every interval stays paired).

## §GATES — the set, frozen ex ante (16)

| gate | what it proves |
|---|---|
| `xDet` | the whole measured core walked TWICE, canonical digests compared; pass B never resumes from the checkpoint (so X-DET *is* the checkpoint's integrity proof) |
| `xSrcUntouched` | `git diff --stat -- src` empty — the round's HARD property |
| `xFpProd` | the production fingerprint `57b0bdab…c673` re-derived in-process |
| `gTrace` | every constant read out of `src/**` at run time, incl. ⭐ **the battery ran on the real 240 s match clock** |
| `gArming` | the CB arm **is** the entry's arming: `a4MatchFlags(6)` + `armA4World(…, 6)` CALLED, **zero** CB door literals typed in the probe, `cbArmedVersion` reads back 6 on one arm and 0 on the other, and neither League-side fork is requested (so the constructor channel is the same one `League.createMatch` uses) |
| `gSemantics` | ⭐⭐ **the semantics inheritance**: 14 aggregate fields re-walked on the #173 census's own smoke block must match the committed artifact **exactly** |
| `gWorld` | arming + dormancy read back on a never-stepped match, and the OFF ledger stays all-zero through the **full** walk |
| `gSeedDisjoint` | every own block inside the band, mutually disjoint, clear of every consumed range — and the one declared re-walk **must** hit a consumed range (predicate inverted) |
| `gStatsDisjoint` | base ≥ floor, on the grid, ≥200 from every published base, ledger non-vacuous |
| `gCleanInvocation` | no override set ⇒ canonical path; a preflight may never write canonical (**invocation context — excluded from `resultSha256`**) |
| `gNDerived` | ran N = derived N* = the design term, and the wall cap never bound |
| `gNonVacuity` | **at claim grain**: every (arm × quantity) cell has a denominator, except where the row declared that arm zero-by-structure — and every declared structural zero **reads zero** |
| `gRealHonest` | the REAL column's own hygiene: UNSOURCED ⇒ no band, sourced ⇒ a band **and** a URL, every row carries semantics, every row `UNADJUDICATED`, and ⭐ **every #170-inherited band equals the committed tempo artifact's own band** |
| `gValuesNotImported` | the gated conjunct is **src unchanged this round** (a round that changes no src byte cannot import a constant into a sim value); the needle scan over every band value is **REPORTED, not gated**, because a band edge coinciding with an engine literal is a coincidence, not an import |
| `gLedgerAppend` | the re-run clause **exercised**: the append is accepted, the duplicate-label refusal is fired live on a synthetic input, the row count is arms × quantities, and prior lines are preserved |
| `gMutants` | ⭐⭐ every conjunct of every composite gate RE-INVOKES its own gate function on a mutated input and must flip **exactly** that conjunct; the coverage map is **machine-derived** from the gate objects (#268.3(a)), and a stray mutant (naming a conjunct that does not exist) also reds |

## §ENVELOPE — what `resultSha256` covers

`resultSha256` = sha256 over **the quantity list + the frozen design + the
measured core + the invocation-INDEPENDENT gates**, and nothing else. Outside it:
paths, `ms/match`, wall clock, git HEAD, preflight reasons, checkpoint counts, the
ledger path, and the four invocation-dependent gates (`gCleanInvocation`,
`xSrcUntouched`, `xFpProd`, `gLedgerAppend`).

⭐ **THE CROSS-OUT ACCEPTANCE TEST**: the same measurement written to a different
output path must re-derive the **same** `resultSha256`, byte for byte.

## §1 THE FROZEN QUANTITY LIST

**21 quantities**, frozen in [`scripts/probes/rYiQuantities.ts`](../../scripts/probes/rYiQuantities.ts) **before any battery was read**. That module is the SINGLE SOURCE of this list: this section is printed from it by `scripts/analysis/r-yi-gap-table-result.ts --frozen`, so a band cannot drift between the doc and the instrument (#229.2).

⭐ **THE STATUS COLUMN IS `UNADJUDICATED` ON EVERY ROW AND STAYS THAT WAY.** Deliberate arcade deviation · gap · unknown is the ruling chain's word (contract §1, §4; #203). The type has exactly one member on purpose.

⚠ **Every REAL value is eleven-a-side, full-pitch, 90-minute football.** Ours is 6v6 on a 0.70-scaled pitch over a 240 s match clock. COUNT rows are the least comparable across that gap; DURATION and SHARE rows the most.

| id | the quantity, in football words | unit | REAL | conf | from | STATUS |
|---|---|---|---|---|---|---|
| Q01 | how long a team keeps the ball (open-play possession spell, mean) | sim-seconds | 9.6 – 10.4 s | MED | #170 B1 | UNADJUDICATED |
| Q02 | the shape of that distribution (spell p25 / median / p75) | sim-seconds | UNSOURCED | UNSOURCED | #170 B2 | UNADJUDICATED |
| Q03 | how long a body holds the ball per touch | sim-seconds | 0.8 – 1.3 s (derived centre 0.98 s) | LOW | #170 B4 | UNADJUDICATED |
| Q04 | how often the ball changes hands | possession changes per display-minute (both teams) | 3.0 – 4.5 per display-minute | LOW | #170 B5 | UNADJUDICATED |
| Q05 | how many touches a possession is made of | touches per open-play spell | 2.88 – 5.12 PASSES per sequence (league central ≈3.5–4) | MED | #170 B3 | UNADJUDICATED |
| Q06 | how many passes find a team-mate | share of passes completed | 75.3 % – 88 % (2024-25 team extremes; league centre NOT published in the located source) | LOW | sourced this round | UNADJUDICATED |
| Q07 | how much of the passing goes forward | share of passes played forward | UNSOURCED | UNSOURCED | — | UNADJUDICATED |
| Q08 | shots | shots per TEAM per match | 10 – 14.5 per team per match (WEAK: centre not sourced) | LOW | #170 B9 | UNADJUDICATED |
| Q09 | goals | goals per match (both teams) | 2.8 – 2.9 per match | MED | sourced this round | UNADJUDICATED |
| Q10 | taking a man on (attempts) | take-on attempts per TEAM per match | UNSOURCED | UNSOURCED | — | UNADJUDICATED |
| Q11 | taking a man on (does it come off) | share of take-ons that beat every contesting body | 40.1 % – 48.4 % (league mean 43.7 %) | LOW | sourced this round | UNADJUDICATED |
| Q12 | fouls | fouls per TEAM per match | 9 – 12 per team per match | LOW | #170 B10 | UNADJUDICATED |
| Q13 | cards | yellow cards per match (both teams) | ≈4.08 yellows per match (both teams) | MED | sourced this round | UNADJUDICATED |
| Q14 | how much of the game is played under pressure (pressing-intensity proxy) | share of open-play first receptions taken with an opponent inside the pressure radius | UNSOURCED | UNSOURCED | #170 B7 | UNADJUDICATED |
| Q15 | aerial duels | aerial duels won per TEAM per match | UNSOURCED | UNSOURCED | — | UNADJUDICATED |
| Q16 | ground duels / ball-winning events | tackles + interceptions per TEAM per match | UNSOURCED | UNSOURCED | — | UNADJUDICATED |
| Q17 | the drama tail — how often a match is drawn | share of matches drawn | ≈25.5 % of matches | LOW | sourced this round | UNADJUDICATED |
| Q18 | the drama tail — how often one goal decides it | share of matches decided by exactly one goal | ≈37.5 % of matches | LOW | sourced this round | UNADJUDICATED |
| Q19 | the drama tail — how often it is a hiding | share of matches with a margin of 3 or more goals | UNSOURCED | UNSOURCED | — | UNADJUDICATED |
| Q20 | how lopsided possession is between the two teams | possession share of the team that had more of it | UNSOURCED | UNSOURCED | — | UNADJUDICATED |
| Q21 | how much of the clock is not football (restarts and dead ball) | share of the match clock with the ball NOT in play | ≈36.7 % of the nominal 90 minutes | MED | sourced this round | UNADJUDICATED |

### §1.1 OURS — how each row is measured, and whose semantics that is

* **Q01 how long a team keeps the ball (open-play possession spell, mean)** — THE #173 SPELL. A maximal interval of same-owner-TEAM control while phase === "playing", opened at the first tick a body of that team owns the ball, SUSPENDED (not ended) while the ball is loose in play, ended by an opponent establishing ownership / the phase leaving "playing" / full time; duration = (endTick − startTick) · DT so in-spell loose time is INCLUDED (the Opta "sequence" shape). openPlay origin only. Semantics re-derived from `scripts/probes/tempo-census.ts` `censusOne` and PROVEN identical to it by G-SEMANTICS-INHERITED (exact re-walk of that probe's own smoke block).
* **Q02 the shape of that distribution (spell p25 / median / p75)** — the same #173 spell population, pooled across seeds; p25 / median / p75 by the house index form. CI by CLUSTER bootstrap over match seeds (the pooled sample is re-formed inside each resample, so the interval respects the clustering).
* **Q03 how long a body holds the ball per touch** — THE #173 TOUCH. One ownership episode (reception → release): a new `ball.owner.gid` opens it, a change of gid closes it, and it is CLOSED at the phase boundary so no dead-ball time leaks in (#171.1.i). A DURATION — sim-seconds, never rescaled to the 90′ clock.
* **Q04 how often the ball changes hands** — spells whose terminator is `opponentControl`, divided by the ONE rate denominator `match.simTime` (PLAYED sim-seconds — #171.1.ii), then mapped onto the 90′ display clock by × (MATCH_DURATION / 90). ⭐ BOTH axes are emitted (per sim-minute = what the user watches at 1×, per display-minute = the 90′ mapping); the row is READ on the display axis because that is the axis the real band lives on.
* **Q05 how many touches a possession is made of** — ownership episodes counted inside each openPlay-origin spell (#173's `touchesPerPossession`).  
  ⚠ THE COLUMNS COUNT DIFFERENT THINGS. The real band counts PASSES per sequence; ours counts TOUCHES (ownership episodes). A carry adds touches without a pass, so the real band is a LOWER BOUND on the comparable quantity — inherited caveat, #170 B3.
* **Q06 how many passes find a team-mate** — the engine's OWN passive counters: Σ `team.stats.passesCompleted` / Σ `team.stats.passes`, both teams. No pass event is re-derived by this probe.
* **Q07 how much of the passing goes forward** — the engine's OWN counter: Σ `team.stats.passesForward` / Σ `team.stats.passes`. ⚠ `passesForward` is DEFINED by the engine as a pass played ≥2 m toward the opponents' goal (`src/sim/types.ts`), so its complement pools BACKWARD and LATERAL together. Backward vs lateral is NOT SEPARABLE with existing instrument semantics and no semantics are invented here: the pooled complement is published as one number, labelled.
* **Q08 shots** — Σ `team.stats.shots` per match / 2 (the arms are symmetric by construction, so the halving is exact in expectation, not per match — #171.1.iii's scope rule, inherited).
* **Q09 goals** — `match.score[0] + match.score[1]` at full time.
* **Q10 taking a man on (attempts)** — ⭐ THE CB LEDGER'S OWN COUNTER: `match.cbLedger.touchPasts` / 2 — an AIMED KNOCK past a contesting body, which is the only thing in this engine that is a take-on as football means it. In BARE PRODUCTION this is STRUCTURALLY ZERO: `performTouchPast` is reachable only through `Match.forcedTouchPast`, which is null in every production path (R-甲 A7, ABSENT). ⚠ `team.stats.dribbles` is NOT this quantity — the engine increments it on every non-recollect capture by an outfielder (`Match.ts` giveBall), so it counts possession GAINS, not take-ons; it is published beside this row as context under its own key and is never compared to the real band.  
  ⭐ DECLARED ZERO-BY-STRUCTURE on: bare.
* **Q11 taking a man on (does it come off)** — ⭐ `cbLedger.touchPastCleanBeats` / `cbLedger.touchPasts` — knocks that beat EVERY challenger they were aimed past (the strict football reading of a completed take-on). The per-CHALLENGER form `touchPastBeaten` / `touchPastChallengers` is published beside it under its own key. Zero-denominator in bare production, by construction (see Q10).  
  ⭐ DECLARED ZERO-BY-STRUCTURE on: bare.
* **Q12 fouls** — Σ `team.stats.fouls` per match / 2 (the per-team scope rule of Q08).
* **Q13 cards** — Σ `team.stats.yellows` per match, both teams (a second yellow counts here AND as a red, the engine's own convention). Reds are published beside it under their own key.
* **Q14 how much of the game is played under pressure (pressing-intensity proxy)** — ⭐ THE #173 INSTRUMENT, unchanged: among the FIRST reception of each openPlay-origin spell, the share whose nearest-opponent distance at the reception tick is ≤ the substrate's OWN pressure switch `TOUCH_CONTROL_DIST` (src/sim/constants.ts, traced at run time, not typed). Restart/kickoff-origin receptions are set-piece geometry and are EXCLUDED from the headline (#171.1.iv).
* **Q15 aerial duels** — Σ `team.stats.headersWon` per match / 2 — the engine's own aerial-duel-won counter (headed shots, clearances and knockdowns).
* **Q16 ground duels / ball-winning events** — Σ (`team.stats.tackles` + `team.stats.interceptions`) per match / 2. ⭐ In the CB-armed arm the ledger's own duel counters (`armedChallenges`, `geometricMisses`, `recoveries`) are published beside it under their own keys.
* **Q17 the drama tail — how often a match is drawn** — share of walked matches with `score[0] === score[1]` at full time.
* **Q18 the drama tail — how often one goal decides it** — share of walked matches with |score[0] − score[1]| === 1.
* **Q19 the drama tail — how often it is a hiding** — share of walked matches with |score[0] − score[1]| ≥ 3.
* **Q20 how lopsided possession is between the two teams** — per match: owned playing-phase ticks by side (summed over that side's spells, the #173 spell walk's own `ownedTicks`), then max(side share) of the two-team total. 0.5 = a perfectly even match; 1.0 = one team never lost it.
* **Q21 how much of the clock is not football (restarts and dead ball)** — 1 − (ticks with phase === "playing") / (total stepped ticks). The numerator is the #173 `inPlayTicks`; the denominator is the PAUSE-INCLUSIVE clock (`simTick`), which is the only clock on which a dead-ball SHARE means anything — #173 emitted it as `wallSimSeconds` and used it in no rate, and this row is the one place it has a job.

### §1.2 REAL — the citation behind every band, and every UNSOURCED row

* **Q01** (MED) — INHERITED #170-vetted band B1 (TEMPO-CENSUS.md §5): Opta / Stats Perform Premier League open-play sequences — 10.4 s mean in 2024-25, 9.6 s in 2025-26. https://theanalyst.com/articles/analysing-premier-league-playing-styles-2024-25 · https://www.premierleague.com/en/news/4426039
* **Q02** (UNSOURCED) — Opta publishes sequence MEANS, not the quantile set; #170 searched and found no public quantile source (B2 = ABSENT) and this round found none either. Our quantiles are reported against NO band — the honest form.
* **Q03** (LOW) — INHERITED #170-vetted band B4 (DERIVED, arithmetic shown): a player is in possession ≈109 s across a 90′ match (gulfnews, quoting the standard broadcast / 《The Numbers Game》 figure) and is involved in 111 ± 77 on-ball activities per match (PMC3778701) ⇒ 109 / 111 ≈ 0.98 s; widened to 0.8–1.3 s for the dispersion. https://pmc.ncbi.nlm.nih.gov/articles/PMC3778701
* **Q04** (LOW) — INHERITED #170-vetted band B5 (DERIVED from B1 + ball-in-play time, arithmetic shown): the PL ball was in play 56:58 of 90 in 2024-25; at a ≈10 s mean sequence that is ≈342 sequence-ends per match ⇒ 342/90 ≈ 3.8 per display-minute. NOT an independent measurement — it is B1 re-expressed and inherits B1's uncertainty. Ball-in-play source: https://theanalyst.com/articles/premier-league-ball-in-play-are-we-seeing-less-football-2025-26
* **Q05** (MED) — INHERITED #170-vetted band B3: Opta PL team-season range 2.88 (lowest) to 5.12 (highest); Man City 5.1, Southampton 4.4 in 2024-25. Same two sources as B1: https://theanalyst.com/articles/analysing-premier-league-playing-styles-2024-25 · https://www.premierleague.com/en/news/4426039
* **Q06** (LOW) — NEW this round. Premier League 2024-25 team pass-completion extremes: Manchester City 88 % (highest), Nottingham Forest 75.3 % (lowest), via StatMuse pass-completion tables. https://www.statmuse.com/fc/ask/pass-completion-rate-premier-league-by-team — an aggregator, and the band's CENTRE is unsourced ⇒ LOW.
* **Q07** (UNSOURCED) — Opta records pass direction (forwards / sideways / backwards) as an event attribute, but no league-average SHARE was located in any public source this round (searched: Opta stat definitions, Stats Perform, aggregators). The row ships UNSOURCED rather than with a guessed band.
* **Q08** (LOW) — INHERITED #170-vetted band B9, labelled WEAK at source: the only team-level datapoint located was Arsenal 14.53 shots/match 2024-25 (StatMuse), among the league LEADERS ⇒ the league mean sits below it. Order-of-magnitude line only. https://www.statmuse.com/fc/ask/premier-league-teams-average-shot-per-game
* **Q09** (MED) — NEW this round. Opta Analyst: each of the four Premier League campaigns from 2021-22 to 2024-25 "averaged at least 2.82 goals per game", and 2024-25 ran at 2.88 after 100 matches. https://theanalyst.com/articles/premier-league-goals-low-stats · https://theanalyst.com/articles/premier-league-2024-25-data-trends-stats
* **Q10** (UNSOURCED) — The located source names only the four HIGHEST attempting squads ("all four around the 21 take-on attempts per 90 minute mark", Brighton / Chelsea / Tottenham / West Ham, 2024-25 to 19 Jan 2025, https://fivda.com/2025/01/24/premier-league-top-dribblers-2025/). A league MEAN was not published there or anywhere located, so no band is stated: ≈21 is an upper-tail marker, not a centre.
* **Q11** (LOW) — NEW this round. Premier League 2024-25 (snapshot 19 Jan 2025): "the average success rate of take-ons across all squads … is 43.7 %"; Manchester City highest at 48.4 %, Leicester lowest at 40.1 %. https://fivda.com/2025/01/24/premier-league-top-dribblers-2025/ — a blog reporting Opta-derived squad figures, mid-season snapshot ⇒ LOW.
* **Q12** (LOW) — INHERITED #170-vetted band B10, labelled WEAK at source: Arsenal committed 399 fouls in 38 matches in 2024-25 = 10.5/match (StatMuse); one team, one season, band = that value ±1.5. https://www.statmuse.com/fc/ask/premier-league-fouls-team-stats-2024-2025
* **Q13** (MED) — NEW this round, arithmetic shown: 1,549 yellow cards (and 52 reds) across the Premier League 2024-25 season = 380 matches ⇒ 1,549 / 380 = 4.076 yellows and 52 / 380 = 0.137 reds per match. Totals from MyFootballFacts (updated matchday 38); the division is ours. https://www.myfootballfacts.com/premier-league/all-time-premier-league/cards/premier-league-red-and-yellow-cards-2024-25/
* **Q14** (UNSOURCED) — No real-football pressed-reception share exists in comparable form: the public pressing metrics (PPDA, high turnovers, pressures) are differently defined and are not a share of receptions. #170 reached the same conclusion for the neighbouring quantity (B7 = ABSENT) and read it as an INTERNAL contrast instead. Ours is published against NO band, and its job here is the ARM-TO-ARM and RUN-TO-RUN reading.
* **Q15** (UNSOURCED) — Searched for a Premier League team-level aerial-duels-per-match figure (Opta/FBref/StatMuse/one-versus-one): every located source gave either individual-player totals or season totals with no matches-played denominator, and FBref's squad miscellaneous table refused automated access (HTTP 403). No credible team-per-match value ⇒ the row ships UNSOURCED rather than with a computed guess.
* **Q16** (UNSOURCED) — Tackles and interceptions are published per PLAYER almost everywhere and their team-per-match league mean was not located in a citable form this round; the two are also defined differently by different providers (attempted vs won tackles). UNSOURCED rather than a pooled guess.
* **Q17** (LOW) — NEW this round: 25.5 % draws across 12,786 Premier League matches (1992 → end of 2024-25). https://sicycle.wordpress.com/2025/11/04/whats-the-most-common-score-in-the-premier-league/ — a blog computing over the full match archive; large sample, weak publisher ⇒ LOW.
* **Q18** (LOW) — NEW this round, same archive computation as Q17: "37.5 % end with a single goal deciding the result" over 12,786 matches. https://sicycle.wordpress.com/2025/11/04/whats-the-most-common-score-in-the-premier-league/ — same publisher, same LOW grade as Q17.
* **Q19** (UNSOURCED) — The archive source that gives Q17 and Q18 does NOT state a ≥3-goal share (it states only that ≥5-goal margins are ≈2 % of matches). Its own complement bounds the ≥2-goal share at 100 − 25.5 − 37.5 = 37.0 %, so ≥3 is bounded ABOVE by 37.0 % — a bound, not a band. Published UNSOURCED with the bound stated.
* **Q20** (UNSOURCED) — Published possession figures are TEAM-SEASON means, not a per-match balance distribution. The season spread is cited as CONTEXT ONLY and is not a band: Nottingham Forest were the only 2024-25 side under 40 % (39.6 %), per Opta Analyst's playing-styles piece. The per-match quantity ours measures has no located published counterpart.
* **Q21** (MED) — NEW this round: the Premier League ball was in play 56 min 58 s on average across 2024-25 (Opta) ⇒ 1 − 56.967/90 = 36.7 % dead against the NOMINAL 90. https://theanalyst.com/articles/premier-league-ball-in-play-are-we-seeing-less-football-2025-26 · ⚠ real matches now ELAPSE well beyond 90 minutes, so measured against elapsed time the real dead share is HIGHER than this; the band is stated on the nominal clock because that is the clock our 240 s maps onto.

### §1.3 CONTEXT ROWS — measured and published, compared to NO band

* `engineDribblesPerTeam` — `team.stats.dribbles` / 2 — possession GAINS, not take-ons (see Q10).
* `takeOnPerChallengerSuccess` — `touchPastBeaten` / `touchPastChallengers` — the per-body form of Q11.
* `redsPerMatch` — `team.stats.reds`, both teams — beside Q13.
* `turnoversPerSimMin` — Q04 on the WATCHED clock (the other honest axis).
* `completedPassesPerSpell` — completed passes per open-play spell — the nearest like-for-like to the Q05 band.
* `armedChallengesPerTeam` — `cbLedger.armedChallenges` / 2 — beside Q16, CB arm only.
* `geometricMissesPerTeam` — `cbLedger.geometricMisses` / 2 — beside Q16, CB arm only.
* `recoveriesPerTeam` — `cbLedger.recoveries` / 2 — beaten lunges paying the armed price.
* `meanRecoveryS` — `recoverySeconds` / `recoveries` — how long a beaten defender is out.
* `offsidesPerTeam` — `team.stats.offsides` / 2 — Laws texture, no band in this version.
* `cornersPerTeam` — `team.stats.corners` / 2 — Laws texture, no band in this version.
* `inPlaySecondsPerMatch` — the numerator of Q21, published so the share re-derives.
* `simSecondsPerMatch` — the ONE rate denominator (`match.simTime`), published so every rate re-derives.
* `wallSecondsPerMatch` — `simTick · DT` — the pause-inclusive clock, Q21's denominator.

### §1.4 THE ARMS

* **bare** — BARE PRODUCTION — `new Match({ seed, teamA, teamB })`. No flag, no eye, no gene, no book. Byte-for-byte the #173 census's own prod-arm constructor.
* **cb** — THE CB PLAY WORLD, ARMED EXACTLY AS THE ENTRY ARMS IT — `a4MatchFlags(6)` spread at construction (the same channel `League.createMatch` uses: it spreads `...this.matchFlags` into `new Match`) and `armA4World(match, null, 6)` after it. Both calls are CALLS into `src/game/a4World.ts`: no flag name and no dose is typed in the probe (G-ARMING-FROM-ENTRY proves it from the probe's own source).

## §RESULT

**epoch label `post-CB` · 400 seeds × 2 arms · block 12,477,100–12,477,499 · 16/16 gates PASS**, `resultSha256` `9a5e7c43…e896`. Every number below is printed by `scripts/analysis/r-yi-gap-table-result.ts` from the committed artifact; none is typed (#229.2).

### The run

```text
match clock       240 sim-seconds ⇔ 90′  (2.666667 sim-s per display-minute)
bare              241.9207 played sim-seconds per match
cb                241.7583 played sim-seconds per match
pressure radius   4.2 m   (TOUCH_CONTROL_DIST, src/sim/constants.ts:315)
first-touch win.  0.28 s   (p.firstTouchWindow, src/sim/Match.ts:2483)
estimator         cluster bootstrap by match seed (#20), 2000 resamples (500 for the quantile triple, a PREFIX of the same matrix so every interval is paired), percentile 95 % CI, ratio-of-sums; stats base 110200.
N rule            N*(design) = min( max(400, 327, 77) ↑25 = 400, seedRoom=500 ) = 400   [no timing enters this line]
                  binding precision term: match-level share
seeds             band 12,477,000–12,477,999 · smoke 12,477,000–12,477,024 · core 12,477,100–12,477,499 · G-WORLD 12,477,900 · declared re-walk 12,293,000–12,293,039
stats base        110,200
ledger            docs/world-model/data/r-yi-gap-table-ledger.jsonl  (label post-CB)
```

### ⭐ THE GAP TABLE

| id | quantity | OURS (bare) | OURS (CB-armed) | REAL | conf | STATUS |
|---|---|---|---|---|---|---|
| Q01 | how long a team keeps the ball (open-play possession spell, mean) | 4.2950 [4.2029, 4.3874] | 3.8369 [3.7522, 3.9282] | 9.6 – 10.4 s | MED | UNADJUDICATED |
| Q02 | the shape of that distribution (spell p25 / median / p75) | 2.9000 [2.8167, 2.9833] | 2.6000 [2.5333, 2.6667] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q03 | how long a body holds the ball per touch | 0.6243 [0.6027, 0.6457] | 0.5967 [0.5763, 0.6188] | 0.8 – 1.3 s (derived centre 0.98 s) | LOW | UNADJUDICATED |
| Q04 | how often the ball changes hands | 0.3921 [0.3839, 0.4007] | 0.4290 [0.4183, 0.4394] | 3.0 – 4.5 per display-minute | LOW | UNADJUDICATED |
| Q05 | how many touches a possession is made of | 2.5236 [2.4818, 2.5656] | 2.3969 [2.3649, 2.4294] | 2.88 – 5.12 PASSES per sequence (league central ≈3.5–4) | MED | UNADJUDICATED |
| Q06 | how many passes find a team-mate | 0.7375 [0.7327, 0.7423] | 0.6642 [0.6593, 0.6693] | 75.3 % – 88 % (2024-25 team extremes; league centre NOT published in the located source) | LOW | UNADJUDICATED |
| Q07 | how much of the passing goes forward | 0.5724 [0.5668, 0.5782] | 0.5790 [0.5726, 0.5851] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q08 | shots | 6.7038 [6.5175, 6.9037] | 5.8375 [5.6238, 6.0500] | 10 – 14.5 per team per match (WEAK: centre not sourced) | LOW | UNADJUDICATED |
| Q09 | goals | 2.2025 [2.0400, 2.3650] | 2.2975 [2.1625, 2.4400] | 2.8 – 2.9 per match | MED | UNADJUDICATED |
| Q10 | taking a man on (attempts) | 0.0000 [0.0000, 0.0000] | 10.7713 [10.1350, 11.4275] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q11 | taking a man on (does it come off) | n/a [n/a, n/a] | 0.3868 [0.3752, 0.3977] | 40.1 % – 48.4 % (league mean 43.7 %) | LOW | UNADJUDICATED |
| Q12 | fouls | 1.9900 [1.8887, 2.0925] | 3.2088 [3.0775, 3.3413] | 9 – 12 per team per match | LOW | UNADJUDICATED |
| Q13 | cards | 1.2075 [1.1025, 1.3150] | 1.9950 [1.8550, 2.1450] | ≈4.08 yellows per match (both teams) | MED | UNADJUDICATED |
| Q14 | how much of the game is played under pressure (pressing-intensity proxy) | 0.8053 [0.7978, 0.8124] | 0.8424 [0.8347, 0.8495] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q15 | aerial duels | 4.2125 [3.8850, 4.5762] | 3.1975 [2.9175, 3.4762] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q16 | ground duels / ball-winning events | 17.7125 [17.3125, 18.1487] | 15.2662 [14.8812, 15.6263] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q17 | the drama tail — how often a match is drawn | 0.3000 [0.2550, 0.3450] | 0.2625 [0.2200, 0.3050] | ≈25.5 % of matches | LOW | UNADJUDICATED |
| Q18 | the drama tail — how often one goal decides it | 0.3700 [0.3225, 0.4175] | 0.4250 [0.3775, 0.4725] | ≈37.5 % of matches | LOW | UNADJUDICATED |
| Q19 | the drama tail — how often it is a hiding | 0.1375 [0.1050, 0.1725] | 0.1450 [0.1150, 0.1800] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q20 | how lopsided possession is between the two teams | 0.6073 [0.5984, 0.6162] | 0.6066 [0.5974, 0.6161] | UNSOURCED | UNSOURCED | UNADJUDICATED |
| Q21 | how much of the clock is not football (restarts and dead ball) | 0.1390 [0.1353, 0.1425] | 0.1608 [0.1569, 0.1643] | ≈36.7 % of the nominal 90 minutes | MED | UNADJUDICATED |

Units are §1's; every interval is a 95 % cluster-bootstrap percentile CI over match seeds.

### DISTANCE FROM THE REAL BAND — mechanical, no verdict

For every row that HAS a band: where our point estimate sits relative to the nearer band edge. `inside` = the CI overlaps the band. A factor is printed as ours ÷ edge, so `0.42×` reads "ours is 0.42 of the nearest published edge". ⚠ This is arithmetic on two columns that count the same football quantity in two different games (11v11 90′ vs 6v6 240 s); it is NOT a verdict, and the STATUS column stays `UNADJUDICATED`.

| id | quantity | OURS (bare) | OURS (CB) | band | bare vs band | CB vs band |
|---|---|---|---|---|---|---|
| Q01 | how long a team keeps the ball (open-play possession spell, mean) | 4.2950 | 3.8369 | 9.6000–10.4000 | 0.45× the LOW edge | 0.40× the LOW edge |
| Q03 | how long a body holds the ball per touch | 0.6243 | 0.5967 | 0.8000–1.3000 | 0.78× the LOW edge | 0.75× the LOW edge |
| Q04 | how often the ball changes hands | 0.3921 | 0.4290 | 3.0000–4.5000 | 0.13× the LOW edge | 0.14× the LOW edge |
| Q05 | how many touches a possession is made of | 2.5236 | 2.3969 | 2.8800–5.1200 | 0.88× the LOW edge | 0.83× the LOW edge |
| Q06 | how many passes find a team-mate | 0.7375 | 0.6642 | 0.7530–0.8800 | 0.98× the LOW edge | 0.88× the LOW edge |
| Q08 | shots | 6.7038 | 5.8375 | 10.0000–14.5000 | 0.67× the LOW edge | 0.58× the LOW edge |
| Q09 | goals | 2.2025 | 2.2975 | 2.8000–2.9000 | 0.79× the LOW edge | 0.82× the LOW edge |
| Q11 | taking a man on (does it come off) | n/a | 0.3868 | 0.4010–0.4840 | n/a | 0.96× the LOW edge |
| Q12 | fouls | 1.9900 | 3.2088 | 9.0000–12.0000 | 0.22× the LOW edge | 0.36× the LOW edge |
| Q13 | cards | 1.2075 | 1.9950 | 4.0000–4.2000 | 0.30× the LOW edge | 0.50× the LOW edge |
| Q17 | the drama tail — how often a match is drawn | 0.3000 | 0.2625 | 0.2400–0.2700 | CI overlaps | INSIDE |
| Q18 | the drama tail — how often one goal decides it | 0.3700 | 0.4250 | 0.3500–0.4000 | INSIDE | CI overlaps |
| Q21 | how much of the clock is not football (restarts and dead ball) | 0.1390 | 0.1608 | 0.3500–0.3900 | 0.40× the LOW edge | 0.46× the LOW edge |

### The spell-length shape (Q02, no real band exists)

```text
bare   p25 1.2500 [1.2167, 1.2833]   median 2.9000 [2.8167, 2.9833]   p75 5.8167 [5.6833, 5.9500]   (n=14,215 spells, 500 resamples)
cb     p25 1.2667 [1.2333, 1.2833]   median 2.6000 [2.5333, 2.6667]   p75 5.2000 [5.0667, 5.3500]   (n=15,558 spells, 500 resamples)
```

### Both honest axes on the churn row (Q04)

```text
bare   per sim-second 0.147032   per sim-minute 8.8219   per display-minute 0.3921   (× 2.666667)
cb     per sim-second 0.160884   per sim-minute 9.6530   per display-minute 0.4290   (× 2.666667)
```

### CONTEXT rows (measured, compared to NO band)

```text
engineDribblesPerTeam          bare 55.7775                cb 53.3663
takeOnPerChallengerSuccess     bare n/a [n/a, n/a]         cb 0.6524 [0.6393, 0.6650]
redsPerMatch                   bare 0.0650                 cb 0.1700
turnoversPerSimMin             bare 8.8219                 cb 9.6530
completedPassesPerSpell        bare 2.1383                 cb 1.5816
armedChallengesPerTeam         bare 0.0000                 cb 17.6250
geometricMissesPerTeam         bare 0.0000                 cb 8.4637
recoveriesPerTeam              bare 0.0000                 cb 16.6600
meanRecoveryS                  bare 0.0000                 cb 0.8008
offsidesPerTeam                bare 1.3188                 cb 1.3675
cornersPerTeam                 bare 1.4975                 cb 1.3875
inPlaySecondsPerMatch          bare 216.2695               cb 210.8516
simSecondsPerMatch             bare 241.9207               cb 241.7583
wallSecondsPerMatch            bare 251.1770               cb 251.2552
```

### Gate table

| gate | result | evidence |
|---|---|---|
| `xDet` | **PASS** | digest `b4ea8855…2d17` twice (pass B never resumes) |
| `xSrcUntouched` | **PASS** | `git diff --stat -- src` empty |
| `xFpProd` | **PASS** | observed `57b0bdab…c673` = baseline, re-derived in-process |
| `gTrace` | **PASS** | 6 conjuncts — every constant read out of `src/**` at run time, incl. ⭐ ranOnTheMatchClock |
| `gArming` | **PASS** | 6 conjuncts — the CB arm IS `a4MatchFlags(6)` + `armA4World(…,6)`; 10 flags true; 0 door literals typed in the probe |
| `gSemantics` | **PASS** | 14 fields vs the committed #173 smoke, **0 mismatches**, block 12293000..12293039 |
| `gWorld` | **PASS** | 6 conjuncts on a never-stepped match at seed 12,477,900 + the OFF ledger through the full walk |
| `gSeedDisjoint` | **PASS** | 4 blocks machine-checked (1 declared re-walk, predicate INVERTED) · ledger 10 entries |
| `gStatsDisjoint` | **PASS** | base 110,200, minGap 200 ≥ 200, 22 published bases |
| `gCleanInvocation` | **PASS** | preflight false · reasons [] · resumeRequested false |
| `gNDerived` | **PASS** | ran N 400 = derived N* 400 = design term 400; ⭐ the wall cap never bound |
| `gNonVacuity` | **PASS** | 42 cells at claim grain · declared structural zeros ["bare.Q10","bare.Q11"] · undeclared empties [] |
| `gRealHonest` | **PASS** | 21 rows · {"MED":5,"UNSOURCED":8,"LOW":8} · ⭐ all 8 #170-inherited bands re-checked against the committed tempo artifact |
| `gValuesNotImported` | **PASS** | 145 src files · 66 needles · 361 coincidental hits REPORTED (not gated); the gated conjunct is src-unchanged |
| `gLedgerAppend` | **PASS** | 42 rows appended under `post-CB` · duplicate-label refusal exercised live · 0 prior lines preserved |
| `gMutants` | **PASS** | **67 mutants, 0 dead** · coverage 12 gates, MACHINE-DERIVED · uncovered conjuncts 0 · stray 0 |

⭐ **THE HEADLINE COUNT, HAND-CHECKED**: the artifact's `gates` object carries exactly **16** keys — `xDet · xSrcUntouched · xFpProd · gTrace · gArming · gSemantics · gWorld · gSeedDisjoint · gStatsDisjoint · gCleanInvocation · gNDerived · gNonVacuity · gRealHonest · gValuesNotImported · gLedgerAppend · gMutants` — and **16** of them pass.

### The envelope (everything OUTSIDE `resultSha256`)

```text
preflight       false   reasons []   resumeRequested false
paths           out docs/world-model/data/r-yi-gap-table-post-CB.json   ledger docs/world-model/data/r-yi-gap-table-ledger.jsonl
checkpoint      /tmp/r-yi-checkpoint-full-post-CB.jsonl   freshWalks 1,600   doneMarker /tmp/r-yi-done-full-post-CB
wall            passA 63,609 ms · X-DET 62,444 ms · total 142,716 ms · 79.5 ms/match
N rule (wall)   wallTerm 4,996 at 90.1 ms/match — binding term: precision
cross-OUT       resultSha256 covers quantities + frozenDesign + result + the invocation-INDEPENDENT gates only, so the same measurement written to /tmp re-derives the same receipt byte for byte.
```

### Deviations recorded

1. ⭐⭐ THE TWO DISPATCHED RUNS ARE THE TWO ARMS OF ONE EPOCH, walked on SHARED SEEDS. The re-run clause's unit is the LABEL (the epoch), not the arm: pairing bare against CB-armed on the same seeds is strictly more informative than two unpaired invocations, and the ledger keys every row by (label, arm, quantity) so a future epoch diffs against both.
2. A TOUCH IS AN OWNERSHIP EPISODE, not a foot-ball contact (#173's own deviation, inherited with its reason): `Match` exposes `ball.owner`, not a contact event, so an episode shorter than one tick is invisible. Deriving it from observable state is REQUIRED by X-SRC-ZERO.
3. SPELL DURATION INCLUDES IN-SPELL LOOSE TIME (the Opta "sequence" shape) so Q01 is read against Q01's band like for like — #173's inherited choice.
4. THE PER-TEAM ROWS HALVE A BOTH-TEAMS SUM. The arms are symmetric by construction, so the halving is exact in EXPECTATION over the seed set, not per match (#171.1.iii).
5. BACKWARD vs LATERAL PASSING IS NOT MEASURABLE with existing instrument semantics (Q07): the engine has one forward-pass counter and no direction field on a pass. The pooled complement is published; no semantics were invented to split it.
6. THE REAL COLUMN IS ELEVEN-A-SIDE, FULL-PITCH, 90-MINUTE FOOTBALL. Ours is 6v6 on a 0.70-scaled pitch over a 240 s clock. COUNT rows (shots, fouls, cards, aerials, duels) are the least comparable across that gap; DURATION and SHARE rows are the most comparable, because a human body's time and a possession's shape are the same in both games.
7. EIGHT OF THE 21 ROWS SHIP REAL = UNSOURCED (Q02 spell quantiles · Q07 forward-pass share · Q10 take-on attempts · Q14 pressed-reception share · Q15 aerial duels · Q16 ground duels · Q19 the ≥3-goal tail · Q20 possession balance). Each row's `source` field records WHAT was searched and why nothing citable was found; two of them (Q02, Q14) inherit #170's own ABSENT verdict on the same quantity. That is the contract's honest form, not a hole to be filled with a plausible number.

### Registered non-claims

1. NOTHING SHIPS: zero src/** bytes, the production fingerprint re-derived unchanged, every flag armed ONLY inside this instrument.
2. ⭐⭐ NO GAP IS A GATE (contract §4). No PASS/FAIL is computed against any real value anywhere in this probe; the gates are the X-family, the trace/arming/semantics gates, the ledger hygiene gates and the mutant-liveness proof.
3. ⭐ THE STATUS COLUMN IS UNADJUDICATED ON EVERY ROW. Deliberate arcade deviation vs gap vs unknown is the ruling chain's (#203); the executor never writes it.
4. THE ARM CONTRAST IS DESCRIPTIVE. The CB arm differs from bare in several ways at once (three doors + the A4 census substrate + the wind-up seam + the proneness dose), so no single-factor causal claim is made or permitted — it is the world the play-test entry actually arms, measured as a whole.
5. NO WATCHABILITY CLAIM. Whether any of this LOOKS like football is the user's eyes (#157).

## §6 VISION audit (the #91 form)

* vs **the aesthetic criterion**: a standing ruler is how "emergence must be SEEN"
  survives contact with time — the eyes cannot see a drift between two epochs, and
  this instrument can. **PASS.**
* vs **底座给能力**: instrument-side only. Nothing measured here reaches any
  player; zero `src/**` bytes. **PASS.**
* vs **#200 (constants never imported)**: the real column is **CITED**, never
  tuned toward, and `gValuesNotImported` carries the proof that this round moved no
  sim value. **PASS.**
* vs **emergence**: the table measures levels and reports drift; it prescribes no
  target and proposes no mechanic. **PASS.**

## §7 REALITY audit (the #201 rule)

* Real football's published distributions are the reference — the same move as
  #246, systematised into a standing instrument. **PASS.**
* **The honest limit, stated:** every published value is eleven-a-side, full-pitch,
  90-minute football; ours is 6v6 on a 0.70-scaled pitch over 240 sim-seconds.
  COUNT rows (shots, fouls, cards, aerials, duels) are the **least** comparable
  across that gap and DURATION/SHARE rows the **most**, because a human body's time
  and a possession's shape are the same in both games. The STATUS column exists
  precisely for this: a deviation is only a disease if the ruling chain says so.
  **PASS.**
* **Eight rows have no real counterpart at all** and ship UNSOURCED. That is the
  reality audit working, not failing: it records where football's own published
  record does not answer the question we are asking.

## §DOUBTS

1. **The two dispatched runs are the two ARMS of ONE epoch**, walked on shared
   seeds, rather than two separate invocations. Pairing is strictly more
   informative and the ledger keys rows by (label, arm, quantity) so a future epoch
   diffs against both — but if the ruling chain wants "run" to mean "invocation",
   that is a versioned amendment to this instrument.
2. **Q07 (forward vs backward vs lateral) is only half-measurable.** The engine has
   one forward-pass counter and no direction field on a pass, so backward and
   lateral are pooled. Named, not improvised.
3. **The CB arm is a multi-factor world** (three doors + the A4 census substrate +
   the wind-up seam + the proneness dose). It is the world the play-test entry
   actually arms, measured whole; no single-factor causal claim is available from
   it and none is made.
4. **Several REAL bands rest on aggregators or blogs** (Q06, Q11, Q17, Q18) rather
   than on Opta directly, and are graded LOW for exactly that reason. A future
   epoch may upgrade a grade; the grade is part of the versioned list, so an
   upgrade is an amendment with a receipt, not a silent edit.
5. **`stats.dribbles` is a trap and is quarantined.** The engine increments it on
   every non-recollect capture by an outfielder, so it is a possession-gain
   counter, not a take-on counter. It is published as CONTEXT and compared to no
   band; anyone reading it as "dribbles per match" would read a real-football
   number against a quantity that is not that quantity.

## §COMMANDER CORRECTIONS OF RECORD (#272.3, 2026-08-15 — ⚠ READ BEFORE QUOTING ANY ROW)

The verify: 20/21 OURS points re-derived exactly; CIs re-derived with an independent bootstrap;
all 8 inherited bands verbatim; 4 external citations fetched live; freeze-before-sight
git-corroborated (0-line probe diff); the ledger's append+refusal exercised on the real
filesystem; the cross-OUT digest reproduced. THE INSTITUTION STANDS. Three row-level readings and
one pattern claim DO NOT, and are quarantined of record:

* **(i) HIGH RATIFIED — Q11/Q10 ARE NOT QUOTABLE AS PUBLISHED.** `touchPasts` increments on
  knocks with ZERO challengers (mechanics.ts:1598-1601): ≥1,817 of 8,617 (21.1 %) of Q11's
  denominator are structurally incapable of a clean beat. The commensurable reading (attempts
  with a contesting body) is **≥ 0.4902 vs the band high 0.484 — the row's SIGN INVERTS**: our
  take-on success sits AT/ABOVE the real band, not just under it. Q10's stated semantics ("an
  aimed knock past a contesting body") is false for ≥21 % of its count. FIX ASSIGNED (the
  instrument round): re-key Q10/Q11 on challengers>0, publish the uncontested-knock count beside.
* **(ii) HIGH RATIFIED — THE DISTANCE TABLE MIXES TWO CLOCK CONVENTIONS ROW-BY-ROW**; the
  headline pattern ("every row sits BELOW real") is a CONSTRUCTION ARTIFACT. The engine's own
  mapping is 1 sim-s = 22.5 display-s; durations were compared on raw sim-seconds (convention A)
  while per-match counts implicitly treated 240 sim-s as a full 90′ (convention B). Under either
  single convention, 2–5 banded rows sit 1.6×–17× ABOVE real; Q01 and Q04 are the SAME FACT
  printed on two clocks (the #173 scaleCaveat — durations readable, counts not — was silently
  reversed for count rows). ⭐ OF RECORD: the cross-row PATTERN is not quotable; individual
  DURATION rows on convention A remain readable (Q01/Q02/Q03 short spells, short holds — the
  #170-era finding stands on its own axis). FIX ASSIGNED: one declared convention + BOTH axes
  printed for every row (Q04's dual-axis form generalized).
* **(iii) HIGH RATIFIED — "no sign inversion exists" is STRUCK**: Q17 bare = 1.11× ABOVE its high
  edge, Q18 cb = 1.06× ABOVE (masked by "CI overlaps" printing); vs the CITED point 0.375, Q18
  cb's CI [0.3775, 0.4725] EXCLUDES the real value. Our margin/draw tails are not "below real".
* **(iv) HIGH RATIFIED — five REAL band widths were INVENTED around single cited points**
  (Q09/Q13/Q17/Q18/Q21) and persisted into the standing ledger as the institution's reference.
  Frozen-before-sight, so provenance defect, not fitting — but a band the source never stated is
  not a source. FIX ASSIGNED: cited POINTS as points; any width carries a receipt; a
  `bandFidelity` conjunct joins gRealHonest; the five ledger rows are SUPERSEDED at the next
  epoch.
* **(v) MEDs**: Q20's published estimator is Σmax/Σtotal, not §1.1's per-match mean (both are in
  the artifact; the doc sentence + the "stronger team" label corrected — it is the per-match
  LEADER, an upward-biased max, teams are two random draws) · `gMutants` "exactly that conjunct"
  is ASSERTED NOT ENFORCED (proven live with a double-flip mutant — the CB-T1 enforcement form
  exists and was not inherited; recurrence of #266.2(vii)); the 67-mutant receipt proves
  necessity, not specificity. LOW: 56:58 vs the source's 56:59; Q21's pause-inclusive 251.2 s
  denominator vs the nominal-90 band (~4.7 %), discussed in prose but not carried into the factor.
* **(vi) What the epoch DOES establish, quotable now**: the paired arm DIRECTION (CB-armed:
  shorter spells, lower completion, more fouls/cards, more pressed, take-ons exist) · the
  convention-A duration rows · Q06 bare 0.98× (pass completion at the real band's edge) · the
  paired-seed design and the ledger institution itself.
