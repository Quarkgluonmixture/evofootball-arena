# GK-ENTRY-RUNG — `?a4world=15` 身体跟着手走 (the dive world: 门将扑到球,球停在手上等身体到)

> Authorized by **COMMANDER RULING #402 item 5** (the dispatch), on **#402 item 1** (the read of
> record, GK-T1 banked, verifier PASS, zero HIGH, 23 of 24 gates green), **#402 item 2** (the RED
> gate RULED — the artifact stays at its `.RED.json` path and the reads are banked of record) and
> **#402 item 4** (the seam's limits, measured).
> The law is the GK contract ([`GK-KEEPER-BODY-CONTRACT.md`](GK-KEEPER-BODY-CONTRACT.md) §2
> M-GK.1 / M-GK.2′ / M-GK.3′); the seam is **GK-T0/T0b/T0c**
> ([`GK-T0-DIVE-LAW.md`](GK-T0-DIVE-LAW.md)); the exam of record is **GK-T1**
> ([`GK-T1-DIVE-EXAM.md`](GK-T1-DIVE-EXAM.md), artifact
> [`data/gk-t1-dive-exam.json.RED.json`](data/gk-t1-dive-exam.json.RED.json)).
> ⚠ **THE ARTIFACT SITS AT ITS `.RED` PATH BY RULING** (#402 item 2): one frozen liveness
> conjunct (`gBite`) honestly failed on a single dead-time seed and was reported RED rather than
> re-scoped; the name is part of the record, and the reads, selectors, faces and guards this rung
> quotes are BANKED OF RECORD.
> **LINEAGE**: GK-C0 → GK-T0 → GK-T0b → GK-T0c → GK-T1 (the exam) → **this rung**.
> The FIFTEENTH entry of the play-test family (#155 → #167.5 → #184.2 → #211.3 → #269.4 →
> #282.4 → #300.6 → #309.5 → #337.5 → #365 → #386 → #396 → here).
> Pin suite: [`tests/gkPlaytestEntry.test.ts`](../../tests/gkPlaytestEntry.test.ts).
> ⛔ **Nothing ships to the default world**; the production fingerprint is unchanged; **the
> play-test verdict is the USER GATE** (watchability has no instrument — the standing law).
> ⭐ **World 14's gate is still OPEN and a world-15 gate opens beside it** — `?a4world=14` still
> plays world 14 byte for byte, so 14 can be compared against 15 on the same device.

## §1 THE BUNDLE (fidelity: the exam's own E14-ARMED composition, CALLED)

`a4MatchFlags(15) = { ...a4MatchFlags(14), ...GK_WORLD_DOORS }` — world 14 (the own-lane world)
plus **exactly ONE door** and **NO pin at all**, the door GK-T1's **E14-ARMED** arm carried:

| # | limb | value | source |
| --- | --- | --- | --- |
| 1 | the whole world-14 substrate | `a4MatchFlags(14)` — **CALLED, not copied** (which calls `(13)` → `(12)` → `(11)` → `(10)` → `(9)` → `(8)` → `(7)` → `(6)` → `(3)`) | the #396 entry's own composition line |
| 2 | ⭐ the dive door | `gkDiveBody` = true | GK-T0/T0b (`src/sim/Match.ts` — the flag, default OFF, four read sites); GK-T1's `arms[].construction` on every ARMED arm |
| 3 | ⛔ the pin | **NONE — no gene, no constant** | GK-T0 introduced NO NEW CONSTANT (#384 item 5): the 0.7 s save window, the carry length and `topSpeed` are all the engine's own. `armGkWorld` is `armLnWorld` CALLED and nothing more |
| 4 | world 14's own gene | `lnOwnLaneWeight` = 0.25, on `baseGenome` AND `effGenome` of BOTH sides — **arrives by the CALL**, never re-written here | world 14, unchanged |
| 5 | the L3 dose · the PC dose | world 8's, inherited whole (`?pcdose=0` unchanged) | world 14, unchanged |
| 6 | the eye · evolution opt-ins | **null** · **OFF** (no `evolve*` opt-in exists for this law) | world 6 / #165.2.ii, unchanged |

⭐⭐ **NO GENE, NO CONSTANT.** This is the first entry of the family whose bundle writes nothing
at all onto a genome. `armGkWorld(match, l3Dose, pcDose)` is `armLnWorld(match, l3Dose, pcDose)`
CALLED, full stop — the door is a CONSTRUCTION flag and arrived with `a4MatchFlags(15)`. The
entry layer declares no weight of its own; the pin suite reads the source and proves it.

⭐⭐ **THE CONTAINMENT CALL IS THE WHOLE DESIGN**, the family idiom quoted from the shipped
comment: *"the two entries can never drift into two substrates"*. Because `armGkWorld` calls
`armLnWorld`, world 14's `lnOwnLaneWeight` = 0.25 (both sides, both dosed views, never
`info.genome`), world 12's two exam pins and world 11's `dvExposureWeight` all arrive by the
call and world 15 writes **zero** values of its own — pinned at construction and at full time.

⭐⭐⭐ **AND THE EXAM'S OWN CONSTRUCTION IS THE ENTRY'S ARMING, PROVEN BY DIGEST.** GK-T1 built
its E14-ARMED arm as `a4MatchFlags(14)` + `gkDiveBody: true` in the CONSTRUCTOR's flags +
`armA4World(m, null, 14)` — the empty-book form (`scripts/probes/gk-t1-dive-exam.ts`,
`buildMatch`). The pin suite builds **both** ways on the same seed and compares WHOLE-MATCH
signatures (rng state included) at construction AND at full time, on **six** scratch seeds,
through the probe's own `new Match(...)` path AND through the app's own `League` path:
**IDENTICAL** on both. The flag SET itself is pinned key for key:
`{ ...a4MatchFlags(14), gkDiveBody: true }` deep-equals `a4MatchFlags(15)`. The play world and
the exam are one construction.

⛔ **WHAT IS NOT IN WORLD 15, AND WHY** (#402 item 5(i)): `obmMovement` (the OBM corner is its
own arc), `ctbSupportPlane` (the CTB plane likewise), `rcAnticipate` / `rcReady` (RC did not
form — banked dormant and HELD), `bfFacingCost` (BF's goals lean is unexplained; BF's entry is
its own question), `edsTouchCost` (never in this arc). ONE door and nothing else, because **the
user's 14-vs-15 comparison must be clean**. Test-pinned six keys, absent from world 15 and from
every world below.

⚠ **WORKER-SIMMED fixtures play the SHIPPED world** (canon, home ruling #283.2(iv), VERBATIM:
*"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since
#155, stated now, test-pinned; refines #270's E4 correction; matches the perf diagnostic)"*).
⇒ **A watched world-15 match is the armed world; the league's background fixtures are not.**
Test-pinned here.

## §2 THE HONEST BRIEF (each blurb sentence beside the GK-T1 FIELD it quotes)

Canon (home: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4, VERBATIM): *"a stage
doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"*. Every number
in the blurbs is a GK-T1 field at 6 dp, read off
[`data/gk-t1-dive-exam.json.RED.json`](data/gk-t1-dive-exam.json.RED.json) — the RED path, by
ruling #402 item 2(i)/(ii). ⚠ THE EFFECT OF RECORD is the **E13** arm (EMPTY-BOOK, ABSENT →
ARMED); **D13** — the mature-book form the user actually plays — was **MEASURED this time**, so
the played form's numbers are its OWN, not an inference.

### (a) WHAT IT DOES

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 门将扑到球的那一刻,球不再瞬间跳到他脚下 —— 球停在他手碰到的地方,他的身体跑过去接上 | the law itself — `gkDiveBody`, GK-T0b's M-GK.2′ / M-GK.3′ (no number claimed) | — |
| 扑出去的球只动身体不动球;没有新常数,他跑过去的速度就是他的跑速 | GK-T0 §M-GK.2′ (a parry contact is steer-only) and #384 item 5 (no new constant) | — |

### (b) THE COST, SAID FIRST — the E13 arm (settings blurb + empty-book feed line)

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 从接球到出球的时间:对照 **353.194605** 帧,差 **+2.738122** 帧,区间 **[−6.924280, +12.052622]** 含零 —— 没量出变慢,但也不是零 | `guard.timeToDistributionTicks` (E13-ABSENT 353.194605; Δ +2.738122 [−6.924280, +12.052622], **CONTAINS ZERO — UNRESOLVED**) | **E13-ABSENT → E13-ARMED** |
| 身体跑到球那里平均 **82.609375** 帧 | `wait.meanTicks` (E13-ARMED) | **E13-ARMED** |
| 其中 **0.819444** 比 0.7 秒的扑救动画更长 | `wait.overSpriteShare` (E13-ARMED, 472/576) | **E13-ARMED** |
| 等的时候球被对手抢走:**591** 次接球里 **58** 次 | `release.ownershipLoss` (E13-ARMED — numerator 58, denominator 591) | **E13-ARMED** |
| xG 转化:对照 **1.465122**,差 **−0.054493**,区间不含零但远在容差内 | `guard.xgConversion` (E13-ABSENT 1.465122; Δ −0.054493, RESOLVED down, tolerated — guard G4) | **E13-ABSENT → E13-ARMED** |

### (c) THE COST, SAID FIRST — the D13 arm (the mature feed line, the form the user plays)

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 对照 **360.472754** 帧,差 **+5.569766** 帧,区间 **[−1.868426, +12.818250]** 含零 | `guard.timeToDistributionTicks` (D13-ABSENT 360.472754; Δ +5.569766 [−1.868426, +12.818250], **CONTAINS ZERO**) | **D13-ABSENT → D13-ARMED** |
| 身体跑到球那里平均 **84.659733** 帧 | `wait.meanTicks` (D13-ARMED) | **D13-ARMED** |
| 其中 **0.742942** 比 0.7 秒的扑救动画更长 | `wait.overSpriteShare` (D13-ARMED, 500/673) | **D13-ARMED** |
| **688** 次接球里有 **72** 次在等的时候被对手抢走 | `release.ownershipLoss` (D13-ARMED — numerator 72, denominator 688) | **D13-ARMED** |

### (d) THE MEASURED WIN

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 接住的球在门将手里那段、单帧跳超过 1 米的比率:空账本 **0.835740 → 0.104907** | `r1.catchMaxOverOneMetreShare` (E13-ABSENT 463/554 → E13-ARMED 62/591; Δ −0.730833 [−0.770071, −0.691559], RESOLVED down) | **E13-ABSENT → E13-ARMED** |
| 你玩的这一档(成熟账本)**0.843111 → 0.117733** | `r1.catchMaxOverOneMetreShare` (D13-ABSENT 618/733 → D13-ARMED 81/688; RESOLVED down) | **D13-ABSENT → D13-ARMED** |
| 剩下那一成是等球时被抢走、或死球重置那一帧算进去的,不是法则还在跳 —— 上限 | GK-T1 §HONEST LIMITS 1 (the release tails RAISE ARMED's R1 ⇒ it is an UPPER BOUND) | — |

### (e) THE GUARDS

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 进球、扑救、接球率、射门、传球成功率、被断、门将持球与出球次数都没破护栏 | `guard.goalsPerMatch` · `guard.savesPerMatch` · `guard.catchShareOfSaves` · `guard.shotsPerMatch` · `guard.passCompletion` · `guard.interceptionsPerMatch` · `guard.keeperHoldsPerMatch` · `guard.keeperPassesPerMatch` — `breach` **FALSE** on all three compositions (#402 item 1) | all |

### (f) THE FIRST-LOOK DISCLOSURE — what NOT to expect

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 高球没收那一下还是会跳(**1.388442 → 1.353315** m)—— 不是这扇门的事 | `claim.meanNextDisplacementMetres` (E13-ABSENT → E13-ARMED; the claim path sets NO contact) | **E13-ABSENT → E13-ARMED** |
| (mature feed line) 高球没收那一下还是会跳(**1.338601 → 1.348855** m,这一格区间含零) | `claim.meanNextDisplacementMetres` (D13-ABSENT → D13-ARMED; Δ +0.010254 [−0.021563, +0.043278], CONTAINS ZERO) | **D13-ABSENT → D13-ARMED** |
| 扑救动画还是原来的 0.7 秒,渲染没改 | GK-T0's `renderFacts` — the seam moves no renderer (no number claimed) | — |
| 禁区外用脚接住的球没有保护圈 | `gkFeet` — the unprotected catch (GK-T1 §HONEST LIMITS 6) | — |
| ⚠ 联赛后台快速模拟的比赛跑的是原版世界 | canon *worker fixtures* (#283.2(iv)) | — |

### (g) THE DEFERRED WORLD-14 SENTENCE (#398 item 1(ii), #402 item 5(ii))

ONE sentence added to the world-14 settings blurb AND to BOTH world-14 feed blurbs — and to
nothing else; no other world-14 string was touched.

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 这扇门也给门将的出球定价:门将传球的账本行数 **499 → 454**(LN-T1′b,69 对种子,空账本,w = 0.25)—— 他出球会少一点 | `ledgerJoin.ledgerRowShareByFamily.ABSENT.KEEPER-pass.denominator` **499** vs `…W025.KEEPER-pass.denominator` **454** ([`data/ln-t1pb-own-lane-exam.json`](data/ln-t1pb-own-lane-exam.json)) | **ABSENT → W025** |

⛔ **THE SENTENCE CLAIMS ONLY WHAT THE TWO DENOMINATORS SAY** — fewer keeper-pass ledger rows
over the 69 pairs, empty-book. Nothing about holds, nothing about quality.

⛔ **NOTHING IN THE BLURBS PROMISES A NUMBER THE EXAM DID NOT MEASURE**, and the pin suite reads
the actual UI strings to prove each arm's number stands under its OWN heading (the #387 item 1
class): the D13 values appear ONLY on the mature feed line, the E13 values ONLY on the
empty-book feed line, and in the settings blurb each of the two R1 pairs carries its arm label
adjacent to it.

## §3 THE SURFACES

| file | what |
| --- | --- |
| `src/game/a4World.ts` | `GK_WORLD_VERSION = 15` · `GK_WORLD_DOORS` · `isGkWorld` · `armGkWorld` (= `armLnWorld` CALLED, nothing more) · `gkArmedVersion` (containment: 15 ⊃ 14) · `a4MatchFlags(15)` (world 14's composition CALLED) · `armA4World` routes 15 · `A4WorldVersion`/`A4ArmedVersion` gain 15 · the URL/sticky parse accepts `15`, the bound moves to `16` · the docblock's launch list |
| `src/game/GameApp.ts` | the armed-match guard and the pc-stack dose predicate include world 15 by the SAME single containment predicate world 14 extended · the feed blurb (BOTH dose forms) · the world-14 feed blurbs' ONE new sentence · the status line |
| `src/ui/A4WorldBadge.ts` | `A4_BADGE_TEXT_GK` (+ `_EMPTY`) · both tables keyed at 15 |
| `src/ui/SettingsScreen.ts` | the world-15 checkbox (mutually exclusive with every other world — one value) + the long honest blurb · the world-14 blurb's ONE new sentence |
| `tests/gkPlaytestEntry.test.ts` | the pin suite (new) |
| narrows (this ruling) | listed in §THE NARROWED PINS below |

⭐ **THE DEFAULT LANDING WORLD IS UNCHANGED — BEFORE `0`, AFTER `0`** (the shipped game). World 15
is reached only by an explicit `?a4world=15` or an explicit tick in ⚙ → 🧬 Experimental.

⭐ **THE SURFACES ARE EXACTLY THE FOUR WORLD 14'S ENTRY TOUCHED, PLUS THE PIN SUITE** — no fifth
src file, and **ZERO files under `src/sim`, `src/ai`, `src/evolution` or `scripts/`**
(`git diff --stat HEAD -- src/sim src/ai src/evolution scripts` EMPTY before the commit). The
engine is byte-untouched, so the OFF world cannot have moved (the structural argument; the
digests below are the measurement).

## §4 WHAT THE USER'S EYES ARE FOR — HOW-TO-SEE (BINDING)

**How to switch it on** (the A4-PLAYTEST §2 form).

* Computer: ⚙ → 🧬 Experimental → tick **「身体跟着手走 · 门将扑到球,球停在手上等身体到 (play-test)」**.
  The current match restarts immediately in that world — same fixture, same seed, rebuilt.
* Phone: open the game with **`?a4world=15`** on the end of the URL. It sticks, so the link only
  has to be opened once. **`?a4world=14`** goes back to the own-lane world WITHOUT the dive law
  (the A/B this gate is really about); **`?a4world=0`** puts the shipped game back.
* **`?a4world=15&pcdose=0`** is world 8's own contrast, inherited unchanged: everyone a novice.
  ⭐ That EMPTY-BOOK form is the E13/E14 arm the exam's read of record was taken on.
* **The chip in the corner is the GROUND TRUTH**: 🧪 `身体跟着手走 · 剂量成熟` (default) ·
  🧪 `身体跟着手走 · 空账本(全新手)`. **If the chip is not there, you are not in this world.**
* ⚠ **What you are watching is the ONE match on screen** (canon #283.2(iv), §1).

**WHAT TO WATCH — three sentences, in plain football language.**
⭐ **门将扑救那一刻 —— 球是不是还瞬移到他脚下?**
⭐ **扑住之后 —— 球停在原地、门将跑过去接,还是像以前一样球飞到他身上?**
⭐ **代价 —— 他出球是不是慢了一拍?** That is G8, and the exam did NOT resolve it:
`guard.timeToDistributionTicks` 353.194605, Δ +2.738122 [−6.924280, +12.052622] — the interval
contains zero. Not measured slower; not proven free.

**WHAT NOT TO EXPECT.**
* ⛔ **The high-ball claim** (「高球没收那一下」) — `claim.meanNextDisplacementMetres`
  1.388442 → 1.353315 m; the claim path sets no contact and the ball still snaps. NOT this door's.
* ⛔ **A different save animation** — the sprite is still 0.7 s and no renderer was touched.
* ⛔ **A protected catch outside the box** — a `gkFeet` catch has no hold bubble.
* ⛔ Anything about whether the world plays BETTER. Nothing here claims that.

**HOW TO COMPARE.** Same device, same sitting: open `?a4world=14`, watch a match, then
`?a4world=15` and watch another. Switching restarts the CURRENT fixture (same seed, rebuilt), so
you never wait a match to see the other world. The chip tells you which one you are in.

**THE VERDICT FORMAT** (A4-PLAYTEST §4), one line:

```
身体跟着手走 (v15) — keep | change | revert — <one sentence in plain football language>
```

## §IDENTITY — the shipped world, and every world below 15, byte-identical

**Definition, one source**: each walk builds a league at the ENGINE DEFAULT clock
(`new League({ seed })`, never overridden), takes its first fixture, constructs the match with
`a4MatchFlags(v)` (or none for production), arms with `armA4World(match, null, v, l3Dose,
pcDose)` — the SHIPPED composer — calls `runToCompletion()`, and hashes the match signature (the
`signature()` helper of [`../../tests/gkPlaytestEntry.test.ts`](../../tests/gkPlaytestEntry.test.ts),
field for field the `lnPlaytestEntry` helper, rng state included). A world digest is `sha256` of
its **twelve** per-seed signatures joined by `|`, seeds **900,005,600 – 900,005,611** (scratch,
out of band).

⭐ The baseline column was taken **BEFORE a byte of this rung was written**, in a CLEAN throwaway
worktree at the dispatch HEAD (`git worktree add /tmp/gk-entry-base a5a6b73`, a symlinked shared
`node_modules`, `git status --short` EMPTY), by a throwaway walker in `/tmp` deleted immediately
after. ⚠ **TWO HEADS, ONE SOURCE TREE**: ruling #402 item 5 names `07d4e5f` (the RESULTS commit);
the dispatch names `a5a6b73` (its docs-only descendant, this rung's parent).
`git diff --stat 07d4e5f a5a6b73 -- src tests` is **EMPTY** — the two heads' `src/` and `tests/`
are byte-identical, and the baseline was taken at `a5a6b73`.

| digest | at `a5a6b73` (baseline) | at this rung | verdict |
| --- | --- | --- | --- |
| production (no world) | `b157fd0b36e637c5ffa995836ccbef509824242c214758f4a08fb8638bd1d5b2` | same | ⭐ **IDENTICAL** |
| world 12 | `c431fb98ad5f9d7894c61adedf6f8f984d8b3da11a272ab9b4363845f0a3e79b` | same | ⭐ **IDENTICAL** |
| world 13 | `a25992f1fa5c6d1c3a508b8d56eebbc4abe20cf637ba2e6abb1795753d76b92a` | same | ⭐ **IDENTICAL** |
| world 14 | `522c1b79126f0d8802eeff6a6c7651699104aa3ecb647ed9059c4a6496913542` | same | ⭐ **IDENTICAL** |
| world 15 | — (no such world) | ≠ world 14's | ⭐ **NEW, and non-vacuous** |

* ⭐⭐ **THE CONTAINMENT CALL DID NOT PERTURB WHAT IT CALLS.** `a4MatchFlags(15)` is built by
  calling `a4MatchFlags(14)`, and the bare world, world 12, world 13 and world 14 walked to the
  final tick are bit-for-bit what they were before this commit. The four equalities are **RUN in
  the pin suite**, against the literals above.
* ⭐ **NON-VACUOUS**: world 15's digest DIFFERS from world 14's, so the door demonstrably bites in
  the entry's own path — the identity claim is not the claim that nothing happened.
* ⭐ **THE PRODUCTION FINGERPRINT RE-DERIVED UNCHANGED** by the repo's own script
  (`npm run fingerprint`, seed 1337, 2 seasons, 142 matches):
  **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — the fingerprint of
  record, character for character, and the literal in `tests/a4HomeGrant.test.ts`.

## §NO NEW CHUNK — the precache list is unchanged, on two real clean-tree builds

`npm run build` in both clean trees, then `dist/sw.js` parsed for its own `PRECACHE` array:

| | `a5a6b73` | this rung |
| --- | ---: | ---: |
| precache entry count | **19** | **19** |
| entries naming an opt-in chunk (`pc-` / `l3-` / `stage3-`) | **0** | **0** |

The two lists are **entry-for-entry identical as SETS once content hashes are stripped** — the same 19
roles (their ORDER is a function of the content hash, which `__APP_VERSION__` makes commit-dependent —
`index.js` / `index.css` swap positions between the two builds of record; §COMMANDER CORRECTIONS 1). `OPT_IN_CHUNK_PREFIXES` in `scripts/pwaAssets.ts` is
**byte-unchanged** — this rung imports no artifact of its own, because the dive law carries no
table at all (one construction flag, no gene, no constant), so there was nothing to precache or
exclude. World 15 fetches exactly what world 14 fetches.

## §THE COST FACE — clean-tree builds at named commits, in BYTES

Canon (paraphrase; home PC-ENTRY-RUNG.md §COMMANDER CORRECTIONS item 4): *a build of record runs
on a CLEAN tree at a named commit.* Both sides were built on the same machine, from the same
`node_modules`, with the same `tsc --noEmit && vite build`, each `git status --short` EMPTY,
on 2026-09-06. The gzipped column is vite's own reported figure.

⚠ **STATED IN BYTES, NEVER IN FILENAMES** (ruling #397 item 2/3): `vite.config.ts` bakes
`git describe --tags --always --dirty` into `__APP_VERSION__`, so every commit changes the
bundle's content hash and therefore its FILENAME. A chunk filename is never quoted as the commit
of record's; the byte SIZE is the face.

| | main bundle raw | gzipped |
| --- | ---: | ---: |
| baseline (`a5a6b73`, clean worktree) | **1,446,064 B** | **432.15 kB** |
| with this rung (clean tree at the build-of-record commit) | **1,452,593 B** | **434.42 kB** |
| ⇒ **the every-install cost** | **+6,529 B (+0.4515 %)** | **+2.27 kB (+0.5253 %)** (⚠ gzip is commit-dependent — the sha is baked into the content; the RAW bytes are the face of record; §COMMANDER CORRECTIONS 4) |

The deltas are DERIVED from the two byte figures beside them (1,452,593 − 1,446,064 = 6,529;
6,529 ÷ 1,446,064 = 0.4515 %; the gzip delta likewise from 434.42 − 432.15 = 2.27, ÷ 432.15 =
0.5253 %) — no third copy.
⭐ **AND THERE IS NO OPT-IN COST AT ALL**: world 15 fetches exactly what world 14 fetches. This
layer adds **no chunk** — the dive law carries no table at all (one construction flag, no gene,
no constant), so there was nothing to precache or exclude.

## §THE NARROWED PINS (the DF-T0 §P7 form — stated POSITIVELY, never deleted)

Every hunk of this commit under `tests/` that is not the new suite. Each keeps its substantive
claim and states it in the positive form; **none is deleted**.

| # | file | the old claim | the new claim |
| --- | --- | --- | --- |
| 1 | `a4PlaytestEntry.test.ts` | the armed-match guard literal ends `\|\| isLnWorld(this.a4World))) {` | the SAME single guard, widened by `\|\| isGkWorld(this.a4World)` — still **ONE** guard, now naming world 15 too |
| 2 | `bkPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isGkWorld(this.a4World)` |
| 3 | `bkPlaytestEntry.test.ts` | the pc-stack predicate ends `\|\| isLnWorld(version);` | the SAME single predicate, widened by `\|\| isGkWorld(version)` |
| 4 | `bkPlaytestEntry.test.ts` | the badge table holds **14** distinct names | it holds **15** |
| 5 | `bkPlaytestEntry.test.ts` | `?a4world=15` → null | `?a4world=15` → **15** (the GK entry) and the bound moves to **16** (`?a4world=16` → null) |
| 6 | `bqPlaytestEntry.test.ts` | `?a4world=15` → null | `?a4world=15` → **15**; the bound moves to **16** |
| 7 | `cbPlaytestEntry.test.ts` | `?a4world=15` → null | `?a4world=15` → **15**; the bound moves to **16** |
| 8 | `cbPlaytestEntry.test.ts` | the badge table holds **14** distinct names | it holds **15** |
| 9 | `entriesW10W11.test.ts` | the armed-match guard literal | widened by `\|\| isGkWorld(this.a4World)` |
| 10 | `entriesW10W11.test.ts` | the pc-stack predicate | widened by `\|\| isGkWorld(version)` |
| 11 | `entriesW10W11.test.ts` | the badge table holds **14** distinct names | it holds **15** |
| 12 | `entriesW10W11.test.ts` | the EMPTY dose table holds **7** (worlds 8/9/10/11/12/13/14) | it holds **8** (…/15) |
| 13 | `entriesW10W11.test.ts` | `?a4world=15` → null | `?a4world=15` → **15**; the bound moves to **16** |
| 14 | `gkDiveBody.test.ts` | `a4World.ts` contains the string `gkDiveBody` **NOWHERE** (count 0) | `a4World.ts` names it in world 15's OWN bundle and nowhere else — count **5**, with the **TWO** executable lines enumerated (`GK_WORLD_DOORS`, `gkArmedVersion`'s flag read); and, stated POSITIVELY, worlds 1–14 carry no `gkDiveBody` while **world 15 carries it**. `saveContact` stays at count **0** — UNNARROWED |
| 15 | `gkDiveBody.test.ts` | the src-file allowlist for the flag is the five seam files | it is **six** — the ENTRY LAYER `a4World.ts` is the only new one; the env/bundle prohibitions (`EDS_BUNDLE_ARMED`, `process.env`) are UNTOUCHED |
| 16 | `gkDiveBody.test.ts` | the §SEAM MAP per-file set is the five seam files | it is **six**, with `src/game/a4World.ts` added and its own counts enumerated; the seam's own five files are byte-unchanged and every enumerated count below is the dispatch HEAD's |
| 17 | `l3PlaytestEntry.test.ts` | `?a4world=15` → null | `?a4world=15` → **15**; the bound moves to **16** |
| 18 | `l3PlaytestEntry.test.ts` | the badge table holds **14** distinct names | it holds **15** |
| 19 | `l3PlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isGkWorld(this.a4World)` |
| 20 | `lnPlaytestEntry.test.ts` | `?a4world=15` → null | `?a4world=15` → **15**; the bound moves to **16** |
| 21 | `mtPlaytestEntry.test.ts` | the badge table holds **14** distinct names | it holds **15** |
| 22 | `pcPlaytestEntry.test.ts` | `?a4world=15` → null | `?a4world=15` → **15**; the bound moves to **16** |
| 23 | `pcPlaytestEntry.test.ts` | the badge table holds **14** distinct names | it holds **15** |
| 24 | `pcPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isGkWorld(this.a4World)` |
| 25 | `raPlaytestEntry.test.ts` | `?a4world=15` → null | `?a4world=15` → **15**; the bound moves to **16** |

⭐ **TWO PROHIBITIONS WERE NOT NARROWED, DELIBERATELY.** (a) `gkDiveBody.test.ts` pins that
`a4World.ts` names `saveContact` **nowhere** — the FIELD stays a seam concern and the entry layer
never touches it; count 0, untouched. (b) The badge's and the settings screen's first-draft
comments named `gkDiveBody` in PROSE, which would have widened the src-file allowlist from six
files to eight; the prose was reworded instead of the pin being widened, because a narrow
allowlist is exactly the value of that pin. Declared at §DEVIATIONS 4 (LN-ENTRY §DEVIATIONS 2's
precedent).

## §THE PIN SUITE

[`tests/gkPlaytestEntry.test.ts`](../../tests/gkPlaytestEntry.test.ts), green from birth. The pin
COUNT derives from the suite itself (`npx vitest run tests/gkPlaytestEntry.test.ts` prints it); it
is not typed here as a second copy (canon: *"a gate's NOTE derives from the same pinned values the
gate checks; a count typed beside its pin is a second copy"* — home
PT-C0-PLAYTEST-FORENSIC-CENSUS.md §COMMANDER CORRECTIONS item 1). What it pins: FIDELITY key for
key · ⛔ the six doors that do NOT ride along, absent from world 15 and from every world below ·
the composition CALLED and the arming CALLED with **NOTHING added** (the source is read: no gene
setter, no weight constant) · world 14's ONE inherited pin on `baseGenome` AND `effGenome` of both
sides at construction AND at full time, with `info.genome` carrying no such key (canon dose
placement) · ⭐⭐⭐ THE EXAM'S E14-ARMED CONSTRUCTION reproduced by the entry's arming, whole-match
signatures on six scratch seeds, through the probe's own construction path AND the app's ·
containment (15 names itself 15, 14 stays 14, 13 stays 13, 12 stays 12, and the SOURCE ORDER) ·
the URL parse and the bound · the badge in both dose forms and the chip mount · the honest brief's
field values as 6-dp strings in the surface that claims each, with the E13-vs-D13 ATTRIBUTION
pinned per feed line and the arm labels pinned ADJACENT to the two R1 pairs in the settings blurb ·
the deferred world-14 sentence in all three world-14 surfaces · the cost said BEFORE the win in
both dose forms · the entry doc and its rulings · dormancy 1–14 and world 15 positively · a plain
League match · the worker's shipped world · the default landing world still `0` · THE MUTANT WALK
(four mutants, at runtime) · ⭐⭐ LIVENESS in the #402 item 2(iii) form · the four IDENTITY digests
and the non-vacuity · the fingerprint literal.

⭐⭐ **THE LIVENESS PIN CARRIES ITS EXEMPTION IN THE TEST'S OWN COMMENT** (ruling #402 item
2(iii), the G-BITE FORM RULE): world 15 ≠ world 14 whole-match signature on **at least ONE** of
twelve scratch seeds — **never "every seed"**, because a population of full matches contains DEAD
TIME in which the flag has nothing to bite. GK-T1's own frozen `gBite` said "every seed with a
catch" and honestly went RED on seed 12,552,083 (the only catch on the last tick before half
time: `stepRestart` runs through `halftime`, the waiting branch never executes, the contact dies
at `resetForKickoff`). That mechanism is written into the suite's comment beside the pin.

## §HONEST LIMITS

*(canon: this list is the ONE home; the artifact stores none of it and points here.)*

* ⚠⚠ **THE WAIT OUTLIVES THE SPRITE.** `wait.overSpriteShare` **0.819444** of waits run longer
  than the 0.7 s save animation (`wait.meanTicks` 82.609375, E13-ARMED). The dive is capped at
  the keeper's own `topSpeed`, so the body routinely arrives after the sprite ends: **you will
  see the ball sitting still while the keeper runs to it**. That is the law, measured, not a bug.
* ⚠⚠ **THE WAIT LENGTHS INCLUDE DEAD TIME** (GK-T1 §HONEST LIMITS 8; ruling #402 item 4). A contact set
  just before a whistle survives the dead ball until `resetForKickoff` clears it, and those ticks are
  counted in `wait.meanTicks` 82.609375 (median 50, the longest stored 422) because the contact was
  set — nothing was waiting on a ball in play. The mean the surfaces print is therefore inflated by
  that tail, and the blurbs now say so in a parenthesis (§COMMANDER CORRECTIONS 2).
* ⚠⚠ **ARMED's R1 IS AN UPPER BOUND, NOT A MEASUREMENT OF "IT STILL JUMPS."** The ARMED episode
  runs to the tick AFTER the ball leaves the contact, so restart placements and ownership losses
  are counted in the numerator. Both tails can only RAISE it ⇒ 0.104907 (E13) and 0.117733 (D13)
  are ceilings (GK-T1 §HONEST LIMITS 1).
* ⚠⚠ **THE BODY IS INSIDE `carry` AT ONLY 0.211806 OF RELEASES** (`release.bodyInsideCarryShare`,
  E13-ARMED, 122/576) — four releases in five are granted by the CARRY POINT rather than by the
  body itself. The body-as-predicate fork would lengthen roughly four waits in five: a HELD door
  whose data is now real (#402 item 4).
* ⚠ **A `gkFeet` CATCH IS UNPROTECTED.** A catch outside the area taken with no hold and no
  bubble has no protection circle; GK-T1 saw 13 episodes with 0 losses — a tiny denominator, not
  a safety claim.
* ⚠ **THE HIGH-BALL CLAIM STILL SNAPS.** The claim path sets no contact, so
  `claim.meanNextDisplacementMetres` 1.388442 → 1.353315 m (E13): that jump is not this law's and
  this world does not fix it.
* ⚠ **G8 IS UNRESOLVED, NOT ZERO.** `guard.timeToDistributionTicks` Δ +2.738122
  [−6.924280, +12.052622] on E13 spans zero on all three compositions. The exam cannot say the
  law is free; it can say the delay is smaller than that battery resolves. Nothing here sells an
  unresolved cost as a resolved one.
* ⚠ **G4 MOVED AND WAS TOLERATED.** `guard.xgConversion` falls with a resolved interval on E13
  (−0.054493 on 1.465122) and E14 (−0.050934), inside tolerance both times. A tolerance is a
  decision rule, not a proof of no effect.
* ⚠ **THE DIVE IS CAPPED AT RUNNING SPEED.** There is no new constant and no dive-speed gene: the
  keeper closes on the contact at his own `topSpeed`. That cap is the reason the wait is long.
* ⚠ **ONE WORLD, ONE COMPOSITION.** World 15 has never been played against anything but world 14,
  and the exam's E-arms were EMPTY-BOOK.
* ⚠ **THE D13 ARM WAS DOSED BY THE SHIPPED LOADERS AT THE EXAM'S HEAD**, not from the user's own
  league books: GK-T1's D13 arms called `loadL3Dose()` / `loadPcDose()` over the pinned dose files
  at the exam commit. The mature numbers are a MEASUREMENT of that composition, and the feed line
  says so in words.
* ⚠ **THE DEFAULT WORLD IS UNCHANGED** and every world below 15 is byte-identical; the fingerprint
  is unchanged; the league's background fixtures play the shipped world.

## §CHECKS

| check | result |
| --- | --- |
| `npm run typecheck` (`tsc --noEmit`) | **CLEAN** |
| `npx vitest run tests/gkPlaytestEntry.test.ts` | **GREEN** (the pin count, derived from the suite's own run) |
| the FULL suite (`npx vitest run`, at this tree) | **2,195 passed / 0 failed / 2,195 total, 168 files, 289.96 s, exit 0** (the run of record, at the committed bytes) |
| the full suite, RE-RUN discipline | ⚠ FOUR full runs were made while measuring; **three were 2,195/2,195 green** and **two intermediate runs each reported ONE failure whose name was not captured**, made while other full runs were competing for the machine. The standing fragility named at ruling #397 §COMMANDER CORRECTIONS item 7 is `formationEvolution`'s ten-season test (~146 s against a 180 s budget), so it was **re-run ALONE: 3 passed / 0 failed, 144.09 s**. Reported as it stands — a flake I could not name is not a flake I will call something |
| `npm run fingerprint` | **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — UNCHANGED, character for character |
| IDENTITY digests (bare · 12 · 13 · 14) | **RUN in the suite against the `a5a6b73` literals — all four IDENTICAL**; world 15 ≠ world 14 (non-vacuous) |
| the exam's E14-ARMED construction vs the entry's arming | **IDENTICAL whole-match signatures on 6 scratch seeds**, at construction and at full time, on BOTH construction paths |
| `npm run build` × 2, clean trees at named commits | **precache 19 → 19**; bundle delta at §THE COST FACE, in BYTES |
| `git diff --stat HEAD -- src/sim src/ai src/evolution scripts` | **EMPTY** — the engine is byte-untouched |
| `git status --porcelain` at the commit | **EMPTY** (the 17 files are `git show --stat HEAD`; §COMMANDER CORRECTIONS 5) |

⚠ **A DECLARED PROCESS NOTE ON THE COST FACE.** The entry-side build of record ran on a CLEAN
tree at commit `10c3b89` (`git status --short` EMPTY in a throwaway worktree, `dist/` ignored).
This doc's §THE COST FACE and §NO NEW CHUNK tables were then filled in with the measured figures
and the commit AMENDED (ONE commit, as dispatched), so the final commit's hash differs from
`10c3b89` while its `src/` and `tests/` are byte-identical to it — the delta between the two is
this docs file alone. ⚠ The bundle DOES depend on the commit (#397 item 2): `vite.config.ts`
bakes `git describe --tags --always --dirty` into `__APP_VERSION__`, so every commit changes the
bundle's content hash and therefore its FILENAME; the byte SIZE is invariant across equal-length
shas. That is why the cost face above is stated in BYTES and quotes **no filename at all**.
Verifiable: `git diff 10c3b89 HEAD --name-only` is `docs/world-model/GK-ENTRY-RUNG.md` (⚠ `10c3b89` is a
reflog-only pre-amend commit — the receipt verifies today and decays with the reflog, as LN-ENTRY's
`5b6628a` did; §COMMANDER CORRECTIONS 7).

## §THE MUTANT WALK — four mutants, all killed

The suite carries runtime analogues of all four as PERMANENT pins. Beside them, each mutation was
ALSO applied to `src/game/a4World.ts` on an UNCOMMITTED tree and restored from a `/tmp` byte copy
(`cmp`-verified, never `git checkout`); the run was `npx vitest run tests/gkPlaytestEntry.test.ts`
(27 tests):

| # | the mutation | killed by (source-mutant run) |
| --- | --- | --- |
| M1 | the DOOR removed — `GK_WORLD_DOORS = {}` | **11 red of 27** — FIDELITY, CONTAINMENT, LIVENESS, the brief's own construction pins |
| M2 | the composer calls `a4MatchFlags(13)` instead of `(14)` | **8 red of 27** — FIDELITY (the key set) and CONTAINMENT (15 requires 14) |
| M3 | the URL bound NOT moved — `?a4world=15` no longer parses | **2 red of 27** — the URL pin and M3's own runtime analogue |
| M4 | `a4ArmedVersion` reads 14 BEFORE 15 | **3 red of 27** — CONTAINMENT (a world-15 match would name itself 14) and the SOURCE-ORDER pin |

⭐ **M4 IS THE INTERESTING ONE**: it is the BU-T1 §DOUBTS 7 mislabel class, and it dies twice —
once on the behaviour (`a4ArmedVersion(worldMatch(15))` must be 15, never 14) and once on the
source order, because the behavioural pin alone would survive a re-ordering that happened to keep
the answer right on the seeds walked.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⚠ **THE WAIT FIELD IS `wait.overSpriteShare`, NOT `wait.shareOver42Ticks`.** The dispatch named
   the latter; the artifact has no such field. Its value is byte-for-byte the dispatch's number
   (0.819444 = 472/576 on E13-ARMED), so the FIGURE is the dispatch's and only the NAME is
   corrected — quoted here and in the source comments as the artifact writes it (canon
   *unit-name truth*). Every other field name in the dispatch matched the artifact exactly, and
   every dispatch VALUE matched the artifact at 6 dp.
2. ⚠ **THE BLURBS ARE PLAIN CHINESE WITHOUT INLINE FIELD NAMES.** Ruling #402 item 5(ii) prints
   the blurb text with backticked field names inside it; the executor brief asks for "plain
   Chinese, no jargon, numbers at 6 dp beside what they mean". The blurbs therefore carry the
   numbers and their meaning in words; the FIELD NAMES live in the adjacent source comments and
   in §2's tables, where canon *doc-prose fidelity* wants them. A player reading a chip on a
   phone should not be reading `guard.timeToDistributionTicks`.
3. ⚠ **THE MATURE FEED LINE QUOTES D13's OWN COST, WAIT AND CLAIM FIELDS**, not E13's:
   `guard.timeToDistributionTicks` 360.472754 / Δ +5.569766 [−1.868426, +12.818250] ·
   `wait.meanTicks` 84.659733 · `wait.overSpriteShare` 0.742942 · `release.ownershipLoss` 72 of
   688 · `claim.meanNextDisplacementMetres` 1.338601 → 1.348855. The dispatch listed only the D13
   R1 pair, but "each quoting the fields of ITS OWN arm" forbids printing E13's cost under the
   mature heading (the #387 item 1 class). Every one of these is a stored field of the same
   artifact, traced in §2(c) and §2(f), and each is pinned present on the mature line and ABSENT
   from the empty-book line.
4. ⚠ **TWO LIVE PROHIBITIONS WERE PROTECTED BY REWORDING PROSE, NOT BY WIDENING THE PIN.** The
   first drafts of the badge docblock and the settings-screen comment named `gkDiveBody` in
   PROSE, which would have grown `gkDiveBody.test.ts`'s src-file allowlist from six files to
   eight. Both sentences now say the same thing without the identifier ("the ONE dive door of the
   GK law"), and the allowlist stays at six with the ENTRY LAYER as its only new member. This is
   LN-ENTRY §DEVIATIONS 2's precedent.
5. ⚠ **THE EXAM-VS-ENTRY IDENTITY IS PROVEN ON BOTH CONSTRUCTION PATHS.** The probe builds its
   arms with `new Match({...})` directly; the app builds them through `League.createMatch`. The
   suite reproduces the exam's E14-ARMED arm BOTH ways against the entry's arming, on the same
   six scratch seeds, rather than choosing one.
6. ⚠ **THE IDENTITY BASELINE WAS TAKEN AT `a5a6b73`, NOT AT `07d4e5f`.** Ruling #402 item 5 names
   the RESULTS commit; the dispatch names its docs-only descendant, which is this rung's parent.
   `git diff --stat 07d4e5f a5a6b73 -- src tests` is EMPTY, so the two heads' engines are the same
   bytes; the digests are labelled with the head they were actually taken at.
7. ⚠ **BOTH THROWAWAY WORKTREES SHARED THIS REPO'S `node_modules` BY SYMLINK** rather than a fresh
   `npm ci`. Same machine, same lockfile, same package versions; the two builds therefore differ
   only in the tree's own source, which is what the cost face is measuring.
8. ⚠ **`release.ownershipLoss` IS STORED AS A SHARE; THE BLURBS QUOTE ITS COUNTS.** The field's
   value on E13-ARMED is 0.098139 with numerator 58 and denominator 591 (D13-ARMED: 0.104651,
   72/688). The dispatch's own form is 「591 次接球里 58 次」, which is the field's numerator and
   denominator — the counts, not a derived percentage. Canon *prose sweep at any precision*: **no
   hand-written percentage appears anywhere in any of the three surfaces**; the only two
   percentages in this doc are §THE COST FACE's, and both are DERIVED from the two byte figures
   beside them with the arithmetic written out.
9. ⚠ **THE WORLD-14 SENTENCE IS THE ONLY EDIT TO A WORLD-14 STRING.** No other world-14 blurb
   text, comment or pin was changed.

## §ROAD B — nothing ships

The default landing world is **0** before and after; every world below 15 is byte-identical; the
production fingerprint is unchanged; `src/sim`, `src/ai`, `src/evolution` and `scripts/` are
byte-untouched; the league serializes nothing new, so the worker's background fixtures play the
SHIPPED world. The flag is reached ONLY via `?a4world=15` or the Experimental checkbox — it is
never set outside `a4MatchFlags(15)`. **ZERO sims of record** — scratch seeds 900,005,600–699
only, no frontier consumption.

## §NEXT — THE GK PLAY-TEST (USER GATE)

The world-14 gate is still open and a world-15 gate opens beside it. The verdict format is §4's:

```
身体跟着手走 (v15) — keep | change | revert — <一句人话>
```

Behind the gate: **③** (retire the designations; LN-T1's ABSENT arm its control), then **⑤** (the
truth-reads cut) last — the queue of ruling #402 item 8.

## §COMMANDER CORRECTIONS (ruling #403 — the entry BANKED; verifier PASS, zero HIGH; three MEDIUM and six LOW disposed; THREE user-facing strings and ONE test comment corrected in place by the commander; the bundle's BYTES unchanged in kind — no flag, no world, no sim byte moved)

The independent verifier rebuilt both heads in clean worktrees on its own band and found zero byte
differences below world 15 (bare, 12, 13, 14) and world 15 non-vacuous; proved world 15 IS the exam's
E14-ARMED construction on both construction paths; confirmed no gene and no constant; attributed all 22
surface numbers to their fields and their arms independently (12 E13 tokens on the empty-book line, 10
D13 tokens on the mature line, none crossed); reproduced the raw byte cost to the byte; ran all four
mutants at source with the executor's exact counts; ran the full suite green (2,195); confirmed the
default landing world 0 and the fingerprint. Verdict **PASS**.

1. **MEDIUM — §NO NEW CHUNK's "same order" claim was false at the commit of record**: `index.js` and
   `index.css` swap positions 8/9 by content-hash order (the mechanism #397 item 2/3 named). The set,
   the count (19) and the zero opt-in entries are CONFIRMED; the order clause is struck in place.
2. **MEDIUM — THE ONE HOME OMITTED GK-T1 §HONEST LIMITS 8**: `wait.meanTicks` 82.609375 includes dead
   time (a contact set before a whistle survives until `resetForKickoff`). A bullet is added to
   §HONEST LIMITS, and the THREE surfaces that print the mean (the settings blurb; both feed lines,
   82.609375 and 84.659733) now carry the parenthesis 「(含哨响前接住、死球期间挂着的那些帧)」 — the
   number is unchanged; what it contains is now said where the user reads it.
3. **MEDIUM — THE SETTINGS BLURB'S COST BLOCK OPENED WITHOUT A DECLARED ARM FRAME** (the #387 item 1
   class in its weaker form: the values are E13 and correctly so, but the first two numbers carried no
   in-place label). One clause added before 353.194605: 「(以下代价数字来自 E13 空账本臂,也就是这扇门量过的
   那一档)」. The two R1 pairs were already labelled adjacent and pinned.
4. **LOW — the gzip figure is commit-dependent** (434.42 vs 434.43 kB at the two builds; the sha is baked
   into the content). RAW bytes are the face of record and reproduce exactly (+6,529 B, +0.4515 %); the
   gzip column is annotated. FAMILY RULE from here: a cost face records RAW bytes; a gzip figure, if
   printed, is labelled commit-dependent.
5. **LOW — §CHECKS' last row mis-stated its own check** (`git status --porcelain` is EMPTY; the 17 files
   are `git show --stat`). Corrected.
6. **LOW — the liveness pin's comment promised a receipt it does not publish.** The comment now says
   what the test does (counts how many bit, asserts at least one). The FORM — ≥ 1 of 12 with the
   dead-time exemption stated, never "every seed" — is the #402 item 2(iii) rule, satisfied.
7. **LOW — `10c3b89` is reflog-only** (the pre-amend build commit); the receipt verifies today and
   decays, as LN-ENTRY's `5b6628a` did. Annotated; precedent, not a defect.
8. **LOW — the empty-book feed line carried no HOW-TO-SEE** (LN-ENTRY §CORR 4 asked the next rung to
   give both dose forms the caveat; the league-worker caveat was there, the eyes' block was not). The
   eyes' block is added to the empty-book line in place; the pins (cost before win by string index;
   the E13 tokens present, the D13 tokens absent) are unaffected.
9. **LOW — the world-14 sentence names its field only in the doc and the source comment**, consistent
   with §DEVIATIONS 2 (plain Chinese, no inline identifiers) and with every other blurb number.
   Accepted.
10. **RATIFIED**: §DEVIATIONS 1 (the artifact's key `wait.overSpriteShare`; the dispatch's name was a
    transcription), 2, 3 (the mature line prints D13's OWN cost, wait, loss and claim — "each arm its
    own fields" requires it), 4 (two comments reworded rather than the `gkDiveBody` allowlist widened),
    5, 6 (the baseline at `a5a6b73`, src-identical to `07d4e5f`), 7, 8 (counts, not a percentage), 9.
    The commit on `main` is the programme's convention for every rung (stated, not a deviation).
