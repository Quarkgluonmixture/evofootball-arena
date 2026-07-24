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
layer** (**first brick landed 2026-07-24** — A3/D-MUT-0 PASSED: two bodies
resolve a private conflict through observation alone, 76.9% resolved, no
commander and no communication. The road here: A2/D-PROC-1G fixed the
braking-vs-commitment confusion that sank D-PROC-1 (2/96) but was too slow
inside a unilateral 0.8s window; symmetrising it — where resolution needs only
ONE party to fire — cleared the cadence problem), **selection** (deliberately
unopened). Everything below is sequenced against those walls.

## 0.5 Direction (commander deep-think, 2026-07-24)

**Two engines of emergence.** Track A builds the information→decision
substrate (who sees what, believes what, responds how) — *tactics* live
there. Track C builds the craft-choice substrate (pass weight, body shape,
aerial timing, one-touch vs control) — *style* lives there. VISION needs
both, and they must go LIVE together: S3b proved one-sided live perception
fails at PAYS, and the vision-attr saga proved read/craft upgrades inflate
goals unless attack and defence co-evolve.

**The cadence reframe.** D-PROC-1G measured pure-evidence response at
~0.3–0.5s. Real players act faster — on PRIORS, not on accumulated evidence.
That is exactly what A4's layers are FOR, causally: coach doctrine = shared
priors that let a player act safely on less evidence; familiarity = faster,
stabler interpretation of the same external cues. Neither may reveal an
unobserved body — they buy LATENCY, not information. D-MUT-0 measures how far
pure evidence gets; whatever gap remains to football-speed coordination is
the quantified value of doctrine/familiarity when A4 opens. The cadence
finding was not a setback; it located the causal seat of coaching.

**The integration milestone** (first visible VISION moment): an **Embodied
Decision Slice** — one live, co-evolved bundle: perception-based pass choice
(the S3b redo, both sides reading), pass power (C1), first-touch decision
(C5), shipped only through six-layer + §2 band + user play-test. Until that
bundle survives PAYS, everything stays dormant by design; after it, the
discovery archive and "understand" UI (Track D4/D5) stop being fiction.

**Sequencing instinct:** when in doubt, prefer the step that (a) closes a
causal gap a prior FAIL named, (b) reuses banked machinery, (c) keeps the
live baseline untouched. That instinct produced S3-G0→G1→1MG→1G→D-MUT; it
generalises.

> **Self-drive status (2026-07-24, autonomous run COMPLETE — queue drained to
> user gates).** The delegated queue `ship B1 + apply B2 → C1-Phase0 →
> A3(D-MUT-0)` was executed in one session: B1 shipped, B2 applied,
> C1-Phase0 answered (drafted Phase-2 shape refuted; fork in the contract's
> §7), A3 **PASSED** — the decision-layer wall's first brick.
>
> **COMMANDER RULING on the three open forks (2026-07-24, pending the user's
> one-word ratification — on it, the autonomous queue below unlocks):**
>
> 1. **A3 fork → three-body direction, entered via S3-G2 first.** D-MUT's own
>    data locates the next constraint: all 15 unresolved states were mutual-
>    staleness safe-fails, and S3-G1 banked SINGLE-target attention only. A
>    three-body process makes every player track TWO moving partners with one
>    gaze — attention scheduling becomes the binding constraint before any
>    rotation shape can be honest. Ladder: **S3-G2** (dual-target interleaved
>    attention gate: can alternating memory-guided gaze sustain qualified
>    evidence on two moving targets? same G-series pattern, ceiling arm,
>    frozen support gates derived from S3-G1/1MG numbers) → **D-TRI-0**
>    (three-body rotation-shaped mutual response, gates derived from D-MUT's
>    banked numbers). Autonomous session drafts both contracts in that order
>    under pre-registration discipline.
> 2. **C1 fork → C1-A now (dormant, autonomous), C1-B GO as the next LIVE
>    slice** (user play-test gate at the end stays): honest speed-dependent
>    control cost is a standalone substrate-truth fix (heavy balls barely
>    cost anything today — the +0.07 raw term saturates at 14 m/s) and is the
>    prerequisite for the ENTIRE craft engine (C1-C, C5 both need reception
>    cost to be real). Six-layer + §2 band + paired A/B, narrow slice, lands
>    between Track-A experiments. **C1-C is DEFERRED into the Embodied
>    Decision Slice** — teaching the evaluator to price time/speed belongs to
>    the S3b-redo bundle, not a patch on `laneOpenness`.
> 3. **D1 GO, parallel, Sonnet-tier** — pure UI, user's eyes accept.
>
> Recommended queue on ratification: `C1-A → S3-G2 → C1-B(≤user play-test) →
> D-TRI-0`, D1 parallel. B2's render: user looks whenever; small tweaks only.
>
> **RATIFIED by the user 2026-07-24** ("按指挥官裁决继续"). Queue is live and the
> autonomous session drafts S3-G2 then D-TRI-0 under pre-registration
> discipline. Progress of this run is tracked in the track tables below.

