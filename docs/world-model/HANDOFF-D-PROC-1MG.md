# HANDOFF — execute D-PROC-1MG (for the implementing agent)

> Written 2026-07-24 by the planning session that ran S3-G1. The user hands
> this file to a cheaper executor model together with the ratified fork.
> **Delete this file in the final commit of the executed experiment.**

## 0. Context you must load first (in this order)

1. `docs/world-model/GAZE-SUPPORTED-MOTION-EVIDENCE.md` — the draft contract
   you are executing. Flip its Status to PRE-REGISTERED in step 1.
2. `docs/world-model/TEMPORAL-MOTION-EVIDENCE.md` — the base experiment
   (D-PROC-1M) whose protocol and gate values you copy unchanged.
3. `docs/world-model/OBSERVER-LOCAL-ATTENTION-POLICY.md` — S3-G1, whose gaze
   replay semantics (one-tick latency, previous-gaze threading, purity audits)
   you copy unchanged.
4. `scripts/probes/temporal-motion-evidence.ts` — the code you copy.
5. `scripts/probes/attention-policy-foundation.ts` — the gaze/audit code you
   splice in.

House rules that bind you:

* **No production file may change.** `src/**` is read-only for this task. If
  you believe a `src/` change is needed, STOP and report to the user.
* **No gate value may change after the first look at 89k results.** The gates
  are frozen in the contract. A miss is an honest FAIL, written up as such.
* **No seed shopping.** Seeds are `89,000..89,191`, period.
* Never `git add -A`. Stage explicit paths only.
* Two-commit pattern (see steps 1 and 6).

## 1. Pre-registration commit

1. In `GAZE-SUPPORTED-MOTION-EVIDENCE.md`, change Status to
   `**PRE-REGISTERED — no run yet.**` (keep the drafted date note or set the
   ratification date).
2. Append to `docs/world-model/WORLD-MODEL-NEXT-AUTHORITY.md` (after the
   S3-G1 result paragraph) a short paragraph: the user selected the
   gaze-supported fork; D-PROC-1MG is pre-registered in the linked doc; the
   estimand, representation and every gate value are D-PROC-1M's; only the
   observation channel differs; no production change; PASS authorises at most
   a user fork toward a motion-evidence-gated response consumer.
3. Add a `📋 D-PROC-1MG PRE-REGISTERED` block to `docs/ROADMAP.md` directly
   under the ✅ S3-G1 block (mirror the existing style, 5–8 lines).
4. Commit exactly these three docs. Message:
   `Pre-register gaze-supported temporal motion evidence`.

## 2. Implement the probe (probe-only; no src, no test changes)

Create `scripts/probes/gaze-supported-motion-evidence.ts` as a copy of
`temporal-motion-evidence.ts`, then apply exactly these deltas:

1. Header comment → experiment `D-PROC-1MG`, authority
   `GAZE-SUPPORTED-MOTION-EVIDENCE.md`.
2. `SEED_START` default → `89_000`. `experiment`/`authority` strings and the
   final `console.error` label → `D-PROC-1MG`.
3. Imports: add `chooseAttentionGaze` from `../../src/ai/attentionPolicy` and
   `type ObserverGaze` from perceptionSnapshot.
4. `FrozenState`: add `readonly acceptanceSnapshot: PerceptionSnapshot;`.
   Populate it at acceptance time with `snapshots.get(observer.gid)!` (this
   map already exists in the acceptance loop).
5. In `runArm`, thread gaze through the existing `observe()`:
   * before the loop: `let previousGaze: ObserverGaze | null = null;` and
     `let previousSnapshot: PerceptionSnapshot = state.acceptanceSnapshot;`
     plus two logs `const gazeLog: (ObserverGaze | null)[] = []` and
     `const snapshotLog: PerceptionSnapshot[] = []`;
   * inside `observe()`, first compute
     `const gaze = chooseAttentionGaze(previousSnapshot, actor.gid, previousGaze);`
     push it to `gazeLog`, validate it (same checks as
     attention-policy-foundation.ts: observer id, integer/range
     establishedTick `<= truth.tick`, unit length within `1e-9`) into
     `gazeInvalid` / `nonNormalised` counters; then call `perceiveSnapshot`
     with the gaze as its sixth argument; after the call set
     `previousGaze = gaze; previousSnapshot = snapshot;` and push the
     snapshot to `snapshotLog`;
   * after the arm loop, run the S3-G1 recompute audit: replay
     `chooseAttentionGaze` over `state.acceptanceSnapshot` + `snapshotLog`
     and count mismatches vs `gazeLog` into `recomputeMismatches`.
6. Surface the three new counters in `diagnostics` and as three new `exact`
   gates: `gazeInvalid === 0`, `nonNormalisedGaze === 0`,
   `policyRecompute === 0`. Change NOTHING else in the gate structure or
   values.
7. Keep the double-run + canonical JSON + SHA-256 tail unchanged.

## 3. Validate before running

```bash
npx tsc --noEmit                    # must be clean
npx vitest run                      # expect 92 files / 680 tests green
npm run fingerprint                 # MUST equal 57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

Any fingerprint drift means you touched production — revert and restart.

## 4. Run

```bash
npx tsx scripts/probes/gaze-supported-motion-evidence.ts > /tmp/dproc1mg.json
```

The script runs the full experiment twice and self-checks determinism. If
`deterministic` is false, debug ONLY nondeterminism sources (map iteration,
uncached state); never touch results or gates.

## 5. Write the frozen result (PASS or FAIL alike)

Append `## 5. Frozen result` to `GAZE-SUPPORTED-MOTION-EVIDENCE.md` and flip
its Status:

* PASS → `**PASS — gaze-supported motion evidence banked; consumer remains
  closed.**`
* FAIL → `**STRICT FAIL — temporal representation parked with prejudice.**`

Report in house style (compare S3-G1 §8): acceptance census, completion,
four-sample support, each movement/redirection gate with its actual count vs
frozen value, all zeros, and the SHA. State plainly which gates missed if any.
Then:

* update `WORLD-MODEL-NEXT-AUTHORITY.md` with a result paragraph (PASS: the
  open fork is a motion-evidence-gated response consumer, user decision; FAIL:
  the representation family is closed, fork returns to the user);
* flip the ROADMAP 📋 block to ✅/⛔ with the headline numbers.

## 6. Final commit and push

Stage exactly: the new probe file + the three updated docs + delete this
HANDOFF file. Message:
`Audit gaze-supported temporal motion evidence` (FAIL) or
`Add gaze-supported temporal motion evidence` (PASS).

Push to origin. If push is rejected for auth, run `gh auth switch` to the
personal account (Quarkgluonmixture) and retry.

## 7. Escalate to the user instead of improvising when

* acceptance cannot reach 96 states within 192 seeds;
* the four-sample support gate fails again (< 95%) — this is the headline
  finding either way; report it, do not tune;
* determinism cannot be restored without touching experiment logic;
* anything seems to require a `src/**` or gate-value change.

## 8. After this experiment (context for the user, not for you to start)

PASS opens exactly one fork: a pre-registered probe-local response consumer
(D-PROC-1-shaped, but reopening requires motion-phase evidence rather than a
single displacement observation). FAIL closes the three-observation
representation and returns the branch to the user with S3-G0/G1 still banked.
Either way, target-relevance selection (who deserves attention) and the coach
doctrine / familiarity layers stay separate, later, dormant-first questions.
