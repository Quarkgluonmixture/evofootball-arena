# EDS E1b — The flagged touch-cost curve

Status: **PRE-REGISTERED — no run yet.** Drafted by the autonomous session
under commander ruling #6 (2026-07-25), which opened E1b on I1's pass and
handed the drafting constraints in
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3.

Date: 2026-07-25

## 1. What this stage is

C1-B's exact one-liner — the honest speed-dependent control cost — returns,
this time **behind an EDS flag, default OFF**, and validated by the E1a
instrument instead of by a live calibrate. C1-B failed at the §2 equilibrium
band, not at the mechanism: it raised miscontrols 34.4% inside its own bound
and then the speed-blind game re-routed itself around the damage (goals
−15.4%, long balls +28.2%). The EDS thesis is that the re-route is what a
BUNDLE fixes; E1b's only job is to prove the curve does at the first touch
exactly what it claims, and to check one canary cheaply before E3 pays for it.

**E1b ships nothing.** No §2 band measurement is authorised here — E3 owns
that question, and the user's play-test at E4 owns the verdict.

## 2. The change (C1-B §12.2 verbatim, behind a flag)

```
clamp01((speed - 6) / 8) * 0.07   →   clamp01((speed - 6) / 16) * 0.24
```

Nothing else in `touchFailChance` moves: the 6 m/s free threshold, the
pressure, blind-side, positioning and technique terms are untouched. The
derivation is C1-B §12.2's and is not re-opened — `8 → 16` moves saturation
from 14 m/s to the 22 m/s ground-pass launch cap, `0.07 → 0.24` sets the
rolled-versus-drilled spread at the same order as the 17.4pp interception
swing power buys, so neither side of the future choice dominates by
construction.

### 2.1 Authorised seat — nothing outside this list

* `src/sim/mechanics.ts` — `touchFailChance` gains a trailing
  `heavyTouchCost = false` parameter selecting between the two curve
  constants; `attemptFirstTouch` and `tryChestTrap` pass `match.edsTouchCost`
  (C1-B moved the function, so both of its callers move with it).
* `src/sim/Match.ts` — `edsTouchCost?: boolean` config flag, default
  **false**, stored readonly. Same pattern as `traceFirstTouch`.
* `src/ai/passOptionValue.ts` — `mirroredTouchFailChance` gains the same
  trailing flag and `PassOptionInput` an optional `heavyTouchCost`, because
  E0's dormant evaluator is where the always-heavy canary is measured. The
  mirror's own comment already names this stage: *"if the real curve moves —
  as EDS E1 will move it — this mirror and that test move with it, together."*
* `tests/passOptionValue.test.ts` — the mirror contract test extended to
  cover BOTH curve states across the same input grid.
* New probe `scripts/probes/eds-touch-cost-curve.ts`.

No other `src/**` change. No new tactical weight, no scalar score, no live
caller of the flag, no default-on anything.

## 3. The measurement

The OFF/ON contrast runs on **E1a's I1 staging** (ruling #6 (a)): a pinned
passer plays a real intended pass to a pinned, isolated teammate facing him,
power swept 0.85–1.15 × distance 6–30 m, every other body parked, pressure
held at exactly 0 and misalign ≤ 0.0005. Both arms use the same match-seed
schedule (`5,100,000+`) and the identical staging schedule. The RNG streams
necessarily diverge once an outcome differs (a spill draws three more values),
so this is a between-arms comparison at large n, **not** a paired difference —
which is why every gate below is sized against its own sampling error.

### 3.1 Analytic predictions (the gates are derived from these)

At held conditions — technique 0.5 (multiplier 0.875), positioning 0.5,
pressure 0, misalign ≈ 0:

```text
bucket    OFF pFail     ON pFail     predicted Δ
 7 m/s     1.641%        2.188%       +0.547pp
 9 m/s     3.172%        4.813%       +1.641pp
11 m/s     4.703%        7.438%       +2.734pp
13 m/s     6.234%       10.063%       +3.828pp
```

### 3.2 Sample size, computed BEFORE the run

For a 3σ separation of the OFF/ON empirical spill difference,
`n = 9·(p_off·q_off + p_on·q_on)/Δ²` per arm per bucket:

```text
bucket 7    11,297      <- binding
bucket 9     2,558
bucket 11    1,369
bucket 13      915
```

Bucket 7 binds because it sits just above the 6 m/s free threshold where the
two curves are closest. I1's 300 reps yielded 2,780 bucket-7 events, so the
sweep is frozen at **1,300 reps** (≈12,050 expected), and the floor gate is
**≥11,300 events per bucket per arm**. Per PROBE-CONTRACTS' sixth threshold
type, no gate below is a point inequality whose SE swamps its own effect.

## 4. Frozen gates

### EXACT — the flag must be a flag

```text
X1 production fingerprint with the flag OFF   57b0bdab…c673 unchanged
X2 flag OFF, seeds 7001-7003                  result signature identical to
                                              pre-E1b HEAD 19f7aa1
X2b flag ON, same seeds                       signature DIFFERS in at least one
                                              (a flag that changes nothing is
                                              not a physics change) — see the
                                              §4.1 amendment
X3 tsc + build clean · full suite green, with the mirror contract test
   extended over BOTH curve states
X4 two invocations byte-identical             shared SHA-256
X5 REPRODUCTION: the OFF arm's first 300 reps reproduce E1a's banked I1
   numbers EXACTLY — events 2,780 / 4,302 / 4,478 / 2,864 and spill
   1.691% / 3.278% / 4.757% / 6.494%
```

X5 is the E0b-style gate: a staging that has silently drifted cannot pass it,
and every number below would be uninterpretable without it.

