# DS T0 — 「自己的前插」 THE OWN-RUN SEAM (`dsOwnRun` + `dsHatsOff`, dormant)

Status: **BUILT AND PINNED, DORMANT.** Both flags default OFF, appear in no world, no preset
and no `a4MatchFlags`, and the OFF world is byte-identical to the dispatch HEAD `ca61a6a` on
recorded digests. Nothing about the game the user plays changes in this commit.

Authority chain: **COMMANDER RULING #405 item 3** (the dispatch — M-DS.1–5 verbatim, the pins,
the file list, the seed band) standing on **item 1–2** (DS-C0 banked as measurement, the read
of record). Contract: [`DS-DESIGNATION-CONTRACT.md`](DS-DESIGNATION-CONTRACT.md) §2. Census of
record: [`DS-C0-DESIGNATION-CENSUS.md`](DS-C0-DESIGNATION-CENSUS.md) with
[`data/ds-c0-designation-census.json`](data/ds-c0-designation-census.json) — every census
number below is QUOTED BY FIELD NAME at 6 dp (canon **doc-prose fidelity**), and the four faces
ruling #405 item 1 DOWNGRADED are quoted as approximations or not at all. Form: this document
follows [`OBM-T0-DORMANT-SEAM.md`](OBM-T0-DORMANT-SEAM.md) (§LAW · §HONESTY · §SEAM with the
READ-FORK INVENTORY · §PINS · §GATES · §SEED LEDGER · §ROAD B · §NON-CLAIMS) and
[`GK-T0-DIVE-LAW.md`](GK-T0-DIVE-LAW.md) (the flag docblock idiom, the seam map, and its
§COMMANDER CORRECTIONS #399/#401 lessons: **a fixture proves a predicate, not a call site**,
and **who enters a branch is a measurement**). The bypass idiom is DF-T4's, whose home law is
[`DF-DEFENSIVE-BRAIN-CONTRACT.md`](DF-DEFENSIVE-BRAIN-CONTRACT.md) §2 M-DF.1/M-DF.2.

---

## §LAW — the frozen law, and where every bound comes from

```text
THE GATE (two explicit MatchConfig booleans, born false)
  match.dsOwnRun    the OWN RUN candidate is pushed at all
  match.dsHatsOff   assignRunners skips its TWO open-play blocks

THE GUARD (the body's own team licence board — a read of his own side's hats, stated)
  hatted   = team.runners.has(p.index) || team.arriver === p.index
             || team.overlapper === p.index
  wallLive = p.wallRun !== null && match.simTime < p.wallRun.until   (the 2过1
             licence's OWN liveness expression)
  the CARRIER and the KEEPER are excluded STRUCTURALLY: decidePlayer returns for
  `ball.owner === p` and for `p.role === 'GK'` above the off-ball dispatch.

THE PRIOR (the coach's own ranking, moved to the player)
  prior = clamp01( ( RUN_ROLE_W[p.role] + team.localX(p.pos.x) / RUN_DEPTH_DIV )
                   / RUN_PRIOR_MAX )                                    ∈ [0, 1]
  RUN_ROLE_W    GK 0 · DF 0.4 · MF 1.2 · WG 1.8 · ST 2.2   ← assignRunners' OWN object,
                EXPORTED, never re-typed (src/ai/TeamBrain.ts:174)
  RUN_DEPTH_DIV = 45          ← the designation's own `/ 45`, given a home (TeamBrain.ts:181)
  RUN_PRIOR_MAX = Math.max(...Object.values(RUN_ROLE_W)) + HALF_L / RUN_DEPTH_DIV
                              ← DERIVED IN CODE (TeamBrain.ts:189), never typed

THE SCORE (weight × continuous quantity — no threshold anywhere)
  s = W.runScore · prior                        ← the body's OWN evolved run weight
  if (tired) s *= OFFBALL_TIRED_MUL             ← src/sim/constants.ts:353, = 0.6
  s *= obmRunMul                                ← the OBM seat's own runMul; EXACTLY 1
                                                  when `obmMovement` is absent
  cands.push({ action: 'MakeRun', score: s, why: 'own run in behind' })

THE ROUTING — the executor's EXISTING default branch. NOT ONE EXECUTOR LINE MOVES.
  case 'MakeRun': … else { target = runTarget(p, team, opp.players); }
```

### 1. Nothing here is a new number

