# DS-C0 — 「点名普查」 THE DESIGNATION CENSUS（前插到底是谁的选择：球员的，还是教练每 0.4 秒点的名）

> **STATUS: BANKED — the battery is walked, ALL 20 GATES GREEN, and the READ OF RECORD is
> printed at §R6.** §0 through §DEV-PREFLIGHT were sealed at the freeze commit **`4ba6b92`** and
> were NOT edited after sight; the instrument is byte-identical between the freeze and the
> results commit (`git diff 4ba6b92..<results> -- scripts/probes/ds-c0-*.ts` EMPTY).
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
> Instrument: `scripts/probes/ds-c0-designation-census.ts` — frozen at **`4ba6b92`** and
> byte-identical at the results commit.
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

## §R RESULTS (every number below QUOTES the artifact's own fields at 6 dp — the artifact is the numbers of record, per the #357 standing order)

**RUN RECEIPTS.** Freeze **`4ba6b92`**. `git diff 4ba6b92..<results> -- scripts/probes/ds-c0-*.ts`
is **EMPTY (0 bytes)** — no frozen constant, no frozen definition and no frozen printed form
moved after sight; §P and §DEV-PREFLIGHT were not edited. **`allGreen` = true** (a STORED
boolean; **20** gate objects, every one `ok: true`); `gFaces` **870/870** face-and-Δ checks and
**78/78** stored-bin / median / partition / READ-WORD / sizing checks re-derived from the
SERIALIZED artifact off disk. Artifact `docs/world-model/data/ds-c0-designation-census.json`
(**7,337,838 bytes**),
`instrumentSha256 = 6321e5025b204d2809824ed8fe0e67706ae6c25fa201b20cb93a3029e1e64669`,
`hashedBodySha256 = cd778f9226f29421eb2550932d4559d712b2b2e1046d5b952bb66f32ff36bf35`,
**file byte-hash `f719f323b1bf668674216ae7cc6040b47303383c65386e222e1957487e82e2a7`**, and the
NON-body `receipts.hashReproducesFromFile` = **true**. Battery **999 seeds
(12,553,000–12,553,998) × 3 ARMS + the construction receipt at 12,553,999 ⇒ BOOKED = WALKED =
3,000 walks**; `seeds.unwalkedTail` = **null** — **the block is consumed WHOLE**. Scratch: the
sizing smoke on 900,005,800–811 (receipt 900,005,820), the world pin at 900,005,870, gLockstep
and X-DET on 900,005,890–891, the fixture attribute draw at 900,005,899 — every one STORED in
the `seeds` block. **ZERO stats consumed** — registry **82**. `npm run typecheck` clean with the
probe in the tree; **X-FP-PROD recomputed IN-PROCESS** =
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — the literal of record,
**UNCHANGED**. Wall **363.575 s** (`perf.meanWallSecondsPerMatch` **0.113836**).

### §R1 THE HATS AS WRITTEN — POPULATION A (every team-brain tick in possession)

**THE COACH SPEAKS 1,352.582583 TIMES A MATCH** (E13; D13 1,359.289289 · E15 1,361.297297), and
**0.487776** of those ticks are in possession (E13) ⇒ **659.757758 in-possession coach ticks per
match**. On each of them he names **1.509372 runners** (E13; D13 1.500023 · E15 1.505894) ⇒
**995.819820 runner designations per match**.

| runner count | E13 | D13 | E15 |
|---|---|---|---|
| 0 | 0.093400 | 0.093875 | 0.095171 |
| 1 | 0.372098 | 0.368636 | 0.372004 |
| 2 | 0.466231 | 0.481081 | 0.464587 |
| 3 | 0.068271 | 0.056408 | 0.068239 |
| 4+ | 0.000000 | 0.000000 | 0.000000 |

**BY WRITING BRANCH** (share of in-possession coach ticks), with the arriver and overlapper set
shares INSIDE each branch:

| branch | share (E13/D13/E15) | arriver set (E13) | overlapper set (E13) |
|---|---|---|---|
| `openPlay` | 0.930396 / 0.941532 / 0.929164 | 0.078662 | 0.007978 |
| `cornerCrashHeld` | 0.036007 / 0.029751 / 0.036728 | 0.218945 | 0.000000 |
| `liveCorner` | 0.033597 / 0.028717 / 0.034108 | 0.175488 | 0.000000 |
| `crossFlight` | 0.000000 / 0.000000 / 0.000000 | null (0/0) | null (0/0) |

