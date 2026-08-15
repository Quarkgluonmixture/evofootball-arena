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

* **every match the league builds** — the watched one AND every fixture `simRunner` simulates in the
  background — is built with learn + veto on, and learns into the **same league-owned books**;
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

*(to be written after the build — nothing below the line existed at freeze time)*
