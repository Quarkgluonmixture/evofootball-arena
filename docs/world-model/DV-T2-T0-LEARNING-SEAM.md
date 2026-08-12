# DV T2-T0 — the DORMANT LEARNING SEAM (`dvLearnedMap`, 自己的账本)

Status: **PRE-REGISTERED, then BUILT + RUN the same round** (the OBM-T0 / CTB-T0 / PTP-T0 /
DLC-T0 / DLC-T0s / **DV-T0** two-part form).

The frozen law, the seam, the read-fork inventory, the gate list, the seed ledger, the PIN
INVENTORY and the Road B statement below were written **before** the receipts ran (the
frozen-before-sight rule); the measured numbers arrive only in [§RESULT](#result--the-gates-run)
at the foot, and every number there is quoted FROM the committed artifact.

Authority chain: the **DV-T2 LEARNED-MAP CONTRACT**
[`DV-T2-LEARNED-MAP-CONTRACT.md`](DV-T2-LEARNED-MAP-CONTRACT.md) §2 — **M-DV2.1** (THE PASS-LEVEL
LABEL: *"A delivery aimed into zone z whose possession outcome is a LOSS followed by a concession
inside the census's OWN 10 s window writes one punishment tick (z, 1); a delivery into z that is
not so punished writes (z, 0). The label's index = the AIM zone"*), **M-DV2.2** (THE ACCOUNT BOOK:
*"Per-team in-world state; belief[z] = the running frequency of punishment over the team's OWN
deliveries into z (zero-constant running-mean form). Windowing/decay is OUT of slice one — one
season's book, reset at the season boundary (structural, not tuned)"*), **M-DV2.3** (THE WRITE
PATH: *"the truth-dosing instrument's exact write path with the SOURCE swapped from the census
artifact to the team's own book … Armed = `dvDeliveryValue` + a NEW explicit learning flag … the
genes stay born-absent; learning OFF ⇒ byte-identical world"*) and **M-DV2.4** (SCOPE: the
exposure weight is NOT learned). Bound by ruling **#255.2**, dispatched by **#256.4**. Rulings
**#246** (the METHOD is reality's, the NUMBERS are this world's, the SHAPE is the fidelity check) ·
**#247** (⭐⭐ 前场丢球危险不是先验的,是挣来的 — the TRUTH/BELIEF split) · **#248.1** (structural
dimensions may be hand-built; the ANSWERS must be earned) · **#250.3** (the §HONESTY 8
commensurability question — *fixed at the source here*, because the book is indexed by AIM) ·
**#251.3 / #252.3 / #256.2** (⭐⭐ derive your own predicates; **every composite gate's liveness
claim states its coverage set**) · **#256.1** (the frozen truth table) · **#256.3** (the RARITY
FACT — T2-T1's design crux, published for the drafting, *not* this stage's to solve) · **#163** ·
**#181.2** · **#197-M1** · **#200** · **#203** · **#229.2**.

