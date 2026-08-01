# Stage III V4-P2b — The Region-Containment Hold (instrument-corrected occupancy census)

Status: **PRE-REGISTERED 2026-08-01, FROZEN BEFORE ANY RUN. FORCING (the
unilateral fork-and-hold, I4); zero `src/**`.** This is a FOCUSED AMENDMENT
pre-registration ordered by ruling **#106.5** (the V4-P2 adjudication). It
corrects the ONE named instrument defect of the V4-P2 run — the **statue
confound** (#106.3): the point-freeze enforcement (`forcedStation` steering the
held body toward a FIXED pitch point every tick, `ARRIVE_M = 2 m` arrival) priced
BEING A STATUE at a location against a control that plays dynamically, so every
resolved gating price came back NEGATIVE, dominated by dynamism loss, not by
location value. **V4-P2b re-prices the same held region classes with the statue
artifact removed**: the held body moves FREELY while inside its region class and
is steered back ONLY on leaving it. The estimand becomes REGION OCCUPANCY — the
hedge's true trade (attack displacement stays priced; that IS the hedge's cost
side).

**It changes nothing that shipped and nothing that was published**: the P2
§RESULT (reading A — the price surface, banked as the dynamism-value map,
#106.4) stays published, never overwritten (revert→reframe applied to
instruments — #106.5). **P2b INHERITS THE ENTIRE P2 PRE-REGISTRATION
([`STAGE3-V4-P2-OCCUPANCY-CENSUS.md`](STAGE3-V4-P2-OCCUPANCY-CENSUS.md) §§1–8 +
its committed §RESULT) VERBATIM; it amends ONLY the five items #106.5 names**
(§2 below). Everything not amended here binds P2b exactly as written for P2. Per
freeze honesty this doc cites ONLY already-published numbers — the P2 §RESULT,
rulings #88–#106 — and no `docs/world-model/data/*.json` is opened and nothing is
run before it is committed.

**This freeze RETURNS TO THE COMMANDER for review; the probe
(`scripts/probes/stage3-v4-p2b-region-hold.ts`) is a FUTURE authorized step**
(the standing pattern: freeze → review → build → run; §0.0 / #86.2). **V4-P2b's
null is a real finding that STOPS CLASS H at the commander**, and a REPEAT
all-negative-with-deep-worst surface routes CLASS H to the registered fallback
fork with the user (§6 / #106.6). P2b prices states; it builds no consumer, makes
no deployment claim, and ships nothing (Road B).

Authority: ruling **#106** (the V4-P2 adjudication: reading A publishes; the
all-negative sign structure diagnosed as the STATUE CONFOUND, **#106.3**; the
surface banked as the dynamism-value map, **#106.4**; **#106.5** V4-P2b ordered —
"the held body moves FREELY inside its region class (resolved at t_fork from the
same lattice geometry) and is steered back only upon leaving it; everything else
inherits P2 unamended … new seed bands: smoke 10.2M, census 10.3M; the estimand
becomes REGION OCCUPANCY"; **#106.6** the pre-named home for a repeat sign) · the
v4 design contract [`STAGE3-V4-LONG-HORIZON-PRICE.md`](STAGE3-V4-LONG-HORIZON-PRICE.md)
§2 CLASS H + §4 "V4-P2", invariants **I1–I11** (esp. **I4** unilateral
fork-and-hold, paired same-seed control, clone 100 %; **I8/#91** the incumbent
designation is never a priced state; **I11/#80.2** dispersion by permutation) ·
the P2 pre-registration **§§1–8 + its committed §RESULT** — **P2b INHERITS
EVERYTHING NOT AMENDED HERE** · #102.2 (the admitted calibration `deep 0.0435` /
`box 0.1952`) · #102.4 (`W_long` valid at 30 s, deep unresolved at 45 s) · #105
(the attainability-knee N re-pin — frozen HERE as the N rule) · #44.3/I7 ·
#46.2 · #48.4 · #49.3 · #26.5 · #67.3 · #80.2/I11 · #20 · #24/#44.5/#65 · #38.1
(full sign space) · Road B (nothing ships).

**World / HEAD / flags (#26.5 / #67.3).** Unchanged from P2: every census and
smoke match runs the **ENRICHED** eye-null #67.3 bundle — `edsPerceivedDefence +
edsPerceivedChoice + edsValueAxis` ON, `c5Hold`/`c6Carry`/`c7Windup` ON;
`c5TouchFork` off; `stationEye` NULL; **`Match.forcedStation`
(`src/sim/Match.ts:626`; `src/ai/actionExecutor.ts:639–649`) the ONLY forcing
seam, null in every production path**. In production every EDS flag defaults OFF,
`c6Carry`/`c7Windup` default `false`, `forcedStation`/`stationEye` null. **Zero
`src/**` changes; the production fingerprint `57b0bdab…c673` stays unchanged
throughout** (gate X-SRC-ZERO). The containment enforcement below uses the same
absolute-target seam — no `src/**` change (the seam already accepts a per-tick
target and a null).

---

## 1. What V4-P2b is (and is not)

V4-P2 priced held stations by forcing the body to a FIXED point and holding it
there. Its §RESULT (reading A) fired both frozen claims but every one of the 47
resolved gating prices was NEGATIVE (−0.010496 `middle/WG/high-central` …
−0.053118 `middle/DF/deep-wide`), deep-worst. Ruling **#106.3** diagnosed this as
the **statue confound**: the point-freeze prices immobility, not occupancy — the
control body plays dynamically and already does the long-horizon jobs, so the
paired difference reads dynamism loss + attack displacement, not the value of
BEING in a region. That surface cannot buy rest defence (its gradient pushes the
eye AWAY from deep stations), so running P3/P4 on it would prove a foreseeable
FAIL. It was banked as the **dynamism-value map** (#106.4).

**V4-P2b is CLASS H's remedy instrument re-cut at the enforcement seam only.** It
measures the same quantity P2 defined — the long-horizon goal-value price of
HOLDING a region — but the held body now moves FREELY (its own policy) while
INSIDE its frozen region class and is steered back toward the region ONLY when it
leaves. The frozen region class is resolved once at `t_fork` from the SAME
lattice-candidate geometry P2 used. The estimand is REGION OCCUPANCY: the body
lives in its region and does its normal job there, and the price is the change in
opponent entries against caused by keeping it in that region through the counter
window. Attack displacement stays priced (it is the hedge's real cost side); the
statue's dynamism penalty is removed.

It forces one body per fork (I4), prices held region classes only (#91, the
incumbent designation nowhere), and hands forward exactly what P2 did — the price
surface (→ V4-P3) or a STOP — plus the labelled P2↔P2b decomposition (§2.5).

**What P2b explicitly does NOT do** (all as P2 §6): it does not build the merged
consumer (V4-P3), calibrates nothing (consumes the #102.2 table frozen), does not
re-open the incumbent designation as a priced state (I8/#91), runs no battery,
makes no deployment claim, and ships nothing (Road B). It also does NOT re-cut any
P2 quantity other than the five in §2 — the sampling predicate, windows, cells,
floors, claims, statistics machinery, and every gate bind verbatim.

---

## 2. The AMENDED frozen quantities (only what #106.5 names; everything else = P2 verbatim)

### 2.1 (a) THE CONTAINMENT ENFORCEMENT — free-inside, steer-back-on-exit ⭐ (amends P2 §2.1)

The seam and the resolve-and-freeze are P2's, unamended: the held body is drawn
by the P2 predicate; the lattice candidate is resolved ONCE at `t_fork` in the
forced body's own attack frame (`stage3-v4-p2-occupancy-census.ts:363–369`,
`target = ball.pos + attackDir·cand.dx , cand.dy`), and its **frozen region class**
`R = depthBand × lateralBand` is computed on that resolved target
(`regionOf(mine.localX(target.x), target.y)`, `:174–176` / `:368`). The incumbent
designation enters nowhere (I8/#91). **What P2b changes is ONLY how the seam is
driven inside the hold window** — the re-assertion at
`stage3-v4-p2-occupancy-census.ts:399`, which in P2 unconditionally set
`fork.forcedStation = { gid, target: <the frozen point>, untilTick }` every hold
tick (the statue).

**The frozen containment rule.** Let `R` be the frozen region class (depth band
`D`, folded-lateral band `Λ`) resolved at `t_fork` — the SAME six-class geometry
as P2 §2.3 (`deep/mid/high` × `central/wide`, L/R folded by `|y|`; `depthOf`
`localX ≶ ±REST_THIRD`, `lateralOf` `|y| ≶ HALF_W/2`; `:174–175`). Each hold tick
`t ∈ [t_fork, holdUntilTick)` the probe computes the body's signed depth-into-`R`
distance `s(t)` in the body's own attack frame (`s ≥ 0` ⇔ inside `R`; `s` is the
min over the binding depth and lateral edges of the metres inside that edge,
negative if outside any edge) and drives a two-state hysteresis latch
`steering ∈ {true,false}` (init `false`):

```text
inRegion(t)  := depthOf(mine.localX(body.pos.x)) === D  &&  lateralOf(body.pos.y) === Λ    // s(t) ≥ 0
steering := false → true   iff  s(t) < 0                              // body has LEFT R (crossed the outer edge)
steering := true  → false  iff  s(t) ≥ HYSTERESIS_M                   // body is ≥ margin INSIDE R again
        // in the band s ∈ [0, HYSTERESIS_M) the latch HOLDS (Schmitt trigger) ⇒ the seam does not chatter at the edge

if (steering)  fork.forcedStation = { gid, target: reentry(t), untilTick: holdUntilTick }   // steer back toward R
else           fork.forcedStation = null                                                     // FREE: the body's own policy governs
```

* **The re-entry target `reentry(t)` (FROZEN rule) ⭐** = the nearest point of `R`
  **shrunk inward by `HYSTERESIS_M`** to the body's current position, computed by
  clamping the body's own-frame coordinates into the shrunk band and mapping back
  to absolute pitch coords via the same `mine.attackDir` / `mine.localX` frame the
  resolve-and-freeze uses: `localX` clamped into `[D`'s edges` ± HYSTERESIS_M]`,
  and `|y|` clamped into `[Λ`'s edges` ± HYSTERESIS_M]` **preserving `sign(body.y)`**
  (for `wide`, the NEAREST wing — no cross-pitch teleport; for `central`, toward
  the centre-line). Delivering the body to `s = HYSTERESIS_M` (the disengage
  threshold) means it is released the instant it is safely back inside. It is an
  ABSOLUTE target re-evaluated per steering tick (a "steer to the nearest boundary"
  law), reached by NORMAL LOCOMOTION, no teleport — deliberately NOT the v3
  ball-local `forcedStationPolicy`, and NOT P2's single frozen point.
* **`HYSTERESIS_M = 1.0 m` (FROZEN, flagged) ⭐** — a small margin: at the P2
  off-ball locomotion (~7 m/s, `DT = 1/60`) the body crosses 1 m in ≈ 8–9 ticks, so
  the latch cannot chatter tick-to-tick; and 1 m is ≪ every band half-width
  (`central` half-width `HALF_W/2 ≈ 10 m`; depth bands ≈ 21 m), so the effective
  region is not materially shrunk. It is HALF of P2's `ARRIVE_M = 2 m` and is an
  independent constant (`ARRIVE_M` is retired from the occupancy measure, §2.2).
* **Persistence through the possession flip (P2 verbatim).** Containment continues
  after the opponent wins the ball (`eBallWon` NON-terminal, P2 §2.1) — the body
  keeps living in its region through the turnover, which IS the rest-defence
  behaviour being priced. Terminal only on E-INJURY (`eSentOff`), E-BALL-ARRIVAL
  (`eCarrier`), E-ENDED (`eEnded`), exactly as P2.
* **Interrupt/receipt classes inherit P2 unamended**, with ONE entailed addition:
  on a FREE tick (`steering = false`, in-region) there is no forced target, so P2's
  clamp-trace `ok`/`eBarred`/`eOnside`/`unexplained` branch
  (`:423–436`) does not apply — such ticks are tallied under a new labelled
  diagnostic class **`free`** (in-region free movement, the intended behaviour).
  `ePaused`/`eCarrier`/`eBallWon`/`eSentOff` still fire on free ticks (a
  pause/turnover/injury is possession-driven, not steering-driven). Occupancy stays
  DECOUPLED from the per-tick class (P2 F2). ⭐ **FLAGGED — the `free` class** (a
  necessary consequence of the enforcement change, not a re-design).

The paired same-seed control (I4), clone coverage 100 %, and X-FORK-IDENT at
every moment are P2's, unamended: the control arm is the byte-identical unforced
continuation (`fork.forcedStation = null` throughout), and containment perturbs
only the treated arm's steering ticks. ⭐ **FLAGGED — the containment enforcement
(free-inside / steer-back-on-exit; the re-entry rule; the `HYSTERESIS_M = 1.0 m`
margin).**

### 2.2 (b) OCCUPANCY SEMANTICS — fraction of ticks INSIDE the region ⭐ (amends P2 §2.1)

P2 measured `occupancy = insideTicks / W_hold_ticks` with `insideTicks` counting
ticks the body was within `ARRIVE_M = 2 m` of the frozen POINT
(`stage3-v4-p2-occupancy-census.ts:406–407`, `:134`). **P2b redefines
`insideTicks` as the ticks the body is INSIDE its region class** — `inRegion(t)`
(§2.1), i.e. `depthOf(mine.localX(body.pos.x)) === D && lateralOf(body.pos.y) ===
Λ`. The divisor `W_hold_ticks` and the per-fork ratio (`:471`) are unchanged.
`ARRIVE_M` is RETIRED from the occupancy measure (region membership replaces the
2 m point test); it survives nowhere else in the estimand.

* **`OCC_FLOOR = 0.5` (FROZEN, UNCHANGED — no change argued).** A fork PAIR is
  ADMITTED iff (i) the treated arm was not terminated by E-INJURY or E-ENDED AND
  (ii) `occupancy ≥ OCC_FLOOR = 0.5` — the body was in its region for ≥ half the
  window. The floor still discriminates the never-arrived: a body whose region is
  unreachable (persistently clamped, or too far to enter within the window) spends
  its hold ticks OUTSIDE `R` and fails the floor, exactly the fork P2's floor was
  built to drop. I keep 0.5 unchanged; I do NOT lower or raise it. ⭐ **FLAGGED —
  the anticipated distribution SHIFT.** Containment is EASIER to satisfy than
  point-arrival (a whole ~20 m band vs a 2 m disc, and the body is actively steered
  back), so the occupancy distribution should shift UP versus P2 (P2 realized mean
  **0.486**, with **12,777** smoke pairs / **31,846** census pairs excluded by
  `occupancy < 0.5` as the DOMINANT exclusion, the histogram head **10,114** smoke
  pairs in `[0,0.05)` = far candidates never reached). The admitted share should
  rise materially. The sizing smoke RE-MEASURES the full occupancy distribution and
  the admit/exclude accounting, and the census output PUBLISHES the P2b-vs-P2
  occupancy comparison. **If the smoke shows occupancy piling near 1.0 so that
  `OCC_FLOOR = 0.5` admits nearly everything (containment almost always satisfied),
  that is a REPORTED observation, not a re-cut** — the floor stays 0.5 (frozen) and
  the accounting discloses it; the floor's only job is still to drop the
  never-in-region forks.

### 2.3 (c) THE N RULE — the frozen attainability knee (replaces the pooled-MDL formula) ⭐ (amends P2 §2.7)

P2 §2.7 pinned `N` from a pooled-price MDL formula (`N = min(⌈(1.96·σ̂/MDL)²⌉,
N_max)`, `stage3-v4-p2-occupancy-census.ts:864–875`). Its LETTER answer was
`N = 19`, which ruling **#105** diagnosed as MIS-TARGETED — it sizes the pooled
price the smoke already resolves, not the per-cell Claim-1/Claim-2 surfaces the
census actually gates on — and **re-pinned N to the attainability knee = 100**
(the door closed before the gate-bearing run, #62.3). **P2b learns from #105 and
freezes the attainability-knee rule NOW as THE N rule; the pooled-MDL formula is
NOT reused.**

**The frozen N rule.** From the sizing smoke's per-cell attainability curve — for
each candidate `N` on the 50-match grid, project each of the 72 cells' admitted
fork-pairs-per-match × `N` and count how many reach `CELL_FLOOR = 150`:

```text
grid        = { 50, 100, 150, … , N_max = 800 }                       (50-match steps, #105)
inPower(N)  = #cells whose (smoke admitted-pairs/match) · N ≥ CELL_FLOOR = 150
plateau     = max over the grid of inPower(N)                          (the attainable ceiling ≤ N_max)
N           = the SMALLEST grid N with  inPower(N) ≥ 0.95 · plateau    (the knee), capped at N_max = 800
```

(For calibration, P2's smoke curve was `19→20, 50→52, 100→55, 200→56`, plateau
56, `0.95·56 = 53.2` ⇒ the smallest 50-step N reaching ≥ 53.2 is **100** → 55/72
in-power; #105.) P2b's smoke re-measures its OWN attainability curve — containment
changes admission, so the curve WILL differ — and the knee rule re-derives `N`.
`N_max = 800` (FROZEN) caps it; the smoke's realized wall-cost × `N` is surfaced
to the commander for the feasibility off-ramp (P2 §2.7, unamended: a re-scope is a
commander decision at review, never a silent re-cut). ⭐ **FLAGGED — the N rule is
the attainability knee, not the MDL formula.** `CELL_FLOOR = 150`, `N_max = 800`,
and the "sizing before floors / publish-not-pool" discipline are P2's, unamended.

### 2.4 (d) SEED FAMILIES — new disjoint bands ⭐ (amends P2 §2.8)

Two NEW match-seed bands strictly above every consumed range (P2's smoke 10.0M
and census 10.1M reserved through `10,100,799`), with a 100 k gap, and two fresh
statistics seeds disjoint from P2's `99003`/`99103`:

```text
SMOKE     match seeds  10,200,000 + k,  k ∈ 0 .. 39            (40 matches; sizing only)
CENSUS    match seeds  10,300,000 + k,  k ∈ 0 .. N−1           (N ≤ N_max = 800 ⇒ max seed ≤ 10,300,799)
BOOTSTRAP_SEED   = 99203      (match-cluster bootstrap, #20 — replaces P2's 99003)
PERMUTATION_SEED = 99303      (the region/role SPREAD-S permutation null, #80.2/I11 — replaces P2's 99103)
avoided: every prior family through 9.9M (P0 9.3M/9.7M · P0b/P1 9.8M/9.9M · V3 9.1M–9.6M);
  P2's SMOKE 10.0M [10,000,000..10,000,039] and CENSUS 10.1M [10,100,000..10,100,799];
  the stats seeds 99003/99103 (P2), 98003/98203/98103 (P1), 91110 (V3-P1).
  10.2M (smoke) and 10.3M (census) lie ABOVE every consumed range and are mutually disjoint (100 k gap).
```

⭐ **FLAGGED — new bands 10.2M (smoke) / 10.3M (census); stats seeds 99203 /
99303**, all disjoint from the 9.x M / 97xxx / 98xxx families AND from P2's 10.0M/
10.1M/99003/99103, and mutually disjoint. The HARD seed-disjointness gate (§5)
now also asserts disjointness from P2's consumed 10.0M/10.1M/stat bands.

### 2.5 (e) THE LABELLED P2 ↔ P2b COMPARISON READ ⭐ (adds to P2 §4/§5)

The P2b census output publishes, **per in-power (context × role × region) cell,
the P2b region-containment price NEXT TO the P2 statue-price** — read from the
committed P2 census JSON `docs/world-model/data/stage3-v4-p2-occupancy-census.json`
(its published X-DET content SHA-256 **`3f332a8e…24a9`**, the probe's own
determinism hash embedded in the file; the whole-file hash differs by
construction), joined by the `(context, role, region)` key. Both prices, their CIs
and the **decomposition** `Δ_statue = price_P2b − price_P2` (the dynamism-loss
component the containment removes) are recorded per cell. This read is **LABELLED,
NON-GATING** (P2's committed data is quoted, never re-graded and never re-opened
as a gate); it makes the statue-vs-occupancy decomposition visible so the
commander can see whether removing the statue moves the sign. ⭐ **FLAGGED — the
labelled P2↔P2b decomposition (read from P2's published content SHA `3f332a8e…24a9`,
non-gating).**

---

## 3. What inherits P2 UNAMENDED (stated explicitly — everything not in §2)

Binding verbatim from [`STAGE3-V4-P2-OCCUPANCY-CENSUS.md`](STAGE3-V4-P2-OCCUPANCY-CENSUS.md):

* **Sampling (§2.2):** the own-possession face (`side = owner.side`); the V3-P1
  predicate (non-GK, non-carrier, non-sent-off, STATION-FAMILY); the stable
  non-owner rotation (never proximity/role); `MOMENT_SPACING_S = 4.0`; no per-match
  cap; `lastMomentTime` advances on every qualifying moment; one body per moment.
* **The non-terminal possession flip and ALL interrupt/receipt classes (§2.1):**
  `eBallWon` NON-terminal (hold continues through the turnover); `eSentOff`
  (E-INJURY) and `eEnded` (E-ENDED) terminal + **pair EXCLUDED, published, never
  zeroed**; `eCarrier` (E-BALL-ARRIVAL) terminal, admissible at `occupancy ≥ 0.5`;
  `ePaused` suspend/resume; receipts capped 1,000/class, first-N deterministic
  (#49.3) — plus the entailed `free` class (§2.1).
* **Outcomes (§2.4):** DEEP entry the GATING unit (calib **0.0435**, #103.3); BOX
  entry the LABELLED SECONDARY (calib **0.1952**), NEVER summed; the attack-face
  secondary (own entries FOR = the hedge's opportunity cost, labelled non-gating);
  `W_long = 30 s` primary, `{15 s}` sensitivity labelled, **45 s EXCLUDED** (#102.4);
  `W_hold = 15 s`; the P0b/P1 detectors verbatim (deep `oppOwns && localX < −REST_THIRD`;
  box `Match.inPenaltyBox`); the null→true entry-transition seeding across arms.
* **Cells + statistics (§2.6):** context (ball-third, 3) × role (4) × region-class
  (6) = **72 cells**; `CELL_FLOOR = 150`; Claim 1 (≥ 1 in-power cell price CI
  excludes 0) and Claim 2 (region/role SPREAD-S resolves) VERBATIM, incl. the
  separation machinery — the within-(match × context) label-permutation null ONLY
  (`PERM_B = 2000`, BH `q = 0.05`, #80.2/I11), never a bootstrap CI on the spread;
  per-cell prices by match-cluster bootstrap (`B = 2000`, #20); the pre-named null.
* **Gates:** X-FORK-IDENT at 100 % moment coverage; clone coverage 100 %
  (`clonesTaken == momentsForked`); X-DET (double-run byte-identical); X-SRC-ZERO
  (fingerprint `57b0bdab…c673`); publish-not-pool; the E-INJURY receipts convention.
* **N discipline:** the 40-match sizing smoke sizes the census; the smoke is
  labelled, non-gating, disjoint (only the N RULE it feeds changes, §2.3);
  `N_max = 800`; the feasibility off-ramp is a commander decision at review.
* **Non-claims (§6):** builds no consumer; prices only held lattice/region classes
  (#91); calibrates nothing; makes no deployment claim; nothing ships (Road B);
  P2b cannot authorize V4-P3.

---

## 4. Staging delta (only the changed rows; all else = P2 §3 verbatim)

| item | P2 | **P2b** |
| --- | --- | --- |
| hold enforcement | `forcedStation` → FIXED point every tick (statue) | **free inside `R`; steer back on exit** to `reentry(t)` (nearest point of `R` shrunk by `HYSTERESIS_M`); Schmitt latch (§2.1) |
| `HYSTERESIS_M` | — (n/a) | **1.0 m** (FROZEN) |
| occupancy | ticks within `ARRIVE_M = 2 m` of the frozen point | **ticks INSIDE the frozen region class** (`inRegion`); `ARRIVE_M` retired (§2.2) |
| `OCC_FLOOR` | 0.5 | **0.5 (unchanged)**; distribution expected to shift UP; smoke re-measures |
| N rule | pooled-price MDL formula (letter 19; #105 re-pin to 100) | **attainability knee**: smallest 50-step N with `inPower(N) ≥ 0.95·plateau`, cap `N_max = 800` (§2.3) |
| smoke seeds | 10,000,000 + k, k∈0..39 | **10,200,000 + k, k∈0..39** |
| census seeds | 10,100,000 + k, k∈0..N−1 | **10,300,000 + k, k∈0..N−1** (N ≤ 800) |
| bootstrap / permutation seed | 99003 / 99103 | **99203 / 99303** |
| comparison read | — | **per-cell P2b price beside P2 statue price** (from P2 SHA `3f332a8e…24a9`, labelled non-gating; §2.5) |
| output | `stage3-v4-p2-{sizing-smoke,occupancy-census}.json` | **`stage3-v4-p2b-sizing-smoke.json` / `stage3-v4-p2b-region-census.json`** |

Everything else in P2 §3 (duration `MATCH_DURATION = 240 s`; the seam identity;
own-possession sampling; `W_hold`/`W_long` 15/30 s; outcome units + calibrations;
72 cells `CELL_FLOOR = 150`; cluster = match seed; `B`/`PERM_B = 2000`, BH
`q = 0.05`; receipts; HEAD + armed flags + `stationEye` null + fingerprint) binds
P2b verbatim.

---

## 5. Deliverables + gates (P2 §4 verbatim; the only deltas listed)

All P2 §4 gates bind unchanged — **X-FORK-IDENT** (every moment, 0 mismatches),
**clone coverage** (`clonesTaken == momentsForked`), **X-DET** (census + smoke
twice byte-identical, SHA'd), **X-SRC-ZERO** (`git diff --stat -- src` empty,
fingerprint `57b0bdab…c673`), **seed disjointness** (now also asserting
disjointness from P2's 10.0M/10.1M/99003/99103), **E-INJURY receipts**,
**publish-not-pool**, **Road B**; **no X-CORPUS-IDENT** (a fresh forced-fork
corpus has no identity target). The **HYPOTHESIS gate** is P2's, verbatim: Claim 1
AND Claim 2 at the primary `W_long = 30 s`, gating unit DEEP; the null STOPS CLASS
H at the commander. Added deliverables (labelled, NON-GATING): the P2b-vs-P2
occupancy-distribution comparison (§2.2) and the per-cell P2↔P2b price
decomposition (§2.5). The price surface (admitted in-power cells) is the ONLY
substantive output.

---

## 6. Pre-laid readings + STOP RULES (P2 §5 verbatim + #106.6)

The full sign space and dispositions inherit P2 §5 (readings A–H) VERBATIM — the
design case (A) licenses the return to the commander for V4-P3; a flat priced
surface (B) or the null (D) STOP at the commander; separation-without-prices (C)
returns for adjudication; gate failure (E) is FAIL/STOP; under-power (F) is
published-not-pooled; infeasibility (G) is a commander re-scope; sensitivity
disagreement (H) is labelled. Claim 1, Claim 2 and the null are P2's, unchanged.

**Reading J — THE PRE-NAMED HOME FOR A REPEAT SIGN (#106.6, quoted verbatim):**

> if P2b's surface is STILL all-negative with deep worst, that is a REAL
> measurement (marginal region-occupancy during own possession does not pay in
> this world against incumbent dynamics) and CLASS H routes to the registered
> fallback conversation (pricing through selection / an A4 doctrine slice — a
> future contract) at the commander, with the user's eyes on the fork. No third
> instrument iteration without a ruling.

Disposition: if the removal of the statue does NOT move the sign — the resolved
gating prices remain negative with deep worst — **P2b returns the surface as a
REAL finding and CLASS H routes to the registered fallback fork at the commander
WITH THE USER** (the labelled P2↔P2b decomposition, §2.5, shows how much of the
sign the statue was carrying). **No third instrument iteration without a ruling.**
P2b makes no such decision itself; it records the reading and stops (it builds no
consumer).

---

## 7. Interpretive choices flagged for the commander (consolidated)

Each is the executor's operationalisation where #106.5 froze the FORM but not the
last detail; each will also appear in the run's `deviations` block.

1. ⭐ **THE CONTAINMENT ENFORCEMENT** (§2.1) — free inside `R`, steer back on exit;
   the seam and resolve-and-freeze are P2's, only the re-assertion at
   `p2:399` becomes conditional; zero `src/**` (the absolute-target seam already
   accepts a per-tick target and null).
2. ⭐ **THE RE-ENTRY STEERING RULE** (§2.1) — `reentry(t)` = the nearest point of
   `R` shrunk inward by `HYSTERESIS_M`, on the body's current wing (no cross-pitch
   teleport), recomputed per steering tick (a "steer to the nearest boundary" law),
   NOT the v3 ball-local policy and NOT P2's single fixed point.
3. ⭐ **THE HYSTERESIS MARGIN `HYSTERESIS_M = 1.0 m`** (§2.1) — a Schmitt latch
   (engage on exit at `s<0`, disengage at `s≥1 m`) so the seam does not chatter at
   the boundary; 1 m ≈ 8–9 ticks of travel and ≪ band widths, so `R` is not
   materially shrunk; = ½·P2's `ARRIVE_M`, independent constant.
4. ⭐ **OCCUPANCY = FRACTION OF TICKS INSIDE `R`** (§2.2) — region membership
   (`inRegion`) replaces P2's 2 m point test; `ARRIVE_M` retired from the estimand;
   the `W_hold_ticks` divisor unchanged.
5. ⭐ **`OCC_FLOOR = 0.5` KEPT UNCHANGED — NO change argued** (§2.2). The floor
   still drops the never-in-region forks; the occupancy distribution is expected to
   shift UP (containment easier than point-arrival); the smoke re-measures and the
   census publishes the P2b-vs-P2 accounting. A pile-up near 1.0 is a REPORTED
   observation, not a re-cut.
6. ⭐ **THE `free` CLASS** (§2.1) — free (non-steering) in-region ticks tallied as a
   new labelled diagnostic class; a necessary consequence of the enforcement change
   (no forced target ⇒ P2's clamp-trace branch is inapplicable), not a re-design.
7. ⭐ **THE N RULE = THE ATTAINABILITY KNEE** (§2.3) — smallest 50-step N with
   `inPower(N) ≥ 0.95·plateau`, cap `N_max = 800`; the pooled-MDL formula is NOT
   reused (learning from #105); the smoke re-measures its own curve.
8. ⭐ **NEW SEEDS — smoke 10.2M / census 10.3M / bootstrap 99203 / permutation
   99303** (§2.4), disjoint from every prior family AND from P2's 10.0M/10.1M/
   99003/99103, mutually disjoint.
9. ⭐ **THE LABELLED P2↔P2b DECOMPOSITION** (§2.5) — per-cell P2b price beside the
   P2 statue price (from P2's published content SHA `3f332a8e…24a9`), `Δ_statue =
   P2b − P2`; non-gating; makes the statue-vs-occupancy split visible.

---

## 8. Probe naming + the build sequence

The probe is **`scripts/probes/stage3-v4-p2b-region-hold.ts`**, built **AFTER
commander review** of this freeze (freeze → review → build → run; §0.0 / #86.2).
It is a near-total REUSE of `stage3-v4-p2-occupancy-census.ts`: the sampling loop,
fork machinery, clamp/interrupt accounting, X-FORK-IDENT, receipts, lattice,
`signatureOf`, enriched `CENSUS_FLAGS`, the P0b/P1 detectors + calibration table,
the cluster-bootstrap engine and the SPREAD-S permutation null, the smoke/census
modes and the cells/floors — all inherited. It CHANGES only: the hold re-assertion
at `:399` (→ conditional containment + the Schmitt latch + `reentry`); the
occupancy measure at `:406–407`/`:471` (→ region membership; `ARRIVE_M` retired,
`:134`); the N block at `:864–875` (→ the attainability-knee rule, §2.3); the seed
bases (→ 10.2M/10.3M) and stats seeds `:202`/`:204` (→ 99203/99303); the output
paths (→ `stage3-v4-p2b-*.json`) and `censusMaxSeed` base (`:979`). It ADDS: the
`free` diagnostic class and the labelled P2↔P2b comparison read (§2.5). Command
shape mirrors P2's: `V4P2B_MODE` an EXPLICIT required env var (smoke vs census, no
bare default, #101.2); the capped smoke (`V4P2B_OUT` outside the repo) sizes `N`
via the frozen knee rule; the census (commander's resident session, #49.5) writes
the canonical `docs/world-model/data/stage3-v4-p2b-region-census.json`.

---

**FREEZE HONESTY.** Every criterion above was written citing ONLY
already-published sources — the V4-P2 §RESULT (census content SHA-256
`3f332a8e…24a9`, HEAD `ca74014`: the 47-row negative price surface −0.010496…
−0.053118, the occupancy realizations mean 0.486 / exclusions 12,777 smoke &
31,846 census by `occupancy < 0.5` / histogram head 10,114, the attainability
curve `19→20, 50→52, 100→55, 200→56` plateau 56 ⇒ N=100, the stats seeds
99003/99103, the seed bands 10.0M/10.1M) and its committed pre-registration
§§1–8, ruling #106 (#106.3 statue confound, #106.4 dynamism-value map, #106.5 the
P2b order, #106.6 the fallback fork), #102.2/#102.4/#105, the v4 contract I1–I11,
and a READ-ONLY reading of `stage3-v4-p2-occupancy-census.ts` (line anchors cited:
the seam `:399`, occupancy `:406–407`/`:471`, `ARRIVE_M` `:134`, `OCC_FLOOR`
`:135`, the region geometry `:174–176`, resolve-and-freeze `:363–369`, the N block
`:864–875`, stats seeds `:202`/`:204`, `censusMaxSeed` `:979`) and `src/**`
mechanisms (`forcedStation` `Match.ts:626` / `actionExecutor.ts:639–649`, the
pitch geometry `constants.ts:34–37,55`). **No `docs/world-model/data/*.json` was
opened and nothing was run before this document is committed.** This freeze
RETURNS TO THE COMMANDER; the probe is a future authorized step.

---

## §RESULT — the AUTHORIZED runs (#108 launch): reading A — THE DESIGN CASE (§5-A) — the region surface lands (0 positive / 33 negative / 22 straddle) and RETURNS to the commander

Run to completion under the commander's resident session (#49.5), the **frozen
probe as reviewed** (pre-registration PASS #107; probe build PASS #108,
committed `179d40c`; gating unit = DEEP per #103.3; no instrument / window /
seed-block / floor / cell-grid / gate re-cut after sight). Two runs, seed
families disjoint (§2.4 / #46.2): the **sizing smoke** (40 matches
`10,200,000 + k, k∈0..39`, HEAD `69e7457`) realized the sizing inputs and
pinned the census N via the frozen knee rule; the census ran **N = 100 matches
`10,300,000 + k, k∈0..99`** at HEAD **`69e7457`**. ENRICHED eye-null world
(§0.0 / #67.3, `stationEye` NULL, `forcedStation` the only forcing seam);
`src/**` byte-identical — production fingerprint `57b0bdab…c673` unchanged
(X-SRC-ZERO PASS, Road B held, nothing shipped).

The census verdict (verbatim): **`CENSUS — DESIGN CASE (§5-A): ≥1 in-power cell
deep-price CI excludes 0 AND the surface separates by region and/or role —
RETURNS to the commander with the price surface; V4-P3 reads the in-power
cells. STOPS AT COMMANDER (P2 builds no consumer). [Claim1=true Claim2=true]
(the disposition is recorded; the DECISION is the commander’s — P2b builds no
consumer and stops here; a repeat all-negative-deep-worst sign routes CLASS H
to the #106.6 fallback fork at the commander).`** Reading code **A**.

### THE SIZING SMOKE (labelled, NON-GATING — §2.3 / #44.5 / #65)

40 matches on `10,200,000 + k, k∈0..39`, enriched eye-null, the full
fork-and-hold instrument with the region containment (§2.1), X-DET double-run,
written OUTSIDE the canonical corpus. Hard gates all green: **X-FORK-IDENT
2,001 checked / 0 mismatched** (100 % coverage), **clone 2,001 / 2,001**
(`clonesTaken == momentsForked`), **X-DET** true, **X-SRC-ZERO** (fingerprint
`57b0bdab…c673` = observed), **seed-disjoint** true (also asserting
disjointness from P2's 10.0M/10.1M/99003/99103). Coverage: 2,083 qualifying →
**2,001 moments** (**50.025 moments/match**), 82 ball-directed skipped, 38,019
forks; **admitted 25,391 / excluded 10,627** pairs.

Occupancy (mean **0.684944**, sd 0.286668, min 0, max 1): the predicted upward
shift is realized — vs **P2's §RESULT mean 0.486** (§2.2, the anticipated shift
from point-arrival to region-membership). The occupancy floor excluded **6,247**
pairs by `occupancy < OCC_FLOOR = 0.5`, admitted-by-occupancy 25,391; the
histogram head is **1,867 pairs in `[0,0.05)`** (P2's head was 10,114) and the
mass now piles high (5,798 in `[0.85,0.9)`, 5,254 in `[0.9,0.95)`). Schmitt
latch (§2.1): **engage 43,149 / disengage 12,537**; steer-ticks 23,816,709,
free-ticks 3,582,477 of 27,399,186 hold-ticks, **freeFraction 0.1308** (the
share of hold ticks the body governed itself). Exception-tick shares (of
27,403,620): `ok` 0.579156, **`free` 0.098845**, `ePaused` 0.154377, **`eBallWon`
0.149974** (the flip-non-terminal hedge behaviour at scale), `eOnside` 0.016728,
`eCarrier` 0.000307, `eEnded` 0.000162, `eSentOff` (E-INJURY) 10 ticks,
`eBarred` 0, **`unexplained` share 0.000450** (12,345 ticks).

Labelled context (non-gating): the pooled-MDL formula is RETIRED (§2.3 /
#107.2(vi)); pooled **deep hold-price −0.015301** (σ̂ 0.017559, 40 finite
matches), pooled **box hold-price −0.001491** (σ̂ 0.020345) are kept as
LABELLED CONTEXT only — they no longer gate N. Per-moment wall-cost **424.179 ms**
(848,785 ms / 2,001 moments; NON-deterministic, excluded from X-DET/SHA).

The N rule (frozen attainability knee, §2.3): the smoke's per-cell
attainability curve is `50→53, 100→56, 150→56, … , 800→56`, **plateau max 56**;
the rule = the smallest 50-step N reaching ≥ `0.95·56 = 53.2` in-power cells ⇒
**N = 100** (`50→53 < 53.2`), **56/72 in-power projected at N**. The **16
zero-admission cells** (`theirThird × {DF,MF,WG,ST} × {deep-central,deep-wide}`
and `ownThird × {DF,MF,WG,ST} × {high-central,high-wide}`) are DISCLOSED-DEAD
(#24): published, never run as gates. Smoke output SHA-256
**`c2bf25ce807c374d47b79789ad2f49e50ac2f5840089f8fecbc73e47eecf8c57`**. Smoke
verdict (verbatim, LABELLED — not a verdict): **`SIZING SMOKE — NOT a verdict
(§2.3, #44.5/#65): realizes occupancy, exception+latch shares, the attainability
curve, per-moment wall-cost and pins the census N via the FROZEN KNEE RULE
(labelled, non-gating). Pass nRule.N as V4P2B_N to the census.`**

### THE CENSUS (N = 100 @ 10.3M)

`matchCount = nCensus = 100`; seeds `10,300,000 + k, k∈0..99`; enriched
eye-null; `W_hold = 15 s` / `W_long = 30 s`; `OCC_FLOOR = 0.5`;
`CELL_FLOOR = 150`; cluster bootstrap `B = 2000`, `BOOTSTRAP_SEED = 99203`;
permutation `PERM_B = 2000`, `PERMUTATION_SEED = 99303`, BH `q = 0.05`. **Gating
unit = DEEP** (calib 0.0435, #103.3); box (calib 0.1952) = labelled SECONDARY.
HEAD **`69e7457`**. Coverage: 5,218 qualifying → **4,978 moments**, 240
ball-directed skipped, **94,582 forks**; **admitted 63,533 / excluded 26,071**
pairs. Per-moment wall-cost **427.461 ms** (2,127,900 instrument-ms / 4,978
moments; run total 2,130,235 ms; NON-deterministic). Census output SHA-256
**`6f1160f2bddc176a3140997053693efa6175267e92bf6005a227f0726f1f3460`**.

### THE CLAIMS (both read at the primary `W_long = 30 s`)

* **Claim 1 — NONZERO PRICES: `true`.** Note (verbatim): *"Claim 1 — NONZERO
  PRICES: ≥1 in-power cell has a DEEP-price match-cluster bootstrap CI (B=2000,
  seed 99203) excluding 0 (#103.3 gating unit)."*
* **Claim 2 — SEPARATION: `true`.** Note (verbatim): *"Claim 2 — SEPARATION:
  BH-significant SPREAD-S on ≥1 axis (region and/or role) by
  within-(match×context) permutation."* (`claim2Region = true`,
  `claim2Role = true`.)

**The separation block** (SPREAD-S = max−min of the deep-converted cell price
over in-power levels; within-(match×context) label permutation; `PERM_B = 2000`,
`PERMUTATION_SEED = 99303`, BH `q = 0.05`; never a bootstrap CI on S,
#80.2/I11):

* **REGION axis — 10 / 12 computable cells BH-significant** (raw-resolved 10,
  BH-resolved 10):
  `ownThird/DF` (S 0.030223, permP 0; argMax deep-central, argMin mid-central);
  `ownThird/MF` (S 0.031893, permP 0.003; argMax deep-central, argMin deep-wide);
  `ownThird/ST` (S 0.026237, permP 0.015; argMax mid-central, argMin deep-wide);
  `middle/DF` (S 0.026033, permP 0; argMax high-wide, argMin mid-wide);
  `middle/MF` (S 0.035198, permP 0; argMax mid-central, argMin deep-wide);
  `middle/WG` (S 0.042759, permP 0; argMax high-central, argMin deep-wide);
  `middle/ST` (S 0.029467, permP 0.0005; argMax deep-central, argMin deep-wide);
  `theirThird/DF` (S 0.038788, permP 0; argMax high-central, argMin mid-wide);
  `theirThird/MF` (S 0.021185, permP 0.0075; argMax mid-central, argMin mid-wide);
  `theirThird/ST` (S 0.023240, permP 0.002; argMax mid-central, argMin high-wide).
  The 2 non-significant: `ownThird/WG` (S 0.012322, permP 0.1265) and
  `theirThird/WG` (S 0.009113, permP 0.2385).
* **ROLE axis — 1 / 14 computable cells BH-significant:** `middle/mid-wide`
  (S 0.043049, permP 0; argMax ST, argMin DF). (raw-resolved 2 —
  `middle/deep-central` S 0.033191, permP 0.021, resolved but NOT BH-significant
  — BH-resolved 1.)

**Reading code A** — reading string (verbatim): *"DESIGN CASE (§5-A): ≥1
in-power cell deep-price CI excludes 0 AND the surface separates by region
and/or role — RETURNS to the commander with the price surface; V4-P3 reads the
in-power cells. STOPS AT COMMANDER (P2 builds no consumer)."*

### THE PRICE SURFACE (deep GATING price, goal-value; primary `W_long = 30 s`)

**In-power: 55 / 72 cells** (`CELL_FLOOR = 150`); **17 under-powered**
(published, never pooled, #24/#44.5). Of the 55 in-power, **AS A RUN FACT: 0
cells resolve POSITIVE, 33 resolve NEGATIVE** (deep-price CI excludes 0 with
point < 0) **and 22 are in-power but STRADDLE 0** (CI includes 0) — four of the
22 carry positive point estimates (`middle/ST/deep-central` +0.004587,
`theirThird/MF/mid-central` +0.012734, `middle/ST/high-central` +0.003434,
`middle/ST/high-wide` +0.003209), none resolving. The resolved gating prices
range **−0.014316 [−0.027766, −0.001554]** (`middle/MF/deep-central`,
least-negative) … **−0.050983 [−0.068973, −0.034293]** (`middle/WG/deep-wide`,
most-negative). The full resolved table, sorted least-negative first (deep price
point [cluster-bootstrap CI]; `Δ_statue = P2b − P2` deep, from the committed P2
census content SHA `3f332a8e…24a9`):

| # | context | role | region | admitted | deep GATING price [CI] | Δ_statue (deep) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | middle | MF | deep-central | 629 | −0.014316 [−0.027766, −0.001554] | +0.016502 |
| 2 | theirThird | WG | high-central | 1,560 | −0.015560 [−0.028642, −0.003177] | +0.010306 |
| 3 | ownThird | MF | deep-central | 1,977 | −0.016084 [−0.029090, −0.003793] | +0.025733 |
| 4 | theirThird | DF | mid-central | 508 | −0.017297 [−0.033566, −0.000680] | −0.001347 |
| 5 | middle | WG | mid-central | 2,860 | −0.017674 [−0.028221, −0.007454] | +0.002523 |
| 6 | middle | DF | high-wide | 670 | −0.017984 [−0.031229, −0.005215] | +0.031405 |
| 7 | middle | DF | high-central | 726 | −0.020132 [−0.035194, −0.005624] | +0.003581 |
| 8 | middle | DF | mid-central | 2,066 | −0.020360 [−0.033909, −0.007779] | +0.013125 |
| 9 | theirThird | WG | high-wide | 2,118 | −0.021421 [−0.035188, −0.007747] | −0.002699 |
| 10 | ownThird | ST | mid-wide | 285 | −0.023811 [−0.045515, −0.004743] | +0.014429 |
| 11 | middle | WG | mid-wide | 2,754 | −0.024467 [−0.034957, −0.013698] | +0.003407 |
| 12 | theirThird | ST | high-wide | 1,049 | −0.024715 [−0.046678, −0.002996] | −0.016842 |
| 13 | middle | ST | deep-wide | 542 | −0.024880 [−0.045829, −0.001724] | +0.022254 |
| 14 | ownThird | MF | mid-central | 461 | −0.025100 [−0.040781, −0.009767] | +0.011135 |
| 15 | middle | DF | deep-central | 694 | −0.025385 [−0.039720, −0.010859] | +0.008490 |
| 16 | middle | WG | high-wide | 1,145 | −0.027050 [−0.039625, −0.014308] | −0.013027 |
| 17 | middle | WG | deep-central | 1,247 | −0.028605 [−0.041319, −0.016098] | +0.013173 |
| 18 | ownThird | ST | deep-central | 2,086 | −0.031217 [−0.047683, −0.016313] | +0.004757 |
| 19 | middle | DF | deep-wide | 695 | −0.031420 [−0.049037, −0.015078] | +0.021698 |
| 20 | ownThird | WG | mid-central | 932 | −0.031692 [−0.046150, −0.017428] | −0.004308 |
| 21 | ownThird | WG | deep-central | 3,979 | −0.033595 [−0.044385, −0.022125] | +0.000692 |
| 22 | middle | MF | mid-wide | 1,740 | −0.033625 [−0.048275, −0.020053] | −0.000089 |
| 23 | ownThird | WG | mid-wide | 465 | −0.035829 [−0.062049, −0.009534] | +0.008150 |
| 24 | ownThird | ST | deep-wide | 1,833 | −0.036119 [−0.053616, −0.018153] | +0.003723 |
| 25 | ownThird | DF | deep-wide | 1,567 | −0.036532 [−0.054006, −0.020605] | +0.003681 |
| 26 | ownThird | MF | mid-wide | 238 | −0.036737 [−0.067828, −0.006605] | +0.010037 |
| 27 | ownThird | DF | mid-central | 345 | −0.039087 [−0.058175, −0.019240] | −0.016231 |
| 28 | middle | MF | deep-wide | 605 | −0.039617 [−0.060726, −0.019773] | +0.004279 |
| 29 | theirThird | DF | mid-wide | 475 | −0.043500 [−0.063195, −0.024364] | −0.016909 |
| 30 | ownThird | WG | deep-wide | 3,726 | −0.044014 [−0.053292, −0.034780] | +0.004921 |
| 31 | middle | DF | mid-wide | 2,018 | −0.044017 [−0.057430, −0.030891] | −0.005284 |
| 32 | ownThird | MF | deep-wide | 1,885 | −0.047977 [−0.064673, −0.031336] | −0.004056 |
| 33 | middle | WG | deep-wide | 1,122 | −0.050983 [−0.068973, −0.034293] | −0.004302 |

**The labelled P2↔P2b decomposition (§2.5, NON-GATING).** All **55 in-power
cells joined** against P2's committed census (content SHA `3f332a8e…24a9`,
`contentShaMatches: true`); `Δ_statue = P2b − P2` (deep) ranges **−0.016909**
(`theirThird/DF/mid-wide`, deepened) … **+0.052929** (`middle/ST/deep-central`,
P2b +0.004587 vs P2 statue −0.048342). **42 of 55 in-power cells move toward zero
(P2b less negative); 13 deepen.** The least-negative resolved cells carry the
magnitude shrinkage: `middle/MF/deep-central` **−0.014316** vs P2 statue
−0.030818 (Δ +0.016502); `theirThird/WG/high-central` **−0.015560** vs −0.025866
(Δ +0.010306); `ownThird/MF/deep-central` **−0.016084** vs −0.041817
(Δ +0.025733). The most-negative resolved cell instead deepened:
`middle/WG/deep-wide` **−0.050983** vs P2 −0.046681 (Δ −0.004302).

**Box secondary + attack-face secondary + `W_long = 15 s` sensitivity (labelled,
NON-GATING; 45 s excluded per #102.4).** Recorded per cell in the census JSON
(`boxPriceSECONDARY.{point,lower,upper,n}` — no `excludesZero`, never gates;
`attackFaceSecondary.{ownDeep,ownBox,n}`, the hedge's opportunity cost, never
netted; `sensitivity15sDeep`). Example rows: `middle/MF/deep-central` box
−0.002172 [−0.014600, +0.011839], ownDeep −0.026902 / ownBox −0.002793,
sens-15s −0.011826; `middle/WG/deep-wide` box −0.021225 [−0.033916, −0.008601],
ownDeep −0.023844 / ownBox −0.001392, sens-15s −0.033381;
`theirThird/WG/high-central` box −0.004254 [−0.013989, +0.006782], ownDeep
−0.012464 / ownBox −0.013013, sens-15s −0.002816.

### EXCLUSION / ADMISSION ACCOUNTING + RECEIPTS

Per-cell exclusion is recorded (`excluded.{injury,ended,lowOccupancy}`).
Census-wide the **26,071 excluded pairs** decompose as **low-occupancy 15,182
(dominant) + E-ENDED 10,872 + E-INJURY 17**; admitted 63,533 (sum over the 72
cells). Smoke-wide: admitted 25,391 / excluded 10,627 (occupancy-floor 6,247 +
terminal 4,380). **Free/steer tick shares (smoke):** freeFraction **0.1308**
(free-ticks 3,582,477 / hold-ticks 27,399,186); the `free` diagnostic class
0.098845 of exception ticks; steer-ticks 23,816,709 (latch engage 43,149 /
disengage 12,537). Receipts (§2.1 / #49.3, cap 1,000/class, first-N
deterministic): **census** — `eBallWon`/`unexplained`/`eOnside`/`ePaused`/
`eCarrier`/`eEnded` each capped at 1,000; `eBarred` 35; `eSentOff` (E-INJURY)
17. **Smoke** — `eCarrier`/`eOnside`/`eBallWon`/`unexplained`/`ePaused`/`eEnded`
each 1,000; `eSentOff` (E-INJURY) 10; `eBarred` 0. The smoke reports the
run-wide **unexplained hold-tick share 0.000450** (12,345 ticks); the census has
no separate exception-share block.

### HARD GATES

| gate | result (JSON, as-is) |
| --- | --- |
| **X-FORK-IDENT (census)** | **PASS** — 4,978 checked / 0 mismatched, 100 % coverage; control-fork `W_long` signature == independent plain step-through |
| **clone coverage (census)** | **PASS** — `clonesTaken 4,978 == momentsForked 4,978` (I4) |
| **X-DET (census)** | **PASS** — `xDet: true`; double-run byte-identical; SHA `6f1160f2…3460` |
| **X-SRC-ZERO (census)** | **PASS** — `srcDiffEmpty: true`; fingerprint baseline `57b0bdab…c673` = observed (`matches: true`) — unchanged |
| **seed disjointness** | **PASS** — census `[10,300,000, 10,300,799]` band, smoke `[10,200,000, 10,200,039]`, prior ceiling `9,999,999`; disjoint from every prior family AND from P2's 10.0M/10.1M/99003/99103, mutually disjoint |
| **X-FORK-IDENT / clone / X-DET / X-SRC-ZERO / disjoint (smoke)** | **PASS** (all; 2,001/0, 2,001/2,001, fingerprint unchanged, SHA `c2bf25ce…8c57`) |
| **X-CORPUS-IDENT** | **N/A** — `"N/A (a fresh forced-fork corpus has no identity target — as V4-P1)"` |

No X-family gate failed (smoke or census).

**Reading A (§5): the frozen claims fire and the surface returns to the
commander. The sign structure (zero positive-resolved cells) falls under the
pre-named #106.6 disposition — adjudication is the commander's ruling in
PROGRAMME-RULINGS.md.**
