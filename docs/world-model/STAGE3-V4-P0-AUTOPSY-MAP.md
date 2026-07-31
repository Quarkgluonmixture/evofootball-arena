# Stage III V4-P0 — The Autopsy Map (route the three fired limbs)

Status: **PRE-REGISTERED 2026-07-31, FROZEN BEFORE MINING. READ-ONLY,
zero `src/**`.** Nothing here prices anything, nothing forces a body,
nothing ships. This document freezes — **before a single P3a match is
re-simulated and before any `docs/world-model/data/*.json` is opened** —
the designation/machinery map's targets, the mining corpus and its
identity gate, **the routing criteria that send each fired limb to
exactly one mechanism class**, the fresh incumbent reference corpus, the
time-to-cost curve estimators, and every gate. **This freeze RETURNS TO
THE COMMANDER for review; the probe
(`scripts/probes/stage3-v4-p0-autopsy-map.ts`) is a FUTURE authorized
step** (the standing pattern: freeze → review → build → run; #86.2
sequence). **V4-P0 cannot authorize V4-P1** — only the commander's review
of this freeze can, and an UNROUTABLE limb stops the stage here.

Authority: the v4 design contract
[`STAGE3-V4-LONG-HORIZON-PRICE.md`](STAGE3-V4-LONG-HORIZON-PRICE.md) §4
"V4-P0" bullet (i)–(v), under invariants **I1–I11** — esp. **I7** (the
P3a corpus is LABELLED MINING FUEL, #44.3; no gate-bearing number quoted
from it; everything gate-bearing runs fresh), **I8** (no new gene /
attribute / percept channel; incumbent designations have exactly TWO
legitimate uses — the P0 reference map and the battery's verdict
instrument — and are NEVER a priced state or consumer input), **I11**
(dispersion/extreme statistics resolve by permutation null only, #80.2,
never bootstrap-on-itself) · **#90** (v4 launch; the three mechanism
classes H/S/J; routing by measurement; the named suspicions are priors,
never verdicts) · **#91** (the VISION audit: the designation anchor
removed; designations map only, never price) · **#88/#89** (the P3a
verdict and its corrected record — the three fired limbs and the delivery
economy collapse; the SLOT-ABANDONMENT finding) · #44.3 (labelled data) ·
#46.2 (seed disjointness) · #48.4 (windows/bins pinned ex ante) · #49.3
(per-record receipts) · #26.5 (state HEAD + armed flags; consumer world =
census world) · #67.3 (the enriched full bundle) · #80.2 (permutation for
dispersion/extremes) · #20 (CI / cluster = match seed) · #24/#44.5/#65
(sizing before floors; publish-not-pool) · #38.1 (full sign space +
E-INJURY) · Road B (nothing ships).

Parents reused unamended: the deployment battery stage doc
[`STAGE3-V3-P3A-DEPLOYMENT.md`](STAGE3-V3-P3A-DEPLOYMENT.md) (the arms
R0/R1/R2/R3, the ENRICHED flag bundle, the seed block, the instruments
I3/I5/I6/I7, the DEGEN limbs, and the published §RESULT aggregates this
freeze localises against); the V3-P1 role census
[`STAGE3-V3-P1R-... / STAGE3-V3-ROLE-EYE.md`] instruments and its
**sampling-support predicate** (quoted verbatim in §2.3, CLASS J); the P0
template form [`STAGE3-V3-P0-ROLE-MAP.md`](STAGE3-V3-P0-ROLE-MAP.md).

