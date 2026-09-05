# BQ-ENTRY-RUNG — `?a4world=13` 缓冲留球 (the cushion world: 球跟着人走,三拍之后还在脚边)

> Authorized by **COMMANDER RULING #386 item 5** (the dispatch), on **#386 item 4** (the
> decision, taken with the contact counts). The law is **#384 item 5** / BK contract
> **M-BK.5**; the seam is **BQ-T0** (commit `0ae2bf8`); the exam is **BQ-T1**
> ([`BQ-T1-CUSHION-EXAM.md`](BQ-T1-CUSHION-EXAM.md)), banked at #386 item 1 as the **FAIL OF
> RECORD on (c) alone**.
> **LINEAGE**: BN-C0 (the bounce census) → BQ-C0 (the first-touch census) → BQ-C1 (the attempt
> window census) → BQ-T0 (the law) → BQ-T1 (the exam) → **this rung**.
> The THIRTEENTH entry of the play-test family (#155 → #167.5 → #184.2 → #211.3 → #269.4 →
> #282.4 → #300.6 → #309.5 → #337.5 → #365 → here).
> Pin suite: [`tests/bqPlaytestEntry.test.ts`](../../tests/bqPlaytestEntry.test.ts).
> ⛔ **Nothing ships to the default world**; the production fingerprint is unchanged; **the
> play-test verdict is the USER GATE** (watchability has no instrument — the standing law).
> ⭐ **The user's world-12 gate stays OPEN and a world-13 gate opens beside it** — `?a4world=12`
> still plays world 12 byte for byte, so 12 can be compared against 13 on the same device.

## §1 THE BUNDLE (fidelity: the exam's own armed composition, CALLED)

`a4MatchFlags(13) = { ...a4MatchFlags(12), ...BQ_WORLD_DOORS }` — world 12 (the receiver-access
world) plus **exactly ONE door**, the door BQ-T1's E-ARMED and D-ARMED arms carried:

| # | limb | value | source |
| --- | --- | --- | --- |
| 1 | the whole world-12 substrate | `a4MatchFlags(12)` — **CALLED, not copied** (which calls `(11)` → `(10)` → `(9)` → `(8)` → `(7)` → `(6)` → `(3)`) | the #365 entry's own composition line |
| 2 | ⭐ the cushion | `bqCushion` = true | BQ-T0 §1 (the ONE seam in `Match.applyControlContact`); BQ-T1's ARMED arms |
| 3 | genes | **NONE — `armBqWorld` is `armRaWorld`, CALLED** | the cushion is a BODY LAW: a pure construction flag, no gene, no book, no table |
| 4 | the L3 dose · the PC dose | world 8's, inherited whole (`?pcdose=0` unchanged) | world 12, unchanged |
| 5 | the eye · evolution opt-ins | **null** · **OFF** | world 6 / #165.2.ii, unchanged |

⭐⭐ **THE CONTAINMENT CALL IS THE WHOLE DESIGN**, the family idiom quoted from the shipped
comment: *"the two entries can never drift into two substrates"*. `armBqWorld(match, l3Dose,
pcDose)` is literally `armRaWorld(match, l3Dose, pcDose)`, so world 12's two exam pins
(`passLeadSupport = 1`, `raAccessWeight = 1`) and world 11's `dvExposureWeight = 0.5` arrive by
the call and world 13 writes **nothing of its own** — pinned.

⛔ **WHAT IS NOT IN WORLD 13, AND WHY** (#386 item 4(vii)): `bfFacingCost` (BF's goals lean is
unexplained; BF's entry is its own question), `rcAnticipate` and `rcReady` (RC did not form —
the door is banked dormant and HELD), `edsTouchCost` (never in this arc). ONE door, because
**the user's 12-vs-13 comparison must be clean**. Test-pinned four keys, absent.

⚠ **WORKER-SIMMED fixtures play the SHIPPED world** (canon, home ruling #283.2(iv), VERBATIM:
*"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since
#155, stated now, test-pinned; refines #270's E4 correction; matches the perf diagnostic)"*).
⇒ **A watched world-13 match is the armed world; the league's background fixtures are not.**
Test-pinned here.

## §2 THE HONEST BRIEF (each blurb sentence beside the BQ-T1 FIELD it quotes)

Canon (home: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4, VERBATIM): *"a stage
doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"*. Every number
in the blurbs is a BQ-T1 field at the doc's own 6 dp, or a derivation shown here.

### (a) WHAT IT DOES

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 「缓冲留球 —— 脚碰到球,球跟着人走,三拍之后还在脚边」 | BQ-T0 §1 (the mechanism; no number) | — |
| 传给他、他也够到了,却没拿住的比例 **0.188637 → 0.117556** | `population.intended.nonPossessionShare` | **D-SHUT → D-ARMED** |
| 「碰到了,但球滚出了够得着的范围」这一类几乎消失,占传球尝试的 **0.077366 → 0.001666** | `attempts.intended.notReachedMarginOfAttempts` | **D-SHUT → D-ARMED** |
| 他自己脚下弹开的比例 **0.220583 → 0.142724** | `bounce.ownTargetBounceRate` | **D-SHUT → D-ARMED** (the E pair, 0.227069 → 0.143344, was the entry commit's literal — corrected at §COMMANDER CORRECTIONS item 1) |

⭐ **THE DERIVATION, SHOWN** (「大约从五个丢一个变成八个丢一个」): 1 ÷ 0.188637 = **5.301187**
and 1 ÷ 0.117556 = **8.506584** — i.e. one lost reception in ~5.3 becomes one in ~8.5. Nothing
else in the blurbs is computed in prose.

⚠ The E arm's own pair for (a) is **0.177590 → 0.102921** (#386 item 1). The blurbs quote the
**D (dosed) arm** because that is the form the user plays — said in the blurb itself.

### (b) THE COST, SAID BEFORE THE WIN IS FINISHED

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 对手在这三拍窗口里把球戳走的次数,每场 **1.900802 → 1.406814** | `duel.opponentContactsPerMatch` | **D-SHUT → D-ARMED** |
| 抢断 **2.183367 → 2.205411**(区间含零) | `duel.tacklesPerMatch` (Δ +0.022044 [−0.104208, +0.149299], CONTAINS ZERO) | **D** |
| 被断球 **30.845691 → 31.079158**(区间含零) | `df.interceptionsPerMatch` (Δ +0.233467 [−0.239479, +0.686373], CONTAINS ZERO) | **D** |

⭐ **THIS IS THE EXAM'S OWN FAIL.** (c) 「对抗不减」 was the one conjunct that broke: the
opponent-contact class fell as a share of intended attempts (E: 0.021252 → 0.017583,
Δ −0.003669 [−0.007111, −0.000164]) — **below the exam's own realised MDE 0.004965, 9 LOO flips
of 998, and `ciHi < 0` on only 20 of the verifier's 25 independent bootstrap re-draws** (#386
item 2). The commander decided WITH the counts (#386 item 4(ii)): the window poke is **one take
in thirty** against tackles and interceptions that did not move, and a cushioned ball IS harder
to poke inside a twentieth of a second. ⇒ recorded on the blurb as a **measured cost**, never
hidden and never softened.

### (c) THE FIRST-LOOK DISCLOSURE — what NOT to expect

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 你自己那三句话…三个区间全部含零 | `contact.opponentFirstContactShare` (Δ −0.000634 [−0.005001, +0.003695]) · `contact.ownTargetSideBackShare` (Δ +0.003593 [−0.001268, +0.008158]) · `crowd.crashShare` (Δ −0.001125 [−0.006531, +0.004672]) — **all CONTAIN ZERO** | **E** |
| 球撞到站在传球线上的队友再弹开…不是这扇门的事 | BN-C0's C3 / BQ-T0 §4; `bounce.ownNonTargetFirstShare` 0.105436 → 0.104432 (CONTAINS ZERO) — the lane class did not move | **E** |
| 零就是「不推」,不是拟合出来的数字 | BQ-T0 §4 HONEST LIMITS ("ZERO IS A FORM, NOT A FIT") | — |

⛔ **NOTHING IN THE BLURBS PROMISES THE USER'S THREE SENTENCES MOVE.** The exam says they did
not; the blurbs say so, and the pin suite reads the actual UI strings to prove it.

## §3 THE SURFACES

| file | what |
| --- | --- |
| `src/game/a4World.ts` | `BQ_WORLD_VERSION = 13` · `BQ_WORLD_DOORS` · `isBqWorld` · `armBqWorld` (= `armRaWorld`, called) · `bqArmedVersion` (containment: 13 ⊃ 12) · `a4MatchFlags(13)` (world 12's composition CALLED) · `armA4World` routes 13 · `A4WorldVersion`/`A4ArmedVersion` gain 13 · the URL/sticky parse accepts `13`, the bound moves to `14` · the docblock's launch list |
| `src/game/GameApp.ts` | the armed-match guard and the pc-stack dose predicate include world 13 by the SAME single containment predicate world 12 extended · the feed blurb (BOTH dose forms) · the status line |
| `src/ui/A4WorldBadge.ts` | `A4_BADGE_TEXT_BQ` (+ `_EMPTY`) · both tables keyed at 13 |
| `src/ui/SettingsScreen.ts` | the world-13 checkbox (mutually exclusive with every other world — one value) + the long honest blurb |
| narrows (this ruling) | listed in §THE NARROWED PINS below |

⭐ **THE DEFAULT LANDING WORLD IS UNCHANGED — BEFORE `0`, AFTER `0`** (the shipped game). The RA
entry did not move it (RA-ENTRY-RUNG §3 lists no default change), so this rung does not either.
World 13 is reached only by an explicit `?a4world=13` or an explicit tick.

⭐ **THE SURFACES ARE EXACTLY THE FOUR WORLD 12'S ENTRY TOUCHED** — no fifth file, and **ZERO
files under `src/sim`, `src/ai`, `src/evolution` or `scripts/`**. The engine is byte-untouched,
so the OFF world cannot have moved (the structural argument; the digests below are the
measurement).

## §4 WHAT THE USER'S EYES ARE FOR — HOW-TO-SEE (BINDING)

**How to switch it on** (the A4-PLAYTEST §2 form).

* Computer: ⚙ → 🧬 Experimental → tick **「缓冲留球 · 球跟着人走,三拍之后还在脚边 (play-test)」**.
  The current match restarts immediately in that world — same fixture, same seed, rebuilt.
* Phone: open the game with **`?a4world=13`** on the end of the URL. It sticks, so the link only
  has to be opened once. **`?a4world=12`** goes back to the receiver-access world WITHOUT the
  cushion (the A/B this gate is really about); **`?a4world=0`** puts the shipped game back.
* **`?a4world=13&pcdose=0`** is world 8's own contrast, inherited unchanged: everyone a novice.
  This layer adds no dose of its own.
* **The chip in the corner is the GROUND TRUTH**: 🧪 `缓冲留球 · 剂量成熟` (default) ·
  🧪 `缓冲留球 · 空账本(全新手)`. **If the chip is not there, you are not in this world.**
* ⚠ **What you are watching is the ONE match on screen** (canon #283.2(iv), §1).

**WHAT TO WATCH — one sentence, and it is the receiver's.**
⭐ **The intended receiver's FIRST TOUCH when he reaches at a stretch: does the ball stay?**
Before, a ball he got a foot to was pushed away from him and he could lose it to geometry alone;
now it takes his own velocity and is still at his feet three ticks later. The class that carried
that loss is 0.077366 → 0.001666 of attempts (D).
⭐ **And the defender's poke: does it still happen?** It should — 1.406814 times a match in this
form, down from 1.900802. That fall is the cost; look at whether the ones that remain look like
football.

**WHAT NOT TO EXPECT.**
* ⛔ **The carom off a teammate standing in the lane** — the 「弹回」 you see. NOT this door's; it
  belongs to steps ②/③ (#386 item 4(vi)); its own face did not move.
* ⛔ **The crowding** (「有人挤人」) — `crowd.crashShare` contains zero.
* ⛔ **Passes played at opponents** (「传到对面身上」) — that is step ⑤.
* ⛔ Anything about whether the world plays BETTER. Nothing here claims that.

**HOW TO COMPARE.** Same device, same sitting: open `?a4world=12`, watch a match, then
`?a4world=13` and watch another. Switching restarts the CURRENT fixture (same seed, rebuilt), so
you never wait a match to see the other world. The chip tells you which one you are in.

**THE VERDICT FORMAT** (A4-PLAYTEST §4), one line:

```
缓冲留球 (v13) — keep | change | revert — <one sentence in plain football language>
```

## §IDENTITY — the shipped world, and every world below 13, byte-identical

**Definition, one source**: each walk builds a league at the ENGINE DEFAULT clock
(`new League({ seed })`, never overridden), takes its first fixture, constructs the match with
`a4MatchFlags(v)` (or none for production), arms with `armA4World(match, null, v, l3Dose,
pcDose)` — the SHIPPED composer — calls `runToCompletion()`, and hashes the match signature
(the `signature()` helper of [`../../tests/bqPlaytestEntry.test.ts`](../../tests/bqPlaytestEntry.test.ts),
field for field, the `bkPlaytestEntry` helper unchanged). A world digest is `sha256` of its two
per-seed signatures joined by `|`, seeds **900,003,300 – 900,003,301** (scratch, out of band).

⭐ The baseline column was taken **BEFORE a byte of this rung was written**, in a CLEAN throwaway
worktree at the dispatch HEAD (`git worktree add /tmp/bq-entry-base 1d321cf`, a symlinked shared
`node_modules`, `git status --short` EMPTY), by a throwaway walker deleted immediately after.

| digest | at `1d321cf` (baseline) | at this rung | verdict |
| --- | --- | --- | --- |
| production (no world) | `088450df2498bdb1f0c8374fa58bf2b59c5246d2b6e0ebc13d33d1e5fde7054f` | same | ⭐ **IDENTICAL** |
| world 11 | `4ab7cfee2494b8428becf5bbd2f8e30533344cdcf8483ac5eaa5ec01e0d9b5d6` | same | ⭐ **IDENTICAL** |
| world 12 | `4dcddca8a641e740f15bd68d5693204b883573eb1594909bca125f5f1eaecc06` | same | ⭐ **IDENTICAL** |
| world 13 | — (no such world) | ≠ world 12's | ⭐ **NEW, and non-vacuous** |

* ⭐⭐ **THE CONTAINMENT CALL DID NOT PERTURB WHAT IT CALLS.** `a4MatchFlags(13)` is built by
  calling `a4MatchFlags(12)`, and the bare world, world 11 and world 12 walked to the final tick
  are bit-for-bit what they were before this commit. The three equalities are **RUN in the pin
  suite**, against the literals above.
* ⭐ **NON-VACUOUS**: world 13's digest DIFFERS from world 12's, so the door demonstrably bites
  in the entry's own path — the identity claim is not the claim that nothing happened.
* ⭐ **THE PRODUCTION FINGERPRINT RE-DERIVED UNCHANGED** by the repo's own script
  (`npm run fingerprint`, seed 1337, 2 seasons, 142 matches):
  **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — the fingerprint of
  record, character for character, and the literal in `tests/a4HomeGrant.test.ts`.

## §NO NEW CHUNK — the precache list is unchanged, on two real clean-tree builds

`npm run build` in both clean worktrees, then `dist/sw.js` parsed for its own `PRECACHE` array:

| | `1d321cf` | this rung |
| --- | ---: | ---: |
| precache entry count | **19** | **19** |
| entries naming an opt-in chunk (`pc-` / `l3-` / `stage3-`) | **0** | **0** |

The two lists are **entry-for-entry identical once content hashes are stripped** (the same 19
roles, the same order), and `OPT_IN_CHUNK_PREFIXES` in `scripts/pwaAssets.ts` is
**byte-unchanged** — this rung imports no artifact of its own, because the cushion carries no
dose at all, so there was nothing to precache or exclude. World 13 fetches exactly what world 12
fetches.

## §THE COST FACE — clean-tree builds at named commits

Canon (paraphrase; home PC-ENTRY-RUNG.md §COMMANDER CORRECTIONS item 4): *a build of record runs
on a CLEAN tree at a named commit.* Both sides were built on the same machine, from the same
`node_modules`, with the same `tsc --noEmit && vite build`, each `git status --short` EMPTY,
on 2026-09-05. The gzipped column is vite's own reported figure.

| | main bundle | raw | gzipped |
| --- | --- | ---: | ---: |
| baseline (`1d321cf`, clean worktree) | `index-C6vmJzuX.js` | **1,434.39 kB** (1,434,386 B) | **427.92 kB** |
| with this rung (`47d40ee`, clean tree) | `index-DskMJ231.js` | **1,439.18 kB** (1,439,184 B) | **429.90 kB** |
| ⇒ **the every-install cost** | | **+4,798 B = +4.80 kB (+0.3345 %)** | **+1.98 kB (+0.463 %)** |

The deltas are DERIVED from the two byte figures beside them (1,439,184 − 1,434,386 = 4,798;
4,798 ÷ 1,434,386 = 0.3345 %) — no third copy.
⭐ **AND THERE IS NO OPT-IN COST AT ALL**: world 13 fetches exactly what world 12 fetches. This
layer adds **no chunk**.

## §THE NARROWED PINS (the DF-T0 §P7 form — stated POSITIVELY, never deleted)

| file | the old claim | the new claim |
| --- | --- | --- |
| `tests/bqCushion.test.ts` | `a4World.ts` contains the string `bqCushion` NOWHERE; every version 1–12 carries no flag | `a4World.ts` names it in EXACTLY ONE place — world 13's door set (`export const BQ_WORLD_DOORS = { bqCushion: true } as const;`) — and **worlds 1–12 carry no `bqCushion`; world 13 carries it** (asserted positively). Every other prohibition (no preset, no env, no serialization, the bare/world-12/League reads) is UNTOUCHED. |
| `tests/raPlaytestEntry.test.ts` | `?a4world=13` parses to null ("the bound moves to 13") | `?a4world=13` parses to **13** (the BQ entry) and the bound moves to **14**; `isRaWorld(13)` is false — world 13 CONTAINS world 12 but is not it |
| `tests/l3PlaytestEntry.test.ts` | `?a4world=13` → null ("a thirteenth does not [exist]") | `?a4world=14` → null (a fourteenth does not) |
| `tests/cbPlaytestEntry.test.ts` | same | same |
| `tests/pcPlaytestEntry.test.ts` | same | same |
| `tests/bkPlaytestEntry.test.ts` | same | same |
| `tests/entriesW10W11.test.ts` | same | same |
| `tests/l3PlaytestEntry.test.ts` | the badge table holds **12** distinct names | the badge table holds **13** distinct names |
| `tests/mtPlaytestEntry.test.ts` | the badge table holds **12** distinct names | the badge table holds **13** distinct names |

Every narrow keeps the substantive claim and states it in the positive form; none is deleted.

## §THE PIN SUITE

[`tests/bqPlaytestEntry.test.ts`](../../tests/bqPlaytestEntry.test.ts), green from birth. The
pin COUNT derives from the suite itself (`npx vitest run tests/bqPlaytestEntry.test.ts` prints
it); it is not typed here as a second copy (canon: *"a gate's NOTE derives from the same pinned
values the gate checks; a count typed beside its pin is a second copy"* — home
PT-C0-PLAYTEST-FORENSIC-CENSUS.md §COMMANDER CORRECTIONS item 1). What it pins: FIDELITY key for
key · ⛔ the four doors that do NOT ride along · the composition CALLED and the arming CALLED ·
containment (13 names itself 13, 12 stays 12, 11 stays 11, and the SOURCE ORDER) · the URL parse
and the bound · the badge in both dose forms and the chip mount · the three brief sentences as
substrings of the actual UI strings · that the brief says the user's three faces did NOT move ·
the entry doc and its rulings · dormancy 1–12 and world 13 positively · a plain League match ·
the worker's shipped world · the three IDENTITY digests and the non-vacuity · the fingerprint
literal.

**THE MUTANT WALK** (each mutant applied to an UNCOMMITTED tree and restored from a `/tmp` byte
copy — never `git checkout`), recorded in §CHECKS.

## §HONEST LIMITS

* ⚠⚠ **THIS RUNG IS A PRESENTATION OF THE EXAM'S ARMED FORM, NOT A CLAIM THAT THE WORLD PLAYS
  BETTER.** BQ-T1 is banked as a **FAIL** (on (c)); the entry exists because #386 item 4 decided
  the measured cost is one the user should see for himself. Nothing is decided until he plays it.
* ⚠ **THE COST IS REAL AND SMALL IN THE DEFENDER'S TOTAL** — 0.493988 fewer window pokes per
  match (D) against tackles 2.183367 → 2.205411 and interceptions 30.845691 → 31.079158, both
  containing zero. Small ≠ zero; the blurb says the number, not the word "negligible".
* ⚠ **THE DISPLACEMENT STORY IS A LABELLED HYPOTHESIS** (#386 item 4(v), 有故事就要有探针): that
  the poke is displaced rather than lost — a defender who would have poked now tackles or
  intercepts a few ticks later, or the pressured receiver's roll fails. **Its probe is named and
  UNRUN**: a per-receiver dispossession face within `PC_TIER_CHOICE_TICKS` (27) of first touch,
  by channel. ⛔ Not a finding. Not on the blurbs as one.
* ⚠ **(c)'s FAIL IS NOT STABLE TO THE BOOTSTRAP DRAW** — 20 of 25 verifier re-draws (#386
  item 2). The word STANDS as the frozen form printed it; the fragility is of record.
* ⚠ **THE VISIBLE CAROM IS UNTOUCHED.** The body-strike channel still caroms by design (BQ-T0
  §4); the user's 「弹回」 is the LANE class and belongs to ②/③.
* ⚠ **THE ROLL IS UNCHANGED**, including its ~10 % realised fail share (E: 0.098323 → 0.100613,
  CONTAINS ZERO; logged mean pFail 0.099676 → 0.099814, CONTAINS ZERO). The roll now adjudicates
  MORE attempts (28.555110 → 32.834669 per match) because the margin no longer swallows them —
  that is a change in what the roll SEES, not in the roll.
* ⚠ **ZERO IS A FORM, NOT A FIT** (BQ-T0 §4): nothing measures how much relative motion a real
  cushioning touch leaves. A different real value would be a different world, not a red pin.
* ⚠ **THE DEFAULT WORLD IS UNCHANGED** and every world below 13 is byte-identical; the
  fingerprint is unchanged; the league's background fixtures play the shipped world.
* ⚠ **THE DOSED ARM IS REPORTED, NOT SCORED** (BQ-T1 §R5): its words are the frozen rules
  APPLIED and STORED, and they gate no verdict. The blurbs quote it because it is the form the
  user plays, and say so.

## §CHECKS

| check | result |
| --- | --- |
| `npm run typecheck` (`tsc --noEmit`) | **CLEAN** |
| `npx vitest run tests/bqPlaytestEntry.test.ts` | **16/16 GREEN** (the pin count, derived from the suite's own run) |
| the narrowed suites (`bqCushion` · `raPlaytestEntry` · `bkPlaytestEntry` · `a4HomeGrant` · `l3PlaytestEntry` · `mtPlaytestEntry` · `cbPlaytestEntry` · `pcPlaytestEntry` · `entriesW10W11` · `a4PlaytestEntry` · the new suite) | **260/260 GREEN** |
| the FULL suite (`npx vitest run`, at this tree) | **2,094 passed / 0 failed / 2,094 total, 164 files, 268.53 s** — no timeouts on this run (the #365 item 1 dispositioned `formationEvolution` timeout appeared on an earlier loaded run and was re-run STANDALONE: **3/3 GREEN**) |
| `npm run fingerprint` | **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — UNCHANGED, character for character |
| IDENTITY digests (bare · world 11 · world 12) | **RUN in the suite against the `1d321cf` literals — all three IDENTICAL**; world 13 ≠ world 12 (non-vacuous) |
| `npm run build` × 2, clean trees at named commits | **precache 19 → 19, role lists entry-for-entry IDENTICAL once content hashes are stripped**; bundle +4,798 B |
| `git diff --name-only 1d321cf HEAD -- src/sim src/ai src/evolution scripts` | **EMPTY** — the engine is byte-untouched |
| `git status --short` before the commit | only this rung's 15 files |

⚠ **A DECLARED PROCESS NOTE ON THE COST FACE.** The entry-side build ran on a CLEAN tree at
commit `47d40ee` (`git status --short` EMPTY, `dist/` ignored). This doc's §THE COST FACE table
was then filled in with the measured figures and the commit AMENDED (ONE commit, as dispatched),
so the final commit's hash differs from `47d40ee` while its `src/` is byte-identical to it — the
delta between the two is this docs file alone, and the bundle cannot depend on it. Verifiable:
`git diff 47d40ee HEAD --name-only` is `docs/world-model/BQ-ENTRY-RUNG.md`.

## §THE MUTANT WALK — four mutants, all killed

Each mutant was applied to an UNCOMMITTED tree and restored from a `/tmp` byte copy (never
`git checkout`); the suite run was `npx vitest run tests/bqPlaytestEntry.test.ts` (16 pins).

| # | the mutation | killed by |
| --- | --- | --- |
| M1 | `a4MatchFlags(13)` COPIES world 12's keys instead of CALLING the composition | 3 red (fidelity key-for-key · the CALLED pin · containment) |
| M2 | the containment read asks **12 before 13** (the BU-T1 mislabel class, deliberately reintroduced) | 1 red (the version value + SOURCE ORDER pin) — a world-13 match reported itself **12** |
| M3 | `BQ_WORLD_DOORS` gains a SECOND door (`bfFacingCost`) | 2 red (fidelity key-for-key · ⛔ nothing-else-rides-along) |
| M4 | the COST LINE (`每场 1.900802 → 1.406814 —— 少了大约四分之一次。`) deleted from the settings blurb | 1 red (the honest-brief cost pin) |

⭐ **M2 IS THE INTERESTING ONE**: it is the exact class #386 item 5(i) named, and the entry's own
read order is what kills it — the pin reads the SOURCE ORDER as well as the value.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⚠ **THE CHIP TEXT IS THE FAMILY'S PLAIN-LANGUAGE FORM, NOT `🧪 A4 约定世界 v13 · 缓冲留球`.**
   The dispatch named that literal AND instructed the executor to *mirror v12's chip form
   exactly — read it*. Read, v12's chip is **`🧪 传球先问赶不赶得到 · 价格 1.0`** — the
   `A4 约定世界 vN` form was retired after v3; every world from v6 on names itself in plain
   football language. Mirroring won: the chip is **`🧪 缓冲留球 · 剂量成熟`** /
   **`🧪 缓冲留球 · 空账本(全新手)`**. The two instructions could not both be obeyed; the
   commander disposes.
2. ⚠ **THE FLAG NAMES OF THE THREE DOORS THAT DO NOT RIDE ALONG ARE NOT WRITTEN IN
   `src/game/a4World.ts`.** They were, in the first draft of the `BQ_WORLD_DOORS` docblock, and
   that turned three OTHER doors' dormancy suites red (`bfFacingCost` / `rcAnticipate` /
   `rcReady` each pin *"`a4World.ts` contains the string nowhere"*, and each of those doors IS
   still dormant, so narrowing them would have weakened a live prohibition for no gain). The
   docblock now names them in prose; the ⛔ absence itself is pinned for world 13 in
   `tests/bqPlaytestEntry.test.ts` by string key, in the test file, which those suites do not
   scan. **No prohibition of any other door was narrowed by this rung.**
3. ⚠ **THE IDENTITY WALK USES TWO SCRATCH SEEDS PER WORLD, NOT FOUR** (BK-ENTRY used four).
   The dispatch asked for ≥ 2 on world 12, the bare world and (cheaply) world 11; three worlds
   × 2 seeds × a full match is what shipped, and the walk runs INSIDE the permanent pin suite
   (BK's ran only in its doc), so it is re-verified on every future run rather than once.
4. ⚠ **THE BASELINE WORKTREE SHARED THIS REPO'S `node_modules` BY SYMLINK** rather than a fresh
   `npm ci`. Same machine, same lockfile, same package versions; the two builds therefore differ
   only in the tree's own source, which is what the cost face is measuring.

## §ROAD B — nothing ships

The default landing world is **0** before and after; every world below 13 is byte-identical;
the production fingerprint is unchanged; `src/sim`, `src/ai`, `src/evolution` and `scripts/` are
byte-untouched; the league serializes nothing new, so the worker's background fixtures play the
SHIPPED world. **ZERO sims of record** — scratch seeds 900,003,300–399 only, no frontier
consumption.

## §NEXT — THE BQ PLAY-TEST (USER GATE)

The user's world-12 gate stays open and a world-13 gate opens beside it. The verdict format is
§4's. Behind the gate: the displacement probe (#386 item 4(v)) if the verdict asks for numbers,
and the ②/③ lane arc (「有人挤人」 + the visible 「弹回」) with its own C0.

## §COMMANDER CORRECTIONS (ruling #387 — the entry BANKED; the verifier's two MEDIUM and one LOW, disposed; ONE user-facing string corrected in place by the commander with receipts)

The independent verifier ran the new suite, the typecheck and the fingerprint itself, re-counted the
door set (ONE door — the four other flag names appear nowhere in the src diff), verified the
containment read in both directions, read every narrowed hunk, checked every blurb number against
the BQ-T1 artifact, and returned **PASS — zero HIGH**. The items:

1. **MEDIUM — AN ARM MIX INSIDE A SENTENCE THAT DECLARES ITS ARM — CORRECTED IN PLACE.** Both blurbs
   open their number group with "the group below is the form you play (dosed)" and then quoted the
   own-target bounce as **0.227069 → 0.143344**, which is the EMPTY-BOOK pair
   (`bounce.ownTargetBounceRate` E-SHUT → E-ARMED); the dosed pair is **0.220583 → 0.142724**
   (D-SHUT → D-ARMED, read off the artifact). The commander replaced the pair in
   `src/ui/SettingsScreen.ts` and `src/game/GameApp.ts` (one occurrence each; no other byte) and in
   §2(a)'s table above. RECEIPTS: `npm run typecheck` clean; `npx vitest run
   tests/bqPlaytestEntry.test.ts tests/bqCushion.test.ts` 40/40 (the blurb pins are substring
   pins on the sentences, which did not change); `npm run fingerprint` =
   57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673. Direction and conclusion
   were unaffected (both arms fall by ≈ 0.078); the wrong arm under a right label is the
   second-copy class the prose-sweep canon exists for.
2. **MEDIUM — THE NARROWED-PINS TABLE LISTED 9 OF 18.** The complete list of record (every hunk
   read by the verifier; each stated positively with the substantive claim intact): (1)
   `bqCushion.test.ts` — `a4World.ts` names the flag in exactly one place (world 13's door set;
   count 4 in the file); worlds 1–12 carry none, world 13 carries it; SITES gains `a4World.ts`;
   the seam's own counts unchanged · (2) `raPlaytestEntry.test.ts` — `?a4world=13` parses to 13
   and the bound moves to 14; `isRaWorld(13)` false · (3–7) `l3PlaytestEntry` · `cbPlaytestEntry`
   · `pcPlaytestEntry` · `bkPlaytestEntry` · `entriesW10W11` — `?a4world=14` → null · (8–12)
   `l3PlaytestEntry` · `mtPlaytestEntry` · `cbPlaytestEntry` · `pcPlaytestEntry` ·
   `bkPlaytestEntry` — the badge table holds 13 distinct names · (13) `entriesW10W11` — 13
   names; the EMPTY dose table holds 6 (worlds 8/9/10/11/12/13) · (14–17) `a4PlaytestEntry` ·
   `l3PlaytestEntry` · `pcPlaytestEntry` · `bkPlaytestEntry` — the armed-match guard literal
   widened by `|| isBqWorld(this.a4World)` (still ONE guard) · (18) `bkPlaytestEntry` ·
   `entriesW10W11` — the pc-stack dose predicate widened by `|| isBqWorld(version)` (still ONE
   predicate).
3. **LOW — the new suite's fingerprint pin GREPS the literal rather than RUNNING it.** The run
   lives in `tests/a4HomeGrant.test.ts` (and in `bqCushion.test.ts`); nothing is lost; of record.
4. **OF RECORD (the executor's declared deviations, ratified at #387 item 3):** the chip text is the
   family's plain-language form (「🧪 缓冲留球 · 剂量成熟」 / 「🧪 缓冲留球 · 空账本(全新手)」 — the
   「A4 约定世界 vN」 form was retired after v3; the dispatch's literal was the commander's, and
   mirroring won, rightly); the four other flag names are NOT written into `a4World.ts` (three
   other doors' dormancy suites pin their absence there — a live prohibition kept intact; world
   13's non-arming of them is pinned by string key in the new suite instead); the identity walk
   uses 2 scratch seeds per world inside the PERMANENT suite (BK-ENTRY's 4 ran once in its doc);
   the baseline worktree shared `node_modules` by symlink; ONE commit via amend (the build of
   record at 47d40ee; the delta to 607c2fe is this doc alone). Two pre-existing worktrees
   (`.claude/worktrees/art-track-f`, `.claude/worktrees/pwa`) are someone's live work, not this
   rung's — untouched.
