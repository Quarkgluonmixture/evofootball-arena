# Stage III V3-P0 — The Role Base-Rate and Power Map

Status: **PRE-REGISTERED 2026-07-30, frozen before the run.** READ-ONLY,
**zero `src/**`**. Nothing here prices anything and nothing here ships. The
sizing smoke (§3) has run read-only and is committed with this freeze; the
V3-P0 census run that fills §9 is **NOT authorized here** — this freeze
returns to the commander, whose review is the only thing that opens it.

Authority: [`STAGE3-V3-ROLE-EYE.md`](STAGE3-V3-ROLE-EYE.md) §4 (V3-P0's four
deliverables (i)–(iv)), §2 (the role axis — `context × ROLE × candidate`, role
∈ {DF, MF, WG, ST} read from the formation machinery; the going axis OUT), §3
(the invariants — esp. **I6** enriched world, **I7** sizing-before-floors, **I8**
role is read not created), §6 (stop rules) · **#77** (launch; the five design
rulings; the pre-named hypothesis) · **#68.3 / #24** (the sizing law + the
attainable-population floor, published ex ante) · #44.5/#65 (sizing before
floors) · #46.2 (smoke disjointness) · #48.4 / #49.3 (windows / fidelity /
per-record receipts) · #38.1 (full sign space + E-INJURY) · #32.1 (per-record
fidelity form, no coupon-collector) · #20 (CI / cluster) · #26.5 (state HEAD +
flags) · #67.3 (the enriched full bundle) · Road B (nothing ships).

Parents reused unamended:
[`STAGE3-P1R-APPROACH-CENSUS.md`](STAGE3-P1R-APPROACH-CENSUS.md) §2 (the
18-candidate ball-local lattice `r ∈ {7,14,21} × {0,60,120,180,240,300}°`, the
12 contexts, W = 3.0 s, approach semantics, the station-family moment
instrument), [`STAGE3-V2-P0-WEDGE-MAP.md`](STAGE3-V2-P0-WEDGE-MAP.md) (the P0
form this document matches), [`STAGE3-V2-P1-ANTICIPATORY-CENSUS.md`](STAGE3-V2-P1-ANTICIPATORY-CENSUS.md)
§3 (the census-budget power arithmetic this stage anticipates).

