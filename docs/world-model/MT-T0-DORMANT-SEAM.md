# MT T0 — the DORMANT ACCESS-TIME MARK-SAG seam (`markSag`, 盯防松紧)

Status: **PRE-REGISTERED, then BUILT + RUN the same round.** The seam semantics, the
three FROZEN constants with their traced source lines, the `markDist` read-surface
table, the branch trace and the Road B statement below were written **before** the
receipts ran (the frozen-before-sight rule, the PM-T0 / O2-T0 two-part form); the
measured numbers arrive only in [§RESULT](#result--the-gates-run) at the foot.

Authority chain: contract
[`MARK-TIGHTNESS-CONTRACT.md`](MARK-TIGHTNESS-CONTRACT.md) — §2 **M-MT.1** (the
access-time account, `t_ball` from the engine's EXISTING kick/pass speed family) ·
**M-MT.2** (the output is stance DISTANCE and nothing else; direction unchanged; a
frozen cap) · **M-MT.3** (the gene, born absent, own opt-in, separate from
`markingAggression`) · **M-MT.4** (what is deliberately NOT touched) · **M-MT.5**
(honesty limits) · §3 the **MT-T0** clause · §4 the non-claims.
Ruling **#201.4** (this dispatch) carrying **#200**'s ABSOLUTE red line — *no
decline/release predicate anywhere; the gene modulates STANCE DISTANCE only,
continuously* — and the **#194/#196/#197** evidence lessons verbatim (no doc-typed
hashes; gate semantics stated exactly — say what the arms DIFFER in; completeness
claims only from `git show --stat`; nothing commit-dependent inside the hashed body).
[`PM-T0-DORMANT-SEAM.md`](PM-T0-DORMANT-SEAM.md) is the FORM this document and its
receipts follow.

Banked evidence this stage stands on: **#199.3** (the mark stance owns 79.97–84.57 %
of material-ask ticks — the defect this arc exists to answer) and the corrected
[`MARK-SELECTION-CODE-MAP.md`](MARK-SELECTION-CODE-MAP.md) §5.2 (the TWO prior stance
reverts this seam must respect).

---

## §LAW — the three FROZEN constants, and where each number comes from

```text
t_ball = dist(ball, mark)   / MARK_SAG_BALL_SPEED          MARK_SAG_BALL_SPEED = 16
t_self = dist(marker, mark) / max(marker.topSpeed, 0.1)
slack  = t_ball − t_self
sagOf  = slack ≤ 0 ? 0 : min(slack · max(marker.topSpeed, 0.1), MARK_SAG_MAX)
                                                            MARK_SAG_MAX = 9
markDist′ = markDist + clamp01(markSag) · sagOf(slack)
```

### 1. `t_ball`'s speed — **16 m/s**, traced

`src/sim/mechanics.ts:373`, inside `performPass`:

```ts
const flight = dist(passer.pos, mate.pos) / (16 * powerMul);
```

This is the engine's OWN pass **flight-time** constant — the single number it already
uses to turn a pass distance into a travel time. The access-time account asks exactly
that question ("how long would the ball take to reach my man"), so the family member is
chosen by **QUESTION IDENTITY**, not by picking a bound off a list.

**The rest of the family, disclosed** so the choice is auditable rather than asserted:
the cutback estimator uses `18` (`mechanics.ts:662`); ⚠ CORRECTION (#202, verify
findings 1–2): the first draft cited the executed ground-pass strike speed at
`mechanics.ts:377` — the line is **`:379`** (`clamp(d·0.6 + 8.2, 9, 22)`, a band this
16 sits inside; the frozen constant itself at `:373` was cited correctly and is
machine-pinned by G-CONST) — and omitted one family member: the **through-ball lead
estimator also uses `18` (`mechanics.ts:466`)**, the same value as the cutback row;
`SHOT_SPEED = 27` (`constants.ts:346`) is a shot, not a pass. `powerMul` is
deliberately **NOT** read — it is a property of one passer's body orientation and
chosen weight, and M-MT.5 fixes slice one at geometry only.

### 2. `t_self` — the EXISTING arrival-time form, no new constant

`src/ai/TeamBrain.ts:425` (the attack-the-drop chaser election, the contract's named
`t_self` precedent):

```ts
const t = dist(p.pos, land) / Math.max(p.topSpeed, 0.1);
```

Same form, same `max(…, 0.1)` guard. `topSpeed` is an existing per-body engine
quantity.

### 3. The sag CEILING — **9 m**, traced

`src/ai/TeamBrain.ts:493`, inside `assignMarks`:

```ts
if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;
```

