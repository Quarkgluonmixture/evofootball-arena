# L3 — THE ?a4world=7 PLAY-TEST ENTRY (the defence book, LIVE in a world you can watch)

> Dispatched by ⭐ **#282.3(3)** (the L3-T2 stage doc's own arc rulings) = ⭐ **#282.4** (the same
> dispatch as it stands in `PROGRAMME-RULINGS.md`) — **one dispatch, two records**; both were read.
> The **SEVENTH** entry of the a4-entry family (#155/#156 → #167.5 → #184.2 → #211.3 → #269.4/#270 →
> here). **THIS RUNG ADDS NO MECHANISM.** The book (L3-T0), its learning (L3-T1) and its armed
> behaviour (L3-T2) are banked; the doors, the veto and the label ledger already exist in `src/**`
> and are hard-`false` in every production path. This rung is an **ENTRY**: it makes the world the
> arc has already measured reachable by a person with a phone, so the play-test gate can happen.

Status: **PRE-REGISTERED** — everything above [RESULTS](#results) was written and COMMITTED BEFORE
the entry was built (#266.3(c), the freeze-commit canon adapted to an entry rung: the design, the
dose form and the binding §HOW-TO-SEE brief are frozen; the receipts arrive only below).

## §-1 WHAT THIS RUNG IS FOR (the user's own criterion, #270 §-1 verbatim frame)

The arc's disease 1 is **乱抢** — the swarm dives in, gets taken away from, and dives in again
exactly as readily next time. #282.3(1) ruled it **TREATED IN MECHANISM**: a defence with its own
account book stops throwing the full-tilt dive (−71.6 % with the shipped season-one books, −100 %
with matured ones) and takes the challenge later, under control instead. But *treated in mechanism*
is not *treated*. The programme's standing criterion is the user's:

「…他能自己长出来配合，技巧，博弈，对抗，战术，并且能让我们真的看到。」

⇒ **THE GATE IS THE USER'S EYES, AND THIS RUNG IS THE DOOR TO IT.** Its only job is to put the
measured world on a screen honestly, with a brief that says what to look for and — just as
importantly — what NOT to expect.

## §CORRECTIONS-READ — the standing hunt (#276.3 → #281 → ⭐ STRIKE FOUR at #282.2(iv))

Every source below was opened **at its own corrections section** before any number was quoted. The
class has now bitten four times, so the checks are stated, not implied:

* **L3-T2 §COMMANDER CORRECTIONS OF RECORD + ARC RULINGS (#282.2/#282.3) — READ IN FULL.** Binding
  here: (i) the MDE-clearance overstatement (arm B's *controlled* cell is 0.996× its ex-ante MDE) —
  ⭐ **this rung quotes NO controlled-lunge effect as "clears its MDE"**, only the measured Δ and
  its own CI; (ii) the artifact stores no per-cluster rows, so **every T2 number quoted here is one
  of the 76 published point estimates or a CI printed in that doc**, never a re-derivation; (iii)
  the in-play-axis story is a **labelled hypothesis** and is NOT taught in §HOW-TO-SEE as a
  mechanism; (iv) **STRIKE FOUR** — the χ-share explanation quoted a second L3-C0 quantity
  post-sight, so ⭐ **this rung quotes NO L3-C0 / L3-C0b quantity at all**; its whole factual base is
  L3-T2 §RESULT and L3-T1's committed artifact.
* **L3-T1 §COMMANDER CORRECTIONS OF RECORD (#281.2) — READ IN FULL.** Binding here: (i) the
  published per-book minima were wrong (true: min 184 reckless, mean 217) — ⭐ **so the dose this
  entry ships is READ FROM THE COMMITTED ARTIFACT at run time, never a doc number**; (ii) the books
  sit within **0.04 pp** of their own world's truth, which is what makes "matured" a fair name;
  (iv) ⭐⭐ the **slow-knowledge problem** — one season reads 68.75 % against τ = 0.75 and τ clears
  only at **twelve** seasons. That correction is the entire reason a DOSE exists in this entry:
  without it a play-tester would have to watch twelve simulated seasons before the world the arc
  measured appeared on screen.
* **CB-FRONTEND-VISIBILITY-RUNG §COMMANDER CORRECTIONS + §DOUBTS RULINGS (#270.2/#270.3) — READ IN
  FULL.** This is the idiom this rung extends, and four of its rulings bind directly:
  (vi)(1) ⭐⭐ **the dose is NOT written to `info.genome`** — RATIFIED as the better form and as the
  form **future entries follow**; (iv) the **badge names the REQUESTED version**, stated honestly
  rather than pretending it reads the match oracle; (iv) ⭐ **E4 containment**: the DOSE is
  watched-match-only but the DOORS ride `League.matchFlags` **league-wide** while armed, so armed
  play moves the league table and the save's history; (i)+(iii) the ring/replay corrections, which
  this rung inherits unchanged (it adds no affordance).
* **L3-T0 (#280.2) — READ IN FULL.** Binding here: (ii) ⭐⭐ the count-proxy claim is **FALSIFIED of
  record** — decline-only may NOT be argued from arm counts. This rung therefore argues it exactly
  as T2 did: **structurally** (one consumption site, bare early return, in series after the
  untouched jockey gate), never from "the armed world threw fewer lunges".

## §ARMING — world 7, limb by limb (re-derived, never inherited)

World 7 = **world 6 + the two book doors**. It is the CB 过人 world (which the user has already
been asked to look at) with the L3-T2 battery's armed arms switched on.

| # | limb | value | source |
| --- | --- | --- | --- |
| 1 | substrate + CB doors | `a4MatchFlags(6)` — **CALLED, not copied** (which itself calls `a4MatchFlags(3)`) | the #270 entry's own composition line |
| 2 | door (d) | `l3DefenceLearn` = true | L3-T0 §SEAM; T2 arms A/B/C |
| 3 | door (e) | `l3DefenceVeto` = true | L3-T0 §SEAM (M-L3.3); T2 arms B/C |
| 4 | the style gene | `cbCarryProneness` = **1.0**, both teams (match-local views) | world 6, unchanged |
| 5 | the eye | **null** | world 6, unchanged — the L3 family carries no eye |
| 6 | evolution opt-ins | **OFF** | a fixed armed world mutates nothing (#165.2.ii) |
| 7 | the books | the **League's own per-franchise `DefenceAccountBook`s**, supplied by `League.createMatch` through its existing `matchFlags.l3DefenceLearn` fork, wiped by `League.startSeason()` (M-L3.2's season reset — **slice one's law, RULED to stay by #282.3(2)**) | `src/sim/League.ts`, untouched |
| 8 | the dose | L3-T1's committed matured cells, written at **watched-match construction** — §DOSE | #282.3(3) |

⭐⭐ **THE HONEST SCOPE ANSWER (#270.2(iv) asked of this family by name).** The charter asked
whether the book flags ride league-wide the way the CB doors do. **THEY DO, and they must, because
they are the same object**: `l3DefenceLearn` / `l3DefenceVeto` are members of `League.matchFlags`'
own key union (`src/sim/League.ts`), and the entry sets `league.matchFlags = a4MatchFlags(7)` in
`GameApp.applyEdsPreview` — the one E4-PREP line every world in this family has used since #14.3.
Concretely, while world 7 is armed:

* **every match the league builds ON THE MAIN THREAD** — the watched one, and every fixture the
  main-thread fast-sim finishes (`simFixtures` → `finishCurrentMatchHeadless`) — is built with
  learn + veto on and learns into the **same league-owned books**;
* ⚠⚠ *(CORRECTED OF RECORD AT RESULTS TIME — the frozen text above said "AND every fixture
  `simRunner` simulates in the background", and that is FALSE.)* **THE WORKER FAST-SIM PATH IS THE
  SHIPPED WORLD.** `League.toJSON` does not serialize `matchFlags`, so the league the sim worker
  rebuilds with `League.fromJSON` carries **no** doors at all. Measured, not read:
  a round-tripped league's next match reports `l3DefenceLearn=false, l3DefenceVeto=false,
  cbTouchPast=false` and `matchFlags === undefined` (test-pinned below). ⇒ **Fast-simming a season
  with the worker plays it in the SHIPPED world**, while the same fast-sim on the main-thread
  fallback plays it armed. This is not new with world 7 — it has been true of every world in this
  family since #155 — but it is stated here for the first time, and it means the league table an
  armed play-through produces depends on which sim path ran;
* ⚠ therefore **ARMED PLAY MOVES THE LEAGUE TABLE AND THE SAVE'S HISTORY**, exactly as armed A4
  v1–v3, MT v4–v5 and CB v6 play always has (precedent-consistent; surfaced again at this gate);
* the books themselves are **never serialized** (League `toJSON` does not name them and the L3 seam
  has no gene at all), so nothing survives a save/load — see §LAMARCK.

## §DOSE — the matured book, and why it is a DECLARED PRESENTATION CHOICE

**THE PROBLEM IT SOLVES** (#281.2(iv), #282.3(2)): the shipped law wipes the book every season and
one season is worth ~a tenth of the evidence the ordering needs. A player who arms world 7 and
watches one match would be watching a book that has learned almost nothing. The world the arc
actually measured — arm C, where the full-tilt dive is **gone** — takes twelve seasons to appear.

**THE FORM, and it is the simplest honest one.** At the construction of the **watched** match, each
of the two teams' books is **reset and re-filled with L3-T1's committed final-book cells, POOLED
over all 16 of that exam's books** (8 replicates × 2 sides, at the LAST checkpoint, M\* = 15
seasons, the `all` cells — the same field T2's `doseBook` reads).

* **Why pooled, not per-replicate**: a watched match has no replicate index and no honest way to
  invent one, and both teams are dosed symmetrically anyway (T2's own `doseBothTeams` frame). The
  pooled book is *one* number pair per group instead of sixteen, it is the aggregate of exactly the
  evidence the exam banked, and — the thing that matters for behaviour — **it orders the two groups
  the same way all 16 books do**, which is what the veto reads. Per-replicate would ship a choice
  ("which of the eight replicates is the user watching?") with no principle behind it.
* **Written through the book's own public `note(group, punished)`**, the T2 idiom verbatim: the only
  way a cell moves in the shipped seam, so a dosed book is a state the world could itself have
  reached. No field surgery, no new capability, no writer that does not already exist.
* **Read from the artifact at run time, never typed** (#281.2(i)): the cells come out of
  `docs/world-model/data/l3-t1-convergence-exam.json`, guarded by that artifact's own declared
  `resultSha256` (the `loadA4Tables` identity-guard idiom — if the file under that path is ever
  swapped, the entry refuses to arm rather than quietly play a different world).

⭐ **THE CHUNK MECHANICS (the #155/#156 opt-in-chunk precedent, and the binding constraint).** The
artifact is loaded by a **dynamic `import()`**, so Rollup emits it as its own async chunk
(`assets/l3-t1-convergence-exam-*.js`); the chunk is added to `OPT_IN_CHUNK_PREFIXES` in
`scripts/pwaAssets.ts`, which is the single place `isShellAsset` decides what the service worker
precaches. Consequences, all receipted below: the cells are **never in the main bundle path**,
**never in the SW precache**, and **never fetched** by a player who does not select world 7.

⭐⭐ **THE DOSE IS A DECLARED PRESENTATION CHOICE (#270's ratified form), not a world-model claim.**
Nothing here says a shipped world should start its defences matured — #282.3(2) ruled the OPPOSITE
for slice one (the season reset stays; it is simultaneously the fail-safe and the only thing that
feeds the group the mechanism is about). The dose exists so the eye can see, in one match, the world
that the instrument measured over fifteen seasons. **Dose-vs-empty is judged by the user's eyes.**

**THE NAMED TOGGLE (allowed by the dispatch, taken because it is cheap and because it is the
shipped law's own world).** One entry, two forms — **no second checkbox, no second world value**:

| form | how | the book at kickoff | which T2 arm it corresponds to |
| --- | --- | --- | --- |
| **dosed** (the default) | `?a4world=7` / the checkbox | matured, pooled | ⭐ **arm C** |
| **empty** | `?a4world=7&l3dose=0` | whatever the season has taught so far — empty on the first armed match | ⭐ **arm B**, the SHIPPED LAW's own season-one state |

`l3dose` is **not sticky** (deliberately: it is a debug contrast, not a world), it is only read when
world 7 is the armed world, and the badge names which form is on screen.

## §BADGE

🧪 **`CB+防守账本 · 剂量成熟`** (dosed) · 🧪 **`CB+防守账本 · 空账本`** (the `l3dose=0` contrast).

The family's mechanism unchanged, including its declared honesty limit (#270.2(iv)): the chip is set
from the version the user **REQUESTED**, not from a match-reading oracle. ⚠ **This entry widens that
caveat by one notch and says so**: for v6 the requested world and the armed world coincided because
arming was genes-only with nothing to load; **world 7 has an async chunk that can fail**, so the
requested world could in principle be named while the world is not armed. The entry closes that hole
the same way the A4 worlds do — **a failed load DISARMS to the shipped world (0), clears the sticky
choice and removes the chip**, so "chip present ⇒ armed" survives. The match-reading oracle
`l3ArmedVersion(match)` exists and the tests take their ground truth from it.

## §LAMARCK — the dose writes match-local state ONLY

* The L3 seam **has no gene**: no genome field, no `GENE_KEYS` entry, nothing serialized (L3-T0's
  G-NOLAMARCK is a prohibition, not a mitigation). The dose is **book cells**, and books are
  league-runtime objects that `League.toJSON` does not name.
* World 7 inherits world 6's `cbCarryProneness` dose in the **ratified** form (#270.3(1)):
  match-local genome views, never `info.genome`, so no dormant gene reaches the save or
  `crossoverGenomes`.
* Test-enforced below: the league serializes without `cbCarryProneness`, and a save round-trip
  carries no book state.

## §HOW-TO-SEE — the play-test brief (BINDING, #282.3(3); the data is L3-T2 §RESULT)

**How to switch it on.**

* Computer: ⚙ → 🧬 Experimental → tick **「CB+防守账本 · 会学的防守 (play-test)」**. The current match
  restarts immediately in that world — same fixture, same seed, rebuilt.
* Phone: open the game with **`?a4world=7`** on the end of the URL. It sticks, so the link only has
  to be opened once. **`?a4world=6`** goes back to the carry world WITHOUT the book (the A/B this
  gate is really about); **`?a4world=0`** puts the shipped game back.
* The chip in the corner names the world. **If the chip is not there, you are not in this world.**

**WHAT ACTUALLY CHANGED — in football, and it is one sentence.**
⭐ **防守不再全速飞铲了。上抢的次数几乎没变 —— 变的是他们都收着来。**
A defender still comes to challenge; he just stops arriving at a speed his own body cannot stop at.

**THE FOUR NUMBERS BEHIND THAT SENTENCE** (per team per match, L3-T2 §RESULT; the `?a4world=7`
default is the **matured** column, the `l3dose=0` contrast is the **season-one** column):

| what | shipped world (v6) | **v7 matured** (default) | v7 empty book (`l3dose=0`) |
| --- | ---: | ---: | ---: |
| full-tilt dives (RECKLESS) | 2.26 | ⭐ **0.00** (−100 %) | **0.64** (−71.6 %) |
| controlled challenges | 15.20 | **17.01** (+11.9 %) | 14.32 (−5.8 %) |
| **every** challenge | 17.46 | **17.01** (−2.6 %) | 14.96 (−14.3 %) |
| possession spells | 4.150 s | **4.065 s** (−2.1 %) | 4.065 s (−2.0 %) |

**WHAT TO COMPARE.** ⭐ **v6 vs v7**, not v0 vs v7 — v6 already changed the carrying, and the only
thing v7 adds is the book. Watch the same fixture twice: tick the box, watch, untick to v6, watch.

**THE GATE QUESTION.** ⭐⭐ **这看着像博弈,还是像磨蹭?** (Does the defence look like it is *choosing*
its moment — or does it look like it has stopped competing?) That is the whole question. #282's
§DOUBTS 5 says plainly that no probe can tell substitution from dithering; only an eye can.

Concretely, 博弈 would look like: a defender arriving and **shaping** instead of sliding; the
carrier being **shepherded** rather than swarmed; the tackle coming a beat later and actually
arriving. Dithering would look like: bodies **standing off** a man who is walking through them,
challenges that never come, defenders "not competing".

**WHAT NOT TO EXPECT — honestly, in advance:**

1. ⭐ **NOT fewer challenges.** In the default (matured) form total challenges are essentially
   unchanged (−2.6 %) and *controlled* challenges go UP 11.9 %. If you are counting tackles you will
   see the same football. The change is in **how** they arrive, not how many.
2. ⭐ **NOT a calmer, slower game — the world got slightly QUICKER.** Possession spells shortened
   ~2 %, turnovers rose ~2.7 %. This was **pre-registered in the opposite direction and falsified in
   sign** (#282.3(1)); the arc never promised a tempo cure and the reason for the inversion is an
   **untested story**, not a mechanism this doc will teach you (#282.2(iii)).
3. **NOT a change in the scoreline.** Goals move nowhere in either armed form.
4. **Fewer fouls/cards is the EMPTY-BOOK form's result, not the default's.** ⚠ The −6.5 % fouls /
   −6.4 % yellows the dispatch names were measured in T2's **arm B** (season-one books, i.e. the
   `l3dose=0` contrast); in the matured arm both movements are **unresolved**. Stated exactly this
   way because quoting the 6 % against the dosed world would be citing the wrong arm.
5. **NOT a world that keeps its lesson.** Every season boundary wipes the book (slice one's law,
   #282.3(2)); the dose is re-applied at each watched match so the default form always shows you the
   matured world.

**WHAT WOULD BE A REAL PROBLEM** (report it): defenders who never challenge at all; a carrier
walking unopposed; the chip naming world 7 while the football is plainly the shipped game.

## §SEEDS — band **12,485,000 – 12,485,999** (#282.4's allocation)

Sub-bands ledgered in §SEED LEDGER below; **booked = walked**.

## §RECEIPTS PROMISED (frozen before they were taken)

1. **ENTRY OFF ⇒ BYTE-IDENTICAL PRODUCTION**: multi-seed signature identity against a
   production-flag match, both ledgers all-zero, the production fingerprint re-derived unchanged.
2. **PRECACHE**: the l3 chunk emitted by a real `npm run build` and **absent** from `dist/sw.js`.
3. **THE ARMED SMOKE, THROUGH THE ENTRY'S OWN CODE PATH** — `a4MatchFlags(7)` + `armA4World(…, 7, dose)`
   called, never re-implemented: reckless lunges ≈ 0 with the dose, veto fires, counts REPORTED.
4. **LAMARCK**: the league serializes without the gene and without book state.
5. **THE FAMILY PINS**: a seventh world makes "no seventh world" pins false; they are fixed the
   declared way (#211.3/#270 precedent — each edit replaces a statement that is now false with the
   statement that is now true; no assertion weakened).

---

# RESULTS

Run: `npx tsx scripts/probes/l3-entry-rung.ts` (2026-08-15), on the build commit's own tree.
⭐ **THIS RUNG IS NOT A GATE BATTERY AND DOES NOT PRETEND TO BE ONE** (the #270 disposition,
inherited): it adds no mechanism and draws no statistic, so the machine-liveness canon (#268.3(a))
has no gate list to bite on here, and dressing a handful of assertions up as one would be exactly
the dishonesty that canon exists to catch. **What follows are assertions and counts, labelled as
such.**

## §IDENTITY — the shipped world, untouched

⭐ **THE STRUCTURAL ARGUMENT FIRST**, machine-read from `git diff --name-only` against the freeze
commit: this rung touches **5 files under `src/`/`scripts/`, of which ZERO are under `src/sim`,
`src/ai` or `src/evolution`** — `scripts/pwaAssets.ts`, `src/game/GameApp.ts`,
`src/game/a4World.ts`, `src/ui/A4WorldBadge.ts`, `src/ui/SettingsScreen.ts` (plus the new probe and
the new test file). **The engine is byte-untouched, so the OFF world cannot have moved.**

The measurement that backs it — 6 seeds, production flags, walked to the final tick, twice each:

| seed | signature | reproduces | dormant (`l3Defence` null · both doors false · CB ledger zero · `a4ArmedVersion` 0) |
| --- | --- | --- | --- |
| 12,485,000 | `122745d485dd…` | ✓ | ✓ |
| 12,485,001 | `207596928888…` | ✓ | ✓ |
| 12,485,002 | `06d88d683242…` | ✓ | ✓ |
| 12,485,003 | `360a85343f4c…` | ✓ | ✓ |
| 12,485,004 | `1aaa892074f1…` | ✓ | ✓ |
| 12,485,005 | `c5bacc77320e…` | ✓ | ✓ |

* ⭐ **THE PRODUCTION FINGERPRINT RE-DERIVED UNCHANGED**: `npm run fingerprint` (seed 1337,
  2 seasons, 142 matches) → `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.
* ⭐⭐ **SW PRECACHE CLEAN, on a REAL build** (`npm run build`, then the emitted `dist/sw.js` read
  back): **19 precache entries, ZERO containing `l3-`, ZERO containing `stage3`**. The dose chunk
  `assets/l3-t1-convergence-exam-Paj6Eu-d.js` (**45.61 kB / 10.86 kB gz**) is emitted and excluded,
  exactly as #156 established for the census tables.
* ⭐ **THE DATA IS IN THE CHUNK, NOT THE MAIN BUNDLE — checked by needle**: the artifact's own
  unique keys `"seasons"` and `learningCurve` appear in the l3 chunk and are **absent from
  `assets/index-*.js`**. (⚠ Honest note: the tokens `lunges` / `punished` DO appear in the main
  bundle — they are the shipped seam's own identifiers in `src/ai/defenceBook.ts`, which has been
  in the engine since L3-T0 and has nothing to do with this chunk.)
* ⚠ **THE ONE HONEST COST TO EVERY INSTALL, MEASURED** (not estimated): the same `vite build` run
  on the **freeze commit's own tree** in a throwaway worktree emits `index-*.js` at
  **1,369.98 kB / 403.38 kB gzipped**; with this rung it is **1,377.87 kB / 406.29 kB gzipped**.
  ⇒ **+7.89 kB raw / +2.91 kB gzipped = +0.72 % of the gzipped payload**, and the bulk of it is
  TEXT — the settings blurb and the two feed lines are long CJK strings. A player who never arms
  world 7 downloads those bytes, executes the world-7 branch never, and fetches **none** of the
  45.61 kB dose chunk.

## §SMOKE — the armed world, through the ENTRY's own code path

8 seeds, the **ENGINE DEFAULT 240 s clock** (`new League({ seed })`, never overridden), and the
app's own two calls — the probe calls `a4MatchFlags(7)` at construction and
`armA4World(match, null, 7, dose)` after it, with the dose obtained from **the entry's own
`loadL3Dose()`** (the same async chunk the browser fetches). No door, no flag and no cell is typed
in the probe, so the played world and the smoked world cannot drift.

⭐ **THE BASELINE IS AN INSTRUMENTED ARM, AND IT IS PROVEN TO BE WORLD 6.** The lunge counters this
smoke lives on are the seam's own (`fired[g]`), and the seam exists only when `l3DefenceLearn` is
on — a plain world-6 match reports zeros because it has **no meter**, not because it throws no
lunges (the first run of this probe did exactly that, and the row was thrown away rather than
published). So the baseline is world 7 with the veto door unset (T2's arm A), and this run
**re-proves the byte-identity in its own battery**: `baseline ≡ world 6` on **8/8 seeds**.

| arm | reckless / team / match | controlled / team / match | every | vetoes served / match | goals |
| --- | ---: | ---: | ---: | ---: | ---: |
| **baseline** (= world 6, metered) | **3.1250** | **18.7500** | 21.875 | 0 | 3.13 |
| **v7 EMPTY** (`?l3dose=0`) | **1.8750** (−40.0 %) | 16.3750 (−12.7 %) | 18.250 | 113.1 | 2.63 |
| ⭐⭐ **v7 DOSED** (the default) | ⭐ **0.0000** (−100 %) | **18.8750** (+0.7 %) | 18.875 | 65.3 | 2.50 |

⭐⭐ **THE ENTRY REPRODUCES THE T2-SHAPED WORLD, through its own arming**: with the dose, the
full-tilt dive is **gone — 0 reckless lunges on all 8 seeds** (T2 arm C: −100 %), the controlled
lunges do **not** collapse (+0.7 % here; T2 arm C: +11.9 %), and the veto **fires** (65.3 refusals
per match; 0 in the baseline, as decline-only requires). The dosed books read
`[18 8xx/23 9xx, 2867/3472]` at full time on every seed — the pooled dose plus the handful of
labels the watched match itself closed, which is exactly what "the book keeps learning while you
watch" looks like.

⚠ **THREE HONEST CAVEATS ON THIS TABLE, none of which the play-test needs to resolve:**

1. **These are 8 single matches, not T2's 840.** Percentages are printed because they are the
   shape the eye is being sent to look for, **not** because they estimate anything. No interval,
   no test, no gate is computed anywhere in this rung.
2. ⚠ **THE EMPTY FORM IS WEAKER THAN T2's ARM B, BY CONSTRUCTION.** Arm B's book carried a whole
   season's accumulated evidence; a freshly armed watched match starts near-empty and closes only
   ~30 labels, so its reckless cut here (−40 %) is smaller than arm B's −71.6 % and its controlled
   cut larger. That is not a discrepancy — it is what "the shipped law on match one" is.
3. ⚠ **A VETO FIRE IS NOT A REMOVED LUNGE** (#282 §DEV 6): one persisting opportunity is refused on
   many consecutive ticks. The fires column and the lunge columns must never be differenced.

## §CHECKS

| check | result |
| --- | --- |
| `npx tsc --noEmit` | clean |
| `npm run build` (tsc + vite build) | ✓ built in 4.21 s |
| `npm run fingerprint` | `57b0bdab…c673` — unchanged |
| new test file `tests/l3PlaytestEntry.test.ts` | **26 tests, green** |
| the six entry files together (a4 / V2 / V3 / mt / cb / l3) | **118 tests green** after the pin updates below |
| full suite (`npx vitest run`) | 141 files / 1,499 tests → **140 files / 1,498 green**, ONE red: see below |

⚠ **THE SUITE'S HONEST DISPOSITION.** The single RED is the arc's known load-timeout pattern, not
this rung's: `tests/formationEvolution.test.ts`'s ten-season ecology test hit vitest's 180 s ceiling
under full-suite load (2,434 s of test time across 141 files in a 298 s wall clock — that ratio IS
the contention). **Reproduced GREEN ALONE at 154.21 s** (3/3, `--no-file-parallelism`), consistent
with every prior round of this arc (CB rung: green alone at 153.8 s; L3-T2: the same file among its
five load-timeouts). It touches nothing this rung touches — no engine file moved.
⚠ **One honest sequencing note**: the full-suite run was launched before the 26th test (the
worker-scope pin, §DEV 7) was written, so it covered 25 of the 26; that file has been re-run in
full since, **26/26 green**, and the six entry files together are **118/118**.

**FIVE PIN UPDATES TO EXISTING TEST FILES, DECLARED** (the #211.3 → #270 precedent — adding a world
to the family moves the family's shared "the world set is exactly this" pins):

1. `cbPlaytestEntry.test.ts` — `?a4world=7` was pinned as "no seventh world exists"; a seventh
   world now exists. The pin is not deleted: it **moves up one** (`?a4world=8` is now the
   nothing-there case), so the family keeps a live assertion that the set is closed.
2. `cbPlaytestEntry.test.ts` + `mtPlaytestEntry.test.ts` — the badge-name count 6 → 7.
3. `a4PlaytestEntry.test.ts` — the GameApp arming-guard source pin, widened for `isL3World`.
4. `a4PlaytestEntry.test.ts` / `V2` / `V3` — the arming-call source pin, for the dose argument
   (`armA4World(this.match, this.a4Tables, this.a4World, this.l3Dose)`). ⭐ The "exactly ONE
   `armA4World(` call site" pin was NOT touched and still holds.
5. `a4PlaytestEntryV2` / `V3` / `mtPlaytestEntry` — the "world-model artifacts behind an
   `import()`" count 2 → 3, which is the pin that would have caught a dose smuggled into the main
   path.

**No other pre-existing test was touched, and no assertion was weakened**: each edit replaces a
statement that is now false with the statement that is now true.

## §DEV — the deviations, declared

1. ⭐ **THE DOSE IS POOLED, NOT PER-REPLICATE** (§DOSE). T2 dosed each of its 16 books with its own
   `(replicate, side)` cells; a watched match has no replicate index, so this entry sums them. The
   consequence is stated rather than hidden: **each of the two teams' books carries all 27,368
   labels of the exam's evidence**, roughly 16× a single T1 book — a *more* confident book than any
   T1 book was, holding the same ordering. Since the veto reads only the ORDER of two ratios, the
   behaviour is arm C's; the confidence is not a quantity anything in this entry consumes.
2. ⭐⭐ **THE BOOKS ARE THE LEAGUE'S, SO THE DOSE OUTLIVES THE WATCHED MATCH** (§ARMING, the
   #270.2(iv) form). `armL3World` resets and refills the two books of the fixture being watched;
   those objects belong to the League, so the two clubs carry a dosed book into whatever the app
   simulates next, until `League.startSeason()` wipes it. Every watched match re-doses, so what the
   user watches is always the matured world; the background league is a mixture. Not hidden, and
   not fixable at the entry layer without touching the engine, which this rung may not do.
3. **A FOURTH ARGUMENT ON `armA4World`** rather than a second arming call site: the family's "the
   arming cannot drift from the entry by construction" property (#270.2) is worth more than an
   untouched signature.
4. **THE `l3dose` PARAM IS NOT STICKY.** The world is sticky (`a4world`); the contrast is not. A
   user who reloads without the param is back in the default (dosed) form, and the badge says so.
5. **THE BADGE GAINED A TEXT OVERRIDE.** It names a FORM of the version passed, never a different
   version; the family's single-value invariant is untouched and the chip is still one element,
   relabelled in place (test-pinned).
6. **THE PROBE REPORTS COUNTS AND MEANS ONLY** — see §STATS.
7. ⚠⚠ **A FROZEN SCOPE CLAIM WAS FALSIFIED BY MEASUREMENT AND CORRECTED OPENLY** (§ARMING, the
   worker bullet): the freeze asserted the doors ride every background-simulated fixture. They do
   not — the worker rebuilds the league from JSON and `matchFlags` is not serialized. Found by
   tracing the path rather than trusting the frozen sentence, corrected in place with the
   measurement beside it, and now test-pinned so no later entry inherits the wrong belief.

## §DOUBTS — ⭐ what the commander is asked to adjudicate

1. ⚠⚠ **THE DISPATCH'S OWN ONE-LINER MIXES TWO ARMS, AND §HOW-TO-SEE DEPARTS FROM IT.** The brief
   was worded 「…fouls/yellows down ~6 %」 alongside the no-full-tilt-dives sentence, but T2's
   −6.5 % fouls / −6.4 % yellows are **arm B's** (the empty-book form); in the **dosed** default
   both movements are UNRESOLVED. §HOW-TO-SEE therefore attributes the 6 % to the `l3dose=0`
   contrast and tells the user not to expect it in the default. **Ruling wanted**: confirm that
   correction, or restore the dispatch's wording.
2. ⚠ **IS THE NAMED CONTRAST A SECOND ENTRY IN DISGUISE?** The dispatch allowed a named toggle "if
   cheap" and forbade multiplying entries. What shipped is ONE world value, ONE checkbox and ONE
   URL world param, with a non-sticky debug param for the book state — but it does put two
   *worlds* (T2's arm B and arm C) behind one entry, and the badge is what distinguishes them. If
   the commander thinks the gate is cleaner with the matured form alone, deleting the contrast is
   a ~15-line revert.
3. ⚠ **THE DOSED BOOK IS 16× MORE CONFIDENT THAN ANY BOOK THE WORLD EVER GREW** (§DEV 1). Nothing
   in this arc consumes confidence — the veto compares two ratios — so nothing measured changes.
   But "a state the world could itself have reached" is doing slightly more work here than it did
   in T2, where each book got its own history back. **Ruling wanted**: accept pooling as the play
   form, or dose from ONE named replicate (e.g. replicate 0, both sides) and say which.
4. ⚠ **ARMED PLAY STILL MOVES THE LEAGUE TABLE AND THE SAVE'S HISTORY** (§ARMING), and world 7
   widens it: the *learning* doors now ride every simulated fixture too, so a season played with
   world 7 armed is a season of book-armed football throughout. Precedent-consistent (#270.2(iv)),
   restated because the surface is bigger this time.
5. **NO PIXEL EVIDENCE IS OFFERED, BY DOCTRINE.** This rung adds no affordance; the CB rung's
   visibility layer is what is on screen, unchanged. Whether 博弈 is legible is the gate's question,
   and it is asked of BEHAVIOUR (#270.3(4)'s registered honesty) — the choice to decline a
   challenge has no marker of its own, deliberately.

## §STATS

**ZERO drawn.** The receipts run computes counts, means and signature comparisons — no test, no
interval, no gate. Stats budget consumed: **0**; the ledger stands where #282.4 left it
(next ≥ 111,600).

## §SEED LEDGER — booked = walked

| sub-band | n | use | walked |
| --- | --- | --- | --- |
| 12,485,000 – 12,485,005 | 6 | §IDENTITY — the shipped world, twice each | ✓ 6/6 |
| 12,485,100 – 12,485,107 | 8 | §SMOKE — 3 arms + the baseline≡world-6 identity pair | ✓ 8/8 |
| 12,485,900 – 12,485,902 | 3 | `tests/l3PlaytestEntry.test.ts` — the league fixtures (…900/901) and the in-suite OFF identity walk (…900–902) | ✓ 3/3 |

**Total booked = 17, total walked = 17.** The rest of the band (12,485,006–099, 12,485,108–899,
12,485,903–999) is VIRGIN of record.

## §ROAD B — nothing ships

The entry is default-OFF everywhere, the two doors are absent from every preset and every League's
`matchFlags`, no production genome carries the CB gene, no book exists in an unarmed league, the
save is untouched and the production fingerprint is unchanged. What a non-opt-in player pays is the
**2.91 kB gzipped** measured above, and nothing else.

## §NEXT — THE PLAY-TEST (USER GATE)

The arc pauses at the user's eyes: **乱抢少了吗,博弈看得出来了吗**. §HOW-TO-SEE is the recipe, the
comparison is **v6 vs v7**, and the honest prediction is written there rather than discovered at the
gate: **the dives are gone, the challenges are not** — and whether that reads as 博弈 or as
dithering is the one question no probe in this arc can answer.

## §COMMANDER CORRECTIONS OF RECORD (#283.2, 2026-08-15)

The verify: OFF-identity cross-tree on its own seeds (10/10 both shapes); the dose re-pooled
independently in Python (byte-identical; the pooled book declines RECKLESS only); the chunk proven
opt-in (one dynamic import; the main bundle carries none of the cell numerals); the armed smoke
reproduced through the entry's own calls on virgin seeds (reckless 0.0000 every seed; decline-only
intact); all five test-pin edits exactly as declared, none weakened. VERDICT: PASS-WITH-FINDINGS.
Adjudicated:

* **(i) MED — the every-install cost was a CROSS-ENVIRONMENT comparison**: the armed side
  reproduces, the baseline does not (deterministic builds prove it). CORRECTED OF RECORD: the
  rung costs **+4.34 kB raw / +2.06 kB gz / +0.51 %** (the published +2.91/+0.72 % overstated —
  conservative direction, but a measured claim must reproduce).
* **(ii) MED — §DOUBTS 1 IS WITHDRAWN, premise false**: the dispatch attributed the −6.5 %/−6.4 %
  discipline row correctly to the SHIPPED arm (both records read at source); the ruling requested
  does not arise. ⭐ Noted for the canon: this is the citation class's MIRROR — a doc accusing a
  source of an error it did not make. Same cure: OPEN the source before asserting either way.
* **(iii) LOWs**: one table header calls v6 "shipped world" (v6 is itself an armed play world;
  the shipped game is v0 — self-corrected two lines later, now here too) · ⭐ the empty-arm's
  smoke "−40 %" is SEED-FRAGILE and DOES NOT TRAVEL TO THE GATE (verify's own seeds: 0 % change,
  1 veto/match — the honest `?l3dose=0` expectation is "weak by construction; a single match may
  show nothing") · the dose guard checks the artifact's DECLARED sha field, not a content hash
  (family idiom; §DOSE's "refuses to arm if swapped" softened accordingly).
* **(iv) RATIFIED AS FOUND BY THE AUTHOR**: ⭐⭐ the §DEV 7 self-falsification — `League.toJSON`
  omits `matchFlags`, so WORKER-SIMMED fixtures play the SHIPPED world while only main-thread
  matches (watched + fallback) play armed — TRUE OF THE ENTIRE ENTRY FAMILY SINCE #155, stated
  now for the first time, test-pinned, and consistent with the performance diagnostic's
  independent finding. #270's E4 correction is REFINED by this (armed play moves league history
  through main-thread matches only). Also of record: the dose outlives the watched match (the
  books are the League's until the season boundary) — declared, not fixable at entry grain.
