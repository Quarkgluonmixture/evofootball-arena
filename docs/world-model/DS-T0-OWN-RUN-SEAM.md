# DS T0 — 「自己的前插」 THE OWN-RUN SEAM (`dsOwnRun` + `dsHatsOff`, dormant)

> ⭐⭐⭐ **AMENDED AT DS-T0b (ruling #407 item 5) — 「自己的前插 · 约束」 THE RESTRAINT SLICE.**
> The law of record for the own run is now **§LAW-B** at the foot of this document (the count
> prior read against PERCEIVED running mates; the state guard read off the perceived ball's
> owner; the same flag, no new constant). Everything above §LAW-B is DS-T0 AS BANKED at
> ruling #406 and is kept as the record of that stage; where the two differ, **§LAW-B
> governs**.

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
6. **The hats-off arm removes 前插 ONLY — AT SOURCE; behaviourally it ALSO moves the licences that
   read the board it empties** (§COMMANDER CORRECTIONS 2): the 套边 pick filters on `team.runners` /
   `team.arriver`, so an empty board widens its candidate set; the cross-flight snapshot copies the
   board (unarmed on these worlds); the wall run moves downstream. DS-T1 publishes the overlap sets and
   the wall-pass fires on every arm so the coupling is measured, not assumed away.
8. **The own run is licensed in states the shipped hat licence gates out** (§COMMANDER CORRECTIONS
   3): the block carries no state condition — the shipped licensed run requires a carrier who is not
   this body, or a restart / crash / cross — so an unhatted body may price his run while the ball is
   in flight between mates or during his side's restart. By design (the player's run is not conditioned
   on the coach's state machine); DS-T1 publishes runs and their yield PER STATE (owned · in flight ·
   restart) so the arms' difference is visible.