**World / HEAD.** Every arm runs the **ENRICHED** world — the #67.3 full bundle:
`edsPerceivedDefence`, `edsPerceivedChoice`, `edsValueAxis`, `c5Hold`,
**`c6Carry`**, **`c7Windup`** armed; `c5TouchFork` off. HEAD = **`49ba867`** (the
v3 design contract). Every run states its HEAD and its armed flags (#26.5). In
production every EDS flag defaults OFF and `c6Carry`/`c7Windup` default `false` —
Road B is intact; the enriched world is a probe-only staging.

---

## 1. What V3-P0 is (and is not)

V3 amends WHOSE MAP a body reads: the census table gains a **ROLE axis**, and the
role axis **partitions the station-family moment population ~4 ways** (contract
§2, I7). Before any V3-P1 floor freezes, V3-P0 measures that partition — the
per-role shares, the per-(context × role) coverage, and the census-budget power
arithmetic the partition forces — so that #24's attainable-population floor is
checked EX ANTE, per the law #68.3 / #65 made the standing discipline.

It is **observational**: the four-way split is read at NATURAL rates on the
enriched world (no fork-and-force — that is V3-P1). Role is the **world's OWN
variable** (contract §2/I8): read directly from the sampled body's `role` field,
never authored, never re-mapped.

It hands three things forward and can stop the stage with a fourth:
* **(i) → V3-P1's floors**: the four-way station-family role split — the census's
  partitioning population, #24's input.
* **(ii) → V3-P1's attainability table**: which (context × role) cells can ever
  reach 150, published before V3-P1 freezes.
* **(iii) → V3-P2's reference**: the incumbent's per-role deviation-mix — the
  role signature the v3 consumer must *differ from*.
* **(iv) → V3-P1's census budget**: the moment count V3-P1 needs for its
  load-bearing cells at 150 with ≥ 2× headroom (§3 / §4-(iv)).

**It cannot authorize V3-P1.** Only the commander's review of this freeze can.

---

## 2. The frozen quantities (no re-cutting after sight — §6)

### 2.1 The role axis — FROZEN to the code's own variable

```text
src/sim/types.ts:19   export type Role = 'GK' | 'DF' | 'MF' | 'WG' | 'ST'
src/sim/types.ts:27   ROLES: Role[] = ['GK','DF','MF','WG','WG','ST']   (the 6v6 starting slots)
src/sim/Player.ts:29  readonly role: Role                              (immutable per body)
src/sim/Player.ts:194–207 / 226–235  role set at construction from the squad slot,
                       re-derived on becomeSub — a sub inherits the slot's role.
```

The census axis is `role ∈ {DF, MF, WG, ST}` — **GK is never in the station
family** (the moment instrument's pool already excludes GK,
`STAGE3-P1R-APPROACH-CENSUS.md` §2.2 / the smoke `p.role !== 'GK'`). Role is a
`readonly` property of the squad slot, so it is exact own-state (contract I2/I8):
no percept issue, nothing to author.

**A construction fact that governs the whole power map.** The starting six is
`['GK','DF','MF','WG','WG','ST']` — **one DF, one MF, TWO WG, one ST**. WG
carries **~2× the bodies** of every other outfield role BY CONSTRUCTION, so the
four-way split is **skewed toward WG before any behaviour is measured**. This is
not a defect — it is the roster the world plays — but it is the reason the role
partition thins DF/MF/ST cells twice as fast as WG cells, and the reason #24's
attainability must be published per (context × role), not per context.

### 2.2 The census cell — `context × role × candidate`, and how n is counted

The V3-P1 census keys `context(12) × role(4) × candidate(18)` = **864 cells**
(vs P1R's 216; the going axis is OUT, #77.2(ii)). As in P1R, **each census
moment forks ALL 18 candidates** (one moment → 18 candidate forks + 1 control),
so **the candidate axis does NOT divide the moment count**: a `(context, role,
candidate)` cell's `n` = the number of station-family **moments** in `(context,
role)`. Therefore **#24's 150-per-cell floor binds on MOMENTS-PER-(context ×
role)** — which is exactly the quantity §3's smoke measures. (This mirrors P1R,
where a `(context, candidate)` cell's n was the moments in that context — §5.3's
`n 293` etc.)

### 2.3 The role axis is BINARY-free — the four-way split is the primary axis

Unlike V2-P0's OTHERS-GOING (a binary that thinned cells into two), the role axis
is a **four-way partition of the SAMPLED body**. There is no sub-split: the
sampled body has exactly one role, so each moment lands in exactly one
`(context, role)` cell. The going axis and the v2.1 brake stay **banked dormant**
(contract §2, I9; #77.2(ii)/(iii)).

### 2.4 The incumbent-signature instrument (deliverable (iii)) — FROZEN, observational

The incumbent's role signature is the **per-role distribution over the 18 lattice
cells of where the incumbent's own station target sits, ball-local**. Defined
precisely, and computed on a pristine clone (no fork, no price):

* For each sampled station-family body, read its **incumbent desired station
  target** — the formation machinery's own output, `formationSpot(p, team, ball,
  hasBall=false, opp)` (`src/ai/formations.ts:129`) — the same target the body is
  steering toward (`MoveToFormationSpot`/`SupportBallCarrier`/… all resolve to
  it).
* Transform it to the **ball-local attack frame** the lattice lives in:
  `dx = (target.x − ball.pos.x) · attackDir`, `dy = target.y − ball.pos.y`
  (`src/sim/Team.ts:246` `localX`; the P1R census places candidates at
  `ball.pos + attackDir·dx`, `dy`, `stage3-p1r-approach-census.ts:185`).
* **Bin** to the nearest of the 18 lattice points by Euclidean distance, with a
  residual class **`outside-lattice`** for targets > 24 m from the ball (beyond
  `r=21` + a 3 m margin) — the incumbent's target can and does fall outside the
  lattice's reach, and pooling it into `r21` would fabricate coverage.
* **Tabulate the distribution per role.** The per-role lattice-cell histograms
  (with `outside-lattice` share) ARE the deviation-mix reference: they say where
  each role currently goes, and the V3-P2 consumer's job is to differ from them.

This is **observational** (reads the incumbent's own target off a clone), so it
keeps V3-P0 zero-`src`/price-free (contract §4). Reported with cluster CIs (#20).

---

## 3. The sizing smoke (read-only, disjoint, disclosed — I7 / #24 / #46.2)

Ran **before** the floors below were frozen, committed WITH this doc:
[`scripts/probes/stage3-v3-p0-sizing-smoke.ts`](../../scripts/probes/stage3-v3-p0-sizing-smoke.ts),
output [`data/stage3-v3-p0-sizing.json`](data/stage3-v3-p0-sizing.json).

* **Basis.** The enriched world (#67.3 bundle); the disjoint block
  **9,100,000 – 9,100,149** (150 matches, #46.2; V2-P1-sizing parity — a
  four-way split needs a fuller smoke than V2-P0's 48); P1R's moment instrument
  **verbatim** (2.0 s spacing; side-alternating stable rotation; body picked by
  the same stable rotation, **never by role**; station-family filter;
  face×threat×density classifier); the sampled body's `role` recorded. Counts
  only — no forks, no candidate value, no cost. Twice byte-identical across
  invocations, **canonical table SHA `3c555eb0…8837a2`**, file SHA256
  **`d35460b0…c4ad5`**, `deterministic: true`.
* **Result — the conditioning population.** 13,858 qualifying moments →
  **11,992 station-family rows = 79.947 rows/match** (min 66, max 100); 1,866
  ball-directed skipped; `noPool` 0. The population reproduces the V2 census
  scale (V2-P0 78.98/match, V2-P1 79.11, V2-P2R 79.05).
* **The four-way split (deliverable (i) preview).**

  | role | rows | share |
  | --- | ---: | ---: |
  | DF | 2,516 | 0.2098 |
  | MF | 2,447 | 0.2041 |
  | **WG** | **4,688** | **0.3909** |
  | ST | 2,341 | 0.1952 |

  **WG is ~2× each of DF/MF/ST** — the 2-WG roster (§2.1) read straight off the
  population. All four roles are individually well-populated (no degenerate
  column; no role starves at the aggregate — §6).

* **Floor derivation (#24).** #24 = **150 rows/cell**; convention = **2× the
  measured** (the X6_FLOOR / V2-P0 §3 headroom form). The census keys
  `(context, role, candidate)` and the floor binds on moments-per-(context ×
  role) (§2.2). The role-separation hypothesis (#77.3) needs, **per context, ≥ 2
  roles each ≥ 150** (a contrast needs two ends), so the **load-bearing binding
  cell = the sparsest 2nd-richest-role across the 12 contexts**:

  ```text
  binding cell   theirs|ownThird|sparse || ST   =  0.7733 rows/match
  bare-150       ⌈150 / 0.7733⌉               = 194 matches  ( 15,510 moments )
  2×-headroom    ⌈300 / 0.7733⌉               = 388 matches  ( 31,019 moments )
  ```

**Frozen floors:**
* **Cell floor** — every load-bearing `(context, role)` cell ≥ 150 moments
  (#24); binding at `theirs|ownThird|sparse||ST`.
* **V3-P0 census match count = 388** (the 2×-headroom binding; block 9.11M
  below). At 388 matches the attainability table (§4-(ii)) reads: **42 of 48
  cells clear 300 (2× headroom), 2 clear 150, and 4 fall under 150** — the four
  published **UNDER-POWERED ex ante (#24), never pooled**:

  | under-powered cell | expected rows @388 |
  | --- | ---: |
  | ours \| theirThird \| crowded \|\| DF | 49.2 |
  | theirs \| theirThird \| crowded \|\| DF | 126.8 |
  | theirs \| ownThird \| sparse \|\| DF | 131.9 |
  | theirs \| ownThird \| sparse \|\| MF | 147.4 |

  All four are the **thin roles (DF/MF) in the sparsest deep/defensive
  contexts** — exactly where the 2-WG skew bites. **Every one of the 12 contexts
  still fields ≥ 2 roles at ≥ 150 at 388 matches** (no context is role-starved —
  §6, the coverage-rich reading). The **rarest single cell overall** is
  `ours|theirThird|crowded||DF` (19 rows in the smoke, 0.1267/match) — published
  under-powered, never chased.

* **Deliverable (iv) — the number handed to V3-P1.** Same enriched world, same
  station-family filter, same fork-all-18 instrument ⇒ V3-P1's cell n is the
  same moments-per-(context × role) quantity, so V3-P1's binding requirement is
  **≥ 31,019 moments / 388 matches (2× headroom) on `theirs|ownThird|sparse||ST`**,
  with the four §3 cells published under-powered. This is **≈ 5.2× P1R's 6,000
  moments** and **≈ 0.63× V2-P1's 49,094** — smaller than V2-P1 because the role
  axis does not sub-split each context the way the OTHERS-GOING binary did (the
  four-way partition IS the axis, §2.3). The **bare-150 alternative** (the
  commander's lever, #24) is **15,510 moments / 194 matches** — every
  load-bearing cell clears the raw floor with no block-variation cushion.

---

## 4. The four deliverables, operational

The V3-P0 census run (block 9.11M, §7; **unrun — awaits the commander**) computes
these off pristine clones, natural rates, TRUE state, cluster-bootstrapped CIs
(#20). The smoke (§3) is point-estimate only; the run adds (iii) and the CIs.

### (i) Station-family moment shares BY ROLE — the four-way split

The action-family / eligibility predicate is **P1R's station family verbatim**:
a moment qualifies iff the sampled body's `action.type ∈ {MoveToFormationSpot,
HoldPosition, SupportBallCarrier, MakeRun, MarkOpponent}`; the ball-directed jobs
`{ChaseBall, ReceivePass, InterceptPass}` and the carrier are excluded
(`STAGE3-P1R-APPROACH-CENSUS.md` §2.2). **Role is read** from the sampled body's
`role` field (§2.1). Tabulate the share of station-family rows per role
`{DF, MF, WG, ST}`, overall and per `face×threat×density` context. Cluster =
match seed; CIs = 2,000-resample cluster bootstraps (#20), never bare means.
Smoke preview: DF 0.210 / MF 0.204 / WG 0.391 / ST 0.195.

### (ii) Per-role context coverage — the attainability table (#24)

For each of the 48 `(context × role)` cells, the expected moments at the frozen
388-match budget, and the ex-ante verdict: **clears 300 (2× headroom) / clears
150 / under 150**. Publish the full 48-cell table with the four under-powered
cells (§3) named, and the per-context count of roles clearing 150 (the
role-starvation check). This IS the attainable-population arithmetic #24 demands,
published before V3-P1 freezes; under-powered cells are **published, never
pooled**, and V3-P1's consumer reads in-power cells only (contract I7).

### (iii) The incumbent's role signature — the deviation-mix reference

Per §2.4's frozen instrument: the per-role distribution over the 18 lattice cells
(+ `outside-lattice`) of the incumbent's own ball-local station target, on a
clone, per role, with cluster CIs. This is the reference the V3-P2 consumer must
**differ from** — the thing the role eye adds to, or fails to add to. Report per
role: the modal lattice cell(s), the distribution's concentration, and the
pairwise **total-variation distance** between roles (how separated the incumbent
already is — the input to the §6 "incumbent already role-separated" reading).

### (iv) The census-budget power arithmetic — the number V3-P1 needs

Per §3: the formula and the number.

```text
formula:  matches_needed(cell) = ⌈(150 × headroom) / rows_per_match(cell)⌉
          binding cell          = argmin over contexts of the 2nd-richest role's rate
          budget                = matches_needed(binding cell)
number:   binding = theirs|ownThird|sparse||ST @ 0.7733 rows/match
          2×-headroom budget    = 388 matches ≈ 31,019 moments   (V3-P1's requirement)
          bare-150 alternative  = 194 matches ≈ 15,510 moments   (#24 lever)
```

The census run re-measures the binding rate on the 9.11M block with a cluster CI;
if the block-measured rate drifts, the 2× headroom is the cushion the convention
exists to absorb (the V2-P1 §8 block-instability precedent). **V3-P0 publishes
the budget; it does not spend it — V3-P1 does, under its own freeze.**

---

## 5. Gates (read-only census X-family)

| gate | predicate |
| --- | --- |
| **X-DET** | two `runCensus()` calls **byte-identical**; canonical table SHA emitted; **zero `src/**` touched** (the freeze and the census both). The §3 smoke already meets this twice byte-identical across invocations (SHA `3c555eb0…8837a2`, file `d35460b0…c4ad5`). |
| **X-CLONE** | every read runs off a **pristine clone**; clone coverage = 100% of sampled moments; the live enriched trajectory reproduces **bit-identically** on a 1-in-25 sample (the C5-T2 / V2-P0 read-only discipline). |
| **X-FID** | **unexplained EXACTLY 0** where ledgered, in #32.1's **per-record** form (never a max-statistic / coupon-collector). |
| **FLOORS** | #24 = 150 per `(context × role)` cell, DERIVED from §3's disclosed smoke; smoke seeds (9.10M) **disjoint** from the census staging (9.11M), #46.2. The four under-powered cells (§3) published under-powered, never pooled. |
| **CLUSTER / CI** | cluster unit = **match seed** (#20); CIs = 2,000-resample cluster bootstraps; no bare means. |

**Standing exception classes (#38.1), each with per-record receipts (#49.3:
`seed, tick, gid, cause`, capped at 1,000/class):** paused world · carrier ·
ball won · sent off · onside clamp · barred box · match ended · **E-INJURY** (the
advantage-foul carrier injury, either limb — attrs mutation post-read or same-gid
`becomeSub` reposition without release; ruling #49.3). All checked; **unexplained
must be exactly 0** over the enlarged class set. Reported-not-gated:
`reconstructionDiverged` (the P1R convention). Decision rules cover the full sign
space (§6, #38.1).

**Fingerprint.** Unchanged by construction (zero `src/**`); every production flag
dormant. Nothing ships (Road B), through the whole stage.

---

## 6. Pre-laid readings — the full sign space (neither pre-judged)

* **R1 — A ROLE STARVES (the power consequence).** A role's cells fall below 150
  across so many contexts that the census can price it in only a handful — the
  role axis is then **untestable for that role**, and the #77.3 role-separation
  hypothesis is confirmable only for the roles that field cells. Read from (i)+(ii):
  the smoke shows **no role starves at the aggregate** (DF/MF/ST ~0.20 each), but
  **at the CELL level the reading partially fires** — four DF/MF cells in deep/
  sparse contexts are under-powered (§3), so the role contrast in
  `theirs|ownThird|sparse` and the two `theirThird|crowded` contexts rests on
  fewer than four roles. The power consequence is stated ex ante: those contexts
  test a **2–3-role** contrast, not the full four; V3-P1's per-context spread
  reads across in-power roles only.
* **R2 — COVERAGE RICH (the design case licensing V3-P1).** Every context fields
  ≥ 2 roles at ≥ 150, most field all four — the role contrast is testable in all
  12 contexts. This is what the smoke shows at 388 matches (§3): 42/48 cells at
  2× headroom, all 12 contexts ≥ 2 roles. If the census run confirms it, the map
  is rich enough for V3-P1 to see division of labour where it exists.
* **R3 — THE INCUMBENT IS ALREADY ROLE-SEPARATED (a real kill for v3).** If (iii)
  shows the incumbent's per-role deviation-mixes are **already near-disjoint** —
  each role's lattice-cell histogram concentrated on distinct modes, pairwise
  total-variation distances near 1 — then `formationSpot` already breaks symmetry
  by role so completely that a role-conditioned census would only re-price what
  the incumbent already does, and the eye has nothing to add. Read from (iii)'s
  per-role histograms + TV distances; this reading would counsel the commander
  that v3's value is small BEFORE V3-P1 spends its budget (it does not stop V3-P0,
  which prices nothing — it is a flag for the commander's review).
* **R4 — DEGENERATE AXIS.** A role never appears in the station family (its column
  is empty) ⇒ the axis is degenerate for it. The smoke excludes this: all four
  roles are healthily populated (ST, the smallest, is 0.195).

---

## 7. Staging

| item | value |
| --- | --- |
| **sizing smoke** | seeds **9,100,000 – 9,100,149** (150 matches); read-only, no forks; committed with this doc; canonical SHA `3c555eb0…8837a2`, file SHA256 `d35460b0…c4ad5`, `deterministic: true` |
| **census main block** | seeds **9,110,000 + k**, `k ∈ 0..387` (**388 matches**, the 2×-headroom binding §3); disjoint from the smoke (#46.2) and **above every consumed/reserved range** |
| **consumed / reserved (disjointness, #46.2) — the walk** | P0 930k · P1 960k–1.46M · P1R 980k–1.48M · P2-A 2.0M–3.2M · P2-B 3.5M–3.9M · C4/C5 700k–970k · C6 4.0M–6.5M · C7 6.6M–7.1M · C5 re-census 8.29M–8.4M · C5-T2 8.5M/8.51M/8.6M · **V2-P0 smoke 8.70M / census 8.71M · V2-P1 smoke 8.80M / census 8.81M · V2-P2 smoke 8.90M / payoff 8.91M · V2-P2R smoke 9.00M / payoff 9.01M**. V3-P0's smoke **9.10M** and census **9.11M** lie above every consumed/reserved range and are mutually disjoint. |
| **output data path** | `docs/world-model/data/stage3-v3-p0-role-map.json` (the census output; the smoke output is `…/stage3-v3-p0-sizing.json`) |
| **cluster unit** | the match seed (#20), disjoint per block |
| **bootstrap** | 2,000 cluster resamples, **frozen seed 91100** (fresh, disjoint from V2-P0's 50066 / V2-P2R's 90730) |

---

## 8. Registered non-claims

* **V3-P0 prices NOTHING.** No fork-and-force, no signed outcome, no value, no
  candidate ranking — it records the station family at natural rates, split by the
  role the world already assigns. The approach estimand (#41.2) is untouched.
* **V3-P0 CANNOT authorize V3-P1.** It hands (i) forward as the split, (ii) as the
  attainability table, (iii) as the incumbent reference, (iv) as the budget; only
  the commander's review of this freeze opens V3-P1.
* **Nothing ships (Road B).** Every EDS flag dormant in production, `c6Carry`/
  `c7Windup` probe-only, fingerprint unchanged, through the whole stage.
* No coach layer beyond the role column, no marking assignments, no pressing
  triggers (contract §7 — those are FUTURE A4 slices, each its own contract); if
  organised, role-shaped football appears later, it EMERGED from measured per-role
  prices consumed through honest eyes.

---

## 9. RESULT

*(Empty — the V3-P0 census run is not authorized by this freeze. This
pre-registration returns to the commander; a review that authorizes the run fills
this section with the four deliverables, the gate verdicts, and the pre-laid
reading that fired.)*
