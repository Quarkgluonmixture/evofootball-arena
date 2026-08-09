# THE GOAL-GENEALOGY CENSUS — pre-registration (BUILD-UP arc, phase 0)

**Authority.** Commander ruling **#214** (the user ruled 甲 on the #213.3 fork) — the
BUILD-UP arc opens with its phase-0 **gap table**, in the **#170–#173 tempo-census form**:
*descriptive, X-family-gated only, no pass/fail on any measured quantity; the commander
adjudicates the table from the per-arm rows (#203).*
Inherited discipline: **#181.2** (receipts), **#194 / #196 / #197 / #198** (head OUTSIDE the
hashed body · unabridged transcripts · hashes computed in-probe · no doc-typed numbers),
**#203** (per-arm rows), **#163** (stats bases stream-disjoint, gaps ≥ 200), **#128** (wall
measured outside the X-DET-compared core), VISION §3 (**reference SHAPES may be cited;
常数永不进口**).

**What this is.** Not an A/B. An **absolute census** of where this world's goals come from
and what the ball does in the back third, read on the world the user plays (PROD) and on the
two MT play-test worlds the user just watched (#211.3 / #212). It exists because the user's
#213 story — *"进球多由失误/抢断发起 · 后场倒脚太多 · 后场失误太多"* — is a **hypothesis
until it has a probe**, and no goal-genealogy instrument existed.

> ⚠⚠ **CORRECTION ROUND — commander ruling #215.3 (the #187 / #190 form: corrections marked
> in place, the old claims left readable).** The #215 machine-verify of the #214 build failed
> (1 HIGH + 2 MEDIUM + 2 LOW). Five things changed, all instrument-side, none of them the
> frozen design (arms, N rule, seeds, the ladder-as-reporting, the gates' set are untouched):
>
> 1. **(H1 + M2 — one root cause) THE LOSS TICK.** The 后场失误 count *and* the by-third
>    turnover origin classes now read the ball at the segment's **LAST OWNED tick** (the
>    loss / release point), in the loser's frame and mirrored into the winner's frame for the
>    classes — i.e. exactly what §2.1 and §2.4 below *always said*. The #214 probe read the
>    **regain** tick instead. On the smoke block that moved own-third turnovers from
>    **49 → 86** for PROD (the regain reading was the low one).
> 2. **BOTH READINGS ARE PUBLISHED.** The loss spot is the definitional one; the regain spot
>    stays as the declared cross-cut (`atRegainSpot`, `byOriginAtRegainSpot`,
>    `lossVsRegainWedge`), because the gap between the two ticks is a real property of this
>    world — how far the ball travels between release and the opponent's control — and it is
>    worth watching rather than hiding.
> 3. **(M3) THE PREFLIGHT BYPASS IS CLOSED** — see §6.
> 4. **(L4) THE PUBLISHED STATS-BASE LEDGER IS COMPLETE** — see §4.2.
> 5. **(L5) `matchOpenFallback` SPLIT OUT of `restartSecondBall`** — see §2.1.

