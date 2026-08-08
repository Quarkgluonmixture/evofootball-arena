# PM T0 — the DORMANT DEFENSIVE LANE-CONVERGENCE seam (`defLaneConvergence`, 向球侧压缩)

Status: **PRE-REGISTERED 2026-08-08, then BUILT + RUN the same round.** The seam
semantics, the FROZEN `k_PM` bounds with their traced constant family, the M-PM.3
read table, the M-PM.2 restart trace, the gates and the Road B statement below were
written **before** the receipts ran (the frozen-before-sight rule, the O2-T0 / O1-T1
two-part form); the measured numbers arrive only in [§RESULT](#result--the-gates-run)
at the foot.

Authority chain: contract
[`PHASE-MODULATION-CONTRACT.md`](PHASE-MODULATION-CONTRACT.md) — §2 **M-PM.1** (the
term, born absent, bounds from the traced family) · **M-PM.2** (the phase gate: live
open play, out of possession; restart states keep the unmodulated station) ·
**M-PM.3** (fork the READ, #35.3: mover reads only; `assignMarks`' zone centres NOT
modulated = the 甲/乙 boundary) · **M-PM.4** (perception honesty: `ball.pos.y` only) ·
**M-PM.5** (what is NOT built) · §3 the **PM-T0** clause · §4 the non-claims.
Ruling **#195.2** (this dispatch, in every detail: gene born ABSENT behind an
explicit own-boolean opt-in never bundle-defaulted; mover-reads-only fork; phase gate
with the restart-gate trace; flag-off byte-identity + fingerprint + RNG-stream
receipts per **#181.2**; the read table published) carrying the **#194** lessons
verbatim (no doc-typed hashes; gate semantics stated exactly — say what the arms
DIFFER in; completeness claims only from `git show --stat`). The O2-T0 dormant seam
([`O2-T0-DORMANT-SEAM.md`](O2-T0-DORMANT-SEAM.md)) is the FORM this document and its
receipts follow.

Banked evidence this stage stands on: the corrected
[`MARK-SELECTION-CODE-MAP.md`](MARK-SELECTION-CODE-MAP.md) (#191 — §4 **S6**'s
side-door inventory is exactly what the read table below must cover, and its
BRANCH DISCLOSURE is why this seam is emergent-path-only) and
[`FARSIDE-DEFENDER-FORENSIC.md`](FARSIDE-DEFENDER-FORENSIC.md) (#188.2 — the 18–20 m
send-target lane gap this arc exists to answer).

---

## §LAW — the FROZEN `k_PM` bounds, and where the number comes from

```text
k_PM = clamp01(defLaneConvergence) · PM_LANE_CONVERGENCE_MAX
PM_LANE_CONVERGENCE_MAX = 0.25      ⇒   k_PM ∈ [0, 0.25]
```

**Traced, not invented.** `0.25` is the **LEGACY per-body convergence weight that the
emergent rewrite dropped** — `src/ai/formations.ts` table path:

```ts
// Compact teams also drag their block a little toward the ball's y.
if (!hasBall) y += (ball.pos.y - y * team.attackDir) * team.attackDir * g.defensiveCompactness * 0.25;
```

i.e. that branch's **maximum** lateral convergence toward the ball's lane, reached at
`defensiveCompactness = 1`. The contract names precisely this line as the new term's
natural neighbour (§0.4: "the legacy table path had one … the emergent rewrite dropped
it"; §2 M-PM.1: "the legacy convergence weight ≤ 0.25 at `:209` is the natural
neighbour"). So the new axis can express **exactly as much convergence as the branch
it restores, and no more**.

**Why the ceiling of that family and not a fraction of it.** The family has exactly
one frozen value — the weight `0.25` — and the gene's own domain `[0,1]` supplies the
whole interior; freezing anything below 0.25 would be inventing a second constant, and
freezing anything above would let the new axis express a convergence the engine has
never priced. The gene is clamped to `[0,1]` inside `pmLaneConvergenceK`, so no
instrument can dose past the ceiling through that door. **No new constant is
introduced by this slice.**

**Never re-cut.** If PM-T1 needs a different ceiling, that is a fork for the commander
WITH numbers, not a quiet re-freeze after sight. The link between the code constant
and its provenance is machine-checked: `tests/pmLaneConvergence.test.ts` asserts the
legacy source line **verbatim** and `PM_LANE_CONVERGENCE_MAX === 0.25` together, so
the family cannot drift silently.

**Sizing honesty, stated up front.** At the ceiling a body 15 m off the ball's lane is
asked to move **3.75 m** toward it per station evaluation — a contraction of the
station field, applied every tick the body is walking, not a one-shot teleport, and
composed BEFORE anti-clump (≥9 m repulsion, ±7 m clamp) and solidity, which will
absorb part of it. Whether 0.25 is enough to move the measured 18–20 m gap toward the
9 m spacing is **exactly PM-T1's question**, and this stage pre-commits to not
re-cutting the ceiling to make PM-T1 succeed.

## §SEAM — the mechanism (all of it dormant)

### The gene

* **`defLaneConvergence`**, a new **OPTIONAL** `TacticalGenome` key
  (`src/evolution/genome.ts`), **BORN ABSENT** — the `homePriorObedience` /
  `homePriorObedienceOffset` birth form verbatim:
  * deliberately **NOT in `GENE_KEYS`**, so `randomGenome` / `mutateGenome` /
    `crossoverGenomes` / `geneDistance` draw the EXACT same rng in the EXACT same
    order as HEAD, and an absent optional key is omitted by `JSON.stringify` ⇒ the
    serialized genome and the production fingerprint are byte-identical;
  * it evolves ONLY under its **OWN explicit `evolveDefLaneConvergence` boolean**
    (per #75 — never a widening of `evolveHomePrior` / `evolveHomePriorOffsets`, so
    those runs' draw sequences are unmoved either), and its draws sit **STRICTLY
    AFTER both home-prior blocks**, so enabling it never re-orders an existing draw;
  * absent ⇒ `pmLaneConvergenceK() === 0` ⇒ the term vanishes.

### The consumption flag

* **`pmLaneConvergence`**, a new **explicit** `MatchConfig` boolean, initialised
  `cfg.pmLaneConvergence ?? false` — a **hard `false`**, the `o2Look` / `o1PassWindup`
  form. **Never** `EDS_BUNDLE_ARMED`, never env-armed, never default-ON, and — the
  #195.2 clause — **never bundle-defaulted**: absent from `src/game/a4World.ts`
  entirely (`A4_WORLD_FLAGS` and every `a4MatchFlags(v)` version), so no play-test
  world, preset or env bundle can turn it on. It gets its own `League.matchFlags` key
  so a probe world can arm it EXPLICITLY, and that key changes no default.
* **Two locks, deliberately.** Even ARMED the world is unchanged while the gene is
  absent (that is the born-equivalence gate). The flag exists so the CONSUMPTION
  surface has its own named switch independent of whether some genome anywhere
  carries a value — belt and braces, the A4 precedent (gene + `eye.v4.homePrior`).

### The term (M-PM.1)

In `emergentStation` (`src/ai/formations.ts`), **immediately after** the width term
(`y = laneFrac · HALF_W · widthMul`) and the common ball-side TRANSLATION
(`y += ball.pos.y · ballSideShift`) — replacing **neither** — and **before** anti-clump
and solidity:

```ts
if (pmMover && !hasBall) {
  const kPm = pmLaneConvergenceK(g);
  if (kPm > 0) y += (ball.pos.y - y) * kPm;
}
```

* **All outfield bodies, no role gating.** The GK is inert by the world's own
  geometry, not by a role rule: his `y` is overwritten by his own keeper band a few
  lines later.
* **No per-body offsets, no scenario triggers.** Offsets are a later slice (the A4-S2
  precedent); there is no weak-side rule anywhere — 弱侧收窄 falls out of the geometry
  (a far body moves more metres under the same affine contraction).
* **Order-preserving.** `y ↦ y + (b − y)·k` is affine with slope `1 − k ≥ 0.75`, so
  lateral ORDER cannot invert; gaps shrink. ⚠ **Stated exactly**: that is a property
  of the TERM. Anti-clump and solidity compose AFTER it (deliberately — they are the
  guards that price the contraction), so an individual body already on the lane can
  end up marginally further out in the FINAL station. The test pins the contraction
  where it is true (closed form) and pins the live field in AGGREGATE (mean lane gap
  falls). Claiming per-body monotonicity of the final station would be a gate whose
  arms cannot deliver its stated semantics (#194's second lesson).
* **Branch disclosure.** The seam lives in `emergentStation` — the DEFAULT-ON path —
  **only**. The legacy table path already carries a per-body convergence of its own
  (the very line this ceiling is traced from) and is left untouched; `pmMover` is
  inert there. Every claim in this document is emergent-path-only, the map's own
  disclosure discipline.

### The phase gate (M-PM.2)

Evaluated **once**, in `src/ai/actionExecutor.ts`'s `executeAction` prologue, and
nowhere else:

```ts
const pmMover = match.pmLaneConvergence && match.phase === 'playing';
```

and the out-of-possession half (`!hasBall`) is enforced inside the term itself. So the
modulated station exists **only in live open play, out of possession**. Restart-pending
and frozen phases (`kickoff`, `goalPause`, `halftime`, every restart wait) keep the
UNMODULATED station.

### The M-PM.2 RESTART TRACE (the stall trap, priced by trace at T0)

The failure this gate exists to prevent: a gate waits for bodies near stations the
walkers no longer walk to, so the restart never fires. Every restart-side reader,
traced:

| restart surface | station read | walker vs gate | stalls? |
| --- | --- | --- | --- |
| **`shapeReady`** (`formations.ts`, the keeper's goal-kick release gate; its only caller is `Match.ts`'s goal-kick branch) | `formationSpot(p, team, ball, **true**, undefined, abandonRest)` — **`hasBall = true`, hardcoded** | gate reads the IN-POSSESSION station; the seam is out-of-possession only ⇒ **the gate's reference is untouched** | **NO** — and doubly so: the goal-kick phase is not `playing`, so `pmMover` is false there anyway |
| **the onside clamp** (`actionExecutor.ts`, `p.clampTrace = 'onside'`) | it clamps the **already-computed `target`**, i.e. it can see a modulated value | its guard is `carrier.side === p.side` — a TEAMMATE is carrying ⇒ our side has possession ⇒ `hasBall` is true ⇒ the term did not fire | **NO** — mover and clamp read the same (unmodulated) value by construction |
| **`resetForKickoff`** (`Match.ts`) | `formationSpot(p, team, ball, team.side === kickSide, undefined, …)` — no mover fork | restart placement is a GATE read, unmodulated; and the phase is `kickoff` | **NO** |
| **the offside-trap hold line** (`actionExecutor.ts`, inside `MarkOpponent`) | `formationSpot(p, team, ball, hasBall, opp, abandonRest)` — no mover fork | GATE read (a hold-line reference, and it blends **x only**), unmodulated | **NO** |
| **`supportSpot`** (`formations.ts`) | `formationSpot(p, team, ball, **true**)` | in-possession by construction ⇒ excluded by M-PM.2 | **NO** |

**Conclusion of the trace: there is no walker-vs-gate mismatch.** Every restart gate
either reads the in-possession station (which this slice never modulates) or runs in a
phase where `pmMover` is false, or both. The one surface that consumes a *mover's*
target — the onside clamp — is fenced off by possession, not by luck: its own guard
requires a teammate to be carrying the ball.

### The M-PM.3 READ TABLE (#35.3 — fork the read, never the function)

`formationSpot` grows ONE optional trailing parameter, `pmMover`, defaulting to
**false**. Every reader that omits it is bit-for-bit HEAD. The complete `src/**`
inventory (the map §4 S6 side doors, each one classified):

| # | reader | file:line (at this commit) | class | modulated? |
| --- | --- | --- | --- | --- |
| 1 | `MoveToFormationSpot` / `HoldPosition` walk target | `src/ai/actionExecutor.ts:145` | **MOVER** | ✅ **YES** |
| 2 | `MarkOpponent` **no-target fallback** | `src/ai/actionExecutor.ts:336` | **MOVER** | ✅ **YES** |
| 3 | offside-**trap hold line** (inside `MarkOpponent`) | `src/ai/actionExecutor.ts:304` | GATE | ❌ no |
| 4 | **`assignMarks` zonal ZONE CENTRES** — the **甲/乙 boundary** | `src/ai/TeamBrain.ts:479` | ASSIGNMENT | ❌ no (modulating it would change mark assignment = 乙's surface, a NAMED later fork) |
| 5 | `shapeReady` restart gate | `src/ai/formations.ts:494` | GATE | ❌ no (`hasBall = true`) |
| 6 | `supportSpot` lane reference | `src/ai/formations.ts:612` | in-possession | ❌ no (`hasBall = true`) |
| 7 | `resetForKickoff` placement | `src/sim/Match.ts:3579` | RESTART | ❌ no |
| 8 | render shape overlay | `src/render3d/RenderStateAdapter.ts:311` | RENDER | ❌ no |

*(the `onside` clamp and `p.markAnchor` are downstream of reader 1/2's target rather
than independent `formationSpot` callers, and are covered by the restart trace above;
`PlayerBrain`'s `MoveToFormationSpot` **scoring** uses the hardcoded 0.42 literal — map
§4 S3 — and reads no station at all.)*

The line numbers above are a snapshot; the **gate** is `G-READ`, which recomputes the
whole table by scanning `src/**` in the probe and fails unless exactly two mover sites
exist and both are in `actionExecutor.ts`. The boundary is additionally pinned by
tests (the zone-centre call shape, at max dose, must equal the unmodulated station).

### Perception honesty (M-PM.4)

The term reads `ball.pos.y` — the very input the adjacent line already consumes. No
new percept channel, no opponent state, no omniscience, no rng.

### Untouched (restated as a prohibition)

`assignMarks` / `assignChasers` / `team.marks` and every mark-selection surface
(S1–S6; the #193.1 DEFER stands) · the mark STANCE (`markDist` / `laneW`) · the
`formations.test.ts:143-156` far-side pin · the attacking phase and every
in-possession station read · `supportSpot` · `shapeReady` · the onside clamp · the
offside trap · the A4 home prior and the station eye · `a4World.ts`'s flag set and all
three play-test worlds · the legacy table path.

---

## §GATES — frozen ex ante (the O2-T0 form)

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with the gene and flag absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — **all three RECOMPUTED IN-PROBE** and written to the committed artifact (#181.2: no doc-typed hash is evidence). **Semantics: this IS the sim path's RNG-stream receipt** — the baselines were frozen from PRE-change code, so any added draw, conditional or not, would break them | HARD |
| **G-FP** | the 1337 row IS the production fingerprint; `npm run fingerprint` prints it unchanged | HARD |
| **G-OFF** | per-match whole-run signature **including the rng stream state**: flag ABSENT ≡ flag FALSE, in BOTH the production-shaped world and the percept-armed world, on every receipt seed. **Semantics, exactly (#194): both arms execute the SAME flag-off code path, so this proves CONFIG EQUIVALENCE and nothing more** — it is not an RNG-stream gate | HARD |
| **G-BORN** | ARMED (`pmLaneConvergence: true`) with the gene ABSENT ≡ OFF on every receipt seed. **Semantics: THE ARMS DIFFER IN CODE PATH** — armed ⇒ `pmMover` true ⇒ the M-PM.1 branch is ENTERED on every defensive mover read and `k_PM` evaluates to 0 ⇒ byte-identity proves the born-absent read is inert **through the live branch** | HARD |
| **G-BITE** | armed AND dosed (gene = 1 ⇒ `k_PM` = 0.25, the frozen ceiling): every seed's world DIVERGES — the identity gates are not the identity of dead code — **AND the 甲/乙 boundary holds under that force**: across sampled body-ticks the zone-centre read is bit-identical to the unmodulated station (0 deviations) while the mover read moves | HARD |
| **G-READ** | the M-PM.3 read table recomputed by scanning `src/**`: EXACTLY two `formationSpot` call sites pass the mover fork, both in `actionExecutor.ts`; every other site enumerated with file:line | HARD |
| **G-EVORNG** | the EVOLUTION path draws ZERO extra rng with the opt-in off: 8 generations of the shipped mutate+crossover reproduce a faithful PRE-GENE re-implementation's genomes AND final rng state exactly, the gene stays absent — **and the opt-in path is shown live** (flag-on really writes the gene), so the zero is about the flag, not about dead code | HARD |
| **G-CONST** | `PM_LANE_CONVERGENCE_MAX === 0.25` **and** the legacy convergence source line is matched verbatim in `formations.ts` — the traced family, machine-checked | HARD |
| **G-HYGIENE** | `cfg.pmLaneConvergence ?? false`; the flag and the gene are absent from `a4World.ts`; the gene is absent from `GENE_KEYS`; a fresh Match and a League match are both OFF; no env door | HARD |
| **G-SEED** | seed-block disjointness proved in-probe against every consumed A4/O-arc block **including O2-T0's 12,311,000–024** | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests | HARD |
| **G-SUITE** | full `npm test` green, `tsc --noEmit` clean | HARD |
| **REPORTED** | the ASK census: mean send-target lane gap, unmodulated vs mover, at the frozen ceiling, one forced match. Descriptive, smoke scale, no control, no CI, no dose curve, and **no ANSWER** (body positions) — a reading for the commander, never a licence to re-cut the ceiling | REPORTED |

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any src diff
outside the seam path, any rng draw appearing on the dormant path, or a walker-vs-gate
mismatch surfacing in the restart trace.

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| A4/O-arc consumed through | 12,311,024 (O2-T0's receipts + freshness read) | prior |
| **PM-T0 receipts (this stage)** | **12,311,100 – 12,311,123** (24 seeds × 6 arms) + **12,311,124** (the boundary/ASK read) | **CONSUMED here** |
| free above | 12,311,125 + | available to PM-T1 |

Disjointness from every listed consumed block is computed **in-probe**
(`gates.seedDisjoint`), not asserted here.

## §ROAD B — nothing ships

`defLaneConvergence` is **BORN ABSENT** in every genome; `pmLaneConvergence` is **OFF
in every production path** — a hard `false` default, absent from `a4World.ts` and from
all three play-test worlds, absent from every League's `matchFlags` unless a probe sets
it explicitly — and even ARMED it does nothing while the gene is absent (G-BORN). The
production fingerprint is unchanged, the flag-off world is byte-identical on three
league seeds and on every receipt match seed with the rng stream included, and an
opted-out evolution run draws zero extra rng. **Nothing about the game the user plays
changes in this commit.** The seam exists so PM-T1 can force it.

## §NON-CLAIMS

PM-T0 claims **no** football effect and **no** compression effect size: not on the
send-target lane gap, not on the body lane gap, not on spreadY / spacing / dupRun, not
on marking, not on shots or the equilibrium band. The REPORTED ask census is one
uncontrolled descriptive number at one dose and adjudicates nothing — **F-PM-a** (the
ask moves but the mark-stance ticks swallow it) and **F-PM-b** (the B1-a clump
re-imports) are **PM-T1's** to fire. It does not touch mark selection (#193.1 DEFER
stands), the attacking phase, the lateral opponent-shape term, the coach layer, the
A4 home prior or the station eye. It adds no attribute, no new action type, no render
cue, and no offside work. It does not claim 0.25 is the RIGHT ceiling — only that it
is traced, frozen before sight, and unre-cut. It cannot authorize PM-T1; only the
commander can.

---

## §RESULT — the gates run

*(filled in from the committed artifact after the receipts ran; every number here is
quoted FROM `docs/world-model/data/pm-t0-lane-seam.json`, which is recomputed by
`npx tsx scripts/probes/pm-t0-lane-seam.ts` — the doc never carries evidence the
artifact does not.)*

Implementation at working HEAD `e620298` + this commit's seam. Tests:
[`../../tests/pmLaneConvergence.test.ts`](../../tests/pmLaneConvergence.test.ts)
(**18 pins** — ⚠ CORRECTION (#196, verify finding 1, the #194-M1 class): the
first draft wrote "19 pins" and pasted a `Tests 19 passed` transcript from the
SUPERSEDED version of the file that still carried the fingerprint pin
(Deviation 2 dropped it); the COMMITTED file has 18 `it()` blocks. The
commander re-ran the committed file in isolation at banking:
`Tests 18 passed (18), Duration 4.32s`). Receipts:
[`../../scripts/probes/pm-t0-lane-seam.ts`](../../scripts/probes/pm-t0-lane-seam.ts),
artifact [`data/pm-t0-lane-seam.json`](data/pm-t0-lane-seam.json).
**24 seeds × 6 arms (absent · off · plain · plainOff · bornArmed · forced) = 144 full
matches per core run, and the core runs TWICE (G-DET, byte-identical digests), plus 3
league-seed 2-season identity runs, the boundary/ASK match on seed 12,311,124, the
8-generation evolution-rng comparison, and the `src/**` read-table scan.** Verdict:
**GATES PASS** (`gates.allPass === true`). Wall ≈ 56 s (CONTEXT ONLY — used in no
rate).

* **G-DET digest** — `gates.gDet.digestA === digestB ===`
  `c3388c20263ba893a35d89c1e9d2003bf5c13aaadd162ad08e093db40740c65b`
* **resultSha256** `0a2c54c106cc8f175090e15cbf2306f086c6ed1de9b9c668052565591bbe1635`
  (recomputable: `npx tsx scripts/probes/pm-t0-lane-seam.ts`)
* Both hashes are quoted from **this run's committed artifact** and from nowhere else
  (the #194 M1 lesson: a doc-typed hash from a superseded run is not evidence).
* **Files touched** — the authoritative list is `git show <this commit> --stat`; no
  completeness claim is made here from a `git diff --stat` (the #194 L3 lesson: a
  then-untracked new file is invisible to it).

### Gate table

| gate | verdict | evidence (all recomputed in-probe, #181.2) |
| --- | --- | --- |
| **G-IDENT** | ✅ PASS | all three league hashes IDENTICAL to the frozen pre-change baselines: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26` — `gates.gIdent.rows`, each computed by the `scripts/fingerprint.ts` procedure on this run. **This is the sim path's RNG-stream receipt** |
| **G-FP** | ✅ PASS | the 1337 row IS the production fingerprint (`gates.xFpProd`); `npm run fingerprint` re-derives `57b0bdab…c673` unchanged (§CHECKS) |
| **G-OFF** | ✅ PASS | 24/24 seeds: flag ABSENT ≡ flag FALSE in the percept-armed world AND the production-shaped world (`identical` ∧ `plainIdentical`), whole-match signature including the rng stream state. **CONFIG EQUIVALENCE ONLY** — both arms run the same flag-off path, so this gate proves nothing about RNG streams (that is G-IDENT) |
| **G-BORN** | ✅ PASS | 24/24: ARMED with the gene ABSENT ≡ OFF, byte for byte. **The arms differ in code path**: armed ⇒ `pmMover` true ⇒ the M-PM.1 branch is entered on every defensive mover read and `k_PM` evaluates to 0 ⇒ the born-absent read is inert *through the live branch* |
| **G-BITE** | ✅ PASS | **24/24 forced arms diverge** from absent. Boundary under force, seed 12,311,124: **8,190 sampled body-ticks · zone-centre deviations 0 · mover moved on 8,190/8,190 · max \|Δy\| 7.484 m**. ⚠ CORRECTION (#196, verify finding 3): the zone-centre half of this row is a DEFAULT-PARAMETER pin re-evaluated 8,190 times (both arms call `formationSpot` without `pmMover`, so both resolve false) — it is NOT an observation of the live `assignMarks` path. **The 甲/乙 boundary's real evidence is G-READ** (the `src/**` scan: TeamBrain.ts:479 passes 5 args, no `pmMover`) **+ the test pinning the zone-centre call shape verbatim**; this row's honest content is the MOVER half (it really moves under force) |
| **G-READ** | ✅ PASS | **2 mover sites, 6 unmodulated sites**, scanned from `src/**`: MOVER `actionExecutor.ts:145` (walk target) + `actionExecutor.ts:336` (marker fallback); UNMODULATED `TeamBrain.ts:479` (zone centres), `actionExecutor.ts:304` (trap hold line), `formations.ts:494` (`shapeReady`), `formations.ts:612` (`supportSpot`), `Match.ts:3579` (`resetForKickoff`), `RenderStateAdapter.ts:311` (render) — `gates.gRead.sites` |
| **G-EVORNG** | ✅ PASS | 8 generations, opt-in OFF: genomes identical to the pre-gene re-implementation, gene stayed absent, and the final rng state matches exactly — **`sActual === sHead === 240212633`**. The opt-in path is live (`optInDraws: true`), so the zero is about the flag, not dead code |
| **G-CONST** | ✅ PASS | `PM_LANE_CONVERGENCE_MAX === 0.25` and the legacy convergence line is matched verbatim in `formations.ts` (`gates.gConst.legacyLineFound`) |
| **G-HYGIENE** | ✅ PASS | `cfg.pmLaneConvergence ?? false`; flag AND gene absent from `a4World.ts`; gene absent from `GENE_KEYS`; a fresh Match and a League match are both OFF |
| **G-SEED** | ✅ PASS | 12,311,100–12,311,124, **zero collisions** with the nine consumed A4/O-arc blocks incl. O2-T0's 12,311,000–024 (`gates.seedDisjoint.collisions === []`) |
| **G-DET** | ✅ PASS | two invocations of the core, identical digests (above) |
| **G-SUITE** | ⚠ **PASS with a disclosed environment caveat** | `tsc --noEmit` clean; 1,170/1,171 tests green. The one failure is `formationEvolution.test.ts`'s ten-season test **timing out at its own 180 s cap** — see §CHECKS: it also times out on the SAME machine with this stage's test file EXCLUDED (i.e. at the pre-change 1,153-test baseline), and it PASSES in isolation with this change in the tree (152.8 s). Machine wall-clock, not this seam |

### REPORTED — the ASK census (one forced match at the frozen ceiling, seed 12,311,124)

| quantity | value |
| --- | --- |
| sampled body-ticks (both sides' outfielders, every 15 ticks, `playing` only) | **8,190** |
| mean send-target lane gap — **unmodulated** | **6.586 m** |
| mean send-target lane gap — **mover read, k_PM = 0.25** | **5.029 m** |
| max single-body lateral shift | **7.484 m** |
| zone-centre deviations (the 甲/乙 boundary) | **0** |

**What this is and is not.** It is a sanity reading that the ASK moves in the
direction the mechanism is built to move it, at ONE dose, in ONE match, with **no
control arm, no CI, no dose curve, and no ANSWER** (these are send targets, not body
positions). It is a mean over ALL outfielders at all sampled ticks — **not** the
weak-side-back statistic the #188 forensic measured (18–20 m), so it must **not** be
read as "the 18–20 m gap fell to 5 m". The COMPRESSION EXAM — the resolved,
dose-responsive, guard-carrying measurement of the ask, with the answer measured
separately — is **PM-T1's**, and F-PM-a / F-PM-b remain entirely open.

### §CHECKS

```text
$ npx tsc --noEmit
tsc clean

$ npm run fingerprint
seed=1337 seasons=2 matches=142
sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673

$ npm test          (vitest run — WITH this stage's files)
 FAIL  tests/formationEvolution.test.ts > league-level style ecology > ten seasons: shares stay accounted, the zonal budget holds, the founding pool is diverse
Error: Test timed out in 180000ms.
 Test Files  1 failed | 125 passed (126)
      Tests  1 failed | 1170 passed (1171)
   Duration  258.01s

$ npx vitest run --exclude 'tests/pmLaneConvergence.test.ts' --exclude 'node_modules/**'
                    (the SAME machine, this stage's test file removed = the pre-change
                     1,153-test baseline — the control that attributes the failure)
 FAIL  tests/formationEvolution.test.ts > league-level style ecology > ten seasons: shares stay accounted, the zonal budget holds, the founding pool is diverse
Error: Test timed out in 180000ms.
 Test Files  1 failed | 124 passed (125)
      Tests  1 failed | 1152 passed (1153)
   Duration  242.80s

$ npx vitest run tests/cup.test.ts tests/formationEvolution.test.ts
                    (in isolation, WITH this change in the tree)
   ✓ league-level style ecology > ten seasons: ...  152776ms
 Test Files  2 passed (2)
      Tests  17 passed (17)

$ npx vitest run tests/pmLaneConvergence.test.ts     (before the fingerprint pin was dropped)
 Test Files  1 passed (1)
      Tests  19 passed (19)
```

⚠ CORRECTION (#196, verify finding 1): the transcript directly above is from the
SUPERSEDED file version — it is not evidence for the committed file. The
commander's banking runs on the COMMITTED tree (`c8a44cb`, desktop-loaded box):

```
$ npx vitest run tests/pmLaneConvergence.test.ts     (the COMMITTED 18-pin file)
 Test Files  1 passed (1)
      Tests  18 passed (18)
   Duration  4.32s

$ npx vitest run tests/formationEvolution.test.ts    (the wall-clock test, isolated)
 Test Files  1 passed (1)
      Tests  3 passed (3)
   Duration  148.41s        (< its 180 s budget; faster than the author's 152.8 s)

$ npm test                                           (full suite, load avg ≈ 42)
 Test Files  1 failed | 125 passed (126)
      Tests  1 failed | 1170 passed (1171)           (the same ten-season wall-clock
                                                      timeout as the author's run and
                                                      as the pre-change control)
```

G-SUITE closure (#196): the ONLY red is the known failure-mode-12-family
wall-clock timeout, reproduced WITHOUT this change (the author's 1,153-test
control) and absent in isolation WITH this change (148.4 s / 152.8 s, two
machines-states) — attribution: vitest 8-way parallelism starving a ~15 %-margin
test on a desktop-loaded box, not this seam. CI's post-push suite run is the
closing evidence and gates the deploy.

### Deviations recorded

1. **G-SUITE is not a clean green, and it is not claimed as one.** `npm test` shows
   1 failure: `formationEvolution.test.ts`'s ten-season test exceeding its own 180 s
   timeout. Attribution, measured rather than asserted: the same test times out on
   this machine with this stage's test file **excluded** (the pre-change 1,153-test
   baseline), and it passes in **152.8 s** in isolation with this change present —
   i.e. it is a ~15 %-margin wall-clock test on a loaded box. No assertion in it
   fails. Recorded here instead of being papered over; the commander may wish to
   re-run G-SUITE on an idle machine or CI before banking.
2. **The 2-season fingerprint pin was NOT duplicated into this stage's test file.**
   A first version included it (and passed, `57b0bdab…c673`); it cost 29 s of CPU and
   pushed `cup.test.ts` **and** `formationEvolution.test.ts` past their timeouts under
   vitest's parallelism. It was removed because the same baseline is already asserted
   by `a4HomePriorGene.test.ts` and `a4RestAbandon.test.ts` (so a regression still
   fails the suite) and is recomputed in-probe as G-IDENT/G-FP. The removal is a
   deliberate load decision, noted in the test file itself.
3. **The order-preservation pin is stated at the TERM, not at the final station.** A
   first version asserted per-body monotonic gap shrinkage on the FINAL station and
   FAILED (observed 0.2650 m vs 0.2542 m on a body already essentially on the lane):
   anti-clump and solidity compose after the term and can locally reverse it. Rather
   than weaken the gate's arms to fit its words, the claim was restated where it is
   true — the closed-form contraction/order property of the term, plus an AGGREGATE
   pin on the live field (mean lane gap falls). This is the #194 "a gate whose stated
   semantics its arms cannot deliver" lesson applied prospectively; the underlying
   composition order is the contract's own (§2 M-PM.1: the guards price the
   contraction).
4. **TWO opt-ins, not one.** The contract names an `evolveDefLaneConvergence`-style
   boolean; this build ships both that (the EVOLUTION opt-in, carrying the
   RNG-stream discipline) and a `pmLaneConvergence` `MatchConfig` flag (the
   CONSUMPTION opt-in). Rationale: it is the A4 precedent (gene + `eye.v4.homePrior`
   master flag), it gives G-BORN arms that genuinely differ in code path, and it makes
   the consumption surface switchable independently of whether some genome carries a
   value. Strictly more conservative than the dispatch; no default is flipped by
   either.
5. **The seam is emergent-path-only.** The legacy table path is untouched, because it
   already carries the per-body convergence this ceiling is traced from. Disclosed in
   §SEAM; every claim in this document is emergent-path-only, per the map's own
   branch-disclosure discipline.
6. **No instrument seam was added to `Match`.** PM-T1's doses are applied by writing
   the gene on the team genome views (the `a4World` idiom) rather than through a
   `forcedLook`-style engine field, so the dose travels the REAL gene channel and the
   engine gains no probe-only surface.

### Disposition

The seam is BUILT and DORMANT: the gene is born absent and outside `GENE_KEYS`, the
consumption flag is a hard `false` absent from every bundle, the production
fingerprint is unchanged, flag-off byte-identity holds on three league seeds and 24
match seeds with the rng stream included, an ARMED world with the gene absent is
byte-identical to OFF *through the live branch*, an opted-out evolution run draws zero
extra rng, the read fork is exactly two mover sites out of eight, and the 甲/乙
boundary is pinned by the G-READ src scan + the zone-centre call-shape test (⚠
CORRECTION #196: the earlier "holds under maximum force across 8,190 body-ticks"
phrasing over-read a default-parameter pin as live-path evidence — see the
corrected G-BITE row; the mover half of that number stands). **Nothing ships.**
PM-T0 cannot authorize PM-T1 — the COMPRESSION EXAM is the commander's call.
