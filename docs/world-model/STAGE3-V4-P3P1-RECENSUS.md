# Stage III V4-P3p-1 — THE TARGETED RE-CENSUS (extended S-bit keys)

Status: **PRE-REGISTERED 2026-08-01, FROZEN BEFORE ANY BUILD OR RUN. Doc only;
zero `src/**`, zero probe, zero simulation in this step.** Opened by ruling
**#112.3** (P3p-0 reviewed PASS; the dormant seams + bit functions are built and
proven; P3p-1 pre-registration authorized). This freezes the sub-stage design of
the **targeted re-census** — the V3-P1 role census re-run on the affected cell
families with the two P3p-0 S bits added to the cell key, merged into the
committed v3 table under the AUGMENT rule. It builds nothing: the probe
`scripts/probes/stage3-v4-p3p1-recensus.ts` is a FUTURE authorized step (the
standing pattern: freeze → review → build → run; §0.0 / #86.2). **This freeze
RETURNS TO THE COMMANDER for review. Nothing ships (Road B).**

Authority: **#112** (P3p-0 PASS; #112.2's TWO carried items are mandatory content
of THIS doc: (i) the `widthHeld` genuine-0 PROXY decision rule — the smoke
measures the proxy against the stricter never-emit-0 alternative and freezes one
by a PRE-REGISTERED rule before the census; (ii) OFFSIDE_EPS = 0.2 is MIRRORED,
re-asserted here as an X-form gate against the sim's offside machinery; #112.3
authorizes this pre-registration) · **#111** (V4-P3-PARTIAL pre-registration PASS;
flagged choices ratified incl. the disjoint-scope rule, the AUGMENT merge rule +
X-MERGE-IDENT, the seed bands 10.4M/10.5M + stats 99403/99503) · **#110** (the
stage opens as a MEASUREMENT battery) · the STAGE-LEVEL freeze
[`STAGE3-V4-P3-PARTIAL.md`](STAGE3-V4-P3-PARTIAL.md) **§3** (the two frozen bit
definitions + tri-state contracts) and **§4** (the re-census: the scope cut, the
DISJOINT-SCOPE rule + forward-candidate tie-break, the AUGMENT merge rule +
X-MERGE-IDENT, the match-count knee sizing, the seed bands) · the v4 contract
[`STAGE3-V4-LONG-HORIZON-PRICE.md`](STAGE3-V4-LONG-HORIZON-PRICE.md) (I1 no
hand-coded tactic; I2 percept-honest with named abstention; I3 no free
hand-weights; I8 no new gene/attribute/percept channel; Road B nothing ships) ·
the v3 census contract [`STAGE3-V3-P1-ROLE-CENSUS.md`](STAGE3-V3-P1-ROLE-CENSUS.md)
(the instrument this reuses) · #24/#44.5/#65 (sizing before floors) · **#105** (the
attainability-knee N rule; #105.4 pooled-MDL retired, optional stopping foreclosed)
· #46.2 (seed disjointness) · #48.4 (thresholds pinned ex ante) · #49.3 (receipts)
· #20 (cluster = match seed) · #80.2 (house law: a range statistic takes a
permutation null, never a CI on itself).

Data this freeze rests on (committed, SHA'd — freeze honesty; every number below
traces here):

* the **committed V3-P1 role table** `data/stage3-v3-p1-role-census-table.json`,
  canonical `tableSha` **`171a6dad…6559f`** (full:
  `171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f`),
  `primarySha` `92236ed2…6bdc`, verdict GATES PASS — censused on **388 matches**
  over block **9,110,000..9,110,387**, 31,095 moments, **45/48** in-power
  `(context × role)` base cells (the 3 published under-powered DF cells the
  remaining 3). This is the **merge base** (§4).
* the V3-P1 census **instrument**
  [`scripts/probes/stage3-v3-p1-role-census.ts`](../../scripts/probes/stage3-v3-p1-role-census.ts)
  (READ-ONLY — the fork-and-force machinery the re-census reuses VERBATIM: the
  18-candidate lattice, the V3-P0 sampling loop, W = 3.0 s, the 6/10 s two-face
  outcome, floor 150, the cluster bootstrap, the exception classes X1–X7, the
  gates X4/X5/X6/X7, `publish-not-pool`).
* the P3p-0 **bit module** [`src/ai/eyeContextBitsV4.ts`](../../src/ai/eyeContextBitsV4.ts)
  (READ-ONLY — the frozen tri-state bit functions the re-census calls, committed
  `3ce528f`, 21 tests green, X-OFF-IDENT proven): `evaluateInSupport`,
  `widthHeldBit`, `perceivedOffsideLine`, `beyondLineBit`, and the pinned
  constants `SUPPORT_STALE_TICKS`/`WIDTH_STALE_TICKS`/`LINE_STALE_TICKS = 30`,
  `WIDE_EDGE = BOX_WIDTH/2`, `OFFSIDE_EPS = 0.2`.