## Track A — the epistemology chain (information → decision)

| ID | Step | Contract | Status |
|----|------|----------|--------|
| A1 | D-PROC-1MG gaze-supported motion evidence | [`GAZE-SUPPORTED-MOTION-EVIDENCE.md`](GAZE-SUPPORTED-MOTION-EVIDENCE.md) | ✅ **PASS 2026-07-24** (`58d6632`): support 77.4%→100%, every 1M gate cleared, SHA `28971096…1b58` |
| A2 ★ | Motion-gated response consumer (D-PROC-1G): D-PROC-1 verbatim with two causal substitutions — gaze channel + three-sample motion-phase support predicate (braking ≠ commitment); H false-reopening ceiling `<=4/96` is the crux gate | [`MOTION-GATED-INTENT-REOPENING.md`](MOTION-GATED-INTENT-REOPENING.md) | ⛔ **STRICT FAIL — CADENCE FINDING 2026-07-24** (`80a1a848…2748`): crux gate FIXED (held false reopening 7/96→2/96), but jointly-completed 59<72 and ordered 50<56 — response works, too slow inside the 48-tick window. Family parked; no tuning; NO D-PROC-2. **Fork returns to the user (self-drive stopped).** |
| A3 ★ | Decision-layer wall, attempt 4 = **D-MUT-0 mutual motion-gated response** (attack-side entry). Commander CORRECTED the ratified fork's shape: the naive D-ROTATE re-pose is rejected by D-ROTATE-0's own anatomy (bids were 99.2% supported — observation was never the constraint; commander-gated action authority was, and its stop rule closes plain re-runs). Instead the banked 1G consumer is symmetrised: two off-ball teammates with conflicting private intents each read the other via gaze+motion evidence and each run the UNCHANGED 1G consumer — the first two-body mutual temporal process. Zero new src code; new coupled failure modes = mutual staleness + cross-player loops | [`MUTUAL-MOTION-GATED-RESPONSE.md`](MUTUAL-MOTION-GATED-RESPONSE.md) §7 | ✅ **PASS 2026-07-24 — THE WALL'S FIRST BRICK** (SHA `16e3867a…0097`, twice byte-identical, 96/96 accepted, zero `src/**` changes, fingerprint unchanged): materiality 65/65, **resolved 50/65 = 76.9%** (≥60%), progress 78.6%, combined revisions max 2, per-player max 1, zero cycles, gaze purity zero for BOTH observers. Cross-player loops absent; mutual staleness fails SAFE (all 15 unresolved states had zero revisions, honest retention). 20 states resolved with BOTH players revising. **Fork is the USER's** (§6): three-body extension, or bank and pivot to B/C |
| A4 ★ | Relevance selection ("who deserves attention"), then coach doctrine / familiarity as separate interpretation priors — the layering Codex pinned: neither may reveal unobserved bodies | TBD | **UNBLOCKED by A3's PASS, awaiting the user's fork choice.** A3 §6 authorises exactly one continuation (three-body extension, or bank + pivot to B/C); A4 itself still needs a contract, which no executor may author |

