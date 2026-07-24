# PROGRAMME — the stepwise handoff plan (2026-07)

> **Position in the doc hierarchy:** [`VISION.md`](../VISION.md) is the gold
> standard; [`EVO-BLUEPRINT.md`](../EVO-BLUEPRINT.md), [`SUBSTRATE-MAP.md`](../SUBSTRATE-MAP.md)
> and [`PROBE-CONTRACTS.md`](../PROBE-CONTRACTS.md) govern method. This file is
> the **operational sequencing layer**: which step is next, which contract
> binds it, and what an executor session may do. It creates no new authority —
> every step defers to its own contract doc.
>
> **How to use (user):** hand an executor ONE step: *"读
> `docs/world-model/PROGRAMME.md`,执行步骤 <ID>"*. Steps marked ★ need your
> ratification (usually: you handing it over IS the ratification). Steps
> marked TBD have no contract yet — they are drafted only after their
> gate-step lands, by a planning-grade session.
>
> **How to use (executor):** read this file, then the step's contract +
> handoff docs, then execute EXACTLY that step. Do not start the next step.
> Update this file's status column in your final commit.

## 0. Where we are (context, 2026-07-24)

Banked, all dormant unless noted: M0–M4 embodied contest slice (LIVE),
S3a perception, D-PROC-0T intent privacy, S3-G0 active gaze, S3-G1
memory-guided attention. Closed with prejudice: D-ROTATE/D-INTENT/D-HANDOVER
(commander replacement, pre-gaze), C-RNG portability, static kick-vector
estimators. Full narrative: [`WORLD-MODEL-NEXT-AUTHORITY.md`](WORLD-MODEL-NEXT-AUTHORITY.md).

The three walls to VISION: **information** (nearly through), **decision
layer** (still 0 successes — but A2/D-PROC-1G moved the failure mode from
*mechanism* to *cadence*: the crux braking-vs-commitment confusion that sank
D-PROC-1 is now FIXED at 2/96, and the response works — it is merely too slow
to fire inside the live window, and the three-sample requirement attrits joint
completion; see the A2 row), **selection** (deliberately unopened). Everything
below is sequenced against those walls.

> **Self-drive status (2026-07-24, second redraw):** the user ratified wall
> attempt 4; the commander corrected its shape to D-MUT-0 (see A3 row). The
> self-drive queue is now `B1 → C1-Phase0 → A3(D-MUT-0)`, green-path rules
> unchanged. B1's acceptance and C1-Phase0's answers still stop for
> user/commander per protocol rules 4–5.

## Track A — the epistemology chain (information → decision)

| ID | Step | Contract | Status |
|----|------|----------|--------|
| A1 | D-PROC-1MG gaze-supported motion evidence | [`GAZE-SUPPORTED-MOTION-EVIDENCE.md`](GAZE-SUPPORTED-MOTION-EVIDENCE.md) | ✅ **PASS 2026-07-24** (`58d6632`): support 77.4%→100%, every 1M gate cleared, SHA `28971096…1b58` |
| A2 ★ | Motion-gated response consumer (D-PROC-1G): D-PROC-1 verbatim with two causal substitutions — gaze channel + three-sample motion-phase support predicate (braking ≠ commitment); H false-reopening ceiling `<=4/96` is the crux gate | [`MOTION-GATED-INTENT-REOPENING.md`](MOTION-GATED-INTENT-REOPENING.md) | ⛔ **STRICT FAIL — CADENCE FINDING 2026-07-24** (`80a1a848…2748`): crux gate FIXED (held false reopening 7/96→2/96), but jointly-completed 59<72 and ordered 50<56 — response works, too slow inside the 48-tick window. Family parked; no tuning; NO D-PROC-2. **Fork returns to the user (self-drive stopped).** |
| A3 ★ | Decision-layer wall, attempt 4 = **D-MUT-0 mutual motion-gated response** (attack-side entry). Commander CORRECTED the ratified fork's shape: the naive D-ROTATE re-pose is rejected by D-ROTATE-0's own anatomy (bids were 99.2% supported — observation was never the constraint; commander-gated action authority was, and its stop rule closes plain re-runs). Instead the banked 1G consumer is symmetrised: two off-ball teammates with conflicting private intents each read the other via gaze+motion evidence and each run the UNCHANGED 1G consumer — the first two-body mutual temporal process. Zero new src code; new coupled failure modes = mutual staleness + cross-player loops | [`MUTUAL-MOTION-GATED-RESPONSE.md`](MUTUAL-MOTION-GATED-RESPONSE.md) + [`HANDOFF-D-MUT-0.md`](HANDOFF-D-MUT-0.md) | **READY** (fork ratified 2026-07-24; handing over = ratifying the corrected shape) |
| A4 ★ | Relevance selection ("who deserves attention"), then coach doctrine / familiarity as separate interpretation priors — the layering Codex pinned: neither may reveal unobserved bodies | TBD | PARKED until A3 |

FAIL anywhere: the step's own stop rule binds; the fork returns to the user;
do NOT improvise a rescue or skip ahead.

## Track B — make it visible (no gameplay risk)