The **zonal engagement radius**: the engine's own standing answer to "how far from his
station may a defender be asked to engage a man". Sag is exactly that quantity read
from the other end — how far off his man a marker may stand and still be marking him.
The contract names this line as the natural neighbour (§2 M-MT.2). So the new axis can
express EXACTLY as much slack as the engine already prices for engagement, and no more.

### 4. The `sagOf` SHAPE — why it introduces no fourth constant

Slack is in seconds; the stance is in metres. The conversion is not invented: the sag
in metres **is the distance the marker recovers in his spare time**,
`slack · max(topSpeed, 0.1)`. Equivalently `sagOf = min(t_ball·v − d, 9)`. It is
monotone increasing in positive slack, exactly `0` at zero/negative slack, and hard
capped. **No new constant is introduced by this slice.**

**Sizing honesty, stated up front.** At the top dose a marker whose man is 25 m from
the ball and 2 m from him stands ~9 m off instead of 1.2–2.6 m. Whether that is enough
to un-swallow the #199 body contrasts is **exactly MT-T1's question**, and this stage
pre-commits to not re-cutting any of the three numbers to make MT-T1 succeed. If MT-T1
needs different ones, that is a fork for the commander WITH numbers. The link between
each constant and its provenance is machine-checked twice — `G-CONST` in the probe and
[`tests/markSagGene.test.ts`](../../tests/markSagGene.test.ts) both assert the source
lines VERBATIM — so the families cannot drift silently.

## §SEAM — the mechanism (all of it dormant)

### The gene

* **`markSag`**, a new **OPTIONAL** `TacticalGenome` key
  (`src/evolution/genome.ts:262`), **BORN ABSENT** — the `defLaneConvergence` /
  `homePriorObedience` birth form verbatim:
  * deliberately **NOT in `GENE_KEYS`**, so `randomGenome` / `mutateGenome` /
    `crossoverGenomes` / `geneDistance` draw the EXACT same rng in the EXACT same
    order as HEAD, and an absent optional key is omitted by `JSON.stringify` ⇒ the
    serialized genome and the production fingerprint are byte-identical;
  * it evolves ONLY under its **OWN explicit `evolveMarkSag` boolean**
    (`genome.ts:486`, per #75 — never a widening of `evolveHomePrior` /
    `evolveHomePriorOffsets` / `evolveDefLaneConvergence`), and its draws sit
    **STRICTLY AFTER the `defLaneConvergence` block** (hence after both home-prior
    blocks), so enabling it never re-orders an existing draw;
  * absent ⇒ `markSagWeight() === 0` ⇒ the term vanishes.
* **SEPARATE from `markingAggression`**, which keeps its fixed-tightness preference,
  its `laneW` coupling and its `speedF` coupling entirely untouched (M-MT.3, the
  separate-budget-lines lesson). The two co-evolve.

### The consumption flag

* **`mtMarkSag`**, a new **explicit** `MatchConfig` boolean, initialised
  `cfg.mtMarkSag ?? false` (`Match.ts:1191`) — a **hard `false`**, the
  `pmLaneConvergence` / `o2Look` form. **Never** `EDS_BUNDLE_ARMED`, never env-armed,
  never default-ON, and never bundle-defaulted: absent from `src/game/a4World.ts`
  entirely, so no play-test world, preset or env bundle can turn it on. It gets its own
  `League.matchFlags` key (`League.ts:283`) so a probe world can arm it EXPLICITLY, and
  that key changes no default.
