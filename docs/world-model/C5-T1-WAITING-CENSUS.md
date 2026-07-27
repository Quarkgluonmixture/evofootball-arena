# C5 T1 — The waiting census (fork-and-force hold-k vs act-now)

Status: **PRE-REGISTERED 2026-07-27 — everything below is frozen before any
implementation and before any data.** Drafted by the autonomous session under
the C5 design contract ([`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md) §3 T1,
§4 Q2/Q3), authorised without a new ruling by **commander ruling #27.5** on
T0R's PASS. Nothing here may be tuned after first sight of results.

Date: 2026-07-27

## 1. What T1 is for, and what it must refuse to do

The design contract's stage line: *"THE WAITING CENSUS — fork-and-force, C3R
floor discipline + the attainable-population check ex ante, #20 cluster
semantics, table SHA'd as data, zero src. Time-signature instruments DEFINED
here."*

T0/T0R built the capability and proved it is real, graded and losable. T1
answers the only question that can price it: **what does a second of waiting
buy or cost, on the same outcome axis the pass options are already priced on?**

Three refusals are structural, and they are the reason this stage exists at all:

1. **No forward-looking term is invented.** Q2 binds: the world pays for
   waiting, the census merely reads the exchange rate. Nothing in T1 writes a
   bonus for "a run is maturing" or "pressure is being drawn"; those effects, if
   they are real, arrive through the NEXT decision's genuinely better menu and
   therefore land inside the measured outcome by themselves.
2. **The exchange rate is REPORTED, never gated.** T1's gates are
   instrument-quality gates. A census that gated on "waiting pays" would be an
   experiment with a preferred answer, and Q2 says in advance what to do if the
   answer is no: *"if today's world pays little for patience, the table says so
   honestly; road B enriches the world and re-censuses"*. §8 pre-lays the
   exhaustive readings so no narrative can be chosen after the numbers.
3. **A2b may not be cited here.** The commander's binding interpretation (T0
   §6, C5 §6.5) reserves the free-option question for this table and T3's
   dominance ceiling. T1 is where the comparison is finally made on an OUTCOME
   axis rather than a retention axis — the thing T0's 12.31% baseline could not
   do (§6.3 of T0R).

## 2. Staging, frozen

| item | value | why this and not something else |
| --- | --- | --- |
| build block | seeds **850,000+** | fresh; 840,000 (T0R) and 830,000 (the diagnostic) have both been seen |
| held-out block | seeds **860,000+** | disjoint; C3R discipline — the block that builds may not also validate |
| match duration | **240** | T0/T0R verbatim |
| brain arm | **VALUE**: `edsPerceivedChoice` + `edsPerceivedDefence` + `edsValueAxis` all armed, plus `c5Hold` | the population law (#26.5 / E2a-2's lesson): a table that will price a chooser must be censused over the population that chooser will meet. The pair never arms alone (E4-PREP-2's closed mode list) |
| `c5TouchFork` | **OFF** | the one-touch fork is priced by its own two branches at T2; mixing it into the hold census would confound two forks |
| moment budget | **6,000** build · **2,500** held-out | derived in §7 |
| per-match moment cap | **80** | so the budget spreads across clusters instead of concentrating in a few matches — #20's cluster unit only means something if there are clusters |
| cluster unit | the **match seed** | ruling #20 |
| bootstrap | 2,000 resamples, frozen seed **50007** | T0R's estimator family, new seed |

### 2.1 What a decision moment is (frozen predicate)

A tick qualifies when **all** hold:

* `match.phase === 'playing'`;
* `ball.owner` is non-null, not a GK, not sent off;
* the tick is a **brain-decision tick for that owner** (`AI_INTERVAL` 0.15 s,
  `Match.ts:717`) — the census samples where the argmax actually happens, not
  between decisions, because T0 §6.5 banked that action labels drift inside the
  0.15 s gap;
* at least **30 ticks** since the last sampled moment in this match, so
  successive trials are not one possession counted repeatedly (T0R's spacing,
  verbatim);
* the per-match cap of 80 is not yet reached.

## 3. The arms

Four arms, all forked with `cloneSimulationState` from the **same pre-step
state**, so the comparison is paired by construction:

```text
A0  ACT-NOW    the untouched fork — whatever the brain does, which per the
               Phase-0 map is pass / carry / shoot and never a hold.
               "act-now includes the carry" (C5 §6.5) is the whole point.
A1  HOLD-30    forcedHold for 30 ticks  (0.5 s), then free
A2  HOLD-60    forcedHold for 60 ticks  (1.0 s), then free
A3  HOLD-90    forcedHold for 90 ticks  (1.5 s), then free
```

The ladder is 0.5 / 1.0 / 1.5 s: the top rung is T0R's own measured window, so
its survival and tackle-loss numbers are the banked prior for what the holder
is risking; the two lower rungs exist because the exchange rate is a *curve*
and a single k cannot tell a cost that grows from one that switches on.

After `untilTick` the brain decides normally. Nothing else is forced anywhere,
in any arm.

## 4. The outcome axis, frozen

**The attacking team takes a shot within 240 ticks OF THE DECISION MOMENT.**

* `teams[owner.side].stats.shots` strictly increases inside the window —
  E5d's instrument, unchanged, so the numbers are comparable to the committed
  attempt tables.
* **The horizon origin is the DECISION MOMENT in every arm, not the release.**
  This is the load-bearing choice of the whole stage and it is made here, in
  advance, with its consequence stated: a hold arm spends k of its own 240
  ticks holding. That is not a handicap to be corrected — it *is* the price of
  waiting, and moving the origin to the release would hand the hold arms free
  time and manufacture the result Q2 forbids assuming. A release-origin twin is
  computed and **reported** (§8.3) precisely so the difference between the two
  conventions is visible rather than hidden.
* Every window is simulated to its end whatever happens to the ball —
  E5d's attempt convention, no adjudication conditioning, no
  clean-reception gate.
* Windows are truncated only by `phase !== 'playing'` ending the match; a
  restart inside the window does not stop the clock (both arms alike).

**The concession twin** — the opponent takes a shot within the same window — is
computed on the same rows and reported beside it. Waiting has two failure modes
and a one-sided axis would only see one of them.

## 5. Context keying and the coverage ladder

Cell = **pressure band × staleTime band × support band** (27 cells), all read
from the pre-fork state:

| feature | cuts | provenance |
| --- | --- | --- |
| pressure | `pressureAt(owner.pos, opponents)`, cuts **0.15 / 0.45** | T0R's frozen bands, verbatim — same instrument, same world, banked shares 20.6 / 13.6 / 65.8% |
| staleTime | `teams[side].staleTime`, cuts **3 s / 8 s** | **code-derived, not invented**: `stagnation = clamp01((staleTime − 3)/5)` (`PlayerBrain.ts:191`) is exactly flat below 3 and saturated at 8. Q3 keeps stagnation legacy-only; this stage uses its ramp only as an honest place to cut a feature |
| support | count of own non-GK, non-sent-off players in E0's **6–30 m** window; **terciles of the realised distribution**, declared as a rule now and reported as numbers after | the window is banked (E0/E2a); the cuts are not invented ex nihilo, they are computed by a frozen rule — T0R's tercile precedent |

**Frozen fall-down ladder**, floor **300 rows per arm per bucket**:

```text
(pressure × stale × support)  →  (pressure × stale)  →  pressure  →  marginal
```

Under-filled buckets take the next rung and are **REPORTED, never merged after
seeing results** (E5d C1's rule, verbatim).

⚠️ **Only the pressure-row level is GATED for coverage**, and that is the #24
lesson applied honestly rather than performed: the joint 27-cell occupancy is
**not** derivable ex ante from anything banked, so inventing a per-cell floor
would repeat E5g's P2 in its worse form — a number I made up. The pressure-row
floor, by contrast, IS derivable (§7.2). Cell-level occupancy is a coverage
report, and the ladder is what makes the table usable at T2 regardless of how
the occupancy falls.

## 6. Gates

### 6.1 X-series — identity and harness (any failure ⇒ FAIL)

| gate | predicate |
| --- | --- |
| **X1** | `npm run fingerprint` returns `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`, unchanged |
| **X2** | **zero `src/**` changes**, audited by diff. T1 measures the capability T0 built; it adds none |
| **X3** | two `runExperiment()` calls byte-identical; SHA-256 emitted |
| **X4** | **the seam is inert** (E2a-2's X5, in this stage's shape): with `c5Hold` armed and `forcedHold` set to an ALREADY-EXPIRED `untilTick`, the fork's world signature over the full 240-tick horizon is byte-identical to the untouched fork, on 3 seeds. The A0 arm is that untouched fork, so this pins that arming the seam is not itself the intervention |
| **X5** | **the seam BITES**: for k = 90, the hold arm's world signature differs from A0's inside the horizon in **≥ 90%** of moments. Derived, not hoped: the untouched menu provably contains no hold (Phase-0 map), so divergence is expected at essentially every moment; below 90% the intervention is not reaching the world |

### 6.2 C — coverage

```text
C1  build block:     6,000 moments,  >= 60 clusters
C2  held-out block:  2,500 moments,  >= 30 clusters
C3  every PRESSURE ROW carries >= 300 rows per arm, in BOTH blocks
```

### 6.3 H — held-out calibration (the interval test that makes it an instrument)

Per arm, comparing the build block's table to the held-out block's:

```text
H1  | shotRate_build − shotRate_heldout |  <=  2.0pp   on the marginal
H2  | shotRate_build − shotRate_heldout |  <=  5.0pp   on each gated pressure row
```

E5d's C2 tolerances, verbatim, on the same outcome axis at the same base rate.
A table that does not reproduce on a disjoint block cannot price anything at
T2, so this is the one substantive gate T1 carries — and it is a property of
the instrument, not of the hypothesis.

### 6.4 What is deliberately NOT gated, and why

* **The exchange rate itself** (§1 refusal 2, §8).
* **Discrimination across cells.** E5d gated it because E5a had already
  established that its keying discriminates; here there is no such prior, so a
  discrimination floor would be a number nobody powered — exactly what killed
  T0's A3. It is reported in full.

## 7. Power and attainability, derived ex ante

### 7.1 The marginal

Base rate from the banked attempt table: shot-within-240 ≈ **7%**, so
σ² ≈ 0.065. Treating the arms as INDEPENDENT (conservative — they are paired by
construction, which can only shrink the interval):

```text
SE(difference) = sqrt(2 · 0.065 / n)
n = 6,000  ⇒  SE = 0.466pp  ⇒  MDE at 80% / α = 0.05 = 2.8 · SE = 1.30pp
with a 1.5× cluster-variance inflation:      SE ≈ 0.57pp  ⇒  MDE ≈ 1.60pp
```

So the build block resolves a **1.6pp** exchange rate on the marginal. That is
the resolution being bought, stated as a number before the run so that a
smaller measured effect is read as *unresolved*, not as *zero* (#20).

### 7.2 Attainability — checked, not assumed (#24)

* **Moments are budget-bound, not population-bound.** A decision moment is any
  ball-owner decision tick; T0R harvested 12,000 such trials from 76 clusters
  at a 30-tick spacing. With the 80-per-match cap, 6,000 moments needs ≈ **75
  matches** and 2,500 needs ≈ **32** — both comfortably inside a block walk,
  and both floors therefore reachable by construction. This is the opposite of
  E5g's P2 and the check is written down rather than implied.
* **C3's 300-per-row floor is derivable from banked data**: T0R's realised band
  shares were 20.6 / 13.6 / 65.8%, so the smallest pressure row holds ≈ **814**
  rows in the build block (2.7× the floor) and ≈ **339** in the held-out block
  (1.1× — thin by design, which is why H2 gates only rows meeting the floor in
  BOTH blocks).

### 7.2b ⚠️ DISCLOSED BEFORE THE RUN: the realised base rate is ~3× the assumed one

A sizing smoke (60 moments, no gate read) puts the act-now shot rate at
**≈21%**, not the ≈7% §7.1 took from the attempt table's marginal. The two are
different populations and I should have seen it while writing §7.1: the attempt
table asks *"did a shot follow this PASS to this target"*, while T1 asks *"did a
shot follow this POSSESSION MOMENT" — a moment that includes carries, shots and
every other thing the argmax can do. A quarter of a 4-second window near the
ball produces a shot far more often than one particular pass does.

Two consequences, both recorded rather than repaired:

* **The marginal resolution is worse than §7.1 claimed.** At p ≈ 0.21,
  σ² ≈ 0.166, so the unpaired SE at n = 6,000 is 0.74pp and the MDE is **2.1pp**
  (≈2.5pp with cluster inflation) rather than 1.6pp. The primary estimator is
  PAIRED, which cuts this substantially, but by how much is a property of the
  data and will be reported as an achieved interval rather than claimed here.
* **H1's 2.0pp tolerance is tighter than it looked**: against a build/held-out
  difference SE of ≈0.95pp it is **2.1σ**, not the ≈3σ E5d's tolerance
  represented at its own base rate. So H1 may fire on noise, and if it does that
  is a gate I mis-sized, not a table that failed to reproduce.

**Nothing is changed**: not the budget, not the tolerance, not the axis. Moving
either after seeing a base rate is the re-powering-after-sight the discipline
forbids, and #19's answer to a gate that looks wrong after the fact is to report
the FAIL, not to redraw it. The numbers above exist so that whatever fires can
be read for what it is.

### 7.3 No staging pin is available, and that is stated

#18 asks a stage to pin against banked integers wherever a staging is reused.
T1 reuses none: fresh blocks, a new population (decision moments, not pass
moments), a new arm set. There is nothing honest to pin against, so **X4/X5
carry that weight instead** — one proving the seam changes nothing when
inactive, the other proving it changes the world when active.

## 8. The exchange rate — pre-laid, exhaustive, reported

For each k, the primary statistic is the **paired per-moment difference**,
`mean(shot_holdk − shot_actnow)`, with a 95% cluster bootstrap over match
seeds. Read under #20's semantics — an interval straddling zero is
INCONCLUSIVE, never "no effect".

### 8.1 The three readings, fixed now

```text
(a) NEGATIVE and resolved       waiting costs shots at this k. The table
                                prices a real cost; T2's chooser will pick a
                                hold only where the cost is repaid, and the
                                honest headline is that today's world charges
                                for patience.
(b) INDISTINGUISHABLE           at 1.6pp resolution the world neither pays nor
                                charges. Q2's registered outcome: the table
                                says so, C5 continues on feel/realism grounds
                                (§1 of the design contract already registered
                                C5 as a feel slice, not an overlap repair),
                                and road B's enrichment re-censuses (#26.5).
(c) POSITIVE and resolved       waiting pays in the CURRENT world. The most
                                surprising of the three and the one to
                                distrust first: it would mean the live argmax
                                is leaving value on the table every 0.15 s,
                                and it returns to the commander with the
                                concession twin and the per-k curve beside it
                                before anything is built on it.
```

None of the three is a FAIL. All three are C5-relevant, and which one occurs
does not change T1's verdict — only what T2 is allowed to assume.

### 8.2 The shape questions, reported

Monotonicity in k (a growing cost vs a switch); the curve per pressure band
(T0R found protection concentrates where a tackler is in range — the same
shape would be a coherence check, not a gate); the concession twin per k; the
per-cell table in full; the loss-cause split of held balls that never got to
release; and the **paired-vs-unpaired** estimator side by side, so the pairing
premium is visible rather than claimed.

### 8.3 The release-origin twin

The same statistic with each hold arm's 240-tick window starting at RELEASE
instead of at the decision moment. **Reported, never gated, and never
substituted for the primary** — it answers "was the ball better when he finally
played it", which is a different question from "was waiting worth it", and
keeping both visible is what stops the second question being quietly answered
with the first.

## 9. Time-signature instruments — DEFINED here (the tempo census)

The design contract puts the tempo census on this stage; the user's 1.1–1.2×
anchor has been waiting for a measurement. These are computed on **whole
matches, unforked**, over the build block, in **two worlds** — flags-off legacy
(what the user actually plays) and the VALUE arm (what the census is keyed on)
— and reported as a paired baseline that every later C5/C7 stage re-reports.

```text
TS1  passes per minute        stats.passes / (possessionTime in minutes), per team
TS2  one-touch share          stats.oneTouch / stats.passes, per team
TS3  ownership-spell duration a maximal run of consecutive 'playing' ticks with
                              the same ball.owner; mean / median / p90 seconds
TS4  time-to-release          TS3 restricted to spells ENDING in a kick by that
                              owner, split from spells ending in a loss —
                              the two have different meanings and E5a's lesson
                              is that one number with two meanings is a defect
TS5  decisions per possession ticks-with-an-owner / AI_INTERVAL ticks — how many
                              times the argmax is re-run before the ball leaves
```

They are **instruments, not gates, at this stage**: nobody has yet established
what a right tempo number is, and inventing one now would be the same error as
T0's A3. Their job is to exist, be frozen in definition, and give T3/T4 a
before/after that the user's feel can be compared against.

## 10. The deliverable

`docs/world-model/data/c5-t1-waiting-census.json` — the canonical table
(cells, ladder resolution, per-arm rates, counts), with its SHA-256 printed by
the probe and recorded in §11. **Data, not src**: T1 stays at zero `src/**`, and
baking the table into a `src/ai/` module the way `passPrior.ts` was baked is
**T2's job under T2's own contract**, pinned to this SHA so the two cannot
drift.

Probe: `scripts/probes/c5-t1-waiting-census.ts` (new; edits no existing probe).

## 11. Result — RUN 2026-07-27: ⛔ **FAIL on H1. The queue stops.**

SHA `72c187aa…8e43`, twice byte-identical. **6,000 moments / 75 clusters** build,
**2,500 / 32** held-out. Zero `src/**` (`git diff` = 0 lines), fingerprint
`57b0bdab…c673` unchanged. Table `docs/world-model/data/c5-t1-waiting-census.json`,
**table SHA `7ea8152a…06e1`**.

| gate | result | |
| --- | --- | --- |
| **X4** seam inert (expired `forcedHold` ≡ A0 over 240 ticks, 3 seeds) | 3/3 identical | ✅ |
| **X5** seam bites at k=90 | **100.00%** of moments diverge | ✅ |
| **C1** build ≥6,000 moments, ≥60 clusters | 6,000 / 75 | ✅ |
| **C2** held-out ≥2,500, ≥30 clusters | 2,500 / 32 | ✅ |
| **C3** ≥300 per pressure row per arm, both blocks | 864 / 705 / 4,431 · 351 / 313 / 1,836 | ✅ |
| **H1** marginal reproduces within 2.0pp, per arm | **actNow 2.99pp**; hold30 1.56 · hold60 **0.06** · hold90 0.87 | ⛔ |
| **H2** each gated pressure row within 5.0pp, per arm | max 4.0pp, all twelve inside | ✅ |
| **D** determinism | two runs byte-identical | ✅ |

### 11.1 The FAIL, and what it is actually made of

**Only the act-now arm missed, and only on the marginal.** All three HOLD arms
reproduce across disjoint blocks at 1.56 / 0.06 / 0.87pp, and every one of the
twelve gated pressure rows is inside H2's 5.0pp. The act-now level moved
31.35% → 28.36%, and the movement is concentrated in the top pressure band
(31.71% → 27.72%, 4.0pp), which is also where two thirds of the moments live.

This is the gate §7.2b flagged before the run as **2.1σ rather than ~3σ at the
realised base rate**, and it fired at ≈3.1σ of the naive interval — i.e. right
at the edge where a mis-sized tolerance and a real block difference are not
distinguishable by this design. With the match seed as the cluster unit and
**32 held-out clusters**, "how shot-heavy a match is" is a cluster-level
property, and the marginal is the statistic most exposed to it; the per-row
comparison at a tolerance that respects that passes everywhere.

**I am not relaxing it.** §12 says H may not be relaxed after sight and the
tolerances were inherited whole precisely so they could not be argued about
later. The honest statement is the one recorded in advance: *if H1 fires, that
is a gate I mis-sized, not a table that failed to reproduce* — and the evidence
now says exactly that, because the arms the table exists to price all reproduce
and the rows all reproduce. A re-powered T1R would size H1 off this run's own
cluster variance and use more held-out clusters, not a looser number.

### 11.2 ⭐⭐⭐ The exchange rate: reading (a), resolved, and monotone in k

Paired per-moment difference (hold-k − act-now), 95% cluster bootstrap:

| k | waiting's cost | 95% CI | concession twin | release-origin twin |
| --- | --- | --- | --- | --- |
| **30** (0.5 s) | **−7.55pp** | [−9.35, −5.73] | **+1.45pp** [0.73, 2.18] | −6.53pp [−8.47, −4.45] |
| **60** (1.0 s) | **−12.77pp** | [−14.68, −10.95] | **+2.63pp** [1.82, 3.45] | −10.20pp [−12.13, −8.32] |
| **90** (1.5 s) | **−16.12pp** | [−18.02, −14.28] | **+3.55pp** [2.68, 4.42] | −12.40pp [−14.50, −10.47] |

Marginal shot rates: act-now **31.35%**, hold-30 23.80%, hold-60 18.58%,
hold-90 15.23%.

**In today's world, waiting is expensive at both ends and the cost grows with
every tick held.** Half a second costs 7.6pp of shot probability and buys 1.5pp
of extra concession; a second and a half costs 16.1pp and concedes 3.6pp. Every
interval is far from zero — this is not the 1.6pp-resolution question §7.1
worried about, it is an effect ten times the resolution.

**§8.3's twin closes the obvious defence.** "He waited and then played a better
ball" is measurable, and it is false: re-anchoring the window at the RELEASE
still leaves waiting **−6.53 / −10.20 / −12.40pp**. The ball is not better when
it finally goes; it is simply later. The twin is reported, never substituted —
but the direction it points is the same one.

**By pressure band** (k=90): free **−10.53pp**, mid **−18.87pp**, pressed
**−16.77pp**. Waiting costs least when nobody is near you, which is coherent
without anyone designing it in, and matches T0R's shape — the world only
charges for time when there is someone to charge you.

**Hold anatomy**: the forced hold survives its own window 84.8 / 76.7 / 68.8%
of the time, losing to a tackle in 5.7 / 12.7 / 19.4%. The 68.8% at k=90 sits
beside T0R's 70.2% on a different population and a different arm — close, and
neither is a pin.

### 11.3 What this does and does not say

**Registered in advance and honoured now**: reading (a) is not a FAIL and not a
refutation of C5. What it establishes is narrower and sharper —

* **A T2 chooser priced from this table would essentially never hold.** That is
  the single most consequential thing T1 hands forward, and it is a design fact
  the commander needs before T2 is drafted, not after.
* **Part of the cost is mechanical by construction, and that was the design.**
  A held tick is a tick removed from the same 240-tick window, and §4 fixed the
  horizon at the decision moment precisely so that time cost would be counted
  rather than hidden. So the honest claim is *"on this axis, in this world, a
  held tick is a spent tick and nothing currently pays it back"* — **not**
  "patience has no value in football".
* **Q2 anticipated this exact outcome**: *"if today's world pays little for
  patience, the table says so honestly; road B enriches the world and
  re-censuses (#26.5)."* The world that would pay for waiting — a maturing run
  that is worth waiting for, a press that can be drawn and beaten, a receiver
  repertoire — is the world road B is building. This table is the before.
* **It is the fourth independent arrow at the same seat, pointing the other
  way.** E4r1, the user's round-2 anchor, E5f/E5g and now T1 all agree that the
  substrate does not currently reward waiting; the first three read it as a
  missing capability, and T1 says the capability alone would not be selected.

### 11.4 §9's time-signature instruments — the tempo baseline

Whole matches, unforked, 75 seeds of the build block, both worlds:

| instrument | legacy (flags-off) | VALUE arm |
| --- | --- | --- |
| **TS1** passes / minute of possession | **28.34** | 29.64 |
| **TS2** one-touch share | 19.35% | 19.63% |
| **TS3** ownership spell, mean / median / p90 | **0.678 / 0.333 / 1.383 s** | 0.644 / 0.333 / 1.333 s |
| **TS4** time to release (released / lost) | 0.718 s (n=8,211) / 0.465 s (n=1,535) | 0.683 s (n=8,435) / 0.452 s (n=1,706) |
| **TS5** decisions per spell | 4.52 | 4.29 |

⭐ **The user's anchor now has a number: the median possession spell in this
game is 0.33 seconds, and the mean is 0.68.** A player has the ball for about
four and a half decision ticks before it leaves him. That is the receive-phase
time dimension's absence measured directly, and it is the baseline every later
C5/C7 stage re-reports. The two worlds are within 5% of each other on every
instrument, so the perceived brain is not what sets the tempo.

### 11.5 The table, and the ladder's honesty

`docs/world-model/data/c5-t1-waiting-census.json`, table SHA
`7ea8152a…06e1`. Support terciles came out **<3 / 3 / ≥4** teammates in the
6–30 m window.

Of the 27 cells, **5 resolve at cell level, 9 fall to (pressure × stale) and 13
fall to the pressure row** — which is exactly what §5's disclosure said would
happen and the reason no per-cell floor was gated. Nothing was merged after
seeing results; the ladder was frozen before the run and every cell reports
which rung it landed on.

### 11.6 Disposition

**FAIL ⇒ the fork returns to the commander** (§12). Nothing shipped: zero
`src/**`, no flag, no live caller, fingerprint untouched. The table is committed
as data and is usable — T2's baking of it into a `src/ai/` module is T2's own
contract's job, pinned to the SHA above — but T1's own certification did not
complete, and whether the census is adopted on a mis-sized-gate reading or
re-run as T1R with a re-powered H1 is not mine to decide.

## 12. Stop rules

* **Any X gate fails ⇒ FAIL.** X4 failing means the census measured the seam,
  not the world; X5 failing means it measured nothing.
* **C or H fails ⇒ FAIL.** An uncalibrated table cannot price T2's chooser, and
  no amount of interesting exchange-rate structure rescues it. In particular H
  may not be relaxed after sight — the tolerances are E5d's, inherited whole,
  precisely so they cannot be argued about later.
* **The exchange rate cannot fail** (§8.1) and cannot be re-cut, re-keyed or
  re-horizoned after sight. A different keying is a new stage with a new
  pre-registration.
* No stage may be rescued by tuning a neighbour (design contract §6). Any FAIL
  returns to the commander.
