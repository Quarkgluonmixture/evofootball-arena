# DS-C0 — 「点名普查」 THE DESIGNATION CENSUS（前插到底是谁的选择：球员的，还是教练每 0.4 秒点的名）

> **STATUS: FROZEN — §0 through §DEV-PREFLIGHT are sealed BEFORE the battery.** The results
> sections (§R1–§R7, §HONEST LIMITS, §DEVIATIONS, §GATES) are written at the RESULTS commit and
> the STATUS word is flipped there. §P is NEVER edited after sight.
> Authorized by **COMMANDER RULING #404 item 2**.
> Census form of record: [`GK-C0-KEEPER-JUMP-CENSUS.md`](GK-C0-KEEPER-JUMP-CENSUS.md) — its run
> envelope, its arms, its per-tick walker, its ledger joins, its cluster bootstrap, its frozen
> bins, its hash order, its gate set and its `stage` block are reused; the receipt classes
> struck at [`LN-C3`](LN-C3-UNTRACED-FAMILY-CENSUS.md) §COMMANDER CORRECTIONS,
> [`LN-T1′b`](LN-T1PB-OWN-LANE-EXAM-RERUN.md) §COMMANDER CORRECTIONS and
> [`GK-T1`](GK-T1-DIVE-EXAM.md) §COMMANDER CORRECTIONS are obeyed by construction (the `stage`
> block is THIS instrument's path and the RUNNING file's hash — `gStage`; the call graph is
> EXTRACTED, never declared — `gCodeFactGraph`; no universal is written that is not a stored
> boolean; every predicate is stated with a case where it FIRES and one where it does NOT —
> `gPredicateFixtures`; a liveness receipt exempts the shapes where it cannot hold, or states
> itself on stored rows — `gClassesNonVacuous`).
> Instrument: `scripts/probes/ds-c0-designation-census.ts` — **FROZEN at this commit and
> byte-identical at the RESULTS commit**.
> Artifact: `docs/world-model/data/ds-c0-designation-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. **IT SHIPS NOTHING**, scores no
> hypothesis and **arms no mechanism**. The READ SENTENCES are FROZEN LITERALS selected by a
> STORED boolean, and **no verdict word is printed on the yield**. The commander rules.
> ⛔ **X-SRC-ZERO**: no file under `src/` or `tests/` is created or edited. The probe reads
> public `Match` / `Team` / `Player` / `Ball` state and the engine's own decision record
> (`p.action.scores`) before and after `match.step(DT)`. **THERE IS NO WRAPPER** — `gLockstep`
> proves observed ≡ unobserved byte for byte, **PER ARM**.
> ⛔ **WORLDS 12–15 ARE UNTOUCHED.** E13 is the read of record; D13 and E15 are published
> BESIDE.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**THE AUDIT'S OWN WORDS ON THE DESIGNATIONS** — [`PASSING-SYSTEM-AUDIT-2026-09-02.md`](PASSING-SYSTEM-AUDIT-2026-09-02.md)
§2.2, quoted verbatim (the 前插 row and the 二过一/套边 row of its 接球人 table):

> 「前插是球员自己的选择 | `MakeRun` 只给 TeamBrain 点名的 `runners/arriver/overlapper`
> （`TeamBrain.ts:168-331`，角色权重 ST 2.2 / WG 1.8 / MF 1.2 / DF 0.4） | ⛔ V64
> STILL-TRUE：自上而下的执照」

> 「二过一、套边从配合里长出来 | **手写触发**：短传 <15 m + 受压 +
> `(tempo+passBias)/2·wallPassW > 0.35` ⇒ 2.3 s `wallRun`（`mechanics.ts:434-443`）；套边 =
> `attackingWidth·overlapW > 0.3` 点名（`TeamBrain.ts:296-330`） | ⛔ VISION §1 原话
> 「二过一……从进化里长出来，不是我们手写」——这是**正牌违规**」

and §3.2, quoted verbatim:

> 「`updateTeamBrain` 每 0.4 s（`constants.ts:355`）：定 mode、**点名**追球人（上限手写
> 「永不 3 个」，`TeamBrain.ts:419-423`）、**点名**盯人（贪心最近 22 m）、**点名**前插人/到位人/
> 套边人（`:168-331`）。」
>
> 「⇒ **这是教练视角上最大的 VISION 违规**，且它直接造成 2.2 里「前插不是球员的选择」。」

**VISION §1's own sentence on the commander**, quoted verbatim from [`../VISION.md`](../VISION.md):

> 「教练/球队可以拥有本队共同知道的原则、优先级、风险倾向和结构约束;它们是球员形成私人意图的共同 prior,不是逐 tick 广播"谁去哪个坐标"的 commander。」

**COMMANDER RULING #404 item 2, the scope this census instruments, quoted:**

> *"⭐⭐⭐ **DS-C0 DISPATCHED — 「点名普查」 THE DESIGNATION CENSUS** (a census: measurements
> and frozen read sentences; it arms nothing; nothing ships; X-SRC-ZERO; GK-C0's house form).
> (i) ARMS, paired on shared seeds: **E13** (world 13 empty-book — ③'s control, LN-T1's ABSENT
> arm; the READ OF RECORD) · **D13** (the played form on 13) · **E15** (the frontier world
> empty-book — beside; the code facts state whether the own-lane or the dive door touches any
> designation path)."*

and item 1's CODE READ, **which this census MEASURES and does not assume**:

> *"in open play every `MakeRun` candidate on the attacking off-ball surface is a DESIGNATION …
> the keeper-up corner run is the one non-hat `MakeRun`. The PASSER reads the hats at four
> sites … The OBM eyes seat (`offballEyes.ts`, dormant) prices 前插/回撤 from percepts and, by
> its own docblock, reads no hat. VISION §1: a designation is a per-0.4-s commander; the run
> must become the player's own PRICED choice before the hat comes off (the DF path, M-DF.2:
> "the cap retires by measurement, never by deletion")."*

**THE PATH ③ FOLLOWS** — [`DF-DEFENSIVE-BRAIN-CONTRACT.md`](DF-DEFENSIVE-BRAIN-CONTRACT.md)
§2, quoted verbatim:

> *"**M-DF.1 — ONE SURFACE, EXISTING ACCOUNTS**: the defender's moment-to-moment option set …
> is priced by ONE chooser consuming what is ALREADY BUILT … NO new pricing tables; derived
> thresholds only (#200)."*
>
> *"**M-DF.2 — THE CAP RETIRES BY MEASUREMENT, NEVER BY DELETION**: the census (DF-C0) freezes
> the swarm's own face (the pile-up band the cap holds today); the surface slice arms dormant
> beside the cap; the exam proves H-DF.1(b) INSIDE the cap first, then the cap-off arm proves
> the surface alone holds the band. Two compensators may not be retired in one slice."*

**THE SEAT A PRICED RUN WOULD STAND ON** —
[`OFFBALL-MOVEMENT-CONTRACT.md`](OFFBALL-MOVEMENT-CONTRACT.md) §2, quoted verbatim:

> *"**M-OBM.1 — the SEAT, on today's decision surface.** Slice one modulates the EXISTING
> candidate triplet of the off-ball attacker (`SupportBallCarrier` score + target · `MakeRun`
> score for ALREADY-LICENSED bodies · the implicit preference against `MoveToFormationSpot`) —
> no new action type, no new actor, assignment/licensing untouched (M-OBM.4)."*
>
> *"**M-OBM.4 — untouched.** TeamBrain designation (runners/overlapper/arriver/restDefence),
> pass selection, the carrier's own seats …"* — and its STATUS **#390**: the seat is
> BANKED-DORMANT and HELD, with a labelled positive at MARKER-ESCAPE.

### in plain football language

Right now, when one of our players sprints in behind, **it is not because he decided to**. Every
0.4 seconds the coach shouts a list of names — *you run, you arrive late, you go round the
outside* — and the players run because their name was called. This census does not change that.
It **counts** it: how often the coach shouts, how many names he calls, which shirts he calls,
what those runs actually produce, and which of the passer's decisions are listening for the
name-tag rather than watching the run. Nothing is removed. Nothing is armed. It is the
measurement M-DF.2 demands **before** anything is taken away.

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — three, PAIRED on shared seeds

* **E13** — `a4MatchFlags(13)` as construction flags + `armA4World(m, null, 13)`: world 13
  EMPTY-BOOK, ③'s control and LN-T1's ABSENT arm. **THE READ OF RECORD.**
* **D13** — the same + the two doses through the **SHIPPED LOADERS** (`loadL3Dose` /
  `loadPcDose`): the played form on 13, published BESIDE. It differs from E13 **ONLY** in the
  two doses. Both dose files' **BYTES** are hashed against the values pinned since #388
  (`gDoseSource`; a mismatch is `exit 3` before any seed is walked). ⛔ **The dose NEVER rides
  in `info.genome`** (canon: dose placement) — `gWorld`'s `genomeClean` conjunct asserts that
  on every walked match of every arm.
* **E15** — `a4MatchFlags(15)` + `armA4World(m, null, 15)`: the frontier world EMPTY-BOOK
  (world 14 + `gkDiveBody`), published BESIDE. Its gate is `gkArmedVersion(m) === 15`, with
  `lnOwnLanePrice` and `gkDiveBody` TRUE. ⚠ world 15's arming also PINS `lnOwnLaneWeight` on
  both teams' `baseGenome`/`effGenome` (world 14's own exam pin) — **never** on `info.genome`.
* `gWorld` asserts, **per arm, on every walked match and the construction receipt**: the arm's
  own world gate; `edsPerceivedChoice` TRUE; every OBM / CTB / RC / BF seam ABSENT;
  `info.genome` clean of the own-lane / RC / CTB / OBM genes; and `match.pcLatency`'s own
  `holds` map READABLE. Pinned again on a CONSTRUCTED match of each arm at out-of-band scratch
  seed **900,005,870**.
* ⭐⭐ **WHY E15 IS WALKED AT ALL, AND WHAT WOULD JUSTIFY NOT WALKING IT.** #404 item 2(i) asks
  the code facts to state whether the own-lane door or the dive door touches any designation
  path. The instrument answers over the **EXTRACTED** call graph of the five designation roots
  (§P.E), and stores `lnDoorTouchesNoDesignationPath` / `gkDoorTouchesNoDesignationPath`
  **beside the closure they were checked over**. **A FALSE NAMES THE HIT** — every reaching
  span is listed with its own key. Both needles are proven LIVE on the same corpus, so neither
  boolean can pass vacuously.

### §P.B THE CADENCE PREDICATES — the two clocks, on the engine's own arithmetic

**THE COACH TICK.** The engine does, at the HEAD of the step (anchored, `Match.ts`):

> `team.brainTimer -= dt;` … `if (team.brainTimer <= 0) { … updateTeamBrain(team, this);
> team.brainTimer = TEAM_AI_INTERVAL; }`

so a coach tick fired on this step **iff `brainTimerBefore − DT <= 0`** — the engine's own
arithmetic on the PRE-STEP value. The later `Math.min(brainTimer, 0.05)` writes happen after
that loop and cannot move it. `TEAM_AI_INTERVAL` = **0.4** (anchored, `constants.ts`).
**FIXTURES**: a timer at 0 FIRES; a timer below one DT FIRES; a FULL interval does NOT; exactly
one DT does NOT.

**THE PLAYER DECISION TICK.** The engine does `if (p.decisionTimer <= 0 && !pcHeld)` (anchored),
and `decisionTimer` is decremented **inside `physicsStep`**, which runs AFTER the decide loop
(anchored) — so the PRE-STEP value is exactly the one the guard tests. `AI_INTERVAL` = **0.15**.
⚠ **THE PC LATENCY SEAT IS LIVE ON EVERY ARM OF THIS CENSUS** (world 13 carries the recognition
layer), so `!pcHeld` is **NOT** a constant. The instrument reads the seat's OWN `holds` map
directly — `h !== undefined && simTick < h.untilTick`, which is `holdFor`'s own semantics —
and **never calls `holdFor`**, because that method DELETES expired entries and would therefore
not be byte-inert. **FIXTURES**: zero FIRES; negative FIRES; a full interval does NOT; a HELD
body does NOT; the hold predicate fires strictly before `untilTick`, and not at or after it, and
not with no entry.

### §P.C POPULATION A — EVERY TEAM-BRAIN TICK IN POSSESSION

**THE POPULATION**: every `assignRunners` execution per team while `possessionSide === team.side`
— i.e. every coach tick that runs past the function's own possession early return (anchored:
`if (match.possessionSide !== team.side) return;`). Both teams, every walked match, every arm.

**THE WRITING BRANCH**, read off the engine's own state as the branch reads it, in **THE
SOURCE'S OWN ORDER** (frozen):

| branch | the engine state it is read from |
|---|---|
| `cornerCrashHeld` | `!liveCorner && team.cornerCrash !== null && simTime < team.cornerCrash.until` — the personnel locked at the hand-off are re-asserted and the function RETURNS |
| `liveCorner` | `match.phase === 'restart' && match.restart.kind === 'corner' && match.restart.side === team.side` — the crashers are re-scored and the function RETURNS |
| `crossFlight` | `team.crossFlight !== null && simTime < until && ball.owner === null` — the open-play cross's licence is re-asserted from the kick's snapshot |
| `openPlay` | none of the three — the scoring path: the runner count, the arriver trigger and the 套边 gate |

**PRECEDENCE**: `cornerCrashHeld` (itself `!liveCorner`) > `liveCorner` > `crossFlight` >
`openPlay`. **FIXTURES**: `openPlay` is the default; a held crash BEATS a cross flight; **a live
corner SUPPRESSES the held crash** (the source's own `!liveCorner` conjunct); a live corner
beats a cross flight; a cross flight fires alone.

⚠ **A DECLARED RECONSTRUCTION.** The branch state is read PRE-STEP (the coach runs at the head
of the step, before any body integrates) with the clock taken as `simTime + DT` (the engine
advances `simTime` immediately before the coach loop). The ONE shape it cannot see exactly is a
tick on which `match.phase` changes inside the step before the coach runs; that population's
**SIZE IS PUBLISHED** as `coach.phaseAmbiguousShare` rather than assumed away.

**THE DESIGNATIONS AS WRITTEN**, read at the END of the writing tick: the runner-count bin
(0 · 1 · 2 · 3 · 4+), whether an arriver is set, whether an overlapper is set — each **BY
BRANCH**; the designated runners **BY ROLE** (DF / MF / WG / ST shares — the role-weight bias
made visible), and the same for the arriver and the overlapper. ⚠ The read is at the END of the
tick, **not** at the instant `assignRunners` returns: EVERY write site of all six fields is
enumerated in `codeFacts.fieldSites` so the reader can see who else could have moved them.

**THE RUNNER-COUNT INPUTS**, read AFTER the step because the engine recomputes
`team.mentality` and `team.effGenome` in the same block immediately BEFORE `updateTeamBrain`:
the share of in-possession coach ticks with `mode === 'CounterAttack'`, with
`team.genome.tempo > 0.65`, and with `team.mentality.urgency > 0.65` — all three gates
EXTRACTED from their own anchored lines:

> `(team.mode === 'CounterAttack' || team.genome.tempo > 0.65 ? 2 : 1) +`
> `(team.mentality.urgency > 0.65 ? 1 : 0);`

A **RECEIPT** (never a football face) is published beside them: `input.countReconAgreeShare`,
the share of open-play in-possession coach ticks on which the reconstructed count — capped by
the eligible bodies — equals the runner-set size actually standing. **FIXTURES**: the base is
1; CounterAttack makes 2; high tempo makes 2; **exactly at either gate does NOT**; urgency adds
1; all three make 3.

**THE 套边 GATE**: `team.genome.attackingWidth * team.policy.overlapW > 0.3` (anchored), its
pass rate over in-possession coach ticks; and the `confronted` share **among the ticks that
reach the test at all** — open play · no standing licence · a WIDE own carrier
(`|y| > 10`, `localX > 0`) · the gene gate passed — with `confronted` itself reconstructed on
the PRE-STEP bodies the coach read (`dist(o.pos, carrier.pos) < 5.5` and goal-side-ish,
anchored). Both denominators are stored. **FIXTURES**: the gate passes; **exactly at the gate
does NOT**; a narrow side does NOT.

### §P.D POPULATION B — EVERY ATTACKING OFF-BALL DECISION TICK

**THE POPULATION**: own side in possession (pre-step `possessionSide`) · the body is not the
carrier (pre-step `ball.owner`) · not the keeper · not sent off · **a decision was taken this
tick** (§P.B). The attacking KEEPER's decision ticks are counted **SEPARATELY**, so the
keeper-up class has a denominator it can be non-vacuous in.

⚠ The engine's dispatch has **three early returns above `decideOffBall`** — the restart taker,
a dead-ball phase, and chasing his own touch. They are RECONSTRUCTED and published as
`offBall.branchReachedShare`; **none of them can produce a `MakeRun`**. The size of the
pre-step possession read's own ambiguity is published as `offBall.possessionFlipShare`.

**THE CHOSEN ACTION** is counted by type over `ActionType`'s **OWN union**, read off
`src/sim/types.ts` and never re-typed.

**⭐⭐ THE HAT CLASS OF A `MakeRun` IS READ OFF THE ENGINE'S OWN DECISION RECORD** — the
WINNER'S `why` in `p.action.scores[0]`. `decideOffBall` sorts its candidates
(`cands.sort((a, b) => b.score - a.score);`, anchored) and stores the top four
(`scores: cands.slice(0, 4)`, anchored), so `scores[0]` **IS** the winner and its `action`
equals `p.action.type`. **The six literals are EXTRACTED from their own anchored source lines,
never typed:**

| class | the `why` literal, extracted from |
|---|---|
| `licensedRunInBehind` | `PlayerBrain.ts` — the licensed-run push's ternary tail |
| `arrivingLate` | the same ternary's first arm |
| `attackingTheBox` | the same ternary's middle arm |
| `oneTwoBurst` | the wall-pass burst push |
| `overlapping` | the overlap push |
| `keeperUp` | `decideGoalkeeper`'s own `MakeRun` — the ONE `MakeRun` written OUTSIDE `decideOffBall` |
| `noWhyRecorded` | the record carries no candidate at all — **COUNTED** |
| `OTHER` | **ANY OTHER `MakeRun` — COUNTED, NEVER DROPPED** |

**FIXTURES**: every named class fires on its own extracted literal; **`OTHER` FIRES** on a
hand-written run (`'a run I chose for myself'`); `noWhyRecorded` fires on a null record;
**editing a literal MOVES the class** (`overlapping` → `sprinting` reads `OTHER`); a near-miss
(a trailing space) reads `OTHER`; the six named classes are distinct.

⭐⭐ **THIS IS THE RULING'S PREFERRED CLASSIFIER, AND IT IS AVAILABLE.** #404 item 2(iii)
permits a fallback classifier on the hat state at the decision tick "if the winner's why is not
carried". **The winner's why IS carried**, so the fallback is NOT used and is not implemented.

**FACES**: the `MakeRun` share of off-ball decision ticks; the same by hat class; the
`MakeRun`-is-hat share (the six NAMED classes over off-ball decision ticks); the `OTHER` share;
and **the HATTED share of the attacking outfield per tick** — bodies of the possession side
that are not the keeper and not sent off, carrying ANY of the four hats at the end of a stepped
tick, over all such bodies. ⚠ The CARRIER is INCLUDED in that denominator (he is an outfield
body and can carry a standing designation); declared here, once.

### §P.E POPULATION C — THE HATS' YIELD, off the ENGINE'S LEDGERS

**A HAT EPISODE** is one body's designation of one class — `runner` · `arriver` · `overlapper` ·
`wallRun` — from its **SET** tick to its **CLEAR** tick, read off the field's OWN transitions
tick to tick at the end of each stepped tick. `wallRun` counts as held while
`p.wallRun !== null && simTime < p.wallRun.until`. **THE YIELD WINDOW** is the episode PLUS a
frozen **`yieldWindowSeconds` = 6** after the clear; every event join asks
`active || now <= windowEnd`. **FIXTURES** on a hand-built designation series: one set / one
clear = 1 episode; three separated sets = 3; a designation held throughout = **ONE** episode;
never set = 0; the window is open while active, open after the clear, **SHUT beyond it**, and
shut before any set.

**THE JOINS — THE ENGINE'S OWN RECORDS** (canon, VERBATIM: *"an event attribution reads the
engine's own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic
is written only where no record exists, and says so"*):

| what | the engine record |
|---|---|
| a pass AIMED at him | a NEW `match.pendingPass` with `targetGid === his gid` |
| its through/bounce class | `pendingPass.bounce` (set at `registerPass` on the target's own `action.type === 'MakeRun'`, anchored) and `match.lastPassKind.kind === 'through'` on the same tick |
| its COMPLETION | a NEW `match.lastCompletedPass` with `receiverGid === his gid` — the engine's own completion record, written at the reception (anchored) |
| a SHOT by him | a NEW `match.shotLog` row joined to `match.pendingShot.shooterGid` through its own `logIndex` (`shotLog` rows carry no shooter) |
| a GOAL by him | that row's outcome flipping `pending` → `goal` |
| the one-two RETURN | the engine's OWN `stats.oneTwos`, incremented when the return finds the bursting passer inside his licence (anchored) |
| the overlap ARRIVAL | the engine's OWN `stats.overlaps`, incremented when the release lands WIDE (anchored) |
| shots from cutbacks | the engine's OWN `shotLog[].assist === 'cutback'` |

The `shotLog` rows that could NOT be joined to a shooter are **COUNTED** and published as
`context.shotJoinShare` — never imputed.

**THE WALL PASS.** The **ELIGIBLE** population is a REGISTERED GROUND pass by an OUTFIELD passer
(`lastPassKind.kind === 'pass'` on the same tick — the ONE kind `groundPass` writes, and the
only path that can set `wallRun`). **THE FIRE ITSELF IS NEVER RECONSTRUCTED**: it is read off
`passer.wallRun`'s own transition (a licence whose `until` equals `simTime + 2.3` and whose
`partnerGid` is the target). **THE SIX CONJUNCTS**, all anchored:

> `passer.role !== 'GK' && d < 15 && pressure > 0.2 && passer.stamina > 0.3 &&
> team.localX(passer.pos.x) > 0 &&
> ((team.genome.tempo + team.genome.passBias) / 2) * team.policies[passer.index].wallPassW > 0.35`

are reconstructed so that **each conjunct's KILL SHARE** can be counted. ⚠ **A DECLARED
RECONSTRUCTION, in two named places**: `d` uses the passer→**TARGET** distance where the engine
uses the passer→**LED-POINT** distance (no public read can see the lead), and `pressure` calls
the **SHIPPED** `pressureAt(passer.pos, opp.players)` on the post-step positions. The
reconstruction's agreement with the engine's own fire is published as
`wall.reconAgreesShare` — a CALIBRATION RECEIPT, not a football face. ⚠ The conjuncts are **not
disjoint**: the kill shares do not sum to 1. **FIXTURES**: all six true FIRES; **each of the six
is killed by exactly one fixture**, and the kill is proven to be exactly one conjunct; the
vector has six entries.

⚠ **#404 item 2(iv) says "the five conjuncts"; the source line carries SIX** (the keeper
exclusion is the first). All six are anchored and all six are fixture-killed. §DEVIATIONS.

**THE OVERLAP**: sets per match (`team.overlapper` transitions to a NEW body); the
developed-overlap release branch firing — carrier decision ticks at which some mate satisfies
**all THREE** of its conjuncts (`team.overlapper === mate.index && |mate.pos.y| > 9 &&
localX(mate) > localX(p) − 6`, anchored) — **EXACT, because all three are public**; and the
ball actually played to the overlapper, off `stats.overlaps`. ⚠ The release count is published
as **`overlap.releaseFiresPerSet`**, not as a share: one designation can be read on many
carrier ticks, so the ratio may exceed 1 (unit-name truth).

**THE ARRIVER**: sets per match; the cutback candidate **FORMED** — read off the carrier's OWN
decision record (a scored candidate whose `why` opens with the anchored `cutback to ` prefix);
the cutback **TAKEN** (the winner of the record IS the cutback); and cutback-assisted shots off
`shotLog[].assist`.

**DOWNSTREAM**: for each COMPLETED pass, whether shots and goals by the RECEIVING SIDE fall
within 6 s of it, split by whether the receiver carried ANY hat at the arrival tick. ⚠ The
windows OVERLAP, so one shot credits every open window of its own side; **both fractions** are
published (per completed pass AND per match) and **NO VERDICT WORD** is printed on the pair.

### §P.F POPULATION D — THE PASSER'S HAT-READS, and the ⑤ boundary

Evaluated on the CARRIER's own decision ticks, over his mates, on the **PRE-STEP** state his
brain read (the decide loop runs before `physicsStep`). ⚠ Within one tick the bodies decide in
an alternating order, so a mate's `action.type` may already be this tick's; declared, never
glossed.

| read | consumes | observability |
|---|---|---|
| wall-return bonus | **LABEL** — `mate.wallRun.partnerGid` | 3 of 4 conjuncts public ⇒ **AN UPPER BOUND**, named so in its own field |
| third-man bonus | **ACTION TYPE** — `mate.action.type === 'MakeRun'` | 4 of 5 public ⇒ **AN UPPER BOUND**, named so |
| 套边 release | **LABEL** — `team.overlapper` | all 3 public ⇒ **EXACT** |
| arriver cutback | **LABEL** — `team.arriver` | read off the DECISION RECORD ⇒ **EXACT when the candidate is in the stored top four** |

The fourth conjunct of the first two (`gain > 0.2` / `gain > 0.15`) is computed on a candidate's
**own aim**, which no public read can see — hence the upper bounds, and hence their field names.

⭐ **THE ⑤ BOUNDARY (读心标签) IS STATED, NOT FIXED AND NOT JUDGED.** The table above is
published as a CODE FACT with each site's line, its enclosing function and that function's own
text hash. ⚠ #404 item 1 names FOUR reads; this census enumerates **SIX** consumption sites —
the four, PLUS the through-ball's own runner scan and `registerPass`'s bounce classification,
both of which read a mate's ACTION TYPE. §DEVIATIONS.

### §P.G THE CODE FACTS — over the EXTRACTED call graph

canon, VERBATIM: *"a code-fact boolean about what a function reads or does not read is derived
from the function's WHOLE text and from every callee whose return enters the read, each pinned
by an anchored text hash — the call graph it was checked over is stored beside the boolean; a
hash pins a body, it cannot see through a call; a needle list is a confirmation, not a census;
the callee list is EXTRACTED from the hashed text — every identifier called within the span,
resolved to its definition and hashed — never typed, and a declared edge absent from the text,
or a call present in the text and absent from the graph, is RED."*

* **THE CORPUS**: every `.ts` file under `src/sim` and `src/ai`, with every function span
  extracted (a `function` declaration, a single-line method, an arrow, or a multi-line
  signature closing on `): T {`), hashed WHOLE.
* **THE SIX FIELDS** — `team.runners` · `team.arriver` · `team.overlapper` · `team.cornerCrash`
  · `team.crossFlight` · `p.wallRun` — every occurrence site enumerated with file, line, text,
  a **write/read** class and its enclosing span + span HASH. A site is a **WRITE** iff its line
  assigns the field (`=` / `+=` / `-=`) or calls `.runners.add|delete|clear(`. The counts are
  stored and gated; every site must resolve to an enclosing span, and every needle must be LIVE.
* **THE FIVE ROOTS, hashed WHOLE with their EXTRACTED callees**: `assignRunners` ·
  `registerPass` · `decideOffBall` · `decideCarrier` (the passer's read sites' enclosing
  function) · `executeAction` (which is where the `MakeRun` case's own enclosing span must
  resolve — asserted).
* **`makeRunCandidatesAllHatGuarded`** — every `MakeRun` candidate push **in the whole corpus**
  is enumerated with its **EXTRACTED GUARD**: the nearest enclosing `if (` at a strictly smaller
  indentation **that actually opens a block containing the push** (a single-line `if (x) y;`
  above the push is skipped). The boolean is TRUE iff every push inside `decideOffBall` has a
  guard naming one of the six designation fields. The pushes that do NOT are listed separately
  — that is where the keeper-up run lives.
* **`obmSeatReadsNoDesignation`** — the EXTRACTED closure of every span in `offballEyes.ts`
  touches none of the six fields (and the needles are proven live elsewhere, so it is not a
  vacuous pass).
* **`lnDoorTouchesNoDesignationPath` / `gkDoorTouchesNoDesignationPath`** — the `lnOwnLane` /
  `gkDiveBody` needles over the EXTRACTED closure of the five roots. **A FALSE NAMES THE HIT.**
* **THE OBM VOCABULARY** — `OBM_FEATURE_KEYS` and `OBM_OUTPUT_KEYS` enumerated **FROM THE
  SOURCE** (`src/evolution/genome.ts`). **LISTED, NOT JUDGED.**

### §P.H THE ESTIMATOR

Per-seed cells; a **CLUSTER BOOTSTRAP over match seeds**, 2,000 draws, the resample RNG seeded
from the block base (12,553,000); percentile intervals at 2.5 % / 97.5 %; PAIRED Δ for
**D13 − E13** and **E15 − E13**, because the arms share seeds. ZERO stats are consumed.

### §P.I THE READS — FROZEN LITERALS on ONE STORED BOOLEAN

**THE SELECTOR** is `noPlayerOwnedRun` = the `OTHER` class is **0** on the arm **AND** the code
fact `makeRunCandidatesAllHatGuarded` is TRUE.

* `noPlayerOwnedRun` ⇒ *"EVERY OPEN-PLAY RUN IS A HAT — there is no player-owned run candidate;
  ③ takes the DF path: DS-T0 builds the PRICED run decision on the off-ball eyes before any hat
  is removed."*
* ¬`noPlayerOwnedRun` ⇒ *"A PLAYER-OWNED RUN EXISTS — its share is named; DS-T0 prices the hat
  against it."*

**E13 IS THE READ OF RECORD.** D13's and E15's selectors are computed by the SAME frozen rule
and stored beside as AGREE booleans. ⛔ The `OTHER` share and the code fact are printed on their
**OWN annotation lines**, never spliced into a frozen literal. **BESIDE every read**, printed
from stored fields: the hat-share sentence (the `MakeRun` share of off-ball decision ticks; the
hatted share of the attacking outfield), the yield pair (shots per completed pass to a hatted vs
an unhatted receiver, **both fractions, no verdict word**), the wall-pass fire rate and its
return share, and the overlap release count per set.

### §P.J SEEDS AND SIZING

Block **12,553,000–999** (#404 item 5's frontier: next sim ≥ 12,553,000). **N_FROZEN = 999**
battery seeds (12,553,000–12,553,998) × **3 ARMS**, plus the construction receipt at
**12,553,999** ⇒ **BOOKED = WALKED = 3,000 walks**; the block is consumed WHOLE and the unwalked
tail is `null`. Every consumed block of record (LN-C0 12,544,000–999 · LN-T1 …545 · LN-C1 …546 ·
LN-C2 …547 · LN-C3 …548 · LN-T1′ …549 · LN-T1′b 12,550,000–999 · GK-C0 12,551,000–999 · GK-T1
12,552,000–999) is checked to end BELOW this block's base. **ZERO stats consumed**; registry
**82**.

**SCRATCH (all ≥ 900,000,000, all STORED in the `seeds` block)**: the sizing smoke on
**900,005,800–811** with its receipt at **900,005,820**; the world pin at **900,005,870**;
gLockstep and X-DET on **900,005,890–891**; the fixture attribute draw at **900,005,899**; band
**900,005,800–899**.

**THE SIZING FORM** (the house form): `se(n) = hw(n)/z.975` · `se(needed) = |target|/(z.975 +
z.80)` · `N = ceil(n · (se(n)/se(needed))²)` · `MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`, at
a **declared 0.05 half-width** on the `MakeRun`-is-hat share (per off-ball decision tick) and on
the hatted-receiver shots-per-completed-pass share. **N = min(nRequired, the block's affordance)
is taken as the AFFORDANCE**; each sizing row stores its own `resolvableAtNFrozen`.

## §DEV-PREFLIGHT — the sizing smoke, disclosed in full

The variance estimate is **THIS instrument's own 12-cluster SCRATCH SMOKE**, three walks per
seed, on the out-of-band band the `seeds` block stores. It is reproduced by:

```
DSC0_MODE=smoke DSC0_N=12 DSC0_OUT=/tmp/dsc0-preflight.json \
  npx tsx scripts/probes/ds-c0-designation-census.ts
```

which walks 900,005,800–811 × 3 arms + the scratch receipt at 900,005,820, and writes an
artifact **OFF every canonical path** (the run envelope refuses an override run that would touch
the canonical artifact). The smoke ran **ALL 20 GATES GREEN**, `hashReproducesFromFile` = true.

**THE TWO SIZED FACES, as the smoke measured them** (E13, the read-of-record arm):

| face | value | half-width | numerator / denominator |
|---|---|---|---|
| `offBall.makeRunIsHatShare` | 0.169700 | **0.014411** | 11,498 / 67,755 |
| `downstream.shotsPerCompletedPassHatted` | 0.455026 | **0.080028** | 86 / 189 |

**THE SIZING ROWS THE FROZEN INSTRUMENT CARRIES** (`hwSmoke` transcribed from the table above;
every other column is DERIVED in code and re-derived off the serialized artifact by `gFaces`):

| face | hwSmoke | seSmoke | seNeeded | nRequired | hw @ N=999 | MDE @ N=999 | resolvable |
|---|---|---|---|---|---|---|---|
| `offBall.makeRunIsHatShare` | 0.014411 | 0.007353 | 0.017847 | **3** | 0.001579 | 0.002258 | yes |
| `downstream.shotsPerCompletedPassHatted` | 0.080028 | 0.040831 | 0.017847 | **63** | 0.008771 | 0.012537 | yes |

⇒ **N = min(nRequired, the affordance) = the AFFORDANCE, 999.** Both sized rows are resolvable
at N_FROZEN with a large margin; the block is walked whole because the RARE populations
(overlap sets, cutbacks taken, the keeper-up run) are sized by **nothing** and only volume can
make them non-vacuous — the LN-C0 precedent. §DEVIATIONS records this.

**WHAT THE SMOKE ALSO CAUGHT, and what was fixed BEFORE the freeze** (the preflight's own
lesson, of record):

1. **The decision predicate assumed `match.pcLatency === null`.** It is NOT null on world 13 —
   the PC recognition layer is part of the stack — so the whole of POPULATION B and POPULATION D
   read **ZERO** on the first smoke. The fix reads the seat's own `holds` map (never `holdFor`,
   which mutates). ⭐ **THE LESSON**: *a predicate that is "a constant true" must be asserted
   on the arm it will run on, not on the world it was written for.*
2. **The guard extractor accepted a single-line `if (tired) s *= …` as a candidate's guard**,
   which made `makeRunCandidatesAllHatGuarded` read FALSE for a push that IS hat-guarded. The
   fix requires the `if` to open a block that still contains the push.
3. **`offBall.makeRunIsHatShare` pooled the keeper's `MakeRun` into an off-ball denominator.**
   The histograms are now split (off-ball vs keeper) and the union is used only where the union
   is meant.

⭐ These three are exactly why the smoke is run **before** the freeze and disclosed **in full**.
