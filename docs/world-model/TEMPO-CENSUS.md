# THE ABSOLUTE POSSESSION / TEMPO CENSUS — pre-registration

**Authority:** commander ruling **#170** (granted on **#169.5**), which this document
ELABORATES and never re-cuts. Upstream: **#169** (the ruler-honesty audit; H-169a labelled),
**#166** (ledger corrections, binding), **#163** (stats-stream disjointness), **#128** (wall
measured outside the compared core), [`../VISION.md`](../VISION.md) §2 (the 2026-07-27 tempo
anchor — *this census is the instrument that anchor registered* — and the 2026-08-08 scramble
verdict) and §3 (the reference-database **house law**).

**Road B. Nothing ships.** Zero `src/**` changes (X-SRC-ZERO is HARD). The production
fingerprint `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` is untouched.
The probe is a pure **tick-walk observer**: it reads `Match` state after each `step(DT)` and
writes nothing back.

Probe: [`../../scripts/probes/tempo-census.ts`](../../scripts/probes/tempo-census.ts) ·
sizing smoke: [`data/tempo-census-sizing-smoke.json`](data/tempo-census-sizing-smoke.json).

---

## 1. WHY — the #169 ruler gap

Every battery this programme has built is an **A/B contrast**. #169's audit put the
consequence plainly: *a disease present in BOTH arms can never fire a gate*. The scramble
the user has been reporting since 2026-07-18 — 中场乱抢, 没有拿住球, 节奏特别紧 — lives in
the **baseline**, so a relative ruler reads it and files it as normal. Turnovers ran ≈51 per
match in both S2-P3 arms (difference −0.02) and no gate moved.