FAIL anywhere: the step's own stop rule binds; the fork returns to the user;
do NOT improvise a rescue or skip ahead.

## Track B — make it visible (no gameplay risk)

| ID | Step | Contract | Status |
|----|------|----------|--------|
| B1 | Perception sandbox: default-off render overlay (`src/render3d/PerceptionSandbox3D.ts`) | handoff consumed (ROADMAP B1 block) | ✅ **SHIPPED 2026-07-24** (user gate waived): tsc + build clean, 697/697, fingerprint exact `57b0bdab…c673` ⇒ render-only proven. B2 respec applies on top |
| B2 | Exception-based rendering respec, grounded in `scripts/probes/perception-divergence-census.ts` data (at awareness 0.8: mean ghost error 0.45m ≈ 0.7% of pitch length, 9 near-truth ghosts/tick = ink without signal): ① render ONLY divergence — ghosts with error > 1m (8.6%), facts older than 15 ticks, an explicit warning marker for absent-but-within-12m bodies (0.27/tick, the real drama), lost/stale ball; hide the ~90% that matches truth; ② draw the ~106° rear BLIND wedge instead of the 254° cone; ③ prominent awareness 0.2↔0.8 toggle (at 0.2: 5 missing bodies, 28% lost ball — the legible contrast). Non-blocking; the user looks later | commander spec (this row) | ✅ **APPLIED 2026-07-24** (all three parts; thresholds are the census' own `ERR_M 1` / `STALE_TICKS 15` / `NEAR_RADIUS 12`; awareness chip lives in the overlay itself and rebuilds memory on switch). tsc + build clean, 697/697, fingerprint exact. **User looks whenever they like** — feedback = small render tweaks, no new step needed |

B1 is deliberately independent: it renders banked dormant machinery read-only
and can run in parallel with Track A.

## Track C — substrate slices (base + emergence, parallel-capable)

| ID | Step | Contract | Status |
|----|------|----------|--------|
| C1 ★ | Pass power as a priced choice: launch speed stops being a pure distance formula (`prediction.ts:65`); 2–3 power options per candidate pass priced by the EXISTING interception/receivability machinery; technique-scaled execution noise; receiver control difficulty already priced by M3 touch≠control. First LIVE change since M4 — six-layer PROBE-CONTRACTS treatment, user play-test is the final gate | [`PASS-POWER-SLICE.md`](PASS-POWER-SLICE.md) §6–7 | ⚠️ **PHASE 0 DONE 2026-07-24 — premise survives, drafted Phase-2 shape REFUTED.** The power seat already exists (`orientationPowerMul` scales both lead and launch, `mechanics.ts:288-298`) and reception cost is real but weak (+0.010…+0.029 pFail for a 1.15 ball at 15m vs −17% flight time, and interceptors get demoted to deflections) — but the live evaluator (`laneOpenness`/`opennessOf`) is entirely **speed-blind**, so 2–3 power options score IDENTICALLY: the FIRES gate fails by construction. Fork in §7: **C1-A** dormant plumbing + noise + anatomy probe (bit-identical, authorised by §3) → **C1-B** honest speed-dependent M3 control cost (LIVE, user gate) → **C1-C** choice layer redrawn on C1-B's ledger (needs its own pre-registration) |
| C2 ★ | Body orientation as a decision: outfield "open body / half-turn" — expose the existing capped-turn heading to the decision layer symmetrically (receive AND defend), gene/attr-priced. The S3-G0 twin: gaze freed the eyes; this frees the shoulders | **TBD — draft after C1 lands** (same convex-option-inflation risk family) | TBD |
| C3 | 假动作/feints: **NOT a buildable step — do not hand-code.** Deception becomes selectable only when opponents act on observed evidence at a cost (A1+A2) and the body can express misdirection (C2). When those land, feinting is an EVOLUTION observation, not a mechanic. Any session proposing a feint mechanic violates the soul — refuse | doctrine note only | GUARD |
| C4 ★ | Aerial contest as an embodied process: jump timing / arrival / body position contesting the ball in the air, replacing scan-who-is-already-in-the-box resolution. MUST sequence with the pinned open-play box-arrival gap (crosses currently find nobody ~50% `noAerial` — a duel model without arrivals has nothing to contest) | **TBD — Phase-0 discovery contract first** (map current header/cross resolution with file:line evidence, C1-style report-back) | TBD |
| C5 ★ | First-touch decision: one-touch layoff vs control-first as a priced choice — faster-but-noisier vs slower-but-safer, priced by the EXISTING evaluators, technique-scaled execution noise; M3 touch≠control is the substrate seat (the honest-reverted M3b 忠于脚 gap is adjacent, separate) | **TBD — draft after C1 lands** (same template) | TBD |

**C-track template** (proven shape from C1; user's standing rule 2026-07-24:
"球员自己选择传球力度、空中争抢、停球是直接一脚给队友还是自己停——这些
职业足球的内容应该在底座下涌现"): Phase-0 code-map with file:line evidence
→ honest two-sided consequence in the substrate (benefit AND cost both real)
→ options priced by EXISTING evaluators, never a hand-written "when to X"
rule → technique/attr-scaled execution noise → six-layer acceptance + §2
equilibrium band + user play-test. Craft dimensions become choices; usage
patterns become evolution's discovery.

## Track D — world-observatory UI (no sim contact, Sonnet-friendly)

Direction doc: [`../UI-NORTHSTAR.md`](../UI-NORTHSTAR.md) (commander-curated
from the user's + GPT's direction; events/time/lineage/evidence thesis
adopted, behavior-narrative pages DEFERRED until the behaviors exist).

| ID | Step | Contract | Status |
|----|------|----------|--------|
| D1 | Shell split: world-mode pages drop the match side-columns (floating mini-player instead); match-mode unchanged | UI-NORTHSTAR §全盘采纳 1 | READY (after B1 ships) |
| D2 | Evolution scatter: season trails + ghost points + hover/lock + generation slider | UI-NORTHSTAR §全盘采纳 2 | READY (after D1) |
| D3 ★ | WorldEvent v0 (honest event set only — champions/streaks/records/style-drift/ELO turns/counter flips) + world home + Dynasty Ribbon; every event carries real telemetry evidence, candidate→confirmed lifecycle | UI-NORTHSTAR §带纪律采纳 | TBD — commander drafts the event-detector contract before any narrative UI |
| D4 | Behavior discovery archive | — | LOCKED until Track A is live in players |
| D5 | Causal replay / counterfactual mode | — | LOCKED until counterfactual authority is productised |

Track D rules: zero sim contact (fingerprint gate every step), acceptance =
the user's eyes, never displaces a Track A experiment slot, and no narrative
number may appear without a real detector behind it.

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

### Autonomous mode (2026-07-24, Fable-grade executor)

The user may hand this programme to a single strong session (Opus 5 /
Fable-grade) that holds BOTH roles — executor and working commander. Under
autonomous mode that session may additionally:

* **draft new contracts**, but only within the existing tracks and under the
  full pre-registration discipline: the contract commits with frozen gates
  BEFORE any implementation (two-commit pattern), gate values derive from
  banked numbers or prior contracts with stated reasoning, stop rules bind,
  and nothing is ever tuned after first sight of results;
* **redraw after honest FAILs** the way the commander has — including
  rejecting a doomed re-pose on a prior experiment's own anatomy (the
  D-ROTATE lesson: read the closed experiment's stop rule and failure
  diagnosis BEFORE proposing its successor);
* **judge C-track Phase-0 report-backs** against the C-track template.

It still STOPS for the user on: anything that ships into the live game
(§2-band changes, fingerprint-moving merges, play-test acceptance),
opening the selection/ecology wall, restructuring or abandoning a track,
and everything marked LOCKED here or in UI-NORTHSTAR. Doc discipline is
unchanged: every session starts by reading this file top to bottom, ends by
updating it, and the authority chain (contract docs + ROADMAP +
WORLD-MODEL-NEXT-AUTHORITY) remains the single source of truth.

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
