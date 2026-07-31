# Stage III V3-P2 — The Role-Eye Consumer, Out of Sample

Status: **PRE-REGISTERED 2026-07-31 — FROZEN before any implementation and before
any datum of P2's own.** Authority: **ruling #82.3** (V3-P1 accepted — HALF-1 HOLDS
CERTIFIED, division of labour is IN THE PRICES; V3-P2 drafting authorized with the
one ex-ante mandate — §2 below computes the per-role argmax per context from the
committed table and publishes the predicted deviation-divergence rate BEFORE the
run) · **#77** (the role axis; #77.2(ii) going-axis OUT; #77.2(iii) brake DORMANT;
#77.2(v) perceptionPrice fix lands at THIS build; #77.3 the two-halved hypothesis) ·
**#79/#80/#81/#82** (the census that built the table this eye consumes) ·
[`STAGE3-V3-ROLE-EYE.md`](STAGE3-V3-ROLE-EYE.md) §4 V3-P2 (the design contract) ·
[`STAGE3-V2-P2-CONSUMER.md`](STAGE3-V2-P2-CONSUMER.md) (**the harness this reuses
verbatim**: the `stationEye` seam §2.1, the five arms §2.5, the decision classes §4,
the full sign space §5, the §6.5 FAIL, the control-recovery precedent §2.4a, the
#71.2 build-time-prediction guard §3.3c) · #71.2 · #70.3 · #65/#44.5 · #44.3 GUARD ·
#24 · #20 · #32.1 · #38.1 · #43.3 · #46.2 · #48.4 · #49.3 · #49.5 · #41.2 (approach
semantics — the only meaning the table carries) · #26.5 (state HEAD + flags) ·
Road B (nothing ships).

**It ships nothing** (Road B). It **cannot authorize V3-P3.**

