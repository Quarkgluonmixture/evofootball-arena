# EDS E3R — the revised-bundle audit (touch cost out of v1)

Status: **PRE-REGISTERED — no run yet.** Drafted by the autonomous session
under commander ruling #12.4, constraints (a)–(f). Gates are E3's five
families verbatim, re-aimed at the v1 live bundle ruling #12.3 defines.

Date: 2026-07-25

## 1. What changed, and what did not

E3 measured the v1 thesis and refuted it: the §2 band break is MECHANICAL
(spill → loose ball → aerial route), the chooser never chose it (R1: long
share 19.06% live vs 18.05% dormant), and the §4 ablation showed the same
bundle **minus the touch cost** sitting inside every band. Ruling #12 took
touch cost out of the v1 live set and re-seated it to a future C5-coupled
slice; E1b's curve stays banked dormant.

**The v1 live bundle is now `edsPerceivedChoice` + `edsPerceivedDefence` +
the evaluator.** `edsTouchCost` is not armed in any gated arm of this audit.

Nothing else moves. Every gate family below is E3's, verbatim, and the
ablation numbers are NOT a pass — ruling #12.3 says so explicitly, and this
contract exists because a diagnostic arm is not an audit.

### 1.1 Premise correction on constraint (a), disclosed before the run

Constraint (a) says the banked E2b-1R choices "were priced with the flag-ON
touch factor", so E3R must re-bank them flag-off-honest. **They were not.**
Verified in the probes themselves: `heavyTouchCost` and `edsTouchCost` appear
in none of `eds-e2a2-option-space-census.ts`, `eds-e2b0-threat-calibration.ts`,
`eds-e2b1-both-sides-ab.ts` or `eds-e2b1r-consumption-scoped.ts`. The chain is
flag-off throughout:

* the option-space census forked worlds with `edsPerceivedDefence` only;
* E2b-0's calibration read outcomes from those same flag-off forks;
* E2b-1/1R priced a READ option from the census composite — never from the
  `mirroredTouchFailChance` formula — so the E1b curve could not enter the
  price even in principle;
* `src/ai/perceivedPassChoice.ts` (the live consumer) likewise prices the
  composite, so its price is flag-INDEPENDENT. Only the E3 canary consumed
  the flagged curve, and only to report power preference.

So ruling #12's "the evaluator prices the world AS IT IS — never phantom
costs" was already satisfied on the pricing side; what was inconsistent in E3
was the WORLD (touch ON) against a calibration measured with touch OFF, and
removing touch cost from v1 repairs exactly that.

**(a) is therefore executed as a PROOF obligation, not a re-measurement**: the
reference staging is re-run with the pricing path declared flag-off, and it
must reproduce E2b-1R's banked aggregates bit-identically, with G1 and G2
re-verified on that re-banked reference before X4R chains to it. If the
re-bank ever moved a digit, the premise correction would be wrong and this
stage would stop — so the claim is tested, not asserted.

## 2. The build E3R needs (constraint (d))

The only new code is a perf lever, and it may not change one perceived value:

1. **Candidate-scoped materialisation at pass-commit** (the ruling's named
   lever): the snapshot built at a pass decision carries the bodies the
   pricing actually reads — the passer, his candidates, and the opponents the
   corridor read scans — instead of every remembered body.
2. **Allocation-free memory advance**: the scan writes into the stored
   observation in place rather than allocating a fresh record per observed
   body per scan. Same scan cadence, same visibility rule, same keyed error,
   same retention: cheaper because it allocates less, never because it
   perceives less.

