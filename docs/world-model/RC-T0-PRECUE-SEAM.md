# RC-T0 — THE PRE-CUE DORMANT SEAM (预判席位：看见他正对着我起腿)

> **Authorized by COMMANDER RULING #369 item 6** (the RA-T0 form; scope bound at the ruling,
> the exact forms frozen here). **Binding contracts:**
> [`RC-RECEIVER-COOPERATION-CONTRACT.md`](RC-RECEIVER-COOPERATION-CONTRACT.md) §2 M-RC.1 (the
> outward-only channel) · M-RC.2 (the belief is MEASURED) · M-RC.4 (the gene) · M-RC.5 (Road B)
> and **§2-AMENDMENT M-RC.3a** (THE PRE-CUE ROUTE), plus
> [`PC-PERCEPTION-CONTRACT.md`](PC-PERCEPTION-CONTRACT.md) §2 M-PC.1 / M-PC.3 / M-PC.4 and
> **§2-AMENDMENT M-PC.1b** (A PRE-CUED EVENT IS A PARTIAL SURPRISE).
>
> **Lineage.** RC-C0 → PT-C0 → #369. [`RC-C0-COOPERATION-CENSUS.md`](RC-C0-COOPERATION-CENSUS.md)
> licensed the percept (`cue.pLockLast` **0.681429** [0.677111, 0.685726] against a uniform
> prior of 0.200336 ⇒ Δ +0.481093, **111.080 hw**) and located the waste (of the meetable
> receiver's dead time the POST-strike start delay is **0.379124 s** against a ~0.106 s
> pre-release lock — the `passRelease` hold at the CHOICE tier, #367 item 4c). PT-C0
> ([`PT-C0-PLAYTEST-FORENSIC-CENSUS.md`](PT-C0-PLAYTEST-FORENSIC-CENSUS.md)) measured the
> user's 「传到对面身上」 and printed **H2 — the receiver is not READY** on the form he plays.
> #369 item 5 split M-RC.3 into three limbs; **this stage builds limb 3a and nothing else.**
>
> ⛔ **THIS STAGE SHIPS NOTHING** (Road B): `rcAnticipate` is default OFF, never env- or
> bundle-armed, named by NO world and NO preset (`a4World.ts` contains neither the flag nor the
> gene); `rcAnticipationWeight` is BORN ABSENT; the production fingerprint is UNCHANGED —
> `npm run fingerprint` = the literal of record
> **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** at the seam commit.
> ⛔ **World 12's composition and bytes are untouched** (M-RC.5) — the user's play-test still
> compares like with like. The entry rung (world 13) is a later stage's business, after the
> user's world-12 verdict. **ZERO sims of record; registry 73; scratch 900,002,000–099 only.**

## §1 THE MECHANISM (what armed means)

Armed (`rcAnticipate: true` **AND** a NON-ABSENT `rcAnticipationWeight` gene **AND** a
`pcReactionLatency` world — no latency seat means no hold to shorten), an OWN-side body armed
by the `passRelease` detector meets the release as a **PRE-CUED** stimulus in proportion to how
squarely the passer's BODY was facing him:

```text
rank    = alignmentRank(initiator.pos, initiator.heading, mates, my gid)
          [RC-C0 §P.A's cue byte for byte: θ_i = angle(passer.heading, unit(mate_i.pos −
           passer.pos)); rank 1 = argmin over the FINITE θ; ties break to the LOWEST gid; a
           degenerate bearing or heading (length ≤ 1e-6) names no angle and is EXCLUDED; the
           mate population = every same-side body that is not the passer and is on the pitch
           (sentOff === false), THE KEEPER INCLUDED]
belief  = RC_BELIEF_BY_RANK[rank]  = pooled[rank − 1] / 42248        (0 outside ranks 1..5)
          [RC-C0's OWN measurement, read off its artifact: bins.ambiguityAtLastTick.pooled
           over licence.pLockLast.denominator — ambiguity a ⇒ the target sat at rank a + 1]
ticks   = book covers the cell ? SIMPLE
                               : round(SIMPLE + (CHOICE − SIMPLE) · (1 − w · belief))
          clamped to [SIMPLE, CHOICE]                    (w, belief each clamped to [0, 1])
```

with `SIMPLE` / `CHOICE` the two **certified PC tiers** (`PC_TIER_SIMPLE_TICKS` = 12 /
`PC_TIER_CHOICE_TICKS` = 27 APPLIED ticks, 0.20 / 0.45 sim-s — IMPORTED, never re-typed) and
`w` = `rcAnticipationWeight`. **THE TABLE OF RECORD** (bit-exact quotients, re-derived from the
artifact on disk by G-TABLE; artifact byte-hash `79ec2953…4a7b3`):

| rank | numerator (`ambiguityAtLastTick.pooled`) | belief = n / 42,248 | ticks at w = 1 |
|---|---|---|---|
| 1 | 28,789 | 0.6814287066843401 | **17** |
| 2 | 7,818 | 0.1850501798901723 | 24 |
| 3 | 2,974 | 0.07039386479833365 | 26 |
| 4 | 1,752 | 0.041469418670706304 | 26 |
| 5 | 915 | 0.021657829956447643 | 27 |
| > 5 / no rank | — (the overflow bin is 0) | 0 | 27 (= CHOICE, the identity) |

⭐ **THE BOOK STILL WINS.** A body whose own earned recognition book covers the cell
(M-PC.3) pays SIMPLE and the pre-cue is IGNORED entirely — the §7 REALITY floor: an experienced
player who ALSO anticipates is not faster than simple. The `tier` LABEL stays the BOOK's
decision (so `armedByTier` keeps counting the book), the hold record carries `preCued` and
`belief` for instruments, and the ledger counts `preCuedArms`. The OVERLAP RULE (monotone
restart, `untilTick = max`) is UNTOUCHED and applies to the interpolated ticks unchanged. With
the parameter absent or `null`, `arm()` is byte-for-byte what it was.

**The football sentence**: 「看见他正对着我起腿的人，球出脚时反应得快」 — 而信多少是基因，
选择去定它的大小，不是我们。

**Nothing is told to anybody** (M-RC.1). The read set is the initiator's `pos` and `heading`
(external body state), each mate's `pos` / `gid` / `side` / `sentOff`, the arming body's `gid`
and the team's own gene. ⛔ Never `pendingPassWindup`, never `faceTarget`, never `pendingPass`,
never a TeamBrain designation (`runners` · `arriver` · `overlapper` · `wallRun`), never another
body's `info.genome`. VISION §1's authority model, copied verbatim (home: `docs/VISION.md` §1):

> 权限模型因此锁死为:**我知道自己的私人意图 + 自己的外部身体状态;我只能观察别人
> 的外部状态,再在自己内部形成对其意图的推断。**

⛔ **NO BEHAVIOUR CHANGE BEYOND THE HOLD LENGTH**: no new candidate, no pre-strike facing, no
pre-strike movement (M-RC.3b/3c are NOT built here), no ban, no designation, no cap, no new
constant. Relation `own` ONLY and the `passRelease` class ONLY; the initiator pays nothing
(M-PC.4, the unchanged exclusion); every other class, relation and body is byte-identical.

## §2 THE FILES

| file | what |
|---|---|
| `src/ai/receiverAnticipationSeat.ts` | NEW — PURE and CHANNEL-CLOSED (its whole import list is `['./pcLatency']`): `alignmentRank(...)` (RC-C0 §P.A's cue on SCALARS) · `RC_BELIEF_NUMERATORS` / `RC_BELIEF_DENOMINATOR` / `RC_BELIEF_BY_RANK` + `rcBeliefForRank(rank)` (the table, stored as numerator/denominator so the pin is bit-exact, with the derivation, the field paths and the artifact byte-hash in the docblock) · `RC_PRECUE_FLOOR_TICKS` (the honest ceiling, DERIVED) · a RE-EXPORT of `preCueTicks` |
| `src/ai/pcLatency.ts` | **THE ONE SEAM**: `preCueTicks(simple, choice, w, belief)` (M-PC.1b's arithmetic, at the tiers' own home — see the deviation note below) + `arm()`'s ONE optional trailing parameter `preCue?: { belief; weight } \| null` + the hold record's additive `preCued` / `belief` + the ledger's `preCuedArms` |
| `src/sim/Match.ts` | `rcAnticipate` config + readonly + `?? false`; the winner record's additive `initiatorGid`; **the ONE pre-cue read** in `pcLatencyObserve`'s gid-ordered arm loop, and the ONE arm call that carries it |
| `src/sim/League.ts` | the `matchFlags` key union only (`League.toJSON` omits matchFlags — nothing serializes) |
| `src/evolution/genome.ts` | `rcAnticipationWeight?` BORN ABSENT (the `raAccessWeight` birth discipline verbatim in form) + `rcAnticipationWeightOf` (the ONE place ABSENT is distinguished from ZERO: `null` vs `0`) + `evolveReceiverAnticipation` opt-in whose mutate AND crossover draws sit **LAST**, strictly after every existing block |
| `tests/rcAnticipate.test.ts` | THE PERMANENT PIN SUITE — 23 pins, see §3 |
| `docs/world-model/RC-T0-PRECUE-SEAM.md` | this file |

⚠ **ONE DEVIATION FROM THE DISPATCH, STATED** (#369 item 6(ii) put `preCueTicks` in the seat
module): the law is **DEFINED in `pcLatency.ts`** — beside the two certified tiers it
interpolates, inside the module whose `arm()` applies it, and it is PC-contract M-PC.1b's own
arithmetic — and **RE-EXPORTED** by `receiverAnticipationSeat.ts` so RC's seat module still
presents the whole of M-RC.3a's law at one address. Reason: a definition in the seat module
would force `pcLatency.ts` to import it back, which is an import CYCLE and would break
PC-T0's own certified import-list pin (`imports === ['../sim/constants']`). One home, one
function object (the pin asserts the identity), no cycle, and PC-T0's closed import list is
unmoved.

## §3 THE PINS (`tests/rcAnticipate.test.ts` — 23, ALL GREEN at the seam commit; the suite is the living inventory)

* **Road B**: the PROHIBITION SET (no world / preset / env / bundle names the flag or the gene;
  `a4World.ts` contains neither string; every version 1–12 carries no flag; bare Match, world-12
  Match and a League match all `false`) · NO SERIALIZATION (`League.toJSON` omits; the gene is
  outside `GENE_KEYS` and `JSON.stringify` omits it) · **G-OFF** (absent ≡ explicit-false, byte
  for byte, BARE world + WORLD 12's composition × 2 scratch seeds each, pooled digest, four
  distinct cells) · **G-BORN** (armed, gene absent ≡ shut; and structurally `preCuedArms === 0`
  over a whole armed walk) · **G-ZERO** (armed at gene 0 ≡ shut, pooled — with the path LIVE:
  `preCuedArms > 0` and every pre-cued arm comes out at EXACTLY the choice tier).
* **The law on fixtures**: **G-BITE** (each rank's hold is EXACTLY
  `preCueTicks(SIMPLE, CHOICE, 1, TABLE[r])` — DERIVED, never typed; rank 1 = 17 = the ceiling
  of record, rank 5 = 27; the tier LABEL and `armedByTier` stay the book's) · **G-BOOK** (a
  covered cell ⇒ `PC_TIER_SIMPLE_TICKS` regardless of the pre-cue, `preCued === false`,
  `belief === 0`) · the ABSENT/NULL parameter ⇒ today's `arm()` byte for byte ·
  **G-FLOOR / G-CEIL** (never below SIMPLE nor above CHOICE across the (w, belief) grid incl.
  the corners and out-of-range arguments; `w = 0` or `belief = 0` ⇒ CHOICE exactly; `w = belief
  = 1` ⇒ the simple floor exactly; monotone in the product) · the ACCESSOR's absent-vs-zero law.
* **G-TABLE**: the five values RE-DERIVED from RC-C0's artifact ON DISK, **bit-exact** (`toBe`
  on the quotients, not `toBeCloseTo`), the artifact's sha256 asserted (`79ec2953…4a7b3`), the
  overflow bin proven empty, rank 1 = `cue.pLockLast` at the artifact's own 6 dp, the five
  summing to 1, and 0 for every rank outside 1..5.
* **G-RANK**: the cue on constructed geometries — ties to the LOWEST gid, a degenerate mate
  EXCLUDED (he takes no rank and costs nobody one), a degenerate heading ⇒ nobody has a rank, a
  non-unit heading still works, the KEEPER INCLUDED (best-aligned ⇒ he takes rank 1), a body
  outside the population has no rank — plus 2,000 random-fixture comparisons against a NAIVE
  independent re-implementation (atan2 route) and a permutation check.
* **The walk side (world 12's composition, books BORN ABSENT = RC-C0's own form)**:
  **G-BITE (walk)** — pre-cued `passRelease` holds really appear and are SHORTER than the
  choice tier; every one obeys the law (class, `own` cell, band, ticks re-derived from its own
  stored belief, belief ∈ the census's five values ∪ {0}); the minimum reached is
  `RC_PRECUE_FLOOR_TICKS` = 17; nothing leaks into the result or `GENE_KEYS`.
  **G-OPP + G-INITIATOR** — with the gene on side 0 only, every pre-cued hold belongs to a
  side-0 body and to an `|own` cell; plus the LIVE branch conjuncts and the UNCHANGED initiator
  exclusion pinned by anchored line-matches (canon copied — VERBATIM: "a src-extracted constant
  pins its extraction to the NAMED call site — anchored match + line receipt — never
  first-occurrence"; home: BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1).
* **CHANNEL CLOSURE**: the seat module's import list is EXACTLY `['./pcLatency']`; its
  COMMENT-STRIPPED code contains none of `Match` · `Player` · `TeamBrain` ·
  `pendingPassWindup` · `faceTarget` · `pendingPass` · the four designations · `info.genome` ·
  any rng; the law has ONE home (`preCueTicks === pcLatency`'s own function object, and the
  module defines no second copy). **THE LIVE READ SET** is pinned line by line with ordered
  1-based line receipts — the initiator's `pos`/`heading`, the mates' `pos`/`gid`/`side`/
  `sentOff`, the arming body's `gid`, the team's gene, then the ONE `seat.arm(...)` call — and
  the whole seam block is scanned for the forbidden channels (#367 item 3(iv); RC-C0
  §COMMANDER CORRECTIONS item 4: for a SEAT a wrapper fixture alone is not enough).
* **THE SEAM MAP**: occurrence COUNTS per needle with EVERY site enumerated across `src/**`
  (canon copied — VERBATIM: "a seam-map gate pins occurrence COUNTS per needle and enumerates
  EVERY occurrence's site"; home: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1).
  Five sites and no other spelling: the seat module · `pcLatency.ts` · `Match.ts` ·
  `League.ts` (ONE occurrence, the key union) · `genome.ts`.
* **G-RNG**: the cue, the table, the hold law and an ARMING draw ZERO rng; flag-off
  mutate/crossover streams UNMOVED and the gene absent from them; the opt-in draws only when
  asked; and it draws **STRICTLY AFTER every existing block** — proven by turning the LAST
  pre-existing opt-in (`evolveReceiverAccess`) ON and showing its drawn value is IDENTICAL with
  this slice's opt-in off vs on, in BOTH `mutateGenome` and `crossoverGenomes`, with the source
  order anchored beside it.
* **THE FINGERPRINT OF RECORD** is a literal in the suite and the suite RUNS it (the
  `a4HomeGrant` form: a 2-season headless league hashed and compared) — this seam may not move
  it. ⭐ CANON "pin suites from birth" (home: ruling #297 item 7).

⭐ Receipts are receipts: `preCuedArms`, the hold counts and the tick histogram are ARMING
PLUMBING and are never quoted as football effect sizes (home: ruling #289 item 1 +
BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5). What the pre-cue BUYS is RC-T1a's
question.

## §4 HONEST LIMITS

* ⚠ **THE ≤ 1-TICK HEADING DRIFT, DECLARED.** The detector runs at the HEAD of the step and so
  reads the state the PREVIOUS step left: the passer's `heading` is read at the **END of the
  release tick**. His `faceTarget` was released at the strike, so his body may have integrated
  up to ONE tick (≤ `TURN_RATE · DT` rad) past the last pre-release tick RC-C0 actually
  measured its table on. The rank the seat reads is therefore a one-tick-late reading of the
  census's cue, not the census's cue itself. Stated, not hidden; the direction is unknown (his
  turn may continue toward the aim or begin unwinding).
* ⚠ **THE TABLE IS RANK-ONLY.** The belief is keyed on the ORDINAL rank and nothing else: the
  MAGNITUDE of θ is not in it (a rank-1 mate at 5° and one at 80° buy the same belief), and
  neither is RC-C0's second outward term, the TURN CUE — which the census showed discriminates
  WEAKLY (0.904688 vs 0.746193 for the frozen rival, Δ +0.158496; a committed passer's turn
  closes the angle on most of his mates at once). ⭐ Also inherited from RC-C0 §COMMANDER
  CORRECTIONS item 1: rank-1-ness and "ambiguity 0" coincide in that battery but NOT by
  definition (strict argmin with a gid tie-break vs an inclusive `θ_i ≤ θ_T` count), so the
  table is the rank histogram *as that battery measured it*.
* ⚠ **WHOLE TICKS.** `round(...)` is round-half-up on the values this law takes; the hold is an
  integer number of APPLIED ticks (the engine's own grain, the #280 form), so the belief axis is
  quantised into 16 reachable hold lengths between 12 and 27 and adjacent ranks can collide
  (ranks 3 and 4 both land on 26 at w = 1).
* ⚠ **THE CEILING IS SMALL, AND IT IS THE POINT OF THE EXAM.** At `w = 1` and rank 1 the hold
  is **17 ticks, not 12** — the pre-cue buys ≈ 0.14 sim-s ≈ **1 m of RC-C0's measured 3.13 m**
  arrival gap (`gap.meanDiffMetres.meetableCarried` +3.134494 [2.996685, 3.267046], 23.188 hw).
  RC-T1a measures what it actually buys; this stage claims nothing about it. (Clock honesty:
  0.14 sim-s on the 240 s match clock; 1 sim-s = 22.5 display-s, and these are APPLIED ticks.)
* ⚠ **THE DOSE FORM: THE DOSED WORLD IS A SMALLER ROOM.** Bodies whose recognition books
  already cover the `passRelease` cell gain NOTHING (the book wins), so the pre-cue's reach
  depends on the book state of the arm it is measured in. Measured on a scratch walk of world
  12's composition at weight 1: the EMPTY-BOOK form (RC-C0's own) produced hundreds of pre-cued
  arms, the MATURED-dose form single figures. ⇒ RC-T1a must REPORT the dosed pair beside the
  empty-book arms (#369 item 2(d)'s process law) or its effect size is a statement about book
  state, not about anticipation.
* ⚠ **THE PRE-CUE IS COMPUTED AT THE RELEASE TICK ONLY.** No pre-strike movement and no
  pre-strike facing exists in this stage: M-RC.3b (the READY limb — licensed by PT-C0's H2 but
  needing the RC-C0b detector census first) and M-RC.3c (the CHASE limb — HELD) are NOT built.
  So this seam CANNOT move PT-C0's side-on face (0.653896 of receptions, 0.571574 on completed
  passes) except through whatever a shorter hold does downstream.
* ⚠ **WHAT LICENSED / ARMED DOES NOT CLAIM.** RC-C0's LICENCE says the cue carries information,
  not that reading it helps; ARMED here means "the capacity exists behind a shut door", not that
  the world is better. This stage runs ZERO sims of record and states no football finding. The
  interpolation FORM (linear in the belief) is a CHOICE, not a measurement (M-PC.1b's own honest
  limit) — the exam reports the tier-transition curve so a non-linear reality would show.
* ⚠ **THREE LIMBS ARE REQUIRED FOR ANY EFFECT**, which is also a scope limit: without a
  `pcReactionLatency` world there is no hold and the flag is inert even armed with a gene.

## §COMMANDER CORRECTIONS (ruling #370 item 3 — the verifier's one MEDIUM and two LOW items, disposed; the seam UNCHANGED)

1. **MEDIUM — §1's `ticks at w = 1` column hard-types three DERIVED values (ranks 2/3/4: 24 /
   26 / 26) that no pin asserts.** Only rank 1 (17 = `RC_PRECUE_FLOOR_TICKS`) and rank 5 (27 =
   `PC_TIER_CHOICE_TICKS`) are pinned; G-BITE deliberately DERIVES its expectation from
   `preCueTicks(...)`. The column is hereby declared a DERIVED display whose recompute recipe is
   `preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1, RC_BELIEF_BY_RANK[r])` (the
   verifier's own hand-recompute: 17 / 24.224→24 / 25.944→26 / 26.378→26 / 26.675→27 — the
   printed values are correct today). **RC-T1a's instrument pins all five as anchored fixtures**
   (its `gAnchoredConstants`), so the column has a pin from the next stage on. Canon applied
   (copied VERBATIM): "a gate's NOTE derives from the same pinned values the gate checks; a count
   typed beside its pin is a second copy" (home: PT-C0-PLAYTEST-FORENSIC-CENSUS.md §COMMANDER
   CORRECTIONS item 1).
2. **LOW — one quantity, two names.** `RC_PRECUE_FLOOR_TICKS` (src: the floor of REACHABLE hold
   ticks at w = 1, rank 1) is what this doc and ruling #369 call "the honest CEILING" (of
   purchasable benefit). Both readings are stated in the constant's docblock; of record: the
   src name is the identifier, "the honest ceiling" is the football reading, they are the SAME
   17 ticks, pinned once by G-BITE.
3. **LOW — the contract sentence is looser than the built population.** M-RC.3a says "among the
   passer's same-side OFF-BALL mates"; the seam builds "every same-side body that is not the
   passer and is on the pitch (`sentOff === false`), the KEEPER INCLUDED" — RC-C0 §P.A's own
   population, which is the AUTHORITY. The two coincide in the engine (the passer is the only
   on-ball body at a release tick). The contract's §2-AMENDMENT carries a one-line pointer to
   RC-C0 §P.A from this ruling; no behaviour, no pin, no number moves.
4. **Of record — the `preCueTicks` HOME deviation is RATIFIED.** #369 item 6(ii) placed the
   function in the seat module; the author defined it in `pcLatency.ts` (beside the two tiers it
   interpolates, inside the module whose `arm()` applies it — M-PC.1b's own arithmetic) and
   RE-EXPORTED it from the seat, because a seat-side definition would force `pcLatency.ts` to
   import it back (an import CYCLE) and would break PC-T0's certified import-list pin
   (`imports === ['../sim/constants']`). One home, one function object (pinned by identity), no
   cycle, zero narrows to `pcLatencySeam.test.ts`. The better placement; ratified.
