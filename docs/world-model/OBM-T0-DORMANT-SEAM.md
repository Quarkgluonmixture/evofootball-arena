# OBM T0 — the DORMANT OFF-BALL EYES SEAT (`obmMovement`, 前插与回撤是同一个选择)

Status: **PRE-REGISTERED, then BUILT + RUN the same round.** The gene law with its
traced bounds, the seam, the read-fork inventory, the gates, the seed ledger, the PIN
INVENTORY and the Road B statement below were written **before** the receipts ran (the
frozen-before-sight rule, the CTB-T0 / O2-T0 two-part form); the measured numbers
arrive only in [§RESULT](#result--the-gates-run) at the foot.

Authority chain: contract
[`OFFBALL-MOVEMENT-CONTRACT.md`](OFFBALL-MOVEMENT-CONTRACT.md) — §0 (the code facts:
the off-ball attack decision reads NO percepts; 前插 is a top-down LICENSE, not the
body's choice) · §2 **M-OBM.1** (the SEAT, on today's candidate triplet) · **M-OBM.2**
(the EYES — four continuous percept features, 像人眼一样获得数据) · **M-OBM.3** (the
POLICY — genes weight features→outputs; NO predicates, #200) · **M-OBM.4** (untouched:
designation, pass selection, carrier seats, the price table; the percept-pull cost
bounded at the existing cadence laws) · §3 the **OBM-T0** clause (⚠ the PIN INVENTORY
and the READ-FORK INVENTORY are NAMED deliverables) · §4 the non-claims. Ruling
**#227** (the dispatch, carrying the user's reframe: 前插和回撤在我们的系统里都应该是
球员的可选择性…这些都感知后…然后通过进化就决定了他们是怎么走的) and the
**#181.2 / #194 / #196 / #197-M1 / #200 / #202** evidence lessons verbatim.
[`CTB-T0-DORMANT-SEAM.md`](CTB-T0-DORMANT-SEAM.md) and
[`O2-T0-DORMANT-SEAM.md`](O2-T0-DORMANT-SEAM.md) are the FORM this document and its
receipts follow — the latter's *honesty limits* section is the template for §HONESTY
below.

Banked evidence this stage stands on: **CTB-T1 / F-CTB-a** (#226 — the static plane
delivers geometry totally and supply not at all; the missing dimension is WHEN), the
banked **CTB support plane** (#224 — this seat's geometry VOCABULARY, driven here, not
re-cut), **O2-T1 / F-O2a** (#222 — you cannot see support that does not exist), and
the **#225.3(b)** saturation decode (raw proximity ~94.5 % saturated; scarcity lives in
SAFE support, and safety is a function of opponents and timing).

---

## §LAW — the frozen gene law, and where every bound comes from

```text
THE EYES (all from the body's OWN match.perceivedSnapshot(p); all in [0,1])
  f1 carrierPlight     = clamp01(1 − d(nearest perceived OPP, perceived CARRIER) / R)
  f2 ownMarker         = clamp01(1 − d(nearest perceived OPP, HIMSELF)            / R)
  f3 targetCongestion  = clamp01(1 − d(nearest perceived OPP, CANDIDATE POINT)    / R)
  f4 readingAge        = clamp01( mean ageTicks of his perceived OPPs / RETENTION )
      R         = PRESSURE_RADIUS_M                    (src/ai/perception.ts)
      RETENTION = perceptionRetentionTicks(awareness)  (src/ai/perceptionSnapshot.ts)
  ⭐ NO snapshot, or NO perceived opponent  ⇒  ALL FOUR EXACTLY ZERO.

THE POLICY (16 team-level weights, born absent ⇒ all 0; domain SIGNED [−1,+1])
  output_o     = ( Σ_i  w[o][i] · f_i ) / OBM_FEATURE_KEYS.length      ∈ [−1, +1]
  plane.depth  = clamp( ctbSupportDepth(g) + output_planeDepth , −1, +1 )
  plane.width  = clamp( ctbSupportWidth(g) + output_planeWidth , −1, +1 )
  supportMul   = 1 + output_supportScore · OBM_SCORE_SPAN              ∈ [0.6, 1.4]
  runMul       = 1 + output_runScore     · OBM_SCORE_SPAN              ∈ [0.6, 1.4]

THE CONSUMPTION (the banked CTB limb is the vocabulary — #224, unmodified)
  depthShift = plane.depth · CTB_DEPTH_BIAS_SPAN ;  widthScale = 1 + plane.width
  supportScore *= supportMul ;   licensedRunScore *= runMul

  OBM_SCORE_SPAN      = 1 − OFFBALL_TIRED_MUL      ← DERIVED IN CODE (= 0.4)
  OBM_WEIGHT_MIN/MAX  = CTB_GENE_MIN / CTB_GENE_MAX ← DERIVED IN CODE (= ∓1)
  OBM_WEIGHT_SLOTS    = OBM_OUTPUT_KEYS.length × OBM_FEATURE_KEYS.length ← DERIVED
  OBM_POLICY_TTL_TICKS = ceil( AI_INTERVAL / DT )  ← DERIVED IN CODE (= 9 ticks)
```

### 1. Three incumbent constants are NAMED, not changed

