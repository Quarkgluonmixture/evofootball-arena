# EDS E2b-1R — Consumption-scoped perception

Status: **PRE-REGISTERED — no run yet.** Drafted by the autonomous session
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
