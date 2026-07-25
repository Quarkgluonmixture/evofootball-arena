# EDS E3R2 — the narrow re-audit: CE2R + X5R2

Status: **RUN 2026-07-26 — ✅ PASS, all 29 gates.** Drafted and run by the
autonomous session under commander ruling #13.5, gates untouched. Perception is
PULL and provably the same perception; style diversity holds ecologically with a
median entropy ratio of **1.5253** across five fresh seeds; perf lands at
**1.1977×** inside a 1.25× budget. E3R's 26 banked results transfer, and P3
proves it: 17 of 17 live numbers bit-identical. **The queue advances to E4 —
the user's play-test — and stops there.** Nothing shipped; flags remain
default-off. Scope is exactly the two gates E3R failed, in
the honest forms ruling #13.2 and #13.3 gave them. **The 26 banked E3R
results transfer**, and the equivalence pins below are what make that
transfer rigorous rather than assumed.

Date: 2026-07-25 (drafted) · 2026-07-26 (run)

## 1. Scope — narrow, by ruling

```text
CE2R  style diversity, gated ECOLOGICALLY: the MEDIAN style-share entropy
      ratio across FIVE fresh sealed-evo seeds >= 0.60, with H2's own three
      mechanism discriminators as CO-GATES
X5R2  lazy perception reconstruction ("perception is PULL", ruling #13.3):
      field-for-field snapshot equivalence lazy-vs-eager under a perpetual
      test, B1-style choice identity against E3R's banked live numbers, and
      the unchanged 1.25x / 1.50x budget
```

Nothing else is re-run and nothing else may be widened. `edsTouchCost` stays
out of the v1 live set; the v1 bundle is `edsPerceivedChoice` +
`edsPerceivedDefence` + the evaluator, exactly as E3R audited it.

## 2. X5R2 — what "perception is PULL" is, in code

Ruling #13.3 registers the semantics: **a body knows what its scans would have
shown, materialised at the moment it acts.** The keyed-noise design is what
makes that safe — an observation is a pure function of
`(seed, observer, entity, tick)` and the truth at that tick, so computing it
later yields the same number it would have had. What changes is WHEN the
computation happens, never WHAT is known.

The build:

1. The **ball** percept keeps its existing eager O(1) path at brain cadence —
   the defender's interception entry reads it every tick it thinks, and that
   path is E2b-1R's, untouched. It also drives the scan clock.
