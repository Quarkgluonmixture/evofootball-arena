# BK — THE ?a4world=9 PLAY-TEST ENTRY (身体诚实的世界: 转身才能踢, 球会撞到人)

> Dispatched by ⭐ **ruling #309 item 5**. The **NINTH** entry of the a4-entry family
> (#155/#156 → #167.5 → #184.2 → #211.3 → #269.4/#270 → #282.4/#283.2 → #300.6/#301 → here).
> **THIS RUNG ADDS NO MECHANISM.** The facing law (BK-T0), the contact law (BK-T1) and their
> composition (BK-T2) are banked; both doors already exist in `src/sim/**` and are hard-`false`
> in every production path. This rung is an **ENTRY**: it makes the world the arc has already
> measured reachable by a person with a phone, so the BK play-test gate can happen.

Status: **PRE-REGISTERED** — everything above [RESULTS](#results) was written and COMMITTED
BEFORE the receipts were taken (#266.3(c), the freeze-commit canon in the entry-rung form the
L3 and PC entries established).

## §-1 WHAT THIS RUNG IS FOR

The contract's directive was the user's own: 「得和现实足球重新对一下」. BK-C0 measured the two
gaps — a body that kicks with no regard for which way it is facing (26.9 % of releases beyond
square, 9.3 % essentially backwards, and the price NOT EVEN ORDERED), and a ball that flies
through a body that has just kicked (cooldown-invisibility = 73.4 %/81.9 % of through-body).
BK-T0 built the facing law, BK-T1 built the contact law, and BK-T2 scored both: **H-BK.1 PASS**
and **H-BK.2 PASS**.

But *measured* is not *seen*. The programme's standing criterion is the user's:

「…他能自己长出来配合，技巧，博弈，对抗，战术，并且能让我们真的看到。」

⇒ **THE GATE IS THE USER'S EYES, AND THIS RUNG IS THE DOOR TO IT.** Its only job is to put the
measured world on a screen honestly — including **the price it charges**, which BK-T2 measured
and ruling #309 item 3 ordered reported unhedged.

## §CORRECTIONS-READ — every canon sentence COPIED from [`CANON.md`](CANON.md), never re-typed

Per ruling #301 item 2's mechanism fix: the ledger is where a brief copies from.

| canon, verbatim | its home | how it binds here |
| --- | --- | --- |
| *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"* | **PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4** | every BK-T2 number in §HOW-TO-SEE is a FIELD of [`data/bk-t2-composition-exam.json`](data/bk-t2-composition-exam.json), quoted at the precision the field carries; no percentage is computed in prose |
| *"a field carries the unit its name claims"* | **ruling #294 item 3** | this rung publishes no field whose name claims a unit it did not measure; the cost face states kB and gzipped kB separately |
| *"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines #270's E4 correction; matches the perf diagnostic)"* | **ruling #283.2(iv)** | §ARMING states it, the blurb says it in the player's own language (你看的是屏幕上这一场;联赛后台是原版世界), and it is test-pinned for world 9 |
| a build of record runs on a CLEAN tree at a named commit (paraphrase) | **PC-ENTRY-RUNG.md §COMMANDER CORRECTIONS item 4** | §THE COST FACE is an A/B of two builds, both on CLEAN trees at named commits, same machine, same `node_modules` |
| BOOKED = WALKED reporting; blocks consumed whole of record (paraphrase) | **the standing frontier practice (rulings #286 item 5 onward)** | §SEED LEDGER books exactly what it walks out of block 12,505,000–999 |

## §ARMING — world 9, limb by limb (re-derived, never inherited)

World 9 = **world 8 + the TWO BK laws**. It is the processing-time world with the body-honesty
arc's two banked doors switched on.

| # | limb | value | source |
| --- | --- | --- | --- |
| 1 | the whole world-8 substrate | `a4MatchFlags(8)` — **CALLED, not copied** (which calls `a4MatchFlags(7)` → `(6)` → `(3)`) | the #300.6 entry's own composition line |
| 2 | law (a) | `bkFacingLaw` = true | BK-T0 §LAW; BK-T2's ARMED arm |
| 3 | law (b) | `bkContactLaw` = true | BK-T1 §LAW; BK-T2's ARMED arm |
| 4 | the style gene | `cbCarryProneness` = **1.0**, both teams (match-local views) | world 6, unchanged |
| 5 | the L3 dose | L3-T1's pooled matured cells — **ALWAYS** | world 7/8, unchanged |
| 6 | the PC dose | PC-T1's pooled per-slot recognition table, or the EMPTIED pair under `?pcdose=0` | world 8, unchanged |
| 7 | the eye | **null** | world 6, unchanged |
| 8 | evolution opt-ins | **OFF** | a fixed armed world mutates nothing (#165.2.ii) |
| 9 | ⭐ a BK dose | **NONE — the laws carry no dose at all** | BK-T0/BK-T1: pure construction flags, no gene, no book, no table |

⭐⭐ **THE CONTAINMENT CALL IS THE WHOLE DESIGN.** `a4MatchFlags(9)` is literally
`{ ...a4MatchFlags(PC_WORLD_VERSION), ...BK_WORLD_DOORS }`, and `armBkWorld` is literally
`armPcWorld(match, l3Dose, pcDose)`. Consequences, all test-pinned:

* the two entries **can never drift into two substrates** (the idiom every rung of this family
  has used since #269.4, quoted from the shipped comment: *"the two entries can never drift into
  two substrates either"*);
* ⭐ **`?pcdose=0` KEEPS ITS WORLD-8 SEMANTICS INSIDE WORLD 9 BY CONSTRUCTION**, including the
  #301 item 3 / #302 empty-form reset — because it is the world-8 code path, called, not a
  re-implementation of it. The app decides the contrast on ONE predicate
  (`const pcStack = isPcWorld(version) || isBkWorld(version);`) and reads `pcDoseWanted` exactly
  once, so there is no second place for the two worlds to disagree;
* ⭐ **NO NEW CHUNK.** Neither law reads an artifact, so `OPT_IN_CHUNK_PREFIXES` in
  `scripts/pwaAssets.ts` is **byte-unchanged** and the service worker's precache list is what it
  was. World 9 fetches exactly what world 8 fetches, and nothing else.

⚠ **THE FACING LAW IS INERT WITHOUT A WIND-UP CHANNEL** (BK-T0 §LAW: `Match` REFUSES to
construct with `bkFacingLaw` armed and both wind-up channels off). World 9 is legal by
construction — `c7Windup` and `o1PassWindup` both ride in from the substrate. Pinned.

⚠⚠ **THE WORKER FAST-SIM PATH IS THE SHIPPED WORLD** (canon, home ruling #283.2(iv), verbatim:
*"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since #155,
stated now, test-pinned; refines #270's E4 correction; matches the perf diagnostic)"*). ⇒ **A
watched world-9 match is the armed world; the league's background fixtures are not.**

## §THE VERSION READ, RE-ORDERED BY CONTAINMENT (the BU-T1 mislabel class, #301)

`a4ArmedVersion` now walks **9 → 8 → 7 → 6** — pure containment, widest composition first — and
only then asks the **DISJOINT** MT family (4/5), which shares no door with the chain and whose
predicate is the only one that can be true at that point. BU-T1 §DOUBTS 7 wrote that *"the entry
layer would need a new version value first"*; world 9 has one, and **a world-9 match names itself
9**. Test-pinned four ways: the world-9 read, every contained world still reporting itself, the
MT worlds still reporting 4/5, and the SOURCE ORDER itself.

## §BADGE

🧪 **`身体诚实的世界 · 剂量成熟`** (default) · 🧪 **`身体诚实的世界 · 空账本(全新手)`**
(the inherited `?pcdose=0` contrast).

The family's mechanism unchanged, including its declared honesty limit (#270.2(iv)): the chip is
set from the version the user **REQUESTED**, and a failed dose load DISARMS to the shipped world
(0), clears the sticky choice and removes the chip — so "chip present ⇒ armed" survives. ⚠ **THE
COST DOES NOT LIVE ON THE CHIP** — a chip is a few characters on a phone. The price is carried by
the settings blurb and the feed line, where it can actually be read.

## §HOW-TO-SEE — the play-test brief (BINDING; the data is BK-T2 §RESULT, quoted as FIELDS)

**How to switch it on.**

* Computer: ⚙ → 🧬 Experimental → tick **「身体诚实的世界 · 转身才能踢,球会撞到人 (play-test)」**.
  The current match restarts immediately in that world — same fixture, same seed, rebuilt.
* Phone: open the game with **`?a4world=9`** on the end of the URL. It sticks, so the link only
  has to be opened once. **`?a4world=8`** goes back to the processing-time world WITHOUT body
  honesty (the A/B this gate is really about); **`?a4world=0`** puts the shipped game back.
* **`?a4world=9&pcdose=0`** is world 8's own contrast, inherited unchanged: everyone a novice.
  This layer adds no dose of its own.
* The chip in the corner names the world. **If the chip is not there, you are not in this world.**
* ⚠ **What you are watching is the ONE match on screen.** The league's background fixtures are
  simulated by the worker, which plays the **shipped** world (canon #283.2(iv)).

**WHAT ACTUALLY CHANGED — in football, and it is two sentences.**
⭐ **转身才能踢 —— 出球的准备时间里现在包含了他真正欠的那个转身,完全反身大约多付 0.48 秒。**
⭐ **球会撞到人 —— 刚踢完球的人不再是透明的,球撞在他身上会真的弹开(碰到不等于拿到)。**

**THE NUMBERS BEHIND THOSE SENTENCES** — every cell is a FIELD of
[`data/bk-t2-composition-exam.json`](data/bk-t2-composition-exam.json) (40 paired seeds), quoted
at the precision the field carries:

| what | face | base (`?a4world=8`) | armed (`?a4world=9`) |
| --- | --- | ---: | ---: |
| share of releases struck from outside the strike cone | `outsideConeShareAtRelease` | 0.3328690807799443 | **0.23113118765292678** |
| mean APPLIED wind-up, ticks | `meanAppliedWindupTicks` | 6.435059607123896 | **9.99985639061752** |
| added wind-up ticks paid per match | `appliedAddedTicksPerMatch` | 178.8175 | **185.7** |
| visual through-body body-ticks per match | `visualThroughBodyBodyTicksPerMatch` | 118.2325 | **44.9975** |
| the cooldown-invisible core share | `cooldownInvisibleCoreShare` | 0.8261476328420696 | **0.5413078504361354** |
| ⚠ **R-乙 Q06 pass completion** | `ryiQ06PassCompletion` | 0.6861832642355529 | **0.5974930362116991** |
| ⚠ 弹回门将 per GK release, 240-tick window | `bounceBackWithin240PerGkRelease` | 0.08947862846406764 | **0.13173810149881673** |

⭐⭐ **THE COST, STATED FIRST AND UNHEDGED** (ruling #309 item 3(iii)). `ryiQ06PassCompletion`
falls by `delta` **−0.08869022802385373** at `absDeltaOverHalfWidth` **13.256534812297712** — the
honest price of contact physics. The mechanism of record: **the world became honest but the PASS
ORACLE IS BLIND TO THE NEW HAZARD** — it prices reader-interception, not the cooldown-body carom.
真实世界里传球也会被腿挡出去,但真实传球的人知道躲. That is why the blurb says, in the player's
own words:

> 注意:传球更难了(完成率约降 9 个百分点)——传球的大脑还没学会躲开身体

**WHAT TO COMPARE.** ⭐ **v8 vs v9**, not v0 vs v9 — v8 already changed the carrying, the
challenge and the reaction; the only thing v9 adds is the body's honesty. Watch the same fixture
twice: tick the box, watch, untick to v8, watch.

**THE GATE QUESTIONS** (ruling #309 item 5, verbatim): **传球像人了吗 · 球不再穿人了吗 ·
门将的球看着讲理了吗**

**WHAT NOT TO EXPECT — honestly, in advance:**

1. ⭐⭐ **PASSING IS WORSE, AND THAT IS THE MEASURED TRUTH, NOT A BUG.** See the cost line above.
   If it reads as football (passes dying off legs), the arc's next door is teaching the oracle to
   price the new hazard; if it reads as broken, that is the gate's answer and it is worth having.
2. ⚠ **弹回门将 GOT MORE COMMON, NOT LESS** (+47 % of record) — the user's own third complaint
   moving the WRONG way: a carom that used to fly through a body now comes back. Reported
   unhedged; the save-and-regather / punt-came-home split is a named door, not a claim.
3. **NOT a GK distribution change.** All four GK channel CIs span 0 — the punt's landing price
   went to the pricing shelf (#309 item 3(i)), so 门将的球看着讲理了吗 is being asked about the
   CONTACT and TIME changes, not about a new distribution mix.
4. **NOT a ban.** The facing law is a TIME cost: a backheel is still legal, it just costs what a
   backheel costs. `beyondConeReleasesPerMatch` stays at **25.82** armed — the deliberate
   high-misalign strike survives as a priced choice.
5. **NOT a visible marker.** No icon, no glow, no overlay. What you see is a man turning before
   he kicks, and a ball hitting a leg.
6. **NOT a new dose.** This layer has none; `?pcdose=0` still means exactly what it meant in
   world 8.

**WHAT WOULD BE A REAL PROBLEM** (report it): bodies that freeze instead of turning; the ball
sticking to a body it strikes (it must never be controlled); the chip naming world 9 while the
football is plainly the shipped game.

## §SEEDS — block **12,505,000 – 12,505,999** (#309 item 5's allocation)

Identity/receipt walks only — this is an entry rung, not an exam. **BOOKED = WALKED**
(canon, paraphrase; home: the standing frontier practice, rulings #286 item 5 onward).
`12,505,999` is the world receipt. Sub-bands ledgered in §SEED LEDGER below.

## §RECEIPTS PROMISED (frozen before they were taken)

1. **BYTE-IDENTITY, PRODUCTION**: a no-world match on this rung's own seeds is bit-for-bit what
   it was before this commit, and the league fingerprint
   `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` is unmoved.
2. **BYTE-IDENTITY, WORLDS 6/7/8**: the flag sets and the walked matches of the three contained
   worlds are IDENTICAL across this commit — the containment call may not perturb what it calls.
   Pinned by digest.
3. **THE VERSION VALUE**: a world-9 match self-reports **9** through the shipped entry-layer read,
   and every contained world still reports itself.
4. **NO NEW CHUNK**: the SW precache list is unchanged and `OPT_IN_CHUNK_PREFIXES` is byte-equal.
5. **THE COST FACE**: a clean-tree build A/B at named commits, main-path bundle delta of record.
6. **FULL PIN SUITE GREEN** including the new `tests/bkPlaytestEntry.test.ts`, with its gate
   conjuncts MUTANT-CHECKED.

---

# RESULTS

Taken at freeze commit **`41b8109`** (2026-08-19), against the dispatch commit **`8f3bcec`**.
**36/36 pins green · 8/8 mutants KILLED · full suite 147 files / 1,661 tests green ·
`npx tsc --noEmit` clean.**

⭐ **THIS RUNG IS NOT A GATE BATTERY AND DOES NOT PRETEND TO BE ONE** (the #270/#283.2/#301 entry
disposition, inherited). It adds no mechanism and draws no inferential statistic — **stats drawn:
ZERO**. Its receipts prove **plumbing**: that the world behind the switch is the world BK-T2
measured, that the shipped game and every world below 9 did not move, and that the new version
value names the composition. Every number below is a receipt (canon, home ruling #289 item 1:
*"arming receipts, not football findings"*).

## §IDENTITY — the shipped world, and every world below 9, byte-identical

⭐ **THE STRUCTURAL ARGUMENT FIRST**: this rung touches **`src/game/a4World.ts`**,
**`src/game/GameApp.ts`**, **`src/ui/A4WorldBadge.ts`** and **`src/ui/SettingsScreen.ts`** —
**ZERO files under `src/sim`, `src/ai`, `src/evolution` or `scripts/`**
(`git diff --name-only 8f3bcec 41b8109 -- src/sim src/ai src/evolution scripts` is empty). The
engine is byte-untouched, so the OFF world cannot have moved.

The measurement that backs it. **Definition, one source**: each walk builds a league at the
ENGINE DEFAULT clock (`new League({ seed })`, never overridden), takes its first fixture,
constructs the match with `a4MatchFlags(v)` (or none for production), arms with
`armA4World(match, null, v, l3Dose, pcDose)`, calls `runToCompletion()`, and hashes the match
signature — the `signature()` helper of [`../../tests/bkPlaytestEntry.test.ts`](../../tests/bkPlaytestEntry.test.ts),
field for field. A world digest is `sha256` of its four per-seed signatures joined by `|`, seeds
**12,505,100 – 12,505,103**; the production digest uses **12,505,000 – 12,505,003**. Both trees
were CLEAN worktrees at their named commits.

| digest | at `8f3bcec` (baseline) | at `41b8109` (this rung) | verdict |
| --- | --- | --- | --- |
| production (no world) | `ed42640206b0542f706dadd2f4852ab60061339df100cda48959d4fec2d50f61` | `ed42640206b0542f706dadd2f4852ab60061339df100cda48959d4fec2d50f61` | ⭐ **IDENTICAL** |
| world 6 | `a536e7d7b5bd3bb22325cefc0f17297773139f88efdbbb079ff6d7e00741b26d` | `a536e7d7b5bd3bb22325cefc0f17297773139f88efdbbb079ff6d7e00741b26d` | ⭐ **IDENTICAL** |
| world 7 | `39338aa74eac53db43c37ca32b4f1c83e518b22a21801fe6abd1ae79b370c847` | `39338aa74eac53db43c37ca32b4f1c83e518b22a21801fe6abd1ae79b370c847` | ⭐ **IDENTICAL** |
| world 8 | `05d8290c1d3c6be59b28817af8e5cb5d3ef2a5941b66e7d7f6031f378438c7c8` | `05d8290c1d3c6be59b28817af8e5cb5d3ef2a5941b66e7d7f6031f378438c7c8` | ⭐ **IDENTICAL** |
| world 9 | — (no such world) | `7b8b04d5f8c40f0d9c6012f11cf49610328ff89010073c9b3f38f6205f68ce6c` | ⭐ **NEW, and ≠ world 8** |

* ⭐⭐ **THE CONTAINMENT CALL DID NOT PERTURB WHAT IT CALLS.** `a4MatchFlags(9)` is built by
  calling `a4MatchFlags(8)`, and worlds 6/7/8 walked to the final tick are bit-for-bit what they
  were before this commit.
* ⭐ **NON-VACUOUS**: world 9's digest DIFFERS from world 8's, so the two laws demonstrably bite
  in the entry's own path — the identity claim is not the claim that nothing happened.
* ⭐ **THE WORLD RECEIPT** (seed **12,505,999**, world 9, one full walk):
  `9f07de513b1d624529489b0dbaa8f60ca9ef5079685dcc270763c4a90361fab2`.
* ⭐ **THE PRODUCTION FINGERPRINT RE-DERIVED UNCHANGED** by the repo's own script
  (`npm run fingerprint`, seed 1337, 2 seasons, 142 matches):
  **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — the fingerprint of
  record, character for character.

## §NO NEW CHUNK — the precache list is unchanged, on two real builds

`npm run build` in both clean worktrees, then `dist/sw.js` parsed for its own `PRECACHE` array:

| | `8f3bcec` | `41b8109` |
| --- | ---: | ---: |
| precache entry count | **19** | **19** |
| entries naming an opt-in chunk (`pc-` / `l3-` / `stage3-` / `bk-`) | **0** | **0** |

The two lists are **entry-for-entry identical once content hashes are stripped** (same 19 roles,
same order class), and `OPT_IN_CHUNK_PREFIXES` in `scripts/pwaAssets.ts` is **byte-unchanged** —
test-pinned as a literal. The BK laws carry no dose, so there was nothing to precache or exclude.

## §THE COST FACE — clean-tree builds at named commits

Canon (paraphrase, home PC-ENTRY-RUNG.md §COMMANDER CORRECTIONS item 4): *a build of record runs
on a CLEAN tree at a named commit.* Both sides were built on the same machine, from the same
`node_modules`, with the same `vite build`, in **sibling `/tmp` worktrees** (`git worktree add`),
each `git status --short` EMPTY, on 2026-08-19. The gzipped column is vite's own reported figure.

| | main bundle | raw | gzipped |
| --- | --- | ---: | ---: |
| baseline (`8f3bcec`, clean worktree) | `index-C56O04_i.js` | **1,401.97 kB** (1,401,966 B) | **414.91 kB** |
| with this rung (`41b8109`, clean worktree) | `index-C-LKkroQ.js` | **1,404.83 kB** (1,404,831 B) | **416.04 kB** |
| ⇒ **the every-install cost** | | **+2,865 B = +2.86 kB (+0.20 %)** | **+1.13 kB (+0.27 %)** |

⭐ **AND THERE IS NO OPT-IN COST AT ALL**: world 9 fetches exactly what world 8 fetches — the
same `pc-t1-learning-exam-DXw5CTvR.js` (609.53 kB / 91.43 kB gz) and
`l3-t1-convergence-exam-Paj6Eu-d.js` (45.61 kB / 10.86 kB gz), both **byte-identical file names
across the two builds**. This layer adds **no chunk**.

## §THE VERSION VALUE (the BU-T1 mislabel class, again killed)

The containment-ordered read, exercised four ways in the pin suite: a world-9 match reports
**9**; worlds 8, 7 and 6 each still report **themselves**; the DISJOINT MT worlds still report
**4** and **5** (the reorder that moved them after the chain is behaviour-preserving because they
share no door with it); and the **SOURCE ORDER ITSELF** is pinned —
`bkArmedVersion` → `pcArmedVersion` → `l3ArmedVersion` → `cbArmedVersion` → `mtArmedVersion`.

## §THE PIN SUITE — 36 pins, 8 mutants, all killed

[`tests/bkPlaytestEntry.test.ts`](../../tests/bkPlaytestEntry.test.ts), green from birth. The
mutant walk ran on an UNCOMMITTED tree, each mutant restored from a `/tmp` byte copy (never
`git checkout`):

| # | the mutation | killed by |
| --- | --- | --- |
| M1 | `a4MatchFlags(9)` COPIES the world-8 keys instead of calling | the CALLED-not-copied pin (1 red) |
| M2 | `BK_WORLD_DOORS` loses `bkContactLaw` | composition + armed-match + dormancy pins (5 red) |
| M3 | `a4MatchFlags(8)` gains `bkFacingLaw` (dormancy break) | the dormancy pins (5 red) — ⭐ and `tsc` too |
| M4 | the read asks 8 before 9 | version-value + source-order pins (3 red) |
| M5 | `armBkWorld` arms nothing | arming + dose + empty-form pins (6 red) |
| M6 | `armBkWorld` passes `pcDose ?? []` (the empty form stops emptying) | the born-absent pin (1 red) |
| M7 | `OPT_IN_CHUNK_PREFIXES` gains `'assets/bk-'` | the no-new-chunk pin (1 red) |
| M8 | the COST LINE is deleted from the settings blurb | the cost-line pin (1 red) |

⭐ **M3 IS THE INTERESTING ONE**: it was killed by the pins AND by `tsc`, which refused
`bkFacingLaw` as a literal key on `League['matchFlags']` — see §DEV 1.

## §CHECKS

| check | result |
| --- | --- |
| `npx tsc --noEmit` | clean |
| `npm run build` (both trees) | ✓ built in 3.94 s / 3.79 s |
| `npm run fingerprint` | `57b0bdab…c673` — unchanged |
| new pin suite `tests/bkPlaytestEntry.test.ts` | **36 tests, green** |
| the nine entry files together (a4 / V2 / V3 / mt / cb / l3 / pc / bk) | **186 tests green** |
| full suite (`npx vitest run`) | **147 files / 1,661 tests → ALL GREEN** (⭐ including the `formationEvolution` ecology test that has timed out under load in every prior round of this arc) |

**EIGHT PIN UPDATES TO EXISTING TEST FILES, DECLARED** (the #211.3 → #270 → #283.2 → #301
precedent — adding a world to the family moves the family's shared "the world set is exactly
this" pins; each edit replaces a statement that is now false with the statement that is now true,
and **no assertion is weakened**):

1. `cbPlaytestEntry` + `l3PlaytestEntry` + `pcPlaytestEntry` — `?a4world=9` was pinned as "no
   ninth world exists". It now exists, so the pin **moves up one**: `?a4world=10` is the
   nothing-there case, and the family keeps a live assertion that the set is closed.
2. `cbPlaytestEntry` + `mtPlaytestEntry` + `l3PlaytestEntry` + `pcPlaytestEntry` — the badge
   distinct-name count 8 → 9.
3. `a4PlaytestEntry` + `l3PlaytestEntry` + `pcPlaytestEntry` — the GameApp arming-guard source
   pin, widened for `isBkWorld`. ⭐ The "exactly ONE `armA4World(` call site" pin was NOT touched
   and still holds.
4. ⭐ `bkFacingLaw.test.ts` + `bkContactLaw.test.ts` (the SEAM suites) — those stages pinned
   *"nothing outside `Match.ts` contains the prefix at all"*, listing `game/a4World.ts`. The
   entry is exactly what makes that false, so the pin is **made positive instead of dropped**:
   the entry may NAME each law **exactly twice** in non-comment code (the doors object + the
   armed-version read) and must contain **none of the law's consumers** (`bkNoteFacing`,
   `bkFacingLedger`, `bkFacingExtraTicks`, `bkContactLedger`, `bkCollectBodyStrikes`,
   `bkApplyBodyStrike`). Every other file in both lists is untouched and still forbidden.

## §DEV — the deviations, declared

1. ⚠⚠ **`League['matchFlags']` DOES NOT NAME THE TWO BK LAWS, AND THIS RUNG DID NOT WIDEN IT.**
   Both flags are members of `MatchConfig`, but `League.matchFlags`' `Pick<…>` key union
   (`src/sim/League.ts`) was never extended when the seams landed. The entry reaches them through
   the SPREAD in `a4MatchFlags`, which TypeScript permits for spread properties (mutant M3 proves
   the literal form is rejected: *"'bkFacingLaw' does not exist in type
   `Partial<Pick<MatchConfig, …>>`"*). At RUNTIME `League.createMatch` spreads `...this.matchFlags`
   into the `Match` config, so both laws arrive — proven by the world-9 digest, by
   `m.bkFacingLaw === true` in the pins, and by the seam-map pin that the entry consumes nothing.
   ⇒ **A NAMED DOOR for the commander, not a fix taken here**: widening the union is a
   `src/sim/**` edit this rung was explicitly not authorised to make. The pins make a silent drop
   impossible (`a4MatchFlags(9)` is asserted key-for-key AND the armed match is asserted flag-for-
   flag), so the gap is a TYPE-NAMING gap, never a behaviour gap.
2. **THE DOSE-FAILURE COPY IS SHARED WITH WORLD 8** (「⚠️ 处理时间世界读不到成熟账本 —— 留在原版
   世界。」). World 9 uses world 8's dose, world 8's loader and world 8's failure path verbatim, so
   the message names the dose's own world. No world-9-specific string was added rather than fork
   a path this rung's whole design exists to keep single.
3. ⭐ **THE COST IS ON THE BLURB AND THE FEED LINE, NOT THE CHIP.** Ruling #309 item 5 requires
   the blurb to carry the cost; a chip is a few characters on a phone and would carry it badly.
   The chip names the world and the dose form (the #282.4/#300.6 form); the settings blurb and
   BOTH world-9 feed lines carry 「注意:传球更难了…」 — test-pinned in three files.
4. **NO COMMITTED ARTIFACT.** This rung publishes no `data/*.json`: it draws no statistic, and
   every receipt above is either a digest whose recipe is fully specified in §IDENTITY (one
   source: the pin suite's own `signature()` helper) or a build figure quoted from the build
   itself. The PC entry's probe existed to prove a DOSE was bit-equal to a battery's table; this
   layer has no dose.
5. **UI COPY ROUNDS ITS QUOTED FIELDS** (ratified, #301 item 5: the verbatim-field rule binds
   DOCS, not phone screens). §HOW-TO-SEE above carries the full precision.

## §DOUBTS — ⭐ what the commander is asked to adjudicate

1. ⚠⚠ **THE COST GOES TO THE GATE UNRESOLVED, BY DESIGN.** `ryiQ06PassCompletion` −8.9 pp is on
   the blurb in plain language, and the gate is being asked to judge a world that passes worse
   than the world below it. Ruling #309 item 3(iii) ordered exactly that. **Ruling wanted only if
   the commander now prefers to hold the entry until the pass oracle learns the hazard** — the
   executor's reading is that the gate is the cheaper experiment and should run first.
2. ⚠ **弹回门将 +47 % IS ON THE BLURB TOO.** It is a REPORTED cost, not a scored one, and it moves
   the user's own third complaint the wrong way. Stated in §HOW-TO-SEE item 2 without a hedge; the
   possession-chain split remains the named door.
3. ⚠ **THE TYPE-NAMING GAP OF §DEV 1** wants a one-line `src/sim/League.ts` widening in whatever
   round next has authority there.
4. **NO PIXEL EVIDENCE IS OFFERED, BY DOCTRINE.** The facing law shows up as a man turning before
   he kicks and the contact law as a ball hitting a leg; whether that reads as football is the
   gate's question and no probe in this arc can answer it.

## §STATS

**ZERO drawn.** No test, no interval, no gate on a football quantity. The stats floor stands
where #309 item 4 left it (next ≥ **114,000**).

## §SEED LEDGER — booked = walked

| sub-band | n | use | walked |
| --- | --- | --- | --- |
| 12,505,000 – 12,505,003 | 4 | §IDENTITY — production, walked in BOTH trees (8 walks) | ✓ 4/4 |
| 12,505,100 – 12,505,103 | 4 | §IDENTITY — worlds 6/7/8 in both trees + world 9 in this one (28 walks) | ✓ 4/4 |
| 12,505,900 – 12,505,902 | 3 | `tests/bkPlaytestEntry.test.ts` — the league fixtures + the production identity walk | ✓ 3/3 |
| 12,505,999 | 1 | ⭐ the world-9 RECEIPT walk | ✓ 1/1 |
| 900,000,030 | 1 | ⚠ DECLARED, out-of-band scratch class (canon: PW-T0C §CORR item 6) — the three-consecutive-fixtures empty-book pin | ✓ declared |

**Total booked = 12 in-block + 1 out-of-band scratch, total walked = the same.** The rest of the
block (12,505,004–099, 12,505,104–899, 12,505,903–998) is VIRGIN of record.
Next sim block ≥ **12,506,000**.

## §ROAD B — nothing ships

The entry is default-OFF everywhere, both laws are absent from every preset and every League's
`matchFlags`, the save is untouched, the worker fast-sim still plays the shipped world, and the
production fingerprint is unchanged. What a non-opt-in player pays is the **+1.13 kB gzipped**
measured above, and nothing else.

## §NEXT — THE BK PLAY-TEST (USER GATE)

The arc pauses at the user's eyes. §HOW-TO-SEE is the recipe, the comparison is **v8 vs v9**, and
the three questions are the ruling's own: **传球像人了吗 · 球不再穿人了吗 · 门将的球看着讲理了吗.**

---

## §COMMANDER CORRECTIONS OF RECORD (ruling #310, 2026-08-19 — frozen bytes stand)

1. **THE FREEZE COMMIT WAS RED (verify MED)** — the two BK seam-suite pin rewrites (the
   POSITIVE "names each law exactly twice + consumes none of its consumers" form) landed
   in the RESULT commit, so at the freeze point 4 pins failed and "the result commit
   carries receipts only" was false (+18 lines in each of two test files). OF RECORD: an
   entry rung's freeze commit must be GREEN across the FULL pin population, existing
   suites included — assertion edits belong in the freeze. Mitigations acknowledged: the
   rewrite is disclosed, the new pins are STRONGER (exact occurrence counts + consumer
   blacklists), and src moved ZERO bytes between the commits — the violation is
   procedural ordering, not measurement integrity; the rung BANKS.
2. **THE MT-REORDER DISJOINTNESS REASON CORRECTED**: the load-bearing separator is the
   FLAG SETS (+ disjoint dose vectors), not `stationEye === null` (cbArmedVersion also
   requires it). The conclusion (behaviour-preserving reorder) stands on every reachable
   path; the stated reason was not the load-bearing one.
3. **NAMED DOOR**: `League['matchFlags']`'s Pick key union does not NAME bkFacingLaw /
   bkContactLaw (the entry reaches them through the spread — runtime proven; a future
   literal-typed writer would get a tsc error). A one-line src/sim widening in the next
   round with src/sim authority closes it.
4. The baseline side of the cost A/B is accepted on internal consistency (the verifier's
   one-build budget went to the rung side, which reproduced to the CONTENT-HASHED
   FILENAME — the stronger check). Cost of record: **+2.86 kB raw (+0.20 %) / +1.13 kB
   gz; zero opt-in delta** (world 9 fetches exactly world 8's chunks).
