# PW-T0c — THE AMENDMENT SLICE (objective fidelity · the pin suite · the cancelled wind-up · PTP×PW)

> Dispatched by **ruling #293.3**, four clauses on the banked PW-T0b seam. Contract:
> [`PW-PASSWEIGHT-CONTRACT.md`](PW-PASSWEIGHT-CONTRACT.md) §2 (M-PW.2 the one table · M-PW.4
> scope & debts). The seam's plumbing is proven and **stays** — the deposit/consume idiom, the
> flag, the enumeration loop and the orientation term are not rebuilt here. ⭐ Every number below
> is a **PLUMBING RECEIPT**, never an effect size (#289 canon). **PW-T1 owns every claim about
> what the armed world does.**

| | |
| --- | --- |
| amendment commit | `ca637e6` (src + the pin suite) |
| probe freeze | `16ad2fb` — `scripts/probes/pw-t0c-amendment-receipts.ts`, sha256 `c351434a…`, **byte-unchanged between freeze and result** |
| artifact | [`data/pw-t0c-amendment-receipts.json`](data/pw-t0c-amendment-receipts.json) · `resultSha256` `7e9b4d3d…` |
| gates | **20/20 PASS · 76/76 mutants LIVE** (coverage map machine-derived from the gate objects; an uncovered conjunct exits 3) |
| dormancy | ⭐⭐ **BYTE-IDENTICAL OFF, RE-PROVEN** — see R4 |
| src scope | 3 files, +273 / −30 against the PW-T0b result commit (§SRC SCOPE) |
| pin suite | `tests/pwWeightChooserSeat.test.ts` — **24 tests**, 20,564 bytes |
| full suite | **1,523 / 1,523 pass (142/142 files)**, the five banked pin suites included |
| seeds | booked `12,493,000–999`; **walked**: smoke `000–005`, receipts `100–107` (×3 arms), unit sampling `200–203`, the constructed cancel `300`. **BOOKED = WALKED** — no band is booked and left unwalked. |
| stats stream | **0 draws**. Floor stays **112,800**. |

---

## §SOURCES — the brief's own attributions, verified as the FIRST act (#291.5/#292.1)

The citation hunt stands at seven strikes and covers dispatch prompts, so the brief was checked
before a line was written:

| cite in the brief | verified |
| --- | --- |
| #293.3 as the binding spec, four clauses | ✅ verbatim in `PROGRAMME-RULINGS.md` (a) objective fidelity + the seen-unread parity · (b) the pin suite in the `carryChoiceSeat.test.ts` form · (c) the cancelled-wind-up re-deposit **or** an explicit counter · (d) PTP×PW documented/asserted. |
| PW-T0b §COMMANDER CORRECTIONS 2 · 3 · 6 · 7 as the clauses' origin | ✅ correction 2 = the objective (MED, load-bearing) · 3 = no permanent test coverage · 6 = the cancelled wind-up's one measured occurrence · 7 = PTP×PW latent. |
| `pricePassOption` and `passChoiceCandidateGids` in `src/ai/perceivedPassChoice.ts` as the objective and the candidate set | ✅ both exported there; the live chooser (`choosePerceivedPassTarget`) prices with the first and the brain enumerates with the second, at `PlayerBrain.ts`'s E3 block. |
| `tests/carryChoiceSeat.test.ts` as the house pin precedent | ✅ read in full; its shape (a dormancy describe · a mechanism describe · byte-identity walks · a League opt-in pin) is the shape used here. |
| the PW-T0b result commit as the diff-scope base | ✅ `7327ff0`. |

**No loose cite found in this brief; the hunt stays at seven.** One correction of the brief's own
framing is recorded in §CLAUSE (c): the ruling's first branch (re-deposit on cancel) is **not**
the branch the engine's semantics support, and the doc says why rather than doing it silently.

---

## §0 THE QUESTION, in football

⭐ **当他改了传球力度,他改的还是"同一个决定"吗?**

PW-T0b built a chooser that picked man and weight together — but it priced the man on reception ×
touch, while the v7 world's own chooser prices him on the armed value axis and will happily pick a
man whose corridor it cannot read. So an exam contrast would have answered a question nobody
asked: *does the weight axis help, or is a thinner mate-chooser just different?* This slice makes
the weight axis the **only** difference: same objective, same candidate set, same tie-break —
and then the rung, on top.

---

## §1 THE FOUR CLAUSES AS BUILT, mapped to #293.3

### CLAUSE (a) — OBJECTIVE FIDELITY AND CANDIDATE-SET PARITY

**The price of record:**

```
price(mate, rung) = pricePassOption(mate | the world's own flags).price
                    × [ q(threat@rung) · (1 − touchFail@rung) ]
                    ÷ [ q(threat@1)    · (1 − touchFail@1)    ]
```

* the **base** is the shipped number itself — `pricePassOption` is **called**, not restated, with
  `valueAxis: match.edsValueAxis`, so in v7 it is the armed value axis (`attemptValueAt`) and in a
  bare world it is the reception price, bit for bit;
* the **rung factor** is the shipped joining rule's own two factors — threat quintile × base
  touch-fail survival (the heavy curve stays STRUCK, #292.3) — **normalised at the reference
  rung**. `preferredPassPower` divides by the reference rung's survival precisely so that "at
  power 1.0 this is exactly the choice axis (no double counting at the reference point)"; because
  our base *is* the choice axis, the whole rung-dependent product must normalise to 1 there. Same
  property, carried over. **No new pricing table, no new constants** (M-PW.2 — the probe reads the
  chooser's own source and finds no numeric price literal in it);
* the **candidate set** is the shipped chooser's own: the same `passChoiceCandidateGids` window
  (6–30 m, GK excluded, sent-off excluded) handed in by the caller, and the same `executable`
  filter — so an **UNSEEN** man (whom the shipped chooser prices but cannot aim at) is not a
  candidate here either, and a **SEEN-UNREAD** man (whom it *can* pick, and whom the
  pre-amendment chooser dropped) is one, at the reference rung, at exactly the shipped price;
* the **tie-break** is the shipped argmax's own, restated so fidelity cannot depend on the
  caller's enumeration order: better price → **lower gid** → (within one mate) **lower rung
  index**, i.e. the softer ball (PW-T0a §CORRECTIONS 6);
* **admission** is unchanged where it can mean anything: a `null` from the oracle at a
  NON-reference rung retires **that pair and nothing else**, and no pair is ever dropped for a
  sibling rung's refusal (**measured 0**). The REFERENCE rung is now admitted on the *shipped
  chooser's* admission rule rather than the oracle's — that is what parity means, and it is what
  makes the collapsed-ladder world identical.

**⭐⭐ THE CONSEQUENCE, and this stage's key receipt:** collapse the ladder to `{1}` and the rung
factor is identically 1, so the chooser's argmax **is** the shipped chooser's argmax. That is not
an argument, it is a digest — see R1.

### CLAUSE (b) — THE PIN SUITE

`tests/pwWeightChooserSeat.test.ts`, in the `carryChoiceSeat.test.ts` form: **24 tests** in five
describes — Road-B dormancy (flag absent ≡ flag false, byte for byte, bare and v7; the ledger
all-zero; no preset and no League flag surface carries either key) · ⭐⭐ objective fidelity (the
byte-identity pin, the price identity, the same-man pin, candidate-set parity) · the
deposit/consume/wind-up threading with the **closed ledger** and a constructed cancel · per-rung
admission and no refusal inheritance · the PTP×PW refusal.

### CLAUSE (c) — THE CANCELLED WIND-UP: COUNTED, NOT RE-DEPOSITED

⭐ **The ruling offered two branches and the engine's own cancel semantics pick the second.**
Every cancel path in `resolvePendingPassWindup` (and the two upstream ones — a shot arming over a
live pass wind-up, and an arm evicting one) means the same thing: **no pass runs**, the ball stays
with the passer, and the channel that interrupted owns the outcome (the C7 I3 form). The body then
re-decides at his next owned tick, and the chooser re-prices the whole ladder against a world that
has moved. So the arm-time decision is **VOID, not pending** — and a re-deposit could never be
consumed anyway, because the deposit slot is gid+tick keyed and its only consumer has already
returned. A re-deposit would be a no-op dressed as a fix.

What is built instead is **a closed ledger**, so the silent loss becomes arithmetically
impossible rather than merely unlikely:

```
depositsNonDefault  =  struckAtChosenPower + windupChoiceVoided + depositsAbandoned + inFlightAtWhistle
```

with `windupChoiceVoided` counted at **all six** void sites and `depositsAbandoned` swept at the
tick boundary (a deposit is made and consumed inside one tick; anything still in the slot at the
next `step` was consumed by nobody, and is counted and cleared instead of left to rot).

### CLAUSE (d) — PTP × PW: THE ENGINE REFUSES TO BUILD THE WORLD

A `ptpPassLead` lead is priced and aimed at weight 1; a PW-chosen ball leaves the boot at another
pace, so the lead would ride a ball it was never priced for — with **zero** receipt coverage.
Rather than a comment, the `Match` constructor **throws** when both doors are armed, and the
message names the ruling (`#293.3`) and the slice that would lift it (the lead-at-rung pricing).
The pin and the gate both fail if that guard ever disappears, which is the "fails if both flags
ever co-arm without the pricing being built" the brief asked for, in its cheapest honest form.

---

## §RECEIPTS

### R1 ⭐⭐ THE FIDELITY RECEIPT — the key one

| | |
| --- | --- |
| receipt seeds, walked in **three** arms (door-shut v7 · pw armed at ladder `{1}` · pw armed at `{0.85, 1, 1.15}`) | 8 |
| ⭐⭐ collapsed-ladder worlds **BYTE-IDENTICAL** to the door-shut world (full walk, ball + all 12 bodies every 37th tick + result) | **8 / 8** |
| decisions the collapsed chooser actually made | **421** |
| decisions on which it moved the man off the shipped pick (`mateSwitches`) | **0** |
| non-default weights it deposited | **0** |
| unit-sampled decision moments (the shipped chooser re-asked at the same tick) | **160** |
| moments where the collapsed argmax = `choosePerceivedPassTarget`'s argmax (man **and** price) | **160 / 160** |
| candidate rows whose price = `pricePassOption(...).price` × its own rung factor | **1,231 / 1,231** |
| candidate sets identical to the shipped executable set | **160 / 160** |
| UNSEEN men ever admitted | **0** |

**And the contrast that makes it worth having:** with the full three-rung ladder, **8/8** worlds
differ from the door-shut world, and the man moves on **52 of 451** decisions (unit grain: 18 of
160 moments). Those switches are now attributable to a **rung** — the objective and the candidate
set are provably the same on both sides. ⛔ How many of them are *good football* is PW-T1's
battery, not this stage's.

### R2 ⭐ THE THREE-RUNG WORLD STILL CHOOSES WITH A SPREAD (a receipt, not the exam)

| rung | 0.85 | 1.00 | 1.15 |
| --- | --- | --- | --- |
| smoke walks (6 seeds, 340 decisions) | 109 (**32.1 %**) | 98 (**28.8 %**) | 133 (**39.1 %**) |
| receipt walks (451 decisions) | 144 | 137 | 170 |

⛔ **NOT the exam and NOT a football finding**: a handful of seeds, no denominators, no CI. What it
establishes is that re-basing the objective did not collapse the axis into a corner.

### R3 ⭐⭐ THE CLOSED CHOICE LEDGER — zero silent losses

| | |
| --- | --- |
| walks whose ledger closes exactly | **8 / 8** |
| non-default weights deposited | **314** |
| …struck | **314** |
| …voided by a cancelled wind-up | 0 |
| …abandoned (swept at a tick boundary) | 0 |
| …in flight at the whistle | 0 |
| **silent losses** | **0** |
| wind-up resolutions carrying a chosen weight | 229 |

**The constructed cancelled wind-up** (seed `12,493,300`): walk until a live `pendingPassWindup`
exists, put the ceiling weight on the record, then send the arm-time mate off — the engine's own
#180.3(i) INT-MATE cancel. The pass never runs and the counter moves **0 → 1**. The PW-T0b
anomaly (371 chosen vs 370 struck) can no longer hide anywhere: it would have to appear in one of
the four fate columns.

### R4 ⭐ DORMANCY RE-PROVEN — the artifact's fields TRUE this time

The PW-T0b method verbatim: 10 bare + 10 v7-armed matches on seeds `12,492,900–909` (that block is
CONSUMED; the seeds are re-walked **only** to reproduce the comparison and no new claim is made on
them), ball state + all 12 bodies sampled every 37th tick, pooled into one digest.

| | value |
| --- | --- |
| pooled digest at clean `HEAD` (pre-seam, commit `fa35af4`) | `5dafce81dfc26677147d6734c10118cfcff40b771c117da011a04eb44fc1f70c` |
| pooled digest **after this amendment**, flags off | **identical** (20/20 rows; gate `xByteIdenticalOff`) |
| league fingerprint (`scripts/fingerprint.ts 1337 2`, 142 matches) | `57b0bdab…c673` — **unmoved** |

⭐ **#293 correction 5 answered**: the artifact carries no field describing a run the probe did not
do. Every count in it is read off an actual walk or an actual call; the identity seeds' provenance
is stated inside the artifact; the SEEN-UNREAD population is published as **0 observed** with a
note saying so rather than being quietly implied.

### R5 ⭐ FULL SUITE GREEN, THE BANKED PINS UNTOUCHED

**1,523 / 1,523 pass across 142 files** (1,499 before + the 24 new pins), the five banked pin
suites (O1 · PTP · DLC · DLC-s · DV) included. No banked pin was edited: `git diff` against the
PW-T0b result commit touches **no** `tests/` file except the new one.

### R6 THE COST, read off the loop (the #293.4 discipline: quote the loop, not the ratio)

Per **executable** mate the chooser now asks the oracle **four** questions: one through the shipped
pricer at the literal power 1 (the base price) and three at `rung × orientation` (the rung
factors) — one more than PW-T0b's three, and the extra one is the shipped price itself. Over the
8 receipt walks: 3,936 rung questions and 1,438 shipped pricings, on 451 chooser decisions.
⚠ `pairsAsked` also accumulates on null-choice invocations while `matesPriced` does not, so **no
ratio is quoted** — the ×4 is a loop-reading, exactly as #293.4 requires. No wall-cost delta is
claimed.

---

## §SRC SCOPE — every touched file, and why

| file | why | gate-checked |
| --- | --- | --- |
| **`src/ai/passWeightChooser.ts`** (+153 / −23) | the re-base: it now CALLS `pricePassOption` for the base, forms the reference-normalised rung factor, keeps the shipped executable filter and restates the shipped tie-break; four parity counters added. Still pure — no Match, no truth, no RNG. | `gObjective`, `gParity`, `gSeam` |
| **`src/ai/PlayerBrain.ts`** (+24 / −3) | inside the SAME single flagged block: hand the chooser the world's objective (`match.edsValueAxis`) and the ladder (`match.pwPowerLadder ?? PASS_CANARY_POWERS`), and count `mateSwitches` + `depositsNonDefault`. No new call site, no new deposit site. | `gSeam` (1 call site · 1 deposit · 1 flag read) |
| **`src/sim/Match.ts`** (+96 / −4) | the fidelity instrument key `pwPowerLadder`, the new ledger fields, the stale-deposit sweep, `pwNoteWindupChoiceVoid` at the six void sites, and the PTP×PW refusal in the constructor. | `gSeam`, `gChoiceLedger`, `gPtpDoor` |
| `tests/pwWeightChooserSeat.test.ts` (new) | clause (b). Not `src`; declared here for completeness. | `gPinSuite` |

`git diff --stat 7327ff0 -- src` = **exactly these three files, 273 insertions, 30 deletions**, and
`xDiffScope` asserts the touched set equals the declared set (the diff is taken against the
**PW-T0b result commit**, so the receipt cannot go silently empty).

### ⭐ M-PW.4 — THE S∧¬T GUARD DEBT STILL DOES **NOT** FALL DUE

The CB seat's arming block (`if (cbSeat !== null) { … }`) is **byte-untouched**: the probe extracts
it by brace-matching (819 chars, sha256 `9b6fd059…`), asserts it names nothing of this seam, **and**
counts `cbSeat` lines in this slice's own diff — **0**. The debt named at #287.3 and restated at
#289.1 stays the CB seam's, undisturbed.

### ⭐ THE ONE NEW KEY, and why it is not a second door

`pwPowerLadder` is the objective-fidelity **instrument**: it exists so the rungs can be collapsed
to `{1}`, which is the only way to *prove* fidelity rather than argue it. It is read at exactly one
place, is inert unless `pwWeightChooser` is armed (pinned: a ladder with the door shut is
byte-identical), and is absent from `a4World`, from every preset and from the League's flag
surface — which cannot even express it.

---

## §HYGIENE — gate by gate

| gate | what it holds |
| --- | --- |
| `gDet` | a receipt walk re-derives bit-identically (two runs, one digest) |
| ⭐⭐ `xByteIdenticalOff` | the flags-off world digest **and** the league fingerprint equal their clean-`HEAD` values, after the amendment |
| ⭐ `xDiffScope` | the touched set **is** the declared set, against the PW-T0b result commit |
| `gArms` | every armed walk is `a4ArmedVersion === 7` with the door live; the engine clock is the default on all 30 walks |
| `gDose` | the L3-T1 dose artifact's **file bytes** are hashed and its digest re-derived from them |
| ⭐⭐ `gFidelity` | R1 at world grain: 8/8 identical, ≥200 decisions, 0 switches, 0 deposits, and the full ladder DOES move the world |
| ⭐⭐ `gObjective` | R1 at unit grain: every candidate price is the shipped price × its rung factor; the reference factor is exactly 1; the collapsed argmax is the shipped argmax |
| ⭐ `gParity` | the candidate sets are identical, no UNSEEN man is ever admitted, **and the sampling is a CAMERA** (traced and untraced walks give identical signatures) |
| ⭐⭐ `gChoiceLedger` | R3: every walk's ledger closes, zero silent losses, and the constructed cancel really armed, really cancelled and was really counted |
| `gAdmission` | zero refusal inheritance; the enumeration is rung-complete |
| `gSpread` | R2, receipt-grade |
| ⭐ `gPtpDoor` | clause (d) exercised: both armed throws · the message names the ruling and the missing slice · either door alone still builds · the bare world is unaffected |
| `gSeam` | 1 chooser call site · 1 deposit writer · 3 consumption sites (strike · arm · sweep) · 1 re-deposit · 1 flag read in the brain · 6 void-accounting sites · the chooser calls the shipped pricer and adds no constant · the orientation term still flag-scoped **by term-list diff** · the CB block untouched |
| `gPinSuite` | clause (b): the suite exists on disk, has ≥15 real tests, and names every clause's own identifier |
| `gSeed` | every claimed range inside the block, disjoint from every consumed band and from each other |
| `gStats` | this slice draws no stats stream; the floor is recorded |
| `gEnvClean` | whitelist-or-refuse (own vars **and** the engine's doors); a preflight may never write a canonical path |
| `gFaces` | the SERIALIZED artifact is parsed back off disk and the published receipts re-derived from the stored rows |
| `gHashEnvelope` | the body re-derives its digest from disk; a cross-out with a different envelope gives the identical digest; `wallMs`/`walkMs`/`identityMs`/`preflight`/`mode`/`head`/`outPath`/`generatedAt` are named exclusions |
| `gMutants` | coverage derived from the gate objects; **76 conjuncts, 76 mutants, all live**; ⭐ every conjunct carries its own non-vacuity, so no gate can pass on an empty set |

**Freeze discipline**: the probe was committed (`16ad2fb`) **before** a single battery seed was
walked, and its sha256 is `c351434a…` both at freeze and at result.

---

## §DOUBTS (the executor's own, unprompted)

1. ⭐ **The reference rung is admitted on the SHIPPED rule, not on the oracle's null.** That is
   what candidate-set parity requires — and it means the literal per-rung admission contract now
   governs only the two non-reference rungs. Given #293.2 already ruled that **the price is the
   admission**, and given PW-T0b measured the oracle-null channel empty in-window (0/5,304), I
   judged parity the more load-bearing property. A reader who expects "per-rung admission" to
   include the reference rung will not find it; it is stated here rather than buried.
2. ⭐ **A mate with NO reference read keeps its rungs at factor 1.** If the oracle refuses at 1.00
   but prices at 1.15, there is no normaliser, so those rungs carry the shipped price unmodified
   (never dropped — no refusal is inherited — but the tie-break then sends the mate back to the
   softest rung). It is the honest option that invents no constant, and its population is
   **measured 0** here (`rungsWithoutReferenceNormaliser`). If PW-T1 ever meets it, the counter
   will say so.
3. ⚠ **The SEEN-UNREAD parity branch is UNEXERCISED BY OCCURRENCE.** The whole point of clause
   (a)'s parity half is that the shipped chooser can pick a man whose corridor it cannot read —
   and in the walked worlds that class never appeared (`seenUnreadCandidatesObserved: 0`,
   `referenceAdmissionsWithoutOracleRead: 0`). The parity is structural (both the filter and the
   price come from `pricePassOption`), and the pin holds any such candidate to its shipped price
   if one ever appears — but **no measurement here proves that branch runs**. Labelled, not
   claimed.
4. **The cancel counter is proven by ONE constructed exhibit and zero natural occurrences.** Over
   8 receipt walks nothing was voided and nothing was abandoned, so the closure equation held
   trivially (314 = 314). The exhibit forces the INT-MATE path only; the other five void sites are
   proven by source count, not by occurrence.
5. **`chosenByRung` is indexed by the SUPPLIED ladder.** Under a collapsed ladder its slot 0 means
   "the only rung", not "0.85". Harmless today (the collapsed arm deposits nothing), but a reader
   comparing the two arms' rung arrays would be comparing different axes.
6. **The fidelity instrument is src surface that exists for a receipt.** `pwPowerLadder` is one
   more dormant key in an engine that already carries many. I judged it worth it because it turns
   "the objective is faithful" from prose into a digest; the alternative (proving fidelity only by
   re-deriving decisions in a probe) is exactly the one-shot form the verify already criticised.
7. **The ×4 oracle cost is now the enumeration's price** (three rungs plus the shipped pricing).
   No wall-cost delta is claimed; PW-T1's battery is where that would show, if it shows anywhere.
8. **The full-ladder mate-switch rate (52/451, 18/160 at unit grain) is NOT an effect size.** It is
   the receipt that the axis is now the only thing that can move the man. Whether those switches
   are the doctrine's 小力到脚 + 大力穿缝 is PW-T1's question.
