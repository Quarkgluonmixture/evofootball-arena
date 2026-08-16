# PW-T0b — THE RUNG-GRAIN WEIGHT CHOOSER (the arc's first `src` slice: built dormant, proven inert)

> Dispatched by **ruling #292.4**. Contract: [`PW-PASSWEIGHT-CONTRACT.md`](PW-PASSWEIGHT-CONTRACT.md)
> §2 (M-PW.2 the one table · M-PW.4 scope & debts). This stage **builds** the chooser the
> commander specified and **proves the plumbing**. It claims **nothing** about football:
> ⭐ every number below is a PLUMBING RECEIPT, never an effect size (#289 canon). **PW-T1 owns
> every claim about what the armed world does.**

| | |
| --- | --- |
| seam commit | `27c4cda` (src) |
| probe freeze | `28c5407` — `scripts/probes/pw-t0b-chooser-receipts.ts`, sha256 `64a297fd…`, **byte-unchanged between freeze and result** |
| artifact | [`data/pw-t0b-chooser-receipts.json`](data/pw-t0b-chooser-receipts.json) · `resultSha256` `deea2601…` |
| gates | **19/19 PASS · 69/69 mutants LIVE** (coverage map machine-derived from the gate objects; an uncovered conjunct exits 3) |
| dormancy | ⭐⭐ **BYTE-IDENTICAL OFF** — see §DORMANCY |
| src scope | 3 files, declared and gate-checked (§SRC SCOPE) |
| seeds | booked `12,492,000–999`; **walked**: smoke `000–005`, receipts `100–107`, world identity `900–909`. Guard band `040–059` booked, **NOT walked** (retired). |
| stats stream | **0 draws** — no CI is drawn in this slice. Floor stays **112,800**. |

---

## §SOURCES — verified before use (the #291.5 discipline, executed as the first act)

The brief's own attributions were checked against the documents **before any code was written**:

| cite | verified |
| --- | --- |
| `PASS_CANARY_POWERS`, `PlayerBrain.ts:32` | ✅ **exactly line 32 at the dispatch commit** `fa35af4`; the literal is `[PASS_POWER_MIN, 1, PASS_POWER_MAX]`. (It is line **33** after this slice's own import line lands — the probe EXTRACTS the line at run time rather than pinning it.) |
| `Match.ts:2900` as the pendingPass resolution path | ✅ the path is real and is the one #291.5 correction 4 names (`resolvePendingPassWindup` → `performPass`). The **line number** has moved with the file; the probe locates the statement by its text and publishes the live line (`Match.ts:3010` after this slice). ⚠ quote the STATEMENT, never the number. |
| #292.4 as the binding spec | ✅ ruling #292 item 4, verbatim: rung-grain, per-rung admission, one table, orientation under the flag, the chosen weight riding the pending pass, byte-identity off. |
| #292.3 (heavy curve struck) · #292.2 (admission, not price) · #291.1(c) (DIVERGENCE-1 routed under the flag) · #291.5 (4) (the threading note) · M-PW.4 (the S∧¬T guard trigger) | ✅ all as cited. |
| PW-T0a §COMMANDER CORRECTIONS 1–6 · PW-C0 §COMMANDER CORRECTIONS 1–5 | ✅ read in full; corrections 1/2 of PW-T0a (the `ref` population is all-direction and not chooser-facing) and 1/4 of PW-C0 (DIVERGENCE-1; the pendingPass path) bind this build and are honoured structurally. |

**No loose cite found in the brief this time; the citation hunt stays at seven strikes.**

---

## §0 THE QUESTION, in football

⭐ **他到底能不能自己决定这一脚传多重 —— 而且真的踢出去?**

PW-C0 proved the physics is honest and PW-T0a proved the shipped price, asked one option at a
time, wants the **softest** legal ball on options that are already safe — because L4 admission
puts every published survivor in the best threat quintile, so the corridor half of the price is
saturated before the rule is asked. #292 ruled the consequence: the firm ball's value is in
**ADMISSION**, not price, so the chooser must be built at **RUNG GRAIN** — each (mate, rung) pair
standing alone.

This stage builds exactly that and asks only the builder's questions: does the chosen weight
reach the ball · does it survive the wind-up · does the passer's own body knowledge exist only
under the flag · does each pair really stand alone · what does it cost · and **does the world
with the door shut still run bit for bit as it did before?**

---

## §1 THE DESIGN AS BUILT — clause by clause against #292.4

| #292.4 clause | as built | where |
| --- | --- | --- |
| a new match flag, house style | `pwWeightChooser?: boolean` — **an EXPLICIT boolean, never env-armed, never `EDS_BUNDLE_ARMED`, never bundle-defaulted, absent from `a4World` and every preset** (Road B, the `cbTouchPast` / `l3DefenceVeto` idiom verbatim) | `Match.ts` |
| enumerate (mate × rung) at `PASS_CANARY_POWERS` | the ladder is **handed in by the caller from the engine's own constant** — the chooser module never restates it | `PlayerBrain.ts` → `passWeightChooser.ts` |
| **PER-RUNG ADMISSION** | each pair is asked of the SHIPPED `evaluatePassOption` at **its own** power; a `null` retires **that pair and nothing else** | `choosePassWeight` |
| do NOT inherit `preferredPassPower`'s all-three-rungs refusal | the shipped rule refuses when **any** rung fails to price, because its price divides by the **reference rung's** touch survival. That normaliser is **dropped** — it is per-option and therefore cannot exist for an option that does not exist at 1.00. **Receipt 5 counts the drops: zero.** | `choosePassWeight` |
| **ONE TABLE**, same score path, at ITS rung | `price = threatQuintilePrice(threat@rung) × (1 − touchFailPrior@rung)` — the same two factors the shipped joining rule joins, **base curve only** (the heavy curve is STRUCK, #292.3). **No new pricing table, no new constants** (M-PW.2). | `choosePassWeight` |
| the argmax picks (mate, weight) **jointly** | one flat candidate list, one argmax, first-wins on a strict `>` — the shipped argmax's own rule, which with the ladder in floor→ceiling order breaks an exact tie toward the **softer** ball (PW-T0a §CORRECTIONS 6) | `choosePassWeight` |
| **UNDER THE FLAG ONLY**: the oracle carries the passer's own `orientationPowerMul` | the caller computes it from **his own heading** and the **PERCEIVED** direction to the mate (no truth read), and it rides into the oracle as `rung × orientation`. The module has exactly **one** caller, and that caller is behind the flag. **Receipt 3 proves it by term-list diff.** | `PlayerBrain.ts` |
| **THE CHOSEN WEIGHT RIDES THE PENDING PASS** | ⭐ **the deposit/consume seam** (the `forcedTouchPast` idiom): the chooser leaves `{ gid, power, tick }` on `match.pwStrikePower`; `performPass` **consumes** it; `armPendingPass` **captures** it into the wind-up record; the resolve **re-deposits** it and releases through the certified 3-argument call. **Receipts 1 + 2.** | `Match.ts` |
| flags off ⇒ byte-identity, the hard gate | §DORMANCY | — |

**Scope, stated**: open play only — not a restart taker (`mustKick`, whose facing block would
make the priced orientation stale), not the cutback (it has its own machinery), not a GK, and
**never** over the E2a-2 `forcedPassTarget` probe seam, which keeps precedence.

### ⭐ WHY THE WEIGHT TRAVELS ON THE MATCH AND NOT IN THE CALL

The obvious build — a fourth argument on the three strike statements — **breaks five banked
seams' pins**: O1's `armPendingPass(p, passMate!, offsideExemptKick)` singularity and its
`toHaveBeenCalledWith(passer, mate, false)` release assertion, and the DLC / DLC-s / DV / PTP
"ZERO NEW STRIKE STATEMENTS" pins. It was tried, it failed 8 tests, and it was **restructured**
rather than the pins loosened: the deposit/consume seam leaves every pinned statement and every
pinned signature byte-for-byte as certified, and puts the substitution at **one** consumption
site that reads one field. (This is the same reason CB-T0's knock travels on `forcedTouchPast`.)

---

## §DORMANCY — the hard gate, and how it was proven

**Method (the house world-identity idiom, in its build-slice form):** a clean worktree of the
**dispatch commit** (`git worktree add /tmp/pw-base fa35af4`) — a tree in which this seam does not
exist — walked **10 bare + 10 v7-armed** matches to completion on seeds `12,492,900–909`,
sampling ball position/velocity, both scores and **all 12 bodies** every 37th tick, plus the
final result, into one digest per match and one pooled digest over all 20 rows. The **same**
signature function is reproduced inside the frozen probe and re-run in the working tree with
every PW door **shut**.

| | value |
| --- | --- |
| pooled digest at clean `HEAD` (pre-seam) | `5dafce81dfc26677147d6734c10118cfcff40b771c117da011a04eb44fc1f70c` |
| pooled digest post-seam, flags off | **identical** (20/20 rows identical, gate `xByteIdenticalOff`) |
| the repo's own league fingerprint (`scripts/fingerprint.ts 1337 2`, 142 matches) | `57b0bdab…` — **unmoved**, and it is the same constant CB-T2 banked |
| non-vacuity | each identity walk is a **full** match: 14,756 ticks, 240 sim-s applied, 78 passes on the first seed |

**Why the identity is exact rather than approximate**: `executedPassPower(1)` returns 1 and draws
**no RNG** (`mechanics.ts`, C1-A's own note), and with the door shut nothing ever deposits a
weight, so not one statement downstream of the chooser is reached and not one draw is displaced.

**The full test suite**: **1,499/1,499 pass** (141/141 files) on an unloaded run, the five banked
pin suites (O1 · PTP · DLC · DLC-s · DV) included — they were run separately as well. ⚠ Honest
note: two intermediate full-suite runs under heavy parallel load reported 2 and 5 failures in the
long league/statistical suites (e.g. the ten-season style-ecology walk), which pass standalone in
this tree **and** in the clean `HEAD` worktree. Since the flags-off world is byte-identical, the
seam cannot change any simulated outcome; those failures are load/timing artefacts, and they are
reported rather than hidden.

---

## §SRC SCOPE — every touched file, and why

| file | why | gate-checked |
| --- | --- | --- |
| **`src/ai/passWeightChooser.ts`** (new, 217 lines) | the chooser itself: enumeration, per-rung admission, the one-table price, the joint argmax, and the admission counters. A pure `ai/` module — no Match, no truth, no RNG, no mutation of inputs. | `gOrientationTermList`, `gAdmission` |
| **`src/ai/PlayerBrain.ts`** (+82) | ONE flagged block (the single call site + the single deposit) placed as a SEPARATE block so the E3 chooser above it stays byte-identical; one import line. The three strike statements are **unchanged**. | `gSeam` (1 call site · 1 deposit · 1 flag read) |
| **`src/sim/Match.ts`** (+114) | the flag, the `pwStrikePower` deposit slot, the in-engine chooser ledger, the consumption inside `performPass`, the arm-time capture, the wind-up record's `powerChoice` and its re-deposit at resolve. | `gSeam` (2 consumption sites · 1 re-deposit) |

`git diff --stat fa35af4 -- src` = **exactly these three files, 410 insertions, 3 deletions**, and
the gate `xDiffScope` asserts the touched set equals the declared set (the diff is taken against
the **dispatch commit**, not `HEAD`, so the receipt cannot go silently empty once the seam lands).

### ⭐ M-PW.4 — THE S∧¬T GUARD DEBT DOES **NOT** FALL DUE

The CB seat's arming block (`if (cbSeat !== null) { … armTouchPast / clearTouchPastArming }`) is
**byte-untouched** by this slice: it is not in the diff, and the frozen probe extracts the block
by brace-matching and asserts it names nothing of this seam (`blockMentionsThisSeam: false`,
819 chars). **The debt named at #287.3 and restated at #289.1 stays the CB seam's**, undischarged
and unmoved. The new block sits *above* it and shares no statement with it.

---

## §RECEIPTS — the seven the ruling asked for

> ⭐ All seven are PLUMBING. None is an effect size, a usage claim or a football finding (#289).

### R1 ⭐ THE CHOSEN POWER ACTUALLY STRIKES

Every strike on the armed receipt walks is traced at the strike itself and re-derived from the
engine's own law: `speed = clamp(d·0.6 + 8.2, 9, 22) × orientationPowerMul × executedPassPower(chosen)`,
where the execution error is recomputed from a **CLONE of the engine's RNG at its pre-strike
state** (so the gaussian is *reproduced*, never guessed, and no draw is consumed).

| | |
| --- | --- |
| strikes traced | **624** |
| strikes at a CHOSEN non-default weight | **370** |
| max relative error, all strikes | **5.05 × 10⁻¹⁶** (tolerance 10⁻¹²) |
| chosen strikes whose pace differs from the weight-1 control | **370 / 370** |

The last row is the one that matters: every chosen strike left the boot at a pace the shipped
world would not have produced for that same body, mate and tick.

### R2 ⭐ THE PENDING PASS CARRIES THE CHOICE

`Match.ts` (the statement `this.performPass(passer, mate, pp.offsideExempt)`, live line 3010) is
untouched; the weight rides the record.

| | |
| --- | --- |
| wind-up resolutions that struck | **445** |
| wound-up strikes carrying a non-default weight | **294** |
| the engine's own ledger `windupCarried` | **294** (agrees with the traced rows) |

⚠ **A CORRECTION OF THE PROBE'S OWN FROZEN TEXT, disclosed by the executor**: the frozen design
says the eight receipt walks are "4 without the O1 wind-up, 4 with it", and the artifact's
`run.windupWalks: 4` is **FALSE as written**. `a4MatchFlags(7)` calls `a4MatchFlags(3)`, which
**arms `o1PassWindup` in the v7 world by construction** — so **all eight** walks are wind-up
worlds. The receipt is unaffected (it needed wound-up strikes to exist, and 294 do), and the
finding is actually stronger: in the world PW-T1 will exam, essentially every open-play short
pass goes through the wind-up, so **the threading is not an edge case — it is the main path**.
(The 76 non-wound-up chosen strikes are the designed one-touch bypass, `firstTouchWindow > 0`.)

### R3 ⭐ THE ORIENTATION TERM EXISTS ONLY UNDER THE FLAG — BY TERM-LIST DIFF (#291.5)

The two code paths' bodies are extracted by brace matching and their **identifier sets**
differenced. Nothing is evaluated; no shared expression is compared.

| | flagged path (`choosePassWeight`) | production path (`pricePassOption`) |
| --- | --- | --- |
| identifiers | 62 | 16 |
| orientation term present | **YES** | **NO** |
| terms only in the flagged path | **54** | — |

And both shipped pricers (`perceivedPassChoice.ts`, `passOptionValue.ts`) name **no** orientation
identifier anywhere in the file, while the production pricer still asks the oracle at the literal
`powerMultiplier: 1` — read out of source, not asserted.

### R4 ⭐ PER-RUNG ADMISSION — AND AN HONEST STRUCTURAL FINDING

⭐⭐ **#292.4's admission clause names the ORACLE'S NULL CONTRACT** ("an option that *prices* at
only one rung"), which is exactly what `preferredPassPower` refuses on. Built as ruled, and
measured, **that channel is EMPTY**:

| grain | pairs | mates |
| --- | --- | --- |
| pairs asked of the oracle | **5,304** | — |
| ⚠ admitted ONLY off the reference rung, **oracle-null grain** | **0** | **0** |
| live at all, **census-ladder grain** (race ∧ corridor, PURE OBSERVATION) | 724 | 316 |
| ⭐ live ONLY off the reference rung, census grain | **72** | **72** — **22.78 % of live mates** |

**Why the null channel is empty, structurally**: `evaluatePassOption` returns null on geometry
and reachability, and the live chooser's own window is **6–30 m**. The ground-pass range ceiling
is `launchSpeed × 1.826` (PW-C0 §A.1); at the window's **near** edge the launch speed is already
11.8 m/s ⇒ ~21.5 m of range, and at the far edge 22 m/s ⇒ ~40 m. **L2 cannot bind inside the
window at any rung**, so no option is ever "unreachable at 1.00 and reachable at 1.15".

⇒ **The admission story the ruling wanted lives one rung further in**: at the *race and corridor*
rungs, which this chooser **prices** (through the threat quintile) rather than **filters** on. So
the stage publishes that population as an observation the chooser never acts on: **nearly a
quarter of the mates that have a live ball at all have it only at a non-default weight** — the
population PW-T0a's `ref` set could not see, now counted inside the live chooser's own window.
⚠ **This is a plumbing census, not a claim** (no denominator discipline, no CI, 8 seeds).
**Whether the chooser should *filter* at census grain is a commander's fork, not an executor's
choice** — see §FORK.

### R5 ⭐ NO PAIR INHERITS ANOTHER RUNG'S REFUSAL

**`pairsDroppedForOtherRungRefusal` = 0.** Structural by construction (a null retires one pair),
counted anyway so the claim is a measurement.

### R6 ⭐ THE COST, MEASURED NOT ASSUMED

| | |
| --- | --- |
| oracle calls (pairs asked) | **5,304** |
| chooser decisions | **513** |
| mean oracle calls per decision | **10.34** |
| mean mate options per decision | **3.45** |
| ladder | 3 |

**10.34 = 3.45 × 3 exactly**: the ×3 the ruling predicted, confirmed by arithmetic rather than
assumed, and every walk asks a complete ladder (`pairsAsked % 3 === 0` on all 8).

**Wall cost**: the envelope names it (`walkMs` 2,059 ms for 8 armed matches; `identityMs` 1,743 ms
for the 20 identity walks; `wallMs` 16,734 ms total) — timing is an **envelope** fact, never in
the hashed body (#266.3(a)/#289.1). ⚠ A supplementary armed-vs-off timing run (4 seeds × 2 arms ×
2 repeats, outside the frozen probe) gave 412 / 267 / 213 / 446 ms per match across the four
blocks — **run-to-run variance swamps the arm difference at this sample**, so **no wall-cost
delta is claimed**. The structural cost (×3 oracle calls) is the number of record.

### R7 ⭐ SMOKE-GRADE ARMED SANITY — A RECEIPT, NOT THE EXAM

Six armed smoke walks (`12,492,000–005`), 376 decisions:

| rung | 0.85 | 1.00 | 1.15 |
| --- | --- | --- | --- |
| smoke walks | 138 (**36.7 %**) | 113 (**30.1 %**) | 125 (**33.2 %**) |
| receipt walks (513 decisions) | 232 | 142 | 139 |

The armed world **runs**, weights are **chosen**, and the distribution is not one degenerate
corner. ⛔ **This is NOT the exam and NOT a football finding.** It is a handful of seeds with no
denominators, no CI and no baseline; PW-T1 owns every claim, including whether the shape is the
doctrine's hoped-for 小力到脚 + 大力穿缝.

---

## §HYGIENE — the build-slice form, gate by gate

| gate | what it holds |
| --- | --- |
| `gDet` | a receipt walk re-derives bit-identically (two runs, one digest) |
| ⭐⭐ `xByteIdenticalOff` | **the seat `xSrcUntouched` cannot occupy in a build slice**: the flags-off world-identity digest and the league fingerprint both equal their clean-`HEAD` values |
| ⭐ `xDiffScope` | the touched set **is** the declared set; the diff is taken against the dispatch commit |
| `gArms` | every receipt walk is `a4ArmedVersion === 7` **with the door live**; the engine clock is the default on every walk (never overridden) |
| `gDose` | ⭐ #289 canon — the L3-T1 dose artifact's **file bytes** are hashed and its digest re-derived from them |
| `gStrike` · `gWindup` · `gOrientationTermList` · `gAdmission` · `gPerf` · `gSpread` | receipts 1–7 |
| `gSeam` | one chooser call site · one deposit writer · two consumption sites · one re-deposit · one flag read in the brain · the ladder is the substrate's own · **the CB arming block is untouched** |
| `gTraceNonPerturbing` | the probe's tracing subclass is a **camera**: traced and untraced walks produce identical signatures |
| `gSeed` | every claimed range inside the dispatched block, disjoint from every consumed band and from each other |
| `gStats` | **this slice draws no stats stream**; the ruling's floor is recorded |
| `gEnvClean` | whitelist-or-refuse (own vars **and** the engine's own doors); a preflight may never write a canonical path |
| `gFaces` | ⭐ #287.1 — the SERIALIZED artifact is parsed **back off disk** and the published receipts re-derived from the stored per-walk counters |
| `gHashEnvelope` | the body re-derives its digest from disk; a cross-out with a **different** envelope yields the identical digest; `wallMs`/`walkMs`/`identityMs`/`preflight`/`mode`/`head`/`outPath`/`generatedAt` are named exclusions |
| `gMutants` | the coverage map is derived from the gate objects; no uncovered conjunct, no ghost, no duplicate, **69/69 mutants live** |

**Freeze discipline**: the probe was committed (`28c5407`) **before** a single battery seed was
walked, and its sha256 is `64a297fd…` both at freeze and at result.

---

## §FORK — the one decision this stage cannot make

⭐ **Should the chooser ADMIT at census grain (race ∧ corridor) rather than at the oracle's null?**

* **① AS BUILT (the ruling's literal words)** — admission = the oracle's null contract. Every
  mate in the window is a candidate at all three rungs, and the corridor enters through the
  **price** (threat quintile). Consequence, measured: the per-rung admission channel is empty,
  so the chooser's rung grain is a **pricing** grain, and PW-T0a's mechanism (survivors are all
  q0 ⇒ the price sees only the touch term) applies to whichever pairs are survivors — the firm
  ball wins only where the quintile actually differs across rungs.
* **② CENSUS-GRAIN ADMISSION** — a pair enters only if it is live on the ladder at that rung
  (the observation R4 already counts: **22.8 % of live mates are live only off the reference
  rung**). This is the reading in which "an option dead at 1.00 and alive at 1.15 ENTERS the
  ladder as its own candidate" is literally true of the corridor, which is the lane the whole arc
  is about — but it is a **filter** the ruling did not authorise, and it changes what happens when
  **no** option is live (today the chooser simply keeps the incumbent decision).

The seam as built is ① and is what PW-T1 will exam unless the commander rules otherwise. The
counters for ② already ship in the ledger, so ② is a small, bounded follow-up if it is wanted.

---

## §DOUBTS (the executor's own, unprompted)

1. ⭐ **The admission clause, as literally written, is inert in the live window** — R4's structural
   finding. I built the ruling's words rather than its evident intent, and published the
   intent's population as an observation so the fork above can be ruled on evidence. If the
   commander's intent was ②, this slice needs a small amendment, not a rebuild.
2. ⚠ **The frozen text's "4 without the wind-up" is false** (v7 arms `o1PassWindup` by
   construction). Disclosed in R2 rather than silently corrected; the probe was **not** edited
   after its freeze.
3. **The price drops `preferredPassPower`'s reference normaliser.** Within one option this cannot
   change the argmax (it is a positive per-option constant); **across** options it can, because
   the shipped rule was never asked to compare two different mates. The ruling's "SAME existing
   score path at ITS rung (threat quintile + the BASE touch-fail term)" is the form I built, and
   it introduces no constant — but it is **not** literally `preferredPassPower`'s expression, and
   a reader who expects the shipped rule *called* will not find it. Stated plainly here.
4. **The orientation term is priced on the PERCEIVED direction, the strike on the TRUE one.** A
   passer whose percept of the mate is stale prices a slightly different body angle than he
   strikes at. That is doctrine-correct (self-knowledge is free, the mate's position is not) but
   it means the flagged oracle is not exactly the sim even under the flag; the residual is
   PW-T1's to measure (#291.1's execution-honesty exam).
5. **No armed-vs-off wall-cost delta is claimed** — the supplementary timing run's variance
   exceeded any plausible arm effect (R6). The ×3 structural cost is exact; the wall cost is not
   resolved and is not asserted.
6. **The chooser overrides the E3 target choice when both are armed** (it must — it picks man and
   weight jointly). In the v7 world E3 is armed, so PW-T1's contrast is not "the same target,
   struck harder": it is a different chooser. This is what #292.4 specified ("the argmax picks
   (mate, weight) jointly"), and it is the honest reading of what PW-T1 will be measuring.
7. **Restart takers and the cutback are out of scope** by my own decision (§1), on the ground that
   the restart facing block would make the priced orientation stale. The ruling did not name a
   scope; if the commander wants restarts in, it is a one-line change and a re-proof.
8. **The receipt population is 8 walks.** Everything here is a plumbing invariant that either
   holds exactly (max relative error 5 × 10⁻¹⁶) or is a count; nothing is a rate that would need
   more seeds — but the rung *shares* in R7 would, and they are labelled smoke accordingly.

## §COMMANDER CORRECTIONS OF RECORD (ruling #293, 2026-08-16 — read BEFORE quoting this doc)

Verify PASS-WITH-FINDINGS (3 MED + 4 LOW; the verifier ran its OWN byte-identity A/B across
the dispatch-commit tree and reproduced the engine ledger from scratch). THE SEAM IS BANKED AS
DORMANT — both dormancy prongs stand (pooled world digest identical 20/20; the league
fingerprint `57b0bdab…c673` unmoved; 1499/1499 green). Corrections binding on quotation:

1. **(MED) THE R4 "STRUCTURAL EMPTINESS" IS EMPIRICAL, NOT STRUCTURAL**: the closed-form
   argument ("L2 can never bind inside the window") was derived at orientation 1 with a
   stationary mate, while the flagged caller prices at power×orientation and the oracle's
   lead term extends flight past 30 m. The measured 0/5,304 off-reference admissions on
   8 walks is honest as a measurement; the word "structurally" is retracted.
2. **(MED — THE LOAD-BEARING ONE) THE PW PRICE DROPS THE WORLD'S OWN OBJECTIVE**: in v7 the
   shipped chooser prices mates on the ARMED VALUE AXIS (`edsValueAxis`,
   `pricePassOption → attemptValueAt`), and it can pick SEEN-UNREAD mates; the PW chooser as
   built re-picks the mate on reception×touch only and drops seen-unread. PW-T1's contrast
   would therefore conflate "the weight axis" with "a different, thinner mate chooser".
   ⭐ RULED (#293.3): PW-T0c re-bases the PW price on the SHIPPED per-mate price under the
   world's own flags, with the rung entering as the rung-dependent factors — objective
   fidelity is what makes the exam readable. The dropped reference normaliser doubt is
   subsumed by the same re-base.
3. **(MED) NO PERMANENT TEST COVERAGE** against the house precedent (carryChoiceSeat.test.ts
   et al.): the entire proof is a one-shot frozen probe. PW-T0c ships the pin suite
   (flags-off dormancy pin · deposit/consume/wind-up threading · per-rung admission ·
   no-refusal-inheritance).
4. **(LOW) The ×3 cost receipt is partially self-proving** (`meanMateOptions` is DEFINED as
   calls÷3; the numerator counts null-choice invocations while the denominator does not).
   The ×3 itself is true by loop-reading (the verifier's own). Quote the loop, not the ratio.
5. **(LOW) THE COMMITTED ARTIFACT CARRIES FALSE FIELDS**: `run.windupWalks: 4` and four
   `perWalkLedgers[].windup: 0` rows are FALSE (all 8 receipt walks are wind-up worlds —
   a4MatchFlags(7) arms o1PassWindup by construction; the rows self-refute via
   `windupCarried: 45`). The probe was rightly not edited post-freeze; THIS section is the
   artifact's correction of record (the stage-doc disclosure alone was insufficient — the
   #287.1 canon sends readers to the artifact).
6. **(LOW) A CANCELLED WIND-UP SILENTLY DROPS THE CHOSEN WEIGHT** (one occurrence in the
   battery: 371 chosen vs 370 struck; the re-deposit sits after the cancel checks).
   PW-T0c adds the re-deposit-on-cancel (or an explicit loss counter if the cancel is
   semantically a new decision).
7. **(LOW) PTP×PW IS AN UNSUPPORTED COMPOSITION, LATENT**: a `ptpPassLead` lead priced at
   weight 1 would ride a non-default deposited ball with zero receipt coverage. PTP is not
   in the A4 family's flags, so latent only — NAMED as a composition door: any future world
   arming both must first prove the lead-at-rung pricing (M-PW.4's own form).
8. **(ACCEPTED, noted)**: restart takers (mustKick) out of scope by the executor's declared
   decision (stale-facing hazard — correct); the orientation term prices the PERCEIVED
   direction while the sim strikes the TRUE one (doctrine-correct: self-knowledge free, the
   mate's position not; the residual belongs to PW-T1's execution-honesty exam per #291.1);
   the load-dependent full-suite flakiness is disclosed and non-attributable to the seam
   (byte-identity off); the wind-up-worlds correction strengthens R2 (the pendingPass path
   is the MAIN path of the exam world).
