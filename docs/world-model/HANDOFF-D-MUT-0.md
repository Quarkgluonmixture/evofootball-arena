# HANDOFF — execute D-MUT-0 (for the implementing agent)

> Written 2026-07-24 by the commander. The user handing you this step IS the
> ratification. **Delete this file in the final commit.**

## 0. Context to load first (in this order)

1. `docs/world-model/MUTUAL-MOTION-GATED-RESPONSE.md` — the contract. Flip
   Status to PRE-REGISTERED in step 1.
2. `docs/world-model/MOTION-GATED-INTENT-REOPENING.md` — D-PROC-1G, whose
   consumer, gaze threading, purity audits and gate vocabulary you inherit.
3. Code: `scripts/probes/motion-gated-intent-reopening.ts` (the copy base —
   it already contains gaze threading, the gated predicate and the audits),
   `src/ai/motionGatedIntentResponse.ts`, `src/ai/intentResponse.ts`,
   `src/ai/motionEvidence.ts`, `src/ai/attentionPolicy.ts` (ALL consumed
   unchanged).

House rules: **zero `src/**` changes of any kind this time** (the mutual
configuration is probe-level composition — two consumer instances); no gate/
seed/window changes after first sight of 91k; no `git add -A`; two-commit
pattern.

## 1. Pre-registration commit

1. Flip the contract Status to `**PRE-REGISTERED — no run yet.**`
2. Append to `WORLD-MODEL-NEXT-AUTHORITY.md` after the D-PROC-1G paragraph:
   the user ratified wall attempt 4; the commander rejected the naive
   D-ROTATE re-pose on its own anatomy (bids were 99.2% supported —
   observation was never the constraint; action authority was) and the
   corrected shape is D-MUT-0: the banked 1G consumer symmetrised into the
   first two-body mutual temporal process, attack-side, probe-only.
3. Add a `📋 D-MUT-0 PRE-REGISTERED` block to `docs/ROADMAP.md` under the
   D-PROC-1G ⛔ block.
4. Commit the three docs: `Pre-register mutual motion-gated response`.

## 2. Implement `scripts/probes/mutual-motion-gated-response.ts`

Copy `motion-gated-intent-reopening.ts`, then:

* seeds default `91_000`; strings `D-MUT-0` / `MUTUAL-MOTION-GATED-RESPONSE`;
* arms H/I/C → **N** (both consumers disabled) and **M** (both enabled);
  N/M byte-identical until M's first reopening (reuse the I/C equality
  audit);
* acceptance per contract §3: same-team non-GK A and B of a stable carrier,
  separation `(5, 30]`, each observing the other AND the carrier; ≥5 finite
  onside O0 candidates each; auditor-frozen committed intents whose targets
  lie within `PLAYER_MIN_DIST` of each other; ≥3 alternatives each farther
  than `PLAYER_MIN_DIST` from the other's initial target; freeze BOTH
  acceptance snapshots and BOTH memories;
* pins: carrier `HoldPosition`; A and B `MoveToPoint` on their intent
  targets, infinite timers; all others live;
* per tick in both arms, BOTH players thread gaze at each other (one-tick
  latency, previous-gaze fallback, per-observer gaze/snapshot logs, post-arm
  recompute audit, validity/normalisation counters — all duplicated per
  observer);
* in M, each player runs the UNCHANGED motion-gated consumer against the
  other (partner's frozen candidate set = the hypothesis space, exactly as
  1G used A's); revisions repin that player's `MoveToPoint` to the committed
  replacement — through the same intent-transaction lifecycle as 1G, never a
  direct body write;
* metrics per contract §4: materiality (N final vs initial A–B truth
  distance), resolution (M: targets separated ≥ `PLAYER_MIN_DIST` in truth
  at window end with ≥1 consumer-committed replacement), progress ≥0.25m per
  revision, combined revisions ≤4, per-player anti-oscillation zeros,
  responder-share diagnostic, abort census;
* keep the double-run + canonical JSON + SHA-256 tail.

## 3. Validate, run, report

```bash
npx tsc --noEmit && npx vitest run        # green, no new tests expected
npm run fingerprint                        # 57b0bdab…c673, unchanged
npx tsx scripts/probes/mutual-motion-gated-response.ts > /tmp/dmut0.json
```

Write `## 7. Frozen result` (PASS or FAIL alike — on FAIL name WHICH coupled
failure per contract §6), update AUTHORITY + ROADMAP (📋→✅/⛔) +
PROGRAMME.md A3 row, delete this file, commit
(`Add mutual motion-gated response` / `Audit mutual motion-gated response`),
push.

## 4. Escalate instead of improvising when

* any `src/**` edit seems needed (this experiment authorises none);
* acceptance cannot reach 96 in 192 seeds, or mutual-conflict states are so
  rare the acceptance loop stalls — report the census, do not relax geometry;
* determinism breaks; a gate looks wrong after results (it is frozen);
* per self-drive protocol: any non-PASS verdict stops the queue and returns
  to the commander.