2. At each brain tick, if that body's scan clock fires, the sim records the
   **body truth of that scan moment** into a small per-observer ring (a frame:
   tick + every body's pos/vel/bodyDir/sentOff). Recording a frame costs ~70
   number writes; running ten observations costs five keyed-noise channels and
   a `cos`/`sin` per observed body, which is the cost E3R could not pay.
3. When a body is **asked** (the one pass-commit per decision where the chooser
   runs), its in-retention frames are replayed through the unchanged
   scan/visibility/error/retention code, then proprioception is written from
   the current tick exactly as the eager path writes it, and the snapshot is
   materialised (candidate-scoped, as E3R already does).

Ring capacity is set from the substrate: retention is at most 60 ticks and the
scan interval at least 6, so at most 11 frames can be in window; the ring holds
16. The frame recorded is the truth **at that body's own scan moment**, which is
why the equivalence below is exact rather than approximate — a per-tick shared
frame would differ whenever a restart taker's heading turns between two
observers inside one decide loop (`bodyDir` IS `heading`, `Player.ts:50`).

**Registered boundary (ruling #13.3):** pull semantics is what ships in v1. A
future consumer that must react AT the instant of seeing — an unpolled, push
style event — has to revisit this seat explicitly; it cannot be bolted onto a
pull chain.

## 3. Frozen gates

### X5R2 — the reconstruction must BE the perception

```text
P1 PERPETUAL EQUIVALENCE (the X6 pattern, a committed test, every commit):
   over a synthetic truth sequence x awareness {0.2, 0.5, 0.8, 1.0}, the
   snapshot materialised from the LAZY path is field-for-field identical to
   the snapshot from the EAGER path, at every brain tick of the sequence —
   gid, side, pos, vel, bodyDir, observedTick, ageTicks, ball, and the
   player set itself
P2 IN-SIM EQUIVALENCE: over 3 live match seeds, eager and lazy produce
   identical world signatures AND identical choice traces (per moment: chosen
   gid, class counts, price, distance, look-pressure flags, power canary)
P3 B1 CHOICE IDENTITY vs E3R's banked live numbers, at full float precision:
   the §2 band bundle arm's five dimensions (goals 2.4472... crosses...),
   the trace aggregates (divergence 0.6114409240498161, no-executable
   0.040403727669587296, class shares, mean chosen distance, long share) and
   the dominance share 0.21861863803919032 must come back UNCHANGED
X5 PERF: the v1 bundle within 1.25x mean / 1.50x p95 of flags-off, interleaved
X1 fingerprint 57b0bdab...c673 unchanged with every flag off
X2 tsc + build clean, full suite green
X3 world hash identical across two invocations (perf reported, never hashed)
```

A pin breaking means the reconstruction is not the perception: **fix the
reconstruction, never the pin, and never widen the scope** (ruling #13.5).

### CE2R — style diversity, gated ecologically

Five **fresh** sealed-evo seeds, pre-registered here and never chosen after a
result: `700101, 700202, 700303, 700404, 700505`. Each seed runs both arms
(v1 bundle and flags off), 10 generations, paired.

```text
CE2R  median over the five seeds of (bundle entropy / flags-off entropy)
      at the final generation  >=  0.60
CO-GATES — H2's own three discriminators, whose directions E3R measured and
ruling #13.2 accepted as refuting the genome-blind mechanism:
  M1  median over seeds of (bundle cross-club long-ball spread
      - flags-off spread)  >=  0        (clubs must not play MORE alike)
  M2  median over seeds of (|corr(long balls, passBias)| bundle
      - |corr| flags off)  >=  0        (the genome must not express LESS)
  M3  median over seeds of the chooser's cross-club chosen-distance spread
      >  0                              (the chooser must be club-dependent)
```

Reported, never gated: per-seed entropy and nameplate ratios, per-seed CE1
(the advantage shrink, which E3R already passed and which transfers), the
per-seed discriminator values, and E3R's own two seeds (`424242` = 0.5797,
`515151` = 1.5321) beside the five so the spread of this statistic is on the
record.

**Median, not mean, and the reason is pre-registered:** a final-generation
entropy is a small-sample ecology statistic with a heavy tail (E3R's two seeds
differ by 2.6x), and ruling #13.2 asked for the ecological form of the claim —
"a typical world keeps its variety", not "the average of five worlds does".

## 4. Stop rules

* **Any P-pin fails** → the lazy path is not the eager perception. Fix the
  reconstruction; the pin never moves, the scope never widens.
* **X5 still misses** → report; no honesty shaving, no budget move. The seat
  is then the commander's again.
* **CE2R median < 0.60** → this is a real diversity problem rather than a
  mis-typed gate, and it returns to the commander (the preference-seat fork
  that ruling #13.2 closed would then reopen on evidence).
* **A co-gate fails** → H2's mechanism is live after all; report and return.
* **Nothing ships from E3R2.** Flags stay default-off; E4 is the user's
  play-test, and the queue stops there on a PASS.

## 5. RESULT — ✅ PASS (2026-07-26). Pull perception is the same perception; the ecology keeps its variety

`scripts/probes/eds-e3r2-narrow-reaudit.ts`, world SHA **`3cbb8b8c…456f`**,
world-deterministic across two invocations with perf reported beside the hash.
Fingerprint `57b0bdab…c673` unchanged with every flag off; tsc + build clean;
suite **751/751** (11 new pins across two files). Nothing shipped.

### 5.1 X5R2 — the reconstruction IS the perception

```text
P1 perpetual equivalence (tests/lazyPerception.test.ts)   7/7 tests green
   lazy vs eager snapshots field-for-field identical at every brain tick,
   awareness 0.2 / 0.5 / 0.8 / 1.0 — gid, side, pos, vel, bodyDir,
   observedTick, ageTicks, ball and the player set itself
P2 in-sim identity, eager vs lazy, seeds 700001/2/3
   world signature  IDENTICAL 3/3      choice trace  IDENTICAL 3/3
P3 B1 identity vs E3R's banked live numbers   17 / 17 BIT-IDENTICAL
   (five band dimensions, miscontrols, pass completion, divergence,
   no-executable share, mean chosen distance, long share, look-pressure x2,
   dominance share, three class shares)
X5 perf   4.4685 -> 5.3520 us/step   mean 1.1977x (budget 1.25x)  ✓
                                      p95  1.1529x (budget 1.50x)  ✓
-- flags-off inertness, trace inertness, cheap-ball-path identity     ✓ ✓ ✓
```

**P3 is what makes ruling #13.5's transfer rigorous rather than assumed.** Every
live number E3R banked comes back unchanged to the last digit under the pull
implementation, so E3R's §2 band (goals +2.20%, crosses −8.91%, headers −0.43%,
long balls +8.06%, cutbacks −4.75%), its dominance share (21.86%) and its
reported statistics are properties of the v1 bundle, not of how perception was
scheduled.

**The perf story ends where ruling #10.3's principle said it would.** E3's eager
scheme cost 1.32–1.38×; the same perception, computed when it is asked instead
of when it could be, costs **1.1977×**. Nothing about what a body can see moved:
scan cadence, FOV, retention and keyed error are untouched, and P1/P2 are the
proof rather than the promise.

⚠️ **One measured difference, pinned rather than buried** (companion test in
`tests/lazyPerception.test.ts`): pulled BETWEEN brain ticks — which no live
consumer does, since the chooser runs inside the decide call — the pull path is
*up to date* where the eager path is *as of its last call*. Two consequences,
both one-directional: the body's own proprioception reads now (continuous
proprioception is the eager path's own documented rule), and retention has
forgotten anything now out of window. The pull never holds a body the eager
path lacks, and every shared entry is identical, so it is never better
informed. This is the seat ruling #13.3's registered boundary names: a future
PUSH consumer must revisit it explicitly.

### 5.2 CE2R — style diversity holds, and E3R's 0.58 was the low tail

Five fresh sealed-evo seeds, both arms, 10 generations each:

```text
seed      entropy bundle / flags off    ratio      M1       M2      M3
700101         0.2864 / 0.3679         0.7786   -0.088   +0.135   0.454
700202         0.5963 / 0.3910         1.5253   +0.095   -0.064   0.651
700303         0.2654 / 0.0779         3.4053   +0.461   +0.303   0.487
700404         0.4876 / 0.3326         1.4659   -0.287   +0.174   0.285
700505         0.6799 / 0.3537         1.9225   +0.044   +0.425   0.409

MEDIAN entropy ratio        1.5253   (floor 0.60)                       ✓
MEDIAN nameplate ratio      1.0000   (16 of 16 clubs distinct, every seed) ✓
M1 clubs not more alike     +0.0441  (median, floor 0)                  ✓
M2 genome not weaker        +0.1736  (median, floor 0)                  ✓
M3 chooser club-dependent    0.4538  (median, must exceed 0)            ✓
reference — E3R's own seeds: 424242 = 0.5797,  515151 = 1.5321
```

**Four of the five fresh seeds sit ABOVE 1.0**: under the v1 bundle a typical
world ends up with *more* style variety than the same world without it, not
less. The lowest fresh seed (0.7786) still clears the floor comfortably. Ruling
#13.2's reading is confirmed by measurement: E3R's 0.5797 was one draw from a
heavy-tailed ecology statistic, and the single-seed gate was mis-typed rather
than reporting a diversity problem. **The preference-seat fork stays closed.**

All three mechanism discriminators pass on the median as well, so the pass is
not a chooser that has quietly flattened how clubs play: clubs' route rates
spread slightly WIDER, the genome expresses more strongly in those rates, and
the chooser's own mean chosen distance varies club to club by ~0.45 m.

⚠️ **Reported honestly, though CE1 is banked and not gated here (ruling
#13.1):** across these five fresh seeds the advantage-shrink statistic holds on
only **2 of 5** (700101 and 700505). The per-seed paired goal delta is itself
seed-noisy and mostly NEGATIVE under this bundle (the bundle usually scores
slightly fewer goals, e.g. −0.141 → −0.014, −0.033 → −0.263), so "the
attacking advantage decays" rests on the single seed E3R measured. Nothing here
contradicts the banked result and no gate is affected — but if the commander
ever wants CE1 to carry weight in a ship decision, it needs the same
multi-seed treatment CE2 just got. The reason it does not block E4: there is no
attacking runaway to restore FROM — the deltas hover around zero in both
directions rather than inflating.

### 5.3 Disclosures

* P1's first implementation polled every 5 ticks and failed on the observer's
  own entry. The FROZEN predicate (§3) says "at every brain tick of the
  sequence", so the test was wrong and was corrected to the contract; the
  difference it found is now pinned by its own companion test rather than
  deleted (§5.1).
* The lazy path is the default and the eager one is retained as the pinned
  reference behind `Match.edsEagerPerception` — a probe surface, off in
  production.
* Constraint-scope: E3R2 ran only the two gates ruling #13.5 authorised, plus
  the inertness pins. The C1/X4R staging was NOT re-run; P3's bit-identity is
  the transfer mechanism the ruling named, and the probe staging never touched
  the live perception path.
* One vitest worker RPC timeout appeared while the audit saturated the machine
  and did not reproduce on a quiet re-run (751/751 clean, twice).
