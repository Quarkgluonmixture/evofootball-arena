# Stage III V4-P3p-2 — THE PARTIAL CONSUMER (extended-key consumption + the five arms + the fork-grain mediators)

Status: **PRE-REGISTERED 2026-08-02, FROZEN BEFORE ANY BUILD OR RUN. Doc only;
zero `src/**`, zero probe, zero simulation in this step.** Opened by ruling
**#116.4** (the user's #109.4 "部分消费者先行" line, now four sub-stages deep:
P3p-1 CLOSED and banked the merged table). This freezes the **P3p-2** sub-stage:
the v3 role eye consuming the P3p-1 **merged extended-key table** (`39662445…
9d6105`) under the already-built in-support law (the two S bits now materially
priced), the **five-arm fork-grain consumer probe** (R0 / R1p / R2p / R3p /
R3v3), and its **pre-named fork-grain mediators + consumption ledger**. It also
SPECIFIES (does not build) the ONE authorized `src/**` change P3p-2a needs: the
extended-key *consumption* upgrade at the existing P3p-0 seam, behind the
EXISTING `eye.v4` flags (**no new flags**). **This freeze RETURNS TO THE
COMMANDER for review; P3p-2a (src wiring) and P3p-2b (the probe) are FUTURE
authorized steps** (freeze → review → build → run; §0.0 / #86.2). **Nothing ships
(Road B); the measurement battery is P3p-3, not this stage.**

Authority: **#116** (P3p-1 CLOSES; the merged table `39662445…9d6105` banked;
#116.2 the OFFSIDE INVERSION adjudicated as a *measured caution* — the bit stays,
the battery adjudicates, the decomposition arm is P3p-3's; **#116.4 the P3p-2
charter**: extended-key lookup behind the existing P3p-0 flags, bit computed
percept-honestly at the decision, abstention/under-powered → base, the in-support
law gating consultation, the merged table as the probe arms' table source, the
five-arm structure, the fork-grain mediators pre-named) · **#115** (the smoke:
STRICT keying adopted — widthHeld=0 → base; N=480) · **#114/#113/#112/#111** (the
P3p-1 build/prereg/ratification chain; the perceivedSnapshot throwaway-clone fix
#114.2; the P3p-0 dormant seam #112) · **#110** (V4-P3-PARTIAL opens as a
MEASUREMENT; the three remedies; the pre-declared verdict form) · **#109** (CLASS
H falls to A4; the ASSIGNMENT-shaped conclusion) · the stage freeze
[`STAGE3-V4-P3-PARTIAL.md`](STAGE3-V4-P3-PARTIAL.md) **§2** (the in-support law),
**§5** (the five-arm structure + the fork-grain mediators; R1p/R2p prunable),
**§6/§7** (the battery is P3p-3; the staging table) · the V3-P2 consumer
[`STAGE3-V3-P2-ROLE-CONSUMER.md`](STAGE3-V3-P2-ROLE-CONSUMER.md) **§3–§7** (the
fork-grain instrument this stage re-points at the PARTIAL eye — fork at station
decisions, DEV on the perceived-attainable denominator, control reproduction, the
X4–X7 gates, DEV/PC) · the P3a deployment
[`STAGE3-V3-P3A-DEPLOYMENT.md`](STAGE3-V3-P3A-DEPLOYMENT.md) **§2** (the P2-B §4.1
adoption ladder — R1 one-body gid `1 + (matchSeed mod 5)`, R2 one-team, R3 both) ·
the v4 contract [`STAGE3-V4-LONG-HORIZON-PRICE.md`](STAGE3-V4-LONG-HORIZON-PRICE.md)
(**I1** no hand-coded tactic; **I2** percept-honest with named abstention classes;
**I3** no free hand-weights; **I8** no new gene/attribute/percept; **I4/Road B**
nothing ships) · #46.2 (seed disjointness) · #48.4 (thresholds pinned ex-ante) ·
#49.3 (receipts) · #20 (cluster = match seed) · #105 (attainability-knee N) ·
#75.2 (explicit-boolean flag opt-in) · Road B.

