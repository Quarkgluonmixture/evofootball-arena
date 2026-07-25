# EDS E2b-1R — Consumption-scoped perception

Status: **RUN 2026-07-25 — §6 is the frozen result: PASS on every gate.**
Drafted by the autonomous session
under commander ruling #10.2/#10.3.

Date: 2026-07-25

## 1. What failed, and what the fix may not touch

E2b-1's science passed — not-looking never won, the route mix survived
perception — and its plumbing failed twice. This redraw fixes the plumbing and
must leave the science *bit-for-bit alone*.

```text
G3  brain-cadence perception cost 1.329x against a 1.25x budget
X3  the probe hashed wall-clock, so byte-identity was impossible by construction
```

Ruling #10.3 fixes the lever: **cheaper by computing LESS, never by perceiving
less.** Honesty is frozen — scan cadence, FOV, retention and the keyed
observation error may not move — and the budget stays 1.25× / p95 1.50×.

## 2. The diagnosis the redraw is built on

E2b-1's in-sim perception layer built a **full snapshot** — a scan over every
body, a proprioception write, a retention prune and a fresh `ObservedPlayer[]`
— once per body per brain tick. The only thing in the sim that ever *read* it
was one field:

```ts
match.perceptionSnapshots.get(p.gid)?.ball    // the defender's interception entry
```

Nothing in `src` consumed the player array at all; the passer's choice is
computed probe-side from the probe's own snapshots. So the 33% was almost
entirely work whose output was discarded. That is the codified principle in
ruling #10.3 stated as a bug: **perception cost scales with what consumers
READ, not with what could be seen.**

## 3. The change

Three seams, all of them about *when* and *how much* is computed, never about
what is knowable:

1. **`observeBall` — an O(1) ball percept.** Same scan cadence, same
   visibility rule, same keyed error, same retention, same proprioception
   branch for a carrier — copied from `perceiveSnapshot`'s ball branch, with
   the per-body loop and the array build removed. It needs the observer and the
   ball, so it also skips `capturePerceptionTruth`'s whole-squad allocation.
2. **Memory update split from snapshot materialisation.** `perceiveSnapshot`
   becomes update-then-materialise over the same memory; a consumer that needs
   the array asks for it, and one that does not never pays for it. The public
   function keeps its exact behaviour, pinned by a contract test.
3. **The probe materialises the passer's snapshot at pass-decision moments
   only**, while the memory chain keeps updating every tick — because a memory
   chain sampled only at pass moments is not a memory chain.

## 4. Frozen gates

### EXACT

```text
X1 production fingerprint 57b0bdab…c673 unchanged, flags off
X2 tsc + build clean · full suite green
X3 CORRECTED SCHEME (ruling #10.2): the determinism hash covers WORLD
   OUTCOMES only; wall-clock is reported beside it and never hashed. Two
   invocations must agree on the world hash
X4 flags-off bit-identity: 3 full matches identical to pre-redraw HEAD
X5 harness 3/3 · census reproduces E2a-2's table · factors multiply back to
   E2b-0's curve (all three as in E2b-1)
X6 HONESTY PIN: `observeBall` returns exactly what `perceiveSnapshot(...).ball`
   returns, over a frozen grid of awareness × geometry × tick, memory chains
   advanced in lockstep. Asserted in the probe AND as a contract test — this
   is the gate that stops "cheaper" from becoming "blinder"
```

### B1 — BEHAVIOUR-NEUTRALITY (the decisive gate, ruling #10.3)

Same seeds, same moments, and **every E2b-1 aggregate reproduced exactly**:

```text
realized success per arm      63.28% / 64.60% / 63.46% / 67.90%
long-option share             13.31% / 17.72% / 18.05% / 18.07%
mean chosen distance          12.8118 / 13.3403 / 13.4093 / 13.1824
agreement with the brain      38.05% / 39.64% / 40.81% / 47.42%
class shares, look-pressure (both axes), chain deltas, endpoint lift
```

Compared at full float precision against E2b-1's frozen result. A single
changed choice in 3,000 moments × 4 arms would move these; identity across all
of them is the observable form of "the redraw changed nothing but the cost".
G1 and G2 then reproduce **by construction** and stand as verification, not as
fresh evidence.

The probe also emits a **per-moment choice hash** so future redraws can be
compared against this run directly rather than through aggregates.

### G3 — PERF (unchanged budget)

```text
flag-ON µs/step   <=  1.25 × flag-OFF µs/step, same run
flag-ON p95       <=  1.50 × flag-OFF p95
```

## 5. Stop rules

* **X6 fails** → the cheap path is not the same percept; that is perceiving
  less, which this redraw forbids. Revert and report.
