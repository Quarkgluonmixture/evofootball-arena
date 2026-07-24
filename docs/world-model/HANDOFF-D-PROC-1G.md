# HANDOFF — execute D-PROC-1G (for the implementing agent)

> Written 2026-07-24 by the planning session. The user handing you this task
> IS the ratification of the fork. **Delete this file in the final commit.**

## 0. Context to load first (in this order)

1. `docs/world-model/MOTION-GATED-INTENT-REOPENING.md` — the contract you
   execute. Flip Status to PRE-REGISTERED in step 1.
2. `docs/world-model/EMBODIED-INTENT-REOPENING.md` — the base experiment
   (D-PROC-1) whose protocol, arms and gate values you copy verbatim.
3. `docs/world-model/GAZE-SUPPORTED-MOTION-EVIDENCE.md` — D-PROC-1MG, whose
   gaze-threading and purity-audit code you splice in.
4. Code: `scripts/probes/embodied-intent-reopening.ts` (the copy base),
   `scripts/probes/gaze-supported-motion-evidence.ts` (gaze splice source),
   `src/ai/intentResponse.ts`, `src/ai/motionEvidence.ts`,
   `src/ai/attentionPolicy.ts` (all three consumed unchanged).

House rules that bind you:

* The ONLY permitted `src/**` addition is the new dormant
  `src/ai/motionGatedIntentResponse.ts` + its test file. No existing
  production or dormant module may change. If it seems necessary, STOP and
  report.
* No gate value, seed, window or predicate component changes after first
  sight of 90k results. A miss is an honest FAIL (note the contract's
  cadence-finding vs mechanism-refutation distinction).
* Never `git add -A`. Two-commit pattern below.

## 1. Pre-registration commit

1. Flip the contract's Status to `**PRE-REGISTERED — no run yet.**`
2. Append to `WORLD-MODEL-NEXT-AUTHORITY.md` after the D-PROC-1MG result: the
   user selected the response-consumer fork; D-PROC-1G is pre-registered with
   D-PROC-1's gates verbatim and two causal substitutions (gaze channel,
   motion-gated support); window 48 is pre-registered as the qualified
   channel's banked parameter.
3. Add a `📋 D-PROC-1G PRE-REGISTERED` block to `docs/ROADMAP.md` under the
   D-PROC-1MG ✅ block (mirror style).
4. Commit those three docs:
   `Pre-register motion-gated intent reopening`.

## 2. Implement

### 2a. `src/ai/motionGatedIntentResponse.ts` (new, dormant)

One pure function family: build/refresh an `ObservedMotionHistory` for
(observer B → actor A) from successive snapshots via the unchanged
`appendObservedMotionSample`, and a support predicate:

```text
supported(candidate) :=
  history has 3 strictly-newer samples
  AND net displacement across history >= 0.50
  AND min inter-sample speed delta > -0.10
  AND alignment(candidate, newest inter-sample displacement bearing) >= 0.50
```

Compose the resulting supported-hypothesis set with the UNCHANGED occupancy
admissibility + cyclic reopening query from `intentResponse.ts`. Mirror that
module's style: pure, validation-boundaried, no Match import.

### 2b. `tests/motionGatedIntentResponse.test.ts`

The contract's 17 hostile tests (D-PROC-1's twelve re-targeted + the five
new brake/two-sample/continuation/redirect-bearing/epoch cases).

### 2c. `scripts/probes/motion-gated-intent-reopening.ts`

Copy `embodied-intent-reopening.ts`, then:

* seeds default `90_000`; experiment/authority strings `D-PROC-1G` /
  `MOTION-GATED-INTENT-REOPENING`; window 36 → 48 ticks;
* `FrozenState` gains B's `acceptanceSnapshot` (pattern:
  gaze-supported-motion-evidence.ts);
* in every arm (H, I and C), B's per-tick perceive call threads gaze exactly
  as in the 1MG probe (one-tick latency, previous-gaze fallback, gaze log +
  snapshot log, post-arm recompute audit, validity/normalisation counters);
* C's belief update replaces the single-observation support rule with the
  2a predicate; I keeps the consumer disabled; H runs the full machinery on
  a held actor;
* surface the three gaze-purity counters as exact gates; change no other
  gate structure or value;
* keep the double-run + canonical JSON + SHA-256 tail.

## 3. Validate before running

```bash
npx tsc --noEmit          # clean
npx vitest run            # all green (baseline 680 + your new tests)
npm run fingerprint       # MUST equal 57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

## 4. Run

```bash
npx tsx scripts/probes/motion-gated-intent-reopening.ts > /tmp/dproc1g.json
```

Deterministic self-check is internal; if `deterministic: false`, debug only
nondeterminism sources.

## 5. Write the frozen result (PASS or FAIL alike)

Append `## 7. Frozen result` to the contract; flip Status
(PASS → response consumer banked, D-PROC-2 design remains a user fork;
FAIL → response family parked with prejudice, noting cadence-finding vs
mechanism-refutation per §6). Report every gate with actual vs frozen value,
the abort census, all zeros, and the SHA. Update
`WORLD-MODEL-NEXT-AUTHORITY.md` and flip the ROADMAP 📋 to ✅/⛔. Update
`PROGRAMME.md`: A2 status, and A3 becomes the open ★ fork on PASS.

## 6. Final commit and push

Stage explicitly: the probe, the new src module + tests, the three updated
docs, PROGRAMME.md, and the deletion of this file. Message:
`Add motion-gated intent reopening` (PASS) or
`Audit motion-gated intent reopening` (FAIL). Push (auth fallback:
`gh auth switch` to Quarkgluonmixture).

## 7. Escalate instead of improvising when

* acceptance cannot reach 96 within 192 seeds (the 48-tick window changes
  attrition; if jointly-completed lands below 72, that is a reportable
  completion FAIL, not a licence to re-window);
* any existing `src/**` file seems to need modification;
* determinism cannot be restored without touching experiment logic;
* the support predicate looks wrong AFTER seeing results (it is frozen).