**Road B binds.** ZERO `src/**` changes. Every quantity below is derived from a **tick-walk
over observable match state** (the tempo census's own instrument idiom, extended). The
production fingerprint is re-derived unchanged inside the probe.

---

## 1. ARMS (3) — the live entry worlds, armed exactly as the app arms them

| arm | what | how it is armed |
|---|---|---|
| **PROD** | the shipped game | `new Match({seed, teamA, teamB})` — no match flags, no station eye, no gene written |
| **MT02** | 🧪 the ruled KNEE dose (a4World **v4**, ladder arm **D02**) | `new Match({...base, ...a4MatchFlags(4)})` then `armA4World(match, null, 4)` |
| **MT08** | 🧪 the CONTRAST dose (a4World **v5**, ladder arm **D08**) | `new Match({...base, ...a4MatchFlags(5)})` then `armA4World(match, null, 5)` |

⭐ **NO DOSE AND NO FLAG IS TYPED IN THIS PROBE.** The arms call `a4MatchFlags` /
`armA4World` / `MT_WORLD_DOSE` / `MT_WORLD_FLAGS` from `src/game/a4World.ts` directly — the
same functions `GameApp` calls — so the census world *is* the world the user played, by
construction rather than by transcription. `gArm` then re-reads the built match and asserts
the **full #196.3-D4 checklist** on both MT arms:

* both consumption flags on the match (`pmLaneConvergence`, `mtMarkSag`), and the flag key
  set equal to `MT_WORLD_FLAGS`;
* **both genes at the world's dose on all three genome views of both teams**
  (`info.genome` / `baseGenome` / `effGenome`);
* `stationEye === null` (an MT world carries no eye, no whisper, no discipline family);
* the **fixed-dose limb**: the two evolution opt-ins (`evolve…`) are **`MutateOptions`
  fields, not genome fields** — a *world* cannot arm them, only an `evolve()` **call** can.
  So the limb proves the stronger thing: this instrument contains **no mutation/crossover
  entry point at all** (checked against its own source, needles assembled at run time so the
  test cannot match itself). Nothing here can mutate either gene;
* the engine-side readback `mtArmedVersion(match) === version`;
* and, on PROD: no flags, both genes **absent**, eye null, `mtArmedVersion === 0`.

⚠ **DECLARED CONFOUND.** PROD differs from the MT arms in flags AND genes at once
(`edsPerceivedDefence` / `edsPerceivedChoice` ride the MT worlds' substrate). That is
deliberate and inherited from #211.3: these three arms are **the three worlds that exist**,
not a single-factor decomposition. No PROD-vs-MT *causal* claim is made or permitted.

---

## 2. THE FROZEN DEFINITIONS (each with its observation mechanism)

### 2.0 POSSESSION SEGMENT (the spine — inherited from the tempo census §3.1, verbatim)

> a maximal interval of same-owner-**TEAM** ball control while `phase === 'playing'`; opened
> at the first tick a body of that team owns the ball, **SUSPENDED (not ended)** while the
> ball is loose in play (a pass in flight, a knock, a deflection), ended by an **opponent
> establishing ownership**, by the phase leaving `'playing'` (out of play / foul / goal /
> half end), or by full time.

That is the whole debounce: *loose ball does not end a segment; opponent ownership does.*
Restarts therefore always start a **new** segment with **its own origin class**.
**Observed from**: `match.ball.owner` (side + gid), `match.phase`, `match.simTick`.

### 2.1 ORIGIN CLASS of a segment (frozen, mutually exclusive, exhaustive)

| class | family | fired when the segment opens and… | observed from |
|---|---|---|---|
| `kickoff` | RESTART | the first owner is `match.kickoffKickGid` | `kickoffKickGid` |
| `goalKick` / `kickIn` | RESTART | first owner is `match.restartKickGid` and `restartKickKind` is that kind | `restartKickGid` + `restartKickKind` |
| `setPieceCorner` / `setPieceFreeKick` / `setPiecePenalty` | **SET PIECE** | ditto, for `corner` / `freeKick` / `penalty` | ditto |
| `restartSecondBall` | RESTART | play resumed from a dead ball but the first team to own it is **not** the taker | the dead-ball flag + owner gid |
| `matchOpenFallback` | RESTART | ⚠ **ADDED #215.3-L5** — an open-play regain with **no previous segment** to read a loss spot from. Split out of `restartSecondBall`, which the #214 build made carry both. Expected **empty** in every arm (the match opens from a kickoff); published so the emptiness is auditable rather than assumed | owner gid + the absence of a previous segment |
| `scrambleLooseBall` | OPEN PLAY | possession changed hands with **no dead ball**, and at least one tick in the gap between the two segments was classified `contested` by the substrate itself | `match.possessionPhase.kind === 'contested'` |
| `turnoverWonInOwnThird` / `…MiddleThird` / `…FinalThird` | OPEN PLAY | possession changed hands with no dead ball and no contested tick — the **clean regain / interception** | ball position at the **loss tick**, in the frame below |

⭐ **THE REGAIN CROSS-CUT (frozen at plumbing time, before any measured run).** The bounded
preflight showed the substrate's own `contested` test absorbs ~60–70 % of regains, which
would have left the three by-third classes nearly empty and answered the user's question
with a single undifferentiated `scramble` bucket. The **origin class list above is
unchanged**; what is added is an **orthogonal report** carried by every open-play regain —
**where** it happened (own / middle / final, winner's frame) **×** whether it was
**contested** — for segments and for goals. Declared here and in the artifact's deviations;
no measured level for any arm was seen before it was frozen.

⚠ **CORRECTION (#215.3-H1 + M2) — WHICH TICK "the loss tick" IS.** The row above always said
*ball position at the loss tick*; the #214 probe in fact classified on the **regain** tick
(where the opponent established control). It now reads the previous segment's **last owned
tick**, as written. The regain-tick cut survives, **published beside it** as
`byOriginAtRegainSpot` / `byOriginShareAtRegainSpot` for segments and goals, so the wedge
between the two readings is itself data. The `scrambleLooseBall` limb is identical under both
cuts by construction (it is decided by the substrate's `contested` flag, not by a position).

⭐ **THE THIRD IS NAMED IN THE WINNING (new possessing) TEAM'S ATTACKING FRAME.**
`turnoverWonInFinalThird` = a **high** regain = the ball was lost in the **loser's own
third**. The two frames are exact mirrors (`localX_winner = −localX_loser`), and every row
that names a third also carries the mirror sentence, so the two readings can never be
confused. Third boundaries are the inherited `±HALF_L / 3` (the #188 / PM-T1
`OWN_THIRD_LOCAL_X` constant, traced, not invented).

### 2.2 ⭐ GOAL GENEALOGY

Every **goal** (detected as a `match.score` delta) is mapped to **the segment open at that
tick** — the segment the tick-walk then closes with terminator `goal`. Each goal carries:

* its segment's **origin class** and family (SET PIECE / RESTART / OPEN PLAY);
* the segment's **construction**: **completed passes** (the engine's own
  `team.stats.passesCompleted` delta accrued inside the segment span, side-checked),
  attempted passes, **duration** in sim-seconds, **thirds traversed** (the set of thirds the
  ball occupied while the segment was open, plus start third and the deepest/highest local
  x reached);
* `scoringSideMatchesSegment` — false marks an own-goal / deflection-off-the-defender goal;
  it is **reported, never dropped**.

**REPORTED AT A THRESHOLD LADDER, not at one N (#214.1).**
For **N ∈ {3, 4, 5}**: `constructed(N)` = a **non-set-piece** goal whose segment completed
**≥ N** passes; `transition(N)` = a non-set-piece goal with **< N**. Both are reported for
each N, on two populations — **non-set-piece** (OPEN PLAY ∪ RESTART) and **open-play-origin
only** — and the **set-piece share is reported separately** and is never folded into either
side of the split. ⚠ **The ladder is a REPORTING GRID, not a gate**: nothing in this probe
computes PASS/FAIL from it, and no N is privileged.

### 2.3 后场倒脚 — the back-third loop

* **own-third pass share** = located completed passes whose **origin** is in the passing
  team's own third ÷ all located completed passes;
* **lateral/backward share of own-third passes** = own-third passes that are **not forward**,
  where *forward* is the **engine's own definition, traced**: `localX(target) −
  localX(passer) > 2` (`src/sim/mechanics.ts:406/497/624/644`, the same predicate that
  increments `stats.passesForward`);
* **own-third chains** = within one segment, the maximal run of consecutive located passes
  whose origin is in the own third — **mean** and **max** per possession;
* **own-third time share** = owned ticks with the ball in the possessing team's own third ÷
  all owned ticks.

**Pass observation.** A completed pass is counted from the `team.stats.passesCompleted`
delta (the engine's own counter, side-attributed). It is **LOCATED** by reading
`match.lastCompletedPass` on the same tick: origin = the **passer's position at the last
tick he owned the ball** (his release point, recorded by the tick-walk), destination = the
**receiver's position now**. ⚠ The **located share is published per arm** — an unlocated
completed pass is counted in the totals and excluded from the positional blocks, never
silently dropped.

### 2.4 后场失误 — the back-third error

* **own-third turnover** = a segment ending with terminator `opponentControl` whose **loss
  position** (ball position at the segment's last owned tick) is in the **losing** team's own
  third. Reported per match.
* **DANGEROUS subset, at a LADDER {5 s, 10 s}** (sim-seconds on `match.simTime`, the tempo
  census's rate clock): the same turnover followed by an **opponent shot** within the window,
  and — separately — by an **opponent goal** within the window. Shots are observed as
  `team.stats.shots` deltas, goals as `match.score` deltas.

⚠ **A WINDOW IS NOT A CAUSAL CLAIM.** "Shot within 5 s of the turnover" is a *temporal
co-occurrence*, and it is labelled as such in the artifact. The commander reads it as one.

⚠ **CORRECTION (#215.3-H1).** The definition above is unchanged — but until this round the
probe counted at the **regain** tick, not the last owned tick, which understated the quantity
(**PROD smoke block: 49 at the regain spot vs 86 at the loss spot**, +75 %, on exactly the
user's #213 observation). Both readings now ship per arm: `ownThirdTurnovers…` (definitional,
loss spot) · `atRegainSpot.…` (the cross-cut, the #214 number) · `lossVsRegainWedge` (Δ and
ratio). The dangerous-subset ladder is computed **on both**, each against its own denominator.

---

## 3. REFERENCE SHAPES (context only — THEY GATE NOTHING)

House law (VISION §3): shapes and axes may be cited; **no constant is imported into any
computation**, and no number here is a target.

* **The axis itself is real football's.** Build-up vs transition vs set piece is a standard
  real-football analytics decomposition of goal origins — that is the *shape* #214 cites, and
  it is why the split exists at all.
* **No numeric band is claimed for goal genealogy.** The repo's reference file
  (`docs/efootball_engine_research_for_evofootball.md`) is an **engine** study and carries no
  real-football goal-origin statistics, and no verified public figure is quoted here.
  Grade **ABSENT** ⇒ **our genealogy levels are reported against NO band.**
* **The one repo-internal orientation** is the tempo census's own band **B3** (passes per
  open-play sequence, PUBLIC/Opta, league range 2.88–5.12), which lives in
  `docs/world-model/TEMPO-CENSUS.md` §5 and its committed artifact
  `docs/world-model/data/tempo-census.json`. The probe **hashes that artifact's bytes** and
  names it (#181.2) — it reads **no level** out of it, and the 3/4/5 ladder is the ruling's
  own reporting grid, **not** a quantity derived from that band.
* ⚠ Every real-football shape is **11-a-side, full pitch**. This world is **6v6 on a
  0.70-scaled pitch** with 240 sim-seconds mapped to 90 display-minutes. Counts do not
  transfer across that gap; only shapes and orderings are worth reading.

---

## 4. SEEDS · STATS BASE · N (frozen BEFORE the smoke ran)

### 4.1 Seed ledger

Fresh band **12,421,000 – 12,421,999**, strictly above every block the arc has consumed
(the MT-LADDER ledger, carried forward, ends at its reserved band 12,420,000–12,420,999).
Three own sub-blocks, mutually disjoint and ordered:

| sub-block | range | use |
|---|---|---|
| smoke | 12,421,000 – 12,421,011 | 12 seeds × 3 arms — plumbing + the two sizing numbers |
| exit-semantics | 12,421,050 – 12,421,099 | where **every** non-census full-mode run is routed — a `GGC_N` override **or any bounded `GGC_CAP` preflight**. Such a run turns `gNDerived` RED and exits 1; its output is discarded and adjudicates nothing |
| **census battery** | 12,421,100 – 12,421,999 (**cap N = 900**) | the run — **VIRGIN**¹ |

¹ ⚠ **ONE EXCEPTION OF RECORD**: seed **12,421,100** was stepped once by a bounded `/tmp`
preflight taken *before* the routing rule above existed. That artifact was discarded, and the
engine is deterministic, so the battery re-derives it identically. Disclosed rather than
quietly renumbered.

Disjointness against every consumed block is computed **in-probe** (`gSeed`), never asserted
in prose.

### 4.2 Stats base

`104,400` (the bootstrap / resample stream, separate namespace). The nearest published base
is 104,200 ⇒ gap 200 = the #163 floor. Checked in-probe (`gStats`).

⚠ **CORRECTION (#215.3-L4).** The ledger the #214 probe checked against **began at 101,403**
and was missing older bases (the verify found nine). The probe now carries the **complete**
stats namespace — every base declared anywhere under `scripts/**`, spent and reserved-unused
alike, in the tempo census's own `CONSUMED_STATS` form, from 91,100 up. **The gate result is
unchanged**: the nearest base to 104,400 is still 104,200, minGap 200.

### 4.3 N — the frozen rule (sized on **genealogy precision**)

The headline object is **the goal** — every genealogy row is a share **of goals**, so N is
sized on the count of goals per arm, not on matches:

```
TARGET_GOALS_PER_ARM = 600
N* = min( ceil(600 / goalsPerMatch_binding) rounded UP to 25,
          floor(wallBudget / (msPerMatch × 3 arms × 2 X-DET passes)),
          900 )                                        ← the reserved band's own cap
goalsPerMatch_binding = the MINIMUM goals-per-match over the three arms, from the SMOKE
wallBudget = 0.5 h
```

600 goals per arm puts a binomial share's standard error at
`sqrt(p(1−p)/600) ≤ 0.020` — i.e. every genealogy share lands with a ±2 pp worst-case
one-sigma, finer than any distinction the gap table has to draw. At the #211 control's
≈ 2.19 goals/match this is ≈ 275 matches; the deflated MT08 arm binds it upward, which is
exactly why the rule takes the **minimum** arm.

**The smoke feeds N and nothing else** (the #188 §4.3 precedent): exactly two numbers are
read out of the smoke artifact — `msPerMatch` and `goalsPerMatchMin`. **No level, share,
rate, CI or threshold from the smoke is read anywhere, and the smoke adjudicates NOTHING.**

---

## 5. GATES — X-FAMILY ONLY

| gate | what it asserts |
|---|---|
| `xDet` | the whole measured core computed **TWICE**, canonical-JSON digests identical |
| `xFpProd` | the shipped fingerprint `57b0bdab…c673` re-derived **in this process**, unchanged. ⚠ #215.3-M3: `GGC_SKIP_FP` no longer buys a canonical artifact — a skip forces the run onto the preflight path (§6) |
| `xSrcZero` | `git diff --stat -- src` empty — this stage adds ZERO `src/**` |
| `gArm` | the §1 checklist, all three arms, read back off freshly built matches |
| `gSeed` | this run's block above the ceiling, inside the reserved band, disjoint from every consumed block, own sub-blocks ordered |
| `gStats` | stats base 104,400, min gap ≥ 200 from every published base |
| `gNDerived` | in FULL mode the N run **is** the frozen §4.3 rule's output; a `GGC_N` override turns this RED (and exits 1) rather than passing quietly |
| ⭐ `gSegAcct` | **the segmentation-accounting identity**: every tick is assigned to **exactly one** of {a segment · an inter-segment loose interval · dead ball}, the three buckets sum to the total, segment spans are ordered and non-overlapping, and **every goal maps to exactly one segment** (unattributed goals = 0) |

⚠ **THE THIRD BUCKET IS DISCLOSED, NOT HIDDEN.** "Every second belongs to a segment or dead
ball" is *almost* true: the ticks between a restart's whistle and the first body actually
owning the ball are `playing` but ownerless and belong to **no** segment. They are counted in
their own bucket (`looseGapTicks`), published per arm, and the identity is stated over all
three buckets.

**NO GATE READS A MEASURED FOOTBALL QUANTITY.** There is no PASS/FAIL on any genealogy
share, any back-third share, any turnover rate, or any ladder threshold. `verdict` reports
plumbing only.

---

## 6. COMMANDS

```bash
# sizing smoke (~1 min foreground) — plumbing + the two sizing numbers
GGC_MODE=smoke npx tsx scripts/probes/goal-genealogy-census.ts

# the full census — N comes from the frozen rule reading the committed smoke artifact
GGC_MODE=full npx tsx scripts/probes/goal-genealogy-census.ts

# preflight (bounded, writes OUTSIDE docs/, adjudicates nothing)
GGC_MODE=smoke GGC_CAP=2 GGC_SKIP_FP=1 GGC_OUT=/tmp/ggc.json npx tsx scripts/probes/goal-genealogy-census.ts
```

⚠ **CORRECTION (#215.3-M3) — THE PREFLIGHT BYPASS IS CLOSED.** The #214 build decided
"preflight" from `GGC_CAP` **alone**, so an **uncapped** `GGC_SKIP_FP=1` run passed `xFpProd`
as *"skipped"* **and** was allowed to write the canonical artifact path. Now: **any**
skip/preflight lever (`GGC_CAP` *or* `GGC_SKIP_FP`) makes the run a preflight **regardless of
cap or N**, a preflight defaults to `/tmp/goal-genealogy-preflight.json` and is **refused**
on a canonical path — checked at parse time **and again at the write** — and the skip is
recorded in the artifact (`preflightProvenance`, `gates.xFpProd.reDerivedInThisProcess`).
⇒ **an artifact on a canonical repo path always carries a genuinely re-derived `xFpProd`.**

Artifacts: `docs/world-model/data/goal-genealogy-census-smoke.json` (smoke) ·
`docs/world-model/data/goal-genealogy-census.json` (full).
**Exit semantics: 0 = clean census · 1 = X-family invalid · 2 = usage/fatal.**
**No checkpoint/resume** — the battery is a few minutes, so a kill costs the whole run and
that cost is accepted (stated, not hidden).

---

## 7. DEVIATIONS + REGISTERED NON-CLAIMS

1. **A TOUCH / OWNERSHIP EPISODE IS NOT A FOOT-BALL CONTACT** (inherited from the tempo
   census): `Match` exposes `ball.owner`, not a contact event. Deriving everything from
   observable state is **required** by X-SRC-ZERO — the alternative was a telemetry hook in
   `src/**`, which #214.2 forbids.
2. **PASS DIRECTION IS OBSERVED ON COMPLETED PASSES AT THE RECEIVER'S ACTUAL POSITION**,
   while the engine's own `passesForward` counter fires at the **strike**, on the *intended*
   target's position, for **attempted** passes. Same 2 m predicate, different population —
   declared, and both counts are published side by side.
3. **THE ORIGIN CLASSIFIER IS A CLASSIFIER.** A deflected clearance that a defender collects
   cleanly is a `turnover…`; a contested one is a `scrambleLooseBall`, and the contested test
   is the **substrate's own** `possessionPhase` classification, not a threshold of ours.
4. **THE DANGEROUS-TURNOVER WINDOW IS TEMPORAL CO-OCCURRENCE, NOT CAUSATION.**
5. **PROD IS NOT A SINGLE-FACTOR CONTROL** (§1's declared confound).
6. **NO REFERENCE BAND EXISTS FOR GOAL GENEALOGY** (§3) — the levels are reported against
   nothing, and that absence is published rather than papered over with an unsourced number.
7. **NOTHING SHIPS (Road B).** Zero `src/**` changes; the production fingerprint is
   re-derived unchanged; every flag is armed only inside this instrument.
8. **THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING.** It produces the BUILD-UP arc's
   phase-0 **gap table**. Whether the user's story ("goals are turnover-fed; the attack cannot
   construct") is confirmed, refuted, or split is the **commander's adjudication** from the
   per-arm rows (#203) — not this document's, and not the probe's.
9. ⚠⚠ **THE #215.3 CORRECTION ROUND IS ON THE RECORD** (top of this document, and in the
   artifact's own `deviations`): what the #214 build measured, what it now measures, and the
   loss-vs-regain **wedge** published per arm. The failed reading is not deleted — it stays
   as the cross-cut so the correction is checkable rather than merely asserted.

---

## §RESULT

*(empty by design — filled by the commander after the launched run, from the artifact's
per-arm rows. Nothing may be written here before the run.)*