### 4.1 AMENDMENT to X2b, disclosed before the experiment ran (2026-07-25)

X2b was drafted as *"the signature differs in all three seeds"*. A 3-rep smoke
run — implementation shakedown, not the experiment; the sweep gates cannot even
be evaluated at that size — showed seed 7002 producing an **identical**
signature under both arms, and the reason is structural rather than a bug: a
120-second match contains only a handful of first-touch adjudications, and a
curve change flips an outcome only when that roll's shared uniform draw lands
between the two pFail values — a window of roughly 0.5–4pp per roll. Requiring
all three seeds to diverge is therefore a coin-flip predicate, i.e. exactly the
unpowered point test ruling #6 codified as forbidden.

X2b is amended to **at least one of the three**, which is what a 120-second
match can honestly support. Nothing is weakened: the powered proof that the
flag bites lives in F1d, where thousands of events per bucket test the measured
effect against its analytic prediction inside a ≥3σ band. This amendment is
recorded here, in its own commit, **before** the experiment ran; no gate that
bears on the physics is touched.

### F1 — FIRES: the curve reaches the real adjudication

```text
F1a  >= 11,300 traced events per bucket per arm (the §3.2 computation)
F1b  ON empirical spill rate strictly monotone across the four buckets
F1c  | ON empirical spill − ON mean logged pFail | <= 2.0pp per bucket
       (I1's calibration gate, verbatim)
F1d  INTERVAL TEST: | measured Δ(empirical spill) − predicted Δ | <= 1.25pp
       per bucket, against §3.1's 0.547 / 1.641 / 2.734 / 3.828pp.
       The band is >= 3σ in every bucket at the frozen n
       (σ_diff = 0.18 / 0.29 / 0.35 / 0.41pp), so it can fail on a wrong
       curve and cannot fail on noise.
```

### F2 — the decomposition (ruling #6's two-channel amendment)

```text
F2a ATTRIBUTION of the measured Δ mean pFail, per bucket:
      speed channel carries        >= 95% of Δ
      | pressure channel Δ |       <= 0.05pp
      | misalign channel Δ |       <= 0.05pp
F2b EQUIVALENCE — the flag must not leak into the substrate's own
    blind-side channel:
      | mean misalign_ON − mean misalign_OFF |  <= 0.01 per bucket
```

F2a is what makes the rise un-attributable to the **refuted** pressure-relief
confound: on this staging pressure is identically 0, so a cost increase here
provably cannot be a closing-time artifact. F2b guards the other direction —
E1b touches the speed term only; the power-coupled misalign channel that I2
discovered is pre-existing substrate physics and must read the same in both
arms.

### F3 — the always-heavy canary (E3's question, checked cheaply here)

Re-run E0's prediction block on its own states (seeds `93,000..`) with the
heavy mirror. Every quantity here is deterministic — no sampling error, so no
power computation applies.

```text
C1 predicted touch-cost spread 0.85→1.15 over E0's priced states
     >= 6.0pp   (banked under the old curve: 7.34 → 11.29 = 3.95pp;
                 analytic under the new curve ≈ 6.90pp, because the 0.85 arm
                 arrives at 5.99 m/s — below the free threshold — and is
                 unchanged, while the 1.15 arm's 11.39 m/s term goes
                 4.13pp → 7.07pp. The floor sits 0.9pp under the analytic
                 value to allow for per-state mix.)
C2 EQUIVALENCE: the corridor read must be untouched — predicted threat
     0.843 / 0.586 / 0.446 s, flight 1.713 / 1.303 / 1.061 s and arrival
     5.99 / 8.69 / 11.39 m/s reproduced to 3 dp
C3 REPRODUCTION: with the mirror flag OFF the canary reproduces E0's banked
     7.34 / 11.29 and safest-is-1.15 in 52/52 contested, exactly
```

A note the result must carry either way: E0's "safest" is ranked by corridor
threat alone, so **C1 passing does not by itself prove always-heavy is
broken** — it proves the evaluator can now SEE a cost of the right order
(≈6.9pp against the 21.2pp measured threat swing). Whether that is enough for
no-strict-dominance is E3's gate, and E1b's job is to hand E3 an honest number
rather than a surprise.

### Diagnostics — reported, never gates (ruling #6 (b))

* the contested I2-style staging, OFF vs ON;
* a sealed full-match OFF/ON first-touch trace (miscontrols/match, mean pFail,
  per-channel means, misalign distribution) — this is where pressure and
  misalign actually vary. C1-B already measured what live re-routing does and
  E3 owns it; nothing here may be read as a §2 band result.

## 5. Stop rules

* **Any EXACT gate fails** → revert immediately and report. A flag that moves
  the default path is not a flag, and a staging that fails X5 invalidates
  every number after it.
* **F1c or F1d fails** → the curve did not land as specified. Report; **do not
  re-tune the curve constants** (C1-B §12.5 carried over verbatim: no
  parameter may be re-tuned after seeing results, and the one permitted C1-B
  redraw is being spent HERE, on this staging, not on a new weight).
* **F2 fails** → the increase is being carried by a channel the amendment
  forbids. That is a substrate finding, not a tuning problem: report to the
  commander.
* **C1 below 6.0pp** → the curve is too weak to break always-heavy. Report;
  **do not strengthen the curve**, which would be fitting a constant to a
  canary. The commander redraws E1b's shape or accepts the number into E3's
  design.
* E1b authorises no live ship, no default-on flag, no §2 band claim, and no
  work on E2. On PASS the queue advances to E2's drafting; on any FAIL the
  fork returns to the commander per the design contract §5.
