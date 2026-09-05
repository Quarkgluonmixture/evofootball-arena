# LN-ENTRY-RUNG — `?a4world=14` 看见自己人 (the own-lane world: 传球者的每套定价都看得见线上的队友)

> Authorized by **COMMANDER RULING #396 item 4** (the dispatch), on **#396 item 2** (the read of
> record, LN-T1′b banked, 26/26 gates green) and **#396 item 1** (the user's world-13 verdict
> 「缓冲留球 (v13) — keep — 仍然有砸队友身上反弹的情况出现」 — the KEEP that makes world 13 the
> substrate this world is cut on, and whose second half is exactly the face this world targets).
> The law is the LN contract ([`LN-OWN-LANE-CONTRACT.md`](LN-OWN-LANE-CONTRACT.md) §2 M-LN.1 /
> M-LN.2); the seam is **LN-T0** ([`LN-T0-OWN-LANE-PRICE.md`](LN-T0-OWN-LANE-PRICE.md)); the exam
> of record is **LN-T1′b** ([`LN-T1PB-OWN-LANE-EXAM-RERUN.md`](LN-T1PB-OWN-LANE-EXAM-RERUN.md),
> artifact [`data/ln-t1pb-own-lane-exam.json`](data/ln-t1pb-own-lane-exam.json)).
> **LINEAGE**: LN-C0 → LN-T1 → LN-C1 → LN-C2 → LN-C3 → LN-T0 (the law) → LN-T1′ → LN-T1′b (the
> exam, re-walked) → **this rung**.
> The FOURTEENTH entry of the play-test family (#155 → #167.5 → #184.2 → #211.3 → #269.4 →
> #282.4 → #300.6 → #309.5 → #337.5 → #365 → #386 → here).
> Pin suite: [`tests/lnPlaytestEntry.test.ts`](../../tests/lnPlaytestEntry.test.ts).
> ⛔ **Nothing ships to the default world**; the production fingerprint is unchanged; **the
> play-test verdict is the USER GATE** (watchability has no instrument — the standing law).
> ⭐ **The user's world-13 gate closed as KEEP and a world-14 gate opens beside it** —
> `?a4world=13` still plays world 13 byte for byte, so 13 can be compared against 14 on the same
> device.

## §1 THE BUNDLE (fidelity: the exam's own W025 composition, CALLED)

`a4MatchFlags(14) = { ...a4MatchFlags(13), ...LN_WORLD_DOORS }` — world 13 (the cushion world)
plus **exactly ONE door** and **exactly ONE pin**, the door and the dose LN-T1′b's **W025** arm
carried:

| # | limb | value | source |
| --- | --- | --- | --- |
| 1 | the whole world-13 substrate | `a4MatchFlags(13)` — **CALLED, not copied** (which calls `(12)` → `(11)` → `(10)` → `(9)` → `(8)` → `(7)` → `(6)` → `(3)`) | the #386 entry's own composition line |
| 2 | ⭐ the own-lane door | `lnOwnLanePrice` = true | LN-T0 §1 (the ONE seat, hoisted in `PlayerBrain`); LN-T1′b's `arms[].lnOwnLanePrice` on every armed arm |
| 3 | ⭐⭐ the pin | `lnOwnLaneWeight` = **0.25** = `LN_WORLD_WEIGHT`, written on `baseGenome` AND `effGenome` of BOTH sides, **never `info.genome`** | LN-T1′b arm **W025** (`arms[].lnOwnLaneWeight` = 0.25) — the read's SMALLEST QUALIFYING DOSE; the `setRaGenes` / `RA_WORLD_LEAD` idiom |
| 4 | the L3 dose · the PC dose | world 8's, inherited whole (`?pcdose=0` unchanged) | world 13, unchanged |
| 5 | the eye · evolution opt-ins | **null** · **OFF** (no `evolve*` opt-in exists for this gene) | world 6 / #165.2.ii, unchanged |

⭐⭐ **THE CONTAINMENT CALL IS THE WHOLE DESIGN**, the family idiom quoted from the shipped
comment: *"the two entries can never drift into two substrates"*. `armLnWorld(match, l3Dose,
pcDose)` is `armBqWorld(match, l3Dose, pcDose)` CALLED plus `setLnGene` on both sides, so world
12's two exam pins (`passLeadSupport = 1`, `raAccessWeight = 1`) and world 11's
`dvExposureWeight = 0.5` arrive by the call and world 14 writes exactly **one** value of its own
— pinned.

⭐⭐⭐ **AND THE EXAM'S OWN CONSTRUCTION IS THE ENTRY'S ARMING, PROVEN BY DIGEST.** LN-T1′b built
its W025 arm as `a4MatchFlags(13)` + the `lnOwnLanePrice` config flag + `armA4World(m, null, 13)`
+ the gene 0.25 on `baseGenome`/`effGenome` of both teams (`scripts/probes/ln-t1pb-own-lane-exam.ts`,
`buildMatch` + `setLnWeight`). The pin suite builds **both** ways on the same seed and compares
WHOLE-MATCH signatures (rng state included) at construction AND at full time, on **six** scratch
seeds: **IDENTICAL**. The play world and the exam are one construction.

⛔ **WHAT IS NOT IN WORLD 14, AND WHY** (#396 item 4(i)): `obmMovement` (the OBM corner is its own
arc), `ctbSupportPlane` (the CTB plane likewise), `rcAnticipate` / `rcReady` (RC did not form —
banked dormant and HELD), `bfFacingCost` (BF's goals lean is unexplained; BF's entry is its own
question), `edsTouchCost` (never in this arc). ONE door and ONE pin, because **the user's 13-vs-14
comparison must be clean**. Test-pinned six keys, absent from world 14 and from every world below.

⚠ **WORKER-SIMMED fixtures play the SHIPPED world** (canon, home ruling #283.2(iv), VERBATIM:
*"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since
#155, stated now, test-pinned; refines #270's E4 correction; matches the perf diagnostic)"*).
⇒ **A watched world-14 match is the armed world; the league's background fixtures are not.**
Test-pinned here.

## §2 THE HONEST BRIEF (each blurb sentence beside the LN-T1′b FIELD it quotes)

Canon (home: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4, VERBATIM): *"a stage
doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"*. Every number
in the blurbs is a LN-T1′b field at 6 dp, read off
[`data/ln-t1pb-own-lane-exam.json`](data/ln-t1pb-own-lane-exam.json). ⚠ THE EFFECT OF RECORD is
**E13's W025 row** — the EMPTY-BOOK book at `w = 0.25`, the dose this entry pins — against the
E13 **ABSENT** control.

### (a) WHAT IT DOES

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 传出去先撞到非目标队友的比率 **0.102798 → 0.058788** | `firstBody.ownNonTarget` (Δ −0.044011 [−0.053358, −0.035266], RESOLVED down, 0 LOO flips) | **ABSENT → W025** |
| 开球那一脚回敲撞到自己人的比率 **0.575499 → 0.189112** | `family.KICKOFF-PLAYBACK.caromRate` (Δ −0.386387 [−0.460015, −0.313814], RESOLVED down) | **ABSENT → W025** |

### (b) THE COST, SAID FIRST

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 每场传球 **74.579710 → 71.246377** | `context.groundPassesPerMatch` (Δ −3.333333 [−6.753623, −0.072464], RESOLVED down) | **ABSENT → W025** |
| 平均传球距离 **14.492657 → 14.347704** m(区间含零) | `context.meanPassDistanceMetres` (Δ −0.144953 [−0.416829, +0.126793], **CONTAINS ZERO**) | **ABSENT → W025** |
| 传球成功率 **0.592215**,升了 **0.023227**(区间不含零) | `context.passCompletion` (Δ +0.023227 [+0.005546, +0.041504], RESOLVED up — guard G2) | **ABSENT → W025** |
| 被断球每场 **27.173913**,降了 **2.565217** | `guard.interceptionsPerMatch` (Δ −2.565217 [−4.101449, −0.971014], RESOLVED down — guard G3) | **ABSENT → W025** |
| 越位、进球、射门三格的区间都含零 | `guard.offsidesPerMatch` (Δ −0.289855 [−0.739130, +0.173913]) · `context.goalsPerMatch` (Δ −0.072464 [−0.652174, +0.536232]) · `context.shotsPerMatch` (Δ +0.884058 [−0.115942, +1.913043]) — **all CONTAIN ZERO** | **ABSENT → W025** |

⚠ **THE FIELD NAME IS `context.groundPassesPerMatch`.** The dispatch wrote it
`context.passesPerMatch`; the artifact's field is `context.groundPassesPerMatch` and its values
are exactly the dispatch's two numbers. The FIELD's own name is quoted here and in the code
comments (canon *unit-name truth*); declared at §DEVIATIONS 1.

### (c) THE PLAYED FORM'S RECEIPT — measured at `w = 0.5`, not at 0.25

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 成熟账本上这扇门只在 **w = 0.5** 那一档量过 —— **0.089528 → 0.040022** | `firstBody.ownNonTarget` (Δ −0.049506 [−0.058276, −0.041392], RESOLVED down) | **D13-ABSENT → D13-W050** |

⛔ **THE PLAYED FORM'S NUMBER AT 0.25 DOES NOT EXIST.** The dosed (mature-book) ladder was walked
at 0.5 only. The blurbs say so in the same sentence that quotes it — 「这里钉的是 0.25,所以你这一
档的数字是推断,不是测量」 — and the pin suite proves the `w = 0.5` label never separates from the
number.

### (d) THE FIRST-LOOK DISCLOSURE — what NOT to expect

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 传到对面身上(**0.321803** 的传球是对手先碰到)不是这扇门的事 | `firstBody.opponent` (control; Δ at W025 −0.004472, CONTAINS ZERO) | **ABSENT** |
| 有人挤人也不是 | `crowd.crashShare` — the crowding class, not this door's | **ABSENT** |
| 接球人自己那一下的走形是 v13 修的(你已经 keep) | BQ-ENTRY §2 — world 13's own door, ACCEPTED at #396 item 1 | — |

⛔ **NOTHING IN THE BLURBS PROMISES A NUMBER THE EXAM DID NOT MEASURE**, and the pin suite reads
the actual UI strings to prove each arm's number stands under its OWN heading (the #387 item 1
class, deliberately guarded).

## §3 THE SURFACES

| file | what |
| --- | --- |
| `src/game/a4World.ts` | `LN_WORLD_VERSION = 14` · `LN_WORLD_DOORS` · `LN_WORLD_WEIGHT = 0.25` · `isLnWorld` · `setLnGene` (the `setRaGenes` idiom) · `armLnWorld` (= `armBqWorld` CALLED + the pin) · `lnArmedVersion` (containment: 14 ⊃ 13) · `a4MatchFlags(14)` (world 13's composition CALLED) · `armA4World` routes 14 · `A4WorldVersion`/`A4ArmedVersion` gain 14 · the URL/sticky parse accepts `14`, the bound moves to `15` · the docblock's launch list |
| `src/game/GameApp.ts` | the armed-match guard and the pc-stack dose predicate include world 14 by the SAME single containment predicate world 13 extended · the feed blurb (BOTH dose forms) · the status line |
| `src/ui/A4WorldBadge.ts` | `A4_BADGE_TEXT_LN` (+ `_EMPTY`) · both tables keyed at 14 |
| `src/ui/SettingsScreen.ts` | the world-14 checkbox (mutually exclusive with every other world — one value) + the long honest blurb |
| `tests/lnPlaytestEntry.test.ts` | the pin suite (new) |
| narrows (this ruling) | listed in §THE NARROWED PINS below |

⭐ **THE DEFAULT LANDING WORLD IS UNCHANGED — BEFORE `0`, AFTER `0`** (the shipped game). World 14
is reached only by an explicit `?a4world=14` or an explicit tick in ⚙ → 🧬 Experimental.

⭐ **THE SURFACES ARE EXACTLY THE FOUR WORLD 13'S ENTRY TOUCHED, PLUS THE PIN SUITE** — no fifth
src file, and **ZERO files under `src/sim`, `src/ai`, `src/evolution` or `scripts/`**
(`git diff --stat HEAD -- src/sim src/ai src/evolution scripts` EMPTY before the commit). The
engine is byte-untouched, so the OFF world cannot have moved (the structural argument; the
digests below are the measurement).

## §4 WHAT THE USER'S EYES ARE FOR — HOW-TO-SEE (BINDING)

**How to switch it on** (the A4-PLAYTEST §2 form).

* Computer: ⚙ → 🧬 Experimental → tick **「看见自己人 · 传球者的每套定价都看得见线上的队友 (play-test)」**.
  The current match restarts immediately in that world — same fixture, same seed, rebuilt.
* Phone: open the game with **`?a4world=14`** on the end of the URL. It sticks, so the link only
  has to be opened once. **`?a4world=13`** goes back to the cushion world WITHOUT the own-lane
  price (the A/B this gate is really about); **`?a4world=0`** puts the shipped game back.
* **`?a4world=14&pcdose=0`** is world 8's own contrast, inherited unchanged: everyone a novice.
  ⭐ That EMPTY-BOOK form is the one the exam actually measured at this dose.
* **The chip in the corner is the GROUND TRUTH**: 🧪 `看见自己人 · 剂量成熟` (default) ·
  🧪 `看见自己人 · 空账本(全新手)`. **If the chip is not there, you are not in this world.**
* ⚠ **What you are watching is the ONE match on screen** (canon #283.2(iv), §1).

**WHAT TO WATCH — three sentences, in plain football language.**
⭐ **开球那一脚回敲 —— 还会不会砸在队友背上?** That is the family the exam moved furthest:
`family.KICKOFF-PLAYBACK.caromRate` 0.575499 → 0.189112.
⭐ **人多的地方传球 —— 他现在是不是挑那条没自己人的线?** That is the whole mechanism: the passer's
pricers can finally see his own men on the line.
⭐ **代价 —— 他是不是多拿了一拍、或者传得更短?** 74.579710 → 71.246377 passes a match, and
14.492657 → 14.347704 m of mean distance (that second one's interval contains zero).

**WHAT NOT TO EXPECT.**
* ⛔ **Passes struck at OPPONENTS** (「传到对面身上」) — `firstBody.opponent` 0.321803 of measured
  ground passes, and NOT this door's business.
* ⛔ **The crowding** (「有人挤人」) — a different class entirely.
* ⛔ **The receiver's own bobble** — that is world 13's door, which you already KEPT.
* ⛔ Anything about whether the world plays BETTER. Nothing here claims that.

**HOW TO COMPARE.** Same device, same sitting: open `?a4world=13`, watch a match, then
`?a4world=14` and watch another. Switching restarts the CURRENT fixture (same seed, rebuilt), so
you never wait a match to see the other world. The chip tells you which one you are in.

**THE VERDICT FORMAT** (A4-PLAYTEST §4), one line:

```
看见自己人 (v14) — keep | change | revert — <one sentence in plain football language>
```

## §IDENTITY — the shipped world, and every world below 14, byte-identical

**Definition, one source**: each walk builds a league at the ENGINE DEFAULT clock
(`new League({ seed })`, never overridden), takes its first fixture, constructs the match with
`a4MatchFlags(v)` (or none for production), arms with `armA4World(match, null, v, l3Dose,
pcDose)` — the SHIPPED composer — calls `runToCompletion()`, and hashes the match signature (the
`signature()` helper of [`../../tests/lnPlaytestEntry.test.ts`](../../tests/lnPlaytestEntry.test.ts),
field for field the `bqPlaytestEntry` helper, rng state included). A world digest is `sha256` of
its **twelve** per-seed signatures joined by `|`, seeds **900,004,400 – 900,004,411** (scratch,
out of band).

⭐ The baseline column was taken **BEFORE a byte of this rung was written**, in a CLEAN throwaway
worktree at the dispatch HEAD (`git worktree add /tmp/ln-entry-base 7fe1d41`, a symlinked shared
`node_modules`, `git status --short` EMPTY), by a throwaway walker deleted immediately after.

| digest | at `7fe1d41` (baseline) | at this rung | verdict |
| --- | --- | --- | --- |
| production (no world) | `0243b6cee416937692bd3572c6de8035497f15e731af056040c477adf3c54052` | same | ⭐ **IDENTICAL** |
| world 12 | `8d7b51489d5dce56cfa47299b2263dff738b292fcde4d26ff67b8adb6134aa46` | same | ⭐ **IDENTICAL** |
| world 13 | `6455c9f1c59bf285b2d25341c3d40de1f2a80297710aaad5d986e57963ed5370` | same | ⭐ **IDENTICAL** |
| world 14 | — (no such world) | ≠ world 13's | ⭐ **NEW, and non-vacuous** |

* ⭐⭐ **THE CONTAINMENT CALL DID NOT PERTURB WHAT IT CALLS.** `a4MatchFlags(14)` is built by
  calling `a4MatchFlags(13)`, and the bare world, world 12 and world 13 walked to the final tick
  are bit-for-bit what they were before this commit. The three equalities are **RUN in the pin
  suite**, against the literals above.
* ⭐ **NON-VACUOUS**: world 14's digest DIFFERS from world 13's, so the door demonstrably bites in
  the entry's own path — the identity claim is not the claim that nothing happened.
* ⭐ **THE PRODUCTION FINGERPRINT RE-DERIVED UNCHANGED** by the repo's own script
  (`npm run fingerprint`, seed 1337, 2 seasons, 142 matches):
  **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — the fingerprint of
  record, character for character, and the literal in `tests/a4HomeGrant.test.ts`.

## §NO NEW CHUNK — the precache list is unchanged, on two real clean-tree builds

`npm run build` in both clean trees, then `dist/sw.js` parsed for its own `PRECACHE` array:

| | `7fe1d41` | this rung |
| --- | ---: | ---: |
| precache entry count | **19** | **19** |
| entries naming an opt-in chunk (`pc-` / `l3-` / `stage3-`) | **0** | **0** |

The two lists are **entry-for-entry identical once content hashes are stripped** — the same 19
roles, as a SET; ⚠ the only difference is that `assets/index.js` and `assets/index.css` swap
adjacent positions (the list is emitted in the build's own content-hash order, and this rung
changed `index`'s hash). `OPT_IN_CHUNK_PREFIXES` in `scripts/pwaAssets.ts` is
**byte-unchanged** — this rung imports no artifact of its own, because the own-lane price carries
no table at all (one flag, one gene), so there was nothing to precache or exclude. World 14
fetches exactly what world 13 fetches.

## §THE COST FACE — clean-tree builds at named commits

Canon (paraphrase; home PC-ENTRY-RUNG.md §COMMANDER CORRECTIONS item 4): *a build of record runs
on a CLEAN tree at a named commit.* Both sides were built on the same machine, from the same
`node_modules`, with the same `tsc --noEmit && vite build`, each `git status --short` EMPTY,
on 2026-09-06. The gzipped column is vite's own reported figure.

| | main bundle | raw | gzipped |
| --- | --- | ---: | ---: |
| baseline (`7fe1d41`, clean worktree) | `index-qtm9XxyU.js` | **1,440.35 kB** (1,440,351 B) | **430.25 kB** |
| with this rung (`5b6628a`, clean tree) | ``index-1BneeXNZ.js`` | **1,444.92 kB** (1,444,920 B) | **431.88 kB** |
| ⇒ **the every-install cost** | | **+4,569 B = +4.57 kB (+0.3172 %)** | **+1.63 kB (+0.379 %)** |

The deltas are DERIVED from the two byte figures beside them (1,444,920 − 1,440,351 = 4,569;
4,569 ÷ 1,440,351 = 0.3172 %; the gzip delta likewise from 431.88 − 430.25 = 1.63, ÷ 430.25 =
0.379 %) — no third copy.
⭐ **AND THERE IS NO OPT-IN COST AT ALL**: world 14 fetches exactly what world 13 fetches. This
layer adds **no chunk**.

## §THE NARROWED PINS (the DF-T0 §P7 form — stated POSITIVELY, never deleted)

Every hunk of this commit under `tests/` that is not the new suite. Each keeps its substantive
claim and states it in the positive form; **none is deleted**.

| # | file | the old claim | the new claim |
| --- | --- | --- | --- |
| 1 | `a4PlaytestEntry.test.ts` | the armed-match guard literal ends `\|\| isBqWorld(this.a4World))) {` | the SAME single guard, widened by `\|\| isLnWorld(this.a4World)` — still **ONE** guard, now naming world 14 too |
| 2 | `bkPlaytestEntry.test.ts` | the pc-stack predicate ends `\|\| isBqWorld(version);` | the SAME single predicate, widened by `\|\| isLnWorld(version)` |
| 3 | `bkPlaytestEntry.test.ts` | the badge table holds **13** distinct names | it holds **14** |
| 4 | `bkPlaytestEntry.test.ts` | `?a4world=14` → null | `?a4world=14` → **14** (the LN entry) and the bound moves to **15** (`?a4world=15` → null) |
| 5 | `bkPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isLnWorld(this.a4World)` |
| 6 | `bqPlaytestEntry.test.ts` | `?a4world=14` → null | `?a4world=14` → **14**; the bound moves to **15** |
| 7 | `cbPlaytestEntry.test.ts` | `?a4world=14` → null | `?a4world=14` → **14**; the bound moves to **15** |
| 8 | `cbPlaytestEntry.test.ts` | the badge table holds **13** distinct names | it holds **14** |
| 9 | `entriesW10W11.test.ts` | the pc-stack predicate | widened by `\|\| isLnWorld(version)` |
| 10 | `entriesW10W11.test.ts` | the badge table holds **13** distinct names | it holds **14** |
| 11 | `entriesW10W11.test.ts` | the EMPTY dose table holds **6** (worlds 8/9/10/11/12/13) | it holds **7** (…/14) |
| 12 | `entriesW10W11.test.ts` | `?a4world=14` → null | `?a4world=14` → **14**; the bound moves to **15** |
| 13 | `entriesW10W11.test.ts` | the armed-match guard literal | widened by `\|\| isLnWorld(this.a4World)` |
| 14 | `l3PlaytestEntry.test.ts` | `?a4world=14` → null | `?a4world=14` → **14**; the bound moves to **15** |
| 15 | `l3PlaytestEntry.test.ts` | the badge table holds **13** distinct names | it holds **14** |
| 16 | `l3PlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isLnWorld(this.a4World)` |
| 17 | `lnOwnLane.test.ts` | `a4World.ts` contains the strings `lnOwnLanePrice` and `lnOwnLaneWeight` **NOWHERE** | `a4World.ts` names them in world 14's OWN bundle and nowhere else — counts **4** and **3**, with FOUR executable lines enumerated (`LN_WORLD_DOORS`, the `lnArmedVersion` flag read, the `setLnGene` view line, the `lnArmedVersion` gene read); and, stated POSITIVELY, worlds 1–13 carry no `lnOwnLanePrice` while **world 14 carries it** |
| 18 | `lnOwnLane.test.ts` | the src-file allowlist for the flag is the five seam files | it is **six** — the ENTRY LAYER `a4World.ts` is the only new one; the env/bundle prohibitions are UNTOUCHED |
| 19 | `lnOwnLane.test.ts` | the §SEAM MAP per-file set is the five seam files | it is **six**, with `src/game/a4World.ts` added; the seam's own five files are byte-unchanged and every enumerated count below is the dispatch HEAD's |
| 20 | `mtPlaytestEntry.test.ts` | the badge table holds **13** distinct names | it holds **14** |
| 21 | `pcPlaytestEntry.test.ts` | `?a4world=14` → null | `?a4world=14` → **14**; the bound moves to **15** |
| 22 | `pcPlaytestEntry.test.ts` | the badge table holds **13** distinct names | it holds **14** |
| 23 | `pcPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isLnWorld(this.a4World)` |
| 24 | `raPlaytestEntry.test.ts` | `?a4world=14` → null | `?a4world=14` → **14**; the bound moves to **15** |

⭐ **ONE PROHIBITION WAS NOT NARROWED, DELIBERATELY.** `a4PlaytestEntryV2.test.ts` pins that
`src/game/a4World.ts` names neither `mutateGenome` nor `crossoverGenomes` (*"the entry itself
never reaches for a mutation path"*). The first draft of the `setLnGene` docblock named
`crossoverGenomes` in PROSE and turned that pin red; the prose was reworded instead of the pin
being narrowed, because it is a LIVE prohibition and narrowing it would have weakened it for no
gain. Declared at §DEVIATIONS 2.

## §THE PIN SUITE

[`tests/lnPlaytestEntry.test.ts`](../../tests/lnPlaytestEntry.test.ts), green from birth. The pin
COUNT derives from the suite itself (`npx vitest run tests/lnPlaytestEntry.test.ts` prints it); it
is not typed here as a second copy (canon: *"a gate's NOTE derives from the same pinned values the
gate checks; a count typed beside its pin is a second copy"* — home
PT-C0-PLAYTEST-FORENSIC-CENSUS.md §COMMANDER CORRECTIONS item 1). What it pins: FIDELITY key for
key · ⛔ the six doors that do NOT ride along, absent from world 14 and from every world below ·
the composition CALLED and the arming CALLED · the ONE pin on `baseGenome` AND `effGenome` of both
sides at construction AND at full time, with `info.genome` carrying no such key (canon dose
placement) · ⭐⭐⭐ THE EXAM'S W025 CONSTRUCTION reproduced by the entry's arming, whole-match
signatures on six scratch seeds · containment (14 names itself 14, 13 stays 13, 12 stays 12, and
the SOURCE ORDER) · the URL parse and the bound · the badge in both dose forms and the chip mount ·
the honest brief's field values as 6-dp strings in the surface that claims each, with the
empty-book vs mature ATTRIBUTION pinned (the `w = 0.5` receipt never separates from its label) ·
the entry doc and its rulings · dormancy 1–13 and world 14 positively · a plain League match · the
worker's shipped world · THE MUTANT WALK (four mutants, at runtime) · the three IDENTITY digests
and the non-vacuity · the fingerprint literal.

## §HONEST LIMITS

* ⚠⚠ **THE FORM THE USER PLAYS WAS MEASURED AT `w = 0.5`, NOT AT THE 0.25 PINNED HERE.** The
  mature-book ladder has exactly one armed rung: D13-W050 (`firstBody.ownNonTarget` 0.089528 →
  0.040022). The default world-14 match runs the MATURE books at 0.25 — a composition the exam
  never walked. The blurbs say the words 「推断,不是测量」 and the pin suite reads them.
* ⚠ **THE CURRENCY MIX AT THE PERCEIVED CHOOSER.** The own-lane price is applied at three
  pricers whose score units are not one currency; 0.25 is 「score units」 at the lane argmax and
  a factor at the perceived chooser (LN-T0 §HONEST LIMITS / LN-OWN-LANE-CONTRACT.md §4). The
  dose therefore does NOT mean the same size of penalty at all three sites.
* ⚠ **THE SHELL DOUBLE-CHARGE.** The shipped lane argmax already carries a 0.635 m BINARY own-body
  shell; the graded read is added BESIDE it, so a body inside that shell is charged twice — once
  by the old shell, once by the new price. LN-T0 declared it; nothing in this entry removes it.
* ⚠ **THE WORLD PLAYS FEWER AND SHORTER PASSES.** `context.groundPassesPerMatch` 74.579710 →
  71.246377 (resolved down) and `context.meanPassDistanceMetres` 14.492657 → 14.347704 m (contains
  zero). That is a style shift, stated as measured; whether it is watchable is the gate's question.
* ⚠ **ONE WORLD, ONE COMPOSITION.** World 14 has never been played against anything but world 13,
  and the exam's arms were EMPTY-BOOK. The dosed default at 0.25 is this entry's first look.
* ⚠ **THE PIN IS PRESENTATION, NOT A WORLD-MODEL CLAIM** (`LN_WORLD_WEIGHT` = 0.25, the
  `RA_WORLD_WEIGHT` idiom): 0.25 is the SMALLEST QUALIFYING dose of the read, chosen as the play
  form. Nothing here claims selection would pick it; no `evolve*` opt-in exists for the gene.
* ⚠ **THE DEFAULT WORLD IS UNCHANGED** and every world below 14 is byte-identical; the fingerprint
  is unchanged; the league's background fixtures play the shipped world.

## §CHECKS

| check | result |
| --- | --- |
| `npm run typecheck` (`tsc --noEmit`) | **CLEAN** |
| `npx vitest run tests/lnPlaytestEntry.test.ts` | **GREEN** (the pin count, derived from the suite's own run) |
| the FULL suite (`npx vitest run`, at this tree) | **2,138 passed / 0 failed / 2,138 total, 166 files, 323.79 s** |
| `npm run fingerprint` | **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — UNCHANGED, character for character |
| IDENTITY digests (bare · world 12 · world 13) | **RUN in the suite against the `7fe1d41` literals — all three IDENTICAL**; world 14 ≠ world 13 (non-vacuous) |
| the exam's W025 construction vs the entry's arming | **IDENTICAL whole-match signatures on 6 scratch seeds**, at construction and at full time |
| `npm run build` × 2, clean trees at named commits | **precache 19 → 19, role lists entry-for-entry IDENTICAL once content hashes are stripped**; bundle delta at §THE COST FACE |
| `git diff --stat HEAD -- src/sim src/ai src/evolution scripts` | **EMPTY** — the engine is byte-untouched |
| `git status --porcelain` at the commit | only this rung's 16 files |

⚠ **A DECLARED PROCESS NOTE ON THE COST FACE.** The entry-side build of record ran on a CLEAN
tree at commit `5b6628a` (`git status --short` EMPTY in a throwaway worktree, `dist/` ignored).
This doc's §THE COST FACE and §NO NEW CHUNK tables were then filled in with the measured figures
and the commit AMENDED (ONE commit, as dispatched), so the final commit's hash differs from
`5b6628a` while its `src/` is byte-identical to it — the delta between the two is this docs file
alone, and the bundle cannot depend on it. Verifiable: `git diff 5b6628a HEAD --name-only` is
`docs/world-model/LN-ENTRY-RUNG.md`.

## §THE MUTANT WALK — four mutants, all killed

The suite carries the four mutants as PERMANENT runtime pins (a match is built, the mutation is
applied to its state, and `lnArmedVersion` must read 0). Beside them, each mutation was ALSO
applied to `src/game/a4World.ts` on an UNCOMMITTED tree and restored from a `/tmp` byte copy
(never `git checkout`); the run was `npx vitest run tests/lnPlaytestEntry.test.ts`:

| # | the mutation | killed by (source-mutant run) |
| --- | --- | --- |
| M1 | `armLnWorld` writes the pin on ONE SIDE only (`[0]` instead of `[0, 1]`) | **4 red of 22** |
| M2 | the FLAG without the PIN — `armLnWorld` drops the `setLnGene` loop | **5 red of 22** |
| M3 | `setLnGene` writes the pin on `info.genome` INSTEAD of `baseGenome`/`effGenome` | **5 red of 22** |
| M4 | the WRONG WEIGHT — `LN_WORLD_WEIGHT = 0.5` (the shell's own weight) | **4 red of 22** |

⭐ **M3 IS THE INTERESTING ONE**: it is the canon *dose placement* violation, and it dies on both
the fidelity pin (`info.genome` must carry no such key) and the containment read (`lnArmedVersion`
reads the EFFECTIVE genome, which no longer carries the pin).

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⚠ **THE COST FIELD IS `context.groundPassesPerMatch`, NOT `context.passesPerMatch`.** The
   dispatch named the latter; the artifact has no such field. Its values are byte-for-byte the
   dispatch's two numbers (74.579710 → 71.246377), so the FIGURE is the dispatch's and only the
   NAME is corrected — quoted here and in the source comments as the artifact writes it (canon
   *unit-name truth*).
2. ⚠ **A LIVE PROHIBITION WAS PROTECTED BY REWORDING PROSE, NOT BY NARROWING THE PIN.**
   `a4PlaytestEntryV2.test.ts` pins that `a4World.ts` names neither `mutateGenome` nor
   `crossoverGenomes`. The `setLnGene` docblock's first draft named `crossoverGenomes` in prose to
   explain WHY `info.genome` is never touched; the sentence now says the same thing without the
   identifier ("a gene PRESENT there is copied from parent A by the season's own breeding path"),
   and the prohibition stands untouched. This is BQ-ENTRY §DEVIATIONS 2's precedent.
3. ⚠ **THE IDENTITY WALK USES TWELVE SCRATCH SEEDS PER WORLD** (BQ-ENTRY used two). The dispatch
   asked for ≥ 12; three worlds × 12 seeds × a full match runs INSIDE the permanent pin suite, so
   it is re-verified on every future run.
4. ⚠ **THE BASELINE WORKTREE SHARED THIS REPO'S `node_modules` BY SYMLINK** rather than a fresh
   `npm ci`. Same machine, same lockfile, same package versions; the two builds therefore differ
   only in the tree's own source, which is what the cost face is measuring.
5. ⚠ **THE MEAN-PASS-DISTANCE COST IS QUOTED WITH ITS INTERVAL'S VERDICT.** The dispatch's blurb
   text listed 14.492657 → 14.347704 among the costs without saying its interval CONTAINS ZERO.
   The blurb and this doc both say it, because a cost the exam did not resolve must not be sold
   as one it did.
6. ⚠ **THE FEED BLURB'S EMPTY-BOOK FORM CARRIES THE FULL NUMBER GROUP AND THE MATURE FORM DOES
   NOT.** The E13 arm IS the empty-book form, so its six pairs belong under the empty-book
   heading; the mature form carries only the receipt that was measured on the mature book
   (0.089528 → 0.040022 at `w = 0.5`) and the disclosure that its own 0.25 number does not exist.
   This is the #387 item 1 correction applied in advance, and it is pinned.

## §ROAD B — nothing ships

The default landing world is **0** before and after; every world below 14 is byte-identical; the
production fingerprint is unchanged; `src/sim`, `src/ai`, `src/evolution` and `scripts/` are
byte-untouched; the league serializes nothing new, so the worker's background fixtures play the
SHIPPED world. The flag is reached ONLY via `?a4world=14` or the Experimental checkbox — it is
never set outside `a4MatchFlags(14)`. **ZERO sims of record** — scratch seeds 900,004,400–499
only, no frontier consumption.

## §NEXT — THE LN PLAY-TEST (USER GATE)

The user's world-13 gate closed as KEEP and a world-14 gate opens beside it. The verdict format is
§4's:

```
看见自己人 (v14) — keep | change | revert — <一句人话>
```

Behind the gate: **GK-C0** 「门将瞬移」 (#396 item 1(ii)), the census of the keeper's per-tick
displacement, queued immediately after this rung.