> **WE HAVE RELATIVE RULERS AND AN ABSOLUTE DISEASE.** (#169.2)

This is the **absolute** ruler. It does not compare arms to each other for a verdict. It
reports, per arm, the **level** of the time dimension: how long a team keeps the ball, how
many touches that is, how long a body holds it per touch, how often the ball changes hands,
what happens to a reception taken under pressure, and how long the actions themselves take.
Real-football values sit beside those levels as **reference lines**.

Two things it is NOT:
- **Not a gate.** No PASS/FAIL is computed against any reference value anywhere. The probe's
  `verdict` field reports PLUMBING only.
- **Not a watchability verdict.** Tempo *feel* belongs to the user's eyes (#152). This puts a
  number beside the "像开了 1.1/1.2 倍速" intuition; it does not overrule it.

---

## 2. ⭐ AXIS HONESTY (binding, #170.2)

`MATCH_DURATION = 240` sim-seconds is mapped to a **90-minute display clock**
(`Match.ts:1058` — `displayMinute = min(45, floor((simTime / duration) · 90))` per half).

> **THE MAPPING FACTOR, STATED ONCE: 240 sim-seconds ⇔ 90 display-minutes.**
> 1 sim-second = **0.375** display-minutes · 1 display-minute = **2.6667** sim-seconds.
> `rate_per_display_minute = rate_per_sim_second × 2.6667`.

> ### ⭐ ONE CLOCK IS THE RATE DENOMINATOR (#171.1.ii — the fix)
>
> **`match.simTime` — PLAYED sim-seconds — is the denominator of BOTH axes.** It is the clock
> `Match.minute()` itself maps onto the 90′ display, and it is what the doc means by "sim
> seconds" everywhere below. Because both axes divide the *same* number, the law above
> reproduces the emitted numbers **exactly**:
> `perDisplayMinute = perSimSecond × 2.6667`, with no residual.
>
> **`simTick · DT` is used in NO rate.** `simTick` (= `stepCount`) advances on the kickoff,
> goal-pause and half-time steps that `simTime` skips (`Match.ts:1113–1134`), so dividing by
> it inflates the sim-second axis relative to the display axis and silently breaks the law —
> which is precisely what the draft did. That pause-inclusive clock is still honest data — it
> is the wall the user actually sits through at 1× — so it is emitted **once per arm** as
> `wallSimSecondsPerMatch`, labelled `CONTEXT ONLY — USED IN NO RATE`.

Binding rules, enforced in the probe's own output shape:

1. **Every RATE is reported on BOTH axes** — `perSimSecond`, `perSimMinute`,
   `perDisplayMinute`, plus the raw `perMatch` — all off the one `simTime` denominator.
   There is no "the" rate.
2. **Every DURATION is reported in SIM-SECONDS ONLY and is never rescaled.** A 0.3 s hold is
   0.3 s on the screen at 1×; pretending it is 0.8 "display-seconds" would be a fiction, and
   it is exactly the fiction the PITCH_SCALE probe was burned by.
3. **The gap table never mixes axes.** A reference line drawn from an 11v11 90-minute match
   is compared to our **display-minute** rate, and separately to our **sim-second** rate, with
   both shown. The reader is never handed one number and left to guess the clock.
4. **The gap table never mixes SCOPES either** (#171.1.iii). Every count the probe emits is a
   **both-teams sum per match**; the per-TEAM bands B9/B10 are read against the
   `perTeamPerMatch` field (= sum / 2, the arms being symmetric), which is emitted beside the
   sum for `passes`, `shots` and `fouls` and carries the warning in the record itself.

---

## 3. THE FROZEN METRICS

Frozen before any run. Every definition below is stated in **sim terms** and is computed from
observable state only.

### 3.1 Possession spell

> A **possession spell** is a maximal interval of same-owner-**team** ball control while
> `match.phase === 'playing'`.

- **Starts** at the first tick a body of that team satisfies `ball.owner !== null` with no
  spell already open for that team.
- **Is SUSPENDED, not ended, while the ball is loose in play** (`ball.owner === null` with
  `phase === 'playing'`): a pass in flight, a dribble knock, a deflection. Loose ticks are
  counted separately (`looseTicks`).
- **Ends** on the first of: an opponent establishing ownership (`opponentControl`); the phase
  leaving `'playing'` — out of play, foul, goal, half end (`outOfPlay` / `fouledWon` /
  `foulCommitted` / `goal`); or full time (`matchEnd`).
- **Restarts are dead-ball time and are excluded** — `phase === 'restart'` is not `'playing'`.
  A spell that begins with the restart taker's first touch is tagged `origin: 'restart'`
  (kickoffs `'kickoff'`); the **headline distribution is the `openPlay` subset**, and the
  all-origins distribution is reported beside it.
- **Duration** = `(endTick − startTick) · DT`, **including in-spell loose time** — this is the
  Opta "sequence" shape, so the duration reference band is read like for like. The
  controlled-time-only variant (`ownedTicks · DT`) is reported beside it.

**Reported:** median / p25 / p75 / p90 / mean / sd / max, a frozen histogram
(`≤0.5 · ≤1 · ≤2 · ≤3 · ≤5 · ≤8 · ≤12 · ≤20 · >20` sim-seconds), the terminator mix, the
origin mix, and the **first-touch death share** (below).

### 3.2 Share of spells dead at the FIRST touch

- **Strict:** an open-play spell with **exactly one ownership episode** that ended with the
  opponents establishing control.
- **Wide:** the same one-touch spell also counting endings out of play or in a foul by the
  holding team.
- The bare `oneTouchShare` (all one-touch spells, any terminator) is reported too.

### 3.3 Touches per possession

A **touch** = one **ownership episode** (a tick where `ball.owner` becomes a body it was not
on the previous tick): a reception, a dribble re-collect, or a tackle-win. Reported as the
count per open-play spell, with buckets `1 · 2 · 3 · 4 · 5 · 6–9 · 10+`.

> ⭐ **An episode is CLOSED at the same boundary that closes the spell** (#171.1.i). When the
> phase leaves `'playing'`, the open episode ends on that tick and the ownership tracker is
> reset, so a body still holding the ball through a stoppage does **not** continue one
> episode across the dead ball: the resumption (a restart taker, or the same body playing on)
> is a **new** episode. **No dead-ball tick is ever an on-ball tick.**

> ⚠ **Declared limit.** `Match` exposes `ball.owner`, **not a foot-ball contact event**. An
> episode shorter than one tick (1/60 s) is invisible, and a contact that never establishes
> control is seen only through its effect on ownership. Deriving the metric from observable
> state is **required** by X-SRC-ZERO (#170.1) — the alternative was a `src/**` change, which
> is forbidden.

### 3.4 Time on ball per touch

`(releaseTick − receptionTick) · DT` per ownership episode — **owner-held ticks per touch**,
counting **`phase === 'playing'` ticks ONLY**. The episode closes at the phase-exit boundary
(§3.3), so a carrier who is still on the ball when the whistle goes accrues **zero** hold
through the restart — dead-ball time cannot leak into time-on-ball. A duration: sim-seconds
only. Buckets `≤0.1 · ≤0.28 · ≤0.5 · ≤1 · ≤2 · ≤4 · >4` s. The share at or under the frozen
first-touch window is reported explicitly.

### 3.5 Turnovers and possession changes

- **Turnovers** = spells terminated by `opponentControl` (a live turnover, not a stoppage).
- **Possession changes** = the spell count itself.
Both on both axes.

### 3.6 Press-context reception outcomes

**PRESSURE RADIUS R, FROZEN EX ANTE FROM A TRACED `constants.ts` VALUE:**

> **R = `TOUCH_CONTROL_DIST` = 4.2 m** — `src/sim/constants.ts:315`.

**Rationale (why this member of the radius family):** it is the substrate's **own** pressure
switch. Its documentation lives in **two adjacent comment blocks**, and is quoted here with
the elision marked (`constants.ts:305–311`, the Phase-36 discrete-touch block, then
`constants.ts:312–314`, immediately above the const):

> *"Under pressure (an opponent inside `TOUCH_CONTROL_DIST`) the carry stays glued: close
> control IS short touches, and the tackle/shield duel lives there."* **[…]** *"Nearest-opponent
> distance above which the carrier plays open touches."*

The census must read pressure the way the world itself defines it, not the way we would like to.

Two **sensitivity** radii are reported beside it, never instead of it:
`CONTEST_RADIUS = 3.0` m (`constants.ts:256`) and `CONTROL_RADIUS` (`constants.ts:244`).

> ⚠ **`CONTROL_RADIUS` IS NOT A FLAT 1.25 m** (#171.1, finding 5). The source is
> `CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE`, and `CONTROL_REACH_SCALE`
> (`constants.ts:31`) is `positiveEnv('CONTROL_REACH_SCALE') ?? 1` — **env-scalable**. The
> probe therefore imports the constant, uses the **computed runtime value** as the tightest
> sensitivity radius, and writes that value, the formula, and the observed
> `CONTROL_REACH_SCALE` into the JSON trace. In an unscaled environment
> (`CONTROL_REACH_SCALE = 1`) it is 1.25 m; the JSON, not this sentence, is the record.

The engine also has a genome-dependent *reception* trigger —
`trigger = 3.0 + team.genome.tempo · 1.5` ⇒ 3.0–4.5 m (`Match.ts:1710`). Its observed range is
**reported**, but it is **not** the frozen radius: a radius that moves with the arm is not a
ruler.

**Pressed** = nearest non-sent-off opponent within R **at the reception tick** (keepers
included — a keeper 4 m away is pressure).

**The four frozen outcomes** (classified by what followed the episode, with
`FIRST_TOUCH_S = 0.28` s as the hold threshold — §3.7):

| outcome | definition |
|---|---|
| `retainedBeyondFirstTouch` | the receiver took another touch himself, **or** released to a teammate after holding longer than the first-touch window |
| `releasedFirstTouchSafe` | released to a teammate within the first-touch window (the ball survived) |
| `lostWithinFirstTouch` | the spell died here, hold ≤ the first-touch window |
| `lostAfterHold` | the spell died here after holding longer than the window |
| `fouled` | the spell ended in a foul won by the holding team |
| `otherDeadBall` | goal / out of play / full time |

(The mandate's four-way is the first four rows; `fouled` and `otherDeadBall` are carried so the
shares sum to 1 and nothing is silently dropped.)

### 3.7 Action durations

**FIRST-TOUCH WINDOW, FROZEN EX ANTE FROM A TRACED ENGINE VALUE:**

> **`FIRST_TOUCH_S` = 0.28 s** — `p.firstTouchWindow = 0.28`, `Match.ts:1725`.

That is the engine's own 一脚出球 window: a pass struck inside it *is* played first-time, with
the first-time accuracy penalty. So "released at the first touch" is the **substrate's** own
definition, not ours.

- **Reception→release gap:** the §3.4 distribution, read as an action duration.
- **Kick execution time (wind-up):** `match.pendingKick` episodes — the committed-but-unstruck
  shot. **ABSENT-WITH-REASON on the production arm:** `pendingKick` is null in every path
  unless the `c7Windup` seam is armed, so the shipped world **has** no measurable kick
  execution time — the strike is instantaneous. ⭐ That absence is itself the VISION §2 C7
  finding, and it is reported as such rather than patched (patching it would be a `src`
  change).

### 3.8 Events per minute

`passes`, `passesCompleted`, `shots`, `goals`, `fouls`, `miscontrols`, and **regains**
(`interceptions + tackles`) from the passive `TeamMatchStats` ledgers, both teams summed, on
both axes.

---

## 4. ⭐ THE H-169a DISCRIMINATOR (frozen ex ante)

**H-169a (the user's story, #169.3):** pressure has no OUTLET — first-touch control, hold,
shield and look either do not exist or cost zero time in the substrate, so the only legal
answer to a press is to move the ball instantly ⇒ the scramble self-perpetuates and tempo
compresses.

**The contrast.** Among the **FIRST reception of each OPEN-PLAY spell**, at the frozen radius R:

> ⭐ **POPULATION, stated exactly** (#171.1.iv). The headline discriminator — and the headline
> press-context block of §3.6 — run on **`origin: 'openPlay'` spells' first receptions ONLY**.
> Restart- and kickoff-origin receptions are **set-piece geometry** (a placed ball, a
> retreating defence) and were ≈30.6% of all first receptions in the draft smoke; folding them
> in silently changes what "pressed" means. The **all-origins variant is reported beside it**,
> labelled `CONTEXT ONLY`, so the population choice is auditable rather than hidden.

```
P(lost | pressed)   vs   P(lost | unpressed)
ratio = P(lost|pressed) / P(lost|unpressed)      gap = P(lost|pressed) − P(lost|unpressed)
```

**The reading rule, frozen BEFORE any run so it cannot be fitted after sight:**

| condition | reading | what it means |
|---|---|---|
| ratio ≥ 1.5 **and** gap ≥ 0.10 | **PRESSED-SPECIFIC** | first-touch death is a *pressure* phenomenon ⇒ **the outlet story holds**: the missing seats (C5 hold/shield, C7 wind-up, look-to-buy-information) are where the fix lives |
| ratio ≤ 1.2 **or** gap ≤ 0.05 | **NOT PRESSED-SPECIFIC** | spells die unpressed too ⇒ **the disease is elsewhere** (reception quality, pass choice, spacing) and the outlet seats are not the lever |
| anything between | **AMBIGUOUS** | the contrast does not discriminate at this N; the commander rules on the rest of the table |

⭐ **REPORTED, NEVER GATED.** The thresholds decide a *reading*, not a pass. Mean hold time
pressed vs unpressed is reported alongside, because "no time to do anything" and "loses it
anyway" are different diseases.

---

## 5. REFERENCE BANDS — real football

> ## ⭐⭐ **THESE BANDS GATE NOTHING.**
> They are **reference lines** for the commander's gap table. No PASS/FAIL is computed against
> any of them anywhere in the probe. **VISION §3 house law:** curve shapes and causal seats may
> be referenced; **CONSTANTS ARE NEVER IMPORTED** — no number in this table reaches any sim
> value, and none of them is a target.

> ⚠ **THE SCALE CAVEAT, read before any band.** Every band below is **eleven-a-side,
> full-pitch** football. Our world is **6v6 on a 0.70-scaled pitch (63.0 × 40.6 m)** with 240
> sim-seconds mapped to 90 display-minutes. **Counts** (passes, shots, fouls per match) are
> *not* comparable across that gap. The **duration and shape** bands — spell length, time on
> the ball, touches per possession, the first-touch share — are the ones worth reading,
> because a human body's time is the same in both games.

> ⚠ **THE SCOPE CAVEAT (#171.1.iii).** Every count this probe emits is a **BOTH-TEAMS SUM per
> match**. B9 and B10 are stated **per TEAM per match**. The probe therefore emits
> `perTeamPerMatch` (= sum / 2 — the arms are symmetric, so the halving is exact *in
> expectation over the seed set*, not a per-match attribution) beside `perMatch` for
> `passes` / `shots` / `fouls`, and each of those two band records carries the warning in the
> record itself. **A per-team band read against a both-teams sum is a 2× error.**

**Grade key.** `O/T/I/S` = the eFootball research file's own evidence grades
([`../efootball_engine_research_for_evofootball.md`](../efootball_engine_research_for_evofootball.md)
§0). `P` = labelled **public** real-football estimate with its citation. `D` = **derived** from
another band, arithmetic shown. `ABSENT` = no honest source exists ⇒ **no band**.

| # | metric | band | grade | source |
|---|---|---|---|---|
| B1 | possession-spell ("sequence") **mean duration** | **9.6 – 10.4 s** | P | Opta / Stats Perform, Premier League open-play sequences: **10.4 s** mean in 2024-25, **9.6 s** in 2025-26. [theanalyst.com — playing styles 2024-25](https://theanalyst.com/articles/analysing-premier-league-playing-styles-2024-25) · [premierleague.com/en/news/4426039](https://www.premierleague.com/en/news/4426039/opta-analyst-on-long-balls-long-throws-key-tactical-trends-spotted-in-2025-26-season) |
| B2 | spell **p25 / median / p75** | — | **ABSENT** | Opta publishes sequence **means**, not the quantile set; no public quantile source located, and the research file has none. **Our quantiles are reported against NO band.** |
| B3 | **passes per open-play sequence** | **2.88 – 5.12** (league central ≈ 3.5–4) | P | Opta PL team-season range: 2.88 (lowest) to 5.12 (highest); Man City 5.1, Southampton 4.4 in 2024-25. Same two sources as B1. ⚠ This is **passes**, not touches ⇒ a **lower bound** on touches per possession (a carry adds touches without a pass). |
| B4 | **time on the ball per touch** | **0.8 – 1.3 s** | **D** | Derived from two public figures: a player is in possession ≈ **1 min 49 s (109 s)** across a 90′ match ([gulfnews.com](https://gulfnews.com/amp/story/sport%2Ffootball%2Fa-football-game-lasts-90-minutes-you-say-1.2002589), quoting the standard broadcast /《The Numbers Game》figure) and is involved in **111 ± 77** on-ball activities per match ([PMC3778701](https://pmc.ncbi.nlm.nih.gov/articles/PMC3778701)). **109 / 111 ≈ 0.98 s per touch**; widened to 0.8–1.3 s for the ±77 dispersion. LOW confidence, labelled. |
| B5 | **possession changes per display-minute** (both teams) | **3.0 – 4.5** | **D** | Derived from B1 + ball-in-play time: the PL ball was in play **56 min 58 s** of 90 in 2024-25; at a ≈10 s mean sequence that is ≈**342** sequence-ends per match ⇒ **342 / 90 ≈ 3.8** per display-minute (≈6.0 per ball-in-play minute). **Not an independent measurement** — it is B1 re-expressed and inherits B1's uncertainty. |
| B6 | share of possessions **dying at the first touch** | — | **ABSENT** | No public per-possession first-touch-death rate located; the research file has none. B3 bounds it only indirectly (a league mean of 3.5–4 passes per sequence is hard to reconcile with a *majority* of sequences dying on touch one — but that is an inference, not a band). |
| B7 | **pressed vs unpressed** first-touch loss rate | — | **ABSENT** | The H-169a discriminator has **no** real-football reference. It is read as an **internal** contrast (pressed vs unpressed *within the same arm*), which is precisely why it can discriminate without a band. |
| B8 | **kick preparation delay** (wind-up) — shape only | see source | **T** | Research file §5.2 / §5.3 / §5.6 (grade **T**, controlled frame-by-frame tests): a 99-rated ground passer's preparation delay is **≈4 frames** shorter than a 60-rated one on a ~15 m pass; below 60 the delay is floor-clamped; **60–80** is where ability matters most; above 80 the margin is ≈1 frame; the new engine is 2–3 frames faster at high ability. **SHAPE ONLY** — a frame count from another engine is not a target and no value here is imported. What it licenses is the qualitative claim that a real engine **spends real time between the decision and the strike** (VISION §2's C7 seat). |
| B9 | **shots per team per match** ⚠ **PER TEAM** — read against `eventsPerMinute.shots.perTeamPerMatch` (= the both-teams sum / 2), **never** against `perMatch` | **10 – 14.5** (WEAK) | P | Only team-level datapoint located: Arsenal **14.53** shots/match 2024-25 ([statmuse](https://www.statmuse.com/fc/ask/premier-league-teams-average-shot-per-game)), which was among the league **leaders** ⇒ the league mean sits below it. Band deliberately wide; its **centre is not sourced**. Order-of-magnitude line only. |
| B10 | **fouls per team per match** ⚠ **PER TEAM** — read against `eventsPerMinute.fouls.perTeamPerMatch` (= the both-teams sum / 2), **never** against `perMatch` | **9 – 12** (WEAK) | P | Arsenal committed **399 fouls in 38 matches** 2024-25 = **10.5**/match ([statmuse](https://www.statmuse.com/fc/ask/premier-league-fouls-team-stats-2024-2025)). One team, one season; band = that value ±1.5. |

**Nothing from the research file was found for B1–B7.** That file is an **engine** study
(eFootball mechanics, evidence-graded O/T/I/S); it carries no real-football possession
statistics. B8 is the one band it does supply, and it supplies a *shape*, not a value.

---

## 6. ARMS

Three arms, **the same seeds across all three** — the shared seed set *is* the pairing.

| arm | world |
|---|---|
| `prod` | **the SHIPPED game** — no match flags, no station eye, no gene written |
| `v1` | the #156 **uniform whisper**: `A4_WORLD_FLAGS` + the PRIOR eye (`v4.homePrior`) + `homePriorObedience = 0.5` on BOTH sides |
| `v2` | the #167.5 **discipline** world: v1 + the frozen backLoaded offset family `[0,+.4,+.2,0,−.2,−.4]` on BOTH sides |

> ⚠ **DECLARED CONFOUND.** `prod` differs from `v1` in **two ways at once** — the enriched
> construction flags **and** the eye/gene. This is deliberate: *production* means the world the
> user actually plays, not a single-factor control. **No prod-vs-v1 causal claim is made or
> permitted.** The three arms are three absolute levels, not an experiment.

---

## 7. SEEDS, N, WALL, STATS BASE

### 7.1 Seed ledger

Per **#166.2.ii** (binding): Leg S's true upper bound was **12,292,944**, so
**everything through 12,292,999 is consumed or reserved** and the next free census seed is
**12,293,000**.

| block | range | use |
|---|---|---|
| smoke | **12,293,000 – 12,293,039** | 40 seeds × 3 arms (sizing / wall / plumbing only) |
| census | **12,294,000 – 12,296,999** | up to `CENSUS_N_CAP = 3,000` seeds × 3 arms |
| reserved band | **12,293,000 – 12,299,999** | reserved in full by this stage |

Disjointness is **proved in-probe** (`fidelity.seedDisjoint`): every seed strictly above the
consumed ceiling, zero collision against the itemized A4 ledger (carried forward, including
#166's two corrections), the stage's own two blocks disjoint from each other, and everything
inside the reserved band.

### 7.2 Stats base

**102,200** — published but **UNSPENT** per #166.2.ii (Leg S never drew from it), reused here
by that explicit finding. Nearest other published base is 102,000 ⇒ gap **200** = the #163
floor exactly. Reserved: **102,400**. CIs are deterministic percentile bootstraps (2,000
resamples) on the **stats stream**, never the match RNG.

### 7.3 N — the sizing arithmetic (frozen BEFORE the smoke ran)

The headline read is the spell-length **quantile set**. For an order statistic
`SE(q_p) ≈ sqrt(p(1−p)/n) / f(q_p)`, so precision is driven by the **count of spells**, not the
count of matches. Frozen target:

```
TARGET_SPELLS_PER_ARM = 20,000
  ⇒ sqrt(0.25·0.75 / 20000) = 0.0031 in probability mass, which on a spell-length
    density of even 0.05 /s at p75 is a p75 standard error of ≈0.06 s — an order of
    magnitude finer than any reference band we compare against.

N* = min( ceil(20000 / spellsPerMatch_binding) rounded up to 50,
          floor(wallBudget / (ms_per_match × 3 arms × 2 X-DET)),
          3000 )
```

`spellsPerMatch_binding` = the **lowest** open-play spells/match across the three arms (the
arm that needs the most matches sets N for all three — same seeds, same N).

**Wall budget: ≤ 2 h** for the whole launched census (#170), X-DET double-run included.

### 7.4 What the smoke is for

The 40-seed smoke is **sizing, wall and plumbing ONLY**. Its absolute levels are honest data
and are committed, but **no conclusion in this document is derived from them**, and none may
be: the reading rules above were frozen before it ran and the gap table is adjudicated on the
full census.

---

## 8. GATES (plumbing only — no football gate exists in this stage)

| gate | form |
|---|---|
| **X-DET** | the entire experiment core runs **twice**; the canonical digests must be identical |
| **X-SRC-ZERO** | `git diff --stat -- src` must be empty (HARD) |
| **X-FP-PROD** | a 2-season headless league on seed 1337 must hash to `57b0bdab…c673` |
| **X-MERGE-IDENT** | the injected P3p-1 merged table + v3 control rehash to their declared SHAs |
| **seed disjointness** | §7.1, proved in-probe |

Determinism: no `Date.now` / `Math.random` on any result path. Wall time is measured **outside**
the X-DET-compared core (#128) and is **excluded from `resultSha256`**; the JSON carries both
`resultSha256` (deterministic content) and `sha256` (whole body).

---

## 9. COMMANDS

```bash
# sizing smoke (done — committed). Foreground: ~1 minute.
TEMPO_MODE=smoke npx tsx scripts/probes/tempo-census.ts
```

**The full census — the §0.0.4 DETACHED form.** A sub-agent session dies and orphans its
background processes, so the commander's own resident session launches it with `nohup … &
disown` and supervises the **PID + the declared log file** (PROGRAMME §0.0.4 / #49.5, the
#161 incident rule):

```bash
# LOG PATH (declared): /tmp/tempo-census-full.log
nohup env TEMPO_MODE=census TEMPO_N=<N* from the smoke> \
  npx tsx scripts/probes/tempo-census.ts \
  > /tmp/tempo-census-full.log 2>&1 & disown

# supervise: the PID printed above, plus
tail -f /tmp/tempo-census-full.log
```

Outputs: `docs/world-model/data/tempo-census-sizing-smoke.json` ·
`docs/world-model/data/tempo-census.json` · run log `/tmp/tempo-census-full.log`
(progress is written to **stderr**, which the redirect captures).

---

## 10. DEVIATIONS + REGISTERED NON-CLAIMS

**Deviations** (all declared ex ante, all also carried in the JSON):

1. The `prod` arm is a **two-factor** difference from v1 (§6).
2. A **touch is an ownership episode**, not a foot-ball contact (§3.3) — required by
   X-SRC-ZERO.
3. **Kick execution time is ABSENT on the prod arm** by the substrate's own construction
   (§3.7); reported as the finding it is, not patched.
4. **Spell duration includes in-spell loose time** (the Opta sequence shape), with the
   controlled-time-only variant reported beside it (§3.1).
5. **Fouls are attributed by ledger delta** within ±6 ticks of a spell's terminating tick
   (`team.stats.fouls` is the only observable), so an "advantage" foul that does not stop play
   may land on the wrong side of a spell boundary. Bounded and declared.
6. **The reference bands are 11v11.** Two are ABSENT, two are DERIVED with the arithmetic
   shown, and two rest on a single team-season datapoint and are labelled WEAK (§5).

**Registered non-claims:**

- **Nothing ships** (Road B): zero `src/**`, fingerprint unchanged, every flag armed only
  inside the instrument.
- **The bands gate nothing.**
- **The H-169a discriminator is a reading, not a ruling.**
- **No watchability claim** — tempo feel is the user's eyes (#152).
- **No mechanic is proposed here.** The outlet-seats vs punish-compactness fork is the
  commander's to present after the gap table (#170.3).