* **B1 fails** → the redraw changed behaviour, so it is not a cost fix; the
  science would have to be re-earned rather than reproduced. Report; never
  re-bank the new numbers as if they were E2b-1's.
* **G3 still fails after consumption-scoping** → **STOP and report** (ruling
  #10.3, verbatim): no honesty shaving, no budget raise. The finding would be
  that honest perception at this cadence costs more than the budget allows,
  which is a design question, not a tuning one.
* Dormant throughout; nothing ships.
* **On PASS the executor drafts E3** (ruling #10.5), and the queue stops at
  **E4 — the user's play-test**.

## 6. FROZEN RESULT — PASS; 1.329× became 1.069× and nothing else moved (2026-07-25)

Run at HEAD `e9e3b49`. Verdict **PASS** on every gate. World hash
`dd6dbd0ad3bb1d64ed5e363345d5d72d56edf3a555f877293108c03a2b3abf38`, identical
across two invocations; perf reported beside it and never hashed.

```text
X1 fingerprint 57b0bdab…c673 unchanged                       ✓
X2 tsc + build clean · 729/729 green                         ✓
X3 world hash identical across two invocations               ✓  (corrected scheme)
X5 harness / census / factors                                ✓ ✓ ✓
X6 ball-only percept == full-path ball                       ✓
B1 behaviour-neutrality, all seven families                  ✓
G1 not-looking must not win                                  ✓
G2 route mix                                                 ✓ ✓
G3 perf mean 1.0692× (1.25) · p95 1.0728× (1.50)             ✓ ✓
```

### G3 — the cost went where the diagnosis said it would

```text                    E2b-1        E2b-1R      budget
µs/step, flag OFF          5.947        5.319
µs/step, flag ON           7.906        5.688
ratio                      1.329        1.0692      1.25   ✓
p95 ratio                  1.406        1.0728      1.50   ✓
```

Honest perception at brain cadence now costs **6.9%**, not 33%, and not one
rule about what a body can see was touched to get there. The whole difference
is that the sim stopped building an `ObservedPlayer[]` and scanning a squad to
answer a question about the ball.

Two corroborations worth recording. The flag-OFF arm measured **5.319 µs/step**
against the frozen baseline's 5.32 — the harness is measuring the same machine
the baseline was taken on. And the perf arms are now **interleaved** match by
match: the previous all-OFF-then-all-ON order let any drift over the run land
entirely on the second arm, and since the gate is a ratio that bias pointed
straight at the flag.

### B1 — the decisive gate: nothing but the cost moved

Every E2b-1 aggregate returned at full float precision:

```text
realized success      0.632844 / 0.646007 / 0.634585 / 0.678974
long-option share     0.133066 / 0.177205 / 0.180511 / 0.180723
mean chosen distance · agreement with the brain · class shares ·
look-pressure on both axes · chosen counts        all exact
```

3,000 moments × 4 arms of choices, and not one of them changed. G1 and G2
therefore reproduce **by construction** and stand as verification rather than
fresh evidence, exactly as ruling #10.3 specified.

### X6 — cheaper, not blinder

The ball-only path returns exactly what `perceiveSnapshot(...).ball` returns,
over memory chains driven in lockstep across awareness × facing × ball-owner ×
distance — asserted in the probe on every run and pinned by
`tests/observeBall.test.ts` on every commit. This is the gate that stops a
future "optimisation" from buying its budget with a wider cone or a lazier
scan.

### X3 — the corrected scheme, demonstrating its own point

The world hash covers world outcomes; the wall clock is reported beside it.
During development the perf measurement was changed (interleaving) and **the
world hash did not move** — which is precisely the separation ruling #10.2
codified, visible in the artefact.

### Disclosures

Two, both found before the frozen run and both fixed by making the redraw
*more* faithful rather than less:

1. **A behaviour change I introduced and then removed.** E2b-1 built snapshots
   only for non-keeper, on-pitch bodies, so a keeper passer fell through an
   undefined lookup and was skipped in **every** arm. Materialising on demand
   silently started including those moments, and the oracle arm moved
   64.6% → 68.3% at smoke scale. That is a behaviour change wearing a
   performance costume; the skip is now reproduced explicitly, and B1 is what
   would have caught it had I not.
2. **The perf measurement order**, described above. Both arms now pay any drift
   equally.

### What this unlocks

The plumbing is fixed and the science it was blocking is now verified rather
than merely banked: **not-looking never wins** and **the route mix survives
perception** — S3b's two graves — at a perception cost of 6.9%. Per ruling
#10.5 the executor drafts **E3** next, and the queue stops at **E4, the user's
play-test**.
