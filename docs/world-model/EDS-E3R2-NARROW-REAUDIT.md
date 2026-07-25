# EDS E3R2 — the narrow re-audit: CE2R + X5R2

Status: **PRE-REGISTERED — no run yet.** Drafted by the autonomous session
under commander ruling #13.5. Scope is exactly the two gates E3R failed, in
the honest forms ruling #13.2 and #13.3 gave them. **The 26 banked E3R
results transfer**, and the equivalence pins below are what make that
transfer rigorous rather than assumed.

Date: 2026-07-25

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
