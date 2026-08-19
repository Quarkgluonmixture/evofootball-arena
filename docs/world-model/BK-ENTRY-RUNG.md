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

*(frozen: this section is empty at the freeze commit and is written only in the result commit)*