**World / HEAD.** Every arm runs the **ENRICHED** world (#67.3, the full certified
bundle: `edsPerceivedDefence`, `edsPerceivedChoice`, `edsValueAxis`, `c5Hold`,
`c6Carry`, `c7Windup` armed; `c5TouchFork` off) — **the same world the table was
censused on** (#26.5: a consumer that reads a table censused on a different substrate
reads a stale table). HEAD = the census HEAD `57e3c35` (ruling #79); `src/**`
byte-identical to V3-P0 HEAD `49ba867` (verified: empty diff `49ba867..HEAD -- src`).
Every production flag defaults OFF; the eye is null in every production path; the
fingerprint is unchanged.

---

## 1. What V3-P2 is

V3-P1 built the role-conditioned table and found division of labour is REAL, modest,
and geometrically coherent: **16 of 216 (context × candidate) cells resolve under the
permutation+BH regime vs 5.4 expected** — the DF is paid for build-up positioning
(`ours|middle|sparse` argMax) and penalised for deep runs (`ours|ownThird` argMin),
the MF beats the DF on the crowded-midfield defensive approach. Over the other 200
cells the roles agree on what is good — football-real, and the honest bound on the
separation's extent.

**V3-P2 builds the consumer and asks the one question the census could not: when each
body reads HIS OWN role's column and argmaxes, does the convergence signature that
beat three generations of eyes break BY CONSTRUCTION — spacing stops closing,
duplicate runs fall, and the deviation geometry separates by role — OUT OF SAMPLE, at
fork grain?**

The pre-named hypothesis, verbatim from the contract §4 / #77.3:

> **H-V3 (half 2)** — a chooser where each body reads HIS OWN role's column deviates
> DIFFERENTLY by role, so the convergence signature breaks by construction (spacing
> not closing, duplicate runs falling, per-role deviation mixes distinct). The
> convergence mediators are PRIMARY this time; payoff is secondary/REPORTED (three
> generations of flat ATEs say the value question is downstream of the shape
> question).

This freeze scopes **only fork-grain shape and its mediators** (the V2-P2 object). It
does **NOT** carry deployment / the adoption ladder / the DEGEN battery / the ONE I4
R3-iteration — that is **V3-P3**'s object, HARD-gated there. **V3-P2 cannot authorize
V3-P3.** The chooser is behind the `stationEye` flag, null in every production path;
flag-off is bit-identical (X1/X2); the committed table is injected by the probe,
never bundled in `src/**`; ORACLE-CTX is unreachable from any production path and a
test asserts so (X3).

---

## 2. ⭐ THE #82.3 EX-ANTE COMPUTATION — published in this freeze, BEFORE any run

The mandate (#82.3): compute from the committed table the **per-role argmax per
context** and publish the **predicted deviation-divergence rate** — how often two
roles at the same moment would choose differently — *before* the run, not discovered
after (the #44.5 discipline at the hypothesis level; half-2 is only as strong as this
number). All quantities here are read directly from the committed table
[`data/stage3-v3-p1-role-census-table.json`](data/stage3-v3-p1-role-census-table.json)
(canonical `tableSha` **`171a6dad…6559f`**, file SHA-256 on disk
**`ba0bd8ee…0735`**), NEUTRAL weights (`w_s = w_c = 0.5` ⇒ V(x) = 0.5·`value(c,role,x)`
⇒ argmax over `value`), **in-power candidate cells only** (`underPowered = false`).
This computation is **CONTROL-INDEPENDENT** (the argmax needs no control level); the
realized *deviation share* — which of these argmaxes actually beats control — is the
control-dependent quantity, refined at build against the §4 recovered control.

### 2.1 The per-role argmax per context (the committed table, neutral, in-power)

| context (moments) | DF | MF | WG | ST | roles that diverge |
| --- | --- | --- | --- | --- | :---: |
| ours\|ownThird\|sparse (4515) | r7a0 (−0.306) | r14a0 (−0.255) | r21a300 (−0.308) | r21a60 (−0.222) | **4 distinct** |
| ours\|ownThird\|crowded (1652) | r21a0 (−0.177) | r14a180 (−0.165) | r7a180 (−0.201) | r21a60 (−0.196) | **4 distinct** |
| ours\|middle\|sparse (4707) | r7a0 (+0.132) | r14a180 (+0.129) | r7a180 (+0.042) | r7a180 (+0.085) | 3 distinct {WG,ST}→r7a180 |
| ours\|middle\|crowded (2862) | r7a180 (+0.138) | r7a180 (+0.158) | r14a180 (+0.127) | r14a180 (+0.160) | 2 distinct {DF,MF}·{WG,ST} |
| ours\|theirThird\|sparse (2474) | r7a180 (+0.458) | r21a0 (+0.420) | r14a180 (+0.422) | r21a0 (+0.372) | 3 distinct {MF,ST}→r21a0 |
| ours\|theirThird\|crowded (970) | **—UP** (E-NOCELL) | r7a0 (+0.569) | r7a180 (+0.519) | r14a240 (+0.510) | 3 distinct (DF absent) |
| theirs\|ownThird\|sparse (1101) | **—UP** (E-NOCELL) | r7a180 (−0.494) | r21a180 (−0.592) | r14a180 (−0.550) | 3 distinct (DF absent) |
| theirs\|ownThird\|crowded (1428) | r7a0 (−0.573) | r21a180 (−0.546) | r14a0 (−0.608) | r7a180 (−0.530) | **4 distinct** |
| theirs\|middle\|sparse (3220) | r7a180 (−0.234) | r7a180 (−0.192) | r7a180 (−0.314) | r14a0 (−0.252) | 2 distinct {DF,MF,WG}→r7a180 |
| theirs\|middle\|crowded (2292) | r7a180 (−0.285) | r14a180 (−0.266) | r21a0 (−0.310) | r21a300 (−0.312) | **4 distinct** |
| theirs\|theirThird\|sparse (4384) | r7a180 (+0.078) | r7a0 (+0.112) | r21a0 (+0.050) | r7a0 (+0.114) | 3 distinct {MF,ST}→r7a0 |
| theirs\|theirThird\|crowded (1174) | **—UP** (E-NOCELL) | r7a0 (+0.046) | r21a0 (+0.050) | r14a0 (+0.105) | 3 distinct (DF absent) |

**—UP** = the DF column is one of the three published under-powered pairs (§3); the DF
is **not consumed** there (E-NOCELL for that role), consistent with #82.1 (the measured
under-powered set = the three published DF cells exactly). The value in parentheses is
the argmax's `value` = 2·V at neutral.

### 2.2 The predicted DEVIATION-DIVERGENCE RATE (the #82.3 number)

Defined as the mandate defines it — **the share of moments whose context has ≥ 2
in-power roles argmaxing to different candidates** — weighted by the census moment
counts over the in-power roles present:

```text
PREDICTED DEVIATION-DIVERGENCE RATE  =  30,779 / 30,779  =  1.0000   (100.0%)
   every one of the 12 contexts diverges (≥2 in-power roles pick different cells)
```

Texture, so the commander sees the certified-vs-nominal grain (all moment-weighted):

```text
distinct argmax candidates in a context   2 distinct  19.8%  of moments
                                          3 distinct  48.1%
                                          4 distinct  32.1%   (all four roles pick apart)
pairwise role-argmax divergence           84.9%  (moment-weighted over in-power role pairs)
argmax lands IN a BH-resolved cell        13.6%  (of argmaxes — the CERTIFIED-separation subset)
moment share in resolved-bearing contexts 56.4%  (5 of 12 contexts carry ≥1 BH-resolved cell)
```

**Reading, plainly.** The eye's argmax-divergence is **maximal** — there is no context
where all in-power roles pick the same candidate, and in a third of moments all four
roles pick four different cells. The **structural headroom for half-2 is as large as
it can be**: symmetry is broken at the source in every context, exactly as #77 intended.

### 2.3 The predicted PER-ROLE deviation mixes (argmax target mix, by moments)

The candidate each role's column argmaxes to, weighted by that role's census moment
counts (the predicted deviation TARGET mix — conditional on the argmax firing, which
§4's control recovery resolves):

```text
DF  (6,121 in-power moments)  r7a180 57.9%  · r7a0 36.7%  · r21a0 5.4%
MF  (6,360)                   r14a180 27.6% · r7a180 23.7% · r7a0 22.8% · r14a0 12.2% · r21a0 8.5% · r21a180 5.3%
WG  (12,157)                  r7a180 36.0%  · r21a0 24.7% · r21a300 16.7% · r14a180 13.6% · r21a180 5.1% · r14a0 4.0%
ST  (6,141)                   r21a60 21.5%  · r7a180 17.4% · r14a180 16.7% · r14a0 13.9% · r7a0 10.9% · r21a300 9.2% · r14a240 5.7% · r21a0 4.7%
```

**The honest mechanism (for the commander's eye).** Note that **each role's column
still carries substantial behind-ring (a180) mass** — the substrate attractor that
sank V2-P2 (where a single map argmaxed 60.4% of deviations into r7a180 and spacing
CLOSED) persists WITHIN a role. v3's bet is **not** that any role avoids the attractor;
it is that the **four columns pull the four bodies APART**: the DF concentrates on
r7a180/r7a0, the WG spreads out to r21a0/r21a300 (width), the ST spreads widest
(r21a60 leads). The convergence-break in half-2 is a **BETWEEN-role** effect — when a
DF and a WG are co-located they now argmax to different cells — not a within-role
avoidance of the behind ring. This is precisely what V3-P2's mediators (§5) measure:
whether that between-role argmax-divergence cashes into **opened spacing** at fork grain.

### 2.4 The predicted CONVERGENCE-MEDIATOR DIRECTION (pre-named)

```text
FORK-SPACING (NEUTRAL − CONTROL, paired)   PREDICTED > 0  (OPENS) — roles argmax apart,
                                           so co-located bodies pull to different cells;
                                           strongest where the roles diverge most (the
                                           resolved cells); pooled and PER ROLE.
FORK-DUPRUN  (NEUTRAL − CONTROL, paired)   PREDICTED < 0  (FALLS) — fewer duplicate
                                           runs: with the columns split, a second body
                                           is less likely to land within R = 4.0 m of a
                                           teammate's advanced position; pooled + per role.
PER-ROLE DEVIATION MIX                     PREDICTED DISTINCT across DF/MF/WG/ST (§2.3;
                                           TV distance between per-role mixes > the
                                           incumbent's #79.2 baseline: DF r14a180 · MF
                                           flattest · WG outside-lattice width · ST ahead).
```

### 2.5 ⭐ THE STOP TOOTH — what number makes half-2 untestable (the #44.5/#65 discipline)

> **If the predicted deviation-divergence rate were 0 — all four roles argmaxing to the
> SAME candidate in every context — the eye could not diverge BY CONSTRUCTION, half-2
> would be untestable, and THE STAGE SHOULD NOT RUN.** A rate so low that divergent
> moments were a negligible share of the population would leave the convergence
> mediators unpowered for the same reason. This is the cheap-death-before-the-run tooth
> #44.5/#65 exist for, asserted at the hypothesis level per #82.3.

**The measured rate is 1.0000 (100%).** The stop tooth does **not** fire; the structural
headroom is maximal. The honest counter-caveat is carried into §5's sign space as the
**divergence-too-thin** reading: only **13.6%** of argmaxes land in a *certified*
(BH-resolved) cell, and much of the nominal divergence rests on the 200 unresolved
cells' near-ties (§2.2 texture). Maximal argmax-divergence is necessary, not sufficient,
for the *realized* fork-grain divergence half-2 asserts — the mediators (§5) are the
test of whether the nominal separation is real enough to open spacing.

---

## 3. The chooser — frozen

### 3.1 The seam, the population, the percept — V2-P2 / v1 P2 VERBATIM

Reused with **no change** from [`STAGE3-V2-P2-CONSUMER.md`](STAGE3-V2-P2-CONSUMER.md)
§2.1 (itself v1 P2 §2.1–2.3 verbatim):

* **The seam**: the chosen offset is applied exactly where P1R's `forcedStationPolicy`
  applies — at the executor's READ, after the action switch and **before** the onside
  and barred-box clamps (#35.3), recomputed every tick as
  `target = (ball.x + attackDir·dx, ball.y + dy)`. A second, independent seam; null in
  every production path.
* **The population / eligibility**: an outfielder (not GK, not sent off, not the ball
  owner) whose current action is a **station family** (`MoveToFormationSpot ·
  HoldPosition · SupportBallCarrier · MakeRun · MarkOpponent`). Ball-directed actions
  are never overridden; leaving the station family lapses the override (`E-NONSTATION`)
  with the window clock still running.
* **W = 3.0 s**, decisions on **D1** (no live commitment) or **D2** (perceived
  possession FACE ≠ `faceAtDecision`); every decision commits the window (the #43.4c(2)
  cadence: first eligible tick, then once per window; every tie/abstention/no-cell
  commits to the incumbent).
* **The percept**: at a decision instant the body pulls his own snapshot
  `match.perceivedSnapshot(p)` — the E3R2 PULL (#13.3), naturally warm (the two
  repairs, §3.3). Perceived FACE / THREAT / DENSITY are computed from that snapshot
  with the census's own three features. No truth by the back door (#8(l)); no prior
  invention (Q7).

### 3.2 THE ROLE AMENDMENT — own-state, no going-bit (contract §2, I2; #77.2(ii))

The v3 amendment to the V2-P2 harness is **whose column the body reads**, and it is
strictly SIMPLER than v2's going-bit amendment:

* **Each body reads HIS OWN role's column.** Role ∈ {DF, MF, WG, ST} is the world's OWN
  immutable variable, read from the formation machinery's assignment
  (`types.ts:19/27`, `Player.ts:29`, re-derived on `becomeSub` — the E-INJURY
  interaction already in the standing class), **never authored, never re-mapped**.
  Role is **OWN-STATE — free**: a body knows his own job (the A4 constraint honoured
  trivially, no percept issue). A DF and an ST at the same moment read different
  columns and argmax to different candidates BY CONSTRUCTION.
* **NO going-bit at consumption.** The going axis is OUT of v3's table (#77.2(ii)); the
  table is keyed `(context × role × candidate)`. The eye computes **no** `percGoing`;
  the only perceived features are the three CONTEXT features (face/third/density), as
  in v1. The perception price is therefore the CONTEXT misread only (priced by
  ORACLE-CTX, §3.5), not a going-bit misread.
* **NO brake** (the v2.1 collective brake stays DORMANT, #77.2(iii); re-armed only by
  ruling). **NO gene attribute, no new percept channel** (I8): role is read, not created.

### 3.3 The two repairs — carried verbatim (V2-P2 §2.3)

1. **In-flight FACE.** The perceived face retains the LAST-PERCEIVED owner while the
   ball is in flight (the `inflight` marker); without it the enriched world's
   ball-in-flight majority abstains (the v1 DEV killer). Re-measured at the sizing smoke
   (§6).
2. **Percept warm-up.** Consumer forks warm the percept 15 ticks (0.25 s) before the
   first decision; the residual no-snapshot is the NEVER-SAW floor (out-of-range
   teammates). Re-measured at the sizing smoke (§6).

### 3.4 The pricing and the selection rule (neutral, own-role column)

For the perceived context `c` and the body's OWN role `r`, over candidates that are
**IN-POWER** in the committed table (`underPowered = false` in cell `(c, r, x)` — the
#24 / #82.1 eligibility; the census resolved the contrast there):

```text
V(x)      = w_s · score(c, r, x)  −  w_c · concede(c, r, x)
          = 0.5 · value(c, r, x)                    at NEUTRAL (w_s = w_c = 0.5)
advantage = V(x) − V(control(c, r))
choose      argmax advantage
deviate     iff  advantage > 0   (strict)
otherwise   NO OVERRIDE — the incumbent runs, and that is the eye choosing him
```

`value(c, r, x)` is the committed table's signed value in the own-role cell. A
candidate whose own-role cell is NOT in-power is **not priceable** and is dropped from
the argmax; a `(context, role)` with no eligible candidate resolves to `E-NOCELL`. The
**three published under-powered DF pairs** — `ours|theirThird|crowded||DF`,
`theirs|ownThird|sparse||DF`, `theirs|theirThird|crowded||DF` (each with all 18
candidate cells under-powered ⇒ **54 candidate cells never consumed**, #82.1) — resolve
`E-NOCELL` for a DF body in those three contexts and are never pooled with another role
(#77.2 / I7). The **45 in-power `(context × role)` pairs** are the eligible surface.

**`control(c, r)` is the census's own control arm — the incumbent's continuation, per
`(perceived context × own role)`.** The eye's action space is
`{ incumbent } ∪ { in-power candidates }`, comparable by construction.

### 3.5 The abstention classes + the two harness repairs

The standing decision classes (§4) apply verbatim: `D-DEVIATE`, `E-ABSTAIN-UNSEEN`
(no ball owner even after the in-flight repair, or no snapshot), `E-NOCELL` (no in-power
candidate in the perceived `(context, role)` — includes the three DF pairs above),
`E-TIE` (best advantage ≤ 0 — the eye chose the incumbent; stays IN the DEV
denominator), `E-NONSTATION`. The two repairs (§3.3) are the harness repairs carried
from V2-P2.

---

## 4. ⚠️ THE CONTROL-RECOVERY PASS — the committed table does NOT serialize per-cell control

Checked directly: the committed V3-P1 table (SHA `171a6dad…`) **does NOT serialize the
per-`(context × role)` control-arm level.** Like the V2-P1 table before it (V2-P2 §2.4a),
it serializes only the forced candidate cells + `gradient.pooledByCandidate`
(candidate−control, POOLED across contexts/roles) + `positiveControl` (the r21a180 PC
contrast, with `byFace`/`byRole` but pooled). The V3-P1 census DID fork the control at
every moment and used it for X5, PC and the pooled candidate−control gradient — but it
serialized only the candidate cells, **not the control LEVEL per cell.** The selection
rule §3.4 therefore cannot be reproduced from this table alone.

**RESOLUTION (frozen), through the harness's own semantics, re-cutting nothing —
the V2-P2 §2.4a precedent verbatim:** V3-P2's build performs a **deterministic,
read-only CONTROL-RECOVERY pass** on the **census block** (seeds `9,110,000 + k`,
`k ∈ 0..387` — the frozen V3-P1 census seeds; enriched world; HEAD `57e3c35`),
re-running the census's OWN control fork ONLY and aggregating `signed(control)` per
**(context × role)**. This RECOVERS a deterministic quantity the frozen census computed
but did not write; it leaves the frozen table's forced cells byte-identical (canonical
`tableSha` unchanged) and is twice-byte-identical (X7-style). It runs at BUILD — it
touches the CENSUS block, which this freeze's sizing smoke may NOT (the smoke is
disjoint per #46.2). The recovered per-cell control + the committed table then produce
the **build-time recomputed prediction** (§4.1), committed at the review gate **before
any payoff datum** — the winner's-curse discipline intact.

**Freeze-time provisional anchor (pooled, from the table alone).** As a consistency
receipt, the POOLED control recovers from `value(cand) − gradient.pooledByCandidate[cand]`
to **−0.0556**, internally consistent to **± 0.00034** (sd) across all 18 candidates
(range −0.05611 .. −0.05494) — a strong recovery check identical in kind to V2-P2's
±0.0006. Under this flat pooled anchor the provisional NEUTRAL deviation share is
**53.84%** of in-power moments (DF 57.3% · MF 56.5% · WG 52.0% · ST 51.3%). **This is
FLAGGED PROVISIONAL** exactly as V2-P2's flat anchor was: a flat level is known to
distort per-cell deviation because the true control varies sharply by face
(`positiveControl.byFace` ours −0.031 / theirs −0.043; and by role, `byRole` DF −0.029 /
MF −0.012 / WG −0.055 / ST −0.032). The per-`(context × role)` recovered levels
(§4) refine it before the run, delta reported.

### 4.1 BUILD-TIME RECOMPUTED PREDICTION — the #71.2 guard, VERBATIM

Landed at BUILD, **before any payoff datum** (#71.2: the prediction lands in the doc
before the run; the delta from the provisional is reported, never re-cut). The §4
control-recovery pass runs deterministic and read-only on the frozen census block,
recovering `signed(control)` per `(context × role)`; the provisional deviation share
(§4) is recomputed against the per-cell levels. **The recovery-guard verdict, VERBATIM
in the #71.2 form:**

```text
X-DET twice byte-identical                deterministic = true                       ✓
re-derives the census's own contrasts     maxContrastDev 0.000752 ≤ 0.002 (tol)       ✓
  candidate−control (18 cands)            each within tolerance of gradient.pooledByCandidate
  INVERTED positive control (PC)          maxPcDev 0.00000136 within tolerance         ✓
recovery tableSha (census) unchanged      171a6dad…  (the forced cells byte-identical) ✓
recovery pass SHA-256                     968349ff52313df6ce6fe42683faff64b7509d32c108b7b40010c129e18acc1c
verdict                                   GUARD PASS
```

> A recovery that could not re-derive the census's own published candidate−control
> contrasts to within the stated 0.002 tolerance **would not be a recovery** (#71.2) —
> the pass FAILS and the fork returns to the commander before any payoff datum. It
> **passed**: the worst contrast dev is **0.000752** (r7a120), the inverted PC dev
> **0.00000136**, well inside the 0.002 tolerance.

**The refined prediction (`data/stage3-v3-p2-prediction.json`).** Against the recovered
per-`(context × role)` control, the pooled NEUTRAL deviation share refines from the
flat-anchor provisional **0.5384 → 0.4008** (**Δ −0.1376** — the serialization price the
flat anchor concealed). The per-role split, REPORTED, is the judgment's texture:

| role | refined dev share | provisional | Δ | recovered control | in-power moments |
| --- | --- | --- | --- | --- | --- |
| **DF** | 0.5127 | 0.573 | −0.0603 | −0.029 | 6,121 |
| **MF** | 0.6469 | 0.565 | +0.0819 | −0.026 | 6,360 |
| **WG** | **0.1059** | 0.520 | **−0.4141** | −0.081 | 12,157 |
| **ST** | 0.6181 | 0.513 | +0.1051 | −0.068 | 6,141 |
| pooled | **0.4008** | 0.5384 | −0.1376 | −0.0567 | 30,779 |

The §2 argmax/divergence texture is control-independent and **stays frozen** (divergence
rate 1.0; distinct-argmax share 2/0.198 · 3/0.481 · 4/0.321) — only the deviation SHARE
(whether each argmax beats its recovered incumbent) is refined here.

**The WG collapse, banked ex ante as a finding, not a defect (#84.2).** The winger's eye
almost always AGREES with his incumbent (dev share **10.6%** on the widest stratum,
12,157 moments) — consistent with V3-P0 (WG the most-separated incumbent role; width
already served) and the V3-P1 census (WG earns ≈0 on central candidates). **The eye has
nothing to sell the winger because the world already pays his job** — division of labour
expressed as silence. The recovered per-role controls tell the same story from the
other side: the wide roles' incumbent continuations are worth LESS (WG −0.081, ST
−0.068 vs DF −0.029, MF −0.026), another face of role heterogeneity.

**The #65 checkpoint — ruled to its FROZEN pooled form, PASSES (#84.1).** The frozen §7
checkpoint binds **the pooled ex-ante deviation share ONLY** (the freeze text is
singular; its provisional quotes the pooled ≈53.8% as "≈2.4× the floor"). The built
script had unilaterally strictened the predicate to "pooled AND every role" — a clause
the freeze does not contain, and an unauthorized strictening that WG's 10.6% would have
tripped. The predicate is CORRECTED to the frozen form: **pooled 0.4008 ≥ 0.22 ⇒ the
checkpoint PASSES; the payoff run proceeds** (`checkpoint65.pass = true`). The per-role
split is REPORTED, exactly as the freeze's parenthetical texture.

**Pre-laid mediator obligations, banked BEFORE the payoff (#84.2).** (i) the role-split
mediators read WG on a **thin stratum** where the eye is nearly silent — its CIs are
WIDE and its any pooled-mediator null **MUST be decomposed by role before a verdict**;
role decomposition is MANDATORY, not optional. (ii) a **DF/MF/ST-driven signature with a
quiet WG is the EXPECTED shape**, not a surprise — a pooled null that dissolves into
"three roles move, WG doesn't" is division of labour, not a dead eye.

The build commits the recomputed deviation share + per-role split + the §7 #65
checkpoint, with the **delta from the flat-anchor provisional REPORTED** (the
serialization price), never a re-cut of §2's argmax picture or §5's readings. The §2
argmax/divergence quantities are **control-independent and stay frozen as written**;
only the deviation SHARE (whether each argmax beats control) is refined.

---

## 5. The arms, the gates, the mediators, the sign space

### 5.1 The five arms (V2-P2 §2.5, role-conditioned)

Five forks per moment, all from the same pre-step clone (**60,000 forks** at 12,000
moments).

| arm | weights | context | role | rule |
| --- | --- | --- | --- | --- |
| **CONTROL** | — | — | — | the incumbent's continuation; the identity gate (X5) + the paired baseline |
| **NEUTRAL** | `w_s = w_c = 0.5` | **perceived** | **own (free)** | **PRIMARY.** The faithful consumer of the unweighted role-conditioned table |
| **GENE** | §4.7's frozen mapping | perceived | own | the VISION-mandated stance seat; attribution partner (§5.4(f)) |
| **ORACLE-CTX** | `0.5 / 0.5` | **TRUE** | **own (free)** | REPORTED. **The perception price** — role is own-state in BOTH arms, so the gap is the CONTEXT misread alone |
| **INVERTED** | `0.5 / 0.5` | perceived | own | **PC.** argmin instead of argmax — must measurably hurt |

**PRIMARY is NEUTRAL**, named to foreclose a max-statistic (#32.1): the table is
unweighted, so the unweighted chooser is its faithful consumer. The GENE mapping is v1
§4.7, frozen (a neutral genome lands exactly at (0.5, 0.5)):

```text
w_s = 0.5 + 0.5·(tempo·0.5 + attackingWidth·0.5 − 0.5)
w_c = 0.5 + 0.5·(defensiveCompactness·0.5 + coverBias·0.5 − 0.5)
```

**ORACLE-CTX reads TRUE context; role is own-state (free) in BOTH ORACLE and NEUTRAL**
(v3 has no going-bit, so the only perceived feature is the context — the perception
price is the context misread, decomposed by feature face/threat/density). Probe-only,
unreachable from any production path, asserted by test (X3).

### 5.2 ⭐ THE perceptionPrice SERIALIZATION FIX (#77.2(v)) — specified so the build lands it right

The recurring mislabel, diagnosed at the source: in
`scripts/probes/stage3-v2-p2-consumer.ts:546` the field is written
`perceptionPrice = pairedCI(rows, 'oracleCtx', 400)` — which is **ORACLE − CONTROL**
(the oracle arm's own ATE), while the comment and §5(g) define the perception price as
**ORACLE − NEUTRAL**. The serialized field has therefore been mislabelled in every
consumer to date (the V2-P2 write-up quoted the *correct* hand-computed −0.0077 =
oracleATE −0.0015 − neutralATE +0.0062, but the JSON field held −0.0015).

**FROZEN FIX for the V3-P2 build:** serialize

```text
perceptionPrice  =  paired( VALUE(ORACLE-CTX) − VALUE(NEUTRAL) )   per §5(g)
```

i.e. the paired within-clone difference of the two arms' per-moment advantages (a
cluster-bootstrap CI on `oracleValue − neutralValue`, same clone, same seed), **NOT**
`pairedCI(rows,'oracleCtx')`. A unit test asserts the field equals ORACLE_ate −
NEUTRAL_ate to numerical tolerance. This is the #77.2(v) fix landing at this build,
before the run where it is load-bearing.

### 5.3 The gates — V2-P2 §3.5 VERBATIM (X-family), DEV, PC

| gate | predicate |
| --- | --- |
| **X1** | eye null: `npm run fingerprint` unchanged (stated in the run) |
| **X2** | eye null: byte-identical world signatures to pre-change HEAD, 3 league seeds × 2 seasons |
| **X3** | a test asserts: the eye is read in exactly one place, is null on a fresh `Match` + `League`, is unreachable from the E4 preview, and **ORACLE-CTX is unreachable from any production path** |
| **X4** | **CLONE COVERAGE = 100%** of sampled moments |
| **X5** | **CONTROL-FORK IDENTITY** — the no-eye fork reproduces the base continuation bit-identically for the full `H_concede`, per record, sampled 1-in-25, unexplained exactly 0 |
| **X6** | **FORCE FIDELITY — per-record only (#43.3).** On live override ticks the applied target equals the engine's own `meet` to 1e-9, **unexplained exactly 0**. ok-share + clamp shares REPORTED-not-gated, per-candidate × per-context |
| **X7** | two `runExperiment()` calls byte-identical; result SHA emitted; and the §4 control-recovery pass twice byte-identical, its SHA emitted |
| **DEV** | **DELIVERY (HARD)** — NEUTRAL deviation share on the **PERCEIVED-attainable** denominator (§7; decisions with a warm percept AND an in-power own-role cell) ≥ **0.22**. Below it ⇒ reading (d), no payoff interpreted (#44.3 labelled-data convention) |
| **PC** | **INVERTED resolves BELOW control (HARD)**, pooled, 95% cluster-bootstrap CI **upper < 0**. If the argmin chooser does not measurably hurt, the family is unmeasurable ⇒ FAIL, no reading published |

The payoff axes (ATE, ATT, the corrected `perceptionPrice` = ORACLE−NEUTRAL, the
mediators) are **REPORTED** with cluster bootstrap CIs (cluster = match seed); the two
HARD gates are DEV and PC. **Payoff is secondary/REPORTED, not gating** (contract §4:
three generations of flat ATEs put the value question downstream of the shape question).

**Standing fidelity classes (#38.1), per-record receipts (#49.3 `seed, tick, gid,
cause`):** paused world · carrier · ball won · sent off · onside clamp · barred box ·
match ended · **E-INJURY**. All checked; `unexplained` = 0.
`reconstructionDiverged` reported-not-gated.

### 5.4 ⭐ THE CONVERGENCE MEDIATORS — PRIMARY (contract §4), split by role and by resolved-cell membership

H-V3's whole spine is the mediators; they are PRIMARY here. Both are paired NEUTRAL −
CONTROL over the first fork window, split **BY ROLE** (DF/MF/WG/ST) **AND by
resolved-cell membership** (the eye's chosen candidate ∈ the **16 BH-resolved
(context × candidate) cells** — the certified-separation subset — vs not), with cluster
CIs. Pre-named directions (§2.4):

```text
FORK-SPACING   the eye body's minimum distance to any own teammate whose approach
               overlaps the eye's chosen region — paired NEUTRAL vs CONTROL.
               H-V3: OPENS (> 0), pooled and per role; STRONGEST on the resolved-cell
               deviations (where the roles' columns diverge most). A collapse
               (< 0) is half-2 REFUTED at fork grain (reading (h)).
FORK-DUPRUN    the share of fork windows in which ≥ 1 own teammate's advanced position
               lands within R = 4.0 m of the eye's chosen region — paired NEUTRAL vs
               CONTROL. H-V3: FALLS (< 0), pooled and per role; strongest on the
               resolved cells. A rise is half-2 REFUTED (reading (h)).
PER-ROLE MIX   the deviation mix (angle × radius) per role; H-V3: DISTINCT across roles
               (TV distance between per-role mixes exceeds the incumbent baseline #79.2).
```

The RIGHT-way prediction, made explicit: because the four columns argmax APART (§2),
co-located bodies of different roles pull to different cells ⇒ spacing OPENS and duprun
FALLS, most where the columns diverge most (the resolved cells). The V2-P2 failure mode
(a single map argmaxing 60.4% into r7a180, spacing CLOSED −1.05 m) is the exact null
this stage is built to break — see the §2.3 honest note that each role STILL carries
a180 mass, so the break must come from BETWEEN-role divergence, not within-role
avoidance.

### 5.5 The full sign space — written before the run, none re-cut after sight (#38.1)

* **(a) POSITIVE — H-V3 (half 2) holds.** FORK-SPACING opens (CI lower > 0), FORK-DUPRUN
  falls (CI upper < 0), the per-role deviation mixes are distinct, and the effects are
  strongest on the resolved-cell deviations — pooled AND with the between-role structure
  §2 predicted. DEV and PC pass. **The convergence signature breaks BY CONSTRUCTION**;
  the role eye's premise cashes at fork grain, and **V3-P3 (deployment + the battery +
  the I4 R3-iteration) is the commander's to authorize.** (Payoff reported alongside;
  a flat payoff does NOT negate a positive shape result — shape is primary here.)
* **(b) PAYOFF-FLAT — REPORTED, not gating.** The value ATE CI contains 0. Per the
  contract this is expected/secondary; it neither confirms nor refutes half-2. Reported
  with its per-context ±cancellation, never read as a verdict on the shape hypothesis.
* **(c) HALF-2 NULL — convergence does NOT break at fork grain.** FORK-SPACING does not
  open (CI contains 0 or < 0) and/or FORK-DUPRUN does not fall, DESPITE the 100%
  argmax-divergence (§2). The between-role column split did not translate into
  fork-grain separation — the V2-P2 outcome repeated one layer up. Half-2 refuted;
  the role axis, as consumed, does not break convergence at fork grain. A real finding
  that returns the fork to the commander (reframe: coarser grain, deployment grain, or
  the role axis is real in the table but inert in the consumer).
* **(d) UNDELIVERED.** DEV < 0.22 on the perceived-attainable denominator ⇒ **no payoff
  or mediator reading is interpreted**; the decision classes (§3.5) decompose why, and
  the **#44.3 GUARD binds** — every number is published as data with the label attached
  and is NOT interpreted, ever quoted as a measured verdict.
* **(e) NOISE.** PC does not resolve ⇒ FAIL, no reading published; re-powering is the
  commander's call, never a re-cut here.
* **(f) SPLIT ON THE MAPPING.** NEUTRAL and GENE disagree in sign on the PRIMARY mediator
  with both CIs excluding 0 ⇒ the eye stands and **the mapping** returns to the commander
  (the attribution §5.1 exists to buy). If DEV fails, the labelled-data convention
  applies to BOTH arms.
* **(g) PERCEPTION PRICE.** `perceptionPrice` = ORACLE-CTX − NEUTRAL (the CORRECTED
  field, §5.2) is REPORTED in every branch: it splits "the table does not transfer" from
  "the body misread his context." A large gap is a finding for the perception trunk
  (#65.2), not a licence to feed the eye truth. (v3 has no going-bit, so the whole
  price is the context misread — decomposed by face/threat/density.)
* **(h) CONVERGENCE-WRONG-WAY.** The mediators move OPPOSITE to §2.4 (spacing collapses,
  duprun rises), most on the resolved cells ⇒ half-2 refuted at fork grain decisively
  (the V2-P2 §8.3 signature); banked for V3-P3's battery, no deployment claim built on it.
* **(i) DIVERGENCE-TOO-THIN.** The mediators are flat/mixed AND the diagnostic shows the
  realized deviations, though nominally role-distinct, cluster within noise (the argmax
  gaps were near-ties on the 200 unresolved cells; only 13.6% of argmaxes landed in a
  certified cell, §2.2). The 100% argmax-divergence OVERSTATED the real separation: the
  eye diverges on paper but lands in the same region. A finding that the certified
  separation (16/216) is too sparse to move fork-grain shape — the honest counter to
  §2.5's maximal headroom.

---

## 6. Staging — frozen

| item | value |
| --- | --- |
| **HEAD / world** | `57e3c35` (ruling #79); ENRICHED, full #67.3 bundle (`edsPerceivedDefence`+`edsPerceivedChoice`+`edsValueAxis`, `c5Hold`, `c6Carry`, `c7Windup`; `c5TouchFork` off). `src/**` byte-identical to V3-P0 HEAD `49ba867` (empty diff verified). The consumer world = the census world (#26.5). |
| **consumed table** | [`data/stage3-v3-p1-role-census-table.json`](data/stage3-v3-p1-role-census-table.json), canonical `tableSha` **`171a6dad…6559f`**, file SHA-256 **`ba0bd8ee…0735`**; injected by the probe, never bundled in `src/**`. **45 in-power `(context × role)` pairs** eligible; **3 DF pairs / 54 candidate cells** under-powered — never consumed (#82.1). |
| **control recovery** | §4: deterministic read-only pass on the **census** block `9,110,000 + k`, `k ∈ 0..387` (the frozen census seeds), recovering `signed(control)` per `(context × role)`; twice byte-identical; #71.2 guard; committed with the build. |
| **sizing smoke** | seeds **9,200,000 .. 9,200,149** (150 matches); read-only, forks nothing; committed with the build; [`data/stage3-v3-p2-sizing.json`](data/stage3-v3-p2-sizing.json), SHA emitted. Disjoint above 9.2 M and from the payoff block (#46.2). Re-measures the two repairs (§3.3), the perceived-attainable share, the noCell share. |
| **payoff block** | seeds **9,210,000 + k** (single contiguous block, `k ∈ 0..159`, **160-match cap**); the run stops at the frozen **12,000-moment** budget. Disjoint from the smoke (9.20 M) and above every consumed/reserved range — **the block walk**: … V2-P2 8.90M/8.91M · V2-P2R 9.00M/9.01M · V3-P0 smoke 9.10M / census 9.11M · **V3-P1 REUSES 9.11M** · **V3-P2 smoke 9.20M / payoff 9.21M** (fresh, disjoint, above all). |
| **moments** | **12,000**, station-family population only, stable rotation on player index, side-alternating on the same rotation, ≥ 2.0 s apart (the V2-P2 precedent). |
| **arms** | per moment: **CONTROL + NEUTRAL + GENE + ORACLE-CTX + INVERTED** = 5 forks from the same pre-step clone (**60,000 forks**) |
| **W / H** | 3.0 s / 6.0 s score / 10.0 s concede; warm-up 15 ticks; R 4.0 m (#48.4, all pinned) |
| **cluster unit** | the match seed (#20) |
| **bootstrap** | 2,000 cluster resamples, **frozen seed 92110** (fresh, disjoint from V3-P1's 91110 / V3-P0's 91100 / V2-P2's 50070) |
| **output** | per-arm pooled + per-context + per-role results + all §2/§5.4 mediators, committed under [`data/stage3-v3-p2-consumer.json`](data/stage3-v3-p2-consumer.json); the control recovery under [`data/stage3-v3-p2-control-recovery.json`](data/stage3-v3-p2-control-recovery.json); the build-time prediction under [`data/stage3-v3-p2-prediction.json`](data/stage3-v3-p2-prediction.json); canonical + file SHA emitted; `deterministic: true` |

**The moment budget, arithmetic shown.** V3-P1 measured **31,095 moments / 388 matches
= 80.142 moments/match**. A 160-match cap gives `160 × 80.142 = 12,822.7` available;
the **12,000** target leaves a **~6.4% margin** (the V2-P2 headroom convention). **Why
12,000 is enough — the divergence check the mandate asks for:** divergent moments are
NOT the minority — the deviation-divergence rate is **100%** (§2.2), so the primary
convergence mediators (pooled and per role) draw on the WHOLE sample; the mediators'
power does not live in a thin subset. The **thinnest stratum** is the resolved-cell
split: **13.6%** of argmaxes land in a BH-resolved cell (§2.2), so at 12,000 moments ≈
**1,632** resolved-cell moments (and ≈ 880 resolved-cell *deviations* at the ~54%
provisional deviation share) feed that split — a wider-CI, directional stratum, on par
with V2-P2's 36-negative/36-positive cell splits at the same budget. The resolved-cell
mediator CIs are REPORTED with that width caveat; the pooled/per-role mediators carry
the primary read.

---

## 7. DEV — the floor and its perceived-attainability (the #65 lesson in gate form)

DEV binds on the **PERCEIVED-attainable** denominator (#70.3, carried): decisions with
a warm percept AND an in-power own-role cell in the perceived `(context, role)`. The
floor VALUE is **0.22** carried unchanged (no re-cut); the denominator is the #70.3
correction that put V2-P2 delivery at 61.56% where v1 died at 18.47%. **Attainability
is confirmed at the sizing smoke** (§6) and the exact perceived deviation RATE is
recomputed at BUILD against the §4 recovered per-`(context × role)` control:

```text
provisional (flat pooled anchor −0.0556):  NEUTRAL deviation share ≈ 53.8% of in-power
  moments (DF 57.3% · MF 56.5% · WG 52.0% · ST 51.3%) — ≈ 2.4× the 0.22 floor.
#65 CHECKPOINT (recomputed at BUILD, per-context control): if the ex-ante perceived
  deviation share falls below 0.22, reading (d) fires at BUILD and the payoff run does
  NOT start (running into a delivery gate known to fail is #29.5's forbidden move).
```

The provisional ~54% sits well above the floor; the build-time recompute against the
recovered control is the binding ex-ante checkpoint, committed to
`data/stage3-v3-p2-prediction.json` (`checkpoint65.pass`) before the run.

---

## 8. Stop rules

* **Any X gate fails ⇒ FAIL.** X5 especially: a fork that cannot reproduce its own
  control is not a counterfactual. X7 covers the §4 control-recovery determinism.
* **PC fails ⇒ FAIL**, no reading published.
* **DEV fails ⇒ UNDELIVERED** (reading (d)); numbers published as data with the label,
  not interpreted (#44.3 GUARD).
* **No re-cutting after sight**: not W, not the horizons, not the lattice, not the
  contexts, not the 150 in-power floor, not the 0.22 DEV floor, not the arms, not §5.5's
  readings, not the §2 argmax/divergence picture. (§4's provisional deviation share is
  refined ONCE at build by the deterministic control recovery, before the run, with the
  delta reported — the pre-registered #71.2 refinement, not a re-cut.)
* **The population law (#26.5)**: if any live substrate change lands before V3-P2 runs,
  the V3-P1 table is stale and the stage stops at the commander; V3-P2 states the HEAD
  it ran at and its armed flags.
* **V3-P2 ships nothing** (Road B): `Match.stationEye` null in every production path;
  the fingerprint unchanged; the table is data, not behaviour.

---

## 9. Registered non-claims

V3-P2 changes no live behaviour and makes no shipping claim. **It cannot authorize
V3-P3** — deployment (the adoption ladder, the canaries + DEGEN battery, the ONE I4
R3-iteration, the enriched-world re-baselined instruments) is V3-P3's object,
HARD-gated there; a positive fork-grain shape result here is necessary, not sufficient,
for it. **The table is consumed under approach semantics only (#41.2)**: every number
is the value of committing a window to an APPROACH by a body of a given role; nothing
here prices "standing", "formations", pressing triggers, cover assignments or set-piece
jobs (each a FUTURE A4 slice, its own contract). The going axis and the brake are
banked, not dead (#77.2(ii)/(iii)). **No gene-mapping conclusion beyond the attribution
split** (§5.5(f)). The division of labour found at V3-P1 is a MEASURED census fact;
whether a percept-honest consumer where each body reads his own column breaks the
convergence signature at fork grain is exactly the open question this stage measures —
and it may honestly come back HALF-2-NULL, DIVERGENCE-TOO-THIN, or UNDELIVERED, each a
finding worth the budget.

---

## 10. RESULT — reading (c) HALF-2 NULL as frozen; and the first positive payoff in three generations

Run **supervised by the resident session** (#49.5, the projection exceeded the
in-session cap — #71.3), the **frozen probe unchanged** (§6: no W / horizon / lattice /
context / floor / arm / §5.5-reading / §2 argmax-picture re-cut after sight). HEAD
`57e3c35` (ruling #79); ENRICHED world, full #67.3 bundle armed
(`edsPerceivedDefence`+`edsPerceivedChoice`+`edsValueAxis`, `c5Hold`, `c6Carry`,
`c7Windup`; `c5TouchFork` off); `src/**` byte-identical to V3-P0 HEAD `49ba867`. Payoff
block **9,210,000 + k** (disjoint from the smoke 9.20 M, above every consumed range); the
run reached the frozen **12,000-moment** budget. Consumed table canonical SHA
**`171a6dad…6559f`** (byte-identical, unconsumed); control-recovery SHA **`968349ff…acc1c`**
(guard PASS, §4.1). Data:
[`data/stage3-v3-p2-role-consumer.json`](data/stage3-v3-p2-role-consumer.json) · file
SHA-256 **`b8917733…be712`** · `deterministic: true` · **verdict: GATES PASS**.

**Scale.** 12,000 station-family moments (1,969 ball-directed skipped, clone coverage
**100%**) → **60,000 forks** priced (five arms); 451 forks ended inside the horizon
(excluded, reported, never zeroed). Across **9,151,239** classified ticks `unexplained` =
0 (`ok` 8,712,984 → okShare **0.959**).

### 10.1 The machinery was PERFECT — every gate PASS

| gate | result |
| --- | --- |
| **X4 — clone coverage** | 12,000 clones taken / 12,000 moments = **100%**. **PASS** |
| **X5 — control identity** | the no-eye fork reproduces the base continuation bit-identically for the full `H_concede`; **480 checked / 0 mismatched**. **PASS** |
| **X6 — force fidelity** | per-record (#43.3); **`unexplained` EXACTLY 0** across 9.15 M ticks; `ok` 8,712,984 → **okShare 0.959**; clamp shares REPORTED-not-gated (onside 249,279 · barred-box 121,266). **PASS** |
| **X7 — determinism** | two `runExperiment()` calls byte-identical; result SHA `b8917733…`; the §4 control-recovery pass twice byte-identical (SHA `968349ff…`). **PASS** |
| **DEV — DELIVERY (HARD)** | NEUTRAL deviation share on the **PERCEIVED-attainable** denominator = **0.4215** (16,041 / 38,055) ≥ 0.22 — **≈ 1.9× the floor**, and it matches the build-time recomputed prediction **0.4008** closely (Δ +0.0207). **PASS** |
| **PC — INVERTED resolves below control (HARD)** | argmin ATE **−0.0229**, cluster-bootstrap CI **[−0.0320, −0.0142]**, upper **< 0** → the family is measurable; the argmin measurably hurts. **resolves. PASS** |
| **perception-price identity** | the #77.2(v) fix landed: the serialized field = ORACLE − NEUTRAL (paired **−0.002775** = oracleATE − neutralATE via ATEs, `holds: true`), NOT the diagnosed `:546` ORACLE − CONTROL mislabel. **PASS** |

The DEV floor holds at ≈1.9× (lower than V2-P2's 2.8× because the WG's near-silence
pulls the pooled attainable share down — the #84.2 pre-registered shape, not a defect);
the build-time prediction landed close (0.4008 → 0.4215). PC resolves clean of zero. The
perception wedge was priced, not smuggled: NEUTRAL percept↔truth agreement **93.66%**
(face 0.976 / threat 0.976 / density 0.964). Every X gate PASS, both HARD gates PASS —
so the readings are **LICENSED** (not the labelled-data convention).

### 10.2 Reading (c) — HALF-2 NULL, honoured as frozen (ruling #85.1); (h) and (i) did NOT fire

**The convergence signature did NOT break at fork grain, DESPITE the 100%
argmax-divergence (§2).** With both HARD gates passed, the PRIMARY mediators decide, and
they fire reading (c):

```text
                        H-V3 predicted        realised (NEUTRAL − CONTROL, paired)
FORK-SPACING  pooled    OPENS (> 0)           −0.313 m  CI [−0.476, −0.165]   CLOSED
              resolved  OPENS hardest         −4.257 m  CI [−6.527, −2.121]   COLLAPSED (n=19)
              unresolved                      −0.283 m  CI [−0.444, −0.124]   CLOSED
FORK-DUPRUN   pooled    FALLS (< 0)           +0.19 pp  CI [−0.23, +0.61]     ns (contains 0)
              resolved  FALLS hardest         −0.74 pp  CI [−2.16, +0.80]     ns (n=75)
```

The between-role column split (§2: every context diverges, a third of moments picking
four distinct cells) **did not translate into fork-grain separation** — spacing closed
pooled and collapsed hardest exactly where the roles' columns diverge most (the
resolved-cell stratum, −4.26 m). Half-2 as written — "convergence breaks BY
construction" — is **refuted at fork grain**, the V2-P2 outcome repeated one layer up.

**Per ruling #85.1, (h) and (i) explicitly did NOT fire.** (h) CONVERGENCE-WRONG-WAY did
not fire — FORK-DUPRUN did not *rise* pooled (+0.19 pp is ns, CI contains 0), so the
V2-P2 §8.3 decisive-wrong-way signature is absent. (i) DIVERGENCE-TOO-THIN did not fire —
the per-role deviation mixes are **grossly distinct**, not noise-clustered (§10.4). The
verdict is the clean (c): the role axis is real in the table but, as consumed at fork
grain, does not break the convergence signature.

### 10.3 The two riders, banked (ruling #85.2) — the first positive payoff in three generations

**Rider (i) — ⭐⭐⭐ the payoff resolved POSITIVE, the first time in three generations.**
Payoff is secondary/REPORTED by the freeze (§5.3), NEVER quoted as the shape verdict —
but for the record it is no longer flat:

```text
NEUTRAL (PRIMARY)   ATE  +0.0108   CI [+0.0039, +0.0178]   ← EXCLUDES ZERO (positive)
                    ATT  +0.0173   CI [+0.0063, +0.0280]   ← EXCLUDES ZERO
GENE                ATE  +0.0117   CI [+0.0048, +0.0184]   ≈ NEUTRAL (no split, §5.5(f))
ORACLE-CTX          ATE  +0.0081   CI [+0.0003, +0.0158]
perception price    ORACLE − NEUTRAL  −0.0028  CI [−0.0080, +0.0028]  ≈ 0 (identity holds)
```

Reading (b) PAYOFF-FLAT did **not** fire (the ATE CI excludes 0); GENE ≈ NEUTRAL so
(f) SPLIT-ON-MAPPING did not fire either. The perception price (g) is REPORTED and near
zero — **the eye barely pays for reading its context through a percept** (truth buys
nothing measurable; the −0.0028 identity is verified, the #77.2(v) mislabel corrected).
The positive payoff is broad-based across contexts, concentrated in **`ours|ownThird|sparse`
+0.0378** [+0.0153, +0.0594] — the DF's certified build-up zone — with `ours|theirThird|sparse`
+0.0186 [+0.0043, +0.0331] and `theirs|ownThird|crowded` +0.0315 [0, +0.0618] the other
resolving cells; no context resolves negative. The value question, downstream of the
shape question by the freeze's own framing, has finally answered UP.

**Rider (ii) — the convergence magnitude improved monotonically, and the per-role
signatures are REAL.** Pooled FORK-SPACING closure has shrunk each generation:
**v2 −1.05 m → v2.1 −0.57 m → v3 −0.31 m** — the role columns pull the bodies less tightly
together than any prior eye, even though they still do not open. And the between-role
split exists **in behaviour, not just on paper** (§10.4).

### 10.4 The per-role tables — the between-role split is real in behaviour

**Per-role deviation mixes (NEUTRAL deviations) — grossly distinct (the (i) test that did
NOT fire):**

| role | ring-180 share | ahead-0 share | radius mix | signature |
| --- | :---: | :---: | --- | --- |
| **DF** | **80.7%** | 19.3% | r7 91.7% · r21 8.3% | r7-heavy dead-behind build-up |
| **MF** | 70.7% | 29.3% | r7 43.8% · r14 48.4% · r21 7.9% | split r7/r14 |
| **WG** | 60.9% | **39.1%** | **r14 100%** | single-radius width, most ahead |
| **ST** | 45.9% | 34.2% | r7 13.2% · r14 68.9% · r21 17.9% | flattest-behind, +12.0% a60 |

The four columns produced four visibly different behaviours — DF concentrates on the
near dead-behind ring, WG sits entirely at r14 and is the most ahead-facing (39.1%), ST
is the least behind-locked and is the only role using a60. This is the between-role
divergence §2.3 predicted, realised in the deviation geometry.

**Per-role payoff ATE — the DF/MF/ST-driven signature with a quiet WG (#84.2's EXPECTED
shape):**

| role | ATE | CI | dev share (byMoment) |
| --- | :---: | --- | :---: |
| **DF** | +0.0177 | [+0.0016, +0.0333] | 0.773 |
| **MF** | +0.0246 | [+0.0086, +0.0419] | 0.841 |
| **WG** | **−0.0004** | [−0.0078, +0.0070] | 0.346 |
| **ST** | +0.0119 | [−0.0044, +0.0271] | 0.772 |

The WG ATE is dead-null — **the eye has nothing to sell the winger** because the world
already pays his job (the #84.2 pre-registered reading; a DF/MF/ST signature with a quiet
WG is the EXPECTED shape, not a surprise). The pooled positive is carried by DF and MF
(both CI-excluding-0), with ST positive-but-straddling.

**Per-role FORK-SPACING / FORK-DUPRUN mediators (paired NEUTRAL − CONTROL):**

| role | FORK-SPACING (m) | CI | FORK-DUPRUN (pp) | CI |
| --- | :---: | --- | :---: | --- |
| **DF** | −0.618 | [−0.894, −0.342] | **+1.16** | [+0.29, +2.09] RISING |
| **MF** | −0.132 | [−0.427, +0.154] | +0.96 | [+0.32, +1.63] rising |
| **WG** | −0.354 | [−0.769, +0.073] | **−1.77** | [−2.95, −0.64] falling |
| **ST** | −0.044 | [−0.402, +0.282] | −0.62 | [−1.39, +0.16] ns |

The mixes are per-role grossly distinct, but the CLOSURE is led by the DF: DF spacing
closes hardest (−0.618 m) and DF duprun RISES (+1.16 pp) — the very cell that dominates
the resolved-cell collapse (§10.5).

### 10.5 The metric confound, named for the record (ruling #85.3 — banked interpretation, not a re-cut)

The resolved-cell spacing collapse (−4.26 m, n=19) and the DF's rising duprun are, per
the commander's ruling #85.3, a **PAID-PROXIMITY metric confound**, quoted here as banked
interpretation (NOT a re-cut — (c) stands as fired):

> the certified table PAYS the DF to do near-ball build-up work (the 16-cell geometry,
> #82.2) — so a lone DF doing his certified job lands NEARER his teammates by the job's
> own definition, and the resolved-cell spacing stratum (−4.26, dominated by exactly
> those cells) penalizes PAID PROXIMITY as if it were pile-up. **Fork-grain spacing
> cannot distinguish 扎堆 from 到岗.** The honest adjudicator of the shape question is the
> MATCH-LEVEL battery (I3 distributions, rest defence, offsides, duplicate runs at 6 Hz
> over whole matches with every body playing his role) — V3-P3's instrument, whose
> canaries are HARD and stop anything ugly.

The receipt for the confound is visible in the arm means: on the resolved cells CONTROL
spacing is **12.18 m** and NEUTRAL **7.92 m** — the eye deliberately moves the DF from a
far idle station INTO his certified near-ball zone, which the paired spacing metric reads
as a −4.26 m "collapse." At fork grain the instrument structurally cannot tell the paid
job from a pile-up; the match-level battery can.

### 10.6 Which sign-space clauses fired

| clause | fired? | evidence |
| --- | :---: | --- |
| **(a) POSITIVE H-V3** | NO | spacing did not open, duprun did not fall |
| **(b) PAYOFF-FLAT** | NO | ATE CI excludes 0 (positive, §10.3) |
| **(c) HALF-2 NULL** | **YES — the verdict** | spacing closed −0.313, duprun ns; convergence did not break at fork grain |
| **(d) UNDELIVERED** | NO | DEV 0.4215 ≥ 0.22 |
| **(e) NOISE** | NO | PC resolved (−0.0229, upper < 0) |
| **(f) SPLIT ON MAPPING** | NO | GENE ≈ NEUTRAL (both +0.011×) |
| **(g) PERCEPTION PRICE** | REPORTED | ORACLE − NEUTRAL = −0.0028 ≈ 0, identity holds |
| **(h) CONVERGENCE-WRONG-WAY** | NO (ruling #85.1) | duprun did not rise pooled (+0.19 pp ns) |
| **(i) DIVERGENCE-TOO-THIN** | NO (ruling #85.1) | per-role mixes grossly distinct, not noise-clustered |

### 10.7 Disposition — the fork is the USER's (ruling #85.4)

The contract licensed V3-P3 only on reading (a); this run fired **(c)**, so proceeding is
a **sequencing override only the user may ratify** (#85.4). The commander banked the two
riders (the historic positive ATE; the monotone convergence improvement and the real
role signatures), named the paid-proximity confound, and returned the fork with a
recommendation:

* **(A) run V3-P3 anyway — commander RECOMMENDS** (deployment + the full HARD battery +
  the R3 iteration), argued on #85.2–3: the payoff is real, the role signatures are real,
  and the one open question — does role-play at scale disperse or clump the SHAPE — is
  precisely what the match-level battery measures and the fork grain structurally cannot;
* **(B) close v3 at fork grain** — bank everything (the certified census, the first
  positive ATE, the machinery), return to the C-track;
* **(C) another road the user names.**

**Nothing proceeds until the user rules.** V3-P2 ships nothing (Road B); `Match.stationEye`
null in every production path; the fingerprint unchanged; **it cannot and does not
authorize V3-P3.**