* the sim's own offside machinery: `offsideAtKick`
  ([`src/sim/mechanics.ts:219`](../../src/sim/mechanics.ts)), whose inline
  epsilon `return tx > line + 0.2;` (line 224) is the value OFFSIDE_EPS mirrors;
  `offsideLineLocalX` ([`src/ai/formations.ts:466`](../../src/ai/formations.ts))
  the second-last-opponent line `perceivedOffsideLine` mirrors.
* the percept read `match.perceivedSnapshot(p)`
  ([`src/sim/Match.ts:2813`](../../src/sim/Match.ts)) — the forced body's own
  pulled snapshot the amendment reads (§2.2).

**World / HEAD / flags (#26.5 / #67.3).** The re-census runs on the **ENRICHED**
world VERBATIM (the same `CENSUS_FLAGS` the V3-P1 table was censused on:
`edsPerceivedDefence + edsPerceivedChoice + edsValueAxis` ON, `c5Hold`,
`c6Carry`, `c7Windup` ON, `c5TouchFork` off) — a consumer that reads a table
censused on a different substrate reads a stale table. In production every EDS
flag defaults OFF, the `eye.v4` flags are absent, `stationEye` is null, and the
production fingerprint **`57b0bdab…c673`** stays unchanged throughout (X-SRC-ZERO,
X-FP-PROD, Road B). **The re-census computes bits but consumes nothing** — the
bits stay observability-only until the P3p-2 consumer.

---

## §1 — WHAT P3p-1 IS (and its ONE deliverable)

P3p-1 **prices** the bit-split cells and produces the **merged, bit-extended role
table** the P3p-2 consumer will read. It is a re-run of the V3-P1 role census on
ONLY the affected cell families (§3), with the cell key extended by one S bit
(§2), on fresh seeds (§8), merged into the committed v3 table under the AUGMENT
rule (§4). Its ONE deliverable is:

> the **merged table artifact**
> `data/stage3-v4-p3p1-merged-role-census-table.json` — the committed v3 base
> cells copied byte-identical, PLUS the in-power `widthHeld` / `beyondLine`
> bit-children of the affected families, SHA'd and twice byte-identical.

**P3p-1 builds no consumer, wires no `src/**`, changes no behaviour.** The
in-support law is NOT exercised here (it is a CONSUMPTION law, P3p-2); the
re-census samples by the V3-P1 truth predicate exactly as v3 did, and only the
KEY is extended. The bits remain observability-only. Nothing ships.

---

## §2 — THE INSTRUMENT: V3-P1 VERBATIM + ONE AMENDMENT (the S-bit key)

### 2.1 Verbatim (no change)

Everything the V3-P1 instrument does is REUSED byte-for-byte: the 18-candidate
ball-local lattice (radii 7/14/21 × angles 0/60/120/180/240/300), the control +
18 fork-and-force structure (`forcedStationPolicy` forked at the executor read),
W = 3.0 s, the two faces (`H_score` 6 s / `H_concede` 10 s), the signed outcome
(`ANY shot for − ANY shot against`), the V3-P0 sampling loop (`lastMomentTime`
advanced on EVERY qualifying moment; the stable side-alternating rotation; the
`MOMENT_SPACING_S = 2.0` spacing; the station-family filter), the 12 contexts ×
4 roles keying, the exception classes X1–X7 with the derived X6 floor, the
positive-control gate (`r21a180`), the gradient and SAT arms, the floor 150 on
moments-per-`(context × role)`, `publish-not-pool`, and the X-DET double-run +
canonical SHA. **These are not re-opened.** The re-census inherits the full
`summarise()` (primary spread + permutation null + PC + gradient + SAT) as an
un-amended byproduct; the two stats seeds re-seed that inherited machinery (§8).

### 2.2 The one amendment — every sampled moment/candidate is ALSO keyed by its S bit

At each sampled moment, AFTER the V3-P1 `context`/`role` are computed and BEFORE
the clone is taken (V3-P1 script ≈L449–452), the re-census pulls the **forced
body's own percept snapshot** on the base match and computes the P3p-0 bits from
it — a READ the V3-P1 instrument never made (V3-P1 keyed on TRUE own-state role
only; there is no percept read in v3). ⚠ **FLAGGED interpretive choice — the
re-census adds a percept read.** This is required by I2 (the bits are
percept-honest) and is the honest analogue of what the P3p-2 consumer will read.
It is READ-ONLY (`perceivedSnapshot` never mutates) and taken on the SAME base
state the clone is cut from, at the decision tick:

```text
snap        = m.perceivedSnapshot(body)          // Match.ts:2813, the forced body's own percept
localXOf    = (x) => mine.localX(x)              // mine = m.teams[side]; the observer team's fold
ballLocalX  = mine.localX(m.ball.pos.x)          // already computed for the V3-P1 context band

// DELIVERY bit — a MOMENT property (one value, shared by all candidates of the moment):
widthHeld     = widthHeldBit(snap, body.gid, side, localXOf)          // eyeContextBitsV4.ts

// OFFSIDE bit — a per-CANDIDATE property (the line is a moment property; the bit is per-cand):
perceivedLine = perceivedOffsideLine(snap, side, localXOf)           // eyeContextBitsV4.ts
beyondLine(c) = beyondLineBit(perceivedLine, ballLocalX, c.dx)       // eyeContextBitsV4.ts, per candidate c
```

Each returns the P3p-0 tri-state `BitValue ∈ {0, 1, 'UNKNOWN'}`. `widthHeld` is
stored once on the moment row; `perceivedLine` + `ballLocalX` are stored once and
`beyondLine(c)` is evaluated per candidate at table assembly. The bits are
computed **only for in-scope moments** (§3) — out-of-scope moments carry no bit
(a cost optimisation, not a fidelity change: out-of-scope cells receive no
bit-children regardless, §3).

⚠ **FLAGGED — `observerSide`.** The census `side` is a number `0|1`; it is passed
as the P3p-0 `Side` argument. `body` is the forced outfielder; `mine.localX` is
the observer-team fold (the same one V3-P1 already uses to band the context and
to build the forced world target `ball + attackDir·dx`), so `beyondLineBit`'s
`ballLocalX + candidateDx` reproduces `localX(ball.x + attackDir·dx)` exactly
(the P3p-0 fold identity, `eyeContextBitsV4.ts:176–181`).

### 2.3 Which family carries which bit (the DISJOINT-SCOPE keying)

The DISJOINT-SCOPE rule (stage freeze §3.3, ratified #111.3) governs the keying:
**each affected `(context × role × candidate)` cell carries AT MOST ONE bit**,
so every re-censused cell is a CLEAN BINARY split. The frozen tie-break:

* **forward candidates in the affected contexts → the OFFSIDE bit `beyondLine`**;
* **all other own-possession attacking cells → the DELIVERY bit `widthHeld`**.

Forward = `cand.dx > 0` in the attack frame (a candidate behind the ball can
never be beyond the line; the line is floored at the ball). Over the frozen
lattice this is a clean **9 / 9** partition: `dx > 0` at angles {0, 60, 300}
(cos 1, ½, ½) = 9 forward candidates → offside; `dx < 0` at angles {120, 180,
240} (cos −½, −1, −½) = 9 behind/level candidates → delivery (no candidate has
`dx = 0`). The positive-control `r21a180` (`dx = −21 < 0`) is a behind candidate
→ delivery-keyed in the affected contexts, but the PC/gradient/SAT arms
themselves run bit-AGNOSTIC on the base cells exactly as V3-P1 (the bit split
touches ONLY the per-cell TABLE). The joint 4-way keying is REJECTED for power
(stage freeze §3.3; each contrast was measured as a single binary split).

### 2.4 Abstention (UNKNOWN) — counted separately, feeds the BASE cell only

When a bit returns `'UNKNOWN'` (P3p-0 named abstention `E-ABSTAIN-WIDTH-STALE` /
`E-ABSTAIN-LINE-STALE` — no fresh percept of the attacking half; fewer than two
freshly-observed opponents) the moment/candidate is counted in a **separate
UNKNOWN bucket** and feeds the base cell ONLY — never a guessed bit-child. This
is the third arm of the split and is load-bearing for X-MERGE-IDENT (§4): each
affected cell partitions THREE ways `{bit=0, bit=1, UNKNOWN}`, and the UNKNOWN
count is published as the abstention anchor. A bit is therefore never priced
unpriced and abstention never invents a value (I2/I3).

---

## §3 — THE SCOPE (frozen from where P0b measured the contrasts)

The scope is the stage freeze §4.1 verbatim. ⚠ **FLAGGED — the scope cut applies
to the KEYING / MERGE, NOT to the sampling.** The V3-P1 sampling loop is run
VERBATIM (all 12 contexts sampled, side alternating — do NOT sub-sample, or the
rotation, spacing, per-cell counts and the X4/X5/X6 fork identities all change).
The SCOPE decides only which cells RECEIVE bit-children; out-of-scope cells are
copied byte-identical from the v3 base (§4).

* **DELIVERY bit scope** — `face = 'ours'` × `threat ∈ {middle, theirThird}` ×
  all **in-power roles** × the **behind/level candidates** (`dx ≤ 0`, i.e. the
  9 candidates the tie-break leaves to delivery), split by `widthHeld`. This is
  the own-possession attacking build-up surface where the +0.631 wide-vs-central
  contrast was measured (P0b §RESULT, 45 strata).
* **OFFSIDE bit scope** — `face = 'ours'` × `threat ∈ {middle, theirThird}` ×
  in-power roles × the **FORWARD candidates** (`dx > 0`, the 9 toward-goal
  candidates), split by `beyondLine`. These are the cells the §2.3 tie-break
  assigns to offside; the −0.105 beyond-line contrast surface (P0b §RESULT, 28
  strata).

Everything else — all `face = 'theirs'` contexts, `threat = ownThird`,
out-of-power roles, and (within the affected contexts) the wrong-half candidates
of each family — is **NOT re-censused** and stays byte-identical to the v3 table.
⚠ **FLAGGED** (stage freeze §4.1): the +0.631 / −0.105 were measured on the R0
build-up body's `(context × role)` at origination, not directly on V3-P1 cells;
the scope maps that surface onto the V3-P1 own-attacking families and the P3p-1
smoke's attainability curve (§7) prunes which extended cells reach the floor.

---

## §4 — THE MERGE (AUGMENT verbatim) + X-MERGE-IDENT

### 4.1 The AUGMENT rule (stage freeze §4.3 verbatim)

```text
merged table = the committed v3 table (tableSha 171a6dad…6559f, base cells COPIED
               byte-identical)  ⊎  the bit-split children of each affected
               (context × role × candidate) family, ONLY where the relevant
               bit-child is in-power (child momentN ≥ 150) at the re-census.
```

* **Unaffected families** — copied byte-identical from the v3 table.
* **Affected families** — the v3 base cell is RETAINED byte-identical as the
  **abstention anchor**, and up to two bit-children `(… × bit=0)`, `(… × bit=1)`
  are ADDED where each child is in-power. An under-powered child (< 150) is
  DROPPED (publish-not-pool → the retained base governs those moments). The
  UNKNOWN bucket never becomes a child (it maps to the base by construction).

⚠⚠ **FLAGGED (load-bearing) — the merged base is COPIED from the committed v3
table, NOT recomputed on the re-census seeds.** The re-census runs on a DIFFERENT
block (10.5M, knee N) than the v3 table (9.11M, 388 matches), so the re-census's
OWN base cells are numerically different from v3's. The merge therefore takes the
v3 base cells VERBATIM (from the committed JSON) and grafts on the bit-children
computed from the new re-census. The consumer (P3p-2) reads a bit-child (the
priced refinement, from 10.5M) when the bit is readable and the child is
in-power, else the RETAINED v3 base (the coarser, still-certified value the v3
eye always read, from 9.11M). This base-vs-child provenance split is the design
(stage freeze §4.3 consumption); it is surfaced here as the doc's most subtle
choice.

### 4.2 THE MERGE CHILD — how a bit-child is priced

A bit-child is an extended TABLE cell of the V3-P1 `cellFrom` shape (`n`,
`value`, `score`, `concede`, `goalFor`, `goalAgainst`, `eta`, `targetError`,
`occupancy`, `momentN`, `underPowered`), computed over the NON-ENDED forks of
that candidate on ONLY the moments whose bit matches:

* **delivery child** `(ctx × role × cand[dx≤0] × widthHeld=b)` — `momentN` = # of
  in-scope moments in `(ctx × role)` with `widthHeld = b` (shared by all behind
  candidates of the cell, since `widthHeld` is a moment property).
* **offside child** `(ctx × role × cand[dx>0] × beyondLine=b)` — `momentN` = # of
  in-scope moments in `(ctx × role)` whose candidate-`c` `beyondLine = b` (per
  candidate, since `beyondLine` is a candidate property).

The floor 150 binds on the **child's** `momentN`; `value` = mean signed outcome
over the child's non-ended forks (the price — identical treatment to a v3 base
cell, on the bit-split subset). Cluster-bootstrap CIs on each in-power child
value are REPORTED (the `pairedCI` form, cluster = match seed, seed 99403, 2000
resamples) as a diagnostic, never a gate (V3-P1 tables carry values, not gates).

### 4.3 X-MERGE-IDENT (HARD gate — two parts)

1. **(base byte-identity)** The projection of the merged table onto the v3 base
   cells is byte-identical to the committed v3 table: the merged table's base
   sub-object re-hashes to `tableSha 171a6dad…6559f`. (Trivially true because the
   base is copied; the gate PROVES no copy corruption and no accidental base
   mutation.)
2. **(exact partition — the re-census's own X-form)** For every affected cell,
   the re-census's OWN base pool (recomputed on the 10.5M seeds, over ALL its
   moments) equals `child(bit=0) ⊎ child(bit=1) ⊎ UNKNOWN` exactly:
   `momentN(child0) + momentN(child1) + momentN(UNKNOWN) == momentN(reCensusBase)`
   and the moment-count-weighted pool of the two children plus the UNKNOWN bucket
   reproduces the re-census base cell's value decomposition. This proves the bit
   split is an EXHAUSTIVE three-way partition of the re-census's own moments (the
   `{0,1,UNKNOWN}` arms lose nothing). ⚠ **FLAGGED** — this partition is checked
   against the re-census's OWN base (10.5M), NOT the copied v3 base (9.11M); the
   two bases are different data and part (2) never claims otherwise.