* ⭐ **THE PM ARMING CHECKLIST (binding, #196.3-D4)**: armed = the `mtMarkSag` flag
  **+** the `evolveMarkSag` opt-in (for evolution runs) **+** a non-absent gene —
  **ALL**. No bundle defaults any of the three. Even ARMED the world is unchanged while
  the gene is absent (that is G-BORN). MT-T1 doses through the REAL gene channel on all
  three genome views (`info.genome` / `baseGenome` / `effGenome`) — the engine gains no
  probe-only dose surface (#197.3-D6).

### The phase gate (M-MT.1 "the ball in play")

Evaluated **once**, in `executeAction`'s prologue (`actionExecutor.ts:149`) and nowhere
else:

```ts
const mtSag = match.mtMarkSag && match.phase === 'playing';
```

and the out-of-possession half (`!hasBall`) is enforced at the term itself. So the
sagged stance exists **only in live open play, out of possession**. `kickoff`,
`restart` (goal kicks, throw-ins, free kicks, corners), `goalPause`, `halftime` and
`fulltime` all keep the UNMODULATED stance.

### The term (M-MT.2)

In `actionExecutor.ts`'s `MarkOpponent` case, **immediately after** both existing
stance floors and **before** the direction blend (`actionExecutor.ts:325-327`):

```ts
if (mtSag && !hasBall) {
  const w = markSagWeight(g);
  if (w > 0) markDist += w * markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed);
}
```

* **It is the ONLY write of this slice.** `markDist` is the single scalar touched.
* **It can only ADD distance.** `sagOf ≥ 0` and `w ≥ 0`, so `markDist′ ≥ markDist`
  always — pinned as a closed-form property over a geometry sweep in the test file, and
  observed over live marker-ticks by G-BITE (`tightened = 0`). Both prior stance
  reverts are therefore respected **by construction**: the Phase 30.5 floor (1.2 m —
  tightening produced snap dispossessions) and the Phase 31.6 distribution stand-off
  both remain lower bounds the seam can never breach.
* **Direction is UNCHANGED.** The `(mark→goal, mark→ball)` blend and `laneW` are
  untouched — so sagging moves the body ball-side/goal-side, the real tuck-in, and the
  Phase 27.1 revert (a stronger ball-pull dragged markers into the central corridor) is
  not re-litigated: **no blend weight moves**.
* **NO predicate, anywhere** (#200). There is no `if (irrelevant) release`, no
  threshold on lane gap, no box carve-out and no "放人" in the code or the vocabulary.
  The output is one continuous non-negative scalar.
* **The contain case and the box price THEMSELVES.** `ball.owner === mark` ⇒ the ball
  is at his feet ⇒ `t_ball ≈ 0` ⇒ `slack < 0` ⇒ **zero sag**, so the Phase 29.1 jockey
  stand-off is exactly today's. Same arithmetic for any short delivery: G-BITE's
  REPORTED delivery layer publishes it as an observation, not an assertion.

### The BRANCH TRACE — every stance branch, touched or not

| # | branch | file:line | reached by the sag? |
| --- | --- | --- | --- |
| 1 | **base stance floor** (Phase 30.5): `markDist = ball.owner === mark ? 2.6 : 2.6 − markingAggression·1.4` | `actionExecutor.ts:294` | **INPUT** — the sag is added on top of its output; the line itself is byte-identical |
| 2 | **distribution stand-off**, goal-kick half (Phase 31.6): `match.restart?.kind === 'goalKick'` | `actionExecutor.ts:299-310` | ❌ **UNREACHABLE** — that half only fires while a `goalKick` restart is pending, i.e. `phase === 'restart'`, which the M-MT.1 phase gate excludes |
| 3 | **distribution stand-off**, GK-hold half: `oppGk.gkHoldTimer > 0 \|\| oppGk.gkDistributing` | `actionExecutor.ts:299-310` | ✅ **TOUCHED** — this half CAN run in `playing`. Stated exactly: the stand-off raises the floor and the sag adds on top, so the stance is never tighter than 31.6 left it; and while their keeper holds the ball at the far end the account reports real slack — which is the mechanism working as designed (§7 REALITY: you do not glue a man while the ball is dead at the other end) |
| 4 | **the direction blend** (`nx/ny`, `bx/by`, `laneW`, Phase 27/27.1) | `actionExecutor.ts:328-344` | ❌ untouched — byte-identical; the sag scales the SAME unit vector |
| 5 | **the offside trap** (Phase 109) | `actionExecutor.ts:346-372` | ⚠ **DOWNSTREAM ONLY** — it reads the already-computed `target` and blends **x only** toward an UNMODULATED `formationSpot` reference. Its own arithmetic and its reference are byte-identical; a sagged target can change whether its `localX(target.x) < localX(spot.x)` condition holds, which is a consequence of the stance moving, not a modification of the trap |
| 6 | **marker reaction lag** (Phase 31.9) | `actionExecutor.ts:374-390` | ⚠ **DOWNSTREAM ONLY** — the anchor stores whatever `target` the stance produced; cadence, `lag` and the 26 m / 4.5 m·s⁻¹ conditions are byte-identical |
| 7 | **the marker no-target fallback** (`mark === null`) | `actionExecutor.ts:395` | ❌ untouched — it is the PM-T0 mover read; this slice never enters it (it requires a mark) |
| 8 | **`speedF = 0.85 + markingAggression·0.15`** | `actionExecutor.ts:392` | ❌ untouched — no speed change (M-MT.2) |
| 9 | **GK / set-piece paths** (`GoalKeeper*`, corner/free-kick/wall spots, `resetForKickoff`) | `actionExecutor.ts` other cases, `Match.ts` | ❌ untouched — the term lives inside `case 'MarkOpponent'` only, and every restart phase is excluded by the phase gate |

### The `markDist` READ-SURFACE table

`markDist` is a **block-local `let`** inside `case 'MarkOpponent'`. It is never stored
on a player, never serialized, never exported. The complete inventory across
`src/**`, `tests/**` and `scripts/**`:

| # | reader | file:line | class | modulated? |
| --- | --- | --- | --- | --- |
| 1 | declaration (Phase 30.5 floor) | `src/ai/actionExecutor.ts:294` | WRITE | input |
| 2 | Phase 31.6 stand-off raise | `src/ai/actionExecutor.ts:310` | WRITE | input |
| 3 | **the MT-T0 sag** | `src/ai/actionExecutor.ts:326` | **WRITE (this slice)** | ✅ |
| 4 | the stance target | `src/ai/actionExecutor.ts:345` | READ | ✅ (the only consumer) |
| — | **no other `src/**` reader** | — | — | — |
| — | **no `tests/**` reader at all** — `grep -rn markDist tests` returns EMPTY (measured, not assumed: no test asserts a stance distance, so no test can be perturbed by this seam even when it is armed) | — | — | — |
| 5 | `scripts/**`: THIS probe only — `grep -rn markDist scripts` returns 9 lines, ALL in `scripts/probes/mt-t0-mark-sag.ts` (⚠ stated exactly: 6 are prose in comments/`semantics` strings, and 3 are the G-CONST **verbatim pin strings** at `:450-452` that make the replica drift-proof). It does not read the engine's variable — it recomputes its own | REPLICA | n/a |

The downstream surfaces that consume its *product* (the `target`) are rows 5–6 of the
branch trace, plus `p.markAnchor` and the common post-switch steering/clamp machinery —
all of which see a target, never `markDist`.

### The `formations.test.ts` PIN — status: **SURVIVES, and does not even read the stance**

The man-tracking pin is `tests/formations.test.ts:105-157`
(`describe('marking schemes')` → `it('man tracks the flank threat; zonal defends its
zones and the box')`). **Verified assertion by assertion**: after `updateTeamBrain`, it
builds `new Set(team.marks.values())` and asserts four membership facts —
`manMarked.has(5)`, `manMarked.has(3)`, `zonalMarked.has(3)`,
`zonalMarked.has(5) === false`. **It reads ASSIGNMENT only. It contains no distance
assertion at all**, and it never calls `executeAction`. Since this slice changes no
assignment code (G-ASSIGN) and adds nothing to `TeamBrain.ts`, the pin is untouched on
two independent grounds — and, the flag being born off, it would be untouched even if
it did read distances. M-MT.4's expectation ("a sagged marker still tracks his man") is
therefore satisfied trivially at T0; the *behavioural* version of that claim is
MT-T1's. Re-run at banking: see §CHECKS.

### Perception honesty (M-MT.5)

The account reads `ball.pos`, `mark.pos`, `p.pos` and `p.topSpeed` — every one of them
already read by the stance path a few lines below. No new percept channel, no opponent
mind-reading, no rng. Disclosed limits, restated: `t_ball` is a **straight-line proxy**
(no lofted-arc solver in the stance layer, and no `powerMul`), and the account does
**not** read the carrier's ability to release (pressure / orientation / wind-up) — that
refinement is a later slice, named in the contract.

### Untouched (restated as a prohibition)

`assignMarks` / `assignChasers` / `team.marks` and every mark-SELECTION surface ·
`markingAggression` and its triple coupling · `laneW` and the direction blend · the
offside trap's own arithmetic · the reaction-lag cadence · `speedF` · the marker
no-target fallback · every GK and set-piece path · `whetherEye` / price tables · the PM
seam (`defLaneConvergence` / `pmLaneConvergence`, which stays banked and separate) ·
`a4World.ts`'s flag set and all three play-test worlds · the legacy table path.

⚠ NOTE (#202, verify finding 3): "untouched" is a CODE-level claim. An EMERGENT
feedback path exists and is now named: a sagged marker standing up to 9 m further off
his man moves the distances `assignMarks`' own gates read (`d < 22` at
`TeamBrain.ts:495`, the 9 m zonal gate at `:493`), so assignment CAN churn downstream
of the body — the map-§2.4 positional-feedback channel, not a predicate (permitted by
#200; G-ASSIGN's order arm shows marks never LEAD the divergence — first position
divergence tick 62 vs first marks divergence tick 130). MT-T1 carries mark-assignment
drift as a REPORTED dimension for exactly this reason.

---

## §GATES — frozen ex ante (the PM-T0 form)

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with the gene and flag absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — **all three RECOMPUTED IN-PROBE** and written to the committed artifact (#181.2: no doc-typed hash is evidence). **Semantics: this IS the sim path's RNG-stream receipt** — the baselines were frozen from PRE-change code, so any added draw, conditional or not, would break them | HARD |
| **G-FP** | the 1337 row IS the production fingerprint; `npm run fingerprint` prints it unchanged | HARD |
| **G-OFF** | per-match whole-run signature **including the rng stream state**: flag ABSENT ≡ flag FALSE, in BOTH the production-shaped world and the percept-armed world, on every receipt seed. **Semantics, exactly (#194): both arms execute the SAME flag-off code path, so this proves CONFIG EQUIVALENCE and nothing more** — it is not an RNG-stream gate | HARD |
| **G-BORN** | ARMED (`mtMarkSag: true`) with the gene ABSENT ≡ OFF on every receipt seed. **Semantics: THE ARMS DIFFER IN CODE PATH** — armed ⇒ `mtSag` true ⇒ the M-MT.2 branch is ENTERED on every out-of-possession marker tick and `markSagWeight` evaluates to 0 ⇒ byte-identity proves the born-absent read is inert **through the live branch** | HARD |
| **G-BITE** | armed AND dosed (gene = 1): every seed's world DIVERGES — the identity gates are not the identity of dead code — **AND the sag is instrument-visible in the stance**: on every slack-positive marker-tick the sagged distance strictly EXCEEDS the unmodulated `markDist`, and on ZERO ticks is it smaller | HARD |
| **G-ASSIGN** | the assignment boundary, **two arms with different semantics**. (a) SOURCE: an `src/**` scan finds the seam's identifiers in ZERO lines of `TeamBrain.ts` — the file that owns `assignMarks` / `team.marks` cannot read the seam at all. (b) ORDER: lockstep absent-vs-forced on one seed — the arms DO diverge (that is G-BITE); the claim is that `team.marks` never diverges **BEFORE** body positions do. A direct assignment channel would show marks differing at the first brain tick with every position still identical | HARD |
| **G-EVORNG** | the EVOLUTION path draws ZERO extra rng with the opt-in off: 8 generations of the shipped mutate+crossover reproduce a faithful PRE-GENE re-implementation's genomes AND final rng state exactly, the gene stays absent — **and the opt-in path is shown live** (flag-on really writes the gene), **and the PM-T0 opt-in's OWN stream is unmoved** (the new draws sit strictly after the `defLaneConvergence` block) | HARD |
| **G-CONST** | `MARK_SAG_BALL_SPEED === 16` **and** `MARK_SAG_MAX === 9`, each matched VERBATIM against its source line — plus the `t_self` form, the two stance-floor lines the G-BITE replica mirrors, and the seam line itself | HARD |
| **G-HYGIENE** | `cfg.mtMarkSag ?? false`; the flag and the gene are absent from `a4World.ts`; the gene is absent from `GENE_KEYS`; a fresh Match and a League match are both OFF; `TeamBrain.ts` never names the seam; no env door | HARD |
| **G-SEED** | seed-block disjointness proved in-probe against every consumed A4/O/PM-arc block **including PM-T1's 12,311,300–949** | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests | HARD |
| **G-CHECKS** | `tsc --noEmit` clean; the stance-adjacent test files green (`markSagGene`, `pmLaneConvergence`, `formations`); `npm run fingerprint` unchanged. ⚠ NOT the full suite — the dispatch scoped the checks | HARD |
| **REPORTED** | the BOX census in two layers at the frozen dose: MAN-IN-BOX (explicitly **not** the claim) and DELIVERY (ball in that box too) — the contract §7 "the box prices itself" claim made visible. Descriptive, one match, no control, no CI, no dose curve, **no ANSWER** — a reading for the commander, never a licence to re-cut a constant | REPORTED |

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any src diff
outside the seam path, any rng draw appearing on the dormant path, any predicate
appearing anywhere, or the `formations.test.ts` pin breaking (a STOP-and-report, never
a test edit).

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| A4/O/PM-arc consumed through | 12,311,024 · 12,311,100–124 · 12,311,200–205 · 12,311,300–949 | prior |
| **MT-T0 receipts (this stage)** | **12,312,000 – 12,312,023** (24 seeds × 6 arms) + **12,312,024** (the stance census) + **12,312,025** (the assignment lockstep) | **CONSUMED here** |
| MT-T0 test-file seeds (not a battery) | 12,312,900 – 12,312,901 | consumed here |
| free above | 12,312,026 – 12,312,899 and 12,312,902 + | available to MT-T1 |

Disjointness from every listed consumed block is computed **in-probe**
(`gates.seedDisjoint`), not asserted here.

## §ROAD B — nothing ships

`markSag` is **BORN ABSENT** in every genome; `mtMarkSag` is **OFF in every production
path** — a hard `false` default, absent from `a4World.ts` and from all three play-test
worlds, absent from every League's `matchFlags` unless a probe sets it explicitly — and
even ARMED it does nothing while the gene is absent (G-BORN). The production
fingerprint is unchanged, the flag-off world is byte-identical on three league seeds and
on every receipt match seed with the rng stream included, and an opted-out evolution run
draws zero extra rng. **Nothing about the game the user plays changes in this commit.**
The seam exists so MT-T1 can force it.

## §NON-CLAIMS

MT-T0 claims **no** football effect: not on the body lane gap, not on the swallow
share, not on shortfall or detachment, not on spreadY / spacing / dupRun, not on goals
or the equilibrium band, not on watchability. The REPORTED box census is one
uncontrolled descriptive reading at one dose and adjudicates nothing — **F-MT-a** (the
sag fires but the body lane gap stays null ⇒ wrong delivery geometry), **F-MT-b**
(marking's defensive function breaks) and **F-MT-c** (the clump re-imports) are all
**MT-T1's** to fire. It does not touch mark selection, the attacking phase, the PM
seam, the coach layer, the A4 home prior or the station eye. It adds no attribute, no
new action type, no render cue and no offside work. It does not claim 16 / 9 / the
`sagOf` shape are the RIGHT numbers — only that they are traced, frozen before sight,
and unre-cut. It cannot authorize MT-T1; only the commander can.

---

## §RESULT — the gates run

*(every number here is quoted FROM `docs/world-model/data/mt-t0-mark-sag.json`, which
is recomputed by `npx tsx scripts/probes/mt-t0-mark-sag.ts` — the doc never carries
evidence the artifact does not.)*

Tests: [`../../tests/markSagGene.test.ts`](../../tests/markSagGene.test.ts) — **16
pins** (16 `it()` blocks; the transcript in §CHECKS is from the COMMITTED file, the
#196-M1 lesson applied prospectively). Receipts:
[`../../scripts/probes/mt-t0-mark-sag.ts`](../../scripts/probes/mt-t0-mark-sag.ts),
artifact [`data/mt-t0-mark-sag.json`](data/mt-t0-mark-sag.json).
**24 seeds × 6 arms (absent · off · plain · plainOff · bornArmed · forced) = 144 full
matches per core run, and the core runs TWICE (G-DET, byte-identical digests), plus 3
league-seed 2-season identity runs, the stance census on seed 12,312,024, the
assignment lockstep on seed 12,312,025, the 8-generation evolution-rng comparison (two
arm pairs) and the `src/**` seam scan.** Verdict: **GATES PASS**
(`gates.allPass === true`), probe exit 0.

* **G-DET digest** — `gates.gDet.digestA === digestB ===`
  `7134332246b608e822e24cfb1367d29f091fb4c24a068c7006c5df3008a17b2e`
* **resultSha256** `8f222b34652b876a91c8ae9eaa541aa527d35296f707e36242d6ebec20521a32`
  (recomputable: `npx tsx scripts/probes/mt-t0-mark-sag.ts`). ⭐ Per #197-M1 the hashed
  body is **commit-free and timing-free** — `headContextOnly` and `wallMsContextOnly`
  ride the envelope, OUTSIDE the hash, so a third party re-derives this hash at an
  arbitrary commit.
* Both hashes are quoted from **this run's committed artifact** and from nowhere else.
* **Files touched** — the authoritative list is `git show <this commit> --stat`; no
  completeness claim is made here from a `git diff --stat` (the #194 L3 lesson).

### Gate table

| gate | verdict | evidence (all recomputed in-probe, #181.2) |
| --- | --- | --- |
| **G-IDENT** | ✅ PASS | all three league hashes IDENTICAL to the frozen pre-change baselines: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26` — `gates.gIdent.rows`, each computed by the `scripts/fingerprint.ts` procedure on this run. **This is the sim path's RNG-stream receipt** |
| **G-FP** | ✅ PASS | the 1337 row IS the production fingerprint (`gates.xFpProd`); `npm run fingerprint` re-derives `57b0bdab…c673` unchanged (§CHECKS) |
| **G-OFF** | ✅ PASS | 24/24 seeds: flag ABSENT ≡ flag FALSE in the percept-armed world AND the production-shaped world (`identical` ∧ `plainIdentical`), whole-match signature including the rng stream state. **CONFIG EQUIVALENCE ONLY** — both arms run the same flag-off path, so this gate proves nothing about RNG streams (that is G-IDENT) |
| **G-BORN** | ✅ PASS | 24/24: ARMED with the gene ABSENT ≡ OFF, byte for byte. **The arms differ in code path**: armed ⇒ `mtSag` true ⇒ the M-MT.2 branch is entered on every out-of-possession marker tick and the weight evaluates to 0 ⇒ the born-absent read is inert *through the live branch* |
| **G-BITE** | ✅ PASS | **24/24 forced arms diverge** from absent. Stance under force, seed 12,312,024: **2,986 marker-ticks · slack-positive 1,858 · sagged > base 1,858 (100 % of them) · tightened 0 · mean `markDist` 2.048 → 4.302 m · max sag 9.000 m (the cap binds)**. ⚠ Stated exactly: the unmodulated `markDist` is a probe-side REPLICA of the two stance-floor lines (the engine keeps it block-local and this slice deliberately adds no probe-only engine surface); G-CONST matches both source lines and the seam line VERBATIM, so the replica cannot drift |
| **G-ASSIGN** | ✅ PASS | (a) SOURCE: 35 seam lines across exactly 4 files — `actionExecutor.ts`, `genome.ts`, `Match.ts`, `League.ts` — and **ZERO in `TeamBrain.ts`** (`gates.gAssign.sites`, scanned from `src/**`). (b) ORDER, seed 12,312,025: **first POSITION divergence tick 62, first `team.marks` divergence tick 130** ⇒ `marksLedDivergence === false`; marks were identical on 129 of the 130 compared ticks. The assignment never leads |
| **G-EVORNG** | ✅ PASS | 8 generations, opt-in OFF: genomes identical to the pre-gene re-implementation, gene stayed absent, final rng state matches exactly — **`sActual === sHead === 240212633`**. The opt-in path is live (`optInDraws: true`), and `pmStreamUnmoved: true` — a `evolveDefLaneConvergence`-only run reproduces a defLane-only re-implementation's stream and value exactly, so the new draws really do sit after it |
| **G-CONST** | ✅ PASS | `MARK_SAG_BALL_SPEED === 16` + `mechanics.ts` flight line verbatim; `MARK_SAG_MAX === 9` + `TeamBrain.ts` zonal line verbatim; plus the `t_self` arrival line, the Phase 30.5 floor line, the Phase 31.6 stand-off line and the seam line — all six `…LineFound: true` |
| **G-HYGIENE** | ✅ PASS | `cfg.mtMarkSag ?? false`; flag AND gene absent from `a4World.ts`; gene absent from `GENE_KEYS`; a fresh Match and a League match are both OFF; `TeamBrain.ts` never names the seam |
| **G-SEED** | ✅ PASS | 12,312,000–12,312,025, **zero collisions** with the twelve consumed A4/O/PM-arc blocks incl. PM-T1's 12,311,300–949 (`gates.seedDisjoint.collisions === []`) |
| **G-DET** | ✅ PASS | two invocations of the core, identical digests (above) |
| **G-CHECKS** | ✅ PASS | `tsc --noEmit` clean; `markSagGene` 16/16, `pmLaneConvergence` + `formations` + `markSagGene` together **45/45**; `npm run fingerprint` unchanged — full transcripts in §CHECKS |

### REPORTED — the BOX census (one forced match at the frozen dose, seed 12,312,024)

| layer | ticks | zero-sag | mean sag | max sag | mean `t_ball` |
| --- | --- | --- | --- | --- | --- |
| all marker-ticks | 2,986 | 1,128 | 2.254 m (2.048 → 4.302 mean stance) | 9.000 m | — |
| **MAN-IN-BOX** (the man in our box) | 69 | 17 | **3.258 m** | 9.000 m | 0.877 s |
| **DELIVERY** (the ball in that box too) | 20 | **14** | **0.443 m** | 3.316 m | **0.339 s** |

**What this is and is not.** The DELIVERY row is the contract §7 claim made visible:
when the ball is actually in the box the flight time collapses to ~0.34 s, slack goes
non-positive, and 14 of 20 marker-ticks carry **exactly zero** sag — touch-tight
marking emerging from the account with **no carve-out and no predicate**. The
MAN-IN-BOX row is published precisely so the claim is not read wider than it is: a man
standing in our box while the ball is at the far end (mean `t_ball` 0.88 s over that
layer, and much longer in its tail) legitimately gets slack and the marker tucks in —
that is the mechanism working as designed, not a leak. Both layers use the engine's own
box geometry (`BOX_WIDTH` / `BOX_DEPTH` / `HALF_L`); **no threshold is invented**. It is
ONE match at ONE dose with **no control arm, no CI and no dose curve**, it gates
nothing, and it says nothing about whether the sag helps — F-MT-a/b/c are entirely
MT-T1's.

### §CHECKS

```text
$ npx tsc --noEmit
tsc clean

$ npx vitest run tests/pmLaneConvergence.test.ts tests/formations.test.ts tests/markSagGene.test.ts
 ✓ formations are tactics, not paint (directional) > under zonal, a press-23 side defends 3m+ higher than a low-32 side  5859ms
 ✓ the discovered shapes (Phase 67, N5) > the novel shapes play REAL football — attack both ways over a seed pool  11077ms

 Test Files  3 passed (3)
      Tests  45 passed (45)
   Duration  17.44s

$ npx vitest run tests/markSagGene.test.ts        (the COMMITTED 16-pin file, isolated)
 Test Files  1 passed (1)
      Tests  16 passed (16)
   Duration  2.22s

$ npx vitest run tests/formations.test.ts -t 'man tracks the flank threat'
                    (THE PIN, isolated — M-MT.4)
 ✓ tests/formations.test.ts (11 tests | 10 skipped) 15ms
 Test Files  1 passed (1)
      Tests  1 passed | 10 skipped (11)
   Duration  436ms

$ npm run fingerprint
seed=1337 seasons=2 matches=142
sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673

$ npx tsx scripts/probes/mt-t0-mark-sag.ts        (exit 0)
GATES PASS — artifact docs/world-model/data/mt-t0-mark-sag.json
```

⚠ **The full suite was NOT run** — the #201.4 dispatch scoped the checks to `tsc`, the
stance-adjacent test files and the fingerprint, and this document claims exactly that
and no more. G-SUITE closure (and the known `formationEvolution.test.ts` ten-season
wall-clock flake, #196.2) is the commander's at banking.

### Deviations recorded

1. **THREE constants are frozen, not two.** The contract §2 names the `t_ball` speed
   family and the sag cap; freezing the `sagOf` SHAPE needed a slack→metres
   conversion. Rather than invent one, the shape uses the marker's own `topSpeed`
   (`sagOf = min(slack · v, 9)`, i.e. "the distance he recovers in his spare time"), so
   the third freeze introduces **no third constant** — it reuses the quantity `t_self`
   already reads. Disclosed here rather than presented as arithmetic that fell out.
2. **The `t_ball` family member is chosen by QUESTION IDENTITY, not by a bound.**
   PM-T0's precedent froze the *ceiling* of its family; that reasoning does not
   transfer, because this family's members answer different questions (flight-time
   estimate vs executed strike speed vs shot speed). The one that answers *this*
   question is the flight-time estimator, 16. The alternatives are enumerated in §LAW
   so the choice is auditable, and `powerMul` is deliberately dropped (M-MT.5).
3. **TWO opt-ins, not one** (the #196.3-D4 precedent, accepted there): `evolveMarkSag`
   (evolution, RNG-disciplined) + `mtMarkSag` (consumption, `MatchConfig`). Strictly
   more conservative than the dispatch; it buys G-BORN arms that genuinely differ in
   code path.
4. **The GK-hold half of the Phase 31.6 stand-off is TOUCHED** (branch-trace row 3),
   and deliberately so: excluding it would be a hand-written carve-out, exactly the
   family #200 forbids. The stand-off remains a floor the sag can only add to, so the
   31.6 revert is not re-imported. Flagged because it is the one live-phase branch the
   term reaches beyond the plain stance.
5. **G-BITE's base `markDist` is a probe-side REPLICA**, not an engine read — the
   engine keeps the scalar block-local and this slice adds no probe-only surface
   (#197.3-D6). Mitigated by G-CONST matching both floor lines and the seam line
   verbatim on every run. Disclosed here and in the gate row rather than left for a
   verifier to discover (the #196-L3 lesson applied prospectively).
6. **G-ASSIGN's second arm is an ORDER claim, not an identity claim.** The two arms DO
   diverge — asserting `team.marks` identity across a forced and an unforced world
   would be a gate whose arms cannot deliver its stated semantics (#194's second
   lesson). What is gated is that assignment never diverges before the bodies do; the
   identity-grade evidence is the `src/**` scan.
7. **The 2-season fingerprint pin was NOT duplicated into this stage's test file** —
   PM-T0 Deviation 2's load lesson, verbatim: the same baseline is asserted by
   `a4HomePriorGene.test.ts` / `a4RestAbandon.test.ts` and recomputed in-probe as
   G-IDENT/G-FP.
8. **`npm test` was not run** (see §CHECKS) — dispatch scope, stated rather than
   implied.

### Disposition

The seam is BUILT and DORMANT: the gene is born absent and outside `GENE_KEYS`, the
consumption flag is a hard `false` absent from every bundle, the production fingerprint
is unchanged, flag-off byte-identity holds on three league seeds and 24 match seeds with
the rng stream included, an ARMED world with the gene absent is byte-identical to OFF
*through the live branch*, an opted-out evolution run draws zero extra rng and the PM-T0
opt-in's own stream is unmoved, the assignment file never names the seam and assignment
never leads the divergence, and under force the stance sags on 1,858/1,858 slack-positive
marker-ticks while tightening on **zero**. There is **no decline predicate anywhere**
(#200). **Nothing ships.** MT-T0 cannot authorize MT-T1 — the ruler re-run is the
commander's call.
