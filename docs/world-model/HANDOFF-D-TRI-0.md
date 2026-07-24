# HANDOFF — execute D-TRI-0 (for the implementing agent)

> Written 2026-07-24 by the commander. The user handing you this step IS the
> ratification. **Delete this file in the final commit.**

## 0. Load first, in order

1. `docs/world-model/THREE-BODY-CHAIN-RESPONSE.md` — the contract; flip to
   PRE-REGISTERED in step 1.
2. `docs/world-model/MUTUAL-MOTION-GATED-RESPONSE.md` §7 — the numbers your
   gates derive from.
3. `docs/world-model/DUAL-TARGET-ATTENTION-SCHEDULE.md` §5 + §9 — the
   alternation policy you splice in and the ¾ pricing rationale.
4. Code: `scripts/probes/mutual-motion-gated-response.ts` (copy base),
   `scripts/probes/dual-target-attention-schedule.ts` (alternation splice).

House rules: **zero `src/**` changes** (B's hypothesis-union and the
alternation schedule are probe-level composition); no gate/seed/window/
alternation-period changes after first sight of 92k; sampling budget 2048 is
pre-authorised and is NOT a gate — if 96 states still don't arrive, record
the census and STOP (that is an acceptance-rarity escalation, not a budget
one); no `git add -A`; two-commit pattern.

## 1. Pre-registration commit

Flip the contract Status; append to `WORLD-MODEL-NEXT-AUTHORITY.md` (after
the S3-G2 paragraph): D-TRI-0 pre-registered as S3-G2's single authorised
continuation — chain not cluster (isolates dual attention at its minimal
seat, B), gates derived from D-MUT-0's banked numbers with S3-G2's
three-quarters pricing; add the `📋 D-TRI-0 PRE-REGISTERED` ROADMAP block.
Commit: `Pre-register three-body chain-conflict response`.

## 2. Implement `scripts/probes/three-body-chain-response.ts`

Copy the D-MUT probe, then:

* seeds default `92_000`, budget `2048`; strings `D-TRI-0` /
  `THREE-BODY-CHAIN-RESPONSE`;
* acceptance → the §3 chain geometry (three runners, pairwise bands on A–B
  and B–C, alternatives per §3, all-observe-carrier, B observes both);
* B's gaze = the S3-G2 alternation (8-tick switch, one-tick latency) spliced
  from the dual-attention probe; A and C keep the D-MUT single-target gaze;
* B maintains TWO motion histories and TWO belief supports; B's conflict
  test and replacement admissibility use the UNION of both supported sets;
  A and C are unchanged D-MUT consumers against B;
* metrics per contract §4 incl. the reported-not-gated diagnostics (resolver
  pattern, cascade events, stale-belief revisions, final geometry spread);
* purity audits × three observers (B's recompute replays the alternation
  deterministically); keep the double-run + canonical JSON + SHA tail.

## 3. Validate, run, report

```bash
npx tsc --noEmit && npx vitest run     # green, no new tests expected
npm run fingerprint                     # 57b0bdab…c673 exact
npx tsx scripts/probes/three-body-chain-response.ts > /tmp/dtri0.json
```

Write `## 6. Frozen result` (PASS or FAIL — on FAIL name the axis per §5),
update AUTHORITY + ROADMAP + PROGRAMME (A5 row), delete this file, commit
(`Add three-body chain response` / `Audit three-body chain response`), push.

## 4. Escalate instead of improvising when

* any `src/**` edit seems needed; acceptance stalls even at budget 2048;
  determinism breaks; any frozen value looks wrong after results;
* per protocol: any non-PASS verdict stops the queue for the commander.
