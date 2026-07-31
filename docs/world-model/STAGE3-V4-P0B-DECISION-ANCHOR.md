# Stage III V4-P0b — The Decision Anchor (instrument-corrected re-classification)

Status: **PRE-REGISTERED 2026-07-31, FROZEN BEFORE THE NEW RUN. READ-ONLY,
zero `src/**`.** This is a NEW pre-registration ordered by ruling **#96.6**
(the V4-P0 adjudication). It corrects the two named instrument defects of
the V4-P0 run and re-CLASSIFIES the fired limbs on the corrected
instruments. **It changes nothing that shipped and nothing that was
published**: the P0 §RESULT verdicts stay published, never overwritten
(revert→reframe applied to instruments — #96.6). This freeze is disclosed
AS WRITTEN *after* P0's data is on the record, and it binds the NEW run;
per freeze honesty it may cite ONLY already-published numbers — the P0
§RESULT, rulings #88–#96 — and no `docs/world-model/data/*.json` is opened
and nothing is run before this document is committed.

**This freeze RETURNS TO THE COMMANDER for review; the probe
(`scripts/probes/stage3-v4-p0b-decision-anchor.ts`) is a FUTURE authorized
step** (the standing pattern: freeze → review → build → run; §0.0 / #86.2
sequence). **V4-P0b cannot authorize V4-P1** — only the commander's review
of this freeze can, and an UNROUTABLE limb stops the stage here (#96.6(v)).

Authority: ruling **#96** (the V4-P0 adjudication: the frozen verdicts
publish; two instrument defects named — **#96.3** the decision-vs-harm
anchor tautology, **#96.4** the delivery-detector internal inconsistency;
V4-P0b ordered, **#96.6(i)–(v)**) · the v4 design contract
[`STAGE3-V4-LONG-HORIZON-PRICE.md`](STAGE3-V4-LONG-HORIZON-PRICE.md)
(invariants **I1–I11**; CLASS J = "the consumer reads the table at moments
outside the census's sampled support", §2/§4) · the P0 pre-registration
[`STAGE3-V4-P0-AUTOPSY-MAP.md`](STAGE3-V4-P0-AUTOPSY-MAP.md) **§§1–7 + the
#93 A1–A4 amendments + its committed §RESULT** — **P0b INHERITS EVERYTHING
NOT AMENDED HERE** · #88/#89 (the P3a verdict) · #44.3/I7 (labelled data) ·
#46.2 · #48.4 · #49.3 · #26.5 · #67.3 · #80.2/I11 · #20 · #24/#44.5/#65 ·
#38.1 (full sign space) · Road B (nothing ships).

**World / HEAD / flags (#26.5 / #67.3).** Unchanged from P0: every
re-simulation runs the **ENRICHED** #67.3 bundle copied verbatim from the
P3a stage doc §3.2 — `edsPerceivedDefence + edsPerceivedChoice +
edsValueAxis` ON, `c5Hold`, `c6Carry`, `c7Windup` ON; `c5TouchFork` off.
In production every EDS flag defaults OFF and `c6Carry`/`c7Windup` default
`false`; the enriched world is probe-only staging. **Zero `src/**`
changes; the production fingerprint `57b0bdab…c673` stays unchanged
throughout** (gate X-SRC-ZERO, §4).

---

## 1. What V4-P0b is (and is not)

P0 mined the P3a deployment failure, routed the three discipline limbs to
**CLASS J** and found the delivery limb **UNROUTABLE**, and STOPPED at the
commander (frozen reading B). Ruling #96 accepted the run as valid (every
X-family gate PASSED at full scale) and the substantive H story as banked,
but named **two instrument defects** that make the four routing verdicts
un-actionable as *jurisdiction* answers:

* **DEFECT ONE — #96.3, the decision-vs-harm anchor tautology
  (commander-owned).** The frozen CLASS J test asked support-out fraction
  at the **excess-EVENT** time — where the HARM lands. But the jurisdiction
  question is where the mispriced **DECISION** was made. For event classes
  structurally outside open-owned play the event-time test **cannot return
  "no"**: an offside event has the ball in flight (`owner === null` ⇒ the
  V3-P1 predicate's `owner !== null` clause fails ⇒ support-out ≡ 1.0
  [1,1]); a restart onset is in the restart phase (`m.phase !== 'playing'`
  ⇒ support-out ≡ 1.0 [1,1]). Those two J verdicts are true-but-analytic.
  The rest limb's J (0.706, genuinely estimated) sits under the same gap —
  the abandonment DECISION is made in owned play, the harm lands in
  transitions — and under J-first precedence it masks a resolved H signal.
* **DEFECT TWO — #96.4, the delivery-detector internal inconsistency
  (implementation).** The mining-R0 delivery detector returned
  `nExcess = 0` over 800 matches while the **same run's** fresh reference
  (the same enriched-R0 world, 400 matches) measured **12.0825 [11.635,
  12.540]** build-ups/match (4,833 events). The UNROUTABLE verdict is
  vacuous — a straddle on zero events, not a substantive finding.

**P0b's whole job is to re-CLASSIFY on corrected instruments.** It builds
exactly two corrections and re-applies the (otherwise unchanged) routing
battery:

* **(a) DECISION-ANCHORED J** (#96.6(i)) — for the three R3 discipline
  limbs, move the CLASS J support test from the excess-EVENT moment to the
  anchor body's **most recent STATION-DECISION moment** (the tick the eye
  (re)computed that body's station target). This is where the mispriced
  decision was made; it un-tautologises offside and restart. Same CI form,
  same 0.5 threshold, same J-first precedence.
* **(b) THE EXPOSURE MAP** (#96.6(i)) — the **direct** jurisdiction fact:
  the fraction of ALL R3 eye station-decisions (consumptions of the table)
  occurring at out-of-support moments, broken down by phase and ball
  state, per side, with cluster CIs. A labelled descriptive output.
* **(c) THE DELIVERY DETECTOR FIX** (#96.6(ii)) — wire the working
  fresh-reference detection into the mining R0 arm, behind a pre-registered
  **magnitude sanity HARD gate**, so the delivery limb has a non-empty
  event population to route (A2 form, unchanged).

**It re-classifies ONLY.** It forces no body, prices nothing, builds no
consumer, ships nothing (Road B). Everything gate-bearing downstream still
runs fresh (V4-P1/P2/P4). P0's verdicts remain published as written.

---

## 2. The frozen quantities (no re-cutting after sight)

Per #80.2/I11: dispersion/extreme (lag-mass) statistics resolve by
**permutation null**; proportions and mean-difference contrasts resolve by
**match-cluster bootstrap CI** (#20) — never bootstrap-on-itself for a
dispersion statistic. The bootstrap/permutation seeds, resample counts,
lag bins, boundaries, `SUPPORT_MAJORITY = 0.5` threshold, the V3-P1
support predicate, and the cluster unit (the match seed) are **all
inherited verbatim from P0 §2.3/§3** and are NOT re-cut here
(`BOOTSTRAP_SEED = 97003`, `PERM_SEED = 97103`, `B = 2000`, bins
`[0,2)·[2,4)·[4,6)·[6,10)·[10,15)·[15,30)·[30,∞)`, face-matched
boundaries 10 s concede / 6 s score).

### 2.1 (a) THE DECISION-ANCHORED CLASS J — the operational definition per limb

**The observable — a "station-decision moment".** The armed eye commits a
body's station target for a window `W = EYE_W_S = 3.0 s`
(`EYE_W_TICKS = round(3.0 / DT) = 180` ticks; `src/ai/stationEye.ts:38`,
`src/ai/actionExecutor.ts:39`). A *decision* is taken for body `gid` at the
tick the eye writes a fresh commitment window into
`match.stationEyeState` — `state === undefined && isStation` ⇒
`stationEyeState.set(gid, { …, untilTick: simTick + EYE_W_TICKS })`
(`src/ai/actionExecutor.ts:758,795–802,854–862`). A prior window is torn
down and re-decided when it lapses (`simTick >= state.untilTick`,
`:676`) or on a perceived possession-face flip (`:684–693`). Therefore the
harness-observable **decision tick** for `gid` is the tick at which
`stationEyeState.get(gid).untilTick` takes a NEW value (equivalently
`decisionTick = untilTick − 180`). This is exactly the signal the P0 probe
already watches to reconstruct per-role decisions
(`scripts/probes/stage3-v4-p0-autopsy-map.ts:499–511`: `if (prev ===
st.untilTick) continue; … led.decisions += 1`). The eye is armed only on
R3, so decision moments exist only on the R3 mining arm — which is where
all three discipline limbs route.

**A tight decomposition property (load-bearing, and clean).** At a
decision the deciding body is by construction non-GK, non-sent-off,
non-owner, and in a STATION_FAMILY action (the eye-eligibility gate,
`actionExecutor.ts:669–674`; `isStation`). The V3-P1 support predicate
requires exactly `phase === 'playing' && owner !== null && non-GK &&
non-sent-off && non-owner && action ∈ STATION_FAMILY`
(`stage3-v4-p0-autopsy-map.ts:328–335`). So at a decision moment the ONLY
ways to be **out of support** are (1) `m.phase !== 'playing'` or (2)
`m.ball.owner === null`. The decision-anchored J and the exposure map
therefore measure precisely the jurisdiction leak — the eye consuming the
table when the world is not in the census's sampled open-owned-play state.

**Per-limb anchor body and the decision-anchored support test.** For each
excess event of a limb (populations UNCHANGED from P0 §2.3 / D5), bind it
to its anchor body's **most recent station decision at or before the event
time**, and evaluate the V3-P1 support predicate **at that decision tick**:

| limb (R3) | excess event (unchanged) | anchor body | decision-anchored support moment |
| --- | --- | --- | --- |
| **rest-defence slot** (DEGEN-RESTDEF, I5(b)) | index-1 own-third→out transition (`:569–579`) | the index-1 (non-GK) body, `index1Of(side)` (`:461–462`) | the index-1 body's most recent decision `≤ t_event` |
| **offsides** (C-OFFSIDE) | pass release flagged offside at kick (`:600–621`; `pp.offside`) | the **pass-target body** `m.allPlayers[pp.targetGid] ?? mostAdvancedNonOwner(side)` (`:614`) | the target body's most recent decision `≤ t_event` |
| **restart resettle** (C-RESTART) | restart-phase onset, `m.restart` null→non-null (`:623–631`) | **proposed: the index-1 body** `index1Of(side)` (the body P0's restart support already used, `:628`) — **FLAGGED, see below** | the index-1 body's most recent decision `≤ t_event` |

**The J statistic (form UNCHANGED).** Per match, the unit is
`{ out: #{anchored excess events whose decision moment fails the support
predicate}, total: #{anchored excess events} }`; the statistic is
`Σout / Σtotal`; the CI is the same match-cluster bootstrap proportion CI
(`supportOutCI`, `:729–737`); **J FIRES iff the CI lower bound > 0.5**;
**J-first precedence unchanged**. An excess event whose anchor body has
**no** prior station decision (e.g. a body that stayed in a ball-directed
job) is **UNANCHORED** — it is excluded from the J denominator and its
count/fraction is PUBLISHED per limb (mirrors the H test's
"no preceding anchor ⇒ dropped", `:844`). No lookback cap is imposed; the
anchor lag distribution (below) makes staleness visible.

**The anchor lag distribution (PUBLISHED per limb).** For every anchored
excess event, `lag = t_event − t_decision (≥ 0)`. Published per limb at
these **pre-named bins (frozen ex ante, #48.4)**:

```text
anchor-lag bins (seconds, event time − decision time):
  [0,1) · [1,2) · [2,3) · [3,6) · [6,10) · [10,∞)
  (W = 3.0 s is a bin edge; the tail bins expose stale anchors)
also published per limb: the median lag and the UNANCHORED count/fraction.
```

**⚠ FLAGGED — the restart anchor (interpretive choice; the exposure map is
the primary restart instrument).** For restart I propose the index-1 body
as the anchor (P0's restart support already keyed that body), but I flag
that the restart resettle defect is a **phase-level** fact, not a
per-body-decision fact: the #88.1 diagnosis is that `shapeReady`
(`src/ai/formations.ts:430–442`) releases only once the INCUMBENT
attacking shape is re-formed, so the game keeps re-restarting — a property
of the phase, not of one body's most-recent station decision. The
decision-anchored J for restart is well-defined but may be thin or stale
(a restart onset may have no recent open-play station decision for the
index-1 body). **I therefore conclude that restart's direct jurisdiction
evidence comes PRIMARILY from the exposure map** (§2.2) — specifically its
`phase = restart` row: the fraction of eye consumptions the eye actually
makes during restart phases (out-of-support by construction, but counted
as *real decisions the eye took*, not asserted analytically). The restart
decision-anchored J is REPORTED alongside, with its lag distribution and
unanchored fraction, for the commander; if it is under-powered/ambiguous
it reads as UNROUTABLE for restart and the exposure map governs the
adjudication.

**⚠ FLAGGED — H and S keep the EVENT-time anchor.** The decision-anchor
reframe replaces the **J** support test ONLY. CLASS H (mass-dominance
permutation) and CLASS S (stratified within-cell contrast) keep their P0
EVENT-time anchors verbatim (H is about *when the cost binds relative to
the event*; S is about *the realised outcome after the event*). Only the J
slot moves to the decision moment — consistent with #96.6(iii) "H and S
columns unchanged".

**⚠ FLAGGED — delivery keeps the A2 origination-moment J (no
decision-anchor).** The delivery limb routes on the **R0** side (A2), where
the eye is **null** and no station decisions exist. Decision-anchoring is
therefore INAPPLICABLE to delivery; its J slot stays the A2 form —
support-out fraction on the build-up **origination moments** (§2.3). The
decision-anchored reframe of (a) applies to the three R3 discipline limbs
only.

### 2.2 (b) THE EXPOSURE MAP — the direct jurisdiction fact (labelled, pre-named)

Over **every** R3 eye station-decision (each fresh `untilTick`, the
observable of §2.1, on the R3 mining arm — 800 matches), record at the
decision tick: `inSupport(m, body)`, `m.phase` bucketed **playing /
restart / other** (`kickoff`/`goalPause`/any non-playing non-restart), and
the **ball state** bucketed **owned / loose / in-flight**:

```text
ball state at the decision tick (implementable from harness observables):
  owned     := m.ball.owner !== null
  in-flight := m.ball.owner === null && ( m.pendingPass !== null
                 || (m.ball.vel.x^2 + m.ball.vel.y^2) > SPEED_GATE^2 )   [SPEED_GATE = 2.5]
  loose     := m.ball.owner === null && not in-flight
(SPEED_GATE + pendingPass are the SAME observables the P0 release ledger uses, :528)
```

The exposure map is: **the fraction of R3 eye consumptions occurring at
out-of-support moments, broken down by (phase × ball-state) cell, per
side, with match-cluster bootstrap CIs** (#20; `BOOTSTRAP_SEED = 97003`
family). Also published: the overall out-of-support fraction per side, and
the total decision count per cell (the exposure denominator). This is a
**descriptive, labelled output** (I7) — it carries no threshold and no
stop of its own; it is the direct measurement of the CLASS J estimand
("the consumer reads the table outside its sampled support"), and it is
what governs the restart adjudication (§2.1). By the decomposition
property (§2.1) every out-of-support decision falls into a `phase ≠
playing` or `ball ≠ owned` cell, so the map reads as a clean census of
*why* the eye leaves its jurisdiction.

### 2.3 (c) THE DELIVERY DETECTOR FIX + the magnitude sanity HARD gate

**The defect, precisely.** The fresh-reference detector counts a delivery
build-up on any increment of `longBalls + crosses + cutbacks`, with **no
phase/owner guard** (`stage3-v4-p0-autopsy-map.ts:972–977`) — this is the
working detector that measured 12.0825/match. The mining detector added
`&& playing && owner !== null` (`:637`); but a long-ball/cross/cutback
stat increments at the tick the ball is **struck**, when `owner === null`
(ball in flight) and often `phase !== 'playing'` — so the guard suppressed
essentially every event and yielded `nExcess = 0`. The fix: **the mining
R0 delivery detector adopts the reference detector's guard-free increment
condition** (`dNow > prevDelivery[side]`), so mining and reference count
the same events by the same rule.

**Delivery routing stays the A2 form (UNCHANGED):** excess-event
population = the R0 delivery build-ups; each build-up anchored at its
possession-spell origin (`spellStart[side]`, `:562–566,638`); the
time-to-cost curve = the **chain lag** from build-up origination to the
score-face value event (shots-for the delivering side; boundary 6 s per
A1); the CLASS S contrast = **wide-held vs central** stratified by
(context × role) of the build-up body (`:653–654`, D7); the CLASS J
support-out fraction on the **origination moments**; the
**DOWNSTREAM-WATCH** coverage flag per D8 (fraction of build-ups whose
origin state is already covered by another route's remedy — index-1 deep
∨ restart-adjacent ∨ a wide-held station; `:641–651`; cluster proportion
CI, lower > 0.5 ⇒ downstream-watch, REPORTED never a stop).

**⚠ FLAGGED — support evaluated at the ORIGINATION moment.** P0 anchored
the delivery event at `spellStart` but evaluated `inSup` at the kick tick
(`:651`) — harmless while `nExcess = 0`, wrong once events exist (at the
kick tick `owner === null` forces support-out ≡ 1). P0b evaluates the A2
support/contrast on the **origination moment** (the tick possession was
(re)gained, `spellStart`): the harness snapshots the origination-moment
support state (the V3-P1 predicate on the spell's ball-carrier / most
advanced non-owner body) and its (context × role) at each possession
(re)gain, and a build-up detected later in that spell inherits the spell's
origination support/context. This makes "support on origination moments"
(A2) faithful. Flagged as the executor's operationalisation.

**THE MAGNITUDE SANITY HARD GATE (frozen, explicit band).** With the fixed
detector, the mining-R0 total delivery build-up count over 800 matches
must land within **[0.5, 1.5] × (12.0825 × 800)**:

```text
12.0825 build-ups/match  ×  800 matches  =  9,666.0
magnitude band  =  [ 0.5 × 9,666 ,  1.5 × 9,666 ]  =  [ 4,833.0 ,  14,499.0 ]
  mining-R0 total build-up count  ∈  [4,833, 14,499]   ⇒  PASS
  outside the band                                     ⇒  INSTRUMENT FAIL, STOP at commander
```

Landmark (not the gate): the fresh reference's own banked total is 4,833
build-ups over 400 matches (= 12.0825 × 400), so a faithfully-fixed
detector over 800 matches should produce ≈ 2× that (≈ 9,666); the band
brackets that at ±50 %. A still-broken detector (≈ 0) fails the gate at
once. `12.0825` is the published fresh-reference point (P0 §RESULT / #96.5)
— a frozen constant here, not re-measured.

### 2.4 (d) H, S, the dominance rule, and UNROUTABLE semantics

**H and S columns UNCHANGED** (#96.6(iii)). CLASS H = the face-matched
mass-dominance permutation (A1: concede-face cost 10 s, score-face cost
6 s; single-boundary 6-for-all / 10-for-all readings published as labelled
data; `hTest`, `:853–888`). CLASS S = the stratified within-cell contrast
(R1/#94.3; `stratifiedContrastCI`, `:773–815`) with the raw-pooled
`sRawPooled` published non-gating. The delivery limb's H/S are **recomputed
once the fixed detector produces events** (they were null on `nExcess = 0`
in P0). Pre-named sub-states per limb unchanged (rest slot-held/abandoned;
offside beyond-line/onside; restart restart-adjacent/open; delivery
wide/central).

**THE DOMINANCE RULE — restated verbatim, with the NEW J statistic in the
J slot** (`decideRoute`, `:910–921`):

1. **Jurisdiction first.** If the (decision-anchored, for R3 limbs;
   A2-origination, for delivery) support-out CI lower bound > 0.5 → **J**,
   whatever the horizon reads.
2. **Resolvedly in support** (support-out CI upper bound < 0.5): decide H
   vs S by where the cost binds.
   * beyond-boundary mass dominates (perm p < 0.025) → **H**.
   * else within-cell contrast resolved at ≤ boundary (cluster CI excludes
     0) → **S**.
   * **BOTH fire** → **H dominates S** (H's criterion is mass-DOMINANCE, so
     H wins only when the majority of the cost is late — the strict special
     case; *interpretation, flagged in P0 §2.3 and carried here*).
3. **UNROUTABLE ⇒ STOP at the commander** iff EITHER the support-out CI
   straddles 0.5 (jurisdiction ambiguous — neither bound clears), OR the
   limb is in support but neither H nor S fires.

**UNROUTABLE semantics UNCHANGED** (#96.6(v)): the same straddle /
in-support-but-neither conditions; the same stop-at-commander disposition;
`routingComplete = allRoute && !anyUnroutable`.

### 2.5 (e) THE CORPUS — re-simulate the mining arm; reuse the banked reference

**Same deterministic re-simulation, same seeds, same arms (D1: R0 + R3).**
P0b re-simulates the P3a mining corpus byte-for-byte — seeds
`9,300,000 + blockIndex·100,000 + k` (4 × 200 = 800 / arm, R0 + R3), the
enriched #67.3 bundle, the injected canonical table `171a6dad…6559f` +
control `968349ff…acc1c` via `match.stationEye`. **X-CORPUS-IDENT (HARD),
identical FORM** to P0: recompute the committed P3a aggregates (the
DEGEN-RESTDEF per-side shares, C-OFFSIDE, C-RESTART, the §2 five, the
113,836-release ledger, per-role decisions/deviations, roleMixTV) to full
stored precision and re-verify the table/control SHAs; any mismatch ⇒
FAIL, STOP (the re-sim is then not the P3a corpus — V8/Node drift). The
new instruments (the exposure map, the decision-anchored J streams, the
fixed delivery detector) attach to this same re-simulation; the identity
gate proves the corpus is still the P3a corpus.

**The fresh reference is REUSED, not re-run — and this choice is FROZEN
here with reasoning.** P0b does **not** re-run the 400-match fresh
reference. Reasoning: (1) the fresh corpus is **unchanged** (same seeds
`9,700,000 + k`, enriched R0 eye-null) and its detector was already the
**working** guard-free one — so its banked delivery rate **12.0825
[11.635, 12.540]** (total 4,833; P0 §RESULT / #96.5(iii)) is already
correct and X-DET-verified; (2) the exposure map needs the **R3 mining
arm only** (the eye is armed only there); (3) the delivery magnitude gate
needs the **banked reference rate only** (§2.3), consumed as a frozen
constant. Re-running the reference would deterministically reproduce the
banked bytes at cost and add nothing. The four banked base rates (turnovers
51.335, near-line releases 44.1025, restart phases 12.6375, delivery
build-ups 12.0825) are carried forward from the P0 §RESULT unchanged; V4-P2
sizing still consumes them.

**Fidelity — X-DET on the P0b output.** The whole P0b output JSON must be
byte-identical across two invocations (the mining re-sim + all derived
instruments are deterministic; the reused reference enters as a frozen
constant, not a recomputation). X-DET on the *fresh reference corpus* is
inherited/banked from P0 (not re-run).

---

## 3. Staging (frozen)

| item | value |
| --- | --- |
| **mining corpus** | RE-SIMULATES the P3a seeds `9,300,000 + blockIndex·100,000 + k` (4 × 200 = 800 / arm, **R0 + R3**, D1); enriched #67.3 bundle; injected table `171a6dad…` + control `968349ff…`; **X-CORPUS-IDENT** vs the committed P3a aggregates (identical form) |
| **fresh reference** | **REUSED** (banked P0 §RESULT: `9,700,000 + k`, k ∈ 0..399; delivery rate 12.0825 [11.635, 12.540], total 4,833) — NOT re-run (§2.5) |
| decision anchor | most recent R3 station decision `≤ t_event` per anchor body; support at the decision tick (`decisionTick = untilTick − 180`) |
| exposure map | ALL R3 eye station-decisions × in/out-support × (phase: playing/restart/other) × (ball: owned/loose/in-flight) × side; cluster CIs |
| delivery gate | mining-R0 build-up count ∈ **[4,833, 14,499]** (= [0.5, 1.5] × 12.0825 × 800); HARD |
| cluster unit | the **match seed** (#20) |
| bootstrap / permutation | 2,000 resamples, `BOOTSTRAP_SEED = 97003` / `PERM_SEED = 97103` (inherited verbatim) |
| anchor-lag bins | `[0,1)·[1,2)·[2,3)·[3,6)·[6,10)·[10,∞)` s (frozen §2.1); + median + unanchored fraction per limb |
| receipts | per-record `{seed, tick, gid, cause}`, capped 1,000/class, first-N deterministic (#49.3) |
| output | `docs/world-model/data/stage3-v4-p0b-decision-anchor.json`, SHA'd, twice byte-identical (X-DET) |
| HEAD / flags | run states HEAD + the armed #67.3 bundle (#26.5); `src/**` byte-identical; fingerprint `57b0bdab…c673` |

**No sizing smoke, no new population floor.** The mining corpus is fixed
(the P3a 800/arm); the exposure map and lag distributions are REPORTED
descriptives (no gated floor — #19); the under-powered-published rule
(#24/#44.5) applies to any thin per-limb decision-anchored cell.

---

## 4. Deliverables + gates table

| deliverable | gate class | predicate / disposition |
| --- | --- | --- |
| **(a) decision-anchored J** per R3 limb (rest, offside, restart) + anchor-lag distributions + unanchored fractions | **ROUTING (substantive, stop-at-commander)** | support-out at the decision moment; J iff CI lower > 0.5; J-first; UNROUTABLE/ambiguous ⇒ STOP |
| **(b) the exposure map** | output (labelled, descriptive) | out-of-support fraction of R3 eye decisions × (phase × ball-state × side), cluster CIs; governs the restart adjudication |
| **(c) fixed delivery detector + A2 delivery route** | **DELIVERY MAGNITUDE (HARD)** + ROUTING | mining-R0 build-up count ∈ [4,833, 14,499] else FAIL/STOP; then A2 route (chain-lag, wide/central S, origination J, D8 downstream-watch) |
| **(d) H / S columns + the re-applied dominance rule** | output + ROUTING | H/S unchanged; delivery H/S recomputed on the now-nonempty population; the new J in the J slot |
| **(e) mining corpus identity** | **X-CORPUS-IDENT (HARD)** | re-sim aggregates reproduce the committed P3a JSON to full precision + table/control SHAs unchanged; any mismatch ⇒ FAIL, STOP |
| fidelity | **X-DET (HARD)** | P0b output twice byte-identical; output JSON SHA'd + quoted (fresh-reference X-DET inherited) |
| Road B | **X-SRC-ZERO (HARD)** | `git diff --stat -- src` empty; production fingerprint `57b0bdab…c673` unchanged; probe changes no `src/**` |

Any X-family or magnitude gate fails ⇒ FAIL, stop at the commander. **The
re-classification (routing verdicts) is the ONLY substantive output**; the
exposure map and lag distributions are labelled reference; every price
runs fresh downstream. Stop-at-commander semantics unchanged (#96.6(v)).

---

## 5. Pre-laid readings — the full sign space (#38.1; none re-cut after sight)

The re-classification may move any limb; no route is predicted.

* **(A) THE LIMBS RE-ROUTE OFF J — the design case.** With support tested
  at the decision moment, a limb whose eye-decisions were made in open
  owned play reads **in support** (support-out CI upper < 0.5) and routes
  by where the cost binds — **H** (late mass dominates; rest's banked
  beyondFraction 0.569 @10 s / 0.733 @6 s and offside/restart's already
  fire H at perm p = 0) or **S** (a resolved within-cell contrast; offside
  stratified −0.105 [−0.132, −0.077], restart −0.062 [−0.077, −0.047] both
  resolved in P0). Disposition: **return to the commander**; if every limb
  routes and the delivery gate passes, this licenses V4-P1.
* **(B) A LIMB STAYS J.** Its anchor bodies' decisions genuinely
  concentrate out of support (decision-anchored support-out CI lower >
  0.5) and/or the exposure map shows the eye consuming the table
  predominantly out-of-support for that limb's phase/ball-state cell. A
  genuine (non-analytic) jurisdiction finding. Disposition: routes J.
* **(C) A LIMB IS UNROUTABLE — the stage STOPS.** The decision-anchored
  support-out CI straddles 0.5, OR the limb is in support but fires neither
  H nor S, OR (restart) the decision-anchor is too thin/stale to resolve
  and the exposure map does not carry it. Disposition: **STOP at the
  commander** (#96.6(v)).
* **(D) THE DELIVERY GATE FAILS.** The fixed mining-R0 build-up count lands
  outside [4,833, 14,499]. Disposition: **INSTRUMENT FAIL, STOP** — the
  detector is still wrong; no delivery verdict is drawn.
* **(E) X-CORPUS-IDENT / X-DET / X-SRC-ZERO FAILS.** Non-identical re-sim,
  non-deterministic output, or any `src/**` touched / fingerprint moved.
  Disposition: **FAIL, STOP** — Road B and the labelled-fuel premise are
  the floor of every stage.
* **(F) A DECISION-ANCHORED CELL IS UNDER-POWERED / heavily UNANCHORED.**
  A limb's anchored excess population is too thin, or the unanchored
  fraction is large. Disposition: **published under-powered, never pooled**
  (#24/#44.5); if the thinness makes the limb ambiguous under the
  dominance rule, it reads as (C) UNROUTABLE and stops.

---

## 6. Registered non-claims

* **V4-P0b RE-CLASSIFIES ONLY.** P0's verdicts stay published, never
  overwritten (#96.6 — revert→reframe on instruments). P0b draws its own
  routes on the corrected instruments.
* **V4-P0b makes NO pricing claim and NO consumer claim.** It forces no
  body, prices no state, calibrates no surrogate, builds no merged scalar,
  no context extension, no in-support law. All pricing is V4-P1/P2/P3's,
  downstream, fresh.
* **The P3a corpus numbers stay LABELLED (I7 / #44.3).** The re-sim
  aggregates are re-derived only to prove identity (X-CORPUS-IDENT), never
  re-published as new findings. The reused fresh-reference rates are
  banked published constants, not re-measured.
* **The exposure map and anchor-lag distributions are descriptive
  reference**, not gate-bearing verdicts; only the re-classification
  (routing) is substantive.
* **Nothing ships (Road B).** Every EDS flag dormant in production,
  `c6Carry`/`c7Windup` probe-only, `stationEye` null, the fingerprint
  `57b0bdab…c673` unchanged, throughout the whole stage.
* **V4-P0b CANNOT authorize V4-P1.** Only the commander's review of this
  freeze opens V4-P1, and an UNROUTABLE limb (or a failed magnitude gate)
  stops the stage here.

---

## 7. Interpretive choices flagged for the commander (consolidated)

Every choice below is the executor's operationalisation where #96.6 froze
the FORM but not the last implementation detail; each is surfaced here and
will appear in the run's `deviations` block.

1. **The restart anchor body = the index-1 body, but the exposure map is
   restart's PRIMARY jurisdiction instrument** (§2.1). The restart resettle
   defect is phase-level (`shapeReady` reads the incumbent shape), not a
   single body's decision; the decision-anchored J for restart is reported
   with its lag/unanchored diagnostics but the `phase = restart` exposure
   cell governs the adjudication.
2. **H and S keep the EVENT-time anchor; only J moves to the decision
   moment** (§2.1) — per #96.6(iii) "H and S columns unchanged".
3. **Delivery keeps the A2 origination-moment J (no decision-anchor)**
   because the eye is null on R0 (§2.1/§2.3). The decision-anchor reframe
   is R3-only.
4. **Delivery support is evaluated at the ORIGINATION moment**, snapshotted
   at each possession (re)gain, not at the kick tick (§2.3) — fixing a P0
   latent bug that `nExcess = 0` had hidden.
5. **The fresh reference is REUSED, not re-run** (§2.5), with the frozen
   reasoning above; the delivery gate consumes 12.0825 as a banked
   constant.
6. **Ball-state buckets** (owned / loose / in-flight) use `SPEED_GATE`
   (2.5) + `pendingPass`, the same observables as the P0 release ledger
   (§2.2).
7. **UNANCHORED excess events** (no prior station decision for the anchor
   body) are excluded from the J denominator and published, mirroring the
   H test's unattributed-cost handling (§2.1).
8. **Support is read at the tick the fresh `untilTick` is first observed**
   (post-`step`), which is the decision tick modulo a deterministic ≤1-tick
   observation offset — negligible and X-DET-safe (§2.1).

---

## 8. Probe naming + the build sequence

The probe is **`scripts/probes/stage3-v4-p0b-decision-anchor.ts`**, built
**AFTER commander review** of this freeze (the standing freeze → review →
build → run pattern; §0.0 / #86.2). Command-line shape mirrors P0's (a
full detached run under the commander's resident session #49.5; capped
`V4P0B_CAP_MINE` / `V4P0B_OUT` smokes that write outside the repo and never
touch the canonical JSON). The canonical output
`docs/world-model/data/stage3-v4-p0b-decision-anchor.json` is written only
by the uncapped full run.

---

**FREEZE HONESTY.** Every criterion above was written citing ONLY
already-published sources — the P0 §RESULT (HEAD `b390cf9`, output SHA
`94cea3ce…a55603`), rulings #88–#96, the P0 pre-registration §§1–7 +
A1–A4, the v4 contract I1–I11, and a READ-ONLY reading of the P0 probe and
`src/**` mechanisms (file:line cited). **No `docs/world-model/data/*.json`
was opened and nothing was run before this document is committed.** This
freeze RETURNS TO THE COMMANDER; the probe is a future authorized step.

---

## §RESULT — the AUTHORIZED full run (#98): ALL FOUR LIMBS ROUTE (rest=H · offside=H · restart=J · delivery=S), delivery magnitude PASSES, the run RETURNS to the commander (§5 reading A/B)

Run to completion under the commander's resident session (#49.5), the
**frozen probe unchanged as reviewed** (§§1–8 + #96.6/#97/#98; no arm /
band / instrument / seed-block / anchor / routing criterion / gate re-cut
after sight). HEAD **`8784986`**; ENRICHED world, full #67.3 bundle armed
(`edsPerceivedDefence`+`edsPerceivedChoice`+`edsValueAxis`, `c5Hold`,
`c6Carry`, `c7Windup`; `c5TouchFork` off); `src/**` byte-identical —
**production fingerprint `57b0bdab…c673` unchanged** (X-SRC-ZERO PASS,
Road B held, nothing shipped). **Mining corpus: 800 × (R0, R3)** on seeds
`9,300,000 + blockIndex·100,000 + k` (deviation D1: R0+R3 only). **Fresh
reference REUSED (banked P0 constants, NOT re-run — §2.5 / #96.5(iii)):**
`9,700,000 + k, k ∈ 0..399`, 400 matches, delivery build-up rate 12.0825
[11.635, 12.54], total 4,833. Consumed table canonical SHA
**`171a6dad…6559f`** and control SHA **`968349ff…acc1c`**
(`tableShaOk`/`controlShaOk` true). Data:
[`data/stage3-v4-p0b-decision-anchor.json`](data/stage3-v4-p0b-decision-anchor.json)
· output SHA-256
**`e304d326dddd0657a6bd02d9768ce5669a6abbec67c1767dfd95c2e1876b3817`**
· `deterministic: true` (X-DET) · **verdict (verbatim): `ALL FOUR LIMBS
ROUTE + delivery magnitude PASS (§5 reading A/B) — RETURNS to the
commander; only the commander’s review (NOT this run) opens V4-P1 (§6)`**.

**The reading is (A/B) ALL FOUR LIMBS ROUTE** (§5): under the corrected
instruments each discipline limb lands in a class by the dominance rule —
rest-defence slot → **CLASS H**, offsides → **CLASS H**, restart resettle
→ **CLASS J**, delivery economy → **CLASS S**. The delivery magnitude HARD
gate PASSES (mining-R0 build-up population non-empty, within band). Every
X-family gate PASSES; `routing.allRoute = true`, `routing.anyUnroutable =
false`, `gates.routingComplete = true`. **This is a run fact returned to
the commander; adjudication (which route is authoritative per limb) is the
commander's separate ruling — not this document.**

### HARD GATES

| gate | result (JSON, as-is) |
| --- | --- |
| **X-CORPUS-IDENT** | **PASS** — `xCorpusIdent.pass: true`; `mode: "FULL: recomputed aggregates matched to committed P3a to full stored precision (6 dp)."`; **0 fails** (all 34 `checks[].ok` true); `tableShaOk: true`, `controlShaOk: true` (restDefence per-side, C-OFFSIDE, C-RESTART, the §2 band five, the 113,836-release ledger, per-role decision/deviation mixes, roleMixTV 0.6539) |
| **X-DET** | **PASS** — `fidelity.xDet: true`; whole-payload double-run byte-identical; output SHA-256 `e304d326…b3817` |
| **X-SRC-ZERO** | **PASS** — `fidelity.xSrcZero.srcDiffEmpty: true`; fingerprint baseline `57b0bdab…c673` = observed `57b0bdab…c673` (`matches: true`) — unchanged |
| **delivery magnitude** | **PASS** — `gates.deliveryMagnitude: true`; `observed = 9258` within the frozen band **[4833, 14499]** (center 9666, `refRatePerMatch 12.0825 × refMatchesScaledTo 800`, `enforced: true`); note: *"PASS: mining-R0 build-up count within [4833, 14499] — the guard-free detector produces a non-empty population."* |
| **routingComplete** | **true** (`gates.routingComplete: true`) — all four limbs routed |

### PER-LIMB ROUTING (from `routing.limbs`, all four)

**Support-out (decision-anchored for R3 limbs, origination-anchored for delivery/R0 — A2) + route:**

| limb | arm | prior | costFace | jAnchor | nExcess | support-out point [CI] | firesJ | route | routeReason (verbatim) | bothFired |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rest-defence slot (DEGEN-RESTDEF, I5(b)) | R3 | H | concede | decision-moment | 25,332 | 0.297963 [0.291530, 0.303968] | false | **H** | "beyond-boundary mass dominates (perm p<0.025)" | false |
| offsides (C-OFFSIDE) | R3 | S | concede | decision-moment | 5,306 | 0.363928 [0.350494, 0.377153] | false | **H** | "beyond-boundary mass dominates (perm p<0.025) AND within-cell contrast resolved — H>S on double fire" | true |
| restart resettle (C-RESTART) | R3 | J | concede | decision-moment | 9,757 | 0.513068 [0.502591, 0.523132] | true | **J** | "support-out CI lower > 0.5 (jurisdiction first)" | false |
| delivery economy (§2 band break) | R0 | H (+downstream-watch) | score | origination-moment | 9,258 | 0.380968 [0.367595, 0.395629] | false | **S** | "within-cell sub-state contrast resolved (CI excludes 0) at ≤ boundary; H does not dominate" | false |

**CLASS H — face-matched boundary + the single-boundary readings (labelled per A1; `beyondMass / withinMass`, `beyondFraction`, `permP (permValid)`, `firesH`):**

| limb | reading | boundary | beyond / within | beyondFraction | permP (permValid) | firesH |
| --- | --- | --- | --- | --- | --- | --- |
| rest-defence slot | face-matched (`h`) | 10 s | 18,113 / 13,712 | 0.569144 | 0 (2000) | true |
| rest-defence slot | `hSingle6` | 6 s | 23,342 / 8,483 | 0.733449 | 0 (2000) | true |
| rest-defence slot | `hSingle10` | 10 s | 18,113 / 13,712 | 0.569144 | 0 (2000) | true |
| offsides | face-matched (`h`) | 10 s | 19,662 / 1,942 | 0.910109 | 0 (2000) | true |
| offsides | `hSingle6` | 6 s | 20,904 / 700 | 0.967599 | 0 (2000) | true |
| offsides | `hSingle10` | 10 s | 19,662 / 1,942 | 0.910109 | 0 (2000) | true |
| restart resettle | face-matched (`h`) | 10 s | 23,535 / 3,178 | 0.881032 | 0 (2000) | true |
| restart resettle | `hSingle6` | 6 s | 25,876 / 837 | 0.968667 | 0 (2000) | true |
| restart resettle | `hSingle10` | 10 s | 23,535 / 3,178 | 0.881032 | 0 (2000) | true |
| delivery economy | face-matched (`h`) | 6 s | 6,619 / 2,397 | 0.734139 | **1 (2000)** | **false** |
| delivery economy | `hSingle6` | 6 s | 6,619 / 2,397 | 0.734139 | **1 (2000)** | **false** |
| delivery economy | `hSingle10` | 10 s | 5,451 / 3,565 | 0.604592 | **1 (2000)** | **false** |

(Delivery's `permP = 1` recorded as-is — beyond-boundary dominance present but the permutation test does not clear α, so H does not fire; it routes S.)

**CLASS S — stratified (gating) + raw-pooled (non-gating), from `s` and `sRawPooled`:**

| limb | s stratified point [CI] | resolved | nStrata | excludedEmptyStrata | sRawPooled point [CI] | resolved |
| --- | --- | --- | --- | --- | --- | --- |
| rest-defence slot | 0.001440 [−0.005702, +0.009144] | **false** | 12 | 0 | −0.099720 [−0.107884, −0.091890] | true |
| offsides | −0.105368 [−0.131694, −0.076506] | true | 28 | 4 | −0.042391 [−0.058585, −0.026102] | true |
| restart resettle | −0.061903 [−0.076741, −0.046513] | true | 12 | 0 | −0.127364 [−0.139066, −0.115965] | true |
| delivery economy | +0.631116 [+0.602350, +0.659614] | **true** | 45 | 3 | +0.810441 [+0.777196, +0.842993] | true |

**DECISION-ANCHOR statistics (per limb; `decisionAnchor`):**

| limb | anchored | unanchored | unanchoredFraction | medianLagS |
| --- | --- | --- | --- | --- |
| rest-defence slot | 25,332 | 0 | 0 | 1.05 |
| offsides | 5,306 | 0 | 0 | 1.016667 |
| restart resettle | 9,757 | 0 | 0 | 1.533333 |
| delivery economy | null | null | null | null (origination-anchored, eye null on R0 — not decision-anchored) |

**restart resettle — the flagged adjudication note (`adjudicationNote`, verbatim):**
*"FLAGGED #97.3(i): restart’s resettle defect is PHASE-level (shapeReady
reads the incumbent shape), not one body’s decision. This
decision-anchored restart J (index-1 anchor) is REPORTED
secondary/diagnostic with its lag + unanchored fraction; the exposure
map’s phase=restart cell is restart’s PRIMARY jurisdiction instrument and
GOVERNS the adjudication. If this J is thin/stale/ambiguous it reads
UNROUTABLE for restart and the exposure map governs."*

**delivery economy — the extra disposition (A2 / §2.3):** `route: S`;
`downstreamWatch: true`; `note` (verbatim): *"A2: routes on the
INCUMBENT/R0 side (guard-free build-ups; chain lag origin→shot-for; R0
ORIGINATION-moment contrasts/support — E6, NOT the kick tick where owner
is null). NOT decision-anchored (the eye is null on R0). Downstream-watch =
coverage by other routes’ remedies (D8) at the origin state, REPORTED
never a stop."*

### THE P0 ↔ P0b COMPARISON (both published side by side, labelled — #96.6 re-classify-only)

P0's verdicts stay published and byte-unchanged; P0b re-classifies under
the corrected estimand only. Event-anchored P0 support-out (committed
`stage3-v4-p0-autopsy-map.json` / the P0 §RESULT) next to P0b's
decision/origination-anchored support-out (this run). `nExcess` for the
three R3 limbs is identical across P0 and P0b (same excess events; only
the support-read MOMENT moved); delivery's population went 0 → 9,258 once
the guard-free detector was applied.

| limb | P0 event-anchored support-out [CI] | P0 route | P0b decision/origination-anchored support-out [CI] | P0b route | nExcess (P0 → P0b) |
| --- | --- | --- | --- | --- | --- |
| rest-defence slot | 0.705945 [0.699804, 0.711796] | **J** | 0.297963 [0.291530, 0.303968] | **H** | 25,332 → 25,332 |
| offsides | 1 [1, 1] | **J** | 0.363928 [0.350494, 0.377153] | **H** | 5,306 → 5,306 |
| restart resettle | 1 [1, 1] | **J** | 0.513068 [0.502591, 0.523132] | **J** | 9,757 → 9,757 |
| delivery economy | null [null, null] (`nExcess = 0`) | **UNROUTABLE** | 0.380968 [0.367595, 0.395629] (`nExcess = 9,258`) | **S** | 0 → 9,258 |

### THE EXPOSURE MAP (`exposureMap`; descriptive, I7 — GOVERNS the restart adjudication, #97.3(i))

`totalDecisions = 764,053`. Per side: **side 0** — 380,837 decisions,
out-of-support fraction 0.462972 [0.459502, 0.466349]; **side 1** —
383,216 decisions, 0.460409 [0.457016, 0.463824]. All 18 (phase × ball ×
side) cells:

| side | phase | ball | count | outOfSupportFraction point [CI] |
| --- | --- | --- | --- | --- |
| 0 | playing | owned | 204,545 | 0.000122 [0.000074, 0.000177] |
| 0 | playing | inflight | 122,677 | 1 [1, 1] |
| 0 | playing | loose | 460 | 1 [1, 1] |
| 0 | restart | owned | 0 | null [null, null] |
| 0 | restart | inflight | 0 | null [null, null] |
| 0 | restart | loose | 53,101 | 1 [1, 1] |
| 0 | other | owned | 15 | 1 [1, 1] |
| 0 | other | inflight | 3 | 1 [1, 1] |
| 0 | other | loose | 36 | 1 [1, 1] |
| 1 | playing | owned | 206,801 | 0.000102 [0.000063, 0.000145] |
| 1 | playing | inflight | 122,939 | 1 [1, 1] |
| 1 | playing | loose | 505 | 1 [1, 1] |
| 1 | restart | owned | 0 | null [null, null] |
| 1 | restart | inflight | 0 | null [null, null] |
| 1 | restart | loose | 52,924 | 1 [1, 1] |
| 1 | other | owned | 20 | 1 [1, 1] |
| 1 | other | inflight | 2 | 1 [1, 1] |
| 1 | other | loose | 25 | 1 [1, 1] |

`exposureMap.note` (verbatim): *"DESCRIPTIVE, labelled (I7): no threshold,
no stop of its own. The DIRECT measurement of the CLASS J estimand — the
fraction of R3 eye consumptions occurring out of the census sampled
support, by (phase × ball-state × side). By the §2.1 decomposition an
out-of-support decision falls in a phase≠playing or ball≠owned cell.
GOVERNS the restart adjudication (#97.3(i)): the phase=restart cell is
restart’s PRIMARY jurisdiction instrument. Cluster CIs,
BOOTSTRAP_SEED=97003 family."*

### TIME-TO-COST CURVES (recorded in the JSON, `timeToCostCurves`; descriptive, I7)

The per-limb, per-bin curves are recorded in full (each bin carries
`armMean`, `pairMean`, `excessDiff`, `ciLower`, `ciUpper`). Bin edges
(§2.5): `[0,2) · [2,4) · [4,6) · [6,10) · [10,15) · [15,30) · [30,∞)`.
Excess hazard `excessDiff` (R3 − paired R0) for the three discipline
limbs; delivery is R0-side value hazard (A2, no cross-arm pairing) so
`excessDiff` is null and its `armMean` is now POPULATED, per bin:

| limb | [0,2) | [2,4) | [4,6) | [6,10) | [10,15) | [15,30) | [30,∞) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| restSlot (excessDiff) | +0.29 | −0.94 | −1.0675 | −1.71625 | −1.29 | −1.0625 | −1.19625 |
| offside (excessDiff) | +0.0125 | −0.00375 | −0.21625 | −0.65625 | +0.03125 | +0.49625 | −1.03375 |
| restart (excessDiff) | −0.01125 | −0.1175 | +0.08125 | −0.21125 | −0.56625 | −2.0575 | −2.78625 |
| delivery (armMean; excessDiff null) | 0.80125 | 1.135 | 1.06 | 1.46 | 1.13875 | 1.87875 | 3.79625 |

`timeToCostCurves.note` (verbatim): *"DESCRIPTIVE (I7): form frozen;
numbers pin W_hold/W_long at V4-P2 (a fresh dataset). restSlot/offside/
restart = concede-surrogate hazard (R3−paired R0) per bin; delivery =
delivery-value hazard on R0 (A2), no cross-arm pairing."* Per-bin CIs are
recorded in the JSON.

### DEVIATIONS + REGISTERED NON-CLAIMS (recorded in the JSON)

The `deviations` field records ten items, keys/ids only: **E1**, **E2/§7.8**,
**E3/§7.1**, **E4/§7.7**, **E5**, **E6/§7.4**, **E7/§7.6**, **E8/§2.5**,
**§7.2**, **§7.3/§7.5** (full text verbatim in the JSON). The
`registeredNonClaims` field records six entries verbatim in the JSON
(re-classify-only; no pricing/consumer claim; P3a corpus stays labelled;
exposure map + anchor-lag are descriptive not gate-bearing; nothing ships,
Road B; V4-P0b cannot authorize V4-P1).

---

**All four limbs route (§5 reading A/B).** The run RETURNS to the
commander; only the commander's review opens V4-P1 (§6). Adjudication is
the commander's ruling in [`PROGRAMME-RULINGS.md`](PROGRAMME-RULINGS.md).