Both are pinned by the bit-identity gates below (C1/X4R would break instantly
if either changed a percept), and by `tests/observeBall.test.ts`'s existing
honesty pin. Honesty is frozen: scan cadence, FOV, retention and keyed error
may not move. **Budget stays 1.25× / p95 1.50×; a miss is reported, never
shaved** (ruling #12.4 (d)).

## 3. Frozen gates

### C1 — CHAIN FIRST: the re-banked choice reference (constraint (a))

```text
C1a the reference chooser, pricing declared flag-off, reproduces E2b-1R's
    banked aggregates BIT-IDENTICALLY at full float precision — all seven
    families (realized success, long share, mean chosen distance, brain
    agreement, class shares, look-pressure x2, chosen counts)
C1b G1 re-holds on the re-banked reference: the realized-success chain across
    awareness arms is non-inferior, every step >= -2.0pp
C1c G2 re-holds: the 0.8 arm's long-option share within +-25% relative and
    mean chosen distance within +-15% relative of the oracle arm
C1d the fork-and-force harness still replays reality on all three seeds
```

### X4R — the live consumer chains to THAT reference

```text
X4Ra per-moment identity: the live consumer's choice equals the re-banked
     reference's choice on EVERY moment of EVERY arm (3,000 x 4)
X4Rb with the live consumer choosing, the same seven families come back
     bit-identical to the banked numbers
```

### EXACT (E3's, verbatim)

```text
X1 fingerprint 57b0bdab...c673 unchanged with every flag off
X2 tsc + build clean, full suite green
X3 world hash identical across two invocations (perf reported, never hashed)
X5 perf: the v1 bundle within 1.25x mean / 1.50x p95 of flags-off, interleaved
-- flags-off inertness, trace inertness, cheap-ball-path identity
```

### §2 EQUILIBRIUM BAND (C1 §4 verbatim, unchanged tolerances)

8-season paired calibrate, seed `20260702`, against the frozen baseline
`goals 2.3944 · crosses 2.4894 · headers 9.1039 · long balls 6.2042 ·
cutbacks 3.8151`; goals ±15%, the other four ±25%. The paired baseline arm
must reproduce those five numbers to 4 dp, as it did in E3.

### NO-STRICT-DOMINANCE (constraint (e), purpose documented)

```text
the share of pass moments whose preferred power is the HIGHEST must be
  <= 80%   guards the always-heavy pathology E0 measured in a cost-free world
  >= 20%   guards degenerate never-heavy, which would be a MISPRICING symptom
```

Instrument unchanged from E3 §5 (a) — the evaluator's preferred power at every
live pass moment, joined by
`quintilePrice(threat) x (1 - touchFail(power)) / (1 - touchFail(1.0))`, with
every part reported. **Registered expectation (constraint (e)): the
distribution shifts HEAVIER than E3's 49/33/17, because the touch term now
uses the shipped curve (span 8, weight 0.07) instead of E1b's (16 / 0.24).**
E3's granularity diagnostics (`sameQuintileShare`,
`lowestThreatIsHighestPowerShare`) are reported again.

### CO-EVOLUTION RESTORATION + STYLE (constraint (c))

Paired sealed 10-generation evo, seed `424242`, bundle vs flags off:

```text
CE1 the goals/match advantage (bundle - flags off) must SHRINK in absolute
    size from the first three generations to the last three
CE2 style: distinct coach nameplates AND mean style-share entropy at the final
    generation, each >= 60% of the flags-off run's own value
```

**The two style hypotheses, pre-registered (ruling #12.4 (c)):**

* **H1 — touch-flattening.** E3's entropy collapse (0.497) was downstream of
  the touch cost: a mechanically noisier ground game rewards fewer distinct
  identities. *Prediction:* without the curve, entropy recovers to ≥60% ⇒ CE2
  passes, H1 confirmed, the question is CLOSED and benign.
* **H2 — genome-blind chooser.** The evaluator prices pure measured
  probability, so it may have removed the seat through which tactical genes
  expressed style: whatever a club's genome says about how it wants to pass,
  every club now picks the same measured-best option. *Prediction:* entropy
  stays <60% even without the curve ⇒ **CE2 fails, H2 stands, and the fork
  returns to the commander** for a designed PREFERENCE SEAT (genes modulating
  evaluator weights as priced choices — the two-engines junction), never a
  tuning knob. Per the user's standing instruction, H2 holding returns here
  even if nothing else fails.

Two diagnostics discriminate the mechanism, REPORTED never gated, measured
identically in both arms so they are comparable:

```text
D1 cross-club spread (population std dev) of per-club long balls/match and
   crosses/match over the 8-season band arms — does the bundle flatten how
   differently clubs play?
D2 Pearson correlation of a club's long-ball rate with its coach genome's
   passBias and attackingWidth, both arms — does the genome still express?
D3 bundle arm only: cross-club spread of the CHOSEN option distance and long
   share from the choice trace — the chooser's own club-to-club variety
```

A second evo seed (`515151`) runs both arms as a REPORTED robustness check on
CE2's direction; it is not a gate, and CE1/CE2 are judged on `424242`.

### BEHAVIOURAL CONTRACT SUITE (constraint (f))

```text
aerial.test.ts     "wide teams cross more" must not invert
stamina.test.ts    "a full match SPENDS the tank" — RE-TESTED on the revised
                   bundle: it broke under E3's bundle (0.9626 vs < 0.93) and
                   the touch cost is the obvious suspect, since less ground
                   running follows fewer completed ground passes
freeAgents.test.ts / market
```

Run with `EDS_BUNDLE=1` (which now arms choice + defence only). A break is a
finding to report, never a re-baseline (C1-B §12.4).

## 4. Stop rules

* **C1 or X4R fails** → the chain is broken: fix the consumer or report the
  premise correction as wrong. Never touch the reference.
* **§2 band breaks** → the revised bundle is not survivable either; report
  which dimension, no tuning, back to the commander.
* **CE2 fails** → H2 stands: the fork returns to the commander for the
  preference-seat design. Do not invent a gene→weight mapping here.
* **Dominance or CE1 fails** → report as fired, no instrument change after
  results.
* **X5 misses** → report; no honesty shaving and no budget move.
* **Nothing ships from E3R.** Flags stay default-off. Ship is E4 — the user's
  play-test — and only on a full PASS.