**World / HEAD / flags (#26.5 / #67.3).** Every re-simulation and the
fresh reference run the **ENRICHED** world — the #67.3 full bundle,
**copied verbatim from the P3a stage doc §3.2**:
`edsPerceivedDefence + edsPerceivedChoice + edsValueAxis` ON, `c5Hold`,
`c6Carry`, `c7Windup` ON; `c5TouchFork` **off**. The run states its HEAD
and armed flags. In production every EDS flag defaults OFF and
`c6Carry`/`c7Windup` default `false` — Road B intact; the enriched world
is probe-only staging. **Zero `src/**` changes; the production fingerprint
`57b0bdab…c673` stays unchanged throughout** (gate X-SRC-ZERO, §4).

---

## 1. What V4-P0 is (and is not)

V4-P0 is the **autopsy** of the P3a deployment failure. #88/#89 banked
that at full deployment (R3) three discipline limbs fire — the designated
rest-defence slot collapses 66.9%→46.7% (−30.2% rel, both sides),
offsides +22.8%, restart resettle +50.8% — and the §2 equilibrium band
breaks on the delivery economy (headers −44.9%, long balls −35.0%,
cutbacks −33.0%), while the pile-up disease is CURED (dispersal 到岗, not
扎堆). The contract's §2 diagnosis is that **these are not one disease**:
v4 freezes three mechanism classes H (hedge/horizon), S (state-blind), J
(jurisdiction/support). **V4-P0's job is to ROUTE each fired limb to
exactly one class BY MEASUREMENT, under criteria frozen in §2.3 BEFORE any
mining.** The named suspicions (rest slot + delivery → H, offsides → S,
restarts → J) are priors carried from the contract, **never verdicts**.

It is **read-only code archaeology + labelled-corpus mining + one fresh
descriptive census**. It forces no body, prices nothing, builds no
consumer. It hands four things forward and can stop the stage with a
fifth:

* **(a) → the whole of v4**: the designation/machinery map (file:line) —
  the P0 reference map, one of designations' two legitimate uses (I8).
* **(c) → V4-P1/P2/P3's class assignment**: the routing verdict per limb
  (H / S / J / downstream-watch), or **UNROUTABLE ⇒ STOP** (§6).
* **(e) → V4-P2's window freeze (I6)**: the time-to-cost curves, whose
  bins/windows pin W_hold and W_long at V4-P2 (a different dataset; the
  standing sizing-before-floors pattern).
* **(d) → V4-P2's sizing**: binding-moment base rates on a FRESH
  incumbent reference — the power arithmetic fuel.

**It cannot authorize V4-P1.** Only the commander's review of this freeze
can, and only if every limb routes.

---

## 2. The frozen quantities (no re-cutting after sight — §6)

### 2.1 (a) THE DESIGNATION / MACHINERY MAP — read-only, to file:line

The probe maps the world's OWN designation variables to `file:line` on a
pristine read of `src/**` (no execution needed for the map itself). This
is the P0 REFERENCE MAP — **per I8, incumbent designations have exactly
TWO legitimate uses: this reference map, and the battery's verdict
instrument (V4-P4's I5(b) designated-slot gate). They are NEVER a priced
state, never a consumer input, never smuggled into the value field**
(#91's violation). The starting anchors, already located read-only for
this freeze:

**The rest-defence assignment** (the battery proxied it with roster
index 1 — P3a probe `restSlotShare`, `deep.some((p) => p.index === 1)`,
`stage3-v3-p3a-deployment.ts:588`):

```text
src/sim/Player.ts:25            readonly index: number   (the roster slot; ROLES =
                                ['GK','DF','MF','WG','WG','ST'] ⇒ index 1 = the sole DF)
src/ai/formations.ts:169-183    formationSpot (table path): `if (p.index === 1 && p.role !== 'GK')`
                                — "the DF slot NEVER joins the siege"; depth = the coverBias
                                SWEEPER gene (Phase 88), −8..−16 m; this IS the rest-defence carve
src/ai/formations.ts:260-263    emergentStation (emergent path): the SAME `p.index === 1` carve
```

**The restart-station machinery** (the #88.1 diagnosis: `shapeReady`
reads the incumbent formation while the eye has bodies elsewhere, so the
game keeps re-restarting):

```text
src/ai/formations.ts:430-442    shapeReady(team, ball, radius=6) — the keeper waits for the
                                INCUMBENT attacking shape (formationSpot, hasBall=true) before
                                releasing a goal kick / held ball; ≥3 outfielders within 6 m of
                                their incumbent spots. The restart-resettle designation.
src/sim/Match.ts:484            phase: MatchPhase = 'kickoff'   (the phase machine)
src/sim/Match.ts:783-794        restart: RestartState | null; restartKickGid; restartKickKind;
                                kickoffKickGid  (the live dead-ball state)
src/sim/Match.ts:1160           if (this.phase === 'restart') this.stepRestart(dt)
src/sim/Match.ts:8, :59         cornerCrashSpots / fkWallSlots / RestartState / RestartKind imports
```

**The offside machinery** (CLASS S suspect; the eye pulls bodies off the
line):

```text
src/ai/formations.ts:466-480    offsideLineLocalX(team, opponents, ballLocalX) — 2nd-last opponent
src/ai/formations.ts:448-456    defenderLineLocalX
src/ai/formations.ts:490-504    runTarget — aims BEYOND the line; the executor holds at the line
src/ai/formations.ts:516-527    runBurstPoint — the burst the instant the kick releases the hold
                                (the offside-judgment call site + stats.offsides increment in
                                 Match.ts to be mapped by the probe)
```

The map is DELIVERED with these anchors verified and the offside-judgment
call site + `p.index`→role→slot binding completed. **No behaviour is read
or authored; designations are mapped, never priced.**

### 2.2 (b) THE MINING CORPUS — deterministic re-simulation of P3a

The committed P3a output (`data/stage3-v3-p3a-deployment.json`, file SHA
`7dee0f62…150b3`) is **AGGREGATE-ONLY**: per-match event streams were
never persisted. So limb-level mining = **DETERMINISTIC RE-SIMULATION of
the P3a arms from their exact frozen seeds and config**, with an
event-recording harness added to the probe. Same seeds + same flags +
byte-identical `src/**` ⇒ **byte-identical matches** — the recorded event
stream is a faithful decomposition of the exact matches P3a aggregated.

Re-simulation config, copied verbatim from P3a §2/§3 (nothing re-cut):

```text
arms         R0 (eye null) / R1 (one body, gid = 1 + matchSeed mod 5, side 0) /
             R2 (one team, side 0) / R3 (both) — all NEUTRAL (w_s = w_c = 0.5)
seeds        9,300,000 + blockIndex·100,000 + k,  blockIndex ∈ 0..3, k ∈ 0..199
             = 4 disjoint blocks × 200 = 800 matches/arm × 4 arms = 3,200 matches
             (the SAME 800 paired seeds every arm; range 9,300,000 .. 9,600,199)
flags        the ENRICHED #67.3 bundle (above); c5TouchFork off
injected     roleTable (canonical tableSha 171a6dad…6559f) + control (SHA 968349ff…acc1c),
             injected via match.stationEye = { arm:'neutral', scope, v3:{roleTable,control} }
             — NEVER bundled in src/**; the V3-P2 pattern
```

**X-CORPUS-IDENT (HARD identity gate).** The re-simulation MUST reproduce
the P3a run byte-for-byte. Because the per-match event streams were not
persisted, identity is verified by **recomputing the P3a AGGREGATES from
the re-simulation and matching them, to full stored precision, against the
committed `stage3-v3-p3a-deployment.json`**: every §RESULT limb value —
DEGEN-RESTDEF I5(b) (0.6688→0.4668 s0, 0.6718→0.4641 s1), C-OFFSIDE
(3.269→4.014), C-RESTART restart ticks (1722.0→2596.3), the §2 five
(goals/crosses/headers/long/cutbacks), the shape adjudicators, the
per-role deviation rates, the release ledger (113,836 releases,
eye-attributable 0) — and the injected `tableSha 171a6dad…` +
control SHA re-verified unchanged. **Any mismatch ⇒ the corpus is NOT the
P3a corpus (e.g. V8/Node trajectory drift — a known Node-vs-Node hazard);
mining is invalid; the stage STOPS at the commander.** The re-sim states
its HEAD; `src/**` is byte-identical to the P3a run's HEAD (Road B held
across every ruling since — X-SRC-ZERO, §4).

**LABELLED FUEL (convention #44.3 / I7).** This corpus is labelled mining
fuel. Mining may **localise and describe** where each limb fires in event
time (the routing measurements of §2.3, the time-to-cost curves of §2.5).
**NO gate-bearing verdict number may be quoted from it** — the routing
verdict is a CLASSIFICATION (which mechanism class), computed on the
labelled corpus by criteria frozen ex ante in §2.3; every gate-BEARING
PRICE runs fresh downstream (V4-P1 calibration, V4-P2 census, V4-P4
battery). P3a's aggregates stay labelled: they are re-derived only to
prove identity (X-CORPUS-IDENT), never re-published as new findings.

### 2.3 (c) THE ROUTING CRITERIA — FROZEN BEFORE MINING (the heart)

For each fired limb the probe computes a fixed test battery over the
limb's **excess-event population** — the events that, on R3 paired vs R0,
constitute the limb firing — and routes the limb to exactly ONE class of
the contract's §2 by the criteria below. **Every threshold, statistic and
CI/permutation form is fixed here ex ante.** Per house law #80.2/I11:
**dispersion/extreme (lag-mass exceedance) statistics resolve by
PERMUTATION null; proportions and mean-difference contrasts resolve by
match-cluster BOOTSTRAP CI (#20)** — never bootstrap-on-itself for a
dispersion statistic.

**The three class criteria (uniform form, applied to every limb):**

* **CLASS H — HEDGE / HORIZON.** The limb's cost binds at event-time lags
  **beyond the certified horizons** AND/OR only through **rare binding
  events**. Certified-horizon boundary = **10 s** (the concede-face
  horizon `H_CONCEDE`; the score face is 6 s). Statistic: the
  **beyond-10 s excess-cost mass fraction** — of the excess cost
  (concession surrogate: opponent deep entry / shot against; delivery
  goal-value for the delivery limb) accruing after each excess event,
  the fraction sitting in lag bins > 10 s vs ≤ 10 s (bins §2.5). H FIRES
  iff the beyond-10 s mass **dominates** the ≤10 s mass under a
  within-match label-permutation null (shuffle the excess-event label
  against cost-event times within each match, B = 2,000, frozen perm seed
  97103), **permutation p < 0.025** (#80.2). The "rare binding event"
  arm: if the per-excess-event binding rate (possession-loss→concede
  transition) is low but the conditional counterfactual damage is large,
  it reads as H via the same beyond-10 s test on the binding-event subset.

* **CLASS S — STATE-BLIND.** The cost binds **INSIDE 10 s** but existing
  census cells mix resolvedly-different sub-states. Statistic: the
  **within-cell sub-state contrast** — within each in-power
  `(context × role × candidate)` census cell, the realised-outcome
  difference between the limb's two resolved sub-states, **match-cluster
  bootstrap CI (#20, B = 2,000, seed 97003)**. S FIRES iff this contrast
  is resolved (CI excludes 0) at lag ≤ 10 s **while H does not dominate**.
  Pre-named sub-states per limb below (for offsides: **beyond-line vs
  onside sub-moments within the same context×role×candidate cell**,
  realised-outcome difference with cluster CIs — the contract's named
  CLASS S test).

* **CLASS J — JURISDICTION / SUPPORT.** The limb's excess events
  concentrate at moments **OUTSIDE the census's sampled support**.
  Support = the V3-P1 census sampling predicate, quoted verbatim from
  `scripts/probes/stage3-v3-p1-role-census.ts` (read READ-ONLY for this
  freeze):

  ```text
  a moment is IN SUPPORT iff, at that tick:
    m.phase === 'playing'                         (open play — NOT 'restart'/'kickoff'/'goalPause')
    && m.ball.owner !== null                      (ball is OWNED — not loose / in flight / being placed)
    && the sampled body is a non-GK, non-sent-off, non-owner outfielder
    && body.action.type ∈ { MoveToFormationSpot, HoldPosition, SupportBallCarrier,
                            MakeRun, MarkOpponent }   (the STATION FAMILY; ball-directed
                            jobs {ChaseBall, ReceivePass, InterceptPass} + the carrier EXCLUDED)
    context = face(ours|theirs) × ballThird(ownThird|middle|theirThird)
              × density(sparse|crowded: ≥2 non-GK bodies within 9 m of the sampled body)
  (source: stage3-v3-p1-role-census.ts:425-449, moment spacing 2.0 s; #77 V3-P1)
  ```

  Statistic: the **support-out fraction** — the proportion of the limb's
  excess events failing this predicate, **match-cluster bootstrap
  proportion CI (#20)**. J FIRES iff the support-out fraction's CI lower
  bound **> 0.5** (a majority resolvedly out of support — the consumer is
  reading the table by extrapolation).

**Per-limb excess-event populations and pre-named sub-states:**

| limb (P3a) | excess-event population (R3 vs R0) | cost / outcome | CLASS S sub-states | contract prior |
| --- | --- | --- | --- | --- |
| **rest-defence slot** (DEGEN-RESTDEF, I5(b)) | slot-abandonment transitions: the `p.index===1` body leaves the own-third (`localX < −REST_THIRD`) on R3 where R0 held it | concession surrogate (opp deep entry / shot against) by lag | slot-held vs slot-abandoned, within cell | **H** |
| **offsides** (C-OFFSIDE) | the extra offside flags on R3 vs R0 (bodies pulled off the line) | realised outcome after the pass-release-near-line moment | **beyond-line vs onside** run sub-moments, within cell | **S** |
| **restart resettle** (C-RESTART) | the extra restart-associated moments/ticks on R3 vs R0 (`shapeReady` re-restart loop) | concession surrogate by lag | restart-adjacent vs open sub-moments, within cell | **J** |
| **delivery economy** (§2 band break) | SUPPRESSED delivery build-ups: R0 launched a header/long-ball/cutback build-up, R3 did not | delivery-channel goal-value by lag | wide-held vs central sub-moments, within cell | **H** (+ downstream-watch) |

**THE DOMINANCE RULE (frozen; ordered precedence).** A limb may satisfy
more than one class; it is routed by this order:

1. **Jurisdiction first.** If the support-out fraction CI lower bound
   > 0.5 → **J**, whatever the horizon reads. (A consumer reading outside
   its sampled jurisdiction misprices by extrapolation; the in-support law
   is the remedy independent of horizon — contract §2 CLASS J.)
2. **Resolvedly in support** (support-out fraction CI upper bound < 0.5):
   decide H vs S by where the cost binds.
   * beyond-10 s mass dominates (perm p < 0.025) → **H**.
   * else within-cell contrast resolved at ≤10 s (cluster CI excludes 0)
     → **S**.
   * **BOTH fire** (beyond-10 s dominant AND a resolved within-cell
     contrast) → **H dominates S** — late-binding invisibility is the
     deeper defect and the CLASS H calibrated-long-window census subsumes
     the CLASS S context bit (a strict special case). *(Interpretation —
     flagged for the commander.)*
3. **UNROUTABLE ⇒ STOP at the commander** (§6) iff EITHER: the support-out
   CI straddles 0.5 (jurisdiction ambiguous — neither bound clears), OR
   the limb is in support but neither H (no dominant beyond-10 s mass) nor
   S (no resolved within-cell contrast) fires — the cost is neither late
   nor visible-but-averaged, so the three classes do not explain the limb.

**The delivery-economy limb — the extra disposition (contract §6).** In
addition to the H/S/J route, the probe computes a **DOWNSTREAM-WATCH**
flag: the co-occurrence fraction of suppressed delivery build-ups with
the other three limbs' excess events (temporally coincident within the
same possession spell), match-cluster bootstrap proportion CI. If that CI
lower bound > 0.5, the limb is flagged **downstream-watch** (no term of
its own; the battery decides — contract §6 registered possibility) rather
than carrying an independent class term. This flag is REPORTED alongside
the H/S/J route; it is not itself a stop.

**FREEZE HONESTY.** Every criterion above was written citing ONLY
already-published aggregates (the P3a stage doc §RESULT, rulings
#88/#89, the V3-P1 source predicate). **No `docs/world-model/data/*.json`
was opened and nothing was run before this document is committed.**

### 2.4 (d) THE FRESH INCUMBENT REFERENCE CORPUS — binding-moment base rates

A **fresh, incumbent-only** run (stationEye null; the enriched R0
baseline, i.e. the census world the eye consumes — NOT the shipped
flags-off world; consistent with P3a's X-OFF-IDENT two-pin logic)
provides the binding-moment base rates that fuel V4-P2's power arithmetic:

* **possession-loss transitions per match** (turnover events; the P3a
  probe already instruments own/their-third turnovers,
  `stage3-v3-p3a-deployment.ts:487`),
* **pass-release-near-line moments per match** (the offside binding
  moment),
* **restart phases per match** (distinct restart events — NOT restart
  ticks; the P3a 1722 ticks/match at DT = 1/60 ≈ 29 s of restart-state,
  so phases are far fewer),
* **delivery build-ups per match** (header/long-ball/cutback build-ups).

**Corpus size — 400 matches**, justified roughly off the P3a-published
per-match event scales (R0, enriched): offsides 3.269/match, headers
7.95, long balls 5.12, cutbacks 4.03/match, and the census station-family
scale ≈ 80 moments/match (V3-P0/P1). At 400 matches even the rarest of
these binding events (offsides, ≈ 3/match) yields ≈ 1,300 events —
ample for tight per-match-rate cluster CIs and for the V4-P2 census
budget arithmetic; the denser events (turnovers, station moments) yield
tens of thousands. *(400 is a freeze chosen from published aggregates —
flagged for the commander to adjust.)*

* **Seed family — 9,700,000 + k, k ∈ 0..399 (400 matches), DISJOINT from
  every family used so far (#46.2).** The seed walk this AVOIDS (from the
  P3a §3.1 walk + V3-P0/P1 blocks): P0 930k · P1 960k–1.46M · P1R
  980k–1.48M · P2-A 2.0M–3.2M · P2-B 3.5M–3.9M · C4/C5 700k–970k · C6
  4.0M–6.5M · C7 6.6M–7.1M · C5 re-census 8.29M–8.4M · C5-T2
  8.5M/8.51M/8.6M · V2-P0 8.70M/8.71M · V2-P1 8.80M/8.81M · V2-P2
  8.90M/8.91M · V2-P2R 9.00M/9.01M · V3-P0 smoke 9.10M / census 9.11M ·
  V3-P1 REUSES 9.11M · V3-P2 smoke 9.20M / payoff 9.21M · **V3-P3a
  9.30M–9.600199M (the mining corpus §2.2 REUSES these exact seeds
  deterministically — it is NOT a new family)**. **9,700,000 lies above
  every consumed range** (a 100k gap above P3a's 9.600199M).
* **X-DET (HARD).** Two `runReference()` invocations produce byte-
  identical output; the output JSON is SHA'd and the SHA quoted.
* **Estimators.** Per-match rates (event count / match); cluster unit =
  the match seed (#20); CIs = **2,000-resample match-cluster bootstraps,
  frozen `BOOTSTRAP_SEED = 97003`** (disjoint from 93003/92110/91110/
  91100/90730/79002/62003/50041); no bare means. Under-powered cuts are
  **published, never pooled** (#24/#44.5).

### 2.5 (e) TIME-TO-COST CURVE ESTIMATORS — form frozen ex ante (CLASS H)

For CLASS H routing and for V4-P2's window freeze (I6), the probe emits,
descriptively, the **event-time cost curve**: the excess outcome (hazard)
vs lag after each excess/binding event, at **lag bins pinned now**
(#48.4 spirit — bins pinned ex ante, never re-cut after sight):

```text
lag bins (seconds after the abandonment / binding event):
  [0,2) · [2,4) · [4,6) · [6,10) · [10,15) · [15,30) · [30,∞)
  (the 6 s score-face and 10 s concede-face horizons are bin edges;
   ">10 s" = the union of [10,15) ∪ [15,30) ∪ [30,∞) — the CLASS H region)
curve = excess concession-surrogate hazard (R3 minus paired R0) per bin,
        per limb; delivery limb uses excess delivery-goal-value hazard.
```

These curves are **DESCRIPTIVE outputs** (I7: labelled corpus ⇒ describe
only). Their FORM freezes here; the numbers are read at V4-P2
pre-registration to pin W_hold and W_long (a different, fresh dataset —
the standing sizing-before-floors pattern, I6). No floor freezes on the
labelled curve.

---

## 3. Staging (frozen)

| item | value |
| --- | --- |
| **mining corpus** (§2.2) | REUSES P3a seeds `9,300,000 + blockIndex·100,000 + k` (4×200 = 800/arm × 4 arms); enriched #67.3 bundle; injected table 171a6dad… + control 968349ff…; **X-CORPUS-IDENT** vs the committed P3a aggregates |
| **fresh reference** (§2.4) | seeds `9,700,000 + k, k ∈ 0..399` (400 matches); enriched R0 (eye null); **X-DET** double-run |
| duration | the default full match (no time knob touched) |
| cluster unit | the **match seed** (#20) |
| bootstrap | 2,000 resamples, frozen **`97003`** (fresh, disjoint from every prior seed) |
| permutation | 2,000 within-match label shuffles, frozen **`97103`** (#80.2; the H lag-mass test only) |
| receipts | per-record `{seed, tick, gid, cause}`, capped 1,000/class, first-N deterministic (#49.3) |
| output | `docs/world-model/data/stage3-v4-p0-autopsy-map.json`, SHA'd, twice byte-identical (X-DET) |
| HEAD / flags | run states HEAD + the armed #67.3 bundle (#26.5); `src/**` byte-identical; fingerprint `57b0bdab…c673` |

**No sizing smoke.** V4-P0 gates no NEW population floor: the mining
corpus is fixed (the P3a 800/arm), and the fresh reference's estimators
are REPORTED per-match rates, not gated floors (a reported quantity
carries no floor to pre-size — #19; the V3-P1/P3a precedent). The
under-powered-published rule (#24/#44.5) applies to any thin per-limb
routing cell.

---

## 4. Deliverables + gates table

| deliverable | gate class | predicate / disposition |
| --- | --- | --- |
| **(a) designation/machinery map** | output | file:line map delivered (§2.1); designations mapped, never priced (I8 two-uses stated) |
| **(b) mining corpus** | **X-CORPUS-IDENT (HARD)** | re-sim aggregates reproduce the committed P3a JSON to full precision + table/control SHAs unchanged; any mismatch ⇒ FAIL, STOP at commander |
| **(c) routing verdict per limb** | **ROUTING (substantive, stop-at-commander)** | each of {rest slot, offsides, restart, delivery} routes to exactly one of {H, S, J} (+ delivery downstream-watch flag) by §2.3; UNROUTABLE or ambiguous under the dominance rule ⇒ **STOP at commander** |
| **(d) binding-moment base-rate table** | output + **X-DET (HARD)** | per-match rates with match-cluster CIs; under-powered published, never pooled |
| **(e) time-to-cost curves** | output | descriptive, bins pinned §2.5; form freezes here, numbers pin W_hold/W_long at V4-P2 |
| **fidelity** | **X-DET (HARD)** | two runs byte-identical; output JSON SHA'd + quoted |
| **Road B** | **X-SRC-ZERO (HARD)** | `git diff --stat -- src` empty; production fingerprint `57b0bdab…c673` unchanged; probe changes no `src/**` |

Any X-family gate fails ⇒ FAIL, stop at the commander. **The routing
verdict is the ONLY substantive output**; every price runs fresh
downstream.

---

## 5. Pre-laid readings — the full sign space (#38.1; none re-cut after sight)

* **(A) ALL FOUR LIMBS ROUTE — the design case; licenses V4-P1.** Each
  limb resolves to exactly one class under §2.3 (delivery either H or
  downstream-watch), the base-rate table and curves are delivered, and
  every X-family gate passes. Disposition: **return to the commander;
  this reading licenses V4-P1** (the calibration). If the routes match
  the contract priors (rest+delivery→H, offsides→S, restarts→J), the
  autopsy confirms the mechanism-class design; if they differ, the
  measured route governs (the prior was never a verdict).
* **(B) A LIMB IS UNROUTABLE — the stage STOPS.** Any limb's support-out
  CI straddles 0.5, OR it is in support but fires neither H nor S.
  Disposition: **STOP OUTRIGHT at the commander** (§6 / contract §6) — a
  mechanism the three classes do not explain must be adjudicated before
  any instrument is built. No re-cut.
* **(C) X-CORPUS-IDENT FAILS.** The re-sim does not reproduce the
  committed P3a aggregates (V8/Node trajectory drift or a config slip).
  Disposition: **FAIL, STOP** — mining on a non-identical corpus is
  invalid; the labelled-fuel premise (I7) is void.
* **(D) AN X-DET / X-SRC-ZERO GATE FAILS.** Non-deterministic output, or
  any `src/**` touched / fingerprint moved. Disposition: **FAIL, STOP** —
  Road B is the floor of every stage.
* **(E) A ROUTING CELL IS UNDER-POWERED.** A limb's excess-event
  population (or a within-cell S contrast) is too thin to resolve.
  Disposition: **published under-powered, never pooled** (#24/#44.5); if
  the thinness makes the limb ambiguous under the dominance rule, it
  reads as (B) UNROUTABLE and stops.

---

## 6. Registered non-claims

* **V4-P0 makes NO pricing claim.** It forces no body, prices no state,
  calibrates no surrogate. All pricing is V4-P1/P2's, downstream, fresh.
* **V4-P0 makes NO consumer claim.** No merged scalar, no context
  extension, no in-support law is built here; those are V4-P3's.
* **The routing verdicts are V4-P0's ONLY substantive output.** The
  designation map, the base-rate table and the time-to-cost curves are
  reference/fuel; the map's designations are the reference map (I8), never
  a price.
* **The P3a corpus numbers stay LABELLED (I7 / #44.3).** Mining localises
  and describes; no gate-bearing number is quoted from the labelled
  corpus. P3a aggregates are re-derived only to prove identity, never
  re-published as new findings.
* **Nothing ships (Road B).** Every EDS flag dormant in production,
  `c6Carry`/`c7Windup` probe-only, `stationEye` null, the fingerprint
  `57b0bdab…c673` unchanged, throughout the whole stage.
* **V4-P0 CANNOT authorize V4-P1.** It hands (a)/(c)/(d)/(e) forward;
  only the commander's review of this freeze opens V4-P1, and an
  UNROUTABLE limb stops the stage here.

---

## 7. Commander review amendments (ruling #93, 2026-07-31 — applied at
review, BEFORE any probe was built or any datum seen; these amendments
ARE part of the freeze)

* **A1 — THE H BOUNDARY IS FACE-MATCHED (amends §2.3 CLASS H).** An
  excess-cost event inherits the face of its outcome channel:
  concession surrogates (opp deep entry / shot against) → concede
  face, boundary **10 s**; score/delivery-value surrogates → score
  face, boundary **6 s** (a bin edge, §2.5 — no re-binning). The H
  mass-dominance permutation test uses the face-matched boundary per
  cost event; the single-boundary readings (6-for-all, 10-for-all)
  are additionally PUBLISHED as labelled data. Rationale: the
  contract's "beyond the certified horizonS" is plural — a score-face
  cost in (6, 10] is invisible to the certified 6 s score face and
  must count as beyond-horizon. (The executor flagged this; the
  10-s-only reading under-fires H for score-face limbs.)
* **A2 — A SUPPRESSION LIMB ROUTES ON THE INCUMBENT SIDE (amends
  §2.3's delivery row).** Tick-level cross-arm counterfactual
  detection ("R0 launched, R3 did not") is DROPPED — after trajectory
  divergence it is ill-defined. For the delivery limb the routing
  evidence is measured WHERE THE JOB IS PERFORMED (the R0 side):
  excess-event population = R0's delivery build-ups; time-to-cost
  curve = the chain lag from build-up initiation (the origination
  moment) to the value event (delivery → box entry / shot / goal);
  the S contrast (wide-held vs central) and the J support-out
  fraction run on those R0 moments. The cross-arm deficit remains the
  published battery number — routing asks what KIND of value the job
  carries, a property of the job. **DOWNSTREAM-WATCH re-grounded**:
  the fraction of R0 delivery build-ups initiating from states
  already covered by the other routes' remedies (wide-held stations →
  the H census's wide-held cells; restart-adjacent shape → J; the
  rest-slot body deep → the H deep-held cells), match-cluster
  proportion CI; lower bound > 0.5 ⇒ downstream-watch. Threshold and
  reported-not-stop semantics unchanged.
* **A3 — THE DESIGNATION-USE BOUNDARY RESTATED (ratifies §2.3's rest
  row under I7/I8).** `p.index===1` defining the rest-defence limb's
  excess population is WITHIN the battery-verdict-instrument use (the
  limb IS defined by I5(b); localising it requires its definition).
  The boundary: a designation may define a LIMB's event population
  for routing; it may NEVER key a priced cell or enter a consumer.
* **A4 — RATIFIED AS FROZEN**: the ordered dominance rule including
  H > S on a double fire (coherent because H's criterion is
  mass-DOMINANCE — H only wins when the majority of the cost is
  late); the 400-match fresh corpus on seeds 9,700,000+ (bootstrap
  97003 / permutation 97103); X-CORPUS-IDENT as aggregate-recompute
  to full stored precision + input-table/control SHA equality (the
  determinism argument carries byte-identity; a Node/V8 drift TRIPS
  the gate and stops the stage — the correct failure mode); the
  enriched-R0 (#67.3, eye null) reference world; the #80.2 scope
  reading (permutation for the lag-mass exceedance; cluster bootstrap
  for proportions/contrasts).

---

## §RESULT — the AUTHORIZED run (ruling #95): ROUTING VERDICTS LAND — three limbs route to J, the delivery limb is UNROUTABLE, the stage STOPS at the commander (frozen reading B)

Run to completion under the commander's resident session (#49.5), the
**frozen probe unchanged as amended** (§§1–7 + the #93 A1–A4 amendments +
the #94/#95 R1 review-fix; no arm / band / instrument / seed-block /
routing criterion / gate re-cut after sight). HEAD **`b390cf9`**; ENRICHED
world, full #67.3 bundle armed (`edsPerceivedDefence`+`edsPerceivedChoice`+
`edsValueAxis`, `c5Hold`, `c6Carry`, `c7Windup`; `c5TouchFork` off);
`src/**` byte-identical — **production fingerprint `57b0bdab…c673`
unchanged** (X-SRC-ZERO PASS, Road B held). **Mining corpus: 800 × (R0, R3)**
on seeds `9,300,000 + blockIndex·100,000 + k` (deviation D1, #94.2:
R0+R3 only — every routing test is R3-vs-R0). **Fresh reference: 400
matches** on `9,700,000 + k, k ∈ 0..399`, enriched R0 (eye null), X-DET
double-run byte-identical. Consumed table canonical SHA **`171a6dad…6559f`**
and control SHA **`968349ff…acc1c`** (both re-verified unchanged;
`tableShaOk`/`controlShaOk` true). Data:
[`data/stage3-v4-p0-autopsy-map.json`](data/stage3-v4-p0-autopsy-map.json)
· output SHA-256 **`94cea3ced9b4fdcdd91960496148f493d8096814d15a492612e7d30ec2a55603`**
· `deterministic: true` (X-DET) · **verdict: `STOP AT COMMANDER — a limb
is UNROUTABLE (§6 / reading B)`**.

**The reading is (B) A LIMB IS UNROUTABLE** (§5/§6): all three discipline
limbs — rest-defence slot, offsides, restart resettle — route to **CLASS J**
by the dominance rule (jurisdiction first: support-out CI lower bound
> 0.5); the **delivery-economy limb is UNROUTABLE** (its excess-event
population on the A2 R0 routing side is empty ⇒ the support-out CI
straddles 0.5). Every X-family gate PASSES; `routingComplete = false`;
`routing.allRoute = false`, `routing.anyUnroutable = true`.

### HARD GATES

| gate | result (JSON, as-is) |
| --- | --- |
| **X-CORPUS-IDENT** | **PASS** — `mode: "FULL: recomputed aggregates matched to committed P3a to full stored precision (6 dp)."`; `tableShaOk: true`, `controlShaOk: true` (every checked field `ok: true` — restDefence per-side, C-OFFSIDE, C-RESTART, the §2 five, the 113,836-release ledger, per-role decision mixes, roleMixTV 0.6539) |
| **X-DET** | **PASS** — `fidelity.xDet: true`; two runs byte-identical; output SHA-256 `94cea3ce…a55603` |
| **X-SRC-ZERO** | **PASS** — `srcDiffEmpty: true`; fingerprint baseline `57b0bdab…c673` = observed `57b0bdab…c673` (`matches: true`) |
| **routingComplete** | **false** (`gates.routingComplete: false`) — the stop-at-commander condition |

### PER-LIMB ROUTING (from `routing.limbs`, all four)

**Routing summary (R3 routing arm for the three discipline limbs; R0 for delivery, per A2):**

| limb | arm | prior | nExcess | support-out point [CI] | firesJ | route | routeReason (verbatim) | bothFired |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rest-defence slot (DEGEN-RESTDEF, I5(b)) | R3 | H | 25,332 | 0.705945 [0.699804, 0.711796] | true | **J** | "support-out CI lower > 0.5 (jurisdiction first)" | false |
| offsides (C-OFFSIDE) | R3 | S | 5,306 | 1 [1, 1] | true | **J** | "support-out CI lower > 0.5 (jurisdiction first)" | false |
| restart resettle (C-RESTART) | R3 | J | 9,757 | 1 [1, 1] | true | **J** | "support-out CI lower > 0.5 (jurisdiction first)" | false |
| delivery economy (§2 band break) | R0 | H (+downstream-watch) | **0** | null [null, null] | false | **UNROUTABLE** | "support-out CI straddles 0.5 (jurisdiction ambiguous — neither bound clears)" | false |

**CLASS H — face-matched boundary + the single-boundary readings (labelled per A1):**

| limb | reading | boundary | beyond/within mass | beyondFraction | dominance | permP (permValid) | firesH |
| --- | --- | --- | --- | --- | --- | --- | --- |
| rest-defence slot | face-matched (`h`) | 10 s | 18,113 / 13,712 | 0.569144 | true | 0 (2000) | true |
| rest-defence slot | `hSingle6` | 6 s | 23,342 / 8,483 | 0.733449 | true | 0 (2000) | true |
| rest-defence slot | `hSingle10` | 10 s | 18,113 / 13,712 | 0.569144 | true | 0 (2000) | true |
| offsides | face-matched (`h`) | 10 s | 19,662 / 1,942 | 0.910109 | true | 0 (2000) | true |
| offsides | `hSingle6` | 6 s | 20,904 / 700 | 0.967599 | true | 0 (2000) | true |
| offsides | `hSingle10` | 10 s | 19,662 / 1,942 | 0.910109 | true | 0 (2000) | true |
| restart resettle | face-matched (`h`) | 10 s | 23,535 / 3,178 | 0.881032 | true | 0 (2000) | true |
| restart resettle | `hSingle6` | 6 s | 25,876 / 837 | 0.968667 | true | 0 (2000) | true |
| restart resettle | `hSingle10` | 10 s | 23,535 / 3,178 | 0.881032 | true | 0 (2000) | true |
| delivery economy | face-matched (`h`) | 6 s | 0 / 0 | null | false | null (0) | false |
| delivery economy | `hSingle6` / `hSingle10` | 6 s / 10 s | 0 / 0 | null | false | null (0) | false |

**CLASS S — stratified (gating) + raw-pooled (non-gating), from `s` and `sRawPooled`:**

| limb | s stratified point [CI] | resolved | nStrata | excludedEmptyStrata | sRawPooled point [CI] | resolved |
| --- | --- | --- | --- | --- | --- | --- |
| rest-defence slot | 0.001440 [−0.005702, +0.009144] | **false** | 12 | 0 | −0.099720 [−0.107884, −0.091890] | **true** |
| offsides | −0.105368 [−0.131694, −0.076506] | **true** | 28 | 4 | −0.042391 [−0.058585, −0.026102] | **true** |
| restart resettle | −0.061903 [−0.076741, −0.046513] | **true** | 12 | 0 | −0.127364 [−0.139066, −0.115965] | **true** |
| delivery economy | null [null, null] | false | 0 | 0 | null [null, null] | false |

**Delivery-economy limb — the extra disposition (A2 / §2.3):**
`route: UNROUTABLE`; `downstreamWatch: false`; `downstreamWatchCI:
{point: null, lower: null, upper: null, n: 800}`; `note` (verbatim):
*"A2: routes on the INCUMBENT/R0 side (R0 build-ups; chain lag
origin→shot-for; R0-moment contrasts). No cross-arm tick counterfactuals.
Downstream-watch = coverage by other routes' remedies (D8), REPORTED not a
stop."*

### THE RECORDED INTERNAL INCONSISTENCY (a run fact, for the commander's adjudication)

The delivery-economy limb's **mining-side excess-event population is empty**
— `routingArm: R0`, `nExcess: 0` over the 800 mining matches (R0 arm) —
so its support, H, S and downstream-watch statistics are all null and the
limb is UNROUTABLE. **In the SAME run**, the fresh reference corpus
(enriched R0, eye null, 400 matches) measures a non-zero delivery-build-up
base rate:

| quantity | value (JSON, side by side) |
| --- | --- |
| mining-side delivery excess-event population (R0 arm, 800 matches) | `nExcess = 0` |
| fresh-reference `deliveryBuildupsPerMatch` (enriched R0, 400 matches) | **12.0825 [11.635, 12.54]**, total delivery build-ups **4,833** |

These two numbers are recorded together, without interpretation, as an
internal inconsistency for the commander's adjudication (#44.3
labelled-data convention: reported AS-IS).

### FRESH REFERENCE BASE RATES (binding-moment, enriched R0, 400 matches; `9,700,000 + k`; X-DET)

| base rate | per-match point [CI] | total | n |
| --- | --- | --- | --- |
| turnoversPerMatch | 51.335 [50.2, 52.4625] | 20,534 | 400 |
| passReleaseNearLinePerMatch | 44.1025 [42.66, 45.525] | 17,641 | 400 |
| restartPhasesPerMatch | 12.6375 [12.2675, 13.0125] | 5,055 | 400 |
| deliveryBuildupsPerMatch | 12.0825 [11.635, 12.54] | 4,833 | 400 |

`reference.underPowered: null` (no cut flagged under-powered).

### THE R1 REVIEW-FIX COMPARISON — stratified (gating) vs raw-pooled (`sRawPooled`, non-gating) (labelled, no commentary)

Per the #94.3 / #95.1 R1 fix, the CLASS S contrast is the **within-cell
stratified** estimator (gating); the **raw pool** is retained as the
non-gating `sRawPooled` column. Recorded as data:

* **rest-defence slot**: `sRawPooled` **resolved = true**, −0.099720
  [−0.107884, −0.091890] vs stratified **unresolved (resolved = false)**,
  0.001440 [−0.005702, +0.009144].
* **offsides**: both resolved, different points — stratified −0.105368
  [−0.131694, −0.076506] vs `sRawPooled` −0.042391 [−0.058585, −0.026102].
* **restart resettle**: both resolved, different points — stratified
  −0.061903 [−0.076741, −0.046513] vs `sRawPooled` −0.127364 [−0.139066,
  −0.115965].

### TIME-TO-COST CURVES (recorded in the JSON, `timeToCostCurves`; descriptive, I7)

The per-limb, per-bin curves are recorded in full in the JSON (each bin
carries `armMean`, `pairMean`, `excessDiff`, `ciLower`, `ciUpper`). Bin
edges (§2.5): `[0,2) · [2,4) · [4,6) · [6,10) · [10,15) · [15,30) ·
[30,∞)`. Excess hazard `excessDiff` (R3 − paired R0 for the three
discipline limbs; delivery is R0-side value hazard, no cross-arm pairing —
all bins null, `armMean = 0`), per bin:

| limb | [0,2) | [2,4) | [4,6) | [6,10) | [10,15) | [15,30) | [30,∞) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| restSlot | +0.29 | −0.94 | −1.0675 | −1.71625 | −1.29 | −1.0625 | −1.19625 |
| offside | +0.0125 | −0.00375 | −0.21625 | −0.65625 | +0.03125 | +0.49625 | −1.03375 |
| restart | −0.01125 | −0.1175 | +0.08125 | −0.21125 | −0.56625 | −2.0575 | −2.78625 |
| delivery | null | null | null | null | null | null | null |

`timeToCostCurves.note` (verbatim): *"DESCRIPTIVE (I7): form frozen here;
numbers pin W_hold/W_long at V4-P2 (a fresh dataset). restSlot/offside/
restart = concede-surrogate hazard (R3−paired R0) per bin; delivery =
delivery-value hazard on R0 (A2), no cross-arm pairing."* Per-bin CIs are
recorded in the JSON.

---

**The stage is STOPPED at the commander (§6).** Adjudication and
disposition are the commander's ruling, recorded in
[`PROGRAMME-RULINGS.md`](PROGRAMME-RULINGS.md).