The banked work this stage reuses **verbatim** and does **not** touch:
[`DV-T0-DORMANT-SEAM.md`](DV-T0-DORMANT-SEAM.md) — ⭐ **THE FORM AND THE CONSUMER**: its
`dvLossBelief` gene is the representation this seam writes, its `receptionZoneIndex` is the
classifier this seam indexes by (imported, never re-typed), and its identity stack is the one this
stage extends. [`DV-T2-C0-PASS-LEVEL-CENSUS.md`](DV-T2-C0-PASS-LEVEL-CENSUS.md) — ⭐⭐ **THE
LABEL'S FROZEN SEMANTICS AND THE YARDSTICK**: the chain rule, the loss stamp, the one-to-one
attribution and the 10 s window are ITS (through DV-C0 / #215.3-H1), and its measured table is the
sanity read this stage's REPORTED smoke is published beside — and is **instrument-side for ever**
(G-NOTABLE). [`DV-C0-LOSS-COST-CENSUS.md`](DV-C0-LOSS-COST-CENSUS.md) — the window's origin.

---

## §LAW — the frozen law of the account book

```text
THE LEARNING DOOR (M-DV2.3), TWO limbs, and they do DIFFERENT things
  learns    ⇔  match.dvLearnedMap === true          [this stage's NEW flag]
  consumes  ⇔  match.dvDeliveryValue === true       [DV-T0's banked door]
              AND a NON-ABSENT dv gene              [DV-T0's banked arming rule]

  ⇒ armed to LEARN alone, the books fill and NOTHING reads them: byte-identical (G-BORN).
  ⇒ armed to learn AND consume with an EMPTY book, no gene is written, so DV-T0's own
    seat is null: byte-identical (G-EMPTY — the flag's G-ZERO analogue).
  ⇒ armed to learn AND consume with a book of ZERO punishments, the belief is [0,0,0] and
    DV-T0's IEEE identity carries it: byte-identical (G-EMPTY, second form).
  ⇒ the world moves only once a PUNISHED label has closed. Learning is EARNED or it is
    nothing.

THE LABEL (M-DV2.1) — semantics TRACED to T2-C0/DV-C0, re-typed nowhere
  a DELIVERY   = a ground pass STRUCK: a `performPass` call the ENGINE's own guard let
                 through, tested by the engine's own `lastPassKind` replacement (T2-C0's
                 idiom), which is exactly the family the DV pricer prices (DV-T0 §SEAM's
                 scope note: no loft, no through ball, no cross, no cutback).
  its INDEX    = receptionZoneIndex(team.localX(aim.x)) — the SHIPPED classifier, in the
                 PASSING (= the would-be LOSING) team's own frame. ⭐ THE §HONESTY 8
                 COMMENSURABILITY MISMATCH IS FIXED AT THE SOURCE: the book's index IS the
                 pricer's read IS T2-C0's yardstick index.
  a CHAIN      = a maximal interval of same-team control while the ball is in play,
                 SUSPENDED while it is loose, ended by the opponent establishing control
                 (a LOSS, stamped at that moment on the public clock) or by the ball going
                 dead / a goal / the whistle (NOT a loss).
  PUNISHED     ⇔ the delivery's chain ended in a LOSS and its team conceded inside
                 DV_LEARN_WINDOW_S of that stamp, under the frozen attribution: goals in
                 chronological order, each to the LATEST not-yet-attributed loss of the
                 conceding team inside [t_goal − W, t_goal]; ONE-TO-ONE.
  ⭐ THE LABEL CLOSES AFTER THE WINDOW. A loss whose window is still open is not yet
    knowledge; the book moves only when the label closes (and at the whistle, where
    everything closes with what it knows because nothing more can arrive).
  ⚠ CHAIN-LEVEL, so several deliveries share one punishment (#256.3 / T2-C0 §NON-CLAIM 6).

THE BOOK (M-DV2.2), per team, per zone z ∈ {own, middle, final}
  deliveries[z] += 1 on every CLOSED label into z;  punished[z] += 1 when it was punished.
  belief[z]      = punished[z] / deliveries[z], the ZERO-CONSTANT running mean
                   (a zone with no observation reads 0 — exactly `dvLossBeliefVector`'s
                   own degradation).
  ⭐ AN EMPTY BOOK SERVES NO BELIEF AT ALL (`null`), so the gene stays ABSENT: a team that
    has learned nothing knows nothing, and DV-T0's born-absent semantics survive arming.
  SEASON RESET: the whole book is wiped at the season boundary — structural and untuned,
    exactly M-DV2.2's words. NO decay, NO half-life, NO window, NO configurability the
    contract does not name (if T2-T1's drafting amends the reset clause, that is its own
    ruling and its own commit).

THE WRITE PATH (M-DV2.3)
  on every closed label:  g.dvLossBelief = [...book.beliefVector()]   for the team's
                          MATCH-LOCAL gene views (baseGenome, effGenome)
  — the truth-dosing instrument's own write, with the SOURCE swapped from the census
  artifact to the team's own book. The EXPOSURE WEIGHT IS NOT TOUCHED (M-DV2.4: it has no
  truth table and is not learned).

⭐⭐ EPISTEMIC HONESTY, and it is closed at the IMPORT LIST. `deliveryAccountBook.ts`
  imports the belief vector's WIDTH and nothing else. It cannot name `Match`, `Player`,
  `Team`, a percept snapshot or a file path, so it cannot read an opponent's internals, a
  percept channel or any census artifact. Everything it is told is (a) MY OWN delivery and
  its aim, (b) who has the ball, which everyone on the pitch can see, (c) THE PUBLIC
  SCOREBOARD and THE PUBLIC CLOCK. G-EPI gates the import list and the named members.

NO PREDICATES (#200) — the complete conditional set is GATE, SELECTOR, WINDOW, EMPTY
  GATE     the arming rule (the one flag fork ⇒ the nullable ledger seat).
  SELECTOR the zone index — DV-T0's own, and DV-T0's own declaration stands: it decides
           WHICH counter moves, never whether an action happens.
  WINDOW   the label's own definition (`t_loss ≤ t_goal ≤ t_loss + W`); it decides how an
           event is REMEMBERED, after the fact, never what any player does.
  EMPTY    `total === 0 ⇒ no belief` — the born-absent rule, not a threshold on a value.
  Nothing in this seam can cause, suppress, delay or redirect a single action. It counts.
```

### ⭐ The sharpenings, declared (the contract is silent on each)

1. **THE OBSERVATION POINT IS THE HEAD OF `step`**, which reads exactly the state the
   previous step left — the point T2-C0's own walker observes. The clock stamps agree
   because `simTime` only advances inside the body. Chosen over an end-of-`step` hook
   because that would have required restructuring the shipped `step` (four exits), and
   over an in-body hook because that would have read a half-advanced world.
2. **A LOSS WITH NO DELIVERY STILL ENTERS THE PENDING LIST.** The attribution is
   ONE-TO-ONE over the team's LOSSES, so a delivery-less loss can legitimately absorb a
   concession that would otherwise land on an older chain. Dropping it as "teaches
   nothing" would silently make the book punish MORE than the census's own rule does.
3. ⭐⭐ **THE WRITE TARGETS THE MATCH-LOCAL GENE VIEWS ONLY** (`baseGenome` / `effGenome`,
   de-aliased at arming), **never the franchise's `info.genome`**. `crossoverGenomes`
   copies a present `dvLossBelief` from parent A **even with the `evolveDeliveryValue`
   opt-in shut**, so writing the franchise object would open the LAMARCK channel the
   contract names as a LATER slice (§4: *"no evolution-learning interplay"*). Learning
   dies with the match; the BOOK is what carries, and only a League that armed the door
   holds one. **G-NOLAMARCK measures this**, it does not promise it.
4. **THE BOOK IS THE SEASON'S, HELD BY THE LEAGUE.** `MatchConfig.dvLearnedBooks` hands
   the two books in; omitted, an armed Match learns into fresh books that die with it.
   The League allocates them lazily (only when its own `dvLearnedMap` flag is set) and
   wipes them in `startSeason`, which is where the season boundary already lives.
5. **THE WINDOW CONSTANT IS ON THE SHAPE SIDE OF #247.** `DV_LEARN_WINDOW_S = 10` is the
   STRUCTURE of the question, exactly as `DV_THIRD_BOUNDARY_LOCAL_X` is — legally
   hand-built per #248.1. **G-TRACE-WINDOW proves it IS the two committed censuses' own
   primary window and a member of the #218 family by reading THEIR artifacts** —
   instrument → check, never code → table. No measured RATE is anywhere near `src/**`
   (G-NOTABLE).
6. **NO RENDER CUE, NO FEED LINE, NO NEW ACTION TYPE, NO SAVE FIELD.** The book is never
   serialized; a save round-trip carries no learning at all.

## §HONESTY — the epistemic limits, stated plainly

1. **NO NEW CHANNEL** (§LAW's import-list clause). The seam adds a MEMORY of public
   events, not a new sense.
2. ⚠ **THE BOOK IS A TEAM'S, NOT A PLAYER'S.** Credit-to-the-individual — the punishment
   landing on the man who erred — is the contract's own NAMED LATER SLICE (§4, per-player
   books). Slice one gives the whole side one book, which is a simplification of exactly
   the kind #253.2 flagged, and it is declared rather than hidden.
3. ⚠ **THE LABEL IS CHAIN-LEVEL AND THE EVENTS ARE RARE.** #256.3's rarity fact
   (punished events per team-match: own 0.3925 · middle 0.7175 · final 0.1000) is a fact
   about the LABEL, and it is T2-T1's sizing problem, not this stage's. A short book is a
   noisy book; this stage neither hides that nor fixes it.
4. **A WRONG BOOK IS LEGAL AND IS STYLE** (#247 intact). Nothing here gives any team the
   census's map; each map is earned from own events, and a team that never plays into its
   own third believes nothing about it.
5. ⭐ **THE MEASURED SANITY READ IS A SANITY READ.** The REPORTED smoke publishes the
   filled books' rates beside T2-C0's census rates. Ballpark agreement is a plumbing
   check; **divergence is a finding to REPORT, never to fix**, and neither direction
   adjudicates anything (#203).
6. **THE ONE-SEASON RESET IS A MEMORY SIMPLIFICATION** (contract §7's own declaration:
   real memory decays, it does not reset).
7. ⚠ **THE OBSERVATION LAG AT THE WHISTLE.** The final tick's state is read at
   `endMatch`, not at a following step. For the BOOK this is exactly equivalent, because
   a last-tick loss can no longer be punished and lost-unpunished and survived write the
   same tick (`0`). It is stated because the two classes *differ for the census* and do
   *not* differ for a book.

## §SEAM — the mechanism (all of it dormant)

### The flag

**`dvLearnedMap`**, a new **explicit** `MatchConfig` boolean, initialised
`cfg.dvLearnedMap ?? false` (`Match.ts`) — the `dvDeliveryValue` / `dlcStrikePlane` form.
**Never** `EDS_BUNDLE_ARMED`, never env-armed, never default-ON, never bundle-defaulted:
**absent from `src/game/a4World.ts` entirely**. It gets its own `League.matchFlags` key so a
probe world can arm it explicitly, and that key changes no default.

### The genes

**NONE.** This stage adds no gene, no `GENE_KEYS` entry and no opt-in. It WRITES the banked
`dvLossBelief`, whose born-absent status is preserved by the empty-book rule.

### ⭐ The READ-FORK INVENTORY (a NAMED deliverable)

Exactly **ONE** `dvLearnedMap` fork in `src/**` that produces state. Every consumer keys off the
nullable seat it produces, never off the flag again:

| # | site | file | what it feeds |
| --- | --- | --- | --- |
| **1** | `this.dvLearn = this.dvLearnedMap ? new DeliveryLabelLedger(…) : null;` — THE LEDGER FORK | `src/sim/Match.ts`, the constructor | the arming rule (flag ⇒ a ledger seat; otherwise `null`), the gene-view de-aliasing and the carried-book write |
| **2** | `...(this.matchFlags?.dvLearnedMap === true ? { dvLearnedBooks: … } : {})` — THE SEASON FORK | `src/sim/League.ts`, `createMatch` | which two books the fixture learns into; allocates nothing when shut |

Downstream, and counted separately: **FOUR** `this.dvLearn !== null` consumer sites (the
constructor's own de-aliasing block, `step`'s observation, `performPass`'s capture,
`endMatch`'s whistle), **ONE** `this.dvLearn === null ? null : this.lastPassKind` capture
pre-read, and the two private methods they call. Everything else that names the flag or the module is a declaration, an init, a
type, an import, the League union key or the book module's own body — enumerated in the artifact
with file:line and class, **zero unclassified**.

**Byte-identity is structural, not hope**: with the fork not taken, `dvLearn` is `null`, no
observation runs, no book exists, no gene is written, and every consumer site is a `!== null` test
on a field.

### Untouched (restated as a prohibition)

Every banked seam's own law, gene, flag, module and tests — `passLeadSeat.ts`,
`deliveryChoiceSeat.ts`, `strikePlaneSeat.ts`, **`deliveryValueSeat.ts` (this stage does not edit
one byte of the pricer it feeds)**, all four fork lines, the strike plane's precedence guard, the
banked led-strike statement · the `MakeRun` through-ball licence path · the lofted switch and its
`d > 24` gate · the automatic ground bender · the cross, the cutback, the keeper's outlet ·
⚠ `whetherEye` and its certified hold table (the #248 archetype debt) · `TeamBrain` designation and
every licence · the OBM seat and the CTB plane · `perceptionSnapshot.ts` · `a4World.ts`'s flag set
and all three play-test worlds · the render layer · `evolve.ts` and every evolution path ·
`League.toJSON` / `fromJSON` (no save field) · `performPass`'s signature and body.

---

## §PINS — the PIN INVENTORY (a NAMED deliverable)

**Nothing is silently renegotiated**; had any of these broken, the standing instruction is
STOP-and-report, never a test edit.

| # | pin | where | class | disposition |
| --- | --- | --- | --- | --- |
| 1 | ⭐⭐ the **DV-T0 fork pin** — *exactly one* `match.dvDeliveryValue` line, asserted as EXACT TEXT, and `this.dvDeliveryValue = cfg.dvDeliveryValue ?? false;` | `tests/dvDeliveryValue.test.ts` | source text | **UNTOUCHED and GREEN** — this seam adds a fork of its OWN and edits none of DV-T0's |
| 2 | ⭐⭐ the **DLC-T0 / DLC-T0s NO-TASTE pins** (the two banked pricer slices under their `*= ` / `attrs.` / gene-name bans) | `tests/dlcDeliveryChoice.test.ts`, `tests/dlcStrikePlane.test.ts` | source text | **UNTOUCHED and GREEN** — this stage adds nothing to the pricer at all |
| 3 | ⭐ the **three banked G-FORK pins** (`ptpPassLead` / `dlcDeliveryChoice` / `dlcStrikePlane`, exact text) | those three suites | source text | UNTOUCHED and GREEN |
| 4 | ⭐ the **ZERO-NEW-STRIKE pin** — `match.performPass(` exactly 3× in `PlayerBrain.ts` | `tests/dlcDeliveryChoice.test.ts` | source text | UNTOUCHED and GREEN — this stage adds no strike statement; its capture wraps the *delegation*, `mech.performPass(` still 1× |
| 5 | the whole banked `dvDeliveryValue` (23) / `ptpPassLead` (24) / `dlcDeliveryChoice` (19) / `dlcStrikePlane` (21) suites | those files | mechanism | UNTOUCHED and GREEN, verbatim, re-run in §CHECKS |
| 6 | the **production fingerprint** `57b0bdab…c673` | asserted in 13 test files | league identity | UNTOUCHED — and independently recomputed as G-IDENT / X-FP-PROD |
| 7 | the 5v6 sanity invariant and the goal-level shape pin | `tests/cards.test.ts`, `tests/formations.test.ts` | full-match directional | UNTOUCHED — flag born false ⇒ byte-identical world |
| 8 | ⚠ the **save round-trip pins** (`careers.test.ts` v7 round-trip and the League JSON suites) | those files | persistence | UNTOUCHED — the book is never serialized, and `fromJSON`'s `Object.create` path is handled explicitly (`matchFlags?.`) |
| 9 | the whole suite | every pre-change test file (plus this stage's new one) | everything downstream | G-SUITE runs it in full. **No test file was edited by this stage**; the only `tests/**` change is the NEW `dvLearnedMap.test.ts` |

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

⭐ **#256.2's standing lesson, applied ex ante: EVERY composite gate below states its COVERAGE
SET** — which conjuncts a mutant proves live, and which are read-only reads with no mutant. No
liveness claim is broader than its mutant list. `head` / wall-clock / paths / **all machine
timings** ride the UNHASHED envelope (#197-M1, and DV-T0 §GATES' correction of record), so
`resultSha256` re-derives at any commit or path.

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with the flag absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — all three RECOMPUTED IN-PROBE. Semantics: the sim path's RNG-stream receipt | HARD |
| **X-FP-PROD** | the 1337 row IS the production fingerprint | HARD |
| **G-OFF** | per-match whole-run signature **including the rng stream state**: flag ABSENT ≡ flag FALSE, in BOTH world shapes, on every receipt seed. Semantics (#194): CONFIG EQUIVALENCE only | HARD |
| ⭐ **G-BORN** | `dvLearnedMap` ARMED ALONE (the consumer door shut) ≡ OFF, byte for byte, both shapes, every receipt seed — **with the machinery LIVE**: the same runs must close **> 0** labels and fill **> 0** book cells (the non-vacuity conjunct, so this is not a gate on a dead path) | HARD |
| ⭐⭐ **G-EMPTY** | **THE FLAG'S OWN G-ZERO ANALOGUE, three forms.** (a) STRUCTURAL: an empty book serves `null`, so no gene is written and DV-T0's seat is `null`. (b) PREFIX: BOTH doors armed, the world is byte-identical to OFF for every tick **up to and including** the tick before the first belief write, on every receipt seed — and that prefix is non-empty. (c) ZERO-PUNISHMENT: a book with deliveries but no punishment serves `[0,0,0]`, and both doors armed on such a book leave the world byte-identical (DV-T0's IEEE identity, re-measured through this write path) | HARD |
| ⭐⭐ **G-LABEL** | **THE LABEL IS T2-C0's, PROVED BY EQUALITY.** On every receipt seed, the in-world books' **per-team per-zone (deliveries, punished)** cells equal an INDEPENDENT probe-side re-walk built from T2-C0's own chain rule, loss stamp, one-to-one attribution and 10 s window — **0 mismatches over all cells**. Non-vacuity: the re-walk must see **> 0** punished. Coverage set: chain closure (loss/dead-ball/whistle), the aim index, the window, the one-to-one rule — **four mutants, one per conjunct** | HARD |
| **G-BOOK** | the book's arithmetic re-derived independently: `belief[z] === punished[z]/deliveries[z]` on every non-empty cell, `0` on every empty one, `punished ≤ deliveries` everywhere, `total` = the sum, and the vector's width is `DV_BELIEF_SLOTS`. Plus the ORDERING-FREE claim: the book computes the **MARGINAL** rate (#256.2's ratified quantity), machine-checked against a hand re-count of the label stream | HARD |
| ⭐ **G-RESET** | THE SEASON BOUNDARY: an armed League run one full season has non-empty books; after `finishSeason()` every cell is 0 and every `beliefVector()` is `null` again — **and the next match's genes are ABSENT** (the reset really does return the world to born-absent) | HARD |
| **G-BITE** | with BOTH doors armed the world DIVERGES from OFF on the receipt seeds once a punished label has landed — the non-vacuity of the whole seam. ⚠ Divergence, not a target flip (#250.3's correction, inherited) | HARD |
| ⭐⭐ **G-CROSS** | **THE DOORS MATRIX (#228), extended to this door and INCLUDING the DV pricing door itself.** {`dvLearnedMap` on/off} × {`dvDeliveryValue` on/off} × {the three banked delivery doors dosed/absent} — one FULL match per cell per seed, whole-run signature incl. rng state, inside the G-DET core. Claims EX ANTE: **(DORMANT-ALL)** every door shut ⇒ the incumbent world · **(A)** learning armed with every neighbour dosed ≡ those neighbours alone · **(B)** each neighbour armed alone is unmoved by the learning door · **(INTERACTION)** the learning door bites ONLY with `dvDeliveryValue` also armed · **(DISCRIMINATION)** ⭐ a LEARNED world is not a TRUTH-DOSED world (the census dose and the earned book give different worlds — learning is not a disguised table lookup) | HARD |
| ⭐⭐ **G-NOTABLE** | **THE #247 SPLIT, EXTENDED AND HELD BY GREP.** No file in `src/**` contains **DV-C0's OR T2-C0's** artifact name, schema name, or ANY of their measured values — every zone rate, every relative-shape number, every conditional-on-lost rate, the all-zones baselines and the event-rate moments — **as written (5-dp) AND in the formatted percentage form the tables print**; and no seam file contains a loader, a `docs/` path or a dynamic import. Coverage set stated: the search set's size, the degenerate cells excluded by a declared floor, and a CONTROL NEEDLE that must be FOUND (so a silent empty search cannot pass) | HARD |
| ⭐ **G-EPI** | **THE LEARNER READS ONLY ITS OWN EVENT STREAM.** `deliveryAccountBook.ts`'s import list is exactly `{ DV_BELIEF_SLOTS } from '../evolution/genome'` and nothing else; its executable source names no `Match`, no `match.`, no `Player`, no `Team`, no `perceivedSnapshot`, no `opp`, no `rng`, no `attrs`, no `.pos`, no `readFileSync`, no `docs/`, no `import(`; and its public members are the four event kinds the §LAW names and no other | HARD |
| ⭐ **G-NOLAMARCK** | after an armed learning match (and after a full armed League season), **`team.info.genome.dvLossBelief` is `undefined` on both teams and every franchise genome is untouched**; `dvLossBelief` is still outside `GENE_KEYS`; a save round-trip carries no book and no belief | HARD |
| **G-RNG** | the seam draws **zero** rng: an armed-to-learn match's rng state after every step equals the off arm's, and the ledger's own methods driven directly on a stepped fixture leave the match rng state EXACT | HARD |
| **G-HYGIENE** | `dvLearnedMap` absent from `a4World.ts` **entirely**; initialised `cfg.dvLearnedMap ?? false`; a fresh Match and a League match are both OFF; an unarmed League allocates **no** book; no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` anywhere on a seam line; no new `GENE_KEYS` entry; the book never reaches `toJSON` | HARD |
| **G-FORK** | ⭐ the READ-FORK INVENTORY: **exactly ONE** ledger-producing `dvLearnedMap` fork in `Match.ts` and **ONE** season fork in `League.ts`, feeding exactly THREE `this.dvLearn !== null` consumer sites, with **ZERO** new strike statements (`match.performPass(` still 3× in `PlayerBrain.ts`, `mech.performPass(` still 1× in `Match.ts`, `const groundCandidate = (` still 1×); every other `src/**` occurrence enumerated with file:line and class, **zero unclassified** | HARD |
| **G-TRACE** | every constant and every borrowed semantic back to the line it came from, VERBATIM — the zone classifier is the SHIPPED `receptionZoneIndex` (imported, not re-typed), the frame is `Team.localX`, the width is `DV_BELIEF_SLOTS`, the strike test is the engine's own `lastPassKind` replacement, and ⭐ **G-TRACE-WINDOW**: `DV_LEARN_WINDOW_S` equals DV-C0's committed primary window, equals T2-C0's committed `yardstick.windowS`, and is a member of the goal-genealogy census's committed `dangerWindowsS` family — all READ from those artifacts, never typed | HARD |
| **G-PINS** | the §PINS inventory's machine-checkable rows recomputed, including the banked fork pins' exact text in the test files AND in `src/**` | HARD |
| **G-SEED** | seed-block disjointness proved in-probe for every interval this stage consumes, against the COMPLETE consumed ledger **incl. T2-C0's five blocks** | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests | HARD |
| **G-SUITE** | FULL `npm test` green + `tsc --noEmit` clean. (Load-induced timeout flakes are reproduced on the PRE-change tree before being accepted — the PTP-T0 disposition) | HARD |
| ⭐ **REPORTED** | **THE DORMANT-ARMED SMOKE**: the door armed to LEARN in a bare production world (the consumer door shut, so the world is the shipped one), the books filled over a declared block of matches, and the filled books' rates published **beside T2-C0's census rates** as a sanity read. No control, no CI, **no ANSWER**; divergence is REPORTED, never fixed | REPORTED |

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any src diff outside the
seam path, any rng draw appearing on the dormant path, any predicate appearing anywhere, or
**any existing test breaking** (a STOP-and-report, never a test edit).

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| everything consumed through T2-C0 | the probe's `CONSUMED` table (inherited in full, incl. T2-C0's smoke/twin/guard/census/G-WORLD blocks) | prior |
| **T2-T0 receipts (this stage)** | **12,437,000 – 12,437,023** (24 seeds × the arm set; ⭐ the G-CROSS matrix re-uses the FIRST 2 of these — **no new block**) | **CONSUMED here** |
| **T2-T0 label/book/reset reads** | **12,437,024 – 12,437,029** | **CONSUMED here** |
| **T2-T0 REPORTED dormant-armed smoke** | **12,437,100 – 12,437,139** | **CONSUMED here** |
| T2-T0 test-file seeds (not a battery) | 12,437,900 – 12,437,911 | consumed here |
| free above | 12,437,030 – 12,437,099 · 12,437,140 – 12,437,899 · 12,437,912 + | available to T2-T1 |

Disjointness is computed **in-probe** for every interval separately, not asserted here.

**STATS**: this stage runs **no bootstrap and draws no stats stream at all** — the identity round
form (DV-T0's own §GATES note). The ≥ 107,800 floor set by #256.4 is therefore **NOT DRAWN**, and
is said so rather than reserved unused. T2-T1 opens at 107,800 unchanged.

## §ROAD B — nothing ships

`dvLearnedMap` is **OFF in every production path** — a hard `false` default, absent from
`a4World.ts` and from all three play-test worlds, absent from every League's `matchFlags` unless a
probe sets it explicitly — and even ARMED it changes nothing while the consumer door is shut
(G-BORN) or the book is empty (G-EMPTY). No gene is added; `dvLossBelief` stays born-absent,
outside `GENE_KEYS`, and is never serialized. The learned belief never reaches a franchise genome
(G-NOLAMARCK), so no save, no evolution run and no play-test world can carry it.
**Nothing about the game the user plays changes in this commit.** The seam exists so T2-T1 can run
the convergence exam.

**Road B statement**: fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **must not move.**

## §NON-CLAIMS

T2-T0 claims **no** football effect: not on supply, the goal band, interceptions, offside, spacing
or watchability. ⭐⭐ **It does not claim any team learns the RIGHT map** — that is the FIFTH
REGISTRATION and T2-T1 scores it; a wrong book is legal and is STYLE (#247). It does not give any
team the census's table (G-NOTABLE), does not carry learning across a season boundary or into a
genome (G-RESET / G-NOLAMARCK), adds **no** per-player book, **no** coach channel, **no** opponent
or imitation cluster and **no** evolution-learning interplay (contract §4's named later slices),
learns **no** exposure weight (M-DV2.4), prices **no** loft, through ball, cross or cutback, and
discharges **none** of the #248 debts. The REPORTED smoke is an uncontrolled descriptive reading
and adjudicates nothing. It cannot authorize T2-T1; only the commander can (#203).

---

## §RESULT — the gates run

*(filled in from the committed artifact after the receipts ran; every number here is quoted FROM
`docs/world-model/data/dv-t2-t0-learning-seam.json`, which is recomputed by
`npx tsx scripts/probes/dv-t2-t0-learning-seam.ts` — the doc never carries evidence the artifact
does not.)*

Tests: [`../../tests/dvLearnedMap.test.ts`](../../tests/dvLearnedMap.test.ts) — **28 pins**
(28 `it()` blocks). Receipts:
[`../../scripts/probes/dv-t2-t0-learning-seam.ts`](../../scripts/probes/dv-t2-t0-learning-seam.ts),
artifact [`data/dv-t2-t0-learning-seam.json`](data/dv-t2-t0-learning-seam.json).

**24 seeds × the arm set, block 12,437,000–023 · 16-cell G-CROSS matrix on the first 2 ·
19/19 probe gates + G-SUITE = 20/20 HARD gates PASS**, `resultSha256`
`0b51d2dc…e3a5`, G-DET digest `cce1b563…697c` twice, 100 s wall.

### Gate table

| gate | result | evidence |
| --- | --- | --- |
| `gDet` | **PASS** | digest `cce1b5638bc51989…` on both runs |
| `gIdent` | **PASS** | 3/3 league seeds identical: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`, all recomputed in-process |
| `xFpProd` | **PASS** | observed `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` = baseline; `npm run fingerprint` prints it unchanged |
| `gOff` | **PASS** | 24/24 seeds × BOTH world shapes — flag absent ≡ flag false |
| ⭐ `gBorn` | **PASS** | 24/24 seeds × both shapes — armed to LEARN ALONE ≡ off, **with the machinery live**: **1,944** labels closed and **6/6** book cells filled on the bare arm across the block (89–96 labels per match), and the world byte-identical anyway |
| ⭐⭐ `gEmpty` | **PASS** | structural 6/6 (empty book ⇒ `null` ⇒ no gene ⇒ no seat; a zero-punishment book ⇒ `[0,0,0]` ⇒ the seat forms at zero) · PREFIX 8/8 seeds: the first belief write lands at tick **208–1,255**, the first POSITIVE belief at tick **2,785+**, and the first divergence never precedes it (4/8 seeds never diverge at all inside the match) |
| ⭐⭐ `gLabel` | **PASS** | **0 mismatches** over 24 seeds × 2 teams × 3 zones × 2 quantities (288 cells) against the independent T2-C0-semantics re-walk — on **1,944 deliveries, 868 turnovers, 52 conceded goals, 60 punished deliveries**. MUTANTS (coverage set stated): `lossNeverCloses` 13 mismatches / 8 seeds · `indexByPasser` 53 / 8 · `windowS=0` 13 / 8 · `manyToOne` 6 / 3 — 4 conjuncts, 4 live mutants. ⚠ **REPORTED NOT LIVE**: the DEAD-BALL sub-rule's mutant (`deadBallNeverCloses`) flips **0** cells at these event rates, so that conjunct is **not mutant-covered here** and the four-mutant claim does not reach it |
| `gBook` | **PASS** | 7/7 — the marginal re-derived on a 500-event hand-counted stream, counts exact, `punished ≤ deliveries`, `total` = the sum, width `DV_BELIEF_SLOTS`, the zero constant on an unplayed zone, and the quantity is the MARGINAL not the conditional-on-lost (#256.2) |
| ⭐ `gReset` | **PASS** | a full armed League season: **71 matches, 6,760 labels** banked across 8 franchise books; after `finishSeason()` every cell is **0**, every `beliefVector()` is `null`, and the next match's genes are ABSENT again |
| `gBite` | **PASS** | 4/8 prefix seeds DIVERGE once a positive belief exists (⚠ whole-run divergence, never a target flip — #250.3 inherited) |
| ⭐⭐ `gCross` | **PASS** | **16 cells × 2 seeds, 7/7 claims on every seed**: DORMANT-ALL · (A) neighbours-dosed unmoved · (B) neighbours unmoved at gene-dosed · INTERACTION (the door bites ONLY with `dvDeliveryValue`) · the pricing door alone at gene-absent still inert · ⭐ DISCRIMINATION (a LEARNED world ≠ a HAND-DOSED world) · the dose really bites |
| ⭐⭐ `gNotable` | **PASS** | **60** rate-valued needles from BOTH committed yardsticks × 5 string forms = **198** forms searched with TOKEN-BOUNDARY matching — **0** value hits, **0** artifact/schema-name hits, **0** loader hits in executable source; the CONTROL NEEDLE was FOUND (the search is live) |
| ⭐ `gEpi` | **PASS** | the book module's import list is EXACTLY `import { DV_BELIEF_SLOTS } from '../evolution/genome';` — 0 of 13 forbidden names in its executable source, and its public event kinds are the four the §LAW names |
| ⭐ `gNoLamarck` | **PASS** | 5/5 — franchise genomes untouched after an armed match AND after an armed season, the match-local view DID write, no belief/book in the save JSON, the gene still outside `GENE_KEYS` |
| `gRng` | **PASS** | the armed-to-learn stream is identical to off at every step; the ledger driven directly over 300 events left the match rng at `1716120446 → 1716120446` |
| `gHygiene` | **PASS** | 8/8 (hard false · absent from a4World · fresh Match off · League match off · **an unarmed League allocates no book** · no env door · no new gene key · never serialized) |
| `gFork` | **PASS** | **1** ledger fork · **1** season fork · **4** nullable-seat consumer sites · `match.performPass(` **3×** · `mech.performPass(` **1×** · `groundCandidate` **1×** · **52** src occurrences classed, **0 unclassified** |
| `gTrace` | **PASS** | 9/9 — and ⭐ **G-TRACE-WINDOW**: `DV_LEARN_WINDOW_S = 10` = T2-C0's committed `yardstick.windowS` = DV-C0's committed primary = a member of the GGC census's committed family `[5, 10]`, all READ from those artifacts |
| `gPins` | **PASS** | 8/8 — all four banked fork pins intact, zero new strike, one pricer, `deliveryValueSeat.ts` byte-untouched (`git diff --stat` empty), **zero test files edited** |
| `gSeed` | **PASS** | 4/4 intervals disjoint from the complete ledger (78 blocks, incl. T2-C0's five), and the blocks are ordered |
| `G-SUITE` | **PASS** (the PTP-T0 disposition: pre-existing flakes disclosed) | `tsc --noEmit` clean · 1,357–1,359 of 1,361 green incl. 28/28 new pins; every red is `Test timed out`, never an assertion (§CHECKS) |

### ⭐⭐ REPORTED — THE DORMANT-ARMED SMOKE (the sanity read, not a gate)

The door armed to **LEARN ALONE** over **40 bare-production matches** (block
12,437,100–139); the consumer door shut, so **the world is byte-identical to off on all 40**
(measured, `worldIdenticalToOff: true`). One pooled two-team book:

| aim zone | book deliveries | book punished | **book rate** | T2-C0 census rate | census deliveries |
|---|---:|---:|---:|---:|---:|
| ⭐ **own third** | 834 | 29 | **3.477 %** | 3.655 % | 4,295 |
| middle third | 1,989 | 47 | **2.363 %** | 3.021 % | 9,500 |
| final third | 370 | 4 | **1.081 %** | 1.936 % | 2,066 |
| **ALL ZONES** | 3,193 | 80 | **2.505 %** | 3.052 % | 15,861 |

**Deliveries per team-match: 39.9125** (T2-C0's measured **39.6525**) — the population the
book sees is the census's population. **The ordering the book grows is `own > middle >
final`**, the census's own ranking.

⚠ **DESCRIPTIVE ONLY — 40 matches, one pooled book, no control, no CI, no verdict (#203),
and it is NOT the registration** (that is T2-T1's, on per-team books). What it shows is that
the plumbing is connected and lands in the census's ballpark. ⭐ **The one divergence worth
REPORTING (not fixing)**: every cell reads slightly **low** against the census (all-zones
2.505 % vs 3.052 %), and the gap is widest in the middle third. The honest read is that this
is a 3,193-delivery / 80-punishment sample against a 15,861-delivery one — 80 events carry a
relative SE around 11 %, and the all-zones gap is roughly two of those — plus the structural
fact §HONESTY 7 names (labels still open at the whistle close unpunished, which can only
push a short book DOWN). **This is recorded, not repaired**; T2-T1 sizes its run from
#256.3's moments and will measure it properly.

### §CHECKS

* `npx tsc --noEmit` — clean.
* `npm test` — **1,357 of 1,361 green across 135 files** on the worst run, 1,359/1,361 on
  another (28 new pins; **no test file edited**). ⚠ Every red is `Test timed out`, never an
  assertion, and **the failing SET changed between runs on the same tree** (run 1:
  `dvLearnedMap` + `formationEvolution` + `careers`; run 2: `formationEvolution` alone plus
  one; run 3: `careers` + `formationEvolution` + `genes` + `simRunner`) — the signature of
  machine load, not of a deterministic break. All four ran **GREEN together when run alone**
  (27/27; `formationEvolution` needs **159 s** against a 180 s limit that the parallel run
  exhausts — DV-T0's committed §CHECKS records the same case on the pre-change tree).
  ⚠ **ONE OF THE FLAKES WAS MINE AND WAS FIXED, NOT EXCUSED**: the season-boundary pin
  originally walked a FULL 71-match season (~17 s alone, > 180 s under load); it now walks
  six fixtures and closes the boundary from there, and the FULL season stays in the probe's
  G-RESET where it belongs.
* `npm run fingerprint` — `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`,
  unchanged.

### §DEV — the deviations, declared

1. ⭐⭐ **THE WRITE TARGETS THE MATCH-LOCAL GENE VIEWS, NOT `info.genome`** (§LAW sharpening
   3). The truth-dosing instrument writes all three views because it owns a throwaway match;
   in-world the third view is the FRANCHISE's, and `crossoverGenomes` copies a present
   `dvLossBelief` from parent A even with the `evolveDeliveryValue` opt-in shut — so writing
   it would have opened the Lamarck channel contract §4 defers. Measured as G-NOLAMARCK.
2. **THE OBSERVATION POINT IS THE HEAD OF `step` + `endMatch`** (sharpening 1), which reads
   the state the previous step left — T2-C0's own observation point, with the same clock
   stamps. Consequence, stated: the final tick's LOSS is seen at the whistle rather than at
   a following step, which cannot change a book cell (§HONESTY 7).
3. **THE WINDOW CONSTANT IS TYPED ONCE IN `src`** as a STRUCTURAL dimension (sharpening 5),
   with G-TRACE-WINDOW proving it is the two censuses' own by reading their artifacts. No
   measured RATE is in `src/**` (G-NOTABLE, 198 forms searched).
4. **A DELIVERY-LESS LOSS STILL ENTERS THE PENDING LIST** (sharpening 2) — dropping it
   would have made the book punish MORE than the census's own one-to-one rule does.
5. **`MatchConfig` GAINS A SECOND KEY** (`dvLearnedBooks`) beside the boolean, because
   M-DV2.2's book is the SEASON's and a per-match object could not be one. It is read only
   when the flag is armed; omitted, an armed match learns into books that die with it.
6. ⚠ **THE DEAD-BALL SUB-RULE IS NOT MUTANT-COVERED** at this block's event rates. The
   mutant was built, run and REPORTED as not live rather than folded into the four-mutant
   claim (#256.2's coverage discipline, applied to my own gate).
7. **G-NOTABLE'S NAME SEARCH EXCLUDES THE WORD "yardstick"**, which appears in three BANKED
   src comments (`genome.ts` ×2, `mechanics.ts` ×1) correctly stating that the table *lives
   with the instrument*. A comment declaring the #247 split is the split being kept, not
   breached; the gate searches artifact file names, schema ids and VALUES.
8. **THE BOOK IS POOLED ACROSS BOTH TEAMS IN THE REPORTED SMOKE** (one table, not two), so
   it is a plumbing read and not the registration's per-team predicate.
9. **NO CHECKPOINT/RESUME** in the probe: the receipts are ~100 s; a kill costs the run.