Pure code motion, the CTB-T0 `SUPPORT_LAT_PULL` precedent verbatim — the same numbers,
given names at their own use sites so this slice's bounds can be written as references
to the constants they are taken from rather than as new literals (#202):

* **`PRESSURE_RADIUS_M = 6`** (`src/ai/perception.ts`) — the very `/ 6` that
  `pressureAt` has always divided by: the engine's standing answer to *"from how far
  away does an opponent's proximity still count as pressure on a point"*.
* **`perceptionRetentionTicks(a) = round(15 + a·45)`** (`src/ai/perceptionSnapshot.ts`)
  — the very expression the three perception paths have always used for *"how long is
  a reading still worth keeping"* (0.25–1.0 s), now called at all three sites.
* **`OFFBALL_TIRED_MUL = 0.6`** (`src/sim/constants.ts`) — the very `s *= 0.6` that
  `decideOffBall` has always applied to **these two scores** when a body is tired.

Numerically nothing moves: the same values reach the same expressions.

### 2. The FEATURES — why these four, and why in this exact form

The four families are the contract's own **M-OBM.2** list, and they are declared as
slice-one **BOUNDS, not an exhaustive account** of what a footballer reads (the #91
form forbids pretending completeness). Each is normalised by an incumbent constant, so
the seat invents no new sense of scale:

* **f1 / f2 / f3 are ONE reading taken at THREE places** — the pressure-radius family
  the whether-eye already prices, evaluated at the perceived carrier, at himself, and
  at the point he would otherwise walk to. Same formula, same radius, three questions.
* **f3's polarity is CONGESTION, not space.** "Space at the candidate spot" is
  `1 − f3`. All four features therefore RISE with tightness/staleness, which keeps the
  matrix readable: a weight's SIGN is what says *"go where it is empty"*.
* **f2 is pure proximity.** Goal-side-ness was considered and deliberately NOT taken at
  slice one: it needs a second traced constant and a direction convention, and the
  contract bounds the families rather than obliging their richest form. Declared, not
  smuggled.
* **f4 normalises by RETENTION because that is the horizon the trunk itself uses**: at
  the retention age a reading is deleted, so `age / retention` is a natural [0,1]
  quantity with a meaning — *how far through its own shelf life my picture is*.

### 3. The POLICY's bound is DERIVED, not chosen

`output_o` divides by the feature count. That is not a tuning constant: a weight is
signed-unit and a feature is unit, so **the MEAN of the weighted features spans exactly
[−1,+1] — precisely the reach ONE static plane gene already has.** So the DYNAMIC term
may say exactly as much as the STATIC term and no more, and `clamp(static + dynamic)`
lands in the banked axis' own domain. This is the same **question-identity** trace the
MT-T0 and CTB-T0 spans were chosen by, and it is what makes the contract's sentence
literally true in code: *the static gene is the policy's bias/intercept*.

`OBM_SCORE_SPAN` is traced the same way. Of everything that already scales the
`SupportBallCarrier` and `MakeRun` scores — the mode multiplier, the role bonus, the
fatigue multiplier — the **fatigue** one is the engine's answer to the identical
question this seat asks: *how much may a body's own state scale exactly these two
scores?* Its reach is `1 − 0.6 = 0.4`, so the perceived-situation policy gets exactly
that much UP as fatigue already has DOWN. **Never re-cut**: if OBM-T1 needs a different
span that is a fork for the commander WITH numbers, not a quiet re-freeze after sight.

### 4. Why the gene is ONE 4×4 MATRIX and not a hand-picked subset

The dispatch permitted "a full 4-feature × 4-output matrix or a justified reduced set".
The **full matrix** is taken, because choosing which feature may drive which output
would be exactly the hand-coded tactic the VISION forbids — *which* reading matters for
*which* movement is the evolved weights' business, not the engineer's. 前插 and 回撤 are
the same sign flip on `planeDepth`, and nothing in `src/**` names either.

### 5. Why the domain is SIGNED [−1,+1]

Same reason as the CTB pair: these are deformations around an INCUMBENT CENTRE, so zero
must be interior and the reach must be signed. A policy that could only push a body ON
would be half a policy; 前插与回撤是同一个选择 is a statement about a SIGN.

**Sizing honesty, stated up front.** At full dose one feature at 1.0 moves the plane by
`1/4` of an axis — about 2.3–4.1 m of front-back shift — and a score by ±10 %. All four
features aligned reach the full axis and ±40 %. Whether any of that moves the
receiver-side ruler is **exactly OBM-T1's question**, and this stage pre-commits to NOT
re-cutting any bound to make OBM-T1 succeed.

## §HONESTY — the epistemic limits, stated plainly (the O2-T0 form)

1. **He reads only what his own eyes recorded.** Every feature comes from
   `match.perceivedSnapshot(p)` — the E3R2 recorder trunk with its cone on his own
   heading, its awareness-scaled range, its keyed noise and its staleness. There is no
   truth scan anywhere in the seat, and that is machine-checked twice (G-EPI in the
   probe and in the test): the ONLY member of `match` the module names is
   `perceivedSnapshot`.
2. **His own body is proprioception, and that is by the trunk's own rule.** `p.pos` and
   `p.side` are read directly — the perception trunk itself writes proprioception
   continuously without a scan, and the whether-seat reads self-position the same way.
   This is stated rather than hidden: the seat is honest about OTHERS, exact about
   HIMSELF.
3. **The candidate point is his own INTENTION, not information.** f3 is measured at
   `supportSpot(p, team, ball)` — the point he would take with the seat absent. It is
   truth-anchored only in the sense that the incumbent executor's own target always has
   been; the seat adds no channel. It is the **UNDEFORMED** point on purpose, so the
   policy's output can never feed back into its own input.
4. **⭐ A BLIND BODY HAS NO POLICY.** `refreshPerception` runs only when
   `edsPerceivedDefence || edsPerceivedChoice || stationEye !== null`
   (`src/sim/Match.ts`), and without a memory `perceivedSnapshot` returns `null`. In a
   world with the percept trunk OFF the seat therefore reads NOTHING and modulates
   NOTHING — features zero, outputs zero, `+0` and `×1`. This is gated (**G-BLIND**),
   not asserted. **T1 DESIGN NOTE, recorded here ex ante: OBM-T1's exam world MUST be
   percept-armed, or the treatment is never delivered** (the P1 failure mode).
5. **Zero is the NO-POLICY point, not a reading.** A body who perceives no opponent
   gets f1=f2=f3=0 and f4=0. That is *not* a claim that there is no pressure and *not*
   a claim that his eyes are fresh — it is the continuous form of the whether-seat's
   E-NOCELL rule (perceiving nobody is not perceiving nobody THERE). Anyone reading the
   feature stream at T1 must price this: **zero is silence, not evidence.**
6. **He cannot choose to look, and this seat does not let him.** f4 prices stale eyes;
   it cannot refresh them (contract §7(b)). An off-ball LOOK action is future work.
7. **The seat reads at the BRAIN's cadence, not the executor's.** The policy is
   computed once per off-ball decision (`AI_INTERVAL`) and cached on the match; the
   executor — which runs every tick — re-uses it and pulls no percept. The cache is
   capped at `OBM_POLICY_TTL_TICKS = ceil(AI_INTERVAL / DT)`, so a body who stopped
   deciding modulates nothing. That cap is what makes M-OBM.4's cadence sentence a
   mechanism rather than a promise — and the cost of the one pull it does allow is
   MEASURED in §RESULT, not assumed.

## §SEAM — the mechanism (all of it dormant)

### The gene

* **`offballMovementWeights?: number[]`** — one OPTIONAL `TacticalGenome` key holding
  the flat row-major `OBM_WEIGHT_SLOTS`-entry matrix, **BORN ABSENT**, the
  `ctbSupportDepth` / `markSag` birth form verbatim:
  * deliberately **NOT in `GENE_KEYS`**, so `randomGenome` / `mutateGenome` /
    `crossoverGenomes` / `geneDistance` draw the EXACT same rng in the EXACT same order
    as HEAD, and an absent optional key is omitted by `JSON.stringify` ⇒ the serialized
    genome and the production fingerprint are byte-identical;
  * it evolves ONLY under **ONE OWN explicit `evolveOffballMovement` boolean** (#75),
    whose draws sit **STRICTLY AFTER the `ctbSupportPlane` block** (hence after
    `markSag`, `defLaneConvergence` and both home-prior blocks);
  * absent ⇒ `offballMovementWeightVector()` is 16 zeros ⇒ every output is `0` ⇒
    `+0` and `×1` ⇒ the terms vanish EXACTLY.
* **Mutation** draws per slot in fixed row-major order (the offset FAMILY's law,
  #164.3). **Crossover draws ONCE for the whole matrix** — a policy is ONE agreement
  about how to read a situation, not sixteen independent ones, so a child inherits a
  coherent policy rather than a mosaic. (Recorded as a choice, §DEV 1.)

### The consumption flag

* **`obmMovement`**, a new **explicit** `MatchConfig` boolean, initialised
  `cfg.obmMovement ?? false` (`Match.ts`) — a **hard `false`**, the `ctbSupportPlane` /
  `mtMarkSag` / `o2Look` form. **Never** `EDS_BUNDLE_ARMED`, never env-armed, never
  default-ON, never bundle-defaulted: **absent from `src/game/a4World.ts` entirely**
  (`A4_WORLD_FLAGS` and every `a4MatchFlags(v)`), so no play-test world, preset or env
  bundle can turn it on. It gets its own `League.matchFlags` key so a probe world can
  arm it EXPLICITLY, and that key changes no default.
* ⭐ **THE ARMING CHECKLIST — FOUR limbs (binding, #196.3-D4 + this stage's new one)**:
  armed = the `obmMovement` flag **+** the `evolveOffballMovement` opt-in (for evolution
  runs) or a probe-written matrix **+** a non-absent matrix **+** **a PERCEPT-ARMED
  WORLD** — ALL FOUR. The fourth is new and it is honest: three limbs satisfied in a
  blind world is still a world where nothing happens (G-BLIND). Even ARMED the world is
  unchanged while the matrix is absent (G-BORN) and while it is AT ZERO (G-ZERO).
  OBM-T1 doses through the REAL gene channel on all three genome views
  (`info.genome` / `baseGenome` / `effGenome`) of BOTH teams.

### ⭐ The READ-FORK INVENTORY (a NAMED deliverable — this seam has MORE than one)

Exactly **TWO** `match.obmMovement` forks exist in `src/**`, plus exactly **ONE**
statement that applies the plane. Every one is pinned by a test AND gated in-probe by
grep (the G-FORK idiom, the PM-T0 "exactly 2 mover sites of 8" form):

| # | site | file | what it feeds |
| --- | --- | --- | --- |
| **1** | `if (match.obmMovement) {` — the POLICY fork | `src/ai/PlayerBrain.ts`, inside `decideOffBall`'s in-possession branch | the seat's ONE percept pull; writes the plane to the match cache; produces the two multipliers for **SCORE SITE 1** (`SupportBallCarrier`) and **SCORE SITE 2** (the LICENSED `MakeRun`) |
| **2** | `const obmPlane = match.obmMovement ? match.obmPlaneFor(p) : null;` — the PLANE fork | `src/ai/actionExecutor.ts`, `case 'SupportBallCarrier'` | **TARGET SITE**: `if (obmPlane !== null) target = supportSpotOnObmPlane(...)`, the single apply statement |

Everything else that mentions the flag, the gene, the plane type or the policy cache is
a declaration, an init, the League union key, an accessor or a type — enumerated with
file:line and class in the artifact, **zero unclassified**.

**Byte-identity is arithmetic, not hope**: with the forks not taken, `obmSupportMul` and
`obmRunMul` are literally `1` and `s *= 1` is an exact IEEE-754 identity for every
finite score; `obmPlane` is `null` and the apply statement never runs, so the incumbent
`supportSpot` call stands untouched. That is what G-OFF / G-BORN / G-ZERO measure
rather than assert.

### The banked CTB limb is DRIVEN, not re-cut

The plane geometry is reached through a **second entry point**,
`supportSpotOnObmPlane`, sharing one private `supportSpotDeformed` core with the
incumbent `supportSpot` — **zero duplicated arithmetic, and not one incumbent line
moved**. It is deliberately NOT a fifth parameter on `supportSpot`:
[`tests/ctbSupportPlane.test.ts`](../../tests/ctbSupportPlane.test.ts) pins that
function's SIGNATURE and its executor CALL SITE verbatim, contract §4 forbids re-cutting
the banked seam, and a failing pinned test is a STOP, never a test edit. (§DEV 2.)

### NO predicates (the #200 red line)

Everything is `weight × continuous feature`. The complete conditional set of this slice
is **gate** (the two flag forks, the plane-apply statement, the in-possession branch the
seat sits in), **guard** (`Number.isFinite` / array checks in the weight map),
**zero** (born-absent ⇒ 0; no snapshot or no perceived opponent ⇒ 0) and **cap** (the
signed clamps, the TTL, and the two incumbent field clamps, unchanged). Nothing
branches on a threshold of a feature. Nothing DECIDES anything: it scores and it shifts.

### Untouched (restated as a prohibition)

`TeamBrain` designation — WHO supports, WHO is licensed to run, the overlapper, the
arriver, `restDefence` · pass selection and every pass price · the carrier's own seats
(C5/C7/O1/O2) and `whetherEye` · the certified price table · `assignMarks` and the whole
defensive trunk · `perceptionSnapshot.ts`'s honesty rules (cone, error channels,
retention **values**, `SCAN_FRAME_RING`) · the CTB plane's own genes, spans, fork and
tests · the wall-pass burst and the overlap `MakeRun` candidates (their own committed
licenses, out of slice one) · `MoveToFormationSpot`'s own score · per-body gene
heterogeneity (the S2 lesson) · `a4World.ts`'s flag set and all three play-test worlds ·
the render layer.

---

## §PINS — the PIN INVENTORY (contract §3, a NAMED deliverable)

Everything that pins the touched surfaces, and what happened to it. **Nothing is
silently renegotiated**; had any of these broken, the standing instruction is
STOP-and-report, never a test edit.

| # | pin | where | class | disposition |
| --- | --- | --- | --- | --- |
| 1 | ⭐ **the CTB plane's VERBATIM source pins** — the `supportSpot` signature, the executor call site, the `CTB_DEPTH_BIAS_SPAN` derivation line, the two fan-constant lines | `tests/ctbSupportPlane.test.ts` (16 `it()`s) | source text + geometry | **UNTOUCHED and GREEN, and this is what shaped the design**: the first cut added a fifth `supportSpot` parameter and broke two of them, so it was withdrawn in favour of the second entry point (§DEV 2). All four needles are re-checked in-probe as G-PINS rows against `src/**` as well as against the test file |
| 2 | **the CTB plane's zero-point + law pins** (absent/zero ⇒ incumbent point; depth moves only x; width collapses to the ball lane at −1) | `tests/ctbSupportPlane.test.ts` | geometry | UNTOUCHED — the shared `supportSpotDeformed` core preserves every line and its evaluation order; the whole file is re-run in §CHECKS |
| 3 | **direct `supportSpot` callers in `tests/**`** | — | — | **ZERO pre-existing (measured, not assumed)** outside the CTB stage's own pin file and this stage's own; counted in-probe |
| 4 | **the 5v6 sanity invariant** (Phase 30.5's named casualty) | `tests/cards.test.ts:119` | full-match directional | UNTOUCHED — flag born false ⇒ the geometry and the scores it plays through are byte-identical. Re-run in the FULL suite |
| 5 | **the goal-level shape pin** (heir of the mirror-goals starvation receipt) | `tests/formations.test.ts:351` | full-match goal-level | UNTOUCHED, same ground. ⚠ Same caveat CTB-T0 recorded: the 1.47/0.93 elasticity pair is a HISTORICAL probe reading in a code comment, not a live assertion — OBM-T1 must carry short-option supply as its own instrument |
| 6 | **the production fingerprint** `57b0bdab…c673` | asserted in 13 test files | league identity | UNTOUCHED — and independently recomputed as G-IDENT/G-FP |
| 7 | **the `SupportBallCarrier` / `MakeRun` action-type surface** | `tests/combos.test.ts:183`, `src/render/actionLabels.ts`, `src/sim/types.ts` | type/label | UNTOUCHED — no new action type, no label change, no `why`-string change, no render cue |
| 8 | **the marking-scheme assignment pin** (MT-T0's pin, adjacent family) | `tests/formations.test.ts:143` | assignment only | UNTOUCHED — this slice adds nothing to `TeamBrain.ts` |
| 9 | **the perception trunk's own pins** (the E3R2 lazy-vs-eager contract, retention/cone behaviour) | `tests/perception*.test.ts` and the E3 contract tests | percept honesty | UNTOUCHED — `perceptionRetentionTicks` is pure code motion returning the identical number at all three call sites; the whole suite re-runs them |
| 10 | **the whole suite** | 129 pre-change test files (130 with this stage's) | everything downstream | G-SUITE runs it in full (§CHECKS). **No test file was edited by this stage**; the only `tests/**` change is the NEW `obmEyesSeat.test.ts` |

## §GATES — frozen ex ante (the CTB-T0 form)

All computed IN-PROBE (#181.2); `head` / wall-clock / paths ride the UNHASHED envelope
(#197-M1) so `resultSha256` re-derives at any commit or path.

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with the gene and flag absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — **all three RECOMPUTED IN-PROBE**. **Semantics: this IS the sim path's RNG-stream receipt** | HARD |
| **G-FP** | the 1337 row IS the production fingerprint; `npm run fingerprint` prints it unchanged | HARD |
| **G-OFF** | per-match whole-run signature **including the rng stream state**: flag ABSENT ≡ flag FALSE, in BOTH the production-shaped world and the percept-armed world, on every receipt seed. **Semantics (#194): both arms execute the SAME flag-off path ⇒ CONFIG EQUIVALENCE only** — NOT an RNG-stream gate | HARD |
| **G-BORN** | ARMED with the matrix ABSENT ≡ OFF, byte for byte. **Semantics: THE ARMS DIFFER IN CODE PATH** — armed ⇒ both forks are entered, the seat PULLS THIS BODY'S PERCEPT on every in-possession off-ball decision and writes a policy the executor reads back ⇒ byte-identity proves the born-absent read inert *through the live branch* AND the percept pull free of side effects on any other consumer | HARD |
| **G-ZERO** | ARMED with the matrix present and ALL SLOTS AT ZERO ≡ OFF, byte for byte — the additive plane law and the multiplicative score law must be **exactly null at 0** | HARD |
| **G-BITE** | ARMED at a non-zero dose in a percept-armed world the world DIVERGES on every receipt seed, **AND the POLICY GEOMETRY moves as §LAW says**: on live match states, features in range, every output equal to the mean of its weighted features, the plane equal to `clamp(intercept + dynamic)`, both multipliers equal to `1 + output·SPAN` and inside the frozen band, the support point equal to the exactly-predicted value **including the INCUMBENT pitch clamp**, and the SIGN law (this dose's depth output can only be ≤ 0, so the seat may only pull a body BACK; a zero output must move him not at all) | HARD |
| ⭐ **G-EPI** | **EPISTEMIC HONESTY PROVED, NOT ASSERTED.** On a stepped fixture whose PERCEPT diverges from TRUTH (opponents teleported after the last scan moment), the seat's computed features MATCH the percept-derived values for EVERY body and match the truth-derived values for NONE, with the truth/percept pair proved genuinely different for every body. PLUS the source-level pin: the ONLY member of `match` the seat module names is `perceivedSnapshot`, and no truth-scan token appears in its executable body | HARD |
| ⭐ **G-BLIND** | **THE FOURTH ARMING LIMB.** Fully armed AND fully dosed in a world with the percept trunk OFF ≡ that world unarmed, byte for byte, on every receipt seed. A blind body has no policy | HARD |
| **G-RNG** | the seam draws **zero** rng — an armed, dosed decision (pull + policy + geometry) over every outfielder of both teams on a stepped fixture leaves the match rng state EXACT — and the opt-in's draws sit strictly after every existing draw: 8 generations of the shipped mutate+crossover with the opt-in OFF reproduce a faithful PRE-GENE re-implementation's genomes AND final rng state exactly, the gene stays absent, the opt-in path is shown live, **and the `ctbSupportPlane` opt-in's OWN values are unmoved in mutation AND in crossover** | HARD |
| **G-HYGIENE** | `obmMovement` and the gene are absent from `a4World.ts` **entirely**; initialised `cfg.obmMovement ?? false`; gene absent from `GENE_KEYS`; a fresh Match and a League match are both OFF; no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` anywhere on a seam line | HARD |
| **G-FORK** | ⭐ the READ-FORK INVENTORY: **exactly TWO** `match.obmMovement` forks in `src/**`, one per named read site, and **exactly ONE** plane-apply statement; every other `src/**` occurrence of the flag, gene, plane type, policy cache and accessors enumerated with file:line and class, **zero unclassified** | HARD |
| **G-TRACE** | every bound DERIVED IN CODE from an incumbent constant with the declaration line matched **VERBATIM** (score span ← `OFFBALL_TIRED_MUL`; weight domain ← `CTB_GENE_MIN/MAX`; matrix size ← the two key lists; TTL ← `AI_INTERVAL/DT`; proximity normaliser ← `pressureAt`'s own radius; staleness normaliser ← the trunk's own retention), and the banked CTB spans asserted UNTOUCHED | HARD |
| **G-PINS** | the §PINS inventory's machine-checkable rows recomputed, **including the four BANKED CTB verbatim pins in both the test file and `src/**`** | HARD |
| **G-SEED** | seed-block disjointness proved in-probe for **all three** intervals this stage consumes, against the COMPLETE consumed ledger (incl. CTB-T1's 12,423,025–036 / 050–099 / 100–727 and CTB-T0's 12,423,900–901) | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests | HARD |
| **G-SUITE** | FULL `npm test` green + `tsc --noEmit` clean. (The two known wall-clock flakes are pre-existing, #196.2 — if they red they are reproduced on the PRE-change tree) | HARD |
| **REPORTED (a)** | a dosed corner smoke: the seat visibly moves bodies. Descriptive, no control, no CI, **no ANSWER** | REPORTED |
| ⭐ **REPORTED (b)** | the **PERCEPT-PULL COST** reading — wall-clock armed-zero vs off vs dosed in a percept-armed world, stated honestly. **Measured, not assumed** (M-OBM.4) | REPORTED |

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any src diff
outside the seam path, any rng draw appearing on the dormant path, any predicate
appearing anywhere, or **any existing test breaking** (a STOP-and-report, never a test
edit).

No bootstrap is used anywhere in this stage, so the ≥104,800 stats base does not apply —
every number here is an identity, a count, a geometric quantity or a wall-clock read off
a deterministic run.

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| A4/O/PM/MT/CTB-arc consumed through | see the probe's `CONSUMED` table (inherited in full, extended with CTB-T1's three blocks and CTB-T0's test seeds) | prior |
| CTB-T1 consumption (#225/#226) | 12,423,025–036 · 12,423,050–099 · 12,423,100–727 | prior |
| **OBM-T0 receipts (this stage)** | **12,424,000 – 12,424,023** (24 seeds × 9 arms) + **12,424,024** (the policy-geometry + G-EPI + dosed smoke read) | **CONSUMED here** |
| **OBM-T0 REPORTED cost read** | **12,424,025** | **CONSUMED here** |
| OBM-T0 test-file seeds (not a battery) | 12,424,900 – 12,424,906 | consumed here |
| free above | 12,424,026 – 12,424,899 and 12,424,907 + | available to OBM-T1 |

Disjointness is computed **in-probe** (`gates.seedDisjoint`) for **all three** intervals
separately, not asserted here.

## §ROAD B — nothing ships

The policy matrix is **BORN ABSENT** in every genome; `obmMovement` is **OFF in every
production path** — a hard `false` default, absent from `a4World.ts` and from all three
play-test worlds, absent from every League's `matchFlags` unless a probe sets it
explicitly — and even ARMED it does nothing while the matrix is absent (G-BORN), nothing
while it is at zero (G-ZERO), and **nothing at all in a world without the percept
trunk** (G-BLIND). The production fingerprint is unchanged, the flag-off world is
byte-identical on three league seeds and on every receipt match seed with the rng stream
included, and an opted-out evolution run draws zero extra rng. **Nothing about the game
the user plays changes in this commit.** The seam exists so OBM-T1 can force it.

## §NON-CLAIMS

OBM-T0 claims **no** football effect: not on TRUE-holdable supply, not on
pressed-first-reception, not on the #218 constructed/scramble shares, not on
interceptions, offside, spacing, clumping, goals, the equilibrium band or watchability.
The REPORTED smoke is one uncontrolled descriptive reading and adjudicates nothing —
**F-OBM-a** (no policy dose moves the supply), **F-OBM-b** (clump/interception
re-import) and **F-OBM-c** (offside/health) are all **OBM-T1's** to fire. The REPORTED
cost reading is a wall-clock on a shared machine: it is used in **no rate** and bounds
nothing. Per contract §4 it changes **no** TeamBrain assignment or licence, **no** pass
selection, **no** carrier behaviour, and adds **no** per-body genes, no attribute, no
new action type, no render cue, no coach rung and no offside work. It does not claim the
frozen bounds are the RIGHT bounds — only that they are traced, derived in code, frozen
before sight, and unre-cut. It does not claim the four feature families are COMPLETE
(M-OBM.2 names them as slice-one bounds). It cannot authorize OBM-T1; only the commander
can.

---

## §RESULT — the gates run

*(filled in from the committed artifact after the receipts ran; every number here is
quoted FROM `docs/world-model/data/obm-t0-eyes-seat.json`, which is recomputed by
`npx tsx scripts/probes/obm-t0-eyes-seat.ts` — the doc never carries evidence the
artifact does not.)*

Tests: [`../../tests/obmEyesSeat.test.ts`](../../tests/obmEyesSeat.test.ts) — **21
pins** (21 `it()` blocks). Receipts:
[`../../scripts/probes/obm-t0-eyes-seat.ts`](../../scripts/probes/obm-t0-eyes-seat.ts),
artifact [`data/obm-t0-eyes-seat.json`](data/obm-t0-eyes-seat.json).
**24 seeds × 9 arms (absent · off · plain · plainOff · bornArmed · zeroArmed · forced ·
blindOff · blindForced) = 216 full matches per core run, and the core runs TWICE
(G-DET, byte-identical digests), plus 3 league-seed 2-season identity runs, the
policy-geometry read, the G-EPI divergence fixture, the dosed smoke and the seam rng
fixture on seed 12,424,024, the 8-generation evolution-rng comparison, the `src/**`
fork scan, and 9 timed matches for the cost reading on seed 12,424,025.** Verdict:
**GATES PASS** (`gates.allPass === true`), probe exit 0. Wall ≈ 73 s (CONTEXT ONLY —
used in no rate).

* **G-DET digest** — `gates.gDet.digestA === digestB ===`
  `ac34a90d495d02acb7f0b3c844edb2d8c7016aaf0f44cefd299c79acee91954b`
* **resultSha256** `3f0c7464a3aeceeae207af20448ed585d1d2ce8a4e95fe54c3f297ae1215d79c`
  (recomputable: `npx tsx scripts/probes/obm-t0-eyes-seat.ts`). ⭐ Per #197-M1 the hashed
  body is **commit-free, timing-free and path-free** — `headContextOnly`,
  `wallMsContextOnly` and `artifactPathContextOnly` ride the envelope, OUTSIDE the hash.
  ⚠ Stated exactly: the REPORTED **wall-clock cost numbers are also outside the hash**
  (they are machine-dependent and would make the receipt un-re-derivable); every GATE
  input is inside it. The substitution is declared in the artifact's own `hashNote`.
* **Files touched** — the authoritative list is `git show <this commit> --stat`; no
  completeness claim is made here from a `git diff --stat` (the #194 L3 lesson).

### Gate table

| gate | verdict | evidence (all recomputed in-probe, #181.2) |
| --- | --- | --- |
| **G-IDENT** | ✅ PASS | all three league hashes IDENTICAL to the frozen pre-change baselines: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26` — `gates.gIdent.rows`. **This is the sim path's RNG-stream receipt** |
| **G-FP** | ✅ PASS | the 1337 row IS the production fingerprint (`gates.xFpProd`); `npm run fingerprint` re-derives `57b0bdab…c673` unchanged (§CHECKS) |
| **G-OFF** | ✅ PASS | 24/24 seeds: flag ABSENT ≡ flag FALSE in the percept-armed world AND the production-shaped world (`identical` ∧ `plainIdentical`), whole-match signature including the rng stream state. **CONFIG EQUIVALENCE ONLY** |
| **G-BORN** | ✅ PASS | 24/24: ARMED with the matrix ABSENT ≡ OFF, byte for byte. **The arms differ in code path**: armed ⇒ both forks entered, a percept pulled on every in-possession off-ball decision, a policy written and read back — and the world does not move by one bit |
| **G-ZERO** | ✅ PASS | 24/24: ARMED with all 16 slots PRESENT at 0 ≡ OFF, byte for byte. The additive plane law and the multiplicative score law are **exactly null at zero** |
| **G-BITE** | ✅ PASS | **24/24 forced arms diverge** from absent. Policy geometry, seed 12,424,024, **8,230 sampled body-decisions**: **0 violations across all six law checks** (`outputArithmetic` · `planeCompose` · `scoreCompose` · `planeSign` · `planeMagnitude` · `featureRange`), and the seat moved the support point on **6,750 of 8,230** samples — see the table below |
| ⭐ **G-EPI** | ✅ PASS | **5/5 bodies' features reproduce the PERCEPT exactly; 0/5 match the truth; 5/5 truth-vs-percept pairs genuinely differ** (mean perceived opponent age 10.6 ticks against the truth snapshot's 0). Source pin: `gates.gEpi.moduleMatchMembers === ['perceivedSnapshot']` — the ONLY member of `match` the seat names — and `moduleBannedHits === []` |
| ⭐ **G-BLIND** | ✅ PASS | 24/24: fully armed AND fully dosed with the percept trunk OFF ≡ the same world unarmed, byte for byte. **A blind body has no policy** — which is why OBM-T1's exam world must be percept-armed |
| **G-RNG** | ✅ PASS | (a) the seam: an ARMED, DOSED decision over every outfielder of both teams on a 400-tick fixture leaves the match rng state EXACT — **4115567729 → 4115567729**, 10 decisions. (b) evolution, 8 generations, opt-in OFF: genomes identical to the pre-gene re-implementation, the matrix stayed absent, final rng state matches exactly; `optInDraws: true`, **`ctbStreamUnmoved: true`** and **`crossoverOrderHeld: true`** — the new draws sit strictly after the CTB block in mutation and in crossover alike |
| **G-HYGIENE** | ✅ PASS | `cfg.obmMovement ?? false`; the flag AND the gene absent from `a4World.ts` entirely; gene absent from `GENE_KEYS`; `randomGenome` never creates or serializes it; a fresh Match and a League match are both OFF; no `envArmed` / `EDS_BUNDLE_ARMED` / `process.env` on any of the 10 seam files' seam lines |
| **G-FORK** | ✅ PASS | **exactly 2 flag forks and exactly 1 plane-apply statement**, at the two named sites; **26 src occurrences total, ZERO unclassified** (kinds: `FLAG_FORK_SCORE` · `FLAG_FORK_PLANE` · `PLANE_APPLY` · `POLICY_WRITE` · `POLICY_CACHE` · `ACCESSOR` · `CONFIG` · `FIELD` · `INIT` · `UNION_KEY` · `GENE_DECL` · `GENE_RW` · `TYPE`) |
| **G-TRACE** | ✅ PASS | all 7 derivation lines matched VERBATIM, and the identities hold: `OBM_SCORE_SPAN === 1 − OFFBALL_TIRED_MUL === 0.4`, `OBM_WEIGHT_MIN/MAX === CTB_GENE_MIN/MAX === ∓1`, `OBM_WEIGHT_SLOTS === 4 × 4 === 16`, `OBM_POLICY_TTL_TICKS === ceil(AI_INTERVAL/DT) === 9`, `PRESSURE_RADIUS_M === 6`, `perceptionRetentionTicks(0.8) === 51`; the banked `CTB_DEPTH_BIAS_SPAN === SUPPORT_LAT_CAP_FRAC` and `SUPPORT_LAT_PULL === 0.75` are asserted UNTOUCHED in the same breath |
| **G-PINS** | ✅ PASS | **9/9 named pins present**, including all four BANKED CTB verbatim pins in BOTH the test file and `src/**`; **0** pre-existing `supportSpot` callers in `tests/**` (this stage's own file: 6, counted separately). Nothing renegotiated |
| **G-SEED** | ✅ PASS | 12,424,000–024 · 12,424,025 · 12,424,900–906, **zero collisions** with the 27 consumed blocks (`gates.seedDisjoint.collisions === []`) |
| **G-DET** | ✅ PASS | two invocations of the core, identical digests (above) |
| **G-SUITE** | ✅ PASS (with the pre-existing flakes disclosed) | see §CHECKS |

### G-BITE — the policy geometry (seed 12,424,024, 8,230 sampled body-decisions)

| quantity | value |
| --- | --- |
| mean features `[carrierPlight, ownMarker, targetCongestion, readingAge]` | **[0.184, 0.456, 0.216, 0.171]** |
| mean composed plane `depth` / `width` | **−0.046** / **+0.114** |
| mean `supportMul` / `runMul` | **1.018** / **0.978** |
| mean ahead-of-ball, incumbent → dosed | **6.047 m → 5.486 m** |
| samples the seat moved | **6,750 / 8,230** · mean shift **1.150 m** (max **4.901 m**) |
| behind-ball samples, incumbent → dosed | 170 → 170 |
| law violations (six checks) | **0 / 0 / 0 / 0 / 0 / 0** |

Read exactly: at THIS dose the policy is a **small, continuous, situation-dependent**
deformation, not a corner — because the features it multiplies are themselves small on
average (a carrier is genuinely pressed on only a minority of decisions). That is the
mechanism working as designed and it is **not** a claim that the dose is weak or strong;
the dose-response question is OBM-T1's. The 170 behind-ball samples are the INCUMBENT
pitch-clamp artefact CTB-T0 §DEV 4 identified, and this dose does not add to them —
consistent with the sign law (a depth output of −0.046 is a small drop, not a 回撤
corner).

### REPORTED — the dosed smoke (ONE forced match, seed 12,424,024)

| quantity | value |
| --- | --- |
| support ticks sampled (bodies actually holding `SupportBallCarrier`) | **1,530** |
| ticks where the seam moved the point | **1,392 (91.0 %)** |
| mean shift | **1.19 m** (max 4.39 m) |
| mean ahead-of-ball, incumbent → dosed | **8.03 m → 7.27 m** |
| mean `supportMul` / `runMul` at those moments | **1.028** / **0.974** |

**What this is and is not.** It is a reading that the seat is REACHED at scale on bodies
genuinely doing the supporting job, and that its outputs are live and signed the way the
dosed policy says (support up when the carrier is pressed, runs down when the target is
crowded). It is **ONE match at ONE policy corner**, with **no control arm, no CI and no
dose curve**; it says nothing about whether any of it helps.

### ⭐ REPORTED — the PERCEPT-PULL COST (M-OBM.4, seed 12,424,025)

Wall-clock, one full match per arm in a **percept-armed** world, minimum of 3 repeats,
14,722 ticks per match:

| arm | min wall | ms / tick | overhead vs OFF |
| --- | --- | --- | --- |
| **off** | **94 ms** | 0.006162 | — |
| **armed, all-zero** | **136 ms** | 0.008915 | **+44.7 %** |
| **armed, dosed** | **134 ms** | 0.009102 | **+42.6 %** |

**Stated honestly.** (i) This is a **wall-clock on a shared machine**; it is used in no
rate, it bounds nothing, and the armed-zero / dosed ordering being inverted here (134 <
136 ms) is noise at this precision — read it as *"both armed arms cost about the same,
roughly 40–45 % more than off"*, not as *"dosing is cheaper than not dosing"*. (ii) The
cost is **entirely the percept pull**, not the policy arithmetic: 16 multiply-adds are
nothing, and the dosed arm is not measurably dearer than the zero arm — which is exactly
what one expects if the pull dominates. (iii) M-OBM.4 bounds the cost at the existing
cadence laws and that bound is what was built (one pull per off-ball decision at
`AI_INTERVAL`, zero pulls in the per-tick executor). The measured price of that bound is
**~40 % of a match's simulation time in an armed world**, which is REAL and which
OBM-T1's battery must budget for — an armed battery will run roughly 1.4× the wall of a
CTB-T1-shaped one. **The shipped game pays none of it** (Road B: the flag is off, the
fork is one boolean test). If T1 finds the pull too dear, the honest lever is the
cadence (fewer bodies, or a scoped `perceivedSnapshot`), not a truth shortcut.

### §CHECKS

```text
$ npx tsc --noEmit
tsc clean

$ npx vitest run tests/obmEyesSeat.test.ts
 Test Files  1 passed (1)
      Tests  21 passed (21)

$ npx vitest run tests/ctbSupportPlane.test.ts tests/formations.test.ts   (THE BANKED PINS)
 Test Files  2 passed (2)
      Tests  27 passed (27)

$ npm run fingerprint
seed=1337 seasons=2 matches=142
sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673

$ npx tsx scripts/probes/obm-t0-eyes-seat.ts        (exit 0)
GATES PASS — artifact docs/world-model/data/obm-t0-eyes-seat.json

$ npm test          (vitest run, THIS tree)
 Test Files  1 failed | 129 passed (130)
      Tests  1 failed | 1242 passed (1243)
   Duration  268.76s
 FAIL tests/formationEvolution.test.ts > league-level style ecology > ten seasons: …
                                                        Error: Test timed out in 180000ms.

$ npx vitest run tests/formationEvolution.test.ts          (same tree, ISOLATED)
 ✓ league-level style ecology > ten seasons: …  146569ms   (budget 180000ms)
 Test Files  1 passed (1)
      Tests  3 passed (3)

$ mv tests/obmEyesSeat.test.ts /tmp; git stash push -- <the 9 seam src files>
$ npm test                                     (the PRE-CHANGE tree, #196 form)
 Test Files  1 failed | 128 passed (129)
      Tests  1 failed | 1221 passed (1222)
   Duration  246.53s
 FAIL tests/formationEvolution.test.ts > league-level style ecology > ten seasons: …
                                                        Error: Test timed out in 180000ms.
$ git stash pop; mv /tmp/obmEyesSeat.test.ts tests/       (tree restored, verified)
```

**G-SUITE, stated exactly.** ONE file red on the full-suite run, a pure **wall-clock
TIMEOUT, not an assertion**, and it **reproduces identically on the PRE-CHANGE tree**
(the #196 form: the nine seam src files stashed out, this stage's test file moved
aside, the whole suite re-run — same file, same message, 1,221 other tests green).
Isolated on THIS tree it passes in 146.6 s against the 180 s budget, so the mechanism is
parallel-load contention, not this seam. This is the #196.2 flake family; the second
member CTB-T0 newly observed (`simRunner.test.ts`) did not red on either run today.
Every other test — **1,242 of 1,243**, the banked CTB plane's 16 included — is green.

### Deviations recorded

1. **ONE gene key holding a MATRIX, with per-slot mutation but a SINGLE crossover
   draw.** Mutation follows the offset FAMILY's per-slot law (#164.3); crossover
   follows the same family's ONE-draw law, because a policy is one agreement about how
   to read a situation and a child should inherit a coherent policy rather than a
   mosaic of two. Recorded because it is a choice, not an inevitability — the CTB pair
   chose the opposite (two draws) for two orthogonal axes.
2. ⭐ **The OBM plane read is a SECOND ENTRY POINT, not a fifth `supportSpot`
   parameter.** The first cut added the parameter; it broke two verbatim pins in
   `tests/ctbSupportPlane.test.ts` (the signature and the executor call site). Per the
   standing rule that was a STOP for that design, never a test edit — so the design was
   changed: `supportSpotOnObmPlane` and the incumbent `supportSpot` now share one
   private `supportSpotDeformed` core (pure code motion; zero duplicated arithmetic;
   the pinned lines all still present verbatim, and re-checked in-probe as G-PINS rows
   against `src/**` as well as the test file). The executor therefore keeps its
   incumbent statement byte-identical and adds a separate armed-only statement.
   Consequence, stated: in an ARMED world with a live policy the support point is
   computed TWICE per tick per supporting body. That is an armed-world-only cost and it
   is inside the measured cost reading above.
3. **TWO gates were ADDED to the frozen list** (G-BLIND, and G-EPI's source-pin half),
   not removed. The dispatch names the percept-armed limb as a checklist item and the
   import restriction as a test; promoting both to in-probe HARD gates is strictly more
   conservative.
4. **`OFFBALL_TIRED_MUL` lives in `src/sim/constants.ts`, not at its use site.** The
   CTB-T0 precedent names an incumbent constant in the file that uses it, but naming
   this one inside `PlayerBrain.ts` would have created a top-level import cycle
   (`PlayerBrain → offballEyes → PlayerBrain`) with a real TDZ hazard. The use site is
   still `decideOffBall` and nowhere else, and the doc comment says so.
5. **`perceptionRetentionTicks` was extracted inside the certified perception module.**
   Pure code motion at three call sites of an identical expression, done so f4's
   normaliser could be a reference rather than a literal. The honesty rules, the cone,
   the error channels, the retention VALUES and `SCAN_FRAME_RING` are untouched;
   G-IDENT on three league seeds is the receipt that the numbers did not move.
6. **The score multipliers are applied unconditionally as `s *= mul` with `mul === 1`
   on the flag-off path**, rather than behind a second conditional. `× 1` is an exact
   IEEE-754 identity, and the CTB seam set the precedent (`× widthScale`); fewer
   conditionals is also fewer places for a predicate to grow.
7. **Only the LICENSED runner/arriver `MakeRun` candidate is modulated.** The wall-pass
   burst and the overlap are separate committed licenses with their own timing laws
   (Phase 34); folding them in would have been a wider slice than M-OBM.1 authorises.
   Declared in §LAW and commented at the site.
8. **The REPORTED wall-clock numbers ride OUTSIDE `resultSha256`.** They are
   machine-dependent, so hashing them would make the receipt un-re-derivable (#197-M1's
   own logic, applied to a REPORTED field). Every GATE input is inside the hash, and the
   substitution is declared in the artifact's `hashNote`.
9. **No bootstrap, no CI anywhere in this stage** — every number is an identity, a
   count, a deterministic geometric quantity or a disclosed wall-clock, so the ≥104,800
   stats base does not apply.

### Disposition

The seam is BUILT and DORMANT: the policy matrix is born absent and outside `GENE_KEYS`,
the consumption flag is a hard `false` absent from every bundle, the production
fingerprint is unchanged, flag-off byte-identity holds on three league seeds and 24 match
seeds with the rng stream included, an ARMED world is byte-identical to OFF with the
matrix ABSENT and with it AT ZERO *through the live branch and through a live percept
pull*, a fully dosed armed world with no eyes is byte-identical too, the seam draws zero
rng and an opted-out evolution run draws zero extra, exactly two read forks and one
plane-apply statement exist in `src/**`, every bound is derived in code from an incumbent
constant, every pinned test — the banked CTB plane's included — is untouched and green,
and under force the policy moves exactly as §LAW says with zero violations across six
checks on 8,230 sampled decisions. **The eyes are honest, and that is proved rather than
promised**: on a fixture where truth and percept disagree, every body reads his own eyes
and not one reads the world. There is **no predicate anywhere** (#200). **Nothing
ships.** OBM-T0 cannot authorize OBM-T1 — the POLICY EXAM is the commander's call.