Every literal in the seam is an existing constant or an existing literal given a home — the
CTB-T0 `SUPPORT_LAT_PULL` precedent (#202: *the same numbers, given a home*):

* **`RUN_ROLE_W`** was already the coach's ranking of who deserves a run. It is now
  `export`ed; the object's own bytes are unchanged, and the shipped ranking expression in
  `assignRunners` is untouched. A source pin kills the mutant that re-types `2.2`.
* **`RUN_DEPTH_DIV = 45`** is the divisor in the shipped expression
  `RUN_ROLE_W[p.role] + team.localX(p.pos.x) / 45`. The shipped line still carries its own
  literal; a source pin asserts the two agree, so a change to one reddens the suite.
* **`RUN_PRIOR_MAX`** is DERIVED, not chosen: `Math.max` over the exported object plus
  `HALF_L / RUN_DEPTH_DIV`. It evaluates to `2.9000000000000004` at
  `HALF_L = 31.499999999999996` (the census's own `definitions.engineConstants.HALF_L`), and
  the doc quotes the derivation rather than the double.
* **`OFFBALL_TIRED_MUL`** is the very multiplier `decideOffBall` has always applied to the
  licensed run for tired legs.
* **`obmRunMul`** is the OBM seat's own output, already computed at this exact site.

### 2. The bound is derived, and where the clamp bites is STATED

The numerator is the coach's own ranking. Its maximum over the pitch is the top role weight
(`2.2`, ST) standing on the opponent goal line (`localX = HALF_L`), which is exactly
`RUN_PRIOR_MAX`; so **`prior = 1` is a real, reachable state of the pitch**, not a chosen
scale, and `prior ≤ 1` everywhere on it. The upper arm of the clamp can therefore only bite
for a body BEYOND the goal line.

⚠ **The LOWER arm bites on the pitch, and the dispatch's sentence about it is corrected here**
(§DEVIATIONS 1). The ranking itself goes negative wherever
`RUN_ROLE_W[role] < −localX / 45`, i.e. deeper than `−45 · RUN_ROLE_W[role]` metres of local
X. For a **DF that is `localX < −18` m** — his own defensive third, well inside the pitch —
and the clamp returns 0 there. For MF it would need `−54` m and for WG/ST more; the pitch is
only `31.499999999999996` m long from the halfway line, so **only the DF is ever clamped**.
This is not a football decision smuggled in: at `prior → 0` the candidate is scored ~0 and
simply loses the argmax. Nobody is banned; a deep defender prices his own run at nothing.
Pinned by §PINS 6.

### 3. Why the prior is the coach's expression and not a new one

VISION §1 forbids hand-written tactics, and this stage does not remove hand-written numbers —
it MOVES them. DS-C0 measured that the ranking already exists and already decides: the coach
names **995.819820** run designations a match (`runCount.designationsPerMatch`, E13) using
this very expression. Making the SAME expression a shared prior on the player's own score
turns a per-tick order into a **共同 prior** without inventing a single new taste number. That
the prior is still hand-written is a DECLARED LIMIT (§HONESTY 3), and its evolution is a later
slice — not a claim of this one.

---

## §HONESTY — stated as LABELLED HYPOTHESES, not findings

1. ⭐⭐ **H-DS-1 — WITH THE OBM SEAT ABSENT THE OWN RUN MAY FLOOD.** The restraint on how many
   bodies run was never in the player: it was the coach's `count` (1–3; DS-C0's runner-count
   bins `runCount.binShare.0/1/2/3` = **0.093400 · 0.372098 · 0.466231 · 0.068271**, mean
   `runCount.mean` = **1.509372**). A prior with no eyes gives every high-prior body the SAME
   licensed score at the same moment, so the OWN-RUN-ALONE arm may put four attackers in
   behind at once. **PROBE (named, not run here): DS-T1's runners-per-tick and crowding faces
   on the OWN-RUN-ALONE arm, with the OBM seat ABSENT and DOSED.** This is a hypothesis. It is
   not measured by this stage and nothing here should be read as evidence for or against it.
2. ⭐⭐ **H-DS-2 — THE EYES ARE WHERE THE RESTRAINT COMES BACK.** `targetCongestion` and
   `ownMarker` (the OBM seat's own vocabulary, `obmVocabulary.featureKeys`) price a crowded run
   DOWN, so a dosed seat should thin the flood without any count rule. **PROBE: the same DS-T1
   faces, dosed.** Also a hypothesis.
3. **The prior is still hand-written numbers.** It is the coach's convention made a shared
   prior, not an evolved one. Declared limit; evolving it is a later slice.
4. **The wall pass and the overlap are untouched committed licences.** They keep their own
   laws and their own timing, and `dsHatsOff` does not touch them (DS-T2's business).
5. **The arriver's arc routing is NOT reproduced.** The shipped arriver is routed to the
   edge-of-box cutback arc; an own run lands in `runTarget` — in behind. The own run therefore
   cannot stand in for `arriving late at the cutback arc`, which was
   `hatClass.shareOfMakeRun.arrivingLate` = **0.038211** of attacking `MakeRun` decisions and
   whose cutback candidate formed **14.197197** times a match
   (`arriver.cutbackFormedPerMatch`). Said plainly rather than glossed.
6. **The hats-off arm removes 前插 ONLY.** Corners, held crashes, crosses, 套边 and 二过一 keep
   their personnel, so "OWN RUN ALONE" means "no open-play runner or arriver hat", not "no hats
   at all". Pinned by §PINS 5.
7. **The census faces ruling #405 item 1 DOWNGRADED are used as approximations or not at all.**
   `offBall.decisionTicksPerMatch`, `offBall.branchReachedShare`,
   `passerRead.carrierDecisionTicksPerMatch` and the `MakeRun` share of off-ball ticks
   (`offBall.actionShare.MakeRun` ≈ 0.165296) are a pre-step reconstruction that misses holds
   armed inside the step; no bound, pin or claim of this seam stands on any of them.

---

## §SEAM — the mechanism (all of it dormant)

### The two flags

* **`dsOwnRun`** and **`dsHatsOff`**, new **explicit** `MatchConfig` booleans, initialised
  `cfg.dsOwnRun ?? false` / `cfg.dsHatsOff ?? false` (`src/sim/Match.ts:2538–2539`) — hard
  `false`s in the `gkDiveBody` docblock idiom. **Never** `EDS_BUNDLE_ARMED`, never env-armed,
  never default-ON, never bundle-defaulted: **absent from `src/game/a4World.ts` entirely**, so
  no play-test world, preset or env bundle can turn either on. Each gets its own
  `League.matchFlags` key (`src/sim/League.ts:300`) so a probe world can arm it EXPLICITLY,
  and that key changes no default.

### The block (`src/ai/PlayerBrain.ts`, `decideOffBall`, l.2152–2166)

One `if (match.dsOwnRun) { … }` in the in-possession branch, placed after the three shipped
hat-guarded `MakeRun` pushes and before the `MoveToFormationSpot` push. Inside: the hat guard,
the wall-licence liveness guard, the clamped prior, the four-factor score, and ONE
`cands.push` carrying the SEVENTH `why` literal `'own run in behind'`.

### The two skips (`src/ai/TeamBrain.ts`, `assignRunners`, l.295 and l.314)

`if (!match.dsHatsOff) { … }` around **exactly two** blocks: the open-play runner scoring
(`count` → `scored` → `team.runners.add`) and the open-play arriver pick. Both gates sit in
the function's OPEN-PLAY TAIL — the held-crash branch, the live-corner branch and the
cross-flight branch all `return` above them, which is itself pinned (§PINS 10, M3). The
statements inside are not deleted, reordered or reworded; with the flag off they run exactly
as they shipped (§DEVIATIONS 2 records the two-space re-indent, the only textual change).

### ⭐ The READ-FORK INVENTORY (a NAMED deliverable)

Exactly **ONE** `match.dsOwnRun` fork and exactly **TWO** `match.dsHatsOff` forks exist in
`src/**`. Every other occurrence is a declaration, an init or a union key — enumerated:

| # | site | file:line | class | what it feeds |
| --- | --- | --- | --- | --- |
| **1** | `if (match.dsOwnRun) {` | `src/ai/PlayerBrain.ts:2152` | **READ FORK** | the ONE own-run candidate |
| **2** | `if (!match.dsHatsOff) {` | `src/ai/TeamBrain.ts:295` | **READ FORK** | the open-play runner scoring |
| **3** | `if (!match.dsHatsOff) {` | `src/ai/TeamBrain.ts:314` | **READ FORK** | the open-play arriver pick |
| 4 | `dsOwnRun?: boolean;` | `src/sim/Match.ts:737` | config key | — |
| 5 | `dsHatsOff?: boolean;` | `src/sim/Match.ts:755` | config key | — |
| 6 | `readonly dsOwnRun: boolean;` | `src/sim/Match.ts:1684` | field | — |
| 7 | `readonly dsHatsOff: boolean;` | `src/sim/Match.ts:1690` | field | — |
| 8 | `this.dsOwnRun = cfg.dsOwnRun ?? false;` | `src/sim/Match.ts:2538` | init | — |
| 9 | `this.dsHatsOff = cfg.dsHatsOff ?? false;` | `src/sim/Match.ts:2539` | init | — |
| 10 | `\| 'dsOwnRun' \| 'dsHatsOff'` | `src/sim/League.ts:300` | union key | — |

Executable-line occurrence counts per file, pinned by §PINS 8:
`PlayerBrain.ts` own 1 / hats 0 · `TeamBrain.ts` own 0 / hats 2 · `Match.ts` own 4 / hats 4 ·
`League.ts` own 1 / hats 1 · **every other file in `src/**` 0**, `a4World.ts` included.

### ⭐ THE COMPLETE READ SET of the own-run fork

His own `pos`, `role` and (through the incumbent `tired`) `stamina`; his own team's LICENCE
BOARD — `team.runners`, `team.arriver`, `team.overlapper`, his own `p.wallRun` — **a read of
his own side's hat board, STATED AS SUCH and not a percept**; `obmRunMul`; `W.runScore`;
`team.localX`. ⛔ **NOT** `match.pendingPass`, **NOT** `pendingPassWindup`, **NOT** any
opponent's truth position, **NOT** `info.genome`, **NOT** a perceived snapshot. Pinned as a
source assertion (§PINS 7).

### NO predicates (the #200 red line)

The complete conditional set of the pushed block is **gate** (`match.dsOwnRun`), **guard**
(the four hat reads — set membership and index equality — plus the wall licence's own CLOCK
liveness), **cap** (`clamp01`) and the incumbent **`tired`** multiplier. There is no
comparison on a distance, a space, an opponent or any other football quantity; the pin
asserts the exact list of `if`s and that the block's ONLY inequality is the wall-licence
clock. Nothing decides; it scores, and the shipped argmax settles it.

### Untouched (restated as a prohibition)

`src/ai/actionExecutor.ts` (the `MakeRun` case and its default branch — **zero bytes**) ·
`src/ai/offballEyes.ts` · `src/sim/mechanics.ts` · the wall-pass trigger and its six
conjuncts · the 套边 block · the corner crash, the live corner and the cross-flight branches ·
`assignChasers` and `assignMarks` · the passer's six hat-consumption sites (the ⑤ boundary) ·
every gene, `GENE_KEYS`, `randomGenome`, `mutateGenome`, `crossoverGenomes` · `a4World.ts` and
all play-test worlds · the render layer · the production fingerprint.

---

## §PINS — the PIN INVENTORY (`tests/dsOwnRun.test.ts`, 31 `it()`s, ALL GREEN)

| # | pin | what it catches |
| --- | --- | --- |
| **1** | **G-OFF** — both flags absent ⇒ whole-match signatures (rng state included) on the 12 scratch seeds digest to the literals RECORDED AT HEAD `ca61a6a` in a clean throwaway worktree, in the BARE world (`4289c76d…038b`), world 13 (`72c077ba…72c1`) and world 15 (`d8fc1359…ef0a`); ABSENT ≡ EXPLICITLY FALSE; the production fingerprint `57b0bdab…c673` recomputed | any leak of the dormant path into a shipped world |
| **2** | **G-BORN** — armed with the OBM seat absent, an unhatted in-possession outfield body's record carries `MakeRun` with `why` `'own run in behind'` at score EXACTLY `W.runScore · prior` (prior recomputed in the test from the anchored constants; `obmRunMul` = 1), on > 20 observed decisions | a wrong prior, a wrong multiplier, a silent `obmRunMul` ≠ 1 |
| **3** | **THE SEVENTH LITERAL** — the six census literals (read off the artifact BY FIELD, never typed) present in `src/**`; the seventh present exactly once, in `PlayerBrain.ts` | an eighth literal, a reworded sixth |
| **4** | **THE ROUTING** — an unhatted body executing `MakeRun` has `desiredVel` EXACTLY equal to the executor's own default-branch arithmetic on `runTarget`'s output (`arrive(p, runTarget(…), topSpeed·sprint, 2.2) + separation(…)`), on > 20 bodies, and NOT equal to the arriver's arc target on > 10 of them | the #401 lesson: the branch is MEASURED, not inferred |
| **5** | **THE HATS-OFF SCOPE** — observed at the COACH's own cadence: in open play `runners` empty and `arriver` null on > 1,000 checks; a LIVE corner still licenses crashers; a HELD crash's runners are a subset of the hand-off list; `overlapper` still set; `wallRun` still fires | the bypass reaching a branch that is not 前插 |
| **6** | **THE BOUND** — `prior ∈ [0,1]` for every role at every `localX` on the pitch at 0.25 m steps; `= 1` exactly for ST on the goal line; the lower clamp's DF-only bite pinned with its arithmetic | a bound that is asserted rather than derived |
| **7** | **NO PREDICATE** — the pushed block's `if` list is exactly the three named statements and its only inequality is the wall clock; the banned tokens (`dist(`, `pendingPass`, `info.genome`, `perceived`, `opp.`, …) absent | #200, and read-set creep |
| **8** | **THE SEAM MAP** — per-file executable-line occurrence counts of both flags, the file list exact, `a4World.ts` zero, no env arming | a second fork appearing anywhere |
| **9** | **DORMANCY** — no world 1–15 carries either key; a match built at every version reports both false; `League.toJSON` omits `matchFlags` | Road B |
| **10** | **THE MUTANT WALK** — M1 the prior re-typed with `2.2` (killed by the source pin on `RUN_ROLE_W`); M2 the not-hatted guard dropped so a licensed body pushes `MakeRun` twice (killed by a candidate-count pin on > 10 licensed bodies); M3 the hats-off gate reaching a corner branch (killed by the lexical order pin + §PINS 5); M4 the own run pushed with the flag absent (killed by G-OFF and by a whole-match scan) | each named mutant |
| **11** | **NARROWED PINS** — the `why` set (the seventh present exactly once), the match-flag key set (grew by EXACTLY two, both dormant), and DS-C0's code facts (the `MakeRun` push count is now 6, the sixth flag-gated and hat-guarded; `offBall.makeRunOtherShare` still 0) | the DF-T0 §P7 form: narrowed POSITIVELY, never widened |

**NARROWS OF RECORD (every one listed, per the dispatch):** three, all POSITIVE.
(a) the `why`-literal set — previously "six literals"; now "six shipped + this seam's ONE,
exactly once, and no eighth". (b) the match-flag key union — now "grew by exactly two, both
dormant, both absent from every world". (c) DS-C0's code fact
`makeRunCandidatesAllHatGuarded` — the source now carries SIX `MakeRun` pushes, not five; the
sixth is guarded by a flag that is false everywhere AND by the not-hatted read, so the
census's boolean is unchanged in meaning for every world that exists. **No existing pin in
`tests/**` was edited, loosened or deleted; the only `tests/**` change is the NEW file.**

---

## §GATES — frozen ex ante

| gate | predicate | kind |
| --- | --- | --- |
| **G-OFF** | the three recorded HEAD digests reproduce; absent ≡ explicitly false | HARD |
| **G-FP** | `npm run fingerprint` prints `57b0bdab…c673` unchanged | HARD |
| **G-BORN** | the candidate exists with the exact score, the OBM seat absent | HARD |
| **G-ROUTE** | the unhatted `MakeRun` reaches `runTarget`, measured | HARD |
| **G-SCOPE** | the hats-off arm empties open play and nothing else | HARD |
| **G-BOUND** | `prior ∈ [0,1]`, `= 1` at the derived maximum | HARD |
| **G-NOPRED** | no predicate on a football quantity in the fork | HARD |
| **G-FORK** | the read-fork inventory, counts exact, `a4World` clean | HARD |
| **G-SUITE** | FULL `npm test` green + `tsc --noEmit` clean | HARD |

**Pre-named FAIL ⇒ STOP** (#179): any HARD gate failing, any src diff outside the seam path,
any predicate appearing, or any existing test breaking (STOP-and-report, never a test edit).
None fired. **RESULT: all HARD gates green.** `npm test` = 2,226 tests, 2,224 passed on the
full run with the two KNOWN wall-clock flakes timing out
(`tests/formationEvolution.test.ts`, `tests/careers.test.ts`, #196.2) — both re-run ALONE
immediately after: **12/12 green, 154 s**. `tsc --noEmit` clean. Fingerprint unchanged.

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| DS-C0 consumption (#405 item 6) | 12,553,000 – 12,553,999 (whole) | prior |
| **DS-T0 pin suite (this stage)** | **900,006,000 – 900,006,011** (G-OFF, 3 worlds) · **900,006,020 – 900,006,023** (fixtures) · **900,006,040 – 900,006,047** (walks) | **SCRATCH, consumed here** |
| DS-T0 verifier band | 900,006,100 – 900,006,199 | reserved |
| frontier | next sim ≥ **12,554,000** | **UNTOUCHED — zero frontier consumption** |

Canon, VERBATIM: *"verifier scratch walks use the stage's own consumed band or the
out-of-band scratch range (≥ 900,000,000) — never the next virgin block"* (home:
PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6).

## §ROAD B — nothing ships

Both flags are OFF in every production path — hard `false` defaults, absent from
`a4World.ts`, absent from every world 1–15, absent from every League's `matchFlags` unless a
probe sets one explicitly. The production fingerprint is unchanged and the flag-off world is
byte-identical to HEAD on 36 recorded match signatures with the rng stream included. **Nothing
about the game the user plays changes in this commit.** The seam exists so DS-T1 can force it.

⭐ **WORLDS 12–15, CHECKED BOTH WAYS.** Worlds 13 and 15 are pinned in the suite (§PINS 1).
Worlds **12** and **14** were checked OUT-OF-SUITE by running the same signature recipe on the
first 4 scratch seeds in BOTH trees — the clean HEAD worktree at `ca61a6a` and this working
tree — and the digests are equal: world 12 `2a4bc797…e46d`, world 14 `660d296a…98e37`
(identical in both trees, not merely self-consistent). They are not pinned in the suite because
the three pinned worlds already cover every composition this seam can touch and the walk costs
real wall-clock; the receipt is recorded here rather than claimed.

## §NON-CLAIMS

DS-T0 claims **no** football effect: not on runs per tick, not on through balls, not on
completion, shots, goals, crowding, spacing, offside, the equilibrium band or watchability.
It does not claim the own run is BETTER than the hat; it does not claim the flood of H-DS-1
happens; it does not claim the eyes cure it. It changes **no** pass selection, **no** carrier
seat, **no** executor routing, and adds **no** gene, **no** attribute, **no** action type,
**no** render cue and **no** percept pull. It does not retire the coach's designation — M-DF.2's
law is that a compensator retires **by measurement, never by deletion**, and `dsHatsOff` is an
ARM for that measurement, not a removal. It cannot authorize DS-T1; only the commander can.

## §DEVIATIONS REQUIRED (declared by the executor; the commander disposes)

1. ⚠⚠ **THE DISPATCH'S SENTENCE ABOUT THE CLAMP IS WRONG, AND THE CORRECTION IS PINNED.**
   Ruling #405 item 3(ii) as briefed says the `clamp01` "can only bite for a body beyond the
   goal line". True of the UPPER arm only. The LOWER arm bites wherever
   `RUN_ROLE_W[role] + localX/45 < 0`, i.e. for a **DF deeper than −18 m of local X** — inside
   his own third, on the pitch, every match. The law is unchanged (a clamped prior of 0 costs
   a deep defender his own run, which is the intended football), but the STATEMENT is
   corrected here and pinned by §PINS 6 rather than left as prose.
2. **The hats-off gates re-indent the two shipped blocks by two spaces.** No statement is
   deleted, reordered or reworded and the arithmetic is identical (G-OFF measures it); this is
   the only textual change to shipped `TeamBrain` lines besides the `export` keyword.
3. **`RUN_DEPTH_DIV` is a code-move the dispatch left ambiguous.** The brief said to "name the
   45 at its use site the same way". Re-typing `45` in `PlayerBrain` would have made a second
   copy of a number the coach owns, so it was given a home in `TeamBrain` instead (the
   `SUPPORT_LAT_PULL` precedent) and the shipped expression was LEFT UNTOUCHED with a source
   pin asserting the two agree. Value identical; no behaviour moves.
4. **The routing pin measures `desiredVel`, not `target`.** `executeAction` publishes no
   target (`p.c4Trace` is nulled at its head), so the pin reconstructs the executor's own tail
   arithmetic for the default branch and asserts EXACT equality, plus a discrimination check
   against the arriver's arc. This is the #401 form (a measurement of who enters the branch),
   not the #399 defect (a fixture proving a predicate).
5. **The hats-off scope pin observes at the coach's cadence.** The board is only rewritten on
   a coach tick, so a per-tick assertion would have failed on state left by a corner three
   ticks earlier. The branch is classified PRE-STEP with the clock at `simTime + DT` — DS-C0
   §P.B's own reconstruction — and the assertion is taken on coach ticks only.
