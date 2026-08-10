# CTB T0 — the DORMANT SUPPORT-PLANE seam (`ctbSupportPlane`, 回撤接应的前后左右)

Status: **PRE-REGISTERED, then BUILT + RUN the same round.** The gene law with its
traced spans, the seam, the gates, the seed ledger, the PIN INVENTORY and the Road B
statement below were written **before** the receipts ran (the frozen-before-sight
rule, the MT-T0 / O2-T0 two-part form); the measured numbers arrive only in
[§RESULT](#result--the-gates-run) at the foot.

Authority chain: contract
[`CHECK-TO-BALL-CONTRACT.md`](CHECK-TO-BALL-CONTRACT.md) — §0 (the code fact: no
genome can place a supporter level with or behind the ball) · §2 **M-CTB.1** (the
AXIS PAIR, the user's 前后左右, both around today's zero-point) · **M-CTB.2** (born
absent, the full #196.3-D4 arming checklist) · **M-CTB.3** (NO predicates, the #200
red line; the dynamic account is a NAMED LATER SLICE) · **M-CTB.4** (the consumer is
untouched around the seam) · §3 the **CTB-T0** clause (⚠ the PIN INVENTORY is a named
deliverable) · §4 the non-claims. Ruling **#223** (the dispatch, carrying the user's
shape amendment: the FULL 2D PLANE, not a front-back axis alone) and the
**#181.2 / #194 / #196 / #197-M1 / #202** evidence lessons verbatim (no doc-typed
hashes; gate semantics stated exactly — say what the arms DIFFER in; completeness
claims only from `git show --stat`; nothing commit-dependent inside the hashed body;
traced constants derived IN CODE, never typed literals).
[`MT-T0-DORMANT-SEAM.md`](MT-T0-DORMANT-SEAM.md) and
[`O2-T0-DORMANT-SEAM.md`](O2-T0-DORMANT-SEAM.md) are the FORM this document and its
receipts follow.

Banked evidence this stage stands on: the genealogy census (#218 — no build-up
factory), the wedge exam (#222, F-O2a — **holding fails for want of HOLDABLE STATE,
not information**), and the Phase 30.5 elasticity receipt quoted in the `supportSpot`
doc comment (short-option supply is a goals-level signal this world demonstrably
feels).

---

## §LAW — the frozen gene law, and where every bound comes from

```text
ZERO-POINT (today, unchanged):
  radius     = 10 + supportDistance·8                       (10 … 18 m)
  aheadBias  = (mode ∈ {Attack, CounterAttack}) ? 0.75 : 0.35   ← ABSORBED, not deleted
  latPull    = clamp((lane.y − ball.y) · 0.75, −0.9·radius, +0.9·radius)

THE AXIS PAIR (armed; both genes born absent ⇒ 0):
  前后  depthShift = ctbSupportDepthWeight(g) · CTB_DEPTH_BIAS_SPAN
        aheadBias′ = aheadBias + depthShift
  左右  widthScale = 1 + ctbSupportWidthWeight(g)
        pull′      = SUPPORT_LAT_PULL     · widthScale
        cap′       = SUPPORT_LAT_CAP_FRAC · widthScale · radius

  x = clamp(ball.x + attackDir · radius · aheadBias′, −HALF_L+2, HALF_L−2)
  y = clamp(ball.y + clamp((lane.y − ball.y) · pull′, −cap′, +cap′), −HALF_W+2, HALF_W−2)

  SUPPORT_LAT_PULL     = 0.75      (the incumbent lane-pull factor, named in place)
  SUPPORT_LAT_CAP_FRAC = 0.9       (the incumbent radius cap fraction, named in place)
  CTB_DEPTH_BIAS_SPAN  = SUPPORT_LAT_CAP_FRAC     ← DERIVED IN CODE, not a literal
  gene domain          = [−1, +1]  (SIGNED — the zero must be interior)
```

### 1. The two incumbent fan constants are NAMED, not changed

`src/ai/formations.ts` now exports `SUPPORT_LAT_PULL = 0.75` and
`SUPPORT_LAT_CAP_FRAC = 0.9` — **pure code motion**: they are the very `* 0.75` and
`* 0.9` the Phase 30.5 fan has always applied, given names at their own use site so
the width axis can be written as a deformation OF them rather than as new literals.
Numerically nothing moves (`x·0.9·1 ≡ x·0.9` exactly in IEEE-754).

### 2. 前后 — the DEPTH span, traced and derived in code

