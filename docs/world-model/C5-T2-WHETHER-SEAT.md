# C5 T2 — THE WHETHER SEAT (the perceived chooser gains "keep holding")

Status: **PRE-REGISTERED 2026-07-29, FROZEN BEFORE ANY IMPLEMENTATION.** Nothing
is built. Nothing has been run. No `src/**` change is made by this freeze; no
probe for the WHETHER seat exists yet. This document fixes the estimand, the
consumption law, the seam, the gates, the staging and the full sign-space
readings **before** a single line is written — the standing two-commit discipline
(#45.2(b): executor drafts → commander review → authorized implementation →
authorized run → ruling). **This freeze returns to the commander. Implementation
and each run need their own authorization; NO run happens under this freeze.**

## §0 — Authority, and #29.3 satisfied certified

Authority chain: **ruling #63.3** (C5-T2 drafting AUTHORIZED — the WHETHER seat,
the perceived chooser gains "keep holding" as a priced OPTION consuming the
certified re-census table under its own semantics, percept-honest, no subsidy,
the E5h ×1.3 ban standing; option only where the cell carries a certified price;
NEUTRAL consumption first; adoption-safety battery verbatim at its match stage) ·
**#29.3** (the unpark law: C5-T2 drafts *iff any hold cell's cost interval reaches
zero*; a world that still pays nothing re-parks the seat and no subsidy ships) —
**now SATISFIED CERTIFIED** by [`C5-RECENSUS.md`](C5-RECENSUS.md) §EXT-RESULT.7
(the extended re-census PASSED at 3.1732σ; the unpark fired certified on ONE
cell) · **#29** (the original T2 parking and the shape it envisioned: Hold is a
CANDIDATE never a modifier, the census prices it, the seat joins the measured
axis) · **#41.2** (the estimand precedent: a table consumed under its OWN meaning
and NO other — here, *the value differential of committing a hold-window in the
PERCEIVED context*) · **#42/#44** (the P2 lessons: winner's curse, out-of-sample
disjointness, the substrate law that unilateral prices do not compose — hence the
match stage) · **#46.2** (smoke/census seed disjointness) · **#48.4** (fork
window pinned ex ante) · **#49.3** (event-keyed exception classes + per-record
receipts) · **#38.1** (standing exception classes mandatory; decision rules cover
the whole sign space) · **#32.1** (no max-statistic) · **#24** (floors attainable
on the deployed population, checked ex ante) · **#20** (CI semantics, cluster =
match seed; unresolved is never "no effect"). Parent contract:
[`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md) — this stage is its §3 T2, still
under its §4 invariants (Q1 Hold-is-a-candidate, Q2 the-world-pays, Q6 NO FREE
TIME / I1). The certified table: [`C5-RECENSUS.md`](C5-RECENSUS.md), data
`docs/world-model/data/c5-recensus.json` (tableSha
`184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53`). The house
pattern for a percept-honest consumer of a censused table:
[`STAGE3-P2-DORMANT-EYE.md`](STAGE3-P2-DORMANT-EYE.md) §2.

### §0.1 The certified table this seat consumes (stated plainly)

The re-census (HEAD `60a18d7`, enriched world = VALUE arm + c6Carry + c7Windup)
priced *"commit to holding k more ticks vs act now"* per cell
(**pressureBand × staleBand × supportBand**, cuts `0.15/0.45` · `3 s/8 s` ·
support terciles), on a laddered population (rung floor 300), as the paired cost
`mean(shot_holdk − shot_actnow)` at the 240-tick horizon with 95 % cluster
bootstrap CIs. **Every cell carries a certified laddered price. Exactly ONE
(cell, k) reaches zero** (the #29.3 firing condition, upper CI ≥ 0):

```text
CELL  0|0|0   free pressure · fresh ball (low staleTime) · LOW support   rung cell   n = 446
  cost k30  −0.67 pp   CI [−4.66, +3.15]   ★ REACHES ZERO (certified fire)
  cost k60  −7.17 pp   CI [−10.73, −3.69]      resolved-negative
  cost k90 −10.31 pp   CI [−13.60, −6.93]      resolved-negative
```

Every other cell-k is **resolved-negative** (upper CI < 0 — holding provably
costs). The FIRST run's second firing cell (`0|0|1`, mid support) DIED with more
data (small-n noise). This is the whole substrate under the seat: in the calmest
corner of the enriched world half a second of holding is **statistically
indistinguishable from free — but its point estimate is still slightly NEGATIVE
(−0.67 pp).** That fact is the axis of §1's resolution and is never hidden.

---

## §1 — THE ESTIMAND AND THE CONSUMPTION LAW

### §1.1 The consumption law — the table under its OWN meaning, NEUTRAL only

The seat consumes the certified per-cell cost **as-is**: the value differential of
committing a further hold-window in the PERCEIVED context, on the shot-for axis
the census priced (`mean(shot_holdk − shot_actnow)` at the 240-tick horizon).

* **NEUTRAL only in v1 (#63.3, the P2 lesson).** No gene weighting, no `w_s/w_c`.
  The census axis is single-faced (shots-for), so the faithful consumer is the
  unweighted one that reads the cost point exactly as certified. The concession
  twin is a REPORTED mediator, never a selection input. Gene mapping is a
  successor's question (§6 non-claims), pre-foreclosing a max-statistic (#32.1).
* **The option enters the menu ONLY where the perceived cell carries a certified
  price (#63.3).** Every cell carries a laddered price (rung floor 300), so the
  HOLD-k options (k ∈ {30, 60, 90}, each priced from that cell's certified cost)
  enter at every priceable perceived cell. The seat reads the WHOLE table.
* **The strict no-subsidy selection rule.** Nothing is added to the price — no
  optimism term, no hand-tuned hold bonus, no ×1.3 (the E5h ban is absolute).
  Among the priced HOLD-k options the seat may TAKE only a (cell, k) whose
  certified cost interval **reaches zero** (upper CI ≥ 0) — the #29.3 predicate
  consumed per-decision. Everywhere the certified price is resolved-negative the
  hold option is **priced and DECLINED** (holding there provably costs; a
  no-subsidy chooser must not take it). In the certified table this licenses
  exactly one action: HOLD-30 in the perceived cell `0|0|0`.

### §1.2 ⭐ The honest resolution of the zero-price-option question

**The tension, stated plainly.** The certified best cell is *indistinguishable
from zero, not positive* — its point cost is −0.67 pp. A strict-positivity argmax
on the point estimate (the P2 rule: deviate iff advantage > 0 strict) would take
HOLD only where `−cost > 0`, i.e. where cost is strictly positive. **No cell is.**
So a strict-value-maximizing chooser holds NOWHERE — the seat is vacuous and
merely re-derives #29's parking verdict at certified resolution.

Three candidate v1 rules, argued:

```text
(R-A) STRICT VALUE ARGMAX on the point estimate: hold iff advantage > 0.
      Result: NEVER holds (all cell-k point costs ≤ 0). The seat is vacuous
      and re-parks. HONEST, but buys nothing the certified census did not
      already say, and makes the #63.3 authorization pointless.
(R-B) CERTIFICATION-BOUNDARY: hold iff the perceived cell's certified cost
      interval for that k REACHES ZERO (upper CI ≥ 0). Result: holds in
      perceived 0|0|0 at k=30 only. Non-vacuous, testable, and NO subsidy —
      it consumes the table's OWN unpark predicate per decision.
(R-C) any optimism / bonus / ×1.3 term → BANNED by E5h. Not considered.
```

**FROZEN READING: R-B, and the estimand is PRICE-FIDELITY, not value.** The
WHETHER seat's v1 question is deliberately **NOT** "does the chooser hold often"
or "does patience pay" (the census answered the latter: NO, marginally, at the
point estimate). It is: **WHEN the option exists at its certified price, does the
live world confirm that price?** The chooser is, in v1, a **price probe, not a
policy** — it exercises the certified option exactly where the table certified it
is *not provably a loss*, so that we can re-measure the certified cost
out-of-sample, through a real percept, at the moments a percept-honest body would
actually reach it.

R-B is strict no-subsidy, three ways: (i) no term is added anywhere — the price
consumed is the certified point/CI as-is; (ii) the chooser holds ONLY where the
table ITSELF certified the cost is indistinguishable from zero — the world's own
permission, not the engineer's; (iii) the seat makes NO claim that holding pays —
the −0.67 pp point negativity is DISCLOSED and carried into the sign space (§3).
"Hold where the interval reaches zero" is the #29.3 unpark test at per-decision
granularity; it is the freest honest consumption of the certified table, and the
only one that is neither vacuous (R-A) nor a subsidy (R-C).

### §1.3 The estimand, formally

At each eligible decision moment (§2.2) where the body's OWN percept places him in
a cell whose certified k-interval reaches zero, the seat commits a HOLD-k. **The
fork stage** (§3) measures, paired same-seed:

```text
FIDELITY ESTIMAND   δ_live = mean over chooser-taken holds of (shot_holdk − shot_actnow)
                    at the census's own 240-tick horizon, 95 % cluster bootstrap CI.
                    Compared to the certified cell price θ_cert (−0.67 pp for 0|0|0, k30).
```

ACT-NOW is the untouched top-candidate action (never a hold), exactly the census
A0. The seat's action space at a chooser-hold moment is `{ act-now } ∪ { HOLD-k
where the perceived cell's k-interval reaches zero }`; the price of each is the
certified cost; the comparison is paired by construction (identical pre-fork
state). **The match stage** (§5) then measures that deploying the committed hold
degrades nothing (the adoption-safety battery).

---

## §2 — THE SEAM (dormant, default OFF bit-identical)

### §2.1 The flag and the commitment state

```ts
// src/sim/Match.ts — null in every production path, zero live callers
Match.whetherEye: {
  readonly arm: 'neutral';                 // v1: NEUTRAL only (no gene mapping, §1.1)
  readonly scope: { kind: 'body'; gid: number } | { kind: 'team'; side: Side } | { kind: 'both' };
  /** The certified re-census cost table, INJECTED by the probe. No table is bundled in src. */
  readonly table: RecensusCostTable;
} | null = null;

// per-body live hold commitment, cleared whenever whetherEye is null
Match.whetherHoldState: Map<number, { untilTick: number; cellAtDecision: string; k: number }>
```

Default **OFF**; when `whetherEye === null` the world is **bit-identical** to the
shipped game (X-family, §4). The flag joins the `EDS_BUNDLE_ARMED` family only as
an explicit config bit; production callers = zero.

### §2.2 Where the option enters the chooser, and when it decides

**Eligibility = the census's own eligible-choice predicate (C5-RECENSUS §1.5,
repair iv, verbatim), read paired from the pre-fork state and the untouched
top-candidate decision:**

```text
1. SETTLED CONTROL    owner.firstTouchWindow <= 0            (a ball to shield)
2. NOT A FORCED RELEASE  match.restartKickGid !== owner.gid  (mustKick cannot hold)
3. THE ALTERNATIVE IS TO BUILD  the top-candidate (A0) decided action is
   NOT `Shoot` and NOT `ClearBall`  (holding instead of a chosen strike / forced
   clearance is not a real hold choice; instead of a pass/carry/cross it is)
```

The option enters **exactly at the WHETHER fork** — after `cands` are computed and
sorted (`PlayerBrain.ts:817`, `const top = cands[0]`, so A0's action is known for
eligibility), and **before** the existing perceived pass chooser
(`PlayerBrain.ts:832`) and the action commit. If eligible AND the perceived cell's
k-interval reaches zero, the seat overrides `top` with a `ShieldHold` commitment
for k ticks (via the C5 T0 hold machinery — the percept-compliant shield of
C5-RECENSUS repair iii, reachable now through `whetherEye` as well as
`forcedHold && c5Hold`). Otherwise `top` runs unchanged and the pass chooser is
untouched. This mirrors the census fork exactly: A0 = untouched top; HOLD =
override.

**When it decides:** once per body per eligible decision tick (the AI-interval
cadence the census sampled), first eligible tick and on re-entry; the commitment
runs to `untilTick` and lapses if the body loses the ball or a non-'playing'
phase intervenes. The perceived cell is pulled ONCE at the decision instant.

### §2.3 The percept-honest context (the P2 pattern, no truth by the back door)

At the decision instant **and only there**, the body pulls his own snapshot —
`match.perceivedSnapshot(p)`, the E3R2 PULL (#13.3), materialised from the moments
his eyes were actually open (the same pull the census's percept-compliant shield
uses, C5-RECENSUS §1.3). The census's three context features are computed **from
that snapshot and nothing else**:

```text
PRESSURE   from the PERCEIVED nearest opponents' proximity (census pressureAt,
           over perceivedSnapshot opponents)          band cuts 0.15 / 0.45
STALE      the body's OWN possession clock (own touch state — not a percept
           of others)                                 band cuts 3 s / 8 s
SUPPORT    own non-GK non-sent-off teammates in the 6–30 m window, counted
           from the SNAPSHOT (remembered positions included — his memory IS
           his belief)                                terciles (census cuts)
```

**Named abstention classes (mutually exclusive, per eligible decision instant):**

```text
D-HOLD             the seat issued a hold (perceived cell's k-interval reaches zero)
E-ACTNOW-DECLINED  perceived cell placed, but its k-intervals are all
                   resolved-negative → the option is priced and DECLINED (act-now)
E-ABSTAIN-UNSEEN   the snapshot carried no perceived ball / owner → no cell → act-now
E-NOCELL           a perceived owner exists but the cell cannot be placed under the
                   census cuts (missing perceived opponents/teammates) → act-now
```

Falling back to TRUTH to place a cell would be the back door #8(l)/Q1 forbid;
inventing a prior would be A4's doctrine seat smuggled in (Q7). The
perceived-vs-true cell agreement is a **mandatory mediator** (M-CTX, §4.3) — the
census fitted on TRUE context; the seat consumes PERCEIVED context; that exchange
price is a number this run publishes, never an assumption it inherits.

Coverage (ineligible) classes, REPORTED, from C5-RECENSUS §3.5 verbatim:
`X-FIRSTTOUCH · X-MUSTKICK · X-A0-SHOOT · X-A0-CLEAR`.

---

## §3 — THE FORK STAGE (price-fidelity, out of sample)

### §3.1 What it is

Paired same-seed forks at every **chooser-hold moment** (perceived cell reaches
zero) on a FRESH, disjoint block (§5-staging): the seat's committed HOLD against
the untouched act-now continuation, scored on the census's own shot-for axis at
the 240-tick horizon. This is where price-fidelity is measured and where the
gates that can FAIL live. It ships **nothing**.

### §3.2 Gates — X-family VERBATIM (any failure ⇒ FAIL, no reading certified)

From C5-RECENSUS §3.1 X-family and P2 §3.4, verbatim in form:

| gate | predicate |
| --- | --- |
| **X-FP** | `npm run fingerprint` returns `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`, unchanged (the whether-eye seam is null in production; the shield edit stays behind `forcedHold && c5Hold` ∪ `whetherEye`, unreachable when `whetherEye === null`). |
| **X-OFF-IDENT** | with all seat flags OFF, world signatures byte-identical to pre-change HEAD across 3 league seeds × 2 seasons. |
| **X-SEAM** | a test asserts the WHETHER fork is read in exactly ONE place, `whetherEye` is null on a fresh `Match` and a `League` fixture, is unreachable from the E4 preview, and the perceived-cell read consults only `perceivedSnapshot`, never opponent/teammate truth. |
| **X4 (seam inert)** | with the seam armed but the perceived cell resolved-negative (no reaches-zero), the fork's 240-tick signature is byte-identical to the untouched act-now fork, on 3 seeds. |
| **X5 (seam bites)** | for a forced perceived-0|0|0 hold at k=30, the hold arm's signature differs from act-now in ≥ 90 % of moments. |
| **X-CLONE** | clone coverage = 100 % of sampled chooser-hold moments. |
| **X-CONTROL** | the act-now fork reproduces the base continuation bit-identically for the full horizon, per record, sampled 1-in-25, unexplained exactly 0. |
| **X-DET** | two `runExperiment()` invocations byte-identical; SHA-256 emitted and quoted in §RESULT. |

### §3.3 The fidelity ledger, with receipts (#49.3)

Every chooser-hold record classes to a named channel; **unexplained is gated at
exactly 0** over the class set. Standing exception classes (C5-RECENSUS §3.5
verbatim): `E-PAUSED · E-INJURY · E-NOOWNER · E-GKHOLD · E-MATCHEND`. Per-record
receipts (seed, tick, gid, cause) recorded for every exception and every
abstention-class hit, **capped at 1,000 per class** — attribution carries
receipts, not inference.

### §3.4 The priced axes

**(A) PRICE-FIDELITY (the estimand, §1.3).** Realised paired cost δ_live of
chooser-taken holds vs the certified cell price, with an ex-ante band derived from
the certified CIs:

```text
CERTIFIED (0|0|0, k30)   θ_cert = −0.67 pp   CI_cert = [−4.66, +3.15] pp   (SE_cert ≈ 1.99 pp, n=446)
FIDELITY BAND (ex ante)  the realised δ_live's 95 % cluster-bootstrap CI_live
                         must OVERLAP CI_cert  (standard two-independent-interval
                         consistency; both estimators' uncertainty honoured,
                         both samples disjoint by construction).
REPORTED mediator        the paired difference (δ_live − θ_cert) with its CI.
```

Derivation of the band: the certified price is a build-block estimate at n=446
(SE_cert ≈ (3.15−(−4.66))/2 / 1.96 ≈ 1.99 pp). The fork stage re-estimates on a
disjoint block at N_hold ≥ 446 (§3.5), so SE_live ≈ SE_cert and the CI-overlap
test resolves CONFIRM from either directional failure at ~2 pp resolution. The
CI-overlap form is used rather than a fixed ±tolerance because both intervals are
independent out-of-sample estimates; a fixed 3σ difference tolerance
(≈ 3·√(SE_cert²+SE_live²) ≈ 8.5 pp) is too loose to be a real test and is not
adopted.

⚠ **A live warning the fork stage exists to adjudicate.** The certified fire is a
BUILD-block estimate. On the certified HELD-OUT block the SAME cell `0|0|0`
(n=154, fallen to the coarser `pressureStale` rung) resolved firmly NEGATIVE
(k30 −7.69 pp, CI [−9.41, −5.95]). So the "reaches zero" price already failed to
reproduce once, on the held-out half. This is exactly the out-of-sample / small-n
fragility (the P2 winner's-curse lesson) that the fork stage's fresh-block
re-measurement is here to resolve. It is NAMED so the reading is legible; it is
not a prediction of the verdict.

**(B) DELIVERY (the option must actually arise — DEV floor, #24).** From the
certified cell's population share:

```text
census TRUE-context 0|0|0 share (combined)   (446+154)/(73300+29166) = 600/102466 = 0.586 % of eligible moments
DEV FLOOR (two-part, the P2 / C-OFFSIDE form):
   (i)  perceived chooser-hold share ≥ 0.29 % of eligible moments   (= ½ × 0.586 %,
        headroom for the perception wedge — the ½× transfer convention, #48/#56),
   AND
   (ii) absolute N_hold ≥ 446 chooser-taken k30 holds accumulated   (the certified
        cell's own n, so δ_live is at least as well-resolved as θ_cert).
```

Both must clear. **Below the floor ⇒ no fidelity reading is available** (reading
F2, §3.6): the treatment was not delivered — a chooser that rarely/never reaches
the certified cell live is a REAL finding, not an engineering failure (§6). The
block is sized ex-ante by the mandatory sizing smoke (§5.2) measuring the LIVE
perceived-0|0|0 chooser-hold rate — a population-touching quantity that triggers
#44.5's cheap-sizing + commander sign-off BEFORE the run; the provisional ceiling
in §5 is disclosed, finalized at the smoke.

### §3.5 Mandatory mediators (reported, never gating)

```text
M-CTX      perceived-vs-true cell agreement, per feature and overall (the perception price)
M-DELIV    chooser-hold share and N_hold, overall and by k; the declined-cell mix
M-K        the per-k realised cost (30/60/90) even though only k30 is selected —
           legibility on whether the certified negative k60/k90 reproduce
M-ANATOMY  hold survival / lost-to-tackle of chooser-taken holds (I1 / NO FREE TIME:
           a held tick must be attackable — C5-TIME-DIMENSION Q6)
M-CONCEDE  the concession twin of chooser-taken holds (census reported axis)
M-ABSTAIN  the counts of E-ACTNOW-DECLINED / E-ABSTAIN-UNSEEN / E-NOCELL
```

### §3.6 The full sign space, pre-laid (no narrative chosen after the numbers, #38.1)

```text
(F1) CONFIRM — CI_live overlaps CI_cert [−4.66, +3.15]; DEV floor met; X-family
     PASS. The certified price transferred out of sample and through a real
     percept: the seat is a faithful consumer of the table. The MATCH STAGE (§5)
     is the commander's to authorize.
(F2) DELIVERY SHORTFALL (undelivered) — DEV < floor (share < 0.29 % OR N_hold <
     446). No fidelity reading is available; M-ABSTAIN decomposes why (the
     perceived cell is rarer live than the census true-context share, or the
     perception wedge is large). A chooser that rarely holds at certified prices
     is the WORLD'S answer, a real finding (§6), NOT a failure to engineer. P1's
     ghost, gated.
(F3) PRICE DID NOT TRANSFER (below) — CI_live entirely < −4.66 pp: chooser-taken
     holds cost MORE live than the table certified, consistent with the held-out
     block's negative 0|0|0. A real finding: the build-block "reaches zero" was
     optimistic out of sample; the seat re-parks, no ship, no subsidy.
(F4) SURPRISE POSITIVE (above) — CI_live entirely > +3.15 pp: holds cost LESS /
     pay MORE live than certified. A real finding that would motivate a re-census,
     never a ship of a hand-found bonus.
(F5) HARNESS FAIL — any X-family gate fails ⇒ FAIL, the fork returns to the
     commander, no reading is banked as certified.
```

None of F1–F4 is a harness FAIL; all are C5-relevant findings. Which occurs
decides only whether the commander may authorize the match stage (F1), not the
fork stage's own harness verdict (F5 is the only FAIL).

---

## §4 — GATES SUMMARY

**X-family — identity and harness (any failure ⇒ FAIL, F5):** X-FP · X-OFF-IDENT
· X-SEAM · X4 · X5 · X-CLONE · X-CONTROL · X-DET (§3.2, verbatim).

**Fidelity ledger:** unexplained gated at exactly 0 over the class set, both
blocks; per-record receipts capped 1,000/class (#49.3).

**DELIVERY (C-family, #24):** the two-part DEV floor (§3.4(B)); attainability
confirmed ex ante by the sizing smoke (§5.2), not read against it after the fact.

**Price-fidelity:** a PRICED axis with an ex-ante band (§3.4(A)) and the full sign
space (§3.6) — reported, never a harness gate; the certified CI is its band.

---

## §5 — STAGING (frozen)

### §5.1 The fork stage

| item | value | why |
| --- | --- | --- |
| HEAD | `60a18d7` | the certified re-census world (#26.5) |
| world | VALUE arm + **c6Carry + c7Windup** (the enriched world the table was priced on) | C5-RECENSUS §0.1 |
| sizing smoke | seeds **8,500,000 – 8,500,047** (48 matches) | disjoint, read-only; §5.2 |
| fork build block | seeds **8,510,000 +** k | fresh; above every consumed range (§5.3) |
| MAX_MATCHES (provisional ceiling) | **1,600** (8,510,000 .. 8,511,599) | ≈ the census-share expectation for N_hold ≥ 446 at ~59 eligible/match; **finalized at the smoke + commander sign-off (#44.5)** |
| stop rule | walk until the DEV floor (N_hold ≥ 446 AND share ≥ 0.29 %) is met, then finish the current match | delivery-driven (§3.4(B)) |
| HORIZON | **240** ticks from the decision moment | census axis verbatim |
| hold ladder | **30 / 60 / 90** (priced from the table; only reaches-zero k selected) | census verbatim |
| context cells | **pressure × stale × support**, cuts `0.15/0.45` · `3 s/8 s` · census terciles | census verbatim |
| per-match cap | **80** eligible moments | census verbatim |
| MOMENT_SPACING | **30** ticks | census verbatim |
| cluster unit | the **match seed** | #20 |
| bootstrap | 2,000 resamples, frozen seed **50070** | census estimator family, new seed |
| output | `docs/world-model/data/c5-t2-whether-fork.json` (fidelity + delivery + mediators + gates), SHA-256 printed and recorded in §RESULT | data, not src |

### §5.2 The sizing smoke (read-only, disjoint, disclosed — #24 / #46.2)

Because the LIVE perceived-0|0|0 chooser-hold rate is not derivable from the
banked census (which keyed on TRUE context), a read-only smoke over the disjoint
block **8,500,000 – 8,500,047** (48 matches) measures ex ante, with the seat armed
but **no forks and no cost measurement**: the eligible-moment count per match, the
decision-class shares (D-HOLD / E-ACTNOW-DECLINED / E-ABSTAIN-UNSEEN / E-NOCELL),
the perceived-vs-true cell agreement, and hence the live chooser-hold rate that
FIXES the §5.1 ceiling. It runs and is committed WITH the implementation (before
any fork run), so this is ex-ante sizing, not the re-powering-after-sight the
discipline forbids. Its numbers trigger #44.5's commander sign-off on the ceiling.

### §5.3 Consumed ranges — disjointness (#46.2)

Consumed and cleared (C5-RECENSUS §3.4, extended): … C7 T2 7.9M–8.2M · C5
re-census sizing smoke 8.29M · **C5 re-census build 8,300,000 .. 8,301,499** · **C5
re-census held-out 8,400,000 .. 8,400,599** (extension territory to 8,301,200+ /
8,400,480+). This stage's **sizing smoke 8,500,000–8,500,047**, **fork build
8,510,000+**, and the reserved **match stage 8,600,000+** (§5.4) all lie above
every consumed range and are mutually disjoint (a clear gap 8,400,600 .. 8,499,999
separates them from the re-census). Nothing overlaps.

### §5.4 The match stage — PRE-NAMED, not yet frozen

Per the standing pattern (C6/C7 T2), the **adoption-safety battery** runs as
C5-T2's OWN second stage **after the fork stage passes** (F1) and **freezes on the
fork stage's numbers** — it is pre-named here, not fully frozen. Its shape,
pre-committed:

* **Adoption ladder (P2-B form — the seat is a BRAIN change, not symmetric
  physics):** R0 CONTROL · R1 ONE BODY · R2 ONE TEAM · R3 BOTH TEAMS (the
  deployment rung the canaries bind on), same seeds paired, NEUTRAL chooser; the
  live committed hold (no fork). Reserved block **8,600,000 +** `blockIndex·100k`.
* **The adoption-safety battery VERBATIM (C6/C7 T2 / P2-B §4.3–4.4):**

```text
DEGEN-SCRAMBLE  I4 own-within-5 m rises,  CI lower > 0  AND  ≥ +25 % rel  (P0 0.956; 乱抢 = user's #1 hate)
DEGEN-PILEUP    I3 share < 4 m rises,     CI lower > 0  AND  ≥ +50 % rel  (P0 9.40 %)
DEGEN-RESTDEF   I5(b) designated slot falls, CI upper < 0 AND ≥ 20 % drop (P0 65.82 %)
C-OFFSIDE       offsides/match rises,     CI lower > 0  AND  ≥ +10 %
C-BOX           attackers in box at cross arrival falls, CI upper < 0 AND ≥ 15 % drop
                (+ C4 T0's C0/C1/C2/C3 arrival-class mix REPORTED)
C-RESTART       restart ticks/match rises, CI lower > 0  AND  ≥ +10 %  (restart taker excluded)
§2 BAND         C1 §4 verbatim, absolute HARD-ABORT on goals/watchability (guard, never a re-tune)
```

  Bands are KEPT VERBATIM, never loosened, never tightened (a disease is the same
  disease whatever causes it; #52.1). Any limb firing stops the queue outright
  (reading H, the two-reverts lesson), whatever the fork stage said. Restart
  health, decision rate, hold-share by rung, and the R1/R2/R3 saturation gradient
  are REPORTED with CIs (match-level power unknown ex ante; #29.5 forbids gating a
  weak instrument undisclosed). The MDEs, the exact block sizing and the sign
  space FREEZE on the fork stage's realised numbers, in the match stage's own
  pre-registration — the standing two-commit pattern.

---

## §6 — NON-CLAIMS (what this seat does not do)

* **Nothing ships.** Zero live callers; `whetherEye` / `c5Hold` / `c6Carry` /
  `c7Windup` remain default-OFF; the fingerprint is unchanged (X-FP); no table is
  baked into `src/**` (the probe injects it); the live game after C5-T2 is the
  live game before it.
* **A chooser that NEVER holds at certified prices is a REAL finding** (the
  world's answer, reading F2), NOT a failure to engineer. The seat is a price
  probe; if the live percept rarely reaches the one certified corner, that is the
  honest economy of this game at 0.33 s spells, banked as data.
* **NO gene mapping in v1** (#63.3 NEUTRAL-first, the P2 lesson: understand the
  unweighted consumer before weighting it). The gene/stance seat is a successor's,
  pre-foreclosing a max-statistic (#32.1).
* **NO subsidy, NO optimism term, NO hand-tuned hold bonus** — the E5h ×1.3 ban
  is absolute. The seat holds only where the certified table's own interval
  reaches zero, at the certified price, with the −0.67 pp point-negativity
  disclosed (§1.2).
* **It makes NO attribution claim** between c6Carry and c7Windup — the world is
  enriched by both at once; single-flag ablation is out of scope (C5-RECENSUS §4).
* **Stage III interactions are OUT of scope** — the WHETHER seat is priced on the
  current enriched world; any later positioning/anticipation substrate change
  invalidates the table and re-censuses first (#26.5).

## §7 — Stop rules

Any X-family gate fails ⇒ FAIL (F5), the fork returns to the commander. The
price-fidelity band and the DEV floor are frozen here and may not be re-cut,
re-keyed or re-horizoned after sight (a different keying is a new stage). The
match stage does not run until the fork stage passes (F1) and its battery freezes
on the fork stage's numbers. No stage may be rescued by tuning a neighbour.