6′. **(the original item 6 text follows.)** Corners, held crashes, crosses, 套边 and 二过一 keep
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
| **1** | `if (match.dsOwnRun) {` | `src/ai/PlayerBrain.ts:2203` (refreshed at #409 after DS-T0b's code-move; was 2152) | **READ FORK** | the ONE own-run candidate |
| **2** | `if (!match.dsHatsOff) {` | `src/ai/TeamBrain.ts:323` (refreshed at #409; was 295) | **READ FORK** | the open-play runner scoring |
| **3** | `if (!match.dsHatsOff) {` | `src/ai/TeamBrain.ts:343` (refreshed at #409; was 314) | **READ FORK** | the open-play arriver pick |
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

*(§COMMANDER CORRECTIONS 6 adds two reads the list below omitted: `match.simTime`, through the wall
licence's clock, and `p.index`, through the set-membership and equality guards.)*

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

## §PINS — the PIN INVENTORY (`tests/dsOwnRun.test.ts`, DS-T0's 31 `it()`s, ALL GREEN)

> ⚠ The FILE now carries **61** `it()`s — **§PINS-B** below is the current inventory and the
> one home for the count; the table here is DS-T0's, kept as that stage's record.

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
census's boolean is unchanged in meaning for every world that exists — ⚠ BUT the census's OWN
EXTRACTOR, re-run on this source, computes `makeRunCandidatesAllHatGuarded` = FALSE, because the new
push's nearest enclosing `if` names the locals `hatted` / `wallLive`, not a designation field
(§COMMANDER CORRECTIONS 1); DS-T1's instrument classifies flag-gated pushes as their own class and the
shipped-path boolean is restated over the pushes reachable with both flags absent — declared in advance. **No existing pin in
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


---

# ⭐⭐⭐ DS T0b — 「自己的前插 · 约束」 THE RESTRAINT SLICE (the SAME flag, amended)

Status: **AMENDED, PINNED, STILL DORMANT.** Authority: **COMMANDER RULING #407 item 5**,
standing on **item 2** (DS-T1's numbers of record), **item 3** (the read of record) and
**item 4** (the coach's two restraints, read at source). No new flag, no new constant, no new
gene: the own run keeps `match.dsOwnRun` and gains two factors that were the COACH's and are
now the PLAYER's. The OFF world is byte-identical to the dispatch HEAD `b05d3d9` on
re-recorded digests in the bare world and worlds 12 · 13 · 14 · 15; the production fingerprint
is unchanged.

**WHY.** DS-T1 measured what DS-T0 left out (ruling #407 item 2, E13, seat absent, OWN vs
HATS): executed runs per in-possession open-play team-tick `r1.runsPerInPossessionTick`
**0.584786 → 1.832816**, ticks with ≥ 3 runners **0.014729 → 0.328737**, and through balls
**5.962963 → 8.750751** breaching the band — the own run FLOODS. Ruling #407 item 4 read the
cause at source: the coach restrained the run in TWO expressions, a COUNT and a STATE, and
DS-T0 moved neither. This slice moves both, into the player, read off things he owns.

## §LAW-B — the amended law, and where every bound comes from

```text
THE GATE (unchanged)          match.dsOwnRun
THE GUARD (unchanged)         hatted / wallLive, and the carrier + keeper excluded
                              STRUCTURALLY by decidePlayer's own dispatch

THE PERCEPT (M-DS.6/7's only sense) — ONE pull, INSIDE the gate and the guard
  snapshot = match.perceivedSnapshot(p)          ← may be null (a blind body)

THE STATE GUARD, PERCEIVED (M-DS.7)
  ownerGid      = snapshot.ball === null ? null : snapshot.ball.ownerGid
  carrierIsMate = ownerGid !== null && ownerGid !== p.gid
                  && some q in team.players has q.gid === ownerGid   ← the ROSTER by gid
  the candidate exists ONLY when snapshot !== null && carrierIsMate

THE COUNT PRIOR (M-DS.6(a)) — the coach's own expression, CODE-MOVED
  count = runnerCount(team.mode, team.genome.tempo, team.mentality.urgency)
        = (mode === 'CounterAttack' || tempo > 0.65 ? 2 : 1) + (urgency > 0.65 ? 1 : 0)
                              ← src/ai/TeamBrain.ts, EXPORTED; the shipped call site now
                                CALLS it; the expression exists ONCE in src/**

THE RUNNING MATES (M-DS.6(b)) — his own eyes, his own account
  runningMates = Σ over mate ∈ team.players with
                   mate.gid ≠ p.gid, mate.gid ≠ ownerGid,
                   mate.role ≠ 'GK', !mate.sentOff                  ← the ROSTER by gid
                 and over body ∈ snapshot.players with
                   body.gid === mate.gid && body.side === p.side    ← the SNAPSHOT
                 of  clamp01( (body.vel.x · team.attackDir) / p.topSpeed )

THE RESTRAINT (M-DS.6(c))
  restraint = clamp01( 1 − runningMates / count )                   ∈ [0, 1]

THE SCORE (weight × continuous quantities; the evaluation ORDER is written out)
  s = W.runScore · prior · restraint            ← ((W.runScore · prior) · restraint)
  if (tired) s *= OFFBALL_TIRED_MUL             ← src/sim/constants.ts, = 0.6
  s *= obmRunMul                                ← the OBM seat's own runMul; EXACTLY 1
                                                  when `obmMovement` is absent
  cands.push({ action: 'MakeRun', score: s, why: 'own run in behind' })   ← the SAME
                                                  seventh literal; no eighth
```

### 1. Nothing here is a new number — the second time

* **`count`'s literals** (`0.65`, `0.65`, the `2`/`1` and the `1`/`0`) are the COACH's own
  hand-written numbers, MOVED. They are not grown, not tuned and not re-typed: the moved
  function's `return` carries `assignRunners`' expression byte-for-byte with its receiver
  prefixes (`team.` / `team.genome.` / `team.mentality.`) stripped, and a source pin applies
  exactly that strip to the expression RECORDED at the dispatch head and asserts equality
  (§PINS-B 1). That they are still hand-written is a DECLARED LIMIT (§HONESTY-B 3), the same
  declaration `RUN_ROLE_W` carries.
* **`p.topSpeed`** is the body's OWN account of himself (`src/sim/Player.ts` getter,
  `baseSpeed · (0.62 + 0.38 · stamina)`) — proprioception, which the perception trunk itself
  treats as continuously known. It is a NORMALISER, not a threshold.
* **`team.attackDir`** is `±1` (`src/sim/Team.ts`), so "the component along the attacking
  direction" is exactly `body.vel.x · attackDir`. No unit is invented and none is converted:
  metres per second divided by metres per second (canon **unit-name truth**).
* **NO new constant exists anywhere in this slice.** `git diff` adds no `export const`.

### 2. The bounds, derived

* `clamp01((body.vel.x · attackDir) / p.topSpeed) ∈ [0, 1]` by the cap; a mate running
  BACKWARDS or ACROSS contributes exactly 0, a mate at the observer's own top speed exactly 1,
  and a mate faster than that is capped at 1 (nobody counts as more than one runner).
* `runningMates ∈ [0, 4]` on a six-a-side pitch: the sum runs over the roster minus the
  keeper, minus the observer, minus the carrier — at most **four** bodies (`TEAM_SIZE` = 6; three
  for an outfield carrier, FOUR only when the perceived carrier IS the keeper and two exclusions
  collapse into one — §COMMANDER CORRECTIONS-B 4; the bound is attainable and sound,
  `src/sim/types.ts`).
* `count ∈ {1, 2, 3}` — the three values the coach's expression can take, all three produced
  on the pinned corner grid (§PINS-B 2).
* `restraint = clamp01(1 − runningMates / count) ∈ [0, 1]`, `= 1` exactly when nothing is
  seen to move forward (and `x · 1 === x` in IEEE-754, so the DS-T0 score is the
  no-running-mates case EXACTLY), `= 0` exactly when the count is already running. The LOWER
  arm is REACHABLE and is the point of the slice; the upper arm is reached whenever nobody
  runs, which is common.
* The score therefore stays a product of a weight and continuous quantities in `[0, 1]`, and
  the argmax settles it. Nothing decides.

### 3. The percept pull, and its cost bound

ONE `match.perceivedSnapshot(p)` per own-run evaluation, taken at the body's EXISTING
decision cadence — the same bound the OBM seat's M-OBM.4 states and the same bound
OBM-T0 §HONESTY 7 measured: one pull per off-ball decision at `AI_INTERVAL`, **zero** pulls in
the per-tick executor. The pull sits INSIDE `if (match.dsOwnRun)` and INSIDE the not-hatted
guard, so:

* flag absent ⇒ **ZERO** pulls attributable to this fork ⇒ the world is HEAD's byte for byte
  (G-OFF, and the pull counter measures it directly over > 100 unhatted off-ball decisions);
* flag armed, OBM seat absent ⇒ **exactly one** per evaluation;
* flag armed, OBM seat armed ⇒ **two** — the seat's own pull and this one. That is the
  DECLARED form (§DEVIATIONS-B 1): sharing the snapshot would require changing
  `obmOffballPolicy`'s signature, and `src/ai/offballEyes.ts` is off-limits to this stage by
  ruling #407 item 5(vi). The second pull is measured IDEMPOTENT and rng-free — the executor's
  bench walk saw 4,000 double pulls with zero differing snapshots and zero rng movement, and
  the permanent pin (§PINS-B 6) re-proves the same property over > 1,000. That is what makes
  it affordable and what keeps the seat's own arithmetic byte-unchanged.

### 4. ⭐ THE COMPLETE READ SET of the amended fork

**THE SNAPSHOT** — `snapshot.ball.ownerGid`; each observed body's `gid`, `side` and `vel`
(its `pos`, `bodyDir`, `observedTick` and `ageTicks` are NOT read). **HIS OWN BODY** — `pos`,
`role`, `gid`, `side`, `topSpeed`, `wallRun`, `index`, and through the incumbent `tired` his
`stamina`. **THE ROSTER by gid** — `team.players`' `gid`, `role` and `sentOff`: who is on my
team, who is the keeper and who has been sent off is SHARED KNOWLEDGE (the team sheet and the
referee's card), DECLARED AS SUCH and not a percept, exactly as the hat board is declared.
**THE BOARD** — `team.runners`, `team.arriver`, `team.overlapper` (the not-hatted guard, as
before). **THE TEAM'S SHARED CONVENTION** — `team.mode`, `team.genome.tempo`,
`team.mentality.urgency` (the count's three inputs — a 共同 prior), `team.attackDir`,
`team.localX`. **THE INCUMBENTS** — `W.runScore`, `obmRunMul`, `OFFBALL_TIRED_MUL`,
`match.simTime` (the wall licence's clock), `match.dsOwnRun`.

⛔ **NOT** `match.ball`, **NOT** `ball.owner`, **NOT** `match.pendingPass`, **NOT**
`pendingPassWindup`, **NOT** any other body's TRUTH `pos` or `vel` (the snapshot's COPIES
only), **NOT** `opp.*`, **NOT** `match.allPlayers`, **NOT** `info.genome`. Pinned as a source
assertion over the block's whole text (§PINS-B 5), including a positive assertion that the
only `match` members named in the block are `dsOwnRun`, `simTime` and `perceivedSnapshot`.

### 5. Still NO predicate on a football quantity (#200)

The block's conditional set grows from three `if`s to nine, and **every new one is an IDENTITY
test** — a gid, a side, a role, a sent-off flag, a null. The block's ONLY inequality is still
the 2过1 licence's own clock liveness (pinned as an exact list). The count's inner comparisons
(`tempo > 0.65`, `urgency > 0.65`) are the coach's expression MOVED WHOLE and live in
`TeamBrain`, declared here exactly as `RUN_ROLE_W`'s numbers were declared at DS-T0.

## §HONESTY-B — LABELLED HYPOTHESES, and the limits

1. ⭐⭐ **H-DS-3 — THE PERCEIVED RESTRAINT HOLDS THE COACH'S COUNT WITHOUT THE COACH.** The
   count that used to be enforced top-down by `assignRunners`' `slice(0, count)` is now a
   shared prior each body prices himself against what he can SEE; the claim is that the flood
   (`r1.runsPerInPossessionTick` 0.584786 → 1.832816; ≥ 3 runners 0.014729 → 0.328737) comes
   back toward the coach's own band without anybody issuing an order. **PROBE (named, not run
   here): DS-T1b's R1 on the OWN arm.** A HYPOTHESIS. Nothing in this stage measures it, and
   nothing here should be read as evidence for or against it.
2. ⭐⭐ **H-DS-4 — WITHDRAWING THE IN-FLIGHT RUN COSTS THE THROUGH-BALL GAIN.** DS-T1 measured
   that **0.542593** of own runs are won with the ball IN FLIGHT and **0.235011** at the side's
   own restart — together the **0.777604** of runs that M-DS.7's perceived state guard now
   withdraws. The breached guard was through balls (**5.962963 → 8.750751**), so the claim is
   that the breach closes and the gain goes with it. **PROBE: DS-T1b's G9 and the yield pair.**
   Also a HYPOTHESIS.
3. **The count is still hand-written numbers.** It is the coach's convention made a shared
   prior, not an evolved one — the same declared limit `RUN_ROLE_W` carries (§HONESTY 3).
   Evolving either is a later slice.
4. ⚠ **THE STALE-EYES CASE, NAMED AS A LIMIT.** A mate's run seen LATE enters the sum as it
   was seen (staleness is data, the E3R2 trunk's own doctrine and the OBM seat's `readingAge`
   note), and a mate OUTSIDE the cone is not in `snapshot.players` at all — **an unseen run
   counts as NO running**, so a body with bad eyes restrains himself LESS, not more. That is
   the honest consequence of reading percepts and it is pinned as behaviour (§PINS-B 4), not
   smoothed away.
5. ⚠ **THE OWN RUN NOW NEEDS EYES, AND IN A WORLD WITHOUT THE PERCEPT TRUNK IT DOES NOT EXIST.**
   `refreshPerception` is gated on `edsPerceivedDefence || edsPerceivedChoice || stationEye`,
   so in the BARE world `perceivedSnapshot` returns null for every body and the candidate is
   never pushed — the OBM seat's own born-blind note, inherited. DS-T1's substrate (E13 /
   world 13) and every A4-family world arm the trunk, so the exam's arms are unaffected; but
   the seam's REACH has narrowed and the doc says so rather than letting a silent zero pass
   for a measurement (§DEVIATIONS-B 2, pinned positively).
6. **The in-flight run is WITHDRAWN, not dismissed.** A run onto a ball already travelling to
   a teammate is REAL football — the striker who goes as the pass is struck. Slice one cannot
   express it honestly (the perceived ball has an owner or it does not), so it is named as
   **THE NEXT SLICE** and left out, with H-DS-4 measuring exactly what it cost.
7. **The keeper and the owner's side are ROSTER reads.** Which bodies are mine, which one is
   the keeper and who has been sent off are read off `team.players` by gid — shared knowledge,
   DECLARED, not a percept. The snapshot carries no role field and its `ObservedPlayer` carries
   no `sentOff` field either (§DEVIATIONS-B 3 corrects the dispatch's sentence).
8. **DS-T0's §HONESTY 1–8 stand unchanged** except where this slice answers them: H-DS-1 was
   measured and HELD (ruling #407 item 3), and §HONESTY 8 — "the own run is licensed in states
   the shipped hat licence gates out" — is the very thing M-DS.7 now closes.

## §SEAM-B — the mechanism (all of it still dormant)

### The block, VERBATIM (`src/ai/PlayerBrain.ts`, `decideOffBall`'s in-possession branch)

```ts
    if (match.dsOwnRun) {
      const hatted = team.runners.has(p.index) || team.arriver === p.index
        || team.overlapper === p.index;
      // the 2过1 licence's OWN liveness expression (`p.wallRun !== null && simTime < until`)
      const wallLive = p.wallRun !== null && match.simTime < p.wallRun.until;
      if (!hatted && !wallLive) {
        const snapshot = match.perceivedSnapshot(p);
        const seenBall = snapshot === null ? null : snapshot.ball;
        const ownerGid = seenBall === null ? null : seenBall.ownerGid;
        // M-DS.7: the perceived owner is a MATE and is NOT me — the roster resolves his side.
        let carrierIsMate = false;
        if (ownerGid !== null && ownerGid !== p.gid) {
          for (const mate of team.players) {
            if (mate.gid === ownerGid) carrierIsMate = true;
          }
        }
        if (snapshot !== null && carrierIsMate) {
          // M-DS.6(b): how much running his eyes say is ALREADY happening. A stale reading
          // enters as it is and a body outside the cone is not in `snapshot.players` at all,
          // so an unseen run counts as NO running — staleness is data (§HONESTY-B, limit).
          let runningMates = 0;
          for (const mate of team.players) {
            if (mate.gid === p.gid || mate.gid === ownerGid) continue;
            if (mate.role === 'GK' || mate.sentOff) continue;
            for (const body of snapshot.players) {
              if (body.gid !== mate.gid || body.side !== p.side) continue;
              runningMates += clamp01((body.vel.x * team.attackDir) / p.topSpeed);
            }
          }
          const restraint = clamp01(1 - runningMates / runnerCount(
            team.mode, team.genome.tempo, team.mentality.urgency,
          ));
          const prior = clamp01(
            (RUN_ROLE_W[p.role] + team.localX(p.pos.x) / RUN_DEPTH_DIV) / RUN_PRIOR_MAX,
          );
          let s = W.runScore * prior * restraint;
          if (tired) s *= OFFBALL_TIRED_MUL;
          s *= obmRunMul;
          cands.push({ action: 'MakeRun', score: s, why: 'own run in behind' });
        }
      }
    }
```

### The code-move, VERBATIM (`src/ai/TeamBrain.ts`)

```ts
export function runnerCount(mode: TeamMode, tempo: number, urgency: number): number {
  return (mode === 'CounterAttack' || tempo > 0.65 ? 2 : 1)
    + (urgency > 0.65 ? 1 : 0);
}
```

and the shipped call site inside `assignRunners`, which is the ONLY other place the count
exists:

```ts
    const count = runnerCount(team.mode, team.genome.tempo, team.mentality.urgency);
```

### ⭐ The READ-FORK INVENTORY, UPDATED

The flag-fork table of §SEAM is **UNCHANGED** — the code-move adds no flag read anywhere, and
the executable-line occurrence counts are still `PlayerBrain.ts` own 1 / hats 0 ·
`TeamBrain.ts` own 0 / hats 2 · `Match.ts` own 4 / hats 4 · `League.ts` own 1 / hats 1 ·
every other file in `src/**` 0, `a4World.ts` included (pinned, §PINS 8, unchanged). What
DS-T0b adds to the inventory is the READ the fork performs inside site 1:

| # | site | file | class | what it feeds |
| --- | --- | --- | --- | --- |
| **1** | `if (match.dsOwnRun) {` | `src/ai/PlayerBrain.ts` | **READ FORK** (unchanged) | the ONE own-run candidate |
| **1a** | `match.perceivedSnapshot(p)` | `src/ai/PlayerBrain.ts`, inside site 1 | **PERCEPT PULL** (new) | the state guard and the running-mates sum |
| **1b** | `runnerCount(...)` | `src/ai/PlayerBrain.ts`, inside site 1 | **CODE-MOVE CALL** (new) | the count prior |
| **1c** | `runnerCount(...)` | `src/ai/TeamBrain.ts`, in `assignRunners` | **CODE-MOVE CALL** (new) | the shipped designation, arithmetic unchanged |

`match.perceivedSnapshot` now occurs **3** times in `PlayerBrain.ts`'s executable text: the
pass chooser's two (carrier-side, pre-existing) and this one. Pinned.

### Untouched (restated as a prohibition, extended)

`src/ai/actionExecutor.ts` · **`src/ai/offballEyes.ts` (ZERO bytes — the seat's signature,
arithmetic and pins are untouched)** · `src/ai/perceptionSnapshot.ts` · `src/ai/perception.ts`
· `src/sim/Match.ts` (**no new flag**) · `src/sim/League.ts` · `src/sim/mechanics.ts` · the
wall-pass trigger · the 套边 block · the corner branches · every gene · `a4World.ts` and all
play-test worlds · the render layer · the production fingerprint.

## §PINS-B — the pin inventory, EXTENDED (`tests/dsOwnRun.test.ts`, 31 → **61** `it()`s, ALL GREEN)

| # | pin | what it catches |
| --- | --- | --- |
| **B0** | **G-OFF, RE-RECORDED** — both flags absent ⇒ whole-match signatures (rng state included) on 12 scratch seeds (900,006,400–411) digest to the literals recorded at the DISPATCH HEAD `b05d3d9` in a clean throwaway worktree, in the BARE world (`16a2fca6…aa8c`), world 13 (`e68bc4f1…dd22`) and world 15 (`5fd8fe71…f5ca`); worlds **12** (`2ce9b435…5374`) and **14** (`600bdd61…b91f`) brought INTO the suite at 4 seeds each; ABSENT ≡ EXPLICITLY FALSE; the production fingerprint `57b0bdab…c673` recomputed | any leak of the amended path into a shipped world |
| **B1** | **THE CODE-MOVE** — the moved function's `return` equals the count expression RECORDED at the dispatch head with only the receiver prefixes stripped; the shipped call site CALLS it; the comparison exists ONCE in `TeamBrain`'s executable text and the two `0.65`s are both the count's; the block carries neither `0.65` nor `'CounterAttack'` | the count re-typed, or drifting from the coach's |
| **B2** | **THE COUNT GRID** — `runnerCount` equals the frozen reference on the FULL (6 modes) × (tempo ≤/> 0.65) × (urgency ≤/> 0.65) grid, and all three values 1 · 2 · 3 are produced (non-vacuity) | a corner silently changed |
| **B3** | **G-BORN′ EXACT** — hand-built scenes with the memory written by hand: a perceived same-side carrier and nobody running ⇒ score EXACTLY `W.runScore · prior`; `count` mates at the observer's own top speed ⇒ EXACTLY 0; half of `count` ⇒ EXACTLY `W.runScore · prior · 0.5`; more than `count` ⇒ still 0 (the cap). Plus the live walk in world 13: > 20 recorded candidates equal `W.runScore · prior · restraint` with the restraint RE-DERIVED from the body's own snapshot, and the restraint bit on at least one of them | a wrong factor, a wrong order, a dead cap |
| **B4** | **THE RUNNING-MATES SUM** — forward (0.5 counts 0.5) · backward (clamped to 0) · sideways (0) · the keeper (dropped) · a sent-off mate (dropped) · the carrier (dropped) · himself (dropped) · an opponent sprinting forward (dropped — the side conjunct is held by the SOURCE pins; the behavioural scene cannot fail on it because `gid` is globally unique, §COMMANDER CORRECTIONS-B 3); and a mate the eyes do NOT hold counts as NO running while the same mate held counts less | every exclusion the law names |
| **B5** | **THE PERCEPT-ONLY READ** — SOURCE: the block's `if` list is exactly nine statements, every new one an identity test; its only inequality is the wall clock; the only `match` members are `dsOwnRun` / `simTime` / `perceivedSnapshot`; the only `.vel` read is `body.vel.x` and the only `.pos` read is `p.pos.x`; `match.ball`, `ball.owner`, `pendingPass`, `info.genome`, `opp.`, `allPlayers` absent. BEHAVIOUR: truth says a mate carries and his eyes say loose ⇒ NO run; truth says loose and his eyes say a mate carries ⇒ the run FIRES | a truth read, in source AND in behaviour |
| **B6** | **THE PULL** — a spy on `perceivedSnapshot` over > 100 unhatted off-ball decisions each: flag absent ⇒ **{0}**; armed ⇒ **{1}**; armed + OBM ⇒ **{2}**; OBM alone ⇒ **{1}**. And the second pull is IDEMPOTENT and rng-free over > 1,000 double pulls | an ungated pull, a shared-snapshot regression, a hidden cost |
| **B7** | **THE STATE GUARD** — no candidate when the perceived ball is loose, an opponent's, his own, or unseen; the carrier himself never carries the literal (structural, measured over > 500 carrier ticks) | M-DS.7 dropped or inverted |
| **B8** | **THE MUTANT WALK** — five mutants APPLIED AT SOURCE in a throwaway tree and each observed to die (below) | each named mutant |
| **B9** | **NARROWED PINS** — listed positively below | the DF-T0 §P7 form |

**THE MUTANT WALK, OBSERVED (not predicted).** Each mutant was applied to its own copy of the
tree under `/tmp/ds-t0b-mut` and the whole file re-run:

| mutant | outcome | killed by |
| --- | --- | --- |
| **M5** the restraint dropped (`s = W.runScore · prior`) | **7 pins RED** | G-BORN′ exact (`count` runners ⇒ 0; more than count ⇒ 0), the live walk, the running-mates scenes, the score-shape source pin |
| **M6** `count` re-typed with a literal `2` | **5 pins RED** | the score-shape source pin (the `restraint` expression names `runnerCount(`), the exact-zero scene, the live walk, two meta pins — ⚠ NOT the code-move source pin, which stays green under this mutant (§COMMANDER CORRECTIONS-B 5) |
| **M7** the guard reading `match.ball.owner` instead of the snapshot | **11 pins RED** | the source pins (the `if` list AND the `match`-member list) and BOTH behavioural scenes, plus all four state-guard scenes |
| **M8** the running-mates sum including himself | **4 pins RED** | the hand-built scene in which HE is the one flying forward, the `if`-list source pin, the mixed scene |
| **M9** the pull hoisted OUT of the gate (unconditional) | **3 pins RED** | the PULL COUNTER and the `match`-member source pin |

⚠ **M9 IS THE HONEST ONE: G-OFF DID NOT CATCH IT.** The dispatch expected G-OFF to kill the
unconditional pull. It does not — measured — because the pull is IDEMPOTENT and draws no rng,
so hoisting it changes no world. What kills it is the pull counter (B6) and the source pin.
The claim "the pull is gated" therefore rests on B6, not on identity, and the doc says so.

**NARROWS OF RECORD (every one listed, all POSITIVE):**

(a) **G-BORN moves world.** DS-T0's exact-score walk ran in the BARE world; the amended law
reads a percept, and the bare world has no percept trunk, so the walk moves to world 13 (DS-T1's
own control substrate) and the bare world gains its OWN pin: with the flag ARMED in the bare
world the seventh literal NEVER appears and every outfield body's snapshot is null (> 1,000
observations). Narrower, and it states the reach change instead of hiding it.
(b) **The `if`-list pin grows from three statements to nine**, enumerated exactly, with the
new assertion that every added statement is an identity test and the inequality set is
unchanged.
(c) **The banned-token list loses `'perceived'` and gains `match.ball`, `ball.owner`,
`allPlayers`** — plus a POSITIVE assertion (the exact `match`-member set, the exact `.vel` and
`.pos` reads, the exact `mate.` and `body.` field sets), which is strictly stronger than the
token ban it replaces.
(d) **The score-shape pin** now asserts the four-factor statement `let s = W.runScore * prior *
restraint;` and the restraint's own expression, where it asserted a two-factor one.
(e) **The seed band**: G-OFF's digests are re-recorded at the dispatch head on
900,006,400–411; DS-T0's own pins keep DS-T0's consumed band untouched.
**No existing pin was loosened or deleted; every DS-T0 pin not listed above is byte-identical.**

## §GATES-B and the RUN OF RECORD

| gate | predicate | result |
| --- | --- | --- |
| **G-OFF′** | the five recorded HEAD digests reproduce (bare · 12 · 13 · 14 · 15); ABSENT ≡ EXPLICITLY FALSE | ✅ |
| **G-FP** | `npm run fingerprint` prints `57b0bdab…c673` | ✅ (printed, `seed=1337 seasons=2 matches=142`) |
| **G-BORN′** | the exact score on hand-built scenes and on the live walk | ✅ |
| **G-COUNT** | the code-move is byte-identical and the grid agrees | ✅ |
| **G-PERCEPT** | source AND behaviour: the fork reads the snapshot, never the truth | ✅ |
| **G-PULL** | 0 · 1 · 1 · 2, and the second pull idempotent and rng-free | ✅ |
| **G-MUTANT** | five mutants applied at source, each observed to die | ✅ |
| **G-SUITE** | FULL `npm test` green + `tsc --noEmit` clean | ✅ (below) |
| **G-FILES** | `git diff --stat HEAD` over `src/sim src/game src/ui src/render src/evolution scripts src/ai/actionExecutor.ts src/ai/offballEyes.ts src/ai/perceptionSnapshot.ts src/ai/perception.ts` is EMPTY | ✅ |

`npm test` = **2,256 tests, 2,255 passed** on the full run, with the ONE known load-dependent
wall-clock flake timing out (`tests/formationEvolution.test.ts`, the #196.2 family) —
**re-run alone immediately after, with `careers` and `simRunner` beside it: 17/17 green,
148 s**. `tsc --noEmit` clean. The seam's own file: **61/61 green, ~53 s**.

**SEED LEDGER (this slice).** `900,006,400 – 900,006,411` — G-OFF's re-recorded digests (bare ·
13 · 15 at twelve seeds, 12 · 14 at the first four); `900,006,440 – 900,006,470` — the
hand-built scenes, the pull counters and the mutant scenes. Verifier band `900,006,500–599`
reserved (ruling #407 item 5(vii)). **Frontier: ZERO consumption — next sim ≥ 12,555,000,
untouched.**

## §DEVIATIONS-B (declared by the executor; the commander disposes)

1. ⚠⚠ **THE SHARED SNAPSHOT WAS NOT BUILT — THE SECOND PULL IS THE FORM, AND IT WAS FORCED.**
   Ruling #407 item 5(iii) asks for one snapshot read once and shared with the OBM seat. The
   only way to hand it in is to change `obmOffballPolicy`'s signature, and ruling #407 item
   5(vi) puts `src/ai/offballEyes.ts` outside this stage's file list. The dispatch's own
   alternative — "the call left as is with a documented second pull — choose the form that
   keeps the OBM seat's OWN pins green" — was the form taken — ⛔ NOT the only lawful one: the shared snapshot was reachable WITHOUT touching
   `offballEyes.ts` by composing its exported `obmFeatures` and `obmPolicyOf` at PlayerBrain's own call
   site (§COMMANDER CORRECTIONS-B 1); the second-pull form is KEPT by ruling #408 — and it is what was
   built. Evidence that it is cheap and safe: the second pull is IDEMPOTENT (4,000 double
   pulls on the executor's bench walk, zero differing snapshots; the permanent pin re-proves it
   over > 1,000) and draws NO rng, and the seat's own arithmetic, signature and pins are
   byte-untouched. The counts are pinned at 0 · 1 · 1 · 2.
2. ⚠⚠ **THE OWN RUN NOW REQUIRES THE PERCEPT TRUNK, AND THE BARE WORLD LOSES IT.** Not stated
   in the dispatch and material: `refreshPerception` is gated on
   `edsPerceivedDefence || edsPerceivedChoice || stationEye`, so in a world with none of them
   `perceivedSnapshot` returns null and the candidate is never pushed at all. DS-T1's arms
   (E13 / world 13, and every A4-family world) arm the trunk, so the exam is unaffected — but
   the reach is genuinely narrower than DS-T0's and it is pinned POSITIVELY rather than left
   to be discovered as a silent zero.
3. ⚠ **THE DISPATCH'S SENTENCE ABOUT `ObservedPlayer` IS WRONG.** The brief says the observed
   body "carries gid, side, pos, vel, bodyDir, sentOff, observedTick, ageTicks". It carries no
   `sentOff` field (`src/ai/perceptionSnapshot.ts`, the `ObservedPlayer` interface); the trunk
   DELETES sent-off bodies from perception memory instead (`reconstructBodyMemory` and the
   scan path both `memory.players.delete(entity.gid)` for `entity.sentOff`). The law's "not
   sent off" conjunct is therefore taken off the ROSTER by gid, beside the role — declared as
   shared knowledge (the referee showed a card) and pinned by a hand-built scene in which a
   sent-off mate sprinting forward contributes nothing. Belt and braces, and the sentence is
   corrected here rather than smoothed.
4. **The evaluation ORDER of the score is DS-T0's, written out.** The formula in the ruling
   reads `W.runScore · prior · restraint · obmRunMul · (tired ? … )`; the code keeps DS-T0's
   own statement order (`(W.runScore · prior) · restraint`, then `tired`, then `obmRunMul`) so
   that the no-running-mates case is EXACTLY DS-T0's number in IEEE-754 and the tired limb
   stays where the shipped licensed run puts it. The product is the same product; the order is
   stated because floating-point order is a fact, not a detail.
5. **The count's parameters are named `mode` / `tempo` / `urgency`.** A function taking `team`
   would have carried the expression with zero transformation, but it would not have been a
   pure function of the three fields the ruling names. The transformation is therefore the
   receiver-prefix strip, applied mechanically to BOTH sides of the source pin, with the
   pre-move expression recorded as a literal (the digest idiom).
6. **`worlds 12 and 14` moved from an out-of-suite receipt into the suite.** DS-T0 recorded
   them in prose; DS-T0b pins them at four seeds each, which is what the wall clock affords.

---

## §COMMANDER CORRECTIONS (ruling #406 — the seam BANKED-DORMANT; verifier PASS, zero HIGH; five MEDIUM and six LOW disposed; the seam's bytes UNCHANGED)

The independent verifier reproduced the OFF identity on its own seeds in five worlds with the rng
stream inside the hash, recomputed the prior by hand on 1,124 live candidates with zero mismatches in
both seat states, steered 6,119 armed unhatted runs to `runTarget` exactly with the executor byte-
untouched, applied all four mutants at source and watched each die, checked all 37 contract numbers
against the artifact and the VISION quote character for character. Verdict **PASS**.

1. **MEDIUM — NARROW (c) WAS CLAIMED, NOT MEASURED, AND THE CENSUS'S EXTRACTOR DISAGREES.** DS-C0's
   classifier (nearest enclosing `if` at smaller indentation; `hatGuarded` = a designation field in
   the guard text) computes FALSE for the new push, whose guard names the locals `hatted` /
   `wallLive`. The banked artifact is frozen and unharmed; the INSTRUMENT would flip. DISPOSED: the
   sentence corrected in place; DS-T1's instrument gains a `flagGated` class (the flag named) and
   restates the shipped-path boolean over the pushes reachable with both flags absent — declared here,
   before the exam is frozen. No src change (the guard's form is the law's).
2. **MEDIUM — "UNTOUCHED" WAS SOURCE-TRUE AND BEHAVIOURALLY INCOMPLETE FOR 套边, 二过一 AND THE CROSS
   FLIGHT.** The overlap pick reads `team.runners` / `team.arriver` (an empty board widens its
   candidates), the cross-flight snapshot copies the board (unarmed on these worlds), and the wall run
   moves downstream. The VERIFIER's own measurement (four matches per arm, its own seeds): overlapper-
   set ticks 321 → 543, live-`wallRun` ticks 7,807 → 10,849 — the verifier's evidence, not this stage's
   face. DISPOSED: §HONESTY 6 and the contract's §4 say so; DS-T1 publishes the overlap sets and the
   wall-pass fires on every arm. The commander's decision: OWN RUN ALONE is measured AS IT IS — a 前插
   subtraction whose coupling is published — not re-lawed to freeze the overlap's eligibility.
3. **MEDIUM — THE OWN RUN IS LICENSED WHERE THE SHIPPED LICENCE IS NOT** (ball in flight between mates;
   the side's own restart). The verifier's walk: the seventh candidate wins the argmax 3,290 times in
   restarts and 18,595 times on loose balls over two matches. Inside the ruling's literal law and by
   design; DISPOSED: §HONESTY 8 states it; DS-T1 publishes runs and yield PER STATE and the offsides
   FLAG guard watches the restart case.
4. **MEDIUM — G-BORN'S TIRED ARM IS VACUOUS**: no body reaches `stamina < 0.4` inside a match at
   either duration the verifier tried (minimum 0.590958 at 900 s), so the `OFFBALL_TIRED_MUL` limb —
   and its ordering before `obmRunMul` — carries no pin with teeth. Inherited (the shipped licensed run
   has the same unexercised limb); noted, not fixed.
5. **MEDIUM — "NOT PUSHED" DID NOT HOLD.** The executor never pushed; the COMMANDER did: a CI commit
   (the Pages `paths-ignore`) was made on top of the unverified seam commit and pushed, carrying
   `e581df5` to `origin/main` before the verifier's verdict. Nothing shipped moved — both flags dormant,
   the fingerprint unchanged, the OFF world byte-identical (the verifier's own digests) — but the
   record says so here. PROCESS RULE from this: before any push, `git log origin/main..HEAD` is READ and
   every commit not the commander's own is named; a push carries the whole range.
6. **LOW — the read set omitted `match.simTime` and `p.index`**; added above the list.
7. **LOW ×5, accepted**: the 45 exists twice (a declared code-move with a drift pin in both
   directions, §DEVIATIONS 3); the flake set is load-dependent (`formationEvolution` ·
   `simRunner` · `careers` have each timed out under contention and passed alone — no fixed pair is
   named); the out-of-suite world-12/14 digests live on the executor's band (the verifier proved the
   same property on its own); prior = 1 is reachable only in principle (observed max 0.868303; 194 of
   1,124 candidates exactly 0 — the DF lower-clamp bite is COMMON, not a corner: §LAW's corrected
   sentence is load-bearing); the contract has no §5 by the house form.
8. **RATIFIED**: §DEVIATIONS 1 (the dispatch's clamp sentence was WRONG — the lower arm bites for a DF
   deeper than 18 m into his own half, every match, because the coach's own ranking is negative there;
   the executor corrected the sentence and did not smooth the law; the football is intended: a deep
   defender prices his own run at nothing), 2 (the re-indent), 3 (`RUN_DEPTH_DIV` given a home), 4
   (`desiredVel` not `target`), 5 (the coach's cadence).

## §COMMANDER CORRECTIONS-B (ruling #408 — DS-T0b BANKED-DORMANT; verifier PASS, zero HIGH; three MEDIUM and three LOW disposed; the seam's bytes UNCHANGED; two test TITLES corrected)

The independent verifier recorded its own OFF digests at the dispatch head and reproduced them at the
commit in three worlds with the rng draw in the hash; instrumented `perceivedSnapshot` in a worktree
and found zero pulls attributable to the fork with the flags absent (and the declared second pull only
when both the seat and the flag are armed); recomputed the prior and the restraint by hand on its own
scenes (exact, no epsilon); built the truth-vs-eyes disagreement both ways and watched the run follow
the eyes; evaluated `runnerCount` on 250 grid cells against the recorded expression; killed all five
mutants at source with the executor's exact counts and added a sixth. Verdict **PASS**.

1. **MEDIUM — THE "ONLY LAWFUL FORM" JUSTIFICATION WAS FALSE.** The shared snapshot ruling #407 item
   5(iii) asked for was reachable without editing `offballEyes.ts`: `obmFeatures` and `obmPolicyOf`
   are exported and `obmOffballPolicy` is their composition. The second-pull form that was built is
   the dispatch's own permitted alternative and is measured idempotent and rng-free (8,580 double
   pulls, zero differing snapshots, zero rng movement — the verifier's count), and the OBM pull is
   structurally FIRST at its call site so the seat's input cannot be reached. RULED: the second-pull
   form is KEPT (a re-cut buys nothing but a byte diff); the justification is struck in place and the
   option recorded for a later slice.
2. **MEDIUM — THE M9 PIN'S TITLE claimed "killed by G-OFF"** while the stage itself measured that
   G-OFF does NOT catch a hoisted pull (idempotent, rng-free ⇒ no world changes); the pull COUNTER
   kills it. The title corrected to what the pin proves; the doc and the commit already said so.
3. **MEDIUM — THE OPPONENT SCENE'S DISCRIMINATOR IS INERT**: `gid` is globally unique
   (`Player.ts`: `gid = side · TEAM_SIZE + index`), so once `body.gid === mate.gid` the side conjunct
   can never be false; the verifier's sixth mutant (the side conjunct deleted) dies only to the source
   pins. The conjunct is correct belt-and-braces; the title and §PINS-B B4 corrected to say the source
   pins hold it.
4. **LOW — the `[0, 4]` bound's one-line justification skipped the overlap case** (6 − 3 = 3 for an
   outfield carrier; 4 only when the perceived carrier is the keeper). Stated in place; the bound stands.
5. **LOW — §PINS-B's M6 row named the wrong killer** (the code-move source pin stays green under a
   re-typed `count` at the PlayerBrain call site; the score-shape pin, the exact-zero scene, the live
   walk and two meta pins die — 5, as claimed). Corrected.
6. **LOW — the seam file's wall clock** ("~53 s") is optimistic (the verifier: 76–86 s). Noted.
7. **RATIFIED**: §DEVIATIONS-B 1 (the form, as ruled above), 2 (⚠⚠ THE OWN RUN NOW NEEDS EYES —
   `refreshPerception` is gated on the percept trunk, so the bare world loses the candidate entirely;
   pinned positively; every exam substrate arms the trunk), 3 (⚠ THE DISPATCH'S SENTENCE WAS WRONG —
   `ObservedPlayer` carries no `sentOff`; the trunk deletes sent-off bodies from memory; the conjunct
   is a declared ROSTER read; the commander's error, corrected at source not smoothed), 4 (the
   evaluation order stated — floating-point order is a fact), 5 (the receiver-prefix strip, both sides),
   6 (worlds 12 and 14 into the suite). THE HONEST FINDING OF RECORD: G-OFF cannot see an ungated
   idempotent pull; the gating claim rests on the counter (B6) — a form lesson for every percept-reading
   seam.