`CTB_DEPTH_BIAS_SPAN = SUPPORT_LAT_CAP_FRAC` (`src/ai/formations.ts`). The bound is
**the seat's own lateral cap fraction**, i.e. the engine's standing answer to *"how
far off the ball, as a fraction of the support radius, may this seat sit"*. The depth
axis asks that identical question on the OTHER axis of the SAME plane, so the seat may
express exactly as much reach front-to-back as it already expresses side-to-side, and
no more — **chosen by QUESTION IDENTITY** (the MT-T0 precedent), and written as a
reference to the incumbent constant so it cannot drift away from the family it was
taken from (the #202 form: derived in code, never typed).

It is a fraction of the same `radius = 10 + supportDistance·8` family the contract
names as the natural neighbour, so **in metres the span is 9 – 16.2 m** of front-back
shift at full dose.

**The consequence that this whole slice exists for**: the incumbent attacking bias is
`0.75`, so full-negative reaches `0.75 − 0.9 = −0.15`; non-attacking reaches
`0.35 − 0.9 = −0.55`. **LEVEL WITH the ball (`aheadBias′ = 0`) and BEHIND it
(`< 0`) become expressible in BOTH modes** — the §0.3 code fact answered. The ternary
is not deleted: it is the zero-point the axis is centred on, so an absent gene is
today's world exactly.

### 3. 左右 — the WIDTH scale, ONE coherent factor on both constants

`widthScale = 1 + ctbSupportWidthWeight(g)`, applied to **both** fan constants at
once. Stated exactly: **the width axis' span IS each incumbent constant itself** — at
gene −1 it removes exactly the whole incumbent pull and the whole incumbent cap, at
+1 it adds exactly another one of each. No number is invented; the deformation
magnitude is the constant being deformed (the strictest possible reading of "traced").

* `widthScale ∈ [0, 2]` and is never negative ⇒ **the lateral pull can never invert
  its sign**: no gene can send a supporter to the WRONG side of the ball's lane.
* At −1 the fan collapses onto the ball's own lane (pull 0, cap 0): the narrowest
  expressible support, right beside the carrier — which, combined with a negative
  depth dose, is what 回撤接应 geometrically IS.
* One gene scales pull and cap TOGETHER, so the fan's shape is preserved and only its
  scale moves (a coherent similarity, not two independent knobs).

### 4. Why the domain is SIGNED [−1, +1]

The `GENE_KEYS` family lives in [0,1] because those genes run from "none" to "most".
These two do not: they are deformations around an INCUMBENT CENTRE, so the zero must
be interior and the reach must be signed — that is precisely what makes
level-with/behind expressible. ±1 is a **domain, not a geometry constant**; the metric
bounds are the traced spans above. Precedent for a signed clamp in this file: the
`homePriorObedienceOffset` family's ±0.5 `clampOffset`.

**Sizing honesty, stated up front.** At full negative depth an attacking supporter
stands `0.15 · radius` = 1.5–2.7 m BEHIND the ball instead of 7.5–13.5 m ahead of it;
at full negative width he stands on the ball's own lane. Whether any of that moves the
receiver-side ruler is **exactly CTB-T1's question**, and this stage pre-commits to
NOT re-cutting either span to make CTB-T1 succeed. If T1 needs different ones, that is
a fork for the commander WITH numbers, not a quiet re-freeze after sight. The link
between each bound and its provenance is machine-checked twice — G-TRACE in the probe
and [`tests/ctbSupportPlane.test.ts`](../../tests/ctbSupportPlane.test.ts) both assert
the derivation and the source lines VERBATIM.

## §SEAM — the mechanism (all of it dormant)

### The genes

* **`ctbSupportDepth`** and **`ctbSupportWidth`**, two new **OPTIONAL**
  `TacticalGenome` keys, **BORN ABSENT** — the `markSag` / `defLaneConvergence` birth
  form verbatim:
  * deliberately **NOT in `GENE_KEYS`**, so `randomGenome` / `mutateGenome` /
    `crossoverGenomes` / `geneDistance` draw the EXACT same rng in the EXACT same
    order as HEAD, and absent optional keys are omitted by `JSON.stringify` ⇒ the
    serialized genome and the production fingerprint are byte-identical;
  * they evolve ONLY under **ONE OWN explicit `evolveCtbSupportPlane` boolean** (#75
    — never a widening of `evolveHomePrior` / `evolveHomePriorOffsets` /
    `evolveDefLaneConvergence` / `evolveMarkSag`), and their draws sit **STRICTLY
    AFTER the `markSag` block** (hence after `defLaneConvergence` and both home-prior
    blocks), DEPTH first then WIDTH, so enabling them never re-orders an existing
    draw;
  * absent ⇒ `ctbSupportDepthWeight() === 0` and `ctbSupportWidthWeight() === 0` ⇒
    `depthShift = 0`, `widthScale = 1` ⇒ the terms vanish EXACTLY.
* **ONE opt-in for BOTH axes on purpose**: they are one body's positional freedom
  (the user's 前后左右), not two independent tactics, and CTB-T2 selects on the plane
  as a plane. Crossover draws TWICE (they are two axes and may be inherited from
  different parents); mutation draws twice under one gate.

### The consumption flag

* **`ctbSupportPlane`**, a new **explicit** `MatchConfig` boolean, initialised
  `cfg.ctbSupportPlane ?? false` (`Match.ts`) — a **hard `false`**, the
  `mtMarkSag` / `pmLaneConvergence` / `o2Look` form. **Never** `EDS_BUNDLE_ARMED`,
  never env-armed, never default-ON, and never bundle-defaulted: **absent from
  `src/game/a4World.ts` entirely** (`A4_WORLD_FLAGS` and every `a4MatchFlags(v)`
  version), so no play-test world, preset or env bundle can turn it on. It gets its
  own `League.matchFlags` key so a probe world can arm it EXPLICITLY, and that key
  changes no default (an unarmed league builds the identical shipped match).
* ⭐ **THE ARMING CHECKLIST (binding, #196.3-D4)**: armed = the `ctbSupportPlane` flag
  **+** the `evolveCtbSupportPlane` opt-in (for evolution runs) or a probe-written
  gene **+** a non-absent gene value — **ALL**. No bundle defaults any of them. Even
  ARMED the world is unchanged while the genes are absent (G-BORN) and unchanged while
  they are AT ZERO (G-ZERO). CTB-T1 doses through the REAL gene channel on all three
  genome views (`info.genome` / `baseGenome` / `effGenome`) of BOTH teams — the engine
  gains no probe-only dose surface (#196.3-D6).

### The single read fork

Exactly **ONE** fork on `ctbSupportPlane` exists in `src/**`, inside `supportSpot`
(`src/ai/formations.ts`):

```ts
let depthShift = 0;
let widthScale = 1;
if (ctbPlane) {
  depthShift = ctbSupportDepthWeight(g) * CTB_DEPTH_BIAS_SPAN;
  widthScale = 1 + ctbSupportWidthWeight(g);
}
```

The flag reaches it as the function's fourth parameter, `ctbPlane = false`, passed
from the seam's ONE consumer — `actionExecutor.ts`'s `case 'SupportBallCarrier'`
(`target = supportSpot(p, team, ball, match.ctbSupportPlane)`). Every other
`supportSpot` caller in the repo (all of them in `scripts/probes/**`) keeps the
3-argument shape and therefore the incumbent expression, by default.

**Byte-identity is arithmetic, not hope**: with the fork not taken, the expression is
`aheadBias + 0` and `× 1` against the incumbent's bare terms — both are EXACT
identities in IEEE-754 for every finite value, and the operation ORDER is preserved
(`attackDir · radius · (aheadBias)`, `(radius · 0.9) · 1`,
`((lane.y − ball.y) · 0.75) · 1`). This is what G-OFF / G-BORN / G-ZERO measure rather
than assert.

### NO predicates (the #200 red line)

The deformation is **unconditional geometry**: it applies on every support tick when
armed. The complete conditional set of this slice is **gate** (`if (ctbPlane)`),
**guard** (`Number.isFinite` in the two weight maps), **zero** (born-absent ⇒ 0) and
**cap** (the signed clamp, and the two incumbent field clamps, unchanged). Nothing
reads pressure, carrier state, opponent state, staleness, or mode beyond the
INCUMBENT ternary that was already there. Nothing DECIDES anything. The dynamic
account ("check WHEN he is pressed") is the contract's **named deferred slice**
(M-CTB.3) and is not smuggled here in any form.

### Untouched (restated as a prohibition)

`TeamBrain` assignment — WHO supports (`assignSupport`/`team` task allocation) · pass
selection and every pass price · the carrier's own behaviour · `speedF` at the
support case · `formationSpot` and the station family (the `lane` reference the fan
pulls toward is the UNMODULATED incumbent call) · `runTarget` / `runBurstPoint` /
every other target generator · the certified price table and `whetherEye` · the MT and
PM seams · `a4World.ts`'s flag set and all three play-test worlds · per-body genes
(the S2 lesson: heterogeneity is its own contract) · the render layer.

---

## §PINS — the PIN INVENTORY (contract §3, a NAMED deliverable)

Everything that pins `supportSpot` geometry, and what happened to it. **Nothing is
silently renegotiated**; had any of these broken, the standing instruction is
STOP-and-report, never a test edit.

| # | pin | where | class | disposition |
| --- | --- | --- | --- | --- |
| 1 | **direct `supportSpot` callers in `tests/**`** | — | — | **NONE — measured, not assumed**: at the pre-change commit `grep -rn supportSpot tests` returns EMPTY. No PRE-EXISTING test asserts a support point, so none can be perturbed by this seam even when it is ARMED. Machine-rechecked in-probe (`gates.gPins.testCallers === 0`, counted over `tests/**` MINUS this stage's own pin file, whose 9 calls are reported separately as `ownTestCallers`) |
| 2 | **the 5v6 sanity invariant** (Phase 30.5's named casualty — "playing short must hurt", which INVERTED when a first cut parked support 30 m out) | `tests/cards.test.ts:119` `it('directional: playing a man short costs results (forced early red)')` (+ its non-test replica `scripts/probe-shorthand.ts`) | full-match directional | UNTOUCHED — flag born false ⇒ the support geometry it plays through is byte-identical. Re-run in the FULL suite (§CHECKS) |
| 3 | **the mirror-goals starvation receipt** (1.47 → 0.93 when short options died) | no test asserts this number; its test-level heir is `tests/formations.test.ts:351` `it('the novel shapes play REAL football — attack both ways over a seed pool')` | full-match goal-level | UNTOUCHED, same ground. ⚠ Stated exactly: the 1.47/0.93 pair is a HISTORICAL probe reading in a code comment, **not** a live assertion anywhere in `tests/**` — so the Phase 30.5 elasticity guard is CI-unprotected today, and CTB-T1 must carry short-option supply as its own instrument rather than assume a test would catch its loss |
| 4 | **the interception ceiling** (the Phase 30.5 column disease, 33/match) | `tests/passCorridorInterception.test.ts` (unit-grade corridor facts), `tests/offside.test.ts`, `tests/seasonReport.test.ts` (interception stat plumbing) | unit + season | UNTOUCHED — none of them arms the flag; none reads a support point. The BEHAVIOURAL interception guard is CTB-T1's named guard (F-CTB-b), not a T0 pin |
| 5 | **the production fingerprint** `57b0bdab…c673` | asserted in 13 test files (`a4HomePriorGene`, `a4RestAbandon`, `pmLaneConvergence`, `o2Look`, `o1PassWindup`, `mtPlaytestEntry`, `a4PlaytestEntry{,V2,V3}`, `a4HomeGrant`, `a4HomeMap`, `a4S2VectorGrant`, `a4S2P2PerBodyOffsetGene`) | league identity | UNTOUCHED — and independently recomputed as G-IDENT/G-FP |
| 6 | **the `SupportBallCarrier` action label/type surface** | `tests/combos.test.ts:183` (constructs the action), `src/render/actionLabels.ts`, `src/sim/types.ts` | type/label | UNTOUCHED — no new action type, no label change, no render cue |
| 7 | **the marking-scheme assignment pin** (MT-T0's pin, adjacent family) | `tests/formations.test.ts:143` | assignment only | UNTOUCHED — reads `team.marks` membership; this slice adds nothing to `TeamBrain.ts` |
| 8 | **the whole suite** | 128 pre-change test files (129 with this stage's) | everything downstream | UNTOUCHED — G-SUITE runs it in full: 1,220/1,222 green, the two reds being the pre-existing wall-clock flakes reproduced on the pre-change tree (§CHECKS). **No test file was edited by this stage**; the only `tests/**` change is the NEW `ctbSupportPlane.test.ts` |

## §GATES — frozen ex ante (the MT-T0 form)

All computed IN-PROBE (#181.2); `head` / wall-clock / paths ride the UNHASHED
envelope (#197-M1) so `resultSha256` re-derives at any commit or path.

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with the genes and flag absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — **all three RECOMPUTED IN-PROBE** and written to the committed artifact. **Semantics: this IS the sim path's RNG-stream receipt** — the baselines were frozen from PRE-change code, so any added draw, conditional or not, would break them | HARD |
| **G-FP** | the 1337 row IS the production fingerprint; `npm run fingerprint` prints it unchanged | HARD |
| **G-OFF** | per-match whole-run signature **including the rng stream state**: flag ABSENT ≡ flag FALSE, in BOTH the production-shaped world and the percept-armed world, on every receipt seed. **Semantics, exactly (#194): both arms execute the SAME flag-off code path, so this proves CONFIG EQUIVALENCE and nothing more** — it is NOT an RNG-stream gate (that is G-IDENT + the zero-rng src diff) | HARD |
| **G-BORN** | ARMED (`ctbSupportPlane: true`) with both genes ABSENT ≡ OFF, byte for byte, on every receipt seed. **Semantics: THE ARMS DIFFER IN CODE PATH** — armed ⇒ the M-CTB.1 fork is ENTERED on every support tick and both weight maps evaluate to their zeros ⇒ byte-identity proves the born-absent read is inert **through the live branch** | HARD |
| **G-ZERO** | ARMED with both genes present AT ZERO ≡ OFF, byte for byte, every receipt seed — **the zero-point identity**: the law must be exactly null at 0, so the absorbed ternary really is the centre and not an approximation of it | HARD |
| **G-BITE** | ARMED at non-zero dose the world DIVERGES from OFF on every receipt seed — the identity gates are not the identity of dead code — **AND the GEOMETRY moves as §LAW says**: at the four traced corners (deep / shallow / narrow / wide) actual `supportSpot` outputs are sampled on live match states and checked for SIGN and MAGNITUDE against the law, in-probe (deep ⇒ x moves against `attackDir` by `|depth|·span·radius`; wide ⇒ `\|y − ball.y\|` grows; narrow at −1 ⇒ `y === ball.y` exactly). ⚠ TWO CORRECTIONS AFTER FIRST SIGHT, recorded not rewritten (§DEV 3–4): (i) the "narrow ⇒ `y === ball.y`" and "deep ⇒ exact x" claims are asserted **up to the INCUMBENT pitch clamps** `±(HALF_W−2)` / `±(HALF_L−2)`, which are not this slice's and bind on real ticks — the gate now compares against the exactly-predicted CLAMPED value, so the clamp is priced rather than excused; (ii) the pre-registered "the incumbent lands behind the ball on ZERO ticks" is **empirically FALSE** — the x clamp already does it when the ball is beyond `HALF_L−2` — so the gate instead asserts that EVERY incumbent behind-ball sample is clamp-bound (i.e. no GENOME expresses depth, which is the contract §0.3 fact as actually stated) and that the deep dose strictly increases the count | HARD |
| **G-RNG** | the seam draws **zero** rng — an armed, fully dosed `supportSpot` call on a stepped fixture leaves the match rng state EXACT — and the opt-in's draws sit strictly after every existing draw: 8 generations of the shipped mutate+crossover with the opt-in OFF reproduce a faithful PRE-GENE re-implementation's genomes AND final rng state exactly, the genes stay absent, the opt-in path is shown live, **and the `markSag` opt-in's OWN stream is unmoved** | HARD |
| **G-HYGIENE** | `ctbSupportPlane` is absent from `a4World.ts` **entirely** (file-wide string scan, incl. `A4_WORLD_FLAGS` and `a4MatchFlags(1\|2\|3)`); both genes absent from `a4World.ts`; initialised `cfg.ctbSupportPlane ?? false`; genes absent from `GENE_KEYS`; a fresh Match and a League match are both OFF; no `envArmed` / `EDS_BUNDLE_ARMED` anywhere in the seam | HARD |
| **G-FORK** *(added, §DEV 2)* | **exactly ONE** `ctbSupportPlane` read fork in `src/**`, inside `supportSpot`; the flag's every other `src/**` occurrence is enumerated with file:line and class (declaration / init / pass-through / union key) | HARD |
| **G-TRACE** *(added, §DEV 2)* | `CTB_DEPTH_BIAS_SPAN === SUPPORT_LAT_CAP_FRAC === 0.9` **derived in code** (the source line matched VERBATIM, and the derivation asserted as an identity, not as a number), `SUPPORT_LAT_PULL === 0.75`, and the gene domain is the signed [−1,1] | HARD |
| **G-PINS** | the §PINS inventory's machine-checkable rows recomputed: zero `supportSpot` callers in `tests/**`, and the named pin files/lines still exist | HARD |
| **G-SEED** | seed-block disjointness proved in-probe against the COMPLETE consumed ledger (the o2-t1 list + O2-T1's own consumption) | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests | HARD |
| **G-SUITE** | FULL `npm test` green + `tsc --noEmit` clean. (The known `formationEvolution.test.ts` ten-season wall-clock timeout is pre-existing, #196.2 — if it reds it is reproduced on the PRE-change commit to show it is not ours) | HARD |
| **REPORTED** | a dosed smoke reading: the seam reached at scale (support ticks touched), and the corner geometry table in metres. Descriptive, no control, no CI, no dose curve, **no ANSWER** — a reading for the commander, never a licence to re-cut a span | REPORTED |

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any src diff
outside the seam path, any rng draw appearing on the dormant path, any predicate
appearing anywhere, or **any existing test breaking** (a STOP-and-report, never a test
edit).

No bootstrap is used anywhere in this stage, so the ≥104,800 stats base does not
apply — every number here is either an identity, a count, or a geometric quantity read
off a deterministic run.

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| A4/O/PM/MT-arc consumed through | see the probe's `CONSUMED` table (inherited from the o2-t1 probe in full) | prior |
| O2-T1 consumption (#222) | 12,422,000–011 · 12,422,050–099 · 12,422,100–419 (reserved to 12,422,899) | prior |
| **CTB-T0 receipts (this stage)** | **12,423,000 – 12,423,023** (24 seeds × 7 arms) + **12,423,024** (the corner-geometry + dosed smoke read) | **CONSUMED here** |
| CTB-T0 test-file seeds (not a battery) | 12,423,900 – 12,423,901 | consumed here |
| free above | 12,423,025 – 12,423,899 and 12,423,902 + | available to CTB-T1 |

Disjointness from every listed consumed block is computed **in-probe**
(`gates.seedDisjoint`), not asserted here.

## §ROAD B — nothing ships

Both genes are **BORN ABSENT** in every genome; `ctbSupportPlane` is **OFF in every
production path** — a hard `false` default, absent from `a4World.ts` and from all
three play-test worlds, absent from every League's `matchFlags` unless a probe sets it
explicitly — and even ARMED it does nothing while the genes are absent (G-BORN), and
nothing while they are at zero (G-ZERO). The production fingerprint is unchanged, the
flag-off world is byte-identical on three league seeds and on every receipt match seed
with the rng stream included, and an opted-out evolution run draws zero extra rng.
**Nothing about the game the user plays changes in this commit.** The seam exists so
CTB-T1 can force it.

## §NON-CLAIMS

CTB-T0 claims **no** football effect: not on TRUE-holdable supply, not on
support-existence at pressed moments, not on the pressed-first-reception share, not on
constructed/scramble shares, not on interceptions, offside, spacing, goals or the
equilibrium band, not on watchability. The REPORTED smoke is one uncontrolled
descriptive reading and adjudicates nothing — **F-CTB-a** (no dose moves the supply),
**F-CTB-b** (clump/interception re-import) and **F-CTB-c** (offside/box pathology) are
all **CTB-T1's** to fire. Per contract §4 it changes **no** TeamBrain assignment, **no**
pass selection, **no** carrier behaviour, adds **no** dynamic/state coupling (deferred
by name in M-CTB.3) and **no** per-body genes. It adds no attribute, no new action
type, no render cue, no coach rung and no offside work. It does not claim the frozen
spans are the RIGHT spans — only that they are traced, derived in code, frozen before
sight, and unre-cut. It cannot authorize CTB-T1; only the commander can.

---

## §RESULT — the gates run

*(filled in from the committed artifact after the receipts ran; every number here is
quoted FROM `docs/world-model/data/ctb-t0-support-plane.json`, which is recomputed by
`npx tsx scripts/probes/ctb-t0-support-plane.ts` — the doc never carries evidence the
artifact does not.)*

Tests: [`../../tests/ctbSupportPlane.test.ts`](../../tests/ctbSupportPlane.test.ts) —
**16 pins** (16 `it()` blocks). Receipts:
[`../../scripts/probes/ctb-t0-support-plane.ts`](../../scripts/probes/ctb-t0-support-plane.ts),
artifact [`data/ctb-t0-support-plane.json`](data/ctb-t0-support-plane.json).
**24 seeds × 7 arms (absent · off · plain · plainOff · bornArmed · zeroArmed · forced)
= 168 full matches per core run, and the core runs TWICE (G-DET, byte-identical
digests), plus 3 league-seed 2-season identity runs, the corner-geometry read and the
dosed smoke on seed 12,423,024, the seam rng fixture, the 8-generation evolution-rng
comparison (three arm pairs) and the `src/**` fork scan.** Verdict: **GATES PASS**
(`gates.allPass === true`), probe exit 0. Wall ≈ 57 s (CONTEXT ONLY — used in no rate).

* **G-DET digest** — `gates.gDet.digestA === digestB ===`
  `5efe6a9b13828270c2700e62c2f47e78f487d2e0c5b43a397b67bdd5dd1417e4`
* **resultSha256** `39797917037e3da8e2a087fcb15818ed769c55686c2eb550f72b5c0241400793`
  (recomputable: `npx tsx scripts/probes/ctb-t0-support-plane.ts`). ⭐ Per #197-M1 the
  hashed body is **commit-free, timing-free and path-free** — `headContextOnly`,
  `wallMsContextOnly` and `artifactPathContextOnly` ride the envelope, OUTSIDE the
  hash, so a third party re-derives this hash at an arbitrary commit or path.
* Both hashes are quoted from **this run's committed artifact** and from nowhere else.
* **Files touched** — the authoritative list is `git show <this commit> --stat`; no
  completeness claim is made here from a `git diff --stat` (the #194 L3 lesson).

### Gate table

| gate | verdict | evidence (all recomputed in-probe, #181.2) |
| --- | --- | --- |
| **G-IDENT** | ✅ PASS | all three league hashes IDENTICAL to the frozen pre-change baselines: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26` — `gates.gIdent.rows`, each computed by the `scripts/fingerprint.ts` procedure on this run. **This is the sim path's RNG-stream receipt** |
| **G-FP** | ✅ PASS | the 1337 row IS the production fingerprint (`gates.xFpProd`); `npm run fingerprint` re-derives `57b0bdab…c673` unchanged (§CHECKS) |
| **G-OFF** | ✅ PASS | 24/24 seeds: flag ABSENT ≡ flag FALSE in the percept-armed world AND the production-shaped world (`identical` ∧ `plainIdentical`), whole-match signature including the rng stream state. **CONFIG EQUIVALENCE ONLY** — both arms run the same flag-off path, so this gate proves nothing about RNG streams (that is G-IDENT + the zero-rng seam) |
| **G-BORN** | ✅ PASS | 24/24: ARMED with both genes ABSENT ≡ OFF, byte for byte. **The arms differ in code path**: armed ⇒ the fork inside `supportSpot` is entered on every support tick and both weight maps evaluate to their zeros ⇒ the born-absent read is inert *through the live branch* |
| **G-ZERO** | ✅ PASS | 24/24: ARMED with both genes PRESENT at 0 ≡ OFF, byte for byte. The arms differ in code path AND in gene state ⇒ the deformation law is **exactly null at zero**: the absorbed mode ternary and the incumbent fan constants really are this plane's centre |
| **G-BITE** | ✅ PASS | **24/24 forced arms diverge** from absent. Corner geometry, seed 12,423,024, **10,968 sampled body-ticks**, **0 sign violations and 0 magnitude violations at all four corners** — see the table below. The headline: the DEEP corner puts a supporter behind the ball on **10,836** ticks against the incumbent's **132**, and all 132 incumbent ones are **clamp-bound** (`incumbentBehindBallClampBound === incumbentBehindBallSamples`), i.e. no GENOME expresses depth today — the contract §0.3 fact, measured |
| **G-RNG** | ✅ PASS | (a) the seam: an ARMED, fully DOSED `supportSpot` call over every body of both teams on a 400-tick fixture leaves the match rng state EXACT — **2284000916 → 2284000916**, 12 calls. (b) evolution, 8 generations, opt-in OFF: genomes identical to the pre-gene re-implementation, both genes stayed absent, final rng state matches exactly — **`sActual === sHead === 2263703047`**; the opt-in path is live (`optInDraws: true`) and **`markSagStreamUnmoved: true`** — a `evolveMarkSag`-only run reproduces a markSag-only re-implementation's stream AND value exactly, so the new draws really do sit after it |
| **G-HYGIENE** | ✅ PASS | `cfg.ctbSupportPlane ?? false`; the flag AND both genes absent from `a4World.ts` entirely; genes absent from `GENE_KEYS`; `randomGenome` never creates them and never serializes them; a fresh Match and a League match are both OFF; no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` on any seam line |
| **G-FORK** | ✅ PASS | **exactly ONE fork**, `src/ai/formations.ts:661`. The complete `src/**` occurrence list, zero unclassified: `actionExecutor.ts:406` PASSTHROUGH · `formations.ts:643` PARAM · `formations.ts:661` **FORK** · `League.ts:283` UNION_KEY · `Match.ts:490` CONFIG · `Match.ts:731` FIELD · `Match.ts:1216` INIT |
| **G-TRACE** | ✅ PASS | `CTB_DEPTH_BIAS_SPAN === SUPPORT_LAT_CAP_FRAC === 0.9` with the declaration line `export const CTB_DEPTH_BIAS_SPAN = SUPPORT_LAT_CAP_FRAC;` matched VERBATIM (so the number cannot be re-typed as a literal), the cap and pull lines matched verbatim at the seam site, `SUPPORT_LAT_PULL === 0.75`, gene domain `[−1, 1]`, and both behind-reach checks negative (`0.75 − 0.9 = −0.15`, `0.35 − 0.9 = −0.55`) |
| **G-PINS** | ✅ PASS | **0** pre-existing `supportSpot` callers in `tests/**` (this stage's own pin file: 9, counted separately) and **5/5** named pins present verbatim. Nothing renegotiated |
| **G-SEED** | ✅ PASS | 12,423,000–12,423,024, **zero collisions** with the 22 consumed blocks incl. O2-T1's three (`gates.seedDisjoint.collisions === []`) |
| **G-DET** | ✅ PASS | two invocations of the core, identical digests (above) |
| **G-SUITE** | ✅ PASS (with the pre-existing flake disclosed) | `tsc --noEmit` clean; `npm test` **1,220/1,222 green**, the two reds being pure WALL-CLOCK TIMEOUTS (`formationEvolution` ten-season, `simRunner` multi-season) that **reproduce identically on the PRE-CHANGE tree** (seam stashed out, whole suite re-run) and both pass ISOLATED on this tree. Not this seam's — full transcripts and the honest caveat in §CHECKS |

### G-BITE — the corner geometry table (seed 12,423,024, 10,968 body-ticks)

| corner | depth | width | mean ahead-of-ball (m) | mean \|lateral\| (m) | behind-ball ticks | sign / magnitude violations |
| --- | --- | --- | --- | --- | --- | --- |
| *(incumbent)* | — | — | **5.000** | **5.427** | 132 (all clamp-bound) | — |
| **deep** | −1 | 0 | **−6.109** | 5.427 | **10,836** | 0 / 0 |
| **shallow** | +1 | 0 | **15.297** | 5.427 | 132 | 0 / 0 |
| **narrow** | 0 | −1 | 5.000 | **0.008** | 132 | 0 / 0 |
| **wide** | 0 | +1 | 5.000 | **9.616** | 132 | 0 / 0 |

Read exactly: the depth corners move **only** x (the lateral column is bit-identical
to the incumbent) and the width corners move **only** y (the ahead column is
bit-identical) — the two axes are orthogonal by construction, and that orthogonality
is measured here, not asserted. The narrow corner's residual 0.008 m is **not** slop:
`widthScale = 0` puts the point exactly on the ball's lane, and the mean is non-zero
only because of the INCUMBENT touchline clamp on balls outside ±(HALF_W−2) — every
sample matches its exactly-predicted clamped value (0 magnitude violations).

### REPORTED — the dosed smoke (ONE forced match at the 回撤 corner, seed 12,423,024)

| quantity | value |
| --- | --- |
| support ticks sampled (bodies actually holding `SupportBallCarrier`) | **3,345** |
| ticks where the seam moved the point | **3,345 (100%)** |
| mean shift | **11.99 m** (max 19.75 m) |
| mean ahead-of-ball, incumbent → dosed | **5.71 m → −3.14 m** |
| ticks with the support point BEHIND the ball | **2,880 (86.1%)** |

**What this is and is not.** It is a reading that the seam is REACHED at scale on
bodies genuinely doing the supporting job, and that at the 回撤 corner the support
seat really does sit behind the ball — the missing limb, moving. It is **ONE match at
ONE corner**, with **no control arm, no CI and no dose curve**; it says nothing about
whether any of it helps. Whether the receiver-side ruler moves is **CTB-T1's**
question, and F-CTB-a/b/c are entirely T1's to fire.

### §CHECKS

```text
$ npx tsc --noEmit
tsc clean

$ npx vitest run tests/ctbSupportPlane.test.ts
 Test Files  1 passed (1)
      Tests  16 passed (16)

$ npx vitest run tests/formations.test.ts tests/cards.test.ts     (THE PINS, isolated)
 ✓ cards (Phase 25) > directional: playing a man short costs results (forced early red)  64361ms
 Test Files  2 passed (2)
      Tests  19 passed (19)
   Duration  201.59s

$ npm run fingerprint
seed=1337 seasons=2 matches=142
sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673

$ npx tsx scripts/probes/ctb-t0-support-plane.ts        (exit 0)
GATES PASS — artifact docs/world-model/data/ctb-t0-support-plane.json

$ npm test          (vitest run, THIS tree)
 Test Files  2 failed | 127 passed (129)
      Tests  2 failed | 1220 passed (1222)
   Duration  286.67s
 FAIL tests/formationEvolution.test.ts > ten seasons: …  Error: Test timed out in 180000ms.
 FAIL tests/simRunner.test.ts > multi-season runs advance evolution identically
                                                        Error: Test timed out in 20000ms.

$ npx vitest run tests/simRunner.test.ts tests/formationEvolution.test.ts   (same tree, ISOLATED)
 ✓ simRunner … multi-season runs advance evolution identically  11566ms   (budget 20000ms)
 ✓ league-level style ecology > ten seasons: …                  146439ms  (budget 180000ms)
 Test Files  2 passed (2)
      Tests  8 passed (8)

$ git stash push <the 5 seam src files>; npm test          (the PRE-CHANGE tree, #196 form)
 Test Files  2 failed | 126 passed (128)
      Tests  2 failed | 1204 passed (1206)
 FAIL tests/formationEvolution.test.ts …  Error: Test timed out in 180000ms.
 FAIL tests/simRunner.test.ts …           Error: Test timed out in 20000ms.
$ git stash pop                                            (tree restored, verified)
```

**G-SUITE, stated exactly.** Two files red on the full-suite run, **both pure
wall-clock TIMEOUTS, neither an assertion**, and **both reproduce identically on the
PRE-CHANGE tree** (the #196 form: the seam was stashed out and the whole suite re-run —
same two files, same two timeout messages, 1,204 other tests green). Isolated on THIS
tree both pass with room to spare (11.6 s against a 20 s budget; 146 s against 180 s),
so the mechanism is parallel-load contention, not this seam. ⚠ Recorded honestly: the
#196.2 flake family was previously named for `formationEvolution.test.ts` only —
`simRunner.test.ts`'s 20 s multi-season budget is a **second, newly-observed member**
of it on this machine, and it is not this stage's to fix.

### Deviations recorded

1. **TWO genes, ONE opt-in.** The contract's axis pair is two genes (they are two
   orthogonal freedoms and CTB-T1 doses them independently), but they share ONE
   `evolveCtbSupportPlane` opt-in: they are one body's positional freedom, not two
   tactics, and CTB-T2 selects on the plane as a plane. Crossover therefore draws
   TWICE under one gate (unlike the offset FAMILY's single draw) — recorded because it
   is a choice, not an inevitability.
2. **TWO gates were ADDED to the frozen list** (G-FORK, G-TRACE), not removed:
   the dispatch's deliverables name a single-read-fork pin and traced-bound pins as
   TESTS; promoting them to in-probe HARD gates is strictly more conservative.
3. **G-BITE's "narrow ⇒ y === ball.y" and "deep ⇒ exact x" claims are asserted up to
   the INCUMBENT pitch clamps**, which bind on real ticks. The first run showed 72
   "violations" at the narrow corner that were entirely `clamp(ball.y, ±(HALF_W−2))`
   — the incumbent expression's own clamp, untouched by this slice. The predicate was
   made EXACT (compare against the predicted clamped value) rather than loosened to a
   tolerance, and it is recorded here rather than quietly rewritten.
4. ⭐ **A pre-registered claim was FALSIFIED and is withdrawn, not repaired.** G-BITE
   as frozen asserted the incumbent lands behind the ball on ZERO ticks. It does not:
   **132 of 10,968 sampled incumbent ticks are behind the ball**, every one of them
   with the x clamp binding (a ball beyond `HALF_L−2` near the goal line). The
   contract §0.3 fact — *"no genome in the entire evolvable space can place a
   supporter level with or behind the ball"* — survives exactly as written, because
   none of those 132 is genome-expressible; but the stronger colloquial reading ("a
   supporter is never behind the ball") is **false at the pitch edges** and must not
   be quoted. The gate now asserts the clamp-boundness of every incumbent case plus a
   strict increase under dose.
5. **The seam's read fork takes the flag as a FUNCTION PARAMETER**, not by reading
   `match` inside `supportSpot`. `supportSpot(p, team, ball)` has ~15 probe call sites
   across `scripts/**`; a default-`false` fourth parameter leaves every one of them on
   the incumbent expression with no edit, and keeps the fork inside the function the
   contract names (M-CTB.4's single read site). The alternative — passing `match` —
   would have widened the function's surface for no gain.
6. **`SUPPORT_LAT_PULL` / `SUPPORT_LAT_CAP_FRAC` are new exported names for old
   numbers.** Pure code motion at the incumbent use site (×1 and +0 are exact), done
   so the width axis' bound could be written as a reference to the constant it
   deforms rather than as a fresh literal. No third constant is introduced by this
   slice.
7. **No bootstrap, no CI anywhere in this stage** — every number is an identity, a
   count or a deterministic geometric quantity, so the ≥104,800 stats base does not
   apply. Stated rather than left implicit.

### Disposition

The seam is BUILT and DORMANT: both genes are born absent and outside `GENE_KEYS`,
the consumption flag is a hard `false` absent from every bundle, the production
fingerprint is unchanged, flag-off byte-identity holds on three league seeds and 24
match seeds with the rng stream included, an ARMED world is byte-identical to OFF both
with the genes ABSENT and with them AT ZERO *through the live branch*, the seam draws
zero rng and an opted-out evolution run draws zero extra, exactly one read fork exists
in `src/**`, every pinned test is untouched and green, and under force the geometry
moves exactly as §LAW says at all four traced corners — putting a supporter behind the
ball on 10,836 of 10,968 sampled ticks where the incumbent expression manages 132, all
of those a clamp artefact. There is **no predicate anywhere** (#200). **Nothing
ships.** CTB-T0 cannot authorize CTB-T1 — the SUPPORT-SUPPLY EXAM is the commander's
call.
