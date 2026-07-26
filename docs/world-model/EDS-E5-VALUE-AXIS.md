# EDS E5 — The value axis (the other half of the decision)

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#15.3**, which authorised E5 with four constraints (a)–(d) and named its
central hypothesis. Nothing here may be tuned after first sight of results.

Date: 2026-07-26

## 1. Why this stage exists

E4 round 1 is the reason, and the user's eyes named it before any probe did:
*"什么配合都打不出来"*. The measurement behind that impression, same seed, two
seasons, flags-off vs the v1 bundle:

```text
third-man releases   10.014 → 6.437   −35.7%
overlap releases      0.176 → 0.056   −68.0%
forward-pass share   58.56% → 53.47%  −5.1pp
shots                 13.47 → 12.66    −6.0%
longest pass chain     5.88 → 6.62    +12.7%   (circulate, don't progress)
```

Ruling #15.2 indicted the mechanism in code, and it is **not** a perception
failure. The E3 seam replaced WHO receives and left WHETHER/WHY on the legacy
score, so the licence and the delivery are granted by two different judges: the
legacy pass loop carries the whole tactical layer (2过1 return ×1.15+, third-man
×1+passBias·0.3·thirdManW, overlap release ×1.3+width·0.6, the ×0.55
anti-back-pass penalty) and all of it only ever shaped `bestMate`; the perceived
chooser then overrides the target with `argmax P(clean reception)`. The overlap
runner earns the pass, the ball goes to the safest man.

The deeper reading, which is what this stage acts on: **the measured axis is
half a decision.** Football wants P(success) × WHAT THE BALL IS WORTH THERE.
E0 refused a scalar by design and rulings #8/#9 forbade invented weights, so the
chooser is progression-blind BY CONSTRUCTION and the safest recycle wins every
tie.

The honest repair is not to re-add hand-tuned bonuses. It is the move E2b-0
already made for the corridor read, applied to the value half: **measure the
exchange rate, never invent the weight.**

## 2. What is measured

### 2.1 E5a — the V-census

E2a-2's fork-and-force staging, **reused verbatim** (which is also E2b-0's
staging, verbatim), with the follow extended past the reception to record WHAT
HAPPENED NEXT. Sets frozen identically to both predecessors — **A = seeds
700,000+, B = 710,000+, 4,500 moments each** — which is what makes X5b below a
real reproduction gate rather than a similarity claim.

**The value outcome, frozen (ruling #15 (a) names three candidates; this stage
gates on the first and reports the other two):**

```text
PRIMARY   shot by the passing team within 240 ticks (4.0 s) of the kick,
          the follow stopping early when the phase leaves 'playing'
REPORTED  progression: ball localX at follow end − at the kick, attack frame
REPORTED  goal by the passing team inside the same window
```

240 ticks is `FOLLOW_TICKS`, the constant this staging already uses — long
enough for receive-and-shoot and for receive-pass-shoot (the combination the
user is missing), short enough that the shot still belongs to this pass. The
dead-ball stop is deliberate: a move that ends in a throw-in produced no shot,
and following through the restart would credit this pass with a corner-kick
goal.

**V's key, frozen: the RECEPTION ZONE** — the candidate's position at the
decision moment (not at arrival: the passer prices what he can see NOW, exactly
as the distance band already works), in the passing team's attack frame:

```text
longitudinal (Team.localX, metres, pitch half-length 31.5)
  Z0  < −10.5      own third
  Z1  −10.5..10.5  middle third
  Z2  10.5..21     attacking third, outer half
  Z3  >= 21        attacking third, inner half
lateral
  C   |y| < 11     central
  W   |y| >= 11    wide
```

Thirds are football's own division, not an invented cut; the attacking third is
halved because that is where the shot gradient is steepest and the sample is
densest; **11 m is the sim's own overlap gate** (`Match.ts:1155`, the constant
that decides whether an overlap release counts), so the wide band is the one the
game already believes in. 8 cells.

**The two factors and their composition, pre-registered exactly (ruling #15
(b), no residual hand weights):**

```text
P̂(option)  = the E3R chooser's price, unchanged
             READ        → THREAT_CALIBRATION quintile (E2b-0)
             SEEN-UNREAD → option-space band prior at the perceived distance
             UNSEEN      → option-space marginal
V̂(option)  = P(shot within 240 ticks | the intended man received CLEANLY),
             measured per zone cell over this census
             seen target → the cell his perceived position falls in
             UNSEEN      → the V marginal (he cannot know where the man is)
score      = P̂ × V̂
```

This product is not a weighting scheme. P̂ estimates P(clean reception) and V̂
estimates P(shot | clean reception, zone), so **P̂ × V̂ estimates one thing the
world can be asked directly**: P(clean reception AND a shot within the window).
Gate V4 asks it directly and compares. That is the whole anti-hand-weight
argument, and it is a measurement, not an assertion.