| ID | Step | Contract | Status |
|----|------|----------|--------|
| B1 | Perception sandbox: default-off render overlay showing a selected player's FOV cone, memory ghosts (believed vs true positions), staleness — the first time the user can SEE the world model | [`HANDOFF-PERCEPTION-SANDBOX.md`](HANDOFF-PERCEPTION-SANDBOX.md) | **READY** |
| B2 | Play-feel iteration on B1 (user-driven; small render tweaks on request) | user feedback loop, no contract needed | after B1 |

B1 is deliberately independent: it renders banked dormant machinery read-only
and can run in parallel with Track A.

## Track C — substrate slices (base + emergence, parallel-capable)

| ID | Step | Contract | Status |
|----|------|----------|--------|
| C1 ★ | Pass power as a priced choice: launch speed stops being a pure distance formula (`prediction.ts:65`); 2–3 power options per candidate pass priced by the EXISTING interception/receivability machinery; technique-scaled execution noise; receiver control difficulty already priced by M3 touch≠control. First LIVE change since M4 — six-layer PROBE-CONTRACTS treatment, user play-test is the final gate | [`PASS-POWER-SLICE.md`](PASS-POWER-SLICE.md) (draft frozen; execute after B1) | DRAFT |
| C2 ★ | Body orientation as a decision: outfield "open body / half-turn" — expose the existing capped-turn heading to the decision layer symmetrically (receive AND defend), gene/attr-priced. The S3-G0 twin: gaze freed the eyes; this frees the shoulders | **TBD — draft after C1 lands** (same convex-option-inflation risk family) | TBD |
| C3 | 假动作/feints: **NOT a buildable step — do not hand-code.** Deception becomes selectable only when opponents act on observed evidence at a cost (A1+A2) and the body can express misdirection (C2). When those land, feinting is an EVOLUTION observation, not a mechanic. Any session proposing a feint mechanic violates the soul — refuse | doctrine note only | GUARD |

## Self-drive protocol (2026-07-24, user-delegated)

Roles: **user** = play-test authority + final say on anything live/visible;
**commander** = the planning-grade session (Fable) that drafts every contract
and redraws the map on FAIL; **executor** = the session running one step.

The executor SELF-DRIVES — after landing a step it proceeds to the next READY
step in queue order (currently `A2 → B1 → C1-Phase0`) — as long as the step
ended on the green path: verdict PASS (or the step's defined report-back),
all red lines held, result + status pushed.

The executor STOPS and reports (to the commander via the user) when:

1. **any verdict other than PASS** — FAIL / CHANNEL-INVALID / cadence
   finding / §2-band break: authority has been reshaped; only the commander
   drafts what follows;
2. **the next step has no contract** (TBD rows) — executors never author or
   modify a pre-registration, ever;
3. **a hard escalation trigger fires** (contract-specific list: src/** seems
   to need changing, gate values look wrong after results, determinism
   unrestorable, acceptance/seed shortfall, fingerprint drift);
4. **a designed report-back is reached** (e.g. C1 Phase 0 answers) — that
   report goes to the commander before any code;
5. **a user-gate is reached** — B1 render acceptance and any live-gameplay
   ship/revert (C1 Phase 2) belong to the USER's eyes, never delegated.

★ semantics under self-drive: the user's standing delegation lets the
commander ratify routine experiment forks (A2-style: same family, gates
inherited, dormant-only). The user personally keeps: opening the selection/
ecology wall (A3 and beyond), anything that ships into the live game, and
anything that changes what they watch.

Reporting medium = the repo itself (frozen result sections + this file's
status column + ROADMAP blocks) plus the executor's final message. One step
per commit-pair; never two experiments in flight at once.

## Governance (binds every executor session)

1. One step per session. Read the step's contract fully before touching code.
2. **Coordination rule:** Track C changes live mechanics → land only BETWEEN
   Track A experiments, never while one is mid-flight; every frozen result
   records the HEAD it ran at. After any live change: re-run
   `npm run fingerprint` + perf baseline and record both in the landing doc.
3. Escalate instead of improvising when: a contract seems to require a
   `src/**` change it doesn't authorise; any frozen gate value looks wrong
   AFTER seeing results (it isn't — report the FAIL); acceptance/seeds can't
   complete; determinism breaks; §2 equilibrium moves outside a C-contract's
   stated band.
4. Never `git add -A`. Stage explicit paths. Two-commit pattern for
   pre-registered experiments (pre-register, then implement+result).
5. Model guidance: Track A = Opus med (discipline over creativity); B1 =
   Sonnet acceptable (user judges pixels); C1 = Opus med+high (live-balance
   risk). FAIL write-ups that reshape authority → strongest available model.
6. Update the status column here + the ROADMAP block in the same commit as
   the step's result. Delete a step's HANDOFF file in its final commit.

## Sequence at a glance

```text
now ──► A1 (1MG) ──► A2 draft ★ ──► A2 ──► A3 ★ (decision wall, attempt 4)
   └──► B1 (sandbox, parallel) ──► B2 play-feel
   └──► C1 ★ (pass power, lands between A-steps) ──► C2 ★ ──► (C3 emerges)
```

The visible-payoff promise this programme makes: B1 within days; the first
surviving live perception consumer = A-chain × C-chain convergence, weeks;
emergent deception/tactics = after the decision wall falls, months. If any
wall resists three more contracts, the fork returns to the user rather than
grinding the same family.