Data this freeze rests on (committed, SHA'd — freeze honesty, every number below
traces here): the **P3p-1 merged table**
[`data/stage3-v4-p3p1-merged-role-census-table.json`](data/stage3-v4-p3p1-merged-role-census-table.json)
— `mergedTableSha` **`39662445…9d6105`**, `baseTableSha`/`baseTableShaObserved`
**`171a6dad…6559f`** (the committed V3-P1 base, reproduced byte-for-byte,
`xMergeIdent.pass = true`), `keying = "strict"`, `mergedChildCount = 323`
(delivery bit=1 **126**; offside bit=0 **64** / bit=1 **133**; #116.1), structure
`base[ctx][role][cand]` ⊎ `children[family][ctx‖role][cand][bit]`, `family ∈
{delivery, offside}`, `bit ∈ {"0","1"}` (delivery carries ONLY `"1"` under STRICT
keying, #115.1) · the P3p-1 §RESULT reads (#116): the offside child-vs-base Δ
**+0.049 (n=133)** bit=1 / **−0.090 (n=64)** bit=0 — THE OFFSIDE INVERSION; the
delivery behind/level Δ **−0.048** when width is held; the STRICT-keying UNKNOWN
share **60.7 %** (the delivery bit fires on ≈ 39 % of in-scope moments) · the
already-built P3p-0 seam (`3ce528f`, proven dormant, #112): the pure percept
functions `evaluateInSupport` / `widthHeldBit` / `perceivedOffsideLine` /
`beyondLineBit` and the pins `SUPPORT_STALE_TICKS = WIDTH_STALE_TICKS =
LINE_STALE_TICKS = 30`, `WIDE_EDGE = BOX_WIDTH/2`, `OFFSIDE_EPS = 0.2`
([`src/ai/eyeContextBitsV4.ts`](../../src/ai/eyeContextBitsV4.ts) L20–192); the
in-support gate and the observability-only bit tally
([`src/ai/actionExecutor.ts`](../../src/ai/actionExecutor.ts) L816–868); the v3
lookup `priceApproachesV3` + `candidateInPowerRole`
([`src/ai/stationEye.ts`](../../src/ai/stationEye.ts) L473–524, `CELL_FLOOR = 150`
L36); the eye config `stationEye.v3` / `stationEye.v4`
([`src/sim/Match.ts`](../../src/sim/Match.ts) L651–711) · the production
fingerprint **`57b0bdab…c673`**.

**World / HEAD / flags (#26.5 / #67.3).** Every P3p-2 run uses the **ENRICHED**
world verbatim (`edsPerceivedDefence + edsPerceivedChoice + edsValueAxis` ON,
`c5Hold`, `c6Carry`, `c7Windup` ON, `c5TouchFork` off) — the substrate the v3
table and the merged children were censused on. In production every EDS flag is
OFF, `c6Carry`/`c7Windup` default `false`, `stationEye` is null, the three
`eye.v4` flags are absent, and the fingerprint **`57b0bdab…c673`** stays unchanged
throughout (X-FP-PROD, Road B).

---

## §1 — WHAT P3p-2 IS (the one thing it establishes)

P3p-1 built and certified the merged table. P3p-2 is the FIRST time the partial
eye **consumes** it in a live match: the v3 role eye, gated by the in-support law,
reading the bit-extended cell where a bit is readable and its child is in-power,
falling back to the retained v3 base cell everywhere else. P3p-2 is a **consumer
probe in the V3-P2 heritage** (fork at station decisions; DEV on the
perceived-attainable denominator; control reproduction) — NOT the whole-match
watchability battery (that is P3p-3, §6/§7 of the stage freeze).

**The one question P3p-2 answers.** *Is the partial eye a MEASURABLE consumer of
the merged table — does it deviate above the DEV floor, does its inverted twin
measurably hurt (PC), and does each of the three remedies actually FIRE at
consumption (the ledger) and move its pre-named fork-grain mediator in the
pre-declared direction?* This is the instrument-validity gate the P3p-3 battery
needs before it can interpret payoff (the V3-P2 §5.1 "attribution the fork buys"
precedent; the #44.3 labelled-data convention). **No deployment claim is made
under any reading; no watchability verdict is read here** — those are P3p-3's.

⚠ **The OFFSIDE INVERSION rides into this stage as a measured caution, NOT a
verdict (#116.2).** P3p-1 found the short-horizon axis PREFERS beyond-line
candidates (child-vs-base +0.049 bit=1 vs −0.090 bit=0). The offside bit
nonetheless **STAYS in the partial eye** here (#116.2(i) — composition effects may
differ; the battery adjudicates). P3p-2 does NOT split the offside contribution
out — the **R3p-noOffside decomposition arm is P3p-3's** (#116.2(ii)), named there,
not built here. P3p-2 simply reports the offside bit's consumption ledger and the
offside-rate mediator like the other two remedies.

---

## §2 — THE CONSUMPTION SEMANTICS (src, behind the EXISTING flags — no new flags)

### 2.1 The in-support law is ALREADY wired (P3p-0); P3p-2 merely ARMS it

The in-support law is not new src. It is already the live gate at
[`actionExecutor.ts`](../../src/ai/actionExecutor.ts) L816–826: when
`eye.v4?.inSupportLaw === true`, `evaluateInSupport(snap, match.phase ===
'playing')` runs percept-honestly on THIS body's own snapshot and every
out-of-support outcome (`E-OOS-PHASE/-UNSEEN/-INFLIGHT/-STALE`) is a counted
`holdIncumbent()`. P3p-0 proved this **flag-off bit-identical** (X-OFF-IDENT) and
**dormant** (#112); P3p-2 is the FIRST time the flag is set to `true` in a **live
consuming match** (the P3p-1 census evaluated the support predicate on TRUE state
at fork grain, never as a live percept-honest match gate). So the law's live
percept-honest behaviour — closing the ~46 % out-of-support extrapolation surface
(P0b §RESULT) — is genuinely first EXERCISED here, though it is not first BUILT.
No src change for the law; only its flag flips on in the R1p/R2p/R3p eye config.

### 2.2 ⚠⚠ THE EXTENDED-KEY LOOKUP + the child-vs-base FALLBACK ORDER (load-bearing — the ONE behavioural upgrade)

Today the two bits are computed **observability-only** — tallied to the trace when
`trace !== undefined && eye.v4?.deliveryBit/offsideBit === true`
([`actionExecutor.ts`](../../src/ai/actionExecutor.ts) L843–858) — and the priced
cell is still the **plain** v3 lookup `priceApproachesV3(eye.v3.roleTable,
eye.v3.control, context.key, p.role, …)` (L862–868), which reads only
`base[ctx][role][cand]`. **P3p-2a lifts the bit computation OUT of the
`trace`-guard (it becomes load-bearing) and replaces the plain lookup with an
extended-key lookup that, per candidate, resolves CHILD-or-BASE and prices the
resolved cell against the SAME v3 control.**

**The frozen per-candidate resolution (the fallback order — flagged, ⚠⚠).** For a
station decision that PASSED the in-support gate (§2.1), for the body's own role
`role` and perceived `context.key`, over the 18 `EYE_LATTICE` candidates, each
candidate `cand` resolves its priced cell thus:

```text
FAMILY(cand)  =  offside  if cand.dx > 0  (a FORWARD/toward-goal candidate)   ← §3.3 tie-break
                 delivery if cand.dx < 0  (a behind/level candidate)          (no dx=0 in the lattice)
IN-SCOPE(cand) =  the extended key children[FAMILY][ctx‖role][cand.id] EXISTS
                  (⇔ the (face='ours' × threat∈{middle,theirThird} × role × cand) re-census scope, §4.1 freeze)

resolve(cand):
  if NOT IN-SCOPE(cand)                          → BASE  base[ctx][role][cand.id]          (unaffected — v3 verbatim)
  bit = (FAMILY == delivery) ? widthHeld(moment) : beyondLine(cand)   ← §3, computed percept-honestly AT the decision
  if bit == 'UNKNOWN'                            → BASE  (abstention never invents a value — §2.2/§3 of the freeze)
  child = children[FAMILY][ctx‖role][cand.id][ String(bit) ]
  if child == undefined OR child.n < CELL_FLOOR OR child.underPowered → BASE   (under-powered / dropped child → retained anchor)
  else                                            → CHILD child                 (the priced refinement)
```

Then price EXACTLY as v3: `adv(cand) = val(resolve(cand)) − val(control[ctx][role])`,
`val = w_s·score − w_c·concede`, NEUTRAL `w_s = w_c = 0.5`; argmax over the
`candidateInPowerRole`-eligible candidates; deviate iff best adv > 0; INVERTED
takes argmin (the PC). Ties / empty / abstention resolve NO OVERRIDE, each its own
counted class — **v3 `priceApproachesV3` semantics verbatim**, only the per-candidate
*value source* is refined.

⚠ **FLAGGED (load-bearing) — the control is NOT bit-split.** The child refines the
CANDIDATE cell only; the incumbent baseline stays the v3 per-`(ctx×role)` control
(`eye.v3.control`), exactly as the P3p-1 re-census recovered it (the census split
the base cell's *moments* into bit-children but recovered ONE control level per
`(ctx×role)`; the merged artifact carries no per-bit control). So `adv =
val(child) − val(baseControl)`. Alternative (a bit-split control) is REJECTED: it
was never censused, and I3/#110.4 forbid consuming an unpriced level. Surfaced for
the commander.

⚠ **FLAGGED — STRICT keying is realised by ARTIFACT SHAPE, not a code special-case.**
Under STRICT keying (#115.1) the delivery family carries only `"1"` children. A
delivery candidate with `widthHeld = 0` therefore hits `child == undefined` and
falls to BASE by the ordinary fallback — no `widthHeld=0 → UNKNOWN` remap is
coded; the census already encoded strict keying by omitting the `"0"` children.
The consumption effect ("widthHeld=0 → base", #115.1) is identical either way.
The eligible-candidate SET and the argmax structure are unchanged from v3 (every
base-in-power candidate stays eligible; children only refine values), so the
partial eye NEVER prices fewer candidates than the v3 eye — it re-prices some of
them.

### 2.3 ⚠⚠ THE TABLE-INJECTION MECHANISM (load-bearing — how the merged artifact reaches the eye)

The merged table reaches the eye as a **probe-injected config artifact, NEVER
bundled into any `src/**` production path** (the standing rule for every eye table
since v1; `stationEye` is null in the shipped game). FROZEN mechanism (⚠ flagged):

* **The BASE stays the committed v3 table.** Every v3-consuming arm injects
  `eye.v3.roleTable = <committed V3-P1 table, SHA 171a6dad…6559f>` and
  `eye.v3.control = <its recovered control, 968349ff…acc1c>` — identical for R3v3
  and R3p, so the base cells both arms read are literally the same object (R3v3 ≡
  plain v3, byte-for-byte).
* **The CHILDREN ride in a NEW OPTIONAL config field**, injected ONLY for the
  PARTIAL arms (R1p/R2p/R3p): a sibling of `eye.v3.roleTable`, proposed
  **`eye.v3.children: MergedChildTable`** where `MergedChildTable =
  Readonly<Record<'delivery'|'offside', Record<string, Record<string, Record<'0'|'1',
  RoleCell>>>>>` (the `children` sub-object of the P3p-1 artifact verbatim), plus
  **`eye.v3.mergedTableSha: string`** for the X-MERGE-SHA assertion. The extended
  lookup (§2.2) consults `eye.v3.children` ONLY when the matching `eye.v4` flag is
  on AND the candidate is in-scope; absent children (R0/R3v3) ⇒ the plain v3
  lookup runs unchanged.
* ⚠ **FLAGGED interpretive choice — WHERE the children field lives.** Proposed on
  the `eye.v3` block (the children ARE an extension of the v3 role table; their
  base is the v3 table). The alternative — a `eye.v4.mergedChildren` field
  co-located with the flags — is noted; either way the ONLY config file touched is
  `Match.ts`, and the three `eye.v4` booleans remain the sole behaviour gates (no
  new flag). Frozen on `eye.v3`; flagged for the commander.

The probe LOADS `data/stage3-v4-p3p1-merged-role-census-table.json` at build,
asserts `mergedTableSha == 39662445…9d6105` and that `base` rehashes to
`171a6dad…6559f` (X-MERGE-SHA), injects `base` as `roleTable` and `children` as
`children`. No table, no children, no SHA is ever written into `src/**`.

### 2.4 THE NAMED `src/**` FILES + the X-OFF-IDENT re-proof (the AUTHORIZED change)

P3p-2a is the ONE authorized `src/**` change of this stage. The **X-SRC-ZERO
scope INVERTS** for it (per the stage freeze §7 P3p-2 row / #116.4): the gate is no
longer "`src` byte-identical" but **"ONLY the NAMED files changed"** —

| file | change |
| --- | --- |
| [`src/ai/actionExecutor.ts`](../../src/ai/actionExecutor.ts) | lift the two bits out of the `trace`-guard (load-bearing when their flag is on); replace the L862–868 plain `priceApproachesV3` call with the extended-key lookup (§2.2); increment the new child-vs-base ledger counters |
| [`src/ai/stationEye.ts`](../../src/ai/stationEye.ts) | the new extended-key lookup fn (proposed `priceApproachesV3Partial`, a thin refinement wrapping the L490 `priceApproachesV3` value/argmax logic); the `MergedChildTable` type; the new `StationEyeTrace` ledger fields (child/base read counts by family) |
| [`src/sim/Match.ts`](../../src/sim/Match.ts) | the optional `children` + `mergedTableSha` fields on the `stationEye.v3` config block (§2.3) |

[`src/ai/eyeContextBitsV4.ts`](../../src/ai/eyeContextBitsV4.ts) is **UNCHANGED**
(the pure bit functions were built at P3p-0). **X-OFF-IDENT is RE-RUN after this
src change** (HARD): with all three `eye.v4` flags absent/false, consumption is
byte-identical to the v3 eye across the P3p-2 seeds — the flag-off identity pin the
consumption-path edit could break. **X-FP-PROD** re-asserts `57b0bdab…c673`
(flags off) and **X-SRC-ZERO(named)** asserts `git diff --stat -- src` lists ONLY
the three files. `tsc` clean, `vitest` green (the P3p-0 #75 exhaustive gate check
re-run).

---

## §3 — THE ARMS (the five-arm fork-grain consumer probe)

### 3.1 The partial eye

`PARTIAL eye = v3 role eye (priceApproachesV3 core) + the in-support law (§2.1) +
the extended-key lookup over the merged children (§2.2)`. NEUTRAL weights (`w_s =
w_c = 0.5`; I3 — the bits enter ONLY through the priced re-census, no free
hand-weight). Config: `arm: 'neutral'`, `v3: { roleTable, control, children,
mergedTableSha }`, `v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true }`.

### 3.2 The five arms (stage-freeze §5.2 verbatim) + the PRUNE RULE

Paired same-seed across every arm (#20; cluster = match seed). The P2-B §4.1
adoption ladder, arming the eye across scope:

```text
R0     CONTROL      stationEye = null                         — the paired ENRICHED baseline (#68.2)
R1p    ONE BODY     PARTIAL eye, scope {kind:'body', gid=1+(matchSeed mod 5)} on side 0  (P2-B §4.1 VERBATIM)   [PRUNABLE]
R2p    ONE TEAM     PARTIAL eye, scope {kind:'team', side:0}                                                     [PRUNABLE]
R3p    BOTH TEAMS   PARTIAL eye, scope {kind:'both'}          ← the arm every gate binds on
R3v3   BOTH TEAMS   PLAIN v3 eye, scope {kind:'both'}, NO eye.v4 flags, NO children     ← the ATTRIBUTION baseline, re-run on the new seeds
```

Two paired attribution contrasts (stage freeze §5.2): `R3v3 − R0` = the eye's own
effect (a sanity read against the banked P3a picture on fresh seeds); `R3p − R3v3`
= **the remedies' effect** — the contrast this stage exists to expose at fork
grain.

⚠ **FLAGGED — the PRUNE RULE for R1p/R2p (disclosed at the smoke).** R1p/R2p are
the **saturation gradient** (P3a §2: "R1/R2 are the saturation gradient"), not the
primary measurement; the minimal complete set is R0 / R3p / R3v3 (which already
gives all three of `R3p−R0`, `R3p−R3v3`, `R3v3−R0`). **Rule:** at the P3p-2b
sizing smoke, the wall-cost per arm is measured; if running all five arms at the
chosen N exceeds a **pre-disclosed wall-cost budget**, R1p and R2p are PRUNED (the
gradient rungs drop first, R3p/R3v3/R0 kept). The prune decision is DISCLOSED at
the smoke, **before the gate-bearing run**, and is not re-cut after sight (the
optional-stopping foreclosure, #105.4). If wall-cost does not bind, all five run.

### 3.3 The V3-P2 heritage instrument (fork at station decisions; DEV / PC; control reproduction)

P3p-2b re-points the V3-P2 consumer instrument
([`STAGE3-V3-P2-ROLE-CONSUMER.md`](STAGE3-V3-P2-ROLE-CONSUMER.md) §3–§7) at the
PARTIAL eye. The arms play paired same-seed matches; at each sampled station
decision the probe takes the **CONTROL fork** (the incumbent's continuation, X5)
alongside the arm's own eye choice, warming the percept 15 ticks (0.25 s) before
each fork (V3-P2 §3.3(2)); the percept read is taken on a **throwaway clone**
(the #114.2 fix — `perceivedSnapshot` mutates body memory with eager perception
off, so the base match must be left untouched). The gate battery is V3-P2 §5.3
verbatim, re-pointed:

* **DEV (HARD).** The PARTIAL eye's NEUTRAL deviation share on the
  **perceived-attainable denominator** ≥ the pinned floor. ⚠ **FLAGGED — the
  denominator now also requires IN-SUPPORT** (warm percept AND `IN_SUPPORT` per
  §2.1 AND an in-power own-role cell): the in-support law shrinks the denominator
  vs the plain v3 eye, so the floor's *reachability* is re-confirmed at the smoke
  before it is pinned as a gate (V3-P2 §7 re-measured its floor at the smoke
  identically). Carry the V3-P2 floor **≥ 0.22** unless the smoke shows the
  in-support restriction makes it structurally unreachable — in which case the
  stage returns to the commander (reading (B), §6). Below the floor ⇒ no payoff
  interpreted (#44.3 labelled-data convention).
* **PC (HARD).** An INVERTED partial-eye fork (argmin) resolves measurably BELOW
  control, pooled, 95 % cluster-bootstrap upper < 0. If the argmin does not hurt,
  the family is unmeasurable ⇒ FAIL, no reading published.
* **X4 clone (HARD):** 100 % clone coverage of sampled moments.
* **X5 control-fork identity (HARD):** the no-eye fork reproduces the base
  continuation bit-identically for the full `H_concede` (10 s), unexplained
  exactly 0.
* **X6 force fidelity (HARD, per-record #43.3):** on live override ticks the
  applied target equals the engine's own `meet` to 1e-9, unexplained exactly 0.
* **X7 determinism (HARD):** two `runExperiment()` calls byte-identical; result
  SHA emitted.

---

## §4 — THE FORK-GRAIN MEDIATORS (pre-named directions) + the CONSUMPTION LEDGER

Paired per arm (`R3p − R0` and `R3p − R3v3`), cluster CIs (#20, cluster = match
seed), decomposed by role where the P3a mediator is (#84.2). Pre-registered
BEFORE the run:

| mediator | instrument | remedy it indexes | pre-named direction under the remedies |
| --- | --- | --- | --- |
| **offside rate** | offsides/match, both sides | offside bit | quiet (toward R0) — ⚠ but see #116.2: the P3p-1 sign INVERTED, so a NULL / worsening here is a live possibility, REPORTED not gated |
| **delivery events** | long-ball / cross / cutback initiations per match | delivery bit | recover toward the P3a band |
| **restart resettle** | restart ticks/match | in-support law | quiet (toward R0) |
| **rest-slot occupancy** | DEGEN-RESTDEF I5(b) designated slot | — (UNREMEDIED, CLASS H) | residual persists — REPORTED (the A4 target size, #109.3) |

These are **fork-grain / per-match mediators REPORTED here**, NOT watchability
verdicts (those are P3p-3's pre-declared verdict form, stage freeze §6.2). No
mediator is a stop gate at P3p-2; each is published with its CI and its pre-named
direction, so the P3p-3 battery reads them against an already-declared
expectation.

**The CONSUMPTION LEDGER (per arm, receipted #49.3).** The trace already carries
the in-support and bit counters
([`stationEye.ts`](../../src/ai/stationEye.ts) L173–185); P3p-2a adds the
child-vs-base read counts. Published per arm:

* **in-support abstentions by class** — `v4InSupport` vs `v4OosPhase / v4OosUnseen
  / v4OosInflight / v4OosStale` (does the law close ≈ the measured out-of-support
  surface?).
* **bit reads by family / bit / UNKNOWN** — `v4WidthHeld0/1/Unknown`,
  `v4BeyondLine0/1/Unknown` (does the delivery bit fire on ≈ 39 % of in-scope
  moments as #116.3 measured — i.e. ≈ 60.7 % UNKNOWN under STRICT keying; does the
  offside bit read at its census rate?).
* **child-vs-base read counts by family** — the NEW ledger fields: over in-scope
  priced candidates, how often the resolved cell was a CHILD vs the retained BASE
  (delivery: only bit=1 can be a child; offside: bit=0 and bit=1). A remedy whose
  child-read count is ≈ 0 never fires at consumption ⇒ reading (C), §6.

---

## §5 — SIZING / SEEDS (smoke → N → run; publish-not-pool)

### 5.1 The sizing smoke (P3p-2b) + the N rule

A sizing smoke (proposed **40 matches**, the P3p-1 smoke size) runs first and
publishes, per arm: (i) the partial-eye perceived-attainable share + the realised
DEV (is the floor reachable under the in-support restriction, §3.3); (ii) the
per-match mediator rates and their cluster-CI half-widths vs match count; (iii)
the wall-cost per match across the five arms (the prune input, §3.2); (iv) the
consumption-time perceived-`ageTicks` distributions confirming
`SUPPORT_STALE_TICKS / WIDTH_STALE_TICKS / LINE_STALE_TICKS = 30` (#48.4; no re-cut
after sight — confirm the pin or return).

**The N rule (flagged).** The consumer table is FIXED (P3p-1 closed it), so no
per-cell census floor binds here; the binding constraint is CI width / wall-cost.
FROZEN: **N\*** = the smallest match count (in fixed steps) at which the primary
mediators' cluster-CI half-widths fall below a **pre-disclosed target** AND the
wall-cost stays within the **pre-disclosed budget** — a **wall-cost-driven N with
a disclosed rule** (the #105/#113/#115 genre). *If* a per-cell floor unexpectedly
binds (it should not — the table is frozen), the #105 attainability-knee rule
applies instead. N fixed before the gate-bearing run; optional stopping foreclosed
(#105.4). Under-powered mediator cells are **published, never pooled** (#24).

### 5.2 SEED BANDS (fresh, disjoint — ⚠⚠ proposed, one COLLISION flagged)

The block-walk high-water mark is the P3p-1 census (480 @ 10.5M → seeds ≤
10,500,479). Proposed NEW bands (task-directed):

```text
P3p-2b sizing smoke   11.0M   (11,000,000 + k)          [#117 amendment]
P3p-2b consumer run   11.1M   (11,100,000 + k, k over the disclosed-rule N)   [#117 amendment]
new stats seeds       bootstrap 99703  ·  permutation 99803   (99603 is RESERVED for the P3p-3 battery, stage freeze §6.4)
```

⚠⚠ **FLAGGED (top ambiguity) — 10.7M / 10.8M COLLIDE with the ratified P3p-3
battery block.** The stage freeze §6.4, RATIFIED by #111 (bands
"10.4M/10.5M/10.6M + stats 99403/99503/99603"), reserves the battery as
`10,600,000 + blockIndex·100,000 + k, blockIndex ∈ 0..3` = **10.6M .. 10.9M**. The
proposed P3p-2 bands 10.7M and 10.8M fall INSIDE that reservation (blockIndex 1
and 2) — a #46.2 disjointness violation as written. **Resolution proposed
(commander decides at review):** since P3p-2 now precedes P3p-3, and P3p-3 is a
future authorized step whose exact base is not yet frozen, **RE-BASE the P3p-3
battery block above the P3p-2 run** at the P3p-3 pre-reg (e.g. base 11.0M, blocks
11.0M..11.3M, keeping bootstrap 99603) — the low-friction fix that honours the
task-directed 10.7M/10.8M here. The alternative is to MOVE P3p-2 above the whole
battery reservation (smoke 11.0M / run 11.1M). Both preserve disjointness; I
recommend the re-base and flag it as the single most important item for review.

**RESOLVED AT COMMANDER REVIEW (#117): P3p-2 MOVES — smoke 11.0M, run
11.1M (the bands above are amended accordingly). The battery's ratified
reservation (10.6M–10.9M, #111.3) is NOT touched: a ratified freeze
outranks a bands-in-brief proposal, and the collision originated in the
commander's own dispatch brief (owned in #117). No P3p-2 seed had been
drawn.**

Stats seeds `99703 / 99803` are verified fresh (disjoint from the used
90k–99k set and from the reserved 99603). Publish-not-pool.

---

## §6 — GATES + PRE-NAMED READINGS (stop-at-commander; NO deployment claim)

### 6.1 Gates (frozen)

| gate | class | predicate |
| --- | --- | --- |
| **X-OFF-IDENT** | HARD (re-run after P3p-2a) | all three `eye.v4` flags absent/false ⇒ consumption byte-identical to the v3 eye across the P3p-2 seeds |
| **X-SRC-ZERO(named)** | HARD | `git diff --stat -- src` lists ONLY the three §2.4 files; no other `src/**` touched |
| **X-FP-PROD** | HARD | production fingerprint `57b0bdab…c673` unchanged, every flag OFF (Road B) |
| **X-MERGE-SHA** | HARD | the loaded merged table's `mergedTableSha == 39662445…9d6105` AND its `base` rehashes to `171a6dad…6559f` (= the injected v3 base) |
| **X4 clone** | HARD | 100 % clone coverage of sampled moments (V3-P2 form) |
| **X5 control-fork identity** | HARD | the no-eye fork reproduces the base continuation bit-identically for `H_concede`; unexplained exactly 0 |
| **X6 force fidelity** | HARD, per-record | applied target == engine `meet` to 1e-9 on override ticks; unexplained 0 |
| **X7 / X-DET** | HARD | two `runExperiment()` calls byte-identical; result SHA emitted + quoted |
| **DEV** | HARD | partial-eye NEUTRAL deviation share on the perceived-attainable (in-support) denominator ≥ the smoke-confirmed floor (carry 0.22) |
| **PC** | HARD | INVERTED partial-eye resolves below control, pooled, 95 % cluster-bootstrap upper < 0 |

Any HARD gate failing ⇒ **STOP at the commander** (the measurement is invalid or
the family is unmeasurable). The mediators (§4) are **REPORTED, never gating** at
P3p-2.

### 6.2 Pre-named readings (frozen ex ante)

* **(A) THE CONSUMER FIRES AS BUILT.** DEV ≥ floor; PC resolves; the ledger shows
  the in-support law closing ≈ the out-of-support surface, the delivery bit firing
  on ≈ 39 % of in-scope moments with real child reads, the offside bit reading at
  its census rate; the mediators move (offside-rate/restart quiet, delivery
  recover, rest-slot residual persists). ⇒ the partial eye is a **measurable
  consumer**; **P3p-3 (the battery) is licensed to proceed and interpret payoff.**
  NO deployment claim.
* **(B) THE CONSUMER IS UNMEASURABLE.** DEV < floor (e.g. the in-support law
  shrinks the denominator too far) OR PC does not resolve. ⇒ **returns to the
  commander** (V3-P2 reading (d)/(e) genre); the battery cannot interpret payoff
  at this grain. No reading published beyond the negative.
* **(C) A REMEDY NEVER FIRES.** The ledger shows a remedy's child-read count ≈ 0
  (its bit is always UNKNOWN / always base — e.g. the delivery children are never
  reached in live percept). ⇒ that remedy is **inert at consumption** and
  **returns to the commander LABELLED**; the other remedies still measured (a
  per-remedy, publishable measurement).
* **(D) THE CONSUMER FIRES BUT NOTHING MOVES.** DEV/PC pass, ledger fires, but the
  fork-grain mediators do not separate from R0/R3v3. ⇒ **REPORTED as-is** (a real
  finding); P3p-3 still runs, since whole-match watchability is P3p-3's grain, not
  this one's — the fork-grain null is a pre-cursor, not a verdict.

**NO deployment claim under any reading.** P3p-2 establishes instrument validity
and reports fork-grain mediators; it licenses no default-ON, no re-census, no
shipping. The watchability verdict, the cure gates, and the rest residual as the
A4 target size are ALL P3p-3's (stage freeze §6.2/§9). The OFFSIDE INVERSION's
pre-named home (a failed cure → the A4/absence family, #116.2(iii)) is P3p-3's to
trigger, not this stage's.

---

## §7 — STAGING (each sub-step pre-registers via §0.0; THIS doc is the P3p-2 freeze)

| sub-step | object | key gates |
| --- | --- | --- |
| **P3p-2a** | the src wiring: the extended-key consumption upgrade at the P3p-0 seam (§2.2), the merged-children injection field (§2.3), the child-vs-base ledger fields — the three NAMED files only (§2.4) | X-OFF-IDENT (re-run) · X-SRC-ZERO(named) · X-FP-PROD · tsc clean · vitest green |
| **P3p-2b** | the consumer probe [`scripts/probes/stage3-v4-p3p2-consumer.ts`](../../scripts/probes/stage3-v4-p3p2-consumer.ts): the five arms (§3.2), the fork-grain instrument (§3.3), the mediators + ledger (§4); smoke @11.0M → disclosed-rule N → run @11.1M (#117) | X4/X5/X6/X7 · DEV · PC · X-MERGE-SHA · X-DET · seed disjointness |

Each sub-step is a FUTURE authorized step (freeze → review → build → run,
Draft→Verify §0.0; the long run supervised by the commander's resident session,
#49.5). This document is the P3p-2 freeze only; it builds and runs nothing.

---

## §8 — REGISTERED NON-CLAIMS

* **NO deployment claim under any reading** (#110.3 / stage freeze §9). P3p-2 is an
  INSTRUMENT-VALIDITY + MEDIATOR probe; a clean pass licenses only that the P3p-3
  battery may interpret payoff. No default-ON, no re-census, no shipping.
* **Nothing ships (Road B).** Every EDS flag dormant, `stationEye` null, the three
  `eye.v4` flags absent in production, the fingerprint `57b0bdab…c673` unchanged,
  throughout. The merged table and its children live ONLY in the probe config,
  never in `src/**`.
* **No watchability verdict, no cure gate, no rest-residual claim is read here** —
  those are P3p-3's pre-declared verdict form (stage freeze §6.2). P3p-2 reports
  fork-grain mediators against pre-named directions; it does not certify any
  remedy.
* **The OFFSIDE INVERSION is carried, not resolved.** The offside bit stays in the
  partial eye (#116.2(i)); its decomposition arm and its pre-named A4/absence home
  are P3p-3's (#116.2(ii)/(iii)), not built or triggered here.
* **No hand-coded tactic (I1), percept-honest (I2), no free hand-weights (I3), no
  new percept/gene/attribute (I8).** The in-support law is generic (no named
  phase); the two bits enter ONLY through the P3p-1 priced re-census and are
  consumed only when the percept supports them (named abstention → base); NEUTRAL
  weights; the control is not bit-split; **no new flag** — the three existing
  `eye.v4` booleans gate everything.

---

## §9 — INTERPRETIVE CHOICES FLAGGED FOR THE COMMANDER (consolidated)

Each is the executor's operationalisation where #116.4 froze the FORM but not the
last detail; each re-appears in the P3p-2a/2b `deviations` block.

1. **THE CHILD-VS-BASE FALLBACK ORDER** (§2.2, load-bearing): per candidate —
   not-in-scope → base; bit UNKNOWN → base; child absent / under-powered → base;
   else child. Base is the universal retained anchor; abstention never invents a
   value; the eligible-candidate set is v3's unchanged.
2. **THE CONTROL IS NOT BIT-SPLIT** (§2.2, load-bearing): the child refines the
   candidate cell only; the incumbent baseline stays the v3 per-`(ctx×role)`
   control. A bit-split control is rejected (never censused, I3).
3. **THE TABLE-INJECTION MECHANISM** (§2.3, load-bearing): base = the committed v3
   table (both R3v3 and R3p); children ride in a NEW optional `eye.v3.children`
   field (+ `eye.v3.mergedTableSha`), injected only for the partial arms, gated by
   the existing `eye.v4` flags; NEVER bundled in `src/**`. The `eye.v4.mergedChildren`
   placement alternative is noted.
4. **STRICT KEYING BY ARTIFACT SHAPE** (§2.2): `widthHeld=0` → base falls out of
   the ordinary fallback (the delivery `"0"` children were never materialised,
   #115.1); no code special-case.
5. **THE NAMED-FILE X-SRC-ZERO SCOPE** (§2.4): the authorized change touches ONLY
   `actionExecutor.ts`, `stationEye.ts`, `Match.ts`; `eyeContextBitsV4.ts`
   unchanged; X-OFF-IDENT RE-RUN after the edit.
6. **THE R1p/R2p PRUNE RULE** (§3.2): wall-cost measured at the smoke decides;
   over budget ⇒ prune the two gradient rungs (keep R0/R3p/R3v3); disclosed before
   the run, no re-cut after sight.
7. **THE DEV DENOMINATOR + FLOOR** (§3.3): the perceived-attainable denominator now
   also requires IN-SUPPORT (the law shrinks it); the floor's reachability is
   re-confirmed at the smoke before it is pinned (carry 0.22).
8. **THE WALL-COST-DRIVEN N** (§5.1): the table is fixed, so no census floor binds;
   N\* = smallest match count meeting a disclosed CI-width + wall-cost budget (the
   #105 knee only if a floor unexpectedly binds). Publish-not-pool.
9. **THE PROPOSED SEED BANDS + THE BATTERY COLLISION** (§5.2, ⚠⚠ TOP AMBIGUITY):
   smoke 11.0M / run 11.1M (#117 amendment) / stats 99703·99803 — the originally task-directed 10.7M/10.8M fell INSIDE the
   #111-ratified P3p-3 battery reservation (10.6M..10.9M). Recommended fix: re-base
   the P3p-3 battery above 10.8M at its pre-reg (keep bootstrap 99603); alternative:
   move P3p-2 to 11.0M/11.1M. Commander decides.
10. **THE OFFSIDE-RATE MEDIATOR DIRECTION** (§4): pre-named "quiet toward R0" but
    the P3p-1 sign inverted (#116.2), so a null/worsening is a live outcome —
    REPORTED, not gated, and NOT decomposed here (P3p-3's arm).

---

**FREEZE HONESTY.** Every criterion above was written citing ONLY already-published
sources: rulings #116 (#116.1/.2/.3/.4), #115 (STRICT keying, N=480), #114/#113/
#112/#111/#110/#109; the v4 contract I1–I8/Road B; the P3p-1 merged table
[`data/stage3-v4-p3p1-merged-role-census-table.json`](data/stage3-v4-p3p1-merged-role-census-table.json)
(`mergedTableSha 39662445…9d6105`, `baseTableSha 171a6dad…6559f`, `keying strict`,
`mergedChildCount 323`, `children[family][ctx‖role][cand][bit]` structure, all read
directly); the stage freeze [`STAGE3-V4-P3-PARTIAL.md`](STAGE3-V4-P3-PARTIAL.md)
§2/§5/§6/§7; the V3-P2 consumer §3–§7 (DEV/PC, X4–X7, the fork instrument); the
P3a deployment §2 (the P2-B ladder); the committed V3-P1 base SHA `171a6dad…6559f`
and control `968349ff…acc1c`; the fingerprint `57b0bdab…c673`; and a READ-ONLY
reading of the P3p-0 `src/**` seam (`actionExecutor.ts` L816–868, `stationEye.ts`
L134–524, `eyeContextBitsV4.ts` L20–192, `Match.ts` L651–711, file:line cited).
**Nothing was built or run before this document is committed.** This freeze
RETURNS TO THE COMMANDER; P3p-2a and P3p-2b are future authorized steps.

---

## §RESULT — the AUTHORIZED runs (#119 launch): all instrument gates pass, the five-arm attribution table lands, and RETURNS to the commander

Run to completion under the commander's resident session (#49.5), the **frozen
probe as reviewed** (pre-registration PASS #117; src wiring P3p-2a PASS #118,
committed `bff06e0`; probe build PASS #119, committed `52c66f5`). Two runs, seed
families disjoint above the ratified 10.6M–10.9M battery reservation (#117
amendment; §5.2 / #46.2): the **sizing smoke** (40 matches `11,000,000 + k,
k∈0..39`) fired the disclosed N rule and the prune decision, re-confirmed the DEV
floor's reachability on the law-shrunken denominator, and confirmed the 30-tick
freshness pin; the **consumer run** ran **N = 120 matches `11,100,000 + k,
k∈0..119`**, all five arms (R0 / R1p / R2p / R3p / R3v3), keying STRICT via the
merged table's artifact shape. ENRICHED world, `stationEye` production-null,
`src/**` limited to the three P3p-2a named files, production fingerprint
`57b0bdab…c673` unchanged (X-FP-PROD PASS, Road B held, nothing shipped). Every
number below traces to the two committed data files.

### THE SIZING SMOKE (40 @ 11.0M)

40 matches on `11,000,000 + k, k∈0..39`, ENRICHED world, the five-arm PARTIAL-eye
fork-grain instrument, X-DET double-run. **Gates all PASS** (verdict verbatim:
**`SIZING SMOKE`**): X4 clone coverage **3,646 / 3,646 = 1.0** (`forkMoments 3,646`,
590 ball-directed skipped), X5 control identity **145 checked / 0 mismatched**, X6
force fidelity `unexplained == 0` (1,242,354 ok / 1,350,680 total), X7 determinism,
X-MERGE-SHA, X-FP-PROD, X-OFF-IDENT (bonus receipt), X-SRC-ZERO, seed-disjoint all
true. **DEV 0.4707** (`devShareInSupport 0.470743`, deviate 3,757 / **in-support
attainable 7,981**; plain-attainable 16,289, in-support shrink factor 0.489963) —
above the pinned **floor 0.22**, so the in-support restriction does NOT make the
floor structurally unreachable (§3.3). **PC −0.0180 [−0.0316, −0.0043]** (`pc n
3,504`; 95% cluster-bootstrap upper < 0 — the inverted twin resolves below
control). (Neutral ATE `n 3,508`, +0.010547 [−0.001143, +0.022656], reported.)

**THE N RULE fired as disclosed (§5.1), before the gate-bearing run.** CI-half-width
targets on the two PRIMARY mediators (R3p−R0): offsideRate smoke half-width
**0.8375** vs target 0.5 → projected N **112.225**; deliveryEvents half-width
**1.15** vs target 2.0 → projected N **13.225**. In fixed steps of 40 (cap N_MAX =
2,000), **N\* = 120** (`nStarExceedsMax = false`); the #105 knee did not apply (the
consumer table is frozen — no census floor binds).

**THE PRUNE RULE returned FALSE (§3.2), disclosed before sight.** Measured five-arm
wall cost **492.95 ms/match** (per arm: R0 93.85 / R1p 93.28 / R2p 98.83 / R3p 104
/ R3v3 103 ms) vs the disclosed **60,000 ms/match** budget ⇒ `prune = false`, no
arm dropped, all five run (`armsToRun` = R0/R1p/R2p/R3p/R3v3). The consumption-time
perceived-`ageTicks` histogram (`p50 5`, `p95 33`, n 2,751) confirms the 30-tick
freshness pin (§5.1(iv); no re-cut after sight). Smoke output SHA-256
**`e7a08842…65936b`** (full
`e7a088423d8ba8f97ebd9ff07a2702d37a05d735560ee7c073522e216a65936b`).

### THE RUN (N = 120 @ 11.1M, five arms)

`matchCap = 120`; seeds `11,100,000 + k, k∈0..119`; ENRICHED world; keying STRICT;
bootstrap seed 99703 / permutation seed 99803 (reserved-unused); HEAD **`bff06e0`**
(P3p-2a src wiring, #118; the probe `52c66f5` touches no `src`). Coverage:
**forkMoments 11,056** (clones 11,056 = 1.0, 1,672 ball-directed skipped). **Gates
all PASS** (verdict verbatim: **`GATES PASS`**):

* **X4 clone** true — 11,056 / 11,056 = 1.0.
* **X5 control-fork identity** true — **442 checked / 0 mismatched**.
* **X6 force fidelity** true — `unexplained == 0` (3,835,619 ok / 4,148,426 total;
  `eSentOff 184`).
* **X7 / X-DET** true — two `runExperiment()` calls byte-identical, `deterministic
  = true`.
* **DEV** true — **0.4831** (`devShareInSupport 0.483082`, deviate 11,636 /
  in-support **attainable 24,087**; plain-attainable 48,950, shrink factor
  0.492074) ≥ floor 0.22.
* **PC** true — **−0.0188 [−0.0282, −0.0094]** (`pc n 10,598`; 95% upper < 0).
  (Neutral ATE `n 10,614`, +0.009516 [+0.002364, +0.016520].)
* **X-MERGE-SHA** true — the loaded merged table's `mergedTableSha ==
  39662445…9d6105` AND its `base` rehashes to `171a6dad…6559f` (= the injected v3
  base).
* **X-FP-PROD** true (fingerprint `57b0bdab…c673`), **X-OFF-IDENT** true (bonus
  receipt; children injected + flags-off byte-identical to plain v3, sig
  `7ba286ad…`), **X-SRC-ZERO** true (`git diff --stat -- src` empty),
  **seed-disjoint** true.

Run output SHA-256 **`906c6449…930f14`** (full
`906c6449d0f5ac8dc0ba1b1d32ed5cee83c97c0d929eec73748c811267930f14`).

### THE MEDIATOR CONTRAST TABLE (paired cluster CIs, #20 — REPORTED, never gated)

Four fork-grain mediators × three paired contrasts, point [95% cluster-bootstrap
CI], `✓` = CI excludes 0 / `null` = CI straddles 0. Read verbatim from the run JSON
`mediatorContrasts` (n = 120):

| mediator | R3p − R0 | R3p − R3v3 | R3v3 − R0 |
| --- | --- | --- | --- |
| **offside rate** | **+0.750** [+0.225, +1.267] ✓ | +0.125 [−0.358, +0.608] null | **+0.625** [+0.100, +1.175] ✓ |
| **delivery events** | **−2.217** [−2.942, −1.475] ✓ | +0.317 [−0.417, +1.008] null | **−2.533** [−3.283, −1.783] ✓ |
| **restart ticks** | **+139.075** [+31.050, +236.558] ✓ | **−702.108** [−854.200, −550.767] ✓ | **+841.183** [+693.258, +979.758] ✓ |
| **rest-slot occupancy** | **−0.149** [−0.162, −0.136] ✓ | **+0.032** [+0.020, +0.045] ✓ | **−0.181** [−0.196, −0.167] ✓ |

Pre-named directions (§4, recorded beside the numbers, NOT gated): offside rate
"quiet toward R0" — ⚠ but #116.2's sign INVERTED (the R3p−R0 point is POSITIVE),
REPORTED not gated; delivery events "recover toward the P3a band"; restart ticks
"quiet toward R0"; rest-slot occupancy — UNREMEDIED CLASS H, "residual persists".
No mediator is a stop gate at P3p-2.

### THE CONSUMPTION LEDGER (per partial arm, #49.3 — does each remedy FIRE at consumption)

The **R3p** arm (both teams — the arm every gate binds on), run counts:

* **in-support abstentions by class** — `inSupport 57,899` vs `oosPhase 11,134 /
  oosUnseen 6,838 / oosInflight 39,299 / oosStale 764`, `oosTotal 58,035`,
  **`oosShare 0.500587`** (the in-support law closes ≈ half the consulted surface);
  `decisions 115,934`, `deviate 28,096`, `tie 28,944`, `noCell 859`, `abstainUnseen
  0`.
* **delivery bit tri-state** — `widthHeld0 20,646 / widthHeld1 17,257 /
  widthHeldUnknown 19,996`, `deliveryBitFireRate 0.298054`, `deliveryUnknownShare
  0.34536`.
* **offside bit tri-state** — `beyondLine0 735,856 / beyondLine1 284,438 /
  beyondLineUnknown 21,888`, `offsideBeyondShare 0.272925`, `offsideUnknownShare
  0.021002`.
* **child-vs-base reads by family** (the NEW ledger) — delivery `child 48,038 /
  base 99,400`, **`deliveryChildShare 0.325818`**; offside `child 157,016 / base
  6,271`, **`offsideChildShare 0.961595`**. Both remedies FIRE at consumption
  (neither child-read count ≈ 0).

**R1p / R2p (compact, run).** R1p: `decisions 11,289`, `oosShare 0.504916`,
`deliveryChildShare 0.326019`, `offsideChildShare 0.962633`, `devShareInSupport
0.48957`. R2p: `decisions 57,563`, `oosShare 0.502597`, `deliveryChildShare
0.307678`, `offsideChildShare 0.96747`, `devShareInSupport 0.491896`. **R3v3**
carries NO consumption ledger (the plain-v3 attribution baseline — no `eye.v4`
flags): every in-support / bit / child field 0, `abstainUnseen 9,864`.

### PER-ARM MEDIATOR ABSOLUTE LEVELS (the `perArmMediators` block, run)

| arm | offside rate | delivery events | restart ticks | rest-slot occupancy |
| --- | --- | --- | --- | --- |
| R0 | 3.2667 | 11.3833 | 1708.8417 | 0.5876 |
| R1p | 3.2000 | 11.4083 | 1734.3000 | 0.5793 |
| R2p | 3.8417 | 10.3167 | 1793.1250 | 0.5138 |
| R3p | 4.0167 | 9.1667 | 1847.9167 | 0.4384 |
| R3v3 | 3.8917 | 8.8500 | 2550.0250 | 0.4062 |

---

**All instrument gates pass (reading A form — the consumer is measurable and the
remedies fire); the mediator contrasts are REPORTED, never gated here. Adjudication
and the P3p-3 hand-off are the commander's ruling in PROGRAMME-RULINGS.md.**