⭐ **`crossFlight` IS EMPTY ON EVERY ARM — A STORED ZERO, NOT AN OVERSIGHT.** Its only writer is
gated on `match.c4Arrival` (anchored, `mechanics.ts`), which no arm of this census arms, so
`team.crossFlight` is never written and the branch's two conditional shares are stored `null`
(0/0). §HONEST LIMITS 2.

**THE RUNNER-COUNT INPUTS** (share of in-possession coach ticks): `CounterAttack` **0.312004** ·
`tempo > 0.65` **0.284551** · `urgency > 0.65` **0.021127** (E13). The reconstruction receipt
`input.countReconAgreeShare` = **0.899159** (E13) — it is a RECEIPT, not a football face
(§HONEST LIMITS 5).

**THE ROLE-WEIGHT BIAS, MADE VISIBLE** (share of all designations of that kind, E13):

| | DF | MF | WG | ST |
|---|---|---|---|---|
| **runners** | 0.017666 | 0.045806 | 0.381453 | 0.555074 |
| **arriver** | 0.001134 | 0.841065 | 0.155917 | 0.001884 |
| **overlapper** | 0.450531 | 0.372854 | 0.175593 | 0.001022 |

The runner weights are `GK 0 · DF 0.4 · MF 1.2 · WG 1.8 · ST 2.2` (EXTRACTED), and the shares
follow them: the **ST** takes **0.555074** of every run licence and the **WG** **0.381453**,
while the **DF** takes **0.017666**. The arriver is the MF by construction
(`team.players[2]`, with the weak-side WG standing in) and the data says so: **0.841065** MF.
The overlapper — the one designation scored on *trailing position*, not role weight — is the
only one the **DF** leads (**0.450531**).

**THE 套边 GATE**: the gene gate `attackingWidth · overlapW > 0.3` passes on **0.790943** of
in-possession coach ticks (E13) — but only **0.024107** of them reach the `confronted` test at
all (open play · no standing licence · a WIDE own carrier in the attacking half · the gate
passed), and among those, **0.237460** are confronted (E13, n = 15,889; D13 0.304859, n = 14,797;
E15 0.249492, n = 16,241).

### §R2 THE OFF-BALL DECISIONS BY HAT CLASS — POPULATION B

**5,830.297297 attacking off-ball decision ticks per match** (E13), of which **0.876561** reach
`decideOffBall` at all. The chosen action:

| action | E13 | D13 | E15 |
|---|---|---|---|
| `MoveToFormationSpot` | 0.582473 | 0.548958 | 0.580835 |
| **`MakeRun`** | **0.165296** | **0.178067** | **0.166286** |
| `SupportBallCarrier` | 0.112200 | 0.139088 | 0.113247 |
| `ChaseBall` | 0.066788 | 0.055721 | 0.069016 |
| `ReceivePass` | 0.064006 | 0.072065 | 0.062461 |
| `MarkOpponent` | 0.006755 | 0.003787 | 0.005937 |
| `Dribble` | 0.001430 | 0.001270 | 0.001444 |
| `InterceptPass` | 0.000891 | 0.000874 | 0.000643 |
| every remaining `ActionType` | stored in `offBall.actionShare.*`, each with a zero or near-zero numerator | | |