**Circularity, registered honestly (ruling #15 (a)):** V is measured under
legacy-brain play, exactly as E2a-2's and E2b-0's tables were. A pass into Z3
is worth what it is worth *given how these players then behave*. Sufficient for
v1; if E5b's own audit says the composed chooser has moved play far enough that
the table no longer describes its own world, that is a finding and it returns to
the commander — never a quiet re-census.

### 2.2 E5b — the live composition and the narrow audit

The composed price becomes live behind a **third flag, `edsValueAxis`, default
OFF**, armed only with the other two. A separate flag (rather than folding the
change into `edsPerceivedChoice`) is what keeps the E3R/E2b-1R ablation
available and makes gate X4V below possible.

Then the narrow audit ruling #15 (d) ordered: §2 band + dominance + perf pins +
the watchability instruments — and, ruling #15 (c), the central hypothesis.

## 3. Authorised seat

* New probes `scripts/probes/eds-e5a-value-census.ts`,
  `scripts/probes/eds-e5b-value-axis-audit.ts`.
* `src/ai/passPrior.ts` — the V table added as committed data beside the three
  tables already there.
* `src/ai/perceivedPassChoice.ts` — the composition, behind the flag.
* `src/sim/Match.ts`, `src/sim/League.ts` — the `edsValueAxis` flag only.
* One new perpetual test file for the composition pins.
* **No other `src/**` change.** With the flag off every path is the E3R2 one,
  bit for bit; fingerprint unchanged; zero production callers.

## 4. Frozen gates — E5a

### EXACT

```text
X1  production fingerprint 57b0bdab…c673 unchanged
X2  tsc + build clean · full suite green
X3  two invocations byte-identical                    shared SHA-256
X4  zero live callers (audited)
X5a harness: forcing the brain's own target replays the match bit-identically
    on all three harness seeds (E2a-2's gate, verbatim)
X5b REPRODUCTION — the reception-outcome census must reproduce E2a-2's banked
    option-space table EXACTLY, field by field, table and marginal, AND the
    threat quintiles must reproduce THREAT_CALIBRATION exactly. The staging and
    seeds are identical and only a longer follow was added, so anything else
    means the follow perturbed what came before it — which is impossible in a
    deterministic forward simulation, and therefore a defect in me
X6  the committed V table equals this run's census
```

### V1 — COVERAGE

```text
every zone cell   >= 400 clean receptions per set to be GATED
under-sampled cells are REPORTED, priced at the V marginal, never merged after
seeing results
```

400 is the floor at which a shot rate near 0.12 has SE ≈ 1.6pp, i.e. the cell is
a measurement rather than a rumour. The expected mean is ≈1,000 per cell
(≈8,000 clean receptions over 8 cells), so the floor should bind only on Z3-W.

### V2 — DISCRIMINATION (interval test, powered ex ante)

```text
| best gated cell − worst gated cell |  >= 5.0pp
```

The sign is reported, not gated (ruling #8 (j)'s lesson). What is gated is that
*where the ball arrives changes what happens next at all* — a value table that
does not discriminate is not a value table, and the composition would be
multiplying by a constant. At n ≈ 1,000 per cell and p ≈ 0.12 the SE of the
difference is ≈1.5pp, so 5.0pp is ≈3.4σ.

### V3 — HELD-OUT CALIBRATION (interval test)

```text
per gated cell   | V_A − V_B |  <= 5.0pp        (≈2.3σ at n ≈ 1,000)
marginal         | V_A − V_B |  <= 1.5pp
```

### V4 — COMPOSITION CALIBRATION (the anti-hand-weight gate)

Every playable fork is scored P̂ × V̂ *before* its outcome is known, binned into
quintiles of that score, and compared with the conjunction the product claims to
estimate — clean reception AND a shot within the window:

```text
V4a discrimination   | top quintile − bottom quintile | of the realized
                     conjunction rate                        >= 4.0pp
V4b calibration      | mean predicted score − realized conjunction rate |
                     <= 5.0pp per quintile, <= 2.0pp on the marginal
V4c coverage         every quintile n >= 1,200
```

4.0pp: E2b-0 gated 10.0pp on a rate near 0.56; the conjunction rate here is
≈4× smaller, so the scaled-precedent floor is ≈2.1pp and 4.0pp sits above it.
At n ≈ 2,900 per quintile and p ≈ 0.12 the SE of the difference is ≈0.85pp, so
4.0pp is ≈4.7σ. **V4b is the gate that decides whether the product rule is a
measurement**: if the two factors were not conditionally independent given their
keys, the product would systematically mis-predict the conjunction and the
composition would need a weight — which this stage would then refuse to invent.

### Reported, never gated (E5a)

```text
R1  the V table itself, per cell, both sets
R2  progression per cell (metres) and goal-within-window per cell — the two
    rival value definitions ruling #15 (a) named, so any other composition can
    be applied to these same numbers later
R3  the unconditional shot-within-window rate per composed quintile (the looser
    question the conjunction gate deliberately does not ask)
R4  what V is worth against what P is worth: the spread P̂ alone achieves on
    the conjunction vs the spread V̂ alone achieves, same forks — E2b-0's R2
    move applied to the value half
R5  how often the composed argmax would differ from the P-only argmax at the
    same moments (the size of the change E5b is about to make, measured before
    it is made)
R6  the chosen-subset value: what the live brain's own choices are worth on the
    V axis vs the option space — the value-half analogue of E2a-2's +18.62pp
```

## 5. Frozen gates — E5b

### EXACT

```text
Y1  fingerprint 57b0bdab…c673 unchanged (flag default OFF)
Y2  tsc + build clean · full suite green, new pins included
Y3  the audit's world signatures identical across two invocations, with perf
    reported beside them (E2b-1R's scheme — a perf number may not be hashed)
Y4V FLAG-OFF IDENTITY — with `edsValueAxis` off, the chooser reproduces E3R's
    banked live numbers exactly: X4's 10,292 per-moment comparisons at 0
    disagreements and all seven E2b-1R aggregate families bit-identical
Y5  COMPOSITION PIN (perpetual test): on a fixed synthetic snapshot the composed
    price equals P̂ × V̂ to the last bit for each information class, and with the
    flag off equals P̂ exactly
```

### §2 EQUILIBRIUM BAND (C1 §4 verbatim, as every stage since)

```text
seed 20260702, 8 seasons, paired arms
goals      ±15%      of 2.3944
crosses    ±25%      of 2.4894
headers    ±25%      of 9.1039
long balls ±25%      of 6.2042
cutbacks   ±25%      of 3.8151
and the flags-off arm must reproduce those five baselines to 4 dp
```

### NO-STRICT-DOMINANCE

```text
preferred-highest-power share  20% <= share <= 80%
```

Unchanged from E3R, where it passed at 21.86%. V is power-independent by
construction (a zone does not move with pass weight), so the canary's joining
rule is untouched; the gate is kept because the composition changes WHICH
options reach the canary.

### H — THE CENTRAL HYPOTHESIS (ruling #15 (c))

Three arms on the band staging, paired, same League seed, **24 seasons** (≈1,700
matches per arm — E4 round 1 saw 2 seasons, and the overlap counter at 0.176 per
match needs the length before a ratio means anything):

```text
arm 0  flags off                              the reference
arm 1  perceived choice + perceived defence    the v1 bundle E4 round 1 played
arm 2  arm 1 + edsValueAxis                    this stage
```

Measured value REPRODUCES combination play without the hand-coded bonuses. All
four must hold, on arm 2 against arm 0:

```text
H1  third-man releases    >= 0.85 x flags-off       (E4 r1 bundle: 0.643x)
H2  overlap releases      >= 0.70 x flags-off       (E4 r1 bundle: 0.318x)
H3  forward-pass share    >= flags-off − 2.0pp      (E4 r1 bundle: −5.1pp)
H4  shots                 >= 0.97 x flags-off       (E4 r1 bundle: 0.940x)
```

Every threshold closes **50–60% of the gap E4 round 1 measured** (H1 60%, H2
56%, H3 61%, H4 50%) — deliberately one consistent standard, derived from the
banked numbers rather than picked per metric. The reasoning for that level:
the value axis is one of three named seats (the gaze consumer and C5's time
dimension are queued behind it), so demanding full restoration would be
demanding their work too; demanding less than half the gap would not be
"reproduces combination play" in any honest sense. Power at 24 seasons: overlaps
≈300 events in arm 0, so the ratio's SE ≈0.06 — a true ratio of 1.0 fails H2
with probability ≈0, and H1/H3/H4 are far better sampled than that.

**Watchability instruments — REPORTED as band dimensions from now on (ruling
#15 (4), for all three arms):** forward-pass share, third-man releases, overlap
releases, give-and-gos, shots, longest pass chain. Plus passes, completion and
one-touch share, so the E4 round-1 table can be read arm for arm.

### X5V — PERF

```text
mean  <= 1.25x flags-off      p95 <= 1.50x      12 matches, interleaved
```

E3R2 banked 1.1977× / 1.1529× for the bundle. The value axis adds one table
lookup per option, so a measurable rise here would itself be a finding.

## 6. Stop rules

* **X5b fails** → the longer follow perturbed the census. Impossible forward in
  time, therefore my defect: fix and re-run, never re-baseline.
* **V2 fails** → where the ball arrives does not change what happens next in
  this world. That is a substrate finding of the first order and it kills the
  whole value premise; report it, stop, commander.
* **V4b fails** → the product rule mis-predicts the conjunction, so P and V are
  not conditionally independent given their keys and no weight-free composition
  exists on these keys. **Report; do not invent the weight, do not re-key after
  seeing results.** Back to the commander.
* **The central hypothesis (H) fails** → per ruling #15 (c): the value
  definition is myopic — one-step V cannot see two-pass patterns. **Report; do
  NOT bolt the old bonuses back on, do not widen the horizon after seeing
  results, do not re-run with another outcome definition.** Back to the
  commander.
* **§2 band / dominance / perf / any EXACT gate fails** → the usual: nothing
  ships, flags stay default OFF, the fork returns to the commander.
* **PASS on everything** → the flags stay default OFF, the preview toggle is
  extended to arm all three flags together, and the queue stops at **E4 round
  2, the user's eyes**. Ruling #15.1 made E4 iterative; v1 ships when they say
  so, not when a probe does.

## 7. Result

*(frozen on completion — E5a §7.1, E5b §7.2)*