The merged table is SHA'd and quoted; the re-census output is twice byte-identical
(X-DET). Any mismatch ⇒ FAIL, STOP at the commander.

---

## §5 — THE `widthHeld` GENUINE-0 PROXY DECISION RULE (#112.2(i), pre-registered NOW)

P3p-0 ships the PROXY form of `widthHeldBit`: it emits `0` when the observer
freshly saw ≥ 1 own-side outfield teammate in the attacking half and NONE was
wide, and `'UNKNOWN'` when the attacking half carried no fresh own-side percept
at all (`eyeContextBitsV4.ts:114–132`). A proxy `0` could be a genuine
seen-and-empty read OR a wide-blind-spot mislabel (the body saw a central
teammate, missed the wide channel). The STRICTER alternative is **never emit 0**:
map every non-`1` reading to `'UNKNOWN'` → the delivery bit then splits out only
`widthHeld = 1`, and `0`+unseen both fall to the base.

**The rule is pre-registered here and fires ONCE at first smoke sight, before the
census; its inputs and outcome are DISCLOSED in the smoke JSON and this doc; it
is NEVER revisited after the census (optional stopping foreclosed, #105.4).**

⚠ **FLAGGED — proposed metrics + band.** The P3p-1 sizing smoke (§7) publishes,
over the in-scope delivery moments (`face='ours' × threat∈{middle,theirThird} ×
in-power roles`):

| published metric | definition |
| --- | --- |
| `width1_share` | share with `widthHeld = 1` (proxy) |
| `p0_proxy` | share with `widthHeld = 0` (proxy) — the genuine-0 share |
| `unknown_share` | share `UNKNOWN` (proxy); the three sum to 1 |
| `p0_obsCount_median` | among proxy-`0` moments, the MEDIAN # of fresh attacking-half own-side outfield teammates observed |
| `strict_recast` | all three shares recomputed under the STRICT form (0→UNKNOWN), the two candidate keyings shown side-by-side |
| `age_hist` / `lateral_hist` | the perceived-age and `|y|` distributions (also confirm the 30-tick / `WIDE_EDGE` pins, §10) |

**DECISION — adopt the PROXY (emit-0) keying for the census IFF BOTH hold:**

* **(A) `p0_proxy ∈ [0.50, 0.95]`** (proposed band). Reasoning: in-scope moments
  are own-possession attacking build-up, where a body typically observes several
  attacking-half teammates (readability high), while a specific outfield teammate
  parked wide of the box (`|y| ≥ WIDE_EDGE ≈ 9.8 m`) in a 6-a-side team is the
  MINORITY structural state — so a plausible genuine-0 share is HIGH (roughly
  half to nine-tenths of readable moments). `p0_proxy < 0.50` ⇒ the proxy is
  declaring "width held" implausibly often (`WIDE_EDGE` too loose / the `1` arm
  over-firing) → distrust. `p0_proxy > 0.95` ⇒ the `1` arm fires so rarely the
  priced refinement would starve → the split earns nothing.
* **(B) `p0_obsCount_median ≥ 2`** — the attacking half was MATERIALLY observed
  on the moments where `0` was emitted, so a proxy `0` is a genuine
  seen-and-empty read and not a one-body blind-spot artefact.

**Otherwise adopt the STRICT never-emit-0 keying** (map `widthHeld = 0` to the
UNKNOWN/base bucket; only the `1`-child is split out).

⚠ **FLAGGED — where the decision lives.** The decision changes the PROBE-SIDE
KEYING only; `eyeContextBitsV4.ts` is NOT edited (X-SRC-ZERO for the module). If
STRICT is adopted, the probe maps a returned `0` into the UNKNOWN/base bucket
before keying; the chosen form is RECORDED as a pin in the smoke + census JSON and
CARRIED FORWARD to the P3p-2 consumer (which applies the same map, so a
`widthHeld=0` percept there finds no 0-child and falls to the base by the merge
rule). The offside `beyondLine` bit has no analogous proxy (its `0` is a
determinate geometric read once ≥ 2 opponents are freshly observed), so no
decision rule attaches to it.

---

## §6 — THE OFFSIDE_EPS RE-ASSERT (#112.2(ii), X-form gate)

OFFSIDE_EPS = 0.2 is MIRRORED in `eyeContextBitsV4.ts` (line 45), NOT imported —
the sim holds the epsilon as an inline literal `return tx > line + 0.2;` in
`offsideAtKick` (`src/sim/mechanics.ts:224`), which exports no named constant.
The re-census re-asserts the mirror as a HARD X-form gate:

> **X-EPS-REASSERT (HARD).** At run start the probe reads the sim's offside
> machinery — the `offsideAtKick` epsilon literal in `src/sim/mechanics.ts` (the
> `tx > line + <eps>` comparison, line ≈224) — extracts the numeral, and FAILS
> (STOP at the commander) if it differs from `OFFSIDE_EPS` (0.2) imported from
> `eyeContextBitsV4.ts`. A move of the sim's epsilon that did not move the mirror
> trips the gate.

⚠ **FLAGGED — this is a SOURCE-TEXT tripwire, not a behavioural or import-level
read.** `offsideAtKick` is module-private (not exported) and driving a real pass
through the sim to recover the epsilon empirically is heavy and fragile; the
behavioural recovery is CONSIDERED and REJECTED (the P3p-0 rejection reasoning:
Road B, the match/physics core stays untouched — extracting a shared
`OFFSIDE_EPS` constant in `mechanics.ts` is out of scope for a probe stage). The
text tripwire reads the machinery's exact line and is the smallest honest
re-assert (the paper-deslop lexical-invariant-gate pattern). The anchor is the
`offsideAtKick` body's `line + <numeral>` literal; a numeral change OR a
disappearance of the anchor both FAIL closed.

---

## §7 — SIZING (#24/#44.5/#65 + the #105 attainability-knee N)

Each bit split roughly HALVES the moments in an affected cell (and the UNKNOWN
arm removes more), so some extended children will not reach floor 150. Sizing
before floors:

1. **The sizing smoke first** — `scripts/probes/stage3-v4-p3p1-recensus.ts` in
   SMOKE mode: **40 matches @ 10,400,000 + k** (`k ∈ 0..39`), `V3P1_FLOOR`
   lowered (proposed 8, only to exercise the inherited spread/permutation engine
   as the V3-P1 script already permits via the env override — the knee and the
   census both use the REAL floor 150). The smoke publishes, per affected extended
   child, the **moment RATE per match** `r = smoke_child_moments / 40`, plus the
   §5 proxy metrics and the §6 EPS re-assert.
2. **The #105 attainability-knee rule** pins the census match count N* from the
   smoke rates (the pooled-MDL formula is RETIRED, #105.4/#107.2(vi) — it sizes a
   pooled estimand while the claim is per-cell). For each affected extended child,
   `N_child = ceil(150 / r)` (the matches to reach the floor); the attainability
   curve `count(N) = #{children : N ≥ N_child}`; the plateau `= #{children :
   r > 0}` (every child that is EVER attainable). **N\* = the smallest N on a
   50-step grid (step = N_max / 50) with `count(N) ≥ 0.95 × plateau`** (95% of
   plateau). ⚠ **FLAGGED — the sizing unit is MATCH COUNT** (the V3-P1 instrument
   is match-scaled — `V3P1_MATCHES`; V3-P1's own census ran 388 matches), unlike
   V4-P2's moment/fork N; the knee is read over match count. N\* is fixed BEFORE
   the census; no extension after sight (optional stopping foreclosed, #105.4).
3. ⚠ **FLAGGED — proposed `N_max = 1200` matches** (grid step 24). Reasoning:
   V3-P1's 388 matches cleared 45/48 BASE cells at floor 150; the bit split
   roughly halves per-child moments while the affected surface (`face='ours' ×
   {middle,theirThird} × in-power roles`) is a subset, so the children need
   ≈ 2× the base's matches to re-clear 150 (≈ 776); `N_max = 1200` gives ≈ 1.5×
   headroom over that estimate so the plateau is captured and the 95%-knee sits
   INTERIOR to the grid. The V3-P1 instrument is HEAVIER per match than V4-P2's
   (the full control + 18 fork lattice PLUS the SAT second traversal per moment),
   so `N_max` is deliberately bounded and the KNEE (not `N_max`) sets the actual
   census cost; if the knee would exceed `N_max` the stage STOPS → the commander
   (under-powered surface disclosed). The commander runs the census DETACHED
   (#49.5), as V3-P1 was.
4. **Under-powered extended children are PUBLISHED, never pooled** (#24) — they
   are dropped from the merge (§4.1) and the retained v3 base governs those
   moments; the disclosed-dead children are published, never run as gates.
5. **The census** — CENSUS mode: **N\* matches @ 10,500,000 + k** (`k ∈
   0..N*−1`), floor 150, the merge (§4), the merged-table SHA, X-DET double run.

---

## §8 — SEEDS (fresh, disjoint above every reserved band — #46.2)

Proposed bands (stage freeze §4.4, ratified #111.3); the high-water mark is the
V4-P2b census at 10.3M:

```text
re-census sizing smoke   10.4M   (10,400,000 + k, k ∈ 0..39)
re-census census         10.5M   (10,500,000 + k, k ∈ 0..N*−1, N* the knee)
new stats seeds          bootstrap 99403  ·  permutation 99503
```

⚠ **FLAGGED — proposed bands.** 10.4M / 10.5M are verified disjoint above the
10.3M high-water; 99403 / 99503 are outside the 90k–99k stats-seed set used to
date. ⚠ **FLAGGED — decoupled permutation seed.** The V3-P1 script derives the
permutation seed as `BOOTSTRAP_SEED + 1` (script L665). To pin BOTH stats seeds
the stage freeze named (bootstrap 99403 / permutation 99503), the re-census sets
an EXPLICIT permutation seed 99503 rather than the `+1` derivation — a seeds-only
parameter change, not an algorithm change (the inherited spread/permutation is a
byproduct, not the P3p-1 deliverable). The commander confirms at review.

---

## §9 — GATES + OUTPUTS + REGISTERED NON-CLAIMS

### 9.1 Gates (frozen)

| gate | class | predicate |
| --- | --- | --- |
| **X-FORK-IDENT** | HARD (V3-P1 form) | the fork-fidelity family unchanged: clone coverage 100% (`clonesTaken == moments`), X5 control identity (control fork reproduces the base continuation, 1-in-25, 0 mismatched), X6 force fidelity (`unexplained == 0` UNCONDITIONAL + the derived ok-floor) |
| **clone coverage** | HARD | every sampled moment cloned (100%) |
| **X-DET** | HARD | every probe output (smoke, census, merged table) twice byte-identical; SHAs emitted + quoted |
| **X-SRC-ZERO** | HARD | `git diff --stat -- src` empty; `eyeContextBitsV4.ts` and all `src/**` byte-identical (the probe imports the P3p-0 functions, edits no src) |
| **X-MERGE-IDENT** | HARD | (i) merged base projection re-hashes to `tableSha 171a6dad…6559f`; (ii) the re-census's own base = `child0 ⊎ child1 ⊎ UNKNOWN` exactly, per affected cell (§4.3) |
| **X-EPS-REASSERT** | HARD | the sim's `offsideAtKick` epsilon literal == `OFFSIDE_EPS` (0.2), read at run start (§6) |
| **X-FP-PROD** | HARD | production fingerprint `57b0bdab…c673` unchanged, every `eye.v4` flag OFF |
| **seed disjointness** | HARD | 10.4M / 10.5M disjoint above 10.3M; stats 99403 / 99503 outside the used set (§8, §RESULT verify) |

### 9.2 Outputs

* `docs/world-model/data/stage3-v4-p3p1-sizing-smoke.json` — the smoke:
  per-child moment rates + attainability curve + N\*, the §5 proxy metrics + the
  frozen proxy DECISION (proxy vs strict) with its inputs, the §6 EPS re-assert,
  the pin confirmations (§10).
* `docs/world-model/data/stage3-v4-p3p1-recensus.json` — the census run:
  coverage, the X-family gates, the per-extended-child prices + CIs, the UNKNOWN
  buckets, receipts (#49.3), the inherited V3-P1 summary (primary/PC/gradient/SAT).
* `docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json` — **the
  deliverable**: the v3 base cells copied byte-identical + the in-power
  bit-children, `mergedTableSha` quoted, X-MERGE-IDENT proven.

### 9.3 Registered non-claims

* **P3p-1 prices cells, builds no consumer, changes no behaviour.** The bits stay
  observability-only until P3p-2; the in-support law is NOT exercised here (it is
  a consumption law); no `src/**` is wired.
* **Nothing ships (Road B).** Every EDS flag dormant, `stationEye` null, the
  `eye.v4` flags absent in production, the fingerprint `57b0bdab…c673` unchanged.
* **No deployment claim** (#110.3): pricing a cell licenses nothing; the merged
  table is consumed only under the P3p-3 measurement battery, and even a clean
  cure there certifies a MEASUREMENT, not a ship.
* **No hand-coded tactic (I1), percept-honest (I2), no free hand-weights (I3), no
  new channel (I8).** The bits enter only through this priced re-census and are
  keyed only where the percept supports them (named abstention → base); the
  disjoint-scope keeps every cell a clean binary split; no gene/attribute/percept
  channel is added.

---

## §10 — INTERPRETIVE CHOICES FLAGGED FOR THE COMMANDER (consolidated)

Every choice is the executor's operationalisation where the stage freeze /
#111 / #112 fixed the FORM but not the last detail; each re-appears in the probe's
`deviations` block.

1. **The re-census adds a PERCEPT READ** (§2.2) — `m.perceivedSnapshot(body)` on
   the forced body, a read V3-P1 never made (v3 keyed on TRUE own-state only).
   Required by I2; read-only; taken on the same base state the clone is cut from.
2. **The scope cut applies to KEYING / MERGE, not sampling** (§3) — the V3-P1
   sampling loop runs verbatim (all contexts, side-alternating), preserving the
   rotation/spacing/counts and the X4/X5/X6 fork identities; only which cells
   receive bit-children is scoped.
3. **The disjoint-scope 9/9 candidate split** (§2.3) — forward `dx>0` (angles
   0/60/300) → offside; behind `dx≤0` (angles 120/180/240) → delivery; the joint
   4-way keying rejected for power; the PC/gradient/SAT arms run bit-agnostic.
4. **UNKNOWN feeds the base only; the split is THREE-way `{0,1,UNKNOWN}`** (§2.4,
   §4.3) — the UNKNOWN bucket is the abstention anchor and is load-bearing for
   X-MERGE-IDENT (ii).
5. **The merged base is COPIED from the committed v3 table, not recomputed on the
   re-census seeds** (§4.1) — the consumer reads a bit-child (10.5M) when
   readable+in-power, else the retained v3 base (9.11M); a base-vs-child
   provenance split. The doc's most subtle choice.
6. **X-MERGE-IDENT part (ii) checks the re-census's OWN base (10.5M), not the
   copied v3 base (9.11M)** (§4.3) — the exact-partition X-form is an internal
   consistency check, never a cross-census equality claim.
7. **The `widthHeld` genuine-0 PROXY decision rule** (§5) — proxy adopted iff
   `p0_proxy ∈ [0.50, 0.95]` AND `p0_obsCount_median ≥ 2`, else strict; fires
   ONCE at smoke sight, disclosed, never revisited; decided at the probe keying
   layer (src untouched); carried to P3p-2.
8. **X-EPS-REASSERT is a SOURCE-TEXT tripwire** (§6) — reads the `offsideAtKick`
   epsilon literal in `mechanics.ts`; the behavioural recovery rejected (private
   function; core untouched). Fails closed on a numeral change OR a missing anchor.
9. **Sizing: match-count knee, `N_max = 1200` (grid step 24), 95%-of-plateau
   over rate-derived `N_child`** (§7) — the pooled-MDL retired; under-powered
   children published-not-pooled → base fallback; census detached (#49.5).
10. **Proposed seed / stats bands 10.4M / 10.5M / bootstrap 99403 / permutation
    99503** (§8), with the permutation seed DECOUPLED from the V3-P1 `+1`
    derivation to pin both explicitly — all verified disjoint; commander confirms.

---

**FREEZE HONESTY.** Every criterion above was written citing ONLY already-published
sources — rulings #112 (#112.2(i)/(ii)/.3), #111, #110; the stage-level freeze
[`STAGE3-V4-P3-PARTIAL.md`](STAGE3-V4-P3-PARTIAL.md) §3/§4; the v4 contract
I1–I11; the committed V3-P1 table's `tableSha 171a6dad…6559f` and its published
coverage (388 matches, 45/48 in-power); a READ-ONLY reading of the V3-P1 census
instrument, the P3p-0 bit module `eyeContextBitsV4.ts` (function names + tri-state
contracts + pinned constants), the sim's offside machinery (`mechanics.ts:224`,
`formations.ts:466`) and the percept API (`Match.ts:2813`), each file:line cited;
the fingerprint `57b0bdab…c673`. **No `docs/world-model/data/*.json` numeric body
was opened beyond the v3 table's SHA / coverage header, and nothing was built or
run before this document is committed.** This freeze RETURNS TO THE COMMANDER; the
probe `scripts/probes/stage3-v4-p3p1-recensus.ts` is a future authorized step.