**THE HAT CLASS OF EVERY ATTACKING `MakeRun`** (off-ball bodies AND the keeper; the class is the
WINNER'S OWN `why`), share of all attacking `MakeRun` decisions and the raw count:

| class | share E13 | share D13 | share E15 | count E13 / D13 / E15 |
|---|---|---|---|---|
| `licensedRunInBehind` | 0.471779 | 0.551305 | 0.472054 | 455,003 / 623,996 / 458,555 |
| `attackingTheBox` | 0.479782 | 0.395864 | 0.479581 | 462,721 / 448,060 / 465,866 |
| `arrivingLate` | 0.038211 | 0.037064 | 0.038678 | 36,852 / 41,951 / 37,572 |
| `overlapping` | 0.005431 | 0.006523 | 0.005428 | 5,238 / 7,383 / 5,273 |
| `oneTwoBurst` | 0.003058 | 0.007883 | 0.002895 | 2,949 / 8,922 / 2,812 |
| `keeperUp` | 0.001740 | 0.001361 | 0.001364 | 1,678 / 1,540 / 1,325 |
| `noWhyRecorded` | 0.000000 | 0.000000 | 0.000000 | **0 / 0 / 0** |
| **`OTHER`** | **0.000000** | **0.000000** | **0.000000** | **0 / 0 / 0** |

**OTHER IS ZERO ON ALL THREE ARMS** — over **964,441** attacking `MakeRun` decisions on E13
alone (D13 1,131,852 · E15 971,403). `offBall.makeRunOtherShare` = **0.000000** with a bootstrap
half-width of 0.000000, and the LOO block stores `otherCountMin` = 0 and `otherCountMax` = 0 on
every arm — **dropping any single match seed does not produce one**.

**THE HATTED SHARE OF THE ATTACKING OUTFIELD**: **0.352495** (E13; D13 0.354127 · E15 0.352997)
over **73,867.300300 attacking outfield body-ticks per match**. **`offBall.makeRunIsHatShare`
equals `offBall.makeRunShare` exactly on every arm** — 0.165296 / 0.178067 / 0.166286 — because
`OTHER` and `noWhyRecorded` are both zero.

### §R3 THE HATS' YIELD — POPULATION C (off the engine's ledgers)

**THE EPISODES** (E13; the bin-derived median episode length is at a 6-tick bin width):

| class | sets/match | mean ticks | median ticks | aimed/ep | completed/ep | completion | bounce | through | shots/ep |
|---|---|---|---|---|---|---|---|---|---|
| `runner` | 141.890891 | 177.947880 | 120 | 0.309018 | 0.156763 | 0.507294 | 0.170194 | 0.104901 | 0.062935 |
| `arriver` | 16.346346 | 84.884507 | 66 | 0.403368 | 0.183282 | 0.454380 | 0.015485 | 0.100653 | 0.052480 |
| `overlapper` | 3.032032 | 39.760647 | 24 | 0.247937 | 0.135358 | 0.545939 | 0.003995 | 0.039947 | 0.015517 |
| `wallRun` | 10.398398 | 141.146130 | 120 | 0.279072 | 0.122160 | 0.437737 | 0.058986 | 0.075198 | 0.041683 |

⛔ **`ep.goalsPerEpisode.<class>` IS 0.000000 ON EVERY CLASS AND EVERY ARM AND IS VOID** — a
defect of THIS instrument, not a fact about football. §HONEST LIMITS 1 pins the mechanism. No
read and no beside-sentence stands on it.

**THE WALL PASS.** **57.024024 eligible ground passes per match** (E13); the trigger fires on
**0.183510** of them ⇒ **10.464464 licences per match**. The reconstruction agrees with the
engine's own fire on **0.962785** of eligible passes (its own predicted rate is 0.173539). Each
conjunct's kill share over eligible passes (⚠ **not disjoint — they do not sum to 1**):

| conjunct | E13 | D13 | E15 |
|---|---|---|---|
| `attackingHalf` (`localX > 0`) | 0.640301 | 0.619169 | 0.649267 |
| `shortDistanceProxy` (`d < 15`) | 0.413871 | 0.381928 | 0.393510 |
| `underPressure` (`> 0.2`) | 0.161515 | 0.125888 | 0.171035 |
| `geneGate` (`> 0.35`) | 0.127969 | 0.127989 | 0.124641 |
| `notGK` | 0.000000 | 0.000000 | 0.000000 |
| `freshLegs` (`stamina > 0.3`) | 0.000000 | 0.000000 | 0.000000 |

**THE RETURN**, off the engine's OWN `stats.oneTwos`: **0.026880** of the licences are cashed
(E13; D13 0.039109 · E15 0.028911) ⇒ **0.281281 one-twos per match**. The passer's `wallReturn`
bonus branch fires on at most **10.437437 carrier decision ticks per match** (an UPPER BOUND —
§R4).

**THE OVERLAP.** **3.032032 sets per match** (E13). The developed-overlap release branch is
readable on **0.233741 carrier decision ticks per set**; the ball actually reaches the
overlapper — the engine's own `stats.overlaps`, the release ARRIVING wide — on **0.013536 per
set** (D13 0.013976 · E15 0.013049). **41 arrivals in 999 matches** on E13.

**THE ARRIVER.** **16.346346 sets per match**; the cutback candidate FORMS **14.197197 times a
match** (0.868524 per set) and is TAKEN on **0.351759** of the times it forms ⇒ **4.993994
cutbacks per match**; the engine's own `shotLog[].assist === 'cutback'` counts **0.757758
cutback-assisted shots per match**.

**DOWNSTREAM — THE PAIR, PRINTED BESIDE EACH OTHER, NO VERDICT WORD:**

| | to a HATTED receiver | to an UNHATTED receiver |
|---|---|---|
| completed passes per match (E13) | 14.135135 | 32.638639 |
| shots within 6 s, per completed pass (E13) | **0.438567** [0.426735, 0.450445] | **0.213764** [0.207323, 0.220533] |
| shots within 6 s, per match (E13) | 6.199199 | 6.976977 |
| goals within 6 s, per completed pass (E13) | **0.131365** [0.124946, 0.138204] | **0.048212** [0.045255, 0.051163] |
| goals within 6 s, per match (E13) | 1.856857 | 1.573574 |
| shots per completed pass (D13) | 0.394573 | 0.186567 |
| shots per completed pass (E15) | 0.455835 | 0.220222 |

⚠ The windows OVERLAP and the two groups differ in far more than the hat (a hatted receiver is
by construction a body the coach sent forward). **This is a census. No verdict word is written
on this pair, and none should be read into it.**

### §R4 THE PASSER'S HAT-READS — POPULATION D, and the ⑤ boundary

**345.449449 carrier decision ticks per match** (E13). Per match, and as a share of those ticks:

| read | consumes | per match (E13/D13/E15) | share of carrier ticks (E13) |
|---|---|---|---|
| wall-return bonus | **LABEL** `wallRun.partnerGid` | 10.437437 / 14.847848 / 10.638639 ⚠ UB | 0.030214 ⚠ UB |
| third-man bonus | **ACTION TYPE** `mate.action.type` | 47.354354 / 63.751752 / 47.463463 ⚠ UB | 0.137080 ⚠ UB |
| 套边 release | **LABEL** `team.overlapper` | 0.708709 / 1.021021 / 0.660661 (EXACT) | 0.002052 |
| arriver cutback FORMED | **LABEL** `team.arriver` | 14.197197 / 15.238238 / 14.530531 (record) | — |
| arriver cutback TAKEN | **LABEL** `team.arriver` | 4.993994 / 5.760761 / 5.259259 (record) | — |

⚠ **UB = AN UPPER BOUND**, named so in the artifact's own field names, because the branch's last
conjunct is computed on a candidate's own aim.

**THE ⑤ BOUNDARY (读心标签), STATED — SIX CONSUMPTION SITES, NOT FOUR.** Every row below carries
its own line, its enclosing function and that function's whole-text hash in
`passerReadTable.rows`:

| site | file:line | enclosing fn | consumes |
|---|---|---|---|
| `wallReturn` | `PlayerBrain.ts:667` | `decideCarrier` | **LABEL** — `mate.wallRun.partnerGid` |
| `thirdMan` | `PlayerBrain.ts:679` | `decideCarrier` | **ACTION TYPE** — `mate.action.type === 'MakeRun'` |
| `overlapRelease` | `PlayerBrain.ts:689` | `decideCarrier` | **LABEL** — `team.overlapper` |
| `arriverCutback` | `PlayerBrain.ts:1068` | `decideCarrier` | **LABEL** — `team.arriver` |
| `throughBallRunnerScan` | `PlayerBrain.ts:942` | `decideCarrier` | **ACTION TYPE** — `mate.action.type !== 'MakeRun'` |
| `registerPassBounce` | `mechanics.ts:245` | `registerPass` | **ACTION TYPE** — `target.action.type === 'MakeRun'` |

⇒ **three LABEL reads and three ACTION-TYPE reads.** #404 item 1 names four; the through-ball's
own runner scan and `registerPass`'s bounce classification are the two this census adds.
**STATED AS A BOUNDARY. NOT FIXED. NOT JUDGED.**

### §R5 THE CODE FACTS — over the EXTRACTED call graph, and the OBM vocabulary

**THE CORPUS**: 71 files under `src/sim` + `src/ai`, **579** extracted function spans. **72**
occurrence sites of the six designation fields, EVERY one resolved to an enclosing span and
hashed:

| field | writes | reads | total |
|---|---|---|---|
| `team.runners` | 7 | 13 | 20 |
| `team.arriver` | 6 | 10 | 16 |
| `team.cornerCrash` | 4 | 7 | 11 |
| `team.overlapper` | 2 | 7 | 9 |
| `team.crossFlight` | 4 | 4 | 8 |
| `p.wallRun` | 3 | 5 | 8 |

**THE FIVE ROOTS**, hashed WHOLE — `assignRunners` (`TeamBrain.ts:168-331`) · `registerPass`
(`mechanics.ts:234-256`) · `decideOffBall` (`PlayerBrain.ts:1924-2219`) · `decideCarrier`
(`PlayerBrain.ts:165-1813`) · `executeAction` (`actionExecutor.ts:123-1459`, which is where the
`MakeRun` case's own enclosing span resolves — asserted). Their EXTRACTED closure holds **238
spans at depth 6**, uncapped.

**THE STORED BOOLEANS:**

* **`makeRunCandidatesAllHatGuarded` = TRUE.** All **5** `MakeRun` candidate-push sites in the
  corpus are enumerated with their EXTRACTED guards. The **3** inside `decideOffBall`
  (`PlayerBrain.ts:2087` · `:2102` · `:2109`) are guarded by
  `team.runners.has(p.index) || arriving`, by `p.wallRun && …`, and by
  `team.overlapper === p.index && …` respectively. The **2** outside it (`:1840` and `:1841` —
  the two lines of ONE candidate literal, flagged `sameCandidateLiteralAsPrevious`) sit in
  `decideGoalkeeper` under `if (team.keeperUp) {` — **the one non-hat `MakeRun` of #404 item 1,
  confirmed by measurement rather than assumed.**
* **`obmSeatReadsNoDesignation` = TRUE.** The EXTRACTED closure of every span in
  `offballEyes.ts` (**14 spans at depth 5**, uncapped) touches **none** of the six fields, and
  the needles are proven live elsewhere on the same corpus, so the pass is not vacuous.
* ⛔ **`lnDoorTouchesNoDesignationPath` = FALSE.** The hit is NAMED:
  `src/ai/PlayerBrain.ts:165-1813:decideCarrier` — world 14's own-lane price lives inside the
  passer's pricing, which is one of the designation roots.
* ⛔ **`gkDoorTouchesNoDesignationPath` = FALSE.** The hit is NAMED:
  `src/ai/actionExecutor.ts:123-1459:executeAction` — the dive door's needle is reachable from
  the executor, which is also a designation root.
  ⇒ **E15 is NOT a "same designation path" arm**, and that is exactly the statement #404 item
  2(i) asked for. Both needles are LIVE on the corpus (1 and 4 spans), so neither FALSE is an
  artefact of an absent needle.

**THE OBM SEAT'S VOCABULARY — the words DS-T0 would price a run over, enumerated FROM THE
SOURCE (`src/evolution/genome.ts`), LISTED, NOT JUDGED:**

* `OBM_FEATURE_KEYS` = **`carrierPlight` · `ownMarker` · `targetCongestion` · `readingAge`**
* `OBM_OUTPUT_KEYS` = **`planeDepth` · `planeWidth` · `supportScore` · `runScore`**
* 4 × 4 = **16 weight slots**. The seat is DORMANT on every arm of this census (`obmMovement`
  absent — `gWorld`), so nothing in `offballEyes.ts` was reached in any walked match.

### §R6 THE READS, PRINTED (frozen literals on a STORED selector; E13 of record)

**THE SELECTOR, E13**: `noPlayerOwnedRun` = **true** — `otherCount` **0** of **964,441**
attacking `MakeRun` decisions, AND `makeRunCandidatesAllHatGuarded` = **true**.

> **EVERY OPEN-PLAY RUN IS A HAT — there is no player-owned run candidate; ③ takes the DF path:
> DS-T0 builds the PRICED run decision on the off-ball eyes before any hat is removed.**

*annotation — OTHER (a `MakeRun` whose winning why is none of the six named hats), E13: **0** of
**964,441** attacking `MakeRun` decisions; `offBall.makeRunOtherShare` = 0.000000, half-width
0.000000, CI [0.000000, 0.000000]*
*annotation — the code fact beside the count: `makeRunCandidatesAllHatGuarded` = **true**, over
5 enumerated pushes with extracted guards*
*annotation — LOO, per arm: `selectorAlwaysSame` = **true**; `otherCountMin` = 0,
`otherCountMax` = 0 (SCOPED: a stability check on the selector, not a confidence statement about
any face)*

**D13: THIS ARM SELECTS THE SAME READ.** **E15: THIS ARM SELECTS THE SAME READ.**

**BESIDE THE READ, printed from stored fields:**

* **the hat-share sentence** — the `MakeRun` share of attacking off-ball decision ticks is
  **0.165296** (E13; D13 0.178067 · E15 0.166286); the hatted share of the attacking outfield is
  **0.352495** (E13; D13 0.354127 · E15 0.352997).
* **the yield pair, both fractions, no verdict word** — shots within 6 s per completed pass to a
  **HATTED** receiver **0.438567** (6,193 / 14,121) vs to an **UNHATTED** receiver **0.213764**
  (6,970 / 32,606), E13.
* **the wall pass** — fire rate **0.183510** per eligible pass; return share **0.026880** of the
  licences.
* **the overlap** — the release branch is readable on **0.233741** carrier decision ticks per
  set.

### §R7 在说人话的层面

**每一次前插，都是教练点的名。** 999 场、三个世界臂、E13 一臂就有 **964,441** 次进攻方的
`MakeRun` 决策，**`OTHER` 是 0**——引擎自己的决策记录（那句 `why`）每一条都指回一顶帽子：被点
名的前插、冲禁区、包抄到位、二过一冲刺、套边，外加门将上前那一个例外。掉掉任何一个 seed，
`otherCountMin` 和 `otherCountMax` 都还是 0。

**教练每 0.4 秒喊一次名**：一场 **1352.582583** 次，其中 **0.487776** 发生在我们有球的时候
（**659.757758** 次/场）；每一次平均点 **1.509372** 个人跑，一场共 **995.819820** 张前插执照。
谁被点到，主要看号码：**ST 0.555074 · WG 0.381453 · MF 0.045806 · DF 0.017666**。到位的那个人
**0.841065** 是中场——因为代码里写的就是「第 2 号球员」。

**帽子确实有产出，但很薄。** 一顶前插帽的中位寿命是 **120** 个 tick（均值 **177.947880**），
期间瞄准他的传球只有 **0.309018** 次，其中 **0.507294** 到脚下。**二过一**：一场发
**10.464464** 张执照，真把球回敲到冲上去那个人身上的是 **0.026880**（一场 **0.281281** 次）。
**套边**：一场点 **3.032032** 次名，球真正传到套边那个人脚下的是每张执照 **0.013536**——999
场里 **41** 次。**包抄**是唯一算「有活干」的：一场形成 **14.197197** 次回敲候选，真踢出去
**4.993994** 次。

**传球的人在读名牌。** 六个消费点里，**三个读标签**（`wallRun.partnerGid` /
`team.overlapper` / `team.arriver`），**三个读动作类型**（`mate.action.type`）。这一句只是把
⑤ 的边界说清楚，**不做裁决**。

**要换掉帽子，得先有个能定价的替代品。** 那套眼睛已经造好了、还没通电：`OBM_FEATURE_KEYS` =
`carrierPlight · ownMarker · targetCongestion · readingAge`，`OBM_OUTPUT_KEYS` =
`planeDepth · planeWidth · supportScore · runScore`，**16** 个权重槽。DS-T0 要做的，就是让
「跑」变成球员用这十六个数自己算出来的一个选项——**在任何一顶帽子被摘掉之前**。

## §HONEST LIMITS

1. ⛔ **`ep.goalsPerEpisode.<class>` IS VOID — 0.000000 on all four classes and all three arms,
   and it is THIS INSTRUMENT'S DEFECT.** The mechanism is pinned: `Match.goal()` calls
   `markShotOutcome(… 'goal' …)` and then sets `this.pendingShot = null` **inside the same
   tick**, so the instrument's shooter join (`pendingShot.logIndex === j`) is already gone when
   the outcome flip is observed at the end of the tick. `ep.shotsPerEpisode` is unaffected
   (the join is taken on the tick the row is PUSHED, when `pendingShot` is still live), and the
   downstream goal faces are unaffected (they join on the row's own `side`). THE FIX for the
   next instrument: record the shooter gid per `logIndex` at the push and re-use it at the flip
   — which is what the shots path already does. **No read and no beside-sentence stands on the
   void family.**
2. **The `crossFlight` branch is EMPTY on every arm** (`branch.share.crossFlight` = 0.000000,
   and its two conditional shares are stored `null` = 0/0). Its only writer is gated on
   `match.c4Arrival`, which no arm arms. The cross-flight licence is therefore **UNMEASURED
   here**, not measured-as-zero-effect.
3. **The branch classification is a DECLARED RECONSTRUCTION.** It reads the engine's own fields
   PRE-STEP with the clock at `simTime + DT`. It cannot see a tick whose `phase` changes inside
   the step before the coach runs; that population's SIZE is published:
   `coach.phaseAmbiguousShare` = **0.116652** (E13). Every branch face inherits that caveat.
4. **The designations are read at the END of the writing tick**, not at the instant
   `assignRunners` returns. Every other write site of all six fields is enumerated in
   `codeFacts.fieldSites` (72 sites) so the reader can see who else could have moved them.
5. **`input.countReconAgreeShare` = 0.899159 is a RECEIPT, not a football face.** The
   reconstruction models the two-line count expression and caps it by the eligible bodies; it
   does NOT model the arriver/overlap exclusions or any later writer, so ~10 % disagreement is
   expected and is not evidence about the engine.
6. **The wall trigger's per-conjunct kill shares are a DECLARED RECONSTRUCTION in two named
   places** — `d` is the passer→TARGET distance where the engine uses passer→LED-POINT, and
   `pressure` is the shipped `pressureAt` on POST-STEP positions. The calibration is published:
   `wall.reconAgreesShare` = **0.962785** (E13). **The FIRE ITSELF is never reconstructed.**
7. **Two of the four passer reads are UPPER BOUNDS** (`wallReturn`, `thirdMan`) because their
   last conjunct is computed on a candidate's own aim. Their field names say so.
8. **The downstream pair's windows OVERLAP** (one shot credits every open window of its side),
   and the two groups differ in far more than the hat. Both fractions are published; **no
   verdict word is written**, and none should be read in.
9. **The CARRIER is inside the hatted-share denominator** (he is an outfield body and can carry
   a standing designation).
10. **Population B's possession read is PRE-STEP.** The size of that ambiguity is published:
    `offBall.possessionFlipShare` = **0.003093** (E13).
11. **The `keeperUp` class only lives in the keeper's own decision population** (1.679680
    `MakeRun` decisions per match on E13, over 1,385.687688 keeper decision ticks). It is
    therefore absent from the off-ball histogram by construction, not by measurement.
12. **Population D is evaluated on the PRE-STEP state**, and within one tick bodies decide in an
    alternating order, so a mate's `action.type` may already be this tick's.
13. **The two door booleans are FALSE and the hits are named** (§R5). E15 is published BESIDE as
    a frontier world, **not** as a designation-path-identical control.
14. **A machine reading on one machine**: `perf.meanWallSecondsPerMatch` = 0.113836.

## §DEVIATIONS

1. **N = the block's AFFORDANCE (999), not `nRequired`.** The two sized rows need 3 and 63
   clusters; the block is walked WHOLE because the RARE populations this census must not report
   as vacuous — overlap arrivals (41 in 999 matches on E13), cutbacks taken, the keeper-up run —
   are sized by **nothing**, and only volume makes them non-empty. The LN-C0 / GK-C0 precedent.
2. **#404 item 2(iv) says "the five conjuncts"; the wall trigger's source line carries SIX.**
   The keeper exclusion (`passer.role !== 'GK'`) is the first. **All six are anchored, all six
   are fixture-killed**, and all six kill shares are published. Two of them (`notGK`,
   `freshLegs`) kill 0.000000 of the eligible population — stored, not hidden.
3. **#404 item 1 names FOUR passer reads; this census enumerates SIX consumption sites** — the
   four named, plus the through-ball's own runner scan (`PlayerBrain.ts:942`) and
   `registerPass`'s bounce classification (`mechanics.ts:245`), both of which read a mate's
   ACTION TYPE. The ⑤ boundary is stated on all six.
4. **The fallback hat classifier of #404 item 2(iii) is NOT implemented.** It is conditioned on
   "if the winner's why is not carried" — the winner's why IS carried (`p.action.scores[0]`,
   anchored), so the ruling's PREFERRED classifier is the one used and the fallback would be
   dead code. `noWhyRecorded` = 0 on every arm confirms the record is always populated for a
   `MakeRun`.
5. **The `MakeRun` push census counts SITES, not candidate literals.** The keeper-up candidate
   spans two lines (`type:` and `action:`), so it appears as two sites; the second carries
   `sameCandidateLiteralAsPrevious` = true. Nothing in the boolean depends on the distinction.
6. **`overlap.releaseFiresPerSet` and `overlap.playedToPerSet` are NOT named "share"**
   (unit-name truth): one designation can be read on many carrier ticks, so the first ratio may
   exceed 1. #404 item 2(iv) calls them "share of sets"; the field names carry the honest unit.
7. **`gPredicateFixtures` replaces the ruling's `gClassesNonVacuous`-adjacent naming for the
   fixture gate**, and `gTwoFractions` is added: every read-bearing quantity is published both
   per its own denominator and per match, and the pairs are stored in `twoFractionPairs`.
8. **The decision-tick predicate reads `pcLatency.holds` directly and never calls `holdFor`.**
   `holdFor` DELETES expired entries; calling it would put a mutation inside the observation
   path. The map read reproduces its semantics exactly and is fixture-pinned on both sides.
   (The first smoke assumed `pcLatency === null` and read ZERO for two whole populations —
   §DEV-PREFLIGHT discloses it.)

## §GATES — 20 of 20 GREEN (`allGreen` = true, a STORED boolean)

| gate | ✅ | what it asserts (the NOTE derives from the same pinned values the gate checks) |
|---|---|---|
| `gWorld` | ✅ | per arm, on every walked match AND the construction receipt: the arm's own world gate; `edsPerceivedChoice`; every OBM/CTB/RC/BF seam absent; `info.genome` clean; `pcLatency.holds` readable; plus the constructed world pin at 900,005,870 |
| `gDoseSource` | ✅ | the two dose files' BYTES hashed against their pins before any seed is walked; the D13 arm rides the SHIPPED loaders, never `info.genome` |
| `gAnchoredConstants` | ✅ | **96** anchored sites, every one at its declared occurrence count; every numeric constant and all six `why` literals PARSED out of their own anchored lines |
| `gPredicateFixtures` | ✅ | **62** fixtures — every predicate with a case where it FIRES and one where it does NOT, including all six wall conjuncts killed one at a time |
| `gLedgerRead` | ✅ | the joins read the engine's own records; the two declared reconstructions say so and carry a calibration receipt |
| `gClassesNonVacuous` | ✅ | `emptyEpisodeClasses` = **[]**, `emptyHatClasses` = **[]** — every class the read stands on is live, and the emptiness tables are STORED |
| `gCodeFactGraph` | ✅ | 71 files, 579 spans, 72 field sites all resolved, five roots complete, both closures uncapped, both door needles LIVE |
| `gLockstep` | ✅ | observed ≡ unobserved whole-match signature on all **6** arm × scratch walks — the observation is BYTE-INERT |
| `gDeterminism` | ✅ | X-DET twice per arm on two scratch seeds: signatures AND this instrument's own row bytes identical, **6** pairs |
| `gFingerprintProd` | ✅ | X-FP-PROD recomputed in-process = the literal of record, UNCHANGED |
| `gSrcUntouched` | ✅ | `git diff --stat HEAD` and `git status --porcelain` EMPTY over **src/ AND tests/** — X-SRC-ZERO |
| `gSeedsBookedEqualWalked` | ✅ | 999 distinct battery seeds + the receipt, all in block 12,553,000–999; **3,000 walks booked**; every scratch seed ≥ 900,000,000 and STORED |
| `gSeedDisjoint` | ✅ | every consumed block of record checked to end BELOW this block's base; ZERO stats consumed |
| `gN` | ✅ | no override env; the battery ran at exactly N_FROZEN = 999 × 3 arms; both sizing rows resolvable |
| `gLoo` | ✅ | the selector survives dropping any single match seed, on every arm (SCOPED) |
| `gTwoFractions` | ✅ | all **9** read-bearing pairs published both ways |
| `gFaces` | ✅ | **870/870** face-and-Δ checks and **78/78** bin / median / partition / READ-WORD / sizing checks re-derived off the SERIALIZED artifact |
| `gReadWords` | ✅ | the selector, the printed sentence, the per-class table, all seven beside quantities and both agreement words re-derived from the serialized cells |
| `gHashOrder` | ✅ | the 33-key ALLOWLIST schema is complete, excludes the hash and the detail blocks, and the body hash is computed LAST |
| `gStage` | ✅ | `stage.instrument` is THIS instrument's path and `stage.instrumentSha256` is the RUNNING file's hash |

**THE ARTIFACT'S FINAL FILE BYTE-HASH AND BYTE COUNT are printed ONCE, in §R RUN RECEIPTS
above** (`f719f323…`, 7,337,838 bytes); `receipts.hashReproducesFromFile` = true.
